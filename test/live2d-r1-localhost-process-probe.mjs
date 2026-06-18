#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout as delay } from "node:timers/promises";
import {
  LIVE2D_R1_LOCALHOST_PROBE_ROUTES,
  buildLocalhostProcessProbeEnvelope,
} from "../src/renderer/localhostProcessProbeEnvelope.js";

const HOST = "127.0.0.1";

async function reserveLoopbackPort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, HOST, resolve);
  });
  const address = server.address();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

async function waitForRoute(port) {
  const url = `http://${HOST}:${port}/health`;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return true;
    } catch {
      // Retry until the child process has finished binding the loopback port.
    }
    await delay(100);
  }
  return false;
}

async function fetchSafeJson(port, route) {
  const response = await fetch(`http://${HOST}:${port}${route.path}`);
  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }
  return {
    routeLabel: route.label,
    httpStatus: response.status,
    ok: response.ok,
    body,
  };
}

function stopChild(child) {
  return new Promise((resolve) => {
    if (!child || child.exitCode !== null || child.signalCode) {
      resolve(true);
      return;
    }
    const timeout = setTimeout(() => {
      if (child.exitCode === null && !child.signalCode) child.kill("SIGKILL");
    }, 2_000);
    child.once("exit", () => {
      clearTimeout(timeout);
      resolve(true);
    });
    child.kill("SIGTERM");
  });
}

async function main() {
  const port = await reserveLoopbackPort();
  const child = spawn(process.execPath, ["src/server.js"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      IRIS_LIVE2D_RENDERER_HOST: HOST,
      IRIS_LIVE2D_RENDERER_PORT: String(port),
      IRIS_LIVE2D_CUBISM_CORE_JS: "",
      IRIS_LIVE2D_MODEL3_JSON: "",
      IRIS_LOCAL_LIVE2D_MODEL_ID: "",
      IRIS_LOCAL_LIVE2D_SCENE_ID: "",
    },
    stdio: ["ignore", "ignore", "ignore"],
  });

  let processStopped = false;
  try {
    const processStarted = await waitForRoute(port);
    const routeResults = processStarted
      ? await Promise.all(LIVE2D_R1_LOCALHOST_PROBE_ROUTES.map((route) => fetchSafeJson(port, route)))
      : [];
    processStopped = await stopChild(child);
    const envelope = buildLocalhostProcessProbeEnvelope({
      routeResults,
      processStarted,
      processStopped,
      hostLabel: "loopback",
    });
    console.log(JSON.stringify(envelope, null, 2));
    process.exitCode = envelope.probeStatus === "pass" ? 0 : 1;
  } finally {
    if (!processStopped) await stopChild(child);
  }
}

await main();
