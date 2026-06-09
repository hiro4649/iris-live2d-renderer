# IRIS Live2D Loader Integration Preflight

## Owner Summary

- Task: define the trusted Cubism loader contract before motion or micro-reaction work.
- PR: LIVE2D-LOADER-INTEGRATION-PREFLIGHT5.
- Checks: docs/spec and contract tests must stay green on the current head.
- Risk: R3 product-relevant renderer safety preflight.
- Readiness claim: runtime readiness no, production readiness no.
- Residual risk: a compatible real Cubism model loader is not bundled yet.
- Next action: integrate an allowlisted loader only after this contract is satisfied.

## Goal

This preflight defines which Live2D browser loader signals are trusted, which are diagnostic only, and which future evidence can become a server-trusted real model-load candidate. It must not make `renderer_ready` true.

## Loader Capability Classes

- `no_runtime`: no Cubism runtime object is available.
- `cubism_core_only`: Cubism Core is present, but no compatible model loader is available.
- `loader_detected_untrusted`: browser code can detect a loader-shaped object, but no trusted contract gate has approved it.
- `loader_contract_candidate`: a loader API is under review and may become allowlisted later.
- `trusted_loader_evidence_candidate`: future evidence has the right safe shape, but is not enough by itself.
- `trusted_loader_ready_future`: reserved for a future PR after server policy approval and same-head evidence.

## Trust Rule

- CubismCore presence is runtime presence only.
- Loader API detection is diagnostic unless the loader API is allowlisted and the evidence contract is satisfied.
- Browser self-asserted heartbeat fields are diagnostic only.
- The server must not trust `model_load_supported` or `real_model_load_supported` from browser heartbeat by itself.
- A future trusted evidence path must include server-side policy approval or an explicit trusted loader contract gate.

## Required Future Trusted Evidence Fields

- `loader_kind` as a safe allowlist value.
- `loader_version` as a safe label.
- `model_load_session_id` or a challenge label.
- Safe manifest status hash.
- Safe moc asset token hash.
- `model_id`.
- `scene_id`.
- `loaded_at_ms`.
- Fresh heartbeat timestamp.
- Model object created through an allowlisted loader API.
- Scene binding result.
- Cue capability result.
- Last cue applied result.

## Forbidden Evidence

Future loader evidence must not expose raw model path, raw asset path, raw manifest body, raw loader error, stack trace, endpoint, token, secret, raw cue payload, raw motion command, candidate, command, OBS command, Game input, or OS command.

## Readiness Rule

`renderer_ready` remains false unless all of these are true:

- server-trusted real loader capability is enabled
- fresh heartbeat
- real model loaded
- real scene loaded
- expected `model_id` matches
- expected `scene_id` matches
- cue capability confirmed
- last delivered cue applied successfully
- evidence is not fixture, dry-run, stale, or synthetic

## Motion Dataset Boundary

- `runtime_motion_allowlist` is separate from `expression_candidate_labels`.
- Future micro reaction labels must not be runtime executable until renderer support is implemented and tested.
- Unimplemented motion labels are `experimental_review` or `needs_review`, not pass.

## IRIS Compatibility

The current safe IRIS Live2D cue envelope remains accepted by the renderer cue validator. This preflight does not change cue shape, asset routes, SSE delivery, polling fallback, or browser heartbeat routing.

## K-Rule Compatibility

This contract preserves K331, K332, K333, K334, K626, K627, K628, K629, K806, K814, and K944. It keeps fixture evidence separate from real evidence and does not promote stale, synthetic, manifest-only, asset-route-only, SSE-only, or cue-accepted evidence into readiness.

## Live2D Schedule Phase

This PR is an inserted preflight between `REAL-MODEL-LOAD4` and `MICRO-REACTION-PACK5`. The reason is that a compatible real Cubism model loader is not bundled, and trusted loader evidence must be defined before motion packs or micro reactions rely on renderer capability.

## Loader Integration Candidate

- Selected future loader kind: `cubism_framework_model_loader_v1`.
- Diagnostic fallback kind: `cubism_moc_create`.
- If the compatible Cubism Framework model loader is absent, browser diagnostics must report `missing_dependency` or `operator_attention_required` without attempting readiness.
- Loader-shaped objects and test fixtures remain diagnostic-only while the server trusted allowlist is empty.
- The next safe operator action is to provide the approved Cubism Framework loader through configured renderer environment names only; raw local paths must stay private.

