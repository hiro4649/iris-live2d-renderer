export const REAL_EVIDENCE_OWNER_HANDOFF_PACKET_SCHEMA = "live2d_real_evidence_owner_handoff_packet_v1";
import {
  isPrototypePollutionKey,
  validateSafeLabelArray,
} from "./safeLabelValidation.js";

export const SAFE_NEXT_ACTION_LABELS = Object.freeze([
  "wait_for_explicit_owner_action",
  "collect_real_renderer_evidence_after_owner_confirmation",
  "prepare_metadata_only_row_manifest",
  "keep_trusted_loader_disabled",
  "keep_priority1_blocked_until_real_evidence",
]);

const SCOPE_LABEL_ALLOWLIST = Object.freeze([
  "live2d_renderer",
  "motion_dataset",
  "audit_reference",
  "trusted_loader",
  "runtime_readiness",
  "production_readiness",
  "owner_confirmation",
  "real_evidence_collection",
]);

const REQUIRED_EVIDENCE_LABEL_ALLOWLIST = Object.freeze([
  "fresh_renderer_heartbeat",
  "real_model_load_supported",
  "model_loaded",
  "scene_loaded",
  "model_scene_match_confirmed",
  "cue_capability_confirmed",
  "last_cue_applied",
  "last_cue_applied_success",
  "audit_reference_present",
  "owner_scope_confirmed",
  "metadata_row_manifest_present",
]);

const STALE_EVIDENCE_LABEL_ALLOWLIST = Object.freeze([
  "renderer_heartbeat_stale",
  "model_evidence_stale",
  "scene_evidence_stale",
  "cue_evidence_stale",
  "audit_reference_stale",
  "owner_scope_expired",
]);

const OWNER_ACTION_LABEL_ALLOWLIST = Object.freeze([
  "review_scope",
  "confirm_real_evidence_collection_scope",
  "review_missing_evidence",
  "review_stale_evidence",
  "review_audit_reference",
  "keep_trusted_loader_disabled",
  "keep_priority1_blocked",
  "prepare_metadata_only_row_manifest",
]);

const ALLOWED_INPUT_KEYS = new Set([
  "scopeLabels",
  "requiredEvidenceLabels",
  "missingEvidenceLabels",
  "staleEvidenceLabels",
  "rowManifestStatus",
  "trustedLoaderStatus",
  "priority1Status",
  "checkedRowCount",
  "auditReferenceStatus",
  "ownerActionsRequired",
  "generatedAtStatus",
  "expiryStatus",
]);

const UNSAFE_INPUT_KEYS = new Set([
  "endpoint",
  "token",
  "secret",
  "private_path",
  "raw_evidence",
  "raw_renderer_payload",
  "raw_cue_payload",
  "raw_model_path",
  "raw_motion_path",
  "raw_owner_note",
  "raw_audit_body",
  "raw_command",
  "shell_body",
  "actual_file_content",
  "actual_file_path",
  "row_body",
  "hash_value",
  "source_hash_verified",
  "declared_row_count_checked",
  "actual_probe_request",
  "actual_ingestion_request",
  "trusted_loader_enablement_request",
  "readiness_claim_request",
  "owner_confirmation_request",
  "package_publish_request",
  "external_service_request",
]);

function isPlainObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function collectShapeFailures(input) {
  const failures = [];
  if (!isPlainObject(input)) return ["input_not_plain_object"];
  for (const key of Object.keys(input)) {
    if (isPrototypePollutionKey(key)) failures.push(`unsafe_key:${key}`);
    if (UNSAFE_INPUT_KEYS.has(key)) failures.push(`unsafe_field:${key}`);
    if (!ALLOWED_INPUT_KEYS.has(key)) failures.push(`unknown_field:${key}`);
  }
  return failures;
}

function pickStatus({
  rejectionLabels,
  scopeLabels,
  requiredEvidenceLabels,
  missingEvidenceLabels,
  expiryStatus,
  auditReferenceStatus,
  priority1Status,
  checkedRowCount,
}) {
  if (expiryStatus === "expired") return "expired";
  if (scopeLabels.length === 0) return "blocked_missing_scope";
  if (rejectionLabels.length || requiredEvidenceLabels.length === 0 || missingEvidenceLabels.length) {
    return "blocked_missing_evidence";
  }
  if (auditReferenceStatus !== "present") return "blocked_missing_audit";
  if (priority1Status === "BLOCKED") return "blocked_priority1";
  if (checkedRowCount === 0) return "blocked_checked_rows_zero";
  return "ready_for_owner_review";
}

