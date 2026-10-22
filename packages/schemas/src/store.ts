import { z } from "zod";
import {
  publicStoreTranslations,
  storeAttributionSchema,
  storeContentLocaleSchema,
  storeReferenceIdSchema,
  storeTranslationSchema,
  validateStoreTranslations,
} from "./store-localization.ts";

import {
  storeArtworkPathSchema,
  storeCheckoutRouteFields,
  storeDisplayPriceSchema,
  storeQualificationSchema,
  storeReadinessSnapshotSchema,
  storeReadinessSnapshotsEqual,
  storeRouteDisclosuresSchema,
  storeVariantSchema,
  type StoreReadinessSnapshot,
  type StoreRouteDisclosures,
} from "./store-readiness.ts";

export const STORE_SCHEMA_VERSION = 3;
const id = storeReferenceIdSchema;
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug");
const text = z.string().trim().min(1);
const references = z.array(id).default([]);
const commonBase = {
  id,
  slug,
  title: text,
  description: text,
  visibility: z.enum(["draft", "public"]),
};
const base = {
  ...commonBase,
  schemaVersion: z.literal(STORE_SCHEMA_VERSION),
  sourceLocale: storeContentLocaleSchema,
  translations: z.array(storeTranslationSchema).default([]),
  attribution: storeAttributionSchema.default({ status: "unknown" }),
};

export const storeArtworkSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("placeholder"), label: text }),
  z.strictObject({
    kind: z.literal("image"),
    src: storeArtworkPathSchema,
    alt: text,
  }),
]);

const designFields = {
  kind: z.literal("design"),
  contextIds: references,
  artworkRevision: z.number().int().positive(),
  artwork: storeArtworkSchema,
};
export const storeDesignSchema = z.strictObject({ ...base, ...designFields });

export const storePurchaseSchema = z.discriminatedUnion("state", [
  z.strictObject({ state: z.literal("preview") }),
  z.strictObject({ state: z.literal("unavailable"), reason: text }),
  z.strictObject({
    state: z.literal("live"),
    provider: z.literal("fourthwall"),
    routeId: id,
    variants: z.array(storeVariantSchema).min(1),
    displayPrice: storeDisplayPriceSchema.optional(),
  }),
]);

const productFields = {
  kind: z.literal("product"),
  designIds: z.array(id).min(1),
  contextIds: references,
  purchase: storePurchaseSchema,
};
export const storeProductSchema = z.strictObject({ ...base, ...productFields });

const collectionFields = {
  kind: z.literal("collection"),
  designIds: references,
  productIds: references,
  contextIds: references,
};
export const storeCollectionSchema = z.strictObject({ ...base, ...collectionFields });

const legacyContextType = z.enum(["artist", "realm", "song", "character", "appearance"]);

export const storeContextSchema = z.strictObject({
  ...base,
  kind: z.literal("context"),
  contextType: legacyContextType.or(z.literal("brand")),
});

export const storeEntrySchema = z.discriminatedUnion("kind", [
  storeDesignSchema, storeProductSchema, storeCollectionSchema, storeContextSchema,
]);

// Routes stage offer facts; only a current explicit qualification can authorize a live action.
export const storeCheckoutRouteSchema = z.strictObject({
  ...storeCheckoutRouteFields,
  disclosures: storeRouteDisclosuresSchema.optional(),
  qualification: storeQualificationSchema.default({ status: "unreviewed" }),
});

// Historical migration inputs retain their original route contract; no approval is invented.
export const storeCheckoutRouteV2Schema = z.strictObject(storeCheckoutRouteFields);

/**
 * Validates the versioned envelope and record shapes, not cross-record relationships.
 * Public projection and live purchase actions also run the catalog reference and review checks.
 */
export const storeCatalogSchema = z.strictObject({
  schemaVersion: z.literal(STORE_SCHEMA_VERSION),
  entries: z.array(storeEntrySchema),
  checkoutRoutes: z.array(storeCheckoutRouteSchema),
});

// Explicit v1 compatibility input: shared unchanged field rules, without v2 content/rights fields.
const legacyBase = { ...commonBase, schemaVersion: z.literal(1) };
export const storeEntryV1Schema = z.discriminatedUnion("kind", [
  z.strictObject({ ...legacyBase, ...designFields }),
  z.strictObject({ ...legacyBase, ...productFields }),
  z.strictObject({ ...legacyBase, ...collectionFields }),
  z.strictObject({ ...legacyBase, kind: z.literal("context"), contextType: legacyContextType }),
]);
export const storeCatalogV1Schema = z.strictObject({
  schemaVersion: z.literal(1),
  entries: z.array(storeEntryV1Schema),
  checkoutRoutes: z.array(storeCheckoutRouteV2Schema),
});

