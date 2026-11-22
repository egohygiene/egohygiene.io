export type StudioOwner = Readonly<{ displayName: string; role: "owner" }>;

/** An identity adapter must return only an authorized owner, or null. */
export interface StudioAuth {
  readOwner(): Promise<StudioOwner | null>;
  signIn(): Promise<StudioOwner | null>;
  signOut(): Promise<void>;
}

/** The demo identity lives only for the current page instance. */
export function createMockStudioAuth(): StudioAuth {
  let owner: StudioOwner | null = null;

  return {
    async readOwner() {
      return owner;
    },
    async signIn() {
      owner = { displayName: "Demo owner", role: "owner" };
      return owner;
    },
    async signOut() {
      owner = null;
    },
  };
}
