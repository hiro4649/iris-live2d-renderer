import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";

// Actual-data preauthorization planning summaries remain metadata-only and non-executable.
// They preserve fail-closed boundaries without reading row bodies, files, or hashes.
export const LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_CRITERIA_CHECKLIST_SCHEMA = "iris_live2d_motion_dataset_real_row_acceptance_criteria_checklist_v1";
export const LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REVIEW_PACKET_SCHEMA = "iris_live2d_motion_dataset_owner_actual_data_task_handoff_review_packet_v1";
export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_PROJECTION_SCHEMA = "iris_live2d_motion_dataset_actual_data_no_go_summary_projection_v1";
export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_LEDGER_SCHEMA = "iris_live2d_motion_dataset_owner_submission_readiness_ledger_v1";
export const LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_BLOCKER_GATE_SCHEMA = "iris_live2d_motion_dataset_final_actual_data_preauth_blocker_gate_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_CRITERIA = Object.freeze([
  "owner_confirmation_confirmed",
  "source_hash_present",
  "declared_row_count_present",
  "metadata_validator_pass_future",
  "checksum_verified_future",
  "parser_dry_run_pass_future",
  "redaction_scan_pass_future",
  "audit_manifest_pass_future",
  "go_nogo_review_pass_future",
  "fresh_resident_evidence_present",
  "renderer_ready_dependencies_satisfied",
  "unsupported_motion_absent",
  "checked_row_count_positive_after_future_ingestion",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_REJECTION_CRITERIA = Object.freeze([
  "owner_confirmation_missing",
  "source_hash_missing",
  "raw_row_body_unredacted",
  "unsupported_motion_present",
  "experimental_motion_executable",
  "renderer_ready_dependencies_missing",
  "priority1_blocked",
  "go_nogo_no_go",
  "actual_file_unverified",
  "stale_evidence",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_REVIEW_SECTIONS = Object.freeze([
  "missing_data_gate",
  "owner_submission_packet",
  "receipt_stub",
  "metadata_validator_stub",
  "checksum_preflight_manifest",
  "submission_rejection_fixture_pack",
  "actual_data_task_entry_gate",
  "parser_contract_stub",
  "parser_rejection_fixture_pack",
  "ingestion_audit_trail_stub",
  "rollback_plan_stub",
  "parser_dry_run_envelope",
  "acceptance_criteria_checklist",
  "fresh_resident_evidence_requirement",
  "go_nogo_blocker_map",
  "trusted_loader_boundary",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_CONFIRMATION_SCOPES = Object.freeze([
  "actual_row_data_submission",
  "source_hash_review",
  "row_body_parser_dry_run_review",
  "redaction_scan_review",
  "audit_trail_review",
  "rollback_plan_review",
  "go_nogo_review",
  "no_runtime_readiness_claim_review",
  "no_motion_execution_review",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_REASONS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "source_hash_missing",
  "parser_dry_run_not_executed",
  "redaction_scan_not_executed",
  "audit_result_missing",
  "fresh_resident_evidence_missing",
  "priority1_blocked",
  "renderer_ready_dependencies_unsatisfied",
  "go_nogo_review_missing",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_SAFE_NEXT_ACTIONS = Object.freeze([
  "owner_may_prepare_row_file_metadata",
  "owner_must_confirm_scope_later",
  "future_actual_data_task_required",
  "future_parser_dry_run_required",
  "future_redaction_scan_required",
  "future_audit_required",
  "future_go_nogo_required",
  "no_runtime_readiness_claim",
]);

export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_READY_PREREQUISITE_LABELS = Object.freeze([
  "schema_preflight_available",
  "submission_packet_available",
  "receipt_stub_available",
  "metadata_validator_stub_available",
  "checksum_preflight_manifest_available",
  "parser_contract_stub_available",
  "parser_rejection_fixture_available",
  "audit_trail_stub_available",
  "rollback_plan_stub_available",
  "parser_dry_run_envelope_available",
  "acceptance_criteria_available",
  "handoff_review_packet_available",
]);

export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_MISSING_PREREQUISITE_LABELS = Object.freeze([
  "real_row_file_missing",
  "owner_confirmation_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_result_missing",
  "go_nogo_review_missing",
  "positive_checked_row_count_missing",
]);

export const LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_REQUIRED_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "source_hash_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_result_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_CLEARANCE_CONDITIONS = Object.freeze([
  "owner_confirmation_confirmed_future",
  "row_file_metadata_verified_future",
  "source_hash_verified_future",
  "fresh_resident_evidence_present_future",
  "parser_dry_run_pass_future",
  "redaction_scan_pass_future",
  "audit_result_pass_future",
  "go_nogo_review_pass_future",
  "priority1_resolution_candidate_future",
  "checked_row_count_positive_future",
]);

export function createMotionDatasetFinalActualDataPreauthBlockerGateSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(source.actual_data_preauthorized || source.actual_data_task_started || source.actual_ingestion_allowed || source.real_row_data_present || source.row_body_read || Number(source.checked_row_count ?? 0) > 0 || source.motion_dataset_executable || source.runtime_readiness_claimed || source.production_readiness_claimed || source.owner_confirmation_confirmed || source.blocker_resolved || source.priority1_status === "RESOLVED" || source.go_nogo_status === "go");
  const blockedReasons = ["final_actual_data_preauth_blocker_gate_planning_only", "final_actual_data_preauth_blocker_gate_no_actual_data_preauthorized", "final_actual_data_preauth_blocker_gate_no_real_row_ingestion", "final_actual_data_preauth_blocker_gate_no_row_body_read", "final_actual_data_preauth_blocker_gate_priority1_blocked", "final_actual_data_preauth_blocker_gate_checked_row_count_zero", "final_actual_data_preauth_blocker_gate_no_go_preserved"];
  if (rejectedAttempt) blockedReasons.push("final_actual_data_preauth_blocker_gate_rejected_state_promotion");
  const summary = {
    schema: LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_BLOCKER_GATE_SCHEMA,
    motion_dataset_final_actual_data_preauth_blocker_gate_status: "planning_only_blocked",
    planning_only_boundary: true,
    preauth_blocker_gate_only_boundary: true,
    no_actual_data_preauthorized_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    preauth_blocker_gate_only: true,
    actual_data_preauthorized: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    blocker_resolved: false,
    required_preauth_blockers: [...LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_REQUIRED_BLOCKERS],
    required_preauth_clearance_conditions: [...LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_CLEARANCE_CONDITIONS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_real_data_go_nogo_required_before_advance_approval",
    boundary_policy: { ...createBoundaryPolicy(), planning_only: true, preauth_blocker_gate_only: true, no_actual_data_preauthorized: true, no_real_row_ingestion: true, no_row_body_read: true, no_motion_execution: true, no_runtime_readiness_claim: true, no_production_readiness_claim: true },
  };
  assertSafePublicObject(summary, "motion dataset final actual data preauth blocker gate summary");
  return summary;
}

export function createMotionDatasetOwnerSubmissionReadinessLedgerSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(source.owner_submission_received || source.owner_submission_accepted || source.actual_data_task_started || source.actual_ingestion_allowed || source.real_row_data_present || source.row_body_read || Number(source.checked_row_count ?? 0) > 0 || source.motion_dataset_executable || source.runtime_readiness_claimed || source.production_readiness_claimed || source.owner_confirmation_confirmed || source.priority1_status === "RESOLVED" || source.go_nogo_status === "go");
  const blockedReasons = ["submission_readiness_ledger_planning_only", "submission_readiness_ledger_no_submission_accepted", "submission_readiness_ledger_no_real_row_ingestion", "submission_readiness_ledger_no_row_body_read", "submission_readiness_ledger_priority1_blocked", "submission_readiness_ledger_no_go_preserved"];
  if (rejectedAttempt) blockedReasons.push("submission_readiness_ledger_rejected_state_promotion");
  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_LEDGER_SCHEMA,
    motion_dataset_owner_submission_readiness_ledger_status: "planning_only_blocked",
    planning_only_boundary: true,
    submission_readiness_ledger_only_boundary: true,
    no_submission_accepted_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    submission_readiness_ledger_only: true,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    required_ready_prerequisite_labels: [...LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_READY_PREREQUISITE_LABELS],
    required_missing_prerequisite_labels: [...LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_MISSING_PREREQUISITE_LABELS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_submission_and_confirmation_required_before_acceptance",
    boundary_policy: { ...createBoundaryPolicy(), planning_only: true, submission_readiness_ledger_only: true, no_submission_accepted: true, no_real_row_ingestion: true, no_row_body_read: true, no_motion_execution: true, no_runtime_readiness_claim: true, no_production_readiness_claim: true },
  };
  assertSafePublicObject(summary, "motion dataset owner submission readiness ledger summary");
  return summary;
}

export function createMotionDatasetActualDataNoGoSummaryProjectionSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(source.go_candidate || source.blocker_resolved || source.actual_data_task_started || source.actual_ingestion_allowed || source.real_row_data_present || source.row_body_read || Number(source.checked_row_count ?? 0) > 0 || source.motion_dataset_executable || source.runtime_readiness_claimed || source.production_readiness_claimed || source.owner_confirmation_confirmed || source.priority1_status === "RESOLVED" || source.go_nogo_status === "go");
  const blockedReasons = ["actual_data_no_go_summary_projection_planning_only", "actual_data_no_go_summary_projection_no_go_preserved", "actual_data_no_go_summary_projection_no_actual_data_task_started", "actual_data_no_go_summary_projection_no_real_row_ingestion", "actual_data_no_go_summary_projection_no_row_body_read", "actual_data_no_go_summary_projection_priority1_blocked"];
  if (rejectedAttempt) blockedReasons.push("actual_data_no_go_summary_projection_rejected_state_promotion");
  const summary = {
    schema: LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_PROJECTION_SCHEMA,
    motion_dataset_actual_data_no_go_summary_projection_status: "planning_only_blocked",
    planning_only_boundary: true,
    no_go_summary_projection_only_boundary: true,
    no_go_preserved_boundary: true,
    no_actual_data_task_started_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_go_summary_projection_only: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    required_no_go_summary_reasons: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_REASONS],
    required_safe_next_actions: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_SAFE_NEXT_ACTIONS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_and_go_nogo_review_required",
    boundary_policy: { ...createBoundaryPolicy(), planning_only: true, no_go_summary_projection_only: true, no_go_preserved: true, no_actual_data_task_started: true, no_real_row_ingestion: true, no_row_body_read: true, no_motion_execution: true, no_runtime_readiness_claim: true, no_production_readiness_claim: true },
  };
  assertSafePublicObject(summary, "motion dataset actual data no-go summary projection summary");
  return summary;
}

export function createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.owner_confirmation_confirmed ||
      source.owner_handoff_review_confirmed ||
      source.actual_data_task_started ||
      source.actual_ingestion_allowed ||
      source.real_row_data_present ||
      source.row_body_read ||
      Number(source.checked_row_count ?? 0) > 0 ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "owner_actual_data_task_handoff_review_packet_planning_only",
    "owner_actual_data_task_handoff_review_packet_no_owner_confirmation_created",
    "owner_actual_data_task_handoff_review_packet_no_actual_data_task_started",
    "owner_actual_data_task_handoff_review_packet_no_real_row_ingestion",
    "owner_actual_data_task_handoff_review_packet_no_row_body_read",
    "owner_actual_data_task_handoff_review_packet_priority1_blocked",
    "owner_actual_data_task_handoff_review_packet_no_go_preserved",
  ];
  if (rejectedAttempt) blockedReasons.push("owner_actual_data_task_handoff_review_packet_rejected_state_promotion");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REVIEW_PACKET_SCHEMA,
    motion_dataset_owner_actual_data_task_handoff_review_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    handoff_review_packet_only_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_actual_data_task_started_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    handoff_review_packet_only: true,
    owner_confirmation_required: true,
    owner_confirmation_confirmed: false,
    owner_handoff_review_confirmed: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_owner_review_sections: [...LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_REVIEW_SECTIONS],
    required_owner_confirmation_scopes: [...LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_CONFIRMATION_SCOPES],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_task_review_required_before_task_start",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      handoff_review_packet_only: true,
      no_owner_confirmation_created: true,
      no_actual_data_task_started: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset owner actual data task handoff review packet summary");
  return summary;
}

