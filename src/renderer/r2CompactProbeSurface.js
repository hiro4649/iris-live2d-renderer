export const LIVE2D_R2_COMPACT_PROBE_SURFACE_SCHEMA = "iris_live2d_r2_compact_probe_surface_v1";
export const LIVE2D_R2_COMPACT_PROBE_MAX_BYTES = 32_768;

export const LIVE2D_R2_COMPACT_PROBE_FAILURE_LABELS = Object.freeze([
  "source_not_plain_object",
  "source_schema_missing",
  "source_schema_mismatch",
  "source_required_field_missing",
  "source_required_field_wrong_type",
  "source_boundary_violation",
  "source_cross_surface_mismatch",
  "compact_summary_missing",
  "compact_summary_not_blocked",
  "compact_probe_response_too_large",
  "compact_projection_failed",
]);

const SOURCE_SCHEMAS = Object.freeze({
  health: "iris_live2d_renderer_health_v1",
  status: "iris_live2d_renderer_status_v1",
  runtime_config: "iris_live2d_browser_runtime_config_v1",
});

const SUMMARY_FIELDS = Object.freeze([
  "schema",
  "schemaVersion",
  "overallStatus",
  "priority1Status",
  "checkedRowCount",
  "runtimeReadinessClaimed",
  "productionReadinessClaimed",
  "ownerConfirmationCreated",
  "ownerConfirmationConfirmed",
  "trustedLoaderAllowlistEnabled",
  "actualIngestionAllowed",
  "motionDatasetExecutable",
  "safeSummaryOnly",
]);

const SUMMARY_EXPECTATIONS = Object.freeze({
  overallStatus: "blocked",
  priority1Status: "BLOCKED",
  checkedRowCount: 0,
  runtimeReadinessClaimed: false,
  productionReadinessClaimed: false,
  ownerConfirmationCreated: false,
  ownerConfirmationConfirmed: false,
  trustedLoaderAllowlistEnabled: false,
  actualIngestionAllowed: false,
  motionDatasetExecutable: false,
});

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function getValue(source, selector) {
  let current = source;
  for (const key of selector) {
    if (!isPlainObject(current) || !Object.hasOwn(current, key)) return { present: false, value: undefined };
    current = current[key];
  }
  return { present: true, value: current };
}

function failure(label) {
  return { ok: false, failureLabels: [label], safeSummaryOnly: true };
}

function assertSource(label, source, requiredSelectors) {
  if (!isPlainObject(source)) return failure("source_not_plain_object");
  if (!Object.hasOwn(source, "schema")) return failure("source_schema_missing");
  if (source.schema !== SOURCE_SCHEMAS[label]) return failure("source_schema_mismatch");
  for (const selector of requiredSelectors) {
    const selected = getValue(source, selector);
    if (!selected.present) return failure("source_required_field_missing");
    if (selector.at(-1) !== "live2d_safe_summary_v2" && typeof selected.value !== "boolean") {
      return failure("source_required_field_wrong_type");
    }
  }
  return { ok: true, failureLabels: [], safeSummaryOnly: true };
}

function projectSummary(source) {
  const selected = getValue(source, ["live2d_safe_summary_v2"]);
  if (!selected.present || !isPlainObject(selected.value)) return failure("compact_summary_missing");
  const summary = {};
  for (const field of SUMMARY_FIELDS) {
    if (Object.hasOwn(selected.value, field)) summary[field] = selected.value[field];
  }
  for (const [field, expected] of Object.entries(SUMMARY_EXPECTATIONS)) {
    if (summary[field] !== expected) return failure(field === "overallStatus" ? "compact_summary_not_blocked" : "source_boundary_violation");
  }
  return { ok: true, summary, failureLabels: [], safeSummaryOnly: true };
}

export function projectR2CompactHealthSurface(source) {
  const checked = assertSource("health", source, [
    ["ok"],
    ["renderer_process_alive"],
    ["renderer_ready"],
    ["trusted_loader_ready_candidate"],
    ["live2d_safe_summary_v2"],
  ]);
  if (!checked.ok) return checked;
  if (source.renderer_ready !== false || source.trusted_loader_ready_candidate !== false) return failure("source_boundary_violation");
  const summary = projectSummary(source);
  if (!summary.ok) return summary;
  return {
    ok: true,
    surface: {
      ok: source.ok === true,
      schema: SOURCE_SCHEMAS.health,
      renderer_process_alive: source.renderer_process_alive === true,
      renderer_ready: false,
      trusted_loader_ready_candidate: false,
      live2d_safe_summary_v2: summary.summary,
    },
    failureLabels: [],
    safeSummaryOnly: true,
  };
}

