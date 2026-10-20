import { createLocaleRegistry, useI18n } from "@egohygiene/i18n";
import { act, fireEvent, render } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppProviders } from "../app/providers";
import { Header } from "../components/Header/Header";
import { localePreferenceKey } from "./config";
import { LanguageSelector } from "./LanguageSelector";
import { LocaleLink } from "./LocaleLink";
import { LocaleProvider } from "./LocaleProvider";
import { resources } from "./resources";

// Engineering dictionaries only: no reviewed public language is added.
const registry = createLocaleRegistry({
  sourceLocale: "en",
  locales: [
    { id: "en", formatLocale: "en", direction: "ltr", label: "English" },
    { id: "qps-Ploc", formatLocale: "en", direction: "ltr", label: "Expanded fixture" },
    { id: "ar", formatLocale: "ar-u-nu-arab", direction: "rtl", label: "RTL fixture" },
  ],
});
const catalogs = {
  en: {
    ...resources,
    probe: {
      title: "Source message",
      count_one: "{{amount}} item",
      count_other: "{{amount}} items",
    },
  },
  "qps-Ploc": { probe: { title: "[An expanded engineering fixture message]" } },
  ar: { probe: { title: "نص تجريبي" } },
};

function Probe() {
  const { t, formatNumber } = useI18n();
  return (
    <>
      <h1>{t("probe.title")}</h1>
      <p>{t("probe.count", { count: 2, amount: formatNumber(2) })}</p>
      <LocaleLink to="/store/products/example?view=design#details">Product</LocaleLink>
      <LocaleLink to="/store?lang=en">Explicit English</LocaleLink>
      <LocaleLink to="https://checkout.example.invalid/item?size=M">Provider</LocaleLink>
    </>
  );
}

function setup(entry = "/store?view=design#catalog") {
  const router = createMemoryRouter(
    [
      {
        element: (
          <>
            <Header />
            <Outlet />
          </>
        ),
        children: [{ path: "*", element: <Probe /> }],
      },
    ],
    { initialEntries: [entry] },
  );
  const result = render(
    <AppProviders router={router} registry={registry} catalogs={catalogs}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { ...result, router };
}

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("website locale service", () => {
  it("uses the URL ahead of preferences, applies document direction, and falls back per message", () => {
    window.localStorage.setItem(localePreferenceKey, "qps-Ploc");
    const result = setup("/store?lang=ar&view=design#catalog");
    expect(result.getByRole("heading", { name: "نص تجريبي" })).toBeInTheDocument();
    expect(result.getByText("٢ items")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "ar");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
    expect(result.getByRole("combobox", { name: "Language" })).toHaveValue("ar");
    expect(result.getByRole("link", { name: "Product" })).toHaveAttribute(
      "href",
      "/store/products/example?view=design&lang=ar#details",
    );
    expect(result.getByRole("link", { name: "Explicit English" })).toHaveAttribute(
      "href",
      "/store?lang=en",
    );
    expect(result.getByRole("link", { name: "Provider" })).toHaveAttribute(
      "href",
      "https://checkout.example.invalid/item?size=M",
    );
    // Opening a shared URL does not silently replace the visitor's saved preference.
    expect(window.localStorage.getItem(localePreferenceKey)).toBe("qps-Ploc");
  });

  it("changes one provider, retains mobile selector focus and filters/hash, and follows Back/Forward", async () => {
    const result = setup("/store?lang=en&view=design#catalog");
    fireEvent.click(result.getByRole("button", { name: "Open navigation" }));
    const selector = result.getByRole("combobox", { name: "Language" });
    selector.focus();
    fireEvent.change(selector, { target: { value: "qps-Ploc" } });
    expect(
      await result.findByRole("heading", { name: "[An expanded engineering fixture message]" }),
    ).toBeInTheDocument();
    expect(selector).toHaveFocus();
    expect(result.getByRole("button", { name: "Close navigation" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(result.router.state.location.search).toBe("?lang=qps-Ploc&view=design");
    expect(result.router.state.location.hash).toBe("#catalog");
    expect(window.localStorage.getItem(localePreferenceKey)).toBe("qps-Ploc");
    await act(() => result.router.navigate(-1));
    expect(result.getByRole("heading", { name: "Source message" })).toBeInTheDocument();
    expect(selector).toHaveValue("en");
    await act(() => result.router.navigate(1));
    expect(selector).toHaveValue("qps-Ploc");
    fireEvent.click(result.getByRole("link", { name: "Product" }));
    expect(result.router.state.location.pathname).toBe("/store/products/example");
    expect(new URLSearchParams(result.router.state.location.search).get("lang")).toBe("qps-Ploc");
  });

  it("survives a denied storage getter, preserves the selected URL through navigation and a remount", async () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new DOMException("Denied", "SecurityError");
    });
    const result = setup("/store?lang=unsupported&view=design#catalog");
    expect(result.getByRole("heading", { name: "Source message" })).toBeInTheDocument();
    fireEvent.change(result.getByRole("combobox", { name: "Language" }), {
      target: { value: "ar" },
    });
    expect(await result.findByRole("heading", { name: "نص تجريبي" })).toBeInTheDocument();
    fireEvent.click(result.getByRole("link", { name: "Product" }));
    const location = result.router.state.location;
    const restored = `${location.pathname}${location.search}${location.hash}`;
    result.unmount();
    const remounted = setup(restored);
    expect(remounted.getByRole("combobox", { name: "Language" })).toHaveValue("ar");
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
  });

  it("uses a saved language for invalid or ambiguous URLs and restores document attributes on unmount", () => {
    document.documentElement.lang = "en-US";
    document.documentElement.removeAttribute("dir");
    window.localStorage.setItem(localePreferenceKey, "ar");
    const result = setup("/store?lang=en&lang=unknown");
    expect(result.getByRole("combobox", { name: "Language" })).toHaveValue("ar");
    result.unmount();
    expect(document.documentElement).toHaveAttribute("lang", "en-US");
    expect(document.documentElement).not.toHaveAttribute("dir");
  });

  it("uses source messages if a registered partial catalog is absent", () => {
    const result = render(
      <LocaleProvider
        registry={registry}
        catalogs={{ en: catalogs.en }}
        search="?lang=ar"
        onSearchChange={() => undefined}
      >
        <LanguageSelector />
        <p>
          <FallbackProbe />
        </p>
      </LocaleProvider>,
    );
    expect(result.getByText("Source message")).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("dir", "rtl");
  });

  it("binds production composition directly to the data router, including history changes", async () => {
    const router = createMemoryRouter([{ path: "*", element: <LanguageSelector /> }], {
      initialEntries: ["/store?lang=unknown&q=heart#catalog"],
    });
    const result = render(
      <AppProviders router={router}>
        <RouterProvider router={router} />
      </AppProviders>,
    );
    const selector = result.getByRole("combobox", { name: "Language" });
    expect(result.getAllByRole("option")).toHaveLength(1);
    fireEvent.change(selector, { target: { value: "en" } });
    expect(router.state.location.search).toBe("?lang=en&q=heart");
    expect(router.state.location.hash).toBe("#catalog");
    await act(() => router.navigate(-1));
    expect(router.state.location.search).toBe("?lang=unknown&q=heart");
    expect(selector).toHaveValue("en");
  });
});

function FallbackProbe() {
  return useI18n().t("probe.title");
}
