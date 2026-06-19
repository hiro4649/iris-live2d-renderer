import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  analyzeLive2dPlanningModuleBoundaries,
  buildLive2dPlanningModuleBoundaryReport,
} from "../scripts/check-live2d-planning-module-boundaries.mjs";
import * as live2d from "../src/renderer/cubismLoaderProvisioning.js";

const report = buildLive2dPlanningModuleBoundaryReport();
const baseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-core-baseline-v1.json", "utf8"));
const ownerGatesBaseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-owner-gates-baseline-v1.json", "utf8"));

assert.equal(report.schema, "live2d_planning_module_boundary_report_v3");
assert.equal(report.status, "pass");
assert.equal(report.failureCount, 0);
assert.equal(report.duplicateDefinitionCount, 0);
assert.equal(report.cycleCount, 0);
assert.equal(report.physicalMovedExportCount, 29);
assert.equal(report.scannedPlanningFileCount, 7);
assert.equal(report.unregisteredPlanningModuleCount, 0);
assert.equal(report.planningMonolithImportStatus, "facade_compatibility_allowed_before_queue_c1");
assert.equal(report.physicallyExtractedModulesImportingMonolithCount, 0);
assert.equal(report.unknownDependencyCount, 0);
assert.equal(report.missingDeclaredDependencyCount, 0);
assert.equal(report.staleDeclaredDependencyCount, 0);
assert.equal(report.actualDependencyMismatchCount, 0);
assert.equal(report.crossDomainDependencyViolationCount, 0);
assert.equal(report.kindMismatchCount, 0);
assert.equal(report.currentDomainMismatchCount, 0);
assert.equal(report.actualPhysicalMoveMismatchCount, 0);
assert.equal(report.auditedSymbolCount, 29);
assert.equal(report.pendingSymbolCount, report.symbolCount - 29);
assert.equal(report.entries.length, report.symbolCount);

