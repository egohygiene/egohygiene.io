import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

for (const name of readdirSync(path.join(root, "packages"))) {
  const packageJsonPath = path.join(root, "packages", name, "package.json");
  const manifest = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  for (const target of Object.values(manifest.exports ?? {})) {
    if (!existsSync(path.join(root, "packages", name, String(target)))) {
      throw new Error(`Missing export target ${target} for ${manifest.name}.`);
    }
  }
}

console.log("Package exports resolve to files.");
