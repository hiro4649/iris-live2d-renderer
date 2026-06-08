import { existsSync } from "node:fs";
import { assertSafePublicObject, createBoundaryPolicy, safeText } from "../contracts.js";

export const CUBISM_LOADER_PROVISIONING_SCHEMA = "iris_live2d_cubism_loader_provisioning_v1";
export const TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA = "iris_live2d_trusted_loader_allowlist_preflight_v1";
export const TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA = "iris_live2d_trusted_loader_enablement_gate_v1";
export const TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA = "iris_live2d_trusted_loader_owner_handoff_v1";
export const FRESH_EVIDENCE_BUNDLE_SCHEMA = "iris_live2d_fresh_evidence_bundle_v1";
export const GO_NOGO_PREFLIGHT_SCHEMA = "iris_live2d_go_nogo_preflight_v1";
export const REAL_EVIDENCE_INTAKE_SCHEMA = "iris_live2d_real_evidence_intake_v1";
export const OWNER_CONFIRMATION_ENVELOPE_SCHEMA = "iris_live2d_owner_confirmation_envelope_v1";
export const REAL_EVIDENCE_REQUEST_PACKET_SCHEMA = "iris_live2d_real_evidence_request_packet_v1";
export const REAL_RESIDENT_EVIDENCE_COLLECTION_PLAN_SCHEMA = "iris_live2d_real_resident_evidence_collection_plan_v1";
export const REAL_EVIDENCE_FRESHNESS_THRESHOLD_SCHEMA = "iris_live2d_real_evidence_freshness_threshold_v1";
export const LIVE2D_SAFE_EVIDENCE_SUMMARY_CONTRACT_SCHEMA = "iris_live2d_safe_evidence_summary_contract_v1";

export const ALLOWED_CUBISM_LOADER_ENV_NAMES = Object.freeze([
  "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
  "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
  "IRIS_LIVE2D_CUBISM_LOADER_KIND",
]);

export const CUBISM_LOADER_KIND_CANDIDATES = Object.freeze([
  "cubism_framework_model_loader_v1",
  "cubism_moc_create",
]);

const FRAMEWORK_FILE_ENV_NAMES = new Set([
  "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
  "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
]);

const LOADER_KIND_ENV_NAME = "IRIS_LIVE2D_CUBISM_LOADER_KIND";
const DEFAULT_LOADER_KIND = "cubism_framework_model_loader_v1";
const REAL_EVIDENCE_INTAKE_SOURCE_TYPES = new Set([
  "fixture",
  "dry_run",
  "manual_summary",
  "operator_confirmed_summary",
  "real_probe_summary",
  "audit_reference",
]);

const REAL_EVIDENCE_INTAKE_COMPONENTS = new Set([
  "live2d_renderer",
  "live2d_route_guard",
  "live2d_evidence_collector",
  "live2d_allowlist_preflight",
  "live2d_enablement_gate",
  "live2d_owner_handoff",
  "live2d_fresh_evidence_bundle",
  "live2d_go_nogo_preflight",
]);

const RAW_EVIDENCE_FIELD_NAMES = new Set([
  "raw_payload",
  "raw_renderer_payload",
  "raw_cue_payload",
  "raw_evidence_body",
  "raw_model_path",
  "raw_motion_path",
  "endpoint",
  "token",
  "secret",
  "raw_loader_candidate",
  "raw_loader_error",
  "raw_request_note",
  "raw_api_response",
  "raw_audio_body",
  "raw_frame_body",
  "raw_comment_text",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "owner_private_note",
  "raw_owner_note",
  "sdk_vendor_path",
  "model_path",
  "motion_path",
  "shell_command_body",
  "obs_instruction_material",
  "world_instruction_material",
  "sdk_path",
  "vendor_source",
]);

const OWNER_CONFIRMATION_SCOPES = Object.freeze([
  "route_guard_review",
  "real_evidence_collector_review",
  "fresh_evidence_bundle_review",
  "real_evidence_intake_review",
  "go_nogo_preflight_review",
  "owner_confirmation_envelope_review",
  "trusted_loader_preflight_review",
  "trusted_loader_enablement_gate_review",
  "trusted_loader_owner_handoff_review",
  "actual_trusted_loader_enablement",
  "runtime_readiness",
  "production_readiness",
  "priority1_resolution",
  "motion_dataset_execution",
]);

const OWNER_CONFIRMATION_SCOPE_SET = new Set(OWNER_CONFIRMATION_SCOPES);

const REAL_EVIDENCE_REQUEST_COMPONENTS = Object.freeze([
  "live2d_route_guard",
  "live2d_renderer_heartbeat",
  "live2d_model_configured_status",
  "live2d_cue_capability",
  "live2d_recovery_capability",
  "live2d_evidence_collector",
  "live2d_fresh_evidence_bundle",
  "live2d_real_evidence_intake",
  "live2d_go_nogo_preflight",
  "live2d_owner_confirmation_envelope",
  "trusted_loader_preflight",
  "trusted_loader_enablement_gate",
  "trusted_loader_owner_handoff",
  "license_boundary",
  "sdk_vendor_boundary",
  "priority1_real_resident_evidence",
  "motion_dataset_row_evidence",
]);

const REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES = Object.freeze([
  "real_probe_summary",
  "operator_confirmed_summary",
  "manual_upload_summary",
  "audit_reference",
  "owner_confirmed_reference",
]);

const REJECTED_REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES = Object.freeze([
  "fixture",
  "dry_run",
  "mock",
  "stale",
  "unsafe_material",
  "unknown_source_type",
]);

const SAFE_EVIDENCE_SUMMARY_ACCEPTED_FIELDS = Object.freeze([
  "component",
  "status",
  "freshness_status",
  "evidence_source_type",
  "evidence_ref",
  "safe_audit_ref",
  "head_sha_ref",
  "run_id_ref",
  "file_scope",
  "checked_at_bucket",
  "status_reason_code",
  "redaction_status",
  "blocker_labels",
  "safe_next_action",
]);

const SAFE_EVIDENCE_SUMMARY_REQUIRED_BINDINGS = Object.freeze([
  "component",
  "evidence_source_type",
  "evidence_ref",
  "safe_audit_ref",
  "head_sha_ref",
  "run_id_ref",
  "freshness_status",
  "redaction_status",
]);

const SAFE_EVIDENCE_SUMMARY_ACCEPTED_SOURCE_TYPES = Object.freeze([
  "real_probe_summary",
  "operator_confirmed_summary",
  "manual_upload_summary",
  "audit_reference",
  "owner_confirmed_reference",
]);

const SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES = Object.freeze([
  "fixture",
  "dry_run",
  "mock",
  "stale",
  "unsafe_material",
  "unknown_source_type",
]);

const SAFE_EVIDENCE_SUMMARY_REJECTED_RAW_FIELDS = Object.freeze([
  "evidence_body_material",
  "cue_body_material",
  "renderer_body_material",
  "loader_candidate_material",
  "loader_error_material",
  "owner_note_material",
  "request_note_material",
  "network_locator_material",
  "auth_value_material",
  "sensitive_value_material",
  "private_locator_material",
  "model_locator_material",
  "motion_locator_material",
  "sdk_vendor_locator_material",
  "shell_instruction_body_material",
  "obs_instruction_material",
  "world_instruction_material",
  "api_response_material",
  "audio_body_material",
  "frame_body_material",
  "comment_text_material",
]);

const REAL_RESIDENT_EVIDENCE_COLLECTION_FORBIDDEN_MATERIAL_CLASSES = Object.freeze([
  "cue_body_material",
  "renderer_body_material",
  "evidence_body_material",
  "loader_candidate_material",
  "loader_error_material",
  "owner_note_material",
  "request_note_material",
  "model_location_material",
  "motion_location_material",
  "service_location_value",
  "auth_value",
  "private_value",
  "sdk_vendor_location_material",
  "local_machine_location_material",
  "shell_invocation_body",
  "obs_invocation",
  "world_invocation",
]);

const REAL_RESIDENT_EVIDENCE_COLLECTION_SEQUENCE = Object.freeze([
  "verify_route_guard",
  "verify_renderer_heartbeat_summary",
  "verify_model_configured_summary",
  "verify_cue_capability_summary",
  "verify_recovery_capability_summary",
  "verify_evidence_collector_summary",
  "submit_safe_evidence_intake",
  "bind_owner_confirmation_scope",
  "run_go_nogo_preflight_review",
  "keep_priority1_blocked_until_real_fresh_evidence",
  "keep_motion_dataset_non_executable_until_row_schema_and_rows_exist",
]);

const PROVISIONING_STATUS = new Set([
  "not_configured",
  "missing_dependency",
  "operator_attention_required",
  "candidate_present",
  "unsupported_loader_kind",
  "license_attention_required",
  "unsafe_configuration",
  "future_only",
]);

const LOADER_DEPENDENCY_STATUS = new Set([
  "not_configured",
  "missing_dependency",
  "operator_attention_required",
  "candidate_present",
  "unsupported_loader_kind",
  "unsafe_configuration",
  "future_only",
]);

const LICENSE_STATUS = new Set([
  "not_applicable",
  "owner_confirmation_required",
  "license_attention_required",
]);

