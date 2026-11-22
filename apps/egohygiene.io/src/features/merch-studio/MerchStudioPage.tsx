import { type ReactNode, useEffect, useRef, useState } from "react";

import { DraftEditor } from "./DraftEditor";
import { DraftPreview } from "./DraftPreview";
import { type MerchDraft, createLocalDraftStore } from "./draft-store";
import { type StudioAuth, type StudioOwner, createMockStudioAuth } from "./studio-auth";

type MerchStudioProps = {
  readonly auth: StudioAuth;
  readonly signInLabel: string;
  readonly children: ReactNode;
};

function MerchStudio({ auth, signInLabel, children }: MerchStudioProps) {
  const [owner, setOwner] = useState<StudioOwner | null>(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    auth.readOwner().then(
      (session) => {
        if (active) {
          setOwner(session);
          setPending(false);
        }
      },
      () => {
        if (active) {
          setError("Could not read the owner session.");
          setPending(false);
        }
      },
    );
    return () => {
      active = false;
    };
  }, [auth]);

  async function signIn() {
    setPending(true);
    setError("");
    try {
      const session = await auth.signIn();
      setOwner(session);
      if (!session) setError("An owner session is required.");
    } catch {
      setError("Could not sign in. Try again.");
    } finally {
      setPending(false);
    }
  }

  async function signOut() {
    setOwner(null);
    setPending(true);
    setError("");
    try {
      await auth.signOut();
    } catch {
      setError("Could not end the session. Try signing out again with your identity provider.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="store-shell">
      <section className="store-empty" aria-labelledby="merch-studio-title">
        <p className="store-kicker">Local storefront preview</p>
        <h1 id="merch-studio-title">Merch studio</h1>
        <p>Use fictional product details to try the authoring workflow on this device.</p>
        {owner ? (
          <>
            <p>Signed in as {owner.displayName}.</p>
            <button className="store-button" type="button" onClick={signOut}>
              Sign out
            </button>
          </>
        ) : (
          <button className="store-button" type="button" disabled={pending} onClick={signIn}>
            {signInLabel}
          </button>
        )}
        {error && <p role="alert">{error}</p>}
      </section>
      {owner && children}
    </div>
  );
}

function OwnerDrafts() {
  const [preview, setPreview] = useState<MerchDraft | null>(null);
  const previewTrigger = useRef<HTMLElement | null>(null);
  const [store] = useState(() =>
    createLocalDraftStore({
      getItem: (key) => window.localStorage.getItem(key),
      setItem: (key, value) => window.localStorage.setItem(key, value),
    }),
  );

  useEffect(() => {
    if (!preview) {
      previewTrigger.current?.focus();
      previewTrigger.current = null;
    }
  }, [preview]);

  function openPreview(draft: MerchDraft) {
    previewTrigger.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPreview(draft);
  }

  return (
    <>
      <div hidden={preview !== null}>
        <DraftEditor store={store} onPreview={openPreview} />
      </div>
      {preview && <DraftPreview draft={preview} onBack={() => setPreview(null)} />}
    </>
  );
}

export function MerchStudioPage() {
  const [auth] = useState(createMockStudioAuth);

  return (
    <MerchStudio auth={auth} signInLabel="Sign in as demo owner">
      <OwnerDrafts />
    </MerchStudio>
  );
}
