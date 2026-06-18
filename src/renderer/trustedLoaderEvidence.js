import { safeText } from "../contracts.js";
import { validateSafeTraversal } from "./safeTraversal.js";

export const TRUSTED_LOADER_EVIDENCE_SCHEMA = "iris_live2d_trusted_loader_evidence_v1";
export const TRUSTED_LOADER_KINDS = Object.freeze([]);

const FUTURE_LOADER_KIND_CANDIDATES = new Set([
  "cubism_moc_create",
  "cubism_framework_model_loader_v1",
]);

const SAFE_EVIDENCE_FIELDS = new Set([
  "loader_kind",
  "loader_version",
  "model_load_session_id",
  "safe_manifest_status_hash",
  "safe_moc_asset_token_hash",
  "model_id",
  "scene_id",
  "loaded_at_ms",
  "fresh_heartbeat_timestamp_ms",
  "scene_binding_result",
  "cue_capability_result",
  "last_cue_applied_result",
  "server_trusted_policy_gate",
]);

const REQUIRED_EVIDENCE_FIELDS = [...SAFE_EVIDENCE_FIELDS];

const FORBIDDEN_EVIDENCE_FIELDS = new Set([
  "raw_model_path",
  "model_path",
  "internal_model_path",
  "raw_asset_path",
  "asset_path",
  "raw_manifest_body",
  "manifest_body",
  "raw_loader_error",
  "loader_error",
  "stack",
  "stack_trace",
  "endpoint",
  "renderer_endpoint",
  "url",
  "token",
  "secret",
  "authorization",
  "credential",
  "password",
  "api_key",
  "raw_cue_payload",
  "raw_payload",
  "raw_motion_command",
  "candidate",
  "command",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
]);

const FORBIDDEN_COMPACT_FIELDS = new Set(
  [...FORBIDDEN_EVIDENCE_FIELDS].map((field) => field.replace(/_/gu, ""))
);

const SAFE_STRING_FIELDS = new Set([
  "loader_kind",
  "loader_version",
  "model_load_session_id",
  "safe_manifest_status_hash",
  "safe_moc_asset_token_hash",
  "model_id",
  "scene_id",
  "scene_binding_result",
  "cue_capability_result",
  "last_cue_applied_result",
]);

const SAFE_NUMBER_FIELDS = new Set([
  "loaded_at_ms",
  "fresh_heartbeat_timestamp_ms",
]);

