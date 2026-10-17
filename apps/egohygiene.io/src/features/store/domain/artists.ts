import type { StoreCatalog, StorefrontCuration } from "@egohygiene/schemas";
import type { BrowsableStoreEntry, StoreCollection, StoreContext } from "./catalog.ts";
import { getCuratedStoreEntries } from "./curation.ts";

export type StoreArtistContext = StoreContext & { contextType: "artist" };
export type StorefrontArtist = {
  artist: StoreArtistContext;
  standaloneEntries: BrowsableStoreEntry[];
  songCollections: StoreCollection[];
};

/** Public artist views use explicit editorial membership, never inferred authorship. */
export function getCuratedStoreArtists(
  catalog: StoreCatalog,
  curation: StorefrontCuration,
): StorefrontArtist[] {
  const byId = new Map(catalog.entries.map((entry) => [entry.id, entry]));
  const seen = new Set<string>();
  return curation.artists.flatMap((selection) => {
    const artist = byId.get(selection.artistId);
    if (
      artist?.kind !== "context" ||
      artist.contextType !== "artist" ||
      artist.visibility !== "public" ||
      seen.has(artist.id)
    )
      return [];
    seen.add(artist.id);
    const songCollections = getCuratedStoreEntries(catalog, selection.songCollectionIds).filter(
      (entry): entry is StoreCollection =>
        entry.kind === "collection" &&
        entry.contextIds.some((contextId) => {
          const context = byId.get(contextId);
          return (
            context?.kind === "context" &&
            context.contextType === "song" &&
            context.visibility === "public"
          );
        }),
    );
    return [
      {
        artist: artist as StoreArtistContext,
        standaloneEntries: getCuratedStoreEntries(catalog, selection.standaloneEntryIds),
        songCollections,
      },
    ];
  });
}

export function getCuratedStoreArtist(
  catalog: StoreCatalog,
  curation: StorefrontCuration,
  slug: string,
): StorefrontArtist | undefined {
  return getCuratedStoreArtists(catalog, curation).find((view) => view.artist.slug === slug);
}

export function storeArtistPath(artist: StoreArtistContext): string {
  return `/store/incompris/artists/${artist.slug}`;
}
