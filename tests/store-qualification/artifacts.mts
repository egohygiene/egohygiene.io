import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { gzipSync } from "node:zlib";

type AssetKind = "javascript" | "css" | "images" | "fonts" | "documents";
type Size = { bytes: number; gzipBytes: number };
type Finding = { rule: string; file: string; detail: string };
type Marker = { label: string; marker: string; source: string };
type AddFinding = (rule: string, file: string, detail: string) => void;

// Proposed local review ceilings, not maintainer-agreed performance or service targets.
// JS/CSS leave roughly 15–22% above the #37c baseline; other groups allow the
// current public icons, one artwork derivative and fonts with bounded headroom.
// Aggregate groups prevent bypassing the check by splitting an oversized chunk.
export const LOCAL_REVIEW_BUDGETS: Record<AssetKind | "total", Size> = {
  javascript: { bytes: 500_000, gzipBytes: 150_000 },
  css: { bytes: 60_000, gzipBytes: 12_000 },
  images: { bytes: 500_000, gzipBytes: 500_000 },
  fonts: { bytes: 60_000, gzipBytes: 50_000 },
  documents: { bytes: 20_000, gzipBytes: 10_000 },
  total: { bytes: 1_140_000, gzipBytes: 722_000 },
};

export const EXCLUDED_MARKERS: Marker[] = [
  {
    label: "synthetic readiness evidence",
    marker: "test-only-synthetic-evidence",
    source: "tests/store/fixtures/readiness.ts",
  },
  {
    label: "synthetic customer support",
    marker: "support.example.invalid/synthetic-store",
    source: "tests/store/fixtures/readiness.ts",
  },
  {
    label: "catalog language fixture",
    marker: "test-localization-65c",
    source: "tests/catalog-localization/constants.ts",
  },
  {
    label: "catalog language qualification host",
    marker: "Synthetic catalog languages",
    source: "tests/catalog-localization/host.tsx",
  },
  {
    label: "handoff fixture",
    marker: "test-handoff-37a",
    source: "tests/checkout-handoff/inputs.ts",
  },
  {
    label: "handoff label",
    marker: "Fictional handoff test",
    source: "tests/checkout-handoff/inputs.ts",
  },
  {
    label: "inert destination",
    marker: "Intercepted checkout destination",
    source: "tests/checkout-handoff/network.ts",
  },
  {
    label: "Fourthwall preview route",
    marker: "store/preview/fourthwall",
    source: "apps/egohygiene.io/src/app/router.tsx",
  },
  {
    label: "artist preview route",
    marker: "store/preview/artists/:artistSlug",
    source: "apps/egohygiene.io/src/app/router.tsx",
  },
  {
    label: "Fourthwall fixture",
    marker: "mock-fourthwall-signal-heart",
    source: "apps/egohygiene.io/src/features/fourthwall-preview/fixture.ts",
  },
  {
    label: "artist fixture",
    marker: "artist-preview-fictional",
    source: "apps/egohygiene.io/src/features/artist-preview/fixture.ts",
  },
  {
    label: "layout host",
    marker: "Qualification fixture",
    source: "tests/storefront-qualification/host.tsx",
  },
  {
    label: "synthetic RTL copy",
    marker: "نص تجريبي",
    source: "apps/egohygiene.io/src/test/locale-fixtures.ts",
  },
];

