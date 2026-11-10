# Mock storefront sprint closeout — 2026-11-09

Finish the bounded mock storefront, close evidence-backed foundation issues, and
give Alan one review session followed by one creative/page-draft session at the
end. Publication is a separate later milestone. This is a scheduling and issue
roadmap; it does not deliver the implementation described below.

## Live allocation and finish line

| Tracker | Current purpose |
| --- | --- |
| [#84](https://github.com/egohygiene/egohygiene.io/issues/84) | Overall roadmap across both milestones |
| [Milestone 1](https://github.com/egohygiene/egohygiene.io/milestone/1), parent [#88](https://github.com/egohygiene/egohygiene.io/issues/88) | Mock engineering closeout, consolidated owner review and first-product page drafts |
| [#115](https://github.com/egohygiene/egohygiene.io/issues/115) | Single inbox for owner decisions, genuinely manual checks and PR review |
| [#116](https://github.com/egohygiene/egohygiene.io/issues/116) | Creation-ready website/provider page packet, then one reviewed pilot draft |
| [Milestone 2 — Publication](https://github.com/egohygiene/egohygiene.io/milestone/2), parent [#31](https://github.com/egohygiene/egohygiene.io/issues/31) | Host/release setup, observed production preview, real-product qualification and publication |

The live inventory before this planning update was 62 open issues: 22 foundation,
six product/launch, and 34 outside either milestone. Adding #115/#116 makes 24
open foundation issues and 64 open issues overall. Eleven previously closed
foundation issues retain their history. #115/#116 are native children of #88.
Milestone 2 is reused and renamed for publication; a duplicate milestone is not
needed.

The sprint is complete when every required foundation criterion is supported by
evidence and any required integration/owner decision is finished, the bounded
manual session is recorded, and one reviewed pilot website draft and provider
draft or creation-ready private packet are handed off. An unresolved blocker
keeps its originating issue open. Neither a review packet nor a list of gaps
makes #37/#88 fully qualified.

## Execution order

| Wave | Existing owners | Work before asking Alan to review | Exit |
| --- | --- | --- | --- |
| 0 — Reconcile delivered work | #51, #75, #61, #69 | Audit each criterion against merged implementation, paired-repository acceptance where required, receipts and focused checks; repair only actual gaps | Evidence-backed closure or a precise remaining task, without a new feature sweep |
| 1A — Synthetic contracts | #34 | Save A ownership/identity/projection specification, B minimal versioned contracts/adapters, C synthetic verification; reconcile existing private proposals before extension | Stable identity and public/private boundaries demonstrated without choosing a real product |
| 1B — Reliability | #92 → #52 → #29 → #57 | Finish actual cleanup/profile/CI/serving gaps on the existing draft stack; investigate output anomalies and budgets, then exercise available native/container tools | Fresh reproducible artifacts and honest local/hosted/container receipts; unresolved failures stay open |
| 2 — Browser and acceptance | #70; #36/#49/#50/#53/#60/#64/#65/#91 | Execute existing browser suites, fix observed defects and reuse one bounded route/viewport/input matrix across affected issues | Actual browser evidence and issue-by-issue acceptance; genuinely unavailable/manual checks collected once in #115 |
| 3 — Integrated closeout packet | #37, coordinated by #88 | Run the integrated available profiles at exact compatible heads and assemble the closure matrix, review diffs and short manual instructions | One review-ready packet, with current failures and owner questions explicit |
| 4 — Alan's review session | #115; source owners #59/#90/#70/#37 | Choose the prepared license/contact/copy dispositions, perform native/manual checks, review the ordered PRs; agent applies decisions and rechecks affected source | Recorded decisions, required manual results and verified follow-up changes |
| 5 — Alan's creative/page session | #116 | Choose one pilot and review prepared website/provider drafts; agent performs mechanical content/configuration work | Reviewed unpublished drafts/creation packet and a precise handoff to #31/#38/#39 |
| Later — Publication | #31/#89/#96/#97/#38/#39, linked #21 | Execute the separate environment/host, preview, product and publication sequence | Actual deployed and provider evidence, with release actions separately selected |

Wave 0, schema specification and independent reliability investigation may proceed
without waiting for a software-license or creative choice. Preserve the existing
stack within the repository and pin compatible contracts across repositories.
Save A/specification, B/implementation and C/verification checkpoints per batch.
Routine checkpoints are reviewable drafts, not repeated requests for Alan to stop
his creative work. If an owner decision genuinely blocks one task, record it in
#115 and continue independent work.

This task creates the roadmap only. A later implementation session uses the
ordered issues and their actual remaining criteria.

## Closure priorities: reuse the evidence already delivered

Twelve issues are reconciliation candidates, not twelve promised closures.

| Priority | Issues | Check before closing |
| --- | --- | --- |
| First | #51 | Complete-path own-key string/fallback behavior, prototype/group/missing-key regressions and safe React rendering |
| First | #75 | Existing ownership decision, both repositories' accepted/integrated records and preserved source dispositions; no repository retirement is required by this ownership decision |
| First | #61 | Leading-option/alternative comparison and ADR, runnable synthetic collection-to-provider flow, localization/dependency/rollback assessment; a preview link alone is insufficient |
| First | #69 | Actual dependency boundaries, documented extension seams and runnable public-contract examples/consumer checks; close missing specifics before declaring the architecture contract finished |
| After Wave 2 | #36 | Mock collection/design/product/gallery journeys, coexistence of standalone/shared/song-linked content, metadata and disabled purchase states |
| After Wave 2 | #49, #53 | Actual focus/contrast/motion and Storybook/standalone rendering, including same-document story switching |
| After Wave 2 | #50, #60 | Actual docs rendering and local ecosystem links with keyboard/direct-route/reload behavior |
| After Wave 2 | #64, #65 | Actual locale/fallback, expanded-text/RTL, catalog presentation and review-staleness behavior; no real translation catalog is required |
| After Wave 2 | #91 | Useful normal-route HTML/metadata/canonical/sitemap and intended-server behavior; respect remaining budget/hosted criteria |

#34/#92/#52/#29/#57/#70 close as their engineering criteria and required
verification complete. #59/#90 require the owner decisions collected in #115;
#37 requires final integrated acceptance. #88 closes last. Original criteria and
scope-transfer obligations remain with their existing owners. Do not close an
issue merely because a PR merged, another issue links to it, or a checkbox is old.

## Bounded schema work under #34

Keep the existing website catalog v3, runtime-derived types, explicit migrations,
readiness and public-projection guards. Reconcile the private creative catalog,
production packs, artist projection/review contracts and the business ontology
proposal before adding a boundary. The ontology's canonical adoption/package home
remains undecided. A full ontology adoption, real aggregate migration and all-song
ingestion are outside this sprint.

A defines fact ownership, stable work/recording/design/product identities and the
reviewed private-to-existing-website-key crosswalk. B adds only demonstrated
versioned reference/projection/publication-contract gaps. C proves standalone,
shared and song-linked designs/products; recording-to-work mismatch rejection;
stable identities through renames/reordering; invalid/duplicate references;
private-field exclusion; changed approval bindings; stale/withdrawn observations;
and prepared/approved versus observed/unknown publication.

Products reference designs; artwork files are not merchandise. Artist affiliation
does not imply ownership. Domain details stay with their authority. Reference
existing readiness and offer evidence instead of creating a second editable
price/inventory source. Private masters, crosswalk values, business facts and
approval receipts stay private; use synthetic fixtures in public tests. If private
access is missing, record the exact contract-access blocker and continue safe
website fixtures without claiming cross-repository compatibility.

## One end-of-sprint owner inbox

#115 owns coordination; #37 supplies the evidence packet. Each item must contain
a proposed diff or concrete options, its evidence and consequence before it is
presented to Alan.

1. #59: choose one prepared software-license alternative; resolve historical-font
   evidence/disposition and the separately retained private consolidation gaps.
   Agent applies and verifies only the selected choice.
2. #90/#9: approve factual story/contact/accessibility-feedback/policy copy or
   record a precise prepublication obligation. Do not infer contact details.
3. #70/#37/#57/#52: execute genuinely manual or unavailable native checks,
   including physical devices, native zoom, assistive technology and any
   outstanding Mac/Apple Silicon/Docker/Task/native Storybook acceptance.
4. Review #105 → #106 → #107 → #108 → #109 and subsequent focused drafts using
   refreshed heads/checks. Prepare any proposed stale #73 supersession. A review
   does not itself merge a PR.
5. Use #116 for the final pilot, associations, display derivatives and copy.
   Optional #100 retention/retirement discussion remains outside the sprint;
   deferring it does not require deleting or retiring the source repository.

The worker executes available browser/container checks first. Only remaining
human work is batched for Alan. Unsupported coverage stays explicit and can
still prevent the originating issue from closing; it is never an inferred pass.

## One creative and page-creation packet

Treat "page creation" as both website content and provider listing drafts.
#116 prepares a route/copy/asset matrix and one pilot worksheet in advance.

Reuse the existing landing, collection, artist, design and product pages. Keep
`/` as the landing page; `/store` primarily Ego Hygiene with curated Incompris;
`/store/incompris` as its creative collection; and
`/store/incompris/artists/play` with standalone/world-inspired and song-linked
views. Roughly 400 songs must not become 400 main-shop requirements.

Alan picks one physical pilot product and approves intended copy, associations,
public derivatives, gallery ordering and curation at the end. The agent can then
fill the existing schema/configuration, validate and render the local draft.
Review the existing Help/About/Accessibility/Store help/Privacy/Terms drafts
through #90/#115 instead of building replacement page infrastructure.

If an account supports a genuinely unpublished, access-controlled provider draft,
its creation/review is a later selected owner action in this batch. If saving
would publish or activate commerce, hand off the completed private entry
worksheet to #38/#39 for milestone 2. Record only public-safe status in this
repository; neither a public-repository draft flag nor a provider preview is
proof of privacy or approval.

Heartburst remains approved artwork preview only. Fictional products stay
non-purchasable; providers stay disabled. A displayed derivative is not a
merchandise rights approval. Normal output excludes isolated preview fixture
IDs/routes, and input validation occurs before visibility filtering.

## Separate publication milestone

Reuse [milestone 2](https://github.com/egohygiene/egohygiene.io/milestone/2),
now named **Publication — first real product and launch**, preserving the six
existing issues and their history.

1. #21 + #89 A: choose the bounded environment/host path and current no-paid-plan
   constraints. #21 remains a broader linked issue outside the milestone.
2. #96: repeatable local/dev/staging/production commands, artifact identity,
   promotion and rollback; #97: accessible construction mode with purchasing
   disabled. Implement after the environment contract, reusing #52/#57.
3. #89 B/C: actual authorized construction-preview publication and observed
   origin, routes/assets/raw HTML, DNS/HTTPS and rollback.
4. #38: approve and qualify one actual product/provider, rights, variant/price/
   region/customer information and hosted handoff using the prepared page packet.
5. #39: separately selected product publication and observed SoundCloud-to-product
   journey. A live purchase or sample and physical quality are separate evidence.

Page preparation may happen before host execution. Production preview precedes
actual commerce and does not require activating an offer. Real Fourthwall checkout
hands off to the mapped provider product page for options, payment and fulfillment.

No merge, deployment, account/DNS change, software-license choice, ontology
adoption, source retirement, private-master import, provider activation or spending
is performed by this planning update. Broader #9/#18/#22/#100, optional experience
expansion and #110–#114 remain outside the finite sprint; their existing obligations
are preserved.

## Evidence snapshot and next implementation step

Live issue/milestone/PR metadata was refreshed on 2026-11-09. Main remains
`89fc70440f9c3cf32d37a6da83c7a2b969efa97d`. The unmerged draft stack is:

| PR | Ref | Observed head |
| --- | --- | --- |
| #105 | docs/licensing-provenance-59 | `2b9ebe5d3aba4f7cccb277252d15a48325ff205d` |
| #106 | refactor/bounded-sweep-92 | `c5935ae45d582af19a4175db1f1e05168393e0f6` |
| #107 | fix/local-profiles-52 | `3d44df671069300e13324fb3f17e3762986e7892` |
| #108 | fix/ci-current-29 | `4faaebeb50b4202e8aaf9ee0012db0f836939f79` |
| #109 | fix/local-static-serving-57 | `8717b54d7fd64b6ef5895b163fb01fc840ffc437` |

The [#109 receipt](../development/static-serving-57.md) and
[overnight handoff](../context/overnight-2026-10-26.md) contain dated runtime evidence,
not fresh tests from this planning task: 101 tooling/388 native Caddy checks and
45 unchanged artifacts, with Docker/browser/platform gaps, three artifact budgets,
unresolved output contamination and hosted dependency-review limitations retained.
No application, browser, container or hosted qualification suite was rerun here.

For implementation, start Wave 0's acceptance audit and #34 A on the compatible
draft tip; continue the concrete #52/#29/#57 reliability gaps, then #70/#37.
Prepare #115/#116 continuously, and reserve Alan's required actions for the end.
