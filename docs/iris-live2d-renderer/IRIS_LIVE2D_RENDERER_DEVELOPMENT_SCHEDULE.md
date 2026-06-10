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

## Inserted Preflight: LIVE2D-REAL-EVIDENCE-COLLECTOR1

- Position: after Cubism Core route guard and before any readiness claim or trusted loader allowlist work.
- Scope: add a safe-summary-only evidence collector contract for heartbeat freshness, model/scene evidence labels, cue capability labels, recovery capability labels, last cue application labels, source type, blocked/attention reason, and safe next action.
- Evidence boundary: fixture evidence, dry-run evidence, stale evidence, missing timestamps, and incomplete real-probe evidence are not real readiness evidence.
- Privacy boundary: raw model paths, motion paths, endpoints, tokens, private paths, raw cue payloads, raw renderer payloads, raw evidence bodies, SDK/vendor paths, and vendor source stay private.
- Readiness: the collector does not set model_loaded, scene_loaded, browser_cue_delivery_ready, renderer_ready, runtime readiness, production readiness, or priority1 completion.
- Next gate: fresh resident real evidence, trusted loader allowlist, and owner confirmation require separate PRs.

## Inserted Preflight: LIVE2D-TRUSTED-LOADER-ALLOWLIST-PREFLIGHT1

- Position: after the real evidence collector and before any trusted loader enablement.
- Scope: add safe allowlist preflight labels for disabled allowlist status, candidate kind/status, route guard prerequisite, real evidence prerequisite, owner confirmation prerequisite, license attention, blocker reason, and safe next action.
- Allowlist boundary: trusted loader allowlist remains disabled, no loader is trusted, no loader candidate is executed, and candidate_present remains diagnostic only.
- License boundary: Cubism SDK / Framework files are owner-provided licensed material outside the repo; this repo must not download, redistribute, commit, or quote vendor files.
- Privacy boundary: owner-provided values, raw loader candidates, loader errors, SDK paths, endpoints, tokens, raw cues, raw renderer payloads, and raw evidence bodies stay private; public summaries expose only env names and safe status labels.
- Prerequisites: route guard, real evidence collector, fresh real evidence, license attention, and owner confirmation remain required before future enablement.
- Readiness: this preflight does not set model_loaded, scene_loaded, browser_cue_delivery_ready, renderer_ready, runtime readiness, production readiness, or priority1 completion.
- Next gate: actual trusted loader enablement requires a separate owner-confirmed PR with fresh real evidence and same-head checks.

## Inserted Preflight: LIVE2D-TRUSTED-LOADER-ENABLEMENT-GATE1

- Position: after trusted loader allowlist preflight and before any actual trusted loader enablement.
- Scope: add a fail-closed enablement gate that reports safe labels for enablement status, blockers, required prerequisites, missing prerequisites, route guard status, real evidence status, owner confirmation status, license status, candidate kind status, allowlist status, freshness status, safe next action, and readiness claim status.
- Gate boundary: trusted loader allowlist remains disabled, no loader is trusted, no loader candidate is executed, and candidate_present remains diagnostic only.
- Prerequisites: route guard, real evidence collector, allowlist preflight, fresh real evidence, owner confirmation, license boundary, known supported loader kind, safe public summaries, and no raw exposure remain required.
- Evidence boundary: fixture evidence, dry-run evidence, stale evidence, missing owner confirmation, expired owner confirmation, unknown loader kind, future-only loader kind, license attention, allowlist disabled, priority1 unresolved, and motion dataset non-executable states all stay blocked.
- License boundary: Cubism SDK / Framework files remain owner-provided licensed material outside the repo; this repo must not download, redistribute, commit, copy, or quote vendor files.
- Privacy boundary: owner-provided values, raw loader candidates, loader errors, SDK paths, endpoints, tokens, raw cues, raw renderer payloads, raw evidence bodies, local paths, and vendor source stay private.
- Readiness: this gate does not set model_loaded, scene_loaded, browser_cue_delivery_ready, renderer_ready, runtime readiness, production readiness, or priority1 completion.
- Next gate: actual trusted loader enablement requires a separate owner-confirmed PR with fresh real evidence and same-head checks.

## Inserted Preflight: LIVE2D-TRUSTED-LOADER-OWNER-HANDOFF1

