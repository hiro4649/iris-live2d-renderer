---
project: IRIS-live2d-renderer
role: unresolved questions
status: draft
last_verified: 2026-05-19
verification_command: bash scripts/lint-iris-live2d-renderer-docs.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Questions

## Q-001 Real Browser Runtime Evals

The current eval runner is static and does not start a browser or Cubism runtime.

Human decision needed: which browser-based renderer readiness checks should become executable regression tests?

## Q-002 Expected Model And Scene Identity Source

The renderer ready rule requires model and scene identity to match expected runtime context.

Human decision needed: what file or runtime contract is the source for expected identity in automated tests?

## Q-003 Shared IRIS Interface Contract

This renderer is a sibling project.

Human decision needed: which interface details should be documented here versus in the IRIS body repo?
