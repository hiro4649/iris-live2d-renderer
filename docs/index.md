---
project: IRIS-live2d-renderer
role: documentation index
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/lint-iris-live2d-renderer-docs.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Documentation Index

## Authority

1. `docs/iris-live2d-renderer/SPEC.md`
2. `docs/iris-live2d-renderer/BEHAVIOR.md`
3. `docs/iris-live2d-renderer/PROMPT_RULES.md`
4. `docs/iris-live2d-renderer/EVALS.md`
5. `docs/iris-live2d-renderer/FAILURES.md`
6. `docs/iris-live2d-renderer/REVIEW_POLICY.md`
7. `docs/iris-live2d-renderer/QUALITY_SCORE.md`
8. `docs/iris-live2d-renderer/QUESTIONS.md`

This renderer project is a sibling of IRIS.
It must not rewrite IRIS body authority.

## Process

- Use `bash scripts/verify-iris-live2d-renderer.sh` as the project-level Codex verification entrypoint.
- Use `bash scripts/lint-iris-live2d-renderer-docs.sh` after renderer markdown changes.
- Use `bash scripts/check-iris-live2d-renderer-boundaries.sh` to detect IRIS body or FUNKY mixing.
- Use `bash scripts/run-iris-live2d-renderer-evals.sh` to run the lightweight renderer evals.

## Reports

Generated non-secret local reports belong under `reports/iris-live2d-renderer/`.
