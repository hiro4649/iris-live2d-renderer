# AGENTS.md

## IRIS Live2D Renderer Working Guide

This repository contains the IRIS Live2D renderer. Use Node.js >=20. Normal work
should be small, renderer-scoped, and verified with the narrowest relevant
command.

Default commands:
- Test: `npm test`
- Local server: `npm start` only when explicitly asked.

Do not claim renderer, runtime, production, or Live2D readiness unless the owner
explicitly scopes that evidence. Done means the relevant command was run or the
reason it could not run is recorded without raw logs or secret-like output.

<!-- CODEX_QUALITY_HARNESS_BEGIN -->
CODEX_QUALITY_HARNESS_FILE v1.2.7

## Prime Directive

Ship the smallest correct change that increases product value without weakening
truth, trust, security, or maintainability.

This AGENTS.md is a compact doctrine and routing map; detailed policy lives in
docs/process.

## Active Harness

Active target harness: v1.2.7 / v127.
Read first: AGENTS.md, docs/process/CODEX_HARNESS_MANIFEST.json,
docs/process/CODEX_V127_SPEC.md, and docs/process/CODEX_ACTIVE_POLICY_INDEX.json.
README, legacy specs, and PR history are conditional reads only.

## Authority

v1.1.8 Final Decision remains final authority.
v1.1.9 P0 artifacts and operator-visible statuses remain preserved.
v1.2.0 adaptive routing, v1.2.1 calibration, v1.2.2 read-budget routing,
and v1.2.3 observed evidence/decision closure remain compatibility layers.
v1.2.4 specialist-governance fields remain compatibility layers.
v1.2.5 adds Goal Shard, Worktree Fleet, Evidence Lane, Typed Monitor Inbox, Fanout Guard, and Yield fields. v1.2.6 adds observed-state loops. v1.2.7 adds receipt-carried continuation and evidence compression inside the existing P0 artifacts.

## Target Footprint

Do not add new P0 artifacts, top-level statuses, skills, workflow behavior,
product code, package or lockfile changes, runtime code, or readiness claims
for harness rollout unless separately scoped by the owner.
Target AGENTS.md is a compact routing map. Put detailed policy in docs/process
and use profile IDs instead of repeated forbidden-scope text.

## Safety Boundary

Use safe artifacts only. Do not read raw logs. Do not use 8-session.
Do not access wallet/RPC/deploy/secrets, submit GitHub approval review,
self-approve, release, publish, BscScan verify, or claim runtime, production,
legal, or YouTube policy compliance.
Expert agents may make technical findings and one safe next action inside the
goal scope; they cannot create owner authority or widen product/runtime/package
scope. Skeptic review is abnormal-condition only. Safe session learning is
proposal-only and owner-approval-required.

## Local Task Discipline

Start from clean default branch or clean worktree. Preserve user changes.
Run v127 self-test first, then v125 as blocking compatibility, and the local
quality gate for harness rollout. For product work, use the repo-specific
commands above and keep product evidence separate from harness evidence.
<!-- CODEX_QUALITY_HARNESS_END -->
