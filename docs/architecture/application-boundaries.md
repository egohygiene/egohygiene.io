# Application boundaries

For the implemented website/store module boundaries and public entry points, see
[dependency rules](dependency-rules.md) and [extension contracts](store-extension-contracts.md).

- `apps/egohygiene.io` owns public product messaging and gateway-ready path metadata.
- `apps/docs` owns contributor and platform documentation.
- `apps/playground` owns shared UI and theme experimentation.

Packages must not depend on applications.
