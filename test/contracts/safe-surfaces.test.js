import assert from "node:assert/strict";
import { assertSafe } from "../helpers/safeContractAssertions.js";
import { assertSafeSurfaceProjectionMatrix } from "../helpers/safeSurfaceProjectionMatrixAssertions.js";
import { createRendererState } from "../../src/state.js";
import {
  buildRegisteredSafeSummaryMap,
  validateProjectedSafeSummaries,
} from "../../src/renderer/safeSurfaceProjection.js";

assertSafeSurfaceProjectionMatrix();

const state = createRendererState();
const status = state.status();
const health = state.health();
const runtimeConfig = state.browserRuntimeConfig();

assert.equal(status.live2d_safe_summary_v2.schema, "iris_live2d_safe_summary_v2");
assert.equal(health.live2d_safe_summary_v2.schema, "iris_live2d_safe_summary_v2");
assert.equal(runtimeConfig.live2d_safe_summary_v2.schema, "iris_live2d_safe_summary_v2");

assert.equal(validateProjectedSafeSummaries(status.renderer_health).status, "pass");
assert.equal(validateProjectedSafeSummaries(health).status, "pass");
assert.equal(validateProjectedSafeSummaries(runtimeConfig).status, "pass");

const projected = buildRegisteredSafeSummaryMap();
assert.equal(projected.status, "pass");
assert.equal(Object.keys(projected.summaries).length > 0, true);

for (const surface of [status, health, runtimeConfig, projected.summaries]) {
  assertSafe(JSON.stringify(surface));
}

console.log("contract-safe-surfaces: pass");
