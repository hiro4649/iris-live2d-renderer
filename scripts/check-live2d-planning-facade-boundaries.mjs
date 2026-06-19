import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const FACADES = Object.freeze([
  {
    domain: "motion_dataset",
    file: "src/renderer/planning/motionDatasetPlanningSummaries.js",
    testFile: "test/motion-dataset-planning-module-split.test.js",
    listName: "MOTION_DATASET_EXPORTS",
  },
  {
    domain: "motion_identity_comfort",
    file: "src/renderer/planning/motionIdentityComfortSummaries.js",
    testFile: "test/motion-identity-comfort-module-split.test.js",
    listName: "IDENTITY_COMFORT_EXPORTS",
  },
  {
    domain: "renderer_readiness",
    file: "src/renderer/planning/rendererReadinessSummaries.js",
    testFile: "test/renderer-readiness-module-split.test.js",
    listName: "RENDERER_READINESS_EXPORTS",
  },
]);

const FORBIDDEN_IMPORT_PATTERNS = Object.freeze([
  { label: "server_import", pattern: /from\s+["'][^"']*server[^"']*["']/ },
  { label: "state_import", pattern: /from\s+["'][^"']*state[^"']*["']/ },
  { label: "public_import", pattern: /from\s+["'][^"']*public[^"']*["']/ },
]);

export function checkLive2dPlanningFacadeBoundaries() {
  const failures = [];
  const summaries = [];

  for (const facade of FACADES) {
    const source = readFileSync(facade.file, "utf8");
    const expected = readExpectedExports(facade.testFile, facade.listName);
    const actual = readFacadeExports(source);
    const duplicates = duplicateLabels(actual);

    if (/export\s+\*\s+from/.test(source)) failures.push(`${facade.domain}:wildcard_export`);
    for (const { label, pattern } of FORBIDDEN_IMPORT_PATTERNS) {
      if (pattern.test(source)) failures.push(`${facade.domain}:${label}`);
    }
    for (const name of expected) {
      if (!actual.includes(name)) failures.push(`${facade.domain}:expected_export_missing:${name}`);
    }
    for (const name of actual) {
      if (!expected.includes(name)) failures.push(`${facade.domain}:unexpected_export:${name}`);
    }
    for (const name of duplicates) failures.push(`${facade.domain}:duplicate_export:${name}`);

    summaries.push({
      domain: facade.domain,
      expectedExportCount: expected.length,
      actualExportCount: actual.length,
      wildcardExport: /export\s+\*\s+from/.test(source),
      duplicateExportCount: duplicates.length,
    });
  }

  return {
    schema: "live2d_planning_facade_boundary_check_v1",
    status: failures.length === 0 ? "pass" : "fail",
    failureCount: failures.length,
    failures,
    summaries,
    safeSummaryOnly: true,
  };
}

function readExpectedExports(file, listName) {
  const source = readFileSync(file, "utf8");
  const pattern = new RegExp(`const\\s+${listName}\\s*=\\s*Object\\.freeze\\(\\[([\\s\\S]*?)\\]\\)`);
  const match = source.match(pattern);
  if (!match) throw new Error(`missing expected export list: ${listName}`);
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
}

function readFacadeExports(source) {
  return [...source.matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["']/g)]
    .flatMap((match) => match[1]
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.split(/\s+as\s+/)[0].trim()));
}

function duplicateLabels(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates].sort();
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  const result = checkLive2dPlanningFacadeBoundaries();
  console.log(JSON.stringify(result));
  process.exitCode = result.status === "pass" ? 0 : 1;
}
