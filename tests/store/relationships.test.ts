import assert from "node:assert/strict";
import { test } from "node:test";
import {
  migrateStoreCatalogV1,
  migrateStoreCatalogV2,
} from "../../packages/schemas/src/store-migrations.ts";
import {
  getStoreDesignWorkLinks,
  getStoreProductWorkLinks,
  parseStoreReferences,
  toPublicStoreReferences,
} from "../../packages/schemas/src/store-references.ts";
import { relationshipFixture } from "./fixtures/relationships.ts";

test("standalone and shared work/recording links derive through existing designs without product copies", () => {
  const { catalog, references } = relationshipFixture();
  assert.deepEqual(getStoreDesignWorkLinks(catalog, references, "design-fictional-standalone"), []);
  const expected = [
    { workId: "work-fictional-one", recordingIds: ["recording-fictional-one"] },
    { workId: "work-fictional-two", recordingIds: ["recording-fictional-two"] },
  ];
  assert.deepEqual(
    getStoreDesignWorkLinks(catalog, references, "design-fictional-shared"),
    expected,
  );
  for (const id of ["product-fictional-one", "product-fictional-two"])
    assert.deepEqual(getStoreProductWorkLinks(catalog, references, id), expected);
  assert.equal(catalog.entries.filter((e) => e.kind === "product").length, 2);
});

test("renaming/reordering preserves keys and relationship identity; empty recording detail remains unknown", () => {
  const { catalog, references } = relationshipFixture();
  const expected = getStoreProductWorkLinks(catalog, references, "product-fictional-two");
  for (const entry of catalog.entries) entry.title = `Renamed ${entry.id}`;
  catalog.entries.reverse();
  references.recordings.reverse();
  references.designRecordings.reverse();
  assert.deepEqual(
    getStoreProductWorkLinks(catalog, references, "product-fictional-two"),
    expected,
  );
  assert.deepEqual(
    getStoreDesignWorkLinks(
      catalog,
      { schemaVersion: 1, recordings: [], designRecordings: [] },
      "design-fictional-shared",
    ),
    [
      { workId: "work-fictional-one", recordingIds: [] },
      { workId: "work-fictional-two", recordingIds: [] },
    ],
  );
});

const corruptions: [string, (input: ReturnType<typeof relationshipFixture>) => void][] = [
  [
    "duplicate recording IDs",
    ({ references }) => references.recordings.push(references.recordings[0]!),
  ],
  [
    "duplicate links",
    ({ references }) => references.designRecordings.push(references.designRecordings[0]!),
  ],
  [
    "wrong work type",
    ({ references }) => {
      references.recordings[0]!.workId = "character-fictional";
    },
  ],
  [
    "recording/work mismatch",
    ({ references }) => {
      references.recordings[0]!.workId = "work-fictional-draft";
    },
  ],
  [
    "missing recording",
    ({ references }) => {
      references.designRecordings[0]!.recordingId = "recording-absent";
    },
  ],
  [
    "wrong design type",
    ({ references }) => {
      references.designRecordings[0]!.designId = "product-fictional-one";
    },
  ],
  [
    "public to draft",
    ({ references }) => {
      references.recordings[0]!.visibility = "draft";
    },
  ],
  [
    "invalid draft",
    ({ references }) => {
      references.recordings[2]!.workId = "work-absent";
    },
  ],
  [
    "identity collision",
    ({ references }) => {
      references.recordings[0]!.id = "work-fictional-one";
    },
  ],
];
for (const [name, corrupt] of corruptions)
  test(`references reject ${name} before filtering`, () => {
    const input = relationshipFixture();
    corrupt(input);
    assert.throws(() => toPublicStoreReferences(input.catalog, input.references));
  });

test("public projection excludes draft and unused recording details and rejects private fields at every boundary", () => {
  const { catalog, references } = relationshipFixture();
  const publicReferences = toPublicStoreReferences(catalog, references);
  assert.equal(publicReferences.recordings.length, 2);
  assert.equal(publicReferences.designRecordings.length, 2);
  assert.ok(!JSON.stringify(publicReferences).includes("fictional-draft"));
  for (const bad of [
    { ...references, privateCrosswalk: "SYNTHETIC_PRIVATE_SENTINEL" },
    {
      ...references,
      recordings: [{ ...references.recordings[0], sourcePath: "SYNTHETIC_PRIVATE_SENTINEL" }],
    },
    { ...references, schemaVersion: 99 },
  ])
    assert.throws(() => parseStoreReferences(catalog, bad));
});

test("the real catalog migration chain preserves source and stable keys before deriving the optional v1 view", () => {
  const { catalog } = relationshipFixture();
  const legacy = {
    schemaVersion: 1,
    entries: catalog.entries.map(
      ({
        sourceLocale: _locale,
        translations: _translations,
        attribution: _attribution,
        ...entry
      }) => ({ ...entry, schemaVersion: 1 }),
    ),
    checkoutRoutes: [],
  };
  const before = JSON.stringify(legacy);
  const migrated = migrateStoreCatalogV2(migrateStoreCatalogV1(legacy, { sourceLocale: "en" }));
  assert.equal(JSON.stringify(legacy), before);
  assert.deepEqual(
    migrated.entries.map((e) => e.id),
    catalog.entries.map((e) => e.id),
  );
  assert.deepEqual(
    getStoreProductWorkLinks(
      migrated,
      { schemaVersion: 1, recordings: [], designRecordings: [] },
      "product-fictional-one",
    ),
    [
      { workId: "work-fictional-one", recordingIds: [] },
      { workId: "work-fictional-two", recordingIds: [] },
    ],
  );
});
