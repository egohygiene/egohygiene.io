"""Focused process-state regression; no network or real provider credentials."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location(
    "intelligence_model_artifacts_test_subject", ROOT / "scripts/intelligence_model_artifacts.py")
SUBJECT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SUBJECT)


class ProviderStateBoundary(unittest.TestCase):
    def test_github_cli_state_stays_in_private_capture_workspace(self):
        with tempfile.TemporaryDirectory(prefix="ri-gh-state-test-") as directory:
            temporary = Path(directory)
            checkout = temporary / "checkout"
            private = temporary / "private"
            binaries = temporary / "bin"
            for path in (checkout, private, binaries):
                path.mkdir(mode=0o700)
            gh = binaries / "gh"
            gh.write_text(f"#!{sys.executable}\n" + '''import json, os, pathlib, sys
state = pathlib.Path(os.environ.get("XDG_STATE_HOME", ".local/state"))
device = state / "gh/device-id"
device.parent.mkdir(parents=True, exist_ok=True)
device.write_text("test-device-id")
print(json.dumps({"arguments": sys.argv[1:], "home_present": "HOME" in os.environ}))
''')
            gh.chmod(0o700)
            environment = {"PATH": str(binaries), "GH_TOKEN": "test-only-token"}
            # Demonstrate the observed newer-gh fallback without touching source.
            subprocess.run([str(gh), "api"], cwd=checkout, env=environment,
                           stdout=subprocess.DEVNULL, check=True, timeout=5)
            self.assertEqual((checkout / ".local/state/gh/device-id").read_text(), "test-device-id")
            # The actual provider must keep its process state outside a clean checkout.
            clean_checkout = temporary / "clean-checkout"
            clean_checkout.mkdir(mode=0o700)
            previous = Path.cwd()
            try:
                os.chdir(clean_checkout)
                with patch.dict(os.environ, environment, clear=True):
                    raw = SUBJECT.Provider(private).capture(
                        "audits", "/repos/egohygiene/.github", "repository.json")
            finally:
                os.chdir(previous)
            self.assertEqual(list(clean_checkout.iterdir()), [])
            self.assertEqual((private / "gh-state/gh/device-id").read_text(), "test-device-id")
            self.assertEqual(json.loads(raw), {"arguments": [
                "api", "--hostname", "github.com", "--method", "GET", "/repos/egohygiene/.github"],
                "home_present": False})
            self.assertEqual((private / "transport/audits/repository.json").read_bytes(), raw)


if __name__ == "__main__":
    unittest.main()
