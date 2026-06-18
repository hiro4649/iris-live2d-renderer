import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { BROWSER_BOOTSTRAP_CONFIG_MAX_BYTES } from "../src/renderer/browserBootstrapConfig.js";

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function getJsonText(path) {
  const server = createLive2dRendererServer();
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`);
    const text = await response.text();
    return {
      status: response.status,
      body: text ? JSON.parse(text) : {},
      bytes: Buffer.byteLength(text, "utf8"),
    };
  } finally {
    await closeServer(server);
  }
}

const bootstrap = await getJsonText("/renderer/browser-bootstrap-config");
assert.equal(bootstrap.status, 200);
assert.equal(bootstrap.body.ok, true);
assert.equal(bootstrap.body.schema, "iris_live2d_browser_bootstrap_config_v1");
assert.equal(bootstrap.body.safeSummaryOnly, true);
assert.equal(bootstrap.bytes <= BROWSER_BOOTSTRAP_CONFIG_MAX_BYTES, true);

for (const field of [
  "raw_model_path",
  "raw_sdk_path",
  "endpoint",
  "token",
  "secret",
  "private_path",
  "planning",
  "ledger",
  "review_packet",
  "blocker_matrix",
]) {
  assert.equal(JSON.stringify(bootstrap.body).toLowerCase().includes(field), false);
}

for (const key of [
  "model",
  "scene",
  "cubismSdkStatus",
  "modelManifestStatus",
  "modelAssetRouteAvailable",
  "loaderSelectionStatus",
  "trustedLoaderAllowlistEnabled",
  "realModelLoadSupported",
  "cueDeliveryModes",
  "heartbeatIntervalMs",
  "compactSafeSummary",
  "browserSmokeMode",
]) {
  assert.equal(Object.hasOwn(bootstrap.body, key), true);
}

assert.equal(bootstrap.body.trustedLoaderAllowlistEnabled, false);
assert.equal(bootstrap.body.realModelLoadSupported, false);
assert.equal(bootstrap.body.compactSafeSummary.runtimeReadinessClaimed, false);
assert.equal(bootstrap.body.compactSafeSummary.productionReadinessClaimed, false);
assert.equal(bootstrap.body.compactSafeSummary.checkedRowCount, 0);
assert.equal(bootstrap.body.compactSafeSummary.motionDatasetExecutable, false);

const unknownQuery = await getJsonText("/renderer/browser-bootstrap-config?raw=1");
assert.equal(unknownQuery.status, 404);
assert.equal(unknownQuery.body.ok, false);

const rendererJs = await readFile("public/renderer.js", "utf8");
assert.equal(rendererJs.includes("/renderer/browser-bootstrap-config"), true);
assert.equal(rendererJs.includes("setInterval(refreshStatus"), false);
assert.equal(rendererJs.includes("visibilitychange"), true);
assert.equal(rendererJs.includes("BROWSER_BOOTSTRAP_REFRESH_MIN_INTERVAL_MS = 30_000"), true);
assert.equal(rendererJs.includes("summary=compact"), true);

console.log("browser-bootstrap-config: pass");
