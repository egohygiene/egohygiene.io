import { readFileSync, realpathSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";

import ts from "typescript";

// A narrow guard for the portable seam extracted in #69, not a repository-wide linter.
const root = resolve(import.meta.dirname, "../..");
const configPath = resolve(root, "tsconfig.store-domain.json");
const config = ts.readConfigFile(configPath, ts.sys.readFile);
if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, dirname(configPath));
if (parsed.errors.length)
  throw new Error(
    ts.formatDiagnostics(parsed.errors, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: (file) => file,
      getNewLine: () => "\n",
    }),
  );
const allowedFiles = new Set(parsed.fileNames.map((file) => realpathSync(file)));
const schemasDirectory = `${resolve(root, "packages/schemas/src")}${sep}`;
const domainDirectory = `${resolve(root, "apps/egohygiene.io/src/features/store/domain")}${sep}`;
const pending = [...allowedFiles];
const seen = new Set<string>();

while (pending.length) {
  const file = pending.pop();
  if (!file || seen.has(file)) continue;
  seen.add(file);
  const source = readFileSync(file, "utf8");
  for (const imported of ts.preProcessFile(source, true).importedFiles) {
    const specifier = imported.fileName;
    // Zod validates wire/catalog inputs. All other external dependencies are forbidden.
    if (specifier === "zod" && !file.startsWith(domainDirectory)) continue;
    if (!specifier.startsWith(".") && specifier !== "@egohygiene/schemas") {
      throw new Error(`${relative(root, file)}: portable store code cannot import ${specifier}`);
    }
    const resolved = ts.resolveModuleName(specifier, file, parsed.options, ts.sys).resolvedModule;
    if (!resolved) throw new Error(`${relative(root, file)}: cannot resolve ${specifier}`);
    const target = realpathSync(resolved.resolvedFileName);
    if (!allowedFiles.has(target) && !target.startsWith(schemasDirectory)) {
      throw new Error(`${relative(root, file)}: ${specifier} leaves the portable store boundary`);
    }
    // The domain cannot reach any provider adapter even though both are portable roots.
    if (
      file.startsWith(domainDirectory) &&
      !target.startsWith(domainDirectory) &&
      !target.startsWith(schemasDirectory)
    ) {
      throw new Error(`${relative(root, file)}: domain code cannot depend on a provider adapter`);
    }
    if (file.startsWith(schemasDirectory) && !target.startsWith(schemasDirectory)) {
      throw new Error(`${relative(root, file)}: schemas cannot depend on application code`);
    }
    pending.push(target);
  }
}

console.log(`Portable store boundary passed (${seen.size} source modules).`);