const UNSAFE_ENV_VALUE_PATTERNS = [
  /^[a-z][a-z0-9+.-]*:\/\//iu,
  /\b(?:authorization|bearer|oauth|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|token|secret|password|endpoint)\b/iu,
  /\b(?:raw[_ -]?loader[_ -]?error|loader[_ -]?error|stack[_ -]?trace|stack)\b/iu,
  /\0/u,
];

export function inspectCubismLoaderProvisioning(
  env = process.env,
  { trustedLoaderAllowlistEnabled = false } = {}
) {
  const source = env && typeof env === "object" ? env : {};
  const configuredEnvNames = configuredLoaderEnvNames(source);
  if (configuredEnvNames.length === 0) {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind: "not_configured",
      loaderDependencyStatus: "missing_dependency",
      licenseStatus: "not_applicable",
      provisioningStatus: "not_configured",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  const requestedKind = normalizeLoaderKind(source[LOADER_KIND_ENV_NAME]);
  const loaderKind = requestedKind || inferConfiguredLoaderKind(source);
  if (hasUnsafeConfiguredEnvValue(source, configuredEnvNames)) {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind,
      loaderDependencyStatus: "unsafe_configuration",
      licenseStatus: "license_attention_required",
      provisioningStatus: "unsafe_configuration",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  if (!CUBISM_LOADER_KIND_CANDIDATES.includes(loaderKind)) {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind: "unsupported_loader_kind",
      loaderDependencyStatus: "unsupported_loader_kind",
      licenseStatus: "license_attention_required",
      provisioningStatus: "unsupported_loader_kind",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  if (loaderKind === "cubism_moc_create") {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind,
      loaderDependencyStatus: "future_only",
      licenseStatus: "not_applicable",
      provisioningStatus: "future_only",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  const frameworkEnvNames = configuredEnvNames.filter((name) => FRAMEWORK_FILE_ENV_NAMES.has(name));
  const frameworkFilePresent = frameworkEnvNames.some((name) => existsSync(String(source[name] ?? "")));
  if (!frameworkFilePresent) {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind,
      loaderDependencyStatus: "operator_attention_required",
      licenseStatus: "license_attention_required",
      provisioningStatus: "operator_attention_required",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  return createCubismLoaderProvisioningSummary({
    configuredEnvNames,
    loaderKind,
    loaderDependencyStatus: "candidate_present",
    licenseStatus: "license_attention_required",
    provisioningStatus: "candidate_present",
    trustedLoaderAllowlistEnabled,
    operatorAttentionRequired: true,
  });
}

export function createCubismLoaderProvisioningSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const configuredEnvNames = source.configuredEnvNames ?? source.configured_env_names ?? [];
  const loaderKind = source.loaderKind ?? source.loader_kind ?? "not_configured";
  const loaderDependencyStatus = source.loaderDependencyStatus ?? source.loader_dependency_status ?? "not_configured";
  const licenseStatus = source.licenseStatus ?? source.license_status ?? "not_applicable";
  const provisioningStatus = source.provisioningStatus ?? source.provisioning_status ?? "not_configured";
  const requestedTrustedLoaderAllowlistEnabled = source.trustedLoaderAllowlistEnabled === true || source.trusted_loader_allowlist_enabled === true;
  const operatorAttentionRequired = source.operatorAttentionRequired ?? source.operator_attention_required ?? true;
  const safeConfiguredEnvNames = safeEnvNames(configuredEnvNames);
  const summary = {
    schema: CUBISM_LOADER_PROVISIONING_SCHEMA,
    configured_env_names: safeConfiguredEnvNames,
    configured_env_count: safeConfiguredEnvNames.length,
    loader_kind: safeLoaderKind(loaderKind),
    loader_dependency_status: safeLoaderDependencyStatus(loaderDependencyStatus),
    license_status: safeLicenseStatus(licenseStatus),
    provisioning_status: safeProvisioningStatus(provisioningStatus),
    trusted_loader_allowlist_enabled: false,
    trusted_loader_allowlist_request_status: requestedTrustedLoaderAllowlistEnabled
      ? "ignored_requires_separate_owner_confirmed_enablement_pr"
      : "not_requested",
    operator_attention_required: operatorAttentionRequired !== false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
    },
  };
  assertSafePublicObject(summary, "cubism loader provisioning summary");
  return summary;
}

export function createTrustedLoaderAllowlistPreflightSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
} = {}) {
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const allowlistStatus = "disabled";
  const candidateStatus = trustedLoaderCandidateStatus(provisioning);
  const routeGuardPrerequisite = routeGuardStatus === "available" ? "available" : "route_guard_attention_required";
  const realEvidencePrerequisite = evidence.live2d_evidence_status === "attention_required" &&
    evidence.evidence_freshness_status === "fresh" &&
    evidence.fixture_evidence_status === "not_fixture" &&
    evidence.dry_run_evidence_status === "not_dry_run"
    ? "fresh_real_evidence_attention_required"
    : "real_evidence_required";
  const ownerConfirmationStatus = ownerConfirmation === true ? "confirmed_future_only" : "owner_confirmation_required";
  const blockerStatus = allowlistStatus === "disabled"
    ? "allowlist_disabled"
    : routeGuardPrerequisite !== "available"
      ? "route_guard_required"
      : realEvidencePrerequisite !== "fresh_real_evidence_attention_required"
        ? "real_evidence_required"
        : ownerConfirmationStatus;
  const summary = {
    schema: TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA,
    safe_summary_only: true,
    trusted_loader_allowlist_status: allowlistStatus,
    trusted_loader_candidate_kind: provisioning.loader_kind,
    trusted_loader_candidate_status: candidateStatus,
    trusted_loader_blocker_status: blockerStatus,
    trusted_loader_safe_next_action: "separate_owner_confirmed_trusted_loader_enablement_pr_required",
    trusted_loader_route_guard_prerequisite: routeGuardPrerequisite,
    trusted_loader_real_evidence_prerequisite: realEvidencePrerequisite,
    trusted_loader_license_status: provisioning.license_status,
    trusted_loader_owner_confirmation_status: ownerConfirmationStatus,
    trusted_loader_readiness_claimed: false,
    trusted_loader_ready_candidate: false,
    trusted_loader_allowlist_enabled: false,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    owner_provided_file_policy: "env_name_only",
    configured_env_names: provisioning.configured_env_names,
    configured_env_count: provisioning.configured_env_count,
    route_guard_required: routeGuardPrerequisite !== "available",
    real_evidence_required: true,
    priority1_status: "BLOCKED",
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
    },
  };
  assertSafePublicObject(summary, "trusted loader allowlist preflight summary");
  return summary;
}

export function createTrustedLoaderEnablementGateSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  allowlistPreflightSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
  ownerConfirmationFresh = false,
  sdkVendorBoundaryStatus = "clear",
} = {}) {
  const preflight = allowlistPreflightSummary && typeof allowlistPreflightSummary === "object"
    ? allowlistPreflightSummary
    : createTrustedLoaderAllowlistPreflightSummary({
      loaderProvisioning,
      live2dEvidenceSummary,
      routeGuardStatus,
      ownerConfirmation,
    });
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const blockers = trustedLoaderEnablementBlockers({
    provisioning,
    evidence,
    preflight,
    routeGuardStatus,
    ownerConfirmation,
    ownerConfirmationFresh,
    sdkVendorBoundaryStatus,
  });
  const summary = {
    schema: TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA,
    safe_summary_only: true,
    trusted_loader_enablement_gate_status: "blocked",
    trusted_loader_enablement_ready_candidate: false,
    trusted_loader_enablement_blocked_reason: blockers[0] ?? "blocked_allowlist_disabled",
    trusted_loader_enablement_blockers: blockers,
    trusted_loader_enablement_required_prerequisites: [
      "route_guard_available",
      "real_evidence_collector_available",
      "allowlist_preflight_available",
      "fresh_real_evidence",
      "owner_confirmation",
      "license_resolved",
      "known_supported_loader_kind",
      "safe_public_summary_only",
    ],
    trusted_loader_enablement_missing_prerequisites: blockers,
    trusted_loader_enablement_safe_next_action: "separate_owner_confirmed_actual_enablement_pr_required",
    trusted_loader_enablement_runtime_readiness_claimed: false,
    trusted_loader_enablement_production_readiness_claimed: false,
    trusted_loader_enablement_readiness_claim_status: "not_runtime_ready",
    route_guard_status: routeGuardStatus === "available" ? "available" : "blocked_missing_route_guard",
    real_evidence_status: safeGateEvidenceStatus(evidence),
    owner_confirmation_status: ownerConfirmation === true
      ? ownerConfirmationFresh === true ? "confirmed_future_only" : "blocked_owner_confirmation_expired"
      : "blocked_missing_owner_confirmation",
    license_status: provisioning.license_status,
    candidate_kind_status: trustedLoaderCandidateStatus(provisioning),
    allowlist_status: preflight.trusted_loader_allowlist_status === "disabled" ? "disabled" : "blocked_allowlist_disabled",
    freshness_status: evidence.evidence_freshness_status === "fresh" ? "fresh" : evidence.evidence_freshness_status ?? "missing",
    trusted_loader_allowlist_enabled: false,
    trusted_loader_preflight_prerequisite: preflight.schema === TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA ? "available" : "blocked_missing_allowlist_preflight",
    no_loader_trusted: true,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    priority1_status: "BLOCKED",
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_loader_candidate_material: true,
      no_loader_error_material: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
    },
  };
  assertSafePublicObject(summary, "trusted loader enablement gate summary");
  return summary;
}

export function createTrustedLoaderOwnerHandoffSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  allowlistPreflightSummary,
  enablementGateSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
  ownerConfirmationFresh = false,
  mockOwnerConfirmation = false,
  licenseBoundaryAcknowledged = false,
  sdkVendorBoundaryStatus = "clear",
} = {}) {
  const preflight = allowlistPreflightSummary && typeof allowlistPreflightSummary === "object"
    ? allowlistPreflightSummary
    : createTrustedLoaderAllowlistPreflightSummary({
      loaderProvisioning,
      live2dEvidenceSummary,
      routeGuardStatus,
      ownerConfirmation,
    });
  const gate = enablementGateSummary && typeof enablementGateSummary === "object"
    ? enablementGateSummary
    : createTrustedLoaderEnablementGateSummary({
      loaderProvisioning,
      live2dEvidenceSummary,
      allowlistPreflightSummary: preflight,
      routeGuardStatus,
      ownerConfirmation,
      ownerConfirmationFresh,
      sdkVendorBoundaryStatus,
    });
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const blockers = trustedLoaderOwnerHandoffBlockers({
    provisioning,
    evidence,
    preflight,
    gate,
    routeGuardStatus,
    ownerConfirmation,
    ownerConfirmationFresh,
    mockOwnerConfirmation,
    licenseBoundaryAcknowledged,
    sdkVendorBoundaryStatus,
  });
  const summary = {
    schema: TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA,
    safe_summary_only: true,
    trusted_loader_owner_handoff_status: "blocked",
    trusted_loader_owner_handoff_ready_candidate: false,
    trusted_loader_owner_handoff_blocked_reason: blockers[0] ?? "handoff_blocked_enablement_gate_blocked",
    trusted_loader_owner_handoff_blockers: blockers,
    trusted_loader_owner_handoff_required_confirmations: [
      "owner_confirmation_required",
      "fresh_real_evidence_required",
      "license_boundary_acknowledgement_required",
      "separate_owner_confirmed_enablement_pr_required",
    ],
    trusted_loader_owner_handoff_safe_next_action: "prepare_owner_review_only_no_enablement",
    trusted_loader_owner_handoff_runtime_readiness_claimed: false,
    trusted_loader_owner_handoff_production_readiness_claimed: false,
    handoff_status: "blocked",
    handoff_ready_candidate: false,
    handoff_blocked_reason: blockers[0] ?? "handoff_blocked_enablement_gate_blocked",
    required_owner_confirmations: "owner_confirmation_required",
    required_real_evidence: "fresh_real_evidence_required",
    required_route_guard_status: routeGuardStatus === "available" ? "available" : "handoff_blocked_missing_route_guard",
    required_evidence_collector_status: safeGateEvidenceStatus(evidence),
    required_allowlist_preflight_status: preflight.schema === TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA ? "available_disabled" : "handoff_blocked_missing_allowlist_preflight",
    required_enablement_gate_status: gate.trusted_loader_enablement_gate_status === "blocked" ? "handoff_blocked_enablement_gate_blocked" : "available_future_only",
    license_boundary_status: licenseBoundaryAcknowledged === true ? "acknowledged_future_only" : "handoff_blocked_license_attention_required",
    sdk_vendor_boundary_status: sdkVendorBoundaryStatus === "clear" ? "clear" : "handoff_blocked_sdk_vendor_boundary",
    candidate_status: trustedLoaderCandidateStatus(provisioning),
    freshness_status: evidence.evidence_freshness_status === "fresh" ? "fresh" : evidence.evidence_freshness_status ?? "missing",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "owner_review_preparation_only",
    residual_risks: [
      "fresh_real_evidence_required",
      "owner_confirmation_required",
      "actual_enablement_requires_separate_pr",
    ],
    do_not_continue_without_owner_confirmation: true,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    mock_owner_confirmation_rejected: mockOwnerConfirmation === true,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
    },
  };
  assertSafePublicObject(summary, "trusted loader owner handoff summary");
  return summary;
}

export function createFreshEvidenceBundleSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  allowlistPreflightSummary,
  enablementGateSummary,
  ownerHandoffSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
  mockOwnerConfirmation = false,
  licenseBoundaryAcknowledged = false,
  sdkVendorBoundaryStatus = "clear",
} = {}) {
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const preflight = allowlistPreflightSummary && typeof allowlistPreflightSummary === "object"
    ? allowlistPreflightSummary
    : createTrustedLoaderAllowlistPreflightSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, routeGuardStatus, ownerConfirmation });
  const gate = enablementGateSummary && typeof enablementGateSummary === "object"
    ? enablementGateSummary
    : createTrustedLoaderEnablementGateSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, routeGuardStatus, ownerConfirmation, sdkVendorBoundaryStatus });
  const handoff = ownerHandoffSummary && typeof ownerHandoffSummary === "object"
    ? ownerHandoffSummary
    : createTrustedLoaderOwnerHandoffSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, enablementGateSummary: gate, routeGuardStatus, ownerConfirmation, mockOwnerConfirmation, licenseBoundaryAcknowledged, sdkVendorBoundaryStatus });
  const blockers = freshEvidenceBundleBlockers({
    provisioning,
    evidence,
    preflight,
    gate,
    handoff,
    routeGuardStatus,
    ownerConfirmation,
    mockOwnerConfirmation,
    licenseBoundaryAcknowledged,
    sdkVendorBoundaryStatus,
  });
  const missingComponents = blockers.filter((reason) => reason.includes("missing"));
  const staleComponents = blockers.filter((reason) => reason.includes("stale"));
  const summary = {
    schema: FRESH_EVIDENCE_BUNDLE_SCHEMA,
    safe_summary_only: true,
    bundle_status: "blocked",
    bundle_ready_candidate: false,
    bundle_blocked_reason: blockers[0] ?? "bundle_blocked_missing_fresh_real_evidence",
    bundle_blocked_reasons: blockers,
    required_components: [
      "route_guard",
      "real_evidence_collector",
      "allowlist_preflight",
      "enablement_gate",
      "owner_handoff",
      "fresh_real_evidence",
      "owner_confirmation",
      "license_boundary",
      "sdk_vendor_boundary",
      "known_supported_candidate_kind",
      "safe_public_summary_only",
    ],
    missing_components: missingComponents,
    stale_components: staleComponents,
    fresh_components: evidence.evidence_freshness_status === "fresh" ? ["live2d_renderer_evidence"] : [],
    route_guard_status: routeGuardStatus === "available" ? "available" : "bundle_blocked_missing_route_guard",
    real_evidence_collector_status: safeGateEvidenceStatus(evidence),
    allowlist_preflight_status: preflight.schema === TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA ? "available_disabled_non_trusting" : "bundle_blocked_missing_allowlist_preflight",
    enablement_gate_status: gate.schema === TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA ? "fail_closed" : "bundle_blocked_missing_enablement_gate",
    owner_handoff_status: handoff.schema === TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA ? "review_only_blocked" : "bundle_blocked_missing_owner_handoff",
    owner_confirmation_status: mockOwnerConfirmation === true ? "bundle_blocked_mock_owner_confirmation" : ownerConfirmation === true ? "confirmed_future_only" : "bundle_blocked_missing_owner_confirmation",
    license_boundary_status: licenseBoundaryAcknowledged === true && provisioning.license_status === "not_applicable" ? "acknowledged_future_only" : "bundle_blocked_license_attention_required",
    sdk_vendor_boundary_status: sdkVendorBoundaryStatus === "clear" ? "clear" : "bundle_blocked_sdk_vendor_boundary",
    live2d_renderer_evidence_status: safeGateEvidenceStatus(evidence),
    live2d_heartbeat_freshness_status: evidence.evidence_freshness_status === "fresh" ? "fresh" : evidence.evidence_freshness_status ?? "missing",
    cue_capability_status: "safe_cue_covered",
    recovery_capability_status: "recovery_cue_covered",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "prepare_owner_review_only_wait_for_fresh_real_evidence",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
      review_preparation_only: true,
    },
  };
  assertSafePublicObject(summary, "fresh evidence bundle summary");
  return summary;
}

