import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as legacy from "../src/renderer/cubismLoaderProvisioning.js";
import * as extracted from "../src/renderer/planning/motionDatasetOwnerFinalPackets.js";
import * as facade from "../src/renderer/planning/motionDatasetPlanningSummaries.js";

const baseline = JSON.parse(
  readFileSync("test/fixtures/planning/motion-dataset-owner-final-packets-baseline-v1.json", "utf8"),
);

const MOVED_NAMES = [
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LEDGER_SCHEMA",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LABELS",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_UNFREEZE_CONDITIONS",
  "createMotionDatasetActualDataFreezeStateLedgerSummary",
  "LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_REQUIRED_SECTIONS",
  "LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_BLOCKERS",
  "createMotionDatasetFinalOwnerActualDataPacketSummary",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_NO_ACTION_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_SAFE_STEPS",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_BLOCKERS",
  "createMotionDatasetActualDataTaskRunbookNoActionPacketSummary",
];

for (const name of MOVED_NAMES) {
  assert.equal(Object.hasOwn(extracted, name), true, `new module export missing: ${name}`);
  assert.equal(Object.hasOwn(legacy, name), true, `legacy export missing: ${name}`);
  assert.equal(legacy[name], extracted[name], `legacy/new binding identity changed: ${name}`);
  assert.equal(Object.hasOwn(facade, name), false, `planning facade unexpectedly exports: ${name}`);
}

assert.equal(baseline.schema, "live2d_motion_dataset_owner_final_packets_baseline_v1");
assert.equal(baseline.baselineSourceHead, "6d7eef0bbce039bf332f6f55b78f7d1dd8aa1795");
assert.equal(baseline.safety.syntheticInputsOnly, true);
assert.equal(baseline.safety.actualDataRead, false);
assert.equal(baseline.safety.actualFileRead, false);
assert.equal(baseline.safety.actualFilePathAccepted, false);
assert.equal(baseline.safety.actualFileContentAccepted, false);
assert.equal(baseline.safety.actualHashCalculated, false);
assert.equal(baseline.safety.sourceHashVerified, false);
assert.equal(baseline.safety.declaredRowCountChecked, false);
assert.equal(baseline.safety.parserExecution, false);
assert.equal(baseline.safety.redactionScanExecution, false);
assert.equal(baseline.safety.auditExecution, false);
assert.equal(baseline.safety.ownerConfirmationCreated, false);
assert.equal(baseline.safety.ownerConfirmationConfirmed, false);
assert.equal(baseline.safety.actualDataTaskStarted, false);
assert.equal(baseline.safety.actualDataPreauthorized, false);
assert.equal(baseline.safety.actualDataAccepted, false);
assert.equal(baseline.safety.actualIngestionAllowed, false);
assert.equal(baseline.safety.runtimeReadinessClaimed, false);
assert.equal(baseline.safety.productionReadinessClaimed, false);
assert.equal(baseline.safety.trustedLoaderEnabled, false);
assert.equal(baseline.safety.priority1Status, "BLOCKED");
assert.equal(baseline.safety.checkedRowCount, 0);
assert.equal(baseline.safety.motionDatasetExecutable, false);
assert.equal(baseline.safety.testOnlyFingerprint, true);

for (const [name, expected] of Object.entries(baseline.constants)) {
  const value = extracted[name];
  assert.deepEqual(value, expected.value, `constant value changed: ${name}`);
  assert.deepEqual(keyOrderFor(value), expected.keyOrder, `constant key order changed: ${name}`);
  assert.equal(JSON.stringify(value).length, expected.jsonLength, `constant json length changed: ${name}`);
  assert.equal(sha256Json(value), expected.jsonSha256, `constant json fingerprint changed: ${name}`);
  assert.equal(frozenStatusFor(value), expected.objectIsFrozen, `constant freeze status changed: ${name}`);
}

for (const [factoryName, cases] of Object.entries(baseline.factories)) {
  assert.equal(legacy[factoryName], extracted[factoryName], `legacy/new factory binding identity changed: ${factoryName}`);
  for (const [caseName, expected] of Object.entries(cases)) {
    const input = caseName === "default_input" ? undefined : inputForOwnerFinalPacketsBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = input === undefined ? extracted[factoryName]() : extracted[factoryName](input);
    assert.equal(expected.behavior, "return", `baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keyOrder, `factory key order changed: ${factoryName}:${caseName}`);
    assert.deepEqual(fieldPresence(value), expected.fieldPresence, `factory field presence changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value).length, expected.jsonLength, `factory json length changed: ${factoryName}:${caseName}`);
    assert.equal(sha256Json(value), expected.jsonSha256, `factory json fingerprint changed: ${factoryName}:${caseName}`);
    assert.deepEqual(
      selectedSafetyProjection(value, expected.selectedSafetyProjection),
      expected.selectedSafetyProjection,
      `factory safety projection changed: ${factoryName}:${caseName}`,
    );
    assert.equal(expected.inputMutated, false, `baseline recorded input mutation: ${factoryName}:${caseName}`);
    assert.deepEqual(input, before, `factory mutated input: ${factoryName}:${caseName}`);
  }
}

