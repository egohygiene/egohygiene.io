# First additional catalog language: authoring and review

This is the #65 C workflow for a future real language. English remains the only
public locale. The [shared integration fixture](../../tests/catalog-localization/fixture.ts)
uses fictional records and synthetic review metadata to exercise the contract;
it is neither reviewed translation nor a product approval. The
[catalog contract](../architecture/decisions/0010-versioned-catalog-localization.md)
and [interface-message workflow](interface-message-workflow.md) remain the owners
of their respective review records.

## Prepare the source and candidate

Choose the target language with the maintainer before translating. Record its
canonical locale ID, direction, label, formatting locale and intentional fallback
languages. Catalog selection uses the ID; number and price presentation uses the
formatting locale. There is no implicit `fr-CA` → `fr` relationship: a regional
fallback must be declared in the existing website registry. Prototype candidate
registration in a test host while public registration remains unchanged.

Review the source entries first. Keep each product, design and collection under
its existing ID and slug. Record which fields need translation and which creative
names should deliberately remain in the source language. A translated description
does not require a translated collection, song, artist or design title. Related
entries have their own fields and reviews; translating a product does not translate
its artwork or collection automatically.

Add candidate fields to the same canonical record with `review.status: "draft"`.
The following property is a **synthetic draft example** for either a product or
collection; it is not approval of French copy. Its source description is
`Fictional collection for a local test.` and its source locale is `en`:

```json
{
  "translations": [
    {
      "locale": "fr",
      "fields": {
        "description": {
          "value": "Collection fictive pour un test local.",
          "review": { "status": "draft" }
        }
      }
    }
  ]
}
```

Omitting `title` deliberately preserves the creative name. Do not duplicate the
entry or translate its ID, slug, references, provider destination, variant mapping,
artwork asset path or currency. Keep unreviewed private material outside public
Git: a draft field or draft entry is excluded from the public build, but its source
file is still public repository content.

| Field | Authoring and review requirement |
| --- | --- |
| `title`, `description` | Product, collection, design or context copy; review meaning in its actual page and relationship context. Omit intentionally untranslated names. |
| `artworkAlt` | Image design only. Describe the existing public image and bind the review to its source alt text and `artworkRevision`. Translation approval is not artwork or print approval. |
| `artworkLabel` | Placeholder design only. Bind its source label and `artworkRevision`; do not use it to promise a finished image. |
| `unavailableReason` | Unavailable product only, with matching source reason. Keep the actual purchase state unchanged. |
| `variantLabels` | Existing live-product variants only. Each label identifies the canonical `variantId`; its review binds the same ID and source label. Provider variant IDs stay unchanged. |

Only the applicable fields belong on an entry. Empty translation records, duplicate
locale/variant records and fields without matching source content fail validation,
including when they are drafts.

## Review, missing fields and source changes

A qualified human reviews meaning, creative-name choices, factual product claims,
image descriptions and mixed-language fallback. After that review, replace a draft
record with a current review binding. For the synthetic description above, the
shape would be:

```json
{
  "value": "Collection fictive pour un test local.",
  "review": {
    "status": "reviewed",
    "locale": "fr",
    "reviewedBy": "synthetic-reviewer",
    "reviewedAt": "2026-10-22",
    "source": {
      "locale": "en",
      "value": "Fictional collection for a local test."
    },
    "value": "Collection fictive pour un test local."
  }
}
```

This is a format example, not a human review. Real records need the actual review
date and an authorized public reviewer identifier. Artwork review sources also
require `artworkRevision`; variant-label review sources also require `variantId`.
Those extra bindings must not appear on unrelated fields. Review metadata and
source snapshots are public data; private contacts, business records, rights
agreements and artwork masters belong in their authorized private source.

Inspect the validated **authoring** catalog before public projection. The public
catalog has already removed draft/stale fields, so it cannot provide their review
inventory. For example, this repository-root Node snippet lists the existing
per-field diagnostics without changing files:

