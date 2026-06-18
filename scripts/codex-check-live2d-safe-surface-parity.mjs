#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { createRendererState } from "../src/state.js";
import {
  SAFE_SURFACE_REGISTRY,
  createSafeSurfaceFromRegistry,
  validateSafeSurfaceRegistry,
} from "../src/renderer/safeSurfaceRegistry.js";
import {
  MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY,
  validateMotionIdentityComfortSurfaceRegistry,
} from "../src/renderer/motionIdentityComfortSurfaceRegistry.js";
import {
  validateProjectedSafeSummaries,
  validateRegisteredFactoryMap,
} from "../src/renderer/safeSurfaceProjection.js";

const SURFACE_BUILDERS = {
  status: (state) => state.status(),
  health: (state) => state.health(),
  runtimeConfig: (state) => state.browserRuntimeConfig(),
};

const AUTHORITATIVE_TRUE_KEYS = new Set([
  "renderer_ready",
  "runtime_readiness_claimed",
  "runtimeReadinessClaimed",
  "production_readiness_claimed",
  "productionReadinessClaimed",
  "owner_confirmation_created",
  "ownerConfirmationCreated",
  "owner_confirmation_confirmed",
  "ownerConfirmationConfirmed",
  "actual_data_task_started",
  "actualDataTaskStarted",
  "actual_ingestion_allowed",
  "actualIngestionAllowed",
  "trusted_loader_allowlist_enabled",
  "trustedLoaderAllowlistEnabled",
]);

const NON_EXECUTABLE_KEYS = new Set([
  "motion_dataset_executable",
  "motionDatasetExecutable",
]);

const REQUIRED_SURFACE_KEYS = Object.fromEntries(
  SAFE_SURFACE_REGISTRY.map((entry) => [entry.id, entry.surfaceKeys]),
);

function visit(node, path = [], records = []) {
  if (!node || typeof node !== "object") return records;
  if (Array.isArray(node)) {
    node.forEach((value, index) => visit(value, [...path, String(index)], records));
    return records;
  }
  for (const [key, value] of Object.entries(node)) {
    const fullPath = [...path, key].join(".");
    records.push({ key, path: fullPath, value });
    visit(value, [...path, key], records);
  }
  return records;
}

function classifySurface(name, surface) {
  const keys = Object.keys(surface);
  const missingKeys = REQUIRED_SURFACE_KEYS[name].filter((key) => !keys.includes(key));
  const records = visit(surface);
  const trueAuthorizingKeys = records
    .filter((record) => AUTHORITATIVE_TRUE_KEYS.has(record.key) && record.value === true)
    .map((record) => record.path);
  const executableDatasetKeys = records
    .filter((record) => NON_EXECUTABLE_KEYS.has(record.key) && record.value === true)
    .map((record) => record.path);
  const priorityResolved = records
    .filter((record) => (record.key === "priority1_status" || record.key === "priority1Status") && record.value === "RESOLVED")
    .map((record) => record.path);
  const checkedRowCountNonZero = records
    .filter((record) => (record.key === "checked_row_count" || record.key === "checkedRowCount") && Number(record.value) !== 0)
    .map((record) => record.path);
  const schemaValues = [...new Set(records.filter((record) => record.key === "schema").map((record) => String(record.value)))].sort();

  return {
    id: name,
    publicKeyCount: keys.length,
    publicKeys: keys.sort(),
    schemaCount: schemaValues.length,
    schemaValues,
    missingKeys,
    visibility: "public_safe_summary",
    authorizing: false,
    readinessEffect: "none",
    ownerEffect: "none",
    actualDataEffect: "none",
    duplicatePublicKeys: [],
    trueAuthorizingKeys,
    executableDatasetKeys,
    priorityResolved,
    checkedRowCountNonZero,
  };
}

function duplicates(values) {
  const seen = new Set();
  const duplicateValues = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicateValues.add(value);
    seen.add(value);
  }
  return [...duplicateValues].sort();
}

