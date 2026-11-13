#!/usr/bin/env python3
"""Log bounded source-checkout metadata without changing the export guard."""
from __future__ import annotations

import json
import re
import resource
import subprocess
import sys
import tempfile


def capture(arguments: list[str], maximum: int) -> tuple[bytes, bool]:
    """Bound Git stdout and time; optional index writes remain disabled."""
    with tempfile.TemporaryFile() as output:
        def limit() -> None:
            resource.setrlimit(resource.RLIMIT_FSIZE, (maximum, maximum))

        try:
            result = subprocess.run(
                ["git", "--no-optional-locks", *arguments],
                stdout=output, stderr=subprocess.DEVNULL, timeout=15,
                check=False, preexec_fn=limit,
            )
            complete = result.returncode == 0 and output.tell() <= maximum
        except (OSError, subprocess.TimeoutExpired):
            complete = False
        output.seek(0)
        return output.read(maximum), complete


def public_path(raw: bytes) -> str:
    """Only canonical relative source paths enter the diagnostic log."""
    try:
        value = raw.decode("ascii")
    except UnicodeError:
        return "<noncanonical-path-omitted>"
    if (not re.fullmatch(r"[A-Za-z0-9_.-][A-Za-z0-9._/-]{0,239}", value)
            or any(part in {"", ".", ".."} for part in value.split("/"))
            or re.search(r"github_pat_|gh[pousr]_", value)):
        return "<noncanonical-path-omitted>"
    return value


def main() -> int:
    if len(sys.argv) != 2 or sys.argv[1] not in {"checkout", "acquisition", "install"}:
        return 2
    head, head_ok = capture(["rev-parse", "HEAD"], 128)
    head_valid = head_ok and re.fullmatch(rb"[a-f0-9]{40}\n?", head) is not None
    status, status_ok = capture(
        ["status", "--porcelain=v1", "-z", "--untracked-files=all"], 65536,
    )
    parts = status.split(b"\0")
    rows = []
    index = 0
    while index < len(parts) and parts[index] and len(rows) < 32:
        entry = parts[index]
        index += 1
        code = entry[:2]
        if len(entry) < 4 or entry[2:3] != b" " or re.fullmatch(rb"[ MTADRCU?!]{2}", code) is None:
            status_ok = False
            break
        row = {"status": code.decode("ascii"), "path": public_path(entry[3:])}
        if b"R" in code or b"C" in code:
            if index >= len(parts) or not parts[index]:
                status_ok = False
                break
            row["previous_path"] = public_path(parts[index])
            index += 1
        rows.append(row)
    print(json.dumps({
        "stage": sys.argv[1], "head_valid": head_valid,
        "head": head.decode("ascii").strip() if head_valid else None,
        "status_read_ok": status_ok, "paths": rows,
        "truncated": not status_ok or any(parts[index:]),
    }, ensure_ascii=True, sort_keys=True))
    # Observation only: the existing export clean-source check still decides.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
