export const SAFE_SURFACE_REGISTRY_SCHEMA = "live2d_safe_surface_registry_v1";

export const SAFE_SURFACE_EFFECTS = Object.freeze({
  visibility: "public_safe_summary",
  authorizing: false,
  readinessEffect: "none",
  ownerEffect: "none",
  actualDataEffect: "none",
  redactionPolicy: "safe_summary_only",
});

export const SAFE_SURFACE_REGISTRY = Object.freeze([
  Object.freeze({
    id: "status",
    schema: "iris_live2d_renderer_status_v1",
    factory: "state.status",
    surfaceKeys: ["schema", "renderer_ready", "renderer_health", "live2d_safe_summary_v2", "boundary_policy"],
    surfaces: ["GET /status"],
    ...SAFE_SURFACE_EFFECTS,
    compatibilityAlias: [],
    deprecatedBy: null,
  }),
  Object.freeze({
    id: "health",
    schema: "iris_live2d_renderer_health_v1",
    factory: "state.health",
    surfaceKeys: ["schema", "renderer_ready", "live2d_evidence_summary", "live2d_safe_summary_v2", "boundary_policy"],
    surfaces: ["GET /health"],
    ...SAFE_SURFACE_EFFECTS,
    compatibilityAlias: [],
    deprecatedBy: null,
  }),
  Object.freeze({
    id: "runtimeConfig",
    schema: "iris_live2d_browser_runtime_config_v1",
    factory: "state.browserRuntimeConfig",
    surfaceKeys: ["schema", "model3", "live2d_evidence_summary", "live2d_safe_summary_v2"],
    surfaces: ["GET /renderer/runtime-config"],
    ...SAFE_SURFACE_EFFECTS,
    compatibilityAlias: ["runtime-config"],
    deprecatedBy: null,
  }),
]);

export function validateSafeSurfaceRegistry(registry = SAFE_SURFACE_REGISTRY) {
  const ids = new Set();
  const schemas = new Set();
  const failures = [];

  for (const entry of registry) {
    if (ids.has(entry.id)) failures.push(`duplicate_id:${entry.id}`);
    ids.add(entry.id);
    if (schemas.has(entry.schema)) failures.push(`duplicate_schema:${entry.schema}`);
    schemas.add(entry.schema);
    if (entry.authorizing !== false) failures.push(`authorizing_true:${entry.id}`);
    if (entry.readinessEffect !== "none") failures.push(`readiness_effect:${entry.id}`);
    if (entry.ownerEffect !== "none") failures.push(`owner_effect:${entry.id}`);
    if (entry.actualDataEffect !== "none") failures.push(`actual_data_effect:${entry.id}`);
    const entryKeys = new Set();
    for (const key of entry.surfaceKeys) {
      if (entryKeys.has(key)) failures.push(`duplicate_public_key:${entry.id}:${key}`);
      entryKeys.add(key);
    }
  }

  return {
    schema: SAFE_SURFACE_REGISTRY_SCHEMA,
    safeSummaryOnly: true,
    status: failures.length ? "fail" : "pass",
    failures,
    surfaceCount: registry.length,
  };
}

export function resolveSafeSurfaceRegistryEntry(id, registry = SAFE_SURFACE_REGISTRY) {
  return registry.find((entry) => entry.id === id) || null;
}

export function createSafeSurfaceFromRegistry(id, state) {
  const entry = resolveSafeSurfaceRegistryEntry(id);
  if (!entry || !state) return { status: "rejected", reason: "unknown_safe_surface" };
  if (entry.factory === "state.status") return state.status();
  if (entry.factory === "state.health") return state.health();
  if (entry.factory === "state.browserRuntimeConfig") return state.browserRuntimeConfig();
  return { status: "rejected", reason: "unknown_safe_surface_factory" };
}
