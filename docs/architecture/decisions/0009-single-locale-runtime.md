# ADR 0009 — One locale registry and the existing translation runtime

- Date: 2026-10-20
- Status: Merged in PR #85 on 2026-10-22; A/B and C review tooling implemented, browser qualification pending.
- Scope: Shared interface messages and website locale selection. Catalog translations
  remain #65/#34; public rendering and canonical metadata remain #22.

## Context

At `8a6258a1011569ac6e531fc124ccb0766f986389`, the website already composes one
`@egohygiene/i18n` provider and nine English message namespaces. Its safe dotted
lookup is implemented and tested (#51). It lacks an explicit locale registry,
source fallback, interpolation/plurals and preference policy. Existing React
consumers and synthetic layout fixtures use the same provider. Root dependencies
list i18next and other candidates, but none owns the active locale runtime.

## Decision

Extend the existing small runtime and retain its provider and `getMessage` API.
Use native `Intl` for locale canonicalization, cardinal plural categories and
formatting. Do not introduce a second runtime, backend, dependency upgrade or
framework change for this checkpoint. `t(key)` remains compatible;
`t(key, parameters)` adds plain-text named interpolation and cardinal plurals.

An explicit registry owns source locale, canonical locale IDs, display labels,
formatting locale, direction and ordered fallback references. Reject malformed
or duplicate IDs, invalid directions, empty labels, missing references, cycles,
source fallbacks and unsupported formatting locales. Locale IDs can describe
engineering fixtures with a separately declared supported formatting locale.
Registered preferences match exact canonical IDs; no implicit region matching or
browser-language detection. The website registers **English only**. Synthetic
languages are test data, not public translation approvals.

Fallback expands declared references in depth-first author order, removes repeats
stably and always ends with the source locale. It excludes the selected locale.
The source has an empty fallback chain. Each dictionary retains its formatting
locale so source-language plural fallback uses source grammar. A missing message
is distinct from an intentional empty string or a translation equal to its key.

Messages use `{{name}}` interpolation with own string/number parameters. Missing
parameters remain visible as tokens. Interpolation returns text; React performs
its normal text escaping. There is no HTML parser or rich-message execution.
An own finite numeric `count` selects `<key>_<cardinal category>`, then
`<key>_other`, then the plain key within each dictionary before trying its next
fallback. Invalid counts fail explicitly; the all-missing result is the key.
Use an explicit separately formatted parameter when the visible number requires
locale formatting. This checkpoint does not claim ICU MessageFormat support.

## Website selection and URL contract

The app owns selection policy; the shared runtime has no router, storage or DOM
state. Pure helpers establish this precedence for checkpoint B's browser adapter:

1. One valid, registered `lang` query value.
2. A valid saved preference under `egohygiene.locale`.
3. The source locale.

Malformed, unknown, empty or repeated `lang` values are ignored, then preference
resolution continues. Storage access and writing are injected callbacks; the
callback must enclose the `window.localStorage` getter too. Read/write rejection
is recoverable. An explicit source choice stays in the URL as `?lang=en`, so a
recipient's saved preference cannot override that shared choice. Setting locale
replaces only `lang`, preserving other filters; the router keeps pathname/hash.

The browser adapter will derive selection from the current router location on
navigation/Back and update the same provider. It will implement the accessible
selector, `html lang`/`dir`, navigation preservation and preference persistence
in checkpoint B, with actual journeys in C. A does not activate those effects.

Canonical product IDs, paths, offer currency, shipping eligibility and provider
URLs never derive from language selection. Existing canonical paths remain the
source representation; do not generate hreflang claims for unreviewed locales.
#22 must decide and verify crawler-visible locale/canonical outputs before real
multilingual publication. This is not approval to prerender or migrate routing.

## Alternatives and consequences

- Adopting i18next now would add migration work without an immediate requirement
  for its backend, plugin or rich-message features. Reconsider if actual reviewed
  locales need grammatical/message features beyond this explicit small contract.
- Copying English into every translated dictionary would conceal missing and
  stale translations. Keep one source dictionary and explicit fallback instead.
- Implicit navigator/region inference could select a language the website has not
  reviewed. Match registered IDs and let the user choose explicitly.
- Removing `lang` for English would make shared source-language URLs depend on
  another visitor's saved preference. Keep explicit choices reproducible.
- The registry checks formatting support in its executing Intl environment;
  broader browser/ICU compatibility still needs qualification. Direct legacy
  provider calls validate locale syntax and retain Intl's normal negotiation.

Existing plain messages and provider calls remain valid. New plural/interpolation
messages require this runtime; rollback restores compatible message content and
runtime together. No catalog schema version, canonical identity or provider
activation rule changes. #64 B/C and #65 authoring/review workflows remain open.

## Evidence and sources

See [checkpoint receipt](../../store/locale-contract-64a.md) for checks and limits.
Native locale/plural behavior follows the [ECMA-402 specification](https://tc39.es/ecma402/2026/)
(`Intl.getCanonicalLocales`, `supportedLocalesOf`, `Intl.PluralRules`). No external
implementation or translation content was copied. This decision reuses the
repository's existing authored runtime and public English dictionaries.

## Checkpoint B implementation refinement — 2026-10-20

B applies the contract through app composition's subscription to the existing data
router, with one browser-facing locale provider around the same translation runtime.
The labelled native selector writes explicit query selection; only that user action
persists a preference. Shared URLs do not silently overwrite a visitor's preference.
Internal locale-aware links preserve selection, and explicit destination languages
win. Absolute/provider destinations remain untouched. Unqualified history entries
re-resolve the current saved preference; only explicit locale URLs are historical
language snapshots. Same-page language changes retain selector focus/disclosure.

Source messages are bundled synchronously. Missing partial dictionaries use source
fallback; missing source configuration is an error. Production registers only
English; preview messages follow the existing compile-time route boundary. See the
[B receipt](../../store/locale-service-64b.md) for implementation and verification
limits, including blocked browser startup. C's browser/message-review work remains.

## Checkpoint C review workflow refinement — 2026-10-20

Validate all source namespaces and explicitly report partial translation fallback.
Reserve plural suffixes and interpolation braces for the runtime's documented
syntax. Require matching placeholder sets and a supported `_other` form for every
authored plural family. Additional locale categories can refer to an existing
source family without inventing English forms.

Bind human review records to deterministic hashes of source and translated text.
Hash source plural families together, so edits invalidate even translations of
categories absent from English. Future production dictionaries require current
records; candidate inventories never generate approval identities or decisions.
Metadata checks cannot establish linguistic quality or reviewer identity. Public
locale activation still requires a separate reviewed registry/resource change.
See the [authoring workflow](../../store/interface-message-workflow.md).

Test catalogs enter through optional app-composition inputs with production
defaults unchanged. Tests use the same router subscription and translation service,
not a second selection implementation. The [C receipt](../../store/locale-review-64c.md)
records passing local message checks and the unresolved actual-browser blocker.
