---
project: IRIS-live2d-renderer
role: Codex prompt rules
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/check-iris-live2d-renderer-boundaries.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Prompt Rules

## Required

- Treat renderer readiness as false until every required real evidence item is present.
- Keep renderer work inside this repository.
- Preserve safe output summaries.
- Record unresolved renderer questions in `docs/iris-live2d-renderer/QUESTIONS.md`.
- Run the narrowest relevant checks and report failures honestly.

## Forbidden

- Do not report mock, fixture, cue-only, or local bridge evidence as real renderer readiness.
- Do not expose raw cue payloads, endpoint values, raw model paths, secrets, raw logs, or raw environment values.
- Do not use FUNKY rules as renderer authority.
- Do not edit IRIS body authority or behavior from this repository.
- Do not declare a task complete when required checks failed or were not run.