```sh
node --input-type=module <<'JS'
import { loadCatalog } from "./scripts/store-catalog.mts";
import { inspectStoreTranslations } from "./packages/schemas/src/index.ts";

const catalog = await loadCatalog();
for (const entry of catalog.entries) {
  console.log(entry.id, inspectStoreTranslations(entry));
}
JS
```

The inspector reports `reviewed`, `draft` or `stale` for **present** fields only.
An empty list does not mean that an entry is fully translated. Compare it with the
chosen locale and the field list agreed for each entry; explicitly record omitted
fields as intentional source fallback or pending work. The shared C fixture
retains missing, draft and stale cases for repeatable integration checks.

Editing source text, translated text, source/target locale, artwork revision or a
bound variant ID invalidates the affected review. Keep the old binding until a
human reviews the change, then update that field's record with the actual decision.
Alternatively remove the field and record the accepted fallback. Do not refresh
snapshots or dates merely to make a check pass. Staleness is a review result, so a
valid source edit can proceed while its translation falls back.

The renderer resolves each field through the selected locale, its explicit
fallbacks and the entry's source. Source text wins when its language is reached.
Only current reviewed translated fields participate. Search follows resolved
titles/descriptions and original creative-title aliases, not every available
translation. Verify accents, composed/decomposed Unicode and relevant case rules;
the current search retains diacritics and does not promise transliteration.

## First real language checklist

These items are deliberately unchecked. A synthetic fixture or metadata check
cannot sign off a real language.

- [ ] Maintainer selects the target locale and proposed public scope, including
  direction, formatting locale and explicit fallback chain.
- [ ] Source entries and factual merchandise claims are reviewed; original
  creative names and each intentionally missing translation are recorded.
- [ ] Candidate product, collection, design and context fields use the existing
  canonical entries. Artwork alternatives and applicable availability/variant
  labels are reviewed against their current source and revision/ID bindings.
- [ ] A qualified human approves translated fields and mixed-language fallback;
  public-safe review IDs and actual dates are recorded. No draft/stale field is
  treated as approved, and no private evidence enters public Git.
- [ ] Interface messages complete their separate placeholder/plural/source-change
  review. Customer disclosures, support contact instructions and any applicable
  policy text receive appropriate review under #9/#38; catalog translation alone
  does not establish that coverage.
- [ ] Run catalog validation, review diagnostics and focused locale tests. Check
  the normal artifact boundary for unapproved text and test-only records. Preserve
  exact commands/revision and distinguish passed, failed and unrun checks.
- [ ] Under final #37/#49/#70, execute the retained browser journeys and inspect
  long text, mixed-language accessible names, artwork alternatives, keyboard use,
  phone/tablet/desktop layouts, zoom and relevant direction. Simulated DOM checks
  or authored journeys are not browser or assistive-technology acceptance.
- [ ] Verify canonical paths/IDs, localized client metadata inputs and same-product
  navigation. Complete crawler-visible canonical/locale output under #22 before
  claiming public multilingual metadata.
- [ ] Under #38, recheck the selected provider's current language behavior and
  capability limits. Intercept the synthetic handoff to verify the exact approved
  destination and product/variant mapping without contacting a provider or ordering.
- [ ] Propose the separate reviewed registry/resource change and obtain the
  maintainer's publication decision. Retain a compatible rollback revision; no
  automatic language, provider or purchase activation follows from these checks.

Site language, formatting locale, offer currency, shipping eligibility and provider
checkout language are separate. Preserve the declared numeric amount and currency;
do not invent exchange rates or shipping coverage. Do not append a language query
parameter to a provider URL without a separately verified and implemented provider
contract. The existing handoff preserves the approved destination exactly. Browser
language and external checkout/email behavior may differ from the site selection;
the dated provider notes in #65 are research to recheck under #38, not current
end-to-end language qualification.

For this checkpoint, actual Chromium execution, broad testing/lint and CI repairs
remain deferred to final #37 by maintainer instruction. The delivery receipt records
the evidence actually collected; this checklist does not waive those remaining gates.
