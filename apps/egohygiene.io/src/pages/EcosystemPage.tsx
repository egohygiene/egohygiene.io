import { useI18n } from "@egohygiene/i18n";
import { Card, Cluster, StatusBadge } from "@egohygiene/ui";
import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { products } from "../content/products";
import { LocaleLink } from "../i18n/LocaleLink";

export function EcosystemPage() {
  const { t } = useI18n();
  return (
    <article className="site-stack">
      <PageMetadata
        title={t("pages.ecosystemTitle")}
        description={t("pages.ecosystem.description")}
      />
      <header className="site-prose">
        <h1>{t("pages.ecosystemTitle")}</h1>
        <p>{t("pages.ecosystem.intro")}</p>
      </header>
      <div className="site-grid">
        {products.map((product) => (
          <Card key={product.identifier}>
            <Cluster className="site-card-header">
              <h2>
                <LocaleLink to={product.path}>{product.name}</LocaleLink>
              </h2>
              <StatusBadge tone={product.status}>
                {t(`pages.ecosystem.status.${product.status}`)}
              </StatusBadge>
            </Cluster>
            <p>{product.description}</p>
            <dl>
              <div>
                <dt>{t("pages.ecosystem.category")}</dt>
                <dd>{t(`pages.ecosystem.categories.${product.category}`)}</dd>
              </div>
              <div>
                <dt>{t("pages.ecosystem.path")}</dt>
                <dd>{product.path}</dd>
              </div>
            </dl>
            {product.repositoryUrl ? (
              <p>
                <a href={product.repositoryUrl}>
                  {t("pages.ecosystem.repository", { name: product.name })}
                </a>
              </p>
            ) : null}
          </Card>
        ))}
      </div>
    </article>
  );
}
