import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";
import {
  LIVE2D_EXPERIMENTAL_MOTION_LABELS,
  LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES,
} from "./sharedMotionCatalog.js";
import {
  detectedMotionDatasetRawFields,
  safeSyntheticRejectedCaseLabel,
} from "./motionDatasetPlanningSafety.js";
import {
  LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
  LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
} from "./motionDatasetPlanningCore.js";
import {
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
  detectedRejectedRequestFields,
  safeOwnerRowSubmissionRejectedFieldLabel,
} from "./motionDatasetOwnerGates.js";

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA = "iris_live2d_motion_dataset_real_row_intake_owner_handoff_packet_v1";

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA = "iris_live2d_motion_dataset_owner_row_data_submission_receipt_stub_v1";

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_dataset_owner_row_data_submission_rejection_fixture_pack_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_REVIEW_SECTIONS = Object.freeze([
  "request_packet",
  "dry_run_validator",
  "quarantine_envelope",
  "row_schema_preflight",
  "synthetic_fixture_pack",
  "runtime_supported_motion_styles",
  "experimental_motion_labels",
  "renderer_ready_requirements",
  "redaction_policy",
  "audit_metadata",
  "file_format_policy",
  "declared_row_count_policy",
  "unsupported_motion_policy",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_CONFIRMATION_SCOPES = Object.freeze([
  "motion_dataset_real_row_intake",
  "row_file_metadata_review",
  "redaction_policy_review",
  "unsupported_motion_policy_review",
  "no_runtime_readiness_claim_review",
  "no_motion_execution_review",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_METADATA_LABELS = Object.freeze([
  "submission_request_id",
  "submission_expected_file_format",
  "submission_expected_source_hash",
  "submission_expected_declared_row_count",
  "submission_expected_schema_version",
  "submission_expected_dataset_split_plan",
  "submission_expected_audit_run_id",
  "submission_expected_owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_FUTURE_REFS = Object.freeze([
  "owner_row_data_submission_packet_ref",
  "row_file_checksum_preflight_manifest_ref",
  "row_intake_quarantine_envelope_ref",
  "owner_confirmation_ref",
  "future_owner_confirmed_actual_data_task_ref",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_ACCEPTED_CASES = Object.freeze([
  "safe_metadata_missing_source_hash_rejection",
  "safe_metadata_unsupported_format_rejection",
  "safe_metadata_missing_owner_scope_rejection",
  "safe_redacted_raw_field_rejection",
  "safe_no_data_present_blocked_fixture",
  "safe_checksum_preflight_missing_file_blocked_fixture",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_REJECTED_ATTEMPT_CASES = Object.freeze([
  "actual_file_path_value_rejected",
  "actual_file_content_rejected",
  "raw_jsonl_body_rejected",
  "raw_csv_body_rejected",
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
  "game_input_rejected",
  "os_command_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "raw_process_output_rejected",
  "raw_stack_trace_rejected",
  "raw_owner_confirmation_note_rejected",
  "owner_private_note_rejected",
  "owner_confirmation_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
  "unsupported_motion_runtime_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_ATTEMPT_CASES = Object.freeze([
  "actual_file_reference_value_rejected",
  "actual_file_content_rejected",
  "jsonl_body_material_rejected",
  "csv_body_material_rejected",
  "dataset_row_body_material_rejected",
  "cue_material_rejected",
  "renderer_material_rejected",
  "model_reference_material_rejected",
  "motion_reference_material_rejected",
  "network_value_rejected",
  "credential_value_rejected",
  "private_local_reference_rejected",
  "world_operation_request_rejected",
  "obs_operation_request_rejected",
  "game_interaction_request_rejected",
  "os_operation_request_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "process_output_material_rejected",
  "stack_trace_material_rejected",
  "owner_confirmation_note_rejected",
  "owner_private_note_rejected",
  "owner_confirmation_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
  "unsupported_motion_runtime_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS = Object.freeze([
  "raw_dataset_row_body",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_model_path",
  "raw_motion_path",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "owner_private_note",
  "raw_owner_confirmation_note",
  "actual_file_path_value",
  "actual_file_content",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
]);

export function createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const rejectedFields = detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS);
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined || source.actual_file_content !== undefined;
  const fileReadRequested = source.actual_file_path_value !== undefined || source.file_content_read === true || source.row_body_read === true;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true || source.actual_data_validation_started === true || source.row_pass_fail_over_real_data === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed" || source.approve_ingestion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;

  const blockedReasons = [
    "real_row_intake_owner_handoff_packet_planning_only",
    "real_row_intake_owner_handoff_packet_handoff_only",
    "real_row_intake_owner_handoff_packet_not_owner_confirmation",
    "real_row_intake_owner_handoff_packet_no_real_row_ingestion",
    "real_row_intake_owner_handoff_packet_no_row_body_read",
    "real_row_intake_owner_handoff_packet_non_executable",
    "real_row_intake_owner_handoff_packet_not_runtime_ready",
    "real_row_intake_owner_handoff_packet_not_production_ready",
    "real_row_intake_owner_handoff_packet_priority1_blocked",
    "real_row_intake_owner_handoff_packet_owner_confirmation_required",
    "real_row_intake_owner_handoff_packet_go_no_go_preserved",
  ];
  if (rawFields.length || rejectedFields.length) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_unsafe_material");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_real_row_or_count_attempt");
  if (fileReadRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_file_read_attempt");
  if (executionRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_motion_execution");
  if (realCollectionRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_owner_confirmation");
  if (readinessRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_readiness_claim");
  if (goRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_intake_owner_handoff_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    handoff_only_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    required_owner_review_sections: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_REVIEW_SECTIONS],
    required_owner_confirmation_scopes: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_CONFIRMATION_SCOPES],
    required_pre_ingestion_evidence_refs: [
      "fresh_real_resident_evidence_required",
      "priority1_real_evidence_required",
      "go_no_go_review_required",
    ],
    required_quarantine_refs: [
      LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
    ],
    required_redaction_policy_refs: [
      "safe_summary_only_no_row_body_no_private_material",
    ],
    required_audit_refs: [
      "audit_run_id",
      "auditor_version",
      "source_hash",
      "declared_row_count",
    ],
    owner_confirmation_required: true,
    owner_confirmation_confirmed: false,
    owner_confirmation_created: false,
    owner_confirmation_status: "pending",
    real_row_data_present: false,
    checked_row_count: 0,
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
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_handoff_is_owner_confirmation: false,
    owner_handoff_approves_ingestion: false,
    owner_handoff_reads_rows: false,
    owner_handoff_ingests_rows: false,
    row_body_read: false,
    file_content_accepted: false,
    request_packet_status: "planning_only_preserved",
    dry_run_validator_status: "planning_only_preserved",
    quarantine_envelope_status: "planning_only_preserved",
    row_schema_preflight_status: "planning_only_preserved",
    synthetic_fixture_pack_status: "synthetic_only_preserved",
    request_packet_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
    dry_run_validator_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
    quarantine_envelope_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
    row_schema_ref_required: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    synthetic_fixture_pack_ref_required: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejected_owner_handoff_fields: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS.map(safeSyntheticRejectedCaseLabel),
    detected_rejected_private_material_fields: [...new Set([...rawFields, ...rejectedFields])].sort(),
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_review_then_separate_owner_confirmed_actual_data_ingestion_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      handoff_only_no_confirmation: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row intake owner handoff packet summary");
  return summary;
}

export function createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const submissionReceivedRequested = source.owner_submission_received === true || source.submission_received === true;
  const submissionAcceptedRequested = source.owner_submission_accepted === true || source.submission_accepted === true || source.owner_submission_status === "accepted";
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
    "owner_row_data_submission_receipt_stub_planning_only",
    "owner_row_data_submission_receipt_stub_no_submission_accepted",
    "owner_row_data_submission_receipt_stub_no_actual_row_content",
    "owner_row_data_submission_receipt_stub_no_real_row_ingestion",
    "owner_row_data_submission_receipt_stub_no_row_body_read",
    "owner_row_data_submission_receipt_stub_owner_confirmation_required",
    "owner_row_data_submission_receipt_stub_priority1_blocked",
    "owner_row_data_submission_receipt_stub_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_unsafe_material");
  if (submissionReceivedRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_submission_received");
  if (submissionAcceptedRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_submission_acceptance");
  if (actualContentRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_actual_row_content");
  if (actualIngestionRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_actual_ingestion_request");
  if (ownerConfirmationRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA,
    safe_summary_only: true,
    motion_dataset_owner_row_data_submission_receipt_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    receipt_stub_only_boundary: true,
    no_owner_submission_accepted_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_readiness_boundary: true,
    receipt_stub_only: true,
    owner_submission_received: false,
    owner_submission_accepted: false,
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
    owner_confirmation_status: "schema_only",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    required_receipt_metadata_labels: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_METADATA_LABELS],
    required_future_submission_refs: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_FUTURE_REFS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_metadata_labels_only_for_future_owner_confirmed_submission_without_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      receipt_stub_only: true,
      no_owner_submission_accepted: true,
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
  assertSafePublicObject(summary, "motion dataset owner row data submission receipt stub summary");
  return summary;
}

export function createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      ...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
      "actual_file_path_value",
      "actual_file_content",
      "raw_jsonl_body",
      "raw_csv_body",
      "raw_dataset_row_body",
      "raw_row_body",
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
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const submissionReceivedRequested = source.owner_submission_received === true || source.submission_received === true;
  const submissionAcceptedRequested = source.owner_submission_accepted === true || source.submission_accepted === true || source.owner_submission_status === "accepted";
  const fileReadRequested = source.actual_file_read === true || source.file_content_read === true || source.file_path_read === true;
  const fileReferenceAcceptedRequested = source.actual_file_reference_accepted === true || source.actual_file_path_accepted === true || source.actual_file_path_value !== undefined;
  const fileContentAcceptedRequested = source.actual_file_content_accepted === true || source.actual_file_content !== undefined || source.raw_jsonl_body !== undefined || source.raw_csv_body !== undefined;
  const actualContentRequested = source.actual_row_content_accepted === true || source.raw_dataset_row_body !== undefined || source.raw_row_body !== undefined || source.dataset_row !== undefined || source.row !== undefined;
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true || source.unsupported_motion_runtime_claim === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "submission_rejection_fixture_pack_planning_only",
    "submission_rejection_fixture_pack_synthetic_only",
    "submission_rejection_fixture_pack_rejection_fixture_only",
    "submission_rejection_fixture_pack_no_submission_accepted",
    "submission_rejection_fixture_pack_no_actual_file_read",
    "submission_rejection_fixture_pack_no_actual_row_content",
    "submission_rejection_fixture_pack_no_real_row_ingestion",
    "submission_rejection_fixture_pack_no_row_body_read",
    "submission_rejection_fixture_pack_owner_confirmation_required",
    "submission_rejection_fixture_pack_priority1_blocked",
    "submission_rejection_fixture_pack_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("submission_rejection_fixture_pack_rejected_unsafe_material");
  if (submissionReceivedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_submission_received");
  if (submissionAcceptedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_submission_acceptance");
  if (fileReadRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_file_read");
  if (fileReferenceAcceptedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_file_reference");
  if (fileContentAcceptedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_file_content");
  if (actualContentRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_row_content");
  if (actualIngestionRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_ingestion_request");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_row_body_read");
  if (motionExecutionRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA,
    safe_summary_only: true,
    motion_dataset_owner_row_data_submission_rejection_fixture_pack_status: "planning_only_blocked",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    rejection_fixture_pack_only_boundary: true,
    no_submission_accepted_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    synthetic_only: true,
    rejection_fixture_pack_only: true,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_file_read: false,
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
    accepted_safe_rejection_fixture_cases: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_ACCEPTED_CASES],
    rejected_submission_attempt_cases: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_ATTEMPT_CASES],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_synthetic_rejection_fixtures_without_file_or_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      synthetic_only: true,
      rejection_fixture_pack_only: true,
      no_submission_accepted: true,
      no_actual_file_read: true,
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
  assertSafePublicObject(summary, "motion dataset owner row data submission rejection fixture pack summary");
  return summary;
}
