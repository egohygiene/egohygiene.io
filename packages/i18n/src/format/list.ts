export function formatList(locale: string, value: string[]): string {
  return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(value);
}
