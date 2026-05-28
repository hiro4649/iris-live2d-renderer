import { existsSync } from "node:fs";
import { safeText } from "../contracts.js";
import { createSafeModelAssetRegistry } from "./modelAssets.js";

export function createCubismRendererConfig({
  modelId = "",
  sceneId = "",
  cubismCoreJsPath = "",
  model3JsonPath = "",
  heartbeatMaxAgeMs,
} = {}) {
  const sdk = inspectLocalFile(cubismCoreJsPath);
  const manifest = createSafeModelAssetRegistry(model3JsonPath);
  return {
    model_id: safeText(modelId, 160),
    scene_id: safeText(sceneId, 160),
    cubism_sdk_configured: Boolean(cubismCoreJsPath),
    cubism_sdk_available: sdk.available,
    cubism_sdk_status: sdk.status,
    cubism_core_js_path: cubismCoreJsPath,
    model3_manifest_configured: Boolean(model3JsonPath),
    model3_manifest_available: manifest.available,
    model3_manifest_status: manifest.status,
    model3_asset_registry: manifest,
    heartbeat_max_age_ms: Number.isFinite(heartbeatMaxAgeMs) ? heartbeatMaxAgeMs : undefined,
  };
}

export function createBrowserRuntimeConfig({
  modelId,
  sceneId,
  cubismSdkConfigured,
  cubismSdkAvailable,
  cubismSdkStatus,
  model3ManifestConfigured,
  model3ManifestAvailable,
  model3ManifestStatus,
  model3BrowserLoadSupported = false,
}) {
  const browserLoadSupported = Boolean(model3BrowserLoadSupported);
  const config = {
    ok: true,
    schema: "iris_live2d_browser_runtime_config_v1",
    model_id: safeText(modelId, 160),
    scene_id: safeText(sceneId, 160),
    cubism_sdk: {
      configured: Boolean(cubismSdkConfigured),
      available: Boolean(cubismSdkAvailable),
      status: safeText(cubismSdkStatus, 80),
      script_route: cubismSdkAvailable ? "renderer_cubism_core_script" : "not_available",
    },
    model3: {
      configured: Boolean(model3ManifestConfigured),
      available: Boolean(model3ManifestAvailable),
      manifest_available: Boolean(model3ManifestAvailable),
      status: safeText(model3ManifestStatus, 80),
      load_route: browserLoadSupported ? "renderer_model3_manifest" : "not_available",
      asset_route: browserLoadSupported ? "renderer_model_asset" : "not_available",
      browser_load_supported: browserLoadSupported,
      real_model_loaded: false,
    },
    cue_capability_required: [
      "live2d_engine_request",
      "renderer_cue_delivery",
      "model_motion_update",
    ],
  };
  return config;
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

function inspectLocalFile(path) {
  if (!path) return { available: false, status: "not_configured" };
  if (!existsSync(path)) return { available: false, status: "missing" };
  return { available: true, status: "available" };
}

function normalizeDuration(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.min(Math.round(number), 60_000);
}
