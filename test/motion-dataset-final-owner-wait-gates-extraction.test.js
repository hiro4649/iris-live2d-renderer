import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as legacy from "../src/renderer/cubismLoaderProvisioning.js";
import * as extracted from "../src/renderer/planning/motionDatasetFinalOwnerWaitGates.js";
import * as facade from "../src/renderer/planning/motionDatasetPlanningSummaries.js";

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

assert.equal(extracted.LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_GATE_SCHEMA, "iris_live2d_motion_dataset_final_owner_wait_for_data_gate_v1");
assert.equal(Object.isFrozen(extracted.LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS), true);
assert.equal(Object.isFrozen(extracted.LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_FUTURE_ACTIONS), true);

const defaultSummary = extracted.createMotionDatasetFinalOwnerWaitForDataGateSummary();
assert.equal(defaultSummary.motion_dataset_final_owner_wait_for_data_gate_status, "waiting_for_owner_data");
assert.equal(defaultSummary.final_owner_wait_gate_confirms_owner, false);
assert.equal(defaultSummary.owner_confirmation_confirmed, false);
assert.equal(defaultSummary.owner_submission_received, false);
assert.equal(defaultSummary.owner_submission_accepted, false);
assert.equal(defaultSummary.actual_data_task_started, false);
assert.equal(defaultSummary.actual_data_preauthorized, false);
assert.equal(defaultSummary.actual_data_accepted, false);
assert.equal(defaultSummary.actual_ingestion_allowed, false);
assert.equal(defaultSummary.real_row_data_present, false);
assert.equal(defaultSummary.row_body_read, false);
assert.equal(defaultSummary.checked_row_count, 0);
assert.equal(defaultSummary.motion_dataset_executable, false);
assert.equal(defaultSummary.runtime_readiness_claimed, false);
assert.equal(defaultSummary.production_readiness_claimed, false);
assert.equal(defaultSummary.trusted_loader_allowlist_enabled, false);
assert.equal(defaultSummary.priority1_status, "BLOCKED");
assert.equal(defaultSummary.go_nogo_status, "no_go");
assert.equal(defaultSummary.safe_summary_only, true);

const partialSummary = extracted.createMotionDatasetFinalOwnerWaitForDataGateSummary({
  required_wait_reasons: ["real_row_file_missing"],
});
assert.equal(partialSummary.motion_dataset_final_owner_wait_for_data_gate_status, "blocked");
assert.deepEqual(partialSummary.provided_wait_reasons, ["real_row_file_missing"]);
assert.equal(partialSummary.missing_wait_reasons.includes("owner_confirmation_missing"), true);

const unsafeSummary = extracted.createMotionDatasetFinalOwnerWaitForDataGateSummary({
  final_owner_wait_gate_confirms_owner: true,
  owner_confirmation_confirmed: true,
  owner_submission_received: true,
  owner_submission_accepted: true,
  actual_data_task_started: true,
  actual_data_preauthorized: true,
  actual_ingestion_allowed: true,
  real_row_data_present: true,
  row_body_read: true,
  checked_row_count: 1,
  motion_dataset_executable: true,
  runtime_readiness_claimed: true,
  production_readiness_claimed: true,
  priority1_status: "RESOLVED",
  go_nogo_status: "go",
});
assert.equal(unsafeSummary.motion_dataset_final_owner_wait_for_data_gate_status, "blocked");
assert.equal(unsafeSummary.final_owner_wait_gate_confirms_owner, false);
assert.equal(unsafeSummary.owner_confirmation_confirmed, false);
assert.equal(unsafeSummary.actual_data_task_started, false);
assert.equal(unsafeSummary.actual_ingestion_allowed, false);
assert.equal(unsafeSummary.checked_row_count, 0);
assert.equal(unsafeSummary.priority1_status, "BLOCKED");
assert.equal(unsafeSummary.go_nogo_status, "no_go");
assert.equal(
  unsafeSummary.wait_for_data_reasons.includes("final_owner_wait_gate_rejected_owner_or_actual_data_attempt"),
  true,
);

const input = {
  required_wait_reasons: ["real_row_file_missing", "owner_confirmation_missing"],
  nested: { safe_label: "kept" },
};
const before = structuredClone(input);
extracted.createMotionDatasetFinalOwnerWaitForDataGateSummary(input);
assert.deepEqual(input, before);

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
