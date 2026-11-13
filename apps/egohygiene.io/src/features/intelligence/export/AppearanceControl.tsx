import { useTheme } from "@egohygiene/themes";

import { useBrowserSnapshot } from "../../../hooks/useBrowserSnapshot";

/** The portable site uses the same preference and tokens as the ordinary app. */
export function AppearanceControl() {
  const { theme, setTheme } = useTheme();
  const ready = useBrowserSnapshot();
  return (
    <div className="oi-appearance">
      <label>
        <span>Appearance</span>
        <select
          aria-label="Appearance"
          disabled={!ready}
          value={theme}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "system" || value === "light" || value === "dark") setTheme(value);
          }}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          {theme === "high-contrast" ? <option value="high-contrast">High contrast</option> : null}
        </select>
      </label>
      <noscript>
        <p>Changing appearance requires JavaScript. All evidence remains available below.</p>
      </noscript>
    </div>
  );
}
