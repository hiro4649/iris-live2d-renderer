import assert from "node:assert/strict";
import {
  REAL_EVIDENCE_OWNER_CHECKLIST_SCHEMA,
  REAL_EVIDENCE_OWNER_CHECKLIST_SECTIONS,
  buildRealEvidenceOwnerChecklist,
  ownerChecklistToHandoffRejectionLabels,
} from "../src/renderer/realEvidenceOwnerChecklist.js";

function sectionStatuses(value = "schema_valid") {
  return Object.fromEntries(REAL_EVIDENCE_OWNER_CHECKLIST_SECTIONS.map((section) => [section, value]));
}

function checklist(overrides = {}) {
  return {
    scopeLabel: "live2d_renderer_real_evidence_owner_gated_review",
    sectionStatuses: sectionStatuses(),
    requiredOwnerActions: [
      "confirm_real_evidence_collection_scope",
      "confirm_renderer_probe_window",
      "confirm_audit_reference_review",
    ],
    missingPrerequisiteLabels: [],
    blockingLabels: [],
    expiryStatus: "active",
    reconfirmationRequired: false,
    generatedAtStatus: "label_only",
    ...overrides,
  };
}

function assertSafeBoundary(result) {
  assert.equal(result.schema, REAL_EVIDENCE_OWNER_CHECKLIST_SCHEMA);
  assert.equal(result.sent, false);
  assert.equal(result.authorizing, false);
  assert.equal(result.ownerConfirmationCreated, false);
  assert.equal(result.ownerConfirmationConfirmed, false);
  assert.equal(result.actualEvidenceCollectionAuthorized, false);
  assert.equal(result.actualIngestionAllowed, false);
  assert.equal(result.trustedLoaderEnablementAuthorized, false);
  assert.equal(result.runtimeReadinessClaimed, false);
  assert.equal(result.productionReadinessClaimed, false);
  assert.equal(result.priority1Resolved, false);
  assert.equal(result.checkedRowCount, 0);
  assert.equal(result.motionDatasetExecutable, false);
  assert.equal(result.sourceHashVerified, false);
  assert.equal(result.declaredRowCountChecked, false);
  assert.equal(result.safeSummaryOnly, true);
}

const ready = buildRealEvidenceOwnerChecklist(checklist());
assert.equal(ready.checklistStatus, "ready_for_owner_review");
assert.deepEqual(ready.rejectionLabels, []);
assert.deepEqual(ready.missingPrerequisiteLabels, []);
assert.deepEqual(ready.blockingLabels, []);
assertSafeBoundary(ready);

const missingRenderer = buildRealEvidenceOwnerChecklist(checklist({
  sectionStatuses: {
    ...sectionStatuses(),
    renderer_evidence_requirements: "missing_or_blocked",
  },
}));
assert.equal(missingRenderer.checklistStatus, "blocked");
assert.equal(missingRenderer.missingPrerequisiteLabels.includes("renderer_evidence_requirements_schema_valid"), true);
assertSafeBoundary(missingRenderer);

const missingAudit = buildRealEvidenceOwnerChecklist(checklist({
  sectionStatuses: {
    ...sectionStatuses(),
    audit_reference_requirements: "missing_or_blocked",
  },
}));
assert.equal(missingAudit.checklistStatus, "blocked");
assert.equal(missingAudit.missingPrerequisiteLabels.includes("audit_reference_requirements_schema_valid"), true);
assertSafeBoundary(missingAudit);

const wrongScope = buildRealEvidenceOwnerChecklist(checklist({ scopeLabel: "not_registered" }));
assert.equal(wrongScope.checklistStatus, "blocked");
assert.equal(wrongScope.rejectionLabels.includes("scope_unknown"), true);
assertSafeBoundary(wrongScope);

const expired = buildRealEvidenceOwnerChecklist(checklist({ expiryStatus: "expired" }));
assert.equal(expired.checklistStatus, "expired");
assert.equal(expired.reconfirmationRequired, true);
assert.deepEqual(ownerChecklistToHandoffRejectionLabels(expired), ["owner_checklist_expired"]);
assertSafeBoundary(expired);

for (const [overrides, expectedLabel] of [
  [{ endpoint: "redacted" }, "unsafe_field_present"],
  [{ token: "redacted" }, "unsafe_field_present"],
  [{ secret: "redacted" }, "unsafe_field_present"],
  [{ private_path: "redacted" }, "unsafe_field_present"],
  [{ raw_evidence: "redacted" }, "unsafe_field_present"],
  [{ raw_owner_note: "redacted" }, "unsafe_field_present"],
  [{ raw_command: "redacted" }, "unsafe_field_present"],
  [{ actual_execution_request: true }, "unsafe_field_present"],
  [{ actual_ingestion_request: true }, "unsafe_field_present"],
  [{ trusted_loader_enable_request: true }, "unsafe_field_present"],
  [{ readiness_request: true }, "unsafe_field_present"],
  [{ owner_confirmation_request: true }, "unsafe_field_present"],
  [{ expired_checklist_used_as_current: true }, "unsafe_field_present"],
  [{ wrong_scope: true }, "unsafe_field_present"],
  [{ unexpected: true }, "unknown_field_present"],
  [{ requiredOwnerActions: ["not_registered"] }, "owner_action_unknown"],
  [{ missingPrerequisiteLabels: ["not_registered"] }, "missing_prerequisite_unknown"],
  [{ blockingLabels: ["not_registered"] }, "blocking_label_unknown"],
]) {
  const result = buildRealEvidenceOwnerChecklist(checklist(overrides));
  assert.equal(result.checklistStatus, "blocked", expectedLabel);
  assert.equal(result.rejectionLabels.includes(expectedLabel), true, expectedLabel);
  assertSafeBoundary(result);
}

const unsafeKeyInput = Object.defineProperty(checklist(), "__proto__", { value: "x", enumerable: true });
const unsafeKey = buildRealEvidenceOwnerChecklist(unsafeKeyInput);
assert.equal(unsafeKey.rejectionLabels.includes("unsafe_key_present"), true);
assertSafeBoundary(unsafeKey);

const notObject = buildRealEvidenceOwnerChecklist("not-object");
assert.equal(notObject.checklistStatus, "blocked");
assert.equal(notObject.rejectionLabels.includes("input_not_plain_object"), true);
assertSafeBoundary(notObject);

const input = checklist();
const snapshot = JSON.stringify(input);
assert.deepEqual(buildRealEvidenceOwnerChecklist(input), buildRealEvidenceOwnerChecklist(input));
assert.equal(JSON.stringify(input), snapshot);

assert.deepEqual(ownerChecklistToHandoffRejectionLabels(ready), []);
assert.deepEqual(ownerChecklistToHandoffRejectionLabels({ schema: "wrong" }), ["owner_checklist_schema_invalid"]);
assert.deepEqual(ownerChecklistToHandoffRejectionLabels(null), ["owner_checklist_missing"]);

console.log("real-evidence-owner-checklist: pass");
