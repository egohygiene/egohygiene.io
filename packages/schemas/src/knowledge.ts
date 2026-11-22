import { z } from "zod";

const identifier = z.string().regex(/^[a-z][a-z0-9-]{0,79}$/u);
export const knowledgeKindSchema = z.enum(["pillar", "term", "synapse", "system", "tag"]);
export const knowledgeNodeSchema = z.strictObject({
  id: identifier,
  kind: knowledgeKindSchema,
  slug: identifier,
  title: z.string().trim().min(1).max(200),
  summary: z.string().max(2000).optional(),
  visibility: z.enum(["public", "private"]),
  review: z.enum(["draft", "reviewed"]),
});
export const knowledgeRelationshipSchema = z.strictObject({
  id: identifier,
  source: identifier,
  target: identifier,
  type: z.enum(["related", "supports", "extends", "contradicts", "member-of"]),
  visibility: z.enum(["public", "private"]),
  review: z.enum(["draft", "reviewed"]),
});
export const knowledgeDatasetSchema = z
  .strictObject({
    schemaVersion: z.literal("egohygiene.knowledge/v1"),
    datasetVersion: z.string().regex(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u),
    origin: z.strictObject({
      kind: z.enum(["authored", "synthetic"]),
      sources: z.array(z.string().min(1).max(1000)).max(100),
    }),
    nodes: z.array(knowledgeNodeSchema).max(1000),
    relationships: z.array(knowledgeRelationshipSchema).max(5000),
  })
  .superRefine((dataset, context) => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const [index, node] of dataset.nodes.entries()) {
      const slug = `${node.kind}/${node.slug}`;
      if (ids.has(node.id) || slugs.has(slug)) {
        context.addIssue({
          code: "custom",
          message: "Duplicate knowledge identity or kind/slug",
          path: ["nodes", index],
        });
      }
      ids.add(node.id);
      slugs.add(slug);
    }
    const edgeIds = new Set<string>();
    const hierarchy = new Map<string, string[]>();
    for (const [index, edge] of dataset.relationships.entries()) {
      if (edgeIds.has(edge.id) || !ids.has(edge.source) || !ids.has(edge.target)) {
        context.addIssue({
          code: "custom",
          message: "Duplicate relationship or unresolved endpoint",
          path: ["relationships", index],
        });
      }
      edgeIds.add(edge.id);
      if (edge.type === "member-of")
        hierarchy.set(edge.source, [...(hierarchy.get(edge.source) ?? []), edge.target]);
    }
    // Cyclic related/supporting graphs are valid; membership is hierarchical.
    const active = new Set<string>();
    const done = new Set<string>();
    function cycle(id: string): boolean {
      if (active.has(id)) return true;
      if (done.has(id)) return false;
      active.add(id);
      for (const target of hierarchy.get(id) ?? []) if (cycle(target)) return true;
      active.delete(id);
      done.add(id);
      return false;
    }
    if ([...ids].some(cycle))
      context.addIssue({ code: "custom", message: "Cyclic membership relationship" });
  });

export type KnowledgeKind = z.infer<typeof knowledgeKindSchema>;
export type KnowledgeNode = Readonly<z.infer<typeof knowledgeNodeSchema>>;
export type KnowledgeRelationship = Readonly<z.infer<typeof knowledgeRelationshipSchema>>;
export type KnowledgeDataset = z.infer<typeof knowledgeDatasetSchema>;
