import { spawn, spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const storefrontPackage = "@egohygiene/egohygiene.io";

/** Check the bounded Node release range declared by this repository. */
export function supportsNode(version, range) {
  const required = /^>=(\d+)\.(\d+)\.(\d+) <(\d+)$/.exec(range);
  const current = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!required || !current) return false;
  const [, minimumMajor, minimumMinor, minimumPatch, maximumMajor] = required.map(Number);
  const [, major, minor, patch] = current.map(Number);
  return (
    major < maximumMajor &&
    (major > minimumMajor ||
      (major === minimumMajor &&
        (minor > minimumMinor || (minor === minimumMinor && patch >= minimumPatch))))
  );
}

async function readToolchain() {
  const manifest = JSON.parse(await readFile(resolve(repositoryRoot, "package.json"), "utf8"));
  const toolVersions = await readFile(resolve(repositoryRoot, ".tool-versions"), "utf8");
  const nodePin = /^nodejs\s+(\d+\.\d+\.\d+)$/m.exec(toolVersions)?.[1];
  const pnpmPin = /^pnpm@(\d+\.\d+\.\d+)$/.exec(manifest.packageManager)?.[1];
  const declaredPnpm = /^pnpm\s+(\d+\.\d+\.\d+)$/m.exec(toolVersions)?.[1];
  if (
    !nodePin ||
    !pnpmPin ||
    pnpmPin !== declaredPnpm ||
    pnpmPin !== manifest.engines?.pnpm ||
    !supportsNode(nodePin, manifest.engines?.node)
  ) {
    throw new Error(
      "The Node/pnpm declarations are inconsistent. Check package.json and .tool-versions.",
    );
  }
  if (!supportsNode(process.versions.node, manifest.engines.node)) {
    throw new Error(
      [
        `Node ${process.versions.node} is active; this checkout requires ${manifest.engines.node}.`,
        `Use the pinned Node ${nodePin}, then retry. With mise:`,
        `  mise install node@${nodePin}`,
        `  mise exec node@${nodePin} -- task preview:store`,
        "For asdf or a direct Node install, see docs/store/local-preview.md.",
      ].join("\n"),
    );
  }
  return { pnpmPin };
}

function probeVersion(command) {
  return spawnSync(command, ["--version"], {
    cwd: repositoryRoot,
    encoding: "utf8",
    timeout: 15_000,
    env: { ...process.env, COREPACK_ENABLE_DOWNLOAD_PROMPT: "0" },
  });
}

function resolvePnpm(pnpmPin) {
  const installed = probeVersion("pnpm");
  if (installed.status === 0 && installed.stdout.trim() === pnpmPin) {
    return { command: "pnpm", prefix: [] };
  }
  if (probeVersion("npm").status !== 0) {
    throw new Error(
      `pnpm ${pnpmPin} is unavailable and npm is missing. Install Node with npm, or activate pnpm ${pnpmPin}, then retry.`,
    );
  }
  console.log(`Using pnpm ${pnpmPin} from npm's cache; no global package installation is needed.`);
  return {
    command: "npm",
    prefix: ["exec", "--yes", "--ignore-scripts", `--package=pnpm@${pnpmPin}`, "--", "pnpm"],
  };
}

function readPort(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 65_535) {
    throw new Error(`${name} must be a port between 1 and 65535.`);
  }
  return value;
}

function serverArguments(mode) {
  const openBrowser = process.env["STORE_OPEN_BROWSER"] ?? "true";
  if (!["true", "false"].includes(openBrowser)) {
    throw new Error("STORE_OPEN_BROWSER must be true or false.");
  }
  return [
    "--filter",
    storefrontPackage,
    mode,
    ...(mode === "preview" ? ["--outDir", "dist-preview"] : []),
    "--host",
    "127.0.0.1",
    "--port",
    mode === "preview"
      ? readPort("STORE_PREVIEW_PORT", "4173")
      : readPort("STORE_DEV_PORT", "5173"),
    "--strictPort",
    ...(openBrowser === "true" ? ["--open", "/store"] : []),
  ];
}

async function execute(manager, arguments_, environment = {}) {
  return new Promise((resolveExitCode, reject) => {
    const child = spawn(manager.command, [...manager.prefix, ...arguments_], {
      cwd: repositoryRoot,
      stdio: "inherit",
      env: { ...process.env, ...environment },
    });
    const interrupt = () => child.kill("SIGINT");
    const terminate = () => child.kill("SIGTERM");
    process.on("SIGINT", interrupt);
    process.on("SIGTERM", terminate);
    const cleanup = () => {
      process.off("SIGINT", interrupt);
      process.off("SIGTERM", terminate);
    };
    child.once("error", (error) => {
      cleanup();
      reject(error);
    });
    child.once("close", (code, signal) => {
      cleanup();
      resolveExitCode(code ?? (signal === "SIGINT" ? 130 : signal === "SIGTERM" ? 143 : 1));
    });
  });
}

/** Run repository commands through the declared pnpm without changing global tools. */
export async function runStoreEnvironment([command, ...arguments_]) {
  if (
    !["setup", "build", "preview", "dev", "run"].includes(command) ||
    (command === "run" && arguments_.length === 0)
  ) {
    throw new Error(
      "Usage: node scripts/store-environment.mjs <setup|build|preview|dev|run pnpm-arguments...>",
    );
  }
  const { pnpmPin } = await readToolchain();
  const manager = resolvePnpm(pnpmPin);
  if (command === "setup") {
    return execute(manager, ["install", "--frozen-lockfile", "--ignore-scripts"]);
  }
  if (command === "run") return execute(manager, arguments_);
  const previewEnvironment = { VITE_STORE_PREVIEW: "true" };
  if (command === "build") {
    return execute(
      manager,
      ["--filter", storefrontPackage, "build", "--outDir", "dist-preview"],
      previewEnvironment,
    );
  }
  return execute(manager, serverArguments(command), previewEnvironment);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runStoreEnvironment(process.argv.slice(2))
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error) => {
      console.error(`Store setup: ${error.message}`);
      process.exitCode = 1;
    });
}
