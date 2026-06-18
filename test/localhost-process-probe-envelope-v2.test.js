import assert from "node:assert/strict";
import {
  LIVE2D_R2_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA,
  buildLocalhostProcessProbeEnvelopeV2,
  summarizeLocalhostProbeBodyV2,
} from "../src/renderer/localhostProcessProbeEnvelopeV2.js";
import { createRendererState } from "../src/state.js";

function compact(overrides = {}) {
  return {
    schema: "iris_live2d_safe_summary_v2",
    overallStatus: "blocked",
    priority1Status: "BLOCKED",
    checkedRowCount: 0,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    trustedLoaderAllowlistEnabled: false,
    actualIngestionAllowed: false,
    motionDatasetExecutable: false,
    ...overrides,
  };
}

function bodyFor(routeLabel, overrides = {}) {
  const common = {
    ok: true,
    live2d_safe_summary_v2: compact(),
    endpoint: "http://127.0.0.1/private",
    token: "secret-token",
    raw_payload: "raw body",
    private_path: "C:/private/path",
  };
  if (routeLabel === "health") {
    return {
      ...common,
      schema: "iris_live2d_renderer_health_v1",
      renderer_process_alive: true,
      renderer_ready: false,
      trusted_loader_ready_candidate: false,
      ...overrides,
    };
  }
  if (routeLabel === "status") {
    return {
      ...common,
      schema: "iris_live2d_renderer_status_v1",
      renderer_ready: false,
      renderer_health: {
        model_loaded: false,
        scene_loaded: false,
        browser_cue_delivery_ready: false,
        trusted_loader_ready_candidate: false,
      },
      ...overrides,
    };
  }
  return {
    ...common,
    schema: "iris_live2d_browser_runtime_config_v1",
    ...overrides,
  };
}

function routeResults(overrides = {}) {
  return [
    { routeLabel: "health", httpStatus: 200, ok: true, body: bodyFor("health", overrides.health) },
    { routeLabel: "status", httpStatus: 200, ok: true, body: bodyFor("status", overrides.status) },
    {
      routeLabel: "runtime_config",
      httpStatus: 200,
      ok: true,
      body: bodyFor("runtime_config", overrides.runtime_config),
    },
  ];
}

function passEnvelope(overrides = {}) {
  return buildLocalhostProcessProbeEnvelopeV2({
    routeResults: routeResults(overrides),
    processStarted: true,
    processStopped: true,
    portReleased: true,
    hostLabel: "loopback",
  });
}

const safe = passEnvelope();
assert.equal(safe.schema, LIVE2D_R2_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA);
assert.equal(safe.probeStatus, "pass");
assert.equal(safe.routeSetStatus, "pass");
assert.equal(safe.schemaParityStatus, "pass");
assert.equal(safe.requiredFieldPresenceStatus, "pass");
assert.equal(safe.criticalBoundaryStatus, "pass");
assert.equal(safe.crossSurfaceParityStatus, "pass");
assert.equal(safe.processStarted, true);
assert.equal(safe.processStopped, true);
assert.equal(safe.portReleased, true);
assert.equal(safe.rawResponseStored, false);
assert.equal(safe.rawResponsePrinted, false);
assert.equal(safe.externalNetworkUsed, false);
assert.equal(safe.browserStarted, false);
assert.equal(safe.sdkExecuted, false);
assert.equal(safe.modelLoadAttempted, false);
assert.equal(safe.sceneLoadAttempted, false);
assert.equal(safe.cueApplicationAttempted, false);
assert.equal(safe.browserHeartbeatInjected, false);
assert.equal(safe.ownerConfirmationCreated, false);
assert.equal(safe.runtimeReadinessClaimed, false);
assert.equal(safe.productionReadinessClaimed, false);
assert.equal(safe.priority1Resolved, false);
assert.equal(safe.checkedRowCountIncreased, false);
assert.equal(safe.motionDatasetExecutable, false);
assert.deepEqual(safe.failureLabels, []);

