---
project: IRIS-live2d-renderer
role: evaluation plan
status: source-of-truth
last_verified: 2026-05-19
verification_command: bash scripts/run-iris-live2d-renderer-evals.sh
owner: human
---
<!-- CODEX_QUALITY_HARNESS_FILE v0.6.5 -->

# IRIS Live2D Renderer Evals

Renderer evals guard readiness truth, safe output, and project boundaries.

## Files

- `evals/iris-live2d-renderer/golden_cases.yaml`
- `evals/iris-live2d-renderer/regression_cases.yaml`

## Golden Cases

- real readiness requires SDK, model3, identity, heartbeat, capability, and last cue evidence
- safe output does not expose raw cue or model internals
- renderer work stays out of IRIS body and FUNKY scope

## Regression Cases

- mock health reported as real readiness
- stale heartbeat reported as ready
- raw cue payload or raw model path leaked
- renderer task mutates IRIS body authority or behavior

## Running

Run:

```bash
bash scripts/run-iris-live2d-renderer-evals.sh
```

The current runner is a lightweight static harness.
It does not launch a browser or real Cubism runtime.