const source = readFileSync("src/renderer/planning/motionDatasetOwnerFinalPackets.js", "utf8");
assert.equal(source.includes("cubismLoaderProvisioning.js"), false);
assert.equal(source.includes("../contracts.js"), false);
assert.equal(source.includes("sharedFailClosedSummaryFactory.js"), true);
assert.equal(source.includes("node:fs"), false);
assert.equal(source.includes("node:path"), false);
assert.equal(source.includes("node:crypto"), false);
assert.equal(source.includes("child_process"), false);
assert.equal(source.includes("fetch("), false);
assert.equal(source.includes("EventSource"), false);
assert.equal(/export\s+default\b/.test(source), false);
assert.equal(/export\s+\*\s+from\b/.test(source), false);

console.log("motion-dataset-owner-final-packets-extraction: pass");

function sha256Json(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function fieldPresence(value) {
  return Object.fromEntries(Object.keys(value).map((key) => [key, Object.hasOwn(value, key)]));
}

function keyOrderFor(value) {
  return value && typeof value === "object" ? Object.keys(value) : [];
}

function frozenStatusFor(value) {
  return value && typeof value === "object" ? Object.isFrozen(value) : false;
}

function selectedSafetyProjection(value, expectedProjection) {
  return Object.fromEntries(Object.keys(expectedProjection).map((key) => [key, value[key]]));
}

function inputForOwnerFinalPacketsBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_nested_metadata: {
      nested: { safe_label: "kept", list: ["safe_a", "safe_b"] },
    },
    owner_confirmation_created_attempt: { owner_confirmation_created: true },
    owner_confirmation_confirmed_attempt: { owner_confirmation_confirmed: true },
    actual_data_preauthorized_attempt: { actual_data_preauthorized: true },
    actual_data_task_started_attempt: { actual_data_task_started: true },
    actual_data_accepted_attempt: { actual_data_accepted: true },
    owner_submission_received_attempt: { owner_submission_received: true },
    owner_submission_accepted_attempt: { owner_submission_accepted: true },
    external_action_attempt: { external_action_performed: true },
    quarantine_completed_attempt: { quarantine_completed: true },
    parser_execution_attempt: { parser_dry_run_executed: true },
    redaction_execution_attempt: { redaction_scan_executed: true },
    audit_execution_attempt: { audit_execution_started: true },
    actual_file_read_attempt: { actual_file_read: true },
    actual_hash_calculation_attempt: { actual_hash_calculated: true },
    row_body_read_attempt: { row_body_read: true },
    real_row_attempt: { real_row_data_present: true },
    checked_row_count_attempt: { checked_row_count: 1 },
    actual_ingestion_attempt: { actual_ingestion_allowed: true },
    motion_execution_attempt: { motion_dataset_executable: true },
    runtime_readiness_attempt: { runtime_readiness_claimed: true },
    production_readiness_attempt: { production_readiness_claimed: true },
    priority_resolution_attempt: { priority1_status: "RESOLVED" },
    go_attempt: { go_nogo_status: "go" },
    blocker_resolution_attempt: { blocker_resolved: true },
    combined_state_promotion_attempt: {
      owner_confirmation_created: true,
      owner_confirmation_confirmed: true,
      actual_data_preauthorized: true,
      actual_data_task_started: true,
      actual_data_accepted: true,
      owner_submission_received: true,
      owner_submission_accepted: true,
      external_action_performed: true,
      quarantine_completed: true,
      parser_dry_run_executed: true,
      redaction_scan_executed: true,
      audit_execution_started: true,
      actual_file_read: true,
      actual_hash_calculated: true,
      row_body_read: true,
      real_row_data_present: true,
      checked_row_count: 1,
      actual_ingestion_allowed: true,
      motion_dataset_executable: true,
      runtime_readiness_claimed: true,
      production_readiness_claimed: true,
      priority1_status: "RESOLVED",
      go_nogo_status: "go",
      blocker_resolved: true,
    },
  }[caseName];
}
