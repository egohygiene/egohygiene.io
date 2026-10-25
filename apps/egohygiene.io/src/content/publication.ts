import type { I18nParameters, Translator } from "@egohygiene/i18n";
import type { StoreCatalog, StorefrontCuration } from "@egohygiene/schemas";

import {
  getCuratedStoreArtists,
  getStoreEntryContent,
  isBrowsableEntry,
  storeArtistPath,
  storeEntryPath,
  type StoreContentSelection,
} from "../features/store/domain/index.ts";
import { products as ecosystemProducts, type EcosystemProduct } from "./products";
import type { PageMetadataValue, PublicationDisposition } from "./publication-types";

export type { PageMetadataValue, PublicationDisposition } from "./publication-types";

export const PUBLIC_ORIGIN = "https://egohygiene.io";

/** These declarations also supply the fixed paths to the shared route tree. */
export const fixedPublicRoutes = [
  {
    page: "home",
    path: "/",
    titleKey: "landing.title",
    descriptionKey: "landing.description",
    storeTitle: false,
    indexable: true,
    reason: "Public Ego Hygiene introduction.",
  },
  {
    page: "about",
    path: "/about",
    titleKey: "pages.aboutTitle",
    descriptionKey: "pages.about.description",
    storeTitle: false,
    indexable: true,
    reason: "Public project purpose.",
  },
  {
    page: "help",
    path: "/help",
    titleKey: "pages.help.title",
    descriptionKey: "pages.help.description",
    storeTitle: false,
    indexable: true,
    reason: "Current website guidance and feedback limits.",
  },
  {
    page: "accessibility",
    path: "/accessibility",
    titleKey: "pages.accessibility.title",
    descriptionKey: "pages.accessibility.description",
    storeTitle: false,
    indexable: true,
    reason: "Current accessibility information and review limits.",
  },
  {
    page: "ecosystem",
    path: "/ecosystem",
    titleKey: "pages.ecosystemTitle",
    descriptionKey: "pages.ecosystem.description",
    storeTitle: false,
    indexable: true,
    reason: "Public project directory.",
  },
  {
    page: "privacy",
    path: "/privacy",
    titleKey: "pages.privacyTitle",
    descriptionKey: "pages.privacy.description",
    storeTitle: false,
    indexable: false,
    reason: "Provisional policy draft.",
  },
  {
    page: "terms",
    path: "/terms",
    titleKey: "pages.termsTitle",
    descriptionKey: "pages.terms.description",
    storeTitle: false,
    indexable: false,
    reason: "Provisional policy draft.",
  },
  {
    page: "store",
    path: "/store",
    titleKey: "storefront.home.title",
    descriptionKey: "storefront.home.description",
    storeTitle: true,
    indexable: true,
    reason: "Curated public storefront; selection does not authorize purchases.",
  },
  {
    page: "storeHelp",
    path: "/store/help",
    titleKey: "pages.storeHelp.title",
    descriptionKey: "pages.storeHelp.description",
    storeTitle: false,
    indexable: true,
    reason: "Current store guidance and responsibility distinctions.",
  },
  {
    page: "incompris",
    path: "/store/incompris",
    titleKey: "storefront.incompris.title",
    descriptionKey: "storefront.incompris.description",
    storeTitle: true,
    indexable: true,
    reason: "Curated public Incompris collection.",
  },
  {
    page: "catalog",
    path: "/store/catalog",
    titleKey: "storeCards.catalog.title",
    descriptionKey: "storeCards.catalog.description",
    storeTitle: true,
    indexable: false,
    reason: "Generic preview browser includes fictional examples.",
  },
] as const;

export type FixedPublicPage = (typeof fixedPublicRoutes)[number]["page"];

