import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { parseEsmPublicExportInventory } from "../scripts/live2d-esm-export-inventory.mjs";
import * as cubismLoaderProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import fixture from "./fixtures/planning/cubism-loader-provisioning-public-export-inventory-v1.json" with { type: "json" };

const source = readFileSync(fixture.sourceFile, "utf8");

function diffNames(actual, expected) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  return {
    missing: expected.filter((name) => !actualSet.has(name)),
    unexpected: actual.filter((name) => !expectedSet.has(name)),
  };
}

describe("cubismLoaderProvisioning legacy public export inventory", () => {
  it("matches the baseline public module namespace exactly", () => {
    const actualNames = Object.keys(cubismLoaderProvisioning).sort();
    assert.equal(fixture.safeSummaryOnly, true);
    assert.equal(fixture.exportCount, fixture.sortedExportNames.length);
    assert.deepEqual(diffNames(actualNames, fixture.sortedExportNames), {
      missing: [],
      unexpected: [],
    });
  });

  it("keeps source-level public export declarations aligned with the baseline", () => {
    const actualInventory = parseEsmPublicExportInventory(source);
    assert.equal(actualInventory.parseErrorCount, 0);
    assert.equal(actualInventory.defaultExportCount, 0);
    assert.equal(actualInventory.wildcardExportCount, 0);
    assert.equal(actualInventory.namespaceExportCount, 0);
    assert.deepEqual(actualInventory.duplicateExportNames, []);
    assert.deepEqual(diffNames(actualInventory.namedExportNames, fixture.sortedExportNames), {
      missing: [],
      unexpected: [],
    });
  });

  it("does not leak owner-intake helper exports beyond the baseline", () => {
    const baselineNames = new Set(fixture.sortedExportNames);
    const actualNames = Object.keys(cubismLoaderProvisioning);
    const helperNames = [
      "detectedRejectedRequestFields",
      "safeOwnerRowSubmissionFileShapeLabel",
      "safeOwnerRowSubmissionRejectedFieldLabel",
    ];

    assert.deepEqual(
      helperNames.filter((name) => !baselineNames.has(name) && actualNames.includes(name)),
      [],
    );
  });
});
