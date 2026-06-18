import assert from "node:assert/strict";
import {
  LIVE2D_R2_COMPACT_PROBE_MAX_BYTES,
  LIVE2D_R2_COMPACT_PROBE_SURFACE_SCHEMA,
  buildR2CompactProbeSurface,
  projectR2CompactHealthSurface,
  validateR2CompactProbeSurface,
} from "../src/renderer/r2CompactProbeSurface.js";
import { createRendererState } from "../src/state.js";

function sources() {
  const state = createRendererState();
  return {
    health: state.health(),
    status: state.status(),
    runtimeConfig: state.browserRuntimeConfig(),
  };
}

const safe = buildR2CompactProbeSurface(sources());
assert.equal(safe.ok, true);
assert.equal(safe.schema, LIVE2D_R2_COMPACT_PROBE_SURFACE_SCHEMA);
assert.equal(safe.surfaceCount, 3);
assert.deepEqual(safe.surfaceLabels, ["health", "status", "runtime_config"]);
assert.equal(safe.projectionStatus, "pass");
assert.equal(safe.crossSurfaceParityStatus, "pass");
assert.equal(safe.runtimeReadinessClaimed, false);
assert.equal(safe.productionReadinessClaimed, false);
assert.equal(safe.ownerConfirmationCreated, false);
assert.equal(safe.ownerConfirmationConfirmed, false);
assert.equal(safe.actualIngestionAllowed, false);
assert.equal(safe.trustedLoaderAllowlistEnabled, false);
assert.equal(safe.priority1Status, "BLOCKED");
assert.equal(safe.checkedRowCount, 0);
assert.equal(safe.motionDatasetExecutable, false);
assert.equal(safe.safeSummaryOnly, true);
assert.equal(Buffer.byteLength(JSON.stringify(safe), "utf8") < LIVE2D_R2_COMPACT_PROBE_MAX_BYTES, true);
assert.equal(validateR2CompactProbeSurface(safe).ok, true);

const first = JSON.stringify(buildR2CompactProbeSurface(sources()));
const second = JSON.stringify(buildR2CompactProbeSurface(sources()));
assert.equal(first, second);

const original = sources();
const originalSerialized = JSON.stringify(original);
buildR2CompactProbeSurface(original);
assert.equal(JSON.stringify(original), originalSerialized);

const polluted = JSON.parse(JSON.stringify(sources()));
Object.setPrototypeOf(polluted.health.live2d_safe_summary_v2, { runtimeReadinessClaimed: true });
assert.equal(buildR2CompactProbeSurface(polluted).ok, false);

for (const [name, mutate, label] of [
  ["missing source", (s) => { s.health = null; }, "source_not_plain_object"],
  ["wrong schema", (s) => { s.health.schema = "wrong"; }, "source_schema_mismatch"],
  ["missing schema", (s) => { delete s.health.schema; }, "source_schema_missing"],
  ["missing field", (s) => { delete s.status.renderer_health.model_loaded; }, "source_required_field_missing"],
  ["wrong type", (s) => { s.status.renderer_health.model_loaded = "false"; }, "source_required_field_wrong_type"],
  ["renderer ready", (s) => { s.health.renderer_ready = true; }, "source_boundary_violation"],
  ["priority", (s) => { s.health.live2d_safe_summary_v2.priority1Status = "READY"; }, "source_boundary_violation"],
  ["checked rows", (s) => { s.status.live2d_safe_summary_v2.checkedRowCount = 1; }, "source_boundary_violation"],
  ["motion", (s) => { s.runtimeConfig.live2d_safe_summary_v2.motionDatasetExecutable = true; }, "source_boundary_violation"],
  ["owner", (s) => { s.runtimeConfig.live2d_safe_summary_v2.ownerConfirmationConfirmed = true; }, "source_boundary_violation"],
  ["runtime", (s) => { s.runtimeConfig.live2d_safe_summary_v2.runtimeReadinessClaimed = true; }, "source_boundary_violation"],
  ["production", (s) => { s.runtimeConfig.live2d_safe_summary_v2.productionReadinessClaimed = true; }, "source_boundary_violation"],
  ["trusted", (s) => { s.runtimeConfig.live2d_safe_summary_v2.trustedLoaderAllowlistEnabled = true; }, "source_boundary_violation"],
  ["actual ingestion", (s) => { s.runtimeConfig.live2d_safe_summary_v2.actualIngestionAllowed = true; }, "source_boundary_violation"],
  ["missing summary", (s) => { delete s.runtimeConfig.live2d_safe_summary_v2; }, "source_required_field_missing"],
  ["summary attention", (s) => { s.runtimeConfig.live2d_safe_summary_v2.overallStatus = "attention"; }, "compact_summary_not_blocked"],
]) {
  const source = sources();
  mutate(source);
  const blocked = buildR2CompactProbeSurface(source);
  assert.equal(blocked.ok, false, name);
  assert.equal(blocked.failureLabels.includes(label), true, name);
}

assert.equal(projectR2CompactHealthSurface([]).failureLabels.includes("source_not_plain_object"), true);

const serialized = JSON.stringify(safe);
for (const unsafe of ["secret", "token", "private_path", "raw_payload"]) {
  assert.equal(serialized.includes(unsafe), false);
}

console.log("r2-compact-probe-surface: pass");
