export type NewMerchDraft = {
  title: string;
  description: string;
  productType: string;
};

export interface MerchDraft extends NewMerchDraft {
  readonly id: string;
}

/** Draft records stay private to the selected connector. Saving never publishes a product. */
export interface DraftStore {
  list(): Promise<MerchDraft[]>;
  /** Omit the ID to create a draft; an explicit ID must already exist. */
  save(input: NewMerchDraft, id?: string): Promise<MerchDraft>;
  remove(id: string): Promise<void>;
}

export const merchDraftFieldLimits = {
  title: 120,
  description: 1000,
  productType: 80,
} as const;

export const merchDraftStorageKey = "egohygiene:merch-studio:drafts";

const sampleDraft: MerchDraft = {
  id: "mock-signal-grid-tote",
  title: "Signal Grid Tote",
  description: "Fictional sample for trying the local merch studio.",
  productType: "Tote bag",
};

function draftText(value: unknown, label: string, maxLength: number): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length === 0 || text.length > maxLength) {
    throw new Error(`${label} must be between 1 and ${maxLength} characters.`);
  }
  return text;
}

function parseInput(input: Record<string, unknown>): NewMerchDraft {
  const { title, description, productType } = input;
  return {
    title: draftText(title, "Title", merchDraftFieldLimits.title),
    description: draftText(description, "Description", merchDraftFieldLimits.description),
    productType: draftText(productType, "Product type", merchDraftFieldLimits.productType),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDraftId(value: unknown): value is string {
  return (
    typeof value === "string" && value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(value)
  );
}

function parseStoredDrafts(raw: string): MerchDraft[] {
  const envelope: unknown = JSON.parse(raw);
  if (!isRecord(envelope)) throw new Error("Invalid merch draft storage envelope.");
  const { version, drafts } = envelope;
  if (version !== 1 || !Array.isArray(drafts))
    throw new Error("Unsupported merch draft storage format.");

  const ids = new Set<string>();
  return drafts.map((value: unknown) => {
    if (!isRecord(value)) throw new Error("Invalid stored merch draft.");

    const { id } = value;
    if (!isDraftId(id) || ids.has(id)) throw new Error("Invalid or duplicate merch draft ID.");
    ids.add(id);
    return { ...parseInput(value), id };
  });
}

/** Browser-local mock. Each operation reads the latest snapshot from this browser profile. */
export function createLocalDraftStore(
  storage: Pick<Storage, "getItem" | "setItem">,
  makeId: () => string = () => globalThis.crypto.randomUUID(),
): DraftStore {
  function readDrafts(): MerchDraft[] {
    let raw: string | null;
    try {
      raw = storage.getItem(merchDraftStorageKey);
    } catch (cause) {
      throw new Error("Could not read merch drafts from browser storage.", { cause });
    }
    if (raw === null) return [{ ...sampleDraft }];

    try {
      return parseStoredDrafts(raw);
    } catch (cause) {
      throw new Error("Saved merch drafts have an invalid or unsupported format.", { cause });
    }
  }

  function writeDrafts(drafts: MerchDraft[]): void {
    try {
      storage.setItem(merchDraftStorageKey, JSON.stringify({ version: 1, drafts }));
    } catch (cause) {
      throw new Error("Could not save merch drafts to browser storage.", { cause });
    }
  }

  return {
    async list() {
      return readDrafts();
    },
    async save(input, id) {
      const fields = parseInput(input);
      const drafts = readDrafts();
      if (id !== undefined) {
        const index = drafts.findIndex((draft) => draft.id === id);
        if (index < 0) throw new Error("This merch draft no longer exists.");

        const updated = { ...fields, id };
        drafts[index] = updated;
        writeDrafts(drafts);
        return updated;
      }

      const newId = makeId();
      if (!isDraftId(newId) || drafts.some((draft) => draft.id === newId)) {
        throw new Error("Could not assign a unique ID to the merch draft.");
      }
      const created = { ...fields, id: newId };
      writeDrafts([...drafts, created]);
      return created;
    },
    async remove(id) {
      const drafts = readDrafts();
      const remaining = drafts.filter((draft) => draft.id !== id);
      if (remaining.length < drafts.length) writeDrafts(remaining);
    },
  };
}
