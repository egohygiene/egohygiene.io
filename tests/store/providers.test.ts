import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { parseStoreProviders } from "../../packages/schemas/src/store-providers.ts";

const source = new URL("../../apps/egohygiene.io/src/content/store/providers.json", import.meta.url);
const fixture = () => JSON.parse(readFileSync(source, "utf8")) as Record<string, unknown> & {
  providers: Array<Record<string, unknown>>;
};

test("the provider manifest keeps every researched channel disabled and separates order funding", () => {
  const manifest = parseStoreProviders(fixture());
  const channels = new Map(manifest.providers.map((entry) => [entry.id, entry]));
  assert.equal(manifest.providers.length, 9);
  assert.ok(manifest.providers.every((entry) => entry.status === "placeholder" && !entry.enabled));
  assert.equal(channels.get("fourthwall-catalog")?.orderFunding, "deducted-from-sale");
  assert.equal(channels.get("printify-pop-up")?.orderFunding, "deducted-from-sale");
  assert.equal(channels.get("printify-integration")?.orderFunding, "merchant-funded");
  assert.equal(channels.get("lulu-buy-button")?.orderFunding, "deducted-from-sale");
  assert.equal(channels.get("lulu-direct-integration")?.orderFunding, "merchant-funded");
  assert.equal(channels.get("contrado-dropshipping")?.orderFunding, "unverified");
  assert.deepEqual(channels.get("plaid-auth")?.capabilities, ["bank-linking"]);
});

test("configuration cannot activate providers or smuggle clients, credentials, or purchase links", () => {
  for (const change of [
    { enabled: true }, { status: "active" }, { status: "sandbox" },
    { apiKey: "dummy-test-only" }, { credentials: {} }, { checkoutUrl: "https://example.com" },
  ]) {
    const input = fixture();
    Object.assign(input.providers[0]!, change);
    assert.throws(() => parseStoreProviders(input), /providers.json:providers.0/);
  }
  const input = fixture();
  input["credentials"] = {};
  assert.throws(() => parseStoreProviders(input), /providers.json:\$/);
});

test("provider identities, source metadata, versions, and capabilities fail with source paths", () => {
  const cases: Array<[Record<string, unknown>, RegExp]> = [
    [{ provider: "unknown" }, /providers.0.provider/],
    [{ capabilities: ["invented-capability"] }, /providers.0.capabilities.0/],
    [{ reviewedAt: "2026-02-31" }, /providers.0.reviewedAt/],
    [{ sources: [{ title: "Unsafe", url: "http://example.com" }] }, /providers.0.sources.0.url/],
    [{ sources: [] }, /providers.0.sources/],
  ];
  for (const [change, expected] of cases) {
    const input = fixture();
    Object.assign(input.providers[0]!, change);
    assert.throws(() => parseStoreProviders(input), expected);
  }
  const duplicate = fixture();
  duplicate.providers.push({ ...duplicate.providers[0]! });
  assert.throws(() => parseStoreProviders(duplicate, "custom/providers.json"), /custom\/providers.json:providers.9.id: Duplicate/);
  assert.throws(() => parseStoreProviders({ ...fixture(), schemaVersion: 2 }), /schemaVersion/);
});

test("payment and banking placeholders cannot claim to fulfill or finance physical orders", () => {
  for (const id of ["stripe-payment-links", "square-payment-links", "plaid-auth"]) {
    const input = fixture();
    const entry = input.providers.find((candidate) => candidate["id"] === id)!;
    entry["orderFunding"] = "deducted-from-sale";
    assert.throws(() => parseStoreProviders(input), /do not fund physical fulfillment/);
    entry["orderFunding"] = "not-applicable";
    entry["capabilities"] = ["hosted-checkout", "physical-fulfillment", "payment-processing"];
    assert.throws(() => parseStoreProviders(input), /Capabilities do not match/);
  }
  const input = fixture();
  input.providers[0]!["orderFunding"] = "not-applicable";
  assert.throws(() => parseStoreProviders(input), /needs an explicit order funding model/);
});

test("provider parsing is pure and does not call a network client", (context) => {
  const fetch = context.mock.method(globalThis, "fetch", () => {
    throw new Error("Network calls are not allowed while reading provider placeholders");
  });
  const input = fixture();
  const before = JSON.stringify(input);
  parseStoreProviders(input);
  assert.equal(fetch.mock.callCount(), 0);
  assert.equal(JSON.stringify(input), before);
});
