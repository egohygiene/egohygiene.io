import { useI18n } from "@egohygiene/i18n";
import type { StoreDesign, StoreEntry, StoreProduct } from "@egohygiene/schemas";
import { getStorePurchaseAction } from "@egohygiene/schemas";
import { useParams, useSearchParams } from "react-router-dom";
import { storeCatalog, storefrontCuration } from "../../content/store";
import { useBrowserSnapshot } from "../../hooks/useBrowserSnapshot";
import { LocaleLink as Link } from "../../i18n/LocaleLink";
import type { BrowsableStoreEntry, StoreStory, StoreView } from "./domain/index.ts";
import {
  filterStoreEntries,
  getCuratedStoreArtists,
  getDesignProducts,
  getEntryContexts,
  getEntryDesigns,
  getRelatedCollections,
  isBrowsableEntry,
  storeArtistPath,
  storeEntryPath,
} from "./domain/index.ts";
import { StoreArtwork } from "./StoreArtwork";
import { StoreArtworkGallery } from "./StoreArtworkGallery";
import { StoreArrow as Arrow, StoreCard, StoreEntryBadge as EntryBadge } from "./StoreCard";
import { StoreMetadata } from "./StoreMetadata";
import { useStoreContent } from "./useStoreContent";

import "./store-presentation.css";

const views: { value: StoreView; label: string }[] = [
  { value: "all", label: "storeCards.catalog.views.all" },
  { value: "product", label: "storeCards.catalog.views.product" },
  { value: "design", label: "storeCards.catalog.views.design" },
  { value: "collection", label: "storeCards.catalog.views.collection" },
];

const stories: { value: StoreStory; label: string }[] = [
  { value: "all", label: "storeCards.catalog.stories.all" },
  { value: "connected", label: "storeCards.catalog.stories.connected" },
  { value: "standalone", label: "storeCards.catalog.stories.standalone" },
];

function StoreGrid({
  entries,
  emptyMessage,
}: {
  readonly entries: BrowsableStoreEntry[];
  readonly emptyMessage: string;
}) {
  return entries.length ? (
    <div className="store-grid">
      {entries.map((entry) => (
        <StoreCard entry={entry} key={entry.id} />
      ))}
    </div>
  ) : (
    <p className="store-empty-note">{emptyMessage}</p>
  );
}

function StoreBreadcrumbs({
  title,
  titleLocale,
  kind,
}: {
  readonly title: string;
  readonly titleLocale?: string;
  readonly kind: BrowsableStoreEntry["kind"];
}) {
  const { t } = useI18n();
  const parentLabel = t(`storeCards.catalog.views.${kind}`);
  return (
    <nav className="store-breadcrumbs" aria-label={t("storeCards.detail.breadcrumb")}>
      <ol>
        <li>
          <Link to="/store">{t("storeCards.detail.store")}</Link>
        </li>
        <li>
          <Link to={`/store/catalog?view=${kind}#catalog`}>{parentLabel}</Link>
        </li>
        <li>
          <span aria-current="page" lang={titleLocale}>
            {title}
          </span>
        </li>
      </ol>
    </nav>
  );
}

function ContextNotes({ entry }: { readonly entry: BrowsableStoreEntry }) {
  const { t } = useI18n();
  const { content } = useStoreContent();
  const contexts = getEntryContexts(storeCatalog, entry);
  if (!contexts.length) return null;
  return (
    <section className="store-contexts" aria-label={t("storeCards.detail.contextLabel")}>
      <h2>{t("storeCards.detail.contextHeading")}</h2>
      {contexts.map((context) => {
        const presented = content(context);
        return (
          <div className="store-context" key={context.id}>
            <span className="store-kicker">
              {t(`storeCards.detail.contextType.${context.contextType}`)}
            </span>
            <h3 lang={presented.title.locale}>{presented.title.value}</h3>
            <p lang={presented.description.locale}>{presented.description.value}</p>
          </div>
        );
      })}
    </section>
  );
}

function StoreMissingPage({ kind }: { readonly kind: "object" | "design" | "collection" }) {
  const { t } = useI18n();
  return (
    <div className="store-shell store-missing">
      <StoreMetadata
        title={t("storeCards.detail.missingTitle")}
        description={t("storeCards.detail.missingDescription")}
      />
      <p className="store-kicker">{t("storeCards.detail.missingKicker")}</p>
      <h1>{t(`storeCards.detail.missing.${kind}`)}</h1>
      <p>{t("storeCards.detail.missingNote")}</p>
      <Link className="store-button" to="/store">
        {t("storeCards.detail.back")} <Arrow />
      </Link>
    </div>
  );
}

