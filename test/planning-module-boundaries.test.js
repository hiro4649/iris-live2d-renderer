import assert from "node:assert/strict";
import { buildLive2dPlanningModuleBoundaryReport } from "../scripts/check-live2d-planning-module-boundaries.mjs";

const report = buildLive2dPlanningModuleBoundaryReport();

assert.equal(report.schema, "live2d_planning_module_boundary_report_v1");
assert.equal(report.status, "pass");
assert.equal(report.failureCount, 0);
assert.equal(report.duplicateDefinitionCount, 0);
assert.equal(report.cycleCount, 0);
assert.equal(report.physicalMovedExportCount, 0);
assert.equal(report.planningMonolithImportStatus, "compatibility_allowed_before_physical_extraction");
assert.equal(report.categories.includes("motion_dataset"), true);
assert.equal(report.categories.includes("motion_identity_comfort"), true);
assert.equal(report.categories.includes("renderer_readiness"), true);
assert.equal(report.categories.includes("shared_planning_safety"), true);
assert.equal(report.categories.includes("actual_loader_core"), true);
assert.equal(report.entries.length, report.symbolCount);

for (const entry of report.entries) {
  assert.equal(entry.sourceFile, "src/renderer/cubismLoaderProvisioning.js");
  assert.equal(entry.legacyExportRequired, true);
  assert.equal(entry.physicalMoveStatus, "facade_compatibility_export");
  assert.equal(Array.isArray(entry.dependencies), true);
}

console.log("planning-module-boundaries: pass");