## Loader Provisioning Preflight

`LIVE2D-CUBISM-LOADER-PROVISIONING8` verifies only whether an owner can provide licensed Cubism Framework loader material through safe configuration. The repository must not download, redistribute, or commit Cubism SDK or Framework files, and it must not quote vendor source contents.

Allowed configuration names are `IRIS_LIVE2D_CUBISM_FRAMEWORK_JS`, `IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE`, and `IRIS_LIVE2D_CUBISM_LOADER_KIND`. Public runtime summaries may expose those names and safe status labels, but not their values, local file locations, SDK filenames, loader errors, stack traces, endpoint values, tokens, secrets, manifests, assets, cues, or commands.

Provisioning statuses are diagnostic only. `candidate_present` means an owner-provided file appears to be present and still requires `license_attention_required`, owner confirmation, and a future trusted loader policy gate. `cubism_moc_create` remains diagnostic-only. `cubism_framework_model_loader_v1` remains a future loader path until the trusted loader allowlist is explicitly enabled in a later PR with same-head evidence.

Loader provisioning does not imply `model_loaded`, `scene_loaded`, `browser_cue_delivery_ready`, `renderer_ready`, runtime readiness, or production readiness. The next PR may enable a trusted loader kind only after license/provisioning review, owner confirmation, and passing same-head tests.

## Cubism Core Route Guard

`LIVE2D-CUBISM-CORE-ROUTE-GUARD9` is a route safety hardening step before any trusted loader allowlist work. It restricts `/renderer/cubism-core.js` to loopback/local requests and safe owner-provided Cubism Core candidates while keeping owner-provided SDK/Core file values private and external to this repository.

The guard does not bundle, download, redistribute, commit, or quote Cubism SDK or vendor files. Public responses may expose only configured environment names and safe status labels. Candidate presence is diagnostic only, and the trusted loader allowlist remains disabled.

This route guard does not make the loader trusted and does not imply `model_loaded`, `scene_loaded`, `browser_cue_delivery_ready`, `renderer_ready`, runtime readiness, or production readiness. Real Live2D readiness still requires a separate fresh evidence collector, owner confirmation, and same-head evidence in a later PR.

## Live2D Real Evidence Collector

`LIVE2D-REAL-EVIDENCE-COLLECTOR1` is a safe-summary preflight for future readiness decisions. It exposes only labels for heartbeat presence, evidence freshness, configured model status, model/scene evidence, cue capability, recovery capability, last cue application, source type, blocked/attention reason, and safe next action.

Fixture evidence, dry-run evidence, stale evidence, missing timestamps, and incomplete real-probe evidence are not real readiness evidence. The collector does not claim runtime readiness, does not claim production readiness, does not resolve priority1, and does not make the motion dataset executable.

The collector must not expose raw model paths, motion paths, endpoint values, token values, private local paths, raw cue payloads, raw renderer payloads, raw evidence bodies, SDK/vendor paths, or vendor source. Fresh resident real evidence and owner confirmation remain required before readiness can be considered. Trusted loader allowlist work remains separate and disabled.

## Trusted Loader Allowlist Preflight

`LIVE2D-TRUSTED-LOADER-ALLOWLIST-PREFLIGHT1` is a safety boundary for future trusted loader work, not trusted loader enablement. The trusted loader allowlist remains disabled, no loader is trusted, and no loader candidate is executed by this preflight.

The preflight reports only safe labels for allowlist status, candidate kind/status, route guard prerequisite, real evidence prerequisite, owner confirmation prerequisite, license attention, blocker reason, and safe next action. Owner-provided file values stay private; public summaries may expose only configured environment names and safe statuses.

Candidate presence remains diagnostic only. Unknown loader kinds, future-only loader kinds, missing route guard evidence, missing real evidence, stale/fixture/dry-run evidence, missing owner confirmation, or license attention must keep trust blocked.

This preflight does not bundle, download, redistribute, commit, or quote Cubism SDK or vendor files. It must not expose raw loader candidates, loader errors, SDK paths, endpoint values, token values, model paths, motion paths, raw cue payloads, raw renderer payloads, or raw evidence bodies.

