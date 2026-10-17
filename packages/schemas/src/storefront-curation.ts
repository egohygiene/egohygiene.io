import { z } from "zod";
import type { StoreCatalog } from "./store.ts";
import { StoreCatalogError, storeDesignSchema } from "./store.ts";

export const STOREFRONT_CURATION_SCHEMA_VERSION = 1;
const entryIds = z.array(storeDesignSchema.shape.id);

/** Editorial placement only: these lists do not confer artist ownership or purchase approval. */
export const storefrontCurationSchema = z.strictObject({
  schemaVersion: z.literal(STOREFRONT_CURATION_SCHEMA_VERSION),
  egoHygieneEntryIds: entryIds,
  incomprisEntryIds: entryIds,
  featuredIncomprisEntryIds: entryIds,
});

export type StorefrontCuration = z.infer<typeof storefrontCurationSchema>;

export function emptyStorefrontCuration(): StorefrontCuration {
  return {
    schemaVersion: STOREFRONT_CURATION_SCHEMA_VERSION,
    egoHygieneEntryIds: [],
    incomprisEntryIds: [],
    featuredIncomprisEntryIds: [],
  };
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
  if (issues.length) throw new StoreCatalogError(issues);
  return curation;
}
