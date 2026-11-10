import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { assertCostProbeMatches } from "../../scripts/public-cost-report.mts";

test("cost attribution rejects replaced assets rather than labeling stale modules as current", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "public-cost-report-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const code = 'console.log("current");';
  const chunk = {
    path: "app.js",
    sha256: createHash("sha256").update(code).digest("hex"),
    modules: [],
  };
  await writeFile(join(root, chunk.path), code);
  await assertCostProbeMatches(root, [chunk]);
  await writeFile(join(root, chunk.path), 'console.log("replaced");');
  await assert.rejects(assertCostProbeMatches(root, [chunk]), /differs from emitted asset/);
  await assert.rejects(
    assertCostProbeMatches(root, [{ ...chunk, path: "../outside.js" }]),
    /escapes artifact/,
  );
});
