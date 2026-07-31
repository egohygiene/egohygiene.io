/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

/**
 * Enables strict typing for `import.meta.env`.
 *
 * Unknown environment-variable names become TypeScript errors instead of
 * silently resolving to `any`.
 */
interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

/**
 * Public environment variables exposed to the browser by Vite.
 *
 * Every variable declared here must:
 * - Begin with `VITE_`.
 * - Be safe to expose publicly.
 * - Have a corresponding entry in `.env.example`.
 * - Be validated at runtime before application use.
 *
 * Environment values are always provided by Vite as strings.
 */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

/**
 * Adds the application environment contract to `import.meta`.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

