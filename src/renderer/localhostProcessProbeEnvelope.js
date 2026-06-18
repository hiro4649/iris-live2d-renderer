export const LIVE2D_R1_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA = "live2d_r1_localhost_process_probe_envelope_v1";

export {
  LIVE2D_R2_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA,
  buildLocalhostProcessProbeEnvelopeV2,
  live2dR2RouteContractManifest,
  summarizeLocalhostProbeBodyV2,
} from "./localhostProcessProbeEnvelopeV2.js";

export const LIVE2D_R1_LOCALHOST_PROBE_ROUTES = Object.freeze([
  { label: "health", path: "/health" },
  { label: "status", path: "/status" },
  { label: "runtime_config", path: "/renderer/runtime-config" },
]);

const SAFE_ROUTE_LABELS = new Set(LIVE2D_R1_LOCALHOST_PROBE_ROUTES.map((route) => route.label));

function asBoolean(value) {
  return value === true;
}

function asStatusLabel(value, fallback = "unknown") {
  if (typeof value !== "string") return fallback;
  return /^[a-zA-Z0-9_.:-]{1,80}$/.test(value) ? value : fallback;
}

function pickNestedBoolean(source, path) {
  let current = source;
  for (const key of path) {
    if (!current || typeof current !== "object") return false;
    current = current[key];
  }
  return asBoolean(current);
}

export function summarizeLocalhostProbeBody(routeLabel, body = {}) {
  if (!SAFE_ROUTE_LABELS.has(routeLabel) || !body || typeof body !== "object" || Array.isArray(body)) {
    return {
      routeLabel: SAFE_ROUTE_LABELS.has(routeLabel) ? routeLabel : "unknown_route",
      responseShape: "invalid",
      safeSummaryOnly: true,
    };
  }

  return {
    routeLabel,
    responseShape: "json_object",
    rendererReady: asBoolean(body.renderer_ready),
    modelLoaded: asBoolean(body.model_loaded),
    sceneLoaded: asBoolean(body.scene_loaded),
    browserCueDeliveryReady: asBoolean(body.browser_cue_delivery_ready),
    runtimeReadinessClaimed: asBoolean(body.runtime_readiness_claimed),
    productionReadinessClaimed: asBoolean(body.production_readiness_claimed),
    ownerConfirmationCreated: asBoolean(body.owner_confirmation_created),
    ownerConfirmationConfirmed: asBoolean(body.owner_confirmation_confirmed),
    actualIngestionAllowed: asBoolean(body.actual_ingestion_allowed),
    trustedLoaderEnabled: asBoolean(body.trusted_loader_enabled),
    trustedLoaderAllowlistEnabled: asBoolean(body.trusted_loader_allowlist_enabled),
    priority1Status: asStatusLabel(body.priority1_status || body.priority1Status, "BLOCKED"),
    checkedRowCountZero: body.checked_row_count === 0 ||
      body.checkedRowCount === 0 ||
      body.live2d_safe_summary_v2?.checkedRowCount === 0,
    motionDatasetExecutable: asBoolean(body.motion_dataset_executable),
    compactSafeSummaryV2Present: Boolean(body.live2d_safe_summary_v2),
    compactSafeSummaryV2OverallStatus: asStatusLabel(body.live2d_safe_summary_v2?.overallStatus, "unknown"),
    compactSafeSummaryV2RuntimeBlocked: pickNestedBoolean(body, ["live2d_safe_summary_v2", "boundaryState", "runtimeReadinessClaimed"]) === false,
    safeSummaryOnly: true,
  };
}

export function buildLocalhostProcessProbeEnvelope({
  routeResults = [],
  processStarted = false,
  processStopped = false,
  hostLabel = "loopback",
} = {}) {
  const routeSummaries = routeResults.map((result) => ({
    routeLabel: SAFE_ROUTE_LABELS.has(result.routeLabel) ? result.routeLabel : "unknown_route",
    httpStatusClass: Number.isInteger(result.httpStatus) ? `${Math.trunc(result.httpStatus / 100)}xx` : "unknown",
    ok: result.ok === true,
    ...summarizeLocalhostProbeBody(result.routeLabel, result.body),
  }));
  const allRoutesOk = routeSummaries.length === LIVE2D_R1_LOCALHOST_PROBE_ROUTES.length &&
    routeSummaries.every((summary) => summary.ok);

  return {
    schema: LIVE2D_R1_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA,
    probeStatus: allRoutesOk && processStarted && processStopped ? "pass" : "blocked",
    hostLabel: hostLabel === "loopback" ? "loopback" : "unknown",
    routeLabels: routeSummaries.map((summary) => summary.routeLabel),
    routeSummaries,
    processStarted: processStarted === true,
    processStopped: processStopped === true,
    rawResponseStored: false,
    rawResponsePrinted: false,
    externalNetworkUsed: false,
    browserStarted: false,
    sdkExecuted: false,
    modelLoadAttempted: false,
    sceneLoadAttempted: false,
    cueApplicationAttempted: false,
    browserHeartbeatInjected: false,
    trustedLoaderEnabled: false,
    actualDataHandled: false,
    fileBodyRead: false,
    rowBodyRead: false,
    hashCalculated: false,
    parserExecuted: false,
    redactionScanExecuted: false,
    auditWritten: false,
    ownerConfirmationCreated: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    priority1Resolved: false,
    checkedRowCountIncreased: false,
    motionDatasetExecutable: false,
    safeSummaryOnly: true,
  };
}
