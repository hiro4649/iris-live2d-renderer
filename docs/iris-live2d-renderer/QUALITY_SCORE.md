---
project: IRIS-live2d-renderer
role: quality score record
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/verify-iris-live2d-renderer.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Quality Score

Target: 100/100 Codex development environment.

## Current Score

Score: 90/100 pending full verification and browser-runtime eval decisions.

## Dimensions

| Dimension | Status | Notes |
| --- | --- | --- |
| Specification clarity | Strong | Renderer readiness rule is explicit. |
| Behavior consistency | Strong | False-ready and safe-output rules are documented. |
| Evaluation cases | Improved | Golden and regression case files now exist. |
| Known failures | Improved | Failure log records false-ready and leak risks. |
| Regression tests | Partial | Static regression evals exist; browser runtime evals remain unresolved. |
| Prompt stability | Improved | `docs/iris-live2d-renderer/PROMPT_RULES.md` defines Codex behavior. |
| IRIS/FUNKY separation | Improved | Boundary script checks cross-project drift. |
| Human review policy | Strong | `docs/iris-live2d-renderer/REVIEW_POLICY.md` keeps R3 for renderer behavior and boundary risk. |
| Implementation alignment | Partial | No source changes were made in this harness pass. |
| Unverified risk | Open | Real browser runtime checks remain pending. |

## Conditions For 100/100

- `bash scripts/verify-iris-live2d-renderer.sh` passes.
- The local quality gate passes.
- R3 human review is applied to renderer behavior, boundary, env, test expectation, and quality gate policy changes.
- Browser runtime readiness eval scope is implemented or explicitly deferred.
