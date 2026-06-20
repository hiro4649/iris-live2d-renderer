import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  analyzeLive2dPlanningModuleBoundaries,
  buildLive2dPlanningModuleBoundaryReport,
} from "../scripts/check-live2d-planning-module-boundaries.mjs";
import * as live2d from "../src/renderer/cubismLoaderProvisioning.js";

const report = buildLive2dPlanningModuleBoundaryReport();
const baseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-core-baseline-v1.json", "utf8"));
const ownerGatesBaseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-owner-gates-baseline-v1.json", "utf8"));
const auditGatesBaseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-audit-gates-baseline-v1.json", "utf8"));
const parserAuditStubsBaseline = JSON.parse(readFileSync("test/fixtures/planning/motion-dataset-parser-audit-stubs-baseline-v1.json", "utf8"));

assert.equal(report.schema, "live2d_planning_module_boundary_report_v3");
assert.equal(report.status, "pass");
assert.equal(report.failureCount, 0);
assert.equal(report.duplicateDefinitionCount, 0);
assert.equal(report.cycleCount, 0);
assert.equal(report.scannedPlanningFileCount >= 9, true);
assert.equal(report.unregisteredPlanningModuleCount, 0);
assert.equal(report.planningMonolithImportStatus, "facade_compatibility_allowed_before_queue_c1");
assert.equal(report.physicallyExtractedModulesImportingMonolithCount, 0);
assert.equal(report.unknownDependencyCount, 0);
assert.equal(report.missingDeclaredDependencyCount, 0);
assert.equal(report.staleDeclaredDependencyCount, 0);
assert.equal(report.actualDependencyMismatchCount, 0);
assert.equal(report.crossDomainDependencyViolationCount, 0);
assert.equal(report.kindMismatchCount, 0);
assert.equal(report.currentDomainMismatchCount, 0);
assert.equal(report.actualPhysicalMoveMismatchCount, 0);
assert.equal(report.facadeMetadataMismatchCount, 0);
assert.deepEqual(report.facadeMetadataMismatches, []);
assert.equal(report.nonFacadeSymbolWithFacadeFileCount, 0);
assert.deepEqual(report.nonFacadeSymbolWithFacadeFileNames, []);
assert.equal(report.requiredFacadeSymbolWithoutFacadeFileCount, 0);
assert.deepEqual(report.requiredFacadeSymbolWithoutFacadeFileNames, []);
assert.equal(report.multipleFacadeExportCount, 0);
assert.deepEqual(report.multipleFacadeExports, []);
assert.equal(report.entries.length, report.symbolCount);

