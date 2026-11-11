import { z } from "zod";
import {
  getStoreReadinessSnapshot,
  type StoreCatalog,
  storeCatalogSchema,
  toPublicStoreCatalog,
} from "./store.ts";
import { storeReferenceIdSchema } from "./store-localization.ts";
import {
  type StoreReadinessSnapshot,
  storeArtworkPathSchema,
  storeReadinessSnapshotSchema,
} from "./store-readiness.ts";

function publicOrigin(value: string) {
  return (
    z.url({ protocol: /^https$/ }).safeParse(value).success &&
    /^https:\/\/[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,63}$/i.test(value) &&
    !/(?:\.local|\.internal|\.localhost)$/i.test(value)
  );
}

export function createStoreListingContextSchema() {
  const sha = z.string().regex(/^[a-f0-9]{64}$/);
  return z.strictObject({
    target: z.enum(["website", "provider"]),
    websiteOrigin: z.string().refine(publicOrigin, "Use the approved public HTTPS website origin"),
    sourceCommit: z.string().regex(/^[a-f0-9]{40}$/),
    projectionSha256: sha,
    buildSha256: sha.nullable(),
    assets: z.array(z.strictObject({ src: storeArtworkPathSchema, sha256: sha })),
  });
}
export type StoreListingContext = z.infer<ReturnType<typeof createStoreListingContextSchema>>;

export function createStoreListingBindingSchema() {
  const context = createStoreListingContextSchema();
  const sha = context.shape.projectionSha256;
  return z.strictObject({
    productId: storeReferenceIdSchema,
    // Immutable public snapshot: compare against the current authority, never edit from evidence.
    catalog: storeCatalogSchema,
    target: context.shape.target,
    destination: z.url({ protocol: /^https$/ }).nullable(),
    sourceCommit: context.shape.sourceCommit,
    projectionSha256: sha,
    buildSha256: sha.nullable(),
    artwork: z
      .array(
        z.strictObject({
          designId: storeReferenceIdSchema,
          revision: z.number().int().positive(),
          src: storeArtworkPathSchema.nullable(),
          sha256: sha.nullable(),
        }),
      )
      .min(1),
    offer: storeReadinessSnapshotSchema.nullable(),
  });
}
export type StoreListingBinding = z.infer<ReturnType<typeof createStoreListingBindingSchema>>;

/** Snapshot the existing public catalog/offer. No approval, provider fetch or publication occurs. */
export function getStoreListingBinding(
  catalog: StoreCatalog,
  productId: string,
  input: StoreListingContext,
): StoreListingBinding {
  const context = createStoreListingContextSchema().parse(input);
  const publicCatalog = toPublicStoreCatalog(catalog);
  const product = publicCatalog.entries.find((entry) => entry.id === productId);
  if (product?.kind !== "product") throw new Error("Listing requires an existing public product");
  if (new Set(context.assets.map((asset) => asset.src)).size !== context.assets.length)
    throw new Error("Duplicate public asset hashes");
  const designs = product.designIds.map((id) => {
    const entry = publicCatalog.entries.find((candidate) => candidate.id === id);
    if (entry?.kind !== "design") throw new Error("Listing requires an existing public design");
    return entry;
  });
  let offer: StoreReadinessSnapshot | null = null;
  if (product.purchase.state === "live") {
    const route = publicCatalog.checkoutRoutes.find(
      (candidate) => product.purchase.state === "live" && candidate.id === product.purchase.routeId,
    );
    if (!route) throw new Error("Missing current reviewed offer");
    offer = getStoreReadinessSnapshot(route, product, designs);
  }
  return {
    productId,
    catalog: publicCatalog,
    target: context.target,
    destination:
      context.target === "website"
        ? `${context.websiteOrigin}/store/products/${product.slug}`
        : (offer?.route.checkoutUrl ?? null),
    sourceCommit: context.sourceCommit,
    projectionSha256: context.projectionSha256,
    buildSha256: context.buildSha256,
    artwork: designs
      .map((design) => ({
        designId: design.id,
        revision: design.artworkRevision,
        src: design.artwork.kind === "image" ? design.artwork.src : null,
        sha256:
          design.artwork.kind === "image"
            ? (context.assets.find(
                (asset) => design.artwork.kind === "image" && asset.src === design.artwork.src,
              )?.sha256 ?? null)
            : null,
      }))
      .sort((a, b) => a.designId.localeCompare(b.designId, "en")),
    offer,
  };
}

