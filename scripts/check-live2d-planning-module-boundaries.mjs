import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, normalize, posix, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseEsmPublicExportInventory } from "./live2d-esm-export-inventory.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_MANIFEST_FILE = "docs/iris-live2d-renderer/LIVE2D_PLANNING_MODULE_BOUNDARIES.json";
const LEGACY_FILE = "src/renderer/cubismLoaderProvisioning.js";
const PLANNING_DIR = "src/renderer/planning";
const PHYSICAL_STATUS = new Set(["not_moved", "facade_compatibility_export", "physically_moved"]);
const KNOWN_DOMAINS = new Set(["motion_dataset", "motion_identity_comfort", "renderer_readiness", "shared_planning_safety", "actual_loader_core"]);
const DEFAULT_MODULE_REGISTRY = Object.freeze({
  "src/renderer/cubismLoaderProvisioning.js": "actual_loader_core",
  "src/renderer/planning/sharedMotionCatalog.js": "shared_planning_safety",
  "src/renderer/planning/sharedFailClosedSummaryFactory.js": "shared_planning_safety",
  "src/renderer/planning/motionDatasetPlanningSafety.js": "motion_dataset",
  "src/renderer/planning/motionDatasetPlanningCore.js": "motion_dataset",
  "src/renderer/planning/motionDatasetOwnerGates.js": "motion_dataset",
  "src/renderer/planning/motionDatasetOwnerHandoffGates.js": "motion_dataset",
  "src/renderer/planning/motionDatasetAuditStubs.js": "motion_dataset",
  "src/renderer/planning/motionDatasetActualDataPreauthGates.js": "motion_dataset",
  "src/renderer/planning/motionDatasetChecksumPreflight.js": "motion_dataset",
  "src/renderer/planning/motionDatasetFinalOwnerWaitGates.js": "motion_dataset",
  "src/renderer/planning/motionIdentityComfortCore.js": "motion_identity_comfort",
  "src/renderer/planning/motionIdentityComfortGovernance.js": "motion_identity_comfort",
  "src/renderer/planning/rendererReadinessCore.js": "renderer_readiness",
  "src/renderer/planning/rendererReadinessGovernance.js": "renderer_readiness",
});

export function buildLive2dPlanningModuleBoundaryReport(options = {}) {
  const manifest = options.manifest ?? readJson(DEFAULT_MANIFEST_FILE);
  const sourceTexts = options.sourceTexts ?? readDefaultSourceTexts(manifest);
  return analyzeLive2dPlanningModuleBoundaries({ manifest, sourceTexts });
}

