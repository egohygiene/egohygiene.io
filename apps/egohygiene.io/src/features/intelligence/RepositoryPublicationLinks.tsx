import { useI18n } from "@egohygiene/i18n";
import { repositoryIntelligenceHref } from "./publication";
import type { IntelligenceRepository } from "./types";

const surfaces = ["now", "roadmap", "decisions", "journey", "dependencies", "health", "releases", "work", "search", "compare", "dashboard"] as const;

/** Publication links belong to the consumer; source evidence remains secondary. */
export function RepositoryPublicationLinks({ repository }: { readonly repository: IntelligenceRepository }) {
  const { t } = useI18n();
  const publication = repository.publication;
  const root = repositoryIntelligenceHref(repository);
  return <section className="oi-publication-links" aria-label={t("intelligence.publication.label")}>
    {root ? <a className="oi-publication-primary" href={root}>{t("intelligence.publication.open")}</a>
      : <p className="oi-muted">{t("intelligence.publication.unavailable")}</p>}
    {root ? <nav className="oi-publication-routes" aria-label={t("intelligence.publication.routes")}>
      {surfaces.flatMap((surface) => {
        const href = repositoryIntelligenceHref(repository, surface);
        return href ? [<a key={surface} href={href}>{t(`intelligence.publication.surfaces.${surface}`)}</a>] : [];
      })}
    </nav> : null}
    <p className="oi-muted"><a href={repository.sourceUrl}>{t("intelligence.publication.github")}</a></p>
    {publication?.state === "available" ? <details className="oi-evidence">
      <summary>{t("intelligence.publication.provenance")}</summary>
      <p>{t("intelligence.publication.consumerOwned")}</p>
      {!publication.sourceMatchesSnapshot ? <p className="oi-state-note">{t("intelligence.publication.differentRevision")}</p> : null}
      <dl className="oi-provenance-list">
        <div><dt>{t("intelligence.publication.sourceCommit")}</dt><dd><code>{publication.sourceCommit}</code></dd></div>
        <div><dt>{t("intelligence.publication.observedAt")}</dt><dd><time dateTime={publication.observedAt ?? undefined}>{publication.observedAt}</time></dd></div>
        <div><dt>{t("intelligence.publication.generator")}</dt><dd><a href={`https://github.com/egohygiene/relay/tree/${publication.generatorCommit}`}><code>{publication.generatorCommit}</code></a></dd></div>
      </dl>
      <p>{publication.configurationUrl ? <a href={publication.configurationUrl}>{t("intelligence.publication.configuration")}</a> : null}{" · "}{publication.evidenceUrl ? <a href={publication.evidenceUrl}>{t("intelligence.publication.evidence")}</a> : null}{publication.cnameUrl ? <> · <a href={publication.cnameUrl}>{t("intelligence.publication.cname")}</a></> : null}</p>
    </details> : null}
  </section>;
}
