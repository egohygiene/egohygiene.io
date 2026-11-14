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

test("asset references and public-directory copies cannot bypass the private module boundary", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "playground-assets-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const experiments = path.join(root, "private");
  await mkdir(experiments);
  await writeFile(path.join(root, "index.html"), '<script type="module" src="/entry.js"></script>');
  for (const payload of ["PRIVATE_INLINE_CANARY", "PRIVATE_ASSET_CANARY".repeat(500)]) {
    await writeFile(path.join(experiments, "private.txt"), payload);
    for (const suffix of ["", "?inline", "?no-inline"]) {
      await writeFile(
        path.join(root, "entry.js"),
        `globalThis.asset = new URL("./private/private.txt${suffix}", import.meta.url).href;`,
      );
      await assert.rejects(
        build({
          root,
          configFile: false,
          logLevel: "silent",
          plugins: [excludePlayground(experiments)],
          build: { write: false },
        }),
        /private playground/u,
      );
    }
    await writeFile(path.join(root, "entry.js"), 'import "./style.css";');
    await writeFile(
      path.join(root, "style.css"),
      'body { background: url("./private/private.txt?inline"); }',
    );
    await assert.rejects(
      build({
        root,
        configFile: false,
        logLevel: "silent",
        plugins: [excludePlayground(experiments)],
        build: { write: false },
      }),
      /private playground/u,
    );
  }
  await writeFile(path.join(root, "index.html"), '<script type="module" src="/entry.ts"></script>');
  await writeFile(
    path.join(root, "entry.ts"),
    'globalThis.asset = new URL(("./private/private.txt" as string), (import.meta.url as string)).href;',
  );
  await assert.rejects(
    build({
      root,
      configFile: false,
      logLevel: "silent",
      plugins: [excludePlayground(experiments)],
      build: { write: false },
    }),
    /private playground/u,
  );
  await writeFile(
    path.join(root, "entry.ts"),
    'const name = "private"; globalThis.asset = new URL(`./private/${name}.txt`, import.meta.url).href;',
  );
  await assert.rejects(
    build({
      root,
      configFile: false,
      logLevel: "silent",
      plugins: [excludePlayground(experiments)],
      build: { write: false },
    }),
    /private playground/u,
  );
  await writeFile(path.join(root, "index.html"), '<script type="module" src="/entry.js"></script>');
  await writeFile(path.join(root, "entry.js"), "globalThis.safe = true;");
  await assert.rejects(
    build({
      root,
      publicDir: experiments,
      configFile: false,
      logLevel: "silent",
      plugins: [excludePlayground(experiments)],
      build: { write: false },
    }),
    /private playground/u,
  );
  await mkdir(path.join(root, "public"));
  await symlink(path.join(experiments, "private.txt"), path.join(root, "public/private.txt"));
  await assert.rejects(
    build({
      root,
      configFile: false,
      logLevel: "silent",
      plugins: [excludePlayground(experiments)],
      build: { write: false },
    }),
    /private playground/u,
  );
});

test("HTML attributes, srcset and inline CSS cannot inline private source bytes", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "playground-html-assets-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const experiments = path.join(root, "private");
  await mkdir(experiments);
  for (const size of [1, 500]) {
    await writeFile(
      path.join(experiments, "private.svg"),
      `<svg xmlns="http://www.w3.org/2000/svg"><text>${"PRIVATE_HTML_CANARY".repeat(size)}</text></svg>`,
    );
    for (const suffix of ["", "?inline", "?no-inline"]) {
      for (const markup of [
        `<img src="./private/private.svg${suffix}">`,
        `<img srcset="./private/private.svg${suffix} 1x">`,
        `<link rel="preload" as="image" imagesrcset="./private/private.svg${suffix} 1x">`,
        `<img src="./pri&#118;ate/private.svg${suffix}">`,
        `<div style="background:url('./private/private.svg${suffix}')"></div>`,
        `<style>body{background:url('./private/private.svg${suffix}')}</style>`,
        `<script type="module">globalThis.asset = new URL('./private/private.svg${suffix}', import.meta.url).href;</script>`,
      ]) {
        await writeFile(path.join(root, "index.html"), markup);
        await assert.rejects(
          build({
            root,
            configFile: false,
            logLevel: "silent",
            plugins: [excludePlayground(experiments)],
            build: { write: false },
          }),
          /private playground/u,
        );
      }
    }
  }
  const publicSvg = '<svg xmlns="http://www.w3.org/2000/svg"><text>PUBLIC_HTML_CANARY</text></svg>';
  await writeFile(path.join(root, "public.svg"), publicSvg);
  await writeFile(path.join(root, "index.html"), '<img src="./public.svg">');
  const safe = await build({
    root,
    configFile: false,
    logLevel: "silent",
    plugins: [excludePlayground(experiments)],
    build: { write: false },
  });
  assert.ok(JSON.stringify(safe).includes(Buffer.from(publicSvg).toString("base64")));
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
