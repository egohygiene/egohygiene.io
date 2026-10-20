import { storeContentLocaleSchema } from "./store-localization.ts";
import {
  parseStoreCatalog,
  STORE_SCHEMA_VERSION,
  StoreCatalogError,
  storeCatalogV1Schema,
  type StoreCatalog,
} from "./store.ts";

/** Explicit import migration; current parsers never silently accept old or unknown versions. */
export function migrateStoreCatalogV1(input: unknown, options: { readonly sourceLocale: string }): StoreCatalog {
  const locale = storeContentLocaleSchema.safeParse(options?.sourceLocale);
  if (!locale.success) throw new StoreCatalogError(["migration:sourceLocale: Supply the explicitly reviewed canonical source language"]);
  const legacy = storeCatalogV1Schema.safeParse(input);
  if (!legacy.success) {
    throw new StoreCatalogError(legacy.error.issues.map((issue) =>
      `catalog-v1:${issue.path.join(".") || "$"}: ${issue.message}`));
  }
  // Parsing allocates new records; retain the original v1 input for code/data rollback.
  // Existing field and relation rules are shared; upgrading cannot create purchase approval.
  return parseStoreCatalog(legacy.data.entries.map((entry) => ({
    source: `migration:${entry.id}`,
    value: {
      ...entry,
      schemaVersion: STORE_SCHEMA_VERSION,
      sourceLocale: locale.data,
      translations: [],
      attribution: { status: "unknown" },
    },
  })), legacy.data.checkoutRoutes);
}
