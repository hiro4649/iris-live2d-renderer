import {
  isPrototypePollutionKey,
  validateSafeLabelArray,
} from "./safeLabelValidation.js";

export const REAL_EVIDENCE_OWNER_CHECKLIST_SCHEMA = "live2d_real_evidence_owner_checklist_v1";

export const REAL_EVIDENCE_OWNER_CHECKLIST_SECTIONS = Object.freeze([
  "scope_review",
  "renderer_evidence_requirements",
  "motion_dataset_manifest_requirements",
  "audit_reference_requirements",
  "trusted_loader_boundary",
  "runtime_readiness_boundary",
  "production_readiness_boundary",
  "expiry_and_reconfirmation",
  "safe_next_actions",
]);

export const REAL_EVIDENCE_OWNER_CHECKLIST_RENDERER_ITEMS = Object.freeze([
  "fresh_renderer_heartbeat",
  "real_model_load_supported",
  "model_loaded",
  "scene_loaded",
  "model_scene_match_confirmed",
  "cue_capability_confirmed",
  "last_cue_applied",
  "last_cue_applied_success",
  "source_type_allowlisted",
  "evidence_timestamp_fresh",
  "audit_reference_present",
  "owner_scope_confirmed",
]);

export const REAL_EVIDENCE_OWNER_CHECKLIST_MOTION_DATASET_ITEMS = Object.freeze([
  "metadata_manifest_present",
  "row_id_schema_present",
  "split_plan_present",
  "source_hash_label_present",
  "source_hash_not_verified_yet",
  "declared_row_count_not_checked_yet",
  "checked_row_count_zero",
  "actual_row_body_not_received",
  "motion_dataset_non_executable",
]);

export const REAL_EVIDENCE_OWNER_CHECKLIST_BOUNDARY_ITEMS = Object.freeze([
  "trusted_loader_disabled",
  "actual_ingestion_false",
  "runtime_readiness_false",
  "production_readiness_false",
  "priority1_blocked",
  "owner_confirmation_false",
]);

const CHECKLIST_SCOPE_ALLOWLIST = Object.freeze([
  "live2d_renderer_real_evidence_owner_gated_review",
]);

const OWNER_ACTION_ALLOWLIST = Object.freeze([
  "confirm_real_evidence_collection_scope",
  "confirm_renderer_probe_window",
  "confirm_audit_reference_review",
  "confirm_expiry_reconfirmation",
]);

const PREREQUISITE_LABEL_ALLOWLIST = Object.freeze([
  ...REAL_EVIDENCE_OWNER_CHECKLIST_SECTIONS.map((section) => `${section}_schema_valid`),
  ...REAL_EVIDENCE_OWNER_CHECKLIST_RENDERER_ITEMS,
  ...REAL_EVIDENCE_OWNER_CHECKLIST_MOTION_DATASET_ITEMS,
  ...REAL_EVIDENCE_OWNER_CHECKLIST_BOUNDARY_ITEMS,
]);

const ALLOWED_INPUT_KEYS = new Set([
  "scopeLabel",
  "sectionStatuses",
  "requiredOwnerActions",
  "missingPrerequisiteLabels",
  "blockingLabels",
  "expiryStatus",
  "reconfirmationRequired",
  "generatedAtStatus",
]);

const UNSAFE_INPUT_KEYS = new Set([
  "endpoint",
  "token",
  "secret",
  "private_path",
  "raw_evidence",
  "raw_renderer_payload",
  "raw_owner_note",
  "raw_command",
  "shell_body",
  "actual_file_content",
  "actual_file_path",
  "row_body",
  "hash_value",
  "actual_execution_request",
  "actual_ingestion_request",
  "trusted_loader_enable_request",
  "readiness_request",
  "owner_confirmation_request",
  "owner_action_label",
  "expired_checklist_used_as_current",
  "wrong_scope",
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
    if (isPrototypePollutionKey(key)) failures.push("unsafe_key_present");
    if (UNSAFE_INPUT_KEYS.has(key)) failures.push("unsafe_field_present");
    if (!ALLOWED_INPUT_KEYS.has(key)) failures.push("unknown_field_present");
  }
  return failures;
}

function normalizeSectionStatuses(sectionStatuses) {
  const statuses = {};
  const missing = [];
  const invalid = [];
  if (!isPlainObject(sectionStatuses)) {
    for (const section of REAL_EVIDENCE_OWNER_CHECKLIST_SECTIONS) {
      statuses[section] = "missing";
      missing.push(`${section}_schema_valid`);
    }
    return { statuses, missing, invalid: ["section_statuses_missing"] };
  }
  for (const key of Object.keys(sectionStatuses)) {
    if (!REAL_EVIDENCE_OWNER_CHECKLIST_SECTIONS.includes(key)) invalid.push("section_status_unknown");
  }
  for (const section of REAL_EVIDENCE_OWNER_CHECKLIST_SECTIONS) {
    const status = sectionStatuses[section];
    statuses[section] = status === "schema_valid" ? "schema_valid" : "missing_or_blocked";
    if (statuses[section] !== "schema_valid") missing.push(`${section}_schema_valid`);
  }
  return { statuses, missing, invalid };
}

