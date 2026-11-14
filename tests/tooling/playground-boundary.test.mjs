import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { build, createServer } from "vite";

import playgroundConfig from "../../apps/playground/vite.config.ts";
import { excludePlayground } from "../../scripts/vite-playground-boundary.mts";

test("public build rejects direct, transitive and symlinked experiment imports", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "playground-boundary-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const experiments = path.join(root, "private");
  await mkdir(experiments);
  await writeFile(
    path.join(experiments, "experiment.js"),
    'globalThis.privateExperiment = "PRIVATE_CANARY";',
  );
  await writeFile(path.join(root, "index.html"), '<script type="module" src="/entry.js"></script>');
  await writeFile(path.join(root, "indirect.js"), 'import "./private/experiment.js";');
  await symlink(path.join(experiments, "experiment.js"), path.join(root, "alias.js"));
  for (const imported of ["./private/experiment.js", "./indirect.js", "./alias.js"]) {
    await writeFile(path.join(root, "entry.js"), `import ${JSON.stringify(imported)};`);
    await assert.rejects(
      build({
        root,
        configFile: false,
        logLevel: "silent",
        plugins: [excludePlayground(experiments)],
        build: { write: false },
      }),
      /Public applications cannot import private playground modules/u,
    );
  }
  await writeFile(path.join(root, "entry.js"), 'globalThis.publicCanary = "PUBLIC_CANARY";');
  const output = await build({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [excludePlayground(experiments)],
    build: { write: false },
  });
  assert.match(JSON.stringify(output), /PUBLIC_CANARY/u);
  assert.doesNotMatch(JSON.stringify(output), /PRIVATE_CANARY/u);
});

test("actual local playground responses discourage indexing without claiming access control", async (t) => {
  const server = await createServer({
    ...playgroundConfig,
    root: path.resolve("apps/playground"),
    configFile: false,
    logLevel: "silent",
    server: { ...playgroundConfig.server, port: 0, strictPort: false },
  });
  t.after(() => server.close());
  await server.listen();
  const address = server.httpServer.address();
  assert.equal(address.address, "127.0.0.1");
  const base = `http://127.0.0.1:${address.port}`;
  const response = await fetch(base);
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow, noarchive");
  assert.match(await response.text(), /name="robots" content="noindex,nofollow,noarchive"/u);
  assert.match(await (await fetch(`${base}/robots.txt`)).text(), /Disallow: \/\s*$/u);
  assert.equal(playgroundConfig.preview.host, "127.0.0.1");
  assert.equal(playgroundConfig.preview.headers["X-Robots-Tag"], "noindex, nofollow, noarchive");
});
