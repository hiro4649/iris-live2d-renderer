import assert from "node:assert/strict";
import { request } from "node:http";
import { createLive2dRendererServer, isDirectR2LoopbackProbeRequest, listen } from "../src/server.js";

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function getJson({ enabled = true, method = "GET", path = "/renderer/r2-probe-summary", headers = {} } = {}) {
  const server = createLive2dRendererServer({ r2ProbeSurfaceEnabled: enabled });
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    return await new Promise((resolve, reject) => {
      const req = request({
        host: "127.0.0.1",
        port: address.port,
        path,
        method,
        headers: {
          host: `127.0.0.1:${address.port}`,
          ...headers,
        },
      }, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => { body += chunk; });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            contentType: res.headers["content-type"],
            cacheControl: res.headers["cache-control"],
            contentLength: Number(res.headers["content-length"] || "0"),
            body: body ? JSON.parse(body) : {},
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

const disabled = await getJson({ enabled: false });
assert.equal(disabled.statusCode, 404);
assert.equal(disabled.body.ok, false);

const enabled = await getJson();
assert.equal(enabled.statusCode, 200);
assert.equal(enabled.contentType, "application/json; charset=utf-8");
assert.equal(enabled.cacheControl, "no-store");
assert.equal(enabled.body.ok, true);
assert.equal(enabled.body.schema, "iris_live2d_r2_compact_probe_surface_v1");
assert.equal(enabled.body.surfaceCount, 3);
assert.equal(enabled.body.safeSummaryOnly, true);
assert.equal(enabled.contentLength > 0 && enabled.contentLength < 32_768, true);

for (const blocked of [
  await getJson({ path: "/renderer/r2-probe-summary?x=1" }),
  await getJson({ method: "POST" }),
  await getJson({ headers: { "x-forwarded-for": "127.0.0.1" } }),
  await getJson({ headers: { forwarded: "for=127.0.0.1" } }),
  await getJson({ headers: { "x-forwarded-host": "127.0.0.1" } }),
  await getJson({ headers: { "x-forwarded-proto": "http" } }),
]) {
  assert.equal(blocked.statusCode, 404);
  assert.equal(blocked.body.ok, false);
}

assert.equal(isDirectR2LoopbackProbeRequest({
  headers: { host: "127.0.0.1:12345" },
  socket: { remoteAddress: "127.0.0.1", localAddress: "127.0.0.1" },
}), true);
assert.equal(isDirectR2LoopbackProbeRequest({
  headers: { host: "localhost:12345" },
  socket: { remoteAddress: "127.0.0.1", localAddress: "127.0.0.1" },
}), false);
assert.equal(isDirectR2LoopbackProbeRequest({
  headers: { host: "127.0.0.1:12345" },
  socket: { remoteAddress: "::1", localAddress: "127.0.0.1" },
}), false);
assert.equal(isDirectR2LoopbackProbeRequest({
  headers: { host: "127.0.0.1:12345", "x-forwarded-for": "127.0.0.1" },
  socket: { remoteAddress: "127.0.0.1", localAddress: "127.0.0.1" },
}), false);

const serialized = JSON.stringify(enabled.body);
for (const unsafe of ["endpoint", "token", "secret", "private_path", "raw_payload", "pid"]) {
  assert.equal(serialized.includes(unsafe), false);
}

console.log("r2-compact-probe-server-route: pass");
