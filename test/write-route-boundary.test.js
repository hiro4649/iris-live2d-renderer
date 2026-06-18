import assert from "node:assert/strict";
import { request } from "node:http";
import { createLive2dRendererServer, listen } from "../src/server.js";
import {
  assertAllowedListenHost,
  evaluateWriteRequestBoundary,
} from "../src/renderer/writeRequestBoundary.js";

function mockRequest({
  path = "/cue",
  method = "POST",
  headers = { host: "127.0.0.1:9130", "content-type": "application/json" },
  remoteAddress = "127.0.0.1",
  localAddress = "127.0.0.1",
} = {}) {
  return {
    method,
    headers,
    socket: { remoteAddress, localAddress },
    url: path,
  };
}

function decide(options = {}, boundary = {}) {
  const path = options.path ?? "/cue";
  return evaluateWriteRequestBoundary(mockRequest({ ...options, path }), {
    url: new URL(path, "http://127.0.0.1"),
    ...boundary,
  });
}

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function postJson(path, body, headers = {}) {
  const server = createLive2dRendererServer();
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    return await new Promise((resolve, reject) => {
      const req = request({
        host: "127.0.0.1",
        port: address.port,
        path,
        method: "POST",
        headers: {
          host: `127.0.0.1:${address.port}`,
          "content-type": "application/json",
          ...headers,
        },
      }, (res) => {
        let text = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => { text += chunk; });
        res.on("end", () => resolve({
          statusCode: res.statusCode,
          body: text ? JSON.parse(text) : {},
        }));
      });
      req.on("error", reject);
      req.end(JSON.stringify(body));
    });
  } finally {
    await closeServer(server);
  }
}

for (const path of ["/cue", "/live2d-engine", "/renderer/heartbeat"]) {
  const accepted = decide({ path });
  assert.equal(accepted.accepted, true);
  assert.deepEqual(accepted.failureLabels, []);
  assert.equal(accepted.runtimeReadinessClaimed, false);
  assert.equal(accepted.productionReadinessClaimed, false);
  assert.equal(accepted.ownerConfirmationCreated, false);
  assert.equal(accepted.actualIngestionAllowed, false);
  assert.equal(accepted.trustedLoaderEnabled, false);
  assert.equal(accepted.priority1Status, "BLOCKED");
  assert.equal(accepted.checkedRowCount, 0);
  assert.equal(accepted.motionDatasetExecutable, false);
}

for (const blocked of [
  decide({ remoteAddress: "192.168.1.10", localAddress: "127.0.0.1" }),
  decide({ remoteAddress: "127.0.0.1", localAddress: "192.168.1.20" }),
  decide({ headers: { host: "localhost:9130", "content-type": "application/json" } }),
  decide({ headers: { host: "0.0.0.0:9130", "content-type": "application/json" } }),
  decide({ headers: { host: "192.168.1.20:9130", "content-type": "application/json" } }),
  decide({ headers: { host: "127.0.0.1", "content-type": "application/json" } }),
  decide({ path: "/cue?x=1" }),
  decide({ method: "GET" }),
  decide({ headers: { host: "127.0.0.1:9130", "content-type": "text/plain" } }),
  decide({ headers: { host: "127.0.0.1:9130", "content-type": "application/json", forwarded: "for=127.0.0.1" } }),
  decide({ headers: { host: "127.0.0.1:9130", "content-type": "application/json", "x-forwarded-for": "127.0.0.1" } }),
  decide({ headers: { host: "127.0.0.1:9130", "content-type": "application/json", "x-forwarded-host": "127.0.0.1" } }),
  decide({ headers: { host: "127.0.0.1:9130", "content-type": "application/json", "x-forwarded-proto": "http" } }),
]) {
  assert.equal(blocked.accepted, false);
}

const missingKey = decide({
  remoteAddress: "192.168.1.10",
  localAddress: "127.0.0.1",
}, { remoteWriteEnabled: true });
assert.equal(missingKey.accepted, false);
assert.equal(missingKey.failureLabels.includes("write_remote_key_missing"), true);
assert.equal(missingKey.failureLabels.includes("write_auth_required"), true);

const bearerAccepted = decide({
  remoteAddress: "192.168.1.10",
  localAddress: "127.0.0.1",
  headers: { host: "127.0.0.1:9130", "content-type": "application/json", authorization: "Bearer fixture-key" },
}, { remoteWriteEnabled: true, requiredApiKey: "fixture-key" });
assert.equal(bearerAccepted.accepted, true);

const apiKeyAccepted = decide({
  remoteAddress: "192.168.1.10",
  localAddress: "127.0.0.1",
  headers: { host: "127.0.0.1:9130", "content-type": "application/json", "x-api-key": "fixture-key" },
}, { remoteWriteEnabled: true, requiredApiKey: "fixture-key" });
assert.equal(apiKeyAccepted.accepted, true);

const wrongKey = decide({
  remoteAddress: "192.168.1.10",
  localAddress: "127.0.0.1",
  headers: { host: "127.0.0.1:9130", "content-type": "application/json", "x-api-key": "wrong-key" },
}, { remoteWriteEnabled: true, requiredApiKey: "fixture-key" });
assert.equal(wrongKey.accepted, false);
assert.equal(wrongKey.failureLabels.includes("write_auth_required"), true);

const forwardedRemote = decide({
  remoteAddress: "192.168.1.10",
  localAddress: "127.0.0.1",
  headers: {
    host: "127.0.0.1:9130",
    "content-type": "application/json",
    "x-api-key": "fixture-key",
    "x-forwarded-for": "192.168.1.10",
  },
}, { remoteWriteEnabled: true, requiredApiKey: "fixture-key" });
assert.equal(forwardedRemote.accepted, false);
assert.equal(forwardedRemote.failureLabels.includes("write_forwarded_header_present"), true);

const serialized = JSON.stringify(wrongKey);
for (const unsafe of ["fixture-key", "wrong-key", "authorization", "x-api-key", "token", "secret"]) {
  assert.equal(serialized.includes(unsafe), false);
}

assert.throws(() => assertAllowedListenHost("0.0.0.0"), /non-loopback bind rejected/u);
assert.doesNotThrow(() => assertAllowedListenHost("127.0.0.1"));

const validCueDelivery = {
  schema: "iris_live2d_renderer_cue_delivery_v1",
  cue: { schema: "iris_live2d_renderer_cue_v1" },
};

const cue = await postJson("/cue", validCueDelivery);
assert.equal(cue.statusCode, 200);
assert.equal(cue.body.ok, true);

const engine = await postJson("/live2d-engine", validCueDelivery);
assert.equal(engine.statusCode, 200);
assert.equal(engine.body.ok, true);

const heartbeat = await postJson("/renderer/heartbeat", {});
assert.equal(heartbeat.statusCode, 200);
assert.equal(heartbeat.body.ok, true);

const queryRejected = await postJson("/cue?x=1", validCueDelivery);
assert.equal(queryRejected.statusCode, 403);
assert.equal(queryRejected.body.ok, false);

const forwardedRejected = await postJson("/cue", validCueDelivery, {
  "x-forwarded-for": "127.0.0.1",
});
assert.equal(forwardedRejected.statusCode, 403);
assert.equal(forwardedRejected.body.ok, false);

console.log("write-route-boundary: pass");
