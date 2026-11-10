import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type { Plugin } from "vite";

import { qualifyArtifact } from "../tests/store-qualification/artifacts.mts";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const digest = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");
type ChunkCost = {
  path: string;
  sha256: string;
  modules: { path: string; renderedBytes: number }[];
};
type StyleCost = { path: string; sourceBytes: number };

function modulePath(id: string) {
  return id.startsWith("\0") ? id.slice(1) : relative(repoRoot, id).replaceAll("\\", "/");
}

/** Observes only the normal client build; never writes or modifies a public asset. */
export function createPublicCostProbe() {
  const chunks: ChunkCost[] = [];
  const styles: StyleCost[] = [];
  const plugin: Plugin = {
    name: "public-cost-report",
    enforce: "pre",
    transform(code, id) {
      if (id.endsWith(".css"))
        styles.push({ path: modulePath(id), sourceBytes: Buffer.byteLength(code) });
    },
    // Vite may finalize chunk bytes after generateBundle; observe the final written bundle.
    writeBundle(_options, bundle) {
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        chunks.push({
          path: output.fileName,
          sha256: digest(output.code),
          modules: Object.entries(output.modules)
            .map(([id, module]) => ({ path: modulePath(id), renderedBytes: module.renderedLength }))
            .sort((a, b) => b.renderedBytes - a.renderedBytes || a.path.localeCompare(b.path)),
        });
      }
    },
  };
  return { plugin, chunks, styles };
}

/** Refuse stale module attribution even if the artifact itself otherwise qualifies. */
export async function assertCostProbeMatches(artifactRoot: string, chunks: ChunkCost[]) {
  for (const chunk of chunks) {
    const filename = resolve(artifactRoot, chunk.path);
    if (!filename.startsWith(`${resolve(artifactRoot)}/`))
      throw new Error("Cost chunk escapes artifact.");
    if (digest(await readFile(filename)) !== chunk.sha256)
      throw new Error(`Cost probe differs from emitted asset: ${chunk.path}`);
  }
}

export async function writePublicCostReport(
  artifactRoot: string,
  chunks: ChunkCost[],
  styles: StyleCost[],
) {
  if (!chunks.length) throw new Error("Client module attribution is missing.");
  await assertCostProbeMatches(artifactRoot, chunks);
  const artifact = await qualifyArtifact(artifactRoot, {
    publicImageSource: resolve(
      repoRoot,
      "apps/egohygiene.io/public/store/heartburst/heartburst-light.webp",
    ),
  });
  const javascript = artifact.files.filter((file) => /\.[cm]?js$/.test(file.path));
  if (
    javascript.some(
      (file) => !chunks.some((chunk) => chunk.path === file.path && chunk.sha256 === file.sha256),
    )
  )
    throw new Error("Emitted JavaScript has no matching client module attribution.");
  const documentUse = new Map<string, number>();
  for (const document of artifact.documentCosts.documents)
    for (const file of document.reachableFiles)
      if (file !== document.path) documentUse.set(file, (documentUse.get(file) ?? 0) + 1);
  const report = {
    capturedAt: new Date().toISOString(),
    sourceHead: execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim(),
    sourceDirty: Boolean(
      execFileSync("git", ["status", "--porcelain"], { cwd: repoRoot, encoding: "utf8" }).trim(),
    ),
    artifactRoot: relative(repoRoot, artifactRoot),
    attributionLimits: [
      "Module renderedBytes are before final chunk minification, not additive compressed transfer costs.",
      "Styles list observed CSS module source bytes; nested imports may be internal to Vite. These are not additive emitted CSS costs.",
      "Reachability is the conservative static reference graph, not measured browser downloads or timing.",
      "All active aggregate ceilings/findings remain unchanged; this is not a new performance policy.",
    ],
    ...artifact,
    chunks: chunks.sort((a, b) => a.path.localeCompare(b.path)),
    styles: styles.sort((a, b) => b.sourceBytes - a.sourceBytes || a.path.localeCompare(b.path)),
    sharedAssets: artifact.files
      .filter((file) => (documentUse.get(file.path) ?? 0) > 1)
      .map((file) => ({ ...file, referencedByDocuments: documentUse.get(file.path) })),
  };
  const output = resolve(repoRoot, "test-results/store-qualification/costs.json");
  await mkdir(resolve(repoRoot, "test-results/store-qualification"), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    `Cost report: ${relative(repoRoot, output)}; ${artifact.findings.length} strict findings retained.`,
  );
  return report;
}
