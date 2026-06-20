import { createMotionDatasetPlanningOnlyGateSummary } from "./sharedFailClosedSummaryFactory.js";

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_NO_ACTION_PACKET_SCHEMA = "iris_live2d_motion_dataset_actual_data_task_runbook_no_action_packet_v1";
export const LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_SCHEMA = "iris_live2d_motion_dataset_final_owner_actual_data_packet_v1";
export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LEDGER_SCHEMA = "iris_live2d_motion_dataset_actual_data_freeze_state_ledger_v1";

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_SAFE_STEPS = Object.freeze([
  "verify_owner_confirmation_scope",
  "verify_source_hash_label",
  "verify_quarantine_ref",
  "verify_redaction_scan_ref",
  "verify_parser_dry_run_ref",
  "verify_audit_ref",
  "verify_go_nogo_ref",
  "verify_priority1_status",
  "verify_no_readiness_claim",
  "stop_before_actual_ingestion",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "source_hash_missing",
  "quarantine_missing",
  "redaction_scan_missing",
  "parser_dry_run_missing",
  "audit_missing",
  "go_nogo_no_go",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_REQUIRED_SECTIONS = Object.freeze([
  "current_prepared_artifacts",
  "missing_owner_confirmations",
  "missing_real_row_file",
  "missing_fresh_resident_evidence",
  "missing_parser_dry_run",
  "missing_redaction_scan",
  "missing_audit_execution",
  "missing_go_nogo_review",
  "priority1_blocked",
  "safe_future_owner_action",
]);

export const LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "source_hash_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_execution_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LABELS = Object.freeze([
  "all_planning_artifacts_prepared",
  "owner_confirmation_missing",
  "real_row_file_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_execution_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_UNFREEZE_CONDITIONS = Object.freeze([
  "owner_confirmation_confirmed_future",
  "real_row_file_supplied_future",
  "source_hash_verified_future",
  "fresh_resident_evidence_present_future",
  "parser_dry_run_pass_future",
  "redaction_scan_pass_future",
  "audit_execution_pass_future",
  "go_nogo_review_pass_future",
  "priority1_candidate_future",
]);

export function createMotionDatasetActualDataFreezeStateLedgerSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LEDGER_SCHEMA,
    statusKey: "motion_dataset_actual_data_freeze_state_ledger_status",
    status: "planning_only_blocked",
    boundaries: {
      freeze_state_ledger_only_boundary: true,
      actual_data_frozen_pending_owner_task: true,
      no_actual_data_task_started_boundary: true,
      no_real_row_ingestion_boundary: true,
      no_row_body_read_boundary: true,
      freeze_state_ledger_only: true,
    },
    flags: {
      actual_data_frozen_pending_owner_task: true,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
      owner_confirmation_confirmed: false,
    },
    arrays: {
      required_frozen_state_labels: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LABELS],
      required_unfreeze_conditions: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_UNFREEZE_CONDITIONS],
    },
    blockedReasons: [
      "actual_data_freeze_state_ledger_planning_only",
      "actual_data_freeze_state_ledger_pending_owner_task",
      "actual_data_freeze_state_ledger_no_actual_data_task_started",
      "actual_data_freeze_state_ledger_priority1_blocked",
    ],
    safeNextAction: "future_owner_confirmed_unfreeze_conditions_required",
    context: "motion dataset actual data freeze-state ledger summary",
  }, input);
}

export function createMotionDatasetFinalOwnerActualDataPacketSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_SCHEMA,
    statusKey: "motion_dataset_final_owner_actual_data_packet_status",
    status: "planning_only_blocked",
    boundaries: {
      final_owner_actual_data_packet_only_boundary: true,
      no_owner_confirmation_created_boundary: true,
      no_actual_data_task_started_boundary: true,
      no_actual_data_preauthorized_boundary: true,
      no_real_row_ingestion_boundary: true,
      no_row_body_read_boundary: true,
      final_owner_actual_data_packet_only: true,
    },
    flags: {
      owner_confirmation_required: true,
      owner_confirmation_confirmed: false,
      actual_data_preauthorized: false,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
      motion_dataset_executable: false,
    },
    arrays: {
      required_owner_packet_sections: [...LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_REQUIRED_SECTIONS],
      required_owner_packet_blockers: [...LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_BLOCKERS],
    },
    blockedReasons: [
      "final_owner_actual_data_packet_planning_only",
      "final_owner_actual_data_packet_no_owner_confirmation_created",
      "final_owner_actual_data_packet_no_actual_data_task_started",
      "final_owner_actual_data_packet_no_actual_data_preauthorized",
      "final_owner_actual_data_packet_priority1_blocked",
    ],
    safeNextAction: "future_owner_confirmation_required_before_actual_data_task",
    context: "motion dataset final owner actual data packet summary",
  }, input);
}

export function createMotionDatasetActualDataTaskRunbookNoActionPacketSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_NO_ACTION_PACKET_SCHEMA,
    statusKey: "motion_dataset_actual_data_task_runbook_no_action_packet_status",
    status: "planning_only_blocked",
    boundaries: {
      runbook_no_action_packet_only_boundary: true,
      no_actual_data_task_started_boundary: true,
      no_external_action_boundary: true,
      no_real_row_ingestion_boundary: true,
      no_row_body_read_boundary: true,
      runbook_no_action_packet_only: true,
    },
    flags: {
      actual_data_task_started: false,
      external_action_performed: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
      owner_confirmation_confirmed: false,
    },
    arrays: {
      required_safe_runbook_steps: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_SAFE_STEPS],
      required_runbook_blockers: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_BLOCKERS],
    },
    blockedReasons: [
      "actual_data_task_runbook_no_action_packet_planning_only",
      "actual_data_task_runbook_no_action_packet_no_external_action",
      "actual_data_task_runbook_no_action_packet_no_actual_data_task_started",
      "actual_data_task_runbook_no_action_packet_no_real_row_ingestion",
      "actual_data_task_runbook_no_action_packet_priority1_blocked",
    ],
    safeNextAction: "future_owner_confirmed_actual_data_task_runbook_review_required",
    context: "motion dataset actual data task runbook no-action packet summary",
  }, input);
}
