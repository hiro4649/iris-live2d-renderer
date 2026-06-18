export const LIVE2D_R3_BROWSER_PREFLIGHT_SCOPE_SCHEMA = "live2d_r3_browser_preflight_scope_v1";

const MAX_LABEL_COUNT = 32;
const MAX_LABEL_LENGTH = 96;
const MAX_TOTAL_LABEL_CHARS = 2048;

const REQUIRED_OWNER_LABELS = Object.freeze([
  "owner_scope_r3_browser_preflight",
  "browser_process_allowed",
  "actual_renderer_page_load_allowed",
  "javascript_execution_check_allowed",
  "dom_surface_allowed",
  "canvas_presence_allowed",
  "loopback_only_network_required",
  "browser_process_cleanup_required",
  "temporary_profile_cleanup_required",
  "server_cleanup_required",
  "port_release_check_required",
  "five_run_reproducibility_allowed",
  "no_cubism_sdk_execution",
  "no_model_load",
  "no_scene_load",
  "no_cue_application",
  "no_heartbeat_injection",
  "no_sse_connection",
  "no_trusted_loader_enablement",
  "no_actual_data",
  "no_readiness_claim",
]);

const REQUIRED_ACTION_LABELS = Object.freeze([
  "browser_process_probe",
  "actual_renderer_page_load",
  "javascript_execution_check",
  "dom_surface_check",
  "canvas_presence_check",
  "loopback_request_observation",
  "browser_process_cleanup_check",
  "temporary_profile_cleanup_check",
  "server_cleanup_check",
  "port_release_check",
]);

const OPTIONAL_ACTION_LABELS = Object.freeze(["five_run_reproducibility_check"]);

const FORBIDDEN_ACTION_LABELS = Object.freeze([
  "cubism_sdk_execution_requested",
  "cubism_framework_execution_requested",
  "model_load_requested",
  "scene_load_requested",
  "cue_application_requested",
  "browser_heartbeat_injection_requested",
  "sse_connection_requested",
  "trusted_loader_enablement_requested",
  "actual_data_requested",
  "owner_confirmation_created",
  "runtime_readiness_requested",
  "production_readiness_requested",
  "priority1_resolution_requested",
  "motion_dataset_execution_requested",
  "raw_browser_output_requested",
  "browser_download_requested",
  "package_install_requested",
  "external_network_requested",
  "default_profile_requested",
  "remote_debugging_requested",
]);

const ALLOWED_INPUT_FIELDS = Object.freeze(["ownerScopeLabels", "requestedActionLabels"]);
const UNSAFE_FIELD_NAMES = Object.freeze(["__proto__", "constructor", "prototype"]);
const LABEL_PATTERN = /^[a-z0-9_]+$/u;

const ACTION_TO_OWNER_SCOPE = Object.freeze({
  browser_process_probe: "browser_process_allowed",
  actual_renderer_page_load: "actual_renderer_page_load_allowed",
  javascript_execution_check: "javascript_execution_check_allowed",
  dom_surface_check: "dom_surface_allowed",
  canvas_presence_check: "canvas_presence_allowed",
  loopback_request_observation: "loopback_only_network_required",
  browser_process_cleanup_check: "browser_process_cleanup_required",
  temporary_profile_cleanup_check: "temporary_profile_cleanup_required",
  server_cleanup_check: "server_cleanup_required",
  port_release_check: "port_release_check_required",
  five_run_reproducibility_check: "five_run_reproducibility_allowed",
});

const OWNER_LABEL_SET = new Set(REQUIRED_OWNER_LABELS);
const REQUIRED_ACTION_SET = new Set(REQUIRED_ACTION_LABELS);
const ACTION_LABEL_SET = new Set([...REQUIRED_ACTION_LABELS, ...OPTIONAL_ACTION_LABELS]);
const FORBIDDEN_ACTION_SET = new Set(FORBIDDEN_ACTION_LABELS);

function createBaseFailureSet() {
  return new Set();
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype;
}

function hasUnsafeFieldName(key) {
  return typeof key !== "string" || UNSAFE_FIELD_NAMES.includes(key);
}

function validateExactInput(input, failures) {
  if (!isPlainObject(input)) {
    failures.add("input_not_plain_object");
    return false;
  }

  for (const key of Reflect.ownKeys(input)) {
    if (hasUnsafeFieldName(key)) {
      failures.add("unsafe_input_field");
      continue;
    }
    if (!ALLOWED_INPUT_FIELDS.includes(key)) {
      failures.add("unknown_input_field");
    }
  }

  return true;
}

function classifyLabelSyntax(label) {
  if (typeof label !== "string") return "invalid";
  if (label.length === 0) return "invalid";
  if (label.length > MAX_LABEL_LENGTH) return "oversized";
  if (!LABEL_PATTERN.test(label)) return "invalid";
  return "ok";
}

