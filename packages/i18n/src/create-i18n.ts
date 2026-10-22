import { canonicalizeLocale } from "./locale-registry";

export interface I18nMessages {
  readonly [key: string]: string | I18nMessages;
}

function findMessage(messages: I18nMessages, key: string): string | undefined {
  let current: string | I18nMessages = messages;

  for (const part of key.split(".")) {
    if (typeof current !== "object" || current === null || !Object.hasOwn(current, part)) {
      return undefined;
    }

    const next: string | I18nMessages | undefined = current[part];
    if (next === undefined) {
      return undefined;
    }
    current = next;
  }

  return typeof current === "string" ? current : undefined;
}

export function getMessage(messages: I18nMessages, key: string): string {
  return findMessage(messages, key) ?? key;
}

export interface I18nDictionary {
  readonly locale: string;
  readonly messages: I18nMessages;
}

export type I18nParameters = Readonly<Record<string, string | number>>;
export type Translator = (key: string, parameters?: I18nParameters) => string;

function getPluralCount(parameters: I18nParameters): number | undefined {
  if (!Object.hasOwn(parameters, "count")) return undefined;
  const count = parameters["count"];
  if (typeof count !== "number" || !Number.isFinite(count)) {
    throw new TypeError("Translation count must be a finite number.");
  }
  return count;
}

/** Plain text messages with named interpolation and Intl cardinal plural suffixes. */
export function createTranslator({
  locale,
  messages,
  fallbacks = [],
}: I18nDictionary & { readonly fallbacks?: readonly I18nDictionary[] }): Translator {
  const dictionaries = [{ locale, messages }, ...fallbacks].map((dictionary) => ({
    messages: dictionary.messages,
    plurals: new Intl.PluralRules(canonicalizeLocale(dictionary.locale)),
  }));

  return (key, parameters = {}) => {
    const count = getPluralCount(parameters);

    for (const dictionary of dictionaries) {
      // Resolve the grammar of the dictionary supplying the message, including fallback.
      const plural = typeof count === "number" ? dictionary.plurals.select(count) : undefined;
      const message =
        (plural === undefined
          ? undefined
          : (findMessage(dictionary.messages, `${key}_${plural}`) ??
            findMessage(dictionary.messages, `${key}_other`))) ??
        findMessage(dictionary.messages, key);

      if (message !== undefined) {
        return message.replace(
          /\{\{\s*([A-Za-z_][A-Za-z0-9_]*)\s*\}\}/g,
          (placeholder, name: string) =>
            Object.hasOwn(parameters, name) ? String(parameters[name]) : placeholder,
        );
      }
    }

    return key;
  };
}
