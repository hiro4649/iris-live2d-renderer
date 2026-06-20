# Live2D Planning Module Boundaries

Harness: v1.2.7

This document records the safe planning-module extraction boundary and the dependency-truth checker used after the first physical planning move. The machine authority is `docs/iris-live2d-renderer/LIVE2D_PLANNING_MODULE_BOUNDARIES.json`; tests may not invent symbol inventory from local constants. This is a planning manifest and source-structure checker only. It does not execute Cubism, load a model, read model files, ingest dataset rows, run parser/redaction/audit work, enable trusted loader, create owner confirmation, or claim runtime or production readiness.

## Boundary Categories

| category | current status | next extraction role |
| --- | --- | --- |
| motion_dataset | facade compatibility exports | split into core, owner gates, and audit stubs |
| motion_identity_comfort | facade compatibility exports | split into core and governance |
| renderer_readiness | facade compatibility exports | split into core and owner/no-go governance |
| shared_planning_safety | referenced labels and fail-closed helpers only | keep non-authorizing safety constants and planning-only summary factories shared |
| actual_loader_core | remains in monolith | do not move before owner SDK/model decision |

## Current Machine Check

| field | value |
| --- | --- |
| checker | scripts/check-live2d-planning-module-boundaries.mjs |
| checker schema | live2d_planning_module_boundary_report_v3 |
| test | test/planning-module-boundaries.test.js |
| symbol inventory authority | docs/iris-live2d-renderer/LIVE2D_PLANNING_MODULE_BOUNDARIES.json |
| pre-move behavior baseline | test/fixtures/planning/motion-dataset-core-baseline-v1.json; test/fixtures/planning/motion-dataset-owner-gates-baseline-v1.json; test/fixtures/planning/motion-dataset-audit-gates-baseline-v1.json; test/fixtures/planning/motion-dataset-parser-audit-stubs-baseline-v1.json; test/fixtures/planning/motion-dataset-owner-handoff-gates-baseline-v1.json; test/fixtures/planning/motion-dataset-owner-nogo-gates-baseline-v1.json; test/fixtures/planning/motion-dataset-actual-data-preauth-gates-baseline-v1.json; test/fixtures/planning/motion-dataset-checksum-preflight-baseline-v1.json |
| physicalMovedExportCount | 134 |
| auditedSymbolCount | 134 |
| pendingSymbolCount | 83 |
| unregisteredExtractedLegacyPublicSymbolCount | 0 |
| manifestedButNotLegacyPublicCount | 0 |
| facadeManifestMismatchCount | 0 |
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

## X0R3 Public Symbol Coverage Status

The public symbol coverage repair extends the boundary checker beyond manifest-listed symbols. It compares the current legacy public export inventory, current planning facade inventories, and actual top-level definition ownership across `src/renderer/cubismLoaderProvisioning.js` and `src/renderer/planning/**/*.js`.

The checker now fails if a legacy public symbol has been physically extracted to a planning module but is missing from the manifest, if a manifested physically moved legacy public symbol is no longer present in the legacy public inventory, or if a current facade public symbol is missing from the manifest or points at the wrong facade file. Internal planning-module helpers may remain exported for module-to-module use without becoming legacy public symbols or facade symbols.

X0R3 registers the nine owner-gate constants that were already physically extracted and legacy-public but not yet represented in the machine manifest. They remain legacy-only planning constants and do not expand the planning facade. This repair changes boundary authority only; it does not change factory output, public export inventory, runtime readiness, production readiness, actual data handling, owner confirmation, trusted loader state, or priority1 status.

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

## X1B2A Owner-Handoff Gates Physical Extraction Status

The owner-handoff gates extraction moves metadata-only owner handoff packet planning, owner row-data submission receipt stubs, rejection fixture pack labels, their safe planning constants, and their summary factories into `src/renderer/planning/motionDatasetOwnerHandoffGates.js`.

This module remains a planning-only owner handoff boundary. It does not receive owner submissions, read row bodies, accept actual file paths, read actual file content, calculate hashes, run parser/redaction/audit work, create owner confirmation, enable trusted loader, claim runtime readiness, claim production readiness, resolve priority1, or make the motion dataset executable.

