#!/usr/bin/env node
import {
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

async function runProbe() {
  const port = await reserveLoopbackPort();
  const processState = startRendererProcess({ port, cwd: process.cwd(), env: process.env });
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
    const startupReady = await waitForRendererStartup({
      probe: async () => {
        const result = await fetchBoundedLoopbackJson({ routeLabel: "health", port });
        return result.ok === true && result.httpStatus === 200;
      },
    });
    const routeResults = startupReady
      ? await Promise.all(LIVE2D_R2_LOCALHOST_PROBE_ROUTE_LABELS.map((routeLabel) => (
        fetchBoundedLoopbackJson({ routeLabel, port })
      )))
      : [];
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

const envelope = await runProbe();
console.log(JSON.stringify({
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
}, null, 2));
process.exitCode = envelope.probeStatus === "pass" ? 0 : 1;
