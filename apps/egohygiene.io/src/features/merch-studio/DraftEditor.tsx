import { type FormEvent, useEffect, useId, useRef, useState } from "react";

import {
  type DraftStore,
  type MerchDraft,
  merchDraftFieldLimits,
  type NewMerchDraft,
} from "./draft-store";

import "./draft-editor.css";

type DraftEditorProps = {
  readonly store: DraftStore;
  readonly onPreview?: (draft: MerchDraft) => void;
};

type EditSession = { readonly id?: string; readonly input: NewMerchDraft };

const blankDraft: NewMerchDraft = { title: "", productType: "", description: "" };
const fields = [
  { name: "title", label: "Product title" },
  { name: "productType", label: "Product type" },
  { name: "description", label: "Description" },
] as const;

function operationError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function DraftEditor({ store, onPreview }: DraftEditorProps) {
  const headingId = useId();
  const listHeading = useRef<HTMLHeadingElement>(null);
  const titleField = useRef<HTMLInputElement>(null);
  const [drafts, setDrafts] = useState<MerchDraft[]>();
  const [editing, setEditing] = useState<EditSession>();
  const [removeId, setRemoveId] = useState<string>();
  const [busy, setBusy] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let current = true;
    async function loadDrafts() {
      try {
        const saved = await store.list();
        if (current) setDrafts(saved);
      } catch (error) {
        if (current) setError(operationError(error, "Product drafts could not be loaded."));
      } finally {
        if (current) setBusy(false);
      }
    }
    void loadDrafts();
    return () => {
      current = false;
    };
  }, [store]);

  const editId = editing ? (editing.id ?? "new") : undefined;
  useEffect(() => {
    if (editId !== undefined) titleField.current?.focus();
  }, [editId]);

  function beginEdit(draft?: MerchDraft) {
    setError("");
    setFeedback("");
    setRemoveId(undefined);
    setEditing(
      draft
        ? {
            id: draft.id,
            input: {
              title: draft.title,
              productType: draft.productType,
              description: draft.description,
            },
          }
        : { input: blankDraft },
    );
    titleField.current?.focus();
  }

  function updateField(name: keyof NewMerchDraft, value: string) {
    setEditing((session) =>
      session ? { ...session, input: { ...session.input, [name]: value } } : undefined,
    );
  }

  async function refresh() {
    setBusy(true);
    setError("");
    setFeedback("");
    setRemoveId(undefined);
    try {
      setDrafts(await store.list());
      setFeedback("Drafts refreshed.");
    } catch (error) {
      setError(operationError(error, "Product drafts could not be refreshed."));
    } finally {
      setBusy(false);
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing || busy) return;
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      const saved = await store.save(editing.input, editing.id);
      setDrafts((current) =>
        current?.some((draft) => draft.id === saved.id)
          ? current.map((draft) => (draft.id === saved.id ? saved : draft))
          : [saved, ...(current ?? [])],
      );
      setEditing(undefined);
      setFeedback(`Saved ${saved.title}.`);
      listHeading.current?.focus();
    } catch (error) {
      setError(operationError(error, "The product draft could not be saved."));
    } finally {
      setBusy(false);
    }
  }

  async function remove(draft: MerchDraft) {
    setBusy(true);
    setError("");
    setFeedback("");
    try {
      await store.remove(draft.id);
      setDrafts((current) => current?.filter((item) => item.id !== draft.id));
      if (editing?.id === draft.id) setEditing(undefined);
      setRemoveId(undefined);
      setFeedback(`Removed ${draft.title}.`);
      listHeading.current?.focus();
    } catch (error) {
      setError(operationError(error, "The product draft could not be removed."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="merch-draft-editor" aria-labelledby={headingId}>
      <div className="merch-draft-editor__header">
        <h2 id={headingId} ref={listHeading} tabIndex={-1}>
          Product drafts
        </h2>
        <div className="merch-draft-editor__actions">
          <button
            type="button"
            className="store-button"
            disabled={busy || !drafts}
            onClick={() => beginEdit()}
          >
            New draft
          </button>
          <button type="button" disabled={busy} onClick={() => void refresh()}>
            Refresh drafts
          </button>
        </div>
      </div>

      {error ? <p role="alert">{error}</p> : null}
      <p role="status">{busy ? "Working with drafts…" : feedback}</p>

      <div className="merch-draft-editor__workspace">
        <div className="merch-draft-editor__list">
          {!busy && drafts?.length === 0 ? <p>No product drafts yet.</p> : null}
          {drafts?.length ? (
            <ul>
              {drafts.map((draft) => (
                <li key={draft.id} className="merch-draft-editor__card">
                  <h3>{draft.title}</h3>
                  <p>{draft.productType}</p>
                  <p>{draft.description}</p>
                  <div className="merch-draft-editor__actions">
                    <button
                      type="button"
                      disabled={busy}
                      aria-label={`Edit ${draft.title}`}
                      onClick={() => beginEdit(draft)}
                    >
                      Edit
                    </button>
                    {onPreview ? (
                      <button
                        type="button"
                        disabled={busy}
                        aria-label={`Preview ${draft.title}`}
                        onClick={() => onPreview(draft)}
                      >
                        Preview
                      </button>
                    ) : null}
                    <button
                      type="button"
                      disabled={busy}
                      aria-label={`Remove ${draft.title}`}
                      aria-expanded={removeId === draft.id}
                      onClick={() => setRemoveId(removeId === draft.id ? undefined : draft.id)}
                    >
                      Remove
                    </button>
                  </div>
                  {removeId === draft.id ? (
                    <fieldset className="merch-draft-editor__confirm">
                      <legend>Remove this product draft?</legend>
                      <div className="merch-draft-editor__actions">
                        <button type="button" disabled={busy} onClick={() => void remove(draft)}>
                          Confirm remove
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setRemoveId(undefined);
                            listHeading.current?.focus();
                          }}
                        >
                          Cancel removal
                        </button>
                      </div>
                    </fieldset>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {editing ? (
          <form className="merch-draft-editor__form" onSubmit={(event) => void save(event)}>
            <h3>{editing.id ? "Edit draft" : "Create a draft"}</h3>
            {fields.map(({ name, label }) => (
              <label key={name} htmlFor={`${headingId}-${name}`}>
                {label}
                {name === "description" ? (
                  <textarea
                    id={`${headingId}-${name}`}
                    value={editing.input[name]}
                    disabled={busy}
                    onChange={(event) => updateField(name, event.currentTarget.value)}
                    maxLength={merchDraftFieldLimits[name]}
                    rows={5}
                    required
                  />
                ) : (
                  <input
                    id={`${headingId}-${name}`}
                    ref={name === "title" ? titleField : undefined}
                    value={editing.input[name]}
                    disabled={busy}
                    onChange={(event) => updateField(name, event.currentTarget.value)}
                    maxLength={merchDraftFieldLimits[name]}
                    required
                  />
                )}
              </label>
            ))}
            <div className="merch-draft-editor__actions">
              <button type="submit" className="store-button" disabled={busy}>
                Save draft
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setEditing(undefined);
                  listHeading.current?.focus();
                }}
              >
                Cancel editing
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </section>
  );
}
