/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_PREVIEW?: string;
}

declare module "virtual:store-catalog" {
  export const storeCatalog: import("@egohygiene/schemas").StoreCatalog;
  export const storefrontCuration: import("@egohygiene/schemas").StorefrontCuration;
}

declare module "virtual:organization-intelligence" {
  export const intelligenceData: import("./features/intelligence/types").IntelligenceData;
}