function buildMotionIdentityComfortCoverage(surfaces) {
  const registeredIds = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.map((entry) => entry.id).sort();
  const registeredIdSet = new Set(registeredIds);
  const registryById = new Map(MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.map((entry) => [entry.id, entry]));
  const inventoryIds = Object.values(surfaces)
    .flatMap((surface) => Object.keys(surface).filter((key) => key.startsWith("live2d_motion_")))
    .filter((key, index, keys) => keys.indexOf(key) === index)
    .sort();
  const inventoryIdSet = new Set(inventoryIds);
  const missingRegistryIds = inventoryIds.filter((id) => !registeredIdSet.has(id));
  const orphanRegistryIds = registeredIds.filter((id) => !inventoryIdSet.has(id));
  const duplicateIds = duplicates(MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.map((entry) => entry.id));
  const duplicateSchemas = duplicates(MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.map((entry) => entry.schema));
  const duplicateSurfaceKeys = duplicates(MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.map((entry) => entry.publicKey));
  const visibilityViolations = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY
    .filter((entry) => entry.visibility !== "public_safe_summary")
    .map((entry) => entry.id)
    .sort();
  const effectViolations = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY
    .filter((entry) => (
      entry.authorizing !== false ||
      entry.readinessEffect !== "none" ||
      entry.ownerEffect !== "none" ||
      entry.actualDataEffect !== "none"
    ))
    .map((entry) => entry.id)
    .sort();
  const schemaMismatches = inventoryIds
    .filter((id) => {
      const entry = registryById.get(id);
      if (!entry) return false;
      return Object.values(surfaces).some((surface) => (
        Object.hasOwn(surface, id) &&
        surface[id] &&
        typeof surface[id] === "object" &&
        surface[id].schema !== entry.schema
      ));
    })
    .sort();
  const surfacePresenceViolations = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY
    .filter((entry) => entry.surfaces.some((surfaceName) => !Object.hasOwn(surfaces[surfaceName] || {}, entry.id)))
    .map((entry) => entry.id)
    .sort();

  return {
    registeredIds,
    inventoryIds,
    missingRegistryIds,
    orphanRegistryIds,
    duplicateIds,
    duplicateSchemas,
    duplicateSurfaceKeys,
    visibilityViolations,
    effectViolations,
    schemaMismatches,
    surfacePresenceViolations,
  };
}

