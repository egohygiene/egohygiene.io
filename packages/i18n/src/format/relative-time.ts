export function formatRelativeTime(
  locale: string,
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
): string {
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit);
}
