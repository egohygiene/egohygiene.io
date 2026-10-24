import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { type TestContext, test } from "node:test";

import { LOCAL_REVIEW_BUDGETS, qualifyArtifact } from "../store-qualification/artifacts.mts";

async function fixture(t: TestContext) {
  const root = await mkdtemp(path.join(tmpdir(), "artifact-qualification-37-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "assets"));
  await writeFile(
    path.join(root, "index.html"),
    '<link rel="manifest" href="/site.webmanifest"><link rel="stylesheet" href="/assets/app.css"><script src="/assets/app.js"></script>',
  );
  await writeFile(
    path.join(root, "site.webmanifest"),
    JSON.stringify({
      name: "Fictional test",
      start_url: "./",
      icons: [{ src: "./assets/icon.svg" }],
    }),
  );
  await writeFile(
    path.join(root, "assets/icon.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  );
  await writeFile(
    path.join(root, "assets/app.css"),
    'body{background-image:url("/assets/icon.svg")}',
  );
  await writeFile(
    path.join(root, "assets/app.js"),
    'const control = "fictional-positive-control"; const icon = "/assets/icon.svg";',
  );
  return root;
}

const options = { positiveControls: ["fictional-positive-control"], excludedMarkers: [] };

test("artifact qualification measures real bytes and resolves HTML, CSS, JS and manifest assets", async (t) => {
  const root = await fixture(t);
  const report = await qualifyArtifact(root, options);
  assert.equal(report.result, "pass");
  assert.equal(report.files.length, 5);
  assert.equal(report.references.length, 7);
  assert.ok(
    report.files.every(
      (file) => file.bytes > 0 && file.gzipBytes > 0 && /^[a-f0-9]{64}$/.test(file.sha256),
    ),
  );
  assert.equal(report.budgetStatus, "provisional-local-review");
  assert.equal(
    report.sizes.total.bytes,
    report.files.reduce((sum, file) => sum + file.bytes, 0),
  );
  assert.equal(report.documentCosts.documents.length, 1);
  assert.deepEqual(report.documentCosts.documents[0]?.reachable, {
    bytes: report.sizes.total.bytes,
    gzipBytes: report.sizes.total.gzipBytes,
  });
});

test("document costs deduplicate shared and cyclic assets without following manifest navigation", async (t) => {
  const root = await fixture(t);
  await writeFile(
    path.join(root, "assets/app.js"),
    'import "./second.js"; const control = "fictional-positive-control"; const icon = "/assets/icon.svg";',
  );
  await writeFile(
    path.join(root, "assets/second.js"),
    'import "./app.js"; const icon = "/assets/icon.svg";',
  );
  await writeFile(path.join(root, "other.html"), '<script src="/assets/other.js"></script>');
  await writeFile(path.join(root, "assets/other.js"), 'const unrelated = "other page";');
  await writeFile(
    path.join(root, "site.webmanifest"),
    JSON.stringify({
      name: "Fictional test",
      start_url: "/other.html",
      icons: [{ src: "./assets/icon.svg" }],
    }),
  );
  const report = await qualifyArtifact(root, options);
  assert.equal(report.result, "pass");
  const home = report.documentCosts.documents.find(({ path }) => path === "index.html")!;
  const other = report.documentCosts.documents.find(({ path }) => path === "other.html")!;
  assert.deepEqual(home.reachableFiles, [
    "assets/app.css",
    "assets/app.js",
    "assets/icon.svg",
    "assets/second.js",
    "index.html",
    "site.webmanifest",
  ]);
  assert.deepEqual(home.omittedNavigationTargets, ["other.html"]);
  assert.deepEqual(other.reachableFiles, ["assets/other.js", "other.html"]);
  const expected = report.files.filter(({ path }) => home.reachableFiles.includes(path));
  assert.deepEqual(home.reachable, {
    bytes: expected.reduce((sum, file) => sum + file.bytes, 0),
    gzipBytes: expected.reduce((sum, file) => sum + file.gzipBytes, 0),
  });
  assert.equal(home.unresolvedLocalReferenceCount, 0);
});

test("document diagnostics preserve aggregate failures and disclose missing or external resources", async (t) => {
  const root = await fixture(t);
  await writeFile(
    path.join(root, "index.html"),
    '<script src="/assets/app.js"></script><img src="/missing.webp"><img src="https://example.invalid/art.webp">',
  );
  const budgets = structuredClone(LOCAL_REVIEW_BUDGETS);
  budgets.documents = { bytes: 1, gzipBytes: 1 };
  const report = await qualifyArtifact(root, { ...options, budgets });
  const home = report.documentCosts.documents[0]!;
  assert.equal(report.result, "fail");
  assert.equal(report.sizes.documents.result, "fail");
  assert.equal(report.findings.filter(({ rule }) => rule === "size-budget").length, 2);
  assert.equal(report.findings.filter(({ rule }) => rule === "missing-asset").length, 1);
  assert.equal(home.unresolvedLocalReferenceCount, 1);
  assert.equal(home.externalReferenceCount, 1);
  assert.ok(!home.reachableFiles.includes("missing.webp"));
  assert.ok(home.reachable.bytes < report.sizes.total.bytes);
});

test("credential findings omit matched values while detecting private keys and common token shapes", async (t) => {
  const root = await fixture(t);
  const secrets = [
    ["-----BEGIN", "PRIVATE KEY-----"].join(" "),
    `ghp_${"a".repeat(36)}`,
    `AKIA${"A".repeat(16)}`,
    `sk_live_${"b".repeat(24)}`,
    `https://${"fixture-user"}:${"fixture-password"}@example.invalid`,
  ];
  await writeFile(path.join(root, "assets/leak.js"), secrets.join("\n"));
  const report = await qualifyArtifact(root, options);
  assert.equal(report.result, "fail");
  assert.equal(
    report.findings.filter((finding) => finding.rule.startsWith("credential:")).length,
    secrets.length,
  );
  const serialized = JSON.stringify(report);
  assert.ok(secrets.every((value) => !serialized.includes(value)));
});

test("artifact qualification rejects maps, environment files, private masters and excluded fixtures", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, ".env.production"), "SYNTHETIC_ONLY=yes");
  await writeFile(path.join(root, "assets/app.js.map"), "{}");
  await writeFile(path.join(root, "assets/private.psd"), "fictional master");
  await writeFile(
    path.join(root, "assets/leak.js"),
    "fictional-excluded-marker\n//# sourceMappingURL=app.js.map",
  );
  const report = await qualifyArtifact(root, {
    ...options,
    excludedMarkers: [
      { label: "test sentinel", marker: "fictional-excluded-marker", source: "fixture" },
    ],
  });
  assert.deepEqual(
    new Set(report.findings.map((finding) => finding.rule)),
    new Set([
      "dotenv",
      "source-map",
      "private-source-path",
      "source-map-reference",
      "excluded-marker",
    ]),
  );
});

test("missing references and missing public controls fail without relying on a browser server fallback", async (t) => {
  const root = await fixture(t);
  await rm(path.join(root, "assets/icon.svg"));
  await writeFile(path.join(root, "assets/app.js"), 'const path = "/assets/missing.webp";');
  const report = await qualifyArtifact(root, options);
  assert.equal(report.result, "fail");
  assert.ok(report.findings.some((finding) => finding.rule === "missing-positive-control"));
  for (const from of ["assets/app.css", "assets/app.js", "site.webmanifest"]) {
    assert.ok(
      report.findings.some((finding) => finding.rule === "missing-asset" && finding.file === from),
    );
  }
});

test("aggregate raw and gzip ceilings fail even when bytes are split across chunks", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "assets/second.js"), "A".repeat(60));
  const budgets = structuredClone(LOCAL_REVIEW_BUDGETS);
  budgets.javascript = { bytes: 100, gzipBytes: 1 };
  const report = await qualifyArtifact(root, { ...options, budgets });
  const failures = report.findings.filter((finding) => finding.rule === "size-budget");
  assert.equal(failures.length, 2);
  assert.ok(failures.some((finding) => finding.detail.startsWith("bytes:")));
  assert.ok(failures.some((finding) => finding.detail.startsWith("gzipBytes:")));
});

test("invalid manifest JSON and a changed approved public image fail explicitly", async (t) => {
  const root = await fixture(t);
  await writeFile(path.join(root, "site.webmanifest"), "{broken");
  const report = await qualifyArtifact(root, {
    ...options,
    publicImageSource: path.join(root, "assets/icon.svg"),
  });
  assert.equal(report.result, "fail");
  assert.ok(report.findings.some((finding) => finding.rule === "invalid-manifest"));
  assert.ok(report.findings.some((finding) => finding.rule === "public-image-mismatch"));
});
