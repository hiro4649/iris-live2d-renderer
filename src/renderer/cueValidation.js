import { ContractError, safeText } from "../contracts.js";

const RENDERER_CUE_DELIVERY_SCHEMA = "iris_live2d_renderer_cue_delivery_v1";
const RENDERER_CUE_SCHEMA = "iris_live2d_renderer_cue_v1";
const LOCAL_ENGINE_REQUEST_SCHEMA = "iris_local_live2d_engine_request_v1";

const ALLOWED_MOTION_STYLES = new Set([
  "talk",
  "focused_talk",
  "laugh_big",
  "idle_breath",
  "surprise_scream",
  "happy_humming",
  "happy_dance",
  "happy_loud_sing",
]);

const STRONG_MOTION_STYLES = new Set([
  "laugh_big",
  "surprise_scream",
  "happy_dance",
  "happy_loud_sing",
]);

const RECOVERY_PLAN_TYPES = new Set([
  "gaze_return",
  "breath_recover",
  "neutral_reset",
  "visibility_restore",
]);

const RECOVERY_CUE_STYLES = new Set([
  "idle_breath",
  "gaze_return",
  "neutral_breath",
]);

const DANGEROUS_FIELD_KEYS = new Set([
  "world_command",
  "input_action",
  "input_action_candidate",
  "approved_game_input_action",
  "execute",
  "command",
  "raw_command",
  "raw_motion_command",
  "raw_renderer_payload",
  "raw_payload",
  "raw_cue",
  "payload",
  "endpoint",
  "renderer_endpoint",
  "url",
  "token",
  "secret",
  "authorization",
  "credential",
  "credentials",
  "password",
  "api_key",
  "apikey",
  "model_path",
  "modelpath",
  "internal_model_path",
  "internalmodelpath",
  "motion_path",
  "motionpath",
  "raw_motion_path",
  "rawmotionpath",
  "candidate",
  "memory_candidate",
  "relationship_update_candidate",
  "community_memory_candidate",
  "commit",
  "write",
  "memory_write",
  "direct_memory_write",
  "approved_memory_record",
  "approved_relationship_record",
  "obs_command",
  "game_input",
  "os_command",
]);
const DANGEROUS_FIELD_COMPACT_KEYS = new Set(
  [...DANGEROUS_FIELD_KEYS].map((field) => field.replace(/_/gu, ""))
);

const CUE_FIELDS = new Set([
  "schema",
  "cue_id",
  "model",
  "motion",
  "expression",
  "gaze",
  "breath",
  "body",
  "camera",
  "autonomous",
  "timing",
  "boundary_policy",
  "adapter_validation_required",
  "recovery_required",
  "recovery_plan",
  "recovery_cue",
]);

const WRAPPER_FIELDS = new Set([
  "schema",
  "cue",
  "renderer_cue",
  "live2d_cue",
  "boundary_policy",
  "adapter_validation_required",
]);

const MODEL_FIELDS = new Set([
  "model_configured",
  "scene_configured",
  "model_id",
  "scene_id",
  "id",
]);

const MOTION_FIELDS = new Set([
  "style",
  "intensity",
  "blend_ms",
  "track_count",
  "body_motion_hint",
  "gesture_hint",
  "recovery_required",
]);

const EXPRESSION_FIELDS = new Set([
  "profile_id",
  "expression_key",
  "blink_rate",
  "gaze_hint",
  "name",
]);

const BODY_FIELDS = new Set([
  "state_id",
  "autonomous_state_id",
  "breathing_rate",
  "shoulder_motion",
  "recovery_hint",
]);

const CAMERA_FIELDS = new Set([
  "proximity_profile",
  "scale",
  "offset_x",
  "offset_y",
  "face_priority",
  "comfort_guard",
  "recovery_hint",
]);

const AUTONOMOUS_FIELDS = new Set([
  "state",
  "scream_reaction_enabled",
  "happy_motion_enabled",
  "vocalise_motion_enabled",
  "safety_guard",
]);

const TIMING_FIELDS = new Set([
  "duration_ms",
  "total_duration_ms",
  "start_delay_ms",
  "sync_policy",
]);

const RECOVERY_PLAN_FIELDS = new Set(["type"]);
const RECOVERY_CUE_FIELDS = new Set(["style"]);
const GAZE_FIELDS = new Set(["target", "hint", "gaze_hint", "intensity"]);
const BREATH_FIELDS = new Set(["state", "rate", "breathing_rate", "intensity"]);

