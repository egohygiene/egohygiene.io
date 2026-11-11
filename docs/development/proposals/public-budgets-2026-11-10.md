# Inactive multi-page regression-budget proposal — 2026-11-10

**Review only. The active qualifier is unchanged and still fails eight findings.**
The [patch](public-budgets-2026-11-10.patch) is not applied by builds or automation.
It is one prepared decision for #115, owned technically by #52/#29. Selecting it
would change regression policy; it is not an optimization or a user-performance
claim, and would require fresh qualification before any acceptance assertion.

Measured clean source `70cc124` emits 45 public pages plus a separate 404 document.
The catalog HTML alone is 42,233 bytes, exceeding the old 20,000-byte ceiling for
**all** documents. Dropping valid pages, chunk splitting or omitting emitted files
would evade the current contract. Existing ceilings were explicitly provisional
local review limits, not agreed user-performance targets.

| Aggregate group | Measured raw / gzip | Active raw / gzip | Proposed raw / gzip |
| --- | ---: | ---: | ---: |
| JavaScript | 582,643 / 163,378 | 500,000 / 150,000 | 675,000 / 190,000 |
| CSS | 63,912 / 12,211 | 60,000 / 12,000 | 74,000 / 14,500 |
| Documents/discovery | 569,389 / 155,548 | 20,000 / 10,000 | 660,000 / 180,000 |
| Images | 391,855 / 387,352 | 500,000 / 500,000 | unchanged |
| Fonts | 46,572 / 46,531 | 60,000 / 50,000 | unchanged |
| Total | 1,654,371 / 765,020 | 1,140,000 / 722,000 | 1,969,000 / 934,500 |

JavaScript/CSS/documents receive roughly 16–19% observed headroom; total is the
sum of the group ceilings, consistent with the original definition. Every file
and both size measures remain counted; image/font limits, secret/private markers,
reference checks, normal/preview separation and HTTP/browser gates stay intact.
Gzip remains level-9 **sum of separately compressed files**, not observed transfer.
Route additions must be explained with the generated route inventory and cost
report; these limits do not establish a 45-route permanent product restriction.

Recommendation: review the multi-page policy once as part of #115 rather than
require compression to make 46 meaningful documents fit a single-page envelope.
Keep a separate optimization task under #52: measure Zod Mini with all existing
live-purchase rejection contracts, and compare one content-only route against an
islands prototype before selecting a rendering migration. The current Zod runtime
also validates live purchase facts; removing it merely to pass a size gate is not
an acceptable shortcut. No runtime/schema changes are made here.

If the proposal is declined, retain the active failure and continue concrete
optimization with the same complete artifact inventory. Neither choice authorizes
publication or changes any product readiness approval. A future user-experience
budget should be based on actual route/network/device measurements under #37/#70,
not on these aggregate disk totals.
