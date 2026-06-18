import {
  LIVE2D_R2_LOCALHOST_PROBE_FAILURE_LABELS,
  LIVE2D_R2_LOCALHOST_PROBE_ROUTE_CONTRACTS,
  LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS,
  getLive2dR2LocalhostProbeRouteContract,
} from "./localhostProbeRouteContract.js";

export const LIVE2D_R2_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA = "live2d_r2_localhost_process_probe_envelope_v2";

const FAILURE_LABELS = new Set(LIVE2D_R2_LOCALHOST_PROBE_FAILURE_LABELS);

const BOUNDARY_EXPECTATIONS = Object.freeze({
  rendererReady: false,
  modelLoaded: false,
  sceneLoaded: false,
  browserCueDeliveryReady: false,
  runtimeReadinessClaimed: false,
  productionReadinessClaimed: false,
  ownerConfirmationCreated: false,
  ownerConfirmationConfirmed: false,
  actualIngestionAllowed: false,
  trustedLoaderEnabled: false,
  trustedLoaderAllowlistEnabled: false,
  priority1Status: "BLOCKED",
  checkedRowCount: 0,
  motionDatasetExecutable: false,
  compactSafeSummaryV2OverallStatus: "blocked",
});

const FIELD_FAILURE_LABELS = Object.freeze({
  rendererReady: "renderer_ready_unexpected",
  modelLoaded: "model_loaded_unexpected",
  sceneLoaded: "scene_loaded_unexpected",
  browserCueDeliveryReady: "browser_cue_delivery_ready_unexpected",
  runtimeReadinessClaimed: "runtime_readiness_claimed_unexpected",
  productionReadinessClaimed: "production_readiness_claimed_unexpected",
  ownerConfirmationCreated: "owner_confirmation_created_unexpected",
  ownerConfirmationConfirmed: "owner_confirmation_confirmed_unexpected",
  actualIngestionAllowed: "actual_ingestion_allowed_unexpected",
  trustedLoaderEnabled: "trusted_loader_enabled_unexpected",
  trustedLoaderAllowlistEnabled: "trusted_loader_allowlist_enabled_unexpected",
  priority1Status: "priority1_not_blocked",
  checkedRowCount: "checked_row_count_not_zero",
  motionDatasetExecutable: "motion_dataset_executable_unexpected",
  compactSafeSummaryV2OverallStatus: "compact_summary_not_blocked",
});

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function getSelectorValue(source, selector) {
  let current = source;
  for (const key of selector) {
    if (!isPlainObject(current) || !Object.hasOwn(current, key)) {
      return { present: false, value: undefined };
    }
    current = current[key];
  }
  return { present: true, value: current };
}

function expectedTypeFor(value) {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (typeof value === "string") return "string";
  return "unknown";
}

function valueMatchesExpected(value, expected) {
  return value === expected;
}

function selectorToLabel(selector) {
  return selector.join(".");
}

function uniqueSafeFailureLabels(labels) {
  return [...new Set(labels)].filter((label) => FAILURE_LABELS.has(label));
}

function criticalFieldSummary(contract, body) {
  return Object.entries(contract.criticalBoundarySelectors).map(([fieldName, selector]) => {
    const expectedValue = BOUNDARY_EXPECTATIONS[fieldName];
    const selected = getSelectorValue(body, selector);
    const expectedType = expectedTypeFor(expectedValue);
    const typeMatches = selected.present && typeof selected.value === expectedType;
    const valueSafe = typeMatches && valueMatchesExpected(selected.value, expectedValue);
    let safeStatusLabel = "pass";
    if (!selected.present) safeStatusLabel = "required_field_missing";
    else if (!typeMatches) safeStatusLabel = "required_field_wrong_type";
    else if (!valueSafe) safeStatusLabel = FIELD_FAILURE_LABELS[fieldName];
    return {
      fieldName,
      selector: selectorToLabel(selector),
      present: selected.present,
      expectedType,
      valueSafe,
      safeStatusLabel,
    };
  });
}

function requiredSelectorFailures(contract, body) {
  const failures = [];
  for (const selector of contract.requiredSelectors) {
    const selected = getSelectorValue(body, selector);
    if (!selected.present) {
      failures.push(selector.length === 1 && selector[0] === "schema" ? "schema_missing" : "required_field_missing");
    }
  }
  return failures;
}

