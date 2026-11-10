import { EndpointFrame, EndpointRecordCard } from "./EndpointFrame";
import { endpointFragment } from "./fragment";
import type { EndpointRecord } from "./types";

import "./support-endpoints.css";

function DependencyRecord({ record }: { readonly record: EndpointRecord }) {
  return (
    <article
      className="oi-panel oi-support-dependency"
      id={record.anchorId ?? endpointFragment(record.id)}
    >
      <header className="oi-section-heading">
        <div>
          <p className="oi-muted">
            {record.repository} · {record.kind}
          </p>
          <h3>{record.url ? <a href={record.url}>{record.title}</a> : record.title}</h3>
        </div>
        <span className="oi-badge">{record.state}</span>
      </header>
      <p className="oi-muted">
        Source assertion: {record.assertion} · Source freshness: {record.freshness}
      </p>
      <ul className="oi-support-edges">
        {record.relations.map((relation) => (
          <li key={JSON.stringify(relation)}>
            <p>
              <strong>{record.title}</strong>{" "}
              <span className="oi-support-edge-kind">
                {relation.label === "blocks" ? "blocks" : "depends on"}
              </span>{" "}
              {relation.target.url ? (
                <a href={relation.target.url}>{relation.target.title}</a>
              ) : (
                <strong>{relation.target.title}</strong>
              )}
            </p>
            <dl className="oi-support-edge-evidence">
              <div>
                <dt>Target repository</dt>
                <dd>{relation.target.repository}</dd>
              </div>
              <div>
                <dt>Target state</dt>
                <dd>{relation.target.state}</dd>
              </div>
              <div>
                <dt>Relationship assertion</dt>
                <dd>{relation.assertion}</dd>
              </div>
              <div>
                <dt>Relationship freshness</dt>
                <dd>{relation.freshness}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <details>
        <summary>Stable relationship identities</summary>
        <dl className="oi-provenance-list">
          {record.details.map((detail) => (
            <div key={`${detail.label}:${detail.value}`}>
              <dt>{detail.label}</dt>
              <dd>
                <code>{detail.value}</code>
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  );
}

export function DependenciesEndpoint() {
  return (
    <EndpointFrame
      id="dependencies"
      question="Which declared prerequisites and blockers connect the represented repositories?"
      renderRecord={(record) => <DependencyRecord record={record} />}
    >
      <section className="oi-support-contract">
        <h2>Read the declared direction</h2>
        <p>
          <strong>Depends on:</strong> the source requires the target. <strong>Blocks:</strong> the
          source prevents the target from advancing. Each direct relationship retains its own
          assertion and freshness.
        </p>
        <p>
          These views follow admitted public endpoints. They do not expand private topology, infer
          package dependencies, or calculate transitive impact.
        </p>
      </section>
    </EndpointFrame>
  );
}

export function WorkEndpoint() {
  return (
    <EndpointFrame
      id="work"
      question="Which open execution records and projected roadmap queues need attention?"
    >
      <section className="oi-support-contract">
        <h2>Keep execution and readiness separate</h2>
        <p>
          Open issues and open pull requests are separate inventories. Roadmap queues are
          Observatory's inferred readiness projection; each record also retains its independent
          canonical state.
        </p>
        <p>
          A closed issue, merged pull request, or active queue does not establish roadmap acceptance
          or a human decision.
        </p>
      </section>
    </EndpointFrame>
  );
}

export function JourneyEndpoint() {
  return (
    <EndpointFrame
      id="journey"
      question="Which observed events explain the represented history?"
      renderRecord={(record) => (
        <div className="oi-support-event">
          <EndpointRecordCard record={record} />
        </div>
      )}
    >
      <section className="oi-support-contract">
        <h2>Follow the captured chronology</h2>
        <p>
          Event occurrence and recording times remain distinct. The event label describes that
          observation; the linked subject state describes the current represented snapshot.
        </p>
        <p>
          Explicit public release boundaries are linked where available. Commit parents, branch
          history, causes, and missing lifecycle transitions remain unprojected.
        </p>
      </section>
    </EndpointFrame>
  );
}

export function SearchEndpoint() {
  return (
    <EndpointFrame
      id="search"
      question="Which normalized public evidence matches the supplied Search representation?"
    >
      <section className="oi-support-contract">
        <h2>Search the normalized evidence index</h2>
        <p>
          Text matching uses Observatory's supplied opaque <code>search_text</code>. Result order
          stays in the source projection; this view adds no ranking, fuzzy search, or provider
          lookup.
        </p>
        <p>
          The pinned contract does not identify which field matched. Field attribution remains
          explicitly unavailable, including for a query that matches several fields.
        </p>
      </section>
    </EndpointFrame>
  );
}
