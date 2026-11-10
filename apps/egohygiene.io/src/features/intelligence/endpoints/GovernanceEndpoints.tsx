import { useI18n } from "@egohygiene/i18n";
import { useSearchParams } from "react-router-dom";

import { useBrowserSnapshot } from "../../../hooks/useBrowserSnapshot";
import { LocaleLink as Link } from "../../../i18n/LocaleLink";
import { intelligenceData } from "../data";
import type { IntelligenceRepository } from "../types";
import { EndpointFrame } from "./EndpointFrame";
import { endpointData } from "./data";

import "../intelligence.css";
import "./governance-endpoints.css";

type GovernanceId =
  | "status"
  | "sanity"
  | "hygiene"
  | "audits"
  | "identity_intelligence"
  | "diagnostics";

interface SourceLink {
  readonly key: string;
  readonly url: string;
}

interface GovernanceDefinition {
  readonly domains: readonly string[];
  readonly requirements: readonly string[];
  readonly sources: readonly SourceLink[];
  readonly related: readonly string[];
}

const definitions: Readonly<Record<GovernanceId, GovernanceDefinition>> = {
  status: {
    domains: ["checks", "deployments"],
    requirements: ["scope", "observations", "incidents", "freshness"],
    sources: [
      { key: "hygiene", url: "https://github.com/egohygiene/hygiene/issues/62" },
      { key: "observatory", url: "https://github.com/egohygiene/observatory/issues/23" },
      { key: "relay", url: "https://github.com/egohygiene/relay/issues/41" },
    ],
    related: ["health", "releases", "work"],
  },
  sanity: {
    domains: ["decisions", "roadmap"],
    requirements: ["scope", "assessment", "ratification", "changes"],
    sources: [
      { key: "hygiene", url: "https://github.com/egohygiene/hygiene/issues/59" },
      { key: "aether", url: "https://github.com/egohygiene/aether/issues/87" },
      { key: "observatory", url: "https://github.com/egohygiene/observatory/issues/21" },
    ],
    related: ["decisions", "dependencies", "roadmap"],
  },
  hygiene: {
    domains: ["checks", "decisions"],
    requirements: ["applicability", "versions", "evidence", "disposition"],
    sources: [
      { key: "hygiene", url: "https://github.com/egohygiene/hygiene" },
      { key: "observatory", url: "https://github.com/egohygiene/observatory/issues/5" },
      { key: "relay", url: "https://github.com/egohygiene/relay/issues/75" },
    ],
    related: ["health", "decisions", "identity_intelligence"],
  },
  audits: {
    domains: ["issues", "pull_requests", "checks"],
    requirements: ["report", "scope", "findings", "disposition"],
    sources: [
      { key: "aether", url: "https://github.com/egohygiene/aether/issues/86" },
      { key: "observatory", url: "https://github.com/egohygiene/observatory/issues/20" },
      { key: "reflector", url: "https://github.com/egohygiene/reflector/issues/258" },
    ],
    related: ["health", "work", "diagnostics"],
  },
  identity_intelligence: {
    domains: ["releases", "checks"],
    requirements: ["applicability", "package", "assets", "freshness"],
    sources: [
      { key: "identity", url: "https://github.com/egohygiene/identity" },
      { key: "hygiene", url: "https://github.com/egohygiene/hygiene" },
      { key: "observatory", url: "https://github.com/egohygiene/observatory/issues/5" },
    ],
    related: ["hygiene", "releases", "distribution"],
  },
  diagnostics: {
    domains: ["issues", "history", "checks"],
    requirements: ["record", "states", "evidence", "privacy"],
    sources: [
      { key: "aether", url: "https://github.com/egohygiene/aether/issues/74" },
      { key: "hygiene", url: "https://github.com/egohygiene/hygiene/issues/41" },
      { key: "egolint", url: "https://github.com/egohygiene/egolint/issues/50" },
      { key: "observatory", url: "https://github.com/egohygiene/observatory/issues/16" },
    ],
    related: ["work", "journey", "health"],
  },
};

