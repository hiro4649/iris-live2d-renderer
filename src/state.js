import { createHash } from "node:crypto";
import { assertSafeInput, assertSafePublicObject, createBoundaryPolicy, safeText } from "./contracts.js";

export function createRendererState({ modelId = "", sceneId = "", now = () => Date.now() } = {}) {
  const state = {
    modelId: safeText(modelId, 160),
    sceneId: safeText(sceneId, 160),
    startedAtMs: now(),
    cueCount: 0,
    lastCueReceivedAt: null,
    lastCueSchema: "",
    lastCueHash: "",
    realRenderer: {
      modelLoaded: false,
      sceneLoaded: false,
      cueCapabilityConfirmed: false,
      recoveryCueSupport: false,
      heartbeatFresh: false,
    },
  };

  return {
    status() {
      const rendererReady = isRendererReady(state);
      const status = {
        ok: true,
        schema: "iris_live2d_renderer_status_v1",
        service: "iris_live2d_renderer",
        model_id: state.modelId,
        scene_id: state.sceneId,
        cue_capability: {
          live2d_engine_request: true,
          renderer_cue_delivery: true,
          recovery_cue_support: state.realRenderer.recoveryCueSupport,
          real_capability_confirmed: state.realRenderer.cueCapabilityConfirmed,
        },
        renderer_health: {
          process_alive: true,
          model_loaded: state.realRenderer.modelLoaded,
          scene_loaded: state.realRenderer.sceneLoaded,
          fresh_heartbeat: state.realRenderer.heartbeatFresh,
        },
        renderer_ready: rendererReady,
        last_cue_received_at: state.lastCueReceivedAt,
        last_cue_status_hash: state.lastCueHash,
        received_cue_count: state.cueCount,
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
      const response = {
        ok: true,
        schema: "iris_live2d_renderer_cue_acceptance_v1",
        route,
        accepted: true,
        renderer_ready: isRendererReady(state),
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
  };
}

function isRendererReady(state) {
  return Boolean(
    state.realRenderer.modelLoaded &&
      state.realRenderer.sceneLoaded &&
      state.realRenderer.cueCapabilityConfirmed &&
      state.realRenderer.heartbeatFresh
  );
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
