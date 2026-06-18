# Live2D Safe Surface Architecture

Status: inventory characterization only.

This document records the current public safe surfaces without changing their
schemas, factories, or public keys. The inventory covers:

- `status`
- `health`
- `runtimeConfig`

Each surface is public safe summary output. The inventory classifies the
surfaces as:

- authorizing: false
- readinessEffect: none
- ownerEffect: none
- actualDataEffect: none

The inventory check is implemented in
`scripts/codex-check-live2d-safe-surface-parity.mjs`. It builds the existing renderer
state in memory, reads the existing safe projections, and reports only counts,
keys, schema labels, and safe effect classifications. It does not start a
server, browser, renderer, SDK, model load, scene load, cue application,
heartbeat collection, row ingestion, parser, redaction scan, audit, or external
service.

The registry extraction layer is declarative and compatibility-only:

- `src/renderer/safeSurfaceRegistry.js` lists the current status, health, and
  runtimeConfig safe surfaces.
- `src/renderer/motionIdentityComfortSurfaceRegistry.js` lists the current
  motion identity/comfort safe summary public keys exposed on status, health,
  and runtimeConfig.
- registry entries point at existing factories instead of moving factory logic.
- unknown registry entries are rejected as safe labels only.
- authorizing, readiness, owner, and actual data effects remain false or none.
- the parity check compares registered IDs against the in-memory public
  inventory and fails on missing registry IDs, orphan registry IDs, duplicate
  IDs, duplicate schemas, duplicate public keys, visibility violations, effect
  violations, schema mismatches, or missing surface presence.
- `src/renderer/safeSurfaceProjection.js` resolves registered factories through
  an explicit factory map and projects the registered motion identity/comfort
  summaries onto status, health, and runtimeConfig without eval, global lookup,
  prototype lookup, cache sharing, renderer execution, or external calls.
- `test/fixtures/live2d-safe-surface-contract-v1.json` is an independent
  safe-metadata contract baseline for outer public keys, schema labels, and
  required invariant key presence. Tests compare current projections against
  that baseline instead of regenerating it during test execution.
- `test/safe-surface-projection-matrix.test.js` uses the safe surface and
  motion identity/comfort registries as the authoritative contract matrices for
  schema presence, surface presence, no-sweetening invariants, owner boundary,
  actual data boundary, and readiness boundary checks.

## Safe Guard Freeze And Real Evidence Transition

The safe guard transition layer freezes further one-field public status
expansion unless a proposed safe surface has a blocking product gap label, a
product value statement label, an existing-registry reuse check, a compact
summary impact check, a compatibility plan, and an explicit owner-scope
requirement. This keeps the registry authoritative and routes future public
surface changes through product value review instead of incremental safe-summary
growth.

`src/renderer/safeGuardTransitionPolicy.js` is a pure policy module. It accepts
safe labels only and returns safe summaries only. It does not collect renderer
evidence, run a probe, load a model, load a scene, apply a cue, calculate a
hash, read a row body, read file contents, start a parser, run a redaction scan,
write an audit, enable the trusted loader, or create owner confirmation.

Real renderer evidence transition remains owner-gated and blocked until safe
metadata can show a real probe or owner-approved safe evidence source, fresh
timestamp status, heartbeat presence, model-load support, model loaded, scene
loaded, model-scene match, cue capability, last cue applied, last cue success,
audit reference presence, and owner scope presence. Fixture, manual-label-only,
manifest-only, SSE-only, cue-accepted-only, unknown, future-timestamp, stale, or
missing-signal inputs are rejected or downgraded as safe labels and never become
runtime readiness or production readiness.

`test/safe-guard-transition-policy.test.js` covers the freeze policy, safe
surface approval labels, source allowlist, rejected source classes, timestamp
status handling, missing-signal blockers, unsafe key rejection, deterministic
output, and the invariant that readiness, owner confirmation, actual ingestion,
trusted loader, priority1, checked row count, and motion dataset boundaries do
not change.

This pack does not claim runtime readiness, does not claim production readiness,
does not create owner confirmation, does not enable the trusted loader, does not
resolve priority1, does not change checked row count, and does not make the
motion dataset executable.
## Real Evidence Owner Handoff Packet Boundary

