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

## V1/V2 Semantic Drift Guard

The compact safe summary v2 now receives input from a pure adapter that mirrors the existing blocked safe-state semantics before calling the v2 builder. `/status`, `/health`, and `/renderer/runtime-config` keep the same `live2d_safe_summary_v2` meaning without adding a public top-level field.

The parity guard checks that existing false or blocked v1 semantics still imply the corresponding v2 blocker labels: owner confirmation false, checked row count zero, motion dataset non-executable, priority1 BLOCKED, trusted loader disabled, actual ingestion false, runtime readiness false, production readiness false, and real renderer evidence missing. Contradiction fixtures fail if v2 becomes `candidate_only` or drops any required blocker while v1 remains blocked.

## Safe Contract Catalog And Docs Deduplication

Repeated fixed safe-label catalogs are consolidated into `src/renderer/live2dSafeContractCatalog.js`. The catalog is immutable, deterministic, side-effect free, and contains only safe public label lists: evidence source types, rejected evidence source types, runtime-supported motion labels, experimental motion labels, strong motion labels, owner handoff labels, and safe next action labels.

The catalog does not include mutable runtime state, factory references, full schemas, owner-only data, raw values, file paths, row material, endpoints, tokens, or secrets. Docs now treat this architecture document as the canonical reference for the safe-surface consolidation narrative while the completion index and development schedule retain status and gate history.

## Owner-Gated Real Evidence Checklist

`src/renderer/realEvidenceOwnerChecklist.js` prepares a pure safe checklist for a future owner-gated real evidence review. The checklist is schema-only and label-only. It records required sections for scope review, renderer evidence, motion dataset manifest requirements, audit reference, trusted loader boundary, runtime readiness boundary, production readiness boundary, expiry and reconfirmation, and safe next actions.

The checklist never sends a packet, creates owner confirmation, authorizes evidence collection, starts a renderer or browser probe, executes SDK code, reads files or row bodies, calculates hashes, enables trusted loader, resolves priority1, or claims runtime or production readiness. The owner handoff packet may consume the checklist result only as fixed safe rejection labels; it does not embed the raw checklist object.

## R1 Localhost Safe Process Probe

`test/live2d-r1-localhost-process-probe.mjs` starts the existing Node renderer process on loopback only, reads `/health`, `/status`, and `/renderer/runtime-config`, and immediately stops the process. The output is a safe envelope built by `src/renderer/localhostProcessProbeEnvelope.js`; raw responses, endpoint values, tokens, private paths, file bodies, row bodies, commands, stack traces, and payload bodies are not stored or printed.

The R1 probe is process availability and safe-surface shape evidence only. It does not start a browser, execute Cubism SDK code, load a model, load a scene, apply a cue, inject a browser heartbeat, enable trusted loader, ingest data, calculate hashes, execute parser/redaction/audit work, create owner confirmation, resolve priority1, increase checked row count, make the motion dataset executable, or claim renderer/runtime/production readiness.

## R2 Localhost Probe Semantic Boundary Attestation

Task: LIVE2D-R2-LOCALHOST-PROBE-SEMANTIC-BOUNDARY-ATTESTATION-PACK1

The R2 semantic boundary attestation adds an additive V2 envelope for localhost probe interpretation while preserving the R1 envelope. `src/renderer/localhostProbeRouteContract.js` fixes the exact route set for `/health`, `/status`, and `/renderer/runtime-config`, including per-route schema names, required selectors, optional selectors, critical boundary selectors, compact summary selector, and surface role. The route contract is code-owned; it does not accept arbitrary selector paths from user input.

`src/renderer/localhostProcessProbeEnvelopeV2.js` separates critical field presence from critical field value. Missing required fields, wrong types, schema mismatch, missing compact summary, unknown route, duplicate route, extra route, non-2xx route status, cross-surface semantic mismatch, non-loopback host, missing process start, missing process stop, or missing port release all produce fixed safe failure labels and block the probe. Missing fields are not converted into safe `false` values.

The R2 V2 envelope checks that the blocked boundary remains blocked across all applicable safe surfaces: renderer ready false, model loaded false, scene loaded false, browser cue delivery ready false, runtime readiness false, production readiness false, owner confirmation false, actual ingestion false, trusted loader disabled, priority1 BLOCKED, checked row count 0, compact safe summary blocked, and motion dataset non-executable. Route shape differences are allowed; semantic differences are not.

The R2-A pack is semantic interpretation only. It does not run a browser, Playwright, Chromium, Cubism SDK, Cubism Framework, model load, scene load, cue application, browser heartbeat injection, SSE/WebSocket clients, OBS, TTS, YouTube, Game, DB, trusted loader, actual data ingestion, parser, redaction scan, audit write, owner confirmation, runtime readiness, production readiness, priority1 resolution, checked row count increase, or motion dataset execution.

## R2 Localhost Probe Bounded Transport And Cleanup

Task: LIVE2D-R2-LOCALHOST-PROBE-BOUNDED-TRANSPORT-AND-CLEANUP-PACK1

The R2-B transport layer constructs URLs only from the code-owned route contract and `127.0.0.1` ephemeral ports. It rejects user-provided URLs, unknown route labels, non-loopback hosts, redirects, non-JSON content types, invalid UTF-8, invalid JSON, arrays, primitives, HTTP failures, and responses that exceed the bounded byte limit before persisting any raw body. It does not forward proxy environment variables to the child process.