const movedSymbols = new Map([
  ["LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES", "src/renderer/planning/sharedMotionCatalog.js"],
  ["LIVE2D_EXPERIMENTAL_MOTION_LABELS", "src/renderer/planning/sharedMotionCatalog.js"],
  ["LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS", "src/renderer/planning/motionDatasetPlanningSafety.js"],
  ["LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_UX_AUDIT_AXES", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["createMotionDatasetRowSchemaPreflightSummary", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["createMotionDatasetSyntheticRowFixturePackSummary", "src/renderer/planning/motionDatasetPlanningCore.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetRealRowIntakeRequestPacketSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetRealRowIntakeDryRunValidatorSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetOwnerRowDataSubmissionPacketSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["createMotionDatasetOwnerRowDataMetadataValidatorStubSummary", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["createMotionDatasetRealRowAuditManifestSummary", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["createMotionDatasetRealRowRedactionScannerFixturePackSummary", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["createMotionDatasetRealRowEvidenceLinkManifestSummary", "src/renderer/planning/motionDatasetAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REJECTION_REASONS", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SAFE_PUBLIC_REJECTION_REASONS", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_ACCEPTED_CASES", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_INPUT_ATTEMPT_CASES", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REQUIRED_EVENT_FIELDS", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REDACTION_POLICY", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_INPUTS", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_OUTPUTS", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["createMotionDatasetRowBodyParserContractStubSummary", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["createMotionDatasetRowBodyParserRejectionFixturePackSummary", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["createMotionDatasetIngestionAuditTrailStubSummary", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["createMotionDatasetIngestionRollbackPlanStubSummary", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["createMotionDatasetParserDryRunEnvelopeSummary", "src/renderer/planning/motionDatasetParserAuditStubs.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_REVIEW_SECTIONS", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_CONFIRMATION_SCOPES", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_METADATA_LABELS", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_FUTURE_REFS", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_ACCEPTED_CASES", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_REJECTED_ATTEMPT_CASES", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_ATTEMPT_CASES", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary", "src/renderer/planning/motionDatasetOwnerHandoffGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_FILE_FORMATS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_HASH_ALGORITHMS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_CONFIRMATION_SCOPES", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_FILE_SHAPE", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_ITEMS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_ACCEPTED_REQUEST_FIXTURE_CASES", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS", "src/renderer/planning/motionDatasetOwnerGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_CRITERIA_CHECKLIST_SCHEMA", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REVIEW_PACKET_SCHEMA", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_PROJECTION_SCHEMA", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_LEDGER_SCHEMA", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_BLOCKER_GATE_SCHEMA", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_CRITERIA", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_REJECTION_CRITERIA", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_REVIEW_SECTIONS", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_CONFIRMATION_SCOPES", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_REASONS", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_SAFE_NEXT_ACTIONS", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_READY_PREREQUISITE_LABELS", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_MISSING_PREREQUISITE_LABELS", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_REQUIRED_BLOCKERS", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_CLEARANCE_CONDITIONS", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["createMotionDatasetActualDataNoGoSummaryProjectionSummary", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["createMotionDatasetOwnerSubmissionReadinessLedgerSummary", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["createMotionDatasetFinalActualDataPreauthBlockerGateSummary", "src/renderer/planning/motionDatasetActualDataPreauthGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_ENVELOPE_SCHEMA", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_SCOPES", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_EVIDENCE_REFS", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_OWNER_ITEMS", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_SYSTEM_ITEMS", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_COMPLETED_ARTIFACTS", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_UNRESOLVED_BLOCKERS", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["createMotionDatasetOwnerWaitStatePacketSummary", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["createMotionDatasetPlanningCompletionReviewPacketSummary", "src/renderer/planning/motionDatasetOwnerConfirmationWaitGates.js"],
  ["LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_MANIFEST_SCHEMA", "src/renderer/planning/motionDatasetChecksumPreflight.js"],
  ["LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_HASH_METADATA_LABELS", "src/renderer/planning/motionDatasetChecksumPreflight.js"],
  ["LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS", "src/renderer/planning/motionDatasetChecksumPreflight.js"],
  ["LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_FILE_IDENTITY_LABELS", "src/renderer/planning/motionDatasetChecksumPreflight.js"],
  ["LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_OWNER_CONFIRMATION_REFS", "src/renderer/planning/motionDatasetChecksumPreflight.js"],
  ["createMotionDatasetRowFileChecksumPreflightManifestSummary", "src/renderer/planning/motionDatasetChecksumPreflight.js"],
  ["LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_BLOCKER_VISIBILITY", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_RESOLUTION_PREREQUISITES", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_BLOCKERS", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FUTURE_PREREQUISITES", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_MISSING_BLOCKER_CHECKS", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["createMotionDatasetActualDataTaskEntryGateSummary", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["createMotionDatasetRealRowFinalDryRunChecklistSummary", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["createMotionDatasetRealRowGoNoGoBlockerMapSummary", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["createMotionDatasetRealRowMissingDataFailClosedGateSummary", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
  ["createMotionDatasetRealRowPreIngestionReviewPacketSummary", "src/renderer/planning/motionDatasetOwnerNoGoGates.js"],
]);

assert.equal(report.physicalMovedExportCount, movedSymbols.size);
assert.equal(report.auditedSymbolCount, movedSymbols.size);
assert.equal(report.pendingSymbolCount, report.symbolCount - report.auditedSymbolCount);
assert.equal(report.extractedLegacyPublicSymbolCount, movedSymbols.size);
assert.equal(report.manifestedExtractedLegacyPublicSymbolCount, movedSymbols.size);
assert.equal(report.unregisteredExtractedLegacyPublicSymbolCount, 0);
assert.deepEqual(report.unregisteredExtractedLegacyPublicSymbols, []);
assert.equal(report.manifestedButNotLegacyPublicCount, 0);
assert.deepEqual(report.manifestedButNotLegacyPublicSymbols, []);
assert.equal(report.facadeManifestMismatchCount, 0);
assert.deepEqual(report.facadeManifestMismatches, []);
assert.equal(report.facadePublicSymbolCount, Object.values(report.facadePublicNamesByFile).reduce((count, names) => count + names.length, 0));
assert.equal(report.internalPlanningExportCount >= 3, true);

for (const entry of report.entries) {
  assert.equal(entry.actualDefinitionFile, movedSymbols.get(entry.name) ?? "src/renderer/cubismLoaderProvisioning.js");
  assert.equal(entry.definitionCount, 1);
  assert.equal(entry.duplicateDefinitionCount, 0);
  assert.equal(entry.legacyExportRequired, true);
  assert.equal(entry.legacyExportPresent, true);
  if (entry.facadeExportRequired) {
    assert.equal(entry.facadeExportPresent, true);
  }
  assert.equal(entry.physicalMoveStatus, movedSymbols.has(entry.name) ? "physically_moved" : "not_moved");
  assert.equal(entry.actualPhysicalMoveStatus, movedSymbols.has(entry.name) ? "physically_moved" : "not_moved");
  assert.equal(entry.dependencyAuditStatus, movedSymbols.has(entry.name) ? "audited" : "pending");
  assert.equal(Array.isArray(entry.dependencies), true);
}

assert.deepEqual(
  report.entries.find((entry) => entry.name === "createMotionDatasetRowSchemaPreflightSummary").actualManifestDependencies,
  [
    "LIVE2D_EXPERIMENTAL_MOTION_LABELS",
    "LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS",
    "LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA",
    "LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS",
    "LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA",
    "LIVE2D_MOTION_DATASET_UX_AUDIT_AXES",
    "LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES",
  ],
);

assert.equal(baseline.schema, "live2d_motion_dataset_core_baseline_v1");
assert.equal(baseline.safety.syntheticInputsOnly, true);
assert.equal(baseline.safety.actualDataRead, false);
assert.equal(baseline.safety.runtimeReadinessClaimed, false);
assert.equal(baseline.safety.productionReadinessClaimed, false);
assert.equal(
  baseline.factories.createMotionDatasetRowSchemaPreflightSummary.default_input.behavior,
  "return",
);
assert.equal(
  baseline.factories.createMotionDatasetSyntheticRowFixturePackSummary.default_input.behavior,
  "return",
);
assert.deepEqual(
  baseline.factories.createMotionDatasetRowSchemaPreflightSummary.default_input.keys,
  Object.keys(baseline.factories.createMotionDatasetRowSchemaPreflightSummary.default_input.object),
);
assert.deepEqual(
  baseline.factories.createMotionDatasetSyntheticRowFixturePackSummary.default_input.keys,
  Object.keys(baseline.factories.createMotionDatasetSyntheticRowFixturePackSummary.default_input.object),
);

for (const [name, expected] of Object.entries(baseline.constants)) {
  assert.deepEqual(live2d[name], expected.value, `constant value changed: ${name}`);
  if (live2d[name] && typeof live2d[name] === "object") {
    assert.deepEqual(Object.keys(live2d[name]), expected.keys, `constant keys changed: ${name}`);
    assert.equal(JSON.stringify(live2d[name]), expected.json, `constant json changed: ${name}`);
    assert.equal(Object.isFrozen(live2d[name]), expected.objectIsFrozen, `constant freeze status changed: ${name}`);
  }
}

for (const [factoryName, cases] of Object.entries(baseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const value = caseName === "default_input"
      ? live2d[factoryName]()
      : live2d[factoryName](inputForBaselineCase(caseName));
    assert.equal(expected.behavior, "return", `baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keys, `factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value), expected.json, `factory json changed: ${factoryName}:${caseName}`);
  }
}

assert.equal(ownerGatesBaseline.schema, "live2d_motion_dataset_owner_gates_baseline_v1");
assert.equal(ownerGatesBaseline.safety.syntheticInputsOnly, true);
assert.equal(ownerGatesBaseline.safety.actualDataRead, false);
assert.equal(ownerGatesBaseline.safety.actualFileRead, false);
assert.equal(ownerGatesBaseline.safety.actualHashCalculated, false);
assert.equal(ownerGatesBaseline.safety.actualIngestionAllowed, false);
assert.equal(ownerGatesBaseline.safety.runtimeReadinessClaimed, false);
assert.equal(ownerGatesBaseline.safety.productionReadinessClaimed, false);
assert.equal(ownerGatesBaseline.safety.ownerConfirmationCreated, false);
assert.equal(ownerGatesBaseline.safety.trustedLoaderEnabled, false);
assert.equal(ownerGatesBaseline.safety.priority1Status, "BLOCKED");
assert.equal(ownerGatesBaseline.safety.checkedRowCount, 0);
assert.equal(ownerGatesBaseline.safety.motionDatasetExecutable, false);

for (const [factoryName, cases] of Object.entries(ownerGatesBaseline.factories)) {
  for (const [caseName, expected] of Object.entries(cases)) {
    const input = caseName === "default_input" ? undefined : inputForOwnerGatesBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = caseName === "default_input" ? live2d[factoryName]() : live2d[factoryName](input);
    assert.equal(expected.behavior, "return", `owner gate baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.object, `owner gate factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keys, `owner gate factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value), expected.json, `owner gate factory json changed: ${factoryName}:${caseName}`);
    assert.deepEqual(input, before, `owner gate factory mutated input: ${factoryName}:${caseName}`);
  }
}

assert.equal(auditGatesBaseline.schema, "live2d_motion_dataset_audit_gates_baseline_v1");
assert.equal(auditGatesBaseline.safety.syntheticInputsOnly, true);
assert.equal(auditGatesBaseline.safety.actualDataRead, false);
assert.equal(auditGatesBaseline.safety.actualFileRead, false);
assert.equal(auditGatesBaseline.safety.actualPathRead, false);
assert.equal(auditGatesBaseline.safety.actualHashCalculated, false);
assert.equal(auditGatesBaseline.safety.sourceHashVerified, false);
assert.equal(auditGatesBaseline.safety.declaredRowCountChecked, false);
assert.equal(auditGatesBaseline.safety.parserExecution, false);
assert.equal(auditGatesBaseline.safety.redactionScanExecution, false);
assert.equal(auditGatesBaseline.safety.auditExecution, false);
assert.equal(auditGatesBaseline.safety.actualIngestionAllowed, false);
assert.equal(auditGatesBaseline.safety.ownerConfirmationCreated, false);
assert.equal(auditGatesBaseline.safety.runtimeReadinessClaimed, false);
assert.equal(auditGatesBaseline.safety.productionReadinessClaimed, false);
assert.equal(auditGatesBaseline.safety.trustedLoaderEnabled, false);
assert.equal(auditGatesBaseline.safety.priority1Status, "BLOCKED");
assert.equal(auditGatesBaseline.safety.checkedRowCount, 0);
assert.equal(auditGatesBaseline.safety.motionDatasetExecutable, false);

for (const [name, expected] of Object.entries(auditGatesBaseline.constants)) {
  assert.deepEqual(Array.isArray(live2d[name]) ? [...live2d[name]] : live2d[name], expected, `audit gate constant changed: ${name}`);
  if (Array.isArray(live2d[name])) {
    assert.equal(Object.isFrozen(live2d[name]), auditGatesBaseline.frozen[name], `audit gate constant freeze changed: ${name}`);
  }
}

for (const [caseName, factories] of Object.entries(auditGatesBaseline.cases)) {
  for (const [factoryName, expected] of Object.entries(factories)) {
    const input = caseName === "default_input" ? undefined : inputForAuditGatesBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = caseName === "default_input" ? live2d[factoryName]() : live2d[factoryName](input);
    assert.equal(expected.status, "returned", `audit gate baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.value, `audit gate factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keys, `audit gate factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value), expected.json, `audit gate factory json changed: ${factoryName}:${caseName}`);
    assert.equal(expected.inputMutated, false, `audit gate baseline recorded mutation: ${factoryName}:${caseName}`);
    assert.deepEqual(input, before, `audit gate factory mutated input: ${factoryName}:${caseName}`);
  }
}

assert.equal(parserAuditStubsBaseline.schema, "live2d_motion_dataset_parser_audit_stubs_baseline_v1");
assert.equal(parserAuditStubsBaseline.safety.syntheticInputsOnly, true);
assert.equal(parserAuditStubsBaseline.safety.actualDataRead, false);
assert.equal(parserAuditStubsBaseline.safety.actualFileRead, false);
assert.equal(parserAuditStubsBaseline.safety.actualIngestionAllowed, false);
assert.equal(parserAuditStubsBaseline.safety.parserExecution, false);
assert.equal(parserAuditStubsBaseline.safety.auditExecution, false);
assert.equal(parserAuditStubsBaseline.safety.priority1Status, "BLOCKED");
assert.equal(parserAuditStubsBaseline.safety.checkedRowCount, 0);
assert.equal(parserAuditStubsBaseline.safety.motionDatasetExecutable, false);

for (const [name, expected] of Object.entries(parserAuditStubsBaseline.constants)) {
  assert.deepEqual(Array.isArray(live2d[name]) ? [...live2d[name]] : live2d[name], expected, `parser audit constant changed: ${name}`);
  if (Array.isArray(live2d[name])) {
    assert.equal(Object.isFrozen(live2d[name]), parserAuditStubsBaseline.frozen[name], `parser audit constant freeze changed: ${name}`);
  }
}

for (const [caseName, factories] of Object.entries(parserAuditStubsBaseline.cases)) {
  for (const [factoryName, expected] of Object.entries(factories)) {
    const input = caseName === "default_input" ? undefined : inputForParserAuditStubsBaselineCase(caseName);
    const before = input === undefined ? undefined : structuredClone(input);
    const value = caseName === "default_input" ? live2d[factoryName]() : live2d[factoryName](input);
    assert.equal(expected.status, "returned", `parser audit baseline expected return: ${factoryName}:${caseName}`);
    assert.deepEqual(value, expected.value, `parser audit factory object changed: ${factoryName}:${caseName}`);
    assert.deepEqual(Object.keys(value), expected.keys, `parser audit factory key order changed: ${factoryName}:${caseName}`);
    assert.equal(JSON.stringify(value), expected.json, `parser audit factory json changed: ${factoryName}:${caseName}`);
    assert.equal(expected.inputMutated, false, `parser audit baseline recorded mutation: ${factoryName}:${caseName}`);
    assert.deepEqual(input, before, `parser audit factory mutated input: ${factoryName}:${caseName}`);
  }
}

function inputForBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    supported_motion_style: { motion_style: "talk" },
    experimental_motion_label: { motion_style: "blink_attention" },
    unsupported_motion_style: { motion_style: "unsupported_safe_label" },
    unsafe_field_name_attempt_without_secret_values: { raw_dataset_row_body: "safe_redacted_label" },
    checked_row_count_attempt: { checked_row_count: 1 },
    execution_attempt: { motion_dataset_executable: true, execute_motion: true },
    readiness_attempt: { renderer_ready: true, runtime_readiness_claimed: true, production_readiness_claimed: true },
    owner_confirmation_attempt: { owner_confirmation_created: true, owner_confirmation_confirmed: true },
    trusted_loader_attempt: { trusted_loader_allowlist_enabled: true, loader_trusted: true },
  }[caseName];
}

function inputForOwnerGatesBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_metadata_labels_only: {
      request_id: "safe_request_label",
      dataset_name: "safe_dataset_label",
      requested_file_format: "jsonl",
      expected_row_count: 10,
      dataset_split_plan: "safe_split_label",
      source_file_label: "safe_file_label",
      source_hash: "safe_hash_label",
      audit_run_id: "safe_audit_label",
      auditor_version: "safe_auditor_label",
      owner_confirmation_required: true,
      redaction_policy_ref: "safe_redaction_label",
    },
    unsupported_format: { requested_file_format: "unsupported_safe_label" },
    unsafe_material_attempt: { raw_dataset_row_body: "safe_redacted_label" },
    file_read_attempt: { actual_file_path_value: "safe_redacted_label", file_content_read: true },
    hash_calculation_attempt: { actual_hash_calculated: true },
    submission_acceptance_attempt: { owner_submission_received: true, owner_submission_accepted: true },
    checked_row_count_attempt: { checked_row_count: 1 },
    ingestion_attempt: { actual_ingestion_allowed: true, ingest_rows: true },
    execution_attempt: { motion_dataset_executable: true, execute_motion: true },
    readiness_attempt: { renderer_ready: true, runtime_readiness_claimed: true, production_readiness_claimed: true },
    owner_confirmation_attempt: { owner_confirmation_created: true, owner_confirmation_confirmed: true },
    trusted_loader_attempt: { trusted_loader_allowlist_enabled: true, loader_trusted: true },
    priority_resolution_attempt: { priority1_status: "RESOLVED", priority1_resolved: true, go_nogo_status: "go" },
  }[caseName];
}

function inputForAuditGatesBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_metadata_labels_only: {
      audit_run_label: "safe_audit_run_label",
      dataset_version_label: "safe_dataset_version_label",
      accepted_redaction_fixture_cases: ["metadata_label_only"],
      rejected_redaction_fixture_cases: ["raw_dataset_row_body_rejected"],
    },
    checked_row_count_attempt: { checked_row_count: 1 },
    audit_execution_attempt: { audit_execution_requested: true, future_real_row_audit_status: "complete" },
    redaction_execution_attempt: { redaction_scan_execution_requested: true, future_real_redaction_scan_ref: "safe_redacted_label" },
    actual_ingestion_attempt: { actual_ingestion_allowed: true, real_row_data_present: true },
    row_body_read_attempt: { row_body_read: true, raw_dataset_row_body: "safe_redacted_label" },
    file_read_attempt: {
      file_content_read: true,
      actual_file_content: "safe_redacted_label",
      actual_file_path_value: "safe_redacted_label",
    },
    real_evidence_claim_attempt: { real_evidence_present: true, future_fresh_resident_evidence_status: "present" },
    owner_confirmation_attempt: {
      owner_confirmation_created: true,
      owner_confirmation_confirmed: true,
      owner_confirmation_status: "confirmed",
    },
    readiness_attempt: {
      renderer_ready: true,
      model_loaded: true,
      scene_loaded: true,
      browser_cue_delivery_ready: true,
      runtime_readiness_claimed: true,
      production_readiness_claimed: true,
    },
    priority_resolution_attempt: { priority1_status: "RESOLVED", priority1_resolved: true, blocker_resolved: true },
    go_attempt: { go_nogo_status: "go", go_candidate: true },
    trusted_loader_attempt: {
      trusted_loader_allowlist_enabled: true,
      trustedLoaderAllowlistEnabled: true,
      loader_trusted: true,
    },
    unsafe_field_name_attempt_with_redacted_placeholder: {
      future_real_row_file_ref: "safe_redacted_label",
      future_real_row_audit_ref: "safe_redacted_label",
      future_owner_confirmation_ref: "safe_redacted_label",
      owner_private_note: "safe_redacted_label",
      raw_owner_confirmation_note: "safe_redacted_label",
      actual_file_path_value: "safe_redacted_label",
      actual_file_content: "safe_redacted_label",
      raw_dataset_row_body: "safe_redacted_label",
    },
  }[caseName];
}

function inputForParserAuditStubsBaselineCase(caseName) {
  return {
    null_input: null,
    non_object_input: "safe_non_object_label",
    safe_metadata_labels_only: { request_label: "safe_request_label" },
    parser_execution_attempt: {
      row_body_parser_enabled: true,
      row_body_parser_executed: true,
      parser_dry_run_executed: true,
    },
    row_body_read_attempt: { row_body_read: true, raw_dataset_row_body: "safe_redacted_label" },
    actual_file_read_attempt: {
      actual_file_read: true,
      actual_file_content: "safe_redacted_label",
      actual_file_path_value: "safe_redacted_label",
    },
    actual_ingestion_attempt: {
      actual_ingestion_allowed: true,
      actual_data_task_started: true,
      real_ingestion_audit_event_created: true,
    },
    readiness_attempt: { runtime_readiness_claimed: true, production_readiness_claimed: true, renderer_ready: true },
    owner_confirmation_attempt: { owner_confirmation_confirmed: true, owner_confirmation_status: "confirmed" },
    priority_resolution_attempt: { priority1_status: "RESOLVED", priority1_resolved: true, blocker_resolved: true },
    go_attempt: { go_nogo_status: "go", go_candidate: true },
    motion_execution_attempt: { motion_dataset_executable: true, motion_execution_enabled: true },
  }[caseName];
}

const baseManifest = {
  symbols: [
    {
      name: "A_SYMBOL",
      kind: "constant",
      definitionFile: "src/renderer/cubismLoaderProvisioning.js",
      currentDomain: "actual_loader_core",
      targetDomain: "motion_dataset",
      facadeFile: "src/renderer/planning/motionDatasetPlanningSummaries.js",
      legacyExportRequired: true,
      dependencies: [],
      sharedDependencyGroup: "none",
      facadeExportRequired: true,
      dependencyAuditStatus: "pending",
      physicalMoveStatus: "not_moved",
    },
  ],
};

const baseSources = {
  "src/renderer/cubismLoaderProvisioning.js": "export const A_SYMBOL = Object.freeze([]);\n",
  "src/renderer/planning/motionDatasetPlanningSummaries.js": "export { A_SYMBOL } from \"../cubismLoaderProvisioning.js\";\n",
};

function syntheticReport(mutator) {
  const manifest = structuredClone(baseManifest);
  const sourceTexts = { ...baseSources };
  mutator({ manifest, sourceTexts });
  return analyzeLive2dPlanningModuleBoundaries({ manifest, sourceTexts });
}

assert.equal(syntheticReport(() => {}).status, "pass");

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/extra.js"] = "export const A_SYMBOL = 1;\n";
  }).failures.join("\n"),
  /duplicate_definition:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "";
  }).failures.join("\n"),
  /missing_definition:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "const A_SYMBOL = Object.freeze([]);\n";
  }).failures.join("\n"),
  /legacy_export_missing:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] = "export {};\n";
  }).failures.join("\n"),
  /facade_export_missing:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].dependencies = ["UNKNOWN_SYMBOL"];
  }).failures.join("\n"),
  /unknown_dependency:A_SYMBOL:UNKNOWN_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].dependencyAuditStatus = "audited";
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "export const B_SYMBOL = 1;\nexport const A_SYMBOL = B_SYMBOL;\n";
    manifest.symbols.push({
      ...manifest.symbols[0],
      name: "B_SYMBOL",
      dependencies: [],
    });
  }).failures.join("\n"),
  /missing_declared_dependency:A_SYMBOL:B_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].dependencyAuditStatus = "audited";
    manifest.symbols.push({
      ...manifest.symbols[0],
      name: "B_SYMBOL",
      dependencies: [],
    });
    manifest.symbols[0].dependencies = ["B_SYMBOL"];
  }).failures.join("\n"),
  /stale_declared_dependency:A_SYMBOL:B_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].kind = "factory";
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "export const A_SYMBOL = Object.freeze([]);\n";
  }).failures.join("\n"),
  /kind_mismatch:A_SYMBOL:constant:factory/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].currentDomain = "motion_dataset";
  }).failures.join("\n"),
  /current_domain_mismatch:A_SYMBOL:actual_loader_core:motion_dataset/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols.push({
      ...manifest.symbols[0],
      name: "B_SYMBOL",
      targetDomain: "renderer_readiness",
      dependencies: [],
    });
    manifest.symbols[0].dependencies = ["B_SYMBOL"];
  }).failures.join("\n"),
  /forbidden_cross_domain_dependency:A_SYMBOL:B_SYMBOL/,
);