The legacy `src/renderer/cubismLoaderProvisioning.js` surface imports and re-exports moved public names for compatibility. The planning facade directly exposes only the three schema names that were already part of the facade inventory. The moved factories and their related review/rejection/receipt constants remain legacy-only and do not expand the facade. `test/fixtures/planning/motion-dataset-owner-handoff-gates-baseline-v1.json` freezes synthetic-only pre-move behavior, key order, JSON serialization, constant values, freeze status, and input non-mutation checks for the three moved factories.

## X1B2B Owner No-Go Gates Physical Extraction Status

X1B2B physically extracts the owner no-go / fail-closed planning closure into `src/renderer/planning/motionDatasetOwnerNoGoGates.js`. The moved closure contains 22 legacy public symbols: five schemas, twelve planning constants, and five factory summaries for go/no-go blocker mapping, pre-ingestion review, final dry-run checklist, missing-data fail-closed gating, and actual-data task entry gating.

The extraction keeps legacy compatibility through `src/renderer/cubismLoaderProvisioning.js` re-exports and keeps the planning facade limited to its existing eight public no-go symbols. Legacy-only helper constants and factories remain outside the facade. The new module does not import the monolith, does not execute parser/redaction/audit/runtime work, does not read actual files or row bodies, does not calculate hashes, does not create owner confirmation, does not enable trusted loader state, and preserves priority1 BLOCKED with checked_row_count 0 and motion dataset non-executable.

## X1B2C1 Actual-Data Preauth Gates Physical Extraction Status

X1B2C1 physically extracts the actual-data preauthorization planning closure into `src/renderer/planning/motionDatasetActualDataPreauthGates.js`. The moved closure contains 20 legacy public symbols: five schemas, ten planning constants, and five factory summaries for real-row acceptance criteria, owner actual-data task handoff review, no-go projection, owner submission readiness, and final actual-data preauthorization blocker gating.

The extraction keeps legacy compatibility through `src/renderer/cubismLoaderProvisioning.js` re-exports and intentionally does not expand `src/renderer/planning/motionDatasetPlanningSummaries.js`. These symbols remain legacy-only public compatibility names until a later facade decision. `test/fixtures/planning/motion-dataset-actual-data-preauth-gates-baseline-v1.json` freezes synthetic-only behavior with test-only parity fingerprints for object shape, key order, JSON length, JSON SHA-256, selected safety projection, constant values, freeze status, and input non-mutation. The test-only fingerprint is not product source-hash verification and does not read actual files.

This module is still planning-only. It does not preauthorize actual data, start an actual data task, accept actual data, ingest rows, read row bodies, read actual files, calculate product hashes, run parser/redaction/audit work, create or confirm owner confirmation, claim runtime readiness, claim production readiness, enable trusted loader state, resolve priority1, or make the motion dataset executable. Fixed safety truth remains priority1 BLOCKED, checked_row_count 0, actual_ingestion_allowed false, go_nogo_status no_go, and motion dataset non-executable.

## X1B2C2 Checksum Preflight Physical Extraction Status

X1B2C2 physically extracts the row-file checksum preflight planning closure into `src/renderer/planning/motionDatasetChecksumPreflight.js`. The moved closure contains six legacy public symbols: the checksum preflight schema, four metadata-only label catalogs, and the checksum preflight manifest summary factory.

The extraction keeps legacy compatibility through `src/renderer/cubismLoaderProvisioning.js` re-exports and intentionally does not expand `src/renderer/planning/motionDatasetPlanningSummaries.js`. These symbols remain legacy-only public compatibility names until a later facade decision. `test/fixtures/planning/motion-dataset-checksum-preflight-baseline-v1.json` freezes synthetic-only behavior with test-only parity fingerprints for object shape, key order, JSON length, JSON SHA-256, selected safety projection, constant values, freeze status, and input non-mutation. The test-only fingerprint is not product source-hash verification and does not read actual files.

This module is still planning-only. It does not read actual files, accept actual file paths, accept actual file content, calculate product hashes, verify `source_hash_label`, check `declared_row_count_label`, ingest rows, run parser/redaction/audit work, create or confirm owner confirmation, claim runtime readiness, claim production readiness, enable trusted loader state, resolve priority1, or make the motion dataset executable. Fixed safety truth remains priority1 BLOCKED, checked_row_count 0, actual_ingestion_allowed false, source hash unverified, declared row count unchecked, and motion dataset non-executable.