/** A public evidence summary; private approval/production receipts are never accepted here. */
export function createStoreListingEvidenceSchema() {
  const binding = createStoreListingBindingSchema();
  const base = { schemaVersion: z.literal(1), productId: storeReferenceIdSchema };
  const instant = z.iso.datetime({ offset: true });
  const review = z.strictObject({
    reviewerId: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/),
    reviewedAt: instant,
  });
  return z
    .discriminatedUnion("state", [
      z.strictObject({ ...base, state: z.literal("unknown"), binding: z.null() }),
      z.strictObject({ ...base, state: z.literal("prepared"), binding }),
      z.strictObject({ ...base, state: z.literal("approved"), binding, review }),
      z.strictObject({
        ...base,
        state: z.literal("observed"),
        binding,
        review,
        observation: z.strictObject({
          observedAt: instant,
          destination: z.url({ protocol: /^https$/ }),
          result: z.literal("published"),
          validUntil: instant,
          evidenceId: storeReferenceIdSchema,
        }),
      }),
      z.strictObject({
        ...base,
        state: z.literal("withdrawn"),
        binding,
        withdrawal: z.strictObject({
          observedAt: instant,
          destination: z.url({ protocol: /^https$/ }),
          result: z.literal("withdrawn"),
          evidenceId: storeReferenceIdSchema,
        }),
      }),
    ])
    .superRefine((evidence, ctx) => {
      const add = (path: string[], message: string) =>
        ctx.addIssue({ code: "custom", path, message });
      if (evidence.binding && evidence.binding.productId !== evidence.productId)
        add(["binding", "productId"], "Product identity mismatch");
      if (evidence.state === "approved" || evidence.state === "observed") {
        if (
          !evidence.binding.buildSha256 ||
          !evidence.binding.destination ||
          evidence.binding.artwork.some((asset) => !asset.src || !asset.sha256)
        )
          add(["binding"], "Approval needs exact built/public-artwork/destination bindings");
        if (evidence.binding.target === "provider" && !evidence.binding.offer)
          add(["binding", "offer"], "Provider approval needs the current reviewed offer");
      }
      if (
        evidence.state === "withdrawn" &&
        evidence.withdrawal.destination !== evidence.binding.destination
      )
        add(["withdrawal", "destination"], "Withdrawal must name the recorded destination");
      if (evidence.state === "observed") {
        if (evidence.observation.destination !== evidence.binding.destination)
          add(
            ["observation", "destination"],
            "Observation must name the exact reviewed destination",
          );
        if (Date.parse(evidence.observation.observedAt) < Date.parse(evidence.review.reviewedAt))
          add(["observation", "observedAt"], "Observation predates approval");
        if (
          Date.parse(evidence.observation.validUntil) <= Date.parse(evidence.observation.observedAt)
        )
          add(["observation", "validUntil"], "Observation needs a later freshness boundary");
      }
    });
}
export type StoreListingEvidence = z.infer<ReturnType<typeof createStoreListingEvidenceSchema>>;

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object")
    return `{${Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b, "en"))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  return JSON.stringify(value);
}

/** Report supplied evidence, never independently verified remote existence or permission to buy. */
export function getStoreListingEvidenceStatus(
  catalog: StoreCatalog,
  input: unknown,
  context: StoreListingContext,
  asOf: string,
): StoreListingEvidence["state"] | "stale" {
  const clock = z.iso.datetime({ offset: true }).parse(asOf);
  const evidence = createStoreListingEvidenceSchema().parse(input);
  const current = getStoreListingBinding(catalog, evidence.productId, context);
  if (evidence.state === "unknown") return "unknown";
  if (evidence.state === "withdrawn") {
    if (Date.parse(evidence.withdrawal.observedAt) > Date.parse(clock))
      throw new Error("Withdrawal is in the future");
    return "withdrawn";
  }
  if ("review" in evidence && Date.parse(evidence.review.reviewedAt) > Date.parse(clock))
    throw new Error("Review is in the future");
  if (stableJson(evidence.binding) !== stableJson(current)) return "stale";
  if (evidence.state === "observed") {
    if (Date.parse(evidence.observation.observedAt) > Date.parse(clock))
      throw new Error("Observation is in the future");
    if (Date.parse(evidence.observation.validUntil) <= Date.parse(clock)) return "stale";
  }
  return evidence.state;
}
