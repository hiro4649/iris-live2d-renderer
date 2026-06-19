import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";
import {
  LIVE2D_EXPERIMENTAL_MOTION_LABELS,
  LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES,
} from "./sharedMotionCatalog.js";
import {
  detectedMotionDatasetRawFields,
  filterSyntheticFixtureCases,
  LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS,
  privateMaterialFieldCategories,
  safeMotionDatasetLabel,
  safeSyntheticRejectedCaseLabel,
} from "./motionDatasetPlanningSafety.js";

export const LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA = "iris_live2d_motion_dataset_row_schema_preflight_v1";
export const LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_dataset_synthetic_row_fixture_pack_v1";

export const LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS = Object.freeze([
  "row_id",
  "dataset_split",
  "motion_label",
  "motion_style",
  "expression_label",
  "gaze_label",
  "breath_label",
  "body_label",
  "camera_label",
  "timing",
  "intensity",
  "cooldown",
  "recovery_plan",
  "visibility_guard",
  "comfort_guard",
  "accessibility",
  "eval_contamination_policy",
  "renderer_ready_dependencies",
  "audit_run",
]);

export const LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA = Object.freeze([
  "audit_run_id",
  "auditor_version",
  "source_hash",
  "source_line",
  "checked_at_bucket",
  "redaction_status",
  "safe_summary_only",
]);

export const LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS = Object.freeze([
  "fresh_heartbeat",
  "real_model_load_supported",
  "model_loaded",
  "scene_loaded",
  "model_matches",
  "scene_matches",
  "cue_capability_confirmed",
  "last_cue_applied",
]);

export const LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES = Object.freeze([
  "safe_talk_row",
  "safe_idle_breath_row",
  "safe_laugh_big_row_with_recovery",
  "safe_subtitle_visibility_guard_row",
  "safe_low_intensity_motion_row",
  "safe_accessibility_guarded_row",
  "safe_eval_split_row",
  "safe_renderer_ready_false_row",
]);

export const LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES = Object.freeze([
  "missing_row_id_rejected",
  "duplicate_row_id_rejected",
  "missing_audit_run_id_rejected",
  "missing_auditor_version_rejected",
  "missing_source_hash_rejected",
  "missing_source_line_rejected",
  "missing_dataset_split_rejected",
  "unsupported_motion_label_rejected",
  "experimental_motion_label_executable_rejected",
  "expression_label_as_motion_style_rejected",
  "gaze_label_as_motion_style_rejected",
  "breath_label_as_motion_style_rejected",
  "camera_label_as_motion_style_rejected",
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
  "raw_process_output_rejected",
  "raw_stack_trace_rejected",
  "fixture_success_as_renderer_ready_rejected",
  "manifest_existence_as_renderer_ready_rejected",
  "asset_route_existence_as_renderer_ready_rejected",
  "sse_connection_as_renderer_ready_rejected",
  "cue_acceptance_as_renderer_ready_rejected",
  "browser_cue_delivery_as_renderer_ready_rejected",
  "renderer_ready_missing_fresh_heartbeat_rejected",
  "renderer_ready_missing_model_loaded_rejected",
  "renderer_ready_missing_scene_loaded_rejected",
  "renderer_ready_missing_model_matches_rejected",
  "renderer_ready_missing_scene_matches_rejected",
  "renderer_ready_missing_cue_capability_rejected",
  "renderer_ready_missing_last_cue_applied_rejected",
  "photosensitivity_guard_missing_rejected",
  "subtitle_overlay_safety_missing_rejected",
  "gaze_pressure_boundary_missing_rejected",
  "motion_cooldown_fatigue_missing_rejected",
  "eval_contamination_guard_missing_rejected",
]);

export const LIVE2D_MOTION_DATASET_UX_AUDIT_AXES = Object.freeze([
  "viewer_comfort",
  "photosensitivity",
  "subtitle_overlay",
  "gaze_pressure",
  "motion_cooldown",
  "recovery_comfort",
  "accessibility_review",
]);

