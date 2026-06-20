import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";
import { safeMotionDatasetLabel } from "./motionDatasetPlanningSafety.js";

export const LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_GATE_SCHEMA = "iris_live2d_motion_dataset_final_owner_wait_for_data_gate_v1";

export const LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS = Object.freeze([
  "real_row_file_missing",
  "owner_confirmation_missing",
  "source_hash_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_execution_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_FUTURE_ACTIONS = Object.freeze([
  "provide_row_file_metadata_later",
  "confirm_owner_scope_later",
  "provide_source_hash_later",
  "approve_actual_data_task_later",
  "review_go_nogo_later",
  "do_not_claim_runtime_readiness_now",
  "do_not_enable_trusted_loader_now",
]);

export function createMotionDatasetFinalOwnerWaitForDataGateSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const providedReasons = Array.isArray(source.required_wait_reasons)
    ? source.required_wait_reasons.map((item) => safeMotionDatasetLabel(item, "unsafe_label"))
    : LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS;
  const missingReasons = LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS
    .filter((item) => !providedReasons.includes(item));
  const unsafeAttempt = source.final_owner_wait_gate_confirms_owner === true
    || source.owner_confirmation_confirmed === true
    || source.owner_submission_received === true
    || source.owner_submission_accepted === true
    || source.actual_data_task_started === true
    || source.actual_data_preauthorized === true
    || source.actual_ingestion_allowed === true
    || source.real_row_data_present === true
    || source.row_body_read === true
    || Number(source.checked_row_count ?? 0) > 0
    || source.motion_dataset_executable === true
    || source.runtime_readiness_claimed === true
    || source.production_readiness_claimed === true
    || source.priority1_status === "RESOLVED"
    || source.go_nogo_status === "go";
  const waitReasons = [
    ...LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS,
    ...missingReasons.map((item) => `missing_required_wait_reason_${item}`),
    unsafeAttempt ? "final_owner_wait_gate_rejected_owner_or_actual_data_attempt" : "",
  ].filter(Boolean);
  const summary = {
    schema: LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_GATE_SCHEMA,
    safe_summary_only: true,
    motion_dataset_final_owner_wait_for_data_gate_status: missingReasons.length || unsafeAttempt ? "blocked" : "waiting_for_owner_data",
    planning_only_boundary: true,
    final_owner_wait_for_data_gate_only_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_actual_data_task_started_boundary: true,
    no_actual_data_accepted_boundary: true,
    no_real_row_ingestion_boundary: true,
    final_owner_wait_gate_confirms_owner: false,
    owner_confirmation_confirmed: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    actual_data_accepted: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    required_wait_reasons: [...LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS],
    provided_wait_reasons: providedReasons,
    missing_wait_reasons: missingReasons,
    wait_for_data_reasons: [...new Set(waitReasons)],
    future_owner_actions: [...LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_FUTURE_ACTIONS],
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    trusted_loader_allowlist_enabled: false,
    safe_next_action: "wait_for_owner_confirmed_real_row_data_before_actual_data_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_actual_data_accepted: true,
      no_real_row_ingestion: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset final owner wait for data gate summary");
  return summary;
}
