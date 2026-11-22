#!/usr/bin/env python3
# Copyright 2026 Ego Hygiene
# SPDX-License-Identifier: MIT
"""Project reviewed public navigation independently of organization Core models.

No discovery, HTTP probes, provider mutation, freshness refresh or model synthesis
occurs here. Historical source declarations and publication records keep their
own clocks. The website owns rendering and consumes a pinned projection.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "egohygiene.repository-dashboard-directory/v1"
BASE = "ed2fd5d200cbb1b0e35b0efec2dcb817bac40ec2"
INVENTORY_PATH = "docs/intelligence/repositories.source.json"
INVENTORY_SHA256 = "c4e41df201500c5a00aa7b0e5e30cc4d8054f33eb39c842718266c70530175a9"
OUTPUT_PATH = "docs/intelligence/repository-directory.json"
REVISION = re.compile(r"[a-f0-9]{40}")
SHA256 = re.compile(r"[a-f0-9]{64}")
NAME = re.compile(r"egohygiene/(?:[a-z0-9][a-z0-9._-]*|\.github)")
SCOPE = {"kind": "fixed-reviewed-public-roster", "organization_total_claim": False,
         "model_evidence": False, "current_availability_checked": False}
EVIDENCE = {
    "organization": ("docs/reviews/2026-11-13-organization-live-publication.json",
                     "0098b29cae9a1325ee61485878c903cda2aa18bee8142cd005f3eee2c23afc65"),
    "empathy": ("docs/reviews/2026-11-14-foundation-selected-ten.json",
                "3e13c92d2cf39eaa0593d9e96677835e8a442050ecd2b0d47f6915c88704ab5c"),
}


def require(value, message="Repository directory admission denied"):
    if not value:
        raise ValueError(message)


def closed(value, keys):
    require(type(value) is dict and set(value) == set(keys))


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def document(raw):
    def unique(items):
        value = {}
        for key, item in items:
            require(key not in value, "Duplicate JSON member")
            value[key] = item
        return value
    return json.loads(raw.decode("utf-8", errors="strict"), object_pairs_hook=unique,
                      parse_constant=lambda _: require(False))


def read(relative, expected_sha256):
    path = ROOT / relative
    require(not any(item.is_symlink() for item in (path, *path.parents)))
    require(path.is_file() and 0 < path.stat().st_size <= 262144)
    raw = path.read_bytes()
    require(digest(raw) == expected_sha256, "Reviewed source digest differs")
    return document(raw)


def instant(value):
    require(type(value) is str and re.fullmatch(
        r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z", value))
    require(datetime.fromisoformat(value.replace("Z", "+00:00")).tzinfo == timezone.utc)


def safe_url(value, *, github=False):
    """Accept canonical public HTTPS destinations, without aliases or credentials."""
    require(type(value) is str and 0 < len(value) <= 2048)
    require(re.fullmatch(r"https://[a-z0-9.-]+/[A-Za-z0-9._~/-]*", value))
    url = urlsplit(value)
    require(not url.username and not url.password and url.port is None)
    require(not url.query and not url.fragment and ".." not in url.path.split("/"))
    if github:
        require(url.hostname == "github.com" and url.path.startswith("/egohygiene/"))
    else:
        require(url.hostname in {"egohygiene.io", "egohygiene.github.io"}
                or re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*\.egohygiene\.io", url.hostname))
    return value


def source_reference(path, sha256, observed_at):
    return {"repository": "egohygiene/.github", "revision": BASE, "path": path,
            "sha256": sha256, "observed_at": observed_at}


def publication_records():
    """Adapt only the two reviewed receipts, without probing or promoting models."""
    path, sha = EVIDENCE["organization"]
    packet = read(path, sha)
    require(packet["schema"] == "egohygiene.github.organization-live-evidence/v1alpha1")
    published = packet["theme_refresh"]["actual_publication"]
    receipt = published["hosted_receipt"]
    require(published["conclusion"] == "success")
    require(receipt["consumer_revision"] == published["source_revision"])
    require(receipt["run_id"] == str(published["run_id"])
            and receipt["run_attempt"] == str(published["run_attempt"]))
    require(receipt["target"] == packet["target"] == {
        "origin": "https://egohygiene.github.io", "base_path": "/.github/"})
    organization = {
        "url": "https://egohygiene.github.io/.github/intelligence/",
        "observed_at": receipt["verified_at"], "source_revision": published["source_revision"],
        "run_id": published["run_id"], "run_attempt": published["run_attempt"],
        "evidence": source_reference(path, sha, receipt["verified_at"]),
    }
    path, sha = EVIDENCE["empathy"]
    packet = read(path, sha)
    current = packet["current"]
    published = current["fresh_current"]
    browser = current["canonical_browser"]
    require(published["conclusion"] == published["all_four_jobs"] == "success")
    require(browser["consumer_source"] == current["source_commit"]
            and browser["current_run"] == {"id": published["run"], "attempt": published["attempt"]})
    require(browser["failed_checks"] == [])
    manifest = published["manifest_sha256"]
    require(browser["expected_manifest_sha256"] == manifest and SHA256.fullmatch(manifest))
    require(all(browser[key]["status"] == 200 and browser[key]["sha256"] == manifest
                for key in ("identity_before", "identity_after")))
    # This is the packet observation clock, not an invented live verification time.
    empathy = {
        "url": "https://egohygiene.github.io/empathy/intelligence/",
        "observed_at": packet["observed_at"], "source_revision": current["source_commit"],
        "run_id": published["run"], "run_attempt": published["attempt"],
        "evidence": source_reference(path, sha, packet["observed_at"]),
    }
    return {"egohygiene/.github": organization, "egohygiene/empathy": empathy}


def declared_dashboard(row):
    """A source-declared route is useful navigation; it is not publication proof."""
    if row["repository_intelligence"]["state"] != "pages-composition-source-declared":
        return None
    pages = row["declared_pages"]
    origin, base = pages["origin"], pages["base_path"]
    if not origin:
        return None
    if base:
        return safe_url(origin + base + "intelligence/")
    if "/intelligence/" in pages.get("required_routes", []):
        return safe_url(origin + "/intelligence/")
    return None


def recorded_publication(name, record):
    return {"state": "recorded", "observed_at": record["observed_at"],
        "source_revision": record["source_revision"],
        "run_url": f"https://github.com/{name}/actions/runs/{record['run_id']}",
        "run_attempt": record["run_attempt"], "evidence": record["evidence"]}


def build():
    inventory = read(INVENTORY_PATH, INVENTORY_SHA256)
    require(inventory["schema"] == "egohygiene.organization-home-repository-source-inventory/v1"
            and inventory["organization"] == "egohygiene" and inventory["visibility"] == "public")
    records = publication_records()
    entries = []
    for row in inventory["repositories"]:
        require(row["visibility"] == "public")
        name = row["repo"]
        recorded = records.get(name)
        declared = declared_dashboard(row)
        publication = {"state": "unknown", "observed_at": None, "source_revision": None,
                       "run_url": None, "run_attempt": None, "evidence": None}
        url = declared
        if recorded:
            url = recorded["url"]
            publication = recorded_publication(name, recorded)
        entries.append({"repository": name, "repository_id": row["repository_id"],
            "repository_url": row["source_urls"]["repository"],
            "source_observation": {"revision": row["source_commit"],
                "observed_at": row["observed_at"], "state": row["repository_intelligence"]["state"]},
            "dashboard": {"url": url, "link_state": "publication-recorded" if recorded else
                "source-declared" if declared else "unknown", "publication": publication}})
    scope = inventory["scope"]
    result = {"schema": SCHEMA, "scope": SCOPE.copy(),
        "catalog": {"repository": scope["source_repository"], "revision": scope["source_revision"],
            "path": scope["source_path"], "sha256": scope["source_sha256"],
            "observed_at": scope["catalog_observed_at"]},
        "source_inventory": source_reference(INVENTORY_PATH, INVENTORY_SHA256, inventory["observed_at"]),
        "entries": sorted(entries, key=lambda row: row["repository"])}
    validate(result)
    require(set(records) <= {row["repository"] for row in entries})
    return result


def validate(value):
    closed(value, ("schema", "scope", "catalog", "source_inventory", "entries"))
    require(value["schema"] == SCHEMA and value["scope"] == SCOPE)
    for key in ("catalog", "source_inventory"):
        source = value[key]
        closed(source, ("repository", "revision", "path", "sha256", "observed_at"))
        require(NAME.fullmatch(source["repository"]) and REVISION.fullmatch(source["revision"])
                and SHA256.fullmatch(source["sha256"]))
        require(source["path"] in {"catalog/public-repositories.json", INVENTORY_PATH})
        instant(source["observed_at"])
    require(type(value["entries"]) is list and 0 < len(value["entries"]) <= 1000)
    inventory = read(INVENTORY_PATH, INVENTORY_SHA256)
    scope = inventory["scope"]
    require(value["catalog"] == {"repository": scope["source_repository"],
        "revision": scope["source_revision"], "path": scope["source_path"],
        "sha256": scope["source_sha256"], "observed_at": scope["catalog_observed_at"]})
    require(value["source_inventory"] == source_reference(
        INVENTORY_PATH, INVENTORY_SHA256, inventory["observed_at"]))
    admitted = {row["repo"]: row for row in inventory["repositories"] if row["visibility"] == "public"}
    records = publication_records()
    names, ids = set(), set()
    for row in value["entries"]:
        closed(row, ("repository", "repository_id", "repository_url", "source_observation", "dashboard"))
        name = row["repository"]
        require(type(name) is str and NAME.fullmatch(name) and name not in names)
        require(name in admitted)
        source_row = admitted[name]
        require(type(row["repository_id"]) is int and row["repository_id"] > 0
                and row["repository_id"] not in ids and row["repository_id"] == source_row["repository_id"])
        names.add(name)
        ids.add(row["repository_id"])
        require(safe_url(row["repository_url"], github=True) == f"https://github.com/{name}")
        source = row["source_observation"]
        closed(source, ("revision", "observed_at", "state"))
        require(REVISION.fullmatch(source["revision"]))
        instant(source["observed_at"])
        require(source["state"] in {"pages-composition-source-declared", "artifact-or-preview-source-declared",
                                     "not-declared-in-inspected-source"})
        require(source == {"revision": source_row["source_commit"], "observed_at": source_row["observed_at"],
                           "state": source_row["repository_intelligence"]["state"]})
        dashboard = row["dashboard"]
        closed(dashboard, ("url", "link_state", "publication"))
        require(dashboard["link_state"] in {"publication-recorded", "source-declared", "unknown"})
        record = records.get(name)
        declared = declared_dashboard(source_row)
        require(dashboard["link_state"] == ("publication-recorded" if record else
                "source-declared" if declared else "unknown"))
        require(dashboard["url"] == (record["url"] if record else declared))
        if dashboard["link_state"] == "unknown":
            require(dashboard["url"] is None)
        else:
            safe_url(dashboard["url"])
        publication = dashboard["publication"]
        closed(publication, ("state", "observed_at", "source_revision", "run_url", "run_attempt", "evidence"))
        if dashboard["link_state"] != "publication-recorded":
            require(publication == {"state": "unknown", "observed_at": None, "source_revision": None,
                "run_url": None, "run_attempt": None, "evidence": None})
        else:
            require(record is not None and publication == recorded_publication(name, record))
            require(publication["state"] == "recorded" and REVISION.fullmatch(publication["source_revision"]))
            instant(publication["observed_at"])
            require(type(publication["run_attempt"]) is int and publication["run_attempt"] > 0)
            safe_url(publication["run_url"], github=True)
            require(re.fullmatch(rf"https://github\.com/{re.escape(name)}/actions/runs/[1-9][0-9]*",
                                 publication["run_url"]))
            evidence = publication["evidence"]
            closed(evidence, ("repository", "revision", "path", "sha256", "observed_at"))
            require(evidence["repository"] == "egohygiene/.github"
                    and REVISION.fullmatch(evidence["revision"]) and SHA256.fullmatch(evidence["sha256"]))
            require(evidence["path"] in {item[0] for item in EVIDENCE.values()})
            instant(evidence["observed_at"])
            require(evidence["observed_at"] == publication["observed_at"])
    require([row["repository"] for row in value["entries"]] == sorted(names))
    require(names == set(admitted))


def encoded(value):
    return (json.dumps(value, ensure_ascii=False, allow_nan=False, indent=2) + "\n").encode("utf-8")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Require the committed exact projection")
    args = parser.parse_args()
    try:
        expected = encoded(build())
        if args.check:
            require((ROOT / OUTPUT_PATH).read_bytes() == expected, "Repository directory projection differs")
        else:
            (ROOT / OUTPUT_PATH).write_bytes(expected)
    except (OSError, ValueError, KeyError, TypeError, OverflowError) as error:
        print(f"Repository directory rejected: {error}", file=sys.stderr)
        return 1
    print(f"Repository directory {'verified' if args.check else 'projected'}: {digest(expected)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
