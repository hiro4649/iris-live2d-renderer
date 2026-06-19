import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildLive2dSafeSurfaceInventory } from "../../scripts/codex-check-live2d-safe-surface-parity.mjs";
import { createRendererState } from "../../src/state.js";
import {
  SAFE_SURFACE_REGISTRY,
  createSafeSurfaceFromRegistry,
} from "../../src/renderer/safeSurfaceRegistry.js";
import {
  MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY,
  validateMotionIdentityComfortSurfaceRegistry,
} from "../../src/renderer/motionIdentityComfortSurfaceRegistry.js";
import {
  buildRegisteredSafeSummaryMap,
  resolveRegisteredFactory,
  validateProjectedSafeSummaries,
  validateRegisteredFactoryMap,
} from "../../src/renderer/safeSurfaceProjection.js";

const ADDITIVE_V2_PUBLIC_KEYS = new Set(["live2d_safe_summary_v2"]);

export function assertSafeSurfaceCharacterization() {
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

  for (const fixture of safeProjectionFixtures()) {
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
}

export function assertSafeSurfaceProjectionMatrix() {
  assertSafeSurfaceCharacterization();
  const state = createRendererState();
  const commonFalseKeys = [
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

  const safeSurfaceContractMatrix = SAFE_SURFACE_REGISTRY.map((entry) => ({
    id: entry.id,
    schema: entry.schema,
    requiredKeys: entry.surfaceKeys,
    surface: createSafeSurfaceFromRegistry(entry.id, state),
  }));

  for (const contract of safeSurfaceContractMatrix) {
    assert.equal(contract.surface.schema, contract.schema, contract.id);
    for (const key of contract.requiredKeys) {
      assert.equal(Object.hasOwn(contract.surface, key), true, `${contract.id}:${key}`);
    }
    assertNoTruthy(contract.surface, commonFalseKeys, contract.id);
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
  assert.equal(status.live2d_safe_summary_v2.schema, "iris_live2d_safe_summary_v2");
  assert.equal(health.live2d_safe_summary_v2.schema, "iris_live2d_safe_summary_v2");
  assert.equal(runtimeConfig.live2d_safe_summary_v2.schema, "iris_live2d_safe_summary_v2");

  const motionIdentityComfortContractMatrix = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY.flatMap((entry) => [
    { entry, surfaceName: "status", surface: status.renderer_health[entry.publicKey] },
    { entry, surfaceName: "health", surface: health[entry.publicKey] },
    { entry, surfaceName: "runtimeConfig", surface: runtimeConfig[entry.publicKey] },
  ]);

  for (const { entry, surfaceName, surface } of motionIdentityComfortContractMatrix) {
    assert.equal(Object.hasOwn(projected.summaries, entry.publicKey), true, `${entry.id}:projected_summary`);
    assert.equal(surface.schema, entry.schema, `${entry.id}:${surfaceName}:schema`);
    assertNoTruthy(surface, commonFalseKeys, `${entry.id}:${surfaceName}`);
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
}

function legacyV1Keys(surface) {
  return Object.keys(surface).filter((key) => !ADDITIVE_V2_PUBLIC_KEYS.has(key)).sort();
}

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

function safeProjectionFixtures() {
  return [
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
  ];
}
