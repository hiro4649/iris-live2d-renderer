# Project Status

Last updated: 2026-06-27

## Repository

- Repository: `hiro4649/iris-live2d-renderer`
- Current local branch: `codex/local-project-docs-authority-bootstrap1`
- Latest synced main SHA: `cefc2625b3875681b1f0fbc34124e5c7c91ed5b2`
- Current local commit SHA at branch start: `cefc2625b3875681b1f0fbc34124e5c7c91ed5b2`
- Worktree before AUTH1 edits: clean

## Open PRs

- #434 `[codex] Repair HARNESS v1.3.0 target metadata` from `codex/v130-target-install`

## Harness

- Visible marker: `CODEX_QUALITY_HARNESS_FILE v1.3.0`
- Manifest active harness: `1.3.0`
- Manifest target harness: `1.3.0`
- Active self-test: `v130`
- Known authority issue: `docs/process/CODEX_V130_SPEC.md` says v1.3.0 is source-core and target repositories remain on v1.2.9, while AGENTS/manifest say v1.3.0 target rollout is active/completed. Needs AUTH2 repair.

## Latest Merged PRs

- #432 `Install HARNESS v1.3.0 Core metadata bridge canary`
- #431 `Restore legacy planning compatibility exports` / `Roll out HARNESS v1.2.9 target profile`
- #430 `Roll out HARNESS v1.2.8 target profile`
- #429 `LIVE2D-MOTION-DATASET-PLANNING-PHYSICAL-EXTRACTION-OWNER-FINAL-PACKETS1`

## Current Planning Boundary Counts

Source: `node scripts/check-live2d-planning-module-boundaries.mjs` on latest main.

- Status: pass
- `symbolCount`: 285
- `physicalMovedExportCount`: 162
- `auditedSymbolCount`: 162
- `pendingSymbolCount`: 123
- `legacyPublicSymbolCount`: 574
- `facadePublicSymbolCount`: 145
- `motionDatasetManifestSymbolCount`: 200
- `motionDatasetPhysicalMovedSymbolCount`: 160
- `motionDatasetAuditedSymbolCount`: 160
- `motionDatasetPendingSymbolCount`: 40
- `facadeManifestMismatchCount`: 0
- `facadeMetadataMismatchCount`: 0
- `actualDependencyMismatchCount`: 0
- `duplicateDefinitionCount`: 0
- `cycleCount`: 0

## Motion Dataset Progress

Completed planning-only physical extraction milestones include core planning, owner gates, audit stubs, parser/audit stubs, owner handoff gates, owner no-go gates, actual-data preauth gates, checksum preflight, owner-confirmation wait gates, final owner wait-for-data gates, and owner final packets.

Remaining motion dataset planning extraction work: 40 motion-dataset symbols remain pending in the machine boundary report.

## Motion Identity Status

Motion identity and comfort summaries remain compatibility-facade planning surfaces. They are not runtime motion execution evidence.

## Renderer Readiness Status

Renderer readiness summaries remain blocker and evidence-request planning surfaces. They do not prove renderer readiness.

## Actual Runtime Status

- Actual renderer readiness: false
- Runtime readiness claimed: false
- Production readiness claimed: false
- Null adapter: active fallback, not actual renderer
- Trusted loader allowlist: disabled
- Actual Cubism SDK/model evidence: not approved / not read for readiness

## Fixed Safety Truths

- `priority1_status`: BLOCKED
- `checked_row_count`: 0
- `motion_dataset_executable`: false
- `actual_ingestion_allowed`: false
- `owner_confirmation_confirmed`: false
- `source_hash_verified`: false
- `declared_row_count_checked`: false

## Completed Work In This Session

- Created project authority docs locally:
  - `docs/PROJECT_SPEC.md`
  - `docs/PROJECT_STATUS.md`
  - `docs/NEXT_TASK.md`
  - `docs/CHANGELOG.md`
- Added authority-doc links to planning boundary documentation.
- No product extraction work started.
- No push, PR, PR update, remote CI, or merge attempted.

## Remaining Work

- Run local AUTH1 validation after docs are written.
- Commit locally after validation if all checks pass.
- Wait for owner approval after GitHub Actions quota reset before push/PR/remote CI.

## Active Blockers

- GitHub Actions quota-control rule blocks push/PR/remote CI for the next 4 days unless owner explicitly approves.
- v1.3.0 harness authority contradiction requires AUTH2.
- Runtime/model/dataset owner decision remains blocked.

## Risks

- AUTH2 may conflict with open PR #434 if both edit AGENTS/manifest/policy files. Needs verification before any future push.
- Current PROJECT docs are newly introduced and must be kept synchronized after every development session.

## Test Status

- `npm test`: PASS, 59 files
- `node --check` for tracked JS/MJS: PASS
- `git diff --check`: PASS
- `node scripts/codex-secret-safety-scan.mjs`: PASS
- `node scripts/check-live2d-planning-module-boundaries.mjs`: PASS
- `node scripts/check-live2d-planning-facade-boundaries.mjs`: PASS
- `node scripts/codex-v130-self-test.mjs`: PASS
- `node scripts/codex-v129-self-test.mjs`: FAIL
- `node scripts/codex-v128-self-test.mjs`: FAIL
- `node scripts/codex-v127-self-test.mjs`: FAIL

The v129/v128/v127 compatibility self-test failures are treated as AUTH2 authority-coherence blockers. Needs verification during AUTH2.

## CI Status

- Remote CI not run by quota-control rule.
- Estimated GitHub Actions impact for this local session: 0 remote jobs.

## Safe Next Task

`LIVE2D-HARNESS-V130-AUTHORITY-COHERENCE-REPAIR1`