export function createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.actual_data_accepted ||
      source.actual_ingestion_allowed ||
      source.real_row_data_present ||
      source.row_body_read ||
      Number(source.checked_row_count ?? 0) > 0 ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "acceptance_criteria_checklist_planning_only",
    "acceptance_criteria_checklist_no_acceptance_approval",
    "acceptance_criteria_checklist_no_actual_data_accepted",
    "acceptance_criteria_checklist_no_real_row_ingestion",
    "acceptance_criteria_checklist_no_row_body_read",
    "acceptance_criteria_checklist_priority1_blocked",
    "acceptance_criteria_checklist_no_go_preserved",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("acceptance_criteria_checklist_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_CRITERIA_CHECKLIST_SCHEMA,
    motion_dataset_real_row_acceptance_criteria_checklist_status: "planning_only_blocked",
    planning_only_boundary: true,
    acceptance_criteria_checklist_only_boundary: true,
    no_acceptance_approval_boundary: true,
    no_actual_data_accepted_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    acceptance_criteria_checklist_only: true,
    actual_data_accepted: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_acceptance_criteria: [...LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_CRITERIA],
    required_rejection_criteria: [...LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_REJECTION_CRITERIA],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_real_row_acceptance_review_required_before_actual_data_acceptance",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      acceptance_criteria_checklist_only: true,
      no_acceptance_approval: true,
      no_actual_data_accepted: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row acceptance criteria checklist summary");
  return summary;
}
