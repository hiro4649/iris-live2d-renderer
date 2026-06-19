import { assertSafe } from "../helpers/safeContractAssertions.js";
import { createHttpTestServerTools } from "../helpers/httpTestServer.js";
import { createRendererState } from "../../src/state.js";

const { assertCueRejected, startHarness } = createHttpTestServerTools({ assertSafe });
const nowMs = 1_800_000_000_000;

const harness = await startHarness(createRendererState({
  modelId: "iris_default",
  sceneId: "main_scene",
  heartbeatMaxAgeMs: 2_000,
  now: () => nowMs,
}));

try {
  await assertCueRejected(
    harness,
    {
      schema: "iris_live2d_renderer_cue_delivery_v1",
      cue: {
        schema: "iris_live2d_renderer_cue_v1",
        motion: { style: "talk" },
        raw_renderer_payload: "unsafe_fixture_value",
      },
    },
    "unsafe_cue_field",
    "raw_renderer_payload"
  );
} finally {
  await harness.close();
}

console.log("contract-cue-validation: pass");
