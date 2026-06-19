import assert from "node:assert/strict";
import { assertSafe } from "../helpers/safeContractAssertions.js";
import {
  LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA,
  createMotionDatasetIngestionAuditTrailStubSummary,
  createMotionDatasetIngestionRollbackPlanStubSummary,
  createMotionDatasetParserDryRunEnvelopeSummary,
  createMotionDatasetRealRowAuditManifestSummary,
  createMotionDatasetRealRowEvidenceLinkManifestSummary,
  createMotionDatasetRealRowGoNoGoBlockerMapSummary,
  createMotionDatasetRealRowRedactionScannerFixturePackSummary,
} from "../../src/renderer/cubismLoaderProvisioning.js";

const auditManifest = createMotionDatasetRealRowAuditManifestSummary({
  checked_row_count: 9,
  audit_execution_started: true,
  actual_ingestion_allowed: true,
});
assert.equal(auditManifest.schema, LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA);
assert.equal(auditManifest.motion_dataset_real_row_audit_manifest_status, "planning_only_blocked");
assert.equal(auditManifest.checked_row_count, 0);
assert.equal(auditManifest.audit_manifest_is_actual_audit_completion, false);
assert.equal(auditManifest.row_body_read, false);
assertSafe(JSON.stringify(auditManifest));

const redactionFixturePack = createMotionDatasetRealRowRedactionScannerFixturePackSummary({
  redaction_scan_execution_started: true,
  checked_row_count: 9,
  actual_ingestion_allowed: true,
});
assert.equal(redactionFixturePack.schema, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA);
assert.equal(redactionFixturePack.motion_dataset_real_row_redaction_scanner_fixture_pack_status, "planning_only_blocked");
assert.equal(redactionFixturePack.redaction_scanner_fixture_only, true);
assert.equal(redactionFixturePack.checked_row_count, 0);
assert.equal(redactionFixturePack.row_body_read, false);
assertSafe(JSON.stringify(redactionFixturePack));

const evidenceLink = createMotionDatasetRealRowEvidenceLinkManifestSummary({
  source_hash_verified: true,
  checked_row_count: 9,
});
assert.equal(evidenceLink.schema, LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA);
assert.equal(evidenceLink.motion_dataset_real_row_evidence_link_manifest_status, "planning_only_blocked");
assert.equal(evidenceLink.evidence_link_manifest_marks_audit_complete, false);
assert.equal(evidenceLink.checked_row_count, 0);
assertSafe(JSON.stringify(evidenceLink));

const goNoGo = createMotionDatasetRealRowGoNoGoBlockerMapSummary({
  go_nogo_status: "go",
  priority1_status: "RESOLVED",
  actual_ingestion_allowed: true,
  checked_row_count: 9,
});
assert.equal(goNoGo.schema, LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA);
assert.equal(goNoGo.go_nogo_status, "no_go");
assert.equal(goNoGo.priority1_status, "BLOCKED");
assert.equal(goNoGo.row_body_read, false);
assert.equal(goNoGo.checked_row_count, 0);
assertSafe(JSON.stringify(goNoGo));

const auditTrail = createMotionDatasetIngestionAuditTrailStubSummary({
  audit_execution_started: true,
  actual_ingestion_allowed: true,
  checked_row_count: 9,
});
assert.equal(auditTrail.schema, LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA);
assert.equal(auditTrail.motion_dataset_ingestion_audit_trail_stub_status, "planning_only_blocked");
assert.equal(auditTrail.real_ingestion_audit_event_created, false);
assert.equal(auditTrail.actual_ingestion_allowed, false);
assert.equal(auditTrail.checked_row_count, 0);
assertSafe(JSON.stringify(auditTrail));

const rollbackPlan = createMotionDatasetIngestionRollbackPlanStubSummary({
  actual_ingestion_allowed: true,
  checked_row_count: 9,
});
assert.equal(rollbackPlan.schema, LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA);
assert.equal(rollbackPlan.motion_dataset_ingestion_rollback_plan_stub_status, "planning_only_blocked");
assert.equal(rollbackPlan.actual_ingestion_allowed, false);
assert.equal(rollbackPlan.checked_row_count, 0);
assertSafe(JSON.stringify(rollbackPlan));

const parserDryRun = createMotionDatasetParserDryRunEnvelopeSummary({
  parser_execution_started: true,
  actual_ingestion_allowed: true,
  checked_row_count: 9,
});
assert.equal(parserDryRun.schema, LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA);
assert.equal(parserDryRun.motion_dataset_parser_dry_run_envelope_status, "planning_only_blocked");
assert.equal(parserDryRun.row_body_parser_executed, false);
assert.equal(parserDryRun.actual_ingestion_allowed, false);
assert.equal(parserDryRun.checked_row_count, 0);
assertSafe(JSON.stringify(parserDryRun));

console.log("contract-motion-dataset-audit-stubs: pass");
