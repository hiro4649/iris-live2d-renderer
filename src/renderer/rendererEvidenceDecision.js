export const RENDERER_EVIDENCE_DECISION_SCHEMA = "live2d_renderer_evidence_decision_v1";
import {
  isPrototypePollutionKey,
  validateSafeLabelArray,
  validateSafeLabelValue,
} from "./safeLabelValidation.js";
import {
  LIVE2D_EVIDENCE_SOURCE_TYPES,
  LIVE2D_REJECTED_EVIDENCE_SOURCE_TYPES,
} from "./live2dSafeContractCatalog.js";

export const RENDERER_EVIDENCE_ALLOWED_SOURCE_TYPES = LIVE2D_EVIDENCE_SOURCE_TYPES;

export const RENDERER_EVIDENCE_REJECTED_SOURCE_TYPES = LIVE2D_REJECTED_EVIDENCE_SOURCE_TYPES;

const ALLOWED_INPUT_KEYS = new Set([
  "schema",
  "component",
  "sourceType",
  "evidenceTimestampStatus",
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
  "criticalBlockerLabels",
]);

const SCHEMA_ALLOWLIST = Object.freeze(["live2d_renderer_evidence_envelope_v1", "safe_evidence_envelope_v1"]);
const COMPONENT_ALLOWLIST = Object.freeze(["live2d_renderer", "renderer"]);
const SOURCE_TYPE_ALLOWLIST = Object.freeze([
  ...RENDERER_EVIDENCE_ALLOWED_SOURCE_TYPES,
  ...RENDERER_EVIDENCE_REJECTED_SOURCE_TYPES,
]);
const EVIDENCE_TIMESTAMP_STATUS_ALLOWLIST = Object.freeze(["fresh", "stale", "future", "missing"]);
const FRESHNESS_STATUS_ALLOWLIST = Object.freeze(["fresh", "stale", "missing"]);
const HEARTBEAT_STATUS_ALLOWLIST = Object.freeze(["fresh", "stale", "missing"]);
const AUDIT_REFERENCE_STATUS_ALLOWLIST = Object.freeze(["present", "missing", "stale"]);
const OWNER_SCOPE_STATUS_ALLOWLIST = Object.freeze(["confirmed", "missing", "expired", "wrong_scope"]);
const CRITICAL_BLOCKER_LABEL_ALLOWLIST = Object.freeze([
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
  "actual_data_missing",
  "audit_reference_missing",
  "owner_scope_missing",
  "real_renderer_probe_missing",
]);

