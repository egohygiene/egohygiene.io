import { useI18n } from "@egohygiene/i18n";
import type { StoreDesign } from "@egohygiene/schemas";
import { useState } from "react";
import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { landingSelection } from "../content/landing";
import { storeCatalog } from "../content/store";
import { storeEntryPath } from "../features/store/domain";
import { LocaleLink as Link } from "../i18n/LocaleLink";

import "../styles/landing.css";

const pillars = ["awareness", "empathy", "growth", "balance"] as const;

function Arrow() {
  return (
    <span aria-hidden="true" className="landing-arrow">
      ↗
    </span>
  );
}

/** The home feature consumes the same reviewed public design as the store. */
function FeaturedDesign() {
  const { t } = useI18n();
  const [failedSource, setFailedSource] = useState<string>();
  const design = storeCatalog.entries.find(
    (entry): entry is StoreDesign =>
      entry.kind === "design" &&
      entry.visibility === "public" &&
      entry.id === landingSelection.featuredDesignId,
  );
  const artwork = design?.artwork;
  const image = artwork?.kind === "image" ? artwork : undefined;

  if (!design || !image || image.src === failedSource) {
    return (
      <div className="landing-design landing-design--empty">
        <p>{t("landing.designUnavailable")}</p>
        <Link className="landing-text-link" to="/store">
          {t("landing.storeAction")} <Arrow />
        </Link>
      </div>
    );
  }

  return (
    <div className="landing-design">
      <Link
        aria-label={t("landing.designActionLabel", { title: design.title })}
        to={storeEntryPath(design)}
      >
        <figure>
          <div className="landing-design__image">
            <img
              alt={image.alt}
              decoding="async"
              loading="lazy"
              onError={() => setFailedSource(image.src)}
              src={image.src}
            />
          </div>
          <figcaption>
            <span>
              <span className="landing-kicker">{t("landing.designLabel")}</span>
              <strong>{design.title}</strong>
            </span>
            <Arrow />
          </figcaption>
        </figure>
      </Link>
      <p className="landing-design__note">{t("landing.designNote")}</p>
    </div>
  );
}

export function HomePage() {
  const { t, formatNumber } = useI18n();
  const title = t("landing.title");
  const description = t("landing.description");

  return (
    <div className="landing-page">
      <PageMetadata title={title} description={description} />
      <section aria-labelledby="landing-heading" className="landing-hero">
        <div className="landing-hero__copy">
          <p className="landing-kicker">{t("landing.eyebrow")}</p>
          <h1 id="landing-heading">{t("landing.heading")}</h1>
          <p className="landing-intro">{t("landing.intro")}</p>
          <div className="landing-actions">
            <Link className="landing-button" to="/about">
              {t("landing.aboutAction")} <Arrow />
            </Link>
            <Link className="landing-text-link" to="/store">
              {t("landing.storeAction")} <Arrow />
            </Link>
          </div>
          <p className="landing-progress">
            <span aria-hidden="true" />
            {t("landing.progress")}
          </p>
        </div>
        <figure className="landing-identity">
          <div aria-hidden="true" className="landing-identity__orbit" />
          <span className="landing-identity__label">{t("landing.identityLabel")}</span>
          <img
            alt={t("landing.identityAlt")}
            src="/icons/icon-512x512.png"
            width="512"
            height="512"
            fetchPriority="high"
          />
          <figcaption>{t("landing.identityCaption")}</figcaption>
        </figure>
      </section>

      <section aria-labelledby="landing-philosophy" className="landing-philosophy">
        <div className="landing-section-heading">
          <div>
            <p className="landing-kicker">{t("landing.philosophyEyebrow")}</p>
            <h2 id="landing-philosophy">{t("landing.philosophyHeading")}</h2>
          </div>
          <p>{t("landing.philosophyIntro")}</p>
        </div>
        <ol className="landing-pillars">
          {pillars.map((pillar, index) => (
            <li key={pillar}>
              <span aria-hidden="true" className="landing-pillar-number">
                {formatNumber(index + 1)}
              </span>
              <h3>{t(`landing.pillars.${pillar}.title`)}</h3>
              <p>{t(`landing.pillars.${pillar}.description`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="landing-store" className="landing-store">
        <div className="landing-store__copy">
          <p className="landing-kicker">{t("landing.storeEyebrow")}</p>
          <h2 id="landing-store">{t("landing.storeHeading")}</h2>
          <p>{t("landing.storeIntro")}</p>
          <Link className="landing-button landing-button--light" to="/store">
            {t("landing.storeAction")} <Arrow />
          </Link>
          <p className="landing-store__note">{t("landing.storeNote")}</p>
        </div>
        <FeaturedDesign />
      </section>

      <div className="landing-explore">
        <section aria-labelledby="landing-artist" className="landing-artist">
          <p className="landing-kicker">{t("landing.artistEyebrow")}</p>
          <h2 id="landing-artist">
            <bdi dir="ltr">.play()</bdi>
          </h2>
          <p>{t("landing.artistDescription")}</p>
          <span className="landing-status">{t("landing.artistStatus")}</span>
        </section>
        <section aria-labelledby="landing-ecosystem" className="landing-ecosystem">
          <p className="landing-kicker">{t("landing.ecosystemEyebrow")}</p>
          <h2 id="landing-ecosystem">{t("landing.ecosystemHeading")}</h2>
          <p>{t("landing.ecosystemDescription")}</p>
          <Link className="landing-text-link" to="/ecosystem">
            {t("landing.ecosystemAction")} <Arrow />
          </Link>
        </section>
      </div>

      <section className="landing-signoff">
        <h2>{t("landing.closing")}</h2>
        <Link className="landing-text-link" to="/about">
          {t("landing.closingAction")} <Arrow />
        </Link>
      </section>
    </div>
  );
}