const serialized = JSON.stringify(safe);
assert.equal(serialized.includes("secret-token"), false);
assert.equal(serialized.includes("raw body"), false);
assert.equal(serialized.includes("C:/private/path"), false);
assert.equal(serialized.includes("http://127.0.0.1/private"), false);

const missingFieldSummary = summarizeLocalhostProbeBodyV2("status", {
  ...bodyFor("status"),
  renderer_health: {
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    trusted_loader_ready_candidate: false,
  },
});
assert.equal(missingFieldSummary.criticalBoundaryStatus, "blocked");
assert.equal(missingFieldSummary.failureLabels.includes("required_field_missing"), true);

const wrongType = passEnvelope({ status: { renderer_health: { model_loaded: "false" } } });
assert.equal(wrongType.probeStatus, "blocked");
assert.equal(wrongType.failureLabels.includes("required_field_wrong_type"), true);

const wrongSchema = passEnvelope({ health: { schema: "wrong_schema" } });
assert.equal(wrongSchema.probeStatus, "blocked");
assert.equal(wrongSchema.failureLabels.includes("schema_mismatch"), true);

const missingRoute = buildLocalhostProcessProbeEnvelopeV2({
  routeResults: routeResults().slice(0, 2),
  processStarted: true,
  processStopped: true,
  portReleased: true,
  hostLabel: "loopback",
});
assert.equal(missingRoute.probeStatus, "blocked");
assert.equal(missingRoute.failureLabels.includes("route_missing"), true);

const duplicateRoute = buildLocalhostProcessProbeEnvelopeV2({
  routeResults: [routeResults()[0], routeResults()[0], routeResults()[1], routeResults()[2]],
  processStarted: true,
  processStopped: true,
  portReleased: true,
  hostLabel: "loopback",
});
assert.equal(duplicateRoute.probeStatus, "blocked");
assert.equal(duplicateRoute.failureLabels.includes("route_duplicate"), true);
assert.equal(duplicateRoute.failureLabels.includes("route_extra"), true);

const unknownRoute = buildLocalhostProcessProbeEnvelopeV2({
  routeResults: [...routeResults(), { routeLabel: "other", httpStatus: 200, ok: true, body: {} }],
  processStarted: true,
  processStopped: true,
  portReleased: true,
  hostLabel: "loopback",
});
assert.equal(unknownRoute.probeStatus, "blocked");
assert.equal(unknownRoute.failureLabels.includes("route_unknown"), true);

const http500 = buildLocalhostProcessProbeEnvelopeV2({
  routeResults: [
    { routeLabel: "health", httpStatus: 500, ok: false, body: bodyFor("health") },
    ...routeResults().slice(1),
  ],
  processStarted: true,
  processStopped: true,
  portReleased: true,
  hostLabel: "loopback",
});
assert.equal(http500.probeStatus, "blocked");
assert.equal(http500.failureLabels.includes("http_not_success"), true);

