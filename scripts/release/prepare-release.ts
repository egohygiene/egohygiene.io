import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

for (const name of readdirSync(path.join(process.cwd(), "packages"))) {
  const manifest = JSON.parse(
    readFileSync(path.join(process.cwd(), "packages", name, "package.json"), "utf8"),
  );
  if (!manifest.private) {
    throw new Error(`${manifest.name} must stay private until publishing intent is explicit.`);
  }
}

console.log("Release preparation check passed: all workspace packages are private.");
