import { useI18n } from "@egohygiene/i18n";
import type { StoreCatalog, StorefrontCuration } from "@egohygiene/schemas";
import { useRef } from "react";
import { Link, useLocation, useParams, useSearchParams } from "react-router-dom";

import { storeCatalog, storefrontCuration } from "../../content/store";
import { filterStoreEntries, getCuratedStoreArtist } from "./domain/index.ts";
import { StoreCard, StoreMetadata } from "./StorePages";

import "./storefront.css";
import "./store-artist.css";

type StoreArtistPageProps = {
  readonly catalog?: StoreCatalog;
  readonly curation?: StorefrontCuration;
};

export function StoreArtistPage({
  catalog = storeCatalog,
  curation = storefrontCuration,
}: StoreArtistPageProps) {
  const { t, formatNumber } = useI18n();
  const { artistSlug } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInput = useRef<HTMLInputElement>(null);
  const selection = getCuratedStoreArtist(catalog, curation, artistSlug ?? "");
  const view = searchParams.get("view") === "songs" ? "songs" : "standalone";
  const query = searchParams.get("q") ?? "";

  function viewDestination(nextView: "standalone" | "songs") {
    const next = new URLSearchParams(searchParams);
    if (nextView === "songs") next.set("view", "songs");
    else next.delete("view");
    return { pathname: location.pathname, search: next.toString() };
  }

  function updateQuery(value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  if (!selection) {
    return (
      <div className="store-shell store-missing">
        <StoreMetadata
          title={t("storeArtist.missing.title")}
          description={t("storeArtist.missing.description")}
        />
        <p className="store-kicker">{t("storeArtist.missing.kicker")}</p>
        <h1>{t("storeArtist.missing.heading")}</h1>
        <p>{t("storeArtist.missing.description")}</p>
        <Link className="store-button" to="/store/incompris">
          {t("storeArtist.backLink")}
        </Link>
      </div>
    );
  }

  const { artist } = selection;
  const selectedEntries =
    view === "songs" ? selection.songCollections : selection.standaloneEntries;
  const matchingIds = new Set(filterStoreEntries(catalog, query, "all").map((entry) => entry.id));
  const entries = selectedEntries.filter((entry) => matchingIds.has(entry.id));
  const hasQuery = query.trim().length > 0;

  return (
    <div className="store-shell storefront-page store-artist-page">
      <StoreMetadata
        title={`${artist.title} · ${t("storeArtist.title")}`}
        description={t("storeArtist.description")}
      />
      <nav className="store-breadcrumbs" aria-label={t("storeArtist.breadcrumb.label")}>
        <ol>
          <li>
            <Link to="/store">{t("storeArtist.breadcrumb.store")}</Link>
          </li>
          <li>
            <Link to="/store/incompris">{t("storeArtist.breadcrumb.incompris")}</Link>
          </li>
          <li>
            <span aria-current="page">
              <bdi dir="auto">{artist.title}</bdi>
            </span>
          </li>
        </ol>
      </nav>

      <header className="storefront-collection-intro store-artist-intro">
        <p className="store-kicker">{t("storeArtist.kicker")}</p>
        <h1>
          <bdi dir="auto">{artist.title}</bdi>
        </h1>
        <p className="storefront-lede">{artist.description}</p>
        <p className="storefront-artwork-note">{t("storeArtist.introduction")}</p>
      </header>

      <nav className="store-artist-views" aria-label={t("storeArtist.navigationLabel")}>
        <Link
          to={viewDestination("standalone")}
          aria-current={view === "standalone" ? "page" : undefined}
          preventScrollReset
        >
          {t("storeArtist.standalone.label")}
        </Link>
        <Link
          to={viewDestination("songs")}
          aria-current={view === "songs" ? "page" : undefined}
          preventScrollReset
        >
          {t("storeArtist.songs.label")}
        </Link>
      </nav>

      <section className="store-artist-selection" aria-labelledby="artist-selection-heading">
        <div className="store-section-heading">
          <div>
            <p className="store-kicker">{t(`storeArtist.${view}.kicker`)}</p>
            <h2 id="artist-selection-heading">{t(`storeArtist.${view}.heading`)}</h2>
          </div>
          <p>{t(`storeArtist.${view}.description`)}</p>
        </div>

        <search aria-label={t("storeArtist.search.formLabel")}>
          <form className="store-artist-search" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="artist-collection-query">{t(`storeArtist.${view}.searchLabel`)}</label>
            <div>
              <input
                id="artist-collection-query"
                name="q"
                type="search"
                ref={searchInput}
                value={query}
                onChange={(event) => updateQuery(event.currentTarget.value)}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    updateQuery("");
                    searchInput.current?.focus();
                  }}
                >
                  {t("storeArtist.search.clear")}
                </button>
              )}
            </div>
          </form>
        </search>

        <p className="store-artist-results" role="status">
          {t("storeArtist.search.resultsLabel")} {formatNumber(entries.length)}
        </p>
        {entries.length ? (
          <ul className="storefront-grid">
            {entries.map((entry) => (
              <li key={entry.id}>
                <StoreCard entry={entry} catalog={catalog} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="storefront-empty">
            <h3>
              {t(hasQuery ? "storeArtist.search.emptyHeading" : `storeArtist.${view}.emptyHeading`)}
            </h3>
            <p>
              {t(
                hasQuery
                  ? "storeArtist.search.emptyDescription"
                  : `storeArtist.${view}.emptyDescription`,
              )}
            </p>
          </div>
        )}
        <p className="storefront-artwork-note">{t("storefront.artworkNote")}</p>
      </section>

      <div className="storefront-return">
        <Link className="store-text-link" to="/store/incompris">
          {t("storeArtist.backLink")}
          <span className="storefront-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
