# Inactive first-party software-license proposals

**Neither patch is applied. Select exactly one only after Alan records the choice
in #59.** These diffs make the decision reviewable; they do not authorize themselves.
The scope statement preserves third-party, creative-asset and archive boundaries.

| Option | Exact changes |
| --- | --- |
| [Apache-2.0](adopt-Apache-2.0.patch) | Fill root LICENSE with canonical Apache-2.0 text; adopt the bounded software scope in LICENSING.md. Current package metadata already agrees. |
| [MIT](adopt-MIT.patch) | Fill root LICENSE with the original MIT notice; change only root package license metadata to MIT; adopt the same bounded software scope. |

[Source text and hashes](sources/README.md) distinguish the initial README-only MIT
snapshot from current application licensing. The Apache option follows current
application metadata; MIT would be an explicit choice for current first-party code.
Original third-party terms remain independent in both cases. Child packages stay
private and unpublished; neither option licenses merchandise or private masters.

After selection, refresh the working tree and check/apply only the selected file:

```sh
git apply --check docs/legal/proposals/adopt-Apache-2.0.patch
# After the recorded owner decision:
git apply docs/legal/proposals/adopt-Apache-2.0.patch
```

For MIT, substitute `adopt-MIT.patch` in both commands. Do not apply both. Recheck
LICENSE bytes, package metadata, the scope statement and notice links; record the
choice in a durable ADR and update #59/current-state/provenance. Update the pending
wording in root README.md, THIRD_PARTY_NOTICES.md and this proposal index to reflect
the selected option and preserve the unselected proposal only as history. These pending-status
patches will intentionally no longer apply once a choice has been adopted.
The full historical Atkinson distribution-license gap and private #32 publication/
preservation obligations require their own evidence/disposition; selecting a software
license does not settle them. Keep #59 open until its acceptance is reconciled.