The preflight does not make `renderer_ready`, `model_loaded`, `scene_loaded`, or `browser_cue_delivery_ready` true, does not claim runtime readiness, does not claim production readiness, does not resolve priority1, and does not make the motion dataset executable. Future trusted loader enablement requires a separate owner-confirmed PR with fresh real evidence and owner confirmation.

## Trusted Loader Enablement Gate

`LIVE2D-TRUSTED-LOADER-ENABLEMENT-GATE1` is a fail-closed safety preflight for future trusted loader enablement. It does not enable the trusted loader allowlist, does not trust any loader, and does not execute any loader candidate.

The gate exposes only safe labels for enablement status, blocked reason, required prerequisites, missing prerequisites, route guard status, real evidence status, owner confirmation status, license status, candidate kind status, allowlist status, freshness status, safe next action, and readiness claim status.

The route guard, real evidence collector, trusted loader allowlist preflight, fresh real evidence, owner confirmation, license boundary, known supported loader kind, safe public summaries, no raw path exposure, no env value exposure, no raw loader candidate exposure, and no SDK/vendor exposure remain required prerequisites. Missing, fixture, dry-run, stale, unknown-loader, future-only, license-attention, allowlist-disabled, priority1-unresolved, or motion-dataset-non-executable states remain blocked.

The gate does not bundle, download, redistribute, commit, copy, or quote Cubism SDK or vendor files. Owner-provided file values remain private, and public summaries may expose only environment names and safe status labels.

The gate does not make `renderer_ready`, `model_loaded`, `scene_loaded`, or `browser_cue_delivery_ready` true, does not claim runtime readiness, does not claim production readiness, does not resolve priority1, and does not make the motion dataset executable. Future actual trusted loader enablement still requires a separate owner-confirmed PR with fresh real evidence and owner confirmation.

## Trusted Loader Owner Handoff

`LIVE2D-TRUSTED-LOADER-OWNER-HANDOFF1` is review preparation for a future trusted loader decision, not trusted loader enablement. It does not enable the trusted loader allowlist, does not trust any loader, does not execute a loader candidate, and does not perform a live handoff or go/no-go.

The handoff packet exposes only safe labels for handoff status, blocked reason, required owner confirmations, required real evidence, route guard status, evidence collector status, allowlist preflight status, enablement gate status, license boundary, SDK/vendor boundary, candidate status, freshness status, priority1 status, motion dataset status, safe next action, and residual risks.

The route guard, real evidence collector, trusted loader allowlist preflight, trusted loader enablement gate, fresh real evidence, owner confirmation, license boundary, SDK/vendor boundary, known supported loader kind, safe public summaries, no raw path exposure, no env value exposure, no raw loader candidate exposure, no owner private note exposure, and no SDK/vendor exposure remain required prerequisites.

Fixture evidence, dry-run evidence, stale evidence, mock owner confirmation, missing owner confirmation, expired owner confirmation, unknown loader kind, future-only loader kind, license attention, allowlist disabled, enablement-gate-blocked, priority1-unresolved, and motion-dataset-non-executable states remain blocked.

The handoff does not bundle, download, redistribute, commit, copy, or quote Cubism SDK or vendor files. Owner-provided file values remain private, and public summaries may expose only environment names and safe status labels.

The handoff does not make `renderer_ready`, `model_loaded`, `scene_loaded`, or `browser_cue_delivery_ready` true, does not claim runtime readiness, does not claim production readiness, does not resolve priority1, and does not make the motion dataset executable. Future actual trusted loader enablement still requires a separate owner-confirmed PR with fresh real evidence and owner confirmation.

## LIVE2D-FRESH-EVIDENCE-BUNDLE1 review-preparation boundary

The fresh evidence bundle is review preparation only, not runtime readiness and not production readiness. It aggregates safe statuses for the route guard, real evidence collector, trusted loader allowlist preflight, trusted loader enablement gate, owner handoff, fresh real evidence prerequisite, owner confirmation prerequisite, license boundary, SDK/vendor boundary, priority1 status, and motion dataset status.

The bundle does not enable the trusted loader allowlist, does not trust any loader, does not load Cubism SDK or Framework files, does not call Cubism SDK, and does not bundle, download, quote, copy, or commit SDK/vendor files. Owner-provided file values remain private. Public responses may expose only environment names and safe status labels. `candidate_present` remains diagnostic only.

