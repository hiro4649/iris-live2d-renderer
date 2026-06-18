import { assertSafePublicObject } from "../contracts.js";

export const BROWSER_BOOTSTRAP_CONFIG_SCHEMA = "iris_live2d_browser_bootstrap_config_v1";
export const BROWSER_BOOTSTRAP_CONFIG_MAX_BYTES = 16_384;
export const BROWSER_BOOTSTRAP_REFRESH_MIN_INTERVAL_MS = 30_000;

export function buildBrowserBootstrapConfig(runtimeConfig, {
  heartbeatIntervalMs = 1_000,
  browserSmokeMode = false,
} = {}) {
  const config = {
    ok: true,
    schema: BROWSER_BOOTSTRAP_CONFIG_SCHEMA,
    model: {
      id: safeLabel(runtimeConfig?.model_id),
      configured: Boolean(runtimeConfig?.model3?.configured),
    },
    scene: {
      id: safeLabel(runtimeConfig?.scene_id),
      configured: Boolean(runtimeConfig?.scene_id),
    },
    cubismSdkStatus: safeLabel(runtimeConfig?.cubism_sdk?.status || "not_configured"),
    modelManifestStatus: safeLabel(runtimeConfig?.model3?.status || "not_configured"),
    modelAssetRouteAvailable: Boolean(runtimeConfig?.model3?.browser_load_supported),
    loaderSelectionStatus: safeLabel(runtimeConfig?.loader_selection?.status || "not_configured"),
    trustedLoaderAllowlistEnabled: false,
    realModelLoadSupported: false,
    cueDeliveryModes: ["polling", "sse"],
    heartbeatIntervalMs: boundedInterval(heartbeatIntervalMs),
    compactSafeSummary: compactSafeSummary(runtimeConfig?.live2d_safe_summary_v2),
    browserSmokeMode: browserSmokeMode === true,
    safeSummaryOnly: true,
  };
  assertSafePublicObject(config, "browser bootstrap config");
  return config;
}

export function assertBrowserBootstrapConfigSize(config) {
  const text = JSON.stringify(config);
  if (Buffer.byteLength(text, "utf8") > BROWSER_BOOTSTRAP_CONFIG_MAX_BYTES) {
    const error = new Error("browser bootstrap config too large");
    error.code = "browser_bootstrap_config_too_large";
    throw error;
  }
  return config;
}

function compactSafeSummary(summary = {}) {
  return {
    schema: "iris_live2d_browser_bootstrap_compact_safe_summary_v1",
    overallStatus: safeStatus(summary.overallStatus || "blocked"),
    priority1Status: summary.priority1Status === "BLOCKED" ? "BLOCKED" : "BLOCKED",
    checkedRowCount: 0,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    ownerConfirmationCreated: false,
    trustedLoaderAllowlistEnabled: false,
    actualIngestionAllowed: false,
    motionDatasetExecutable: false,
    safeSummaryOnly: true,
  };
}

function safeStatus(value) {
  return ["blocked", "attention_required", "candidate_only"].includes(value) ? value : "blocked";
}

function safeLabel(value) {
  const text = String(value ?? "").trim();
  return /^[a-zA-Z0-9_.:-]{0,96}$/u.test(text) ? text : "";
}

function boundedInterval(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 1_000;
  return Math.max(250, Math.min(30_000, Math.trunc(number)));
}
