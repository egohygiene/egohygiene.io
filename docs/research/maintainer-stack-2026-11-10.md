# A stack that asks less of its maintainer

Research for [#135](https://github.com/egohygiene/egohygiene.io/issues/135),
completed 2026-11-10. Repository baseline `401845a`; this is a recommendation and
an isolated compiler experiment, with no application migration or service setup.

Keep the existing React/Vite static website for this sprint. Put the next effort
into a single content-review packet, repeatable setup, quieter dependency updates
and a TypeScript 7 pilot. These address work Alan and his agents actually repeat.
Astro and a visual content editor deserve small trials when editorial work grows.

## What the project already has

The site already renders 45 meaningful public pages plus a separate 404 document,
uses one validated catalog and public projection, and has working theme/locale,
storefront, Intelligence and browser qualification contracts. The current batch
adds local Storybook manager acceptance and a reproducible attributed cost report.
[Measured baseline and limits](../development/qualification-costs-2026-11-10.md).

The workload has three distinct parts:

- Editorial/creative pages: approved descriptions, artwork derivatives and artist/
  song relationships. Agents can prepare these; Alan approves the public facts.
- Interactive experiences: catalog filtering, locale/theme controls and the
  Intelligence graph. Existing React behavior has substantial regression coverage.
- Operations: locked installs, repeated compiler profiles, local/hosted checks,
  provider qualification and eventual publication. These create recurring work.

The root declares 252 runtime and 141 development dependencies. Many are laboratory
choices and are absent from the production bundle. Their install/update burden is
still worth auditing under #92; deleting deferred capabilities requires their
existing dispositions. Current qualification fails eight size findings, and
hosted dependency review has a separate configuration/access problem.
[Fresh hosted #134 readback](evidence/maintainer-stack-2026-11-10/batch-hosted.json)
confirms CodeQL success, CI failure at eight sizes and skipped browsers, plus
unsupported dependency review at the exact batch head. A new
framework would inherit those unresolved acceptance decisions.

## Current releases, checked rather than assumed

Installed versions come from the qualified workspace; `latest` is the public npm
stable dist-tag observed on 2026-11-10. Tags move. This table is a dated inventory,
not a coordinated upgrade instruction. [Endpoint/version/engine evidence](evidence/maintainer-stack-2026-11-10/registry.json).

| Component | Installed | Observed npm latest | Recommended disposition |
| --- | --- | --- | --- |
| React / React DOM | 19.2.8 | 19.3.1 | Review together in a bounded compatible update |
| react-router-dom | 7.18.2 | 7.18.5 | Prefer the v7 patch path first |
| Vite | 8.2.0 | 8.3.7 | Keep Vite 8; qualify the compatible update separately |
| Vitest | 4.1.11 | 5.1.0 | Separate major migration with test/discovery proof |
| Playwright | 1.62.1 | 1.65.0 | Update runner and matching browser binaries together |
| Zod | 4.4.3 | 4.6.7 | Keep all parsing/activation contracts; Mini is a separate trial |
| TypeScript | 5.9.3 | 7.0.2 | Prioritize an isolated native-CLI pilot |
| Storybook | 10.6.2 | 10.6.7 | Update the coordinated Storybook family together |
| Biome | 2.5.9 | 2.6.6 | Qualify separately; preserve pinned contract JSON bytes |
| pnpm | 11.28.5 | 12.18.0 | Separate major/lockfile and policy review |

Node 24 remains LTS; Node 26 is also LTS. Keep this repository's Node 24.21.0 pin
until its own runtime change is selected. [Official release status](https://nodejs.org/en/about/previous-releases).
Vite 8 already integrates Rolldown and Oxc: a large part of the newer build-tool
story is already present here. Its upstream speed claims are not measurements of
this repository. [Vite 8 release](https://vite.dev/blog/announcing-vite8), March 12, 2026.

One version trap matters: npm `react-router` and `@react-router/dev` latest are
8.5.1, while `react-router-dom` latest remains 7.18.5. The unversioned
[router documentation](https://reactrouter.com/how-to/pre-rendering) selects v8.
Use [version-bound v7 guidance](https://reactrouter.com/7.18.5/how-to/pre-rendering)
for the installed family; do not assemble an upgrade by copying mixed-version APIs.

## Ranked changes that reduce repeated work

Effort is a relative planning estimate, not measured delivery time. “Now” means
prepare or implement in its existing issue; no service or schedule was activated
by this research.

| Order | Change | Work it removes | Effort / owner | Decision |
| --- | --- | --- | --- | --- |
| 1 | Generate one public-content review packet from existing templates and catalog IDs | Repeated copy/paste and separate page-by-page questions | Small–medium; #34 / #116 A | Prepare next; Alan's approval stays #116 B |
| 2 | Extend the existing setup/profile commands with a capability receipt and clear remediation | Repeated Node/pnpm/Task/browser/CA diagnosis by each session | Small; #52 | Build on current commands |
| 3 | Pilot the native TypeScript CLI alongside the current compiler API | Waiting across repeated compiler checks | Medium; #52 / #92 | Promising measured trial below |
| 4 | Prepare narrow grouped dependency updates with one open version PR | Reviewing hundreds of unrelated dependency notices | Small–medium; #92 / #29 | Activate after a trustworthy CI baseline |
| 5 | Trial Zod Mini with complete purchase-rejection contracts | Potential shipped validation code and hand-written optimization work | Medium; #52 | Measure; keep only a worthwhile saving |
| 6 | Trial a local visual editor if editing still needs engineering intervention | Routine public copy/form editing | Medium; #116 A, architecture #3 | Optional; qualify one round trip first |
| 7 | Compare one editorial route in Astro versus current rendering/framework mode | Potential future custom rendering maintenance and unnecessary hydration | Medium–large; #22 / #3 | Later prototype; preserve this sprint's implementation |

### A single review packet is the most direct content improvement

Use the [existing content generator and curation workflow](../store/storefront-content-workflow.md)
to prepare public copy, stable IDs, web derivatives, destinations and preview
screenshots together. #34 supplies relationship contracts; #116 A supplies the
page/provider preparation. Alan should review the creative choice and factual
copy once, then agents can populate the approved records and pages consistently.

Keep private masters, unpublished material and private commercial evidence in
their current private sources. Public Git `draft` visibility is not private
storage. The [product-readiness review](../store/product-readiness.md) still owns
rights, exact provider/account/offer eligibility and customer disclosures. A form
or generated page cannot grant those approvals.

### Keep setup and evidence boring

`task setup:store` already checks Node, selects the pinned pnpm and installs the
lock. Extend that path instead of introducing another task runner. An agent-facing
capability receipt should identify available Task/browser/Docker versions and
trust configuration without dumping credentials, then point to the existing
smoke/non-browser/browser profiles. Cache only compatible dependencies/toolchains;
keep fresh application builds and the corruption guards.

Acceptance: a clean checkout has one documented setup route, one fresh smoke
command and an exact failed-capability explanation. Avoid two competing setup
scripts or another dashboard someone must maintain.

### TypeScript 7: an actual small experiment

Microsoft released the native compiler as stable TypeScript 7 on July 8, 2026.
It also documents the missing programmatic compiler API in 7.0 and side-by-side
adoption for tools that need it. [Official announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

I installed 7.0.2 in a temporary directory and ran its CLI against the unchanged
project. Existing dependencies still resolve TypeScript 5.9.3. All four checks
below exited 0 with no diagnostics:

| Unchanged profile | TS 5.9.3 | TS 7.0.2 |
| --- | ---: | ---: |
| Website application | 3.559 s | 0.581 s |
| Node/tooling | 2.641 s | 0.567 s |

[Commands, source and observations](evidence/maintainer-stack-2026-11-10/typescript-comparison.json).
These are single ordered observations on one Linux environment; cache/order can
matter. They are not a benchmark of the full qualification pipeline.

The existing boundary checker imports `typescript` and calls compiler APIs.
Therefore trial a separately named CLI dependency while retaining its API
compiler, then qualify every compiler profile and the boundary checker. Keep the
production pin until that trial passes; rollback removes the candidate CLI and
restores command selection. There is no claimed whole-project speedup yet.

### Dependency updates should arrive as a manageable review

`.github/dependabot.yml` currently exists as an empty file. Prepare one weekly,
low-volume configuration for the existing GitHub service rather than adopting a
second update bot. Start with the React/runtime-type family and Actions, group
compatible updates, cap open version PRs at one, and keep major toolchain changes
separate. Urgent security fixes need their own timely route. GitHub documents
[groups, schedules, limits and cooldown controls](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference).

The current GitHub.com [support table](https://docs.github.com/en/code-security/reference/supply-chain-security/supported-ecosystems-and-repositories)
lists pnpm 11/12 using the `npm` ecosystem; older indexed documentation differs.
A successful generated PR must still prove this exact workspace/lock and frozen,
script-disabled install. Bot support, dependency graph and dependency review are
separate capabilities. Repair the #29 baseline first; automation that repeatedly
opens red PRs increases the operator's work. No automatic merging is recommended
while those failures remain. Rollback disables the version-update configuration
and closes its unmerged trial PRs, preserving security review.

### Zod Mini and React Compiler solve different problems

[Zod Mini](https://zod.dev/packages/mini) uses a functional API that can remove
unused validation implementation. It is available through the existing Zod
package. Upstream example savings do not predict this catalog's saving; converting
schemas adds maintenance work. Keep only after exact valid/invalid parsing,
projection, migration and live-purchase failure contracts match and the measured
normal bundle shrinks. Do not replace runtime validation with a type assertion.
Rollback restores the existing schema imports/definitions together.

[React Compiler 1.0](https://react.dev/blog/2025/10/07/react-compiler-1) is stable
and automates memoization. It is a candidate for a genuinely expensive graph/
filter interaction, with [incremental adoption](https://react.dev/learn/react-compiler/incremental-adoption).
It does not promise a smaller download or fewer operational systems. Profile first;
retain a small opt-in only if interaction measurements improve without hydration,
accessibility or bundle regressions. Removing the opt-in/plugin is the rollback.
This ranks below the measured native-compiler opportunity.

## Rendering and authoring choices

| Option | Potential simplification | Added maintenance / adoption limit | Recommendation |
| --- | --- | --- | --- |
| Current React/Vite static renderer | Reuse 45-page, store, locale and server contracts already working | Custom renderer remains ours | Keep through creative closeout/publication preparation |
| React Router framework prerendering | Maintained route modules, build-time paths and metadata conventions | Route/output/loader migration, `.data` assets and Caddy/qualifier changes | Compare as the smallest future consolidation candidate |
| Astro 7.4.8, npm latest observed | HTML-first editorial pages; explicit interactive islands | New integration plus shared theme/locale/router/state boundaries | One isolated editorial-route prototype |
| Keystatic core 0.6.9, npm latest observed | Local file-backed content forms; optional GitHub collaboration later | Adapter for current JSON relationships/readiness; integration/runtime/auth work | Trial local public content only if the packet is insufficient |
| New hosted CMS/database/auth/cart platform | Could centralize future collaborative/dynamic needs | Another account, data model, policy, billing and recovery path | Defer until a concrete requirement needs it |

Router framework mode supports build-time paths with a static-server deployment;
it does not require choosing a runtime server. Its output conventions still need
explicit compatibility work here. [v7 prerendering](https://reactrouter.com/7.18.5/how-to/pre-rendering).

Astro renders components to HTML by default and hydrates explicitly selected
client islands. That makes it relevant to future writing/creative pages.
[Official islands architecture](https://docs.astro.build/en/concepts/islands/).
A useful comparison would preserve one approved route's content, metadata, URLs,
themes, locale and navigation while measuring requested JS/CSS and maintenance
steps. It must also exercise a catalog and Intelligence route before a migration
can be selected. A lightweight brochure demonstration alone is insufficient.
Rollback keeps the current renderer and deletes the isolated prototype.

Keystatic [local mode](https://keystatic.com/docs/local-mode) writes files locally;
[GitHub mode](https://keystatic.com/docs/github-mode) adds collaboration setup.
A local trial should edit one approved design, produce a clean diff, survive the
existing catalog validator, keep purchase state guarded and emit no admin/private
assets into production. Confirm the current integration works without changing
framework first. Format support is not relationship/rights validation. Rollback
removes the editor integration while retaining accepted canonical content files.
No local or hosted Keystatic installation was made during this research.

## Owner review and the following milestone

Continue agent work on #34 and #116 A. Consolidate Alan's end-of-sprint review in
#115/#116 B: public creative/copy/relationship choices; existing rights/license/
source decisions; the prepared budget-policy and graph-settings checks; genuinely
native-device/AT acceptance. Research introduces no additional account decision
needed for that work.

Actual host choice, DNS, publication/rollback and real product/provider activation
remain milestone 2 (#31/#89/#38/#39/#96/#97). Revalidate provider terms and account
eligibility when those actions are selected. This report does not establish free
service eligibility, a zero-cost checkout business, hosting prices or a launch.
The near-term recommendation adds no subscription; future hosted tiers/costs are
unverified and require a concrete quote/decision at their existing issue.

## Evidence and limits

Technical claims use primary documentation, release posts and dated npm metadata;
recommendation ordering is engineering judgment. Sources and publication/access
dates are in the [source ledger](evidence/maintainer-stack-2026-11-10/sources.json).
Experimental router APIs/server features are not proposed as prerequisites.

The Stripe Directory skill was consulted for external-service evaluation. The
current official CLI 1.55.9 and Directory plugin 0.3.5 installed successfully,
but both hosting and dependency-automation searches exited 1 with an invalid-user-
agent error. No Directory provider results were verified. The report therefore
uses official technical documentation and defers a hosted-provider shortlist,
pricing and account-specific suitability to #89/#38. No signup, provisioning,
payment, remote workflow dispatch or publication occurred. The only executable
trial was an isolated compiler comparison; no tracked dependency, lockfile,
application or workflow was changed by this report.
