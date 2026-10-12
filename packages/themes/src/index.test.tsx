import { readFileSync } from "node:fs";
import { URL as NodeUrl } from "node:url";
import { runInNewContext } from "node:vm";

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeProvider, applyTheme, resolveTheme, themeNames, useTheme } from "./index";

const storageKey = "egohygiene-theme";
function readStartupScript(): string {
  const startupHtml = readFileSync(
    new NodeUrl("../../../apps/egohygiene.io/index.html", import.meta.url),
    "utf8",
  );
  const script = startupHtml.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
  if (!script) throw new Error("The website must include its pre-paint theme bootstrap.");
  return script;
}
const startupScript = readStartupScript();

function ThemeControls() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  return (
    <>
      <output aria-label="Current theme">{theme}:{resolvedTheme}</output>
      {themeNames.map((name) => (
        <button key={name} onClick={() => setTheme(name)} type="button">{name}</button>
      ))}
    </>
  );
}

function renderControls() {
  return render(<ThemeProvider><ThemeControls /></ThemeProvider>);
}

function mockColorScheme(prefersDark: boolean) {
  const media = Object.assign(new EventTarget(), {
    matches: prefersDark,
    media: "(prefers-color-scheme: dark)",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  });
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  return (dark: boolean) => act(() => {
    media.matches = dark;
    media.dispatchEvent(new Event("change"));
  });
}

function denyStorage(): never {
  throw new DOMException("Storage is unavailable", "SecurityError");
}

beforeEach(() => {
  window.localStorage.clear();
  delete document.documentElement.dataset["theme"];
  document.documentElement.style.colorScheme = "";
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("theme preferences", () => {
  it("resolves system themes and applies the document color scheme", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(applyTheme("light")).toBe("light");
    expect(document.documentElement.dataset["theme"]).toBe("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(applyTheme("high-contrast")).toBe("high-contrast");
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });

  it.each(["storage getter", "getItem"])("renders and supports in-memory selection when the %s throws", (failure) => {
    const changeScheme = mockColorScheme(false);
    if (failure === "storage getter") vi.spyOn(window, "localStorage", "get").mockImplementation(denyStorage);
    else vi.spyOn(Storage.prototype, "getItem").mockImplementation(denyStorage);

    renderControls();
    expect(screen.getByRole("status")).toHaveTextContent("system:light");
    fireEvent.click(screen.getByRole("button", { name: "high-contrast" }));
    changeScheme(true);
    expect(screen.getByRole("status")).toHaveTextContent("high-contrast:high-contrast");
    expect(document.documentElement.dataset["theme"]).toBe("high-contrast");
  });

  it("keeps a saved preference and manual changes when setItem throws", () => {
    window.localStorage.setItem(storageKey, "dark");
    const changeScheme = mockColorScheme(false);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is full", "QuotaExceededError");
    });
    renderControls();
    expect(screen.getByRole("status")).toHaveTextContent("dark:dark");
    fireEvent.click(screen.getByRole("button", { name: "light" }));
    changeScheme(true);
    expect(screen.getByRole("status")).toHaveTextContent("light:light");
    expect(document.documentElement.dataset["theme"]).toBe("light");
    fireEvent.click(screen.getByRole("button", { name: "system" }));
    expect(screen.getByRole("status")).toHaveTextContent("system:dark");
  });

  it.each(["invalid", "", "__proto__"])("uses the system preference for invalid persisted value %j", (stored) => {
    window.localStorage.setItem(storageKey, stored);
    mockColorScheme(false);
    renderControls();
    expect(screen.getByRole("status")).toHaveTextContent("system:light");
    expect(window.localStorage.getItem(storageKey)).toBe("system");
  });

  it("tracks system changes only while system is selected", () => {
    const changeScheme = mockColorScheme(false);
    renderControls();
    changeScheme(true);
    expect(screen.getByRole("status")).toHaveTextContent("system:dark");
    fireEvent.click(screen.getByRole("button", { name: "light" }));
    changeScheme(false);
    changeScheme(true);
    expect(screen.getByRole("status")).toHaveTextContent("light:light");
    fireEvent.click(screen.getByRole("button", { name: "system" }));
    expect(screen.getByRole("status")).toHaveTextContent("system:dark");
    changeScheme(false);
    expect(screen.getByRole("status")).toHaveTextContent("system:light");
  });

  it("persists a manual preference and restores it after remount", () => {
    mockColorScheme(false);
    const rendered = renderControls();
    fireEvent.click(screen.getByRole("button", { name: "high-contrast" }));
    expect(window.localStorage.getItem(storageKey)).toBe("high-contrast");
    rendered.unmount();
    renderControls();
    expect(screen.getByRole("status")).toHaveTextContent("high-contrast:high-contrast");
  });
});

describe("pre-paint website bootstrap", () => {
  function bootstrap(stored: string | null, prefersDark: boolean, failure?: "getItem" | "storage getter" | "missing matchMedia") {
    const root = { dataset: {} as Record<string, string>, style: { colorScheme: "" } };
    const browser = {
      matchMedia: failure === "missing matchMedia" ? undefined : () => ({ matches: prefersDark }),
      get localStorage() {
        if (failure === "storage getter") return denyStorage();
        return { getItem: () => failure === "getItem" ? denyStorage() : stored };
      },
    };
    runInNewContext(startupScript, { window: browser, document: { documentElement: root } });
    return root;
  }

  it.each([...themeNames, "invalid", "", null])("matches the provider contract before React runs for %j", (stored) => {
    for (const prefersDark of [false, true]) {
      const preference = themeNames.find((name) => name === stored) ?? "system";
      const resolved = resolveTheme(preference, prefersDark);
      const root = bootstrap(stored, prefersDark);
      expect(root.dataset["theme"]).toBe(resolved);
      expect(root.style.colorScheme).toBe(resolved === "light" ? "light" : "dark");
    }
  });

  it.each(["getItem", "storage getter"] as const)("still sets a system theme when %s throws", (failure) => {
    expect(bootstrap("dark", false, failure).dataset["theme"]).toBe("light");
    expect(bootstrap("light", true, failure).dataset["theme"]).toBe("dark");
  });

  it("uses the same dark fallback as the provider when matchMedia is unavailable", () => {
    expect(bootstrap("system", false, "missing matchMedia").dataset["theme"]).toBe("dark");
  });
});
