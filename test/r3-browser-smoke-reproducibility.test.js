import assert from "node:assert/strict";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function runSmokeOnce() {
  const server = createLive2dRendererServer({
    state: createRendererState(),
    browserSmokeMode: true,
  });
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    const baseUrl = `http://127.0.0.1:${address.port}`;
    const [root, renderer, adapter, lifecycle, bootstrapResponse] = await Promise.all([
      fetch(`${baseUrl}/`),
      fetch(`${baseUrl}/renderer.js`),
      fetch(`${baseUrl}/rendererAdapter.js`),
      fetch(`${baseUrl}/rendererCueLifecycle.js`),
      fetch(`${baseUrl}/renderer/browser-bootstrap-config`),
    ]);
    const bootstrap = await bootstrapResponse.json();
    return {
      ok: true,
      schema: "iris_live2d_r3_browser_smoke_reproducibility_v1",
      root: root.status,
      renderer: renderer.status,
      adapter: adapter.status,
      lifecycle: lifecycle.status,
      bootstrap: bootstrap.browserSmokeMode === true ? "pass" : "blocked",
      runtimeReadinessClaimed: bootstrap.compactSafeSummary.runtimeReadinessClaimed,
      productionReadinessClaimed: bootstrap.compactSafeSummary.productionReadinessClaimed,
      safeSummaryOnly: true,
    };
  } finally {
    await closeServer(server);
  }
}

const runs = [];
for (let index = 0; index < 5; index += 1) {
  runs.push(await runSmokeOnce());
}

for (const run of runs) {
  assert.equal(run.root, 200);
  assert.equal(run.renderer, 200);
  assert.equal(run.adapter, 200);
  assert.equal(run.lifecycle, 200);
  assert.equal(run.bootstrap, "pass");
  assert.equal(run.runtimeReadinessClaimed, false);
  assert.equal(run.productionReadinessClaimed, false);
}

console.log("r3-browser-smoke-reproducibility: pass");
