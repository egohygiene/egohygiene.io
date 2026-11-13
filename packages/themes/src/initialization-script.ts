import { themeNames, themeStorageKey } from "./theme.types.ts";

/** Blocking same-origin startup asset for static exports with an external-only CSP.
 * It follows the shared provider's preference contract before styles or React run.
 */
export const themeInitializationScript = `(() => {
  let preference = "system";
  try {
    const saved = window.localStorage.getItem(${JSON.stringify(themeStorageKey)});
    if (${JSON.stringify(themeNames)}.includes(saved)) preference = saved;
  } catch {}
  const prefersDark = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches : true;
  const resolved = preference === "system" ? (prefersDark ? "dark" : "light") : preference;
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved === "light" ? "light" : "dark";
})();
`;