export function projectR2CompactStatusSurface(source) {
  const checked = assertSource("status", source, [
    ["ok"],
    ["renderer_ready"],
    ["renderer_health", "model_loaded"],
    ["renderer_health", "scene_loaded"],
    ["renderer_health", "browser_cue_delivery_ready"],
    ["renderer_health", "trusted_loader_ready_candidate"],
    ["live2d_safe_summary_v2"],
  ]);
  if (!checked.ok) return checked;
  const health = source.renderer_health;
  if (
    source.renderer_ready !== false ||
    health.model_loaded !== false ||
    health.scene_loaded !== false ||
    health.browser_cue_delivery_ready !== false ||
    health.trusted_loader_ready_candidate !== false
  ) return failure("source_boundary_violation");
  const summary = projectSummary(source);
  if (!summary.ok) return summary;
  return {
    ok: true,
    surface: {
      ok: source.ok === true,
      schema: SOURCE_SCHEMAS.status,
      renderer_ready: false,
      renderer_health: {
        model_loaded: false,
        scene_loaded: false,
        browser_cue_delivery_ready: false,
        trusted_loader_ready_candidate: false,
      },
      live2d_safe_summary_v2: summary.summary,
    },
    failureLabels: [],
    safeSummaryOnly: true,
  };
}

export function projectR2CompactRuntimeConfigSurface(source) {
  const checked = assertSource("runtime_config", source, [
    ["ok"],
    ["live2d_safe_summary_v2"],
  ]);
  if (!checked.ok) return checked;
  const summary = projectSummary(source);
  if (!summary.ok) return summary;
  return {
    ok: true,
    surface: {
      ok: source.ok === true,
      schema: SOURCE_SCHEMAS.runtime_config,
      live2d_safe_summary_v2: summary.summary,
    },
    failureLabels: [],
    safeSummaryOnly: true,
  };
}

function compactParityStatus(surfaces) {
  const summaries = Object.values(surfaces).map((surface) => surface.live2d_safe_summary_v2);
  for (const field of Object.keys(SUMMARY_EXPECTATIONS)) {
    const expected = SUMMARY_EXPECTATIONS[field];
    if (summaries.some((summary) => summary[field] !== expected)) return "blocked";
  }
  return "pass";
}

function compactResponseTooLarge(surface) {
  return Buffer.byteLength(JSON.stringify(surface), "utf8") > LIVE2D_R2_COMPACT_PROBE_MAX_BYTES;
}

function blockedSurface(label) {
  return {
    ok: false,
    schema: LIVE2D_R2_COMPACT_PROBE_SURFACE_SCHEMA,
    projectionStatus: "blocked",
    crossSurfaceParityStatus: "blocked",
    failureLabels: [label],
    safeSummaryOnly: true,
  };
}

export function buildR2CompactProbeSurface({ health, status, runtimeConfig } = {}) {
  try {
    const projectedHealth = projectR2CompactHealthSurface(health);
    const projectedStatus = projectR2CompactStatusSurface(status);
    const projectedRuntime = projectR2CompactRuntimeConfigSurface(runtimeConfig);
    const failureLabels = [
      ...projectedHealth.failureLabels,
      ...projectedStatus.failureLabels,
      ...projectedRuntime.failureLabels,
    ];
    if (failureLabels.length) {
      return blockedSurface([...new Set(failureLabels)][0] || "compact_projection_failed");
    }
    const surfaces = {
      health: projectedHealth.surface,
      status: projectedStatus.surface,
      runtime_config: projectedRuntime.surface,
    };
    const crossSurfaceParityStatus = compactParityStatus(surfaces);
    const surface = {
      ok: crossSurfaceParityStatus === "pass",
      schema: LIVE2D_R2_COMPACT_PROBE_SURFACE_SCHEMA,
      surfaceCount: 3,
      surfaceLabels: ["health", "status", "runtime_config"],
      sourceSchemas: SOURCE_SCHEMAS,
      surfaces,
      projectionStatus: "pass",
      crossSurfaceParityStatus,
      authorizing: false,
      runtimeReadinessClaimed: false,
      productionReadinessClaimed: false,
      ownerConfirmationCreated: false,
      ownerConfirmationConfirmed: false,
      actualIngestionAllowed: false,
      trustedLoaderAllowlistEnabled: false,
      priority1Status: "BLOCKED",
      checkedRowCount: 0,
      motionDatasetExecutable: false,
      safeSummaryOnly: true,
    };
    if (crossSurfaceParityStatus !== "pass") return blockedSurface("source_cross_surface_mismatch");
    if (compactResponseTooLarge(surface)) return blockedSurface("compact_probe_response_too_large");
    return surface;
  } catch {
    return blockedSurface("compact_projection_failed");
  }
}

export function validateR2CompactProbeSurface(surface) {
  if (!isPlainObject(surface)) return failure("source_not_plain_object");
  if (surface.schema !== LIVE2D_R2_COMPACT_PROBE_SURFACE_SCHEMA) return failure("source_schema_mismatch");
  if (surface.ok !== true || surface.projectionStatus !== "pass" || surface.crossSurfaceParityStatus !== "pass") {
    return failure("compact_projection_failed");
  }
  if (compactResponseTooLarge(surface)) return failure("compact_probe_response_too_large");
  return { ok: true, failureLabels: [], safeSummaryOnly: true };
}
