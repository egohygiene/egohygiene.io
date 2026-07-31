export function safeStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}