Fixture evidence is not real evidence, dry-run evidence is not real evidence, stale evidence is not fresh evidence, and mock owner confirmation is not real owner confirmation. Runtime readiness is not claimed, production readiness is not claimed, priority1 remains BLOCKED, and the motion dataset remains non-executable.

Future actual trusted loader enablement requires a separate owner-confirmed PR with fresh real evidence, owner confirmation, and go/no-go review.

## LIVE2D-GO-NOGO-PREFLIGHT1 safe boundary

The Live2D go/no-go preflight is review preparation only. It is not an actual go decision, does not enable the trusted loader allowlist, does not trust any loader, and does not load, bundle, download, quote, copy, or commit SDK/vendor files.

Owner-provided file values remain private. Public status surfaces may expose only env names and safe status labels; candidate_present remains diagnostic only and is not trusted capability or execution readiness.

The preflight stays fail-closed until route guard, real evidence collector, allowlist preflight, enablement gate, owner handoff, Fresh Evidence Bundle, fresh real evidence, owner confirmation, and license boundary prerequisites are all satisfied by future owner-reviewed evidence.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. degraded_mode_available is a fallback/status separation and is not a go decision.

Future actual trusted loader enablement requires a separate owner-confirmed PR after all no-go blockers are resolved with fresh real evidence, owner confirmation, and go/no-go review.

## LIVE2D-REAL-EVIDENCE-INTAKE1 safe boundary

The real evidence intake layer is schema and redaction preparation only. It does not collect real evidence, does not perform live probes, does not enable the trusted loader allowlist, does not trust any loader, and does not load, bundle, download, quote, copy, or commit SDK/vendor files.

Owner-provided file values remain private. Public surfaces may expose only env names and safe status labels. Fixture evidence is not real evidence, dry-run evidence is not real evidence, manual summary is not fresh real evidence without owner confirmation, stale evidence is not fresh evidence, and mock owner confirmation is not real owner confirmation.

The route guard, real evidence collector, Fresh Evidence Bundle, and go/no-go preflight remain prerequisites. The go/no-go preflight remains no_go by default. Raw evidence payloads, raw cue payloads, raw renderer payloads, raw paths, endpoint values, token values, loader candidates, loader errors, SDK/vendor paths, vendor source, and owner private notes are rejected or summarized only as safe blocked labels.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0.

Future actual trusted loader enablement requires a separate owner-confirmed PR after real fresh evidence exists and go/no-go blockers are resolved.

## LIVE2D-OWNER-CONFIRMATION-ENVELOPE1 safe boundary

The owner confirmation envelope is schema and safety preparation only. It does not create real owner confirmation, does not auto-confirm from PR merge, remote quality-gate PASS, local checks, target harness, browser smoke, fixture, dry-run, or mock data, and does not enable the trusted loader allowlist.

Owner confirmation is scope-specific. Wrong-role confirmation, expired confirmation, revoked confirmation, mock confirmation, and scope-mismatched confirmation are rejected. Raw owner notes and owner-provided values remain private; public surfaces expose only safe status labels.

Real evidence intake remains schema-only, Fresh Evidence Bundle remains review-preparation only, and go/no-go preflight remains no_go by default. Trusted loader allowlist remains disabled and no loader is trusted.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0.

Future actual trusted loader enablement requires a separate owner-confirmed PR after real fresh evidence exists and go/no-go blockers are resolved.

## LIVE2D-REAL-EVIDENCE-REQUEST-PACKET1 safe boundary

LIVE2D-REAL-EVIDENCE-REQUEST-PACKET1 is request preparation only. It defines the safe evidence components, freshness requirements, audit references, redaction requirements, and owner confirmation scopes that must be supplied later for Live2D readiness review.

This packet does not collect real evidence, does not perform live probes, does not call the real renderer, does not call the Cubism SDK, does not create real owner confirmation, and does not auto-confirm from PR merge, remote quality-gate PASS, local checks, target harness, browser/API smoke, fixture, dry-run, or mock data. Request packet completeness is not readiness.

The trusted loader allowlist remains disabled, no loader is trusted, no SDK/vendor files are bundled, downloaded, quoted, copied, or committed, and owner-provided file values remain private. Only environment variable names and safe status labels may be public.

