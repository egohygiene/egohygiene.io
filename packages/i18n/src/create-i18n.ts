export interface I18nMessages {
  readonly [key: string]: string | I18nMessages;
}

export function getMessage(messages: I18nMessages, key: string): string {
  let current: string | I18nMessages = messages;

  for (const part of key.split(".")) {
    if (typeof current !== "object" || current === null || !Object.hasOwn(current, part)) {
      return key;
    }

    const next: string | I18nMessages | undefined = current[part];
    if (next === undefined) {
      return key;
    }
    current = next;
  }

  return typeof current === "string" ? current : key;
}
