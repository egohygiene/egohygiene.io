import { readdirSync, realpathSync, statSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";
import type { Plugin } from "vite";

const playgroundRoot = fileURLToPath(new URL("../apps/playground/", import.meta.url));

function expression(node: ts.Expression): ts.Expression {
  let value = node;
  while (
    ts.isParenthesizedExpression(value) ||
    ts.isAsExpression(value) ||
    ts.isTypeAssertionExpression(value) ||
    ts.isSatisfiesExpression(value) ||
    ts.isNonNullExpression(value)
  )
    value = value.expression;
  return value;
}

function importMetaUrl(node: ts.Expression): boolean {
  const value = expression(node);
  return (
    ts.isPropertyAccessExpression(value) &&
    value.name.text === "url" &&
    ts.isMetaProperty(value.expression) &&
    value.expression.keywordToken === ts.SyntaxKind.ImportKeyword &&
    value.expression.name.text === "meta"
  );
}

function realPath(filename: string): string | null {
  try {
    return realpathSync(filename);
  } catch {
    return null;
  }
}

function inspectUrl(node: ts.Node, inspect: (value: string, dynamic?: boolean) => void): void {
  if (
    !ts.isNewExpression(node) ||
    !ts.isIdentifier(node.expression) ||
    node.expression.text !== "URL" ||
    node.arguments?.length !== 2
  )
    return;
  const [argument, base] = node.arguments;
  if (!base || !importMetaUrl(base) || !argument) return;
  const value = expression(argument);
  if (ts.isStringLiteralLike(value)) {
    inspect(value.text);
    return;
  }
  if (ts.isTemplateExpression(value)) {
    const prefix = value.head.text;
    inspect(prefix.slice(0, prefix.lastIndexOf("/") + 1) || "./", true);
    return;
  }
  throw new Error("Unresolved public asset references require explicit review.");
}

/** Keep experiment modules out of public app builds, including through symlinks. */
export function excludePlayground(root = playgroundRoot): Plugin {
  const protectedRoot = realpathSync(root);
  let buildRoot = process.cwd();
  function contains(parent: string, filename: string): boolean {
    const path = relative(parent, filename);
    return path === "" || (path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path));
  }
  function check(filename: string): void {
    let actual: string;
    try {
      actual = realpathSync(filename);
    } catch {
      return;
    }
    if (contains(protectedRoot, actual)) {
      throw new Error("Public applications cannot import private playground modules or assets.");
    }
  }
  function asset(value: string, importer: string, dynamic = false): void {
    if (/^[a-z][a-z0-9+.-]*:/iu.test(value) || value.startsWith("//")) return;
    const decoded = decodeURIComponent(value.split(/[?#]/u)[0] ?? "");
    if (!decoded) return;
    const filename = decoded.startsWith("/")
      ? resolve(buildRoot, `.${decoded}`)
      : resolve(dirname(importer), decoded);
    check(filename);
    if (dynamic && contains(filename, protectedRoot)) {
      throw new Error("Dynamic public asset references may not traverse the private playground.");
    }
  }
  function checkPublicTree(directory: string): void {
    const pending = [directory];
    const visited = new Set<string>();
    let count = 0;
    while (pending.length) {
      const filename = pending.pop() ?? directory;
      check(filename);
      const actual = realPath(filename);
      if (!actual || visited.has(actual)) continue;
      visited.add(actual);
      if (++count > 20000) throw new Error("Public asset inventory exceeds its inspection budget.");
      if (statSync(actual).isDirectory()) {
        pending.push(...readdirSync(actual).map((name) => resolve(actual, name)));
      }
    }
  }
  return {
    name: "exclude-private-playground",
    enforce: "pre",
    configResolved(config) {
      buildRoot = config.root;
      if (config.publicDir) checkPublicTree(config.publicDir);
    },
    load(id) {
      const filename = id.split("?")[0] ?? "";
      if (!filename || !isAbsolute(filename)) return null;
      check(filename);
      return null;
    },
    transform(code, id) {
      const filename = id.split("?")[0] ?? "";
      if (!filename || !isAbsolute(filename)) return null;
      if (/\.[cm]?[jt]sx?$/u.test(filename)) {
        const source = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true);
        function visit(node: ts.Node): void {
          inspectUrl(node, (value, dynamic) => asset(value, filename, dynamic));
          ts.forEachChild(node, visit);
        }
        visit(source);
      } else if (/\.(?:css|scss|less)$/u.test(filename)) {
        // Inspect source references before Vite can inline their contents.
        const values = [
          ...code.matchAll(/url\(\s*("[^"]*"|'[^']*'|[^)]*)\s*\)/giu),
          ...code.matchAll(/@import\s+("[^"]*"|'[^']*')/giu),
        ];
        for (const match of values) {
          let value = (match[1] ?? "").replace(/\/\*[\s\S]*?\*\//gu, "").trim();
          if (value.includes("\\"))
            throw new Error("Escaped public asset references require explicit review.");
          value = value.replace(/^["']|["']$/gu, "");
          asset(value, filename);
        }
      }
      return null;
    },
    generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== "asset") continue;
        for (const filename of file.originalFileNames) check(resolve(buildRoot, filename));
      }
    },
  };
}
