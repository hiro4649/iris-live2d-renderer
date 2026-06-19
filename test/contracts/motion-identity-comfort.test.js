import assert from "node:assert/strict";
import { assertSafe } from "../helpers/safeContractAssertions.js";
import {
  LIVE2D_MOTION_IDENTITY_AND_COMFORT_SPEC_SCHEMA,
  LIVE2D_MOTION_IDENTITY_AND_COMFORT_SUBTITLE_GAZE_GUARD_SCHEMA,
  LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_SCHEMA,
  LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_SCHEMA,
  createLive2dMotionIdentityAndComfortSpecSummary,
  createLive2dMotionIdentityAndComfortSubtitleGazeGuardSummary,
  createLive2dMotionIdentityComfortNoSweeteningSweepSummary,
  createLive2dMotionIdentityComfortRoleGateRedactionGuard,
} from "../../src/renderer/cubismLoaderProvisioning.js";

const unsafeAttempt = {
  runtime_readiness_claimed: true,
  production_readiness_claimed: true,
  owner_confirmation_created: true,
  owner_confirmation_confirmed: true,
  actual_ingestion_allowed: true,
  trusted_loader_allowlist_enabled: true,
  checked_row_count: 9,
  priority1_status: "RESOLVED",
  motion_dataset_executable: true,
  renderer_ready: true,
};

function assertMotionIdentityBoundary(summary, schema, status) {
  assert.equal(summary.schema, schema);
  assert.equal(Object.values(summary).includes(status), true);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.renderer_ready, false);
  assertSafe(JSON.stringify(summary));
}

const spec = createLive2dMotionIdentityAndComfortSpecSummary(unsafeAttempt);
assertMotionIdentityBoundary(spec, LIVE2D_MOTION_IDENTITY_AND_COMFORT_SPEC_SCHEMA, "spec_only_blocked");
assert.equal(spec.motion_identity_and_comfort_spec_only, true);
assert.equal(spec.no_motion_execution_boundary, true);
assert.equal(spec.no_renderer_ready_claim_boundary, true);

const subtitleGaze = createLive2dMotionIdentityAndComfortSubtitleGazeGuardSummary(unsafeAttempt);
assertMotionIdentityBoundary(
  subtitleGaze,
  LIVE2D_MOTION_IDENTITY_AND_COMFORT_SUBTITLE_GAZE_GUARD_SCHEMA,
  "subtitle_gaze_guard_blocked",
);
assert.equal(subtitleGaze.subtitle_gaze_guard_executes_motion, false);
assert.equal(subtitleGaze.subtitle_gaze_guard_claims_runtime_ready, false);
assert.equal(subtitleGaze.camera_proximity_risk_strong_motion_allowed, false);

const noSweetening = createLive2dMotionIdentityComfortNoSweeteningSweepSummary(unsafeAttempt);
assertMotionIdentityBoundary(
  noSweetening,
  LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_SCHEMA,
  "no_sweetening_sweep_blocked",
);
assert.equal(noSweetening.no_readiness_sweetening_boundary, true);
assert.equal(noSweetening.fixture_pass_is_runtime_readiness, false);
assert.equal(noSweetening.status_surface_executes_motion, false);

const roleGate = createLive2dMotionIdentityComfortRoleGateRedactionGuard(unsafeAttempt);
assertMotionIdentityBoundary(
  roleGate,
  LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_SCHEMA,
  "role_gate_redaction_guard_blocked",
);
assert.equal(roleGate.owner_only_detail_exposed_public, false);
assert.equal(roleGate.owner_only_detail_exposed_operator, false);
assert.equal(roleGate.role_gate_redaction_claims_runtime_ready, false);
assert.equal(roleGate.role_gate_redaction_claims_production_ready, false);

console.log("contract-motion-identity-comfort: pass");