export function buildLive2dSafeSurfaceInventory() {
  const state = createRendererState();
  const surfaces = Object.fromEntries(
    Object.entries(SURFACE_BUILDERS).map(([name, builder]) => [name, builder(state)]),
  );
  const entries = Object.entries(surfaces).map(([name, surface]) => classifySurface(name, surface));
  const safeSurfaceRegistry = validateSafeSurfaceRegistry();
  const motionIdentityComfortRegistry = validateMotionIdentityComfortSurfaceRegistry();
  const motionIdentityComfortCoverage = buildMotionIdentityComfortCoverage(surfaces);
  const registeredFactoryMap = validateRegisteredFactoryMap();
  const projectedSafeSummaryValidation = Object.fromEntries(
    Object.entries(surfaces).map(([surfaceName, surface]) => [surfaceName, validateProjectedSafeSummaries(surface)]),
  );
  const unknownEntry = createSafeSurfaceFromRegistry("unknown_surface", state);
  const failures = entries.flatMap((entry) => [
    ...entry.missingKeys.map((key) => `${entry.id}:missing:${key}`),
    ...entry.trueAuthorizingKeys.map((key) => `${entry.id}:authorizing_true:${key}`),
    ...entry.executableDatasetKeys.map((key) => `${entry.id}:dataset_executable:${key}`),
    ...entry.priorityResolved.map((key) => `${entry.id}:priority_resolved:${key}`),
    ...entry.checkedRowCountNonZero.map((key) => `${entry.id}:checked_row_count_nonzero:${key}`),
  ]);
  failures.push(...safeSurfaceRegistry.failures.map((failure) => `safe_surface_registry:${failure}`));
  failures.push(...motionIdentityComfortRegistry.failures.map((failure) => `motion_identity_comfort_registry:${failure}`));
  failures.push(...registeredFactoryMap.failures.map((failure) => `registered_factory_map:${failure}`));
  for (const [surfaceName, validation] of Object.entries(projectedSafeSummaryValidation)) {
    failures.push(...validation.failures.map((failure) => `projected_safe_summary:${surfaceName}:${failure}`));
    if (validation.status !== "pass") failures.push(`projected_safe_summary_failed:${surfaceName}`);
  }
  failures.push(...motionIdentityComfortCoverage.missingRegistryIds.map((id) => `motion_identity_comfort_missing_registry:${id}`));
  failures.push(...motionIdentityComfortCoverage.orphanRegistryIds.map((id) => `motion_identity_comfort_orphan_registry:${id}`));
  failures.push(...motionIdentityComfortCoverage.duplicateIds.map((id) => `motion_identity_comfort_duplicate_id:${id}`));
  failures.push(...motionIdentityComfortCoverage.duplicateSchemas.map((schema) => `motion_identity_comfort_duplicate_schema:${schema}`));
  failures.push(...motionIdentityComfortCoverage.duplicateSurfaceKeys.map((key) => `motion_identity_comfort_duplicate_surface_key:${key}`));
  failures.push(...motionIdentityComfortCoverage.visibilityViolations.map((id) => `motion_identity_comfort_visibility_violation:${id}`));
  failures.push(...motionIdentityComfortCoverage.effectViolations.map((id) => `motion_identity_comfort_effect_violation:${id}`));
  failures.push(...motionIdentityComfortCoverage.schemaMismatches.map((id) => `motion_identity_comfort_schema_mismatch:${id}`));
  failures.push(...motionIdentityComfortCoverage.surfacePresenceViolations.map((id) => `motion_identity_comfort_surface_presence:${id}`));
  if (safeSurfaceRegistry.status !== "pass") failures.push("safe_surface_registry_failed");
  if (motionIdentityComfortRegistry.status !== "pass") failures.push("motion_identity_comfort_registry_failed");
  if (registeredFactoryMap.status !== "pass") failures.push("registered_factory_map_failed");
  if (unknownEntry.status !== "rejected" || unknownEntry.reason !== "unknown_safe_surface") {
    failures.push("unknown_surface_not_rejected");
  }

  return {
    schema: "live2d_safe_surface_inventory_v1",
    safeSummaryOnly: true,
    surfaceCount: entries.length,
    registrySurfaceCount: safeSurfaceRegistry.surfaceCount,
    motionIdentityComfortRegistrySurfaceCount: motionIdentityComfortRegistry.surfaceCount,
    motionIdentityComfortCoverage,
    registeredFactoryMap,
    projectedSafeSummaryValidation,
    unknownEntryRejected: true,
    entries,
    status: failures.length ? "fail" : "pass",
    failures,
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const inventory = buildLive2dSafeSurfaceInventory();
  console.log(JSON.stringify({
    schema: inventory.schema,
    safeSummaryOnly: inventory.safeSummaryOnly,
    surfaceCount: inventory.surfaceCount,
    status: inventory.status,
    failures: inventory.failures,
    registrySurfaceCount: inventory.registrySurfaceCount,
    motionIdentityComfortRegistrySurfaceCount: inventory.motionIdentityComfortRegistrySurfaceCount,
    motionIdentityComfortCoverage: inventory.motionIdentityComfortCoverage,
    registeredFactoryMap: {
      status: inventory.registeredFactoryMap.status,
      failures: inventory.registeredFactoryMap.failures,
      registryEntryCount: inventory.registeredFactoryMap.registryEntryCount,
    },
    projectedSafeSummaryValidation: Object.fromEntries(
      Object.entries(inventory.projectedSafeSummaryValidation).map(([surfaceName, validation]) => [surfaceName, {
        status: validation.status,
        failures: validation.failures,
      }]),
    ),
    unknownEntryRejected: inventory.unknownEntryRejected,
    entries: inventory.entries.map((entry) => ({
      id: entry.id,
      publicKeyCount: entry.publicKeyCount,
      schemaCount: entry.schemaCount,
      visibility: entry.visibility,
      authorizing: entry.authorizing,
      readinessEffect: entry.readinessEffect,
      ownerEffect: entry.ownerEffect,
      actualDataEffect: entry.actualDataEffect,
    })),
  }, null, 2));
  process.exit(inventory.status === "pass" ? 0 : 1);
}