for (const [name, override, expectedLabel] of [
  ["renderer", { health: { renderer_ready: true } }, "renderer_ready_unexpected"],
  ["model", { status: { renderer_health: { model_loaded: true } } }, "model_loaded_unexpected"],
  ["scene", { status: { renderer_health: { scene_loaded: true } } }, "scene_loaded_unexpected"],
  [
    "cue",
    { status: { renderer_health: { browser_cue_delivery_ready: true } } },
    "browser_cue_delivery_ready_unexpected",
  ],
  [
    "runtime",
    { runtime_config: { live2d_safe_summary_v2: compact({ runtimeReadinessClaimed: true }) } },
    "runtime_readiness_claimed_unexpected",
  ],
  [
    "production",
    { runtime_config: { live2d_safe_summary_v2: compact({ productionReadinessClaimed: true }) } },
    "production_readiness_claimed_unexpected",
  ],
  [
    "owner created",
    { runtime_config: { live2d_safe_summary_v2: compact({ ownerConfirmationCreated: true }) } },
    "owner_confirmation_created_unexpected",
  ],
  [
    "owner confirmed",
    { runtime_config: { live2d_safe_summary_v2: compact({ ownerConfirmationConfirmed: true }) } },
    "owner_confirmation_confirmed_unexpected",
  ],
  [
    "actual ingestion",
    { runtime_config: { live2d_safe_summary_v2: compact({ actualIngestionAllowed: true }) } },
    "actual_ingestion_allowed_unexpected",
  ],
  [
    "trusted",
    { runtime_config: { live2d_safe_summary_v2: compact({ trustedLoaderAllowlistEnabled: true }) } },
    "trusted_loader_allowlist_enabled_unexpected",
  ],
  [
    "priority",
    { runtime_config: { live2d_safe_summary_v2: compact({ priority1Status: "READY" }) } },
    "priority1_not_blocked",
  ],
  [
    "checked",
    { runtime_config: { live2d_safe_summary_v2: compact({ checkedRowCount: 1 }) } },
    "checked_row_count_not_zero",
  ],
  [
    "motion",
    { runtime_config: { live2d_safe_summary_v2: compact({ motionDatasetExecutable: true }) } },
    "motion_dataset_executable_unexpected",
  ],
  [
    "compact",
    { runtime_config: { live2d_safe_summary_v2: compact({ overallStatus: "candidate_only" }) } },
    "compact_summary_not_blocked",
  ],
]) {
  const envelope = passEnvelope(override);
  assert.equal(envelope.probeStatus, "blocked", name);
  assert.equal(envelope.failureLabels.includes(expectedLabel), true, name);
}

const compactMissing = passEnvelope({ runtime_config: { live2d_safe_summary_v2: undefined } });
assert.equal(compactMissing.probeStatus, "blocked");
assert.equal(compactMissing.failureLabels.includes("compact_summary_missing"), true);

const crossSurface = passEnvelope({ health: { live2d_safe_summary_v2: compact({ checkedRowCount: 1 }) } });
assert.equal(crossSurface.probeStatus, "blocked");
assert.equal(crossSurface.failureLabels.includes("checked_row_count_not_zero"), true);

for (const processCase of [
  { processStarted: false, label: "process_not_started" },
  { processStopped: false, label: "process_not_stopped" },
  { portReleased: false, label: "port_not_released" },
  { hostLabel: "external", label: "host_not_loopback" },
]) {
  const envelope = buildLocalhostProcessProbeEnvelopeV2({
    routeResults: routeResults(),
    processStarted: processCase.processStarted ?? true,
    processStopped: processCase.processStopped ?? true,
    portReleased: processCase.portReleased ?? true,
    hostLabel: processCase.hostLabel ?? "loopback",
  });
  assert.equal(envelope.probeStatus, "blocked");
  assert.equal(envelope.failureLabels.includes(processCase.label), true);
}

const invalid = summarizeLocalhostProbeBodyV2("health", []);
assert.equal(invalid.failureLabels.includes("response_not_json_object"), true);

const state = createRendererState();
const actualShapeEnvelope = buildLocalhostProcessProbeEnvelopeV2({
  routeResults: [
    { routeLabel: "health", httpStatus: 200, ok: true, body: state.health() },
    { routeLabel: "status", httpStatus: 200, ok: true, body: state.status() },
    { routeLabel: "runtime_config", httpStatus: 200, ok: true, body: state.browserRuntimeConfig() },
  ],
  processStarted: true,
  processStopped: true,
  portReleased: true,
  hostLabel: "loopback",
});
assert.equal(actualShapeEnvelope.probeStatus, "pass");
assert.equal(actualShapeEnvelope.routeSetStatus, "pass");
assert.equal(actualShapeEnvelope.requiredFieldPresenceStatus, "pass");
assert.equal(actualShapeEnvelope.criticalBoundaryStatus, "pass");
assert.equal(actualShapeEnvelope.crossSurfaceParityStatus, "pass");

console.log("localhost-process-probe-envelope-v2: pass");
