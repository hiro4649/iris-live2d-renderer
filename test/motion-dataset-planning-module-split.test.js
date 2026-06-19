import assert from "node:assert/strict";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import * as motionDatasetAuditStubs from "../src/renderer/planning/motionDatasetAuditStubs.js";
import * as motionDatasetPlanning from "../src/renderer/planning/motionDatasetPlanningSummaries.js";
import * as motionDatasetParserAuditStubs from "../src/renderer/planning/motionDatasetParserAuditStubs.js";

const MOTION_DATASET_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA",
  "LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA",
  "LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA",
  "LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA",
  "LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA",
  "LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA",
  "LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA",
  "LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA",
  "LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA",
  "LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS",
  "LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES",
  "LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES",
  "LIVE2D_MOTION_DATASET_UX_AUDIT_AXES",
  "LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES",
  "LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES",
  "LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS",
  "LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES",
  "LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS",
  "LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REJECTION_REASONS",
  "LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS",
  "createMotionDatasetRowSchemaPreflightSummary",
  "createMotionDatasetSyntheticRowFixturePackSummary",
  "createMotionDatasetRealRowIntakeRequestPacketSummary",
  "createMotionDatasetRealRowIntakeDryRunValidatorSummary",
  "createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary",
  "createMotionDatasetRealRowAuditManifestSummary",
  "createMotionDatasetRealRowRedactionScannerFixturePackSummary",
  "createMotionDatasetOwnerRowDataSubmissionPacketSummary",
  "createMotionDatasetOwnerRowDataMetadataValidatorStubSummary",
  "createMotionDatasetActualDataTaskEntryGateSummary",
  "createMotionDatasetRowBodyParserContractStubSummary",
  "createMotionDatasetRowBodyParserRejectionFixturePackSummary",
  "createMotionDatasetIngestionAuditTrailStubSummary",
  "createMotionDatasetIngestionRollbackPlanStubSummary",
  "createMotionDatasetParserDryRunEnvelopeSummary",
  "createMotionDatasetOwnerWaitStatePacketSummary",
  "createMotionDatasetPlanningCompletionReviewPacketSummary",
]);

for (const name of MOTION_DATASET_EXPORTS) {
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy export missing ${name}`);
  assert.equal(Object.hasOwn(motionDatasetPlanning, name), true, `planning export missing ${name}`);
  assert.equal(motionDatasetPlanning[name], legacyProvisioning[name], `export identity mismatch ${name}`);
}

const summaryFactories = MOTION_DATASET_EXPORTS.filter((name) => name.startsWith("create"));
for (const name of summaryFactories) {
  const legacySummary = legacyProvisioning[name]();
  const planningSummary = motionDatasetPlanning[name]();
  assert.deepEqual(planningSummary, legacySummary, `summary parity mismatch ${name}`);
  assert.equal(JSON.stringify(planningSummary).includes("runtime_readiness_claimed\":true"), false);
  assert.equal(JSON.stringify(planningSummary).includes("production_readiness_claimed\":true"), false);
  assert.equal(JSON.stringify(planningSummary).includes("motion_dataset_executable\":true"), false);
}

const AUDIT_STUB_DIRECT_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA",
  "LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES",
  "LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES",
  "LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES",
  "createMotionDatasetRealRowAuditManifestSummary",
  "createMotionDatasetRealRowRedactionScannerFixturePackSummary",
  "createMotionDatasetRealRowEvidenceLinkManifestSummary",
]);

for (const name of AUDIT_STUB_DIRECT_EXPORTS) {
  assert.equal(Object.hasOwn(motionDatasetAuditStubs, name), true, `audit module export missing ${name}`);
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy audit export missing ${name}`);
  assert.equal(motionDatasetAuditStubs[name], legacyProvisioning[name], `audit legacy identity mismatch ${name}`);
}

for (const name of [
  "LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS",
  "LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES",
  "createMotionDatasetRealRowEvidenceLinkManifestSummary",
]) {
  assert.equal(Object.hasOwn(motionDatasetPlanning, name), false, `legacy-only audit symbol leaked into planning facade ${name}`);
}

const PARSER_AUDIT_STUB_DIRECT_EXPORTS = Object.freeze([
  "LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA",
  "LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA",
  "LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA",
  "LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA",
  "LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA",
  "LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REJECTION_REASONS",
  "LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS",
  "LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS",
  "createMotionDatasetRowBodyParserContractStubSummary",
  "createMotionDatasetRowBodyParserRejectionFixturePackSummary",
  "createMotionDatasetIngestionAuditTrailStubSummary",
  "createMotionDatasetIngestionRollbackPlanStubSummary",
  "createMotionDatasetParserDryRunEnvelopeSummary",
]);

for (const name of PARSER_AUDIT_STUB_DIRECT_EXPORTS) {
  assert.equal(Object.hasOwn(motionDatasetParserAuditStubs, name), true, `parser audit module export missing ${name}`);
  assert.equal(Object.hasOwn(legacyProvisioning, name), true, `legacy parser audit export missing ${name}`);
  assert.equal(motionDatasetParserAuditStubs[name], legacyProvisioning[name], `parser audit legacy identity mismatch ${name}`);
}

const negativeFixture = {
  actual_data_task_started: true,
  actual_ingestion_allowed: true,
  real_row_data_present: true,
  row_body_read: true,
  checked_row_count: 1,
  motion_dataset_executable: true,
  runtime_readiness_claimed: true,
  production_readiness_claimed: true,
  owner_confirmation_confirmed: true,
  priority1_status: "RESOLVED",
};

for (const name of [
  "createMotionDatasetActualDataTaskEntryGateSummary",
  "createMotionDatasetRowBodyParserContractStubSummary",
  "createMotionDatasetIngestionRollbackPlanStubSummary",
  "createMotionDatasetParserDryRunEnvelopeSummary",
]) {
  assert.deepEqual(motionDatasetPlanning[name](negativeFixture), legacyProvisioning[name](negativeFixture));
}

console.log("motion-dataset-planning-module-split: pass");