- Position: after trusted loader enablement gate and before any actual trusted loader enablement or live handoff.
- Scope: add a safe owner handoff packet for review preparation, required confirmations, required real evidence, route guard status, evidence collector status, allowlist preflight status, enablement gate status, license boundary, SDK/vendor boundary, candidate status, freshness status, priority1 status, motion dataset status, safe next action, and residual risks.
- Handoff boundary: this is review preparation only; trusted loader allowlist remains disabled, no loader is trusted, no loader candidate is executed, no live handoff is performed, and no production go/no-go is created.
- Prerequisites: route guard, real evidence collector, allowlist preflight, enablement gate, fresh real evidence, owner confirmation, license boundary, SDK/vendor boundary, known supported loader kind, safe public summaries, and no raw exposure remain required.
- Evidence boundary: fixture evidence, dry-run evidence, stale evidence, mock owner confirmation, missing owner confirmation, expired owner confirmation, unknown loader kind, future-only loader kind, license attention, allowlist disabled, enablement gate blocked, priority1 unresolved, and motion dataset non-executable states all stay blocked.
- License boundary: Cubism SDK / Framework files remain owner-provided licensed material outside the repo; this repo must not download, redistribute, commit, copy, or quote vendor files.
- Privacy boundary: owner-provided values, owner private notes, raw loader candidates, loader errors, SDK paths, endpoints, tokens, raw cues, raw renderer payloads, raw evidence bodies, local paths, and vendor source stay private.
- Readiness: this handoff does not set model_loaded, scene_loaded, browser_cue_delivery_ready, renderer_ready, runtime readiness, production readiness, or priority1 completion.
- Next gate: actual trusted loader enablement requires a separate owner-confirmed PR with fresh real evidence and same-head checks.

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

### LIVE2D-FRESH-EVIDENCE-BUNDLE1

- Purpose: add a safe fresh evidence bundle for owner review preparation only.
- Prerequisites: route guard, real evidence collector, trusted loader allowlist preflight, trusted loader enablement gate, owner handoff, fresh real evidence, owner confirmation, license boundary, and SDK/vendor boundary.
- Non-goals: no trusted loader allowlist enablement, no trusted loader, no SDK/vendor load, no SDK/vendor download, no SDK/vendor commit, no vendor source quote, no runtime readiness, and no production readiness.
- Privacy boundary: owner-provided file values, raw loader candidates, raw loader errors, SDK paths, endpoints, tokens, raw cues, raw renderer payloads, raw evidence bodies, local paths, and owner private notes stay private; public summaries expose only env names and safe status labels.
- Evidence boundary: fixture evidence, dry-run evidence, stale evidence, mock owner confirmation, missing owner confirmation, license attention, SDK/vendor boundary issues, priority1 unresolved, and motion dataset non-executable states all keep the bundle blocked.
- Next actual enablement: separate owner-confirmed PR with fresh real evidence, owner confirmation, and go/no-go review.

## LIVE2D-GO-NOGO-PREFLIGHT1 schedule note

LIVE2D-GO-NOGO-PREFLIGHT1 adds a fail-closed review-preparation status surface for future trusted loader enablement review. It does not perform actual go/no-go approval, does not enable the trusted loader allowlist, does not trust any loader, and does not load or call Cubism SDK/vendor files.

The schedule remains blocked on route guard, real evidence collector, allowlist preflight, enablement gate, owner handoff, Fresh Evidence Bundle, fresh real evidence, owner confirmation, and license boundary prerequisites. Owner-provided file values stay private; only env names and safe status labels may be public. candidate_present remains diagnostic only.

Runtime readiness and production readiness are not claimed by this work. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0, and degraded_mode_available is not a go signal.

Actual trusted loader enablement remains future work and requires a separate owner-confirmed PR after all no-go blockers are resolved.

## LIVE2D-REAL-EVIDENCE-INTAKE1 schedule note

LIVE2D-REAL-EVIDENCE-INTAKE1 adds a safe schema and redaction intake surface for future Live2D readiness review. It is not real collection, does not perform live probes, does not enable trusted loader allowlist, does not trust any loader, and does not load or call SDK/vendor files.

Only safe summarized metadata is in scope. Owner-provided file values remain private; public summaries expose only env names and safe statuses. Fixture evidence, dry-run evidence, stale evidence, manual summary without owner confirmation, and mock owner confirmation do not become fresh real evidence.

Route guard, real evidence collector, Fresh Evidence Bundle, and go/no-go preflight remain prerequisites, and the go/no-go preflight remains no_go by default. Runtime readiness and production readiness are not claimed. priority1 remains BLOCKED, and the motion dataset remains non-executable while checked_row_count is 0.

