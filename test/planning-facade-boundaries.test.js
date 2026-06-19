import assert from "node:assert/strict";
import { checkLive2dPlanningFacadeBoundaries } from "../scripts/check-live2d-planning-facade-boundaries.mjs";

const result = checkLive2dPlanningFacadeBoundaries();

assert.equal(result.schema, "live2d_planning_facade_boundary_check_v1");
assert.equal(result.status, "pass");
assert.equal(result.failureCount, 0);
assert.equal(result.summaries.length, 3);
assert.deepEqual(result.failures, []);

for (const summary of result.summaries) {
  assert.equal(summary.wildcardExport, false, summary.domain);
  assert.equal(summary.duplicateExportCount, 0, summary.domain);
  assert.equal(summary.actualExportCount, summary.expectedExportCount, summary.domain);
}

console.log("planning-facade-boundaries: pass");
