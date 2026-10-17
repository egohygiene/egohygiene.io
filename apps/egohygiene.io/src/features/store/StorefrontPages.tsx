import { useI18n } from "@egohygiene/i18n";
import type { StoreCatalog, StorefrontCuration } from "@egohygiene/schemas";
import { Link } from "react-router-dom";

import { storeCatalog, storefrontCuration } from "../../content/store";
import type { BrowsableStoreEntry } from "./domain/index.ts";
import { getCuratedStoreArtists, getCuratedStoreEntries, storeArtistPath } from "./domain/index.ts";
import { StoreCard, StoreMetadata } from "./StorePages";

import "./storefront.css";
import "./store-artist.css";

type StorefrontProps = {
  readonly catalog?: StoreCatalog;
  readonly curation?: StorefrontCuration;
};

function Arrow() {
  return (
    <span className="storefront-arrow" aria-hidden="true">
      →
    </span>
  );
}

function CuratedGrid({
  entries,
  catalog,
}: {
  readonly entries: BrowsableStoreEntry[];
  readonly catalog: StoreCatalog;
}) {
  return (
    <ul className="storefront-grid">
      {entries.map((entry) => (
        <li key={entry.id}>
          <StoreCard entry={entry} catalog={catalog} />
        </li>
      ))}
    </ul>
  );
}

function CatalogPreviewLink() {
  const { t } = useI18n();
  return (
    <aside className="storefront-catalog-note" aria-label={t("storefront.catalog.label")}>
      <p>{t("storefront.catalog.description")}</p>
      <Link className="store-text-link" to="/store/catalog">
        {t("storefront.catalog.link")} <Arrow />
      </Link>
    </aside>
  );
}

