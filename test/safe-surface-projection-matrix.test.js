import assert from "node:assert/strict";
import "./safe-surface-characterization.test.js";
import { createRendererState } from "../src/state.js";
import {
  SAFE_SURFACE_REGISTRY,
  createSafeSurfaceFromRegistry,
} from "../src/renderer/safeSurfaceRegistry.js";

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

for (const entry of SAFE_SURFACE_REGISTRY) {
  const surface = createSafeSurfaceFromRegistry(entry.id, state);
  assert.equal(surface.schema, entry.schema, entry.id);
  for (const key of entry.surfaceKeys) {
    assert.equal(Object.hasOwn(surface, key), true, `${entry.id}:${key}`);
  }
  assertNoTruthy(surface, [
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
  ], entry.id);
  assertNoResolvedPriority(surface, entry.id);
  assertCheckedRowCountZero(surface, entry.id);
}

const rejected = createSafeSurfaceFromRegistry("unknown_surface", state);
assert.equal(rejected.status, "rejected");
assert.equal(rejected.reason, "unknown_safe_surface");

console.log("safe-surface-projection-matrix: pass");
