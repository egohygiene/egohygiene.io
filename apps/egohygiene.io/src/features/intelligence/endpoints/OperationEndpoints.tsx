import { Link } from "react-router-dom";

import { endpointData } from "./data";
import { EndpointFrame } from "./EndpointFrame";

export function HealthEndpoint() {
  return (
    <EndpointFrame
      id="health"
      question="What do the current check records say, and which evidence is stale, unknown or unavailable?"
    >
      <section className="oi-panel" aria-labelledby="health-check-boundary">
        <h2 id="health-check-boundary">Check evidence, source by source</h2>
        <p>
          Each record retains its source state, assertion and freshness. An execution outcome and a
          policy finding remain separate observations. A successful run can still report findings; a
          missing or cancelled run does not establish a pass.
        </p>
        <p>
          Coverage describes what was collected. A complete empty inventory establishes no check
          result. Unknown, skipped, not applicable and stale evidence keep their supplied states.
        </p>
        <p className="oi-muted">
          Health has no universal score. Hygiene conformance, live service status and human
          architecture approval retain their own evidence.
        </p>
      </section>
    </EndpointFrame>
  );
}

export function ReleasesEndpoint() {
  return (
    <EndpointFrame
      id="releases"
      question="What release evidence is published, what work does it include, and which deployment observations are linked?"
    >
      <section className="oi-panel" aria-labelledby="release-evidence-boundary">
        <h2 id="release-evidence-boundary">Publication and deployment evidence</h2>
        <p>
          Release records retain their original state and publication timestamp when supplied.
          Included work and deployment observations have separate source links, states and
          freshness. A build result or merged change does not establish a release publication.
        </p>
        <p>
          A publication record does not prove deployment, a working installation or package-manager
          availability. Missing links remain absent evidence; they do not establish failure or
          success.
        </p>
        <p>
          <Link to="/intelligence/distribution/">Inspect the distribution evidence boundary</Link>
        </p>
      </section>
    </EndpointFrame>
  );
}

function RelatedReleaseEvidence() {
  const groups = endpointData("releases").groups;
  const related = groups
    .flatMap((group) => group.records)
    .filter((release) => release.url !== null)
    .slice(0, 24);
  return (
    <section className="oi-panel" aria-labelledby="distribution-release-links">
      <h2 id="distribution-release-links">Related release evidence</h2>
      <p>
        These links identify public release source records. They provide context for a later
        installation or distribution check.
      </p>
      {related.length ? (
        <ul>
          {related.map((release) => (
            <li key={release.id}>
              <a href={release.url ?? undefined}>{release.title}</a>{" "}
              <span className="oi-muted">
                · {release.repository} · {release.state} · {release.freshness}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="oi-state-note">No navigable public release evidence is connected.</p>
      )}
      <p>
        <Link to="/intelligence/releases/">Open release evidence and its collection coverage</Link>
      </p>
    </section>
  );
}

export function DistributionEndpoint() {
  return (
    <EndpointFrame
      id="distribution"
      question="What evidence verifies installation and distribution for these releases?"
    >
      <section className="oi-state-panel" aria-labelledby="distribution-unavailable">
        <h2 id="distribution-unavailable">Distribution evidence unavailable</h2>
        <p>
          The connected normalized model has no distribution or installation-verification domain.
          Package-manager availability, installation outcomes, supported target coverage and
          distribution freshness remain unavailable.
        </p>
        <p>
          Release publications and deployment observations remain available through their own source
          records. They do not establish an installation result.
        </p>
      </section>
      <RelatedReleaseEvidence />
    </EndpointFrame>
  );
}
