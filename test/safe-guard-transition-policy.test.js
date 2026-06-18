import assert from "node:assert/strict";
import {
  REAL_EVIDENCE_ALLOWED_SOURCE_TYPES,
  REAL_EVIDENCE_REJECTED_SOURCE_TYPES,
  createSafeGuardTransitionPolicy,
  evaluateNewSafeSurfaceApproval,
  evaluateRealEvidenceTransition,
} from "../src/renderer/safeGuardTransitionPolicy.js";

const policy = createSafeGuardTransitionPolicy();
assert.equal(policy.safeSummaryOnly, true);
assert.equal(policy.safeGuardFreezeStatus, "frozen_for_one_field_status_prs");
assert.equal(policy.newSafeSurfaceRequiresBlockingGap, true);
assert.equal(policy.newSafeSurfaceRequiresProductValue, true);
assert.equal(policy.registryAuthoritative, true);
assert.equal(policy.compatibilityAliasPolicy, "explicit_alias_required");
assert.equal(policy.deprecationPolicy, "explicit_owner_review_required");
assert.equal(policy.ownerScopeRequired, true);
assert.equal(policy.realEvidenceRequired, true);
assert.equal(policy.rowManifestRequired, true);
assert.equal(policy.actualProbeOwnerGated, true);
assert.equal(policy.trustedLoaderOwnerGated, true);
assert.equal(policy.runtimeReadinessOwnerGated, true);
assert.equal(policy.productionGoNoGoOwnerGated, true);

const blockedSurface = evaluateNewSafeSurfaceApproval();
assert.equal(blockedSurface.approvalStatus, "blocked");
assert.equal(blockedSurface.rejectionLabels.includes("missing_blocking_product_gap_label"), true);
assert.equal(blockedSurface.rejectionLabels.includes("missing_product_value_statement_label"), true);
assert.equal(blockedSurface.rejectionLabels.includes("existing_registry_reuse_not_checked"), true);
assert.equal(blockedSurface.rejectionLabels.includes("compact_summary_impact_not_checked"), true);
assert.equal(blockedSurface.rejectionLabels.includes("compatibility_plan_missing"), true);
assert.equal(blockedSurface.rejectionLabels.includes("owner_scope_not_required"), true);

const approvedSurface = evaluateNewSafeSurfaceApproval({
  blockingProductGapLabel: "blocking_gap_declared",
  productValueStatementLabel: "product_value_declared",
  existingRegistryReuseChecked: true,
  compactSummaryImpactChecked: true,
  compatibilityPlanPresent: true,
  ownerScopeRequired: true,
});
assert.equal(approvedSurface.approvalStatus, "approved_for_review");
assert.deepEqual(approvedSurface.rejectionLabels, []);
assert.equal(approvedSurface.authorizing, false);
assert.equal(approvedSurface.ownerConfirmationCreated, false);
assert.equal(approvedSurface.runtimeReadinessClaimed, false);
assert.equal(approvedSurface.productionReadinessClaimed, false);
assert.equal(approvedSurface.priority1Status, "BLOCKED");
assert.equal(approvedSurface.checkedRowCount, 0);
assert.equal(approvedSurface.motionDatasetExecutable, false);

const unsafeSurface = evaluateNewSafeSurfaceApproval({
  blockingProductGapLabel: "blocking_gap_declared",
  productValueStatementLabel: "product_value_declared",
  existingRegistryReuseChecked: true,
  compactSummaryImpactChecked: true,
  compatibilityPlanPresent: true,
  ownerScopeRequired: true,
  rawPayload: "redacted",
});
assert.equal(unsafeSurface.approvalStatus, "blocked");
assert.equal(unsafeSurface.rejectionLabels.includes("unsafe_transition_key:rawPayload"), true);
assert.equal(unsafeSurface.rejectionLabels.includes("unknown_key:rawPayload"), true);

function validRealEvidence(overrides = {}) {
  return {
    component: "renderer",
    sourceType: "real_probe",
    evidenceTimestampStatus: "fresh",
    freshnessStatus: "fresh",
    rendererHeartbeatStatus: "present",
    realModelLoadSupported: true,
    modelLoaded: true,
    sceneLoaded: true,
    modelSceneMatchConfirmed: true,
    cueCapabilityConfirmed: true,
    lastCueApplied: true,
    lastCueAppliedSuccess: true,
    auditReferenceStatus: "present",
    ownerScopeStatus: "present",
    ...overrides,
  };
}

