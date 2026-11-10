import type { StoreCatalog, StoreDesign, StoreEntry, StoreProduct } from "@egohygiene/schemas";
import {
  getStoreEntryContent,
  normalizeStoreSearchText,
  type StoreContentSelection,
} from "./localization.ts";

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
function resolveEntryDesigns(
  byId: ReadonlyMap<string, StoreEntry>,
  entry: BrowsableStoreEntry,
): StoreDesign[] {
  if (entry.kind === "design") return [entry];
  const ids = new Set(entry.designIds);
  if (entry.kind === "collection") {
    for (const productId of entry.productIds) {
      const candidate = byId.get(productId);
      if (candidate?.kind === "product") {
        candidate.designIds.forEach((id) => {
          ids.add(id);
        });
      }
    }
  }
  return [...ids]
    .map((id) => byId.get(id))
    .filter(
      (candidate): candidate is StoreDesign =>
        candidate?.kind === "design" && candidate.visibility === "public",
    );
}

export function getEntryDesigns(catalog: StoreCatalog, entry: BrowsableStoreEntry): StoreDesign[] {
  if (entry.kind === "design") return [entry];
  return resolveEntryDesigns(
    new Map(catalog.entries.map((candidate) => [candidate.id, candidate])),
    entry,
  );
}

function resolveEntryContexts(
  catalog: StoreCatalog,
  entry: BrowsableStoreEntry,
  designs: readonly StoreDesign[],
): StoreContext[] {
  const ids = new Set(entry.contextIds);
  designs.forEach((design) => {
    design.contextIds.forEach((id) => {
      ids.add(id);
    });
  });
  return catalog.entries.filter(
    (candidate): candidate is StoreContext =>
      candidate.kind === "context" && candidate.visibility === "public" && ids.has(candidate.id),
  );
}

export function getEntryContexts(
  catalog: StoreCatalog,
  entry: BrowsableStoreEntry,
): StoreContext[] {
  return resolveEntryContexts(catalog, entry, getEntryDesigns(catalog, entry));
}

/** Search follows shared designs and contexts without turning an association into ownership. */
export function filterStoreEntries(
  catalog: StoreCatalog,
  query: string,
  view: StoreView,
  story: StoreStory = "all",
  selection?: StoreContentSelection,
): BrowsableStoreEntry[] {
  // Reuse lookup work within this call only; callers may replace or edit catalog entries.
  const byId = new Map(catalog.entries.map((entry) => [entry.id, entry]));
  return catalog.entries.filter(isBrowsableEntry).filter((entry) => {
    if (view !== "all" && entry.kind !== view) return false;
    const designs = resolveEntryDesigns(byId, entry);
    const contexts = resolveEntryContexts(catalog, entry, designs);
    if (story === "connected" && contexts.length === 0) return false;
    if (story === "standalone" && contexts.length > 0) return false;
    const related = [...designs, ...contexts];
    const locale = selection?.locale ?? entry.sourceLocale;
    const terms = normalizeStoreSearchText(query, locale).trim().split(/\s+/).filter(Boolean);
    const text = [entry, ...related].flatMap((item) => {
      const content = getStoreEntryContent(item, selection ?? { locale: item.sourceLocale });
      // Original creative names remain aliases; unrelated translations and hidden copy do not.
      return [content.title.value, content.description.value, item.title];
    });
    const haystack = normalizeStoreSearchText([entry.kind, ...text].join(" "), locale);
    return terms.every((term) => haystack.includes(term));
  });
}

export function getDesignProducts(catalog: StoreCatalog, designId: string): StoreProduct[] {
  return catalog.entries.filter(
    (entry): entry is StoreProduct =>
      entry.kind === "product" &&
      entry.visibility === "public" &&
      entry.designIds.includes(designId),
  );
}

export function getRelatedCollections(
  catalog: StoreCatalog,
  entry: StoreDesign | StoreProduct,
): StoreCollection[] {
  const designIds = entry.kind === "design" ? [entry.id] : entry.designIds;
  const byId = new Map(catalog.entries.map((candidate) => [candidate.id, candidate]));
  return catalog.entries.filter(
    (candidate): candidate is StoreCollection =>
      candidate.kind === "collection" &&
      candidate.visibility === "public" &&
      ((entry.kind === "product" && candidate.productIds.includes(entry.id)) ||
        resolveEntryDesigns(byId, candidate).some((design) => designIds.includes(design.id))),
  );
}
