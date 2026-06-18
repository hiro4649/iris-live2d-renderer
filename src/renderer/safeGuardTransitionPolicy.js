export const SAFE_GUARD_TRANSITION_POLICY_SCHEMA = "live2d_safe_guard_transition_policy_v1";
export const SAFE_GUARD_NEW_SURFACE_APPROVAL_SCHEMA = "live2d_safe_guard_new_surface_approval_v1";
export const SAFE_GUARD_REAL_EVIDENCE_TRANSITION_SCHEMA = "live2d_safe_guard_real_evidence_transition_v1";

export const REAL_EVIDENCE_ALLOWED_SOURCE_TYPES = Object.freeze([
  "real_probe",
  "owner_approved_safe_evidence",
]);

export const REAL_EVIDENCE_REJECTED_SOURCE_TYPES = Object.freeze([
  "fixture",
  "manual_label_only",
  "manifest_only",
  "sse_only",
  "cue_accepted_only",
  "unknown",
]);

const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "prototype", "constructor"]);

const NEW_SURFACE_ALLOWED_KEYS = new Set([
  "blockingProductGapLabel",
  "productValueStatementLabel",
  "existingRegistryReuseChecked",
  "compactSummaryImpactChecked",
  "compatibilityPlanPresent",
  "ownerScopeRequired",
]);

const REAL_EVIDENCE_ALLOWED_KEYS = new Set([
  "component",
  "sourceType",
  "evidenceTimestampStatus",
  "evidenceTimestampMs",
  "freshnessStatus",
  "rendererHeartbeatStatus",
  "realModelLoadSupported",
  "modelLoaded",
  "sceneLoaded",
  "modelSceneMatchConfirmed",
  "cueCapabilityConfirmed",
  "lastCueApplied",
  "lastCueAppliedSuccess",
  "auditReferenceStatus",
  "ownerScopeStatus",
]);

