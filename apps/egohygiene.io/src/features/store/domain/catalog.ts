import type { StoreCatalog, StoreDesign, StoreEntry, StoreProduct } from "@egohygiene/schemas";

export type StoreCollection = Extract<StoreEntry, { kind: "collection" }>;
export type StoreContext = Extract<StoreEntry, { kind: "context" }>;
export type BrowsableStoreEntry = StoreDesign | StoreProduct | StoreCollection;
export type StoreView = "all" | "product" | "design" | "collection";
export type StoreStory = "all" | "connected" | "standalone";

export function isBrowsableEntry(entry: StoreEntry): entry is BrowsableStoreEntry {
  return entry.kind !== "context" && entry.visibility === "public";
}

export function storeEntryPath(entry: BrowsableStoreEntry): string {
  const segments = { design: "designs", product: "products", collection: "collections" };
  return `/store/${segments[entry.kind]}/${entry.slug}`;
}

/** Explicit artwork leads; collection products append their declared artwork, first occurrence wins. */
export function getEntryDesigns(catalog: StoreCatalog, entry: BrowsableStoreEntry): StoreDesign[] {
  if (entry.kind === "design") return [entry];
  const byId = new Map(catalog.entries.map((candidate) => [candidate.id, candidate]));
  const ids = new Set(entry.designIds);
  if (entry.kind === "collection") {
    for (const productId of entry.productIds) {
      const candidate = byId.get(productId);
      if (candidate?.kind === "product") {
        candidate.designIds.forEach((id) => { ids.add(id); });
      }
    }
  }
  return [...ids].map((id) => byId.get(id)).filter((candidate): candidate is StoreDesign =>
    candidate?.kind === "design" && candidate.visibility === "public");
}

export function getEntryContexts(catalog: StoreCatalog, entry: BrowsableStoreEntry): StoreContext[] {
  const ids = new Set(entry.contextIds);
  getEntryDesigns(catalog, entry).forEach((design) => {
    design.contextIds.forEach((id) => { ids.add(id); });
  });
  return catalog.entries.filter((candidate): candidate is StoreContext =>
    candidate.kind === "context" && candidate.visibility === "public" && ids.has(candidate.id));
}

/** Search follows shared designs and contexts without turning an association into ownership. */
export function filterStoreEntries(
  catalog: StoreCatalog,
  query: string,
  view: StoreView,
  story: StoreStory = "all",
): BrowsableStoreEntry[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return catalog.entries.filter(isBrowsableEntry).filter((entry) => {
    if (view !== "all" && entry.kind !== view) return false;
    const contexts = getEntryContexts(catalog, entry);
    if (story === "connected" && contexts.length === 0) return false;
    if (story === "standalone" && contexts.length > 0) return false;
    const related = [...getEntryDesigns(catalog, entry), ...contexts];
    const haystack = [entry.title, entry.description, entry.kind, ...related.map((item) => `${item.title} ${item.description}`)]
      .join(" ").toLocaleLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export function getDesignProducts(catalog: StoreCatalog, designId: string): StoreProduct[] {
  return catalog.entries.filter((entry): entry is StoreProduct =>
    entry.kind === "product" && entry.visibility === "public" && entry.designIds.includes(designId));
}

export function getRelatedCollections(catalog: StoreCatalog, entry: StoreDesign | StoreProduct): StoreCollection[] {
  const designIds = entry.kind === "design" ? [entry.id] : entry.designIds;
  return catalog.entries.filter((candidate): candidate is StoreCollection =>
    candidate.kind === "collection" && candidate.visibility === "public" && (
      (entry.kind === "product" && candidate.productIds.includes(entry.id)) ||
      getEntryDesigns(catalog, candidate).some((design) => designIds.includes(design.id))
    ));
}
