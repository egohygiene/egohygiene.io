import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, useLocation } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { IntelligenceExportProviders } from "./export/providers";
import { RepositoryDirectory } from "./RepositoryDirectory";

// Actual pinned public projection as a rendering fixture; native admission is
// exercised separately by the Node consumer controls, outside jsdom/Vite URLs.
vi.mock("./data", async () => {
  const { default: payload } = await import(
    "../../../../../contracts/organization-intelligence/directory/owner/docs/intelligence/repository-directory.json"
  );
  const { default: lock } = await import(
    "../../../../../contracts/organization-intelligence/directory/input-lock.json"
  );
  return {
    intelligenceData: {
      directory: {
        state: "admitted",
        entries: payload.entries,
        catalog: payload.catalog,
        sourceInventory: payload.source_inventory,
        source: {
          repository: lock.owner,
          revision: lock.revision,
          path: lock.payload_path,
          sha256: lock.files["docs/intelligence/repository-directory.json"],
        },
      },
    },
  };
});
afterEach(cleanup);
function Location() {
  return <output aria-label="URL context">{useLocation().search}</output>;
}
function Page({ route = "/intelligence/" }: { readonly route?: string }) {
  return (
    <MemoryRouter initialEntries={[route]}>
      <IntelligenceExportProviders>
        <RepositoryDirectory />
        <Location />
      </IntelligenceExportProviders>
    </MemoryRouter>
  );
}
it("renders dated publication records while keeping declarations and unknown destinations distinct", () => {
  render(<Page />);
  expect(screen.getByRole("status", { name: "Reviewed roster search results" })).toHaveTextContent(
    "Showing 28 of 28 entries in the reviewed public roster",
  );
  expect(document.querySelectorAll('[data-link-state="publication-recorded"]')).toHaveLength(2);
  expect(document.querySelectorAll('[data-link-state="source-declared"]')).toHaveLength(3);
  expect(document.querySelectorAll('[data-link-state="unknown"]')).toHaveLength(23);
  expect(screen.getByText("2026-11-14T06:35:35.745Z")).toBeInTheDocument();
  expect(document.querySelectorAll(".oi-directory-group[open]")).toHaveLength(0);
  expect(screen.queryByText("Healthy")).not.toBeInTheDocument();
  const declared = document.querySelectorAll('[data-link-state="source-declared"]');
  for (const row of declared) {
    expect(row.querySelector(".oi-directory-entry-heading > a")?.getAttribute("href")).toMatch(
      /^https:\/\/github.com\/egohygiene\//,
    );
    expect(row.querySelector(".oi-directory-caption code")?.textContent).toMatch(
      /^https:\/\/[^/]+\.egohygiene\.io\/intelligence\//,
    );
  }
});
it("searches the reviewed roster with URL context and an exact consumer-owned destination", () => {
  render(<Page route="/intelligence/?entity=retained" />);
  fireEvent.change(screen.getByRole("searchbox", { name: "Search repositories" }), {
    target: { value: "empathy" },
  });
  expect(screen.getByRole("status", { name: "Reviewed roster search results" })).toHaveTextContent(
    "Showing 1 of 28",
  );
  expect(screen.getByRole("link", { name: "egohygiene/empathy" })).toHaveAttribute(
    "href",
    "https://egohygiene.github.io/empathy/intelligence/",
  );
  expect(screen.getByLabelText("URL context")).toHaveTextContent("entity=retained&q=empathy");
});
it("opens matching unknown rows without inventing dashboard links or changing their publication state", () => {
  render(<Page />);
  fireEvent.change(screen.getByRole("combobox", { name: "Dashboard evidence" }), {
    target: { value: "unknown" },
  });
  expect(screen.getByRole("status", { name: "Reviewed roster search results" })).toHaveTextContent(
    "Showing 23 of 28",
  );
  expect(document.querySelector(".oi-directory-group")).toHaveAttribute("open");
  for (const link of document.querySelectorAll(".oi-directory-entry-heading > a"))
    expect(link.getAttribute("href")).toMatch(/^https:\/\/github.com\/egohygiene\//);
});
it("renders all admitted links and native provenance without JavaScript", () => {
  const template = document.createElement("template");
  template.innerHTML = renderToString(<Page />);
  expect(template.content.querySelectorAll(".oi-directory-entry")).toHaveLength(28);
  expect(template.content.querySelectorAll(".oi-directory-group[open]")).toHaveLength(0);
  expect(template.content.querySelector("#intelligence-directory-source")?.textContent).toContain(
    "834d7fd51c48860b2cc4f1a6a262ce466f2004db",
  );
  expect(template.content.querySelector("#intelligence-directory-source")?.textContent).toContain(
    "d29435982560531d31e7698c31fb40e55cfc0849615f4d094be6cb4342ee04fd",
  );
});
