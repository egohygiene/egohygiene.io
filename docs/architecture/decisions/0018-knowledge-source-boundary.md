# ADR 0018: Private experimental knowledge package boundary

Status: Proposed; implemented for review under issue23.

The schema package owns the strict v1 structural contract and inferred types.
The private `@egohygiene/knowledge` workspace package owns deterministic queries
over supplied validated records. Content parsing and React presentation stay
with their existing owners. The website feature consumes an empty authored
dataset; no canonical ontology or creator approval is inferred from scaffolding.

Public queries expose only reviewed/public nodes and relationships whose
endpoints are visible. Draft/private source still validates before filtering.
Membership cycles fail; ordinary relationship cycles remain valid and traversal
has explicit depth/result budgets. Synthetic input requires explicit opt-in.

This source API is experimental, not a published stable package. Legacy data
adoption, real term/synapse routes, semantic review, JSON distribution and public
release remain follow-up acceptance under issue23. No database or React runtime
is added to the query package. The isolated fixture proves bundler consumption
of package exports outside workspace aliases; it is not registry-install proof.
