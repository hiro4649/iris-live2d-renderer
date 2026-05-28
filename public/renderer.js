const HEARTBEAT_INTERVAL_MS = 1_000;
const RENDERER_EVENTS_ROUTE = "/renderer/events";
const MAX_PENDING_BROWSER_CUES = 20;
const MODEL_LOAD_STATUS = new Set([
  "not_configured",
  "asset_route_available",
  "runtime_missing",
  "loader_missing",
  "loading",
  "loaded",
  "failed",
]);
const MODEL_LOAD_ERROR_KIND = new Set([
  "not_configured",
  "asset_route_unavailable",
  "runtime_missing",
  "loader_missing",
  "load_failed",
  "invalid_manifest",
  "unsupported_runtime",
  "unknown",
]);

export function createInitialRendererState() {
  return {
    modelId: "",
    sceneId: "",
    cubismRuntimeLoaded: false,
    model3Loaded: false,
    sceneLoaded: false,
    realModelLoadSupported: false,
    lastAppliedCueStatusHash: "",
    lastCueAppliedAt: null,
    lastCueApplyStatus: "not_ready",
    model3ManifestAvailable: false,
    model3BrowserLoadSupported: false,
    modelAssetRouteAvailable: false,
    modelLoadAttempted: false,
    modelLoadStatus: "not_configured",
    modelLoadErrorKind: "not_configured",
    modelLoadSupported: false,
    modelLoadSucceeded: false,
    modelRuntime: null,
    cubismRuntimeLoadAttempted: false,
    eventStreamActive: false,
    eventStreamConnected: false,
    eventStreamFailed: false,
    pendingCues: [],
  };
}

const rendererState = createInitialRendererState();

if (typeof document !== "undefined") {
  startRendererLoop();
}

async function startRendererLoop() {
  await refreshStatus();
  startCueEventStream(rendererState);
  await pollCueQueue();
  await postHeartbeat();
  setInterval(refreshStatus, HEARTBEAT_INTERVAL_MS * 3);
  setInterval(pollCueQueue, HEARTBEAT_INTERVAL_MS);
  setInterval(postHeartbeat, HEARTBEAT_INTERVAL_MS);
}

async function refreshStatus() {
  const config = await getJson("/renderer/runtime-config");
  rendererState.modelId = config.model_id || "";
  rendererState.sceneId = config.scene_id || "";
  applyRuntimeConfig(rendererState, config, await ensureCubismRuntimeLoaded(config));
  await updateModelLoadEvidence(rendererState, config);
  flushPendingCues(rendererState);
  updateStatusText(rendererState);
}

export function applyRuntimeConfig(state, config, cubismRuntimeLoaded = state.cubismRuntimeLoaded) {
  state.modelId = config?.model_id || state.modelId || "";
  state.sceneId = config?.scene_id || state.sceneId || "";
  state.cubismRuntimeLoaded = Boolean(cubismRuntimeLoaded);
  state.model3ManifestAvailable = Boolean(config?.model3?.manifest_available ?? config?.model3?.available);
  state.model3BrowserLoadSupported = Boolean(config?.model3?.browser_load_supported);
  state.modelAssetRouteAvailable = state.model3BrowserLoadSupported;
  state.realModelLoadSupported = false;
  state.model3Loaded = false;
  state.sceneLoaded = false;
  return state;
}

export async function updateModelLoadEvidence(
  state,
  config,
  {
    fetchImpl = globalThis.fetch,
    runtimeRoot = globalThis,
  } = {}
) {
  state.modelAssetRouteAvailable = Boolean(config?.model3?.browser_load_supported);

  if (!state.modelAssetRouteAvailable) {
    clearModelLoadSuccess(state);
    setModelLoadStatus(state, "not_configured", "asset_route_unavailable");
    return state;
  }
  if (!state.cubismRuntimeLoaded) {
    clearModelLoadSuccess(state);
    setModelLoadStatus(state, "runtime_missing", "runtime_missing");
    return state;
  }

  const loader = detectCubismModelLoader(runtimeRoot);
  if (!loader) {
    clearModelLoadSuccess(state);
    setModelLoadStatus(state, "loader_missing", "loader_missing");
    return state;
  }
  if (state.modelLoadStatus === "loaded" && state.modelRuntime) {
    state.realModelLoadSupported = true;
    state.modelLoadSupported = true;
    state.modelLoadSucceeded = true;
    state.model3Loaded = true;
    state.sceneLoaded = true;
    return state;
  }
  if (state.modelLoadAttempted && state.modelLoadStatus === "failed") {
    clearModelLoadSuccess(state);
    return state;
  }

  state.modelLoadAttempted = true;
  clearModelLoadSuccess(state);
  setModelLoadStatus(state, "loading", "unknown");
  const result = await tryLoadCubismModel({ fetchImpl, loader });
  if (result.ok) {
    state.modelRuntime = result.runtime;
    state.realModelLoadSupported = true;
    state.modelLoadSupported = true;
    state.modelLoadSucceeded = true;
    state.model3Loaded = true;
    state.sceneLoaded = true;
    setModelLoadStatus(state, "loaded", "unknown");
    return state;
  }
  clearModelLoadSuccess(state);
  setModelLoadStatus(state, "failed", result.error_kind || "load_failed");
  return state;
}

