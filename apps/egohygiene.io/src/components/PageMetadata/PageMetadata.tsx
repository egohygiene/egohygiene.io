import { useI18n } from "@egohygiene/i18n";
import { useEffect, useMemo } from "react";
import { useInRouterContext, useLocation } from "react-router-dom";

import { resolvePageMetadata, type PageMetadataValue } from "../../content/publication";
import { storeCatalog, storefrontCuration } from "../../content/store";
import { useStoreContent } from "../../features/store/useStoreContent";

interface PageMetadataProps {
  readonly title: string;
  readonly description: string;
  readonly error?: boolean;
}

/** Update the same head fields emitted by the static renderer, including on missing pages. */
function MetadataEffect({ metadata }: { readonly metadata: PageMetadataValue }) {
  useEffect(() => {
    const previousTitle = document.title;
    const restore: (() => void)[] = [];
    function update(selector: string, tag: "meta" | "link", attributes?: Record<string, string>) {
      const existing = document.head.querySelector<HTMLElement>(selector);
      if (!attributes) {
        if (existing) {
          const next = existing.nextSibling;
          existing.remove();
          restore.push(() =>
            document.head.insertBefore(existing, next?.parentNode === document.head ? next : null),
          );
        }
        return;
      }
      const element = existing ?? document.createElement(tag);
      const previous = [...element.attributes].map(({ name, value }) => [name, value] as const);
      for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
      element.setAttribute("data-page-metadata", "");
      if (!existing) document.head.append(element);
      restore.push(() => {
        if (!existing) element.remove();
        else {
          for (const { name } of [...element.attributes]) element.removeAttribute(name);
          for (const [name, value] of previous) element.setAttribute(name, value);
        }
      });
    }
    function meta(attribute: "name" | "property", name: string, content?: string) {
      update(
        `meta[${attribute}="${name}"]`,
        "meta",
        content === undefined ? undefined : { [attribute]: name, content },
      );
    }

    document.title = metadata.title;
    meta("name", "description", metadata.description);
    meta("name", "robots", metadata.robots);
    update(
      'link[rel="canonical"]',
      "link",
      metadata.canonical ? { rel: "canonical", href: metadata.canonical } : undefined,
    );
    meta("property", "og:type", metadata.ogType);
    meta("property", "og:site_name", "Ego Hygiene");
    meta("property", "og:title", metadata.title);
    meta("property", "og:description", metadata.description);
    meta("property", "og:url", metadata.canonical);
    meta("property", "og:image", metadata.image?.url);
    meta("property", "og:image:alt", metadata.image?.alt);
    meta("name", "twitter:card", "summary");
    meta("name", "twitter:title", metadata.title);
    meta("name", "twitter:description", metadata.description);
    meta("name", "twitter:image", metadata.image?.url);
    meta("name", "twitter:image:alt", metadata.image?.alt);
    return () => {
      document.title = previousTitle;
      restore.reverse().forEach((undo) => {
        undo();
      });
    };
  }, [metadata]);
  return null;
}

function LocatedPageMetadata({ title, description, error }: PageMetadataProps) {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const { selection } = useStoreContent();
  const metadata = useMemo(
    () => ({
      ...resolvePageMetadata(
        pathname,
        { catalog: storeCatalog, curation: storefrontCuration, t, selection },
        { error: error ?? false },
      ),
      // Existing isolated consumers can provide synthetic dictionaries/catalogs.
      title,
      description,
    }),
    [pathname, t, selection, error, title, description],
  );
  return <MetadataEffect metadata={metadata} />;
}

/** Pages retain their translated content props; publication identity uses the shared resolver. */
export function PageMetadata(props: PageMetadataProps) {
  const hasRouter = useInRouterContext();
  const standalone = useMemo<PageMetadataValue>(
    () => ({
      title: props.title,
      description: props.description,
      robots: "noindex,follow",
      indexable: false,
      reason: "An isolated component has no published route identity.",
      ogType: "website",
    }),
    [props.title, props.description],
  );
  return hasRouter ? <LocatedPageMetadata {...props} /> : <MetadataEffect metadata={standalone} />;
}
