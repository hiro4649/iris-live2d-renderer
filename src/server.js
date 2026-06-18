import { createServer } from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { basename, dirname, extname, isAbsolute, join, normalize, resolve } from "node:path";
import { ContractError, assertSafePublicObject, createBoundaryPolicy, createSafeError } from "./contracts.js";
import { createRendererState } from "./state.js";
import { contentTypeForModelAsset } from "./renderer/modelAssets.js";
import {
  LIVE2D_R2_COMPACT_PROBE_MAX_BYTES,
  buildR2CompactProbeSurface,
} from "./renderer/r2CompactProbeSurface.js";
import {
  assertAllowedListenHost,
  assertWriteRequestBoundary,
} from "./renderer/writeRequestBoundary.js";
import { validateSafeTraversal } from "./renderer/safeTraversal.js";
import { assertBrowserBootstrapConfigSize } from "./renderer/browserBootstrapConfig.js";

const MAX_BODY_BYTES = 256_000;
const SSE_CUE_INTERVAL_MS = 150;
const SSE_HEARTBEAT_INTERVAL_MS = 1_000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const CUBISM_CORE_ENV_NAME = "IRIS_LIVE2D_CUBISM_CORE_JS";
const APPROVED_CUBISM_CORE_BASENAMES = new Set([
  "CubismCore.js",
  "Live2DCubismCore.js",
  "Live2DCubismCore.min.js",
]);

export function createLive2dRendererServer({
  state = createRendererState(),
  publicDir = join(__dirname, "..", "public"),
  rendererApiKey = "",
  r2ProbeSurfaceEnabled = false,
  remoteWriteEnabled = false,
} = {}) {
  const requiredApiKey = String(rendererApiKey ?? "").trim();
  const compactProbeEnabled = r2ProbeSurfaceEnabled === true;
  const allowRemoteWrite = remoteWriteEnabled === true;
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://127.0.0.1");
      if (url.pathname === "/renderer/r2-probe-summary") {
        if (
          request.method !== "GET" ||
          url.search ||
          !compactProbeEnabled ||
          !isDirectR2LoopbackProbeRequest(request)
        ) {
          return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
        }
        const status = state.status();
        const health = state.health();
        const runtimeConfig = state.browserRuntimeConfig();
        return sendBoundedR2ProbeJson(response, buildR2CompactProbeSurface({ health, status, runtimeConfig }));
      }
      if (request.method === "GET" && url.pathname === "/health") {
        return sendJson(response, 200, state.health());
      }
      if (request.method === "GET" && url.pathname === "/status") {
        return sendJson(response, 200, state.status());
      }
      if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
        const html = await readFile(join(publicDir, "index.html"), "utf8");
        response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        response.end(html);
        return;
      }
      if (request.method === "GET" && url.pathname === "/renderer.js") {
        const script = await readFile(join(publicDir, "renderer.js"), "utf8");
        response.writeHead(200, { "content-type": "application/javascript; charset=utf-8" });
        response.end(script);
        return;
      }
      if (request.method === "GET" && url.pathname === "/renderer/cues") {
        return sendJson(response, 200, state.readBrowserCues());
      }
      if (request.method === "GET" && url.pathname === "/renderer/events") {
        if (url.search && url.search !== "?summary=compact") {
          return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
        }
        sendRendererEvents(request, response, state, { compact: url.searchParams.get("summary") === "compact" });
        return;
      }
      if (request.method === "GET" && url.pathname === "/renderer/runtime-config") {
        return sendJson(response, 200, state.browserRuntimeConfig());
      }
      if (request.method === "GET" && url.pathname === "/renderer/browser-bootstrap-config") {
        if (url.search) {
          return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
        }
        return sendJson(response, 200, assertBrowserBootstrapConfigSize(state.browserBootstrapConfig()));
      }
      if (request.method === "GET" && url.pathname === "/renderer/model3") {
        assertLocalAssetRead(request);
        const manifest = state.browserModel3Manifest();
        if (!manifest) {
          return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
        }
        return sendJson(response, 200, manifest);
      }
      if (request.method === "GET" && url.pathname.startsWith("/renderer/model-asset/")) {
        assertLocalAssetRead(request);
        if (url.search) {
          return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
        }
        const assetId = safeDecodePathSegment(url.pathname.slice("/renderer/model-asset/".length));
        const asset = state.resolveModelAsset(assetId);
        if (!asset) {
          return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
        }
        const body = await readFile(asset.filePath);
        response.writeHead(200, {
          "content-type": contentTypeForModelAsset(asset),
          "cache-control": "no-store",
        });
        response.end(body);
        return;
      }
      if (request.method === "GET" && url.pathname === "/renderer/cubism-core.js") {
        const guarded = cubismCoreRouteGuard(request, state.cubismCoreScriptCandidate(), url);
        if (guarded.status !== "serve") {
          return sendJson(response, statusForCubismCoreGuard(guarded.status), guarded.publicStatus);
        }
        const script = await readFile(guarded.assetFile, "utf8");
        response.writeHead(200, {
          "content-type": "application/javascript; charset=utf-8",
          "cache-control": "no-store",
        });
        response.end(script);
        return;
      }
      if (request.method === "POST" && url.pathname === "/renderer/heartbeat") {
        assertWriteRequestBoundary(request, { url, requiredApiKey, remoteWriteEnabled: allowRemoteWrite });
        const payload = await readJson(request);
        return sendJson(response, 200, state.acceptBrowserHeartbeat(payload));
      }
      if (request.method === "POST" && url.pathname === "/live2d-engine") {
        assertWriteRequestBoundary(request, { url, requiredApiKey, remoteWriteEnabled: allowRemoteWrite });
        const payload = await readJson(request);
        return sendJson(response, 200, state.acceptCue(payload, "live2d-engine"));
      }
      if (request.method === "POST" && url.pathname === "/cue") {
        assertWriteRequestBoundary(request, { url, requiredApiKey, remoteWriteEnabled: allowRemoteWrite });
        const payload = await readJson(request);
        return sendJson(response, 200, state.acceptCue(payload, "cue"));
      }
      return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
    } catch (error) {
      const status = statusForError(error);
      return sendJson(response, status, createSafeError(error, status));
    }
  });
}

