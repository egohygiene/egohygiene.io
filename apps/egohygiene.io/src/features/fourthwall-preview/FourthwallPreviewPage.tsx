import { useI18n } from "@egohygiene/i18n";
import { useMemo, useState } from "react";

import { storeCatalog } from "../../content/store";
import { LocaleLink as Link } from "../../i18n/LocaleLink";
import type { MockStoreHandoff } from "../store/domain/index.ts";
import {
  canPreviewStoreVariant,
  createStorePreviewOffer,
  previewStoreHandoff,
  STORE_PREVIEW_MAX_QUANTITY,
} from "../store/domain/index.ts";
import { StoreArtwork } from "../store/StoreArtwork";
import { StoreMetadata } from "../store/StoreMetadata";
import { useStoreContent } from "../store/useStoreContent";
import { fourthwallPreviewAdapter } from "./adapter.ts";
import { createFourthwallFixture } from "./fixture";

import "../store/store-presentation.css";
import "./fourthwall-preview.css";

const canonicalProduct = storeCatalog.entries.find(
  (entry) => entry.kind === "product" && entry.id === "product-demo-signal-heart-hoodie",
);
const canonicalDesign = storeCatalog.entries.find(
  (entry) => entry.kind === "design" && entry.id === "design-demo-signal-heart",
);
const product =
  canonicalProduct?.kind === "product"
    ? createStorePreviewOffer(
        canonicalProduct,
        fourthwallPreviewAdapter,
        createFourthwallFixture(canonicalProduct),
      )
    : undefined;
const availableVariants = product?.variants.filter((variant) =>
  product ? canPreviewStoreVariant(product, variant.id) : false,
);
const firstPrice = availableVariants?.[0]?.price;
// A starting price is meaningful only when the available variants use one currency.
const startingPrice =
  firstPrice &&
  availableVariants?.every((variant) => variant.price.currency === firstPrice.currency)
    ? {
        amount: Math.min(...availableVariants.map((variant) => variant.price.amount)),
        currency: firstPrice.currency,
      }
    : undefined;

