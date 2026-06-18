export const LIVE2D_R2_LOCALHOST_PROBE_REPRODUCIBILITY_SCHEMA =
  "live2d_r2_localhost_probe_reproducibility_attestation_v1";

export const LIVE2D_R2_REPRODUCIBILITY_FAILURE_LABELS = Object.freeze([
  "run_count_invalid",
  "run_blocked",
  "route_set_variance",
  "schema_variance",
  "required_field_variance",
  "boundary_variance",
  "cross_surface_variance",
  "cleanup_variance",
  "port_release_variance",
  "network_boundary_variance",
  "raw_persistence_variance",
  "semantic_variance",
]);

function unique(labels) {
  return [...new Set(labels.filter((label) => LIVE2D_R2_REPRODUCIBILITY_FAILURE_LABELS.includes(label)))];
}

function statusFromFailures(failures, label) {
  return failures.includes(label) ? "blocked" : "pass";
}

function routeSignature(envelope) {
  return (envelope?.routeLabels || []).join(",");
}

function semanticSignature(envelope) {
  return [
    envelope?.routeSetStatus,
    envelope?.schemaParityStatus,
    envelope?.requiredFieldPresenceStatus,
    envelope?.criticalBoundaryStatus,
    envelope?.crossSurfaceParityStatus,
    envelope?.processStopped,
    envelope?.portReleased,
    envelope?.externalNetworkUsed,
    envelope?.rawResponseStored,
    envelope?.rawResponsePrinted,
    envelope?.ownerConfirmationCreated,
    envelope?.runtimeReadinessClaimed,
    envelope?.productionReadinessClaimed,
    envelope?.priority1Resolved,
    envelope?.checkedRowCountIncreased,
    envelope?.motionDatasetExecutable,
  ].join("|");
}

export function buildLocalhostProcessProbeReproducibilityAttestation({ runEnvelopes = [], expectedRunCount = 5 } = {}) {
  const failures = [];
  if (!Array.isArray(runEnvelopes) || runEnvelopes.length !== expectedRunCount) failures.push("run_count_invalid");

  const blockedCount = runEnvelopes.filter((envelope) => envelope?.probeStatus !== "pass").length;
  if (blockedCount > 0) failures.push("run_blocked");

  const routeSignatures = new Set(runEnvelopes.map(routeSignature));
  if (routeSignatures.size !== 1 || routeSignatures.has("")) failures.push("route_set_variance");

  if (runEnvelopes.some((envelope) => envelope?.schemaParityStatus !== "pass")) failures.push("schema_variance");
  if (runEnvelopes.some((envelope) => envelope?.requiredFieldPresenceStatus !== "pass")) failures.push("required_field_variance");
  if (runEnvelopes.some((envelope) => envelope?.criticalBoundaryStatus !== "pass")) failures.push("boundary_variance");
  if (runEnvelopes.some((envelope) => envelope?.crossSurfaceParityStatus !== "pass")) failures.push("cross_surface_variance");
  if (runEnvelopes.some((envelope) => envelope?.processStopped !== true)) failures.push("cleanup_variance");
  if (runEnvelopes.some((envelope) => envelope?.portReleased !== true)) failures.push("port_release_variance");
  if (runEnvelopes.some((envelope) => envelope?.externalNetworkUsed !== false)) failures.push("network_boundary_variance");
  if (runEnvelopes.some((envelope) => envelope?.rawResponseStored !== false || envelope?.rawResponsePrinted !== false)) {
    failures.push("raw_persistence_variance");
  }

  const semanticSignatures = new Set(runEnvelopes.map(semanticSignature));
  if (semanticSignatures.size !== 1 || semanticSignatures.has("")) failures.push("semantic_variance");

  const failureLabels = unique(failures);
  return {
    schema: LIVE2D_R2_LOCALHOST_PROBE_REPRODUCIBILITY_SCHEMA,
    runCount: Array.isArray(runEnvelopes) ? runEnvelopes.length : 0,
    passCount: runEnvelopes.length - blockedCount,
    blockedCount,
    routeCoverageStatus: statusFromFailures(failureLabels, "route_set_variance"),
    schemaParityStatus: statusFromFailures(failureLabels, "schema_variance"),
    requiredFieldPresenceStatus: statusFromFailures(failureLabels, "required_field_variance"),
    criticalBoundaryStatus: statusFromFailures(failureLabels, "boundary_variance"),
    crossSurfaceParityStatus: statusFromFailures(failureLabels, "cross_surface_variance"),
    processCleanupStatus: statusFromFailures(failureLabels, "cleanup_variance"),
    portReleaseStatus: statusFromFailures(failureLabels, "port_release_variance"),
    externalNetworkStatus: statusFromFailures(failureLabels, "network_boundary_variance"),
    rawResponsePersistenceStatus: statusFromFailures(failureLabels, "raw_persistence_variance"),
    semanticReproducibilityStatus: statusFromFailures(failureLabels, "semantic_variance"),
    failureLabels,
    safeSummaryOnly: true,
  };
}
