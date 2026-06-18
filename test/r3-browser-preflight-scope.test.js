import assert from "node:assert/strict";
import {
  LIVE2D_R3_BROWSER_PREFLIGHT_SCOPE_SCHEMA,
  buildR3BrowserPreflightScope,
} from "../src/renderer/r3BrowserPreflightScope.js";

const requiredOwnerScopeLabels = [
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
];

const requiredActionLabels = [
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
];

function build(overrides = {}) {
  return buildR3BrowserPreflightScope({
    ownerScopeLabels: requiredOwnerScopeLabels,
    requestedActionLabels: requiredActionLabels,
    ...overrides,
  });
}

function assertBlocked(result, failureLabel) {
  assert.equal(result.preflightStatus, "blocked");
  assert.equal(result.failureLabels.includes(failureLabel), true, failureLabel);
}

const pass = build();
assert.equal(pass.schema, LIVE2D_R3_BROWSER_PREFLIGHT_SCOPE_SCHEMA);
assert.equal(pass.preflightStatus, "pass");
assert.equal(pass.scopeStatus, "pass");
assert.equal(pass.actionStatus, "pass");
assert.deepEqual(pass.missingOwnerScopeLabels, []);
assert.deepEqual(pass.missingRequestedActionLabels, []);
assert.deepEqual(pass.failureLabels, []);
assert.equal(pass.browserProcessAllowed, true);
assert.equal(pass.actualRendererPageLoadAllowed, true);
assert.equal(pass.javascriptExecutionCheckAllowed, true);
assert.equal(pass.domSurfaceAllowed, true);
assert.equal(pass.canvasPresenceAllowed, true);
assert.equal(pass.loopbackOnlyNetworkRequired, true);
assert.equal(pass.browserProcessCleanupRequired, true);
assert.equal(pass.temporaryProfileCleanupRequired, true);
assert.equal(pass.serverCleanupRequired, true);
assert.equal(pass.portReleaseCheckRequired, true);
assert.equal(pass.fiveRunReproducibilityAllowed, false);
assert.equal(pass.cubismSdkExecutionAllowed, false);
assert.equal(pass.modelLoadAllowed, false);
assert.equal(pass.sceneLoadAllowed, false);
assert.equal(pass.cueApplicationAllowed, false);
assert.equal(pass.browserHeartbeatInjectionAllowed, false);
assert.equal(pass.sseConnectionAllowed, false);
assert.equal(pass.trustedLoaderEnablementAllowed, false);
assert.equal(pass.actualDataAllowed, false);
assert.equal(pass.ownerConfirmationCreated, false);
assert.equal(pass.ownerConfirmationConfirmed, false);
assert.equal(pass.runtimeReadinessClaimed, false);
assert.equal(pass.productionReadinessClaimed, false);
assert.equal(pass.priority1Status, "BLOCKED");
assert.equal(pass.checkedRowCount, 0);
assert.equal(pass.motionDatasetExecutable, false);
assert.equal(pass.safeSummaryOnly, true);

const fiveRunPass = build({
  requestedActionLabels: [...requiredActionLabels, "five_run_reproducibility_check"],
});
assert.equal(fiveRunPass.preflightStatus, "pass");
assert.equal(fiveRunPass.fiveRunReproducibilityAllowed, true);

const missingOwner = build({
  ownerScopeLabels: requiredOwnerScopeLabels.filter((label) => label !== "no_readiness_claim"),
});
assertBlocked(missingOwner, "owner_scope_required_label_missing");
assert.equal(missingOwner.missingOwnerScopeLabels.includes("no_readiness_claim"), true);
assert.equal(missingOwner.browserProcessAllowed, false);

const missingAction = build({
  requestedActionLabels: requiredActionLabels.filter((label) => label !== "dom_surface_check"),
});
assertBlocked(missingAction, "requested_action_required_label_missing");
assert.equal(missingAction.missingRequestedActionLabels.includes("dom_surface_check"), true);

assertBlocked(
  build({ ownerScopeLabels: [...requiredOwnerScopeLabels, "unknown_safe_owner_scope"] }),
  "owner_scope_label_unknown",
);
assertBlocked(
  build({ requestedActionLabels: [...requiredActionLabels, "unknown_safe_action"] }),
  "requested_action_label_unknown",
);
assertBlocked(
  build({ ownerScopeLabels: [...requiredOwnerScopeLabels, "no_model_load"] }),
  "owner_scope_label_duplicate",
);
assertBlocked(
  build({ requestedActionLabels: [...requiredActionLabels, "dom_surface_check"] }),
  "requested_action_label_duplicate",
);

for (const unsafeOwnerLabel of ["", "No_Model_Load", "no model load", "../path", "https://url", "token=value", "{}"]) {
  const result = build({ ownerScopeLabels: [...requiredOwnerScopeLabels, unsafeOwnerLabel] });
  assertBlocked(result, "owner_scope_labels_invalid");
  if (unsafeOwnerLabel !== "") assert.equal(JSON.stringify(result).includes(unsafeOwnerLabel), false);
}

for (const unsafeActionLabel of ["", "DOM_CHECK", "dom check", "../path", "https://example", "secret=value", "{\"x\":1}"]) {
  const result = build({ requestedActionLabels: [...requiredActionLabels, unsafeActionLabel] });
  assertBlocked(result, "requested_action_labels_invalid");
  if (unsafeActionLabel !== "") assert.equal(JSON.stringify(result).includes(unsafeActionLabel), false);
}

assertBlocked(
  build({ ownerScopeLabels: [...requiredOwnerScopeLabels, "x".repeat(97)] }),
  "owner_scope_labels_oversized",
);
assertBlocked(
  build({ requestedActionLabels: [...requiredActionLabels, "x".repeat(97)] }),
  "requested_action_labels_oversized",
);
assertBlocked(
  build({ ownerScopeLabels: [...requiredOwnerScopeLabels, ...Array.from({ length: 12 }, (_, index) => `extra_${index}`)] }),
  "owner_scope_labels_oversized",
);
assertBlocked(
  build({
    requestedActionLabels: [
      ...requiredActionLabels,
      ...Array.from({ length: 23 }, (_, index) => `extra_action_${index}`),
    ],
  }),
  "requested_action_labels_oversized",
);

for (const forbiddenAction of [
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
]) {
  const result = build({ requestedActionLabels: [...requiredActionLabels, forbiddenAction] });
  assertBlocked(result, "requested_action_forbidden");
  assert.equal(JSON.stringify(result).includes(forbiddenAction), false);
}

assertBlocked(
  build({ ownerScopeLabels: requiredOwnerScopeLabels.filter((label) => label !== "dom_surface_allowed") }),
  "scope_action_mismatch",
);

assertBlocked(buildR3BrowserPreflightScope(), "input_not_plain_object");
assertBlocked(buildR3BrowserPreflightScope([]), "input_not_plain_object");
assertBlocked(build({ unexpected: true }), "unknown_input_field");

const polluted = { ownerScopeLabels: requiredOwnerScopeLabels, requestedActionLabels: requiredActionLabels };
Object.setPrototypeOf(polluted, { inherited: "unsafe" });
assertBlocked(buildR3BrowserPreflightScope(polluted), "input_not_plain_object");

console.log("r3-browser-preflight-scope: pass");
