import assert from "node:assert/strict";
import { assertSafe } from "../helpers/safeContractAssertions.js";
import {
  LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA,
  LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA,
  LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA,
  createMotionDatasetActualDataTaskEntryGateSummary,
  createMotionDatasetOwnerRowDataMetadataValidatorStubSummary,
  createMotionDatasetOwnerRowDataSubmissionPacketSummary,
  createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary,
  createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary,
  createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary,
} from "../../src/renderer/cubismLoaderProvisioning.js";

const ownerPacket = createMotionDatasetOwnerRowDataSubmissionPacketSummary({
  owner_submission_received: true,
  owner_submission_accepted: true,
  owner_confirmation_confirmed: true,
  actual_ingestion_allowed: true,
  checked_row_count: 5,
});
assert.equal(ownerPacket.schema, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA);
assert.equal(ownerPacket.motion_dataset_owner_row_data_submission_packet_status, "planning_only_blocked");
assert.equal(ownerPacket.owner_confirmation_confirmed, false);
assert.equal(ownerPacket.actual_ingestion_allowed, false);
assert.equal(ownerPacket.checked_row_count, 0);
assertSafe(JSON.stringify(ownerPacket));

const receipt = createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary({
  owner_submission_received: true,
  owner_submission_accepted: true,
  checked_row_count: 5,
});
assert.equal(receipt.schema, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA);
assert.equal(receipt.motion_dataset_owner_row_data_submission_receipt_stub_status, "planning_only_blocked");
assert.equal(receipt.owner_submission_received, false);
assert.equal(receipt.owner_submission_accepted, false);
assert.equal(receipt.checked_row_count, 0);
assertSafe(JSON.stringify(receipt));

const validator = createMotionDatasetOwnerRowDataMetadataValidatorStubSummary({
  source_hash_verified: true,
  declared_row_count_checked: true,
  checked_row_count: 5,
});
assert.equal(validator.schema, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA);
assert.equal(validator.motion_dataset_owner_row_data_metadata_validator_stub_status, "planning_only_blocked");
assert.equal(validator.actual_hash_calculated, false);
assert.equal(validator.actual_file_read, false);
assert.equal(validator.checked_row_count, 0);
assertSafe(JSON.stringify(validator));

const rejectionFixturePack = createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary({
  owner_submission_received: true,
  owner_submission_accepted: true,
  trusted_loader_allowlist_enabled: true,
});
assert.equal(rejectionFixturePack.schema, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA);
assert.equal(rejectionFixturePack.motion_dataset_owner_row_data_submission_rejection_fixture_pack_status, "planning_only_blocked");
assert.equal(rejectionFixturePack.owner_submission_received, false);
assert.equal(rejectionFixturePack.owner_submission_accepted, false);
assert.equal(rejectionFixturePack.trusted_loader_allowlist_enabled, false);
assertSafe(JSON.stringify(rejectionFixturePack));

const handoff = createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary({
  owner_confirmation_confirmed: true,
  actual_ingestion_allowed: true,
  trusted_loader_allowlist_enabled: true,
  checked_row_count: 5,
});
assert.equal(handoff.schema, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA);
assert.equal(handoff.motion_dataset_real_row_intake_owner_handoff_packet_status, "planning_only_blocked");
assert.equal(handoff.owner_confirmation_confirmed, false);
assert.equal(handoff.owner_handoff_approves_ingestion, false);
assert.equal(handoff.trusted_loader_allowlist_enabled, false);
assert.equal(handoff.checked_row_count, 0);
assertSafe(JSON.stringify(handoff));

const entryGate = createMotionDatasetActualDataTaskEntryGateSummary({
  actual_data_task_started: true,
  actual_ingestion_allowed: true,
  owner_confirmation_confirmed: true,
  checked_row_count: 5,
  priority1_status: "RESOLVED",
});
assert.equal(entryGate.schema, LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA);
assert.equal(entryGate.motion_dataset_actual_data_task_entry_gate_status, "planning_only_blocked");
assert.equal(entryGate.actual_data_task_started, false);
assert.equal(entryGate.actual_ingestion_allowed, false);
assert.equal(entryGate.owner_confirmation_confirmed, false);
assert.equal(entryGate.checked_row_count, 0);
assert.equal(entryGate.priority1_status, "BLOCKED");
assertSafe(JSON.stringify(entryGate));

console.log("contract-motion-dataset-owner-gates: pass");
