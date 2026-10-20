import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  checkReview,
  checkTranslation,
  parseCatalog,
  sourceInventory,
} from "../../scripts/locales/catalog.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const sourceNamespaces = {
  common: {
    greeting: "Hello {{name}}",
    blank: "",
    stable: "common.stable",
    items_one: "{{formattedCount}} item",
    items_other: "{{formattedCount}} items",
  },
  preview: { label: "Preview" },
};
const source = (namespaces = sourceNamespaces) =>
  parseCatalog({ locale: "en", namespaces, source: true });
const target = (namespaces, locale = "fr", formatLocale = locale) =>
  parseCatalog({ locale, formatLocale, namespaces });
function approval(original, translated) {
  return {
    version: 1,
    sourceLocale: original.locale,
    locale: translated.locale,
    formatLocale: translated.formatLocale,
    messages: Object.fromEntries(
      checkTranslation(original, translated).reviewInputs.map(({ key, ...hashes }) => [
        key,
        {
          ...hashes,
          status: "approved",
          reviewedBy: "Synthetic test reviewer",
          reviewedAt: "2026-10-20",
        },
      ]),
    ),
  };
}

test("source inventory is deterministic across file/key order and includes empty/key-equal messages", () => {
  const a = sourceInventory(source());
  const b = sourceInventory(
    source({
      preview: sourceNamespaces.preview,
      common: Object.fromEntries(Object.entries(sourceNamespaces.common).reverse()),
    }),
  );
  assert.deepEqual(a, b);
  assert.equal(a.messages.length, 6);
  assert.match(a.sourceHash, /^[a-f0-9]{64}$/);
  assert.equal(a.messages.find(({ key }) => key === "common.blank").text, "");
});

test("partial dictionaries explicitly report source fallback and do not copy source messages", () => {
  const translated = target({ common: { greeting: "Fixture {{ name }} / {{name}}" } });
  const report = checkReview({ source: source(), translated });
  assert.deepEqual(report.sourceFallback, [
    "common.blank",
    "common.items",
    "common.stable",
    "preview.label",
  ]);
  assert.equal(report.reviewStatus, "not-reviewed");
  assert.equal(translated.messages.size, 1);
  assert.equal("status" in report.reviewInputs[0], false);
});

test("plural categories may differ from English and missing target categories use _other", () => {
  const translated = target(
    {
      common: {
        items_zero: "Zero fixture {{formattedCount}}",
        items_few: "Few fixture {{formattedCount}}",
        items_other: "Other fixture {{formattedCount}}",
      },
    },
    "ar",
  );
  const report = checkTranslation(source(), translated);
  assert.deepEqual(report.pluralCategoryFallback, [
    { key: "common.items_many", fallback: "common.items_other" },
    { key: "common.items_one", fallback: "common.items_other" },
    { key: "common.items_two", fallback: "common.items_other" },
  ]);
  assert.equal(report.sourceFallback.includes("common.items"), false);
  assert.equal(new Set(report.reviewInputs.map(({ sourceHash }) => sourceHash)).size, 1);
});

test("synthetic locale selection IDs have an explicit supported formatting locale", () => {
  assert.equal(target({ common: { blank: "" } }, "en-XA", "en").formatLocale, "en");
  assert.throws(() => target({}, "en-xa", "en"), /canonical/);
  assert.throws(() => target({}, "qaa", "qaa"), /unsupported/);
});

test("rejects malformed structures, ambiguous dotted keys and empty source namespaces", () => {
  for (const invalid of [null, [], 4, true]) {
    assert.throws(() => source({ common: { invalid } }), /strings or nested objects/);
  }
  assert.throws(() => source({ common: "string" }), /namespace must be an object/);
  assert.throws(() => source({ common: { "a.b": "ambiguous" } }), /key segment/);
  assert.throws(() => source({ common: {} }), /empty source/);
  assert.throws(() => source({}), /no namespaces/);
  assert.deepEqual(checkTranslation(source(), target({ common: {} })).reviewInputs, []);
});

test("rejects malformed token syntax, mismatched placeholders and unknown messages/namespaces", () => {
  for (const text of [
    "Hello {{}}",
    "Hello {{name",
    "Hello {name}",
    "Hello {{user.name}}",
    "{{{name}}}",
    "{{name}}}",
  ]) {
    assert.throws(() => target({ common: { greeting: text } }), /malformed interpolation/);
  }
  for (const text of ["Hello", "Hello {{other}}", "{{name}} {{extra}}"]) {
    assert.throws(
      () => checkTranslation(source(), target({ common: { greeting: text } })),
      /placeholders must match source/,
    );
  }
  assert.throws(
    () => checkTranslation(source(), target({ common: { unknown: "Fixture" } })),
    /unknown translated message/,
  );
  assert.throws(
    () => checkTranslation(source(), target({ unknown: {} })),
    /unknown translated namespace/,
  );
});

test("rejects unsupported categories, incomplete plural families and mismatched family tokens", () => {
  assert.throws(
    () => target({ common: { items_few: "Fixture", items_other: "Fixture" } }, "en"),
    /not used by en/,
  );
  assert.throws(() => target({ common: { items_one: "Fixture" } }), /must include _other/);
  assert.throws(
    () => target({ common: { items_one: "{{count}}", items_other: "{{formattedCount}}" } }),
    /family placeholders/,
  );
  assert.throws(
    () => checkTranslation(source(), target({ common: { greeting_other: "{{name}}" } })),
    /unknown translated message/,
  );
});

