import { blogCollectionSchema, blogTimestampSchema, type BlogPost } from "@egohygiene/schemas/blog";
import { renderMarkdownToHtml } from "./index.ts";

function compare(a: string, b: string): number { return a < b ? -1 : a > b ? 1 : 0; }
function freeze<T>(value: T): T {
  if (value && typeof value === "object") {
    for (const child of Object.values(value)) freeze(child);
    Object.freeze(value);
  }
  return value;
}
function xml(value: string): string {
  return value.replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/"/gu, "&quot;").replace(/'/gu, "&apos;");
}
type Immutable<T> = T extends readonly (infer Item)[] ? readonly Immutable<Item>[] : T extends object ? { readonly [Key in keyof T]: Immutable<T[Key]> } : T;
export type PublicBlogArticle = Immutable<BlogPost & { guid: string; canonicalUrl: string; html: string; modifiedAt: string }>;

function articleHtml(post: BlogPost): string {
  const disclosure = post.aiAssistance.status === "disclosed" ? `<p>AI assistance: ${xml(post.aiAssistance.disclosure ?? "")}</p>` : "";
  const corrections = post.corrections.length ? `<section aria-label="Corrections"><h2>Corrections</h2><ul>${post.corrections.map((item) => `<li><time datetime="${item.at}">${item.at}</time>: ${xml(item.summary)}</li>`).join("")}</ul></section>` : "";
  const archive = post.publication === "archived" ? `<p>Archived: ${xml(post.archivalNote ?? "")}</p>` : "";
  const license = post.license ? `<p>License: ${post.license.url ? `<a href="${xml(post.license.url)}">${xml(post.license.name)}</a>` : xml(post.license.name)}</p>` : "";
  const source = post.source.url ? `<p><a href="${xml(post.source.url)}">Canonical source</a></p>` : "";
  return renderMarkdownToHtml(post.markdown) + archive + disclosure + corrections + license + source;
}

