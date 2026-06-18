export const MOTION_POLICY_EVALUATOR_SCHEMA = "live2d_motion_policy_evaluator_v1";

export const SUPPORTED_MOTION_LABELS = Object.freeze([
  "talk",
  "focused_talk",
  "laugh_big",
  "idle_breath",
  "surprise_scream",
  "happy_humming",
  "happy_dance",
  "happy_loud_sing",
]);

export const EXPERIMENTAL_MOTION_LABELS = Object.freeze([
  "blink_attention",
  "small_nod",
  "soft_smile",
  "surprise_micro",
  "breathing_shift",
  "gaze_return",
  "neutral_breath",
]);

export const STRONG_MOTION_LABELS = Object.freeze([
  "laugh_big",
  "surprise_scream",
  "happy_dance",
  "happy_loud_sing",
]);

export const SAFE_FALLBACK_MOTION_LABELS = Object.freeze([
  "idle_breath",
  "focused_talk",
  "happy_humming",
]);

export const MOTION_POLICY_CONFIDENCE_THRESHOLD = 0.6;
export const MOTION_POLICY_STRONG_CONFIDENCE_THRESHOLD = 0.72;
export const MOTION_POLICY_STRONG_REPEAT_LIMIT = 2;

const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "prototype", "constructor"]);

const ALLOWED_INPUT_KEYS = new Set([
  "motionLabel",
  "cueFreshness",
  "confidence",
  "recentStrongMotionHistory",
  "viewerComfortMode",
  "subtitleOcclusionRisk",
  "gazePressureRisk",
  "cameraProximityRisk",
  "recoveryPlanPresent",
  "cooldownStatus",
  "seriousFocus",
  "moderationState",
  "minorSafetySignal",
  "romanticPressureSignal",
  "dependencyPressureSignal",
  "donationOnlyEscalation",
  "relationOnlyEscalation",
]);

const UNSAFE_INPUT_KEYS = new Set([
  "endpoint",
  "token",
  "secret",
  "raw_renderer_payload",
  "raw_cue_payload",
  "raw_model_path",
  "raw_motion_path",
  "command_payload",
  "shell_body",
  "owner_private_note",
  "relation_score",
  "donation_amount",
]);

const CUE_FRESHNESS = new Set([
  "fresh",
  "delayed_but_usable",
  "stale_downgrade_required",
  "stale_reject",
]);

