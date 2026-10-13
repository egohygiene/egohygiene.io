import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import type { StoreDesign } from "@egohygiene/schemas";

import { StoreArtworkGallery } from "./StoreArtworkGallery";

const firstDesign: StoreDesign = {
  schemaVersion: 1,
  kind: "design",
  id: "design-test-orbit",
  slug: "orbit-artwork",
  title: "Orbit artwork",
  description: "A public artwork fixture for the gallery.",
  visibility: "public",
  artworkRevision: 1,
  artwork: {
    kind: "image",
    src: "/store/test/orbit.webp",
    alt: "A pink heart inside a cyan orbit",
  },
  contextIds: [],
};

const secondDesign: StoreDesign = {
  ...firstDesign,
  id: "design-test-garden",
  slug: "garden-artwork",
  title: "Garden artwork",
  artwork: { kind: "image", src: "/store/test/garden.webp", alt: "A lavender flower under a moon" },
};

const showModalDescriptor = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  "showModal",
);
const closeDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");
const showModal = vi.fn(function (this: HTMLDialogElement) {
  this.setAttribute("open", "");
});
const close = vi.fn(function (this: HTMLDialogElement) {
  this.removeAttribute("open");
});

// jsdom cannot reproduce native modal focus containment; browser tests cover that behavior.
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value: showModal,
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: close });
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
  vi.clearAllMocks();
});

afterAll(() => {
  if (showModalDescriptor)
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", showModalDescriptor);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  if (closeDescriptor) Object.defineProperty(HTMLDialogElement.prototype, "close", closeDescriptor);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
});

describe("StoreArtworkGallery", () => {
  it("keeps an empty gallery as an honest placeholder without a dead viewer control", () => {
    render(<StoreArtworkGallery designs={[]} title="Future collection" />);
    expect(screen.getByRole("img", { name: "Concept artwork · placeholder" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("omits thumbnail navigation when there is only one artwork", () => {
    render(<StoreArtworkGallery designs={[firstDesign]} title="Orbit hoodie" />);
    expect(screen.getByRole("button", { name: "View artwork: Orbit hoodie" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Choose artwork" })).not.toBeInTheDocument();
  });

  it("preserves a design's placeholder motif in the gallery and enlarged viewer", () => {
    const placeholderDesign: StoreDesign = {
      ...firstDesign,
      id: "design-test-signal",
      artwork: { kind: "placeholder", label: "Signal study" },
    };
    render(<StoreArtworkGallery designs={[placeholderDesign]} title="Signal collection" />);
    expect(
      screen.getByRole("img", { name: "Signal study. Concept artwork · placeholder." }),
    ).toHaveClass("store-artwork--motif-1");
    fireEvent.click(screen.getByRole("button", { name: "View artwork: Signal collection" }));
    expect(
      within(screen.getByRole("dialog")).getByRole("img", {
        name: "Signal study. Concept artwork · placeholder.",
      }),
    ).toHaveClass("store-artwork--motif-1");
  });

  it("selects artwork by identity through reordering and falls back when it is removed", () => {
    const { rerender } = render(
      <StoreArtworkGallery designs={[firstDesign, secondDesign]} title="Two studies" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Select artwork: Garden artwork" }));
    expect(screen.getByRole("img", { name: "A lavender flower under a moon" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Select artwork: Garden artwork" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByText("2 / 2")).toBeInTheDocument();

    rerender(<StoreArtworkGallery designs={[secondDesign, firstDesign]} title="Two studies" />);
    expect(screen.getByRole("img", { name: "A lavender flower under a moon" })).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    rerender(<StoreArtworkGallery designs={[firstDesign]} title="One study" />);
    expect(
      screen.getByRole("img", { name: "A pink heart inside a cyan orbit" }),
    ).toBeInTheDocument();
  });

  it("opens the selected artwork and restores focus and existing scroll styles when closed", () => {
    document.body.style.overflow = "clip";
    render(<StoreArtworkGallery designs={[firstDesign, secondDesign]} title="Two studies" />);
    fireEvent.click(screen.getByRole("button", { name: "Select artwork: Garden artwork" }));
    const opener = screen.getByRole("button", { name: "View artwork: Two studies" });
    opener.focus();
    fireEvent.click(opener);

    const dialog = screen.getByRole("dialog", { name: "Two studies" });
    expect(showModal).toHaveBeenCalledOnce();
    expect(
      within(dialog).getByRole("img", { name: "A lavender flower under a moon" }),
    ).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    const closeButton = screen.getByRole("button", { name: "Close artwork viewer" });
    expect(closeButton).toHaveFocus();
    fireEvent.click(closeButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(close).toHaveBeenCalledOnce();
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe("clip");
  });

  it("handles native cancellation and releases the scroll lock when unmounted", () => {
    const { unmount } = render(
      <StoreArtworkGallery designs={[firstDesign]} title="Orbit hoodie" />,
    );
    const opener = screen.getByRole("button", { name: "View artwork: Orbit hoodie" });
    opener.focus();
    fireEvent.click(opener);
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe("");

    fireEvent.click(opener);
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
