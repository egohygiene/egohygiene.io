import { describe, expect, it } from "vitest";

import { smokeApps, verifySmokeApp } from "../../scripts/build-smoke.mts";

describe("fresh production build smoke", () => {
  for (const app of smokeApps) {
    it(`${app} has current receipt-bound HTML and emitted assets`, async () => {
      const { STORE_SMOKE_INVOCATION_ID: invocationId } = process.env;
      const result = await verifySmokeApp(process.cwd(), app, invocationId);
      expect(result.files).toBeGreaterThan(2);
      expect(result.scripts.length).toBeGreaterThan(0);
      expect(result.styles.length).toBeGreaterThan(0);
    });
  }
});
