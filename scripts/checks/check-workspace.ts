import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function readJson(filePath: string) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

for (const scope of ["apps", "packages"]) {
  for (const name of readdirSync(path.join(root, scope))) {
    const packageJsonPath = path.join(root, scope, name, "package.json");
    const manifest = readJson(packageJsonPath);

    if (!manifest.name) {
      throw new Error(`${packageJsonPath} is missing a name.`);
    }

    if (!manifest.scripts?.build && scope === "packages") {
      throw new Error(`${packageJsonPath} is missing a build script.`);
    }
  }
}

console.log("Workspace manifests look valid.");
