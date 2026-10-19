import assert from "node:assert/strict";
import { test } from "node:test";

import { CHECKOUT_HANDOFF_FIXTURE } from "../checkout-handoff/fixture.ts";
import { decideHandoffRequest } from "../checkout-handoff/network.ts";

const origin = "http://127.0.0.1:4179";
const navigation = {
  url: CHECKOUT_HANDOFF_FIXTURE.checkoutUrl,
  method: "GET",
  resourceType: "document",
  isMainFrameNavigation: true,
};

test("the handoff boundary allows local assets and intercepts only the exact provider document", () => {
  assert.equal(decideHandoffRequest(navigation, origin), "destination");
  assert.equal(
    decideHandoffRequest(
      { ...navigation, url: `${origin}/assets/app.js`, resourceType: "script" },
      origin,
    ),
    "local",
  );
});

test("wrong destinations, credentials, methods and non-navigation requests are blocked", () => {
  for (const request of [
    { ...navigation, url: `${navigation.url}?variant=unreviewed` },
    { ...navigation, url: `${navigation.url}/other` },
    { ...navigation, url: "https://unreviewed.fourthwall.com/products/other" },
    { ...navigation, url: "https://example.invalid/" },
    { ...navigation, url: "http://127.0.0.1:4180/" },
    { ...navigation, url: "http://127.0.0.1.example.invalid:4179/" },
    { ...navigation, url: "http://user:password@127.0.0.1:4179/" },
    { ...navigation, method: "POST" },
    { ...navigation, url: `${origin}/orders`, method: "POST" },
    { ...navigation, resourceType: "fetch", isMainFrameNavigation: false },
    { ...navigation, resourceType: "image", isMainFrameNavigation: false },
    { ...navigation, isMainFrameNavigation: false },
  ]) {
    assert.equal(decideHandoffRequest(request, origin), "block", JSON.stringify(request));
  }
});

test("the allowed application origin must be an explicit loopback HTTP origin", () => {
  for (const invalidOrigin of [
    "https://egohygiene.io",
    "http://localhost:4179",
    `${origin}/path`,
  ]) {
    assert.throws(() => decideHandoffRequest(navigation, invalidOrigin));
  }
});