const UNSAFE_INPUT_KEYS = new Set([
  "rawEvidence",
  "rawPayload",
  "rawTimestamp",
  "rawRendererPayload",
  "rawCuePayload",
  "rawRowBody",
  "rawFileBody",
  "actualFileContent",
  "actualFilePathValue",
  "privatePath",
  "endpoint",
  "token",
  "secret",
  "commandPayload",
  "shellBody",
  "ownerPrivateNote",
]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function collectShapeFailures(input) {
  const failures = [];
  if (!isPlainObject(input)) return ["input_not_plain_object"];
  for (const key of Object.keys(input)) {
    if (isPrototypePollutionKey(key)) failures.push(`unsafe_key:${key}`);
    if (UNSAFE_INPUT_KEYS.has(key)) failures.push(`unsafe_field:${key}`);
    if (!ALLOWED_INPUT_KEYS.has(key)) failures.push(`unknown_field:${key}`);
  }
  return failures;
}

function hasPresentLabel(value) {
  return value === "present" || value === "confirmed" || value === true;
}

function normalizeCriticalBlockers(value) {
  const result = validateSafeLabelArray(value, {
    allowedLabels: CRITICAL_BLOCKER_LABEL_ALLOWLIST,
    missingLabel: "critical_blocker_labels_missing",
    invalidLabel: "critical_blocker_label_invalid",
    unknownLabel: "critical_blocker_label_unknown",
  });
  return [
    ...result.labels.map((label) => `critical_blocker:${label}`),
    ...result.failures,
  ];
}

export function decideRendererEvidence(input = {}) {
  const blockerLabels = collectShapeFailures(input);
  const missingEvidenceLabels = [];
  const staleEvidenceLabels = [];
  const candidateReasonLabels = [];

  if (blockerLabels.length) {
    return {
      schema: RENDERER_EVIDENCE_DECISION_SCHEMA,
      decision: "blocked",
      blockerLabels,
      missingEvidenceLabels,
      staleEvidenceLabels,
      candidateReasonLabels,
      safeSummaryOnly: true,
    };
  }

  const schema = validateSafeLabelValue(input.schema, {
    allowedLabels: SCHEMA_ALLOWLIST,
    missingLabel: "schema_missing",
    invalidLabel: "schema_invalid",
    unknownLabel: "schema_unknown",
  });
  const component = validateSafeLabelValue(input.component, {
    allowedLabels: COMPONENT_ALLOWLIST,
    missingLabel: "component_missing",
    invalidLabel: "component_invalid",
    unknownLabel: "component_unknown",
  });
  const sourceType = validateSafeLabelValue(input.sourceType, {
    allowedLabels: SOURCE_TYPE_ALLOWLIST,
    missingLabel: "source_type_missing",
    invalidLabel: "source_type_invalid",
    unknownLabel: "source_type_unknown",
  });
  const evidenceTimestampStatus = validateSafeLabelValue(input.evidenceTimestampStatus, {
    allowedLabels: EVIDENCE_TIMESTAMP_STATUS_ALLOWLIST,
    missingLabel: "evidence_timestamp_status_missing",
    invalidLabel: "evidence_timestamp_status_invalid",
    unknownLabel: "evidence_timestamp_status_unknown",
  });
  const freshnessStatus = validateSafeLabelValue(input.freshnessStatus, {
    allowedLabels: FRESHNESS_STATUS_ALLOWLIST,
    missingLabel: "freshness_status_missing",
    invalidLabel: "freshness_status_invalid",
    unknownLabel: "freshness_status_unknown",
  });
  const heartbeatStatus = validateSafeLabelValue(input.rendererHeartbeatStatus, {
    allowedLabels: HEARTBEAT_STATUS_ALLOWLIST,
    missingLabel: "renderer_heartbeat_status_missing",
    invalidLabel: "renderer_heartbeat_status_invalid",
    unknownLabel: "renderer_heartbeat_status_unknown",
  });
  const auditStatus = validateSafeLabelValue(input.auditReferenceStatus, {
    allowedLabels: AUDIT_REFERENCE_STATUS_ALLOWLIST,
    missingLabel: "audit_reference_status_missing",
    invalidLabel: "audit_reference_status_invalid",
    unknownLabel: "audit_reference_status_unknown",
  });
  const ownerScopeStatus = validateSafeLabelValue(input.ownerScopeStatus, {
    allowedLabels: OWNER_SCOPE_STATUS_ALLOWLIST,
    missingLabel: "owner_scope_status_missing",
    invalidLabel: "owner_scope_status_invalid",
    unknownLabel: "owner_scope_status_unknown",
  });
  blockerLabels.push(
    ...schema.failures,
    ...component.failures,
    ...sourceType.failures,
    ...evidenceTimestampStatus.failures,
    ...freshnessStatus.failures,
    ...heartbeatStatus.failures,
    ...auditStatus.failures,
    ...ownerScopeStatus.failures,
  );

  if (!RENDERER_EVIDENCE_ALLOWED_SOURCE_TYPES.includes(input.sourceType)) {
    blockerLabels.push(
      RENDERER_EVIDENCE_REJECTED_SOURCE_TYPES.includes(input.sourceType)
        ? `rejected_source_type:${input.sourceType}`
        : "unsupported_source_type",
    );
  }
  if (input.evidenceTimestampStatus === "future") blockerLabels.push("future_timestamp_status");
  if (input.evidenceTimestampStatus === "stale" || input.freshnessStatus === "stale") {
    staleEvidenceLabels.push("stale_evidence");
  }
  if (input.freshnessStatus !== "fresh" && input.freshnessStatus !== "stale") {
    missingEvidenceLabels.push("freshness_not_fresh");
  }
  if (input.rendererHeartbeatStatus !== "fresh") missingEvidenceLabels.push("fresh_heartbeat_missing");
  if (input.realModelLoadSupported !== true) missingEvidenceLabels.push("real_model_load_support_missing");
  if (input.modelLoaded !== true) missingEvidenceLabels.push("model_loaded_missing");
  if (input.sceneLoaded !== true) missingEvidenceLabels.push("scene_loaded_missing");
  if (input.modelSceneMatchConfirmed !== true) missingEvidenceLabels.push("model_scene_match_missing");
  if (input.cueCapabilityConfirmed !== true) missingEvidenceLabels.push("cue_capability_missing");
  if (input.lastCueApplied !== true) missingEvidenceLabels.push("last_cue_applied_missing");
  if (input.lastCueAppliedSuccess !== true) missingEvidenceLabels.push("last_cue_applied_success_missing");
  if (!hasPresentLabel(input.auditReferenceStatus)) missingEvidenceLabels.push("audit_reference_missing");
  if (input.ownerScopeStatus !== "confirmed") missingEvidenceLabels.push("owner_scope_confirmed_missing");
  blockerLabels.push(...normalizeCriticalBlockers(input.criticalBlockerLabels));

  const decision = blockerLabels.length || missingEvidenceLabels.length
    ? "blocked"
    : staleEvidenceLabels.length
      ? "attention_required"
      : "renderer_ready_candidate";

  if (decision === "renderer_ready_candidate") {
    candidateReasonLabels.push("fresh_owner_scoped_real_evidence_candidate");
    candidateReasonLabels.push("candidate_not_runtime_readiness");
    candidateReasonLabels.push("candidate_not_production_readiness");
    candidateReasonLabels.push("candidate_not_owner_confirmation");
  }

  return {
    schema: RENDERER_EVIDENCE_DECISION_SCHEMA,
    decision,
    blockerLabels,
    missingEvidenceLabels,
    staleEvidenceLabels,
    candidateReasonLabels,
    safeSummaryOnly: true,
  };
}