export function createMotionDatasetRowSchemaPreflightSummary(rowInput = {}) {
  const source = rowInput && typeof rowInput === "object" ? rowInput : {};
  const motionStyle = safeMotionDatasetLabel(source.motion_style ?? source.motionStyle ?? source.motion_label, "missing");
  const motionLabel = safeMotionDatasetLabel(source.motion_label ?? source.motionLabel, "missing");
  const rowDataPresent = source.row_data_present === true || source.rowDataPresent === true || source.row !== undefined || source.dataset_row !== undefined;
  const checkedRowCount = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0 ? source.checked_row_count : 0;
  const experimentalLabelRequested = LIVE2D_EXPERIMENTAL_MOTION_LABELS.includes(motionStyle) || LIVE2D_EXPERIMENTAL_MOTION_LABELS.includes(motionLabel);
  const runtimeStyleSupported = LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES.includes(motionStyle);
  const rawFields = detectedMotionDatasetRawFields(source);
  const requestedReadiness = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const requestedExecution = source.motion_dataset_executable === true || source.motion_execution_requested === true || source.execute_motion === true || source.real_row_ingestion_started === true;
  const ownerConfirmationCreated = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true;

  const rejectionReasons = [
    "motion_dataset_row_schema_preflight_planning_only",
    "motion_dataset_row_schema_preflight_no_real_row_ingestion",
    "motion_dataset_row_schema_preflight_non_executable",
    "motion_dataset_row_schema_preflight_no_motion_execution",
    "motion_dataset_row_schema_preflight_no_real_collection",
    "motion_dataset_row_schema_preflight_no_live_probe",
    "motion_dataset_row_schema_preflight_no_owner_confirmation_created",
    "motion_dataset_row_schema_preflight_no_owner_confirmation_confirmed",
    "motion_dataset_row_schema_preflight_not_runtime_ready",
    "motion_dataset_row_schema_preflight_not_production_ready",
    "motion_dataset_row_schema_preflight_go_no_go_preserved",
    "motion_dataset_row_schema_preflight_priority1_blocked",
  ];
  if (!rowDataPresent) rejectionReasons.push("row_schema_rejected_no_real_rows_present");
  if (checkedRowCount !== 0) rejectionReasons.push("row_schema_rejected_checked_row_count_nonzero");
  if (experimentalLabelRequested) rejectionReasons.push("row_schema_rejected_experimental_label_non_executable");
  if (motionStyle !== "missing" && !runtimeStyleSupported) rejectionReasons.push("row_schema_rejected_unsupported_motion_style");
  if (rawFields.length) rejectionReasons.push("row_schema_rejected_raw_or_private_field");
  if (requestedReadiness) rejectionReasons.push("row_schema_rejected_readiness_claim");
  if (requestedExecution) rejectionReasons.push("row_schema_rejected_motion_execution_or_row_ingestion");
  if (ownerConfirmationCreated) rejectionReasons.push("row_schema_rejected_owner_confirmation_creation_or_confirmation");
  if (goRequested) rejectionReasons.push("row_schema_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) rejectionReasons.push("row_schema_rejected_trusted_loader_request");
  if (realCollectionRequested) rejectionReasons.push("row_schema_rejected_real_collection_or_probe");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    safe_summary_only: true,
    row_schema_preflight_status: "planning_only_blocked",
    row_schema_ready_candidate: false,
    planning_only: true,
    row_data_present: false,
    checked_row_count: 0,
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    real_row_ingestion_started: false,
    real_evidence_collection_started: false,
    live_probe_started: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    required_row_fields: [...LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS],
    required_audit_metadata: [...LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA],
    runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    renderer_ready_required_fields: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    rejected_private_material_fields: privateMaterialFieldCategories(),
    detected_rejected_private_material_fields: rawFields,
    ux_audit_axes: [...LIVE2D_MOTION_DATASET_UX_AUDIT_AXES],
    eval_contamination_policy: "fixture_manifest_asset_route_sse_cue_acceptance_not_success_evidence",
    fixture_success_is_real_evidence: false,
    manifest_existence_is_real_evidence: false,
    asset_route_success_is_real_evidence: false,
    sse_connection_is_real_evidence: false,
    cue_acceptance_is_real_evidence: false,
    browser_cue_delivery_is_runtime_readiness: false,
    collection_plan_status: "planning_only",
    freshness_threshold_status: "preserved",
    safe_evidence_summary_contract_status: "preserved",
    summary_intake_binding_status: "preserved",
    owner_confirmation_binding_status: "schema_only_blocked",
    blocker_resolution_schema_status: "planning_only_blocked",
    collector_manifest_status: "planning_only",
    collector_fixture_pack_status: "synthetic_only",
    collector_dry_run_envelope_status: "request_only",
    rejection_reasons: [...new Set(rejectionReasons)],
    safe_next_action: "create_separate_owner_confirmed_motion_dataset_row_task_after_real_resident_evidence_and_go_no_go_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
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
  assertSafePublicObject(summary, "motion dataset row schema preflight summary");
  return summary;
}

export function createMotionDatasetSyntheticRowFixturePackSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const acceptedCases = filterSyntheticFixtureCases(
    source.accepted_synthetic_fixture_cases ?? source.acceptedSyntheticFixtureCases,
    LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES,
  );
  const rejectedCases = filterSyntheticFixtureCases(
    source.rejected_synthetic_fixture_cases ?? source.rejectedSyntheticFixtureCases,
    LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES,
  );
  const rawFields = detectedMotionDatasetRawFields(source);
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;

  const validationBlockedReasons = [
    "synthetic_row_fixture_pack_planning_only",
    "synthetic_row_fixture_pack_synthetic_only",
    "synthetic_row_fixture_pack_non_executable",
    "synthetic_row_fixture_pack_no_real_row_ingestion",
    "synthetic_row_fixture_pack_no_motion_execution",
    "synthetic_row_fixture_pack_no_real_collection",
    "synthetic_row_fixture_pack_no_live_probe",
    "synthetic_row_fixture_pack_no_owner_confirmation_created",
    "synthetic_row_fixture_pack_no_owner_confirmation_confirmed",
    "synthetic_row_fixture_pack_not_runtime_ready",
    "synthetic_row_fixture_pack_not_production_ready",
    "synthetic_row_fixture_pack_go_no_go_preserved",
    "synthetic_row_fixture_pack_priority1_blocked",
  ];
  if (rawFields.length) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_raw_or_private_field");
  if (realRowRequested || checkedRowCountRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_real_row_or_checked_count");
  if (executionRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_motion_execution");
  if (realCollectionRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_owner_confirmation");
  if (readinessRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_readiness_claim");
  if (goRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    safe_summary_only: true,
    motion_dataset_synthetic_row_fixture_pack_status: "planning_only_blocked",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    non_executable_boundary: true,
    real_row_data_present: false,
    synthetic_fixture_row_count: acceptedCases.length,
    checked_row_count: 0,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    accepted_synthetic_fixture_cases: acceptedCases,
    rejected_synthetic_fixture_cases: rejectedCases.map(safeSyntheticRejectedCaseLabel),
    synthetic_fixture_validator_status: "pass_synthetic_only",
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    renderer_ready_required_fields: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejected_private_material_fields: privateMaterialFieldCategories(),
    detected_rejected_private_material_fields: rawFields,
    unsafe_material_rejection_status: rawFields.length ? "unsafe_material_rejected" : "preserved",
    ux_audit_axes: [...LIVE2D_MOTION_DATASET_UX_AUDIT_AXES],
    ux_audit_guard_status: "required",
    eval_contamination_policy: "synthetic_fixtures_not_success_evidence",
    eval_contamination_guard_status: "required",
    fixture_success_is_real_evidence: false,
    manifest_existence_is_real_evidence: false,
    asset_route_success_is_real_evidence: false,
    sse_connection_is_real_evidence: false,
    cue_acceptance_is_real_evidence: false,
    browser_cue_delivery_is_runtime_readiness: false,
    row_schema_preflight_status: "preserved",
    collector_dry_run_envelope_status: "request_only_preserved",
    validation_blocked_reasons: [...new Set(validationBlockedReasons)],
    safe_next_action: "owner_confirmed_real_resident_evidence_collection_before_any_real_row_ingestion_or_motion_execution",
    boundary_policy: {
      ...createBoundaryPolicy(),
      synthetic_only_fixture_rows: true,
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
  assertSafePublicObject(summary, "motion dataset synthetic row fixture pack summary");
  return summary;
}

export { LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS };
