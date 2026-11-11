import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import type { InlineConfig, Plugin } from "vite";

import { organizationIntelligence, type OrganizationIntelligenceSnapshot } from "../../scripts/vite-organization-intelligence.mts";

const appRoot = dirname(fileURLToPath(import.meta.url));
const entryRoot = join(appRoot, "src/features/intelligence/export");
interface Target { readonly origin: string; readonly base_path: string }

function exportPlugin(target: Target): Plugin {
  const metadata = join(appRoot, "src/components/PageMetadata/PageMetadata");
  const forbidden = (path: string) => /\/(?:features\/store|content\/store)\//.test(path)
    || /\/content\/publication\.(?:ts|tsx)$/.test(path) || path.includes("virtual:store-catalog") || path.includes("vite-store-catalog");
  return { name: "portable-intelligence-composition", enforce: "pre",
    resolveId(source, importer) {
      if (source === "virtual:intelligence-export-target") return "\0intelligence-export-target";
      const cleanSource = source.split("?", 1)[0]!;
      const path = cleanSource.startsWith(".") && importer ? resolve(dirname(importer.split("?", 1)[0]!), cleanSource) : cleanSource;
      if (path.replace(/\.tsx$/, "") === metadata) return join(entryRoot, "metadata.tsx");
      if (forbidden(path)) throw new Error("Product modules are outside the Intelligence export");
      return undefined;
    },
    load(id) { if (id === "\0intelligence-export-target") return `export const target = ${JSON.stringify(target)};`; return undefined; },
    generateBundle(_options, bundle) {
      for (const output of Object.values(bundle)) if (output.type === "chunk")
        if (!Object.keys(output.modules).every((path) => !forbidden(path))) throw new Error("Product modules are outside the Intelligence export");
    },
  };
}

/** An opt-in composition; the ordinary website Vite configuration is untouched. */
export function createIntelligenceExportConfig(target: Target, snapshot: OrganizationIntelligenceSnapshot, site: string): InlineConfig {
  return { configFile: false, root: entryRoot, publicDir: false, base: target.base_path,
    plugins: [exportPlugin(target), react(), organizationIntelligence({ snapshot })],
    resolve: { dedupe: ["react", "react-dom"] },
    build: { outDir: site, emptyOutDir: true, sourcemap: false, assetsInlineLimit: 0, cssCodeSplit: false },
  };
}
