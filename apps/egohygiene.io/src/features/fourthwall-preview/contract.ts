import { z } from "zod";

// Deliberately bounded to the product fields used by this tryout. This is not
// the canonical store schema or a full Fourthwall API client.
const moneySchema = z.object({
  value: z.number().finite().nonnegative(),
  currency: z.string().regex(/^[A-Z]{3}$/),
});

const variantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  unitPrice: moneySchema,
  stock: z.object({
    type: z.string().min(1),
    inStock: z.number().int().nonnegative().optional(),
  }),
  attributes: z.object({
    size: z.object({ name: z.string().min(1) }).optional(),
    color: z.object({ name: z.string().min(1) }).optional(),
  }).optional(),
});

/** Validated, additive API fields are stripped before the preview consumes them. */
export const fourthwallProductSchema = z.object({
  type: z.literal("PRODUCT"),
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  state: z.object({ type: z.string().min(1) }),
  access: z.object({ type: z.string().min(1) }),
  variants: z.array(variantSchema).superRefine((variants, context) => {
    if (new Set(variants.map((variant) => variant.id)).size !== variants.length) {
      context.addIssue({ code: "custom", message: "Variant identifiers must be unique" });
    }
  }),
});

export type FourthwallPreviewProduct = z.infer<typeof fourthwallProductSchema>;
export type FourthwallPreviewVariant = FourthwallPreviewProduct["variants"][number];

/** Unknown stock states stay unavailable until their meaning is supported. */
export function canPreviewVariant(product: FourthwallPreviewProduct, variantId: string, quantity = 1): boolean {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 5) return false;
  if (product.state.type !== "AVAILABLE" || product.access.type !== "PUBLIC") return false;
  const variant = product.variants.find((candidate) => candidate.id === variantId);
  if (!variant) return false;
  return variant.stock.type === "LIMITED" && (variant.stock.inStock ?? 0) >= quantity;
}

export type MockFourthwallHandoff = {
  readonly kind: "mock";
  readonly productName: string;
  readonly variantName: string;
  readonly items: readonly [{ readonly variantId: string; readonly quantity: number }];
  readonly currency: string;
  readonly illustrativeSubtotal: number;
};

/** An inert description of a future cart request, never a URL or network call. */
export function previewFourthwallHandoff(
  product: FourthwallPreviewProduct,
  variantId: string,
  quantity = 1,
): MockFourthwallHandoff | undefined {
  if (!canPreviewVariant(product, variantId, quantity)) return undefined;
  const variant = product.variants.find((candidate) => candidate.id === variantId);
  if (!variant) return undefined;
  return {
    kind: "mock",
    productName: product.name,
    variantName: variant.name,
    items: [{ variantId: variant.id, quantity }],
    currency: variant.unitPrice.currency,
    illustrativeSubtotal: Math.round(variant.unitPrice.value * quantity * 100) / 100,
  };
}
