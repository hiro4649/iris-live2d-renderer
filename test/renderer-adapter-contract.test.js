import assert from "node:assert/strict";
import {
  RENDERER_ADAPTER_SCHEMA,
  assertRendererAdapterResult,
  assertRendererAdapterShape,
  createAdapterResult,
  createNullRendererAdapter,
} from "../src/renderer/rendererAdapterContract.js";

const adapter = createNullRendererAdapter();
assertRendererAdapterShape(adapter);

const capabilities = adapter.getCapabilities();
assert.equal(capabilities.schema, RENDERER_ADAPTER_SCHEMA);
assert.equal(capabilities.rendererReady, false);
assert.equal(capabilities.modelLoadSupported, false);
assert.equal(capabilities.cueApplicationSupported, false);
assert.equal(capabilities.visualApplicationSupported, false);
assert.equal(capabilities.renderLoopSupported, false);
assert.equal(capabilities.safeSummaryOnly, true);

assert.equal(adapter.initialize().status, "initialized_without_runtime");
assert.equal(adapter.loadModel().status, "not_supported");
assert.equal(adapter.applyCue({ status_hash: "safe_status_hash" }).status, "not_supported");
assert.equal(adapter.update().status, "not_supported");
assert.equal(adapter.render().status, "not_supported");
assert.equal(adapter.dispose().status, "disposed");
assert.equal(adapter.dispose().status, "disposed");

const confirmed = createAdapterResult({
  status: "visual_application_confirmed",
  failureLabel: "none",
  visualApplicationConfirmed: true,
  renderFrameSequence: 1,
});
assert.equal(confirmed.schema, RENDERER_ADAPTER_SCHEMA);
assert.equal(confirmed.visualApplicationConfirmed, true);
assert.equal(confirmed.renderFrameSequence, 1);
assert.equal(Object.isFrozen(confirmed), true);

assert.throws(() => assertRendererAdapterShape({ initialize() {} }), /missing/);
assert.throws(() => assertRendererAdapterResult({ schema: RENDERER_ADAPTER_SCHEMA, status: "unknown" }), /status/);
assert.throws(() => assertRendererAdapterResult({
  schema: RENDERER_ADAPTER_SCHEMA,
  status: "visual_application_confirmed",
  failureLabel: "none",
  visualApplicationConfirmed: true,
  renderFrameSequence: null,
  safeSummaryOnly: true,
}), /frame/);
assert.throws(() => assertRendererAdapterResult({
  schema: RENDERER_ADAPTER_SCHEMA,
  status: "blocked",
  failureLabel: "none",
  visualApplicationConfirmed: false,
  renderFrameSequence: null,
  safeSummaryOnly: true,
  constructor: "unsafe",
}), /unsafe/);

console.log("renderer-adapter-contract: pass");
