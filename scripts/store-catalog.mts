import { randomUUID } from "node:crypto";
import type { Dirent } from "node:fs";
import { readdir, readFile, realpath, stat, writeFile } from "node:fs/promises";
import { isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseStoreProviders } from "../packages/schemas/src/store-providers.ts";
import { parseStoreCatalog, StoreCatalogError } from "../packages/schemas/src/store.ts";
import type { StoreCatalog } from "../packages/schemas/src/store.ts";

export const defaultCatalogDirectory = fileURLToPath(
  new URL("../apps/egohygiene.io/src/content/store/entries/", import.meta.url),
);
export const defaultPublicDirectory = fileURLToPath(
  new URL("../apps/egohygiene.io/public/", import.meta.url),
);
export const defaultCheckoutRoutesFile = fileURLToPath(
  new URL("../apps/egohygiene.io/src/content/store/checkout-routes.json", import.meta.url),
);
export const defaultProvidersFile = fileURLToPath(
  new URL("../apps/egohygiene.io/src/content/store/providers.json", import.meta.url),
);

/** Read configuration afresh so a running development server never reuses JSON import caches. */
export async function readCatalogJson(source: string): Promise<unknown> {
  let content: string;
  try {
    content = await readFile(source, "utf8");
  } catch (error) {
    throw new Error(`${source}: cannot read catalog JSON`, { cause: error });
  }
  try {
    return JSON.parse(content) as unknown;
  } catch (error) {
    throw new Error(`${source}: invalid JSON: ${errorMessage(error)}`, { cause: error });
  }
}

export interface CatalogSource {
  source: string;
  value: unknown;
}

/** Discover entries recursively. Filenames organize authors' work, not runtime imports. */
export async function loadCatalogSources(
  directory: string = defaultCatalogDirectory,
): Promise<CatalogSource[]> {
  const root = resolve(directory);
  const files: string[] = [];

  async function discover(path: string): Promise<void> {
    let entries: Dirent<string>[];
    try {
      entries = await readdir(path, { withFileTypes: true });
    } catch (error) {
      throw new Error(`${path}: cannot read catalog directory`, { cause: error });
    }

    for (const entry of entries) {
      const target = resolve(path, entry.name);
      if (entry.isDirectory()) {
        await discover(target);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        files.push(target);
      }
    }
  }

  await discover(root);
  files.sort();
  return Promise.all(
    files.map(async (source): Promise<CatalogSource> => {
      return { source, value: await readCatalogJson(source) };
    }),
  );
}

/** Shared Node entry point for the CLI, build validation, and contract tests. */
export async function loadCatalog(
  directory: string = defaultCatalogDirectory,
  routes?: unknown,
  publicDirectory: string | undefined = resolve(directory) === resolve(defaultCatalogDirectory)
    ? defaultPublicDirectory
    : undefined,
): Promise<StoreCatalog> {
  parseStoreProviders(await readCatalogJson(defaultProvidersFile));
  const checkoutRoutes =
    routes === undefined
      ? resolve(directory) === resolve(defaultCatalogDirectory)
        ? await readCatalogJson(defaultCheckoutRoutesFile)
        : []
      : routes;
  return validateCatalog(await loadCatalogSources(directory), checkoutRoutes, publicDirectory);
}

