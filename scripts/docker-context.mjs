import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { lstat, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const digest = (value) => createHash("sha256").update(value).digest("hex");
const website = "apps/egohygiene.io";
const buildScripts = [
  "build-public-site.mts",
  "public-site-output.mts",
  "store-catalog.mts",
  "vite-store-catalog.mts",
  "vite-public-pages.mts",
];
const requiredFiles = [
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "tsconfig.base.json",
  ".tool-versions",
  `${website}/index.html`,
  `${website}/vite.config.ts`,
  `${website}/tsconfig.app.json`,
  `${website}/src/main.tsx`,
  `${website}/public/fonts/NOTICE.txt`,
  `${website}/public/icons/NOTICE.txt`,
  "infra/docker/Dockerfile",
  "infra/caddy/Caddyfile",
  ...buildScripts.map((file) => `scripts/${file}`),
];

async function workspaceManifests(root) {
  const files = [];
  for (const group of ["apps", "packages"]) {
    for (const entry of await readdir(path.join(root, group), { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const file = `${group}/${entry.name}/package.json`;
      try {
        await lstat(path.join(root, file));
        files.push(file);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
  }
  return files.sort();
}

async function filesIn(directory) {
  assert.ok((await lstat(directory)).isDirectory(), "Context export must be a real directory");
  const files = [];
  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      assert.ok(!entry.isSymbolicLink(), "Context export must not contain symbolic links");
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else {
        assert.ok(entry.isFile(), "Context export must contain regular files only");
        files.push(path.relative(directory, absolute).split(path.sep).join("/"));
      }
    }
  }
  await visit(directory);
  return files.sort();
}

function forbidden(file) {
  if (file === ".tool-versions") return false;
  const parts = file.split("/");
  return (
    parts.some(
      (part) =>
        part.startsWith(".") ||
        /^(?:node_modules|dist|dist-preview|dist-node|coverage|test-results|playwright-report|storybook-static|tests?|__tests__|__snapshots__|private|secrets|credentials|masters|private-artwork|business-records)$/i.test(
          part,
        ),
    ) ||
    /\.(?:env(?:\.[^/]+)?|key|pem|p12|pfx|crt|cer|zip|tar|gz|tgz|md|map|tsbuildinfo|psd|psb|kra|xcf|afdesign|afphoto|ai)$/i.test(
      file,
    ) ||
    /\.(?:test|spec|stories)\.[^/]+$/i.test(file) ||
    /(?:^|\/)README(?:\.[^/]*)?$/i.test(file)
  );
}

/** Inspect a real Docker context export. This is not an implementation of Docker ignore rules. */
export async function inspectDockerContext(root, exportedDirectory) {
  const files = await filesIn(exportedDirectory);
  const manifests = await workspaceManifests(root);
  const required = [...requiredFiles, ...manifests];
  for (const file of required)
    assert.ok(files.includes(file), `Docker context is missing required build input: ${file}`);
  const packageNames = new Set(
    manifests.filter((file) => file.startsWith("packages/")).map((file) => file.split("/")[1]),
  );
  const hashes = {};
  for (const file of files) {
    assert.ok(!forbidden(file), `Docker context contains an excluded file category: ${file}`);
    const parts = file.split("/");
    const allowedArea =
      required.includes(file) ||
      file.startsWith(`${website}/src/`) ||
      file.startsWith(`${website}/public/`) ||
      (parts[0] === "packages" &&
        packageNames.has(parts[1]) &&
        (parts[2] === "src" || (parts.length === 3 && parts[2] === "tsconfig.build.json")));
    assert.ok(allowedArea, `Docker context contains an unrelated build input: ${file}`);
    const original = await readFile(path.join(root, file));
    const exported = await readFile(path.join(exportedDirectory, file));
    assert.equal(digest(exported), digest(original), `Docker context bytes changed: ${file}`);
    hashes[file] = digest(exported);
  }
  return { result: "pass", files: files.length, workspaceManifests: manifests.length, hashes };
}

const includedSamples = [
  `${website}/src/main.tsx`,
  `${website}/src/content/store/entries/context-probe.design.json`,
  `${website}/public/fonts/NOTICE.txt`,
  `${website}/public/fonts/context-probe.woff`,
  `${website}/public/icons/NOTICE.txt`,
  `${website}/public/store/context-probe.webp`,
  "packages/ui/src/index.ts",
  "packages/ui/src/styles.css",
  "packages/design-tokens/src/css/tokens.css",
];
const excludedSamples = [
  `${website}/public/context-probe.tgz`,
  ".env",
  ".env.local",
  ".npmrc",
  ".git/config",
  ".github/workflows/context-probe.yml",
  "node_modules/context-probe/index.js",
  "docs/context-probe.md",
  "assets/designs/context-probe.psd",
  "business/context-probe.csv",
  "apps/docs/src/main.tsx",
  "apps/playground/src/main.tsx",
  "packages/context-probe/package.json",
  "scripts/context-probe.mjs",
  `${website}/.env.local`,
  `${website}/.npmrc`,
  `${website}/src/.private/record.json`,
  `${website}/src/context-probe.env`,
  `${website}/src/context-probe.env.production`,
  `${website}/src/private/context-probe.json`,
  `${website}/src/secrets/context-probe.json`,
  `${website}/public/masters/context-probe.psd`,
  `${website}/public/private-artwork/context-probe.png`,
  `${website}/src/business-records/context-probe.json`,
  ...["psd", "PSD", "psb", "kra", "xcf", "afdesign", "afphoto", "ai"].map(
    (extension) => `${website}/public/context-probe.${extension}`,
  ),
  `${website}/src/context-probe.key`,
  `${website}/public/context-probe.pem`,
  `${website}/public/context-probe.crt`,
  `${website}/public/context-probe.cer`,
  `${website}/public/context-probe.p12`,
  `${website}/src/node_modules/context-probe/index.js`,
  `${website}/dist/index.html`,
  `${website}/dist-preview/index.html`,
  "packages/ui/src/.cache/context-probe.json",
  "packages/ui/src/dist/context-probe.js",
  "packages/ui/src/tests/context-probe.ts",
  "packages/ui/src/context-probe.test.tsx",
  "packages/ui/src/context-probe.stories.tsx",
  "packages/ui/src/README.md",
];

/** Make a small, harmless checkout fixture. Only Docker will decide what COPY receives. */
export async function prepareDockerContextProbe(root, fixtureDirectory) {
  const relative = path.relative(path.resolve(root), path.resolve(fixtureDirectory));
  assert.ok(
    relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative),
    "Context probe must be outside the source checkout",
  );
  await mkdir(fixtureDirectory, { recursive: true });
  assert.deepEqual(
    await readdir(fixtureDirectory),
    [],
    "Context probe requires an empty directory",
  );
  const expected = {};
  async function write(file, content, included) {
    await mkdir(path.dirname(path.join(fixtureDirectory, file)), { recursive: true });
    await writeFile(path.join(fixtureDirectory, file), content);
    if (included) expected[file] = digest(content);
  }
  for (const file of [...requiredFiles, ...(await workspaceManifests(root))]) {
    await write(file, await readFile(path.join(root, file)), true);
  }
  await write(".dockerignore", await readFile(path.join(root, ".dockerignore")), false);
  for (const file of includedSamples)
    await write(file, `Harmless included context probe: ${file}\n`, true);
  for (const file of excludedSamples)
    await write(file, `Harmless excluded context probe: ${file}\n`, false);
  return { expected, excludedSamples: [...excludedSamples] };
}

/** The caller must pass output produced by the real Docker context target. */
export async function verifyDockerContextProbe(exportedDirectory, probe) {
  const files = await filesIn(exportedDirectory);
  assert.deepEqual(
    files,
    Object.keys(probe.expected).sort(),
    "Docker context probe exported unexpected or missing files",
  );
  for (const file of files) {
    assert.equal(
      digest(await readFile(path.join(exportedDirectory, file))),
      probe.expected[file],
      `Docker context probe bytes changed: ${file}`,
    );
  }
  return {
    result: "pass",
    includedFiles: files.length,
    excludedSamples: probe.excludedSamples.length,
  };
}
