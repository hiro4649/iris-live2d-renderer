import { createHash } from "node:crypto";

// Test-only parity fingerprint for synthetic planning objects.
// This is not product source-hash verification and never reads actual files.
export function createPlanningParityFingerprint(value) {
  const json = JSON.stringify(value);
  return {
    keyOrder: value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value) : [],
    json,
    jsonLength: json.length,
    jsonSha256: createHash("sha256").update(json).digest("hex"),
  };
}

export function selectPlanningSafetyProjection(value) {
  return {
    actual_data_preauthorized: value.actual_data_preauthorized ?? false,
    actual_data_task_started: value.actual_data_task_started ?? false,
    actual_data_accepted: value.actual_data_accepted ?? false,
    actual_ingestion_allowed: value.actual_ingestion_allowed ?? false,
    owner_submission_received: value.owner_submission_received ?? false,
    owner_submission_accepted: value.owner_submission_accepted ?? false,
    owner_confirmation_created: value.owner_confirmation_created ?? false,
    owner_confirmation_confirmed: value.owner_confirmation_confirmed ?? false,
    real_row_data_present: value.real_row_data_present ?? false,
    row_body_read: value.row_body_read ?? false,
    checked_row_count: value.checked_row_count ?? 0,
    motion_dataset_executable: value.motion_dataset_executable ?? false,
    runtime_readiness_claimed: value.runtime_readiness_claimed ?? false,
    production_readiness_claimed: value.production_readiness_claimed ?? false,
    priority1_status: value.priority1_status ?? "BLOCKED",
    go_nogo_status: value.go_nogo_status ?? "no_go",
    go_candidate: value.go_candidate ?? false,
    blocker_resolved: value.blocker_resolved ?? false,
  };
}

export function selectChecksumPreflightSafetyProjection(value) {
  return {
    actual_file_read: value.actual_file_read ?? false,
    actual_hash_calculated: value.actual_hash_calculated ?? false,
    actual_file_reference_accepted: value.actual_file_reference_accepted ?? false,
    actual_file_content_accepted: value.actual_file_content_accepted ?? false,
    source_hash_verified: value.source_hash_verified ?? false,
    actual_ingestion_allowed: value.actual_ingestion_allowed ?? false,
    owner_confirmation_created: value.owner_confirmation_created ?? false,
    owner_confirmation_confirmed: value.owner_confirmation_confirmed ?? false,
    real_row_data_present: value.real_row_data_present ?? false,
    row_body_read: value.row_body_read ?? false,
    checked_row_count: value.checked_row_count ?? 0,
    motion_dataset_executable: value.motion_dataset_executable ?? false,
    runtime_readiness_claimed: value.runtime_readiness_claimed ?? false,
    production_readiness_claimed: value.production_readiness_claimed ?? false,
    priority1_status: value.priority1_status ?? "BLOCKED",
    go_nogo_status: value.go_nogo_status ?? "no_go",
    go_candidate: value.go_candidate ?? false,
    blocker_resolved: value.blocker_resolved ?? false,
    trusted_loader_allowlist_enabled: value.trusted_loader_allowlist_enabled ?? false,
  };
}
