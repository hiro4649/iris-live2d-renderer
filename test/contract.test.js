import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";
import {
  applyRuntimeConfig,
  browserStatusText,
  createHeartbeatPayload,
  createInitialRendererState,
  detectCubismModelLoader,
  enqueueBrowserCues,
  flushPendingCues,
  handleCueEventMessage,
  updateModelLoadEvidence,
} from "../public/renderer.js";

let nowMs = 1_800_000_000_000;
const tmpDir = join(process.cwd(), ".tmp-live2d-renderer-contract");
await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });
const model3Path = join(tmpDir, "avatar.model3.json");
const sdkCorePath = join(tmpDir, "live2dcubismcore.js");
await mkdir(join(tmpDir, "textures"), { recursive: true });
await mkdir(join(tmpDir, "motions"), { recursive: true });
await mkdir(join(tmpDir, "expressions"), { recursive: true });
await writeFile(join(tmpDir, "safe_model.moc3"), "fixture-moc");
await writeFile(join(tmpDir, "textures", "texture_00.png"), "fixture-png");
await writeFile(join(tmpDir, "motions", "idle.motion3.json"), JSON.stringify({ Version: 3, Meta: {} }));
await writeFile(join(tmpDir, "expressions", "soft_smile.exp3.json"), JSON.stringify({ Type: "Live2D Expression" }));
await writeFile(model3Path, JSON.stringify({
  Version: 3,
  FileReferences: {
    Moc: "safe_model.moc3",
    Textures: ["textures/texture_00.png"],
    Expressions: [{ Name: "soft_smile", File: "expressions/soft_smile.exp3.json" }],
    Motions: { Idle: [{ File: "motions/idle.motion3.json" }] },
  },
}));
await writeFile(sdkCorePath, "globalThis.Live2DCubismCore = { Version: 'contract' };\n");

