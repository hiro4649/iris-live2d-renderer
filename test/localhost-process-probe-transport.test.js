import assert from "node:assert/strict";
import { ReadableStream } from "node:stream/web";
import {
  LIVE2D_R2_FETCH_TIMEOUT_MS,
  LIVE2D_R2_LOOPBACK_HOST,
  LIVE2D_R2_MAX_RESPONSE_BYTES,
  buildLoopbackProbeUrl,
  fetchBoundedLoopbackJson,
  rejectUserProvidedUrl,
} from "../src/renderer/localhostProcessProbeTransport.js";

function jsonResponse(body, { status = 200, contentType = "application/json; charset=utf-8" } = {}) {
  const text = JSON.stringify(body);
  return new Response(text, {
    status,
    headers: {
      "content-type": contentType,
      "content-length": String(Buffer.byteLength(text)),
    },
  });
}

assert.equal(LIVE2D_R2_LOOPBACK_HOST, "127.0.0.1");
assert.equal(LIVE2D_R2_FETCH_TIMEOUT_MS <= 2_000, true);
assert.equal(LIVE2D_R2_MAX_RESPONSE_BYTES <= 262_144, true);

const built = buildLoopbackProbeUrl({ routeLabel: "health", port: 12345 });
assert.equal(built.ok, true);
assert.equal(built.url, "http://127.0.0.1:12345/health");
assert.equal(buildLoopbackProbeUrl({ routeLabel: "other", port: 12345 }).ok, false);
assert.equal(rejectUserProvidedUrl().ok, false);

const ok = await fetchBoundedLoopbackJson({
  routeLabel: "health",
  port: 12345,
  fetchImpl: async (url, options) => {
    assert.equal(url, "http://127.0.0.1:12345/health");
    assert.equal(options.method, "GET");
    assert.equal(options.redirect, "error");
    assert.equal(options.cache, "no-store");
    assert.equal(options.credentials, "omit");
    return jsonResponse({ ok: true, schema: "x" });
  },
});
assert.equal(ok.ok, true);
assert.equal(ok.targetHostAllowlistPassed, true);
assert.equal(ok.allRequestedHostsLoopback, true);
assert.equal(ok.redirectFollowed, false);
assert.equal(ok.proxyEnvForwarded, false);

const wrongContentType = await fetchBoundedLoopbackJson({
  routeLabel: "health",
  port: 12345,
  fetchImpl: async () => jsonResponse({ ok: true }, { contentType: "text/plain" }),
});
assert.equal(wrongContentType.ok, false);
assert.equal(wrongContentType.failureLabels.includes("content_type_invalid"), true);

const oversizedLength = await fetchBoundedLoopbackJson({
  routeLabel: "health",
  port: 12345,
  byteLimit: 2,
  fetchImpl: async () => jsonResponse({ ok: true }),
});
assert.equal(oversizedLength.ok, false);
assert.equal(oversizedLength.failureLabels.includes("content_type_invalid"), true);

const oversizedStream = await fetchBoundedLoopbackJson({
  routeLabel: "health",
  port: 12345,
  byteLimit: 2,
  fetchImpl: async () => new Response(new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode("{\"ok\":true}"));
      controller.close();
    },
  }), { headers: { "content-type": "application/json" } }),
});
assert.equal(oversizedStream.ok, false);
assert.equal(oversizedStream.failureLabels.includes("content_type_invalid"), true);

const invalidJson = await fetchBoundedLoopbackJson({
  routeLabel: "health",
  port: 12345,
  fetchImpl: async () => new Response("{", { headers: { "content-type": "application/json" } }),
});
assert.equal(invalidJson.ok, false);
assert.equal(invalidJson.failureLabels.includes("response_not_json_object"), true);

const jsonArray = await fetchBoundedLoopbackJson({
  routeLabel: "health",
  port: 12345,
  fetchImpl: async () => new Response("[]", { headers: { "content-type": "application/json" } }),
});
assert.equal(jsonArray.ok, false);
assert.equal(jsonArray.failureLabels.includes("response_not_json_object"), true);

const http500 = await fetchBoundedLoopbackJson({
  routeLabel: "health",
  port: 12345,
  fetchImpl: async () => jsonResponse({ ok: false }, { status: 500 }),
});
assert.equal(http500.ok, false);
assert.equal(http500.failureLabels.includes("http_not_success"), true);

const serialized = JSON.stringify(ok);
assert.equal(serialized.includes("secret"), false);
assert.equal(serialized.includes("private"), false);
assert.equal(serialized.includes("token"), false);

console.log("localhost-process-probe-transport: pass");
