import { I18nProvider } from "@egohygiene/i18n";
import type { StoreDesign } from "@egohygiene/schemas";
import { render as baseRender, cleanup, fireEvent, screen } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import storeCards from "../../i18n/locales/en/storeCards.json";

import { StoreArtwork } from "./StoreArtwork";

function Messages({ children }: { readonly children: ReactNode }) {
  return <I18nProvider messages={{ storeCards }}>{children}</I18nProvider>;
}
const render = (ui: ReactElement) => baseRender(ui, { wrapper: Messages });

const design: StoreDesign = {
  schemaVersion: 1,
  kind: "design",
  id: "design-test-approved",
  slug: "approved-artwork",
  title: "Approved artwork",
  description: "A public design fixture for testing the artwork renderer.",
  visibility: "public",
  artworkRevision: 1,
  artwork: {
    kind: "image",
    src: "/store/test/approved.webp",
    alt: "Pink heart surrounded by a cyan orbit",
  },
  contextIds: [],
};

afterEach(cleanup);

describe("StoreArtwork", () => {
  it("renders the approved derivative with its authored alternative text", () => {
    render(<StoreArtwork design={design} />);
    const artwork = screen.getByRole("img", { name: "Pink heart surrounded by a cyan orbit" });
    expect(artwork).toHaveAttribute("src", "/store/test/approved.webp");
    expect(screen.queryByText("Concept artwork · placeholder")).not.toBeInTheDocument();
  });

  it("replaces a failed image with a clearly labelled fallback", () => {
    render(<StoreArtwork design={design} />);
    fireEvent.error(screen.getByRole("img", { name: "Pink heart surrounded by a cyan orbit" }));

    expect(screen.queryByAltText("Pink heart surrounded by a cyan orbit")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Artwork preview unavailable" })).toBeInTheDocument();
    expect(screen.getByText("Artwork preview unavailable")).toBeVisible();
  });

  it("attempts a new approved image after the previous source failed", () => {
    const { rerender } = render(<StoreArtwork design={design} />);
    fireEvent.error(screen.getByRole("img", { name: "Pink heart surrounded by a cyan orbit" }));

    rerender(
      <StoreArtwork
        design={{
          ...design,
          artworkRevision: 2,
          artwork: { kind: "image", src: "/store/test/revised.webp", alt: "Revised heart artwork" },
        }}
      />,
    );

    expect(screen.getByRole("img", { name: "Revised heart artwork" })).toHaveAttribute(
      "src",
      "/store/test/revised.webp",
    );
    expect(screen.queryByText("Artwork preview unavailable")).not.toBeInTheDocument();
  });

  it("preserves a placeholder's authored label without suggesting finished artwork", () => {
    render(
      <StoreArtwork
        design={{ ...design, artwork: { kind: "placeholder", label: "Comic cover preview" } }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Comic cover preview. Concept artwork · placeholder." }),
    ).toBeInTheDocument();
    expect(screen.getByText("Concept artwork · placeholder")).toBeVisible();
  });

  it("keeps the same design study when promoted from a card to the hero", () => {
    const placeholder = {
      ...design,
      artwork: { kind: "placeholder" as const, label: "Shared design" },
    };
    const { rerender } = render(<StoreArtwork design={placeholder} />);
    const motif = screen.getByRole("img").className.match(/store-artwork--motif-\d/)?.[0];
    expect(motif).toBeTruthy();
    rerender(<StoreArtwork design={placeholder} hero />);
    expect(screen.getByRole("img")).toHaveClass(motif!);
  });
});
