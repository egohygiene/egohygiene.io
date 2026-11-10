import { Navigate, useLocation } from "react-router-dom";
import {
  intelligenceEndpointRoutes,
  type IntelligenceEndpointId,
} from "../../../content/intelligence-routes";
import { EndpointFrame } from "./EndpointFrame";
import { RoadmapEndpoint, DecisionsEndpoint } from "./IntentEndpoints";
import { HealthEndpoint, ReleasesEndpoint, DistributionEndpoint } from "./OperationEndpoints";
import {
  DependenciesEndpoint,
  WorkEndpoint,
  JourneyEndpoint,
  SearchEndpoint,
} from "./SupportEndpoints";
import {
  SanityEndpoint,
  HygieneEndpoint,
  AuditsEndpoint,
  StatusEndpoint,
  IdentityEndpoint,
  DiagnosticsEndpoint,
} from "./GovernanceEndpoints";
import { IntelligenceHub } from "../graph/IntelligenceHub";

export function IntelligenceEndpoint({ id }: { readonly id: IntelligenceEndpointId }) {
  const location = useLocation();
  const canonical = intelligenceEndpointRoutes.find((route) => route.id === id)!.path;
  if (location.pathname === canonical.slice(0, -1))
    return (
      <Navigate
        replace
        to={{ pathname: canonical, search: location.search, hash: location.hash }}
      />
    );
  switch (id) {
    case "roadmap":
      return <RoadmapEndpoint />;
    case "decisions":
      return <DecisionsEndpoint />;
    case "health":
      return <HealthEndpoint />;
    case "releases":
      return <ReleasesEndpoint />;
    case "distribution":
      return <DistributionEndpoint />;
    case "dependencies":
      return <DependenciesEndpoint />;
    case "work":
      return <WorkEndpoint />;
    case "journey":
      return <JourneyEndpoint />;
    case "search":
      return <SearchEndpoint />;
    case "sanity":
      return <SanityEndpoint />;
    case "hygiene":
      return <HygieneEndpoint />;
    case "audits":
      return <AuditsEndpoint />;
    case "status":
      return <StatusEndpoint />;
    case "identity_intelligence":
      return <IdentityEndpoint />;
    case "diagnostics":
      return <DiagnosticsEndpoint />;
    case "now":
      return (
        <EndpointFrame
          id="now"
          question="What needs attention at the current captured evidence boundary?"
        />
      );
    case "dashboard":
      return (
        <EndpointFrame
          showEmpty={false}
          id="dashboard"
          question="How do the views, public repositories and declared relationships connect?"
        >
          <IntelligenceHub />
        </EndpointFrame>
      );
    case "compare":
      return (
        <EndpointFrame
          id="compare"
          question="What changed between two compatible captured snapshots?"
        >
          <section className="oi-panel">
            <h2>A baseline is required</h2>
            <p>
              The connected fleet contains current observations. A before/after comparison is
              unavailable until a compatible retained snapshot and comparison artifact are
              explicitly admitted. Current activity cannot reconstruct a missing baseline.
            </p>
            <p>
              <a href="https://github.com/egohygiene/relay/issues/152">
                Comparison source and retention owner
              </a>{" "}
              ·{" "}
              <a href="https://github.com/egohygiene/relay/pull/163">
                Review the retained-snapshot adapter
              </a>
            </p>
          </section>
        </EndpointFrame>
      );
  }
}
export function IntelligenceAlias({ path }: { readonly path: string }) {
  const location = useLocation();
  return <Navigate replace to={{ pathname: path, search: location.search, hash: location.hash }} />;
}
