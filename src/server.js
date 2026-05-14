import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { ContractError, createSafeError } from "./contracts.js";
import { createRendererState } from "./state.js";

const MAX_BODY_BYTES = 256_000;
const __dirname = dirname(fileURLToPath(import.meta.url));

export function createLive2dRendererServer({ state = createRendererState(), publicDir = join(__dirname, "..", "public") } = {}) {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://127.0.0.1");
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
      if (request.method === "GET" && url.pathname === "/renderer/runtime-config") {
        return sendJson(response, 200, state.browserRuntimeConfig());
      }
      if (request.method === "GET" && url.pathname === "/renderer/cubism-core.js") {
        const cubismCoreJsPath = state.cubismCoreJsPath();
        if (!cubismCoreJsPath) {
          return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
        }
        const script = await readFile(cubismCoreJsPath, "utf8");
        response.writeHead(200, { "content-type": "application/javascript; charset=utf-8" });
        response.end(script);
        return;
      }
      if (request.method === "POST" && url.pathname === "/renderer/heartbeat") {
        const payload = await readJson(request);
        return sendJson(response, 200, state.acceptBrowserHeartbeat(payload));
      }
      if (request.method === "POST" && url.pathname === "/live2d-engine") {
        const payload = await readJson(request);
        return sendJson(response, 200, state.acceptCue(payload, "live2d-engine"));
      }
      if (request.method === "POST" && url.pathname === "/cue") {
        const payload = await readJson(request);
        return sendJson(response, 200, state.acceptCue(payload, "cue"));
      }
      return sendJson(response, 404, createSafeError(new ContractError("not found", "not_found"), 404));
    } catch (error) {
      const status = error instanceof ContractError ? (error.code === "invalid_json" ? 400 : 400) : 500;
      return sendJson(response, status, createSafeError(error, status));
    }
  });
}

export async function listen(server, { host = "127.0.0.1", port = 9130 } = {}) {
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
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new ContractError("request body too large", "invalid_json");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    throw new ContractError("invalid json", "invalid_json");
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const state = createRendererState({
    modelId: process.env.IRIS_LOCAL_LIVE2D_MODEL_ID ?? "",
    sceneId: process.env.IRIS_LOCAL_LIVE2D_SCENE_ID ?? "",
    cubismCoreJsPath: process.env.IRIS_LIVE2D_CUBISM_CORE_JS ?? "",
    model3JsonPath: process.env.IRIS_LIVE2D_MODEL3_JSON ?? "",
    heartbeatMaxAgeMs: Number(process.env.IRIS_LIVE2D_BROWSER_HEARTBEAT_MAX_AGE_MS || 5000),
  });
  const server = createLive2dRendererServer({ state });
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
    browser_routes: ["GET /renderer/cues", "GET /renderer/runtime-config", "GET /renderer/cubism-core.js", "POST /renderer/heartbeat"],
    configured_env: [
      "IRIS_LIVE2D_RENDERER_ENDPOINT",
      "IRIS_LIVE2D_RENDERER_HEALTH_ENDPOINT",
      "IRIS_LOCAL_LIVE2D_MODEL_ID",
      "IRIS_LOCAL_LIVE2D_SCENE_ID",
      "IRIS_LIVE2D_CUBISM_CORE_JS",
      "IRIS_LIVE2D_MODEL3_JSON",
      "IRIS_LIVE2D_BROWSER_HEARTBEAT_MAX_AGE_MS",
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

