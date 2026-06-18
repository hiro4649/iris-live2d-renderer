import assert from "node:assert/strict";
import { buildLive2dSafeSurfaceInventory } from "../scripts/codex-check-live2d-safe-surface-parity.mjs";
import {
  MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY,
  validateMotionIdentityComfortSurfaceRegistry,
} from "../src/renderer/motionIdentityComfortSurfaceRegistry.js";

const registryStatus = validateMotionIdentityComfortSurfaceRegistry();
const inventory = buildLive2dSafeSurfaceInventory();
const coverage = inventory.motionIdentityComfortCoverage;

assert.equal(registryStatus.status, "pass");
assert.equal(inventory.status, "pass");
assert.equal(MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.length, 47);
assert.equal(coverage.registeredIds.length, coverage.inventoryIds.length);
assert.deepEqual(coverage.missingRegistryIds, []);
assert.deepEqual(coverage.orphanRegistryIds, []);
assert.deepEqual(coverage.duplicateIds, []);
assert.deepEqual(coverage.duplicateSchemas, []);
assert.deepEqual(coverage.duplicateSurfaceKeys, []);
assert.deepEqual(coverage.visibilityViolations, []);
assert.deepEqual(coverage.effectViolations, []);
assert.deepEqual(coverage.schemaMismatches, []);
assert.deepEqual(coverage.surfacePresenceViolations, []);

for (const entry of MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY) {
  assert.equal(entry.publicKey, entry.id);
  assert.equal(entry.visibility, "public_safe_summary");
  assert.equal(entry.authorizing, false);
  assert.equal(entry.readinessEffect, "none");
  assert.equal(entry.ownerEffect, "none");
  assert.equal(entry.actualDataEffect, "none");
  assert.equal(entry.redactionPolicy, "safe_summary_only");
  assert.equal(entry.dynamicContextRequired, false);
  assert.equal(entry.deprecatedBy, null);
  assert.deepEqual(entry.compatibilityAlias, []);
  assert.equal(entry.surfaces.includes("status"), true);
  assert.equal(entry.surfaces.includes("health"), true);
  assert.equal(entry.surfaces.includes("runtimeConfig"), true);
}

console.log("safe-surface-characterization: pass");
