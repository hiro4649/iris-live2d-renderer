# Live2D Planning Module Boundaries

Harness: v1.2.7

This document records the safe planning-module extraction boundary and the dependency-truth checker used after the first physical planning move. The machine authority is `docs/iris-live2d-renderer/LIVE2D_PLANNING_MODULE_BOUNDARIES.json`; tests may not invent symbol inventory from local constants. This is a planning manifest and source-structure checker only. It does not execute Cubism, load a model, read model files, ingest dataset rows, run parser/redaction/audit work, enable trusted loader, create owner confirmation, or claim runtime or production readiness.

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
| checker schema | live2d_planning_module_boundary_report_v3 |
| test | test/planning-module-boundaries.test.js |
| symbol inventory authority | docs/iris-live2d-renderer/LIVE2D_PLANNING_MODULE_BOUNDARIES.json |
| pre-move behavior baseline | test/fixtures/planning/motion-dataset-core-baseline-v1.json; test/fixtures/planning/motion-dataset-owner-gates-baseline-v1.json; test/fixtures/planning/motion-dataset-audit-gates-baseline-v1.json; test/fixtures/planning/motion-dataset-parser-audit-stubs-baseline-v1.json |
| physicalMovedExportCount | 63 |
| auditedSymbolCount | 63 |
| pendingSymbolCount | 94 |
| actualDependencyMismatchCount | 0 |
| duplicateDefinitionCount | 0 |
| cycleCount | 0 |
| planningMonolithImportStatus | facade_compatibility_allowed_before_queue_c1 |
| runtimeReadinessClaimed | false |
| productionReadinessClaimed | false |
| ownerConfirmationCreated | false |
| actualIngestionAllowed | false |
| trustedLoaderAllowlistEnabled | false |

## Reality Checks

The checker derives its report from actual source text under `src/renderer/cubismLoaderProvisioning.js` and `src/renderer/planning/**/*.js`.

It measures:

- actual definition file and definition count
- actual physical move status derived from source location
- actual current domain derived from the module registry
- actual dependency references in each top-level definition body
- dependency audit status (`audited` or `pending`)
- duplicate definitions
- static import/export-from graph edges
- direct and indirect module cycles
- planning-to-monolith imports
- legacy export presence
- facade export presence
- physical moved export count
- unknown manifest dependencies
- missing or stale declared dependencies for audited symbols
- forbidden cross-domain dependencies

The checker does not count import bindings, export lists, comments, strings, fixtures, or test text as definitions. Function bodies are bounded after the parameter list so default parameter object literals cannot truncate dependency scanning. Import graph scanning ignores comment-only fake imports while preserving real static import/export specifiers. Compatibility facades may temporarily re-export unmoved symbols from the monolith. Physically extracted core, safety, or shared planning modules must not import the monolith.

## Pre-Move Baseline

`test/fixtures/planning/motion-dataset-core-baseline-v1.json` freezes current behavior for:

- `createMotionDatasetRowSchemaPreflightSummary`
- `createMotionDatasetSyntheticRowFixturePackSummary`

The fixture records synthetic-only default, null, non-object, supported motion style, experimental label, unsupported style, unsafe field label, checked-row-count, execution, readiness, owner-confirmation, and trusted-loader attempts. It also records returned object key order, exact `JSON.stringify` output, constant values, ordering, and `Object.isFrozen` status.

Future physical extraction PRs must compare against this fixture. Regenerating it to hide a behavior change is not allowed.

## Extraction Rule

Physical extraction PRs must move definitions rather than copy them, keep legacy exports compatible, preserve schema and factory output parity, and keep actual loader core in the monolith until the owner SDK/model decision review is complete.

## X1A Physical Extraction Status

The motion dataset planning core extraction moved the first safe core set into planning modules:

- `src/renderer/planning/sharedMotionCatalog.js` owns the shared runtime-supported and experimental-review-only motion catalogs.
- `src/renderer/planning/motionDatasetPlanningSafety.js` owns reusable motion dataset rejected-field and safe-label helpers.
- `src/renderer/planning/motionDatasetPlanningCore.js` owns row schema preflight, synthetic fixture pack, their pure metadata constants, and the two summary factories.

The legacy `src/renderer/cubismLoaderProvisioning.js` surface re-exports moved public names for compatibility. Compatibility facades may still re-export unmoved symbols from the monolith until QUEUE-C1.

## X0R2 Dependency Truth Status

The dependency-truth repair upgrades the checker to schema v3 and classifies the 13 physically moved X1A symbols as `dependencyAuditStatus: "audited"`. Their declared dependencies now match direct manifest-symbol references found in source bodies. Unmoved symbols remain `pending`; they are tracked for inventory and source-location truth, but their dependency declarations are not promoted to audited evidence until their own physical extraction queue.

The manifest `moduleRegistry` is used only as inert planning metadata for domain classification. It does not execute non-LIVE2D scopes and does not authorize runtime readiness, production readiness, owner confirmation, actual data handling, trusted loader enablement, or priority1 resolution.

## X1B1 Owner-Gates Physical Extraction Status

The owner-gate extraction moved the metadata-only owner intake request, dry-run, quarantine, submission packet, and metadata validator stub summaries into `src/renderer/planning/motionDatasetOwnerGates.js`. The move also relocates their direct safe planning constants and request-field helpers so physically extracted planning modules do not import the monolith.

The legacy `src/renderer/cubismLoaderProvisioning.js` surface imports and re-exports those public names for compatibility. `test/fixtures/planning/motion-dataset-owner-gates-baseline-v1.json` freezes synthetic-only pre-move behavior for the five moved factories. This extraction remains non-executable: it does not accept actual row content, read files, calculate hashes, ingest rows, create owner confirmation, claim readiness, enable trusted loader, or resolve priority1.

## X1C1 Audit-Gates Physical Extraction Status

The audit-gate extraction moves the metadata-only real-row audit manifest, synthetic redaction fixture pack, evidence-link manifest labels, their safe planning constants, and their summary factories into `src/renderer/planning/motionDatasetAuditStubs.js`.

This module is an audit-stub planning boundary only. It does not execute parser, redaction scan, audit, rollback, ingestion audit event, go/no-go approval, owner confirmation, SDK/model/browser work, network work, or actual data handling.

The legacy `src/renderer/cubismLoaderProvisioning.js` surface imports and re-exports moved public names for compatibility. The planning facade continues to expose only the audit-gate names that were already part of that facade inventory, while legacy-only evidence-link helpers remain available through the legacy surface without expanding the facade. `test/fixtures/planning/motion-dataset-audit-gates-baseline-v1.json` freezes synthetic-only pre-move behavior, key order, JSON serialization, constant values, freeze status, and input non-mutation checks for the three moved factories.

## X1C2 Parser-Audit Stubs Physical Extraction Status

The parser-audit stubs extraction moves row-body parser contract planning, parser rejection fixtures, ingestion audit trail stubs, rollback plan stubs, parser dry-run envelope labels, and their safe public constants into `src/renderer/planning/motionDatasetParserAuditStubs.js`.

This module is still planning-only. It does not parse row bodies, read files, accept actual row content, create ingestion audit events, create rollback snapshots, execute dry runs, ingest data, create owner confirmation, enable trusted loader, claim runtime readiness, or claim production readiness.

The legacy `src/renderer/cubismLoaderProvisioning.js` surface imports and re-exports moved public names for compatibility. The planning facade continues to expose only parser-audit names that were already part of the facade inventory. `test/fixtures/planning/motion-dataset-parser-audit-stubs-baseline-v1.json` freezes synthetic-only pre-move behavior, key order, JSON serialization, constant values, freeze status, and input non-mutation checks for the five moved factories.
