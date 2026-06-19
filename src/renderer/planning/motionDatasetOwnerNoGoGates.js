import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";
import { detectedMotionDatasetRawFields } from "./motionDatasetPlanningSafety.js";
import { LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS } from "./motionDatasetPlanningCore.js";
import {
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
  detectedRejectedRequestFields,
  safeOwnerRowSubmissionRejectedFieldLabel,
} from "./motionDatasetOwnerGates.js";
import { LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES } from "./motionDatasetAuditStubs.js";

// Owner no-go planning summaries remain metadata-only and non-executable.
// They preserve fail-closed boundaries without reading row bodies or files.

export const LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA = "iris_live2d_motion_dataset_real_row_go_nogo_blocker_map_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA = "iris_live2d_motion_dataset_real_row_pre_ingestion_review_packet_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA = "iris_live2d_motion_dataset_real_row_final_dry_run_checklist_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA = "iris_live2d_motion_dataset_real_row_missing_data_fail_closed_gate_v1";

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA = "iris_live2d_motion_dataset_actual_data_task_entry_gate_v1";

export const LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS = Object.freeze([
  "missing_real_row_file",
  "missing_source_hash",
  "missing_quarantine_metadata",
  "missing_redaction_scan",
  "missing_audit_manifest_result",
  "missing_owner_confirmation",
  "missing_fresh_resident_evidence",
  "missing_renderer_ready_dependencies",
  "unsupported_motion_label_present",
  "experimental_motion_label_executable",
  "raw_field_leak_detected",
  "row_body_unread",
  "checked_row_count_zero",
  "priority1_blocked",
  "go_nogo_review_missing",
  "trusted_loader_disabled",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_RESOLUTION_PREREQUISITES = Object.freeze([
  "owner_confirmation_confirmed",
  "real_row_file_provided_through_approved_future_task",
  "source_hash_verified",
  "row_body_safely_scanned_in_future_task",
  "redaction_scan_pass_in_future_task",
  "audit_manifest_result_pass_in_future_task",
  "fresh_resident_evidence_present",
  "renderer_ready_dependencies_satisfied",
  "unsupported_motion_absent_or_rejected",
  "experimental_motion_remains_non_executable",
  "checked_row_count_positive_only_after_future_ingestion_audit",
  "go_nogo_review_pass",
  "trusted_loader_decision_remains_separate",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS = Object.freeze([
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
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS = Object.freeze([
  "future_file_format",
  "future_source_hash",
  "future_declared_row_count",
  "future_dataset_split_plan",
  "future_audit_run_id",
  "future_auditor_version",
  "future_redaction_policy",
  "future_renderer_ready_policy",
  "future_motion_allowlist_policy",
  "future_unsupported_motion_policy",
  "future_experimental_motion_policy",
  "future_go_nogo_review",
  "future_priority1_blocker_review",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_MISSING_BLOCKER_CHECKS = Object.freeze([
  ...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS,
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS = Object.freeze([
  "row_schema_preflight_visible",
  "synthetic_row_fixture_pack_visible",
  "request_packet_visible",
  "dry_run_validator_visible",
  "quarantine_envelope_visible",
  "owner_handoff_packet_visible",
  "audit_manifest_visible",
  "redaction_scanner_fixture_pack_visible",
  "evidence_link_manifest_visible",
  "go_nogo_blocker_map_visible",
  "pre_ingestion_review_packet_visible",
  "owner_confirmation_still_required",
  "fresh_resident_evidence_still_required",
  "checked_row_count_zero",
  "real_row_data_absent",
  "motion_dataset_non_executable",
  "no_go_preserved",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_BLOCKER_VISIBILITY = Object.freeze([
  ...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS,
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS = Object.freeze([
  ...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS,
  "pre_ingestion_review_packet",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_BLOCKERS = Object.freeze([
  "missing_owner_provided_row_file",
  "missing_source_hash",
  "missing_declared_row_count",
  "missing_jsonl_or_csv_format",
  "missing_owner_confirmation",
  "missing_real_row_redaction_scan",
  "missing_real_row_audit_result",
  "missing_fresh_resident_evidence",
  "missing_go_nogo_review",
  "checked_row_count_zero",
  "real_row_data_absent",
  "priority1_blocked",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FUTURE_PREREQUISITES = Object.freeze([
  "owner_provided_jsonl_or_csv_file",
  "row_id_per_record",
  "source_hash",
  "declared_row_count",
  "dataset_split",
  "schema_version",
  "audit_run_id",
  "auditor_version",
  "redaction_scan_result",
  "audit_manifest_result",
  "owner_confirmation_ref",
  "fresh_resident_evidence_ref",
  "go_nogo_review_ref",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES = Object.freeze([
  "owner_confirmation_confirmed",
  "real_row_file_available",
  "source_hash_declared",
  "metadata_validator_stub_present",
  "submission_rejection_fixture_pack_present",
  "checksum_preflight_manifest_present",
  "missing_data_fail_closed_gate_present",
  "final_dry_run_checklist_present",
  "go_nogo_blocker_map_present",
  "fresh_resident_evidence_required",
  "owner_confirmation_required",
  "actual_file_content_not_present",
  "actual_file_reference_not_present",
  "row_body_not_read",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS = Object.freeze([
  "missing_owner_confirmation",
  "missing_real_row_file",
  "missing_source_hash",
  "missing_fresh_resident_evidence",
  "missing_go_nogo_review",
  "checked_row_count_zero",
  "priority1_blocked",
  "actual_ingestion_not_allowed",
]);

export function createMotionDatasetRealRowGoNoGoBlockerMapSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "raw_field_leak_detected",
      "raw_dataset_row_body",
      "actual_file_path_value",
      "actual_file_content",
      "owner_private_note",
      "raw_owner_confirmation_note",
    ]),
  ];
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const blockerResolvedRequested = source.blocker_resolved === true || source.priority1_status === "RESOLVED" || source.priority1_resolved === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const noGoReasons = [
    "no_go_missing_real_row_file",
    "no_go_missing_source_hash",
    "no_go_missing_quarantine_metadata",
    "no_go_missing_redaction_scan",
    "no_go_missing_audit_manifest_result",
    "no_go_missing_owner_confirmation",
    "no_go_missing_fresh_resident_evidence",
    "no_go_missing_renderer_ready_dependencies",
    "no_go_checked_row_count_zero",
    "no_go_priority1_blocked",
    "no_go_review_missing",
    "no_go_trusted_loader_disabled",
  ];
  if (rawFields.length) noGoReasons.push("no_go_raw_field_leak_detected");
  if (goRequested) noGoReasons.push("go_nogo_blocker_map_rejected_go_approval");
  if (blockerResolvedRequested) noGoReasons.push("go_nogo_blocker_map_rejected_blocker_resolution");
  if (ownerConfirmationRequested) noGoReasons.push("go_nogo_blocker_map_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) noGoReasons.push("go_nogo_blocker_map_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) noGoReasons.push("go_nogo_blocker_map_rejected_row_body_or_file_read");
  if (motionExecutionRequested) noGoReasons.push("go_nogo_blocker_map_rejected_motion_execution");
  if (readinessRequested) noGoReasons.push("go_nogo_blocker_map_rejected_readiness_claim");
  if (trustedLoaderRequested) noGoReasons.push("go_nogo_blocker_map_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_go_nogo_blocker_map_status: "planning_only_blocked",
    planning_only_boundary: true,
    go_nogo_map_only_boundary: true,
    no_go_preserved_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
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
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_blocker_map_is_go_approval: false,
    required_blocker_ids: [...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS],
    required_resolution_prerequisites: [...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_RESOLUTION_PREREQUISITES],
    required_no_go_reasons: [...new Set(noGoReasons)],
    required_go_candidate_conditions: [
      "separate_owner_confirmed_actual_data_task",
      "fresh_resident_evidence_present",
      "row_audit_passed_in_future_task",
      "redaction_scan_passed_in_future_task",
      "renderer_ready_dependencies_satisfied",
      "go_nogo_review_passed_in_future_task",
    ],
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    safe_next_action: "keep_no_go_until_future_owner_confirmed_actual_data_and_go_nogo_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      go_nogo_map_only: true,
      no_go_preserved: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row go nogo blocker map summary");
  return summary;
}

export function createMotionDatasetRealRowPreIngestionReviewPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "future_file_format_value",
      "future_source_hash_value",
      "future_declared_row_count_value",
      "future_dataset_split_plan_value",
      "future_audit_run_id_value",
      "owner_private_note",
      "raw_owner_confirmation_note",
      "actual_file_path_value",
      "actual_file_content",
      "raw_dataset_row_body",
    ]),
  ];
  const realEvidenceRequested = source.real_evidence_present === true || source.fresh_resident_evidence_present === true;
  const ownerApprovalRequested = source.owner_approval_created === true || source.owner_approval_confirmed === true || source.owner_approval_status === "confirmed";
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "pre_ingestion_review_packet_planning_only",
    "pre_ingestion_review_packet_review_only",
    "pre_ingestion_review_packet_no_owner_approval",
    "pre_ingestion_review_packet_no_real_row_ingestion",
    "pre_ingestion_review_packet_no_row_body_read",
    "pre_ingestion_review_packet_priority1_blocked",
    "pre_ingestion_review_packet_go_nogo_no_go",
    "pre_ingestion_review_packet_owner_confirmation_required",
    "pre_ingestion_review_packet_fresh_resident_evidence_required",
  ];
  if (rawFields.length) blockedReasons.push("pre_ingestion_review_packet_rejected_raw_or_private_material");
  if (realEvidenceRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_real_evidence_claim");
  if (ownerApprovalRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_owner_approval");
  if (ownerConfirmationRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_trusted_loader_request");

  const artifactStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS.map((artifact) => [artifact, "planning_artifact_required"]));
  const ownerReviewStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS.map((item) => [item, "future_owner_review_required"]));
  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_pre_ingestion_review_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    pre_ingestion_review_only_boundary: true,
    no_approval_boundary: true,
    no_go_preserved_boundary: true,
    metadata_only_preservation_boundary: true,
    no_real_evidence_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    pre_ingestion_review_only: true,
    pre_ingestion_review_packet_is_owner_approval: false,
    owner_approval_created: false,
    owner_approval_confirmed: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
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
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    fresh_resident_evidence_status: "required_not_present",
    future_file_format_status: "owner_review_required",
    future_source_hash_status: "owner_review_required",
    future_declared_row_count_status: "owner_review_required",
    future_dataset_split_plan_status: "owner_review_required",
    future_audit_run_status: "owner_review_required",
    future_redaction_policy_status: "owner_review_required",
    future_renderer_ready_policy_status: "owner_review_required",
    future_motion_policy_status: "owner_review_required",
    future_go_nogo_review_status: "required_no_go",
    required_pre_ingestion_artifacts: [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS],
    required_owner_review_items: [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS],
    required_missing_blocker_checks: [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_MISSING_BLOCKER_CHECKS],
    required_renderer_ready_checks: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    required_evidence_refs: [...LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES],
    required_go_nogo_refs: [
      "go_nogo_blocker_map",
      "future_go_nogo_review",
      "future_priority1_blocker_review",
    ],
    artifact_statuses: artifactStatuses,
    owner_review_statuses: ownerReviewStatuses,
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_future_owner_review_packet_without_real_row_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      pre_ingestion_review_only: true,
      no_owner_approval: true,
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
  assertSafePublicObject(summary, "motion dataset real row pre ingestion review packet summary");
  return summary;
}

export function createMotionDatasetRealRowFinalDryRunChecklistSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "future_source_hash_value",
      "future_declared_row_count_value",
      "owner_private_note",
      "raw_owner_confirmation_note",
      "actual_file_path_value",
      "actual_file_content",
      "raw_dataset_row_body",
    ]),
  ];
  const realEvidenceRequested = source.real_evidence_present === true || source.fresh_resident_evidence_present === true;
  const ownerApprovalRequested = source.owner_approval_created === true || source.owner_approval_confirmed === true || source.owner_approval_status === "confirmed";
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "final_dry_run_checklist_planning_only",
    "final_dry_run_checklist_no_actual_ingestion",
    "final_dry_run_checklist_no_real_row_ingestion",
    "final_dry_run_checklist_no_row_body_read",
    "final_dry_run_checklist_priority1_blocked",
    "final_dry_run_checklist_go_nogo_no_go",
    "final_dry_run_checklist_owner_confirmation_required",
    "final_dry_run_checklist_fresh_resident_evidence_required",
  ];
  if (rawFields.length) blockedReasons.push("final_dry_run_checklist_rejected_raw_or_private_material");
  if (realEvidenceRequested) blockedReasons.push("final_dry_run_checklist_rejected_real_evidence_claim");
  if (ownerApprovalRequested) blockedReasons.push("final_dry_run_checklist_rejected_owner_approval");
  if (ownerConfirmationRequested) blockedReasons.push("final_dry_run_checklist_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("final_dry_run_checklist_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("final_dry_run_checklist_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("final_dry_run_checklist_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("final_dry_run_checklist_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("final_dry_run_checklist_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("final_dry_run_checklist_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("final_dry_run_checklist_rejected_trusted_loader_request");

  const checklistStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS.map((item) => [item, "visible_or_required_for_future_owner_review"]));
  const artifactStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS.map((ref) => [ref, "planning_ref_visible"]));
  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_final_dry_run_checklist_status: "planning_only_blocked",
    planning_only_boundary: true,
    final_dry_run_only_boundary: true,
    no_actual_ingestion_boundary: true,
    no_approval_boundary: true,
    no_go_preserved_boundary: true,
    metadata_only_preservation_boundary: true,
    no_real_evidence_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    final_dry_run_only: true,
    final_dry_run_checklist_is_ingestion_approval: false,
    owner_approval_created: false,
    owner_approval_confirmed: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
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
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    fresh_resident_evidence_status: "required_not_present",
    required_checklist_items: [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS],
    required_blocker_visibility: [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_BLOCKER_VISIBILITY],
    required_artifact_refs: [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS],
    required_renderer_ready_checks: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    checklist_statuses: checklistStatuses,
    artifact_statuses: artifactStatuses,
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "keep_final_dry_run_checklist_planning_only_until_owner_confirmed_future_ingestion_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      final_dry_run_only: true,
      no_actual_ingestion: true,
      no_owner_approval: true,
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
  assertSafePublicObject(summary, "motion dataset real row final dry run checklist summary");
  return summary;
}

export function createMotionDatasetRealRowMissingDataFailClosedGateSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "raw_dataset_row_body",
      "actual_file_path_value",
      "actual_file_content",
      "future_source_hash_value",
      "owner_private_note",
      "raw_owner_confirmation_note",
    ]),
  ];
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const realEvidenceRequested = source.real_evidence_present === true || source.fresh_resident_evidence_present === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "missing_data_fail_closed_gate_planning_only",
    "missing_data_fail_closed_gate_no_owner_provided_row_file",
    "missing_data_fail_closed_gate_actual_ingestion_not_allowed",
    "missing_data_fail_closed_gate_checked_row_count_zero",
    "missing_data_fail_closed_gate_real_row_data_absent",
    "missing_data_fail_closed_gate_priority1_blocked",
    "missing_data_fail_closed_gate_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("missing_data_fail_closed_gate_rejected_raw_or_private_material");
  if (actualIngestionRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_actual_ingestion_request");
  if (realEvidenceRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_real_evidence_claim");
  if (ownerConfirmationRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_missing_data_fail_closed_gate_status: "planning_only_blocked",
    planning_only_boundary: true,
    missing_data_gate_only_boundary: true,
    fail_closed_boundary: true,
    no_actual_ingestion_allowed_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    missing_data_gate_only: true,
    fail_closed: true,
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
    required_missing_data_blockers: [...LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_BLOCKERS],
    required_future_data_prerequisites: [...LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FUTURE_PREREQUISITES],
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    blocked_reasons: [...new Set(blockedReasons)],
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    safe_next_action: "keep_fail_closed_until_future_owner_confirmed_actual_row_data_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      missing_data_gate_only: true,
      fail_closed: true,
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
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row missing data fail closed gate summary");
  return summary;
}

export function createMotionDatasetActualDataTaskEntryGateSummary(input = {}) {
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
      "owner_private_note",
      "raw_owner_confirmation_note",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const actualDataTaskRequested = source.actual_data_task_started === true || source.actual_data_task_approved === true;
  const submissionRequested = source.owner_submission_received === true || source.owner_submission_accepted === true || source.submission_accepted === true;
  const fileReadRequested = source.actual_file_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const hashRequested = source.actual_hash_calculated === true || source.hash_calculated === true;
  const rowContentRequested = source.actual_row_content_accepted === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const ingestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const parserRequested = source.row_body_parser_enabled === true || source.row_body_parser_executed === true || source.row_body_read === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const blockedReasons = [
    "actual_data_task_entry_gate_planning_only",
    "actual_data_task_entry_gate_no_actual_data_task_started",
    "actual_data_task_entry_gate_no_submission_accepted",
    "actual_data_task_entry_gate_no_actual_file_read",
    "actual_data_task_entry_gate_no_actual_hash_calculation",
    "actual_data_task_entry_gate_no_actual_row_content",
    "actual_data_task_entry_gate_no_parser_execution",
    "actual_data_task_entry_gate_no_real_row_ingestion",
    "actual_data_task_entry_gate_owner_confirmation_required",
    "actual_data_task_entry_gate_priority1_blocked",
    "actual_data_task_entry_gate_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("actual_data_task_entry_gate_rejected_unsafe_material");
  if (actualDataTaskRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_actual_task_start");
  if (submissionRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_submission_state");
  if (fileReadRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_file_access");
  if (hashRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_hash_calculation");
  if (rowContentRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_row_content");
  if (ingestionRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_ingestion");
  if (parserRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_parser_execution");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_real_row_or_checked_count");
  if (motionExecutionRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_go_or_blocker_resolution");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA,
    safe_summary_only: true,
    motion_dataset_actual_data_task_entry_gate_status: "planning_only_blocked",
    planning_only_boundary: true,
    entry_gate_only_boundary: true,
    no_actual_data_task_started_boundary: true,
    no_submission_accepted_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_hash_calculation_boundary: true,
    no_actual_row_content_boundary: true,
    no_parser_execution_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    entry_gate_only: true,
    actual_data_task_started: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_file_read: false,
    actual_hash_calculated: false,
    actual_row_content_accepted: false,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    row_body_read: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    motion_dataset_executable: false,
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
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_entry_prerequisites: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES],
    required_blocking_conditions: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    safe_next_action: "future_owner_confirmed_actual_data_task_required_before_row_intake",
    boundary_policy: {
      ...createBoundaryPolicy(),
      entry_gate_only: true,
      no_actual_data_task_started: true,
      no_submission_accepted: true,
      no_actual_file_read: true,
      no_actual_hash_calculation: true,
      no_actual_row_content: true,
      no_parser_execution: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset actual data task entry gate summary");
  return summary;
}
