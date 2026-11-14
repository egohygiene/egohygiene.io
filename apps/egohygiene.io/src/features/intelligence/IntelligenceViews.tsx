import { useI18n } from "@egohygiene/i18n";
import { Link } from "react-router-dom";

import { intelligenceData } from "./data";
import type { IntelligenceModule } from "./types";

const groups = [
  { id: "work", modules: ["now", "roadmap", "work", "journey"] },
  {
    id: "governance",
    modules: ["sanity", "audits", "hygiene", "decisions", "identity_intelligence"],
  },
  { id: "operations", modules: ["health", "status", "dependencies", "releases", "distribution"] },
  { id: "exploration", modules: ["search", "compare", "diagnostics", "dashboard"] },
] as const;

/** Presentation grouping never drops a future registered module. */
export function IntelligenceViews({ search }: { readonly search: string }) {
  const { t } = useI18n();
  const modules = intelligenceData.modules.filter((module) => module.id !== "intelligence");
  const known = new Set<string>(groups.flatMap((group) => [...group.modules]));
  const additional = modules.filter((module) => !known.has(module.id));
  const sections: { id: string; modules: readonly IntelligenceModule[] }[] = groups.map(
    (group) => ({
      id: group.id,
      modules: group.modules.flatMap((id) => modules.filter((module) => module.id === id)),
    }),
  );
  if (additional.length) sections.push({ id: "additional", modules: additional });

  return (
    <section
      className="oi-section"
      id="intelligence-modules"
      aria-labelledby="intelligence-modules-heading"
    >
      <header className="oi-section-heading">
        <div>
          <p className="site-eyebrow">{t("intelligence.modules.kicker")}</p>
          <h2 id="intelligence-modules-heading">{t("intelligence.modules.heading")}</h2>
        </div>
        <p className="oi-muted">{t("intelligence.modules.description")}</p>
      </header>
      <div className="oi-view-groups">
        {sections
          .filter((section) => section.modules.length)
          .map((section) => (
            <section
              className="oi-view-group"
              key={section.id}
              aria-labelledby={`views-${section.id}`}
            >
              <header>
                <h3 id={`views-${section.id}`}>
                  {t(`intelligence.viewGroups.${section.id}.title`)}
                </h3>
                <p className="oi-muted">{t(`intelligence.viewGroups.${section.id}.description`)}</p>
              </header>
              <ul className="oi-view-list">
                {section.modules.map((module) => {
                  const state = intelligenceData.endpoints?.[module.id]?.state ?? "unavailable";
                  return (
                    <li id={`module-${module.id}`} key={module.id}>
                      {module.implemented ? (
                        <Link to={{ pathname: module.path, search }}>{module.title}</Link>
                      ) : (
                        <a href={module.issueUrl}>{module.title}</a>
                      )}
                      <span className="oi-view-state" data-state={state}>
                        {t(`intelligence.viewStates.${state}`)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <details className="oi-view-scope">
                <summary>{t("intelligence.modules.scope")}</summary>
                <dl>
                  {section.modules.map((module) => {
                    const source = intelligenceData.endpoints?.[module.id]?.source;
                    return (
                      <div key={module.id}>
                        <dt>{module.title}</dt>
                        <dd>
                          <p>{module.description}</p>
                          <p>
                            <code>{module.path}</code>
                          </p>
                          {source ? (
                            <p className="oi-muted">
                              {t("intelligence.modules.evaluated")}{" "}
                              <time dateTime={source.asOf}>{source.asOf}</time>
                            </p>
                          ) : null}
                          <a href={module.issueUrl}>{t("intelligence.modules.ownerLink")}</a>
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </details>
            </section>
          ))}
      </div>
    </section>
  );
}