export function detectCubismModelLoader(runtimeRoot = globalThis) {
  const framework =
    runtimeRoot?.Live2DCubismFramework?.Live2DCubismFramework ??
    runtimeRoot?.Live2DCubismFramework ??
    runtimeRoot?.CubismFramework ??
    {};
  const cubismMoc = framework.CubismMoc ?? runtimeRoot?.CubismMoc;
  if (cubismMoc && typeof cubismMoc.create === "function") {
    return {
      kind: "cubism_moc_create",
      create: cubismMoc.create.bind(cubismMoc),
    };
  }
  return null;
}

async function tryLoadCubismModel({ fetchImpl, loader }) {
  if (typeof fetchImpl !== "function") return { ok: false, error_kind: "unsupported_runtime" };
  const manifestResponse = await safeFetchJson(fetchImpl, "/renderer/model3");
  if (!manifestResponse.ok) return { ok: false, error_kind: "invalid_manifest" };
  const mocToken = manifestResponse.body?.manifest?.FileReferences?.Moc;
  const mocRoute = assetRouteForToken(mocToken);
  if (!mocRoute) return { ok: false, error_kind: "invalid_manifest" };
  try {
    const response = await fetchImpl(mocRoute, { cache: "no-store" });
    if (!response?.ok || typeof response.arrayBuffer !== "function") {
      return { ok: false, error_kind: "load_failed" };
    }
    const mocBuffer = await response.arrayBuffer();
    const moc = loader.create(mocBuffer);
    if (!moc || typeof moc.createModel !== "function") {
      return { ok: false, error_kind: "unsupported_runtime" };
    }
    const model = moc.createModel();
    if (!model) return { ok: false, error_kind: "load_failed" };
    return { ok: true, runtime: { moc, model } };
  } catch {
    return { ok: false, error_kind: "load_failed" };
  }
}

async function safeFetchJson(fetchImpl, path) {
  try {
    const response = await fetchImpl(path, { cache: "no-store" });
    if (!response?.ok || typeof response.json !== "function") return { ok: false, body: null };
    const body = await response.json();
    return { ok: true, body };
  } catch {
    return { ok: false, body: null };
  }
}

function assetRouteForToken(token) {
  const text = String(token ?? "");
  const prefix = "renderer_model_asset:";
  if (!text.startsWith(prefix)) return "";
  const assetId = text.slice(prefix.length);
  if (!/^asset_[a-f0-9]{16}_[a-z0-9]+$/u.test(assetId)) return "";
  return `/renderer/model-asset/${assetId}`;
}

function setModelLoadStatus(state, status, errorKind) {
  state.modelLoadStatus = MODEL_LOAD_STATUS.has(status) ? status : "failed";
  state.modelLoadErrorKind = MODEL_LOAD_ERROR_KIND.has(errorKind) ? errorKind : "unknown";
}

function clearModelLoadSuccess(state) {
  state.realModelLoadSupported = false;
  state.modelLoadSupported = false;
  state.modelLoadSucceeded = false;
  state.model3Loaded = false;
  state.sceneLoaded = false;
  state.modelRuntime = null;
}

async function ensureCubismRuntimeLoaded(config) {
  if (globalThis.Live2DCubismCore) return true;
  if (!config.cubism_sdk?.available || rendererState.cubismRuntimeLoadAttempted) return false;
  rendererState.cubismRuntimeLoadAttempted = true;
  await loadScript("/renderer/cubism-core.js");
  return Boolean(globalThis.Live2DCubismCore);
}

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function pollCueQueue() {
  if (rendererState.eventStreamActive || rendererState.eventStreamConnected) return;
  const result = await getJson("/renderer/cues");
  enqueueBrowserCues(rendererState, result.cues || []);
  flushPendingCues(rendererState);
  updateStatusText(rendererState);
}

export function startCueEventStream(state = rendererState, EventSourceCtor = globalThis.EventSource) {
  if (!EventSourceCtor || state.eventStreamActive || state.eventStreamConnected) return false;
  let source;
  try {
    source = new EventSourceCtor(RENDERER_EVENTS_ROUTE);
  } catch {
    state.eventStreamFailed = true;
    return false;
  }
  if (!source || typeof source.addEventListener !== "function") {
    state.eventStreamFailed = true;
    source?.close?.();
    return false;
  }
  state.eventStreamActive = true;
  state.eventStreamFailed = false;
  source.addEventListener("open", () => {
    state.eventStreamConnected = true;
    state.eventStreamFailed = false;
    updateStatusText(state);
  });
  source.addEventListener("renderer_cues", (event) => {
    handleCueEventMessage(state, event);
  });
  source.addEventListener("error", () => {
    state.eventStreamActive = false;
    state.eventStreamConnected = false;
    state.eventStreamFailed = true;
    source.close();
    updateStatusText(state);
  });
  return true;
}

