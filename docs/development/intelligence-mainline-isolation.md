# Intelligence-only mainline integration

Prepared 2026-11-09 on `codex/intelligence-site-mainline`, directly from live
website main `89fc70440f9c3cf32d37a6da83c7a2b969efa97d`.
The user authorized merging the Intelligence campaign; that does not select
unrelated software licensing, store, dependency, CI or Docker changes.

## Included source

This replacement replays only the Intelligence host, shared foundation,
endpoint implementations, aggregate integration/privacy/anchor corrections and
consumer-publication linking from drafts #118–#126. Each replayed commit records
its original full source commit in Git. The runtime Intelligence features,
projectors, input contracts and privacy admission match original #126 head
`28849c13cf04d9e8acb3996b0e442129adb29cb3`, with one corrected metadata import.

The central site remains a public fleet overview. Its directory, Now evidence
and graph open explicit consumer-owned repository Pages Intelligence destinations
when the optional reviewed catalog provides them. Source GitHub links remain
secondary. Shared detailed repository rendering is owned by Relay; its source
candidate is `49046d88ef6fe2e31e9a9f443a61157b598efb78` from
[Relay #167](https://github.com/egohygiene/relay/pull/167).
The existing central domain pages remain optional fleet exploration. No fleet
artifact or publication catalog is connected by default.

The original #126 branch remains intact. Its actual ancestry also included
unmerged #105–#109 (licensing/notices, store/Storybook, local profiles, CI and
Docker/static-serving work), and #117's unrelated sprint-closeout plan. None of
those commits or their documentation, policy, dependency/lockfile, product,
test, workflow or Docker changes enters this replacement.
Original slice #120–#124 heads were cherry-picked into the aggregate, not merged
as ancestors. Replaying their implementation does not make the original PRs
merged; retain or explicitly supersede them rather than claim that status.

## Main compatibility resolution

The source replay encountered formatting/context conflicts in Vite configuration,
the normal build adapter, static output, router and server rendering. Resolutions
keep main's existing implementation and add only Intelligence composition,
route identity/filename handling and one frozen admitted input shared by client
and server rendering. Public build identity includes the admitted Intelligence
digest. No unrelated store behavior is imported.

Original Caddy patches depended on the unmerged #109 server. This replacement
instead adds exactly the nineteen Intelligence overview/domain canonical paths
and seventy-six explicit redirects before main's existing fallback. Canonical
Intelligence pages rewrite to their generated HTML and use `file_server` without
automatic canonical redirects. Health and every other request retain main's
existing response/fallback behavior. Docker inputs and server environment,
broader 404/method/MIME policy and unrelated routes are unchanged.

Independent source review found an unresolved shared-frame import:
`components/PageMetadata` has no module/barrel on main or original #126. The
replacement points to `components/PageMetadata/PageMetadata`, matching the
actual file. Source review found no further concrete mainline integration
blocker. Historical current-state/provenance notes from other campaigns were
not concatenated; this scoped checkpoint precedes main's existing history.

## Checks and remaining evidence

Only static source/peer, syntax, file-import, JSON and whitespace inspection is
in scope. Parser-only inspection passed for thirty-six TypeScript/TSX/MTS
sources and eight JSON files; relative static imports resolve to actual files,
and `git diff --check` passed. A source diff against the exact main SHA above
shows no change to store/content, dependency/lockfile, workflow, license,
Docker, AGENTS, Taskfile or test paths. Tests, typechecks, builds,
browser/Caddy execution, application or
source-adapter execution, CI investigation and publication remain deferred by
the user. No qualification or live acceptance is inferred from this replay.
The original route/source/privacy boundaries and explicit missing-evidence
states remain subject to that deferred verification pass.

At this source checkpoint the isolated replacement is local: no original branch,
remote ref, PR state or main branch has been changed. Root coordinates whether
to retain #126's original head under a backup and replace its review head or to
create a replacement PR and explicitly supersede #126. Original unrelated
drafts remain untouched in either case.

Refs [site #27](https://github.com/egohygiene/egohygiene.io/issues/27) and
[organization #41](https://github.com/egohygiene/.github/issues/41).
