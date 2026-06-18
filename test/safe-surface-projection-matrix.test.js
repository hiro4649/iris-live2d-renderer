import assert from "node:assert/strict";
import "./safe-surface-characterization.test.js";
import { createRendererState } from "../src/state.js";
import {
  SAFE_SURFACE_REGISTRY,
  createSafeSurfaceFromRegistry,
} from "../src/renderer/safeSurfaceRegistry.js";
import { MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY } from "../src/renderer/motionIdentityComfortSurfaceRegistry.js";
import {
  buildRegisteredSafeSummaryMap,
  validateProjectedSafeSummaries,
} from "../src/renderer/safeSurfaceProjection.js";

function collect(node, predicate, results = []) {
  if (!node || typeof node !== "object") return results;
  if (Array.isArray(node)) {
    for (const value of node) collect(value, predicate, results);
    return results;
  }
  for (const [key, value] of Object.entries(node)) {
    if (predicate(key, value)) results.push({ key, value });
    collect(value, predicate, results);
  }
  return results;
}

function valuesFor(surface, keys) {
  return collect(surface, (key) => keys.includes(key)).map((entry) => entry.value);
}

function assertNoTruthy(surface, keys, label) {
  for (const value of valuesFor(surface, keys)) {
    assert.equal(value, false, label);
  }
}

function assertNoResolvedPriority(surface, label) {
  for (const value of valuesFor(surface, ["priority1_status", "priority1Status"])) {
    assert.notEqual(value, "RESOLVED", label);
  }
}

function assertCheckedRowCountZero(surface, label) {
  for (const value of valuesFor(surface, ["checked_row_count", "checkedRowCount"])) {
    assert.equal(Number(value), 0, label);
  }
}

const state = createRendererState();

const COMMON_FALSE_KEYS = [
  "runtime_readiness_claimed",
  "runtimeReadinessClaimed",
  "production_readiness_claimed",
  "productionReadinessClaimed",
  "owner_confirmation_created",
  "ownerConfirmationCreated",
  "owner_confirmation_confirmed",
  "ownerConfirmationConfirmed",
  "trusted_loader_allowlist_enabled",
  "trustedLoaderAllowlistEnabled",
  "motion_dataset_executable",
  "motionDatasetExecutable",
  "actual_ingestion_allowed",
  "actualIngestionAllowed",
];

const SAFE_SURFACE_CONTRACT_MATRIX = SAFE_SURFACE_REGISTRY.map((entry) => ({
  id: entry.id,
  schema: entry.schema,
  requiredKeys: entry.surfaceKeys,
  surface: createSafeSurfaceFromRegistry(entry.id, state),
}));

for (const contract of SAFE_SURFACE_CONTRACT_MATRIX) {
  assert.equal(contract.surface.schema, contract.schema, contract.id);
  for (const key of contract.requiredKeys) {
    assert.equal(Object.hasOwn(contract.surface, key), true, `${contract.id}:${key}`);
  }
  assertNoTruthy(contract.surface, COMMON_FALSE_KEYS, contract.id);
  assertNoResolvedPriority(contract.surface, contract.id);
  assertCheckedRowCountZero(contract.surface, contract.id);
}

const rejected = createSafeSurfaceFromRegistry("unknown_surface", state);
assert.equal(rejected.status, "rejected");
assert.equal(rejected.reason, "unknown_safe_surface");

const status = state.status();
const health = state.health();
const runtimeConfig = state.browserRuntimeConfig();
const projected = buildRegisteredSafeSummaryMap();
assert.equal(projected.status, "pass");

const MOTION_IDENTITY_COMFORT_CONTRACT_MATRIX = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.flatMap((entry) => [
  { entry, surfaceName: "status", surface: status.renderer_health[entry.publicKey] },
  { entry, surfaceName: "health", surface: health[entry.publicKey] },
  { entry, surfaceName: "runtimeConfig", surface: runtimeConfig[entry.publicKey] },
]);

for (const { entry, surfaceName, surface } of MOTION_IDENTITY_COMFORT_CONTRACT_MATRIX) {
  assert.equal(Object.hasOwn(projected.summaries, entry.publicKey), true, `${entry.id}:projected_summary`);
  assert.equal(surface.schema, entry.schema, `${entry.id}:${surfaceName}:schema`);
  assertNoTruthy(surface, COMMON_FALSE_KEYS, `${entry.id}:${surfaceName}`);
  assertNoResolvedPriority(surface, `${entry.id}:${surfaceName}`);
  assertCheckedRowCountZero(surface, `${entry.id}:${surfaceName}`);
  assert.equal(entry.authorizing, false, `${entry.id}:authorizing`);
  assert.equal(entry.readinessEffect, "none", `${entry.id}:readinessEffect`);
  assert.equal(entry.ownerEffect, "none", `${entry.id}:ownerEffect`);
  assert.equal(entry.actualDataEffect, "none", `${entry.id}:actualDataEffect`);
}

assert.equal(validateProjectedSafeSummaries(status.renderer_health).status, "pass");
assert.equal(validateProjectedSafeSummaries(health).status, "pass");
assert.equal(validateProjectedSafeSummaries(runtimeConfig).status, "pass");

console.log("safe-surface-projection-matrix: pass");
