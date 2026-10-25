# Product readiness and customer disclosures — #38 / bounded #9

Date: 2026-10-22 UTC. Alan selected this preparation slice after the ordered
#83/#85/#86 merges. Real product setup follows the final engineering pass on his
machine. This checkpoint does not complete real activation or the wider #9 program.

[Draft #87](https://github.com/egohygiene/egohygiene.io/pull/87), branch
`feat/store-readiness-38`, targets main `07d25941ceeefa53089afa025b612c6aa54f36c4`.
Implementation **`902be39761f00d73e82ea08d55ff98bc05d8e7c5`**, tree
`64a3b39b231e66b4ea427be4a720e09fc573de9d`, exactly matches the locally staged
source. Builds ran at the clean published source; this subsequent evidence commit
changes documentation only. No merge was authorized or performed.

## Delivered

- Catalog v3 requires current reviewed readiness for live products. The existing
  canonical product/variant/artwork/route checks remain. The new snapshot also
  binds variant labels, artwork image sources, optional displayed price and
  shipping/returns/support URLs. Publication and runtime purchase actions validate
  all records before emitting a link. Unreviewed staging routes remain inert.
- A strict assessment records the selected Fourthwall catalog channel, production
  funded from sales without a merchant advance or required subscription, rights
  and template review, public reviewer/date and public-safe evidence IDs. Neither
  metadata nor tests establish those facts for a real product. Dates are provenance;
  currentness here means exact bindings, not clock expiry or remote fact freshness.
- Explicit adjacent v2→v3 migration rejects legacy live offers pending deliberate
  withdrawal/requalification. Historical v1→v2 remains available. No automatic
  approval, silent loss of offer mappings or in-place input rewrite occurs.
  All ten production entries equal the explicit migration of retained main data.
- `/store/help`, footer/product links and reviewed customer disclosure links reuse
  existing UI and locale services. Privacy/terms remain visibly provisional.
  Website GitHub feedback is public and explicitly separate from order support.
- Existing handoff/localization fixtures now carry fictional test-only reviews.
  Authored browser selectors distinguish checkout from policy/help links. The
  normal artifact scanner checks the new synthetic evidence/support markers.

[ADR 0011](../architecture/decisions/0011-reviewed-product-readiness.md) records
the contract/migration rationale. [Product readiness](product-readiness.md) owns
the onboarding checklist; [catalog authoring](catalog-authoring.md#schema-changes)
documents commands and rollback. No dependency/framework/lockfile, private artwork,
public artwork bytes, provider placeholder, curation selection or real purchase
state changed. The actual route list stays empty and English stays the only public
locale. Heartburst is still a display approval, not a garment approval.

## Local evidence and limits

[Command records](reviews/product-readiness-38/checks.json),
[normal artifacts](reviews/product-readiness-38/artifacts.json),
[isolated catalog build](reviews/product-readiness-38/catalog-build.json).
Runtime: Node 24.21.0, pnpm 11.28.5; unchanged pinned dependencies.

| Check | Result |
| --- | --- |
| `pnpm catalog:test` | 138 passed, including readiness, migrations, full validation/projection and existing catalog contracts |
| Focused Vitest store/preview-contract/help/footer consumers | 74 passed in 15 files; simulated DOM, no browser navigation or provider request |
| App, store tooling, DOM-free domain, schemas and browser type profiles | All five passed; store tooling profile rechecked after authored journey selector edits |
| Locale and portable dependency checks | 406 English messages / 10 namespaces; 16 portable modules passed |
| Normal `pnpm build` | Passed; ten catalog entries, one real image file and curation validated |
| Existing isolated Fourthwall/artist preview build | Passed; development artifact only |
| Catalog localization `--build-only` | Passed using actual router/providers/pages; **zero browser journeys executed** |
| Normal artifact scan | 16 files, 12 local asset references, zero findings; synthetic readiness markers absent; approved Heartburst bytes match |

Normal artifact aggregate: **959,716 raw / 582,378 level-9 gzip bytes**. JS:
466,448 / 136,151. Existing provisional ceilings pass; they are not measured
network performance or approved production budgets. The isolated artifacts must
not be deployed.

Independent review found a direct-helper product/route identity gap and browser
selector expectations affected by the new links. Both were corrected before source
publication, with focused regression evidence. An intermediate localization fixture
failure exposed a saved price snapshot/routes-file mismatch; the same shared fixture
now saves its matching route. Final checks above supersede those intermediate runs.
Existing Node module-type and Vite native-loader notices remain, without suppression.

**Deferred as requested:** Chromium execution, screenshots, broad lint/testing,
unrelated refactoring and CI repair remain final #37 with #29/#52/#49/#70. No actual
keyboard/touch/browser zoom/screen-reader/physical-device or hosted deployment
qualification is claimed here. Type-checked journey definitions and simulated DOM
tests are not browser passes. The website still has no real variant chooser/cart
transfer; unchanged IDs do not prove selected-variant arrival at checkout.

## Hosted status and next action

[Hosted status record](reviews/product-readiness-38/hosted-status.json).
At source revision, automatic [dependency review](https://github.com/egohygiene/egohygiene.io/actions/runs/39823530314)
and [CodeQL](https://github.com/egohygiene/egohygiene.io/actions/runs/39823530310)
failed. [CI](https://github.com/egohygiene/egohygiene.io/actions/runs/39823529875)
also failed at the receipt refresh. No cause was re-diagnosed here,
workflow manually dispatched, gate reduced or setting changed. Existing hosted
failures remain final engineering work; local passes do not make hosted CI green.
Refresh the actual PR head before acting on status.

#38 stays open for the actual product, rights/template/account/channel facts,
support/policy destinations, offer publication and unpaid handoff verification.
Paid samples and received physical quality need their own evidence and budget.
#9 stays open for the broader organization program, applicable controls, canonical
content/site profile and Holon/Relay work, accessibility feedback and deployment
verification. No provider request, product/language activation, payment, deployment
or spending occurred.

Next: review/sync on this draft, then select #22's bounded current-route public
HTML/metadata/canonical/sitemap slice. Final #37 follows on Alan's machine, wrapping
existing commands in Taskfile conveniences, before real-product setup. #22 and
new Taskfile wrappers were not started here.
