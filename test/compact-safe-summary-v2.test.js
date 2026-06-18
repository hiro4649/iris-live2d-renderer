import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRendererState } from "../src/state.js";
import {
  COMPACT_SAFE_SUMMARY_V2_BLOCKER_GROUPS,
  COMPACT_SAFE_SUMMARY_V2_PUBLIC_KEY,
  COMPACT_SAFE_SUMMARY_V2_SCHEMA,
  createCompactSafeSummaryV2,
} from "../src/renderer/compactSafeSummaryV2.js";

const fixture = JSON.parse(readFileSync("test/fixtures/live2d-safe-surface-contract-v2.json", "utf8"));

function assertBoundary(summary) {
  assert.equal(summary.schema, COMPACT_SAFE_SUMMARY_V2_SCHEMA);
  assert.equal(summary.schemaVersion, "2");
  assert.equal(summary.safeSummaryOnly, true);
  assert.equal(summary.runtimeReadinessClaimed, false);
  assert.equal(summary.productionReadinessClaimed, false);
  assert.equal(summary.ownerConfirmationCreated, false);
  assert.equal(summary.ownerConfirmationConfirmed, false);
  assert.equal(summary.trustedLoaderAllowlistEnabled, false);
  assert.equal(summary.actualIngestionAllowed, false);
  assert.equal(summary.motionDatasetExecutable, false);
  assert.equal(summary.priority1Status, "BLOCKED");
  assert.equal(summary.checkedRowCount, 0);
  for (const status of ["ready", "production_ready", "owner_confirmed"]) {
    assert.notEqual(summary.overallStatus, status);
  }
}

const blocked = createCompactSafeSummaryV2();
assert.equal(blocked.overallStatus, "blocked");
assert.deepEqual(Object.keys(blocked.blockerGroups).sort(), COMPACT_SAFE_SUMMARY_V2_BLOCKER_GROUPS.slice().sort());
assertBoundary(blocked);

for (const [overrides, expected] of [
  [{ priority1Status: "BLOCKED" }, "priority1_blocked"],
  [{ checkedRowCount: 0 }, "checked_row_count_zero"],
  [{ motionDatasetExecutable: false }, "motion_dataset_non_executable"],
  [{ ownerConfirmationConfirmed: false }, "owner_confirmation_false"],
  [{ trustedLoaderStatus: "disabled" }, "trusted_loader_disabled"],
]) {
  const result = createCompactSafeSummaryV2(overrides);
  assert.equal(JSON.stringify(result.blockerGroups).includes(expected), true, expected);
  assert.equal(result.overallStatus, "blocked");
  assertBoundary(result);
}

const attention = createCompactSafeSummaryV2({
  priority1Status: "future_review_ready",
  checkedRowCount: 1,
  motionDatasetExecutable: true,
  ownerConfirmationConfirmed: true,
  trustedLoaderStatus: "owner_scoped_future_ready",
  auditReferenceStatus: "present",
  realRendererEvidenceStatus: "candidate_engine_available",
  actualDataStatus: "not_applicable_for_candidate",
  runtimeReadinessStatus: "not_applicable_for_candidate",
  productionReadinessStatus: "not_applicable_for_candidate",
  noncriticalAttentionLabels: ["stale_noncritical_summary"],
});
assert.equal(attention.overallStatus, "attention_required");
assertBoundary(attention);

const candidate = createCompactSafeSummaryV2({
  priority1Status: "future_review_ready",
  checkedRowCount: 1,
  motionDatasetExecutable: true,
  ownerConfirmationConfirmed: true,
  trustedLoaderStatus: "owner_scoped_future_ready",
  auditReferenceStatus: "present",
  realRendererEvidenceStatus: "candidate_engine_available",
  actualDataStatus: "not_applicable_for_candidate",
  runtimeReadinessStatus: "not_applicable_for_candidate",
  productionReadinessStatus: "not_applicable_for_candidate",
  candidateOnlyLabels: ["candidate_engine_available"],
});
assert.equal(candidate.overallStatus, "candidate_only");
assertBoundary(candidate);

for (const [overrides, expected] of [
  [{ overallStatus: "ready" }, "forbidden_status:ready"],
  [{ overallStatus: "production_ready" }, "forbidden_status:production_ready"],
  [{ overallStatus: "owner_confirmed" }, "forbidden_status:owner_confirmed"],
  [{ endpoint: "redacted" }, "unsafe_field:endpoint"],
  [{ token: "redacted" }, "unsafe_field:token"],
  [{ secret: "redacted" }, "unsafe_field:secret"],
  [{ rawPayload: "redacted" }, "unsafe_field:rawPayload"],
  [{ actualFilePath: "redacted" }, "unsafe_field:actualFilePath"],
  [{ rowBody: "redacted" }, "unsafe_field:rowBody"],
  [{ unknownField: true }, "unknown_field:unknownField"],
]) {
  const result = createCompactSafeSummaryV2(overrides);
  assert.equal(result.rejectionLabels.includes(expected), true, expected);
  assert.equal(result.overallStatus, "blocked");
  assertBoundary(result);
}

const unsafeKey = createCompactSafeSummaryV2(Object.defineProperty({}, "__proto__", { value: "x", enumerable: true }));
assert.equal(unsafeKey.rejectionLabels.includes("unsafe_key:__proto__"), true);
assertBoundary(unsafeKey);

const state = createRendererState();
const surfaces = {
  status: state.status(),
  health: state.health(),
  runtimeConfig: state.browserRuntimeConfig(),
};

for (const [surfaceName, surface] of Object.entries(surfaces)) {
  assert.equal(Object.hasOwn(surface, COMPACT_SAFE_SUMMARY_V2_PUBLIC_KEY), true, surfaceName);
  const summary = surface[COMPACT_SAFE_SUMMARY_V2_PUBLIC_KEY];
  assertBoundary(summary);
  assert.equal(summary.overallStatus, "blocked", surfaceName);
  assert.equal(summary.schema, fixture.publicKey[COMPACT_SAFE_SUMMARY_V2_PUBLIC_KEY].schema, surfaceName);
}

const input = { noncriticalAttentionLabels: ["attention"] };
const snapshot = JSON.stringify(input);
assert.deepEqual(createCompactSafeSummaryV2(input), createCompactSafeSummaryV2(input));
assert.equal(JSON.stringify(input), snapshot);

console.log("compact-safe-summary-v2: pass");
