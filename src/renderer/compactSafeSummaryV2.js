export const COMPACT_SAFE_SUMMARY_V2_SCHEMA = "iris_live2d_safe_summary_v2";
export const COMPACT_SAFE_SUMMARY_V2_PUBLIC_KEY = "live2d_safe_summary_v2";

export const COMPACT_SAFE_SUMMARY_V2_BLOCKER_GROUPS = Object.freeze([
  "owner_confirmation",
  "real_renderer_evidence",
  "motion_dataset",
  "priority1",
  "trusted_loader",
  "actual_data",
  "runtime_readiness",
  "production_readiness",
  "audit_reference",
]);

const FORBIDDEN_STATUSES = new Set(["ready", "production_ready", "owner_confirmed"]);
const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "prototype", "constructor"]);
const ALLOWED_KEYS = new Set([
  "priority1Status",
  "checkedRowCount",
  "motionDatasetExecutable",
  "ownerConfirmationConfirmed",
  "trustedLoaderStatus",
  "auditReferenceStatus",
  "realRendererEvidenceStatus",
  "actualDataStatus",
  "runtimeReadinessStatus",
  "productionReadinessStatus",
  "noncriticalAttentionLabels",
  "candidateOnlyLabels",
  "overallStatus",
]);
const UNSAFE_KEYS = new Set([
  "rawValue",
  "rawPayload",
  "rawEvidence",
  "rawOwnerNote",
  "rawAuditBody",
  "endpoint",
  "token",
  "secret",
  "privatePath",
  "actualFilePath",
  "actualFileContent",
  "rowBody",
  "runtimeReadinessClaim",
  "productionReadinessClaim",
  "ownerConfirmationClaim",
]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function normalizeLabels(value, invalidLabel) {
  if (value === undefined) return { labels: [], failures: [] };
  if (!Array.isArray(value)) return { labels: [], failures: [invalidLabel] };
  const labels = [];
  const failures = [];
  for (const item of value) {
    if (typeof item !== "string" || !item.trim()) {
      failures.push(invalidLabel);
    } else {
      labels.push(item);
    }
  }
  return { labels, failures };
}

function collectShapeFailures(input) {
  const failures = [];
  if (!isPlainObject(input)) return ["input_not_plain_object"];
  for (const key of Object.keys(input)) {
    if (PROTOTYPE_POLLUTION_KEYS.has(key)) failures.push(`unsafe_key:${key}`);
    if (UNSAFE_KEYS.has(key)) failures.push(`unsafe_field:${key}`);
    if (!ALLOWED_KEYS.has(key)) failures.push(`unknown_field:${key}`);
  }
  if (FORBIDDEN_STATUSES.has(input.overallStatus)) failures.push(`forbidden_status:${input.overallStatus}`);
  return failures;
}

function blockerGroupsFor(input) {
  return {
    owner_confirmation: input.ownerConfirmationConfirmed === true ? [] : ["owner_confirmation_false"],
    real_renderer_evidence: input.realRendererEvidenceStatus === "candidate_engine_available"
      ? []
      : ["real_renderer_evidence_missing"],
    motion_dataset: [
      ...(input.motionDatasetExecutable === true ? [] : ["motion_dataset_non_executable"]),
      ...(input.checkedRowCount === 0 ? ["checked_row_count_zero"] : []),
    ],
    priority1: input.priority1Status === "BLOCKED" ? ["priority1_blocked"] : [],
    trusted_loader: input.trustedLoaderStatus === "disabled" ? ["trusted_loader_disabled"] : [],
    actual_data: input.actualDataStatus === "not_applicable_for_candidate" ? [] : ["actual_ingestion_false"],
    runtime_readiness: input.runtimeReadinessStatus === "not_applicable_for_candidate" ? [] : ["runtime_readiness_false"],
    production_readiness: input.productionReadinessStatus === "not_applicable_for_candidate"
      ? []
      : ["production_readiness_false"],
    audit_reference: input.auditReferenceStatus === "present" ? [] : ["audit_reference_missing"],
  };
}

function hasCriticalBlockers(groups) {
  return Object.values(groups).some((labels) => labels.length > 0);
}

export function createCompactSafeSummaryV2(input = {}) {
  const shapeFailures = collectShapeFailures(input);
  const attention = normalizeLabels(input.noncriticalAttentionLabels, "noncritical_attention_label_invalid");
  const candidate = normalizeLabels(input.candidateOnlyLabels, "candidate_only_label_invalid");
  const normalized = {
    priority1Status: input.priority1Status || "BLOCKED",
    checkedRowCount: Number.isInteger(input.checkedRowCount) ? input.checkedRowCount : 0,
    motionDatasetExecutable: input.motionDatasetExecutable === true,
    ownerConfirmationConfirmed: input.ownerConfirmationConfirmed === true,
    trustedLoaderStatus: input.trustedLoaderStatus || "disabled",
    auditReferenceStatus: input.auditReferenceStatus || "missing",
    realRendererEvidenceStatus: input.realRendererEvidenceStatus || "missing",
    actualDataStatus: input.actualDataStatus || "blocked",
    runtimeReadinessStatus: input.runtimeReadinessStatus || "blocked",
    productionReadinessStatus: input.productionReadinessStatus || "blocked",
  };
  const blockerGroups = blockerGroupsFor(normalized);
  const rejectionLabels = [...new Set([...shapeFailures, ...attention.failures, ...candidate.failures])];

  let overallStatus = "blocked";
  if (!rejectionLabels.length && !hasCriticalBlockers(blockerGroups)) {
    overallStatus = attention.labels.length ? "attention_required" : "candidate_only";
  }

  return {
    schema: COMPACT_SAFE_SUMMARY_V2_SCHEMA,
    schemaVersion: "2",
    overallStatus,
    blockerGroups,
    motionPolicyStatus: [
      "policy_candidate_only",
      "no_runtime_execution",
      "strong_motion_guarded",
      "experimental_labels_not_executable",
    ],
    rendererEvidenceStatus: [
      "blocked_missing_real_evidence",
      "candidate_engine_available",
      "no_real_probe_started",
    ],
    datasetManifestStatus: [
      "metadata_only",
      "checked_row_count_zero",
      "actual_ingestion_false",
    ],
    ownerHandoffStatus: [
      "packet_draft_not_sent",
      "owner_confirmation_false",
    ],
    priority1Status: "BLOCKED",
    checkedRowCount: 0,
    safeSummaryOnly: true,
    rejectionLabels,
    compatibilityAlias: ["legacy_fields_retained"],
    deprecatedLegacyRemoval: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    trustedLoaderAllowlistEnabled: false,
    actualIngestionAllowed: false,
    motionDatasetExecutable: false,
  };
}
