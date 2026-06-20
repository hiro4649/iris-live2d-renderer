import { createMotionDatasetPlanningOnlyGateSummary } from "./sharedFailClosedSummaryFactory.js";

// Owner-confirmation wait planning summaries remain metadata-only and non-executable.
// They preserve fail-closed boundaries without reading row bodies, files, or hashes.
export const LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_owner_confirmation_preflight_envelope_v1";
export const LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA = "iris_live2d_motion_dataset_owner_wait_state_packet_v1";
export const LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA = "iris_live2d_motion_dataset_planning_completion_review_packet_v1";

export const LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_SCOPES = Object.freeze([
  "actual_row_data_submission",
  "source_hash_review",
  "parser_dry_run_review",
  "redaction_scan_review",
  "audit_execution_review",
  "rollback_plan_review",
  "go_nogo_review",
  "no_runtime_readiness_claim_review",
  "no_motion_execution_review",
]);

export const LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_EVIDENCE_REFS = Object.freeze([
  "owner_scope_ref_future",
  "source_hash_ref_future",
  "parser_dry_run_ref_future",
  "redaction_scan_ref_future",
  "audit_execution_ref_future",
  "rollback_plan_ref_future",
  "go_nogo_ref_future",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_OWNER_ITEMS = Object.freeze([
  "owner_confirmation_scope",
  "real_row_file_future",
  "source_hash_future",
  "declared_row_count_future",
  "go_nogo_review_future",
]);

export const LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_SYSTEM_ITEMS = Object.freeze([
  "parser_dry_run_future",
  "redaction_scan_future",
  "audit_execution_future",
  "fresh_resident_evidence_future",
  "priority1_review_future",
]);

export const LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_COMPLETED_ARTIFACTS = Object.freeze([
  "row_schema_preflight",
  "synthetic_row_fixture_pack",
  "request_packet",
  "dry_run_validator",
  "quarantine_envelope",
  "owner_handoff_packet",
  "audit_manifest",
  "redaction_scanner_fixture_pack",
  "evidence_link_manifest",
  "go_nogo_blocker_map",
  "pre_ingestion_review_packet",
  "final_dry_run_checklist",
  "missing_data_gate",
  "owner_submission_packet",
  "receipt_stub",
  "checksum_preflight_manifest",
  "metadata_validator_stub",
  "submission_rejection_fixture_pack",
  "actual_data_task_entry_gate",
  "parser_contract_stub",
  "parser_rejection_fixture_pack",
  "ingestion_audit_trail_stub",
  "rollback_plan_stub",
  "parser_dry_run_envelope",
  "acceptance_criteria_checklist",
  "owner_handoff_review_packet",
  "no_go_summary_projection",
  "submission_readiness_ledger",
  "preauth_blocker_gate",
  "owner_confirmation_preflight_envelope",
  "quarantine_staging_envelope",
  "redaction_scan_execution_envelope",
  "parser_execution_request_envelope",
  "audit_execution_request_envelope",
  "runbook_no_action_packet",
  "final_owner_packet",
  "freeze_state_ledger",
  "owner_wait_state_packet",
  "readiness_non_sweetening_sweep",
]);

export const LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_UNRESOLVED_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_execution_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export function createMotionDatasetPlanningCompletionReviewPacketSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA,
    statusKey: "motion_dataset_planning_completion_review_packet_status",
    status: "planning_only_blocked",
    boundaries: {
      planning_completion_review_packet_only_boundary: true,
      no_actual_data_ready_claim_boundary: true,
      no_owner_confirmation_created_boundary: true,
      no_real_row_ingestion_boundary: true,
      planning_completion_review_packet_only: true,
    },
    flags: {
      planning_completion_claims_actual_ready: false,
      owner_confirmation_confirmed: false,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
    },
    arrays: {
      required_completed_planning_artifacts: [...LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_COMPLETED_ARTIFACTS],
      required_unresolved_blockers: [...LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_UNRESOLVED_BLOCKERS],
    },
    blockedReasons: [
      "planning_completion_review_packet_planning_only",
      "planning_completion_review_packet_no_actual_data_ready_claim",
      "planning_completion_review_packet_no_owner_confirmation_created",
      "planning_completion_review_packet_priority1_blocked",
    ],
    safeNextAction: "continue_owner_wait_without_actual_data_readiness_claim",
    context: "motion dataset planning completion review packet summary",
  }, input);
}

export function createMotionDatasetOwnerWaitStatePacketSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA,
    statusKey: "motion_dataset_owner_wait_state_packet_status",
    status: "planning_only_blocked",
    boundaries: {
      owner_wait_state_packet_only_boundary: true,
      no_owner_confirmation_created_boundary: true,
      no_actual_data_task_started_boundary: true,
      owner_wait_state_packet_only: true,
    },
    flags: {
      owner_confirmation_required: true,
      owner_confirmation_confirmed: false,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
    },
    arrays: {
      required_waiting_on_owner_items: [...LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_OWNER_ITEMS],
      required_waiting_on_system_items: [...LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_SYSTEM_ITEMS],
    },
    blockedReasons: [
      "owner_wait_state_packet_planning_only",
      "owner_wait_state_packet_no_owner_confirmation_created",
      "owner_wait_state_packet_no_actual_data_task_started",
      "owner_wait_state_packet_priority1_blocked",
    ],
    safeNextAction: "wait_for_future_owner_confirmation_and_system_prerequisites",
    context: "motion dataset owner wait-state packet summary",
  }, input);
}

export function createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_ENVELOPE_SCHEMA,
    statusKey: "motion_dataset_owner_confirmation_preflight_envelope_status",
    status: "planning_only_blocked",
    boundaries: {
      owner_confirmation_preflight_envelope_only_boundary: true,
      no_owner_confirmation_created_boundary: true,
      no_owner_confirmation_confirmed_boundary: true,
      no_actual_data_task_started_boundary: true,
      owner_confirmation_preflight_envelope_only: true,
    },
    arrays: {
      required_future_owner_confirmation_scopes: [...LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_SCOPES],
      required_future_owner_confirmation_evidence_refs: [...LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_EVIDENCE_REFS],
    },
    blockedReasons: [
      "owner_confirmation_preflight_envelope_planning_only",
      "owner_confirmation_preflight_envelope_no_owner_confirmation_created",
      "owner_confirmation_preflight_envelope_no_owner_confirmation_confirmed",
      "owner_confirmation_preflight_envelope_no_actual_data_task_started",
      "owner_confirmation_preflight_envelope_priority1_blocked",
      "owner_confirmation_preflight_envelope_no_go_preserved",
    ],
    safeNextAction: "future_owner_confirmation_required_before_actual_data_task",
    context: "motion dataset owner confirmation preflight envelope summary",
  }, input);
}
