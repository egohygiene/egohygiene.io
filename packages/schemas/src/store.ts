import { z } from "zod";

export const STORE_SCHEMA_VERSION = 1;
const id = z
  .string()
  .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)+$/, "Use a stable lowercase hyphenated ID");
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase URL slug");
const text = z.string().trim().min(1);
const references = z.array(id).default([]);
const base = {
  schemaVersion: z.literal(STORE_SCHEMA_VERSION),
  id,
  slug,
  title: text,
  description: text,
  visibility: z.enum(["draft", "public"]),
};

export const storeArtworkSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("placeholder"), label: text }),
  z.strictObject({
    kind: z.literal("image"),
    src: z
      .string()
      .regex(
        /^\/store\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:png|jpg|jpeg|webp|avif)$/,
        "Use an approved local /store/ image derivative",
      ),
    alt: text,
  }),
]);

export const storeDesignSchema = z.strictObject({
  ...base,
  kind: z.literal("design"),
  contextIds: references,
  artworkRevision: z.number().int().positive(),
  artwork: storeArtworkSchema,
});

export const storePurchaseSchema = z.discriminatedUnion("state", [
  z.strictObject({ state: z.literal("preview") }),
  z.strictObject({ state: z.literal("unavailable"), reason: text }),
  z.strictObject({
    state: z.literal("live"),
    provider: z.literal("fourthwall"),
    routeId: id,
    variants: z.array(z.strictObject({ id, label: text, providerVariantId: text })).min(1),
    displayPrice: z
      .strictObject({
        amountMinor: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
        currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
        authority: z.literal("provider-checkout"),
      })
      .optional(),
  }),
]);

export const storeProductSchema = z.strictObject({
  ...base,
  kind: z.literal("product"),
  designIds: z.array(id).min(1),
  contextIds: references,
  purchase: storePurchaseSchema,
});

export const storeCollectionSchema = z.strictObject({
  ...base,
  kind: z.literal("collection"),
  designIds: references,
  productIds: references,
  contextIds: references,
});

export const storeContextSchema = z.strictObject({
  ...base,
  kind: z.literal("context"),
  contextType: z.enum(["artist", "realm", "song", "character", "appearance"]),
});

export const storeEntrySchema = z.discriminatedUnion("kind", [
  storeDesignSchema,
  storeProductSchema,
  storeCollectionSchema,
  storeContextSchema,
]);

// This is an explicit reviewed destination list, not a provider API or proof of availability.
export const storeCheckoutRouteSchema = z.strictObject({
  id,
  provider: z.literal("fourthwall"),
  productId: id,
  checkoutUrl: z
    .url()
    .regex(
      /^https:\/\/[a-z0-9]+(?:-[a-z0-9]+)*\.fourthwall\.com\/products\/[a-z0-9][a-z0-9-]*\/?$/,
      "Use a reviewed HTTPS Fourthwall product URL; custom domains require a later policy change",
    ),
  providerVariantIds: z.array(text).min(1),
  artworkRevisions: z
    .array(z.strictObject({ designId: id, revision: z.number().int().positive() }))
    .min(1),
});

export type StoreEntry = z.infer<typeof storeEntrySchema>;
export type StoreDesign = z.infer<typeof storeDesignSchema>;
export type StoreProduct = z.infer<typeof storeProductSchema>;
export type StoreCheckoutRoute = z.infer<typeof storeCheckoutRouteSchema>;
export type StoreSource = { source: string; value: unknown };
export type StoreCatalog = {
  schemaVersion: typeof STORE_SCHEMA_VERSION;
  entries: StoreEntry[];
  checkoutRoutes: StoreCheckoutRoute[];
};

export class StoreCatalogError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(`Store catalog validation failed:\n${issues.map((issue) => `- ${issue}`).join("\n")}`);
    this.name = "StoreCatalogError";
    this.issues = issues;
  }
}