const usage = [
  "Usage:",
  "  node scripts/store-catalog.mts validate [--directory <path>] [--public-directory <path>]",
  "  node scripts/store-catalog.mts add-design --slug <slug> --title <title> [--directory <path>] [--public-directory <path>]",
].join("\n");

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isWithinDirectory(directory: string, path: string): boolean {
  const relativePath = relative(directory, path);
  return !isAbsolute(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${sep}`);
}

/** Filesystem checks stay at the Node boundary; the shared/browser schema remains pure. */
async function validateCatalog(
  sources: CatalogSource[],
  routes: unknown,
  publicDirectory: string | undefined,
): Promise<StoreCatalog> {
  const catalog = parseStoreCatalog(sources, routes);
  if (publicDirectory === undefined) return catalog;

  const issues: string[] = [];
  let assetRoot: string | undefined;
  for (const [index, entry] of catalog.entries.entries()) {
    if (entry.kind !== "design" || entry.artwork.kind !== "image") continue;
    const field = `${sources[index]?.source ?? entry.id}:artwork.src`;
    const target = resolve(publicDirectory, entry.artwork.src.slice(1));
    try {
      // Resolve both root and target so a symlink cannot conceal an escaping destination.
      assetRoot ??= await realpath(publicDirectory);
      const resolvedTarget = await realpath(target);
      if (!isWithinDirectory(assetRoot, resolvedTarget)) {
        issues.push(
          `${field}: Artwork file resolves outside public directory: ${entry.artwork.src}`,
        );
      } else if (!(await stat(resolvedTarget)).isFile()) {
        issues.push(`${field}: Artwork must reference a regular file: ${entry.artwork.src}`);
      }
    } catch (error) {
      issues.push(
        `${field}: Cannot resolve artwork file ${entry.artwork.src}: ${errorMessage(error)}`,
      );
    }
  }
  if (issues.length) throw new StoreCatalogError(issues);
  return catalog;
}

function validationScope(catalog: StoreCatalog, publicDirectory: string | undefined): string {
  if (publicDirectory === undefined) return "Schema only; artwork files were not checked.";
  const count = catalog.entries.filter(
    (entry) => entry.kind === "design" && entry.artwork.kind === "image",
  ).length;
  return `Image files verified: ${count}.`;
}

function readOptions(args: string[], allowed: readonly string[]): Map<string, string> {
  const options = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    const option = args[index];
    const value = args[index + 1];
    if (!option || !allowed.includes(option)) {
      throw new Error(`Unknown argument: ${option ?? ""}\n${usage}`);
    }
    if (options.has(option)) {
      throw new Error(`Repeated argument: ${option}\n${usage}`);
    }
    if (value === undefined || value.startsWith("--") || !value.trim()) {
      throw new Error(`Missing value for ${option}\n${usage}`);
    }
    options.set(option, value);
  }
  return options;
}

/** Return a short result so importing this module never executes or prints a command. */
export async function runCatalogCommand(args: string[]): Promise<string> {
  parseStoreProviders(await readCatalogJson(defaultProvidersFile));
  const [command, ...rest] = args;
  if (command === "--help" && rest.length === 0) {
    return usage;
  }
  if (command !== "validate" && command !== "add-design") {
    throw new Error(`Expected validate or add-design.\n${usage}`);
  }

  const options = readOptions(
    rest,
    command === "validate"
      ? ["--directory", "--public-directory"]
      : ["--directory", "--public-directory", "--slug", "--title"],
  );
  const directory = resolve(options.get("--directory") ?? defaultCatalogDirectory);
  const sources = await loadCatalogSources(directory);
  const routes =
    directory === resolve(defaultCatalogDirectory)
      ? await readCatalogJson(defaultCheckoutRoutesFile)
      : [];
  const publicDirectory = options.has("--public-directory")
    ? resolve(options.get("--public-directory")!)
    : directory === resolve(defaultCatalogDirectory)
      ? defaultPublicDirectory
      : undefined;

  if (command === "validate") {
    const catalog = await validateCatalog(sources, routes, publicDirectory);
    return `Catalog valid: ${sources.length} entries. ${validationScope(catalog, publicDirectory)}`;
  }

  const slug = options.get("--slug");
  const title = options.get("--title")?.trim();
  if (!slug || !title) {
    throw new Error(`add-design requires --slug and --title.\n${usage}`);
  }
  // Check before constructing a path: a slug cannot escape the authoring directory.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "--slug must contain lowercase letters, digits, and single separating hyphens.",
    );
  }

  const source = resolve(directory, `${slug}.design.json`);
  const value = {
    schemaVersion: 1,
    kind: "design",
    id: `design-${randomUUID()}`,
    slug,
    title,
    description: "Draft design. Replace this description with approved public copy.",
    visibility: "draft",
    artworkRevision: 1,
    artwork: { kind: "placeholder", label: "Artwork pending" },
    contextIds: [],
  };

  // Validate the complete prospective catalog, including uniqueness and references.
  const catalog = await validateCatalog([...sources, { source, value }], routes, publicDirectory);
  try {
    await writeFile(source, `${JSON.stringify(value, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
  } catch (error) {
    throw new Error(`${source}: could not create entry; existing files are never overwritten`, {
      cause: error,
    });
  }
  return `Created draft design: ${source}\n${validationScope(catalog, publicDirectory)}\nRun catalog:validate after editing.`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  runCatalogCommand(process.argv.slice(2)).then(
    (message) => process.stdout.write(`${message}\n`),
    (error: unknown) => {
      process.stderr.write(`${errorMessage(error)}\n`);
      process.exitCode = 1;
    },
  );
}