Fixture evidence is not real evidence, dry-run evidence is not real evidence, stale evidence is not fresh evidence, and mock owner confirmation is not real owner confirmation. Raw request notes, raw owner notes, raw evidence bodies, raw renderer payloads, raw cue payloads, raw loader candidates, raw loader errors, endpoint values, tokens, secrets, SDK paths, and vendor paths are rejected from the public packet surface.

Real evidence intake remains schema-only, the owner confirmation envelope remains schema-only, the go/no-go preflight remains no_go, runtime readiness is not claimed, production readiness is not claimed, priority1 remains BLOCKED, and the motion dataset remains non-executable. Future actual trusted loader enablement requires a separate owner-confirmed PR after real fresh evidence and go/no-go blockers are resolved.

## LIVE2D-REAL-RESIDENT-EVIDENCE-COLLECTION-PLAN1

The real resident evidence collection plan is planning only. It does not collect real evidence, does not perform live probes, does not call the real renderer, does not call Cubism SDK or vendor files, and does not call external services.

The plan keeps trusted loader allowlist disabled and does not trust any loader. Owner-provided file values remain private; public summaries expose only env names and safe statuses. Fixture evidence is not real evidence, dry-run evidence is not real evidence, stale evidence is not fresh evidence, and mock owner confirmation is not real owner confirmation.

Assistant review, PR merge, local checks, target harness, browser/API smoke, and remote quality-gate PASS are not owner confirmation. Runtime readiness and production readiness are not claimed. priority1 remains BLOCKED, and the motion dataset remains non-executable while checked_row_count is 0.

Future actual evidence collection requires a separate owner-confirmed task with fresh real resident evidence handling, scoped owner confirmation, and go/no-go blocker review.

## LIVE2D-SAFE-EVIDENCE-SUMMARY-CONTRACT1 safe boundary

LIVE2D-SAFE-EVIDENCE-SUMMARY-CONTRACT1 defines a safe evidence summary contract only. It describes allowed public summary fields, required source binding, required freshness binding, required audit binding, redaction status, rejected raw fields, and future owner-confirmed collection boundaries.

This contract does not collect real evidence, does not perform live probes, does not call the real renderer, does not call the Cubism SDK, and does not call external services. It does not create owner confirmation, does not enable the trusted loader allowlist, and does not trust any loader.

Owner-provided file values remain private. Public output is limited to environment variable names and safe status labels. Raw evidence bodies, raw cue payloads, raw renderer payloads, raw loader candidates, raw loader errors, endpoint values, tokens, secrets, private local paths, model paths, motion paths, SDK/vendor paths, shell command bodies, OBS commands, world commands, raw API responses, raw audio bodies, raw frame bodies, and raw comment text are rejected from the public summary contract.

Fixture evidence is not real evidence, dry-run evidence is not real evidence, stale evidence is not fresh evidence, and mock owner confirmation is not real owner confirmation. Assistant review, PR merge, remote quality-gate PASS, local checks, target harness, browser/API smoke, fixture data, dry-run data, and mock data are not owner confirmation.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual evidence collection requires a separate owner-confirmed task.

## LIVE2D-REAL-EVIDENCE-SUMMARY-INTAKE-BINDING1 safe boundary

LIVE2D-REAL-EVIDENCE-SUMMARY-INTAKE-BINDING1 binds the safe evidence summary contract to future intake candidates only. It defines when a safe summary has the source, freshness, audit, redaction, component threshold, file scope, head SHA, and run id bindings required for later review.

This binding does not collect evidence, does not validate live services, does not perform live probes, does not call the real renderer, does not call the Cubism SDK, and does not call external services. It does not create owner confirmation, does not enable the trusted loader allowlist, and does not trust any loader.

An intake-eligible summary is not real evidence by itself, is not owner confirmation, is not runtime readiness, is not production readiness, does not resolve priority1, and does not make the motion dataset executable.

Raw evidence bodies, raw cue payloads, raw renderer payloads, raw loader candidates, raw loader errors, endpoint values, tokens, secrets, private local paths, model paths, motion paths, SDK/vendor paths, shell command bodies, OBS commands, world commands, raw API responses, raw audio bodies, raw frame bodies, and raw comment text remain rejected and non-public.

