import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import * as actualDataPreauthGates from "../src/renderer/planning/motionDatasetActualDataPreauthGates.js";
import * as motionDatasetPlanning from "../src/renderer/planning/motionDatasetPlanningSummaries.js";
import {
  createPlanningParityFingerprint,
  selectPlanningSafetyProjection,
} from "./helpers/planningParityFingerprint.js";

const baseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-actual-data-preauth-gates-baseline-v1.json", "utf8"));
const source = readFileSync("src/renderer/planning/motionDatasetActualDataPreauthGates.js", "utf8");

const MOVED_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_CRITERIA_CHECKLIST_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REVIEW_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_PROJECTION_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_LEDGER_SCHEMA",
  "LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_BLOCKER_GATE_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_CRITERIA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_REJECTION_CRITERIA",
  "LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_REVIEW_SECTIONS",
  "LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_CONFIRMATION_SCOPES",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_REASONS",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_SAFE_NEXT_ACTIONS",
  "LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_READY_PREREQUISITE_LABELS",
  "LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_MISSING_PREREQUISITE_LABELS",
  "LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_REQUIRED_BLOCKERS",
  "LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_CLEARANCE_CONDITIONS",
  "createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary",
  "createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary",
  "createMotionDatasetActualDataNoGoSummaryProjectionSummary",
  "createMotionDatasetOwnerSubmissionReadinessLedgerSummary",
  "createMotionDatasetFinalActualDataPreauthBlockerGateSummary",
]);

assert.equal(baseline.schema, "live2d_motion_dataset_actual_data_preauth_gates_baseline_v1");
assert.equal(baseline.baselineSourceHead, "4646367d503ffb4cd46151fdcc9a2f5b27b3a988");
assert.equal(baseline.safety.syntheticInputsOnly, true);
assert.equal(baseline.safety.actualDataRead, false);
assert.equal(baseline.safety.actualFileRead, false);
assert.equal(baseline.safety.actualHashCalculated, false);
assert.equal(baseline.safety.actualIngestionAllowed, false);
assert.equal(baseline.safety.parserExecuted, false);
assert.equal(baseline.safety.redactionScanExecuted, false);
assert.equal(baseline.safety.auditExecuted, false);
assert.equal(baseline.safety.ownerConfirmationCreated, false);
assert.equal(baseline.safety.ownerConfirmationConfirmed, false);
assert.equal(baseline.safety.runtimeReadinessClaimed, false);
assert.equal(baseline.safety.productionReadinessClaimed, false);
assert.equal(baseline.safety.trustedLoaderEnabled, false);
assert.equal(baseline.safety.priority1Status, "BLOCKED");
assert.equal(baseline.safety.checkedRowCount, 0);
assert.equal(baseline.safety.motionDatasetExecutable, false);
assert.equal(baseline.safety.goNogoStatus, "no_go");
assert.equal(baseline.safety.testOnlyFingerprint, true);
assert.equal(baseline.safety.productSourceHashVerified, false);

