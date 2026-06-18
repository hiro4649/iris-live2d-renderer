export function deriveCompactSafeSummaryV2Input(source = {}) {
  return {
    priority1Status: source.priority1Status === "RESOLVED" ? "RESOLVED" : "BLOCKED",
    checkedRowCount: Number.isInteger(source.checkedRowCount) ? source.checkedRowCount : 0,
    motionDatasetExecutable: source.motionDatasetExecutable === true,
    ownerConfirmationConfirmed: source.ownerConfirmationConfirmed === true,
    trustedLoaderStatus: source.trustedLoaderAllowlistEnabled === true ? "enabled" : "disabled",
    auditReferenceStatus: source.auditReferenceStatus === "present" ? "present" : "missing",
    realRendererEvidenceStatus: source.realRendererEvidenceStatus || "missing",
    actualDataStatus: source.actualIngestionAllowed === true ? "present" : "blocked",
    runtimeReadinessStatus: source.runtimeReadinessClaimed === true ? "ready" : "blocked",
    productionReadinessStatus: source.productionReadinessClaimed === true ? "ready" : "blocked",
  };
}

export function validateCompactSafeSummaryV2Parity(v1 = {}, v2 = {}) {
  const failures = [];
  const groups = v2.blockerGroups || {};
  const hasBlocker = (group, label) => Array.isArray(groups[group]) && groups[group].includes(label);

  if (v1.ownerConfirmationConfirmed === false && !hasBlocker("owner_confirmation", "owner_confirmation_false")) {
    failures.push("v1_owner_false_v2_owner_blocker_missing");
  }
  if (Number(v1.checkedRowCount) === 0 && !hasBlocker("motion_dataset", "checked_row_count_zero")) {
    failures.push("v1_checked_zero_v2_checked_row_blocker_missing");
  }
  if (v1.motionDatasetExecutable === false && !hasBlocker("motion_dataset", "motion_dataset_non_executable")) {
    failures.push("v1_motion_non_executable_v2_motion_blocker_missing");
  }
  if (v1.priority1Status === "BLOCKED" && !hasBlocker("priority1", "priority1_blocked")) {
    failures.push("v1_priority1_blocked_v2_priority1_blocker_missing");
  }
  if (v1.trustedLoaderAllowlistEnabled === false && !hasBlocker("trusted_loader", "trusted_loader_disabled")) {
    failures.push("v1_trusted_loader_disabled_v2_trusted_loader_blocker_missing");
  }
  if (v1.actualIngestionAllowed === false && !hasBlocker("actual_data", "actual_ingestion_false")) {
    failures.push("v1_actual_ingestion_false_v2_actual_data_blocker_missing");
  }
  if (v1.runtimeReadinessClaimed === false && !hasBlocker("runtime_readiness", "runtime_readiness_false")) {
    failures.push("v1_runtime_false_v2_runtime_blocker_missing");
  }
  if (v1.productionReadinessClaimed === false && !hasBlocker("production_readiness", "production_readiness_false")) {
    failures.push("v1_production_false_v2_production_blocker_missing");
  }
  if (v1.realRendererEvidenceStatus === "missing" && !hasBlocker("real_renderer_evidence", "real_renderer_evidence_missing")) {
    failures.push("v1_real_evidence_missing_v2_real_evidence_blocker_missing");
  }
  if (v2.overallStatus !== "blocked") failures.push("v2_overall_status_not_blocked");

  return {
    status: failures.length ? "fail" : "pass",
    failures,
    safeSummaryOnly: true,
  };
}
