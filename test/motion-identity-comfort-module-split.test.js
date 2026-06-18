import assert from "node:assert/strict";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import * as motionIdentityComfort from "../src/renderer/planning/motionIdentityComfortSummaries.js";

const IDENTITY_COMFORT_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_REDACTION_SWEEP_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_AUDIT_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_ADMIN_SUMMARY_REDACTION_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_STUB_NO_WRITE_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_PRE_OWNER_FINAL_WAIT_STATE_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_REDACTION_SWEEP2_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_NO_SWEETENING_SWEEP2_SCHEMA",
  "LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_PHASES",
  "LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_BOUNDARIES",
  "LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_OPEN_BLOCKERS",
  "LIVE2D_MOTION_IDENTITY_COMFORT_REDACTION_SWEEP_REJECTIONS",
  "LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_REJECTIONS",
  "LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_ALLOWED_LABELS",
  "LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_BLOCKERS",
  "LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_ROLES",
  "LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_FIELDS",
  "LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_STUB_NO_WRITE_REJECTIONS",
  "LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_ENTRIES",
  "LIVE2D_MOTION_IDENTITY_COMFORT_PRE_OWNER_FINAL_WAIT_STATE_BLOCKERS",
  "LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_REDACTION_SWEEP2_REJECTIONS",
  "createLive2dMotionIdentityComfortDevelopmentScheduleSummary",
  "createLive2dMotionIdentityComfortCompletionReviewSummary",
  "createLive2dMotionIdentityComfortRedactionSweepSummary",
  "createLive2dMotionIdentityComfortNoSweeteningSweepSummary",
  "createLive2dMotionIdentityComfortImplementationGapAuditSummary",
  "createLive2dMotionIdentityComfortImplementationGapRegisterSummary",
  "createLive2dMotionIdentityComfortPublicSummary",
  "createLive2dMotionIdentityComfortAdminSummaryRedaction",
  "createLive2dMotionIdentityComfortOwnerHandoffStub",
  "createLive2dMotionIdentityComfortRoleGateStub",
  "createLive2dMotionIdentityComfortRoleGateRedactionGuard",
  "createLive2dMotionIdentityComfortAuditStubNoWrite",
  "createLive2dMotionIdentityComfortContinuationLedger",
  "createLive2dMotionIdentityComfortPreOwnerFinalWaitState",
  "createLive2dMotionIdentityComfortFinalRedactionSweep2",
  "createLive2dMotionIdentityComfortFinalNoSweeteningSweep2",
]);

for (const name of IDENTITY_COMFORT_EXPORTS) {
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy export missing ${name}`);
  assert.equal(Object.hasOwn(motionIdentityComfort, name), true, `planning export missing ${name}`);
  assert.equal(motionIdentityComfort[name], legacyProvisioning[name], `export identity mismatch ${name}`);
}

const summaryFactories = IDENTITY_COMFORT_EXPORTS.filter((name) => name.startsWith("create"));
for (const name of summaryFactories) {
  const legacySummary = legacyProvisioning[name]();
  const planningSummary = motionIdentityComfort[name]();
  assert.deepEqual(planningSummary, legacySummary, `summary parity mismatch ${name}`);
}

const unsafeAttempt = {
  runtime_readiness_claimed: true,
  production_readiness_claimed: true,
  owner_confirmation_confirmed: true,
  redaction_scan_executed: true,
  audit_executed: true,
  actual_ingestion_allowed: true,
};

for (const name of [
  "createLive2dMotionIdentityComfortRedactionSweepSummary",
  "createLive2dMotionIdentityComfortRoleGateRedactionGuard",
  "createLive2dMotionIdentityComfortAuditStubNoWrite",
  "createLive2dMotionIdentityComfortFinalRedactionSweep2",
]) {
  assert.deepEqual(motionIdentityComfort[name](unsafeAttempt), legacyProvisioning[name](unsafeAttempt));
}

console.log("motion-identity-comfort-module-split: pass");
