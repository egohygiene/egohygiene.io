import { describe, expect, it } from "vitest";

import { parseMarkdownDocument, renderMarkdownToHtml } from "./index";

describe("content", () => {
  it("creates predictable slugs", () => {
    expect(parseMarkdownDocument("# Hello", "Getting Started").slug).toBe("getting-started");
  });

  it("renders simple markdown", () => {
    expect(renderMarkdownToHtml("# Title\n\nParagraph")).toContain("<h1>Title</h1>");
  });
});
