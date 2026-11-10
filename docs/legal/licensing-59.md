# Licensing and public asset provenance — #59

Recorded 2026-10-25 (America/New_York). Input main after authorized #104 merge:
`89fc70440f9c3cf32d37a6da83c7a2b969efa97d`, tree
`341afdcbccdd352ac018dbf57aa8e5a7abc9249a`, identical to reviewed #104 head
`9ee3c160b5d583b459296333685b1cb8c29c3b55`. #56 is integrated; its local evidence
remains source-bound. Pre-merge validate 40258147958/dependency 40258147955 failed;
no gate changed. #53 browser acceptance and #73/#90/#100 gaps remain separate.

## A — Evidence and scope

Two independent audits cover tracked source declarations, directly vendored code,
public binaries and retained review assets. [Code/research inventory](reviews/licensing-59/code-inventory.json)
and [asset inventory](reviews/licensing-59/asset-inventory.json) preserve source
revisions, blob IDs, byte counts, hashes, evidence and unknowns. No private repo,
artwork master, attachment, business record or private inventory was fetched.
This is not an exhaustive legal audit of every installed dependency or a claim
that a generated bundle satisfies every distribution obligation.

| Material | Observed evidence | Disposition |
| --- | --- | --- |
| First-party website software | Root LICENSE empty; root metadata Apache-2.0; 14 private child manifests omit license | Owner choice needed before active alignment |
| Initial repository license | MIT at `5e3fd943e63a741834d02aff70da7ec06b93b090`; only README/LICENSE/gitignore existed | Preserve exact historical notice; do not label later application code historically MIT |
| Bootstrap | `872f8a866ed7b23451d2ff1f92bde6546630268f` emptied LICENSE and introduced Apache metadata | Declaration is evidence; no explicit current licensing rationale found |
| MSW worker | Exact npm 2.15.0 bytes, tarball integrity and upstream revision verified | Restore its complete independent MIT notice without editing generated worker |
| Atkinson WOFFs | Version 1.002 embedded custom terms; both blobs equal pinned Astro template | Preserve exact terms and provenance; do not relabel as current OFL; full historical distribution-license retrieval remains unverified |
| Identity | 16 files match pinned source/export records; original Relay MIT notice already retained | Existing organization identification scope remains; no wider brand/merch permission inferred |
| Heartburst | Display derivative matches its recorded hash; private masters excluded | Display approval remains distinct from garment/print/broader licensing approval |
| Other assets | 36 review captures and 4 inline SVG source files inventoried | Review evidence/UI examples; no independent merchandise or artwork grant inferred |
| Public `egohygiene/store` | Inactive preserved bundle plus original MIT notice | #100 owns remaining wiki/platform/cutover/retirement obligations |
| Private `incomprisllc/merch` | Existing public #32 ledger only; adaptation/attachment backup/retirement unverified | Keep source private; #31 coordinates unresolved launch/preservation work; #59 owns permission/publication review |

The 55 binary assets comprise 16 identity files, 2 fonts, 1 Heartburst derivative and
36 review captures. Current CSS does not reference Atkinson, but public copies are
still build artifacts. Source identity does not establish the original download
route or substitute another project's software license for the font's own terms.

## Closed #32 does not mean private migration is complete

The [historical ledger](../migration/store-v1-consolidation.md) records private
research/three attachments and incomplete B/C work. #32 remains closed as historical
tracking; no private source is reopened, imported, archived or deleted here.
Public-store preservation #100 is a different repository and does not satisfy
those obligations. Keep unfinished private preservation/adaptation/retirement
visible under overall launch coordinator #31, with publication/rights review #59.
Do not publish raw private attachment links or imply the old ledger is a new audit.

## B — Notice/proposal implementation

