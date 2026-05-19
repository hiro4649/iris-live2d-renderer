---
project: IRIS-live2d-renderer
role: human review policy
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/verify-iris-live2d-renderer.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Review Policy

## Current Decision

Keep IRIS-live2d-renderer at R3 when the change touches renderer behavior, renderer boundaries, or harness policy.
Do not lower R3 to make a PR easier to merge.

## Human Review Required

Human review is required for:

- Live2D cue schema changes
- renderer boundary changes
- adapter handoff changes
- public summary changes
- engine response normalization changes
- secret, token, credential, or auth-related changes
- source changes that affect renderer behavior
- quality gate policy changes
- test expectation changes
- `.env` or environment sample changes

## Normal Review Is Enough

Normal review is enough for:

- typo fixes
- clear documentation cleanup
- report record updates
- verification result transcription
- small explanation updates that do not touch source, harness policy, env samples, or renderer contracts

## Review Evidence

For R3 changes, reviewers must confirm:

- the change keeps `renderer_ready=true` tied to real renderer evidence
- no raw cue payload, raw model path, endpoint value, secret, or raw log is exposed
- IRIS body behavior is not changed from this renderer repo
- local verification passed
- remote quality-gate is checked before merge