assert.equal(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].facadeExportRequired = false;
    manifest.symbols[0].facadeFile = null;
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] = "export {};\n";
  }).status,
  "pass",
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].facadeExportRequired = false;
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] = "export {};\n";
  }).failures.join("\n"),
  /facade_file_present_for_non_facade_symbol:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].facadeFile = null;
  }).failures.join("\n"),
  /facade_file_missing_for_required_facade_symbol:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].facadeFile = "src/renderer/cubismLoaderProvisioning.js";
  }).failures.join("\n"),
  /facade_file_not_planning_summary:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].facadeFile = "src/renderer/planning/notASummary.js";
  }).failures.join("\n"),
  /facade_file_not_planning_summary:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] = "export {};\n";
  }).failures.join("\n"),
  /facade_export_missing:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].facadeExportRequired = false;
    manifest.symbols[0].facadeFile = null;
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] = "export { A_SYMBOL } from \"../cubismLoaderProvisioning.js\";\n";
  }).failures.join("\n"),
  /facade_export_present_for_non_facade_symbol:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.moduleRegistry = {
      "src/renderer/planning/otherSummaries.js": "motion_dataset",
    };
    sourceTexts["src/renderer/planning/otherSummaries.js"] = "export { A_SYMBOL } from \"../cubismLoaderProvisioning.js\";\n";
  }).failures.join("\n"),
  /facade_export_present_in_multiple_facades:A_SYMBOL/,
);

