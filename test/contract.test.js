import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";
import {
  ALLOWED_CUBISM_LOADER_ENV_NAMES,
  CUBISM_LOADER_KIND_CANDIDATES,
  CUBISM_LOADER_PROVISIONING_SCHEMA,
  FRESH_EVIDENCE_BUNDLE_SCHEMA,
  GO_NOGO_PREFLIGHT_SCHEMA,
  LIVE2D_GO_NOGO_BLOCKER_RESOLUTION_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS,
  LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES,
  LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES,
  LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS,
  LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_RESOLUTION_PREREQUISITES,
  LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS,
  LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_MISSING_BLOCKER_CHECKS,
  LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS,
  LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS,
  LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_BLOCKER_VISIBILITY,
  LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS,
  LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_BLOCKERS,
  LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FUTURE_PREREQUISITES,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_CONFIRMATION_SCOPES,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_FILE_SHAPE,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_ITEMS,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_FUTURE_REFS,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_METADATA_LABELS,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_FILE_FORMATS,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_HASH_ALGORITHMS,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_ACCEPTED_CASES,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_REJECTED_ATTEMPT_CASES,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_ATTEMPT_CASES,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA,
  LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REJECTION_REASONS,
  LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SAFE_PUBLIC_REJECTION_REASONS,
  LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_ACCEPTED_CASES,
  LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_REJECTED_INPUT_ATTEMPT_CASES,
  LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_INPUT_ATTEMPT_CASES,
  LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA,
  LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REQUIRED_EVENT_FIELDS,
  LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REDACTION_POLICY,
  LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS,
  LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_INPUTS,
  LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_OUTPUTS,
  LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_CRITERIA_CHECKLIST_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_CRITERIA,
  LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_REJECTION_CRITERIA,
  LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REVIEW_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_REVIEW_SECTIONS,
  LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_CONFIRMATION_SCOPES,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_PROJECTION_SCHEMA,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_REASONS,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_SAFE_NEXT_ACTIONS,
  LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_LEDGER_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_READY_PREREQUISITE_LABELS,
  LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_MISSING_PREREQUISITE_LABELS,
  LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_BLOCKER_GATE_SCHEMA,
  LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_REQUIRED_BLOCKERS,
  LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_CLEARANCE_CONDITIONS,
  LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_SCOPES,
  LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_EVIDENCE_REFS,
  LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_REQUIRED_METADATA,
  LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_REQUIRED_BLOCKERS,
  LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_ENVELOPE_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_REQUIRED_INPUTS,
  LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_REQUIRED_OUTPUTS,
  LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_BLOCKERS,
  LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_REQUIRED_INPUTS,
  LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_REQUIRED_OUTPUTS,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_NO_ACTION_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_SAFE_STEPS,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_BLOCKERS,
  LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_REQUIRED_SECTIONS,
  LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_BLOCKERS,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LEDGER_SCHEMA,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LABELS,
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_UNFREEZE_CONDITIONS,
  LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_OWNER_ITEMS,
  LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_SYSTEM_ITEMS,
  LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_SWEEP_SCHEMA,
  LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_SURFACES,
  LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_FALSE_READY_REJECTIONS,
  LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_COMPLETED_ARTIFACTS,
  LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_UNRESOLVED_BLOCKERS,
  LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_SPEC_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_REJECTED_FIELDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_MATRIX_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_CATEGORIES,
  LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_ACTIONS,
  LIVE2D_MOTION_DATASET_MOTION_ALLOWLIST_SYNC_REVIEW_SCHEMA,
  LIVE2D_MOTION_DATASET_MOTION_ALLOWLIST_SYNC_REJECTION_REASONS,
  LIVE2D_MOTION_DATASET_RENDERER_READY_DEPENDENCY_MATRIX_SCHEMA,
  LIVE2D_MOTION_DATASET_RENDERER_READY_DEPENDENCIES,
  LIVE2D_MOTION_DATASET_RENDERER_READY_FALSE_READY_BLOCKERS,
  LIVE2D_RENDERER_READY_FALSE_POSITIVE_DEPENDENCY_SURFACE_SCHEMA,
  LIVE2D_RENDERER_READY_FALSE_POSITIVE_BLOCKERS,
  LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_SEPARATION_CONTRACT_SCHEMA,
  LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_REJECTION_LABELS,
  LIVE2D_RENDERER_READY_FRESH_EVIDENCE_ENVELOPE_SCHEMA,
  LIVE2D_RENDERER_READY_FRESH_EVIDENCE_REQUIRED_BLOCKERS,
  LIVE2D_RENDERER_READY_STALE_EVIDENCE_DOWNGRADE_CONTRACT_SCHEMA,
  LIVE2D_RENDERER_READY_STALE_EVIDENCE_REJECTION_LABELS,
  LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_ALLOWLIST_SCHEMA,
  LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_TYPES,
  LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_GUARD_SCHEMA,
  LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_REJECTION_LABELS,
  LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_BLOCKER_MATRIX_SCHEMA,
  LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_REQUIRED_EVIDENCE,
  LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_MISSING_LABELS,
  LIVE2D_RENDERER_READY_EVIDENCE_CONFLICT_DOWNGRADE_CONTRACT_SCHEMA,
  LIVE2D_RENDERER_READY_EVIDENCE_CONFLICT_DOWNGRADE_LABELS,
  LIVE2D_RENDERER_READY_GO_NOGO_BLOCKER_SURFACE_SCHEMA,
  LIVE2D_RENDERER_READY_GO_NOGO_REASONS,
  LIVE2D_RENDERER_READY_BLOCKER_REASON_ALLOWLIST_SCHEMA,
  LIVE2D_RENDERER_READY_BLOCKER_REASON_ALLOWLIST,
  LIVE2D_RENDERER_READY_SAFE_NEXT_ACTION_CATALOG_SCHEMA,
  LIVE2D_RENDERER_READY_SAFE_NEXT_ACTIONS,
  LIVE2D_RENDERER_READY_CROSS_SURFACE_BLOCKER_CONSISTENCY_SCHEMA,
  LIVE2D_RENDERER_READY_CROSS_SURFACE_BLOCKER_SURFACES,
  LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_CONTAMINATION_BLOCKERS,
  LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_REQUIRED_LABELS,
  LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_BLOCKERS,
  LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_CHECKLIST_SCHEMA,
  LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_REQUIRED_ITEMS,
  LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_FUTURE_ACTIONS,
  LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_GATE_SCHEMA,
  LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS,
  LIVE2D_OWNER_ACTION_LANE_FREEZE_STATUS_SCHEMA,
  LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS,
  LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_MANIFEST_SCHEMA,
  LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_FILE_IDENTITY_LABELS,
  LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_HASH_METADATA_LABELS,
  LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_OWNER_CONFIRMATION_REFS,
  LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_ACCEPTED_REQUEST_FIXTURE_CASES,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_CONFIRMATION_SCOPES,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_REVIEW_SECTIONS,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES,
  LIVE2D_EXPERIMENTAL_MOTION_LABELS,
  LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS,
  LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA,
  LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS,
  LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
  LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES,
  LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
  LIVE2D_MOTION_DATASET_UX_AUDIT_AXES,
  LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES,
  LIVE2D_OWNER_CONFIRMATION_BINDING_SCHEMA,
  OWNER_CONFIRMATION_ENVELOPE_SCHEMA,
  LIVE2D_SAFE_EVIDENCE_SUMMARY_CONTRACT_SCHEMA,
  LIVE2D_REAL_EVIDENCE_SUMMARY_INTAKE_BINDING_SCHEMA,
  LIVE2D_REAL_EVIDENCE_COLLECTOR_MANIFEST_SCHEMA,
  LIVE2D_REAL_EVIDENCE_COLLECTOR_FIXTURE_PACK_SCHEMA,
  LIVE2D_REAL_EVIDENCE_COLLECTOR_DRY_RUN_ENVELOPE_SCHEMA,
  REAL_EVIDENCE_FRESHNESS_THRESHOLD_SCHEMA,
  REAL_EVIDENCE_INTAKE_SCHEMA,
  REAL_EVIDENCE_REQUEST_PACKET_SCHEMA,
  REAL_RESIDENT_EVIDENCE_COLLECTION_PLAN_SCHEMA,
  TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA,
  TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA,
  TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA,
  createCubismLoaderProvisioningSummary,
  createFreshEvidenceBundleSummary,
  createGoNoGoBlockerResolutionSummary,
  createGoNoGoPreflightSummary,
  createMotionDatasetRealRowIntakeDryRunValidatorSummary,
  createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary,
  createMotionDatasetRealRowAuditManifestSummary,
  createMotionDatasetRealRowEvidenceLinkManifestSummary,
  createMotionDatasetRealRowGoNoGoBlockerMapSummary,
  createMotionDatasetRealRowPreIngestionReviewPacketSummary,
  createMotionDatasetRealRowFinalDryRunChecklistSummary,
  createMotionDatasetRealRowMissingDataFailClosedGateSummary,
  createMotionDatasetOwnerRowDataSubmissionPacketSummary,
  createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary,
  createMotionDatasetOwnerRowDataMetadataValidatorStubSummary,
  createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary,
  createMotionDatasetActualDataTaskEntryGateSummary,
  createMotionDatasetRowBodyParserContractStubSummary,
  createMotionDatasetRowBodyParserRejectionFixturePackSummary,
  createMotionDatasetIngestionAuditTrailStubSummary,
  createMotionDatasetIngestionRollbackPlanStubSummary,
  createMotionDatasetParserDryRunEnvelopeSummary,
  createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary,
  createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary,
  createMotionDatasetActualDataNoGoSummaryProjectionSummary,
  createMotionDatasetOwnerSubmissionReadinessLedgerSummary,
  createMotionDatasetFinalActualDataPreauthBlockerGateSummary,
  createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary,
  createMotionDatasetRowFileQuarantineStagingEnvelopeSummary,
  createMotionDatasetRedactionScanExecutionEnvelopeStubSummary,
  createMotionDatasetParserDryRunExecutionRequestEnvelopeSummary,
  createMotionDatasetAuditExecutionRequestEnvelopeSummary,
  createMotionDatasetActualDataTaskRunbookNoActionPacketSummary,
  createMotionDatasetFinalOwnerActualDataPacketSummary,
  createMotionDatasetActualDataFreezeStateLedgerSummary,
  createMotionDatasetOwnerWaitStatePacketSummary,
  createMotionDatasetReadinessNonSweeteningSweepSummary,
  createMotionDatasetPlanningCompletionReviewPacketSummary,
  createMotionDatasetOwnerSubmissionFormSpecSummary,
  createMotionDatasetRealRowRedactionPolicyMatrixSummary,
  createMotionDatasetMotionAllowlistSyncReviewSummary,
  createMotionDatasetRendererReadyDependencyMatrixSummary,
  createRendererReadyFalsePositiveDependencySurfaceSummary,
  createRendererReadyFixtureVsRealSeparationContractSummary,
  createRendererReadyFreshEvidenceEnvelopeSummary,
  createRendererReadyStaleEvidenceDowngradeContractSummary,
  createRendererReadyEvidenceSourceAllowlistSummary,
  createRendererReadyEvidenceSchemaViolationGuardSummary,
  createRendererReadyEvidenceCompletenessBlockerMatrixSummary,
  createRendererReadyEvidenceConflictDowngradeContractSummary,
  createRendererReadyGoNoGoBlockerSurfaceSummary,
  createRendererReadyBlockerReasonAllowlistSummary,
  createRendererReadySafeNextActionCatalogSummary,
  createRendererReadyCrossSurfaceBlockerConsistencySummary,
  createMotionDatasetRealRowSplitPolicyPacketSummary,
  createMotionDatasetSourceHashOwnerChecklistSummary,
  createMotionDatasetFinalOwnerWaitForDataGateSummary,
  createOwnerActionLaneFreezeStatusSummary,
  createMotionDatasetRowFileChecksumPreflightManifestSummary,
  createMotionDatasetRealRowRedactionScannerFixturePackSummary,
  createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary,
  createMotionDatasetRealRowIntakeRequestPacketSummary,
  createMotionDatasetRowSchemaPreflightSummary,
  createMotionDatasetSyntheticRowFixturePackSummary,
  createOwnerConfirmationBindingSummary,
  createOwnerConfirmationEnvelopeSummary,
  createRealEvidenceFreshnessThresholdSummary,
  createRealEvidenceCollectorDryRunEnvelopeSummary,
  createRealEvidenceCollectorManifestSummary,
  createRealEvidenceCollectorFixturePackSummary,
  createRealEvidenceSummaryIntakeBindingSummary,
  createRealEvidenceIntakeSummary,
  createRealEvidenceRequestPacketSummary,
  createRealResidentEvidenceCollectionPlanSummary,
  createSafeEvidenceSummaryContractSummary,
  createTrustedLoaderAllowlistPreflightSummary,
  createTrustedLoaderEnablementGateSummary,
  createTrustedLoaderOwnerHandoffSummary,
  inspectCubismLoaderProvisioning,
} from "../src/renderer/cubismLoaderProvisioning.js";
import {
  TRUSTED_LOADER_EVIDENCE_SCHEMA,
  TRUSTED_LOADER_KINDS,
  createTrustedLoaderEvidenceSummary,
  isTrustedLoaderEvidenceCandidate,
  validateTrustedLoaderEvidence,
} from "../src/renderer/trustedLoaderEvidence.js";
import {
  applyRuntimeConfig,
  browserStatusText,
  createHeartbeatPayload,
  createInitialRendererState,
  detectCubismModelLoader,
  enqueueBrowserCues,
  flushPendingCues,
  handleCueEventMessage,
  updateModelLoadEvidence,
} from "../public/renderer.js";

let nowMs = 1_800_000_000_000;
const tmpDir = join(process.cwd(), ".tmp-live2d-renderer-contract");
await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });
const model3Path = join(tmpDir, "avatar.model3.json");
const sdkCorePath = join(tmpDir, "CubismCore.js");
const unsafeCorePath = join(tmpDir, "arbitrary-core.js");
const unsafeCoreExtensionPath = join(tmpDir, "CubismCore.txt");
const ownerFrameworkLoaderPath = join(tmpDir, "owner-framework-loader.js");
const OWNER_ACTION_LANE_FREEZE_STATUS_ALLOWED_KEYS = [
  "schema",
  "safe_summary_only",
  "owner_action_lane_freeze_status",
  "owner_action_lane_freeze_reason",
  "owner_action_lane_completed_as_metadata_only",
  "owner_action_request_sent",
  "owner_action_requested",
  "owner_action_accepted",
  "owner_handoff_sent",
  "owner_instruction_request_sent",
  "owner_instruction_requested",
  "owner_instruction_accepted",
  "packet_request_sent",
  "owner_submission_received",
  "owner_submission_accepted",
  "owner_confirmation_created",
  "owner_confirmation_confirmed",
  "actual_data_task_started",
  "actual_data_preauthorized",
  "real_data_accepted",
  "row_body_read",
  "actual_file_read",
  "file_reference_value_accepted",
  "hash_calculation_performed",
  "source_hash_verified",
  "declared_row_count_checked",
  "parser_execution_started",
  "redaction_scan_execution_started",
  "audit_execution_started",
  "real_ingestion_audit_event_created",
  "runtime_readiness_claimed",
  "production_readiness_claimed",
  "priority1_status",
  "checked_row_count",
  "motion_dataset_boundary",
  "trusted_loader_boundary",
  "trusted_loader_allowlist_enabled",
  "renderer_ready",
  "safe_next_action",
  "unsafe_state_attempt_rejected",
  "boundary_policy",
];
const OWNER_ACTION_LANE_FREEZE_STATUS_REQUIRED_KEYS = [
  "schema",
  "owner_action_lane_freeze_status",
  "owner_action_lane_completed_as_metadata_only",
  "owner_action_request_sent",
  "owner_action_requested",
  "owner_action_accepted",
  "owner_handoff_sent",
  "owner_instruction_request_sent",
  "owner_instruction_requested",
  "owner_instruction_accepted",
  "packet_request_sent",
  "owner_submission_received",
  "owner_submission_accepted",
  "owner_confirmation_created",
  "owner_confirmation_confirmed",
  "actual_data_task_started",
  "actual_data_preauthorized",
  "real_data_accepted",
  "row_body_read",
  "actual_file_read",
  "file_reference_value_accepted",
  "hash_calculation_performed",
  "source_hash_verified",
  "declared_row_count_checked",
  "parser_execution_started",
  "redaction_scan_execution_started",
  "audit_execution_started",
  "real_ingestion_audit_event_created",
  "runtime_readiness_claimed",
  "production_readiness_claimed",
  "priority1_status",
  "checked_row_count",
  "motion_dataset_boundary",
  "trusted_loader_boundary",
  "trusted_loader_allowlist_enabled",
  "renderer_ready",
  "safe_next_action",
];
const OWNER_ACTION_LANE_FREEZE_STATUS_FORBIDDEN_KEYS = [
  "ownerActionApproved",
  "ownerActionConfirmed",
  "ownerConfirmation",
  "ownerConfirmationStatusConfirmed",
  "actualDataReady",
  "realDataReady",
  "runtimeReady",
  "productionReady",
  "rendererReady",
  "ready",
  "trustedLoaderEnabled",
  "trustedLoaderReady",
  "priority1Resolved",
  "checkedRows",
  "sourceHashVerifiedAt",
  "declaredRowCountCheckedAt",
  "actualFilePath",
  "actualFilePathValue",
  "rawDatasetRowBody",
  "rawPayload",
  "endpoint",
  "token",
  "secret",
  "commandPayload",
];
await mkdir(join(tmpDir, "textures"), { recursive: true });
await mkdir(join(tmpDir, "motions"), { recursive: true });
await mkdir(join(tmpDir, "expressions"), { recursive: true });
await writeFile(join(tmpDir, "safe_model.moc3"), "fixture-moc");
await writeFile(join(tmpDir, "textures", "texture_00.png"), "fixture-png");
await writeFile(join(tmpDir, "motions", "idle.motion3.json"), JSON.stringify({ Version: 3, Meta: {} }));
await writeFile(join(tmpDir, "expressions", "soft_smile.exp3.json"), JSON.stringify({ Type: "Live2D Expression" }));
await writeFile(model3Path, JSON.stringify({
  Version: 3,
  FileReferences: {
    Moc: "safe_model.moc3",
    Textures: ["textures/texture_00.png"],
    Expressions: [{ Name: "soft_smile", File: "expressions/soft_smile.exp3.json" }],
    Motions: { Idle: [{ File: "motions/idle.motion3.json" }] },
  },
}));
await writeFile(sdkCorePath, "globalThis.Live2DCubismCore = { Version: 'contract' };\n");
await writeFile(unsafeCorePath, "globalThis.NotApproved = true;\n");
await writeFile(unsafeCoreExtensionPath, "not-js");
await writeFile(ownerFrameworkLoaderPath, "globalThis.OwnerProvidedCubismFramework = true;\n");

try {
  const loaderPreflightDoc = await readFile(
    "docs/iris-live2d-renderer/IRIS_LIVE2D_LOADER_INTEGRATION_PREFLIGHT.md",
    "utf8"
  );
  const scheduleDoc = await readFile(
    "docs/iris-live2d-renderer/IRIS_LIVE2D_RENDERER_DEVELOPMENT_SCHEDULE.md",
    "utf8"
  );
  for (const requiredLabel of [
    "loader_detected_untrusted",
    "trusted_loader_evidence_candidate",
    "trusted_loader_ready_future",
    "cubism_framework_model_loader_v1",
    "cubism_moc_create",
    "missing_dependency",
    "operator_attention_required",
    "LIVE2D-CUBISM-LOADER-PROVISIONING8",
    "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
    "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
    "IRIS_LIVE2D_CUBISM_LOADER_KIND",
    "owner-provided",
    "candidate_present",
    "license_attention_required",
    "model_load_supported",
    "real_model_load_supported",
    "runtime_motion_allowlist",
    "expression_candidate_labels",
    "K331",
    "K332",
    "K333",
    "K334",
    "K626",
    "K627",
    "K628",
    "K629",
    "K806",
    "K814",
    "K944",
  ]) {
    assert.equal(loaderPreflightDoc.includes(requiredLabel), true);
  }
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-LOADER-INTEGRATION-PREFLIGHT5") >
      scheduleDoc.indexOf("REAL-MODEL-LOAD4"),
    true
  );
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-LOADER-INTEGRATION-PREFLIGHT5") <
      scheduleDoc.indexOf("MICRO-REACTION-PACK5"),
    true
  );
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-CUBISM-LOADER-PROVISIONING8") >
      scheduleDoc.indexOf("LIVE2D-CUBISM-LOADER-INTEGRATION7"),
    true
  );
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-CUBISM-LOADER-PROVISIONING8") <
      scheduleDoc.indexOf("## Phase 6: MICRO-REACTION-PACK5"),
    true
  );

  assert.equal(TRUSTED_LOADER_EVIDENCE_SCHEMA, "iris_live2d_trusted_loader_evidence_v1");
  assert.equal(TRUSTED_LOADER_KINDS.length, 0);
  assert.equal(CUBISM_LOADER_PROVISIONING_SCHEMA, "iris_live2d_cubism_loader_provisioning_v1");
  assert.equal(TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA, "iris_live2d_trusted_loader_allowlist_preflight_v1");
  assert.equal(TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA, "iris_live2d_trusted_loader_enablement_gate_v1");
  assert.equal(TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA, "iris_live2d_trusted_loader_owner_handoff_v1");
  assert.equal(FRESH_EVIDENCE_BUNDLE_SCHEMA, "iris_live2d_fresh_evidence_bundle_v1");
  assert.equal(GO_NOGO_PREFLIGHT_SCHEMA, "iris_live2d_go_nogo_preflight_v1");
  assert.equal(REAL_EVIDENCE_INTAKE_SCHEMA, "iris_live2d_real_evidence_intake_v1");
  assert.equal(OWNER_CONFIRMATION_ENVELOPE_SCHEMA, "iris_live2d_owner_confirmation_envelope_v1");
  assert.equal(REAL_EVIDENCE_REQUEST_PACKET_SCHEMA, "iris_live2d_real_evidence_request_packet_v1");
  assert.equal(REAL_RESIDENT_EVIDENCE_COLLECTION_PLAN_SCHEMA, "iris_live2d_real_resident_evidence_collection_plan_v1");
  assert.equal(LIVE2D_REAL_EVIDENCE_COLLECTOR_MANIFEST_SCHEMA, "iris_live2d_real_evidence_collector_manifest_v1");
  assert.equal(LIVE2D_REAL_EVIDENCE_COLLECTOR_FIXTURE_PACK_SCHEMA, "iris_live2d_real_evidence_collector_fixture_pack_v1");
  assert.equal(LIVE2D_REAL_EVIDENCE_COLLECTOR_DRY_RUN_ENVELOPE_SCHEMA, "iris_live2d_real_evidence_collector_dry_run_envelope_v1");
  assert.equal(REAL_EVIDENCE_FRESHNESS_THRESHOLD_SCHEMA, "iris_live2d_real_evidence_freshness_threshold_v1");
  assert.deepEqual(ALLOWED_CUBISM_LOADER_ENV_NAMES, [
    "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
    "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
    "IRIS_LIVE2D_CUBISM_LOADER_KIND",
  ]);
  assert.deepEqual(CUBISM_LOADER_KIND_CANDIDATES, [
    "cubism_framework_model_loader_v1",
    "cubism_moc_create",
  ]);

  const noLoaderProvisioning = inspectCubismLoaderProvisioning({});
  assert.equal(noLoaderProvisioning.provisioning_status, "not_configured");
  assert.equal(noLoaderProvisioning.loader_dependency_status, "missing_dependency");
  assert.equal(noLoaderProvisioning.operator_attention_required, true);
  assert.equal(noLoaderProvisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(noLoaderProvisioning.configured_env_count, 0);
  assertSafe(JSON.stringify(noLoaderProvisioning));

  const ownerProvidedProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_FRAMEWORK_JS: ownerFrameworkLoaderPath,
    IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_framework_model_loader_v1",
  });
  assert.equal(ownerProvidedProvisioning.provisioning_status, "candidate_present");
  assert.equal(ownerProvidedProvisioning.loader_dependency_status, "candidate_present");
  assert.equal(ownerProvidedProvisioning.license_status, "license_attention_required");
  assert.equal(ownerProvidedProvisioning.loader_kind, "cubism_framework_model_loader_v1");
  assert.equal(ownerProvidedProvisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(ownerProvidedProvisioning.operator_attention_required, true);
  assert.equal(ownerProvidedProvisioning.configured_env_names.includes("IRIS_LIVE2D_CUBISM_FRAMEWORK_JS"), true);
  assert.equal(ownerProvidedProvisioning.configured_env_names.includes("IRIS_LIVE2D_CUBISM_LOADER_KIND"), true);
  assert.equal(JSON.stringify(ownerProvidedProvisioning).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(ownerProvidedProvisioning));
  assertNoModelPathLeak(JSON.stringify(ownerProvidedProvisioning));

  const attemptedAllowlistProvisioning = createCubismLoaderProvisioningSummary({
    configured_env_names: ALLOWED_CUBISM_LOADER_ENV_NAMES,
    loader_kind: "cubism_framework_model_loader_v1",
    loader_dependency_status: "candidate_present",
    license_status: "license_attention_required",
    provisioning_status: "candidate_present",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(attemptedAllowlistProvisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(
    attemptedAllowlistProvisioning.trusted_loader_allowlist_request_status,
    "ignored_requires_separate_owner_confirmed_enablement_pr"
  );
  assertSafe(JSON.stringify(attemptedAllowlistProvisioning));

  const attemptedCamelCaseAllowlistProvisioning = createCubismLoaderProvisioningSummary({
    configured_env_names: ALLOWED_CUBISM_LOADER_ENV_NAMES,
    loader_kind: "cubism_framework_model_loader_v1",
    loader_dependency_status: "candidate_present",
    license_status: "license_attention_required",
    provisioning_status: "candidate_present",
    trustedLoaderAllowlistEnabled: true,
  });
  assert.equal(attemptedCamelCaseAllowlistProvisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(
    attemptedCamelCaseAllowlistProvisioning.trusted_loader_allowlist_request_status,
    "ignored_requires_separate_owner_confirmed_enablement_pr"
  );
  assertSafe(JSON.stringify(attemptedCamelCaseAllowlistProvisioning));

  const ownerProvidedAllowlistPreflight = createTrustedLoaderAllowlistPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_allowlist_status, "disabled");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_candidate_status, "candidate_present_diagnostic_only");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_blocker_status, "allowlist_disabled");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_license_status, "license_attention_required");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_route_guard_prerequisite, "available");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_real_evidence_prerequisite, "real_evidence_required");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_owner_confirmation_status, "owner_confirmation_required");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_ready_candidate, false);
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_allowlist_enabled, false);
  assert.equal(ownerProvidedAllowlistPreflight.candidate_present_diagnostic_only, true);
  assert.equal(ownerProvidedAllowlistPreflight.renderer_ready, false);
  assert.equal(ownerProvidedAllowlistPreflight.model_loaded, false);
  assert.equal(ownerProvidedAllowlistPreflight.scene_loaded, false);
  assert.equal(ownerProvidedAllowlistPreflight.browser_cue_delivery_ready, false);
  assert.equal(JSON.stringify(ownerProvidedAllowlistPreflight).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(ownerProvidedAllowlistPreflight));
  assertNoModelPathLeak(JSON.stringify(ownerProvidedAllowlistPreflight));

  const ownerProvidedEnablementGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: ownerProvidedAllowlistPreflight,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_gate_status, "blocked");
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_ready_candidate, false);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_allowlist_enabled, false);
  assert.equal(ownerProvidedEnablementGate.no_loader_trusted, true);
  assert.equal(ownerProvidedEnablementGate.candidate_present_diagnostic_only, true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_allowlist_disabled"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("candidate_present_diagnostic_only"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_fixture_evidence_only"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_missing_owner_confirmation"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_license_attention_required"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_priority1_unresolved"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_motion_dataset_non_executable"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_runtime_readiness_claimed, false);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_production_readiness_claimed, false);
  assert.equal(ownerProvidedEnablementGate.renderer_ready, false);
  assert.equal(ownerProvidedEnablementGate.model_loaded, false);
  assert.equal(ownerProvidedEnablementGate.scene_loaded, false);
  assert.equal(ownerProvidedEnablementGate.browser_cue_delivery_ready, false);
  assert.equal(JSON.stringify(ownerProvidedEnablementGate).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(ownerProvidedEnablementGate));
  assertNoModelPathLeak(JSON.stringify(ownerProvidedEnablementGate));

  const routeGuardMissingGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: ownerProvidedAllowlistPreflight,
    routeGuardStatus: "missing",
  });
  assert.equal(routeGuardMissingGate.trusted_loader_enablement_blockers.includes("blocked_missing_route_guard"), true);
  assertSafe(JSON.stringify(routeGuardMissingGate));

  const ownerProvidedOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: ownerProvidedAllowlistPreflight,
    enablementGateSummary: ownerProvidedEnablementGate,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_status, "blocked");
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_ready_candidate, false);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_allowlist_enabled, false);
  assert.equal(ownerProvidedOwnerHandoff.no_loader_trusted, true);
  assert.equal(ownerProvidedOwnerHandoff.candidate_present_diagnostic_only, true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_allowlist_disabled"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_candidate_present_diagnostic_only"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_enablement_gate_blocked"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_fixture_evidence_only"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_missing_owner_confirmation"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_license_attention_required"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_priority1_unresolved"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_motion_dataset_non_executable"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_runtime_readiness_claimed, false);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_production_readiness_claimed, false);
  assert.equal(ownerProvidedOwnerHandoff.do_not_continue_without_owner_confirmation, true);
  assert.equal(ownerProvidedOwnerHandoff.renderer_ready, false);
  assert.equal(ownerProvidedOwnerHandoff.model_loaded, false);
  assert.equal(ownerProvidedOwnerHandoff.scene_loaded, false);
  assert.equal(ownerProvidedOwnerHandoff.browser_cue_delivery_ready, false);
  assert.equal(JSON.stringify(ownerProvidedOwnerHandoff).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(ownerProvidedOwnerHandoff));
  assertNoModelPathLeak(JSON.stringify(ownerProvidedOwnerHandoff));

  const defaultFreshEvidenceBundle = createFreshEvidenceBundleSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: ownerProvidedAllowlistPreflight,
    enablementGateSummary: ownerProvidedEnablementGate,
    ownerHandoffSummary: ownerProvidedOwnerHandoff,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(defaultFreshEvidenceBundle.bundle_status, "blocked");
  assert.equal(defaultFreshEvidenceBundle.bundle_ready_candidate, false);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_fresh_real_evidence"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_fixture_evidence_only"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_owner_confirmation"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_license_attention_required"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_priority1_unresolved"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_motion_dataset_non_executable"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_not_runtime_ready"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_not_production_ready"), true);
  assert.equal(defaultFreshEvidenceBundle.allowlist_preflight_status, "available_disabled_non_trusting");
  assert.equal(defaultFreshEvidenceBundle.enablement_gate_status, "fail_closed");
  assert.equal(defaultFreshEvidenceBundle.owner_handoff_status, "review_only_blocked");
  assert.equal(defaultFreshEvidenceBundle.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultFreshEvidenceBundle.no_loader_trusted, true);
  assert.equal(defaultFreshEvidenceBundle.candidate_present_diagnostic_only, true);
  assert.equal(defaultFreshEvidenceBundle.renderer_ready, false);
  assert.equal(defaultFreshEvidenceBundle.model_loaded, false);
  assert.equal(defaultFreshEvidenceBundle.scene_loaded, false);
  assert.equal(defaultFreshEvidenceBundle.browser_cue_delivery_ready, false);
  assert.equal(defaultFreshEvidenceBundle.runtime_readiness_claimed, false);
  assert.equal(defaultFreshEvidenceBundle.production_readiness_claimed, false);
  assert.equal(defaultFreshEvidenceBundle.priority1_status, "BLOCKED");
  assert.equal(defaultFreshEvidenceBundle.motion_dataset_executable, false);
  assert.equal(JSON.stringify(defaultFreshEvidenceBundle).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(defaultFreshEvidenceBundle));
  assertNoModelPathLeak(JSON.stringify(defaultFreshEvidenceBundle));


  const defaultMotionDatasetRowSchemaPreflight = createMotionDatasetRowSchemaPreflightSummary();
  assert.equal(defaultMotionDatasetRowSchemaPreflight.schema, LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.row_schema_preflight_status, "planning_only_blocked");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.row_schema_ready_candidate, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.planning_only, true);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.row_data_present, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.checked_row_count, 0);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.motion_dataset_status, "non_executable");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.motion_dataset_executable, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.motion_execution_enabled, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.real_row_ingestion_started, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.real_evidence_collection_started, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.live_probe_started, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.owner_confirmation_created, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.owner_confirmation_confirmed, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.runtime_readiness_claimed, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.production_readiness_claimed, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.go_nogo_status, "no_go");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.go_candidate, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.blocker_resolved, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.priority1_status, "BLOCKED");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultMotionDatasetRowSchemaPreflight.required_row_fields, [...LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS]);
  assert.deepEqual(defaultMotionDatasetRowSchemaPreflight.required_audit_metadata, [...LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA]);
  assert.deepEqual(defaultMotionDatasetRowSchemaPreflight.runtime_supported_motion_styles, [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES]);
  assert.deepEqual(defaultMotionDatasetRowSchemaPreflight.experimental_motion_labels, [...LIVE2D_EXPERIMENTAL_MOTION_LABELS]);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.experimental_motion_labels_executable, false);
  assert.deepEqual(defaultMotionDatasetRowSchemaPreflight.renderer_ready_required_fields, [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS]);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.renderer_ready, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.model_loaded, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.scene_loaded, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.browser_cue_delivery_ready, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.rejected_private_material_fields.includes("credential_material"), true);
  assert.deepEqual(defaultMotionDatasetRowSchemaPreflight.ux_audit_axes, [...LIVE2D_MOTION_DATASET_UX_AUDIT_AXES]);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.fixture_success_is_real_evidence, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.manifest_existence_is_real_evidence, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.asset_route_success_is_real_evidence, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.sse_connection_is_real_evidence, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.cue_acceptance_is_real_evidence, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.browser_cue_delivery_is_runtime_readiness, false);
  assert.equal(defaultMotionDatasetRowSchemaPreflight.collection_plan_status, "planning_only");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.freshness_threshold_status, "preserved");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.safe_evidence_summary_contract_status, "preserved");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.summary_intake_binding_status, "preserved");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.owner_confirmation_binding_status, "schema_only_blocked");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.blocker_resolution_schema_status, "planning_only_blocked");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.collector_manifest_status, "planning_only");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.collector_fixture_pack_status, "synthetic_only");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.collector_dry_run_envelope_status, "request_only");
  assert.equal(defaultMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_no_real_rows_present"), true);
  assertSafe(JSON.stringify(defaultMotionDatasetRowSchemaPreflight));
  assertNoModelPathLeak(JSON.stringify(defaultMotionDatasetRowSchemaPreflight));

  const unsafeMotionDatasetRowSchemaPreflight = createMotionDatasetRowSchemaPreflightSummary({
    motion_style: "blink_attention",
    checked_row_count: 1,
    row: { raw_motion_command: "private-command", token_value: "secret-token" },
    motion_dataset_executable: true,
    real_row_ingestion_started: true,
    real_evidence_collection_started: true,
    live_probe_started: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    trusted_loader_allowlist_enabled: true,
    go_nogo_status: "go",
    blocker_resolved: true,
  });
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.checked_row_count, 0);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.row_data_present, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.motion_dataset_executable, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.real_row_ingestion_started, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.real_evidence_collection_started, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.live_probe_started, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.owner_confirmation_created, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.owner_confirmation_confirmed, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.runtime_readiness_claimed, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.production_readiness_claimed, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.go_nogo_status, "no_go");
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.blocker_resolved, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_checked_row_count_nonzero"), true);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_experimental_label_non_executable"), true);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_raw_or_private_field"), true);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_readiness_claim"), true);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_motion_execution_or_row_ingestion"), true);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_owner_confirmation_creation_or_confirmation"), true);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_trusted_loader_request"), true);
  assert.equal(unsafeMotionDatasetRowSchemaPreflight.rejection_reasons.includes("row_schema_rejected_real_collection_or_probe"), true);
  assert.equal(JSON.stringify(unsafeMotionDatasetRowSchemaPreflight).includes("private-command"), false);
  assert.equal(JSON.stringify(unsafeMotionDatasetRowSchemaPreflight).includes("secret-token"), false);
  assertSafe(JSON.stringify(unsafeMotionDatasetRowSchemaPreflight));
  assertNoModelPathLeak(JSON.stringify(unsafeMotionDatasetRowSchemaPreflight));

  const defaultSyntheticRowFixturePack = createMotionDatasetSyntheticRowFixturePackSummary();
  assert.equal(defaultSyntheticRowFixturePack.schema, LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA);
  assert.equal(defaultSyntheticRowFixturePack.motion_dataset_synthetic_row_fixture_pack_status, "planning_only_blocked");
  assert.equal(defaultSyntheticRowFixturePack.planning_only_boundary, true);
  assert.equal(defaultSyntheticRowFixturePack.synthetic_only_boundary, true);
  assert.equal(defaultSyntheticRowFixturePack.non_executable_boundary, true);
  assert.equal(defaultSyntheticRowFixturePack.real_row_data_present, false);
  assert.equal(defaultSyntheticRowFixturePack.synthetic_fixture_row_count, LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES.length);
  assert.equal(defaultSyntheticRowFixturePack.checked_row_count, 0);
  assert.equal(defaultSyntheticRowFixturePack.motion_dataset_executable, false);
  assert.equal(defaultSyntheticRowFixturePack.motion_dataset_ready_candidate, false);
  assert.equal(defaultSyntheticRowFixturePack.real_evidence_collection_started, false);
  assert.equal(defaultSyntheticRowFixturePack.real_probe_started, false);
  assert.equal(defaultSyntheticRowFixturePack.live_probe_started, false);
  assert.equal(defaultSyntheticRowFixturePack.motion_execution_enabled, false);
  assert.equal(defaultSyntheticRowFixturePack.runtime_readiness_claimed, false);
  assert.equal(defaultSyntheticRowFixturePack.production_readiness_claimed, false);
  assert.equal(defaultSyntheticRowFixturePack.renderer_ready, false);
  assert.equal(defaultSyntheticRowFixturePack.model_loaded, false);
  assert.equal(defaultSyntheticRowFixturePack.scene_loaded, false);
  assert.equal(defaultSyntheticRowFixturePack.browser_cue_delivery_ready, false);
  assert.equal(defaultSyntheticRowFixturePack.priority1_status, "BLOCKED");
  assert.equal(defaultSyntheticRowFixturePack.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultSyntheticRowFixturePack.owner_confirmation_created, false);
  assert.equal(defaultSyntheticRowFixturePack.owner_confirmation_confirmed, false);
  assert.equal(defaultSyntheticRowFixturePack.owner_confirmation_status, "schema_only");
  assert.equal(defaultSyntheticRowFixturePack.go_nogo_status, "no_go");
  assert.equal(defaultSyntheticRowFixturePack.go_candidate, false);
  assert.equal(defaultSyntheticRowFixturePack.blocker_resolved, false);
  assert.deepEqual(defaultSyntheticRowFixturePack.accepted_synthetic_fixture_cases, [...LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES]);
  assert.equal(defaultSyntheticRowFixturePack.rejected_synthetic_fixture_cases.length, LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES.length);
  assert.equal(LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES.includes("token_value_rejected"), true);
  assert.equal(LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES.includes("endpoint_value_rejected"), true);
  assert.equal(defaultSyntheticRowFixturePack.rejected_synthetic_fixture_cases.includes("credential_value_rejected"), true);
  assert.equal(defaultSyntheticRowFixturePack.rejected_synthetic_fixture_cases.includes("network_value_rejected"), true);
  assert.deepEqual(defaultSyntheticRowFixturePack.runtime_supported_motion_styles, [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES]);
  assert.deepEqual(defaultSyntheticRowFixturePack.experimental_motion_labels, [...LIVE2D_EXPERIMENTAL_MOTION_LABELS]);
  assert.deepEqual(defaultSyntheticRowFixturePack.renderer_ready_required_fields, [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS]);
  assert.equal(defaultSyntheticRowFixturePack.experimental_motion_labels_executable, false);
  assert.equal(defaultSyntheticRowFixturePack.synthetic_fixture_validator_status, "pass_synthetic_only");
  assert.equal(defaultSyntheticRowFixturePack.unsafe_material_rejection_status, "preserved");
  assert.equal(defaultSyntheticRowFixturePack.ux_audit_guard_status, "required");
  assert.equal(defaultSyntheticRowFixturePack.eval_contamination_guard_status, "required");
  assert.equal(defaultSyntheticRowFixturePack.fixture_success_is_real_evidence, false);
  assert.equal(defaultSyntheticRowFixturePack.manifest_existence_is_real_evidence, false);
  assert.equal(defaultSyntheticRowFixturePack.asset_route_success_is_real_evidence, false);
  assert.equal(defaultSyntheticRowFixturePack.sse_connection_is_real_evidence, false);
  assert.equal(defaultSyntheticRowFixturePack.cue_acceptance_is_real_evidence, false);
  assert.equal(defaultSyntheticRowFixturePack.browser_cue_delivery_is_runtime_readiness, false);
  assert.equal(defaultSyntheticRowFixturePack.row_schema_preflight_status, "preserved");
  assert.equal(defaultSyntheticRowFixturePack.collector_dry_run_envelope_status, "request_only_preserved");
  for (const fixtureCase of LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES) {
    assert.equal(defaultSyntheticRowFixturePack.accepted_synthetic_fixture_cases.includes(fixtureCase), true);
  }
  for (const fixtureCase of LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES) {
    assert.equal(typeof fixtureCase, "string");
  }
  assertSafe(JSON.stringify(defaultSyntheticRowFixturePack));
  assertNoModelPathLeak(JSON.stringify(defaultSyntheticRowFixturePack));

  const unsafeSyntheticRowFixturePack = createMotionDatasetSyntheticRowFixturePackSummary({
    accepted_synthetic_fixture_cases: ["safe_talk_row"],
    row: { raw_cue_payload: "private-cue", raw_stack_trace: "private-stack" },
    checked_row_count: 7,
    motion_dataset_executable: true,
    motion_execution_enabled: true,
    real_evidence_collection_started: true,
    real_probe_started: true,
    live_probe_started: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    owner_confirmation_status: "confirmed",
    renderer_ready: true,
    model_loaded: true,
    scene_loaded: true,
    browser_cue_delivery_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    trustedLoaderAllowlistEnabled: true,
    go_nogo_status: "go",
    blocker_resolved: true,
    world_command: "private-world",
    obs_command: "private-obs",
    game_input: "private-game",
    os_command: "private-os",
    memory_commit: "private-memory",
    relationship_commit: "private-relationship",
  });
  assert.equal(unsafeSyntheticRowFixturePack.synthetic_fixture_row_count, LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES.length);
  assert.equal(unsafeSyntheticRowFixturePack.checked_row_count, 0);
  assert.equal(unsafeSyntheticRowFixturePack.real_row_data_present, false);
  assert.equal(unsafeSyntheticRowFixturePack.motion_dataset_executable, false);
  assert.equal(unsafeSyntheticRowFixturePack.real_evidence_collection_started, false);
  assert.equal(unsafeSyntheticRowFixturePack.owner_confirmation_confirmed, false);
  assert.equal(unsafeSyntheticRowFixturePack.renderer_ready, false);
  assert.equal(unsafeSyntheticRowFixturePack.go_nogo_status, "no_go");
  assert.equal(unsafeSyntheticRowFixturePack.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeSyntheticRowFixturePack.validation_blocked_reasons.includes("synthetic_row_fixture_pack_rejected_raw_or_private_field"), true);
  assert.equal(unsafeSyntheticRowFixturePack.validation_blocked_reasons.includes("synthetic_row_fixture_pack_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeSyntheticRowFixturePack.validation_blocked_reasons.includes("synthetic_row_fixture_pack_rejected_motion_execution"), true);
  assert.equal(unsafeSyntheticRowFixturePack.validation_blocked_reasons.includes("synthetic_row_fixture_pack_rejected_real_collection_or_probe"), true);
  assert.equal(unsafeSyntheticRowFixturePack.validation_blocked_reasons.includes("synthetic_row_fixture_pack_rejected_owner_confirmation"), true);
  assert.equal(unsafeSyntheticRowFixturePack.validation_blocked_reasons.includes("synthetic_row_fixture_pack_rejected_readiness_claim"), true);
  assert.equal(unsafeSyntheticRowFixturePack.validation_blocked_reasons.includes("synthetic_row_fixture_pack_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeSyntheticRowFixturePack.validation_blocked_reasons.includes("synthetic_row_fixture_pack_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeSyntheticRowFixturePack).includes("private-cue"), false);
  assert.equal(JSON.stringify(unsafeSyntheticRowFixturePack).includes("private-stack"), false);
  assert.equal(JSON.stringify(unsafeSyntheticRowFixturePack).includes("private-world"), false);
  assertSafe(JSON.stringify(unsafeSyntheticRowFixturePack));
  assertNoModelPathLeak(JSON.stringify(unsafeSyntheticRowFixturePack));

  const defaultRealRowIntakeRequestPacket = createMotionDatasetRealRowIntakeRequestPacketSummary();
  assert.equal(defaultRealRowIntakeRequestPacket.schema, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA);
  assert.equal(defaultRealRowIntakeRequestPacket.motion_dataset_real_row_intake_request_packet_status, "planning_only_blocked");
  assert.equal(defaultRealRowIntakeRequestPacket.planning_only_boundary, true);
  assert.equal(defaultRealRowIntakeRequestPacket.request_only_boundary, true);
  assert.equal(defaultRealRowIntakeRequestPacket.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRealRowIntakeRequestPacket.real_row_data_present, false);
  assert.equal(defaultRealRowIntakeRequestPacket.checked_row_count, 0);
  assert.equal(defaultRealRowIntakeRequestPacket.expected_row_count_records_rows, false);
  assert.equal(defaultRealRowIntakeRequestPacket.motion_dataset_executable, false);
  assert.equal(defaultRealRowIntakeRequestPacket.motion_dataset_ready_candidate, false);
  assert.deepEqual(defaultRealRowIntakeRequestPacket.required_request_fields, [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS]);
  assert.deepEqual(defaultRealRowIntakeRequestPacket.required_file_format_policy, [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS]);
  assert.equal(defaultRealRowIntakeRequestPacket.rejected_request_fields.length, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS.length);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS.includes("raw_dataset_row_body"), true);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS.includes("token_value"), true);
  assert.equal(defaultRealRowIntakeRequestPacket.rejected_request_fields.includes("unsafe_dataset_row_body"), true);
  assert.equal(defaultRealRowIntakeRequestPacket.rejected_request_fields.includes("credential_value"), true);
  assert.equal(defaultRealRowIntakeRequestPacket.real_row_body_accepted, false);
  assert.equal(defaultRealRowIntakeRequestPacket.request_packet_is_real_row_ingestion, false);
  assert.equal(defaultRealRowIntakeRequestPacket.request_packet_parses_row_bodies, false);
  assert.equal(defaultRealRowIntakeRequestPacket.request_packet_adds_files, false);
  assert.equal(defaultRealRowIntakeRequestPacket.request_packet_executes_motion, false);
  assert.equal(defaultRealRowIntakeRequestPacket.request_packet_collects_real_evidence, false);
  assert.equal(defaultRealRowIntakeRequestPacket.request_packet_claims_readiness, false);
  assert.equal(defaultRealRowIntakeRequestPacket.runtime_readiness_claimed, false);
  assert.equal(defaultRealRowIntakeRequestPacket.production_readiness_claimed, false);
  assert.equal(defaultRealRowIntakeRequestPacket.renderer_ready, false);
  assert.equal(defaultRealRowIntakeRequestPacket.model_loaded, false);
  assert.equal(defaultRealRowIntakeRequestPacket.scene_loaded, false);
  assert.equal(defaultRealRowIntakeRequestPacket.browser_cue_delivery_ready, false);
  assert.equal(defaultRealRowIntakeRequestPacket.priority1_status, "BLOCKED");
  assert.equal(defaultRealRowIntakeRequestPacket.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultRealRowIntakeRequestPacket.owner_confirmation_required, true);
  assert.equal(defaultRealRowIntakeRequestPacket.owner_confirmation_created, false);
  assert.equal(defaultRealRowIntakeRequestPacket.owner_confirmation_confirmed, false);
  assert.equal(defaultRealRowIntakeRequestPacket.go_nogo_status, "no_go");
  assert.equal(defaultRealRowIntakeRequestPacket.go_candidate, false);
  assert.equal(defaultRealRowIntakeRequestPacket.blocker_resolved, false);
  assert.equal(defaultRealRowIntakeRequestPacket.row_schema_ref, LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA);
  assert.equal(defaultRealRowIntakeRequestPacket.synthetic_fixture_pack_ref, LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA);
  assert.equal(defaultRealRowIntakeRequestPacket.row_schema_preflight_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeRequestPacket.synthetic_fixture_pack_status, "synthetic_only_preserved");
  assert.deepEqual(defaultRealRowIntakeRequestPacket.runtime_supported_motion_styles, [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES]);
  assert.deepEqual(defaultRealRowIntakeRequestPacket.experimental_motion_labels, [...LIVE2D_EXPERIMENTAL_MOTION_LABELS]);
  assert.equal(defaultRealRowIntakeRequestPacket.experimental_motion_labels_executable, false);
  assertSafe(JSON.stringify(defaultRealRowIntakeRequestPacket));
  assertNoModelPathLeak(JSON.stringify(defaultRealRowIntakeRequestPacket));

  const unsafeRealRowIntakeRequestPacket = createMotionDatasetRealRowIntakeRequestPacketSummary({
    requested_file_format: "xlsx",
    expected_row_count: 12,
    checked_row_count: 9,
    raw_dataset_row_body: "private-row",
    raw_cue_payload: "private-cue",
    raw_renderer_payload: "private-renderer",
    raw_model_path: "private-model",
    raw_motion_path: "private-motion",
    endpoint_value: "private-network",
    token_value: "private-credential",
    secret_value: "private-credential",
    private_local_path: "private-local",
    candidate_payload: "private-candidate",
    world_command: "private-world",
    obs_command: "private-obs",
    game_input: "private-game",
    os_command: "private-os",
    memory_commit: "private-memory",
    relationship_commit: "private-relationship",
    raw_process_output: "private-process",
    raw_stack_trace: "private-stack",
    owner_private_note: "private-owner",
    raw_k_memo_text: "private-k",
    motion_dataset_executable: true,
    motion_execution_enabled: true,
    real_evidence_collection_started: true,
    real_probe_started: true,
    live_probe_started: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    renderer_ready: true,
    model_loaded: true,
    scene_loaded: true,
    browser_cue_delivery_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    trusted_loader_allowlist_enabled: true,
    go_nogo_status: "go",
    blocker_resolved: true,
  });
  assert.equal(unsafeRealRowIntakeRequestPacket.checked_row_count, 0);
  assert.equal(unsafeRealRowIntakeRequestPacket.real_row_data_present, false);
  assert.equal(unsafeRealRowIntakeRequestPacket.motion_dataset_executable, false);
  assert.equal(unsafeRealRowIntakeRequestPacket.requested_file_format_status, "unsupported_format_rejected");
  assert.equal(unsafeRealRowIntakeRequestPacket.owner_confirmation_confirmed, false);
  assert.equal(unsafeRealRowIntakeRequestPacket.renderer_ready, false);
  assert.equal(unsafeRealRowIntakeRequestPacket.go_nogo_status, "no_go");
  assert.equal(unsafeRealRowIntakeRequestPacket.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_unsafe_material"), true);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_real_row_or_count_attempt"), true);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_motion_execution"), true);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_real_collection_or_probe"), true);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_owner_confirmation"), true);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_readiness_claim"), true);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_trusted_loader_request"), true);
  assert.equal(unsafeRealRowIntakeRequestPacket.rejection_reasons.includes("real_row_intake_request_packet_rejected_unsupported_file_format"), true);
  assert.equal(JSON.stringify(unsafeRealRowIntakeRequestPacket).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeRealRowIntakeRequestPacket).includes("private-network"), false);
  assertSafe(JSON.stringify(unsafeRealRowIntakeRequestPacket));
  assertNoModelPathLeak(JSON.stringify(unsafeRealRowIntakeRequestPacket));

  const defaultRealRowIntakeDryRunValidator = createMotionDatasetRealRowIntakeDryRunValidatorSummary();
  assert.equal(defaultRealRowIntakeDryRunValidator.schema, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA);
  assert.equal(defaultRealRowIntakeDryRunValidator.motion_dataset_real_row_intake_dry_run_validator_status, "planning_only_blocked");
  assert.equal(defaultRealRowIntakeDryRunValidator.planning_only_boundary, true);
  assert.equal(defaultRealRowIntakeDryRunValidator.dry_run_only_boundary, true);
  assert.equal(defaultRealRowIntakeDryRunValidator.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRealRowIntakeDryRunValidator.real_row_data_present, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.checked_row_count, 0);
  assert.equal(defaultRealRowIntakeDryRunValidator.dry_run_validation_candidate, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.motion_dataset_executable, false);
  assert.deepEqual(defaultRealRowIntakeDryRunValidator.accepted_request_fixture_cases, [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_ACCEPTED_REQUEST_FIXTURE_CASES]);
  assert.equal(defaultRealRowIntakeDryRunValidator.rejected_request_fixture_cases.length, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES.length);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES.includes("raw_dataset_row_body_rejected"), true);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES.includes("token_value_rejected"), true);
  assert.equal(defaultRealRowIntakeDryRunValidator.rejected_request_fixture_cases.includes("unsafe_dataset_row_body_rejected"), true);
  assert.equal(defaultRealRowIntakeDryRunValidator.rejected_request_fixture_cases.includes("credential_value_rejected"), true);
  assert.equal(defaultRealRowIntakeDryRunValidator.request_packet_ref_required, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA);
  assert.equal(defaultRealRowIntakeDryRunValidator.row_schema_ref_required, LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA);
  assert.equal(defaultRealRowIntakeDryRunValidator.synthetic_fixture_pack_ref_required, LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA);
  assert.equal(defaultRealRowIntakeDryRunValidator.owner_confirmation_required, true);
  assert.equal(defaultRealRowIntakeDryRunValidator.owner_confirmation_created, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.owner_confirmation_confirmed, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.runtime_readiness_claimed, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.production_readiness_claimed, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.renderer_ready, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.model_loaded, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.scene_loaded, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.browser_cue_delivery_ready, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.priority1_status, "BLOCKED");
  assert.equal(defaultRealRowIntakeDryRunValidator.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.go_nogo_status, "no_go");
  assert.equal(defaultRealRowIntakeDryRunValidator.go_candidate, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.blocker_resolved, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.request_metadata_validation_only, true);
  assert.equal(defaultRealRowIntakeDryRunValidator.real_row_body_read, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.actual_data_validation_started, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.row_pass_fail_over_real_data, false);
  assert.equal(defaultRealRowIntakeDryRunValidator.request_packet_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeDryRunValidator.row_schema_preflight_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeDryRunValidator.synthetic_fixture_pack_status, "synthetic_only_preserved");
  assert.deepEqual(defaultRealRowIntakeDryRunValidator.allowed_requested_file_formats, [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS]);
  assert.deepEqual(defaultRealRowIntakeDryRunValidator.renderer_ready_dependencies, Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])));
  assertSafe(JSON.stringify(defaultRealRowIntakeDryRunValidator));
  assertNoModelPathLeak(JSON.stringify(defaultRealRowIntakeDryRunValidator));

  const unsafeRealRowIntakeDryRunValidator = createMotionDatasetRealRowIntakeDryRunValidatorSummary({
    requested_file_format: "xlsx",
    checked_row_count: 3,
    raw_dataset_row_body: "private-row",
    raw_cue_payload: "private-cue",
    raw_renderer_payload: "private-renderer",
    raw_model_path: "private-model",
    raw_motion_path: "private-motion",
    endpoint_value: "private-network",
    token_value: "private-credential",
    secret_value: "private-credential",
    private_local_path: "private-local",
    world_command: "private-world",
    obs_command: "private-obs",
    game_input: "private-game",
    os_command: "private-os",
    memory_commit: "private-memory",
    relationship_commit: "private-relationship",
    motion_dataset_executable: true,
    motion_execution_enabled: true,
    actual_data_validation_started: true,
    row_pass_fail_over_real_data: true,
    real_evidence_collection_started: true,
    real_probe_started: true,
    live_probe_started: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    renderer_ready: true,
    model_loaded: true,
    scene_loaded: true,
    browser_cue_delivery_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    trustedLoaderAllowlistEnabled: true,
    loader_trusted: true,
    go_nogo_status: "go",
    go_candidate: true,
    blocker_resolved: true,
  });
  assert.equal(unsafeRealRowIntakeDryRunValidator.checked_row_count, 0);
  assert.equal(unsafeRealRowIntakeDryRunValidator.real_row_data_present, false);
  assert.equal(unsafeRealRowIntakeDryRunValidator.motion_dataset_executable, false);
  assert.equal(unsafeRealRowIntakeDryRunValidator.real_row_body_read, false);
  assert.equal(unsafeRealRowIntakeDryRunValidator.actual_data_validation_started, false);
  assert.equal(unsafeRealRowIntakeDryRunValidator.row_pass_fail_over_real_data, false);
  assert.equal(unsafeRealRowIntakeDryRunValidator.requested_file_format_status, "unsupported_format_rejected");
  assert.equal(unsafeRealRowIntakeDryRunValidator.owner_confirmation_confirmed, false);
  assert.equal(unsafeRealRowIntakeDryRunValidator.renderer_ready, false);
  assert.equal(unsafeRealRowIntakeDryRunValidator.go_nogo_status, "no_go");
  assert.equal(unsafeRealRowIntakeDryRunValidator.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_unsafe_material"), true);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_real_row_or_count_attempt"), true);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_motion_execution"), true);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_real_collection_or_probe"), true);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_owner_confirmation"), true);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_readiness_claim"), true);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_trusted_loader_request"), true);
  assert.equal(unsafeRealRowIntakeDryRunValidator.rejection_reasons.includes("real_row_intake_dry_run_validator_rejected_unsupported_file_format"), true);
  assert.equal(JSON.stringify(unsafeRealRowIntakeDryRunValidator).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeRealRowIntakeDryRunValidator).includes("private-network"), false);
  assertSafe(JSON.stringify(unsafeRealRowIntakeDryRunValidator));
  assertNoModelPathLeak(JSON.stringify(unsafeRealRowIntakeDryRunValidator));

  const defaultRealRowIntakeQuarantineEnvelope = createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary();
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.schema, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.motion_dataset_real_row_intake_quarantine_envelope_status, "planning_only_blocked");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.planning_only_boundary, true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_only_boundary, true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.metadata_only_boundary, true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.no_row_body_read_boundary, true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.real_row_data_present, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.checked_row_count, 0);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_candidate_status, "pending_metadata_only");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_file_ref_status, "missing_or_pending");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_source_hash_status, "missing_or_pending");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_declared_row_count_status, "missing_or_pending_not_counted");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_schema_version_status, "missing_or_pending");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_split_plan_status, "missing_or_pending");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_owner_confirmation_required, true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_owner_confirmation_confirmed, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_audit_metadata_status, "missing_or_pending");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_redaction_policy_status, "missing_or_pending");
  assert.deepEqual(defaultRealRowIntakeQuarantineEnvelope.required_quarantine_metadata, [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA]);
  assert.deepEqual(defaultRealRowIntakeQuarantineEnvelope.allowed_file_format_labels, [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS]);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.allowed_file_format_labels.includes("jsonl"), true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.allowed_file_format_labels.includes("csv"), true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.allowed_file_format_labels.length, 2);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_rejected_fields.length, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS.length);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS.includes("raw_dataset_row_body"), true);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS.includes("actual_file_content"), true);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS.includes("actual_file_path_value"), true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_rejected_fields.includes("unsafe_dataset_row_body"), true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_rejected_fields.includes("actual_file_content"), true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.quarantine_rejected_fields.includes("actual_file_location_value"), true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.declared_row_count_records_rows, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.file_content_accepted, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.row_body_read, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.request_packet_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.dry_run_validator_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.row_schema_preflight_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.synthetic_fixture_pack_status, "synthetic_only_preserved");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.request_packet_ref_required, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.dry_run_validator_ref_required, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.row_schema_ref_required, LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.synthetic_fixture_pack_ref_required, LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.motion_dataset_executable, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.motion_dataset_ready_candidate, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.runtime_readiness_claimed, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.production_readiness_claimed, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.renderer_ready, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.priority1_status, "BLOCKED");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.owner_confirmation_required, true);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.owner_confirmation_confirmed, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.go_nogo_status, "no_go");
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.go_candidate, false);
  assert.equal(defaultRealRowIntakeQuarantineEnvelope.blocker_resolved, false);
  assertSafe(JSON.stringify(defaultRealRowIntakeQuarantineEnvelope));
  assertNoModelPathLeak(JSON.stringify(defaultRealRowIntakeQuarantineEnvelope));

  const unsafeRealRowIntakeQuarantineEnvelope = createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary({
    file_format: "xlsx",
    declared_row_count: 12,
    checked_row_count: 4,
    raw_dataset_row_body: "private-row",
    actual_file_content: "private-file",
    actual_file_path_value: "private-location",
    raw_cue_payload: "private-cue",
    raw_renderer_payload: "private-renderer",
    raw_model_path: "private-model",
    raw_motion_path: "private-motion",
    endpoint_value: "private-network",
    token_value: "private-credential",
    secret_value: "private-credential",
    private_local_path: "private-local",
    candidate_payload: "private-candidate",
    world_command: "private-world",
    obs_command: "private-obs",
    game_input: "private-game",
    os_command: "private-os",
    memory_commit: "private-memory",
    relationship_commit: "private-relationship",
    raw_process_output: "private-process",
    raw_stack_trace: "private-stack",
    owner_private_note: "private-owner",
    raw_k_memo_text: "private-k",
    file_content_read: true,
    row_body_read: true,
    motion_dataset_executable: true,
    motion_execution_enabled: true,
    actual_data_validation_started: true,
    row_pass_fail_over_real_data: true,
    real_evidence_collection_started: true,
    real_probe_started: true,
    live_probe_started: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    renderer_ready: true,
    model_loaded: true,
    scene_loaded: true,
    browser_cue_delivery_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    trusted_loader_allowlist_enabled: true,
    go_nogo_status: "go",
    go_candidate: true,
    blocker_resolved: true,
  });
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.checked_row_count, 0);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.real_row_data_present, false);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.declared_row_count_records_rows, false);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.file_content_accepted, false);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.row_body_read, false);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.motion_dataset_executable, false);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.requested_file_format_status, "unsupported_format_rejected");
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.owner_confirmation_confirmed, false);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.renderer_ready, false);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.go_nogo_status, "no_go");
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_unsafe_material"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_real_row_or_count_attempt"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_file_read_attempt"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_motion_execution"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_real_collection_or_probe"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_owner_confirmation"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_readiness_claim"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_trusted_loader_request"), true);
  assert.equal(unsafeRealRowIntakeQuarantineEnvelope.rejection_reasons.includes("real_row_intake_quarantine_envelope_rejected_unsupported_file_format"), true);
  assert.equal(JSON.stringify(unsafeRealRowIntakeQuarantineEnvelope).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeRealRowIntakeQuarantineEnvelope).includes("private-file"), false);
  assertSafe(JSON.stringify(unsafeRealRowIntakeQuarantineEnvelope));
  assertNoModelPathLeak(JSON.stringify(unsafeRealRowIntakeQuarantineEnvelope));

  const defaultRealRowIntakeOwnerHandoffPacket = createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary();
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.schema, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.motion_dataset_real_row_intake_owner_handoff_packet_status, "planning_only_blocked");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.planning_only_boundary, true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.handoff_only_boundary, true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.no_owner_confirmation_created_boundary, true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.no_owner_confirmation_confirmed_boundary, true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.no_row_body_read_boundary, true);
  assert.deepEqual(defaultRealRowIntakeOwnerHandoffPacket.required_owner_review_sections, [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_REVIEW_SECTIONS]);
  assert.deepEqual(defaultRealRowIntakeOwnerHandoffPacket.required_owner_confirmation_scopes, [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_CONFIRMATION_SCOPES]);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.required_owner_review_sections.includes("quarantine_envelope"), true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.required_owner_confirmation_scopes.includes("motion_dataset_real_row_intake"), true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.owner_confirmation_required, true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.owner_confirmation_confirmed, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.owner_confirmation_created, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.owner_confirmation_status, "pending");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.real_row_data_present, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.checked_row_count, 0);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.motion_dataset_executable, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.runtime_readiness_claimed, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.production_readiness_claimed, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.priority1_status, "BLOCKED");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.go_nogo_status, "no_go");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.blocker_resolved, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.owner_handoff_is_owner_confirmation, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.owner_handoff_approves_ingestion, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.owner_handoff_reads_rows, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.owner_handoff_ingests_rows, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.row_body_read, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.file_content_accepted, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.request_packet_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.dry_run_validator_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.quarantine_envelope_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.row_schema_preflight_status, "planning_only_preserved");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.synthetic_fixture_pack_status, "synthetic_only_preserved");
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.quarantine_envelope_ref_required, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA);
  assert.deepEqual(defaultRealRowIntakeOwnerHandoffPacket.runtime_supported_motion_styles, [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES]);
  assert.deepEqual(defaultRealRowIntakeOwnerHandoffPacket.experimental_motion_labels, [...LIVE2D_EXPERIMENTAL_MOTION_LABELS]);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.experimental_motion_labels_executable, false);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.rejected_owner_handoff_fields.length, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS.length);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS.includes("raw_owner_confirmation_note"), true);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS.includes("actual_file_path_value"), true);
  assert.equal(LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS.includes("actual_file_content"), true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.rejected_owner_handoff_fields.includes("unsafe_owner_confirmation_note"), true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.rejected_owner_handoff_fields.includes("actual_file_location_value"), true);
  assert.equal(defaultRealRowIntakeOwnerHandoffPacket.rejected_owner_handoff_fields.includes("actual_file_content"), true);
  assertSafe(JSON.stringify(defaultRealRowIntakeOwnerHandoffPacket));
  assertNoModelPathLeak(JSON.stringify(defaultRealRowIntakeOwnerHandoffPacket));

  const unsafeRealRowIntakeOwnerHandoffPacket = createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary({
    checked_row_count: 5,
    raw_dataset_row_body: "private-row",
    raw_owner_confirmation_note: "private-owner-confirmation",
    owner_private_note: "private-owner",
    actual_file_content: "private-file",
    actual_file_path_value: "private-location",
    raw_cue_payload: "private-cue",
    raw_renderer_payload: "private-renderer",
    raw_model_path: "private-model",
    raw_motion_path: "private-motion",
    endpoint_value: "private-network",
    token_value: "private-credential",
    secret_value: "private-credential",
    private_local_path: "private-local",
    world_command: "private-world",
    obs_command: "private-obs",
    game_input: "private-game",
    os_command: "private-os",
    memory_commit: "private-memory",
    relationship_commit: "private-relationship",
    file_content_read: true,
    row_body_read: true,
    motion_dataset_executable: true,
    motion_execution_enabled: true,
    actual_data_validation_started: true,
    row_pass_fail_over_real_data: true,
    real_evidence_collection_started: true,
    real_probe_started: true,
    live_probe_started: true,
    approve_ingestion: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    owner_confirmation_status: "confirmed",
    renderer_ready: true,
    model_loaded: true,
    scene_loaded: true,
    browser_cue_delivery_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    trusted_loader_allowlist_enabled: true,
    go_nogo_status: "go",
    go_candidate: true,
    blocker_resolved: true,
  });
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.checked_row_count, 0);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.real_row_data_present, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.motion_dataset_executable, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.owner_confirmation_created, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.owner_confirmation_confirmed, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.owner_confirmation_status, "pending");
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.owner_handoff_is_owner_confirmation, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.owner_handoff_approves_ingestion, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.owner_handoff_reads_rows, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.owner_handoff_ingests_rows, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.row_body_read, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.file_content_accepted, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.renderer_ready, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.go_nogo_status, "no_go");
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_unsafe_material"), true);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_real_row_or_count_attempt"), true);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_file_read_attempt"), true);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_motion_execution"), true);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_real_collection_or_probe"), true);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_owner_confirmation"), true);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_readiness_claim"), true);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeRealRowIntakeOwnerHandoffPacket.rejection_reasons.includes("real_row_intake_owner_handoff_packet_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeRealRowIntakeOwnerHandoffPacket).includes("private-owner-confirmation"), false);
  assert.equal(JSON.stringify(unsafeRealRowIntakeOwnerHandoffPacket).includes("private-file"), false);
  assertSafe(JSON.stringify(unsafeRealRowIntakeOwnerHandoffPacket));
  assertNoModelPathLeak(JSON.stringify(unsafeRealRowIntakeOwnerHandoffPacket));

  const defaultRealRowAuditManifest = createMotionDatasetRealRowAuditManifestSummary();
  assert.equal(defaultRealRowAuditManifest.schema, LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA);
  assert.equal(defaultRealRowAuditManifest.motion_dataset_real_row_audit_manifest_status, "planning_only_blocked");
  assert.equal(defaultRealRowAuditManifest.planning_only_boundary, true);
  assert.equal(defaultRealRowAuditManifest.audit_manifest_only_boundary, true);
  assert.equal(defaultRealRowAuditManifest.no_real_audit_completed_boundary, true);
  assert.equal(defaultRealRowAuditManifest.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRealRowAuditManifest.no_row_body_read_boundary, true);
  assert.equal(defaultRealRowAuditManifest.audit_manifest_is_actual_audit_completion, false);
  assert.equal(defaultRealRowAuditManifest.real_row_data_present, false);
  assert.equal(defaultRealRowAuditManifest.checked_row_count, 0);
  assert.equal(defaultRealRowAuditManifest.motion_dataset_executable, false);
  assert.equal(defaultRealRowAuditManifest.motion_dataset_ready_candidate, false);
  assert.equal(defaultRealRowAuditManifest.runtime_readiness_claimed, false);
  assert.equal(defaultRealRowAuditManifest.production_readiness_claimed, false);
  assert.equal(defaultRealRowAuditManifest.renderer_ready, false);
  assert.equal(defaultRealRowAuditManifest.model_loaded, false);
  assert.equal(defaultRealRowAuditManifest.scene_loaded, false);
  assert.equal(defaultRealRowAuditManifest.browser_cue_delivery_ready, false);
  assert.equal(defaultRealRowAuditManifest.priority1_status, "BLOCKED");
  assert.equal(defaultRealRowAuditManifest.owner_confirmation_required, true);
  assert.equal(defaultRealRowAuditManifest.owner_confirmation_created, false);
  assert.equal(defaultRealRowAuditManifest.owner_confirmation_confirmed, false);
  assert.equal(defaultRealRowAuditManifest.go_nogo_status, "no_go");
  assert.equal(defaultRealRowAuditManifest.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultRealRowAuditManifest.audit_run_metadata_required, [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS]);
  assert.deepEqual(defaultRealRowAuditManifest.row_level_audit_fields_required, [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS]);
  assert.deepEqual(defaultRealRowAuditManifest.dataset_level_summary_fields_required, [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS]);
  assert.equal(defaultRealRowAuditManifest.row_uniqueness_policy_required, "row_id_unique_required_before_future_real_audit");
  assert.equal(defaultRealRowAuditManifest.source_hash_policy_required, "source_hash_required_before_future_real_audit");
  assert.equal(defaultRealRowAuditManifest.split_policy_required, "dataset_split_required_before_future_real_audit");
  assert.deepEqual(defaultRealRowAuditManifest.renderer_ready_dependency_policy_required, [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS]);
  assert.deepEqual(defaultRealRowAuditManifest.motion_allowlist_policy_required, [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES]);
  assert.deepEqual(defaultRealRowAuditManifest.ux_accessibility_policy_required, [...LIVE2D_MOTION_DATASET_UX_AUDIT_AXES]);
  assert.equal(defaultRealRowAuditManifest.redaction_policy_required, "safe_summary_only_no_row_body_no_private_material");
  assert.equal(defaultRealRowAuditManifest.priority1_boundary_policy_required, "priority1_remains_BLOCKED_until_real_resident_fresh_evidence");
  assertSafe(JSON.stringify(defaultRealRowAuditManifest));
  assertNoModelPathLeak(JSON.stringify(defaultRealRowAuditManifest));

  const unsafeRealRowAuditManifest = createMotionDatasetRealRowAuditManifestSummary({
    checked_row_count: 3,
    raw_dataset_row_body: "private-row",
    actual_file_content: "private-file",
    row_body_read: true,
    motion_dataset_executable: true,
    renderer_ready: true,
    owner_confirmation_confirmed: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeRealRowAuditManifest.real_row_data_present, false);
  assert.equal(unsafeRealRowAuditManifest.checked_row_count, 0);
  assert.equal(unsafeRealRowAuditManifest.row_body_read, false);
  assert.equal(unsafeRealRowAuditManifest.file_content_accepted, false);
  assert.equal(unsafeRealRowAuditManifest.motion_dataset_executable, false);
  assert.equal(unsafeRealRowAuditManifest.renderer_ready, false);
  assert.equal(unsafeRealRowAuditManifest.owner_confirmation_confirmed, false);
  assert.equal(unsafeRealRowAuditManifest.go_nogo_status, "no_go");

  const defaultOwnerSubmissionPacket = createMotionDatasetOwnerRowDataSubmissionPacketSummary();
  assert.equal(defaultOwnerSubmissionPacket.schema, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA);
  assert.equal(defaultOwnerSubmissionPacket.motion_dataset_owner_row_data_submission_packet_status, "planning_only_blocked");
  assert.equal(defaultOwnerSubmissionPacket.planning_only_boundary, true);
  assert.equal(defaultOwnerSubmissionPacket.owner_submission_packet_only_boundary, true);
  assert.equal(defaultOwnerSubmissionPacket.no_owner_confirmation_created_boundary, true);
  assert.equal(defaultOwnerSubmissionPacket.no_owner_confirmation_confirmed_boundary, true);
  assert.equal(defaultOwnerSubmissionPacket.no_actual_row_content_boundary, true);
  assert.equal(defaultOwnerSubmissionPacket.no_real_row_ingestion_boundary, true);
  assert.equal(defaultOwnerSubmissionPacket.no_row_body_read_boundary, true);
  assert.equal(defaultOwnerSubmissionPacket.no_motion_execution_boundary, true);
  assert.equal(defaultOwnerSubmissionPacket.owner_submission_packet_only, true);
  assert.equal(defaultOwnerSubmissionPacket.actual_row_content_accepted, false);
  assert.equal(defaultOwnerSubmissionPacket.actual_ingestion_allowed, false);
  assert.equal(defaultOwnerSubmissionPacket.real_row_data_present, false);
  assert.equal(defaultOwnerSubmissionPacket.checked_row_count, 0);
  assert.equal(defaultOwnerSubmissionPacket.row_body_read, false);
  assert.equal(defaultOwnerSubmissionPacket.motion_dataset_executable, false);
  assert.equal(defaultOwnerSubmissionPacket.runtime_readiness_claimed, false);
  assert.equal(defaultOwnerSubmissionPacket.production_readiness_claimed, false);
  assert.equal(defaultOwnerSubmissionPacket.renderer_ready, false);
  assert.equal(defaultOwnerSubmissionPacket.priority1_status, "BLOCKED");
  assert.equal(defaultOwnerSubmissionPacket.go_nogo_status, "no_go");
  assert.equal(defaultOwnerSubmissionPacket.go_candidate, false);
  assert.equal(defaultOwnerSubmissionPacket.blocker_resolved, false);
  assert.equal(defaultOwnerSubmissionPacket.owner_confirmation_required, true);
  assert.equal(defaultOwnerSubmissionPacket.owner_confirmation_created, false);
  assert.equal(defaultOwnerSubmissionPacket.owner_confirmation_confirmed, false);
  assert.equal(defaultOwnerSubmissionPacket.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultOwnerSubmissionPacket.required_owner_submission_items, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_ITEMS]);
  assert.deepEqual(defaultOwnerSubmissionPacket.required_owner_confirmation_scopes, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_CONFIRMATION_SCOPES]);
  assert.equal(defaultOwnerSubmissionPacket.required_file_shape.includes("one_row_id_per_record"), true);
  assert.equal(defaultOwnerSubmissionPacket.required_file_shape.includes("cue_material_excluded"), true);
  assert.equal(defaultOwnerSubmissionPacket.required_file_shape.includes("credential_material_excluded"), true);
  assert.equal(defaultOwnerSubmissionPacket.rejected_submission_field_categories.includes("dataset_row_material"), true);
  assert.equal(defaultOwnerSubmissionPacket.rejected_submission_field_categories.includes("credential_material"), true);
  assert.equal(LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_FILE_SHAPE.includes("no_raw_cue_payload"), true);
  assert.equal(LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS.includes("raw_dataset_row_body"), true);
  assert.equal(defaultOwnerSubmissionPacket.safe_next_action, "owner_may_prepare_metadata_only_future_submission_without_row_content");
  assert.equal(defaultOwnerSubmissionPacket.boundary_policy.no_actual_ingestion_allowed, true);
  assert.equal(defaultOwnerSubmissionPacket.boundary_policy.no_dataset_row_body_public, true);
  assertSafe(JSON.stringify(defaultOwnerSubmissionPacket));
  assertNoModelPathLeak(JSON.stringify(defaultOwnerSubmissionPacket));

  const unsafeOwnerSubmissionPacket = createMotionDatasetOwnerRowDataSubmissionPacketSummary({
    actual_row_content_accepted: true,
    actual_ingestion_allowed: true,
    raw_dataset_row_body: "private-row",
    actual_file_path_value: "private-path",
    actual_file_content: "private-content",
    raw_cue_payload: "private-cue",
    endpoint_value: "private-endpoint",
    token_value: "private-token",
    owner_private_note: "private-note",
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    checked_row_count: 3,
    real_row_data_present: true,
    row_body_read: true,
    file_content_read: true,
    motion_dataset_executable: true,
    renderer_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    go_candidate: true,
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeOwnerSubmissionPacket.actual_row_content_accepted, false);
  assert.equal(unsafeOwnerSubmissionPacket.actual_ingestion_allowed, false);
  assert.equal(unsafeOwnerSubmissionPacket.owner_confirmation_created, false);
  assert.equal(unsafeOwnerSubmissionPacket.owner_confirmation_confirmed, false);
  assert.equal(unsafeOwnerSubmissionPacket.real_row_data_present, false);
  assert.equal(unsafeOwnerSubmissionPacket.checked_row_count, 0);
  assert.equal(unsafeOwnerSubmissionPacket.row_body_read, false);
  assert.equal(unsafeOwnerSubmissionPacket.motion_dataset_executable, false);
  assert.equal(unsafeOwnerSubmissionPacket.runtime_readiness_claimed, false);
  assert.equal(unsafeOwnerSubmissionPacket.production_readiness_claimed, false);
  assert.equal(unsafeOwnerSubmissionPacket.priority1_status, "BLOCKED");
  assert.equal(unsafeOwnerSubmissionPacket.go_nogo_status, "no_go");
  assert.equal(unsafeOwnerSubmissionPacket.go_candidate, false);
  assert.equal(unsafeOwnerSubmissionPacket.blocker_resolved, false);
  assert.equal(unsafeOwnerSubmissionPacket.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_unsafe_material"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_actual_row_content"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_actual_ingestion_request"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_owner_confirmation"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_row_body_or_file_read"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_motion_execution"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_readiness_claim"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_priority1_resolution"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeOwnerSubmissionPacket.blocked_reasons.includes("owner_row_data_submission_packet_rejected_trusted_loader_request"), true);
  assert.equal(unsafeOwnerSubmissionPacket.detected_rejected_sensitive_material_labels.includes("dataset_row_material"), true);
  assert.equal(unsafeOwnerSubmissionPacket.detected_rejected_sensitive_material_labels.includes("cue_material"), true);
  assert.equal(JSON.stringify(unsafeOwnerSubmissionPacket).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeOwnerSubmissionPacket).includes("private-token"), false);
  assertSafe(JSON.stringify(unsafeOwnerSubmissionPacket));
  assertNoModelPathLeak(JSON.stringify(unsafeOwnerSubmissionPacket));

  const defaultOwnerSubmissionReceiptStub = createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary();
  assert.equal(defaultOwnerSubmissionReceiptStub.schema, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA);
  assert.equal(defaultOwnerSubmissionReceiptStub.motion_dataset_owner_row_data_submission_receipt_stub_status, "planning_only_blocked");
  assert.equal(defaultOwnerSubmissionReceiptStub.planning_only_boundary, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.receipt_stub_only_boundary, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.no_owner_submission_accepted_boundary, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.no_actual_row_content_boundary, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.no_real_row_ingestion_boundary, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.no_row_body_read_boundary, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.owner_submission_received, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.owner_submission_accepted, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.actual_row_content_accepted, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.actual_ingestion_allowed, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.real_row_data_present, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.checked_row_count, 0);
  assert.equal(defaultOwnerSubmissionReceiptStub.motion_dataset_executable, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.runtime_readiness_claimed, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.production_readiness_claimed, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.renderer_ready, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.priority1_status, "BLOCKED");
  assert.equal(defaultOwnerSubmissionReceiptStub.go_nogo_status, "no_go");
  assert.equal(defaultOwnerSubmissionReceiptStub.go_candidate, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.blocker_resolved, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.owner_confirmation_required, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.owner_confirmation_created, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.owner_confirmation_confirmed, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultOwnerSubmissionReceiptStub.decision_capsule_machine_source_preserved, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.pr_body_human_summary_only, true);
  assert.deepEqual(defaultOwnerSubmissionReceiptStub.required_receipt_metadata_labels, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_METADATA_LABELS]);
  assert.deepEqual(defaultOwnerSubmissionReceiptStub.required_future_submission_refs, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_FUTURE_REFS]);
  assert.equal(defaultOwnerSubmissionReceiptStub.required_receipt_metadata_labels.includes("submission_expected_source_hash"), true);
  assert.equal(defaultOwnerSubmissionReceiptStub.required_future_submission_refs.includes("row_file_checksum_preflight_manifest_ref"), true);
  assert.equal(defaultOwnerSubmissionReceiptStub.safe_next_action, "prepare_metadata_labels_only_for_future_owner_confirmed_submission_without_row_content");
  assert.equal(defaultOwnerSubmissionReceiptStub.boundary_policy.no_owner_submission_accepted, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.boundary_policy.no_actual_ingestion_allowed, true);
  assert.equal(defaultOwnerSubmissionReceiptStub.boundary_policy.no_dataset_row_body_public, true);
  assertSafe(JSON.stringify(defaultOwnerSubmissionReceiptStub));
  assertNoModelPathLeak(JSON.stringify(defaultOwnerSubmissionReceiptStub));

  const unsafeOwnerSubmissionReceiptStub = createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary({
    owner_submission_received: true,
    owner_submission_accepted: true,
    actual_row_content_accepted: true,
    actual_ingestion_allowed: true,
    raw_dataset_row_body: "private-row",
    actual_file_path_value: "private-path",
    actual_file_content: "private-content",
    token_value: "private-token",
    owner_private_note: "private-note",
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    checked_row_count: 4,
    real_row_data_present: true,
    row_body_read: true,
    motion_dataset_executable: true,
    renderer_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeOwnerSubmissionReceiptStub.owner_submission_received, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.owner_submission_accepted, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.actual_row_content_accepted, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.actual_ingestion_allowed, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.owner_confirmation_confirmed, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.real_row_data_present, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.checked_row_count, 0);
  assert.equal(unsafeOwnerSubmissionReceiptStub.row_body_read, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.motion_dataset_executable, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.renderer_ready, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.runtime_readiness_claimed, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.production_readiness_claimed, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.priority1_status, "BLOCKED");
  assert.equal(unsafeOwnerSubmissionReceiptStub.go_nogo_status, "no_go");
  assert.equal(unsafeOwnerSubmissionReceiptStub.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_submission_received"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_submission_acceptance"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_actual_row_content"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_actual_ingestion_request"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_owner_confirmation"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_row_body_or_file_read"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_motion_execution"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_readiness_claim"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.blocked_reasons.includes("owner_row_data_submission_receipt_stub_rejected_trusted_loader_request"), true);
  assert.equal(unsafeOwnerSubmissionReceiptStub.detected_rejected_sensitive_material_labels.includes("dataset_row_material"), true);
  assert.equal(JSON.stringify(unsafeOwnerSubmissionReceiptStub).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeOwnerSubmissionReceiptStub).includes("private-token"), false);
  assertSafe(JSON.stringify(unsafeOwnerSubmissionReceiptStub));
  assertNoModelPathLeak(JSON.stringify(unsafeOwnerSubmissionReceiptStub));

  const defaultMetadataValidatorStub = createMotionDatasetOwnerRowDataMetadataValidatorStubSummary();
  assert.equal(defaultMetadataValidatorStub.schema, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA);
  assert.equal(defaultMetadataValidatorStub.motion_dataset_owner_row_data_metadata_validator_stub_status, "planning_only_blocked");
  assert.equal(defaultMetadataValidatorStub.planning_only_boundary, true);
  assert.equal(defaultMetadataValidatorStub.metadata_validator_stub_only_boundary, true);
  assert.equal(defaultMetadataValidatorStub.metadata_only_boundary, true);
  assert.equal(defaultMetadataValidatorStub.no_submission_accepted_boundary, true);
  assert.equal(defaultMetadataValidatorStub.no_actual_file_read_boundary, true);
  assert.equal(defaultMetadataValidatorStub.no_actual_hash_calculation_boundary, true);
  assert.equal(defaultMetadataValidatorStub.no_actual_row_content_boundary, true);
  assert.equal(defaultMetadataValidatorStub.no_real_row_ingestion_boundary, true);
  assert.equal(defaultMetadataValidatorStub.no_row_body_read_boundary, true);
  assert.equal(defaultMetadataValidatorStub.metadata_validation_candidate, false);
  assert.equal(defaultMetadataValidatorStub.owner_submission_received, false);
  assert.equal(defaultMetadataValidatorStub.owner_submission_accepted, false);
  assert.equal(defaultMetadataValidatorStub.actual_file_read, false);
  assert.equal(defaultMetadataValidatorStub.actual_hash_calculated, false);
  assert.equal(defaultMetadataValidatorStub.actual_file_reference_accepted, false);
  assert.equal(defaultMetadataValidatorStub.actual_file_content_accepted, false);
  assert.equal(defaultMetadataValidatorStub.actual_row_content_accepted, false);
  assert.equal(defaultMetadataValidatorStub.real_row_data_present, false);
  assert.equal(defaultMetadataValidatorStub.checked_row_count, 0);
  assert.equal(defaultMetadataValidatorStub.actual_ingestion_allowed, false);
  assert.equal(defaultMetadataValidatorStub.motion_dataset_executable, false);
  assert.equal(defaultMetadataValidatorStub.runtime_readiness_claimed, false);
  assert.equal(defaultMetadataValidatorStub.production_readiness_claimed, false);
  assert.equal(defaultMetadataValidatorStub.priority1_status, "BLOCKED");
  assert.equal(defaultMetadataValidatorStub.go_nogo_status, "no_go");
  assert.equal(defaultMetadataValidatorStub.owner_confirmation_required, true);
  assert.equal(defaultMetadataValidatorStub.owner_confirmation_confirmed, false);
  assert.equal(defaultMetadataValidatorStub.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultMetadataValidatorStub.decision_capsule_machine_source_preserved, true);
  assert.equal(defaultMetadataValidatorStub.pr_body_human_summary_only, true);
  assert.deepEqual(defaultMetadataValidatorStub.required_metadata_labels, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS]);
  assert.deepEqual(defaultMetadataValidatorStub.allowed_file_format_labels, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_FILE_FORMATS]);
  assert.deepEqual(defaultMetadataValidatorStub.allowed_hash_algorithm_labels, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_HASH_ALGORITHMS]);
  assert.deepEqual(defaultMetadataValidatorStub.required_validator_rejection_reasons, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS]);
  assert.equal(defaultMetadataValidatorStub.allowed_file_format_labels.includes("jsonl"), true);
  assert.equal(defaultMetadataValidatorStub.allowed_file_format_labels.includes("csv"), true);
  assert.equal(defaultMetadataValidatorStub.allowed_hash_algorithm_labels.includes("sha256"), true);
  assert.equal(defaultMetadataValidatorStub.allowed_hash_algorithm_labels.includes("sha512"), true);
  assert.equal(defaultMetadataValidatorStub.required_validator_rejection_reasons.includes("actual_file_path_value_rejected"), true);
  assert.equal(defaultMetadataValidatorStub.required_validator_rejection_reasons.includes("owner_confirmation_claim_rejected"), true);
  assertSafe(JSON.stringify(defaultMetadataValidatorStub));
  assertNoModelPathLeak(JSON.stringify(defaultMetadataValidatorStub));

  const unsafeMetadataValidatorStub = createMotionDatasetOwnerRowDataMetadataValidatorStubSummary({
    owner_submission_received: true,
    owner_submission_accepted: true,
    actual_file_read: true,
    actual_hash_calculated: true,
    actual_file_path_value: "private-file-reference",
    actual_file_content: "private-file-content",
    raw_jsonl_body: "private-jsonl",
    raw_csv_body: "private-csv",
    raw_dataset_row_body: "private-row",
    actual_row_content_accepted: true,
    actual_ingestion_allowed: true,
    checked_row_count: 8,
    real_row_data_present: true,
    row_body_read: true,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeMetadataValidatorStub.owner_submission_received, false);
  assert.equal(unsafeMetadataValidatorStub.owner_submission_accepted, false);
  assert.equal(unsafeMetadataValidatorStub.actual_file_read, false);
  assert.equal(unsafeMetadataValidatorStub.actual_hash_calculated, false);
  assert.equal(unsafeMetadataValidatorStub.actual_file_reference_accepted, false);
  assert.equal(unsafeMetadataValidatorStub.actual_file_content_accepted, false);
  assert.equal(unsafeMetadataValidatorStub.actual_row_content_accepted, false);
  assert.equal(unsafeMetadataValidatorStub.actual_ingestion_allowed, false);
  assert.equal(unsafeMetadataValidatorStub.checked_row_count, 0);
  assert.equal(unsafeMetadataValidatorStub.real_row_data_present, false);
  assert.equal(unsafeMetadataValidatorStub.row_body_read, false);
  assert.equal(unsafeMetadataValidatorStub.motion_dataset_executable, false);
  assert.equal(unsafeMetadataValidatorStub.runtime_readiness_claimed, false);
  assert.equal(unsafeMetadataValidatorStub.production_readiness_claimed, false);
  assert.equal(unsafeMetadataValidatorStub.owner_confirmation_confirmed, false);
  assert.equal(unsafeMetadataValidatorStub.priority1_status, "BLOCKED");
  assert.equal(unsafeMetadataValidatorStub.go_nogo_status, "no_go");
  assert.equal(unsafeMetadataValidatorStub.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_submission_received"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_submission_acceptance"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_actual_file_read"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_actual_hash_calculation"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_actual_file_reference"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_actual_file_content"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_actual_row_content"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_actual_ingestion_request"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_row_body_read"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_motion_execution"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_readiness_claim"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_owner_confirmation"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_priority1_resolution"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeMetadataValidatorStub.blocked_reasons.includes("metadata_validator_stub_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeMetadataValidatorStub).includes("private-jsonl"), false);
  assert.equal(JSON.stringify(unsafeMetadataValidatorStub).includes("private-row"), false);
  assertSafe(JSON.stringify(unsafeMetadataValidatorStub));
  assertNoModelPathLeak(JSON.stringify(unsafeMetadataValidatorStub));

  const defaultSubmissionRejectionFixturePack = createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary();
  assert.equal(defaultSubmissionRejectionFixturePack.schema, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA);
  assert.equal(defaultSubmissionRejectionFixturePack.motion_dataset_owner_row_data_submission_rejection_fixture_pack_status, "planning_only_blocked");
  assert.equal(defaultSubmissionRejectionFixturePack.planning_only_boundary, true);
  assert.equal(defaultSubmissionRejectionFixturePack.synthetic_only_boundary, true);
  assert.equal(defaultSubmissionRejectionFixturePack.rejection_fixture_pack_only_boundary, true);
  assert.equal(defaultSubmissionRejectionFixturePack.no_submission_accepted_boundary, true);
  assert.equal(defaultSubmissionRejectionFixturePack.no_actual_file_read_boundary, true);
  assert.equal(defaultSubmissionRejectionFixturePack.no_actual_row_content_boundary, true);
  assert.equal(defaultSubmissionRejectionFixturePack.no_real_row_ingestion_boundary, true);
  assert.equal(defaultSubmissionRejectionFixturePack.no_row_body_read_boundary, true);
  assert.equal(defaultSubmissionRejectionFixturePack.synthetic_only, true);
  assert.equal(defaultSubmissionRejectionFixturePack.rejection_fixture_pack_only, true);
  assert.equal(defaultSubmissionRejectionFixturePack.owner_submission_received, false);
  assert.equal(defaultSubmissionRejectionFixturePack.owner_submission_accepted, false);
  assert.equal(defaultSubmissionRejectionFixturePack.actual_file_read, false);
  assert.equal(defaultSubmissionRejectionFixturePack.actual_file_reference_accepted, false);
  assert.equal(defaultSubmissionRejectionFixturePack.actual_file_content_accepted, false);
  assert.equal(defaultSubmissionRejectionFixturePack.actual_row_content_accepted, false);
  assert.equal(defaultSubmissionRejectionFixturePack.real_row_data_present, false);
  assert.equal(defaultSubmissionRejectionFixturePack.checked_row_count, 0);
  assert.equal(defaultSubmissionRejectionFixturePack.actual_ingestion_allowed, false);
  assert.equal(defaultSubmissionRejectionFixturePack.motion_dataset_executable, false);
  assert.equal(defaultSubmissionRejectionFixturePack.runtime_readiness_claimed, false);
  assert.equal(defaultSubmissionRejectionFixturePack.production_readiness_claimed, false);
  assert.equal(defaultSubmissionRejectionFixturePack.priority1_status, "BLOCKED");
  assert.equal(defaultSubmissionRejectionFixturePack.go_nogo_status, "no_go");
  assert.equal(defaultSubmissionRejectionFixturePack.owner_confirmation_confirmed, false);
  assert.equal(defaultSubmissionRejectionFixturePack.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultSubmissionRejectionFixturePack.accepted_safe_rejection_fixture_cases, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_ACCEPTED_CASES]);
  assert.deepEqual(defaultSubmissionRejectionFixturePack.rejected_submission_attempt_cases, [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_ATTEMPT_CASES]);
  assert.equal(defaultSubmissionRejectionFixturePack.accepted_safe_rejection_fixture_cases.includes("safe_metadata_missing_source_hash_rejection"), true);
  assert.equal(LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_REJECTED_ATTEMPT_CASES.includes("raw_jsonl_body_rejected"), true);
  assert.equal(LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_REJECTED_ATTEMPT_CASES.includes("token_value_rejected"), true);
  assert.equal(defaultSubmissionRejectionFixturePack.rejected_submission_attempt_cases.includes("jsonl_body_material_rejected"), true);
  assert.equal(defaultSubmissionRejectionFixturePack.rejected_submission_attempt_cases.includes("credential_value_rejected"), true);
  assert.equal(defaultSubmissionRejectionFixturePack.rejected_submission_attempt_cases.includes("owner_confirmation_claim_rejected"), true);
  assert.equal(defaultSubmissionRejectionFixturePack.rejected_submission_attempt_cases.includes("motion_executable_claim_rejected"), true);
  assertSafe(JSON.stringify(defaultSubmissionRejectionFixturePack));
  assertNoModelPathLeak(JSON.stringify(defaultSubmissionRejectionFixturePack));

  const unsafeSubmissionRejectionFixturePack = createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary({
    owner_submission_received: true,
    owner_submission_accepted: true,
    actual_file_read: true,
    actual_file_path_value: "private-file-reference",
    actual_file_content: "private-file-content",
    raw_jsonl_body: "private-jsonl",
    raw_csv_body: "private-csv",
    raw_dataset_row_body: "private-row",
    raw_cue_payload: "private-cue",
    raw_renderer_payload: "private-renderer",
    raw_model_path: "private-model",
    raw_motion_path: "private-motion",
    endpoint_value: "private-endpoint",
    token_value: "private-token",
    secret_value: "private-secret",
    private_local_path: "private-local",
    world_command: "private-world",
    obs_command: "private-obs",
    game_input: "private-game",
    os_command: "private-os",
    memory_commit: "private-memory",
    relationship_commit: "private-relationship",
    raw_process_output: "private-process",
    raw_stack_trace: "private-stack",
    raw_owner_confirmation_note: "private-owner-confirmation",
    owner_private_note: "private-owner-note",
    actual_row_content_accepted: true,
    actual_ingestion_allowed: true,
    checked_row_count: 3,
    real_row_data_present: true,
    row_body_read: true,
    motion_dataset_executable: true,
    unsupported_motion_runtime_claim: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeSubmissionRejectionFixturePack.owner_submission_received, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.owner_submission_accepted, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.actual_file_read, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.actual_file_reference_accepted, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.actual_file_content_accepted, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.actual_row_content_accepted, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.actual_ingestion_allowed, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.checked_row_count, 0);
  assert.equal(unsafeSubmissionRejectionFixturePack.real_row_data_present, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.row_body_read, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.motion_dataset_executable, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.runtime_readiness_claimed, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.production_readiness_claimed, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.owner_confirmation_confirmed, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.priority1_status, "BLOCKED");
  assert.equal(unsafeSubmissionRejectionFixturePack.go_nogo_status, "no_go");
  assert.equal(unsafeSubmissionRejectionFixturePack.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_submission_received"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_submission_acceptance"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_actual_file_read"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_actual_file_reference"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_actual_file_content"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_actual_row_content"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_actual_ingestion_request"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_row_body_read"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_motion_execution"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_readiness_claim"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_owner_confirmation"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_priority1_resolution"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.blocked_reasons.includes("submission_rejection_fixture_pack_rejected_trusted_loader_request"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.detected_rejected_sensitive_material_labels.includes("dataset_row_material"), true);
  assert.equal(unsafeSubmissionRejectionFixturePack.detected_rejected_sensitive_material_labels.includes("unsafe_material"), true);
  assert.equal(JSON.stringify(unsafeSubmissionRejectionFixturePack).includes("private-jsonl"), false);
  assert.equal(JSON.stringify(unsafeSubmissionRejectionFixturePack).includes("private-owner-note"), false);
  assertSafe(JSON.stringify(unsafeSubmissionRejectionFixturePack));
  assertNoModelPathLeak(JSON.stringify(unsafeSubmissionRejectionFixturePack));

  const defaultActualDataTaskEntryGate = createMotionDatasetActualDataTaskEntryGateSummary();
  assert.equal(defaultActualDataTaskEntryGate.schema, LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA);
  assert.equal(defaultActualDataTaskEntryGate.motion_dataset_actual_data_task_entry_gate_status, "planning_only_blocked");
  assert.equal(defaultActualDataTaskEntryGate.entry_gate_only_boundary, true);
  assert.equal(defaultActualDataTaskEntryGate.actual_data_task_started, false);
  assert.equal(defaultActualDataTaskEntryGate.owner_submission_received, false);
  assert.equal(defaultActualDataTaskEntryGate.owner_submission_accepted, false);
  assert.equal(defaultActualDataTaskEntryGate.actual_file_read, false);
  assert.equal(defaultActualDataTaskEntryGate.actual_hash_calculated, false);
  assert.equal(defaultActualDataTaskEntryGate.actual_row_content_accepted, false);
  assert.equal(defaultActualDataTaskEntryGate.row_body_parser_enabled, false);
  assert.equal(defaultActualDataTaskEntryGate.row_body_parser_executed, false);
  assert.equal(defaultActualDataTaskEntryGate.row_body_read, false);
  assert.equal(defaultActualDataTaskEntryGate.real_row_data_present, false);
  assert.equal(defaultActualDataTaskEntryGate.checked_row_count, 0);
  assert.equal(defaultActualDataTaskEntryGate.actual_ingestion_allowed, false);
  assert.equal(defaultActualDataTaskEntryGate.motion_dataset_executable, false);
  assert.equal(defaultActualDataTaskEntryGate.runtime_readiness_claimed, false);
  assert.equal(defaultActualDataTaskEntryGate.production_readiness_claimed, false);
  assert.equal(defaultActualDataTaskEntryGate.priority1_status, "BLOCKED");
  assert.equal(defaultActualDataTaskEntryGate.owner_confirmation_confirmed, false);
  assert.equal(defaultActualDataTaskEntryGate.go_nogo_status, "no_go");
  assert.deepEqual(defaultActualDataTaskEntryGate.required_entry_prerequisites, [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES]);
  assert.deepEqual(defaultActualDataTaskEntryGate.required_blocking_conditions, [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS]);
  assert.equal(defaultActualDataTaskEntryGate.required_entry_prerequisites.includes("owner_confirmation_confirmed"), true);
  assert.equal(defaultActualDataTaskEntryGate.required_blocking_conditions.includes("missing_owner_confirmation"), true);
  assert.equal(defaultActualDataTaskEntryGate.decision_capsule_machine_source_preserved, true);
  assert.equal(defaultActualDataTaskEntryGate.pr_body_human_summary_only, true);
  assertSafe(JSON.stringify(defaultActualDataTaskEntryGate));
  assertNoModelPathLeak(JSON.stringify(defaultActualDataTaskEntryGate));

  const unsafeActualDataTaskEntryGate = createMotionDatasetActualDataTaskEntryGateSummary({
    actual_data_task_started: true,
    owner_submission_received: true,
    owner_submission_accepted: true,
    actual_file_read: true,
    actual_hash_calculated: true,
    actual_file_content: "private-file-content",
    raw_dataset_row_body: "private-row",
    actual_row_content_accepted: true,
    row_body_parser_enabled: true,
    row_body_parser_executed: true,
    row_body_read: true,
    real_row_data_present: true,
    checked_row_count: 9,
    actual_ingestion_allowed: true,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
  });
  assert.equal(unsafeActualDataTaskEntryGate.actual_data_task_started, false);
  assert.equal(unsafeActualDataTaskEntryGate.owner_submission_received, false);
  assert.equal(unsafeActualDataTaskEntryGate.owner_submission_accepted, false);
  assert.equal(unsafeActualDataTaskEntryGate.actual_file_read, false);
  assert.equal(unsafeActualDataTaskEntryGate.actual_hash_calculated, false);
  assert.equal(unsafeActualDataTaskEntryGate.actual_row_content_accepted, false);
  assert.equal(unsafeActualDataTaskEntryGate.row_body_parser_enabled, false);
  assert.equal(unsafeActualDataTaskEntryGate.row_body_parser_executed, false);
  assert.equal(unsafeActualDataTaskEntryGate.row_body_read, false);
  assert.equal(unsafeActualDataTaskEntryGate.checked_row_count, 0);
  assert.equal(unsafeActualDataTaskEntryGate.real_row_data_present, false);
  assert.equal(unsafeActualDataTaskEntryGate.actual_ingestion_allowed, false);
  assert.equal(unsafeActualDataTaskEntryGate.motion_dataset_executable, false);
  assert.equal(unsafeActualDataTaskEntryGate.runtime_readiness_claimed, false);
  assert.equal(unsafeActualDataTaskEntryGate.production_readiness_claimed, false);
  assert.equal(unsafeActualDataTaskEntryGate.owner_confirmation_confirmed, false);
  assert.equal(unsafeActualDataTaskEntryGate.priority1_status, "BLOCKED");
  assert.equal(unsafeActualDataTaskEntryGate.go_nogo_status, "no_go");
  assert.equal(unsafeActualDataTaskEntryGate.blocked_reasons.includes("actual_data_task_entry_gate_rejected_actual_task_start"), true);
  assert.equal(unsafeActualDataTaskEntryGate.blocked_reasons.includes("actual_data_task_entry_gate_rejected_file_access"), true);
  assert.equal(unsafeActualDataTaskEntryGate.blocked_reasons.includes("actual_data_task_entry_gate_rejected_parser_execution"), true);
  assert.equal(unsafeActualDataTaskEntryGate.blocked_reasons.includes("actual_data_task_entry_gate_rejected_readiness_claim"), true);
  assert.equal(JSON.stringify(unsafeActualDataTaskEntryGate).includes("private-row"), false);
  assertSafe(JSON.stringify(unsafeActualDataTaskEntryGate));
  assertNoModelPathLeak(JSON.stringify(unsafeActualDataTaskEntryGate));

  const defaultRowBodyParserContractStub = createMotionDatasetRowBodyParserContractStubSummary();
  assert.equal(defaultRowBodyParserContractStub.schema, LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA);
  assert.equal(defaultRowBodyParserContractStub.motion_dataset_row_body_parser_contract_stub_status, "planning_only_blocked");
  assert.equal(defaultRowBodyParserContractStub.parser_contract_stub_only_boundary, true);
  assert.equal(defaultRowBodyParserContractStub.row_body_parser_enabled, false);
  assert.equal(defaultRowBodyParserContractStub.row_body_parser_executed, false);
  assert.equal(defaultRowBodyParserContractStub.actual_row_content_accepted, false);
  assert.equal(defaultRowBodyParserContractStub.row_body_read, false);
  assert.equal(defaultRowBodyParserContractStub.real_row_data_present, false);
  assert.equal(defaultRowBodyParserContractStub.checked_row_count, 0);
  assert.equal(defaultRowBodyParserContractStub.actual_ingestion_allowed, false);
  assert.equal(defaultRowBodyParserContractStub.motion_dataset_executable, false);
  assert.equal(defaultRowBodyParserContractStub.runtime_readiness_claimed, false);
  assert.equal(defaultRowBodyParserContractStub.production_readiness_claimed, false);
  assert.equal(defaultRowBodyParserContractStub.priority1_status, "BLOCKED");
  assert.equal(defaultRowBodyParserContractStub.owner_confirmation_confirmed, false);
  assert.equal(defaultRowBodyParserContractStub.go_nogo_status, "no_go");
  assert.deepEqual(defaultRowBodyParserContractStub.required_future_parser_fields, [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS]);
  assert.deepEqual(defaultRowBodyParserContractStub.required_future_parser_rejection_reasons, [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SAFE_PUBLIC_REJECTION_REASONS]);
  assert.equal(LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REJECTION_REASONS.includes("raw_cue_payload_present"), true);
  assert.equal(defaultRowBodyParserContractStub.required_future_parser_fields.includes("row_id"), true);
  assert.equal(defaultRowBodyParserContractStub.required_future_parser_rejection_reasons.includes("cue_material_present"), true);
  assertSafe(JSON.stringify(defaultRowBodyParserContractStub));
  assertNoModelPathLeak(JSON.stringify(defaultRowBodyParserContractStub));

  const unsafeRowBodyParserContractStub = createMotionDatasetRowBodyParserContractStubSummary({
    row_body_parser_enabled: true,
    row_body_parser_executed: true,
    raw_jsonl_body: "private-jsonl",
    raw_dataset_row_body: "private-row",
    actual_row_content_accepted: true,
    row_body_read: true,
    real_row_data_present: true,
    checked_row_count: 5,
    actual_ingestion_allowed: true,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_confirmed: true,
    priority1_resolved: true,
  });
  assert.equal(unsafeRowBodyParserContractStub.row_body_parser_enabled, false);
  assert.equal(unsafeRowBodyParserContractStub.row_body_parser_executed, false);
  assert.equal(unsafeRowBodyParserContractStub.actual_row_content_accepted, false);
  assert.equal(unsafeRowBodyParserContractStub.row_body_read, false);
  assert.equal(unsafeRowBodyParserContractStub.checked_row_count, 0);
  assert.equal(unsafeRowBodyParserContractStub.real_row_data_present, false);
  assert.equal(unsafeRowBodyParserContractStub.actual_ingestion_allowed, false);
  assert.equal(unsafeRowBodyParserContractStub.motion_dataset_executable, false);
  assert.equal(unsafeRowBodyParserContractStub.runtime_readiness_claimed, false);
  assert.equal(unsafeRowBodyParserContractStub.production_readiness_claimed, false);
  assert.equal(unsafeRowBodyParserContractStub.owner_confirmation_confirmed, false);
  assert.equal(unsafeRowBodyParserContractStub.priority1_status, "BLOCKED");
  assert.equal(unsafeRowBodyParserContractStub.blocked_reasons.includes("row_body_parser_contract_stub_rejected_parser_execution"), true);
  assert.equal(unsafeRowBodyParserContractStub.blocked_reasons.includes("row_body_parser_contract_stub_rejected_row_body_read"), true);
  assert.equal(unsafeRowBodyParserContractStub.blocked_reasons.includes("row_body_parser_contract_stub_rejected_readiness_claim"), true);
  assert.equal(JSON.stringify(unsafeRowBodyParserContractStub).includes("private-row"), false);
  assertSafe(JSON.stringify(unsafeRowBodyParserContractStub));
  assertNoModelPathLeak(JSON.stringify(unsafeRowBodyParserContractStub));

  const defaultRowBodyParserRejectionFixturePack = createMotionDatasetRowBodyParserRejectionFixturePackSummary();
  assert.equal(defaultRowBodyParserRejectionFixturePack.schema, LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA);
  assert.equal(defaultRowBodyParserRejectionFixturePack.motion_dataset_row_body_parser_rejection_fixture_pack_status, "planning_only_blocked");
  assert.equal(defaultRowBodyParserRejectionFixturePack.planning_only_boundary, true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.synthetic_only_boundary, true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.parser_rejection_fixture_pack_only_boundary, true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.no_parser_execution_boundary, true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.no_actual_row_content_boundary, true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.no_row_body_read_boundary, true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.row_body_parser_enabled, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.row_body_parser_executed, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.actual_row_content_accepted, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.row_body_read, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.real_row_data_present, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.checked_row_count, 0);
  assert.equal(defaultRowBodyParserRejectionFixturePack.actual_ingestion_allowed, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.motion_dataset_executable, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.runtime_readiness_claimed, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.production_readiness_claimed, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.priority1_status, "BLOCKED");
  assert.equal(defaultRowBodyParserRejectionFixturePack.owner_confirmation_confirmed, false);
  assert.equal(defaultRowBodyParserRejectionFixturePack.go_nogo_status, "no_go");
  assert.deepEqual(defaultRowBodyParserRejectionFixturePack.accepted_parser_rejection_fixture_cases, [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_ACCEPTED_CASES]);
  assert.deepEqual(defaultRowBodyParserRejectionFixturePack.rejected_parser_input_attempt_cases, [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_INPUT_ATTEMPT_CASES]);
  assert.equal(LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_REJECTED_INPUT_ATTEMPT_CASES.includes("raw_jsonl_body_rejected"), true);
  assert.equal(LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_REJECTED_INPUT_ATTEMPT_CASES.includes("game_input_rejected"), true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.accepted_parser_rejection_fixture_cases.includes("safe_no_data_present_blocked_fixture"), true);
  assert.equal(defaultRowBodyParserRejectionFixturePack.rejected_parser_input_attempt_cases.includes("credential_value_rejected"), true);
  assert.equal(JSON.stringify(defaultRowBodyParserRejectionFixturePack).includes("raw_jsonl_body_rejected"), false);
  assert.equal(JSON.stringify(defaultRowBodyParserRejectionFixturePack).includes("game_input_rejected"), false);
  assertSafe(JSON.stringify(defaultRowBodyParserRejectionFixturePack));
  assertNoModelPathLeak(JSON.stringify(defaultRowBodyParserRejectionFixturePack));

  const unsafeRowBodyParserRejectionFixturePack = createMotionDatasetRowBodyParserRejectionFixturePackSummary({
    row_body_parser_enabled: true,
    row_body_parser_executed: true,
    actual_row_content_accepted: true,
    row_body_read: true,
    real_row_data_present: true,
    checked_row_count: 3,
    actual_ingestion_allowed: true,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_confirmed: true,
    priority1_status: "RESOLVED",
    go_nogo_status: "go",
  });
  assert.equal(unsafeRowBodyParserRejectionFixturePack.row_body_parser_enabled, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.row_body_parser_executed, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.actual_row_content_accepted, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.row_body_read, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.real_row_data_present, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.checked_row_count, 0);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.actual_ingestion_allowed, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.motion_dataset_executable, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.runtime_readiness_claimed, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.production_readiness_claimed, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.owner_confirmation_confirmed, false);
  assert.equal(unsafeRowBodyParserRejectionFixturePack.priority1_status, "BLOCKED");
  assert.equal(unsafeRowBodyParserRejectionFixturePack.go_nogo_status, "no_go");
  assert.equal(unsafeRowBodyParserRejectionFixturePack.blocked_reasons.includes("parser_rejection_fixture_pack_rejected_state_promotion"), true);
  assertSafe(JSON.stringify(unsafeRowBodyParserRejectionFixturePack));
  assertNoModelPathLeak(JSON.stringify(unsafeRowBodyParserRejectionFixturePack));

  const defaultIngestionAuditTrailStub = createMotionDatasetIngestionAuditTrailStubSummary();
  assert.equal(defaultIngestionAuditTrailStub.schema, LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA);
  assert.equal(defaultIngestionAuditTrailStub.motion_dataset_ingestion_audit_trail_stub_status, "planning_only_blocked");
  assert.equal(defaultIngestionAuditTrailStub.planning_only_boundary, true);
  assert.equal(defaultIngestionAuditTrailStub.audit_trail_stub_only_boundary, true);
  assert.equal(defaultIngestionAuditTrailStub.no_real_ingestion_audit_event_boundary, true);
  assert.equal(defaultIngestionAuditTrailStub.no_real_row_ingestion_boundary, true);
  assert.equal(defaultIngestionAuditTrailStub.no_row_body_read_boundary, true);
  assert.equal(defaultIngestionAuditTrailStub.real_ingestion_audit_event_created, false);
  assert.equal(defaultIngestionAuditTrailStub.actual_data_task_started, false);
  assert.equal(defaultIngestionAuditTrailStub.actual_row_content_accepted, false);
  assert.equal(defaultIngestionAuditTrailStub.row_body_read, false);
  assert.equal(defaultIngestionAuditTrailStub.real_row_data_present, false);
  assert.equal(defaultIngestionAuditTrailStub.checked_row_count, 0);
  assert.equal(defaultIngestionAuditTrailStub.actual_ingestion_allowed, false);
  assert.equal(defaultIngestionAuditTrailStub.motion_dataset_executable, false);
  assert.equal(defaultIngestionAuditTrailStub.runtime_readiness_claimed, false);
  assert.equal(defaultIngestionAuditTrailStub.production_readiness_claimed, false);
  assert.equal(defaultIngestionAuditTrailStub.priority1_status, "BLOCKED");
  assert.equal(defaultIngestionAuditTrailStub.owner_confirmation_confirmed, false);
  assert.equal(defaultIngestionAuditTrailStub.go_nogo_status, "no_go");
  assert.deepEqual(defaultIngestionAuditTrailStub.required_future_audit_event_fields, [...LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REQUIRED_EVENT_FIELDS]);
  assert.deepEqual(defaultIngestionAuditTrailStub.required_audit_redaction_policy, [...LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REDACTION_POLICY]);
  assert.equal(defaultIngestionAuditTrailStub.required_future_audit_event_fields.includes("audit_event_id"), true);
  assert.equal(defaultIngestionAuditTrailStub.required_future_audit_event_fields.includes("safe_next_action"), true);
  assert.equal(defaultIngestionAuditTrailStub.required_audit_redaction_policy.includes("no_dataset_row_material"), true);
  assert.equal(defaultIngestionAuditTrailStub.required_audit_redaction_policy.includes("no_command_material"), true);
  assertSafe(JSON.stringify(defaultIngestionAuditTrailStub));
  assertNoModelPathLeak(JSON.stringify(defaultIngestionAuditTrailStub));

  const unsafeIngestionAuditTrailStub = createMotionDatasetIngestionAuditTrailStubSummary({
    real_ingestion_audit_event_created: true,
    actual_data_task_started: true,
    actual_row_content_accepted: true,
    row_body_read: true,
    real_row_data_present: true,
    checked_row_count: 12,
    actual_ingestion_allowed: true,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_confirmed: true,
    priority1_status: "RESOLVED",
    go_nogo_status: "go",
  });
  assert.equal(unsafeIngestionAuditTrailStub.real_ingestion_audit_event_created, false);
  assert.equal(unsafeIngestionAuditTrailStub.actual_data_task_started, false);
  assert.equal(unsafeIngestionAuditTrailStub.actual_row_content_accepted, false);
  assert.equal(unsafeIngestionAuditTrailStub.row_body_read, false);
  assert.equal(unsafeIngestionAuditTrailStub.real_row_data_present, false);
  assert.equal(unsafeIngestionAuditTrailStub.checked_row_count, 0);
  assert.equal(unsafeIngestionAuditTrailStub.actual_ingestion_allowed, false);
  assert.equal(unsafeIngestionAuditTrailStub.motion_dataset_executable, false);
  assert.equal(unsafeIngestionAuditTrailStub.runtime_readiness_claimed, false);
  assert.equal(unsafeIngestionAuditTrailStub.production_readiness_claimed, false);
  assert.equal(unsafeIngestionAuditTrailStub.owner_confirmation_confirmed, false);
  assert.equal(unsafeIngestionAuditTrailStub.priority1_status, "BLOCKED");
  assert.equal(unsafeIngestionAuditTrailStub.go_nogo_status, "no_go");
  assert.equal(unsafeIngestionAuditTrailStub.blocked_reasons.includes("ingestion_audit_trail_stub_rejected_state_promotion"), true);
  assertSafe(JSON.stringify(unsafeIngestionAuditTrailStub));
  assertNoModelPathLeak(JSON.stringify(unsafeIngestionAuditTrailStub));

  const defaultRollbackPlanStub = createMotionDatasetIngestionRollbackPlanStubSummary();
  assert.equal(defaultRollbackPlanStub.schema, LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA);
  assert.equal(defaultRollbackPlanStub.motion_dataset_ingestion_rollback_plan_stub_status, "planning_only_blocked");
  assert.equal(defaultRollbackPlanStub.planning_only_boundary, true);
  assert.equal(defaultRollbackPlanStub.rollback_plan_stub_only_boundary, true);
  assert.equal(defaultRollbackPlanStub.no_rollback_ready_boundary, true);
  assert.equal(defaultRollbackPlanStub.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRollbackPlanStub.no_row_body_read_boundary, true);
  assert.equal(defaultRollbackPlanStub.rollback_ready, false);
  assert.equal(defaultRollbackPlanStub.rollback_snapshot_created, false);
  assert.equal(defaultRollbackPlanStub.rollback_plan_approved, false);
  assert.equal(defaultRollbackPlanStub.real_ingestion_audit_event_created, false);
  assert.equal(defaultRollbackPlanStub.actual_data_task_started, false);
  assert.equal(defaultRollbackPlanStub.row_body_read, false);
  assert.equal(defaultRollbackPlanStub.real_row_data_present, false);
  assert.equal(defaultRollbackPlanStub.checked_row_count, 0);
  assert.equal(defaultRollbackPlanStub.actual_ingestion_allowed, false);
  assert.equal(defaultRollbackPlanStub.motion_dataset_executable, false);
  assert.equal(defaultRollbackPlanStub.runtime_readiness_claimed, false);
  assert.equal(defaultRollbackPlanStub.production_readiness_claimed, false);
  assert.equal(defaultRollbackPlanStub.priority1_status, "BLOCKED");
  assert.equal(defaultRollbackPlanStub.owner_confirmation_confirmed, false);
  assert.equal(defaultRollbackPlanStub.go_nogo_status, "no_go");
  assert.deepEqual(defaultRollbackPlanStub.required_future_rollback_fields, [...LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS]);
  assert.deepEqual(defaultRollbackPlanStub.required_rollback_blockers, [...LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS]);
  assert.equal(defaultRollbackPlanStub.required_future_rollback_fields.includes("rollback_plan_id"), true);
  assert.equal(defaultRollbackPlanStub.required_rollback_blockers.includes("priority1_blocked"), true);
  assertSafe(JSON.stringify(defaultRollbackPlanStub));
  assertNoModelPathLeak(JSON.stringify(defaultRollbackPlanStub));

  const unsafeRollbackPlanStub = createMotionDatasetIngestionRollbackPlanStubSummary({
    rollback_ready: true,
    rollback_snapshot_created: true,
    rollback_plan_approved: true,
    real_ingestion_audit_event_created: true,
    actual_data_task_started: true,
    row_body_read: true,
    real_row_data_present: true,
    actual_ingestion_allowed: true,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_confirmed: true,
    priority1_status: "RESOLVED",
    go_nogo_status: "go",
  });
  assert.equal(unsafeRollbackPlanStub.rollback_ready, false);
  assert.equal(unsafeRollbackPlanStub.rollback_snapshot_created, false);
  assert.equal(unsafeRollbackPlanStub.rollback_plan_approved, false);
  assert.equal(unsafeRollbackPlanStub.actual_ingestion_allowed, false);
  assert.equal(unsafeRollbackPlanStub.motion_dataset_executable, false);
  assert.equal(unsafeRollbackPlanStub.runtime_readiness_claimed, false);
  assert.equal(unsafeRollbackPlanStub.production_readiness_claimed, false);
  assert.equal(unsafeRollbackPlanStub.owner_confirmation_confirmed, false);
  assert.equal(unsafeRollbackPlanStub.priority1_status, "BLOCKED");
  assert.equal(unsafeRollbackPlanStub.go_nogo_status, "no_go");
  assert.equal(unsafeRollbackPlanStub.blocked_reasons.includes("rollback_plan_stub_rejected_state_promotion"), true);
  assertSafe(JSON.stringify(unsafeRollbackPlanStub));
  assertNoModelPathLeak(JSON.stringify(unsafeRollbackPlanStub));

  const defaultParserDryRunEnvelope = createMotionDatasetParserDryRunEnvelopeSummary();
  assert.equal(defaultParserDryRunEnvelope.schema, LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA);
  assert.equal(defaultParserDryRunEnvelope.motion_dataset_parser_dry_run_envelope_status, "planning_only_blocked");
  assert.equal(defaultParserDryRunEnvelope.planning_only_boundary, true);
  assert.equal(defaultParserDryRunEnvelope.parser_dry_run_envelope_only_boundary, true);
  assert.equal(defaultParserDryRunEnvelope.no_parser_execution_boundary, true);
  assert.equal(defaultParserDryRunEnvelope.no_actual_file_read_boundary, true);
  assert.equal(defaultParserDryRunEnvelope.no_actual_row_content_boundary, true);
  assert.equal(defaultParserDryRunEnvelope.no_real_row_ingestion_boundary, true);
  assert.equal(defaultParserDryRunEnvelope.row_body_parser_enabled, false);
  assert.equal(defaultParserDryRunEnvelope.row_body_parser_executed, false);
  assert.equal(defaultParserDryRunEnvelope.parser_dry_run_executed, false);
  assert.equal(defaultParserDryRunEnvelope.actual_file_read, false);
  assert.equal(defaultParserDryRunEnvelope.actual_row_content_accepted, false);
  assert.equal(defaultParserDryRunEnvelope.row_body_read, false);
  assert.equal(defaultParserDryRunEnvelope.checked_row_count, 0);
  assert.equal(defaultParserDryRunEnvelope.real_row_data_present, false);
  assert.equal(defaultParserDryRunEnvelope.actual_ingestion_allowed, false);
  assert.equal(defaultParserDryRunEnvelope.motion_dataset_executable, false);
  assert.equal(defaultParserDryRunEnvelope.runtime_readiness_claimed, false);
  assert.equal(defaultParserDryRunEnvelope.production_readiness_claimed, false);
  assert.equal(defaultParserDryRunEnvelope.priority1_status, "BLOCKED");
  assert.equal(defaultParserDryRunEnvelope.owner_confirmation_confirmed, false);
  assert.equal(defaultParserDryRunEnvelope.go_nogo_status, "no_go");
  assert.deepEqual(defaultParserDryRunEnvelope.required_future_dry_run_inputs, [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_INPUTS]);
  assert.deepEqual(defaultParserDryRunEnvelope.required_future_dry_run_outputs, [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_OUTPUTS]);
  assert.equal(defaultParserDryRunEnvelope.required_future_dry_run_inputs.includes("parser_contract_ref"), true);
  assert.equal(defaultParserDryRunEnvelope.required_future_dry_run_outputs.includes("dry_run_status"), true);
  assertSafe(JSON.stringify(defaultParserDryRunEnvelope));
  assertNoModelPathLeak(JSON.stringify(defaultParserDryRunEnvelope));

  const unsafeParserDryRunEnvelope = createMotionDatasetParserDryRunEnvelopeSummary({
    row_body_parser_enabled: true,
    row_body_parser_executed: true,
    parser_dry_run_executed: true,
    actual_file_read: true,
    actual_row_content_accepted: true,
    row_body_read: true,
    real_row_data_present: true,
    checked_row_count: 3,
    actual_ingestion_allowed: true,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_confirmed: true,
    priority1_status: "RESOLVED",
    go_nogo_status: "go",
  });
  assert.equal(unsafeParserDryRunEnvelope.row_body_parser_enabled, false);
  assert.equal(unsafeParserDryRunEnvelope.row_body_parser_executed, false);
  assert.equal(unsafeParserDryRunEnvelope.parser_dry_run_executed, false);
  assert.equal(unsafeParserDryRunEnvelope.actual_file_read, false);
  assert.equal(unsafeParserDryRunEnvelope.actual_ingestion_allowed, false);
  assert.equal(unsafeParserDryRunEnvelope.motion_dataset_executable, false);
  assert.equal(unsafeParserDryRunEnvelope.runtime_readiness_claimed, false);
  assert.equal(unsafeParserDryRunEnvelope.production_readiness_claimed, false);
  assert.equal(unsafeParserDryRunEnvelope.owner_confirmation_confirmed, false);
  assert.equal(unsafeParserDryRunEnvelope.priority1_status, "BLOCKED");
  assert.equal(unsafeParserDryRunEnvelope.go_nogo_status, "no_go");
  assert.equal(unsafeParserDryRunEnvelope.blocked_reasons.includes("parser_dry_run_envelope_rejected_state_promotion"), true);
  assertSafe(JSON.stringify(unsafeParserDryRunEnvelope));
  assertNoModelPathLeak(JSON.stringify(unsafeParserDryRunEnvelope));

  const defaultSplitPolicyPacket = createMotionDatasetRealRowSplitPolicyPacketSummary();
  assert.equal(defaultSplitPolicyPacket.schema, LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_PACKET_SCHEMA);
  assert.equal(defaultSplitPolicyPacket.motion_dataset_real_row_split_policy_packet_status, "planning_only");
  assert.equal(defaultSplitPolicyPacket.planning_only_boundary, true);
  assert.equal(defaultSplitPolicyPacket.split_policy_packet_only_boundary, true);
  assert.equal(defaultSplitPolicyPacket.no_real_row_ingestion_boundary, true);
  assert.equal(defaultSplitPolicyPacket.no_row_body_read_boundary, true);
  assert.equal(defaultSplitPolicyPacket.no_split_ingestion_approval_boundary, true);
  assert.equal(defaultSplitPolicyPacket.split_policy_packet_approves_ingestion, false);
  assert.deepEqual(defaultSplitPolicyPacket.required_split_labels, [...LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_REQUIRED_LABELS]);
  assert.deepEqual(defaultSplitPolicyPacket.required_contamination_blockers, [...LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_CONTAMINATION_BLOCKERS]);
  assert.equal(defaultSplitPolicyPacket.required_split_labels.includes("train"), true);
  assert.equal(defaultSplitPolicyPacket.required_split_labels.includes("eval"), true);
  assert.equal(defaultSplitPolicyPacket.required_split_labels.includes("test"), true);
  assert.equal(defaultSplitPolicyPacket.required_split_labels.includes("review_only"), true);
  assert.equal(defaultSplitPolicyPacket.required_split_labels.includes("fixture_only"), true);
  assert.equal(defaultSplitPolicyPacket.required_split_labels.includes("quarantine_only"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("duplicate_row_id"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("expected_summary_leak"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("fixture_duplication"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("train_eval_overlap"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("source_hash_missing"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("split_missing"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("row_body_unread"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("priority1_blocked"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("owner_confirmation_missing"), true);
  assert.equal(defaultSplitPolicyPacket.required_contamination_blockers.includes("checked_row_count_zero"), true);
  assert.equal(defaultSplitPolicyPacket.real_row_data_present, false);
  assert.equal(defaultSplitPolicyPacket.checked_row_count, 0);
  assert.equal(defaultSplitPolicyPacket.actual_ingestion_allowed, false);
  assert.equal(defaultSplitPolicyPacket.owner_confirmation_confirmed, false);
  assert.equal(defaultSplitPolicyPacket.priority1_status, "BLOCKED");
  assert.equal(defaultSplitPolicyPacket.go_nogo_status, "no_go");
  assert.equal(defaultSplitPolicyPacket.motion_dataset_executable, false);
  assert.equal(defaultSplitPolicyPacket.runtime_readiness_claimed, false);
  assert.equal(defaultSplitPolicyPacket.production_readiness_claimed, false);
  assertSafe(JSON.stringify(defaultSplitPolicyPacket));
  assertNoModelPathLeak(JSON.stringify(defaultSplitPolicyPacket));

  const unsafeSplitPolicyPacket = createMotionDatasetRealRowSplitPolicyPacketSummary({
    required_split_labels: ["train"],
    split_policy_packet_approves_ingestion: true,
    actual_ingestion_allowed: true,
    real_row_data_present: true,
    checked_row_count: 5,
    row_body_read: true,
    row_body_parser_enabled: true,
    owner_confirmation_confirmed: true,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
  });
  assert.equal(unsafeSplitPolicyPacket.motion_dataset_real_row_split_policy_packet_status, "blocked");
  assert.equal(unsafeSplitPolicyPacket.split_policy_packet_approves_ingestion, false);
  assert.equal(unsafeSplitPolicyPacket.actual_ingestion_allowed, false);
  assert.equal(unsafeSplitPolicyPacket.real_row_data_present, false);
  assert.equal(unsafeSplitPolicyPacket.checked_row_count, 0);
  assert.equal(unsafeSplitPolicyPacket.row_body_read, false);
  assert.equal(unsafeSplitPolicyPacket.row_body_parser_enabled, false);
  assert.equal(unsafeSplitPolicyPacket.owner_confirmation_confirmed, false);
  assert.equal(unsafeSplitPolicyPacket.motion_dataset_executable, false);
  assert.equal(unsafeSplitPolicyPacket.runtime_readiness_claimed, false);
  assert.equal(unsafeSplitPolicyPacket.production_readiness_claimed, false);
  assert.equal(unsafeSplitPolicyPacket.priority1_status, "BLOCKED");
  assert.equal(unsafeSplitPolicyPacket.contamination_blockers.includes("split_policy_rejected_ingestion_or_readiness_attempt"), true);
  assert.equal(unsafeSplitPolicyPacket.missing_split_labels.includes("eval"), true);
  assertSafe(JSON.stringify(unsafeSplitPolicyPacket));
  assertNoModelPathLeak(JSON.stringify(unsafeSplitPolicyPacket));

  const defaultSourceHashOwnerChecklist = createMotionDatasetSourceHashOwnerChecklistSummary();
  assert.equal(defaultSourceHashOwnerChecklist.schema, LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_CHECKLIST_SCHEMA);
  assert.equal(defaultSourceHashOwnerChecklist.motion_dataset_source_hash_owner_checklist_status, "planning_only");
  assert.equal(defaultSourceHashOwnerChecklist.source_hash_owner_checklist_only_boundary, true);
  assert.equal(defaultSourceHashOwnerChecklist.no_actual_file_read_boundary, true);
  assert.equal(defaultSourceHashOwnerChecklist.no_actual_hash_calculation_boundary, true);
  assert.equal(defaultSourceHashOwnerChecklist.no_real_hash_verification_boundary, true);
  assert.equal(defaultSourceHashOwnerChecklist.source_hash_checklist_verifies_real_hash, false);
  assert.equal(defaultSourceHashOwnerChecklist.actual_hash_calculated, false);
  assert.equal(defaultSourceHashOwnerChecklist.actual_file_read, false);
  assert.deepEqual(defaultSourceHashOwnerChecklist.required_owner_items, [...LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_REQUIRED_ITEMS]);
  assert.deepEqual(defaultSourceHashOwnerChecklist.required_hash_verification_blockers, [...LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_BLOCKERS]);
  assert.equal(defaultSourceHashOwnerChecklist.checked_row_count, 0);
  assert.equal(defaultSourceHashOwnerChecklist.real_row_data_present, false);
  assert.equal(defaultSourceHashOwnerChecklist.actual_ingestion_allowed, false);
  assert.equal(defaultSourceHashOwnerChecklist.owner_confirmation_confirmed, false);
  assert.equal(defaultSourceHashOwnerChecklist.priority1_status, "BLOCKED");
  assert.equal(defaultSourceHashOwnerChecklist.motion_dataset_executable, false);
  assert.equal(defaultSourceHashOwnerChecklist.runtime_readiness_claimed, false);
  assert.equal(defaultSourceHashOwnerChecklist.production_readiness_claimed, false);
  assert.equal(defaultSourceHashOwnerChecklist.boundary_policy.no_actual_file_read, true);
  assert.equal(defaultSourceHashOwnerChecklist.boundary_policy.no_actual_hash_calculation, true);
  assertSafe(JSON.stringify(defaultSourceHashOwnerChecklist));
  assertNoModelPathLeak(JSON.stringify(defaultSourceHashOwnerChecklist));

  const unsafeSourceHashOwnerChecklist = createMotionDatasetSourceHashOwnerChecklistSummary({
    required_owner_items: ["hash_algorithm_label"],
    source_hash_checklist_verifies_real_hash: true,
    actual_hash_calculated: true,
    actual_file_read: true,
    actual_ingestion_allowed: true,
    checked_row_count: 2,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_confirmed: true,
    priority1_status: "RESOLVED",
  });
  assert.equal(unsafeSourceHashOwnerChecklist.motion_dataset_source_hash_owner_checklist_status, "blocked");
  assert.equal(unsafeSourceHashOwnerChecklist.source_hash_checklist_verifies_real_hash, false);
  assert.equal(unsafeSourceHashOwnerChecklist.actual_hash_calculated, false);
  assert.equal(unsafeSourceHashOwnerChecklist.actual_file_read, false);
  assert.equal(unsafeSourceHashOwnerChecklist.actual_ingestion_allowed, false);
  assert.equal(unsafeSourceHashOwnerChecklist.checked_row_count, 0);
  assert.equal(unsafeSourceHashOwnerChecklist.motion_dataset_executable, false);
  assert.equal(unsafeSourceHashOwnerChecklist.owner_confirmation_confirmed, false);
  assert.equal(unsafeSourceHashOwnerChecklist.priority1_status, "BLOCKED");
  assert.equal(unsafeSourceHashOwnerChecklist.missing_owner_items.includes("source_hash_label"), true);
  assert.equal(unsafeSourceHashOwnerChecklist.hash_verification_blockers.includes("source_hash_owner_checklist_rejected_real_hash_or_ingestion_attempt"), true);
  assertSafe(JSON.stringify(unsafeSourceHashOwnerChecklist));

  const defaultFinalOwnerWaitGate = createMotionDatasetFinalOwnerWaitForDataGateSummary();
  assert.equal(defaultFinalOwnerWaitGate.schema, LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_GATE_SCHEMA);
  assert.equal(defaultFinalOwnerWaitGate.motion_dataset_final_owner_wait_for_data_gate_status, "waiting_for_owner_data");
  assert.equal(defaultFinalOwnerWaitGate.final_owner_wait_for_data_gate_only_boundary, true);
  assert.equal(defaultFinalOwnerWaitGate.no_owner_confirmation_created_boundary, true);
  assert.equal(defaultFinalOwnerWaitGate.no_actual_data_task_started_boundary, true);
  assert.equal(defaultFinalOwnerWaitGate.final_owner_wait_gate_confirms_owner, false);
  assert.equal(defaultFinalOwnerWaitGate.owner_confirmation_confirmed, false);
  assert.equal(defaultFinalOwnerWaitGate.owner_submission_received, false);
  assert.equal(defaultFinalOwnerWaitGate.actual_data_task_started, false);
  assert.equal(defaultFinalOwnerWaitGate.actual_ingestion_allowed, false);
  assert.equal(defaultFinalOwnerWaitGate.real_row_data_present, false);
  assert.equal(defaultFinalOwnerWaitGate.checked_row_count, 0);
  assert.deepEqual(defaultFinalOwnerWaitGate.required_wait_reasons, [...LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS]);
  assert.deepEqual(defaultFinalOwnerWaitGate.future_owner_actions, [...LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_FUTURE_ACTIONS]);
  assert.equal(defaultFinalOwnerWaitGate.priority1_status, "BLOCKED");
  assert.equal(defaultFinalOwnerWaitGate.go_nogo_status, "no_go");
  assert.equal(defaultFinalOwnerWaitGate.motion_dataset_executable, false);
  assert.equal(defaultFinalOwnerWaitGate.runtime_readiness_claimed, false);
  assert.equal(defaultFinalOwnerWaitGate.production_readiness_claimed, false);
  assertSafe(JSON.stringify(defaultFinalOwnerWaitGate));

  const unsafeFinalOwnerWaitGate = createMotionDatasetFinalOwnerWaitForDataGateSummary({
    required_wait_reasons: ["real_row_file_missing"],
    final_owner_wait_gate_confirms_owner: true,
    owner_confirmation_confirmed: true,
    owner_submission_received: true,
    actual_data_task_started: true,
    actual_ingestion_allowed: true,
    real_row_data_present: true,
    checked_row_count: 3,
    motion_dataset_executable: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    go_nogo_status: "go",
  });
  assert.equal(unsafeFinalOwnerWaitGate.motion_dataset_final_owner_wait_for_data_gate_status, "blocked");
  assert.equal(unsafeFinalOwnerWaitGate.final_owner_wait_gate_confirms_owner, false);
  assert.equal(unsafeFinalOwnerWaitGate.owner_confirmation_confirmed, false);
  assert.equal(unsafeFinalOwnerWaitGate.owner_submission_received, false);
  assert.equal(unsafeFinalOwnerWaitGate.actual_data_task_started, false);
  assert.equal(unsafeFinalOwnerWaitGate.actual_ingestion_allowed, false);
  assert.equal(unsafeFinalOwnerWaitGate.real_row_data_present, false);
  assert.equal(unsafeFinalOwnerWaitGate.checked_row_count, 0);
  assert.equal(unsafeFinalOwnerWaitGate.motion_dataset_executable, false);
  assert.equal(unsafeFinalOwnerWaitGate.priority1_status, "BLOCKED");
  assert.equal(unsafeFinalOwnerWaitGate.go_nogo_status, "no_go");
  assert.equal(unsafeFinalOwnerWaitGate.wait_for_data_reasons.includes("final_owner_wait_gate_rejected_owner_or_actual_data_attempt"), true);
  assert.equal(unsafeFinalOwnerWaitGate.missing_wait_reasons.includes("owner_confirmation_missing"), true);
  assertSafe(JSON.stringify(unsafeFinalOwnerWaitGate));

  const defaultOwnerActionLaneFreeze = createOwnerActionLaneFreezeStatusSummary();
  assert.equal(defaultOwnerActionLaneFreeze.schema, LIVE2D_OWNER_ACTION_LANE_FREEZE_STATUS_SCHEMA);
  assert.equal(defaultOwnerActionLaneFreeze.owner_action_lane_freeze_status, "waiting_for_explicit_owner_action");
  assert.equal(defaultOwnerActionLaneFreeze.owner_action_lane_completed_as_metadata_only, true);
  assert.equal(defaultOwnerActionLaneFreeze.owner_action_request_sent, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_action_requested, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_action_accepted, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_handoff_sent, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_instruction_request_sent, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_instruction_requested, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_instruction_accepted, false);
  assert.equal(defaultOwnerActionLaneFreeze.packet_request_sent, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_submission_received, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_submission_accepted, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_confirmation_created, false);
  assert.equal(defaultOwnerActionLaneFreeze.owner_confirmation_confirmed, false);
  assert.equal(defaultOwnerActionLaneFreeze.actual_data_task_started, false);
  assert.equal(defaultOwnerActionLaneFreeze.actual_data_preauthorized, false);
  assert.equal(defaultOwnerActionLaneFreeze.real_data_accepted, false);
  assert.equal(defaultOwnerActionLaneFreeze.row_body_read, false);
  assert.equal(defaultOwnerActionLaneFreeze.actual_file_read, false);
  assert.equal(defaultOwnerActionLaneFreeze.file_reference_value_accepted, false);
  assert.equal(defaultOwnerActionLaneFreeze.hash_calculation_performed, false);
  assert.equal(defaultOwnerActionLaneFreeze.source_hash_verified, false);
  assert.equal(defaultOwnerActionLaneFreeze.declared_row_count_checked, false);
  assert.equal(defaultOwnerActionLaneFreeze.parser_execution_started, false);
  assert.equal(defaultOwnerActionLaneFreeze.redaction_scan_execution_started, false);
  assert.equal(defaultOwnerActionLaneFreeze.audit_execution_started, false);
  assert.equal(defaultOwnerActionLaneFreeze.real_ingestion_audit_event_created, false);
  assert.equal(defaultOwnerActionLaneFreeze.runtime_readiness_claimed, false);
  assert.equal(defaultOwnerActionLaneFreeze.production_readiness_claimed, false);
  assert.equal(defaultOwnerActionLaneFreeze.priority1_status, "BLOCKED");
  assert.equal(defaultOwnerActionLaneFreeze.checked_row_count, 0);
  assert.equal(defaultOwnerActionLaneFreeze.motion_dataset_boundary, "non_executable");
  assert.equal(defaultOwnerActionLaneFreeze.trusted_loader_boundary, "disabled");
  assert.equal(defaultOwnerActionLaneFreeze.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultOwnerActionLaneFreeze.renderer_ready, false);
  assert.equal(defaultOwnerActionLaneFreeze.safe_next_action, "wait_for_explicit_owner_action");
  assert.equal(defaultOwnerActionLaneFreeze.unsafe_state_attempt_rejected, false);
  assert.equal(defaultOwnerActionLaneFreeze.boundary_policy.no_owner_action_request, true);
  assertSafe(JSON.stringify(defaultOwnerActionLaneFreeze));

  const unsafeOwnerActionLaneFreeze = createOwnerActionLaneFreezeStatusSummary({
    owner_action_requested: true,
    owner_confirmation_confirmed: true,
    actual_data_task_started: true,
    actual_data_preauthorized: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    checked_row_count: 1,
    priority1_status: "RESOLVED",
    trusted_loader_boundary: "enabled",
    motion_dataset_boundary: "executable",
  });
  assert.equal(unsafeOwnerActionLaneFreeze.owner_action_lane_freeze_status, "blocked_unsafe_state_attempt");
  assert.equal(unsafeOwnerActionLaneFreeze.owner_action_requested, false);
  assert.equal(unsafeOwnerActionLaneFreeze.owner_confirmation_confirmed, false);
  assert.equal(unsafeOwnerActionLaneFreeze.actual_data_task_started, false);
  assert.equal(unsafeOwnerActionLaneFreeze.actual_data_preauthorized, false);
  assert.equal(unsafeOwnerActionLaneFreeze.runtime_readiness_claimed, false);
  assert.equal(unsafeOwnerActionLaneFreeze.production_readiness_claimed, false);
  assert.equal(unsafeOwnerActionLaneFreeze.checked_row_count, 0);
  assert.equal(unsafeOwnerActionLaneFreeze.priority1_status, "BLOCKED");
  assert.equal(unsafeOwnerActionLaneFreeze.trusted_loader_boundary, "disabled");
  assert.equal(unsafeOwnerActionLaneFreeze.motion_dataset_boundary, "non_executable");
  assert.equal(unsafeOwnerActionLaneFreeze.safe_next_action, "wait_for_explicit_owner_action");
  assert.equal(unsafeOwnerActionLaneFreeze.unsafe_state_attempt_rejected, true);
  assertSafe(JSON.stringify(unsafeOwnerActionLaneFreeze));
  assertOwnerActionLaneFreezeRejectsUnsafePromotion();
  assertOwnerActionLaneFreezeStatusRedactionSweep();
  assertOwnerActionLaneFreezeUnexpectedFieldRejectionGuard();

  const defaultRowFileChecksumPreflightManifest = createMotionDatasetRowFileChecksumPreflightManifestSummary();
  assert.equal(defaultRowFileChecksumPreflightManifest.schema, LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_MANIFEST_SCHEMA);
  assert.equal(defaultRowFileChecksumPreflightManifest.motion_dataset_row_file_checksum_preflight_manifest_status, "planning_only_blocked");
  assert.equal(defaultRowFileChecksumPreflightManifest.planning_only_boundary, true);
  assert.equal(defaultRowFileChecksumPreflightManifest.checksum_manifest_only_boundary, true);
  assert.equal(defaultRowFileChecksumPreflightManifest.no_actual_file_read_boundary, true);
  assert.equal(defaultRowFileChecksumPreflightManifest.no_actual_hash_calculation_boundary, true);
  assert.equal(defaultRowFileChecksumPreflightManifest.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRowFileChecksumPreflightManifest.no_row_body_read_boundary, true);
  assert.equal(defaultRowFileChecksumPreflightManifest.actual_file_read, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.actual_hash_calculated, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.actual_file_reference_accepted, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.actual_file_content_accepted, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.real_row_data_present, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.checked_row_count, 0);
  assert.equal(defaultRowFileChecksumPreflightManifest.actual_ingestion_allowed, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.motion_dataset_executable, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.runtime_readiness_claimed, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.production_readiness_claimed, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.renderer_ready, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.model_loaded, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.scene_loaded, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.browser_cue_delivery_ready, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.priority1_status, "BLOCKED");
  assert.equal(defaultRowFileChecksumPreflightManifest.owner_confirmation_required, true);
  assert.equal(defaultRowFileChecksumPreflightManifest.owner_confirmation_created, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.owner_confirmation_confirmed, false);
  assert.equal(defaultRowFileChecksumPreflightManifest.go_nogo_status, "no_go");
  assert.equal(defaultRowFileChecksumPreflightManifest.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultRowFileChecksumPreflightManifest.required_hash_metadata_labels, [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_HASH_METADATA_LABELS]);
  assert.deepEqual(defaultRowFileChecksumPreflightManifest.required_hash_algorithm_labels, [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS]);
  assert.deepEqual(defaultRowFileChecksumPreflightManifest.required_file_identity_labels, [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_FILE_IDENTITY_LABELS]);
  assert.deepEqual(defaultRowFileChecksumPreflightManifest.required_owner_confirmation_refs, [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_OWNER_CONFIRMATION_REFS]);
  assert.equal(defaultRowFileChecksumPreflightManifest.required_hash_metadata_labels.includes("source_hash"), true);
  assert.equal(defaultRowFileChecksumPreflightManifest.required_hash_algorithm_labels.includes("sha256"), true);
  assert.equal(defaultRowFileChecksumPreflightManifest.required_hash_algorithm_labels.includes("sha512"), true);
  assert.equal(defaultRowFileChecksumPreflightManifest.safe_next_action, "prepare_checksum_metadata_labels_only_without_file_read_or_hash_calculation");
  assert.equal(defaultRowFileChecksumPreflightManifest.boundary_policy.no_actual_file_read, true);
  assert.equal(defaultRowFileChecksumPreflightManifest.boundary_policy.no_actual_hash_calculation, true);
  assertSafe(JSON.stringify(defaultRowFileChecksumPreflightManifest));
  assertNoModelPathLeak(JSON.stringify(defaultRowFileChecksumPreflightManifest));

  const unsafeRowFileChecksumPreflightManifest = createMotionDatasetRowFileChecksumPreflightManifestSummary({
    actual_file_read: true,
    actual_hash_calculated: true,
    source_hash: "private-real-hash",
    actual_file_path_value: "private-file-path",
    actual_file_content: "private-file-content",
    raw_dataset_row_body: "private-row",
    checked_row_count: 2,
    real_row_data_present: true,
    actual_ingestion_allowed: true,
    row_body_read: true,
    motion_dataset_executable: true,
    renderer_ready: true,
    model_loaded: true,
    scene_loaded: true,
    browser_cue_delivery_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeRowFileChecksumPreflightManifest.actual_file_read, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.actual_hash_calculated, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.actual_file_reference_accepted, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.actual_file_content_accepted, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.real_row_data_present, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.checked_row_count, 0);
  assert.equal(unsafeRowFileChecksumPreflightManifest.actual_ingestion_allowed, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.row_body_read, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.motion_dataset_executable, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.renderer_ready, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.model_loaded, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.scene_loaded, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.browser_cue_delivery_ready, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.runtime_readiness_claimed, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.production_readiness_claimed, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.owner_confirmation_confirmed, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.priority1_status, "BLOCKED");
  assert.equal(unsafeRowFileChecksumPreflightManifest.go_nogo_status, "no_go");
  assert.equal(unsafeRowFileChecksumPreflightManifest.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_actual_file_read"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_actual_hash_calculation"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_real_hash_value"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_actual_file_reference"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_actual_file_content"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_actual_ingestion_request"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_row_body_read"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_motion_execution"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_readiness_claim"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_owner_confirmation"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeRowFileChecksumPreflightManifest.blocked_reasons.includes("row_file_checksum_preflight_manifest_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeRowFileChecksumPreflightManifest).includes("private-real-hash"), false);
  assert.equal(JSON.stringify(unsafeRowFileChecksumPreflightManifest).includes("private-file-path"), false);
  assert.equal(JSON.stringify(unsafeRowFileChecksumPreflightManifest).includes("private-row"), false);
  assertSafe(JSON.stringify(unsafeRowFileChecksumPreflightManifest));
  assertNoModelPathLeak(JSON.stringify(unsafeRowFileChecksumPreflightManifest));

  const defaultRedactionScannerFixturePack = createMotionDatasetRealRowRedactionScannerFixturePackSummary();
  assert.equal(defaultRedactionScannerFixturePack.schema, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA);
  assert.equal(defaultRedactionScannerFixturePack.motion_dataset_real_row_redaction_scanner_fixture_pack_status, "planning_only_blocked");
  assert.equal(defaultRedactionScannerFixturePack.planning_only_boundary, true);
  assert.equal(defaultRedactionScannerFixturePack.synthetic_only_boundary, true);
  assert.equal(defaultRedactionScannerFixturePack.redaction_scanner_fixture_only_boundary, true);
  assert.equal(defaultRedactionScannerFixturePack.no_real_row_ingestion_boundary, true);
  assert.equal(defaultRedactionScannerFixturePack.no_row_body_read_boundary, true);
  assert.equal(defaultRedactionScannerFixturePack.synthetic_only, true);
  assert.equal(defaultRedactionScannerFixturePack.redaction_scanner_fixture_only, true);
  assert.equal(defaultRedactionScannerFixturePack.accepted_redaction_fixtures_are_real_evidence, false);
  assert.equal(defaultRedactionScannerFixturePack.accepted_redaction_fixtures_are_real_safety_proof, false);
  assert.equal(defaultRedactionScannerFixturePack.real_row_data_present, false);
  assert.equal(defaultRedactionScannerFixturePack.checked_row_count, 0);
  assert.equal(defaultRedactionScannerFixturePack.motion_dataset_executable, false);
  assert.equal(defaultRedactionScannerFixturePack.runtime_readiness_claimed, false);
  assert.equal(defaultRedactionScannerFixturePack.production_readiness_claimed, false);
  assert.equal(defaultRedactionScannerFixturePack.renderer_ready, false);
  assert.equal(defaultRedactionScannerFixturePack.model_loaded, false);
  assert.equal(defaultRedactionScannerFixturePack.scene_loaded, false);
  assert.equal(defaultRedactionScannerFixturePack.browser_cue_delivery_ready, false);
  assert.equal(defaultRedactionScannerFixturePack.priority1_status, "BLOCKED");
  assert.equal(defaultRedactionScannerFixturePack.owner_confirmation_created, false);
  assert.equal(defaultRedactionScannerFixturePack.owner_confirmation_confirmed, false);
  assert.equal(defaultRedactionScannerFixturePack.go_nogo_status, "no_go");
  assert.equal(defaultRedactionScannerFixturePack.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultRedactionScannerFixturePack.accepted_redaction_fixture_cases, [...LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES]);
  assert.equal(defaultRedactionScannerFixturePack.rejected_redaction_fixture_cases.length, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES.length);
  assert.equal(defaultRedactionScannerFixturePack.rejected_redaction_fixture_cases.every((label) => !label.startsWith("raw_")), true);
  assertSafe(JSON.stringify(defaultRedactionScannerFixturePack));
  assertNoModelPathLeak(JSON.stringify(defaultRedactionScannerFixturePack));

  const unsafeRedactionScannerFixturePack = createMotionDatasetRealRowRedactionScannerFixturePackSummary({
    raw_dataset_row_body: "private-row",
    raw_cue_payload: "private-cue",
    actual_file_path_value: "private-file",
    actual_file_content: "private-content",
    owner_private_note: "private-note",
    raw_owner_confirmation_note: "private-confirmation",
    raw_k_memo_text: "private-k",
    endpoint_value: "private-endpoint",
    token_value: "private-token",
    secret_value: "private-secret",
    renderer_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_resolved: true,
    motion_dataset_executable: true,
    owner_confirmation_confirmed: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeRedactionScannerFixturePack.real_row_data_present, false);
  assert.equal(unsafeRedactionScannerFixturePack.checked_row_count, 0);
  assert.equal(unsafeRedactionScannerFixturePack.motion_dataset_executable, false);
  assert.equal(unsafeRedactionScannerFixturePack.renderer_ready, false);
  assert.equal(unsafeRedactionScannerFixturePack.runtime_readiness_claimed, false);
  assert.equal(unsafeRedactionScannerFixturePack.production_readiness_claimed, false);
  assert.equal(unsafeRedactionScannerFixturePack.priority1_status, "BLOCKED");
  assert.equal(unsafeRedactionScannerFixturePack.owner_confirmation_confirmed, false);
  assert.equal(unsafeRedactionScannerFixturePack.go_nogo_status, "no_go");
  assert.equal(unsafeRedactionScannerFixturePack.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeRedactionScannerFixturePack.rejection_reasons.includes("redaction_scanner_fixture_pack_rejected_raw_or_private_field"), true);
  assert.equal(unsafeRedactionScannerFixturePack.rejection_reasons.includes("redaction_scanner_fixture_pack_rejected_readiness_claim"), true);
  assert.equal(unsafeRedactionScannerFixturePack.rejection_reasons.includes("redaction_scanner_fixture_pack_rejected_priority1_resolution"), true);
  assert.equal(unsafeRedactionScannerFixturePack.rejection_reasons.includes("redaction_scanner_fixture_pack_rejected_motion_execution"), true);
  assert.equal(unsafeRedactionScannerFixturePack.rejection_reasons.includes("redaction_scanner_fixture_pack_rejected_owner_confirmation"), true);
  assert.equal(unsafeRedactionScannerFixturePack.rejection_reasons.includes("redaction_scanner_fixture_pack_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeRedactionScannerFixturePack.rejection_reasons.includes("redaction_scanner_fixture_pack_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeRedactionScannerFixturePack).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeRedactionScannerFixturePack).includes("private-token"), false);
  assert.equal(JSON.stringify(unsafeRedactionScannerFixturePack).includes("private-note"), false);
  assertSafe(JSON.stringify(unsafeRedactionScannerFixturePack));
  assertNoModelPathLeak(JSON.stringify(unsafeRedactionScannerFixturePack));

  const defaultEvidenceLinkManifest = createMotionDatasetRealRowEvidenceLinkManifestSummary();
  assert.equal(defaultEvidenceLinkManifest.schema, LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA);
  assert.equal(defaultEvidenceLinkManifest.motion_dataset_real_row_evidence_link_manifest_status, "planning_only_blocked");
  assert.equal(defaultEvidenceLinkManifest.planning_only_boundary, true);
  assert.equal(defaultEvidenceLinkManifest.evidence_link_manifest_only_boundary, true);
  assert.equal(defaultEvidenceLinkManifest.no_real_evidence_boundary, true);
  assert.equal(defaultEvidenceLinkManifest.no_real_row_ingestion_boundary, true);
  assert.equal(defaultEvidenceLinkManifest.no_row_body_read_boundary, true);
  assert.equal(defaultEvidenceLinkManifest.real_row_data_present, false);
  assert.equal(defaultEvidenceLinkManifest.checked_row_count, 0);
  assert.equal(defaultEvidenceLinkManifest.motion_dataset_executable, false);
  assert.equal(defaultEvidenceLinkManifest.motion_dataset_ready_candidate, false);
  assert.equal(defaultEvidenceLinkManifest.runtime_readiness_claimed, false);
  assert.equal(defaultEvidenceLinkManifest.production_readiness_claimed, false);
  assert.equal(defaultEvidenceLinkManifest.priority1_status, "BLOCKED");
  assert.equal(defaultEvidenceLinkManifest.owner_confirmation_required, true);
  assert.equal(defaultEvidenceLinkManifest.owner_confirmation_confirmed, false);
  assert.equal(defaultEvidenceLinkManifest.go_nogo_status, "no_go");
  assert.equal(defaultEvidenceLinkManifest.go_candidate, false);
  assert.equal(defaultEvidenceLinkManifest.blocker_resolved, false);
  assert.equal(defaultEvidenceLinkManifest.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultEvidenceLinkManifest.evidence_link_manifest_is_real_evidence, false);
  assert.equal(defaultEvidenceLinkManifest.future_real_reference_is_location_value, false);
  assert.equal(defaultEvidenceLinkManifest.future_real_row_file_ref_status, "pending_label_only");
  assert.equal(defaultEvidenceLinkManifest.future_real_row_audit_ref_status, "pending_label_only");
  assert.equal(defaultEvidenceLinkManifest.future_real_redaction_scan_ref_status, "pending_label_only");
  assert.equal(defaultEvidenceLinkManifest.future_owner_confirmation_ref_status, "pending_label_only_unconfirmed");
  assert.equal(defaultEvidenceLinkManifest.future_fresh_resident_evidence_ref_status, "pending_label_only_not_evidence");
  assert.equal(defaultEvidenceLinkManifest.future_go_nogo_review_ref_status, "pending_label_only_no_go");
  assert.equal(defaultEvidenceLinkManifest.same_head_remote_policy_required, true);
  assert.equal(defaultEvidenceLinkManifest.local_evidence_promoted_to_remote, false);
  assert.equal(defaultEvidenceLinkManifest.decision_capsule_machine_source_preserved, true);
  assert.equal(defaultEvidenceLinkManifest.pr_body_human_summary_only, true);
  assert.deepEqual(defaultEvidenceLinkManifest.required_link_refs, [...LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS]);
  assert.deepEqual(defaultEvidenceLinkManifest.required_evidence_ref_types, [...LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES]);
  assert.equal(defaultEvidenceLinkManifest.required_link_refs.includes("future_real_row_file_ref"), true);
  assert.equal(defaultEvidenceLinkManifest.required_link_refs.includes("future_fresh_resident_evidence_ref"), true);
  assertSafe(JSON.stringify(defaultEvidenceLinkManifest));
  assertNoModelPathLeak(JSON.stringify(defaultEvidenceLinkManifest));

  const unsafeEvidenceLinkManifest = createMotionDatasetRealRowEvidenceLinkManifestSummary({
    future_real_row_file_ref: "private-file",
    future_real_row_audit_status: "complete",
    raw_dataset_row_body: "private-row",
    actual_file_path_value: "private-path",
    actual_file_content: "private-content",
    owner_private_note: "private-note",
    real_evidence_present: true,
    checked_row_count: 2,
    real_row_data_present: true,
    row_body_read: true,
    renderer_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    owner_confirmation_confirmed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
    motion_dataset_executable: true,
  });
  assert.equal(unsafeEvidenceLinkManifest.real_row_data_present, false);
  assert.equal(unsafeEvidenceLinkManifest.checked_row_count, 0);
  assert.equal(unsafeEvidenceLinkManifest.motion_dataset_executable, false);
  assert.equal(unsafeEvidenceLinkManifest.runtime_readiness_claimed, false);
  assert.equal(unsafeEvidenceLinkManifest.production_readiness_claimed, false);
  assert.equal(unsafeEvidenceLinkManifest.owner_confirmation_confirmed, false);
  assert.equal(unsafeEvidenceLinkManifest.priority1_status, "BLOCKED");
  assert.equal(unsafeEvidenceLinkManifest.go_nogo_status, "no_go");
  assert.equal(unsafeEvidenceLinkManifest.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_raw_or_private_ref"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_real_evidence_claim"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_row_body_or_file_read"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_readiness_claim"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_owner_confirmation"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_priority1_resolution"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_trusted_loader_request"), true);
  assert.equal(unsafeEvidenceLinkManifest.blocked_reasons.includes("evidence_link_manifest_rejected_motion_execution"), true);
  assert.equal(JSON.stringify(unsafeEvidenceLinkManifest).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeEvidenceLinkManifest).includes("private-file"), false);
  assertSafe(JSON.stringify(unsafeEvidenceLinkManifest));
  assertNoModelPathLeak(JSON.stringify(unsafeEvidenceLinkManifest));

  const defaultGoNoGoBlockerMap = createMotionDatasetRealRowGoNoGoBlockerMapSummary();
  assert.equal(defaultGoNoGoBlockerMap.schema, LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA);
  assert.equal(defaultGoNoGoBlockerMap.motion_dataset_real_row_go_nogo_blocker_map_status, "planning_only_blocked");
  assert.equal(defaultGoNoGoBlockerMap.planning_only_boundary, true);
  assert.equal(defaultGoNoGoBlockerMap.go_nogo_map_only_boundary, true);
  assert.equal(defaultGoNoGoBlockerMap.no_go_preserved_boundary, true);
  assert.equal(defaultGoNoGoBlockerMap.no_real_row_ingestion_boundary, true);
  assert.equal(defaultGoNoGoBlockerMap.no_row_body_read_boundary, true);
  assert.equal(defaultGoNoGoBlockerMap.go_nogo_status, "no_go");
  assert.equal(defaultGoNoGoBlockerMap.go_candidate, false);
  assert.equal(defaultGoNoGoBlockerMap.blocker_resolved, false);
  assert.equal(defaultGoNoGoBlockerMap.owner_confirmation_required, true);
  assert.equal(defaultGoNoGoBlockerMap.owner_confirmation_confirmed, false);
  assert.equal(defaultGoNoGoBlockerMap.real_row_data_present, false);
  assert.equal(defaultGoNoGoBlockerMap.checked_row_count, 0);
  assert.equal(defaultGoNoGoBlockerMap.motion_dataset_executable, false);
  assert.equal(defaultGoNoGoBlockerMap.runtime_readiness_claimed, false);
  assert.equal(defaultGoNoGoBlockerMap.production_readiness_claimed, false);
  assert.equal(defaultGoNoGoBlockerMap.priority1_status, "BLOCKED");
  assert.equal(defaultGoNoGoBlockerMap.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultGoNoGoBlockerMap.go_nogo_blocker_map_is_go_approval, false);
  assert.deepEqual(defaultGoNoGoBlockerMap.required_blocker_ids, [...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS]);
  assert.deepEqual(defaultGoNoGoBlockerMap.required_resolution_prerequisites, [...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_RESOLUTION_PREREQUISITES]);
  assert.equal(defaultGoNoGoBlockerMap.required_blocker_ids.includes("checked_row_count_zero"), true);
  assert.equal(defaultGoNoGoBlockerMap.required_blocker_ids.includes("priority1_blocked"), true);
  assert.equal(defaultGoNoGoBlockerMap.required_blocker_ids.includes("trusted_loader_disabled"), true);
  assert.equal(defaultGoNoGoBlockerMap.required_go_candidate_conditions.includes("go_nogo_review_passed_in_future_task"), true);
  assertSafe(JSON.stringify(defaultGoNoGoBlockerMap));
  assertNoModelPathLeak(JSON.stringify(defaultGoNoGoBlockerMap));

  const unsafeGoNoGoBlockerMap = createMotionDatasetRealRowGoNoGoBlockerMapSummary({
    go_nogo_status: "go",
    go_candidate: true,
    blocker_resolved: true,
    priority1_resolved: true,
    owner_confirmation_confirmed: true,
    raw_dataset_row_body: "private-row",
    actual_file_path_value: "private-path",
    actual_file_content: "private-content",
    checked_row_count: 5,
    real_row_data_present: true,
    row_body_read: true,
    motion_dataset_executable: true,
    renderer_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeGoNoGoBlockerMap.go_nogo_status, "no_go");
  assert.equal(unsafeGoNoGoBlockerMap.go_candidate, false);
  assert.equal(unsafeGoNoGoBlockerMap.blocker_resolved, false);
  assert.equal(unsafeGoNoGoBlockerMap.owner_confirmation_confirmed, false);
  assert.equal(unsafeGoNoGoBlockerMap.real_row_data_present, false);
  assert.equal(unsafeGoNoGoBlockerMap.checked_row_count, 0);
  assert.equal(unsafeGoNoGoBlockerMap.motion_dataset_executable, false);
  assert.equal(unsafeGoNoGoBlockerMap.runtime_readiness_claimed, false);
  assert.equal(unsafeGoNoGoBlockerMap.production_readiness_claimed, false);
  assert.equal(unsafeGoNoGoBlockerMap.priority1_status, "BLOCKED");
  assert.equal(unsafeGoNoGoBlockerMap.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeGoNoGoBlockerMap.required_no_go_reasons.includes("go_nogo_blocker_map_rejected_go_approval"), true);
  assert.equal(unsafeGoNoGoBlockerMap.required_no_go_reasons.includes("go_nogo_blocker_map_rejected_blocker_resolution"), true);
  assert.equal(unsafeGoNoGoBlockerMap.required_no_go_reasons.includes("go_nogo_blocker_map_rejected_owner_confirmation"), true);
  assert.equal(unsafeGoNoGoBlockerMap.required_no_go_reasons.includes("go_nogo_blocker_map_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeGoNoGoBlockerMap.required_no_go_reasons.includes("go_nogo_blocker_map_rejected_row_body_or_file_read"), true);
  assert.equal(unsafeGoNoGoBlockerMap.required_no_go_reasons.includes("go_nogo_blocker_map_rejected_motion_execution"), true);
  assert.equal(unsafeGoNoGoBlockerMap.required_no_go_reasons.includes("go_nogo_blocker_map_rejected_readiness_claim"), true);
  assert.equal(unsafeGoNoGoBlockerMap.required_no_go_reasons.includes("go_nogo_blocker_map_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeGoNoGoBlockerMap).includes("private-row"), false);
  assertSafe(JSON.stringify(unsafeGoNoGoBlockerMap));
  assertNoModelPathLeak(JSON.stringify(unsafeGoNoGoBlockerMap));

  const defaultPreIngestionReviewPacket = createMotionDatasetRealRowPreIngestionReviewPacketSummary();
  assert.equal(defaultPreIngestionReviewPacket.schema, LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA);
  assert.equal(defaultPreIngestionReviewPacket.motion_dataset_real_row_pre_ingestion_review_packet_status, "planning_only_blocked");
  assert.equal(defaultPreIngestionReviewPacket.planning_only_boundary, true);
  assert.equal(defaultPreIngestionReviewPacket.pre_ingestion_review_only_boundary, true);
  assert.equal(defaultPreIngestionReviewPacket.no_approval_boundary, true);
  assert.equal(defaultPreIngestionReviewPacket.no_go_preserved_boundary, true);
  assert.equal(defaultPreIngestionReviewPacket.metadata_only_preservation_boundary, true);
  assert.equal(defaultPreIngestionReviewPacket.no_real_evidence_boundary, true);
  assert.equal(defaultPreIngestionReviewPacket.no_real_row_ingestion_boundary, true);
  assert.equal(defaultPreIngestionReviewPacket.no_row_body_read_boundary, true);
  assert.equal(defaultPreIngestionReviewPacket.pre_ingestion_review_only, true);
  assert.equal(defaultPreIngestionReviewPacket.pre_ingestion_review_packet_is_owner_approval, false);
  assert.equal(defaultPreIngestionReviewPacket.owner_approval_created, false);
  assert.equal(defaultPreIngestionReviewPacket.owner_approval_confirmed, false);
  assert.equal(defaultPreIngestionReviewPacket.owner_confirmation_confirmed, false);
  assert.equal(defaultPreIngestionReviewPacket.real_row_data_present, false);
  assert.equal(defaultPreIngestionReviewPacket.checked_row_count, 0);
  assert.equal(defaultPreIngestionReviewPacket.motion_dataset_executable, false);
  assert.equal(defaultPreIngestionReviewPacket.runtime_readiness_claimed, false);
  assert.equal(defaultPreIngestionReviewPacket.production_readiness_claimed, false);
  assert.equal(defaultPreIngestionReviewPacket.priority1_status, "BLOCKED");
  assert.equal(defaultPreIngestionReviewPacket.go_nogo_status, "no_go");
  assert.equal(defaultPreIngestionReviewPacket.go_candidate, false);
  assert.equal(defaultPreIngestionReviewPacket.blocker_resolved, false);
  assert.equal(defaultPreIngestionReviewPacket.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultPreIngestionReviewPacket.required_pre_ingestion_artifacts, [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS]);
  assert.deepEqual(defaultPreIngestionReviewPacket.required_owner_review_items, [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS]);
  assert.deepEqual(defaultPreIngestionReviewPacket.required_missing_blocker_checks, [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_MISSING_BLOCKER_CHECKS]);
  assert.equal(defaultPreIngestionReviewPacket.required_pre_ingestion_artifacts.includes("go_nogo_blocker_map"), true);
  assert.equal(defaultPreIngestionReviewPacket.required_owner_review_items.includes("future_go_nogo_review"), true);
  assert.equal(defaultPreIngestionReviewPacket.required_missing_blocker_checks.includes("checked_row_count_zero"), true);
  assert.equal(defaultPreIngestionReviewPacket.required_renderer_ready_checks.includes("model_loaded"), true);
  assertSafe(JSON.stringify(defaultPreIngestionReviewPacket));
  assertNoModelPathLeak(JSON.stringify(defaultPreIngestionReviewPacket));

  const unsafePreIngestionReviewPacket = createMotionDatasetRealRowPreIngestionReviewPacketSummary({
    future_source_hash_value: "private-hash",
    raw_dataset_row_body: "private-row",
    actual_file_path_value: "private-path",
    actual_file_content: "private-content",
    owner_private_note: "private-note",
    real_evidence_present: true,
    fresh_resident_evidence_present: true,
    owner_approval_confirmed: true,
    owner_confirmation_confirmed: true,
    checked_row_count: 7,
    real_row_data_present: true,
    row_body_read: true,
    motion_dataset_executable: true,
    renderer_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafePreIngestionReviewPacket.owner_approval_confirmed, false);
  assert.equal(unsafePreIngestionReviewPacket.owner_confirmation_confirmed, false);
  assert.equal(unsafePreIngestionReviewPacket.real_row_data_present, false);
  assert.equal(unsafePreIngestionReviewPacket.checked_row_count, 0);
  assert.equal(unsafePreIngestionReviewPacket.motion_dataset_executable, false);
  assert.equal(unsafePreIngestionReviewPacket.runtime_readiness_claimed, false);
  assert.equal(unsafePreIngestionReviewPacket.production_readiness_claimed, false);
  assert.equal(unsafePreIngestionReviewPacket.priority1_status, "BLOCKED");
  assert.equal(unsafePreIngestionReviewPacket.go_nogo_status, "no_go");
  assert.equal(unsafePreIngestionReviewPacket.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_raw_or_private_material"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_real_evidence_claim"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_owner_approval"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_owner_confirmation"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_row_body_or_file_read"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_motion_execution"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_readiness_claim"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_priority1_resolution"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafePreIngestionReviewPacket.blocked_reasons.includes("pre_ingestion_review_packet_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafePreIngestionReviewPacket).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafePreIngestionReviewPacket).includes("private-hash"), false);
  assertSafe(JSON.stringify(unsafePreIngestionReviewPacket));
  assertNoModelPathLeak(JSON.stringify(unsafePreIngestionReviewPacket));

  const defaultFinalDryRunChecklist = createMotionDatasetRealRowFinalDryRunChecklistSummary();
  assert.equal(defaultFinalDryRunChecklist.schema, LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA);
  assert.equal(defaultFinalDryRunChecklist.motion_dataset_real_row_final_dry_run_checklist_status, "planning_only_blocked");
  assert.equal(defaultFinalDryRunChecklist.planning_only_boundary, true);
  assert.equal(defaultFinalDryRunChecklist.final_dry_run_only_boundary, true);
  assert.equal(defaultFinalDryRunChecklist.no_actual_ingestion_boundary, true);
  assert.equal(defaultFinalDryRunChecklist.no_real_row_ingestion_boundary, true);
  assert.equal(defaultFinalDryRunChecklist.no_row_body_read_boundary, true);
  assert.equal(defaultFinalDryRunChecklist.final_dry_run_only, true);
  assert.equal(defaultFinalDryRunChecklist.final_dry_run_checklist_is_ingestion_approval, false);
  assert.equal(defaultFinalDryRunChecklist.owner_approval_confirmed, false);
  assert.equal(defaultFinalDryRunChecklist.owner_confirmation_confirmed, false);
  assert.equal(defaultFinalDryRunChecklist.real_row_data_present, false);
  assert.equal(defaultFinalDryRunChecklist.checked_row_count, 0);
  assert.equal(defaultFinalDryRunChecklist.motion_dataset_executable, false);
  assert.equal(defaultFinalDryRunChecklist.runtime_readiness_claimed, false);
  assert.equal(defaultFinalDryRunChecklist.production_readiness_claimed, false);
  assert.equal(defaultFinalDryRunChecklist.priority1_status, "BLOCKED");
  assert.equal(defaultFinalDryRunChecklist.go_nogo_status, "no_go");
  assert.equal(defaultFinalDryRunChecklist.go_candidate, false);
  assert.equal(defaultFinalDryRunChecklist.blocker_resolved, false);
  assert.equal(defaultFinalDryRunChecklist.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultFinalDryRunChecklist.required_checklist_items, [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS]);
  assert.deepEqual(defaultFinalDryRunChecklist.required_blocker_visibility, [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_BLOCKER_VISIBILITY]);
  assert.deepEqual(defaultFinalDryRunChecklist.required_artifact_refs, [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS]);
  assert.equal(defaultFinalDryRunChecklist.required_checklist_items.includes("pre_ingestion_review_packet_visible"), true);
  assert.equal(defaultFinalDryRunChecklist.required_blocker_visibility.includes("priority1_blocked"), true);
  assert.equal(defaultFinalDryRunChecklist.required_artifact_refs.includes("pre_ingestion_review_packet"), true);
  assertSafe(JSON.stringify(defaultFinalDryRunChecklist));
  assertNoModelPathLeak(JSON.stringify(defaultFinalDryRunChecklist));

  const unsafeFinalDryRunChecklist = createMotionDatasetRealRowFinalDryRunChecklistSummary({
    future_source_hash_value: "private-hash",
    raw_dataset_row_body: "private-row",
    actual_file_path_value: "private-path",
    actual_file_content: "private-content",
    owner_private_note: "private-note",
    real_evidence_present: true,
    fresh_resident_evidence_present: true,
    owner_approval_confirmed: true,
    owner_confirmation_confirmed: true,
    checked_row_count: 4,
    real_row_data_present: true,
    row_body_read: true,
    motion_dataset_executable: true,
    renderer_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeFinalDryRunChecklist.owner_approval_confirmed, false);
  assert.equal(unsafeFinalDryRunChecklist.owner_confirmation_confirmed, false);
  assert.equal(unsafeFinalDryRunChecklist.real_row_data_present, false);
  assert.equal(unsafeFinalDryRunChecklist.checked_row_count, 0);
  assert.equal(unsafeFinalDryRunChecklist.motion_dataset_executable, false);
  assert.equal(unsafeFinalDryRunChecklist.runtime_readiness_claimed, false);
  assert.equal(unsafeFinalDryRunChecklist.production_readiness_claimed, false);
  assert.equal(unsafeFinalDryRunChecklist.priority1_status, "BLOCKED");
  assert.equal(unsafeFinalDryRunChecklist.go_nogo_status, "no_go");
  assert.equal(unsafeFinalDryRunChecklist.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_raw_or_private_material"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_real_evidence_claim"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_owner_approval"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_owner_confirmation"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_row_body_or_file_read"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_motion_execution"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_readiness_claim"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_priority1_resolution"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeFinalDryRunChecklist.blocked_reasons.includes("final_dry_run_checklist_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeFinalDryRunChecklist).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeFinalDryRunChecklist).includes("private-hash"), false);
  assertSafe(JSON.stringify(unsafeFinalDryRunChecklist));
  assertNoModelPathLeak(JSON.stringify(unsafeFinalDryRunChecklist));

  const defaultMissingDataGate = createMotionDatasetRealRowMissingDataFailClosedGateSummary();
  assert.equal(defaultMissingDataGate.schema, LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA);
  assert.equal(defaultMissingDataGate.motion_dataset_real_row_missing_data_fail_closed_gate_status, "planning_only_blocked");
  assert.equal(defaultMissingDataGate.planning_only_boundary, true);
  assert.equal(defaultMissingDataGate.missing_data_gate_only_boundary, true);
  assert.equal(defaultMissingDataGate.fail_closed_boundary, true);
  assert.equal(defaultMissingDataGate.no_actual_ingestion_allowed_boundary, true);
  assert.equal(defaultMissingDataGate.no_real_row_ingestion_boundary, true);
  assert.equal(defaultMissingDataGate.no_row_body_read_boundary, true);
  assert.equal(defaultMissingDataGate.missing_data_gate_only, true);
  assert.equal(defaultMissingDataGate.fail_closed, true);
  assert.equal(defaultMissingDataGate.actual_ingestion_allowed, false);
  assert.equal(defaultMissingDataGate.real_row_data_present, false);
  assert.equal(defaultMissingDataGate.checked_row_count, 0);
  assert.equal(defaultMissingDataGate.motion_dataset_executable, false);
  assert.equal(defaultMissingDataGate.runtime_readiness_claimed, false);
  assert.equal(defaultMissingDataGate.production_readiness_claimed, false);
  assert.equal(defaultMissingDataGate.priority1_status, "BLOCKED");
  assert.equal(defaultMissingDataGate.go_nogo_status, "no_go");
  assert.equal(defaultMissingDataGate.go_candidate, false);
  assert.equal(defaultMissingDataGate.blocker_resolved, false);
  assert.equal(defaultMissingDataGate.owner_confirmation_required, true);
  assert.equal(defaultMissingDataGate.owner_confirmation_confirmed, false);
  assert.equal(defaultMissingDataGate.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(defaultMissingDataGate.required_missing_data_blockers, [...LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_BLOCKERS]);
  assert.deepEqual(defaultMissingDataGate.required_future_data_prerequisites, [...LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FUTURE_PREREQUISITES]);
  assert.equal(defaultMissingDataGate.required_missing_data_blockers.includes("missing_owner_provided_row_file"), true);
  assert.equal(defaultMissingDataGate.required_missing_data_blockers.includes("checked_row_count_zero"), true);
  assert.equal(defaultMissingDataGate.required_future_data_prerequisites.includes("owner_provided_jsonl_or_csv_file"), true);
  assert.equal(defaultMissingDataGate.decision_capsule_machine_source_preserved, true);
  assert.equal(defaultMissingDataGate.pr_body_human_summary_only, true);
  assertSafe(JSON.stringify(defaultMissingDataGate));
  assertNoModelPathLeak(JSON.stringify(defaultMissingDataGate));

  const unsafeMissingDataGate = createMotionDatasetRealRowMissingDataFailClosedGateSummary({
    actual_ingestion_allowed: true,
    ingest_rows: true,
    raw_dataset_row_body: "private-row",
    actual_file_path_value: "private-path",
    actual_file_content: "private-content",
    future_source_hash_value: "private-hash",
    real_evidence_present: true,
    owner_confirmation_confirmed: true,
    checked_row_count: 8,
    real_row_data_present: true,
    row_body_read: true,
    motion_dataset_executable: true,
    renderer_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_resolved: true,
    go_nogo_status: "go",
    trusted_loader_allowlist_enabled: true,
  });
  assert.equal(unsafeMissingDataGate.actual_ingestion_allowed, false);
  assert.equal(unsafeMissingDataGate.owner_confirmation_confirmed, false);
  assert.equal(unsafeMissingDataGate.real_row_data_present, false);
  assert.equal(unsafeMissingDataGate.checked_row_count, 0);
  assert.equal(unsafeMissingDataGate.motion_dataset_executable, false);
  assert.equal(unsafeMissingDataGate.runtime_readiness_claimed, false);
  assert.equal(unsafeMissingDataGate.production_readiness_claimed, false);
  assert.equal(unsafeMissingDataGate.priority1_status, "BLOCKED");
  assert.equal(unsafeMissingDataGate.go_nogo_status, "no_go");
  assert.equal(unsafeMissingDataGate.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_actual_ingestion_request"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_raw_or_private_material"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_real_evidence_claim"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_owner_confirmation"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_row_body_or_file_read"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_motion_execution"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_readiness_claim"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_priority1_resolution"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeMissingDataGate.blocked_reasons.includes("missing_data_fail_closed_gate_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeMissingDataGate).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeMissingDataGate).includes("private-hash"), false);
  assertSafe(JSON.stringify(unsafeMissingDataGate));
  assertNoModelPathLeak(JSON.stringify(unsafeMissingDataGate));
  assert.equal(unsafeRealRowAuditManifest.trusted_loader_allowlist_enabled, false);
  assert.equal(unsafeRealRowAuditManifest.rejection_reasons.includes("real_row_audit_manifest_rejected_raw_or_private_field"), true);
  assert.equal(unsafeRealRowAuditManifest.rejection_reasons.includes("real_row_audit_manifest_rejected_real_row_or_checked_count"), true);
  assert.equal(unsafeRealRowAuditManifest.rejection_reasons.includes("real_row_audit_manifest_rejected_row_body_or_file_read"), true);
  assert.equal(unsafeRealRowAuditManifest.rejection_reasons.includes("real_row_audit_manifest_rejected_motion_execution"), true);
  assert.equal(unsafeRealRowAuditManifest.rejection_reasons.includes("real_row_audit_manifest_rejected_readiness_claim"), true);
  assert.equal(unsafeRealRowAuditManifest.rejection_reasons.includes("real_row_audit_manifest_rejected_owner_confirmation"), true);
  assert.equal(unsafeRealRowAuditManifest.rejection_reasons.includes("real_row_audit_manifest_rejected_go_or_blocker_resolution"), true);
  assert.equal(unsafeRealRowAuditManifest.rejection_reasons.includes("real_row_audit_manifest_rejected_trusted_loader_request"), true);
  assert.equal(JSON.stringify(unsafeRealRowAuditManifest).includes("private-row"), false);
  assert.equal(JSON.stringify(unsafeRealRowAuditManifest).includes("private-file"), false);
  assertSafe(JSON.stringify(unsafeRealRowAuditManifest));
  assertNoModelPathLeak(JSON.stringify(unsafeRealRowAuditManifest));

  const defaultGoNoGo = createGoNoGoPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: ownerProvidedAllowlistPreflight,
    enablementGateSummary: ownerProvidedEnablementGate,
    ownerHandoffSummary: ownerProvidedOwnerHandoff,
    freshEvidenceBundleSummary: defaultFreshEvidenceBundle,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(defaultGoNoGo.go_nogo_status, "no_go");
  assert.equal(defaultGoNoGo.go_candidate, false);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_missing_fresh_real_evidence"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_fixture_evidence_only"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_missing_owner_confirmation"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_license_attention_required"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_priority1_unresolved"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_motion_dataset_non_executable"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_runtime_not_ready"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_production_not_ready"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("degraded_mode_available_not_go"), true);
  assert.equal(defaultGoNoGo.degraded_mode_available, true);
  assert.equal(defaultGoNoGo.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultGoNoGo.no_loader_trusted, true);
  assert.equal(defaultGoNoGo.renderer_ready, false);
  assert.equal(defaultGoNoGo.model_loaded, false);
  assert.equal(defaultGoNoGo.scene_loaded, false);
  assert.equal(defaultGoNoGo.browser_cue_delivery_ready, false);
  assert.equal(defaultGoNoGo.runtime_readiness_claimed, false);
  assert.equal(defaultGoNoGo.production_readiness_claimed, false);
  assert.equal(defaultGoNoGo.priority1_status, "BLOCKED");
  assert.equal(defaultGoNoGo.motion_dataset_executable, false);
  assert.equal(JSON.stringify(defaultGoNoGo).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(defaultGoNoGo));
  assertNoModelPathLeak(JSON.stringify(defaultGoNoGo));

  const defaultRealEvidenceIntake = createRealEvidenceIntakeSummary();
  assert.equal(defaultRealEvidenceIntake.evidence_intake_status, "blocked");
  assert.equal(defaultRealEvidenceIntake.intake_ready_candidate, false);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_missing_schema_version"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_missing_timestamp"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_priority1_unresolved"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_motion_dataset_non_executable"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_not_runtime_ready"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_not_production_ready"), true);
  assert.equal(defaultRealEvidenceIntake.runtime_readiness_claimed, false);
  assert.equal(defaultRealEvidenceIntake.production_readiness_claimed, false);
  assert.equal(defaultRealEvidenceIntake.renderer_ready, false);
  assert.equal(defaultRealEvidenceIntake.model_loaded, false);
  assert.equal(defaultRealEvidenceIntake.scene_loaded, false);
  assert.equal(defaultRealEvidenceIntake.browser_cue_delivery_ready, false);
  assert.equal(defaultRealEvidenceIntake.priority1_status, "BLOCKED");
  assert.equal(defaultRealEvidenceIntake.motion_dataset_executable, false);
  assertSafe(JSON.stringify(defaultRealEvidenceIntake));
  assertNoModelPathLeak(JSON.stringify(defaultRealEvidenceIntake));

  const fixtureRealEvidenceIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "fixture",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(fixtureRealEvidenceIntake.fixture_evidence_status, "fixture_not_real_evidence");
  assert.equal(fixtureRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_fixture_evidence_only"), true);
  assert.equal(fixtureRealEvidenceIntake.intake_ready_candidate, false);

  const dryRunRealEvidenceIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "dry_run",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(dryRunRealEvidenceIntake.dry_run_evidence_status, "dry_run_not_real_evidence");
  assert.equal(dryRunRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_dry_run_evidence_only"), true);

  const staleRealEvidenceIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "real_probe_summary",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs - 600_000,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(staleRealEvidenceIntake.freshness_status, "stale");
  assert.equal(staleRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_stale_evidence"), true);

  const manualSummaryIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "manual_summary",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(manualSummaryIntake.intake_blocked_reasons.includes("intake_blocked_manual_summary_without_owner_confirmation"), true);
  assert.equal(manualSummaryIntake.intake_ready_candidate, false);

  const rawPayloadIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "real_probe_summary",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
    raw_renderer_payload: { model_path: ownerFrameworkLoaderPath },
  }, { nowMs });
  assert.equal(rawPayloadIntake.unsafe_material_rejected, true);
  assert.equal(rawPayloadIntake.intake_blocked_reasons.includes("intake_blocked_unsafe_material_rejected"), true);
  assert.equal(JSON.stringify(rawPayloadIntake).includes(ownerFrameworkLoaderPath), false);

  const unknownSourceIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "unknown_probe",
    component: "unknown_component",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(unknownSourceIntake.rejected_source_type, "unknown_probe");
  assert.equal(unknownSourceIntake.component, "external_boundary_component");
  assert.equal(unknownSourceIntake.intake_blocked_reasons.includes("intake_blocked_unknown_source_type"), true);
  assert.equal(unknownSourceIntake.intake_blocked_reasons.includes("intake_blocked_external_boundary_component"), true);

  const mockOwnerIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "operator_confirmed_summary",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs, mockOwnerConfirmation: true });
  assert.equal(mockOwnerIntake.owner_confirmation_status, "mock_owner_confirmation_rejected");
  assert.equal(mockOwnerIntake.intake_blocked_reasons.includes("intake_blocked_mock_owner_confirmation"), true);

  const defaultOwnerConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary();
  assert.equal(defaultOwnerConfirmationEnvelope.owner_confirmation_envelope_status, "blocked");
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_ready_candidate, false);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmed_scopes.length, 0);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_missing_scope"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_missing_timestamp"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_missing_role"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_priority1_unresolved"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_motion_dataset_non_executable"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.runtime_readiness_claimed, false);
  assert.equal(defaultOwnerConfirmationEnvelope.production_readiness_claimed, false);
  assert.equal(defaultOwnerConfirmationEnvelope.renderer_ready, false);
  assert.equal(defaultOwnerConfirmationEnvelope.model_loaded, false);
  assert.equal(defaultOwnerConfirmationEnvelope.scene_loaded, false);
  assert.equal(defaultOwnerConfirmationEnvelope.browser_cue_delivery_ready, false);
  assert.equal(defaultOwnerConfirmationEnvelope.priority1_status, "BLOCKED");
  assert.equal(defaultOwnerConfirmationEnvelope.motion_dataset_executable, false);
  assertSafe(JSON.stringify(defaultOwnerConfirmationEnvelope));

  const wrongRoleConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "go_nogo_preflight_review",
    confirmed_by_role: "reviewer",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
  }, { nowMs, requestedScope: "go_nogo_preflight_review" });
  assert.equal(wrongRoleConfirmationEnvelope.confirmed_by_role_status, "wrong_role_rejected");
  assert.equal(wrongRoleConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_wrong_role"), true);
  assert.equal(wrongRoleConfirmationEnvelope.confirmed_scopes.length, 0);

  const mockConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "go_nogo_preflight_review",
    confirmed_by_role: "owner",
    confirmation_source_kind: "mock",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    mock_confirmation: true,
  }, { nowMs, requestedScope: "go_nogo_preflight_review" });
  assert.equal(mockConfirmationEnvelope.mock_confirmation_status, "mock_confirmation_rejected");
  assert.equal(mockConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_mock_confirmation"), true);

  const expiredConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "runtime_readiness",
    confirmed_by_role: "owner",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs - 120_000,
    confirmation_expires_at_ms: nowMs - 1,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
  }, { nowMs, requestedScope: "runtime_readiness" });
  assert.equal(expiredConfirmationEnvelope.confirmation_expiry_status, "expired_rejected");
  assert.equal(expiredConfirmationEnvelope.expired_scopes.includes("runtime_readiness"), true);
  assert.equal(expiredConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_expired_confirmation"), true);

  const revokedConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "runtime_readiness",
    confirmed_by_role: "owner",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    revoked: true,
  }, { nowMs, requestedScope: "runtime_readiness" });
  assert.equal(revokedConfirmationEnvelope.revoked_scopes.includes("runtime_readiness"), true);
  assert.equal(revokedConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_revoked_confirmation"), true);

  const scopeMismatchConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "go_nogo_preflight_review",
    confirmed_by_role: "owner",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
  }, { nowMs, requestedScope: "actual_trusted_loader_enablement" });
  assert.equal(scopeMismatchConfirmationEnvelope.scope_mismatch_status, "scope_mismatch_rejected");
  assert.equal(scopeMismatchConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_scope_mismatch"), true);
  assert.equal(scopeMismatchConfirmationEnvelope.confirmed_scopes.length, 0);

  for (const scope of ["runtime_readiness", "actual_trusted_loader_enablement", "priority1_resolution", "motion_dataset_execution"]) {
    const scopedEnvelope = createOwnerConfirmationEnvelopeSummary({
      confirmation_scope: scope,
      confirmed_by_role: "owner",
      confirmation_source_kind: "operator_confirmed_summary",
      confirmation_timestamp_ms: nowMs,
      confirmation_expires_at_ms: nowMs + 60_000,
      audit_ref: "safe_audit_ref",
      redaction_status: "pass",
    }, { nowMs, requestedScope: "production_readiness" });
    assert.equal(scopedEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_scope_mismatch"), scope !== "production_readiness");
    assert.equal(scopedEnvelope.confirmation_ready_candidate, false);
  }

  const unsafeOwnerConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "go_nogo_preflight_review",
    confirmed_by_role: "owner",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    raw_owner_confirmation_note: "https://secret.example/owner-note",
  }, { nowMs, requestedScope: "go_nogo_preflight_review" });
  assert.equal(unsafeOwnerConfirmationEnvelope.owner_private_note_redaction_status, "unsafe_material_rejected");
  assert.equal(unsafeOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_unsafe_material_rejected"), true);
  assert.equal(JSON.stringify(unsafeOwnerConfirmationEnvelope).includes("secret.example"), false);

  const defaultEvidenceRequestPacket = createRealEvidenceRequestPacketSummary();
  assert.equal(defaultEvidenceRequestPacket.real_evidence_request_packet_status, "blocked");
  assert.equal(defaultEvidenceRequestPacket.request_packet_ready_candidate, false);
  assert.equal(defaultEvidenceRequestPacket.request_packet_collects_real_evidence, false);
  assert.equal(defaultEvidenceRequestPacket.request_packet_performs_live_probes, false);
  assert.equal(defaultEvidenceRequestPacket.request_packet_creates_owner_confirmation, false);
  assert.equal(defaultEvidenceRequestPacket.request_packet_completeness_is_readiness, false);
  assert.equal(defaultEvidenceRequestPacket.required_evidence_components.includes("priority1_real_resident_evidence"), true);
  assert.equal(defaultEvidenceRequestPacket.required_evidence_components.includes("motion_dataset_row_evidence"), true);
  assert.equal(defaultEvidenceRequestPacket.missing_evidence_components.length, defaultEvidenceRequestPacket.required_evidence_components.length);
  assert.equal(defaultEvidenceRequestPacket.required_confirmation_scopes.includes("owner_confirmation_envelope_review"), true);
  assert.equal(defaultEvidenceRequestPacket.required_confirmation_scopes.includes("runtime_readiness"), true);
  assert.equal(defaultEvidenceRequestPacket.required_confirmation_scopes.includes("production_readiness"), true);
  assert.equal(defaultEvidenceRequestPacket.missing_confirmation_scopes.length, defaultEvidenceRequestPacket.required_confirmation_scopes.length);
  assert.equal(defaultEvidenceRequestPacket.fixture_evidence_status, "fixture_not_real_evidence");
  assert.equal(defaultEvidenceRequestPacket.dry_run_evidence_status, "dry_run_not_real_evidence");
  assert.equal(defaultEvidenceRequestPacket.stale_evidence_status, "stale_not_fresh_evidence");
  assert.equal(defaultEvidenceRequestPacket.mock_owner_confirmation_status, "mock_owner_confirmation_not_real");
  assert.equal(defaultEvidenceRequestPacket.wrong_role_confirmation_status, "wrong_role_confirmation_rejected");
  assert.equal(defaultEvidenceRequestPacket.expired_confirmation_status, "expired_confirmation_rejected");
  assert.equal(defaultEvidenceRequestPacket.revoked_confirmation_status, "revoked_confirmation_rejected");
  assert.equal(defaultEvidenceRequestPacket.owner_confirmation_envelope_status, "schema_only_blocked_or_pending");
  assert.equal(defaultEvidenceRequestPacket.real_evidence_intake_status, "schema_only_blocked_or_attention");
  assert.equal(defaultEvidenceRequestPacket.go_nogo_status, "no_go");
  assert.equal(defaultEvidenceRequestPacket.priority1_status, "BLOCKED");
  assert.equal(defaultEvidenceRequestPacket.motion_dataset_executable, false);
  assert.equal(defaultEvidenceRequestPacket.renderer_ready, false);
  assert.equal(defaultEvidenceRequestPacket.model_loaded, false);
  assert.equal(defaultEvidenceRequestPacket.scene_loaded, false);
  assert.equal(defaultEvidenceRequestPacket.browser_cue_delivery_ready, false);
  assert.equal(defaultEvidenceRequestPacket.runtime_readiness_claimed, false);
  assert.equal(defaultEvidenceRequestPacket.production_readiness_claimed, false);
  assertSafe(JSON.stringify(defaultEvidenceRequestPacket));

  const unsafeEvidenceRequestPacket = createRealEvidenceRequestPacketSummary({
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    source_kind: "fixture",
    raw_request_note: "https://secret.example/request-note",
    raw_owner_note: "private owner note",
  });
  assert.equal(unsafeEvidenceRequestPacket.unsafe_request_note_status, "unsafe_material_rejected");
  assert.equal(unsafeEvidenceRequestPacket.unsafe_owner_note_status, "unsafe_material_rejected");
  assert.equal(unsafeEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_unsafe_material_rejected"), true);
  assert.equal(unsafeEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_fixture_evidence_only"), true);
  assert.equal(JSON.stringify(unsafeEvidenceRequestPacket).includes("secret.example"), false);

  const staleMockEvidenceRequestPacket = createRealEvidenceRequestPacketSummary({
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    source_kind: "dry_run",
    freshness_status: "stale",
    mock_owner_confirmation: true,
    confirmed_by_role: "reviewer",
    confirmation_status: "revoked",
  });
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_dry_run_evidence_only"), true);
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_stale_evidence"), true);
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_mock_owner_confirmation"), true);
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_wrong_role_confirmation"), true);
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_revoked_confirmation"), true);

  const defaultCollectionPlan = createRealResidentEvidenceCollectionPlanSummary();
  assert.equal(defaultCollectionPlan.real_resident_evidence_collection_plan_status, "planning_only");
  assert.equal(defaultCollectionPlan.planning_only_boundary, true);
  assert.equal(defaultCollectionPlan.collection_started, false);
  assert.equal(defaultCollectionPlan.real_probe_started, false);
  assert.equal(defaultCollectionPlan.ready_candidate, false);
  assert.equal(defaultCollectionPlan.runtime_readiness_claimed, false);
  assert.equal(defaultCollectionPlan.production_readiness_claimed, false);
  assert.equal(defaultCollectionPlan.priority1_status, "BLOCKED");
  assert.equal(defaultCollectionPlan.motion_dataset_status, "non_executable");
  assert.equal(defaultCollectionPlan.motion_dataset_executable, false);
  assert.equal(defaultCollectionPlan.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultCollectionPlan.go_nogo_status, "no_go");
  assert.equal(defaultCollectionPlan.go_candidate, false);
  assert.equal(defaultCollectionPlan.collection_plan_collects_real_evidence, false);
  assert.equal(defaultCollectionPlan.collection_plan_performs_live_probes, false);
  assert.equal(defaultCollectionPlan.collection_plan_creates_owner_confirmation, false);
  assert.equal(defaultCollectionPlan.request_packet_status, "request_only_no_collection");
  assert.equal(defaultCollectionPlan.real_evidence_intake_status, "schema_only");
  assert.equal(defaultCollectionPlan.owner_confirmation_envelope_status, "schema_only_blocked_or_pending");
  assert.equal(defaultCollectionPlan.fresh_evidence_bundle_status, "review_preparation_only");
  assert.equal(defaultCollectionPlan.accepted_source_types.includes("real_probe_summary"), true);
  assert.equal(defaultCollectionPlan.accepted_source_types.includes("operator_confirmed_summary"), true);
  assert.equal(defaultCollectionPlan.accepted_source_types.includes("manual_upload_summary"), true);
  assert.equal(defaultCollectionPlan.accepted_source_types.includes("audit_reference"), true);
  assert.equal(defaultCollectionPlan.accepted_source_types.includes("owner_confirmed_reference"), true);
  for (const rejectedSourceType of ["fixture", "dry_run", "mock", "stale", "unsafe_material", "unknown_source_type"]) {
    assert.equal(defaultCollectionPlan.rejected_source_types.includes(rejectedSourceType), true);
  }
  for (const forbiddenField of [
    "cue_body_material",
    "renderer_body_material",
    "evidence_body_material",
    "owner_note_material",
    "request_note_material",
    "loader_candidate_material",
    "loader_error_material",
    "model_location_material",
    "motion_location_material",
    "service_location_value",
    "auth_value",
    "private_value",
    "sdk_vendor_location_material",
    "shell_invocation_body",
  ]) {
    assert.equal(defaultCollectionPlan.forbidden_material_classes.includes(forbiddenField), true);
  }
  for (const stepLabel of [
    "verify_route_guard",
    "verify_renderer_heartbeat_summary",
    "submit_safe_evidence_intake",
    "bind_owner_confirmation_scope",
    "run_go_nogo_preflight_review",
    "keep_priority1_blocked_until_real_fresh_evidence",
    "keep_motion_dataset_non_executable_until_row_schema_and_rows_exist",
  ]) {
    assert.equal(defaultCollectionPlan.safe_collection_sequence.includes(stepLabel), true);
  }
  assert.equal(defaultCollectionPlan.assistant_review_is_owner_confirmation, false);
  assert.equal(defaultCollectionPlan.pr_merge_is_owner_confirmation, false);
  assert.equal(defaultCollectionPlan.remote_pass_is_owner_confirmation, false);
  assertSafe(JSON.stringify(defaultCollectionPlan));

  const defaultCollectorManifest = createRealEvidenceCollectorManifestSummary();
  assert.equal(defaultCollectorManifest.real_evidence_collector_manifest_status, "planning_only");
  assert.equal(defaultCollectorManifest.planning_only_boundary, true);
  assert.equal(defaultCollectorManifest.collector_manifest_ready_candidate, false);
  assert.equal(defaultCollectorManifest.collector_execution_started, false);
  assert.equal(defaultCollectorManifest.collector_real_probe_started, false);
  assert.equal(defaultCollectorManifest.real_evidence_collection_started, false);
  assert.equal(defaultCollectorManifest.real_probe_started, false);
  assert.equal(defaultCollectorManifest.real_renderer_call_started, false);
  assert.equal(defaultCollectorManifest.real_sdk_call_started, false);
  assert.equal(defaultCollectorManifest.external_service_call_started, false);
  assert.equal(defaultCollectorManifest.runtime_readiness_claimed, false);
  assert.equal(defaultCollectorManifest.production_readiness_claimed, false);
  assert.equal(defaultCollectorManifest.priority1_status, "BLOCKED");
  assert.equal(defaultCollectorManifest.motion_dataset_status, "non_executable");
  assert.equal(defaultCollectorManifest.checked_row_count, 0);
  assert.equal(defaultCollectorManifest.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultCollectorManifest.no_loader_trusted, true);
  assert.equal(defaultCollectorManifest.go_nogo_status, "no_go");
  assert.equal(defaultCollectorManifest.go_candidate, false);
  assert.equal(defaultCollectorManifest.blocker_resolved, false);
  assert.equal(defaultCollectorManifest.collector_manifest_executes_collectors, false);
  assert.equal(defaultCollectorManifest.collector_manifest_collects_real_evidence, false);
  assert.equal(defaultCollectorManifest.collector_manifest_performs_live_probes, false);
  assert.equal(defaultCollectorManifest.collector_manifest_calls_real_renderer, false);
  assert.equal(defaultCollectorManifest.collector_manifest_calls_real_sdk, false);
  assert.equal(defaultCollectorManifest.collector_manifest_calls_external_services, false);
  assert.equal(defaultCollectorManifest.collector_manifest_creates_owner_confirmation, false);
  for (const requiredCollector of [
    "live2d_renderer_heartbeat_collector",
    "live2d_model_configured_collector",
    "live2d_cue_capability_collector",
    "live2d_recovery_capability_collector",
    "live2d_route_guard_collector",
    "live2d_evidence_collector_status_collector",
    "live2d_fresh_evidence_bundle_collector",
    "live2d_summary_intake_collector",
    "live2d_owner_confirmation_binding_collector",
    "live2d_go_nogo_blocker_collector",
    "trusted_loader_preflight_collector",
    "trusted_loader_enablement_gate_collector",
    "license_boundary_collector",
    "sdk_vendor_boundary_collector",
    "priority1_blocker_collector",
    "motion_dataset_row_evidence_collector",
  ]) {
    assert.equal(defaultCollectorManifest.required_collectors.includes(requiredCollector), true);
    assert.equal(defaultCollectorManifest.collector_registry[requiredCollector].execution_started, false);
    assert.equal(defaultCollectorManifest.collector_registry[requiredCollector].real_probe_started, false);
  }
  for (const safeField of [
    "component",
    "collector_name",
    "collector_status",
    "evidence_source_type",
    "freshness_status",
    "safe_evidence_ref",
    "safe_audit_ref",
    "head_sha_ref",
    "run_id_ref",
    "file_scope",
    "checked_at_bucket",
    "status_reason_code",
    "redaction_status",
    "blocker_labels",
    "safe_next_action",
  ]) {
    assert.equal(defaultCollectorManifest.collector_safe_output_fields.includes(safeField), true);
  }
  for (const rejectedSourceType of ["fixture", "dry_run", "mock", "stale", "unsafe_material", "unknown_source_type"]) {
    assert.equal(defaultCollectorManifest.collector_rejected_source_types.includes(rejectedSourceType), true);
  }
  assert.equal(defaultCollectorManifest.collector_required_source_binding, "required");
  assert.equal(defaultCollectorManifest.collector_required_freshness_binding, "required");
  assert.equal(defaultCollectorManifest.collector_required_audit_binding, "required");
  assert.equal(defaultCollectorManifest.collector_required_redaction_status, "pass_required");
  assert.equal(defaultCollectorManifest.collector_network_policy, "blocked_by_default_no_external_services");
  assert.equal(defaultCollectorManifest.collector_sdk_policy, "forbid_real_sdk_call");
  assert.equal(defaultCollectorManifest.collector_renderer_policy, "forbid_real_renderer_call");
  assert.equal(defaultCollectorManifest.fixture_evidence_policy, "fixture_collector_output_is_not_real_evidence");
  assert.equal(defaultCollectorManifest.dry_run_evidence_policy, "dry_run_collector_output_is_not_real_evidence");
  assert.equal(defaultCollectorManifest.stale_evidence_policy, "stale_collector_output_is_not_fresh_evidence");
  assert.equal(defaultCollectorManifest.request_packet_status, "request_only_no_collection");
  assert.equal(defaultCollectorManifest.collection_plan_status, "planning_only");
  assert.equal(defaultCollectorManifest.freshness_threshold_status, "planning_only");
  assert.equal(defaultCollectorManifest.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(defaultCollectorManifest.summary_intake_binding_status, "planning_only");
  assert.equal(defaultCollectorManifest.owner_confirmation_binding_status, "planning_only");
  assert.equal(defaultCollectorManifest.go_nogo_blocker_resolution_status, "planning_only");
  assertSafe(JSON.stringify(defaultCollectorManifest));

  const rejectedFixtureCollectorManifest = createRealEvidenceCollectorManifestSummary({ source_type: "fixture" });
  assert.equal(rejectedFixtureCollectorManifest.source_type_status, "rejected_fixture");
  assert.equal(rejectedFixtureCollectorManifest.blocked_reasons.includes("collector_manifest_rejected_fixture"), true);

  const unsafeCollectorManifest = createRealEvidenceCollectorManifestSummary({
    source_type: "dry_run",
    raw_evidence_body: "https://secret.example/evidence",
    raw_cue_payload: "private cue",
    raw_renderer_payload: "private renderer",
    endpoint_value: "https://secret.example",
    token_value: "secret-token",
    model_path: "internal_model_path",
    motion_path: "motion_path",
    sdk_vendor_path: "sdk_vendor_path",
  });
  assert.equal(unsafeCollectorManifest.source_type_status, "rejected_dry_run");
  assert.equal(unsafeCollectorManifest.forbidden_material_status, "forbidden_material_rejected");
  assert.equal(unsafeCollectorManifest.blocked_reasons.includes("collector_manifest_rejected_forbidden_raw_field"), true);
  assertSafe(JSON.stringify(unsafeCollectorManifest));

  const defaultCollectorFixturePack = createRealEvidenceCollectorFixturePackSummary();
  assert.equal(defaultCollectorFixturePack.real_evidence_collector_fixture_pack_status, "planning_only");
  assert.equal(defaultCollectorFixturePack.fixture_pack_ready_candidate, false);
  assert.equal(defaultCollectorFixturePack.collector_fixture_pack_ready_candidate, false);
  assert.equal(defaultCollectorFixturePack.collector_dry_run_verifier_status, "planning_only");
  assert.equal(defaultCollectorFixturePack.planning_only_boundary, true);
  assert.equal(defaultCollectorFixturePack.synthetic_only_boundary, true);
  assert.equal(defaultCollectorFixturePack.no_real_collection_boundary, true);
  assert.equal(defaultCollectorFixturePack.no_live_probe_boundary, true);
  assert.equal(defaultCollectorFixturePack.no_owner_confirmation_created_boundary, true);
  assert.equal(defaultCollectorFixturePack.no_owner_confirmation_confirmed_boundary, true);
  assert.equal(defaultCollectorFixturePack.no_readiness_boundary, true);
  assert.equal(defaultCollectorFixturePack.no_go_preserved, true);
  for (const positiveCase of [
    "collector_fixture_positive_required_collectors_present",
    "collector_fixture_positive_safe_output_fields_present",
    "collector_fixture_positive_source_binding_present",
    "collector_fixture_positive_freshness_binding_present",
    "collector_fixture_positive_audit_binding_present",
    "collector_fixture_positive_redaction_status_pass",
    "collector_fixture_positive_safe_summary_only",
  ]) {
    assert.equal(defaultCollectorFixturePack.positive_fixture_cases.includes(positiveCase), true);
    assert.equal(defaultCollectorFixturePack.required_collector_fixture_cases.includes(positiveCase), true);
    assert.equal(defaultCollectorFixturePack.collector_fixture_expected_safe_passes.includes(positiveCase), true);
  }
  for (const rejectionCase of [
    "collector_fixture_reject_missing_collector",
    "collector_fixture_reject_missing_safe_output_field",
    "collector_fixture_reject_fixture_source",
    "collector_fixture_reject_dry_run_source",
    "collector_fixture_reject_mock_source",
    "collector_fixture_reject_stale_source",
    "collector_fixture_reject_unknown_source",
    "collector_fixture_reject_missing_source_binding",
    "collector_fixture_reject_missing_freshness_binding",
    "collector_fixture_reject_missing_audit_binding",
    "collector_fixture_reject_missing_redaction_status",
    "collector_fixture_reject_forbidden_material",
    "collector_fixture_reject_execution_attempt",
    "collector_fixture_reject_real_probe_attempt",
    "collector_fixture_reject_external_service_attempt",
    "collector_fixture_reject_real_sdk_attempt",
    "collector_fixture_reject_real_renderer_attempt",
    "collector_fixture_reject_owner_confirmation_attempt",
    "collector_fixture_reject_readiness_claim",
    "collector_fixture_reject_priority1_resolution",
    "collector_fixture_reject_motion_dataset_execution",
  ]) {
    assert.equal(defaultCollectorFixturePack.rejection_fixture_cases.includes(rejectionCase), true);
    assert.equal(defaultCollectorFixturePack.collector_fixture_expected_rejections.includes(rejectionCase), true);
  }
  assert.equal(defaultCollectorFixturePack.collector_fixture_registry.live2d_renderer_heartbeat_collector.fixture_case_status, "synthetic_fixture_only");
  assert.equal(defaultCollectorFixturePack.collector_fixture_registry.live2d_renderer_heartbeat_collector.execution_started, false);
  assert.equal(defaultCollectorFixturePack.collector_fixture_registry.live2d_renderer_heartbeat_collector.real_probe_started, false);
  assert.equal(defaultCollectorFixturePack.redaction_policy, "safe_summary_only_no_forbidden_material");
  assert.equal(defaultCollectorFixturePack.collector_fixture_redaction_policy, "safe_summary_only_no_forbidden_material");
  assert.equal(defaultCollectorFixturePack.network_policy, "blocked_by_default_no_external_services");
  assert.equal(defaultCollectorFixturePack.collector_fixture_network_policy, "blocked_by_default_no_external_services");
  assert.equal(defaultCollectorFixturePack.sdk_policy, "forbid_real_sdk_call");
  assert.equal(defaultCollectorFixturePack.collector_fixture_sdk_policy, "forbid_real_sdk_call");
  assert.equal(defaultCollectorFixturePack.renderer_policy, "forbid_real_renderer_call");
  assert.equal(defaultCollectorFixturePack.collector_fixture_renderer_policy, "forbid_real_renderer_call");
  assert.equal(defaultCollectorFixturePack.fixture_source_rejection, "fixture_source_rejected_for_real_evidence");
  assert.equal(defaultCollectorFixturePack.dry_run_source_rejection, "dry_run_source_rejected_for_real_evidence");
  assert.equal(defaultCollectorFixturePack.mock_source_rejection, "mock_source_rejected_for_real_evidence");
  assert.equal(defaultCollectorFixturePack.stale_source_rejection, "stale_source_rejected_for_fresh_evidence");
  assert.equal(defaultCollectorFixturePack.unknown_source_rejection, "unknown_source_rejected");
  assert.equal(defaultCollectorFixturePack.missing_binding_rejection, "missing_source_freshness_audit_or_redaction_binding_rejected");
  assert.equal(defaultCollectorFixturePack.execution_attempt_rejection, "collector_execution_attempt_rejected");
  assert.equal(defaultCollectorFixturePack.real_probe_attempt_rejection, "real_probe_attempt_rejected");
  assert.equal(defaultCollectorFixturePack.external_service_attempt_rejection, "external_service_attempt_rejected");
  assert.equal(defaultCollectorFixturePack.trusted_loader_boundary, "trusted_loader_allowlist_disabled_no_loader_trusted");
  assert.equal(defaultCollectorFixturePack.owner_confirmation_boundary, "schema_only_no_owner_confirmation_created");
  assert.equal(defaultCollectorFixturePack.go_nogo_preservation, "go_nogo_status_no_go");
  assert.equal(defaultCollectorFixturePack.collection_plan_preservation, "collection_plan_planning_only");
  assert.equal(defaultCollectorFixturePack.freshness_threshold_preservation, "freshness_threshold_planning_only");
  assert.equal(defaultCollectorFixturePack.safe_evidence_summary_contract_preservation, "safe_evidence_summary_contract_planning_only");
  assert.equal(defaultCollectorFixturePack.summary_intake_binding_preservation, "summary_intake_binding_planning_only");
  assert.equal(defaultCollectorFixturePack.owner_confirmation_binding_preservation, "owner_confirmation_binding_planning_only");
  assert.equal(defaultCollectorFixturePack.blocker_resolution_schema_preservation, "blocker_resolution_schema_planning_only");
  assert.equal(defaultCollectorFixturePack.collector_manifest_preservation, "collector_manifest_planning_only");
  assert.equal(defaultCollectorFixturePack.collector_execution_started, false);
  assert.equal(defaultCollectorFixturePack.collector_real_probe_started, false);
  assert.equal(defaultCollectorFixturePack.real_evidence_collection_started, false);
  assert.equal(defaultCollectorFixturePack.real_probe_started, false);
  assert.equal(defaultCollectorFixturePack.external_service_call_started, false);
  assert.equal(defaultCollectorFixturePack.real_sdk_call_started, false);
  assert.equal(defaultCollectorFixturePack.real_renderer_call_started, false);
  assert.equal(defaultCollectorFixturePack.owner_confirmation_created, false);
  assert.equal(defaultCollectorFixturePack.owner_confirmation_confirmed, false);
  assert.equal(defaultCollectorFixturePack.fixture_pack_executes_collectors, false);
  assert.equal(defaultCollectorFixturePack.fixture_pack_collects_real_evidence, false);
  assert.equal(defaultCollectorFixturePack.fixture_pack_performs_live_probes, false);
  assert.equal(defaultCollectorFixturePack.fixture_pack_calls_external_services, false);
  assert.equal(defaultCollectorFixturePack.fixture_pack_calls_real_sdk, false);
  assert.equal(defaultCollectorFixturePack.fixture_pack_calls_real_renderer, false);
  assert.equal(defaultCollectorFixturePack.fixture_pack_creates_owner_confirmation, false);
  assert.equal(defaultCollectorFixturePack.go_nogo_status, "no_go");
  assert.equal(defaultCollectorFixturePack.go_candidate, false);
  assert.equal(defaultCollectorFixturePack.blocker_resolved, false);
  assert.equal(defaultCollectorFixturePack.priority1_status, "BLOCKED");
  assert.equal(defaultCollectorFixturePack.motion_dataset_status, "non_executable");
  assert.equal(defaultCollectorFixturePack.checked_row_count, 0);
  assert.equal(defaultCollectorFixturePack.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultCollectorFixturePack.no_loader_trusted, true);
  assert.equal(defaultCollectorFixturePack.runtime_readiness_claimed, false);
  assert.equal(defaultCollectorFixturePack.production_readiness_claimed, false);
  assert.equal(defaultCollectorFixturePack.renderer_ready, false);
  assert.equal(defaultCollectorFixturePack.model_loaded, false);
  assert.equal(defaultCollectorFixturePack.scene_loaded, false);
  assert.equal(defaultCollectorFixturePack.browser_cue_delivery_ready, false);
  assert.equal(defaultCollectorFixturePack.motion_dataset_executable, false);
  assertSafe(JSON.stringify(defaultCollectorFixturePack));

  const defaultCollectorDryRunEnvelope = createRealEvidenceCollectorDryRunEnvelopeSummary();
  assert.equal(defaultCollectorDryRunEnvelope.real_evidence_collector_dry_run_envelope_status, "planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.collector_dry_run_envelope_status, "planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.collector_dry_run_envelope_ready_candidate, false);
  assert.equal(defaultCollectorDryRunEnvelope.dry_run_request_shape_candidate, false);
  assert.equal(defaultCollectorDryRunEnvelope.planning_only_boundary, true);
  assert.equal(defaultCollectorDryRunEnvelope.dry_run_only_boundary, true);
  assert.equal(defaultCollectorDryRunEnvelope.no_real_collection_boundary, true);
  assert.equal(defaultCollectorDryRunEnvelope.no_live_probe_boundary, true);
  assert.equal(defaultCollectorDryRunEnvelope.no_owner_confirmation_created_boundary, true);
  assert.equal(defaultCollectorDryRunEnvelope.no_owner_confirmation_confirmed_boundary, true);
  assert.equal(defaultCollectorDryRunEnvelope.no_readiness_boundary, true);
  assert.equal(defaultCollectorDryRunEnvelope.no_go_preserved, true);
  for (const requiredField of ["collector_names", "source_binding", "freshness_binding", "audit_binding", "redaction_status", "safe_output_fields", "safe_next_action"]) {
    assert.equal(defaultCollectorDryRunEnvelope.required_dry_run_request_fields.includes(requiredField), true);
  }
  for (const rejectionReason of [
    "dry_run_reject_missing_collector_name",
    "dry_run_reject_unknown_collector_name",
    "dry_run_reject_missing_source_binding",
    "dry_run_reject_missing_freshness_binding",
    "dry_run_reject_missing_audit_binding",
    "dry_run_reject_missing_redaction_status",
    "dry_run_reject_missing_safe_output_fields",
    "dry_run_reject_forbidden_raw_field",
    "dry_run_reject_fixture_source_as_real_evidence",
    "dry_run_reject_dry_run_source_as_real_evidence",
    "dry_run_reject_mock_source",
    "dry_run_reject_stale_source",
    "dry_run_reject_unknown_source",
    "dry_run_reject_collector_execution_request",
    "dry_run_reject_real_probe_request",
    "dry_run_reject_external_service_request",
    "dry_run_reject_real_sdk_request",
    "dry_run_reject_real_renderer_request",
    "dry_run_reject_owner_confirmation_request",
    "dry_run_reject_readiness_promotion",
    "dry_run_reject_go_request",
    "dry_run_reject_blocker_resolution",
    "dry_run_reject_trusted_loader_enablement",
    "dry_run_reject_motion_execution",
  ]) {
    assert.equal(defaultCollectorDryRunEnvelope.dry_run_request_rejection_reasons.includes(rejectionReason), true);
  }
  assert.equal(defaultCollectorDryRunEnvelope.triggered_rejection_reasons.includes("dry_run_reject_missing_collector_name"), true);
  assert.equal(defaultCollectorDryRunEnvelope.triggered_rejection_reasons.includes("dry_run_reject_missing_source_binding"), true);
  assert.equal(defaultCollectorDryRunEnvelope.network_policy, "blocked_by_default_no_external_services");
  assert.equal(defaultCollectorDryRunEnvelope.sdk_policy, "forbid_real_sdk_call");
  assert.equal(defaultCollectorDryRunEnvelope.renderer_policy, "forbid_real_renderer_call");
  assert.equal(defaultCollectorDryRunEnvelope.fixture_pass_rejection, "fixture_pass_is_not_real_evidence");
  assert.equal(defaultCollectorDryRunEnvelope.dry_run_pass_rejection, "dry_run_pass_is_not_real_evidence");
  assert.equal(defaultCollectorDryRunEnvelope.mock_source_rejection, "mock_source_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.stale_source_rejection, "stale_source_rejected_for_fresh_evidence");
  assert.equal(defaultCollectorDryRunEnvelope.unknown_source_rejection, "unknown_source_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.missing_binding_rejection, "missing_source_freshness_audit_redaction_or_safe_output_binding_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.execution_request_rejection, "collector_execution_request_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.real_probe_request_rejection, "real_probe_request_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.external_service_request_rejection, "external_service_request_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.owner_confirmation_request_rejection, "owner_confirmation_request_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.readiness_promotion_request_rejection, "readiness_promotion_request_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.go_request_rejection, "go_request_rejected");
  assert.equal(defaultCollectorDryRunEnvelope.trusted_loader_boundary, "trusted_loader_allowlist_disabled_no_loader_trusted");
  assert.equal(defaultCollectorDryRunEnvelope.owner_confirmation_boundary, "schema_only_no_owner_confirmation_created");
  assert.equal(defaultCollectorDryRunEnvelope.go_nogo_preservation, "go_nogo_status_no_go");
  assert.equal(defaultCollectorDryRunEnvelope.collection_plan_preservation, "collection_plan_planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.freshness_threshold_preservation, "freshness_threshold_planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.safe_evidence_summary_contract_preservation, "safe_evidence_summary_contract_planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.summary_intake_binding_preservation, "summary_intake_binding_planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.owner_confirmation_binding_preservation, "owner_confirmation_binding_planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.blocker_resolution_schema_preservation, "blocker_resolution_schema_planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.collector_manifest_preservation, "collector_manifest_planning_only");
  assert.equal(defaultCollectorDryRunEnvelope.collector_fixture_pack_preservation, "collector_fixture_pack_synthetic_only");
  assert.equal(defaultCollectorDryRunEnvelope.collector_execution_started, false);
  assert.equal(defaultCollectorDryRunEnvelope.real_evidence_collection_started, false);
  assert.equal(defaultCollectorDryRunEnvelope.real_probe_started, false);
  assert.equal(defaultCollectorDryRunEnvelope.external_service_call_started, false);
  assert.equal(defaultCollectorDryRunEnvelope.real_sdk_call_started, false);
  assert.equal(defaultCollectorDryRunEnvelope.real_renderer_call_started, false);
  assert.equal(defaultCollectorDryRunEnvelope.owner_confirmation_created, false);
  assert.equal(defaultCollectorDryRunEnvelope.owner_confirmation_confirmed, false);
  assert.equal(defaultCollectorDryRunEnvelope.go_nogo_status, "no_go");
  assert.equal(defaultCollectorDryRunEnvelope.go_candidate, false);
  assert.equal(defaultCollectorDryRunEnvelope.blocker_resolved, false);
  assert.equal(defaultCollectorDryRunEnvelope.priority1_status, "BLOCKED");
  assert.equal(defaultCollectorDryRunEnvelope.motion_dataset_status, "non_executable");
  assert.equal(defaultCollectorDryRunEnvelope.checked_row_count, 0);
  assert.equal(defaultCollectorDryRunEnvelope.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultCollectorDryRunEnvelope.no_loader_trusted, true);
  assert.equal(defaultCollectorDryRunEnvelope.runtime_readiness_claimed, false);
  assert.equal(defaultCollectorDryRunEnvelope.production_readiness_claimed, false);
  assert.equal(defaultCollectorDryRunEnvelope.renderer_ready, false);
  assert.equal(defaultCollectorDryRunEnvelope.model_loaded, false);
  assert.equal(defaultCollectorDryRunEnvelope.scene_loaded, false);
  assert.equal(defaultCollectorDryRunEnvelope.browser_cue_delivery_ready, false);
  assert.equal(defaultCollectorDryRunEnvelope.motion_dataset_executable, false);
  assert.equal(defaultCollectorDryRunEnvelope.accepted_dry_run_request_is_real_evidence, false);
  assert.equal(defaultCollectorDryRunEnvelope.accepted_dry_run_request_is_owner_confirmation, false);
  assert.equal(defaultCollectorDryRunEnvelope.accepted_dry_run_request_is_readiness, false);
  assert.equal(defaultCollectorDryRunEnvelope.accepted_dry_run_request_resolves_priority1, false);
  assert.equal(defaultCollectorDryRunEnvelope.accepted_dry_run_request_makes_motion_executable, false);
  assertSafe(JSON.stringify(defaultCollectorDryRunEnvelope));

  const acceptedCollectorDryRunEnvelope = createRealEvidenceCollectorDryRunEnvelopeSummary({
    collector_names: ["live2d_renderer_heartbeat_collector"],
    source_type: "manual_summary",
    source_binding: "present",
    freshness_binding: "present",
    audit_binding: "present",
    redaction_status: "safe_summary_only",
    safe_output_fields: [
      "component",
      "collector_name",
      "collector_status",
      "evidence_source_type",
      "freshness_status",
      "safe_evidence_ref",
      "safe_audit_ref",
      "head_sha_ref",
      "run_id_ref",
      "file_scope",
      "checked_at_bucket",
      "status_reason_code",
      "redaction_status",
      "blocker_labels",
      "safe_next_action",
    ],
    safe_next_action: "future_owner_confirmed_real_evidence_collection_task_required",
  });
  assert.equal(acceptedCollectorDryRunEnvelope.dry_run_request_shape_candidate, true);
  assert.equal(acceptedCollectorDryRunEnvelope.collector_dry_run_envelope_ready_candidate, false);
  assert.equal(acceptedCollectorDryRunEnvelope.triggered_rejection_reasons.length, 0);
  assert.equal(acceptedCollectorDryRunEnvelope.accepted_dry_run_request_is_real_evidence, false);
  assert.equal(acceptedCollectorDryRunEnvelope.accepted_dry_run_request_is_owner_confirmation, false);
  assert.equal(acceptedCollectorDryRunEnvelope.accepted_dry_run_request_is_readiness, false);
  assert.equal(acceptedCollectorDryRunEnvelope.accepted_dry_run_request_resolves_priority1, false);
  assert.equal(acceptedCollectorDryRunEnvelope.accepted_dry_run_request_makes_motion_executable, false);
  assert.equal(acceptedCollectorDryRunEnvelope.priority1_status, "BLOCKED");
  assert.equal(acceptedCollectorDryRunEnvelope.motion_dataset_executable, false);
  assertSafe(JSON.stringify(acceptedCollectorDryRunEnvelope));

  const rejectedCollectorDryRunEnvelope = createRealEvidenceCollectorDryRunEnvelopeSummary({
    collector_names: ["unknown_collector"],
    source_type: "dry_run",
    source_binding: "present",
    freshness_binding: "present",
    audit_binding: "present",
    redaction_status: "pass",
    safe_output_fields: ["component"],
    raw_evidence_body: "unsafe_fixture_value",
    collector_execution_requested: true,
    real_probe_requested: true,
    external_service_requested: true,
    real_sdk_call_requested: true,
    real_renderer_call_requested: true,
    owner_confirmation_requested: true,
    renderer_ready: true,
    go_requested: true,
    blocker_resolved: true,
    trusted_loader_allowlist_enabled: true,
    motion_dataset_executable: true,
  });
  for (const expectedRejection of [
    "dry_run_reject_unknown_collector_name",
    "dry_run_reject_dry_run_source_as_real_evidence",
    "dry_run_reject_forbidden_raw_field",
    "dry_run_reject_collector_execution_request",
    "dry_run_reject_real_probe_request",
    "dry_run_reject_external_service_request",
    "dry_run_reject_real_sdk_request",
    "dry_run_reject_real_renderer_request",
    "dry_run_reject_owner_confirmation_request",
    "dry_run_reject_readiness_promotion",
    "dry_run_reject_go_request",
    "dry_run_reject_blocker_resolution",
    "dry_run_reject_trusted_loader_enablement",
    "dry_run_reject_motion_execution",
  ]) {
    assert.equal(rejectedCollectorDryRunEnvelope.triggered_rejection_reasons.includes(expectedRejection), true);
  }
  assert.equal(rejectedCollectorDryRunEnvelope.collector_execution_started, false);
  assert.equal(rejectedCollectorDryRunEnvelope.real_probe_started, false);
  assert.equal(rejectedCollectorDryRunEnvelope.external_service_call_started, false);
  assert.equal(rejectedCollectorDryRunEnvelope.owner_confirmation_confirmed, false);
  assert.equal(rejectedCollectorDryRunEnvelope.renderer_ready, false);
  assert.equal(rejectedCollectorDryRunEnvelope.go_candidate, false);
  assert.equal(rejectedCollectorDryRunEnvelope.blocker_resolved, false);
  assert.equal(rejectedCollectorDryRunEnvelope.trusted_loader_allowlist_enabled, false);
  assert.equal(rejectedCollectorDryRunEnvelope.motion_dataset_executable, false);
  assert.equal(JSON.stringify(rejectedCollectorDryRunEnvelope).includes("unsafe_fixture_value"), false);
  assertSafe(JSON.stringify(rejectedCollectorDryRunEnvelope));

  const unsafeCollectorFixturePack = createRealEvidenceCollectorFixturePackSummary({
    source_type: "fixture",
    raw_evidence_body: "unsafe_fixture_value",
    raw_renderer_payload: "unsafe_fixture_value",
    raw_cue_payload: "unsafe_fixture_value",
    raw_loader_candidate: "unsafe_fixture_value",
    raw_loader_error: "unsafe_fixture_value",
    owner_private_note: "unsafe_fixture_value",
    collector_execution_started: true,
    real_evidence_collection_started: true,
    collector_real_probe_started: true,
    external_service_call_started: true,
    real_sdk_call_started: true,
    real_renderer_call_started: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    renderer_ready: true,
    model_loaded: true,
    scene_loaded: true,
    browser_cue_delivery_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    motion_dataset_executable: true,
  });
  assert.equal(unsafeCollectorFixturePack.source_type_status, "rejected_fixture");
  for (const triggeredCase of [
    "collector_fixture_reject_fixture_source",
    "collector_fixture_reject_forbidden_material",
    "collector_fixture_reject_execution_attempt",
    "collector_fixture_reject_real_probe_attempt",
    "collector_fixture_reject_external_service_attempt",
    "collector_fixture_reject_real_sdk_attempt",
    "collector_fixture_reject_real_renderer_attempt",
    "collector_fixture_reject_owner_confirmation_attempt",
    "collector_fixture_reject_readiness_claim",
    "collector_fixture_reject_priority1_resolution",
    "collector_fixture_reject_motion_dataset_execution",
  ]) {
    assert.equal(unsafeCollectorFixturePack.rejection_cases_triggered.includes(triggeredCase), true);
  }
  assert.equal(unsafeCollectorFixturePack.collector_execution_started, false);
  assert.equal(unsafeCollectorFixturePack.real_evidence_collection_started, false);
  assert.equal(unsafeCollectorFixturePack.real_probe_started, false);
  assert.equal(unsafeCollectorFixturePack.external_service_call_started, false);
  assert.equal(unsafeCollectorFixturePack.real_sdk_call_started, false);
  assert.equal(unsafeCollectorFixturePack.real_renderer_call_started, false);
  assert.equal(unsafeCollectorFixturePack.owner_confirmation_created, false);
  assert.equal(unsafeCollectorFixturePack.owner_confirmation_confirmed, false);
  assert.equal(unsafeCollectorFixturePack.renderer_ready, false);
  assert.equal(unsafeCollectorFixturePack.model_loaded, false);
  assert.equal(unsafeCollectorFixturePack.scene_loaded, false);
  assert.equal(unsafeCollectorFixturePack.browser_cue_delivery_ready, false);
  assert.equal(unsafeCollectorFixturePack.runtime_readiness_claimed, false);
  assert.equal(unsafeCollectorFixturePack.production_readiness_claimed, false);
  assert.equal(unsafeCollectorFixturePack.priority1_status, "BLOCKED");
  assert.equal(unsafeCollectorFixturePack.motion_dataset_executable, false);
  assertSafe(JSON.stringify(unsafeCollectorFixturePack));

  for (const rejectedSourceType of ["fixture", "dry_run", "mock", "stale", "unsafe_material", "unknown_source_type"]) {
    const rejectedCollectionPlan = createRealResidentEvidenceCollectionPlanSummary({ source_type: rejectedSourceType });
    assert.equal(rejectedCollectionPlan.source_type_status, `rejected_${rejectedSourceType}`);
    assert.equal(rejectedCollectionPlan.blocked_reasons.includes(`collection_plan_rejected_${rejectedSourceType}`), true);
    assertSafe(JSON.stringify(rejectedCollectionPlan));
  }

  const unsafeCollectionPlan = createRealResidentEvidenceCollectionPlanSummary({
    raw_cue_payload: "unsafe_fixture_value",
    raw_renderer_payload: "unsafe_fixture_value",
    raw_evidence_body: "unsafe_fixture_value",
    raw_owner_note: "unsafe_fixture_value",
    raw_request_note: "unsafe_fixture_value",
    raw_loader_candidate: "unsafe_fixture_value",
    raw_loader_error: "unsafe_fixture_value",
    model_path: "unsafe_fixture_value",
    motion_path: "unsafe_fixture_value",
    endpoint_value: "unsafe_fixture_value",
    token_value: "unsafe_fixture_value",
    secret_value: "unsafe_fixture_value",
    sdk_vendor_path: "unsafe_fixture_value",
    shell_command_body: "unsafe_fixture_value",
  });
  assert.equal(unsafeCollectionPlan.forbidden_material_status, "forbidden_material_rejected");
  assert.equal(unsafeCollectionPlan.blocked_reasons.includes("collection_plan_rejected_forbidden_raw_field"), true);
  assert.equal(JSON.stringify(unsafeCollectionPlan).includes("unsafe_fixture_value"), false);
  assertSafe(JSON.stringify(unsafeCollectionPlan));

  const defaultFreshnessThreshold = createRealEvidenceFreshnessThresholdSummary();
  assert.equal(defaultFreshnessThreshold.real_evidence_freshness_threshold_status, "planning_only");
  assert.equal(defaultFreshnessThreshold.planning_only_boundary, true);
  assert.equal(defaultFreshnessThreshold.freshness_policy_ready_candidate, false);
  assert.equal(defaultFreshnessThreshold.real_evidence_collection_started, false);
  assert.equal(defaultFreshnessThreshold.real_probe_started, false);
  assert.equal(defaultFreshnessThreshold.runtime_readiness_claimed, false);
  assert.equal(defaultFreshnessThreshold.production_readiness_claimed, false);
  assert.equal(defaultFreshnessThreshold.priority1_status, "BLOCKED");
  assert.equal(defaultFreshnessThreshold.motion_dataset_status, "non_executable");
  assert.equal(defaultFreshnessThreshold.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultFreshnessThreshold.go_nogo_status, "no_go");
  assert.equal(defaultFreshnessThreshold.go_candidate, false);
  assert.equal(defaultFreshnessThreshold.fixture_evidence_policy, "fixture_evidence_never_fresh_real_evidence");
  assert.equal(defaultFreshnessThreshold.dry_run_evidence_policy, "dry_run_evidence_never_fresh_real_evidence");
  assert.equal(defaultFreshnessThreshold.mock_evidence_policy, "mock_evidence_never_fresh_real_evidence");
  assert.equal(defaultFreshnessThreshold.stale_evidence_policy, "stale_evidence_cannot_resolve_readiness_or_priority1");
  assert.equal(defaultFreshnessThreshold.manual_summary_policy, "manual_summary_without_owner_confirmation_not_fresh_real_evidence");
  assert.equal(
    defaultFreshnessThreshold.operator_confirmed_summary_policy,
    "operator_summary_without_scope_specific_owner_confirmation_not_fresh_real_evidence"
  );
  assert.equal(defaultFreshnessThreshold.owner_confirmed_reference_policy, "schema_only_pending_real_owner_confirmation");
  assert.equal(defaultFreshnessThreshold.request_packet_status, "request_only_no_collection");
  assert.equal(defaultFreshnessThreshold.collection_plan_status, "planning_only");
  assert.equal(defaultFreshnessThreshold.real_evidence_intake_status, "schema_only");
  assert.equal(defaultFreshnessThreshold.owner_confirmation_envelope_status, "schema_only_blocked_or_pending");
  assert.equal(defaultFreshnessThreshold.fresh_evidence_bundle_status, "review_preparation_only");
  for (const component of [
    "live2d_renderer_heartbeat",
    "live2d_model_configured_status",
    "live2d_cue_capability",
    "live2d_recovery_capability",
    "live2d_route_guard",
    "live2d_evidence_collector",
    "live2d_fresh_evidence_bundle",
    "live2d_real_evidence_intake",
    "live2d_go_nogo_preflight",
    "live2d_owner_confirmation_envelope",
    "trusted_loader_preflight",
    "trusted_loader_enablement_gate",
    "trusted_loader_owner_handoff",
    "license_boundary",
    "sdk_vendor_boundary",
    "priority1_real_resident_evidence",
    "motion_dataset_row_evidence",
  ]) {
    assert.equal(defaultFreshnessThreshold.component_thresholds_defined.includes(component), true);
    assert.equal(defaultFreshnessThreshold.component_thresholds_pending.includes(component), true);
    assert.equal(defaultFreshnessThreshold.component_thresholds[component].threshold_units, "safe_age_bucket");
    assert.equal(defaultFreshnessThreshold.component_thresholds[component].freshness_status, "missing");
  }
  assert.equal(defaultFreshnessThreshold.assistant_review_is_owner_confirmation, false);
  assert.equal(defaultFreshnessThreshold.pr_merge_is_owner_confirmation, false);
  assert.equal(defaultFreshnessThreshold.remote_pass_is_owner_confirmation, false);
  assertSafe(JSON.stringify(defaultFreshnessThreshold));

  for (const [sourceKind, reason] of [
    ["fixture", "freshness_threshold_fixture_evidence_not_real"],
    ["dry_run", "freshness_threshold_dry_run_evidence_not_real"],
    ["mock", "freshness_threshold_mock_evidence_not_real"],
    ["manual_summary", "freshness_threshold_manual_summary_requires_owner_confirmation"],
    ["operator_confirmed_summary", "freshness_threshold_operator_summary_requires_scope_specific_owner_confirmation"],
    ["owner_confirmed_reference", "freshness_threshold_owner_reference_schema_only_until_real_confirmation"],
  ]) {
    const threshold = createRealEvidenceFreshnessThresholdSummary({ source_kind: sourceKind });
    assert.equal(threshold.blocked_reasons.includes(reason), true);
    assert.equal(threshold.runtime_readiness_claimed, false);
    assertSafe(JSON.stringify(threshold));
  }
  const staleFreshnessThreshold = createRealEvidenceFreshnessThresholdSummary({ freshness_status: "stale" });
  assert.equal(staleFreshnessThreshold.blocked_reasons.includes("freshness_threshold_stale_evidence_not_fresh"), true);
  assert.equal(staleFreshnessThreshold.priority1_status, "BLOCKED");
  const unsafeFreshnessThreshold = createRealEvidenceFreshnessThresholdSummary({
    raw_evidence_body: "unsafe_fixture_value",
    raw_owner_note: "unsafe_fixture_value",
    raw_loader_candidate: "unsafe_fixture_value",
    shell_command_body: "unsafe_fixture_value",
  });
  assert.equal(unsafeFreshnessThreshold.real_evidence_freshness_threshold_status, "blocked");
  assert.equal(unsafeFreshnessThreshold.forbidden_material_status, "forbidden_material_rejected");
  assert.equal(unsafeFreshnessThreshold.blocked_reasons.includes("freshness_threshold_rejected_forbidden_raw_field"), true);
  assert.equal(JSON.stringify(unsafeFreshnessThreshold).includes("unsafe_fixture_value"), false);
  assertSafe(JSON.stringify(unsafeFreshnessThreshold));

  const defaultSafeEvidenceSummaryContract = createSafeEvidenceSummaryContractSummary();
  assert.equal(LIVE2D_SAFE_EVIDENCE_SUMMARY_CONTRACT_SCHEMA, "iris_live2d_safe_evidence_summary_contract_v1");
  assert.equal(defaultSafeEvidenceSummaryContract.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(defaultSafeEvidenceSummaryContract.planning_only_boundary, true);
  assert.equal(defaultSafeEvidenceSummaryContract.summary_contract_ready_candidate, false);
  assert.equal(defaultSafeEvidenceSummaryContract.real_evidence_collection_started, false);
  assert.equal(defaultSafeEvidenceSummaryContract.real_probe_started, false);
  assert.equal(defaultSafeEvidenceSummaryContract.runtime_readiness_claimed, false);
  assert.equal(defaultSafeEvidenceSummaryContract.production_readiness_claimed, false);
  assert.equal(defaultSafeEvidenceSummaryContract.priority1_status, "BLOCKED");
  assert.equal(defaultSafeEvidenceSummaryContract.motion_dataset_status, "non_executable");
  assert.equal(defaultSafeEvidenceSummaryContract.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultSafeEvidenceSummaryContract.go_nogo_status, "no_go");
  assert.equal(defaultSafeEvidenceSummaryContract.go_candidate, false);
  for (const field of [
    "component",
    "status",
    "freshness_status",
    "evidence_source_type",
    "evidence_ref",
    "safe_audit_ref",
    "head_sha_ref",
    "run_id_ref",
    "file_scope",
    "checked_at_bucket",
    "status_reason_code",
    "redaction_status",
    "blocker_labels",
    "safe_next_action",
  ]) {
    assert.equal(defaultSafeEvidenceSummaryContract.accepted_summary_fields.includes(field), true);
  }
  for (const binding of ["evidence_source_type", "evidence_ref", "safe_audit_ref", "head_sha_ref", "run_id_ref", "file_scope"]) {
    assert.equal(defaultSafeEvidenceSummaryContract.required_source_binding.includes(binding), true);
  }
  for (const binding of ["freshness_status", "checked_at_bucket", "status_reason_code"]) {
    assert.equal(defaultSafeEvidenceSummaryContract.required_freshness_binding.includes(binding), true);
  }
  for (const binding of ["safe_audit_ref", "head_sha_ref", "run_id_ref", "redaction_status", "blocker_labels"]) {
    assert.equal(defaultSafeEvidenceSummaryContract.required_audit_binding.includes(binding), true);
  }
  assert.equal(defaultSafeEvidenceSummaryContract.required_redaction_status, "safe_summary_only");
  for (const field of [
    "evidence_body_material",
    "cue_body_material",
    "renderer_body_material",
    "loader_candidate_material",
    "loader_error_material",
    "owner_note_material",
    "request_note_material",
    "network_locator_material",
    "auth_value_material",
    "sensitive_value_material",
    "private_locator_material",
    "model_locator_material",
    "motion_locator_material",
    "sdk_vendor_locator_material",
    "shell_instruction_body_material",
    "obs_instruction_material",
    "world_instruction_material",
    "api_response_material",
    "audio_body_material",
    "frame_body_material",
    "comment_text_material",
  ]) {
    assert.equal(defaultSafeEvidenceSummaryContract.rejected_material_classes.includes(field), true);
  }
  for (const sourceType of ["real_probe_summary", "operator_confirmed_summary", "manual_upload_summary", "audit_reference", "owner_confirmed_reference"]) {
    assert.equal(defaultSafeEvidenceSummaryContract.accepted_source_types.includes(sourceType), true);
  }
  for (const sourceType of ["fixture", "dry_run", "mock", "stale", "unsafe_material", "unknown_source_type"]) {
    const rejected = createSafeEvidenceSummaryContractSummary({ evidence_source_type: sourceType });
    assert.equal(rejected.rejected_source_types.includes(sourceType), true);
    assert.equal(rejected.blocked_reasons.includes("safe_evidence_summary_contract_rejected_source_type"), true);
    assert.equal(rejected.runtime_readiness_claimed, false);
    assertSafe(JSON.stringify(rejected));
  }
  const missingBindingContract = createSafeEvidenceSummaryContractSummary({ evidence_source_type: "audit_reference" });
  assert.equal(missingBindingContract.source_binding_status, "missing");
  assert.equal(missingBindingContract.freshness_binding_status, "missing");
  assert.equal(missingBindingContract.redaction_status, "missing_safe_summary_only");
  const boundContract = createSafeEvidenceSummaryContractSummary({
    component: "live2d_renderer_heartbeat",
    evidence_source_type: "audit_reference",
    evidence_ref: "safe_ref_only",
    safe_audit_ref: "safe_audit_ref_only",
    head_sha_ref: "safe_head_ref_only",
    run_id_ref: "safe_run_ref_only",
    freshness_status: "missing",
    redaction_status: "safe_summary_only",
    file_scope: ["safe_file_scope_label"],
    blocker_labels: ["priority1_BLOCKED", "motion_dataset_non_executable", "owner_confirmation_pending", "readiness_false"],
  });
  assert.equal(boundContract.source_binding_status, "present");
  assert.equal(boundContract.freshness_binding_status, "present");
  assert.equal(boundContract.audit_binding_status, "present");
  assert.equal(boundContract.priority1_status, "BLOCKED");
  assert.equal(boundContract.motion_dataset_status, "non_executable");
  assert.equal(boundContract.runtime_readiness_claimed, false);
  assert.equal(boundContract.assistant_review_is_owner_confirmation, false);
  assert.equal(boundContract.pr_merge_is_owner_confirmation, false);
  assert.equal(boundContract.remote_pass_is_owner_confirmation, false);
  assert.equal(boundContract.request_packet_status, "request_only_no_collection");
  assert.equal(boundContract.collection_plan_status, "planning_only");
  assert.equal(boundContract.freshness_threshold_status, "planning_only");
  assert.equal(boundContract.real_evidence_intake_status, "schema_only");
  assert.equal(boundContract.owner_confirmation_envelope_status, "schema_only_blocked_or_pending");
  assert.equal(boundContract.fresh_evidence_bundle_status, "review_preparation_only");
  assertSafe(JSON.stringify(boundContract));
  const unsafeSummaryContract = createSafeEvidenceSummaryContractSummary({
    raw_evidence_body: "unsafe_fixture_value",
    raw_cue_payload: "unsafe_fixture_value",
    raw_renderer_payload: "unsafe_fixture_value",
    raw_loader_candidate: "unsafe_fixture_value",
    raw_loader_error: "unsafe_fixture_value",
    raw_owner_note: "unsafe_fixture_value",
    raw_request_note: "unsafe_fixture_value",
    endpoint_value: "unsafe_fixture_value",
    token_value: "unsafe_fixture_value",
    secret_value: "unsafe_fixture_value",
    private_local_path: "unsafe_fixture_value",
    model_path: "unsafe_fixture_value",
    motion_path: "unsafe_fixture_value",
    sdk_vendor_path: "unsafe_fixture_value",
    shell_command_body: "unsafe_fixture_value",
    obs_command: "unsafe_fixture_value",
    world_command: "unsafe_fixture_value",
    raw_api_response: "unsafe_fixture_value",
    raw_audio_body: "unsafe_fixture_value",
    raw_frame_body: "unsafe_fixture_value",
    raw_comment_text: "unsafe_fixture_value",
  });
  assert.equal(unsafeSummaryContract.safe_evidence_summary_contract_status, "blocked");
  assert.equal(unsafeSummaryContract.forbidden_material_status, "forbidden_material_rejected");
  assert.equal(unsafeSummaryContract.blocked_reasons.includes("safe_evidence_summary_contract_rejected_raw_field"), true);
  assert.equal(JSON.stringify(unsafeSummaryContract).includes("unsafe_fixture_value"), false);
  assertSafe(JSON.stringify(unsafeSummaryContract));

  const defaultSummaryIntakeBinding = createRealEvidenceSummaryIntakeBindingSummary();
  assert.equal(LIVE2D_REAL_EVIDENCE_SUMMARY_INTAKE_BINDING_SCHEMA, "iris_live2d_real_evidence_summary_intake_binding_v1");
  assert.equal(defaultSummaryIntakeBinding.real_evidence_summary_intake_binding_status, "blocked");
  assert.equal(defaultSummaryIntakeBinding.planning_only_boundary, true);
  assert.equal(defaultSummaryIntakeBinding.summary_intake_ready_candidate, false);
  assert.equal(defaultSummaryIntakeBinding.real_evidence_collection_started, false);
  assert.equal(defaultSummaryIntakeBinding.real_probe_started, false);
  assert.equal(defaultSummaryIntakeBinding.runtime_readiness_claimed, false);
  assert.equal(defaultSummaryIntakeBinding.production_readiness_claimed, false);
  assert.equal(defaultSummaryIntakeBinding.priority1_status, "BLOCKED");
  assert.equal(defaultSummaryIntakeBinding.motion_dataset_status, "non_executable");
  assert.equal(defaultSummaryIntakeBinding.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultSummaryIntakeBinding.go_nogo_status, "no_go");
  assert.equal(defaultSummaryIntakeBinding.go_candidate, false);
  assert.equal(defaultSummaryIntakeBinding.required_safe_summary_contract, LIVE2D_SAFE_EVIDENCE_SUMMARY_CONTRACT_SCHEMA);
  for (const requirement of [
    "component",
    "status",
    "freshness_status",
    "evidence_source_type",
    "evidence_ref",
    "safe_audit_ref",
    "head_sha_ref",
    "run_id_ref",
    "file_scope",
    "checked_at_bucket",
    "status_reason_code",
    "redaction_status",
    "blocker_labels",
    "safe_next_action",
  ]) {
    assert.equal(defaultSummaryIntakeBinding.intake_eligible_summary_requirements.includes(requirement), true);
  }
  for (const binding of ["evidence_source_type", "evidence_ref", "safe_audit_ref", "head_sha_ref", "run_id_ref", "file_scope"]) {
    assert.equal(defaultSummaryIntakeBinding.required_source_binding.includes(binding), true);
  }
  for (const binding of ["freshness_status", "checked_at_bucket", "status_reason_code"]) {
    assert.equal(defaultSummaryIntakeBinding.required_freshness_binding.includes(binding), true);
  }
  for (const binding of ["safe_audit_ref", "head_sha_ref", "run_id_ref", "redaction_status", "blocker_labels"]) {
    assert.equal(defaultSummaryIntakeBinding.required_audit_binding.includes(binding), true);
  }
  assert.equal(defaultSummaryIntakeBinding.required_redaction_status, "safe_summary_only_or_pass");
  assert.equal(defaultSummaryIntakeBinding.required_component_threshold_binding.includes("component"), true);
  assert.equal(defaultSummaryIntakeBinding.required_component_threshold_binding.includes("component_threshold_ref"), true);
  assert.equal(defaultSummaryIntakeBinding.required_owner_confirmation_boundary, "owner_confirmation_pending_until_separate_owner_confirmed_task");
  assert.equal(defaultSummaryIntakeBinding.required_go_nogo_boundary, "go_nogo_remains_no_go_until_real_evidence_and_owner_confirmation");
  for (const sourceType of ["fixture", "dry_run", "mock", "stale", "unsafe_material", "unknown_source_type"]) {
    const rejected = createRealEvidenceSummaryIntakeBindingSummary({ evidence_source_type: sourceType });
    assert.equal(rejected.rejected_source_types.includes(sourceType), true);
    assert.equal(rejected.intake_rejection_reasons.includes("summary_intake_rejected_source_type"), true);
    assert.equal(rejected.runtime_readiness_claimed, false);
    assertSafe(JSON.stringify(rejected));
  }
  const missingSourceBinding = createRealEvidenceSummaryIntakeBindingSummary({
    evidence_source_type: "audit_reference",
    freshness_status: "missing",
    checked_at_bucket: "not_collected",
    status_reason_code: "future_evidence_required",
    redaction_status: "safe_summary_only",
    component: "live2d_renderer_heartbeat",
    component_threshold_ref: "safe_threshold_ref",
    blocker_labels: ["priority1_BLOCKED"],
  });
  assert.equal(missingSourceBinding.source_binding_status, "missing");
  assert.equal(missingSourceBinding.intake_rejection_reasons.includes("summary_intake_rejected_missing_source_binding"), true);
  const missingFreshnessBinding = createRealEvidenceSummaryIntakeBindingSummary({
    evidence_source_type: "audit_reference",
    evidence_ref: "safe_ref_only",
    safe_audit_ref: "safe_audit_ref_only",
    head_sha_ref: "safe_head_ref_only",
    run_id_ref: "safe_run_ref_only",
    file_scope: ["safe_file_scope_label"],
    redaction_status: "safe_summary_only",
    component: "live2d_renderer_heartbeat",
    component_threshold_ref: "safe_threshold_ref",
    blocker_labels: ["priority1_BLOCKED"],
  });
  assert.equal(missingFreshnessBinding.freshness_binding_status, "missing");
  const missingAuditBinding = createRealEvidenceSummaryIntakeBindingSummary({
    evidence_source_type: "audit_reference",
    evidence_ref: "safe_ref_only",
    head_sha_ref: "safe_head_ref_only",
    run_id_ref: "safe_run_ref_only",
    file_scope: ["safe_file_scope_label"],
    freshness_status: "missing",
    checked_at_bucket: "not_collected",
    status_reason_code: "future_evidence_required",
    redaction_status: "safe_summary_only",
    component: "live2d_renderer_heartbeat",
    component_threshold_ref: "safe_threshold_ref",
  });
  assert.equal(missingAuditBinding.audit_binding_status, "missing");
  const missingRedaction = createRealEvidenceSummaryIntakeBindingSummary({
    evidence_source_type: "audit_reference",
    evidence_ref: "safe_ref_only",
    safe_audit_ref: "safe_audit_ref_only",
    head_sha_ref: "safe_head_ref_only",
    run_id_ref: "safe_run_ref_only",
    file_scope: ["safe_file_scope_label"],
    freshness_status: "missing",
    checked_at_bucket: "not_collected",
    status_reason_code: "future_evidence_required",
    component: "live2d_renderer_heartbeat",
    component_threshold_ref: "safe_threshold_ref",
    blocker_labels: ["priority1_BLOCKED"],
  });
  assert.equal(missingRedaction.redaction_status, "missing_safe_summary_only");
  const missingComponentThreshold = createRealEvidenceSummaryIntakeBindingSummary({
    evidence_source_type: "audit_reference",
    evidence_ref: "safe_ref_only",
    safe_audit_ref: "safe_audit_ref_only",
    head_sha_ref: "safe_head_ref_only",
    run_id_ref: "safe_run_ref_only",
    file_scope: ["safe_file_scope_label"],
    freshness_status: "missing",
    checked_at_bucket: "not_collected",
    status_reason_code: "future_evidence_required",
    redaction_status: "safe_summary_only",
    blocker_labels: ["priority1_BLOCKED"],
  });
  assert.equal(missingComponentThreshold.component_threshold_binding_status, "missing");
  const eligibleSummaryBinding = createRealEvidenceSummaryIntakeBindingSummary({
    component: "live2d_renderer_heartbeat",
    status: "blocked",
    freshness_status: "missing",
    evidence_source_type: "audit_reference",
    evidence_ref: "safe_ref_only",
    safe_audit_ref: "safe_audit_ref_only",
    head_sha_ref: "safe_head_ref_only",
    run_id_ref: "safe_run_ref_only",
    file_scope: ["safe_file_scope_label"],
    checked_at_bucket: "not_collected",
    status_reason_code: "future_evidence_required",
    redaction_status: "safe_summary_only",
    blocker_labels: ["priority1_BLOCKED", "motion_dataset_non_executable", "owner_confirmation_pending", "readiness_false"],
    safe_next_action: "future_owner_confirmed_collection_task",
    component_threshold_ref: "safe_threshold_ref",
  });
  assert.equal(eligibleSummaryBinding.real_evidence_summary_intake_binding_status, "planning_only");
  assert.equal(eligibleSummaryBinding.source_binding_status, "present");
  assert.equal(eligibleSummaryBinding.freshness_binding_status, "present");
  assert.equal(eligibleSummaryBinding.audit_binding_status, "present");
  assert.equal(eligibleSummaryBinding.component_threshold_binding_status, "present");
  assert.equal(eligibleSummaryBinding.eligible_summary_is_real_evidence, false);
  assert.equal(eligibleSummaryBinding.eligible_summary_is_owner_confirmation, false);
  assert.equal(eligibleSummaryBinding.eligible_summary_is_runtime_readiness, false);
  assert.equal(eligibleSummaryBinding.eligible_summary_is_production_readiness, false);
  assert.equal(eligibleSummaryBinding.eligible_summary_resolves_priority1, false);
  assert.equal(eligibleSummaryBinding.eligible_summary_makes_motion_executable, false);
  assert.equal(eligibleSummaryBinding.priority1_status, "BLOCKED");
  assert.equal(eligibleSummaryBinding.motion_dataset_status, "non_executable");
  assert.equal(eligibleSummaryBinding.assistant_review_is_owner_confirmation, false);
  assert.equal(eligibleSummaryBinding.pr_merge_is_owner_confirmation, false);
  assert.equal(eligibleSummaryBinding.remote_pass_is_owner_confirmation, false);
  assert.equal(eligibleSummaryBinding.request_packet_status, "request_only_no_collection");
  assert.equal(eligibleSummaryBinding.collection_plan_status, "planning_only");
  assert.equal(eligibleSummaryBinding.freshness_threshold_status, "planning_only");
  assert.equal(eligibleSummaryBinding.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(eligibleSummaryBinding.real_evidence_intake_status, "schema_only");
  assert.equal(eligibleSummaryBinding.owner_confirmation_envelope_status, "schema_only_blocked_or_pending");
  assert.equal(eligibleSummaryBinding.fresh_evidence_bundle_status, "review_preparation_only");
  assertSafe(JSON.stringify(eligibleSummaryBinding));
  const unsafeSummaryIntakeBinding = createRealEvidenceSummaryIntakeBindingSummary({
    raw_evidence_body: "unsafe_fixture_value",
    raw_cue_payload: "unsafe_fixture_value",
    raw_renderer_payload: "unsafe_fixture_value",
    raw_loader_candidate: "unsafe_fixture_value",
    raw_loader_error: "unsafe_fixture_value",
    raw_owner_note: "unsafe_fixture_value",
    raw_request_note: "unsafe_fixture_value",
    endpoint_value: "unsafe_fixture_value",
    token_value: "unsafe_fixture_value",
    secret_value: "unsafe_fixture_value",
    private_local_path: "unsafe_fixture_value",
    model_path: "unsafe_fixture_value",
    motion_path: "unsafe_fixture_value",
    sdk_vendor_path: "unsafe_fixture_value",
    shell_command_body: "unsafe_fixture_value",
    obs_command: "unsafe_fixture_value",
    world_command: "unsafe_fixture_value",
    raw_api_response: "unsafe_fixture_value",
    raw_audio_body: "unsafe_fixture_value",
    raw_frame_body: "unsafe_fixture_value",
    raw_comment_text: "unsafe_fixture_value",
  });
  assert.equal(unsafeSummaryIntakeBinding.real_evidence_summary_intake_binding_status, "blocked");
  assert.equal(unsafeSummaryIntakeBinding.intake_rejection_reasons.includes("summary_intake_rejected_forbidden_material"), true);
  assert.equal(JSON.stringify(unsafeSummaryIntakeBinding).includes("unsafe_fixture_value"), false);
  assertSafe(JSON.stringify(unsafeSummaryIntakeBinding));

  const defaultOwnerConfirmationBinding = createOwnerConfirmationBindingSummary();
  assert.equal(LIVE2D_OWNER_CONFIRMATION_BINDING_SCHEMA, "iris_live2d_owner_confirmation_binding_v1");
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_binding_status, "blocked");
  assert.equal(defaultOwnerConfirmationBinding.planning_only_boundary, true);
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_binding_ready_candidate, false);
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_created, false);
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_confirmed, false);
  assert.equal(defaultOwnerConfirmationBinding.real_evidence_collection_started, false);
  assert.equal(defaultOwnerConfirmationBinding.real_probe_started, false);
  assert.equal(defaultOwnerConfirmationBinding.runtime_readiness_claimed, false);
  assert.equal(defaultOwnerConfirmationBinding.production_readiness_claimed, false);
  assert.equal(defaultOwnerConfirmationBinding.priority1_status, "BLOCKED");
  assert.equal(defaultOwnerConfirmationBinding.motion_dataset_status, "non_executable");
  assert.equal(defaultOwnerConfirmationBinding.motion_dataset_executable, false);
  assert.equal(defaultOwnerConfirmationBinding.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultOwnerConfirmationBinding.go_nogo_status, "no_go");
  assert.equal(defaultOwnerConfirmationBinding.go_candidate, false);
  for (const scope of [
    "live2d_real_evidence_collection",
    "live2d_renderer_heartbeat_review",
    "live2d_model_configured_review",
    "live2d_cue_capability_review",
    "live2d_recovery_capability_review",
    "live2d_safe_summary_intake_review",
    "live2d_fresh_evidence_bundle_review",
    "live2d_go_nogo_review",
    "trusted_loader_enablement_review",
    "priority1_resolution_review",
    "motion_dataset_execution_review",
    "production_readiness_review",
  ]) {
    assert.equal(defaultOwnerConfirmationBinding.required_owner_confirmation_scopes.includes(scope), true);
  }
  for (const ref of [
    "safe_evidence_summary_ref",
    "summary_intake_ref",
    "freshness_threshold_ref",
    "evidence_collection_plan_ref",
    "audit_ref",
    "head_sha_ref",
    "run_id_ref",
    "file_scope",
    "owner_scope",
    "confirmation_status",
    "expires_at_bucket",
    "revocation_status",
    "status_reason_code",
  ]) {
    assert.equal(defaultOwnerConfirmationBinding.required_binding_references.includes(ref), true);
  }
  assert.equal(defaultOwnerConfirmationBinding.evidence_summary_binding_status, "missing");
  assert.equal(defaultOwnerConfirmationBinding.required_summary_intake_binding_status, "missing");
  assert.equal(defaultOwnerConfirmationBinding.freshness_threshold_binding_status, "missing");
  assert.equal(defaultOwnerConfirmationBinding.collection_plan_binding_status, "missing");
  assert.equal(defaultOwnerConfirmationBinding.audit_binding_status, "missing");
  assert.equal(defaultOwnerConfirmationBinding.scope_binding_status, "missing");
  assert.equal(defaultOwnerConfirmationBinding.head_run_file_scope_binding_status, "missing");
  assert.equal(defaultOwnerConfirmationBinding.required_expiry_policy, "reject_expired_confirmation");
  assert.equal(defaultOwnerConfirmationBinding.required_revocation_policy, "reject_revoked_confirmation");
  assert.equal(defaultOwnerConfirmationBinding.wrong_role_rejection_policy, "reject_non_owner_role");
  assert.equal(defaultOwnerConfirmationBinding.scope_mismatch_rejection_policy, "reject_scope_mismatch");
  assert.equal(defaultOwnerConfirmationBinding.assistant_review_policy, "not_owner_confirmation");
  assert.equal(defaultOwnerConfirmationBinding.pr_merge_policy, "not_owner_confirmation");
  assert.equal(defaultOwnerConfirmationBinding.remote_pass_policy, "not_owner_confirmation");
  assert.equal(defaultOwnerConfirmationBinding.operator_summary_policy, "not_owner_confirmation");
  assert.equal(defaultOwnerConfirmationBinding.manual_summary_policy, "not_owner_confirmation");
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_is_runtime_readiness, false);
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_is_production_readiness, false);
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_resolves_priority1, false);
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_makes_motion_executable, false);
  assert.equal(defaultOwnerConfirmationBinding.request_packet_status, "request_only_no_collection");
  assert.equal(defaultOwnerConfirmationBinding.collection_plan_status, "planning_only");
  assert.equal(defaultOwnerConfirmationBinding.freshness_threshold_status, "planning_only");
  assert.equal(defaultOwnerConfirmationBinding.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(defaultOwnerConfirmationBinding.summary_intake_preservation_status, "planning_only");
  assert.equal(defaultOwnerConfirmationBinding.real_evidence_intake_status, "schema_only");
  assert.equal(defaultOwnerConfirmationBinding.owner_confirmation_envelope_status, "schema_only_blocked_or_pending");
  assert.equal(defaultOwnerConfirmationBinding.fresh_evidence_bundle_status, "review_preparation_only");
  assertSafe(JSON.stringify(defaultOwnerConfirmationBinding));

  for (const [field, reason] of [
    ["assistant_review", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["pr_merge", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["remote_pass", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["local_checks_pass", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["target_harness_pass", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["browser_api_smoke_pass", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["operator_summary", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["manual_summary", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["safe_summary_intake_eligible", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["fixture_evidence", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["dry_run_evidence", "owner_confirmation_binding_rejected_auto_confirmation_source"],
    ["mock_confirmation", "owner_confirmation_binding_rejected_auto_confirmation_source"],
  ]) {
    const rejected = createOwnerConfirmationBindingSummary({ [field]: true });
    assert.equal(rejected.rejection_reasons.includes(reason), true);
    assert.equal(rejected.owner_confirmation_confirmed, false);
    assert.equal(rejected.runtime_readiness_claimed, false);
    assertSafe(JSON.stringify(rejected));
  }

  const wrongRoleBinding = createOwnerConfirmationBindingSummary({ confirmed_by_role: "assistant" });
  assert.equal(wrongRoleBinding.wrong_role_rejection_status, "rejected");
  assert.equal(wrongRoleBinding.rejection_reasons.includes("owner_confirmation_binding_rejected_wrong_role"), true);
  const expiredBinding = createOwnerConfirmationBindingSummary({ confirmed_by_role: "owner", confirmation_status: "expired" });
  assert.equal(expiredBinding.expiry_policy_status, "rejected");
  const revokedBinding = createOwnerConfirmationBindingSummary({ confirmed_by_role: "owner", revocation_status: "revoked" });
  assert.equal(revokedBinding.revocation_policy_status, "rejected");
  const scopeMismatchBinding = createOwnerConfirmationBindingSummary({
    confirmed_by_role: "owner",
    owner_scope: "live2d_go_nogo_review",
    expected_owner_scope: "production_readiness_review",
  });
  assert.equal(scopeMismatchBinding.scope_mismatch_rejection_status, "rejected");
  assert.equal(scopeMismatchBinding.rejection_reasons.includes("owner_confirmation_binding_rejected_scope_mismatch"), true);
  const missingAuditOwnerBinding = createOwnerConfirmationBindingSummary({
    safe_evidence_summary_ref: "safe_summary_ref",
    summary_intake_ref: "safe_intake_ref",
    freshness_threshold_ref: "safe_threshold_ref",
    evidence_collection_plan_ref: "safe_collection_plan_ref",
    owner_scope: "live2d_real_evidence_collection",
    confirmation_status: "pending",
    expires_at_bucket: "future_bucket",
    revocation_status: "not_revoked",
    status_reason_code: "future_owner_task_required",
    head_sha_ref: "safe_head_ref_only",
    run_id_ref: "safe_run_ref_only",
    file_scope: ["safe_file_scope_label"],
  });
  assert.equal(missingAuditOwnerBinding.audit_binding_status, "missing");
  assert.equal(missingAuditOwnerBinding.rejection_reasons.includes("owner_confirmation_binding_missing_audit_binding"), true);
  const boundOwnerConfirmation = createOwnerConfirmationBindingSummary({
    safe_evidence_summary_ref: "safe_summary_ref",
    summary_intake_ref: "safe_intake_ref",
    freshness_threshold_ref: "safe_threshold_ref",
    evidence_collection_plan_ref: "safe_collection_plan_ref",
    audit_ref: "safe_audit_ref",
    head_sha_ref: "safe_head_ref_only",
    run_id_ref: "safe_run_ref_only",
    file_scope: ["safe_file_scope_label"],
    owner_scope: "live2d_real_evidence_collection",
    expected_owner_scope: "live2d_real_evidence_collection",
    confirmed_by_role: "owner",
    confirmation_status: "pending",
    expires_at_bucket: "future_bucket",
    revocation_status: "not_revoked",
    status_reason_code: "future_owner_task_required",
  });
  assert.equal(boundOwnerConfirmation.evidence_summary_binding_status, "present");
  assert.equal(boundOwnerConfirmation.required_summary_intake_binding_status, "present");
  assert.equal(boundOwnerConfirmation.freshness_threshold_binding_status, "present");
  assert.equal(boundOwnerConfirmation.collection_plan_binding_status, "present");
  assert.equal(boundOwnerConfirmation.audit_binding_status, "present");
  assert.equal(boundOwnerConfirmation.scope_binding_status, "present");
  assert.equal(boundOwnerConfirmation.head_run_file_scope_binding_status, "present");
  assert.equal(boundOwnerConfirmation.wrong_role_rejection_status, "not_present");
  assert.equal(boundOwnerConfirmation.owner_confirmation_created, false);
  assert.equal(boundOwnerConfirmation.owner_confirmation_confirmed, false);
  assert.equal(boundOwnerConfirmation.owner_confirmation_resolves_priority1, false);
  assert.equal(boundOwnerConfirmation.owner_confirmation_makes_motion_executable, false);
  assertSafe(JSON.stringify(boundOwnerConfirmation));
  const unsafeOwnerConfirmationBinding = createOwnerConfirmationBindingSummary({
    raw_owner_note: "unsafe_fixture_value",
    raw_request_note: "unsafe_fixture_value",
    raw_evidence_body: "unsafe_fixture_value",
    endpoint_value: "unsafe_fixture_value",
    token_value: "unsafe_fixture_value",
    secret_value: "unsafe_fixture_value",
    private_local_path: "unsafe_fixture_value",
    model_path: "unsafe_fixture_value",
    motion_path: "unsafe_fixture_value",
    sdk_vendor_path: "unsafe_fixture_value",
    shell_command_body: "unsafe_fixture_value",
  });
  assert.equal(unsafeOwnerConfirmationBinding.forbidden_material_status, "forbidden_material_rejected");
  assert.equal(unsafeOwnerConfirmationBinding.rejection_reasons.includes("owner_confirmation_binding_rejected_forbidden_material"), true);
  assert.equal(JSON.stringify(unsafeOwnerConfirmationBinding).includes("unsafe_fixture_value"), false);
  assertSafe(JSON.stringify(unsafeOwnerConfirmationBinding));

  const defaultBlockerResolution = createGoNoGoBlockerResolutionSummary();
  assert.equal(LIVE2D_GO_NOGO_BLOCKER_RESOLUTION_SCHEMA, "iris_live2d_go_nogo_blocker_resolution_v1");
  assert.equal(defaultBlockerResolution.go_nogo_blocker_resolution_status, "blocked");
  assert.equal(defaultBlockerResolution.resolution_candidate_status, "blocked");
  assert.equal(defaultBlockerResolution.blocker_resolution_ready_candidate, false);
  assert.equal(defaultBlockerResolution.blocker_resolved, false);
  assert.equal(defaultBlockerResolution.go_nogo_status, "no_go");
  assert.equal(defaultBlockerResolution.go_candidate, false);
  assert.equal(defaultBlockerResolution.owner_confirmation_created, false);
  assert.equal(defaultBlockerResolution.owner_confirmation_confirmed, false);
  assert.equal(defaultBlockerResolution.runtime_readiness_claimed, false);
  assert.equal(defaultBlockerResolution.production_readiness_claimed, false);
  assert.equal(defaultBlockerResolution.priority1_status, "BLOCKED");
  assert.equal(defaultBlockerResolution.motion_dataset_status, "non_executable");
  assert.equal(defaultBlockerResolution.motion_dataset_executable, false);
  assert.equal(defaultBlockerResolution.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultBlockerResolution.no_loader_trusted, true);
  assert.equal(defaultBlockerResolution.request_packet_status, "request_only_no_collection");
  assert.equal(defaultBlockerResolution.collection_plan_status, "planning_only");
  assert.equal(defaultBlockerResolution.freshness_threshold_status, "planning_only");
  assert.equal(defaultBlockerResolution.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(defaultBlockerResolution.summary_intake_binding_preservation_status, "planning_only");
  assert.equal(defaultBlockerResolution.owner_confirmation_binding_preservation_status, "planning_only");
  for (const ref of [
    "blocker_id",
    "component",
    "safe_evidence_summary_ref",
    "summary_intake_ref",
    "freshness_threshold_ref",
    "owner_confirmation_ref",
    "audit_ref",
    "scope_ref",
    "emergency_stop_ref",
    "head_sha_ref",
    "run_id_ref",
    "file_scope",
    "redaction_status",
    "status_reason_code",
  ]) {
    assert.equal(defaultBlockerResolution.required_binding_references.includes(ref), true);
  }
  for (const reason of [
    "resolution_rejected_missing_blocker_id",
    "resolution_rejected_missing_component",
    "resolution_rejected_missing_safe_summary_binding",
    "resolution_rejected_missing_summary_intake_binding",
    "resolution_rejected_missing_freshness_threshold_binding",
    "resolution_rejected_missing_owner_confirmation_binding",
    "resolution_rejected_missing_audit_binding",
    "resolution_rejected_missing_scope_binding",
    "resolution_rejected_missing_emergency_stop_binding",
    "resolution_rejected_missing_head_run_file_scope_binding",
    "resolution_rejected_missing_redaction_pass",
  ]) {
    assert.equal(defaultBlockerResolution.resolution_rejection_reasons.includes(reason), true);
  }
  assertSafe(JSON.stringify(defaultBlockerResolution));

  const candidateOnlyBlockerResolution = createGoNoGoBlockerResolutionSummary({
    blocker_id: "priority1",
    component: "live2d_renderer",
    safe_evidence_summary_ref: "safe_summary_ref",
    summary_intake_ref: "safe_intake_ref",
    freshness_threshold_ref: "safe_threshold_ref",
    owner_confirmation_ref: "safe_owner_ref",
    audit_ref: "safe_audit_ref",
    scope_ref: "safe_scope_ref",
    emergency_stop_ref: "safe_stop_ref",
    head_sha_ref: "safe_head_ref",
    run_id_ref: "safe_run_ref",
    file_scope: ["safe_file_scope_label"],
    redaction_status: "pass",
    freshness_status: "fresh",
    confirmed_by_role: "owner",
    confirmation_status: "pending",
    revocation_status: "not_revoked",
    status_reason_code: "future_owner_review_required",
  });
  assert.equal(candidateOnlyBlockerResolution.go_nogo_blocker_resolution_status, "planning_only");
  assert.equal(candidateOnlyBlockerResolution.resolution_candidate_status, "resolution_candidate_review_only");
  assert.equal(candidateOnlyBlockerResolution.blocker_resolution_ready_candidate, false);
  assert.equal(candidateOnlyBlockerResolution.blocker_resolved, false);
  assert.equal(candidateOnlyBlockerResolution.go_nogo_status, "no_go");
  assert.equal(candidateOnlyBlockerResolution.owner_confirmation_confirmed, false);
  assert.equal(candidateOnlyBlockerResolution.runtime_readiness_claimed, false);
  assert.equal(candidateOnlyBlockerResolution.production_readiness_claimed, false);
  assertSafe(JSON.stringify(candidateOnlyBlockerResolution));

  for (const [field, reason] of [
    ["fixture_evidence", "resolution_rejected_fixture_evidence"],
    ["dry_run_evidence", "resolution_rejected_dry_run_evidence"],
    ["mock_evidence", "resolution_rejected_mock_evidence"],
    ["stale_evidence", "resolution_rejected_stale_evidence"],
    ["remote_pass", "resolution_rejected_auto_resolution_source"],
    ["local_checks_pass", "resolution_rejected_auto_resolution_source"],
    ["target_harness_pass", "resolution_rejected_auto_resolution_source"],
    ["browser_api_smoke_pass", "resolution_rejected_auto_resolution_source"],
    ["assistant_review", "resolution_rejected_auto_resolution_source"],
    ["pr_merge", "resolution_rejected_auto_resolution_source"],
    ["operator_summary", "resolution_rejected_auto_resolution_source"],
    ["manual_summary", "resolution_rejected_auto_resolution_source"],
    ["owner_confirmation_binding", "resolution_rejected_auto_resolution_source"],
    ["degraded_mode_available", "resolution_rejected_degraded_mode_only"],
  ]) {
    const rejected = createGoNoGoBlockerResolutionSummary({ [field]: true });
    assert.equal(rejected.resolution_rejection_reasons.includes(reason), true);
    assert.equal(rejected.blocker_resolved, false);
    assert.equal(rejected.go_nogo_status, "no_go");
    assert.equal(rejected.runtime_readiness_claimed, false);
    assertSafe(JSON.stringify(rejected));
  }
  const wrongRoleBlockerResolution = createGoNoGoBlockerResolutionSummary({ confirmed_by_role: "assistant" });
  assert.equal(wrongRoleBlockerResolution.resolution_rejection_reasons.includes("resolution_rejected_wrong_role_confirmation"), true);
  const expiredBlockerResolution = createGoNoGoBlockerResolutionSummary({ confirmation_status: "expired" });
  assert.equal(expiredBlockerResolution.resolution_rejection_reasons.includes("resolution_rejected_expired_confirmation"), true);
  const revokedBlockerResolution = createGoNoGoBlockerResolutionSummary({ revocation_status: "revoked" });
  assert.equal(revokedBlockerResolution.resolution_rejection_reasons.includes("resolution_rejected_revoked_confirmation"), true);
  const scopeMismatchBlockerResolution = createGoNoGoBlockerResolutionSummary({
    scope_ref: "live2d_safe_scope",
    expected_scope_ref: "production_scope",
  });
  assert.equal(scopeMismatchBlockerResolution.resolution_rejection_reasons.includes("resolution_rejected_scope_mismatch"), true);
  const unsafeBlockerResolution = createGoNoGoBlockerResolutionSummary({
    raw_evidence_body: "unsafe_fixture_value",
    raw_cue_payload: "unsafe_fixture_value",
    raw_renderer_payload: "unsafe_fixture_value",
    endpoint_value: "unsafe_fixture_value",
    token_value: "unsafe_fixture_value",
    secret_value: "unsafe_fixture_value",
    private_local_path: "unsafe_fixture_value",
    raw_loader_candidate: "unsafe_fixture_value",
    raw_loader_error: "unsafe_fixture_value",
    owner_private_note: "unsafe_fixture_value",
    shell_command_body: "unsafe_fixture_value",
  });
  assert.equal(unsafeBlockerResolution.forbidden_material_status, "forbidden_material_rejected");
  assert.equal(unsafeBlockerResolution.resolution_rejection_reasons.includes("resolution_rejected_forbidden_material"), true);
  assert.equal(JSON.stringify(unsafeBlockerResolution).includes("unsafe_fixture_value"), false);
  assertSafe(JSON.stringify(unsafeBlockerResolution));

  const mockOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    mockOwnerConfirmation: true,
  });
  assert.equal(mockOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_mock_owner_confirmation"), true);
  assert.equal(mockOwnerHandoff.mock_owner_confirmation_rejected, true);
  const mockOwnerBundle = createFreshEvidenceBundleSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    ownerHandoffSummary: mockOwnerHandoff,
    mockOwnerConfirmation: true,
  });
  assert.equal(mockOwnerBundle.bundle_blocked_reasons.includes("bundle_blocked_mock_owner_confirmation"), true);
  const mockOwnerGoNoGo = createGoNoGoPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    mockOwnerConfirmation: true,
  });
  assert.equal(mockOwnerGoNoGo.no_go_reasons.includes("no_go_mock_owner_confirmation"), true);
  const routeGuardMissingHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    routeGuardStatus: "missing",
  });
  assert.equal(routeGuardMissingHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_missing_route_guard"), true);
  assertSafe(JSON.stringify(routeGuardMissingHandoff));
  const routeGuardMissingBundle = createFreshEvidenceBundleSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    routeGuardStatus: "missing",
  });
  assert.equal(routeGuardMissingBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_route_guard"), true);
  const routeGuardMissingGoNoGo = createGoNoGoPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    routeGuardStatus: "missing",
  });
  assert.equal(routeGuardMissingGoNoGo.no_go_reasons.includes("no_go_missing_route_guard"), true);
  const missingComponentBundle = createFreshEvidenceBundleSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: {},
    enablementGateSummary: {},
    ownerHandoffSummary: {},
  });
  assert.equal(missingComponentBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_allowlist_preflight"), true);
  assert.equal(missingComponentBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_enablement_gate"), true);
  assert.equal(missingComponentBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_owner_handoff"), true);
  const missingComponentGoNoGo = createGoNoGoPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: {},
    enablementGateSummary: {},
    ownerHandoffSummary: {},
    freshEvidenceBundleSummary: {},
  });
  assert.equal(missingComponentGoNoGo.no_go_reasons.includes("no_go_missing_allowlist_preflight"), true);
  assert.equal(missingComponentGoNoGo.no_go_reasons.includes("no_go_missing_enablement_gate"), true);
  assert.equal(missingComponentGoNoGo.no_go_reasons.includes("no_go_missing_owner_handoff"), true);
  assert.equal(missingComponentGoNoGo.no_go_reasons.includes("no_go_missing_fresh_evidence_bundle"), true);

  const missingOwnerProvidedProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_FRAMEWORK_JS: join(tmpDir, "missing-owner-framework-loader.js"),
    IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_framework_model_loader_v1",
  });
  assert.equal(missingOwnerProvidedProvisioning.provisioning_status, "operator_attention_required");
  assert.equal(missingOwnerProvidedProvisioning.loader_dependency_status, "operator_attention_required");
  assert.equal(JSON.stringify(missingOwnerProvidedProvisioning).includes("missing-owner-framework-loader"), false);
  assertSafe(JSON.stringify(missingOwnerProvidedProvisioning));

  const moduleEnvProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE: ownerFrameworkLoaderPath,
  });
  assert.equal(moduleEnvProvisioning.provisioning_status, "candidate_present");
  assert.equal(moduleEnvProvisioning.loader_kind, "cubism_framework_model_loader_v1");
  assert.equal(moduleEnvProvisioning.configured_env_names.includes("IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE"), true);
  assert.equal(JSON.stringify(moduleEnvProvisioning).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(moduleEnvProvisioning));

  const mocCreateProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_moc_create",
  });
  assert.equal(mocCreateProvisioning.provisioning_status, "future_only");
  assert.equal(mocCreateProvisioning.loader_dependency_status, "future_only");
  assert.equal(mocCreateProvisioning.loader_kind, "cubism_moc_create");
  assert.equal(mocCreateProvisioning.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(mocCreateProvisioning));
  const mocCreatePreflight = createTrustedLoaderAllowlistPreflightSummary({ loaderProvisioning: mocCreateProvisioning });
  assert.equal(mocCreatePreflight.trusted_loader_candidate_status, "future_only");
  assert.equal(mocCreatePreflight.trusted_loader_allowlist_status, "disabled");
  assert.equal(mocCreatePreflight.renderer_ready, false);
  assertSafe(JSON.stringify(mocCreatePreflight));
  const mocCreateEnablementGate = createTrustedLoaderEnablementGateSummary({ loaderProvisioning: mocCreateProvisioning });
  assert.equal(mocCreateEnablementGate.trusted_loader_enablement_blockers.includes("blocked_future_only_loader_kind"), true);
  assert.equal(mocCreateEnablementGate.renderer_ready, false);
  assertSafe(JSON.stringify(mocCreateEnablementGate));
  const mocCreateHandoff = createTrustedLoaderOwnerHandoffSummary({ loaderProvisioning: mocCreateProvisioning });
  assert.equal(mocCreateHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_future_only_loader_kind"), true);
  assert.equal(mocCreateHandoff.renderer_ready, false);
  assertSafe(JSON.stringify(mocCreateHandoff));

  const unsupportedProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_LOADER_KIND: "unknown_loader",
  });
  assert.equal(unsupportedProvisioning.provisioning_status, "unsupported_loader_kind");
  assert.equal(unsupportedProvisioning.loader_kind, "unsupported_loader_kind");
  assertSafe(JSON.stringify(unsupportedProvisioning));
  const unsupportedPreflight = createTrustedLoaderAllowlistPreflightSummary({ loaderProvisioning: unsupportedProvisioning });
  assert.equal(unsupportedPreflight.trusted_loader_candidate_status, "blocked_unknown_loader");
  assert.equal(unsupportedPreflight.trusted_loader_allowlist_status, "disabled");
  assert.equal(unsupportedPreflight.renderer_ready, false);
  assertSafe(JSON.stringify(unsupportedPreflight));
  const unsupportedEnablementGate = createTrustedLoaderEnablementGateSummary({ loaderProvisioning: unsupportedProvisioning });
  assert.equal(unsupportedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_unknown_loader_kind"), true);
  assert.equal(unsupportedEnablementGate.renderer_ready, false);
  assertSafe(JSON.stringify(unsupportedEnablementGate));
  const unsupportedHandoff = createTrustedLoaderOwnerHandoffSummary({ loaderProvisioning: unsupportedProvisioning });
  assert.equal(unsupportedHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_unknown_loader_kind"), true);
  assert.equal(unsupportedHandoff.renderer_ready, false);
  assertSafe(JSON.stringify(unsupportedHandoff));

  const staleEnablementGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "stale",
      fixture_evidence_status: "not_fixture",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(staleEnablementGate.trusted_loader_enablement_blockers.includes("blocked_stale_real_evidence"), true);
  const staleOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "stale",
      fixture_evidence_status: "not_fixture",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(staleOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_stale_real_evidence"), true);
  const dryRunEnablementGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "fresh",
      fixture_evidence_status: "not_fixture",
      dry_run_evidence_status: "dry_run_only",
    },
  });
  assert.equal(dryRunEnablementGate.trusted_loader_enablement_blockers.includes("blocked_dry_run_evidence_only"), true);
  const dryRunOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "fresh",
      fixture_evidence_status: "not_fixture",
      dry_run_evidence_status: "dry_run_only",
    },
  });
  assert.equal(dryRunOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_dry_run_evidence_only"), true);
  const expiredOwnerConfirmationGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    ownerConfirmation: true,
    ownerConfirmationFresh: false,
  });
  assert.equal(expiredOwnerConfirmationGate.trusted_loader_enablement_blockers.includes("blocked_owner_confirmation_expired"), true);
  const expiredOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    ownerConfirmation: true,
    ownerConfirmationFresh: false,
  });
  assert.equal(expiredOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_expired_owner_confirmation"), true);

  for (const unsafeValue of [
    "https://secret.example/framework.js",
    "secret-token",
    "raw loader error stack trace",
  ]) {
    const unsafeProvisioning = inspectCubismLoaderProvisioning({
      IRIS_LIVE2D_CUBISM_FRAMEWORK_JS: unsafeValue,
      IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_framework_model_loader_v1",
    });
    assert.equal(unsafeProvisioning.provisioning_status, "unsafe_configuration");
    const serializedProvisioning = JSON.stringify(unsafeProvisioning);
    assert.equal(serializedProvisioning.includes(unsafeValue), false);
    assertSafe(serializedProvisioning);
  }
  const missingTrustedEvidence = validateTrustedLoaderEvidence(null, { nowMs });
  assert.equal(missingTrustedEvidence.error_kind, "trusted_loader_evidence_missing");
  assert.equal(missingTrustedEvidence.status, "missing");

  const futureTrustedEvidence = trustedLoaderEvidenceFixture();
  assert.equal(isTrustedLoaderEvidenceCandidate(futureTrustedEvidence), true);
  const futureTrustedValidation = validateTrustedLoaderEvidence(futureTrustedEvidence, {
    nowMs,
    expectedModelId: "iris_default",
    expectedSceneId: "main_scene",
  });
  assert.equal(futureTrustedValidation.status, "future_only");
  assert.equal(futureTrustedValidation.error_kind, "trusted_loader_future_only");
  assert.equal(futureTrustedValidation.trusted_loader_ready_candidate, false);
  const futureTrustedSummary = createTrustedLoaderEvidenceSummary(futureTrustedValidation);
  assert.equal(futureTrustedSummary.trusted_loader_evidence_status, "future_only");
  assert.equal(futureTrustedSummary.trusted_loader_policy_gate, true);
  assert.equal(futureTrustedSummary.trusted_loader_ready_candidate, false);
  assertSafe(JSON.stringify(futureTrustedSummary));

  const unknownTrustedValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ loader_kind: "unknown_loader_fixture" }),
    { nowMs }
  );
  assert.equal(unknownTrustedValidation.status, "untrusted");
  assert.equal(unknownTrustedValidation.error_kind, "trusted_loader_kind_untrusted");
  const missingPolicyGateValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ server_trusted_policy_gate: false }),
    { nowMs }
  );
  assert.equal(missingPolicyGateValidation.error_kind, "trusted_loader_policy_gate_missing");
  const staleTrustedValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({
      loaded_at_ms: nowMs - 10_000,
      fresh_heartbeat_timestamp_ms: nowMs - 10_000,
    }),
    { nowMs }
  );
  assert.equal(staleTrustedValidation.error_kind, "trusted_loader_evidence_stale");
  const modelMismatchTrustedValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ model_id: "other_model" }),
    { nowMs, expectedModelId: "iris_default" }
  );
  assert.equal(modelMismatchTrustedValidation.error_kind, "trusted_loader_evidence_invalid");
  const sceneMismatchTrustedValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ scene_id: "other_scene" }),
    { nowMs, expectedSceneId: "main_scene" }
  );
  assert.equal(sceneMismatchTrustedValidation.error_kind, "trusted_loader_evidence_invalid");
  for (const field of [
    "raw_model_path",
    "model_path",
    "internal_model_path",
    "raw_asset_path",
    "asset_path",
    "raw_manifest_body",
    "manifest_body",
    "raw_loader_error",
    "loader_error",
    "stack",
    "stack_trace",
    "endpoint",
    "renderer_endpoint",
    "url",
    "token",
    "secret",
    "authorization",
    "credential",
    "password",
    "api_key",
    "raw_cue_payload",
    "raw_payload",
    "raw_motion_command",
    "candidate",
    "command",
    "world_command",
    "obs_command",
    "game_input",
    "os_command",
  ]) {
    const unsafeTrustedValidation = validateTrustedLoaderEvidence(
      trustedLoaderEvidenceFixture({ [field]: "unsafe_fixture_value" }),
      { nowMs }
    );
    assert.equal(unsafeTrustedValidation.error_kind, "trusted_loader_evidence_unsafe");
    const unsafeTrustedSummary = JSON.stringify(createTrustedLoaderEvidenceSummary(unsafeTrustedValidation));
    assert.equal(unsafeTrustedSummary.includes(`"${field}"`), false);
    assert.equal(unsafeTrustedSummary.includes("unsafe_fixture_value"), false);
    assertSafe(unsafeTrustedSummary);
  }
  const unsafeTrustedValueValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ loader_version: "https://secret.example/loader" }),
    { nowMs }
  );
  assert.equal(unsafeTrustedValueValidation.error_kind, "trusted_loader_evidence_unsafe");

  const missing = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const health = await missing.getJson("/health");
  assert.equal(health.ok, true);
  assert.equal(health.renderer_process_alive, true);
  assert.equal(health.renderer_ready, false);
  assert.equal(health.model3_manifest_available, false);
  assert.equal(health.loader_provisioning.provisioning_status, "not_configured");
  assert.equal(health.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(health));

  const statusBefore = await missing.getJson("/status");
  assert.equal(statusBefore.model_id, "iris_default");
  assert.equal(statusBefore.scene_id, "main_scene");
  assert.equal(statusBefore.renderer_ready, false);
  assert.equal(statusBefore.renderer_health.model3_manifest_available, false);
  assert.equal(statusBefore.renderer_health.loader_provisioning.provisioning_status, "not_configured");
  assert.equal(statusBefore.renderer_health.loader_provisioning.loader_dependency_status, "missing_dependency");
  assert.equal(statusBefore.renderer_health.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(statusBefore.renderer_health.trusted_loader_evidence_status, "missing");
  assert.equal(statusBefore.renderer_health.trusted_loader_ready_candidate, false);
  assert.equal(statusBefore.last_cue_received_at, null);
  assert.equal(statusBefore.cue_capability.live2d_engine_request, true);
  assertSafe(JSON.stringify(statusBefore));

  const missingRuntimeConfig = await missing.getJson("/renderer/runtime-config");
  assert.equal(missingRuntimeConfig.cubism_sdk.available, false);
  assert.equal(missingRuntimeConfig.model3.available, false);
  assert.equal(missingRuntimeConfig.model3.load_route, "not_available");
  assert.equal(missingRuntimeConfig.model3.browser_load_supported, false);
  assert.equal(missingRuntimeConfig.loader_selection.selected_loader_kind, "cubism_framework_model_loader_v1");
  assert.equal(missingRuntimeConfig.loader_selection.fallback_loader_kind, "cubism_moc_create");
  assert.equal(missingRuntimeConfig.loader_selection.dependency_status, "missing_dependency");
  assert.equal(missingRuntimeConfig.loader_selection.trusted_loader_allowlist_enabled, false);
  assert.equal(missingRuntimeConfig.loader_provisioning.provisioning_status, "not_configured");
  assert.equal(missingRuntimeConfig.loader_provisioning.loader_dependency_status, "missing_dependency");
  assert.equal(missingRuntimeConfig.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(missingRuntimeConfig.loader_provisioning.configured_env_count, 0);
  assertSafe(JSON.stringify(missingRuntimeConfig));
  const missingModel3 = await fetchJsonStatus(`${missing.baseUrl}/renderer/model3`);
  assert.equal(missingModel3.status, 404);
  assert.equal(missingModel3.body.error_kind, "not_found");
  assertSafe(JSON.stringify(missingModel3.body));

  const browserState = createInitialRendererState();
  applyRuntimeConfig(browserState, {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: false },
  }, true);
  assert.equal(browserState.model3ManifestAvailable, true);
  assert.equal(browserState.model3Loaded, false);
  assert.equal(browserState.sceneLoaded, false);
  assert.equal(browserState.model3BrowserLoadSupported, false);
  assert.equal(browserState.modelLoadStatus, "not_configured");
  assert.equal(enqueueBrowserCues(browserState, [{ status_hash: "browser_pending_hash" }]), 1);
  const pendingFlush = flushPendingCues(browserState, () => nowMs);
  assert.equal(pendingFlush.applied_count, 0);
  assert.equal(pendingFlush.pending_cue_count, 1);
  assert.equal(browserState.lastCueApplyStatus, "queued_until_ready");
  assert.equal(browserStatusText(browserState), "Live2D renderer preserving cue until real model load");
  const browserHeartbeatPayload = createHeartbeatPayload(browserState, nowMs);
  assert.equal(browserHeartbeatPayload.model3_loaded, false);
  assert.equal(browserHeartbeatPayload.scene_loaded, false);
  assert.equal(browserHeartbeatPayload.real_model_loaded, false);
  assert.equal(browserHeartbeatPayload.model_load_status, "not_configured");
  assert.equal(browserHeartbeatPayload.cue_capability.model_motion_update, false);

  const assetRouteOnlyState = createInitialRendererState();
  const assetRouteConfig = {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: true },
  };
  applyRuntimeConfig(assetRouteOnlyState, assetRouteConfig, false);
  assert.equal(assetRouteOnlyState.modelAssetRouteAvailable, true);
  assert.equal(assetRouteOnlyState.model3Loaded, false);
  assert.equal(assetRouteOnlyState.sceneLoaded, false);
  assert.equal(createHeartbeatPayload(assetRouteOnlyState, nowMs).real_model_loaded, false);
  await updateModelLoadEvidence(assetRouteOnlyState, assetRouteConfig, {
    fetchImpl: async () => {
      throw new Error("fetch_not_expected_for_runtime_missing");
    },
    runtimeRoot: {},
  });
  assert.equal(assetRouteOnlyState.modelLoadStatus, "runtime_missing");
  assert.equal(assetRouteOnlyState.realModelLoadSupported, false);
  assert.equal(assetRouteOnlyState.model3Loaded, false);
  assert.equal(assetRouteOnlyState.sceneLoaded, false);

  const cubismCoreOnlyState = createInitialRendererState();
  applyRuntimeConfig(cubismCoreOnlyState, assetRouteConfig, true);
  assert.equal(detectCubismModelLoader({ Live2DCubismCore: { Version: "contract" } }), null);
  await updateModelLoadEvidence(cubismCoreOnlyState, assetRouteConfig, {
    fetchImpl: async () => {
      throw new Error("fetch_not_expected_for_loader_missing");
    },
    runtimeRoot: { Live2DCubismCore: { Version: "contract" } },
  });
  assert.equal(cubismCoreOnlyState.cubismRuntimeLoaded, true);
  assert.equal(cubismCoreOnlyState.modelAssetRouteAvailable, true);
  assert.equal(cubismCoreOnlyState.modelLoadStatus, "loader_missing");
  assert.equal(cubismCoreOnlyState.modelLoadErrorKind, "missing_dependency");
  assert.equal(cubismCoreOnlyState.loaderCapabilityClass, "cubism_core_only");
  assert.equal(cubismCoreOnlyState.loaderDependencyStatus, "missing_dependency");
  assert.equal(cubismCoreOnlyState.modelLoadSupported, false);
  assert.equal(cubismCoreOnlyState.modelLoadSucceeded, false);
  assert.equal(cubismCoreOnlyState.realModelLoadSupported, false);
  assert.equal(cubismCoreOnlyState.model3Loaded, false);
  assert.equal(cubismCoreOnlyState.sceneLoaded, false);
  const loaderMissingPayload = createHeartbeatPayload(cubismCoreOnlyState, nowMs);
  assert.equal(loaderMissingPayload.model_load_status, "loader_missing");
  assert.equal(loaderMissingPayload.model_load_error_kind, "missing_dependency");
  assert.equal(loaderMissingPayload.loader_capability_class, "cubism_core_only");
  assert.equal(loaderMissingPayload.loader_dependency_status, "missing_dependency");
  assert.equal(loaderMissingPayload.loader_candidate_kind, "none");
  assert.equal(loaderMissingPayload.real_model_loaded, false);
  assert.equal(loaderMissingPayload.real_scene_loaded, false);
  assertSafe(JSON.stringify(loaderMissingPayload));

  const fakeLoaderState = createInitialRendererState();
  applyRuntimeConfig(fakeLoaderState, assetRouteConfig, true);
  assert.equal(detectCubismModelLoader(createFakeLoaderRuntime())?.kind, "cubism_moc_create");
  await updateModelLoadEvidence(fakeLoaderState, assetRouteConfig, {
    fetchImpl: createFakeLoaderFetch(),
    runtimeRoot: createFakeLoaderRuntime(),
  });
  assert.equal(fakeLoaderState.modelLoadStatus, "loader_missing");
  assert.equal(fakeLoaderState.modelLoadErrorKind, "operator_attention_required");
  assert.equal(fakeLoaderState.loaderCapabilityClass, "loader_detected_untrusted");
  assert.equal(fakeLoaderState.loaderDependencyStatus, "operator_attention_required");
  assert.equal(fakeLoaderState.loaderCandidateKind, "cubism_moc_create");
  assert.equal(fakeLoaderState.modelLoadSupported, false);
  assert.equal(fakeLoaderState.realModelLoadSupported, false);
  assert.equal(fakeLoaderState.model3Loaded, false);
  assert.equal(fakeLoaderState.sceneLoaded, false);
  assert.equal(fakeLoaderState.trustedLoaderEvidence.loader_kind, "cubism_moc_create");
  assert.equal(fakeLoaderState.trustedLoaderEvidence.server_trusted_policy_gate, false);
  const fakeLoaderHeartbeatPayload = createHeartbeatPayload(fakeLoaderState, nowMs);
  assert.equal(fakeLoaderHeartbeatPayload.real_model_load_supported, false);
  assert.equal(fakeLoaderHeartbeatPayload.real_model_loaded, false);
  assert.equal(fakeLoaderHeartbeatPayload.trusted_loader_evidence.loader_kind, "cubism_moc_create");
  assert.equal(fakeLoaderHeartbeatPayload.trusted_loader_evidence.server_trusted_policy_gate, false);
  const fakeLoaderHeartbeat = await missing.postJson(
    "/renderer/heartbeat",
    fakeLoaderHeartbeatPayload
  );
  assert.equal(fakeLoaderHeartbeat.renderer_ready, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.real_model_load_supported, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_load_supported, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_loaded_claimed, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.real_model_loaded_claimed, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.loader_capability_class, "loader_detected_untrusted");
  assert.equal(fakeLoaderHeartbeat.renderer_health.loader_dependency_status, "operator_attention_required");
  assert.equal(fakeLoaderHeartbeat.renderer_health.loader_candidate_kind, "cubism_moc_create");
  assert.equal(fakeLoaderHeartbeat.renderer_health.trusted_loader_evidence_status, "missing");
  assert.equal(fakeLoaderHeartbeat.renderer_health.trusted_loader_error_kind, "trusted_loader_policy_gate_missing");
  assertSafe(JSON.stringify(fakeLoaderHeartbeat));

  const diagnosticTrustedLoaderHeartbeat = await missing.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    trusted_loader_evidence: trustedLoaderEvidenceFixture({
      loader_kind: "cubism_moc_create",
    }),
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_ready, false);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.real_model_load_supported, false);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.model_loaded, false);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.trusted_loader_evidence_status, "future_only");
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.trusted_loader_kind, "cubism_moc_create");
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.trusted_loader_policy_gate, true);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.trusted_loader_ready_candidate, false);
  assertSafe(JSON.stringify(diagnosticTrustedLoaderHeartbeat));

  browserState.realModelLoadSupported = true;
  browserState.model3Loaded = true;
  browserState.sceneLoaded = true;
  const appliedFlush = flushPendingCues(browserState, () => nowMs);
  assert.equal(appliedFlush.applied_count, 1);
  assert.equal(appliedFlush.pending_cue_count, 0);
  assert.equal(browserState.lastAppliedCueStatusHash, "browser_pending_hash");

  const eventStreamBrowserState = createInitialRendererState();
  applyRuntimeConfig(eventStreamBrowserState, {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: false },
  }, true);
  const eventStreamPending = handleCueEventMessage(eventStreamBrowserState, {
    data: JSON.stringify({ cues: [{ status_hash: "event_stream_pending_hash" }] }),
  });
  assert.equal(eventStreamPending.applied_count, 0);
  assert.equal(eventStreamPending.pending_cue_count, 1);
  assert.equal(eventStreamBrowserState.lastCueApplyStatus, "queued_until_ready");
  eventStreamBrowserState.realModelLoadSupported = true;
  eventStreamBrowserState.model3Loaded = true;
  eventStreamBrowserState.sceneLoaded = true;
  const eventStreamApplied = flushPendingCues(eventStreamBrowserState, () => nowMs);
  assert.equal(eventStreamApplied.applied_count, 1);
  assert.equal(eventStreamBrowserState.lastAppliedCueStatusHash, "event_stream_pending_hash");

  const sdkMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: false,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sdkMissingHeartbeat.renderer_ready, false);
  assert.equal(sdkMissingHeartbeat.renderer_health.cubism_sdk_loaded, false);
  assertSafe(JSON.stringify(sdkMissingHeartbeat));

  const mismatchedHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    model_id: "other_model",
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(mismatchedHeartbeat.renderer_ready, false);
  assert.equal(mismatchedHeartbeat.renderer_health.model_matches, false);
  assertSafe(JSON.stringify(mismatchedHeartbeat));

  const staleHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs - 10_000,
  }));
  assert.equal(staleHeartbeat.renderer_ready, false);
  assert.equal(staleHeartbeat.renderer_health.fresh_heartbeat, false);
  assertSafe(JSON.stringify(staleHeartbeat));

  const loaderMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loader_missing",
    model_load_supported: false,
    model_load_attempted: false,
    model_load_succeeded: false,
    model_load_error_kind: "loader_missing",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(loaderMissingHeartbeat.renderer_ready, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.model_load_status, "loader_missing");
  assert.equal(loaderMissingHeartbeat.renderer_health.model_load_supported, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.model_loaded, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(loaderMissingHeartbeat));

  const runtimeMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: false,
    model_asset_route_available: true,
    model_load_status: "runtime_missing",
    model_load_supported: false,
    model_load_error_kind: "runtime_missing",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(runtimeMissingHeartbeat.renderer_ready, false);
  assert.equal(runtimeMissingHeartbeat.renderer_health.cubism_sdk_loaded, false);
  assert.equal(runtimeMissingHeartbeat.renderer_health.model_load_status, "runtime_missing");
  assert.equal(runtimeMissingHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(runtimeMissingHeartbeat));

  const engineResponse = await missing.postJson("/live2d-engine", {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_job",
    event_id: "contract_event",
    motion_style: "talk",
    timing: { total_duration_ms: 1200 },
    engine_preferences: { model_id: "iris_default", scene_id: "main_scene" },
  });
  assert.equal(engineResponse.accepted, true);
  assert.equal(engineResponse.queued_for_browser, true);
  assert.equal(engineResponse.renderer_ready, false);
  assert.equal(typeof engineResponse.cue_summary.status_hash, "string");
  assertSafe(JSON.stringify(engineResponse));

  const browserCueQueue = await missing.getJson("/renderer/cues");
  assert.equal(browserCueQueue.ok, true);
  assert.equal(browserCueQueue.delivery_ready, false);
  assert.equal(browserCueQueue.cues.length, 0);
  assert.equal(browserCueQueue.pending_cue_count, 1);
  assert.equal(browserCueQueue.delivery_status, "waiting_for_browser_ready");
  assertSafe(JSON.stringify(browserCueQueue));

  const waitingSse = await readSseEvents(missing.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(waitingSse.contentType.includes("text/event-stream"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "renderer_status"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "heartbeat"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(waitingSse.events));
  const statusAfterWaitingSse = await missing.getJson("/status");
  assert.equal(statusAfterWaitingSse.browser_delivery.pending_cue_count, 1);
  assert.equal(statusAfterWaitingSse.renderer_ready, false);

  const cueResponse = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "idle_breath" },
      timing: { duration_ms: 900 },
      boundary_policy: {
        renderer_cue_only: true,
        no_text_payloads: true,
        no_candidates: true,
        no_commands: true,
        no_endpoint_values: true,
        no_secret_values: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(cueResponse.accepted, true);
  assert.equal(cueResponse.renderer_ready, false);
  assertSafe(JSON.stringify(cueResponse));

  const irisBridgeCue = createIrisBridgeCueFixture();
  const irisBridgeCueResponse = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: irisBridgeCue,
    boundary_policy: {
      no_text_payloads: true,
      no_candidates: true,
      no_commands: true,
      no_endpoint_values: true,
      no_secret_values: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(irisBridgeCueResponse.accepted, true);
  assert.equal(irisBridgeCueResponse.renderer_ready, false);
  assertSafe(JSON.stringify(irisBridgeCueResponse));

  const strongWithRecovery = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "laugh_big", intensity: "high" },
      recovery_plan: { type: "breath_recover" },
      boundary_policy: {
        renderer_cue_only: true,
        no_candidates: true,
        no_commands: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(strongWithRecovery.accepted, true);
  assertSafe(JSON.stringify(strongWithRecovery));

  const cameraCloseupWithRecovery = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      camera: {
        proximity_profile: "close_face",
        scale: 1.1,
        face_priority: true,
        comfort_guard: "bounded_viewer_closeup",
        recovery_hint: "visibility_restore",
      },
      boundary_policy: {
        renderer_cue_only: true,
        no_candidates: true,
        no_commands: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(cameraCloseupWithRecovery.accepted, true);
  assertSafe(JSON.stringify(cameraCloseupWithRecovery));

  const happyLoudSingWithRecovery = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "happy_loud_sing", intensity: "high" },
    recovery_cue: { style: "idle_breath" },
  }));
  assert.equal(happyLoudSingWithRecovery.accepted, true);
  assertSafe(JSON.stringify(happyLoudSingWithRecovery));

  const cameraScaleWithRecovery = await missing.postJson("/cue", rendererCueDelivery({
    camera: { scale: 1.06, recovery_hint: "visibility_restore" },
  }));
  assert.equal(cameraScaleWithRecovery.accepted, true);
  assertSafe(JSON.stringify(cameraScaleWithRecovery));

  const rendererCueWrapper = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
    boundary_policy: {
      renderer_cue_only: true,
      no_candidates: true,
      no_commands: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(rendererCueWrapper.accepted, true);
  assertSafe(JSON.stringify(rendererCueWrapper));

  const live2dCueWrapper = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    live2d_cue: safeRendererCue({ motion: { style: "idle_breath" } }),
    boundary_policy: {
      renderer_cue_only: true,
      no_candidates: true,
      no_commands: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(live2dCueWrapper.accepted, true);
  assertSafe(JSON.stringify(live2dCueWrapper));

  const motionRecoveryRequired = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "surprise_scream", recovery_required: true },
  }));
  assert.equal(motionRecoveryRequired.accepted, true);
  assertSafe(JSON.stringify(motionRecoveryRequired));

  const bodyRecoveryHint = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "happy_dance", intensity: "high" },
    body: { recovery_hint: "neutral_reset" },
  }));
  assert.equal(bodyRecoveryHint.accepted, true);
  assertSafe(JSON.stringify(bodyRecoveryHint));

  const cameraRecoveryHint = await missing.postJson("/cue", rendererCueDelivery({
    camera: { face_priority: true, recovery_hint: "visibility_restore" },
  }));
  assert.equal(cameraRecoveryHint.accepted, true);
  assertSafe(JSON.stringify(cameraRecoveryHint));

  const shoulderMotionRecoverCompatibility = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "surprise_scream" },
    body: { shoulder_motion: "short_jump_then_breath_recover" },
  }));
  assert.equal(shoulderMotionRecoverCompatibility.accepted, true);
  assertSafe(JSON.stringify(shoulderMotionRecoverCompatibility));

  const localEngineCloseupWithRecovery = await missing.postJson("/live2d-engine", {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_closeup_with_recovery",
    event_id: "contract_event",
    motion_style: "talk",
    camera_proximity_profile: "close_face",
    camera_recovery_hint: "visibility_restore",
    timing: { total_duration_ms: 1200 },
  });
  assert.equal(localEngineCloseupWithRecovery.accepted, true);
  assertSafe(JSON.stringify(localEngineCloseupWithRecovery));

  const mockHealthHeartbeat = await missing.postJson("/renderer/heartbeat", {
    schema: "mock_health_v1",
    ok: true,
    heartbeat_timestamp_ms: nowMs,
  });
  assert.equal(mockHealthHeartbeat.renderer_ready, false);
  assert.equal(mockHealthHeartbeat.renderer_health.cue_capability_confirmed, false);
  assertSafe(JSON.stringify(mockHealthHeartbeat));

  const unsafe = await fetch(`${missing.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schema: "bad", endpoint: "https://secret.example/cue", token: "secret-token" }),
  });
  const unsafeBody = await unsafe.json();
  assert.equal(unsafe.status, 400);
  assert.equal(unsafeBody.ok, false);
  assertSafe(JSON.stringify(unsafeBody));

  await assertCueRejected(missing, {
    schema: "unsupported_live2d_cue_v1",
    cue: { schema: "iris_live2d_renderer_cue_v1", motion: { style: "talk" } },
  }, "unsupported_cue", "unsupported_live2d_cue_v1");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: { schema: "iris_live2d_renderer_cue_v1", motion: { style: "spin_attack" } },
  }, "unknown_motion_style", "spin_attack");
  for (const futureMicroLabel of [
    "blink_attention",
    "small_nod",
    "soft_smile",
    "surprise_micro",
    "breathing_shift",
    "gaze_return",
    "neutral_breath",
  ]) {
    await assertCueRejected(missing, rendererCueDelivery({
      motion: { style: futureMicroLabel },
    }), "unknown_motion_style", futureMicroLabel);
  }
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk", gesture_hint: "https://secret.example/motion" },
    },
  }, "unsafe_cue_value", "https://secret.example/motion");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "talk", gesture_hint: "wss://secret.example/cue" },
  }), "unsafe_cue_value", "wss://secret.example/cue");
  await assertCueRejected(missing, rendererCueDelivery({
    expression: { expression_key: "avatar.model3.json" },
  }), "unsafe_cue_value", "avatar.model3.json");
  await assertCueRejected(missing, rendererCueDelivery({
    expression: { expression_key: "avatar.moc3" },
  }), "unsafe_cue_value", "avatar.moc3");
  for (const field of [
    "world_command",
    "input_action_candidate",
    "approved_game_input_action",
    "candidate",
    "commit",
    "write",
    "raw_renderer_payload",
    "raw_motion_command",
    "model_path",
    "modelPath",
    "internal_model_path",
    "internalModelPath",
    "motion_path",
    "motionPath",
    "rawMotionPath",
    "obs_command",
    "game_input",
    "os_command",
  ]) {
    await assertCueRejected(missing, cueWithUnsafeField(field), "unsafe_cue_field", field);
  }
  for (const field of ["token", "secret", "authorization", "endpoint", "rendererEndpoint", "url", "apiKey"]) {
    await assertCueRejected(missing, cueWithUnsafeField(field), "unsafe_cue_field", field);
  }
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
    token: "unsafe_fixture_value",
  }, "unsafe_cue_field", "token");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    live2d_cue: safeRendererCue({ raw_renderer_payload: "unsafe_fixture_value" }),
  }, "unsafe_cue_field", "raw_renderer_payload");
  await assertCueRejected(missing, {
    schema: "unsupported_live2d_wrapper_v1",
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
  }, "unsupported_cue", "unsupported_live2d_wrapper_v1");
  await assertCueRejected(missing, rendererCueDelivery({
    boundary_policy: { renderer_endpoint: "unsafe_fixture_value" },
  }), "unsafe_cue_field", "renderer_endpoint");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "laugh_big" },
    recovery_plan: { type: "shortcut_jump" },
  }), "invalid_cue_contract", "shortcut_jump");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "laugh_big" },
    recovery_cue: { style: "shortcut_jump" },
  }), "invalid_cue_contract", "shortcut_jump");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "laugh_big" },
    },
  }, "recovery_required", "laugh_big");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "surprise_scream" },
    },
  }, "recovery_required", "surprise_scream");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "happy_dance" },
    },
  }, "recovery_required", "happy_dance");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "happy_loud_sing" },
    },
  }, "recovery_required", "happy_loud_sing");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      camera: { face_priority: true },
    },
  }, "recovery_required", "face_priority");
  await assertCueRejected(missing, rendererCueDelivery({
    camera: { scale: 1.06 },
  }), "recovery_required", "scale");
  await assertCueRejected(missing, rendererCueDelivery({
    camera: { proximity_profile: "close_face" },
  }), "recovery_required", "close_face");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_strong_without_recovery",
    event_id: "contract_event",
    motion_style: "laugh_big",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "laugh_big", "/live2d-engine");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_local_closeup_without_recovery",
    event_id: "contract_event",
    motion_style: "talk",
    camera_proximity_profile: "close_face",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "close_face", "/live2d-engine");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_local_sing_without_recovery",
    event_id: "contract_event",
    motion_style: "happy_loud_sing",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "happy_loud_sing", "/live2d-engine");

  const statusAfter = await missing.getJson("/status");
  assert.equal(statusAfter.renderer_ready, false);
  assert.equal(statusAfter.received_cue_count, 14);
  assert.equal(statusAfter.browser_delivery.pending_cue_count, 14);
  assert.notEqual(statusAfter.last_cue_received_at, null);
  assertSafe(JSON.stringify(statusAfter));

  await missing.close();

  const modelOnly = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const modelOnlyCue = await modelOnly.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
    },
  });
  const modelOnlyHeartbeat = await modelOnly.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: modelOnlyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelOnlyHeartbeat.renderer_ready, false);
  assert.equal(modelOnlyHeartbeat.renderer_health.cubism_sdk_available, false);
  assertSafe(JSON.stringify(modelOnlyHeartbeat));
  await modelOnly.close();

  const ready = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const readyRuntimeConfig = await ready.getJson("/renderer/runtime-config");
  assert.equal(readyRuntimeConfig.cubism_sdk.available, true);
  assert.equal(readyRuntimeConfig.model3.available, true);
  assert.equal(readyRuntimeConfig.model3.manifest_available, true);
  assert.equal(readyRuntimeConfig.model3.load_route, "renderer_model3_manifest");
  assert.equal(readyRuntimeConfig.model3.asset_route, "renderer_model_asset");
  assert.equal(readyRuntimeConfig.model3.browser_load_supported, true);
  assert.equal(readyRuntimeConfig.model3.real_model_loaded, false);
  assert.equal(readyRuntimeConfig.loader_provisioning.provisioning_status, "not_configured");
  assert.equal(readyRuntimeConfig.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(readyRuntimeConfig));
  assertNoModelPathLeak(JSON.stringify(readyRuntimeConfig));
  const readyCoreScript = await ready.getText("/renderer/cubism-core.js");
  assert.equal(readyCoreScript.includes("Live2DCubismCore"), true);
  const readyCoreTraversal = await fetchJsonStatus(`${ready.baseUrl}/renderer/cubism-core.js?asset=../CubismCore.js`);
  assert.equal(readyCoreTraversal.status, 403);
  assert.equal(readyCoreTraversal.body.core_route_status, "blocked_traversal");
  assertSafe(JSON.stringify(readyCoreTraversal.body));
  assertNoModelPathLeak(JSON.stringify(readyCoreTraversal.body));
  const readyCoreNonLoopback = await fetch(`${ready.baseUrl}/renderer/cubism-core.js`, {
    headers: { "x-forwarded-for": "203.0.113.10" },
  });
  const readyCoreNonLoopbackBody = await readyCoreNonLoopback.json();
  assert.equal(readyCoreNonLoopback.status, 403);
  assert.equal(readyCoreNonLoopbackBody.core_route_status, "blocked_non_loopback");
  assertSafe(JSON.stringify(readyCoreNonLoopbackBody));
  assertNoModelPathLeak(JSON.stringify(readyCoreNonLoopbackBody));

  const noCoreRoute = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const noCoreRouteStatus = await fetchJsonStatus(`${noCoreRoute.baseUrl}/renderer/cubism-core.js`);
  assert.equal(noCoreRouteStatus.status, 404);
  assert.equal(noCoreRouteStatus.body.core_route_status, "not_configured");
  assert.deepEqual(noCoreRouteStatus.body.configured_env_names, []);
  assertSafe(JSON.stringify(noCoreRouteStatus.body));
  assertNoModelPathLeak(JSON.stringify(noCoreRouteStatus.body));
  await noCoreRoute.close();

  const missingCoreRoute = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: join(tmpDir, "Live2DCubismCore.min.js"),
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const missingCoreRouteStatus = await fetchJsonStatus(`${missingCoreRoute.baseUrl}/renderer/cubism-core.js`);
  assert.equal(missingCoreRouteStatus.status, 404);
  assert.equal(missingCoreRouteStatus.body.core_route_status, "operator_attention_required");
  assert.deepEqual(missingCoreRouteStatus.body.configured_env_names, ["IRIS_LIVE2D_CUBISM_CORE_JS"]);
  assertSafe(JSON.stringify(missingCoreRouteStatus.body));
  assertNoModelPathLeak(JSON.stringify(missingCoreRouteStatus.body));
  await missingCoreRoute.close();

  for (const unsafeCandidate of [unsafeCorePath, unsafeCoreExtensionPath]) {
    const unsafeCoreRoute = await startHarness(createRendererState({
      modelId: "iris_default",
      sceneId: "main_scene",
      cubismCoreJsPath: unsafeCandidate,
      model3JsonPath: model3Path,
      heartbeatMaxAgeMs: 2_000,
      now: () => nowMs,
    }));
    const unsafeCoreRouteStatus = await fetchJsonStatus(`${unsafeCoreRoute.baseUrl}/renderer/cubism-core.js`);
    assert.equal(unsafeCoreRouteStatus.status, 409);
    assert.equal(unsafeCoreRouteStatus.body.core_route_status, "unsafe_configuration");
    assertSafe(JSON.stringify(unsafeCoreRouteStatus.body));
    assertNoModelPathLeak(JSON.stringify(unsafeCoreRouteStatus.body));
    await unsafeCoreRoute.close();
  }
  const traversalCoreRoute = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: `${tmpDir}/../CubismCore.js`,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const traversalCoreRouteStatus = await fetchJsonStatus(`${traversalCoreRoute.baseUrl}/renderer/cubism-core.js`);
  assert.equal(traversalCoreRouteStatus.status, 403);
  assert.equal(traversalCoreRouteStatus.body.core_route_status, "blocked_traversal");
  assertSafe(JSON.stringify(traversalCoreRouteStatus.body));
  assertNoModelPathLeak(JSON.stringify(traversalCoreRouteStatus.body));
  await traversalCoreRoute.close();

  const provisioned = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    cubismLoaderEnv: {
      IRIS_LIVE2D_CUBISM_FRAMEWORK_JS: ownerFrameworkLoaderPath,
      IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_framework_model_loader_v1",
    },
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const provisionedRuntimeConfig = await provisioned.getJson("/renderer/runtime-config");
  assert.equal(provisionedRuntimeConfig.loader_provisioning.provisioning_status, "candidate_present");
  assert.equal(provisionedRuntimeConfig.loader_provisioning.loader_dependency_status, "candidate_present");
  assert.equal(provisionedRuntimeConfig.loader_provisioning.license_status, "license_attention_required");
  assert.equal(provisionedRuntimeConfig.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.model3.real_model_loaded, false);
  assert.equal(provisionedRuntimeConfig.loader_selection.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_preflight_summary.trusted_loader_allowlist_status, "disabled");
  assert.equal(provisionedRuntimeConfig.trusted_loader_preflight_summary.trusted_loader_candidate_status, "candidate_present_diagnostic_only");
  assert.equal(provisionedRuntimeConfig.trusted_loader_preflight_summary.trusted_loader_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_preflight_summary.trusted_loader_real_evidence_prerequisite, "real_evidence_required");
  assert.equal(provisionedRuntimeConfig.trusted_loader_enablement_gate_summary.trusted_loader_enablement_gate_status, "blocked");
  assert.equal(provisionedRuntimeConfig.trusted_loader_enablement_gate_summary.trusted_loader_enablement_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_enablement_gate_summary.trusted_loader_enablement_blockers.includes("blocked_allowlist_disabled"), true);
  assert.equal(provisionedRuntimeConfig.trusted_loader_enablement_gate_summary.trusted_loader_enablement_runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_status, "blocked");
  assert.equal(provisionedRuntimeConfig.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_enablement_gate_blocked"), true);
  assert.equal(provisionedRuntimeConfig.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.bundle_status, "blocked");
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.bundle_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.bundle_blocked_reasons.includes("bundle_blocked_missing_owner_confirmation"), true);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.bundle_blocked_reasons.includes("bundle_blocked_priority1_unresolved"), true);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.no_loader_trusted, true);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.go_candidate, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.degraded_mode_available, true);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.no_go_reasons.includes("degraded_mode_available_not_go"), true);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.evidence_intake_status, "blocked");
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.intake_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.unsafe_material_rejected, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.owner_confirmation_envelope_status, "blocked");
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.confirmation_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.confirmed_scopes.length, 0);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.real_evidence_request_packet_status, "blocked");
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.request_packet_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.request_packet_collects_real_evidence, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.request_packet_creates_owner_confirmation, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.required_evidence_components.includes("live2d_owner_confirmation_envelope"), true);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.required_confirmation_scopes.includes("owner_confirmation_envelope_review"), true);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.real_resident_evidence_collection_plan_status, "planning_only");
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.collection_started, false);
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.real_probe_started, false);
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.real_resident_evidence_collection_plan_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.real_evidence_collector_manifest_status, "planning_only");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.collector_manifest_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.collector_execution_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.real_evidence_collection_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.real_probe_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.collector_manifest_calls_external_services, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.collector_manifest_creates_owner_confirmation, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_manifest_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.real_evidence_collector_fixture_pack_status, "planning_only");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.fixture_pack_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.collector_fixture_pack_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.collector_dry_run_verifier_status, "planning_only");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.collector_execution_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.real_evidence_collection_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.real_probe_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.external_service_call_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.owner_confirmation_created, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_fixture_pack_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.real_evidence_collector_dry_run_envelope_status, "planning_only");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.collector_dry_run_envelope_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.collector_execution_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.real_evidence_collection_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.real_probe_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.external_service_call_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.owner_confirmation_created, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_collector_dry_run_envelope_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.real_evidence_freshness_threshold_status, "planning_only");
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.freshness_policy_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.real_evidence_collection_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.real_probe_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.production_readiness_claimed, false);
  assertOwnerActionLaneFreezeStatusSurface(provisionedRuntimeConfig.owner_action_lane_freeze_status_summary);
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_freshness_threshold_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.summary_contract_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.real_evidence_collection_started, false);
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.real_probe_started, false);
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.safe_evidence_summary_contract_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.real_evidence_summary_intake_binding_status, "blocked");
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.summary_intake_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.real_evidence_collection_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.real_probe_started, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_summary_intake_binding_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.owner_confirmation_binding_status, "blocked");
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.owner_confirmation_binding_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.owner_confirmation_created, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.real_evidence_collection_started, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.real_probe_started, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_binding_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.go_nogo_blocker_resolution_status, "blocked");
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.blocker_resolution_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.blocker_resolved, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.go_nogo_blocker_resolution_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_schema_preflight_summary.row_schema_preflight_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_schema_preflight_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_schema_preflight_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_request_packet_summary.motion_dataset_real_row_intake_request_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_request_packet_summary.request_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_request_packet_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_request_packet_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_dry_run_validator_summary.motion_dataset_real_row_intake_dry_run_validator_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_dry_run_validator_summary.dry_run_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_dry_run_validator_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_dry_run_validator_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_quarantine_envelope_summary.motion_dataset_real_row_intake_quarantine_envelope_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_quarantine_envelope_summary.quarantine_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_quarantine_envelope_summary.metadata_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_quarantine_envelope_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_quarantine_envelope_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_owner_handoff_packet_summary.motion_dataset_real_row_intake_owner_handoff_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_owner_handoff_packet_summary.handoff_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_owner_handoff_packet_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_owner_handoff_packet_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_intake_owner_handoff_packet_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_audit_manifest_summary.motion_dataset_real_row_audit_manifest_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_audit_manifest_summary.audit_manifest_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_audit_manifest_summary.audit_manifest_is_actual_audit_completion, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_audit_manifest_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_audit_manifest_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.motion_dataset_real_row_redaction_scanner_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.redaction_scanner_fixture_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.synthetic_only, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.real_row_data_present, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_evidence_link_manifest_summary.motion_dataset_real_row_evidence_link_manifest_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_evidence_link_manifest_summary.evidence_link_manifest_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_evidence_link_manifest_summary.no_real_evidence_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_evidence_link_manifest_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_evidence_link_manifest_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_go_nogo_blocker_map_summary.motion_dataset_real_row_go_nogo_blocker_map_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_go_nogo_blocker_map_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_go_nogo_blocker_map_summary.go_candidate, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_go_nogo_blocker_map_summary.blocker_resolved, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_go_nogo_blocker_map_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_pre_ingestion_review_packet_summary.motion_dataset_real_row_pre_ingestion_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_pre_ingestion_review_packet_summary.pre_ingestion_review_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_pre_ingestion_review_packet_summary.real_row_data_present, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_pre_ingestion_review_packet_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_pre_ingestion_review_packet_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_final_dry_run_checklist_summary.motion_dataset_real_row_final_dry_run_checklist_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_final_dry_run_checklist_summary.final_dry_run_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_final_dry_run_checklist_summary.real_row_data_present, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_final_dry_run_checklist_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_final_dry_run_checklist_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_missing_data_fail_closed_gate_summary.motion_dataset_real_row_missing_data_fail_closed_gate_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_missing_data_fail_closed_gate_summary.fail_closed_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_missing_data_fail_closed_gate_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_missing_data_fail_closed_gate_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_missing_data_fail_closed_gate_summary.real_row_data_present, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.motion_dataset_owner_row_data_submission_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.owner_submission_packet_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.no_actual_row_content_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.actual_row_content_accepted, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.real_row_data_present, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_packet_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.motion_dataset_owner_row_data_submission_receipt_stub_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.receipt_stub_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.owner_submission_received, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.owner_submission_accepted, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.actual_row_content_accepted, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.real_row_data_present, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_receipt_stub_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.motion_dataset_owner_row_data_metadata_validator_stub_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.metadata_validator_stub_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.metadata_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.owner_submission_received, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.owner_submission_accepted, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.actual_file_read, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.actual_hash_calculated, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_metadata_validator_stub_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.motion_dataset_owner_row_data_submission_rejection_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.synthetic_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.rejection_fixture_pack_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.owner_submission_received, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.owner_submission_accepted, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.actual_file_read, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.actual_row_content_accepted, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_entry_gate_summary.motion_dataset_actual_data_task_entry_gate_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_entry_gate_summary.entry_gate_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_entry_gate_summary.actual_data_task_started, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_entry_gate_summary.row_body_parser_enabled, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_entry_gate_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_entry_gate_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_entry_gate_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_contract_stub_summary.motion_dataset_row_body_parser_contract_stub_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_contract_stub_summary.row_body_parser_enabled, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_contract_stub_summary.row_body_parser_executed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_contract_stub_summary.row_body_read, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_contract_stub_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_contract_stub_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_rejection_fixture_pack_summary.motion_dataset_row_body_parser_rejection_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_rejection_fixture_pack_summary.synthetic_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_rejection_fixture_pack_summary.row_body_parser_executed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_rejection_fixture_pack_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_body_parser_rejection_fixture_pack_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_audit_trail_stub_summary.motion_dataset_ingestion_audit_trail_stub_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_audit_trail_stub_summary.audit_trail_stub_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_audit_trail_stub_summary.real_ingestion_audit_event_created, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_audit_trail_stub_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_audit_trail_stub_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_rollback_plan_stub_summary.motion_dataset_ingestion_rollback_plan_stub_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_rollback_plan_stub_summary.rollback_plan_stub_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_rollback_plan_stub_summary.rollback_ready, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_rollback_plan_stub_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_ingestion_rollback_plan_stub_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_parser_dry_run_envelope_summary.motion_dataset_parser_dry_run_envelope_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_parser_dry_run_envelope_summary.parser_dry_run_envelope_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_parser_dry_run_envelope_summary.parser_dry_run_executed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_parser_dry_run_envelope_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_parser_dry_run_envelope_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_acceptance_criteria_checklist_summary.motion_dataset_real_row_acceptance_criteria_checklist_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_acceptance_criteria_checklist_summary.acceptance_criteria_checklist_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_acceptance_criteria_checklist_summary.actual_data_accepted, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_acceptance_criteria_checklist_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_acceptance_criteria_checklist_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.motion_dataset_owner_actual_data_task_handoff_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.handoff_review_packet_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.actual_data_task_started, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_no_go_summary_projection_summary.motion_dataset_actual_data_no_go_summary_projection_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_no_go_summary_projection_summary.no_go_preserved_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_no_go_summary_projection_summary.go_candidate, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_no_go_summary_projection_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_submission_readiness_ledger_summary.motion_dataset_owner_submission_readiness_ledger_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_submission_readiness_ledger_summary.owner_submission_accepted, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_submission_readiness_ledger_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_final_actual_data_preauth_blocker_gate_summary.motion_dataset_final_actual_data_preauth_blocker_gate_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_final_actual_data_preauth_blocker_gate_summary.actual_data_preauthorized, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_final_actual_data_preauth_blocker_gate_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_confirmation_preflight_envelope_summary.motion_dataset_owner_confirmation_preflight_envelope_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_confirmation_preflight_envelope_summary.owner_confirmation_created, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_confirmation_preflight_envelope_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_quarantine_staging_envelope_summary.motion_dataset_row_file_quarantine_staging_envelope_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_quarantine_staging_envelope_summary.quarantine_completed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_quarantine_staging_envelope_summary.actual_file_read, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_redaction_scan_execution_envelope_stub_summary.motion_dataset_redaction_scan_execution_envelope_stub_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_redaction_scan_execution_envelope_stub_summary.redaction_scan_executed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_parser_dry_run_execution_request_envelope_summary.motion_dataset_parser_dry_run_execution_request_envelope_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_parser_dry_run_execution_request_envelope_summary.parser_dry_run_executed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_parser_dry_run_execution_request_envelope_summary.row_body_read, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_audit_execution_request_envelope_summary.motion_dataset_audit_execution_request_envelope_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_audit_execution_request_envelope_summary.audit_execution_started, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_runbook_no_action_packet_summary.motion_dataset_actual_data_task_runbook_no_action_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_task_runbook_no_action_packet_summary.external_action_performed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_final_owner_actual_data_packet_summary.motion_dataset_final_owner_actual_data_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_final_owner_actual_data_packet_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_freeze_state_ledger_summary.motion_dataset_actual_data_freeze_state_ledger_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_actual_data_freeze_state_ledger_summary.actual_data_frozen_pending_owner_task, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_wait_state_packet_summary.motion_dataset_owner_wait_state_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_wait_state_packet_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_readiness_non_sweetening_sweep_summary.motion_dataset_readiness_non_sweetening_sweep_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_readiness_non_sweetening_sweep_summary.readiness_sweep_promoted_ready, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_planning_completion_review_packet_summary.motion_dataset_planning_completion_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_planning_completion_review_packet_summary.planning_completion_claims_actual_ready, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_submission_form_spec_summary.motion_dataset_owner_submission_form_spec_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_owner_submission_form_spec_summary.owner_submission_form_accepts_real_data, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_redaction_policy_matrix_summary.motion_dataset_real_row_redaction_policy_matrix_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_real_row_redaction_policy_matrix_summary.redaction_scan_executed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_motion_allowlist_sync_review_summary.motion_dataset_motion_allowlist_sync_review_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_motion_allowlist_sync_review_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_renderer_ready_dependency_matrix_summary.motion_dataset_renderer_ready_dependency_matrix_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_renderer_ready_dependency_matrix_summary.renderer_ready, false);
  assertRendererReadyFalsePositiveDependencySurface(provisionedRuntimeConfig.renderer_ready_false_positive_dependency_surface_summary);
  assertRendererReadyFixtureVsRealSeparationContract(provisionedRuntimeConfig.renderer_ready_fixture_vs_real_separation_contract_summary);
  assertRendererReadyFreshEvidenceEnvelope(provisionedRuntimeConfig.renderer_ready_fresh_evidence_envelope_summary);
  assertRendererReadyStaleEvidenceDowngradeContract(provisionedRuntimeConfig.renderer_ready_stale_evidence_downgrade_contract_summary);
  assertRendererReadyEvidenceSourceAllowlist(provisionedRuntimeConfig.renderer_ready_evidence_source_allowlist_summary, {
    source_type: provisionedRuntimeConfig.renderer_ready_evidence_source_allowlist_summary.renderer_readiness_evidence_source_type,
  });
  assertRendererReadyEvidenceSchemaViolationGuard(provisionedRuntimeConfig.renderer_ready_evidence_schema_violation_guard_summary);
  assertRendererReadyEvidenceCompletenessBlockerMatrix(provisionedRuntimeConfig.renderer_ready_evidence_completeness_blocker_matrix_summary);
  assertRendererReadyEvidenceConflictDowngradeContract(provisionedRuntimeConfig.renderer_ready_evidence_conflict_downgrade_contract_summary);
  assertRendererReadyGoNoGoBlockerSurface(provisionedRuntimeConfig.renderer_ready_go_nogo_blocker_surface_summary);
  assertRendererReadyBlockerReasonAllowlist(provisionedRuntimeConfig.renderer_ready_blocker_reason_allowlist_summary);
  assertRendererReadySafeNextActionCatalog(provisionedRuntimeConfig.renderer_ready_safe_next_action_catalog_summary);
  assertRendererReadyCrossSurfaceBlockerConsistency(provisionedRuntimeConfig.renderer_ready_cross_surface_blocker_consistency_summary);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_checksum_preflight_manifest_summary.motion_dataset_row_file_checksum_preflight_manifest_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_checksum_preflight_manifest_summary.checksum_manifest_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_checksum_preflight_manifest_summary.actual_file_read, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_checksum_preflight_manifest_summary.actual_hash_calculated, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_checksum_preflight_manifest_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_checksum_preflight_manifest_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_checksum_preflight_manifest_summary.motion_dataset_executable, false);
  assert.equal(provisionedRuntimeConfig.motion_dataset_row_file_checksum_preflight_manifest_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedRuntimeConfig.motion_dataset_synthetic_row_fixture_pack_summary.motion_dataset_synthetic_row_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedRuntimeConfig.motion_dataset_synthetic_row_fixture_pack_summary.synthetic_only_boundary, true);
  assert.equal(provisionedRuntimeConfig.motion_dataset_synthetic_row_fixture_pack_summary.checked_row_count, 0);
  assert.equal(provisionedRuntimeConfig.motion_dataset_synthetic_row_fixture_pack_summary.motion_dataset_executable, false);
  assert.equal(JSON.stringify(provisionedRuntimeConfig).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(provisionedRuntimeConfig));
  assertNoModelPathLeak(JSON.stringify(provisionedRuntimeConfig));
  const provisionedStatus = await provisioned.getJson("/status");
  assert.equal(provisionedStatus.renderer_ready, false);
  assert.equal(provisionedStatus.renderer_health.loader_provisioning.provisioning_status, "candidate_present");
  assertOwnerActionLaneFreezeStatusSurface(provisionedStatus.owner_action_lane_freeze_status_summary);
  assertOwnerActionLaneFreezeStatusSurface(provisionedStatus.renderer_health.owner_action_lane_freeze_status_summary);
  assert.equal(provisionedStatus.trusted_loader_preflight_summary.trusted_loader_allowlist_status, "disabled");
  assert.equal(provisionedStatus.trusted_loader_preflight_summary.trusted_loader_candidate_status, "candidate_present_diagnostic_only");
  assert.equal(provisionedStatus.trusted_loader_preflight_summary.trusted_loader_readiness_claimed, false);
  assert.equal(provisionedStatus.trusted_loader_enablement_gate_summary.trusted_loader_enablement_gate_status, "blocked");
  assert.equal(provisionedStatus.trusted_loader_enablement_gate_summary.no_loader_trusted, true);
  assert.equal(provisionedStatus.trusted_loader_enablement_gate_summary.candidate_present_diagnostic_only, true);
  assert.equal(provisionedStatus.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_status, "blocked");
  assert.equal(provisionedStatus.trusted_loader_owner_handoff_summary.no_loader_trusted, true);
  assert.equal(provisionedStatus.trusted_loader_owner_handoff_summary.candidate_present_diagnostic_only, true);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.bundle_status, "blocked");
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.bundle_ready_candidate, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.renderer_ready, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.model_loaded, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.scene_loaded, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.browser_cue_delivery_ready, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.go_nogo_preflight_summary.go_candidate, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.no_loader_trusted, true);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.renderer_ready, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.model_loaded, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.scene_loaded, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.browser_cue_delivery_ready, false);
  assert.equal(provisionedStatus.real_evidence_intake_summary.evidence_intake_status, "blocked");
  assert.equal(provisionedStatus.real_evidence_intake_summary.intake_ready_candidate, false);
  assert.equal(provisionedStatus.real_evidence_intake_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.real_evidence_intake_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedStatus.real_evidence_intake_summary.renderer_ready, false);
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.owner_confirmation_envelope_status, "blocked");
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.confirmation_ready_candidate, false);
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.renderer_ready, false);
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.real_evidence_request_packet_status, "blocked");
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.request_packet_ready_candidate, false);
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.request_packet_completeness_is_readiness, false);
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.renderer_ready, false);
  assert.equal(provisionedStatus.real_resident_evidence_collection_plan_summary.real_resident_evidence_collection_plan_status, "planning_only");
  assert.equal(provisionedStatus.real_resident_evidence_collection_plan_summary.collection_started, false);
  assert.equal(provisionedStatus.real_resident_evidence_collection_plan_summary.real_probe_started, false);
  assert.equal(provisionedStatus.real_resident_evidence_collection_plan_summary.collection_plan_collects_real_evidence, false);
  assert.equal(provisionedStatus.real_resident_evidence_collection_plan_summary.collection_plan_creates_owner_confirmation, false);
  assert.equal(provisionedStatus.real_resident_evidence_collection_plan_summary.renderer_ready, false);
  assert.equal(provisionedStatus.real_evidence_collector_manifest_summary.real_evidence_collector_manifest_status, "planning_only");
  assert.equal(provisionedStatus.real_evidence_collector_manifest_summary.collector_execution_started, false);
  assert.equal(provisionedStatus.real_evidence_collector_manifest_summary.collector_real_probe_started, false);
  assert.equal(provisionedStatus.real_evidence_collector_manifest_summary.collector_manifest_collects_real_evidence, false);
  assert.equal(provisionedStatus.real_evidence_collector_manifest_summary.collector_manifest_creates_owner_confirmation, false);
  assert.equal(provisionedStatus.real_evidence_collector_manifest_summary.renderer_ready, false);
  assert.equal(provisionedStatus.real_evidence_collector_fixture_pack_summary.real_evidence_collector_fixture_pack_status, "planning_only");
  assert.equal(provisionedStatus.real_evidence_collector_fixture_pack_summary.fixture_pack_ready_candidate, false);
  assert.equal(provisionedStatus.real_evidence_collector_fixture_pack_summary.collector_fixture_pack_ready_candidate, false);
  assert.equal(provisionedStatus.real_evidence_collector_fixture_pack_summary.fixture_pack_collects_real_evidence, false);
  assert.equal(provisionedStatus.real_evidence_collector_fixture_pack_summary.fixture_pack_creates_owner_confirmation, false);
  assert.equal(provisionedStatus.real_evidence_collector_fixture_pack_summary.renderer_ready, false);
  assert.equal(provisionedStatus.real_evidence_collector_dry_run_envelope_summary.real_evidence_collector_dry_run_envelope_status, "planning_only");
  assert.equal(provisionedStatus.real_evidence_collector_dry_run_envelope_summary.collector_dry_run_envelope_ready_candidate, false);
  assert.equal(provisionedStatus.real_evidence_collector_dry_run_envelope_summary.dry_run_envelope_collects_real_evidence, false);
  assert.equal(provisionedStatus.real_evidence_collector_dry_run_envelope_summary.dry_run_envelope_creates_owner_confirmation, false);
  assert.equal(provisionedStatus.real_evidence_collector_dry_run_envelope_summary.accepted_dry_run_request_is_real_evidence, false);
  assert.equal(provisionedStatus.real_evidence_collector_dry_run_envelope_summary.accepted_dry_run_request_is_owner_confirmation, false);
  assert.equal(provisionedStatus.real_evidence_collector_dry_run_envelope_summary.renderer_ready, false);
  assert.equal(provisionedStatus.real_evidence_freshness_threshold_summary.real_evidence_freshness_threshold_status, "planning_only");
  assert.equal(provisionedStatus.real_evidence_freshness_threshold_summary.real_evidence_collection_started, false);
  assert.equal(provisionedStatus.real_evidence_freshness_threshold_summary.real_probe_started, false);
  assert.equal(provisionedStatus.real_evidence_freshness_threshold_summary.renderer_ready, false);
  assert.equal(provisionedStatus.safe_evidence_summary_contract_summary.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(provisionedStatus.safe_evidence_summary_contract_summary.real_evidence_collection_started, false);
  assert.equal(provisionedStatus.safe_evidence_summary_contract_summary.real_probe_started, false);
  assert.equal(provisionedStatus.safe_evidence_summary_contract_summary.renderer_ready, false);
  assert.equal(provisionedStatus.real_evidence_summary_intake_binding_summary.real_evidence_summary_intake_binding_status, "blocked");
  assert.equal(provisionedStatus.real_evidence_summary_intake_binding_summary.real_evidence_collection_started, false);
  assert.equal(provisionedStatus.real_evidence_summary_intake_binding_summary.real_probe_started, false);
  assert.equal(provisionedStatus.real_evidence_summary_intake_binding_summary.renderer_ready, false);
  assert.equal(provisionedStatus.owner_confirmation_binding_summary.owner_confirmation_binding_status, "blocked");
  assert.equal(provisionedStatus.owner_confirmation_binding_summary.owner_confirmation_created, false);
  assert.equal(provisionedStatus.owner_confirmation_binding_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.owner_confirmation_binding_summary.real_evidence_collection_started, false);
  assert.equal(provisionedStatus.owner_confirmation_binding_summary.real_probe_started, false);
  assert.equal(provisionedStatus.owner_confirmation_binding_summary.renderer_ready, false);
  assert.equal(provisionedStatus.go_nogo_blocker_resolution_summary.go_nogo_blocker_resolution_status, "blocked");
  assert.equal(provisionedStatus.go_nogo_blocker_resolution_summary.blocker_resolved, false);
  assert.equal(provisionedStatus.go_nogo_blocker_resolution_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.go_nogo_blocker_resolution_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.go_nogo_blocker_resolution_summary.renderer_ready, false);
  assert.equal(provisionedStatus.motion_dataset_row_schema_preflight_summary.row_schema_ready_candidate, false);
  assert.equal(provisionedStatus.motion_dataset_row_schema_preflight_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_request_packet_summary.motion_dataset_ready_candidate, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_request_packet_summary.real_row_data_present, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_request_packet_summary.owner_confirmation_required, true);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_request_packet_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_dry_run_validator_summary.dry_run_validation_candidate, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_dry_run_validator_summary.real_row_data_present, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_dry_run_validator_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_dry_run_validator_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_quarantine_envelope_summary.quarantine_candidate_status, "pending_metadata_only");
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_quarantine_envelope_summary.real_row_data_present, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_quarantine_envelope_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_quarantine_envelope_summary.quarantine_owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_owner_handoff_packet_summary.owner_confirmation_status, "pending");
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_owner_handoff_packet_summary.real_row_data_present, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_owner_handoff_packet_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_intake_owner_handoff_packet_summary.owner_handoff_is_owner_confirmation, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_audit_manifest_summary.motion_dataset_ready_candidate, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_audit_manifest_summary.real_row_data_present, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_audit_manifest_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_audit_manifest_summary.audit_manifest_is_actual_audit_completion, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.motion_dataset_real_row_redaction_scanner_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.real_row_data_present, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.checked_row_count, 0);
  assert.equal(provisionedStatus.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.motion_dataset_executable, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_evidence_link_manifest_summary.motion_dataset_real_row_evidence_link_manifest_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_real_row_evidence_link_manifest_summary.real_row_data_present, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_evidence_link_manifest_summary.checked_row_count, 0);
  assert.equal(provisionedStatus.motion_dataset_real_row_evidence_link_manifest_summary.motion_dataset_executable, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_evidence_link_manifest_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_evidence_link_manifest_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_go_nogo_blocker_map_summary.motion_dataset_real_row_go_nogo_blocker_map_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_real_row_go_nogo_blocker_map_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_real_row_go_nogo_blocker_map_summary.go_candidate, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_go_nogo_blocker_map_summary.blocker_resolved, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_go_nogo_blocker_map_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_go_nogo_blocker_map_summary.motion_dataset_executable, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_pre_ingestion_review_packet_summary.motion_dataset_real_row_pre_ingestion_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_real_row_pre_ingestion_review_packet_summary.pre_ingestion_review_only_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_real_row_pre_ingestion_review_packet_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_pre_ingestion_review_packet_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_pre_ingestion_review_packet_summary.checked_row_count, 0);
  assert.equal(provisionedStatus.motion_dataset_real_row_final_dry_run_checklist_summary.motion_dataset_real_row_final_dry_run_checklist_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_real_row_final_dry_run_checklist_summary.final_dry_run_only_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_real_row_final_dry_run_checklist_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_final_dry_run_checklist_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_final_dry_run_checklist_summary.checked_row_count, 0);
  assert.equal(provisionedStatus.motion_dataset_real_row_missing_data_fail_closed_gate_summary.motion_dataset_real_row_missing_data_fail_closed_gate_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_real_row_missing_data_fail_closed_gate_summary.missing_data_gate_only_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_real_row_missing_data_fail_closed_gate_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_missing_data_fail_closed_gate_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_real_row_missing_data_fail_closed_gate_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_packet_summary.motion_dataset_owner_row_data_submission_packet_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_packet_summary.owner_submission_packet_only_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_packet_summary.actual_row_content_accepted, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_packet_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_packet_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_packet_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_packet_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.motion_dataset_owner_row_data_submission_receipt_stub_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.receipt_stub_only_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.owner_submission_received, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.owner_submission_accepted, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.actual_row_content_accepted, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_receipt_stub_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.motion_dataset_owner_row_data_metadata_validator_stub_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.no_submission_accepted_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.no_actual_file_read_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.no_actual_hash_calculation_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.owner_submission_received, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.owner_submission_accepted, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.actual_file_read, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.actual_hash_calculated, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_metadata_validator_stub_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.motion_dataset_owner_row_data_submission_rejection_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.no_submission_accepted_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.no_actual_file_read_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.no_actual_row_content_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.owner_submission_received, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.owner_submission_accepted, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.actual_file_read, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_entry_gate_summary.motion_dataset_actual_data_task_entry_gate_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_entry_gate_summary.actual_data_task_started, false);
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_entry_gate_summary.actual_file_read, false);
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_entry_gate_summary.actual_hash_calculated, false);
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_entry_gate_summary.row_body_read, false);
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_entry_gate_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_entry_gate_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_contract_stub_summary.motion_dataset_row_body_parser_contract_stub_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_contract_stub_summary.row_body_parser_enabled, false);
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_contract_stub_summary.row_body_parser_executed, false);
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_contract_stub_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_contract_stub_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_rejection_fixture_pack_summary.motion_dataset_row_body_parser_rejection_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_rejection_fixture_pack_summary.parser_rejection_fixture_pack_only_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_rejection_fixture_pack_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_row_body_parser_rejection_fixture_pack_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_ingestion_audit_trail_stub_summary.motion_dataset_ingestion_audit_trail_stub_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_ingestion_audit_trail_stub_summary.no_real_ingestion_audit_event_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_ingestion_audit_trail_stub_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_ingestion_audit_trail_stub_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_ingestion_rollback_plan_stub_summary.motion_dataset_ingestion_rollback_plan_stub_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_ingestion_rollback_plan_stub_summary.no_rollback_ready_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_ingestion_rollback_plan_stub_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_ingestion_rollback_plan_stub_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_parser_dry_run_envelope_summary.motion_dataset_parser_dry_run_envelope_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_parser_dry_run_envelope_summary.no_parser_execution_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_parser_dry_run_envelope_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_parser_dry_run_envelope_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_real_row_acceptance_criteria_checklist_summary.motion_dataset_real_row_acceptance_criteria_checklist_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_real_row_acceptance_criteria_checklist_summary.no_acceptance_approval_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_real_row_acceptance_criteria_checklist_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_acceptance_criteria_checklist_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.motion_dataset_owner_actual_data_task_handoff_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.no_owner_confirmation_created_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_actual_data_no_go_summary_projection_summary.motion_dataset_actual_data_no_go_summary_projection_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_actual_data_no_go_summary_projection_summary.no_go_preserved_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_actual_data_no_go_summary_projection_summary.go_candidate, false);
  assert.equal(provisionedStatus.motion_dataset_actual_data_no_go_summary_projection_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_owner_submission_readiness_ledger_summary.motion_dataset_owner_submission_readiness_ledger_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_submission_readiness_ledger_summary.owner_submission_accepted, false);
  assert.equal(provisionedStatus.motion_dataset_owner_submission_readiness_ledger_summary.checked_row_count, 0);
  assert.equal(provisionedStatus.motion_dataset_final_actual_data_preauth_blocker_gate_summary.motion_dataset_final_actual_data_preauth_blocker_gate_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_final_actual_data_preauth_blocker_gate_summary.actual_data_preauthorized, false);
  assert.equal(provisionedStatus.motion_dataset_final_actual_data_preauth_blocker_gate_summary.checked_row_count, 0);
  assert.equal(provisionedStatus.motion_dataset_owner_confirmation_preflight_envelope_summary.motion_dataset_owner_confirmation_preflight_envelope_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_confirmation_preflight_envelope_summary.owner_confirmation_created, false);
  assert.equal(provisionedStatus.motion_dataset_owner_confirmation_preflight_envelope_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_row_file_quarantine_staging_envelope_summary.motion_dataset_row_file_quarantine_staging_envelope_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_row_file_quarantine_staging_envelope_summary.quarantine_completed, false);
  assert.equal(provisionedStatus.motion_dataset_row_file_quarantine_staging_envelope_summary.actual_file_read, false);
  assert.equal(provisionedStatus.motion_dataset_redaction_scan_execution_envelope_stub_summary.motion_dataset_redaction_scan_execution_envelope_stub_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_redaction_scan_execution_envelope_stub_summary.redaction_scan_executed, false);
  assert.equal(provisionedStatus.motion_dataset_parser_dry_run_execution_request_envelope_summary.motion_dataset_parser_dry_run_execution_request_envelope_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_parser_dry_run_execution_request_envelope_summary.actual_file_read, false);
  assert.equal(provisionedStatus.motion_dataset_parser_dry_run_execution_request_envelope_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_audit_execution_request_envelope_summary.motion_dataset_audit_execution_request_envelope_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_audit_execution_request_envelope_summary.real_ingestion_audit_event_created, false);
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_runbook_no_action_packet_summary.motion_dataset_actual_data_task_runbook_no_action_packet_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_actual_data_task_runbook_no_action_packet_summary.actual_data_task_started, false);
  assert.equal(provisionedStatus.motion_dataset_final_owner_actual_data_packet_summary.motion_dataset_final_owner_actual_data_packet_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_final_owner_actual_data_packet_summary.actual_data_preauthorized, false);
  assert.equal(provisionedStatus.motion_dataset_actual_data_freeze_state_ledger_summary.motion_dataset_actual_data_freeze_state_ledger_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_actual_data_freeze_state_ledger_summary.actual_data_task_started, false);
  assert.equal(provisionedStatus.motion_dataset_owner_wait_state_packet_summary.motion_dataset_owner_wait_state_packet_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_wait_state_packet_summary.actual_data_task_started, false);
  assert.equal(provisionedStatus.motion_dataset_readiness_non_sweetening_sweep_summary.motion_dataset_readiness_non_sweetening_sweep_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_readiness_non_sweetening_sweep_summary.renderer_ready, false);
  assert.equal(provisionedStatus.motion_dataset_planning_completion_review_packet_summary.motion_dataset_planning_completion_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_planning_completion_review_packet_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_owner_submission_form_spec_summary.motion_dataset_owner_submission_form_spec_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_owner_submission_form_spec_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_real_row_redaction_policy_matrix_summary.motion_dataset_real_row_redaction_policy_matrix_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_real_row_redaction_policy_matrix_summary.actual_row_content_accepted, false);
  assert.equal(provisionedStatus.motion_dataset_motion_allowlist_sync_review_summary.motion_dataset_motion_allowlist_sync_review_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_motion_allowlist_sync_review_summary.motion_allowlist_sync_claims_runtime_enabled, false);
  assert.equal(provisionedStatus.motion_dataset_renderer_ready_dependency_matrix_summary.motion_dataset_renderer_ready_dependency_matrix_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_renderer_ready_dependency_matrix_summary.browser_cue_delivery_ready, false);
  assertRendererReadyFalsePositiveDependencySurface(provisionedStatus.renderer_ready_false_positive_dependency_surface_summary);
  assertRendererReadyFixtureVsRealSeparationContract(provisionedStatus.renderer_ready_fixture_vs_real_separation_contract_summary);
  assertRendererReadyFreshEvidenceEnvelope(provisionedStatus.renderer_ready_fresh_evidence_envelope_summary);
  assertRendererReadyStaleEvidenceDowngradeContract(provisionedStatus.renderer_ready_stale_evidence_downgrade_contract_summary);
  assertRendererReadyEvidenceSourceAllowlist(provisionedStatus.renderer_ready_evidence_source_allowlist_summary, {
    source_type: provisionedStatus.renderer_ready_evidence_source_allowlist_summary.renderer_readiness_evidence_source_type,
  });
  assertRendererReadyEvidenceSchemaViolationGuard(provisionedStatus.renderer_ready_evidence_schema_violation_guard_summary);
  assertRendererReadyEvidenceCompletenessBlockerMatrix(provisionedStatus.renderer_ready_evidence_completeness_blocker_matrix_summary);
  assertRendererReadyEvidenceConflictDowngradeContract(provisionedStatus.renderer_ready_evidence_conflict_downgrade_contract_summary);
  assertRendererReadyGoNoGoBlockerSurface(provisionedStatus.renderer_ready_go_nogo_blocker_surface_summary);
  assertRendererReadyBlockerReasonAllowlist(provisionedStatus.renderer_ready_blocker_reason_allowlist_summary);
  assertRendererReadySafeNextActionCatalog(provisionedStatus.renderer_ready_safe_next_action_catalog_summary);
  assertRendererReadyCrossSurfaceBlockerConsistency(provisionedStatus.renderer_ready_cross_surface_blocker_consistency_summary);
  assert.equal(provisionedStatus.motion_dataset_row_file_checksum_preflight_manifest_summary.motion_dataset_row_file_checksum_preflight_manifest_status, "planning_only_blocked");
  assert.equal(provisionedStatus.motion_dataset_row_file_checksum_preflight_manifest_summary.no_actual_file_read_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_row_file_checksum_preflight_manifest_summary.no_actual_hash_calculation_boundary, true);
  assert.equal(provisionedStatus.motion_dataset_row_file_checksum_preflight_manifest_summary.actual_file_read, false);
  assert.equal(provisionedStatus.motion_dataset_row_file_checksum_preflight_manifest_summary.actual_hash_calculated, false);
  assert.equal(provisionedStatus.motion_dataset_row_file_checksum_preflight_manifest_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedStatus.motion_dataset_row_file_checksum_preflight_manifest_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.motion_dataset_row_file_checksum_preflight_manifest_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.motion_dataset_synthetic_row_fixture_pack_summary.motion_dataset_ready_candidate, false);
  assert.equal(provisionedStatus.motion_dataset_synthetic_row_fixture_pack_summary.real_row_data_present, false);
  assert.equal(provisionedStatus.motion_dataset_synthetic_row_fixture_pack_summary.synthetic_fixture_row_count, LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES.length);
  assert.equal(provisionedStatus.motion_dataset_synthetic_row_fixture_pack_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.renderer_health.model_loaded, false);
  assert.equal(provisionedStatus.renderer_health.scene_loaded, false);
  assert.equal(provisionedStatus.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(JSON.stringify(provisionedStatus).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(provisionedStatus));
  assertNoModelPathLeak(JSON.stringify(provisionedStatus));
  const provisionedHealth = await provisioned.getJson("/health");
  assert.equal(provisionedHealth.renderer_ready, false);
  assert.equal(provisionedHealth.loader_provisioning.provisioning_status, "candidate_present");
  assert.equal(provisionedHealth.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assertOwnerActionLaneFreezeStatusSurface(provisionedHealth.owner_action_lane_freeze_status_summary);
  assertOwnerActionLaneFreezeCrossSurfaceConsistency({
    runtimeConfig: provisionedRuntimeConfig.owner_action_lane_freeze_status_summary,
    status: provisionedStatus.owner_action_lane_freeze_status_summary,
    statusRendererHealth: provisionedStatus.renderer_health.owner_action_lane_freeze_status_summary,
    health: provisionedHealth.owner_action_lane_freeze_status_summary,
  });
  assert.equal(provisionedHealth.trusted_loader_preflight_summary.trusted_loader_allowlist_status, "disabled");
  assert.equal(provisionedHealth.trusted_loader_preflight_summary.trusted_loader_owner_confirmation_status, "owner_confirmation_required");
  assert.equal(provisionedHealth.trusted_loader_enablement_gate_summary.trusted_loader_enablement_blockers.includes("blocked_missing_owner_confirmation"), true);
  assert.equal(provisionedHealth.trusted_loader_enablement_gate_summary.trusted_loader_enablement_production_readiness_claimed, false);
  assert.equal(provisionedHealth.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_missing_owner_confirmation"), true);
  assert.equal(provisionedHealth.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_production_readiness_claimed, false);
  assert.equal(provisionedHealth.fresh_evidence_bundle_summary.bundle_status, "blocked");
  assert.equal(provisionedHealth.fresh_evidence_bundle_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedHealth.fresh_evidence_bundle_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedHealth.go_nogo_preflight_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.go_nogo_preflight_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedHealth.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.motion_dataset_real_row_redaction_scanner_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.checked_row_count, 0);
  assert.equal(provisionedHealth.motion_dataset_real_row_redaction_scanner_fixture_pack_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_evidence_link_manifest_summary.motion_dataset_real_row_evidence_link_manifest_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_evidence_link_manifest_summary.checked_row_count, 0);
  assert.equal(provisionedHealth.motion_dataset_real_row_evidence_link_manifest_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_go_nogo_blocker_map_summary.motion_dataset_real_row_go_nogo_blocker_map_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_go_nogo_blocker_map_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.motion_dataset_real_row_go_nogo_blocker_map_summary.go_candidate, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_go_nogo_blocker_map_summary.blocker_resolved, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_pre_ingestion_review_packet_summary.motion_dataset_real_row_pre_ingestion_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_pre_ingestion_review_packet_summary.no_real_row_ingestion_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_real_row_pre_ingestion_review_packet_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.motion_dataset_real_row_pre_ingestion_review_packet_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_pre_ingestion_review_packet_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_final_dry_run_checklist_summary.motion_dataset_real_row_final_dry_run_checklist_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_final_dry_run_checklist_summary.no_actual_ingestion_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_real_row_final_dry_run_checklist_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.motion_dataset_real_row_final_dry_run_checklist_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_final_dry_run_checklist_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_missing_data_fail_closed_gate_summary.motion_dataset_real_row_missing_data_fail_closed_gate_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_missing_data_fail_closed_gate_summary.no_actual_ingestion_allowed_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_real_row_missing_data_fail_closed_gate_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_missing_data_fail_closed_gate_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_missing_data_fail_closed_gate_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_packet_summary.motion_dataset_owner_row_data_submission_packet_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_packet_summary.no_owner_confirmation_created_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_packet_summary.no_real_row_ingestion_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_packet_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_packet_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_packet_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_receipt_stub_summary.motion_dataset_owner_row_data_submission_receipt_stub_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_receipt_stub_summary.no_owner_submission_accepted_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_receipt_stub_summary.no_real_row_ingestion_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_receipt_stub_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_receipt_stub_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_receipt_stub_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_metadata_validator_stub_summary.motion_dataset_owner_row_data_metadata_validator_stub_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_metadata_validator_stub_summary.metadata_only_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_metadata_validator_stub_summary.actual_file_read, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_metadata_validator_stub_summary.actual_hash_calculated, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_metadata_validator_stub_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_metadata_validator_stub_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_metadata_validator_stub_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.motion_dataset_owner_row_data_submission_rejection_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.synthetic_only, true);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.actual_file_read, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.actual_row_content_accepted, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_actual_data_task_entry_gate_summary.motion_dataset_actual_data_task_entry_gate_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_actual_data_task_entry_gate_summary.actual_data_task_started, false);
  assert.equal(provisionedHealth.motion_dataset_actual_data_task_entry_gate_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_actual_data_task_entry_gate_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_actual_data_task_entry_gate_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_contract_stub_summary.motion_dataset_row_body_parser_contract_stub_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_contract_stub_summary.row_body_parser_enabled, false);
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_contract_stub_summary.row_body_read, false);
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_contract_stub_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_contract_stub_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_rejection_fixture_pack_summary.motion_dataset_row_body_parser_rejection_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_rejection_fixture_pack_summary.row_body_read, false);
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_rejection_fixture_pack_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_row_body_parser_rejection_fixture_pack_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_ingestion_audit_trail_stub_summary.motion_dataset_ingestion_audit_trail_stub_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_ingestion_audit_trail_stub_summary.row_body_read, false);
  assert.equal(provisionedHealth.motion_dataset_ingestion_audit_trail_stub_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_ingestion_audit_trail_stub_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_ingestion_rollback_plan_stub_summary.motion_dataset_ingestion_rollback_plan_stub_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_ingestion_rollback_plan_stub_summary.rollback_ready, false);
  assert.equal(provisionedHealth.motion_dataset_ingestion_rollback_plan_stub_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_ingestion_rollback_plan_stub_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_parser_dry_run_envelope_summary.motion_dataset_parser_dry_run_envelope_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_parser_dry_run_envelope_summary.parser_dry_run_executed, false);
  assert.equal(provisionedHealth.motion_dataset_parser_dry_run_envelope_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_parser_dry_run_envelope_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_acceptance_criteria_checklist_summary.motion_dataset_real_row_acceptance_criteria_checklist_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_acceptance_criteria_checklist_summary.actual_data_accepted, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_acceptance_criteria_checklist_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_acceptance_criteria_checklist_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.motion_dataset_owner_actual_data_task_handoff_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.actual_data_task_started, false);
  assert.equal(provisionedHealth.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_actual_data_task_handoff_review_packet_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_actual_data_no_go_summary_projection_summary.motion_dataset_actual_data_no_go_summary_projection_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_actual_data_no_go_summary_projection_summary.no_go_preserved_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_actual_data_no_go_summary_projection_summary.go_candidate, false);
  assert.equal(provisionedHealth.motion_dataset_actual_data_no_go_summary_projection_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.motion_dataset_owner_submission_readiness_ledger_summary.motion_dataset_owner_submission_readiness_ledger_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_submission_readiness_ledger_summary.owner_submission_accepted, false);
  assert.equal(provisionedHealth.motion_dataset_owner_submission_readiness_ledger_summary.checked_row_count, 0);
  assert.equal(provisionedHealth.motion_dataset_final_actual_data_preauth_blocker_gate_summary.motion_dataset_final_actual_data_preauth_blocker_gate_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_final_actual_data_preauth_blocker_gate_summary.actual_data_preauthorized, false);
  assert.equal(provisionedHealth.motion_dataset_final_actual_data_preauth_blocker_gate_summary.checked_row_count, 0);
  assert.equal(provisionedHealth.motion_dataset_owner_confirmation_preflight_envelope_summary.motion_dataset_owner_confirmation_preflight_envelope_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_confirmation_preflight_envelope_summary.owner_confirmation_created, false);
  assert.equal(provisionedHealth.motion_dataset_owner_confirmation_preflight_envelope_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedHealth.motion_dataset_row_file_quarantine_staging_envelope_summary.motion_dataset_row_file_quarantine_staging_envelope_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_row_file_quarantine_staging_envelope_summary.quarantine_completed, false);
  assert.equal(provisionedHealth.motion_dataset_row_file_quarantine_staging_envelope_summary.actual_file_read, false);
  assert.equal(provisionedHealth.motion_dataset_redaction_scan_execution_envelope_stub_summary.motion_dataset_redaction_scan_execution_envelope_stub_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_redaction_scan_execution_envelope_stub_summary.redaction_scan_executed, false);
  assert.equal(provisionedHealth.motion_dataset_parser_dry_run_execution_request_envelope_summary.motion_dataset_parser_dry_run_execution_request_envelope_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_parser_dry_run_execution_request_envelope_summary.parser_dry_run_executed, false);
  assert.equal(provisionedHealth.motion_dataset_parser_dry_run_execution_request_envelope_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_audit_execution_request_envelope_summary.motion_dataset_audit_execution_request_envelope_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_audit_execution_request_envelope_summary.audit_execution_started, false);
  assert.equal(provisionedHealth.motion_dataset_actual_data_task_runbook_no_action_packet_summary.motion_dataset_actual_data_task_runbook_no_action_packet_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_actual_data_task_runbook_no_action_packet_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_final_owner_actual_data_packet_summary.motion_dataset_final_owner_actual_data_packet_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_final_owner_actual_data_packet_summary.actual_data_task_started, false);
  assert.equal(provisionedHealth.motion_dataset_actual_data_freeze_state_ledger_summary.motion_dataset_actual_data_freeze_state_ledger_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_actual_data_freeze_state_ledger_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_wait_state_packet_summary.motion_dataset_owner_wait_state_packet_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_wait_state_packet_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_readiness_non_sweetening_sweep_summary.motion_dataset_readiness_non_sweetening_sweep_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_readiness_non_sweetening_sweep_summary.browser_cue_delivery_ready, false);
  assert.equal(provisionedHealth.motion_dataset_planning_completion_review_packet_summary.motion_dataset_planning_completion_review_packet_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_planning_completion_review_packet_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_owner_submission_form_spec_summary.motion_dataset_owner_submission_form_spec_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_owner_submission_form_spec_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_redaction_policy_matrix_summary.motion_dataset_real_row_redaction_policy_matrix_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_redaction_policy_matrix_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_motion_allowlist_sync_review_summary.motion_dataset_motion_allowlist_sync_review_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_motion_allowlist_sync_review_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_renderer_ready_dependency_matrix_summary.motion_dataset_renderer_ready_dependency_matrix_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_renderer_ready_dependency_matrix_summary.runtime_readiness_claimed, false);
  assertRendererReadyFalsePositiveDependencySurface(provisionedHealth.renderer_ready_false_positive_dependency_surface_summary);
  assertRendererReadyFixtureVsRealSeparationContract(provisionedHealth.renderer_ready_fixture_vs_real_separation_contract_summary);
  assertRendererReadyFreshEvidenceEnvelope(provisionedHealth.renderer_ready_fresh_evidence_envelope_summary);
  assertRendererReadyStaleEvidenceDowngradeContract(provisionedHealth.renderer_ready_stale_evidence_downgrade_contract_summary);
  assertRendererReadyEvidenceSourceAllowlist(provisionedHealth.renderer_ready_evidence_source_allowlist_summary, {
    source_type: provisionedHealth.renderer_ready_evidence_source_allowlist_summary.renderer_readiness_evidence_source_type,
  });
  assertRendererReadyEvidenceSchemaViolationGuard(provisionedHealth.renderer_ready_evidence_schema_violation_guard_summary);
  assertRendererReadyEvidenceCompletenessBlockerMatrix(provisionedHealth.renderer_ready_evidence_completeness_blocker_matrix_summary);
  assertRendererReadyEvidenceConflictDowngradeContract(provisionedHealth.renderer_ready_evidence_conflict_downgrade_contract_summary);
  assertRendererReadyGoNoGoBlockerSurface(provisionedHealth.renderer_ready_go_nogo_blocker_surface_summary);
  assertRendererReadyBlockerReasonAllowlist(provisionedHealth.renderer_ready_blocker_reason_allowlist_summary);
  assertRendererReadySafeNextActionCatalog(provisionedHealth.renderer_ready_safe_next_action_catalog_summary);
  assertRendererReadyCrossSurfaceBlockerConsistency(provisionedHealth.renderer_ready_cross_surface_blocker_consistency_summary);
  assertRendererReadyFalsePositiveDependencySurfaceConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_false_positive_dependency_surface_summary,
    status: provisionedStatus.renderer_ready_false_positive_dependency_surface_summary,
    health: provisionedHealth.renderer_ready_false_positive_dependency_surface_summary,
  });
  assertRendererReadyFixtureVsRealSeparationContractConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_fixture_vs_real_separation_contract_summary,
    status: provisionedStatus.renderer_ready_fixture_vs_real_separation_contract_summary,
    health: provisionedHealth.renderer_ready_fixture_vs_real_separation_contract_summary,
  });
  assertRendererReadyFreshEvidenceEnvelopeConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_fresh_evidence_envelope_summary,
    status: provisionedStatus.renderer_ready_fresh_evidence_envelope_summary,
    health: provisionedHealth.renderer_ready_fresh_evidence_envelope_summary,
  });
  assertRendererReadyStaleEvidenceDowngradeContractConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_stale_evidence_downgrade_contract_summary,
    status: provisionedStatus.renderer_ready_stale_evidence_downgrade_contract_summary,
    health: provisionedHealth.renderer_ready_stale_evidence_downgrade_contract_summary,
  });
  assertRendererReadyEvidenceSourceAllowlistConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_evidence_source_allowlist_summary,
    status: provisionedStatus.renderer_ready_evidence_source_allowlist_summary,
    health: provisionedHealth.renderer_ready_evidence_source_allowlist_summary,
  });
  assertRendererReadyEvidenceSchemaViolationGuardConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_evidence_schema_violation_guard_summary,
    status: provisionedStatus.renderer_ready_evidence_schema_violation_guard_summary,
    health: provisionedHealth.renderer_ready_evidence_schema_violation_guard_summary,
  });
  assertRendererReadyEvidenceCompletenessBlockerMatrixConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_evidence_completeness_blocker_matrix_summary,
    status: provisionedStatus.renderer_ready_evidence_completeness_blocker_matrix_summary,
    health: provisionedHealth.renderer_ready_evidence_completeness_blocker_matrix_summary,
  });
  assertRendererReadyEvidenceConflictDowngradeContractConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_evidence_conflict_downgrade_contract_summary,
    status: provisionedStatus.renderer_ready_evidence_conflict_downgrade_contract_summary,
    health: provisionedHealth.renderer_ready_evidence_conflict_downgrade_contract_summary,
  });
  assertRendererReadyGoNoGoBlockerSurfaceConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_go_nogo_blocker_surface_summary,
    status: provisionedStatus.renderer_ready_go_nogo_blocker_surface_summary,
    health: provisionedHealth.renderer_ready_go_nogo_blocker_surface_summary,
  });
  assertRendererReadyBlockerReasonAllowlistConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_blocker_reason_allowlist_summary,
    status: provisionedStatus.renderer_ready_blocker_reason_allowlist_summary,
    health: provisionedHealth.renderer_ready_blocker_reason_allowlist_summary,
  });
  assertRendererReadySafeNextActionCatalogConsistency({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_safe_next_action_catalog_summary,
    status: provisionedStatus.renderer_ready_safe_next_action_catalog_summary,
    health: provisionedHealth.renderer_ready_safe_next_action_catalog_summary,
  });
  assertRendererReadyCrossSurfaceBlockerConsistencyAcrossSurfaces({
    runtimeConfig: provisionedRuntimeConfig.renderer_ready_cross_surface_blocker_consistency_summary,
    status: provisionedStatus.renderer_ready_cross_surface_blocker_consistency_summary,
    health: provisionedHealth.renderer_ready_cross_surface_blocker_consistency_summary,
  });
  assert.equal(provisionedHealth.motion_dataset_row_file_checksum_preflight_manifest_summary.motion_dataset_row_file_checksum_preflight_manifest_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_row_file_checksum_preflight_manifest_summary.checksum_manifest_only_boundary, true);
  assert.equal(provisionedHealth.motion_dataset_row_file_checksum_preflight_manifest_summary.actual_file_read, false);
  assert.equal(provisionedHealth.motion_dataset_row_file_checksum_preflight_manifest_summary.actual_hash_calculated, false);
  assert.equal(provisionedHealth.motion_dataset_row_file_checksum_preflight_manifest_summary.actual_ingestion_allowed, false);
  assert.equal(provisionedHealth.motion_dataset_row_file_checksum_preflight_manifest_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_row_file_checksum_preflight_manifest_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.go_nogo_preflight_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedHealth.real_evidence_intake_summary.evidence_intake_status, "blocked");
  assert.equal(provisionedHealth.real_evidence_intake_summary.intake_ready_candidate, false);
  assert.equal(provisionedHealth.real_evidence_intake_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.owner_confirmation_envelope_summary.owner_confirmation_envelope_status, "blocked");
  assert.equal(provisionedHealth.owner_confirmation_envelope_summary.confirmation_ready_candidate, false);
  assert.equal(provisionedHealth.owner_confirmation_envelope_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.real_evidence_request_packet_summary.real_evidence_request_packet_status, "blocked");
  assert.equal(provisionedHealth.real_evidence_request_packet_summary.request_packet_ready_candidate, false);
  assert.equal(provisionedHealth.real_evidence_request_packet_summary.request_packet_collects_real_evidence, false);
  assert.equal(provisionedHealth.real_evidence_request_packet_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.real_resident_evidence_collection_plan_summary.real_resident_evidence_collection_plan_status, "planning_only");
  assert.equal(provisionedHealth.real_resident_evidence_collection_plan_summary.collection_started, false);
  assert.equal(provisionedHealth.real_resident_evidence_collection_plan_summary.real_probe_started, false);
  assert.equal(provisionedHealth.real_resident_evidence_collection_plan_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.real_evidence_collector_manifest_summary.real_evidence_collector_manifest_status, "planning_only");
  assert.equal(provisionedHealth.real_evidence_collector_manifest_summary.collector_execution_started, false);
  assert.equal(provisionedHealth.real_evidence_collector_manifest_summary.real_probe_started, false);
  assert.equal(provisionedHealth.real_evidence_collector_manifest_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.real_evidence_collector_fixture_pack_summary.real_evidence_collector_fixture_pack_status, "planning_only");
  assert.equal(provisionedHealth.real_evidence_collector_fixture_pack_summary.collector_execution_started, false);
  assert.equal(provisionedHealth.real_evidence_collector_fixture_pack_summary.real_probe_started, false);
  assert.equal(provisionedHealth.real_evidence_collector_fixture_pack_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.real_evidence_collector_dry_run_envelope_summary.real_evidence_collector_dry_run_envelope_status, "planning_only");
  assert.equal(provisionedHealth.real_evidence_collector_dry_run_envelope_summary.collector_execution_started, false);
  assert.equal(provisionedHealth.real_evidence_collector_dry_run_envelope_summary.real_probe_started, false);
  assert.equal(provisionedHealth.real_evidence_collector_dry_run_envelope_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.real_evidence_freshness_threshold_summary.real_evidence_freshness_threshold_status, "planning_only");
  assert.equal(provisionedHealth.real_evidence_freshness_threshold_summary.real_evidence_collection_started, false);
  assert.equal(provisionedHealth.real_evidence_freshness_threshold_summary.real_probe_started, false);
  assert.equal(provisionedHealth.real_evidence_freshness_threshold_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.safe_evidence_summary_contract_summary.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(provisionedHealth.safe_evidence_summary_contract_summary.real_evidence_collection_started, false);
  assert.equal(provisionedHealth.safe_evidence_summary_contract_summary.real_probe_started, false);
  assert.equal(provisionedHealth.safe_evidence_summary_contract_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.real_evidence_summary_intake_binding_summary.real_evidence_summary_intake_binding_status, "blocked");
  assert.equal(provisionedHealth.real_evidence_summary_intake_binding_summary.real_evidence_collection_started, false);
  assert.equal(provisionedHealth.real_evidence_summary_intake_binding_summary.real_probe_started, false);
  assert.equal(provisionedHealth.real_evidence_summary_intake_binding_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.owner_confirmation_binding_summary.owner_confirmation_binding_status, "blocked");
  assert.equal(provisionedHealth.owner_confirmation_binding_summary.owner_confirmation_created, false);
  assert.equal(provisionedHealth.owner_confirmation_binding_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedHealth.owner_confirmation_binding_summary.real_evidence_collection_started, false);
  assert.equal(provisionedHealth.owner_confirmation_binding_summary.real_probe_started, false);
  assert.equal(provisionedHealth.owner_confirmation_binding_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.go_nogo_blocker_resolution_summary.go_nogo_blocker_resolution_status, "blocked");
  assert.equal(provisionedHealth.go_nogo_blocker_resolution_summary.blocker_resolved, false);
  assert.equal(provisionedHealth.go_nogo_blocker_resolution_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.go_nogo_blocker_resolution_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedHealth.go_nogo_blocker_resolution_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.motion_dataset_row_schema_preflight_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedHealth.motion_dataset_row_schema_preflight_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_request_packet_summary.request_packet_is_real_row_ingestion, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_request_packet_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_request_packet_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_request_packet_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_dry_run_validator_summary.real_row_body_read, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_dry_run_validator_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_dry_run_validator_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_dry_run_validator_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_quarantine_envelope_summary.row_body_read, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_quarantine_envelope_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_quarantine_envelope_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_quarantine_envelope_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_owner_handoff_packet_summary.owner_handoff_ingests_rows, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_owner_handoff_packet_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_owner_handoff_packet_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_intake_owner_handoff_packet_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.motion_dataset_real_row_audit_manifest_summary.motion_dataset_real_row_audit_manifest_status, "planning_only_blocked");
  assert.equal(provisionedHealth.motion_dataset_real_row_audit_manifest_summary.checked_row_count, 0);
  assert.equal(provisionedHealth.motion_dataset_real_row_audit_manifest_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_audit_manifest_summary.renderer_ready, false);
  assert.equal(provisionedHealth.motion_dataset_real_row_audit_manifest_summary.audit_manifest_is_actual_audit_completion, false);
  assert.equal(provisionedHealth.motion_dataset_synthetic_row_fixture_pack_summary.synthetic_fixture_validator_status, "pass_synthetic_only");
  assert.equal(provisionedHealth.motion_dataset_synthetic_row_fixture_pack_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_synthetic_row_fixture_pack_summary.production_readiness_claimed, false);
  assert.equal(provisionedHealth.motion_dataset_synthetic_row_fixture_pack_summary.go_nogo_status, "no_go");
  assert.equal(JSON.stringify(provisionedHealth).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(provisionedHealth));
  assertNoModelPathLeak(JSON.stringify(provisionedHealth));
  const provisionedHeartbeat = await provisioned.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(provisionedHeartbeat.renderer_ready, false);
  assert.equal(provisionedHeartbeat.renderer_health.model_loaded, false);
  assert.equal(provisionedHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(provisionedHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(provisionedHeartbeat.renderer_health.loader_provisioning.provisioning_status, "candidate_present");
  assert.equal(provisionedHeartbeat.trusted_loader_preflight_summary.trusted_loader_allowlist_status, "disabled");
  assert.equal(provisionedHeartbeat.trusted_loader_preflight_summary.trusted_loader_real_evidence_prerequisite, "fresh_real_evidence_attention_required");
  assert.equal(provisionedHeartbeat.trusted_loader_preflight_summary.trusted_loader_readiness_claimed, false);
  assert.equal(provisionedHeartbeat.trusted_loader_enablement_gate_summary.trusted_loader_enablement_gate_status, "blocked");
  assert.equal(provisionedHeartbeat.trusted_loader_enablement_gate_summary.trusted_loader_enablement_blockers.includes("blocked_priority1_unresolved"), true);
  assert.equal(provisionedHeartbeat.trusted_loader_enablement_gate_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_status, "blocked");
  assert.equal(provisionedHeartbeat.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_priority1_unresolved"), true);
  assert.equal(provisionedHeartbeat.trusted_loader_owner_handoff_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.fresh_evidence_bundle_summary.bundle_status, "blocked");
  assert.equal(provisionedHeartbeat.fresh_evidence_bundle_summary.bundle_blocked_reasons.includes("bundle_blocked_priority1_unresolved"), true);
  assert.equal(provisionedHeartbeat.fresh_evidence_bundle_summary.bundle_blocked_reasons.includes("bundle_blocked_motion_dataset_non_executable"), true);
  assert.equal(provisionedHeartbeat.fresh_evidence_bundle_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.go_nogo_preflight_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHeartbeat.go_nogo_preflight_summary.no_go_reasons.includes("no_go_priority1_unresolved"), true);
  assert.equal(provisionedHeartbeat.go_nogo_preflight_summary.no_go_reasons.includes("no_go_motion_dataset_non_executable"), true);
  assert.equal(provisionedHeartbeat.go_nogo_preflight_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_intake_summary.evidence_intake_status, "blocked");
  assert.equal(provisionedHeartbeat.real_evidence_intake_summary.intake_ready_candidate, false);
  assert.equal(provisionedHeartbeat.real_evidence_intake_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_envelope_summary.owner_confirmation_envelope_status, "blocked");
  assert.equal(provisionedHeartbeat.owner_confirmation_envelope_summary.confirmation_ready_candidate, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_envelope_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_request_packet_summary.real_evidence_request_packet_status, "blocked");
  assert.equal(provisionedHeartbeat.real_evidence_request_packet_summary.request_packet_ready_candidate, false);
  assert.equal(provisionedHeartbeat.real_evidence_request_packet_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_resident_evidence_collection_plan_summary.real_resident_evidence_collection_plan_status, "planning_only");
  assert.equal(provisionedHeartbeat.real_resident_evidence_collection_plan_summary.collection_started, false);
  assert.equal(provisionedHeartbeat.real_resident_evidence_collection_plan_summary.real_probe_started, false);
  assert.equal(provisionedHeartbeat.real_resident_evidence_collection_plan_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_manifest_summary.real_evidence_collector_manifest_status, "planning_only");
  assert.equal(provisionedHeartbeat.real_evidence_collector_manifest_summary.collector_execution_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_manifest_summary.real_probe_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_manifest_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_fixture_pack_summary.real_evidence_collector_fixture_pack_status, "planning_only");
  assert.equal(provisionedHeartbeat.real_evidence_collector_fixture_pack_summary.collector_execution_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_fixture_pack_summary.real_probe_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_fixture_pack_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_dry_run_envelope_summary.real_evidence_collector_dry_run_envelope_status, "planning_only");
  assert.equal(provisionedHeartbeat.real_evidence_collector_dry_run_envelope_summary.collector_execution_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_dry_run_envelope_summary.real_probe_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_collector_dry_run_envelope_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_freshness_threshold_summary.real_evidence_freshness_threshold_status, "planning_only");
  assert.equal(provisionedHeartbeat.real_evidence_freshness_threshold_summary.real_evidence_collection_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_freshness_threshold_summary.real_probe_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_freshness_threshold_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_request_packet_summary.motion_dataset_real_row_intake_request_packet_status, "planning_only_blocked");
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_request_packet_summary.checked_row_count, 0);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_request_packet_summary.motion_dataset_executable, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_request_packet_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_dry_run_validator_summary.motion_dataset_real_row_intake_dry_run_validator_status, "planning_only_blocked");
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_dry_run_validator_summary.checked_row_count, 0);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_dry_run_validator_summary.motion_dataset_executable, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_dry_run_validator_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_quarantine_envelope_summary.motion_dataset_real_row_intake_quarantine_envelope_status, "planning_only_blocked");
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_quarantine_envelope_summary.checked_row_count, 0);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_quarantine_envelope_summary.motion_dataset_executable, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_quarantine_envelope_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_owner_handoff_packet_summary.motion_dataset_real_row_intake_owner_handoff_packet_status, "planning_only_blocked");
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_owner_handoff_packet_summary.checked_row_count, 0);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_owner_handoff_packet_summary.motion_dataset_executable, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_intake_owner_handoff_packet_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_audit_manifest_summary.motion_dataset_real_row_audit_manifest_status, "planning_only_blocked");
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_audit_manifest_summary.checked_row_count, 0);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_audit_manifest_summary.motion_dataset_executable, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_audit_manifest_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.motion_dataset_real_row_audit_manifest_summary.audit_manifest_is_actual_audit_completion, false);
  assert.equal(provisionedHeartbeat.motion_dataset_synthetic_row_fixture_pack_summary.motion_dataset_synthetic_row_fixture_pack_status, "planning_only_blocked");
  assert.equal(provisionedHeartbeat.motion_dataset_synthetic_row_fixture_pack_summary.checked_row_count, 0);
  assert.equal(provisionedHeartbeat.motion_dataset_synthetic_row_fixture_pack_summary.motion_dataset_executable, false);
  assert.equal(provisionedHeartbeat.motion_dataset_synthetic_row_fixture_pack_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.safe_evidence_summary_contract_summary.safe_evidence_summary_contract_status, "planning_only");
  assert.equal(provisionedHeartbeat.safe_evidence_summary_contract_summary.real_evidence_collection_started, false);
  assert.equal(provisionedHeartbeat.safe_evidence_summary_contract_summary.real_probe_started, false);
  assert.equal(provisionedHeartbeat.safe_evidence_summary_contract_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_summary_intake_binding_summary.real_evidence_summary_intake_binding_status, "blocked");
  assert.equal(provisionedHeartbeat.real_evidence_summary_intake_binding_summary.real_evidence_collection_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_summary_intake_binding_summary.real_probe_started, false);
  assert.equal(provisionedHeartbeat.real_evidence_summary_intake_binding_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_binding_summary.owner_confirmation_binding_status, "blocked");
  assert.equal(provisionedHeartbeat.owner_confirmation_binding_summary.owner_confirmation_created, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_binding_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_binding_summary.real_evidence_collection_started, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_binding_summary.real_probe_started, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_binding_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.go_nogo_blocker_resolution_summary.go_nogo_blocker_resolution_status, "blocked");
  assert.equal(provisionedHeartbeat.go_nogo_blocker_resolution_summary.blocker_resolved, false);
  assert.equal(provisionedHeartbeat.go_nogo_blocker_resolution_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHeartbeat.go_nogo_blocker_resolution_summary.owner_confirmation_confirmed, false);
  assert.equal(provisionedHeartbeat.go_nogo_blocker_resolution_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.motion_dataset_row_schema_preflight_summary.row_schema_preflight_status, "planning_only_blocked");
  assert.equal(provisionedHeartbeat.motion_dataset_row_schema_preflight_summary.production_readiness_claimed, false);
  assertSafe(JSON.stringify(provisionedHeartbeat));
  assertNoModelPathLeak(JSON.stringify(provisionedHeartbeat));
  await provisioned.close();

  const safeModel3 = await ready.getJson("/renderer/model3");
  assert.equal(safeModel3.ok, true);
  assert.equal(safeModel3.load_route, "renderer_model3_manifest");
  assert.equal(safeModel3.asset_route, "renderer_model_asset");
  assert.equal(safeModel3.manifest.FileReferences.Moc.startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Textures[0].startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Expressions[0].File.startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Motions.Idle[0].File.startsWith("renderer_model_asset:"), true);
  assertSafe(JSON.stringify(safeModel3));
  assertNoModelPathLeak(JSON.stringify(safeModel3));
  const mocAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Moc);
  const mocAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${mocAssetId}`);
  assert.equal(mocAssetResponse.status, 200);
  assert.equal(mocAssetResponse.headers.get("content-type"), "application/octet-stream");
  assert.equal(await mocAssetResponse.text(), "fixture-moc");
  const textureAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Textures[0]);
  const textureAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${textureAssetId}`);
  assert.equal(textureAssetResponse.status, 200);
  assert.equal(textureAssetResponse.headers.get("content-type"), "image/png");
  const motionAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Motions.Idle[0].File);
  const motionAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${motionAssetId}`);
  assert.equal(motionAssetResponse.status, 200);
  assert.equal((motionAssetResponse.headers.get("content-type") || "").includes("application/json"), true);
  const unknownAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/asset_0000000000000000_moc3`);
  assert.equal(unknownAsset.status, 404);
  assertSafe(JSON.stringify(unknownAsset.body));
  const traversalAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/..%2Fsecret`);
  assert.equal(traversalAsset.status, 404);
  assertSafe(JSON.stringify(traversalAsset.body));
  const urlAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/http%3A%2F%2Fexample.invalid%2Fasset.moc3`);
  assert.equal(urlAsset.status, 404);
  assertSafe(JSON.stringify(urlAsset.body));
  const queryAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/${mocAssetId}?raw_path=unsafe`);
  assert.equal(queryAsset.status, 404);
  assertSafe(JSON.stringify(queryAsset.body));
  const sdkScript = await ready.getText("/renderer/cubism-core.js");
  assert.equal(sdkScript.includes("Live2DCubismCore"), true);

  const readyStatusBeforeCue = await ready.getJson("/status");
  assert.equal(readyStatusBeforeCue.renderer_health.cubism_sdk_available, true);
  assert.equal(readyStatusBeforeCue.renderer_health.model3_manifest_available, true);
  assert.equal(readyStatusBeforeCue.renderer_ready, false);
  assertSafe(JSON.stringify(readyStatusBeforeCue));
  assertNoModelPathLeak(JSON.stringify(readyStatusBeforeCue));

  const acceptedReadyCue = await ready.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      timing: { duration_ms: 700 },
    },
  });
  assert.equal(acceptedReadyCue.accepted, true);
  assert.equal(acceptedReadyCue.renderer_ready, false);
  assertSafe(JSON.stringify(acceptedReadyCue));

  const fixtureOnlyHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(fixtureOnlyHeartbeat.renderer_ready, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.real_model_load_supported, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.model_loaded_claimed, true);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.last_cue_applied_at, null);
  assertSafe(JSON.stringify(fixtureOnlyHeartbeat));

  const fixtureOnlyBrowserCues = await ready.getJson("/renderer/cues");
  assert.equal(fixtureOnlyBrowserCues.delivery_ready, false);
  assert.equal(fixtureOnlyBrowserCues.cues.length, 0);
  assert.equal(fixtureOnlyBrowserCues.pending_cue_count, 1);
  assertSafe(JSON.stringify(fixtureOnlyBrowserCues));

  const manifestOnlyHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "asset_route_available",
    model_load_supported: false,
    model_load_attempted: false,
    model_load_succeeded: false,
    model_load_error_kind: "unknown",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(manifestOnlyHeartbeat.renderer_ready, false);
  assert.equal(manifestOnlyHeartbeat.renderer_health.model_load_status, "asset_route_available");
  assert.equal(manifestOnlyHeartbeat.renderer_health.model_loaded, false);
  assert.equal(manifestOnlyHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(manifestOnlyHeartbeat));

  const modelLoadedWithoutRealFlag = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loaded",
    model_load_supported: true,
    model_load_attempted: true,
    model_load_succeeded: true,
    model_load_error_kind: "unknown",
    real_model_load_supported: true,
    real_model_loaded: false,
    real_scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelLoadedWithoutRealFlag.renderer_ready, false);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.model_loaded_claimed, true);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.real_model_loaded_claimed, false);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(modelLoadedWithoutRealFlag));

  const sceneLoadedWithoutRealFlag = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sceneLoadedWithoutRealFlag.renderer_ready, false);
  assert.equal(sceneLoadedWithoutRealFlag.renderer_health.model_loaded, false);
  assert.equal(sceneLoadedWithoutRealFlag.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(sceneLoadedWithoutRealFlag));

  const staleRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs - 10_000,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs - 10_000,
  }));
  assert.equal(staleRealModelHeartbeat.renderer_ready, false);
  assert.equal(staleRealModelHeartbeat.renderer_health.fresh_heartbeat, false);
  assert.equal(staleRealModelHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(staleRealModelHeartbeat));

  const modelMismatchRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    model_id: "other_model",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelMismatchRealModelHeartbeat.renderer_ready, false);
  assert.equal(modelMismatchRealModelHeartbeat.renderer_health.model_matches, false);
  assert.equal(modelMismatchRealModelHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(modelMismatchRealModelHeartbeat));

  const sceneMismatchRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    scene_id: "other_scene",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_ready, false);
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_health.scene_matches, false);
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(sceneMismatchRealModelHeartbeat));

  const lastCueNotAppliedRealModel = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_apply_status: "not_ready",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(lastCueNotAppliedRealModel.renderer_ready, false);
  assert.equal(lastCueNotAppliedRealModel.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(lastCueNotAppliedRealModel.renderer_health.last_cue_applied, false);
  assertSafe(JSON.stringify(lastCueNotAppliedRealModel));

  const deliveryEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(deliveryEvidenceHeartbeat.renderer_ready, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.model_loaded, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(deliveryEvidenceHeartbeat));
  const realEvidenceBrowserCues = await ready.getJson("/renderer/cues");
  assert.equal(realEvidenceBrowserCues.delivery_ready, false);
  assert.equal(realEvidenceBrowserCues.cues.length, 0);
  assert.equal(realEvidenceBrowserCues.pending_cue_count, 1);
  assertSafe(JSON.stringify(realEvidenceBrowserCues));

  const fullRealEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(fullRealEvidenceHeartbeat.renderer_ready, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.last_cue_applied, false);
  assertSafe(JSON.stringify(fullRealEvidenceHeartbeat));

  const readyHealth = await ready.getJson("/health");
  assert.equal(readyHealth.renderer_ready, false);
  assert.equal(readyHealth.live2d_evidence_summary.safe_summary_only, true);
  assert.equal(readyHealth.live2d_evidence_summary.live2d_priority1_status, "BLOCKED");
  assert.equal(readyHealth.live2d_evidence_summary.live2d_runtime_readiness_claimed, false);
  assertSafe(JSON.stringify(readyHealth));
  assertNoModelPathLeak(JSON.stringify(readyHealth));

  const missingEvidenceHarness = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const missingEvidenceStatus = await missingEvidenceHarness.getJson("/status");
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.live2d_evidence_status, "blocked");
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.blocked_or_attention_reason, "missing_evidence");
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.renderer_ready, false);
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.model_loaded, false);
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.scene_loaded, false);
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(missingEvidenceStatus.live2d_evidence_summary));
  await missingEvidenceHarness.close();

  const fixtureEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    evidence_source_type: "fixture",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(fixtureEvidenceHeartbeat.live2d_evidence_summary.collector_source_type, "fixture");
  assert.equal(fixtureEvidenceHeartbeat.live2d_evidence_summary.fixture_evidence_status, "fixture_only");
  assert.equal(fixtureEvidenceHeartbeat.live2d_evidence_summary.blocked_or_attention_reason, "fixture_only");
  assert.equal(fixtureEvidenceHeartbeat.renderer_ready, false);
  assert.equal(fixtureEvidenceHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fixtureEvidenceHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(fixtureEvidenceHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(fixtureEvidenceHeartbeat));
  assertNoModelPathLeak(JSON.stringify(fixtureEvidenceHeartbeat));

  const dryRunEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    evidence_source_type: "dry_run",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(dryRunEvidenceHeartbeat.live2d_evidence_summary.collector_source_type, "dry_run");
  assert.equal(dryRunEvidenceHeartbeat.live2d_evidence_summary.dry_run_evidence_status, "dry_run_only");
  assert.equal(dryRunEvidenceHeartbeat.live2d_evidence_summary.blocked_or_attention_reason, "dry_run_only");
  assert.equal(dryRunEvidenceHeartbeat.live2d_evidence_summary.live2d_runtime_readiness_claimed, false);
  assert.equal(dryRunEvidenceHeartbeat.renderer_ready, false);
  assertSafe(JSON.stringify(dryRunEvidenceHeartbeat));

  const missingTimestampEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    evidence_source_type: "real_probe",
    heartbeat_timestamp_ms: undefined,
  }));
  assert.equal(missingTimestampEvidenceHeartbeat.live2d_evidence_summary.evidence_timestamp_status, "missing");
  assert.equal(missingTimestampEvidenceHeartbeat.live2d_evidence_summary.blocked_or_attention_reason, "missing_timestamp");
  assert.equal(missingTimestampEvidenceHeartbeat.renderer_ready, false);
  assertSafe(JSON.stringify(missingTimestampEvidenceHeartbeat));

  const staleEvidenceSummary = staleRealModelHeartbeat.live2d_evidence_summary;
  assert.equal(staleEvidenceSummary.evidence_freshness_status, "stale");
  assert.equal(staleEvidenceSummary.blocked_or_attention_reason, "stale_evidence");
  assert.equal(staleEvidenceSummary.live2d_runtime_readiness_claimed, false);
  assertSafe(JSON.stringify(staleEvidenceSummary));

  const incompleteRealProbeHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    evidence_source_type: "real_probe",
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.collector_source_type, "real_probe");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.blocked_or_attention_reason, "real_probe_incomplete");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.model_configured_status, "configured");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.cue_capability_status, "claimed");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.recovery_capability_status, "claimed");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.last_cue_applied_status, "not_confirmed");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.motion_dataset_executable, false);
  assert.equal(incompleteRealProbeHeartbeat.renderer_ready, false);
  assert.equal(incompleteRealProbeHeartbeat.renderer_health.model_loaded, false);
  assert.equal(incompleteRealProbeHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(incompleteRealProbeHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(incompleteRealProbeHeartbeat));
  assertNoModelPathLeak(JSON.stringify(incompleteRealProbeHeartbeat));

  const evidenceRuntimeConfig = await ready.getJson("/renderer/runtime-config");
  assert.equal(evidenceRuntimeConfig.live2d_evidence_summary.safe_summary_only, true);
  assert.equal(evidenceRuntimeConfig.live2d_evidence_summary.live2d_fixture_evidence_ignored_for_readiness, true);
  assert.equal(evidenceRuntimeConfig.live2d_evidence_summary.live2d_priority1_status, "BLOCKED");
  assertSafe(JSON.stringify(evidenceRuntimeConfig.live2d_evidence_summary));

  const noAppliedAtState = createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  });
  const noAppliedAt = await startHarness(noAppliedAtState);
  const noAppliedAtCue = await noAppliedAt.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
    },
  });
  const noAppliedAtHeartbeat = await noAppliedAt.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: noAppliedAtCue.cue_summary.status_hash,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(noAppliedAtHeartbeat.renderer_ready, false);
  assert.equal(noAppliedAtHeartbeat.renderer_health.last_cue_applied_at, null);
  assertSafe(JSON.stringify(noAppliedAtHeartbeat));
  await noAppliedAt.close();

  nowMs += 10_000;
  const staleReadyHealth = await ready.getJson("/health");
  assert.equal(staleReadyHealth.renderer_ready, false);
  assertSafe(JSON.stringify(staleReadyHealth));
  await ready.close();

  const unsafeUrlManifestPath = join(tmpDir, "unsafe-url.model3.json");
  await writeFile(unsafeUrlManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "https://example.invalid/model.moc3" },
  }));
  await assertManifestUnavailable(unsafeUrlManifestPath);

  const unsafeAbsoluteManifestPath = join(tmpDir, "unsafe-absolute.model3.json");
  await writeFile(unsafeAbsoluteManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "/unsafe/model.moc3" },
  }));
  await assertManifestUnavailable(unsafeAbsoluteManifestPath);

  const unsafeTraversalManifestPath = join(tmpDir, "unsafe-traversal.model3.json");
  await writeFile(unsafeTraversalManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "../outside.moc3" },
  }));
  await assertManifestUnavailable(unsafeTraversalManifestPath);

  const unsafeExtensionManifestPath = join(tmpDir, "unsafe-extension.model3.json");
  await writeFile(unsafeExtensionManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "asset.txt" },
  }));
  await assertManifestUnavailable(unsafeExtensionManifestPath);

  const deliveryReady = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const deliveryReadyHeartbeat = await deliveryReady.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(deliveryReadyHeartbeat.renderer_ready, false);
  assert.equal(deliveryReadyHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(deliveryReadyHeartbeat));
  const sseCue = await deliveryReady.postJson("/cue", rendererCueDelivery({
    motion: { style: "talk" },
    timing: { duration_ms: 700 },
  }));
  assert.equal(sseCue.accepted, true);
  const waitingSseOnly = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(waitingSseOnly.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(waitingSseOnly.events));
  const waitingPolling = await deliveryReady.getJson("/renderer/cues");
  assert.equal(waitingPolling.delivery_ready, false);
  assert.equal(waitingPolling.cues.length, 0);
  assert.equal(waitingPolling.pending_cue_count, 1);
  assertSafe(JSON.stringify(waitingPolling));

  const pollingCue = await deliveryReady.postJson("/cue", rendererCueDelivery({
    motion: { style: "idle_breath" },
    timing: { duration_ms: 500 },
  }));
  const pollingFallback = await deliveryReady.getJson("/renderer/cues");
  assert.equal(pollingCue.accepted, true);
  assert.equal(pollingFallback.delivery_ready, false);
  assert.equal(pollingFallback.cues.length, 0);
  assert.equal(pollingFallback.pending_cue_count, 2);
  assertSafe(JSON.stringify(pollingFallback));
  const noDeliveryWhileUntrusted = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(noDeliveryWhileUntrusted.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(noDeliveryWhileUntrusted.events));

  await assertCueRejected(deliveryReady, cueWithUnsafeField("raw_renderer_payload"), "unsafe_cue_field", "raw_renderer_payload");
  const rejectedSse = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(rejectedSse.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(rejectedSse.events));
  const deliveryReadyStatus = await deliveryReady.getJson("/status");
  assert.equal(deliveryReadyStatus.renderer_ready, false);
  await deliveryReady.close();

  const authRequired = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }), { rendererApiKey: "fixture-renderer-key" });
  const unauthorized = await fetch(`${authRequired.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schema: "iris_live2d_renderer_cue_delivery_v1", cue: { schema: "iris_live2d_renderer_cue_v1" } }),
  });
  const unauthorizedBody = await unauthorized.json();
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorizedBody.error_kind, "auth_required");
  assertSafe(JSON.stringify(unauthorizedBody));
  const authorized = await fetch(`${authRequired.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": "fixture-renderer-key" },
    body: JSON.stringify({ schema: "iris_live2d_renderer_cue_delivery_v1", cue: { schema: "iris_live2d_renderer_cue_v1" } }),
  });
  const authorizedBody = await authorized.json();
  assert.equal(authorized.status, 200);
  assert.equal(authorizedBody.accepted, true);
  assertSafe(JSON.stringify(authorizedBody));
  await authRequired.close();

  console.log(JSON.stringify({
    ok: true,
    checked: [
      "health",
      "status",
      "model_missing",
      "sdk_missing",
      "heartbeat_stale",
      "model_scene_mismatch",
      "cue_accepted",
      "browser_cue_route",
      "browser_cue_retention",
      "redaction",
      "optional_write_auth",
      "mock_health_false",
      "runtime_config_safe",
      "unavailable_model3_route_not_advertised",
      "sdk_script_route",
      "sdk_missing_blocks_ready",
      "model3_available",
      "fixture_manifest_blocks_ready",
      "last_cue_applied_at_guard",
      "cue_allowlist_validation",
      "unsafe_cue_safe_reject",
      "strong_motion_recovery_required",
      "iris_bridge_cue_compatibility",
      "sse_cue_delivery_safe_summary",
      "sse_polling_no_duplicate_delivery",
      "safe_model3_manifest_route",
      "safe_model_asset_route",
      "unsafe_manifest_blocks_browser_load",
      "model_loader_missing_blocks_ready",
      "real_model_load_evidence_required",
      "synthetic_real_model_heartbeat_does_not_make_ready",
      "trusted_loader_preflight_contract_documented",
      "trusted_loader_evidence_gate_diagnostic_only",
      "trusted_loader_evidence_forbidden_material_rejected",
      "cubism_loader_integration_candidate_missing_dependency",
      "cubism_loader_provisioning_safe_summary",
      "cubism_loader_provisioning_owner_file_policy",
      "cubism_loader_provisioning_no_readiness_sweetening",
      "loader_shape_remains_diagnostic_without_allowlist",
      "fake_loader_detection_is_diagnostic_only",
      "live2d_real_evidence_safe_summary",
      "fixture_evidence_not_runtime_readiness",
      "dry_run_evidence_not_runtime_readiness",
      "stale_evidence_not_fresh",
      "real_probe_incomplete_not_ready",
      "trusted_loader_allowlist_preflight_safe_summary",
      "trusted_loader_allowlist_disabled_boundary",
      "trusted_loader_candidate_diagnostic_boundary",
      "trusted_loader_prerequisites_preserved",
      "trusted_loader_enablement_gate_blocked_by_default",
      "trusted_loader_enablement_gate_fail_closed",
      "trusted_loader_enablement_prerequisites_required",
      "trusted_loader_enablement_no_readiness_sweetening",
      "trusted_loader_owner_handoff_blocked_by_default",
      "trusted_loader_owner_handoff_safe_packet",
      "trusted_loader_owner_handoff_mock_confirmation_rejected",
      "trusted_loader_owner_handoff_no_readiness_sweetening",
      "future_micro_label_not_runtime_executable",
      "motion_dataset_boundary_labels_not_runtime_executable",
      "owner_action_lane_freeze_status_surface",
      "owner_action_lane_freeze_contract_regression_guard",
      "owner_action_lane_freeze_cross_surface_consistency",
      "owner_action_lane_freeze_status_redaction_sweep",
      "owner_action_lane_freeze_status_schema_allowlist",
      "owner_action_lane_freeze_unexpected_field_rejection_guard",
      "renderer_ready_false_positive_dependency_surface",
      "renderer_ready_fixture_vs_real_separation_contract",
      "renderer_ready_fresh_evidence_envelope_schema",
      "renderer_ready_stale_evidence_downgrade_contract",
      "renderer_ready_evidence_source_allowlist",
      "renderer_ready_evidence_schema_violation_guard",
      "renderer_ready_evidence_completeness_blocker_matrix",
      "renderer_ready_evidence_conflict_downgrade_contract",
      "renderer_ready_go_nogo_blocker_surface",
      "renderer_ready_blocker_reason_allowlist",
      "renderer_ready_safe_next_action_catalog",
      "renderer_ready_cross_surface_blocker_consistency",
    ],
  }));
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

function browserHeartbeat(overrides = {}) {
  return {
    schema: "iris_live2d_browser_heartbeat_v1",
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    cue_capability: {
      live2d_engine_request: true,
      renderer_cue_delivery: true,
      model_motion_update: true,
      recovery_cue_support: true,
    },
    last_applied_cue_status_hash: "not_yet_applied",
    last_cue_apply_status: "not_ready",
    heartbeat_timestamp_ms: nowMs,
    ...overrides,
  };
}

function syntheticRealModelHeartbeat(overrides = {}) {
  // Self-asserted browser fields are diagnostic fixtures only; they must not
  // establish trusted real model readiness in this PR.
  return browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loaded",
    model_load_supported: true,
    model_load_attempted: true,
    model_load_succeeded: true,
    model_load_error_kind: "unknown",
    real_model_load_supported: true,
    real_model_loaded: true,
    real_scene_loaded: true,
    ...overrides,
  });
}

function trustedLoaderEvidenceFixture(overrides = {}) {
  return {
    loader_kind: "cubism_framework_model_loader_v1",
    loader_version: "fixture_loader_version",
    model_load_session_id: "fixture_session_label",
    safe_manifest_status_hash: "fixture_manifest_hash",
    safe_moc_asset_token_hash: "fixture_moc_asset_hash",
    model_id: "iris_default",
    scene_id: "main_scene",
    loaded_at_ms: nowMs,
    fresh_heartbeat_timestamp_ms: nowMs,
    scene_binding_result: "bound",
    cue_capability_result: "confirmed",
    last_cue_applied_result: "applied",
    server_trusted_policy_gate: true,
    ...overrides,
  };
}

function createIrisBridgeCueFixture() {
  return {
    schema: "iris_live2d_renderer_cue_v1",
    cue_id: "live2d-cue-fixture",
    model: {
      model_configured: true,
      scene_configured: true,
    },
    motion: {
      style: "surprise_scream",
      intensity: "high",
      blend_ms: 80,
      track_count: 2,
      body_motion_hint: "shoulder_jump_small_retreat",
      gesture_hint: "hands_near_chest_startle",
    },
    expression: {
      profile_id: "fixture_expression_scream",
      expression_key: "wide_eyes_short_scream",
      blink_rate: 0.2,
      gaze_hint: "snap_to_screen_then_audience",
    },
    body: {
      state_id: "fixture_body_scream",
      autonomous_state_id: "surprise_scream",
      breathing_rate: 0.86,
      shoulder_motion: "short_jump_then_breath_recover",
    },
    camera: {
      proximity_profile: "camera_face_extreme_closeup",
      scale: 1.22,
      offset_x: 0,
      offset_y: -0.055,
      face_priority: true,
      comfort_guard: "bounded_viewer_closeup",
    },
    autonomous: {
      state: "surprise_scream",
      scream_reaction_enabled: true,
      happy_motion_enabled: false,
      vocalise_motion_enabled: false,
      safety_guard: "visual_expression_only_no_commands",
    },
    timing: {
      duration_ms: 1500,
      start_delay_ms: 0,
      sync_policy: "speech_motion_timeline",
    },
    boundary_policy: {
      renderer_cue_only: true,
      no_text_payloads: true,
      no_candidates: true,
      no_commands: true,
      no_endpoint_values: true,
      no_secret_values: true,
    },
    adapter_validation_required: true,
  };
}

function safeRendererCue(overrides = {}) {
  return {
    schema: "iris_live2d_renderer_cue_v1",
    motion: { style: "talk" },
    ...overrides,
  };
}

function rendererCueDelivery(cueOverrides = {}, wrapperOverrides = {}) {
  return {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: safeRendererCue(cueOverrides),
    ...wrapperOverrides,
  };
}

function createFakeLoaderRuntime() {
  return {
    CubismMoc: {
      create() {
        return {
          createModel() {
            return { fixture_model_created: true };
          },
        };
      },
    },
  };
}

function createFakeLoaderFetch() {
  return async (path) => {
    if (path === "/renderer/model3") {
      return {
        ok: true,
        json: async () => ({
          ok: true,
          manifest: {
            FileReferences: {
              Moc: "renderer_model_asset:asset_0123456789abcdef_moc3",
            },
          },
        }),
      };
    }
    if (path === "/renderer/model-asset/asset_0123456789abcdef_moc3") {
      return {
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      };
    }
    return {
      ok: false,
      json: async () => ({}),
    };
  };
}

function cueWithUnsafeField(field) {
  return {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      [field]: "unsafe_fixture_value",
    },
  };
}

async function assertCueRejected(harness, body, expectedKind, forbiddenFragment, path = "/cue") {
  const before = await harness.getJson("/status");
  const beforeBrowserQueue = await harness.getJson("/renderer/cues");
  const response = await fetch(`${harness.baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const responseBody = await response.json();
  assert.equal(response.status, 400);
  assert.equal(responseBody.ok, false);
  assert.equal(responseBody.error_kind, expectedKind);
  const serialized = JSON.stringify(responseBody);
  assertSafe(serialized);
  assert.equal(serialized.includes(`"${forbiddenFragment}"`), false);
  assert.equal(serialized.includes("unsafe_fixture_value"), false);
  const after = await harness.getJson("/status");
  assert.equal(after.received_cue_count, before.received_cue_count);
  assert.equal(after.browser_delivery.pending_cue_count, before.browser_delivery.pending_cue_count);
  assert.equal(after.last_cue_status_hash, before.last_cue_status_hash);
  assert.equal(after.browser_delivery.last_delivered_at, before.browser_delivery.last_delivered_at);
  assert.equal(after.renderer_ready, false);
  const afterBrowserQueue = await harness.getJson("/renderer/cues");
  assert.equal(afterBrowserQueue.pending_cue_count, beforeBrowserQueue.pending_cue_count);
  assert.equal(afterBrowserQueue.cues.length, beforeBrowserQueue.cues.length);
  const queueSerialized = JSON.stringify(afterBrowserQueue);
  assert.equal(queueSerialized, JSON.stringify(beforeBrowserQueue));
  assertSafe(queueSerialized);
  assert.equal(queueSerialized.includes("unsafe_fixture_value"), false);
}

async function assertManifestUnavailable(model3JsonPath) {
  const harness = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  try {
    const runtimeConfig = await harness.getJson("/renderer/runtime-config");
    assert.equal(runtimeConfig.model3.available, false);
    assert.equal(runtimeConfig.model3.load_route, "not_available");
    assert.equal(runtimeConfig.model3.browser_load_supported, false);
    assert.equal(runtimeConfig.model3.real_model_loaded, false);
    assertSafe(JSON.stringify(runtimeConfig));
    assertNoModelPathLeak(JSON.stringify(runtimeConfig));
    const manifest = await fetchJsonStatus(`${harness.baseUrl}/renderer/model3`);
    assert.equal(manifest.status, 404);
    assert.equal(manifest.body.error_kind, "not_found");
    assertSafe(JSON.stringify(manifest.body));
    const heartbeat = await harness.postJson("/renderer/heartbeat", browserHeartbeat({
      heartbeat_timestamp_ms: nowMs,
    }));
    assert.equal(heartbeat.renderer_ready, false);
    assert.equal(heartbeat.renderer_health.model_loaded, false);
    assert.equal(heartbeat.renderer_health.scene_loaded, false);
    assertSafe(JSON.stringify(heartbeat));
  } finally {
    await harness.close();
  }
}

async function readSseEvents(baseUrl, { eventName = "", minEvents = 1, timeoutMs = 500 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(`${baseUrl}/renderer/events`, { signal: controller.signal });
  assert.equal(response.ok, true);
  const contentType = response.headers.get("content-type") || "";
  assert.equal(contentType.includes("text/event-stream"), true);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const events = [];
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseEvents(buffer);
      buffer = parsed.remainder;
      events.push(...parsed.events);
      if (eventName && events.some((event) => event.event === eventName)) break;
      if (!eventName && events.length >= minEvents) break;
    }
  } catch (error) {
    if (error?.name !== "AbortError") throw error;
  } finally {
    clearTimeout(timeout);
    controller.abort();
    try {
      await reader.cancel();
    } catch {
      // The client-side abort is the disconnect path under test.
    }
  }

  return { contentType, events };
}

function parseSseEvents(buffer) {
  const blocks = buffer.split(/\r?\n\r?\n/u);
  const remainder = blocks.pop() ?? "";
  return {
    remainder,
    events: blocks.map(parseSseEvent).filter(Boolean),
  };
}

function parseSseEvent(block) {
  let event = "message";
  const dataLines = [];
  for (const line of block.split(/\r?\n/u)) {
    if (line.startsWith(":")) continue;
    if (line.startsWith("event:")) event = line.slice("event:".length).trim();
    if (line.startsWith("data:")) dataLines.push(line.slice("data:".length).trimStart());
  }
  if (dataLines.length === 0) return null;
  const dataText = dataLines.join("\n");
  const data = JSON.parse(dataText);
  assertSafe(dataText);
  return { event, data };
}

async function fetchJsonStatus(target) {
  const response = await fetch(target);
  return {
    status: response.status,
    body: await response.json(),
  };
}

function assetIdFromToken(token) {
  const text = String(token ?? "");
  assert.equal(text.startsWith("renderer_model_asset:"), true);
  const assetId = text.slice("renderer_model_asset:".length);
  assert.match(assetId, /^asset_[a-f0-9]{16}_[a-z0-9]+$/u);
  return assetId;
}

async function startHarness(state, options = {}) {
  const server = createLive2dRendererServer({ state, ...options });
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  const baseUrl = `http://${address.address}:${address.port}`;
  return {
    baseUrl,
    async getJson(path) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.ok, true);
      return response.json();
    },
    async getText(path) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.ok, true);
      return response.text();
    },
    async postJson(path, body) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      assert.equal(response.ok, true);
      return response.json();
    },
    close() {
      return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    },
  };
}

function assertOwnerActionLaneFreezeRejectsUnsafePromotion() {
  for (const unsafeInput of [
    { owner_action_request_sent: true },
    { owner_action_requested: true },
    { owner_action_accepted: true },
    { owner_handoff_sent: true },
    { owner_instruction_request_sent: true },
    { owner_instruction_requested: true },
    { owner_instruction_accepted: true },
    { packet_request_sent: true },
    { owner_submission_received: true },
    { owner_submission_accepted: true },
    { owner_confirmation_created: true },
    { owner_confirmation_confirmed: true },
    { actual_data_task_started: true },
    { actual_data_preauthorized: true },
    { real_data_accepted: true },
    { row_body_read: true },
    { actual_file_read: true },
    { file_path_value_accepted: true },
    { hash_calculation_performed: true },
    { source_hash_verified: true },
    { declared_row_count_checked: true },
    { parser_execution_started: true },
    { redaction_scan_execution_started: true },
    { audit_execution_started: true },
    { real_ingestion_audit_event_created: true },
    { runtime_readiness_claimed: true },
    { production_readiness_claimed: true },
    { priority1_status: "RESOLVED" },
    { checked_row_count: 1 },
    { motion_dataset_boundary: "executable" },
    { motion_dataset_executable: true },
    { trusted_loader_boundary: "enabled" },
    { trusted_loader_allowlist_enabled: true },
    { renderer_ready: true },
  ]) {
    const summary = createOwnerActionLaneFreezeStatusSummary(unsafeInput);
    assert.equal(summary.owner_action_lane_freeze_status, "blocked_unsafe_state_attempt");
    assert.equal(summary.unsafe_state_attempt_rejected, true);
    assert.equal(summary.owner_action_request_sent, false);
    assert.equal(summary.owner_action_requested, false);
    assert.equal(summary.owner_action_accepted, false);
    assert.equal(summary.owner_handoff_sent, false);
    assert.equal(summary.owner_instruction_request_sent, false);
    assert.equal(summary.owner_instruction_requested, false);
    assert.equal(summary.owner_instruction_accepted, false);
    assert.equal(summary.packet_request_sent, false);
    assert.equal(summary.owner_submission_received, false);
    assert.equal(summary.owner_submission_accepted, false);
    assert.equal(summary.owner_confirmation_created, false);
    assert.equal(summary.owner_confirmation_confirmed, false);
    assert.equal(summary.actual_data_task_started, false);
    assert.equal(summary.actual_data_preauthorized, false);
    assert.equal(summary.real_data_accepted, false);
    assert.equal(summary.row_body_read, false);
    assert.equal(summary.actual_file_read, false);
    assert.equal(summary.file_reference_value_accepted, false);
    assert.equal(summary.hash_calculation_performed, false);
    assert.equal(summary.source_hash_verified, false);
    assert.equal(summary.declared_row_count_checked, false);
    assert.equal(summary.parser_execution_started, false);
    assert.equal(summary.redaction_scan_execution_started, false);
    assert.equal(summary.audit_execution_started, false);
    assert.equal(summary.real_ingestion_audit_event_created, false);
    assert.equal(summary.runtime_readiness_claimed, false);
    assert.equal(summary.production_readiness_claimed, false);
    assert.equal(summary.priority1_status, "BLOCKED");
    assert.equal(summary.checked_row_count, 0);
    assert.equal(summary.motion_dataset_boundary, "non_executable");
    assert.equal(summary.trusted_loader_boundary, "disabled");
    assert.equal(summary.trusted_loader_allowlist_enabled, false);
    assert.equal(summary.renderer_ready, false);
    assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action");
    assertSafe(JSON.stringify(summary));
  }
}

function assertOwnerActionLaneFreezeCrossSurfaceConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertOwnerActionLaneFreezeStatusSurface(summary);
    assert.equal(summary.schema, canonical.schema, surfaceName);
    assert.equal(summary.safe_summary_only, canonical.safe_summary_only, surfaceName);
    assert.equal(summary.owner_action_lane_freeze_status, canonical.owner_action_lane_freeze_status, surfaceName);
    assert.equal(summary.owner_action_lane_freeze_reason, canonical.owner_action_lane_freeze_reason, surfaceName);
    assert.equal(summary.owner_action_lane_completed_as_metadata_only, canonical.owner_action_lane_completed_as_metadata_only, surfaceName);
    assert.equal(summary.owner_action_request_sent, canonical.owner_action_request_sent, surfaceName);
    assert.equal(summary.owner_action_requested, canonical.owner_action_requested, surfaceName);
    assert.equal(summary.owner_action_accepted, canonical.owner_action_accepted, surfaceName);
    assert.equal(summary.owner_handoff_sent, canonical.owner_handoff_sent, surfaceName);
    assert.equal(summary.owner_instruction_request_sent, canonical.owner_instruction_request_sent, surfaceName);
    assert.equal(summary.owner_instruction_requested, canonical.owner_instruction_requested, surfaceName);
    assert.equal(summary.owner_instruction_accepted, canonical.owner_instruction_accepted, surfaceName);
    assert.equal(summary.packet_request_sent, canonical.packet_request_sent, surfaceName);
    assert.equal(summary.owner_submission_received, canonical.owner_submission_received, surfaceName);
    assert.equal(summary.owner_submission_accepted, canonical.owner_submission_accepted, surfaceName);
    assert.equal(summary.owner_confirmation_created, canonical.owner_confirmation_created, surfaceName);
    assert.equal(summary.owner_confirmation_confirmed, canonical.owner_confirmation_confirmed, surfaceName);
    assert.equal(summary.actual_data_task_started, canonical.actual_data_task_started, surfaceName);
    assert.equal(summary.actual_data_preauthorized, canonical.actual_data_preauthorized, surfaceName);
    assert.equal(summary.real_data_accepted, canonical.real_data_accepted, surfaceName);
    assert.equal(summary.row_body_read, canonical.row_body_read, surfaceName);
    assert.equal(summary.actual_file_read, canonical.actual_file_read, surfaceName);
    assert.equal(summary.file_reference_value_accepted, canonical.file_reference_value_accepted, surfaceName);
    assert.equal(summary.hash_calculation_performed, canonical.hash_calculation_performed, surfaceName);
    assert.equal(summary.source_hash_verified, canonical.source_hash_verified, surfaceName);
    assert.equal(summary.declared_row_count_checked, canonical.declared_row_count_checked, surfaceName);
    assert.equal(summary.parser_execution_started, canonical.parser_execution_started, surfaceName);
    assert.equal(summary.redaction_scan_execution_started, canonical.redaction_scan_execution_started, surfaceName);
    assert.equal(summary.audit_execution_started, canonical.audit_execution_started, surfaceName);
    assert.equal(summary.real_ingestion_audit_event_created, canonical.real_ingestion_audit_event_created, surfaceName);
    assert.equal(summary.runtime_readiness_claimed, canonical.runtime_readiness_claimed, surfaceName);
    assert.equal(summary.production_readiness_claimed, canonical.production_readiness_claimed, surfaceName);
    assert.equal(summary.priority1_status, canonical.priority1_status, surfaceName);
    assert.equal(summary.checked_row_count, canonical.checked_row_count, surfaceName);
    assert.equal(summary.motion_dataset_boundary, canonical.motion_dataset_boundary, surfaceName);
    assert.equal(summary.trusted_loader_boundary, canonical.trusted_loader_boundary, surfaceName);
    assert.equal(summary.trusted_loader_allowlist_enabled, canonical.trusted_loader_allowlist_enabled, surfaceName);
    assert.equal(summary.renderer_ready, canonical.renderer_ready, surfaceName);
    assert.equal(summary.safe_next_action, canonical.safe_next_action, surfaceName);
  }
}

function assertOwnerActionLaneFreezeStatusRedactionSweep() {
  const summary = createOwnerActionLaneFreezeStatusSummary({
    endpoint: "https://secret.example/freeze",
    token: "secret-token",
    secret: "private-secret",
    private_path: "C:\\private\\owner\\row.json",
    raw_path: "/private/owner/row.json",
    raw_model_path: "/unsafe/model.moc3",
    raw_motion_path: "/unsafe/motion.motion3.json",
    actual_file_path_value: "/private/actual-row.csv",
    actual_file_content: "private-file-content",
    raw_dataset_row_body: "private-row-body",
    raw_row_body: "private-row-body-2",
    raw_cue_payload: "private-cue-payload",
    raw_renderer_payload: "private-renderer-payload",
    raw_command: "private-command",
    command_payload: "private-command-payload",
    shell_body: "private-shell-body",
    world_command: "private-world-command",
    raw_k_memo: "private-k-memo",
    owner_private_note: "private-owner-note",
    candidate_payload: "private-candidate-payload",
    relationship_score: "private-relationship-score",
    hidden_score: "private-hidden-score",
    api_key: "private-api-key",
    oauth: "private-oauth",
    connection_string: "private-connection-string",
    password: "private-password",
  });
  assert.equal(summary.owner_action_lane_freeze_status, "blocked_unsafe_state_attempt");
  assert.equal(summary.unsafe_state_attempt_rejected, true);
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action");
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_boundary, "non_executable");
  assert.equal(summary.trusted_loader_boundary, "disabled");

  const serialized = JSON.stringify(summary);
  for (const forbidden of [
    "https://secret.example/freeze",
    "secret-token",
    "private-secret",
    "C:\\private\\owner\\row.json",
    "/private/owner/row.json",
    "/unsafe/model.moc3",
    "/unsafe/motion.motion3.json",
    "/private/actual-row.csv",
    "private-file-content",
    "private-row-body",
    "private-row-body-2",
    "private-cue-payload",
    "private-renderer-payload",
    "private-command",
    "private-command-payload",
    "private-shell-body",
    "private-world-command",
    "private-k-memo",
    "private-owner-note",
    "private-candidate-payload",
    "private-relationship-score",
    "private-hidden-score",
    "private-api-key",
    "private-oauth",
    "private-connection-string",
    "private-password",
    "raw_dataset_row_body",
    "actual_file_path_value",
    "actual_file_content",
    "owner_private_note",
    "command_payload",
    "candidate_payload",
    "relationship_score",
    "hidden_score",
    "connection_string",
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
  assertSafe(serialized);
}

function assertOwnerActionLaneFreezeUnexpectedFieldRejectionGuard() {
  const summary = createOwnerActionLaneFreezeStatusSummary({
    ownerActionRequestSent: true,
    ownerActionRequested: true,
    ownerActionAccepted: true,
    ownerHandoffSent: true,
    ownerConfirmationCreated: true,
    ownerConfirmationConfirmed: true,
    actualDataTaskStarted: true,
    actualDataPreauthorized: true,
    runtimeReadinessClaimed: true,
    productionReadinessClaimed: true,
    priority1Status: "RESOLVED",
    checkedRowCount: 1,
    motionDatasetExecutable: true,
    trustedLoaderAllowlistEnabled: true,
    actualFilePathValue: "C:\\unsafe\\path",
    rawDatasetRowBody: "unsafe-row-body",
    endpoint: "https://unsafe.example",
    token: "unsafe-token",
    secret: "unsafe-secret",
    commandPayload: "unsafe-command",
  });
  assert.equal(summary.owner_action_lane_freeze_status, "blocked_unsafe_state_attempt");
  assert.equal(summary.unsafe_state_attempt_rejected, true);
  assert.equal(summary.owner_action_request_sent, false);
  assert.equal(summary.owner_action_requested, false);
  assert.equal(summary.owner_action_accepted, false);
  assert.equal(summary.owner_handoff_sent, false);
  assert.equal(summary.owner_instruction_request_sent, false);
  assert.equal(summary.owner_instruction_requested, false);
  assert.equal(summary.owner_instruction_accepted, false);
  assert.equal(summary.packet_request_sent, false);
  assert.equal(summary.owner_submission_received, false);
  assert.equal(summary.owner_submission_accepted, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.real_data_accepted, false);
  assert.equal(summary.row_body_read, false);
  assert.equal(summary.actual_file_read, false);
  assert.equal(summary.file_reference_value_accepted, false);
  assert.equal(summary.hash_calculation_performed, false);
  assert.equal(summary.source_hash_verified, false);
  assert.equal(summary.declared_row_count_checked, false);
  assert.equal(summary.parser_execution_started, false);
  assert.equal(summary.redaction_scan_execution_started, false);
  assert.equal(summary.audit_execution_started, false);
  assert.equal(summary.real_ingestion_audit_event_created, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_boundary, "non_executable");
  assert.equal(summary.trusted_loader_boundary, "disabled");
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.renderer_ready, false);
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action");

  const serialized = JSON.stringify(summary);
  for (const forbidden of [
    "ownerActionRequestSent",
    "ownerActionRequested",
    "ownerActionAccepted",
    "ownerHandoffSent",
    "ownerConfirmationCreated",
    "ownerConfirmationConfirmed",
    "actualDataTaskStarted",
    "actualDataPreauthorized",
    "runtimeReadinessClaimed",
    "productionReadinessClaimed",
    "priority1Status",
    "checkedRowCount",
    "motionDatasetExecutable",
    "trustedLoaderAllowlistEnabled",
    "actualFilePathValue",
    "rawDatasetRowBody",
    "commandPayload",
    "C:\\unsafe\\path",
    "unsafe-row-body",
    "https://unsafe.example",
    "unsafe-token",
    "unsafe-secret",
    "unsafe-command",
  ]) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
  assertSafe(serialized);
}

function assertRendererReadyFalsePositiveDependencySurface(summary) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_FALSE_POSITIVE_DEPENDENCY_SURFACE_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.renderer_ready_status, "blocked_until_real_renderer_evidence");
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.deepEqual(summary.renderer_ready_blocked_reasons, [...LIVE2D_RENDERER_READY_FALSE_POSITIVE_BLOCKERS]);
  assert.equal(summary.fresh_heartbeat_present, false);
  assert.equal(summary.real_model_load_supported, false);
  assert.equal(summary.model_loaded, false);
  assert.equal(summary.scene_loaded, false);
  assert.equal(summary.model_matches_expected, false);
  assert.equal(summary.scene_matches_expected, false);
  assert.equal(summary.cue_capability_confirmed, false);
  assert.equal(summary.last_cue_applied, false);
  assert.equal(summary.last_cue_applied_success, false);
  assert.equal(summary.fixture_pass_is_real_ready, false);
  assert.equal(summary.manifest_only_is_real_ready, false);
  assert.equal(summary.sse_connected_is_real_ready, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyFalsePositiveDependencySurfaceConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyFalsePositiveDependencySurface(summary);
    assert.equal(summary.renderer_ready_status, canonical.renderer_ready_status, surfaceName);
    assert.deepEqual(summary.renderer_ready_blocked_reasons, canonical.renderer_ready_blocked_reasons, surfaceName);
    assert.equal(summary.renderer_ready_claimed, canonical.renderer_ready_claimed, surfaceName);
    assert.equal(summary.renderer_ready_candidate, canonical.renderer_ready_candidate, surfaceName);
    assert.equal(summary.runtime_readiness_claimed, canonical.runtime_readiness_claimed, surfaceName);
    assert.equal(summary.production_readiness_claimed, canonical.production_readiness_claimed, surfaceName);
    assert.equal(summary.priority1_status, canonical.priority1_status, surfaceName);
    assert.equal(summary.checked_row_count, canonical.checked_row_count, surfaceName);
    assert.equal(summary.motion_dataset_executable, canonical.motion_dataset_executable, surfaceName);
    assert.equal(summary.trusted_loader_allowlist_enabled, canonical.trusted_loader_allowlist_enabled, surfaceName);
  }
}

function assertRendererReadyFixtureVsRealSeparationContract(summary) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_SEPARATION_CONTRACT_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.renderer_ready_fixture_vs_real_separation_contract_status, "blocked_until_real_renderer_evidence");
  assert.equal(summary.negative_contract_only, true);
  assert.equal(summary.fixture_pass_is_real_ready, false);
  assert.equal(summary.manifest_only_is_real_ready, false);
  assert.equal(summary.sse_connected_is_real_ready, false);
  assert.equal(summary.cue_accepted_is_last_cue_applied, false);
  assert.equal(summary.local_checks_are_runtime_readiness, false);
  assert.equal(summary.remote_checks_are_runtime_readiness, false);
  assert.equal(summary.owner_action_freeze_is_renderer_readiness, false);
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.fresh_heartbeat_present, false);
  assert.equal(summary.real_model_load_supported, false);
  assert.equal(summary.model_loaded, false);
  assert.equal(summary.scene_loaded, false);
  assert.equal(summary.cue_capability_confirmed, false);
  assert.equal(summary.last_cue_applied_success, false);
  assert.deepEqual(summary.required_rejection_labels, [...LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_REJECTION_LABELS]);
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyFixtureVsRealSeparationContractConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyFixtureVsRealSeparationContract(summary);
    assert.equal(summary.renderer_ready_fixture_vs_real_separation_contract_status, canonical.renderer_ready_fixture_vs_real_separation_contract_status, surfaceName);
    assert.deepEqual(summary.required_rejection_labels, canonical.required_rejection_labels, surfaceName);
    assert.equal(summary.renderer_ready_claimed, canonical.renderer_ready_claimed, surfaceName);
    assert.equal(summary.renderer_ready_candidate, canonical.renderer_ready_candidate, surfaceName);
    assert.equal(summary.runtime_readiness_claimed, canonical.runtime_readiness_claimed, surfaceName);
    assert.equal(summary.production_readiness_claimed, canonical.production_readiness_claimed, surfaceName);
    assert.equal(summary.priority1_status, canonical.priority1_status, surfaceName);
    assert.equal(summary.checked_row_count, canonical.checked_row_count, surfaceName);
    assert.equal(summary.motion_dataset_executable, canonical.motion_dataset_executable, surfaceName);
    assert.equal(summary.trusted_loader_allowlist_enabled, canonical.trusted_loader_allowlist_enabled, surfaceName);
  }
}

function assertRendererReadyFreshEvidenceEnvelope(summary, expectedFixtureEvidencePresent = false) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_FRESH_EVIDENCE_ENVELOPE_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.renderer_readiness_evidence_status, "missing_real_renderer_evidence");
  assert.equal(summary.renderer_readiness_evidence_fresh, false);
  assert.equal(summary.renderer_readiness_evidence_source_type, "none");
  assert.equal(summary.renderer_readiness_evidence_freshness, "missing");
  assert.equal(summary.renderer_readiness_evidence_timestamp_ms, null);
  assert.equal(summary.renderer_readiness_evidence_stale, true);
  assert.equal(summary.fixture_evidence_present, expectedFixtureEvidencePresent);
  assert.equal(summary.fixture_evidence_is_real_evidence, false);
  assert.equal(summary.manual_evidence_present, false);
  assert.equal(summary.manual_evidence_is_real_evidence, false);
  assert.equal(summary.real_probe_evidence_present, false);
  assert.equal(summary.real_probe_evidence_fresh, false);
  assert.equal(summary.fresh_heartbeat_evidence_present, false);
  assert.equal(summary.fresh_heartbeat_evidence_fresh, false);
  assert.equal(summary.real_model_load_evidence_present, false);
  assert.equal(summary.real_model_load_evidence_fresh, false);
  assert.equal(summary.model_loaded_evidence_present, false);
  assert.equal(summary.scene_loaded_evidence_present, false);
  assert.equal(summary.model_scene_match_evidence_present, false);
  assert.equal(summary.cue_capability_evidence_present, false);
  assert.equal(summary.last_cue_applied_evidence_present, false);
  assert.equal(summary.last_cue_applied_evidence_fresh, false);
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(summary.required_blockers, [...LIVE2D_RENDERER_READY_FRESH_EVIDENCE_REQUIRED_BLOCKERS]);
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyFreshEvidenceEnvelopeConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyFreshEvidenceEnvelope(summary, canonical.fixture_evidence_present);
    assert.equal(summary.renderer_readiness_evidence_status, canonical.renderer_readiness_evidence_status, surfaceName);
    assert.equal(summary.renderer_readiness_evidence_fresh, canonical.renderer_readiness_evidence_fresh, surfaceName);
    assert.equal(summary.renderer_readiness_evidence_freshness, canonical.renderer_readiness_evidence_freshness, surfaceName);
    assert.equal(summary.renderer_readiness_evidence_stale, canonical.renderer_readiness_evidence_stale, surfaceName);
    assert.equal(summary.renderer_ready_claimed, canonical.renderer_ready_claimed, surfaceName);
    assert.equal(summary.renderer_ready_candidate, canonical.renderer_ready_candidate, surfaceName);
    assert.equal(summary.runtime_readiness_claimed, canonical.runtime_readiness_claimed, surfaceName);
    assert.equal(summary.production_readiness_claimed, canonical.production_readiness_claimed, surfaceName);
    assert.equal(summary.priority1_status, canonical.priority1_status, surfaceName);
    assert.equal(summary.checked_row_count, canonical.checked_row_count, surfaceName);
    assert.equal(summary.motion_dataset_executable, canonical.motion_dataset_executable, surfaceName);
    assert.equal(summary.trusted_loader_allowlist_enabled, canonical.trusted_loader_allowlist_enabled, surfaceName);
  }
}

function assertRendererReadyStaleEvidenceDowngradeContract(summary, expected = {}) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_STALE_EVIDENCE_DOWNGRADE_CONTRACT_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.stale_evidence_downgrade_contract_status, "blocked_stale_or_non_real_evidence");
  assert.equal(summary.negative_contract_only, true);
  assert.equal(summary.renderer_readiness_evidence_freshness, "stale");
  assert.equal(summary.renderer_readiness_evidence_stale, true);
  assert.equal(summary.stale_evidence_is_renderer_ready, false);
  assert.equal(summary.fixture_evidence_present, expected.fixture_evidence_present === true);
  assert.equal(summary.fixture_evidence_is_real_evidence, false);
  assert.equal(summary.manual_evidence_present, expected.manual_evidence_present === true);
  assert.equal(summary.manual_evidence_is_real_evidence, false);
  assert.equal(summary.real_probe_evidence_present, false);
  assert.equal(summary.fresh_heartbeat_evidence_present, expected.fresh_heartbeat_evidence_present === true);
  assert.equal(summary.fresh_heartbeat_evidence_fresh, false);
  assert.equal(summary.real_model_load_evidence_present, expected.real_model_load_evidence_present === true);
  assert.equal(summary.real_model_load_evidence_fresh, false);
  assert.equal(summary.last_cue_applied_evidence_present, expected.last_cue_applied_evidence_present === true);
  assert.equal(summary.last_cue_applied_evidence_fresh, false);
  assert.equal(summary.manifest_available, expected.manifest_available === true);
  assert.equal(summary.manifest_only_is_real_ready, false);
  assert.equal(summary.sse_connected, expected.sse_connected === true);
  assert.equal(summary.sse_connected_is_real_ready, false);
  assert.equal(summary.cue_accepted, expected.cue_accepted === true);
  assert.equal(summary.cue_accepted_is_last_cue_applied, false);
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.deepEqual(summary.required_rejection_labels, [...LIVE2D_RENDERER_READY_STALE_EVIDENCE_REJECTION_LABELS]);
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyStaleEvidenceDowngradeContractConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyStaleEvidenceDowngradeContract(summary, canonical);
    assert.equal(summary.stale_evidence_downgrade_contract_status, canonical.stale_evidence_downgrade_contract_status, surfaceName);
    assert.deepEqual(summary.required_rejection_labels, canonical.required_rejection_labels, surfaceName);
    assert.equal(summary.renderer_ready_claimed, canonical.renderer_ready_claimed, surfaceName);
    assert.equal(summary.renderer_ready_candidate, canonical.renderer_ready_candidate, surfaceName);
    assert.equal(summary.runtime_readiness_claimed, canonical.runtime_readiness_claimed, surfaceName);
    assert.equal(summary.production_readiness_claimed, canonical.production_readiness_claimed, surfaceName);
    assert.equal(summary.priority1_status, canonical.priority1_status, surfaceName);
    assert.equal(summary.checked_row_count, canonical.checked_row_count, surfaceName);
    assert.equal(summary.motion_dataset_executable, canonical.motion_dataset_executable, surfaceName);
    assert.equal(summary.trusted_loader_allowlist_enabled, canonical.trusted_loader_allowlist_enabled, surfaceName);
  }
}

function assertRendererReadyEvidenceSourceAllowlist(summary, expected = {}) {
  const expectedSourceType = expected.source_type || "none";
  const expectedAllowed = LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_TYPES.includes(expectedSourceType);
  const normalizedSourceType = expectedAllowed ? expectedSourceType : "unsafe_source_type";
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_ALLOWLIST_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.renderer_readiness_evidence_source_allowlist_status, expectedAllowed ? "source_type_allowed_not_ready" : "unsafe_source_type");
  assert.deepEqual(summary.renderer_readiness_evidence_source_allowlist, [...LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_TYPES]);
  assert.equal(summary.renderer_readiness_evidence_source_type, normalizedSourceType);
  assert.equal(summary.renderer_readiness_evidence_source_allowed, expectedAllowed);
  assert.equal(summary.renderer_readiness_evidence_source_is_real_probe, normalizedSourceType === "real_probe");
  assert.equal(summary.renderer_readiness_evidence_source_is_fixture, normalizedSourceType === "fixture");
  assert.equal(summary.renderer_readiness_evidence_source_is_manual_label, normalizedSourceType === "manual_label");
  assert.equal(summary.renderer_readiness_evidence_source_is_real_evidence, false);
  assert.equal(summary.fixture_evidence_is_real_evidence, false);
  assert.equal(summary.manual_label_is_real_evidence, false);
  assert.equal(summary.manifest_only_is_real_evidence, false);
  assert.equal(summary.sse_connected_only_is_real_evidence, false);
  assert.equal(summary.cue_accepted_only_is_real_evidence, false);
  assert.equal(summary.real_probe_label_alone_is_renderer_ready, false);
  assert.equal(summary.operator_confirmed_auto_confirms_owner, false);
  assert.equal(summary.audit_link_alone_is_production_ready, false);
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyEvidenceSourceAllowlistConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyEvidenceSourceAllowlist(summary, { source_type: canonical.renderer_readiness_evidence_source_type });
    assert.equal(summary.renderer_readiness_evidence_source_type, canonical.renderer_readiness_evidence_source_type, surfaceName);
    assert.equal(summary.renderer_readiness_evidence_source_allowed, canonical.renderer_readiness_evidence_source_allowed, surfaceName);
    assert.equal(summary.renderer_readiness_evidence_source_is_real_evidence, canonical.renderer_readiness_evidence_source_is_real_evidence, surfaceName);
    assert.equal(summary.renderer_ready_claimed, canonical.renderer_ready_claimed, surfaceName);
    assert.equal(summary.renderer_ready_candidate, canonical.renderer_ready_candidate, surfaceName);
    assert.equal(summary.runtime_readiness_claimed, canonical.runtime_readiness_claimed, surfaceName);
    assert.equal(summary.production_readiness_claimed, canonical.production_readiness_claimed, surfaceName);
    assert.equal(summary.priority1_status, canonical.priority1_status, surfaceName);
    assert.equal(summary.checked_row_count, canonical.checked_row_count, surfaceName);
    assert.equal(summary.motion_dataset_executable, canonical.motion_dataset_executable, surfaceName);
    assert.equal(summary.trusted_loader_allowlist_enabled, canonical.trusted_loader_allowlist_enabled, surfaceName);
  }
}

function assertRendererReadyEvidenceSchemaViolationGuard(summary, expected = {}) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_GUARD_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.negative_contract_only, true);
  assert.equal(summary.schema_violation_guard_status, expected.hasViolation === true ? "rejected_to_safe_false" : "no_violation_detected_safe_false");
  assert.equal(summary.schema_violation_rejected, expected.hasViolation === true);
  assert.equal(summary.unknown_source_type_rejected, expected.unknown_source_type_rejected === true);
  assert.equal(summary.unsafe_source_type_rejected, expected.unsafe_source_type_rejected === true);
  assert.equal(summary.renderer_body_material_rejected, expected.renderer_body_material_rejected === true);
  assert.equal(summary.cue_body_material_rejected, expected.cue_body_material_rejected === true);
  assert.equal(summary.model_locator_material_rejected, expected.model_locator_material_rejected === true);
  assert.equal(summary.motion_locator_material_rejected, expected.motion_locator_material_rejected === true);
  assert.equal(summary.network_locator_material_rejected, expected.network_locator_material_rejected === true);
  assert.equal(summary.auth_material_rejected, expected.auth_material_rejected === true);
  assert.equal(summary.private_locator_material_rejected, expected.private_locator_material_rejected === true);
  assert.equal(summary.shell_material_rejected, expected.shell_material_rejected === true);
  assert.equal(summary.ready_promotion_field_rejected, expected.ready_promotion_field_rejected === true);
  assert.equal(summary.required_rejection_label_count, LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_REJECTION_LABELS.length);
  assert.equal(summary.source_value_echoed, false);
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyEvidenceSchemaViolationGuardConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyEvidenceSchemaViolationGuard(summary);
    assert.equal(summary.schema_violation_guard_status, canonical.schema_violation_guard_status, surfaceName);
    assert.equal(summary.schema_violation_rejected, canonical.schema_violation_rejected, surfaceName);
    assert.equal(summary.renderer_ready_claimed, canonical.renderer_ready_claimed, surfaceName);
    assert.equal(summary.renderer_ready_candidate, canonical.renderer_ready_candidate, surfaceName);
    assert.equal(summary.runtime_readiness_claimed, canonical.runtime_readiness_claimed, surfaceName);
    assert.equal(summary.production_readiness_claimed, canonical.production_readiness_claimed, surfaceName);
    assert.equal(summary.owner_confirmation_created, canonical.owner_confirmation_created, surfaceName);
    assert.equal(summary.owner_confirmation_confirmed, canonical.owner_confirmation_confirmed, surfaceName);
    assert.equal(summary.actual_data_task_started, canonical.actual_data_task_started, surfaceName);
    assert.equal(summary.actual_data_preauthorized, canonical.actual_data_preauthorized, surfaceName);
    assert.equal(summary.priority1_status, canonical.priority1_status, surfaceName);
    assert.equal(summary.checked_row_count, canonical.checked_row_count, surfaceName);
    assert.equal(summary.motion_dataset_executable, canonical.motion_dataset_executable, surfaceName);
    assert.equal(summary.trusted_loader_allowlist_enabled, canonical.trusted_loader_allowlist_enabled, surfaceName);
  }
}

function assertRendererReadyEvidenceCompletenessBlockerMatrix(summary) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_BLOCKER_MATRIX_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.rendererReadinessCompletenessStatus, "blocked_missing_required_evidence");
  assert.deepEqual(summary.rendererReadinessRequiredEvidence, [...LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_REQUIRED_EVIDENCE]);
  assert.deepEqual(summary.rendererReadinessMissingRequiredEvidence, [...LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_MISSING_LABELS]);
  assert.equal(summary.requiredEvidenceComplete, false);
  assert.equal(summary.allRequiredEvidencePresent, false);
  for (const value of Object.values(summary.rendererReadinessRequiredEvidenceMatrix)) {
    assert.equal(value, false);
  }
  assert.equal(summary.requiredFreshHeartbeatEvidencePresent, false);
  assert.equal(summary.requiredRealModelLoadEvidencePresent, false);
  assert.equal(summary.requiredModelLoadedEvidencePresent, false);
  assert.equal(summary.requiredSceneLoadedEvidencePresent, false);
  assert.equal(summary.requiredModelSceneMatchEvidencePresent, false);
  assert.equal(summary.requiredCueCapabilityEvidencePresent, false);
  assert.equal(summary.requiredLastCueAppliedEvidencePresent, false);
  assert.equal(summary.requiredLastCueAppliedSuccessEvidencePresent, false);
  assert.equal(summary.requiredOwnerConfirmationPresent, false);
  assert.equal(summary.requiredTrustedLoaderDisabledBoundaryPresent, false);
  assert.equal(summary.requiredPriority1UnblockedEvidencePresent, false);
  assert.equal(summary.requiredPositiveCheckedRowCountEvidencePresent, false);
  assert.equal(summary.requiredMotionDatasetExecutableEvidencePresent, false);
  assert.equal(summary.rendererReadyClaimed, false);
  assert.equal(summary.rendererReadyCandidate, false);
  assert.equal(summary.runtimeReadinessClaimed, false);
  assert.equal(summary.productionReadinessClaimed, false);
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.fresh_heartbeat_present, false);
  assert.equal(summary.real_model_load_supported, false);
  assert.equal(summary.model_loaded, false);
  assert.equal(summary.scene_loaded, false);
  assert.equal(summary.model_scene_match_confirmed, false);
  assert.equal(summary.cue_capability_confirmed, false);
  assert.equal(summary.last_cue_applied, false);
  assert.equal(summary.last_cue_applied_success, false);
  assert.equal(summary.fixture_pass_is_real_ready, false);
  assert.equal(summary.manifest_only_is_real_ready, false);
  assert.equal(summary.sse_connected_is_real_ready, false);
  assert.equal(summary.cue_accepted_is_last_cue_applied, false);
  assert.equal(summary.priority1Status, "BLOCKED");
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checkedRowCount, 0);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motionDatasetExecutable, false);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trustedLoaderAllowlistEnabled, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.safeNextAction, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyEvidenceCompletenessBlockerMatrixConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyEvidenceCompletenessBlockerMatrix(summary);
    assert.equal(summary.rendererReadinessCompletenessStatus, canonical.rendererReadinessCompletenessStatus, surfaceName);
    assert.deepEqual(summary.rendererReadinessMissingRequiredEvidence, canonical.rendererReadinessMissingRequiredEvidence, surfaceName);
    assert.equal(summary.requiredEvidenceComplete, canonical.requiredEvidenceComplete, surfaceName);
    assert.equal(summary.rendererReadyClaimed, canonical.rendererReadyClaimed, surfaceName);
    assert.equal(summary.rendererReadyCandidate, canonical.rendererReadyCandidate, surfaceName);
    assert.equal(summary.runtimeReadinessClaimed, canonical.runtimeReadinessClaimed, surfaceName);
    assert.equal(summary.productionReadinessClaimed, canonical.productionReadinessClaimed, surfaceName);
    assert.equal(summary.priority1Status, canonical.priority1Status, surfaceName);
    assert.equal(summary.checkedRowCount, canonical.checkedRowCount, surfaceName);
    assert.equal(summary.motionDatasetExecutable, canonical.motionDatasetExecutable, surfaceName);
    assert.equal(summary.trustedLoaderAllowlistEnabled, canonical.trustedLoaderAllowlistEnabled, surfaceName);
  }
}

function assertRendererReadyEvidenceConflictDowngradeContract(summary, expectedLabels = []) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_EVIDENCE_CONFLICT_DOWNGRADE_CONTRACT_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.negative_contract_only, true);
  assert.equal(summary.evidenceConflictDowngradeStatus, "downgraded_to_safe_false");
  assert.equal(summary.evidenceConflictDetected, true);
  assert.equal(summary.evidenceConflictDowngraded, true);
  assert.equal(summary.partialEvidenceIsReady, false);
  assert.equal(summary.conflictingEvidenceIsReady, false);
  assert.equal(summary.futureTimestampAccepted, false);
  assert.equal(summary.staleTimestampAccepted, false);
  assert.equal(summary.staleTimestampDowngraded, true);
  assert.equal(summary.fixtureEvidenceIsRealReady, false);
  assert.equal(summary.manualLabelIsRealReady, false);
  assert.equal(summary.manifestOnlyIsRealReady, false);
  assert.equal(summary.sseConnectedIsRealReady, false);
  assert.equal(summary.cueAcceptedIsLastCueApplied, false);
  assert.deepEqual(summary.requiredConflictLabels, [...LIVE2D_RENDERER_READY_EVIDENCE_CONFLICT_DOWNGRADE_LABELS]);
  for (const label of expectedLabels) {
    assert.equal(summary.detectedConflictLabels.includes(label), true, label);
  }
  assert.equal(summary.rendererReadyClaimed, false);
  assert.equal(summary.rendererReadyCandidate, false);
  assert.equal(summary.runtimeReadinessClaimed, false);
  assert.equal(summary.productionReadinessClaimed, false);
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.priority1Status, "BLOCKED");
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checkedRowCount, 0);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motionDatasetExecutable, false);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trustedLoaderAllowlistEnabled, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.sourceValueEchoed, false);
  assert.equal(summary.safeNextAction, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyEvidenceConflictDowngradeContractConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyEvidenceConflictDowngradeContract(summary);
    assert.equal(summary.evidenceConflictDowngradeStatus, canonical.evidenceConflictDowngradeStatus, surfaceName);
    assert.equal(summary.evidenceConflictDetected, canonical.evidenceConflictDetected, surfaceName);
    assert.equal(summary.evidenceConflictDowngraded, canonical.evidenceConflictDowngraded, surfaceName);
    assert.equal(summary.rendererReadyClaimed, canonical.rendererReadyClaimed, surfaceName);
    assert.equal(summary.rendererReadyCandidate, canonical.rendererReadyCandidate, surfaceName);
    assert.equal(summary.runtimeReadinessClaimed, canonical.runtimeReadinessClaimed, surfaceName);
    assert.equal(summary.productionReadinessClaimed, canonical.productionReadinessClaimed, surfaceName);
    assert.equal(summary.priority1Status, canonical.priority1Status, surfaceName);
    assert.equal(summary.checkedRowCount, canonical.checkedRowCount, surfaceName);
    assert.equal(summary.motionDatasetExecutable, canonical.motionDatasetExecutable, surfaceName);
    assert.equal(summary.trustedLoaderAllowlistEnabled, canonical.trustedLoaderAllowlistEnabled, surfaceName);
  }
}

function assertRendererReadyGoNoGoBlockerSurface(summary) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_GO_NOGO_BLOCKER_SURFACE_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.rendererReadinessGoNoGoStatus, "no_go");
  assert.equal(summary.rendererReadinessGoApproved, false);
  assert.deepEqual(summary.rendererReadinessNoGoReasons, [...LIVE2D_RENDERER_READY_GO_NOGO_REASONS]);
  assert.equal(summary.safeReasonsOnly, true);
  assert.equal(summary.rendererReadyClaimed, false);
  assert.equal(summary.rendererReadyCandidate, false);
  assert.equal(summary.runtimeReadinessClaimed, false);
  assert.equal(summary.productionReadinessClaimed, false);
  assert.equal(summary.renderer_ready_claimed, false);
  assert.equal(summary.renderer_ready_candidate, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.priority1Status, "BLOCKED");
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checkedRowCount, 0);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motionDatasetExecutable, false);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trustedLoaderAllowlistEnabled, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.safeNextAction, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyGoNoGoBlockerSurfaceConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyGoNoGoBlockerSurface(summary);
    assert.equal(summary.rendererReadinessGoNoGoStatus, canonical.rendererReadinessGoNoGoStatus, surfaceName);
    assert.deepEqual(summary.rendererReadinessNoGoReasons, canonical.rendererReadinessNoGoReasons, surfaceName);
    assert.equal(summary.rendererReadinessGoApproved, canonical.rendererReadinessGoApproved, surfaceName);
    assert.equal(summary.safeNextAction, canonical.safeNextAction, surfaceName);
  }
}

function assertRendererReadyBlockerReasonAllowlist(summary) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_BLOCKER_REASON_ALLOWLIST_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.blockerReasonAllowlistStatus, "enforced");
  assert.deepEqual(summary.rendererReadinessBlockerReasonAllowlist, [...LIVE2D_RENDERER_READY_BLOCKER_REASON_ALLOWLIST]);
  assert.equal(summary.goNoGoReasonsIncluded, true);
  assert.equal(summary.unknownReasonRejected, true);
  assert.equal(summary.unsafeDiagnosticReasonRejected, true);
  assert.equal(summary.sourceValueEchoed, false);
  assert.equal(summary.rendererReadyClaimed, false);
  assert.equal(summary.rendererReadyCandidate, false);
  assert.equal(summary.runtimeReadinessClaimed, false);
  assert.equal(summary.productionReadinessClaimed, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.priority1Status, "BLOCKED");
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checkedRowCount, 0);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motionDatasetExecutable, false);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trustedLoaderAllowlistEnabled, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyBlockerReasonAllowlistConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyBlockerReasonAllowlist(summary);
    assert.equal(summary.blockerReasonAllowlistStatus, canonical.blockerReasonAllowlistStatus, surfaceName);
    assert.deepEqual(
      summary.rendererReadinessBlockerReasonAllowlist,
      canonical.rendererReadinessBlockerReasonAllowlist,
      surfaceName,
    );
    assert.equal(summary.unknownReasonRejected, canonical.unknownReasonRejected, surfaceName);
    assert.equal(summary.unsafeDiagnosticReasonRejected, canonical.unsafeDiagnosticReasonRejected, surfaceName);
  }
}

function assertRendererReadySafeNextActionCatalog(summary) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_SAFE_NEXT_ACTION_CATALOG_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.safeNextActionCatalogStatus, "available_safe_labels_only");
  assert.deepEqual(summary.safeNextActions, [...LIVE2D_RENDERER_READY_SAFE_NEXT_ACTIONS]);
  assert.equal(summary.defaultSafeNextAction, "wait_for_explicit_owner_action_and_real_renderer_evidence");
  assert.equal(summary.unsafeActionRejected, true);
  assert.equal(summary.actionExecutionStarted, false);
  assert.equal(summary.sourceValueEchoed, false);
  assert.equal(summary.rendererReadyClaimed, false);
  assert.equal(summary.rendererReadyCandidate, false);
  assert.equal(summary.runtimeReadinessClaimed, false);
  assert.equal(summary.productionReadinessClaimed, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.priority1Status, "BLOCKED");
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checkedRowCount, 0);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motionDatasetExecutable, false);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trustedLoaderAllowlistEnabled, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadySafeNextActionCatalogConsistency(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadySafeNextActionCatalog(summary);
    assert.equal(summary.safeNextActionCatalogStatus, canonical.safeNextActionCatalogStatus, surfaceName);
    assert.deepEqual(summary.safeNextActions, canonical.safeNextActions, surfaceName);
    assert.equal(summary.defaultSafeNextAction, canonical.defaultSafeNextAction, surfaceName);
    assert.equal(summary.actionExecutionStarted, canonical.actionExecutionStarted, surfaceName);
  }
}

function assertRendererReadyCrossSurfaceBlockerConsistency(summary) {
  assert.equal(summary.schema, LIVE2D_RENDERER_READY_CROSS_SURFACE_BLOCKER_CONSISTENCY_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.crossSurfaceBlockerConsistencyStatus, "consistent_safe_no_go");
  assert.deepEqual(summary.surfacesChecked, [...LIVE2D_RENDERER_READY_CROSS_SURFACE_BLOCKER_SURFACES]);
  assert.equal(summary.goNoGoStatusConsistent, true);
  assert.equal(summary.blockerReasonsConsistent, true);
  assert.equal(summary.readinessFlagsConsistent, true);
  assert.equal(summary.ownerDataTrustedLoaderFlagsConsistent, true);
  assert.equal(summary.rendererReadyClaimed, false);
  assert.equal(summary.rendererReadyCandidate, false);
  assert.equal(summary.runtimeReadinessClaimed, false);
  assert.equal(summary.productionReadinessClaimed, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.priority1Status, "BLOCKED");
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checkedRowCount, 0);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motionDatasetExecutable, false);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.trustedLoaderAllowlistEnabled, false);
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(summary));
}

function assertRendererReadyCrossSurfaceBlockerConsistencyAcrossSurfaces(surfaces) {
  const canonical = surfaces.runtimeConfig;
  for (const [surfaceName, summary] of Object.entries(surfaces)) {
    assertRendererReadyCrossSurfaceBlockerConsistency(summary);
    assert.equal(summary.crossSurfaceBlockerConsistencyStatus, canonical.crossSurfaceBlockerConsistencyStatus, surfaceName);
    assert.deepEqual(summary.surfacesChecked, canonical.surfacesChecked, surfaceName);
    assert.equal(summary.goNoGoStatusConsistent, canonical.goNoGoStatusConsistent, surfaceName);
    assert.equal(summary.ownerDataTrustedLoaderFlagsConsistent, canonical.ownerDataTrustedLoaderFlagsConsistent, surfaceName);
  }
}

function assertOwnerActionLaneFreezeStatusSurface(summary) {
  assertOwnerActionLaneFreezeStatusSchemaAllowlist(summary);
  assert.equal(summary.schema, LIVE2D_OWNER_ACTION_LANE_FREEZE_STATUS_SCHEMA);
  assert.equal(summary.safe_summary_only, true);
  assert.equal(summary.owner_action_lane_freeze_status, "waiting_for_explicit_owner_action");
  assert.equal(summary.owner_action_lane_completed_as_metadata_only, true);
  assert.equal(summary.owner_action_request_sent, false);
  assert.equal(summary.owner_action_requested, false);
  assert.equal(summary.owner_action_accepted, false);
  assert.equal(summary.owner_handoff_sent, false);
  assert.equal(summary.owner_instruction_request_sent, false);
  assert.equal(summary.owner_instruction_requested, false);
  assert.equal(summary.owner_instruction_accepted, false);
  assert.equal(summary.packet_request_sent, false);
  assert.equal(summary.owner_submission_received, false);
  assert.equal(summary.owner_submission_accepted, false);
  assert.equal(summary.owner_confirmation_created, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.real_data_accepted, false);
  assert.equal(summary.row_body_read, false);
  assert.equal(summary.actual_file_read, false);
  assert.equal(summary.file_reference_value_accepted, false);
  assert.equal(summary.hash_calculation_performed, false);
  assert.equal(summary.source_hash_verified, false);
  assert.equal(summary.declared_row_count_checked, false);
  assert.equal(summary.parser_execution_started, false);
  assert.equal(summary.redaction_scan_execution_started, false);
  assert.equal(summary.audit_execution_started, false);
  assert.equal(summary.real_ingestion_audit_event_created, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_boundary, "non_executable");
  assert.equal(summary.trusted_loader_boundary, "disabled");
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.renderer_ready, false);
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action");
  assert.equal(summary.unsafe_state_attempt_rejected, false);
  assert.equal(summary.boundary_policy.no_owner_confirmation_creation, true);
  assert.equal(summary.boundary_policy.no_actual_data_task_started, true);
  assert.equal(summary.boundary_policy.no_readiness_claim, true);
  assertSafe(JSON.stringify(summary));
}

function assertOwnerActionLaneFreezeStatusSchemaAllowlist(summary) {
  const keys = Object.keys(summary);
  for (const key of keys) {
    assert.equal(OWNER_ACTION_LANE_FREEZE_STATUS_ALLOWED_KEYS.includes(key), true, key);
  }
  for (const key of OWNER_ACTION_LANE_FREEZE_STATUS_REQUIRED_KEYS) {
    assert.equal(Object.hasOwn(summary, key), true, key);
  }
  for (const key of OWNER_ACTION_LANE_FREEZE_STATUS_FORBIDDEN_KEYS) {
    assert.equal(Object.hasOwn(summary, key), false, key);
  }
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_boundary, "non_executable");
  assert.equal(summary.trusted_loader_allowlist_enabled, false);
  assert.equal(summary.trusted_loader_boundary, "disabled");
  assert.equal(summary.safe_next_action, "wait_for_explicit_owner_action");
}

function assertSafe(serialized) {
  assert.equal(serialized.includes("https://secret.example"), false);
  assert.equal(serialized.includes("secret-token"), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("raw_renderer_payload"), false);
  assert.equal(serialized.includes("raw_motion_command"), false);
  assert.equal(serialized.includes("internal_model_path"), false);
  assert.equal(serialized.includes("motion_path"), false);
  assert.equal(serialized.includes("world_command"), false);
  assert.equal(serialized.includes("input_action_candidate"), false);
  assert.equal(serialized.includes("approved_game_input_action"), false);
  assert.equal(serialized.includes("obs_command"), false);
  assert.equal(serialized.includes("game_input"), false);
  assert.equal(serialized.includes("os_command"), false);
}

function assertNoModelPathLeak(serialized) {
  for (const fragment of [
    tmpDir,
    "avatar.model3.json",
    "safe_model.moc3",
    "textures/texture_00.png",
    "motions/idle.motion3.json",
    "expressions/soft_smile.exp3.json",
    "https://example.invalid",
    "/unsafe/model.moc3",
    "../outside.moc3",
    "asset.txt",
  ]) {
    assert.equal(serialized.includes(fragment), false);
  }
}


{
  const summary = createMotionDatasetParserDryRunExecutionRequestEnvelopeSummary({
    parser_dry_run_executed: true,
    row_body_parser_enabled: true,
    row_body_parser_executed: true,
    actual_file_read: true,
    row_body_read: true,
    real_row_data_present: true,
    checked_row_count: 2,
    actual_ingestion_allowed: true,
    priority1_status: "RESOLVED",
    go_nogo_status: "go",
  });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_SCHEMA);
  assert.equal(summary.motion_dataset_parser_dry_run_execution_request_envelope_status, "planning_only_blocked");
  assert.equal(summary.parser_dry_run_execution_request_envelope_only_boundary, true);
  assert.equal(summary.no_parser_dry_run_execution_boundary, true);
  assert.equal(summary.no_parser_execution_boundary, true);
  assert.equal(summary.no_actual_file_read_boundary, true);
  assert.equal(summary.parser_dry_run_executed, false);
  assert.equal(summary.row_body_parser_enabled, false);
  assert.equal(summary.row_body_parser_executed, false);
  assert.equal(summary.actual_file_read, false);
  assert.equal(summary.row_body_read, false);
  assert.equal(summary.real_row_data_present, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_future_parser_execution_request_fields, [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_REQUIRED_FIELDS]);
  assert.deepEqual(summary.required_future_parser_execution_blockers, [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_BLOCKERS]);
  assert.ok(summary.blocked_reasons.includes("motion_dataset_parser_dry_run_execution_request_envelope_rejected_state_promotion"));
}

{
  const summary = createMotionDatasetAuditExecutionRequestEnvelopeSummary({ audit_execution_started: true, real_ingestion_audit_event_created: true, actual_data_task_started: true, row_body_read: true, real_row_data_present: true, checked_row_count: 3, actual_ingestion_allowed: true, owner_confirmation_confirmed: true, priority1_status: "RESOLVED", go_nogo_status: "go" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_ENVELOPE_SCHEMA);
  assert.equal(summary.motion_dataset_audit_execution_request_envelope_status, "planning_only_blocked");
  assert.equal(summary.audit_execution_request_envelope_only_boundary, true);
  assert.equal(summary.no_audit_execution_started_boundary, true);
  assert.equal(summary.no_real_ingestion_audit_event_boundary, true);
  assert.equal(summary.audit_execution_started, false);
  assert.equal(summary.real_ingestion_audit_event_created, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.row_body_read, false);
  assert.equal(summary.real_row_data_present, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_future_audit_execution_inputs, [...LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_REQUIRED_INPUTS]);
  assert.deepEqual(summary.required_future_audit_execution_outputs, [...LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_REQUIRED_OUTPUTS]);
}

{
  const summary = createMotionDatasetActualDataTaskRunbookNoActionPacketSummary({ actual_data_task_started: true, external_action_performed: true, actual_ingestion_allowed: true, real_row_data_present: true, checked_row_count: 4, owner_confirmation_confirmed: true, priority1_status: "RESOLVED", go_nogo_status: "go" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_NO_ACTION_PACKET_SCHEMA);
  assert.equal(summary.motion_dataset_actual_data_task_runbook_no_action_packet_status, "planning_only_blocked");
  assert.equal(summary.runbook_no_action_packet_only_boundary, true);
  assert.equal(summary.no_external_action_boundary, true);
  assert.equal(summary.no_actual_data_task_started_boundary, true);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.external_action_performed, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.real_row_data_present, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_safe_runbook_steps, [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_SAFE_STEPS]);
  assert.deepEqual(summary.required_runbook_blockers, [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_BLOCKERS]);
}

{
  const summary = createMotionDatasetFinalOwnerActualDataPacketSummary({ owner_confirmation_confirmed: true, actual_data_preauthorized: true, actual_data_task_started: true, actual_ingestion_allowed: true, real_row_data_present: true, checked_row_count: 5, motion_dataset_executable: true, priority1_status: "RESOLVED", go_nogo_status: "go" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_SCHEMA);
  assert.equal(summary.motion_dataset_final_owner_actual_data_packet_status, "planning_only_blocked");
  assert.equal(summary.final_owner_actual_data_packet_only_boundary, true);
  assert.equal(summary.no_owner_confirmation_created_boundary, true);
  assert.equal(summary.no_actual_data_task_started_boundary, true);
  assert.equal(summary.no_actual_data_preauthorized_boundary, true);
  assert.equal(summary.owner_confirmation_required, true);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_preauthorized, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.real_row_data_present, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_owner_packet_sections, [...LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_REQUIRED_SECTIONS]);
  assert.deepEqual(summary.required_owner_packet_blockers, [...LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_BLOCKERS]);
}

{
  const summary = createMotionDatasetActualDataFreezeStateLedgerSummary({ actual_data_task_started: true, actual_ingestion_allowed: true, real_row_data_present: true, checked_row_count: 6, owner_confirmation_confirmed: true, priority1_status: "RESOLVED", go_nogo_status: "go" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LEDGER_SCHEMA);
  assert.equal(summary.motion_dataset_actual_data_freeze_state_ledger_status, "planning_only_blocked");
  assert.equal(summary.freeze_state_ledger_only_boundary, true);
  assert.equal(summary.actual_data_frozen_pending_owner_task, true);
  assert.equal(summary.no_actual_data_task_started_boundary, true);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.real_row_data_present, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_frozen_state_labels, [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LABELS]);
  assert.deepEqual(summary.required_unfreeze_conditions, [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_UNFREEZE_CONDITIONS]);
}

{
  const summary = createMotionDatasetOwnerWaitStatePacketSummary({ owner_confirmation_confirmed: true, actual_data_task_started: true, actual_ingestion_allowed: true, real_row_data_present: true, checked_row_count: 7, priority1_status: "RESOLVED" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA);
  assert.equal(summary.motion_dataset_owner_wait_state_packet_status, "planning_only_blocked");
  assert.equal(summary.owner_wait_state_packet_only_boundary, true);
  assert.equal(summary.no_owner_confirmation_created_boundary, true);
  assert.equal(summary.no_actual_data_task_started_boundary, true);
  assert.equal(summary.owner_confirmation_required, true);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.real_row_data_present, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_waiting_on_owner_items, [...LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_OWNER_ITEMS]);
  assert.deepEqual(summary.required_waiting_on_system_items, [...LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_SYSTEM_ITEMS]);
}

{
  const summary = createMotionDatasetReadinessNonSweeteningSweepSummary({ readiness_sweep_promoted_ready: true, runtime_readiness_claimed: true, production_readiness_claimed: true, renderer_ready: true, browser_cue_delivery_ready: true, actual_ingestion_allowed: true, checked_row_count: 8, priority1_status: "RESOLVED" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_SWEEP_SCHEMA);
  assert.equal(summary.motion_dataset_readiness_non_sweetening_sweep_status, "planning_only_blocked");
  assert.equal(summary.readiness_non_sweetening_sweep_only_boundary, true);
  assert.equal(summary.no_readiness_promotion_boundary, true);
  assert.equal(summary.readiness_sweep_promoted_ready, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.renderer_ready, false);
  assert.equal(summary.browser_cue_delivery_ready, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_surfaces_checked, [...LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_SURFACES]);
  assert.deepEqual(summary.required_false_ready_rejection_labels, [...LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_FALSE_READY_REJECTIONS]);
}

{
  const summary = createMotionDatasetPlanningCompletionReviewPacketSummary({ planning_completion_claims_actual_ready: true, owner_confirmation_confirmed: true, actual_data_task_started: true, actual_ingestion_allowed: true, real_row_data_present: true, checked_row_count: 9, priority1_status: "RESOLVED", go_nogo_status: "go" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA);
  assert.equal(summary.motion_dataset_planning_completion_review_packet_status, "planning_only_blocked");
  assert.equal(summary.planning_completion_review_packet_only_boundary, true);
  assert.equal(summary.no_actual_data_ready_claim_boundary, true);
  assert.equal(summary.no_owner_confirmation_created_boundary, true);
  assert.equal(summary.planning_completion_claims_actual_ready, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.real_row_data_present, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_completed_planning_artifacts, [...LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_COMPLETED_ARTIFACTS]);
  assert.deepEqual(summary.required_unresolved_blockers, [...LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_UNRESOLVED_BLOCKERS]);
}

{
  const summary = createMotionDatasetOwnerSubmissionFormSpecSummary({ owner_submission_form_accepts_real_data: true, owner_confirmation_confirmed: true, actual_data_task_started: true, actual_ingestion_allowed: true, real_row_data_present: true, checked_row_count: 10, priority1_status: "RESOLVED" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_SPEC_SCHEMA);
  assert.equal(summary.motion_dataset_owner_submission_form_spec_status, "planning_only_blocked");
  assert.equal(summary.owner_submission_form_spec_only_boundary, true);
  assert.equal(summary.no_real_data_accepted_boundary, true);
  assert.equal(summary.no_owner_confirmation_created_boundary, true);
  assert.equal(summary.owner_submission_form_accepts_real_data, false);
  assert.equal(summary.owner_confirmation_confirmed, false);
  assert.equal(summary.actual_data_task_started, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.real_row_data_present, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_form_fields, [...LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_REQUIRED_FIELDS]);
  assert.deepEqual(summary.rejected_form_fields, [...LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_REJECTED_FIELDS]);
}

{
  const summary = createMotionDatasetRealRowRedactionPolicyMatrixSummary({ redaction_scan_executed: true, redaction_policy_matrix_claims_scan_complete: true, actual_file_read: true, actual_row_content_accepted: true, actual_ingestion_allowed: true, checked_row_count: 10, priority1_status: "RESOLVED" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_MATRIX_SCHEMA);
  assert.equal(summary.motion_dataset_real_row_redaction_policy_matrix_status, "planning_only_blocked");
  assert.equal(summary.redaction_policy_matrix_only_boundary, true);
  assert.equal(summary.no_redaction_scan_executed_boundary, true);
  assert.equal(summary.redaction_policy_matrix_only, true);
  assert.equal(summary.redaction_scan_executed, false);
  assert.equal(summary.redaction_policy_matrix_claims_scan_complete, false);
  assert.equal(summary.actual_file_read, false);
  assert.equal(summary.actual_row_content_accepted, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_redaction_categories, [...LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_CATEGORIES]);
  assert.deepEqual(summary.required_redaction_actions, [...LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_ACTIONS]);
}

{
  const summary = createMotionDatasetMotionAllowlistSyncReviewSummary({ motion_allowlist_sync_claims_runtime_enabled: true, motion_dataset_executable: true, actual_ingestion_allowed: true, checked_row_count: 10, priority1_status: "RESOLVED" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_MOTION_ALLOWLIST_SYNC_REVIEW_SCHEMA);
  assert.equal(summary.motion_dataset_motion_allowlist_sync_review_status, "planning_only_blocked");
  assert.equal(summary.motion_allowlist_sync_review_only_boundary, true);
  assert.equal(summary.no_motion_execution_boundary, true);
  assert.equal(summary.no_runtime_allowlist_enablement_boundary, true);
  assert.equal(summary.motion_allowlist_sync_review_only, true);
  assert.equal(summary.motion_allowlist_sync_claims_runtime_enabled, false);
  assert.equal(summary.motion_dataset_executable, false);
  assert.equal(summary.actual_ingestion_allowed, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.runtime_supported_motion_styles, [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES]);
  assert.deepEqual(summary.experimental_review_only_motion_labels, [...LIVE2D_EXPERIMENTAL_MOTION_LABELS]);
  assert.deepEqual(summary.required_motion_label_rejection_reasons, [...LIVE2D_MOTION_DATASET_MOTION_ALLOWLIST_SYNC_REJECTION_REASONS]);
}

{
  const summary = createMotionDatasetRendererReadyDependencyMatrixSummary({ renderer_ready_dependency_matrix_claims_ready: true, renderer_ready: true, browser_cue_delivery_ready: true, runtime_readiness_claimed: true, production_readiness_claimed: true, checked_row_count: 10, priority1_status: "RESOLVED" });
  assert.equal(summary.schema, LIVE2D_MOTION_DATASET_RENDERER_READY_DEPENDENCY_MATRIX_SCHEMA);
  assert.equal(summary.motion_dataset_renderer_ready_dependency_matrix_status, "planning_only_blocked");
  assert.equal(summary.renderer_ready_dependency_matrix_only_boundary, true);
  assert.equal(summary.no_renderer_ready_claim_boundary, true);
  assert.equal(summary.renderer_ready_dependency_matrix_only, true);
  assert.equal(summary.renderer_ready_dependency_matrix_claims_ready, false);
  assert.equal(summary.renderer_ready, false);
  assert.equal(summary.browser_cue_delivery_ready, false);
  assert.equal(summary.runtime_readiness_claimed, false);
  assert.equal(summary.production_readiness_claimed, false);
  assert.equal(summary.checked_row_count, 0);
  assert.equal(summary.priority1_status, "BLOCKED");
  assert.deepEqual(summary.required_renderer_ready_dependencies, [...LIVE2D_MOTION_DATASET_RENDERER_READY_DEPENDENCIES]);
  assert.deepEqual(summary.required_false_ready_blockers, [...LIVE2D_MOTION_DATASET_RENDERER_READY_FALSE_READY_BLOCKERS]);
}

{
  const summary = createRendererReadyFalsePositiveDependencySurfaceSummary({
    fresh_heartbeat_present: true,
    real_model_load_supported: true,
    model_loaded: true,
    scene_loaded: true,
    model_matches_expected: true,
    scene_matches_expected: true,
    cue_capability_confirmed: true,
    last_cue_applied_success: true,
    fixture_pass_is_real_ready: true,
    manifest_only_is_real_ready: true,
    sse_connected_is_real_ready: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    checked_row_count: 12,
    motion_dataset_executable: true,
    trusted_loader_allowlist_enabled: true,
  });
  assertRendererReadyFalsePositiveDependencySurface(summary);
  assert.equal(summary.observed_inputs_sanitized.fresh_heartbeat_present, "observed_but_not_sufficient");
  assert.equal(summary.observed_inputs_sanitized.real_model_load_supported, "observed_but_not_sufficient");
  assert.equal(summary.observed_inputs_sanitized.model_loaded, "observed_but_not_sufficient");
  assert.equal(summary.observed_inputs_sanitized.scene_loaded, "observed_but_not_sufficient");
  assert.equal(summary.observed_inputs_sanitized.model_matches_expected, "observed_but_not_sufficient");
  assert.equal(summary.observed_inputs_sanitized.scene_matches_expected, "observed_but_not_sufficient");
  assert.equal(summary.observed_inputs_sanitized.cue_capability_confirmed, "observed_but_not_sufficient");
  assert.equal(summary.observed_inputs_sanitized.last_cue_applied_success, "observed_but_not_sufficient");
}

{
  const summary = createRendererReadyFixtureVsRealSeparationContractSummary({
    fixture_pass: true,
    manifest_available: true,
    sse_connected: true,
    cue_accepted: true,
    schema_manifest_pass: true,
    owner_action_freeze_pass: true,
    local_checks_pass: true,
    remote_checks_pass: true,
    fresh_heartbeat_present: false,
    real_model_load_supported: false,
    model_loaded: false,
    scene_loaded: false,
    cue_capability_confirmed: false,
    last_cue_applied_success: false,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    checked_row_count: 14,
    motion_dataset_executable: true,
    trusted_loader_allowlist_enabled: true,
  });
  assertRendererReadyFixtureVsRealSeparationContract(summary);
  assert.equal(summary.observed_positive_fixture_inputs_sanitized.fixture_pass, "fixture_only_not_real_ready");
  assert.equal(summary.observed_positive_fixture_inputs_sanitized.manifest_available, "manifest_only_not_real_ready");
  assert.equal(summary.observed_positive_fixture_inputs_sanitized.sse_connected, "sse_only_not_real_ready");
  assert.equal(summary.observed_positive_fixture_inputs_sanitized.cue_accepted, "accepted_only_not_applied");
  assert.equal(summary.observed_positive_fixture_inputs_sanitized.schema_manifest_pass, "schema_only_not_real_ready");
  assert.equal(summary.observed_positive_fixture_inputs_sanitized.owner_action_freeze_pass, "freeze_only_not_real_ready");
  assert.equal(summary.observed_positive_fixture_inputs_sanitized.local_checks_pass, "local_checks_only_not_runtime_ready");
  assert.equal(summary.observed_positive_fixture_inputs_sanitized.remote_checks_pass, "remote_checks_only_not_runtime_ready");
}

{
  const summary = createRendererReadyFreshEvidenceEnvelopeSummary({
    fixture_evidence_present: true,
    fresh_heartbeat_evidence_present: true,
    real_model_load_evidence_present: true,
    model_loaded_evidence_present: true,
    scene_loaded_evidence_present: true,
    cue_capability_evidence_present: true,
    last_cue_applied_evidence_present: true,
    renderer_ready_claimed: true,
    renderer_ready_candidate: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    checked_row_count: 21,
    motion_dataset_executable: true,
    trusted_loader_allowlist_enabled: true,
  });
  assertRendererReadyFreshEvidenceEnvelope(summary, true);
  assert.equal(summary.observed_evidence_inputs_sanitized.fresh_heartbeat_evidence_present, "observed_but_missing_fresh_real_evidence");
  assert.equal(summary.observed_evidence_inputs_sanitized.real_model_load_evidence_present, "observed_but_missing_fresh_real_evidence");
  assert.equal(summary.observed_evidence_inputs_sanitized.model_loaded_evidence_present, "observed_but_missing_fresh_real_evidence");
  assert.equal(summary.observed_evidence_inputs_sanitized.scene_loaded_evidence_present, "observed_but_missing_fresh_real_evidence");
  assert.equal(summary.observed_evidence_inputs_sanitized.cue_capability_evidence_present, "observed_but_missing_fresh_real_evidence");
  assert.equal(summary.observed_evidence_inputs_sanitized.last_cue_applied_evidence_present, "observed_but_missing_fresh_real_evidence");
}

{
  const summary = createRendererReadyStaleEvidenceDowngradeContractSummary({
    fixture_evidence_present: true,
    manual_evidence_present: true,
    manifest_available: true,
    sse_connected: true,
    cue_accepted: true,
    fresh_heartbeat_evidence_present: true,
    real_model_load_evidence_present: true,
    last_cue_applied_evidence_present: true,
    renderer_ready_claimed: true,
    renderer_ready_candidate: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    checked_row_count: 22,
    motion_dataset_executable: true,
    trusted_loader_allowlist_enabled: true,
  });
  assertRendererReadyStaleEvidenceDowngradeContract(summary, {
    fixture_evidence_present: true,
    manual_evidence_present: true,
    manifest_available: true,
    sse_connected: true,
    cue_accepted: true,
    fresh_heartbeat_evidence_present: true,
    real_model_load_evidence_present: true,
    last_cue_applied_evidence_present: true,
  });
  assert.equal(summary.observed_stale_or_non_real_inputs_sanitized.fixture_evidence_present, "fixture_only_not_real_ready");
  assert.equal(summary.observed_stale_or_non_real_inputs_sanitized.manual_evidence_present, "manual_label_not_real_ready");
  assert.equal(summary.observed_stale_or_non_real_inputs_sanitized.manifest_available, "manifest_only_not_real_ready");
  assert.equal(summary.observed_stale_or_non_real_inputs_sanitized.sse_connected, "sse_only_not_real_ready");
  assert.equal(summary.observed_stale_or_non_real_inputs_sanitized.cue_accepted, "accepted_only_not_applied");
  assert.equal(summary.observed_stale_or_non_real_inputs_sanitized.fresh_heartbeat_evidence_present, "present_but_not_fresh");
  assert.equal(summary.observed_stale_or_non_real_inputs_sanitized.real_model_load_evidence_present, "present_but_not_fresh");
  assert.equal(summary.observed_stale_or_non_real_inputs_sanitized.last_cue_applied_evidence_present, "present_but_not_fresh");
}

for (const sourceType of LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_TYPES) {
  const summary = createRendererReadyEvidenceSourceAllowlistSummary({
    source_type: sourceType,
    renderer_ready_claimed: true,
    renderer_ready_candidate: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    checked_row_count: 23,
    motion_dataset_executable: true,
    trusted_loader_allowlist_enabled: true,
  });
  assertRendererReadyEvidenceSourceAllowlist(summary, { source_type: sourceType });
}

{
  const summary = createRendererReadyEvidenceSourceAllowlistSummary({
    source_type: "raw_renderer_payload_present",
    renderer_ready_claimed: true,
    renderer_ready_candidate: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    checked_row_count: 24,
    motion_dataset_executable: true,
    trusted_loader_allowlist_enabled: true,
  });
  assertRendererReadyEvidenceSourceAllowlist(summary, { source_type: "raw_renderer_payload_present" });
  assert.equal(JSON.stringify(summary).includes("raw_renderer_payload_present"), false);
}

{
  const summary = createRendererReadyEvidenceSchemaViolationGuardSummary({
    source_type: "rogue_source",
    raw_renderer_payload: true,
    raw_cue_payload: true,
    raw_model_path: true,
    raw_motion_path: true,
    endpoint: true,
    token: true,
    secret: true,
    private_path: true,
    actual_file_path_value: true,
    command_payload: true,
    owner_confirmation_created: true,
    owner_confirmation_confirmed: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    renderer_ready_claimed: true,
    renderer_ready_candidate: true,
    priority1_status: "RESOLVED",
    checked_row_count: 25,
    motion_dataset_executable: true,
    trusted_loader_allowlist_enabled: true,
  });
  assertRendererReadyEvidenceSchemaViolationGuard(summary, {
    hasViolation: true,
    unknown_source_type_rejected: true,
    unsafe_source_type_rejected: true,
    renderer_body_material_rejected: true,
    cue_body_material_rejected: true,
    model_locator_material_rejected: true,
    motion_locator_material_rejected: true,
    network_locator_material_rejected: true,
    auth_material_rejected: true,
    private_locator_material_rejected: true,
    shell_material_rejected: true,
    ready_promotion_field_rejected: true,
  });
  const serialized = JSON.stringify(summary);
  assert.equal(serialized.includes("rogue_source"), false);
  assert.equal(serialized.includes("raw_renderer_payload"), false);
  assert.equal(serialized.includes("raw_cue_payload"), false);
  assert.equal(serialized.includes("command_payload"), false);
}

{
  const summary = createRendererReadyEvidenceSchemaViolationGuardSummary({
    source_type: "fixture",
  });
  assertRendererReadyEvidenceSchemaViolationGuard(summary);
}

{
  const summary = createRendererReadyEvidenceCompletenessBlockerMatrixSummary({
    freshHeartbeatEvidencePresent: true,
    realModelLoadEvidencePresent: true,
    modelLoadedEvidencePresent: true,
    sceneLoadedEvidencePresent: true,
    cueCapabilityEvidencePresent: true,
    lastCueAppliedEvidencePresent: true,
    lastCueAppliedSuccessEvidencePresent: true,
    rendererReadyClaimed: true,
    rendererReadyCandidate: true,
    runtimeReadinessClaimed: true,
    productionReadinessClaimed: true,
    priority1Status: "RESOLVED",
    checkedRowCount: 26,
    motionDatasetExecutable: true,
    trustedLoaderAllowlistEnabled: true,
  });
  assertRendererReadyEvidenceCompletenessBlockerMatrix(summary);
  assert.equal(summary.observedInputLabelsSanitized.freshHeartbeat, "observed_but_required_matrix_still_blocked");
  assert.equal(summary.observedInputLabelsSanitized.realModelLoad, "observed_but_required_matrix_still_blocked");
  assert.equal(summary.observedInputLabelsSanitized.modelLoaded, "observed_but_required_matrix_still_blocked");
  assert.equal(summary.observedInputLabelsSanitized.sceneLoaded, "observed_but_required_matrix_still_blocked");
  assert.equal(summary.observedInputLabelsSanitized.cueCapability, "observed_but_required_matrix_still_blocked");
  assert.equal(summary.observedInputLabelsSanitized.lastCueApplied, "observed_but_required_matrix_still_blocked");
  assert.equal(summary.observedInputLabelsSanitized.lastCueAppliedSuccess, "observed_but_required_matrix_still_blocked");
}

for (const fixture of [
  {
    input: { freshHeartbeatEvidencePresent: true, realModelLoadEvidencePresent: false },
    labels: ["fresh_heartbeat_without_model_load", "conflicting_renderer_evidence"],
  },
  {
    input: { modelLoadedEvidencePresent: true, sceneLoadedEvidencePresent: false },
    labels: ["model_loaded_without_scene_loaded", "conflicting_renderer_evidence"],
  },
  {
    input: { cueCapabilityEvidencePresent: true, lastCueAppliedEvidencePresent: false },
    labels: ["cue_capability_without_last_cue_applied", "conflicting_renderer_evidence"],
  },
  {
    input: { lastCueAppliedEvidencePresent: true, lastCueAppliedSuccessEvidencePresent: false, lastCueAppliedEvidenceFresh: false },
    labels: ["last_cue_without_success", "stale_timestamp_downgraded", "conflicting_renderer_evidence"],
  },
  {
    input: { realProbeEvidencePresent: true, allRequiredEvidencePresent: false },
    labels: ["real_probe_label_without_required_evidence", "conflicting_renderer_evidence"],
  },
  {
    input: { rendererReadinessEvidenceFresh: true, sourceType: "fixture" },
    labels: ["fixture_source_with_fresh_claim", "conflicting_renderer_evidence"],
  },
  {
    input: { ownerConfirmationCreated: true, ownerConfirmationConfirmed: false },
    labels: ["owner_confirmation_incomplete", "conflicting_renderer_evidence"],
  },
  {
    input: { ownerConfirmationConfirmed: true, auditRefPresent: false },
    labels: ["owner_confirmation_incomplete", "conflicting_renderer_evidence"],
  },
  {
    input: { priority1Status: "RESOLVED", checkedRowCount: 0 },
    labels: ["priority1_resolution_without_checked_rows", "conflicting_renderer_evidence"],
  },
  {
    input: { checkedRowCount: 3, actualDataTaskStarted: false },
    labels: ["checked_rows_without_actual_data_task", "conflicting_renderer_evidence"],
  },
  {
    input: { motionDatasetExecutable: true, trustedLoaderAllowlistEnabled: false },
    labels: ["motion_executable_without_trusted_loader", "conflicting_renderer_evidence"],
  },
  {
    input: { futureEvidenceTime: true },
    labels: ["future_timestamp_rejected", "conflicting_renderer_evidence"],
  },
  {
    input: { staleEvidenceTime: true },
    labels: ["stale_timestamp_downgraded", "conflicting_renderer_evidence"],
  },
  {
    input: { sourceType: "manual_label" },
    labels: ["manual_label_is_not_real_ready", "conflicting_renderer_evidence"],
  },
]) {
  const summary = createRendererReadyEvidenceConflictDowngradeContractSummary(fixture.input);
  assertRendererReadyEvidenceConflictDowngradeContract(summary, fixture.labels);
}

{
  const summary = createRendererReadyGoNoGoBlockerSurfaceSummary();
  assertRendererReadyGoNoGoBlockerSurface(summary);
}

{
  const summary = createRendererReadyBlockerReasonAllowlistSummary();
  assertRendererReadyBlockerReasonAllowlist(summary);
  assert.equal(summary.rendererReadinessBlockerReasonAllowlist.includes("missing_required_renderer_evidence"), true);
  assert.equal(summary.rendererReadinessBlockerReasonAllowlist.includes("unsafe_unknown_blocker_reason"), true);
  assert.equal(JSON.stringify(summary).includes("unsafe_diagnostic_material"), false);
}

{
  const summary = createRendererReadySafeNextActionCatalogSummary();
  assertRendererReadySafeNextActionCatalog(summary);
  assert.equal(summary.safeNextActions.includes("keep_renderer_ready_false"), true);
  assert.equal(summary.safeNextActions.includes("keep_trusted_loader_disabled"), true);
  assert.equal(summary.actionExecutionStarted, false);
}

{
  const summary = createRendererReadyCrossSurfaceBlockerConsistencySummary();
  assertRendererReadyCrossSurfaceBlockerConsistency(summary);
  assert.equal(summary.surfacesChecked.includes("heartbeat"), true);
  assert.equal(summary.readinessFlagsConsistent, true);
}
