# Next Task

Last updated: 2026-06-27

## Highest-Priority Next Task

`LIVE2D-MOTION-DATASET-PLANNING-PHYSICAL-EXTRACTION-EXECUTION-REQUEST-STUBS1`

## Goal

Prepare planning-only execution request stubs for the remaining motion-dataset physical extraction queue without starting actual data work.

## Preconditions

- AUTH2 local authority coherence repair must remain passing.
- Push/PR/remote CI remain blocked until owner approval after the GitHub Actions quota reset.
- PR #434 is superseded by the local branch and must be reconciled before product work.
- Work remains planning-only and local-only unless owner explicitly approves remote work.

## Required Files

- `docs/iris-live2d-renderer/LIVE2D_PLANNING_MODULE_BOUNDARIES.md`
- `docs/PROJECT_SPEC.md`
- `docs/PROJECT_STATUS.md`
- `docs/NEXT_TASK.md`
- `docs/CHANGELOG.md`

## Allowed Files

Planning docs and project docs only, unless fresh inspection shows an existing planning metadata file is the correct local-only place for execution request stubs.

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

Add planning-only execution request stubs that define what would be requested before physical extraction continues. The stubs should list candidate symbol groups, owner preconditions, forbidden evidence, local validation, and stop conditions. They must not move symbols, ingest data, execute parsers, read SDK/model/dataset files, or claim readiness.

## Non-Goals

- Do not start product extraction.
- Do not enable trusted loader.
- Do not claim runtime readiness.
- Do not claim production readiness.
- Do not create owner confirmation.
- Do not resolve priority1.
- Do not read actual SDK/model/dataset.

## Acceptance Criteria

- No product/runtime/package/workflow changes.
- Planning stubs are safe-summary-only.
- No actual data, actual file path, actual file content, parser, redaction, audit, SDK, renderer, or trusted loader execution.
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

- AUTH2 authority coherence regresses.
- Any validation fails without a small understood local fix.
- Any change would touch forbidden files.
- Push/PR/remote CI would be needed before owner approval.
- Open PR #434 makes the same repair and must be reconciled first. Needs verification.

## Remote Integration Plan After Approval

- Sync remote main without resetting the local branch.
- Push `codex/local-project-docs-authority-bootstrap1` as `codex/project-docs-authority-and-v130-coherence1`.
- Open one combined PR for AUTH1+AUTH2.
- Close or supersede #434 only after the replacement PR exists or immediately before replacement PR creation.
- Run one same-head remote quality gate and perform file-level audit before merge.

## Expected Risks

- Stubs could accidentally sound like execution approval; wording must keep them as request/preauth planning only.
- Local-only docs can diverge from remote if other PRs merge during the Actions pause; rebase/supersede plan will be needed later.

## Estimated Complexity

Small to medium.

## Next Queue After Merge

After remote authority docs are merged, continue the remaining 40 motion-dataset planning symbols in the smallest safe physical extraction batch.
