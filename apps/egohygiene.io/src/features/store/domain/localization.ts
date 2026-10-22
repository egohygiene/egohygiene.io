import {
  publicStoreTranslations,
  type StoreEntry,
  type StoreTranslation,
} from "@egohygiene/schemas";

/** App composition supplies the selected content language and its explicit registry fallbacks. */
export interface StoreContentSelection {
  readonly locale: string;
  readonly fallbackLocales?: readonly string[];
}

export interface StoreLocalizedText {
  readonly value: string;
  /** The language of this field, which may differ from the selected interface language. */
  readonly locale: string;
}

export interface StoreEntryContent {
  readonly title: StoreLocalizedText;
  readonly description: StoreLocalizedText;
  readonly artworkAlt?: StoreLocalizedText;
  readonly artworkLabel?: StoreLocalizedText;
  readonly unavailableReason?: StoreLocalizedText;
  readonly variantLabels: readonly (StoreLocalizedText & { readonly variantId: string })[];
}

/** Resolve presentation fields without constructing a second catalog or rewriting canonical data. */
export function getStoreEntryContent(
  entry: StoreEntry,
  selection: StoreContentSelection,
): StoreEntryContent {
  // Intl preserves first occurrence while canonicalizing and rejecting malformed locale IDs.
  // No implicit regional fallback: only the caller's declared chain and the entry's source.
  const locales = Intl.getCanonicalLocales([
    selection.locale,
    ...(selection.fallbackLocales ?? []),
    entry.sourceLocale,
  ]);
  const translations = new Map(
    publicStoreTranslations(entry).map((translation) => [translation.locale, translation]),
  );
  const resolve = (
    source: string,
    translated: (translation: StoreTranslation) => { readonly value: string } | undefined,
  ): StoreLocalizedText => {
    for (const locale of locales) {
      // A source-language field wins when encountered, even before later configured fallbacks.
      if (locale === entry.sourceLocale) return { value: source, locale };
      const translation = translations.get(locale);
      const value = translation && translated(translation);
      if (value) return { value: value.value, locale };
    }
    return { value: source, locale: entry.sourceLocale };
  };

  return {
    title: resolve(entry.title, (translation) => translation.fields.title),
    description: resolve(entry.description, (translation) => translation.fields.description),
    ...(entry.kind === "design" && entry.artwork.kind === "image"
      ? { artworkAlt: resolve(entry.artwork.alt, (translation) => translation.fields.artworkAlt) }
      : {}),
    ...(entry.kind === "design" && entry.artwork.kind === "placeholder"
      ? {
          artworkLabel: resolve(
            entry.artwork.label,
            (translation) => translation.fields.artworkLabel,
          ),
        }
      : {}),
    ...(entry.kind === "product" && entry.purchase.state === "unavailable"
      ? {
          unavailableReason: resolve(
            entry.purchase.reason,
            (translation) => translation.fields.unavailableReason,
          ),
        }
      : {}),
    variantLabels:
      entry.kind === "product" && entry.purchase.state === "live"
        ? entry.purchase.variants.map((variant) => ({
            variantId: variant.id,
            ...resolve(variant.label, (translation) =>
              translation.fields.variantLabels?.find(
                (candidate) => candidate.variantId === variant.id,
              ),
            ),
          }))
        : [],
  };
}

/** Compatibility/composition normalization with explicit language case rules; accents are retained. */
export function normalizeStoreSearchText(value: string, locale: string): string {
  return value.normalize("NFKC").toLocaleLowerCase(locale).normalize("NFKC");
}
