import { useI18n } from "@egohygiene/i18n";
import { useLocation, useSearchParams } from "react-router-dom";
import { PageMetadata } from "../../components/PageMetadata/PageMetadata";
import { useBrowserSnapshot } from "../../hooks/useBrowserSnapshot";
import { LocaleLink as Link } from "../../i18n/LocaleLink";
import { intelligenceData } from "./data";
import { IntelligenceHub } from "./graph/IntelligenceHub";
import { IntelligenceViews } from "./IntelligenceViews";
import { repositoryIntelligenceHref } from "./publication";
import { RepositoryPublicationLinks } from "./RepositoryPublicationLinks";
import type { EvidenceState, IntelligenceItem, IntelligenceRepository } from "./types";

import "./intelligence.css";

const evidenceStates: readonly EvidenceState[] = [
  "current",
  "stale",
  "unknown",
  "partial",
  "unavailable",
  "error",
  "not_applicable",
];

function repositoryAnchor(name: string): string {
  return `repository-${name.replaceAll("/", "--")}`;
}

function EvidenceItems({ items }: { readonly items: readonly IntelligenceItem[] }) {
  const { t } = useI18n();
  return items.length ? (
    <ul className="oi-evidence-items">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            {item.url ? (
              <a href={item.url}>
                <bdi dir="auto">{item.title}</bdi>
              </a>
            ) : (
              <bdi dir="auto">{item.title}</bdi>
            )}
          </div>
          <dl className="oi-item-states">
            <div>
              <dt>{t("intelligence.item.state")}</dt>
              <dd>
                <bdi dir="auto">{item.state}</bdi>
              </dd>
            </div>
            <div>
              <dt>{t("intelligence.item.assertion")}</dt>
              <dd>
                <bdi dir="auto">{item.assertion}</bdi>
              </dd>
            </div>
            <div>
              <dt>{t("intelligence.item.freshness")}</dt>
              <dd>
                <bdi dir="auto">{item.freshness}</bdi>
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  ) : (
    <p className="oi-muted">{t("intelligence.now.emptyList")}</p>
  );
}