/** Publication review is explicit and independent of IDs' spelling or purchase state. */
const catalogPublication: Readonly<Record<string, PublicationDisposition>> = {
  "design-heartburst": {
    indexable: true,
    reason: "Approved public artwork preview; no physical product is approved.",
  },
  "design-demo-signal-heart": { indexable: false, reason: "Fictional design example." },
  "design-demo-static-bloom": { indexable: false, reason: "Fictional design example." },
  "design-demo-unwritten-realm": { indexable: false, reason: "Fictional design example." },
  "product-demo-signal-heart-hoodie": {
    indexable: false,
    reason: "Fictional product example; not a real offer.",
  },
  "product-demo-static-bloom-mug": {
    indexable: false,
    reason: "Fictional product example; not a real offer.",
  },
  "product-demo-unwritten-realm-comic": {
    indexable: false,
    reason: "Fictional product example; not a real offer.",
  },
  "collection-demo-static-bloom": { indexable: false, reason: "Fictional song collection." },
};

const gatewayDisposition: PublicationDisposition = {
  indexable: false,
  reason: "Reserved ecosystem gateway; no separate deployment is represented.",
};
const artistDisposition: PublicationDisposition = {
  indexable: true,
  reason: "Explicitly curated public artist destination; selections may be empty.",
};

export interface PublicRoute extends PublicationDisposition {
  readonly path: string;
  readonly kind: "page" | "ecosystem" | "entry" | "artist";
  readonly page?: FixedPublicPage;
  readonly entryId?: string;
}

export interface PublicRouteInput {
  readonly catalog: StoreCatalog;
  readonly curation: StorefrontCuration;
  readonly products?: readonly EcosystemProduct[];
}

export interface PageMetadataInput extends PublicRouteInput {
  readonly t: Translator;
  readonly selection?: StoreContentSelection;
}

/** Only canonical, lowercase app paths are eligible for emitted output. */
export function publicPageUrl(path: string): string {
  if (!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/.test(path)) {
    throw new TypeError(`Invalid public route path: ${path}`);
  }
  return `${PUBLIC_ORIGIN}${path}`;
}

function gateways(products: readonly EcosystemProduct[]) {
  // /store is already owned by the fixed storefront, not the gateway component.
  return products.filter(
    (product) => !(product.identifier === "store" && product.path === "/store"),
  );
}

function entryDisposition(id: string): PublicationDisposition | undefined {
  return Object.hasOwn(catalogPublication, id) ? catalogPublication[id] : undefined;
}

/** The build calls this once before rendering; unknown/stale policies fail closed. */
export function getPublicRoutes({
  catalog,
  curation,
  products = ecosystemProducts,
}: PublicRouteInput): PublicRoute[] {
  const entries = catalog.entries.filter(isBrowsableEntry);
  const ids = new Set(entries.map((entry) => entry.id));
  for (const entry of entries) {
    if (!Object.hasOwn(catalogPublication, entry.id)) {
      throw new TypeError(`Public catalog entry needs a publication disposition: ${entry.id}`);
    }
  }
  for (const id of Object.keys(catalogPublication)) {
    if (!ids.has(id)) throw new TypeError(`Stale public catalog publication disposition: ${id}`);
  }

  const routes: PublicRoute[] = [
    ...fixedPublicRoutes.map(({ path, page, indexable, reason }) => ({
      path,
      page,
      kind: "page" as const,
      indexable,
      reason,
    })),
    ...gateways(products).map((product) => ({
      path: product.path,
      kind: "ecosystem" as const,
      ...gatewayDisposition,
    })),
    ...entries.map((entry) => ({
      path: storeEntryPath(entry),
      kind: "entry" as const,
      entryId: entry.id,
      ...catalogPublication[entry.id]!,
    })),
    ...getCuratedStoreArtists(catalog, curation).map(({ artist }) => ({
      path: storeArtistPath(artist),
      kind: "artist" as const,
      entryId: artist.id,
      ...artistDisposition,
    })),
  ];
  const paths = new Set<string>();
  for (const route of routes) {
    publicPageUrl(route.path);
    if (paths.has(route.path)) throw new TypeError(`Duplicate public route path: ${route.path}`);
    paths.add(route.path);
  }
  return routes.sort((left, right) =>
    left.path < right.path ? -1 : left.path > right.path ? 1 : 0,
  );
}

