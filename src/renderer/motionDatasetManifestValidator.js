export const MOTION_DATASET_MANIFEST_VALIDATOR_SCHEMA = "live2d_motion_dataset_manifest_validator_v1";
import {
  isPrototypePollutionKey,
  isSafeLabelValue,
} from "./safeLabelValidation.js";
import {
  LIVE2D_EXPERIMENTAL_MOTION_LABELS,
  LIVE2D_RUNTIME_SUPPORTED_MOTION_LABELS,
  LIVE2D_STRONG_MOTION_LABELS,
} from "./live2dSafeContractCatalog.js";

export const REQUIRED_MANIFEST_LABELS = Object.freeze([
  "row_id",
  "split",
  "source_file_label",
  "scenario_id",
  "motion_label",
  "schema_version_label",
  "dataset_version_label",
  "source_hash_label",
  "owner_scope_label",
  "audit_run_id_label",
  "auditor_version_label",
]);

export const OPTIONAL_MANIFEST_LABELS = Object.freeze([
  "expression_label",
  "gaze_label",
  "breath_label",
  "camera_label",
  "timing_label",
  "intensity_label",
  "recovery_plan_label",
  "visibility_guard_label",
  "comfort_guard_label",
  "cue_freshness_label",
  "expected_safe_summary_hash_label",
  "source_line_label",
  "duplicate_group_id_label",
]);

export const MANIFEST_SPLIT_ALLOWLIST = Object.freeze([
  "train",
  "eval",
  "test",
  "review_only",
  "fixture_only",
  "quarantine_only",
]);

const SUPPORTED_MOTION_LABELS = new Set(LIVE2D_RUNTIME_SUPPORTED_MOTION_LABELS);
const EXPERIMENTAL_MOTION_LABELS = new Set(LIVE2D_EXPERIMENTAL_MOTION_LABELS);
const STRONG_MOTION_LABELS = new Set(LIVE2D_STRONG_MOTION_LABELS);

const UNSAFE_KEYS = new Set([
  "raw_row_body",
  "actual_file_content",
  "actual_file_path",
  "raw_renderer_payload",
  "endpoint",
  "token",
  "secret",
  "private_path",
]);

const ALLOWED_KEYS = new Set([...REQUIRED_MANIFEST_LABELS, ...OPTIONAL_MANIFEST_LABELS, "experimental_motion_executable"]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasLabel(value) {
  return isSafeLabelValue(value);
}

function baseResult(status, safeReasonLabels, rejectionLabels, count) {
  return {
    schema: MOTION_DATASET_MANIFEST_VALIDATOR_SCHEMA,
    status,
    safeReasonLabels,
    rejectionLabels,
    syntheticValidatedEntryCount: count,
    checkedRowCount: 0,
    rowBodyRead: false,
    actualFileRead: false,
    sourceHashVerified: false,
    declaredRowCountChecked: false,
    actualIngestionAllowed: false,
    motionDatasetExecutable: false,
    safeSummaryOnly: true,
  };
}

function validateEntry(entry, index) {
  const rejectionLabels = [];
  if (!isPlainObject(entry)) return [`entry_not_plain_object:${index}`];
  for (const key of Object.keys(entry)) {
    if (isPrototypePollutionKey(key)) rejectionLabels.push(`unsafe_key:${key}`);
    if (UNSAFE_KEYS.has(key)) rejectionLabels.push(`${key}_present`);
    if (!ALLOWED_KEYS.has(key)) rejectionLabels.push(`unknown_label:${key}`);
  }
  for (const label of REQUIRED_MANIFEST_LABELS) {
    if (!hasLabel(entry[label])) rejectionLabels.push(`${label}_missing`);
  }
  for (const label of OPTIONAL_MANIFEST_LABELS) {
    if (entry[label] !== undefined && !hasLabel(entry[label])) rejectionLabels.push(`${label}_invalid`);
  }
  if (hasLabel(entry.split) && !MANIFEST_SPLIT_ALLOWLIST.includes(entry.split)) {
    rejectionLabels.push("split_unsupported");
  }
  if (hasLabel(entry.motion_label) && !SUPPORTED_MOTION_LABELS.has(entry.motion_label)) {
    rejectionLabels.push(
      EXPERIMENTAL_MOTION_LABELS.has(entry.motion_label)
        ? "experimental_motion_marked_executable"
        : "unsupported_motion_label",
    );
  }
  if (EXPERIMENTAL_MOTION_LABELS.has(entry.motion_label) && entry.experimental_motion_executable === true) {
    rejectionLabels.push("experimental_motion_marked_executable");
  }
  if (STRONG_MOTION_LABELS.has(entry.motion_label) && !hasLabel(entry.recovery_plan_label)) {
    rejectionLabels.push("strong_motion_without_recovery");
  }
  if (STRONG_MOTION_LABELS.has(entry.motion_label) && entry.cue_freshness_label === "stale") {
    rejectionLabels.push("stale_cue_strong_motion");
  }
  if (entry.visibility_guard_label === "subtitle_occlusion_risk") rejectionLabels.push("subtitle_occlusion_risk");
  if (entry.comfort_guard_label === "gaze_pressure_risk") rejectionLabels.push("gaze_pressure_risk");
  if (entry.expected_safe_summary_hash_label === "leak") rejectionLabels.push("expected_summary_leak");
  return rejectionLabels;
}

export function validateMotionDatasetManifest(entries = []) {
  if (!Array.isArray(entries)) {
    return baseResult("rejected", [], ["manifest_not_array"], 0);
  }
  const rejectionLabels = [];
  const rowIds = new Map();
  const rowSplitById = new Map();
  for (const [index, entry] of entries.entries()) {
    rejectionLabels.push(...validateEntry(entry, index));
    if (isPlainObject(entry) && hasLabel(entry.row_id)) {
      if (rowIds.has(entry.row_id)) rejectionLabels.push("duplicate_row_id");
      rowIds.set(entry.row_id, index);
      if (hasLabel(entry.split)) {
        const existing = rowSplitById.get(entry.row_id) || new Set();
        existing.add(entry.split);
        rowSplitById.set(entry.row_id, existing);
      }
    }
    if (isPlainObject(entry) && entry.split === "fixture_only" && hasLabel(entry.duplicate_group_id_label)) {
      rejectionLabels.push("fixture_duplication");
    }
  }
  for (const splits of rowSplitById.values()) {
    if (splits.has("train") && splits.has("eval")) rejectionLabels.push("train_eval_overlap");
    if (splits.has("train") && splits.has("test")) rejectionLabels.push("train_test_overlap");
    if (splits.has("eval") && splits.has("test")) rejectionLabels.push("eval_test_overlap");
  }
  const dedupedRejections = [...new Set(rejectionLabels)];
  return baseResult(
    dedupedRejections.length ? "rejected" : "accepted_metadata_only",
    ["metadata_only_validation", "no_actual_ingestion", "no_row_body_read", "source_hash_label_not_verified"],
    dedupedRejections,
    entries.length,
  );
}
