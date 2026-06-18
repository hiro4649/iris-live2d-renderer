import assert from "node:assert/strict";
import { createLive2dRendererServer, listen } from "../src/server.js";

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function getText(path) {
  const server = createLive2dRendererServer();
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`);
    return {
      status: response.status,
      text: await response.text(),
    };
  } finally {
    await closeServer(server);
  }
}

const legacy = await getText("/renderer/runtime-config");
assert.equal(legacy.status, 200);
const legacyBody = JSON.parse(legacy.text);
assert.equal(legacyBody.ok, true);
assert.equal(legacyBody.schema, "iris_live2d_browser_runtime_config_v1");
assert.equal(Object.hasOwn(legacyBody, "model_id"), true);
assert.equal(Object.hasOwn(legacyBody, "scene_id"), true);
assert.equal(Object.hasOwn(legacyBody, "live2d_safe_summary_v2"), true);
assert.equal(Object.hasOwn(legacyBody, "motion_dataset_real_row_intake_request_packet_summary"), true);
assert.equal(Buffer.byteLength(legacy.text, "utf8") > 16_384, true);

const bootstrap = await getText("/renderer/browser-bootstrap-config");
assert.equal(bootstrap.status, 200);
const bootstrapBody = JSON.parse(bootstrap.text);
assert.equal(bootstrapBody.schema, "iris_live2d_browser_bootstrap_config_v1");
assert.equal(Buffer.byteLength(bootstrap.text, "utf8") < 16_384, true);

console.log("browser-runtime-config-compatibility: pass");
