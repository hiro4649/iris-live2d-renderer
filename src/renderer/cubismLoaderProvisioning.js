import { existsSync } from "node:fs";
import { assertSafePublicObject, createBoundaryPolicy, safeText } from "../contracts.js";

export const CUBISM_LOADER_PROVISIONING_SCHEMA = "iris_live2d_cubism_loader_provisioning_v1";
export const TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA = "iris_live2d_trusted_loader_allowlist_preflight_v1";
export const TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA = "iris_live2d_trusted_loader_enablement_gate_v1";
export const TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA = "iris_live2d_trusted_loader_owner_handoff_v1";
export const FRESH_EVIDENCE_BUNDLE_SCHEMA = "iris_live2d_fresh_evidence_bundle_v1";

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
  const trustedLoaderAllowlistEnabled = source.trustedLoaderAllowlistEnabled ?? source.trusted_loader_allowlist_enabled ?? false;
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
    trusted_loader_allowlist_enabled: trustedLoaderAllowlistEnabled === true,
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
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
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