export function parseStoreCatalog(sources: StoreSource[], routes: unknown = []): StoreCatalog {
  const issues: string[] = [];
  const records: { source: string; entry: StoreEntry }[] = [];
  for (const source of sources) {
    const result = storeEntrySchema.safeParse(source.value);
    if (result.success) records.push({ source: source.source, entry: result.data });
    else
      for (const issue of result.error.issues) {
        issues.push(`${source.source}:${issue.path.join(".") || "$"}: ${issue.message}`);
      }
  }
  const routeResult = z.array(storeCheckoutRouteSchema).safeParse(routes);
  if (!routeResult.success)
    for (const issue of routeResult.error.issues) {
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
        if (!target || target.kind !== kind)
          issues.push(`${path}: Expected ${kind} reference, received ${reference}`);
        else if (entry.visibility === "public" && target.visibility !== "public") {
          issues.push(`${path}: Public entries cannot reference draft ${reference}`);
        }
      });
    };
    if ("contextIds" in entry) check("contextIds", entry.contextIds, "context");
    if ("designIds" in entry) check("designIds", entry.designIds, "design");
    if ("productIds" in entry) check("productIds", entry.productIds, "product");
  }
  const routeIds = new Set<string>();
  for (const [index, route] of checkoutRoutes.entries()) {
    if (routeIds.has(route.id))
      issues.push(`checkout-routes:${index}.id: Duplicate route ID ${route.id}`);
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
        issues.push(
          `checkout-routes:${index}.artworkRevisions.${artworkIndex}: Duplicate design approval`,
        );
      }
      designIds.add(artwork.designId);
      if (product?.kind !== "product" || !product.designIds.includes(artwork.designId)) {
        issues.push(
          `checkout-routes:${index}.artworkRevisions.${artworkIndex}.designId: Design does not belong to this product`,
        );
      }
    });
  }
  for (const { source, entry } of records) {
    if (entry.kind !== "product" || entry.purchase.state !== "live") continue;
    const purchase = entry.purchase;
    const route = checkoutRoutes.find((candidate) => candidate.id === purchase.routeId);
    if (!route || route.productId !== entry.id || route.provider !== purchase.provider) {
      issues.push(
        `${source}:purchase.routeId: Live products require a reviewed route for this product`,
      );
      continue;
    }
    entry.designIds.forEach((designId, index) => {
      const design = byId.get(designId)?.entry;
      const approved = route.artworkRevisions.find((artwork) => artwork.designId === designId);
      if (
        design?.kind !== "design" ||
        design.artwork.kind !== "image" ||
        approved?.revision !== design.artworkRevision
      ) {
        issues.push(
          `${source}:designIds.${index}: Live products require image artwork at the reviewed revision`,
        );
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
        issues.push(
          `${source}:purchase.variants.${index}.providerVariantId: Variant is not on the reviewed route`,
        );
      }
    });
  }
  if (issues.length) throw new StoreCatalogError(issues);
  return {
    schemaVersion: STORE_SCHEMA_VERSION,
    entries: records.map(({ entry }) => entry),
    checkoutRoutes,
  };
}

// Explicit allowlisted schemas above reject unknown fields, including private authoring metadata.
// A draft remains public Git content; the Node adapter excludes it from browser output.
export function toPublicStoreCatalog(catalog: StoreCatalog): StoreCatalog {
  const validated = parseStoreCatalog(
    catalog.entries.map((value) => ({ source: value.id, value })),
    catalog.checkoutRoutes,
  );
  const entries = validated.entries.filter((entry) => entry.visibility === "public");
  const usedRoutes = new Set(
    entries.flatMap((entry) =>
      entry.kind === "product" && entry.purchase.state === "live" ? [entry.purchase.routeId] : [],
    ),
  );
  return {
    schemaVersion: STORE_SCHEMA_VERSION,
    entries,
    checkoutRoutes: validated.checkoutRoutes.filter((route) => usedRoutes.has(route.id)),
  };
}

export type StorePurchaseAction =
  | { kind: "disabled"; label: string }
  | { kind: "external"; label: string; href: string };

export function getStorePurchaseAction(
  catalog: StoreCatalog,
  productId: string,
): StorePurchaseAction {
  const product = catalog.entries.find((entry) => entry.id === productId);
  if (!product || product.kind !== "product" || product.visibility !== "public") {
    return { kind: "disabled", label: "Unavailable" };
  }
  switch (product.purchase.state) {
    case "preview":
      return { kind: "disabled", label: "Preview — coming later" };
    case "unavailable":
      return { kind: "disabled", label: product.purchase.reason };
    case "live": {
      // Revalidate at the purchase boundary; malformed runtime config must never create a link.
      const validated = parseStoreCatalog(
        catalog.entries.map((value) => ({ source: value.id, value })),
        catalog.checkoutRoutes,
      );
      const routeId = product.purchase.routeId;
      const route = validated.checkoutRoutes.find((candidate) => candidate.id === routeId);
      if (!route) return { kind: "disabled", label: "Unavailable" };
      return { kind: "external", label: "Shop on Fourthwall", href: route.checkoutUrl };
    }
  }
}
