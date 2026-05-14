export class ContractError extends Error {
  constructor(message, code = "contract_error") {
    super(message);
    this.name = "ContractError";
    this.code = code;
  }
}

const UNSAFE_FIELD_PATTERN = /(?:^|_)(raw|payload|endpoint|url|token|secret|authorization|credential|credentials|password|command|path|model_path|motion_path)(?:$|_)/iu;
const UNSAFE_VALUE_PATTERN = /(?:https?:\/\/|authorization|bearer|api[_ -]?key|oauth|access[_ -]?token|refresh[_ -]?token|token|secret|password|endpoint|raw[_ -]?(?:payload|command|cue)|[a-z]:\\|\/[^\s]+\/)/iu;

export function safeText(value, maxLength = 160) {
  const text = String(value ?? "").trim();
  if (!text || UNSAFE_VALUE_PATTERN.test(text)) return "";
  return text.slice(0, maxLength).replace(/[^a-zA-Z0-9_.:-]/gu, "_");
}

export function assertSafeInput(value, context = "request") {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ContractError(`${context}: object body required`, "invalid_json");
  }
  assertNoUnsafeMaterial(value, context);
}

export function assertSafePublicObject(value, context = "public response") {
  assertNoUnsafeMaterial(value, context);
}

export function createBoundaryPolicy() {
  return {
    safe_summary_only: true,
    no_secret_values: true,
    no_endpoint_values: true,
    no_raw_cue_body: true,
    no_commands: true,
    renderer_ready_requires_real_model_scene_capability_heartbeat: true,
  };
}

export function createSafeError(error, status = 500) {
  const code = error instanceof ContractError ? error.code : "renderer_error";
  const safeCode = ["invalid_json", "unsafe_payload", "contract_error", "not_found", "renderer_error"].includes(code)
    ? code
    : "renderer_error";
  const response = {
    ok: false,
    error_kind: safeCode,
    status,
    boundary_policy: createBoundaryPolicy(),
  };
  assertSafePublicObject(response, "error response");
  return response;
}

function isSafePolicyFlag(key, path) {
  return path.endsWith("boundary_policy") && (key.startsWith("no_") || key.endsWith("_only") || key.endsWith("_required") || key.endsWith("_summary"));
}

function assertNoUnsafeMaterial(value, context, path = "root") {
  if (value === null || value === undefined) return;
  if (typeof value === "string") {
    if (UNSAFE_VALUE_PATTERN.test(value)) {
      throw new ContractError(`${context}: unsafe value`, "unsafe_payload");
    }
    return;
  }
  if (typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoUnsafeMaterial(item, context, `${path}.${index}`));
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (UNSAFE_FIELD_PATTERN.test(key) && !isSafePolicyFlag(key, path)) {
      throw new ContractError(`${context}: unsafe field`, "unsafe_payload");
    }
    assertNoUnsafeMaterial(child, context, `${path}.${key}`);
  }
}