## XS1 Shared Fail-Closed Summary Factory Status

XS1 moves the reusable planning-only fail-closed summary helper into `src/renderer/planning/sharedFailClosedSummaryFactory.js`. The shared helper is not a legacy public export and does not expand any planning facade. It exists only to keep planning summaries consistent while preserving fail-closed fields for owner confirmation, actual data, parser/redaction/audit execution, runtime readiness, production readiness, priority1, checked row count, and motion execution.

The helper remains non-authorizing shared planning infrastructure. It does not create owner confirmation, preauthorize actual data, read files, calculate hashes, ingest rows, run parser/redaction/audit work, enable trusted loader state, claim readiness, resolve priority1, or make the motion dataset executable.

## XS1R Shared Fail-Closed Summary Factory Hardening Status

XS1R hardens `src/renderer/planning/sharedFailClosedSummaryFactory.js` so caller-supplied static configuration cannot promote fixed fail-closed state. The helper now reapplies locked safety truth after caller `boundaries`, `flags`, and `arrays` are expanded, while preserving existing key order and JSON serialization for current call sites.

`test/fixtures/planning/shared-fail-closed-callsite-baseline-v1.json` and `test/shared-fail-closed-callsite-parity.test.js` freeze synthetic-only call-site output parity for the current fail-closed planning factory inventory. The recorded SHA-256 values are test-only object fingerprints; they are not product source-hash verification and do not read actual files.

XS1R also removes the unused `sharedFailClosedSummaryFactory.js` import from the checksum preflight module. This keeps the checksum dependency graph narrow without changing checksum output, legacy public exports, planning facade inventory, manifest symbol counts, runtime readiness, production readiness, actual data handling, owner confirmation, trusted loader state, priority1 status, checked row count, or motion dataset executability.

## XS1R2 Shared Fail-Closed Config Contract Repair Status

XS1R2 hardens the shared fail-closed helper config contract before any computed status-key assignment or summary construction occurs. `createMotionDatasetPlanningOnlyGateSummary` now validates its static config as a plain data object, rejects unknown top-level keys, accessors, symbol keys, custom prototypes, prototype-pollution keys, invalid status keys, invalid blocked reasons, and invalid required string fields with fixed safe `TypeError` reason codes only.

Promotion attempts inside otherwise valid `boundaries`, `flags`, or `arrays` configs still return a planning-only summary, add safe rejection reasons, and relock fixed fail-closed state without mutating config input or changing existing call-site output. The XS1R call-site baseline fixture remains authoritative and was not regenerated for this repair.

This contract repair does not change legacy public exports, planning facade exports, manifest symbol ownership, package files, workflows, runtime readiness, production readiness, actual data handling, owner confirmation, trusted loader state, priority1 status, checked row count, or motion dataset executability.

## X1B2C3A Owner-Confirmation Wait Gates Physical Extraction Status

X1B2C3A physically extracts the owner-confirmation wait planning closure into `src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js`. The moved closure contains 12 legacy public symbols: three schemas, six planning constants, and three factory summaries for owner confirmation preflight, owner wait-state packet, and planning completion review packet surfaces.

The extraction keeps legacy compatibility through `src/renderer/cubismLoaderProvisioning.js` re-exports and keeps `src/renderer/planning/motionDatasetPlanningSummaries.js` limited to the four symbols that were already part of that facade inventory. Owner-confirmation preflight constants and factory names remain legacy-only public compatibility names and do not expand the facade. `test/fixtures/planning/motion-dataset-owner-confirmation-wait-gates-baseline-v1.json` freezes synthetic-only behavior with test-only parity fingerprints for object shape, key order, JSON length, JSON SHA-256, selected safety projection, constant values, freeze status, and input non-mutation. The test-only fingerprint is not product source-hash verification and does not read actual files.

This module is still planning-only. It does not create or confirm owner confirmation, preauthorize actual data, start an actual data task, accept actual data, ingest rows, read row bodies, read actual files, calculate product hashes, run parser/redaction/audit work, claim runtime readiness, claim production readiness, enable trusted loader state, resolve priority1, or make the motion dataset executable. Fixed safety truth remains priority1 BLOCKED, checked_row_count 0, actual_ingestion_allowed false, go_nogo_status no_go, and motion dataset non-executable.
