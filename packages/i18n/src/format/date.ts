export function formatDate(locale: string, value: Date): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(value);
}