Future trusted loader enablement remains a separate owner-confirmed PR after real fresh evidence and go/no-go blockers are resolved.

## LIVE2D-OWNER-CONFIRMATION-ENVELOPE1 schedule note

LIVE2D-OWNER-CONFIRMATION-ENVELOPE1 adds a safe owner confirmation envelope for future Live2D readiness review. It is not real owner confirmation and does not auto-confirm from PR merge, remote quality-gate PASS, local checks, target harness, smoke, fixture, dry-run, or mock data.

Confirmation remains scope-specific, expiry-aware, revocation-aware, and role-bound. Wrong-role, expired, revoked, mock, and scope-mismatched confirmation states remain blocked. Raw owner notes and owner-provided values stay private.

Real evidence intake remains schema-only, Fresh Evidence Bundle remains review-preparation only, go/no-go preflight remains no_go, trusted loader allowlist remains disabled, and no loader is trusted.

Runtime readiness and production readiness are not claimed. priority1 remains BLOCKED, and the motion dataset remains non-executable while checked_row_count is 0. Future trusted loader enablement remains a separate owner-confirmed PR after real fresh evidence and go/no-go blockers are resolved.

## LIVE2D-REAL-EVIDENCE-REQUEST-PACKET1 schedule note

The real evidence request packet is a review-preparation artifact. It lists the real fresh evidence components and owner confirmation scopes that the owner/operator must provide later, without collecting evidence, probing live services, creating owner confirmation, enabling trusted loader behavior, or claiming readiness.

The packet keeps real evidence intake schema-only, owner confirmation envelope schema-only, go/no-go as no_go, priority1 BLOCKED, and the motion dataset non-executable. Future actual trusted loader enablement remains a separate owner-confirmed PR after real fresh evidence and go/no-go blockers are resolved.

## LIVE2D-REAL-RESIDENT-EVIDENCE-COLLECTION-PLAN1

LIVE2D-REAL-RESIDENT-EVIDENCE-COLLECTION-PLAN1 adds a safe planning/status surface for future real resident Live2D evidence collection. It defines required components, accepted future source types, rejected source types, forbidden raw fields, freshness thresholds, owner confirmation dependencies, audit references, go/no-go relationship, priority1 relationship, motion dataset relationship, and safe next actions.

This is a collection plan, not collection. No live probe is performed, no real renderer call is performed, no SDK/vendor call is performed, no external service is called, no trusted loader is enabled, and no loader is trusted.

Owner-provided file values remain private; only env names and safe statuses are public. Assistant review, PR merge, remote quality-gate PASS, local checks, target harness, smoke, fixture, dry-run, stale evidence, and mock data do not create owner confirmation or readiness.

Runtime readiness and production readiness are not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual evidence collection requires a separate owner-confirmed task.

## LIVE2D-REAL-EVIDENCE-SUMMARY-INTAKE-BINDING1 schedule note

LIVE2D-REAL-EVIDENCE-SUMMARY-INTAKE-BINDING1 adds a planning-only binding between the safe evidence summary contract and future real evidence intake candidates.

The binding defines required source binding, freshness binding, audit binding, redaction status, component threshold binding, file scope, head SHA reference, run id reference, and rejection reasons for missing, stale, fixture, dry-run, mock, unsafe, or unknown summary inputs.

This is not evidence collection and not live validation. No live probe is performed, no real renderer call is performed, no SDK/vendor call is performed, no external service is called, no trusted loader is enabled, and no loader is trusted.

An intake-eligible summary is not real evidence by itself, is not owner confirmation, and is not readiness. Assistant review, PR merge, remote quality-gate PASS, local checks, target harness, smoke, fixture evidence, dry-run evidence, stale evidence, and mock owner confirmation do not create owner confirmation or readiness.

Runtime readiness and production readiness are not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual evidence collection requires a separate owner-confirmed task.

## LIVE2D-SAFE-EVIDENCE-SUMMARY-CONTRACT1 schedule note

LIVE2D-SAFE-EVIDENCE-SUMMARY-CONTRACT1 adds a safe summary contract for future real resident Live2D evidence review. It is contract/planning only, not evidence collection.

The contract defines allowed summary fields, required source binding, required freshness binding, required audit binding, redaction status, accepted source types, rejected source types, and rejected raw fields. Raw evidence bodies, raw cue payloads, raw renderer payloads, endpoint values, tokens, secrets, private paths, model paths, motion paths, SDK/vendor paths, shell command bodies, OBS commands, world commands, raw API responses, raw audio bodies, raw frame bodies, and raw comment text remain non-public.

