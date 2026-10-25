#!/usr/bin/env python3
"""Verify preserved store records and restore Git objects without running the app."""

import argparse
import gzip
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile


def require(condition, message):
    if not condition:
        raise ValueError(message)


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        require(key not in result, f"Duplicate JSON key: {key}")
        result[key] = value
    return result


def read_json(content):
    return json.loads(content, object_pairs_hook=unique_object)


def verify(archive):
    archive = archive.resolve(strict=True)
    manifest = read_json((archive / "manifest.json").read_bytes())
    require(type(manifest["schemaVersion"]) is int and manifest["schemaVersion"] == 1, "Unsupported manifest schema")
    required = {"store-source.bundle", "github-records.json.gz", "LICENSE-MIT.txt", "issues.md"}
    require(required <= manifest["artifacts"].keys(), "Missing required artifact checksums")
    for name, expected in manifest["artifacts"].items():
        path = archive / name
        require(Path(name).name == name and not path.is_symlink(), f"Invalid artifact path: {name}")
        content = path.read_bytes()
        require(len(content) == expected["bytes"], f"Artifact size differs: {name}")
        require(hashlib.sha256(content).hexdigest() == expected["sha256"], f"Artifact hash differs: {name}")
    records = read_json(gzip.decompress((archive / "github-records.json.gz").read_bytes()))
    require(type(records["schemaVersion"]) is int and records["schemaVersion"] == 1, "Unsupported GitHub records schema")
    for name in ("records", "pullRequests", "conversationComments", "reviewActivity", "inlineReviewComments", "releases"):
        require(isinstance(records[name], list), f"Expected records list: {name}")
    summaries = records["records"]
    require(all(item["kind"] in ("issue", "pull-request") and item["state"] in ("open", "closed") for item in summaries), "Invalid record kind/state")
    require(len({item["number"] for item in summaries}) == len(summaries), "Duplicate record numbers")
    issues = [item for item in summaries if item["kind"] == "issue"]
    pulls = [item for item in summaries if item["kind"] == "pull-request"]
    pull_states = {item["number"]: item["state"] for item in records["pullRequests"]}
    require(len(pull_states) == len(records["pullRequests"]), "Duplicate pull request details")
    require(pull_states == {item["number"]: item["state"] for item in pulls}, "Pull request details differ from summaries")
    counts = {
        "records": len(summaries), "issues": len(issues), "pullRequests": len(pulls),
        "openIssues": sum(item["state"] == "open" for item in issues),
        "openPullRequests": sum(item["state"] == "open" for item in pulls),
        "conversationComments": len(records["conversationComments"]),
        "combinedReviewActivity": len(records["reviewActivity"]),
        "inlineReviewComments": len(records["inlineReviewComments"]),
        "releases": len(records["releases"]),
    }
    require(counts == manifest["githubRecordCounts"], "GitHub record counts differ")
    for value in [manifest["sourceMain"], manifest["sourceMainTree"], *manifest["refs"].values()]:
        require(re.fullmatch(r"[0-9a-f]{40}", value), "Invalid Git object identifier")
    environment = {key: value for key, value in os.environ.items() if not key.startswith("GIT_")}
    environment.update({"GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull,
                        "GIT_ALLOW_PROTOCOL": "file", "GIT_TERMINAL_PROMPT": "0",
                        "GIT_NO_REPLACE_OBJECTS": "1"})
    with tempfile.TemporaryDirectory(prefix="store-recovery-") as temporary:
        temporary = Path(temporary)
        hooks = temporary / "disabled-hooks"
        hooks.mkdir()

        def git(*arguments, directory=temporary):
            command = ["git", "--no-pager", "-c", f"core.hooksPath={hooks}",
                       "-c", "gc.auto=0", "-c", "protocol.allow=never",
                       "-c", "protocol.file.allow=always", *map(str, arguments)]
            result = subprocess.run(command, cwd=directory, env=environment, capture_output=True, check=False)
            error = result.stderr.decode(errors="replace")[:2000]
            require(result.returncode == 0, f"Git command failed ({arguments[0]}): {error}")
            return result.stdout

        verification = temporary / "verification.git"
        git("init", "--bare", "--quiet", "--template=", verification)
        bundle = archive / "store-source.bundle"
        git("bundle", "verify", bundle, directory=verification)
        restored = temporary / "restored.git"
        git("clone", "--mirror", "--quiet", "--template=", "--", bundle, restored)
        git("fsck", "--full", directory=restored)
        refs = dict(line.split(" ", 1) for line in git("for-each-ref", "--format=%(refname) %(objectname)", directory=restored).decode().splitlines())
        require(refs == manifest["refs"], "Restored Git refs differ")
        commits = int(git("rev-list", "--all", "--count", directory=restored))
        require(commits == manifest["commitCount"], "Restored commit count differs")
        source = manifest["sourceMain"]
        tree = git("rev-parse", f"{source}^{{tree}}", directory=restored).decode().strip()
        require(tree == manifest["sourceMainTree"], "Source main tree differs")
        expected_files = {item["path"]: item for item in manifest["sourceMainFiles"]}
        require(len(expected_files) == len(manifest["sourceMainFiles"]), "Duplicate source file paths")
        observed = {}
        for entry in git("ls-tree", "-r", "-z", "--full-tree", source, directory=restored).split(b"\0"):
            if not entry:
                continue
            metadata, raw_path = entry.split(b"\t", 1)
            mode, kind, identifier = metadata.decode().split(" ")
            path = raw_path.decode()
            require(kind == "blob", f"Unexpected Git entry type: {path}")
            content = git("cat-file", "blob", identifier, directory=restored)
            observed[path] = {"path": path, "mode": mode, "gitBlob": identifier,
                              "bytes": len(content), "sha256": hashlib.sha256(content).hexdigest()}
            if path == "LICENSE":
                require(content == (archive / "LICENSE-MIT.txt").read_bytes(), "Original MIT license bytes differ")
        require("LICENSE" in observed, "Original source LICENSE missing")
        require(observed == expected_files, "Restored source file manifest differs")
    return {"result": "pass", "sourceMain": source, "refs": len(refs),
            "commits": commits, "sourceFiles": len(observed), "githubRecordCounts": counts,
            "artifacts": len(manifest["artifacts"]), "applicationExecuted": False,
            "networkUsed": False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive-directory", type=Path, default=Path(__file__).resolve().parent)
    arguments = parser.parse_args()
    try:
        print(json.dumps(verify(arguments.archive_directory), indent=2))
    except (OSError, EOFError, ValueError, KeyError, TypeError, subprocess.SubprocessError) as error:
        print(json.dumps({"result": "fail", "error": str(error)}), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