export function StoreCatalogPage() {
  const { t, formatNumber } = useI18n();
  const { content, selection } = useStoreContent();
  const [browserSearchParams, setSearchParams] = useSearchParams();
  const browserReady = useBrowserSnapshot();
  const searchParams = browserReady ? browserSearchParams : new URLSearchParams();
  const query = searchParams.get("q") ?? "";
  const selectedView = searchParams.get("view");
  const view = views.find((item) => item.value === selectedView)?.value ?? "all";
  const story = stories.find((item) => item.value === searchParams.get("story"))?.value ?? "all";
  const entries = filterStoreEntries(storeCatalog, query, view, story, selection);
  const hasFilters = query.trim().length > 0 || view !== "all" || story !== "all";
  const products = storeCatalog.entries.filter(
    (entry): entry is StoreProduct => entry.kind === "product",
  );
  const hasLiveProducts = products.some((product) => product.purchase.state === "live");
  const collections = storeCatalog.entries.filter((entry) => entry.kind === "collection");
  const firstCollection = collections[0];
  const standaloneDesign = storeCatalog.entries.find(
    (entry): entry is StoreDesign =>
      entry.kind === "design" &&
      entry.visibility === "public" &&
      getEntryContexts(storeCatalog, entry).length === 0,
  );
  const heroDesign =
    standaloneDesign ??
    storeCatalog.entries.find(
      (entry): entry is StoreDesign => entry.kind === "design" && entry.visibility === "public",
    );

  function updateSearch(value: string, nextView: StoreView, nextStory: StoreStory = story) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    if (nextView !== "all") next.set("view", nextView);
    else next.delete("view");
    if (nextStory !== "all") next.set("story", nextStory);
    else next.delete("story");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  return (
    <div className="store-shell">
      <nav className="store-breadcrumbs" aria-label={t("storeCards.catalogNavigation")}>
        <Link to="/store">{t("storeCards.backToStore")}</Link>
      </nav>
      <p className="store-kicker">{t("storeCards.catalogPreview")}</p>
      <StoreMetadata
        title={t("storeCards.catalog.title")}
        description={t("storeCards.catalog.description")}
      />
      <div className="store-intro-line">
        <span className="store-kicker">{t("storeCards.catalog.eyebrow")}</span>
        <span className="store-status">
          <span aria-hidden="true" />{" "}
          {t(
            hasLiveProducts ? "storeCards.catalog.liveStatus" : "storeCards.catalog.previewStatus",
          )}
        </span>
      </div>
      <section className="store-hero" aria-labelledby="store-title">
        <div className="store-hero__copy">
          <p className="store-kicker">{t("storeCards.catalog.kicker")}</p>
          <h1 id="store-title">{t("storeCards.catalog.heading")}</h1>
          <p className="store-hero__description">{t("storeCards.catalog.introduction")}</p>
          <div className="store-hero__actions">
            <a className="store-button" href="#catalog">
              {t("storeCards.catalog.exploreCollection")} <Arrow />
            </a>
            <a className="store-text-link" href="#worlds">
              {t("storeCards.catalog.meetWorlds")} <Arrow diagonal />
            </a>
          </div>
          <div className="store-hero__footnote">
            <span aria-hidden="true">✳</span> {t("storeCards.catalog.footnote")}
          </div>
        </div>
        <div className="store-hero__visual">
          <div className="store-art-caption">
            <span>{t("storeCards.catalog.archive")}</span>
            <span>{t("storeCards.catalog.artCaption")}</span>
          </div>
          {heroDesign ? (
            <>
              <Link
                className="store-hero__art-link"
                to={storeEntryPath(heroDesign)}
                aria-label={t("storeCards.catalog.exploreTitle", {
                  title: content(heroDesign).title.value,
                })}
              >
                <StoreArtwork design={heroDesign} hero />
              </Link>
              <Link className="store-hero__artifact" to={storeEntryPath(heroDesign)}>
                <div>
                  <span className="store-kicker">
                    {t(
                      getEntryContexts(storeCatalog, heroDesign).length
                        ? "storeCards.catalog.connected"
                        : "storeCards.catalog.standalone",
                    )}
                  </span>
                  <h2 lang={content(heroDesign).title.locale}>{content(heroDesign).title.value}</h2>
                </div>
                <Arrow diagonal />
              </Link>
            </>
          ) : (
            <StoreArtwork hero />
          )}
        </div>
      </section>

      {!hasLiveProducts && (
        <aside className="store-preview-note" aria-label={t("storeCards.catalog.previewLabel")}>
          <span className="store-preview-note__mark" aria-hidden="true">
            ↳
          </span>
          <p>
            <strong>{t("storeCards.catalog.previewLead")}</strong>{" "}
            {t("storeCards.catalog.previewDescription")}
          </p>
          {import.meta.env.VITE_STORE_PREVIEW === "true" && (
            <Link className="store-text-link" to="/store/preview/fourthwall">
              {t("storeCards.catalog.previewDemo")} <Arrow />
            </Link>
          )}
          <span className="store-kicker">{t("storeCards.catalog.previewEdition")}</span>
        </aside>
      )}

      {(firstCollection || standaloneDesign) && (
        <section className="store-pathways" id="worlds" aria-labelledby="store-pathways-heading">
          <div className="store-section-heading">
            <div>
              <p className="store-kicker">{t("storeCards.catalog.pathwaysKicker")}</p>
              <h2 id="store-pathways-heading">{t("storeCards.catalog.pathwaysHeading")}</h2>
            </div>
            <p>{t("storeCards.catalog.pathwaysDescription")}</p>
          </div>
          <div className="store-pathways__grid">
            {firstCollection && (
              <Link className="store-pathway" to={storeEntryPath(firstCollection)}>
                <div className="store-pathway__art">
                  <StoreArtwork design={getEntryDesigns(storeCatalog, firstCollection)[0]} />
                </div>
                <div className="store-pathway__copy">
                  <span className="store-kicker">{t("storeCards.catalog.enterCollection")}</span>
                  <h3 lang={content(firstCollection).title.locale}>
                    {content(firstCollection).title.value}
                  </h3>
                  <p lang={content(firstCollection).description.locale}>
                    {content(firstCollection).description.value}
                  </p>
                  <span className="store-text-link">
                    {t("storeCards.catalog.stepInside")} <Arrow />
                  </span>
                </div>
              </Link>
            )}
            {standaloneDesign && (
              <Link
                className="store-pathway store-pathway--independent"
                to={storeEntryPath(standaloneDesign)}
              >
                <div className="store-pathway__art">
                  <StoreArtwork design={standaloneDesign} />
                </div>
                <div className="store-pathway__copy">
                  <span className="store-kicker">{t("storeCards.catalog.independent")}</span>
                  <h3 lang={content(standaloneDesign).title.locale}>
                    {content(standaloneDesign).title.value}
                  </h3>
                  <p>{t("storeCards.catalog.independentDescription")}</p>
                  <span className="store-text-link">
                    {t("storeCards.catalog.followDesign")} <Arrow />
                  </span>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="store-catalog-section" id="catalog" aria-labelledby="catalog-heading">
        <div className="store-section-heading">
          <div>
            <p className="store-kicker">{t("storeCards.catalog.browseKicker")}</p>
            <h2 id="catalog-heading">{t("storeCards.catalog.browseHeading")}</h2>
          </div>
          <p>{t("storeCards.catalog.browseDescription")}</p>
        </div>
        <div className="store-catalog-controls">
          <fieldset className="store-filters">
            <legend className="store-visually-hidden">{t("storeCards.catalog.typeLegend")}</legend>
            {views.map((item) => (
              <button
                type="button"
                aria-pressed={view === item.value}
                key={item.value}
                onClick={() => updateSearch(query, item.value)}
              >
                {t(item.label)}
              </button>
            ))}
          </fieldset>
          <label className="store-search">
            <span className="store-visually-hidden">{t("storeCards.catalog.searchLabel")}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="6" />
              <path d="m15 15 5 5" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => updateSearch(event.target.value, view)}
              placeholder={t("storeCards.catalog.searchPlaceholder")}
            />
          </label>
        </div>
        <div className="store-catalog-options">
          <label className="store-select">
            {t("storeCards.catalog.storyLabel")}
            <select
              value={story}
              onChange={(event) =>
                updateSearch(
                  query,
                  view,
                  stories.find((item) => item.value === event.target.value)?.value ?? "all",
                )
              }
            >
              {stories.map((item) => (
                <option key={item.value} value={item.value}>
                  {t(item.label)}
                </option>
              ))}
            </select>
          </label>
          {hasFilters && (
            <button
              type="button"
              className="store-reset"
              onClick={() => updateSearch("", "all", "all")}
            >
              {t("storeCards.catalog.clearFilters")} <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
        <p className="store-result-count" role="status" aria-live="polite" aria-atomic="true">
          {t(query.trim() ? "storeCards.catalog.matching" : "storeCards.catalog.results", {
            count: entries.length,
            formattedCount: formatNumber(entries.length),
            query: query.trim(),
          })}
        </p>
        {entries.length ? (
          <StoreGrid entries={entries} emptyMessage="" />
        ) : (
          <div className="store-empty">
            <span aria-hidden="true">✳</span>
            <h3>{t("storeCards.catalog.emptyHeading")}</h3>
            <p>{t("storeCards.catalog.emptyDescription")}</p>
            <button
              type="button"
              className="store-button"
              onClick={() => updateSearch("", "all", "all")}
            >
              {t("storeCards.catalog.reset")} <Arrow />
            </button>
          </div>
        )}
      </section>

      {firstCollection?.kind === "collection" && (
        <section className="store-collection-feature" aria-labelledby="collection-feature-heading">
          <div className="store-collection-feature__visual">
            <StoreArtwork design={getEntryDesigns(storeCatalog, firstCollection)[0]} />
          </div>
          <div className="store-collection-feature__copy">
            <p className="store-kicker">{t("storeCards.catalog.featureKicker")}</p>
            <h2 id="collection-feature-heading">{t("storeCards.catalog.featureHeading")}</h2>
            <p>{t("storeCards.catalog.featureDescription")}</p>
            <Link className="store-text-link" to={storeEntryPath(firstCollection)}>
              {t("storeCards.catalog.exploreTitle", {
                title: content(firstCollection).title.value,
              })}{" "}
              <Arrow />
            </Link>
          </div>
        </section>
      )}

      <section className="store-worlds" id="store-story" aria-labelledby="store-worlds-heading">
        <div>
          <p className="store-kicker">{t("storeCards.catalog.worldsKicker")}</p>
          <h2 id="store-worlds-heading">{t("storeCards.catalog.worldsHeading")}</h2>
        </div>
        <div className="store-worlds__copy">
          <p>{t("storeCards.catalog.worldsDescription")}</p>
          <p>{t("storeCards.catalog.worldsCommunity")}</p>
          <p className="store-worlds__note">{t("storeCards.catalog.worldsNote")}</p>
          <Link className="store-text-link" to="/about">
            {t("storeCards.catalog.aboutLink")} <Arrow diagonal />
          </Link>
        </div>
      </section>
      <div className="store-signoff">
        <span>{t("storeCards.catalog.signoff")}</span>
        <span aria-hidden="true">eh / ∞</span>
      </div>
    </div>
  );
}

export function StoreProductPage() {
  const { content } = useStoreContent();
  const { t, locale } = useI18n();
  const { slug } = useParams();
  const entry = storeCatalog.entries.find(
    (candidate) => candidate.kind === "product" && candidate.slug === slug,
  );
  if (entry?.kind !== "product") return <StoreMissingPage kind="object" />;
  const presented = content(entry);
  const designs = getEntryDesigns(storeCatalog, entry);
  const collections = getRelatedCollections(storeCatalog, entry);
  const action = getStorePurchaseAction(storeCatalog, entry.id);
  const purchase = entry.purchase;

  return (
    <div className="store-shell">
      <StoreMetadata title={presented.title.value} description={presented.description.value} />
      <StoreBreadcrumbs
        title={presented.title.value}
        titleLocale={presented.title.locale}
        kind={entry.kind}
      />
      <article className="store-detail">
        <div className="store-detail__art">
          <StoreArtworkGallery
            designs={designs}
            title={presented.title.value}
            titleLocale={presented.title.locale}
          />
          <p className="store-art-disclaimer">
            {t(
              designs[0]?.artwork.kind === "image"
                ? purchase.state === "live"
                  ? "storeCards.detail.liveArtwork"
                  : "storeCards.detail.previewArtwork"
                : "storeCards.detail.conceptArtwork",
            )}
          </p>
        </div>
        <div className="store-detail__copy">
          <p className="store-kicker">{t("storeCards.detail.productKicker")}</p>
          <EntryBadge entry={entry} />
          <h1 lang={presented.title.locale}>{presented.title.value}</h1>
          <p className="store-detail__description" lang={presented.description.locale}>
            {presented.description.value}
          </p>
          <div className="store-purchase-panel">
            {action.kind === "external" ? (
              <>
                {purchase.state === "live" && purchase.displayPrice && (
                  <p className="store-price">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: purchase.displayPrice.currency,
                    }).format(purchase.displayPrice.amountMinor / 100)}{" "}
                    <small>{t("storeCards.detail.priceNote")}</small>
                  </p>
                )}
                <a className="store-button" href={action.href} rel="external">
                  {t("storeCards.detail.shopFourthwall")} <Arrow diagonal />
                </a>
                <p>{t("storeCards.detail.checkoutNote")}</p>
                <ul aria-label={t("storeCards.detail.customerInformation")}>
                  <li>
                    <a href={action.disclosures.shippingPolicyUrl} rel="external">
                      {t("storeCards.detail.shippingPolicy")}
                    </a>
                  </li>
                  <li>
                    <a href={action.disclosures.returnsPolicyUrl} rel="external">
                      {t("storeCards.detail.returnsPolicy")}
                    </a>
                  </li>
                  <li>
                    <a href={action.disclosures.supportUrl} rel="external">
                      {t("storeCards.detail.orderSupport")}
                    </a>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <span className="store-purchase-status">
                  {t(
                    purchase.state === "preview"
                      ? "storeCards.detail.previewStatus"
                      : "storeCards.detail.unavailableStatus",
                  )}
                </span>
                <p lang={presented.unavailableReason?.locale}>
                  {purchase.state === "unavailable"
                    ? (presented.unavailableReason?.value ?? purchase.reason)
                    : t("storeCards.detail.previewNote")}
                </p>
              </>
            )}
            <p>
              <Link to="/store/help">{t("storeCards.detail.storeHelp")}</Link>
            </p>
          </div>
          <dl className="store-detail-facts">
            <div>
              <dt>{t("storeCards.detail.designLabel")}</dt>
              <dd>
                {designs.map((design, index) => (
                  <span key={design.id}>
                    {index > 0 && ", "}
                    <Link to={storeEntryPath(design)} lang={content(design).title.locale}>
                      {content(design).title.value}
                    </Link>
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt>{t("storeCards.detail.availabilityLabel")}</dt>
              <dd>{t(`storeCards.detail.availability.${purchase.state}`)}</dd>
            </div>
          </dl>
          {collections[0] && (
            <Link className="store-detail-world" to={storeEntryPath(collections[0])}>
              <span className="store-kicker">{t("storeCards.detail.biggerWorld")}</span>
              <span lang={content(collections[0]).title.locale}>
                {content(collections[0]).title.value} <Arrow />
              </span>
            </Link>
          )}
        </div>
      </article>
      <ContextNotes entry={entry} />
      <section className="store-related" aria-labelledby="product-design-heading">
        <div className="store-section-heading">
          <div>
            <p className="store-kicker">{t("storeCards.detail.originsKicker")}</p>
            <h2 id="product-design-heading">{t("storeCards.detail.originsHeading")}</h2>
          </div>
        </div>
        <StoreGrid entries={designs} emptyMessage={t("storeCards.detail.artworkEmpty")} />
      </section>
      {collections.length > 0 && (
        <section className="store-related" aria-labelledby="product-collections-heading">
          <h2 id="product-collections-heading">{t("storeCards.detail.collectionsHeading")}</h2>
          <StoreGrid entries={collections} emptyMessage="" />
        </section>
      )}
    </div>
  );
}

export function StoreDesignPage() {
  const { content } = useStoreContent();
  const { t } = useI18n();
  const { slug } = useParams();
  const entry = storeCatalog.entries.find(
    (candidate) => candidate.kind === "design" && candidate.slug === slug,
  );
  if (entry?.kind !== "design") return <StoreMissingPage kind="design" />;
  const presented = content(entry);
  const products = getDesignProducts(storeCatalog, entry.id);
  const collections = getRelatedCollections(storeCatalog, entry);
  return (
    <div className="store-shell">
      <StoreMetadata title={presented.title.value} description={presented.description.value} />
      <StoreBreadcrumbs
        title={presented.title.value}
        titleLocale={presented.title.locale}
        kind={entry.kind}
      />
      <article className="store-detail">
        <div className="store-detail__art">
          <StoreArtworkGallery
            designs={[entry]}
            title={presented.title.value}
            titleLocale={presented.title.locale}
          />
          <p className="store-art-disclaimer">
            {t(
              entry.artwork.kind === "placeholder"
                ? "storeCards.detail.studyNote"
                : "storeCards.detail.designNote",
            )}
          </p>
        </div>
        <div className="store-detail__copy">
          <p className="store-kicker">{t("storeCards.detail.designKicker")}</p>
          <h1 lang={presented.title.locale}>{presented.title.value}</h1>
          <p className="store-detail__description" lang={presented.description.locale}>
            {presented.description.value}
          </p>
          <p className="store-detail__note">{t("storeCards.detail.designIntroduction")}</p>
          <a className="store-button" href="#design-objects">
            {t("storeCards.detail.designLink")} <Arrow />
          </a>
        </div>
      </article>
      <ContextNotes entry={entry} />
      <section
        className="store-related"
        id="design-objects"
        aria-labelledby="design-products-heading"
      >
        <div className="store-section-heading">
          <div>
            <p className="store-kicker">{t("storeCards.detail.productsKicker")}</p>
            <h2 id="design-products-heading">{t("storeCards.detail.productsHeading")}</h2>
          </div>
        </div>
        <StoreGrid entries={products} emptyMessage={t("storeCards.detail.productsEmpty")} />
      </section>
      {collections.length > 0 && (
        <section className="store-related" aria-labelledby="design-collections-heading">
          <h2 id="design-collections-heading">{t("storeCards.detail.designCollectionsHeading")}</h2>
          <StoreGrid entries={collections} emptyMessage="" />
        </section>
      )}
    </div>
  );
}

export function StoreCollectionPage() {
  const { content } = useStoreContent();
  const { t } = useI18n();
  const { slug } = useParams();
  const entry = storeCatalog.entries.find(
    (candidate) => candidate.kind === "collection" && candidate.slug === slug,
  );
  if (entry?.kind !== "collection") return <StoreMissingPage kind="collection" />;
  const presented = content(entry);
  const designs = getEntryDesigns(storeCatalog, entry);
  const products = storeCatalog.entries.filter(
    (candidate): candidate is StoreProduct =>
      candidate.kind === "product" && entry.productIds.includes(candidate.id),
  );
  const entries: StoreEntry[] = [...products, ...designs];
  const artists = getCuratedStoreArtists(storeCatalog, storefrontCuration).filter((item) =>
    item.songCollections.some((collection) => collection.id === entry.id),
  );
  return (
    <div className="store-shell">
      <StoreMetadata title={presented.title.value} description={presented.description.value} />
      <StoreBreadcrumbs
        title={presented.title.value}
        titleLocale={presented.title.locale}
        kind={entry.kind}
      />
      <section className="store-collection-hero" aria-labelledby="collection-heading">
        <div>
          <p className="store-kicker">{t("storeCards.detail.collectionKicker")}</p>
          <h1 id="collection-heading" lang={presented.title.locale}>
            {presented.title.value}
          </h1>
          <p lang={presented.description.locale}>{presented.description.value}</p>
          <a className="store-button" href="#collection-entries">
            {t("storeCards.detail.collectionLink")} <Arrow />
          </a>
        </div>
        <StoreArtworkGallery
          designs={designs}
          title={presented.title.value}
          titleLocale={presented.title.locale}
        />
      </section>
      <ContextNotes entry={entry} />
      {artists.length > 0 && (
        <nav className="store-artist-returns" aria-label={t("storeArtist.collectionArtists")}>
          <h2>{t("storeArtist.collectionArtists")}</h2>
          <ul>
            {artists.map(({ artist }) => (
              <li key={artist.id}>
                <Link className="store-text-link" to={`${storeArtistPath(artist)}?view=songs`}>
                  {t("storeArtist.collectionSongLink", { artist: content(artist).title.value })}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <section
        className="store-related"
        id="collection-entries"
        aria-labelledby="collection-entries-heading"
      >
        <div className="store-section-heading">
          <div>
            <p className="store-kicker">{t("storeCards.detail.entriesKicker")}</p>
            <h2 id="collection-entries-heading">{t("storeCards.detail.entriesHeading")}</h2>
          </div>
        </div>
        <StoreGrid
          entries={entries.filter(isBrowsableEntry)}
          emptyMessage={t("storeCards.detail.entriesEmpty")}
        />
      </section>
    </div>
  );
}