function statusFor({ expiryStatus, missingPrerequisiteLabels, blockingLabels, rejectionLabels }) {
  if (expiryStatus === "expired") return "expired";
  if (rejectionLabels.length || missingPrerequisiteLabels.length || blockingLabels.length) return "blocked";
  return "ready_for_owner_review";
}

export function buildRealEvidenceOwnerChecklist(input = {}) {
  const rejectionLabels = collectShapeFailures(input);
  const scope = validateSafeLabelArray(input.scopeLabel ? [input.scopeLabel] : [], {
    allowedLabels: CHECKLIST_SCOPE_ALLOWLIST,
    missingLabel: "scope_missing",
    invalidLabel: "scope_invalid",
    unknownLabel: "scope_unknown",
  });
  const sections = normalizeSectionStatuses(input.sectionStatuses);
  const ownerActions = validateSafeLabelArray(input.requiredOwnerActions || [], {
    allowedLabels: OWNER_ACTION_ALLOWLIST,
    invalidLabel: "owner_action_invalid",
    unknownLabel: "owner_action_unknown",
  });
  const explicitMissing = validateSafeLabelArray(input.missingPrerequisiteLabels || [], {
    allowedLabels: PREREQUISITE_LABEL_ALLOWLIST,
    invalidLabel: "missing_prerequisite_invalid",
    unknownLabel: "missing_prerequisite_unknown",
  });
  const explicitBlocking = validateSafeLabelArray(input.blockingLabels || [], {
    allowedLabels: PREREQUISITE_LABEL_ALLOWLIST,
    invalidLabel: "blocking_label_invalid",
    unknownLabel: "blocking_label_unknown",
  });

  rejectionLabels.push(
    ...scope.failures,
    ...sections.invalid,
    ...ownerActions.failures,
    ...explicitMissing.failures,
    ...explicitBlocking.failures,
  );

  if (input.generatedAtStatus !== "label_only") rejectionLabels.push("generated_at_status_not_label_only");
  if (input.expiryStatus !== "active" && input.expiryStatus !== "expired") rejectionLabels.push("expiry_status_invalid");

  const missingPrerequisiteLabels = [...new Set([...sections.missing, ...explicitMissing.labels])];
  const blockingLabels = [...new Set([...explicitBlocking.labels, ...rejectionLabels])];
  const dedupedRejections = [...new Set(rejectionLabels)];
  const expiryStatus = input.expiryStatus === "expired" ? "expired" : "active";

  return {
    schema: REAL_EVIDENCE_OWNER_CHECKLIST_SCHEMA,
    checklistStatus: statusFor({
      expiryStatus,
      missingPrerequisiteLabels,
      blockingLabels,
      rejectionLabels: dedupedRejections,
    }),
    sectionStatuses: sections.statuses,
    requiredOwnerActions: ownerActions.labels,
    missingPrerequisiteLabels,
    blockingLabels,
    rejectionLabels: dedupedRejections,
    expiryStatus,
    reconfirmationRequired: input.reconfirmationRequired === true || expiryStatus === "expired",
    sent: false,
    authorizing: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actualEvidenceCollectionAuthorized: false,
    actualIngestionAllowed: false,
    trustedLoaderEnablementAuthorized: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    priority1Resolved: false,
    checkedRowCount: 0,
    motionDatasetExecutable: false,
    sourceHashVerified: false,
    declaredRowCountChecked: false,
    safeSummaryOnly: true,
  };
}

export function ownerChecklistToHandoffRejectionLabels(checklistResult) {
  if (!isPlainObject(checklistResult)) return ["owner_checklist_missing"];
  if (checklistResult.schema !== REAL_EVIDENCE_OWNER_CHECKLIST_SCHEMA) return ["owner_checklist_schema_invalid"];
  const labels = [];
  if (checklistResult.checklistStatus === "expired") labels.push("owner_checklist_expired");
  if (checklistResult.checklistStatus === "blocked") labels.push("owner_checklist_blocked");
  if (checklistResult.ownerConfirmationCreated === true || checklistResult.ownerConfirmationConfirmed === true) {
    labels.push("owner_checklist_rejected_owner_confirmation");
  }
  if (checklistResult.actualEvidenceCollectionAuthorized === true) {
    labels.push("owner_checklist_rejected_actual_evidence_authorization");
  }
  if (checklistResult.runtimeReadinessClaimed === true || checklistResult.productionReadinessClaimed === true) {
    labels.push("owner_checklist_rejected_readiness_claim");
  }
  return [...new Set(labels)];
}