export function summarizeLocalhostProbeBodyV2(routeLabel, body = {}) {
  const contract = getLive2dR2LocalhostProbeRouteContract(routeLabel);
  if (!contract) {
    return {
      routeLabel: "unknown_route",
      responseShape: "invalid",
      schemaStatus: "blocked",
      criticalBoundaryStatus: "blocked",
      compactSafeSummaryV2Present: false,
      failureLabels: ["route_unknown"],
      safeSummaryOnly: true,
    };
  }

  if (!isPlainObject(body)) {
    return {
      routeLabel,
      responseShape: "invalid",
      schemaStatus: "blocked",
      criticalBoundaryStatus: "blocked",
      compactSafeSummaryV2Present: false,
      failureLabels: ["response_not_json_object"],
      safeSummaryOnly: true,
    };
  }

  const fields = criticalFieldSummary(contract, body);
  const compactSummary = getSelectorValue(body, contract.compactSummarySelector);
  const schema = getSelectorValue(body, ["schema"]);
  const compactSummaryPresent = compactSummary.present && isPlainObject(compactSummary.value);
  const failureLabels = [
    ...requiredSelectorFailures(contract, body),
    ...(schema.present && schema.value !== contract.expectedSchema ? ["schema_mismatch"] : []),
    ...fields.map((field) => field.safeStatusLabel).filter((label) => label !== "pass"),
    ...(!compactSummaryPresent ? ["compact_summary_missing"] : []),
  ];

  return {
    routeLabel,
    responseShape: "json_object",
    expectedSchema: contract.expectedSchema,
    schemaStatus: schema.present && schema.value === contract.expectedSchema ? "pass" : "blocked",
    requiredFieldStatus: failureLabels.includes("required_field_missing") ||
      failureLabels.includes("required_field_wrong_type") ||
      failureLabels.includes("schema_missing")
      ? "blocked"
      : "pass",
    criticalBoundaryStatus: fields.every((field) => field.valueSafe) ? "pass" : "blocked",
    compactSafeSummaryV2Present: compactSummaryPresent,
    compactSafeSummaryV2OverallStatus: fields.find((field) => field.fieldName === "compactSafeSummaryV2OverallStatus")
      ?.safeStatusLabel === "pass" ? "blocked" : "invalid",
    criticalFields: fields,
    failureLabels: uniqueSafeFailureLabels(failureLabels),
    safeSummaryOnly: true,
  };
}

function routeSetFailures(routeSummaries) {
  const labels = routeSummaries.map((summary) => summary.routeLabel);
  const failures = [];
  for (const requiredLabel of LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS) {
    const count = labels.filter((label) => label === requiredLabel).length;
    if (count === 0) failures.push("route_missing");
    if (count > 1) failures.push("route_duplicate");
  }
  for (const label of labels) {
    if (!LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS.includes(label)) failures.push("route_unknown");
  }
  if (labels.length > LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS.length) failures.push("route_extra");
  return uniqueSafeFailureLabels(failures);
}

function semanticProjection(summary) {
  const projected = {};
  for (const field of summary.criticalFields || []) {
    projected[field.fieldName] = field.safeStatusLabel === "pass";
  }
  return projected;
}

function crossSurfaceFailures(routeSummaries) {
  const comparable = [
    "runtimeReadinessClaimed",
    "productionReadinessClaimed",
    "ownerConfirmationCreated",
    "ownerConfirmationConfirmed",
    "actualIngestionAllowed",
    "trustedLoaderAllowlistEnabled",
    "priority1Status",
    "checkedRowCount",
    "motionDatasetExecutable",
    "compactSafeSummaryV2OverallStatus",
  ];
  const projections = routeSummaries.map((summary) => semanticProjection(summary));
  for (const fieldName of comparable) {
    const values = projections.map((projection) => projection[fieldName]).filter((value) => value !== undefined);
    if (values.length !== LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS.length || values.some((value) => value !== true)) {
      return ["cross_surface_mismatch"];
    }
  }
  return [];
}

