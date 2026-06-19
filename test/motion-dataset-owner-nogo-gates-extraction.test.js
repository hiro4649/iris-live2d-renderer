import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import * as motionDatasetOwnerNoGoGates from "../src/renderer/planning/motionDatasetOwnerNoGoGates.js";
import * as motionDatasetPlanning from "../src/renderer/planning/motionDatasetPlanningSummaries.js";

const baseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-owner-nogo-gates-baseline-v1.json", "utf8"));
const source = readFileSync("src/renderer/planning/motionDatasetOwnerNoGoGates.js", "utf8");

const FACADE_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA",
  "createMotionDatasetActualDataTaskEntryGateSummary",
]);

const LEGACY_ONLY_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_BLOCKER_VISIBILITY",
  "LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_RESOLUTION_PREREQUISITES",
  "LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_BLOCKERS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FUTURE_PREREQUISITES",
  "LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_MISSING_BLOCKER_CHECKS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS",
  "createMotionDatasetRealRowFinalDryRunChecklistSummary",
  "createMotionDatasetRealRowGoNoGoBlockerMapSummary",
  "createMotionDatasetRealRowMissingDataFailClosedGateSummary",
  "createMotionDatasetRealRowPreIngestionReviewPacketSummary",
]);

const MOVED_EXPORTS = Object.freeze([...FACADE_EXPORTS, ...LEGACY_ONLY_EXPORTS]);

assert.equal(baseline.schema, "live2d_motion_dataset_owner_nogo_gates_baseline_v1");
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

for (const name of MOVED_EXPORTS) {
  assert.equal(Object.hasOwn(motionDatasetOwnerNoGoGates, name), true, `new owner no-go module export missing ${name}`);
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy compatibility export missing ${name}`);
  assert.equal(motionDatasetOwnerNoGoGates[name], legacyProvisioning[name], `legacy binding identity mismatch ${name}`);
}

for (const name of FACADE_EXPORTS) {
  assert.equal(Object.hasOwn(motionDatasetPlanning, name), true, `planning facade export missing ${name}`);
  assert.equal(motionDatasetPlanning[name], motionDatasetOwnerNoGoGates[name], `planning facade identity mismatch ${name}`);
}

for (const name of LEGACY_ONLY_EXPORTS) {
  assert.equal(Object.hasOwn(motionDatasetPlanning, name), false, `legacy-only owner no-go symbol leaked into planning facade ${name}`);
}

for (const [name, expected] of Object.entries(baseline.constants)) {
  assert.deepEqual(motionDatasetOwnerNoGoGates[name], expected.value, `constant value changed: ${name}`);
  if (motionDatasetOwnerNoGoGates[name] && typeof motionDatasetOwnerNoGoGates[name] === "object") {
    assert.deepEqual(Object.keys(motionDatasetOwnerNoGoGates[name]), expected.keys, `constant keys changed: ${name}`);
    assert.equal(JSON.stringify(motionDatasetOwnerNoGoGates[name]), expected.json, `constant json changed: ${name}`);
    assert.equal(Object.isFrozen(motionDatasetOwnerNoGoGates[name]), expected.objectIsFrozen, `constant freeze changed: ${name}`);
  }
}

for (const [factoryName, cases] of Object.entries(baseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const input = caseName === "default_input" ? undefined : inputForOwnerNoGoBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = caseName === "default_input"
      ? motionDatasetOwnerNoGoGates[factoryName]()
      : motionDatasetOwnerNoGoGates[factoryName](input);
    const legacyValue = caseName === "default_input"
      ? legacyProvisioning[factoryName]()
      : legacyProvisioning[factoryName](structuredClone(input));

    assert.equal(expected.behavior, "return", `owner no-go baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(value, legacyValue, `legacy factory parity changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keys, `factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value), expected.json, `factory json changed: ${factoryName}:${caseName}`);
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
  assert.equal(forbiddenPattern.test(source), false, `forbidden owner no-go source pattern: ${forbiddenPattern}`);
}

