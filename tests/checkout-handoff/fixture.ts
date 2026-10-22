import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { parseStoreCatalog, toPublicStoreCatalog } from "../../packages/schemas/src/store.ts";
import { loadCatalog } from "../../scripts/store-catalog.mts";
import { CHECKOUT_HANDOFF_FIXTURE, createCheckoutHandoffInputs } from "./inputs.ts";

// Preserve existing Node callers while browser/component tests can import pure inputs directly.
export { CHECKOUT_HANDOFF_FIXTURE, createCheckoutHandoffCatalog, createCheckoutHandoffInputs } from "./inputs.ts";

// Authored deterministic test image: one RGBA pixel (#7c3aedff), not product artwork.
const swatchPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGOosXr7HwAFfAKjWcbirwAAAABJRU5ErkJggg==",
  "base64",
);

/** Write only to a newly owned temporary directory; never overlay the real catalog/assets. */
export async function createCheckoutHandoffFixture() {
  const { sources, routes } = createCheckoutHandoffInputs();
  parseStoreCatalog(sources, routes);
  const root = await mkdtemp(join(tmpdir(), "egohygiene-handoff-37a-"));
  const directory = join(root, "catalog", "entries");
  const routesFile = join(root, "catalog", "checkout-routes.json");
  const publicDirectory = join(root, "public");
  const cleanup = () => rm(root, { recursive: true, force: true });
  try {
    await mkdir(directory, { recursive: true });
    for (const { source, value } of sources) {
      await writeFile(join(directory, source), `${JSON.stringify(value, null, 2)}\n`);
    }
    await writeFile(routesFile, `${JSON.stringify(routes, null, 2)}\n`);
    const artworkFile = join(publicDirectory, CHECKOUT_HANDOFF_FIXTURE.artworkPath.slice(1));
    await mkdir(dirname(artworkFile), { recursive: true });
    await writeFile(artworkFile, swatchPng);
    const catalog = toPublicStoreCatalog(
      await loadCatalog(directory, routes, publicDirectory, null),
    );
    return { root, directory, routesFile, publicDirectory, curationFile: null, catalog, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}