const UNSAFE_VALUE_PATTERNS = [
  /^[a-z][a-z0-9+.-]*:\/\//iu,
  /wss?:\/\//iu,
  /\b(?:authorization|bearer|oauth|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|token|secret|password)\b/iu,
  /^[a-z]:\\/iu,
  /(?:^|[\s"'`])\/(?:Users|home|mnt|var|etc|c\/Users)\//iu,
  /\.(?:model3\.json|motion3\.json|physics3\.json|pose3\.json|exp3\.json|cdi3\.json|moc3|png|jpe?g|webp)(?:$|[?#\s])/iu,
];

const TRUSTED_EVIDENCE_MAX_AGE_MS = 5_000;
const TRUSTED_EVIDENCE_FUTURE_SKEW_MS = 1_000;

export function validateTrustedLoaderEvidence(evidence, {
  nowMs = Date.now(),
  maxAgeMs = TRUSTED_EVIDENCE_MAX_AGE_MS,
  expectedModelId = "",
  expectedSceneId = "",
} = {}) {
  if (evidence === undefined || evidence === null) {
    return createValidationResult({
      status: "missing",
      errorKind: "trusted_loader_evidence_missing",
      evidencePresent: false,
    });
  }
  if (!isPlainObject(evidence)) {
    return createValidationResult({
      status: "invalid",
      errorKind: "trusted_loader_evidence_invalid",
    });
  }
  if (!validateSafeTraversal(evidence).ok) {
    return createValidationResult({
      status: "invalid",
      errorKind: "trusted_loader_evidence_invalid",
    });
  }
  if (containsUnsafeEvidenceMaterial(evidence)) {
    return createValidationResult({
      status: "invalid",
      errorKind: "trusted_loader_evidence_unsafe",
    });
  }
  for (const field of Object.keys(evidence)) {
    if (!SAFE_EVIDENCE_FIELDS.has(field)) {
      return createValidationResult({
        status: "invalid",
        errorKind: "trusted_loader_evidence_invalid",
      });
    }
  }
  for (const field of REQUIRED_EVIDENCE_FIELDS) {
    if (!(field in evidence)) {
      return createValidationResult({
        status: "missing",
        errorKind: "trusted_loader_evidence_missing",
      });
    }
  }
  if (!hasValidFieldTypes(evidence)) {
    return createValidationResult({
      status: "invalid",
      errorKind: "trusted_loader_evidence_invalid",
    });
  }

  const loaderKind = safeLoaderKind(evidence.loader_kind);
  const policyGate = evidence.server_trusted_policy_gate === true;
  if (!policyGate) {
    return createValidationResult({
      status: "missing",
      errorKind: "trusted_loader_policy_gate_missing",
      loaderKind,
      policyGate,
    });
  }
  if (isStaleEvidence(evidence, { nowMs, maxAgeMs })) {
    return createValidationResult({
      status: "stale",
      errorKind: "trusted_loader_evidence_stale",
      loaderKind,
      policyGate,
    });
  }
  if (expectedModelId && evidence.model_id !== expectedModelId) {
    return createValidationResult({
      status: "invalid",
      errorKind: "trusted_loader_evidence_invalid",
      loaderKind,
      policyGate,
    });
  }
  if (expectedSceneId && evidence.scene_id !== expectedSceneId) {
    return createValidationResult({
      status: "invalid",
      errorKind: "trusted_loader_evidence_invalid",
      loaderKind,
      policyGate,
    });
  }
  if (!TRUSTED_LOADER_KINDS.includes(loaderKind)) {
    return createValidationResult({
      status: FUTURE_LOADER_KIND_CANDIDATES.has(loaderKind) ? "future_only" : "untrusted",
      errorKind: FUTURE_LOADER_KIND_CANDIDATES.has(loaderKind)
        ? "trusted_loader_future_only"
        : "trusted_loader_kind_untrusted",
      loaderKind,
      policyGate,
    });
  }

  return createValidationResult({
    status: "accepted_diagnostic",
    errorKind: "trusted_loader_future_only",
    loaderKind,
    policyGate,
  });
}

export function createTrustedLoaderEvidenceSummary(validation) {
  const result = validation && typeof validation === "object" ? validation : validateTrustedLoaderEvidence(null);
  return {
    trusted_loader_evidence_status: safeTrustedStatus(result.status),
    trusted_loader_kind: safeText(result.loader_kind || "none", 80) || "none",
    trusted_loader_policy_gate: result.server_trusted_policy_gate === true,
    trusted_loader_ready_candidate: false,
    trusted_loader_error_kind: safeTrustedErrorKind(result.error_kind),
  };
}

export function isTrustedLoaderEvidenceCandidate(evidence) {
  if (!isPlainObject(evidence)) return false;
  if (containsUnsafeEvidenceMaterial(evidence)) return false;
  return Object.keys(evidence).some((field) => SAFE_EVIDENCE_FIELDS.has(field));
}

function createValidationResult({
  status,
  errorKind,
  loaderKind = "none",
  policyGate = false,
  evidencePresent = true,
}) {
  return {
    ok: false,
    evidence_present: evidencePresent,
    status: safeTrustedStatus(status),
    error_kind: safeTrustedErrorKind(errorKind),
    loader_kind: safeText(loaderKind, 80) || "none",
    server_trusted_policy_gate: policyGate === true,
    trusted_loader_ready_candidate: false,
  };
}

function containsUnsafeEvidenceMaterial(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return UNSAFE_VALUE_PATTERNS.some((pattern) => pattern.test(value));
  if (typeof value !== "object") return false;
  if (Array.isArray(value)) return true;
  for (const [field, child] of Object.entries(value)) {
    if (isForbiddenEvidenceField(field)) return true;
    if (containsUnsafeEvidenceMaterial(child)) return true;
  }
  return false;
}

function hasValidFieldTypes(evidence) {
  for (const [field, value] of Object.entries(evidence)) {
    if (SAFE_STRING_FIELDS.has(field) && !isSafeLabel(value)) return false;
    if (SAFE_NUMBER_FIELDS.has(field) && !Number.isFinite(Number(value))) return false;
    if (field === "server_trusted_policy_gate" && typeof value !== "boolean") return false;
  }
  return true;
}

function isSafeLabel(value) {
  if (typeof value !== "string") return false;
  const text = value.trim();
  return Boolean(text) && safeText(text, 160) === text;
}

function isStaleEvidence(evidence, { nowMs, maxAgeMs }) {
  const now = Number(nowMs);
  const maxAge = Number.isFinite(Number(maxAgeMs)) ? Number(maxAgeMs) : TRUSTED_EVIDENCE_MAX_AGE_MS;
  if (!Number.isFinite(now)) return true;
  return ["loaded_at_ms", "fresh_heartbeat_timestamp_ms"].some((field) => {
    const timestamp = Number(evidence[field]);
    if (!Number.isFinite(timestamp)) return true;
    if (timestamp > now + TRUSTED_EVIDENCE_FUTURE_SKEW_MS) return true;
    return now - timestamp > maxAge;
  });
}

function isForbiddenEvidenceField(field) {
  const lower = String(field ?? "").trim().toLowerCase();
  const snake = lower.replace(/[\s-]+/gu, "_");
  const compact = snake.replace(/_/gu, "");
  return FORBIDDEN_EVIDENCE_FIELDS.has(lower) ||
    FORBIDDEN_EVIDENCE_FIELDS.has(snake) ||
    FORBIDDEN_COMPACT_FIELDS.has(compact);
}

function safeLoaderKind(value) {
  return safeText(value, 80) || "none";
}

function safeTrustedStatus(status) {
  return [
    "not_configured",
    "missing",
    "untrusted",
    "invalid",
    "stale",
    "future_only",
    "accepted_diagnostic",
  ].includes(status)
    ? status
    : "invalid";
}

function safeTrustedErrorKind(errorKind) {
  return [
    "trusted_loader_evidence_missing",
    "trusted_loader_kind_untrusted",
    "trusted_loader_evidence_unsafe",
    "trusted_loader_evidence_invalid",
    "trusted_loader_evidence_stale",
    "trusted_loader_policy_gate_missing",
    "trusted_loader_future_only",
  ].includes(errorKind)
    ? errorKind
    : "trusted_loader_evidence_invalid";
}

function isPlainObject(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
