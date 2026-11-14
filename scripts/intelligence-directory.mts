import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { dirname, parse, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  IntelligenceDirectory,
  RepositoryDirectoryEntry,
} from "../apps/egohygiene.io/src/features/intelligence/types.ts";
import { decodeReviewJson } from "./intelligence-review-json.mts";

const root = fileURLToPath(
  new URL("../contracts/organization-intelligence/directory/", import.meta.url),
);
const reviews = fileURLToPath(
  new URL("../contracts/organization-intelligence/reviews/", import.meta.url),
);
const files = [
  "scripts/project_repository_directory.py",
  "docs/intelligence/repository-directory.json",
  "docs/intelligence/repository-directory.schema.json",
  "docs/intelligence/repositories.source.json",
  "docs/reviews/2026-11-13-organization-live-publication.json",
  "docs/reviews/2026-11-14-foundation-selected-ten.json",
];
const hash = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");
const requireInput: (condition: unknown) => asserts condition = (condition) => {
  if (!condition) throw new Error("Repository directory admission denied");
};
const object = (value: unknown): Record<string, unknown> => {
  requireInput(value !== null && typeof value === "object" && !Array.isArray(value));
  return value as Record<string, unknown>;
};
const closed = (value: unknown, names: readonly string[]): Record<string, unknown> => {
  const record = object(value);
  requireInput(
    Object.keys(record).length === names.length &&
      names.every((name) => Object.hasOwn(record, name)),
  );
  return record;
};
async function readRegular(path: string): Promise<Buffer> {
  const absolute = resolve(path);
  for (let current = absolute; current !== parse(current).root; current = dirname(current))
    requireInput(!(await lstat(current)).isSymbolicLink());
  const info = await lstat(absolute);
  requireInput(info.isFile() && info.size > 0 && info.size <= 262144);
  const bytes = await readFile(absolute);
  requireInput(bytes.length <= 262144);
  return bytes;
}

/** Optional public navigation, independently admitted from Core model evidence.
 * The root override is a bounded local test seam, never a browser input. */
export async function loadRepositoryDirectory(
  options: { readonly root?: string; readonly allowedRepositories?: ReadonlySet<string> } = {},
): Promise<IntelligenceDirectory> {
  try {
    const directoryRoot = options.root ?? root;
    const lock = closed(
      decodeReviewJson(await readRegular(resolve(directoryRoot, "input-lock.json"))),
      ["schema", "owner", "revision", "payload_path", "schema_path", "validator_path", "files"],
    );
    requireInput(
      lock["schema"] === "egohygiene.website.repository-directory-input-lock/v1" &&
        lock["owner"] === "egohygiene/.github" &&
        /^[a-f0-9]{40}$/.test(String(lock["revision"])) &&
        lock["payload_path"] === files[1] &&
        lock["schema_path"] === files[2] &&
        lock["validator_path"] === files[0],
    );
    const pins = closed(lock["files"], files);
    const retained = new Map<string, Buffer>();
    for (const path of files) {
      requireInput(typeof pins[path] === "string" && /^[a-f0-9]{64}$/.test(pins[path]));
      const bytes = await readRegular(resolve(directoryRoot, "owner", path));
      requireInput(hash(bytes) === pins[path]);
      retained.set(path, bytes);
    }
    // Execute only the exact reviewed owner helper, with its original immutable
    // public inputs. It validates semantics and reproduces the entire projection.
    // No network, provider discovery, schema engine or consumer code executes.
    execFileSync("python3", ["-I", resolve(directoryRoot, "owner", files[0] ?? ""), "--check"], {
      cwd: resolve(directoryRoot, "owner"),
      timeout: 10000,
      maxBuffer: 4096,
      stdio: "pipe",
    });
    const payload = object(decodeReviewJson(retained.get(files[1] ?? "") ?? new Uint8Array()));
    const catalogLock = object(
      decodeReviewJson(await readRegular(resolve(reviews, "input-lock.json"))),
    );
    const catalogPin = object(object(catalogLock["sources"])["catalog"]);
    requireInput(catalogPin["file"] === "hygiene.public-repositories.v1.json");
    const catalogBytes = await readRegular(resolve(reviews, "hygiene.public-repositories.v1.json"));
    requireInput(hash(catalogBytes) === catalogPin["sha256"]);
    const catalog = object(decodeReviewJson(catalogBytes));
    requireInput(Array.isArray(catalog["repositories"]));
    const publicRows = new Map(
      catalog["repositories"]
        .map(object)
        .filter((row) => row["visibility"] === "public")
        .map((row) => [row["full_name"], row]),
    );
    const source = object(payload["catalog"]);
    requireInput(
      source["repository"] === catalogPin["repository"] &&
        source["revision"] === catalogPin["revision"] &&
        source["sha256"] === catalogPin["sha256"] &&
        source["path"] === catalogPin["path"],
    );
    requireInput(Array.isArray(payload["entries"]));
    const entries = payload["entries"] as RepositoryDirectoryEntry[];
    for (const entry of entries) {
      const admitted = publicRows.get(entry.repository);
      requireInput(admitted && admitted["repository_id"] === entry.repository_id);
    }
    const selected = entries.filter(
      (entry) => !options.allowedRepositories || options.allowedRepositories.has(entry.repository),
    );
    return {
      state: "admitted",
      source: {
        repository: "egohygiene/.github",
        revision: String(lock["revision"]),
        path: String(lock["payload_path"]),
        sha256: String(pins[String(lock["payload_path"])]),
        schemaSha256: String(pins[String(lock["schema_path"])]),
        validatorSha256: String(pins[String(lock["validator_path"])]),
      },
      catalog: payload["catalog"] as NonNullable<IntelligenceDirectory["catalog"]>,
      sourceInventory: payload["source_inventory"] as NonNullable<
        IntelligenceDirectory["sourceInventory"]
      >,
      entries: selected,
    };
  } catch {
    // A failed navigation input cannot erase independently admitted models or
    // disclose rejected payload identities, counts, diagnostics or local paths.
    return {
      state: "unavailable",
      source: null,
      catalog: null,
      sourceInventory: null,
      entries: [],
    };
  }
}
