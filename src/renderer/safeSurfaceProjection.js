import * as provisioningFactories from "./cubismLoaderProvisioning.js";
import { MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY } from "./motionIdentityComfortSurfaceRegistry.js";

export const SAFE_SURFACE_PROJECTION_SCHEMA = "live2d_safe_surface_projection_v1";

const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "prototype", "constructor"]);

export const MOTION_IDENTITY_COMFORT_FACTORY_MAP = Object.freeze(
  Object.fromEntries(
    MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.map((entry) => [
      entry.factory,
      provisioningFactories[entry.factory],
    ]),
  ),
);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasUnsafePublicKey(value) {
  return typeof value !== "string" || !value || PROTOTYPE_POLLUTION_KEYS.has(value);
}

export function validateRegisteredFactoryMap({
  registry = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY,
  factoryMap = MOTION_IDENTITY_COMFORT_FACTORY_MAP,
} = {}) {
  const failures = [];
  for (const entry of registry) {
    if (!Object.hasOwn(factoryMap, entry.factory)) {
      failures.push(`missing_factory:${entry.id}`);
      continue;
    }
    if (typeof factoryMap[entry.factory] !== "function") {
      failures.push(`factory_not_function:${entry.id}`);
    }
  }
  return {
    schema: SAFE_SURFACE_PROJECTION_SCHEMA,
    safeSummaryOnly: true,
    status: failures.length ? "fail" : "pass",
    failures,
    registryEntryCount: registry.length,
  };
}

export function resolveRegisteredFactory(entry, factoryMap = MOTION_IDENTITY_COMFORT_FACTORY_MAP) {
  if (!entry || typeof entry !== "object") {
    return { status: "rejected", reason: "missing_registry_entry" };
  }
  if (typeof entry.factory !== "string" || !entry.factory) {
    return { status: "rejected", reason: "missing_factory_label", id: entry.id };
  }
  if (!Object.hasOwn(factoryMap, entry.factory)) {
    return { status: "rejected", reason: "unknown_factory", id: entry.id };
  }
  if (typeof factoryMap[entry.factory] !== "function") {
    return { status: "rejected", reason: "factory_not_function", id: entry.id };
  }
  return {
    status: "resolved",
    id: entry.id,
    factory: factoryMap[entry.factory],
  };
}

export function buildRegisteredSafeSummaryMap({
  registry = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY,
  factoryMap = MOTION_IDENTITY_COMFORT_FACTORY_MAP,
  contextAdapters = {},
} = {}) {
  const failures = [];
  const projected = {};
  const publicKeys = new Set();
  for (const entry of registry) {
    if (hasUnsafePublicKey(entry.publicKey)) {
      failures.push(`unsafe_public_key:${entry.id}`);
      continue;
    }
    if (publicKeys.has(entry.publicKey)) {
      failures.push(`duplicate_public_key:${entry.publicKey}`);
      continue;
    }
    publicKeys.add(entry.publicKey);
    if (entry.authorizing !== false) failures.push(`authorizing_true:${entry.id}`);
    if (entry.readinessEffect !== "none") failures.push(`readiness_effect:${entry.id}`);
    if (entry.ownerEffect !== "none") failures.push(`owner_effect:${entry.id}`);
    if (entry.actualDataEffect !== "none") failures.push(`actual_data_effect:${entry.id}`);
    if (entry.dynamicContextRequired === true && !entry.contextAdapterId) {
      failures.push(`dynamic_context_adapter_missing:${entry.id}`);
      continue;
    }
    const resolved = resolveRegisteredFactory(entry, factoryMap);
    if (resolved.status !== "resolved") {
      failures.push(`${resolved.reason}:${entry.id}`);
      continue;
    }
    const context = entry.dynamicContextRequired === true ? contextAdapters[entry.contextAdapterId] : undefined;
    const output = entry.dynamicContextRequired === true ? resolved.factory(context) : resolved.factory();
    if (!isPlainObject(output)) {
      failures.push(`unsafe_output_object:${entry.id}`);
      continue;
    }
    if (!Object.hasOwn(output, "schema")) {
      failures.push(`missing_output_schema:${entry.id}`);
      continue;
    }
    if (output.schema !== entry.schema) {
      failures.push(`schema_mismatch:${entry.id}`);
      continue;
    }
    projected[entry.publicKey] = output;
  }
  return {
    schema: SAFE_SURFACE_PROJECTION_SCHEMA,
    safeSummaryOnly: true,
    status: failures.length ? "fail" : "pass",
    failures,
    summaries: projected,
    projectedIds: Object.keys(projected).sort(),
  };
}

export function projectRegisteredSafeSummaries(target, options = {}) {
  const projection = buildRegisteredSafeSummaryMap(options);
  if (projection.status !== "pass") return projection;
  Object.assign(target, projection.summaries);
  return projection;
}

export function validateProjectedSafeSummaries(surface, {
  registry = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY,
} = {}) {
  const failures = [];
  for (const entry of registry) {
    if (!Object.hasOwn(surface, entry.publicKey)) {
      failures.push(`missing_projected_key:${entry.publicKey}`);
      continue;
    }
    const value = surface[entry.publicKey];
    if (!isPlainObject(value)) {
      failures.push(`unsafe_projected_value:${entry.publicKey}`);
      continue;
    }
    if (value.schema !== entry.schema) {
      failures.push(`projected_schema_mismatch:${entry.publicKey}`);
    }
  }
  return {
    schema: SAFE_SURFACE_PROJECTION_SCHEMA,
    safeSummaryOnly: true,
    status: failures.length ? "fail" : "pass",
    failures,
    projectedIds: registry.map((entry) => entry.publicKey).sort(),
  };
}
