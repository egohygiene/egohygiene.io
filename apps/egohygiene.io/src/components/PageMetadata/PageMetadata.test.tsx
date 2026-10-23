import { I18nProvider } from "@egohygiene/i18n";
import { act, cleanup, render } from "@testing-library/react";
import { createMemoryRouter, MemoryRouter, RouterProvider } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";

import { AppProviders } from "../../app/providers";
import { resources } from "../../i18n/resources";
import { HelpPage } from "../../pages/HelpPage";
import { PageMetadata } from "./PageMetadata";

const routers: ReturnType<typeof createMemoryRouter>[] = [];
afterEach(() => {
  cleanup();
  routers.splice(0).forEach((router) => router.dispose());
});

describe("client publication metadata", () => {
  it("updates generated tags in place and removes canonical/image identity on a missing route", async () => {
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://egohygiene.io/store/designs/heartburst";
    canonical.setAttribute("data-page-metadata", "");
    const image = document.createElement("meta");
    image.setAttribute("property", "og:image");
    image.content = "https://egohygiene.io/store/heartburst/heartburst-light.webp";
    image.setAttribute("data-page-metadata", "");
    document.head.append(canonical, image);
    const router = createMemoryRouter(
      [
        {
          path: "/store/designs/heartburst",
          element: <PageMetadata title="Artwork title" description="Artwork preview" />,
        },
        {
          path: "/store",
          element: <PageMetadata title="Store title" description="Store description" />,
        },
        {
          path: "*",
          element: <PageMetadata title="Missing title" description="Missing description" />,
        },
      ],
      { initialEntries: ["/store/designs/heartburst?lang=en#artwork"] },
    );
    routers.push(router);
    const result = render(
      <AppProviders router={router}>
        <RouterProvider router={router} />
      </AppProviders>,
    );

    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')).toBe(canonical);
    expect(document.head.querySelectorAll('meta[property="og:image"]')).toHaveLength(1);
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Artwork title",
    );
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute(
      "content",
      canonical.href,
    );
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index,follow",
    );

    await act(async () => {
      await router.navigate("/missing/deep?lang=en");
    });
    expect(document.title).toBe("Missing title");
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:image"]')).toBeNull();
    expect(document.head.querySelector('meta[name="twitter:image"]')).toBeNull();
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,follow",
    );

    await act(async () => {
      await router.navigate("/store?q=heart#featured-incompris");
    });
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://egohygiene.io/store",
    );
    expect(document.head.querySelector('meta[property="og:image"]')).toBeNull();
    expect(document.head.querySelector('meta[name="twitter:description"]')).toHaveAttribute(
      "content",
      "Store description",
    );
    result.unmount();
    expect(document.head.querySelector('link[rel="canonical"]')).toBe(canonical);
    expect(document.head.querySelector('meta[property="og:image"]')).toBe(image);
    canonical.remove();
    image.remove();
  });

  it("keeps failed known pages noindex without their normal canonical", () => {
    render(
      <I18nProvider messages={resources}>
        <MemoryRouter initialEntries={["/store"]}>
          <PageMetadata error title="Could not load" description="Try again" />
        </MemoryRouter>
      </I18nProvider>,
    );
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex,follow",
    );
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Could not load",
    );
  });

  it("updates social text with locale messages while keeping canonical identity", () => {
    const messages = {
      ...resources,
      pages: {
        ...resources.pages,
        help: {
          ...resources.pages.help,
          title: "Aide synthétique",
          description: "Description synthétique",
        },
      },
    };
    const view = (translated: boolean) => (
      <I18nProvider locale={translated ? "fr" : "en"} messages={translated ? messages : resources}>
        <MemoryRouter initialEntries={["/help?lang=fr"]}>
          <HelpPage />
        </MemoryRouter>
      </I18nProvider>
    );
    const result = render(view(false));
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      resources.pages.help.title,
    );
    result.rerender(view(true));
    expect(document.title).toBe("Aide synthétique");
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
      "content",
      "Aide synthétique",
    );
    expect(document.head.querySelector('meta[name="twitter:description"]')).toHaveAttribute(
      "content",
      "Description synthétique",
    );
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://egohygiene.io/help",
    );
  });
});
