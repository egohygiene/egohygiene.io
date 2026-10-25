import { z } from "zod";
import { storeReferenceIdSchema } from "./store-localization.ts";

const id = storeReferenceIdSchema;
const text = z.string().trim().min(1);

export const storeArtworkPathSchema = z.string().regex(
  /^\/store\/(?:[a-z0-9_-]+\/)*[a-z0-9_-]+\.(?:png|jpg|jpeg|webp|avif)$/,
  "Use an approved local /store/ image derivative",
);

export const storeDisplayPriceSchema = z.strictObject({
  amountMinor: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  currency: z.enum(["USD", "EUR", "GBP", "CAD", "AUD"]),
  authority: z.literal("provider-checkout"),
});

export const storeVariantSchema = z.strictObject({ id, label: text, providerVariantId: text });

/** Public customer destinations only; evidence references below are opaque public record IDs. */
const customerUrl = z.url({ protocol: /^https$/ }).refine(
  (value) => /^https:\/\/[^/?#@\\\s]+(?:[/?#]|$)/.test(value) && !/[\\\s]/.test(value),
  "Use an HTTPS customer URL without credentials, backslashes or whitespace",
);
export const storeRouteDisclosuresSchema = z.strictObject({
  supportUrl: customerUrl,
  shippingPolicyUrl: customerUrl,
  returnsPolicyUrl: customerUrl,
});
export type StoreRouteDisclosures = z.infer<typeof storeRouteDisclosuresSchema>;

export const storeCheckoutRouteFields = {
  id,
  provider: z.literal("fourthwall"),
  productId: id,
  checkoutUrl: z.url().regex(
    /^https:\/\/[a-z0-9]+(?:-[a-z0-9]+)*\.fourthwall\.com\/products\/[a-z0-9][a-z0-9-]*\/?$/,
    "Use a reviewed HTTPS Fourthwall product URL; custom domains require a later policy change",
  ),
  providerVariantIds: z.array(text).min(1),
  artworkRevisions: z.array(z.strictObject({ designId: id, revision: z.number().int().positive() })).min(1),
};

/** Exact authored offer facts; presentation translations are deliberately outside this binding. */
export const storeReadinessSnapshotSchema = z.strictObject({
  route: z.strictObject({ ...storeCheckoutRouteFields, disclosures: storeRouteDisclosuresSchema }),
  variants: z.array(storeVariantSchema).min(1),
  displayPrice: storeDisplayPriceSchema.nullable(),
  artwork: z.array(z.strictObject({
    designId: id,
    revision: z.number().int().positive(),
    src: storeArtworkPathSchema,
  })).min(1),
});
export type StoreReadinessSnapshot = z.infer<typeof storeReadinessSnapshotSchema>;

export const storeQualificationSchema = z.discriminatedUnion("status", [
  z.strictObject({ status: z.literal("unreviewed") }),
  z.strictObject({
    status: z.literal("reviewed"),
    reviewerId: z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/, "Use a public reviewer ID, not private contact details"),
    reviewedAt: z.iso.date(),
    evidenceRefs: z.array(id).min(1).refine((refs) => new Set(refs).size === refs.length, "Duplicate evidence references are not allowed"),
    assessment: z.strictObject({
      channel: z.literal("fourthwall-catalog"),
      orderFunding: z.literal("deducted-from-sale"),
      noMerchantAdvance: z.literal(true),
      paidSubscriptionRequired: z.literal(false),
      artworkRights: z.literal("reviewed"),
      productTemplate: z.literal("reviewed"),
    }),
    snapshot: storeReadinessSnapshotSchema,
  }),
]);
export type StoreQualification = z.infer<typeof storeQualificationSchema>;

/** Set-like identities are order-insensitive, while labels, prices and destinations remain exact. */
export function storeReadinessSnapshotsEqual(left: StoreReadinessSnapshot, right: StoreReadinessSnapshot): boolean {
  const normalize = (snapshot: StoreReadinessSnapshot) => ({
    ...snapshot,
    route: {
      ...snapshot.route,
      providerVariantIds: [...snapshot.route.providerVariantIds].sort(),
      artworkRevisions: [...snapshot.route.artworkRevisions].sort((a, b) => a.designId.localeCompare(b.designId, "en")),
    },
    variants: [...snapshot.variants].sort((a, b) => a.id.localeCompare(b.id, "en")),
    artwork: [...snapshot.artwork].sort((a, b) => a.designId.localeCompare(b.designId, "en")),
  });
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}
