# ADR 0016 — Optional website references and listing evidence

Date: 2026-11-10. Status: proposed/implemented for review under #34.

Keep catalog v3 as the website authority. Song contexts are approved public work
references; design contextIds declare their work-wide associations. Products
inherit work relationships through existing designIds. An optional separately
versioned companion may narrow a design association to a public recording key,
whose declared work must match that design's existing song context. Private
canonical IDs and their crosswalk remain outside this public repository.

A website listing-evidence envelope can bind exact public input/build/artwork and
the existing reviewed offer. The snapshot is comparison evidence, never an alternative editable catalog/price
authority. Its status distinguishes preparation, supplied
approval, dated observation, withdrawal and unknown evidence. Effective stale
status follows changed bindings. It neither creates a private review receipt nor
authenticates a reviewer or visits a provider. It cannot enable purchase or
renew qualification; catalog v3's current guard retains that authority.

Use strict runtime schemas and derive TypeScript types. Validate all authoring
references before filtering; a malformed draft is an error. Optional Node/Vite
input is the only new build seam. Default output and all existing contracts
remain byte-identical; no canonical private ontology or upstream schema is adopted.
Existing catalog migrations remain the supported history. There is no prior
companion version to migrate and no justified catalog v4 change.

Alternatives: duplicating song/product metadata creates competing authority;
importing private packages leaks evidence; adding recording IDs directly to every
product duplicates design relationships. A whole-framework/catalog migration is
unnecessary for this bounded public-reference requirement.

Rollback removes the optional companion/admission path and public-evidence
helpers, preserving catalog v3 and existing consumers. No production companion
is selected in this checkpoint. Actual private exporter/receipt contracts and
real publication remain with their existing owners.

See [A/B/C and compatibility limits](../../store/relationship-boundary-34.md).