for (const name of MOVED_EXPORTS) {
  assert.equal(Object.hasOwn(actualDataPreauthGates, name), true, `new actual-data preauth module export missing ${name}`);
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy compatibility export missing ${name}`);
  assert.equal(actualDataPreauthGates[name], legacyProvisioning[name], `legacy binding identity mismatch ${name}`);
  assert.equal(Object.hasOwn(motionDatasetPlanning, name), false, `actual-data preauth symbol leaked into planning facade ${name}`);
}

for (const [name, expected] of Object.entries(baseline.constants)) {
  assert.deepEqual(actualDataPreauthGates[name], expected.value, `constant value changed: ${name}`);
  const fingerprint = createPlanningParityFingerprint(actualDataPreauthGates[name]);
  assert.deepEqual(fingerprint.keyOrder, expected.keyOrder, `constant key order changed: ${name}`);
  assert.equal(fingerprint.jsonLength, expected.jsonLength, `constant json length changed: ${name}`);
  assert.equal(fingerprint.jsonSha256, expected.jsonSha256, `constant test-only fingerprint changed: ${name}`);
  if (actualDataPreauthGates[name] && typeof actualDataPreauthGates[name] === "object") {
    assert.equal(Object.isFrozen(actualDataPreauthGates[name]), expected.objectIsFrozen, `constant freeze changed: ${name}`);
  }
}

for (const [factoryName, cases] of Object.entries(baseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const input = caseName === "default_input" ? undefined : inputForActualDataPreauthBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = caseName === "default_input"
      ? actualDataPreauthGates[factoryName]()
      : actualDataPreauthGates[factoryName](input);
    const legacyValue = caseName === "default_input"
      ? legacyProvisioning[factoryName]()
      : legacyProvisioning[factoryName](structuredClone(input));
    const fingerprint = createPlanningParityFingerprint(value);

    assert.equal(expected.behavior, "return", `actual-data preauth baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(value, legacyValue, `legacy factory parity changed: ${factoryName}:${caseName}`);
    assert.deepEqual(fingerprint.keyOrder, expected.keyOrder, `factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(fingerprint.jsonLength, expected.jsonLength, `factory json length changed: ${factoryName}:${caseName}`);
    assert.equal(fingerprint.jsonSha256, expected.jsonSha256, `factory test-only fingerprint changed: ${factoryName}:${caseName}`);
    assert.deepEqual(selectPlanningSafetyProjection(value), expected.selectedSafetyProjection, `factory safety projection changed: ${factoryName}:${caseName}`);
    assert.equal(expected.inputMutated, false, `baseline recorded mutation: ${factoryName}:${caseName}`);
    assert.deepEqual(input, before, `factory mutated input: ${factoryName}:${caseName}`);
  }
}

for (const forbiddenPattern of [
  /from\s+["']\.\.\/cubismLoaderProvisioning\.js["']/,
  /from\s+["']node:fs["']/,
  /from\s+["']node:path["']/,
  /from\s+["']node:crypto["']/,
  /from\s+["']node:child_process["']/,
  /from\s+["']node:http["']/,
  /from\s+["']node:https["']/,
  /export\s+\*\s+from/,
  /export\s+default/,
]) {
  assert.equal(forbiddenPattern.test(source), false, `forbidden actual-data preauth source pattern: ${forbiddenPattern}`);
}

assert.equal(source.includes('from "../../contracts.js"'), true, "expected actual-data preauth import missing contracts");

function inputForActualDataPreauthBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_metadata_labels_only: {
      submission_request_id: "safe_submission_label",
      file_format_label: "jsonl",
      declared_row_count_label: "safe_declared_count_label",
      source_hash_label: "safe_source_hash_label",
      hash_algorithm_label: "sha256_label",
      schema_version_label: "safe_schema_label",
      dataset_version_label: "safe_dataset_version_label",
      dataset_split_plan_label: "safe_split_label",
      owner_confirmation_scope_label: "safe_owner_scope_label",
      nested: { label: "safe_nested_label" },
      labels: ["safe_label_a", "safe_label_b"],
    },
    owner_submission_received_attempt: { owner_submission_received: true },
    owner_submission_accepted_attempt: { owner_submission_accepted: true },
    owner_confirmation_attempt: { owner_confirmation_created: true, owner_confirmation_confirmed: true },
    owner_handoff_review_attempt: { owner_handoff_review_confirmed: true },
    actual_data_preauthorized_attempt: { actual_data_preauthorized: true },
    actual_data_task_started_attempt: { actual_data_task_started: true },
    actual_data_accepted_attempt: { actual_data_accepted: true },
    actual_ingestion_attempt: { actual_ingestion_allowed: true },
    real_row_attempt: { real_row_data_present: true },
    row_body_read_attempt: { row_body_read: true },
    checked_row_count_attempt: { checked_row_count: 1 },
    motion_execution_attempt: { motion_dataset_executable: true },
    runtime_readiness_attempt: { runtime_readiness_claimed: true },
    production_readiness_attempt: { production_readiness_claimed: true },
    priority_resolution_attempt: { priority1_status: "RESOLVED" },
    go_attempt: { go_nogo_status: "go", go_candidate: true },
    blocker_resolution_attempt: { blocker_resolved: true },
  }[caseName];
}

console.log("motion-dataset-actual-data-preauth-gates-extraction: pass");
