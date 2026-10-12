import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Optional authoring utility. Normal builds use committed files and need no image tools.
const root = fileURLToPath(new URL("../", import.meta.url));
const source = join(root, "assets/identity/source/egohygiene.png");
const provenance = JSON.parse(readFileSync(join(root, "assets/identity/source/provenance.json")));
const digest = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
if (digest(source) !== provenance.source.sha256) {
  throw new Error(
    "Organization source differs from its pinned provenance; review before exporting.",
  );
}

const renderer = ["magick", "convert"].find((name) => {
  const result = spawnSync(name, ["-version"], { encoding: "utf8" });
  return result.status === 0 && result.stdout.startsWith("Version: ImageMagick");
});
if (!renderer) throw new Error("Icon regeneration requires ImageMagick (magick or convert).");
const run = (args) => {
  const result = spawnSync(renderer, args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || String(result.error));
};
const temporary = mkdtempSync(join(tmpdir(), "egohygiene-icons-"));
const files = [
  { path: "favicon.png", sizes: "32x32", type: "image/png" },
  { path: "icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  { path: "icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
  { path: "icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
  { path: "favicon.ico", sizes: "16x16 32x32 48x48", type: "image/x-icon" },
];
try {
  mkdirSync(join(temporary, "icons"));
  for (const file of files) {
    const output = join(temporary, file.path);
    const args = [source, "-filter", "Lanczos", "-strip"];
    if (file.type === "image/png") {
      args.push("-resize", file.sizes, "-define", "png:exclude-chunk=date,time", `PNG32:${output}`);
    } else {
      args.push("-define", "icon:auto-resize=48,32,16", output);
    }
    run(args);
    file.sha256 = digest(output);
  }
  for (const app of ["egohygiene.io", "docs", "playground"]) {
    const directory = join(root, "apps", app, "public");
    mkdirSync(join(directory, "icons"), { recursive: true });
    for (const file of files) copyFileSync(join(temporary, file.path), join(directory, file.path));
    copyFileSync(join(root, "assets/identity/NOTICE.txt"), join(directory, "icons/NOTICE.txt"));
  }
  writeFileSync(
    join(root, "assets/identity/exports.json"),
    `${JSON.stringify(
      {
        sourceSha256: provenance.source.sha256,
        renderer: spawnSync(renderer, ["-version"], { encoding: "utf8" }).stdout.split("\n")[0],
        files,
      },
      null,
      2,
    )}\n`,
  );
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