function metadata(
  path: string,
  title: string,
  description: string,
  disposition: PublicationDisposition,
  image?: PageMetadataValue["image"],
): PageMetadataValue {
  if (!title.trim() || !description.trim()) throw new TypeError(`Missing public metadata: ${path}`);
  return {
    title,
    description,
    canonical: publicPageUrl(path),
    indexable: disposition.indexable,
    reason: disposition.reason,
    robots: disposition.indexable ? "index,follow" : "noindex,follow",
    ogType: "website",
    ...(image ? { image } : {}),
  };
}

/** Pure resolution shared by initial HTML and client navigation. No host input is trusted. */
export function resolvePageMetadata(
  pathname: string,
  { catalog, curation, t, selection, products = ecosystemProducts }: PageMetadataInput,
  { error = false }: { readonly error?: boolean } = {},
): PageMetadataValue {
  const path = pathname.split(/[?#]/, 1)[0] ?? "";
  function message(key: string, parameters?: I18nParameters) {
    const value = t(key, parameters);
    if (value === key || !value.trim())
      throw new TypeError(`Missing public metadata message: ${key}`);
    return value;
  }
  const storeTitle = (title: string) => message("storeCards.metadataTitle", { title });
  const missing = (title: string, description: string): PageMetadataValue => ({
    title,
    description,
    indexable: false,
    reason: error ? "The route failed to render." : "No published page matches this path.",
    robots: "noindex,follow",
    ogType: "website",
  });
  if (error) return missing(message("errors.routeTitle"), message("errors.routeDescription"));

  const fixed = fixedPublicRoutes.find((route) => route.path === path);
  if (fixed) {
    const title = message(fixed.titleKey);
    const description = message(fixed.descriptionKey);
    return metadata(path, fixed.storeTitle ? storeTitle(title) : title, description, fixed);
  }
  const product = gateways(products).find((item) => item.path === path);
  if (product)
    return metadata(
      path,
      message("pages.product.title", { name: product.name }),
      product.description,
      gatewayDisposition,
    );

  const entry = catalog.entries
    .filter(isBrowsableEntry)
    .find((item) => storeEntryPath(item) === path);
  if (entry) {
    const content = getStoreEntryContent(entry, selection ?? { locale: entry.sourceLocale });
    // Only this approved public artwork is selected as an image; no garment is inferred.
    const image =
      entry.id === "design-heartburst" && entry.kind === "design" && entry.artwork.kind === "image"
        ? {
            url: new URL(entry.artwork.src, PUBLIC_ORIGIN).href,
            alt: content.artworkAlt?.value ?? entry.artwork.alt,
          }
        : undefined;
    return metadata(
      path,
      storeTitle(content.title.value),
      content.description.value,
      entryDisposition(entry.id) ?? {
        indexable: false,
        reason: "This catalog entry has no reviewed publication disposition.",
      },
      image,
    );
  }

  const artist = getCuratedStoreArtists(catalog, curation).find(
    (view) => storeArtistPath(view.artist) === path,
  )?.artist;
  if (artist) {
    const content = getStoreEntryContent(artist, selection ?? { locale: artist.sourceLocale });
    return metadata(
      path,
      storeTitle(message("storeArtist.metadataTitle", { artist: content.title.value })),
      message("storeArtist.description"),
      artistDisposition,
    );
  }
  if (/^\/store\/incompris\/artists\/[^/]+$/.test(path)) {
    return missing(
      storeTitle(message("storeArtist.missing.title")),
      message("storeArtist.missing.description"),
    );
  }
  if (/^\/store\/(?:products|designs|collections)\/[^/]+$/.test(path)) {
    return missing(
      storeTitle(message("storeCards.detail.missingTitle")),
      message("storeCards.detail.missingDescription"),
    );
  }
  return missing(message("errors.notFoundTitle"), message("errors.notFoundDescription"));
}
