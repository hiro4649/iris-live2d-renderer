import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import * as ownerConfirmationWaitGates from "../src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js";
import * as motionDatasetPlanning from "../src/renderer/planning/motionDatasetPlanningSummaries.js";
import {
  createPlanningParityFingerprint,
  selectPlanningSafetyProjection,
} from "./helpers/planningParityFingerprint.js";

const baseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-owner-confirmation-wait-gates-baseline-v1.json", "utf8"));
const source = readFileSync("src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js", "utf8");

const MOVED_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_ENVELOPE_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_SCOPES",
  "LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_EVIDENCE_REFS",
  "LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_OWNER_ITEMS",
  "LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_SYSTEM_ITEMS",
  "LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_COMPLETED_ARTIFACTS",
  "LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_UNRESOLVED_BLOCKERS",
  "createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary",
  "createMotionDatasetOwnerWaitStatePacketSummary",
  "createMotionDatasetPlanningCompletionReviewPacketSummary",
]);

const FACADE_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA",
  "createMotionDatasetOwnerWaitStatePacketSummary",
  "createMotionDatasetPlanningCompletionReviewPacketSummary",
]);

assert.equal(baseline.schema, "live2d_motion_dataset_owner_confirmation_wait_gates_baseline_v1");
assert.equal(baseline.baselineSourceHead, "84080ae1025ff2c8395dbd049385589da1fb562b");
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
  assert.equal(Object.hasOwn(ownerConfirmationWaitGates, name), true, `new owner-confirmation wait module export missing ${name}`);
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy compatibility export missing ${name}`);
  assert.equal(ownerConfirmationWaitGates[name], legacyProvisioning[name], `legacy binding identity mismatch ${name}`);
  assert.equal(Object.hasOwn(motionDatasetPlanning, name), FACADE_EXPORTS.includes(name), `planning facade export mismatch ${name}`);
}

for (const [name, expected] of Object.entries(baseline.constants)) {
  assert.deepEqual(ownerConfirmationWaitGates[name], expected.value, `constant value changed: ${name}`);
  const fingerprint = createPlanningParityFingerprint(ownerConfirmationWaitGates[name]);
  assert.deepEqual(fingerprint.keyOrder, expected.keyOrder, `constant key order changed: ${name}`);
  assert.equal(fingerprint.jsonLength, expected.jsonLength, `constant json length changed: ${name}`);
  assert.equal(fingerprint.jsonSha256, expected.jsonSha256, `constant test-only fingerprint changed: ${name}`);
  if (ownerConfirmationWaitGates[name] && typeof ownerConfirmationWaitGates[name] === "object") {
    assert.equal(Object.isFrozen(ownerConfirmationWaitGates[name]), expected.objectIsFrozen, `constant freeze changed: ${name}`);
  }
}

for (const [factoryName, cases] of Object.entries(baseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const input = caseName === "default_input" ? undefined : inputForOwnerConfirmationWaitBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = caseName === "default_input"
      ? ownerConfirmationWaitGates[factoryName]()
      : ownerConfirmationWaitGates[factoryName](input);
    const legacyValue = caseName === "default_input"
      ? legacyProvisioning[factoryName]()
      : legacyProvisioning[factoryName](structuredClone(input));
    const fingerprint = createPlanningParityFingerprint(value);

    assert.equal(expected.behavior, "return", `owner-confirmation wait baseline expected return: ${factoryName}:${caseName}`);
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
  assert.equal(forbiddenPattern.test(source), false, `forbidden owner-confirmation wait source pattern: ${forbiddenPattern}`);
}

assert.equal(source.includes('from "./sharedFailClosedSummaryFactory.js"'), true, "expected shared fail-closed import missing");

function inputForOwnerConfirmationWaitBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_labels: {
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
    owner_confirmation_created_attempt: { owner_confirmation_created: true },
    owner_confirmation_confirmed_attempt: { owner_confirmation_confirmed: true },
    actual_data_preauth_attempt: { actual_data_preauthorized: true },
    actual_data_task_attempt: { actual_data_task_started: true },
    actual_data_accepted_attempt: { actual_data_accepted: true },
    owner_submission_attempt: { owner_submission_received: true, owner_submission_accepted: true },
    quarantine_attempt: { quarantine_completed: true },
    parser_attempt: { parser_dry_run_executed: true, parser_execution: true, row_body_parser_executed: true },
    redaction_attempt: { redaction_scan_executed: true },
    audit_attempt: { audit_execution_started: true, real_ingestion_audit_event_created: true },
    file_read_attempt: { actual_file_read: true, actual_file_content_accepted: true },
    hash_attempt: { actual_hash_calculated: true, source_hash_verified: true },
    row_read_attempt: { row_body_read: true, real_row_data_present: true },
    checked_count_attempt: { checked_row_count: 1 },
    ingestion_attempt: { actual_ingestion_allowed: true },
    motion_execution_attempt: { motion_dataset_executable: true, motion_execution_enabled: true },
    runtime_readiness_attempt: { runtime_readiness_claimed: true, renderer_ready: true },
    production_readiness_attempt: { production_readiness_claimed: true },
    priority_resolution_attempt: { priority1_status: "RESOLVED" },
    go_attempt: { go_nogo_status: "go", go_candidate: true },
    blocker_resolution_attempt: { blocker_resolved: true },
  }[caseName];
}

console.log("motion-dataset-owner-confirmation-wait-gates-extraction: pass");
