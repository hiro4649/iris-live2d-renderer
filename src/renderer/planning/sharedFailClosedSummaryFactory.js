import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";

// Shared planning-only fail-closed summary factory.
// It never executes parser, audit, renderer, loader, file, hash, or ingestion work.
export function createMotionDatasetPlanningOnlyGateSummary({ schema, statusKey, status, boundaries = {}, flags = {}, arrays = {}, blockedReasons = [], safeNextAction, context }, input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.owner_confirmation_created ||
      source.owner_confirmation_confirmed ||
      source.actual_data_preauthorized ||
      source.actual_data_task_started ||
      source.actual_data_accepted ||
      source.owner_submission_received ||
      source.owner_submission_accepted ||
      source.quarantine_completed ||
      source.redaction_scan_executed ||
      source.audit_execution_started ||
      source.real_ingestion_audit_event_created ||
      source.rollback_ready ||
      source.external_action_performed ||
      source.parser_dry_run_executed ||
      source.row_body_parser_enabled ||
      source.row_body_parser_executed ||
      source.actual_file_read ||
      source.actual_hash_calculated ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      Number(source.checked_row_count ?? 0) > 0 ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.blocker_resolved ||
      source.go_candidate ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const summary = {
    schema,
    [statusKey]: status,
    planning_only_boundary: true,
    ...boundaries,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_preauthorized: false,
    actual_data_task_started: false,
    actual_data_accepted: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    quarantine_completed: false,
    redaction_scan_executed: false,
    audit_execution_started: false,
    real_ingestion_audit_event_created: false,
    rollback_ready: false,
    external_action_performed: false,
    parser_dry_run_executed: false,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    actual_file_read: false,
    actual_hash_calculated: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    ...flags,
    ...arrays,
    blocked_reasons: [...new Set([...blockedReasons, ...(rejectedAttempt ? [statusKey.replace(/_status$/, "_rejected_state_promotion")] : [])])],
    safe_next_action: safeNextAction,
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_actual_data_preauthorized: true,
      no_actual_data_task_started: true,
      no_actual_data_accepted: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, context);
  return summary;
}
