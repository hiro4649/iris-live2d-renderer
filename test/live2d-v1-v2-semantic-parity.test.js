import assert from "node:assert/strict";
import { createRendererState } from "../src/state.js";
import { createCompactSafeSummaryV2 } from "../src/renderer/compactSafeSummaryV2.js";
import {
  deriveCompactSafeSummaryV2Input,
  validateCompactSafeSummaryV2Parity,
} from "../src/renderer/compactSafeSummaryV2Adapter.js";

const v1Blocked = {
  ownerConfirmationConfirmed: false,
  checkedRowCount: 0,
  motionDatasetExecutable: false,
  priority1Status: "BLOCKED",
  trustedLoaderAllowlistEnabled: false,
  actualIngestionAllowed: false,
  runtimeReadinessClaimed: false,
  productionReadinessClaimed: false,
  realRendererEvidenceStatus: "missing",
};

const derivedInput = deriveCompactSafeSummaryV2Input(v1Blocked);
assert.deepEqual(derivedInput, {
  priority1Status: "BLOCKED",
  checkedRowCount: 0,
  motionDatasetExecutable: false,
  ownerConfirmationConfirmed: false,
  trustedLoaderStatus: "disabled",
  auditReferenceStatus: "missing",
  realRendererEvidenceStatus: "missing",
  actualDataStatus: "blocked",
  runtimeReadinessStatus: "blocked",
  productionReadinessStatus: "blocked",
});

const v2 = createCompactSafeSummaryV2(derivedInput);
assert.equal(validateCompactSafeSummaryV2Parity(v1Blocked, v2).status, "pass");

for (const [group, label, expectedFailure] of [
  ["owner_confirmation", "owner_confirmation_false", "v1_owner_false_v2_owner_blocker_missing"],
  ["motion_dataset", "checked_row_count_zero", "v1_checked_zero_v2_checked_row_blocker_missing"],
  ["motion_dataset", "motion_dataset_non_executable", "v1_motion_non_executable_v2_motion_blocker_missing"],
  ["priority1", "priority1_blocked", "v1_priority1_blocked_v2_priority1_blocker_missing"],
  ["trusted_loader", "trusted_loader_disabled", "v1_trusted_loader_disabled_v2_trusted_loader_blocker_missing"],
  ["actual_data", "actual_ingestion_false", "v1_actual_ingestion_false_v2_actual_data_blocker_missing"],
  ["runtime_readiness", "runtime_readiness_false", "v1_runtime_false_v2_runtime_blocker_missing"],
  ["production_readiness", "production_readiness_false", "v1_production_false_v2_production_blocker_missing"],
  ["real_renderer_evidence", "real_renderer_evidence_missing", "v1_real_evidence_missing_v2_real_evidence_blocker_missing"],
]) {
  const contradiction = structuredClone(v2);
  contradiction.blockerGroups[group] = contradiction.blockerGroups[group].filter((item) => item !== label);
  const result = validateCompactSafeSummaryV2Parity(v1Blocked, contradiction);
  assert.equal(result.status, "fail", expectedFailure);
  assert.equal(result.failures.includes(expectedFailure), true, expectedFailure);
}

const candidateContradiction = structuredClone(v2);
candidateContradiction.overallStatus = "candidate_only";
const candidateResult = validateCompactSafeSummaryV2Parity(v1Blocked, candidateContradiction);
assert.equal(candidateResult.failures.includes("v2_overall_status_not_blocked"), true);

const state = createRendererState();
const status = state.status();
const health = state.health();
const runtimeConfig = state.browserRuntimeConfig();
assert.deepEqual(status.live2d_safe_summary_v2, health.live2d_safe_summary_v2);
assert.deepEqual(status.live2d_safe_summary_v2, runtimeConfig.live2d_safe_summary_v2);
assert.equal(validateCompactSafeSummaryV2Parity(v1Blocked, status.live2d_safe_summary_v2).status, "pass");

console.log("live2d-v1-v2-semantic-parity: pass");
