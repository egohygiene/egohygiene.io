import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { checkReview, parseCatalog, sourceInventory } from "../locales/catalog.ts";

const { values } = parseArgs({
  options: {
    "source-directory": { type: "string" },
    directory: { type: "string" },
    locale: { type: "string" },
    "format-locale": { type: "string" },
    review: { type: "string" },
    "require-review": { type: "boolean", default: false },
    inventory: { type: "string" },
  },
});

function readNamespaces(directory: string): Record<string, unknown> {
  const namespaces: Record<string, unknown> = Object.create(null);
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
  )) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      throw new Error(`${directory}/${entry.name}: expected namespace JSON files only.`);
    }
    const name = entry.name.slice(0, -5);
    namespaces[name] = JSON.parse(readFileSync(path.join(directory, entry.name), "utf8"));
  }
  return namespaces;
}

try {
  const sourceDirectory =
    values["source-directory"] ??
    path.join(process.cwd(), "apps/egohygiene.io/src/i18n/locales/en");
  const source = parseCatalog({
    locale: "en",
    namespaces: readNamespaces(sourceDirectory),
    source: true,
  });
  const inventory = sourceInventory(source);
  const candidate = values.directory !== undefined || values.locale !== undefined;
  if (candidate && (!values.directory || !values.locale)) {
    throw new Error("Candidate checks require both --directory and --locale.");
  }
  if (!candidate && (values.review || values["format-locale"] || values["require-review"])) {
    throw new Error("--review, --format-locale and --require-review require a candidate locale.");
  }
  const candidates = candidate
    ? [
        {
          locale: values.locale as string,
          directory: values.directory as string,
          reviewFile: values.review,
          requireReview: values["require-review"],
        },
      ]
    : readdirSync(path.dirname(sourceDirectory), { withFileTypes: true })
        .filter((entry) => entry.name !== "en")
        .map((entry) => {
          if (!entry.isDirectory()) throw new Error(`${entry.name}: expected a locale directory.`);
          return {
            locale: entry.name,
            directory: path.join(path.dirname(sourceDirectory), entry.name),
            reviewFile: path.join(
              path.dirname(sourceDirectory),
              "..",
              "reviews",
              `${entry.name}.json`,
            ),
            requireReview: true,
          };
        })
        .sort((a, b) => (a.locale < b.locale ? -1 : a.locale > b.locale ? 1 : 0));
  const translations = candidates.map(({ locale, directory, reviewFile, requireReview }) => {
    const translated = parseCatalog({
      locale,
      formatLocale: values["format-locale"] ?? locale,
      namespaces: readNamespaces(directory),
    });
    const report = checkReview({
      source,
      translated,
      ...(reviewFile ? { review: JSON.parse(readFileSync(reviewFile, "utf8")) } : {}),
      requireReview,
    });
    console.log(
      `${locale}: ${report.reviewInputs.length} translated messages; ${report.sourceFallback.length} source fallback messages/families; ${report.pluralCategoryFallback.length} category fallbacks; ${report.pluralBaseFallback.length} plain-base plural fallbacks; ${report.reviewStatus}.`,
    );
    return report;
  });
  if (values.inventory) {
    writeFileSync(values.inventory, `${JSON.stringify({ ...inventory, translations }, null, 2)}\n`);
  }
  console.log(
    `Validated ${inventory.messages.length} English messages in ${inventory.namespaces.length} namespaces (including preview); source SHA-256 ${inventory.sourceHash}.`,
  );
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