export function createGoNoGoPreflightSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  allowlistPreflightSummary,
  enablementGateSummary,
  ownerHandoffSummary,
  freshEvidenceBundleSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
  mockOwnerConfirmation = false,
  licenseBoundaryAcknowledged = false,
  sdkVendorBoundaryStatus = "clear",
  degradedModeAvailable = true,
} = {}) {
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const preflight = allowlistPreflightSummary && typeof allowlistPreflightSummary === "object"
    ? allowlistPreflightSummary
    : createTrustedLoaderAllowlistPreflightSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, routeGuardStatus, ownerConfirmation });
  const gate = enablementGateSummary && typeof enablementGateSummary === "object"
    ? enablementGateSummary
    : createTrustedLoaderEnablementGateSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, routeGuardStatus, ownerConfirmation, sdkVendorBoundaryStatus });
  const handoff = ownerHandoffSummary && typeof ownerHandoffSummary === "object"
    ? ownerHandoffSummary
    : createTrustedLoaderOwnerHandoffSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, enablementGateSummary: gate, routeGuardStatus, ownerConfirmation, mockOwnerConfirmation, licenseBoundaryAcknowledged, sdkVendorBoundaryStatus });
  const bundle = freshEvidenceBundleSummary && typeof freshEvidenceBundleSummary === "object"
    ? freshEvidenceBundleSummary
    : createFreshEvidenceBundleSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, enablementGateSummary: gate, ownerHandoffSummary: handoff, routeGuardStatus, ownerConfirmation, mockOwnerConfirmation, licenseBoundaryAcknowledged, sdkVendorBoundaryStatus });
  const reasons = goNoGoReasons({
    provisioning,
    evidence,
    preflight,
    gate,
    handoff,
    bundle,
    routeGuardStatus,
    ownerConfirmation,
    mockOwnerConfirmation,
    licenseBoundaryAcknowledged,
    sdkVendorBoundaryStatus,
    degradedModeAvailable,
  });
  const summary = {
    schema: GO_NOGO_PREFLIGHT_SCHEMA,
    safe_summary_only: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    no_go_reason: reasons[0] ?? "no_go_missing_fresh_real_evidence",
    no_go_reasons: reasons,
    required_components: [
      "route_guard",
      "real_evidence_collector",
      "allowlist_preflight",
      "enablement_gate",
      "owner_handoff",
      "fresh_evidence_bundle",
      "fresh_real_evidence",
      "owner_confirmation",
      "license_boundary",
      "sdk_vendor_boundary",
      "known_supported_candidate_kind",
      "safe_public_summary_only",
    ],
    missing_components: reasons.filter((reason) => reason.includes("missing")),
    stale_components: reasons.filter((reason) => reason.includes("stale")),
    fresh_components: evidence.evidence_freshness_status === "fresh" ? ["live2d_renderer_evidence"] : [],
    route_guard_status: routeGuardStatus === "available" ? "available" : "no_go_missing_route_guard",
    real_evidence_collector_status: safeGateEvidenceStatus(evidence),
    allowlist_preflight_status: preflight.schema === TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA ? "disabled_non_trusting" : "no_go_missing_allowlist_preflight",
    enablement_gate_status: gate.schema === TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA ? "fail_closed" : "no_go_missing_enablement_gate",
    owner_handoff_status: handoff.schema === TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA ? "review_only" : "no_go_missing_owner_handoff",
    fresh_evidence_bundle_status: bundle.schema === FRESH_EVIDENCE_BUNDLE_SCHEMA ? "review_preparation_only" : "no_go_missing_fresh_evidence_bundle",
    fresh_real_evidence_status: safeGateEvidenceStatus(evidence),
    owner_confirmation_status: mockOwnerConfirmation === true ? "no_go_mock_owner_confirmation" : ownerConfirmation === true ? "confirmed_future_only" : "no_go_missing_owner_confirmation",
    license_boundary_status: licenseBoundaryAcknowledged === true && provisioning.license_status === "not_applicable" ? "acknowledged_future_only" : "no_go_license_attention_required",
    sdk_vendor_boundary_status: sdkVendorBoundaryStatus === "clear" ? "clear" : "no_go_sdk_vendor_boundary",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    degraded_mode_available: degradedModeAvailable === true,
    safe_next_action: "owner_review_only_resolve_no_go_blockers_before_enablement",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
      review_preparation_only: true,
      degraded_mode_is_not_go: true,
    },
  };
  assertSafePublicObject(summary, "go no-go preflight summary");
  return summary;
}

export function createRealEvidenceIntakeSummary(evidence = {}, {
  nowMs = Date.now(),
  freshnessWindowMs = 5 * 60 * 1000,
  ownerConfirmation = false,
  mockOwnerConfirmation = false,
  licenseBoundaryAcknowledged = false,
  sdkVendorBoundaryStatus = "clear",
} = {}) {
  const source = evidence && typeof evidence === "object" ? evidence : {};
  const rawRejected = hasRawEvidenceMaterial(source);
  const sourceType = safeEvidenceLabel(source.source_type, "missing_source_type");
  const sourceTypeAllowed = REAL_EVIDENCE_INTAKE_SOURCE_TYPES.has(sourceType);
  const componentInput = safeEvidenceLabel(source.component, "missing_component");
  const component = REAL_EVIDENCE_INTAKE_COMPONENTS.has(componentInput)
    ? componentInput
    : componentInput === "missing_component"
      ? "missing_component"
      : "external_boundary_component";
  const evidenceTimestampMs = Number.isFinite(source.evidence_timestamp_ms) ? Math.trunc(source.evidence_timestamp_ms) : null;
  const freshnessStatus = realEvidenceFreshnessStatus(source, evidenceTimestampMs, nowMs, freshnessWindowMs);
  const reasons = realEvidenceIntakeReasons({
    source,
    sourceType,
    sourceTypeAllowed,
    component,
    evidenceTimestampMs,
    freshnessStatus,
    rawRejected,
    ownerConfirmation,
    mockOwnerConfirmation,
    licenseBoundaryAcknowledged,
    sdkVendorBoundaryStatus,
  });
  const summary = {
    schema: REAL_EVIDENCE_INTAKE_SCHEMA,
    safe_summary_only: true,
    evidence_intake_status: reasons.length > 0 ? "blocked" : "attention_required",
    intake_ready_candidate: false,
    intake_blocked_reason: reasons[0] ?? "intake_review_preparation_only",
    intake_blocked_reasons: reasons,
    accepted_source_type: sourceTypeAllowed && rawRejected !== true ? sourceType : "none",
    rejected_source_type: sourceTypeAllowed ? "none" : sourceType,
    component,
    component_status: safeEvidenceLabel(source.component_status, "missing_component_status"),
    evidence_timestamp_ms: evidenceTimestampMs === null ? "missing" : "present",
    freshness_status: freshnessStatus,
    evidence_source_kind: sourceTypeAllowed ? sourceType : "rejected_unknown_source_type",
    evidence_schema_status: source.schema_version ? "present" : "missing_schema_version",
    required_fields_status: requiredEvidenceFieldsStatus(source, evidenceTimestampMs),
    redaction_status: source.redaction_status === "pass" ? "pass" : "blocked_redaction_status_required",
    unsafe_material_rejected: rawRejected,
    fixture_evidence_status: sourceType === "fixture" ? "fixture_not_real_evidence" : "not_fixture",
    dry_run_evidence_status: sourceType === "dry_run" ? "dry_run_not_real_evidence" : "not_dry_run",
    stale_evidence_status: freshnessStatus === "stale" ? "stale_not_fresh_evidence" : "not_fresh_real_evidence",
    owner_confirmation_status: mockOwnerConfirmation === true ? "mock_owner_confirmation_rejected" : ownerConfirmation === true ? "owner_confirmation_required_for_future_review" : "missing_owner_confirmation",
    license_boundary_status: licenseBoundaryAcknowledged === true ? "acknowledged_future_only" : "license_attention_required",
    sdk_vendor_boundary_status: sdkVendorBoundaryStatus === "clear" ? "clear" : "sdk_vendor_boundary_blocked",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "collect_future_owner_confirmed_fresh_real_evidence_summary",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      review_preparation_only: true,
      no_unsafe_evidence_material: true,
    },
  };
  assertSafePublicObject(summary, "real evidence intake summary");
  return summary;
}

export function createOwnerConfirmationEnvelopeSummary(envelope = {}, {
  requiredScopes = OWNER_CONFIRMATION_SCOPES,
  requestedScope = "",
  nowMs = Date.now(),
} = {}) {
  const source = envelope && typeof envelope === "object" ? envelope : {};
  const required = requiredScopes.filter((scope) => OWNER_CONFIRMATION_SCOPE_SET.has(scope));
  const confirmationScope = safeEvidenceLabel(source.confirmation_scope, "missing_confirmation_scope");
  const confirmedByRole = safeEvidenceLabel(source.confirmed_by_role, "missing_confirmed_by_role");
  const sourceKind = safeEvidenceLabel(source.confirmation_source_kind, "missing_confirmation_source_kind");
  const timestampMs = Number.isFinite(source.confirmation_timestamp_ms) ? Math.trunc(source.confirmation_timestamp_ms) : null;
  const expiryMs = Number.isFinite(source.confirmation_expires_at_ms) ? Math.trunc(source.confirmation_expires_at_ms) : null;
  const scopeMismatch = requestedScope && confirmationScope !== requestedScope;
  const revoked = source.revoked === true || source.confirmation_status === "revoked";
  const mock = source.mock_confirmation === true || source.confirmation_source_kind === "mock";
  const fixture = source.confirmation_source_kind === "fixture";
  const dryRun = source.confirmation_source_kind === "dry_run";
  const expired = expiryMs !== null && expiryMs <= nowMs;
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source);
  const scopeConfirmed = false;
  const reasons = ownerConfirmationEnvelopeReasons({
    source,
    confirmationScope,
    confirmedByRole,
    sourceKind,
    timestampMs,
    expiryMs,
    scopeMismatch,
    revoked,
    mock,
    fixture,
    dryRun,
    expired,
    unsafeMaterialRejected,
  });
  const summary = {
    schema: OWNER_CONFIRMATION_ENVELOPE_SCHEMA,
    safe_summary_only: true,
    owner_confirmation_envelope_status: "blocked",
    confirmation_ready_candidate: false,
    confirmation_blocked_reason: reasons[0] ?? "confirmation_blocked_no_real_owner_confirmation",
    confirmation_blocked_reasons: reasons,
    required_confirmation_scopes: required,
    missing_confirmation_scopes: required,
    confirmed_scopes: scopeConfirmed ? [confirmationScope] : [],
    expired_scopes: expired && OWNER_CONFIRMATION_SCOPE_SET.has(confirmationScope) ? [confirmationScope] : [],
    revoked_scopes: revoked && OWNER_CONFIRMATION_SCOPE_SET.has(confirmationScope) ? [confirmationScope] : [],
    scope_mismatch_status: scopeMismatch ? "scope_mismatch_rejected" : "scope_specific_required",
    confirmed_by_role_status: confirmedByRole === "owner" ? "owner_role_required_future_only" : "wrong_role_rejected",
    confirmation_timestamp_ms: timestampMs === null ? "missing" : "present",
    confirmation_expiry_status: expired ? "expired_rejected" : expiryMs === null ? "expiry_required" : "not_expired_but_not_confirmed",
    confirmation_source_kind: sourceKind,
    confirmation_audit_ref_status: source.audit_ref ? "present" : "missing_audit_ref",
    mock_confirmation_status: mock ? "mock_confirmation_rejected" : "not_mock",
    owner_private_note_redaction_status: unsafeMaterialRejected ? "unsafe_material_rejected" : source.redaction_status === "pass" ? "pass" : "redaction_status_required",
    fresh_evidence_binding_status: "fresh_real_evidence_required",
    go_nogo_binding_status: "go_nogo_required_no_go_by_default",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "obtain_future_scope_specific_owner_confirmation_after_real_evidence_review",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      review_preparation_only: true,
      no_unsafe_confirmation_material: true,
    },
  };
  assertSafePublicObject(summary, "owner confirmation envelope summary");
  return summary;
}

