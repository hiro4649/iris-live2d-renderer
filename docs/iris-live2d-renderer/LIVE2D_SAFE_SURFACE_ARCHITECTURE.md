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
- `src/renderer/motionIdentityComfortSurfaceRegistry.js` lists representative
  motion identity/comfort safe surfaces.
- registry entries point at existing factories instead of moving factory logic.
- unknown registry entries are rejected as safe labels only.
- authorizing, readiness, owner, and actual data effects remain false or none.

This pack does not claim runtime readiness, does not claim production readiness,
does not create owner confirmation, does not enable the trusted loader, does not
resolve priority1, does not change checked row count, and does not make the
motion dataset executable.