const v2Base = { ...base, schemaVersion: z.literal(2) };
export const storeEntryV2Schema = z.discriminatedUnion("kind", [
  z.strictObject({ ...v2Base, ...designFields }),
  z.strictObject({ ...v2Base, ...productFields }),
  z.strictObject({ ...v2Base, ...collectionFields }),
  z.strictObject({ ...v2Base, kind: z.literal("context"), contextType: legacyContextType.or(z.literal("brand")) }),
]);
export const storeCatalogV2Schema = z.strictObject({
  schemaVersion: z.literal(2),
  entries: z.array(storeEntryV2Schema),
  checkoutRoutes: z.array(storeCheckoutRouteV2Schema),
});
export type StoreCatalogV2 = z.infer<typeof storeCatalogV2Schema>;
export type StoreEntryV2 = z.infer<typeof storeEntryV2Schema>;

export type StoreEntry = z.infer<typeof storeEntrySchema>;
export type StoreDesign = z.infer<typeof storeDesignSchema>;
export type StoreProduct = z.infer<typeof storeProductSchema>;
export type StoreCheckoutRoute = z.infer<typeof storeCheckoutRouteSchema>;
export type StoreSource = { source: string; value: unknown };
export type StoreCatalog = z.infer<typeof storeCatalogSchema>;

export class StoreCatalogError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Store catalog validation failed:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
    this.name = "StoreCatalogError";
    this.issues = issues;
  }
}

export function parseStoreCatalog(sources: StoreSource[], routes: unknown = []): StoreCatalog {
  return storeCatalogSchema.parse(parseCatalogVersion(sources, routes, STORE_SCHEMA_VERSION));
}

/** Historical relationship validation for explicit migrations only; never a storefront runtime. */
export function parseStoreCatalogV2(sources: StoreSource[], routes: unknown = []): StoreCatalogV2 {
  return storeCatalogV2Schema.parse(parseCatalogVersion(sources, routes, 2));
}

