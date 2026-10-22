import type { StoreEntry } from "../../packages/schemas/src/store.ts";
import { parseStoreCatalog, toPublicStoreCatalog } from "../../packages/schemas/src/store.ts";
import type { StoreTranslatedText } from "../../packages/schemas/src/store-localization.ts";
import {
  CHECKOUT_HANDOFF_FIXTURE,
  createCheckoutHandoffInputs,
} from "../checkout-handoff/inputs.ts";
import { CATALOG_LOCALIZATION_FIXTURE } from "./constants.ts";

export { CATALOG_LOCALIZATION_FIXTURE } from "./constants.ts";

/** Synthetic review bindings test freshness; they do not represent a human review. */
function reviewed(
  locale: string,
  source: string,
  value: string,
  binding: { artworkRevision?: number; variantId?: string } = {},
): StoreTranslatedText {
  return {
    value,
    review: {
      status: "reviewed",
      locale,
      reviewedBy: "synthetic-test-only",
      reviewedAt: "2026-10-22",
      source: { locale: "en", value: source, ...binding },
      value,
    },
  };
}

/** Reuse #37's validated product/variant/route/image identities, changing only test presentation. */
export function createCatalogLocalizationInputs() {
  const fixture = CATALOG_LOCALIZATION_FIXTURE;
  const handoff = CHECKOUT_HANDOFF_FIXTURE;
  const inputs = createCheckoutHandoffInputs();
  const original = parseStoreCatalog(inputs.sources, inputs.routes);
  const entries: StoreEntry[] = original.entries.map((entry) => {
    if (entry.id === handoff.live.id && entry.kind === "product" && entry.purchase.state === "live") {
      const variant = entry.purchase.variants[0];
      if (!variant) throw new Error("The handoff fixture must retain its canonical variant");
      return {
        ...entry,
        purchase: { ...entry.purchase, displayPrice: { ...fixture.price } },
        translations: [
          {
            locale: fixture.locale,
            fields: {
              title: reviewed(fixture.locale, entry.title, fixture.liveTitle),
              description: reviewed(fixture.locale, entry.description, fixture.liveDescription),
              variantLabels: [{
                variantId: variant.id,
                ...reviewed(fixture.locale, variant.label, fixture.variantLabel, { variantId: variant.id }),
              }],
            },
          },
          {
            locale: fixture.regionalLocale,
            fields: {
              title: reviewed(fixture.regionalLocale, entry.title, fixture.regionalTitle),
              description: { value: `${fixture.draftMarker}_DESCRIPTION`, review: { status: "draft" } },
            },
          },
        ],
      };
    }
    if (entry.id === handoff.designId && entry.kind === "design" && entry.artwork.kind === "image") {
      return {
        ...entry,
        translations: [
          {
            locale: fixture.locale,
            fields: {
              artworkAlt: reviewed(fixture.locale, entry.artwork.alt, fixture.artworkAlt, {
                artworkRevision: entry.artworkRevision,
              }),
            },
          },
          {
            locale: fixture.regionalLocale,
            fields: {
              artworkAlt: reviewed(fixture.regionalLocale, entry.artwork.alt, `${fixture.staleMarker}_ALT`, {
                artworkRevision: entry.artworkRevision + 1,
              }),
            },
          },
        ],
      };
    }
    if (entry.id === handoff.preview.id) {
      return {
        ...entry,
        translations: [{
          locale: fixture.locale,
          fields: { description: { value: `${fixture.draftMarker}_PREVIEW`, review: { status: "draft" } } },
        }],
      };
    }
    if (entry.id === handoff.unavailable.id && entry.kind === "product" && entry.purchase.state === "unavailable") {
      return {
        ...entry,
        translations: [{
          locale: fixture.locale,
          fields: {
            unavailableReason: reviewed(fixture.locale, "An obsolete fictional reason.", `${fixture.staleMarker}_REASON`),
          },
        }],
      };
    }
    return entry;
  });
  const collection = fixture.collection;
  entries.push({
    schemaVersion: 2,
    sourceLocale: "en",
    visibility: "public",
    attribution: { status: "unknown" },
    id: collection.id,
    slug: collection.slug,
    title: collection.title,
    description: collection.description,
    kind: "collection",
    designIds: [handoff.designId],
    productIds: [handoff.live.id, handoff.preview.id, handoff.unavailable.id],
    contextIds: [],
    translations: [{
      locale: fixture.locale,
      fields: {
        description: reviewed(fixture.locale, collection.description, collection.translatedDescription),
      },
    }],
  });
  return {
    // Match the existing filesystem loader so raw/public fixtures share one deterministic order.
    sources: entries.map((value) => ({ source: `${value.id}.json`, value }))
      .sort((left, right) => left.source < right.source ? -1 : left.source > right.source ? 1 : 0),
    routes: inputs.routes,
  };
}

export function createCatalogLocalizationCatalog() {
  const inputs = createCatalogLocalizationInputs();
  return toPublicStoreCatalog(parseStoreCatalog(inputs.sources, inputs.routes));
}

