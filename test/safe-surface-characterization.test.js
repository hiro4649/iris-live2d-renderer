import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildLive2dSafeSurfaceInventory } from "../scripts/codex-check-live2d-safe-surface-parity.mjs";
import {
  MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY,
  validateMotionIdentityComfortSurfaceRegistry,
} from "../src/renderer/motionIdentityComfortSurfaceRegistry.js";
import {
  buildRegisteredSafeSummaryMap,
  resolveRegisteredFactory,
  validateProjectedSafeSummaries,
  validateRegisteredFactoryMap,
} from "../src/renderer/safeSurfaceProjection.js";
import { createRendererState } from "../src/state.js";

const baseline = JSON.parse(readFileSync("test/fixtures/live2d-safe-surface-contract-v1.json", "utf8"));

const registryStatus = validateMotionIdentityComfortSurfaceRegistry();
const inventory = buildLive2dSafeSurfaceInventory();
const coverage = inventory.motionIdentityComfortCoverage;
const state = createRendererState();
const surfaces = {
  status: state.status(),
  health: state.health(),
  runtimeConfig: state.browserRuntimeConfig(),
};
const ADDITIVE_V2_PUBLIC_KEYS = new Set(["live2d_safe_summary_v2"]);

function legacyV1Keys(surface) {
  return Object.keys(surface).filter((key) => !ADDITIVE_V2_PUBLIC_KEYS.has(key)).sort();
}

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

for (const [surfaceName, surface] of Object.entries(surfaces)) {
  const expected = baseline.surfaces[surfaceName];
  assert.deepEqual(legacyV1Keys(surface), expected.outerPublicKeys, `${surfaceName}:outer_public_keys`);
  const schemaByPublicKey = {};
  const invariantKeysByPublicKey = {};
  for (const key of Object.keys(surface).sort()) {
    if (ADDITIVE_V2_PUBLIC_KEYS.has(key)) continue;
    const value = surface[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if (typeof value.schema === "string") schemaByPublicKey[key] = value.schema;
      const present = [
        "runtime_readiness_claimed",
        "production_readiness_claimed",
        "owner_confirmation_created",
        "owner_confirmation_confirmed",
        "actual_ingestion_allowed",
        "trusted_loader_allowlist_enabled",
        "priority1_status",
        "checked_row_count",
        "motion_dataset_executable",
      ].filter((invariantKey) => Object.hasOwn(value, invariantKey));
      if (present.length) invariantKeysByPublicKey[key] = present.sort();
    }
  }
  assert.deepEqual(schemaByPublicKey, expected.schemaByPublicKey, `${surfaceName}:schema_parity`);
  assert.deepEqual(invariantKeysByPublicKey, expected.invariantKeysByPublicKey, `${surfaceName}:invariant_key_parity`);
  assert.equal(validateProjectedSafeSummaries(surface).status, "pass", `${surfaceName}:projected_safe_summaries`);
}

assert.equal(validateRegisteredFactoryMap().status, "pass");
assert.equal(buildRegisteredSafeSummaryMap().status, "pass");
assert.equal(resolveRegisteredFactory({ id: "missing", factory: "" }).reason, "missing_factory_label");
assert.equal(resolveRegisteredFactory({ id: "unknown", factory: "notRegistered" }).reason, "unknown_factory");
assert.equal(validateRegisteredFactoryMap({
  registry: [{ id: "missing", factory: "missingFactory" }],
  factoryMap: {},
}).failures.includes("missing_factory:missing"), true);
assert.equal(validateRegisteredFactoryMap({
  registry: [{ id: "not_function", factory: "notFunction" }],
  factoryMap: { notFunction: true },
}).failures.includes("factory_not_function:not_function"), true);

function safeProjectionEntry(overrides) {
  return {
    id: "safe",
    publicKey: "safe",
    factory: "factory",
    schema: "schema",
    authorizing: false,
    readinessEffect: "none",
    ownerEffect: "none",
    actualDataEffect: "none",
    dynamicContextRequired: false,
    ...overrides,
  };
}

for (const fixture of [
  {
    registry: [safeProjectionEntry({
      id: "safe_pass",
      publicKey: "safe_pass",
      factory: MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY[0].factory,
      schema: MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY[0].schema,
    })],
    factoryMap: { [MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY[0].factory]: () => ({ schema: MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY[0].schema }) },
    reason: null,
  },
  {
    registry: [safeProjectionEntry({ id: "unsafe", publicKey: "__proto__", factory: "safe", schema: "safe_schema" })],
    factoryMap: { safe: () => ({ schema: "safe_schema" }) },
    reason: "unsafe_public_key:unsafe",
  },
  {
    registry: [safeProjectionEntry({ id: "null_output", publicKey: "null_output", factory: "nullFactory" })],
    factoryMap: { nullFactory: () => null },
    reason: "unsafe_output_object:null_output",
  },
  {
    registry: [safeProjectionEntry({ id: "array_output", publicKey: "array_output", factory: "arrayFactory" })],
    factoryMap: { arrayFactory: () => [] },
    reason: "unsafe_output_object:array_output",
  },
  {
    registry: [safeProjectionEntry({ id: "primitive_output", publicKey: "primitive_output", factory: "primitiveFactory" })],
    factoryMap: { primitiveFactory: () => "unsafe" },
    reason: "unsafe_output_object:primitive_output",
  },
  {
    registry: [safeProjectionEntry({ id: "missing_schema", publicKey: "missing_schema", factory: "missingSchemaFactory" })],
    factoryMap: { missingSchemaFactory: () => ({ safeSummaryOnly: true }) },
    reason: "missing_output_schema:missing_schema",
  },
  {
    registry: [safeProjectionEntry({ id: "schema_mismatch", publicKey: "schema_mismatch", factory: "schemaMismatchFactory", schema: "expected_schema" })],
    factoryMap: { schemaMismatchFactory: () => ({ schema: "actual_schema" }) },
    reason: "schema_mismatch:schema_mismatch",
  },
  {
    registry: [safeProjectionEntry({ id: "dynamic_missing", publicKey: "dynamic_missing", factory: "dynamicFactory", dynamicContextRequired: true })],
    factoryMap: { dynamicFactory: () => ({ schema: "schema" }) },
    reason: "dynamic_context_adapter_missing:dynamic_missing",
  },
  {
    registry: [safeProjectionEntry({ id: "authorizing", publicKey: "authorizing", authorizing: true })],
    factoryMap: { factory: () => ({ schema: "schema" }) },
    reason: "authorizing_true:authorizing",
  },
  {
    registry: [safeProjectionEntry({ id: "readiness", publicKey: "readiness", readinessEffect: "ready" })],
    factoryMap: { factory: () => ({ schema: "schema" }) },
    reason: "readiness_effect:readiness",
  },
  {
    registry: [safeProjectionEntry({ id: "owner", publicKey: "owner", ownerEffect: "confirmed" })],
    factoryMap: { factory: () => ({ schema: "schema" }) },
    reason: "owner_effect:owner",
  },
  {
    registry: [safeProjectionEntry({ id: "actual_data", publicKey: "actual_data", actualDataEffect: "ingested" })],
    factoryMap: { factory: () => ({ schema: "schema" }) },
    reason: "actual_data_effect:actual_data",
  },
]) {
  const result = buildRegisteredSafeSummaryMap({
    registry: fixture.registry,
    factoryMap: fixture.factoryMap,
  });
  if (fixture.reason) {
    assert.equal(result.failures.includes(fixture.reason), true, fixture.reason);
  } else {
    assert.equal(result.status, "pass");
  }
}

console.log("safe-surface-characterization: pass");
