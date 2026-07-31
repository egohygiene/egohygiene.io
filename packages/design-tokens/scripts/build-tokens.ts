import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const sourceDir = path.resolve(import.meta.dirname, "../src/tokens");
const outputTs = path.resolve(import.meta.dirname, "../src/generated.ts");
const outputCss = path.resolve(import.meta.dirname, "../src/generated.css");

function readJson(name) {
  return JSON.parse(readFileSync(path.join(sourceDir, `${name}.json`), "utf8"));
}

const tokens = {
  color: readJson("color"),
  spacing: readJson("spacing"),
  size: readJson("size"),
  border: readJson("border"),
  shadow: readJson("shadow"),
  typography: readJson("typography"),
  motion: readJson("motion"),
};

const cssLines = [":root {"];
for (const [group, values] of Object.entries(tokens)) {
  for (const [name, value] of Object.entries(values)) {
    cssLines.push(`  --eh-${group}-${name}: ${value};`);
  }
}
cssLines.push("}", "");

writeFileSync(
  outputTs,
  `export const tokens = ${JSON.stringify(tokens, null, 2)} as const;\nexport type Tokens = typeof tokens;\n`,
  "utf8",
);
writeFileSync(outputCss, `${cssLines.join("\n")}\n`, "utf8");
