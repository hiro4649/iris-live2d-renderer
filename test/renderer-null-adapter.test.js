import assert from "node:assert/strict";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";
import {
  createHeartbeatPayload,
  createInitialRendererState,
  flushPendingCues,
  maybeConfirmVisualCueApplication,
} from "../public/renderer.js";
import { createNullRendererAdapter } from "../public/rendererAdapter.js";

const HASH_A = "adapter_safe_hash_a";

function readyState(adapter = createNullRendererAdapter()) {
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
    rendererAdapter: adapter,
    pendingCues: [{ status_hash: HASH_A }],
  };
}

const nullState = readyState();
const nullResult = flushPendingCues(nullState, () => 1000);
assert.equal(nullResult.accepted_count, 1);
assert.equal(nullResult.accepted_cues[0].acceptance_status, "accepted_for_application");
assert.equal(nullResult.accepted_cues[0].adapter_status, "not_supported");
assert.equal(nullResult.accepted_cues[0].visual_application_confirmed, false);
assert.equal(nullState.lastAcceptedCueStatusHash, HASH_A);
assert.equal(nullState.lastAppliedCueStatusHash, "");
assert.equal(nullState.lastVisualApplicationStatus, "not_confirmed");
assert.equal(nullState.lastAdapterStatus, "not_supported");

const syntheticAdapter = {
  getCapabilities() {
    return { safeSummaryOnly: true };
  },
  initialize() {
    return {
      schema: "iris_live2d_renderer_adapter_v1",
      status: "initialized_without_runtime",
      failureLabel: "synthetic_test_only",
      visualApplicationConfirmed: false,
      renderFrameSequence: null,
      safeSummaryOnly: true,
    };
  },
  loadModel() {
    return this.initialize();
  },
  applyCue() {
    return {
      schema: "iris_live2d_renderer_adapter_v1",
      status: "cue_accepted",
      failureLabel: "none",
      visualApplicationConfirmed: false,
      renderFrameSequence: null,
      safeSummaryOnly: true,
    };
  },
  update() {
    return this.applyCue();
  },
  render() {
    return {
      schema: "iris_live2d_renderer_adapter_v1",
      status: "visual_application_confirmed",
      failureLabel: "none",
      visualApplicationConfirmed: true,
      renderFrameSequence: 1,
      safeSummaryOnly: true,
    };
  },
  dispose() {
    return {
      schema: "iris_live2d_renderer_adapter_v1",
      status: "disposed",
      failureLabel: "none",
      visualApplicationConfirmed: false,
      renderFrameSequence: null,
      safeSummaryOnly: true,
    };
  },
};

const syntheticState = readyState(syntheticAdapter);
const syntheticResult = flushPendingCues(syntheticState, () => 2000);
assert.equal(syntheticResult.accepted_cues[0].adapter_status, "visual_application_confirmed");
assert.equal(syntheticResult.accepted_cues[0].visual_application_confirmed, true);
assert.equal(syntheticState.lastAppliedCueStatusHash, HASH_A);
assert.equal(syntheticState.lastCueAppliedAt, 2000);
assert.equal(syntheticState.lastVisualApplicationStatus, "visual_application_confirmed");
assert.equal(syntheticState.lastVisualApplicationFrameSequence, 1);

const unsafeConfirmation = maybeConfirmVisualCueApplication(syntheticState, {
  schema: "iris_live2d_renderer_adapter_v1",
  status: "visual_application_confirmed",
  failureLabel: "none",
  visualApplicationConfirmed: true,
  renderFrameSequence: 1,
  safeSummaryOnly: true,
}, 2001);
assert.equal(unsafeConfirmation.ok, false);

const heartbeat = createHeartbeatPayload(nullState, 1500);
assert.equal(heartbeat.last_adapter_status, "not_supported");
assert.equal(heartbeat.last_visual_application_status, "not_confirmed");
assert.equal(heartbeat.last_applied_cue_status_hash, "");

const server = createLive2dRendererServer({ state: createRendererState() });
const address = await listen(server, { host: "127.0.0.1", port: 0 });
try {
  const response = await fetch(`http://127.0.0.1:${address.port}/renderer-adapter.js`);
  const body = await response.text();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") || "", /application\/javascript/);
  assert.match(body, /createNullRendererAdapter/);
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log("renderer-null-adapter: pass");
