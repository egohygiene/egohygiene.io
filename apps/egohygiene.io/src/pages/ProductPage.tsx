import { useI18n } from "@egohygiene/i18n";
import { Card, StatusBadge } from "@egohygiene/ui";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { PageMetadata } from "../components/PageMetadata/PageMetadata";
import { products } from "../content/products";
import { LocaleLink as Link } from "../i18n/LocaleLink";
import { NotFoundPage } from "./NotFoundPage";

export function ProductPage() {
  const { t } = useI18n();
  const location = useLocation();
  const product = useMemo(
    () => products.find((item) => item.path === location.pathname),
    [location.pathname],
  );

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <Card>
      <PageMetadata
        title={t("pages.product.title", { name: product.name })}
        description={product.description}
      />
      <h1>{product.name}</h1>
      <StatusBadge tone={product.status}>
        {t(`pages.ecosystem.status.${product.status}`)}
      </StatusBadge>
      <p>{product.description}</p>
      <p>{t("pages.product.reserved")}</p>
      <p>
        <Link to="/ecosystem">{t("pages.product.back")}</Link>
      </p>
    </Card>
  );
}
