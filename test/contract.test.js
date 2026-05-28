import assert from "node:assert/strict";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";
import {
  applyRuntimeConfig,
  browserStatusText,
  createHeartbeatPayload,
  createInitialRendererState,
  enqueueBrowserCues,
  flushPendingCues,
} from "../public/renderer.js";

let nowMs = 1_800_000_000_000;
const tmpDir = join(process.cwd(), ".tmp-live2d-renderer-contract");
await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });
const model3Path = join(tmpDir, "model3.json");
const sdkCorePath = join(tmpDir, "live2dcubismcore.js");
await writeFile(model3Path, JSON.stringify({ Version: 3, FileReferences: { Moc: "safe_model.moc3" } }));
await writeFile(sdkCorePath, "globalThis.Live2DCubismCore = { Version: 'contract' };\n");

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

  const missingRuntimeConfig = await missing.getJson("/renderer/runtime-config");
  assert.equal(missingRuntimeConfig.cubism_sdk.available, false);
  assert.equal(missingRuntimeConfig.model3.available, false);
  assertSafe(JSON.stringify(missingRuntimeConfig));

  const browserState = createInitialRendererState();
  applyRuntimeConfig(browserState, {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: false },
  }, true);
  assert.equal(browserState.model3ManifestAvailable, true);
  assert.equal(browserState.model3Loaded, false);
  assert.equal(browserState.sceneLoaded, false);
  assert.equal(enqueueBrowserCues(browserState, [{ status_hash: "browser_pending_hash" }]), 1);
  const pendingFlush = flushPendingCues(browserState, () => nowMs);
  assert.equal(pendingFlush.applied_count, 0);
  assert.equal(pendingFlush.pending_cue_count, 1);
  assert.equal(browserState.lastCueApplyStatus, "queued_until_ready");
  assert.equal(browserStatusText(browserState), "Live2D renderer preserving cue until real model load");
  const browserHeartbeatPayload = createHeartbeatPayload(browserState, nowMs);
  assert.equal(browserHeartbeatPayload.model3_loaded, false);
  assert.equal(browserHeartbeatPayload.scene_loaded, false);
  assert.equal(browserHeartbeatPayload.cue_capability.model_motion_update, false);
  browserState.realModelLoadSupported = true;
  browserState.model3Loaded = true;
  browserState.sceneLoaded = true;
  const appliedFlush = flushPendingCues(browserState, () => nowMs);
  assert.equal(appliedFlush.applied_count, 1);
  assert.equal(appliedFlush.pending_cue_count, 0);
  assert.equal(browserState.lastAppliedCueStatusHash, "browser_pending_hash");

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
  assert.equal(browserCueQueue.delivery_ready, false);
  assert.equal(browserCueQueue.cues.length, 0);
  assert.equal(browserCueQueue.pending_cue_count, 1);
  assert.equal(browserCueQueue.delivery_status, "waiting_for_browser_ready");
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

  const irisBridgeCue = createIrisBridgeCueFixture();
  const irisBridgeCueResponse = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: irisBridgeCue,
    boundary_policy: {
      no_text_payloads: true,
      no_candidates: true,
      no_commands: true,
      no_endpoint_values: true,
      no_secret_values: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(irisBridgeCueResponse.accepted, true);
  assert.equal(irisBridgeCueResponse.renderer_ready, false);
  assertSafe(JSON.stringify(irisBridgeCueResponse));

  const strongWithRecovery = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "laugh_big", intensity: "high" },
      recovery_plan: { type: "breath_recover" },
      boundary_policy: {
        renderer_cue_only: true,
        no_candidates: true,
        no_commands: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(strongWithRecovery.accepted, true);
  assertSafe(JSON.stringify(strongWithRecovery));

  const cameraCloseupWithRecovery = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      camera: {
        proximity_profile: "close_face",
        scale: 1.1,
        face_priority: true,
        comfort_guard: "bounded_viewer_closeup",
        recovery_hint: "visibility_restore",
      },
      boundary_policy: {
        renderer_cue_only: true,
        no_candidates: true,
        no_commands: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(cameraCloseupWithRecovery.accepted, true);
  assertSafe(JSON.stringify(cameraCloseupWithRecovery));

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

  await assertCueRejected(missing, {
    schema: "unsupported_live2d_cue_v1",
    cue: { schema: "iris_live2d_renderer_cue_v1", motion: { style: "talk" } },
  }, "unsupported_cue", "unsupported_live2d_cue_v1");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: { schema: "iris_live2d_renderer_cue_v1", motion: { style: "spin_attack" } },
  }, "unknown_motion_style", "spin_attack");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk", gesture_hint: "https://secret.example/motion" },
    },
  }, "unsafe_cue_value", "https://secret.example/motion");
  for (const field of [
    "world_command",
    "input_action_candidate",
    "approved_game_input_action",
    "candidate",
    "commit",
    "write",
    "raw_renderer_payload",
    "raw_motion_command",
    "model_path",
    "modelPath",
    "internal_model_path",
    "internalModelPath",
    "motion_path",
    "motionPath",
    "rawMotionPath",
    "obs_command",
    "game_input",
    "os_command",
  ]) {
    await assertCueRejected(missing, cueWithUnsafeField(field), "unsafe_cue_field", field);
  }
  for (const field of ["token", "secret", "authorization", "endpoint", "rendererEndpoint", "url", "apiKey"]) {
    await assertCueRejected(missing, cueWithUnsafeField(field), "unsafe_cue_field", field);
  }
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "laugh_big" },
    },
  }, "recovery_required", "laugh_big");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "surprise_scream" },
    },
  }, "recovery_required", "surprise_scream");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "happy_dance" },
    },
  }, "recovery_required", "happy_dance");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      camera: { face_priority: true },
    },
  }, "recovery_required", "face_priority");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_strong_without_recovery",
    event_id: "contract_event",
    motion_style: "laugh_big",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "laugh_big", "/live2d-engine");

  const statusAfter = await missing.getJson("/status");
  assert.equal(statusAfter.renderer_ready, false);
  assert.equal(statusAfter.received_cue_count, 5);
  assert.equal(statusAfter.browser_delivery.pending_cue_count, 5);
  assert.notEqual(statusAfter.last_cue_received_at, null);
  assertSafe(JSON.stringify(statusAfter));

  await missing.close();

  const modelOnly = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const modelOnlyCue = await modelOnly.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
    },
  });
  const modelOnlyHeartbeat = await modelOnly.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: modelOnlyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelOnlyHeartbeat.renderer_ready, false);
  assert.equal(modelOnlyHeartbeat.renderer_health.cubism_sdk_available, false);
  assertSafe(JSON.stringify(modelOnlyHeartbeat));
  await modelOnly.close();

  const ready = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const readyRuntimeConfig = await ready.getJson("/renderer/runtime-config");
  assert.equal(readyRuntimeConfig.cubism_sdk.available, true);
  assert.equal(readyRuntimeConfig.model3.available, true);
  assert.equal(readyRuntimeConfig.model3.manifest_available, true);
  assert.equal(readyRuntimeConfig.model3.load_route, "not_available");
  assert.equal(readyRuntimeConfig.model3.browser_load_supported, false);
  assert.equal(readyRuntimeConfig.model3.real_model_loaded, false);
  assertSafe(JSON.stringify(readyRuntimeConfig));
  const sdkScript = await ready.getText("/renderer/cubism-core.js");
  assert.equal(sdkScript.includes("Live2DCubismCore"), true);

  const readyStatusBeforeCue = await ready.getJson("/status");
  assert.equal(readyStatusBeforeCue.renderer_health.cubism_sdk_available, true);
  assert.equal(readyStatusBeforeCue.renderer_health.model3_manifest_available, true);
  assert.equal(readyStatusBeforeCue.renderer_ready, false);
  assertSafe(JSON.stringify(readyStatusBeforeCue));

  const acceptedReadyCue = await ready.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      timing: { duration_ms: 700 },
    },
  });
  assert.equal(acceptedReadyCue.accepted, true);
  assert.equal(acceptedReadyCue.renderer_ready, false);
  assertSafe(JSON.stringify(acceptedReadyCue));

  const fixtureOnlyHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(fixtureOnlyHeartbeat.renderer_ready, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.real_model_load_supported, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.model_loaded_claimed, true);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.last_cue_applied_at, null);
  assertSafe(JSON.stringify(fixtureOnlyHeartbeat));

  const fixtureOnlyBrowserCues = await ready.getJson("/renderer/cues");
  assert.equal(fixtureOnlyBrowserCues.delivery_ready, false);
  assert.equal(fixtureOnlyBrowserCues.cues.length, 0);
  assert.equal(fixtureOnlyBrowserCues.pending_cue_count, 1);
  assertSafe(JSON.stringify(fixtureOnlyBrowserCues));

  const readyHealth = await ready.getJson("/health");
  assert.equal(readyHealth.renderer_ready, false);
  assertSafe(JSON.stringify(readyHealth));

  const noAppliedAtState = createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  });
  const noAppliedAt = await startHarness(noAppliedAtState);
  const noAppliedAtCue = await noAppliedAt.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
    },
  });
  const noAppliedAtHeartbeat = await noAppliedAt.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: noAppliedAtCue.cue_summary.status_hash,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(noAppliedAtHeartbeat.renderer_ready, false);
  assert.equal(noAppliedAtHeartbeat.renderer_health.last_cue_applied_at, null);
  assertSafe(JSON.stringify(noAppliedAtHeartbeat));
  await noAppliedAt.close();

  nowMs += 10_000;
  const staleReadyHealth = await ready.getJson("/health");
  assert.equal(staleReadyHealth.renderer_ready, false);
  assertSafe(JSON.stringify(staleReadyHealth));
  await ready.close();

  const authRequired = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }), { rendererApiKey: "fixture-renderer-key" });
  const unauthorized = await fetch(`${authRequired.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schema: "iris_live2d_renderer_cue_delivery_v1", cue: { schema: "iris_live2d_renderer_cue_v1" } }),
  });
  const unauthorizedBody = await unauthorized.json();
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorizedBody.error_kind, "auth_required");
  assertSafe(JSON.stringify(unauthorizedBody));
  const authorized = await fetch(`${authRequired.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": "fixture-renderer-key" },
    body: JSON.stringify({ schema: "iris_live2d_renderer_cue_delivery_v1", cue: { schema: "iris_live2d_renderer_cue_v1" } }),
  });
  const authorizedBody = await authorized.json();
  assert.equal(authorized.status, 200);
  assert.equal(authorizedBody.accepted, true);
  assertSafe(JSON.stringify(authorizedBody));
  await authRequired.close();

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
      "browser_cue_retention",
      "redaction",
      "optional_write_auth",
      "mock_health_false",
      "runtime_config_safe",
      "model3_route_not_exposed",
      "sdk_script_route",
      "sdk_missing_blocks_ready",
      "model3_available",
      "fixture_manifest_blocks_ready",
      "last_cue_applied_at_guard",
      "cue_allowlist_validation",
      "unsafe_cue_safe_reject",
      "strong_motion_recovery_required",
      "iris_bridge_cue_compatibility",
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

