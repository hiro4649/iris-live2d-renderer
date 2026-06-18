import assert from "node:assert/strict";
import {
  LIVE2D_R3_BROWSER_PREFLIGHT_SCOPE_SCHEMA,
  buildR3BrowserPreflightScope,
} from "../src/renderer/r3BrowserPreflightScope.js";

const required = [
  "owner_scope_r3_browser_preflight",
  "browser_process_allowed",
  "dom_surface_allowed",
  "canvas_presence_allowed",
  "no_cubism_sdk_execution",
  "no_model_load",
  "no_scene_load",
  "no_cue_application",
  "no_readiness_claim",
];

const pass = buildR3BrowserPreflightScope({ ownerScopeLabels: required });
assert.equal(pass.schema, LIVE2D_R3_BROWSER_PREFLIGHT_SCOPE_SCHEMA);
assert.equal(pass.preflightStatus, "pass");
assert.equal(pass.browserProcessAllowed, true);
assert.equal(pass.domSurfaceAllowed, true);
assert.equal(pass.canvasPresenceAllowed, true);
assert.equal(pass.cubismSdkExecutionAllowed, false);
assert.equal(pass.cubismFrameworkExecutionAllowed, false);
assert.equal(pass.modelLoadAllowed, false);
assert.equal(pass.sceneLoadAllowed, false);
assert.equal(pass.cueApplicationAllowed, false);
assert.equal(pass.browserHeartbeatInjectionAllowed, false);
assert.equal(pass.trustedLoaderEnablementAllowed, false);
assert.equal(pass.actualDataAllowed, false);
assert.equal(pass.ownerConfirmationCreated, false);
assert.equal(pass.ownerConfirmationConfirmed, false);
assert.equal(pass.runtimeReadinessClaimed, false);
assert.equal(pass.productionReadinessClaimed, false);
assert.equal(pass.priority1Status, "BLOCKED");
assert.equal(pass.checkedRowCount, 0);
assert.equal(pass.motionDatasetExecutable, false);
assert.equal(pass.safeEvidenceOnly, true);
assert.equal(pass.safeSummaryOnly, true);

const missing = buildR3BrowserPreflightScope({ ownerScopeLabels: required.slice(0, -1) });
assert.equal(missing.preflightStatus, "blocked");
assert.equal(missing.missingOwnerScopeLabels.includes("no_readiness_claim"), true);
assert.equal(missing.browserProcessAllowed, false);

for (const label of [
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
]) {
  const blocked = buildR3BrowserPreflightScope({
    ownerScopeLabels: required,
    requestedActionLabels: [label],
  });
  assert.equal(blocked.preflightStatus, "blocked", label);
  assert.equal(blocked.rejectedActionLabels.includes(label), true, label);
}

const unsafeLabel = buildR3BrowserPreflightScope({
  ownerScopeLabels: [...required, "token=value", "../path"],
});
assert.equal(unsafeLabel.preflightStatus, "pass");
assert.equal(JSON.stringify(unsafeLabel).includes("token=value"), false);
assert.equal(JSON.stringify(unsafeLabel).includes("../path"), false);

console.log("r3-browser-preflight-scope: pass");
