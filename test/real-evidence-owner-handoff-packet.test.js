import assert from "node:assert/strict";
import {
  REAL_EVIDENCE_OWNER_HANDOFF_PACKET_SCHEMA,
  SAFE_NEXT_ACTION_LABELS,
  buildRealEvidenceOwnerHandoffPacket,
} from "../src/renderer/realEvidenceOwnerHandoffPacket.js";

function packet(overrides = {}) {
  return {
    scopeLabels: ["live2d_renderer", "real_evidence_collection", "owner_confirmation"],
    requiredEvidenceLabels: ["fresh_renderer_heartbeat", "real_model_load_supported", "model_scene_match_confirmed"],
    missingEvidenceLabels: [],
    staleEvidenceLabels: [],
    rowManifestStatus: "metadata_only_ready",
    trustedLoaderStatus: "disabled",
    priority1Status: "ready_for_future_review",
    checkedRowCount: 1,
    auditReferenceStatus: "present",
    ownerActionsRequired: ["confirm_real_evidence_collection_scope"],
    generatedAtStatus: "label_only",
    expiryStatus: "active",
    ...overrides,
  };
}

function assertSafeBoundary(result) {
  assert.equal(result.schema, REAL_EVIDENCE_OWNER_HANDOFF_PACKET_SCHEMA);
  assert.equal(result.sent, false);
  assert.equal(result.ownerConfirmationCreated, false);
  assert.equal(result.ownerConfirmationConfirmed, false);
  assert.equal(result.authorizing, false);
  assert.equal(result.safeSummaryOnly, true);
  assert.equal(result.actualEvidenceCollectionAuthorized, false);
  assert.equal(result.runtimeReadinessClaimed, false);
  assert.equal(result.productionReadinessClaimed, false);
  assert.equal(result.actualIngestionAllowed, false);
  assert.equal(result.trustedLoaderEnablementAuthorized, false);
  assert.equal(result.priority1Resolved, false);
  assert.equal(result.motionDatasetExecutable, false);
  assert.equal(result.sourceHashVerified, false);
  assert.equal(result.declaredRowCountChecked, false);
  assert.deepEqual(result.safeNextActionLabels, SAFE_NEXT_ACTION_LABELS);
}

const safe = buildRealEvidenceOwnerHandoffPacket(packet());
assert.equal(safe.packetStatus, "ready_for_owner_review");
assert.deepEqual(safe.rejectionLabels, []);
assertSafeBoundary(safe);

for (const [overrides, expectedStatus, expectedLabel] of [
  [{ requiredEvidenceLabels: ["fresh_renderer_heartbeat"], missingEvidenceLabels: ["model_loaded"] }, "blocked_missing_evidence", null],
  [{ scopeLabels: [] }, "blocked_missing_scope", null],
  [{ auditReferenceStatus: "missing" }, "blocked_missing_audit", null],
  [{ priority1Status: "BLOCKED" }, "blocked_priority1", null],
  [{ checkedRowCount: 0 }, "blocked_checked_rows_zero", null],
  [{ expiryStatus: "expired" }, "expired", null],
  [{ requiredEvidenceLabels: [] }, "blocked_missing_evidence", null],
  [{ scopeLabels: [""] }, "blocked_missing_scope", "scope_label_invalid"],
  [{ scopeLabels: ["not_registered"] }, "blocked_missing_scope", "scope_label_unknown"],
  [{ scopeLabels: ["https://example.invalid"] }, "blocked_missing_scope", "scope_label_invalid"],
  [{ scopeLabels: ["live2d_renderer", "live2d_renderer"] }, "blocked_missing_evidence", "scope_label_invalid"],
  [{ requiredEvidenceLabels: ["not_registered"] }, "blocked_missing_evidence", "required_evidence_label_unknown"],
  [{ missingEvidenceLabels: ["not_registered"] }, "blocked_missing_evidence", "missing_evidence_label_unknown"],
  [{ staleEvidenceLabels: ["not_registered"] }, "blocked_missing_evidence", "stale_evidence_label_unknown"],
  [{ ownerActionsRequired: ["not_registered"] }, "blocked_missing_evidence", "owner_action_label_unknown"],
  [{ rowManifestStatus: "actual_rows_present" }, "blocked_missing_evidence", "row_manifest_not_metadata_only_ready"],
  [{ trustedLoaderStatus: "enabled" }, "blocked_missing_evidence", "trusted_loader_not_disabled"],
  [{ priority1Status: "RESOLVED" }, "blocked_missing_evidence", "priority1_status_invalid"],
  [{ checkedRowCount: -1 }, "blocked_missing_evidence", "checked_row_count_invalid"],
  [{ generatedAtStatus: "real_timestamp" }, "blocked_missing_evidence", "generated_at_status_not_label_only"],
]) {
  const result = buildRealEvidenceOwnerHandoffPacket(packet(overrides));
  assert.equal(result.packetStatus, expectedStatus, expectedStatus);
  if (expectedLabel) assert.equal(result.rejectionLabels.includes(expectedLabel), true, expectedLabel);
  assertSafeBoundary(result);
}

