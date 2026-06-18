import assert from "node:assert/strict";
import {
  MANIFEST_SPLIT_ALLOWLIST,
  REQUIRED_MANIFEST_LABELS,
  validateMotionDatasetManifest,
} from "../src/renderer/motionDatasetManifestValidator.js";

function row(overrides = {}) {
  return {
    row_id: "row-1",
    split: "review_only",
    source_file_label: "source_label_only",
    scenario_id: "scenario_label",
    motion_label: "talk",
    schema_version_label: "schema_v1",
    dataset_version_label: "dataset_v1",
    source_hash_label: "hash_label_only",
    owner_scope_label: "owner_scope_label",
    audit_run_id_label: "audit_run_label",
    auditor_version_label: "auditor_version_label",
    ...overrides,
  };
}

const accepted = validateMotionDatasetManifest([row()]);
assert.equal(accepted.status, "accepted_metadata_only");
assert.deepEqual(accepted.rejectionLabels, []);
assert.equal(accepted.syntheticValidatedEntryCount, 1);
assert.equal(accepted.checkedRowCount, 0);
assert.equal(accepted.rowBodyRead, false);
assert.equal(accepted.actualFileRead, false);
assert.equal(accepted.sourceHashVerified, false);
assert.equal(accepted.declaredRowCountChecked, false);
assert.equal(accepted.actualIngestionAllowed, false);
assert.equal(accepted.motionDatasetExecutable, false);
assert.equal(accepted.safeSummaryOnly, true);

for (const split of MANIFEST_SPLIT_ALLOWLIST) {
  assert.equal(validateMotionDatasetManifest([row({ split })]).status, "accepted_metadata_only", split);
}

for (const requiredLabel of REQUIRED_MANIFEST_LABELS) {
  const fixture = row();
  delete fixture[requiredLabel];
  const result = validateMotionDatasetManifest([fixture]);
  assert.equal(result.status, "rejected", requiredLabel);
  assert.equal(result.rejectionLabels.includes(`${requiredLabel}_missing`), true, requiredLabel);
}

for (const [overrides, expected] of [
  [{ split: "production" }, "split_unsupported"],
  [{ motion_label: "not_supported" }, "unsupported_motion_label"],
  [{ motion_label: "blink_attention" }, "experimental_motion_marked_executable"],
  [{ motion_label: "happy_dance" }, "strong_motion_without_recovery"],
  [{ motion_label: "happy_dance", recovery_plan_label: "recover_to_idle", cue_freshness_label: "stale" }, "stale_cue_strong_motion"],
  [{ visibility_guard_label: "subtitle_occlusion_risk" }, "subtitle_occlusion_risk"],
  [{ comfort_guard_label: "gaze_pressure_risk" }, "gaze_pressure_risk"],
  [{ expected_safe_summary_hash_label: "leak" }, "expected_summary_leak"],
  [{ row_id: "https://example.invalid" }, "row_id_missing"],
  [{ source_file_label: "private\\path" }, "source_file_label_missing"],
  [{ schema_version_label: "schema v1" }, "schema_version_label_missing"],
  [{ recovery_plan_label: "recover;rm" }, "recovery_plan_label_invalid"],
  [{ raw_row_body: "redacted" }, "raw_row_body_present"],
  [{ actual_file_content: "redacted" }, "actual_file_content_present"],
  [{ actual_file_path: "redacted" }, "actual_file_path_present"],
  [{ raw_renderer_payload: "redacted" }, "raw_renderer_payload_present"],
  [{ endpoint: "redacted" }, "endpoint_present"],
  [{ token: "redacted" }, "token_present"],
  [{ secret: "redacted" }, "secret_present"],
  [{ private_path: "redacted" }, "private_path_present"],
  [{ unknown_label: "x" }, "unknown_label:unknown_label"],
]) {
  const result = validateMotionDatasetManifest([row(overrides)]);
  assert.equal(result.status, "rejected", expected);
  assert.equal(result.rejectionLabels.includes(expected), true, expected);
}

assert.equal(validateMotionDatasetManifest("not-array").rejectionLabels.includes("manifest_not_array"), true);
assert.equal(validateMotionDatasetManifest([null]).rejectionLabels.includes("entry_not_plain_object:0"), true);
assert.equal(
  validateMotionDatasetManifest([Object.defineProperty(row(), "__proto__", { value: "x", enumerable: true })])
    .rejectionLabels.includes("unsafe_key:__proto__"),
  true,
);

const duplicateRows = validateMotionDatasetManifest([
  row({ row_id: "shared", split: "review_only" }),
  row({ row_id: "shared", split: "review_only" }),
]);
assert.equal(duplicateRows.rejectionLabels.includes("duplicate_row_id"), true);

for (const [first, second, expected] of [
  ["train", "eval", "train_eval_overlap"],
  ["train", "test", "train_test_overlap"],
  ["eval", "test", "eval_test_overlap"],
]) {
  const result = validateMotionDatasetManifest([
    row({ row_id: "overlap", split: first }),
    row({ row_id: "overlap", split: second }),
  ]);
  assert.equal(result.rejectionLabels.includes(expected), true, expected);
}

const fixtureDuplication = validateMotionDatasetManifest([
  row({ split: "fixture_only", duplicate_group_id_label: "fixture-group" }),
]);
assert.equal(fixtureDuplication.rejectionLabels.includes("fixture_duplication"), true);

const input = [row({ motion_label: "happy_dance", recovery_plan_label: "recover_to_idle" })];
const snapshot = JSON.stringify(input);
assert.deepEqual(validateMotionDatasetManifest(input), validateMotionDatasetManifest(input));
assert.equal(JSON.stringify(input), snapshot);

console.log("motion-dataset-manifest-validator: pass");
