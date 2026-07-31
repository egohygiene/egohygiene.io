import { parseBrowserEnvironment } from "./environment";

export function createBrowserConfig(env: Record<string, unknown>) {
  const parsed = parseBrowserEnvironment(env);

  return {
    siteName: parsed.VITE_SITE_NAME,
    siteUrl: parsed.VITE_SITE_URL,
  } as const;
}
