# Interface message authoring and review

This is the #64 checkpoint C workflow for the existing interface-message runtime.
[ADR 0009](../architecture/decisions/0009-single-locale-runtime.md) owns the runtime
contract. Product/catalog translations remain #65/#34. English is the only public
locale; fixture strings and passing checks do not approve a language for publication.

## Add or change an English message

1. Edit the owning JSON namespace in `apps/egohygiene.io/src/i18n/locales/en` and
   the component that consumes its stable dotted key. Every namespace is checked,
   including `fourthwallPreview.json`; that does not change its preview-only bundle
   boundary. New namespaces also need deliberate composition in `resources.ts`.
2. Use nested objects with string leaves. Key segments start with a letter or
   underscore and contain letters, digits, underscores or hyphens; dots separate
   nested levels. Source groups cannot be empty. An intentional empty string or a
   string equal to its key is valid and does not trigger fallback.
3. Use plain-text `{{name}}` interpolation. Whitespace inside tokens is allowed;
   braces are reserved for this syntax. Token names start with a letter or
   underscore, followed by letters, digits or underscores. Do not add HTML or ICU
   expressions. Pass all required parameters at the call site. The runtime leaves
   missing parameters visible; the catalog check validates dictionaries, not every
   possible call-site parameter value.
4. For cardinal plurals, call the base key with a finite numeric `count` and author
   suffixes from `Intl.PluralRules(formatLocale)`: `_zero`, `_one`, `_two`, `_few`,
   `_many`, `_other` as applicable. Every authored family must include `_other`.
   All its forms use the same placeholder names. The runtime tries the selected
   category, `_other`, then a plain base message before source fallback. Keep any
   plain base message deliberate; it handles calls without `count`.
5. Keep `count` numeric for grammar. Pass a separately formatted parameter such as
   `formattedCount` when a visible number needs locale formatting. Do not translate
   catalog IDs, canonical paths, provider URLs, currencies or purchase rules here.
6. Run `node scripts/checks/check-locales.ts` and the relevant component/runtime
   tests. `pnpm check` also invokes this checker. The focused checker regressions
   are included in `pnpm test:tooling`.

To capture the current source inventory without altering it:

```sh
node scripts/checks/check-locales.ts --inventory /tmp/interface-source-inventory.json
```

The JSON lists namespaces, every source key/text, placeholder sets and SHA-256
hashes in deterministic key order. JSON whitespace and object/file ordering do not
change hashes. Message wording does. Every plural form shares a hash of its entire
source family, so changing the English singular invalidates reviews for translated
categories absent from English too. The aggregate source hash provides an inventory
receipt; per-message hashes keep unrelated edits from invalidating all reviews.
This inventory is generated evidence, never human approval.

## Prepare a candidate locale

Keep unreviewed candidate files outside the production locale tree. Use the same
namespace filenames and nested key structure, with only the messages actually
translated. Missing namespaces/messages explicitly use the existing source fallback;
do not copy English strings to conceal missing work. Unknown namespaces or keys,
non-string leaves, malformed tokens and missing/extra placeholder names fail.
Tokens may be reordered or repeated without changing their set.

```sh
node scripts/checks/check-locales.ts \
  --directory /tmp/interface-candidate/fr \
  --locale fr \
  --inventory /tmp/interface-candidate-inventory.json
```

The candidate report lists `sourceFallback` keys/families and
`pluralCategoryFallback` mappings. `pluralBaseFallback` lists deliberate translated
plain bases used for count calls when a source plural family is otherwise absent. A locale may have more or fewer plural categories
than English. Categories supported by its formatting locale are allowed for an
existing source family; omitted categories explicitly use that locale's `_other`.
A whole omitted family uses English grammar through the source dictionary.
An empty candidate dictionary is structurally valid fallback, not translated coverage.

`--format-locale` supports engineering fixtures whose synthetic selection ID needs
separate formatting rules. Real publication must agree with the app registry's
formatting locale. Locale IDs must be canonical. `--source-directory` can point the
checker at an isolated `en` fixture directory; production checks use the default
website path. Keep generated inventory files outside namespace directories, whose
contents must be namespace JSON files only.

## Human review and stale translations

A candidate report without review metadata says `not-reviewed`. Its `reviewInputs`
contains only key, source hash and translation hash. It never supplies a reviewer,
approval status or review date. A qualified human must assess meaning, grammar,
placeholder use, plural forms, context, intentional empty strings and the fallback
coverage. Record that actual decision separately; do not refresh hashes merely to
make a failing review check pass.

A review file uses this structure (the hash labels below are placeholders, so this
example is not a valid approval record):

```json
{
  "version": 1,
  "sourceLocale": "en",
  "locale": "fr",
  "formatLocale": "fr",
  "messages": {
    "landing.designActionLabel": {
      "sourceHash": "SHA-256 from the reviewed source inventory",
      "translationHash": "SHA-256 from the reviewed candidate inventory",
      "status": "approved",
      "reviewedBy": "Public-safe reviewer identifier",
      "reviewedAt": "2026-10-20"
    }
  }
}
```

Each present translated message needs its own record. Run the candidate check with
`--review /path/to/review.json --require-review` before proposing public activation.
Records for removed messages, missing records, invalid dates, changed source text
and changed translated text all fail. When source wording changes, regenerate the
candidate inventory without `--review`, obtain a fresh human review of affected
messages, then update only their records. Alternatively remove the stale translated
message and its record and explicitly accept source fallback until review happens.
New source keys appear in the fallback report; reviewers must assess that coverage.

Future reviewed production dictionaries belong at
`apps/egohygiene.io/src/i18n/locales/<locale>/*.json`, with their records at
`apps/egohygiene.io/src/i18n/reviews/<locale>.json`. The default checker automatically
discovers these locale directories and requires current review records, so later
source edits cannot silently preserve stale translation approval. Production
formatting currently defaults to the locale ID in this filesystem check; supporting
a different real formatting locale requires deliberately wiring that policy here
and in app composition together. Engineering candidates can use the explicit flag.

Passing metadata checks proves the record matches the files; it cannot prove a
reviewer's identity or linguistic quality. The PR must make the review accountable.
Keep private reviewer/business information outside this public repository. Only
then propose the separate registry/resource change, browser journeys, direction and
layout checks, and publication decision. #22 still owns crawler-visible locale and
canonical qualification. This checker does not register, bundle, deploy or activate
any locale, provider or purchasing behavior.

## Fixture and verification boundary

The tooling tests create clearly labelled synthetic dictionaries and synthetic
review records in memory or temporary directories. Browser locale fixtures stay in
the existing test host, outside public locale registration. Neither is an approved
translation. The checks cover source discovery, safe key/value shape, tokens,
plural categories/fallback, deterministic hashing, required human metadata and stale
source/translation records. They do not replace visual/keyboard/Back/storage browser
journeys, translator review, hosted CI or production qualification.

The existing `node scripts/qualify-store.mjs` profile includes message-tool types,
these review regressions, the catalog checker and locale-service component tests.
Its final browser step reuses `tests/storefront-qualification/run.mjs`: the 35
layout cases plus 10 locale journeys use the same `AppProviders` router binding as
production. To rerun that bounded browser step directly:

```sh
node tests/storefront-qualification/run.mjs --output-dir test-results/locale-review
```

Use the pinned runtime and a supported local Chromium installation as described in
[local preview](local-preview.md). A failure before the first page is a browser
environment blocker, not passing journey evidence. The current execution status
belongs in the checkpoint receipt; no test fixture or generated review input is
approval for a real public translation.
