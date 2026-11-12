#!/usr/bin/env python3
# Copyright 2026 Ego Hygiene
"""Select retained public model bytes for the existing review-only exporter.

This adapter acquires one existing fleet bundle per module. It never builds a
fleet, normalizes reports, changes model clocks, executes input code or deploys.
Raw captures/checksums remain private staging inputs; final public evidence is
derived from the exporter's admitted presentation, not those transport bytes.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import io
import json
import math
import os
from pathlib import Path
import re
import resource
import stat
import subprocess
import sys
import time
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = "egohygiene.website.organization-intelligence-model-selection/v1"
RECEIPT = "egohygiene.website.organization-intelligence-model-selection-receipt/v1"
VERSION = "1.0.0-alpha.1"
MODULES = ("core", "audits", "sanity")
TARGET = {"origin": "https://egohygiene.github.io", "base_path": "/.github/"}
SHA = re.compile(r"[a-f0-9]{64}")
REVISION = re.compile(r"[a-f0-9]{40}")
MAX_JSON = 1024 * 1024
MAX_FILE = 16 * 1024 * 1024
MAX_ARCHIVE = 64 * 1024 * 1024
MAX_TOTAL = 64 * 1024 * 1024


class SelectionError(ValueError):
    def __init__(self, code="INPUT_INCOMPATIBLE"):
        self.code = code
        super().__init__(code)


def require(value, code="INPUT_INCOMPATIBLE"):
    if not value:
        raise SelectionError(code)


def digest(content):
    return hashlib.sha256(content).hexdigest()


def encoded(value):
    return (json.dumps(value, sort_keys=True, ensure_ascii=False, indent=2,
                       allow_nan=False) + "\n").encode("utf-8")


def document(content, maximum=MAX_JSON):
    require(0 < len(content) <= maximum)
    def pairs(items):
        result = {}
        for key, value in items:
            require(key not in result)
            result[key] = value
        return result
    value = json.loads(content.decode("utf-8", errors="strict"), object_pairs_hook=pairs,
                       parse_constant=lambda _: require(False))
    nodes = 0
    def bounded(item, depth=0):
        nonlocal nodes
        nodes += 1
        require(depth <= 64 and nodes <= 100000)
        if isinstance(item, str):
            require(not any(0xD800 <= ord(character) <= 0xDFFF for character in item))
        elif isinstance(item, list):
            require(len(item) <= 16384)
            for child in item:
                bounded(child, depth + 1)
        elif isinstance(item, dict):
            require(len(item) <= 100000)
            for key, child in item.items():
                require(not any(0xD800 <= ord(character) <= 0xDFFF for character in key))
                bounded(child, depth + 1)
        elif type(item) is float:
            require(math.isfinite(item))
    bounded(value)
    return value


def closed(value, keys):
    require(isinstance(value, dict) and not getattr(value, "duplicate_keys", ()) and set(value) == set(keys))
    return value


def selection_document(content):
    # Preserve ambiguity until visibility/identity admission. Irrelevant hidden
    # members cannot poison other module selections through duplicate keys.
    class ParsedObject(dict):
        def __init__(self, pairs):
            super().__init__()
            self.duplicate_keys = set()
            for key, value in pairs:
                if key in self:
                    self.duplicate_keys.add(key)
                self[key] = value
    return json.loads(content.decode("utf-8", errors="strict"), object_pairs_hook=ParsedObject,
                      parse_constant=lambda _: require(False))


def instant(value, provider=False):
    require(isinstance(value, str))
    pattern = r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?Z" if provider else r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z"
    require(re.fullmatch(pattern, value))
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    require(parsed.tzinfo == timezone.utc)
    return parsed


def local_path(value):
    path = Path(value).absolute()
    require(not any(part.is_symlink() for part in (path, *path.parents)))
    return path


def read(path, maximum=MAX_JSON):
    path = local_path(path)
    require(path.is_file() and 0 < path.stat().st_size <= maximum)
    content = path.read_bytes()
    require(0 < len(content) <= maximum)
    return content


def write(path, content):
    path = local_path(path)
    require(not path.exists())
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    with path.open("xb") as output:
        output.write(content)
    path.chmod(0o600)


def inside(path, parent):
    return path == parent or parent in path.parents


def relative_path(value):
    require(isinstance(value, str) and len(value) <= 240
            and re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._/-]*", value)
            and all(part not in {"", ".", "..", ".git"} for part in value.split("/")))
    return value


def public_names():
    lock = document(read(ROOT / "contracts/organization-intelligence/reviews/input-lock.json"))
    pin = lock["sources"]["catalog"]
    require(pin["repository"] == "egohygiene/hygiene"
            and pin["revision"] == lock["admission"]["revision"])
    raw = read(ROOT / "contracts/organization-intelligence/reviews" / relative_path(pin["file"]))
    require(digest(raw) == pin["sha256"] == lock["admission"]["artifact_sha256"])
    catalog = document(raw)
    require(catalog["schema"] == "egohygiene.repository-public-catalog/v1"
            and catalog["organization"] == "egohygiene")
    return {row["full_name"] for row in catalog["repositories"]
            if type(row) is dict and row.get("visibility") == "public"}


def choice(value, allowed):
    # Admission precedes selectors, hashes, API access and public diagnostics.
    if (not isinstance(value, dict) or getattr(value, "duplicate_keys", set()) & {"visibility", "producer_repository"}
            or value.get("visibility") != "public"
            or value.get("producer_repository") not in allowed):
        return None
    closed(value, {"visibility", "producer_repository", "producer_revision", "workflow_path",
                   "run_id", "run_attempt", "artifact_id", "artifact_name", "archive_sha256",
                   "manifest_sha256", "maximum_age_seconds"})
    require(REVISION.fullmatch(value["producer_revision"]) and SHA.fullmatch(value["archive_sha256"])
            and SHA.fullmatch(value["manifest_sha256"]))
    require(re.fullmatch(r"\.github/workflows/[A-Za-z0-9][A-Za-z0-9._-]*\.ya?ml", value["workflow_path"])
            and re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{0,199}", value["artifact_name"]))
    for key in ("run_id", "run_attempt", "artifact_id"):
        require(type(value[key]) is int and 1 <= value[key] <= 9007199254740991)
    require(value["run_attempt"] <= 1000000 and type(value["maximum_age_seconds"]) is int
            and 1 <= value["maximum_age_seconds"] <= 31536000)
    return value


class Provider:
    def __init__(self, root, captures=None):
        self.root, self.captures = root, captures
        self.deadline = time.monotonic() + 240

    def capture(self, module, endpoint, filename, maximum=MAX_JSON):
        if self.captures is not None:
            return read(self.captures / module / filename, maximum)
        require(time.monotonic() < self.deadline, "INPUT_UNAVAILABLE")
        path = self.root / "transport" / module / filename
        path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        environment = {"PATH": os.environ.get("PATH", ""), "GH_HOST": "github.com",
            "GH_TOKEN": os.environ.get("GH_TOKEN", ""), "GH_PROMPT_DISABLED": "1",
            "GH_CONFIG_DIR": str(self.root / "gh-config"), "GH_PAGER": "cat", "LANG": "C.UTF-8"}
        for key in ("HTTPS_PROXY", "HTTP_PROXY", "ALL_PROXY", "NO_PROXY", "https_proxy", "http_proxy",
                    "all_proxy", "no_proxy", "SSL_CERT_FILE", "SSL_CERT_DIR", "REQUESTS_CA_BUNDLE",
                    "CURL_CA_BUNDLE", "NODE_EXTRA_CA_CERTS"):
            if key in os.environ:
                environment[key] = os.environ[key]
        def limit():
            resource.setrlimit(resource.RLIMIT_FSIZE, (maximum, maximum))
        try:
            with path.open("xb") as output:
                subprocess.run(["gh", "api", "--hostname", "github.com", "--method", "GET", endpoint],
                    stdout=output, stderr=subprocess.DEVNULL, env=environment,
                    timeout=min(90, max(1, self.deadline - time.monotonic())), check=True, preexec_fn=limit)
        except (OSError, subprocess.SubprocessError):
            raise SelectionError("INPUT_UNAVAILABLE") from None
        return read(path, maximum)

    def acquire(self, module, selected, evaluated):
        prefix = "/repos/" + selected["producer_repository"]
        repo = document(self.capture(module, prefix, "repository.json"))
        require(repo.get("full_name") == selected["producer_repository"] and repo.get("private") is False
                and repo.get("visibility") == "public", "INPUT_UNAVAILABLE")
        run = document(self.capture(module, prefix + f"/actions/runs/{selected['run_id']}/attempts/{selected['run_attempt']}", "run.json"))
        require(run.get("id") == selected["run_id"] and run.get("run_attempt") == selected["run_attempt"]
                and run.get("head_sha") == selected["producer_revision"]
                and run.get("head_branch") == repo.get("default_branch")
                and run.get("event") in {"push", "workflow_dispatch"}
                and run.get("status") == "completed" and run.get("conclusion") == "success"
                and run.get("path") == selected["workflow_path"]
                and run.get("head_repository", {}).get("full_name") == selected["producer_repository"])
        artifact = document(self.capture(module, prefix + f"/actions/artifacts/{selected['artifact_id']}", "artifact.json"))
        require(artifact.get("id") == selected["artifact_id"] and artifact.get("name") == selected["artifact_name"]
                and artifact.get("expired") is False
                and artifact.get("digest") == "sha256:" + selected["archive_sha256"]
                and type(artifact.get("size_in_bytes")) is int and 0 < artifact["size_in_bytes"] <= MAX_ARCHIVE
                and artifact.get("workflow_run", {}).get("id") == selected["run_id"]
                and artifact.get("workflow_run", {}).get("head_sha") == selected["producer_revision"])
        created = instant(artifact.get("created_at"), provider=True)
        require(instant(run.get("run_started_at"), provider=True) <= created
                <= instant(run.get("updated_at"), provider=True) <= evaluated)
        require(instant(artifact.get("expires_at"), provider=True) > evaluated, "INPUT_STALE")
        raw = self.capture(module, prefix + f"/actions/artifacts/{selected['artifact_id']}/zip", "archive.zip", MAX_ARCHIVE)
        require(digest(raw) == selected["archive_sha256"] and len(raw) == artifact["size_in_bytes"])
        return archive(raw, module), created, {"repository_id": repo.get("id"), "event_name": run.get("event")}


def archive(raw, module):
    allowed = ({"fleet.json", "fleet-artifact.json"} if module == "core" else {
        "repository-audits.json", "repository-sanity.json", "fleet-audits.json",
        "fleet-sanity.json", "review-feed-receipt.json"})
    result, total = {}, 0
    with zipfile.ZipFile(io.BytesIO(raw)) as zipped:
        require(len(zipped.infolist()) in ({1, 2} if module == "core" else {len(allowed)}))
        for entry in zipped.infolist():
            mode = entry.external_attr >> 16
            require(entry.filename in allowed and entry.filename not in result and not entry.is_dir()
                    and not entry.flag_bits & 1 and (not stat.S_IFMT(mode) or stat.S_ISREG(mode))
                    and entry.compress_type in {zipfile.ZIP_STORED, zipfile.ZIP_DEFLATED}
                    and 0 < entry.file_size <= MAX_FILE and entry.compress_size > 0
                    and entry.file_size <= max(1024 * 1024, entry.compress_size * 256))
            total += entry.file_size
            require(total <= MAX_TOTAL)
            with zipped.open(entry) as stream:
                content = stream.read(entry.file_size + 1)
            require(len(content) == entry.file_size)
            result[entry.filename] = content
    require(set(result) == allowed or module == "core" and set(result) == {"fleet-artifact.json"})
    return result


def source(selected):
    return {"repository": selected["producer_repository"], "revision": selected["producer_revision"],
            "workflow_path": selected["workflow_path"], "run_id": selected["run_id"],
            "run_attempt": selected["run_attempt"]}


def core_bundle(files, selected, evaluated, provider):
    raw = files["fleet-artifact.json"]
    require(digest(raw) == selected["manifest_sha256"])
    manifest = document(raw)
    require(manifest.get("visibility") == "public" and manifest.get("organization") == "egohygiene"
            and manifest.get("schema") == "egohygiene.relay.public-fleet-artifact/v1")
    require(manifest.get("status") != "unavailable", "INPUT_UNAVAILABLE")
    require(manifest.get("status") in {"ready", "partial"} and "fleet.json" in files)
    producer = closed(manifest.get("producer"), {"repository", "repository_id", "source_commit", "run_id", "run_attempt", "event_name"})
    require(producer["repository"] == selected["producer_repository"]
            and producer["source_commit"] == selected["producer_revision"]
            and type(producer["repository_id"]) is int and producer["repository_id"] == provider["repository_id"]
            and type(producer["run_id"]) is int and producer["run_id"] == selected["run_id"]
            and type(producer["run_attempt"]) is int and producer["run_attempt"] == selected["run_attempt"]
            and producer["event_name"] == provider["event_name"])
    require(manifest.get("files") == [{"path": "fleet.json", "sha256": digest(files["fleet.json"]),
                                       "size_bytes": len(files["fleet.json"])}])
    document(files["fleet.json"], MAX_FILE)
    clock = manifest["observed_at"]
    require(instant(clock) <= evaluated < instant(manifest["expires_at"]), "INPUT_STALE")
    return clock, manifest["status"] == "partial", {"fleet.json": files["fleet.json"], "fleet-artifact.json": raw}


def review_bundle(files, selected, module, evaluated):
    # The receipt and its final exact owner bindings are implemented below;
    # model bytes still pass the existing website owner-schema/public intake.
    raw = files["review-feed-receipt.json"]
    require(digest(raw) == selected["manifest_sha256"])
    receipt = document(raw)
    model = document(files[f"fleet-{module}.json"], MAX_FILE)
    require(model.get("visibility") == "public"
            and model.get("schema") == f"egohygiene.observatory.fleet-{module}/v1"
            and model.get("contract_version") == VERSION)
    clock = model["as_of"]
    require(instant(clock) <= evaluated)
    validate_review_receipt(receipt, files, selected, clock)
    partial = (receipt["models"][f"fleet-{module}"]["evidence_state"] == "unavailable"
               or any(row["domain"] == module and row["state"] == "missing" for row in receipt["reports"]))
    return clock, partial, {f"fleet-{module}.json": files[f"fleet-{module}.json"]}


def validate_review_receipt(receipt, files, selected, clock):
    capsule = ROOT / "contracts/organization-intelligence/model-selection"
    pin = closed(document(read(capsule / "input-lock.json")),
        {"schema", "repository", "revision", "helper", "implementation", "source_files"})
    require(pin["schema"] == "egohygiene.website.typed-review-feed-input-lock/v1"
            and pin["repository"] == "egohygiene/relay" and REVISION.fullmatch(pin["revision"]))
    helper = closed(pin["helper"], {"file", "sha256"})
    require(helper["file"] == "review_feed_contract.py"
            and digest(read(capsule / helper["file"])) == helper["sha256"] == pin["implementation"]["contract_sha256"])
    name = "website_review_feed_contract_" + pin["revision"]
    spec = importlib.util.spec_from_file_location(name, capsule / helper["file"])
    contract = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(contract)
    source_lock = document(read(ROOT / "contracts/organization-intelligence/reviews/input-lock.json"))
    catalog_pin = source_lock["sources"]["catalog"]
    catalog_raw = read(ROOT / "contracts/organization-intelligence/reviews" / relative_path(catalog_pin["file"]))
    require(digest(catalog_raw) == catalog_pin["sha256"])
    rows = [row for row in document(catalog_raw)["repositories"] if type(row) is dict
            and row.get("visibility") == "public" and row.get("full_name") == selected["producer_repository"]]
    require(len(rows) == 1)
    admission = {**source_lock["admission"], "selected_sha256": digest(encoded(rows))}
    validated = contract.validate_receipt(receipt, admission=admission,
        expected_implementation=pin["implementation"], repository=selected["producer_repository"],
        represented_commit=selected["producer_revision"], as_of=clock)
    for key in contract.MODELS:
        document(files[key + ".json"], MAX_FILE)
        contract.validate_model_bytes(validated, key, files[key + ".json"])


def prepare(args):
    selection_path = local_path(args.selection)
    raw = read(selection_path, 65536)
    require(SHA.fullmatch(args.selection_sha256) and digest(raw) == args.selection_sha256)
    value = closed(selection_document(raw), {"schema", "contract_version", "visibility", "target", "as_of", "modules", "publications"})
    closed(value["target"], {"origin", "base_path"})
    require(value["schema"] == SCHEMA and value["contract_version"] == VERSION
            and value["visibility"] == "public" and value["target"] == TARGET)
    evaluated = instant(value["as_of"])
    require(evaluated <= datetime.now(timezone.utc))
    modules = closed(value["modules"], MODULES)
    allowed = public_names()
    output = local_path(args.output)
    capture_root = local_path(args.capture_root) if args.capture_root else None
    require(output.parent.is_dir() and not output.exists() and not inside(output, ROOT)
            and not inside(ROOT, output) and not inside(selection_path, output)
            and (capture_root is None or not inside(capture_root, output) and not inside(output, capture_root)))
    output.mkdir(mode=0o700)
    provider = Provider(output, capture_root)
    request = {"schema": "egohygiene.website.organization-intelligence-export-request/v1", "contract_version": VERSION,
               "target": TARGET, "as_of": value["as_of"], "models": dict.fromkeys(MODULES),
               "module_as_of": dict.fromkeys(MODULES)}
    states = {}
    for module in MODULES:
        state = {"state": "unavailable", "code": "NOT_CONFIGURED", "source_as_of": None, "source": None}
        try:
            selected = choice(modules[module], allowed)
            if selected is None:
                states[module] = state
                continue
            files, created, identity = provider.acquire(module, selected, evaluated)
            clock, partial, admitted = (core_bundle(files, selected, evaluated, identity) if module == "core"
                                        else review_bundle(files, selected, module, evaluated))
            require(instant(clock) <= created)
            require((evaluated - instant(clock)).total_seconds() <= selected["maximum_age_seconds"], "INPUT_STALE")
            publication = None
            if module == "core" and value["publications"] is not None:
                binding = closed(value["publications"], {"path", "sha256"})
                publication = read(ROOT / relative_path(binding["path"]), MAX_FILE)
                require(SHA.fullmatch(binding["sha256"]) and digest(publication) == binding["sha256"])
                document(publication, MAX_FILE)
            bindings = {}
            for name, content in admitted.items():
                relative = "models/" + module + "/" + name
                write(output / relative, content)
                bindings[name] = {"path": relative, "sha256": digest(content)}
            request["models"][module] = ({"fleet": bindings["fleet.json"], "manifest": bindings["fleet-artifact.json"],
                                           "publications": None} if module == "core" else bindings[f"fleet-{module}.json"])
            if publication is not None:
                write(output / "models/core/publications.json", publication)
                request["models"]["core"]["publications"] = {"path": "models/core/publications.json", "sha256": digest(publication)}
            request["module_as_of"][module] = clock
            state = {"state": "partial" if partial else "available", "code": "PARTIAL" if partial else "NONE",
                     "source_as_of": clock, "source": source(selected)}
        except Exception as error:
            request["models"][module] = None
            request["module_as_of"][module] = None
            code = error.code if isinstance(error, SelectionError) else "INPUT_INCOMPATIBLE"
            state = {"state": "stale" if code == "INPUT_STALE" else "unavailable" if code == "INPUT_UNAVAILABLE" else "incompatible",
                     "code": code, "source_as_of": None, "source": None}
        states[module] = state
    write(output / "export-request.json", encoded(request))
    write(output / "selection-state.json", encoded({"acquisition": "captured-inputs" if capture_root is not None
        else "github-read-only", "modules": states}))
    if args.github_output:
        with local_path(args.github_output).open("a", encoding="utf-8") as target:
            target.write("request=" + str(output / "export-request.json") + "\n")
            target.write("request-sha256=" + digest(encoded(request)) + "\n")
            target.write("input-root=" + str(output) + "\n")


def finalize(args):
    workspace = local_path(args.workspace)
    staging = closed(document(read(workspace / "selection-state.json")), {"acquisition", "modules"})
    # Local replay cannot claim a real provider selection in a public receipt.
    require(staging["acquisition"] == "github-read-only")
    states = closed(staging["modules"], MODULES)
    raw = read(local_path(args.export_manifest))
    manifest = document(raw)
    presentation = closed(document(read(args.presentation_evidence)), {"export_manifest_sha256", "models"})
    require(presentation["export_manifest_sha256"] == digest(raw))
    closed(presentation["models"], MODULES)
    request = document(read(workspace / "export-request.json"))
    require(manifest["schema"] == "egohygiene.website.organization-intelligence-export/v1"
            and manifest["visibility"] == "public" and manifest["publication"] == "review-only"
            and manifest["target"] == TARGET and manifest["as_of"] == request["as_of"])
    result = {}
    for module in MODULES:
        selected, model = states[module], manifest["models"][module]
        admitted = model["state"] == "available"
        if not admitted and selected["state"] in {"available", "partial"}:
            selected = {"state": "incompatible", "code": "OWNER_INPUT_DENIED", "source_as_of": None, "source": None}
        require(not admitted or selected["state"] in {"available", "partial"})
        detail = closed(presentation["models"][module], {"presentation_state"})
        require(detail["presentation_state"] in {"available", "partial", "stale", "unavailable", "incompatible", "error"})
        require(not admitted or selected["source_as_of"] == request["module_as_of"][module])
        result[module] = {**selected, "presentation_sha256": model["presentation_sha256"] if admitted else None,
                          "presentation_state": detail["presentation_state"]}
    receipt = {"schema": RECEIPT, "contract_version": VERSION, "visibility": "public", "publication": "review-only",
               "producer": manifest["producer"], "target": TARGET, "evaluated_at": manifest["as_of"],
               "export_manifest_sha256": digest(raw), "modules": result}
    path = local_path(args.output)
    write(path, encoded(receipt))
    if args.github_output:
        with local_path(args.github_output).open("a", encoding="utf-8") as target:
            target.write("selection-receipt-sha256=" + digest(encoded(receipt)) + "\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    initial = commands.add_parser("prepare")
    initial.add_argument("--selection", required=True)
    initial.add_argument("--selection-sha256", required=True)
    initial.add_argument("--output", required=True)
    initial.add_argument("--capture-root")
    initial.add_argument("--github-output")
    final = commands.add_parser("finalize")
    final.add_argument("--workspace", required=True)
    final.add_argument("--export-manifest", required=True)
    final.add_argument("--presentation-evidence", required=True)
    final.add_argument("--output", required=True)
    final.add_argument("--github-output")
    args = parser.parse_args()
    try:
        (prepare if args.command == "prepare" else finalize)(args)
    except Exception:
        print("Organization model selection denied; no deployment performed", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