const LOCAL_ENGINE_FIELDS = new Set([
  "schema",
  "job_id",
  "event_id",
  "motion_style",
  "motionStyle",
  "motion_key",
  "motionKey",
  "gesture",
  "motion_intensity",
  "motionIntensity",
  "intensity",
  "body_state_id",
  "bodyStateId",
  "body_state",
  "bodyState",
  "camera_proximity_profile",
  "cameraProximityProfile",
  "camera_profile",
  "cameraProfile",
  "camera_face_priority",
  "cameraFacePriority",
  "camera_scale",
  "cameraScale",
  "expression_profile_id",
  "expressionProfileId",
  "expression_id",
  "expressionId",
  "facial_expression",
  "facialExpression",
  "autonomous_state_id",
  "autonomousStateId",
  "state_id",
  "stateId",
  "timing",
  "tracks",
  "engine_preferences",
  "boundary_policy",
  "adapter_validation_required",
  "recovery_required",
  "recovery_plan",
  "recovery_cue",
  "recovery_hint",
  "body_recovery_hint",
  "bodyRecoveryHint",
  "camera_recovery_hint",
  "cameraRecoveryHint",
]);

const ENGINE_PREFERENCES_FIELDS = new Set(["model_id", "scene_id"]);
const TRACK_FIELDS = new Set([
  "kind",
  "start_ms",
  "end_ms",
  "motion_style",
  "head_motion",
  "body_sway",
  "gesture_hint",
  "expression_hint",
  "gaze_hint",
  "blink_rate",
  "breathing_rate",
]);

