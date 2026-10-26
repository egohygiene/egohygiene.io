import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../../scripts/check-fourthwall.mjs", import.meta.url));
const token = "ptkn_test_value_must_never_be_logged";
const page = (results: unknown[], hasNextPage = false) => ({ results, paging: { hasNextPage } });

function runCheck(
  responseMap: Record<string, unknown> = {},
  environment: Record<string, string> = {},
  failure = "",
) {
  const directory = mkdtempSync(join(tmpdir(), "fourthwall-check-"));
  const hook = join(directory, "network.mjs");
  writeFileSync(
    hook,
    `
    const responses = ${JSON.stringify(responseMap)};
    globalThis.fetch = async (input, options) => {
      const url = new URL(input);
      if (options.method !== "GET" || options.redirect !== "error" || url.origin !== "https://storefront-api.fourthwall.com") throw new Error("Unexpected network operation");
      if (!Object.hasOwn(responses, url.pathname)) throw new Error("Unexpected endpoint");
      if (${JSON.stringify(failure)} === "network") throw new Error(${JSON.stringify(token)});
      if (${JSON.stringify(failure)} === "unauthorized") return new Response(${JSON.stringify(token)}, { status: 401 });
      return Response.json(responses[url.pathname]);
    };
  `,
  );
  try {
    return spawnSync(process.execPath, ["--import", hook, script], {
      encoding: "utf8",
      timeout: 15000,
      env: {
        ...process.env,
        FOURTHWALL_STOREFRONT_TOKEN: "",
        FOURTHWALL_SHOP_URL: "",
        ...environment,
      },
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("Fourthwall check works without credentials and makes no request", () => {
  const result = runCheck();
  assert.equal(result.status, 0);
  assert.match(result.stdout, /No request was sent/);
});

test("Fourthwall check performs a bounded read-only page check and reports empty or paged catalogs", () => {
  const result = runCheck(
    {
      "/v1/collections": page([{ id: "collection", name: "Example", slug: "example" }], true),
      "/v1/collections/all/products": page([]),
    },
    { FOURTHWALL_STOREFRONT_TOKEN: token },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 collections, 0 regular products, 0 bundles/);
  assert.match(result.stdout, /More pages are available/);
  assert.match(result.stdout, /No public products/);
  assert.ok(!`${result.stdout}${result.stderr}`.includes(token));
});

test("Fourthwall check validates products and handles bundles as explicitly unsupported for preview", () => {
  const product = {
    type: "PRODUCT",
    id: "product",
    name: "Example",
    slug: "example",
    state: { type: "AVAILABLE" },
    access: { type: "PUBLIC" },
    variants: [
      {
        id: "small",
        name: "S",
        unitPrice: { value: 42, currency: "USD" },
        stock: { type: "LIMITED", inStock: 3 },
      },
    ],
  };
  const base = { "/v1/collections": page([]) };
  const result = runCheck(
    {
      ...base,
      "/v1/collections/all/products": page([
        product,
        { type: "BUNDLE", id: "bundle", offers: [product] },
      ]),
    },
    { FOURTHWALL_STOREFRONT_TOKEN: token },
  );
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1 regular products, 1 bundles/);
  const invalid = runCheck(
    { ...base, "/v1/collections/all/products": page([{ ...product, variants: "bad" }]) },
    { FOURTHWALL_STOREFRONT_TOKEN: token },
  );
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /unsupported response shape/);
});

test("Fourthwall check never prints raw remote error or credential values", () => {
  for (const failure of ["network", "unauthorized"]) {
    const result = runCheck(
      { "/v1/collections": null },
      { FOURTHWALL_STOREFRONT_TOKEN: token },
      failure,
    );
    assert.equal(result.status, 1);
    assert.ok(!`${result.stdout}${result.stderr}`.includes(token));
  }
  const invalid = runCheck({}, { FOURTHWALL_STOREFRONT_TOKEN: "platform-secret-do-not-print" });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Expected a ptkn_ Storefront token/);
  assert.ok(!invalid.stderr.includes("platform-secret-do-not-print"));
});

test("optional shop origin is validated locally and compared without visiting the supplied host", () => {
  const environment = {
    FOURTHWALL_STOREFRONT_TOKEN: token,
    FOURTHWALL_SHOP_URL: "https://example.fourthwall.com",
  };
  const responses = {
    "/v1/shop": { domain: "example.fourthwall.com", publicDomain: "merch.example.com" },
    "/v1/collections": page([]),
    "/v1/collections/all/products": page([]),
  };
  const result = runCheck(responses, environment);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /shop origin matches/);
  const mismatch = runCheck(responses, {
    ...environment,
    FOURTHWALL_SHOP_URL: "https://wrong.fourthwall.com",
  });
  assert.equal(mismatch.status, 1);
  assert.match(mismatch.stderr, /does not match/);
  const unsafe = runCheck(
    {},
    { ...environment, FOURTHWALL_SHOP_URL: "http://localhost/?token=private" },
  );
  assert.equal(unsafe.status, 1);
  assert.match(unsafe.stderr, /HTTPS shop origin/);
  assert.ok(!unsafe.stderr.includes("private"));
});
