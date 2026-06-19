import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";
import { detectedMotionDatasetRawFields } from "./motionDatasetPlanningSafety.js";
import {
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
  detectedRejectedRequestFields,
  safeOwnerRowSubmissionRejectedFieldLabel,
} from "./motionDatasetOwnerGates.js";

// Checksum preflight planning summaries are metadata-only and non-executable.
// They never read actual files, accept file path values, or calculate product hashes.
export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_MANIFEST_SCHEMA = "iris_live2d_motion_dataset_row_file_checksum_preflight_manifest_v1";

export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_HASH_METADATA_LABELS = Object.freeze([
  "source_hash",
  "hash_algorithm",
  "hash_scope",
  "declared_row_count",
  "schema_version",
  "file_format",
  "dataset_name",
  "dataset_version_label",
  "audit_run_id",
  "auditor_version",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS = Object.freeze([
  "sha256",
  "sha512",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_FILE_IDENTITY_LABELS = Object.freeze([
  "dataset_name",
  "dataset_version_label",
  "declared_row_count",
  "schema_version",
  "file_format",
  "hash_scope",
  "source_hash",
  "audit_run_id",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_OWNER_CONFIRMATION_REFS = Object.freeze([
  "owner_row_data_submission_receipt_stub_ref",
  "owner_confirmation_ref",
  "future_owner_confirmed_actual_data_task_ref",
]);

















export function createMotionDatasetRowFileChecksumPreflightManifestSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      ...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
      "source_hash",
      "actual_source_hash",
      "hash_value",
      "raw_hash_input",
      "actual_file_path",
      "actual_file_path_value",
      "dataset_file_path",
      "actual_file_content",
      "raw_file_body",
      "file_body",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const fileReadRequested = source.actual_file_read === true || source.file_content_read === true || source.file_path_read === true;
  const hashCalculationRequested = source.actual_hash_calculated === true || source.hash_calculated === true || source.source_hash_calculated === true;
  const filePathAcceptedRequested = source.actual_file_reference_accepted === true || source.actual_file_path_value !== undefined || source.dataset_file_path !== undefined || source.actual_file_path !== undefined;
  const fileContentAcceptedRequested = source.actual_file_content_accepted === true || source.actual_file_content !== undefined || source.raw_file_body !== undefined || source.file_body !== undefined;
  const hashValueRequested = source.source_hash !== undefined || source.actual_source_hash !== undefined || source.hash_value !== undefined || source.raw_hash_input !== undefined;
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.raw_dataset_row_body !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "row_file_checksum_preflight_manifest_planning_only",
    "row_file_checksum_preflight_manifest_checksum_manifest_only",
    "row_file_checksum_preflight_manifest_no_actual_file_read",
    "row_file_checksum_preflight_manifest_no_actual_hash_calculation",
    "row_file_checksum_preflight_manifest_no_real_row_ingestion",
    "row_file_checksum_preflight_manifest_no_row_body_read",
    "row_file_checksum_preflight_manifest_owner_confirmation_required",
    "row_file_checksum_preflight_manifest_priority1_blocked",
    "row_file_checksum_preflight_manifest_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_unsafe_material");
  if (fileReadRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_file_read");
  if (hashCalculationRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_hash_calculation");
  if (filePathAcceptedRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_file_reference");
  if (fileContentAcceptedRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_file_content");
  if (hashValueRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_real_hash_value");
  if (actualIngestionRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_ingestion_request");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_row_body_read");
  if (motionExecutionRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_MANIFEST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_row_file_checksum_preflight_manifest_status: "planning_only_blocked",
    planning_only_boundary: true,
    checksum_manifest_only_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_hash_calculation_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    actual_file_read: false,
    actual_hash_calculated: false,
    actual_file_reference_accepted: false,
    actual_file_content_accepted: false,
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
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    required_hash_metadata_labels: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_HASH_METADATA_LABELS],
    required_hash_algorithm_labels: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS],
    allowed_hash_algorithms: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS],
    required_file_identity_labels: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_FILE_IDENTITY_LABELS],
    required_owner_confirmation_refs: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_OWNER_CONFIRMATION_REFS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_checksum_metadata_labels_only_without_file_read_or_hash_calculation",
    boundary_policy: {
      ...createBoundaryPolicy(),
      checksum_manifest_only: true,
      no_actual_file_read: true,
      no_actual_hash_calculation: true,
      no_actual_file_reference_accepted: true,
      no_actual_file_content_accepted: true,
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
  assertSafePublicObject(summary, "motion dataset row file checksum preflight manifest summary");
  return summary;
}







export function createMotionDatasetPlanningOnlyGateSummary({ schema, statusKey, status, boundaries = {}, flags = {}, arrays = {}, blockedReasons = [], safeNextAction, context }, input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.owner_confirmation_created ||
      source.owner_confirmation_confirmed ||
      source.actual_data_preauthorized ||
      source.actual_data_task_started ||
      source.actual_data_accepted ||
      source.owner_submission_received ||
      source.owner_submission_accepted ||
      source.quarantine_completed ||
      source.redaction_scan_executed ||
      source.audit_execution_started ||
      source.real_ingestion_audit_event_created ||
      source.rollback_ready ||
      source.external_action_performed ||
      source.parser_dry_run_executed ||
      source.row_body_parser_enabled ||
      source.row_body_parser_executed ||
      source.actual_file_read ||
      source.actual_hash_calculated ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      Number(source.checked_row_count ?? 0) > 0 ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.blocker_resolved ||
      source.go_candidate ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const summary = {
    schema,
    [statusKey]: status,
    planning_only_boundary: true,
    ...boundaries,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_preauthorized: false,
    actual_data_task_started: false,
    actual_data_accepted: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    quarantine_completed: false,
    redaction_scan_executed: false,
    audit_execution_started: false,
    real_ingestion_audit_event_created: false,
    rollback_ready: false,
    external_action_performed: false,
    parser_dry_run_executed: false,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    actual_file_read: false,
    actual_hash_calculated: false,
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
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    ...flags,
    ...arrays,
    blocked_reasons: [...new Set([...blockedReasons, ...(rejectedAttempt ? [statusKey.replace(/_status$/, "_rejected_state_promotion")] : [])])],
    safe_next_action: safeNextAction,
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_actual_data_preauthorized: true,
      no_actual_data_task_started: true,
      no_actual_data_accepted: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, context);
  return summary;
}