export async function listen(server, { host = "127.0.0.1", port = 9130 } = {}) {
  assertAllowedListenHost(host);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });
  return server.address();
}

async function readJson(request) {
  if (!isJsonContentType(request.headers?.["content-type"])) {
    throw new ContractError("unsupported content type", "invalid_json");
  }
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new ContractError("request body too large", "request_body_too_large");
    chunks.push(chunk);
  }
  try {
    const bytes = Buffer.concat(chunks);
    const text = bytes.length ? new TextDecoder("utf-8", { fatal: true }).decode(bytes) : "{}";
    const payload = JSON.parse(text);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new ContractError("object body required", "invalid_json");
    }
    const traversal = validateSafeTraversal(payload);
    if (!traversal.ok) throw new ContractError("request body outside safe bounds", traversal.errorKind);
    return payload;
  } catch (error) {
    if (error instanceof ContractError) throw error;
    throw new ContractError("invalid json", "invalid_json");
  }
}

function isJsonContentType(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return text === "application/json" || text === "application/json; charset=utf-8";
}

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(body));
}

function sendBoundedR2ProbeJson(response, body) {
  const text = JSON.stringify(body);
  if (Buffer.byteLength(text, "utf8") > LIVE2D_R2_COMPACT_PROBE_MAX_BYTES) {
    response.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
    response.end(JSON.stringify({
      ok: false,
      schema: "iris_live2d_r2_compact_probe_surface_v1",
      projectionStatus: "blocked",
      crossSurfaceParityStatus: "blocked",
      failureLabels: ["compact_probe_response_too_large"],
      safeSummaryOnly: true,
    }));
    return;
  }
  response.writeHead(200, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": String(Buffer.byteLength(text, "utf8")),
  });
  response.end(text);
}

function safeDecodePathSegment(segment) {
  try {
    const decoded = decodeURIComponent(String(segment ?? ""));
    return decoded.includes("/") || decoded.includes("\\") ? "" : decoded;
  } catch {
    return "";
  }
}

function sendRendererEvents(request, response, state, { compact = false } = {}) {
  response.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-store",
    connection: "keep-alive",
    "x-accel-buffering": "no",
  });
  response.flushHeaders?.();

  let closed = false;
  let cueTimer = null;
  let heartbeatTimer = null;
  const closeStream = () => {
    if (closed) return;
    closed = true;
    if (cueTimer) clearInterval(cueTimer);
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    if (!response.destroyed && !response.writableEnded) response.end();
  };
  const sendEvent = (eventName, payload) => {
    if (closed) return;
    try {
      writeSseEvent(response, eventName, payload);
    } catch {
      closeStream();
    }
  };
  const sendCues = () => {
    const cueBatch = state.readBrowserCues();
    if (cueBatch.cues.length > 0) sendEvent("renderer_cues", cueBatch);
  };

  request.on("close", closeStream);
  response.on("close", closeStream);
  response.on("error", closeStream);

  response.write(": renderer events connected\n\n");
  sendEvent("renderer_status", compact ? createCompactRendererStatus(state) : state.status());
  sendEvent("heartbeat", createRendererEventHeartbeat(state));
  sendCues();
  cueTimer = setInterval(sendCues, SSE_CUE_INTERVAL_MS);
  heartbeatTimer = setInterval(() => sendEvent("heartbeat", createRendererEventHeartbeat(state)), SSE_HEARTBEAT_INTERVAL_MS);
}

