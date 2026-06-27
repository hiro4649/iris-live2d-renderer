# Project Spec

Last updated: 2026-06-27

## Project Goal

`hiro4649/iris-live2d-renderer` is the local Live2D renderer scaffold for IRIS cue delivery. The project currently provides safe HTTP endpoints, browser bootstrap/runtime state, cue intake, planning summaries, and strict safety guards while the actual Cubism SDK/model/dataset owner decisions remain blocked.

## MVP Definition

The MVP is a safe local renderer shell that can:

- expose health/status/runtime-config endpoints;
- accept bounded cue payloads over the local write boundary;
- serve browser bootstrap assets and safe renderer diagnostics;
- preserve compatibility for existing planning summary exports;
- keep false readiness claims blocked until real Cubism SDK, model, and evidence gates are explicitly approved.

MVP does not mean actual renderer readiness.

## Current Architecture

- Server: `src/server.js` creates the local HTTP API and static asset routes.
- State: `src/state.js` builds renderer state, cue lifecycle state, compact safe summaries, planning summaries, trusted-loader gates, and readiness blockers.
- Browser client: `public/renderer.js` polls or streams cues, posts heartbeat, and uses a null adapter unless a future trusted runtime path is authorized.
- Adapter: `public/rendererAdapter.js` currently exposes `createNullRendererAdapter`; it reports `rendererReady: false` and does not load or render a model.
- Planning monolith: `src/renderer/cubismLoaderProvisioning.js` remains the legacy public compatibility surface.
- Planning modules: `src/renderer/planning/*.js` hold physically extracted planning-only summaries.
- Planning facades:
  - `src/renderer/planning/motionDatasetPlanningSummaries.js`
  - `src/renderer/planning/motionIdentityComfortSummaries.js`
  - `src/renderer/planning/rendererReadinessSummaries.js`

## Functional Specifications

- Cue write routes must enforce safe local write boundaries and bounded JSON payloads.
- Status surfaces must remain safe-summary-only and must not expose secrets, raw logs, raw payloads, private paths, stack traces, or actual row bodies.
- Browser smoke markers may prove JavaScript/bootstrap execution only; they do not prove actual rendering.
- Planning summaries describe gates, blockers, and future prerequisites only.
- Legacy public exports must remain stable unless explicitly scoped.

## Data Models

- Renderer state is in-memory and created by `createRendererState`.
- Browser cue queue is bounded.
- Planning data models are safe public summary objects and frozen constants.
- Motion dataset planning uses synthetic fixtures and metadata labels only.
- Actual dataset rows, raw row bodies, actual file paths, actual file contents, and product hashes are not data models in the current implementation.

## APIs

Primary local routes include:

- `GET /health`
- `GET /status`
- `GET /renderer/runtime-config`
- `GET /renderer/browser-bootstrap-config`
- `GET /renderer/cues`
- `GET /renderer/events`
- `POST /renderer/heartbeat`
- `POST /live2d-engine`
- `POST /cue`

Model/Cubism asset routes are guarded and remain non-readiness evidence unless all owner-approved runtime prerequisites are satisfied.

## Design Decisions

- Use fail-closed summaries for owner confirmation, dataset, parser, redaction, audit, readiness, trusted loader, and motion execution gates.
- Keep physical extraction mechanical: move definitions, preserve legacy re-exports, and freeze pre-move behavior with synthetic-only fixtures.
- Keep planning facades explicit so unrelated monolith exports cannot leak into public planning module APIs.
- Treat test-only JSON SHA-256 fingerprints as parity evidence only, never as product source-hash verification.
- Treat v1.3.0 as a metadata bridge target profile for this repository only when AGENTS, manifest, policy index, v130 spec, and v130 self-test agree that product/runtime authority remains unchanged.

## Constraints

- Current project is not renderer-ready.
- Null adapter is not an actual renderer.
- Planning summaries are not actual dataset audit.
- Actual SDK/model/dataset are not read before owner decision.
- Motion dataset executable is false.
- `checked_row_count` is 0.
- `priority1` remains BLOCKED.
- Trusted loader allowlist remains disabled.
- Runtime readiness and production readiness are not claimed.

## Boundaries

- Actual Cubism boundary: no actual Cubism SDK vendor files are added, copied, quoted, or treated as trusted runtime evidence in current work.
- Actual model boundary: no actual model file is read or loaded for readiness in current work.
- Actual dataset boundary: no actual row body, actual data file, actual file path, actual file content, parser execution, redaction scan execution, audit execution, or real hash calculation is allowed.
- Owner decision boundary: owner confirmation is not created, inferred, or confirmed by planning summaries, PR review, CI, or local tests.

## Runtime Readiness Definition

Runtime readiness requires fresh, same-head, owner-scoped evidence that an approved Cubism runtime, trusted loader, model, scene, heartbeat, and cue application path work together without safety downgrades. This condition is not currently met.

## Production Readiness Definition

Production readiness requires runtime readiness plus owner-approved production gates, security review, operational evidence, and no unresolved priority1 blocker. This condition is not currently met.

## Public API Compatibility Policy

Legacy public exports from `src/renderer/cubismLoaderProvisioning.js` must remain compatible when planning definitions are physically extracted. Extracted symbols should be re-exported by name from the monolith unless a later explicit API decision changes this policy.

## Planning Facade Policy

Planning facades expose only explicitly approved symbols. Physical extraction does not automatically expand facade APIs.

## Pre-Move Baseline Policy

Each physical extraction must preserve behavior against a synthetic-only pre-move baseline fixture. Fixtures may record object shape, key order, JSON length, test-only hashes, constants, freeze status, and input non-mutation. Fixtures must not contain actual data.

## Security Policy

- Do not print token values.
- Do not expose raw logs, raw payloads, endpoint secrets, private paths, row bodies, owner private notes, command payloads, or stack traces.
- Keep external services, renderer runtime, SDK, OBS, DB, TTS, YouTube, Game, parser, redaction, and audit execution out of scope unless explicitly approved.

## Test Policy

Run the narrowest local checks first, then full local tests before final review. During the current GitHub Actions quota-control window, do not push, open PRs, update PRs, or rerun remote CI without owner approval.

## Non-Goals Before QUEUE-M

- No actual SDK/model owner decision.
- No trusted loader enablement.
- No actual row ingestion.
- No parser/redaction/audit execution.
- No owner confirmation creation.
- No runtime readiness claim.
- No production readiness claim.
- No priority1 resolution.

## Known Limitations

- v1.3.0 harness authority coherence is repaired locally as a candidate state. Remote merge remains pending because GitHub Actions are paused by owner quota-control.
- Actual rendering remains blocked by null adapter and missing approved runtime/model evidence.
- Motion dataset work remains planning-only.
- Remote CI was not run for this local documentation bootstrap due GitHub Actions quota-control rule.
