import { parseStoreCatalog, toPublicStoreCatalog } from "@egohygiene/schemas";

import checkoutRoutes from "./checkout-routes.json";

// Vite discovers new files automatically; no hand-maintained import list.
const modules = import.meta.glob<unknown>("./entries/**/*.json", {
  eager: true,
  import: "default",
});

export const storeCatalog = toPublicStoreCatalog(parseStoreCatalog(
  Object.entries(modules)
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([source, value]) => ({ source, value })),
  checkoutRoutes,
));
