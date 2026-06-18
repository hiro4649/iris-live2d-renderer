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
assert.equal(attention.overallStatus, "blocked");
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:priority1_status"), true);
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:checked_row_count"), true);
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:motion_dataset_executable"), true);
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:owner_confirmation"), true);
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:trusted_loader"), true);
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:actual_data"), true);
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:runtime_readiness"), true);
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:production_readiness"), true);
assert.equal(attention.rejectionLabels.includes("immutable_boundary_override:real_renderer_evidence"), true);
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
assert.equal(candidate.overallStatus, "blocked");
assert.equal(candidate.blockerGroups.real_renderer_evidence.includes("real_renderer_evidence_missing"), true);
assert.equal(candidate.rendererEvidenceStatus.includes("decision_engine_available_non_authorizing"), true);
assert.equal(candidate.rendererEvidenceStatus.includes("candidate_engine_available_is_not_real_evidence"), true);
assertBoundary(candidate);

for (const [overrides, expected] of [
  [{ priority1Status: "future_review_ready" }, "immutable_boundary_override:priority1_status"],
  [{ checkedRowCount: 1 }, "immutable_boundary_override:checked_row_count"],
  [{ motionDatasetExecutable: true }, "immutable_boundary_override:motion_dataset_executable"],
  [{ ownerConfirmationConfirmed: true }, "immutable_boundary_override:owner_confirmation"],
  [{ trustedLoaderStatus: "owner_scoped_future_ready" }, "immutable_boundary_override:trusted_loader"],
  [{ actualDataStatus: "not_applicable_for_candidate" }, "immutable_boundary_override:actual_data"],
  [{ runtimeReadinessStatus: "not_applicable_for_candidate" }, "immutable_boundary_override:runtime_readiness"],
  [{ productionReadinessStatus: "not_applicable_for_candidate" }, "immutable_boundary_override:production_readiness"],
  [{ realRendererEvidenceStatus: "candidate_engine_available" }, "immutable_boundary_override:real_renderer_evidence"],
]) {
  const result = createCompactSafeSummaryV2(overrides);
  assert.equal(result.rejectionLabels.includes(expected), true, expected);
  assert.equal(result.overallStatus, "blocked");
  assertBoundary(result);
}

const auditReferenceOnly = createCompactSafeSummaryV2({ auditReferenceStatus: "present" });
assert.deepEqual(auditReferenceOnly.blockerGroups.audit_reference, []);
assert.equal(auditReferenceOnly.overallStatus, "blocked");
assert.equal(auditReferenceOnly.blockerGroups.priority1.includes("priority1_blocked"), true);
assert.equal(auditReferenceOnly.blockerGroups.real_renderer_evidence.includes("real_renderer_evidence_missing"), true);
assertBoundary(auditReferenceOnly);

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
  [{ noncriticalAttentionLabels: ["https://example.invalid"] }, "noncritical_attention_label_invalid"],
  [{ candidateOnlyLabels: ["candidate only"] }, "candidate_only_label_invalid"],
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
assert.deepEqual(surfaces.status.live2d_safe_summary_v2, surfaces.health.live2d_safe_summary_v2);
assert.deepEqual(surfaces.status.live2d_safe_summary_v2, surfaces.runtimeConfig.live2d_safe_summary_v2);

const input = { noncriticalAttentionLabels: ["attention"] };
const snapshot = JSON.stringify(input);
assert.deepEqual(createCompactSafeSummaryV2(input), createCompactSafeSummaryV2(input));
assert.equal(JSON.stringify(input), snapshot);

console.log("compact-safe-summary-v2: pass");
