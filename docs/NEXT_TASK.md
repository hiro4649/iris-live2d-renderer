# Next Task

Last updated: 2026-06-27

## Highest-Priority Next Task

`LIVE2D-HARNESS-V130-AUTHORITY-COHERENCE-REPAIR1`

## Goal

Resolve the v1.3.0 authority contradiction before any product planning extraction resumes.

## Root Cause

Latest main has mixed authority claims:

- `AGENTS.md` says active target harness is v1.3.0 and lists repository profile as FUNKY.
- `docs/process/CODEX_HARNESS_MANIFEST.json` says target harness v1.3.0 and target rollout completed.
- `docs/process/CODEX_V130_SPEC.md` says v1.3.0 is source-core, target repositories remain on v1.2.9, and v1.3.0 target rollout is not started.
- `docs/process/CODEX_ACTIVE_POLICY_INDEX.json` still has some profile-level required reads pointing at older specs.

## Required Files

- `AGENTS.md`
- `docs/process/CODEX_HARNESS_MANIFEST.json`
- `docs/process/CODEX_ACTIVE_POLICY_INDEX.json`
- `docs/process/CODEX_V130_SPEC.md`
- `scripts/codex-v130-self-test.mjs`
- `docs/PROJECT_STATUS.md`
- `docs/NEXT_TASK.md`
- `docs/CHANGELOG.md`

## Allowed Files

Same as Required Files.

## Forbidden Files

- product code
- runtime code
- planning extraction modules
- unrelated baseline fixtures
- `package.json`
- `package-lock.json`
- workflows
- SDK/vendor files
- `hiro4649/iris`

## Implementation Strategy

Use the preferred safe interpretation unless contradicted by fresh owner instruction: v1.3.0 is a source-core metadata bridge, not full target product harness. Align AGENTS, manifest, policy index, v130 spec, self-test, rollback tuple, and documentation so they agree.

## Non-Goals

- Do not start product extraction.
- Do not enable trusted loader.
- Do not claim runtime readiness.
- Do not claim production readiness.
- Do not create owner confirmation.
- Do not resolve priority1.
- Do not read actual SDK/model/dataset.

## Acceptance Criteria

- Repository profile is IRIS Live2D Renderer, not FUNKY.
- AGENTS, manifest, policy index, active spec, and active self-test agree.
- Upgrade path is coherent.
- Rollback tuple is clear.
- v130 self-test detects profile-level read drift.
- v129 rollback evidence remains valid.
- v128 and v127 compatibility remain valid.
- No product/runtime/package/workflow changes.
- Runtime readiness remains false.
- Production readiness remains false.
- Trusted loader remains disabled.
- Priority1 remains BLOCKED.
- `checked_row_count` remains 0.
- Motion dataset remains non-executable.

## Validation Steps

Run locally before any future push:

```bash
npm test
for f in $(git ls-files '*.js' '*.mjs'); do node --check "$f"; done
git diff --check
node scripts/codex-secret-safety-scan.mjs
node scripts/check-live2d-planning-module-boundaries.mjs
node scripts/check-live2d-planning-facade-boundaries.mjs
node scripts/codex-v130-self-test.mjs
node scripts/codex-v129-self-test.mjs
node scripts/codex-v128-self-test.mjs
node scripts/codex-v127-self-test.mjs
```

## Stop Conditions

- Any required authority file disagrees after repair.
- Any validation fails without a small understood local fix.
- Any change would touch forbidden files.
- Push/PR/remote CI would be needed before owner approval.
- Open PR #434 makes the same repair and must be reconciled first. Needs verification.

## Expected Risks

- Open PR #434 may overlap with this task.
- v1.3.0 semantics are internally contradictory; do not invent new semantics beyond aligning current authority files.

## Estimated Complexity

Medium.

## Next Queue After Merge

`LIVE2D-MOTION-DATASET-PLANNING-PHYSICAL-EXTRACTION-EXECUTION-REQUEST-STUBS1`
