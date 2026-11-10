import { createTranslator } from "@egohygiene/i18n";
import type { StoreCatalog, StoreDesign } from "@egohygiene/schemas";
import { describe, expect, it } from "vitest";

import { storeEntryPath } from "../features/store/domain/index.ts";
import { resources } from "../i18n/resources";
import { products } from "./products";
import { getPublicRoutes, publicPageUrl, resolvePageMetadata } from "./publication";
import { storeCatalog, storefrontCuration } from "./store";

const t = createTranslator({ locale: "en", messages: resources });
const input = { catalog: storeCatalog, curation: storefrontCuration, t };
const heartburst = storeCatalog.entries.find(
  (entry): entry is StoreDesign => entry.id === "design-heartburst" && entry.kind === "design",
)!;

describe("reviewed public route inventory", () => {
  it("derives all 26 current paths with exactly the ten reviewed sitemap destinations", () => {
    const routes = getPublicRoutes(input);
    expect(routes).toHaveLength(26);
    expect(routes.filter((route) => route.indexable).map((route) => route.path)).toEqual([
      "/",
      "/about",
      "/accessibility",
      "/ecosystem",
      "/help",
      "/store",
      "/store/designs/heartburst",
      "/store/help",
      "/store/incompris",
      "/store/incompris/artists/play",
    ]);
    expect(routes.filter((route) => !route.indexable)).toHaveLength(16);
    expect(routes.every((route) => route.reason.length > 0)).toBe(true);
    expect(routes.some((route) => /preview|songs/.test(route.path))).toBe(false);
    expect(routes.some((route) => route.entryId === "song-demo-static-bloom")).toBe(false);
  });

  it("orders output deterministically without relying on catalog or product input order", () => {
    const before = JSON.stringify(input);
    expect(
      getPublicRoutes({
        ...input,
        catalog: { ...storeCatalog, entries: [...storeCatalog.entries].reverse() },
        products: [...products].reverse(),
      }),
    ).toEqual(getPublicRoutes(input));
    expect(JSON.stringify(input)).toBe(before);
  });

  it("requires an explicit disposition for new public artwork and stale dispositions", () => {
    const added = { ...heartburst, id: "artwork-new", slug: "new-artwork" };
    expect(() =>
      getPublicRoutes({
        ...input,
        catalog: { ...storeCatalog, entries: [...storeCatalog.entries, added] },
      }),
    ).toThrow(/publication disposition: artwork-new/);
    expect(() =>
      getPublicRoutes({
        ...input,
        catalog: {
          ...storeCatalog,
          entries: storeCatalog.entries.filter((entry) => entry.id !== heartburst.id),
        },
      }),
    ).toThrow(/Stale.*design-heartburst/);
  });

  it("does not enumerate a draft or a deliberately malformed visibility", () => {
    const malformedVisibility: StoreDesign = {
      ...heartburst,
      id: "malformed-artwork",
      slug: "malformed-artwork",
      // Exercise the defensive runtime boundary; "private" is not a valid schema value.
      // @ts-expect-error Deliberately malformed input must never become a public route.
      visibility: "private",
    };
    const catalog: StoreCatalog = {
      ...storeCatalog,
      entries: [
        ...storeCatalog.entries,
        malformedVisibility,
        { ...heartburst, id: "draft-artwork", slug: "draft-artwork", visibility: "draft" },
      ],
    };
    expect(getPublicRoutes({ ...input, catalog })).toEqual(getPublicRoutes(input));
  });

  it("keeps publication attached to canonical identity when a slug changes", () => {
    const catalog = {
      ...storeCatalog,
      entries: storeCatalog.entries.map((entry) =>
        entry.id === heartburst.id ? { ...entry, slug: "renamed-artwork" } : entry,
      ),
    };
    const route = getPublicRoutes({ ...input, catalog }).find(
      (item) => item.entryId === heartburst.id,
    );
    expect(route).toMatchObject({ path: "/store/designs/renamed-artwork", indexable: true });
  });

  it("rejects collisions and unsafe gateway paths instead of dropping a page", () => {
    const gateway = products[0]!;
    expect(() => getPublicRoutes({ ...input, products: [{ ...gateway, path: "/store" }] })).toThrow(
      /Duplicate public route/,
    );
    expect(() =>
      getPublicRoutes({ ...input, products: [{ ...gateway, path: "/../private" }] }),
    ).toThrow(/Invalid public route/);
    expect(() => getPublicRoutes({ ...input, products: [{ ...gateway, path: "/ABOUT" }] })).toThrow(
      /Invalid public route/,
    );
  });
});

