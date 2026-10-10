import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getStorePurchaseAction } from "@egohygiene/schemas";
import type { StoreEntry, StoreProduct } from "@egohygiene/schemas";

import { storeCatalog } from "../../content/store";
import {
  filterStoreEntries,
  getDesignProducts,
  getEntryContexts,
  getEntryDesigns,
  getRelatedCollections,
  isBrowsableEntry,
  storeEntryPath,
} from "./catalog";
import type { BrowsableStoreEntry, StoreView } from "./catalog";
import { StoreArtwork } from "./StoreArtwork";

import "./store.css";

const views: { value: StoreView; label: string }[] = [
  { value: "all", label: "Everything" },
  { value: "product", label: "Objects" },
  { value: "design", label: "Designs" },
  { value: "collection", label: "Collections" },
];

function StoreMetadata({ title, description }: { readonly title: string; readonly description: string }) {
  useEffect(() => {
    const previousTitle = document.title;
    const existingDescription = document.querySelector<HTMLMetaElement>("meta[name=\"description\"]");
    const previousDescription = existingDescription?.content;
    const descriptionElement = existingDescription ?? document.createElement("meta");
    descriptionElement.name = "description";
    descriptionElement.content = description;
    if (!existingDescription) document.head.append(descriptionElement);
    document.title = `${title} · Ego Hygiene`;
    return () => {
      document.title = previousTitle;
      if (existingDescription) existingDescription.content = previousDescription ?? "";
      else descriptionElement.remove();
    };
  }, [title, description]);
  return null;
}

