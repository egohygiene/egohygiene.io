import { createSlug } from "@egohygiene/utilities";
import type { Root as HastRoot, Text as HastText } from "hast";
import { toHtml } from "hast-util-to-html";
import type { Html, Image, ImageReference, Link, LinkReference } from "mdast";
import { fromMarkdown } from "mdast-util-from-markdown";
import { defaultHandlers, type State, toHast } from "mdast-util-to-hast";
import { toString as markdownText } from "mdast-util-to-string";
import { z } from "zod";

export const markdownMetadataSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
});

export interface MarkdownDocument {
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly body: string;
  readonly tree: HastRoot;
}

// Check decoded Markdown URLs before the HTML converter normalizes/encodes them.
// Neither the serializer nor the React adapter is a URL sanitizer.
function isAllowedUrl(value: string, image = false): boolean {
  if (!value || /[\s\\]/u.test(value) || value.startsWith("//")) return false;
  for (const character of value) {
    const point = character.codePointAt(0) ?? 0;
    if (point < 32 || (point >= 127 && point <= 159)) return false;
  }
  const colon = value.indexOf(":");
  const boundary = value.search(/[/?#]/u);
  if (colon === -1 || (boundary !== -1 && boundary < colon)) return true;
  const scheme = value.slice(0, colon).toLowerCase();
  return scheme === "https" || scheme === "http" || (!image && scheme === "mailto");
}

function literalHtml(_state: State, node: Html): HastText {
  return { type: "text", value: node.value };
}

function link(state: State, node: Link) {
  const result = defaultHandlers.link(state, node);
  if (!isAllowedUrl(node.url)) delete result.properties.href;
  return result;
}

function linkReference(state: State, node: LinkReference) {
  const result = defaultHandlers.linkReference(state, node);
  const definition = state.definitionById.get(node.identifier.toUpperCase());
  if (!Array.isArray(result) && result.type === "element" && !isAllowedUrl(definition?.url ?? "")) {
    delete result.properties.href;
  }
  return result;
}

function image(state: State, node: Image) {
  if (!isAllowedUrl(node.url, true))
    return { type: "text", value: node.alt ?? "" } satisfies HastText;
  return defaultHandlers.image(state, node);
}

function imageReference(state: State, node: ImageReference) {
  const definition = state.definitionById.get(node.identifier.toUpperCase());
  if (definition && !isAllowedUrl(definition.url, true)) {
    return { type: "text", value: node.alt ?? "" } satisfies HastText;
  }
  return defaultHandlers.imageReference(state, node);
}

function parseContent(source: string) {
  const markdown = fromMarkdown(source);
  const tree = toHast(markdown, {
    handlers: { html: literalHtml, link, linkReference, image, imageReference },
  });
  if (tree.type !== "root") throw new Error("Markdown conversion did not produce a root.");
  return { markdown, tree };
}

/** Parse CommonMark source into metadata and a constrained, non-executable tree. */
export function parseMarkdownDocument(raw: string, fallbackTitle: string): MarkdownDocument {
  const { markdown, tree } = parseContent(raw);
  const paragraph = markdown.children.find((node) => node.type === "paragraph");
  const summary = paragraph
    ? markdownText(paragraph, { includeHtml: false }).replace(/\s+/gu, " ").trim()
    : "";
  const metadata = markdownMetadataSchema.parse({
    title: fallbackTitle,
    ...(summary ? { description: summary } : {}),
  });

  return {
    slug: createSlug(metadata.title),
    title: metadata.title,
    body: raw,
    tree,
    ...(metadata.description === undefined ? {} : { description: metadata.description }),
  };
}

/** Serialize the same constrained CommonMark tree used by the docs React adapter. */
export function renderMarkdownToHtml(markdown: string): string {
  return toHtml(parseContent(markdown).tree);
}
