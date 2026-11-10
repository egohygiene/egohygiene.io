import { z } from "zod";
import { type StoreCatalog, storeCatalogSchema, toPublicStoreCatalog } from "./store.ts";
import { storeReferenceIdSchema } from "./store-localization.ts";

/** Website public keys; private canonical identities and their crosswalk stay private. */
export function createStoreReferencesSchema() {
  return z.strictObject({
    schemaVersion: z.literal(1),
    recordings: z.array(
      z.strictObject({
        id: storeReferenceIdSchema,
        workId: storeReferenceIdSchema,
        visibility: z.enum(["public", "draft"]),
      }),
    ),
    designRecordings: z.array(
      z.strictObject({
        designId: storeReferenceIdSchema,
        recordingId: storeReferenceIdSchema,
      }),
    ),
  });
}
export type StoreReferences = z.infer<ReturnType<typeof createStoreReferencesSchema>>;

export function parseStoreReferences(catalog: StoreCatalog, input: unknown): StoreReferences {
  const validated = storeCatalogSchema.parse(catalog);
  toPublicStoreCatalog(validated);
  const references = createStoreReferencesSchema().parse(input);
  const entries = new Map(validated.entries.map((entry) => [entry.id, entry]));
  const recordings = new Map<string, StoreReferences["recordings"][number]>();
  for (const [index, recording] of references.recordings.entries()) {
    const work = entries.get(recording.workId);
    if (entries.has(recording.id) || recordings.has(recording.id))
      throw new Error(`references:recordings.${index}.id: Duplicate or colliding recording ID`);
    if (work?.kind !== "context" || work.contextType !== "song")
      throw new Error(`references:recordings.${index}.workId: Expected an existing song context`);
    if (recording.visibility === "public" && work.visibility !== "public")
      throw new Error(
        `references:recordings.${index}.workId: Public recording cannot reference draft work`,
      );
    recordings.set(recording.id, recording);
  }
  const seen = new Set<string>();
  for (const [index, link] of references.designRecordings.entries()) {
    const design = entries.get(link.designId);
    const recording = recordings.get(link.recordingId);
    const path = `references:designRecordings.${index}`;
    const identity = `${link.designId}:${link.recordingId}`;
    if (seen.has(identity)) throw new Error(`${path}: Duplicate design/recording reference`);
    seen.add(identity);
    if (design?.kind !== "design") throw new Error(`${path}.designId: Expected an existing design`);
    if (!recording) throw new Error(`${path}.recordingId: Unknown recording`);
    if (!design.contextIds.includes(recording.workId))
      throw new Error(`${path}.recordingId: Recording work is not associated with this design`);
    if (design.visibility === "public" && recording.visibility !== "public")
      throw new Error(`${path}.recordingId: Public design cannot reference draft recording`);
  }
  return references;
}

export function toPublicStoreReferences(catalog: StoreCatalog, input: unknown): StoreReferences {
  const references = parseStoreReferences(catalog, input);
  const publicDesigns = new Set(
    toPublicStoreCatalog(catalog)
      .entries.filter((entry) => entry.kind === "design")
      .map((entry) => entry.id),
  );
  const designRecordings = references.designRecordings.filter((link) =>
    publicDesigns.has(link.designId),
  );
  const used = new Set(designRecordings.map((link) => link.recordingId));
  return {
    schemaVersion: 1,
    recordings: references.recordings.filter(
      (recording) => recording.visibility === "public" && used.has(recording.id),
    ),
    designRecordings,
  };
}

export interface StoreWorkLink {
  readonly workId: string;
  readonly recordingIds: readonly string[];
}

export function getStoreDesignWorkLinks(
  catalog: StoreCatalog,
  input: unknown,
  designId: string,
): StoreWorkLink[] {
  const references = parseStoreReferences(catalog, input);
  const design = catalog.entries.find((entry) => entry.id === designId);
  if (design?.kind !== "design") throw new Error("Expected an existing design");
  const workIds = new Set(
    catalog.entries
      .filter((entry) => entry.kind === "context" && entry.contextType === "song")
      .map((entry) => entry.id),
  );
  return design.contextIds
    .filter((id) => workIds.has(id))
    .sort()
    .map((workId) => ({
      workId,
      recordingIds: references.recordings
        .filter(
          (recording) =>
            recording.workId === workId &&
            references.designRecordings.some(
              (link) => link.designId === designId && link.recordingId === recording.id,
            ),
        )
        .map((recording) => recording.id)
        .sort(),
    }));
}

export function getStoreProductWorkLinks(
  catalog: StoreCatalog,
  input: unknown,
  productId: string,
): StoreWorkLink[] {
  const references = parseStoreReferences(catalog, input);
  const product = catalog.entries.find((entry) => entry.id === productId);
  if (product?.kind !== "product") throw new Error("Expected an existing product");
  const works = new Map<string, Set<string>>();
  for (const designId of product.designIds)
    for (const link of getStoreDesignWorkLinks(catalog, references, designId)) {
      const recordings = works.get(link.workId) ?? new Set<string>();
      for (const id of link.recordingIds) recordings.add(id);
      works.set(link.workId, recordings);
    }
  return [...works]
    .sort(([a], [b]) => a.localeCompare(b, "en"))
    .map(([workId, ids]) => ({ workId, recordingIds: [...ids].sort() }));
}
