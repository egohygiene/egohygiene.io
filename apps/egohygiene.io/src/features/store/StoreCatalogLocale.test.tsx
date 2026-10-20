import { I18nProvider } from "@egohygiene/i18n";
import { fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithRouter } from "#test-utils";
import { resources } from "../../i18n/resources";
import { StoreCatalogPage } from "./StorePages";

describe("catalog interface messages", () => {
  it("uses whole plural messages, formatted counts and source fallback while retaining catalog text", () => {
    const { getByRole, getByText } = renderWithRouter(
      <I18nProvider
        locale="ar-u-nu-arab"
        messages={{
          storeCards: {
            catalog: {
              heading: "Fixture catalog heading",
              searchLabel: "Fixture search",
              matching_one: "Match {{formattedCount}}: {{query}}",
              matching_other: "Matches {{formattedCount}}: {{query}}",
            },
          },
        }}
        fallbacks={[{ locale: "en", messages: resources }]}
      >
        <StoreCatalogPage />
      </I18nProvider>,
      "/store/catalog?q=heartburst",
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Fixture catalog heading");
    expect(getByRole("status")).toHaveTextContent("Match ١: heartburst");
    expect(
      within(getByRole("region", { name: "Find your frequency." })).getByRole("heading", {
        level: 3,
        name: "heartburst",
      }),
    ).toBeInTheDocument();
    expect(getByRole("button", { name: "Everything", exact: true })).toBeInTheDocument();
    fireEvent.change(getByRole("searchbox", { name: "Fixture search" }), {
      target: { value: "no-matching-artwork" },
    });
    expect(getByRole("status")).toHaveTextContent("Matches ٠: no-matching-artwork");
    expect(
      getByText("No entries match your search. Try a different phrase or explore everything."),
    ).toBeInTheDocument();
  });
});
