import { describe, expect, it } from "vitest";

import { parseMarkdownDocument, renderMarkdownToHtml } from "./index";

function rendered(source: string): DocumentFragment {
  const template = document.createElement("template");
  template.innerHTML = renderMarkdownToHtml(source);
  return template.content;
}

const blockedUrls = [
  "javascript:alert(1)",
  "JaVaScRiPt:alert(1)",
  "jav&#x61;script:alert(1)",
  "javascript&#58;alert(1)",
  "java&#9;script:alert(1)",
  "java&#10;script:alert(1)",
  "java&#13;script:alert(1)",
  "&#1;javascript:alert(1)",
  "&#127;javascript:alert(1)",
  "&#128;javascript:alert(1)",
  "data:text/html;base64,PHNjcmlwdD4=",
  "vbscript:msgbox(1)",
  "file:///private/example.txt",
  "blob:https://example.test/identifier",
  "//example.test/path",
  "&#92;&#92;example.test/path",
  "https:&#92;&#92;example.test/path",
  "java%09script:alert(1)",
];

describe("Markdown metadata", () => {
  it.each(["", " \n\t", "# Heading only", "Title\n=====", "```js\ncode()\n```", "    code()\n"])(
    "omits absent descriptions for %j",
    (source) => {
      const result = parseMarkdownDocument(source, "Document");
      expect(result).not.toHaveProperty("description");
      expect(result.body).toBe(source);
      expect(result.tree.type).toBe("root");
    },
  );

  it("retains caller title and stable slug instead of inferring identity from headings", () => {
    const result = parseMarkdownDocument("# A different heading", "Getting Started");
    expect(result.title).toBe("Getting Started");
    expect(result.slug).toBe("getting-started");
  });

  it("extracts the first top-level paragraph as decoded plain text", () => {
    const source =
      "> Quote first\n\n- List first\n\n## Section\n\nUse `pnpm dev` with **care** &amp; [help](/help).\nNext line.\n\nAnother paragraph.";
    expect(parseMarkdownDocument(source, "Document").description).toBe(
      "Use pnpm dev with care & help. Next line.",
    );
  });

  it("does not use raw HTML tags as description markup", () => {
    const result = parseMarkdownDocument("A <strong>literal</strong> tag.", "Document");
    expect(result.description).toBe("A literal tag.");
    expect(rendered(result.body).querySelector("strong")).toBeNull();
  });

  it("validates caller metadata using the existing strict value contract", () => {
    expect(() => parseMarkdownDocument("Paragraph.", "")).toThrow();
  });
});

describe("shared CommonMark semantics", () => {
  it("renders headings, inline styles/code, reference links, nested lists, quotes and breaks", () => {
    const root = rendered(`# Title

Use **strong**, *emphasis* and \`pnpm dev\` with [the guide][guide].

3. Parent
   - Nested child

> A quote
>
> Another paragraph

---

[guide]: /getting-started "Guide title"
`);
    expect(root.querySelector("h1")?.textContent).toBe("Title");
    expect(root.querySelector("strong")?.textContent).toBe("strong");
    expect(root.querySelector("em")?.textContent).toBe("emphasis");
    expect(root.querySelector("p code")?.textContent).toBe("pnpm dev");
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/getting-started");
    expect(root.querySelector("a")?.getAttribute("title")).toBe("Guide title");
    expect(root.querySelector("ol")?.getAttribute("start")).toBe("3");
    expect(root.querySelector("ol > li > ul > li")?.textContent).toBe("Nested child");
    expect(root.querySelectorAll("blockquote > p")).toHaveLength(2);
    expect(root.querySelectorAll("hr")).toHaveLength(1);
  });

  it("preserves initially indented code and repeated blocks", () => {
    const source = "    const value = '<script>literal</script>';\n\nRepeat.\n\nRepeat.\n";
    expect(parseMarkdownDocument(source, "Code").body).toBe(source);
    const root = rendered(source);
    expect(root.querySelector("pre > code")?.textContent).toBe(
      "const value = '<script>literal</script>';\n",
    );
    expect(root.querySelectorAll("p")).toHaveLength(2);
    expect(root.querySelector("script")).toBeNull();
  });

  it("handles hard breaks, empty input, unclosed fences and unresolved references deterministically", () => {
    expect(renderMarkdownToHtml("")).toBe("");
    expect(rendered("first  \nsecond").querySelectorAll("br")).toHaveLength(1);
    expect(rendered("```js\nconst value = 1;").querySelector("pre code")?.textContent).toBe(
      "const value = 1;\n",
    );
    expect(rendered("[unknown][missing]").textContent).toBe("[unknown][missing]");
    expect(rendered("![unknown][missing]").querySelector("img")).toBeNull();
  });
});

