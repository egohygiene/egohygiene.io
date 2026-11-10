import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const smokeApps = ["egohygiene.io", "docs", "playground"] as const;
export type SmokeApp = (typeof smokeApps)[number];
export const smokeReceiptPath = "test-results/store-qualification/smoke/build-receipt.json";

export interface SmokeSourceIdentity {
  readonly commit: string;
  readonly digest: string;
  readonly files: number;
}

interface SmokeArtifact {
  readonly app: SmokeApp;
  readonly files: Readonly<Record<string, string>>;
}

export interface BuildSmokeReceipt {
  readonly schemaVersion: 1;
  readonly invocationId: string;
  readonly createdAt: string;
  readonly node: string;
  readonly source: SmokeSourceIdentity;
  readonly artifacts: readonly SmokeArtifact[];
}

const sha256 = (input: string | Buffer) => createHash("sha256").update(input).digest("hex");

/** Include uncommitted tracked/new source, while respecting the checkout's generated-file ignores. */
export async function smokeSourceIdentity(root: string): Promise<SmokeSourceIdentity> {
  const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  const files = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
    {
      cwd: root,
      encoding: "utf8",
    },
  )
    .split("\0")
    .filter(Boolean);
  const digest = createHash("sha256");
  for (const file of [...new Set(files)].sort()) {
    digest.update(`${file}\0`);
    try {
      const content = await readFile(path.join(root, file));
      digest.update("file\0");
      digest.update(content);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      digest.update("deleted\0");
    }
    digest.update("\0");
  }
  return { commit, digest: digest.digest("hex"), files: new Set(files).size };
}

export function sameSmokeSource(left: SmokeSourceIdentity, right: SmokeSourceIdentity): boolean {
  return left.commit === right.commit && left.digest === right.digest && left.files === right.files;
}

/** Every emitted file is bound to this invocation; links outside the owned output are rejected. */
async function artifactHashes(directory: string): Promise<Record<string, string>> {
  const files: Record<string, string> = {};
  async function visit(current: string) {
    for (const name of (await readdir(current)).sort()) {
      const target = path.join(current, name);
      const info = await lstat(target);
      if (info.isSymbolicLink()) throw new Error("Build smoke refuses symbolic links in output.");
      if (info.isDirectory()) await visit(target);
      else if (info.isFile()) {
        files[path.relative(directory, target).split(path.sep).join("/")] = sha256(
          await readFile(target),
        );
      } else throw new Error("Build smoke found a non-file artifact.");
    }
  }
  await visit(directory);
  return files;
}

export async function createSmokeReceipt(
  root: string,
  invocationId: string,
  source: SmokeSourceIdentity,
): Promise<BuildSmokeReceipt> {
  if (!invocationId) throw new Error("Build smoke requires an invocation identity.");
  if (!sameSmokeSource(source, await smokeSourceIdentity(root))) {
    throw new Error("Build smoke source changed while prerequisites were building.");
  }
  const artifacts = [];
  for (const app of smokeApps) {
    artifacts.push({ app, files: await artifactHashes(path.join(root, "apps", app, "dist")) });
  }
  return {
    schemaVersion: 1,
    invocationId,
    createdAt: new Date().toISOString(),
    node: process.version,
    source,
    artifacts,
  };
}

function localAsset(href: string | undefined): string {
  if (!href) throw new Error("Build smoke found an empty asset reference.");
  const url = new URL(href, "https://build-smoke.invalid/");
  if (url.origin !== "https://build-smoke.invalid" || url.pathname.startsWith("/src/")) {
    throw new Error(`Build smoke expected an emitted local asset: ${href}`);
  }
  const file = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!file || file.split("/").includes(".."))
    throw new Error("Build smoke found an invalid asset path.");
  return file;
}

function smokeHtmlAssets(app: SmokeApp, html: string, artifacts: Readonly<Record<string, string>>) {
  if (
    !/^<!doctype html>/i.test(html.trimStart()) ||
    !/<div\b[^>]*\bid="root"/i.test(html) ||
    !/<title\b[^>]*>[^<]*Ego Hygiene[^<]*<\/title>/i.test(html)
  ) {
    throw new Error(`Build smoke ${app} index is not the expected production HTML document.`);
  }
  if (
    app === "egohygiene.io" &&
    (!/<main\b/i.test(html) || !/<h1\b/i.test(html) || !artifacts["public-routes.json"])
  ) {
    throw new Error(
      "Build smoke website requires rendered primary content and its public route receipt.",
    );
  }
  const scripts = [
    ...html.matchAll(/<script\b(?=[^>]*\btype="module")[^>]*\bsrc="([^"]+)"[^>]*>/gi),
  ].map((match) => localAsset(match[1]));
  const styles = [
    ...html.matchAll(/<link\b(?=[^>]*\brel="stylesheet")[^>]*\bhref="([^"]+)"[^>]*>/gi),
  ].map((match) => localAsset(match[1]));
  if (!scripts.length || !styles.length)
    throw new Error(`Build smoke ${app} needs emitted JavaScript and stylesheets.`);
  return { scripts, styles };
}

/** File/HTML smoke evidence only; this does not execute the emitted JavaScript or a browser. */
export async function verifySmokeApp(
  root: string,
  app: SmokeApp,
  invocationId: string | undefined,
) {
  if (!invocationId)
    throw new Error(
      "Run smoke through scripts/qualify-store.mjs --profile smoke; fresh builds are required.",
    );
  const receipt = JSON.parse(
    await readFile(path.join(root, smokeReceiptPath), "utf8"),
  ) as BuildSmokeReceipt;
  if (
    receipt.schemaVersion !== 1 ||
    receipt.invocationId !== invocationId ||
    receipt.node !== process.version
  ) {
    throw new Error("Build smoke receipt is stale or belongs to another invocation/runtime.");
  }
  if (!receipt.source || !sameSmokeSource(receipt.source, await smokeSourceIdentity(root))) {
    throw new Error("Build smoke receipt does not match the current source.");
  }
  if (
    !Array.isArray(receipt.artifacts) ||
    receipt.artifacts.length !== smokeApps.length ||
    new Set(receipt.artifacts.map((artifact) => artifact.app)).size !== smokeApps.length ||
    smokeApps.some((name) => !receipt.artifacts.some((artifact) => artifact.app === name))
  ) {
    throw new Error("Build smoke requires receipts for all three completed build prerequisites.");
  }
  const artifact = receipt.artifacts.find((candidate) => candidate.app === app);
  if (!artifact) throw new Error(`Build smoke is missing the ${app} build receipt.`);
  const directory = path.join(root, "apps", app, "dist");
  const actual = await artifactHashes(directory);
  if (JSON.stringify(actual) !== JSON.stringify(artifact.files)) {
    throw new Error(`Build smoke ${app} output is missing, stale or changed after its build.`);
  }
  const html = await readFile(path.join(directory, "index.html"), "utf8");
  const { scripts, styles } = smokeHtmlAssets(app, html, actual);
  for (const file of [...scripts, ...styles]) {
    if (!actual[file]) throw new Error(`Build smoke ${app} references a missing asset: ${file}`);
    const content = await readFile(path.join(directory, file), "utf8");
    if (!content.trim() || /^\s*(?:<!doctype|<html)/i.test(content)) {
      throw new Error(`Build smoke ${app} asset is empty or HTML: ${file}`);
    }
  }
  return {
    app,
    files: Object.keys(actual).length,
    indexSha256: actual["index.html"],
    scripts,
    styles,
  };
}
