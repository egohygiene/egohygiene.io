import { Link } from "react-router-dom";
import { intelligenceData } from "../data";
import { IntelligenceGraph } from "./IntelligenceGraph";

export function IntelligenceHub() {
  const graph = intelligenceData.graph;
  return (
    <section className="oi-section" id="intelligence-map" aria-labelledby="intelligence-map-title">
      <header>
        <p className="site-eyebrow">Explore the control plane</p>
        <h2 id="intelligence-map-title">Views and evidence map</h2>
        <p>
          Open each repository’s consumer-owned Pages Intelligence from the map. Central fleet
          exploration views remain available for aggregate context. Declared dependency lines retain
          their source direction and assertion.
        </p>
      </header>
      {graph ? (
        <>
          <IntelligenceGraph
            nodes={graph.nodes}
            edges={graph.edges}
            publicationRoutes={graph.publicationRoutes ?? []}
          />
          {graph.truncated ? (
            <p className="oi-state-note">
              This map is bounded to 140 nodes and 320 links. The endpoint directory and repository
              views retain the rest of the admitted context.
            </p>
          ) : null}
        </>
      ) : (
        <p className="oi-state-note">
          The map has no admitted source yet. Every endpoint remains reachable below.
        </p>
      )}
      <nav className="oi-module-nav" aria-label="Fleet exploration drafts">
        {intelligenceData.modules.map((module) => (
          <Link key={module.id} to={module.path}>
            {module.title}
          </Link>
        ))}
      </nav>
    </section>
  );
}
