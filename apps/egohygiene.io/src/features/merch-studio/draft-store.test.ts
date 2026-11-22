import { describe, expect, it } from "vitest";

import { createLocalDraftStore, merchDraftFieldLimits, merchDraftStorageKey } from "./draft-store";

const input = {
  title: "Aurora Hoodie",
  description: "Fictional hoodie for exercising the draft connector.",
  productType: "Hoodie",
};

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

describe("local merch draft connector", () => {
  it("loads the mock sample and keeps a deliberately emptied list empty", async () => {
    const storage = memoryStorage();
    const store = createLocalDraftStore(storage);
    const [sample] = await store.list();
    expect(sample?.description).toContain("Fictional");
    await store.remove(sample?.id ?? "");

    await expect(createLocalDraftStore(storage).list()).resolves.toEqual([]);
  });

  it("normalizes a draft and preserves its identity across edits and connector instances", async () => {
    const storage = memoryStorage();
    const store = createLocalDraftStore(storage, () => "test-draft");
    const created = await store.save({ ...input, title: ` ${input.title} ` });
    expect(created).toEqual({ ...input, id: "test-draft" });

    const reloaded = createLocalDraftStore(storage);
    await expect(reloaded.save({ ...input, title: "Updated title" }, created.id)).resolves.toEqual({
      ...created,
      title: "Updated title",
    });
    await expect(store.list()).resolves.toContainEqual({ ...created, title: "Updated title" });

    await reloaded.remove(created.id);
    expect((await store.list()).map((draft) => draft.id)).not.toContain(created.id);
  });

  it("rejects blank and oversized fields, missing updates and duplicate IDs", async () => {
    const storage = memoryStorage();
    const store = createLocalDraftStore(storage, () => "test-draft");
    await expect(store.save({ ...input, productType: " " })).rejects.toThrow("Product type");
    await expect(
      store.save({ ...input, title: "A".repeat(merchDraftFieldLimits.title + 1) }),
    ).rejects.toThrow("Title");
    await expect(store.save(input, "missing")).rejects.toThrow("no longer exists");
    expect(storage.getItem(merchDraftStorageKey)).toBeNull();

    await store.save(input);
    await expect(store.save(input)).rejects.toThrow("unique ID");
    await expect(createLocalDraftStore(storage, () => "bad id").save(input)).rejects.toThrow(
      "unique ID",
    );
  });

  it("keeps both drafts when saves start together in the same page", async () => {
    let id = 0;
    const store = createLocalDraftStore(memoryStorage(), () => `test-draft-${++id}`);
    const drafts = await Promise.all([store.save(input), store.save(input)]);
    expect(drafts.map((draft) => draft.id)).toEqual(["test-draft-1", "test-draft-2"]);
    expect(await store.list()).toEqual(expect.arrayContaining(drafts));
  });

  it.each([
    "invalid json",
    JSON.stringify({ version: 2, drafts: [] }),
    JSON.stringify({ version: 1, drafts: [{ ...input, id: "valid-id", title: " " }] }),
    JSON.stringify({
      version: 1,
      drafts: [
        { ...input, id: "duplicate" },
        { ...input, id: "duplicate" },
      ],
    }),
  ])("rejects malformed or incompatible storage without replacing it", async (raw) => {
    const storage = memoryStorage();
    storage.setItem(merchDraftStorageKey, raw);
    const store = createLocalDraftStore(storage);
    await expect(store.list()).rejects.toThrow("invalid or unsupported format");
    await expect(store.save(input)).rejects.toThrow("invalid or unsupported format");
    expect(storage.getItem(merchDraftStorageKey)).toBe(raw);
  });

  it("reports read and write failures without reporting a successful save", async () => {
    const denied = () => {
      throw new Error("Storage unavailable");
    };
    const unreadable = createLocalDraftStore({ getItem: denied, setItem: denied });
    await expect(unreadable.list()).rejects.toThrow("Could not read merch drafts");

    const unwritable = createLocalDraftStore(
      { getItem: () => null, setItem: denied },
      () => "test-draft",
    );
    await expect(unwritable.save(input)).rejects.toThrow("Could not save merch drafts");
    await expect(unwritable.list()).resolves.toHaveLength(1);
  });
});
