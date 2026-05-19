#!/usr/bin/env bash
# CODEX_QUALITY_HARNESS_FILE v0.6.5
set -euo pipefail

node <<'NODE'
const fs = require('fs');

const files = [
  'evals/iris-live2d-renderer/golden_cases.yaml',
  'evals/iris-live2d-renderer/regression_cases.yaml',
];
const requiredCaseIds = [
  'live2d-golden-real-readiness',
  'live2d-golden-not-ready-with-mock',
  'live2d-golden-safe-output',
  'live2d-golden-project-boundary',
  'live2d-regression-false-ready-from-fixture',
  'live2d-regression-stale-heartbeat',
  'live2d-regression-raw-cue-leak',
  'live2d-regression-cross-project-drift',
];

const text = files.map((file) => {
  if (!fs.existsSync(file)) throw new Error(`missing eval file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}).join('\n');

const failures = [];
for (const id of requiredCaseIds) {
  if (!text.includes(`id: ${id}`)) failures.push(`missing case: ${id}`);
}
for (const phrase of ['renderer_ready remains false', 'real SDK', 'safe summary', 'do not modify IRIS body']) {
  if (!text.includes(phrase)) failures.push(`missing expected eval phrase: ${phrase}`);
}

if (failures.length) {
  console.error('run-iris-live2d-renderer-evals: fail');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('run-iris-live2d-renderer-evals: pass');
NODE