No live probe is performed, no real renderer call is performed, no SDK/vendor call is performed, no external service is called, no trusted loader is enabled, and no loader is trusted. Assistant review, PR merge, remote quality-gate PASS, local checks, target harness, smoke, fixture evidence, dry-run evidence, stale evidence, and mock owner confirmation do not create owner confirmation or readiness.

Runtime readiness and production readiness are not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual evidence collection requires a separate owner-confirmed task.

## LIVE2D-REAL-EVIDENCE-FRESHNESS-THRESHOLD1 schedule note

LIVE2D-REAL-EVIDENCE-FRESHNESS-THRESHOLD1 adds planning-only freshness thresholds for future Live2D real resident evidence. It defines component-specific safe labels and age buckets for renderer heartbeat, model configured status, cue capability, recovery capability, route guard, evidence collector, Fresh Evidence Bundle, real evidence intake, go/no-go, owner confirmation envelope, trusted loader gates, license/SDK boundaries, priority1, and motion dataset row evidence.

This is not collection. No live probe is performed, no real renderer call is performed, no SDK/vendor call is performed, and no external service is called. Trusted loader allowlist remains disabled and no loader is trusted.

Owner-provided file values remain private; only env names and safe statuses are public. Assistant review, PR merge, remote quality-gate PASS, local checks, target harness, smoke, fixture evidence, dry-run evidence, stale evidence, and mock owner confirmation do not create owner confirmation or readiness.

Runtime readiness and production readiness are not claimed. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual evidence collection requires a separate owner-confirmed task.

### LIVE2D-OWNER-CONFIRMATION-BINDING1

- Purpose: define a safe owner confirmation binding for future real resident evidence handling.
- Scope: future owner confirmation scopes, safe evidence summary references, summary intake references, freshness threshold references, collection plan references, audit references, owner scope, expiry status, revocation status, and safe reason codes.
- Boundary: planning only; no owner confirmation is created, no owner scope is confirmed, no real evidence is collected, no live probe runs, no real renderer or SDK call runs, no external service is called, no trusted loader allowlist is enabled, and no loader is trusted.
- Rejection policy: assistant review, PR merge, remote PASS, local PASS, target harness PASS, browser/API smoke PASS, operator summary, manual summary, safe summary intake eligibility, fixture evidence, dry-run evidence, mock confirmation, wrong-role confirmation, expired confirmation, revoked confirmation, and scope mismatch are not owner confirmation.
- Readiness: runtime readiness and production readiness are not claimed; priority1 remains BLOCKED; motion dataset remains non-executable while checked_row_count is 0.
- Next actual collection: separate owner-confirmed task with fresh real resident evidence, audit binding, scoped owner confirmation, and go/no-go blocker review.

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

### LIVE2D-REAL-EVIDENCE-COLLECTOR-FIXTURE-PACK1

- Purpose: add a synthetic-only fixture pack and dry-run verifier surface for the real evidence collector manifest.
- Scope: positive fixture cases for required collectors, safe output fields, source binding, freshness binding, audit binding, redaction status, and safe-summary-only output.
- Rejection policy: fixture, dry-run, mock, stale, unknown source, missing binding, forbidden material, collector execution attempt, real probe attempt, external service attempt, SDK attempt, renderer attempt, owner confirmation attempt, readiness claim, priority1 resolution, and motion dataset execution remain rejected.
- Boundary: no collector execution, no real evidence collection, no live probe, no renderer call, no SDK/vendor call, no external service call, no owner confirmation creation, no owner confirmation confirmation, no trusted loader enablement, and no trusted loader.
- Preservation: request packet request-only, collection plan planning-only, freshness threshold planning-only, safe evidence summary contract planning-only, summary intake binding planning-only, owner confirmation binding planning-only, go/no-go blocker resolution schema planning-only, and collector manifest planning-only.
- Public surface: safe labels and safe statuses only; owner-provided values remain private and no env values, endpoint values, local paths, loader candidates, loader errors, renderer payloads, evidence bodies, owner private notes, SDK/vendor paths, or vendor source content are exposed.
- Readiness: runtime readiness and production readiness are not claimed; go/no-go remains no_go; priority1 remains BLOCKED; motion dataset remains non-executable while checked_row_count is 0.
- Next actual collection: separate owner-confirmed task with fresh real resident evidence handling, scoped owner confirmation, and go/no-go blocker review.

