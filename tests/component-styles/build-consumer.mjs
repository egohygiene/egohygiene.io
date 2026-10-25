import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react-swc";
import { parse } from "postcss";
import { build } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(path.join(root, "package.json"));
const cache = path.join(root, ".cache/component-styles-53");

export function assertIndependentStyles(css, modulePaths) {
  assert.ok(modulePaths.some((value) => value.includes("packages/visualizations/src/index.tsx")));
  assert.ok(
    !modulePaths.some((value) => /(?:^|\/)(?:apps|packages\/ui)\//.test(value)),
    "Consumer must not import an app or UI package",
  );
  const stylesheet = parse(css);
  const selectors = [];
  const properties = new Set();
  const orbitProperties = new Map();
  stylesheet.walkRules((rule) => selectors.push(...rule.selectors));
  stylesheet.walkRules((rule) => {
    if (rule.selectors.includes(".eh-orbit")) {
      rule.walkDecls((declaration) => orbitProperties.set(declaration.prop, declaration.value));
    }
  });
  stylesheet.walkDecls((declaration) => properties.add(declaration.prop));
  for (const selector of [".eh-orbit", ".eh-orbit__ring", ".eh-orbit__core"]) {
    assert.ok(selectors.includes(selector), `Missing visualization styling: ${selector}`);
  }
  for (const theme of ["light", "dark", "high-contrast"]) {
    assert.ok(
      selectors.some((selector) => selector.replaceAll('"', "") === `[data-theme=${theme}]`),
      `Missing ${theme} theme`,
    );
  }
  for (const property of [
    "--eh-color-accentStrong",
    "--color-action-background",
    "--color-action-foreground",
  ]) {
    assert.ok(properties.has(property), `Missing declared token/theme dependency: ${property}`);
  }
  assert.ok(
    !selectors.some((selector) => selector.includes(".eh-button")),
    "UI styles leaked into standalone visualization",
  );
  assert.equal(
    orbitProperties.get("display"),
    "grid",
    "Orbit must obtain its layout from its own stylesheet",
  );
  assert.equal(orbitProperties.get("position"), "relative");
  assert.equal(orbitProperties.get("width"), "var(--orbit-size)");
  assert.equal(orbitProperties.get("height"), "var(--orbit-size)");
}

/** A real workspace-style consumer: declared dependencies, package exports, no resolver aliases. */
export async function buildConsumer() {
  const consumer = path.join(cache, "consumer");
  const output = path.join(cache, "dist");
  await mkdir(cache, { recursive: true });
  // Only this fixture-owned input is replaced; Vite replaces its own fixed output below.
  await rm(consumer, { recursive: true, force: true });
  await cp(new URL("./consumer/", import.meta.url), consumer, { recursive: true });
  const packageRoots = {
    react: path.dirname(require.resolve("react/package.json")),
    "react-dom": path.dirname(require.resolve("react-dom/package.json")),
    "@egohygiene/visualizations": path.join(root, "packages/visualizations"),
  };
  const dependencies = {};
  for (const [name, packageRoot] of Object.entries(packageRoots)) {
    dependencies[name] = JSON.parse(
      await readFile(path.join(packageRoot, "package.json"), "utf8"),
    ).version;
    const destination = path.join(consumer, "node_modules", name);
    await mkdir(path.dirname(destination), { recursive: true });
    await symlink(packageRoot, destination, "dir");
  }
  await writeFile(
    path.join(consumer, "package.json"),
    `${JSON.stringify({ name: "component-styles-consumer", private: true, type: "module", dependencies }, null, 2)}\n`,
  );
  const resolved = await build({
    configFile: false,
    root: consumer,
    publicDir: false,
    plugins: [react()],
    build: { outDir: output, emptyOutDir: true, sourcemap: false },
  });
  const bundles = Array.isArray(resolved) ? resolved : [resolved];
  const modules = [
    ...new Set(
      bundles.flatMap((bundle) =>
        bundle.output.flatMap((item) => (item.type === "chunk" ? Object.keys(item.modules) : [])),
      ),
    ),
  ];
  const modulePaths = modules
    .map((name) => path.relative(root, name).replaceAll(path.sep, "/"))
    .sort();
  const html = await readFile(path.join(output, "index.html"), "utf8");
  const cssPaths = [...html.matchAll(/<link\b[^>]*href="(\/assets\/[^"?#]+\.css)"[^>]*>/g)].map(
    (match) => match[1].slice(1),
  );
  assert.ok(cssPaths.length > 0, "Entry HTML must load a generated stylesheet");
  const styles = await Promise.all(
    cssPaths.map((name) => readFile(path.join(output, name), "utf8")),
  );
  assertIndependentStyles(styles.join("\n"), modulePaths);
  const report = {
    sourceHead: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    worktreeDirty:
      execFileSync("git", ["status", "--porcelain"], { cwd: root, encoding: "utf8" }).trim()
        .length > 0,
    capturedAt: new Date().toISOString(),
    result: "pass",
    dependencies,
    modulePaths,
    styles: cssPaths.map((name, index) => ({
      path: name,
      bytes: Buffer.byteLength(styles[index]),
      sha256: createHash("sha256").update(styles[index]).digest("hex"),
    })),
    output: ".cache/component-styles-53/dist",
    browserExecuted: false,
    limits: [
      "Build/module/stylesheet evidence only; not computed browser styling or visual acceptance.",
      "Existing installed workspace packages are linked; no package publication or dependency download.",
    ],
  };
  await writeFile(path.join(cache, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await buildConsumer();
  process.stdout.write(
    `${JSON.stringify({ result: report.result, output: report.output, styles: report.styles, browserExecuted: false }, null, 2)}\n`,
  );
}
