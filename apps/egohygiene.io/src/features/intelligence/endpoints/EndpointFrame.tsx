import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSyncExternalStore } from "react";
import { intelligenceData } from "../data";
import { endpointData } from "./data";
import type { EndpointRecord } from "./types";

const subscribe = () => () => undefined;
const browser = () => true;
const server = () => false;

export function EndpointRecordCard({ record }: { readonly record: EndpointRecord }) {
  return <article className="oi-panel oi-endpoint-record" id={`e-${encodeURIComponent(record.id)}`}>
    <header className="oi-section-heading"><div><p className="oi-muted">{record.repository} · {record.kind}</p><h3>{record.url ? <a href={record.url}>{record.title}</a> : record.title}</h3></div><span className="oi-badge">{record.state}</span></header>
    {record.summary ? <p>{record.summary}</p> : null}
    <p className="oi-muted">Assertion: {record.assertion} · Freshness: {record.freshness}</p>
    {record.details.length ? <dl className="oi-provenance-list">{record.details.map((detail, index) => <div key={`${detail.label}:${index}`}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl> : null}
    {record.relations.length ? <details><summary>Related evidence ({record.relations.length})</summary><ul>{record.relations.map((relation, index) => <li key={`${relation.label}:${relation.target.id}:${index}`}><b>{relation.label}</b>: {relation.target.url ? <a href={relation.target.url}>{relation.target.title}</a> : relation.target.title} <span className="oi-muted">· {relation.target.repository} · {relation.target.state} · {relation.assertion ?? relation.target.assertion}</span></li>)}</ul></details> : null}
  </article>;
}

export function EndpointFrame({ id, question, children, renderRecord }: {
  readonly id: string;
  readonly question: string;
  readonly children?: ReactNode;
  readonly renderRecord?: (record: EndpointRecord) => ReactNode;
}) {
  const ready = useSyncExternalStore(subscribe, browser, server);
  const [browserParams, setParams] = useSearchParams();
  const params = ready ? browserParams : new URLSearchParams();
  const data = endpointData(id);
  const module = intelligenceData.modules.find((item) => item.id === id);
  const query = (params.get("q") ?? "").slice(0, 160);
  const repository = params.get("repository") ?? "";
  const state = params.get("state") ?? "";
  const groups = data.groups.filter((group) => !repository || group.repository === repository);
  const normalized = query.normalize("NFKC").toLocaleLowerCase("en");
  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  };
  return <article className="oi-page">
    <p className="site-eyebrow">Organization Intelligence</p>
    <h1>{module?.title ?? id.replaceAll("_", " ")}</h1><p className="oi-lede">{question}</p>
    <nav className="oi-section-nav" aria-label="Intelligence views"><Link to={{ pathname: "/intelligence/", search: params.toString() }}>Overview</Link>{intelligenceData.modules.filter((item) => item.implemented && item.id !== "intelligence").map((item) => <Link aria-current={item.id === id ? "page" : undefined} key={item.id} to={{ pathname: item.path, search: params.toString() }}>{item.title}</Link>)}</nav>
    <section className="oi-state-panel"><h2>Evidence boundary</h2><p><b>{data.state}</b> · {intelligenceData.asOf ? `Evaluated ${intelligenceData.asOf}` : "No reviewed snapshot is connected."}</p><p>Canonical sources retain authority. Activity does not establish human approval, acceptance or conformance.</p>{module ? <a href={module.issueUrl}>Canonical owner and remaining acceptance</a> : null}</section>
    {children}
    {data.groups.length ? <div className="oi-directory-filters" role="search" aria-label="Filter evidence">
      <label>Search<input disabled={!ready} type="search" value={query} maxLength={160} onChange={(event) => update("q", event.target.value)} /></label>
      <label>Repository<select disabled={!ready} value={repository} onChange={(event) => update("repository", event.target.value)}><option value="">All public repositories</option>{data.groups.map((group) => <option key={group.repository} value={group.repository}>{group.repository}</option>)}</select></label>
      <label>State<input disabled={!ready} value={state} maxLength={128} onChange={(event) => update("state", event.target.value)} placeholder="All states" /></label>
    </div> : null}
    <noscript><p>All admitted evidence is available below. Interactive filtering requires JavaScript.</p></noscript>
    {!data.groups.length ? <p className="oi-state-note">This view has no admitted normalized evidence. Missing input remains unavailable.</p> : null}
    {groups.map((group) => {
      const records = group.records.filter((item) => (!state || item.state === state) && (!normalized || `${item.title} ${item.key} ${item.summary ?? ""}`.normalize("NFKC").toLocaleLowerCase("en").includes(normalized)));
      return <section className="oi-section" key={group.repository}><h2>{group.repository}</h2><p className="oi-muted">{group.state} · {group.reason}</p>
        <details><summary>Collection coverage</summary><ul>{group.coverage.map((claim) => <li key={claim.domain}>{claim.domain}: {claim.collection} · {claim.freshness} · {claim.reason}{claim.observedAt ? ` · ${claim.observedAt}` : ""}</li>)}</ul></details>
        {records.map((item) => <div key={item.id}>{renderRecord ? renderRecord(item) : <EndpointRecordCard record={item} />}</div>)}
        {!records.length ? <p className="oi-state-note">{group.records.length ? "No records match these filters." : group.state === "available" ? "The admitted source contains no records in this view. Collection coverage above states its scope." : "Records are unavailable for this source boundary."}</p> : null}
        {group.truncated ? <p>Presentation is bounded. Follow canonical sources for the complete inventory.</p> : null}
      </section>;
    })}
  </article>;
}
