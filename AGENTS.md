---
project: IRIS-live2d-renderer
role: Codex entrypoint and permanent repo rules
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/verify-iris-live2d-renderer.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# AGENTS.md

This repository is for the IRIS Live2D renderer sibling project.
It is not the IRIS body repository and must not change IRIS body source, specs, reports, or authority files.

## Read First

Before renderer work, read these files in order:

1. `docs/index.md`
2. `docs/iris-live2d-renderer/SPEC.md`
3. `docs/iris-live2d-renderer/BEHAVIOR.md`
4. `docs/iris-live2d-renderer/EVALS.md`
5. `docs/iris-live2d-renderer/FAILURES.md`
6. `docs/iris-live2d-renderer/QUESTIONS.md`
7. `docs/iris-live2d-renderer/QUALITY_SCORE.md`
8. `docs/iris-live2d-renderer/REVIEW_POLICY.md`
9. `docs/iris-live2d-renderer/PROMPT_RULES.md`

If renderer docs conflict with implementation evidence, do not guess.
Record the conflict in `docs/iris-live2d-renderer/QUESTIONS.md`.

## Permanent Rules

- Keep changes small and scoped to one purpose.
- `renderer_ready=true` requires real SDK load, model3 load, matching model and scene identity, fresh browser heartbeat, cue capability confirmation, and last cue applied success.
- Mock health, fixture health, cue-only checks, and local bridge checks must not be reported as real renderer readiness.
- Do not expose raw cue payloads, secrets, endpoint values, raw model paths, raw logs, or raw environment values.
- Do not use FUNKY rules as renderer authority.
- Do not edit the IRIS body repository from this repo.
- Keep R3 human review for renderer behavior, boundary, env, test expectation, and quality gate policy changes.
- Do not use policy exceptions unless explicitly approved by a human.

## Completion Commands

Run the smallest relevant checks for the task.
For renderer harness or cross-cutting work, run:

```bash
bash scripts/verify-iris-live2d-renderer.sh
```

For PR-ready evidence, also run:

```bash
node scripts/codex-secret-safety-scan.mjs
node scripts/codex-local-quality-gate.mjs
CODEX_RUN_PROFILE_REQUIRED_CHECKS=1 node scripts/codex-local-quality-gate.mjs
CODEX_QUALITY_REPORT=json node scripts/codex-local-quality-gate.mjs
git diff --check
```

Report changed files, successful checks, failed checks, and residual risks.