for (const allowedImport of [
  "../../contracts.js",
  "./motionDatasetPlanningSafety.js",
  "./motionDatasetPlanningCore.js",
  "./motionDatasetOwnerGates.js",
  "./motionDatasetAuditStubs.js",
]) {
  assert.equal(source.includes(`from "${allowedImport}"`), true, `expected owner no-go import missing ${allowedImport}`);
}

function inputForOwnerNoGoBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_metadata_labels_only: {
      request_id: "safe_request_label",
      submission_request_id: "safe_submission_label",
      requested_file_format: "jsonl",
      declared_row_count_label: "safe_declared_count_label",
      source_hash_label: "safe_source_hash_label",
      schema_version_label: "safe_schema_label",
      dataset_version_label: "safe_dataset_version_label",
      dataset_split_plan_label: "safe_split_label",
      owner_confirmation_scope_label: "safe_owner_scope_label",
      redaction_policy_ref: "safe_redaction_label",
      audit_run_id: "safe_audit_label",
    },
    actual_data_task_started_attempt: { actual_data_task_started: true, actual_data_task_approved: true },
    submission_received_attempt: { owner_submission_received: true },
    submission_accepted_attempt: { owner_submission_accepted: true, submission_accepted: true },
    actual_file_read_attempt: { actual_file_read: true, file_content_read: true },
    actual_hash_calculation_attempt: { actual_hash_calculated: true, hash_calculated: true },
    actual_content_attempt: { actual_file_content: "safe_redacted_label", raw_dataset_row_body: "safe_redacted_label" },
    actual_ingestion_attempt: { actual_ingestion_allowed: true, ingest_rows: true },
    parser_execution_attempt: { row_body_parser_enabled: true, row_body_parser_executed: true },
    redaction_execution_attempt: { redaction_scan_executed: true },
    audit_execution_attempt: { audit_execution_started: true },
    row_body_read_attempt: { row_body_read: true, raw_dataset_row_body: "safe_redacted_label" },
    real_evidence_claim_attempt: { real_evidence_present: true, fresh_resident_evidence_present: true },
    owner_confirmation_attempt: { owner_confirmation_created: true, owner_confirmation_confirmed: true },
    owner_approval_attempt: { owner_approval_created: true, owner_approval_confirmed: true },
    checked_row_count_attempt: { checked_row_count: 1, declared_row_count_checked: true },
    motion_execution_attempt: { motion_dataset_executable: true, execute_motion: true },
    runtime_readiness_attempt: { renderer_ready: true, runtime_readiness_claimed: true },
    production_readiness_attempt: { production_readiness_claimed: true },
    priority_resolution_attempt: { priority1_status: "RESOLVED", priority1_resolved: true, blocker_resolved: true },
    blocker_resolution_attempt: { blocker_resolved: true },
    go_attempt: { go_nogo_status: "go", go_candidate: true, approve_go: true },
    trusted_loader_attempt: { trusted_loader_allowlist_enabled: true, loader_trusted: true },
    unsafe_field_name_attempt_with_redacted_placeholder: {
      raw_dataset_row_body: "safe_redacted_label",
      raw_cue_payload: "safe_redacted_label",
      raw_renderer_payload: "safe_redacted_label",
      raw_model_path: "safe_redacted_label",
      raw_motion_path: "safe_redacted_label",
      actual_file_path_value: "safe_redacted_label",
      actual_file_content: "safe_redacted_label",
      endpoint_value: "safe_redacted_label",
      token_value: "safe_redacted_label",
      secret_value: "safe_redacted_label",
      private_local_path: "safe_redacted_label",
      raw_owner_confirmation_note: "safe_redacted_label",
      owner_private_note: "safe_redacted_label",
      world_command: "safe_redacted_label",
      obs_command: "safe_redacted_label",
      game_input: "safe_redacted_label",
      os_command: "safe_redacted_label",
    },
  }[caseName];
}

console.log("motion-dataset-owner-nogo-gates-extraction: pass");
