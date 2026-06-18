import assert from "node:assert/strict";
import {
  RENDERER_EVIDENCE_ALLOWED_SOURCE_TYPES,
  RENDERER_EVIDENCE_REJECTED_SOURCE_TYPES,
  decideRendererEvidence,
} from "../src/renderer/rendererEvidenceDecision.js";

function evidence(overrides = {}) {
  return {
    schema: "safe_evidence_envelope_v1",
    component: "renderer",
    sourceType: "real_probe",
    evidenceTimestampStatus: "fresh",
    freshnessStatus: "fresh",
    rendererHeartbeatStatus: "fresh",
    realModelLoadSupported: true,
    modelLoaded: true,
    sceneLoaded: true,
    modelSceneMatchConfirmed: true,
    cueCapabilityConfirmed: true,
    lastCueApplied: true,
    lastCueAppliedSuccess: true,
    auditReferenceStatus: "present",
    ownerScopeStatus: "confirmed",
    criticalBlockerLabels: [],
    ...overrides,
  };
}

function expectDecision(overrides, decision, label, bucket = "missingEvidenceLabels") {
  const result = decideRendererEvidence(evidence(overrides));
  assert.equal(result.decision, decision, label);
  if (label) assert.equal(result[bucket].includes(label), true, label);
  assert.equal(result.safeSummaryOnly, true, label);
  return result;
}

for (const sourceType of RENDERER_EVIDENCE_ALLOWED_SOURCE_TYPES) {
  const result = expectDecision({ sourceType }, "renderer_ready_candidate");
  assert.equal(result.candidateReasonLabels.includes("candidate_not_runtime_readiness"), true);
  assert.equal(result.candidateReasonLabels.includes("candidate_not_production_readiness"), true);
  assert.equal(result.candidateReasonLabels.includes("candidate_not_owner_confirmation"), true);
}

for (const sourceType of RENDERER_EVIDENCE_REJECTED_SOURCE_TYPES) {
  expectDecision({ sourceType }, "blocked", `rejected_source_type:${sourceType}`, "blockerLabels");
}

expectDecision({ sourceType: "not_registered" }, "blocked", "unsupported_source_type", "blockerLabels");
expectDecision({ rawPayload: "redacted" }, "blocked", "unsafe_field:rawPayload", "blockerLabels");
expectDecision({ endpoint: "redacted" }, "blocked", "unsafe_field:endpoint", "blockerLabels");
expectDecision({ extraField: true }, "blocked", "unknown_field:extraField", "blockerLabels");
expectDecision(Object.defineProperty(evidence(), "__proto__", { value: "x", enumerable: true }), "blocked", "unsafe_key:__proto__", "blockerLabels");

expectDecision({ evidenceTimestampStatus: "future" }, "blocked", "future_timestamp_status", "blockerLabels");
expectDecision({ evidenceTimestampStatus: "stale" }, "attention_required", "stale_evidence", "staleEvidenceLabels");
expectDecision({ freshnessStatus: "stale" }, "attention_required", "stale_evidence", "staleEvidenceLabels");
expectDecision({ freshnessStatus: "unknown" }, "blocked", "freshness_not_fresh");
expectDecision({ rendererHeartbeatStatus: "missing" }, "blocked", "fresh_heartbeat_missing");
expectDecision({ realModelLoadSupported: false }, "blocked", "real_model_load_support_missing");
expectDecision({ modelLoaded: false }, "blocked", "model_loaded_missing");
expectDecision({ sceneLoaded: false }, "blocked", "scene_loaded_missing");
expectDecision({ modelSceneMatchConfirmed: false }, "blocked", "model_scene_match_missing");
expectDecision({ cueCapabilityConfirmed: false }, "blocked", "cue_capability_missing");
expectDecision({ lastCueApplied: false }, "blocked", "last_cue_applied_missing");
expectDecision({ lastCueAppliedSuccess: false }, "blocked", "last_cue_applied_success_missing");
expectDecision({ auditReferenceStatus: "missing" }, "blocked", "audit_reference_missing");
expectDecision({ ownerScopeStatus: "missing" }, "blocked", "owner_scope_confirmed_missing");
expectDecision({ criticalBlockerLabels: ["priority1_blocked"] }, "blocked", "critical_blocker:priority1_blocked", "blockerLabels");
expectDecision({ criticalBlockerLabels: [""] }, "blocked", "critical_blocker_label_invalid", "blockerLabels");
expectDecision({ criticalBlockerLabels: null }, "blocked", "critical_blocker_labels_missing", "blockerLabels");

const input = evidence();
const snapshot = JSON.stringify(input);
assert.deepEqual(decideRendererEvidence(input), decideRendererEvidence(input));
assert.equal(JSON.stringify(input), snapshot);

const result = decideRendererEvidence(input);
assert.deepEqual(Object.keys(result).sort(), [
  "blockerLabels",
  "candidateReasonLabels",
  "decision",
  "missingEvidenceLabels",
  "safeSummaryOnly",
  "schema",
  "staleEvidenceLabels",
].sort());

console.log("renderer-evidence-decision: pass");
