import { useI18n } from "@egohygiene/i18n";

import { storeCatalog } from "../../content/store";
import { LocaleLink as Link } from "../../i18n/LocaleLink";
import { StoreArtistPage } from "../store/StoreArtistPage";
import { createArtistPreview } from "./fixture";

const preview = createArtistPreview(storeCatalog);

/** Lazy-loaded only in the isolated local preview build. */
export function ArtistPreviewPage() {
  const { t } = useI18n();
  return (
    <>
      <aside className="store-shell store-preview-note" aria-labelledby="artist-preview-heading">
        <div>
          <h2 id="artist-preview-heading">{t("storeArtist.preview.title")}</h2>
          <p>{t("storeArtist.preview.description")}</p>
        </div>
        <Link className="store-text-link" to="/store/incompris">
          {t("storeArtist.preview.back")}
        </Link>
      </aside>
      <StoreArtistPage catalog={preview.catalog} curation={preview.curation} />
    </>
  );
}
