/** Synthetic test registration only. Never import into production composition. */
import { createLocaleRegistry } from "../../packages/i18n/src/index";
import { resources } from "../../apps/egohygiene.io/src/i18n/resources";
import { createLocaleFixture } from "../../apps/egohygiene.io/src/test/locale-fixtures";

export const catalogLocaleRegistry = createLocaleRegistry({
  sourceLocale: "en",
  locales: [
    { id: "en", formatLocale: "en-US", direction: "ltr", label: "English" },
    { id: "fr", formatLocale: "fr-FR", direction: "ltr", label: "Synthetic French" },
    {
      id: "fr-CA",
      formatLocale: "fr-CA",
      direction: "ltr",
      label: "Synthetic Canadian French",
      fallbacks: ["fr"],
    },
    {
      id: "qps-Ploc",
      formatLocale: "en-GB",
      direction: "ltr",
      label: "Expanded test text",
      fallbacks: ["fr"],
    },
  ],
});

export const catalogLocaleMessages = {
  en: resources,
  // Catalog translation does not imply that interface copy is translated.
  fr: {},
  "fr-CA": {},
  "qps-Ploc": createLocaleFixture(resources, "expanded").messages,
};
