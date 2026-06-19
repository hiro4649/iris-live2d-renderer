import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  analyzeLive2dPlanningModuleBoundaries,
  buildLive2dPlanningModuleBoundaryReport,
} from "../scripts/check-live2d-planning-module-boundaries.mjs";
import * as live2d from "../src/renderer/cubismLoaderProvisioning.js";

const report = buildLive2dPlanningModuleBoundaryReport();
const baseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-core-baseline-v1.json", "utf8"));

assert.equal(report.schema, "live2d_planning_module_boundary_report_v2");
assert.equal(report.status, "pass");
assert.equal(report.failureCount, 0);
assert.equal(report.duplicateDefinitionCount, 0);
assert.equal(report.cycleCount, 0);
assert.equal(report.physicalMovedExportCount, 13);
assert.equal(report.planningMonolithImportStatus, "facade_compatibility_allowed_before_queue_c1");
assert.equal(report.physicallyExtractedModulesImportingMonolithCount, 0);
assert.equal(report.unknownDependencyCount, 0);
assert.equal(report.crossDomainDependencyViolationCount, 0);
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
]);

for (const entry of report.entries) {
  assert.equal(entry.actualDefinitionFile, movedSymbols.get(entry.name) ?? "src/renderer/cubismLoaderProvisioning.js");
  assert.equal(entry.definitionCount, 1);
  assert.equal(entry.duplicateDefinitionCount, 0);
  assert.equal(entry.legacyExportRequired, true);
  assert.equal(entry.legacyExportPresent, true);
  assert.equal(entry.facadeExportPresent, true);
  assert.equal(entry.physicalMoveStatus, movedSymbols.has(entry.name) ? "physically_moved" : "not_moved");
  assert.equal(Array.isArray(entry.dependencies), true);
}

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
  /incorrect_physicalMoveStatus:A_SYMBOL/,
);

console.log("planning-module-boundaries: pass");
