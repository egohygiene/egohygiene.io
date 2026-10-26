import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { parseStoreCatalog, toPublicStoreCatalog } from "../../packages/schemas/src/store.ts";
import { loadCatalog } from "../../scripts/store-catalog.mts";
import { createCheckoutHandoffFixture } from "../checkout-handoff/fixture.ts";
import { createCatalogLocalizationInputs } from "./inputs.ts";

export {
  CATALOG_LOCALIZATION_FIXTURE,
  createCatalogLocalizationCatalog,
  createCatalogLocalizationInputs,
} from "./inputs.ts";

/** Overlay only #37's newly owned temporary fixture, never the real catalog or public assets. */
export async function createCatalogLocalizationFixture() {
  const inputs = createCatalogLocalizationInputs();
  const rawCatalog = parseStoreCatalog(inputs.sources, inputs.routes);
  const fixture = await createCheckoutHandoffFixture();
  try {
    for (const { source, value } of inputs.sources) {
      await writeFile(join(fixture.directory, source), `${JSON.stringify(value, null, 2)}\n`);
    }
    await writeFile(fixture.routesFile, `${JSON.stringify(inputs.routes, null, 2)}\n`);
    const catalog = toPublicStoreCatalog(
      await loadCatalog(
        fixture.directory,
        inputs.routes,
        fixture.publicDirectory,
        fixture.curationFile,
      ),
    );
    return { ...fixture, catalog, rawCatalog };
  } catch (error) {
    await fixture.cleanup();
    throw error;
  }
}
