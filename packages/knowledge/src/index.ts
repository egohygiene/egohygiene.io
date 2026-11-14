import {
  type KnowledgeKind,
  type KnowledgeNode,
  type KnowledgeRelationship,
  knowledgeDatasetSchema,
} from "@egohygiene/schemas/knowledge";

export type {
  KnowledgeDataset,
  KnowledgeKind,
  KnowledgeNode,
  KnowledgeRelationship,
} from "@egohygiene/schemas/knowledge";

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function validateTraversalBudget(maxDepth: number, limit: number): void {
  if (
    !Number.isInteger(maxDepth) ||
    maxDepth < 0 ||
    maxDepth > 10 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 1000
  ) {
    throw new Error("Invalid traversal budget.");
  }
}

/** Validate before filtering; never expose draft/private nodes or their edges. */
export function createKnowledgeIndex(input: unknown, options: { allowSynthetic?: boolean } = {}) {
  const dataset = knowledgeDatasetSchema.parse(input);
  if (dataset.origin.kind === "synthetic" && options.allowSynthetic !== true) {
    throw new Error("Synthetic knowledge requires an explicit fixture consumer.");
  }
  const nodes = Object.freeze(
    dataset.nodes
      .filter((node) => node.visibility === "public" && node.review === "reviewed")
      .map((node) => Object.freeze(node))
      .sort((a, b) => compare(`${a.kind}/${a.slug}/${a.id}`, `${b.kind}/${b.slug}/${b.id}`)),
  );
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const edges = Object.freeze(
    dataset.relationships
      .filter(
        (edge) =>
          edge.visibility === "public" &&
          edge.review === "reviewed" &&
          byId.has(edge.source) &&
          byId.has(edge.target),
      )
      .map((edge) => Object.freeze(edge))
      .sort((a, b) =>
        compare(
          `${a.source}/${a.type}/${a.target}/${a.id}`,
          `${b.source}/${b.type}/${b.target}/${b.id}`,
        ),
      ),
  );
  return Object.freeze({
    schemaVersion: dataset.schemaVersion,
    datasetVersion: dataset.datasetVersion,
    list(kind?: KnowledgeKind): readonly KnowledgeNode[] {
      return kind === undefined ? nodes : Object.freeze(nodes.filter((node) => node.kind === kind));
    },
    getById(id: string): KnowledgeNode | undefined {
      return byId.get(id);
    },
    getBySlug(kind: KnowledgeKind, slug: string): KnowledgeNode | undefined {
      return nodes.find((node) => node.kind === kind && node.slug === slug);
    },
    relationships(id: string): readonly KnowledgeRelationship[] {
      return Object.freeze(edges.filter((edge) => edge.source === id || edge.target === id));
    },
    traverse(
      id: string,
      { maxDepth = 1, limit = 100 }: { maxDepth?: number; limit?: number } = {},
    ): readonly KnowledgeNode[] {
      validateTraversalBudget(maxDepth, limit);
      if (!byId.has(id)) return Object.freeze([]);
      const seen = new Set([id]);
      let frontier = [id];
      const selected: KnowledgeNode[] = [];
      for (let depth = 0; depth < maxDepth && frontier.length; depth++) {
        const next: string[] = [];
        const targetIds = new Set(
          frontier.flatMap((source) =>
            edges.filter((edge) => edge.source === source).map((edge) => edge.target),
          ),
        );
        const targets = [...targetIds]
          .filter((target) => !seen.has(target))
          .map((target) => byId.get(target))
          .filter((target): target is KnowledgeNode => target !== undefined);
        for (const target of targets) {
          seen.add(target.id);
          selected.push(target);
          next.push(target.id);
          if (selected.length === limit) return Object.freeze(selected);
        }
        frontier = next;
      }
      return Object.freeze(selected);
    },
  });
}
