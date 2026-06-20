import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import * as legacy from "../src/renderer/cubismLoaderProvisioning.js";
import * as extracted from "../src/renderer/planning/motionDatasetFinalOwnerWaitGates.js";
import * as facade from "../src/renderer/planning/motionDatasetPlanningSummaries.js";

const baseline = JSON.parse(
  readFileSync("test/fixtures/planning/motion-dataset-final-owner-wait-gates-baseline-v1.json", "utf8"),
);

const MOVED_NAMES = [
  "LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_GATE_SCHEMA",
  "LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS",
  "LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_FUTURE_ACTIONS",
  "createMotionDatasetFinalOwnerWaitForDataGateSummary",
];

for (const name of MOVED_NAMES) {
  assert.equal(Object.hasOwn(extracted, name), true, `new module export missing: ${name}`);
  assert.equal(Object.hasOwn(legacy, name), true, `legacy export missing: ${name}`);
  assert.equal(legacy[name], extracted[name], `legacy/new binding identity changed: ${name}`);
  assert.equal(Object.hasOwn(facade, name), false, `planning facade unexpectedly exports: ${name}`);
}

assert.equal(baseline.schema, "live2d_motion_dataset_final_owner_wait_gates_baseline_v1");
assert.equal(baseline.baselineSourceHead, "d31d307d6b0f20c51b1b8cc43ca611afdb803e20");
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
    const input = caseName === "default_input" ? undefined : inputForFinalOwnerWaitBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = input === undefined ? extracted[factoryName]() : extracted[factoryName](input);
    assert.equal(expected.behavior, "return", `baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keyOrder, `factory key order changed: ${factoryName}:${caseName}`);
    assert.deepEqual(fieldPresence(value), expected.fieldPresence, `factory field presence changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value).length, expected.jsonLength, `factory json length changed: ${factoryName}:${caseName}`);
    assert.equal(sha256Json(value), expected.jsonSha256, `factory json fingerprint changed: ${factoryName}:${caseName}`);
    assert.deepEqual(
      selectedSafetyProjection(value),
      expected.selectedSafetyProjection,
      `factory safety projection changed: ${factoryName}:${caseName}`,
    );
    assert.equal(expected.inputMutated, false, `baseline recorded input mutation: ${factoryName}:${caseName}`);
    assert.deepEqual(input, before, `factory mutated input: ${factoryName}:${caseName}`);
  }
}

const source = readFileSync("src/renderer/planning/motionDatasetFinalOwnerWaitGates.js", "utf8");
assert.equal(source.includes("cubismLoaderProvisioning.js"), false);
assert.equal(source.includes("sharedFailClosedSummaryFactory.js"), false);
assert.equal(source.includes("node:fs"), false);
assert.equal(source.includes("node:path"), false);
assert.equal(source.includes("node:crypto"), false);
assert.equal(source.includes("child_process"), false);
assert.equal(/export\s+default\b/.test(source), false);
assert.equal(/export\s+\*\s+from\b/.test(source), false);

console.log("motion-dataset-final-owner-wait-gates-extraction: pass");

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

function selectedSafetyProjection(value) {
  return {
    final_owner_wait_gate_confirms_owner: value.final_owner_wait_gate_confirms_owner,
    owner_confirmation_confirmed: value.owner_confirmation_confirmed,
    owner_submission_received: value.owner_submission_received,
    owner_submission_accepted: value.owner_submission_accepted,
    actual_data_task_started: value.actual_data_task_started,
    actual_data_preauthorized: value.actual_data_preauthorized,
    actual_data_accepted: value.actual_data_accepted,
    actual_ingestion_allowed: value.actual_ingestion_allowed,
    real_row_data_present: value.real_row_data_present,
    row_body_read: value.row_body_read,
    checked_row_count: value.checked_row_count,
    motion_dataset_executable: value.motion_dataset_executable,
    runtime_readiness_claimed: value.runtime_readiness_claimed,
    production_readiness_claimed: value.production_readiness_claimed,
    trusted_loader_allowlist_enabled: value.trusted_loader_allowlist_enabled,
    priority1_status: value.priority1_status,
    go_nogo_status: value.go_nogo_status,
  };
}

function inputForFinalOwnerWaitBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    full_required_wait_reasons: {
      required_wait_reasons: extracted.LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS,
    },
    empty_required_wait_reasons: { required_wait_reasons: [] },
    partial_required_wait_reasons: { required_wait_reasons: ["real_row_file_missing", "owner_confirmation_missing"] },
    single_missing_wait_reason: {
      required_wait_reasons: extracted.LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS.filter(
        (reason) => reason !== "checked_row_count_zero",
      ),
    },
    duplicate_required_wait_reasons: {
      required_wait_reasons: ["real_row_file_missing", "real_row_file_missing"],
    },
    unsupported_wait_reason_label: { required_wait_reasons: ["unsupported_safe_label"] },
    non_array_required_wait_reasons: { required_wait_reasons: "real_row_file_missing" },
    safe_nested_metadata: {
      nested: { safe_label: "kept", list: ["safe_a", "safe_b"] },
    },
    final_owner_wait_gate_confirms_owner_attempt: { final_owner_wait_gate_confirms_owner: true },
    owner_confirmation_confirmed_attempt: { owner_confirmation_confirmed: true },
    owner_submission_received_attempt: { owner_submission_received: true },
    owner_submission_accepted_attempt: { owner_submission_accepted: true },
    actual_data_task_started_attempt: { actual_data_task_started: true },
    actual_data_preauthorized_attempt: { actual_data_preauthorized: true },
    actual_data_accepted_attempt: { actual_data_accepted: true },
    actual_ingestion_attempt: { actual_ingestion_allowed: true },
    real_row_attempt: { real_row_data_present: true },
    row_body_read_attempt: { row_body_read: true },
    checked_row_count_attempt: { checked_row_count: 1 },
    motion_execution_attempt: { motion_dataset_executable: true },
    runtime_readiness_attempt: { runtime_readiness_claimed: true },
    production_readiness_attempt: { production_readiness_claimed: true },
    priority_resolution_attempt: { priority1_status: "RESOLVED" },
    go_attempt: { go_nogo_status: "go" },
    combined_state_promotion_attempt: {
      final_owner_wait_gate_confirms_owner: true,
      owner_confirmation_confirmed: true,
      owner_submission_received: true,
      owner_submission_accepted: true,
      actual_data_task_started: true,
      actual_data_preauthorized: true,
      actual_data_accepted: true,
      actual_ingestion_allowed: true,
      real_row_data_present: true,
      row_body_read: true,
      checked_row_count: 1,
      motion_dataset_executable: true,
      runtime_readiness_claimed: true,
      production_readiness_claimed: true,
      priority1_status: "RESOLVED",
      go_nogo_status: "go",
    },
  }[caseName];
}
