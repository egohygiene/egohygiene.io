import type { StoreProduct, StoreProviderCapability, StoreProviderId } from "@egohygiene/schemas";

export const STORE_PREVIEW_MAX_QUANTITY = 5;

export interface StorePreviewVariant {
  readonly id: string;
  readonly name: string;
  readonly optionLabel: string;
  readonly price: { readonly amount: number; readonly currency: string };
  // null means unrecognized/unknown inventory, never unlimited inventory.
  readonly availableQuantity: number | null;
}

export interface StorePreviewProviderData {
  readonly providerProductId: string;
  readonly capabilities: readonly StoreProviderCapability[];
  readonly available: boolean;
  readonly variants: readonly StorePreviewVariant[];
}

/** Transient normalized data, not a persisted catalog record or a live offer. */
export interface StorePreviewOffer extends StorePreviewProviderData {
  readonly kind: "synthetic";
  readonly purchaseEnabled: false;
  readonly productId: string;
  readonly name: string;
  readonly slug: string;
  readonly provider: StoreProviderId;
}

export interface StorePreviewAdapter {
  readonly provider: StoreProviderId;
  // Validate unknown input at the adapter. Never accept secrets or perform I/O here.
  readonly normalize: (input: unknown) => StorePreviewProviderData;
}

/** The catalog owns identity and preview eligibility, regardless of provider. */
export function createStorePreviewOffer(
  product: StoreProduct,
  adapter: StorePreviewAdapter,
  input: unknown,
): StorePreviewOffer {
  const data = adapter.normalize(input);
  return {
    kind: "synthetic",
    purchaseEnabled: false,
    productId: product.id,
    name: product.title,
    slug: product.slug,
    provider: adapter.provider,
    providerProductId: data.providerProductId,
    capabilities: data.capabilities,
    available:
      product.visibility === "public" && product.purchase.state === "preview" && data.available,
    variants: data.variants,
  };
}

/** This grants an inert preview only; it never grants permission to purchase. */
export function canPreviewStoreVariant(
  offer: StorePreviewOffer,
  variantId: string,
  quantity = 1,
): boolean {
  if (offer.kind !== "synthetic" || offer.purchaseEnabled !== false || !offer.available)
    return false;
  if (!offer.capabilities.includes("hosted-checkout")) return false;
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > STORE_PREVIEW_MAX_QUANTITY)
    return false;
  const variant = offer.variants.find((candidate) => candidate.id === variantId);
  if (!variant || variant.availableQuantity === null) return false;
  return (
    Number.isSafeInteger(variant.availableQuantity) &&
    variant.availableQuantity >= quantity &&
    Number.isFinite(variant.price.amount) &&
    variant.price.amount >= 0
  );
}

export interface MockStoreHandoff {
  readonly kind: "mock";
  readonly productId: string;
  readonly provider: StoreProviderId;
  readonly providerProductId: string;
  readonly productName: string;
  readonly variantName: string;
  readonly items: readonly [{ readonly variantId: string; readonly quantity: number }];
  readonly currency: string;
  readonly illustrativeSubtotal: number;
}

/** Inert selection summary: no URL, network call or provider-specific cart request. */
export function previewStoreHandoff(
  offer: StorePreviewOffer,
  variantId: string,
  quantity = 1,
): MockStoreHandoff | undefined {
  if (!canPreviewStoreVariant(offer, variantId, quantity)) return undefined;
  const variant = offer.variants.find((candidate) => candidate.id === variantId);
  if (!variant) return undefined;
  const illustrativeSubtotal = Math.round(variant.price.amount * quantity * 100) / 100;
  if (!Number.isFinite(illustrativeSubtotal)) return undefined;
  return {
    kind: "mock",
    productId: offer.productId,
    provider: offer.provider,
    providerProductId: offer.providerProductId,
    productName: offer.name,
    variantName: variant.name,
    items: [{ variantId: variant.id, quantity }],
    currency: variant.price.currency,
    illustrativeSubtotal,
  };
}