export function buildRealEvidenceOwnerHandoffPacket(input = {}) {
  const rejectionLabels = collectShapeFailures(input);
  const scope = validateSafeLabelArray(input.scopeLabels, {
    allowedLabels: SCOPE_LABEL_ALLOWLIST,
    missingLabel: "scope_labels_missing",
    invalidLabel: "scope_label_invalid",
    unknownLabel: "scope_label_unknown",
  });
  const requiredEvidence = validateSafeLabelArray(input.requiredEvidenceLabels, {
    allowedLabels: REQUIRED_EVIDENCE_LABEL_ALLOWLIST,
    missingLabel: "required_evidence_labels_missing",
    invalidLabel: "required_evidence_label_invalid",
    unknownLabel: "required_evidence_label_unknown",
  });
  const missingEvidence = validateSafeLabelArray(input.missingEvidenceLabels || [], {
    allowedLabels: REQUIRED_EVIDENCE_LABEL_ALLOWLIST,
    invalidLabel: "missing_evidence_label_invalid",
    unknownLabel: "missing_evidence_label_unknown",
  });
  const staleEvidence = validateSafeLabelArray(input.staleEvidenceLabels || [], {
    allowedLabels: STALE_EVIDENCE_LABEL_ALLOWLIST,
    invalidLabel: "stale_evidence_label_invalid",
    unknownLabel: "stale_evidence_label_unknown",
  });
  const ownerActions = validateSafeLabelArray(input.ownerActionsRequired || [], {
    allowedLabels: OWNER_ACTION_LABEL_ALLOWLIST,
    invalidLabel: "owner_action_label_invalid",
    unknownLabel: "owner_action_label_unknown",
  });

  rejectionLabels.push(
    ...scope.failures,
    ...requiredEvidence.failures,
    ...missingEvidence.failures,
    ...staleEvidence.failures,
    ...ownerActions.failures,
  );

  if (input.rowManifestStatus !== "metadata_only_ready") rejectionLabels.push("row_manifest_not_metadata_only_ready");
  if (input.trustedLoaderStatus !== "disabled") rejectionLabels.push("trusted_loader_not_disabled");
  if (input.priority1Status !== "BLOCKED" && input.priority1Status !== "ready_for_future_review") {
    rejectionLabels.push("priority1_status_invalid");
  }
  if (!Number.isInteger(input.checkedRowCount) || input.checkedRowCount < 0) {
    rejectionLabels.push("checked_row_count_invalid");
  }
  if (input.generatedAtStatus !== "label_only") rejectionLabels.push("generated_at_status_not_label_only");

  const dedupedRejections = [...new Set(rejectionLabels)];
  const packetStatus = pickStatus({
    rejectionLabels: dedupedRejections,
    scopeLabels: scope.labels,
    requiredEvidenceLabels: requiredEvidence.labels,
    missingEvidenceLabels: missingEvidence.labels,
    expiryStatus: input.expiryStatus,
    auditReferenceStatus: input.auditReferenceStatus,
    priority1Status: input.priority1Status,
    checkedRowCount: input.checkedRowCount,
  });

  return {
    schema: REAL_EVIDENCE_OWNER_HANDOFF_PACKET_SCHEMA,
    packetStatus,
    scopeLabels: scope.labels,
    requiredEvidenceLabels: requiredEvidence.labels,
    missingEvidenceLabels: missingEvidence.labels,
    staleEvidenceLabels: staleEvidence.labels,
    rowManifestStatus: input.rowManifestStatus || "missing",
    trustedLoaderStatus: input.trustedLoaderStatus || "disabled",
    priority1Status: input.priority1Status || "BLOCKED",
    checkedRowCount: Number.isInteger(input.checkedRowCount) ? input.checkedRowCount : 0,
    auditReferenceStatus: input.auditReferenceStatus || "missing",
    ownerActionsRequired: ownerActions.labels,
    safeNextActionLabels: [...SAFE_NEXT_ACTION_LABELS],
    generatedAtStatus: input.generatedAtStatus || "missing",
    expiryStatus: input.expiryStatus || "missing",
    rejectionLabels: dedupedRejections,
    sent: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    authorizing: false,
    safeSummaryOnly: true,
    actualEvidenceCollectionAuthorized: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actualIngestionAllowed: false,
    trustedLoaderEnablementAuthorized: false,
    priority1Resolved: false,
    motionDatasetExecutable: false,
    sourceHashVerified: false,
    declaredRowCountChecked: false,
  };
}