/** Pure projection only: no clock, filesystem, provider, route or publication. */
export function createBlogProjection(input: unknown, options: { asOf: string; allowSynthetic?: boolean }) {
  const source = blogCollectionSchema.parse(input);
  const asOf = blogTimestampSchema.parse(options.asOf);
  if (source.origin === "synthetic" && options.allowSynthetic !== true) throw new Error("Synthetic blog requires an explicit fixture consumer.");
  const articles: readonly PublicBlogArticle[] = freeze(source.posts
    .filter((post) => post.visibility === "public" && post.review.status === "approved" &&
      post.publication !== "draft" && post.aiAssistance.status !== "unknown" &&
      post.publishedAt !== null && post.publishedAt <= asOf && (post.updatedAt === null || post.updatedAt <= asOf))
    .map((post) => ({ ...post, guid: `urn:uuid:${post.id}`, canonicalUrl: `${source.site.baseUrl}${post.slug}/`,
      html: articleHtml(post), modifiedAt: post.updatedAt ?? post.publishedAt ?? asOf }))
    .sort((a, b) => compare(b.publishedAt ?? "", a.publishedAt ?? "") || compare(a.id, b.id)));
  const site = freeze(source.site);
  return Object.freeze({
    schemaVersion: source.schemaVersion, site, asOf,
    articles,
    get(slug: string): PublicBlogArticle | undefined { return articles.find((post) => post.slug === slug); },
    discovery: freeze([
      { rel: "alternate", type: "application/rss+xml", href: `${site.baseUrl}rss.xml`, title: `${site.title} RSS` },
      { rel: "alternate", type: "application/atom+xml", href: `${site.baseUrl}atom.xml`, title: `${site.title} Atom` },
    ]),
    sitemap: freeze(articles.map((post) => ({ loc: post.canonicalUrl, lastmod: post.modifiedAt }))),
    rss(): string {
      const items = articles.map((post) => {
        const enclosure = post.media.find((media) => media.byteLength !== null);
        return `<item><guid isPermaLink="false">${xml(post.guid)}</guid><link>${xml(post.canonicalUrl)}</link><title>${xml(post.title)}</title><description>${xml(post.summary)}</description><pubDate>${new Date(post.publishedAt ?? asOf).toUTCString()}</pubDate><category>${xml(post.category)}</category>${post.authors.map((author) => `<dc:creator>${xml(author.name)}</dc:creator>`).join("")}<content:encoded>${xml(post.html)}</content:encoded>${enclosure ? `<enclosure url="${xml(enclosure.url)}" type="${xml(enclosure.mimeType)}" length="${enclosure.byteLength}"/>` : ""}</item>`;
      }).join("");
      return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${xml(site.title)}</title><link>${xml(site.baseUrl)}</link><description>${xml(site.description)}</description><language>${site.language}</language><lastBuildDate>${new Date(asOf).toUTCString()}</lastBuildDate><atom:link href="${xml(site.baseUrl)}rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>\n`;
    },
    atom(): string {
      const updated = articles.reduce((latest, post) => post.modifiedAt > latest ? post.modifiedAt : latest, articles[0]?.modifiedAt ?? asOf);
      const entries = articles.map((post) => `<entry><id>${xml(post.guid)}</id><title>${xml(post.title)}</title><link rel="alternate" href="${xml(post.canonicalUrl)}"/><published>${post.publishedAt}</published><updated>${post.modifiedAt}</updated><summary>${xml(post.summary)}</summary><content type="html">${xml(post.html)}</content><category term="${post.category}"/>${post.authors.map((author) => `<author><name>${xml(author.name)}</name>${author.url ? `<uri>${xml(author.url)}</uri>` : ""}</author>`).join("")}${post.license ? `<rights>${xml(post.license.name)}</rights>` : ""}${post.source.url ? `<link rel="related" href="${xml(post.source.url)}"/>` : ""}</entry>`).join("");
      return `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${site.language}"><id>${xml(site.baseUrl)}</id><title>${xml(site.title)}</title><subtitle>${xml(site.description)}</subtitle><updated>${updated}</updated><link rel="alternate" href="${xml(site.baseUrl)}"/><link rel="self" type="application/atom+xml" href="${xml(site.baseUrl)}atom.xml"/>${entries}</feed>\n`;
    },
  });
}

/** Compare repository revisions explicitly; timestamps are never regenerated. */
export function assertBlogHistory(previousInput: unknown, nextInput: unknown): void {
  const previous = blogCollectionSchema.parse(previousInput); const next = blogCollectionSchema.parse(nextInput);
  if (previous.site.baseUrl !== next.site.baseUrl && previous.posts.some((post) => post.publishedAt !== null)) {
    throw new Error("Published canonical base changes require an explicit URL migration.");
  }
  const byId = new Map(next.posts.map((post) => [post.id, post]));
  for (const prior of previous.posts) {
    if (prior.publishedAt === null || !["published", "archived"].includes(prior.publication)) continue;
    const post = byId.get(prior.id);
    if (!post || post.publishedAt !== prior.publishedAt || post.slug !== prior.slug ||
        JSON.stringify(post.corrections.slice(0, prior.corrections.length)) !== JSON.stringify(prior.corrections)) {
      throw new Error("Published identity, original date and correction history require an explicit migration.");
    }
    if ((post.updatedAt ?? post.publishedAt ?? "") < (prior.updatedAt ?? prior.publishedAt)) {
      throw new Error("Published update timestamps cannot move backwards.");
    }
    const editorialFields = ["markdown", "title", "summary", "category", "authors", "aiAssistance", "license", "media", "archivalNote"] as const;
    if (editorialFields.some((key) => JSON.stringify(post[key]) !== JSON.stringify(prior[key]))) {
      if (post.updatedAt === null || post.updatedAt <= (prior.updatedAt ?? prior.publishedAt) || post.corrections.length <= prior.corrections.length) {
        throw new Error("Published content changes require a later update and appended correction.");
      }
    }
  }
}
