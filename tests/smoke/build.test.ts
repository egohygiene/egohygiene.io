import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("production build smoke", () => {
  for (const app of ["egohygiene.io", "docs", "playground"]) {
    it(`${app} emits a build directory`, () => {
      const distDir = path.join(root, "apps", app, "dist");
      expect(existsSync(path.join(distDir, "index.html"))).toBe(true);
      expect(readdirSync(path.join(distDir, "assets")).length).toBeGreaterThan(0);
    });
  }
});
