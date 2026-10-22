import {
  getStoreReadinessSnapshot,
  storeCheckoutRouteSchema,
  storeDesignSchema,
  storeProductSchema,
  type StoreCheckoutRoute,
} from "../../../packages/schemas/src/store.ts";

/** Publicly unusable test destinations; never real support or provider evidence. */
export const SYNTHETIC_STORE_DISCLOSURES = {
  supportUrl: "https://support.example.invalid/synthetic-store",
  shippingPolicyUrl: "https://policies.example.invalid/synthetic-shipping",
  returnsPolicyUrl: "https://policies.example.invalid/synthetic-returns",
} as const;

/**
 * Test-only fictional review. Call once before mutation so a negative test cannot
 * silently refresh approval. Production authoring must never import this helper.
 */
export function qualifySyntheticRoute(
  input: unknown,
  productInput: unknown,
  designInputs: unknown[],
): StoreCheckoutRoute {
  const route = storeCheckoutRouteSchema.parse({
    ...(input as Record<string, unknown>),
    disclosures: { ...SYNTHETIC_STORE_DISCLOSURES },
  });
  const product = storeProductSchema.parse(productInput);
  const designs = designInputs.map((input) => storeDesignSchema.parse(input));
  return {
    ...route,
    qualification: {
      status: "reviewed",
      reviewerId: "test-reviewer",
      reviewedAt: "2026-10-22",
      evidenceRefs: ["test-only-synthetic-evidence"],
      assessment: {
        channel: "fourthwall-catalog",
        orderFunding: "deducted-from-sale",
        noMerchantAdvance: true,
        paidSubscriptionRequired: false,
        artworkRights: "reviewed",
        productTemplate: "reviewed",
      },
      snapshot: getStoreReadinessSnapshot(route, product, designs),
    },
  };
}
