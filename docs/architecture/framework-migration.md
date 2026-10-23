# Framework migration boundary

Hosting the site in the cloud does not require changing its frontend framework.
Choose a new renderer only for an observed need and keep that decision separate
from deployment, provider activation and data-contract changes.

For current-route #91, [ADR 0012](decisions/0012-static-public-route-rendering.md)
selects a bounded React/Vite build-time adapter for checkpoint A review. It is
not implemented yet and does not select a framework-mode migration.

| Transfers with the existing contract | Needs a framework or environment adapter |
| --- | --- |
| Catalog v3 JSON, stable IDs, artwork revisions and associations | Page components, layouts and interaction state |
| Zod schemas, reference validation, public projection and purchase guards | Router registration, navigation, metadata and error UI |
| Store domain selectors, canonical paths and synthetic offer rules | Build-time filesystem discovery and `virtual:store-catalog` integration |
| Provider normalization, after validating its input | Actual HTTP/loading, credentials, caching and cancellation when implemented |
| Approved `/store/` asset paths, artwork derivatives and visual DNA sidecars | Asset-copy rules and host rewrite/redirect configuration |
| Token JSON/CSS and message dictionaries | React theme/i18n providers, storage, media-query effects and locale routing |

Visual DNA in `assets/designs/` remains a separate metadata artifact; it is not
an accepted extra field in the strict catalog. Private masters stay in their
private source location. A new renderer must not broaden public projection.

## Migration review

1. Run the existing Node catalog/domain consumer before porting presentation.
   Preserve public/draft reference validation and disabled purchase cases.
2. Preserve `/store`, detail paths, query parameters and anchors. Keep stable
   IDs independent of slugs. Any published slug change needs an explicit redirect;
   the current app has no automatic redirect registry.
3. Preserve artwork revisions and reviewed variant/route mappings. A changed
   renderer does not approve artwork or a checkout destination.
4. Replace the Vite adapter with a build/server adapter that validates all input
   then calls `toPublicStoreCatalog`. Scan output and source maps using the
   existing public-build fixtures. Never import raw authoring JSON into a client.
5. Carry English dictionaries and the current locale behavior; when additional
   locales exist, preserve their selection, missing-key fallback, formatting and
   direction. #65 owns that broader localization contract.
6. Recheck keyboard interactions, focus, semantic controls, announcements,
   reduced motion, theme preference and supported screen sizes (#64/#70).
7. Test normal and isolated-preview builds. Synthetic provider fixtures must
   remain absent from normal output and purchases remain disabled until the
   existing qualification process approves them.
8. Compare bundles and direct dependencies, then record a deploy/rollback plan
   separately. Keep the previous artifact/configuration available for rollback.

The current catalog version is `3`, as recorded in
[ADR 0011](decisions/0011-reviewed-product-readiness.md), in the readiness draft
inherited by this checkpoint. Earlier v1 wording was stale; this correction does
not introduce a migration or imply that the draft is merged. Preserve the current
contract for a renderer-only change. If a data contract really changes, record the new version,
write an explicit migration with old/new fixtures, and restore compatible code
and data together on rollback. Package API publication (#18), Holon work (#20)
and SSR/SEO (#22) remain independent decisions.
