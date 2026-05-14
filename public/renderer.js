const HEARTBEAT_INTERVAL_MS = 1_000;

const rendererState = {
  modelId: "",
  sceneId: "",
  cubismRuntimeLoaded: false,
  model3Loaded: false,
  sceneLoaded: false,
  lastAppliedCueStatusHash: "",
  lastCueApplyStatus: "not_ready",
};

startRendererLoop();

async function startRendererLoop() {
  await refreshStatus();
  await pollCueQueue();
  await postHeartbeat();
  setInterval(refreshStatus, HEARTBEAT_INTERVAL_MS * 3);
  setInterval(pollCueQueue, HEARTBEAT_INTERVAL_MS);
  setInterval(postHeartbeat, HEARTBEAT_INTERVAL_MS);
}

async function refreshStatus() {
  const status = await getJson("/status");
  rendererState.modelId = status.model_id || "";
  rendererState.sceneId = status.scene_id || "";
  rendererState.cubismRuntimeLoaded = Boolean(globalThis.Live2DCubismCore);
  rendererState.model3Loaded = false;
  rendererState.sceneLoaded = false;
}

async function pollCueQueue() {
  const result = await getJson("/renderer/cues");
  for (const cue of result.cues || []) {
    applyCue(cue);
  }
}

function applyCue(cue) {
  if (!rendererState.cubismRuntimeLoaded || !rendererState.model3Loaded || !rendererState.sceneLoaded) {
    rendererState.lastCueApplyStatus = "not_ready";
    return;
  }
  rendererState.lastAppliedCueStatusHash = cue.status_hash || "";
  rendererState.lastCueApplyStatus = "applied";
}

async function postHeartbeat() {
  await fetch("/renderer/heartbeat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      schema: "iris_live2d_browser_heartbeat_v1",
      model_id: rendererState.modelId,
      scene_id: rendererState.sceneId,
      cubism_runtime_loaded: rendererState.cubismRuntimeLoaded,
      model3_loaded: rendererState.model3Loaded,
      scene_loaded: rendererState.sceneLoaded,
      cue_capability: {
        live2d_engine_request: true,
        renderer_cue_delivery: true,
        model_motion_update: rendererState.cubismRuntimeLoaded,
        recovery_cue_support: rendererState.cubismRuntimeLoaded,
      },
      last_applied_cue_status_hash: rendererState.lastAppliedCueStatusHash,
      last_cue_apply_status: rendererState.lastCueApplyStatus,
      heartbeat_timestamp_ms: Date.now(),
    }),
  });
}

async function getJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) return {};
  return response.json();
}
