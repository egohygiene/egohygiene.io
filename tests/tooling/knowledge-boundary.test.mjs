import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

import { build } from "vite";
import { z } from "zod";
import { publicKnowledge } from "../../apps/egohygiene.io/src/features/knowledge/index.ts";
import { createKnowledgeIndex } from "../../packages/knowledge/src/index.ts";
import { knowledgeDatasetSchema } from "../../packages/schemas/src/knowledge.ts";

function fixture() {
  const node = (id, kind = "term", extra = {}) => ({
    id,
    kind,
    slug: id,
    title: id,
    visibility: "public",
    review: "reviewed",
    ...extra,
  });
  const edge = (id, source, target, extra = {}) => ({
    id,
    source,
    target,
    type: "related",
    visibility: "public",
    review: "reviewed",
    ...extra,
  });
  return {
    schemaVersion: "egohygiene.knowledge/v1",
    datasetVersion: "0.1.0",
    origin: { kind: "synthetic", sources: ["test-fixture-only"] },
    nodes: [
      node("first"),
      node("second", "pillar"),
      node("secret", "term", { visibility: "private" }),
      node("draft", "synapse", { review: "draft" }),
    ],
    relationships: [
      edge("forward", "first", "second"),
      edge("cycle", "second", "first"),
      edge("hidden", "first", "secret"),
      edge("draft-edge", "first", "draft"),
    ],
  };
}

test("synthetic content is opt-in and the website starts with no invented ontology", () => {
  assert.throws(() => createKnowledgeIndex(fixture()), /Synthetic knowledge/u);
  assert.deepEqual(publicKnowledge.list(), []);
  const index = createKnowledgeIndex(fixture(), { allowSynthetic: true });
  assert.equal(index.getBySlug("term", "first").id, "first");
  assert.equal(index.getById("secret"), undefined);
  assert.equal(index.getById("draft"), undefined);
  assert.deepEqual(
    index.relationships("first").map((edge) => edge.id),
    ["forward", "cycle"],
  );
  assert.deepEqual(
    index.list("pillar").map((node) => node.id),
    ["second"],
  );
});

test("queries and cyclic traversal are deterministic, bounded and immutable", () => {
  const input = fixture();
  const index = createKnowledgeIndex(input, { allowSynthetic: true });
  input.nodes[0].title = "mutated original";
  assert.equal(index.getById("first").title, "first");
  assert.throws(() => {
    index.getById("first").title = "mutation";
  }, TypeError);
  assert.throws(() => index.list().pop(), TypeError);
  assert.deepEqual(
    index.traverse("first", { maxDepth: 10 }).map((node) => node.id),
    ["second"],
  );
  assert.deepEqual(index.traverse("secret"), []);
  assert.throws(() => index.traverse("first", { maxDepth: 11 }), /budget/u);
  const reordered = fixture();
  reordered.nodes.reverse();
  reordered.relationships.reverse();
  assert.deepEqual(createKnowledgeIndex(reordered, { allowSynthetic: true }).list(), index.list());
});

test("malformed, duplicate, dangling and membership-cycle input fails before filtering", () => {
  for (const change of [
    (value) => {
      value.schemaVersion = "unknown";
    },
    (value) => {
      value.nodes.push({ ...value.nodes[0] });
    },
    (value) => {
      value.nodes[1].kind = "term";
      value.nodes[1].slug = "first";
    },
    (value) => {
      value.relationships[2].target = "missing-private-target";
    },
    (value) => {
      value.relationships[0].type = "member-of";
      value.relationships[1].type = "member-of";
    },
  ]) {
    const input = fixture();
    change(input);
    assert.equal(knowledgeDatasetSchema.safeParse(input).success, false);
    assert.throws(() => createKnowledgeIndex(input, { allowSynthetic: true }));
  }
});

test("checked JSON Schema is regenerated from the runtime owner", async () => {
  const checked = JSON.parse(
    await readFile("packages/schemas/schemas/knowledge.schema.json", "utf8"),
  );
  assert.deepEqual(checked, z.toJSONSchema(knowledgeDatasetSchema));
});

test("an isolated non-React consumer bundles manifest exports outside the workspace", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "knowledge-consumer-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "packages"));
  await cp("packages/knowledge", path.join(root, "packages/knowledge"), {
    recursive: true,
    filter: (file) => !file.includes("/node_modules") && !file.includes("/dist"),
  });
  await cp("packages/schemas", path.join(root, "packages/schemas"), {
    recursive: true,
    filter: (file) => !file.includes("/node_modules") && !file.includes("/dist"),
  });
  await mkdir(path.join(root, "node_modules/@egohygiene"), { recursive: true });
  await symlink(
    path.join(root, "packages/knowledge"),
    path.join(root, "node_modules/@egohygiene/knowledge"),
  );
  await symlink(
    path.join(root, "packages/schemas"),
    path.join(root, "node_modules/@egohygiene/schemas"),
  );
  await symlink(path.resolve("node_modules/zod"), path.join(root, "node_modules/zod"));
  await writeFile(path.join(root, "package.json"), '{"type":"module"}');
  await writeFile(
    path.join(root, "entry.ts"),
    `import {createKnowledgeIndex} from "@egohygiene/knowledge";export const ids=createKnowledgeIndex(${JSON.stringify(fixture())},{allowSynthetic:true}).list().map(node=>node.id);`,
  );
  await build({
    root,
    configFile: false,
    logLevel: "silent",
    build: { lib: { entry: path.join(root, "entry.ts"), formats: ["es"], fileName: "consumer" } },
  });
  const consumer = await import(pathToFileURL(path.join(root, "dist/consumer.js")).href);
  assert.deepEqual(consumer.ids, ["second", "first"]);
  const text = await readFile(path.join(root, "dist/consumer.js"), "utf8");
  assert.doesNotMatch(text, /react-dom|window\.|document\.|node:fs/u);
});
