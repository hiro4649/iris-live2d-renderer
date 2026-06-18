import assert from "node:assert/strict";
import {
  LIVE2D_R2_LOCALHOST_PROBE_REPRODUCIBILITY_SCHEMA,
  buildLocalhostProcessProbeReproducibilityAttestation,
} from "../src/renderer/localhostProcessProbeReproducibility.js";

function envelope(overrides = {}) {
  return {
    probeStatus: "pass",
    routeLabels: ["health", "status", "runtime_config"],
    routeSetStatus: "pass",
    schemaParityStatus: "pass",
    requiredFieldPresenceStatus: "pass",
    criticalBoundaryStatus: "pass",
    crossSurfaceParityStatus: "pass",
    processStopped: true,
    portReleased: true,
    externalNetworkUsed: false,
    rawResponseStored: false,
    rawResponsePrinted: false,
    ownerConfirmationCreated: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    priority1Resolved: false,
    checkedRowCountIncreased: false,
    motionDatasetExecutable: false,
    ...overrides,
  };
}

function five(overrides = {}) {
  return Array.from({ length: 5 }, (_, index) => envelope(typeof overrides === "function" ? overrides(index) : overrides));
}

const pass = buildLocalhostProcessProbeReproducibilityAttestation({ runEnvelopes: five() });
assert.equal(pass.schema, LIVE2D_R2_LOCALHOST_PROBE_REPRODUCIBILITY_SCHEMA);
assert.equal(pass.runCount, 5);
assert.equal(pass.passCount, 5);
assert.equal(pass.blockedCount, 0);
assert.equal(pass.routeCoverageStatus, "pass");
assert.equal(pass.schemaParityStatus, "pass");
assert.equal(pass.requiredFieldPresenceStatus, "pass");
assert.equal(pass.criticalBoundaryStatus, "pass");
assert.equal(pass.crossSurfaceParityStatus, "pass");
assert.equal(pass.processCleanupStatus, "pass");
assert.equal(pass.portReleaseStatus, "pass");
assert.equal(pass.externalNetworkStatus, "pass");
assert.equal(pass.rawResponsePersistenceStatus, "pass");
assert.equal(pass.semanticReproducibilityStatus, "pass");
assert.deepEqual(pass.failureLabels, []);
assert.equal(pass.safeSummaryOnly, true);

for (const [name, runEnvelopes, label] of [
  ["count", four(), "run_count_invalid"],
  ["blocked", five({ probeStatus: "blocked" }), "run_blocked"],
  ["route", five((index) => index === 3 ? { routeLabels: ["health"] } : {}), "route_set_variance"],
  ["schema", five({ schemaParityStatus: "blocked" }), "schema_variance"],
  ["required", five({ requiredFieldPresenceStatus: "blocked" }), "required_field_variance"],
  ["boundary", five({ criticalBoundaryStatus: "blocked" }), "boundary_variance"],
  ["cross", five({ crossSurfaceParityStatus: "blocked" }), "cross_surface_variance"],
  ["cleanup", five({ processStopped: false }), "cleanup_variance"],
  ["port", five({ portReleased: false }), "port_release_variance"],
  ["network", five({ externalNetworkUsed: true }), "network_boundary_variance"],
  ["raw", five({ rawResponseStored: true }), "raw_persistence_variance"],
  ["semantic", five((index) => index === 2 ? { checkedRowCountIncreased: true } : {}), "semantic_variance"],
]) {
  const result = buildLocalhostProcessProbeReproducibilityAttestation({ runEnvelopes });
  assert.equal(result.failureLabels.includes(label), true, name);
}

function four() {
  return Array.from({ length: 4 }, () => envelope());
}

const serialized = JSON.stringify(pass);
for (const unsafe of ["endpoint", "token", "secret", "private_path", "raw_payload", "pid", "127.0.0.1"]) {
  assert.equal(serialized.includes(unsafe), false);
}

console.log("localhost-process-probe-reproducibility: pass");