function validateLabelArray(input, fieldName, options) {
  const {
    missingFailure,
    invalidFailure,
    oversizedFailure,
    duplicateFailure,
    unknownFailure,
    allowedLabels,
    forbiddenLabels = new Set(),
    forbiddenFailure,
  } = options;
  const failures = createBaseFailureSet();

  if (!Object.hasOwn(input, fieldName) || !Array.isArray(input[fieldName])) {
    failures.add(missingFailure);
    return { labels: [], failures };
  }

  const labels = input[fieldName];
  if (labels.length > MAX_LABEL_COUNT) {
    failures.add(oversizedFailure);
  }

  let totalChars = 0;
  const seen = new Set();
  const accepted = [];

  for (const label of labels) {
    if (typeof label === "string") {
      totalChars += label.length;
    }

    const syntax = classifyLabelSyntax(label);
    if (syntax === "oversized") {
      failures.add(oversizedFailure);
      continue;
    }
    if (syntax !== "ok") {
      failures.add(invalidFailure);
      continue;
    }

    if (seen.has(label)) {
      failures.add(duplicateFailure);
      continue;
    }
    seen.add(label);

    if (forbiddenLabels.has(label)) {
      failures.add(forbiddenFailure);
      continue;
    }

    if (!allowedLabels.has(label)) {
      failures.add(unknownFailure);
      continue;
    }

    accepted.push(label);
  }

  if (totalChars > MAX_TOTAL_LABEL_CHARS) {
    failures.add(oversizedFailure);
  }

  return { labels: accepted, failures };
}

function addFailures(target, source) {
  for (const failure of source) target.add(failure);
}

function buildResult(failures, missingOwnerScopeLabels, missingRequestedActionLabels, requestedActionLabels) {
  const preflightStatus = failures.size === 0 ? "pass" : "blocked";
  const fiveRunRequested = requestedActionLabels.includes("five_run_reproducibility_check");
  const browserProbeAllowed = preflightStatus === "pass";

  return {
    schema: LIVE2D_R3_BROWSER_PREFLIGHT_SCOPE_SCHEMA,
    preflightStatus,
    scopeStatus: missingOwnerScopeLabels.length === 0 ? "pass" : "blocked",
    actionStatus: missingRequestedActionLabels.length === 0 ? "pass" : "blocked",
    missingOwnerScopeLabels,
    missingRequestedActionLabels,
    failureLabels: [...failures].sort(),
    browserProcessAllowed: browserProbeAllowed,
    actualRendererPageLoadAllowed: browserProbeAllowed,
    javascriptExecutionCheckAllowed: browserProbeAllowed,
    domSurfaceAllowed: browserProbeAllowed,
    canvasPresenceAllowed: browserProbeAllowed,
    loopbackOnlyNetworkRequired: browserProbeAllowed,
    browserProcessCleanupRequired: browserProbeAllowed,
    temporaryProfileCleanupRequired: browserProbeAllowed,
    serverCleanupRequired: browserProbeAllowed,
    portReleaseCheckRequired: browserProbeAllowed,
    fiveRunReproducibilityAllowed: browserProbeAllowed && fiveRunRequested,
    cubismSdkExecutionAllowed: false,
    modelLoadAllowed: false,
    sceneLoadAllowed: false,
    cueApplicationAllowed: false,
    browserHeartbeatInjectionAllowed: false,
    sseConnectionAllowed: false,
    trustedLoaderEnablementAllowed: false,
    actualDataAllowed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    priority1Status: "BLOCKED",
    checkedRowCount: 0,
    motionDatasetExecutable: false,
    safeSummaryOnly: true,
  };
}

export function buildR3BrowserPreflightScope(input = undefined) {
  const failures = createBaseFailureSet();
  const inputIsUsable = validateExactInput(input, failures);

  if (!inputIsUsable) {
    return buildResult(failures, [], [], []);
  }

  const ownerValidation = validateLabelArray(input, "ownerScopeLabels", {
    missingFailure: "owner_scope_labels_missing",
    invalidFailure: "owner_scope_labels_invalid",
    oversizedFailure: "owner_scope_labels_oversized",
    duplicateFailure: "owner_scope_label_duplicate",
    unknownFailure: "owner_scope_label_unknown",
    allowedLabels: OWNER_LABEL_SET,
  });
  const actionValidation = validateLabelArray(input, "requestedActionLabels", {
    missingFailure: "requested_action_labels_missing",
    invalidFailure: "requested_action_labels_invalid",
    oversizedFailure: "requested_action_labels_oversized",
    duplicateFailure: "requested_action_label_duplicate",
    unknownFailure: "requested_action_label_unknown",
    allowedLabels: ACTION_LABEL_SET,
    forbiddenLabels: FORBIDDEN_ACTION_SET,
    forbiddenFailure: "requested_action_forbidden",
  });

  addFailures(failures, ownerValidation.failures);
  addFailures(failures, actionValidation.failures);

  const ownerLabels = ownerValidation.labels;
  const actionLabels = actionValidation.labels;
  const missingOwnerLabels = REQUIRED_OWNER_LABELS.filter((label) => !ownerLabels.includes(label));
  const missingActionLabels = REQUIRED_ACTION_LABELS.filter((label) => !actionLabels.includes(label));

  if (missingOwnerLabels.length > 0) failures.add("owner_scope_required_label_missing");
  if (missingActionLabels.length > 0) failures.add("requested_action_required_label_missing");

  for (const actionLabel of actionLabels) {
    const ownerScopeLabel = ACTION_TO_OWNER_SCOPE[actionLabel];
    if (!ownerLabels.includes(ownerScopeLabel)) {
      failures.add("scope_action_mismatch");
      break;
    }
  }

  return buildResult(failures, missingOwnerLabels, missingActionLabels, actionLabels);
}
