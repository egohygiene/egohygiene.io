export interface LocaleDefinition {
  readonly id: string;
  readonly formatLocale: string;
  readonly direction: "ltr" | "rtl";
  readonly label: string;
  readonly fallbacks?: readonly string[];
}

export interface LocaleRegistry {
  readonly sourceLocale: string;
  readonly locales: readonly LocaleDefinition[];
  /** Exact registered locale, or the source locale for unknown/malformed preferences. */
  readonly resolve: (input?: string | null) => LocaleDefinition;
  /** Ordered fallbacks, excluding the selected locale and ending with the source. */
  readonly getFallbacks: (input?: string | null) => readonly LocaleDefinition[];
}

export function canonicalizeLocale(locale: string): string {
  try {
    const canonical = Intl.getCanonicalLocales(locale)[0];
    if (canonical !== undefined) return canonical;
  } catch {
    // Report a stable configuration error instead of an engine-specific Intl error.
  }
  throw new TypeError(`Invalid locale identifier: ${JSON.stringify(locale)}.`);
}

function normalizeDefinition(locale: LocaleDefinition): LocaleDefinition {
  const id = canonicalizeLocale(locale.id);
  if (locale.direction !== "ltr" && locale.direction !== "rtl") {
    throw new TypeError(`Invalid direction for locale ${id}.`);
  }
  if (typeof locale.label !== "string" || locale.label.trim() === "") {
    throw new TypeError(`Locale ${id} requires a label.`);
  }
  const formatLocale = canonicalizeLocale(locale.formatLocale);
  if (
    ![
      Intl.NumberFormat.supportedLocalesOf(formatLocale),
      Intl.DateTimeFormat.supportedLocalesOf(formatLocale),
      Intl.RelativeTimeFormat.supportedLocalesOf(formatLocale),
      Intl.ListFormat.supportedLocalesOf(formatLocale),
      Intl.PluralRules.supportedLocalesOf(formatLocale),
    ].every((supported) => supported.length === 1)
  ) {
    throw new TypeError(`Unsupported formatting locale ${formatLocale} for ${id}.`);
  }
  return Object.freeze({
    ...locale,
    id,
    formatLocale,
    fallbacks: Object.freeze((locale.fallbacks ?? []).map(canonicalizeLocale)),
  });
}

export function createLocaleRegistry({
  sourceLocale,
  locales,
}: {
  readonly sourceLocale: string;
  readonly locales: readonly LocaleDefinition[];
}): LocaleRegistry {
  const sourceId = canonicalizeLocale(sourceLocale);
  const definitions = new Map<string, LocaleDefinition>();

  for (const locale of locales) {
    const definition = normalizeDefinition(locale);
    if (definitions.has(definition.id))
      throw new TypeError(`Duplicate locale identifier: ${definition.id}.`);
    definitions.set(definition.id, definition);
  }

  const source = definitions.get(sourceId);
  if (!source) throw new TypeError(`Source locale ${sourceId} is not registered.`);
  if (source.fallbacks?.length) throw new TypeError("The source locale cannot declare fallbacks.");

  const visited = new Set<string>();
  const visiting = new Set<string>();
  const validate = (definition: LocaleDefinition): void => {
    if (visiting.has(definition.id)) {
      throw new TypeError(`Locale fallback cycle includes ${definition.id}.`);
    }
    if (visited.has(definition.id)) return;
    visiting.add(definition.id);
    for (const id of definition.fallbacks ?? []) {
      const fallback = definitions.get(id);
      if (!fallback) throw new TypeError(`Unknown fallback locale ${id} for ${definition.id}.`);
      validate(fallback);
    }
    visiting.delete(definition.id);
    visited.add(definition.id);
  };
  for (const definition of definitions.values()) validate(definition);

  const resolve = (input?: string | null): LocaleDefinition => {
    if (typeof input !== "string") return source;
    try {
      return definitions.get(canonicalizeLocale(input)) ?? source;
    } catch {
      return source;
    }
  };

  const chains = new Map<string, readonly LocaleDefinition[]>();
  for (const definition of definitions.values()) {
    const chain: LocaleDefinition[] = [];
    const seen = new Set([definition.id, source.id]);
    const append = (entry: LocaleDefinition): void => {
      for (const id of entry.fallbacks ?? []) {
        if (seen.has(id)) continue;
        seen.add(id);
        const fallback = definitions.get(id);
        if (fallback) {
          chain.push(fallback);
          append(fallback);
        }
      }
    };
    append(definition);
    if (definition.id !== source.id) chain.push(source);
    chains.set(definition.id, Object.freeze(chain));
  }

  return Object.freeze({
    sourceLocale: source.id,
    locales: Object.freeze([...definitions.values()]),
    resolve,
    getFallbacks: (input?: string | null) => chains.get(resolve(input).id) ?? [],
  });
}
