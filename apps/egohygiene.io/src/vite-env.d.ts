/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_PREVIEW?: string;
}

declare module "virtual:store-catalog" {
  export const storeCatalog: import("@egohygiene/schemas").StoreCatalog;
}
