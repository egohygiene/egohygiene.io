import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { z } from "zod";
import { blogCollectionSchema } from "../../packages/schemas/src/blog.ts";
import { assertBlogHistory, createBlogProjection } from "../../packages/content/src/blog.ts";

const asOf = "2026-11-14T00:00:00Z";
function fixture() {
  const value = JSON.parse(readFileSync("tests/fixtures/blog/collection.json", "utf8"));
  for (const post of value.posts) post.markdown = readFileSync(post.source.path, "utf8");
  return value;
}
function project(value = fixture(), clock = asOf) {
  return createBlogProjection(value, { asOf: clock, allowSynthetic: true });
}
function parseFeeds(view) {
  // Parse actual XML with the standard library, not an XML-shaped regex.
  const result = spawnSync("python3", ["-c", `import json,sys,xml.etree.ElementTree as ET
value=json.load(sys.stdin);rss=ET.fromstring(value['rss']);atom=ET.fromstring(value['atom']);ns={'a':'http://www.w3.org/2005/Atom','c':'http://purl.org/rss/1.0/modules/content/','d':'http://purl.org/dc/elements/1.1/'}
assert rss.tag=='rss' and rss.attrib['version']=='2.0'
channel=rss.find('channel');assert all(channel.find(k) is not None for k in ('title','link','description'))
assert atom.tag=='{http://www.w3.org/2005/Atom}feed' and all(atom.find('a:'+k,ns) is not None for k in ('id','title','updated'))
items=channel.findall('item');entries=atom.findall('a:entry',ns)
assert len(items)==len(entries)
for item,entry in zip(items,entries):
 assert item.find('guid').attrib['isPermaLink']=='false'
 assert item.findtext('guid')==entry.findtext('a:id',namespaces=ns)
 assert entry.find('a:author/a:name',ns) is not None
 assert all(entry.find('a:'+k,ns) is not None for k in ('title','updated','published','content'))
print(json.dumps({'ids':[item.findtext('guid') for item in items],'rssContent':[item.findtext('c:encoded',namespaces=ns) for item in items],'atomContent':[entry.findtext('a:content',namespaces=ns) for entry in entries],'dates':[item.findtext('pubDate') for item in items]}))`], { input: JSON.stringify({ rss: view.rss(), atom: view.atom() }), encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("three repository-backed synthetic categories require explicit fixture consumption", () => {
  const source = fixture();
  assert.deepEqual(source.posts.map((post) => post.category), ["essay", "release-update", "research-note"]);
  assert.throws(() => createBlogProjection(source, { asOf }), /Synthetic/u);
  const view = project(source);
  assert.equal(view.articles.length, 3);
  const empty = { ...source, origin: "authored", posts: [] };
  assert.equal(createBlogProjection(empty, { asOf }).articles.length, 0);
  assert.deepEqual(parseFeeds(createBlogProjection(empty, { asOf })).ids, []);
});

test("private, draft, pending, future and undisclosed entries never reach articles or feeds", () => {
  for (const change of [
    (post) => { post.visibility = "private"; },
    (post) => { post.publication = "draft"; },
    (post) => { post.review.status = "pending"; },
    (post) => { post.publishedAt = "2026-12-01T00:00:00Z"; },
    (post) => { post.updatedAt = "2026-12-01T00:00:00Z"; },
    (post) => { post.aiAssistance.status = "unknown"; },
  ]) {
    const source = fixture(); change(source.posts[0]);
    const view = project(source);
    assert.equal(view.get("synthetic-essay"), undefined);
    assert.doesNotMatch(view.rss() + view.atom(), /synthetic-essay/u);
  }
});

test("reviewed schedules use the explicit clock and archived posts retain a visible notice", () => {
  const source = fixture(); source.posts[0].publication = "scheduled";
  source.posts[0].publishedAt = "2026-11-15T00:00:00Z";
  assert.equal(project(source).get("synthetic-essay"), undefined);
  assert.ok(project(source, "2026-11-15T00:00:00Z").get("synthetic-essay"));
  source.posts[1].publication = "archived"; source.posts[1].archivalNote = "Synthetic archive notice.";
  assert.match(project(source).get("synthetic-release").html, /Archived: Synthetic archive notice/u);
});

test("RSS2 and Atom parse with stable GUIDs, original dates and disclosed reader context", () => {
  const source = fixture(); const post = source.posts[0];
  post.title = "A & <title> \"quoted\"";
  post.updatedAt = "2026-11-10T12:00:00Z";
  post.corrections = [{ id: "first-correction", at: post.updatedAt, summary: "Corrected & explained <safely>." }];
  post.media = [{ url: "https://example.invalid/cover.png", mimeType: "image/png", alt: "Synthetic cover", byteLength: 123 }];
  const view = project(source); const parsed = parseFeeds(view);
  assert.equal(new Set(parsed.ids).size, 3);
  assert.ok(parsed.ids.includes("urn:uuid:" + post.id));
  assert.ok(parsed.dates.includes(new Date(post.publishedAt).toUTCString()));
  for (const contents of [parsed.rssContent, parsed.atomContent]) {
    const article = contents.find((html) => html.includes("first-correction") || html.includes("Corrected &amp;"));
    assert.match(article, /AI assistance:/u); assert.match(article, /Corrections/u);
    assert.match(article, /Apache-2.0/u); assert.match(article, /Canonical source/u);
  }
  assert.match(view.rss(), /length="123"/u);
  assert.equal(view.discovery.length, 2);
  assert.equal(view.sitemap.length, 3);
});

test("projections are deterministic, deeply immutable and detached from source objects", () => {
  const source = fixture(); const view = project(source); const reversed = fixture(); reversed.posts.reverse();
  assert.equal(view.rss(), project(reversed).rss()); assert.equal(view.atom(), project(reversed).atom());
  source.posts[0].authors[0].name = "Mutated original";
  assert.equal(view.get("synthetic-essay").authors[0].name, "Synthetic Fixture Author");
  assert.throws(() => { view.get("synthetic-essay").authors[0].name = "Mutate"; }, TypeError);
  assert.throws(() => view.articles.pop(), TypeError);
});

test("explicit history comparison preserves GUID, canonical URL, dates and corrections", () => {
  const previous = fixture(); const next = fixture(); const post = next.posts[0];
  post.markdown += "\nA corrected synthetic paragraph.\n"; post.updatedAt = "2026-11-10T12:00:00Z";
  post.corrections.push({ id: "correction", at: post.updatedAt, summary: "Synthetic correction." });
  assert.doesNotThrow(() => assertBlogHistory(previous, next));
  assert.equal(project(previous).get(post.slug).guid, project(next).get(post.slug).guid);
  assert.equal(project(previous).get(post.slug).publishedAt, project(next).get(post.slug).publishedAt);
  for (const change of [
    (value) => { value.site.baseUrl = "https://example.invalid/moved/"; },
    (value) => { value.posts[0].publishedAt = "2026-11-02T12:00:00Z"; },
    (value) => { value.posts[0].slug = "moved-post"; },
    (value) => { value.posts[0].corrections = []; },
  ]) {
    const mutated = structuredClone(next); change(mutated);
    assert.throws(() => assertBlogHistory(next, mutated));
  }
  const backwards = structuredClone(next); backwards.posts[0].updatedAt = "2026-11-09T12:00:00Z";
  backwards.posts[0].corrections = [];
  assert.throws(() => assertBlogHistory(next, backwards));
  const metadataOnly = fixture(); metadataOnly.posts[0].updatedAt = "2026-11-10T12:00:00Z";
  const earlier = structuredClone(metadataOnly); earlier.posts[0].updatedAt = "2026-11-09T12:00:00Z";
  assert.throws(() => assertBlogHistory(metadataOnly, earlier), /backwards/u);
});

test("constrained Markdown and XML escaping preserve text without executable HTML", () => {
  const source = fixture(); source.posts[0].markdown = '<script>alert("fixture")</script>\n\n[unsafe](javascript:alert(1))';
  const view = project(source);
  assert.doesNotMatch(view.get("synthetic-essay").html, /<script|href="javascript:/u);
  assert.match(view.get("synthetic-essay").html, /(?:&lt;|&#x3C;)script/iu);
  parseFeeds(view);
});

test("malformed drafts, dates, duplicates, XML controls and unreviewable approvals fail", () => {
  for (const change of [
    (value) => { value.posts[0].publication = "draft"; value.posts[0].title = ""; },
    (value) => { value.posts[0].publishedAt = "2026-02-30T12:00:00Z"; },
    (value) => { value.posts.push({ ...value.posts[0] }); },
    (value) => { value.posts[0].markdown += "\u0000"; },
    (value) => { value.posts[0].review.reference = null; },
  ]) {
    const source = fixture(); change(source);
    assert.throws(() => project(source));
  }
});

test("checked blog JSON Schema stays generated from the runtime contract owner", () => {
  const schema = JSON.parse(readFileSync("packages/schemas/schemas/blog.schema.json", "utf8"));
  assert.deepEqual(schema, z.toJSONSchema(blogCollectionSchema));
});