function RepositoryEvidence({ repository }: { readonly repository: IntelligenceRepository }) {
  const { t } = useI18n();
  function label(group: string, value: string) {
    const key = `intelligence.${group}.${value}`;
    const translated = t(key);
    return translated === key ? value.replaceAll("_", " ") : translated;
  }

  return (
    <div className="oi-repository-evidence">
      <dl className="oi-provenance-list">
        <div>
          <dt>{t("intelligence.repository.revision")}</dt>
          <dd>
            <a href={repository.commitUrl}>
              <code>{repository.representedCommit}</code>
            </a>
          </dd>
        </div>
        <div>
          <dt>{t("intelligence.repository.observed")}</dt>
          <dd>
            <time dateTime={repository.observedAt}>{repository.observedAt}</time>
          </dd>
        </div>
        <div>
          <dt>{t("intelligence.repository.snapshot")}</dt>
          <dd>
            <code>{repository.snapshotId}</code>
          </dd>
        </div>
        <div>
          <dt>{t("intelligence.repository.digest")}</dt>
          <dd>
            <code>{repository.snapshotDigest}</code>
          </dd>
        </div>
      </dl>
      <h4>{t("intelligence.coverage.heading")}</h4>
      <p className="oi-muted">{t("intelligence.coverage.description")}</p>
      <div className="oi-coverage-list">
        {repository.coverage.map((claim) => (
          <div className="oi-coverage-claim" key={claim.domain}>
            <h5>{label("domains", claim.domain)}</h5>
            <dl>
              <div>
                <dt>{t("intelligence.coverage.collection")}</dt>
                <dd>{label("collection", claim.collection)}</dd>
              </div>
              <div>
                <dt>{t("intelligence.item.freshness")}</dt>
                <dd>{label("freshness", claim.freshness)}</dd>
              </div>
              <div>
                <dt>{t("intelligence.coverage.reason")}</dt>
                <dd>{label("reasons", claim.reason)}</dd>
              </div>
              <div>
                <dt>{t("intelligence.repository.observed")}</dt>
                <dd>
                  {claim.observedAt ? (
                    <time dateTime={claim.observedAt}>{claim.observedAt}</time>
                  ) : (
                    t("intelligence.coverage.unobserved")
                  )}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
      <h4>{t("intelligence.now.repositoryHeading")}</h4>
      {repository.now.state === "unavailable" ? (
        <p className="oi-state-note">{t("intelligence.now.repositoryUnavailable")}</p>
      ) : (
        <div className="oi-now-grid">
          <section aria-label={t("intelligence.now.focus")}>
            <h5>{t("intelligence.now.focus")}</h5>
            <EvidenceItems items={repository.now.currentFocus} />
          </section>
          <section aria-label={t("intelligence.now.blockers")}>
            <h5>{t("intelligence.now.blockers")}</h5>
            <EvidenceItems items={repository.now.blockers} />
          </section>
          <section aria-label={t("intelligence.now.next")}>
            <h5>{t("intelligence.now.next")}</h5>
            <EvidenceItems items={repository.now.nextReady} />
          </section>
        </div>
      )}
    </div>
  );
}

function ReviewShortcuts({ search }: { readonly search: string }) {
  const { t } = useI18n();
  const views = intelligenceData.modules.flatMap((module) => {
    const endpoint = intelligenceData.endpoints?.[module.id];
    return endpoint?.source ? [{ module, state: endpoint.state, asOf: endpoint.source.asOf }] : [];
  });
  if (!views.length) return null;
  return (
    <nav className="oi-review-shortcuts" aria-label={t("intelligence.snapshot.reviewViews")}>
      {views.slice(0, 3).map(({ module, state, asOf }) => (
        <Link key={module.id} to={{ pathname: module.path, search }}>
          <strong>
            {module.title} <span aria-hidden="true">↗</span>
          </strong>
          <span>{t(`intelligence.viewStates.${state}`)}</span>
          <span>
            {t("intelligence.modules.sourceAsOf")} <time dateTime={asOf}>{asOf}</time>
          </span>
        </Link>
      ))}
    </nav>
  );
}

/** The SSR page and first hydration use the same admitted build-time snapshot. */
export function IntelligencePage() {
  const { t, formatNumber } = useI18n();
  const location = useLocation();
  const [browserParams, setSearchParams] = useSearchParams();
  const browserReady = useBrowserSnapshot();
  const params = browserReady ? browserParams : new URLSearchParams();
  const query = (params.get("q") ?? "").slice(0, 160);
  const requestedEvidence = params.get("evidence") ?? "all";
  const evidence = evidenceStates.includes(requestedEvidence as EvidenceState)
    ? requestedEvidence
    : "all";
  const requestedRepository = params.get("repository") ?? "";
  const selected = intelligenceData.repositories.some(
    (repository) => repository.name === requestedRepository,
  )
    ? requestedRepository
    : "";
  const normalizedQuery = query.trim().normalize("NFKC").toLowerCase();
  const repositories = intelligenceData.repositories.filter(
    (repository) =>
      (!normalizedQuery ||
        `${repository.name} ${repository.title}`
          .normalize("NFKC")
          .toLowerCase()
          .includes(normalizedQuery)) &&
      (evidence === "all" || repository.evidenceState === evidence),
  );
  const hasSnapshot =
    Boolean(intelligenceData.snapshotId) &&
    ["available", "stale", "partial"].includes(intelligenceData.state);
  const nowRepositories = intelligenceData.repositories.filter(
    (repository) => repository.now.state === "available",
  );
  const lanes = [
    { key: "currentFocus", label: "focus" },
    { key: "blockers", label: "blockers" },
    { key: "nextReady", label: "next" },
  ] as const;

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  function resetFilters() {
    const next = new URLSearchParams(params);
    next.delete("q");
    next.delete("evidence");
    setSearchParams(next, { replace: true, preventScrollReset: true });
  }

  function evidenceDestination(repository: IntelligenceRepository) {
    const next = new URLSearchParams(params);
    next.set("repository", repository.name);
    return {
      pathname: location.pathname,
      search: next.toString(),
      hash: `#${repositoryAnchor(repository.name)}`,
    };
  }

  return (
    <article className="oi-page oi-overview">
      <PageMetadata title={t("intelligence.title")} description={t("intelligence.description")} />
      <header className="oi-intro">
        <p className="site-eyebrow">{t("intelligence.kicker")}</p>
        <h1>{t("intelligence.title")}</h1>
        <p className="oi-lede">{t("intelligence.description")}</p>
      </header>

      <nav className="oi-section-nav" aria-label={t("intelligence.navigation.label")}>
        <a href="#intelligence-now">{t("intelligence.navigation.now")}</a>
        <a href="#intelligence-repositories">{t("intelligence.navigation.repositories")}</a>
        <a href="#intelligence-modules">{t("intelligence.navigation.modules")}</a>
        <a href="#intelligence-map">{t("intelligence.navigation.map")}</a>
        <a href="#intelligence-provenance">{t("intelligence.navigation.provenance")}</a>
      </nav>

      <section
        id="module-intelligence"
        className="oi-state-panel oi-snapshot-compact"
        aria-labelledby="intelligence-snapshot-state"
        data-state={intelligenceData.state}
      >
        <div className="oi-section-heading">
          <h2 id="intelligence-snapshot-state">{t("intelligence.snapshot.heading")}</h2>
          <span className="oi-badge">{t(`intelligence.states.${intelligenceData.state}`)}</span>
        </div>
        <p className="oi-muted">{t(`intelligence.messages.${intelligenceData.code}`)}</p>
        {hasSnapshot ? (
          <dl className="oi-summary">
            <div>
              <dt>{t("intelligence.snapshot.repositories")}</dt>
              <dd>{formatNumber(intelligenceData.repositories.length)}</dd>
            </div>
            {intelligenceData.asOf ? (
              <div>
                <dt>{t("intelligence.snapshot.asOf")}</dt>
                <dd>
                  <time dateTime={intelligenceData.asOf}>{intelligenceData.asOf}</time>
                </dd>
              </div>
            ) : null}
          </dl>
        ) : (
          <p className="oi-muted">{t("intelligence.snapshot.noCount")}</p>
        )}
        <ReviewShortcuts search={params.toString()} />
      </section>

      <section
        className={`oi-section${nowRepositories.length ? "" : " oi-section-empty"}`}
        id="intelligence-now"
        aria-labelledby="intelligence-now-heading"
      >
        <header className="oi-section-heading">
          <div>
            {nowRepositories.length ? (
              <p className="site-eyebrow">{t("intelligence.now.kicker")}</p>
            ) : null}
            <h2 id="intelligence-now-heading">{t("intelligence.now.heading")}</h2>
          </div>
          {nowRepositories.length ? (
            <p className="oi-muted">{t("intelligence.now.description")}</p>
          ) : null}
        </header>
        {nowRepositories.length ? (
          <div className="oi-now-grid">
            {lanes.map((lane) => {
              const items = nowRepositories.flatMap((repository) =>
                repository.now[lane.key].map((item) => ({ repository, item })),
              );
              return (
                <section
                  className="oi-panel"
                  key={lane.key}
                  aria-label={t(`intelligence.now.${lane.label}`)}
                >
                  <h3>{t(`intelligence.now.${lane.label}`)}</h3>
                  {items.length ? (
                    <ul className="oi-now-items">
                      {items.slice(0, 3).map(({ repository, item }) => (
                        <li key={`${repository.name}:${item.id}`}>
                          <p className="oi-item-source">
                            {repositoryIntelligenceHref(repository) ? (
                              <a href={repositoryIntelligenceHref(repository)!}>
                                {repository.name}
                              </a>
                            ) : (
                              repository.name
                            )}
                          </p>
                          {repositoryIntelligenceHref(repository, "now", item.id) ? (
                            <a href={repositoryIntelligenceHref(repository, "now", item.id)!}>
                              <bdi dir="auto">{item.title}</bdi>
                            </a>
                          ) : (
                            <bdi dir="auto">{item.title}</bdi>
                          )}
                          {item.url ? (
                            <p>
                              <a href={item.url}>{t("intelligence.publication.githubEvidence")}</a>
                            </p>
                          ) : null}
                          <p className="oi-item-caption">
                            <span>
                              {t("intelligence.item.state")}: <bdi dir="auto">{item.state}</bdi>
                            </span>
                            <span>
                              {t("intelligence.item.assertion")}:{" "}
                              <bdi dir="auto">{item.assertion}</bdi>
                            </span>
                            <span>
                              {t("intelligence.item.freshness")}:{" "}
                              <bdi dir="auto">{item.freshness}</bdi>
                            </span>
                          </p>
                          <Link to={evidenceDestination(repository)}>
                            {t("intelligence.repository.inspect")}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="oi-muted">{t("intelligence.now.emptyList")}</p>
                  )}
                  {items.length > 3 ? (
                    <p className="oi-muted">
                      {t("intelligence.now.bounded", { shown: 3, total: items.length })}
                    </p>
                  ) : null}
                </section>
              );
            })}
          </div>
        ) : (
          <p className="oi-state-note">{t("intelligence.now.unavailable")}</p>
        )}
      </section>

      <section
        className={`oi-section${hasSnapshot ? "" : " oi-section-empty"}`}
        id="intelligence-repositories"
        aria-labelledby="intelligence-repositories-heading"
      >
        <header className="oi-section-heading">
          <div>
            {hasSnapshot ? (
              <p className="site-eyebrow">{t("intelligence.directory.kicker")}</p>
            ) : null}
            <h2 id="intelligence-repositories-heading">{t("intelligence.directory.heading")}</h2>
          </div>
          {hasSnapshot ? (
            <p className="oi-muted">{t("intelligence.directory.description")}</p>
          ) : null}
        </header>
        {hasSnapshot ? (
          <>
            <search
              className="oi-directory-filters"
              aria-label={t("intelligence.directory.filterLabel")}
            >
              <label htmlFor="intelligence-query">
                <span>{t("intelligence.directory.search")}</span>
                <input
                  disabled={!browserReady}
                  id="intelligence-query"
                  maxLength={160}
                  onChange={(event) => updateFilter("q", event.target.value)}
                  type="search"
                  value={query}
                />
              </label>
              <label htmlFor="intelligence-evidence">
                <span>{t("intelligence.directory.evidence")}</span>
                <select
                  disabled={!browserReady}
                  id="intelligence-evidence"
                  onChange={(event) => updateFilter("evidence", event.target.value)}
                  value={evidence}
                >
                  <option value="all">{t("intelligence.evidence.all")}</option>
                  {evidenceStates.map((state) => (
                    <option key={state} value={state}>
                      {t(`intelligence.evidence.${state}`)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                disabled={!browserReady || (!query && evidence === "all")}
                onClick={resetFilters}
                type="button"
              >
                {t("intelligence.directory.clear")}
              </button>
            </search>
            <noscript>
              <p className="oi-state-note">{t("intelligence.directory.noScript")}</p>
            </noscript>
            <p className="oi-results" role="status" aria-live="polite">
              {t("intelligence.directory.results", {
                shown: repositories.length,
                total: intelligenceData.repositories.length,
              })}
            </p>
            <div className="oi-repositories">
              {repositories.map((repository) => (
                <article
                  className="oi-repository"
                  data-selected={selected === repository.name}
                  key={repository.name}
                >
                  <header className="oi-section-heading">
                    <div>
                      <h3>
                        {repositoryIntelligenceHref(repository) ? (
                          <a href={repositoryIntelligenceHref(repository)!}>
                            <bdi dir="auto">{repository.title}</bdi>
                          </a>
                        ) : (
                          <bdi dir="auto">{repository.title}</bdi>
                        )}
                      </h3>
                      {repository.title !== repository.name ? (
                        <p className="oi-muted">
                          <code>{repository.name}</code>
                        </p>
                      ) : null}
                    </div>
                    <span className="oi-badge" data-evidence={repository.evidenceState}>
                      {t(`intelligence.evidence.${repository.evidenceState}`)}
                    </span>
                  </header>
                  <RepositoryPublicationLinks repository={repository} />
                  <p className="oi-repository-source">
                    <span>
                      {t("intelligence.repository.revision")}:{" "}
                      <a href={repository.commitUrl}>
                        <code>{repository.representedCommit.slice(0, 12)}</code>
                      </a>
                    </span>
                    <span>
                      {t("intelligence.repository.observed")}:{" "}
                      <time dateTime={repository.observedAt}>{repository.observedAt}</time>
                    </span>
                  </p>
                  <Link className="oi-inspect-link" to={evidenceDestination(repository)}>
                    {t("intelligence.repository.inspect")}
                  </Link>
                  <details
                    className="oi-evidence"
                    id={repositoryAnchor(repository.name)}
                    open={selected === repository.name}
                  >
                    <summary>{t("intelligence.repository.details")}</summary>
                    <RepositoryEvidence repository={repository} />
                  </details>
                </article>
              ))}
            </div>
            {!repositories.length ? (
              <p className="oi-state-note">{t("intelligence.directory.noResults")}</p>
            ) : null}
          </>
        ) : (
          <p className="oi-state-note">
            {t("intelligence.directory.unavailable")}{" "}
            <a href="https://github.com/egohygiene/.github/issues/42">
              {t("intelligence.directory.coverageOwner")}
            </a>
          </p>
        )}
      </section>

      <IntelligenceViews search={params.toString()} />

      <IntelligenceHub />

      <section
        className="oi-section"
        id="intelligence-provenance"
        aria-labelledby="intelligence-provenance-heading"
      >
        <h2 id="intelligence-provenance-heading">{t("intelligence.provenance.heading")}</h2>
        <p className="oi-muted">{t("intelligence.provenance.description")}</p>
        <details className="oi-evidence">
          <summary>{t("intelligence.provenance.details")}</summary>
          <p className="oi-muted">{t("intelligence.authority")}</p>
          <dl className="oi-provenance-list">
            {intelligenceData.observationWindow ? (
              <div>
                <dt>{t("intelligence.snapshot.window")}</dt>
                <dd>
                  <time dateTime={intelligenceData.observationWindow.earliest}>
                    {intelligenceData.observationWindow.earliest}
                  </time>
                  {" — "}
                  <time dateTime={intelligenceData.observationWindow.latest}>
                    {intelligenceData.observationWindow.latest}
                  </time>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>{t("intelligence.provenance.contract")}</dt>
              <dd>
                <code>{intelligenceData.provenance.schema}</code>
                <br />
                {intelligenceData.provenance.contractVersion}
              </dd>
            </div>
            {intelligenceData.snapshotId ? (
              <div>
                <dt>{t("intelligence.provenance.presentationIdentity")}</dt>
                <dd>
                  <code>{intelligenceData.snapshotId}</code>
                </dd>
              </div>
            ) : null}
            {intelligenceData.artifactSha256 ? (
              <div>
                <dt>{t("intelligence.provenance.artifact")}</dt>
                <dd>
                  <code>{intelligenceData.artifactSha256}</code>
                </dd>
              </div>
            ) : null}
            <div>
              <dt>{t("intelligence.provenance.normalizer")}</dt>
              <dd>
                <a
                  href={`https://github.com/egohygiene/observatory/tree/${intelligenceData.provenance.observatoryRevision}`}
                >
                  <code>{intelligenceData.provenance.observatoryRevision}</code>
                </a>
              </dd>
            </div>
            <div>
              <dt>{t("intelligence.provenance.schemaDigest")}</dt>
              <dd>
                <code>{intelligenceData.provenance.schemaSha256}</code>
              </dd>
            </div>
            <div>
              <dt>{t("intelligence.provenance.registry")}</dt>
              <dd>
                <a href={intelligenceData.provenance.registryUrl}>
                  <code>{intelligenceData.provenance.registryRevision}</code>
                </a>
              </dd>
            </div>
            <div>
              <dt>{t("intelligence.provenance.registryDigest")}</dt>
              <dd>
                <code>{intelligenceData.provenance.registrySha256}</code>
              </dd>
            </div>
          </dl>
        </details>
        <p>
          <a href="https://github.com/egohygiene/egohygiene.io/issues/27">
            {t("intelligence.provenance.hostOwner")}
          </a>
        </p>
      </section>
    </article>
  );
}