Fixture evidence is not real evidence, dry-run evidence is not real evidence, stale evidence is not fresh evidence, and mock owner confirmation is not real owner confirmation. Assistant review, PR merge, remote quality-gate PASS, local checks, target harness, browser/API smoke, fixture data, dry-run data, and mock data are not owner confirmation.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual evidence collection requires a separate owner-confirmed task.

## LIVE2D-REAL-EVIDENCE-FRESHNESS-THRESHOLD1 safe boundary

LIVE2D-REAL-EVIDENCE-FRESHNESS-THRESHOLD1 is a freshness threshold plan, not evidence collection. It defines safe component labels and age-bucket-style freshness expectations for future real resident Live2D evidence review.

No live probe is performed, no real renderer call is performed, no Cubism SDK call is performed, and no external service is called. The trusted loader allowlist remains disabled, no loader is trusted, and no SDK/vendor files are bundled, downloaded, quoted, copied, or committed.

Owner-provided file values remain private. Public summaries expose only env names and safe status labels. Fixture evidence is not real evidence, dry-run evidence is not real evidence, stale evidence is not fresh evidence, and mock owner confirmation is not real owner confirmation.

Assistant review, PR merge, remote quality-gate PASS, local checks, target harness, browser/API smoke, fixture data, dry-run data, and mock data are not owner confirmation and do not create runtime readiness or production readiness.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0.

Future actual evidence collection requires a separate owner-confirmed task with fresh real resident evidence handling, scoped owner confirmation, and go/no-go blocker review.

## LIVE2D-OWNER-CONFIRMATION-BINDING1 safe boundary

LIVE2D-OWNER-CONFIRMATION-BINDING1 is owner confirmation binding planning only. It defines how future owner confirmation must be scoped, linked to safe evidence summaries, linked to summary intake, linked to freshness thresholds, linked to collection plans, linked to audit references, checked for expiry, checked for revocation, and rejected for wrong-role or scope-mismatched confirmation.

This binding does not create owner confirmation and does not confirm any owner scope. It does not collect evidence, validate live services, perform live probes, call the real renderer, call the Cubism SDK, call external services, enable the trusted loader allowlist, or trust any loader.

Assistant review is not owner confirmation. PR merge is not owner confirmation. Remote quality-gate PASS is not owner confirmation. Local checks PASS is not owner confirmation. Target harness PASS is not owner confirmation. Browser/API smoke PASS is not owner confirmation. Operator summary is not owner confirmation. Manual summary is not owner confirmation. Safe summary intake eligibility is not owner confirmation.

Wrong-role confirmation, expired confirmation, revoked confirmation, scope-mismatched confirmation, missing audit binding, missing safe evidence summary binding, missing summary intake binding, missing freshness threshold binding, missing head SHA/run id/file scope binding, fixture evidence, dry-run evidence, and mock confirmation remain rejected.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual collection and readiness decisions require separate owner-confirmed tasks.

## LIVE2D-GO-NOGO-BLOCKER-RESOLUTION-SCHEMA1 boundary

- Go/no-go blocker resolution is planning and schema review only; it does not resolve any blocker.
- The schema requires blocker id, component, safe evidence summary binding, summary intake binding, freshness threshold binding, owner confirmation binding, audit binding, scope binding, emergency stop binding, and redaction pass before a future owner review can even consider a resolution candidate.
- A resolution candidate remains review-only and is not go/no-go approval.
- Degraded mode is separate from go and cannot make go/no-go pass.
- Remote PASS, local checks, target harness, browser/API smoke, assistant review, PR merge, manual summaries, operator summaries, safe summary intake, and owner-confirmation binding are not real evidence and do not resolve blockers.
- Fixture evidence, dry-run evidence, stale evidence, mock evidence, wrong-role confirmation, expired confirmation, revoked confirmation, and scope mismatch are rejected for blocker resolution.
- The schema does not collect real evidence, run live probes, call the renderer, call SDK/vendor code, call external services, or create owner confirmation.
- Trusted loader allowlist remains disabled. No loader is trusted.
- Runtime readiness is not claimed. Production readiness is not claimed.
- priority1 remains BLOCKED until real resident fresh evidence and separate owner-confirmed go/no-go review exist.
- Motion dataset remains non-executable; checked row count remains zero until real rows are implemented and tested in a separate task.