## LIVE2D-REAL-EVIDENCE-COLLECTOR-DRY-RUN-ENVELOPE1

The real evidence collector dry-run envelope is planning only. It validates future collector execution request shape, requested collector names, source binding, freshness binding, audit binding, redaction status, safe output fields, rejected raw fields, rejected source types, network policy, SDK policy, renderer policy, owner confirmation separation, and safe next action labels. It is an envelope, not collector execution.

No collector is executed, no evidence is collected, no live probe is performed, no real renderer call is performed, no Cubism SDK call is performed, no SDK/vendor file is loaded, and no external service is called. The trusted loader allowlist remains disabled and no loader is trusted.

Accepted dry-run request shape is only a review candidate. Dry-run pass is not real evidence. Fixture pass is not real evidence. Mock pass is not real evidence. Stale output is not fresh evidence. Assistant review is not owner confirmation. PR merge is not owner confirmation. Remote quality-gate PASS is not owner confirmation.

Raw evidence body, raw cue payload, raw renderer payload, raw loader candidate, raw loader error, endpoint values, token values, secret values, private paths, model paths, motion paths, SDK/vendor paths, owner private notes, request notes, shell command bodies, OBS commands, world commands, raw process output, and raw stack traces are rejected from the public envelope surface.

The request packet remains request-only. The collection plan remains planning-only. The freshness threshold remains planning-only. The safe evidence summary contract remains planning-only. The summary intake binding remains planning-only. The owner confirmation binding remains planning-only. The go/no-go blocker resolution schema remains planning-only. The collector manifest remains planning-only. The collector fixture pack remains synthetic-only.

Runtime readiness is not claimed. Production readiness is not claimed. go/no-go remains no_go. priority1 remains BLOCKED until real resident fresh evidence exists. The motion dataset remains non-executable while checked_row_count is 0. Future actual collection requires a separate owner-confirmed task with fresh real resident evidence handling, scoped owner confirmation, and go/no-go blocker review.
## LIVE2D-MOTION-DATASET-ROW-SCHEMA-PREFLIGHT1

- Scope: add planning-only motion dataset row schema and audit preflight labels for future owner review.
- Required row fields: row identity, dataset split, motion and expression labels, gaze, breath, body, camera, timing, intensity, cooldown, recovery, visibility, comfort, accessibility, eval contamination policy, renderer-ready dependencies, and audit run metadata.
- Runtime supported motion styles: talk, focused_talk, laugh_big, idle_breath, surprise_scream, happy_humming, happy_dance, happy_loud_sing.
- Experimental labels remain non-executable: blink_attention, small_nod, soft_smile, surprise_micro, breathing_shift, gaze_return, neutral_breath.
- Boundary: no real row ingestion, no motion execution, no real collection, no live probe, no owner confirmation creation, no owner confirmation confirmation, no trusted loader enablement, no runtime readiness claim, no production readiness claim, no priority1 resolution, and no go decision.
- Evidence policy: fixture success, manifest existence, asset route success, SSE connection, cue acceptance, and browser cue delivery are rejected as real row success evidence.
- Current status: checked_row_count remains 0, motion dataset remains non-executable, go/no-go remains no_go, and priority1 remains BLOCKED until real resident fresh evidence and a separate owner-confirmed task exist.

## LIVE2D-MOTION-DATASET-SYNTHETIC-ROW-FIXTURE-PACK1

- Scope: add synthetic-only fixture labels and validator coverage for the motion dataset row schema without adding real rows.
- Accepted synthetic fixture cases: safe talk, idle breath, recovery, subtitle visibility, low intensity, accessibility, eval split, and renderer-ready-false rows.
- Rejected synthetic fixture cases: missing required row or audit fields, duplicate row IDs, unsupported or experimental executable motion labels, expression/gaze/breath/camera labels used as motion styles, raw/private/command material, readiness shortcuts, missing renderer-ready dependencies, missing UX guards, and missing eval contamination guard.
- Boundary: no real row ingestion, no motion execution, no real collection, no live probe, no owner confirmation creation, no owner confirmation confirmation, no trusted loader enablement, no runtime readiness claim, no production readiness claim, no priority1 resolution, and no go decision.
- Evidence policy: synthetic fixture success, manifest existence, asset route success, SSE connection, cue acceptance, and browser cue delivery remain rejected as renderer-ready or real evidence.
- Current status: real_row_data_present remains false, checked_row_count remains 0, motion dataset remains non-executable, motion_dataset_ready_candidate remains false, go/no-go remains no_go, and priority1 remains BLOCKED until real resident fresh evidence and a separate owner-confirmed task exist.

