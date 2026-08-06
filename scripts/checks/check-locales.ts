import { readFileSync } from "node:fs";
import path from "node:path";

for (const file of ["common", "navigation", "pages", "errors"]) {
  const absolutePath = path.join(
    process.cwd(),
    "apps/egohygiene.io/src/i18n/locales/en",
    `${file}.json`,
  );
  const contents = JSON.parse(readFileSync(absolutePath, "utf8"));

  if (Object.keys(contents).length === 0) {
    throw new Error(`${absolutePath} is empty.`);
  }
}

console.log("Locale files are populated.");
