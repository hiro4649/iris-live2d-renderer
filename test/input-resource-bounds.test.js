import assert from "node:assert/strict";
import { request } from "node:http";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { assertSafeInput, assertSafePublicObject } from "../src/contracts.js";
import { validateSafeTraversal } from "../src/renderer/safeTraversal.js";

const VALID_CUE = {
  schema: "iris_live2d_renderer_cue_delivery_v1",
  cue: { schema: "iris_live2d_renderer_cue_v1" },
};

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function withServer(options, fn) {
  const server = createLive2dRendererServer(options);
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  try {
    return await fn({ port: address.port });
  } finally {
    await closeServer(server);
  }
}

async function requestJson({ path = "/cue", method = "POST", headers = {}, body = VALID_CUE, r2ProbeSurfaceEnabled = false } = {}) {
  return withServer({ r2ProbeSurfaceEnabled }, ({ port }) => new Promise((resolve, reject) => {
    const req = request({
      host: "127.0.0.1",
      port,
      path,
      method,
      headers: {
        host: `127.0.0.1:${port}`,
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
        byteLength: Buffer.byteLength(text, "utf8"),
      }));
    });
    req.on("error", reject);
    if (method === "GET") {
      req.end();
    } else if (Buffer.isBuffer(body) || typeof body === "string") {
      req.end(body);
    } else {
      req.end(JSON.stringify(body));
    }
  }));
}

function nestedObject(depth) {
  let value = {};
  for (let index = 0; index < depth; index += 1) value = { child: value };
  return value;
}

const depthRejected = await requestJson({ body: nestedObject(33) });
assert.equal(depthRejected.statusCode, 400);
assert.equal(depthRejected.body.error_kind, "request_body_too_deep");

const nodeRejected = await requestJson({ body: { values: Array.from({ length: 20_001 }, (_, index) => index) } });
assert.equal(nodeRejected.statusCode, 400);
assert.equal(nodeRejected.body.error_kind, "request_body_too_complex");

const keyRejected = await requestJson({
  body: Object.fromEntries(Array.from({ length: 1_001 }, (_, index) => [`k${index}`, index])),
});
assert.equal(keyRejected.statusCode, 400);
assert.equal(keyRejected.body.error_kind, "request_body_too_complex");

const arrayRejected = await requestJson({ body: { values: Array.from({ length: 2_001 }, (_, index) => index) } });
assert.equal(arrayRejected.statusCode, 400);
assert.equal(arrayRejected.body.error_kind, "request_body_too_complex");

const stringRejected = await requestJson({ body: { text: "x".repeat(65_537) } });
assert.equal(stringRejected.statusCode, 400);
assert.equal(stringRejected.body.error_kind, "request_string_too_large");

const invalidUtf8 = await requestJson({ body: Buffer.from([0xc3, 0x28]) });
assert.equal(invalidUtf8.statusCode, 400);
assert.equal(invalidUtf8.body.error_kind, "invalid_json");

const wrongContentType = await requestJson({ headers: { "content-type": "text/plain" }, body: "{}" });
assert.equal(wrongContentType.statusCode, 400);
assert.equal(wrongContentType.body.error_kind, "invalid_json");

const rootArray = await requestJson({ body: [] });
assert.equal(rootArray.statusCode, 400);
assert.equal(rootArray.body.error_kind, "invalid_json");

const rootNull = await requestJson({ body: "null" });
assert.equal(rootNull.statusCode, 400);
assert.equal(rootNull.body.error_kind, "invalid_json");

const cycle = {};
cycle.self = cycle;
assert.throws(() => assertSafeInput(cycle), /unsafe_payload/u);

assert.throws(() => assertSafeInput(JSON.parse("{\"__proto__\":{\"polluted\":true}}")), /unsafe_payload/u);
assert.equal({}.polluted, undefined);

const status = await requestJson({ path: "/status", method: "GET" });
assert.equal(status.statusCode, 200);
const statusTraversal = validateSafeTraversal(status.body, { maxNodes: 100_000, rejectPrototypePollutionKeys: false });
assert.equal(statusTraversal.ok, true);
assert.equal(statusTraversal.nodeCount > 20_000, true);

const compact = await requestJson({
  path: "/renderer/r2-probe-summary",
  method: "GET",
  r2ProbeSurfaceEnabled: true,
});
assert.equal(compact.statusCode, 200);
assert.equal(compact.body.ok, true);
assert.doesNotThrow(() => assertSafePublicObject(compact.body));
assert.equal(validateSafeTraversal(compact.body, { maxNodes: 100_000, rejectPrototypePollutionKeys: false }).ok, true);

const cue = await requestJson({ body: VALID_CUE });
assert.equal(cue.statusCode, 200);
assert.equal(cue.body.ok, true);

console.log("input-resource-bounds: pass");
