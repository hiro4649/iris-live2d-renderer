# Project Status

Last updated: 2026-06-27

## Repository

- Repository: `hiro4649/iris-live2d-renderer`
- Current local branch: `codex/local-project-docs-authority-bootstrap1`
- Latest synced main SHA: `cefc2625b3875681b1f0fbc34124e5c7c91ed5b2`
- Previous local commit SHA before AUTH2 commit: `54ba7c5ae6a0940d7c1ee69b0bb2b187b5f46b5b`
- Current local AUTH2 commit SHA: Use `git rev-parse HEAD` for the authoritative self-referential commit SHA.
- Worktree before AUTH2 edits: clean

## Open PRs

- #434 `[codex] Repair HARNESS v1.3.0 target metadata` from `codex/v130-target-install`.
  Read-only comparison confirms #434 changes only `AGENTS.md` and is superseded by the local AUTH1+AUTH2 branch.

## Harness

- Visible marker: `CODEX_QUALITY_HARNESS_FILE v1.3.0`
- Manifest active harness: `1.3.0`
- Manifest target harness: `1.3.0`
- Active self-test: `v130`
- Authority model: local AUTH2 candidate aligns v1.3.0 as the active metadata bridge target profile. Product/runtime authority remains unchanged from v1.2.9, v1.2.9 remains immediate rollback, v1.2.8 remains blocking compatibility, and v1.2.7 remains readable compatibility.

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
- Repaired v1.3.0 authority coherence locally:
  - `AGENTS.md` repository profile now identifies IRIS Live2D Renderer, not FUNKY.
  - Manifest upgrade path now points to the v129-to-v130 metadata bridge target profile.
  - Policy profile required reads now point to `CODEX_V130_SPEC.md` and defer v129/v128/v127 compatibility specs.
  - `CODEX_V130_SPEC.md` now describes this repository's metadata bridge target profile instead of a contradictory source-only/target-not-started state.
  - v130 self-test now checks repository profile, metadata bridge wording, profile-level policy reads, and forbidden product/runtime/package/workflow diffs.
  - v129/v128/v127 self-tests now accept the explicit v130 bridge compatibility chain instead of requiring old harness versions to be active.
- No product extraction work started.
- No push, PR, PR update, remote CI, or merge attempted.
- Ran read-only remote integration preflight:
  - GitHub authentication, repository identity, and write permission verified without printing credential values.
  - `origin/main` remains `cefc2625b3875681b1f0fbc34124e5c7c91ed5b2`.
  - Open PR #434 remains open and partial.

## Remaining Work

- AUTH2 local validation closeout completed. Commit only documentation synchronization if it creates a diff.
- Wait for owner approval after GitHub Actions quota reset before push/PR/remote CI.

## Active Blockers

- GitHub Actions quota-control rule blocks push/PR/remote CI for the next 4 days unless owner explicitly approves.
- v1.3.0 AUTH2 is local-only until owner approves push/PR/remote CI after the Actions quota-control window.
- Runtime/model/dataset owner decision remains blocked.

## Risks

- AUTH2 overlaps open PR #434. A future remote step should supersede or close #434 rather than create duplicate authority repairs.
- Remote integration must not proceed until quota reset or explicit owner approval for push/PR/remote CI.
- Current PROJECT docs are newly introduced and must be kept synchronized after every development session.

## Test Status

- `npm test`: PASS, 59 files
- `node --check` for tracked JS/MJS: PASS
- `git diff --check`: PASS
- `node scripts/codex-secret-safety-scan.mjs`: PASS
- `node scripts/check-live2d-planning-module-boundaries.mjs`: PASS
- `node scripts/check-live2d-planning-facade-boundaries.mjs`: PASS
- `node scripts/codex-v130-self-test.mjs`: PASS
- `node scripts/codex-v129-self-test.mjs`: PASS after AUTH2 local repair
- `node scripts/codex-v128-self-test.mjs`: PASS after AUTH2 local repair
- `node scripts/codex-v127-self-test.mjs`: PASS after AUTH2 local repair

- Full tracked JS/MJS syntax check: PASS, 555 files.
- Local target quality gate: PASS with branch/head unchanged and safe JSON parseable. Remote evidence was not used.

## CI Status

- Remote CI not run by quota-control rule.
- Estimated GitHub Actions impact for this local session: 0 remote jobs.

## Safe Next Task

`LIVE2D-MOTION-DATASET-PLANNING-PHYSICAL-EXTRACTION-EXECUTION-REQUEST-STUBS1`
