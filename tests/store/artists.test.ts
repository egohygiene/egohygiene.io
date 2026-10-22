import assert from "node:assert/strict";
import { test } from "node:test";

import {
  getCuratedStoreArtist,
  getCuratedStoreArtists,
  storeArtistPath,
  storeEntryPath,
} from "../../apps/egohygiene.io/src/features/store/domain/index.ts";
import {
  getStorePurchaseAction,
  parseStoreCatalog,
  toPublicStoreCatalog,
} from "../../packages/schemas/src/store.ts";
import {
  emptyStorefrontCuration,
  parseStorefrontCuration,
} from "../../packages/schemas/src/storefront-curation.ts";

const base = (id: string, visibility = "public") => ({
  schemaVersion: 2,
  sourceLocale: "en",
  id,
  slug: id,
  title: id,
  description: "Fictional artist contract fixture, not a real release",
  visibility,
});
const context = (id: string, contextType: string, visibility = "public") => ({
  ...base(id, visibility),
  kind: "context",
  contextType,
});
const design = (id: string, visibility = "public") => ({
  ...base(id, visibility),
  kind: "design",
  artworkRevision: 1,
  artwork: { kind: "placeholder", label: "Fictional design" },
  contextIds: ["song-first"],
});
const values = [
  context("artist-first", "artist"),
  context("artist-second", "artist"),
  context("artist-empty", "artist"),
  context("artist-draft", "artist", "draft"),
  context("song-first", "song"),
  context("song-second", "song"),
  context("realm-example", "realm"),
  design("design-shared"),
  design("design-draft", "draft"),
  {
    ...base("product-shared"),
    kind: "product",
    designIds: ["design-shared"],
    purchase: { state: "preview" },
  },
  {
    ...base("collection-first"),
    kind: "collection",
    productIds: ["product-shared"],
    contextIds: ["song-first", "song-second"],
  },
  {
    ...base("collection-second"),
    kind: "collection",
    productIds: ["product-shared"],
    contextIds: ["song-second"],
  },
  {
    ...base("collection-world"),
    kind: "collection",
    productIds: ["product-shared"],
    contextIds: ["realm-example"],
  },
  {
    ...base("collection-draft", "draft"),
    kind: "collection",
    contextIds: ["song-first"],
  },
];
const catalog = parseStoreCatalog(values.map((value) => ({ source: `${value.id}.json`, value })));
const firstSelection = () => ({
  artistId: "artist-first",
  standaloneEntryIds: ["product-shared", "design-shared", "collection-first"],
  songCollectionIds: ["collection-second", "collection-first"],
});
const curated = () => ({
  ...emptyStorefrontCuration(),
  artists: [
    firstSelection(),
    {
      artistId: "artist-second",
      standaloneEntryIds: ["product-shared"],
      songCollectionIds: ["collection-first"],
    },
    { artistId: "artist-empty", standaloneEntryIds: [], songCollectionIds: [] },
  ],
});

test("existing curation v1 and optional artist lists default to empty without a catalog migration", () => {
  assert.deepEqual(
    parseStorefrontCuration(
      {
        schemaVersion: 1,
        egoHygieneEntryIds: [],
        incomprisEntryIds: [],
        featuredIncomprisEntryIds: [],
      },
      catalog,
    ),
    emptyStorefrontCuration(),
  );
  const curation = parseStorefrontCuration(
    {
      ...emptyStorefrontCuration(),
      artists: [{ artistId: "artist-empty" }],
    },
    catalog,
  );
  assert.deepEqual(curation.artists, [
    {
      artistId: "artist-empty",
      standaloneEntryIds: [],
      songCollectionIds: [],
    },
  ]);
  assert.equal(catalog.schemaVersion, 2);
  const view = getCuratedStoreArtist(catalog, curation, "artist-empty");
  assert.ok(view);
  assert.deepEqual(view.standaloneEntries, []);
  assert.deepEqual(view.songCollections, []);
});

test("multiple artists and song collections share canonical entries without inferring attribution", () => {
  const before = JSON.stringify(catalog);
  const curation = parseStorefrontCuration(curated(), catalog);
  const [first, second, empty] = getCuratedStoreArtists(catalog, curation);
  assert.ok(first && second && empty);
  assert.deepEqual(
    first.standaloneEntries.map((entry) => entry.id),
    ["product-shared", "design-shared", "collection-first"],
  );
  assert.deepEqual(
    first.songCollections.map((entry) => entry.id),
    ["collection-second", "collection-first"],
  );
  assert.equal(first.standaloneEntries[0], second.standaloneEntries[0]);
  assert.equal(first.songCollections[1], second.songCollections[0]);
  assert.equal(first.standaloneEntries[2], first.songCollections[1]);
  assert.equal(
    first.standaloneEntries[0],
    catalog.entries.find((entry) => entry.id === "product-shared"),
  );
  assert.equal(getStorePurchaseAction(catalog, "product-shared").kind, "disabled");
  assert.deepEqual(first.standaloneEntries[0]?.contextIds, []);
  assert.deepEqual(first.songCollections[1]?.contextIds, ["song-first", "song-second"]);
  assert.deepEqual(empty.standaloneEntries, []);
  assert.deepEqual(empty.songCollections, []);
  assert.equal(JSON.stringify(catalog), before);
});