function createCompactRendererStatus(state) {
  const bootstrap = state.browserBootstrapConfig();
  const status = {
    ok: true,
    schema: "iris_live2d_renderer_event_compact_status_v1",
    compactSafeSummary: bootstrap.compactSafeSummary,
    safeSummaryOnly: true,
  };
  assertSafePublicObject(status, "compact renderer event status");
  return status;
}

function writeSseEvent(response, eventName, payload) {
  assertSafePublicObject(payload, `${eventName} event`);
  response.write(`event: ${eventName}\n`);
  response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function createRendererEventHeartbeat(state) {
  const status = state.status();
  const heartbeat = {
    ok: true,
    schema: "iris_live2d_renderer_event_heartbeat_v1",
    renderer_ready: status.renderer_ready,
    delivery_ready: status.renderer_health.browser_cue_delivery_ready,
    pending_cue_count: status.browser_delivery.pending_cue_count,
    delivery_status: status.browser_delivery.last_delivery_status,
    boundary_policy: createBoundaryPolicy(),
  };
  assertSafePublicObject(heartbeat, "renderer event heartbeat");
  return heartbeat;
}

function assertLocalAssetRead(request) {
  if (isLoopbackRequest(request)) return;
  throw new ContractError("not found", "not_found");
}

function cubismCoreRouteGuard(request, candidate = {}, url = null) {
  if (!isLoopbackRequest(request)) return guardedCubismCoreStatus("blocked_non_loopback");
  if (url?.search) return guardedCubismCoreStatus("blocked_traversal");
  const configured = candidate?.configured === true && String(candidate?.candidate ?? "").trim();
  if (!configured) return guardedCubismCoreStatus("not_configured");
  const assetFile = String(candidate.candidate ?? "");
  if (assetFile.includes("..")) return guardedCubismCoreStatus("blocked_traversal");
  if (!isSafeCubismCoreCandidate(assetFile)) return guardedCubismCoreStatus("unsafe_configuration");
  if (!existsSync(assetFile)) return guardedCubismCoreStatus("operator_attention_required");
  return {
    status: "serve",
    assetFile,
  };
}

function guardedCubismCoreStatus(status) {
  const publicStatus = {
    ok: false,
    schema: "iris_live2d_cubism_core_route_guard_v1",
    core_route_status: safeCubismCoreStatus(status),
    configured_env_names: status === "not_configured" ? [] : [CUBISM_CORE_ENV_NAME],
    owner_provided_file_policy: "env_name_only",
    candidate_status: status === "operator_attention_required" ? "candidate_missing" : status,
    trusted_loader_allowlist_enabled: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      loopback_only: true,
      no_env_values: true,
      no_sdk_vendor_files: true,
    },
  };
  assertSafePublicObject(publicStatus, "cubism core route guard");
  return { status, publicStatus };
}

function isSafeCubismCoreCandidate(assetFile) {
  const text = String(assetFile ?? "");
  if (!text || text.includes("\0") || text.includes("..")) return false;
  if (!isAbsolute(text)) return false;
  const normalized = normalize(text);
  if (normalized !== resolve(text)) return false;
  if (extname(normalized) !== ".js") return false;
  return APPROVED_CUBISM_CORE_BASENAMES.has(basename(normalized));
}

function safeCubismCoreStatus(status) {
  return [
    "not_configured",
    "operator_attention_required",
    "unsafe_configuration",
    "blocked_non_loopback",
    "blocked_traversal",
  ].includes(status)
    ? status
    : "unsafe_configuration";
}

function statusForCubismCoreGuard(status) {
  if (status === "blocked_non_loopback" || status === "blocked_traversal") return 403;
  if (status === "unsafe_configuration") return 409;
  return 404;
}

function isLoopbackRequest(request) {
  const forwardedFor = String(request.headers?.["x-forwarded-for"] ?? "").split(",")[0].trim();
  if (forwardedFor && !isLoopbackAddress(forwardedFor)) return false;
  return isLoopbackAddress(String(request.socket?.remoteAddress ?? ""));
}