function Arrow({ diagonal = false }: { readonly diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function EntryBadge({ entry }: { readonly entry: BrowsableStoreEntry }) {
  const label = entry.kind === "product"
    ? entry.purchase.state === "live" ? "Available" : entry.purchase.state === "unavailable" ? "Unavailable" : "Preview"
    : entry.kind === "collection" ? "Collection" : entry.artwork.kind === "placeholder" ? "Design study" : "Design";
  return <span className={`store-badge${entry.kind === "product" && entry.purchase.state === "live" ? " store-badge--live" : ""}`}>{label}</span>;
}

function StoreCard({ entry }: { readonly entry: BrowsableStoreEntry }) {
  const design = getEntryDesigns(storeCatalog, entry)[0];
  return (
    <article className="store-card">
      <Link className="store-card__link" to={storeEntryPath(entry)}>
        <div className="store-card__visual">
          <StoreArtwork design={design} />
          <span className="store-card__badge"><EntryBadge entry={entry} /></span>
          <span className="store-card__arrow"><Arrow diagonal /></span>
        </div>
        <div className="store-card__body">
          <span className="store-kicker">{entry.kind === "product" ? "Object" : entry.kind}</span>
          <h3>{entry.title}</h3>
          <p>{entry.description}</p>
          <span className="store-card__action">Explore {entry.kind === "product" ? "object" : entry.kind} <Arrow /></span>
        </div>
      </Link>
    </article>
  );
}

function StoreGrid({ entries, emptyMessage }: { readonly entries: BrowsableStoreEntry[]; readonly emptyMessage: string }) {
  return entries.length ? (
    <div className="store-grid">{entries.map((entry) => <StoreCard entry={entry} key={entry.id} />)}</div>
  ) : <p className="store-empty-note">{emptyMessage}</p>;
}

function StoreBreadcrumbs({ title, kind }: { readonly title: string; readonly kind: BrowsableStoreEntry["kind"] }) {
  const parentLabel = kind === "product" ? "Objects" : kind === "design" ? "Designs" : "Collections";
  return (
    <nav className="store-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link to="/store">Store</Link></li>
        <li><Link to={`/store?view=${kind}#catalog`}>{parentLabel}</Link></li>
        <li><span aria-current="page">{title}</span></li>
      </ol>
    </nav>
  );
}

function ContextNotes({ entry }: { readonly entry: BrowsableStoreEntry }) {
  const contexts = getEntryContexts(storeCatalog, entry);
  if (!contexts.length) return null;
  return (
    <section className="store-contexts" aria-label="Connected stories">
      <h2>Part of a bigger story.</h2>
      {contexts.map((context) => (
        <div className="store-context" key={context.id}>
          <span className="store-kicker">{context.contextType}</span>
          <h3>{context.title}</h3>
          <p>{context.description}</p>
        </div>
      ))}
    </section>
  );
}

function StoreMissingPage({ kind }: { readonly kind: string }) {
  return (
    <div className="store-shell store-missing">
      <StoreMetadata title="Nothing here yet" description="This store page could not be found. Explore the current Ego Hygiene catalog." />
      <p className="store-kicker">A little off the map</p>
      <h1>This {kind} isn’t here.</h1>
      <p>The link may have changed, or this page may not be ready to share.</p>
      <Link className="store-button" to="/store">Back to the store <Arrow /></Link>
    </div>
  );
}

export function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const selectedView = searchParams.get("view");
  const view = views.find((item) => item.value === selectedView)?.value ?? "all";
  const entries = filterStoreEntries(storeCatalog, query, view);
  const products = storeCatalog.entries.filter((entry): entry is StoreProduct => entry.kind === "product");
  const hasLiveProducts = products.some((product) => product.purchase.state === "live");
  const collections = storeCatalog.entries.filter((entry) => entry.kind === "collection");
  const firstCollection = collections[0];

  function updateSearch(value: string, nextView: StoreView) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value); else next.delete("q");
    if (nextView !== "all") next.set("view", nextView); else next.delete("view");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  return (
    <div className="store-shell">
      <StoreMetadata title="Objects with a world inside" description="Explore the Ego Hygiene store: independent designs, music-inspired collections, and objects with a story." />
      <div className="store-intro-line">
        <span className="store-kicker">Ego Hygiene / The store</span>
        <span className="store-status"><span aria-hidden="true" /> {hasLiveProducts ? "Independent worlds. Shared space." : "A small world, taking shape"}</span>
      </div>
      <section className="store-hero" aria-labelledby="store-title">
        <div className="store-hero__copy">
          <p className="store-kicker">Art. Music. Things to carry with you.</p>
          <h1 id="store-title">Objects with<br />a world <em>inside.</em></h1>
          <p className="store-hero__description">Some begin with a song. Some with a feeling. A home for designs that become part of your everyday world.</p>
          <div className="store-hero__actions">
            <a className="store-button" href="#catalog">Explore the collection <Arrow /></a>
            <a className="store-text-link" href="#store-story">Meet the worlds <Arrow diagonal /></a>
          </div>
          <div className="store-hero__footnote"><span aria-hidden="true">✳</span> Made of stories. Open to becoming.</div>
        </div>
        <div className="store-hero__visual">
          <div className="store-art-caption"><span>Study / 001</span><span>Between feeling &amp; form</span></div>
          <StoreArtwork hero />
          <div className="store-art-caption"><span>Signal / Connection</span><span aria-hidden="true">∞</span></div>
        </div>
      </section>

      {!hasLiveProducts && (
        <aside className="store-preview-note" aria-label="Store preview">
          <span className="store-preview-note__mark" aria-hidden="true">↳</span>
          <p><strong>You’re seeing the beginning.</strong> The store is in preview; nothing is available to purchase yet. Sample entries are fictional and labelled in their descriptions.</p>
          <span className="store-kicker">Preview edition</span>
        </aside>
      )}

      <section className="store-catalog-section" id="catalog" aria-labelledby="catalog-heading">
        <div className="store-section-heading">
          <div><p className="store-kicker">A growing collection</p><h2 id="catalog-heading">Find your frequency.</h2></div>
          <p>Wear it. Hold it. Step into it.</p>
        </div>
        <div className="store-catalog-controls">
          <fieldset className="store-filters">
            <legend className="store-visually-hidden">Browse by type</legend>
            {views.map((item) => (
              <button type="button" aria-pressed={view === item.value} key={item.value} onClick={() => updateSearch(query, item.value)}>
                {item.label}
              </button>
            ))}
          </fieldset>
          <label className="store-search">
            <span className="store-visually-hidden">Search the store</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5" /></svg>
            <input type="search" value={query} onChange={(event) => updateSearch(event.target.value, view)} placeholder="Find a feeling, a design…" />
          </label>
        </div>
        <p className="store-result-count" role="status" aria-live="polite" aria-atomic="true">{entries.length} {entries.length === 1 ? "entry" : "entries"}{query.trim() ? ` matching “${query.trim()}”` : " to explore"}</p>
        {entries.length ? <StoreGrid entries={entries} emptyMessage="" /> : (
          <div className="store-empty">
            <span aria-hidden="true">✳</span><h3>A little quiet on this frequency.</h3>
            <p>No entries match your search. Try a different phrase or explore everything.</p>
            <button type="button" className="store-button" onClick={() => updateSearch("", "all")}>Reset search and filters <Arrow /></button>
          </div>
        )}
      </section>

      {firstCollection?.kind === "collection" && (
        <section className="store-collection-feature" aria-labelledby="collection-feature-heading">
          <div className="store-collection-feature__visual"><StoreArtwork design={getEntryDesigns(storeCatalog, firstCollection)[0]} /></div>
          <div className="store-collection-feature__copy">
            <p className="store-kicker">A song can become a place</p>
            <h2 id="collection-feature-heading">More than<br />a single object.</h2>
            <p>Follow a thread from the artwork to the objects it lives on. Each collection is a small world of its own.</p>
            <Link className="store-text-link" to={storeEntryPath(firstCollection)}>Explore {firstCollection.title} <Arrow /></Link>
          </div>
        </section>
      )}

      <section className="store-worlds" id="store-story" aria-labelledby="store-worlds-heading">
        <div><p className="store-kicker">One home. Room for many worlds.</p><h2 id="store-worlds-heading">A feeling doesn’t<br />need a category.</h2></div>
        <div className="store-worlds__copy">
          <p>Ego Hygiene is the home for this store. Some designs will grow from its own realm; others will find their place through music, characters, and independent collections.</p>
          <p>There’s room here for Incompris LLC artists, including .play(), and for something that simply felt worth making.</p>
          <p className="store-worlds__note">Artist collections are still taking shape. Demo entries are fictional and do not represent an artist release.</p>
          <Link className="store-text-link" to="/about">The idea behind Ego Hygiene <Arrow diagonal /></Link>
        </div>
      </section>
      <div className="store-signoff"><span>Keep a little of your world with you.</span><span aria-hidden="true">eh / ∞</span></div>
    </div>
  );
}

