#!/usr/bin/env bash
# CODEX_QUALITY_HARNESS_FILE v0.6.5
set -euo pipefail

node <<'NODE'
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  'docs/iris-live2d-renderer/SPEC.md',
  'docs/iris-live2d-renderer/BEHAVIOR.md',
  'docs/iris-live2d-renderer/PROMPT_RULES.md',
  'evals/iris-live2d-renderer/golden_cases.yaml',
];
const forbidden = [
  'BSC',
  'tBNB',
  'sendToWallet',
  'NFT mint',
  'chainId 97',
  'Prize hot wallet',
  'wallet signature',
  'Phase00',
  'candidate / approved / commit / execution',
];
const failures = [];

for (const file of files) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) {
    failures.push(`missing boundary file: ${file}`);
    continue;
  }
  const text = fs.readFileSync(full, 'utf8');
  for (const term of forbidden) {
    if (text.includes(term)) failures.push(`${file}: contains non-renderer project-specific term: ${term}`);
  }
}

if (failures.length) {
  console.error('check-iris-live2d-renderer-boundaries: fail');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('check-iris-live2d-renderer-boundaries: pass');
NODE