function parseCatalogVersion(sources: StoreSource[], routes: unknown, version: 2 | 3) {
  const issues: string[] = [];
  const records: { source: string; entry: StoreEntry | StoreEntryV2 }[] = [];
  for (const source of sources) {
    const result = (version === 2 ? storeEntryV2Schema : storeEntrySchema).safeParse(source.value);
    if (result.success) records.push({ source: source.source, entry: result.data });
    else for (const issue of result.error.issues) {
      issues.push(`${source.source}:${issue.path.join(".") || "$"}: ${issue.message}`);
    }
  }
  const routeResult = z.array(version === 2 ? storeCheckoutRouteV2Schema : storeCheckoutRouteSchema).safeParse(routes);
  if (!routeResult.success) for (const issue of routeResult.error.issues) {
    issues.push(`checkout-routes:${issue.path.join(".")}: ${issue.message}`);
  }
  // Do not cascade reference errors from entries with invalid shapes.
  if (issues.length) throw new StoreCatalogError(issues);
  const checkoutRoutes = routeResult.success ? routeResult.data : [];
  const byId = new Map<string, (typeof records)[number]>();
  const slugs = new Set<string>();
  for (const record of records) {
    const { source, entry } = record;
    if (byId.has(entry.id)) issues.push(`${source}:id: Duplicate ID ${entry.id}`);
    else byId.set(entry.id, record);
    if (slugs.has(entry.slug)) issues.push(`${source}:slug: Duplicate slug ${entry.slug}`);
    slugs.add(entry.slug);
  }
  for (const { source, entry } of records) {
    const check = (field: string, ids: string[], kind: StoreEntry["kind"]) => {
      const seen = new Set<string>();
      ids.forEach((reference, index) => {
        const path = `${source}:${field}.${index}`;
        if (seen.has(reference)) issues.push(`${path}: Duplicate reference ${reference}`);
        seen.add(reference);
        const target = byId.get(reference)?.entry;
        if (!target || target.kind !== kind) issues.push(`${path}: Expected ${kind} reference, received ${reference}`);
        else if (entry.visibility === "public" && target.visibility !== "public") {
          issues.push(`${path}: Public entries cannot reference draft ${reference}`);
        }
      });
    };
    if ("contextIds" in entry) check("contextIds", entry.contextIds, "context");
    if ("designIds" in entry) check("designIds", entry.designIds, "design");
    if ("productIds" in entry) check("productIds", entry.productIds, "product");
    issues.push(...validateStoreTranslations(entry, source));
    if (entry.attribution.status === "declared") {
      for (const field of ["creatorIds", "rightsHolderIds"] as const) {
        const seen = new Set<string>();
        entry.attribution[field].forEach((reference, index) => {
          const path = `${source}:attribution.${field}.${index}`;
          if (seen.has(reference)) issues.push(`${path}: Duplicate attribution reference ${reference}`);
          seen.add(reference);
          const target = byId.get(reference)?.entry;
          if (!target || target.kind !== "context" || !["artist", "brand"].includes(target.contextType)) {
            issues.push(`${path}: Expected an artist or brand reference, received ${reference}`);
          } else if (entry.visibility === "public" && target.visibility !== "public") {
            issues.push(`${path}: Public attribution cannot reference draft ${reference}`);
          }
        });
      }
    }
  }
  const routeIds = new Set<string>();
  for (const [index, route] of checkoutRoutes.entries()) {
    if (routeIds.has(route.id)) issues.push(`checkout-routes:${index}.id: Duplicate route ID ${route.id}`);
    routeIds.add(route.id);
    if (byId.get(route.productId)?.entry.kind !== "product") {
      issues.push(`checkout-routes:${index}.productId: Unknown product ${route.productId}`);
    }
    if (new Set(route.providerVariantIds).size !== route.providerVariantIds.length) {
      issues.push(`checkout-routes:${index}.providerVariantIds: Duplicate provider variant`);
    }
    const designIds = new Set<string>();
    route.artworkRevisions.forEach((artwork, artworkIndex) => {
      const product = byId.get(route.productId)?.entry;
      if (designIds.has(artwork.designId)) {
        issues.push(`checkout-routes:${index}.artworkRevisions.${artworkIndex}: Duplicate design approval`);
      }
      designIds.add(artwork.designId);
      if (product?.kind !== "product" || !product.designIds.includes(artwork.designId)) {
        issues.push(`checkout-routes:${index}.artworkRevisions.${artworkIndex}.designId: Design does not belong to this product`);
      }
    });
  }
  for (const { source, entry } of records) {
    if (entry.kind !== "product" || entry.purchase.state !== "live") continue;
    const purchase = entry.purchase;
    const route = checkoutRoutes.find((candidate) => candidate.id === purchase.routeId);
    if (!route || route.productId !== entry.id || route.provider !== purchase.provider) {
      issues.push(`${source}:purchase.routeId: Live products require a reviewed route for this product`);
      continue;
    }
    if (version === STORE_SCHEMA_VERSION) {
      const currentRoute = storeCheckoutRouteSchema.safeParse(route);
      if (!currentRoute.success || !isStoreQualificationCurrent(currentRoute.data, entry,
        records.flatMap(({ entry: candidate }) => candidate.kind === "design" ? [candidate] : []))) {
        issues.push(`${source}:purchase.routeId: Live products require a current reviewed qualification`);
      }
    }
    entry.designIds.forEach((designId, index) => {
      const design = byId.get(designId)?.entry;
      const approved = route.artworkRevisions.find((artwork) => artwork.designId === designId);
      if (design?.kind !== "design" || design.artwork.kind !== "image" || approved?.revision !== design.artworkRevision) {
        issues.push(`${source}:designIds.${index}: Live products require image artwork at the reviewed revision`);
      }
    });
    const variantIds = new Set<string>();
    const providerIds = new Set<string>();
    purchase.variants.forEach((variant, index) => {
      if (variantIds.has(variant.id) || providerIds.has(variant.providerVariantId)) {
        issues.push(`${source}:purchase.variants.${index}: Duplicate variant mapping`);
      }
      variantIds.add(variant.id);
      providerIds.add(variant.providerVariantId);
      if (!route.providerVariantIds.includes(variant.providerVariantId)) {
        issues.push(`${source}:purchase.variants.${index}.providerVariantId: Variant is not on the reviewed route`);
      }
    });
  }
  if (issues.length) throw new StoreCatalogError(issues);
  return { schemaVersion: version, entries: records.map(({ entry }) => entry), checkoutRoutes };
}

