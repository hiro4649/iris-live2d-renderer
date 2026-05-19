---
project: IRIS-live2d-renderer
role: renderer specification index
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/lint-iris-live2d-renderer-docs.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Spec

This file is the Codex-facing specification index for the renderer sibling project.
It does not define IRIS body behavior.

## Current Purpose

The renderer reports Live2D readiness and applies cue-facing renderer behavior safely.
Its Codex harness must prevent false readiness, unsafe output, and project-boundary mixing.

## Renderer Ready Rule

`renderer_ready=true` is valid only when all of these are true:

- real Cubism SDK load succeeded
- real model3 load succeeded
- model identity and scene identity match the expected runtime context
- cue capability is confirmed
- browser heartbeat is fresh
- last cue application succeeded

## Not Ready

Keep `renderer_ready=false` when evidence is only mock health, fixture health, cue-only behavior, local bridge behavior, stale heartbeat, missing SDK, missing model, or missing cue application evidence.

## Safe Output

Routes and reports must return safe summaries only.
Do not expose raw cue payloads, endpoint values, raw model paths, secrets, raw logs, or raw environment values.

## Boundary

This repository must not modify IRIS body code, IRIS authority docs, FUNKY docs, or another project.
Unclear shared behavior belongs in `docs/iris-live2d-renderer/QUESTIONS.md`.