for (const [overrides, expectedLabel] of [
  [{ endpoint: "redacted" }, "unsafe_field:endpoint"],
  [{ token: "redacted" }, "unsafe_field:token"],
  [{ secret: "redacted" }, "unsafe_field:secret"],
  [{ private_path: "redacted" }, "unsafe_field:private_path"],
  [{ raw_evidence: "redacted" }, "unsafe_field:raw_evidence"],
  [{ raw_command: "redacted" }, "unsafe_field:raw_command"],
  [{ raw_audit_body: "redacted" }, "unsafe_field:raw_audit_body"],
  [{ actual_probe_request: true }, "unsafe_field:actual_probe_request"],
  [{ actual_ingestion_request: true }, "unsafe_field:actual_ingestion_request"],
  [{ trusted_loader_enablement_request: true }, "unsafe_field:trusted_loader_enablement_request"],
  [{ readiness_claim_request: true }, "unsafe_field:readiness_claim_request"],
  [{ owner_confirmation_request: true }, "unsafe_field:owner_confirmation_request"],
  [{ package_publish_request: true }, "unsafe_field:package_publish_request"],
  [{ external_service_request: true }, "unsafe_field:external_service_request"],
  [{ unexpectedField: true }, "unknown_field:unexpectedField"],
]) {
  const result = buildRealEvidenceOwnerHandoffPacket(packet(overrides));
  assert.equal(result.packetStatus, "blocked_missing_evidence", expectedLabel);
  assert.equal(result.rejectionLabels.includes(expectedLabel), true, expectedLabel);
  assertSafeBoundary(result);
}

const unsafeKeyInput = Object.defineProperty(packet(), "__proto__", { value: "x", enumerable: true });
const unsafeKey = buildRealEvidenceOwnerHandoffPacket(unsafeKeyInput);
assert.equal(unsafeKey.rejectionLabels.includes("unsafe_key:__proto__"), true);
assertSafeBoundary(unsafeKey);

const notObject = buildRealEvidenceOwnerHandoffPacket("not-object");
assert.equal(notObject.rejectionLabels.includes("input_not_plain_object"), true);
assertSafeBoundary(notObject);

const input = packet();
const snapshot = JSON.stringify(input);
assert.deepEqual(buildRealEvidenceOwnerHandoffPacket(input), buildRealEvidenceOwnerHandoffPacket(input));
assert.equal(JSON.stringify(input), snapshot);

const result = buildRealEvidenceOwnerHandoffPacket(packet());
assert.deepEqual(Object.keys(result).sort(), [
  "actualEvidenceCollectionAuthorized",
  "actualIngestionAllowed",
  "auditReferenceStatus",
  "authorizing",
  "checkedRowCount",
  "declaredRowCountChecked",
  "expiryStatus",
  "generatedAtStatus",
  "missingEvidenceLabels",
  "motionDatasetExecutable",
  "ownerActionsRequired",
  "ownerConfirmationConfirmed",
  "ownerConfirmationCreated",
  "packetStatus",
  "priority1Resolved",
  "priority1Status",
  "productionReadinessClaimed",
  "rejectionLabels",
  "requiredEvidenceLabels",
  "rowManifestStatus",
  "runtimeReadinessClaimed",
  "safeNextActionLabels",
  "safeSummaryOnly",
  "schema",
  "scopeLabels",
  "sent",
  "sourceHashVerified",
  "staleEvidenceLabels",
  "trustedLoaderEnablementAuthorized",
  "trustedLoaderStatus",
].sort());

console.log("real-evidence-owner-handoff-packet: pass");