## LIVE2D-MOTION-DATASET-REAL-ROW-INTAKE-REQUEST-PACKET1

- Scope: add a planning-only request packet/status surface for future owner-provided row_id-backed JSONL or CSV motion dataset ingestion.
- Required request fields: dataset name, request id, request schema version, requested file format, expected row count, split plan, source file label, source hash, audit run id, auditor version, owner confirmation requirement, redaction policy reference, row schema reference, synthetic fixture pack reference, and safe next action.
- Format policy: jsonl and csv are the only future file format labels; no JSONL or CSV content is committed or parsed by this task.
- Boundary: request packet only; no real row ingestion, no row body parsing, no motion execution, no real collection, no live probe, no renderer call, no SDK/vendor call, no external service call, no owner confirmation creation, no owner confirmation confirmation, no trusted loader enablement, no runtime readiness claim, no production readiness claim, no priority1 resolution, and no go decision.
- Rejection policy: raw row bodies, raw cue or renderer material, raw model or motion locations, network values, credential values, local private references, candidate material, world/OBS/game/OS instructions, memory or relationship commits, raw process output, raw stack traces, owner private notes, and raw K memo text are rejected from the request packet public surface.

## LIVE2D-MOTION-DATASET-REAL-ROW-INTAKE-DRY-RUN-VALIDATOR1

- Scope: add a planning-only dry-run validator/status surface for future real row intake request metadata.
- Accepted request fixture cases: safe JSONL request metadata, safe CSV request metadata, safe split plan request, safe hash-present request, safe owner-confirmation-required request, and safe renderer-ready-policy request.
- Rejected request fixture cases: missing request metadata, unsupported file format, owner confirmation already confirmed, raw row bodies, raw cue or renderer material, raw model or motion locations, network values, credential values, private local references, world/OBS/game/OS instructions, memory or relationship commits, readiness claims, motion execution requests, and real ingestion requests.
- Boundary: dry-run validation only; no real row ingestion, no row body parsing, no pass/fail over actual data, no motion execution, no real collection, no live probe, no renderer call, no SDK/vendor call, no external service call, no owner confirmation creation, no owner confirmation confirmation, no trusted loader enablement, no runtime readiness claim, no production readiness claim, no priority1 resolution, and no go decision.
- Preservation: `checked_row_count` stays `0`, `real_row_data_present` stays false, motion dataset remains non-executable, owner confirmation remains required and unconfirmed, `priority1` remains `BLOCKED`, and go/no-go remains `no_go`.
- Next boundary: future real row ingestion requires a separate owner-confirmed actual data task after request packet review, real resident evidence, owner confirmation, license and SDK/vendor boundary review, and go/no-go review.

## LIVE2D-MOTION-DATASET-REAL-ROW-INTAKE-QUARANTINE-ENVELOPE1

- Scope: add a planning-only quarantine envelope/status surface for future owner-provided row_id-backed JSONL or CSV file metadata.
- Required metadata: request id, dataset name, file label, file format, declared row count, source hash, schema version, dataset split plan, audit run id, auditor version, row schema reference, request packet reference, dry-run validator reference, synthetic fixture pack reference, redaction policy reference, owner confirmation requirement, and safe next action.
- Format policy: jsonl and csv remain future file format labels only; no JSONL or CSV file content is committed, read, parsed, or ingested by this task.
- Boundary: quarantine metadata only; no real row ingestion, no row body read, no actual file content acceptance, no motion execution, no real collection, no live probe, no renderer call, no SDK/vendor call, no external service call, no owner confirmation creation, no owner confirmation confirmation, no trusted loader enablement, no runtime readiness claim, no production readiness claim, no priority1 resolution, and no go decision.
- Preservation: `checked_row_count` stays `0`, `real_row_data_present` stays false, motion dataset remains non-executable, owner confirmation remains required and unconfirmed, `priority1` remains `BLOCKED`, and go/no-go remains `no_go`.
- Next boundary: future real row ingestion requires a separate owner-confirmed actual data task after quarantine metadata review, real resident evidence, owner confirmation, license and SDK/vendor boundary review, and go/no-go review.
- Current status: real_row_data_present remains false, checked_row_count remains 0, motion dataset remains non-executable, motion_dataset_ready_candidate remains false, go/no-go remains no_go, and priority1 remains BLOCKED until real resident fresh evidence and a separate owner-confirmed actual data task exist.