assert.deepEqual(REAL_EVIDENCE_ALLOWED_SOURCE_TYPES, [
  "real_probe",
  "owner_approved_safe_evidence",
]);
assert.deepEqual(REAL_EVIDENCE_REJECTED_SOURCE_TYPES, [
  "fixture",
  "manual_label_only",
  "manifest_only",
  "sse_only",
  "cue_accepted_only",
  "unknown",
]);

for (const sourceType of REAL_EVIDENCE_ALLOWED_SOURCE_TYPES) {
  const result = evaluateRealEvidenceTransition(validRealEvidence({ sourceType }));
  assert.equal(result.transitionStatus, "ready_for_owner_gated_real_evidence_review", sourceType);
  assert.deepEqual(result.rejectionLabels, [], sourceType);
  assert.equal(result.rendererReadyClaimed, false);
  assert.equal(result.rendererReadyCandidate, false);
  assert.equal(result.runtimeReadinessClaimed, false);
  assert.equal(result.productionReadinessClaimed, false);
  assert.equal(result.ownerConfirmationCreated, false);
  assert.equal(result.actualIngestionAllowed, false);
  assert.equal(result.trustedLoaderAllowlistEnabled, false);
}

for (const sourceType of REAL_EVIDENCE_REJECTED_SOURCE_TYPES) {
  const result = evaluateRealEvidenceTransition(validRealEvidence({ sourceType }));
  assert.equal(result.transitionStatus, "blocked", sourceType);
  assert.equal(result.rejectionLabels.includes(`rejected_source_type:${sourceType}`), true, sourceType);
}

const unknownSource = evaluateRealEvidenceTransition(validRealEvidence({ sourceType: "not_registered" }));
assert.equal(unknownSource.rejectionLabels.includes("unknown_source_type:not_registered"), true);

for (const [overrides, expected] of [
  [{ evidenceTimestampStatus: "future" }, "future_timestamp_rejected"],
  [{ evidenceTimestampStatus: "stale" }, "stale_timestamp_downgraded"],
  [{ freshnessStatus: "stale" }, "stale_timestamp_downgraded"],
  [{ rendererHeartbeatStatus: "missing" }, "missing_heartbeat"],
  [{ realModelLoadSupported: false }, "missing_model_load_support"],
  [{ modelLoaded: false }, "missing_model_load"],
  [{ sceneLoaded: false }, "missing_scene"],
  [{ modelSceneMatchConfirmed: false }, "model_scene_mismatch"],
  [{ cueCapabilityConfirmed: false }, "missing_cue_capability"],
  [{ lastCueApplied: false }, "missing_last_cue_applied"],
  [{ lastCueAppliedSuccess: false }, "missing_last_cue_applied_success"],
  [{ auditReferenceStatus: "missing" }, "missing_audit_reference"],
  [{ ownerScopeStatus: "missing" }, "missing_owner_scope"],
]) {
  const result = evaluateRealEvidenceTransition(validRealEvidence(overrides));
  assert.equal(result.transitionStatus, "blocked", expected);
  assert.equal(result.rejectionLabels.includes(expected), true, expected);
  assert.equal(result.runtimeReadinessClaimed, false, expected);
  assert.equal(result.productionReadinessClaimed, false, expected);
}

const unsafeRealEvidence = evaluateRealEvidenceTransition(validRealEvidence({
  actualIngestionRequest: true,
}));
assert.equal(unsafeRealEvidence.transitionStatus, "blocked");
assert.equal(unsafeRealEvidence.rejectionLabels.includes("unsafe_transition_key:actualIngestionRequest"), true);
assert.equal(unsafeRealEvidence.rejectionLabels.includes("unknown_key:actualIngestionRequest"), true);

const unknownFieldEvidence = evaluateRealEvidenceTransition(validRealEvidence({
  extraReadinessClaim: true,
}));
assert.equal(unknownFieldEvidence.transitionStatus, "blocked");
assert.equal(unknownFieldEvidence.rejectionLabels.includes("unknown_key:extraReadinessClaim"), true);

const input = validRealEvidence();
const snapshot = JSON.stringify(input);
assert.deepEqual(evaluateRealEvidenceTransition(input), evaluateRealEvidenceTransition(input));
assert.equal(JSON.stringify(input), snapshot);

console.log("safe-guard-transition-policy: pass");
