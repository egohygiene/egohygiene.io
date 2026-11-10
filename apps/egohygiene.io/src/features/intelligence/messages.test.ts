import { createTranslator } from "@egohygiene/i18n";
import { expect, it } from "vitest";

import intelligence from "../../i18n/locales/en/intelligence.json";

it.each([
  ["intelligence.directory.results", "Showing 2 of 5 represented public repositories."],
  [
    "intelligence.now.bounded",
    "Showing the first 2 of 5 public items. Open repository evidence for the full projected lists.",
  ],
])("renders the actual source message %s through the shared translator", (key, expected) => {
  const t = createTranslator({ locale: "en", messages: { intelligence } });
  expect(t(key, { shown: 2, total: 5 })).toBe(expected);
});
