import assert from "node:assert/strict";
import {
  isPrototypePollutionKey,
  isSafeLabelValue,
  validateSafeLabelArray,
  validateSafeLabelValue,
} from "../src/renderer/safeLabelValidation.js";

assert.equal(isPrototypePollutionKey("__proto__"), true);
assert.equal(isPrototypePollutionKey("safe_label"), false);

for (const label of ["safe_label", "safe-label", "safe.label", "safe:label", "a1"]) {
  assert.equal(isSafeLabelValue(label), true, label);
}

for (const label of ["", " safe", "safe ", "safe label", "https://example.invalid", "a\\b", "a/b", "token_value", "a;b"]) {
  assert.equal(isSafeLabelValue(label), false, label);
}

assert.deepEqual(
  validateSafeLabelArray(["safe_label"], {
    allowedLabels: ["safe_label"],
    invalidLabel: "invalid",
    unknownLabel: "unknown",
  }),
  { labels: ["safe_label"], failures: [] },
);

assert.deepEqual(
  validateSafeLabelArray(["safe_label", "safe_label"], {
    allowedLabels: ["safe_label"],
    invalidLabel: "invalid",
    unknownLabel: "unknown",
  }),
  { labels: ["safe_label"], failures: ["invalid"] },
);

assert.deepEqual(
  validateSafeLabelArray(["other_label"], {
    allowedLabels: ["safe_label"],
    invalidLabel: "invalid",
    unknownLabel: "unknown",
  }),
  { labels: [], failures: ["unknown"] },
);

assert.deepEqual(
  validateSafeLabelValue("safe_label", {
    allowedLabels: ["safe_label"],
    invalidLabel: "invalid",
    unknownLabel: "unknown",
  }),
  { label: "safe_label", failures: [] },
);

assert.deepEqual(
  validateSafeLabelValue("https://example.invalid", {
    allowedLabels: ["safe_label"],
    invalidLabel: "invalid",
    unknownLabel: "unknown",
  }),
  { label: "", failures: ["invalid"] },
);

console.log("safe-label-validation: pass");
