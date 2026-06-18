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
