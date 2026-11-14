import { useI18n } from "@egohygiene/i18n";
import { useSearchParams } from "react-router-dom";

import { useBrowserSnapshot } from "../../hooks/useBrowserSnapshot";
import { intelligenceData } from "./data";
import type { DirectorySourceReference, RepositoryDirectoryEntry } from "./types";

const states = ["publication-recorded", "source-declared", "unknown"] as const;
function sourceHref(source: DirectorySourceReference): string {
  return `https://github.com/${source.repository}/blob/${source.revision}/${source.path}`;
}

function DirectoryEntry({ entry }: { readonly entry: RepositoryDirectoryEntry }) {
  const { t } = useI18n();
  const { dashboard, source_observation: observation } = entry;
  const publication = dashboard.publication;
  return (
    <li className="oi-directory-entry" data-link-state={dashboard.link_state}>
      <div className="oi-directory-entry-heading">
        <a
          href={
            dashboard.link_state === "publication-recorded"
              ? (dashboard.url ?? entry.repository_url)
              : entry.repository_url
          }
        >
          <bdi dir="auto">{entry.repository}</bdi>
        </a>
        <span className="oi-view-state">
          {t(`intelligence.roster.states.${dashboard.link_state}`)}
        </span>
      </div>
      {publication.state === "recorded" && publication.observed_at ? (
        <p className="oi-directory-caption">
          {t("intelligence.roster.recordedAt")}{" "}
          <time dateTime={publication.observed_at}>{publication.observed_at}</time>
        </p>
      ) : dashboard.link_state === "source-declared" ? (
        <p className="oi-directory-caption">
          {t("intelligence.roster.declaredLimit")}{" "}
          <span>
            {t("intelligence.roster.declaredDestination")} <code>{dashboard.url}</code>
          </span>
        </p>
      ) : null}
      <details className="oi-directory-entry-details">
        <summary>{t("intelligence.roster.entryDetails")}</summary>
        <dl className="oi-provenance-list">
          <div>
            <dt>{t("intelligence.roster.inspectedRevision")}</dt>
            <dd>
              <a href={`${entry.repository_url}/tree/${observation.revision}`}>
                <code>{observation.revision}</code>
              </a>
            </dd>
          </div>
          <div>
            <dt>{t("intelligence.roster.sourceObserved")}</dt>
            <dd>
              <time dateTime={observation.observed_at}>{observation.observed_at}</time>
            </dd>
          </div>
          <div>
            <dt>{t("intelligence.roster.declaration")}</dt>
            <dd>{t(`intelligence.roster.declarations.${observation.state}`)}</dd>
          </div>
          <div>
            <dt>{t("intelligence.roster.publication")}</dt>
            <dd>{t(`intelligence.roster.publicationStates.${publication.state}`)}</dd>
          </div>
          {publication.source_revision ? (
            <div>
              <dt>{t("intelligence.roster.publishedSource")}</dt>
              <dd>
                <a href={`${entry.repository_url}/tree/${publication.source_revision}`}>
                  <code>{publication.source_revision}</code>
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
        <p className="oi-directory-evidence-links">
          <a href={entry.repository_url}>{t("intelligence.publication.github")}</a>
          {publication.run_url && publication.run_attempt !== null ? (
            <a href={publication.run_url}>
              {t("intelligence.roster.recordedRun", { attempt: publication.run_attempt })}
            </a>
          ) : null}
          {publication.evidence ? (
            <a href={sourceHref(publication.evidence)}>{t("intelligence.roster.evidence")}</a>
          ) : null}
        </p>
      </details>
    </li>
  );
}

/** Navigation rows remain separate from Core models, findings and current availability. */
export function RepositoryDirectory() {
  const { t } = useI18n();
  const [browserParams, setSearchParams] = useSearchParams();
  const browserReady = useBrowserSnapshot();
  const params = browserReady ? browserParams : new URLSearchParams();
  const query = (params.get("q") ?? "").slice(0, 160);
  const requested = params.get("directory") ?? "all";
  const state = states.includes(requested as (typeof states)[number]) ? requested : "all";
  const directory = intelligenceData.directory;
  if (directory?.state !== "admitted" || !directory.source) return null;
  const normalized = query.trim().normalize("NFKC").toLowerCase();
  const rows = directory.entries.filter(
    (entry) =>
      (!normalized || entry.repository.normalize("NFKC").toLowerCase().includes(normalized)) &&
      (state === "all" || state === entry.dashboard.link_state),
  );
  const filtering = Boolean(normalized || state !== "all");
  const source = directory.source;
  function filter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }
  return (
    <section
      className="oi-section"
      id="intelligence-directory"
      aria-labelledby="intelligence-directory-heading"
    >
      <header className="oi-section-heading">
        <div>
          <p className="site-eyebrow">{t("intelligence.roster.kicker")}</p>
          <h2 id="intelligence-directory-heading">{t("intelligence.roster.heading")}</h2>
        </div>
        <p className="oi-muted">{t("intelligence.roster.description")}</p>
      </header>
      <search className="oi-directory-filters" aria-label={t("intelligence.roster.filters")}>
        <label htmlFor="repository-roster-query">
          <span>{t("intelligence.directory.search")}</span>
          <input
            disabled={!browserReady}
            id="repository-roster-query"
            type="search"
            maxLength={160}
            value={query}
            onChange={(event) => filter("q", event.target.value)}
          />
        </label>
        <label htmlFor="repository-roster-state">
          <span>{t("intelligence.roster.linkEvidence")}</span>
          <select
            disabled={!browserReady}
            id="repository-roster-state"
            value={state}
            onChange={(event) => filter("directory", event.target.value)}
          >
            <option value="all">{t("intelligence.roster.allStates")}</option>
            {states.map((value) => (
              <option key={value} value={value}>
                {t(`intelligence.roster.states.${value}`)}
              </option>
            ))}
          </select>
        </label>
      </search>
      <p
        className="oi-results"
        role="status"
        aria-label={t("intelligence.roster.resultStatus")}
        aria-live="polite"
      >
        {t("intelligence.roster.results", { shown: rows.length, total: directory.entries.length })}
      </p>
      <noscript>
        <p className="oi-muted">{t("intelligence.roster.noScript")}</p>
      </noscript>
      {states.map((linkState) => {
        const entries = rows.filter((entry) => entry.dashboard.link_state === linkState);
        if (!entries.length) return null;
        const list = (
          <ul className="oi-directory-list" key={linkState}>
            {entries.map((entry) => (
              <DirectoryEntry key={entry.repository} entry={entry} />
            ))}
          </ul>
        );
        return linkState === "publication-recorded" ? (
          <section
            className="oi-directory-recorded"
            key={linkState}
            aria-labelledby="directory-recorded-heading"
          >
            <h3 id="directory-recorded-heading">{t("intelligence.roster.recordedHeading")}</h3>
            <p className="oi-muted">{t("intelligence.roster.recordedLimit")}</p>
            {list}
          </section>
        ) : (
          <details className="oi-directory-group" key={linkState} open={filtering}>
            <summary>
              {t(`intelligence.roster.groups.${linkState}`, { count: entries.length })}
            </summary>
            {list}
          </details>
        );
      })}
      {!rows.length ? <p className="oi-state-note">{t("intelligence.roster.noResults")}</p> : null}
      <details className="oi-evidence" id="intelligence-directory-source">
        <summary>{t("intelligence.roster.provenance")}</summary>
        <p className="oi-muted">{t("intelligence.roster.scope")}</p>
        <dl className="oi-provenance-list">
          <div>
            <dt>{t("intelligence.roster.input")}</dt>
            <dd>
              <a
                href={`https://github.com/${source.repository}/blob/${source.revision}/${source.path}`}
              >
                {source.repository}
              </a>
              <code>{source.revision}</code>
            </dd>
          </div>
          <div>
            <dt>{t("intelligence.roster.digest")}</dt>
            <dd>
              <code>{source.sha256}</code>
            </dd>
          </div>
          {directory.catalog ? (
            <div>
              <dt>{t("intelligence.roster.catalog")}</dt>
              <dd>
                <a href={sourceHref(directory.catalog)}>{directory.catalog.repository}</a>
                <time dateTime={directory.catalog.observed_at}>
                  {directory.catalog.observed_at}
                </time>
              </dd>
            </div>
          ) : null}
          {directory.sourceInventory ? (
            <div>
              <dt>{t("intelligence.roster.inventory")}</dt>
              <dd>
                <a href={sourceHref(directory.sourceInventory)}>
                  {directory.sourceInventory.repository}
                </a>
                <time dateTime={directory.sourceInventory.observed_at}>
                  {directory.sourceInventory.observed_at}
                </time>
              </dd>
            </div>
          ) : null}
        </dl>
        <p>
          <a href="https://github.com/egohygiene/.github/issues/42">
            {t("intelligence.directory.coverageOwner")}
          </a>
        </p>
      </details>
    </section>
  );
}
