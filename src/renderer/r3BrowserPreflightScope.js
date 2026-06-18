export const LIVE2D_R3_BROWSER_PREFLIGHT_SCOPE_SCHEMA = "live2d_r3_browser_preflight_scope_v1";

const REQUIRED_OWNER_LABELS = Object.freeze([
  "owner_scope_r3_browser_preflight",
  "browser_process_allowed",
  "dom_surface_allowed",
  "canvas_presence_allowed",
  "no_cubism_sdk_execution",
  "no_model_load",
  "no_scene_load",
  "no_cue_application",
  "no_readiness_claim",
]);

const FORBIDDEN_LABELS = Object.freeze([
  "cubism_sdk_execution_requested",
  "cubism_framework_execution_requested",
  "model_load_requested",
  "scene_load_requested",
  "cue_application_requested",
  "browser_heartbeat_injection_requested",
  "trusted_loader_enablement_requested",
  "actual_data_requested",
  "owner_confirmation_created",
  "runtime_readiness_requested",
  "production_readiness_requested",
  "priority1_resolution_requested",
  "motion_dataset_execution_requested",
  "raw_browser_output_requested",
]);

function safeLabels(labels) {
  if (!Array.isArray(labels)) return [];
  return [...new Set(labels.map((label) => String(label || "").trim()).filter((label) => /^[a-z0-9_]+$/u.test(label)))];
}

export function buildR3BrowserPreflightScope({
  ownerScopeLabels = [],
  requestedActionLabels = [],
} = {}) {
  const ownerLabels = safeLabels(ownerScopeLabels);
  const actionLabels = safeLabels(requestedActionLabels);
  const missingOwnerLabels = REQUIRED_OWNER_LABELS.filter((label) => !ownerLabels.includes(label));
  const rejectedActionLabels = actionLabels.filter((label) => FORBIDDEN_LABELS.includes(label));
  const preflightStatus = missingOwnerLabels.length === 0 && rejectedActionLabels.length === 0 ? "pass" : "blocked";

  return {
    schema: LIVE2D_R3_BROWSER_PREFLIGHT_SCOPE_SCHEMA,
    preflightStatus,
    requiredOwnerScopeLabels: [...REQUIRED_OWNER_LABELS],
    missingOwnerScopeLabels: missingOwnerLabels,
    rejectedActionLabels,
    browserProcessAllowed: preflightStatus === "pass",
    domSurfaceAllowed: preflightStatus === "pass",
    canvasPresenceAllowed: preflightStatus === "pass",
    cubismSdkExecutionAllowed: false,
    cubismFrameworkExecutionAllowed: false,
    modelLoadAllowed: false,
    sceneLoadAllowed: false,
    cueApplicationAllowed: false,
    browserHeartbeatInjectionAllowed: false,
    trustedLoaderEnablementAllowed: false,
    actualDataAllowed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    priority1Status: "BLOCKED",
    checkedRowCount: 0,
    motionDatasetExecutable: false,
    safeEvidenceOnly: true,
    safeSummaryOnly: true,
  };
}
