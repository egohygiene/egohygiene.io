/** Website presentation inputs, projected from an admitted owner fleet artifact. */
export type IntelligenceState = "available" | "partial" | "stale" | "unavailable" | "incompatible" | "error";
export type EvidenceState = "current" | "stale" | "unknown" | "partial" | "unavailable" | "error" | "not_applicable";

export interface IntelligenceClaim {
  readonly domain: string;
  readonly collection: string;
  readonly freshness: string;
  readonly reason: string;
  readonly observedAt: string | null;
}

export interface IntelligenceItem {
  readonly id: string;
  readonly title: string;
  readonly state: string;
  readonly assertion: string;
  readonly freshness: string;
  readonly url: string | null;
}

export interface IntelligenceRepository {
  readonly name: string;
  readonly title: string;
  readonly sourceUrl: string;
  readonly commitUrl: string;
  readonly representedCommit: string;
  readonly snapshotId: string;
  readonly snapshotDigest: string;
  readonly observedAt: string;
  readonly evidenceState: EvidenceState;
  readonly coverage: readonly IntelligenceClaim[];
  readonly now: {
    readonly state: "available" | "unavailable";
    readonly currentFocus: readonly IntelligenceItem[];
    readonly blockers: readonly IntelligenceItem[];
    readonly nextReady: readonly IntelligenceItem[];
  };
}

export interface IntelligenceModule {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly issueUrl: string;
  readonly implemented: boolean;
}

export interface IntelligenceData {
  readonly graph?: { readonly nodes: readonly import("./graph/types").GraphNode[]; readonly edges: readonly import("./graph/types").GraphEdge[]; readonly truncated: boolean };
  readonly endpoints?: Readonly<Record<string, import("./endpoints/types").EndpointData>>;
  readonly state: IntelligenceState;
  readonly code: "NOT_CONFIGURED" | "REVIEW_BINDING_REQUIRED" | "INPUT_UNAVAILABLE" | "INPUT_INVALID" | "INPUT_INCOMPATIBLE" | "PUBLIC_REQUIRED" | "READY" | "STALE" | "PARTIAL";
  readonly asOf: string | null;
  readonly snapshotId: string | null;
  readonly artifactSha256: string | null;
  readonly observationWindow: { readonly earliest: string; readonly latest: string } | null;
  readonly repositories: readonly IntelligenceRepository[];
  readonly modules: readonly IntelligenceModule[];
  readonly provenance: {
    readonly schema: string;
    readonly contractVersion: string;
    readonly observatoryRevision: string;
    readonly schemaSha256: string;
    readonly registryRevision: string;
    readonly registrySha256: string;
    readonly registryUrl: string;
  };
}
