import assert from "node:assert/strict";
import {
  LIVE2D_R2_LOCALHOST_PROBE_FAILURE_LABELS,
  LIVE2D_R2_LOCALHOST_PROBE_ROUTE_CONTRACTS,
  LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS,
  getLive2dR2LocalhostProbeRouteContract,
} from "../src/renderer/localhostProbeRouteContract.js";
import { live2dR2RouteContractManifest } from "../src/renderer/localhostProcessProbeEnvelopeV2.js";

assert.deepEqual(LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS, ["health", "status", "runtime_config"]);
assert.equal(LIVE2D_R2_LOCALHOST_PROBE_ROUTE_CONTRACTS.length, 3);
assert.equal(getLive2dR2LocalhostProbeRouteContract("health").path, "/health");
assert.equal(getLive2dR2LocalhostProbeRouteContract("status").path, "/status");
assert.equal(getLive2dR2LocalhostProbeRouteContract("runtime_config").path, "/renderer/runtime-config");
assert.equal(getLive2dR2LocalhostProbeRouteContract("unknown"), null);

for (const contract of LIVE2D_R2_LOCALHOST_PROBE_ROUTE_CONTRACTS) {
  assert.equal(typeof contract.expectedSchema, "string");
  assert.equal(contract.requiredSelectors.some((selector) => selector.join(".") === "schema"), true);
  assert.equal(contract.requiredSelectors.some((selector) => selector.join(".") === "live2d_safe_summary_v2"), true);
  assert.equal(contract.compactSummarySelector.join("."), "live2d_safe_summary_v2");
}

for (const label of [
  "route_missing",
  "route_duplicate",
  "route_unknown",
  "required_field_missing",
  "required_field_wrong_type",
  "cross_surface_mismatch",
  "host_not_loopback",
]) {
  assert.equal(LIVE2D_R2_LOCALHOST_PROBE_FAILURE_LABELS.includes(label), true);
}

const manifest = live2dR2RouteContractManifest();
assert.equal(manifest.schema, "live2d_r2_localhost_route_contract_v1");
assert.deepEqual(manifest.routeLabels, LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS);
assert.equal(manifest.routes.length, 3);
assert.equal(JSON.stringify(manifest).includes("endpoint"), false);
assert.equal(manifest.safeSummaryOnly, true);

console.log("localhost-probe-route-contract: pass");
