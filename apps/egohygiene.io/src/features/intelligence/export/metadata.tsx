import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { target } from "virtual:intelligence-export-target";

/** Export-only adapter for the existing feature's metadata port. Normal
 * website metadata and its commerce publication policy are not imported. */
export function PageMetadata({ title, description }: { readonly title: string; readonly description: string; readonly error?: boolean }) {
  const { pathname } = useLocation();
  useEffect(() => {
    const canonical = `${target.origin}${target.base_path.replace(/\/$/, "")}${pathname}`;
    document.title = title;
    for (const [name, content] of [["description", description], ["robots", "noindex,follow"]]) {
      let node = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      if (!node) { node = document.createElement("meta"); node.name = name!; document.head.append(node); }
      node.content = content!;
    }
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.append(link); }
    link.href = canonical;
  }, [pathname, title, description]);
  return null;
}
