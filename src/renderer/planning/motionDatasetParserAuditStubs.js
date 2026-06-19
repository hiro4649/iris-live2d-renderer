import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";
import { detectedMotionDatasetRawFields } from "./motionDatasetPlanningSafety.js";
import {
  detectedRejectedRequestFields,
  safeOwnerRowSubmissionRejectedFieldLabel,
} from "./motionDatasetOwnerGates.js";

// Parser/audit stubs are planning-only and non-executable.
// They must not parse row bodies, read files, ingest rows, or create audit events.

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA = "iris_live2d_motion_dataset_row_body_parser_contract_stub_v1";

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_dataset_row_body_parser_rejection_fixture_pack_v1";

export const LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA = "iris_live2d_motion_dataset_ingestion_audit_trail_stub_v1";

export const LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA = "iris_live2d_motion_dataset_ingestion_rollback_plan_stub_v1";

export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_parser_dry_run_envelope_v1";

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS = Object.freeze([
  "row_id",
  "dataset_split",
  "source_line",
  "scenario_id",
  "cue_kind",
  "motion_label",
  "expression_label",
  "gaze_label",
  "breath_label",
  "body_label",
  "camera_label",
  "timing_label",
  "intensity_label",
  "recovery_plan_label",
  "visibility_guard_label",
  "comfort_guard_label",
  "audit_metadata_ref",
  "redaction_status",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REJECTION_REASONS = Object.freeze([
  "missing_row_id",
  "duplicate_row_id",
  "unsupported_motion_label",
  "experimental_motion_executable_attempt",
  "raw_cue_payload_present",
  "raw_renderer_payload_present",
  "model_locator_present",
  "motion_locator_present",
  "endpoint_value_present",
  "token_value_present",
  "secret_value_present",
  "private_path_present",
  "world_command_present",
  "obs_command_present",
  "game_input_present",
  "os_command_present",
  "memory_commit_present",
  "relationship_commit_present",
  "readiness_claim_present",
  "owner_confirmation_claim_present",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SAFE_PUBLIC_REJECTION_REASONS = Object.freeze([
  "missing_row_id",
  "duplicate_row_id",
  "unsupported_motion_label",
  "experimental_motion_executable_attempt",
  "cue_material_present",
  "renderer_material_present",
  "model_reference_material_present",
  "motion_reference_material_present",
  "network_value_present",
  "credential_value_present",
  "private_reference_present",
  "world_operation_request_present",
  "obs_operation_request_present",
  "game_interaction_request_present",
  "os_operation_request_present",
  "memory_commit_present",
  "relationship_commit_present",
  "readiness_claim_present",
  "owner_confirmation_claim_present",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_ACCEPTED_CASES = Object.freeze([
  "safe_missing_row_id_rejection",
  "safe_duplicate_row_id_rejection",
  "safe_unsupported_motion_rejection",
  "safe_raw_field_rejection",
  "safe_readiness_claim_rejection",
  "safe_owner_confirmation_claim_rejection",
  "safe_no_data_present_blocked_fixture",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_INPUT_ATTEMPT_CASES = Object.freeze([
  "jsonl_material_rejected",
  "csv_material_rejected",
  "dataset_row_material_rejected",
  "file_content_material_rejected",
  "file_reference_value_rejected",
  "cue_material_rejected",
  "renderer_material_rejected",
  "model_reference_material_rejected",
  "motion_reference_material_rejected",
  "network_value_rejected",
  "credential_value_rejected",
  "private_reference_rejected",
  "world_operation_request_rejected",
  "obs_operation_request_rejected",
  "game_interaction_request_rejected",
  "os_operation_request_rejected",
  "memory_commit_request_rejected",
  "relationship_commit_request_rejected",
  "renderer_ready_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REQUIRED_EVENT_FIELDS = Object.freeze([
  "audit_event_id",
  "actor_role",
  "action_type",
  "safe_target_label",
  "result_status",
  "timestamp_label",
  "request_id",
  "dataset_name",
  "source_hash_label",
  "declared_row_count_label",
  "schema_version_label",
  "redaction_status",
  "owner_confirmation_ref",
  "go_nogo_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REDACTION_POLICY = Object.freeze([
  "no_dataset_row_material",
  "no_file_location_value",
  "no_file_content_material",
  "no_cue_material",
  "no_renderer_material",
  "no_network_location_value",
  "no_credential_value",
  "no_private_location_value",
  "no_owner_note_material",
  "no_memo_material",
  "no_command_material",
]);

export const LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS = Object.freeze([
  "rollback_plan_id",
  "ingestion_batch_id",
  "source_hash_label",
  "pre_ingestion_snapshot_ref",
  "post_ingestion_snapshot_ref",
  "audit_event_ref",
  "owner_confirmation_ref",
  "go_nogo_ref",
  "rollback_reason_labels",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS = Object.freeze([
  "missing_pre_ingestion_snapshot",
  "missing_owner_confirmation",
  "missing_audit_event",
  "missing_go_nogo_ref",
  "missing_source_hash",
  "missing_batch_id",
  "priority1_blocked",
]);

export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_INPUTS = Object.freeze([
  "metadata_validator_ref",
  "checksum_preflight_ref",
  "parser_contract_ref",
  "parser_rejection_fixture_ref",
  "owner_confirmation_ref",
  "source_hash_label",
  "declared_row_count_label",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_OUTPUTS = Object.freeze([
  "dry_run_status",
  "safe_reject_count",
  "safe_accept_candidate_count",
  "unchecked_count",
  "redaction_status",
  "audit_ref",
  "safe_next_action",
]);

export function createMotionDatasetRowBodyParserContractStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "raw_jsonl_body",
      "raw_csv_body",
      "raw_dataset_row_body",
      "raw_row_body",
      "actual_file_content",
      "actual_file_path_value",
      "raw_cue_payload",
      "raw_renderer_payload",
      "raw_model_path",
      "raw_motion_path",
      "endpoint_value",
      "token_value",
      "secret_value",
      "private_local_path",
      "world_command",
      "obs_command",
      "game_input",
      "os_command",
      "memory_commit",
      "relationship_commit",
      "owner_private_note",
      "raw_owner_confirmation_note",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const parserRequested = source.row_body_parser_enabled === true || source.row_body_parser_executed === true || source.parser_executed === true;
  const rowBodyReadRequested = source.row_body_read === true || source.raw_jsonl_body !== undefined || source.raw_csv_body !== undefined || source.raw_dataset_row_body !== undefined;
  const rowContentRequested = source.actual_row_content_accepted === true || source.row !== undefined || source.dataset_row !== undefined;
  const ingestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true;
  const readinessRequested = source.renderer_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const blockedReasons = [
    "row_body_parser_contract_stub_planning_only",
    "row_body_parser_contract_stub_no_parser_execution",
    "row_body_parser_contract_stub_no_actual_row_content",
    "row_body_parser_contract_stub_no_real_row_ingestion",
    "row_body_parser_contract_stub_no_row_body_read",
    "row_body_parser_contract_stub_priority1_blocked",
    "row_body_parser_contract_stub_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("row_body_parser_contract_stub_rejected_unsafe_material");
  if (parserRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_parser_execution");
  if (rowBodyReadRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_row_body_read");
  if (rowContentRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_actual_row_content");
  if (ingestionRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_ingestion");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_real_row_or_checked_count");
  if (motionExecutionRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_priority1_resolution");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA,
    safe_summary_only: true,
    motion_dataset_row_body_parser_contract_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    parser_contract_stub_only_boundary: true,
    no_parser_execution_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    parser_contract_stub_only: true,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_future_parser_fields: [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS],
    required_future_parser_rejection_reasons: [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SAFE_PUBLIC_REJECTION_REASONS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_parser_implementation_required_before_row_body_read",
    boundary_policy: {
      ...createBoundaryPolicy(),
      parser_contract_stub_only: true,
      no_parser_execution: true,
      no_actual_row_content: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset row body parser contract stub summary");
  return summary;
}

export function createMotionDatasetRowBodyParserRejectionFixturePackSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.row_body_parser_enabled ||
      source.row_body_parser_executed ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "parser_rejection_fixture_pack_synthetic_only",
    "parser_rejection_fixture_pack_no_parser_execution",
    "parser_rejection_fixture_pack_no_actual_row_content",
    "parser_rejection_fixture_pack_no_real_row_ingestion",
    "parser_rejection_fixture_pack_no_row_body_read",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("parser_rejection_fixture_pack_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA,
    motion_dataset_row_body_parser_rejection_fixture_pack_status: "planning_only_blocked",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    parser_rejection_fixture_pack_only_boundary: true,
    no_parser_execution_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    synthetic_only: true,
    parser_rejection_fixture_pack_only: true,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
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
    accepted_parser_rejection_fixture_cases: [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_ACCEPTED_CASES],
    rejected_parser_input_attempt_cases: [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_INPUT_ATTEMPT_CASES],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_parser_execution_required_before_actual_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      synthetic_only: true,
      parser_rejection_fixture_pack_only: true,
      no_parser_execution: true,
      no_actual_row_content: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset row body parser rejection fixture pack summary");
  return summary;
}

export function createMotionDatasetIngestionAuditTrailStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.real_ingestion_audit_event_created ||
      source.actual_data_task_started ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "ingestion_audit_trail_stub_planning_only",
    "ingestion_audit_trail_stub_no_real_ingestion_audit_event",
    "ingestion_audit_trail_stub_no_real_row_ingestion",
    "ingestion_audit_trail_stub_no_row_body_read",
    "ingestion_audit_trail_stub_priority1_blocked",
    "ingestion_audit_trail_stub_motion_dataset_non_executable",
    "ingestion_audit_trail_stub_no_go_preserved",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("ingestion_audit_trail_stub_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA,
    motion_dataset_ingestion_audit_trail_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    audit_trail_stub_only_boundary: true,
    no_real_ingestion_audit_event_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    audit_trail_stub_only: true,
    real_ingestion_audit_event_created: false,
    actual_data_task_started: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
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
    required_future_audit_event_fields: [...LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REQUIRED_EVENT_FIELDS],
    required_audit_redaction_policy: [...LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REDACTION_POLICY],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_task_required_before_real_ingestion_audit_event",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      audit_trail_stub_only: true,
      no_real_ingestion_audit_event: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset ingestion audit trail stub summary");
  return summary;
}

export function createMotionDatasetIngestionRollbackPlanStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.rollback_ready ||
      source.rollback_snapshot_created ||
      source.rollback_plan_approved ||
      source.real_ingestion_audit_event_created ||
      source.actual_data_task_started ||
      source.real_row_data_present ||
      source.row_body_read ||
      source.actual_ingestion_allowed ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "rollback_plan_stub_planning_only",
    "rollback_plan_stub_not_rollback_ready",
    "rollback_plan_stub_no_real_row_ingestion",
    "rollback_plan_stub_no_row_body_read",
    "rollback_plan_stub_priority1_blocked",
    "rollback_plan_stub_motion_dataset_non_executable",
    "rollback_plan_stub_no_go_preserved",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("rollback_plan_stub_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA,
    motion_dataset_ingestion_rollback_plan_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    rollback_plan_stub_only_boundary: true,
    no_rollback_ready_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    rollback_plan_stub_only: true,
    rollback_ready: false,
    rollback_snapshot_created: false,
    rollback_plan_approved: false,
    real_ingestion_audit_event_created: false,
    actual_data_task_started: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
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
    required_future_rollback_fields: [...LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS],
    required_rollback_blockers: [...LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_task_required_before_rollback_readiness",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      rollback_plan_stub_only: true,
      no_rollback_ready: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset ingestion rollback plan stub summary");
  return summary;
}

export function createMotionDatasetParserDryRunEnvelopeSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.row_body_parser_enabled ||
      source.row_body_parser_executed ||
      source.parser_dry_run_executed ||
      source.actual_file_read ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "parser_dry_run_envelope_planning_only",
    "parser_dry_run_envelope_no_parser_execution",
    "parser_dry_run_envelope_no_actual_file_read",
    "parser_dry_run_envelope_no_actual_row_content",
    "parser_dry_run_envelope_no_real_row_ingestion",
    "parser_dry_run_envelope_priority1_blocked",
    "parser_dry_run_envelope_no_go_preserved",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("parser_dry_run_envelope_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA,
    motion_dataset_parser_dry_run_envelope_status: "planning_only_blocked",
    planning_only_boundary: true,
    parser_dry_run_envelope_only_boundary: true,
    no_parser_execution_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    parser_dry_run_envelope_only: true,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    parser_dry_run_executed: false,
    actual_file_read: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    checked_row_count: 0,
    real_row_data_present: false,
    actual_ingestion_allowed: false,
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
    required_future_dry_run_inputs: [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_INPUTS],
    required_future_dry_run_outputs: [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_OUTPUTS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_parser_dry_run_required_before_parser_execution",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      parser_dry_run_envelope_only: true,
      no_parser_execution: true,
      no_actual_file_read: true,
      no_actual_row_content: true,
      no_real_row_ingestion: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset parser dry-run envelope summary");
  return summary;
}
