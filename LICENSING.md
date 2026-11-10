# Licensing and asset permissions

## First-party software: decision pending

The root `LICENSE` is empty while `package.json` declares `Apache-2.0`.
The owner has not yet resolved this discrepancy in #59. Do not treat this page
or the inactive proposal patches as a new software or creative-asset grant.

The [#59 evidence and proposals](docs/legal/licensing-59.md) record the exact
history. The initial MIT repository contained only README, LICENSE and gitignore;
it did not contain the current application. The historical notice is retained
as evidence, with its original scope, under `docs/legal/proposals/sources/`.

## Scope and independent terms

Any selected first-party software license is intended for original application
and shared-package code, build/test scripts, configuration and supporting written
developer documentation, to the extent the owner can license those contributions.
The following material keeps its separate provenance and terms; a repository-wide
software identifier does not grant new permission for it:

- Third-party code, fonts and other imported material: preserve the applicable
  [third-party notices](THIRD_PARTY_NOTICES.md), even inside a software directory.
- Brand names, logos, identity sources and icon exports: retain the original
  [identity notice](assets/identity/NOTICE.txt) and provenance. Organization
  identification approval does not itself approve merchandise or wider brand use.
- Artwork/designs, product imagery, review captures and other creative assets:
  use their individual records. [Heartburst](assets/designs/heartburst/README.md)
  is an approved display derivative; garment/print-production approval is separate.
  Do not infer commercial artwork rights from a preview or from software licensing.
- Preserved source archives and research: keep original notices and their recorded
  import/publication scope. The [public store archive](docs/migration/store-retirement/README.md)
  is inactive reference. Private-merch records/masters remain in their private source.
- License texts and historical evidence retained under `docs/legal/`: their
  presence documents alternatives or earlier facts, not adoption of those terms.

The 14 child package manifests are private and currently omit a license field.
No package publication or independent child-package licensing decision is made here.
Before distributing a package or deployable artifact, verify its actual contents
and that applicable notices accompany them. This bounded inventory is not a full
transitive-dependency license report or production-distribution qualification.

## Add or replace material

Follow [contributor provenance requirements](CONTRIBUTING.md#source-and-asset-provenance).
Record public-safe source/revision, exact file hash, original notice, permitted
use evidence and unresolved decisions next to the asset. Keep private masters,
rights documents, customer records and private attachment links out of public Git.
