export const RENDERER_EVIDENCE_DECISION_SCHEMA = "live2d_renderer_evidence_decision_v1";

export const RENDERER_EVIDENCE_ALLOWED_SOURCE_TYPES = Object.freeze([
  "real_probe",
  "owner_approved_safe_evidence",
]);

export const RENDERER_EVIDENCE_REJECTED_SOURCE_TYPES = Object.freeze([
  "fixture",
  "manual_label_only",
  "manifest_only",
  "sse_only",
  "cue_accepted_only",
  "unknown",
]);

const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "prototype", "constructor"]);

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
    if (PROTOTYPE_POLLUTION_KEYS.has(key)) failures.push(`unsafe_key:${key}`);
    if (UNSAFE_INPUT_KEYS.has(key)) failures.push(`unsafe_field:${key}`);
    if (!ALLOWED_INPUT_KEYS.has(key)) failures.push(`unknown_field:${key}`);
  }
  return failures;
}

function hasPresentLabel(value) {
  return value === "present" || value === "confirmed" || value === true;
}

function normalizeCriticalBlockers(value) {
  if (!Array.isArray(value)) return ["critical_blocker_labels_missing"];
  const labels = [];
  for (const item of value) {
    if (typeof item !== "string" || !item.trim()) {
      labels.push("critical_blocker_label_invalid");
    } else {
      labels.push(`critical_blocker:${item}`);
    }
  }
  return labels;
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
