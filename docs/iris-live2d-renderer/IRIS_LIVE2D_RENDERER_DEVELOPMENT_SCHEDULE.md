# IRIS Live2D Renderer Development Schedule

status: draft-roadmap
risk: R3
scope: docs-only product schedule
runtime_readiness_claimed: no
production_readiness_claimed: no

## Reaction Latency Roadmap

この roadmap は phase-based schedule であり、calendar date は持たない。各 phase は前段の safety boundary と evidence requirement を壊さずに進める。Latency target は local renderer の engineering target であり、配信プラットフォーム上の viewer-visible latency は別途発生する。

## Phase 0: PR 27 dependency

- Status: PR 27 must remain separate。
- Scope: cue retention、readiness truthfulness、optional write auth、safe runtime config。
- Readiness: no runtime readiness claim。

## Phase 1: REACTION-LATENCY-SPEC1

- Status: current docs-only PR。
- Scope: reaction latency targets、two-stage response design、transport plan、preload plan、safety boundaries、implementation order。
- Runtime: no runtime code。

## Phase 2: RENDERER-CUE-CONTRACT-SAFETY1

- Scope: cue allowlist、unsupported cue safe reject、recovery-required strong motion validation。
- Outputs: safe cue validator、raw command / model path / endpoint / candidate / world_command rejection tests。
- Model loading: no real model loading。

## Phase 3: PUSH-CUE-DELIVERY2

- Scope: cue contract safety merge 後に SSE または WebSocket delivery を design / implement する。
- Goal: browser delivery latency を polling-scale から低減する。
- Boundary: safe output と auth boundaries を維持する。
- Readiness: real evidence がない限り readiness claim なし。

## Phase 4: PRELOAD-AND-SAFE-ASSET-ROUTE3

- Scope: safe model asset route、preloading strategy、no raw path exposure。
- Route: unavailable route を advertise しない。
- Tests: model path redaction を検証する。

## Phase 5: REAL-MODEL-LOAD4

- Scope: real Cubism/model3 load、scene binding、fresh heartbeat、real model evidence。
- Goal: model_loaded と scene_loaded を truthfully に enable する。
- Production: no production readiness claim。

## Inserted Preflight: LIVE2D-LOADER-INTEGRATION-PREFLIGHT5

- Position: between REAL-MODEL-LOAD4 and MICRO-REACTION-PACK5.
- Scope: define trusted Cubism loader capability classes and future evidence contract.
- Reason: compatible real Cubism model loader is not bundled yet.
- Boundary: CubismCore, manifest, asset route, SSE, cue acceptance, fixture, dry-run, stale, or synthetic heartbeat evidence must not become renderer_ready.
- Motion dataset: runtime_motion_allowlist stays separate from expression_candidate_labels; future micro reaction labels are not executable until implemented and tested.
- Production: no runtime readiness claim and no production readiness claim.

## Inserted Preflight: LIVE2D-CUBISM-LOADER-INTEGRATION7

- Position: after trusted loader evidence gate and before MICRO-REACTION-PACK5.
- Scope: select `cubism_framework_model_loader_v1` as the future real loader path and keep `cubism_moc_create` diagnostic-only.
- Dependency: if compatible framework loader files are absent, report `missing_dependency` or `operator_attention_required` safely.
- Boundary: loader-shaped objects, fixture loaders, safe asset routes, manifest availability, SSE, polling, and cue acceptance must not become renderer_ready.
- Allowlist: trusted loader allowlist remains disabled until owner-confirmed real loader evidence is available.
- Production: no runtime readiness claim and no production readiness claim.

## Inserted Preflight: LIVE2D-CUBISM-LOADER-PROVISIONING8

- Position: after loader integration selection and before enabling any trusted loader kind.
- Scope: verify owner-provided Cubism Framework loader provisioning through safe environment names only.
- License boundary: Cubism SDK / Framework files are owner-provided licensed material; this repo must not download, redistribute, commit, or quote vendor files.
- Privacy boundary: env values and local file locations stay private; runtime summaries expose only env names and safe status labels.
- Allowlist: trusted loader allowlist remains disabled; provisioning does not enable `cubism_framework_model_loader_v1`.
- Readiness: provisioning does not set model_loaded, scene_loaded, browser_cue_delivery_ready, renderer_ready, runtime readiness, or production readiness.
- Next gate: a later PR may enable a trusted loader kind only with license/provisioning confirmation, owner approval, and same-head tests.

## Inserted Preflight: LIVE2D-CUBISM-CORE-ROUTE-GUARD9

- Position: after loader provisioning and before trusted loader allowlist work.
- Scope: harden `/renderer/cubism-core.js` with loopback/local route guard and safe owner-provided Cubism Core candidate handling.
- License boundary: Cubism SDK / Core files remain owner-provided licensed material outside the repo; this repo must not download, redistribute, commit, or quote vendor files.
- Privacy boundary: env values and local file locations stay private; public route statuses expose only env names and safe labels.
- Allowlist: trusted loader allowlist remains disabled; route guard does not make a loader trusted.
- Readiness: route guard does not set model_loaded, scene_loaded, browser_cue_delivery_ready, renderer_ready, runtime readiness, or production readiness.
- Next gate: trusted loader allowlist and Live2D real evidence collector require separate owner-confirmed PRs.

## Phase 6: MICRO-REACTION-PACK5

- Scope: instant nonverbal cue pack。
- Target: internal event arrival 後 50 to 300 ms local renderer target。
- Examples: blink_attention、small_nod、soft_smile、surprise_micro、breathing_shift。

## Phase 7: COMMENT-REACTION-PIPELINE6

- Scope: comment acknowledgement first、speech/TTS second。
- Targets: visual ack は local comment event 後 300 to 800 ms。spoken response は feasible な場合に 1.5 to 4 seconds。

## Phase 8: GAME-REACTION-PIPELINE7

- Scope: approved safe game-event reactions。
- Target: approved local game event 後 50 to 300 ms。
- Boundary: no game input or OS command。

## Phase 9: STRONG-MOTION-RECOVERY8

- Scope: laugh_big、surprise_scream、happy_dance、happy_loud_sing、closeup。
- Recovery: required。
- Guard: viewer comfort と visibility guard が必要。

## Phase 10: LIVE-READINESS-EVIDENCE9

- Scope: fresh Live2D evidence collector、owner confirmation、go/no-go integration。
- Boundary: no fixture-to-real promotion。
- Production: owner confirmation と fresh evidence なしに production go しない。
