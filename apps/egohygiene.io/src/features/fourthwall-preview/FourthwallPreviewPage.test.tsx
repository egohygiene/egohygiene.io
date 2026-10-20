import { type I18nMessages, I18nProvider } from "@egohygiene/i18n";
import { getStorePurchaseAction } from "@egohygiene/schemas";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { storeCatalog } from "../../content/store";
import fourthwallPreview from "../../i18n/locales/en/fourthwallPreview.json";
import { resources } from "../../i18n/resources";

const previewResources = { ...resources, fourthwallPreview };

import { FourthwallPreviewPage } from "./FourthwallPreviewPage";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function PreviewHarness({
  locale = "en",
  messages = previewResources,
}: {
  readonly locale?: string;
  readonly messages?: I18nMessages;
}) {
  return (
    <I18nProvider
      locale={locale}
      messages={messages}
      fallbacks={[{ locale: "en", messages: previewResources }]}
    >
      <MemoryRouter>
        <FourthwallPreviewPage />
      </MemoryRouter>
    </I18nProvider>
  );
}

function renderPreview() {
  return render(<PreviewHarness />);
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
    fireEvent.change(screen.getByRole("combobox", { name: "Quantity" }), {
      target: { value: "2" },
    });
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
    expect(
      screen.getAllByRole("link").every((link) => link.getAttribute("href")?.startsWith("/store")),
    ).toBe(true);
  });

  it("uses translated controls and the current formatting locale without changing the USD handoff", () => {
    const view = renderPreview();
    fireEvent.click(screen.getByRole("button", { name: "M" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Quantity" }), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Preview checkout handoff" }));
    expect(screen.getByText("$84.00")).toBeVisible();

    // Partial engineering fixture: public language approval is separate from formatting.
    view.rerender(
      <PreviewHarness
        locale="ar-u-nu-arab"
        messages={{
          fourthwallPreview: {
            details: {
              preview: "تجربة المعاينة",
              sizeUnavailable: "غير متاح: {{size}}",
            },
          },
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "تجربة المعاينة" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "غير متاح: XL" })).toBeDisabled();
    expect(screen.getByRole("option", { name: "٢" })).toHaveValue("2");
    const region = screen.getByRole("region", { name: "Checkout handoff preview" });
    expect(within(region).getByText("Black / M")).toBeVisible();
    expect(within(region).getByText("٢")).toBeVisible();
    const formattedUSD = new Intl.NumberFormat("ar-u-nu-arab", {
      style: "currency",
      currency: "USD",
    }).format(84);
    expect(region.textContent).toContain(formattedUSD);
    expect(screen.getByText("Illustrative price only · USD")).toBeVisible();
    expect(view.container.textContent).not.toMatch(/fourthwallPreview\.|\{\{/);
    expect(document.title).toBe("Fourthwall tryout · Ego Hygiene");
  });

  it("does not change the canonical catalog purchase state or routes", () => {
    renderPreview();
    expect(getStorePurchaseAction(storeCatalog, "product-demo-signal-heart-hoodie")).toEqual({
      kind: "disabled",
      label: "Preview — coming later",
    });
    expect(
      storeCatalog.entries
        .filter((entry) => entry.kind === "product")
        .every((entry) => entry.purchase.state !== "live"),
    ).toBe(true);
  });
});
