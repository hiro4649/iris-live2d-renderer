import { existsSync, readFileSync } from "node:fs";
import { safeText } from "../contracts.js";

export function createCubismRendererConfig({
  modelId = "",
  sceneId = "",
  model3JsonPath = "",
  heartbeatMaxAgeMs,
} = {}) {
  const manifest = inspectModel3Manifest(model3JsonPath);
  return {
    model_id: safeText(modelId, 160),
    scene_id: safeText(sceneId, 160),
    model3_manifest_configured: Boolean(model3JsonPath),
    model3_manifest_available: manifest.available,
    model3_manifest_status: manifest.status,
    heartbeat_max_age_ms: Number.isFinite(heartbeatMaxAgeMs) ? heartbeatMaxAgeMs : undefined,
  };
}

export function createBrowserCueEnvelope({ route, receivedAtMs, cueSchema, statusHash, cue }) {
  return {
    schema: "iris_live2d_browser_cue_delivery_v1",
    route,
    received_at_ms: receivedAtMs,
    cue_schema: safeText(cueSchema, 160),
    status_hash: statusHash,
    motion_label: safeText(cue?.motion?.style ?? cue?.motion_style ?? ""),
    expression_label: safeText(cue?.expression?.name ?? cue?.expression_name ?? ""),
    duration_ms: normalizeDuration(cue?.timing?.duration_ms ?? cue?.timing?.total_duration_ms ?? cue?.duration_ms),
  };
}

function inspectModel3Manifest(model3JsonPath) {
  if (!model3JsonPath) return { available: false, status: "not_configured" };
  if (!existsSync(model3JsonPath)) return { available: false, status: "missing" };
  try {
    const parsed = JSON.parse(readFileSync(model3JsonPath, "utf8"));
    const valid = Boolean(parsed && typeof parsed === "object" && (parsed.Version || parsed.FileReferences));
    return { available: valid, status: valid ? "available" : "invalid" };
  } catch {
    return { available: false, status: "invalid" };
  }
}

function normalizeDuration(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.min(Math.round(number), 60_000);
}
