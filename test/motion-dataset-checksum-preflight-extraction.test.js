import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import * as checksumPreflight from "../src/renderer/planning/motionDatasetChecksumPreflight.js";
import * as motionDatasetPlanning from "../src/renderer/planning/motionDatasetPlanningSummaries.js";
import {
  createPlanningParityFingerprint,
  selectChecksumPreflightSafetyProjection,
} from "./helpers/planningParityFingerprint.js";

const baseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-checksum-preflight-baseline-v1.json", "utf8"));
const source = readFileSync("src/renderer/planning/motionDatasetChecksumPreflight.js", "utf8");

const MOVED_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_MANIFEST_SCHEMA",
  "LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_HASH_METADATA_LABELS",
  "LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS",
  "LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_FILE_IDENTITY_LABELS",
  "LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_OWNER_CONFIRMATION_REFS",
  "createMotionDatasetRowFileChecksumPreflightManifestSummary",
]);

assert.equal(baseline.schema, "live2d_motion_dataset_checksum_preflight_baseline_v1");
assert.equal(baseline.baselineSourceHead, "1183aa2490a9002f00c34e98976c881439ff3f5a");
assert.equal(baseline.safety.syntheticInputsOnly, true);
assert.equal(baseline.safety.actualFileRead, false);
assert.equal(baseline.safety.actualHashCalculated, false);
assert.equal(baseline.safety.actualFileReferenceAccepted, false);
assert.equal(baseline.safety.actualFileContentAccepted, false);
assert.equal(baseline.safety.sourceHashVerified, false);
assert.equal(baseline.safety.actualIngestionAllowed, false);
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
  assert.equal(Object.hasOwn(checksumPreflight, name), true, `new checksum module export missing ${name}`);
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy compatibility export missing ${name}`);
  assert.equal(checksumPreflight[name], legacyProvisioning[name], `legacy binding identity mismatch ${name}`);
  assert.equal(Object.hasOwn(motionDatasetPlanning, name), false, `checksum symbol leaked into planning facade ${name}`);
}

for (const [name, expected] of Object.entries(baseline.constants)) {
  assert.deepEqual(checksumPreflight[name], expected.value, `constant value changed: ${name}`);
  const fingerprint = createPlanningParityFingerprint(checksumPreflight[name]);
  assert.deepEqual(fingerprint.keyOrder, expected.keyOrder, `constant key order changed: ${name}`);
  assert.equal(fingerprint.jsonLength, expected.jsonLength, `constant json length changed: ${name}`);
  assert.equal(fingerprint.jsonSha256, expected.jsonSha256, `constant test-only fingerprint changed: ${name}`);
  if (checksumPreflight[name] && typeof checksumPreflight[name] === "object") {
    assert.equal(Object.isFrozen(checksumPreflight[name]), expected.objectIsFrozen, `constant freeze changed: ${name}`);
  }
}

for (const [factoryName, cases] of Object.entries(baseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const input = caseName === "default_input" ? undefined : inputForChecksumBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = caseName === "default_input"
      ? checksumPreflight[factoryName]()
      : checksumPreflight[factoryName](input);
    const legacyValue = caseName === "default_input"
      ? legacyProvisioning[factoryName]()
      : legacyProvisioning[factoryName](structuredClone(input));
    const fingerprint = createPlanningParityFingerprint(value);

    assert.equal(expected.behavior, "return", `checksum baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(value, legacyValue, `legacy factory parity changed: ${factoryName}:${caseName}`);
    assert.deepEqual(fingerprint.keyOrder, expected.keyOrder, `factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(fingerprint.jsonLength, expected.jsonLength, `factory json length changed: ${factoryName}:${caseName}`);
    assert.equal(fingerprint.jsonSha256, expected.jsonSha256, `factory test-only fingerprint changed: ${factoryName}:${caseName}`);
    assert.deepEqual(selectChecksumPreflightSafetyProjection(value), expected.selectedSafetyProjection, `factory safety projection changed: ${factoryName}:${caseName}`);
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
  assert.equal(forbiddenPattern.test(source), false, `forbidden checksum preflight source pattern: ${forbiddenPattern}`);
}

for (const allowedImport of [
  "../../contracts.js",
  "./sharedFailClosedSummaryFactory.js",
  "./motionDatasetPlanningSafety.js",
  "./motionDatasetOwnerGates.js",
]) {
  assert.equal(source.includes(`from "${allowedImport}"`), true, `expected checksum import missing ${allowedImport}`);
}

function inputForChecksumBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_metadata_labels_only: {
      source_hash_label: "safe_source_hash_label",
      hash_algorithm_label: "sha256_label",
      hash_scope_label: "safe_scope_label",
      declared_row_count_label: "safe_count_label",
      schema_version_label: "safe_schema_label",
      file_format_label: "jsonl",
      dataset_name_label: "safe_dataset_label",
      dataset_version_label: "safe_version_label",
      audit_run_id: "safe_audit_label",
      auditor_version: "safe_auditor_label",
      owner_confirmation_scope_label: "safe_owner_scope_label",
      safe_next_action: "safe_next_action_label",
      nested: { label: "safe_nested_label" },
      labels: ["safe_label_a"],
    },
    actual_file_read_attempt: { actual_file_read: true, file_content_read: true, file_path_read: true },
    actual_hash_calculated_attempt: { actual_hash_calculated: true, hash_calculated: true, source_hash_calculated: true },
    actual_file_reference_attempt: {
      actual_file_reference_accepted: true,
      actual_file_path_value: "safe_redacted_label",
      dataset_file_path: "safe_redacted_label",
      actual_file_path: "safe_redacted_label",
    },
    actual_file_content_attempt: {
      actual_file_content_accepted: true,
      actual_file_content: "safe_redacted_label",
      raw_file_body: "safe_redacted_label",
      file_body: "safe_redacted_label",
    },
    real_hash_value_attempt: {
      source_hash: "safe_hash_label",
      actual_source_hash: "safe_hash_label",
      hash_value: "safe_hash_label",
      raw_hash_input: "safe_redacted_label",
    },
    actual_ingestion_attempt: { actual_ingestion_allowed: true, ingestion_approved: true, ingest_rows: true },
    real_row_attempt: { real_row_data_present: true, row_data_present: true, row: { safe: "label" }, dataset_row: { safe: "label" } },
    checked_row_count_attempt: { checked_row_count: 1 },
    row_body_read_attempt: { row_body_read: true, raw_dataset_row_body: "safe_redacted_label" },
    motion_execution_attempt: { motion_dataset_executable: true, motion_execution_enabled: true, execute_motion: true },
    runtime_readiness_attempt: { renderer_ready: true, model_loaded: true, scene_loaded: true, browser_cue_delivery_ready: true, runtime_readiness_claimed: true },
    production_readiness_attempt: { production_readiness_claimed: true },
    owner_confirmation_attempt: { owner_confirmation_created: true, owner_confirmation_confirmed: true, owner_confirmation_status: "confirmed" },
    priority_resolution_attempt: { priority1_status: "RESOLVED", priority1_resolved: true, blocker_resolved: true },
    go_attempt: { go_nogo_status: "go", go_candidate: true, approve_go: true },
    trusted_loader_attempt: { trusted_loader_allowlist_enabled: true, trustedLoaderAllowlistEnabled: true, loader_trusted: true },
  }[caseName];
}

console.log("motion-dataset-checksum-preflight-extraction: pass");
