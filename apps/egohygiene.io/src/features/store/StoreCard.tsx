import { useI18n } from "@egohygiene/i18n";
import type { StoreCatalog } from "@egohygiene/schemas";

import { storeCatalog } from "../../content/store";
import { LocaleLink as Link } from "../../i18n/LocaleLink";
import type { BrowsableStoreEntry } from "./domain/index.ts";
import { getEntryContexts, getEntryDesigns, storeEntryPath } from "./domain/index.ts";
import { productArtworkStyle } from "./product-view-transition";
import { StoreArtwork } from "./StoreArtwork";
import { useStoreContent } from "./useStoreContent";

import "./store-presentation.css";

export function StoreArrow({ diagonal = false }: { readonly diagonal?: boolean }) {
  return (
    <span className={diagonal ? undefined : "site-directional-icon"} aria-hidden="true">
      {diagonal ? "↗" : "→"}
    </span>
  );
}

export function StoreEntryBadge({ entry }: { readonly entry: BrowsableStoreEntry }) {
  const { t } = useI18n();
  const key =
    entry.kind === "product"
      ? entry.purchase.state
      : entry.kind === "collection"
        ? "collection"
        : entry.artwork.kind === "placeholder"
          ? "study"
          : "design";
  return (
    <span
      className={`store-badge${entry.kind === "product" && entry.purchase.state === "live" ? " store-badge--live" : ""}`}
    >
      {t(`storeCards.badge.${key}`)}
    </span>
  );
}

export function StoreCard({
  entry,
  catalog = storeCatalog,
  collectionProductNavigation,
}: {
  readonly entry: BrowsableStoreEntry;
  readonly catalog?: StoreCatalog;
  readonly collectionProductNavigation?: { readonly animate: boolean } | undefined;
}) {
  const { t } = useI18n();
  const { content } = useStoreContent();
  const presented = content(entry);
  const design = getEntryDesigns(catalog, entry)[0];
  const connected = getEntryContexts(catalog, entry).length > 0;
  const collectionProduct = entry.kind === "product" ? collectionProductNavigation : undefined;
  return (
    <article className="store-card">
      <Link
        className="store-card__link"
        to={storeEntryPath(entry)}
        state={collectionProduct ? { focusStoreProduct: true } : undefined}
        viewTransition={collectionProduct?.animate ?? false}
      >
        <div
          className="store-card__visual"
          style={collectionProduct ? productArtworkStyle(entry.slug) : undefined}
        >
          <StoreArtwork design={design} />
          <span className="store-card__badge">
            <StoreEntryBadge entry={entry} />
          </span>
          <span className="store-card__arrow">
            <StoreArrow diagonal />
          </span>
        </div>
        <div className="store-card__body">
          <div className="store-card__meta">
            <span className="store-kicker">{t(`storeCards.kind.${entry.kind}`)}</span>
            <span className="store-card__context">
              {t(connected ? "storeCards.connected" : "storeCards.standalone")}
            </span>
          </div>
          <h3 lang={presented.title.locale}>{presented.title.value}</h3>
          <p lang={presented.description.locale}>{presented.description.value}</p>
          <span className="store-card__action">
            {t(`storeCards.explore.${entry.kind}`)} <StoreArrow />
          </span>
        </div>
      </Link>
    </article>
  );
}
