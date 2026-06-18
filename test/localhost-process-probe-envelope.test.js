import assert from "node:assert/strict";
import {
  LIVE2D_R1_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA,
  buildLocalhostProcessProbeEnvelope,
  summarizeLocalhostProbeBody,
} from "../src/renderer/localhostProcessProbeEnvelope.js";

const unsafeBody = {
  renderer_ready: false,
  model_loaded: false,
  scene_loaded: false,
  browser_cue_delivery_ready: false,
  runtime_readiness_claimed: false,
  production_readiness_claimed: false,
  owner_confirmation_created: false,
  owner_confirmation_confirmed: false,
  actual_ingestion_allowed: false,
  trusted_loader_enabled: false,
  trusted_loader_allowlist_enabled: false,
  priority1_status: "BLOCKED",
  checked_row_count: 0,
  motion_dataset_executable: false,
  live2d_safe_summary_v2: {
    overallStatus: "blocked",
    boundaryState: {
      runtimeReadinessClaimed: false,
    },
  },
  endpoint: "http://127.0.0.1:9999/private",
  token: "secret-token",
  raw_payload: "raw body",
  private_path: "C:/private/path",
};

const summary = summarizeLocalhostProbeBody("status", unsafeBody);
assert.equal(summary.routeLabel, "status");
assert.equal(summary.responseShape, "json_object");
assert.equal(summary.rendererReady, false);
assert.equal(summary.runtimeReadinessClaimed, false);
assert.equal(summary.productionReadinessClaimed, false);
assert.equal(summary.ownerConfirmationCreated, false);
assert.equal(summary.actualIngestionAllowed, false);
assert.equal(summary.trustedLoaderEnabled, false);
assert.equal(summary.priority1Status, "BLOCKED");
assert.equal(summary.checkedRowCountZero, true);
assert.equal(summary.motionDatasetExecutable, false);
assert.equal(summary.compactSafeSummaryV2Present, true);
assert.equal(summary.compactSafeSummaryV2OverallStatus, "blocked");
assert.equal(summary.safeSummaryOnly, true);

const envelope = buildLocalhostProcessProbeEnvelope({
  processStarted: true,
  processStopped: true,
  routeResults: [
    { routeLabel: "health", httpStatus: 200, ok: true, body: unsafeBody },
    { routeLabel: "status", httpStatus: 200, ok: true, body: unsafeBody },
    { routeLabel: "runtime_config", httpStatus: 200, ok: true, body: unsafeBody },
  ],
});

assert.equal(envelope.schema, LIVE2D_R1_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA);
assert.equal(envelope.probeStatus, "pass");
assert.equal(envelope.hostLabel, "loopback");
assert.deepEqual(envelope.routeLabels, ["health", "status", "runtime_config"]);
assert.equal(envelope.processStarted, true);
assert.equal(envelope.processStopped, true);
assert.equal(envelope.rawResponseStored, false);
assert.equal(envelope.rawResponsePrinted, false);
assert.equal(envelope.externalNetworkUsed, false);
assert.equal(envelope.browserStarted, false);
assert.equal(envelope.sdkExecuted, false);
assert.equal(envelope.modelLoadAttempted, false);
assert.equal(envelope.sceneLoadAttempted, false);
assert.equal(envelope.cueApplicationAttempted, false);
assert.equal(envelope.browserHeartbeatInjected, false);
assert.equal(envelope.trustedLoaderEnabled, false);
assert.equal(envelope.actualDataHandled, false);
assert.equal(envelope.fileBodyRead, false);
assert.equal(envelope.rowBodyRead, false);
assert.equal(envelope.hashCalculated, false);
assert.equal(envelope.parserExecuted, false);
assert.equal(envelope.redactionScanExecuted, false);
assert.equal(envelope.auditWritten, false);
assert.equal(envelope.ownerConfirmationCreated, false);
assert.equal(envelope.runtimeReadinessClaimed, false);
assert.equal(envelope.productionReadinessClaimed, false);
assert.equal(envelope.rendererReadyClaimed, false);
assert.equal(envelope.priority1Resolved, false);
assert.equal(envelope.checkedRowCountIncreased, false);
assert.equal(envelope.motionDatasetExecutable, false);
assert.equal(envelope.safeSummaryOnly, true);

const serialized = JSON.stringify(envelope);
assert.equal(serialized.includes("secret-token"), false);
assert.equal(serialized.includes("raw body"), false);
assert.equal(serialized.includes("C:/private/path"), false);
assert.equal(serialized.includes("http://127.0.0.1:9999/private"), false);

const blocked = buildLocalhostProcessProbeEnvelope({
  processStarted: true,
  processStopped: true,
  routeResults: [
    { routeLabel: "health", httpStatus: 200, ok: true, body: {} },
  ],
});
assert.equal(blocked.probeStatus, "blocked");

console.log("localhost-process-probe-envelope: pass");
