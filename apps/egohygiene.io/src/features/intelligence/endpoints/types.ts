import type { IntelligenceClaim, IntelligenceState } from "../types";

/** Presentation-only records. Canonical meaning remains with the normalized producer. */
export interface EndpointReference {
  readonly id: string;
  readonly repository: string;
  readonly key: string;
  readonly title: string;
  readonly kind: string;
  readonly state: string;
  readonly assertion: string;
  readonly freshness: string;
  readonly url: string | null;
}
export interface EndpointRelation {
  readonly label: string;
  readonly target: EndpointReference;
  readonly assertion?: string;
  readonly freshness?: string;
}
export interface EndpointRecord extends EndpointReference {
  readonly summary?: string;
  readonly searchText?: string;
  readonly details: readonly { readonly label: string; readonly value: string }[];
  readonly relations: readonly EndpointRelation[];
}
export interface EndpointGroup {
  readonly repository: string;
  readonly state: IntelligenceState;
  readonly reason: string;
  readonly sourceFreshness?: "current" | "stale";
  readonly coverage: readonly IntelligenceClaim[];
  readonly records: readonly EndpointRecord[];
  readonly truncated: boolean;
}
export interface EndpointData {
  readonly id: string;
  readonly state: IntelligenceState;
  readonly groups: readonly EndpointGroup[];
}
