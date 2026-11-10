import { parseStoreCatalog } from "../../../packages/schemas/src/store.ts";

/** Fictional public keys only; never an import or mapping of private creative records. */
export function relationshipFixture() {
  const base = (id: string, visibility = "public") => ({
    schemaVersion: 3,
    id,
    slug: id,
    title: `Fictional ${id}`,
    description: "Synthetic #34 fixture",
    sourceLocale: "en",
    visibility,
  });
  const design = (id: string, contextIds: string[], visibility = "public") => ({
    ...base(id, visibility),
    kind: "design",
    contextIds,
    artworkRevision: 1,
    artwork: { kind: "image", src: `/store/${id}.webp`, alt: "Fictional artwork" },
  });
  const product = (id: string, designIds: string[]) => ({
    ...base(id),
    kind: "product",
    designIds,
    contextIds: [],
    purchase: { state: "preview" },
  });
  const catalog = parseStoreCatalog(
    [
      { ...base("work-fictional-one"), kind: "context", contextType: "song" },
      { ...base("work-fictional-two"), kind: "context", contextType: "song" },
      { ...base("work-fictional-draft", "draft"), kind: "context", contextType: "song" },
      { ...base("character-fictional"), kind: "context", contextType: "character" },
      design("design-fictional-standalone", ["character-fictional"]),
      design("design-fictional-shared", ["work-fictional-one", "work-fictional-two"]),
      design("design-fictional-draft", ["work-fictional-draft"], "draft"),
      product("product-fictional-one", ["design-fictional-shared"]),
      product("product-fictional-two", ["design-fictional-shared", "design-fictional-standalone"]),
    ].map((value) => ({ source: value.id, value })),
  );
  const references = {
    schemaVersion: 1,
    recordings: [
      { id: "recording-fictional-one", workId: "work-fictional-one", visibility: "public" },
      { id: "recording-fictional-two", workId: "work-fictional-two", visibility: "public" },
      { id: "recording-fictional-draft", workId: "work-fictional-draft", visibility: "draft" },
    ],
    designRecordings: [
      { designId: "design-fictional-shared", recordingId: "recording-fictional-one" },
      { designId: "design-fictional-shared", recordingId: "recording-fictional-two" },
      { designId: "design-fictional-draft", recordingId: "recording-fictional-draft" },
    ],
  };
  return { catalog, references };
}