assert.equal(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = [
      "export const A_SYMBOL = (input = {}) => {",
      "  const B_SYMBOL = input.B_SYMBOL;",
      "  return Boolean(B_SYMBOL);",
      "};",
    ].join("\n");
  }).status,
  "pass",
);

assert.equal(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = [
      "// import \"./fake-cycle.js\";",
      "export const A_SYMBOL = \"import './fake-cycle.js'\";",
    ].join("\n");
  }).cycleCount,
  0,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/core.js"] = "import { A_SYMBOL } from \"../cubismLoaderProvisioning.js\";\nexport const CORE_SYMBOL = A_SYMBOL;\n";
  }).failures.join("\n"),
  /planning_core_imports_monolith:src\/renderer\/planning\/core\.js/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/a.js"] = "import \"./b.js\";\nexport const A = 1;\n";
    sourceTexts["src/renderer/planning/b.js"] = "import \"./a.js\";\nexport const B = 1;\n";
  }).failures.join("\n"),
  /module_cycle:/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/a.js"] = "import \"./b.js\";\nexport const A = 1;\n";
    sourceTexts["src/renderer/planning/b.js"] = "import \"./c.js\";\nexport const B = 1;\n";
    sourceTexts["src/renderer/planning/c.js"] = "import \"./a.js\";\nexport const C = 1;\n";
  }).failures.join("\n"),
  /module_cycle:/,
);