describe("literal HTML and code boundary", () => {
  it.each([
    '<script>alert("synthetic")</script>',
    '<img src="x" onerror="alert(1)">',
    '<svg onload="alert(1)"><a href="javascript:alert(1)">x</a></svg>',
    "<style>body { display: none; }</style>",
    'Hello <a href="javascript:alert(1)">there</a>.',
    "&lt;img src=x onerror=alert(1)&gt;",
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  ])("retains %j as inert text", (source) => {
    const root = rendered(source);
    expect(root.querySelectorAll("script, img, svg, style, a, iframe")).toHaveLength(0);
    expect(root.textContent).toContain(
      source.startsWith("&lt;") ? "<img src=x onerror=alert(1)>" : source,
    );
  });

  it("keeps fenced payloads literal and preserves code indentation", () => {
    const source =
      '```html\n  <img src="x" onerror="alert(1)">\n<script>alert("test")</script>\n```';
    const root = rendered(source);
    expect(root.querySelector("code")?.textContent).toBe(
      '  <img src="x" onerror="alert(1)">\n<script>alert("test")</script>\n',
    );
    expect(root.querySelectorAll("img, script")).toHaveLength(0);
    expect(root.querySelector("code")?.className).toBe("language-html");
  });

  it("escapes quote-bearing language and link-title attributes", () => {
    const root = rendered(
      '```"><img/src=x>\npayload\n```\n\n[label](/guide "&#34; onmouseover=&#34;alert(1)")',
    );
    expect(root.querySelectorAll("img, script")).toHaveLength(0);
    for (const element of root.querySelectorAll("*")) {
      expect([...element.attributes].some((attribute) => attribute.name.startsWith("on"))).toBe(
        false,
      );
    }
    expect(root.querySelector("a")?.getAttribute("href")).toBe("/guide");
  });
});

describe("shared URL policy", () => {
  it.each(blockedUrls)("removes unsafe direct and reference destinations: %s", (url) => {
    for (const source of [
      `[link](<${url}>) ![image](<${url}>)`,
      `[link][target] ![image][target]\n\n[target]: <${url}>`,
    ]) {
      const root = rendered(source);
      expect(root.querySelectorAll("[href], [src]")).toHaveLength(0);
      expect(root.querySelectorAll("img")).toHaveLength(0);
      expect(root.textContent).toContain("link");
      expect(root.textContent).toContain("image");
    }
  });

  it.each([
    "/getting-started",
    "../guide?view=code#examples",
    "guide",
    "?view=code",
    "#examples",
    "https://example.test/a?x=1&y=2",
    "HTTP://example.test/guide",
    "mailto:hello@example.test",
  ])("keeps permitted link destinations without forcing a new tab: %s", (url) => {
    const root = rendered(`[link](<${url}>)`);
    const anchor = root.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe(url);
    expect(anchor?.hasAttribute("target")).toBe(false);
  });

  it("treats image destinations separately from mailto links and retains alt/title text", () => {
    const root = rendered(
      '![Local diagram](/diagram.png "Diagram title") ![Remote diagram](https://example.test/diagram.png) ![No image](mailto:hello@example.test)',
    );
    expect(root.querySelectorAll("img")).toHaveLength(2);
    expect(root.querySelector("img")?.getAttribute("alt")).toBe("Local diagram");
    expect(root.querySelector("img")?.getAttribute("title")).toBe("Diagram title");
    expect(root.textContent).toContain("No image");
  });

  it("omits empty destinations and escapes alt text when an image is rejected", () => {
    const root = rendered("[empty]() ![<script>literal</script>](data:text/plain,example)");
    expect(root.querySelector("a")?.hasAttribute("href")).toBe(false);
    expect(root.querySelectorAll("img, script")).toHaveLength(0);
    expect(root.textContent).toContain("<script>literal</script>");
  });
});
