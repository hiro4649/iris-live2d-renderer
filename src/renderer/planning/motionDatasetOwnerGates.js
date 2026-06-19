import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";

import {

  LIVE2D_EXPERIMENTAL_MOTION_LABELS,

  LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES,

} from "./sharedMotionCatalog.js";

import {

  detectedMotionDatasetRawFields,

  filterSyntheticFixtureCases,

  privateMaterialCategory,

  safeMotionDatasetLabel,

  safeSyntheticRejectedCaseLabel,

} from "./motionDatasetPlanningSafety.js";

import {

  LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS,

  LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,

  LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,

} from "./motionDatasetPlanningCore.js";



// Owner-gate planning summaries remain metadata-only and non-executable.

// They preserve request/validation boundaries without reading row bodies or files.



export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA = "iris_live2d_motion_dataset_real_row_intake_request_packet_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA = "iris_live2d_motion_dataset_real_row_intake_dry_run_validator_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_real_row_intake_quarantine_envelope_v1";

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA = "iris_live2d_motion_dataset_owner_row_data_submission_packet_v1";

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA = "iris_live2d_motion_dataset_owner_row_data_metadata_validator_stub_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS = Object.freeze([
  "dataset_name",
  "request_id",
  "request_schema_version",
  "requested_file_format",
  "expected_row_count",
  "dataset_split_plan",
  "source_file_label",
  "source_hash",
  "audit_run_id",
  "auditor_version",
  "owner_confirmation_required",
  "redaction_policy_ref",
  "row_schema_ref",
  "synthetic_fixture_pack_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS = Object.freeze([
  "jsonl",
  "csv",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS = Object.freeze([
  "raw_dataset_row_body",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_model_path",
  "raw_motion_path",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "candidate_payload",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
  "raw_process_output",
  "raw_stack_trace",
  "owner_private_note",
  "raw_k_memo_text",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_ACCEPTED_REQUEST_FIXTURE_CASES = Object.freeze([
  "safe_jsonl_request_metadata",
  "safe_csv_request_metadata",
  "safe_split_plan_request",
  "safe_hash_present_request",
  "safe_owner_confirmation_required_request",
  "safe_renderer_ready_policy_request",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES = Object.freeze([
  "missing_request_id_rejected",
  "missing_dataset_name_rejected",
  "missing_schema_version_rejected",
  "missing_file_format_rejected",
  "unsupported_file_format_rejected",
  "missing_expected_row_count_rejected",
  "missing_source_hash_rejected",
  "missing_audit_run_id_rejected",
  "missing_auditor_version_rejected",
  "missing_split_plan_rejected",
  "missing_owner_confirmation_required_rejected",
  "owner_confirmation_confirmed_rejected",
  "raw_dataset_row_body_rejected",
  "raw_cue_payload_rejected",
  "raw_renderer_payload_rejected",
  "raw_model_path_rejected",
  "raw_motion_path_rejected",
  "endpoint_value_rejected",
  "token_value_rejected",
  "secret_value_rejected",
  "private_local_path_rejected",
  "world_command_rejected",
  "obs_command_rejected",
  "game_interaction_request_rejected",
  "os_command_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "readiness_claim_rejected",
  "motion_execution_request_rejected",
  "real_ingestion_request_rejected",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA = Object.freeze([
  "request_id",
  "dataset_name",
  "file_label",
  "file_format",
  "declared_row_count",
  "source_hash",
  "schema_version",
  "dataset_split_plan",
  "audit_run_id",
  "auditor_version",
  "row_schema_ref",
  "request_packet_ref",
  "dry_run_validator_ref",
  "synthetic_fixture_pack_ref",
  "redaction_policy_ref",
  "owner_confirmation_required",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS = Object.freeze([
  "raw_dataset_row_body",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_model_path",
  "raw_motion_path",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "candidate_payload",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
  "raw_process_output",
  "raw_stack_trace",
  "owner_private_note",
  "raw_k_memo_text",
  "actual_file_path_value",
  "actual_file_content",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_ITEMS = Object.freeze([
  "jsonl_or_csv_file_label",
  "declared_file_format",
  "declared_row_count",
  "source_hash",
  "schema_version",
  "dataset_split_plan",
  "audit_run_id",
  "auditor_version",
  "redaction_policy_ref",
  "motion_allowlist_policy_ref",
  "renderer_ready_policy_ref",
  "unsupported_motion_policy_ref",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_CONFIRMATION_SCOPES = Object.freeze([
  "row_file_metadata_review",
  "row_schema_policy_review",
  "redaction_policy_review",
  "unsupported_motion_policy_review",
  "renderer_ready_policy_review",
  "no_runtime_readiness_claim_review",
  "no_motion_execution_review",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_FILE_SHAPE = Object.freeze([
  "one_row_id_per_record",
  "dataset_split_per_record",
  "motion_label_per_record",
  "audit_metadata_per_record",
  "no_raw_renderer_payload",
  "no_raw_cue_payload",
  "no_endpoint",
  "no_token",
  "no_secret",
  "no_private_path",
  "no_command_field",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS = Object.freeze([
  "raw_dataset_row_body",
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
  "raw_process_output",
  "raw_stack_trace",
  "raw_owner_confirmation_note",
  "owner_private_note",
  "raw_k_memo_text",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS = Object.freeze([
  "submission_request_id",
  "declared_file_format",
  "declared_row_count",
  "source_hash",
  "hash_algorithm",
  "schema_version",
  "dataset_name",
  "dataset_version_label",
  "dataset_split_plan",
  "audit_run_id",
  "auditor_version",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_FILE_FORMATS = Object.freeze([
  "jsonl",
  "csv",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_HASH_ALGORITHMS = Object.freeze([
  "sha256",
  "sha512",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS = Object.freeze([
  "missing_submission_request_id",
  "unsupported_file_format",
  "missing_declared_row_count",
  "missing_source_hash",
  "unsupported_hash_algorithm",
  "missing_schema_version",
  "missing_dataset_split_plan",
  "missing_audit_run_id",
  "missing_auditor_version",
  "missing_owner_confirmation_scope",
  "actual_file_path_value_rejected",
  "actual_file_content_rejected",
  "raw_row_body_rejected",
  "owner_confirmation_claim_rejected",
  "readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
]);

export function createMotionDatasetRealRowIntakeRequestPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const packetRawFields = detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS);
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const expectedRowCountRequested = Number.isSafeInteger(source.expected_row_count) && source.expected_row_count > 0;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const requestedFormat = safeMotionDatasetLabel(source.requested_file_format ?? source.requestedFileFormat, "missing");
  const requestedFormatAllowed = LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS.includes(requestedFormat);

  const blockedReasons = [
    "real_row_intake_request_packet_planning_only",
    "real_row_intake_request_packet_request_only",
    "real_row_intake_request_packet_no_real_row_ingestion",
    "real_row_intake_request_packet_non_executable",
    "real_row_intake_request_packet_not_runtime_ready",
    "real_row_intake_request_packet_not_production_ready",
    "real_row_intake_request_packet_priority1_blocked",
    "real_row_intake_request_packet_owner_confirmation_required",
    "real_row_intake_request_packet_go_no_go_preserved",
  ];
  if (rawFields.length || packetRawFields.length) blockedReasons.push("real_row_intake_request_packet_rejected_unsafe_material");
  if (realRowRequested || checkedRowCountRequested || expectedRowCountRequested) blockedReasons.push("real_row_intake_request_packet_rejected_real_row_or_count_attempt");
  if (executionRequested) blockedReasons.push("real_row_intake_request_packet_rejected_motion_execution");
  if (realCollectionRequested) blockedReasons.push("real_row_intake_request_packet_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_intake_request_packet_rejected_owner_confirmation");
  if (readinessRequested) blockedReasons.push("real_row_intake_request_packet_rejected_readiness_claim");
  if (goRequested) blockedReasons.push("real_row_intake_request_packet_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_intake_request_packet_rejected_trusted_loader_request");
  if (requestedFormat !== "missing" && !requestedFormatAllowed) blockedReasons.push("real_row_intake_request_packet_rejected_unsupported_file_format");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_intake_request_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    request_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    real_row_data_present: false,
    checked_row_count: 0,
    expected_row_count_records_rows: false,
    expected_row_count_policy_status: "future_positive_required_but_not_counted_in_preflight",
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    required_request_fields: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS],
    required_owner_supplied_file_metadata: [
      "source_file_label",
      "source_hash",
      "requested_file_format",
      "expected_row_count",
    ],
    required_audit_metadata: [
      "audit_run_id",
      "auditor_version",
      "redaction_policy_ref",
    ],
    required_redaction_policy: "safe_summary_only_no_raw_row_body",
    required_file_format_policy: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS],
    required_schema_version_policy: "request_schema_version_required_before_future_ingestion",
    required_row_count_policy: "expected_row_count_positive_in_future_but_checked_row_count_remains_zero_now",
    required_checksum_policy: "source_hash_required_before_future_ingestion",
    required_split_policy: "dataset_split_plan_required_before_future_ingestion",
    required_motion_allowlist_policy: "runtime_supported_motion_style_separate_from_experimental_motion_label",
    required_renderer_ready_policy: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    rejected_request_fields: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS.map(safeSyntheticRejectedCaseLabel),
    detected_rejected_private_material_fields: [...new Set([...rawFields, ...packetRawFields])].sort(),
    allowed_requested_file_formats: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS],
    requested_file_format_status: requestedFormat === "missing" ? "missing_until_future_owner_request" : requestedFormatAllowed ? "future_format_label_allowed_not_ingested" : "unsupported_format_rejected",
    real_row_body_accepted: false,
    request_packet_is_real_row_ingestion: false,
    request_packet_parses_row_bodies: false,
    request_packet_adds_files: false,
    request_packet_executes_motion: false,
    request_packet_collects_real_evidence: false,
    request_packet_claims_readiness: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "required_unconfirmed",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    row_schema_ref: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    synthetic_fixture_pack_ref: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    row_schema_preflight_status: "planning_only_preserved",
    synthetic_fixture_pack_status: "synthetic_only_preserved",
    runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_task_with_actual_row_id_backed_file_after_real_resident_evidence_and_go_no_go_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      request_only_no_real_rows: true,
      planning_only_no_real_rows: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row intake request packet summary");
  return summary;
}

export function createMotionDatasetRealRowIntakeDryRunValidatorSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const rejectedRequestFields = detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS);
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true || source.actual_data_validation_started === true || source.row_pass_fail_over_real_data === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const requestedFormat = safeMotionDatasetLabel(source.requested_file_format ?? source.requestedFileFormat, "missing");
  const requestedFormatAllowed = LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS.includes(requestedFormat);

  const blockedReasons = [
    "real_row_intake_dry_run_validator_planning_only",
    "real_row_intake_dry_run_validator_dry_run_only",
    "real_row_intake_dry_run_validator_no_real_row_ingestion",
    "real_row_intake_dry_run_validator_non_executable",
    "real_row_intake_dry_run_validator_not_runtime_ready",
    "real_row_intake_dry_run_validator_not_production_ready",
    "real_row_intake_dry_run_validator_priority1_blocked",
    "real_row_intake_dry_run_validator_owner_confirmation_required",
    "real_row_intake_dry_run_validator_go_no_go_preserved",
  ];
  if (rawFields.length || rejectedRequestFields.length) blockedReasons.push("real_row_intake_dry_run_validator_rejected_unsafe_material");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_real_row_or_count_attempt");
  if (executionRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_motion_execution");
  if (realCollectionRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_owner_confirmation");
  if (readinessRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_readiness_claim");
  if (goRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_trusted_loader_request");
  if (requestedFormat !== "missing" && !requestedFormatAllowed) blockedReasons.push("real_row_intake_dry_run_validator_rejected_unsupported_file_format");

  const acceptedCases = filterSyntheticFixtureCases(
    source.accepted_request_fixture_cases,
    LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_ACCEPTED_REQUEST_FIXTURE_CASES,
  );
  const rejectedCases = filterSyntheticFixtureCases(
    source.rejected_request_fixture_cases,
    LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES,
  );

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_intake_dry_run_validator_status: "planning_only_blocked",
    planning_only_boundary: true,
    dry_run_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    real_row_data_present: false,
    checked_row_count: 0,
    dry_run_validation_candidate: false,
    motion_dataset_executable: false,
    accepted_request_fixture_cases: acceptedCases,
    rejected_request_fixture_cases: rejectedCases.map(safeSyntheticRejectedCaseLabel),
    request_packet_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
    row_schema_ref_required: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    synthetic_fixture_pack_ref_required: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    request_metadata_validation_only: true,
    real_row_body_read: false,
    actual_data_validation_started: false,
    row_pass_fail_over_real_data: false,
    request_packet_status: "planning_only_preserved",
    row_schema_preflight_status: "planning_only_preserved",
    synthetic_fixture_pack_status: "synthetic_only_preserved",
    allowed_requested_file_formats: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS],
    requested_file_format_status: requestedFormat === "missing" ? "missing_until_future_owner_request" : requestedFormatAllowed ? "future_format_label_allowed_not_ingested" : "unsupported_format_rejected",
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_task_after_request_packet_review_and_go_no_go_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      dry_run_only_no_real_rows: true,
      planning_only_no_real_rows: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row intake dry run validator summary");
  return summary;
}

export function createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const rejectedFields = detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS);
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const declaredRowCountRequested = Number.isSafeInteger(source.declared_row_count) && source.declared_row_count > 0;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined || source.actual_file_content !== undefined;
  const fileReadRequested = source.actual_file_path_value !== undefined || source.file_content_read === true || source.row_body_read === true;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true || source.actual_data_validation_started === true || source.row_pass_fail_over_real_data === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const requestedFormat = safeMotionDatasetLabel(source.file_format ?? source.requested_file_format ?? source.requestedFileFormat, "missing");
  const requestedFormatAllowed = LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS.includes(requestedFormat);

  const blockedReasons = [
    "real_row_intake_quarantine_envelope_planning_only",
    "real_row_intake_quarantine_envelope_quarantine_only",
    "real_row_intake_quarantine_envelope_metadata_only",
    "real_row_intake_quarantine_envelope_no_real_row_ingestion",
    "real_row_intake_quarantine_envelope_no_row_body_read",
    "real_row_intake_quarantine_envelope_non_executable",
    "real_row_intake_quarantine_envelope_not_runtime_ready",
    "real_row_intake_quarantine_envelope_not_production_ready",
    "real_row_intake_quarantine_envelope_priority1_blocked",
    "real_row_intake_quarantine_envelope_owner_confirmation_required",
    "real_row_intake_quarantine_envelope_go_no_go_preserved",
  ];
  if (rawFields.length || rejectedFields.length) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_unsafe_material");
  if (realRowRequested || checkedRowCountRequested || declaredRowCountRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_real_row_or_count_attempt");
  if (fileReadRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_file_read_attempt");
  if (executionRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_motion_execution");
  if (realCollectionRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_owner_confirmation");
  if (readinessRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_readiness_claim");
  if (goRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_trusted_loader_request");
  if (requestedFormat !== "missing" && !requestedFormatAllowed) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_unsupported_file_format");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_intake_quarantine_envelope_status: "planning_only_blocked",
    planning_only_boundary: true,
    quarantine_only_boundary: true,
    metadata_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    real_row_data_present: false,
    checked_row_count: 0,
    quarantine_candidate_status: "pending_metadata_only",
    quarantine_file_ref_status: "missing_or_pending",
    quarantine_source_hash_status: "missing_or_pending",
    quarantine_declared_row_count_status: "missing_or_pending_not_counted",
    quarantine_schema_version_status: "missing_or_pending",
    quarantine_split_plan_status: "missing_or_pending",
    quarantine_owner_confirmation_required: true,
    quarantine_owner_confirmation_confirmed: false,
    quarantine_audit_metadata_status: "missing_or_pending",
    quarantine_redaction_policy_status: "missing_or_pending",
    required_quarantine_metadata: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA],
    allowed_file_format_labels: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS],
    quarantine_rejected_fields: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS.map(safeSyntheticRejectedCaseLabel),
    detected_rejected_private_material_fields: [...new Set([...rawFields, ...rejectedFields])].sort(),
    requested_file_format_status: requestedFormat === "missing" ? "missing_until_future_owner_request" : requestedFormatAllowed ? "future_format_label_allowed_not_ingested" : "unsupported_format_rejected",
    declared_row_count_records_rows: false,
    file_content_accepted: false,
    row_body_read: false,
    request_packet_status: "planning_only_preserved",
    dry_run_validator_status: "planning_only_preserved",
    row_schema_preflight_status: "planning_only_preserved",
    synthetic_fixture_pack_status: "synthetic_only_preserved",
    request_packet_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
    dry_run_validator_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
    row_schema_ref_required: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    synthetic_fixture_pack_ref_required: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "required_unconfirmed",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_review_of_quarantine_metadata_before_separate_actual_data_ingestion_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      quarantine_only_no_real_rows: true,
      metadata_only_no_real_rows: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row intake quarantine envelope summary");
  return summary;
}

export function createMotionDatasetOwnerRowDataSubmissionPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const actualContentRequested = source.actual_row_content_accepted === true || source.raw_dataset_row_body !== undefined || source.actual_file_content !== undefined;
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "owner_row_data_submission_packet_planning_only",
    "owner_row_data_submission_packet_no_actual_row_content",
    "owner_row_data_submission_packet_no_real_row_ingestion",
    "owner_row_data_submission_packet_no_row_body_read",
    "owner_row_data_submission_packet_owner_confirmation_required",
    "owner_row_data_submission_packet_priority1_blocked",
    "owner_row_data_submission_packet_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("owner_row_data_submission_packet_rejected_unsafe_material");
  if (actualContentRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_actual_row_content");
  if (actualIngestionRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_actual_ingestion_request");
  if (ownerConfirmationRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_owner_row_data_submission_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    owner_submission_packet_only_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_readiness_boundary: true,
    owner_submission_packet_only: true,
    actual_row_content_accepted: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    required_owner_submission_items: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_ITEMS],
    required_owner_confirmation_scopes: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_CONFIRMATION_SCOPES],
    required_file_shape: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_FILE_SHAPE.map((field) => safeOwnerRowSubmissionFileShapeLabel(field))],
    required_metadata_shape: [
      "declared_file_format",
      "declared_row_count",
      "source_hash",
      "schema_version",
      "dataset_split_plan",
      "audit_run_id",
      "auditor_version",
    ],
    rejected_submission_field_categories: [...new Set(LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS.map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field)))],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "owner_may_prepare_metadata_only_future_submission_without_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      owner_submission_packet_only: true,
      no_actual_row_content: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_dataset_row_body_public: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset owner row data submission packet summary");
  return summary;
}

export function createMotionDatasetOwnerRowDataMetadataValidatorStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      ...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
      "actual_file_path_value",
      "actual_file_content",
      "raw_jsonl_body",
      "raw_csv_body",
      "raw_row_body",
      "raw_dataset_row_body",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const fileReadRequested = source.actual_file_read === true || source.file_content_read === true || source.file_path_read === true;
  const hashCalculationRequested = source.actual_hash_calculated === true || source.hash_calculated === true || source.source_hash_calculated === true;
  const fileReferenceAcceptedRequested = source.actual_file_reference_accepted === true || source.actual_file_path_accepted === true || source.actual_file_path_value !== undefined;
  const fileContentAcceptedRequested = source.actual_file_content_accepted === true || source.actual_file_content !== undefined || source.raw_jsonl_body !== undefined || source.raw_csv_body !== undefined;
  const actualContentRequested = source.actual_row_content_accepted === true || source.raw_dataset_row_body !== undefined || source.raw_row_body !== undefined || source.dataset_row !== undefined || source.row !== undefined;
  const submissionReceivedRequested = source.owner_submission_received === true || source.submission_received === true;
  const submissionAcceptedRequested = source.owner_submission_accepted === true || source.submission_accepted === true || source.owner_submission_status === "accepted";
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "metadata_validator_stub_planning_only",
    "metadata_validator_stub_metadata_only",
    "metadata_validator_stub_no_submission_accepted",
    "metadata_validator_stub_no_actual_file_read",
    "metadata_validator_stub_no_actual_hash_calculation",
    "metadata_validator_stub_no_actual_row_content",
    "metadata_validator_stub_no_real_row_ingestion",
    "metadata_validator_stub_no_row_body_read",
    "metadata_validator_stub_owner_confirmation_required",
    "metadata_validator_stub_priority1_blocked",
    "metadata_validator_stub_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("metadata_validator_stub_rejected_unsafe_material");
  if (submissionReceivedRequested) blockedReasons.push("metadata_validator_stub_rejected_submission_received");
  if (submissionAcceptedRequested) blockedReasons.push("metadata_validator_stub_rejected_submission_acceptance");
  if (fileReadRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_file_read");
  if (hashCalculationRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_hash_calculation");
  if (fileReferenceAcceptedRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_file_reference");
  if (fileContentAcceptedRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_file_content");
  if (actualContentRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_row_content");
  if (actualIngestionRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_ingestion_request");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("metadata_validator_stub_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("metadata_validator_stub_rejected_row_body_read");
  if (motionExecutionRequested) blockedReasons.push("metadata_validator_stub_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("metadata_validator_stub_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("metadata_validator_stub_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("metadata_validator_stub_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("metadata_validator_stub_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("metadata_validator_stub_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA,
    safe_summary_only: true,
    motion_dataset_owner_row_data_metadata_validator_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    metadata_validator_stub_only_boundary: true,
    metadata_only_boundary: true,
    no_submission_accepted_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_hash_calculation_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    metadata_validator_stub_only: true,
    metadata_validation_candidate: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_file_read: false,
    actual_hash_calculated: false,
    actual_file_reference_accepted: false,
    actual_file_content_accepted: false,
    actual_row_content_accepted: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    row_body_read: false,
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    required_metadata_labels: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS],
    allowed_file_format_labels: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_FILE_FORMATS],
    allowed_hash_algorithm_labels: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_HASH_ALGORITHMS],
    required_validator_rejection_reasons: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_metadata_labels_only_without_file_or_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      metadata_validator_stub_only: true,
      metadata_only: true,
      no_submission_accepted: true,
      no_actual_file_read: true,
      no_actual_hash_calculation: true,
      no_actual_file_reference_accepted: true,
      no_actual_file_content_accepted: true,
      no_actual_row_content: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_dataset_row_body_public: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset owner row data metadata validator stub summary");
  return summary;
}

export function safeOwnerRowSubmissionRejectedFieldLabel(field) {
  const label = String(field ?? "");
  if (!label) return "";
  if (label.includes("dataset_row") || label.includes("row_body") || label.includes("row")) return "dataset_row_material";
  if (label.includes("file_path") || label.includes("local_path") || label.includes("path")) return "local_path_material";
  if (label.includes("file_content") || label.includes("content")) return "file_content_material";
  if (label.includes("cue")) return "cue_material";
  if (label.includes("renderer")) return "renderer_material";
  if (label.includes("model")) return "model_location_material";
  if (label.includes("motion")) return "motion_location_material";
  if (label.includes("endpoint")) return "network_location_material";
  if (label.includes("token") || label.includes("secret")) return "access_material";
  if (label.includes("command")) return "command_material";
  if (label.includes("note") || label.includes("memo")) return "owner_note_material";
  if (label.includes("process") || label.includes("stack")) return "diagnostic_material";
  if (label.includes("commit")) return "commitment_material";
  return "unsafe_material";
}

export function safeOwnerRowSubmissionFileShapeLabel(field) {
  const label = String(field ?? "");
  if (!label) return "";
  if (label === "one_row_id_per_record") return "one_row_id_per_record";
  if (label === "dataset_split_per_record") return "dataset_split_per_record";
  if (label === "motion_label_per_record") return "motion_label_per_record";
  if (label === "audit_metadata_per_record") return "audit_metadata_per_record";
  if (label.includes("cue")) return "cue_material_excluded";
  if (label.includes("renderer")) return "renderer_material_excluded";
  if (label.includes("endpoint")) return "network_location_excluded";
  if (label.includes("token") || label.includes("secret")) return "access_material_excluded";
  if (label.includes("path")) return "local_location_excluded";
  if (label.includes("command")) return "command_material_excluded";
  return "unsafe_material_excluded";
}

export function detectedRejectedRequestFields(source, rejectedFields) {
  if (!source || typeof source !== "object") return [];
  const rejected = new Set(rejectedFields);
  const detected = [];
  const stack = [source];
  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = String(key).replace(/[A-Z]/gu, (ch) => "_" + ch.toLowerCase()).toLowerCase();
      if (rejected.has(normalizedKey) || rejected.has(key)) detected.push(privateMaterialCategory(normalizedKey));
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return [...new Set(detected.filter(Boolean))].sort();
}
