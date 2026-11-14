import { useI18n } from "@egohygiene/i18n";
import { useSearchParams } from "react-router-dom";

import { useBrowserSnapshot } from "../../../hooks/useBrowserSnapshot";
import { intelligenceData } from "../data";
import { IntelligenceGraph } from "./IntelligenceGraph";

/** Optional exploration, after task links and the repository directory. */
export function IntelligenceHub() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const browserReady = useBrowserSnapshot();
  const graph = intelligenceData.graph;
  return (
    <section className="oi-section" id="intelligence-map" aria-labelledby="intelligence-map-title">
      <details className="oi-map-disclosure" open={browserReady && Boolean(params.get("graph"))}>
        <summary>
          <span>
            <span className="site-eyebrow">{t("intelligence.map.kicker")}</span>
            <span className="oi-map-title" id="intelligence-map-title">
              {t("intelligence.map.heading")}
            </span>
            <span className="oi-muted">{t("intelligence.map.description")}</span>
          </span>
        </summary>
        <div className="oi-map-content">
          {graph ? (
            <>
              <IntelligenceGraph
                nodes={graph.nodes}
                edges={graph.edges}
                publicationRoutes={graph.publicationRoutes ?? []}
              />
              {graph.truncated ? (
                <p className="oi-state-note">{t("intelligence.map.bounded")}</p>
              ) : null}
            </>
          ) : (
            <p className="oi-state-note">{t("intelligence.map.unavailable")}</p>
          )}
        </div>
      </details>
    </section>
  );
}
