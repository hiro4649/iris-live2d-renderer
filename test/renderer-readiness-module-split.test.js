import assert from "node:assert/strict";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import * as rendererReadiness from "../src/renderer/planning/rendererReadinessSummaries.js";

const RENDERER_READINESS_EXPORTS = Object.freeze([
  "LIVE2D_RENDERER_READY_FALSE_POSITIVE_DEPENDENCY_SURFACE_SCHEMA",
  "LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_SEPARATION_CONTRACT_SCHEMA",
  "LIVE2D_RENDERER_READY_FRESH_EVIDENCE_ENVELOPE_SCHEMA",
  "LIVE2D_RENDERER_READY_STALE_EVIDENCE_DOWNGRADE_CONTRACT_SCHEMA",
  "LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_ALLOWLIST_SCHEMA",
  "LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_BLOCKER_MATRIX_SCHEMA",
  "LIVE2D_RENDERER_READY_GO_NOGO_BLOCKER_SURFACE_SCHEMA",
  "LIVE2D_RENDERER_READY_OWNER_EVIDENCE_HANDOFF_PACKET_STUB_SCHEMA",
  "LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_MANIFEST_STUB_SCHEMA",
  "LIVE2D_RENDERER_READY_RUNTIME_READINESS_FINAL_NO_GO_SCHEMA",
  "LIVE2D_RENDERER_READY_PRODUCTION_READINESS_FINAL_NO_GO_SCHEMA",
  "LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_ITEMS",
  "LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_NO_GO_REASONS",
  "LIVE2D_RENDERER_READY_GO_NOGO_REASONS",
  "LIVE2D_RENDERER_READY_SAFE_NEXT_ACTIONS",
  "LIVE2D_RENDERER_READY_REAL_PROBE_PREFLIGHT_BLOCKERS",
  "LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_LABELS",
  "LIVE2D_RENDERER_READY_FINAL_PRE_OWNER_BLOCKERS",
  "LIVE2D_RENDERER_READY_FALSE_POSITIVE_BLOCKERS",
  "LIVE2D_RENDERER_READY_FRESH_EVIDENCE_REQUIRED_BLOCKERS",
  "createRendererReadyFalsePositiveDependencySurfaceSummary",
  "createRendererReadyFixtureVsRealSeparationContractSummary",
  "createRendererReadyFreshEvidenceEnvelopeSummary",
  "createRendererReadyStaleEvidenceDowngradeContractSummary",
  "createRendererReadyEvidenceSourceAllowlistSummary",
  "createRendererReadyEvidenceCompletenessBlockerMatrixSummary",
  "createRendererReadyGoNoGoBlockerSurfaceSummary",
  "createRendererReadyOwnerEvidenceHandoffPacketStubSummary",
  "createRendererReadyEvidenceCollectorManifestStubSummary",
  "createRendererReadyEvidenceCollectorNoExecutionGuardSummary",
  "createRendererReadyEvidenceCollectorSafeOutputSchemaSummary",
  "createRendererReadyRuntimeReadinessFinalNoGoSummary",
  "createRendererReadyProductionReadinessFinalNoGoSummary",
  "createRendererReadyRealEvidenceRequestFinalWaitStateSummary",
  "createRendererReadyRealEvidenceRequestRejectionFixturePackSummary",
]);

for (const name of RENDERER_READINESS_EXPORTS) {
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy export missing ${name}`);
  assert.equal(Object.hasOwn(rendererReadiness, name), true, `planning export missing ${name}`);
  assert.equal(rendererReadiness[name], legacyProvisioning[name], `export identity mismatch ${name}`);
}

const summaryFactories = RENDERER_READINESS_EXPORTS.filter((name) => name.startsWith("create"));
for (const name of summaryFactories) {
  assert.deepEqual(rendererReadiness[name](), legacyProvisioning[name](), `summary parity mismatch ${name}`);
}

const unsafeAttempt = {
  renderer_ready: true,
  model_loaded: true,
  scene_loaded: true,
  browser_cue_delivery_ready: true,
  runtime_readiness_claimed: true,
  production_readiness_claimed: true,
  owner_confirmation_confirmed: true,
  trusted_loader_allowlist_enabled: true,
};

for (const name of [
  "createRendererReadyRuntimeReadinessFinalNoGoSummary",
  "createRendererReadyProductionReadinessFinalNoGoSummary",
  "createRendererReadyEvidenceCollectorNoExecutionGuardSummary",
  "createRendererReadyRealEvidenceRequestFinalWaitStateSummary",
]) {
  assert.deepEqual(rendererReadiness[name](unsafeAttempt), legacyProvisioning[name](unsafeAttempt));
}

console.log("renderer-readiness-module-split: pass");
