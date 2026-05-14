import { createHash } from "node:crypto";
import { assertSafeInput, assertSafePublicObject, createBoundaryPolicy, safeText } from "./contracts.js";
import { createBrowserCueEnvelope, createBrowserRuntimeConfig, createCubismRendererConfig } from "./renderer/cubismRenderer.js";
import { DEFAULT_HEARTBEAT_MAX_AGE_MS, createHeartbeatStatus } from "./renderer/heartbeat.js";

const MAX_BROWSER_CUE_QUEUE = 20;

export function createRendererState({
  modelId = "",
  sceneId = "",
  cubismCoreJsPath = "",
  model3JsonPath = "",
  heartbeatMaxAgeMs = DEFAULT_HEARTBEAT_MAX_AGE_MS,
  now = () => Date.now(),
} = {}) {
  const cubismConfig = createCubismRendererConfig({
    modelId,
    sceneId,
    cubismCoreJsPath,
    model3JsonPath,
    heartbeatMaxAgeMs,
  });
  const state = {
    modelId: cubismConfig.model_id,
    sceneId: cubismConfig.scene_id,
    cubismSdkConfigured: cubismConfig.cubism_sdk_configured,
    cubismSdkAvailable: cubismConfig.cubism_sdk_available,
    cubismSdkStatus: cubismConfig.cubism_sdk_status,
    cubismCoreJsPath: cubismConfig.cubism_core_js_path,
    model3ManifestConfigured: cubismConfig.model3_manifest_configured,
    model3ManifestAvailable: cubismConfig.model3_manifest_available,
    model3ManifestStatus: cubismConfig.model3_manifest_status,
    heartbeatMaxAgeMs,
    startedAtMs: now(),
    cueCount: 0,
    cueQueue: [],
    lastCueReceivedAt: null,
    lastCueSchema: "",
    lastCueHash: "",
    lastHeartbeat: null,
  };

  return {
    status() {
      const heartbeatStatus = getHeartbeatStatus(state, now());
      const status = {
        ok: true,
        schema: "iris_live2d_renderer_status_v1",
        service: "iris_live2d_renderer",
        model_id: state.modelId,
        scene_id: state.sceneId,
        cue_capability: {
          live2d_engine_request: true,
          renderer_cue_delivery: true,
          browser_polling_delivery: true,
          recovery_cue_support: heartbeatStatus.recovery_cue_support,
          real_capability_confirmed: heartbeatStatus.cue_capability_confirmed,
        },
        renderer_health: {
          process_alive: true,
          browser_heartbeat_seen: heartbeatStatus.heartbeat_present,
          cubism_sdk_configured: state.cubismSdkConfigured,
          cubism_sdk_available: state.cubismSdkAvailable,
          cubism_sdk_status: state.cubismSdkStatus,
          cubism_sdk_loaded: heartbeatStatus.cubism_runtime_loaded,
          model3_manifest_configured: state.model3ManifestConfigured,
          model3_manifest_available: state.model3ManifestAvailable,
          model3_manifest_status: state.model3ManifestStatus,
          model_loaded: heartbeatStatus.model_loaded,
          scene_loaded: heartbeatStatus.scene_loaded,
          fresh_heartbeat: heartbeatStatus.heartbeat_fresh,
          model_matches: heartbeatStatus.model_matches,
          scene_matches: heartbeatStatus.scene_matches,
          last_cue_applied: heartbeatStatus.last_cue_applied,
          last_cue_applied_at: heartbeatStatus.last_cue_applied_at,
        },
        renderer_ready: heartbeatStatus.renderer_ready_candidate,
        last_cue_received_at: state.lastCueReceivedAt,
        last_cue_status_hash: state.lastCueHash,
        received_cue_count: state.cueCount,
        browser_delivery: {
          pending_cue_count: state.cueQueue.length,
          last_delivery_status: state.lastCueHash ? "queued_for_browser" : "waiting_for_cue",
        },
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(status, "renderer status");
      return status;
    },

    health() {
      const status = this.status();
      const health = {
        ok: true,
        schema: "iris_live2d_renderer_health_v1",
        service: "iris_live2d_renderer",
        renderer_process_alive: true,
        renderer_ready: status.renderer_ready,
        model_id: status.model_id,
        scene_id: status.scene_id,
        model3_manifest_available: status.renderer_health.model3_manifest_available,
        cubism_sdk_available: status.renderer_health.cubism_sdk_available,
        cue_capability_confirmed: status.cue_capability.real_capability_confirmed,
        fresh_heartbeat: status.renderer_health.fresh_heartbeat,
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(health, "renderer health");
      return health;
    },

    acceptCue(payload, route) {
      assertSafeInput(payload, `${route} cue`);
      const cue = resolveCueObject(payload);
      const receivedAt = now();
      state.cueCount += 1;
      state.lastCueReceivedAt = receivedAt;
      state.lastCueSchema = safeText(cue?.schema ?? payload.schema, 160);
      state.lastCueHash = hashSafePayload(payload);
      state.cueQueue.push(createBrowserCueEnvelope({
        route,
        receivedAtMs: receivedAt,
        cueSchema: state.lastCueSchema,
        statusHash: state.lastCueHash,
        cue,
      }));
      if (state.cueQueue.length > MAX_BROWSER_CUE_QUEUE) state.cueQueue.shift();

      const response = {
        ok: true,
        schema: "iris_live2d_renderer_cue_acceptance_v1",
        route,
        accepted: true,
        queued_for_browser: true,
        renderer_ready: getHeartbeatStatus(state, now()).renderer_ready_candidate,
        model_id: state.modelId,
        scene_id: state.sceneId,
        last_cue_received_at: state.lastCueReceivedAt,
        cue_summary: {
          cue_schema: state.lastCueSchema,
          status_hash: state.lastCueHash,
        },
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(response, `${route} cue response`);
      return response;
    },

    readBrowserCues() {
      const cues = state.cueQueue.splice(0, state.cueQueue.length);
      const response = {
        ok: true,
        schema: "iris_live2d_browser_cue_queue_v1",
        cues,
        pending_cue_count: state.cueQueue.length,
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(response, "browser cue queue");
      return response;
    },

    browserRuntimeConfig() {
      const response = createBrowserRuntimeConfig({
        modelId: state.modelId,
        sceneId: state.sceneId,
        cubismSdkConfigured: state.cubismSdkConfigured,
        cubismSdkAvailable: state.cubismSdkAvailable,
        cubismSdkStatus: state.cubismSdkStatus,
        model3ManifestConfigured: state.model3ManifestConfigured,
        model3ManifestAvailable: state.model3ManifestAvailable,
        model3ManifestStatus: state.model3ManifestStatus,
      });
      assertSafePublicObject(response, "browser runtime config");
      return response;
    },

    cubismCoreJsPath() {
      return state.cubismSdkAvailable ? state.cubismCoreJsPath : "";
    },

    acceptBrowserHeartbeat(payload) {
      assertSafeInput(payload, "browser heartbeat");
      state.lastHeartbeat = payload;
      const heartbeatStatus = getHeartbeatStatus(state, now());
      const response = {
        ok: true,
        schema: "iris_live2d_browser_heartbeat_ack_v1",
        accepted: true,
        renderer_ready: heartbeatStatus.renderer_ready_candidate,
        renderer_health: {
          cubism_sdk_loaded: heartbeatStatus.cubism_runtime_loaded,
          cubism_sdk_available: heartbeatStatus.cubism_sdk_available,
          model_loaded: heartbeatStatus.model_loaded,
          scene_loaded: heartbeatStatus.scene_loaded,
          fresh_heartbeat: heartbeatStatus.heartbeat_fresh,
          model_matches: heartbeatStatus.model_matches,
          scene_matches: heartbeatStatus.scene_matches,
          cue_capability_confirmed: heartbeatStatus.cue_capability_confirmed,
          last_cue_applied: heartbeatStatus.last_cue_applied,
          last_cue_applied_at: heartbeatStatus.last_cue_applied_at,
        },
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(response, "browser heartbeat response");
      return response;
    },
  };
}

function getHeartbeatStatus(state, nowMs) {
  return createHeartbeatStatus({
    heartbeat: state.lastHeartbeat,
    nowMs,
    maxAgeMs: state.heartbeatMaxAgeMs,
    expectedModelId: state.modelId,
    expectedSceneId: state.sceneId,
    cubismSdkAvailable: state.cubismSdkAvailable,
    model3ManifestAvailable: state.model3ManifestAvailable,
    lastCueStatusHash: state.lastCueHash,
  });
}

function resolveCueObject(payload) {
  if (payload.cue && typeof payload.cue === "object" && !Array.isArray(payload.cue)) return payload.cue;
  if (payload.renderer_cue && typeof payload.renderer_cue === "object" && !Array.isArray(payload.renderer_cue)) return payload.renderer_cue;
  if (payload.live2d_cue && typeof payload.live2d_cue === "object" && !Array.isArray(payload.live2d_cue)) return payload.live2d_cue;
  return payload;
}

function hashSafePayload(payload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 24);
}
