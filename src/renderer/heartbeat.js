export const DEFAULT_HEARTBEAT_MAX_AGE_MS = 5_000;
const HEARTBEAT_FUTURE_SKEW_MS = 1_000;

export function createHeartbeatStatus({
  heartbeat,
  nowMs,
  maxAgeMs = DEFAULT_HEARTBEAT_MAX_AGE_MS,
  expectedModelId,
  expectedSceneId,
  model3ManifestAvailable,
  lastCueStatusHash,
} = {}) {
  const timestampMs = Number(heartbeat?.heartbeat_timestamp_ms);
  const hasTimestamp = Number.isFinite(timestampMs);
  const ageMs = hasTimestamp ? nowMs - timestampMs : null;
  const freshHeartbeat = Boolean(
    hasTimestamp &&
      timestampMs <= nowMs + HEARTBEAT_FUTURE_SKEW_MS &&
      ageMs !== null &&
      ageMs >= 0 &&
      ageMs <= maxAgeMs
  );
  const modelMatches = heartbeat?.model_id === expectedModelId;
  const sceneMatches = heartbeat?.scene_id === expectedSceneId;
  const cueCapabilities = heartbeat?.cue_capability ?? heartbeat?.cue_capabilities ?? {};
  const cueCapabilityConfirmed = Boolean(
    cueCapabilities.live2d_engine_request &&
      cueCapabilities.renderer_cue_delivery &&
      cueCapabilities.model_motion_update
  );
  const recoveryCueSupport = Boolean(cueCapabilities.recovery_cue_support);
  const lastCueApplied = Boolean(
    lastCueStatusHash &&
      heartbeat?.last_applied_cue_status_hash === lastCueStatusHash &&
      heartbeat?.last_cue_apply_status === "applied"
  );
  const cubismRuntimeLoaded = heartbeat?.cubism_runtime_loaded === true;
  const modelLoaded = heartbeat?.model3_loaded === true || heartbeat?.model_loaded === true;
  const sceneLoaded = heartbeat?.scene_loaded === true;
  const rendererReady = Boolean(
    model3ManifestAvailable &&
      cubismRuntimeLoaded &&
      modelLoaded &&
      sceneLoaded &&
      modelMatches &&
      sceneMatches &&
      cueCapabilityConfirmed &&
      freshHeartbeat &&
      lastCueApplied
  );

  return {
    heartbeat_present: Boolean(heartbeat),
    heartbeat_fresh: freshHeartbeat,
    heartbeat_age_ms: ageMs,
    cubism_runtime_loaded: cubismRuntimeLoaded,
    model_loaded: modelLoaded,
    scene_loaded: sceneLoaded,
    model_matches: modelMatches,
    scene_matches: sceneMatches,
    cue_capability_confirmed: cueCapabilityConfirmed,
    recovery_cue_support: recoveryCueSupport,
    last_cue_applied: lastCueApplied,
    renderer_ready_candidate: rendererReady,
  };
}
