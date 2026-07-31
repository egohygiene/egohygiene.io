import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import Sitemap from "vite-plugin-sitemap";
import svgr from "vite-plugin-svgr";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const workspaceRoot = fileURLToPath(new URL("../../", import.meta.url));

const defaultSiteOrigin = "https://egohygiene.io";

const sitemapRoutes: string[] = [
  "/",
];

function readBoolean(value: string | undefined): boolean {
  return value === "1" || value?.toLowerCase() === "true";
}

function readPort(
  value: string | undefined,
  fallback: number,
  variableName: string,
): number {
  if (value === undefined || value.length === 0) {
    return fallback;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(
      `${variableName} must be an integer between 1 and 65535.`,
    );
  }

  return port;
}

function readHttpUrl(value: string, variableName: string): URL {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(`${variableName} must be a valid absolute URL.`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${variableName} must use HTTP or HTTPS.`);
  }

  return url;
}

export default defineConfig(({ mode }) => {
  /*
   * Load every environment variable for use by this configuration file.
   * Vite still exposes only VITE_* variables to browser code because of
   * envPrefix below. Never spread this object into define or import.meta.env.
   */
  const env = loadEnv(mode, workspaceRoot, "");

  const siteOrigin = readHttpUrl(
    env.SITE_ORIGIN || defaultSiteOrigin,
    "SITE_ORIGIN",
  ).origin;

  const apiProxyTarget =
    env.API_PROXY_TARGET === undefined
      ? undefined
      : readHttpUrl(env.API_PROXY_TARGET, "API_PROXY_TARGET").href.replace(
          /\/$/,
          "",
        );

  const analyzeBundle =
    mode === "analyze" || readBoolean(env.ANALYZE_BUNDLE);

  const sourceMaps = readBoolean(env.SOURCE_MAPS);

  return {
    root: appRoot,
    envDir: workspaceRoot,
    envPrefix: "VITE_",

    base: "/",
    publicDir: "public",
    appType: "spa",
    clearScreen: false,

    plugins: [
      /*
       * Tailwind CSS 4 integration.
       */
      tailwindcss(),

      /*
       * React Fast Refresh and JSX transformation.
       * React's automatic JSX runtime is already the default.
       */
      react(),

      /*
       * Import an SVG as a React component with:
       *
       * import Logo from "./logo.svg?react";
       */
      svgr({
        include: "**/*.svg?react",
        svgrOptions: {
          ref: true,
          titleProp: true,
        },
      }),

      /*
       * WebAssembly ESM support for visualization and computational packages.
       * The top-level-await transform preserves compatibility with our
       * Baseline Widely Available browser target.
       */
      wasm(),
      topLevelAwait(),

      /*
       * Installable application manifest and offline application shell.
       *
       * Updates wait until the existing application is closed or an update
       * prompt is implemented, avoiding unexpected mid-session reloads.
       */
      VitePWA({
        strategies: "generateSW",
        registerType: "prompt",
        injectRegister: "auto",

        includeAssets: [
          "favicon.svg",
          "robots.txt",
          "llms.txt",
          "fonts/*.woff",
          "fonts/*.woff2",
        ],

        manifest: {
          id: "/",
          name: "Ego Hygiene",
          short_name: "Ego Hygiene",
          description:
            "A cross-platform application and educational ecosystem for healthier relationships with identity, emotions, thought patterns, and personal growth.",

          lang: "en",
          dir: "ltr",

          start_url: "/",
          scope: "/",

          display: "standalone",
          display_override: [
            "window-controls-overlay",
            "standalone",
            "minimal-ui",
          ],

          orientation: "any",

          background_color: "#0d1117",
          theme_color: "#0d1117",

          categories: [
            "education",
            "health",
            "lifestyle",
          ],

          icons: [
            {
              src: "/icons/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-maskable-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },

        workbox: {
          cleanupOutdatedCaches: true,

          /*
           * Cache the application shell and generated frontend assets.
           * Large content images and media remain network-managed instead
           * of making the initial service worker excessively large.
           */
          globPatterns: [
            "**/*.{js,css,html,ico,svg,webmanifest,woff,woff2}",
          ],

          navigateFallback: "/index.html",
          navigateFallbackDenylist: [
            /^\/api(?:\/|$)/,
          ],
        },

        /*
         * Service workers are disabled during normal development because
         * cached files make application debugging confusing. Set PWA_DEV=true
         * when specifically testing installation or offline behavior.
         */
        devOptions: {
          enabled: readBoolean(env.PWA_DEV),
        },
      }),

      /*
       * Generate dist/sitemap.xml during production builds.
       *
       * robots.txt remains hand-authored in public/ so the plugin must not
       * overwrite it.
       */
      Sitemap({
        hostname: siteOrigin,
        dynamicRoutes: sitemapRoutes,
        readable: true,
        generateRobotsTxt: false,

        changefreq: {
          "*": "weekly",
          "/": "weekly",
        },

        priority: {
          "*": 0.7,
          "/": 1,
        },
      }),

      /*
       * Generate dist/bundle-analysis.html only when explicitly requested.
       */
      ...(analyzeBundle
        ? [
            visualizer({
              filename: fileURLToPath(
                new URL("./dist/bundle-analysis.html", import.meta.url),
              ),
              template: "treemap",
              title: "Ego Hygiene bundle analysis",
              gzipSize: true,
              brotliSize: true,
              open: false,
            }),
          ]
        : []),
    ],

    resolve: {
      /*
       * Vite 8 natively resolves aliases from the closest matching tsconfig.
       */
      tsconfigPaths: true,

      /*
       * Workspace packages must share these stateful runtime dependencies.
       * Duplicate React or Three.js instances can cause hook/context failures.
       */
      dedupe: [
        "react",
        "react-dom",
        "three",
      ],
    },

    server: {
      host: env.DEV_HOST || "127.0.0.1",
      port: readPort(env.DEV_PORT, 5173, "DEV_PORT"),
      strictPort: true,

      /*
       * Enable only when API_PROXY_TARGET is defined.
       *
       * Example:
       * API_PROXY_TARGET=http://localhost:8000
       */
      ...(apiProxyTarget
        ? {
            proxy: {
              "/api": {
                target: apiProxyTarget,
                changeOrigin: true,
                ws: true,
              },
            },
          }
        : {}),
    },

    preview: {
      host: env.PREVIEW_HOST || "127.0.0.1",
      port: readPort(env.PREVIEW_PORT, 4173, "PREVIEW_PORT"),
      strictPort: true,
    },

    build: {
      outDir: "dist",
      emptyOutDir: true,

      /*
       * Hidden source maps support production error monitoring without adding
       * sourceMappingURL comments to the deployed JavaScript.
       */
      sourcemap: sourceMaps ? "hidden" : false,

      reportCompressedSize: true,
    },

    /*
     * Top-level plugins apply to workers during development. Worker builds
     * require fresh plugin instances through worker.plugins.
     */
    worker: {
      plugins: () => [
        wasm(),
        topLevelAwait(),
      ],
    },
  };
});