export function createRealEvidenceRequestPacketSummary(packet = {}, {
  requiredComponents = REAL_EVIDENCE_REQUEST_COMPONENTS,
  requiredScopes = OWNER_CONFIRMATION_SCOPES,
} = {}) {
  const source = packet && typeof packet === "object" ? packet : {};
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source);
  const redactionStatus = source.redaction_status === "pass" ? "pass" : "redaction_status_required";
  const reasons = realEvidenceRequestPacketReasons({ source, unsafeMaterialRejected, redactionStatus });
  const componentStatuses = Object.fromEntries(requiredComponents.map((component) => [component, "pending_required"]));
  const scopeStatuses = Object.fromEntries(requiredScopes.map((scope) => [scope, "pending_required"]));
  const summary = {
    schema: REAL_EVIDENCE_REQUEST_PACKET_SCHEMA,
    safe_summary_only: true,
    real_evidence_request_packet_status: "blocked",
    request_packet_ready_candidate: false,
    request_packet_blocked_reason: reasons[0] ?? "request_packet_blocked_missing_real_resident_evidence",
    request_packet_blocked_reasons: reasons,
    required_evidence_components: requiredComponents,
    missing_evidence_components: requiredComponents,
    required_confirmation_scopes: requiredScopes,
    missing_confirmation_scopes: requiredScopes,
    required_freshness_thresholds: {
      live2d_renderer_heartbeat: "fresh_real_resident_evidence_required",
      cue_capability: "fresh_real_resident_evidence_required",
      recovery_capability: "fresh_real_resident_evidence_required",
      priority1: "real_resident_fresh_evidence_required",
      motion_dataset: "real_rows_required_checked_row_count_gt_0",
    },
    required_audit_refs: "required_pending",
    required_redaction_status: "pass_required",
    route_guard_evidence_request: componentStatuses.live2d_route_guard,
    real_evidence_collector_request: componentStatuses.live2d_evidence_collector,
    fresh_evidence_bundle_request: componentStatuses.live2d_fresh_evidence_bundle,
    real_evidence_intake_request: componentStatuses.live2d_real_evidence_intake,
    go_nogo_preflight_request: componentStatuses.live2d_go_nogo_preflight,
    owner_confirmation_envelope_request: componentStatuses.live2d_owner_confirmation_envelope,
    trusted_loader_preflight_request: componentStatuses.trusted_loader_preflight,
    enablement_gate_request: componentStatuses.trusted_loader_enablement_gate,
    owner_handoff_request: componentStatuses.trusted_loader_owner_handoff,
    license_boundary_request: componentStatuses.license_boundary,
    sdk_vendor_boundary_request: componentStatuses.sdk_vendor_boundary,
    priority1_evidence_request: componentStatuses.priority1_real_resident_evidence,
    motion_dataset_evidence_request: componentStatuses.motion_dataset_row_evidence,
    evidence_component_statuses: componentStatuses,
    confirmation_scope_statuses: scopeStatuses,
    fixture_evidence_status: "fixture_not_real_evidence",
    dry_run_evidence_status: "dry_run_not_real_evidence",
    stale_evidence_status: "stale_not_fresh_evidence",
    mock_owner_confirmation_status: "mock_owner_confirmation_not_real",
    wrong_role_confirmation_status: "wrong_role_confirmation_rejected",
    expired_confirmation_status: "expired_confirmation_rejected",
    revoked_confirmation_status: "revoked_confirmation_rejected",
    unsafe_request_note_status: unsafeMaterialRejected ? "unsafe_material_rejected" : "request_note_forbidden",
    unsafe_owner_note_status: unsafeMaterialRejected ? "unsafe_material_rejected" : "owner_note_forbidden",
    unsafe_evidence_body_status: unsafeMaterialRejected ? "unsafe_material_rejected" : "evidence_body_forbidden",
    redaction_status: redactionStatus,
    request_packet_collects_real_evidence: false,
    request_packet_performs_live_probes: false,
    request_packet_creates_owner_confirmation: false,
    request_packet_completeness_is_readiness: false,
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    real_evidence_intake_status: "schema_only_blocked_or_attention",
    go_nogo_status: "no_go",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "owner_operator_supplies_future_fresh_real_evidence_after_review",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      review_preparation_only: true,
      no_unsafe_evidence_material: true,
      request_only_no_collection: true,
    },
  };
  assertSafePublicObject(summary, "real evidence request packet summary");
  return summary;
}

