import { randomUUID } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import checkoutRoutes from "../apps/egohygiene.io/src/content/store/checkout-routes.json" with { type: "json" };
import { parseStoreCatalog } from "../packages/schemas/src/store.ts";
import type { StoreCatalog } from "../packages/schemas/src/store.ts";

export const defaultCatalogDirectory = fileURLToPath(
  new URL("../apps/egohygiene.io/src/content/store/entries/", import.meta.url),
);

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
    let entries;
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
      let content: string;
      try {
        content = await readFile(source, "utf8");
      } catch (error) {
        throw new Error(`${source}: cannot read catalog entry`, { cause: error });
      }
      try {
        return { source, value: JSON.parse(content) as unknown };
      } catch (error) {
        throw new Error(`${source}: invalid JSON: ${errorMessage(error)}`, { cause: error });
      }
    }),
  );
}

/** Shared Node entry point for the CLI, build validation, and contract tests. */
export async function loadCatalog(
  directory: string = defaultCatalogDirectory,
  routes: unknown = resolve(directory) === resolve(defaultCatalogDirectory) ? checkoutRoutes : [],
): Promise<StoreCatalog> {
  return parseStoreCatalog(await loadCatalogSources(directory), routes);
}

const usage = [
  "Usage:",
  "  node scripts/store-catalog.mts validate [--directory <path>]",
  "  node scripts/store-catalog.mts add-design --slug <slug> --title <title> [--directory <path>]",
].join("\n");

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
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
  const [command, ...rest] = args;
  if (command === "--help" && rest.length === 0) {
    return usage;
  }
  if (command !== "validate" && command !== "add-design") {
    throw new Error(`Expected validate or add-design.\n${usage}`);
  }

  const options = readOptions(
    rest,
    command === "validate" ? ["--directory"] : ["--directory", "--slug", "--title"],
  );
  const directory = resolve(options.get("--directory") ?? defaultCatalogDirectory);
  const sources = await loadCatalogSources(directory);
  const routes = directory === resolve(defaultCatalogDirectory) ? checkoutRoutes : [];

  if (command === "validate") {
    parseStoreCatalog(sources, routes);
    return `Catalog valid: ${sources.length} entries.`;
  }

  const slug = options.get("--slug");
  const title = options.get("--title")?.trim();
  if (!slug || !title) {
    throw new Error(`add-design requires --slug and --title.\n${usage}`);
  }
  // Check before constructing a path: a slug cannot escape the authoring directory.
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("--slug must contain lowercase letters, digits, and single separating hyphens.");
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
  parseStoreCatalog([...sources, { source, value }], routes);
  try {
    await writeFile(source, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    throw new Error(`${source}: could not create entry; existing files are never overwritten`, {
      cause: error,
    });
  }
  return `Created draft design: ${source}\nRun catalog:validate after editing.`;
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
