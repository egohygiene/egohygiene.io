import { z } from "zod";

import { createSlug } from "@egohygiene/utilities";

export const markdownMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
});

export interface MarkdownDocument {
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly body: string;
}

export function parseMarkdownDocument(raw: string, fallbackTitle: string): MarkdownDocument {
  const trimmed = raw.trim();

  return {
    slug: createSlug(fallbackTitle),
    title: fallbackTitle,
    body: trimmed,
    description: trimmed
      .split("\n")
      .find((line) => line.trim().length > 0 && !line.startsWith("#")),
  };
}

export function renderMarkdownToHtml(markdown: string): string {
  return markdown
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("## ")) {
        return `<h2>${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith("# ")) {
        return `<h1>${trimmed.slice(2)}</h1>`;
      }
      if (trimmed.startsWith("- ")) {
        const items = trimmed
          .split("\n")
          .map((line) => `<li>${line.replace(/^-\s*/, "")}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      if (trimmed.startsWith("```")) {
        return `<pre><code>${trimmed.replace(/```/g, "").trim()}</code></pre>`;
      }
      return `<p>${trimmed}</p>`;
    })
    .join("\n");
}