## LIVE2D-REAL-EVIDENCE-COLLECTOR-MANIFEST1

The real evidence collector manifest is planning only. It defines future collector names, required bindings, allowed safe summary fields, rejected raw fields, source/freshness/audit/redaction requirements, and safe next actions. It is a manifest, not collector execution.

No evidence is collected, no live probe is performed, no real renderer call is performed, no Cubism SDK call is performed, no SDK/vendor file is loaded, and no external service is called. The trusted loader allowlist remains disabled and no loader is trusted.

Required collectors are live2d_renderer_heartbeat_collector, live2d_model_configured_collector, live2d_cue_capability_collector, live2d_recovery_capability_collector, live2d_route_guard_collector, live2d_evidence_collector_status_collector, live2d_fresh_evidence_bundle_collector, live2d_summary_intake_collector, live2d_owner_confirmation_binding_collector, live2d_go_nogo_blocker_collector, trusted_loader_preflight_collector, trusted_loader_enablement_gate_collector, license_boundary_collector, sdk_vendor_boundary_collector, priority1_blocker_collector, and motion_dataset_row_evidence_collector.

Collector output must be safe summary only. Allowed public fields are component, collector_name, collector_status, evidence_source_type, freshness_status, safe_evidence_ref, safe_audit_ref, head_sha_ref, run_id_ref, file_scope, checked_at_bucket, status_reason_code, redaction_status, blocker_labels, and safe_next_action.

Raw evidence body, raw cue payload, raw renderer payload, raw loader candidate, raw loader error, endpoint values, token values, secret values, private paths, model paths, motion paths, SDK/vendor paths, owner private notes, request notes, shell command bodies, OBS commands, world commands, raw process output, and raw stack traces are rejected from the public manifest surface.

Fixture collector output is not real evidence. Dry-run collector output is not real evidence. Mock collector output is not real evidence. Stale collector output is not fresh evidence. Assistant review is not owner confirmation. PR merge is not owner confirmation. Remote quality-gate PASS is not owner confirmation.

The request packet remains request-only. The collection plan remains planning-only. The freshness threshold remains planning-only. The safe evidence summary contract remains planning-only. The summary intake binding remains planning-only. The owner confirmation binding remains planning-only. The go/no-go blocker resolution schema remains planning-only.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual collection requires a separate owner-confirmed task.

## LIVE2D-REAL-EVIDENCE-COLLECTOR-FIXTURE-PACK1

The real evidence collector fixture pack is synthetic-only planning and verification support for the collector manifest. It defines positive fixture cases for required collectors, safe output fields, source binding, freshness binding, audit binding, redaction status, and safe-summary-only output. It also defines rejection cases for fixture, dry-run, mock, stale, unknown source, missing bindings, forbidden material, collector execution attempts, real probe attempts, external service attempts, SDK attempts, renderer attempts, owner confirmation attempts, readiness claims, priority1 resolution, and motion dataset execution.

This fixture pack does not execute collectors, does not collect real evidence, does not run live probes, does not call the renderer, does not call SDK/vendor code, does not call external services, and does not create or confirm owner confirmation. It keeps the trusted loader allowlist disabled and does not trust any loader.

The public surface exposes only safe labels and safe statuses. Owner-provided values remain private; env values, endpoint values, local paths, loader candidates, loader errors, renderer payloads, evidence bodies, owner private notes, SDK/vendor paths, and vendor source content are not exposed.

The request packet remains request-only. The collection plan remains planning-only. The freshness threshold remains planning-only. The safe evidence summary contract remains planning-only. The summary intake binding remains planning-only. The owner confirmation binding remains planning-only. The go/no-go blocker resolution schema remains planning-only. The collector manifest remains planning-only.

Fixture source output is not real evidence. Dry-run source output is not real evidence. Mock source output is not real evidence. Stale source output is not fresh evidence. Assistant review is not owner confirmation. PR merge is not owner confirmation. Remote quality-gate PASS is not owner confirmation.

Runtime readiness is not claimed. Production readiness is not claimed. go/no-go remains no_go. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual collection requires a separate owner-confirmed task with fresh real resident evidence handling, scoped owner confirmation, and go/no-go blocker review.
