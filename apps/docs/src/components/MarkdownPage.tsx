import { parseMarkdownDocument } from "@egohygiene/content";

function renderBlocks(source: string) {
  return source.split(/\n{2,}/).map((block) => {
    const trimmed = block.trim();

    if (trimmed.startsWith("# ")) {
      return <h1 key={trimmed}>{trimmed.slice(2)}</h1>;
    }

    if (trimmed.startsWith("## ")) {
      return <h2 key={trimmed}>{trimmed.slice(3)}</h2>;
    }

    if (trimmed.startsWith("- ")) {
      return (
        <ul key={trimmed}>
          {trimmed.split("\n").map((line) => (
            <li key={line}>{line.replace(/^-\s*/, "")}</li>
          ))}
        </ul>
      );
    }

    if (trimmed.startsWith("```")) {
      return (
        <pre key={trimmed}>
          <code>{trimmed.replace(/```/g, "").trim()}</code>
        </pre>
      );
    }

    return <p key={trimmed}>{trimmed}</p>;
  });
}

export function MarkdownPage({
  source,
  title,
}: {
  readonly source: string;
  readonly title: string;
}) {
  const document = parseMarkdownDocument(source, title);

  return <article className="docs-prose">{renderBlocks(document.body)}</article>;
}
