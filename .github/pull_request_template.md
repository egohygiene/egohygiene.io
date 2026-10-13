## Problem and change

<!-- Link the issue. Explain the concrete problem and the resulting behavior. -->

## Verification

<!-- Relevant checks and results, including failures, bundle/dependency changes and limits. -->

## Applicable review checks

- [ ] Dependencies follow the [documented boundaries](https://github.com/egohygiene/egohygiene.io/blob/main/docs/architecture/dependency-rules.md); provider/browser effects stay in adapters.
- [ ] New shared UI accepts message content, uses semantic tokens and preserves keyboard, responsive, RTL and reduced-motion behavior.
- [ ] Catalog/schema changes preserve IDs, supported versions, public projection and disabled/eligible purchase states; migrations are explicit when needed.
- [ ] Focused verification covers the changed consumer; remaining work and rollout/rollback needs are stated.

<!-- Mark non-applicable items as such; this is not a gate for unrelated work. -->
