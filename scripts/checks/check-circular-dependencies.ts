import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const graph = new Map<string, string[]>();

for (const name of readdirSync(path.join(root, "packages"))) {
  const manifest = JSON.parse(
    readFileSync(path.join(root, "packages", name, "package.json"), "utf8"),
  );
  const deps = Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies }).filter(
    (dependency) => dependency.startsWith("@egohygiene/"),
  );
  graph.set(manifest.name, deps);
}

const visiting = new Set<string>();
const visited = new Set<string>();

function walk(node: string) {
  if (visiting.has(node)) {
    throw new Error(`Circular dependency detected at ${node}.`);
  }
  if (visited.has(node)) {
    return;
  }

  visiting.add(node);
  for (const dependency of graph.get(node) ?? []) {
    walk(dependency);
  }
  visiting.delete(node);
  visited.add(node);
}

for (const node of graph.keys()) {
  walk(node);
}

console.log("No circular package dependencies found.");
