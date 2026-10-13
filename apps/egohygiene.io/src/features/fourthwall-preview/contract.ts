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
