project: IRIS-live2d-renderer
role: R3 human review policy
status: source-of-truth
last_verified: 2026-05-19
verification_command: node scripts/codex-local-quality-gate.mjs
owner: human

# IRIS-live2d-renderer Review Policy

## Current Decision

Keep IRIS-live2d-renderer at R3 for renderer behavior, renderer boundaries, Live2D cue contracts, public summaries, environment samples, test expectations, and quality-gate policy changes.

Do not lower R3 to R2 or R1 just to make merge easier. R3 is the intended safety guard.

## Human Review Required

Human review is required before merge when a change touches any of these areas:

- Live2D cue schema.
- Renderer boundary.
- Adapter handoff.
- Public summary output.
- Engine response normalization.
- Secret, token, credential, or auth handling.
- Source code that affects renderer behavior.
- Quality gate policy.
- Test expectation changes.
- `.env` files or environment samples.

## Normal Review Is Enough

Normal review is enough only for changes that do not touch source, harness policy, env samples, renderer contracts, or test expectations:

- Typo fixes.
- Clear documentation cleanup.
- Report record updates.
- Verification result transcription.
- Small explanation updates.

## Required Evidence For R3 Merge

Before merging an R3 renderer PR, confirm:

- R3 was not lowered.
- Renderer readiness still requires real renderer evidence.
- Mock health, fixture data, cue-only checks, and local bridge responses are not treated as real renderer readiness.
- Raw cue payload, raw model path, endpoint values, secrets, tokens, and credentials are not exposed in public output.
- The local quality gate passes.
- Remote quality-gate status is checked when a PR exists.
- Human review is complete.

## Forbidden Shortcuts

- Do not use a policy exception to bypass R3.
- Do not weaken quality gate policy.
- Do not hide failures with skipped, todo, or deleted tests.
- Do not mix renderer source changes with unrelated harness or documentation cleanup.
