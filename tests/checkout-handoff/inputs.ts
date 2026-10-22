import type {
  StoreCheckoutRoute,
  StoreEntry,
  StoreSource,
} from "../../packages/schemas/src/store.ts";
import { parseStoreCatalog, toPublicStoreCatalog } from "../../packages/schemas/src/store.ts";

/** Fictional test identities. The destination must only be used behind request interception. */
export const CHECKOUT_HANDOFF_FIXTURE = {
  prefix: "test-handoff-37a",
  checkoutUrl: "https://test-handoff-37a.fourthwall.com/products/test-handoff-37a-fictional-live",
  artworkPath: "/store/test-handoff-37a/swatch.png",
  designId: "test-handoff-37a-design",
  draftId: "test-handoff-37a-draft-sentinel",
  live: {
    id: "test-handoff-37a-live",
    slug: "test-handoff-37a-fictional-live",
    title: "Fictional handoff test — live",
    path: "/store/products/test-handoff-37a-fictional-live",
  },
  preview: {
    id: "test-handoff-37a-preview",
    slug: "test-handoff-37a-fictional-preview",
    title: "Fictional handoff test — preview",
    path: "/store/products/test-handoff-37a-fictional-preview",
  },
  unavailable: {
    id: "test-handoff-37a-unavailable",
    slug: "test-handoff-37a-fictional-unavailable",
    title: "Fictional handoff test — unavailable",
    path: "/store/products/test-handoff-37a-fictional-unavailable",
  },
} as const;

/** Return fresh, mutable inputs so negative tests cannot contaminate a later fixture. */
export function createCheckoutHandoffInputs(): {
  sources: StoreSource[];
  routes: StoreCheckoutRoute[];
} {
  const fixture = CHECKOUT_HANDOFF_FIXTURE;
  const base = {
    schemaVersion: 2,
    sourceLocale: "en",
    translations: [] as StoreEntry["translations"],
    attribution: { status: "unknown" },
    description: "Fictional local browser test. No real merchandise or provider approval.",
    visibility: "public",
  } as const;
  const identity = ({ id, slug, title }: { id: string; slug: string; title: string }) => ({
    id,
    slug,
    title,
  });
  const entries: StoreEntry[] = [
    {
      ...base,
      contextIds: [],
      id: fixture.designId,
      slug: fixture.designId,
      title: "Fictional handoff test swatch",
      kind: "design",
      artworkRevision: 1,
      artwork: {
        kind: "image",
        src: fixture.artworkPath,
        alt: "Fictional test color swatch; not merchandise artwork",
      },
    },
    {
      ...base,
      ...identity(fixture.live),
      contextIds: [],
      kind: "product",
      designIds: [fixture.designId],
      purchase: {
        state: "live",
        provider: "fourthwall",
        routeId: "test-handoff-37a-route",
        variants: [
          {
            id: "test-handoff-37a-variant",
            label: "Fictional test size",
            providerVariantId: "test-handoff-37a-provider-variant",
          },
        ],
      },
    },
    {
      ...base,
      ...identity(fixture.preview),
      contextIds: [],
      kind: "product",
      designIds: [fixture.designId],
      purchase: { state: "preview" },
    },
    {
      ...base,
      ...identity(fixture.unavailable),
      contextIds: [],
      kind: "product",
      designIds: [fixture.designId],
      purchase: { state: "unavailable", reason: "Fictional test item is unavailable." },
    },
    {
      ...base,
      contextIds: [],
      id: fixture.draftId,
      slug: fixture.draftId,
      title: "Fictional draft sentinel — must not reach the browser",
      kind: "design",
      visibility: "draft",
      artworkRevision: 1,
      artwork: { kind: "placeholder", label: "Fictional draft sentinel" },
    },
  ];
  return {
    sources: entries.map((value) => ({ source: `${value.id}.json`, value })),
    routes: [
      {
        id: "test-handoff-37a-route",
        provider: "fourthwall",
        productId: fixture.live.id,
        checkoutUrl: fixture.checkoutUrl,
        providerVariantIds: ["test-handoff-37a-provider-variant"],
        artworkRevisions: [{ designId: fixture.designId, revision: 1 }],
      },
    ],
  };
}

export function createCheckoutHandoffCatalog() {
  const { sources, routes } = createCheckoutHandoffInputs();
  return toPublicStoreCatalog(parseStoreCatalog(sources, routes));
}

