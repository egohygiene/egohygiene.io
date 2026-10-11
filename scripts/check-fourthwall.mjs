import { pathToFileURL } from "node:url";

import { z } from "zod";

import { fourthwallProductSchema } from "../apps/egohygiene.io/src/features/fourthwall-preview/contract.ts";

const pageSchema = z.object({
  results: z.array(z.unknown()),
  paging: z.object({ hasNextPage: z.boolean() }),
});
const collectionSchema = z.object({ id: z.string().min(1), name: z.string().min(1), slug: z.string().min(1) });
const bundleSchema = z.object({ type: z.literal("BUNDLE"), id: z.string().min(1), offers: z.array(z.unknown()) });
const shopSchema = z.object({ domain: z.string().min(1), publicDomain: z.string().min(1) });

class CheckError extends Error {}

function readShopOrigin(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port || url.pathname !== "/" || url.search || url.hash) throw new Error();
    return url.origin;
  } catch {
    throw new CheckError("FOURTHWALL_SHOP_URL must be an HTTPS shop origin without a path, query, port, or credentials.");
  }
}

/** Read-only first-page diagnostic. Tokens only go to the fixed Fourthwall API. */
export async function checkFourthwall(environment = process.env, fetcher = fetch) {
  const token = environment["FOURTHWALL_STOREFRONT_TOKEN"]?.trim();
  const shopValue = environment["FOURTHWALL_SHOP_URL"]?.trim();
  const expectedShop = shopValue ? readShopOrigin(shopValue) : undefined;
  if (!token) {
    return [
      "Fourthwall is not connected. The local mock preview works without credentials.",
      "Optional: add a Storefront token to apps/egohygiene.io/.env.local, then run task fourthwall:check.",
      "See docs/store/fourthwall-local-setup.md. No request was sent.",
    ];
  }
  if (!/^ptkn_[A-Za-z0-9_-]+$/.test(token)) {
    throw new CheckError("Expected a ptkn_ Storefront token. Do not use a Platform API key or client secret.");
  }

  async function get(path, schema) {
    const url = new URL(path, "https://storefront-api.fourthwall.com");
    url.searchParams.set("storefront_token", token);
    if (path !== "/v1/shop") {
      url.searchParams.set("page", "0");
      url.searchParams.set("size", "50");
    }
    let response;
    try {
      response = await fetcher(url, { method: "GET", redirect: "error", signal: AbortSignal.timeout(10000) });
    } catch {
      throw new CheckError("Fourthwall could not be reached within 10 seconds, or returned a redirect. Check your connection and try again.");
    }
    if (!response.ok) {
      const reason = response.status === 401 || response.status === 403 ? " Check the Storefront token in developer settings." : " Try again later or check Fourthwall’s service status.";
      throw new CheckError(`Fourthwall returned HTTP ${response.status}.${reason}`);
    }
    let json;
    try { json = await response.json(); } catch { throw new CheckError("Fourthwall returned an unreadable JSON response."); }
    const result = schema.safeParse(json);
    if (!result.success) throw new CheckError("Fourthwall returned an unsupported response shape. Review the documented API contract before connecting.");
    return result.data;
  }

  if (expectedShop) {
    const shop = await get("/v1/shop", shopSchema);
    const origins = [shop.domain, shop.publicDomain].map((value) => {
      try { return readShopOrigin(value.includes("://") ? value : `https://${value}`); } catch { return undefined; }
    });
    if (!origins.includes(expectedShop)) throw new CheckError("The configured shop URL does not match the shop returned for this Storefront token.");
  }

  const collections = await get("/v1/collections", pageSchema);
  if (!collections.results.every((value) => collectionSchema.safeParse(value).success)) throw new CheckError("A collection has an unsupported response shape.");
  const products = await get("/v1/collections/all/products", pageSchema);
  let productCount = 0;
  let bundleCount = 0;
  for (const value of products.results) {
    if (fourthwallProductSchema.safeParse(value).success) productCount += 1;
    else if (bundleSchema.safeParse(value).success) bundleCount += 1;
    else throw new CheckError("A product has an unsupported response shape. No catalog files were changed.");
  }
  return [
    "Fourthwall Storefront API responded successfully (read-only check).",
    ...(expectedShop ? ["Configured shop origin matches the Storefront token."] : ["Shop identity was not compared; FOURTHWALL_SHOP_URL is optional."]),
    `First page: ${collections.results.length} collections, ${productCount} regular products, ${bundleCount} bundles.`,
    ...(bundleCount ? ["Bundles were counted only; the local tryout supports regular products."] : []),
    ...(collections.paging.hasNextPage || products.paging.hasNextPage ? ["More pages are available; this bounded diagnostic does not import the full catalog."] : []),
    ...(products.results.length ? [] : ["No public products were returned. The mock preview is still available."]),
    "No files, carts, payments, orders, or provider activation were created. The browser preview still uses fictional data.",
  ];
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    for (const message of await checkFourthwall()) console.log(message);
  } catch (error) {
    console.error(error instanceof CheckError ? error.message : "The Fourthwall diagnostic failed. No credentials or raw API response were printed.");
    process.exitCode = 1;
  }
}