function isLoopbackAddress(address) {
  return address === "127.0.0.1" || address === "::1" || address === "::ffff:127.0.0.1";
}

export function isDirectR2LoopbackProbeRequest(request) {
  const remoteAddress = String(request.socket?.remoteAddress ?? "");
  const localAddress = String(request.socket?.localAddress ?? "");
  const host = String(request.headers?.host ?? "");
  if (!(remoteAddress === "127.0.0.1" || remoteAddress === "::ffff:127.0.0.1")) return false;
  if (!(localAddress === "127.0.0.1" || localAddress === "::ffff:127.0.0.1")) return false;
  if (!/^127\.0\.0\.1:\d{1,5}$/.test(host)) return false;
  for (const header of ["forwarded", "x-forwarded-for", "x-forwarded-host", "x-forwarded-proto"]) {
    if (Object.hasOwn(request.headers ?? {}, header)) return false;
  }
  return true;
}

function statusForError(error) {
  if (error instanceof ContractError) {
    if (error.code === "auth_required") return 401;
    if (error.code === "write_boundary_rejected" || error.code === "non_loopback_bind_rejected") return 403;
    return 400;
  }
  return 500;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const state = createRendererState({
    modelId: process.env.IRIS_LOCAL_LIVE2D_MODEL_ID ?? "",
    sceneId: process.env.IRIS_LOCAL_LIVE2D_SCENE_ID ?? "",
    cubismCoreJsPath: process.env.IRIS_LIVE2D_CUBISM_CORE_JS ?? "",
    model3JsonPath: process.env.IRIS_LIVE2D_MODEL3_JSON ?? "",
    cubismLoaderEnv: process.env,
    heartbeatMaxAgeMs: Number(process.env.IRIS_LIVE2D_BROWSER_HEARTBEAT_MAX_AGE_MS || 5000),
  });
  const server = createLive2dRendererServer({
    state,
    rendererApiKey: process.env.IRIS_LIVE2D_RENDERER_API_KEY || process.env.IRIS_LOCAL_ENGINE_API_KEY || "",
    r2ProbeSurfaceEnabled: process.env.IRIS_LIVE2D_R2_PROBE_SURFACE_ENABLED === "1",
    remoteWriteEnabled: process.env.IRIS_LIVE2D_REMOTE_WRITE_ENABLED === "1",
  });
  const host = process.env.IRIS_LIVE2D_RENDERER_HOST || "127.0.0.1";
  const port = Number(process.env.IRIS_LIVE2D_RENDERER_PORT || 9130);
  await listen(server, { host, port });
  console.log(JSON.stringify({
    ok: true,
    schema: "iris_live2d_renderer_startup_v1",
    service: "iris_live2d_renderer",
    listening: {
      host_env_name: "IRIS_LIVE2D_RENDERER_HOST",
      port_env_name: "IRIS_LIVE2D_RENDERER_PORT",
    },
    routes: ["GET /health", "GET /status", "POST /live2d-engine", "POST /cue"],
    browser_routes: [
      "GET /renderer/cues",
      "GET /renderer/events",
      "GET /renderer/runtime-config",
      "GET /renderer/model3",
      "GET /renderer/model-asset/:asset_id",
      "GET /renderer/cubism-core.js",
      "POST /renderer/heartbeat",
    ],
    configured_env: [
      "IRIS_LIVE2D_RENDERER_ENDPOINT",
      "IRIS_LIVE2D_RENDERER_HEALTH_ENDPOINT",
      "IRIS_LOCAL_LIVE2D_MODEL_ID",
      "IRIS_LOCAL_LIVE2D_SCENE_ID",
      "IRIS_LIVE2D_CUBISM_CORE_JS",
      "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
      "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
      "IRIS_LIVE2D_CUBISM_LOADER_KIND",
      "IRIS_LIVE2D_MODEL3_JSON",
      "IRIS_LIVE2D_RENDERER_API_KEY",
      "IRIS_LOCAL_ENGINE_API_KEY",
      "IRIS_LIVE2D_BROWSER_HEARTBEAT_MAX_AGE_MS",
      "IRIS_LIVE2D_R2_PROBE_SURFACE_ENABLED",
    ],
    renderer_ready: state.status().renderer_ready,
    boundary_policy: {
      no_secret_values: true,
      no_endpoint_values: true,
      no_raw_cue_body: true,
      no_raw_model_path: true,
      no_commands: true,
    },
  }));
}