export function handleCueEventMessage(state, event) {
  const payload = parseEventJson(event?.data);
  enqueueBrowserCues(state, payload.cues || []);
  const result = flushPendingCues(state);
  updateStatusText(state);
  return result;
}

export function enqueueBrowserCues(state, cues) {
  let queued = 0;
  for (const cue of Array.isArray(cues) ? cues : []) {
    if (!cue || typeof cue !== "object" || Array.isArray(cue)) continue;
    state.pendingCues.push(cue);
    queued += 1;
    if (state.pendingCues.length > MAX_PENDING_BROWSER_CUES) state.pendingCues.shift();
  }
  if (queued > 0 && !isReadyForCueApply(state)) state.lastCueApplyStatus = "queued_until_ready";
  return queued;
}

export function flushPendingCues(state, now = Date.now) {
  if (!isReadyForCueApply(state)) {
    state.lastCueApplyStatus = state.pendingCues.length > 0 ? "queued_until_ready" : "not_ready";
    return { applied_count: 0, pending_cue_count: state.pendingCues.length };
  }
  let applied = 0;
  while (state.pendingCues.length > 0) {
    const cue = state.pendingCues.shift();
    state.lastAppliedCueStatusHash = cue.status_hash || "";
    state.lastCueAppliedAt = now();
    state.lastCueApplyStatus = "applied";
    applied += 1;
  }
  return { applied_count: applied, pending_cue_count: state.pendingCues.length };
}

export function isReadyForCueApply(state) {
  return Boolean(state.cubismRuntimeLoaded && state.model3Loaded && state.sceneLoaded);
}

async function postHeartbeat() {
  try {
    await fetch("/renderer/heartbeat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(createHeartbeatPayload(rendererState)),
    });
  } catch {
    rendererState.lastCueApplyStatus = rendererState.pendingCues.length > 0 ? "queued_until_ready" : "heartbeat_failed";
  }
}

export function createHeartbeatPayload(state, nowMs = Date.now()) {
  const readyForCueApply = isReadyForCueApply(state);
  return {
    schema: "iris_live2d_browser_heartbeat_v1",
    model_id: state.modelId,
    scene_id: state.sceneId,
    cubism_runtime_loaded: state.cubismRuntimeLoaded,
    model_asset_route_available: state.modelAssetRouteAvailable,
    model_load_status: state.modelLoadStatus,
    model_load_supported: state.modelLoadSupported,
    model_load_attempted: state.modelLoadAttempted,
    model_load_succeeded: state.modelLoadSucceeded,
    model_load_error_kind: state.modelLoadErrorKind,
    model3_loaded: state.model3Loaded,
    model_loaded: state.model3Loaded,
    real_model_load_supported: state.realModelLoadSupported,
    real_model_loaded: state.realModelLoadSupported && state.model3Loaded,
    scene_loaded: state.sceneLoaded,
    real_scene_loaded: state.realModelLoadSupported && state.sceneLoaded,
    cue_capability: {
      live2d_engine_request: true,
      renderer_cue_delivery: true,
      model_motion_update: readyForCueApply,
      recovery_cue_support: true,
    },
    last_applied_cue_status_hash: state.lastAppliedCueStatusHash,
    last_cue_applied_at_ms: state.lastCueAppliedAt,
    last_cue_apply_status: state.lastCueApplyStatus,
    heartbeat_timestamp_ms: nowMs,
  };
}

async function getJson(path) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) return {};
    return response.json();
  } catch {
    return {};
  }
}

function updateStatusText(state) {
  if (typeof document === "undefined") return;
  const status = document.querySelector(".status");
  if (!status) return;
  status.textContent = browserStatusText(state);
}

function parseEventJson(data) {
  if (typeof data !== "string") return {};
  try {
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function browserStatusText(state) {
  if (state.pendingCues.length > 0 && !isReadyForCueApply(state)) {
    return "Live2D renderer preserving cue until real model load";
  }
  if (!state.cubismRuntimeLoaded) return "Live2D renderer waiting for Cubism runtime";
  if (state.modelLoadStatus === "loader_missing") return "Live2D renderer waiting for model loader";
  if (state.modelLoadStatus === "loading") return "Live2D renderer loading model";
  if (state.modelLoadStatus === "failed") return "Live2D renderer waiting for valid model load";
  if (!state.model3Loaded || !state.sceneLoaded) return "Live2D renderer waiting for real model load";
  return "Live2D renderer ready to apply cues";
}