export function StoreProductPage() {
  const { slug } = useParams();
  const entry = storeCatalog.entries.find((candidate) => candidate.kind === "product" && candidate.slug === slug);
  if (!entry || entry.kind !== "product") return <StoreMissingPage kind="object" />;
  const designs = getEntryDesigns(storeCatalog, entry);
  const collections = getRelatedCollections(storeCatalog, entry);
  const action = getStorePurchaseAction(storeCatalog, entry.id);
  const purchase = entry.purchase;

  return (
    <div className="store-shell">
      <StoreMetadata title={entry.title} description={entry.description} />
      <StoreBreadcrumbs title={entry.title} kind={entry.kind} />
      <article className="store-detail">
        <div className="store-detail__art"><StoreArtwork design={designs[0]} hero={false} /><p className="store-art-disclaimer">{designs[0]?.artwork.kind === "image" ? purchase.state === "live" ? "Design artwork. Product finish and fit are shown by the checkout provider." : "Design artwork only. Production details are not confirmed." : "Concept artwork only. This is not a garment, product photograph, or print proof."}</p></div>
        <div className="store-detail__copy">
          <p className="store-kicker">An object with a story</p><EntryBadge entry={entry} /><h1>{entry.title}</h1><p className="store-detail__description">{entry.description}</p>
          <div className="store-purchase-panel">
            {action.kind === "external" ? (
              <>
                {purchase.state === "live" && purchase.displayPrice && <p className="store-price">{new Intl.NumberFormat("en-US", { style: "currency", currency: purchase.displayPrice.currency }).format(purchase.displayPrice.amountMinor / 100)} <small>before shipping and tax</small></p>}
                <a className="store-button" href={action.href} rel="external">{action.label} <Arrow diagonal /></a>
                <p>Choose your options and confirm the current price, shipping, and returns at the provider’s checkout.</p>
              </>
            ) : (
              <>
                <span className="store-purchase-status">{purchase.state === "preview" ? "Preview — not for sale yet" : "Not available to purchase"}</span>
                <p>{purchase.state === "unavailable" ? purchase.reason : "We’re still bringing this idea into the world. Details and ordering will appear here when it’s ready."}</p>
              </>
            )}
          </div>
          <dl className="store-detail-facts"><div><dt>Design</dt><dd>{designs.map((design, index) => <span key={design.id}>{index > 0 && ", "}<Link to={storeEntryPath(design)}>{design.title}</Link></span>)}</dd></div><div><dt>Availability</dt><dd>{purchase.state === "live" ? "Provider checkout" : purchase.state === "unavailable" ? "Not available" : "A work in progress"}</dd></div></dl>
        </div>
      </article>
      <ContextNotes entry={entry} />
      <section className="store-related" aria-labelledby="product-design-heading"><div className="store-section-heading"><div><p className="store-kicker">Where it begins</p><h2 id="product-design-heading">Behind the object.</h2></div></div><StoreGrid entries={designs} emptyMessage="Artwork details are on their way." /></section>
      {collections.length > 0 && <section className="store-related" aria-labelledby="product-collections-heading"><h2 id="product-collections-heading">Explore the collection.</h2><StoreGrid entries={collections} emptyMessage="" /></section>}
    </div>
  );
}