export function StorefrontPage({
  catalog = storeCatalog,
  curation = storefrontCuration,
}: StorefrontProps) {
  const { t } = useI18n();
  const egoHygieneEntries = getCuratedStoreEntries(catalog, curation.egoHygieneEntryIds);
  const featuredEntries = getCuratedStoreEntries(catalog, curation.featuredIncomprisEntryIds);

  return (
    <div className="store-shell storefront-page">
      <StoreMetadata
        title={t("storefront.home.title")}
        description={t("storefront.home.description")}
      />
      <div className="store-intro-line">
        <span className="store-kicker">{t("storefront.home.eyebrow")}</span>
        <span className="store-status">
          <span aria-hidden="true" /> {t("storefront.home.status")}
        </span>
      </div>

      <section className="storefront-hero" aria-labelledby="storefront-heading">
        <div className="storefront-hero__copy">
          <p className="store-kicker">{t("storefront.home.kicker")}</p>
          <h1 id="storefront-heading">{t("storefront.home.heading")}</h1>
          <p className="storefront-lede">{t("storefront.home.introduction")}</p>
          <a className="store-text-link" href="#featured-incompris">
            {t("storefront.home.featuredLink")} <Arrow />
          </a>
        </div>
        <div className="storefront-identity">
          <img src="/icons/icon-512x512.png" alt="" width="512" height="512" />
          <p>{t("storefront.home.identityCaption")}</p>
        </div>
      </section>

      <section className="storefront-brand" aria-labelledby="ego-hygiene-collection-heading">
        <div className="store-section-heading">
          <div>
            <p className="store-kicker">{t("storefront.egoHygiene.kicker")}</p>
            <h2 id="ego-hygiene-collection-heading">{t("storefront.egoHygiene.heading")}</h2>
          </div>
          <p>{t("storefront.egoHygiene.description")}</p>
        </div>
        {egoHygieneEntries.length ? (
          <CuratedGrid entries={egoHygieneEntries} catalog={catalog} />
        ) : (
          <div className="storefront-upcoming">
            <span className="storefront-upcoming__mark" aria-hidden="true">
              ✳
            </span>
            <div>
              <h3>{t("storefront.egoHygiene.emptyHeading")}</h3>
              <p>{t("storefront.egoHygiene.emptyDescription")}</p>
            </div>
            <span className="store-badge">{t("storefront.egoHygiene.emptyStatus")}</span>
          </div>
        )}
      </section>

      <section
        className="storefront-featured"
        id="featured-incompris"
        aria-labelledby="featured-incompris-heading"
      >
        <div className="store-section-heading">
          <div>
            <p className="store-kicker">{t("storefront.featured.kicker")}</p>
            <h2 id="featured-incompris-heading">{t("storefront.featured.heading")}</h2>
          </div>
          <Link className="store-text-link" to="/store/incompris">
            {t("storefront.featured.link")} <Arrow />
          </Link>
        </div>
        <p className="storefront-section-description">{t("storefront.featured.description")}</p>
        {featuredEntries.length ? (
          <>
            {featuredEntries.length > 1 && (
              <p className="storefront-scroll-hint" id="featured-incompris-hint">
                {t("storefront.featured.scrollHint")}
              </p>
            )}
            <section
              className="storefront-scroll"
              aria-label={t("storefront.featured.rowLabel")}
              aria-describedby={featuredEntries.length > 1 ? "featured-incompris-hint" : undefined}
              tabIndex={featuredEntries.length > 1 ? 0 : undefined}
            >
              <ul className="storefront-row">
                {featuredEntries.map((entry) => (
                  <li key={entry.id}>
                    <StoreCard entry={entry} catalog={catalog} />
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <p className="storefront-empty">{t("storefront.featured.emptyDescription")}</p>
        )}
        <p className="storefront-artwork-note">{t("storefront.artworkNote")}</p>
      </section>

      <CatalogPreviewLink />
    </div>
  );
}

export function IncomprisPage({
  catalog = storeCatalog,
  curation = storefrontCuration,
}: StorefrontProps) {
  const { t } = useI18n();
  const entries = getCuratedStoreEntries(catalog, curation.incomprisEntryIds);
  const artists = getCuratedStoreArtists(catalog, curation);

  return (
    <div className="store-shell storefront-page storefront-incompris">
      <StoreMetadata
        title={t("storefront.incompris.title")}
        description={t("storefront.incompris.description")}
      />
      <nav className="store-breadcrumbs" aria-label={t("storefront.breadcrumb.label")}>
        <ol>
          <li>
            <Link to="/store">{t("storefront.breadcrumb.store")}</Link>
          </li>
          <li>
            <span aria-current="page">{t("storefront.incompris.name")}</span>
          </li>
        </ol>
      </nav>

      <header className="storefront-collection-intro">
        <p className="store-kicker">{t("storefront.incompris.kicker")}</p>
        <h1>{t("storefront.incompris.name")}</h1>
        <p className="storefront-lede">{t("storefront.incompris.introduction")}</p>
        <p className="storefront-artwork-note">{t("storefront.artworkNote")}</p>
      </header>

      {artists.length > 0 && (
        <section className="store-artist-entrance" aria-labelledby="incompris-artists-heading">
          <div className="store-section-heading">
            <div>
              <p className="store-kicker">{t("storeArtist.entrance.kicker")}</p>
              <h2 id="incompris-artists-heading">{t("storeArtist.entrance.heading")}</h2>
            </div>
            <p>{t("storeArtist.entrance.description")}</p>
          </div>
          <ul className="store-artist-list">
            {artists.map(({ artist }) => (
              <li key={artist.id}>
                <Link className="store-artist-link" to={storeArtistPath(artist)}>
                  <h3>
                    <bdi dir="auto">{artist.title}</bdi>
                  </h3>
                  <p>{artist.description}</p>
                  <span className="store-text-link">
                    {t("storeArtist.entrance.link")} <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="incompris-collection-heading">
        <div className="store-section-heading">
          <div>
            <p className="store-kicker">{t("storefront.incompris.collectionKicker")}</p>
            <h2 id="incompris-collection-heading">{t("storefront.incompris.collectionHeading")}</h2>
          </div>
        </div>
        {entries.length ? (
          <CuratedGrid entries={entries} catalog={catalog} />
        ) : (
          <div className="storefront-empty">
            <h3>{t("storefront.incompris.emptyHeading")}</h3>
            <p>{t("storefront.incompris.emptyDescription")}</p>
          </div>
        )}
      </section>

      <div className="storefront-return">
        <Link className="store-text-link" to="/store">
          {t("storefront.incompris.backLink")} <Arrow />
        </Link>
      </div>
      {import.meta.env.VITE_STORE_PREVIEW === "true" && (
        <div className="storefront-return">
          <Link className="store-text-link" to="/store/preview/artists/demo-artist">
            {t("storeArtist.preview.link")} <Arrow />
          </Link>
        </div>
      )}
      <CatalogPreviewLink />
    </div>
  );
}
