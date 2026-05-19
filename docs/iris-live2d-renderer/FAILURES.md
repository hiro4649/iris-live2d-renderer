---
project: IRIS-live2d-renderer
role: failure log
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/run-iris-live2d-renderer-evals.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Failures

## F-001 False Renderer Readiness

Cause: Mock health, fixture health, cue-only evidence, or local bridge evidence is mistaken for real renderer readiness.

Prevention: Golden and regression evals require every real readiness dependency before `renderer_ready=true`.

## F-002 Stale Heartbeat

Cause: Renderer heartbeat is not fresh but readiness remains true.

Prevention: Regression evals require stale heartbeat to keep readiness false.

## F-003 Raw Renderer Data Leak

Cause: Reports or routes expose raw cue payloads, endpoint values, raw model paths, secrets, raw logs, or raw environment values.

Prevention: Safe-output evals and secret scan run before PR-ready work.

## F-004 Project Boundary Drift

Cause: Renderer work attempts to modify IRIS body behavior, IRIS authority docs, or another project.

Prevention: Boundary script checks renderer docs and evals for forbidden cross-project terms.
