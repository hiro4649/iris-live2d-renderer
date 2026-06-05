import { existsSync } from "node:fs";
import { assertSafePublicObject, createBoundaryPolicy, safeText } from "../contracts.js";

export const CUBISM_LOADER_PROVISIONING_SCHEMA = "iris_live2d_cubism_loader_provisioning_v1";
export const TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA = "iris_live2d_trusted_loader_allowlist_preflight_v1";

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
