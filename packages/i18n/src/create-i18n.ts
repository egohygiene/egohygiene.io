export interface I18nMessages {
  readonly [key: string]: string | I18nMessages;
}

export function getMessage(messages: I18nMessages, key: string): string {
  return key.split(".").reduce<string | I18nMessages>((current, part) => {
    if (typeof current === "string") {
      return current;
    }
    return current[part] ?? key;
  }, messages) as string;
}