describe("shared page metadata", () => {
  it("uses existing page messages and keeps canonical identity free of query and hash", () => {
    expect(resolvePageMetadata("/store?lang=en&q=heart#catalog", input)).toMatchObject({
      title: t("storeCards.metadataTitle", { title: resources.storefront.home.title }),
      description: resources.storefront.home.description,
      canonical: "https://egohygiene.io/store",
      robots: "index,follow",
      indexable: true,
    });
    expect(resolvePageMetadata("/privacy", input)).toMatchObject({
      title: "Privacy draft",
      robots: "noindex,follow",
      indexable: false,
    });
    expect(resolvePageMetadata("/mindcap", input)).toMatchObject({
      title: "Mindcap · Ego Hygiene",
      description: products[0]!.description,
      robots: "noindex,follow",
    });
  });

  it("preserves truthful design/product copy and selects only the approved artwork image", () => {
    expect(resolvePageMetadata(storeEntryPath(heartburst), input)).toMatchObject({
      title: t("storeCards.metadataTitle", { title: heartburst.title }),
      description: heartburst.description,
      image: {
        url: "https://egohygiene.io/store/heartburst/heartburst-light.webp",
        alt: heartburst.artwork.kind === "image" ? heartburst.artwork.alt : "",
      },
    });
    const fictional = resolvePageMetadata("/store/products/signal-heart-hoodie", input);
    expect(fictional).toMatchObject({ indexable: false, robots: "noindex,follow" });
    expect(fictional.description).toMatch(/fictional/i);
    expect(fictional.image).toBeUndefined();
    expect(resolvePageMetadata("/", input).image).toBeUndefined();
  });

  it("never publishes a homepage canonical for missing, noncanonical or failed routes", () => {
    for (const path of [
      "/missing",
      "/missing/deep",
      "/store/designs/missing",
      "/store/incompris/artists/missing",
      "/about/",
      "/About",
      "/store/preview/fourthwall",
    ]) {
      const result = resolvePageMetadata(path, input);
      expect(result.robots).toBe("noindex,follow");
      expect(result.canonical).toBeUndefined();
      expect(result.image).toBeUndefined();
    }
    expect(resolvePageMetadata("/store", input, { error: true })).toMatchObject({
      title: resources.errors.routeTitle,
      indexable: false,
    });
    expect(resolvePageMetadata("/store", input, { error: true }).canonical).toBeUndefined();
  });

  it("derives artist text only from a real curated artist and existing message templates", () => {
    expect(resolvePageMetadata("/store/incompris/artists/play", input)).toMatchObject({
      title: t("storeCards.metadataTitle", {
        title: t("storeArtist.metadataTitle", { artist: ".play()" }),
      }),
      description: resources.storeArtist.description,
      canonical: "https://egohygiene.io/store/incompris/artists/play",
      indexable: true,
    });
  });

  it("fails missing source metadata rather than publishing translation keys", () => {
    const empty = { ...input, t: createTranslator({ locale: "en", messages: {} }) };
    for (const path of [
      "/",
      "/store",
      "/store/incompris/artists/play",
      "/store/designs/heartburst",
      "/mindcap",
    ]) {
      expect(() => resolvePageMetadata(path, empty)).toThrow(/Missing public metadata message/);
    }
  });

  it.each([
    "//example.com",
    "/../private",
    "/store?x=y",
    "/about#x",
    "/about/",
    "/a%2fb",
    "/A",
    "https://example.com/",
  ])("rejects unsafe or noncanonical emitted path %s", (path) => {
    expect(() => publicPageUrl(path)).toThrow(/Invalid public route/);
  });
});
