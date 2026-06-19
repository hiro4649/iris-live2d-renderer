import assert from "node:assert/strict";
import { assertSafe } from "../helpers/safeContractAssertions.js";
import {
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
  LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
  createMotionDatasetRealRowIntakeDryRunValidatorSummary,
  createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary,
  createMotionDatasetRealRowIntakeRequestPacketSummary,
  createMotionDatasetRowSchemaPreflightSummary,
  createMotionDatasetSyntheticRowFixturePackSummary,
} from "../../src/renderer/cubismLoaderProvisioning.js";

const rowSchema = createMotionDatasetRowSchemaPreflightSummary({
  checked_row_count: 8,
  real_row_data_present: true,
  actual_ingestion_allowed: true,
  motion_dataset_executable: true,
  priority1_status: "RESOLVED",
  trusted_loader_allowlist_enabled: true,
});
assert.equal(rowSchema.schema, LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA);
assert.equal(rowSchema.row_schema_preflight_status, "planning_only_blocked");
assert.equal(rowSchema.checked_row_count, 0);
assert.equal(rowSchema.motion_dataset_executable, false);
assert.equal(rowSchema.real_row_ingestion_started, false);
assert.equal(rowSchema.priority1_status, "BLOCKED");
assert.equal(rowSchema.trusted_loader_allowlist_enabled, false);
assertSafe(JSON.stringify(rowSchema));

const syntheticPack = createMotionDatasetSyntheticRowFixturePackSummary({
  checked_row_count: 4,
  motion_dataset_executable: true,
  actual_ingestion_allowed: true,
  trusted_loader_allowlist_enabled: true,
});
assert.equal(syntheticPack.schema, LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA);
assert.equal(syntheticPack.motion_dataset_synthetic_row_fixture_pack_status, "planning_only_blocked");
assert.equal(syntheticPack.checked_row_count, 0);
assert.equal(syntheticPack.real_row_data_present, false);
assert.equal(syntheticPack.motion_dataset_executable, false);
assert.equal(syntheticPack.trusted_loader_allowlist_enabled, false);
assertSafe(JSON.stringify(syntheticPack));

const requestPacket = createMotionDatasetRealRowIntakeRequestPacketSummary({
  requested_file_format_label: "jsonl",
  checked_row_count: 3,
  actual_ingestion_allowed: true,
  trusted_loader_allowlist_enabled: true,
});
assert.equal(requestPacket.schema, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA);
assert.equal(requestPacket.motion_dataset_real_row_intake_request_packet_status, "planning_only_blocked");
assert.equal(requestPacket.checked_row_count, 0);
assert.equal(requestPacket.request_packet_is_real_row_ingestion, false);
assert.equal(requestPacket.owner_confirmation_required, true);
assert.equal(requestPacket.trusted_loader_allowlist_enabled, false);
assertSafe(JSON.stringify(requestPacket));

const dryRun = createMotionDatasetRealRowIntakeDryRunValidatorSummary({
  requested_file_format_label: "jsonl",
  checked_row_count: 3,
  actual_ingestion_allowed: true,
  trustedLoaderAllowlistEnabled: true,
});
assert.equal(dryRun.schema, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA);
assert.equal(dryRun.motion_dataset_real_row_intake_dry_run_validator_status, "planning_only_blocked");
assert.equal(dryRun.checked_row_count, 0);
assert.equal(dryRun.actual_data_validation_started, false);
assert.equal(dryRun.trusted_loader_allowlist_enabled, false);
assertSafe(JSON.stringify(dryRun));

const quarantine = createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary({
  requested_file_format_label: "jsonl",
  checked_row_count: 3,
  actual_ingestion_allowed: true,
  trusted_loader_allowlist_enabled: true,
});
assert.equal(quarantine.schema, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA);
assert.equal(quarantine.motion_dataset_real_row_intake_quarantine_envelope_status, "planning_only_blocked");
assert.equal(quarantine.checked_row_count, 0);
assert.equal(quarantine.no_real_row_ingestion_boundary, true);
assert.equal(quarantine.row_body_read, false);
assert.equal(quarantine.trusted_loader_allowlist_enabled, false);
assertSafe(JSON.stringify(quarantine));

console.log("contract-motion-dataset-metadata: pass");