const movedSymbols = new Map([
  ["LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES", "src/renderer/planning/sharedMotionCatalog.js"],
  ["LIVE2D_EXPERIMENTAL_MOTION_LABELS", "src/renderer/planning/sharedMotionCatalog.js"],
  ["LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS", "src/renderer/planning/motionDatasetPlanningSafety.js"],
  ["LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_UX_AUDIT_AXES", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["createMotionDatasetRowSchemaPreflightSummary", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["createMotionDatasetSyntheticRowFixturePackSummary", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetRealRowIntakeRequestPacketSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetRealRowIntakeDryRunValidatorSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetOwnerRowDataSubmissionPacketSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetOwnerRowDataMetadataValidatorStubSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
]);

for (const entry of report.entries) {
  assert.equal(entry.actualDefinitionFile, movedSymbols.get(entry.name) ?? "src/renderer/cubismLoaderProvisioning.js");
  assert.equal(entry.definitionCount, 1);
  assert.equal(entry.duplicateDefinitionCount, 0);
  assert.equal(entry.legacyExportRequired, true);
  assert.equal(entry.legacyExportPresent, true);
  assert.equal(entry.facadeExportPresent, true);
  assert.equal(entry.physicalMoveStatus, movedSymbols.has(entry.name) ? "physically_moved" : "not_moved");
  assert.equal(entry.actualPhysicalMoveStatus, movedSymbols.has(entry.name) ? "physically_moved" : "not_moved");
  assert.equal(entry.dependencyAuditStatus, movedSymbols.has(entry.name) ? "audited" : "pending");
  assert.equal(Array.isArray(entry.dependencies), true);
}

assert.deepEqual(
  report.entries.find((entry) => entry.name === "createMotionDatasetRowSchemaPreflightSummary").actualManifestDependencies,
  [
    "LIVE2D_EXPERIMENTAL_MOTION_LABELS",
    "LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS",
    "LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA",
    "LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS",
    "LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA",
    "LIVE2D_MOTION_DATASET_UX_AUDIT_AXES",
    "LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES",
  ],
);

assert.equal(baseline.schema, "live2d_motion_dataset_core_baseline_v1");
assert.equal(baseline.safety.syntheticInputsOnly, true);
assert.equal(baseline.safety.actualDataRead, false);
assert.equal(baseline.safety.runtimeReadinessClaimed, false);
assert.equal(baseline.safety.productionReadinessClaimed, false);
assert.equal(
  baseline.factories.createMotionDatasetRowSchemaPreflightSummary.default_input.behavior,
  "return",
);
assert.equal(
  baseline.factories.createMotionDatasetSyntheticRowFixturePackSummary.default_input.behavior,
  "return",
);
assert.deepEqual(
  baseline.factories.createMotionDatasetRowSchemaPreflightSummary.default_input.keys,
  Object.keys(baseline.factories.createMotionDatasetRowSchemaPreflightSummary.default_input.object),
);
assert.deepEqual(
  baseline.factories.createMotionDatasetSyntheticRowFixturePackSummary.default_input.keys,
  Object.keys(baseline.factories.createMotionDatasetSyntheticRowFixturePackSummary.default_input.object),
);

for (const [name, expected] of Object.entries(baseline.constants)) {
  assert.deepEqual(live2d[name], expected.value, `constant value changed: ${name}`);
  if (live2d[name] && typeof live2d[name] === "object") {
    assert.deepEqual(Object.keys(live2d[name]), expected.keys, `constant keys changed: ${name}`);
    assert.equal(JSON.stringify(live2d[name]), expected.json, `constant json changed: ${name}`);
    assert.equal(Object.isFrozen(live2d[name]), expected.objectIsFrozen, `constant freeze status changed: ${name}`);
  }
}

for (const [factoryName, cases] of Object.entries(baseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const value = caseName === "default_input"
      ? live2d[factoryName]()
      : live2d[factoryName](inputForBaselineCase(caseName));
    assert.equal(expected.behavior, "return", `baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keys, `factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value), expected.json, `factory json changed: ${factoryName}:${caseName}`);
  }
}

assert.equal(ownerGatesBaseline.schema, "live2d_motion_dataset_owner_gates_baseline_v1");
assert.equal(ownerGatesBaseline.safety.syntheticInputsOnly, true);
assert.equal(ownerGatesBaseline.safety.actualDataRead, false);
assert.equal(ownerGatesBaseline.safety.actualFileRead, false);
assert.equal(ownerGatesBaseline.safety.actualHashCalculated, false);
assert.equal(ownerGatesBaseline.safety.actualIngestionAllowed, false);
assert.equal(ownerGatesBaseline.safety.runtimeReadinessClaimed, false);
assert.equal(ownerGatesBaseline.safety.productionReadinessClaimed, false);
assert.equal(ownerGatesBaseline.safety.ownerConfirmationCreated, false);
assert.equal(ownerGatesBaseline.safety.trustedLoaderEnabled, false);
assert.equal(ownerGatesBaseline.safety.priority1Status, "BLOCKED");
assert.equal(ownerGatesBaseline.safety.checkedRowCount, 0);
assert.equal(ownerGatesBaseline.safety.motionDatasetExecutable, false);

for (const [factoryName, cases] of Object.entries(ownerGatesBaseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const value = caseName === "default_input"
      ? live2d[factoryName]()
      : live2d[factoryName](inputForOwnerGatesBaselineCase(caseName));
    assert.equal(expected.behavior, "return", `owner gate baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `owner gate factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keys, `owner gate factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value), expected.json, `owner gate factory json changed: ${factoryName}:${caseName}`);
  }
}

function inputForBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    supported_motion_style: { motion_style: "talk" },
    experimental_motion_label: { motion_style: "blink_attention" },
    unsupported_motion_style: { motion_style: "unsupported_safe_label" },
    unsafe_field_name_attempt_without_secret_values: { raw_dataset_row_body: "safe_redacted_label" },
    checked_row_count_attempt: { checked_row_count: 1 },
    execution_attempt: { motion_dataset_executable: true, execute_motion: true },
    readiness_attempt: { renderer_ready: true, runtime_readiness_claimed: true, production_readiness_claimed: true },
    owner_confirmation_attempt: { owner_confirmation_created: true, owner_confirmation_confirmed: true },
    trusted_loader_attempt: { trusted_loader_allowlist_enabled: true, loader_trusted: true },
  }[caseName];
}

function inputForOwnerGatesBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_metadata_labels_only: {
      request_id: "safe_request_label",
      dataset_name: "safe_dataset_label",
      requested_file_format: "jsonl",
      expected_row_count: 10,
      dataset_split_plan: "safe_split_label",
      source_file_label: "safe_file_label",
      source_hash: "safe_hash_label",
      audit_run_id: "safe_audit_label",
      auditor_version: "safe_auditor_label",
      owner_confirmation_required: true,
      redaction_policy_ref: "safe_redaction_label",
    },
    unsupported_format: { requested_file_format: "unsupported_safe_label" },
    unsafe_material_attempt: { raw_dataset_row_body: "safe_redacted_label" },
    file_read_attempt: { actual_file_path_value: "safe_redacted_label", file_content_read: true },
    hash_calculation_attempt: { actual_hash_calculated: true },
    submission_acceptance_attempt: { owner_submission_received: true, owner_submission_accepted: true },
    checked_row_count_attempt: { checked_row_count: 1 },
    ingestion_attempt: { actual_ingestion_allowed: true, ingest_rows: true },
    execution_attempt: { motion_dataset_executable: true, execute_motion: true },
    readiness_attempt: { renderer_ready: true, runtime_readiness_claimed: true, production_readiness_claimed: true },
    owner_confirmation_attempt: { owner_confirmation_created: true, owner_confirmation_confirmed: true },
    trusted_loader_attempt: { trusted_loader_allowlist_enabled: true, loader_trusted: true },
    priority_resolution_attempt: { priority1_status: "RESOLVED", priority1_resolved: true, go_nogo_status: "go" },
  }[caseName];
}

const baseManifest = {
  symbols: [
    {
      name: "A_SYMBOL",
      kind: "constant",
      definitionFile: "src/renderer/cubismLoaderProvisioning.js",
      currentDomain: "actual_loader_core",
      targetDomain: "motion_dataset",
      facadeFile: "src/renderer/planning/motionDatasetPlanningSummaries.js",
      legacyExportRequired: true,
      dependencies: [],
      sharedDependencyGroup: "none",
      facadeExportRequired: true,
      dependencyAuditStatus: "pending",
      physicalMoveStatus: "not_moved",
    },
  ],
};

const baseSources = {
  "src/renderer/cubismLoaderProvisioning.js": "export const A_SYMBOL = Object.freeze([]);\n",
  "src/renderer/planning/motionDatasetPlanningSummaries.js": "export { A_SYMBOL } from \"../cubismLoaderProvisioning.js\";\n",
};

function syntheticReport(mutator) {
  const manifest = structuredClone(baseManifest);
  const sourceTexts = { ...baseSources };
  mutator({ manifest, sourceTexts });
  return analyzeLive2dPlanningModuleBoundaries({ manifest, sourceTexts });
}

assert.equal(syntheticReport(() => {}).status, "pass");

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/extra.js"] = "export const A_SYMBOL = 1;\n";
  }).failures.join("\n"),
  /duplicate_definition:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "";
  }).failures.join("\n"),
  /missing_definition:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "const A_SYMBOL = Object.freeze([]);\n";
  }).failures.join("\n"),
  /legacy_export_missing:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] = "export {};\n";
  }).failures.join("\n"),
  /facade_export_missing:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].dependencies = ["UNKNOWN_SYMBOL"];
  }).failures.join("\n"),
  /unknown_dependency:A_SYMBOL:UNKNOWN_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].dependencyAuditStatus = "audited";
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "export const B_SYMBOL = 1;\nexport const A_SYMBOL = B_SYMBOL;\n";
    manifest.symbols.push({
      ...manifest.symbols[0],
      name: "B_SYMBOL",
      dependencies: [],
    });
  }).failures.join("\n"),
  /missing_declared_dependency:A_SYMBOL:B_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].dependencyAuditStatus = "audited";
    manifest.symbols.push({
      ...manifest.symbols[0],
      name: "B_SYMBOL",
      dependencies: [],
    });
    manifest.symbols[0].dependencies = ["B_SYMBOL"];
  }).failures.join("\n"),
  /stale_declared_dependency:A_SYMBOL:B_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].kind = "factory";
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "export const A_SYMBOL = Object.freeze([]);\n";
  }).failures.join("\n"),
  /kind_mismatch:A_SYMBOL:constant:factory/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].currentDomain = "motion_dataset";
  }).failures.join("\n"),
  /current_domain_mismatch:A_SYMBOL:actual_loader_core:motion_dataset/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols.push({
      ...manifest.symbols[0],
      name: "B_SYMBOL",
      targetDomain: "renderer_readiness",
      dependencies: [],
    });
    manifest.symbols[0].dependencies = ["B_SYMBOL"];
  }).failures.join("\n"),
  /forbidden_cross_domain_dependency:A_SYMBOL:B_SYMBOL/,
);

assert.equal(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].facadeExportRequired = false;
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] = "export {};\n";
  }).status,
  "pass",
);

assert.equal(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = [
      "export const A_SYMBOL = (input = {}) => {",
      "  const B_SYMBOL = input.B_SYMBOL;",
      "  return Boolean(B_SYMBOL);",
      "};",
    ].join("\n");
  }).status,
  "pass",
);

assert.equal(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = [
      "// import \"./fake-cycle.js\";",
      "export const A_SYMBOL = \"import './fake-cycle.js'\";",
    ].join("\n");
  }).cycleCount,
  0,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/core.js"] = "import { A_SYMBOL } from \"../cubismLoaderProvisioning.js\";\nexport const CORE_SYMBOL = A_SYMBOL;\n";
  }).failures.join("\n"),
  /planning_core_imports_monolith:src\/renderer\/planning\/core\.js/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/a.js"] = "import \"./b.js\";\nexport const A = 1;\n";
    sourceTexts["src/renderer/planning/b.js"] = "import \"./a.js\";\nexport const B = 1;\n";
  }).failures.join("\n"),
  /module_cycle:/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/a.js"] = "import \"./b.js\";\nexport const A = 1;\n";
    sourceTexts["src/renderer/planning/b.js"] = "import \"./c.js\";\nexport const B = 1;\n";
    sourceTexts["src/renderer/planning/c.js"] = "import \"./a.js\";\nexport const C = 1;\n";
  }).failures.join("\n"),
  /module_cycle:/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].physicalMoveStatus = "physically_moved";
  }).failures.join("\n"),
  /actual_physical_move_mismatch:A_SYMBOL:not_moved:physically_moved/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].definitionFile = "src/renderer/planning/motionDatasetPlanningCore.js";
    manifest.symbols[0].currentDomain = "motion_dataset";
    manifest.symbols[0].physicalMoveStatus = "physically_moved";
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "export { A_SYMBOL } from \"./planning/motionDatasetPlanningCore.js\";\n";
    sourceTexts["src/renderer/planning/motionDatasetPlanningCore.js"] = "export const A_SYMBOL = Object.freeze([]);\n";
  }).failures.join("\n"),
  /pending_dependency_audit_for_physical_move:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/unregistered.js"] = "export const UNREGISTERED_SYMBOL = 1;\n";
  }).failures.join("\n"),
  /unregistered_planning_module:src\/renderer\/planning\/unregistered\.js/,
);

console.log("planning-module-boundaries: pass");
