import assert from "node:assert/strict";
import { createMinimalChildEnv, reserveLoopbackPort, waitForPortRelease, waitForRendererStartup } from "../src/renderer/localhostProcessController.js";

const env = createMinimalChildEnv({
  PATH: "safe-path",
  GH_TOKEN: "do-not-forward",
  HTTP_PROXY: "do-not-forward",
  NODE_OPTIONS: "--inspect",
  SystemRoot: "C:/Windows",
}, { port: 12345 });

assert.equal(env.IRIS_LIVE2D_RENDERER_HOST, "127.0.0.1");
assert.equal(env.IRIS_LIVE2D_RENDERER_PORT, "12345");
assert.equal(env.IRIS_LIVE2D_CUBISM_CORE_JS, "");
assert.equal(env.IRIS_LIVE2D_MODEL3_JSON, "");
assert.equal(env.IRIS_LOCAL_LIVE2D_MODEL_ID, "");
assert.equal(env.IRIS_LOCAL_LIVE2D_SCENE_ID, "");
assert.equal(env.GH_TOKEN, undefined);
assert.equal(env.HTTP_PROXY, undefined);
assert.equal(env.NODE_OPTIONS, undefined);
assert.equal(env.NO_PROXY, "127.0.0.1");
assert.equal(env.IRIS_LIVE2D_R2_PROBE_SURFACE_ENABLED, undefined);

const probeEnv = createMinimalChildEnv({}, { port: 12345, r2ProbeSurfaceEnabled: true });
assert.equal(probeEnv.IRIS_LIVE2D_R2_PROBE_SURFACE_ENABLED, "1");

let attempts = 0;
const ready = await waitForRendererStartup({
  attempts: 3,
  intervalMs: 1,
  probe: async () => {
    attempts += 1;
    return attempts === 2;
  },
});
assert.equal(ready, true);

const notReady = await waitForRendererStartup({
  attempts: 2,
  intervalMs: 1,
  probe: async () => false,
});
assert.equal(notReady, false);

const port = await reserveLoopbackPort();
assert.equal(Number.isInteger(port), true);
assert.equal(await waitForPortRelease({ port, retries: 2, intervalMs: 1 }), true);

console.log("localhost-process-controller: pass");
