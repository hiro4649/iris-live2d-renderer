---
project: IRIS-live2d-renderer
role: renderer behavior guardrails
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/run-iris-live2d-renderer-evals.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Behavior

## Required Behavior

- Treat readiness as false until real readiness evidence is present.
- Keep mock, fixture, cue-only, and local bridge evidence separate from real renderer readiness.
- Return safe status summaries from health, status, engine, and cue paths.
- Preserve renderer scope and do not modify IRIS body behavior.
- Record unclear renderer decisions in `docs/iris-live2d-renderer/QUESTIONS.md`.

## Reporting Behavior

Reports may include status labels, boolean readiness fields, safe reason labels, and command names.
Reports must not include raw payloads, raw logs, raw model paths, endpoint values, or secrets.

## Failure Behavior

On SDK load, model load, heartbeat, cue capability, or cue application failure, keep readiness false and report a safe reason label.
