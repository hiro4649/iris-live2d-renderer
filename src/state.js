import { createHash } from "node:crypto";
import { assertSafeInput, assertSafePublicObject, createBoundaryPolicy, safeText } from "./contracts.js";
import { createBrowserCueEnvelope, createBrowserRuntimeConfig, createCubismRendererConfig } from "./renderer/cubismRenderer.js";
import { validateRendererCueEnvelope } from "./renderer/cueValidation.js";
import { DEFAULT_HEARTBEAT_MAX_AGE_MS, createHeartbeatStatus } from "./renderer/heartbeat.js";
import { resolveSafeModelAsset } from "./renderer/modelAssets.js";

const MAX_BROWSER_CUE_QUEUE = 20;

export function createRendererState({
  modelId = "",
  sceneId = "",
  cubismCoreJsPath = "",
  model3JsonPath = "",
  heartbeatMaxAgeMs = DEFAULT_HEARTBEAT_MAX_AGE_MS,
  realModelLoadSupported = false,
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
    model3AssetRegistry: cubismConfig.model3_asset_registry,
    heartbeatMaxAgeMs,
    startedAtMs: now(),
    cueCount: 0,
    cueQueue: [],
    lastCueReceivedAt: null,
    lastCueSchema: "",
    lastCueHash: "",
    lastCueDeliveredHash: "",
    lastCueDeliveredAt: null,
    lastHeartbeat: null,
    realModelLoadSupported: realModelLoadSupported === true,
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
          browser_event_stream_delivery: true,
          recovery_cue_support: heartbeatStatus.recovery_cue_support,
          claimed_capability: heartbeatStatus.cue_capability_claimed,
          real_capability_confirmed: heartbeatStatus.cue_capability_confirmed,
        },
        renderer_health: {
          process_alive: true,
          browser_heartbeat_seen: heartbeatStatus.heartbeat_present,
          cubism_sdk_configured: state.cubismSdkConfigured,
          cubism_sdk_available: state.cubismSdkAvailable,
          cubism_sdk_status: state.cubismSdkStatus,
          cubism_sdk_loaded: heartbeatStatus.cubism_runtime_loaded,
          real_model_load_supported: heartbeatStatus.real_model_load_supported,
          model_asset_route_available: heartbeatStatus.model_asset_route_available,
          model_load_status: heartbeatStatus.model_load_status,
          model_load_supported: heartbeatStatus.model_load_supported,
          model_load_attempted: heartbeatStatus.model_load_attempted,
          model_load_succeeded: heartbeatStatus.model_load_succeeded,
          model_load_error_kind: heartbeatStatus.model_load_error_kind,
          trusted_loader_evidence_status: heartbeatStatus.trusted_loader_evidence_status,
          trusted_loader_kind: heartbeatStatus.trusted_loader_kind,
          trusted_loader_policy_gate: heartbeatStatus.trusted_loader_policy_gate,
          trusted_loader_ready_candidate: heartbeatStatus.trusted_loader_ready_candidate,
          trusted_loader_error_kind: heartbeatStatus.trusted_loader_error_kind,
          model3_manifest_configured: state.model3ManifestConfigured,
          model3_manifest_available: state.model3ManifestAvailable,
          model3_manifest_status: state.model3ManifestStatus,
          model_loaded: heartbeatStatus.model_loaded,
          scene_loaded: heartbeatStatus.scene_loaded,
          model_loaded_claimed: heartbeatStatus.model_loaded_claimed,
          scene_loaded_claimed: heartbeatStatus.scene_loaded_claimed,
          real_model_loaded_claimed: heartbeatStatus.real_model_loaded_claimed,
          real_scene_loaded_claimed: heartbeatStatus.real_scene_loaded_claimed,
          fresh_heartbeat: heartbeatStatus.heartbeat_fresh,
          model_matches: heartbeatStatus.model_matches,
          scene_matches: heartbeatStatus.scene_matches,
          browser_cue_delivery_ready: heartbeatStatus.browser_cue_delivery_ready,
          last_cue_applied: heartbeatStatus.last_cue_applied,
          last_cue_applied_at: heartbeatStatus.last_cue_applied_at,
        },
        renderer_ready: heartbeatStatus.renderer_ready_candidate,
        last_cue_received_at: state.lastCueReceivedAt,
        last_cue_status_hash: state.lastCueHash,
        received_cue_count: state.cueCount,
        browser_delivery: {
          pending_cue_count: state.cueQueue.length,
          last_delivery_status: browserDeliveryStatus(state, heartbeatStatus),
          last_delivered_at: state.lastCueDeliveredAt,
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
        real_model_load_supported: status.renderer_health.real_model_load_supported,
        model_asset_route_available: status.renderer_health.model_asset_route_available,
        model_load_status: status.renderer_health.model_load_status,
        model_load_supported: status.renderer_health.model_load_supported,
        model_load_succeeded: status.renderer_health.model_load_succeeded,
        model_load_error_kind: status.renderer_health.model_load_error_kind,
        trusted_loader_evidence_status: status.renderer_health.trusted_loader_evidence_status,
        trusted_loader_kind: status.renderer_health.trusted_loader_kind,
        trusted_loader_policy_gate: status.renderer_health.trusted_loader_policy_gate,
        trusted_loader_ready_candidate: status.renderer_health.trusted_loader_ready_candidate,
        trusted_loader_error_kind: status.renderer_health.trusted_loader_error_kind,
        cue_capability_confirmed: status.cue_capability.real_capability_confirmed,
        fresh_heartbeat: status.renderer_health.fresh_heartbeat,
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(health, "renderer health");
      return health;
    },

    acceptCue(payload, route) {
      const validation = validateRendererCueEnvelope(payload);
      const cue = validation.browserCue;
      const receivedAt = now();
      state.cueCount += 1;
      state.lastCueReceivedAt = receivedAt;
      state.lastCueSchema = safeText(validation.cueSchema, 160);
      state.lastCueHash = hashSafePayload(cue);
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
      const heartbeatStatus = getHeartbeatStatus(state, now());
      const cues = heartbeatStatus.browser_cue_delivery_ready
        ? state.cueQueue.splice(0, state.cueQueue.length)
        : [];
      if (cues.length > 0) {
        state.lastCueDeliveredHash = cues[cues.length - 1].status_hash;
        state.lastCueDeliveredAt = now();
      }
      const response = {
        ok: true,
        schema: "iris_live2d_browser_cue_queue_v1",
        cues,
        pending_cue_count: state.cueQueue.length,
        delivery_ready: heartbeatStatus.browser_cue_delivery_ready,
        delivery_status: browserDeliveryStatus(state, heartbeatStatus),
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
        model3BrowserLoadSupported: state.model3AssetRegistry?.available === true,
      });
      assertSafePublicObject(response, "browser runtime config");
      return response;
    },

    browserModel3Manifest() {
      if (!state.model3AssetRegistry?.available) return null;
      const response = {
        ok: true,
        schema: "iris_live2d_safe_model3_manifest_response_v1",
        load_route: "renderer_model3_manifest",
        asset_route: "renderer_model_asset",
        manifest: state.model3AssetRegistry.sanitizedManifest,
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(response, "browser model3 manifest");
      return response;
    },

    resolveModelAsset(assetId) {
      return resolveSafeModelAsset(state.model3AssetRegistry, assetId);
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
          real_model_load_supported: heartbeatStatus.real_model_load_supported,
          model_asset_route_available: heartbeatStatus.model_asset_route_available,
          model_load_status: heartbeatStatus.model_load_status,
          model_load_supported: heartbeatStatus.model_load_supported,
          model_load_attempted: heartbeatStatus.model_load_attempted,
          model_load_succeeded: heartbeatStatus.model_load_succeeded,
          model_load_error_kind: heartbeatStatus.model_load_error_kind,
          trusted_loader_evidence_status: heartbeatStatus.trusted_loader_evidence_status,
          trusted_loader_kind: heartbeatStatus.trusted_loader_kind,
          trusted_loader_policy_gate: heartbeatStatus.trusted_loader_policy_gate,
          trusted_loader_ready_candidate: heartbeatStatus.trusted_loader_ready_candidate,
          trusted_loader_error_kind: heartbeatStatus.trusted_loader_error_kind,
          model_loaded: heartbeatStatus.model_loaded,
          scene_loaded: heartbeatStatus.scene_loaded,
          model_loaded_claimed: heartbeatStatus.model_loaded_claimed,
          scene_loaded_claimed: heartbeatStatus.scene_loaded_claimed,
          real_model_loaded_claimed: heartbeatStatus.real_model_loaded_claimed,
          real_scene_loaded_claimed: heartbeatStatus.real_scene_loaded_claimed,
          fresh_heartbeat: heartbeatStatus.heartbeat_fresh,
          model_matches: heartbeatStatus.model_matches,
          scene_matches: heartbeatStatus.scene_matches,
          browser_cue_delivery_ready: heartbeatStatus.browser_cue_delivery_ready,
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
    realModelLoadSupported: state.realModelLoadSupported,
    lastDeliveredCueStatusHash: state.lastCueDeliveredHash,
  });
}

function browserDeliveryStatus(state, heartbeatStatus) {
  if (!state.lastCueHash) return "waiting_for_cue";
  if (state.cueQueue.length === 0) {
    return state.lastCueDeliveredHash ? "delivered_to_browser" : "waiting_for_cue";
  }
  return heartbeatStatus.browser_cue_delivery_ready ? "ready_for_browser_delivery" : "waiting_for_browser_ready";
}

function hashSafePayload(payload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 24);
}
