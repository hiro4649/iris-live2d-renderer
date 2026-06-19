import assert from "node:assert/strict";
import * as legacyProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import { createMotionDatasetPlanningOnlyGateSummary } from "../src/renderer/planning/sharedFailClosedSummaryFactory.js";

assert.equal(Object.hasOwn(legacyProvisioning, "createMotionDatasetPlanningOnlyGateSummary"), false);

const summary = createMotionDatasetPlanningOnlyGateSummary({
  schema: "test_shared_fail_closed_summary_v1",
  statusKey: "test_shared_fail_closed_status",
  status: "planning_only_blocked",
  boundaries: {
    test_shared_boundary: true,
  },
  flags: {
    test_shared_flag: true,
  },
  arrays: {
    required_safe_labels: ["safe_label_only"],
  },
  blockedReasons: [
    "shared_fail_closed_planning_only",
    "shared_fail_closed_priority1_blocked",
  ],
  safeNextAction: "keep_planning_only_until_owner_confirmed_future_gate",
  context: "shared fail closed summary factory test",
}, {
  owner_confirmation_created: true,
  actual_data_task_started: true,
  actual_file_read: true,
  actual_hash_calculated: true,
  real_row_data_present: true,
  checked_row_count: 1,
  motion_dataset_executable: true,
  runtime_readiness_claimed: true,
  production_readiness_claimed: true,
  priority1_status: "RESOLVED",
  go_nogo_status: "go",
});

const adversarialConfigSummary = createMotionDatasetPlanningOnlyGateSummary({
  schema: "test_shared_fail_closed_config_v1",
  statusKey: "test_shared_fail_closed_config_status",
  status: "planning_only_blocked",
  boundaries: {
    planning_only_boundary: false,
    owner_confirmation_created: true,
    actual_data_preauthorized: true,
    actual_data_task_started: true,
    runtime_readiness_claimed: true,
    production_readiness_claimed: true,
    priority1_status: "RESOLVED",
    go_nogo_status: "go",
    blocker_resolved: true,
  },
  flags: {
    schema: "unsafe_schema_override",
    owner_confirmation_confirmed: true,
    actual_data_accepted: true,
    checked_row_count: 1,
    actual_ingestion_allowed: true,
    motion_dataset_executable: true,
    trusted_loader_allowlist_enabled: true,
    source_hash_verified: true,
    declared_row_count_checked: true,
    parser_execution: true,
    redaction_scan_execution: true,
    audit_execution: true,
  },
  arrays: {
    test_shared_fail_closed_config_status: "unsafe_status_override",
    motion_dataset_executable: true,
    checked_row_count: 1,
  },
  blockedReasons: ["shared_fail_closed_config_planning_only"],
  safeNextAction: "reject_unsafe_static_config_without_promoting_state",
  context: "shared fail closed adversarial config test",
});

const pollutedBoundaries = {};
Object.defineProperty(pollutedBoundaries, "__proto__", {
  value: true,
  enumerable: true,
});
const prototypePollutionSummary = createMotionDatasetPlanningOnlyGateSummary({
  schema: "test_shared_fail_closed_pollution_v1",
  statusKey: "test_shared_fail_closed_pollution_status",
  status: "planning_only_blocked",
  boundaries: pollutedBoundaries,
  blockedReasons: ["shared_fail_closed_pollution_planning_only"],
  safeNextAction: "reject_prototype_pollution_key_without_raw_value",
  context: "shared fail closed prototype pollution test",
});