try {
  const loaderPreflightDoc = await readFile(
    "docs/iris-live2d-renderer/IRIS_LIVE2D_LOADER_INTEGRATION_PREFLIGHT.md",
    "utf8"
  );
  const scheduleDoc = await readFile(
    "docs/iris-live2d-renderer/IRIS_LIVE2D_RENDERER_DEVELOPMENT_SCHEDULE.md",
    "utf8"
  );
  for (const requiredLabel of [
    "loader_detected_untrusted",
    "trusted_loader_evidence_candidate",
    "trusted_loader_ready_future",
    "model_load_supported",
    "real_model_load_supported",
    "runtime_motion_allowlist",
    "expression_candidate_labels",
    "K331",
    "K332",
    "K333",
    "K334",
    "K626",
    "K627",
    "K628",
    "K629",
    "K806",
    "K814",
    "K944",
  ]) {
    assert.equal(loaderPreflightDoc.includes(requiredLabel), true);
  }
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-LOADER-INTEGRATION-PREFLIGHT5") >
      scheduleDoc.indexOf("REAL-MODEL-LOAD4"),
    true
  );
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-LOADER-INTEGRATION-PREFLIGHT5") <
      scheduleDoc.indexOf("MICRO-REACTION-PACK5"),
    true
  );

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
  assert.equal(missingRuntimeConfig.model3.load_route, "not_available");
  assert.equal(missingRuntimeConfig.model3.browser_load_supported, false);
  assertSafe(JSON.stringify(missingRuntimeConfig));
  const missingModel3 = await fetchJsonStatus(`${missing.baseUrl}/renderer/model3`);
  assert.equal(missingModel3.status, 404);
  assert.equal(missingModel3.body.error_kind, "not_found");
  assertSafe(JSON.stringify(missingModel3.body));

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
  assert.equal(browserState.model3BrowserLoadSupported, false);
  assert.equal(browserState.modelLoadStatus, "not_configured");
  assert.equal(enqueueBrowserCues(browserState, [{ status_hash: "browser_pending_hash" }]), 1);
  const pendingFlush = flushPendingCues(browserState, () => nowMs);
  assert.equal(pendingFlush.applied_count, 0);
  assert.equal(pendingFlush.pending_cue_count, 1);
  assert.equal(browserState.lastCueApplyStatus, "queued_until_ready");
  assert.equal(browserStatusText(browserState), "Live2D renderer preserving cue until real model load");
  const browserHeartbeatPayload = createHeartbeatPayload(browserState, nowMs);
  assert.equal(browserHeartbeatPayload.model3_loaded, false);
  assert.equal(browserHeartbeatPayload.scene_loaded, false);
  assert.equal(browserHeartbeatPayload.real_model_loaded, false);
  assert.equal(browserHeartbeatPayload.model_load_status, "not_configured");
  assert.equal(browserHeartbeatPayload.cue_capability.model_motion_update, false);

  const assetRouteOnlyState = createInitialRendererState();
  const assetRouteConfig = {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: true },
  };
  applyRuntimeConfig(assetRouteOnlyState, assetRouteConfig, false);
  assert.equal(assetRouteOnlyState.modelAssetRouteAvailable, true);
  assert.equal(assetRouteOnlyState.model3Loaded, false);
  assert.equal(assetRouteOnlyState.sceneLoaded, false);
  assert.equal(createHeartbeatPayload(assetRouteOnlyState, nowMs).real_model_loaded, false);
  await updateModelLoadEvidence(assetRouteOnlyState, assetRouteConfig, {
    fetchImpl: async () => {
      throw new Error("fetch_not_expected_for_runtime_missing");
    },
    runtimeRoot: {},
  });
  assert.equal(assetRouteOnlyState.modelLoadStatus, "runtime_missing");
  assert.equal(assetRouteOnlyState.realModelLoadSupported, false);
  assert.equal(assetRouteOnlyState.model3Loaded, false);
  assert.equal(assetRouteOnlyState.sceneLoaded, false);

  const cubismCoreOnlyState = createInitialRendererState();
  applyRuntimeConfig(cubismCoreOnlyState, assetRouteConfig, true);
  assert.equal(detectCubismModelLoader({ Live2DCubismCore: { Version: "contract" } }), null);
  await updateModelLoadEvidence(cubismCoreOnlyState, assetRouteConfig, {
    fetchImpl: async () => {
      throw new Error("fetch_not_expected_for_loader_missing");
    },
    runtimeRoot: { Live2DCubismCore: { Version: "contract" } },
  });
  assert.equal(cubismCoreOnlyState.cubismRuntimeLoaded, true);
  assert.equal(cubismCoreOnlyState.modelAssetRouteAvailable, true);
  assert.equal(cubismCoreOnlyState.modelLoadStatus, "loader_missing");
  assert.equal(cubismCoreOnlyState.modelLoadErrorKind, "loader_missing");
  assert.equal(cubismCoreOnlyState.modelLoadSupported, false);
  assert.equal(cubismCoreOnlyState.modelLoadSucceeded, false);
  assert.equal(cubismCoreOnlyState.realModelLoadSupported, false);
  assert.equal(cubismCoreOnlyState.model3Loaded, false);
  assert.equal(cubismCoreOnlyState.sceneLoaded, false);
  const loaderMissingPayload = createHeartbeatPayload(cubismCoreOnlyState, nowMs);
  assert.equal(loaderMissingPayload.model_load_status, "loader_missing");
  assert.equal(loaderMissingPayload.model_load_error_kind, "loader_missing");
  assert.equal(loaderMissingPayload.real_model_loaded, false);
  assert.equal(loaderMissingPayload.real_scene_loaded, false);
  assertSafe(JSON.stringify(loaderMissingPayload));

  const fakeLoaderState = createInitialRendererState();
  applyRuntimeConfig(fakeLoaderState, assetRouteConfig, true);
  assert.equal(detectCubismModelLoader(createFakeLoaderRuntime())?.kind, "cubism_moc_create");
  await updateModelLoadEvidence(fakeLoaderState, assetRouteConfig, {
    fetchImpl: createFakeLoaderFetch(),
    runtimeRoot: createFakeLoaderRuntime(),
  });
  assert.equal(fakeLoaderState.modelLoadStatus, "loaded");
  assert.equal(fakeLoaderState.modelLoadSupported, true);
  assert.equal(fakeLoaderState.realModelLoadSupported, true);
  assert.equal(fakeLoaderState.model3Loaded, true);
  assert.equal(fakeLoaderState.sceneLoaded, true);
  const fakeLoaderHeartbeatPayload = createHeartbeatPayload(fakeLoaderState, nowMs);
  assert.equal(fakeLoaderHeartbeatPayload.real_model_load_supported, true);
  assert.equal(fakeLoaderHeartbeatPayload.real_model_loaded, true);
  const fakeLoaderHeartbeat = await missing.postJson(
    "/renderer/heartbeat",
    fakeLoaderHeartbeatPayload
  );
  assert.equal(fakeLoaderHeartbeat.renderer_ready, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.real_model_load_supported, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_load_supported, true);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_loaded_claimed, true);
  assert.equal(fakeLoaderHeartbeat.renderer_health.real_model_loaded_claimed, true);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(fakeLoaderHeartbeat));

  browserState.realModelLoadSupported = true;
  browserState.model3Loaded = true;
  browserState.sceneLoaded = true;
  const appliedFlush = flushPendingCues(browserState, () => nowMs);
  assert.equal(appliedFlush.applied_count, 1);
  assert.equal(appliedFlush.pending_cue_count, 0);
  assert.equal(browserState.lastAppliedCueStatusHash, "browser_pending_hash");

  const eventStreamBrowserState = createInitialRendererState();
  applyRuntimeConfig(eventStreamBrowserState, {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: false },
  }, true);
  const eventStreamPending = handleCueEventMessage(eventStreamBrowserState, {
    data: JSON.stringify({ cues: [{ status_hash: "event_stream_pending_hash" }] }),
  });
  assert.equal(eventStreamPending.applied_count, 0);
  assert.equal(eventStreamPending.pending_cue_count, 1);
  assert.equal(eventStreamBrowserState.lastCueApplyStatus, "queued_until_ready");
  eventStreamBrowserState.realModelLoadSupported = true;
  eventStreamBrowserState.model3Loaded = true;
  eventStreamBrowserState.sceneLoaded = true;
  const eventStreamApplied = flushPendingCues(eventStreamBrowserState, () => nowMs);
  assert.equal(eventStreamApplied.applied_count, 1);
  assert.equal(eventStreamBrowserState.lastAppliedCueStatusHash, "event_stream_pending_hash");

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

  const loaderMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loader_missing",
    model_load_supported: false,
    model_load_attempted: false,
    model_load_succeeded: false,
    model_load_error_kind: "loader_missing",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(loaderMissingHeartbeat.renderer_ready, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.model_load_status, "loader_missing");
  assert.equal(loaderMissingHeartbeat.renderer_health.model_load_supported, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.model_loaded, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(loaderMissingHeartbeat));

  const runtimeMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: false,
    model_asset_route_available: true,
    model_load_status: "runtime_missing",
    model_load_supported: false,
    model_load_error_kind: "runtime_missing",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(runtimeMissingHeartbeat.renderer_ready, false);
  assert.equal(runtimeMissingHeartbeat.renderer_health.cubism_sdk_loaded, false);
  assert.equal(runtimeMissingHeartbeat.renderer_health.model_load_status, "runtime_missing");
  assert.equal(runtimeMissingHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(runtimeMissingHeartbeat));

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

  const waitingSse = await readSseEvents(missing.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(waitingSse.contentType.includes("text/event-stream"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "renderer_status"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "heartbeat"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(waitingSse.events));
  const statusAfterWaitingSse = await missing.getJson("/status");
  assert.equal(statusAfterWaitingSse.browser_delivery.pending_cue_count, 1);
  assert.equal(statusAfterWaitingSse.renderer_ready, false);

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

  const happyLoudSingWithRecovery = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "happy_loud_sing", intensity: "high" },
    recovery_cue: { style: "idle_breath" },
  }));
  assert.equal(happyLoudSingWithRecovery.accepted, true);
  assertSafe(JSON.stringify(happyLoudSingWithRecovery));

  const cameraScaleWithRecovery = await missing.postJson("/cue", rendererCueDelivery({
    camera: { scale: 1.06, recovery_hint: "visibility_restore" },
  }));
  assert.equal(cameraScaleWithRecovery.accepted, true);
  assertSafe(JSON.stringify(cameraScaleWithRecovery));

  const rendererCueWrapper = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
    boundary_policy: {
      renderer_cue_only: true,
      no_candidates: true,
      no_commands: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(rendererCueWrapper.accepted, true);
  assertSafe(JSON.stringify(rendererCueWrapper));

  const live2dCueWrapper = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    live2d_cue: safeRendererCue({ motion: { style: "idle_breath" } }),
    boundary_policy: {
      renderer_cue_only: true,
      no_candidates: true,
      no_commands: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(live2dCueWrapper.accepted, true);
  assertSafe(JSON.stringify(live2dCueWrapper));

  const motionRecoveryRequired = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "surprise_scream", recovery_required: true },
  }));
  assert.equal(motionRecoveryRequired.accepted, true);
  assertSafe(JSON.stringify(motionRecoveryRequired));

  const bodyRecoveryHint = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "happy_dance", intensity: "high" },
    body: { recovery_hint: "neutral_reset" },
  }));
  assert.equal(bodyRecoveryHint.accepted, true);
  assertSafe(JSON.stringify(bodyRecoveryHint));

  const cameraRecoveryHint = await missing.postJson("/cue", rendererCueDelivery({
    camera: { face_priority: true, recovery_hint: "visibility_restore" },
  }));
  assert.equal(cameraRecoveryHint.accepted, true);
  assertSafe(JSON.stringify(cameraRecoveryHint));

  const shoulderMotionRecoverCompatibility = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "surprise_scream" },
    body: { shoulder_motion: "short_jump_then_breath_recover" },
  }));
  assert.equal(shoulderMotionRecoverCompatibility.accepted, true);
  assertSafe(JSON.stringify(shoulderMotionRecoverCompatibility));

  const localEngineCloseupWithRecovery = await missing.postJson("/live2d-engine", {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_closeup_with_recovery",
    event_id: "contract_event",
    motion_style: "talk",
    camera_proximity_profile: "close_face",
    camera_recovery_hint: "visibility_restore",
    timing: { total_duration_ms: 1200 },
  });
  assert.equal(localEngineCloseupWithRecovery.accepted, true);
  assertSafe(JSON.stringify(localEngineCloseupWithRecovery));

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
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "surprise_micro" },
  }), "unknown_motion_style", "surprise_micro");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk", gesture_hint: "https://secret.example/motion" },
    },
  }, "unsafe_cue_value", "https://secret.example/motion");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "talk", gesture_hint: "wss://secret.example/cue" },
  }), "unsafe_cue_value", "wss://secret.example/cue");
  await assertCueRejected(missing, rendererCueDelivery({
    expression: { expression_key: "avatar.model3.json" },
  }), "unsafe_cue_value", "avatar.model3.json");
  await assertCueRejected(missing, rendererCueDelivery({
    expression: { expression_key: "avatar.moc3" },
  }), "unsafe_cue_value", "avatar.moc3");
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
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
    token: "unsafe_fixture_value",
  }, "unsafe_cue_field", "token");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    live2d_cue: safeRendererCue({ raw_renderer_payload: "unsafe_fixture_value" }),
  }, "unsafe_cue_field", "raw_renderer_payload");
  await assertCueRejected(missing, {
    schema: "unsupported_live2d_wrapper_v1",
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
  }, "unsupported_cue", "unsupported_live2d_wrapper_v1");
  await assertCueRejected(missing, rendererCueDelivery({
    boundary_policy: { renderer_endpoint: "unsafe_fixture_value" },
  }), "unsafe_cue_field", "renderer_endpoint");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "laugh_big" },
    recovery_plan: { type: "shortcut_jump" },
  }), "invalid_cue_contract", "shortcut_jump");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "laugh_big" },
    recovery_cue: { style: "shortcut_jump" },
  }), "invalid_cue_contract", "shortcut_jump");
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
      motion: { style: "happy_loud_sing" },
    },
  }, "recovery_required", "happy_loud_sing");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      camera: { face_priority: true },
    },
  }, "recovery_required", "face_priority");
  await assertCueRejected(missing, rendererCueDelivery({
    camera: { scale: 1.06 },
  }), "recovery_required", "scale");
  await assertCueRejected(missing, rendererCueDelivery({
    camera: { proximity_profile: "close_face" },
  }), "recovery_required", "close_face");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_strong_without_recovery",
    event_id: "contract_event",
    motion_style: "laugh_big",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "laugh_big", "/live2d-engine");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_local_closeup_without_recovery",
    event_id: "contract_event",
    motion_style: "talk",
    camera_proximity_profile: "close_face",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "close_face", "/live2d-engine");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_local_sing_without_recovery",
    event_id: "contract_event",
    motion_style: "happy_loud_sing",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "happy_loud_sing", "/live2d-engine");

  const statusAfter = await missing.getJson("/status");
  assert.equal(statusAfter.renderer_ready, false);
  assert.equal(statusAfter.received_cue_count, 14);
  assert.equal(statusAfter.browser_delivery.pending_cue_count, 14);
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
  assert.equal(readyRuntimeConfig.model3.load_route, "renderer_model3_manifest");
  assert.equal(readyRuntimeConfig.model3.asset_route, "renderer_model_asset");
  assert.equal(readyRuntimeConfig.model3.browser_load_supported, true);
  assert.equal(readyRuntimeConfig.model3.real_model_loaded, false);
  assertSafe(JSON.stringify(readyRuntimeConfig));
  assertNoModelPathLeak(JSON.stringify(readyRuntimeConfig));
  const safeModel3 = await ready.getJson("/renderer/model3");
  assert.equal(safeModel3.ok, true);
  assert.equal(safeModel3.load_route, "renderer_model3_manifest");
  assert.equal(safeModel3.asset_route, "renderer_model_asset");
  assert.equal(safeModel3.manifest.FileReferences.Moc.startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Textures[0].startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Expressions[0].File.startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Motions.Idle[0].File.startsWith("renderer_model_asset:"), true);
  assertSafe(JSON.stringify(safeModel3));
  assertNoModelPathLeak(JSON.stringify(safeModel3));
  const mocAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Moc);
  const mocAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${mocAssetId}`);
  assert.equal(mocAssetResponse.status, 200);
  assert.equal(mocAssetResponse.headers.get("content-type"), "application/octet-stream");
  assert.equal(await mocAssetResponse.text(), "fixture-moc");
  const textureAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Textures[0]);
  const textureAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${textureAssetId}`);
  assert.equal(textureAssetResponse.status, 200);
  assert.equal(textureAssetResponse.headers.get("content-type"), "image/png");
  const motionAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Motions.Idle[0].File);
  const motionAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${motionAssetId}`);
  assert.equal(motionAssetResponse.status, 200);
  assert.equal((motionAssetResponse.headers.get("content-type") || "").includes("application/json"), true);
  const unknownAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/asset_0000000000000000_moc3`);
  assert.equal(unknownAsset.status, 404);
  assertSafe(JSON.stringify(unknownAsset.body));
  const traversalAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/..%2Fsecret`);
  assert.equal(traversalAsset.status, 404);
  assertSafe(JSON.stringify(traversalAsset.body));
  const urlAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/http%3A%2F%2Fexample.invalid%2Fasset.moc3`);
  assert.equal(urlAsset.status, 404);
  assertSafe(JSON.stringify(urlAsset.body));
  const queryAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/${mocAssetId}?raw_path=unsafe`);
  assert.equal(queryAsset.status, 404);
  assertSafe(JSON.stringify(queryAsset.body));
  const sdkScript = await ready.getText("/renderer/cubism-core.js");
  assert.equal(sdkScript.includes("Live2DCubismCore"), true);

  const readyStatusBeforeCue = await ready.getJson("/status");
  assert.equal(readyStatusBeforeCue.renderer_health.cubism_sdk_available, true);
  assert.equal(readyStatusBeforeCue.renderer_health.model3_manifest_available, true);
  assert.equal(readyStatusBeforeCue.renderer_ready, false);
  assertSafe(JSON.stringify(readyStatusBeforeCue));
  assertNoModelPathLeak(JSON.stringify(readyStatusBeforeCue));

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

  const manifestOnlyHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "asset_route_available",
    model_load_supported: false,
    model_load_attempted: false,
    model_load_succeeded: false,
    model_load_error_kind: "unknown",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(manifestOnlyHeartbeat.renderer_ready, false);
  assert.equal(manifestOnlyHeartbeat.renderer_health.model_load_status, "asset_route_available");
  assert.equal(manifestOnlyHeartbeat.renderer_health.model_loaded, false);
  assert.equal(manifestOnlyHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(manifestOnlyHeartbeat));

  const modelLoadedWithoutRealFlag = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loaded",
    model_load_supported: true,
    model_load_attempted: true,
    model_load_succeeded: true,
    model_load_error_kind: "unknown",
    real_model_load_supported: true,
    real_model_loaded: false,
    real_scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelLoadedWithoutRealFlag.renderer_ready, false);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.model_loaded_claimed, true);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.real_model_loaded_claimed, false);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(modelLoadedWithoutRealFlag));

  const sceneLoadedWithoutRealFlag = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sceneLoadedWithoutRealFlag.renderer_ready, false);
  assert.equal(sceneLoadedWithoutRealFlag.renderer_health.model_loaded, false);
  assert.equal(sceneLoadedWithoutRealFlag.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(sceneLoadedWithoutRealFlag));

  const staleRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs - 10_000,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs - 10_000,
  }));
  assert.equal(staleRealModelHeartbeat.renderer_ready, false);
  assert.equal(staleRealModelHeartbeat.renderer_health.fresh_heartbeat, false);
  assert.equal(staleRealModelHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(staleRealModelHeartbeat));

  const modelMismatchRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    model_id: "other_model",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelMismatchRealModelHeartbeat.renderer_ready, false);
  assert.equal(modelMismatchRealModelHeartbeat.renderer_health.model_matches, false);
  assert.equal(modelMismatchRealModelHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(modelMismatchRealModelHeartbeat));

  const sceneMismatchRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    scene_id: "other_scene",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_ready, false);
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_health.scene_matches, false);
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(sceneMismatchRealModelHeartbeat));

  const lastCueNotAppliedRealModel = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_apply_status: "not_ready",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(lastCueNotAppliedRealModel.renderer_ready, false);
  assert.equal(lastCueNotAppliedRealModel.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(lastCueNotAppliedRealModel.renderer_health.last_cue_applied, false);
  assertSafe(JSON.stringify(lastCueNotAppliedRealModel));

  const deliveryEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(deliveryEvidenceHeartbeat.renderer_ready, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.model_loaded, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(deliveryEvidenceHeartbeat));
  const realEvidenceBrowserCues = await ready.getJson("/renderer/cues");
  assert.equal(realEvidenceBrowserCues.delivery_ready, false);
  assert.equal(realEvidenceBrowserCues.cues.length, 0);
  assert.equal(realEvidenceBrowserCues.pending_cue_count, 1);
  assertSafe(JSON.stringify(realEvidenceBrowserCues));

  const fullRealEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(fullRealEvidenceHeartbeat.renderer_ready, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.last_cue_applied, false);
  assertSafe(JSON.stringify(fullRealEvidenceHeartbeat));

  const readyHealth = await ready.getJson("/health");
  assert.equal(readyHealth.renderer_ready, false);
  assertSafe(JSON.stringify(readyHealth));
  assertNoModelPathLeak(JSON.stringify(readyHealth));

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

  const unsafeUrlManifestPath = join(tmpDir, "unsafe-url.model3.json");
  await writeFile(unsafeUrlManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "https://example.invalid/model.moc3" },
  }));
  await assertManifestUnavailable(unsafeUrlManifestPath);

  const unsafeAbsoluteManifestPath = join(tmpDir, "unsafe-absolute.model3.json");
  await writeFile(unsafeAbsoluteManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "/unsafe/model.moc3" },
  }));
  await assertManifestUnavailable(unsafeAbsoluteManifestPath);

  const unsafeTraversalManifestPath = join(tmpDir, "unsafe-traversal.model3.json");
  await writeFile(unsafeTraversalManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "../outside.moc3" },
  }));
  await assertManifestUnavailable(unsafeTraversalManifestPath);

  const unsafeExtensionManifestPath = join(tmpDir, "unsafe-extension.model3.json");
  await writeFile(unsafeExtensionManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "asset.txt" },
  }));
  await assertManifestUnavailable(unsafeExtensionManifestPath);

  const deliveryReady = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const deliveryReadyHeartbeat = await deliveryReady.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(deliveryReadyHeartbeat.renderer_ready, false);
  assert.equal(deliveryReadyHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(deliveryReadyHeartbeat));
  const sseCue = await deliveryReady.postJson("/cue", rendererCueDelivery({
    motion: { style: "talk" },
    timing: { duration_ms: 700 },
  }));
  assert.equal(sseCue.accepted, true);
  const waitingSseOnly = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(waitingSseOnly.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(waitingSseOnly.events));
  const waitingPolling = await deliveryReady.getJson("/renderer/cues");
  assert.equal(waitingPolling.delivery_ready, false);
  assert.equal(waitingPolling.cues.length, 0);
  assert.equal(waitingPolling.pending_cue_count, 1);
  assertSafe(JSON.stringify(waitingPolling));

  const pollingCue = await deliveryReady.postJson("/cue", rendererCueDelivery({
    motion: { style: "idle_breath" },
    timing: { duration_ms: 500 },
  }));
  const pollingFallback = await deliveryReady.getJson("/renderer/cues");
  assert.equal(pollingCue.accepted, true);
  assert.equal(pollingFallback.delivery_ready, false);
  assert.equal(pollingFallback.cues.length, 0);
  assert.equal(pollingFallback.pending_cue_count, 2);
  assertSafe(JSON.stringify(pollingFallback));
  const noDeliveryWhileUntrusted = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(noDeliveryWhileUntrusted.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(noDeliveryWhileUntrusted.events));

  await assertCueRejected(deliveryReady, cueWithUnsafeField("raw_renderer_payload"), "unsafe_cue_field", "raw_renderer_payload");
  const rejectedSse = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(rejectedSse.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(rejectedSse.events));
  const deliveryReadyStatus = await deliveryReady.getJson("/status");
  assert.equal(deliveryReadyStatus.renderer_ready, false);
  await deliveryReady.close();

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
      "unavailable_model3_route_not_advertised",
      "sdk_script_route",
      "sdk_missing_blocks_ready",
      "model3_available",
      "fixture_manifest_blocks_ready",
      "last_cue_applied_at_guard",
      "cue_allowlist_validation",
      "unsafe_cue_safe_reject",
      "strong_motion_recovery_required",
      "iris_bridge_cue_compatibility",
      "sse_cue_delivery_safe_summary",
      "sse_polling_no_duplicate_delivery",
      "safe_model3_manifest_route",
      "safe_model_asset_route",
      "unsafe_manifest_blocks_browser_load",
      "model_loader_missing_blocks_ready",
      "real_model_load_evidence_required",
      "synthetic_real_model_heartbeat_does_not_make_ready",
      "trusted_loader_preflight_contract_documented",
      "fake_loader_detection_is_diagnostic_only",
      "motion_dataset_boundary_labels_not_runtime_executable",
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

function syntheticRealModelHeartbeat(overrides = {}) {
  // Self-asserted browser fields are diagnostic fixtures only; they must not
  // establish trusted real model readiness in this PR.
  return browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loaded",
    model_load_supported: true,
    model_load_attempted: true,
    model_load_succeeded: true,
    model_load_error_kind: "unknown",
    real_model_load_supported: true,
    real_model_loaded: true,
    real_scene_loaded: true,
    ...overrides,
  });
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

function safeRendererCue(overrides = {}) {
  return {
    schema: "iris_live2d_renderer_cue_v1",
    motion: { style: "talk" },
    ...overrides,
  };
}

function rendererCueDelivery(cueOverrides = {}, wrapperOverrides = {}) {
  return {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: safeRendererCue(cueOverrides),
    ...wrapperOverrides,
  };
}

function createFakeLoaderRuntime() {
  return {
    CubismMoc: {
      create() {
        return {
          createModel() {
            return { fixture_model_created: true };
          },
        };
      },
    },
  };
}

function createFakeLoaderFetch() {
  return async (path) => {
    if (path === "/renderer/model3") {
      return {
        ok: true,
        json: async () => ({
          ok: true,
          manifest: {
            FileReferences: {
              Moc: "renderer_model_asset:asset_0123456789abcdef_moc3",
            },
          },
        }),
      };
    }
    if (path === "/renderer/model-asset/asset_0123456789abcdef_moc3") {
      return {
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      };
    }
    return {
      ok: false,
      json: async () => ({}),
    };
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
  const beforeBrowserQueue = await harness.getJson("/renderer/cues");
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
  assert.equal(after.last_cue_status_hash, before.last_cue_status_hash);
  assert.equal(after.browser_delivery.last_delivered_at, before.browser_delivery.last_delivered_at);
  assert.equal(after.renderer_ready, false);
  const afterBrowserQueue = await harness.getJson("/renderer/cues");
  assert.equal(afterBrowserQueue.pending_cue_count, beforeBrowserQueue.pending_cue_count);
  assert.equal(afterBrowserQueue.cues.length, beforeBrowserQueue.cues.length);
  const queueSerialized = JSON.stringify(afterBrowserQueue);
  assert.equal(queueSerialized, JSON.stringify(beforeBrowserQueue));
  assertSafe(queueSerialized);
  assert.equal(queueSerialized.includes("unsafe_fixture_value"), false);
}

async function assertManifestUnavailable(model3JsonPath) {
  const harness = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  try {
    const runtimeConfig = await harness.getJson("/renderer/runtime-config");
    assert.equal(runtimeConfig.model3.available, false);
    assert.equal(runtimeConfig.model3.load_route, "not_available");
    assert.equal(runtimeConfig.model3.browser_load_supported, false);
    assert.equal(runtimeConfig.model3.real_model_loaded, false);
    assertSafe(JSON.stringify(runtimeConfig));
    assertNoModelPathLeak(JSON.stringify(runtimeConfig));
    const manifest = await fetchJsonStatus(`${harness.baseUrl}/renderer/model3`);
    assert.equal(manifest.status, 404);
    assert.equal(manifest.body.error_kind, "not_found");
    assertSafe(JSON.stringify(manifest.body));
    const heartbeat = await harness.postJson("/renderer/heartbeat", browserHeartbeat({
      heartbeat_timestamp_ms: nowMs,
    }));
    assert.equal(heartbeat.renderer_ready, false);
    assert.equal(heartbeat.renderer_health.model_loaded, false);
    assert.equal(heartbeat.renderer_health.scene_loaded, false);
    assertSafe(JSON.stringify(heartbeat));
  } finally {
    await harness.close();
  }
}

async function readSseEvents(baseUrl, { eventName = "", minEvents = 1, timeoutMs = 500 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(`${baseUrl}/renderer/events`, { signal: controller.signal });
  assert.equal(response.ok, true);
  const contentType = response.headers.get("content-type") || "";
  assert.equal(contentType.includes("text/event-stream"), true);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const events = [];
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseEvents(buffer);
      buffer = parsed.remainder;
      events.push(...parsed.events);
      if (eventName && events.some((event) => event.event === eventName)) break;
      if (!eventName && events.length >= minEvents) break;
    }
  } catch (error) {
    if (error?.name !== "AbortError") throw error;
  } finally {
    clearTimeout(timeout);
    controller.abort();
    try {
      await reader.cancel();
    } catch {
      // The client-side abort is the disconnect path under test.
    }
  }

  return { contentType, events };
}

function parseSseEvents(buffer) {
  const blocks = buffer.split(/\r?\n\r?\n/u);
  const remainder = blocks.pop() ?? "";
  return {
    remainder,
    events: blocks.map(parseSseEvent).filter(Boolean),
  };
}

function parseSseEvent(block) {
  let event = "message";
  const dataLines = [];
  for (const line of block.split(/\r?\n/u)) {
    if (line.startsWith(":")) continue;
    if (line.startsWith("event:")) event = line.slice("event:".length).trim();
    if (line.startsWith("data:")) dataLines.push(line.slice("data:".length).trimStart());
  }
  if (dataLines.length === 0) return null;
  const dataText = dataLines.join("\n");
  const data = JSON.parse(dataText);
  assertSafe(dataText);
  return { event, data };
}

async function fetchJsonStatus(target) {
  const response = await fetch(target);
  return {
    status: response.status,
    body: await response.json(),
  };
}

function assetIdFromToken(token) {
  const text = String(token ?? "");
  assert.equal(text.startsWith("renderer_model_asset:"), true);
  const assetId = text.slice("renderer_model_asset:".length);
  assert.match(assetId, /^asset_[a-f0-9]{16}_[a-z0-9]+$/u);
  return assetId;
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

function assertNoModelPathLeak(serialized) {
  for (const fragment of [
    tmpDir,
    "avatar.model3.json",
    "safe_model.moc3",
    "textures/texture_00.png",
    "motions/idle.motion3.json",
    "expressions/soft_smile.exp3.json",
    "https://example.invalid",
    "/unsafe/model.moc3",
    "../outside.moc3",
    "asset.txt",
  ]) {
    assert.equal(serialized.includes(fragment), false);
  }
}
