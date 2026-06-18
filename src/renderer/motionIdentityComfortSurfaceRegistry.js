export const MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY_SCHEMA = "live2d_motion_identity_comfort_surface_registry_v1";

const SAFE_EFFECTS = Object.freeze({
  visibility: "public_safe_summary",
  authorizing: false,
  readinessEffect: "none",
  ownerEffect: "none",
  actualDataEffect: "none",
  redactionPolicy: "safe_summary_only",
  compatibilityAlias: [],
  deprecatedBy: null,
});

export const MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY = Object.freeze([
  Object.freeze({
    id: "live2d_motion_identity_profile_status_surface_summary",
    schema: "live2d_motion_identity_profile_status_surface_v1",
    factory: "createLive2dMotionIdentityProfileStatusSurfaceSummary",
    surfaceKeys: ["schema", "safe_summary_only", "motion_identity_profile_status"],
    surfaces: ["status", "health", "runtimeConfig"],
    ...SAFE_EFFECTS,
  }),
  Object.freeze({
    id: "live2d_motion_comfort_policy_status_surface_summary",
    schema: "live2d_motion_comfort_policy_status_surface_v1",
    factory: "createLive2dMotionComfortPolicyStatusSurfaceSummary",
    surfaceKeys: ["schema", "safe_summary_only", "motion_comfort_policy_status"],
    surfaces: ["status", "health", "runtimeConfig"],
    ...SAFE_EFFECTS,
  }),
  Object.freeze({
    id: "live2d_motion_freshness_policy_cross_surface_consistency_summary",
    schema: "live2d_motion_freshness_policy_cross_surface_consistency_v1",
    factory: "createLive2dMotionFreshnessPolicyCrossSurfaceConsistencySummary",
    surfaceKeys: ["schema", "safe_summary_only", "freshness_policy_consistency_status"],
    surfaces: ["status", "health", "runtimeConfig"],
    ...SAFE_EFFECTS,
  }),
]);

export function validateMotionIdentityComfortSurfaceRegistry(registry = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY) {
  const ids = new Set();
  const failures = [];
  for (const entry of registry) {
    if (ids.has(entry.id)) failures.push(`duplicate_id:${entry.id}`);
    ids.add(entry.id);
    if (entry.authorizing !== false) failures.push(`authorizing_true:${entry.id}`);
    if (entry.readinessEffect !== "none") failures.push(`readiness_effect:${entry.id}`);
    if (entry.ownerEffect !== "none") failures.push(`owner_effect:${entry.id}`);
    if (entry.actualDataEffect !== "none") failures.push(`actual_data_effect:${entry.id}`);
    const keys = new Set();
    for (const key of entry.surfaceKeys) {
      if (keys.has(key)) failures.push(`duplicate_public_key:${entry.id}:${key}`);
      keys.add(key);
    }
  }
  return {
    schema: MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY_SCHEMA,
    safeSummaryOnly: true,
    status: failures.length ? "fail" : "pass",
    failures,
    surfaceCount: registry.length,
  };
}
