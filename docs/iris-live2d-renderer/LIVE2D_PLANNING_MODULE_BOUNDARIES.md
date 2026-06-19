# Live2D Planning Module Boundaries

Harness: v1.2.7

This document records the safe planning-module extraction boundary before any physical definition move. It is a machine-checkable planning manifest only. It does not execute Cubism, load a model, read model files, ingest dataset rows, run parser/redaction/audit work, enable trusted loader, create owner confirmation, or claim runtime or production readiness.

## Boundary Categories

| category | current status | next extraction role |
| --- | --- | --- |
| motion_dataset | facade compatibility exports | split into core, owner gates, and audit stubs |
| motion_identity_comfort | facade compatibility exports | split into core and governance |
| renderer_readiness | facade compatibility exports | split into core and owner/no-go governance |
| shared_planning_safety | referenced labels only | keep non-authorizing safety constants shared |
| actual_loader_core | remains in monolith | do not move before owner SDK/model decision |

## Current Machine Check

| field | value |
| --- | --- |
| checker | scripts/check-live2d-planning-module-boundaries.mjs |
| test | test/planning-module-boundaries.test.js |
| physicalMovedExportCount | 0 |
| duplicateDefinitionCount | 0 |
| cycleCount | 0 |
| planningMonolithImportStatus | compatibility_allowed_before_physical_extraction |
| runtimeReadinessClaimed | false |
| productionReadinessClaimed | false |
| ownerConfirmationCreated | false |
| actualIngestionAllowed | false |
| trustedLoaderAllowlistEnabled | false |

## Extraction Rule

Future physical extraction PRs must move definitions rather than copy them, keep legacy exports compatible, preserve schema and factory output parity, and keep actual loader core in the monolith until the owner SDK/model decision review is complete.