test("artist lookup and song destinations use stable canonical slugs rather than titles or view placement", () => {
  const curation = parseStorefrontCuration(curated(), catalog);
  const first = getCuratedStoreArtist(catalog, curation, "artist-first");
  assert.ok(first);
  assert.equal(storeArtistPath(first.artist), "/store/incompris/artists/artist-first");
  assert.equal(
    storeArtistPath({ ...first.artist, title: "A changed display name" }),
    "/store/incompris/artists/artist-first",
  );
  const songCollection = first.songCollections[0];
  const product = first.standaloneEntries[0];
  assert.ok(songCollection && product);
  assert.equal(storeEntryPath(songCollection), "/store/collections/collection-second");
  assert.equal(storeEntryPath(product), "/store/products/product-shared");
  assert.equal(getCuratedStoreArtist(catalog, curation, "missing"), undefined);
  assert.equal(getCuratedStoreArtist(catalog, curation, "Artist-First"), undefined);
  assert.equal(getCuratedStoreArtist(catalog, curation, "song-first"), undefined);
});

test("artist records reject unknown fields and malformed references with source diagnostics", () => {
  assert.throws(
    () =>
      parseStorefrontCuration(
        {
          ...curated(),
          artists: [{ ...firstSelection(), biography: "Unsupported private field" }],
        },
        catalog,
        "curation.json",
      ),
    /curation.json:artists.0:.*biography/,
  );
  assert.throws(
    () =>
      parseStorefrontCuration(
        {
          ...curated(),
          artists: [{ artistId: "../escape" }],
        },
        catalog,
      ),
    /artists.0.artistId/,
  );
});

test("artist references must be unique public artist contexts", () => {
  for (const [artistId, pattern] of [
    ["artist-missing", /Expected artist context/],
    ["song-first", /Expected artist context/],
    ["realm-example", /Expected artist context/],
    ["design-shared", /Expected artist context/],
    ["artist-draft", /cannot reference draft/],
  ] as const) {
    assert.throws(
      () =>
        parseStorefrontCuration(
          {
            ...emptyStorefrontCuration(),
            artists: [{ artistId }],
          },
          catalog,
        ),
      pattern,
    );
  }
  assert.throws(
    () =>
      parseStorefrontCuration(
        {
          ...curated(),
          artists: [firstSelection(), firstSelection()],
        },
        catalog,
      ),
    /artists.1.artistId: Duplicate artist reference/,
  );
});

test("standalone selection validates references while allowing intentional song overlap", () => {
  for (const [ids, pattern] of [
    [["design-missing"], /Expected design, product, or collection reference/],
    [["song-first"], /Expected design, product, or collection reference/],
    [["design-draft"], /cannot reference draft/],
    [["product-shared", "product-shared"], /Duplicate reference/],
  ] as [string[], RegExp][]) {
    assert.throws(
      () =>
        parseStorefrontCuration(
          {
            ...curated(),
            artists: [{ ...firstSelection(), standaloneEntryIds: ids }],
          },
          catalog,
        ),
      pattern,
    );
  }
  assert.doesNotThrow(() => parseStorefrontCuration(curated(), catalog));
});

test("Shop by song requires explicit public collections with direct song contexts", () => {
  for (const [ids, pattern] of [
    [["collection-missing"], /Expected collection reference/],
    [["product-shared"], /Expected collection reference/],
    [["song-first"], /Expected collection reference/],
    [["collection-draft"], /cannot reference draft/],
    [["collection-first", "collection-first"], /Duplicate reference/],
    [["collection-world"], /require a direct public song context/],
  ] as [string[], RegExp][]) {
    assert.throws(
      () =>
        parseStorefrontCuration(
          {
            ...curated(),
            artists: [{ ...firstSelection(), songCollectionIds: ids }],
          },
          catalog,
        ),
      pattern,
    );
  }
  // The world collection's product uses a song-connected design. This must not
  // silently reclassify the entire collection as a song destination.
  assert.equal(catalog.entries.find((entry) => entry.id === "design-shared")?.kind, "design");
});

test("selectors fail closed for unpublished, missing or wrong-kind selections", () => {
  const invalid = {
    ...emptyStorefrontCuration(),
    artists: [
      { artistId: "artist-draft", standaloneEntryIds: [], songCollectionIds: [] },
      { artistId: "song-first", standaloneEntryIds: [], songCollectionIds: [] },
      { artistId: "artist-missing", standaloneEntryIds: [], songCollectionIds: [] },
      {
        artistId: "artist-first",
        standaloneEntryIds: [
          "design-draft",
          "song-first",
          "design-missing",
          "product-shared",
          "product-shared",
        ],
        songCollectionIds: [
          "collection-world",
          "collection-draft",
          "product-shared",
          "collection-first",
          "collection-first",
        ],
      },
      firstSelection(),
    ],
  };
  const views = getCuratedStoreArtists(catalog, invalid);
  assert.equal(views.length, 1);
  assert.deepEqual(
    views[0]?.standaloneEntries.map((entry) => entry.id),
    ["product-shared"],
  );
  assert.deepEqual(
    views[0]?.songCollections.map((entry) => entry.id),
    ["collection-first"],
  );
  assert.deepEqual(getCuratedStoreArtists(toPublicStoreCatalog(catalog), invalid), views);
});