assert.match(
  syntheticReport(({ manifest }) => {
    manifest.symbols[0].physicalMoveStatus = "physically_moved";
  }).failures.join("\n"),
  /actual_physical_move_mismatch:A_SYMBOL:not_moved:physically_moved/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    manifest.symbols[0].definitionFile = "src/renderer/planning/motionDatasetPlanningCore.js";
    manifest.symbols[0].currentDomain = "motion_dataset";
    manifest.symbols[0].physicalMoveStatus = "physically_moved";
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] = "export { A_SYMBOL } from \"./planning/motionDatasetPlanningCore.js\";\n";
    sourceTexts["src/renderer/planning/motionDatasetPlanningCore.js"] = "export const A_SYMBOL = Object.freeze([]);\n";
  }).failures.join("\n"),
  /pending_dependency_audit_for_physical_move:A_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/unregistered.js"] = "export const UNREGISTERED_SYMBOL = 1;\n";
  }).failures.join("\n"),
  /unregistered_planning_module:src\/renderer\/planning\/unregistered\.js/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/motionDatasetPlanningCore.js"] = "export const B_SYMBOL = Object.freeze([]);\n";
    sourceTexts["src/renderer/cubismLoaderProvisioning.js"] += "export { B_SYMBOL } from \"./planning/motionDatasetPlanningCore.js\";\n";
  }).failures.join("\n"),
  /unregistered_extracted_legacy_public_symbol:B_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    sourceTexts["src/renderer/planning/motionDatasetPlanningCore.js"] = "export const B_SYMBOL = Object.freeze([]);\n";
    manifest.symbols.push({
      ...manifest.symbols[0],
      name: "B_SYMBOL",
      definitionFile: "src/renderer/planning/motionDatasetPlanningCore.js",
      currentDomain: "motion_dataset",
      physicalMoveStatus: "physically_moved",
      facadeExportRequired: false,
      facadeFile: null,
      dependencyAuditStatus: "audited",
      dependencies: [],
    });
  }).failures.join("\n"),
  /manifested_legacy_public_symbol_missing_from_inventory:B_SYMBOL/,
);

assert.match(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] += "export { B_SYMBOL } from \"./motionDatasetPlanningCore.js\";\n";
    sourceTexts["src/renderer/planning/motionDatasetPlanningCore.js"] = "export const B_SYMBOL = Object.freeze([]);\n";
  }).failures.join("\n"),
  /facade_manifest_mismatch:B_SYMBOL/,
);

assert.match(
  syntheticReport(({ manifest, sourceTexts }) => {
    sourceTexts["src/renderer/planning/motionDatasetPlanningSummaries.js"] += "export { A_SYMBOL } from \"./motionDatasetPlanningCore.js\";\n";
    manifest.symbols[0].facadeExportRequired = false;
  }).failures.join("\n"),
  /facade_manifest_mismatch:A_SYMBOL/,
);

assert.equal(
  syntheticReport(({ sourceTexts }) => {
    sourceTexts["src/renderer/planning/motionDatasetPlanningSafety.js"] = "export const INTERNAL_HELPER_SYMBOL = 1;\n";
  }).internalPlanningExports.some((entry) => entry.name === "INTERNAL_HELPER_SYMBOL"),
  true,
);

console.log("planning-module-boundaries: pass");
