const HEARTBEAT_INTERVAL_MS = 1_000;
const MAX_PENDING_BROWSER_CUES = 20;

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
    cubismRuntimeLoadAttempted: false,
    pendingCues: [],
  };
}

const rendererState = createInitialRendererState();

if (typeof document !== "undefined") {
  startRendererLoop();
}

async function startRendererLoop() {
  await refreshStatus();
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
  flushPendingCues(rendererState);
  updateStatusText(rendererState);
}

export function applyRuntimeConfig(state, config, cubismRuntimeLoaded = state.cubismRuntimeLoaded) {
  state.modelId = config?.model_id || state.modelId || "";
  state.sceneId = config?.scene_id || state.sceneId || "";
  state.cubismRuntimeLoaded = Boolean(cubismRuntimeLoaded);
  state.model3ManifestAvailable = Boolean(config?.model3?.manifest_available ?? config?.model3?.available);
  state.realModelLoadSupported = Boolean(config?.model3?.browser_load_supported);
  state.model3Loaded = false;
  state.sceneLoaded = false;
  return state;
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
  const result = await getJson("/renderer/cues");
  enqueueBrowserCues(rendererState, result.cues || []);
  flushPendingCues(rendererState);
  updateStatusText(rendererState);
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
    model3_loaded: state.model3Loaded,
    model_loaded: state.model3Loaded,
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
  const status = document.querySelector(".status");
  if (!status) return;
  status.textContent = browserStatusText(state);
}

export function browserStatusText(state) {
  if (state.pendingCues.length > 0 && !isReadyForCueApply(state)) {
    return "Live2D renderer preserving cue until real model load";
  }
  if (!state.cubismRuntimeLoaded) return "Live2D renderer waiting for Cubism runtime";
  if (!state.model3Loaded || !state.sceneLoaded) return "Live2D renderer waiting for real model load";
  return "Live2D renderer ready to apply cues";
}
