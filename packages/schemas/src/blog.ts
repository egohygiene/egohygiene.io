import { z } from "zod";

function xmlCharacters(value: string): boolean {
  return [...value].every((character) => {
    const point = character.codePointAt(0) ?? 0;
    return point === 9 || point === 10 || point === 13 ||
      (point >= 32 && point <= 0xd7ff) || (point >= 0xe000 && point <= 0xfffd) ||
      (point >= 0x10000 && point <= 0x10ffff);
  });
}
const text = (maximum: number) => z.string().min(1).max(maximum).refine(xmlCharacters, "Invalid XML text");
const https = text(2000).url().regex(/^https:\/\/[^\s\\@?#]+$/u);
const slug = z.string().regex(/^[a-z][a-z0-9-]{0,79}$/u);
export const blogTimestampSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u)
  .refine((value) => Number.isFinite(Date.parse(value)) && new Date(value).toISOString().replace(".000Z", "Z") === value, "Invalid UTC timestamp");
const correction = z.strictObject({ id: slug, at: blogTimestampSchema, summary: text(1000) });
export const blogPostSchema = z.strictObject({
  id: z.string().uuid().regex(/^[0-9a-f-]+$/u), slug, title: text(200), summary: text(2000),
  category: z.enum(["essay", "release-update", "research-note", "community"]),
  markdown: z.string().max(100000).refine(xmlCharacters, "Invalid XML text"),
  visibility: z.enum(["public", "private"]),
  review: z.strictObject({ status: z.enum(["draft", "pending", "approved"]), reference: https.nullable() }),
  publication: z.enum(["draft", "scheduled", "published", "archived"]),
  publishedAt: blogTimestampSchema.nullable(), updatedAt: blogTimestampSchema.nullable(),
  authors: z.array(z.strictObject({ id: slug, name: text(200), url: https.nullable() })).min(1).max(20),
  aiAssistance: z.strictObject({ status: z.enum(["none", "disclosed", "unknown"]), disclosure: text(2000).nullable() }),
  corrections: z.array(correction).max(100), archivalNote: text(2000).nullable(),
  license: z.strictObject({ name: text(200), url: https.nullable() }).nullable(),
  source: z.strictObject({
    path: text(500).regex(/^(?!\/)(?![A-Za-z]:)(?!.*\\)(?!.*(?:^|\/)\.{1,2}(?:\/|$))[^/]+(?:\/[^/]+)*\.md$/u),
    revision: z.string().regex(/^[0-9a-f]{40}$/u).nullable(), url: https.nullable(),
  }),
  media: z.array(z.strictObject({ url: https, alt: text(1000), mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]), byteLength: z.number().int().positive().nullable() })).max(8),
}).superRefine((post, context) => {
  const fail = (message: string) => context.addIssue({ code: "custom", message });
  if (post.publication !== "draft" && post.publishedAt === null) fail("Publication requires its original timestamp");
  if (post.review.status === "approved" && post.review.reference === null) fail("Approved review requires a reference");
  if (post.aiAssistance.status === "disclosed" && post.aiAssistance.disclosure === null) fail("AI assistance needs disclosure");
  if (post.publication === "archived" && post.archivalNote === null) fail("Archive requires a visible note");
  if (post.updatedAt && post.publishedAt && post.updatedAt < post.publishedAt) fail("Update precedes publication");
  if (post.corrections.length && (post.updatedAt === null || post.publishedAt === null)) fail("Corrections require publication and update timestamps");
  const ids = new Set<string>();
  let previous = post.publishedAt ?? "";
  for (const item of post.corrections) {
    if (ids.has(item.id) || item.at < previous || (post.updatedAt !== null && item.at > post.updatedAt)) fail("Correction identity or chronology is invalid");
    ids.add(item.id); previous = item.at;
  }
  if (new Set(post.authors.map((author) => author.id)).size !== post.authors.length) fail("Duplicate author identity");
});

export const blogCollectionSchema = z.strictObject({
  schemaVersion: z.literal("egohygiene.blog/v1"),
  origin: z.enum(["authored", "synthetic"]),
  site: z.strictObject({ title: text(200), description: text(2000), baseUrl: https.regex(/\/$/u), language: z.string().regex(/^[a-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/u) }),
  posts: z.array(blogPostSchema).max(1000),
}).superRefine((collection, context) => {
  const ids = new Set<string>(); const slugs = new Set<string>();
  for (const post of collection.posts) {
    if (ids.has(post.id) || slugs.has(post.slug)) context.addIssue({ code: "custom", message: "Duplicate blog ID or slug" });
    ids.add(post.id); slugs.add(post.slug);
  }
  if (collection.posts.reduce((total, post) => total + post.markdown.length, 0) > 2000000) context.addIssue({ code: "custom", message: "Blog collection exceeds content budget" });
});

export type BlogCollection = z.infer<typeof blogCollectionSchema>;
export type BlogPost = z.infer<typeof blogPostSchema>;
