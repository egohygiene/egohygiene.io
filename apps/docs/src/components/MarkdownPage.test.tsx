import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import architectureSource from "../content/architecture.mdx?raw";
import developmentSource from "../content/development.mdx?raw";
import gettingStartedSource from "../content/getting-started.mdx?raw";
import packagesSource from "../content/packages.mdx?raw";
import { HomePage } from "../pages/HomePage";
import { MarkdownPage } from "./MarkdownPage";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function renderSource(source: string, title = "Test document") {
  return render(<MarkdownPage source={source} title={title} />);
}

describe("documentation content adapter (simulated DOM)", () => {
  it.each([
    ["Getting started", gettingStartedSource],
    ["Local development", developmentSource],
    ["Repository architecture", architectureSource],
    ["Package overview", packagesSource],
  ])("renders the actual %s document with semantic headings, code and links", (title, source) => {
    const result = renderSource(source, title);
    expect(result.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(result.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(result.container.querySelector("article code")).not.toBeNull();
    expect(result.getAllByRole("link").length).toBeGreaterThan(0);
    expect(result.container.querySelector("article")?.textContent).not.toContain("**");
    expect(result.container.querySelector("article")?.textContent).not.toMatch(/\]\(\//);
  });

  it("keeps the documented command scopes explicit and code semantically marked", () => {
    const result = renderSource(developmentSource);
    const inlineCode = [...result.container.querySelectorAll("code")].map(
      (node) => node.textContent,
    );
    expect(inlineCode).toContain("pnpm dev");
    expect(inlineCode).toContain("pnpm build");
    expect(inlineCode).toContain("pnpm typecheck");
    const codeBlocks = [...result.container.querySelectorAll("pre > code")].map(
      (node) => node.textContent,
    );
    expect(codeBlocks).toContain("pnpm --filter @egohygiene/docs dev\n");
    expect(codeBlocks).toContain(
      "pnpm --filter @egohygiene/docs build\npnpm --filter @egohygiene/docs preview --host 127.0.0.1\n",
    );
    expect(codeBlocks.join("\n")).toContain("pnpm --filter @egohygiene/content typecheck");
    expect(codeBlocks.join("\n")).toContain("pnpm --filter @egohygiene/docs typecheck");
    expect(result.container.textContent).toContain("starts only the public website/store");
    expect(result.container.textContent).toContain(
      "does not replace the docs/package checks above",
    );
    expect(result.getByRole("link", { name: "Getting started" })).toHaveAttribute(
      "href",
      "/getting-started",
    );
  });

  it("renders pinned, frozen setup examples without requiring a global pnpm install", () => {
    const result = renderSource(gettingStartedSource);
    expect(result.getByText("24.21.0", { exact: true }).tagName).toBe("STRONG");
    expect(result.getByText("11.28.5", { exact: true }).tagName).toBe("STRONG");
    const code = [...result.container.querySelectorAll("pre > code")]
      .map((node) => node.textContent)
      .join("\n");
    expect(code).toContain("pnpm install --frozen-lockfile --ignore-scripts");
    expect(code).toContain(
      "npm exec --yes --ignore-scripts --package=pnpm@11.28.5 -- pnpm install --frozen-lockfile --ignore-scripts",
    );
    expect(result.container.textContent).not.toContain("corepack enable");
  });

  it("renders nested/common Markdown through the shared semantic tree", () => {
    const result = renderSource(
      [
        "# A **strong** heading",
        "",
        "Read *carefully*, use `pnpm dev`, then visit [the guide](/development).",
        "",
        "> A quoted note.",
        "",
        "3. First item",
        "   - Nested item",
        "4. Second item",
        "",
        "```sh",
        'printf "<hello>"',
        "```",
      ].join("\n"),
    );
    expect(
      result.getByRole("heading", { name: "A strong heading" }).querySelector("strong"),
    ).toHaveTextContent("strong");
    expect(result.container.querySelector("em")).toHaveTextContent("carefully");
    expect(result.container.querySelector("blockquote")).toHaveTextContent("A quoted note.");
    expect(result.container.querySelector("ol")).toHaveAttribute("start", "3");
    expect(result.container.querySelector("ol ul li")).toHaveTextContent("Nested item");
    expect(result.getByRole("link", { name: "the guide" })).toHaveAttribute("href", "/development");
    expect(result.container.querySelector("pre > code")?.textContent).toBe('printf "<hello>"\n');
    expect(result.container.querySelector("hello")).toBeNull();
  });

  it("keeps raw HTML and fenced payloads literal in the React adapter", () => {
    const rawHtml = '<img src="x" onerror="alert(1)"><script>alert(2)</script>';
    const code = '<iframe src="https://example.invalid"></iframe>\n<svg onload="alert(3)"></svg>';
    const result = renderSource(`${rawHtml}\n\n\`\`\`html\n${code}\n\`\`\``);
    expect(result.container.textContent).toContain(rawHtml);
    expect(result.container.querySelector("pre > code")?.textContent).toBe(`${code}\n`);
    expect(
      result.container.querySelector("img, script, iframe, svg, [onerror], [onload]"),
    ).toBeNull();
  });

  it("honors the shared URL policy without reintroducing active destinations", () => {
    const result = renderSource(
      [
        "[bad](javascript:alert%281%29)",
        "",
        "![image text](data:image/svg+xml;base64,PHN2Zz4=)",
        "",
        "[guide](/development?view=commands#checks)",
      ].join("\n"),
    );
    expect(result.queryByRole("link", { name: "bad" })).not.toBeInTheDocument();
    expect(result.getByText("bad", { exact: true })).toBeInTheDocument();
    expect(result.container.querySelector("img")).toBeNull();
    expect(result.container.textContent).toContain("image text");
    expect(result.getByRole("link", { name: "guide" })).toHaveAttribute(
      "href",
      "/development?view=commands#checks",
    );
  });

  it("renders empty input without inventing a paragraph or executable fallback", () => {
    const result = renderSource(" \n\t ");
    expect(result.getByRole("article")).toBeEmptyDOMElement();
  });

  it("renders a heading-only document without an empty body block", () => {
    const result = renderSource("# Only a heading");
    expect(result.getByRole("heading", { level: 1 })).toHaveTextContent("Only a heading");
    expect(result.container.querySelector("p")).toBeNull();
  });

  it("preserves whitespace and backticks in a code-only document", () => {
    const result = renderSource("~~~text\n  nested `ticks`\n\n    keep spaces\n~~~");
    expect(result.container.querySelector("pre > code")?.textContent).toBe(
      "  nested `ticks`\n\n    keep spaces\n",
    );
    expect(result.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("renders repeated blocks and items without duplicate React keys", () => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const result = renderSource("## Repeat\n\nSame\n\n## Repeat\n\nSame\n\n- Item\n- Item");
    expect(result.getAllByRole("heading", { level: 2, name: "Repeat" })).toHaveLength(2);
    expect(result.getAllByText("Same", { exact: true })).toHaveLength(2);
    expect(result.getAllByRole("listitem")).toHaveLength(2);
    expect(errors).not.toHaveBeenCalled();
  });

  it("routes the docs home guidance to the current setup and development pages", () => {
    const result = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(result.getByRole("link", { name: "Read the setup instructions" })).toHaveAttribute(
      "href",
      "/getting-started",
    );
    expect(result.getByRole("link", { name: "Read the development guide" })).toHaveAttribute(
      "href",
      "/development",
    );
    expect(result.container.querySelector("code")).toHaveTextContent("pnpm dev");
    expect(result.container.textContent).toContain("starts the website/store");
  });
});