test("review validation requires human records and binds both source and translated content", () => {
  const original = source();
  const translated = target({ common: { greeting: "Fixture {{name}}" } });
  const review = approval(original, translated);
  assert.equal(
    checkReview({ source: original, translated, review, requireReview: true }).reviewStatus,
    "review-records-current",
  );
  assert.throws(
    () => checkReview({ source: original, translated, requireReview: true }),
    /metadata is required/,
  );
  const changedSource = source({
    ...sourceNamespaces,
    common: { ...sourceNamespaces.common, greeting: "Welcome {{name}}" },
  });
  assert.throws(() => checkReview({ source: changedSource, translated, review }), /stale source/);
  assert.throws(
    () =>
      checkReview({
        source: original,
        translated: target({ common: { greeting: "Changed fixture {{name}}" } }),
        review,
      }),
    /stale translation/,
  );
});

test("source family changes invalidate extra-category translation reviews", () => {
  const translated = target(
    {
      common: {
        items_other: "Fixture {{formattedCount}}",
        items_few: "Few fixture {{formattedCount}}",
      },
    },
    "ar",
  );
  const review = approval(source(), translated);
  const changedSource = source({
    ...sourceNamespaces,
    common: { ...sourceNamespaces.common, items_one: "One changed item {{formattedCount}}" },
  });
  assert.throws(() => checkReview({ source: changedSource, translated, review }), /stale source/);
});

test("rejects missing, orphaned, malformed and unapproved review records", () => {
  const original = source();
  const translated = target({ common: { greeting: "Fixture {{name}}" } });
  for (const change of [
    { status: "draft" },
    { reviewedBy: " " },
    { reviewedAt: "2026-02-30" },
    { reviewedAt: "yesterday" },
  ]) {
    const review = approval(original, translated);
    Object.assign(review.messages["common.greeting"], change);
    assert.throws(
      () => checkReview({ source: original, translated, review }),
      /explicit human approval/,
    );
  }
  assert.throws(
    () =>
      checkReview({
        source: original,
        translated,
        review: { ...approval(original, translated), messages: {} },
      }),
    /explicit human approval/,
  );
  const orphaned = approval(original, translated);
  orphaned.messages["common.removed"] = orphaned.messages["common.greeting"];
  assert.throws(
    () => checkReview({ source: original, translated, review: orphaned }),
    /no corresponding translated message/,
  );
  assert.throws(
    () =>
      checkReview({
        source: original,
        translated,
        review: { ...approval(original, translated), locale: "ar" },
      }),
    /invalid review header/,
  );
});

test("CLI discovers all production namespaces including preview and emits an unapproved inventory", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "locale-inventory-"));
  try {
    const inventoryFile = path.join(directory, "inventory.json");
    const result = spawnSync(
      process.execPath,
      ["scripts/checks/check-locales.ts", "--inventory", inventoryFile],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    const inventory = JSON.parse(readFileSync(inventoryFile, "utf8"));
    assert.equal(inventory.namespaces.includes("fourthwallPreview"), true);
    assert.equal(inventory.namespaces.includes("storefront"), true);
    assert.equal(
      inventory.messages.some(({ key }) => key === "fourthwallPreview.details.fromPrice"),
      true,
    );
    assert.deepEqual(inventory.translations, []);
    assert.equal("approved" in inventory, false);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("CLI candidate checks never activate a locale and fail on unknown keys or missing required review", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "locale-candidate-"));
  try {
    writeFileSync(
      path.join(directory, "landing.json"),
      JSON.stringify({ designActionLabel: "Synthetic fixture {{title}}" }),
    );
    const command = ["scripts/checks/check-locales.ts", "--directory", directory, "--locale", "fr"];
    const run = (...extra) =>
      spawnSync(process.execPath, [...command, ...extra], { cwd: root, encoding: "utf8" });
    assert.equal(run().status, 0);
    const missingReview = run("--require-review");
    assert.equal(missingReview.status, 1);
    assert.match(missingReview.stderr, /metadata is required/);
    writeFileSync(path.join(directory, "landing.json"), JSON.stringify({ typo: "Fixture" }));
    const unknown = run();
    assert.equal(unknown.status, 1);
    assert.match(unknown.stderr, /unknown translated message/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("unknown empty nested groups fail instead of hiding key typos", () => {
  assert.throws(
    () => checkTranslation(source(), target({ common: { typo: {} } })),
    /unknown translated message group/,
  );
});

test("plain-base plural fallback follows the runtime when source declares both forms", () => {
  const original = source({ common: { items: "Items", items_one: "One", items_other: "Other" } });
  const translated = target({ common: { items: "Synthetic base" } });
  const report = checkTranslation(original, translated);
  assert.deepEqual(report.sourceFallback, []);
  assert.deepEqual(report.pluralBaseFallback, ["common.items"]);
});

test("default discovery requires current human records for each non-English sibling", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "locale-tree-"));
  try {
    const en = path.join(directory, "locales/en");
    const fr = path.join(directory, "locales/fr");
    const reviews = path.join(directory, "reviews");
    for (const folder of [en, fr, reviews]) mkdirSync(folder, { recursive: true });
    const english = { common: { greeting: "Hello {{name}}" } };
    const translated = { common: { greeting: "Synthetic {{name}}" } };
    writeFileSync(path.join(en, "common.json"), JSON.stringify(english.common));
    writeFileSync(path.join(fr, "common.json"), JSON.stringify(translated.common));
    const run = () =>
      spawnSync(process.execPath, ["scripts/checks/check-locales.ts", "--source-directory", en], {
        cwd: root,
        encoding: "utf8",
      });
    assert.equal(run().status, 1);
    writeFileSync(
      path.join(reviews, "fr.json"),
      JSON.stringify(approval(source(english), target(translated))),
    );
    assert.equal(run().status, 0);
    writeFileSync(path.join(en, "common.json"), JSON.stringify({ greeting: "Changed {{name}}" }));
    const stale = run();
    assert.equal(stale.status, 1);
    assert.match(stale.stderr, /stale source review/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
