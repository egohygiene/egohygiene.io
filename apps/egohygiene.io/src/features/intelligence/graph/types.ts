/** Admitted presentation nodes. Position never supplies a relationship. */
export interface GraphNode {
  readonly id: string;
  readonly label: string;
  readonly kind: "module" | "repository" | "entity";
  readonly href: string;
  readonly state: string;
  readonly description: string;
  readonly repository?: string;
  readonly sourceHref?: string;
}

/** Declared relationships and navigation membership remain separate classes. */
export interface GraphEdge {
  readonly id: string;
  readonly source: string;
  readonly target: string;
  readonly label: string;
  readonly kind: "navigation" | "declared";
  readonly assertion: string;
  readonly freshness: string;
  readonly evidenceHref?: string;
  readonly sourceState?: string;
  readonly sourceFreshness?: string;
}

export interface IntelligenceGraphProps {
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
  readonly publicationRoutes?: readonly string[];
}
