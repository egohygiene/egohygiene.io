import { hasAsciiControl } from "./text.ts";
import type { IntelligencePublication, IntelligenceRepository } from "./types";

/** Only routes admitted from the reviewed consumer publication catalog are linked. */
export function repositoryIntelligenceHref(
  repository: Pick<IntelligenceRepository, "publication">,
  surface = "intelligence",
  entity?: string,
): string | null {
  const publication = repository.publication;
  if (publication?.state !== "available") return null;
  const destination = publication.routes[surface];
  if (!destination) return null;
  try {
    const url = new URL(destination);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash)
      return null;
    if (entity) {
      if (entity.length > 512 || hasAsciiControl(entity) || entity.includes("\\")) return null;
      url.searchParams.set("entity", entity);
    }
    return url.href;
  } catch {
    return null;
  }
}

export const unavailablePublication = (
  state: IntelligencePublication["state"] = "unavailable",
): IntelligencePublication => ({
  state,
  baseUrl: null,
  routes: {},
  sourceCommit: null,
  generatorCommit: null,
  observedAt: null,
  configurationUrl: null,
  evidenceUrl: null,
  cnameUrl: null,
  sourceMatchesSnapshot: false,
});
