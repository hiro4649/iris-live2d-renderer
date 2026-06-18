import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import { LIVE2D_R2_LOOPBACK_HOST } from "./localhostProcessProbeTransport.js";

const SAFE_ENV_KEYS = new Set([
  "PATH",
  "Path",
  "PATHEXT",
  "SystemRoot",
  "WINDIR",
  "ComSpec",
  "TEMP",
  "TMP",
  "USERPROFILE",
  "HOME",
  "TMPDIR",
  "LANG",
  "LC_ALL",
]);

export function createMinimalChildEnv(sourceEnv = process.env, { port, r2ProbeSurfaceEnabled = false } = {}) {
  const env = {};
  for (const key of SAFE_ENV_KEYS) {
    if (Object.hasOwn(sourceEnv, key) && sourceEnv[key]) env[key] = sourceEnv[key];
  }
  env.NO_PROXY = "127.0.0.1";
  env.IRIS_LIVE2D_RENDERER_HOST = LIVE2D_R2_LOOPBACK_HOST;
  env.IRIS_LIVE2D_RENDERER_PORT = String(port);
  env.IRIS_LIVE2D_CUBISM_CORE_JS = "";
  env.IRIS_LIVE2D_MODEL3_JSON = "";
  env.IRIS_LOCAL_LIVE2D_MODEL_ID = "";
  env.IRIS_LOCAL_LIVE2D_SCENE_ID = "";
  if (r2ProbeSurfaceEnabled === true) {
    env.IRIS_LIVE2D_R2_PROBE_SURFACE_ENABLED = "1";
  }
  return env;
}

export async function reserveLoopbackPort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, LIVE2D_R2_LOOPBACK_HOST, resolve);
  });
  const address = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

export function startRendererProcess({ port, cwd = process.cwd(), env = process.env, r2ProbeSurfaceEnabled = false } = {}) {
  const child = spawn(process.execPath, ["src/server.js"], {
    cwd,
    env: createMinimalChildEnv(env, { port, r2ProbeSurfaceEnabled }),
    shell: false,
    detached: false,
    windowsHide: true,
    stdio: ["ignore", "ignore", "ignore"],
  });
  const state = {
    child,
    processStarted: true,
    spawnErrorPresent: false,
    unexpectedExitPresent: false,
  };
  child.once("error", () => {
    state.spawnErrorPresent = true;
  });
  child.once("exit", () => {
    if (!state.stopping) state.unexpectedExitPresent = true;
  });
  return state;
}

export async function waitForRendererStartup({ probe, attempts = 50, intervalMs = 100 } = {}) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (await probe()) return true;
    await delay(intervalMs);
  }
  return false;
}

export async function stopRendererProcess(state, { graceMs = 2_000, hardMs = 1_000 } = {}) {
  const child = state?.child;
  const result = {
    processExitObserved: false,
    sigtermSent: false,
    sigkillFallbackUsed: false,
    processStopped: false,
    spawnErrorPresent: Boolean(state?.spawnErrorPresent),
    unexpectedExitPresent: Boolean(state?.unexpectedExitPresent),
    safeSummaryOnly: true,
  };
  if (!child || child.exitCode !== null || child.signalCode) {
    result.processExitObserved = true;
    result.processStopped = true;
    return result;
  }
  state.stopping = true;
  result.sigtermSent = true;
  child.kill("SIGTERM");
  const exited = await new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), graceMs);
    child.once("exit", () => {
      clearTimeout(timeout);
      resolve(true);
    });
  });
  if (exited) {
    result.processExitObserved = true;
    result.processStopped = true;
    return result;
  }
  result.sigkillFallbackUsed = true;
  child.kill("SIGKILL");
  const hardExited = await new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), hardMs);
    child.once("exit", () => {
      clearTimeout(timeout);
      resolve(true);
    });
  });
  result.processExitObserved = hardExited;
  result.processStopped = hardExited;
  return result;
}

export async function waitForPortRelease({ port, retries = 10, intervalMs = 100 } = {}) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const server = createServer();
    const released = await new Promise((resolve) => {
      server.once("error", () => resolve(false));
      server.listen(port, LIVE2D_R2_LOOPBACK_HOST, () => {
        server.close(() => resolve(true));
      });
    });
    if (released) return true;
    await delay(intervalMs);
  }
  return false;
}