The real evidence owner handoff packet is a pure safe-summary builder for future owner review. It accepts label-only scope, required evidence, missing evidence, stale evidence, row manifest status, trusted loader status, priority1 status, checked row count, audit reference status, owner action labels, generated-at status, and expiry status. It rejects unsafe fields, unknown fields, prototype pollution keys, raw evidence, raw command material, private paths, endpoint/token/secret labels, raw owner notes, audit bodies, actual probe requests, actual ingestion requests, trusted loader enablement requests, readiness claim requests, owner confirmation requests, package publish requests, and external service requests.

The packet is draft-only and never sends itself. `sent`, `authorizing`, `ownerConfirmationCreated`, `ownerConfirmationConfirmed`, `actualEvidenceCollectionAuthorized`, `runtimeReadinessClaimed`, `productionReadinessClaimed`, `actualIngestionAllowed`, `trustedLoaderEnablementAuthorized`, `priority1Resolved`, `motionDatasetExecutable`, `sourceHashVerified`, and `declaredRowCountChecked` remain false. `ready_for_owner_review` is only a future-review label and does not authorize real renderer evidence collection, actual data work, trusted loader enablement, runtime readiness, or production readiness.
## Compact Safe Summary V2

`live2d_safe_summary_v2` is an additive compact safe summary projected on status, health, and runtime-config surfaces. The v1 public fields remain in place, and the v1 contract fixture remains the compatibility baseline; v2 is covered by a separate additive contract fixture.

The compact summary groups blockers under owner confirmation, real renderer evidence, motion dataset, priority1, trusted loader, actual data, runtime readiness, production readiness, and audit reference. Its statuses are limited to `blocked`, `attention_required`, and `candidate_only`; `ready`, `production_ready`, and `owner_confirmed` are rejected. The summary never carries owner-only detail, raw values, endpoint/token/secret labels, private paths, row bodies, file contents, audit bodies, or command material.

The summary keeps runtime readiness false, production readiness false, owner confirmation false, actual ingestion false, trusted loader disabled, priority1 BLOCKED, checked row count 0, and motion dataset non-executable.

The compact summary v2 semantic invariant repair makes the immutable boundary state authoritative for blocker groups and `overallStatus`. Input labels cannot clear `priority1`, checked row count, motion dataset, owner confirmation, trusted loader, actual data, runtime readiness, production readiness, or real renderer evidence blockers. Override attempts are reduced to fixed safe rejection labels, and `candidate_engine_available` remains a non-authorizing decision-engine label rather than real renderer evidence.

## Pure Safe Module Input Label Hardening

Pure safe modules now share a small label validator for public safe-label inputs. The validator accepts only bounded ASCII label tokens and rejects blank labels, whitespace, control characters, path separators, URL-like values, secret-like values, shell-like fragments, duplicates, oversized arrays, unknown allowlist values, and prototype pollution keys.

The hardening applies to the real evidence owner handoff packet, renderer evidence decision, motion dataset manifest validator, and compact safe summary v2. Rejections are fixed safe reason labels only; raw input values are not echoed. No new public runtime status field is added, and the modules still do not execute renderer, SDK, browser, parser, redaction, audit, file, row, hash, external service, owner confirmation, trusted loader, runtime readiness, or production readiness work.

## V1.2.6 Architecture Transition Completion Review

The v1.2.6 architecture transition is complete for the safe-surface consolidation layer only. The registry coverage, state projection integration, contract matrix integration, real evidence owner handoff packet, and compact safe summary v2 are present as non-authorizing surfaces.

This review does not add a new runtime surface and does not remove any legacy public fields. The legacy v1 contract fixture remains the compatibility baseline, while the v2 compact summary fixture is additive. The owner handoff packet remains draft-only, and the compact summary remains a safe blocker grouping rather than a readiness decision.

Open blockers remain unchanged: owner confirmation is absent, fresh real renderer evidence is absent, audit reference review is absent, priority1 remains BLOCKED, checked row count remains 0, the trusted loader remains disabled, actual ingestion remains disallowed, runtime readiness is not claimed, production readiness is not claimed, and the motion dataset remains non-executable.

Next development should prefer contract tightening, duplicate reduction, and owner-gated evidence preparation over adding more public one-field summaries. Any future runtime, renderer, SDK, audit, actual data, trusted loader, or readiness step still requires a separate explicit owner-approved task.