const UNSAFE_VALUE_PATTERNS = [
  /https?:\/\//iu,
  /wss?:\/\//iu,
  /\b(?:authorization|bearer|oauth|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|token|secret|password)\b/iu,
  /^[a-z]:\\/iu,
  /(?:^|[\s"'`])\/(?:Users|home|mnt|var|etc|c\/Users)\//iu,
  /\.(?:model3\.json|motion3\.json|moc3)(?:$|[?#\s])/iu,
];

export function validateRendererCueEnvelope(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw createSafeCueValidationError("invalid_cue_contract");
  }
  scanUnsafeCueMaterial(payload);

  const schema = safeString(payload.schema);
  if (schema === LOCAL_ENGINE_REQUEST_SCHEMA) {
    validateLocalEngineRequest(payload);
    const normalizedCue = normalizeRendererCueForBrowser(payload);
    return {
      cue: payload,
      cueSchema: schema,
      browserCue: normalizedCue,
    };
  }

  const cue = extractCue(payload);
  if (cue !== payload) {
    if (schema !== RENDERER_CUE_DELIVERY_SCHEMA) {
      throw createSafeCueValidationError("unsupported_cue");
    }
    assertAllowedFields(payload, WRAPPER_FIELDS);
    validateBoundaryPolicy(payload.boundary_policy);
    validateAdapterValidationRequired(payload.adapter_validation_required);
  }

  validateRendererCue(cue);
  const normalizedCue = normalizeRendererCueForBrowser(cue);
  return {
    cue,
    cueSchema: safeString(cue.schema) || schema,
    browserCue: normalizedCue,
  };
}

export function createSafeCueValidationError(errorKind, safeFieldLabel = "") {
  const safeKinds = new Set([
    "unsupported_cue",
    "unsafe_cue_field",
    "unsafe_cue_value",
    "unknown_motion_style",
    "recovery_required",
    "invalid_cue_contract",
  ]);
  const kind = safeKinds.has(errorKind) ? errorKind : "invalid_cue_contract";
  const error = new ContractError("renderer cue rejected", kind);
  error.safeFieldLabel = safeText(safeFieldLabel, 80);
  return error;
}

export function normalizeRendererCueForBrowser(cue) {
  const motionStyle = resolveMotionStyle(cue);
  const expressionLabel = safeText(
    cue?.expression?.expression_key ??
      cue?.expression?.profile_id ??
      cue?.expression?.name ??
      cue?.expression_name ??
      "",
    120
  );
  return {
    schema: safeString(cue?.schema) || RENDERER_CUE_SCHEMA,
    cue_id: safeText(cue?.cue_id ?? cue?.job_id ?? "", 120),
    motion: motionStyle ? { style: motionStyle } : {},
    expression: expressionLabel ? { name: expressionLabel } : {},
    timing: {
      duration_ms: normalizeDuration(
        cue?.timing?.duration_ms ??
          cue?.timing?.total_duration_ms ??
          cue?.duration_ms
      ),
    },
  };
}

export function isStrongMotionCue(cue) {
  const motionStyle = resolveMotionStyle(cue);
  if (STRONG_MOTION_STYLES.has(motionStyle)) return true;

  const camera = cue?.camera ?? {};
  if (camera.face_priority === true || cue?.camera_face_priority === true || cue?.cameraFacePriority === true) {
    return true;
  }
  const proximity = safeString(
    camera.proximity_profile ??
      cue?.camera_proximity_profile ??
      cue?.cameraProximityProfile ??
      cue?.camera_profile ??
      cue?.cameraProfile ??
      ""
  ).toLowerCase();
  if (["close", "near", "face", "extreme"].some((part) => proximity.includes(part))) {
    return true;
  }
  const scale = Number(camera.scale ?? cue?.camera_scale ?? cue?.cameraScale);
  if (Number.isFinite(scale) && scale > 1.05) return true;

  const autonomous = cue?.autonomous ?? {};
  if (autonomous.scream_reaction_enabled === true) return true;
  if (autonomous.happy_motion_enabled === true && isHighIntensity(cue?.motion?.intensity)) {
    return true;
  }

  return false;
}

function validateRendererCue(cue) {
  if (!cue || typeof cue !== "object" || Array.isArray(cue)) {
    throw createSafeCueValidationError("invalid_cue_contract");
  }
  if (safeString(cue.schema) !== RENDERER_CUE_SCHEMA) {
    throw createSafeCueValidationError("unsupported_cue");
  }
  assertAllowedFields(cue, CUE_FIELDS);
  validateOptionalObject(cue.model, MODEL_FIELDS);
  validateMotion(cue.motion);
  validateOptionalObject(cue.expression, EXPRESSION_FIELDS);
  validateOptionalObject(cue.body, BODY_FIELDS);
  validateOptionalObject(cue.camera, CAMERA_FIELDS);
  validateOptionalObject(cue.autonomous, AUTONOMOUS_FIELDS);
  validateOptionalObject(cue.timing, TIMING_FIELDS);
  validateOptionalObject(cue.gaze, GAZE_FIELDS);
  validateOptionalObject(cue.breath, BREATH_FIELDS);
  validateBoundaryPolicy(cue.boundary_policy);
  validateAdapterValidationRequired(cue.adapter_validation_required);
  validateRecoveryPlan(cue.recovery_plan);
  validateRecoveryCue(cue.recovery_cue);
  if (isStrongMotionCue(cue) && !hasRecoveryEvidence(cue)) {
    throw createSafeCueValidationError("recovery_required");
  }
}

function validateLocalEngineRequest(request) {
  assertAllowedFields(request, LOCAL_ENGINE_FIELDS);
  validateOptionalObject(request.timing, TIMING_FIELDS);
  validateOptionalObject(request.engine_preferences, ENGINE_PREFERENCES_FIELDS);
  validateRecoveryPlan(request.recovery_plan);
  validateRecoveryCue(request.recovery_cue);
  validateBoundaryPolicy(request.boundary_policy);
  validateAdapterValidationRequired(request.adapter_validation_required);
  const motionStyle = resolveMotionStyle(request);
  if (motionStyle && !ALLOWED_MOTION_STYLES.has(motionStyle)) {
    throw createSafeCueValidationError("unknown_motion_style");
  }
  if (Array.isArray(request.tracks)) {
    for (const track of request.tracks) validateOptionalObject(track, TRACK_FIELDS);
  } else if (request.tracks !== undefined) {
    throw createSafeCueValidationError("invalid_cue_contract");
  }
  if (isStrongMotionCue(request) && !hasRecoveryEvidence(request)) {
    throw createSafeCueValidationError("recovery_required");
  }
}

function validateMotion(motion) {
  validateOptionalObject(motion, MOTION_FIELDS);
  const style = resolveMotionStyle({ motion });
  if (style && !ALLOWED_MOTION_STYLES.has(style)) {
    throw createSafeCueValidationError("unknown_motion_style");
  }
}

function validateRecoveryPlan(plan) {
  if (plan === undefined) return;
  validateOptionalObject(plan, RECOVERY_PLAN_FIELDS);
  if (!RECOVERY_PLAN_TYPES.has(safeString(plan.type))) {
    throw createSafeCueValidationError("invalid_cue_contract");
  }
}

function validateRecoveryCue(cue) {
  if (cue === undefined) return;
  validateOptionalObject(cue, RECOVERY_CUE_FIELDS);
  if (!RECOVERY_CUE_STYLES.has(safeString(cue.style))) {
    throw createSafeCueValidationError("invalid_cue_contract");
  }
}

function hasRecoveryEvidence(cue) {
  if (cue?.recovery_required === true) return true;
  if (RECOVERY_PLAN_TYPES.has(safeString(cue?.recovery_plan?.type))) return true;
  if (RECOVERY_CUE_STYLES.has(safeString(cue?.recovery_cue?.style))) return true;
  if (cue?.motion?.recovery_required === true) return true;
  if (safeString(cue?.body?.recovery_hint)) return true;
  if (safeString(cue?.camera?.recovery_hint)) return true;
  if (safeString(cue?.recovery_hint)) return true;
  if (safeString(cue?.body_recovery_hint ?? cue?.bodyRecoveryHint)) return true;
  if (safeString(cue?.camera_recovery_hint ?? cue?.cameraRecoveryHint)) return true;
  return safeString(cue?.body?.shoulder_motion).toLowerCase().includes("recover");
}

function extractCue(payload) {
  if (isPlainObject(payload.cue)) return payload.cue;
  if (isPlainObject(payload.renderer_cue)) return payload.renderer_cue;
  if (isPlainObject(payload.live2d_cue)) return payload.live2d_cue;
  return payload;
}

function scanUnsafeCueMaterial(value) {
  if (value === null || value === undefined) return;
  if (typeof value === "string") {
    if (UNSAFE_VALUE_PATTERNS.some((pattern) => pattern.test(value))) {
      throw createSafeCueValidationError("unsafe_cue_value");
    }
    return;
  }
  if (typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach(scanUnsafeCueMaterial);
    return;
  }
  for (const [field, child] of Object.entries(value)) {
    if (isDangerousField(field)) {
      throw createSafeCueValidationError("unsafe_cue_field", field);
    }
    scanUnsafeCueMaterial(child);
  }
}

function isDangerousField(field) {
  const text = String(field ?? "").trim();
  const lower = text.toLowerCase();
  const snake = lower.replace(/[\s-]+/gu, "_");
  const compact = snake.replace(/_/gu, "");
  return DANGEROUS_FIELD_KEYS.has(lower) ||
    DANGEROUS_FIELD_KEYS.has(snake) ||
    DANGEROUS_FIELD_COMPACT_KEYS.has(compact);
}

function validateOptionalObject(value, allowedFields) {
  if (value === undefined) return;
  if (!isPlainObject(value)) throw createSafeCueValidationError("invalid_cue_contract");
  assertAllowedFields(value, allowedFields);
}

function assertAllowedFields(value, allowedFields) {
  if (!isPlainObject(value)) throw createSafeCueValidationError("invalid_cue_contract");
  for (const field of Object.keys(value)) {
    if (!allowedFields.has(field)) {
      throw createSafeCueValidationError("invalid_cue_contract", field);
    }
  }
}

function validateBoundaryPolicy(policy) {
  if (policy === undefined) return;
  if (!isPlainObject(policy)) throw createSafeCueValidationError("invalid_cue_contract");
  for (const [field, value] of Object.entries(policy)) {
    if (!isSafeBoundaryPolicyField(field)) {
      throw createSafeCueValidationError("invalid_cue_contract", field);
    }
    if (!["boolean", "string", "number"].includes(typeof value)) {
      throw createSafeCueValidationError("invalid_cue_contract", field);
    }
  }
}

function validateAdapterValidationRequired(value) {
  if (value !== undefined && typeof value !== "boolean") {
    throw createSafeCueValidationError("invalid_cue_contract");
  }
}

function isSafeBoundaryPolicyField(field) {
  return field === "renderer_cue_only" ||
    field === "validated_local_bridge_job" ||
    field === "engine_internal_payload" ||
    field.startsWith("no_") ||
    field.endsWith("_only") ||
    field.endsWith("_required") ||
    field.endsWith("_summary");
}

function resolveMotionStyle(cue) {
  return safeString(
    cue?.motion?.style ??
      cue?.motion_style ??
      cue?.motionStyle ??
      cue?.motion_key ??
      cue?.motionKey ??
      cue?.gesture ??
      ""
  );
}

function isHighIntensity(value) {
  return ["high", "burst"].includes(safeString(value).toLowerCase());
}

function normalizeDuration(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.min(Math.round(number), 60_000);
}

function safeString(value) {
  return safeText(value, 160);
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