export function analyzeLive2dPlanningModuleBoundaries({ manifest, sourceTexts }) {
  const symbols = Array.isArray(manifest.symbols) ? manifest.symbols : [];
  const manifestNames = new Set(symbols.map((symbol) => symbol.name));
  const registry = { ...DEFAULT_MODULE_REGISTRY, ...(manifest.moduleRegistry ?? {}) };
  const sourceFiles = [...new Set([...Object.keys(sourceTexts), LEGACY_FILE, ...discoverPlanningFilesFromTexts(sourceTexts)])]
    .filter((file) => sourceTexts[file] !== undefined);
  const sourceRecords = Object.fromEntries(sourceFiles.map((file) => [file, analyzeSourceFile(file, sourceTexts[file])]));
  const moduleGraph = buildModuleGraph(sourceRecords);
  const cycles = findCycles(moduleGraph);
  const failures = [];

  const definitionsByName = new Map();
  for (const [file, record] of Object.entries(sourceRecords)) {
    for (const definition of record.definitions) {
      if (!definitionsByName.has(definition.name)) definitionsByName.set(definition.name, []);
      definitionsByName.get(definition.name).push({ file, kind: definition.kind, semanticKind: definition.semanticKind, exported: definition.exported });
    }
  }

  const entries = symbols.map((symbol) => {
    const facadeExportRequired = symbol.facadeExportRequired !== false;
    const definitions = definitionsByName.get(symbol.name) ?? [];
    const actualDefinitionFiles = [...new Set(definitions.map((definition) => definition.file))];
    const actualDefinitionFile = actualDefinitionFiles.length === 1 ? actualDefinitionFiles[0] : null;
    const actualDefinition = definitions.length === 1 ? definitions[0] : null;
    const definitionCount = definitions.length;
    const duplicateDefinitionCount = Math.max(0, definitionCount - 1);
    const actualPhysicalMoveStatus = actualStatusForDefinitionFile(actualDefinitionFile, definitionCount);
    const actualDomain = domainForFile(actualDefinitionFile, registry);
    const definitionRecord = actualDefinitionFile ? sourceRecords[actualDefinitionFile] : null;
    const legacyRecord = sourceRecords[LEGACY_FILE];
    const facadeRecord = symbol.facadeFile ? sourceRecords[symbol.facadeFile] : null;
    const legacyExportPresent = symbol.legacyExportRequired === false || Boolean(legacyRecord?.exports.has(symbol.name));
    const facadeExportPresent = facadeExportRequired ? Boolean(facadeRecord?.exports.has(symbol.name)) : true;
    const body = definitionRecord?.bodies.get(symbol.name) ?? "";
    const actualManifestDependencies = referencedManifestSymbols(body, manifestNames, symbol.name);
    const unknownDependencies = (symbol.dependencies ?? []).filter((dependency) => !manifestNames.has(dependency));
    const missingDeclaredDependencies = actualManifestDependencies.filter((dependency) => !(symbol.dependencies ?? []).includes(dependency));
    const staleDeclaredDependencies = (symbol.dependencies ?? []).filter((dependency) => !actualManifestDependencies.includes(dependency));
    const crossDomainDependencyViolations = crossDomainViolations(symbol, symbols, moduleGraph);
    const semanticKind = actualDefinition?.semanticKind ?? null;
    const kindMismatch = Boolean(semanticKind && symbol.kind && semanticKind !== symbol.kind);
    const currentDomainMismatch = Boolean(actualDomain && symbol.currentDomain && actualDomain !== symbol.currentDomain);
    const physicalMoveMismatch = Boolean(actualPhysicalMoveStatus !== "invalid" && symbol.physicalMoveStatus !== actualPhysicalMoveStatus);
    const dependencyAuditStatus = symbol.dependencyAuditStatus ?? "pending";
    const pendingAuditMoved = actualPhysicalMoveStatus === "physically_moved" && dependencyAuditStatus !== "audited";

    if (!PHYSICAL_STATUS.has(symbol.physicalMoveStatus)) failures.push(`invalid_physicalMoveStatus:${symbol.name}`);
    if (definitionCount === 0) failures.push(`missing_definition:${symbol.name}`);
    if (duplicateDefinitionCount > 0) failures.push(`duplicate_definition:${symbol.name}`);
    if (actualDefinitionFile && actualDefinitionFile !== symbol.definitionFile) failures.push(`definition_file_mismatch:${symbol.name}:${actualDefinitionFile}`);
    if (kindMismatch) failures.push(`kind_mismatch:${symbol.name}:${semanticKind}:${symbol.kind}`);
    if (currentDomainMismatch) failures.push(`current_domain_mismatch:${symbol.name}:${actualDomain}:${symbol.currentDomain}`);
    if (physicalMoveMismatch) failures.push(`actual_physical_move_mismatch:${symbol.name}:${actualPhysicalMoveStatus}:${symbol.physicalMoveStatus}`);
    if (pendingAuditMoved) failures.push(`pending_dependency_audit_for_physical_move:${symbol.name}`);
    if (!legacyExportPresent) failures.push(`legacy_export_missing:${symbol.name}`);
    if (!facadeExportPresent) failures.push(`facade_export_missing:${symbol.name}`);
    if (unknownDependencies.length) failures.push(`unknown_dependency:${symbol.name}:${unknownDependencies.join(",")}`);
    if (dependencyAuditStatus === "audited" && missingDeclaredDependencies.length) failures.push(`missing_declared_dependency:${symbol.name}:${missingDeclaredDependencies.join(",")}`);
    if (dependencyAuditStatus === "audited" && staleDeclaredDependencies.length) failures.push(`stale_declared_dependency:${symbol.name}:${staleDeclaredDependencies.join(",")}`);
    if (crossDomainDependencyViolations.length) failures.push(`forbidden_cross_domain_dependency:${symbol.name}:${crossDomainDependencyViolations.join(",")}`);

    return {
      ...symbol,
      facadeExportRequired,
      dependencyAuditStatus,
      actualDefinitionFile,
      actualDomain,
      actualPhysicalMoveStatus,
      semanticKind,
      definitionCount,
      duplicateDefinitionCount,
      legacyExportPresent,
      facadeExportPresent,
      actualManifestDependencies,
      unknownDependencies,
      missingDeclaredDependencies,
      staleDeclaredDependencies,
      crossDomainDependencyViolations,
      kindMismatch,
      currentDomainMismatch,
      physicalMoveMismatch,
    };
  });

  for (const cycle of cycles) failures.push(`module_cycle:${cycle.join("->")}`);

  const planningToMonolithImports = [...new Set(Object.values(sourceRecords).flatMap((record) => (
    record.file.startsWith(`${PLANNING_DIR}/`)
      ? record.edges.filter((edge) => edge === LEGACY_FILE).map(() => record.file)
      : []
  )))];

  const forbiddenMonolithImports = planningToMonolithImports.filter((file) => !file.endsWith("Summaries.js"));
  for (const file of forbiddenMonolithImports) failures.push(`planning_core_imports_monolith:${file}`);

  const unregisteredPlanningModules = sourceFiles
    .filter((file) => file.startsWith(`${PLANNING_DIR}/`))
    .filter((file) => !file.endsWith("Summaries.js"))
    .filter((file) => !registry[file]);
  for (const file of unregisteredPlanningModules) failures.push(`unregistered_planning_module:${file}`);

  const duplicateDefinitionCount = entries.reduce((count, entry) => count + entry.duplicateDefinitionCount, 0);
  const physicalMovedExportCount = entries.filter((entry) => entry.actualPhysicalMoveStatus === "physically_moved").length;
  const auditedEntries = entries.filter((entry) => entry.dependencyAuditStatus === "audited");
  const missingDeclaredDependencyCount = auditedEntries.reduce((count, entry) => count + entry.missingDeclaredDependencies.length, 0);
  const staleDeclaredDependencyCount = auditedEntries.reduce((count, entry) => count + entry.staleDeclaredDependencies.length, 0);
  const actualDependencyMismatchCount = missingDeclaredDependencyCount + staleDeclaredDependencyCount;
  const pendingSymbolCount = entries.filter((entry) => entry.dependencyAuditStatus !== "audited").length;
  const auditedSymbolCount = auditedEntries.length;
  const entriesByName = new Map(entries.map((entry) => [entry.name, entry]));
  const legacyPublicNames = sourceRecords[LEGACY_FILE]?.exports ?? new Set();
  const legacyPublicSymbolCount = legacyPublicNames.size;
  const legacyStaticPublicSymbolCount = sourceRecords[LEGACY_FILE]?.exportInventory?.namedExportNames.length ?? legacyPublicSymbolCount;
  const legacyExportInventory = sourceRecords[LEGACY_FILE]?.exportInventory ?? null;
  const motionDatasetPrefixedLegacyPublicSymbols = [...legacyPublicNames]
    .filter(isMotionDatasetPrefixedPublicName)
    .sort();
  const motionDatasetPrefixedLegacyPublicSet = new Set(motionDatasetPrefixedLegacyPublicSymbols);
  const motionDatasetPrefixedManifestedSymbols = entries
    .filter((entry) => isMotionDatasetPrefixedPublicName(entry.name))
    .map((entry) => entry.name)
    .sort();
  const motionDatasetPrefixedManifestedSet = new Set(motionDatasetPrefixedManifestedSymbols);
  const unregisteredMotionDatasetPrefixedLegacyPublicSymbols = motionDatasetPrefixedLegacyPublicSymbols
    .filter((name) => !motionDatasetPrefixedManifestedSet.has(name))
    .sort();
  const motionDatasetPrefixedCrossDomainSymbols = entries
    .filter((entry) => isMotionDatasetPrefixedPublicName(entry.name))
    .filter((entry) => entry.targetDomain !== "motion_dataset")
    .map((entry) => ({
      name: entry.name,
      targetDomain: entry.targetDomain,
      definitionFile: entry.definitionFile,
      facadeFile: entry.facadeFile,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
  const motionDatasetDomainLegacyPublicSymbols = entries
    .filter((entry) => entry.targetDomain === "motion_dataset")
    .filter((entry) => entry.legacyExportRequired !== false)
    .map((entry) => entry.name)
    .sort();
  const motionDatasetDomainLegacyPublicSet = new Set(motionDatasetDomainLegacyPublicSymbols);
  const motionDatasetDomainNamingExceptionSymbols = motionDatasetDomainLegacyPublicSymbols
    .filter((name) => !isMotionDatasetPrefixedPublicName(name))
    .sort();
  const manifestedMotionDatasetLegacyPublicMissingSymbols = motionDatasetDomainLegacyPublicSymbols
    .filter((name) => !legacyPublicNames.has(name))
    .sort();
  const motionDatasetEntries = entries
    .filter((entry) => entry.targetDomain === "motion_dataset")
    .filter((entry) => entry.legacyExportRequired !== false);
  const motionDatasetPhysicalMovedSymbolCount = motionDatasetEntries
    .filter((entry) => entry.actualPhysicalMoveStatus === "physically_moved").length;
  const motionDatasetAuditedSymbolCount = motionDatasetEntries
    .filter((entry) => entry.dependencyAuditStatus === "audited").length;
  const motionDatasetPendingSymbolCount = motionDatasetEntries
    .filter((entry) => entry.dependencyAuditStatus !== "audited").length;
  const ambiguousLegacyPlanningCandidates = unregisteredMotionDatasetPrefixedLegacyPublicSymbols
    .map((name) => ({
      name,
      reason: "unregistered_motion_dataset_prefixed_legacy_public_symbol",
    }));
  for (const name of unregisteredMotionDatasetPrefixedLegacyPublicSymbols) {
    failures.push(`unregistered_motion_dataset_prefixed_legacy_public_symbol:${name}`);
  }
  for (const name of manifestedMotionDatasetLegacyPublicMissingSymbols) {
    failures.push(`manifested_motion_dataset_legacy_public_symbol_missing:${name}`);
  }
  for (const candidate of ambiguousLegacyPlanningCandidates) {
    failures.push(`ambiguous_legacy_planning_candidate:${candidate.name}`);
  }
  const extractedLegacyPublicSymbols = [...legacyPublicNames]
    .filter((name) => {
      const definitions = definitionsByName.get(name) ?? [];
      return definitions.length === 1 && definitions[0].file.startsWith(`${PLANNING_DIR}/`);
    })
    .sort();
  const manifestedExtractedLegacyPublicSymbols = entries
    .filter((entry) => entry.legacyExportRequired !== false)
    .filter((entry) => entry.actualPhysicalMoveStatus === "physically_moved")
    .map((entry) => entry.name)
    .sort();
  const manifestedExtractedLegacyPublicSet = new Set(manifestedExtractedLegacyPublicSymbols);
  const unregisteredExtractedLegacyPublicSymbols = extractedLegacyPublicSymbols
    .filter((name) => !manifestedExtractedLegacyPublicSet.has(name))
    .sort();
  const manifestedButNotLegacyPublicSymbols = manifestedExtractedLegacyPublicSymbols
    .filter((name) => !legacyPublicNames.has(name))
    .sort();
  for (const name of unregisteredExtractedLegacyPublicSymbols) failures.push(`unregistered_extracted_legacy_public_symbol:${name}`);
  for (const name of manifestedButNotLegacyPublicSymbols) failures.push(`manifested_legacy_public_symbol_missing_from_inventory:${name}`);

  const facadePublicNamesByFile = Object.fromEntries(
    Object.entries(sourceRecords)
      .filter(([file]) => file.startsWith(`${PLANNING_DIR}/`) && file.endsWith("Summaries.js"))
      .map(([file, record]) => [file, [...record.exports].sort()]),
  );
  const facadePublicSymbols = Object.entries(facadePublicNamesByFile)
    .flatMap(([file, names]) => names.map((name) => ({ file, name })))
    .sort((left, right) => left.name.localeCompare(right.name) || left.file.localeCompare(right.file));
  const facadeExportFilesByName = new Map();
  for (const { file, name } of facadePublicSymbols) {
    if (!facadeExportFilesByName.has(name)) facadeExportFilesByName.set(name, []);
    facadeExportFilesByName.get(name).push(file);
  }
  const facadeMetadataMismatches = entries
    .flatMap((entry) => facadeMetadataMismatchReasons(entry, facadeExportFilesByName.get(entry.name) ?? []))
    .sort((left, right) => left.name.localeCompare(right.name) || left.reason.localeCompare(right.reason));
  for (const mismatch of facadeMetadataMismatches) failures.push(`${mismatch.reason}:${mismatch.name}`);
  const nonFacadeSymbolWithFacadeFileNames = facadeMetadataMismatches
    .filter((mismatch) => mismatch.reason === "facade_file_present_for_non_facade_symbol")
    .map((mismatch) => mismatch.name)
    .sort();
  const requiredFacadeSymbolWithoutFacadeFileNames = facadeMetadataMismatches
    .filter((mismatch) => mismatch.reason === "facade_file_missing_for_required_facade_symbol")
    .map((mismatch) => mismatch.name)
    .sort();
  const multipleFacadeExports = facadeMetadataMismatches
    .filter((mismatch) => mismatch.reason === "facade_export_present_in_multiple_facades")
    .map((mismatch) => ({ name: mismatch.name, actualFacadeFiles: mismatch.actualFacadeFiles }))
    .sort((left, right) => left.name.localeCompare(right.name));
  const facadeManifestMismatches = facadePublicSymbols
    .filter(({ file, name }) => {
      const entry = entriesByName.get(name);
      return !entry || entry.facadeExportRequired === false || entry.facadeFile !== file;
    })
    .map(({ file, name }) => ({ name, actualFacadeFile: file, manifestFacadeFile: entriesByName.get(name)?.facadeFile ?? null }))
    .sort((left, right) => left.name.localeCompare(right.name));
  for (const mismatch of facadeManifestMismatches) failures.push(`facade_manifest_mismatch:${mismatch.name}`);

  const facadePublicNameSet = new Set(facadePublicSymbols.map(({ name }) => name));
  const internalPlanningExports = Object.entries(sourceRecords)
    .filter(([file]) => file.startsWith(`${PLANNING_DIR}/`) && !file.endsWith("Summaries.js"))
    .flatMap(([file, record]) => [...record.exports]
      .filter((name) => !legacyPublicNames.has(name) && !facadePublicNameSet.has(name))
      .map((name) => ({ file, name })))
    .sort((left, right) => left.name.localeCompare(right.name) || left.file.localeCompare(right.file));

  return {
    schema: "live2d_planning_module_boundary_report_v3",
    status: failures.length === 0 ? "pass" : "fail",
    failureCount: failures.length,
    failures,
    manifestFile: DEFAULT_MANIFEST_FILE,
    symbolCount: entries.length,
    legacyStaticPublicSymbolCount,
    duplicateDefinitionCount,
    cycleCount: cycles.length,
    cycles,
    scannedPlanningFileCount: sourceFiles.filter((file) => file.startsWith(`${PLANNING_DIR}/`)).length,
    unregisteredPlanningModuleCount: unregisteredPlanningModules.length,
    planningToMonolithImportCount: planningToMonolithImports.length,
    planningToMonolithImports,
    planningMonolithImportStatus: planningToMonolithImports.length === 0 ? "zero" : "facade_compatibility_allowed_before_queue_c1",
    physicallyExtractedModulesImportingMonolithCount: forbiddenMonolithImports.length,
    physicalMovedExportCount,
    legacyPublicSymbolCount,
    legacyExportInventory,
    motionDatasetPrefixedLegacyPublicSymbolCount: motionDatasetPrefixedLegacyPublicSymbols.length,
    motionDatasetPrefixedLegacyPublicSymbols,
    motionDatasetPrefixedManifestedSymbolCount: motionDatasetPrefixedManifestedSymbols.length,
    motionDatasetPrefixedManifestedSymbols,
    unregisteredMotionDatasetPrefixedLegacyPublicSymbolCount: unregisteredMotionDatasetPrefixedLegacyPublicSymbols.length,
    unregisteredMotionDatasetPrefixedLegacyPublicSymbols,
    motionDatasetPrefixedCrossDomainSymbolCount: motionDatasetPrefixedCrossDomainSymbols.length,
    motionDatasetPrefixedCrossDomainSymbols,
    motionDatasetDomainLegacyPublicSymbolCount: motionDatasetDomainLegacyPublicSymbols.length,
    motionDatasetDomainLegacyPublicSymbols,
    motionDatasetDomainNamingExceptionSymbolCount: motionDatasetDomainNamingExceptionSymbols.length,
    motionDatasetDomainNamingExceptionSymbols,
    manifestedMotionDatasetLegacyPublicMissingCount: manifestedMotionDatasetLegacyPublicMissingSymbols.length,
    manifestedMotionDatasetLegacyPublicMissingSymbols,
    motionDatasetManifestSymbolCount: motionDatasetDomainLegacyPublicSet.size,
    motionDatasetPhysicalMovedSymbolCount,
    motionDatasetAuditedSymbolCount,
    motionDatasetPendingSymbolCount,
    ambiguousLegacyPlanningCandidateCount: ambiguousLegacyPlanningCandidates.length,
    ambiguousLegacyPlanningCandidates,
    motionDatasetLegacyInventoryCoverageStatus: (
      unregisteredMotionDatasetPrefixedLegacyPublicSymbols.length === 0
      && manifestedMotionDatasetLegacyPublicMissingSymbols.length === 0
      && ambiguousLegacyPlanningCandidates.length === 0
    ) ? "pass" : "fail",
    extractedLegacyPublicSymbolCount: extractedLegacyPublicSymbols.length,
    extractedLegacyPublicSymbols,
    manifestedExtractedLegacyPublicSymbolCount: manifestedExtractedLegacyPublicSymbols.length,
    manifestedExtractedLegacyPublicSymbols,
    unregisteredExtractedLegacyPublicSymbolCount: unregisteredExtractedLegacyPublicSymbols.length,
    unregisteredExtractedLegacyPublicSymbols,
    manifestedButNotLegacyPublicCount: manifestedButNotLegacyPublicSymbols.length,
    manifestedButNotLegacyPublicSymbols,
    facadePublicSymbolCount: facadePublicSymbols.length,
    facadePublicNamesByFile,
    facadeManifestMismatchCount: facadeManifestMismatches.length,
    facadeManifestMismatches,
    facadeMetadataMismatchCount: facadeMetadataMismatches.length,
    facadeMetadataMismatches,
    nonFacadeSymbolWithFacadeFileCount: nonFacadeSymbolWithFacadeFileNames.length,
    nonFacadeSymbolWithFacadeFileNames,
    requiredFacadeSymbolWithoutFacadeFileCount: requiredFacadeSymbolWithoutFacadeFileNames.length,
    requiredFacadeSymbolWithoutFacadeFileNames,
    multipleFacadeExportCount: multipleFacadeExports.length,
    multipleFacadeExports,
    internalPlanningExportCount: internalPlanningExports.length,
    internalPlanningExports,
    unknownDependencyCount: entries.reduce((count, entry) => count + entry.unknownDependencies.length, 0),
    missingDeclaredDependencyCount,
    staleDeclaredDependencyCount,
    actualDependencyMismatchCount,
    crossDomainDependencyViolationCount: entries.reduce((count, entry) => count + entry.crossDomainDependencyViolations.length, 0),
    kindMismatchCount: entries.filter((entry) => entry.kindMismatch).length,
    currentDomainMismatchCount: entries.filter((entry) => entry.currentDomainMismatch).length,
    actualPhysicalMoveMismatchCount: entries.filter((entry) => entry.physicalMoveMismatch).length,
    auditedSymbolCount,
    pendingSymbolCount,
    entries,
    safeSummaryOnly: true,
  };
}

function readJson(file) {
  return JSON.parse(readFileSync(resolve(REPO_ROOT, file), "utf8"));
}

function readDefaultSourceTexts(manifest) {
  const files = new Set([LEGACY_FILE, ...discoverPlanningFiles()]);
  for (const symbol of manifest.symbols ?? []) {
    files.add(symbol.definitionFile);
    if (symbol.facadeFile) files.add(symbol.facadeFile);
  }
  return Object.fromEntries([...files].map((file) => [file, readFileSync(resolve(REPO_ROOT, file), "utf8")]));
}

function discoverPlanningFiles() {
  const root = resolve(REPO_ROOT, PLANNING_DIR);
  const files = [];
  function walk(dir) {
    for (const entry of readdirSync(dir)) {
      const absolute = resolve(dir, entry);
      const stat = statSync(absolute);
      if (stat.isDirectory()) {
        walk(absolute);
        continue;
      }
      if (entry.endsWith(".js")) files.push(toRepoPath(absolute));
    }
  }
  walk(root);
  return files.sort();
}

function discoverPlanningFilesFromTexts(sourceTexts) {
  return Object.keys(sourceTexts).filter((file) => file.startsWith(`${PLANNING_DIR}/`) && file.endsWith(".js"));
}

function facadeMetadataMismatchReasons(entry, actualFacadeFiles) {
  const reasons = [];
  if (entry.facadeExportRequired === false) {
    if (entry.facadeFile !== null) {
      reasons.push({
        name: entry.name,
        reason: "facade_file_present_for_non_facade_symbol",
        facadeFile: entry.facadeFile,
        actualFacadeFiles,
      });
    }
    if (actualFacadeFiles.length > 0) {
      reasons.push({
        name: entry.name,
        reason: "facade_export_present_for_non_facade_symbol",
        facadeFile: entry.facadeFile,
        actualFacadeFiles,
      });
    }
  } else {
    if (typeof entry.facadeFile !== "string" || entry.facadeFile.length === 0) {
      reasons.push({
        name: entry.name,
        reason: "facade_file_missing_for_required_facade_symbol",
        facadeFile: entry.facadeFile ?? null,
        actualFacadeFiles,
      });
    } else if (!entry.facadeFile.startsWith(`${PLANNING_DIR}/`) || !entry.facadeFile.endsWith("Summaries.js")) {
      reasons.push({
        name: entry.name,
        reason: "facade_file_not_planning_summary",
        facadeFile: entry.facadeFile,
        actualFacadeFiles,
      });
    }
  }
  if (actualFacadeFiles.length > 1) {
    reasons.push({
      name: entry.name,
      reason: "facade_export_present_in_multiple_facades",
      facadeFile: entry.facadeFile ?? null,
      actualFacadeFiles,
    });
  }
  return reasons;
}

function analyzeSourceFile(file, source) {
  const sanitized = sanitizeSource(source);
  const definitions = topLevelDefinitions(sanitized, source);
  const exportInventory = parseEsmPublicExportInventory(source);
  return {
    file,
    definitions,
    bodies: new Map(definitions.map((definition) => [definition.name, definition.body])),
    exports: new Set(exportInventory.namedExportNames),
    exportInventory,
    edges: staticModuleEdges(file, maskCommentsPreserveStrings(source)),
  };
}

function sanitizeSource(source) {
  let output = "";
  let state = "normal";
  let templateExpressionDepth = 0;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (state === "normal") {
      if (char === "/" && next === "/") {
        output += "  ";
        i += 1;
        state = "line_comment";
        continue;
      }
      if (char === "/" && next === "*") {
        output += "  ";
        i += 1;
        state = "block_comment";
        continue;
      }
      if (char === "'") {
        output += "'";
        state = "single";
        continue;
      }
      if (char === "\"") {
        output += "\"";
        state = "double";
        continue;
      }
      if (char === "`") {
        output += "`";
        state = "template";
        continue;
      }
      output += char;
      continue;
    }
    if (state === "line_comment") {
      output += char === "\n" ? "\n" : " ";
      if (char === "\n") state = "normal";
      continue;
    }
    if (state === "block_comment") {
      if (char === "*" && next === "/") {
        output += "  ";
        i += 1;
        state = "normal";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }
    if (state === "single" || state === "double") {
      const quote = state === "single" ? "'" : "\"";
      if (char === "\\") {
        output += "  ";
        i += 1;
        continue;
      }
      if (char === quote) {
        output += quote;
        state = "normal";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }
    if (state === "template") {
      if (char === "\\") {
        output += "  ";
        i += 1;
        continue;
      }
      if (char === "`") {
        output += "`";
        state = "normal";
        continue;
      }
      if (char === "$" && next === "{") {
        output += "${";
        i += 1;
        state = "template_expression";
        templateExpressionDepth = 1;
        continue;
      }
      output += char === "\n" ? "\n" : " ";
      continue;
    }
    if (state === "template_expression") {
      output += char;
      if (char === "{") templateExpressionDepth += 1;
      if (char === "}") templateExpressionDepth -= 1;
      if (templateExpressionDepth === 0) state = "template";
    }
  }
  return output;
}

function maskCommentsPreserveStrings(source) {
  let output = "";
  let state = "normal";
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];
    if (state === "normal") {
      if (char === "/" && next === "/") {
        output += "  ";
        i += 1;
        state = "line_comment";
        continue;
      }
      if (char === "/" && next === "*") {
        output += "  ";
        i += 1;
        state = "block_comment";
        continue;
      }
      output += char;
      continue;
    }
    if (state === "line_comment") {
      output += char === "\n" ? "\n" : " ";
      if (char === "\n") state = "normal";
      continue;
    }
    if (state === "block_comment") {
      if (char === "*" && next === "/") {
        output += "  ";
        i += 1;
        state = "normal";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
    }
  }
  return output;
}

function topLevelDefinitions(source, rawSource = source) {
  const definitions = [];
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    if (braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
      const match = source.slice(i).match(/^(export\s+)?(const|function|class)\s+([A-Za-z_$][\w$]*)\b/);
      if (match) {
        const exported = Boolean(match[1]);
        const kind = match[2];
        const name = match[3];
        const end = definitionEnd(source, i, kind);
        const body = rawSource.slice(i, end);
        definitions.push({ name, kind, semanticKind: semanticKindFor(name, kind), exported, body });
        i = Math.max(i, end - 1);
        continue;
      }
    }
    if (char === "{") braceDepth += 1;
    else if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    else if (char === "(") parenDepth += 1;
    else if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    else if (char === "[") bracketDepth += 1;
    else if (char === "]") bracketDepth = Math.max(0, bracketDepth - 1);
  }
  return definitions;
}

function definitionEnd(source, start, kind) {
  if (kind === "function") {
    const paramsOpen = source.indexOf("(", start);
    const paramsClose = paramsOpen === -1 ? start : matchingParenEnd(source, paramsOpen) - 1;
    const open = source.indexOf("{", Math.max(start, paramsClose));
    if (open === -1) return source.length;
    return matchingBraceEnd(source, open);
  }
  if (kind === "class") {
    const open = source.indexOf("{", start);
    if (open === -1) return source.length;
    return matchingBraceEnd(source, open);
  }
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  for (let i = start; i < source.length; i += 1) {
    const char = source[i];
    if (char === "{") braceDepth += 1;
    else if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    else if (char === "(") parenDepth += 1;
    else if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    else if (char === "[") bracketDepth += 1;
    else if (char === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === ";" && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) return i + 1;
  }
  return source.length;
}

function matchingBraceEnd(source, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    if (source[i] === "{") depth += 1;
    if (source[i] === "}") {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return source.length;
}

function matchingParenEnd(source, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    if (source[i] === "(") depth += 1;
    if (source[i] === ")") {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return source.length;
}

function semanticKindFor(name, declarationKind) {
  if (declarationKind === "class") return "class";
  if (declarationKind === "function" && name.startsWith("create")) return "factory";
  if (declarationKind === "const" && name.endsWith("_SCHEMA")) return "schema";
  if (declarationKind === "const") return "constant";
  return declarationKind;
}

function staticModuleEdges(file, source) {
  const edges = [];
  for (const match of source.matchAll(/\bimport\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g)) {
    const resolved = resolveRelativeJs(file, match[1]);
    if (resolved) edges.push(resolved);
  }
  for (const match of source.matchAll(/\bexport\s+[\s\S]*?\s+from\s+["']([^"']+)["']/g)) {
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
  return uniqueCycles(cycles);
}

function uniqueCycles(cycles) {
  const seen = new Set();
  return cycles.filter((cycle) => {
    const key = cycle.join("->");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function referencedManifestSymbols(body, manifestNames, ownName) {
  const sanitizedBody = sanitizeSource(body);
  return [...manifestNames]
    .filter((name) => name !== ownName && new RegExp(`\\b${escapeRegExp(name)}\\b`).test(sanitizedBody))
    .sort();
}

function crossDomainViolations(symbol, symbols, moduleGraph) {
  const byName = new Map(symbols.map((entry) => [entry.name, entry]));
  return (symbol.dependencies ?? []).filter((dependencyName) => {
    const dependency = byName.get(dependencyName);
    if (!dependency || dependency.targetDomain === symbol.targetDomain) return false;
    if (dependency.targetDomain !== "shared_planning_safety" || dependency.sharedDependencyGroup === "none") return true;
    return hasPath(moduleGraph, dependency.definitionFile, symbol.definitionFile);
  });
}

function hasPath(graph, from, to, seen = new Set()) {
  if (from === to) return true;
  if (seen.has(from)) return false;
  seen.add(from);
  return (graph[from] ?? []).some((edge) => hasPath(graph, edge, to, seen));
}

function actualStatusForDefinitionFile(file, definitionCount) {
  if (definitionCount !== 1 || !file) return "invalid";
  return file === LEGACY_FILE ? "not_moved" : file.startsWith(`${PLANNING_DIR}/`) ? "physically_moved" : "invalid";
}

function domainForFile(file, registry) {
  if (!file) return null;
  return registry[file] ?? null;
}

function isMotionDatasetPrefixedPublicName(name) {
  return name.startsWith("LIVE2D_MOTION_DATASET_") || name.startsWith("createMotionDataset");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toPosix(file) {
  return normalize(file).replace(/\\/g, "/");
}

function toRepoPath(absolute) {
  return toPosix(resolve(absolute).slice(REPO_ROOT.length + 1));
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
    scannedPlanningFileCount: report.scannedPlanningFileCount,
    unregisteredPlanningModuleCount: report.unregisteredPlanningModuleCount,
    planningToMonolithImportCount: report.planningToMonolithImportCount,
    physicallyExtractedModulesImportingMonolithCount: report.physicallyExtractedModulesImportingMonolithCount,
    physicalMovedExportCount: report.physicalMovedExportCount,
    legacyPublicSymbolCount: report.legacyPublicSymbolCount,
    extractedLegacyPublicSymbolCount: report.extractedLegacyPublicSymbolCount,
    manifestedExtractedLegacyPublicSymbolCount: report.manifestedExtractedLegacyPublicSymbolCount,
    unregisteredExtractedLegacyPublicSymbolCount: report.unregisteredExtractedLegacyPublicSymbolCount,
    manifestedButNotLegacyPublicCount: report.manifestedButNotLegacyPublicCount,
    facadePublicSymbolCount: report.facadePublicSymbolCount,
    facadeManifestMismatchCount: report.facadeManifestMismatchCount,
    facadeMetadataMismatchCount: report.facadeMetadataMismatchCount,
    nonFacadeSymbolWithFacadeFileCount: report.nonFacadeSymbolWithFacadeFileCount,
    requiredFacadeSymbolWithoutFacadeFileCount: report.requiredFacadeSymbolWithoutFacadeFileCount,
    multipleFacadeExportCount: report.multipleFacadeExportCount,
    internalPlanningExportCount: report.internalPlanningExportCount,
    unknownDependencyCount: report.unknownDependencyCount,
    missingDeclaredDependencyCount: report.missingDeclaredDependencyCount,
    staleDeclaredDependencyCount: report.staleDeclaredDependencyCount,
    actualDependencyMismatchCount: report.actualDependencyMismatchCount,
    crossDomainDependencyViolationCount: report.crossDomainDependencyViolationCount,
    kindMismatchCount: report.kindMismatchCount,
    currentDomainMismatchCount: report.currentDomainMismatchCount,
    actualPhysicalMoveMismatchCount: report.actualPhysicalMoveMismatchCount,
    auditedSymbolCount: report.auditedSymbolCount,
    pendingSymbolCount: report.pendingSymbolCount,
    safeSummaryOnly: true,
  }));
  process.exitCode = report.status === "pass" ? 0 : 1;
}
