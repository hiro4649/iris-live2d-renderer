import assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";

let nowMs = 1_800_000_000_000;
const tmpDir = join(process.cwd(), ".tmp-live2d-renderer-contract");
await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });
const model3Path = join(tmpDir, "model3.json");
await writeFile(model3Path, JSON.stringify({ Version: 3, FileReferences: { Moc: "safe_model.moc3" } }));

try {
  const missing = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const health = await missing.getJson("/health");
  assert.equal(health.ok, true);
  assert.equal(health.renderer_process_alive, true);
  assert.equal(health.renderer_ready, false);
  assert.equal(health.model3_manifest_available, false);
  assertSafe(JSON.stringify(health));

  const statusBefore = await missing.getJson("/status");
  assert.equal(statusBefore.model_id, "iris_default");
  assert.equal(statusBefore.scene_id, "main_scene");
  assert.equal(statusBefore.renderer_ready, false);
  assert.equal(statusBefore.renderer_health.model3_manifest_available, false);
  assert.equal(statusBefore.last_cue_received_at, null);
  assert.equal(statusBefore.cue_capability.live2d_engine_request, true);
  assertSafe(JSON.stringify(statusBefore));

  const sdkMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: false,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sdkMissingHeartbeat.renderer_ready, false);
  assert.equal(sdkMissingHeartbeat.renderer_health.cubism_sdk_loaded, false);
  assertSafe(JSON.stringify(sdkMissingHeartbeat));

  const mismatchedHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    model_id: "other_model",
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(mismatchedHeartbeat.renderer_ready, false);
  assert.equal(mismatchedHeartbeat.renderer_health.model_matches, false);
  assertSafe(JSON.stringify(mismatchedHeartbeat));

  const staleHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs - 10_000,
  }));
  assert.equal(staleHeartbeat.renderer_ready, false);
  assert.equal(staleHeartbeat.renderer_health.fresh_heartbeat, false);
  assertSafe(JSON.stringify(staleHeartbeat));

  const engineResponse = await missing.postJson("/live2d-engine", {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_job",
    event_id: "contract_event",
    motion_style: "talk",
    timing: { total_duration_ms: 1200 },
    engine_preferences: { model_id: "iris_default", scene_id: "main_scene" },
  });
  assert.equal(engineResponse.accepted, true);
  assert.equal(engineResponse.queued_for_browser, true);
  assert.equal(engineResponse.renderer_ready, false);
  assert.equal(typeof engineResponse.cue_summary.status_hash, "string");
  assertSafe(JSON.stringify(engineResponse));

  const browserCueQueue = await missing.getJson("/renderer/cues");
  assert.equal(browserCueQueue.ok, true);
  assert.equal(browserCueQueue.cues.length, 1);
  assert.equal(browserCueQueue.cues[0].status_hash, engineResponse.cue_summary.status_hash);
  assert.equal(browserCueQueue.cues[0].motion_label, "talk");
  assertSafe(JSON.stringify(browserCueQueue));

  const cueResponse = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "idle_breath" },
      timing: { duration_ms: 900 },
      boundary_policy: {
        renderer_cue_only: true,
        no_text_payloads: true,
        no_candidates: true,
        no_commands: true,
        no_endpoint_values: true,
        no_secret_values: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(cueResponse.accepted, true);
  assert.equal(cueResponse.renderer_ready, false);
  assertSafe(JSON.stringify(cueResponse));

  const mockHealthHeartbeat = await missing.postJson("/renderer/heartbeat", {
    schema: "mock_health_v1",
    ok: true,
    heartbeat_timestamp_ms: nowMs,
  });
  assert.equal(mockHealthHeartbeat.renderer_ready, false);
  assert.equal(mockHealthHeartbeat.renderer_health.cue_capability_confirmed, false);
  assertSafe(JSON.stringify(mockHealthHeartbeat));

  const unsafe = await fetch(`${missing.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schema: "bad", endpoint: "https://secret.example/cue", token: "secret-token" }),
  });
  const unsafeBody = await unsafe.json();
  assert.equal(unsafe.status, 400);
  assert.equal(unsafeBody.ok, false);
  assertSafe(JSON.stringify(unsafeBody));

  const statusAfter = await missing.getJson("/status");
  assert.equal(statusAfter.renderer_ready, false);
  assert.equal(statusAfter.received_cue_count, 2);
  assert.notEqual(statusAfter.last_cue_received_at, null);
  assertSafe(JSON.stringify(statusAfter));

  await missing.close();

  const ready = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const readyStatusBeforeCue = await ready.getJson("/status");
  assert.equal(readyStatusBeforeCue.renderer_health.model3_manifest_available, true);
  assert.equal(readyStatusBeforeCue.renderer_ready, false);
  assertSafe(JSON.stringify(readyStatusBeforeCue));

  const acceptedReadyCue = await ready.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "nod" },
      timing: { duration_ms: 700 },
    },
  });
  assert.equal(acceptedReadyCue.accepted, true);
  assert.equal(acceptedReadyCue.renderer_ready, false);
  assertSafe(JSON.stringify(acceptedReadyCue));

  const readyHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(readyHeartbeat.renderer_ready, true);
  assertSafe(JSON.stringify(readyHeartbeat));

  const readyHealth = await ready.getJson("/health");
  assert.equal(readyHealth.renderer_ready, true);
  assertSafe(JSON.stringify(readyHealth));

  nowMs += 10_000;
  const staleReadyHealth = await ready.getJson("/health");
  assert.equal(staleReadyHealth.renderer_ready, false);
  assertSafe(JSON.stringify(staleReadyHealth));
  await ready.close();

  console.log(JSON.stringify({
    ok: true,
    checked: [
      "health",
      "status",
      "model_missing",
      "sdk_missing",
      "heartbeat_stale",
      "model_scene_mismatch",
      "cue_accepted",
      "browser_cue_route",
      "redaction",
      "mock_health_false",
      "model3_available",
      "cue_apply_ready_candidate",
    ],
  }));
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

function browserHeartbeat(overrides = {}) {
  return {
    schema: "iris_live2d_browser_heartbeat_v1",
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    cue_capability: {
      live2d_engine_request: true,
      renderer_cue_delivery: true,
      model_motion_update: true,
      recovery_cue_support: true,
    },
    last_applied_cue_status_hash: "not_yet_applied",
    last_cue_apply_status: "not_ready",
    heartbeat_timestamp_ms: nowMs,
    ...overrides,
  };
}

async function startHarness(state) {
  const server = createLive2dRendererServer({ state });
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  const baseUrl = `http://${address.address}:${address.port}`;
  return {
    baseUrl,
    async getJson(path) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.ok, true);
      return response.json();
    },
    async postJson(path, body) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      assert.equal(response.ok, true);
      return response.json();
    },
    close() {
      return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    },
  };
}

function assertSafe(serialized) {
  assert.equal(serialized.includes("https://secret.example"), false);
  assert.equal(serialized.includes("secret-token"), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("raw_renderer_payload"), false);
}