function createIrisBridgeCueFixture() {
  return {
    schema: "iris_live2d_renderer_cue_v1",
    cue_id: "live2d-cue-fixture",
    model: {
      model_configured: true,
      scene_configured: true,
    },
    motion: {
      style: "surprise_scream",
      intensity: "high",
      blend_ms: 80,
      track_count: 2,
      body_motion_hint: "shoulder_jump_small_retreat",
      gesture_hint: "hands_near_chest_startle",
    },
    expression: {
      profile_id: "fixture_expression_scream",
      expression_key: "wide_eyes_short_scream",
      blink_rate: 0.2,
      gaze_hint: "snap_to_screen_then_audience",
    },
    body: {
      state_id: "fixture_body_scream",
      autonomous_state_id: "surprise_scream",
      breathing_rate: 0.86,
      shoulder_motion: "short_jump_then_breath_recover",
    },
    camera: {
      proximity_profile: "camera_face_extreme_closeup",
      scale: 1.22,
      offset_x: 0,
      offset_y: -0.055,
      face_priority: true,
      comfort_guard: "bounded_viewer_closeup",
    },
    autonomous: {
      state: "surprise_scream",
      scream_reaction_enabled: true,
      happy_motion_enabled: false,
      vocalise_motion_enabled: false,
      safety_guard: "visual_expression_only_no_commands",
    },
    timing: {
      duration_ms: 1500,
      start_delay_ms: 0,
      sync_policy: "speech_motion_timeline",
    },
    boundary_policy: {
      renderer_cue_only: true,
      no_text_payloads: true,
      no_candidates: true,
      no_commands: true,
      no_endpoint_values: true,
      no_secret_values: true,
    },
    adapter_validation_required: true,
  };
}

