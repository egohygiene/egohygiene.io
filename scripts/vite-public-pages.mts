import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

import type { Plugin } from "vite";

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Read the completed artifact, not source catalog data or another route registry. */
export async function loadPreviewPageRewrites(
  directory: string,
): Promise<ReadonlyMap<string, string>> {
  try {
    const receipt: unknown = JSON.parse(
      await readFile(join(directory, "public-routes.json"), "utf8"),
    );
    if (!record(receipt) || receipt["schemaVersion"] !== 1 || !Array.isArray(receipt["routes"])) {
      throw new Error("Unsupported generated route receipt.");
    }
    const rewrites = new Map<string, string>();
    for (const route of receipt["routes"] as unknown[]) {
      if (
        !record(route) ||
        typeof route["pathname"] !== "string" ||
        !/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/.test(
          route["pathname"],
        ) ||
        /^\/(?:assets(?:\/|$)|store\/preview(?:\/|$))/.test(route["pathname"])
      ) {
        throw new Error("Invalid generated preview pathname.");
      }
      const pathname = route["pathname"];
      const file = pathname === "/" ? "index.html" : `${pathname.slice(1)}/index.html`;
      if (route["file"] !== file || rewrites.has(pathname)) {
        throw new Error(`Conflicting generated preview file: ${pathname}`);
      }
      if (typeof route["htmlSha256"] !== "string" || !/^[a-f0-9]{64}$/.test(route["htmlSha256"])) {
        throw new Error(`Missing generated HTML hash: ${pathname}`);
      }
      const html = await readFile(join(directory, file), "utf8");
      if (
        createHash("sha256").update(html).digest("hex") !== route["htmlSha256"] ||
        !html.includes(`<div id="root" data-prerendered-path="${pathname}">`)
      ) {
        throw new Error(`Generated HTML does not match its receipt: ${pathname}`);
      }
      rewrites.set(pathname, `/${file}`);
    }
    if (!rewrites.has("/")) throw new Error("Generated preview receipt lacks the homepage.");
    return rewrites;
  } catch (cause) {
    throw new Error(
      "Cannot preview generated public pages. Run a successful normal build before starting preview.",
      { cause },
    );
  }
}

/** Preserve the visible URL and query; only Vite's internal file lookup changes. */
export function publicPagePreviewUrl(
  url: string,
  method: string | undefined,
  rewrites: ReadonlyMap<string, string>,
): string {
  if (method !== "GET" && method !== "HEAD") return url;
  const queryIndex = url.indexOf("?");
  const pathname = queryIndex === -1 ? url : url.slice(0, queryIndex);
  const output = rewrites.get(pathname);
  return output ? `${output}${queryIndex === -1 ? "" : url.slice(queryIndex)}` : url;
}

/** Vite preview otherwise falls back to home HTML for clean directory routes. */
export function publicPagePreview(): Plugin {
  return {
    name: "public-page-preview",
    async configurePreviewServer(server) {
      const directory = resolve(
        server.config.root,
        server.config.environments["client"]!.build.outDir,
      );
      if (directory === resolve(server.config.root, "dist-preview")) {
        // The existing explicitly isolated SPA artifact has no generated receipt.
        // This hook disables Vite's default missing-directory check, so retain it.
        await readFile(join(directory, "index.html"));
        return;
      }
      const rewrites = await loadPreviewPageRewrites(directory);
      // Register before Vite's static-file and SPA fallback middleware. Unknown
      // paths, assets and non-GET/HEAD methods retain Vite's existing behavior.
      server.middlewares.use((request, _response, next) => {
        if (request.url) request.url = publicPagePreviewUrl(request.url, request.method, rewrites);
        next();
      });
    },
  };
}
