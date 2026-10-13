import { z } from "zod";

import type { StorePreviewAdapter } from "../../../apps/egohygiene.io/src/features/store/domain/index.ts";

// Deliberately fictional payload. This is NOT a Printify API contract or integration.
const fixtureSchema = z.strictObject({
  reference: z.string().min(1),
  options: z.array(
    z.strictObject({
      code: z.string().min(1),
      label: z.string().min(1),
      amount: z.number().finite().nonnegative(),
      stock: z.number().int().nonnegative(),
    }),
  ),
});

export const alternatePreviewFixture = {
  reference: "mock-alternate-product",
  options: [{ code: "alternate-small", label: "S", amount: 42, stock: 5 }],
};

/** Test-only variation: fulfillment without a hosted-handoff capability stays disabled. */
export const disabledAlternatePreviewAdapter: StorePreviewAdapter = {
  provider: "printify",
  normalize(input) {
    const fixture = fixtureSchema.parse(input);
    return {
      providerProductId: fixture.reference,
      capabilities: ["physical-fulfillment"],
      available: true,
      variants: fixture.options.map((option) => ({
        id: option.code,
        name: `Black / ${option.label}`,
        optionLabel: option.label,
        price: { amount: option.amount, currency: "USD" },
        availableQuantity: option.stock,
      })),
    };
  },
};