export function StoreDesignPage() {
  const { slug } = useParams();
  const entry = storeCatalog.entries.find((candidate) => candidate.kind === "design" && candidate.slug === slug);
  if (!entry || entry.kind !== "design") return <StoreMissingPage kind="design" />;
  const products = getDesignProducts(storeCatalog, entry.id);
  const collections = getRelatedCollections(storeCatalog, entry);
  return (
    <div className="store-shell">
      <StoreMetadata title={entry.title} description={entry.description} />
      <StoreBreadcrumbs title={entry.title} kind={entry.kind} />
      <article className="store-detail">
        <div className="store-detail__art"><StoreArtwork design={entry} /><p className="store-art-disclaimer">{entry.artwork.kind === "placeholder" ? "A visual study standing in for future artwork." : "Design artwork preview."}</p></div>
        <div className="store-detail__copy"><p className="store-kicker">A design, finding its form</p><h1>{entry.title}</h1><p className="store-detail__description">{entry.description}</p><p className="store-detail__note">A design can live on many objects and belong to more than one story. It can also stand entirely on its own.</p><a className="store-button" href="#design-objects">See where it lives <Arrow /></a></div>
      </article>
      <ContextNotes entry={entry} />
      <section className="store-related" id="design-objects" aria-labelledby="design-products-heading"><div className="store-section-heading"><div><p className="store-kicker">From idea to object</p><h2 id="design-products-heading">Where this design lives.</h2></div></div><StoreGrid entries={products} emptyMessage="This design has room to grow. No objects are connected yet." /></section>
      {collections.length > 0 && <section className="store-related" aria-labelledby="design-collections-heading"><h2 id="design-collections-heading">In good company.</h2><StoreGrid entries={collections} emptyMessage="" /></section>}
    </div>
  );
}

export function StoreCollectionPage() {
  const { slug } = useParams();
  const entry = storeCatalog.entries.find((candidate) => candidate.kind === "collection" && candidate.slug === slug);
  if (!entry || entry.kind !== "collection") return <StoreMissingPage kind="collection" />;
  const designs = getEntryDesigns(storeCatalog, entry);
  const products = storeCatalog.entries.filter((candidate): candidate is StoreProduct => candidate.kind === "product" && entry.productIds.includes(candidate.id));
  const entries: StoreEntry[] = [...products, ...designs];
  return (
    <div className="store-shell">
      <StoreMetadata title={entry.title} description={entry.description} />
      <StoreBreadcrumbs title={entry.title} kind={entry.kind} />
      <section className="store-collection-hero" aria-labelledby="collection-heading">
        <div><p className="store-kicker">A world of its own</p><h1 id="collection-heading">{entry.title}</h1><p>{entry.description}</p><a className="store-button" href="#collection-entries">Explore this world <Arrow /></a></div>
        <StoreArtwork design={designs[0]} />
      </section>
      <ContextNotes entry={entry} />
      <section className="store-related" id="collection-entries" aria-labelledby="collection-entries-heading"><div className="store-section-heading"><div><p className="store-kicker">Shared threads</p><h2 id="collection-entries-heading">The pieces of this world.</h2></div></div><StoreGrid entries={entries.filter(isBrowsableEntry)} emptyMessage="This world is still taking shape. Its first designs and objects will appear here." /></section>
    </div>
  );
}
