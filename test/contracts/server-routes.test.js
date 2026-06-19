import assert from "node:assert/strict";
import { assertSafe } from "../helpers/safeContractAssertions.js";
import { createHttpTestServerTools } from "../helpers/httpTestServer.js";
import { createRendererState } from "../../src/state.js";

const { fetchJsonStatus, startHarness } = createHttpTestServerTools({ assertSafe });
const nowMs = 1_800_000_000_000;

const harness = await startHarness(createRendererState({
  modelId: "iris_default",
  sceneId: "main_scene",
  heartbeatMaxAgeMs: 2_000,
  now: () => nowMs,
}));

try {
  const status = await harness.getJson("/status");
  assert.equal(status.ok, true);
  assert.equal(status.renderer_ready, false);
  assertSafe(JSON.stringify(status));

  const runtimeConfig = await harness.getJson("/renderer/runtime-config");
  assert.equal(runtimeConfig.model3.available, false);
  assert.equal(runtimeConfig.model3.real_model_loaded, false);
  assertSafe(JSON.stringify(runtimeConfig));

  const missingModel3 = await fetchJsonStatus(`${harness.baseUrl}/renderer/model3`);
  assert.equal(missingModel3.status, 404);
  assert.equal(missingModel3.body.error_kind, "not_found");
  assertSafe(JSON.stringify(missingModel3.body));
} finally {
  await harness.close();
}

console.log("contract-server-routes: pass");