const POSITIVE_CONTROLS = [
  "design-heartburst",
  "/store/heartburst/heartburst-light.webp",
  "product-demo-signal-heart-hoodie",
];
const TEXT_EXTENSIONS = /\.(?:html?|[cm]?js|json|css|txt|webmanifest|map|svg|xml|ya?ml)$/i;
const ASSET_EXTENSION =
  /\.(?:[cm]?js|css|json|webmanifest|avif|gif|ico|jpe?g|png|svg|webp|woff2?|ttf|otf|mp4|webm)(?:[?#].*)?$/i;
const CREDENTIAL_PATTERNS = [
  { label: "private-key", pattern: /-----BEGIN (?:[A-Z0-9]+ )?PRIVATE KEY-----/ },
  {
    label: "github-token",
    pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{40,})\b/,
  },
  { label: "aws-access-key", pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/ },
  { label: "payment-secret-key", pattern: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/ },
  { label: "google-api-key", pattern: /\bAIza[A-Za-z0-9_-]{35}\b/ },
  {
    label: "credential-url",
    pattern: /(?:https?|postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s/"'<>:@]+:[^\s/"'<>@]+@/i,
  },
];

function kindFor(file: string): AssetKind {
  if (/\.[cm]?js$/i.test(file)) return "javascript";
  if (/\.css$/i.test(file)) return "css";
  if (/\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i.test(file)) return "images";
  if (/\.(?:woff2?|ttf|otf)$/i.test(file)) return "fonts";
  return "documents";
}

function captures(text: string, pattern: RegExp): string[] {
  return [...text.matchAll(pattern)].flatMap((match) => (match[1] ? [match[1]] : []));
}

function referencesIn(file: string, text: string): string[] {
  if (/\.html?$/i.test(file)) {
    return [...text.matchAll(/<(?:script|link|img|source)\b[^>]*>/gi)].flatMap(([tag]) =>
      captures(tag, /\b(?:src|href)\s*=\s*["']([^"']+)["']/gi),
    );
  }
  if (/\.css$/i.test(file)) {
    return captures(text, /url\(\s*["']?([^\s"')]+)["']?\s*\)/gi);
  }
  if (/\.[cm]?js$/i.test(file)) {
    // Covers emitted static/dynamic imports and quoted public asset paths.
    // Computed URLs remain the browser journey's responsibility.
    return captures(text, /["'`]((?:\/|\.\.?\/)[^\s"'`]+)["'`]/g).filter((value) =>
      ASSET_EXTENSION.test(value),
    );
  }
  return [];
}

function checkPaths(files: string[], add: AddFinding) {
  for (const file of files) {
    if (/(?:^|\/)\.env(?:\.|$)/i.test(file))
      add("dotenv", file, "Environment files must not be emitted.");
    if (/\.map$/i.test(file))
      add("source-map", file, "Source maps must not be emitted by this normal build.");
    if (
      /(?:^|\/)(?:private|private-artwork|masters|business-records)(?:\/|$)/i.test(file) ||
      /\.(?:psd|psb|kra|xcf|afdesign|afphoto)$/i.test(file)
    ) {
      add(
        "private-source-path",
        file,
        "Private-source-like path or master artwork extension in public output.",
      );
    }
  }
}

function checkText(texts: Map<string, string>, add: AddFinding) {
  for (const [file, text] of texts) {
    if (/sourceMappingURL\s*=/.test(text))
      add("source-map-reference", file, "Source-map reference found.");
    for (const { label, pattern } of CREDENTIAL_PATTERNS) {
      if (pattern.test(text))
        add(`credential:${label}`, file, "Credential-shaped content found; matched value omitted.");
    }
  }
}

function manifestReferences(text: string, add: AddFinding): string[] {
  try {
    const manifest = JSON.parse(text) as { name?: unknown; start_url?: unknown; icons?: unknown };
    if (typeof manifest.name !== "string" || !manifest.name.trim())
      add("invalid-manifest", "site.webmanifest", "Manifest needs a name.");
    const references: string[] = [];
    if (typeof manifest.start_url !== "string")
      add("invalid-manifest", "site.webmanifest", "Manifest needs start_url.");
    else references.push(manifest.start_url);
    if (!Array.isArray(manifest.icons) || !manifest.icons.length) {
      add("invalid-manifest", "site.webmanifest", "Manifest needs icons.");
      return references;
    }
    return references.concat(
      manifest.icons.flatMap((icon: unknown) => {
        if (!icon || typeof icon !== "object" || !("src" in icon) || typeof icon.src !== "string") {
          add("invalid-manifest", "site.webmanifest", "Icon needs src.");
          return [];
        }
        return [icon.src];
      }),
    );
  } catch {
    add("invalid-manifest", "site.webmanifest", "Manifest must be a valid JSON object.");
    return [];
  }
}

function checkEntryDocuments(
  texts: Map<string, string>,
  add: AddFinding,
  checkReference: (from: string, value: string) => void,
) {
  if (!texts.has("index.html")) add("missing-index", "index.html", "Entry HTML is required.");
  const manifest = texts.get("site.webmanifest");
  if (manifest === undefined) {
    add("missing-manifest", "site.webmanifest", "Web manifest is required.");
    return;
  }
  for (const reference of manifestReferences(manifest, add))
    checkReference("site.webmanifest", reference);
}

export async function qualifyArtifact(
  artifactRoot: string,
  options: {
    positiveControls?: string[];
    excludedMarkers?: Marker[];
    budgets?: Record<AssetKind | "total", Size>;
    publicImageSource?: string;
  } = {},
) {
  const findings: Finding[] = [];
  const content = new Map<string, Buffer>();
  const add = (rule: string, file: string, detail: string) => findings.push({ rule, file, detail });

  async function visit(directory: string) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, "en"))) {
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(artifactRoot, absolute).split(path.sep).join("/");
      if (entry.isSymbolicLink()) add("symlink", relative, "Artifact symlinks are not followed.");
      else if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile()) content.set(relative, await readFile(absolute));
      else add("unsupported-file", relative, "Artifact entry is not a regular file.");
    }
  }
  await visit(artifactRoot);
  const files = [...content]
    .sort(([a], [b]) => a.localeCompare(b, "en"))
    .map(([file, bytes]) => ({
      path: file,
      kind: kindFor(file),
      bytes: bytes.length,
      gzipBytes: gzipSync(bytes, { level: 9 }).length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    }));
  const texts = new Map(
    [...content]
      .filter(([file]) => TEXT_EXTENSIONS.test(file) || path.basename(file) === "CNAME")
      .map(([file, bytes]) => [file, bytes.toString("utf8")]),
  );
  checkPaths(
    files.map((file) => file.path),
    add,
  );
  checkText(texts, add);
  const markerChecks = (options.excludedMarkers ?? EXCLUDED_MARKERS).map(({ label, marker }) => {
    const matches = [...content.keys()].filter(
      (file) => file.includes(marker) || texts.get(file)?.includes(marker),
    );
    for (const file of matches) add("excluded-marker", file, label);
    return { label, result: matches.length ? "fail" : "pass" };
  });
  const positiveControls = (options.positiveControls ?? POSITIVE_CONTROLS).map((marker) => {
    const present = [...texts.values()].some((text) => text.includes(marker));
    if (!present) add("missing-positive-control", "artifact", marker);
    return { marker, result: present ? "pass" : "fail" };
  });
  const references: { from: string; target: string; result: "pass" | "fail" }[] = [];
  const externalReferences: { from: string; protocol: string }[] = [];
  function checkReference(from: string, value: string) {
    if (/^(?:data:|#)/.test(value)) return;
    let url: URL;
    try {
      url = new URL(value, `https://artifact.invalid/${from}`);
    } catch {
      add("invalid-asset-reference", from, "Cannot parse asset reference; value omitted.");
      return;
    }
    if (url.origin !== "https://artifact.invalid") {
      externalReferences.push({ from, protocol: url.protocol });
      return;
    }
    let target: string;
    try {
      target = decodeURIComponent(url.pathname).replace(/^\//, "");
    } catch {
      add("invalid-asset-reference", from, "Cannot decode asset reference; value omitted.");
      return;
    }
    if (url.pathname.endsWith("/")) target += "index.html";
    const exists = content.has(target);
    references.push({ from, target, result: exists ? "pass" : "fail" });
    if (!exists) add("missing-asset", from, target);
  }
  for (const [file, text] of texts) {
    for (const reference of new Set(referencesIn(file, text))) checkReference(file, reference);
  }
  checkEntryDocuments(texts, add, checkReference);
  let publicImageExactMatch: boolean | null = null;
  if (options.publicImageSource) {
    publicImageExactMatch =
      content
        .get("store/heartburst/heartburst-light.webp")
        ?.equals(await readFile(options.publicImageSource)) ?? false;
    if (!publicImageExactMatch)
      add(
        "public-image-mismatch",
        "store/heartburst/heartburst-light.webp",
        "Output differs from the approved public derivative.",
      );
  }
  const budgets = options.budgets ?? LOCAL_REVIEW_BUDGETS;
  const sizes = Object.fromEntries(
    Object.entries(budgets).map(([kind, limit]) => {
      const group = files.filter((file) => kind === "total" || file.kind === kind);
      const measured = {
        bytes: group.reduce((sum, file) => sum + file.bytes, 0),
        gzipBytes: group.reduce((sum, file) => sum + file.gzipBytes, 0),
      };
      for (const metric of ["bytes", "gzipBytes"] as const) {
        if (measured[metric] > limit[metric])
          add("size-budget", kind, `${metric}: ${measured[metric]} exceeds ${limit[metric]}.`);
      }
      return [
        kind,
        {
          ...measured,
          limit,
          result:
            measured.bytes <= limit.bytes && measured.gzipBytes <= limit.gzipBytes
              ? "pass"
              : "fail",
        },
      ];
    }),
  ) as Record<AssetKind | "total", Size & { limit: Size; result: "pass" | "fail" }>;
  return {
    result: findings.length ? "fail" : "pass",
    scope:
      "All emitted paths and selected text formats; hashes and level-9 gzip sizes for every regular file. HTML asset attributes, CSS url(), JS quoted static asset paths, and manifest icons/start_url are resolved locally. No network requests.",
    limits: [
      "Targeted common credential signatures and private-source path checks, not a comprehensive secret or binary metadata audit.",
      "Computed URLs and browser/deployed-host behavior require journey checks; this scanner does not execute application code.",
      "Size ceilings are provisional local review regression limits, not maintainer-agreed performance budgets or measured user experience.",
      "External resource references are inventoried by protocol only, not fetched or qualified.",
    ],
    budgetStatus: "provisional-local-review",
    gzip: {
      level: 9,
      meaning:
        "Sum of separately compressed file bytes; not a server compression or network timing measurement.",
    },
    files,
    scannedTextFiles: [...texts.keys()],
    markerChecks,
    positiveControls,
    references,
    externalReferences,
    publicImageExactMatch,
    sizes,
    findings,
  };
}

async function main() {
  const repoRoot = fileURLToPath(new URL("../../", import.meta.url));
  const artifactRoot = path.join(repoRoot, "apps/egohygiene.io/dist");
  const { values } = parseArgs({ options: { output: { type: "string" } } });
  const output = path.resolve(
    repoRoot,
    values.output ?? "test-results/store-qualification/artifacts.json",
  );
  const outputRoot = path.join(repoRoot, "test-results/store-qualification");
  if (!output.startsWith(`${outputRoot}${path.sep}`))
    throw new Error("Output must be inside test-results/store-qualification/.");
  for (const { source, marker, label } of EXCLUDED_MARKERS) {
    if (!(await readFile(path.join(repoRoot, source), "utf8")).includes(marker)) {
      throw new Error(`Excluded-marker source is stale: ${label}.`);
    }
  }
  const report = await qualifyArtifact(artifactRoot, {
    publicImageSource: path.join(
      repoRoot,
      "apps/egohygiene.io/public/store/heartburst/heartburst-light.webp",
    ),
  });
  const revision = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
  }).trim();
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(
    output,
    `${JSON.stringify({ capturedAt: new Date().toISOString(), sourceHead: revision, artifactRoot: path.relative(repoRoot, artifactRoot), ...report }, null, 2)}\n`,
  );
  process.stdout.write(
    `Artifact qualification: ${report.result}; ${report.files.length} files, ${report.references.length} asset references, ${report.findings.length} findings. Report: ${path.relative(repoRoot, output)}\n`,
  );
  if (report.findings.length) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main();
