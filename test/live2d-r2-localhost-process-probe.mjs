#!/usr/bin/env node
import { pathToFileURL } from "node:url";
import {
  LIVE2D_R2_COMPACT_PROBE_ROUTE_LABEL,
  LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS,
} from "../src/renderer/localhostProbeRouteContract.js";
import { buildLocalhostProcessProbeEnvelopeV2 } from "../src/renderer/localhostProcessProbeEnvelopeV2.js";
import { fetchBoundedLoopbackJson } from "../src/renderer/localhostProcessProbeTransport.js";
import {
  reserveLoopbackPort,
  startRendererProcess,
  stopRendererProcess,
  waitForPortRelease,
  waitForRendererStartup,
} from "../src/renderer/localhostProcessController.js";

function expandCompactProbeRouteResults(result) {
  if (!result.ok || !result.body?.surfaces) return [];
  return LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS.map((routeLabel) => ({
    routeLabel,
    httpStatus: result.httpStatus,
    ok: result.ok === true,
    body: result.body.surfaces[routeLabel] || {},
  }));
}

export async function runProbe() {
  const port = await reserveLoopbackPort();
  const processState = startRendererProcess({
    port,
    cwd: process.cwd(),
    env: process.env,
    r2ProbeSurfaceEnabled: true,
  });
  let cleanup = {
    processExitObserved: false,
    sigtermSent: false,
    sigkillFallbackUsed: false,
    processStopped: false,
    spawnErrorPresent: false,
    unexpectedExitPresent: false,
  };
  let portReleased = false;
  try {
    const fetchCompact = () => fetchBoundedLoopbackJson({
      routeLabel: LIVE2D_R2_COMPACT_PROBE_ROUTE_LABEL,
      port,
    });
    const startupReady = await waitForRendererStartup({
      probe: async () => {
        const result = await fetchCompact();
        return result.ok === true && result.httpStatus === 200;
      },
    });
    const compactResult = startupReady ? await fetchCompact() : null;
    const routeResults = compactResult ? expandCompactProbeRouteResults(compactResult) : [];
    cleanup = await stopRendererProcess(processState);
    portReleased = await waitForPortRelease({ port });
    return buildLocalhostProcessProbeEnvelopeV2({
      routeResults,
      processStarted: startupReady,
      processStopped: cleanup.processStopped,
      portReleased,
      hostLabel: "loopback",
      rawResponseStored: false,
      rawResponsePrinted: false,
      externalNetworkUsed: false,
      processExitObserved: cleanup.processExitObserved,
      sigtermSent: cleanup.sigtermSent,
      sigkillFallbackUsed: cleanup.sigkillFallbackUsed,
      spawnErrorPresent: cleanup.spawnErrorPresent,
      unexpectedExitPresent: cleanup.unexpectedExitPresent,
    });
  } finally {
    if (!cleanup.processStopped) {
      cleanup = await stopRendererProcess(processState);
      if (!portReleased) await waitForPortRelease({ port });
    }
  }
}

export function summarizeProbeEnvelope(envelope) {
  return {
    schema: envelope.schema,
    probeStatus: envelope.probeStatus,
    routeSetStatus: envelope.routeSetStatus,
    schemaParityStatus: envelope.schemaParityStatus,
    requiredFieldPresenceStatus: envelope.requiredFieldPresenceStatus,
    criticalBoundaryStatus: envelope.criticalBoundaryStatus,
    crossSurfaceParityStatus: envelope.crossSurfaceParityStatus,
    processStopped: envelope.processStopped,
    portReleased: envelope.portReleased,
    rawResponseStored: envelope.rawResponseStored,
    rawResponsePrinted: envelope.rawResponsePrinted,
    externalNetworkUsed: envelope.externalNetworkUsed,
    browserStarted: envelope.browserStarted,
    sdkExecuted: envelope.sdkExecuted,
    modelLoadAttempted: envelope.modelLoadAttempted,
    sceneLoadAttempted: envelope.sceneLoadAttempted,
    cueApplicationAttempted: envelope.cueApplicationAttempted,
    browserHeartbeatInjected: envelope.browserHeartbeatInjected,
    ownerConfirmationCreated: envelope.ownerConfirmationCreated,
    runtimeReadinessClaimed: envelope.runtimeReadinessClaimed,
    productionReadinessClaimed: envelope.productionReadinessClaimed,
    priority1Resolved: envelope.priority1Resolved,
    checkedRowCountIncreased: envelope.checkedRowCountIncreased,
    motionDatasetExecutable: envelope.motionDatasetExecutable,
    failureLabels: envelope.failureLabels,
    safeSummaryOnly: true,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const envelope = await runProbe();
  console.log(JSON.stringify(summarizeProbeEnvelope(envelope), null, 2));
  process.exitCode = envelope.probeStatus === "pass" ? 0 : 1;
}