assert.equal(summary.schema, "test_shared_fail_closed_summary_v1");
assert.equal(summary.test_shared_fail_closed_status, "planning_only_blocked");
assert.equal(summary.planning_only_boundary, true);
assert.equal(summary.test_shared_boundary, true);
assert.equal(summary.test_shared_flag, true);
assert.deepEqual(summary.required_safe_labels, ["safe_label_only"]);
assert.equal(summary.owner_confirmation_created, false);
assert.equal(summary.owner_confirmation_confirmed, false);
assert.equal(summary.actual_data_task_started, false);
assert.equal(summary.actual_file_read, false);
assert.equal(summary.actual_hash_calculated, false);
assert.equal(summary.real_row_data_present, false);
assert.equal(summary.checked_row_count, 0);
assert.equal(summary.actual_ingestion_allowed, false);
assert.equal(summary.motion_dataset_executable, false);
assert.equal(summary.runtime_readiness_claimed, false);
assert.equal(summary.production_readiness_claimed, false);
assert.equal(summary.priority1_status, "BLOCKED");
assert.equal(summary.go_nogo_status, "no_go");
assert.equal(summary.blocker_resolved, false);
assert.equal(summary.blocked_reasons.includes("shared_fail_closed_planning_only"), true);
assert.equal(summary.blocked_reasons.includes("test_shared_fail_closed_rejected_state_promotion"), true);
assert.equal(summary.boundary_policy.safe_summary_only, true);
assert.equal(summary.boundary_policy.no_owner_confirmation_created, true);
assert.equal(summary.boundary_policy.no_actual_data_task_started, true);
assert.equal(summary.boundary_policy.no_real_row_ingestion, true);
assert.equal(summary.boundary_policy.no_row_body_read, true);
assert.equal(summary.boundary_policy.no_runtime_readiness_claim, true);
assert.equal(summary.boundary_policy.no_production_readiness_claim, true);

assert.equal(adversarialConfigSummary.schema, "test_shared_fail_closed_config_v1");
assert.equal(adversarialConfigSummary.test_shared_fail_closed_config_status, "planning_only_blocked");
assert.equal(adversarialConfigSummary.planning_only_boundary, true);
assert.equal(adversarialConfigSummary.owner_confirmation_created, false);
assert.equal(adversarialConfigSummary.owner_confirmation_confirmed, false);
assert.equal(adversarialConfigSummary.actual_data_preauthorized, false);
assert.equal(adversarialConfigSummary.actual_data_task_started, false);
assert.equal(adversarialConfigSummary.actual_data_accepted, false);
assert.equal(adversarialConfigSummary.checked_row_count, 0);
assert.equal(adversarialConfigSummary.actual_ingestion_allowed, false);
assert.equal(adversarialConfigSummary.motion_dataset_executable, false);
assert.equal(adversarialConfigSummary.runtime_readiness_claimed, false);
assert.equal(adversarialConfigSummary.production_readiness_claimed, false);
assert.equal(adversarialConfigSummary.priority1_status, "BLOCKED");
assert.equal(adversarialConfigSummary.go_nogo_status, "no_go");
assert.equal(adversarialConfigSummary.blocker_resolved, false);
assert.equal(adversarialConfigSummary.trusted_loader_allowlist_enabled, false);
assert.equal(adversarialConfigSummary.source_hash_verified, false);
assert.equal(adversarialConfigSummary.declared_row_count_checked, false);
assert.equal(adversarialConfigSummary.parser_execution, false);
assert.equal(adversarialConfigSummary.redaction_scan_execution, false);
assert.equal(adversarialConfigSummary.audit_execution, false);
assert.equal(adversarialConfigSummary.blocked_reasons.includes("test_shared_fail_closed_config_rejected_boundaries_owner_confirmation_created_unsafe_promotion"), true);
assert.equal(adversarialConfigSummary.blocked_reasons.includes("test_shared_fail_closed_config_rejected_flags_trusted_loader_allowlist_enabled_unsafe_promotion"), true);
assert.equal(adversarialConfigSummary.blocked_reasons.includes("test_shared_fail_closed_config_rejected_flags_schema_summary_identity_override"), true);
assert.equal(adversarialConfigSummary.blocked_reasons.includes("test_shared_fail_closed_config_rejected_arrays_test_shared_fail_closed_config_status_summary_identity_override"), true);

assert.equal(prototypePollutionSummary.schema, "test_shared_fail_closed_pollution_v1");
assert.equal(prototypePollutionSummary.planning_only_boundary, true);
assert.equal(prototypePollutionSummary.blocked_reasons.includes("test_shared_fail_closed_pollution_rejected_boundaries_prototype_pollution_key"), true);

console.log("shared-fail-closed-summary-factory: pass");
