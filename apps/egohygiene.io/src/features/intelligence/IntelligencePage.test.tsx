import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { IntelligenceExportProviders } from "./export/providers";
import { IntelligencePage } from "./IntelligencePage";

const fixture = vi.hoisted(() => {
  const revision = "a".repeat(40);
  const modules = ["audits", "sanity", "future_view"].map((id) => ({
    id,
    title: id === "future_view" ? "Future registered view" : id === "audits" ? "Audits" : "Sanity",
    path: `/${id}/`,
    issueUrl: "https://github.com/egohygiene/egohygiene.io/issues/27",
    implemented: true,
    description: `Declared ${id} scope`,
  }));
  const repository = (name: string, evidenceState: string) => ({
    name: `egohygiene/${name}`,
    title: name,
    sourceUrl: `https://github.com/egohygiene/${name}`,
    commitUrl: `https://github.com/egohygiene/${name}/commit/${revision}`,
    representedCommit: revision,
    observedAt: "2026-11-13T03:23:31Z",
    snapshotId: `snapshot-${name}`,
    snapshotDigest: "b".repeat(64),
    evidenceState,
    publication: {
      state: "available",
      routes: {
        intelligence: `https://egohygiene.github.io/${name}/intelligence/`,
        now: `https://egohygiene.github.io/${name}/intelligence/now/`,
      },
      sourceMatchesSnapshot: true,
    },
    coverage: [
      {
        domain: "issues",
        collection: "uncollected",
        freshness: "unknown",
        reason: "not_requested",
        observedAt: null,
      },
    ],
    now: { state: "unavailable", currentFocus: [], blockers: [], nextReady: [] },
  });
  return {
    state: "partial",
    code: "PARTIAL",
    asOf: "2026-11-13T03:36:14Z",
    snapshotId: "synthetic-browser-fixture",
    observationWindow: { earliest: "2026-11-13T03:23:31Z", latest: "2026-11-13T03:23:31Z" },
    repositories: [repository("alpha", "partial"), repository("beta", "stale")],
    modules,
    endpoints: {
      audits: {
        state: "partial",
        groups: [],
        source: { asOf: "2026-11-13T03:23:31Z" },
      },
    },
    graph: {
      nodes: [
        {
          id: "module-audits",
          label: "Audits",
          kind: "module",
          href: "/audits/",
          state: "partial",
          description: "Synthetic navigation fixture",
        },
      ],
      edges: [],
      truncated: false,
    },
    provenance: {
      schema: "synthetic-test-only",
      contractVersion: "1",
      registryUrl: "https://github.com/egohygiene/hygiene",
      observatoryRevision: revision,
    },
  };
});
vi.mock("./data", () => ({ intelligenceData: fixture }));
afterEach(cleanup);

function Page({ route = "/intelligence/" }: { readonly route?: string }) {
  return (
    <MemoryRouter initialEntries={[route]}>
      <IntelligenceExportProviders>
        <IntelligencePage />
      </IntelligenceExportProviders>
    </MemoryRouter>
  );
}

it("keeps future registered views, their source states and URL context reachable", () => {
  render(<Page route="/intelligence/?q=alpha&evidence=partial&entity=kept" />);
  const views = document.getElementById("intelligence-modules");
  expect(views).not.toBeNull();
  const group = within(views as HTMLElement);
  expect(group.getByRole("link", { name: "Future registered view" })).toHaveAttribute(
    "href",
    "/future_view/?q=alpha&evidence=partial&entity=kept",
  );
  expect(group.getByText("Partial evidence")).toBeVisible();
  expect(group.getAllByText("Unavailable")).toHaveLength(2);
  expect(
    screen.getByRole("navigation", { name: "Review evidence with independent source coverage" }),
  ).toHaveTextContent("2026-11-13T03:23:31Z");
});

it("retains repository filtering and selected evidence links without leaking fleet filters to publications", () => {
  render(<Page route="/intelligence/?q=alpha&evidence=partial&entity=kept" />);
  expect(document.querySelector(".oi-results")).toHaveTextContent("Showing 1 of 2");
  const primary = screen.getByRole("link", { name: "Open repository Intelligence" });
  expect(primary).toHaveAttribute("href", "https://egohygiene.github.io/alpha/intelligence/");
  fireEvent.click(screen.getByRole("link", { name: "Inspect fleet snapshot context" }));
  expect(document.querySelector("#repository-egohygiene--alpha")).toHaveAttribute("open");
  fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
  expect(document.querySelector(".oi-results")).toHaveTextContent("Showing 2 of 2");
  expect(document.querySelector("#repository-egohygiene--alpha")).toHaveAttribute("open");
  expect(screen.getAllByRole("link", { name: "Future registered view" })[0]).toHaveAttribute(
    "href",
    "/future_view/?entity=kept&repository=egohygiene%2Falpha",
  );
});

it("starts with optional graph closed but opens shared graph context after hydration", () => {
  const { unmount } = render(<Page />);
  expect(document.querySelector(".oi-map-disclosure")).not.toHaveAttribute("open");
  unmount();
  render(<Page route="/intelligence/?graph=module-audits" />);
  expect(document.querySelector(".oi-map-disclosure")).toHaveAttribute("open");
  expect(document.querySelector('[data-graph-node][data-selected="true"]')).toHaveAttribute(
    "data-selected",
    "true",
  );
});

it("server output keeps all native disclosures and source links with the optional graph collapsed by default", () => {
  const markup = renderToString(<Page />);
  const template = document.createElement("template");
  template.innerHTML = markup;
  expect(template.content.querySelector(".oi-map-disclosure")?.hasAttribute("open")).toBe(false);
  expect(template.content.querySelectorAll(".oi-view-list a")).toHaveLength(3);
  expect(template.content.querySelector(".oi-publication-disclosure summary")?.textContent).toBe(
    "Published repository Intelligence views",
  );
  expect(markup).toContain("2026-11-13T03:23:31Z");
  expect(markup).toContain("Uncollected");
});
