import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

import { validateReviewSchemaShape } from "../../scripts/intelligence-review-endpoints.mts";

const owner = JSON.parse(await readFile(new URL(
  "../../contracts/organization-intelligence/reviews/fleet-audits.v1.schema.json",
  import.meta.url,
), "utf8"));
const finding = owner.$defs.repositoryModel.properties.runs.items.properties.findings.items;
const observedRule = finding.allOf[7];
const policyRule = finding.allOf[10];

test("the pinned confirmed-finding rule accepts a matching observed member", () => {
  assert.doesNotThrow(() => validateReviewSchemaShape({
    status: "confirmed",
    evidence_classification: "observed",
    evidence: [{ classification: "inferred" }, { classification: "observed" }],
  }, observedRule, owner));
});

test("the pinned confirmed-finding rule rejects empty or nonmatching evidence", () => {
  for (const evidence of [[], [{ classification: "inferred" }]]) {
    assert.throws(() => validateReviewSchemaShape({
      status: "confirmed",
      evidence_classification: "observed",
      evidence,
    }, observedRule, owner), /Review input is incompatible/);
  }
});

test("the pinned policy-conformance rule requires one jointly matching member", () => {
  assert.doesNotThrow(() => validateReviewSchemaShape({
    nature: "policy-conformance",
    evidence: [{ classification: "inferred", kind: "source" },
      { classification: "observed", kind: "policy" }],
  }, policyRule, owner));
  assert.throws(() => validateReviewSchemaShape({
    nature: "policy-conformance",
    evidence: [{ classification: "observed", kind: "source" },
      { classification: "inferred", kind: "policy" }],
  }, policyRule, owner), /Review input is incompatible/);
});

test("contains keeps the existing bounded-array and nested-schema checks", () => {
  assert.throws(() => validateReviewSchemaShape(new Array(16385).fill("observed"),
    { contains: { const: "observed" } }, owner), /Review input is incompatible/);
  assert.throws(() => validateReviewSchemaShape(["observed"],
    { contains: false }, owner), /Review input is incompatible/);
  assert.doesNotThrow(() => validateReviewSchemaShape(["observed"],
    { contains: true }, owner));
});
