import assert from "node:assert/strict";
import { assertSafe } from "../helpers/safeContractAssertions.js";
import {
  LIVE2D_RENDERER_READY_AUDIT_LINK_REQUIREMENT_SURFACE_SCHEMA,
  LIVE2D_RENDERER_READY_OWNER_SCOPE_REQUIREMENT_SURFACE_SCHEMA,
  LIVE2D_RENDERER_READY_PRODUCTION_READINESS_FINAL_NO_GO_SCHEMA,
  LIVE2D_RENDERER_READY_RUNTIME_READINESS_FINAL_NO_GO_SCHEMA,
  LIVE2D_RENDERER_READY_TRUSTED_LOADER_PREAUTH_BLOCKER_SURFACE_SCHEMA,
  createRendererReadyAuditLinkRequirementSurfaceSummary,
  createRendererReadyOwnerScopeRequirementSurfaceSummary,
  createRendererReadyProductionReadinessFinalNoGoSummary,
  createRendererReadyRuntimeReadinessFinalNoGoSummary,
  createRendererReadyTrustedLoaderPreauthBlockerSurfaceSummary,
} from "../../src/renderer/cubismLoaderProvisioning.js";

const unsafeAttempt = {
  runtime_readiness_claimed: true,
  runtimeReadinessClaimed: true,
  production_readiness_claimed: true,
  productionReadinessClaimed: true,
  owner_confirmation_created: true,
  ownerConfirmationCreated: true,
  owner_confirmation_confirmed: true,
  ownerConfirmationConfirmed: true,
  actual_ingestion_allowed: true,
  trusted_loader_allowlist_enabled: true,
  trustedLoaderAllowlistEnabled: true,
  checked_row_count: 9,
  checkedRowCount: 9,
  priority1_status: "RESOLVED",
  priority1Status: "RESOLVED",
  motion_dataset_executable: true,
  motionDatasetExecutable: true,
  rendererReadyClaimed: true,
  goApproved: true,
};

function assertRendererReadinessBoundary(summary, schema) {
  assert.equal(summary.schema, schema);
  assert.equal(summary.runtimeReadinessClaimed, false);
  assert.equal(summary.productionReadinessClaimed, false);
  assert.equal(summary.ownerConfirmationCreated, false);
  assert.equal(summary.ownerConfirmationConfirmed, false);
  assert.equal(summary.trustedLoaderAllowlistEnabled, false);
  assert.equal(summary.checkedRowCount, 0);
  assert.equal(summary.priority1Status, "BLOCKED");
  assert.equal(summary.motionDatasetExecutable, false);
  assert.equal(summary.rendererReadyClaimed, false);
  assertSafe(JSON.stringify(summary));
}

const ownerScope = createRendererReadyOwnerScopeRequirementSurfaceSummary(unsafeAttempt);
assertRendererReadinessBoundary(ownerScope, LIVE2D_RENDERER_READY_OWNER_SCOPE_REQUIREMENT_SURFACE_SCHEMA);
assert.equal(ownerScope.ownerScopeStatus, "missing");
assert.equal(ownerScope.ownerScopeRequired, true);
assert.equal(ownerScope.ownerScopeConfirmed, false);
assert.equal(ownerScope.ownerScopeMissingBlocksReadiness, true);

const auditLink = createRendererReadyAuditLinkRequirementSurfaceSummary(unsafeAttempt);
assertRendererReadinessBoundary(auditLink, LIVE2D_RENDERER_READY_AUDIT_LINK_REQUIREMENT_SURFACE_SCHEMA);
assert.equal(auditLink.auditLinkStatus, "missing");
assert.equal(auditLink.auditLinkRequired, true);
assert.equal(auditLink.auditLinkPresent, false);
assert.equal(auditLink.auditExecutionStarted, false);

const trustedLoader = createRendererReadyTrustedLoaderPreauthBlockerSurfaceSummary(unsafeAttempt);
assertRendererReadinessBoundary(trustedLoader, LIVE2D_RENDERER_READY_TRUSTED_LOADER_PREAUTH_BLOCKER_SURFACE_SCHEMA);
assert.equal(trustedLoader.trustedLoaderPreauthStatus, "blocked");
assert.equal(trustedLoader.loaderTrusted, false);
assert.equal(trustedLoader.loaderAllowlistActive, false);
assert.equal(trustedLoader.trustedLoaderEnablementRejected, true);

const runtimeNoGo = createRendererReadyRuntimeReadinessFinalNoGoSummary(unsafeAttempt);
assertRendererReadinessBoundary(runtimeNoGo, LIVE2D_RENDERER_READY_RUNTIME_READINESS_FINAL_NO_GO_SCHEMA);
assert.equal(runtimeNoGo.runtimeReadinessStatus, "no_go");
assert.equal(runtimeNoGo.runtimeReadinessApproved, false);
assert.equal(runtimeNoGo.runtimeReadinessFinalNoGo, true);
assert.equal(runtimeNoGo.goApproved, false);

const productionNoGo = createRendererReadyProductionReadinessFinalNoGoSummary(unsafeAttempt);
assertRendererReadinessBoundary(productionNoGo, LIVE2D_RENDERER_READY_PRODUCTION_READINESS_FINAL_NO_GO_SCHEMA);
assert.equal(productionNoGo.productionReadinessStatus, "no_go");
assert.equal(productionNoGo.productionReadinessApproved, false);
assert.equal(productionNoGo.productionReadinessFinalNoGo, true);
assert.equal(productionNoGo.actual_ingestion_allowed, false);
assert.equal(productionNoGo.row_body_read, false);

console.log("contract-renderer-readiness: pass");
