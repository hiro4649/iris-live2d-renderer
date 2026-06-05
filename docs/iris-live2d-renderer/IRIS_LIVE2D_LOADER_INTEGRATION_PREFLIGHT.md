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
