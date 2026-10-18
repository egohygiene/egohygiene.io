import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { I18nProvider } from "@egohygiene/i18n";
import { getStorePurchaseAction } from "@egohygiene/schemas";

import { storeCatalog } from "../../content/store";
import { resources } from "../../i18n/resources";
import { FourthwallPreviewPage } from "./FourthwallPreviewPage";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

function renderPreview() {
  return render(
    <I18nProvider messages={resources}>
      <MemoryRouter>
        <FourthwallPreviewPage />
      </MemoryRouter>
    </I18nProvider>,
  );
}

describe("Fourthwall local tryout", () => {
  it("requires a size, previews the correct variant, and clears stale handoffs without sending requests", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    renderPreview();
    const preview = screen.getByRole("button", { name: "Preview checkout handoff" });
    const region = screen.getByRole("region", { name: "Checkout handoff preview" });
    expect(preview).toBeDisabled();
    expect(screen.getByRole("button", { name: "XL — unavailable in this example" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "M" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Quantity" }), { target: { value: "2" } });
    fireEvent.click(preview);
    expect(within(region).getByText("Black / M")).toBeVisible();
    expect(within(region).getByText("$84.00")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "L" }));
    expect(within(region).queryByText("Black / M")).not.toBeInTheDocument();
    fireEvent.click(preview);
    expect(within(region).getByText("Black / L")).toBeVisible();
    expect(within(region).getByText("$90.00")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear the preview" }));
    expect(within(region).queryByText("Black / L")).not.toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getAllByRole("link").every((link) => link.getAttribute("href")?.startsWith("/store"))).toBe(true);
  });

  it("does not change the canonical catalog purchase state or routes", () => {
    renderPreview();
    expect(getStorePurchaseAction(storeCatalog, "product-demo-signal-heart-hoodie")).toEqual({ kind: "disabled", label: "Preview — coming later" });
    expect(storeCatalog.entries.filter((entry) => entry.kind === "product").every((entry) => entry.purchase.state !== "live")).toBe(true);
  });
});
