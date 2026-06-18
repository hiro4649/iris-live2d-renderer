import assert from "node:assert/strict";
import {
  confirmVisualCueApplication,
  createHeartbeatPayload,
  createInitialRendererState,
  flushPendingCues,
} from "../public/renderer.js";
import { createHeartbeatStatus } from "../src/renderer/heartbeat.js";

const HASH_A = "a".repeat(64);
const HASH_B = "b".repeat(64);

function readyState() {
  return {
    ...createInitialRendererState(),
    modelId: "model",
    sceneId: "scene",
    cubismRuntimeLoaded: true,
    model3Loaded: true,
    sceneLoaded: true,
    realModelLoadSupported: true,
    modelLoadSupported: true,
    modelLoadSucceeded: true,
    modelLoadStatus: "loaded",
    pendingCues: [{ status_hash: HASH_A }],
  };
}

const queued = createInitialRendererState();
queued.pendingCues.push({ status_hash: HASH_A });
const queuedResult = flushPendingCues(queued, () => 1000);
assert.equal(queuedResult.accepted_count, 0);
assert.equal(queuedResult.pending_cue_count, 1);
assert.equal(queued.lastCueApplyStatus, "queued_until_ready");

const accepted = readyState();
const acceptedResult = flushPendingCues(accepted, () => 2000);
assert.equal(acceptedResult.accepted_count, 1);
assert.equal(acceptedResult.accepted_cues[0].status_hash, HASH_A);
assert.equal(accepted.lastAcceptedCueStatusHash, HASH_A);
assert.equal(accepted.lastCueAcceptedAt, 2000);
assert.equal(accepted.lastCueAcceptanceStatus, "accepted_for_application");
assert.equal(accepted.lastAppliedCueStatusHash, "");
assert.equal(accepted.lastCueAppliedAt, null);
assert.equal(accepted.lastCueApplyStatus, "not_confirmed");
assert.equal(accepted.lastVisualApplicationStatus, "not_confirmed");

const heartbeatBeforeConfirmation = createHeartbeatPayload(accepted, 2500);
const statusBeforeConfirmation = createHeartbeatStatus({
  heartbeat: heartbeatBeforeConfirmation,
  nowMs: 2500,
  maxAgeMs: 5000,
  expectedModelId: "model",
  expectedSceneId: "scene",
  cubismSdkAvailable: true,
  model3ManifestAvailable: true,
  realModelLoadSupported: true,
  lastDeliveredCueStatusHash: HASH_A,
});
assert.equal(statusBeforeConfirmation.last_cue_applied, false);
assert.equal(statusBeforeConfirmation.renderer_ready_candidate, false);
assert.equal(statusBeforeConfirmation.last_cue_acceptance_status, "accepted_for_application");
assert.equal(statusBeforeConfirmation.last_visual_application_status, "not_confirmed");

assert.equal(confirmVisualCueApplication(accepted, {
  statusHash: HASH_B,
  appliedAtMs: 3000,
  renderFrameSequence: 1,
  adapterReceiptStatus: "visual_application_confirmed",
}).ok, false);

assert.equal(confirmVisualCueApplication(accepted, {
  statusHash: HASH_A,
  appliedAtMs: 1500,
  renderFrameSequence: 1,
  adapterReceiptStatus: "visual_application_confirmed",
}).ok, false);

assert.equal(confirmVisualCueApplication(accepted, {
  statusHash: HASH_A,
  appliedAtMs: 3000,
  renderFrameSequence: 0,
  adapterReceiptStatus: "visual_application_confirmed",
}).ok, false);

assert.equal(confirmVisualCueApplication(accepted, {
  statusHash: HASH_A,
  appliedAtMs: 3000,
  renderFrameSequence: 1,
  adapterReceiptStatus: null,
}).ok, false);

const confirmed = confirmVisualCueApplication(accepted, {
  statusHash: HASH_A,
  appliedAtMs: 3000,
  renderFrameSequence: 1,
  adapterReceiptStatus: "visual_application_confirmed",
});
assert.equal(confirmed.ok, true);
assert.equal(accepted.lastAppliedCueStatusHash, HASH_A);
assert.equal(accepted.lastCueAppliedAt, 3000);
assert.equal(accepted.lastCueApplyStatus, "applied");
assert.equal(accepted.lastVisualApplicationStatus, "visual_application_confirmed");
assert.equal(accepted.lastVisualApplicationFrameSequence, 1);

assert.equal(confirmVisualCueApplication(accepted, {
  statusHash: HASH_A,
  appliedAtMs: 3001,
  renderFrameSequence: 2,
  adapterReceiptStatus: "visual_application_confirmed",
}).ok, false);

const heartbeatAfterConfirmation = createHeartbeatPayload(accepted, 3500);
const statusAfterConfirmation = createHeartbeatStatus({
  heartbeat: heartbeatAfterConfirmation,
  nowMs: 3500,
  maxAgeMs: 5000,
  expectedModelId: "model",
  expectedSceneId: "scene",
  cubismSdkAvailable: true,
  model3ManifestAvailable: true,
  realModelLoadSupported: true,
  lastDeliveredCueStatusHash: HASH_A,
});
assert.equal(statusAfterConfirmation.last_cue_applied, true);
assert.equal(statusAfterConfirmation.last_visual_application_status, "visual_application_confirmed");
assert.equal(statusAfterConfirmation.last_visual_application_frame_sequence, 1);

const noModelScene = readyState();
noModelScene.model3Loaded = false;
noModelScene.sceneLoaded = false;
flushPendingCues(noModelScene, () => 4000);
const noModelSceneHeartbeat = createHeartbeatPayload(noModelScene, 4500);
const noModelSceneStatus = createHeartbeatStatus({
  heartbeat: noModelSceneHeartbeat,
  nowMs: 4500,
  maxAgeMs: 5000,
  expectedModelId: "model",
  expectedSceneId: "scene",
  cubismSdkAvailable: true,
  model3ManifestAvailable: true,
  realModelLoadSupported: false,
  lastDeliveredCueStatusHash: HASH_A,
});
assert.equal(noModelSceneStatus.last_cue_applied, false);
assert.equal(noModelSceneStatus.renderer_ready_candidate, false);

console.log("cue-application-lifecycle: pass");
