import assert from "node:assert/strict";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";

const state = createRendererState({ modelId: "iris_default", sceneId: "main_scene" });
const server = createLive2dRendererServer({ state });
const address = await listen(server, { host: "127.0.0.1", port: 0 });
const baseUrl = `http://${address.address}:${address.port}`;

try {
  const health = await getJson("/health");
  assert.equal(health.ok, true);
  assert.equal(health.renderer_process_alive, true);
  assert.equal(health.renderer_ready, false);
  assertSafe(JSON.stringify(health));

  const statusBefore = await getJson("/status");
  assert.equal(statusBefore.model_id, "iris_default");
  assert.equal(statusBefore.scene_id, "main_scene");
  assert.equal(statusBefore.renderer_ready, false);
  assert.equal(statusBefore.last_cue_received_at, null);
  assert.equal(statusBefore.cue_capability.live2d_engine_request, true);
  assertSafe(JSON.stringify(statusBefore));

  const engineResponse = await postJson("/live2d-engine", {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_job",
    event_id: "contract_event",
    motion_style: "talk",
    timing: { total_duration_ms: 1200 },
    engine_preferences: { model_id: "iris_default", scene_id: "main_scene" },
  });
  assert.equal(engineResponse.accepted, true);
  assert.equal(engineResponse.renderer_ready, false);
  assert.equal(typeof engineResponse.cue_summary.status_hash, "string");
  assertSafe(JSON.stringify(engineResponse));

  const cueResponse = await postJson("/cue", {
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

  const unsafe = await fetch(`${baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schema: "bad", endpoint: "https://secret.example/cue", token: "secret-token" }),
  });
  const unsafeBody = await unsafe.json();
  assert.equal(unsafe.status, 400);
  assert.equal(unsafeBody.ok, false);
  assertSafe(JSON.stringify(unsafeBody));

  const statusAfter = await getJson("/status");
  assert.equal(statusAfter.renderer_ready, false);
  assert.equal(statusAfter.received_cue_count, 2);
  assert.notEqual(statusAfter.last_cue_received_at, null);
  assertSafe(JSON.stringify(statusAfter));

  console.log(JSON.stringify({ ok: true, checked: ["health", "status", "live2d-engine", "cue", "redaction", "renderer_ready_false"] }));
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function getJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.ok, true);
  return response.json();
}

async function postJson(path, body) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  assert.equal(response.ok, true);
  return response.json();
}

function assertSafe(serialized) {
  assert.equal(serialized.includes("https://secret.example"), false);
  assert.equal(serialized.includes("secret-token"), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("raw_renderer_payload"), false);
}
