import { storeContentLocaleSchema } from "./store-localization.ts";
import {
  parseStoreCatalog,
  parseStoreCatalogV2,
  STORE_SCHEMA_VERSION,
  StoreCatalogError,
  storeCatalogV1Schema,
  storeCatalogV2Schema,
  type StoreCatalog,
  type StoreCatalogV2,
} from "./store.ts";

/** Explicit import migration; current parsers never silently accept old or unknown versions. */
export function migrateStoreCatalogV1(
  input: unknown,
  options: { readonly sourceLocale: string },
): StoreCatalogV2 {
  const locale = storeContentLocaleSchema.safeParse(options?.sourceLocale);
  if (!locale.success)
    throw new StoreCatalogError([
      "migration:sourceLocale: Supply the explicitly reviewed canonical source language",
    ]);
  const legacy = storeCatalogV1Schema.safeParse(input);
  if (!legacy.success) {
    throw new StoreCatalogError(
      legacy.error.issues.map(
        (issue) => `catalog-v1:${issue.path.join(".") || "$"}: ${issue.message}`,
      ),
    );
  }
  // Parsing allocates new records; retain the original v1 input for code/data rollback.
  // Existing field and relation rules are shared; upgrading cannot create purchase approval.
  return parseStoreCatalogV2(
    legacy.data.entries.map((entry) => ({
      source: `migration:${entry.id}`,
      value: {
        ...entry,
        schemaVersion: 2,
        sourceLocale: locale.data,
        translations: [],
        attribution: { status: "unknown" },
      },
    })),
    legacy.data.checkoutRoutes,
  );
}

/** Adjacent v2 → v3 migration never manufactures qualification or destroys an offer mapping. */
export function migrateStoreCatalogV2(input: unknown): StoreCatalog {
  const legacy = storeCatalogV2Schema.safeParse(input);
  if (!legacy.success) {
    throw new StoreCatalogError(
      legacy.error.issues.map(
        (issue) => `catalog-v2:${issue.path.join(".") || "$"}: ${issue.message}`,
      ),
    );
  }
  const validated = parseStoreCatalogV2(
    legacy.data.entries.map((value) => ({ source: `migration:${value.id}`, value })),
    legacy.data.checkoutRoutes,
  );
  const live = validated.entries.filter(
    (entry) => entry.kind === "product" && entry.purchase.state === "live",
  );
  if (live.length) {
    throw new StoreCatalogError(
      live.map(
        (entry) =>
          `migration:${entry.id}:purchase: A legacy live product needs explicit manual requalification for v3; retain its original mappings and source, then author the reviewed v3 record`,
      ),
    );
  }
  return parseStoreCatalog(
    validated.entries.map((entry) => ({
      source: `migration:${entry.id}`,
      value: { ...entry, schemaVersion: STORE_SCHEMA_VERSION },
    })),
    validated.checkoutRoutes,
  );
}
