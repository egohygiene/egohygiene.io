import { I18nProvider } from "@egohygiene/i18n";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import shell from "../../i18n/locales/en/shell.json";
import { SkipLink } from "./SkipLink";

describe("SkipLink", () => {
  it("links to the main landmark with a translated accessible name", () => {
    const { getByRole } = render(
      <I18nProvider messages={{ shell: { ...shell, skipToContent: "Zum Inhalt" } }}>
        <SkipLink />
      </I18nProvider>,
    );
    expect(getByRole("link", { name: "Zum Inhalt" })).toHaveAttribute("href", "#main-content");
  });
});