function RepositoryContext({
  repository,
  domains,
}: {
  readonly repository: IntelligenceRepository;
  readonly domains: readonly string[];
}) {
  const { t } = useI18n();
  const claims = repository.coverage.filter((claim) => domains.includes(claim.domain));
  const label = (group: string, value: string) => {
    const key = `intelligence.${group}.${value}`;
    const translated = t(key);
    return translated === key ? value.replaceAll("_", " ") : translated;
  };
  return (
    <article
      className="oi-panel oi-governance-repository"
      id={`context-${repository.name.replaceAll("/", "--")}`}
    >
      <header className="oi-section-heading">
        <h3>
          <a href={repository.sourceUrl}>
            <bdi dir="auto">{repository.name}</bdi>
          </a>
        </h3>
        <span className="oi-badge" data-evidence={repository.evidenceState}>
          {label("evidence", repository.evidenceState)}
        </span>
      </header>
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
      </dl>
      <details className="oi-evidence">
        <summary>{t("intelligenceGovernance.common.contextDetails")}</summary>
        <p className="oi-muted">{t("intelligenceGovernance.common.contextBoundary")}</p>
        {claims.length ? (
          <ul className="oi-governance-claims">
            {claims.map((claim) => (
              <li key={claim.domain}>
                <h4>{label("domains", claim.domain)}</h4>
                <dl className="oi-item-states">
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
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("intelligenceGovernance.common.noClaims")}</p>
        )}
        <dl className="oi-provenance-list">
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
      </details>
    </article>
  );
}

function GovernanceEndpoint({ id }: { readonly id: GovernanceId }) {
  const { t } = useI18n();
  const definition = definitions[id];
  const ready = useBrowserSnapshot();
  const [browserParams, setParams] = useSearchParams();
  const params = ready ? browserParams : new URLSearchParams();
  const requestedRepository = params.get("repository") ?? "";
  const repository = intelligenceData.repositories.some((item) => item.name === requestedRepository)
    ? requestedRepository
    : "";
  const repositories = intelligenceData.repositories.filter(
    (item) => !repository || item.name === repository,
  );
  const namespace = `intelligenceGovernance.${id}`;
  const related = definition.related.flatMap((key) => {
    const module = intelligenceData.modules.find((item) => item.id === key && item.implemented);
    return module ? [module] : [];
  });
  const hasSnapshot = ["available", "stale", "partial"].includes(intelligenceData.state);

  const selectRepository = (value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set("repository", value);
    else next.delete("repository");
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <EndpointFrame id={id} question={t(`${namespace}.question`)}>
      <section
        className="oi-state-panel oi-governance-boundary"
        aria-labelledby={`${id}-source-state`}
      >
        <h2 id={`${id}-source-state`}>{t(`${namespace}.state`)}</h2>
        <p>{t(`${namespace}.missing`)}</p>
        <p className="oi-muted">{t(`${namespace}.independence`)}</p>
      </section>

      <div className="oi-governance-columns">
        <section className="oi-panel" aria-labelledby={`${id}-next-source`}>
          <h2 id={`${id}-next-source`}>{t("intelligenceGovernance.common.nextSource")}</h2>
          <p>{t(`${namespace}.next`)}</p>
          <ul className="oi-governance-requirements">
            {definition.requirements.map((key) => (
              <li key={key}>{t(`${namespace}.requirements.${key}`)}</li>
            ))}
          </ul>
        </section>
        <section className="oi-panel" aria-labelledby={`${id}-owners`}>
          <h2 id={`${id}-owners`}>{t("intelligenceGovernance.common.owners")}</h2>
          <p>{t(`${namespace}.ownership`)}</p>
          <ul className="oi-governance-sources">
            {definition.sources.map((source) => (
              <li key={source.key}>
                <a href={source.url}>{t(`${namespace}.sources.${source.key}`)}</a>
              </li>
            ))}
          </ul>
          {related.length ? (
            <nav
              className="oi-governance-related"
              aria-label={t("intelligenceGovernance.common.related")}
            >
              <h3>{t("intelligenceGovernance.common.related")}</h3>
              <ul>
                {related.map((module) => (
                  <li key={module.id}>
                    <Link to={{ pathname: module.path, search: params.toString() }}>
                      {module.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {id === "identity_intelligence" ? (
            <p>
              <a href="https://github.com/egohygiene/identity">{t(`${namespace}.productLink`)}</a>
            </p>
          ) : null}
        </section>
      </div>

      <section className="oi-section" aria-labelledby={`${id}-repository-context`}>
        <h2 id={`${id}-repository-context`}>{t("intelligenceGovernance.common.contextHeading")}</h2>
        <p>{t(`${namespace}.context`)}</p>
        <p className="oi-muted">{t("intelligenceGovernance.common.selectionBoundary")}</p>
        {hasSnapshot && intelligenceData.repositories.length ? (
          <>
            <search
              className="oi-directory-filters"
              aria-label={t("intelligenceGovernance.common.contextFilter")}
            >
              <label htmlFor={`${id}-repository`}>
                <span>{t("intelligenceGovernance.common.repository")}</span>
                <select
                  disabled={!ready}
                  id={`${id}-repository`}
                  value={repository}
                  onChange={(event) => selectRepository(event.target.value)}
                >
                  <option value="">{t("intelligenceGovernance.common.allRepositories")}</option>
                  {intelligenceData.repositories.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </search>
            <noscript>
              <p className="oi-muted">{t("intelligenceGovernance.common.noScript")}</p>
            </noscript>
            <div className="oi-governance-context">
              {repositories.map((item) => (
                <RepositoryContext repository={item} domains={definition.domains} key={item.name} />
              ))}
            </div>
          </>
        ) : (
          <p className="oi-state-note">{t("intelligenceGovernance.common.noContext")}</p>
        )}
      </section>

      <details className="oi-evidence oi-governance-contract">
        <summary>{t("intelligenceGovernance.common.contractDetails")}</summary>
        <p>{t(`${namespace}.contract`)}</p>
        <p>{t("intelligenceGovernance.common.contractBoundary")}</p>
        <dl className="oi-provenance-list">
          <div>
            <dt>{t("intelligence.provenance.contract")}</dt>
            <dd>
              <code>{intelligenceData.provenance.schema}</code> ·{" "}
              {intelligenceData.provenance.contractVersion}
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
        </dl>
      </details>
    </EndpointFrame>
  );
}

function ReviewEvidenceEndpoint({ id }: { readonly id: "audits" | "sanity" }) {
  const { t } = useI18n();
  const data = endpointData(id);
  if (!data.source && data.state !== "incompatible") return <GovernanceEndpoint id={id} />;
  return (
    <EndpointFrame id={id} question={t(`intelligenceGovernance.${id}.question`)}>
      <section className="oi-panel">
        <h2>{t(`intelligenceGovernance.${id}.connectedHeading`)}</h2>
        <p>{t(`intelligenceGovernance.${id}.connectedBoundary`)}</p>
        <p className="oi-muted">{t(`intelligenceGovernance.${id}.independence`)}</p>
      </section>
    </EndpointFrame>
  );
}

export function SanityEndpoint() {
  return <ReviewEvidenceEndpoint id="sanity" />;
}
export function HygieneEndpoint() {
  return <GovernanceEndpoint id="hygiene" />;
}
export function AuditsEndpoint() {
  return <ReviewEvidenceEndpoint id="audits" />;
}
export function StatusEndpoint() {
  return <GovernanceEndpoint id="status" />;
}
export function IdentityEndpoint() {
  return <GovernanceEndpoint id="identity_intelligence" />;
}
export function DiagnosticsEndpoint() {
  return <GovernanceEndpoint id="diagnostics" />;
}