const UNSAFE_TRANSITION_KEYS = new Set([
  "rawPayload",
  "rawRowBody",
  "rawFileBody",
  "actualFileContent",
  "actualFilePathValue",
  "privatePath",
  "endpoint",
  "token",
  "secret",
  "rawOwnerNote",
  "rawAuditBody",
  "actualProbeRequest",
  "actualIngestionRequest",
  "trustedLoaderEnablementRequest",
  "runtimeReadinessClaimRequest",
  "productionReadinessClaimRequest",
  "ownerConfirmationRequest",
]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasSafeStringLabel(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function collectKeyFailures(input, allowedKeys) {
  const failures = [];
  if (!isPlainObject(input)) return ["input_not_plain_object"];
  for (const key of Object.keys(input)) {
    if (PROTOTYPE_POLLUTION_KEYS.has(key)) failures.push(`unsafe_key:${key}`);
    if (UNSAFE_TRANSITION_KEYS.has(key)) failures.push(`unsafe_transition_key:${key}`);
    if (!allowedKeys.has(key)) failures.push(`unknown_key:${key}`);
  }
  return failures;
}

function blockedTransitionBase(schema) {
  return {
    schema,
    safeSummaryOnly: true,
    authorizing: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actualIngestionAllowed: false,
    trustedLoaderAllowlistEnabled: false,
    priority1Status: "BLOCKED",
    checkedRowCount: 0,
    motionDatasetExecutable: false,
  };
}

export function createSafeGuardTransitionPolicy() {
  return {
    schema: SAFE_GUARD_TRANSITION_POLICY_SCHEMA,
    safeSummaryOnly: true,
    safeGuardFreezeStatus: "frozen_for_one_field_status_prs",
    newSafeSurfaceRequiresBlockingGap: true,
    newSafeSurfaceRequiresProductValue: true,
    registryAuthoritative: true,
    compatibilityAliasPolicy: "explicit_alias_required",
    deprecationPolicy: "explicit_owner_review_required",
    ownerScopeRequired: true,
    realEvidenceRequired: true,
    rowManifestRequired: true,
    actualProbeOwnerGated: true,
    trustedLoaderOwnerGated: true,
    runtimeReadinessOwnerGated: true,
    productionGoNoGoOwnerGated: true,
  };
}

export function evaluateNewSafeSurfaceApproval(input = {}) {
  const rejectionLabels = collectKeyFailures(input, NEW_SURFACE_ALLOWED_KEYS);
  const requiredLabels = [
    ["blockingProductGapLabel", "missing_blocking_product_gap_label"],
    ["productValueStatementLabel", "missing_product_value_statement_label"],
  ];
  for (const [key, label] of requiredLabels) {
    if (!hasSafeStringLabel(input[key])) rejectionLabels.push(label);
  }
  for (const [key, label] of [
    ["existingRegistryReuseChecked", "existing_registry_reuse_not_checked"],
    ["compactSummaryImpactChecked", "compact_summary_impact_not_checked"],
    ["compatibilityPlanPresent", "compatibility_plan_missing"],
    ["ownerScopeRequired", "owner_scope_not_required"],
  ]) {
    if (input[key] !== true) rejectionLabels.push(label);
  }
  return {
    ...blockedTransitionBase(SAFE_GUARD_NEW_SURFACE_APPROVAL_SCHEMA),
    approvalStatus: rejectionLabels.length ? "blocked" : "approved_for_review",
    newSafeSurfaceRequiresBlockingGap: true,
    newSafeSurfaceRequiresProductValue: true,
    registryAuthoritative: true,
    rejectionLabels,
  };
}

export function evaluateRealEvidenceTransition(input = {}) {
  const rejectionLabels = collectKeyFailures(input, REAL_EVIDENCE_ALLOWED_KEYS);
  const sourceType = hasSafeStringLabel(input.sourceType) ? input.sourceType : "unknown";
  if (!REAL_EVIDENCE_ALLOWED_SOURCE_TYPES.includes(sourceType)) {
    rejectionLabels.push(
      REAL_EVIDENCE_REJECTED_SOURCE_TYPES.includes(sourceType)
        ? `rejected_source_type:${sourceType}`
        : `unknown_source_type:${sourceType}`,
    );
  }
  if (input.evidenceTimestampStatus === "future") rejectionLabels.push("future_timestamp_rejected");
  if (input.evidenceTimestampStatus === "stale" || input.freshnessStatus === "stale") {
    rejectionLabels.push("stale_timestamp_downgraded");
  }
  if (input.rendererHeartbeatStatus !== "present") rejectionLabels.push("missing_heartbeat");
  if (input.realModelLoadSupported !== true) rejectionLabels.push("missing_model_load_support");
  if (input.modelLoaded !== true) rejectionLabels.push("missing_model_load");
  if (input.sceneLoaded !== true) rejectionLabels.push("missing_scene");
  if (input.modelSceneMatchConfirmed !== true) rejectionLabels.push("model_scene_mismatch");
  if (input.cueCapabilityConfirmed !== true) rejectionLabels.push("missing_cue_capability");
  if (input.lastCueApplied !== true) rejectionLabels.push("missing_last_cue_applied");
  if (input.lastCueAppliedSuccess !== true) rejectionLabels.push("missing_last_cue_applied_success");
  if (input.auditReferenceStatus !== "present") rejectionLabels.push("missing_audit_reference");
  if (input.ownerScopeStatus !== "present") rejectionLabels.push("missing_owner_scope");

  return {
    ...blockedTransitionBase(SAFE_GUARD_REAL_EVIDENCE_TRANSITION_SCHEMA),
    transitionStatus: rejectionLabels.length ? "blocked" : "ready_for_owner_gated_real_evidence_review",
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    realEvidenceRequired: true,
    rowManifestRequired: true,
    allowedSourceTypes: [...REAL_EVIDENCE_ALLOWED_SOURCE_TYPES],
    rejectedSourceTypes: [...REAL_EVIDENCE_REJECTED_SOURCE_TYPES],
    rejectionLabels,
  };
}