/** Validate the complete runtime envelope before applying the source-aware relationship checks. */
function validateStoreCatalog(catalog: unknown): StoreCatalog {
  const result = storeCatalogSchema.safeParse(catalog);
  if (!result.success) {
    throw new StoreCatalogError(result.error.issues.map((issue) =>
      `catalog:${issue.path.join(".") || "$"}: ${issue.message}`));
  }
  return parseStoreCatalog(
    result.data.entries.map((value) => ({ source: value.id, value })),
    result.data.checkoutRoutes,
  );
}

// Explicit allowlisted schemas above reject unknown fields, including private authoring metadata.
// A draft remains public Git content; the Node adapter excludes it from browser output.
export function toPublicStoreCatalog(catalog: StoreCatalog): StoreCatalog {
  const validated = validateStoreCatalog(catalog);
  const entries = validated.entries.filter((entry) => entry.visibility === "public")
    .map((entry) => ({ ...entry, translations: publicStoreTranslations(entry) }));
  const usedRoutes = new Set(entries.flatMap((entry) =>
    entry.kind === "product" && entry.purchase.state === "live" ? [entry.purchase.routeId] : []));
  return { schemaVersion: STORE_SCHEMA_VERSION, entries, checkoutRoutes: validated.checkoutRoutes.filter((route) => usedRoutes.has(route.id)) };
}

export type StorePurchaseAction =
  | { kind: "disabled"; label: string }
  | { kind: "external"; label: string; href: string; disclosures: StoreRouteDisclosures };

export function getStorePurchaseAction(catalog: StoreCatalog, productId: string): StorePurchaseAction {
  const product = catalog.entries.find((entry) => entry.id === productId);
  if (!product || product.kind !== "product" || product.visibility !== "public") {
    return { kind: "disabled", label: "Unavailable" };
  }
  switch (product.purchase.state) {
    case "preview": return { kind: "disabled", label: "Preview — coming later" };
    case "unavailable": return { kind: "disabled", label: product.purchase.reason };
    case "live": {
      // Revalidate at the purchase boundary; malformed runtime config must never create a link.
      const validated = validateStoreCatalog(catalog);
      const routeId = product.purchase.routeId;
      const route = validated.checkoutRoutes.find((candidate) => candidate.id === routeId);
      if (!route?.disclosures) return { kind: "disabled", label: "Unavailable" };
      return { kind: "external", label: "Shop on Fourthwall", href: route.checkoutUrl, disclosures: route.disclosures };
    }
  }
}


type ReadinessProduct = Pick<StoreProduct, "id" | "designIds" | "purchase">;
type ReadinessDesign = Pick<StoreDesign, "id" | "artworkRevision" | "artwork">;

/** Capture current public offer facts for human review. This helper never creates an approval. */
export function getStoreReadinessSnapshot(
  route: StoreCheckoutRoute,
  product: ReadinessProduct,
  designs: readonly ReadinessDesign[],
): StoreReadinessSnapshot {
  if (product.purchase.state !== "live") throw new Error("Readiness snapshots require a configured live product");
  if (route.productId !== product.id || route.id !== product.purchase.routeId || route.provider !== product.purchase.provider) {
    throw new Error("Readiness snapshots require the exact product and purchase route");
  }
  return storeReadinessSnapshotSchema.parse({
    route: {
      id: route.id,
      provider: route.provider,
      productId: route.productId,
      checkoutUrl: route.checkoutUrl,
      providerVariantIds: route.providerVariantIds,
      artworkRevisions: route.artworkRevisions,
      disclosures: route.disclosures,
    },
    variants: product.purchase.variants,
    displayPrice: product.purchase.displayPrice ?? null,
    artwork: product.designIds.map((designId) => {
      const design = designs.find((candidate) => candidate.id === designId);
      return {
        designId,
        revision: design?.artworkRevision,
        src: design?.artwork.kind === "image" ? design.artwork.src : undefined,
      };
    }),
  });
}

/** Current means exact reviewed bindings, not a remote provider/rights check or clock-based expiry. */
export function isStoreQualificationCurrent(
  route: StoreCheckoutRoute,
  product: ReadinessProduct,
  designs: readonly ReadinessDesign[],
): boolean {
  const qualification = storeQualificationSchema.safeParse(route.qualification);
  if (!qualification.success || qualification.data.status !== "reviewed") return false;
  try {
    return storeReadinessSnapshotsEqual(qualification.data.snapshot, getStoreReadinessSnapshot(route, product, designs));
  } catch {
    return false;
  }
}
