import assert from "node:assert/strict";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";
import { applyBrowserSmokeMarkers, createInitialRendererState } from "../public/renderer.js";

const SMOKE_SCHEMA = "iris_live2d_r3_browser_smoke_v1";
const REQUIRED_ALLOWED_PATHS = [
  "/",
  "/renderer.js",
  "/rendererAdapter.js",
  "/rendererCueLifecycle.js",
  "/renderer/browser-bootstrap-config",
];
const FORBIDDEN_PATHS = [
  "/renderer/events",
  "/renderer/cues",
  "/renderer/heartbeat",
  "/renderer/cubism-core.js",
  "/renderer/model3",
  "/renderer/model-asset/asset_0000000000000000_moc",
  "/cue",
  "/live2d-engine",
  "/unknown",
];

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function withSmokeServer(fn) {
  const server = createLive2dRendererServer({
    state: createRendererState(),
    browserSmokeMode: true,
  });
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    return await fn(`http://127.0.0.1:${address.port}`);
  } finally {
    await closeServer(server);
  }
}

const envelope = await withSmokeServer(async (baseUrl) => {
  const ledger = [];
  for (const path of REQUIRED_ALLOWED_PATHS) {
    const response = await fetch(`${baseUrl}${path}`);
    ledger.push(labelForPath(path));
    assert.equal(response.status, 200);
    await response.text();
  }
  const bootstrap = await fetch(`${baseUrl}/renderer/browser-bootstrap-config`).then((response) => response.json());
  assert.equal(bootstrap.browserSmokeMode, true);
  assert.equal(bootstrap.trustedLoaderAllowlistEnabled, false);
  assert.equal(bootstrap.realModelLoadSupported, false);
  assert.equal(bootstrap.compactSafeSummary.runtimeReadinessClaimed, false);
  assert.equal(bootstrap.compactSafeSummary.productionReadinessClaimed, false);
  assert.equal(bootstrap.compactSafeSummary.ownerConfirmationCreated, false);
  assert.equal(bootstrap.compactSafeSummary.motionDatasetExecutable, false);
  return {
    ok: true,
    schema: SMOKE_SCHEMA,
    requestLedger: ledger,
    safeSummaryOnly: true,
  };
});

assert.deepEqual(envelope.requestLedger, [
  "root",
  "renderer_js",
  "renderer_adapter",
  "renderer_cue_lifecycle",
  "browser_bootstrap_config",
]);

for (const path of FORBIDDEN_PATHS) {
  const method = path === "/renderer/heartbeat" || path === "/cue" || path === "/live2d-engine" ? "POST" : "GET";
  await withSmokeServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}${path}`, method === "POST"
      ? { method, headers: { "content-type": "application/json" }, body: "{}" }
      : { method });
    assert.notEqual(response.status, 200);
  });
}

const fakeDoc = createFakeDocument();
const markerState = createInitialRendererState();
const markerResult = applyBrowserSmokeMarkers(markerState, {
  schema: "iris_live2d_browser_bootstrap_config_v1",
}, fakeDoc);
assert.equal(markerResult, true);
assert.equal(fakeDoc.documentElement.dataset.smokeSchema, SMOKE_SCHEMA);
assert.equal(fakeDoc.documentElement.dataset.smokeStatus, "pass");
assert.equal(fakeDoc.documentElement.dataset.jsExecuted, "true");
assert.equal(fakeDoc.documentElement.dataset.bootstrapStatus, "pass");
assert.equal(fakeDoc.documentElement.dataset.canvasPresent, "true");
assert.equal(fakeDoc.documentElement.dataset.adapterStatus, "null_blocked");
assert.equal(fakeDoc.documentElement.dataset.runtimeReadiness, "false");
assert.equal(fakeDoc.documentElement.dataset.productionReadiness, "false");
assert.equal(fakeDoc.documentElement.dataset.ownerConfirmation, "false");
assert.equal(fakeDoc.documentElement.dataset.trustedLoader, "disabled");
assert.equal(fakeDoc.documentElement.dataset.motionDataset, "non_executable");

function labelForPath(path) {
  return {
    "/": "root",
    "/renderer.js": "renderer_js",
    "/rendererAdapter.js": "renderer_adapter",
    "/rendererCueLifecycle.js": "renderer_cue_lifecycle",
    "/renderer/browser-bootstrap-config": "browser_bootstrap_config",
  }[path];
}

function createFakeDocument() {
  const documentElement = { dataset: {} };
  const root = { dataset: {} };
  const canvas = { dataset: {} };
  return {
    documentElement,
    body: root,
    querySelector(selector) {
      if (selector === "#live2d-root") return root;
      if (selector === "#live2d-surface") return canvas;
      if (selector === ".status") return { textContent: "" };
      return null;
    },
  };
}

console.log("r3-browser-smoke: pass");