const RISK_LEVELS = new Set(["none", "low", "medium", "high"]);
const COOLDOWN_STATUS = new Set(["ready", "cooling_down", "unknown"]);
const MODERATION_STATES = new Set(["allowed", "watch", "limited", "muted", "blocked"]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function baseResult(decision, reasonCodes, selectedMotionLabel = null, downgradedMotionLabel = null) {
  return {
    schema: MOTION_POLICY_EVALUATOR_SCHEMA,
    decision,
    selectedMotionLabel,
    downgradedMotionLabel,
    recoveryMotionLabel: "idle_breath",
    reasonCodes,
    safeSummaryOnly: true,
  };
}

function collectShapeFailures(input) {
  const reasonCodes = [];
  if (!isPlainObject(input)) return ["input_not_plain_object"];
  for (const key of Object.keys(input)) {
    if (PROTOTYPE_POLLUTION_KEYS.has(key)) reasonCodes.push(`unsafe_key:${key}`);
    if (UNSAFE_INPUT_KEYS.has(key)) reasonCodes.push(`unsafe_field:${key}`);
    if (!ALLOWED_INPUT_KEYS.has(key)) reasonCodes.push(`unknown_field:${key}`);
  }
  return reasonCodes;
}

function validateTypedFields(input) {
  const reasonCodes = [];
  if (!SUPPORTED_MOTION_LABELS.includes(input.motionLabel)) {
    reasonCodes.push(
      EXPERIMENTAL_MOTION_LABELS.includes(input.motionLabel)
        ? "experimental_motion_not_runtime_executable"
        : "unsupported_motion_label",
    );
  }
  if (!CUE_FRESHNESS.has(input.cueFreshness)) reasonCodes.push("invalid_cue_freshness");
  if (typeof input.confidence !== "number" || Number.isNaN(input.confidence) || input.confidence < 0 || input.confidence > 1) {
    reasonCodes.push("invalid_confidence");
  }
  if (!Number.isInteger(input.recentStrongMotionHistory) || input.recentStrongMotionHistory < 0) {
    reasonCodes.push("invalid_recent_strong_motion_history");
  }
  for (const key of ["viewerComfortMode", "recoveryPlanPresent", "seriousFocus", "minorSafetySignal", "romanticPressureSignal", "dependencyPressureSignal", "donationOnlyEscalation", "relationOnlyEscalation"]) {
    if (typeof input[key] !== "boolean") reasonCodes.push(`invalid_boolean:${key}`);
  }
  for (const key of ["subtitleOcclusionRisk", "gazePressureRisk", "cameraProximityRisk"]) {
    if (!RISK_LEVELS.has(input[key])) reasonCodes.push(`invalid_risk:${key}`);
  }
  if (!COOLDOWN_STATUS.has(input.cooldownStatus)) reasonCodes.push("invalid_cooldown_status");
  if (!MODERATION_STATES.has(input.moderationState)) reasonCodes.push("invalid_moderation_state");
  return reasonCodes;
}

function fallbackFor(input, reasonCodes) {
  if (input.minorSafetySignal || input.romanticPressureSignal || input.dependencyPressureSignal) return "idle_breath";
  if (input.seriousFocus) return "focused_talk";
  if (input.viewerComfortMode || reasonCodes.includes("subtitle_high_risk") || reasonCodes.includes("camera_high_risk")) return "idle_breath";
  return "focused_talk";
}

export function evaluateMotionPolicy(input = {}) {
  const shapeFailures = collectShapeFailures(input);
  if (shapeFailures.length) return baseResult("reject", shapeFailures);

  const typedFailures = validateTypedFields(input);
  if (typedFailures.length) return baseResult("reject", typedFailures);

  const reasonCodes = [];
  const isStrongMotion = STRONG_MOTION_LABELS.includes(input.motionLabel);

  if (input.moderationState === "blocked") {
    return baseResult("reject", ["moderation_blocked"]);
  }
  if (input.moderationState === "muted" && isStrongMotion) {
    return baseResult("reject", ["moderation_muted_strong_motion"]);
  }
  if (input.moderationState === "limited" && isStrongMotion) {
    return baseResult("reject", ["moderation_limited_strong_motion"]);
  }

  if (input.minorSafetySignal) reasonCodes.push("minor_safety_safe_distance_required");
  if (input.romanticPressureSignal) reasonCodes.push("romantic_pressure_safe_distance_required");
  if (input.dependencyPressureSignal) reasonCodes.push("dependency_pressure_safe_distance_required");
  if (input.donationOnlyEscalation) reasonCodes.push("donation_only_escalation_no_intensity_increase");
  if (input.relationOnlyEscalation) reasonCodes.push("relation_only_escalation_no_intensity_increase");

  if (input.cueFreshness === "stale_reject") return baseResult("reject", ["stale_cue_reject"]);
  if (input.cueFreshness === "stale_downgrade_required") reasonCodes.push("stale_cue_downgrade_required");
  if (input.confidence < MOTION_POLICY_CONFIDENCE_THRESHOLD) {
    return baseResult("reject", ["confidence_below_policy_threshold"]);
  }
  if (isStrongMotion && input.confidence < MOTION_POLICY_STRONG_CONFIDENCE_THRESHOLD) {
    reasonCodes.push("strong_motion_confidence_downgrade_required");
  }
  if (input.subtitleOcclusionRisk === "high") reasonCodes.push("subtitle_high_risk");
  if (input.gazePressureRisk === "high") reasonCodes.push("gaze_high_risk");
  if (input.cameraProximityRisk === "high") reasonCodes.push("camera_high_risk");
  if (isStrongMotion && input.recoveryPlanPresent !== true) {
    return baseResult("reject", ["strong_motion_recovery_plan_missing"]);
  }
  if (isStrongMotion && input.cooldownStatus === "cooling_down") reasonCodes.push("strong_motion_cooling_down");
  if (isStrongMotion && input.cooldownStatus === "unknown") reasonCodes.push("strong_motion_cooldown_unknown");
  if (isStrongMotion && input.recentStrongMotionHistory >= MOTION_POLICY_STRONG_REPEAT_LIMIT) {
    reasonCodes.push("strong_motion_repeat_fatigue");
  }
  if (input.seriousFocus && ["laugh_big", "surprise_scream", "happy_dance", "happy_loud_sing", "happy_humming"].includes(input.motionLabel)) {
    reasonCodes.push("serious_focus_playful_motion_downgrade_required");
  }

  if (reasonCodes.length) {
    return baseResult("downgrade", reasonCodes, null, fallbackFor(input, reasonCodes));
  }

  return baseResult("allow_policy_candidate", ["policy_candidate_only"], input.motionLabel);
}
