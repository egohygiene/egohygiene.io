import { z } from "zod";
import type { StoreCatalog, StoreEntry } from "./store.ts";
import { StoreCatalogError, storeDesignSchema } from "./store.ts";

export const STOREFRONT_CURATION_SCHEMA_VERSION = 1;
const entryIds = z.array(storeDesignSchema.shape.id);

export const storefrontArtistCurationSchema = z.strictObject({
  artistId: storeDesignSchema.shape.id,
  standaloneEntryIds: entryIds.default([]),
  songCollectionIds: entryIds.default([]),
});

/** Editorial placement only: these lists do not confer artist ownership or purchase approval. */
export const storefrontCurationSchema = z.strictObject({
  schemaVersion: z.literal(STOREFRONT_CURATION_SCHEMA_VERSION),
  egoHygieneEntryIds: entryIds,
  incomprisEntryIds: entryIds,
  featuredIncomprisEntryIds: entryIds,
  artists: z.array(storefrontArtistCurationSchema).default([]),
});

export type StorefrontArtistCuration = z.infer<typeof storefrontArtistCurationSchema>;
export type StorefrontCuration = z.infer<typeof storefrontCurationSchema>;

export function emptyStorefrontCuration(): StorefrontCuration {
  return {
    schemaVersion: STOREFRONT_CURATION_SCHEMA_VERSION,
    egoHygieneEntryIds: [],
    incomprisEntryIds: [],
    featuredIncomprisEntryIds: [],
    artists: [],
  };
}

function validateArtistEntries(
  ids: readonly string[],
  path: string,
  byId: ReadonlyMap<string, StoreEntry>,
  issues: string[],
  songIds?: ReadonlySet<string>,
): void {
  const seen = new Set<string>();
  const expected = songIds ? "collection" : "design, product, or collection";
  ids.forEach((id, index) => {
    const referencePath = `${path}.${index}`;
    if (seen.has(id)) issues.push(`${referencePath}: Duplicate reference ${id}`);
    seen.add(id);
    const entry = byId.get(id);
    if (!entry || entry.kind === "context" || (songIds && entry.kind !== "collection")) {
      issues.push(`${referencePath}: Expected ${expected} reference, received ${id}`);
      return;
    }
    if (entry.visibility !== "public") {
      issues.push(`${referencePath}: Storefront curation cannot reference draft ${id}`);
      return;
    }
    if (songIds && !entry.contextIds.some((id) => songIds.has(id))) {
      issues.push(`${referencePath}: Song collections require a direct public song context`);
    }
  });
}

/** Resolve the public editorial lists against an already validated canonical catalog. */
export function parseStorefrontCuration(
  value: unknown,
  catalog: StoreCatalog,
  source = "storefront-curation.json",
): StorefrontCuration {
  const parsed = storefrontCurationSchema.safeParse(value);
  if (!parsed.success) {
    throw new StoreCatalogError(
      parsed.error.issues.map(
        (issue) => `${source}:${issue.path.join(".") || "$"}: ${issue.message}`,
      ),
    );
  }

  const curation = parsed.data;
  const issues: string[] = [];
  const byId = new Map(catalog.entries.map((entry) => [entry.id, entry]));
  const songIds = new Set(
    catalog.entries
      .filter(
        (entry) =>
          entry.kind === "context" && entry.contextType === "song" && entry.visibility === "public",
      )
      .map((entry) => entry.id),
  );
  const fields = ["egoHygieneEntryIds", "incomprisEntryIds", "featuredIncomprisEntryIds"] as const;
  for (const field of fields) {
    const seen = new Set<string>();
    curation[field].forEach((id, index) => {
      const path = `${source}:${field}.${index}`;
      if (seen.has(id)) issues.push(`${path}: Duplicate reference ${id}`);
      seen.add(id);
      const entry = byId.get(id);
      if (!entry || entry.kind === "context") {
        issues.push(`${path}: Expected design, product, or collection reference, received ${id}`);
      } else if (entry.visibility !== "public") {
        issues.push(`${path}: Storefront curation cannot reference draft ${id}`);
      }
      if (field === "featuredIncomprisEntryIds" && !curation.incomprisEntryIds.includes(id)) {
        issues.push(`${path}: Featured entries must also appear in incomprisEntryIds`);
      }
    });
  }
  const artistIds = new Set<string>();
  curation.artists.forEach((selection, artistIndex) => {
    const path = `${source}:artists.${artistIndex}`;
    if (artistIds.has(selection.artistId)) {
      issues.push(`${path}.artistId: Duplicate artist reference ${selection.artistId}`);
    }
    artistIds.add(selection.artistId);
    const artist = byId.get(selection.artistId);
    if (artist?.kind !== "context" || artist.contextType !== "artist") {
      issues.push(
        `${path}.artistId: Expected artist context reference, received ${selection.artistId}`,
      );
    } else if (artist.visibility !== "public") {
      issues.push(
        `${path}.artistId: Storefront curation cannot reference draft ${selection.artistId}`,
      );
    }

    validateArtistEntries(selection.standaloneEntryIds, `${path}.standaloneEntryIds`, byId, issues);
    validateArtistEntries(
      selection.songCollectionIds,
      `${path}.songCollectionIds`,
      byId,
      issues,
      songIds,
    );
  });
  if (issues.length) throw new StoreCatalogError(issues);
  return curation;
}
