import { isAbsolute, relative, resolve, sep } from "node:path";

import type { Plugin } from "vite";

import { toPublicStoreCatalog } from "../packages/schemas/src/store.ts";
import {
  curationFileForDirectory,
  defaultCatalogDirectory,
  defaultCheckoutRoutesFile,
  defaultProvidersFile,
  defaultPublicDirectory,
  loadCatalog,
  loadStorefrontCuration,
  readCatalogJson,
} from "./store-catalog.mts";

export const publicCatalogModuleId = "virtual:store-catalog";
const resolvedModuleId = `\0${publicCatalogModuleId}`;

export interface PublicStoreCatalogOptions {
  readonly directory?: string;
  readonly routesFile?: string;
  readonly publicDirectory?: string;
  readonly curationFile?: string | null;
}

function isWithin(directory: string, file: string): boolean {
  const path = relative(directory, file);
  return !isAbsolute(path) && path !== ".." && !path.startsWith(`..${sep}`);
}

/** Validate authoring sources in Node; expose only the public projection to Vite's module graph. */
export function publicStoreCatalog(options: PublicStoreCatalogOptions = {}): Plugin {
  const directory = resolve(options.directory ?? defaultCatalogDirectory);
  const routesFile = resolve(options.routesFile ?? defaultCheckoutRoutesFile);
  const publicDirectory = resolve(options.publicDirectory ?? defaultPublicDirectory);
  const curationFile =
    options.curationFile === undefined
      ? curationFileForDirectory(directory)
      : options.curationFile === null
        ? null
        : resolve(options.curationFile);
  const inputs = [
    directory,
    routesFile,
    defaultProvidersFile,
    publicDirectory,
    ...(curationFile ? [curationFile] : []),
  ];
  let building = false;
  let stopWatching: (() => void) | undefined;

  return {
    name: "public-store-catalog",
    configResolved(config) {
      building = config.command === "build";
    },
    resolveId(id) {
      return id === publicCatalogModuleId ? resolvedModuleId : undefined;
    },
    async load(id) {
      if (id !== resolvedModuleId) return undefined;
      // Build watchers need these inputs. In serve mode, addWatchFile also creates module
      // dependencies; use the server watcher below so raw authoring files stay out of the graph.
      if (building) for (const input of inputs) this.addWatchFile(input);
      const catalog = toPublicStoreCatalog(
        await loadCatalog(
          directory,
          await readCatalogJson(routesFile),
          publicDirectory,
          curationFile,
        ),
      );
      const storefrontCuration = await loadStorefrontCuration(catalog, curationFile);
      // Raw JSON is never a browser import or an emitted asset. No timestamp or absolute path
      // enters this deterministic module, including its optional production source map.
      return {
        code: `export const storeCatalog = ${JSON.stringify(catalog)};\nexport const storefrontCuration = ${JSON.stringify(storefrontCuration)};\n`,
        map: { mappings: "" },
      };
    },
    configureServer(server) {
      server.watcher.add(inputs);
      const refresh = (event: string, file: string) => {
        if (!["add", "change", "unlink", "addDir", "unlinkDir"].includes(event)) return;
        const path = resolve(file);
        if (
          !inputs.some((input) => path === input) &&
          !isWithin(directory, path) &&
          !isWithin(publicDirectory, path)
        )
          return;
        const module = server.moduleGraph.getModuleById(resolvedModuleId);
        if (module) server.moduleGraph.invalidateModule(module);
        // Full reload also refreshes module-level fixture selections and surfaces invalid edits
        // through Vite's error overlay instead of keeping a stale validated catalog on screen.
        server.ws.send({ type: "full-reload", path: "*" });
      };
      server.watcher.on("all", refresh);
      stopWatching = () => {
        server.watcher.off("all", refresh);
      };
    },
    closeBundle() {
      stopWatching?.();
    },
  };
}
