import type { StorePreviewAdapter } from "../store/domain/index.ts";
import { fourthwallProductSchema } from "./contract.ts";

/** Only the synthetic tryout uses this adapter; it does not qualify a real offer. */
export const fourthwallPreviewAdapter: StorePreviewAdapter = {
  provider: "fourthwall",
  normalize(input) {
    const providerProduct = fourthwallProductSchema.parse(input);
    return {
      providerProductId: providerProduct.id,
      capabilities: ["hosted-checkout", "physical-fulfillment"],
      available:
        providerProduct.state.type === "AVAILABLE" && providerProduct.access.type === "PUBLIC",
      variants: providerProduct.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        optionLabel: variant.attributes?.size?.name ?? variant.name,
        price: { amount: variant.unitPrice.value, currency: variant.unitPrice.currency },
        availableQuantity:
          variant.stock.type === "LIMITED" ? (variant.stock.inStock ?? null) : null,
      })),
    };
  },
};
