import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "#test-utils";
import { AppProviders } from "../app/providers";
import { resources } from "../i18n/resources";
import { HomePage } from "./HomePage";

function renderHome() {
  return renderWithRouter(
    <AppProviders>
      <HomePage />
    </AppProviders>,
  );
}

describe("HomePage", () => {
  it("links the featured public artwork to its canonical design page", () => {
    const { getByRole, getByText } = renderHome();
    expect(getByRole("link", { name: "Explore this design: heartburst" })).toHaveAttribute(
      "href",
      "/store/designs/heartburst",
    );
    expect(
      getByRole("img", { name: /A fuchsia heart with radiating black ink splashes/i }),
    ).toHaveAttribute("src", "/store/heartburst/heartburst-light.webp");
    expect(getByText(/purchases are not available yet/i)).toBeInTheDocument();
  });

  it("keeps a store destination available when the feature image fails", () => {
    const { getByRole, getAllByRole, getByText, queryByRole } = renderHome();
    fireEvent.error(
      getByRole("img", { name: /A fuchsia heart with radiating black ink splashes/i }),
    );
    expect(
      queryByRole("link", { name: "Explore this design: heartburst" }),
    ).not.toBeInTheDocument();
    expect(getByText(resources.landing.designUnavailable)).toBeInTheDocument();
    for (const link of getAllByRole("link", { name: "Explore the store" })) {
      expect(link).toHaveAttribute("href", "/store");
    }
  });

  it("applies home metadata and restores an existing description on exit", () => {
    const originalTitle = document.title;
    const description = document.createElement("meta");
    description.name = "description";
    description.content = "Previous route description";
    document.head.append(description);
    const { unmount } = renderHome();

    expect(document.title).toBe(resources.landing.title);
    expect(description.content).toBe(resources.landing.description);
    unmount();
    expect(document.title).toBe(originalTitle);
    expect(description.content).toBe("Previous route description");
    description.remove();
  });

  it("removes only the description it created when leaving the home page", () => {
    const { unmount } = renderHome();
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      resources.landing.description,
    );
    unmount();
    expect(document.querySelector('meta[name="description"]')).not.toBeInTheDocument();
  });
});
