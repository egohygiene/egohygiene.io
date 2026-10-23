import { Navigate, useLocation } from "react-router-dom";

import { useBrowserSnapshot } from "../../hooks/useBrowserSnapshot";
import { StorefrontPage } from "./StorefrontPages";

/** Preserve shared links to the earlier uncurated preview without changing product URLs. */
export function StoreEntryPage() {
  const { search, hash } = useLocation();
  const browserReady = useBrowserSnapshot();
  const query = new URLSearchParams(search);
  const isCatalogLink =
    ["q", "view", "story"].some((key) => query.has(key)) ||
    ["#catalog", "#worlds", "#store-story"].includes(hash);
  if (browserReady && isCatalogLink) {
    return <Navigate replace to={`/store/catalog${search}${hash}`} />;
  }
  return <StorefrontPage />;
}
