import { browserEnvironmentSchema, type BrowserEnvironment } from "./schema";

export function parseBrowserEnvironment(source: Record<string, unknown>): BrowserEnvironment {
  return browserEnvironmentSchema.parse(source);
}
