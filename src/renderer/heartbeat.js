export const DEFAULT_HEARTBEAT_MAX_AGE_MS = 5_000;
const HEARTBEAT_FUTURE_SKEW_MS = 1_000;

export function createHeartbeatStatus({
  heartbeat,
  nowMs,
  maxAgeMs = DEFAULT_HEARTBEAT_MAX_AGE_MS,
  expectedModelId,
  expectedSceneId,
  cubismSdkAvailable,
  model3ManifestAvailable,
  realModelLoadSupported = false,
  lastDeliveredCueStatusHash = "",
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
  const cueCapabilityClaimed = Boolean(
    cueCapabilities.live2d_engine_request &&
      cueCapabilities.renderer_cue_delivery &&
      cueCapabilities.model_motion_update
  );
  const recoveryCueSupport = Boolean(cueCapabilities.recovery_cue_support);
  const cueAppliedAtMs = Number(heartbeat?.last_cue_applied_at_ms);
  const hasCueAppliedAt = Number.isFinite(cueAppliedAtMs) && cueAppliedAtMs <= nowMs + HEARTBEAT_FUTURE_SKEW_MS;
  const lastCueApplied = Boolean(
    lastDeliveredCueStatusHash &&
      heartbeat?.last_applied_cue_status_hash === lastDeliveredCueStatusHash &&
      heartbeat?.last_cue_apply_status === "applied" &&
      hasCueAppliedAt
  );
  const cubismRuntimeLoaded = heartbeat?.cubism_runtime_loaded === true;
  const modelLoadedClaimed = heartbeat?.model3_loaded === true || heartbeat?.model_loaded === true || heartbeat?.real_model_loaded === true;
  const sceneLoadedClaimed = heartbeat?.scene_loaded === true || heartbeat?.real_scene_loaded === true;
  const modelLoaded = Boolean(realModelLoadSupported && modelLoadedClaimed);
  const sceneLoaded = Boolean(realModelLoadSupported && sceneLoadedClaimed);
  const cueCapabilityConfirmed = Boolean(realModelLoadSupported && cueCapabilityClaimed);
  const browserCueDeliveryReady = Boolean(
    cubismSdkAvailable &&
      model3ManifestAvailable &&
      cubismRuntimeLoaded &&
      modelLoaded &&
      sceneLoaded &&
      modelMatches &&
      sceneMatches &&
      cueCapabilityConfirmed &&
      freshHeartbeat
  );
  const rendererReady = Boolean(
    browserCueDeliveryReady &&
      lastCueApplied
  );

  return {
    heartbeat_present: Boolean(heartbeat),
    heartbeat_fresh: freshHeartbeat,
    heartbeat_age_ms: ageMs,
    cubism_sdk_available: Boolean(cubismSdkAvailable),
    real_model_load_supported: Boolean(realModelLoadSupported),
    cubism_runtime_loaded: cubismRuntimeLoaded,
    model_loaded: modelLoaded,
    scene_loaded: sceneLoaded,
    model_loaded_claimed: modelLoadedClaimed,
    scene_loaded_claimed: sceneLoadedClaimed,
    model_matches: modelMatches,
    scene_matches: sceneMatches,
    browser_cue_delivery_ready: browserCueDeliveryReady,
    cue_capability_claimed: cueCapabilityClaimed,
    cue_capability_confirmed: cueCapabilityConfirmed,
    recovery_cue_support: recoveryCueSupport,
    last_cue_applied: lastCueApplied,
    last_cue_applied_at: lastCueApplied ? cueAppliedAtMs : null,
    renderer_ready_candidate: rendererReady,
  };
}
