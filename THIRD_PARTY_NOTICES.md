# Third-party and preserved-source notices

These notices accompany directly copied code, public assets and preserved source
in this repository. Their terms remain independent of the unresolved first-party
website software license. This index does not grant rights to artwork, brands,
merchandise or private records, and is not an exhaustive dependency license audit.
Installed dependencies retain their own licenses; a future distributed bundle
still needs review against the dependencies and assets it actually contains.

| Material | Notice and provenance | Scope |
| --- | --- | --- |
| Mock Service Worker 2.15.0 | [Complete MIT notice](public/mockServiceWorker.LICENSE.txt); [pinned upstream license](https://github.com/mswjs/msw/blob/49d9d47f613b072f8d20e1a025feaee7c5382b2b/LICENSE.md) | Applies to the generated, unmodified [worker](public/mockServiceWorker.js). Retain the complete notice with copies of the worker. |
| Atkinson Hyperlegible version 1.002 WOFF files | [Embedded terms and provenance](apps/egohygiene.io/public/fonts/NOTICE.txt); [asset inventory](docs/legal/reviews/licensing-59/asset-inventory.json) | These older files contain custom embedded terms. Do not substitute a current OFL license; retrieval of the complete historical distribution license remains unresolved. |
| Ego Hygiene identity source and icon exports | [Source notice](assets/identity/NOTICE.txt); exported notices for [website](apps/egohygiene.io/public/icons/NOTICE.txt), [docs](apps/docs/public/icons/NOTICE.txt) and [playground](apps/playground/public/icons/NOTICE.txt) | Preserve the original Relay source MIT notice and recorded export provenance. Existing use identifies the organization's own website; no additional brand or merchandise permission is inferred. |
| Preserved `egohygiene/store` source | [Original MIT notice](docs/migration/store-retirement/LICENSE-MIT.txt); [preservation handoff](docs/migration/store-retirement/README.md) | The inactive source bundle retains its original license. Archiving it here neither adopts it into the website build nor relicenses it under the website's eventual software license. |

The [licensing audit](docs/legal/licensing-59.md) and
[code inventory](docs/legal/reviews/licensing-59/code-inventory.json) record exact
source revisions and verified bytes. The MSW worker matches
`package/lib/mockServiceWorker.js` in the integrity-verified npm `msw@2.15.0`
package. Its root `public` placement does not establish inclusion in the current
website build; include its notice wherever the worker is copied or distributed.

Creative material has separate publication boundaries. Heartburst's recorded
display approval is not garment, print-production or broader artwork permission.
Review screenshots and inline SVG examples do not establish merchandise rights.
Private `incomprisllc/merch` material has not been imported by this notice work;
its historical migration obligations remain distinct from the public store
archive. Consult the audit and source-specific records before copying material
or changing its intended use. Keep private masters and business records out of
this public repository.
