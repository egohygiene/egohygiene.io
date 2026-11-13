# Intelligence graph browser repair

The retained organization review artifact exposed two graph interaction faults
in producer `3672c05323b348edba8720998e735668c5d4a3a9`:

- A first pointer click focused an SVG destination link. Its focus handler
  selected the node and recentered the camera before pointer release, so the
  browser stayed on the graph instead of following the declared link.
- A long node label gave the native selector an intrinsic width larger than a
  mobile viewport. The actual retained hub expanded a 390px document to 651px.

The repair at `6753eb1b731746d27e6f8c94466c721313196344` preserves native link
activation: only keyboard-visible focus selects/recenters the node. Pointer
and touch focus leave the link's position unchanged during activation. The
graph's selector explicitly permits a zero minimum inline size and fills its
available width. Node IDs, links, public admission, route context, graph data,
rendering inputs, contracts and producer inventory are unchanged.

## Executed regression

The isolated test host imports the actual graph component, router integration
and CSS with two explicitly synthetic nodes. It serves only that local fixture
at `/.github/`; no report, model, store page or provider is selected. Run it with
the repository's pinned Node runtime and locked dependencies:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium pnpm test:intelligence:graph
```

Omit the executable selector when the matching Playwright Chromium is installed
in its ordinary location. The command records source/dirty state, runtime and
browser versions, screenshots and results under `test-results/intelligence-graph/`.
These qualification files are not production/export inputs.

Clean functional source `6753eb1` passed all three journeys using Node 24.21.0
and Chromium 151.0.7922.173:

1. The first pointer click opens the declared Audits URL and finding anchor.
2. Keyboard Tab still selects/recenters the graph node, and Enter opens it.
3. A 390px mobile layout with a deliberately long node label stays bounded,
   and the first touch activation opens the destination.

The same actual-browser regression was run against exact original source as
negative controls. Replacing only the TSX with `3672c05` reproduces the first
click failure, leaving `?graph=entity-synthetic-finding` instead of navigating.
Replacing only the CSS with the original reproduces a 598px synthetic mobile
layout viewport. Restoring both fixed files passes all three checks. No tests
were weakened to accept selection in place of navigation or horizontal overflow.

The [bounded receipt](reviews/intelligence-graph-browser/verification.json)
records these observations. No dependency or runtime upgrade was introduced.
This focused fixture validates the production component; it is not a full
website build, physical-device, screen-reader or publication certification.

## Retained artifact and next export

The historical 46-file review archive, its manifest/receipts and all 43 producer
site files remain byte-identical. Separate Chromium replay inspected the actual
retained hub, Audits and unavailable Sanity pages. All 39 route/alias targets,
keyboard fallback, real finding anchor/title, hydrated filtering, no-JavaScript
content and original partial/historical clocks were preserved with no page,
console or resource failures. It used local resources at the declared origin
through explicit browser routing; it does not prove live HTTPS or deployment.

That historical replay still has the old graph faults. It also observed a
separate small Audits layout overflow (390px to 402px); this component repair
does not claim that unrelated endpoint layout is fixed. Core and Sanity remain
unavailable, and the one positive historical audit is not a whole-organization
assessment or human ratification.

A new source-bound export must include this repair. The existing sealed
exporter and intake then verify the new artifact; the publisher records its
own actual deployment/live-byte/recovery evidence. Never patch the old ZIP or
retime its report/model observations. Actual canonical HTTPS checks and the
future organization sweep remain separate evidence.

Decision-impact disposition: **ADR not required**. This is a bounded browser
interaction/layout correction within the existing graph and proposed
[portable export](../architecture/decisions/0017-portable-intelligence-export.md)
and [static rendering](../architecture/decisions/0012-static-public-route-rendering.md)
boundaries. It changes no owner, schema, authority, publisher or lifecycle.
