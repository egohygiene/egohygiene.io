import { parseMarkdownDocument } from "@egohygiene/content";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

export function MarkdownPage({
  source,
  title,
}: {
  readonly source: string;
  readonly title: string;
}) {
  const document = parseMarkdownDocument(source, title);

  return (
    <article className="docs-prose">{toJsxRuntime(document.tree, { Fragment, jsx, jsxs })}</article>
  );
}
