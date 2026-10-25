import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { assertIndependentStyles, buildConsumer } from "./build-consumer.mjs";

test("declared visualization imports build without UI/application styles", async () => {
  const report = await buildConsumer();
  assert.equal(report.result, "pass");
  assert.deepEqual(Object.keys(report.dependencies).sort(), [
    "@egohygiene/visualizations",
    "react",
    "react-dom",
  ]);
  const css = (
    await Promise.all(
      report.styles.map(({ path }) =>
        readFile(new URL(`../../.cache/component-styles-53/dist/${path}`, import.meta.url), "utf8"),
      ),
    )
  ).join("\n");
  assert.throws(
    () => assertIndependentStyles("", report.modulePaths),
    /Missing visualization styling/,
  );
  assert.throws(
    () => assertIndependentStyles(`${css}\n.eh-button { display: flex; }`, report.modulePaths),
    /UI styles leaked/,
  );
  assert.throws(
    () => assertIndependentStyles(css, [...report.modulePaths, "packages/ui/src/index.tsx"]),
    /must not import an app or UI/,
  );
});
