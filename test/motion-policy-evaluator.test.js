import assert from "node:assert/strict";
import {
  EXPERIMENTAL_MOTION_LABELS,
  MOTION_POLICY_CONFIDENCE_THRESHOLD,
  MOTION_POLICY_STRONG_CONFIDENCE_THRESHOLD,
  MOTION_POLICY_STRONG_REPEAT_LIMIT,
  SAFE_FALLBACK_MOTION_LABELS,
  STRONG_MOTION_LABELS,
  SUPPORTED_MOTION_LABELS,
  evaluateMotionPolicy,
} from "../src/renderer/motionPolicyEvaluator.js";

function policyInput(overrides = {}) {
  return {
    motionLabel: "talk",
    cueFreshness: "fresh",
    confidence: 0.9,
    recentStrongMotionHistory: 0,
    viewerComfortMode: false,
    subtitleOcclusionRisk: "none",
    gazePressureRisk: "none",
    cameraProximityRisk: "none",
    recoveryPlanPresent: true,
    cooldownStatus: "ready",
    seriousFocus: false,
    moderationState: "allowed",
    minorSafetySignal: false,
    romanticPressureSignal: false,
    dependencyPressureSignal: false,
    donationOnlyEscalation: false,
    relationOnlyEscalation: false,
    ...overrides,
  };
}

function expectDecision(overrides, decision, reasonCode) {
  const result = evaluateMotionPolicy(policyInput(overrides));
  assert.equal(result.decision, decision, reasonCode);
  if (reasonCode) assert.equal(result.reasonCodes.includes(reasonCode), true, reasonCode);
  assert.equal(result.safeSummaryOnly, true, reasonCode);
  return result;
}

for (const motionLabel of SUPPORTED_MOTION_LABELS) {
  const result = evaluateMotionPolicy(policyInput({
    motionLabel,
    confidence: STRONG_MOTION_LABELS.includes(motionLabel) ? 0.9 : 0.7,
    recoveryPlanPresent: true,
  }));
  assert.equal(result.decision, "allow_policy_candidate", motionLabel);
  assert.equal(result.selectedMotionLabel, motionLabel, motionLabel);
}

for (const motionLabel of EXPERIMENTAL_MOTION_LABELS) {
  expectDecision({ motionLabel }, "reject", "experimental_motion_not_runtime_executable");
}

expectDecision({ motionLabel: "not_supported" }, "reject", "unsupported_motion_label");
expectDecision({ endpoint: "redacted" }, "reject", "unsafe_field:endpoint");
expectDecision({ raw_cue_payload: "redacted" }, "reject", "unsafe_field:raw_cue_payload");
expectDecision({ donation_amount: 100 }, "reject", "unsafe_field:donation_amount");
expectDecision({ extraField: true }, "reject", "unknown_field:extraField");
expectDecision(Object.defineProperty(policyInput(), "__proto__", { value: "x", enumerable: true }), "reject", "unsafe_key:__proto__");

for (const [overrides, reasonCode] of [
  [{ cueFreshness: "stale_reject" }, "stale_cue_reject"],
  [{ cueFreshness: "stale_downgrade_required" }, "stale_cue_downgrade_required"],
  [{ confidence: MOTION_POLICY_CONFIDENCE_THRESHOLD - 0.01 }, "confidence_below_policy_threshold"],
  [{ motionLabel: "laugh_big", confidence: MOTION_POLICY_STRONG_CONFIDENCE_THRESHOLD - 0.01 }, "strong_motion_confidence_downgrade_required"],
  [{ motionLabel: "laugh_big", recoveryPlanPresent: false }, "strong_motion_recovery_plan_missing"],
  [{ motionLabel: "laugh_big", cooldownStatus: "cooling_down" }, "strong_motion_cooling_down"],
  [{ motionLabel: "laugh_big", cooldownStatus: "unknown" }, "strong_motion_cooldown_unknown"],
  [{ motionLabel: "laugh_big", recentStrongMotionHistory: MOTION_POLICY_STRONG_REPEAT_LIMIT }, "strong_motion_repeat_fatigue"],
  [{ motionLabel: "happy_dance", subtitleOcclusionRisk: "high" }, "subtitle_high_risk"],
  [{ motionLabel: "focused_talk", gazePressureRisk: "high" }, "gaze_high_risk"],
  [{ motionLabel: "surprise_scream", cameraProximityRisk: "high" }, "camera_high_risk"],
  [{ motionLabel: "happy_humming", seriousFocus: true }, "serious_focus_playful_motion_downgrade_required"],
  [{ minorSafetySignal: true }, "minor_safety_safe_distance_required"],
  [{ romanticPressureSignal: true }, "romantic_pressure_safe_distance_required"],
  [{ dependencyPressureSignal: true }, "dependency_pressure_safe_distance_required"],
  [{ donationOnlyEscalation: true }, "donation_only_escalation_no_intensity_increase"],
  [{ relationOnlyEscalation: true }, "relation_only_escalation_no_intensity_increase"],
]) {
  const expectedDecision = [
    "stale_cue_reject",
    "confidence_below_policy_threshold",
    "strong_motion_recovery_plan_missing",
  ].includes(reasonCode) ? "reject" : "downgrade";
  const result = expectDecision(overrides, expectedDecision, reasonCode);
  if (expectedDecision === "downgrade") {
    assert.equal(SAFE_FALLBACK_MOTION_LABELS.includes(result.downgradedMotionLabel), true, reasonCode);
    assert.equal(result.selectedMotionLabel, null, reasonCode);
  }
}

for (const motionLabel of STRONG_MOTION_LABELS) {
  expectDecision({ motionLabel, moderationState: "limited" }, "reject", "moderation_limited_strong_motion");
  expectDecision({ motionLabel, moderationState: "muted" }, "reject", "moderation_muted_strong_motion");
}
expectDecision({ moderationState: "blocked" }, "reject", "moderation_blocked");
expectDecision({ moderationState: "watch" }, "allow_policy_candidate", "policy_candidate_only");

for (const [key, value, reasonCode] of [
  ["cueFreshness", "invalid", "invalid_cue_freshness"],
  ["confidence", -0.1, "invalid_confidence"],
  ["confidence", 1.1, "invalid_confidence"],
  ["recentStrongMotionHistory", -1, "invalid_recent_strong_motion_history"],
  ["viewerComfortMode", "yes", "invalid_boolean:viewerComfortMode"],
  ["subtitleOcclusionRisk", "severe", "invalid_risk:subtitleOcclusionRisk"],
  ["gazePressureRisk", "severe", "invalid_risk:gazePressureRisk"],
  ["cameraProximityRisk", "severe", "invalid_risk:cameraProximityRisk"],
  ["cooldownStatus", "paused", "invalid_cooldown_status"],
  ["moderationState", "hidden", "invalid_moderation_state"],
]) {
  expectDecision({ [key]: value }, "reject", reasonCode);
}

const input = policyInput({ motionLabel: "happy_dance", cueFreshness: "stale_downgrade_required" });
const snapshot = JSON.stringify(input);
assert.deepEqual(evaluateMotionPolicy(input), evaluateMotionPolicy(input));
assert.equal(JSON.stringify(input), snapshot);

const result = evaluateMotionPolicy(input);
assert.deepEqual(Object.keys(result).sort(), [
  "decision",
  "downgradedMotionLabel",
  "reasonCodes",
  "recoveryMotionLabel",
  "safeSummaryOnly",
  "schema",
  "selectedMotionLabel",
].sort());
assert.equal(result.recoveryMotionLabel, "idle_breath");

console.log("motion-policy-evaluator: pass");
