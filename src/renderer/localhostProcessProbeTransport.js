import { TextDecoder } from "node:util";
import {
  LIVE2D_R2_COMPACT_PROBE_ROUTE_LABEL,
  LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS,
  getLive2dR2TransportRoutePath,
} from "./localhostProbeRouteContract.js";

export const LIVE2D_R2_LOOPBACK_HOST = "127.0.0.1";
export const LIVE2D_R2_MAX_RESPONSE_BYTES = 262_144;
export const LIVE2D_R2_FETCH_TIMEOUT_MS = 2_000;

const JSON_CONTENT_TYPES = new Set(["application/json", "application/json; charset=utf-8"]);

function safeFailure(label) {
  return { ok: false, body: {}, failureLabels: [label], safeSummaryOnly: true };
}

function isAllowedPort(port) {
  return Number.isInteger(port) && port > 0 && port <= 65_535;
}

export function buildLoopbackProbeUrl({ routeLabel, port }) {
  const path = getLive2dR2TransportRoutePath(routeLabel);
  const routeAllowed = routeLabel === LIVE2D_R2_COMPACT_PROBE_ROUTE_LABEL ||
    LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS.includes(routeLabel);
  if (!path || !routeAllowed) {
    return { ...safeFailure("route_unknown"), url: "" };
  }
  if (!isAllowedPort(port)) {
    return { ...safeFailure("host_not_loopback"), url: "" };
  }
  return {
    ok: true,
    url: `http://${LIVE2D_R2_LOOPBACK_HOST}:${port}${path}`,
    routeLabel,
    pathLabel: path,
    safeSummaryOnly: true,
  };
}

export function rejectUserProvidedUrl() {
  return {
    ok: false,
    failureLabels: ["host_not_loopback"],
    safeSummaryOnly: true,
  };
}

function validateLoopbackUrl(urlText) {
  try {
    const url = new URL(urlText);
    return url.protocol === "http:" && url.hostname === LIVE2D_R2_LOOPBACK_HOST && isAllowedPort(Number(url.port));
  } catch {
    return false;
  }
}

function normalizeContentType(value) {
  return String(value || "").toLowerCase().split(";").map((part) => part.trim()).join("; ");
}

async function readBoundedResponseBody(response, byteLimit = LIVE2D_R2_MAX_RESPONSE_BYTES) {
  const contentLength = Number(response.headers.get("content-length") || "0");
  if (contentLength > byteLimit) {
    return { ...safeFailure("response_too_large"), bodyText: "" };
  }
  const reader = response.body?.getReader();
  if (!reader) return { ...safeFailure("response_not_json_object"), bodyText: "" };
  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > byteLimit) {
      await reader.cancel();
      return { ...safeFailure("response_too_large"), bodyText: "" };
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return {
      ok: true,
      bodyText: new TextDecoder("utf-8", { fatal: true }).decode(bytes),
      failureLabels: [],
      safeSummaryOnly: true,
    };
  } catch {
    return { ...safeFailure("invalid_utf8"), bodyText: "" };
  }
}

export async function fetchBoundedLoopbackJson({
  routeLabel,
  port,
  fetchImpl = globalThis.fetch,
  timeoutMs = LIVE2D_R2_FETCH_TIMEOUT_MS,
  byteLimit = LIVE2D_R2_MAX_RESPONSE_BYTES,
} = {}) {
  const built = buildLoopbackProbeUrl({ routeLabel, port });
  if (!built.ok) {
    return {
      routeLabel: built.routeLabel || "unknown_route",
      httpStatus: 0,
      ok: false,
      body: {},
      targetHostAllowlistPassed: false,
      allRequestedHostsLoopback: false,
      redirectFollowed: false,
      proxyEnvForwarded: false,
      failureLabels: built.failureLabels,
      safeSummaryOnly: true,
    };
  }
  if (!validateLoopbackUrl(built.url)) {
    return {
      routeLabel,
      httpStatus: 0,
      ok: false,
      body: {},
      targetHostAllowlistPassed: false,
      allRequestedHostsLoopback: false,
      redirectFollowed: false,
      proxyEnvForwarded: false,
      failureLabels: ["host_not_loopback"],
      safeSummaryOnly: true,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(built.url, {
      method: "GET",
      redirect: "error",
      cache: "no-store",
      credentials: "omit",
      signal: controller.signal,
    });
    const contentType = normalizeContentType(response.headers?.get?.("content-type"));
    const contentTypeOk = JSON_CONTENT_TYPES.has(contentType);
    if (!contentTypeOk) {
      return {
        routeLabel,
        httpStatus: response.status,
        ok: false,
        body: {},
        targetHostAllowlistPassed: true,
        allRequestedHostsLoopback: true,
        redirectFollowed: false,
        proxyEnvForwarded: false,
        failureLabels: ["content_type_invalid"],
        safeSummaryOnly: true,
      };
    }
    const bodyRead = await readBoundedResponseBody(response, byteLimit);
    if (!bodyRead.ok) {
      return {
        routeLabel,
        httpStatus: response.status,
        ok: false,
        body: {},
        targetHostAllowlistPassed: true,
        allRequestedHostsLoopback: true,
        redirectFollowed: false,
        proxyEnvForwarded: false,
        failureLabels: bodyRead.failureLabels,
        safeSummaryOnly: true,
      };
    }
    let parsed;
    try {
      parsed = JSON.parse(bodyRead.bodyText || "{}");
    } catch {
      return {
        routeLabel,
        httpStatus: response.status,
        ok: false,
        body: {},
        targetHostAllowlistPassed: true,
        allRequestedHostsLoopback: true,
        redirectFollowed: false,
        proxyEnvForwarded: false,
        failureLabels: ["invalid_json"],
        safeSummaryOnly: true,
      };
    }
    const plain = parsed && typeof parsed === "object" && !Array.isArray(parsed);
    return {
      routeLabel,
      httpStatus: response.status,
      ok: response.ok && plain,
      body: plain ? parsed : {},
      targetHostAllowlistPassed: true,
      allRequestedHostsLoopback: true,
      redirectFollowed: false,
      proxyEnvForwarded: false,
      failureLabels: [
        ...(response.ok ? [] : ["http_not_success"]),
        ...(plain ? [] : ["response_not_json_object"]),
      ],
      safeSummaryOnly: true,
    };
  } catch {
    const aborted = controller.signal.aborted;
    return {
      routeLabel,
      httpStatus: 0,
      ok: false,
      body: {},
      targetHostAllowlistPassed: true,
      allRequestedHostsLoopback: true,
      redirectFollowed: false,
      proxyEnvForwarded: false,
      failureLabels: [aborted ? "request_timeout" : "http_not_success"],
      safeSummaryOnly: true,
    };
  } finally {
    clearTimeout(timeout);
  }
}
