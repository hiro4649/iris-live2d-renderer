#!/usr/bin/env node
import { fileURLToPath } from "node:url";
import { createRendererState } from "../src/state.js";

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

const REQUIRED_SURFACE_KEYS = {
  status: ["schema", "renderer_ready", "renderer_health", "boundary_policy"],
  health: ["schema", "renderer_ready", "live2d_evidence_summary", "boundary_policy"],
  runtimeConfig: ["schema", "model3", "live2d_evidence_summary"],
};

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

export function buildLive2dSafeSurfaceInventory() {
  const state = createRendererState();
  const surfaces = Object.fromEntries(
    Object.entries(SURFACE_BUILDERS).map(([name, builder]) => [name, builder(state)]),
  );
  const entries = Object.entries(surfaces).map(([name, surface]) => classifySurface(name, surface));
  const failures = entries.flatMap((entry) => [
    ...entry.missingKeys.map((key) => `${entry.id}:missing:${key}`),
    ...entry.trueAuthorizingKeys.map((key) => `${entry.id}:authorizing_true:${key}`),
    ...entry.executableDatasetKeys.map((key) => `${entry.id}:dataset_executable:${key}`),
    ...entry.priorityResolved.map((key) => `${entry.id}:priority_resolved:${key}`),
    ...entry.checkedRowCountNonZero.map((key) => `${entry.id}:checked_row_count_nonzero:${key}`),
  ]);

  return {
    schema: "live2d_safe_surface_inventory_v1",
    safeSummaryOnly: true,
    surfaceCount: entries.length,
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