A was saved in [draft #105](https://github.com/egohygiene/egohygiene.io/pull/105) at
`90a1a69cc42dcd8bdb2730e7b0dc2af691bd110c` before B. The following are now prepared:

- [MSW notice](../../public/mockServiceWorker.LICENSE.txt), copied byte-for-byte
  from the verified package license; generated worker remains unchanged.
- [Font notice](../../apps/egohygiene.io/public/fonts/NOTICE.txt) with exact embedded
  terms and [asset-local provenance](../../assets/fonts/atkinson/provenance.json).
  Full historical distribution-license evidence remains unresolved.
- [Licensing status/scope](../../LICENSING.md), [independent notice index](../../THIRD_PARTY_NOTICES.md)
  and [contributor guidance](../../CONTRIBUTING.md#source-and-asset-provenance).
- [Two inactive, mutually exclusive proposal patches](proposals/README.md), exact
  historical MIT text and canonical Apache-2.0 text. Neither is an active grant.

Live #31/#32/#59 tracker receipts now retain the private migration obligations.
This records an explicit incomplete-work disposition; it does not approve the
unperformed private migration or alter #32's closed state.

### Saved A implementation plan (historical)


Restore source-backed third-party notices and public provenance/contributor
instructions. Preserve active root LICENSE and metadata until the owner chooses.
Prepare two inactive, mutually exclusive patches: Apache-2.0 matching current
application metadata, or MIT using the original notice text with metadata aligned.
Both must preserve independent third-party terms and keep artwork, brand, fonts,
review captures and archived sources outside a blanket software-license inference.
No package publication or new creative rights grant follows from either proposal.

The exact MIT initial notice and official Apache-2.0 text can be retained as review
sources. Applying a proposal is a separate step after selection. This fulfills
the issue's requirement to prepare a reviewable diff before asking for a missing
licensing decision. Unselected patches must never be applied together.

## C — Bounded verification delivered; final alignment open

Checked published B `e366e07b078070f805fd70d8036950ac81bd336e`, tree
`755e2b224e73ccb81c8ab6115c1d99a8c13c5d2e`, using Node 24.21.0/pnpm 11.28.5.
[Machine-readable receipt](reviews/licensing-59/verification.json) links the exact
asset, proposal and artifact results.

- All 55 binary assets and four inline SVG source files still match their recorded
  sizes, SHA-256 and Git blobs; exact font metadata/notice terms, local target paths
  and changed JSON pass. Local links were checked for file existence; external URL
  availability and all heading fragments are not certified by that check.
- Both patches apply successfully in isolated temporary repositories and produce
  the exact source license text. MIT changes only the package license field;
  Apache leaves metadata alone. Independent scope text is unchanged. Applying both
  is rejected. Active root LICENSE is still empty, package metadata unchanged.
- `pnpm build` passes, validates 10 catalog entries/one image and generates 26
  pages, 10 sitemap entries and the noindex 404. All 44 previous artifact files
  are byte-identical; only `fonts/NOTICE.txt` is added and matches its source.
  The root MSW worker and adjacent notice are absent from this website artifact;
  future worker copying/distribution must retain its complete notice.
- The artifact qualifier still exits 1 with the same three size categories:
  documents 319972 raw/86924 independently gzipped bytes; total 1289603 raw bytes.
  New font notice adds 2357 raw/1335 gzip bytes. No ceiling was raised.
- Source-head hosted validate run 40260560022 and dependency-review 40260560048
  failed. No gate changed. Notice/docs-only work did not rerun unit/types/browser
  suites; prior results are not relabeled as this source's runtime qualification.

### Remaining before #59 completion

1. Alan chooses Apache-2.0 or MIT, then apply exactly that patch, record the durable
   decision, align current-status/contributor references and recheck active metadata.
2. Obtain authoritative full historical Atkinson distribution-license evidence,
   or record a reviewed alternative disposition. Preserving embedded text alone
   does not establish complete redistribution readiness.
3. Confirm the private #32 unfinished-work disposition under #31/#59 with the
   maintainer. No migration/attachment backup/private retirement is claimed here.

The audit inventory and safe notices/proposals are delivered; these remaining
acceptance items keep #59 and draft #105 open. No new software license, merchandise
approval, source archive retirement, provider activation or deployment occurred.

### Saved verification plan and constraints


Check all inventory hashes/declared provenance, exact notice bytes, links/JSON,
proposal applicability and the actual files each patch changes. Build affected
static outputs to verify notices travel with copied public assets. No runtime
feature, catalog data, purchase flag, font/image bytes or dependency version needs
to change. Keep existing budget/hosted failures and deferred Chromium explicit.

B's first-party selection and C final metadata/LICENSE alignment stay open until
Alan selects the software license. The full old-font distribution-license gap and
private-merch obligations remain explicit; classification is not legal clearance.
No invented security contact, private grant, rightsholder or historical approval.
Next after #59 is resolved/synced: #92 bounded cleanup/compatible-upgrade sweep.

## Primary references

- [Apache-2.0 canonical terms](https://www.apache.org/licenses/LICENSE-2.0.txt)
- [OSI MIT text](https://opensource.org/license/mit)
- Source-pinned MSW/Astro/identity references and original asset records are in
  the adjacent inventories. Font embedded text is recorded from exact binaries;
  inaccessible historical URLs and mirrors are distinguished from verification.
