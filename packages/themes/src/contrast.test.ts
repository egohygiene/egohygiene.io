import { readFileSync } from "node:fs";
import { URL as NodeUrl } from "node:url";
import { parse } from "postcss";
import { describe, expect, it } from "vitest";

import colors from "../../design-tokens/src/tokens/color.json";

type Variables = Record<string, string>;

// This checks declared flat-color contracts, not computed styles or browser
// contrast. ThemeProvider places the selected theme on the document root.
function rootVariables(path: string, selector: string): Variables {
  const source = parse(readFileSync(new NodeUrl(path, import.meta.url), "utf8"));
  const rules = source.nodes.filter(
    (node) => node.type === "rule" && node.selectors.includes(selector),
  );
  if (rules.length !== 1) throw new Error(`Expected one root rule for ${selector} in ${path}`);
  const variables: Variables = {};
  for (const rule of rules) {
    if (rule.type !== "rule") continue;
    rule.walkDecls((declaration) => {
      if (declaration.prop.startsWith("--")) variables[declaration.prop] = declaration.value;
    });
  }
  return variables;
}

function colorValue(value: string, variables: Variables, seen: readonly string[] = []): string {
  if (/^#[\da-f]{6}$/i.test(value)) return value;
  const reference = /^var\((--[\w-]+)\)$/.exec(value)?.[1];
  if (!reference || seen.includes(reference) || variables[reference] === undefined) {
    throw new Error(`Unsupported or unresolved flat color: ${value}`);
  }
  return colorValue(variables[reference], variables, [...seen, reference]);
}

function luminance(hex: string): number {
  const color = colorValue(hex, {});
  return [0.2126, 0.7152, 0.0722].reduce((sum, weight, index) => {
    const channel = Number.parseInt(color.slice(index * 2 + 1, index * 2 + 3), 16) / 255;
    const linear = channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    return sum + weight * linear;
  }, 0);
}

function contrast(variables: Variables, foreground: string, background: string): number {
  const first = luminance(colorValue(`var(${foreground})`, variables));
  const second = luminance(colorValue(`var(${background})`, variables));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

const base = {
  ...Object.fromEntries(
    Object.entries(colors).map(([name, value]) => [`--eh-color-${name}`, value]),
  ),
  ...rootVariables("./styles/base.css", ":root"),
};

describe("source-declared flat contrast contracts (not browser measurements)", () => {
  for (const theme of ["light", "dark", "high-contrast"]) {
    const variables = {
      ...base,
      ...rootVariables(`./styles/${theme}.css`, `[data-theme="${theme}"]`),
    };

    it(`${theme} action text meets the normal-text threshold`, () => {
      expect(
        contrast(variables, "--color-action-foreground", "--color-action-background"),
      ).toBeGreaterThanOrEqual(4.5);
    });

    it(`${theme} focus color distinguishes the declared background and surface`, () => {
      for (const background of ["--color-background", "--color-surface"]) {
        expect(contrast(variables, "--color-focus", background)).toBeGreaterThanOrEqual(3);
      }
    });
  }

  it("the website light focus override distinguishes both declared adjacent surfaces", () => {
    const theme = "light";
    const variables = {
      ...base,
      ...rootVariables("../../../apps/egohygiene.io/src/styles/app.css", `[data-theme="${theme}"]`),
    };
    for (const background of ["--color-background", "--color-surface"]) {
      expect(contrast(variables, "--color-focus", background)).toBeGreaterThanOrEqual(3);
    }
  });

  it("uses the luminance endpoints without rounding threshold comparisons", () => {
    expect(contrast({ "--front": "#ffffff", "--back": "#000000" }, "--front", "--back")).toBe(21);
    expect(contrast({ "--front": "#7b2cbf", "--back": "#7b2cbf" }, "--front", "--back")).toBe(1);
  });

  it.each(["transparent", "CanvasText", "#ffffff80", "rgb(255, 255, 255)", "var(--missing)"])(
    "rejects %s rather than inventing a flat rendered color",
    (value) => {
      expect(() => colorValue(value, {})).toThrow("Unsupported or unresolved flat color");
    },
  );
});
