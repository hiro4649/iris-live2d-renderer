import { readFileSync } from "node:fs";
import { dirname, normalize, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_MANIFEST_FILE = "docs/iris-live2d-renderer/LIVE2D_PLANNING_MODULE_BOUNDARIES.json";
const DEFAULT_SOURCE_FILES = Object.freeze([
  "src/renderer/cubismLoaderProvisioning.js",
  "src/renderer/planning/motionDatasetPlanningSummaries.js",
  "src/renderer/planning/motionIdentityComfortSummaries.js",
  "src/renderer/planning/rendererReadinessSummaries.js",
]);

const PHYSICAL_STATUS = new Set(["not_moved", "facade_compatibility_export", "physically_moved"]);
const PLANNING_DOMAINS = new Set(["motion_dataset", "motion_identity_comfort", "renderer_readiness", "shared_planning_safety"]);

export function buildLive2dPlanningModuleBoundaryReport(options = {}) {
  const manifest = options.manifest ?? readJson(DEFAULT_MANIFEST_FILE);
  const sourceTexts = options.sourceTexts ?? readDefaultSourceTexts(manifest);
  return analyzeLive2dPlanningModuleBoundaries({ manifest, sourceTexts });
}

export function analyzeLive2dPlanningModuleBoundaries({ manifest, sourceTexts }) {
  const symbols = Array.isArray(manifest.symbols) ? manifest.symbols : [];
  const manifestNames = new Set(symbols.map((symbol) => symbol.name));
  const sourceFiles = [...new Set([...Object.keys(sourceTexts), ...DEFAULT_SOURCE_FILES])].filter((file) => sourceTexts[file] !== undefined);
  const sourceRecords = Object.fromEntries(sourceFiles.map((file) => [file, analyzeSourceFile(file, sourceTexts[file])]));
  const moduleGraph = buildModuleGraph(sourceRecords);
  const cycles = findCycles(moduleGraph);
  const failures = [];

  const definitionsByName = new Map();
  for (const [file, record] of Object.entries(sourceRecords)) {
    for (const definition of record.definitions) {
      if (!definitionsByName.has(definition.name)) definitionsByName.set(definition.name, []);
      definitionsByName.get(definition.name).push({ file, kind: definition.kind, exported: definition.exported });
    }
  }

  const entries = symbols.map((symbol) => {
    const definitions = definitionsByName.get(symbol.name) ?? [];
    const actualDefinitionFiles = [...new Set(definitions.map((definition) => definition.file))];
    const actualDefinitionFile = actualDefinitionFiles.length === 1 ? actualDefinitionFiles[0] : null;
    const definitionCount = definitions.length;
    const duplicateDefinitionCount = Math.max(0, definitionCount - 1);
    const facadeRecord = sourceRecords[symbol.facadeFile];
    const definitionRecord = actualDefinitionFile ? sourceRecords[actualDefinitionFile] : null;
    const legacyRecord = sourceRecords["src/renderer/cubismLoaderProvisioning.js"];
    const legacyExportPresent = symbol.legacyExportRequired === false || Boolean(legacyRecord?.exports.has(symbol.name));
    const facadeExportPresent = Boolean(facadeRecord?.exports.has(symbol.name));
    const unknownDependencies = symbol.dependencies.filter((dependency) => !manifestNames.has(dependency));
    const crossDomainDependencyViolations = crossDomainViolations(symbol, symbols);
    const bodyDependencyReferences = definitionRecord ? referencedManifestSymbols(definitionRecord.bodies.get(symbol.name) ?? "", manifestNames, symbol.name) : [];
    const physicalMoved = symbol.physicalMoveStatus === "physically_moved" && actualDefinitionFile !== "src/renderer/cubismLoaderProvisioning.js";
    const incorrectPhysicalMoveStatus = symbol.physicalMoveStatus === "physically_moved"
      ? !physicalMoved
      : physicalMoved;

    if (!PHYSICAL_STATUS.has(symbol.physicalMoveStatus)) failures.push(`invalid_physicalMoveStatus:${symbol.name}`);
    if (definitionCount === 0) failures.push(`missing_definition:${symbol.name}`);
    if (duplicateDefinitionCount > 0) failures.push(`duplicate_definition:${symbol.name}`);
    if (actualDefinitionFile && actualDefinitionFile !== symbol.definitionFile) failures.push(`definition_file_mismatch:${symbol.name}:${actualDefinitionFile}`);
    if (!legacyExportPresent) failures.push(`legacy_export_missing:${symbol.name}`);
    if (!facadeExportPresent) failures.push(`facade_export_missing:${symbol.name}`);
    if (unknownDependencies.length) failures.push(`unknown_dependency:${symbol.name}:${unknownDependencies.join(",")}`);
    if (crossDomainDependencyViolations.length) failures.push(`forbidden_cross_domain_dependency:${symbol.name}:${crossDomainDependencyViolations.join(",")}`);
    if (incorrectPhysicalMoveStatus) failures.push(`incorrect_physicalMoveStatus:${symbol.name}`);

    return {
      ...symbol,
      actualDefinitionFile,
      definitionCount,
      duplicateDefinitionCount,
      legacyExportPresent,
      facadeExportPresent,
      unknownDependencies,
      bodyDependencyReferences,
      crossDomainDependencyViolations,
    };
  });

  for (const cycle of cycles) failures.push(`module_cycle:${cycle.join("->")}`);

  const planningToMonolithImports = [...new Set(Object.values(sourceRecords).flatMap((record) => (
    record.file.startsWith("src/renderer/planning/")
      ? record.edges.filter((edge) => edge === "src/renderer/cubismLoaderProvisioning.js").map(() => record.file)
      : []
  )))];

  const forbiddenMonolithImports = [...new Set(Object.values(sourceRecords).flatMap((record) => (
    record.file.startsWith("src/renderer/planning/")
      && !record.file.endsWith("Summaries.js")
      && record.edges.includes("src/renderer/cubismLoaderProvisioning.js")
      ? [record.file]
      : []
  )))];
  for (const file of forbiddenMonolithImports) failures.push(`planning_core_imports_monolith:${file}`);

  const duplicateDefinitionCount = entries.reduce((count, entry) => count + entry.duplicateDefinitionCount, 0);
  const physicalMovedExportCount = entries.filter((entry) => (
    entry.physicalMoveStatus === "physically_moved"
    && entry.actualDefinitionFile
    && entry.actualDefinitionFile !== "src/renderer/cubismLoaderProvisioning.js"
  )).length;

  return {
    schema: "live2d_planning_module_boundary_report_v2",
    status: failures.length === 0 ? "pass" : "fail",
    failureCount: failures.length,
    failures,
    manifestFile: DEFAULT_MANIFEST_FILE,
    symbolCount: entries.length,
    duplicateDefinitionCount,
    cycleCount: cycles.length,
    cycles,
    planningToMonolithImportCount: planningToMonolithImports.length,
    planningToMonolithImports,
    planningMonolithImportStatus: planningToMonolithImports.length === 0 ? "zero" : "facade_compatibility_allowed_before_queue_c1",
    physicallyExtractedModulesImportingMonolithCount: forbiddenMonolithImports.length,
    physicalMovedExportCount,
    unknownDependencyCount: entries.reduce((count, entry) => count + entry.unknownDependencies.length, 0),
    crossDomainDependencyViolationCount: entries.reduce((count, entry) => count + entry.crossDomainDependencyViolations.length, 0),
    entries,
    safeSummaryOnly: true,
  };
}

function readJson(file) {
  return JSON.parse(readFileSync(resolve(REPO_ROOT, file), "utf8"));
}

function readDefaultSourceTexts(manifest) {
  const files = new Set(DEFAULT_SOURCE_FILES);
  for (const symbol of manifest.symbols ?? []) {
    files.add(symbol.definitionFile);
    files.add(symbol.facadeFile);
  }
  return Object.fromEntries([...files].map((file) => [file, readFileSync(resolve(REPO_ROOT, file), "utf8")]));
}

function analyzeSourceFile(file, source) {
  const stripped = stripCommentsAndStrings(source);
  const definitions = [];
  const bodies = new Map();
  const declarationPattern = /\b(export\s+)?(const|function|class)\s+([A-Za-z_$][\w$]*)/g;
  for (const match of stripped.matchAll(declarationPattern)) {
    definitions.push({ name: match[3], kind: match[2], exported: Boolean(match[1]) });
    bodies.set(match[3], declarationBody(stripped, match.index));
  }
  return {
    file,
    definitions,
    bodies,
    exports: exportedNames(stripped),
    edges: staticModuleEdges(file, source),
  };
}

function stripCommentsAndStrings(source) {
  let output = "";
  let i = 0;
  while (i < source.length) {
    const char = source[i];
    const next = source[i + 1];
    if (char === "/" && next === "/") {
      while (i < source.length && source[i] !== "\n") {
        output += " ";
        i += 1;
      }
      continue;
    }
    if (char === "/" && next === "*") {
      output += "  ";
      i += 2;
      while (i < source.length && !(source[i] === "*" && source[i + 1] === "/")) {
        output += source[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      output += "  ";
      i += 2;
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      const quote = char;
      output += " ";
      i += 1;
      while (i < source.length) {
        if (source[i] === "\\") {
          output += "  ";
          i += 2;
          continue;
        }
        if (source[i] === quote) {
          output += " ";
          i += 1;
          break;
        }
        output += source[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      continue;
    }
    output += char;
    i += 1;
  }
  return output;
}

function declarationBody(stripped, startIndex) {
  const nextDeclaration = stripped.slice(startIndex + 1).search(/\b(?:export\s+)?(?:const|function|class)\s+[A-Za-z_$][\w$]*/);
  return nextDeclaration === -1 ? stripped.slice(startIndex) : stripped.slice(startIndex, startIndex + 1 + nextDeclaration);
}

function exportedNames(stripped) {
  const names = new Set();
  for (const match of stripped.matchAll(/\bexport\s+(?:const|function|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(match[1]);
  for (const match of stripped.matchAll(/\bexport\s*\{([\s\S]*?)\}\s*(?:from\s*["'][^"']+["'])?/g)) {
    for (const rawName of match[1].split(",")) {
      const name = rawName.trim().split(/\s+as\s+/)[0]?.trim();
      if (name) names.add(name);
    }
  }
  return names;
}

function staticModuleEdges(file, stripped) {
  const edges = [];
  const edgePattern = /\b(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g;
  for (const match of stripped.matchAll(edgePattern)) {
    const resolved = resolveRelativeJs(file, match[1]);
    if (resolved) edges.push(resolved);
  }
  return [...new Set(edges)];
}

function resolveRelativeJs(fromFile, specifier) {
  if (!specifier.startsWith(".")) return null;
  const base = posix.dirname(toPosix(fromFile));
  const candidate = posix.normalize(posix.join(base, specifier));
  return candidate.endsWith(".js") ? candidate : `${candidate}.js`;
}

function buildModuleGraph(sourceRecords) {
  const files = new Set(Object.keys(sourceRecords));
  return Object.fromEntries(Object.entries(sourceRecords).map(([file, record]) => [
    file,
    record.edges.filter((edge) => files.has(edge)),
  ]));
}

function findCycles(graph) {
  const cycles = [];
  const visiting = new Set();
  const visited = new Set();
  const stack = [];

  function visit(file) {
    if (visiting.has(file)) {
      cycles.push(stack.slice(stack.indexOf(file)).concat(file));
      return;
    }
    if (visited.has(file)) return;
    visiting.add(file);
    stack.push(file);
    for (const edge of graph[file] ?? []) visit(edge);
    stack.pop();
    visiting.delete(file);
    visited.add(file);
  }

  for (const file of Object.keys(graph)) visit(file);
  return cycles;
}

function referencedManifestSymbols(body, manifestNames, ownName) {
  return [...manifestNames].filter((name) => name !== ownName && new RegExp(`\\b${escapeRegExp(name)}\\b`).test(body)).sort();
}

function crossDomainViolations(symbol, symbols) {
  const byName = new Map(symbols.map((entry) => [entry.name, entry]));
  return symbol.dependencies.filter((dependencyName) => {
    const dependency = byName.get(dependencyName);
    if (!dependency || dependency.targetDomain === symbol.targetDomain) return false;
    return !(dependency.targetDomain === "shared_planning_safety" && dependency.sharedDependencyGroup !== "none");
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toPosix(file) {
  return normalize(file).replace(/\\/g, "/");
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : null;
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  const report = buildLive2dPlanningModuleBoundaryReport();
  console.log(JSON.stringify({
    schema: report.schema,
    status: report.status,
    failureCount: report.failureCount,
    symbolCount: report.symbolCount,
    duplicateDefinitionCount: report.duplicateDefinitionCount,
    cycleCount: report.cycleCount,
    planningToMonolithImportCount: report.planningToMonolithImportCount,
    physicallyExtractedModulesImportingMonolithCount: report.physicallyExtractedModulesImportingMonolithCount,
    physicalMovedExportCount: report.physicalMovedExportCount,
    unknownDependencyCount: report.unknownDependencyCount,
    crossDomainDependencyViolationCount: report.crossDomainDependencyViolationCount,
    safeSummaryOnly: true,
  }));
  process.exitCode = report.status === "pass" ? 0 : 1;
}
