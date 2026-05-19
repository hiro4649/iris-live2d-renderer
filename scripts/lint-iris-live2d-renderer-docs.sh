#!/usr/bin/env bash
# CODEX_QUALITY_HARNESS_FILE v0.6.5
set -euo pipefail

node <<'NODE'
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];

const requiredFiles = [
  'AGENTS.md',
  'docs/index.md',
  'docs/iris-live2d-renderer/SPEC.md',
  'docs/iris-live2d-renderer/BEHAVIOR.md',
  'docs/iris-live2d-renderer/EVALS.md',
  'docs/iris-live2d-renderer/FAILURES.md',
  'docs/iris-live2d-renderer/QUESTIONS.md',
  'docs/iris-live2d-renderer/QUALITY_SCORE.md',
  'docs/iris-live2d-renderer/CHANGELOG.md',
  'docs/iris-live2d-renderer/PROMPT_RULES.md',
  'evals/iris-live2d-renderer/golden_cases.yaml',
  'evals/iris-live2d-renderer/regression_cases.yaml',
  'scripts/lint-iris-live2d-renderer-docs.sh',
  'scripts/run-iris-live2d-renderer-evals.sh',
  'scripts/check-iris-live2d-renderer-boundaries.sh',
  'scripts/verify-iris-live2d-renderer.sh',
  'reports/iris-live2d-renderer/README.md',
];

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`missing required file: ${file}`);
}

const mdFiles = requiredFiles.filter((file) => file.endsWith('.md'));
for (const file of mdFiles) {
  const text = fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file), 'utf8') : '';
  for (const field of ['project: IRIS-live2d-renderer', 'role:', 'status:', 'last_verified: 2026-05-19', 'verification_command:', 'owner: human']) {
    if (!text.includes(field)) failures.push(`${file}: missing metadata field ${field}`);
  }
  if (!text.includes('<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->')) {
    failures.push(`${file}: missing harness marker`);
  }
}

function checkPathRefs(file) {
  if (!fs.existsSync(path.join(root, file))) return;
  const text = fs.readFileSync(path.join(root, file), 'utf8');
  for (const match of text.matchAll(/`((?:\.\/)?(?:AGENTS\.md|docs\/[^` ]+|evals\/[^` ]+|scripts\/[^` ]+|reports\/[^` ]+))`/g)) {
    const ref = match[1].replace(/[.,;:)]$/, '').replace(/^\.\//, '');
    if (!ref.includes('*') && !fs.existsSync(path.join(root, ref))) {
      failures.push(`${file}: missing referenced path: ${ref}`);
    }
  }
}

for (const file of mdFiles) checkPathRefs(file);

if (failures.length) {
  console.error('lint-iris-live2d-renderer-docs: fail');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('lint-iris-live2d-renderer-docs: pass');
NODE
