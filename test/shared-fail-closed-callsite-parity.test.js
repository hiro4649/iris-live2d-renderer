import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import {
  createPlanningParityFingerprint,
  selectPlanningSafetyProjection,
} from "./helpers/planningParityFingerprint.js";

const baseline = JSON.parse(readFileSync("test/fixtures/planning/shared-fail-closed-callsite-baseline-v1.json", "utf8"));

assert.equal(baseline.schema, "live2d_shared_fail_closed_callsite_baseline_v1");
assert.equal(baseline.baselineSourceHead, "3cc401001dcd1a8d3a7ac7545628b8cca0d7410c");
assert.equal(baseline.safety.syntheticInputsOnly, true);
assert.equal(baseline.safety.productSourceHashVerified, false);
assert.equal(baseline.safety.actualDataAccepted, false);
assert.equal(baseline.safety.ownerConfirmationCreated, false);
assert.equal(baseline.safety.runtimeReadinessClaimed, false);
assert.equal(baseline.safety.productionReadinessClaimed, false);
assert.equal(baseline.safety.priority1Status, "BLOCKED");
assert.equal(baseline.safety.checkedRowCount, 0);
assert.equal(baseline.safety.motionDatasetExecutable, false);

assert.equal(baseline.factoryInventory.length, baseline.factoryCount);

for (const factoryName of baseline.factoryInventory) {
  assert.equal(typeof legacyProvisioning[factoryName], "function", `helper-driven legacy factory missing ${factoryName}`);
}

for (const [factoryName, cases] of Object.entries(baseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const input = inputForSharedFailClosedCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = input === undefined
      ? legacyProvisioning[factoryName]()
      : legacyProvisioning[factoryName](input);
    const fingerprint = createPlanningParityFingerprint(value);

    assert.equal(expected.behavior, "return", `shared fail-closed baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(fingerprint.keyOrder, expected.keyOrder, `factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(fingerprint.jsonLength, expected.jsonLength, `factory json length changed: ${factoryName}:${caseName}`);
    assert.equal(fingerprint.jsonSha256, expected.jsonSha256, `factory test-only fingerprint changed: ${factoryName}:${caseName}`);
    assert.deepEqual(selectPlanningSafetyProjection(value), expected.selectedSafetyProjection, `factory safety projection changed: ${factoryName}:${caseName}`);
    assert.equal(expected.inputMutated, false, `baseline recorded mutation: ${factoryName}:${caseName}`);
    assert.deepEqual(input, before, `factory mutated input: ${factoryName}:${caseName}`);
  }
}

function inputForSharedFailClosedCase(caseName) {
  if (caseName === "defaultCase") return undefined;
  if (caseName === "unsafePromotionCase") {
    return {
      owner_confirmation_created: true,
      owner_confirmation_confirmed: true,
      actual_data_preauthorized: true,
      actual_data_task_started: true,
      actual_data_accepted: true,
      owner_submission_received: true,
      owner_submission_accepted: true,
      quarantine_completed: true,
      redaction_scan_executed: true,
      audit_execution_started: true,
      real_ingestion_audit_event_created: true,
      rollback_ready: true,
      external_action_performed: true,
      parser_dry_run_executed: true,
      row_body_parser_enabled: true,
      row_body_parser_executed: true,
      actual_file_read: true,
      actual_hash_calculated: true,
      actual_row_content_accepted: true,
      row_body_read: true,
      real_row_data_present: true,
      checked_row_count: 1,
      actual_ingestion_allowed: true,
      motion_dataset_executable: true,
      renderer_ready: true,
      model_loaded: true,
      scene_loaded: true,
      browser_cue_delivery_ready: true,
      runtime_readiness_claimed: true,
      production_readiness_claimed: true,
      priority1_status: "RESOLVED",
      go_nogo_status: "go",
      go_candidate: true,
      blocker_resolved: true,
    };
  }
  if (caseName === "nestedUnsafePromotionCase") {
    return {
      safe_nested_label: {
        owner_confirmation_created: true,
        actual_data_task_started: true,
        checked_row_count: 1,
      },
    };
  }
  throw new Error(`unknown shared fail-closed baseline case ${caseName}`);
}

console.log("shared-fail-closed-callsite-parity: pass");
