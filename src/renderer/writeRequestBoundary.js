import { timingSafeEqual } from "node:crypto";
import { ContractError } from "../contracts.js";

const FORWARDED_HEADERS = [
  "forwarded",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
];

const WRITE_PATHS = new Set([
  "/cue",
  "/live2d-engine",
  "/renderer/heartbeat",
]);

const DIRECT_LOOPBACK_ADDRESSES = new Set(["127.0.0.1", "::ffff:127.0.0.1"]);

export function assertWriteRequestBoundary(request, {
  url,
  requiredApiKey = "",
  remoteWriteEnabled = false,
} = {}) {
  const decision = evaluateWriteRequestBoundary(request, {
    url,
    requiredApiKey,
    remoteWriteEnabled,
  });
  if (decision.accepted) return decision;
  const code = decision.failureLabels.includes("write_content_type_not_allowed")
    ? "invalid_json"
    : decision.failureLabels.includes("write_auth_required")
    ? "auth_required"
    : "write_boundary_rejected";
  throw new ContractError("write boundary rejected", code);
}

export function evaluateWriteRequestBoundary(request, {
  url = null,
  requiredApiKey = "",
  remoteWriteEnabled = false,
} = {}) {
  const path = String(url?.pathname ?? request?.url ?? "");
  const method = String(request?.method ?? "");
  const headers = request?.headers ?? {};
  const remoteAddress = String(request?.socket?.remoteAddress ?? "");
  const localAddress = String(request?.socket?.localAddress ?? "");
  const host = String(headers.host ?? "");
  const key = String(requiredApiKey ?? "");
  const failures = [];

  if (!WRITE_PATHS.has(path)) failures.push("write_path_not_allowed");
  if (method !== "POST") failures.push("write_method_not_allowed");
  if (url?.search) failures.push("write_query_not_allowed");
  if (!isJsonContentType(headers["content-type"])) failures.push("write_content_type_not_allowed");
  if (hasForwardedHeader(headers)) failures.push("write_forwarded_header_present");

  if (isDirectLoopback({ remoteAddress, localAddress, host })) {
    return writeDecision(failures);
  }

  if (!remoteWriteEnabled) failures.push("write_non_loopback_rejected");
  if (!key) failures.push("write_remote_key_missing");
  if (!hasValidWriteToken(headers, key)) failures.push("write_auth_required");

  return writeDecision(failures);
}

export function assertAllowedListenHost(host) {
  const value = String(host ?? "");
  if (isLoopbackListenHost(value)) return;
  if (process.env.IRIS_LIVE2D_ALLOW_NON_LOOPBACK_BIND === "1") return;
  throw new ContractError("non-loopback bind rejected", "non_loopback_bind_rejected");
}

function writeDecision(failureLabels) {
  const uniqueFailures = [...new Set(failureLabels)];
  return {
    accepted: uniqueFailures.length === 0,
    schema: "iris_live2d_write_request_boundary_decision_v1",
    failureLabels: uniqueFailures,
    safeSummaryOnly: true,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    ownerConfirmationCreated: false,
    actualIngestionAllowed: false,
    trustedLoaderEnabled: false,
    priority1Status: "BLOCKED",
    checkedRowCount: 0,
    motionDatasetExecutable: false,
  };
}

function isJsonContentType(value) {
  const text = String(value ?? "").trim().toLowerCase();
  return text === "application/json" || text === "application/json; charset=utf-8";
}

function hasForwardedHeader(headers) {
  return FORWARDED_HEADERS.some((header) => Object.hasOwn(headers, header));
}

function isDirectLoopback({ remoteAddress, localAddress, host }) {
  return DIRECT_LOOPBACK_ADDRESSES.has(remoteAddress) &&
    DIRECT_LOOPBACK_ADDRESSES.has(localAddress) &&
    isDirectLoopbackHost(host);
}

function isDirectLoopbackHost(host) {
  const match = String(host ?? "").match(/^127\.0\.0\.1:(\d{1,5})$/u);
  if (!match) return false;
  const port = Number(match[1]);
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

function isLoopbackListenHost(host) {
  return host === "127.0.0.1" || host === "::1" || host === "::ffff:127.0.0.1";
}

function hasValidWriteToken(headers, requiredApiKey) {
  if (!requiredApiKey) return false;
  const authorization = String(headers.authorization ?? "");
  const bearerToken = authorization.match(/^Bearer\s+(.+)$/iu)?.[1] ?? "";
  const explicitApiKey = String(headers["x-api-key"] ?? "");
  return constantTimeEqual(bearerToken, requiredApiKey) ||
    constantTimeEqual(explicitApiKey, requiredApiKey);
}

function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left ?? ""), "utf8");
  const rightBuffer = Buffer.from(String(right ?? ""), "utf8");
  if (leftBuffer.length !== rightBuffer.length || leftBuffer.length === 0) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}
