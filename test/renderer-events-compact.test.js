import assert from "node:assert/strict";
import { request } from "node:http";
import { createLive2dRendererServer, listen } from "../src/server.js";

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function readFirstEvent(path) {
  const server = createLive2dRendererServer();
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    return await new Promise((resolve, reject) => {
      const req = request({
        host: "127.0.0.1",
        port: address.port,
        path,
        method: "GET",
        headers: { host: `127.0.0.1:${address.port}` },
      }, (res) => {
        let text = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          text += chunk;
          const match = text.match(/event: ([^\n]+)\ndata: ([^\n]+)\n\n/u);
          if (!match) return;
          req.destroy();
          resolve({
            statusCode: res.statusCode,
            event: match[1],
            data: JSON.parse(match[2]),
          });
        });
      });
      req.on("error", reject);
      req.end();
    });
  } finally {
    await closeServer(server);
  }
}

async function getJson(path) {
  const server = createLive2dRendererServer();
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`);
    return {
      status: response.status,
      body: await response.json(),
    };
  } finally {
    await closeServer(server);
  }
}

const compact = await readFirstEvent("/renderer/events?summary=compact");
assert.equal(compact.statusCode, 200);
assert.equal(compact.event, "renderer_status");
assert.equal(compact.data.schema, "iris_live2d_renderer_event_compact_status_v1");
assert.equal(Object.hasOwn(compact.data, "compactSafeSummary"), true);
assert.equal(compact.data.safeSummaryOnly, true);
assert.equal(compact.data.compactSafeSummary.runtimeReadinessClaimed, false);
assert.equal(compact.data.compactSafeSummary.productionReadinessClaimed, false);

const legacy = await readFirstEvent("/renderer/events");
assert.equal(legacy.statusCode, 200);
assert.equal(legacy.event, "renderer_status");
assert.equal(legacy.data.schema, "iris_live2d_renderer_status_v1");

const unknown = await getJson("/renderer/events?summary=raw");
assert.equal(unknown.status, 404);
assert.equal(unknown.body.ok, false);

console.log("renderer-events-compact: pass");
