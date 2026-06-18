#!/usr/bin/env node
import { buildLocalhostProcessProbeReproducibilityAttestation } from "../src/renderer/localhostProcessProbeReproducibility.js";
import { runProbe } from "./live2d-r2-localhost-process-probe.mjs";

const RUN_COUNT = 5;

const runEnvelopes = [];
for (let index = 0; index < RUN_COUNT; index += 1) {
  runEnvelopes.push(await runProbe());
}

const attestation = buildLocalhostProcessProbeReproducibilityAttestation({
  runEnvelopes,
  expectedRunCount: RUN_COUNT,
});

console.log(JSON.stringify(attestation, null, 2));
process.exitCode = attestation.failureLabels.length === 0 ? 0 : 1;
