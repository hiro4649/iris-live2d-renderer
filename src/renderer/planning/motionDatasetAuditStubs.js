import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";
import {
  LIVE2D_EXPERIMENTAL_MOTION_LABELS,
  LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES,
} from "./sharedMotionCatalog.js";
import {
  detectedMotionDatasetRawFields,
  filterSyntheticFixtureCases,
  safeSyntheticRejectedCaseLabel,
} from "./motionDatasetPlanningSafety.js";
import {
  LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_UX_AUDIT_AXES,
} from "./motionDatasetPlanningCore.js";
import { detectedRejectedRequestFields } from "./motionDatasetOwnerGates.js";

// Audit-gate planning summaries are metadata-only and non-executable.
// They must not read row bodies, read files, calculate hashes, or run audits.

export const LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA = "iris_live2d_motion_dataset_real_row_audit_manifest_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_dataset_real_row_redaction_scanner_fixture_pack_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA = "iris_live2d_motion_dataset_real_row_evidence_link_manifest_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS = Object.freeze([
  "audit_run_id",
  "auditor_version",
  "audit_started_at_label",
  "audit_completed_at_label",
  "source_hash",
  "source_file_label",
  "dataset_name",
  "dataset_version_label",
  "schema_version",
  "expected_row_count",
  "checked_row_count",
  "unchecked_range",
  "issue_row_count",
  "decision_summary",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS = Object.freeze([
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
  "decision",
  "severity",
  "reason_code",
  "safe_evidence_label",
  "redaction_status",
  "renderer_ready_dependency_status",
  "ux_accessibility_status",
  "eval_contamination_status",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS = Object.freeze([
  "overall_status",
  "critical_count",
  "high_count",
  "medium_count",
  "low_count",
  "pass_count",
  "reject_count",
  "needs_review_count",
  "unchecked_count",
  "missing_coverage",
  "residual_risks",
  "owner_confirmation_required",
  "priority1_status",
  "runtime_readiness_claimed",
  "production_readiness_claimed",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES = Object.freeze([
  "safe_metadata_only_request",
  "safe_hash_only_reference",
  "safe_row_id_label",
  "safe_dataset_split_label",
  "safe_audit_run_label",
  "safe_redacted_field_marker",
  "safe_rejected_category_alias",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES = Object.freeze([
  "raw_dataset_row_body_rejected",
  "raw_cue_payload_rejected",
  "raw_renderer_payload_rejected",
  "raw_model_path_rejected",
  "raw_motion_path_rejected",
  "endpoint_value_rejected",
  "token_value_rejected",
  "secret_value_rejected",
  "private_local_path_rejected",
  "actual_file_path_value_rejected",
  "actual_file_content_rejected",
  "candidate_payload_rejected",
  "world_command_rejected",
  "obs_command_rejected",
  "game_input_rejected",
  "os_command_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "raw_process_output_rejected",
  "raw_stack_trace_rejected",
  "owner_private_note_rejected",
  "raw_owner_confirmation_note_rejected",
  "raw_k_memo_text_rejected",
  "renderer_ready_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS = Object.freeze([
  "row_schema_preflight_ref",
  "synthetic_fixture_pack_ref",
  "request_packet_ref",
  "dry_run_validator_ref",
  "quarantine_envelope_ref",
  "owner_handoff_packet_ref",
  "audit_manifest_ref",
  "redaction_scanner_fixture_ref",
  "future_real_row_file_ref",
  "future_real_row_audit_ref",
  "future_real_redaction_scan_ref",
  "future_owner_confirmation_ref",
  "future_fresh_resident_evidence_ref",
  "future_go_nogo_review_ref",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES = Object.freeze([
  "planning_schema_ref",
  "synthetic_fixture_ref",
  "metadata_only_ref",
  "owner_review_packet_ref",
  "future_real_file_ref",
  "future_real_audit_ref",
  "future_real_scan_ref",
  "future_owner_confirmation_ref",
  "future_fresh_evidence_ref",
  "future_go_nogo_ref",
]);

export function createMotionDatasetRealRowAuditManifestSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;

  const blockedReasons = [
    "real_row_audit_manifest_planning_only",
    "real_row_audit_manifest_manifest_only",
    "real_row_audit_manifest_no_real_audit_completed",
    "real_row_audit_manifest_no_real_row_ingestion",
    "real_row_audit_manifest_no_row_body_read",
    "real_row_audit_manifest_non_executable",
    "real_row_audit_manifest_priority1_blocked",
    "real_row_audit_manifest_owner_confirmation_required",
    "real_row_audit_manifest_go_no_go_preserved",
  ];
  if (rawFields.length) blockedReasons.push("real_row_audit_manifest_rejected_raw_or_private_field");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("real_row_audit_manifest_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("real_row_audit_manifest_rejected_row_body_or_file_read");
  if (executionRequested) blockedReasons.push("real_row_audit_manifest_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("real_row_audit_manifest_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_audit_manifest_rejected_owner_confirmation");
  if (goRequested) blockedReasons.push("real_row_audit_manifest_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_audit_manifest_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_audit_manifest_status: "planning_only_blocked",
    planning_only_boundary: true,
    audit_manifest_only_boundary: true,
    no_real_audit_completed_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    real_row_data_present: false,
    checked_row_count: 0,
    audit_manifest_only: true,
    audit_manifest_is_actual_audit_completion: false,
    row_body_read: false,
    file_content_accepted: false,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    audit_run_metadata_required: [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS],
    row_level_audit_fields_required: [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS],
    dataset_level_summary_fields_required: [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS],
    row_uniqueness_policy_required: "row_id_unique_required_before_future_real_audit",
    source_hash_policy_required: "source_hash_required_before_future_real_audit",
    split_policy_required: "dataset_split_required_before_future_real_audit",
    renderer_ready_dependency_policy_required: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    motion_allowlist_policy_required: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    ux_accessibility_policy_required: [...LIVE2D_MOTION_DATASET_UX_AUDIT_AXES],
    redaction_policy_required: "safe_summary_only_no_row_body_no_private_material",
    priority1_boundary_policy_required: "priority1_remains_BLOCKED_until_real_resident_fresh_evidence",
    eval_contamination_guard: "fixtures_routes_cues_and_sse_are_not_real_row_success_evidence",
    detected_rejected_private_material_fields: rawFields,
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_future_owner_confirmed_actual_row_audit_task_without_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      audit_manifest_only: true,
      no_real_audit_completion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row audit manifest summary");
  return summary;
}

export function createMotionDatasetRealRowRedactionScannerFixturePackSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES.map((label) => label.replace(/_rejected$/u, ""))),
  ];
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const acceptedCases = filterSyntheticFixtureCases(source.accepted_redaction_fixture_cases, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES);
  const rejectedCases = filterSyntheticFixtureCases(source.rejected_redaction_fixture_cases, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES);
  const rejectionReasons = [
    "redaction_scanner_fixture_pack_synthetic_only",
    "redaction_scanner_fixture_pack_no_real_row_ingestion",
    "redaction_scanner_fixture_pack_no_row_body_read",
    "redaction_scanner_fixture_pack_non_executable",
    "redaction_scanner_fixture_pack_priority1_blocked",
    "redaction_scanner_fixture_pack_owner_confirmation_required",
    "redaction_scanner_fixture_pack_go_no_go_preserved",
  ];
  if (rawFields.length) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_raw_or_private_field");
  if (readinessRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_readiness_claim");
  if (ownerConfirmationRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_owner_confirmation");
  if (priorityResolvedRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_priority1_resolution");
  if (motionExecutionRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_motion_execution");
  if (realRowRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_real_row_data");
  if (rowBodyReadRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_row_body_read");
  if (goRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_redaction_scanner_fixture_pack_status: "planning_only_blocked",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    redaction_scanner_fixture_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    synthetic_only: true,
    redaction_scanner_fixture_only: true,
    accepted_redaction_fixtures_are_real_evidence: false,
    accepted_redaction_fixtures_are_real_safety_proof: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    file_content_accepted: false,
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    redaction_policy_ref_required: true,
    audit_manifest_ref_required: true,
    accepted_redaction_fixture_cases: acceptedCases,
    rejected_redaction_fixture_cases: rejectedCases.map(safeSyntheticRejectedCaseLabel),
    rejected_redaction_fixture_public_labels: rejectedCases.map(safeSyntheticRejectedCaseLabel),
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    rejection_reasons: [...new Set(rejectionReasons)],
    safe_next_action: "prepare_future_owner_confirmed_real_redaction_scan_without_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      synthetic_fixture_only: true,
      no_real_row_scan: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row redaction scanner fixture pack summary");
  return summary;
}

export function createMotionDatasetRealRowEvidenceLinkManifestSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "future_real_row_file_ref",
      "future_real_row_audit_ref",
      "future_real_redaction_scan_ref",
      "future_owner_confirmation_ref",
      "future_fresh_resident_evidence_ref",
      "owner_private_note",
      "raw_owner_confirmation_note",
      "actual_file_path_value",
      "actual_file_content",
      "raw_dataset_row_body",
    ]),
  ];
  const realEvidenceRequested = source.real_evidence_present === true || source.future_fresh_resident_evidence_status === "present" || source.future_real_row_audit_status === "complete";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const blockedReasons = [
    "evidence_link_manifest_planning_only",
    "evidence_link_manifest_not_real_evidence",
    "evidence_link_manifest_no_real_row_ingestion",
    "evidence_link_manifest_no_row_body_read",
    "evidence_link_manifest_priority1_blocked",
    "evidence_link_manifest_owner_confirmation_required",
    "evidence_link_manifest_same_head_remote_required",
  ];
  if (rawFields.length) blockedReasons.push("evidence_link_manifest_rejected_raw_or_private_ref");
  if (realEvidenceRequested) blockedReasons.push("evidence_link_manifest_rejected_real_evidence_claim");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("evidence_link_manifest_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("evidence_link_manifest_rejected_row_body_or_file_read");
  if (readinessRequested) blockedReasons.push("evidence_link_manifest_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("evidence_link_manifest_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("evidence_link_manifest_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("evidence_link_manifest_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("evidence_link_manifest_rejected_trusted_loader_request");
  if (motionExecutionRequested) blockedReasons.push("evidence_link_manifest_rejected_motion_execution");

  const linkRefStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS.map((ref) => [ref, ref.startsWith("future_") ? "pending_label_only" : "planning_ref_required"]));
  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_evidence_link_manifest_status: "planning_only_blocked",
    planning_only_boundary: true,
    evidence_link_manifest_only_boundary: true,
    no_real_evidence_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    evidence_link_manifest_is_real_evidence: false,
    evidence_link_manifest_provides_real_file: false,
    evidence_link_manifest_marks_audit_complete: false,
    future_real_reference_is_location_value: false,
    future_real_row_file_ref_status: "pending_label_only",
    future_real_row_audit_ref_status: "pending_label_only",
    future_real_redaction_scan_ref_status: "pending_label_only",
    future_owner_confirmation_ref_status: "pending_label_only_unconfirmed",
    future_fresh_resident_evidence_ref_status: "pending_label_only_not_evidence",
    future_go_nogo_review_ref_status: "pending_label_only_no_go",
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    file_content_accepted: false,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    evidence_precedence_policy_required: true,
    same_head_remote_policy_required: true,
    local_evidence_promoted_to_remote: false,
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    owner_confirmation_ref_required: true,
    audit_manifest_ref_required: true,
    redaction_scanner_ref_required: true,
    quarantine_envelope_ref_required: true,
    required_link_refs: [...LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS],
    required_evidence_ref_types: [...LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES],
    required_pre_ingestion_refs: [
      "row_schema_preflight_ref",
      "synthetic_fixture_pack_ref",
      "request_packet_ref",
      "dry_run_validator_ref",
      "quarantine_envelope_ref",
      "owner_handoff_packet_ref",
      "audit_manifest_ref",
      "redaction_scanner_fixture_ref",
    ],
    required_post_ingestion_refs: [
      "future_real_row_audit_ref",
      "future_real_redaction_scan_ref",
      "future_owner_confirmation_ref",
      "future_fresh_resident_evidence_ref",
      "future_go_nogo_review_ref",
    ],
    link_ref_statuses: linkRefStatuses,
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_future_owner_confirmed_actual_data_task_without_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      evidence_link_manifest_only: true,
      no_real_evidence: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row evidence link manifest summary");
  return summary;
}