export function createRealResidentEvidenceCollectionPlanSummary(plan = {}, {
  requiredComponents = REAL_EVIDENCE_REQUEST_COMPONENTS,
  requiredScopes = OWNER_CONFIRMATION_SCOPES,
} = {}) {
  const source = plan && typeof plan === "object" ? plan : {};
  const sourceType = safeEvidenceLabel(source.source_type ?? source.source_kind, "unknown_source_type");
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const rejectedSourceType = REJECTED_REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES.includes(sourceType);
  const componentStatuses = Object.fromEntries(requiredComponents.map((component) => [component, "missing_required"]));
  const scopeStatuses = Object.fromEntries(requiredScopes.map((scope) => [scope, "pending_required"]));
  const blockedReasons = [
    "collection_plan_only_not_collection",
    "collection_plan_blocked_missing_real_resident_evidence",
    "collection_plan_blocked_missing_owner_confirmation",
    "collection_plan_blocked_priority1_unresolved",
    "collection_plan_blocked_motion_dataset_non_executable",
    "collection_plan_not_runtime_ready",
    "collection_plan_not_production_ready",
  ];
  if (rejectedSourceType) blockedReasons.push(`collection_plan_rejected_${sourceType}`);
  if (unsafeMaterialRejected) blockedReasons.push("collection_plan_rejected_forbidden_raw_field");
  const summary = {
    schema: REAL_RESIDENT_EVIDENCE_COLLECTION_PLAN_SCHEMA,
    safe_summary_only: true,
    real_resident_evidence_collection_plan_status: "planning_only",
    planning_only_boundary: true,
    collection_plan_ready_candidate: false,
    ready_candidate: false,
    collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    required_components: requiredComponents,
    missing_components: requiredComponents,
    component_statuses: componentStatuses,
    required_freshness_thresholds: {
      live2d_renderer_heartbeat: "fresh_real_resident_summary_required",
      live2d_model_configured_status: "fresh_real_resident_summary_required",
      live2d_cue_capability: "fresh_real_resident_summary_required",
      live2d_recovery_capability: "fresh_real_resident_summary_required",
      priority1: "real_resident_fresh_evidence_required",
      motion_dataset: "real_rows_required_checked_row_count_gt_0",
    },
    required_owner_confirmation_scopes: requiredScopes,
    owner_confirmation_scope_statuses: scopeStatuses,
    required_audit_refs: [
      "route_guard_review",
      "real_evidence_collector_review",
      "real_evidence_intake_review",
      "owner_confirmation_envelope_review",
      "go_nogo_preflight_review",
    ],
    required_redaction_status: "pass_required",
    accepted_source_types: REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES,
    rejected_source_types: REJECTED_REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES,
    source_type_status: rejectedSourceType ? `rejected_${sourceType}` : "future_source_type_required",
    forbidden_material_classes: REAL_RESIDENT_EVIDENCE_COLLECTION_FORBIDDEN_MATERIAL_CLASSES,
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    safe_collection_sequence: REAL_RESIDENT_EVIDENCE_COLLECTION_SEQUENCE,
    safe_next_action: "prepare_owner_confirmed_future_collection_task_after_plan_review",
    request_packet_status: "request_only_no_collection",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    trusted_loader_allowlist_enabled: false,
    trusted_loader_allowlist_status: "disabled",
    no_loader_trusted: true,
    candidate_present_diagnostic_only: true,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    collection_plan_collects_real_evidence: false,
    collection_plan_performs_live_probes: false,
    collection_plan_creates_owner_confirmation: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(summary, "real resident evidence collection plan summary");
  return summary;
}

export function createRealEvidenceFreshnessThresholdSummary(threshold = {}, {
  requiredComponents = REAL_EVIDENCE_REQUEST_COMPONENTS,
} = {}) {
  const source = threshold && typeof threshold === "object" ? threshold : {};
  const sourceKind = safeEvidenceLabel(source.source_kind ?? source.source_type, "missing");
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const componentThresholds = Object.fromEntries(requiredComponents.map((component) => [component, {
    threshold_units: "safe_age_bucket",
    freshness_status: "missing",
    freshness_bucket: "future_real_resident_evidence_required",
    required_evidence_policy: "future_owner_confirmed_real_resident_evidence_required",
  }]));
  const pendingComponents = [...requiredComponents];
  const blockedReasons = [
    "freshness_threshold_plan_only_not_collection",
    "freshness_threshold_blocked_missing_real_resident_evidence",
    "freshness_threshold_blocked_missing_owner_confirmation",
    "freshness_threshold_blocked_priority1_unresolved",
    "freshness_threshold_blocked_motion_dataset_non_executable",
    "freshness_threshold_not_runtime_ready",
    "freshness_threshold_not_production_ready",
  ];
  if (sourceKind === "fixture") blockedReasons.push("freshness_threshold_fixture_evidence_not_real");
  if (sourceKind === "dry_run") blockedReasons.push("freshness_threshold_dry_run_evidence_not_real");
  if (sourceKind === "mock") blockedReasons.push("freshness_threshold_mock_evidence_not_real");
  if (source.freshness_status === "stale") blockedReasons.push("freshness_threshold_stale_evidence_not_fresh");
  if (sourceKind === "manual_summary") blockedReasons.push("freshness_threshold_manual_summary_requires_owner_confirmation");
  if (sourceKind === "operator_confirmed_summary") blockedReasons.push("freshness_threshold_operator_summary_requires_scope_specific_owner_confirmation");
  if (sourceKind === "owner_confirmed_reference") blockedReasons.push("freshness_threshold_owner_reference_schema_only_until_real_confirmation");
  if (unsafeMaterialRejected) blockedReasons.push("freshness_threshold_rejected_forbidden_raw_field");
  const summary = {
    schema: REAL_EVIDENCE_FRESHNESS_THRESHOLD_SCHEMA,
    safe_summary_only: true,
    real_evidence_freshness_threshold_status: unsafeMaterialRejected ? "blocked" : "planning_only",
    planning_only_boundary: true,
    freshness_policy_ready_candidate: false,
    component_thresholds_defined: requiredComponents,
    component_thresholds_pending: pendingComponents,
    component_thresholds: componentThresholds,
    threshold_units: ["safe_age_bucket", "component_label"],
    allowed_freshness_statuses: ["fresh_candidate", "stale", "missing", "blocked", "attention_required", "not_applicable"],
    stale_evidence_policy: "stale_evidence_cannot_resolve_readiness_or_priority1",
    missing_evidence_policy: "missing_evidence_remains_blocked",
    fixture_evidence_policy: "fixture_evidence_never_fresh_real_evidence",
    dry_run_evidence_policy: "dry_run_evidence_never_fresh_real_evidence",
    mock_evidence_policy: "mock_evidence_never_fresh_real_evidence",
    manual_summary_policy: "manual_summary_without_owner_confirmation_not_fresh_real_evidence",
    operator_confirmed_summary_policy: "operator_summary_without_scope_specific_owner_confirmation_not_fresh_real_evidence",
    real_probe_summary_policy: "future_safe_summary_only_no_probe_started_by_this_schema",
    owner_confirmed_reference_policy: "schema_only_pending_real_owner_confirmation",
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    safe_next_action: "define_future_owner_confirmed_real_evidence_collection_task_after_threshold_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(summary, "real evidence freshness threshold summary");
  return summary;
}

export function createSafeEvidenceSummaryContractSummary(summaryInput = {}) {
  const source = summaryInput && typeof summaryInput === "object" ? summaryInput : {};
  const sourceType = safeEvidenceLabel(source.evidence_source_type ?? source.source_type, "missing");
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const rejectedSourceType = SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES.includes(sourceType) || sourceType === "raw_payload";
  const missingSourceBinding = !source.evidence_ref || !source.safe_audit_ref || !source.head_sha_ref || !source.run_id_ref;
  const missingFreshnessBinding = !source.freshness_status;
  const missingRedactionStatus = source.redaction_status !== "safe_summary_only";
  const blockedReasons = [
    "safe_evidence_summary_contract_planning_only_not_collection",
    "safe_evidence_summary_contract_blocked_missing_real_resident_evidence",
    "safe_evidence_summary_contract_blocked_missing_owner_confirmation",
    "safe_evidence_summary_contract_blocked_priority1_unresolved",
    "safe_evidence_summary_contract_blocked_motion_dataset_non_executable",
    "safe_evidence_summary_contract_not_runtime_ready",
    "safe_evidence_summary_contract_not_production_ready",
  ];
  if (unsafeMaterialRejected) blockedReasons.push("safe_evidence_summary_contract_rejected_raw_field");
  if (rejectedSourceType) blockedReasons.push("safe_evidence_summary_contract_rejected_source_type");
  if (missingSourceBinding) blockedReasons.push("safe_evidence_summary_contract_missing_source_binding");
  if (missingFreshnessBinding) blockedReasons.push("safe_evidence_summary_contract_missing_freshness_binding");
  if (missingRedactionStatus) blockedReasons.push("safe_evidence_summary_contract_missing_redaction_status");
  if (sourceType === "manual_upload_summary") blockedReasons.push("safe_evidence_summary_contract_manual_summary_requires_owner_confirmation");
  if (sourceType === "operator_confirmed_summary") blockedReasons.push("safe_evidence_summary_contract_operator_summary_requires_scope_specific_owner_confirmation");
  if (sourceType === "owner_confirmed_reference") blockedReasons.push("safe_evidence_summary_contract_owner_reference_schema_only_until_real_confirmation");

  const contract = {
    schema: LIVE2D_SAFE_EVIDENCE_SUMMARY_CONTRACT_SCHEMA,
    safe_summary_only: true,
    safe_evidence_summary_contract_status: unsafeMaterialRejected || rejectedSourceType ? "blocked" : "planning_only",
    planning_only_boundary: true,
    summary_contract_ready_candidate: false,
    accepted_summary_fields: SAFE_EVIDENCE_SUMMARY_ACCEPTED_FIELDS,
    required_source_binding: ["evidence_source_type", "evidence_ref", "safe_audit_ref", "head_sha_ref", "run_id_ref", "file_scope"],
    required_freshness_binding: ["freshness_status", "checked_at_bucket", "status_reason_code"],
    required_audit_binding: ["safe_audit_ref", "head_sha_ref", "run_id_ref", "redaction_status", "blocker_labels"],
    required_redaction_status: "safe_summary_only",
    rejected_material_classes: SAFE_EVIDENCE_SUMMARY_REJECTED_RAW_FIELDS,
    rejected_source_types: SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES,
    accepted_source_types: SAFE_EVIDENCE_SUMMARY_ACCEPTED_SOURCE_TYPES,
    required_bindings: SAFE_EVIDENCE_SUMMARY_REQUIRED_BINDINGS,
    safe_evidence_summary_policy: "summary_contract_only_not_real_evidence",
    evidence_fidelity_policy: "safe_summary_must_preserve_source_freshness_audit_redaction_and_blockers",
    minimal_surface_policy: "compressed_summary_must_preserve_priority1_motion_no_readiness_owner_pending_file_scope_head_run_audit_refs",
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    source_binding_status: missingSourceBinding ? "missing" : "present",
    freshness_binding_status: missingFreshnessBinding ? "missing" : "present",
    audit_binding_status: missingSourceBinding || missingRedactionStatus ? "missing" : "present",
    redaction_status: missingRedactionStatus ? "missing_safe_summary_only" : "safe_summary_only",
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    freshness_threshold_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    safe_next_action: "create_separate_owner_confirmed_real_evidence_collection_task_after_contract_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_evidence_body_material: true,
      no_cue_body_material: true,
      no_renderer_body_material: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
      no_private_local_paths: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(contract, "safe evidence summary contract");
  return contract;
}

function realEvidenceRequestPacketReasons({ source, unsafeMaterialRejected, redactionStatus }) {
  const reasons = [
    "request_packet_blocked_missing_real_resident_evidence",
    "request_packet_blocked_missing_owner_confirmation",
    "request_packet_blocked_priority1_unresolved",
    "request_packet_blocked_motion_dataset_non_executable",
    "request_packet_not_runtime_ready",
    "request_packet_not_production_ready",
  ];
  if (!source.audit_ref) reasons.push("request_packet_blocked_missing_audit_ref");
  if (redactionStatus !== "pass") reasons.push("request_packet_blocked_redaction_status_required");
  if (unsafeMaterialRejected) reasons.push("request_packet_blocked_unsafe_material_rejected");
  if (source.source_kind === "fixture") reasons.push("request_packet_blocked_fixture_evidence_only");
  if (source.source_kind === "dry_run") reasons.push("request_packet_blocked_dry_run_evidence_only");
  if (source.freshness_status === "stale") reasons.push("request_packet_blocked_stale_evidence");
  if (source.mock_owner_confirmation === true) reasons.push("request_packet_blocked_mock_owner_confirmation");
  if (source.confirmed_by_role && source.confirmed_by_role !== "owner") reasons.push("request_packet_blocked_wrong_role_confirmation");
  if (source.confirmation_status === "expired") reasons.push("request_packet_blocked_expired_confirmation");
  if (source.confirmation_status === "revoked") reasons.push("request_packet_blocked_revoked_confirmation");
  return [...new Set(reasons)];
}

function ownerConfirmationEnvelopeReasons({
  source,
  confirmationScope,
  confirmedByRole,
  sourceKind,
  timestampMs,
  expiryMs,
  scopeMismatch,
  revoked,
  mock,
  fixture,
  dryRun,
  expired,
  unsafeMaterialRejected,
}) {
  const reasons = [];
  if (!source.confirmation_scope) reasons.push("confirmation_blocked_missing_scope");
  if (source.confirmation_scope && !OWNER_CONFIRMATION_SCOPE_SET.has(confirmationScope)) reasons.push("confirmation_blocked_unknown_scope");
  if (timestampMs === null) reasons.push("confirmation_blocked_missing_timestamp");
  if (!source.confirmed_by_role) reasons.push("confirmation_blocked_missing_role");
  if (confirmedByRole !== "owner") reasons.push("confirmation_blocked_wrong_role");
  if (!source.confirmation_source_kind) reasons.push("confirmation_blocked_missing_source_kind");
  if (!source.audit_ref) reasons.push("confirmation_blocked_missing_audit_ref");
  if (source.redaction_status !== "pass") reasons.push("confirmation_blocked_redaction_status_required");
  if (mock) reasons.push("confirmation_blocked_mock_confirmation");
  if (fixture) reasons.push("confirmation_blocked_fixture_confirmation");
  if (dryRun) reasons.push("confirmation_blocked_dry_run_confirmation");
  if (expiryMs === null) reasons.push("confirmation_blocked_missing_expiry");
  if (expired) reasons.push("confirmation_blocked_expired_confirmation");
  if (revoked) reasons.push("confirmation_blocked_revoked_confirmation");
  if (scopeMismatch) reasons.push("confirmation_blocked_scope_mismatch");
  if (unsafeMaterialRejected) reasons.push("confirmation_blocked_unsafe_material_rejected");
  reasons.push("confirmation_blocked_no_real_owner_confirmation");
  reasons.push("confirmation_blocked_priority1_unresolved");
  reasons.push("confirmation_blocked_motion_dataset_non_executable");
  reasons.push("confirmation_not_runtime_ready");
  reasons.push("confirmation_not_production_ready");
  if (sourceKind === "remote_quality_gate" || sourceKind === "local_check" || sourceKind === "target_harness" || sourceKind === "browser_smoke") {
    reasons.push("confirmation_blocked_auto_confirmation_source");
  }
  return [...new Set(reasons)];
}

function realEvidenceIntakeReasons({
  source,
  sourceType,
  sourceTypeAllowed,
  component,
  evidenceTimestampMs,
  freshnessStatus,
  rawRejected,
  ownerConfirmation,
  mockOwnerConfirmation,
  licenseBoundaryAcknowledged,
  sdkVendorBoundaryStatus,
}) {
  const reasons = [];
  if (!source.schema_version) reasons.push("intake_blocked_missing_schema_version");
  if (!source.source_type) reasons.push("intake_blocked_missing_source_type");
  if (source.source_type && sourceTypeAllowed !== true) reasons.push("intake_blocked_unknown_source_type");
  if (!source.component) reasons.push("intake_blocked_missing_component");
  if (component === "external_boundary_component") reasons.push("intake_blocked_external_boundary_component");
  if (!source.component_status) reasons.push("intake_blocked_missing_component_status");
  if (evidenceTimestampMs === null) reasons.push("intake_blocked_missing_timestamp");
  if (freshnessStatus === "stale") reasons.push("intake_blocked_stale_evidence");
  if (sourceType === "fixture") reasons.push("intake_blocked_fixture_evidence_only");
  if (sourceType === "dry_run") reasons.push("intake_blocked_dry_run_evidence_only");
  if (sourceType === "manual_summary" && ownerConfirmation !== true) reasons.push("intake_blocked_manual_summary_without_owner_confirmation");
  if (mockOwnerConfirmation === true) reasons.push("intake_blocked_mock_owner_confirmation");
  if (source.redaction_status !== "pass") reasons.push("intake_blocked_redaction_status_required");
  if (rawRejected === true) reasons.push("intake_blocked_unsafe_material_rejected");
  if (licenseBoundaryAcknowledged !== true) reasons.push("intake_blocked_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") reasons.push("intake_blocked_sdk_vendor_boundary");
  reasons.push("intake_blocked_priority1_unresolved");
  reasons.push("intake_blocked_motion_dataset_non_executable");
  reasons.push("intake_not_runtime_ready");
  reasons.push("intake_not_production_ready");
  return [...new Set(reasons)];
}

function safeEvidenceLabel(value, fallback) {
  return safeText(value) || fallback;
}

function realEvidenceFreshnessStatus(source, evidenceTimestampMs, nowMs, freshnessWindowMs) {
  if (source.freshness_status === "stale") return "stale";
  if (source.freshness_status === "fresh" && evidenceTimestampMs !== null && nowMs - evidenceTimestampMs <= freshnessWindowMs) return "fresh_summary_not_readiness";
  if (evidenceTimestampMs === null) return "missing_timestamp";
  if (nowMs - evidenceTimestampMs > freshnessWindowMs) return "stale";
  return "not_fresh_real_evidence";
}

function requiredEvidenceFieldsStatus(source, evidenceTimestampMs) {
  return source.schema_version && source.source_type && source.component && source.component_status && evidenceTimestampMs !== null
    ? "present"
    : "missing_required_fields";
}

function hasRawEvidenceMaterial(source) {
  const stack = [source];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`).toLowerCase();
      if (RAW_EVIDENCE_FIELD_NAMES.has(normalizedKey)) return true;
      if (typeof value === "string" && UNSAFE_ENV_VALUE_PATTERNS.some((pattern) => pattern.test(value))) return true;
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return false;
}

function hasCollectionPlanForbiddenMaterial(source) {
  const stack = [source];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`).toLowerCase();
      if (RAW_EVIDENCE_FIELD_NAMES.has(normalizedKey)) return true;
      if ([
        "model_path",
        "motion_path",
        "endpoint_value",
        "token_value",
        "secret_value",
        "private_local_path",
        "shell_command_body",
        "obs_command",
        "world_command",
      ].includes(normalizedKey)) return true;
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return false;
}

function goNoGoReasons({
  provisioning,
  evidence,
  preflight,
  gate,
  handoff,
  bundle,
  routeGuardStatus,
  ownerConfirmation,
  mockOwnerConfirmation,
  licenseBoundaryAcknowledged,
  sdkVendorBoundaryStatus,
  degradedModeAvailable,
}) {
  const reasons = [];
  if (routeGuardStatus !== "available") reasons.push("no_go_missing_route_guard");
  if (!evidence || evidence.live2d_evidence_status === undefined) reasons.push("no_go_missing_real_evidence_collector");
  if (preflight.schema !== TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA) reasons.push("no_go_missing_allowlist_preflight");
  if (gate.schema !== TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA) reasons.push("no_go_missing_enablement_gate");
  if (handoff.schema !== TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA) reasons.push("no_go_missing_owner_handoff");
  if (bundle.schema !== FRESH_EVIDENCE_BUNDLE_SCHEMA) reasons.push("no_go_missing_fresh_evidence_bundle");
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") reasons.push("no_go_missing_fresh_real_evidence");
  if (evidence.evidence_freshness_status === "stale") reasons.push("no_go_stale_real_evidence");
  if (evidence.evidence_freshness_status !== "fresh") reasons.push("no_go_missing_fresh_real_evidence");
  if (evidence.fixture_evidence_status === "fixture_only") reasons.push("no_go_fixture_evidence_only");
  if (evidence.dry_run_evidence_status === "dry_run_only") reasons.push("no_go_dry_run_evidence_only");
  if (ownerConfirmation !== true) reasons.push("no_go_missing_owner_confirmation");
  if (mockOwnerConfirmation === true) reasons.push("no_go_mock_owner_confirmation");
  if (licenseBoundaryAcknowledged !== true || provisioning.license_status !== "not_applicable") reasons.push("no_go_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") reasons.push("no_go_sdk_vendor_boundary");
  reasons.push("no_go_priority1_unresolved");
  reasons.push("no_go_motion_dataset_non_executable");
  reasons.push("no_go_runtime_not_ready");
  reasons.push("no_go_production_not_ready");
  if (degradedModeAvailable === true) reasons.push("degraded_mode_available_not_go");
  return [...new Set(reasons)];
}

function freshEvidenceBundleBlockers({
  provisioning,
  evidence,
  preflight,
  gate,
  handoff,
  routeGuardStatus,
  ownerConfirmation,
  mockOwnerConfirmation,
  licenseBoundaryAcknowledged,
  sdkVendorBoundaryStatus,
}) {
  const blockers = [];
  if (routeGuardStatus !== "available") blockers.push("bundle_blocked_missing_route_guard");
  if (!evidence || evidence.live2d_evidence_status === undefined) blockers.push("bundle_blocked_missing_real_evidence_collector");
  if (preflight.schema !== TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA) blockers.push("bundle_blocked_missing_allowlist_preflight");
  if (gate.schema !== TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA) blockers.push("bundle_blocked_missing_enablement_gate");
  if (handoff.schema !== TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA) blockers.push("bundle_blocked_missing_owner_handoff");
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") blockers.push("bundle_blocked_missing_fresh_real_evidence");
  if (evidence.evidence_freshness_status === "stale") blockers.push("bundle_blocked_stale_real_evidence");
  if (evidence.evidence_freshness_status !== "fresh") blockers.push("bundle_blocked_missing_fresh_real_evidence");
  if (evidence.fixture_evidence_status === "fixture_only") blockers.push("bundle_blocked_fixture_evidence_only");
  if (evidence.dry_run_evidence_status === "dry_run_only") blockers.push("bundle_blocked_dry_run_evidence_only");
  if (ownerConfirmation !== true) blockers.push("bundle_blocked_missing_owner_confirmation");
  if (mockOwnerConfirmation === true) blockers.push("bundle_blocked_mock_owner_confirmation");
  if (licenseBoundaryAcknowledged !== true || provisioning.license_status !== "not_applicable") blockers.push("bundle_blocked_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") blockers.push("bundle_blocked_sdk_vendor_boundary");
  blockers.push("bundle_blocked_priority1_unresolved");
  blockers.push("bundle_blocked_motion_dataset_non_executable");
  blockers.push("bundle_not_runtime_ready");
  blockers.push("bundle_not_production_ready");
  return [...new Set(blockers)];
}

function trustedLoaderOwnerHandoffBlockers({
  provisioning,
  evidence,
  preflight,
  gate,
  routeGuardStatus,
  ownerConfirmation,
  ownerConfirmationFresh,
  mockOwnerConfirmation,
  licenseBoundaryAcknowledged,
  sdkVendorBoundaryStatus,
}) {
  const blockers = [];
  if (routeGuardStatus !== "available") blockers.push("handoff_blocked_missing_route_guard");
  if (preflight.schema !== TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA) blockers.push("handoff_blocked_missing_allowlist_preflight");
  if (gate.schema !== TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA || gate.trusted_loader_enablement_gate_status === "blocked") blockers.push("handoff_blocked_enablement_gate_blocked");
  if (preflight.trusted_loader_allowlist_status === "disabled") blockers.push("handoff_blocked_allowlist_disabled");
  if (provisioning.provisioning_status === "candidate_present") blockers.push("handoff_candidate_present_diagnostic_only");
  if (provisioning.loader_kind === "unsupported_loader_kind") blockers.push("handoff_blocked_unknown_loader_kind");
  if (provisioning.provisioning_status === "future_only") blockers.push("handoff_blocked_future_only_loader_kind");
  if (licenseBoundaryAcknowledged !== true || provisioning.license_status !== "not_applicable") blockers.push("handoff_blocked_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") blockers.push("handoff_blocked_sdk_vendor_boundary");
  if (mockOwnerConfirmation === true) blockers.push("handoff_blocked_mock_owner_confirmation");
  if (ownerConfirmation !== true) blockers.push("handoff_blocked_missing_owner_confirmation");
  if (ownerConfirmation === true && ownerConfirmationFresh !== true) blockers.push("handoff_blocked_expired_owner_confirmation");
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") blockers.push("handoff_blocked_missing_real_evidence");
  if (evidence.evidence_freshness_status === "stale") blockers.push("handoff_blocked_stale_real_evidence");
  if (evidence.evidence_freshness_status !== "fresh") blockers.push("handoff_blocked_missing_real_evidence");
  if (evidence.fixture_evidence_status === "fixture_only") blockers.push("handoff_blocked_fixture_evidence_only");
  if (evidence.dry_run_evidence_status === "dry_run_only") blockers.push("handoff_blocked_dry_run_evidence_only");
  blockers.push("handoff_blocked_priority1_unresolved");
  blockers.push("handoff_blocked_motion_dataset_non_executable");
  blockers.push("handoff_not_runtime_ready");
  blockers.push("handoff_not_production_ready");
  return [...new Set(blockers)];
}

function trustedLoaderEnablementBlockers({
  provisioning,
  evidence,
  preflight,
  routeGuardStatus,
  ownerConfirmation,
  ownerConfirmationFresh,
  sdkVendorBoundaryStatus,
}) {
  const blockers = [];
  if (routeGuardStatus !== "available") blockers.push("blocked_missing_route_guard");
  if (preflight.schema !== TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA) blockers.push("blocked_missing_allowlist_preflight");
  if (preflight.trusted_loader_allowlist_status === "disabled") blockers.push("blocked_allowlist_disabled");
  if (provisioning.provisioning_status === "candidate_present") blockers.push("candidate_present_diagnostic_only");
  if (provisioning.loader_kind === "unsupported_loader_kind") blockers.push("blocked_unknown_loader_kind");
  if (provisioning.provisioning_status === "future_only") blockers.push("blocked_future_only_loader_kind");
  if (provisioning.license_status !== "not_applicable") blockers.push("blocked_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") blockers.push("blocked_sdk_vendor_boundary");
  if (ownerConfirmation !== true) blockers.push("blocked_missing_owner_confirmation");
  if (ownerConfirmation === true && ownerConfirmationFresh !== true) blockers.push("blocked_owner_confirmation_expired");
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") blockers.push("blocked_missing_real_evidence");
  if (evidence.evidence_freshness_status === "stale") blockers.push("blocked_stale_real_evidence");
  if (evidence.evidence_freshness_status !== "fresh") blockers.push("blocked_missing_real_evidence");
  if (evidence.fixture_evidence_status === "fixture_only") blockers.push("blocked_fixture_evidence_only");
  if (evidence.dry_run_evidence_status === "dry_run_only") blockers.push("blocked_dry_run_evidence_only");
  blockers.push("blocked_priority1_unresolved");
  blockers.push("blocked_motion_dataset_non_executable");
  blockers.push("not_runtime_ready");
  blockers.push("not_production_ready");
  return [...new Set(blockers)];
}

function safeGateEvidenceStatus(evidence) {
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") return "blocked_missing_real_evidence";
  if (evidence.fixture_evidence_status === "fixture_only") return "blocked_fixture_evidence_only";
  if (evidence.dry_run_evidence_status === "dry_run_only") return "blocked_dry_run_evidence_only";
  if (evidence.evidence_freshness_status === "stale") return "blocked_stale_real_evidence";
  if (evidence.evidence_freshness_status !== "fresh") return "blocked_missing_real_evidence";
  return "fresh_real_evidence_attention_required";
}

function trustedLoaderCandidateStatus(provisioning) {
  if (provisioning.provisioning_status === "candidate_present") return "candidate_present_diagnostic_only";
  if (provisioning.loader_kind === "unsupported_loader_kind") return "blocked_unknown_loader";
  if (provisioning.provisioning_status === "future_only") return "future_only";
  if (provisioning.provisioning_status === "operator_attention_required") return "operator_attention_required";
  if (provisioning.provisioning_status === "unsafe_configuration") return "unsafe_configuration";
  if (provisioning.provisioning_status === "not_configured") return "not_configured";
  return "license_attention_required";
}

function configuredLoaderEnvNames(env) {
  return ALLOWED_CUBISM_LOADER_ENV_NAMES.filter((name) => String(env[name] ?? "").trim());
}

function hasUnsafeConfiguredEnvValue(env, envNames) {
  return envNames.some((name) => {
    const value = String(env[name] ?? "");
    return UNSAFE_ENV_VALUE_PATTERNS.some((pattern) => pattern.test(value));
  });
}

function inferConfiguredLoaderKind(env) {
  return ALLOWED_CUBISM_LOADER_ENV_NAMES.some((name) => FRAMEWORK_FILE_ENV_NAMES.has(name) && String(env[name] ?? "").trim())
    ? DEFAULT_LOADER_KIND
    : "not_configured";
}

function safeEnvNames(envNames) {
  return [...new Set(envNames)]
    .filter((name) => ALLOWED_CUBISM_LOADER_ENV_NAMES.includes(name))
    .map((name) => safeText(name, 120))
    .filter(Boolean);
}

function normalizeLoaderKind(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return /^[a-z0-9_]{1,80}$/u.test(text) ? text : "unsupported_loader_kind";
}

function safeLoaderKind(value) {
  const text = normalizeLoaderKind(value) || "not_configured";
  if (CUBISM_LOADER_KIND_CANDIDATES.includes(text) || text === "not_configured") return text;
  return "unsupported_loader_kind";
}

function safeProvisioningStatus(status) {
  const text = String(status ?? "").trim();
  return PROVISIONING_STATUS.has(text) ? text : "unsafe_configuration";
}

function safeLoaderDependencyStatus(status) {
  const text = String(status ?? "").trim();
  return LOADER_DEPENDENCY_STATUS.has(text) ? text : "operator_attention_required";
}

function safeLicenseStatus(status) {
  const text = String(status ?? "").trim();
  return LICENSE_STATUS.has(text) ? text : "license_attention_required";
}