export function buildLocalhostProcessProbeEnvelopeV2({
  routeResults = [],
  processStarted = false,
  processStopped = false,
  portReleased = false,
  hostLabel = "loopback",
  rawResponseStored = false,
  rawResponsePrinted = false,
  externalNetworkUsed = false,
} = {}) {
  const routeSummaries = routeResults.map((result) => {
    const bodySummary = summarizeLocalhostProbeBodyV2(result.routeLabel, result.body);
    const httpStatusClass = Number.isInteger(result.httpStatus) ? `${Math.trunc(result.httpStatus / 100)}xx` : "unknown";
    const transportFailures = [];
    if (result.ok !== true || httpStatusClass !== "2xx") transportFailures.push("http_not_success");
    return {
      routeLabel: bodySummary.routeLabel,
      pathLabel: getLive2dR2LocalhostProbeRouteContract(result.routeLabel)?.path || "unknown",
      httpStatusClass,
      httpOk: result.ok === true,
      responseShape: bodySummary.responseShape,
      expectedSchema: bodySummary.expectedSchema || "unknown",
      schemaStatus: bodySummary.schemaStatus,
      requiredFieldStatus: bodySummary.requiredFieldStatus || "blocked",
      criticalBoundaryStatus: bodySummary.criticalBoundaryStatus,
      compactSafeSummaryV2Present: bodySummary.compactSafeSummaryV2Present,
      criticalFields: bodySummary.criticalFields || [],
      failureLabels: uniqueSafeFailureLabels([...transportFailures, ...bodySummary.failureLabels]),
      safeSummaryOnly: true,
    };
  });

  const failureLabels = uniqueSafeFailureLabels([
    ...routeSetFailures(routeSummaries),
    ...routeSummaries.flatMap((summary) => summary.failureLabels),
    ...crossSurfaceFailures(routeSummaries),
    ...(hostLabel === "loopback" ? [] : ["host_not_loopback"]),
    ...(processStarted === true ? [] : ["process_not_started"]),
    ...(processStopped === true ? [] : ["process_not_stopped"]),
    ...(portReleased === true ? [] : ["port_not_released"]),
  ]);

  const routeStatusPass = failureLabels.length === 0 &&
    routeSummaries.length === LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS.length &&
    routeSummaries.every((summary) => (
      summary.httpOk &&
      summary.schemaStatus === "pass" &&
      summary.requiredFieldStatus === "pass" &&
      summary.criticalBoundaryStatus === "pass" &&
      summary.compactSafeSummaryV2Present === true
    ));

  return {
    schema: LIVE2D_R2_LOCALHOST_PROCESS_PROBE_ENVELOPE_SCHEMA,
    probeStatus: routeStatusPass &&
      processStarted === true &&
      processStopped === true &&
      portReleased === true &&
      hostLabel === "loopback" &&
      rawResponseStored === false &&
      rawResponsePrinted === false &&
      externalNetworkUsed === false
      ? "pass"
      : "blocked",
    routeContractSchema: "live2d_r2_localhost_route_contract_v1",
    routeLabels: routeSummaries.map((summary) => summary.routeLabel),
    expectedRouteLabels: [...LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS],
    routeSummaries,
    routeSetStatus: routeSetFailures(routeSummaries).length ? "blocked" : "pass",
    schemaParityStatus: routeSummaries.every((summary) => summary.schemaStatus === "pass") ? "pass" : "blocked",
    requiredFieldPresenceStatus: routeSummaries.every((summary) => summary.requiredFieldStatus === "pass") ? "pass" : "blocked",
    criticalBoundaryStatus: routeSummaries.every((summary) => summary.criticalBoundaryStatus === "pass") ? "pass" : "blocked",
    crossSurfaceParityStatus: crossSurfaceFailures(routeSummaries).length ? "blocked" : "pass",
    hostLabel: hostLabel === "loopback" ? "loopback" : "unknown",
    processStarted: processStarted === true,
    processStopped: processStopped === true,
    portReleased: portReleased === true,
    rawResponseStored: false,
    rawResponsePrinted: false,
    externalNetworkUsed: externalNetworkUsed === true,
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
    failureLabels,
    safeSummaryOnly: true,
  };
}

export function live2dR2RouteContractManifest() {
  return {
    schema: "live2d_r2_localhost_route_contract_v1",
    routeLabels: [...LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS],
    routes: LIVE2D_R2_LOCALHOST_PROBE_ROUTE_CONTRACTS.map((contract) => ({
      routeLabel: contract.routeLabel,
      path: contract.path,
      expectedSchema: contract.expectedSchema,
      requiredSelectors: contract.requiredSelectors.map(selectorToString),
      optionalSelectors: contract.optionalSelectors.map(selectorToString),
      criticalBoundarySelectors: Object.fromEntries(
        Object.entries(contract.criticalBoundarySelectors).map(([key, selector]) => [key, selectorToString(selector)]),
      ),
      compactSummarySelector: selectorToString(contract.compactSummarySelector),
      surfaceRole: contract.surfaceRole,
    })),
    safeSummaryOnly: true,
  };
}

function selectorToString(selector) {
  return selector.join(".");
}
