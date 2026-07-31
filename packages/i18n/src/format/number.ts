export function formatNumber(locale: string, value: number): string {
  return new Intl.NumberFormat(locale).format(value);
}
