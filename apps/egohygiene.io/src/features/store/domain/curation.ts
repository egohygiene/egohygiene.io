import type { StoreCatalog } from "@egohygiene/schemas";
import type { BrowsableStoreEntry } from "./catalog.ts";
import { isBrowsableEntry } from "./catalog.ts";

/** Preserve the author's explicit order and canonical objects; never infer extra merchandise. */
export function getCuratedStoreEntries(
  catalog: StoreCatalog,
  ids: readonly string[],
): BrowsableStoreEntry[] {
  const entries = new Map(
    catalog.entries.filter(isBrowsableEntry).map((entry) => [entry.id, entry]),
  );
  return [...new Set(ids)].flatMap((id) => {
    const entry = entries.get(id);
    return entry ? [entry] : [];
  });
}
