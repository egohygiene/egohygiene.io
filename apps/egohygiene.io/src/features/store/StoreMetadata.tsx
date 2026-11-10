import { useI18n } from "@egohygiene/i18n";

import { PageMetadata } from "../../components/PageMetadata/PageMetadata";

export function StoreMetadata({
  title,
  description,
}: {
  readonly title: string;
  readonly description: string;
}) {
  const { t } = useI18n();
  const formattedTitle = t("storeCards.metadataTitle", { title });
  return <PageMetadata title={formattedTitle} description={description} />;
}