The process controller starts `process.execPath src/server.js` with `shell: false`, `detached: false`, hidden window mode on Windows, ignored stdio, repository cwd, and a minimal child environment. Secret-like environment values, proxy variables, and `NODE_OPTIONS` are not forwarded. The explicit renderer environment remains limited to loopback host, ephemeral port, and empty Cubism/model identifiers.

The cleanup layer records only safe booleans for process start, exit observation, SIGTERM, SIGKILL fallback, process stop, port release, spawn error presence, and unexpected exit presence. It does not expose PID, port number, raw errors, stack traces, raw process output, endpoint values, private paths, tokens, or secrets.

The current public `/health`, `/status`, and `/renderer/runtime-config` safe responses are larger than the R2-B byte bound, so the actual R2 runner fails closed rather than weakening the bound or shrinking public server responses outside this task's allowed scope. This is a transport-boundary result, not a readiness result.

## R2 Compact Probe Surface Unblock

Task: LIVE2D-R2-COMPACT-PROBE-SURFACE-UNBLOCK-PACK1

The R2 compact probe surface adds `GET /renderer/r2-probe-summary` as an R2-only localhost probe endpoint. It is disabled by default and is enabled only for the R2 child process through `IRIS_LIVE2D_R2_PROBE_SURFACE_ENABLED=1`. The route is hidden behind exact GET path matching, an empty query string, direct loopback socket checks, a `127.0.0.1:<port>` Host header, and forwarded-header rejection. Disabled, forwarded, query, POST, or non-direct-loopback requests return the same safe 404 shape.

The compact surface projects only allowlisted fields from the existing `/health`, `/status`, and `/renderer/runtime-config` safe objects into `iris_live2d_r2_compact_probe_surface_v1`. It preserves the exact semantic route set by expanding the compact response back into `health`, `status`, and `runtime_config` bodies before V2 envelope validation. The response is bounded to 32768 bytes, remains below the R2 transport byte bound, and returns only fixed safe failure labels if projection or size validation blocks.

This unblock does not shrink or remove existing public route fields, does not raise the transport byte limit, does not start a browser, does not execute Cubism SDK or Framework code, does not load a model or scene, does not apply cues, does not inject browser heartbeat, does not enable trusted loader, does not handle actual data, does not create owner confirmation, does not resolve priority1, and does not claim runtime or production readiness.

## R2 Localhost Probe Reproducibility Attestation

Task: LIVE2D-R2-LOCALHOST-PROBE-REPRODUCIBILITY-ATTESTATION-PACK1

The R2 reproducibility attestation runs five fresh compact localhost process probes and reduces them to `live2d_r2_localhost_probe_reproducibility_attestation_v1`. It records only safe counts and pass/blocked labels for route coverage, schema parity, required field presence, critical boundary status, cross-surface parity, process cleanup, port release, external network boundary, raw response persistence, and semantic reproducibility.

The attestation intentionally omits port numbers, PIDs, timestamps, durations, raw URLs, raw responses, raw errors, stack traces, environment values, temp paths, and command bodies. Variance produces fixed safe failure labels only. A pass means the R2 compact probe surface is semantically repeatable under the current blocked product state; it is not renderer readiness, runtime readiness, production readiness, owner confirmation, trusted loader approval, actual data approval, priority1 resolution, or motion dataset execution.

## R2 Localhost Probe Completion Review

Task: LIVE2D-R2-LOCALHOST-PROBE-COMPLETION-REVIEW1

The R2 completion review confirms that the R2 localhost probe line now has bounded transport, process cleanup, compact endpoint unblocking, and five-run reproducibility attestation. The route interpretation remains the exact semantic set `health`, `status`, and `runtime_config`; the compact endpoint is only a transport projection used by the R2 child process.

R2 completion does not advance into R3. Browser verification, Playwright or Chromium, Cubism SDK or Framework execution, model load, scene load, cue application, browser heartbeat injection, trusted loader enablement, actual data work, owner confirmation, runtime readiness, production readiness, priority1 resolution, checked row count increase, and motion dataset execution all remain blocked until a separate owner-approved R3 scope is provided.

## V1.2.6 Architecture Transition Completion Review

The v1.2.6 architecture transition is complete for the safe-surface consolidation layer only. The registry coverage, state projection integration, contract matrix integration, real evidence owner handoff packet, and compact safe summary v2 are present as non-authorizing surfaces.

This review does not add a new runtime surface and does not remove any legacy public fields. The legacy v1 contract fixture remains the compatibility baseline, while the v2 compact summary fixture is additive. The owner handoff packet remains draft-only, and the compact summary remains a safe blocker grouping rather than a readiness decision.

Open blockers remain unchanged: owner confirmation is absent, fresh real renderer evidence is absent, audit reference review is absent, priority1 remains BLOCKED, checked row count remains 0, the trusted loader remains disabled, actual ingestion remains disallowed, runtime readiness is not claimed, production readiness is not claimed, and the motion dataset remains non-executable.

Next development should prefer contract tightening, duplicate reduction, and owner-gated evidence preparation over adding more public one-field summaries. Any future runtime, renderer, SDK, audit, actual data, trusted loader, or readiness step still requires a separate explicit owner-approved task.
