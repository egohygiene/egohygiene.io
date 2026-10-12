import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { storeCatalog } from "../../content/store";
import { StoreArtwork } from "../store/StoreArtwork";
import { canPreviewVariant, previewFourthwallHandoff } from "./contract";
import type { MockFourthwallHandoff } from "./contract";
import { createFourthwallFixture } from "./fixture";

import "../store/store.css";
import "./fourthwall-preview.css";

const canonicalProduct = storeCatalog.entries.find((entry) => entry.kind === "product" && entry.id === "product-demo-signal-heart-hoodie");
const canonicalDesign = storeCatalog.entries.find((entry) => entry.kind === "design" && entry.id === "design-demo-signal-heart");
const product = canonicalProduct?.kind === "product" ? createFourthwallFixture(canonicalProduct) : undefined;
const formatMoney = (value: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);

/** Loaded only by the explicit local preview route; all checkout behavior is inert. */
export function FourthwallPreviewPage() {
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [handoff, setHandoff] = useState<MockFourthwallHandoff>();
  const selected = product?.variants.find((variant) => variant.id === selectedId);
  const canPreview = product ? canPreviewVariant(product, selectedId, quantity) : false;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Fourthwall tryout · Ego Hygiene";
    return () => { document.title = previousTitle; };
  }, []);

  if (!product) return <section className="store-shell fourthwall-preview"><h1>Preview item unavailable</h1><p>The Signal Heart catalog example is missing.</p><Link to="/store">Back to the store</Link></section>;

  return (
    <div className="store-shell fourthwall-preview">
      <header className="fourthwall-preview__intro">
        <Link className="fourthwall-preview__back" to="/store">← Explore the store</Link>
        <div className="fourthwall-preview__notice"><span aria-hidden="true">◌</span> Local tryout · fictional product</div>
        <p className="fourthwall-preview__eyebrow">ego hygiene × fourthwall</p>
        <h1>A signal you can wear.</h1>
        <p>Try the journey from a design to something tangible. Pick a size, then preview how your selection would travel to checkout.</p>
      </header>

      <div className="fourthwall-preview__product">
        <figure className="fourthwall-preview__art">
          <StoreArtwork design={canonicalDesign?.kind === "design" ? canonicalDesign : undefined} hero />
          <figcaption>Signal Heart · concept study / 001<br />Placeholder artwork, not a garment photograph.</figcaption>
        </figure>

        <section className="fourthwall-preview__details" aria-labelledby="fourthwall-product-title">
          <p className="fourthwall-preview__eyebrow">The standalone collection</p>
          <h2 id="fourthwall-product-title">{product.name}</h2>
          <p>For the parts of you that keep transmitting. A standalone design, with room for its own story.</p>
          <p className="fourthwall-preview__price">
            {selected ? formatMoney(selected.unitPrice.value, selected.unitPrice.currency) : "From $42.00"}
            <span>Illustrative price only · USD</span>
          </p>
          <p className="fourthwall-preview__material">Color study: black <span aria-hidden="true" className="fourthwall-preview__swatch" /></p>

          <fieldset className="fourthwall-preview__sizes">
            <legend>Choose a size</legend>
            <div>{product.variants.map((variant) => {
              const available = canPreviewVariant(product, variant.id);
              const size = variant.attributes?.size?.name ?? variant.name;
              return <button
                type="button"
                key={variant.id}
                disabled={!available}
                aria-pressed={selectedId === variant.id}
                aria-label={`${size}${available ? "" : " — unavailable in this example"}`}
                onClick={() => { setSelectedId(variant.id); setHandoff(undefined); }}
              >{size}</button>;
            })}</div>
            <p>Example sizes only. XL shows the unavailable state.</p>
          </fieldset>

          <label className="fourthwall-preview__quantity">Quantity
            <select value={quantity} onChange={(event) => { setQuantity(Number(event.target.value)); setHandoff(undefined); }}>
              {[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </label>
          <button className="fourthwall-preview__cta" type="button" disabled={!canPreview} onClick={() => setHandoff(previewFourthwallHandoff(product, selectedId, quantity))}>
            Preview checkout handoff <span aria-hidden="true">↗</span>
          </button>
          <p className="fourthwall-preview__hint">{selected ? "This stays on the page. No cart, payment, or order is created." : "Select a size to try the next step. No account needed."}</p>
          <Link className="fourthwall-preview__catalog-link" to={`/store/products/${product.slug}`}>See the catalog concept →</Link>
        </section>
      </div>

      <section className="fourthwall-preview__handoff" aria-live="polite" aria-atomic="true" aria-label="Checkout handoff preview">
        {handoff ? <>
          <p className="fourthwall-preview__eyebrow">Your selection / mock handoff</p>
          <h2>Ready for the next world.</h2>
          <dl>
            <div><dt>Item</dt><dd>{handoff.productName}</dd></div>
            <div><dt>Variant</dt><dd>{handoff.variantName}</dd></div>
            <div><dt>Quantity</dt><dd>{handoff.items[0].quantity}</dd></div>
            <div><dt>Illustrative subtotal</dt><dd>{formatMoney(handoff.illustrativeSubtotal, handoff.currency)}</dd></div>
          </dl>
          <p>A connected store would open Fourthwall’s hosted checkout here, where shipping, tax, and the final total are confirmed. This tryout sends nothing.</p>
          <button type="button" onClick={() => setHandoff(undefined)}>Clear the preview</button>
        </> : <><p className="fourthwall-preview__eyebrow">From our world to yours</p><h2>The art stays personal.</h2><p>Explore here. Once a real product is ready, Fourthwall can take care of the checkout. For now, this is a space to try the flow.</p></>}
      </section>
    </div>
  );
}