function cueWithUnsafeField(field) {
  return {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      [field]: "unsafe_fixture_value",
    },
  };
}

async function assertCueRejected(harness, body, expectedKind, forbiddenFragment, path = "/cue") {
  const before = await harness.getJson("/status");
  const response = await fetch(`${harness.baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const responseBody = await response.json();
  assert.equal(response.status, 400);
  assert.equal(responseBody.ok, false);
  assert.equal(responseBody.error_kind, expectedKind);
  const serialized = JSON.stringify(responseBody);
  assertSafe(serialized);
  assert.equal(serialized.includes(`"${forbiddenFragment}"`), false);
  assert.equal(serialized.includes("unsafe_fixture_value"), false);
  const after = await harness.getJson("/status");
  assert.equal(after.received_cue_count, before.received_cue_count);
  assert.equal(after.browser_delivery.pending_cue_count, before.browser_delivery.pending_cue_count);
  assert.equal(after.renderer_ready, false);
}

async function startHarness(state, options = {}) {
  const server = createLive2dRendererServer({ state, ...options });
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  const baseUrl = `http://${address.address}:${address.port}`;
  return {
    baseUrl,
    async getJson(path) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.ok, true);
      return response.json();
    },
    async getText(path) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.ok, true);
      return response.text();
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
  assert.equal(serialized.includes("raw_motion_command"), false);
  assert.equal(serialized.includes("internal_model_path"), false);
  assert.equal(serialized.includes("motion_path"), false);
  assert.equal(serialized.includes("world_command"), false);
  assert.equal(serialized.includes("input_action_candidate"), false);
  assert.equal(serialized.includes("approved_game_input_action"), false);
  assert.equal(serialized.includes("obs_command"), false);
  assert.equal(serialized.includes("game_input"), false);
  assert.equal(serialized.includes("os_command"), false);
}
