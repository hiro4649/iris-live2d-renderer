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

## LIVE2D-REAL-EVIDENCE-FRESHNESS-THRESHOLD1 safe boundary

LIVE2D-REAL-EVIDENCE-FRESHNESS-THRESHOLD1 is a freshness threshold plan, not evidence collection. It defines safe component labels and age-bucket-style freshness expectations for future real resident Live2D evidence review.

No live probe is performed, no real renderer call is performed, no Cubism SDK call is performed, and no external service is called. The trusted loader allowlist remains disabled, no loader is trusted, and no SDK/vendor files are bundled, downloaded, quoted, copied, or committed.

Owner-provided file values remain private. Public summaries expose only env names and safe status labels. Fixture evidence is not real evidence, dry-run evidence is not real evidence, stale evidence is not fresh evidence, and mock owner confirmation is not real owner confirmation.

Assistant review, PR merge, remote quality-gate PASS, local checks, target harness, browser/API smoke, fixture data, dry-run data, and mock data are not owner confirmation and do not create runtime readiness or production readiness.

Runtime readiness is not claimed. Production readiness is not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0.

Future actual evidence collection requires a separate owner-confirmed task with fresh real resident evidence handling, scoped owner confirmation, and go/no-go blocker review.
