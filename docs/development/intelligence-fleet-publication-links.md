# Fleet overview and consumer publication links

The central `/intelligence/` page is the fleet overview. Repository detail is
published by each consumer through the shared Relay renderer and its own Pages
composition/deployment boundary. The central draft endpoint views remain
available as aggregate exploration; they are not the consumer's canonical
Repository Intelligence publication.

## Destination transport

`repository-publications.v1.schema.json` describes a checksum-bound local input
with schema `egohygiene.website.repository-publications/v1`, public visibility,
and a `publications` array. This is publication transport, not another repository
registry. Repository identity comes only from the already admitted public fleet
roster. Unselected/private rows are excluded before URL, source identity,
duplicate checks, validation, counts or public digest calculation.

Each admitted entry supplies:

- The public consumer repository and its explicit canonical HTTPS Intelligence
  base URL, including any consumer-owned project/site base path.
- The exact published consumer source and Relay generator revisions, plus an
  explicit observation time no later than the fleet's evaluation boundary.
- An immutable consumer configuration URL at that exact source revision and a
  canonical consumer Actions run or immutable source URL for publication proof.
  An optional immutable CNAME URL records declared host evidence separately.
- The surfaces explicitly covered by this publication record. Their suffixes
  come from the pinned Hygiene **repository** route profile. A listed surface
  is a declaration to review; the loader does not probe it or infer existence.

The catalog must include the `intelligence` root surface. A custom site such as
`https://host.example.org/project/intelligence/` keeps that complete base path
when deriving its declared `roadmap` destination. No host, subdomain, project
path, or route adoption is inferred from the repository's name. The central
`https://egohygiene.io/intelligence/` overview is not accepted as a consumer
detail destination.

The Node loader rejects non-HTTPS origins, credentials, ports, queries, fragments,
IP/local/reserved hosts, encoded/traversing paths, unknown surfaces and ambiguous
duplicates. One malformed selected publication leaves that repository's
destination unavailable without removing the rest of the fleet. Missing inputs
or an invalid catalog checksum keep fleet source evidence visible and publication
destinations unavailable. Raw input hashes, paths, hidden rows and rejected URL
text never enter browser output.

## Connect a reviewed catalog

Configure Node-only variables for the build:

```sh
EGOHYGIENE_INTELLIGENCE_PUBLICATIONS=/review/repository-publications.json
EGOHYGIENE_INTELLIGENCE_PUBLICATIONS_SHA256=FULL_REVIEWED_SHA256
```

The equivalent loader options are `publicationsFilename` and
`publicationsExpectedSha256`. Keep the existing checksum-bound fleet and explicit
`EGOHYGIENE_INTELLIGENCE_AS_OF` selection. Both browser and static builds consume
the same frozen admitted presentation snapshot. No input catalog is connected
by default.

The browser receives only admitted canonical destinations and selected public
publication evidence. Its public input digest includes that selected projection,
not a whole-file hash that could change when hidden or ignored entries change.
A publication source different from the represented fleet revision is disclosed;
the loader never relabels the linked site's source to match the fleet snapshot.
Publication observation/configuration proof does not become a new live-host
verification claim.

Directory titles and primary actions open the consumer's Pages Intelligence.
Declared child routes appear as links below it; GitHub source and immutable
configuration/proof links are secondary. Missing destinations say
“Publication destination unavailable.” The overview keeps its local fleet
snapshot disclosures for aggregate context.

The graph carries an exact allowlist of these admitted absolute consumer route
URLs. Its URL guard permits only those HTTPS routes and bounded Relay-supported
query keys. Record links transfer an explicit stable `entity` identifier to the
consumer renderer. Declared dependency edges use the actual relationship ID on
the consumer whose normalized Dependencies view supplied that edge. Entity
nodes use their own consumer Search/root destination; grouped source entity IDs
are not sent to the relationship-indexed Dependencies renderer. Central directory filters are not forwarded as consumer filters. No custom central fragments are assumed to work in another renderer.

## Existing consumer evidence example

`repository-publications.historical-example.json` records the **October 10,
2026 historical Identity checkpoint**, not a current live canary or automatic
build input. Source inspection at
`55d0339ba5518c7b72154a2aad54a9e5b2bf2fff` confirms:

- `publication/CNAME` declares `identity.egohygiene.io`.
- `.github/workflows/publish-brand-kit.yml` declares canonical
  `https://identity.egohygiene.io/`, uses Relay
  `f19b65b3f8bd8466884dee5529fa77f2430440b6`, and composes into
  `renderer/dist/intelligence` under consumer-owned deployment.
- The canonical publication documentation declares
  `https://identity.egohygiene.io/intelligence/decisions/`.

The linked historical workflow run and observation come from the retained
program evidence. Review a current consumer receipt/configuration and select
its exact source before treating an updated catalog entry as current. This
change does not rewrite that historical rollback or activate a publisher.

## Verification boundary

Only source review, JSON parsing, TypeScript syntax parsing and whitespace checks
were performed here. No source projector execution, build, test, browser, CI,
network canary, deployment or publication ran. Actual custom-domain/project-path,
privacy-invariance, malformed-entry isolation, consumer route/context and served
publication checks remain in the user's deferred verification pass.
