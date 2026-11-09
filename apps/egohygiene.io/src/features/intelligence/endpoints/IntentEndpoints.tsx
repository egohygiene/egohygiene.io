import { EndpointFrame, EndpointRecordCard } from "./EndpointFrame";
import type { EndpointRecord } from "./types";

function RoadmapStep({ record }: { readonly record: EndpointRecord }) {
  const criteria = record.details.filter((detail) => detail.label.startsWith("Exit criterion "));
  const issueReferences = record.details.filter((detail) => detail.label === "Authored issue reference");
  const details = record.details.filter((detail) => !detail.label.startsWith("Exit criterion ") && detail.label !== "Authored issue reference");
  return <div className="oi-intent-step">
    <p className="site-eyebrow">Repository step · {record.key}</p>
    <EndpointRecordCard record={{ ...record, details }} />
    {criteria.length ? <section className="oi-panel" aria-label={`Canonical exit criteria for ${record.key}`}>
      <h4>Canonical exit criteria</h4>
      <ol>{criteria.map((criterion) => <li key={criterion.label}>{criterion.value}</li>)}</ol>
      <p className="oi-muted">Marks are retained from the source. They do not grant acceptance, publication or human approval.</p>
    </section> : null}
    {issueReferences.length ? <details className="oi-panel"><summary>Authored issue references</summary>
      <ul>{issueReferences.map((issue) => <li key={issue.value}><a href={issue.value}>{issue.value}</a></li>)}</ul>
      <p className="oi-muted">These declared references do not carry collected provider state. Tracked issue evidence is listed separately.</p>
    </details> : null}
  </div>;
}

function Decision({ record }: { readonly record: EndpointRecord }) {
  const scope = record.details.find((detail) => detail.label === "Decision scope")?.value;
  return <div className="oi-intent-decision">
    <p className="site-eyebrow">{scope === "organization" ? "Organization-scoped decision" : scope === "repository" ? "Repository-scoped decision" : "Decision scope not projected"} · {record.key}</p>
    <EndpointRecordCard record={record} />
  </div>;
}

export function RoadmapEndpoint() {
  return <EndpointFrame id="roadmap" question="What do the repository-owned roadmaps intend to deliver, and what prerequisites and evidence does each step declare?" renderRecord={(record) => <RoadmapStep record={record} />}>
    <section className="oi-panel" aria-labelledby="roadmap-intent-boundary">
      <h2 id="roadmap-intent-boundary">Repository intent and source-owned evidence</h2>
      <p>This view retains each repository's own steps and canonical ordering. It does not manufacture an organization initiative model or choose priorities across repositories.</p>
      <p>Canonical step state and provider execution remain separate. An issue closure, merged pull request or activity count does not complete a roadmap step.</p>
      <p className="oi-muted">Dependency direction, source exit-criterion marks and declared issue references are preserved. Derived readiness and root markers remain unprojected until the input can prove their public derivation boundary; unknown or uncollected evidence is never replaced with an inferred success.</p>
    </section>
  </EndpointFrame>;
}

export function DecisionsEndpoint() {
  return <EndpointFrame id="decisions" question="Which architectural decisions apply, who owns their canonical records, and what scope, lineage and implementation evidence is actually projected?" renderRecord={(record) => <Decision record={record} />}>
    <section className="oi-panel" aria-labelledby="decision-authority-boundary">
      <h2 id="decision-authority-boundary">Decision authority remains with its source</h2>
      <p>Decision lifecycle and implementation status answer different questions. An accepted decision may still have unknown implementation evidence; an implemented change does not ratify a proposed decision.</p>
      <p>Organization-scoped records retain their canonical source repository. Their appearance in a consumer projection does not transfer ownership or grant that consumer approval authority.</p>
      <p className="oi-muted">Supersession direction, roadmap links and evidence references come from the normalized producer. Dates, approval receipts and other absent metadata remain unprojected rather than inferred from Git activity.</p>
    </section>
  </EndpointFrame>;
}
