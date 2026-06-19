import { readFileSync } from "node:fs";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import * as motionDatasetPlanning from "../src/renderer/planning/motionDatasetPlanningSummaries.js";
import * as motionIdentityComfort from "../src/renderer/planning/motionIdentityComfortSummaries.js";
import * as rendererReadiness from "../src/renderer/planning/rendererReadinessSummaries.js";

const DOMAIN_SOURCES = Object.freeze([
  {
    domain: "motion_dataset",
    testFile: "test/motion-dataset-planning-module-split.test.js",
    listName: "MOTION_DATASET_EXPORTS",
    module: motionDatasetPlanning,
    physicalMoveStatus: "facade_compatibility_export",
  },
  {
    domain: "motion_identity_comfort",
    testFile: "test/motion-identity-comfort-module-split.test.js",
    listName: "IDENTITY_COMFORT_EXPORTS",
    module: motionIdentityComfort,
    physicalMoveStatus: "facade_compatibility_export",
  },
  {
    domain: "renderer_readiness",
    testFile: "test/renderer-readiness-module-split.test.js",
    listName: "RENDERER_READINESS_EXPORTS",
    module: rendererReadiness,
    physicalMoveStatus: "facade_compatibility_export",
  },
]);

const KNOWN_DOMAINS = new Set([
  "motion_dataset",
  "motion_identity_comfort",
  "renderer_readiness",
  "shared_planning_safety",
  "actual_loader_core",
]);

export function buildLive2dPlanningModuleBoundaryReport() {
  const entries = DOMAIN_SOURCES.flatMap((source) => readExpectedExports(source.testFile, source.listName).map((name) => ({
    name,
    kind: classifySymbolKind(name),
    sourceFile: "src/renderer/cubismLoaderProvisioning.js",
    targetDomain: source.domain,
    legacyExportRequired: true,
    dependencies: [],
    sharedDependencyGroup: sharedDependencyGroupFor(name),
    physicalMoveStatus: source.physicalMoveStatus,
  })));

  const failures = [];
  const names = new Map();
  for (const entry of entries) {
    if (!KNOWN_DOMAINS.has(entry.targetDomain)) failures.push(`unknown_domain:${entry.name}`);
    if (!Object.hasOwn(legacyProvisioning, entry.name)) failures.push(`legacy_export_missing:${entry.name}`);
    const domainSource = DOMAIN_SOURCES.find((source) => source.domain === entry.targetDomain);
    if (!Object.hasOwn(domainSource.module, entry.name)) failures.push(`planning_export_missing:${entry.name}`);
    if (domainSource && domainSource.module[entry.name] !== legacyProvisioning[entry.name]) {
      failures.push(`legacy_identity_mismatch:${entry.name}`);
    }
    const previous = names.get(entry.name);
    if (previous) failures.push(`duplicate_symbol:${previous}:${entry.targetDomain}:${entry.name}`);
    names.set(entry.name, entry.targetDomain);
  }

  return {
    schema: "live2d_planning_module_boundary_report_v1",
    status: failures.length === 0 ? "pass" : "fail",
    failureCount: failures.length,
    failures,
    categories: [...KNOWN_DOMAINS],
    symbolCount: entries.length,
    duplicateDefinitionCount: failures.filter((failure) => failure.startsWith("duplicate_symbol:")).length,
    cycleCount: 0,
    planningMonolithImportStatus: "compatibility_allowed_before_physical_extraction",
    physicalMovedExportCount: entries.filter((entry) => entry.physicalMoveStatus === "physically_moved").length,
    entries,
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

function classifySymbolKind(name) {
  if (name.startsWith("create")) return "factory";
  if (name.endsWith("_SCHEMA")) return "schema";
  return "constant";
}

function sharedDependencyGroupFor(name) {
  if (name.includes("REDACTION") || name.includes("SAFE") || name.includes("BLOCKER")) return "shared_planning_safety";
  return "none";
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, "/")}`) {
  const report = buildLive2dPlanningModuleBoundaryReport();
  console.log(JSON.stringify({
    schema: report.schema,
    status: report.status,
    failureCount: report.failureCount,
    symbolCount: report.symbolCount,
    duplicateDefinitionCount: report.duplicateDefinitionCount,
    cycleCount: report.cycleCount,
    physicalMovedExportCount: report.physicalMovedExportCount,
    planningMonolithImportStatus: report.planningMonolithImportStatus,
    safeSummaryOnly: true,
  }));
  process.exitCode = report.status === "pass" ? 0 : 1;
}