/** Loaded only by the explicit local preview route; all checkout behavior is inert. */
export function FourthwallPreviewPage() {
  const { locale, t, formatNumber } = useI18n();
  const { content } = useStoreContent();
  const productContent = canonicalProduct ? content(canonicalProduct) : undefined;
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [handoff, setHandoff] = useState<MockStoreHandoff>();
  const selected = product?.variants.find((variant) => variant.id === selectedId);
  const canPreview = product ? canPreviewStoreVariant(product, selectedId, quantity) : false;
  const displayedPrice = selected?.price ?? startingPrice;
  const formatMoney = useMemo(() => {
    const currencies = new Map<string, Intl.NumberFormat>();
    return (value: number, currency: string) => {
      let formatter = currencies.get(currency);
      if (!formatter) {
        formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
        currencies.set(currency, formatter);
      }
      return formatter.format(value);
    };
  }, [locale]);

  if (!product) {
    return (
      <section className="store-shell fourthwall-preview">
        <StoreMetadata
          title={t("fourthwallPreview.missing.title")}
          description={t("fourthwallPreview.missing.description")}
        />
        <h1>{t("fourthwallPreview.missing.title")}</h1>
        <p>{t("fourthwallPreview.missing.description")}</p>
        <Link to="/store">{t("fourthwallPreview.missing.back")}</Link>
      </section>
    );
  }

  return (
    <div className="store-shell fourthwall-preview">
      <StoreMetadata
        title={t("fourthwallPreview.title")}
        description={t("fourthwallPreview.intro.description")}
      />
      <header className="fourthwall-preview__intro">
        <Link className="fourthwall-preview__back" to="/store">
          <span aria-hidden="true" className="site-directional-icon">
            ←
          </span>{" "}
          {t("fourthwallPreview.intro.back")}
        </Link>
        <div className="fourthwall-preview__notice">
          <span aria-hidden="true">◌</span> {t("fourthwallPreview.intro.notice")}
        </div>
        <p className="fourthwall-preview__eyebrow">{t("fourthwallPreview.intro.brand")}</p>
        <h1>{t("fourthwallPreview.intro.title")}</h1>
        <p>{t("fourthwallPreview.intro.description")}</p>
      </header>

      <div className="fourthwall-preview__product">
        <figure className="fourthwall-preview__art">
          <StoreArtwork
            design={canonicalDesign?.kind === "design" ? canonicalDesign : undefined}
            hero
          />
          <figcaption>
            {t("fourthwallPreview.artwork.caption")}
            <br />
            {t("fourthwallPreview.artwork.disclaimer")}
          </figcaption>
        </figure>

        <section className="fourthwall-preview__details" aria-labelledby="fourthwall-product-title">
          <p className="fourthwall-preview__eyebrow">{t("fourthwallPreview.details.eyebrow")}</p>
          <h2 id="fourthwall-product-title" lang={productContent?.title.locale}>
            {productContent?.title.value ?? product.name}
          </h2>
          <p>{t("fourthwallPreview.details.description")}</p>
          <p className="fourthwall-preview__price">
            {selected
              ? formatMoney(selected.price.amount, selected.price.currency)
              : startingPrice
                ? t("fourthwallPreview.details.fromPrice", {
                    price: formatMoney(startingPrice.amount, startingPrice.currency),
                  })
                : t("fourthwallPreview.details.priceUnavailable")}
            <span>
              {displayedPrice
                ? t("fourthwallPreview.details.priceNote", { currency: displayedPrice.currency })
                : t("fourthwallPreview.details.priceNoteWithoutCurrency")}
            </span>
          </p>
          <p className="fourthwall-preview__material">
            {t("fourthwallPreview.details.material")}{" "}
            <span aria-hidden="true" className="fourthwall-preview__swatch" />
          </p>

          <fieldset className="fourthwall-preview__sizes">
            <legend>{t("fourthwallPreview.details.size")}</legend>
            <div>
              {product.variants.map((variant) => {
                const available = canPreviewStoreVariant(product, variant.id);
                const size = variant.optionLabel;
                return (
                  <button
                    type="button"
                    key={variant.id}
                    disabled={!available}
                    aria-pressed={selectedId === variant.id}
                    aria-label={t(
                      available
                        ? "fourthwallPreview.details.sizeAvailable"
                        : "fourthwallPreview.details.sizeUnavailable",
                      { size },
                    )}
                    onClick={() => {
                      setSelectedId(variant.id);
                      setHandoff(undefined);
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            <p>{t("fourthwallPreview.details.sizeNote")}</p>
          </fieldset>

          <label className="fourthwall-preview__quantity">
            {t("fourthwallPreview.details.quantity")}
            <select
              value={quantity}
              onChange={(event) => {
                setQuantity(Number(event.target.value));
                setHandoff(undefined);
              }}
            >
              {Array.from({ length: STORE_PREVIEW_MAX_QUANTITY }, (_, index) => index + 1).map(
                (value) => (
                  <option key={value} value={value}>
                    {formatNumber(value)}
                  </option>
                ),
              )}
            </select>
          </label>
          <button
            className="fourthwall-preview__cta"
            type="button"
            disabled={!canPreview}
            onClick={() => setHandoff(previewStoreHandoff(product, selectedId, quantity))}
          >
            {t("fourthwallPreview.details.preview")} <span aria-hidden="true">↗</span>
          </button>
          <p className="fourthwall-preview__hint">
            {t(
              selected
                ? "fourthwallPreview.details.selectedHint"
                : "fourthwallPreview.details.unselectedHint",
            )}
          </p>
          <Link className="fourthwall-preview__catalog-link" to={`/store/products/${product.slug}`}>
            {t("fourthwallPreview.details.catalogLink")}{" "}
            <span aria-hidden="true" className="site-directional-icon">
              →
            </span>
          </Link>
        </section>
      </div>

      <section
        className="fourthwall-preview__handoff"
        aria-live="polite"
        aria-atomic="true"
        aria-label={t("fourthwallPreview.handoff.label")}
      >
        {handoff ? (
          <>
            <p className="fourthwall-preview__eyebrow">{t("fourthwallPreview.handoff.eyebrow")}</p>
            <h2>{t("fourthwallPreview.handoff.title")}</h2>
            <dl>
              <div>
                <dt>{t("fourthwallPreview.handoff.item")}</dt>
                <dd>{handoff.productName}</dd>
              </div>
              <div>
                <dt>{t("fourthwallPreview.handoff.variant")}</dt>
                <dd>{handoff.variantName}</dd>
              </div>
              <div>
                <dt>{t("fourthwallPreview.handoff.quantity")}</dt>
                <dd>{formatNumber(handoff.items[0].quantity)}</dd>
              </div>
              <div>
                <dt>{t("fourthwallPreview.handoff.subtotal")}</dt>
                <dd>{formatMoney(handoff.illustrativeSubtotal, handoff.currency)}</dd>
              </div>
            </dl>
            <p>{t("fourthwallPreview.handoff.description")}</p>
            <button type="button" onClick={() => setHandoff(undefined)}>
              {t("fourthwallPreview.handoff.clear")}
            </button>
          </>
        ) : (
          <>
            <p className="fourthwall-preview__eyebrow">
              {t("fourthwallPreview.handoff.emptyEyebrow")}
            </p>
            <h2>{t("fourthwallPreview.handoff.emptyTitle")}</h2>
            <p>{t("fourthwallPreview.handoff.emptyDescription")}</p>
          </>
        )}
      </section>
    </div>
  );
}
