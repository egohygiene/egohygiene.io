# Schema agents

Inherits [root instructions](../../AGENTS.md). The runtime schemas own the data
contract; infer TypeScript types from them instead of maintaining a second model.

- Keep this package independent of apps, React, browser/Node APIs and provider SDKs.
  Export supported entry points from `src/index.ts` and the package manifest.
- Preserve catalog IDs, references, artwork revisions and public/draft guards.
  The public projection must validate before filtering; invalid drafts still fail.
- Live purchase configuration requires the existing reviewed route, product,
  variant and artwork-revision checks. A disabled provider placeholder or mock
  handoff is not a live approval.
- Compatible additions need old fixtures to keep parsing. Breaking changes need
  an explicit version/migration and compatible code/data rollback. See
  [authoring compatibility](../../docs/store/catalog-authoring.md#schema-changes).
- Run focused contract/consumer checks and the applicable type/public-build
  checks when behavior changes. Update provenance and the owning ADR when a
  durable contract changes; do not bump versions just to suppress validation.
