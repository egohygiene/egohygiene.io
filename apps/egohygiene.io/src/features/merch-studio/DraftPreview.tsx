import { useEffect, useId, useRef } from "react";

import { StoreArtworkGallery } from "../store/StoreArtworkGallery";
import { createDraftPreviewCatalog } from "./draft-preview-catalog";
import type { MerchDraft } from "./draft-store";

type DraftPreviewProps = {
  readonly draft: MerchDraft;
  readonly onBack: () => void;
};

export function DraftPreview({ draft, onBack }: DraftPreviewProps) {
  const { design, product } = createDraftPreviewCatalog(draft);
  const headingId = useId();
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <div>
      <div className="store-breadcrumbs">
        <button className="store-button" type="button" onClick={onBack}>
          Back to drafts
        </button>
      </div>
      <article aria-labelledby={headingId} className="store-detail">
        <div className="store-detail__art">
          <StoreArtworkGallery
            designs={[design]}
            title={product.title}
            titleLocale={product.sourceLocale}
          />
          <p className="store-art-disclaimer">Placeholder artwork for this product draft.</p>
        </div>
        <div className="store-detail__copy">
          <p className="store-kicker">Local product preview</p>
          <h2 id={headingId} ref={heading} tabIndex={-1}>
            {product.title}
          </h2>
          <p className="store-detail__description">{product.description}</p>
          <dl className="store-detail-facts">
            <div>
              <dt>Product type</dt>
              <dd>{draft.productType}</dd>
            </div>
          </dl>
          <div className="store-purchase-panel">
            <strong className="store-purchase-status">Purchasing disabled</strong>
            <p>This preview has no price, inventory, or checkout.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
