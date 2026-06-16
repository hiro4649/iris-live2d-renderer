import { existsSync } from "node:fs";
import { assertSafePublicObject, createBoundaryPolicy, safeText } from "../contracts.js";

export const CUBISM_LOADER_PROVISIONING_SCHEMA = "iris_live2d_cubism_loader_provisioning_v1";
export const TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA = "iris_live2d_trusted_loader_allowlist_preflight_v1";
export const TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA = "iris_live2d_trusted_loader_enablement_gate_v1";
export const TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA = "iris_live2d_trusted_loader_owner_handoff_v1";
export const FRESH_EVIDENCE_BUNDLE_SCHEMA = "iris_live2d_fresh_evidence_bundle_v1";
export const GO_NOGO_PREFLIGHT_SCHEMA = "iris_live2d_go_nogo_preflight_v1";
export const REAL_EVIDENCE_INTAKE_SCHEMA = "iris_live2d_real_evidence_intake_v1";
export const OWNER_CONFIRMATION_ENVELOPE_SCHEMA = "iris_live2d_owner_confirmation_envelope_v1";
export const REAL_EVIDENCE_REQUEST_PACKET_SCHEMA = "iris_live2d_real_evidence_request_packet_v1";
export const REAL_RESIDENT_EVIDENCE_COLLECTION_PLAN_SCHEMA = "iris_live2d_real_resident_evidence_collection_plan_v1";
export const LIVE2D_REAL_EVIDENCE_COLLECTOR_MANIFEST_SCHEMA = "iris_live2d_real_evidence_collector_manifest_v1";
export const LIVE2D_REAL_EVIDENCE_COLLECTOR_FIXTURE_PACK_SCHEMA = "iris_live2d_real_evidence_collector_fixture_pack_v1";
export const LIVE2D_REAL_EVIDENCE_COLLECTOR_DRY_RUN_ENVELOPE_SCHEMA = "iris_live2d_real_evidence_collector_dry_run_envelope_v1";
export const REAL_EVIDENCE_FRESHNESS_THRESHOLD_SCHEMA = "iris_live2d_real_evidence_freshness_threshold_v1";
export const LIVE2D_SAFE_EVIDENCE_SUMMARY_CONTRACT_SCHEMA = "iris_live2d_safe_evidence_summary_contract_v1";
export const LIVE2D_REAL_EVIDENCE_SUMMARY_INTAKE_BINDING_SCHEMA = "iris_live2d_real_evidence_summary_intake_binding_v1";
export const LIVE2D_OWNER_CONFIRMATION_BINDING_SCHEMA = "iris_live2d_owner_confirmation_binding_v1";
export const LIVE2D_GO_NOGO_BLOCKER_RESOLUTION_SCHEMA = "iris_live2d_go_nogo_blocker_resolution_v1";
export const LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA = "iris_live2d_motion_dataset_row_schema_preflight_v1";
export const LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_dataset_synthetic_row_fixture_pack_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA = "iris_live2d_motion_dataset_real_row_intake_request_packet_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA = "iris_live2d_motion_dataset_real_row_intake_dry_run_validator_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_real_row_intake_quarantine_envelope_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA = "iris_live2d_motion_dataset_real_row_intake_owner_handoff_packet_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA = "iris_live2d_motion_dataset_real_row_audit_manifest_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_dataset_real_row_redaction_scanner_fixture_pack_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA = "iris_live2d_motion_dataset_real_row_evidence_link_manifest_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA = "iris_live2d_motion_dataset_real_row_go_nogo_blocker_map_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA = "iris_live2d_motion_dataset_real_row_pre_ingestion_review_packet_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA = "iris_live2d_motion_dataset_real_row_final_dry_run_checklist_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA = "iris_live2d_motion_dataset_real_row_missing_data_fail_closed_gate_v1";
export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA = "iris_live2d_motion_dataset_owner_row_data_submission_packet_v1";
export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA = "iris_live2d_motion_dataset_owner_row_data_submission_receipt_stub_v1";
export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_MANIFEST_SCHEMA = "iris_live2d_motion_dataset_row_file_checksum_preflight_manifest_v1";
export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA = "iris_live2d_motion_dataset_owner_row_data_metadata_validator_stub_v1";
export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_dataset_owner_row_data_submission_rejection_fixture_pack_v1";
export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA = "iris_live2d_motion_dataset_actual_data_task_entry_gate_v1";
export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA = "iris_live2d_motion_dataset_row_body_parser_contract_stub_v1";
export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_dataset_row_body_parser_rejection_fixture_pack_v1";
export const LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA = "iris_live2d_motion_dataset_ingestion_audit_trail_stub_v1";
export const LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA = "iris_live2d_motion_dataset_ingestion_rollback_plan_stub_v1";
export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_parser_dry_run_envelope_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_CRITERIA_CHECKLIST_SCHEMA = "iris_live2d_motion_dataset_real_row_acceptance_criteria_checklist_v1";
export const LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REVIEW_PACKET_SCHEMA = "iris_live2d_motion_dataset_owner_actual_data_task_handoff_review_packet_v1";
export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_PROJECTION_SCHEMA = "iris_live2d_motion_dataset_actual_data_no_go_summary_projection_v1";
export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_LEDGER_SCHEMA = "iris_live2d_motion_dataset_owner_submission_readiness_ledger_v1";
export const LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_BLOCKER_GATE_SCHEMA = "iris_live2d_motion_dataset_final_actual_data_preauth_blocker_gate_v1";
export const LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_owner_confirmation_preflight_envelope_v1";
export const LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_row_file_quarantine_staging_envelope_v1";
export const LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_ENVELOPE_STUB_SCHEMA = "iris_live2d_motion_dataset_redaction_scan_execution_envelope_stub_v1";
export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_parser_dry_run_execution_request_envelope_v1";
export const LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_ENVELOPE_SCHEMA = "iris_live2d_motion_dataset_audit_execution_request_envelope_v1";
export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_NO_ACTION_PACKET_SCHEMA = "iris_live2d_motion_dataset_actual_data_task_runbook_no_action_packet_v1";
export const LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_SCHEMA = "iris_live2d_motion_dataset_final_owner_actual_data_packet_v1";
export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LEDGER_SCHEMA = "iris_live2d_motion_dataset_actual_data_freeze_state_ledger_v1";
export const LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA = "iris_live2d_motion_dataset_owner_wait_state_packet_v1";
export const LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_SWEEP_SCHEMA = "iris_live2d_motion_dataset_readiness_non_sweetening_sweep_v1";
export const LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA = "iris_live2d_motion_dataset_planning_completion_review_packet_v1";
export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_SPEC_SCHEMA = "iris_live2d_motion_dataset_owner_submission_form_spec_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_MATRIX_SCHEMA = "iris_live2d_motion_dataset_real_row_redaction_policy_matrix_v1";
export const LIVE2D_MOTION_DATASET_MOTION_ALLOWLIST_SYNC_REVIEW_SCHEMA = "iris_live2d_motion_dataset_motion_allowlist_sync_review_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_SPEC_SCHEMA = "iris_live2d_motion_identity_and_comfort_spec_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_REJECTION_FIXTURE_PACK_SCHEMA = "iris_live2d_motion_identity_and_comfort_rejection_fixture_pack_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_DRY_RUN_VALIDATOR_SCHEMA = "iris_live2d_motion_identity_and_comfort_dry_run_validator_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_RECOVERY_MATRIX_SCHEMA = "iris_live2d_motion_identity_and_comfort_recovery_matrix_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_CONTEXT_GATE_SCHEMA = "iris_live2d_motion_identity_and_comfort_context_gate_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_SUBTITLE_GAZE_GUARD_SCHEMA = "iris_live2d_motion_identity_and_comfort_subtitle_gaze_guard_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_PERSONA_PRESSURE_GUARD_SCHEMA = "iris_live2d_motion_identity_and_comfort_persona_pressure_guard_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_VOICE_SYNC_HINT_BOUNDARY_SCHEMA = "iris_live2d_motion_identity_and_comfort_voice_sync_hint_boundary_v1";
export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_ADAPTIVE_BOUNDS_SCHEMA = "iris_live2d_motion_identity_and_comfort_adaptive_bounds_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_SCHEMA = "iris_live2d_motion_identity_comfort_development_schedule_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_SCHEMA = "iris_live2d_motion_identity_comfort_completion_review_v1";
export const LIVE2D_MOTION_IDENTITY_PROFILE_STATUS_SURFACE_SCHEMA = "iris_live2d_motion_identity_profile_status_surface_v1";
export const LIVE2D_MOTION_COMFORT_POLICY_STATUS_SURFACE_SCHEMA = "iris_live2d_motion_comfort_policy_status_surface_v1";
export const LIVE2D_MOTION_FRESHNESS_POLICY_CROSS_SURFACE_CONSISTENCY_SCHEMA = "iris_live2d_motion_freshness_policy_cross_surface_consistency_v1";
export const LIVE2D_MOTION_STRONG_MOTION_UNSAFE_OVERRIDE_REJECTION_SCHEMA = "iris_live2d_motion_strong_motion_unsafe_override_rejection_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_REDACTION_SWEEP_SCHEMA = "iris_live2d_motion_identity_comfort_redaction_sweep_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_SCHEMA = "iris_live2d_motion_identity_comfort_no_sweetening_sweep_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_AUDIT_SCHEMA = "iris_live2d_motion_identity_comfort_implementation_gap_audit_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_REGISTER_SCHEMA = "iris_live2d_motion_identity_comfort_implementation_gap_register_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_LONG_CONTINUATION_REVIEW2_SCHEMA = "iris_live2d_motion_identity_comfort_final_long_continuation_review2_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_LONG_CONTINUATION_COMPLETION_REVIEW3_SCHEMA = "iris_live2d_motion_identity_comfort_long_continuation_completion_review3_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_SCHEMA = "iris_live2d_motion_identity_comfort_public_summary_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_ADMIN_SUMMARY_REDACTION_SCHEMA = "iris_live2d_motion_identity_comfort_admin_summary_redaction_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ADMIN_SURFACE_ALIGNMENT_SCHEMA = "iris_live2d_motion_identity_comfort_public_admin_surface_alignment_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_ONLY_DETAIL_ROLE_GATE_STUB2_SCHEMA = "iris_live2d_motion_identity_comfort_owner_only_detail_role_gate_stub2_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ROLE_GATE_LEAK_REJECTION_SCHEMA = "iris_live2d_motion_identity_comfort_public_role_gate_leak_rejection_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_OPERATOR_HANDOFF_NO_ACTION_SCHEMA = "iris_live2d_motion_identity_comfort_operator_handoff_no_action_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_SCHEMA = "iris_live2d_motion_identity_comfort_owner_handoff_stub_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_SCHEMA = "iris_live2d_motion_identity_comfort_role_gate_stub_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_SCHEMA = "iris_live2d_motion_identity_comfort_role_gate_redaction_guard_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_STUB_NO_WRITE_SCHEMA = "iris_live2d_motion_identity_comfort_audit_stub_no_write_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_STUB_NO_WRITE2_SCHEMA = "iris_live2d_motion_identity_comfort_audit_event_stub_no_write2_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_UNSAFE_FIELD_GUARD2_SCHEMA = "iris_live2d_motion_identity_comfort_audit_event_unsafe_field_guard2_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_UNSAFE_FIELD_GUARD_SCHEMA = "iris_live2d_motion_identity_comfort_audit_unsafe_field_guard_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_SCHEMA = "iris_live2d_motion_identity_comfort_blocker_grouping_status_surface_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_CONTRACT2_SCHEMA = "iris_live2d_motion_identity_comfort_blocker_grouping_contract2_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_SCHEMA = "iris_live2d_motion_identity_comfort_repeated_blocker_grouping_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_CONTRACT_SCHEMA = "iris_live2d_motion_identity_comfort_repeated_blocker_grouping_contract_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_SCHEMA = "iris_live2d_motion_identity_comfort_continuation_ledger2_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY2_SCHEMA = "iris_live2d_motion_identity_comfort_continuation_ledger_consistency2_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_SCHEMA = "iris_live2d_motion_identity_comfort_continuation_ledger_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY_SCHEMA = "iris_live2d_motion_identity_comfort_continuation_ledger_consistency_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_REDACTION_SWEEP2_SCHEMA = "iris_live2d_motion_identity_comfort_final_redaction_sweep2_v1";
export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_NO_SWEETENING_SWEEP2_SCHEMA = "iris_live2d_motion_identity_comfort_final_no_sweetening_sweep2_v1";
export const LIVE2D_MOTION_DATASET_RENDERER_READY_DEPENDENCY_MATRIX_SCHEMA = "iris_live2d_motion_dataset_renderer_ready_dependency_matrix_v1";
export const LIVE2D_RENDERER_READY_FALSE_POSITIVE_DEPENDENCY_SURFACE_SCHEMA = "iris_live2d_renderer_ready_false_positive_dependency_surface_v1";
export const LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_SEPARATION_CONTRACT_SCHEMA = "iris_live2d_renderer_ready_fixture_vs_real_separation_contract_v1";
export const LIVE2D_RENDERER_READY_FRESH_EVIDENCE_ENVELOPE_SCHEMA = "iris_live2d_renderer_ready_fresh_evidence_envelope_v1";
export const LIVE2D_RENDERER_READY_STALE_EVIDENCE_DOWNGRADE_CONTRACT_SCHEMA = "iris_live2d_renderer_ready_stale_evidence_downgrade_contract_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_ALLOWLIST_SCHEMA = "iris_live2d_renderer_ready_evidence_source_allowlist_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_GUARD_SCHEMA = "iris_live2d_renderer_ready_evidence_schema_violation_guard_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_BLOCKER_MATRIX_SCHEMA = "iris_live2d_renderer_ready_evidence_completeness_blocker_matrix_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_CONFLICT_DOWNGRADE_CONTRACT_SCHEMA = "iris_live2d_renderer_ready_evidence_conflict_downgrade_contract_v1";
export const LIVE2D_RENDERER_READY_GO_NOGO_BLOCKER_SURFACE_SCHEMA = "iris_live2d_renderer_ready_go_nogo_blocker_surface_v1";
export const LIVE2D_RENDERER_READY_BLOCKER_REASON_ALLOWLIST_SCHEMA = "iris_live2d_renderer_ready_blocker_reason_allowlist_v1";
export const LIVE2D_RENDERER_READY_SAFE_NEXT_ACTION_CATALOG_SCHEMA = "iris_live2d_renderer_ready_safe_next_action_catalog_v1";
export const LIVE2D_RENDERER_READY_CROSS_SURFACE_BLOCKER_CONSISTENCY_SCHEMA = "iris_live2d_renderer_ready_cross_surface_blocker_consistency_v1";
export const LIVE2D_RENDERER_READY_OWNER_EVIDENCE_HANDOFF_PACKET_STUB_SCHEMA = "iris_live2d_renderer_ready_owner_evidence_handoff_packet_stub_v1";
export const LIVE2D_RENDERER_READY_OWNER_HANDOFF_NOT_SENT_GUARD_SCHEMA = "iris_live2d_renderer_ready_owner_handoff_not_sent_guard_v1";
export const LIVE2D_RENDERER_READY_OWNER_HANDOFF_REDACTION_GUARD_SCHEMA = "iris_live2d_renderer_ready_owner_handoff_redaction_guard_v1";
export const LIVE2D_RENDERER_READY_REAL_PROBE_REQUEST_STUB_SCHEMA = "iris_live2d_renderer_ready_real_probe_request_stub_v1";
export const LIVE2D_RENDERER_READY_REAL_PROBE_REQUEST_REJECTION_GATE_SCHEMA = "iris_live2d_renderer_ready_real_probe_request_rejection_gate_v1";
export const LIVE2D_RENDERER_READY_REAL_PROBE_PREFLIGHT_BLOCKER_MATRIX_SCHEMA = "iris_live2d_renderer_ready_real_probe_preflight_blocker_matrix_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_MANIFEST_STUB_SCHEMA = "iris_live2d_renderer_ready_evidence_collector_manifest_stub_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_REDACTION_GUARD_SCHEMA = "iris_live2d_renderer_ready_evidence_collector_redaction_guard_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_NO_EXECUTION_GUARD_SCHEMA = "iris_live2d_renderer_ready_evidence_collector_no_execution_guard_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_SAFE_OUTPUT_SCHEMA = "iris_live2d_renderer_ready_evidence_collector_safe_output_schema_v1";
export const LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_UNSAFE_OUTPUT_REJECTION_SCHEMA = "iris_live2d_renderer_ready_evidence_collector_unsafe_output_rejection_v1";
export const LIVE2D_RENDERER_READY_PUBLIC_SUMMARY_REDACTION_SCHEMA = "iris_live2d_renderer_ready_public_summary_redaction_v1";
export const LIVE2D_RENDERER_READY_ADMIN_SUMMARY_REDACTION_SCHEMA = "iris_live2d_renderer_ready_admin_summary_redaction_v1";
export const LIVE2D_RENDERER_READY_OPERATOR_HANDOFF_NO_ACTION_GUARD_SCHEMA = "iris_live2d_renderer_ready_operator_handoff_no_action_guard_v1";
export const LIVE2D_RENDERER_READY_FINAL_PRE_OWNER_BLOCKER_SUMMARY_SCHEMA = "iris_live2d_renderer_ready_final_pre_owner_blocker_summary_v1";
export const LIVE2D_RENDERER_READY_LONG_CONTINUATION_COMPLETION_REVIEW2_SCHEMA = "iris_live2d_renderer_ready_long_continuation_completion_review2_v1";
export const LIVE2D_RENDERER_READY_IMPLEMENTATION_GAP_AUDIT2_SCHEMA = "iris_live2d_renderer_ready_implementation_gap_audit2_v1";
export const LIVE2D_RENDERER_READY_PRE_OWNER_WAIT_STATE2_SCHEMA = "iris_live2d_renderer_ready_pre_owner_wait_state2_v1";
export const LIVE2D_RENDERER_READY_AUDIT_REFERENCE_STUB_SCHEMA = "iris_live2d_renderer_ready_audit_reference_stub_v1";
export const LIVE2D_RENDERER_READY_AUDIT_REFERENCE_MISSING_GUARD_SCHEMA = "iris_live2d_renderer_ready_audit_reference_missing_guard_v1";
export const LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_STUB_SCHEMA = "iris_live2d_renderer_ready_safe_operator_checklist_stub_v1";
export const LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_REDACTION_GUARD_SCHEMA = "iris_live2d_renderer_ready_safe_operator_checklist_redaction_guard_v1";
export const LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_FINAL_NO_GO_SCHEMA = "iris_live2d_renderer_ready_real_evidence_request_final_no_go_v1";
export const LIVE2D_RENDERER_READY_PREFLIGHT_ROUTE_MANIFEST_STUB_SCHEMA = "iris_live2d_renderer_ready_preflight_route_manifest_stub_v1";
export const LIVE2D_RENDERER_READY_PREFLIGHT_ROUTE_UNSAFE_FIELD_GUARD_SCHEMA = "iris_live2d_renderer_ready_preflight_route_unsafe_field_guard_v1";
export const LIVE2D_RENDERER_READY_OWNER_SCOPE_REQUIREMENT_SURFACE_SCHEMA = "iris_live2d_renderer_ready_owner_scope_requirement_surface_v1";
export const LIVE2D_RENDERER_READY_OWNER_SCOPE_MISSING_REJECTION_GUARD_SCHEMA = "iris_live2d_renderer_ready_owner_scope_missing_rejection_guard_v1";
export const LIVE2D_RENDERER_READY_AUDIT_LINK_REQUIREMENT_SURFACE_SCHEMA = "iris_live2d_renderer_ready_audit_link_requirement_surface_v1";
export const LIVE2D_RENDERER_READY_AUDIT_LINK_MISSING_REJECTION_GUARD_SCHEMA = "iris_live2d_renderer_ready_audit_link_missing_rejection_guard_v1";
export const LIVE2D_RENDERER_READY_TRUSTED_LOADER_PREAUTH_BLOCKER_SURFACE_SCHEMA = "iris_live2d_renderer_ready_trusted_loader_preauth_blocker_surface_v1";
export const LIVE2D_RENDERER_READY_TRUSTED_LOADER_PREAUTH_REJECTION_GUARD_SCHEMA = "iris_live2d_renderer_ready_trusted_loader_preauth_rejection_guard_v1";
export const LIVE2D_RENDERER_READY_RUNTIME_READINESS_FINAL_NO_GO_SCHEMA = "iris_live2d_renderer_ready_runtime_readiness_final_no_go_v1";
export const LIVE2D_RENDERER_READY_PRODUCTION_READINESS_FINAL_NO_GO_SCHEMA = "iris_live2d_renderer_ready_production_readiness_final_no_go_v1";
export const LIVE2D_RENDERER_READY_EXTENDED_GUARD_COMPLETION_REVIEW_SCHEMA = "iris_live2d_renderer_ready_extended_guard_completion_review_v2";
export const LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_FINAL_WAIT_STATE_SCHEMA = "iris_live2d_renderer_ready_real_evidence_request_final_wait_state_v1";
export const LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_REJECTION_FIXTURE_PACK_SCHEMA = "iris_live2d_renderer_ready_real_evidence_request_rejection_fixture_pack_v1";
export const LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_PACKET_SCHEMA = "iris_live2d_motion_dataset_real_row_split_policy_packet_v1";
export const LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_CHECKLIST_SCHEMA = "iris_live2d_motion_dataset_source_hash_owner_checklist_v1";
export const LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_GATE_SCHEMA = "iris_live2d_motion_dataset_final_owner_wait_for_data_gate_v1";
export const LIVE2D_OWNER_ACTION_LANE_FREEZE_STATUS_SCHEMA = "iris_live2d_owner_action_lane_freeze_status_v1";


export const LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES = Object.freeze([
  "talk",
  "focused_talk",
  "laugh_big",
  "idle_breath",
  "surprise_scream",
  "happy_humming",
  "happy_dance",
  "happy_loud_sing",
]);

export const LIVE2D_EXPERIMENTAL_MOTION_LABELS = Object.freeze([
  "blink_attention",
  "small_nod",
  "soft_smile",
  "surprise_micro",
  "breathing_shift",
  "gaze_return",
  "neutral_breath",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_SPEC_SECTIONS = Object.freeze([
  "motion_identity_profile",
  "motion_cooldown_fatigue_guard",
  "viewer_comfort_motion_policy",
  "subtitle_overlay_safety_policy",
  "gaze_pressure_boundary",
  "stale_cue_downgrade_policy",
  "strong_motion_recovery_requirement",
  "persona_motion_boundary",
  "adaptive_reaction_policy_bounded",
  "voice_motion_sync_safe_hint_boundary",
]);

export const LIVE2D_MOTION_IDENTITY_PROFILE_REQUIRED_FIELDS = Object.freeze([
  "motionLabel",
  "motionFamily",
  "personaFit",
  "identityRisk",
  "comfortRisk",
  "strongMotion",
  "recoveryRequired",
  "cooldownRequired",
  "maxDurationMsLabel",
  "staleCueAllowed",
  "subtitleOverlayRisk",
  "gazePressureRisk",
  "cameraProximityRisk",
  "donationRelationEscalationAllowed",
  "dependencyPressureSuppressed",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
]);

export const LIVE2D_STRONG_MOTION_LABELS = Object.freeze([
  "laugh_big",
  "surprise_scream",
  "happy_dance",
  "happy_loud_sing",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_RULES = Object.freeze([
  "motion_allowlist_alone_is_not_executable_readiness",
  "experimental_labels_are_not_executable_motion",
  "expression_gaze_breath_body_camera_labels_are_not_runtime_motion_without_future_verified_support",
  "strong_motion_requires_recovery",
  "strong_motion_requires_cooldown",
  "strong_motion_requires_viewer_comfort_check",
  "strong_motion_requires_subtitle_overlay_check",
  "strong_motion_requires_gaze_pressure_check_when_closeup_or_camera_proximity",
  "stale_cue_strong_motion_rejected_or_downgraded",
  "viewer_comfort_risk_downgrades_strong_motion",
  "subtitle_overlay_risk_downgrades_strong_motion",
  "gaze_pressure_risk_downgrades_strong_motion",
  "donation_relation_dependency_signal_alone_cannot_escalate_closeup_or_strong_motion",
  "voice_motion_sync_uses_safe_hints_only",
  "adaptive_reaction_is_bounded_by_context_and_confidence",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_ACCEPTED_FIXTURE_CASES = Object.freeze([
  "safe_identity_profile_labels_only",
  "safe_cooldown_required_label_only",
  "safe_recovery_required_label_only",
  "safe_comfort_risk_label_only",
  "safe_subtitle_overlay_risk_label_only",
  "safe_gaze_pressure_label_only",
  "safe_stale_cue_downgrade_label_only",
  "safe_persona_fit_label_only",
  "safe_voice_motion_sync_hint_label_only",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_REJECTED_FIXTURE_CASES = Object.freeze([
  "motion_allowlist_marked_executable_readiness",
  "experimental_label_marked_executable",
  "expression_gaze_breath_body_camera_marked_runtime_motion",
  "strong_motion_without_recovery",
  "strong_motion_without_cooldown",
  "stale_cue_strong_motion_selected",
  "comfort_risk_strong_motion_selected",
  "subtitle_overlay_risk_strong_motion_selected",
  "gaze_pressure_risk_closeup_selected",
  "donation_relation_dependency_escalates_strong_motion",
  "dependency_pressure_not_suppressed",
  "voice_motion_sync_executes_motion",
  "adaptive_reaction_unbounded",
  "renderer_ready_candidate_marked_true",
  "runtime_readiness_requested",
  "production_readiness_requested",
  "trusted_loader_enablement_requested",
  "motion_dataset_executable_requested",
  "actual_ingestion_requested",
  "owner_confirmation_marked_confirmed",
  "checked_row_count_nonzero",
  "priority1_marked_resolved",
  "unsafe_body_material_present",
  "network_or_access_material_present",
  "file_locator_value_present",
  "file_body_material_present",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_DRY_RUN_REQUIRED_INPUT_LABELS = Object.freeze([
  "motion_request_id",
  "motionLabel",
  "motionFamily",
  "personaFit",
  "identityRisk",
  "comfortRisk",
  "strongMotion",
  "recoveryRequired",
  "cooldownRequired",
  "maxDurationMsLabel",
  "staleCueAllowed",
  "subtitleOverlayRisk",
  "gazePressureRisk",
  "cameraProximityRisk",
  "donationRelationEscalationAllowed",
  "dependencyPressureSuppressed",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_DRY_RUN_REJECTION_REASONS = Object.freeze([
  "missing_motion_request_id",
  "missing_motion_label",
  "missing_motion_family",
  "missing_persona_fit",
  "missing_identity_risk",
  "missing_comfort_risk",
  "missing_strong_motion",
  "missing_recovery_required",
  "missing_cooldown_required",
  "missing_max_duration_ms_label",
  "missing_stale_cue_allowed",
  "missing_subtitle_overlay_risk",
  "missing_gaze_pressure_risk",
  "missing_camera_proximity_risk",
  "missing_donation_relation_escalation_allowed",
  "missing_dependency_pressure_suppressed",
  "missing_safe_downgrade_motion",
  "missing_safe_recovery_motion",
  "motion_allowlist_marked_executable_readiness",
  "experimental_label_marked_executable",
  "strong_motion_without_recovery",
  "strong_motion_without_cooldown",
  "stale_cue_strong_motion_selected",
  "comfort_risk_strong_motion_selected",
  "subtitle_overlay_risk_strong_motion_selected",
  "gaze_pressure_risk_closeup_selected",
  "donation_relation_dependency_escalates_strong_motion",
  "dependency_pressure_not_suppressed",
  "voice_motion_sync_executes_motion",
  "adaptive_reaction_unbounded",
  "renderer_ready_candidate_marked_true",
  "runtime_readiness_requested",
  "production_readiness_requested",
  "trusted_loader_enablement_requested",
  "motion_dataset_executable_requested",
  "actual_ingestion_requested",
  "checked_row_count_nonzero",
  "priority1_marked_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_RECOVERY_MATRIX_REQUIRED_FIELDS = Object.freeze([
  "sourceMotionLabel",
  "strongMotion",
  "recoveryRequired",
  "cooldownRequired",
  "safeRecoveryMotion",
  "safeDowngradeMotion",
  "staleCueDowngradeMotion",
  "comfortRiskDowngradeMotion",
  "subtitleOverlayDowngradeMotion",
  "gazePressureDowngradeMotion",
  "maxDurationMsLabel",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_RECOVERY_MATRIX_ROWS = Object.freeze([
  "talk_to_idle_breath_recovery_optional",
  "focused_talk_to_idle_breath_recovery_optional",
  "laugh_big_to_idle_breath_recovery_required",
  "surprise_scream_to_idle_breath_recovery_required",
  "happy_humming_to_idle_breath_recovery_optional",
  "happy_dance_to_idle_breath_recovery_required",
  "happy_loud_sing_to_idle_breath_recovery_required",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_RECOVERY_MATRIX_BLOCKERS = Object.freeze([
  "strong_motion_missing_safe_recovery_motion",
  "strong_motion_missing_cooldown",
  "strong_motion_missing_max_duration_label",
  "stale_cue_missing_downgrade_motion",
  "comfort_risk_missing_downgrade_motion",
  "subtitle_overlay_risk_missing_downgrade_motion",
  "gaze_pressure_risk_missing_downgrade_motion",
  "recovery_motion_marked_executable_readiness",
  "matrix_claims_runtime_ready",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_CONTEXT_GATE_REQUIRED_LABELS = Object.freeze([
  "contextSourceLabel",
  "contextFreshnessLabel",
  "cueAgeBucketLabel",
  "confidenceLabel",
  "viewerComfortStateLabel",
  "sceneVisibilityLabel",
  "subtitleVisibilityLabel",
  "cameraProximityLabel",
  "donationSignalLabel",
  "relationSignalLabel",
  "dependencySignalLabel",
  "voiceEnergyLabel",
  "safeMotionCandidate",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_CONTEXT_GATE_REJECTIONS = Object.freeze([
  "missing_context_source_label",
  "missing_context_freshness_label",
  "missing_cue_age_bucket_label",
  "missing_confidence_label",
  "missing_viewer_comfort_state_label",
  "missing_scene_visibility_label",
  "missing_subtitle_visibility_label",
  "missing_camera_proximity_label",
  "missing_safe_downgrade_motion",
  "missing_safe_recovery_motion",
  "stale_context_strong_motion_selected",
  "low_confidence_strong_motion_selected",
  "viewer_comfort_risk_strong_motion_selected",
  "subtitle_visibility_risk_strong_motion_selected",
  "camera_proximity_risk_strong_motion_selected",
  "donation_relation_dependency_only_escalation",
  "dependency_pressure_not_suppressed",
  "unsupported_motion_candidate",
  "context_gate_claims_runtime_ready",
  "renderer_ready_candidate_marked_true",
  "actual_ingestion_requested",
  "checked_row_count_nonzero",
  "priority1_marked_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_SUBTITLE_GAZE_REQUIRED_LABELS = Object.freeze([
  "subtitleVisibilityLabel",
  "subtitleOverlayRisk",
  "captionSafeRegionLabel",
  "gazePressureRisk",
  "cameraProximityRisk",
  "closeupAllowedLabel",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
  "maxDurationMsLabel",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_SUBTITLE_GAZE_REJECTIONS = Object.freeze([
  "missing_subtitle_visibility_label",
  "missing_subtitle_overlay_risk",
  "missing_caption_safe_region_label",
  "missing_gaze_pressure_risk",
  "missing_camera_proximity_risk",
  "missing_closeup_allowed_label",
  "missing_safe_downgrade_motion",
  "missing_safe_recovery_motion",
  "subtitle_overlay_risk_strong_motion_selected",
  "subtitle_overlay_risk_closeup_selected",
  "gaze_pressure_risk_strong_motion_selected",
  "gaze_pressure_risk_closeup_selected",
  "camera_proximity_risk_strong_motion_selected",
  "camera_proximity_risk_closeup_selected",
  "caption_region_obstructed",
  "subtitle_gaze_guard_claims_runtime_ready",
  "renderer_ready_candidate_marked_true",
  "actual_ingestion_requested",
  "checked_row_count_nonzero",
  "priority1_marked_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_PERSONA_PRESSURE_REQUIRED_LABELS = Object.freeze([
  "personaFit",
  "donationSignalLabel",
  "relationSignalLabel",
  "dependencySignalLabel",
  "dependencyPressureSuppressed",
  "emotionalIntensityLabel",
  "safeMotionCandidate",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_PERSONA_PRESSURE_REJECTIONS = Object.freeze([
  "missing_persona_fit",
  "missing_donation_signal_label",
  "missing_relation_signal_label",
  "missing_dependency_signal_label",
  "missing_dependency_pressure_suppressed",
  "missing_emotional_intensity_label",
  "missing_safe_motion_candidate",
  "missing_safe_downgrade_motion",
  "missing_safe_recovery_motion",
  "donation_signal_escalates_strong_motion",
  "relation_signal_escalates_strong_motion",
  "dependency_signal_escalates_strong_motion",
  "dependency_pressure_not_suppressed",
  "persona_fit_claims_relationship_commitment",
  "persona_pressure_claims_runtime_ready",
  "renderer_ready_candidate_marked_true",
  "actual_ingestion_requested",
  "checked_row_count_nonzero",
  "priority1_marked_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_VOICE_SYNC_HINT_REQUIRED_LABELS = Object.freeze([
  "voiceEnergyLabel",
  "speechPaceLabel",
  "voiceSyncHintLabel",
  "motionTimingHintLabel",
  "emotionIntensityLabel",
  "safeMotionCandidate",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
  "maxDurationMsLabel",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_VOICE_SYNC_HINT_REJECTIONS = Object.freeze([
  "missing_voice_energy_label",
  "missing_speech_pace_label",
  "missing_voice_sync_hint_label",
  "missing_motion_timing_hint_label",
  "missing_emotion_intensity_label",
  "missing_safe_motion_candidate",
  "missing_safe_downgrade_motion",
  "missing_safe_recovery_motion",
  "missing_max_duration_label",
  "voice_sync_hint_executes_motion",
  "voice_timing_hint_applies_cue",
  "voice_sync_hint_claims_runtime_ready",
  "audio_runtime_execution_requested",
  "tts_runtime_execution_requested",
  "external_service_requested",
  "renderer_ready_candidate_marked_true",
  "actual_ingestion_requested",
  "checked_row_count_nonzero",
  "priority1_marked_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_ADAPTIVE_BOUNDS_REQUIRED_LABELS = Object.freeze([
  "adaptiveReactionPolicy",
  "adaptiveReactionBoundednessStatus",
  "adaptiveMotionCandidate",
  "adaptiveMotionDowngraded",
  "adaptiveMotionRejected",
  "adaptiveMotionRejectReason",
  "adaptiveMotionSafeFallback",
  "adaptiveContextConfidence",
  "adaptiveContextFreshness",
  "adaptiveRecentStrongMotionHistory",
  "adaptiveViewerComfortMode",
  "adaptiveModerationBoundary",
  "adaptiveDependencyPressureBoundary",
  "adaptiveDonationRelationBoundary",
  "adaptiveSeriousFocusBoundary",
  "adaptationWindowLabel",
  "maxConsecutiveStrongMotionLabel",
  "cooldownBucketLabel",
  "contextConfidenceLabel",
  "viewerComfortStateLabel",
  "staleCueAllowed",
  "safeMotionCandidate",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
]);

export const LIVE2D_MOTION_IDENTITY_AND_COMFORT_ADAPTIVE_BOUNDS_REJECTIONS = Object.freeze([
  "missing_adaptation_window_label",
  "missing_max_consecutive_strong_motion_label",
  "missing_cooldown_bucket_label",
  "missing_context_confidence_label",
  "missing_viewer_comfort_state_label",
  "missing_stale_cue_allowed",
  "missing_safe_motion_candidate",
  "missing_safe_downgrade_motion",
  "missing_safe_recovery_motion",
  "adaptive_reaction_unbounded",
  "repeated_strong_motion_without_cooldown",
  "low_confidence_escalates_motion",
  "stale_context_escalates_motion",
  "comfort_risk_escalates_motion",
  "serious_focus_playful_strong_motion",
  "moderation_limited_personalized_strong_motion",
  "crisis_signal_closeup_selected",
  "minor_signal_closeup_selected",
  "romantic_pressure_closeup_selected",
  "dependency_pressure_strong_motion_selected",
  "donation_relation_escalates_motion",
  "recent_strong_motion_repeat_without_downgrade",
  "experimental_motion_executable_selected",
  "unsafe_renderer_material_present",
  "network_material_present",
  "adaptive_bounds_claims_runtime_ready",
  "renderer_ready_candidate_marked_true",
  "actual_ingestion_requested",
  "checked_row_count_nonzero",
  "priority1_marked_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_PHASES = Object.freeze([
  "spec_phase",
  "fixture_rejection_phase",
  "dry_run_validator_phase",
  "recovery_matrix_phase",
  "context_gate_phase",
  "subtitle_gaze_guard_phase",
  "persona_pressure_guard_phase",
  "voice_sync_hint_boundary_phase",
  "adaptive_boundedness_phase",
  "status_surface_phase",
  "cross_surface_consistency_phase",
  "redaction_no_sweetening_phase",
  "future_real_renderer_evidence_phase_owner_action_only",
  "future_actual_renderer_probe_phase_owner_confirmation_only",
  "future_trusted_loader_phase_owner_confirmation_and_real_evidence_only",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_BOUNDARIES = Object.freeze([
  "schedule_is_not_readiness",
  "schedule_is_not_execution",
  "schedule_is_not_owner_confirmation",
  "runtime_readiness_false",
  "production_readiness_false",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_COMPLETED_ITEMS = Object.freeze([
  "motion_identity_comfort_spec",
  "motion_identity_comfort_rejection_fixture_pack",
  "motion_identity_comfort_dry_run_validator",
  "motion_identity_comfort_recovery_matrix",
  "motion_identity_comfort_context_gate",
  "motion_identity_comfort_subtitle_gaze_guard",
  "motion_identity_comfort_persona_pressure_guard",
  "motion_identity_comfort_voice_sync_hint_boundary",
  "motion_identity_comfort_adaptive_boundedness",
  "motion_identity_comfort_development_schedule",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_OPEN_BLOCKERS = Object.freeze([
  "actual_renderer_evidence_missing",
  "actual_cue_application_evidence_missing",
  "actual_model_load_evidence_missing",
  "actual_scene_load_evidence_missing",
  "owner_confirmation_missing",
  "trusted_loader_disabled",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "runtime_readiness_not_claimed",
  "production_readiness_not_claimed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_REJECTIONS = Object.freeze([
  "completion_review_claims_runtime_ready",
  "completion_review_claims_production_ready",
  "completion_review_marks_priority1_resolved",
  "completion_review_sets_checked_row_count_nonzero",
  "completion_review_makes_motion_dataset_executable",
  "completion_review_enables_trusted_loader",
  "completion_review_creates_owner_confirmation",
  "completion_review_starts_actual_renderer_probe",
  "completion_review_accepts_actual_data",
]);

export const LIVE2D_MOTION_IDENTITY_PROFILE_STATUS_SAFE_LABELS = Object.freeze([
  "motionLabel",
  "motionFamily",
  "personaFit",
  "identityRisk",
  "comfortRisk",
  "strongMotion",
  "recoveryRequired",
  "cooldownRequired",
  "maxDurationMsLabel",
  "staleCueAllowed",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
]);

export const LIVE2D_MOTION_IDENTITY_PROFILE_STATUS_REJECTIONS = Object.freeze([
  "identity_profile_executes_motion",
  "identity_profile_claims_runtime_ready",
  "identity_profile_claims_production_ready",
  "identity_profile_marks_experimental_executable",
  "identity_profile_accepts_renderer_material",
  "identity_profile_accepts_network_material",
  "identity_profile_creates_owner_confirmation",
  "identity_profile_enables_trusted_loader",
  "identity_profile_accepts_actual_data",
  "identity_profile_sets_checked_row_count_nonzero",
  "identity_profile_marks_priority1_resolved",
]);

export const LIVE2D_MOTION_COMFORT_POLICY_STATUS_LABELS = Object.freeze([
  "viewerComfortMode",
  "cooldownBucketLabel",
  "fatigueRiskLabel",
  "photosensitivityRiskLabel",
  "subtitleOverlayRisk",
  "gazePressureRisk",
  "cameraProximityRisk",
  "safeDowngradeMotion",
  "safeRecoveryMotion",
  "strongMotionPolicy",
]);

export const LIVE2D_MOTION_COMFORT_POLICY_STATUS_REJECTIONS = Object.freeze([
  "comfort_policy_executes_motion",
  "comfort_policy_marks_strong_motion_ready",
  "comfort_policy_viewer_risk_escalates_motion",
  "comfort_policy_ignores_cooldown",
  "comfort_policy_ignores_fatigue",
  "comfort_policy_ignores_photosensitivity",
  "comfort_policy_ignores_subtitle_risk",
  "comfort_policy_ignores_gaze_risk",
  "comfort_policy_ignores_camera_risk",
  "comfort_policy_claims_runtime_ready",
  "comfort_policy_claims_production_ready",
  "comfort_policy_enables_trusted_loader",
  "comfort_policy_accepts_actual_data",
  "comfort_policy_marks_priority1_resolved",
]);

export const LIVE2D_MOTION_FRESHNESS_POLICY_SURFACES = Object.freeze([
  "status",
  "health",
  "runtime_config",
]);

export const LIVE2D_MOTION_FRESHNESS_POLICY_REJECTIONS = Object.freeze([
  "stale_cue_strong_motion_selected",
  "stale_cue_runtime_ready_claim",
  "freshness_policy_mismatch_between_surfaces",
  "safe_downgrade_mismatch_between_surfaces",
  "freshness_policy_executes_motion",
  "freshness_policy_applies_cue",
  "freshness_policy_claims_runtime_ready",
  "freshness_policy_claims_production_ready",
  "freshness_policy_accepts_actual_data",
  "freshness_policy_marks_priority1_resolved",
]);

export const LIVE2D_MOTION_STRONG_MOTION_UNSAFE_OVERRIDE_REJECTIONS = Object.freeze([
  "surprise_scream_executable_override",
  "happy_dance_executable_override",
  "laugh_big_without_recovery",
  "happy_loud_sing_without_cooldown",
  "strong_motion_ready_true",
  "renderer_ready_claimed_true",
  "strong_motion_runtime_ready_claim",
  "strong_motion_production_ready_claim",
  "strong_motion_owner_confirmation_created",
  "strong_motion_trusted_loader_enabled",
  "strong_motion_actual_data_accepted",
  "strong_motion_priority1_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_REDACTION_SWEEP_SURFACES = Object.freeze([
  "motion_identity_profile_status_surface",
  "motion_comfort_policy_status_surface",
  "motion_freshness_policy_cross_surface_consistency",
  "motion_strong_motion_unsafe_override_rejection",
  "motion_identity_comfort_completion_review",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_REDACTION_SWEEP_REJECTIONS = Object.freeze([
  "unsafe_network_locator_material",
  "unsafe_auth_material",
  "unsafe_renderer_material",
  "unsafe_cue_material",
  "unsafe_model_locator_material",
  "unsafe_motion_locator_material",
  "unsafe_runtime_material",
  "unsafe_operator_note_material",
  "redaction_sweep_executes_scan",
  "redaction_sweep_claims_runtime_ready",
  "redaction_sweep_accepts_actual_data",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_INPUTS = Object.freeze([
  "motion_spec_completion",
  "fixture_pass",
  "dry_run_pass",
  "schedule_update",
  "completion_review",
  "status_surface_present",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_REJECTIONS = Object.freeze([
  "spec_completion_promoted_to_readiness",
  "fixture_pass_promoted_to_readiness",
  "dry_run_pass_promoted_to_readiness",
  "schedule_update_promoted_to_readiness",
  "completion_review_promoted_to_readiness",
  "status_surface_promoted_to_execution",
  "experimental_label_marked_executable",
  "runtime_motion_marked_executable",
  "strong_motion_marked_ready",
  "priority1_marked_resolved",
  "checked_row_count_increased",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_AUDIT_ITEMS = Object.freeze([
  "real_renderer_evidence_missing",
  "actual_cue_application_evidence_missing",
  "real_model_load_evidence_missing",
  "real_scene_load_evidence_missing",
  "owner_confirmation_missing",
  "trusted_loader_disabled",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "runtime_readiness_not_claimed",
  "production_readiness_not_claimed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_AUDIT_REJECTIONS = Object.freeze([
  "gap_audit_executes_renderer",
  "gap_audit_applies_cue",
  "gap_audit_loads_model",
  "gap_audit_loads_scene",
  "gap_audit_creates_owner_confirmation",
  "gap_audit_enables_trusted_loader",
  "gap_audit_accepts_actual_data",
  "gap_audit_claims_runtime_ready",
  "gap_audit_claims_production_ready",
  "gap_audit_marks_priority1_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_REGISTER_CATEGORIES = Object.freeze([
  "renderer_evidence_gap",
  "cue_application_gap",
  "model_scene_evidence_gap",
  "owner_confirmation_gap",
  "trusted_loader_gap",
  "priority1_blocker_gap",
  "row_count_gap",
  "motion_dataset_execution_gap",
  "readiness_claim_gap",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_REGISTER_ACTIONS = Object.freeze([
  "keep_renderer_execution_blocked",
  "keep_cue_application_blocked",
  "keep_model_scene_load_blocked",
  "keep_owner_confirmation_missing",
  "keep_trusted_loader_disabled",
  "keep_priority1_blocked",
  "keep_checked_row_count_zero",
  "keep_motion_dataset_non_executable",
  "keep_readiness_claims_false",
  "prepare_safe_gap_review2",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_REGISTER_REJECTIONS = Object.freeze([
  "gap_register_executes_renderer",
  "gap_register_applies_cue",
  "gap_register_loads_model",
  "gap_register_loads_scene",
  "gap_register_creates_owner_confirmation",
  "gap_register_enables_trusted_loader",
  "gap_register_accepts_actual_data",
  "gap_register_claims_runtime_ready",
  "gap_register_claims_production_ready",
  "gap_register_marks_priority1_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_LONG_CONTINUATION_REVIEW2_COMPLETED_ITEMS = Object.freeze([
  "identity_comfort_spec_completed",
  "rejection_fixture_pack_completed",
  "dry_run_validator_completed",
  "recovery_matrix_completed",
  "context_gate_completed",
  "subtitle_gaze_guard_completed",
  "persona_pressure_guard_completed",
  "voice_sync_hint_boundary_completed",
  "adaptive_bounds_completed",
  "development_schedule_completed",
  "completion_review_completed",
  "status_surfaces_completed",
  "freshness_policy_consistency_completed",
  "strong_motion_unsafe_override_rejection_completed",
  "redaction_sweep_completed",
  "no_sweetening_sweep_completed",
  "implementation_gap_audit_completed",
  "implementation_gap_register_completed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_LONG_CONTINUATION_REVIEW2_OPEN_BLOCKERS = Object.freeze([
  "real_renderer_evidence_missing",
  "actual_cue_application_evidence_missing",
  "real_model_scene_evidence_missing",
  "owner_confirmation_missing",
  "trusted_loader_disabled",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "runtime_readiness_not_claimed",
  "production_readiness_not_claimed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_LONG_CONTINUATION_REVIEW2_REJECTIONS = Object.freeze([
  "review2_executes_renderer",
  "review2_applies_cue",
  "review2_loads_model",
  "review2_loads_scene",
  "review2_creates_owner_confirmation",
  "review2_enables_trusted_loader",
  "review2_accepts_actual_data",
  "review2_claims_runtime_ready",
  "review2_claims_production_ready",
  "review2_marks_priority1_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_LONG_CONTINUATION_COMPLETION_REVIEW3_COMPLETED_ITEMS = Object.freeze([
  "role_gate_stub_completed",
  "role_gate_redaction_guard_completed",
  "audit_stub_no_write_completed",
  "audit_unsafe_field_guard_completed",
  "repeated_blocker_grouping_completed",
  "repeated_blocker_grouping_contract_completed",
  "continuation_ledger_completed",
  "continuation_ledger_consistency_completed",
  "final_redaction_sweep2_completed",
  "final_no_sweetening_sweep2_completed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_LONG_CONTINUATION_COMPLETION_REVIEW3_OPEN_BLOCKERS = Object.freeze([
  "real_renderer_evidence_missing",
  "actual_cue_application_evidence_missing",
  "real_model_scene_evidence_missing",
  "owner_confirmation_missing",
  "trusted_loader_disabled",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "runtime_readiness_not_claimed",
  "production_readiness_not_claimed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_LONG_CONTINUATION_COMPLETION_REVIEW3_REJECTIONS = Object.freeze([
  "review3_executes_renderer",
  "review3_applies_cue",
  "review3_loads_model",
  "review3_loads_scene",
  "review3_executes_audit",
  "review3_creates_owner_confirmation",
  "review3_enables_trusted_loader",
  "review3_accepts_actual_data",
  "review3_claims_runtime_ready",
  "review3_claims_production_ready",
  "review3_marks_priority1_resolved",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_SECTIONS = Object.freeze([
  "identity_profile_status",
  "comfort_policy_status",
  "freshness_policy_status",
  "strong_motion_policy_status",
  "adaptive_bounds_status",
  "implementation_gap_status",
  "public_boundary_status",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_ALLOWED_LABELS = Object.freeze([
  "safe_summary_only",
  "public_safe_labels_only",
  "identity_profile_blocked",
  "comfort_policy_blocked",
  "freshness_policy_blocked",
  "strong_motion_policy_blocked",
  "adaptive_bounds_blocked",
  "implementation_gaps_open",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
  "readiness_not_claimed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_REJECTIONS = Object.freeze([
  "public_summary_reflects_network_locator_material",
  "public_summary_reflects_auth_material",
  "public_summary_reflects_renderer_material",
  "public_summary_reflects_cue_material",
  "public_summary_reflects_model_locator_material",
  "public_summary_reflects_motion_locator_material",
  "public_summary_reflects_owner_only_detail",
  "public_summary_reflects_private_relation_signal",
  "public_summary_reflects_private_support_signal",
  "public_summary_reflects_dependency_note_material",
  "public_summary_claims_runtime_ready",
  "public_summary_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_ADMIN_SUMMARY_REDACTION_FIELDS = Object.freeze([
  "admin_ordinary_summary_status",
  "identity_profile_status_label",
  "comfort_policy_status_label",
  "freshness_policy_status_label",
  "strong_motion_policy_status_label",
  "adaptive_bounds_status_label",
  "implementation_gap_status_label",
  "redaction_boundary_status",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_ADMIN_SUMMARY_REDACTION_REJECTIONS = Object.freeze([
  "admin_summary_reflects_network_locator_material",
  "admin_summary_reflects_auth_material",
  "admin_summary_reflects_renderer_material",
  "admin_summary_reflects_cue_material",
  "admin_summary_reflects_model_locator_material",
  "admin_summary_reflects_motion_locator_material",
  "admin_summary_reflects_owner_only_detail",
  "admin_summary_reflects_private_relation_signal",
  "admin_summary_reflects_private_support_signal",
  "admin_summary_reflects_dependency_note_material",
  "admin_summary_claims_runtime_ready",
  "admin_summary_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ADMIN_SURFACE_ALIGNMENT_CHECKS = Object.freeze([
  "public_summary_stays_public_safe",
  "admin_ordinary_summary_stays_redacted",
  "owner_only_detail_absent_from_public",
  "owner_only_detail_absent_from_admin_ordinary",
  "readiness_claims_absent",
  "actual_data_absent",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ADMIN_SURFACE_ALIGNMENT_REJECTIONS = Object.freeze([
  "alignment_reflects_network_locator_material",
  "alignment_reflects_auth_material",
  "alignment_reflects_renderer_material",
  "alignment_reflects_cue_material",
  "alignment_reflects_model_locator_material",
  "alignment_reflects_motion_locator_material",
  "alignment_reflects_owner_only_detail",
  "alignment_reflects_private_relation_signal",
  "alignment_reflects_private_support_signal",
  "alignment_claims_runtime_ready",
  "alignment_claims_production_ready",
  "alignment_accepts_actual_data",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_ONLY_DETAIL_ROLE_GATE_STUB2_RULES = Object.freeze([
  "owner_only_detail_stub2_not_materialized",
  "owner_only_detail_stub2_not_public",
  "owner_only_detail_stub2_not_admin_ordinary",
  "owner_only_detail_stub2_not_operator_visible",
  "owner_only_detail_stub2_requires_future_explicit_owner_action",
  "readiness_claims_absent",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_ONLY_DETAIL_ROLE_GATE_STUB2_REJECTIONS = Object.freeze([
  "owner_only_detail_stub2_materialized",
  "owner_only_detail_stub2_public_visible",
  "owner_only_detail_stub2_admin_ordinary_visible",
  "owner_only_detail_stub2_operator_visible",
  "owner_only_detail_stub2_requests_owner_action",
  "owner_only_detail_stub2_creates_owner_confirmation",
  "owner_only_detail_stub2_accepts_actual_data",
  "owner_only_detail_stub2_claims_runtime_ready",
  "owner_only_detail_stub2_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ROLE_GATE_LEAK_REJECTION_LABELS = Object.freeze([
  "public_role_gate_owner_only_detail_leak",
  "public_role_gate_private_relation_signal_leak",
  "public_role_gate_private_support_signal_leak",
  "public_role_gate_locator_material_leak",
  "public_role_gate_auth_material_leak",
  "public_role_gate_readiness_claim_leak",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ROLE_GATE_LEAK_REJECTION_REJECTIONS = Object.freeze([
  "public_role_gate_leak_allows_owner_only_detail",
  "public_role_gate_leak_allows_private_relation_signal",
  "public_role_gate_leak_allows_private_support_signal",
  "public_role_gate_leak_allows_locator_material",
  "public_role_gate_leak_allows_auth_material",
  "public_role_gate_leak_allows_runtime_ready",
  "public_role_gate_leak_allows_production_ready",
  "public_role_gate_leak_accepts_actual_data",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_OPERATOR_HANDOFF_NO_ACTION_ITEMS = Object.freeze([
  "operator_handoff_plan_present",
  "operator_handoff_not_sent",
  "operator_action_not_executed",
  "renderer_execution_not_started",
  "cue_application_not_started",
  "external_connection_not_started",
  "owner_confirmation_not_created",
  "readiness_not_claimed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_OPERATOR_HANDOFF_NO_ACTION_REJECTIONS = Object.freeze([
  "operator_handoff_sent",
  "operator_action_executed",
  "renderer_execution_started",
  "cue_application_started",
  "external_connection_started",
  "operator_handoff_claims_runtime_ready",
  "operator_handoff_claims_production_ready",
  "operator_handoff_creates_owner_confirmation",
  "operator_handoff_enables_trusted_loader",
  "operator_handoff_accepts_actual_data",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_REVIEW_SECTIONS = Object.freeze([
  "motion_identity_status_review",
  "comfort_policy_status_review",
  "freshness_policy_status_review",
  "strong_motion_policy_status_review",
  "adaptive_bounds_status_review",
  "implementation_gap_status_review",
  "remaining_blocker_review",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_BLOCKERS = Object.freeze([
  "real_renderer_evidence_missing",
  "actual_cue_application_evidence_missing",
  "real_model_scene_evidence_missing",
  "owner_confirmation_missing",
  "trusted_loader_disabled",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "readiness_not_claimed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_REJECTIONS = Object.freeze([
  "owner_handoff_sent",
  "owner_action_requested",
  "owner_confirmation_created",
  "owner_confirmation_confirmed",
  "owner_handoff_accepts_actual_data",
  "owner_handoff_executes_renderer",
  "owner_handoff_applies_cue",
  "owner_handoff_enables_trusted_loader",
  "owner_handoff_claims_runtime_ready",
  "owner_handoff_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_ROLES = Object.freeze([
  "public_safe_summary",
  "admin_ordinary_summary",
  "operator_safe_handoff_plan",
  "owner_only_detail_stub",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_RULES = Object.freeze([
  "public_view_safe_labels_only",
  "admin_ordinary_safe_labels_only",
  "operator_view_safe_labels_only",
  "owner_only_detail_not_exposed",
  "source_material_not_reflected",
  "readiness_not_claimed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_REJECTIONS = Object.freeze([
  "role_gate_exposes_owner_only_detail_public",
  "role_gate_exposes_owner_only_detail_admin",
  "role_gate_reflects_network_locator_material",
  "role_gate_reflects_auth_material",
  "role_gate_reflects_renderer_material",
  "role_gate_reflects_cue_material",
  "role_gate_reflects_private_relation_signal",
  "role_gate_reflects_private_support_signal",
  "role_gate_claims_runtime_ready",
  "role_gate_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_FIELDS = Object.freeze([
  "public_safe_summary",
  "admin_ordinary_summary",
  "operator_safe_handoff_plan",
  "owner_only_detail_stub",
  "safe_role_label",
  "safe_blocker_label",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_REJECTIONS = Object.freeze([
  "role_gate_redaction_exposes_owner_only_detail_public",
  "role_gate_redaction_exposes_owner_only_detail_admin",
  "role_gate_redaction_exposes_owner_only_detail_operator",
  "role_gate_redaction_reflects_network_locator_material",
  "role_gate_redaction_reflects_auth_material",
  "role_gate_redaction_reflects_renderer_material",
  "role_gate_redaction_reflects_cue_material",
  "role_gate_redaction_reflects_private_relation_signal",
  "role_gate_redaction_reflects_private_support_signal",
  "role_gate_redaction_claims_runtime_ready",
  "role_gate_redaction_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_STUB_NO_WRITE_FIELDS = Object.freeze([
  "audit_stub_id_label",
  "audit_scope_label",
  "audit_status_label",
  "safe_surface_label",
  "blocked_reason_label",
  "no_write_boundary_label",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_STUB_NO_WRITE_REJECTIONS = Object.freeze([
  "audit_stub_writes_artifact",
  "audit_stub_executes_audit",
  "audit_stub_reads_source_material",
  "audit_stub_reads_file_content",
  "audit_stub_accepts_file_identity_value",
  "audit_stub_reflects_network_locator_material",
  "audit_stub_reflects_auth_material",
  "audit_stub_reflects_owner_private_detail",
  "audit_stub_claims_runtime_ready",
  "audit_stub_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_STUB_NO_WRITE2_FIELDS = Object.freeze([
  "audit_event_stub2_label",
  "audit_event_write_not_attempted",
  "audit_entry_not_created",
  "audit_execution_not_started",
  "public_role_gate_leak_rejection_completed",
  "owner_only_detail_stub2_blocked",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_STUB_NO_WRITE2_REJECTIONS = Object.freeze([
  "audit_event_stub2_writes_audit_event",
  "audit_event_stub2_creates_audit_entry",
  "audit_event_stub2_executes_audit",
  "audit_event_stub2_accepts_actual_data",
  "audit_event_stub2_exposes_owner_only_detail",
  "audit_event_stub2_claims_runtime_ready",
  "audit_event_stub2_claims_production_ready",
  "audit_event_stub2_resolves_priority1",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_UNSAFE_FIELD_GUARD2_LABELS = Object.freeze([
  "audit_event_safe_label_only",
  "renderer_material_absent",
  "cue_material_absent",
  "model_locator_material_absent",
  "motion_locator_material_absent",
  "network_locator_material_absent",
  "access_material_absent",
  "private_relation_signal_absent",
  "private_support_signal_absent",
  "operator_instruction_material_absent",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_UNSAFE_FIELD_GUARD2_REJECTIONS = Object.freeze([
  "audit_event_guard2_renderer_material_present",
  "audit_event_guard2_cue_material_present",
  "audit_event_guard2_model_locator_material_present",
  "audit_event_guard2_motion_locator_material_present",
  "audit_event_guard2_network_locator_material_present",
  "audit_event_guard2_access_material_present",
  "audit_event_guard2_private_relation_signal_present",
  "audit_event_guard2_private_support_signal_present",
  "audit_event_guard2_operator_instruction_material_present",
  "audit_event_guard2_audit_body_material_present",
  "audit_event_guard2_claims_runtime_ready",
  "audit_event_guard2_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_UNSAFE_FIELD_GUARD_LABELS = Object.freeze([
  "safe_audit_label_only",
  "safe_surface_label_only",
  "source_material_absent",
  "network_material_absent",
  "access_material_absent",
  "owner_private_detail_absent",
  "readiness_claim_absent",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_UNSAFE_FIELD_GUARD_REJECTIONS = Object.freeze([
  "audit_guard_unsafe_source_material_present",
  "audit_guard_network_locator_material_present",
  "audit_guard_access_material_present",
  "audit_guard_owner_private_detail_present",
  "audit_guard_renderer_material_present",
  "audit_guard_cue_material_present",
  "audit_guard_file_content_present",
  "audit_guard_identity_value_present",
  "audit_guard_claims_runtime_ready",
  "audit_guard_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_GROUPS = Object.freeze([
  "owner_action_blockers",
  "real_evidence_blockers",
  "dataset_blockers",
  "execution_blockers",
  "readiness_blockers",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_LABELS = Object.freeze([
  "owner_confirmation_missing",
  "owner_action_not_requested",
  "real_renderer_evidence_missing",
  "actual_cue_application_evidence_missing",
  "audit_execution_not_started",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
  "readiness_claims_false",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_REJECTIONS = Object.freeze([
  "blocker_grouping_status_surface_claims_resolution",
  "blocker_grouping_status_surface_authorizes_work",
  "blocker_grouping_status_surface_sets_checked_count",
  "blocker_grouping_status_surface_makes_motion_executable",
  "blocker_grouping_status_surface_enables_trusted_loader",
  "blocker_grouping_status_surface_creates_owner_confirmation",
  "blocker_grouping_status_surface_claims_runtime_ready",
  "blocker_grouping_status_surface_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_CONTRACT2_RULES = Object.freeze([
  "grouped_blockers_match_status_surface",
  "grouped_blockers_match_health_surface",
  "grouped_blockers_match_runtime_config_surface",
  "grouped_blockers_do_not_resolve_blockers",
  "grouped_blockers_do_not_grant_work_permission",
  "grouped_blockers_preserve_priority1_blocked",
  "grouped_blockers_preserve_checked_row_count_zero",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_CONTRACT2_REJECTIONS = Object.freeze([
  "blocker_grouping_contract2_status_mismatch",
  "blocker_grouping_contract2_health_mismatch",
  "blocker_grouping_contract2_runtime_config_mismatch",
  "blocker_grouping_contract2_claims_resolution",
  "blocker_grouping_contract2_grants_work_permission",
  "blocker_grouping_contract2_sets_checked_count",
  "blocker_grouping_contract2_makes_motion_executable",
  "blocker_grouping_contract2_claims_runtime_ready",
  "blocker_grouping_contract2_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPS = Object.freeze([
  "owner_action_blockers",
  "real_evidence_blockers",
  "dataset_blockers",
  "execution_blockers",
  "readiness_blockers",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_LABELS = Object.freeze([
  "owner_confirmation_missing",
  "real_renderer_evidence_missing",
  "actual_cue_application_evidence_missing",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
  "readiness_claims_false",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_REJECTIONS = Object.freeze([
  "blocker_grouping_claims_resolution",
  "blocker_grouping_changes_priority1",
  "blocker_grouping_sets_checked_count",
  "blocker_grouping_makes_motion_executable",
  "blocker_grouping_enables_trusted_loader",
  "blocker_grouping_creates_owner_confirmation",
  "blocker_grouping_claims_runtime_ready",
  "blocker_grouping_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_CONTRACT_RULES = Object.freeze([
  "grouping_is_label_only",
  "grouping_does_not_resolve_blockers",
  "grouping_preserves_priority1_blocked",
  "grouping_preserves_checked_row_count_zero",
  "grouping_preserves_motion_non_executable",
  "grouping_preserves_readiness_false",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_CONTRACT_REJECTIONS = Object.freeze([
  "grouping_contract_claims_resolution",
  "grouping_contract_omits_priority1_blocked",
  "grouping_contract_omits_checked_row_count_zero",
  "grouping_contract_omits_motion_dataset_non_executable",
  "grouping_contract_enables_trusted_loader",
  "grouping_contract_creates_owner_confirmation",
  "grouping_contract_claims_runtime_ready",
  "grouping_contract_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_ENTRIES = Object.freeze([
  "role_gate_stub_completed",
  "role_gate_redaction_guard_completed",
  "audit_stub_no_write_completed",
  "audit_unsafe_field_guard_completed",
  "repeated_blocker_grouping_completed",
  "repeated_blocker_grouping_contract_completed",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_REJECTIONS = Object.freeze([
  "continuation_ledger_claims_owner_action",
  "continuation_ledger_claims_blocker_resolution",
  "continuation_ledger_claims_runtime_ready",
  "continuation_ledger_claims_production_ready",
  "continuation_ledger_changes_checked_count",
  "continuation_ledger_makes_motion_executable",
  "continuation_ledger_enables_trusted_loader",
  "continuation_ledger_starts_actual_data",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_ENTRIES = Object.freeze([
  "role_gate_stub_completed",
  "public_role_gate_leak_rejection_completed",
  "audit_event_stub_no_write2_completed",
  "audit_event_unsafe_field_guard2_completed",
  "blocker_grouping_status_surface_completed",
  "blocker_grouping_contract2_completed",
  "remaining_blockers_preserved",
  "safe_next_action_labels_present",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_REMAINING_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "owner_action_not_requested",
  "real_renderer_evidence_missing",
  "actual_cue_application_evidence_missing",
  "audit_execution_not_started",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
  "readiness_claims_false",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_REJECTIONS = Object.freeze([
  "continuation_ledger2_claims_owner_action",
  "continuation_ledger2_claims_blocker_resolution",
  "continuation_ledger2_claims_runtime_ready",
  "continuation_ledger2_claims_production_ready",
  "continuation_ledger2_changes_checked_count",
  "continuation_ledger2_makes_motion_executable",
  "continuation_ledger2_enables_trusted_loader",
  "continuation_ledger2_starts_actual_data",
  "continuation_ledger2_creates_owner_confirmation",
  "continuation_ledger2_authorizes_work",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY2_CHECKS = Object.freeze([
  "ledger2_blockers_match_status_surface",
  "ledger2_blockers_match_health_surface",
  "ledger2_blockers_match_runtime_config_surface",
  "ledger2_completed_entries_do_not_resolve_blockers",
  "ledger2_safe_next_action_does_not_authorize_work",
  "ledger2_preserves_priority1_blocked",
  "ledger2_preserves_checked_row_count_zero",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY2_REJECTIONS = Object.freeze([
  "ledger2_consistency_status_mismatch",
  "ledger2_consistency_health_mismatch",
  "ledger2_consistency_runtime_config_mismatch",
  "ledger2_consistency_claims_owner_action",
  "ledger2_consistency_claims_blocker_resolution",
  "ledger2_consistency_authorizes_work",
  "ledger2_consistency_claims_runtime_ready",
  "ledger2_consistency_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY_CHECKS = Object.freeze([
  "ledger_entries_match_completed_surfaces",
  "ledger_preserves_owner_action_absent",
  "ledger_preserves_blocker_resolution_absent",
  "ledger_preserves_checked_row_count_zero",
  "ledger_preserves_motion_non_executable",
  "ledger_preserves_readiness_false",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY_REJECTIONS = Object.freeze([
  "ledger_consistency_missing_role_gate_stub",
  "ledger_consistency_missing_role_gate_redaction_guard",
  "ledger_consistency_missing_audit_stub_no_write",
  "ledger_consistency_missing_audit_unsafe_field_guard",
  "ledger_consistency_missing_repeated_blocker_grouping",
  "ledger_consistency_missing_repeated_blocker_grouping_contract",
  "ledger_consistency_claims_owner_action",
  "ledger_consistency_claims_blocker_resolution",
  "ledger_consistency_claims_runtime_ready",
  "ledger_consistency_claims_production_ready",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_REDACTION_SWEEP2_SURFACES = Object.freeze([
  "role_gate_stub",
  "role_gate_redaction_guard",
  "audit_stub_no_write",
  "audit_unsafe_field_guard",
  "continuation_ledger",
  "continuation_ledger_consistency",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_REDACTION_SWEEP2_REJECTIONS = Object.freeze([
  "final_redaction_sweep2_executes_scan",
  "final_redaction_sweep2_exposes_network_locator_material",
  "final_redaction_sweep2_exposes_auth_material",
  "final_redaction_sweep2_exposes_renderer_material",
  "final_redaction_sweep2_exposes_cue_material",
  "final_redaction_sweep2_exposes_model_locator_material",
  "final_redaction_sweep2_exposes_motion_locator_material",
  "final_redaction_sweep2_exposes_runtime_material",
  "final_redaction_sweep2_exposes_operator_note_material",
  "final_redaction_sweep2_claims_runtime_ready",
  "final_redaction_sweep2_claims_production_ready",
  "final_redaction_sweep2_accepts_actual_data",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_NO_SWEETENING_SWEEP2_INPUTS = Object.freeze([
  "continuation_ledger_consistency",
  "final_redaction_sweep2",
  "role_gate_surfaces",
  "audit_stub_surfaces",
  "blocker_grouping_surfaces",
  "public_safe_summary",
  "completion_review_candidate",
]);

export const LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_NO_SWEETENING_SWEEP2_REJECTIONS = Object.freeze([
  "final_redaction_sweep2_promoted_to_readiness",
  "continuation_ledger_promoted_to_readiness",
  "role_gate_promoted_to_owner_action",
  "audit_stub_promoted_to_audit_execution",
  "public_safe_summary_promoted_to_runtime_ready",
  "completion_review_promoted_to_production_ready",
  "experimental_label_marked_executable",
  "runtime_motion_marked_executable",
  "priority1_marked_resolved",
  "checked_row_count_increased",
]);

export const LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_ITEMS = Object.freeze([
  "confirm_owner_scope_later",
  "collect_real_renderer_evidence_later",
  "verify_fresh_heartbeat_later",
  "verify_model_load_later",
  "verify_scene_load_later",
  "verify_cue_capability_later",
  "verify_last_cue_applied_later",
  "verify_audit_reference_later",
  "keep_trusted_loader_disabled",
  "do_not_claim_readiness_now",
]);

export const LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_SAFE_REJECTION_LABELS = Object.freeze([
  "shell_material_rejected",
  "operator_material_rejected",
  "network_locator_material_rejected",
  "auth_material_rejected",
  "model_locator_material_rejected",
  "motion_locator_material_rejected",
  "renderer_material_rejected",
  "evidence_body_material_rejected",
  "owner_note_material_rejected",
]);

export const LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_NO_GO_REASONS = Object.freeze([
  "owner_confirmation_missing",
  "actual_probe_not_allowed_in_this_task",
  "fresh_heartbeat_missing",
  "real_model_load_missing",
  "cue_capability_missing",
  "audit_reference_missing",
  "priority1_blocked",
  "checked_row_count_zero",
  "trusted_loader_disabled",
]);

export const LIVE2D_RENDERER_READY_PREFLIGHT_ROUTE_REQUIRED_SECTIONS = Object.freeze([
  "renderer",
  "evidence",
  "owner_confirmation",
  "audit_reference",
  "trusted_loader_boundary",
  "priority1",
  "checked_rows",
  "motion_dataset",
]);

export const LIVE2D_RENDERER_READY_PREFLIGHT_ROUTE_SAFE_REJECTION_LABELS = Object.freeze([
  "network_locator_material_rejected",
  "auth_material_rejected",
  "private_locator_material_rejected",
  "model_locator_material_rejected",
  "motion_locator_material_rejected",
  "renderer_material_rejected",
  "cue_material_rejected",
  "evidence_body_material_rejected",
  "shell_material_rejected",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_REQUIRED_LABELS = Object.freeze([
  "train",
  "eval",
  "test",
  "review_only",
  "fixture_only",
  "quarantine_only",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_CONTAMINATION_BLOCKERS = Object.freeze([
  "duplicate_row_id",
  "expected_summary_leak",
  "fixture_duplication",
  "train_eval_overlap",
  "source_hash_missing",
  "split_missing",
  "row_body_unread",
  "priority1_blocked",
  "owner_confirmation_missing",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_REQUIRED_ITEMS = Object.freeze([
  "hash_algorithm_label",
  "source_hash_label",
  "file_format_label",
  "declared_row_count_label",
  "schema_version_label",
  "dataset_version_label",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_BLOCKERS = Object.freeze([
  "actual_file_missing",
  "source_hash_missing",
  "hash_algorithm_unsupported",
  "owner_confirmation_missing",
  "actual_file_read_not_allowed",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS = Object.freeze([
  "real_row_file_missing",
  "owner_confirmation_missing",
  "source_hash_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_execution_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_FUTURE_ACTIONS = Object.freeze([
  "provide_row_file_metadata_later",
  "confirm_owner_scope_later",
  "provide_source_hash_later",
  "approve_actual_data_task_later",
  "review_go_nogo_later",
  "do_not_claim_runtime_readiness_now",
  "do_not_enable_trusted_loader_now",
]);

export const LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS = Object.freeze([
  "row_id",
  "dataset_split",
  "motion_label",
  "motion_style",
  "expression_label",
  "gaze_label",
  "breath_label",
  "body_label",
  "camera_label",
  "timing",
  "intensity",
  "cooldown",
  "recovery_plan",
  "visibility_guard",
  "comfort_guard",
  "accessibility",
  "eval_contamination_policy",
  "renderer_ready_dependencies",
  "audit_run",
]);

export const LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA = Object.freeze([
  "audit_run_id",
  "auditor_version",
  "source_hash",
  "source_line",
  "checked_at_bucket",
  "redaction_status",
  "safe_summary_only",
]);

export const LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS = Object.freeze([
  "fresh_heartbeat",
  "real_model_load_supported",
  "model_loaded",
  "scene_loaded",
  "model_matches",
  "scene_matches",
  "cue_capability_confirmed",
  "last_cue_applied",
]);

export const LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS = Object.freeze([
  "raw_payload",
  "raw_row",
  "raw_dataset_row",
  "raw_motion_command",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_evidence_body",
  "raw_loader_candidate",
  "raw_loader_error",
  "raw_owner_note",
  "owner_private_note",
  "raw_model_path",
  "raw_motion_path",
  "raw_sdk_path",
  "raw_vendor_path",
  "model_path",
  "motion_path",
  "sdk_path",
  "vendor_source",
  "endpoint",
  "endpoint_value",
  "token",
  "token_value",
  "secret",
  "secret_value",
  "private_local_path",
  "command",
  "shell_command_body",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
  "raw_process_output",
  "raw_stack_trace",
]);

export const LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_REJECTION_LABELS = Object.freeze([
  "unknown_source_type",
  "unsafe_source_type",
  "raw_renderer_payload_present",
  "raw_cue_payload_present",
  "model_locator_present",
  "motion_locator_present",
  "network_locator_present",
  "auth_material_present",
  "secret_present",
  "private_path_present",
  "actual_file_path_value_present",
  "command_payload_present",
  "owner_confirmation_created_true",
  "owner_confirmation_confirmed_true",
  "runtime_readiness_claimed_true",
  "production_readiness_claimed_true",
  "renderer_ready_claimed_true",
  "renderer_ready_candidate_true",
  "priority1_status_resolved",
  "checked_row_count_positive",
  "motion_dataset_executable_true",
  "trusted_loader_allowlist_enabled_true",
]);

export const LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_REQUIRED_EVIDENCE = Object.freeze([
  "requiredFreshHeartbeatEvidence",
  "requiredRealModelLoadEvidence",
  "requiredModelLoadedEvidence",
  "requiredSceneLoadedEvidence",
  "requiredModelSceneMatchEvidence",
  "requiredCueCapabilityEvidence",
  "requiredLastCueAppliedEvidence",
  "requiredLastCueAppliedSuccessEvidence",
  "requiredOwnerConfirmation",
  "requiredTrustedLoaderDisabledBoundary",
  "requiredPriority1UnblockedEvidence",
  "requiredPositiveCheckedRowCountEvidence",
  "requiredMotionDatasetExecutableEvidence",
]);

export const LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_MISSING_LABELS = Object.freeze([
  "missing_fresh_heartbeat_evidence",
  "missing_real_model_load_evidence",
  "missing_model_loaded_evidence",
  "missing_scene_loaded_evidence",
  "missing_model_scene_match_evidence",
  "missing_cue_capability_evidence",
  "missing_last_cue_applied_evidence",
  "missing_last_cue_applied_success_evidence",
  "owner_confirmation_missing",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
]);

export const LIVE2D_RENDERER_READY_EVIDENCE_CONFLICT_DOWNGRADE_LABELS = Object.freeze([
  "conflicting_renderer_evidence",
  "partial_evidence_is_not_ready",
  "fresh_heartbeat_without_model_load",
  "model_loaded_without_scene_loaded",
  "cue_capability_without_last_cue_applied",
  "last_cue_without_success",
  "real_probe_label_without_required_evidence",
  "fixture_source_with_fresh_claim",
  "owner_confirmation_incomplete",
  "priority1_resolution_without_checked_rows",
  "checked_rows_without_actual_data_task",
  "motion_executable_without_trusted_loader",
  "future_timestamp_rejected",
  "stale_timestamp_downgraded",
  "manual_label_is_not_real_ready",
]);

export const LIVE2D_RENDERER_READY_GO_NOGO_REASONS = Object.freeze([
  "missing_required_renderer_evidence",
  "missing_fresh_heartbeat_evidence",
  "missing_real_model_load_evidence",
  "missing_model_loaded_evidence",
  "missing_scene_loaded_evidence",
  "missing_model_scene_match_evidence",
  "missing_cue_capability_evidence",
  "missing_last_cue_applied_evidence",
  "owner_confirmation_missing",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
  "actual_renderer_probe_missing",
  "actual_data_task_not_started",
]);

export const LIVE2D_RENDERER_READY_BLOCKER_REASON_ALLOWLIST = Object.freeze([
  ...LIVE2D_RENDERER_READY_GO_NOGO_REASONS,
  "conflicting_renderer_evidence",
  "stale_timestamp_downgraded",
  "fixture_source_with_fresh_claim",
  "manual_label_is_not_real_ready",
  "future_timestamp_rejected",
  "unsafe_unknown_blocker_reason",
]);

export const LIVE2D_RENDERER_READY_SAFE_NEXT_ACTIONS = Object.freeze([
  "wait_for_explicit_owner_action_and_real_renderer_evidence",
  "prepare_owner_evidence_handoff_packet_stub",
  "keep_actual_data_task_blocked",
  "keep_trusted_loader_disabled",
  "keep_renderer_ready_false",
  "continue_safe_status_only_no_go_review",
]);

export const LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_REJECTION_FIXTURE_PACK_REJECTED_ATTEMPT_CASES = Object.freeze([
  "owner_confirmation_missing",
  "endpoint_present",
  "token_present",
  "secret_present",
  "raw_model_path_present",
  "raw_motion_path_present",
  "raw_renderer_payload_present",
  "raw_cue_payload_present",
  "priority1_blocked",
  "checked_row_count_zero",
  "trusted_loader_disabled",
  "actual_probe_requested_in_safe_task",
  "runtime_readiness_requested",
  "production_readiness_requested",
]);

export const LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_CASES = Object.freeze([
  "owner_confirmation_missing",
  "network_locator_material_rejected",
  "access_material_rejected",
  "confidential_material_rejected",
  "model_reference_material_rejected",
  "motion_reference_material_rejected",
  "renderer_material_rejected",
  "cue_material_rejected",
  "priority1_blocked",
  "checked_row_count_zero",
  "trusted_loader_disabled",
  "actual_probe_request_rejected",
  "runtime_readiness_request_rejected",
  "production_readiness_request_rejected",
]);

export const LIVE2D_RENDERER_READY_CROSS_SURFACE_BLOCKER_SURFACES = Object.freeze([
  "status",
  "health",
  "runtime_config",
  "heartbeat",
]);

export const LIVE2D_RENDERER_READY_OWNER_EVIDENCE_HANDOFF_STUB_ITEMS = Object.freeze([
  "required_fresh_heartbeat_evidence_label",
  "required_real_model_load_evidence_label",
  "required_model_loaded_evidence_label",
  "required_scene_loaded_evidence_label",
  "required_model_scene_match_evidence_label",
  "required_cue_capability_evidence_label",
  "required_last_cue_applied_evidence_label",
  "required_owner_confirmation_label",
  "required_priority1_unblocked_label",
  "required_positive_checked_row_count_label",
  "required_motion_dataset_executable_label",
]);

export const LIVE2D_RENDERER_READY_REAL_PROBE_REQUEST_REJECTION_REASONS = Object.freeze([
  "owner_confirmation_missing",
  "network_locator_present",
  "auth_material_present",
  "model_locator_present",
  "motion_locator_present",
  "priority1_blocked",
  "checked_row_count_zero",
  "trusted_loader_disabled",
  "actual_probe_not_allowed_in_this_task",
]);

export const LIVE2D_RENDERER_READY_REAL_PROBE_PREFLIGHT_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "explicit_owner_scope_missing",
  "actual_renderer_process_unverified",
  "fresh_heartbeat_missing",
  "model_load_unverified",
  "scene_load_unverified",
  "cue_capability_unverified",
  "last_cue_applied_missing",
  "priority1_blocked",
  "checked_row_count_zero",
  "trusted_loader_disabled",
]);

export const LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_LABELS = Object.freeze([
  "renderer_heartbeat_collector",
  "model_load_collector",
  "scene_load_collector",
  "cue_capability_collector",
  "last_cue_applied_collector",
  "redaction_collector",
  "audit_reference_collector",
]);

export const LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_SAFE_OUTPUT_FIELDS = Object.freeze([
  "collector_name",
  "collector_status",
  "source_type_label",
  "freshness_status_label",
  "redaction_status_label",
  "audit_reference_status_label",
  "blocker_labels",
  "safe_next_action_label",
]);

export const LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_UNSAFE_OUTPUT_REJECTION_LABELS = Object.freeze([
  "network_locator_material_rejected",
  "access_material_rejected",
  "confidential_material_rejected",
  "private_locator_material_rejected",
  "renderer_material_rejected",
  "cue_material_rejected",
  "model_reference_material_rejected",
  "motion_reference_material_rejected",
  "process_material_rejected",
  "diagnostic_trace_material_rejected",
  "owner_private_material_rejected",
  "file_content_material_rejected",
  "file_locator_material_rejected",
  "readiness_claim_rejected",
  "owner_confirmation_claim_rejected",
]);

export const LIVE2D_RENDERER_READY_FINAL_PRE_OWNER_BLOCKERS = Object.freeze([
  "explicit_owner_action_missing",
  "owner_confirmation_missing",
  "real_renderer_probe_missing",
  "fresh_heartbeat_missing",
  "real_model_load_missing",
  "scene_load_missing",
  "cue_capability_missing",
  "last_cue_applied_missing",
  "audit_link_missing",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
  "trusted_loader_disabled",
]);

export const LIVE2D_RENDERER_READY_LONG_CONTINUATION_REVIEW2_COMPLETED_ARTIFACTS = Object.freeze([
  "real_evidence_request_rejection_fixture_pack",
  "evidence_collector_no_execution_guard",
  "evidence_collector_safe_output_schema",
  "evidence_collector_unsafe_output_rejection",
  "public_summary_redaction",
  "admin_summary_redaction",
  "operator_handoff_no_action_guard",
  "final_pre_owner_blocker_summary",
]);

export const LIVE2D_RENDERER_READY_IMPLEMENTATION_GAP_AUDIT2_GAPS = Object.freeze([
  "explicit_owner_action_missing",
  "owner_confirmation_missing",
  "real_renderer_probe_missing",
  "fresh_heartbeat_missing",
  "real_model_load_missing",
  "scene_load_missing",
  "cue_capability_missing",
  "last_cue_applied_missing",
  "audit_link_missing",
  "collector_output_missing",
  "trusted_loader_disabled",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
]);

export const LIVE2D_RENDERER_READY_PRE_OWNER_WAIT_STATE2_ITEMS = Object.freeze([
  "owner_action_not_requested_by_system",
  "owner_confirmation_missing",
  "renderer_probe_not_allowed",
  "collector_execution_not_allowed",
  "audit_execution_not_allowed",
  "trusted_loader_disabled",
  "runtime_readiness_not_claimed",
  "production_readiness_not_claimed",
  "priority1_blocked",
  "checked_row_count_zero",
  "motion_dataset_non_executable",
]);

const LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_FIELD_LABELS = Object.freeze({
  raw_renderer_payload: "raw_renderer_payload_present",
  raw_cue_payload: "raw_cue_payload_present",
  raw_model_path: "model_locator_present",
  raw_motion_path: "motion_locator_present",
  endpoint: "network_locator_present",
  token: "auth_material_present",
  secret: "secret_present",
  private_path: "private_path_present",
  actual_file_path_value: "actual_file_path_value_present",
  command_payload: "command_payload_present",
});

export const LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES = Object.freeze([
  "safe_talk_row",
  "safe_idle_breath_row",
  "safe_laugh_big_row_with_recovery",
  "safe_subtitle_visibility_guard_row",
  "safe_low_intensity_motion_row",
  "safe_accessibility_guarded_row",
  "safe_eval_split_row",
  "safe_renderer_ready_false_row",
]);

export const LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES = Object.freeze([
  "missing_row_id_rejected",
  "duplicate_row_id_rejected",
  "missing_audit_run_id_rejected",
  "missing_auditor_version_rejected",
  "missing_source_hash_rejected",
  "missing_source_line_rejected",
  "missing_dataset_split_rejected",
  "unsupported_motion_label_rejected",
  "experimental_motion_label_executable_rejected",
  "expression_label_as_motion_style_rejected",
  "gaze_label_as_motion_style_rejected",
  "breath_label_as_motion_style_rejected",
  "camera_label_as_motion_style_rejected",
  "raw_cue_payload_rejected",
  "raw_renderer_payload_rejected",
  "raw_model_path_rejected",
  "raw_motion_path_rejected",
  "endpoint_value_rejected",
  "token_value_rejected",
  "secret_value_rejected",
  "private_local_path_rejected",
  "world_command_rejected",
  "obs_command_rejected",
  "game_interaction_request_rejected",
  "os_command_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "raw_process_output_rejected",
  "raw_stack_trace_rejected",
  "fixture_success_as_renderer_ready_rejected",
  "manifest_existence_as_renderer_ready_rejected",
  "asset_route_existence_as_renderer_ready_rejected",
  "sse_connection_as_renderer_ready_rejected",
  "cue_acceptance_as_renderer_ready_rejected",
  "browser_cue_delivery_as_renderer_ready_rejected",
  "renderer_ready_missing_fresh_heartbeat_rejected",
  "renderer_ready_missing_model_loaded_rejected",
  "renderer_ready_missing_scene_loaded_rejected",
  "renderer_ready_missing_model_matches_rejected",
  "renderer_ready_missing_scene_matches_rejected",
  "renderer_ready_missing_cue_capability_rejected",
  "renderer_ready_missing_last_cue_applied_rejected",
  "photosensitivity_guard_missing_rejected",
  "subtitle_overlay_safety_missing_rejected",
  "gaze_pressure_boundary_missing_rejected",
  "motion_cooldown_fatigue_missing_rejected",
  "eval_contamination_guard_missing_rejected",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS = Object.freeze([
  "dataset_name",
  "request_id",
  "request_schema_version",
  "requested_file_format",
  "expected_row_count",
  "dataset_split_plan",
  "source_file_label",
  "source_hash",
  "audit_run_id",
  "auditor_version",
  "owner_confirmation_required",
  "redaction_policy_ref",
  "row_schema_ref",
  "synthetic_fixture_pack_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS = Object.freeze([
  "jsonl",
  "csv",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS = Object.freeze([
  "raw_dataset_row_body",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_model_path",
  "raw_motion_path",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "candidate_payload",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
  "raw_process_output",
  "raw_stack_trace",
  "owner_private_note",
  "raw_k_memo_text",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_ACCEPTED_REQUEST_FIXTURE_CASES = Object.freeze([
  "safe_jsonl_request_metadata",
  "safe_csv_request_metadata",
  "safe_split_plan_request",
  "safe_hash_present_request",
  "safe_owner_confirmation_required_request",
  "safe_renderer_ready_policy_request",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES = Object.freeze([
  "missing_request_id_rejected",
  "missing_dataset_name_rejected",
  "missing_schema_version_rejected",
  "missing_file_format_rejected",
  "unsupported_file_format_rejected",
  "missing_expected_row_count_rejected",
  "missing_source_hash_rejected",
  "missing_audit_run_id_rejected",
  "missing_auditor_version_rejected",
  "missing_split_plan_rejected",
  "missing_owner_confirmation_required_rejected",
  "owner_confirmation_confirmed_rejected",
  "raw_dataset_row_body_rejected",
  "raw_cue_payload_rejected",
  "raw_renderer_payload_rejected",
  "raw_model_path_rejected",
  "raw_motion_path_rejected",
  "endpoint_value_rejected",
  "token_value_rejected",
  "secret_value_rejected",
  "private_local_path_rejected",
  "world_command_rejected",
  "obs_command_rejected",
  "game_interaction_request_rejected",
  "os_command_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "readiness_claim_rejected",
  "motion_execution_request_rejected",
  "real_ingestion_request_rejected",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES = Object.freeze([
  "safe_metadata_only_request",
  "safe_hash_only_reference",
  "safe_row_id_label",
  "safe_dataset_split_label",
  "safe_audit_run_label",
  "safe_redacted_field_marker",
  "safe_rejected_category_alias",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES = Object.freeze([
  "raw_dataset_row_body_rejected",
  "raw_cue_payload_rejected",
  "raw_renderer_payload_rejected",
  "raw_model_path_rejected",
  "raw_motion_path_rejected",
  "endpoint_value_rejected",
  "token_value_rejected",
  "secret_value_rejected",
  "private_local_path_rejected",
  "actual_file_path_value_rejected",
  "actual_file_content_rejected",
  "candidate_payload_rejected",
  "world_command_rejected",
  "obs_command_rejected",
  "game_input_rejected",
  "os_command_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "raw_process_output_rejected",
  "raw_stack_trace_rejected",
  "owner_private_note_rejected",
  "raw_owner_confirmation_note_rejected",
  "raw_k_memo_text_rejected",
  "renderer_ready_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA = Object.freeze([
  "request_id",
  "dataset_name",
  "file_label",
  "file_format",
  "declared_row_count",
  "source_hash",
  "schema_version",
  "dataset_split_plan",
  "audit_run_id",
  "auditor_version",
  "row_schema_ref",
  "request_packet_ref",
  "dry_run_validator_ref",
  "synthetic_fixture_pack_ref",
  "redaction_policy_ref",
  "owner_confirmation_required",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS = Object.freeze([
  "raw_dataset_row_body",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_model_path",
  "raw_motion_path",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "candidate_payload",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
  "raw_process_output",
  "raw_stack_trace",
  "owner_private_note",
  "raw_k_memo_text",
  "actual_file_path_value",
  "actual_file_content",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_REVIEW_SECTIONS = Object.freeze([
  "request_packet",
  "dry_run_validator",
  "quarantine_envelope",
  "row_schema_preflight",
  "synthetic_fixture_pack",
  "runtime_supported_motion_styles",
  "experimental_motion_labels",
  "renderer_ready_requirements",
  "redaction_policy",
  "audit_metadata",
  "file_format_policy",
  "declared_row_count_policy",
  "unsupported_motion_policy",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_CONFIRMATION_SCOPES = Object.freeze([
  "motion_dataset_real_row_intake",
  "row_file_metadata_review",
  "redaction_policy_review",
  "unsupported_motion_policy_review",
  "no_runtime_readiness_claim_review",
  "no_motion_execution_review",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS = Object.freeze([
  "audit_run_id",
  "auditor_version",
  "audit_started_at_label",
  "audit_completed_at_label",
  "source_hash",
  "source_file_label",
  "dataset_name",
  "dataset_version_label",
  "schema_version",
  "expected_row_count",
  "checked_row_count",
  "unchecked_range",
  "issue_row_count",
  "decision_summary",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS = Object.freeze([
  "row_id",
  "dataset_split",
  "source_line",
  "scenario_id",
  "cue_kind",
  "motion_label",
  "expression_label",
  "gaze_label",
  "breath_label",
  "body_label",
  "camera_label",
  "decision",
  "severity",
  "reason_code",
  "safe_evidence_label",
  "redaction_status",
  "renderer_ready_dependency_status",
  "ux_accessibility_status",
  "eval_contamination_status",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS = Object.freeze([
  "overall_status",
  "critical_count",
  "high_count",
  "medium_count",
  "low_count",
  "pass_count",
  "reject_count",
  "needs_review_count",
  "unchecked_count",
  "missing_coverage",
  "residual_risks",
  "owner_confirmation_required",
  "priority1_status",
  "runtime_readiness_claimed",
  "production_readiness_claimed",
]);


export const LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS = Object.freeze([
  "row_schema_preflight_ref",
  "synthetic_fixture_pack_ref",
  "request_packet_ref",
  "dry_run_validator_ref",
  "quarantine_envelope_ref",
  "owner_handoff_packet_ref",
  "audit_manifest_ref",
  "redaction_scanner_fixture_ref",
  "future_real_row_file_ref",
  "future_real_row_audit_ref",
  "future_real_redaction_scan_ref",
  "future_owner_confirmation_ref",
  "future_fresh_resident_evidence_ref",
  "future_go_nogo_review_ref",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES = Object.freeze([
  "planning_schema_ref",
  "synthetic_fixture_ref",
  "metadata_only_ref",
  "owner_review_packet_ref",
  "future_real_file_ref",
  "future_real_audit_ref",
  "future_real_scan_ref",
  "future_owner_confirmation_ref",
  "future_fresh_evidence_ref",
  "future_go_nogo_ref",
]);
export const LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS = Object.freeze([
  "missing_real_row_file",
  "missing_source_hash",
  "missing_quarantine_metadata",
  "missing_redaction_scan",
  "missing_audit_manifest_result",
  "missing_owner_confirmation",
  "missing_fresh_resident_evidence",
  "missing_renderer_ready_dependencies",
  "unsupported_motion_label_present",
  "experimental_motion_label_executable",
  "raw_field_leak_detected",
  "row_body_unread",
  "checked_row_count_zero",
  "priority1_blocked",
  "go_nogo_review_missing",
  "trusted_loader_disabled",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_RESOLUTION_PREREQUISITES = Object.freeze([
  "owner_confirmation_confirmed",
  "real_row_file_provided_through_approved_future_task",
  "source_hash_verified",
  "row_body_safely_scanned_in_future_task",
  "redaction_scan_pass_in_future_task",
  "audit_manifest_result_pass_in_future_task",
  "fresh_resident_evidence_present",
  "renderer_ready_dependencies_satisfied",
  "unsupported_motion_absent_or_rejected",
  "experimental_motion_remains_non_executable",
  "checked_row_count_positive_only_after_future_ingestion_audit",
  "go_nogo_review_pass",
  "trusted_loader_decision_remains_separate",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS = Object.freeze([
  "row_schema_preflight",
  "synthetic_row_fixture_pack",
  "request_packet",
  "dry_run_validator",
  "quarantine_envelope",
  "owner_handoff_packet",
  "audit_manifest",
  "redaction_scanner_fixture_pack",
  "evidence_link_manifest",
  "go_nogo_blocker_map",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS = Object.freeze([
  "future_file_format",
  "future_source_hash",
  "future_declared_row_count",
  "future_dataset_split_plan",
  "future_audit_run_id",
  "future_auditor_version",
  "future_redaction_policy",
  "future_renderer_ready_policy",
  "future_motion_allowlist_policy",
  "future_unsupported_motion_policy",
  "future_experimental_motion_policy",
  "future_go_nogo_review",
  "future_priority1_blocker_review",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_MISSING_BLOCKER_CHECKS = Object.freeze([
  ...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS,
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS = Object.freeze([
  "row_schema_preflight_visible",
  "synthetic_row_fixture_pack_visible",
  "request_packet_visible",
  "dry_run_validator_visible",
  "quarantine_envelope_visible",
  "owner_handoff_packet_visible",
  "audit_manifest_visible",
  "redaction_scanner_fixture_pack_visible",
  "evidence_link_manifest_visible",
  "go_nogo_blocker_map_visible",
  "pre_ingestion_review_packet_visible",
  "owner_confirmation_still_required",
  "fresh_resident_evidence_still_required",
  "checked_row_count_zero",
  "real_row_data_absent",
  "motion_dataset_non_executable",
  "no_go_preserved",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_BLOCKER_VISIBILITY = Object.freeze([
  ...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS,
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS = Object.freeze([
  ...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS,
  "pre_ingestion_review_packet",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_BLOCKERS = Object.freeze([
  "missing_owner_provided_row_file",
  "missing_source_hash",
  "missing_declared_row_count",
  "missing_jsonl_or_csv_format",
  "missing_owner_confirmation",
  "missing_real_row_redaction_scan",
  "missing_real_row_audit_result",
  "missing_fresh_resident_evidence",
  "missing_go_nogo_review",
  "checked_row_count_zero",
  "real_row_data_absent",
  "priority1_blocked",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FUTURE_PREREQUISITES = Object.freeze([
  "owner_provided_jsonl_or_csv_file",
  "row_id_per_record",
  "source_hash",
  "declared_row_count",
  "dataset_split",
  "schema_version",
  "audit_run_id",
  "auditor_version",
  "redaction_scan_result",
  "audit_manifest_result",
  "owner_confirmation_ref",
  "fresh_resident_evidence_ref",
  "go_nogo_review_ref",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_ITEMS = Object.freeze([
  "jsonl_or_csv_file_label",
  "declared_file_format",
  "declared_row_count",
  "source_hash",
  "schema_version",
  "dataset_split_plan",
  "audit_run_id",
  "auditor_version",
  "redaction_policy_ref",
  "motion_allowlist_policy_ref",
  "renderer_ready_policy_ref",
  "unsupported_motion_policy_ref",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_CONFIRMATION_SCOPES = Object.freeze([
  "row_file_metadata_review",
  "row_schema_policy_review",
  "redaction_policy_review",
  "unsupported_motion_policy_review",
  "renderer_ready_policy_review",
  "no_runtime_readiness_claim_review",
  "no_motion_execution_review",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_FILE_SHAPE = Object.freeze([
  "one_row_id_per_record",
  "dataset_split_per_record",
  "motion_label_per_record",
  "audit_metadata_per_record",
  "no_raw_renderer_payload",
  "no_raw_cue_payload",
  "no_endpoint",
  "no_token",
  "no_secret",
  "no_private_path",
  "no_command_field",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS = Object.freeze([
  "raw_dataset_row_body",
  "actual_file_content",
  "actual_file_path_value",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_model_path",
  "raw_motion_path",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
  "raw_process_output",
  "raw_stack_trace",
  "raw_owner_confirmation_note",
  "owner_private_note",
  "raw_k_memo_text",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_METADATA_LABELS = Object.freeze([
  "submission_request_id",
  "submission_expected_file_format",
  "submission_expected_source_hash",
  "submission_expected_declared_row_count",
  "submission_expected_schema_version",
  "submission_expected_dataset_split_plan",
  "submission_expected_audit_run_id",
  "submission_expected_owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_FUTURE_REFS = Object.freeze([
  "owner_row_data_submission_packet_ref",
  "row_file_checksum_preflight_manifest_ref",
  "row_intake_quarantine_envelope_ref",
  "owner_confirmation_ref",
  "future_owner_confirmed_actual_data_task_ref",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_HASH_METADATA_LABELS = Object.freeze([
  "source_hash",
  "hash_algorithm",
  "hash_scope",
  "declared_row_count",
  "schema_version",
  "file_format",
  "dataset_name",
  "dataset_version_label",
  "audit_run_id",
  "auditor_version",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS = Object.freeze([
  "sha256",
  "sha512",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_FILE_IDENTITY_LABELS = Object.freeze([
  "dataset_name",
  "dataset_version_label",
  "declared_row_count",
  "schema_version",
  "file_format",
  "hash_scope",
  "source_hash",
  "audit_run_id",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_OWNER_CONFIRMATION_REFS = Object.freeze([
  "owner_row_data_submission_receipt_stub_ref",
  "owner_confirmation_ref",
  "future_owner_confirmed_actual_data_task_ref",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS = Object.freeze([
  "submission_request_id",
  "declared_file_format",
  "declared_row_count",
  "source_hash",
  "hash_algorithm",
  "schema_version",
  "dataset_name",
  "dataset_version_label",
  "dataset_split_plan",
  "audit_run_id",
  "auditor_version",
  "owner_confirmation_scope",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_FILE_FORMATS = Object.freeze([
  "jsonl",
  "csv",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_HASH_ALGORITHMS = Object.freeze([
  "sha256",
  "sha512",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS = Object.freeze([
  "missing_submission_request_id",
  "unsupported_file_format",
  "missing_declared_row_count",
  "missing_source_hash",
  "unsupported_hash_algorithm",
  "missing_schema_version",
  "missing_dataset_split_plan",
  "missing_audit_run_id",
  "missing_auditor_version",
  "missing_owner_confirmation_scope",
  "actual_file_path_value_rejected",
  "actual_file_content_rejected",
  "raw_row_body_rejected",
  "owner_confirmation_claim_rejected",
  "readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_ACCEPTED_CASES = Object.freeze([
  "safe_metadata_missing_source_hash_rejection",
  "safe_metadata_unsupported_format_rejection",
  "safe_metadata_missing_owner_scope_rejection",
  "safe_redacted_raw_field_rejection",
  "safe_no_data_present_blocked_fixture",
  "safe_checksum_preflight_missing_file_blocked_fixture",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_REJECTED_ATTEMPT_CASES = Object.freeze([
  "actual_file_path_value_rejected",
  "actual_file_content_rejected",
  "raw_jsonl_body_rejected",
  "raw_csv_body_rejected",
  "raw_dataset_row_body_rejected",
  "raw_cue_payload_rejected",
  "raw_renderer_payload_rejected",
  "raw_model_path_rejected",
  "raw_motion_path_rejected",
  "endpoint_value_rejected",
  "token_value_rejected",
  "secret_value_rejected",
  "private_local_path_rejected",
  "world_command_rejected",
  "obs_command_rejected",
  "game_input_rejected",
  "os_command_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "raw_process_output_rejected",
  "raw_stack_trace_rejected",
  "raw_owner_confirmation_note_rejected",
  "owner_private_note_rejected",
  "owner_confirmation_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
  "unsupported_motion_runtime_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_ATTEMPT_CASES = Object.freeze([
  "actual_file_reference_value_rejected",
  "actual_file_content_rejected",
  "jsonl_body_material_rejected",
  "csv_body_material_rejected",
  "dataset_row_body_material_rejected",
  "cue_material_rejected",
  "renderer_material_rejected",
  "model_reference_material_rejected",
  "motion_reference_material_rejected",
  "network_value_rejected",
  "credential_value_rejected",
  "private_local_reference_rejected",
  "world_operation_request_rejected",
  "obs_operation_request_rejected",
  "game_interaction_request_rejected",
  "os_operation_request_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "process_output_material_rejected",
  "stack_trace_material_rejected",
  "owner_confirmation_note_rejected",
  "owner_private_note_rejected",
  "owner_confirmation_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
  "unsupported_motion_runtime_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES = Object.freeze([
  "owner_confirmation_confirmed",
  "real_row_file_available",
  "source_hash_declared",
  "metadata_validator_stub_present",
  "submission_rejection_fixture_pack_present",
  "checksum_preflight_manifest_present",
  "missing_data_fail_closed_gate_present",
  "final_dry_run_checklist_present",
  "go_nogo_blocker_map_present",
  "fresh_resident_evidence_required",
  "owner_confirmation_required",
  "actual_file_content_not_present",
  "actual_file_reference_not_present",
  "row_body_not_read",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS = Object.freeze([
  "missing_owner_confirmation",
  "missing_real_row_file",
  "missing_source_hash",
  "missing_fresh_resident_evidence",
  "missing_go_nogo_review",
  "checked_row_count_zero",
  "priority1_blocked",
  "actual_ingestion_not_allowed",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS = Object.freeze([
  "row_id",
  "dataset_split",
  "source_line",
  "scenario_id",
  "cue_kind",
  "motion_label",
  "expression_label",
  "gaze_label",
  "breath_label",
  "body_label",
  "camera_label",
  "timing_label",
  "intensity_label",
  "recovery_plan_label",
  "visibility_guard_label",
  "comfort_guard_label",
  "audit_metadata_ref",
  "redaction_status",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REJECTION_REASONS = Object.freeze([
  "missing_row_id",
  "duplicate_row_id",
  "unsupported_motion_label",
  "experimental_motion_executable_attempt",
  "raw_cue_payload_present",
  "raw_renderer_payload_present",
  "model_locator_present",
  "motion_locator_present",
  "endpoint_value_present",
  "token_value_present",
  "secret_value_present",
  "private_path_present",
  "world_command_present",
  "obs_command_present",
  "game_input_present",
  "os_command_present",
  "memory_commit_present",
  "relationship_commit_present",
  "readiness_claim_present",
  "owner_confirmation_claim_present",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SAFE_PUBLIC_REJECTION_REASONS = Object.freeze([
  "missing_row_id",
  "duplicate_row_id",
  "unsupported_motion_label",
  "experimental_motion_executable_attempt",
  "cue_material_present",
  "renderer_material_present",
  "model_reference_material_present",
  "motion_reference_material_present",
  "network_value_present",
  "credential_value_present",
  "private_reference_present",
  "world_operation_request_present",
  "obs_operation_request_present",
  "game_interaction_request_present",
  "os_operation_request_present",
  "memory_commit_present",
  "relationship_commit_present",
  "readiness_claim_present",
  "owner_confirmation_claim_present",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_ACCEPTED_CASES = Object.freeze([
  "safe_missing_row_id_rejection",
  "safe_duplicate_row_id_rejection",
  "safe_unsupported_motion_rejection",
  "safe_raw_field_rejection",
  "safe_readiness_claim_rejection",
  "safe_owner_confirmation_claim_rejection",
  "safe_no_data_present_blocked_fixture",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_REJECTED_INPUT_ATTEMPT_CASES = Object.freeze([
  "raw_jsonl_body_rejected",
  "raw_csv_body_rejected",
  "raw_dataset_row_body_rejected",
  "actual_file_content_rejected",
  "actual_file_path_value_rejected",
  "raw_cue_payload_rejected",
  "raw_renderer_payload_rejected",
  "raw_model_path_rejected",
  "raw_motion_path_rejected",
  "endpoint_value_rejected",
  "token_value_rejected",
  "secret_value_rejected",
  "private_local_path_rejected",
  "world_command_rejected",
  "obs_command_rejected",
  "game_input_rejected",
  "os_command_rejected",
  "memory_commit_rejected",
  "relationship_commit_rejected",
  "renderer_ready_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_INPUT_ATTEMPT_CASES = Object.freeze([
  "jsonl_material_rejected",
  "csv_material_rejected",
  "dataset_row_material_rejected",
  "file_content_material_rejected",
  "file_reference_value_rejected",
  "cue_material_rejected",
  "renderer_material_rejected",
  "model_reference_material_rejected",
  "motion_reference_material_rejected",
  "network_value_rejected",
  "credential_value_rejected",
  "private_reference_rejected",
  "world_operation_request_rejected",
  "obs_operation_request_rejected",
  "game_interaction_request_rejected",
  "os_operation_request_rejected",
  "memory_commit_request_rejected",
  "relationship_commit_request_rejected",
  "renderer_ready_claim_rejected",
  "runtime_readiness_claim_rejected",
  "production_readiness_claim_rejected",
  "priority1_resolved_claim_rejected",
  "motion_executable_claim_rejected",
]);

export const LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REQUIRED_EVENT_FIELDS = Object.freeze([
  "audit_event_id",
  "actor_role",
  "action_type",
  "safe_target_label",
  "result_status",
  "timestamp_label",
  "request_id",
  "dataset_name",
  "source_hash_label",
  "declared_row_count_label",
  "schema_version_label",
  "redaction_status",
  "owner_confirmation_ref",
  "go_nogo_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REDACTION_POLICY = Object.freeze([
  "no_dataset_row_material",
  "no_file_location_value",
  "no_file_content_material",
  "no_cue_material",
  "no_renderer_material",
  "no_network_location_value",
  "no_credential_value",
  "no_private_location_value",
  "no_owner_note_material",
  "no_memo_material",
  "no_command_material",
]);

export const LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS = Object.freeze([
  "rollback_plan_id",
  "ingestion_batch_id",
  "source_hash_label",
  "pre_ingestion_snapshot_ref",
  "post_ingestion_snapshot_ref",
  "audit_event_ref",
  "owner_confirmation_ref",
  "go_nogo_ref",
  "rollback_reason_labels",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS = Object.freeze([
  "missing_pre_ingestion_snapshot",
  "missing_owner_confirmation",
  "missing_audit_event",
  "missing_go_nogo_ref",
  "missing_source_hash",
  "missing_batch_id",
  "priority1_blocked",
]);

export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_INPUTS = Object.freeze([
  "metadata_validator_ref",
  "checksum_preflight_ref",
  "parser_contract_ref",
  "parser_rejection_fixture_ref",
  "owner_confirmation_ref",
  "source_hash_label",
  "declared_row_count_label",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_OUTPUTS = Object.freeze([
  "dry_run_status",
  "safe_reject_count",
  "safe_accept_candidate_count",
  "unchecked_count",
  "redaction_status",
  "audit_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_CRITERIA = Object.freeze([
  "owner_confirmation_confirmed",
  "source_hash_present",
  "declared_row_count_present",
  "metadata_validator_pass_future",
  "checksum_verified_future",
  "parser_dry_run_pass_future",
  "redaction_scan_pass_future",
  "audit_manifest_pass_future",
  "go_nogo_review_pass_future",
  "fresh_resident_evidence_present",
  "renderer_ready_dependencies_satisfied",
  "unsupported_motion_absent",
  "checked_row_count_positive_after_future_ingestion",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_REJECTION_CRITERIA = Object.freeze([
  "owner_confirmation_missing",
  "source_hash_missing",
  "raw_row_body_unredacted",
  "unsupported_motion_present",
  "experimental_motion_executable",
  "renderer_ready_dependencies_missing",
  "priority1_blocked",
  "go_nogo_no_go",
  "actual_file_unverified",
  "stale_evidence",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_REVIEW_SECTIONS = Object.freeze([
  "missing_data_gate",
  "owner_submission_packet",
  "receipt_stub",
  "metadata_validator_stub",
  "checksum_preflight_manifest",
  "submission_rejection_fixture_pack",
  "actual_data_task_entry_gate",
  "parser_contract_stub",
  "parser_rejection_fixture_pack",
  "ingestion_audit_trail_stub",
  "rollback_plan_stub",
  "parser_dry_run_envelope",
  "acceptance_criteria_checklist",
  "fresh_resident_evidence_requirement",
  "go_nogo_blocker_map",
  "trusted_loader_boundary",
]);

export const LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_CONFIRMATION_SCOPES = Object.freeze([
  "actual_row_data_submission",
  "source_hash_review",
  "row_body_parser_dry_run_review",
  "redaction_scan_review",
  "audit_trail_review",
  "rollback_plan_review",
  "go_nogo_review",
  "no_runtime_readiness_claim_review",
  "no_motion_execution_review",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_REASONS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "source_hash_missing",
  "parser_dry_run_not_executed",
  "redaction_scan_not_executed",
  "audit_result_missing",
  "fresh_resident_evidence_missing",
  "priority1_blocked",
  "renderer_ready_dependencies_unsatisfied",
  "go_nogo_review_missing",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_SAFE_NEXT_ACTIONS = Object.freeze([
  "owner_may_prepare_row_file_metadata",
  "owner_must_confirm_scope_later",
  "future_actual_data_task_required",
  "future_parser_dry_run_required",
  "future_redaction_scan_required",
  "future_audit_required",
  "future_go_nogo_required",
  "no_runtime_readiness_claim",
]);

export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_READY_PREREQUISITE_LABELS = Object.freeze([
  "schema_preflight_available",
  "submission_packet_available",
  "receipt_stub_available",
  "metadata_validator_stub_available",
  "checksum_preflight_manifest_available",
  "parser_contract_stub_available",
  "parser_rejection_fixture_available",
  "audit_trail_stub_available",
  "rollback_plan_stub_available",
  "parser_dry_run_envelope_available",
  "acceptance_criteria_available",
  "handoff_review_packet_available",
]);

export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_MISSING_PREREQUISITE_LABELS = Object.freeze([
  "real_row_file_missing",
  "owner_confirmation_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_result_missing",
  "go_nogo_review_missing",
  "positive_checked_row_count_missing",
]);

export const LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_REQUIRED_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "source_hash_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_result_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_CLEARANCE_CONDITIONS = Object.freeze([
  "owner_confirmation_confirmed_future",
  "row_file_metadata_verified_future",
  "source_hash_verified_future",
  "fresh_resident_evidence_present_future",
  "parser_dry_run_pass_future",
  "redaction_scan_pass_future",
  "audit_result_pass_future",
  "go_nogo_review_pass_future",
  "priority1_resolution_candidate_future",
  "checked_row_count_positive_future",
]);

export const LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_SCOPES = Object.freeze([
  "actual_row_data_submission",
  "source_hash_review",
  "parser_dry_run_review",
  "redaction_scan_review",
  "audit_execution_review",
  "rollback_plan_review",
  "go_nogo_review",
  "no_runtime_readiness_claim_review",
  "no_motion_execution_review",
]);

export const LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_EVIDENCE_REFS = Object.freeze([
  "owner_scope_ref_future",
  "source_hash_ref_future",
  "parser_dry_run_ref_future",
  "redaction_scan_ref_future",
  "audit_execution_ref_future",
  "rollback_plan_ref_future",
  "go_nogo_ref_future",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_REQUIRED_METADATA = Object.freeze([
  "quarantine_id",
  "submission_request_id",
  "source_hash_label",
  "declared_row_count_label",
  "file_format_label",
  "schema_version_label",
  "quarantine_reason_labels",
  "redaction_scan_ref",
  "audit_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_REQUIRED_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "source_hash_missing",
  "file_format_missing",
  "redaction_scan_missing",
  "audit_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_REQUIRED_INPUTS = Object.freeze([
  "quarantine_ref",
  "source_hash_label",
  "declared_row_count_label",
  "schema_version_label",
  "redaction_policy_ref",
  "owner_confirmation_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_REQUIRED_OUTPUTS = Object.freeze([
  "redaction_scan_status",
  "unsafe_field_count",
  "rejected_row_count",
  "safe_candidate_count",
  "redaction_summary_ref",
  "safe_next_action",
]);


export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_REQUIRED_FIELDS = Object.freeze([
  "parser_contract_ref",
  "quarantine_ref",
  "redaction_scan_ref",
  "source_hash_label",
  "declared_row_count_label",
  "owner_confirmation_ref",
  "audit_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "quarantine_missing",
  "redaction_scan_missing",
  "source_hash_missing",
  "row_body_unread",
  "priority1_blocked",
  "go_nogo_no_go",
]);


export const LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_REQUIRED_INPUTS = Object.freeze([
  "parser_dry_run_ref",
  "redaction_scan_ref",
  "quarantine_ref",
  "source_hash_label",
  "declared_row_count_label",
  "owner_confirmation_ref",
  "go_nogo_ref",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_REQUIRED_OUTPUTS = Object.freeze([
  "audit_run_id",
  "auditor_version",
  "checked_row_count_future",
  "issue_row_count_future",
  "audit_result_ref",
  "safe_next_action",
]);


export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_SAFE_STEPS = Object.freeze([
  "verify_owner_confirmation_scope",
  "verify_source_hash_label",
  "verify_quarantine_ref",
  "verify_redaction_scan_ref",
  "verify_parser_dry_run_ref",
  "verify_audit_ref",
  "verify_go_nogo_ref",
  "verify_priority1_status",
  "verify_no_readiness_claim",
  "stop_before_actual_ingestion",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "source_hash_missing",
  "quarantine_missing",
  "redaction_scan_missing",
  "parser_dry_run_missing",
  "audit_missing",
  "go_nogo_no_go",
  "priority1_blocked",
  "checked_row_count_zero",
]);


export const LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_REQUIRED_SECTIONS = Object.freeze([
  "current_prepared_artifacts",
  "missing_owner_confirmations",
  "missing_real_row_file",
  "missing_fresh_resident_evidence",
  "missing_parser_dry_run",
  "missing_redaction_scan",
  "missing_audit_execution",
  "missing_go_nogo_review",
  "priority1_blocked",
  "safe_future_owner_action",
]);

export const LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "source_hash_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_execution_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);


export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LABELS = Object.freeze([
  "all_planning_artifacts_prepared",
  "owner_confirmation_missing",
  "real_row_file_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_execution_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
]);

export const LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_UNFREEZE_CONDITIONS = Object.freeze([
  "owner_confirmation_confirmed_future",
  "real_row_file_supplied_future",
  "source_hash_verified_future",
  "fresh_resident_evidence_present_future",
  "parser_dry_run_pass_future",
  "redaction_scan_pass_future",
  "audit_execution_pass_future",
  "go_nogo_review_pass_future",
  "priority1_candidate_future",
]);


export const LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_OWNER_ITEMS = Object.freeze([
  "owner_confirmation_scope",
  "real_row_file_future",
  "source_hash_future",
  "declared_row_count_future",
  "go_nogo_review_future",
]);

export const LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_SYSTEM_ITEMS = Object.freeze([
  "parser_dry_run_future",
  "redaction_scan_future",
  "audit_execution_future",
  "fresh_resident_evidence_future",
  "priority1_review_future",
]);


export const LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_SURFACES = Object.freeze([
  "schema_preflight",
  "synthetic_fixture_pack",
  "request_packet",
  "dry_run_validator",
  "quarantine_envelope",
  "owner_handoff_packet",
  "audit_manifest",
  "redaction_scanner_fixture_pack",
  "evidence_link_manifest",
  "go_nogo_blocker_map",
  "pre_ingestion_review_packet",
  "final_dry_run_checklist",
  "missing_data_gate",
  "owner_submission_packet",
  "receipt_stub",
  "checksum_preflight_manifest",
  "metadata_validator_stub",
  "submission_rejection_fixture_pack",
  "actual_data_task_entry_gate",
  "parser_contract_stub",
  "parser_rejection_fixture_pack",
  "ingestion_audit_trail_stub",
  "rollback_plan_stub",
  "parser_dry_run_envelope",
  "acceptance_criteria_checklist",
  "owner_handoff_review_packet",
  "no_go_summary_projection",
  "submission_readiness_ledger",
  "preauth_blocker_gate",
  "owner_confirmation_preflight_envelope",
  "quarantine_staging_envelope",
  "redaction_scan_execution_envelope",
  "parser_execution_request_envelope",
  "audit_execution_request_envelope",
  "runbook_no_action_packet",
  "final_owner_packet",
]);

export const LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_FALSE_READY_REJECTIONS = Object.freeze([
  "fixture_pass_is_not_ready",
  "schema_exists_is_not_ready",
  "sse_connected_is_not_ready",
  "cue_accepted_is_not_ready",
  "browser_smoke_is_not_ready",
  "remote_gate_pass_is_not_ready",
  "planning_surface_pass_is_not_ready",
  "owner_packet_exists_is_not_confirmation",
  "checked_row_count_zero_blocks_ready",
  "priority1_blocks_ready",
]);


export const LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_COMPLETED_ARTIFACTS = Object.freeze([
  "row_schema_preflight",
  "synthetic_row_fixture_pack",
  "request_packet",
  "dry_run_validator",
  "quarantine_envelope",
  "owner_handoff_packet",
  "audit_manifest",
  "redaction_scanner_fixture_pack",
  "evidence_link_manifest",
  "go_nogo_blocker_map",
  "pre_ingestion_review_packet",
  "final_dry_run_checklist",
  "missing_data_gate",
  "owner_submission_packet",
  "receipt_stub",
  "checksum_preflight_manifest",
  "metadata_validator_stub",
  "submission_rejection_fixture_pack",
  "actual_data_task_entry_gate",
  "parser_contract_stub",
  "parser_rejection_fixture_pack",
  "ingestion_audit_trail_stub",
  "rollback_plan_stub",
  "parser_dry_run_envelope",
  "acceptance_criteria_checklist",
  "owner_handoff_review_packet",
  "no_go_summary_projection",
  "submission_readiness_ledger",
  "preauth_blocker_gate",
  "owner_confirmation_preflight_envelope",
  "quarantine_staging_envelope",
  "redaction_scan_execution_envelope",
  "parser_execution_request_envelope",
  "audit_execution_request_envelope",
  "runbook_no_action_packet",
  "final_owner_packet",
  "freeze_state_ledger",
  "owner_wait_state_packet",
  "readiness_non_sweetening_sweep",
]);

export const LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_UNRESOLVED_BLOCKERS = Object.freeze([
  "owner_confirmation_missing",
  "real_row_file_missing",
  "fresh_resident_evidence_missing",
  "parser_dry_run_missing",
  "redaction_scan_missing",
  "audit_execution_missing",
  "go_nogo_review_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);


export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_REQUIRED_FIELDS = Object.freeze([
  "submission_request_id",
  "file_format_label",
  "declared_row_count_label",
  "source_hash_label",
  "schema_version_label",
  "dataset_split_plan_label",
  "owner_confirmation_scope_label",
  "safe_next_action",
]);

export const LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_REJECTED_FIELDS = Object.freeze([
  "dataset_body_material_rejected",
  "file_material_rejected",
  "file_reference_rejected",
  "cue_material_rejected",
  "renderer_material_rejected",
  "network_value_rejected",
  "credential_label_rejected",
  "sensitive_label_rejected",
  "local_reference_rejected",
  "owner_note_rejected",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_CATEGORIES = Object.freeze([
  "dataset_row_material",
  "cue_material",
  "renderer_material",
  "model_reference",
  "motion_reference",
  "network_value",
  "credential_label",
  "sensitive_label",
  "local_reference",
  "world_action",
  "obs_action",
  "game_action",
  "os_action",
  "memory_commit",
  "relationship_commit",
  "owner_note",
  "k_memo_material",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_ACTIONS = Object.freeze([
  "reject",
  "redact_field_name_only",
  "safe_category_only",
  "manual_owner_review_required",
  "block_actual_ingestion",
]);

export const LIVE2D_MOTION_DATASET_MOTION_ALLOWLIST_SYNC_REJECTION_REASONS = Object.freeze([
  "unsupported_motion_label",
  "experimental_motion_executable_attempt",
  "runtime_allowlist_mismatch",
  "renderer_capability_missing",
  "recovery_capability_missing",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_MOTION_DATASET_RENDERER_READY_DEPENDENCIES = Object.freeze([
  "fresh_heartbeat",
  "real_model_load_supported",
  "model_loaded",
  "scene_loaded",
  "model_matches",
  "scene_matches",
  "cue_capability_confirmed",
  "last_cue_applied_success",
  "recovery_capability_confirmed",
  "motion_allowlist_synced",
  "fresh_resident_evidence_present",
  "owner_confirmation_confirmed",
]);

export const LIVE2D_MOTION_DATASET_RENDERER_READY_FALSE_READY_BLOCKERS = Object.freeze([
  "manifest_exists_only",
  "sse_connected_only",
  "cue_accepted_only",
  "browser_smoke_only",
  "fixture_pass_only",
  "remote_gate_pass_only",
  "checked_row_count_zero",
  "priority1_blocked",
  "owner_confirmation_missing",
  "fresh_evidence_missing",
]);

export const LIVE2D_RENDERER_READY_FALSE_POSITIVE_BLOCKERS = Object.freeze([
  "fresh_heartbeat_missing",
  "real_model_load_not_confirmed",
  "model_loaded_false",
  "scene_loaded_false",
  "model_scene_match_unconfirmed",
  "cue_capability_unconfirmed",
  "last_cue_applied_missing",
  "fixture_pass_is_not_real_ready",
  "manifest_only_is_not_real_ready",
  "sse_connected_is_not_real_ready",
]);

export const LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_REJECTION_LABELS = Object.freeze([
  "fixture_pass_is_not_real_ready",
  "manifest_only_is_not_real_ready",
  "sse_connected_is_not_real_ready",
  "cue_accepted_is_not_last_cue_applied",
  "local_checks_are_not_runtime_readiness",
  "remote_checks_are_not_runtime_readiness",
  "owner_action_freeze_is_not_renderer_readiness",
  "missing_fresh_heartbeat",
  "missing_real_model_load",
  "missing_cue_capability",
  "missing_last_cue_applied",
]);

export const LIVE2D_RENDERER_READY_FRESH_EVIDENCE_REQUIRED_BLOCKERS = Object.freeze([
  "missing_fresh_heartbeat_evidence",
  "missing_real_model_load_evidence",
  "missing_model_loaded_evidence",
  "missing_scene_loaded_evidence",
  "missing_model_scene_match_evidence",
  "missing_cue_capability_evidence",
  "missing_last_cue_applied_evidence",
  "fixture_evidence_is_not_real_evidence",
  "manual_label_is_not_real_evidence",
  "stale_evidence_is_not_ready",
  "priority1_blocked",
  "checked_row_count_zero",
  "trusted_loader_disabled",
]);

export const LIVE2D_RENDERER_READY_STALE_EVIDENCE_REJECTION_LABELS = Object.freeze([
  "stale_evidence_is_not_renderer_ready",
  "fixture_evidence_is_not_real_evidence",
  "manual_label_is_not_real_evidence",
  "manifest_only_is_not_real_ready",
  "sse_connected_is_not_real_ready",
  "cue_accepted_is_not_last_cue_applied",
  "missing_fresh_heartbeat_evidence",
  "missing_fresh_model_load_evidence",
  "missing_fresh_last_cue_applied_evidence",
  "priority1_blocked",
  "checked_row_count_zero",
]);

export const LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_TYPES = Object.freeze([
  "none",
  "fixture",
  "manual_label",
  "manifest_only",
  "sse_connected_only",
  "cue_accepted_only",
  "real_probe",
  "operator_confirmed",
  "audit_link",
]);

export const LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS = Object.freeze([
  "raw_dataset_row_body",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_model_path",
  "raw_motion_path",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "owner_private_note",
  "raw_owner_confirmation_note",
  "actual_file_path_value",
  "actual_file_content",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
]);

export const LIVE2D_MOTION_DATASET_UX_AUDIT_AXES = Object.freeze([
  "viewer_comfort",
  "photosensitivity",
  "subtitle_overlay",
  "gaze_pressure",
  "motion_cooldown",
  "recovery_comfort",
  "accessibility_review",
]);

export const ALLOWED_CUBISM_LOADER_ENV_NAMES = Object.freeze([
  "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
  "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
  "IRIS_LIVE2D_CUBISM_LOADER_KIND",
]);

export const CUBISM_LOADER_KIND_CANDIDATES = Object.freeze([
  "cubism_framework_model_loader_v1",
  "cubism_moc_create",
]);

const FRAMEWORK_FILE_ENV_NAMES = new Set([
  "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
  "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
]);

const LOADER_KIND_ENV_NAME = "IRIS_LIVE2D_CUBISM_LOADER_KIND";
const DEFAULT_LOADER_KIND = "cubism_framework_model_loader_v1";
const REAL_EVIDENCE_INTAKE_SOURCE_TYPES = new Set([
  "fixture",
  "dry_run",
  "manual_summary",
  "operator_confirmed_summary",
  "real_probe_summary",
  "audit_reference",
]);

const REAL_EVIDENCE_INTAKE_COMPONENTS = new Set([
  "live2d_renderer",
  "live2d_route_guard",
  "live2d_evidence_collector",
  "live2d_allowlist_preflight",
  "live2d_enablement_gate",
  "live2d_owner_handoff",
  "live2d_fresh_evidence_bundle",
  "live2d_go_nogo_preflight",
]);

const RAW_EVIDENCE_FIELD_NAMES = new Set([
  "raw_payload",
  "raw_renderer_payload",
  "raw_cue_payload",
  "raw_evidence_body",
  "raw_model_path",
  "raw_motion_path",
  "endpoint",
  "token",
  "secret",
  "raw_loader_candidate",
  "raw_loader_error",
  "raw_request_note",
  "raw_api_response",
  "raw_audio_body",
  "raw_frame_body",
  "raw_comment_text",
  "endpoint_value",
  "token_value",
  "secret_value",
  "private_local_path",
  "owner_private_note",
  "raw_owner_note",
  "sdk_vendor_path",
  "model_path",
  "motion_path",
  "shell_command_body",
  "obs_instruction_material",
  "world_instruction_material",
  "sdk_path",
  "vendor_source",
]);

const OWNER_CONFIRMATION_SCOPES = Object.freeze([
  "route_guard_review",
  "real_evidence_collector_review",
  "fresh_evidence_bundle_review",
  "real_evidence_intake_review",
  "go_nogo_preflight_review",
  "owner_confirmation_envelope_review",
  "trusted_loader_preflight_review",
  "trusted_loader_enablement_gate_review",
  "trusted_loader_owner_handoff_review",
  "actual_trusted_loader_enablement",
  "runtime_readiness",
  "production_readiness",
  "priority1_resolution",
  "motion_dataset_execution",
]);

const OWNER_CONFIRMATION_SCOPE_SET = new Set(OWNER_CONFIRMATION_SCOPES);

const REAL_EVIDENCE_REQUEST_COMPONENTS = Object.freeze([
  "live2d_route_guard",
  "live2d_renderer_heartbeat",
  "live2d_model_configured_status",
  "live2d_cue_capability",
  "live2d_recovery_capability",
  "live2d_evidence_collector",
  "live2d_fresh_evidence_bundle",
  "live2d_real_evidence_intake",
  "live2d_go_nogo_preflight",
  "live2d_owner_confirmation_envelope",
  "trusted_loader_preflight",
  "trusted_loader_enablement_gate",
  "trusted_loader_owner_handoff",
  "license_boundary",
  "sdk_vendor_boundary",
  "priority1_real_resident_evidence",
  "motion_dataset_row_evidence",
]);

const LIVE2D_REAL_EVIDENCE_COLLECTORS = Object.freeze([
  "live2d_renderer_heartbeat_collector",
  "live2d_model_configured_collector",
  "live2d_cue_capability_collector",
  "live2d_recovery_capability_collector",
  "live2d_route_guard_collector",
  "live2d_evidence_collector_status_collector",
  "live2d_fresh_evidence_bundle_collector",
  "live2d_summary_intake_collector",
  "live2d_owner_confirmation_binding_collector",
  "live2d_go_nogo_blocker_collector",
  "trusted_loader_preflight_collector",
  "trusted_loader_enablement_gate_collector",
  "license_boundary_collector",
  "sdk_vendor_boundary_collector",
  "priority1_blocker_collector",
  "motion_dataset_row_evidence_collector",
]);

const REAL_EVIDENCE_COLLECTOR_SAFE_OUTPUT_FIELDS = Object.freeze([
  "component",
  "collector_name",
  "collector_status",
  "evidence_source_type",
  "freshness_status",
  "safe_evidence_ref",
  "safe_audit_ref",
  "head_sha_ref",
  "run_id_ref",
  "file_scope",
  "checked_at_bucket",
  "status_reason_code",
  "redaction_status",
  "blocker_labels",
  "safe_next_action",
]);

const REAL_EVIDENCE_COLLECTOR_FIXTURE_POSITIVE_CASES = Object.freeze([
  "collector_fixture_positive_required_collectors_present",
  "collector_fixture_positive_safe_output_fields_present",
  "collector_fixture_positive_source_binding_present",
  "collector_fixture_positive_freshness_binding_present",
  "collector_fixture_positive_audit_binding_present",
  "collector_fixture_positive_redaction_status_pass",
  "collector_fixture_positive_safe_summary_only",
]);

const REAL_EVIDENCE_COLLECTOR_FIXTURE_REJECTION_CASES = Object.freeze([
  "collector_fixture_reject_missing_collector",
  "collector_fixture_reject_missing_safe_output_field",
  "collector_fixture_reject_fixture_source",
  "collector_fixture_reject_dry_run_source",
  "collector_fixture_reject_mock_source",
  "collector_fixture_reject_stale_source",
  "collector_fixture_reject_unknown_source",
  "collector_fixture_reject_missing_source_binding",
  "collector_fixture_reject_missing_freshness_binding",
  "collector_fixture_reject_missing_audit_binding",
  "collector_fixture_reject_missing_redaction_status",
  "collector_fixture_reject_forbidden_material",
  "collector_fixture_reject_execution_attempt",
  "collector_fixture_reject_real_probe_attempt",
  "collector_fixture_reject_external_service_attempt",
  "collector_fixture_reject_real_sdk_attempt",
  "collector_fixture_reject_real_renderer_attempt",
  "collector_fixture_reject_owner_confirmation_attempt",
  "collector_fixture_reject_readiness_claim",
  "collector_fixture_reject_priority1_resolution",
  "collector_fixture_reject_motion_dataset_execution",
]);

const REAL_EVIDENCE_COLLECTOR_DRY_RUN_REQUIRED_FIELDS = Object.freeze([
  "collector_names",
  "source_binding",
  "freshness_binding",
  "audit_binding",
  "redaction_status",
  "safe_output_fields",
  "safe_next_action",
]);

const REAL_EVIDENCE_COLLECTOR_DRY_RUN_REJECTION_REASONS = Object.freeze([
  "dry_run_reject_missing_collector_name",
  "dry_run_reject_unknown_collector_name",
  "dry_run_reject_missing_source_binding",
  "dry_run_reject_missing_freshness_binding",
  "dry_run_reject_missing_audit_binding",
  "dry_run_reject_missing_redaction_status",
  "dry_run_reject_missing_safe_output_fields",
  "dry_run_reject_forbidden_raw_field",
  "dry_run_reject_fixture_source_as_real_evidence",
  "dry_run_reject_dry_run_source_as_real_evidence",
  "dry_run_reject_mock_source",
  "dry_run_reject_stale_source",
  "dry_run_reject_unknown_source",
  "dry_run_reject_collector_execution_request",
  "dry_run_reject_real_probe_request",
  "dry_run_reject_external_service_request",
  "dry_run_reject_real_sdk_request",
  "dry_run_reject_real_renderer_request",
  "dry_run_reject_owner_confirmation_request",
  "dry_run_reject_readiness_promotion",
  "dry_run_reject_go_request",
  "dry_run_reject_blocker_resolution",
  "dry_run_reject_trusted_loader_enablement",
  "dry_run_reject_motion_execution",
]);

const REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES = Object.freeze([
  "real_probe_summary",
  "operator_confirmed_summary",
  "manual_upload_summary",
  "audit_reference",
  "owner_confirmed_reference",
]);

const REJECTED_REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES = Object.freeze([
  "fixture",
  "dry_run",
  "mock",
  "stale",
  "unsafe_material",
  "unknown_source_type",
]);

const SAFE_EVIDENCE_SUMMARY_ACCEPTED_FIELDS = Object.freeze([
  "component",
  "status",
  "freshness_status",
  "evidence_source_type",
  "evidence_ref",
  "safe_audit_ref",
  "head_sha_ref",
  "run_id_ref",
  "file_scope",
  "checked_at_bucket",
  "status_reason_code",
  "redaction_status",
  "blocker_labels",
  "safe_next_action",
]);

const SAFE_EVIDENCE_SUMMARY_REQUIRED_BINDINGS = Object.freeze([
  "component",
  "evidence_source_type",
  "evidence_ref",
  "safe_audit_ref",
  "head_sha_ref",
  "run_id_ref",
  "freshness_status",
  "redaction_status",
]);

const SAFE_EVIDENCE_SUMMARY_ACCEPTED_SOURCE_TYPES = Object.freeze([
  "real_probe_summary",
  "operator_confirmed_summary",
  "manual_upload_summary",
  "audit_reference",
  "owner_confirmed_reference",
]);

const SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES = Object.freeze([
  "fixture",
  "dry_run",
  "mock",
  "stale",
  "unsafe_material",
  "unknown_source_type",
]);

const SAFE_EVIDENCE_SUMMARY_REJECTED_RAW_FIELDS = Object.freeze([
  "evidence_body_material",
  "cue_body_material",
  "renderer_body_material",
  "loader_candidate_material",
  "loader_error_material",
  "owner_note_material",
  "request_note_material",
  "network_locator_material",
  "auth_value_material",
  "sensitive_value_material",
  "private_locator_material",
  "model_locator_material",
  "motion_locator_material",
  "sdk_vendor_locator_material",
  "shell_instruction_body_material",
  "obs_instruction_material",
  "world_instruction_material",
  "api_response_material",
  "audio_body_material",
  "frame_body_material",
  "comment_text_material",
]);

const LIVE2D_OWNER_CONFIRMATION_BINDING_SCOPES = Object.freeze([
  "live2d_real_evidence_collection",
  "live2d_renderer_heartbeat_review",
  "live2d_model_configured_review",
  "live2d_cue_capability_review",
  "live2d_recovery_capability_review",
  "live2d_safe_summary_intake_review",
  "live2d_fresh_evidence_bundle_review",
  "live2d_go_nogo_review",
  "trusted_loader_enablement_review",
  "priority1_resolution_review",
  "motion_dataset_execution_review",
  "production_readiness_review",
]);

const LIVE2D_OWNER_CONFIRMATION_BINDING_REF_FIELDS = Object.freeze([
  "safe_evidence_summary_ref",
  "summary_intake_ref",
  "freshness_threshold_ref",
  "evidence_collection_plan_ref",
  "audit_ref",
  "head_sha_ref",
  "run_id_ref",
  "file_scope",
  "owner_scope",
  "confirmation_status",
  "expires_at_bucket",
  "revocation_status",
  "status_reason_code",
]);

const LIVE2D_GO_NOGO_BLOCKER_RESOLUTION_REF_FIELDS = Object.freeze([
  "blocker_id",
  "component",
  "safe_evidence_summary_ref",
  "summary_intake_ref",
  "freshness_threshold_ref",
  "owner_confirmation_ref",
  "audit_ref",
  "scope_ref",
  "emergency_stop_ref",
  "head_sha_ref",
  "run_id_ref",
  "file_scope",
  "redaction_status",
  "status_reason_code",
]);

const REAL_RESIDENT_EVIDENCE_COLLECTION_FORBIDDEN_MATERIAL_CLASSES = Object.freeze([
  "cue_body_material",
  "renderer_body_material",
  "evidence_body_material",
  "loader_candidate_material",
  "loader_error_material",
  "owner_note_material",
  "request_note_material",
  "model_location_material",
  "motion_location_material",
  "service_location_value",
  "auth_value",
  "private_value",
  "sdk_vendor_location_material",
  "local_machine_location_material",
  "shell_invocation_body",
  "obs_invocation",
  "world_invocation",
]);

const REAL_RESIDENT_EVIDENCE_COLLECTION_SEQUENCE = Object.freeze([
  "verify_route_guard",
  "verify_renderer_heartbeat_summary",
  "verify_model_configured_summary",
  "verify_cue_capability_summary",
  "verify_recovery_capability_summary",
  "verify_evidence_collector_summary",
  "submit_safe_evidence_intake",
  "bind_owner_confirmation_scope",
  "run_go_nogo_preflight_review",
  "keep_priority1_blocked_until_real_fresh_evidence",
  "keep_motion_dataset_non_executable_until_row_schema_and_rows_exist",
]);

const PROVISIONING_STATUS = new Set([
  "not_configured",
  "missing_dependency",
  "operator_attention_required",
  "candidate_present",
  "unsupported_loader_kind",
  "license_attention_required",
  "unsafe_configuration",
  "future_only",
]);

const LOADER_DEPENDENCY_STATUS = new Set([
  "not_configured",
  "missing_dependency",
  "operator_attention_required",
  "candidate_present",
  "unsupported_loader_kind",
  "unsafe_configuration",
  "future_only",
]);

const LICENSE_STATUS = new Set([
  "not_applicable",
  "owner_confirmation_required",
  "license_attention_required",
]);

const UNSAFE_ENV_VALUE_PATTERNS = [
  /^[a-z][a-z0-9+.-]*:\/\//iu,
  /\b(?:authorization|bearer|oauth|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|token|secret|password|endpoint)\b/iu,
  /\b(?:raw[_ -]?loader[_ -]?error|loader[_ -]?error|stack[_ -]?trace|stack)\b/iu,
  /\0/u,
];

export function inspectCubismLoaderProvisioning(
  env = process.env,
  { trustedLoaderAllowlistEnabled = false } = {}
) {
  const source = env && typeof env === "object" ? env : {};
  const configuredEnvNames = configuredLoaderEnvNames(source);
  if (configuredEnvNames.length === 0) {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind: "not_configured",
      loaderDependencyStatus: "missing_dependency",
      licenseStatus: "not_applicable",
      provisioningStatus: "not_configured",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  const requestedKind = normalizeLoaderKind(source[LOADER_KIND_ENV_NAME]);
  const loaderKind = requestedKind || inferConfiguredLoaderKind(source);
  if (hasUnsafeConfiguredEnvValue(source, configuredEnvNames)) {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind,
      loaderDependencyStatus: "unsafe_configuration",
      licenseStatus: "license_attention_required",
      provisioningStatus: "unsafe_configuration",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  if (!CUBISM_LOADER_KIND_CANDIDATES.includes(loaderKind)) {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind: "unsupported_loader_kind",
      loaderDependencyStatus: "unsupported_loader_kind",
      licenseStatus: "license_attention_required",
      provisioningStatus: "unsupported_loader_kind",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  if (loaderKind === "cubism_moc_create") {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind,
      loaderDependencyStatus: "future_only",
      licenseStatus: "not_applicable",
      provisioningStatus: "future_only",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  const frameworkEnvNames = configuredEnvNames.filter((name) => FRAMEWORK_FILE_ENV_NAMES.has(name));
  const frameworkFilePresent = frameworkEnvNames.some((name) => existsSync(String(source[name] ?? "")));
  if (!frameworkFilePresent) {
    return createCubismLoaderProvisioningSummary({
      configuredEnvNames,
      loaderKind,
      loaderDependencyStatus: "operator_attention_required",
      licenseStatus: "license_attention_required",
      provisioningStatus: "operator_attention_required",
      trustedLoaderAllowlistEnabled,
      operatorAttentionRequired: true,
    });
  }

  return createCubismLoaderProvisioningSummary({
    configuredEnvNames,
    loaderKind,
    loaderDependencyStatus: "candidate_present",
    licenseStatus: "license_attention_required",
    provisioningStatus: "candidate_present",
    trustedLoaderAllowlistEnabled,
    operatorAttentionRequired: true,
  });
}

export function createCubismLoaderProvisioningSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const configuredEnvNames = source.configuredEnvNames ?? source.configured_env_names ?? [];
  const loaderKind = source.loaderKind ?? source.loader_kind ?? "not_configured";
  const loaderDependencyStatus = source.loaderDependencyStatus ?? source.loader_dependency_status ?? "not_configured";
  const licenseStatus = source.licenseStatus ?? source.license_status ?? "not_applicable";
  const provisioningStatus = source.provisioningStatus ?? source.provisioning_status ?? "not_configured";
  const requestedTrustedLoaderAllowlistEnabled = source.trustedLoaderAllowlistEnabled === true || source.trusted_loader_allowlist_enabled === true;
  const operatorAttentionRequired = source.operatorAttentionRequired ?? source.operator_attention_required ?? true;
  const safeConfiguredEnvNames = safeEnvNames(configuredEnvNames);
  const summary = {
    schema: CUBISM_LOADER_PROVISIONING_SCHEMA,
    configured_env_names: safeConfiguredEnvNames,
    configured_env_count: safeConfiguredEnvNames.length,
    loader_kind: safeLoaderKind(loaderKind),
    loader_dependency_status: safeLoaderDependencyStatus(loaderDependencyStatus),
    license_status: safeLicenseStatus(licenseStatus),
    provisioning_status: safeProvisioningStatus(provisioningStatus),
    trusted_loader_allowlist_enabled: false,
    trusted_loader_allowlist_request_status: requestedTrustedLoaderAllowlistEnabled
      ? "ignored_requires_separate_owner_confirmed_enablement_pr"
      : "not_requested",
    operator_attention_required: operatorAttentionRequired !== false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
    },
  };
  assertSafePublicObject(summary, "cubism loader provisioning summary");
  return summary;
}

export function createTrustedLoaderAllowlistPreflightSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
} = {}) {
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const allowlistStatus = "disabled";
  const candidateStatus = trustedLoaderCandidateStatus(provisioning);
  const routeGuardPrerequisite = routeGuardStatus === "available" ? "available" : "route_guard_attention_required";
  const realEvidencePrerequisite = evidence.live2d_evidence_status === "attention_required" &&
    evidence.evidence_freshness_status === "fresh" &&
    evidence.fixture_evidence_status === "not_fixture" &&
    evidence.dry_run_evidence_status === "not_dry_run"
    ? "fresh_real_evidence_attention_required"
    : "real_evidence_required";
  const ownerConfirmationStatus = ownerConfirmation === true ? "confirmed_future_only" : "owner_confirmation_required";
  const blockerStatus = allowlistStatus === "disabled"
    ? "allowlist_disabled"
    : routeGuardPrerequisite !== "available"
      ? "route_guard_required"
      : realEvidencePrerequisite !== "fresh_real_evidence_attention_required"
        ? "real_evidence_required"
        : ownerConfirmationStatus;
  const summary = {
    schema: TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA,
    safe_summary_only: true,
    trusted_loader_allowlist_status: allowlistStatus,
    trusted_loader_candidate_kind: provisioning.loader_kind,
    trusted_loader_candidate_status: candidateStatus,
    trusted_loader_blocker_status: blockerStatus,
    trusted_loader_safe_next_action: "separate_owner_confirmed_trusted_loader_enablement_pr_required",
    trusted_loader_route_guard_prerequisite: routeGuardPrerequisite,
    trusted_loader_real_evidence_prerequisite: realEvidencePrerequisite,
    trusted_loader_license_status: provisioning.license_status,
    trusted_loader_owner_confirmation_status: ownerConfirmationStatus,
    trusted_loader_readiness_claimed: false,
    trusted_loader_ready_candidate: false,
    trusted_loader_allowlist_enabled: false,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    owner_provided_file_policy: "env_name_only",
    configured_env_names: provisioning.configured_env_names,
    configured_env_count: provisioning.configured_env_count,
    route_guard_required: routeGuardPrerequisite !== "available",
    real_evidence_required: true,
    priority1_status: "BLOCKED",
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
    },
  };
  assertSafePublicObject(summary, "trusted loader allowlist preflight summary");
  return summary;
}

export function createTrustedLoaderEnablementGateSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  allowlistPreflightSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
  ownerConfirmationFresh = false,
  sdkVendorBoundaryStatus = "clear",
} = {}) {
  const preflight = allowlistPreflightSummary && typeof allowlistPreflightSummary === "object"
    ? allowlistPreflightSummary
    : createTrustedLoaderAllowlistPreflightSummary({
      loaderProvisioning,
      live2dEvidenceSummary,
      routeGuardStatus,
      ownerConfirmation,
    });
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const blockers = trustedLoaderEnablementBlockers({
    provisioning,
    evidence,
    preflight,
    routeGuardStatus,
    ownerConfirmation,
    ownerConfirmationFresh,
    sdkVendorBoundaryStatus,
  });
  const summary = {
    schema: TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA,
    safe_summary_only: true,
    trusted_loader_enablement_gate_status: "blocked",
    trusted_loader_enablement_ready_candidate: false,
    trusted_loader_enablement_blocked_reason: blockers[0] ?? "blocked_allowlist_disabled",
    trusted_loader_enablement_blockers: blockers,
    trusted_loader_enablement_required_prerequisites: [
      "route_guard_available",
      "real_evidence_collector_available",
      "allowlist_preflight_available",
      "fresh_real_evidence",
      "owner_confirmation",
      "license_resolved",
      "known_supported_loader_kind",
      "safe_public_summary_only",
    ],
    trusted_loader_enablement_missing_prerequisites: blockers,
    trusted_loader_enablement_safe_next_action: "separate_owner_confirmed_actual_enablement_pr_required",
    trusted_loader_enablement_runtime_readiness_claimed: false,
    trusted_loader_enablement_production_readiness_claimed: false,
    trusted_loader_enablement_readiness_claim_status: "not_runtime_ready",
    route_guard_status: routeGuardStatus === "available" ? "available" : "blocked_missing_route_guard",
    real_evidence_status: safeGateEvidenceStatus(evidence),
    owner_confirmation_status: ownerConfirmation === true
      ? ownerConfirmationFresh === true ? "confirmed_future_only" : "blocked_owner_confirmation_expired"
      : "blocked_missing_owner_confirmation",
    license_status: provisioning.license_status,
    candidate_kind_status: trustedLoaderCandidateStatus(provisioning),
    allowlist_status: preflight.trusted_loader_allowlist_status === "disabled" ? "disabled" : "blocked_allowlist_disabled",
    freshness_status: evidence.evidence_freshness_status === "fresh" ? "fresh" : evidence.evidence_freshness_status ?? "missing",
    trusted_loader_allowlist_enabled: false,
    trusted_loader_preflight_prerequisite: preflight.schema === TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA ? "available" : "blocked_missing_allowlist_preflight",
    no_loader_trusted: true,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    priority1_status: "BLOCKED",
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_loader_candidate_material: true,
      no_loader_error_material: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
    },
  };
  assertSafePublicObject(summary, "trusted loader enablement gate summary");
  return summary;
}

export function createTrustedLoaderOwnerHandoffSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  allowlistPreflightSummary,
  enablementGateSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
  ownerConfirmationFresh = false,
  mockOwnerConfirmation = false,
  licenseBoundaryAcknowledged = false,
  sdkVendorBoundaryStatus = "clear",
} = {}) {
  const preflight = allowlistPreflightSummary && typeof allowlistPreflightSummary === "object"
    ? allowlistPreflightSummary
    : createTrustedLoaderAllowlistPreflightSummary({
      loaderProvisioning,
      live2dEvidenceSummary,
      routeGuardStatus,
      ownerConfirmation,
    });
  const gate = enablementGateSummary && typeof enablementGateSummary === "object"
    ? enablementGateSummary
    : createTrustedLoaderEnablementGateSummary({
      loaderProvisioning,
      live2dEvidenceSummary,
      allowlistPreflightSummary: preflight,
      routeGuardStatus,
      ownerConfirmation,
      ownerConfirmationFresh,
      sdkVendorBoundaryStatus,
    });
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const blockers = trustedLoaderOwnerHandoffBlockers({
    provisioning,
    evidence,
    preflight,
    gate,
    routeGuardStatus,
    ownerConfirmation,
    ownerConfirmationFresh,
    mockOwnerConfirmation,
    licenseBoundaryAcknowledged,
    sdkVendorBoundaryStatus,
  });
  const summary = {
    schema: TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA,
    safe_summary_only: true,
    trusted_loader_owner_handoff_status: "blocked",
    trusted_loader_owner_handoff_ready_candidate: false,
    trusted_loader_owner_handoff_blocked_reason: blockers[0] ?? "handoff_blocked_enablement_gate_blocked",
    trusted_loader_owner_handoff_blockers: blockers,
    trusted_loader_owner_handoff_required_confirmations: [
      "owner_confirmation_required",
      "fresh_real_evidence_required",
      "license_boundary_acknowledgement_required",
      "separate_owner_confirmed_enablement_pr_required",
    ],
    trusted_loader_owner_handoff_safe_next_action: "prepare_owner_review_only_no_enablement",
    trusted_loader_owner_handoff_runtime_readiness_claimed: false,
    trusted_loader_owner_handoff_production_readiness_claimed: false,
    handoff_status: "blocked",
    handoff_ready_candidate: false,
    handoff_blocked_reason: blockers[0] ?? "handoff_blocked_enablement_gate_blocked",
    required_owner_confirmations: "owner_confirmation_required",
    required_real_evidence: "fresh_real_evidence_required",
    required_route_guard_status: routeGuardStatus === "available" ? "available" : "handoff_blocked_missing_route_guard",
    required_evidence_collector_status: safeGateEvidenceStatus(evidence),
    required_allowlist_preflight_status: preflight.schema === TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA ? "available_disabled" : "handoff_blocked_missing_allowlist_preflight",
    required_enablement_gate_status: gate.trusted_loader_enablement_gate_status === "blocked" ? "handoff_blocked_enablement_gate_blocked" : "available_future_only",
    license_boundary_status: licenseBoundaryAcknowledged === true ? "acknowledged_future_only" : "handoff_blocked_license_attention_required",
    sdk_vendor_boundary_status: sdkVendorBoundaryStatus === "clear" ? "clear" : "handoff_blocked_sdk_vendor_boundary",
    candidate_status: trustedLoaderCandidateStatus(provisioning),
    freshness_status: evidence.evidence_freshness_status === "fresh" ? "fresh" : evidence.evidence_freshness_status ?? "missing",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "owner_review_preparation_only",
    residual_risks: [
      "fresh_real_evidence_required",
      "owner_confirmation_required",
      "actual_enablement_requires_separate_pr",
    ],
    do_not_continue_without_owner_confirmation: true,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    mock_owner_confirmation_rejected: mockOwnerConfirmation === true,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
    },
  };
  assertSafePublicObject(summary, "trusted loader owner handoff summary");
  return summary;
}

export function createFreshEvidenceBundleSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  allowlistPreflightSummary,
  enablementGateSummary,
  ownerHandoffSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
  mockOwnerConfirmation = false,
  licenseBoundaryAcknowledged = false,
  sdkVendorBoundaryStatus = "clear",
} = {}) {
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const preflight = allowlistPreflightSummary && typeof allowlistPreflightSummary === "object"
    ? allowlistPreflightSummary
    : createTrustedLoaderAllowlistPreflightSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, routeGuardStatus, ownerConfirmation });
  const gate = enablementGateSummary && typeof enablementGateSummary === "object"
    ? enablementGateSummary
    : createTrustedLoaderEnablementGateSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, routeGuardStatus, ownerConfirmation, sdkVendorBoundaryStatus });
  const handoff = ownerHandoffSummary && typeof ownerHandoffSummary === "object"
    ? ownerHandoffSummary
    : createTrustedLoaderOwnerHandoffSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, enablementGateSummary: gate, routeGuardStatus, ownerConfirmation, mockOwnerConfirmation, licenseBoundaryAcknowledged, sdkVendorBoundaryStatus });
  const blockers = freshEvidenceBundleBlockers({
    provisioning,
    evidence,
    preflight,
    gate,
    handoff,
    routeGuardStatus,
    ownerConfirmation,
    mockOwnerConfirmation,
    licenseBoundaryAcknowledged,
    sdkVendorBoundaryStatus,
  });
  const missingComponents = blockers.filter((reason) => reason.includes("missing"));
  const staleComponents = blockers.filter((reason) => reason.includes("stale"));
  const summary = {
    schema: FRESH_EVIDENCE_BUNDLE_SCHEMA,
    safe_summary_only: true,
    bundle_status: "blocked",
    bundle_ready_candidate: false,
    bundle_blocked_reason: blockers[0] ?? "bundle_blocked_missing_fresh_real_evidence",
    bundle_blocked_reasons: blockers,
    required_components: [
      "route_guard",
      "real_evidence_collector",
      "allowlist_preflight",
      "enablement_gate",
      "owner_handoff",
      "fresh_real_evidence",
      "owner_confirmation",
      "license_boundary",
      "sdk_vendor_boundary",
      "known_supported_candidate_kind",
      "safe_public_summary_only",
    ],
    missing_components: missingComponents,
    stale_components: staleComponents,
    fresh_components: evidence.evidence_freshness_status === "fresh" ? ["live2d_renderer_evidence"] : [],
    route_guard_status: routeGuardStatus === "available" ? "available" : "bundle_blocked_missing_route_guard",
    real_evidence_collector_status: safeGateEvidenceStatus(evidence),
    allowlist_preflight_status: preflight.schema === TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA ? "available_disabled_non_trusting" : "bundle_blocked_missing_allowlist_preflight",
    enablement_gate_status: gate.schema === TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA ? "fail_closed" : "bundle_blocked_missing_enablement_gate",
    owner_handoff_status: handoff.schema === TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA ? "review_only_blocked" : "bundle_blocked_missing_owner_handoff",
    owner_confirmation_status: mockOwnerConfirmation === true ? "bundle_blocked_mock_owner_confirmation" : ownerConfirmation === true ? "confirmed_future_only" : "bundle_blocked_missing_owner_confirmation",
    license_boundary_status: licenseBoundaryAcknowledged === true && provisioning.license_status === "not_applicable" ? "acknowledged_future_only" : "bundle_blocked_license_attention_required",
    sdk_vendor_boundary_status: sdkVendorBoundaryStatus === "clear" ? "clear" : "bundle_blocked_sdk_vendor_boundary",
    live2d_renderer_evidence_status: safeGateEvidenceStatus(evidence),
    live2d_heartbeat_freshness_status: evidence.evidence_freshness_status === "fresh" ? "fresh" : evidence.evidence_freshness_status ?? "missing",
    cue_capability_status: "safe_cue_covered",
    recovery_capability_status: "recovery_cue_covered",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "prepare_owner_review_only_wait_for_fresh_real_evidence",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
      review_preparation_only: true,
    },
  };
  assertSafePublicObject(summary, "fresh evidence bundle summary");
  return summary;
}

export function createGoNoGoPreflightSummary({
  loaderProvisioning,
  live2dEvidenceSummary,
  allowlistPreflightSummary,
  enablementGateSummary,
  ownerHandoffSummary,
  freshEvidenceBundleSummary,
  routeGuardStatus = "available",
  ownerConfirmation = false,
  mockOwnerConfirmation = false,
  licenseBoundaryAcknowledged = false,
  sdkVendorBoundaryStatus = "clear",
  degradedModeAvailable = true,
} = {}) {
  const provisioning = createCubismLoaderProvisioningSummary(loaderProvisioning);
  const evidence = live2dEvidenceSummary && typeof live2dEvidenceSummary === "object" ? live2dEvidenceSummary : {};
  const preflight = allowlistPreflightSummary && typeof allowlistPreflightSummary === "object"
    ? allowlistPreflightSummary
    : createTrustedLoaderAllowlistPreflightSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, routeGuardStatus, ownerConfirmation });
  const gate = enablementGateSummary && typeof enablementGateSummary === "object"
    ? enablementGateSummary
    : createTrustedLoaderEnablementGateSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, routeGuardStatus, ownerConfirmation, sdkVendorBoundaryStatus });
  const handoff = ownerHandoffSummary && typeof ownerHandoffSummary === "object"
    ? ownerHandoffSummary
    : createTrustedLoaderOwnerHandoffSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, enablementGateSummary: gate, routeGuardStatus, ownerConfirmation, mockOwnerConfirmation, licenseBoundaryAcknowledged, sdkVendorBoundaryStatus });
  const bundle = freshEvidenceBundleSummary && typeof freshEvidenceBundleSummary === "object"
    ? freshEvidenceBundleSummary
    : createFreshEvidenceBundleSummary({ loaderProvisioning: provisioning, live2dEvidenceSummary: evidence, allowlistPreflightSummary: preflight, enablementGateSummary: gate, ownerHandoffSummary: handoff, routeGuardStatus, ownerConfirmation, mockOwnerConfirmation, licenseBoundaryAcknowledged, sdkVendorBoundaryStatus });
  const reasons = goNoGoReasons({
    provisioning,
    evidence,
    preflight,
    gate,
    handoff,
    bundle,
    routeGuardStatus,
    ownerConfirmation,
    mockOwnerConfirmation,
    licenseBoundaryAcknowledged,
    sdkVendorBoundaryStatus,
    degradedModeAvailable,
  });
  const summary = {
    schema: GO_NOGO_PREFLIGHT_SCHEMA,
    safe_summary_only: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    no_go_reason: reasons[0] ?? "no_go_missing_fresh_real_evidence",
    no_go_reasons: reasons,
    required_components: [
      "route_guard",
      "real_evidence_collector",
      "allowlist_preflight",
      "enablement_gate",
      "owner_handoff",
      "fresh_evidence_bundle",
      "fresh_real_evidence",
      "owner_confirmation",
      "license_boundary",
      "sdk_vendor_boundary",
      "known_supported_candidate_kind",
      "safe_public_summary_only",
    ],
    missing_components: reasons.filter((reason) => reason.includes("missing")),
    stale_components: reasons.filter((reason) => reason.includes("stale")),
    fresh_components: evidence.evidence_freshness_status === "fresh" ? ["live2d_renderer_evidence"] : [],
    route_guard_status: routeGuardStatus === "available" ? "available" : "no_go_missing_route_guard",
    real_evidence_collector_status: safeGateEvidenceStatus(evidence),
    allowlist_preflight_status: preflight.schema === TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA ? "disabled_non_trusting" : "no_go_missing_allowlist_preflight",
    enablement_gate_status: gate.schema === TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA ? "fail_closed" : "no_go_missing_enablement_gate",
    owner_handoff_status: handoff.schema === TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA ? "review_only" : "no_go_missing_owner_handoff",
    fresh_evidence_bundle_status: bundle.schema === FRESH_EVIDENCE_BUNDLE_SCHEMA ? "review_preparation_only" : "no_go_missing_fresh_evidence_bundle",
    fresh_real_evidence_status: safeGateEvidenceStatus(evidence),
    owner_confirmation_status: mockOwnerConfirmation === true ? "no_go_mock_owner_confirmation" : ownerConfirmation === true ? "confirmed_future_only" : "no_go_missing_owner_confirmation",
    license_boundary_status: licenseBoundaryAcknowledged === true && provisioning.license_status === "not_applicable" ? "acknowledged_future_only" : "no_go_license_attention_required",
    sdk_vendor_boundary_status: sdkVendorBoundaryStatus === "clear" ? "clear" : "no_go_sdk_vendor_boundary",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    degraded_mode_available: degradedModeAvailable === true,
    safe_next_action: "owner_review_only_resolve_no_go_blockers_before_enablement",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    candidate_present_diagnostic_only: provisioning.provisioning_status === "candidate_present",
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      license_confirmation_required: true,
      review_preparation_only: true,
      degraded_mode_is_not_go: true,
    },
  };
  assertSafePublicObject(summary, "go no-go preflight summary");
  return summary;
}

export function createRealEvidenceIntakeSummary(evidence = {}, {
  nowMs = Date.now(),
  freshnessWindowMs = 5 * 60 * 1000,
  ownerConfirmation = false,
  mockOwnerConfirmation = false,
  licenseBoundaryAcknowledged = false,
  sdkVendorBoundaryStatus = "clear",
} = {}) {
  const source = evidence && typeof evidence === "object" ? evidence : {};
  const rawRejected = hasRawEvidenceMaterial(source);
  const sourceType = safeEvidenceLabel(source.source_type, "missing_source_type");
  const sourceTypeAllowed = REAL_EVIDENCE_INTAKE_SOURCE_TYPES.has(sourceType);
  const componentInput = safeEvidenceLabel(source.component, "missing_component");
  const component = REAL_EVIDENCE_INTAKE_COMPONENTS.has(componentInput)
    ? componentInput
    : componentInput === "missing_component"
      ? "missing_component"
      : "external_boundary_component";
  const evidenceTimestampMs = Number.isFinite(source.evidence_timestamp_ms) ? Math.trunc(source.evidence_timestamp_ms) : null;
  const freshnessStatus = realEvidenceFreshnessStatus(source, evidenceTimestampMs, nowMs, freshnessWindowMs);
  const reasons = realEvidenceIntakeReasons({
    source,
    sourceType,
    sourceTypeAllowed,
    component,
    evidenceTimestampMs,
    freshnessStatus,
    rawRejected,
    ownerConfirmation,
    mockOwnerConfirmation,
    licenseBoundaryAcknowledged,
    sdkVendorBoundaryStatus,
  });
  const summary = {
    schema: REAL_EVIDENCE_INTAKE_SCHEMA,
    safe_summary_only: true,
    evidence_intake_status: reasons.length > 0 ? "blocked" : "attention_required",
    intake_ready_candidate: false,
    intake_blocked_reason: reasons[0] ?? "intake_review_preparation_only",
    intake_blocked_reasons: reasons,
    accepted_source_type: sourceTypeAllowed && rawRejected !== true ? sourceType : "none",
    rejected_source_type: sourceTypeAllowed ? "none" : sourceType,
    component,
    component_status: safeEvidenceLabel(source.component_status, "missing_component_status"),
    evidence_timestamp_ms: evidenceTimestampMs === null ? "missing" : "present",
    freshness_status: freshnessStatus,
    evidence_source_kind: sourceTypeAllowed ? sourceType : "rejected_unknown_source_type",
    evidence_schema_status: source.schema_version ? "present" : "missing_schema_version",
    required_fields_status: requiredEvidenceFieldsStatus(source, evidenceTimestampMs),
    redaction_status: source.redaction_status === "pass" ? "pass" : "blocked_redaction_status_required",
    unsafe_material_rejected: rawRejected,
    fixture_evidence_status: sourceType === "fixture" ? "fixture_not_real_evidence" : "not_fixture",
    dry_run_evidence_status: sourceType === "dry_run" ? "dry_run_not_real_evidence" : "not_dry_run",
    stale_evidence_status: freshnessStatus === "stale" ? "stale_not_fresh_evidence" : "not_fresh_real_evidence",
    owner_confirmation_status: mockOwnerConfirmation === true ? "mock_owner_confirmation_rejected" : ownerConfirmation === true ? "owner_confirmation_required_for_future_review" : "missing_owner_confirmation",
    license_boundary_status: licenseBoundaryAcknowledged === true ? "acknowledged_future_only" : "license_attention_required",
    sdk_vendor_boundary_status: sdkVendorBoundaryStatus === "clear" ? "clear" : "sdk_vendor_boundary_blocked",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "collect_future_owner_confirmed_fresh_real_evidence_summary",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      review_preparation_only: true,
      no_unsafe_evidence_material: true,
    },
  };
  assertSafePublicObject(summary, "real evidence intake summary");
  return summary;
}

export function createOwnerConfirmationEnvelopeSummary(envelope = {}, {
  requiredScopes = OWNER_CONFIRMATION_SCOPES,
  requestedScope = "",
  nowMs = Date.now(),
} = {}) {
  const source = envelope && typeof envelope === "object" ? envelope : {};
  const required = requiredScopes.filter((scope) => OWNER_CONFIRMATION_SCOPE_SET.has(scope));
  const confirmationScope = safeEvidenceLabel(source.confirmation_scope, "missing_confirmation_scope");
  const confirmedByRole = safeEvidenceLabel(source.confirmed_by_role, "missing_confirmed_by_role");
  const sourceKind = safeEvidenceLabel(source.confirmation_source_kind, "missing_confirmation_source_kind");
  const timestampMs = Number.isFinite(source.confirmation_timestamp_ms) ? Math.trunc(source.confirmation_timestamp_ms) : null;
  const expiryMs = Number.isFinite(source.confirmation_expires_at_ms) ? Math.trunc(source.confirmation_expires_at_ms) : null;
  const scopeMismatch = requestedScope && confirmationScope !== requestedScope;
  const revoked = source.revoked === true || source.confirmation_status === "revoked";
  const mock = source.mock_confirmation === true || source.confirmation_source_kind === "mock";
  const fixture = source.confirmation_source_kind === "fixture";
  const dryRun = source.confirmation_source_kind === "dry_run";
  const expired = expiryMs !== null && expiryMs <= nowMs;
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source);
  const scopeConfirmed = false;
  const reasons = ownerConfirmationEnvelopeReasons({
    source,
    confirmationScope,
    confirmedByRole,
    sourceKind,
    timestampMs,
    expiryMs,
    scopeMismatch,
    revoked,
    mock,
    fixture,
    dryRun,
    expired,
    unsafeMaterialRejected,
  });
  const summary = {
    schema: OWNER_CONFIRMATION_ENVELOPE_SCHEMA,
    safe_summary_only: true,
    owner_confirmation_envelope_status: "blocked",
    confirmation_ready_candidate: false,
    confirmation_blocked_reason: reasons[0] ?? "confirmation_blocked_no_real_owner_confirmation",
    confirmation_blocked_reasons: reasons,
    required_confirmation_scopes: required,
    missing_confirmation_scopes: required,
    confirmed_scopes: scopeConfirmed ? [confirmationScope] : [],
    expired_scopes: expired && OWNER_CONFIRMATION_SCOPE_SET.has(confirmationScope) ? [confirmationScope] : [],
    revoked_scopes: revoked && OWNER_CONFIRMATION_SCOPE_SET.has(confirmationScope) ? [confirmationScope] : [],
    scope_mismatch_status: scopeMismatch ? "scope_mismatch_rejected" : "scope_specific_required",
    confirmed_by_role_status: confirmedByRole === "owner" ? "owner_role_required_future_only" : "wrong_role_rejected",
    confirmation_timestamp_ms: timestampMs === null ? "missing" : "present",
    confirmation_expiry_status: expired ? "expired_rejected" : expiryMs === null ? "expiry_required" : "not_expired_but_not_confirmed",
    confirmation_source_kind: sourceKind,
    confirmation_audit_ref_status: source.audit_ref ? "present" : "missing_audit_ref",
    mock_confirmation_status: mock ? "mock_confirmation_rejected" : "not_mock",
    owner_private_note_redaction_status: unsafeMaterialRejected ? "unsafe_material_rejected" : source.redaction_status === "pass" ? "pass" : "redaction_status_required",
    fresh_evidence_binding_status: "fresh_real_evidence_required",
    go_nogo_binding_status: "go_nogo_required_no_go_by_default",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "obtain_future_scope_specific_owner_confirmation_after_real_evidence_review",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      review_preparation_only: true,
      no_unsafe_confirmation_material: true,
    },
  };
  assertSafePublicObject(summary, "owner confirmation envelope summary");
  return summary;
}

export function createRealEvidenceRequestPacketSummary(packet = {}, {
  requiredComponents = REAL_EVIDENCE_REQUEST_COMPONENTS,
  requiredScopes = OWNER_CONFIRMATION_SCOPES,
} = {}) {
  const source = packet && typeof packet === "object" ? packet : {};
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source);
  const redactionStatus = source.redaction_status === "pass" ? "pass" : "redaction_status_required";
  const reasons = realEvidenceRequestPacketReasons({ source, unsafeMaterialRejected, redactionStatus });
  const componentStatuses = Object.fromEntries(requiredComponents.map((component) => [component, "pending_required"]));
  const scopeStatuses = Object.fromEntries(requiredScopes.map((scope) => [scope, "pending_required"]));
  const summary = {
    schema: REAL_EVIDENCE_REQUEST_PACKET_SCHEMA,
    safe_summary_only: true,
    real_evidence_request_packet_status: "blocked",
    request_packet_ready_candidate: false,
    request_packet_blocked_reason: reasons[0] ?? "request_packet_blocked_missing_real_resident_evidence",
    request_packet_blocked_reasons: reasons,
    required_evidence_components: requiredComponents,
    missing_evidence_components: requiredComponents,
    required_confirmation_scopes: requiredScopes,
    missing_confirmation_scopes: requiredScopes,
    required_freshness_thresholds: {
      live2d_renderer_heartbeat: "fresh_real_resident_evidence_required",
      cue_capability: "fresh_real_resident_evidence_required",
      recovery_capability: "fresh_real_resident_evidence_required",
      priority1: "real_resident_fresh_evidence_required",
      motion_dataset: "real_rows_required_checked_row_count_gt_0",
    },
    required_audit_refs: "required_pending",
    required_redaction_status: "pass_required",
    route_guard_evidence_request: componentStatuses.live2d_route_guard,
    real_evidence_collector_request: componentStatuses.live2d_evidence_collector,
    fresh_evidence_bundle_request: componentStatuses.live2d_fresh_evidence_bundle,
    real_evidence_intake_request: componentStatuses.live2d_real_evidence_intake,
    go_nogo_preflight_request: componentStatuses.live2d_go_nogo_preflight,
    owner_confirmation_envelope_request: componentStatuses.live2d_owner_confirmation_envelope,
    trusted_loader_preflight_request: componentStatuses.trusted_loader_preflight,
    enablement_gate_request: componentStatuses.trusted_loader_enablement_gate,
    owner_handoff_request: componentStatuses.trusted_loader_owner_handoff,
    license_boundary_request: componentStatuses.license_boundary,
    sdk_vendor_boundary_request: componentStatuses.sdk_vendor_boundary,
    priority1_evidence_request: componentStatuses.priority1_real_resident_evidence,
    motion_dataset_evidence_request: componentStatuses.motion_dataset_row_evidence,
    evidence_component_statuses: componentStatuses,
    confirmation_scope_statuses: scopeStatuses,
    fixture_evidence_status: "fixture_not_real_evidence",
    dry_run_evidence_status: "dry_run_not_real_evidence",
    stale_evidence_status: "stale_not_fresh_evidence",
    mock_owner_confirmation_status: "mock_owner_confirmation_not_real",
    wrong_role_confirmation_status: "wrong_role_confirmation_rejected",
    expired_confirmation_status: "expired_confirmation_rejected",
    revoked_confirmation_status: "revoked_confirmation_rejected",
    unsafe_request_note_status: unsafeMaterialRejected ? "unsafe_material_rejected" : "request_note_forbidden",
    unsafe_owner_note_status: unsafeMaterialRejected ? "unsafe_material_rejected" : "owner_note_forbidden",
    unsafe_evidence_body_status: unsafeMaterialRejected ? "unsafe_material_rejected" : "evidence_body_forbidden",
    redaction_status: redactionStatus,
    request_packet_collects_real_evidence: false,
    request_packet_performs_live_probes: false,
    request_packet_creates_owner_confirmation: false,
    request_packet_completeness_is_readiness: false,
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    real_evidence_intake_status: "schema_only_blocked_or_attention",
    go_nogo_status: "no_go",
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    safe_next_action: "owner_operator_supplies_future_fresh_real_evidence_after_review",
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      owner_provided_files_only: true,
      review_preparation_only: true,
      no_unsafe_evidence_material: true,
      request_only_no_collection: true,
    },
  };
  assertSafePublicObject(summary, "real evidence request packet summary");
  return summary;
}

export function createRealResidentEvidenceCollectionPlanSummary(plan = {}, {
  requiredComponents = REAL_EVIDENCE_REQUEST_COMPONENTS,
  requiredScopes = OWNER_CONFIRMATION_SCOPES,
} = {}) {
  const source = plan && typeof plan === "object" ? plan : {};
  const sourceType = safeEvidenceLabel(source.source_type ?? source.source_kind, "unknown_source_type");
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const rejectedSourceType = REJECTED_REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES.includes(sourceType);
  const componentStatuses = Object.fromEntries(requiredComponents.map((component) => [component, "missing_required"]));
  const scopeStatuses = Object.fromEntries(requiredScopes.map((scope) => [scope, "pending_required"]));
  const blockedReasons = [
    "collection_plan_only_not_collection",
    "collection_plan_blocked_missing_real_resident_evidence",
    "collection_plan_blocked_missing_owner_confirmation",
    "collection_plan_blocked_priority1_unresolved",
    "collection_plan_blocked_motion_dataset_non_executable",
    "collection_plan_not_runtime_ready",
    "collection_plan_not_production_ready",
  ];
  if (rejectedSourceType) blockedReasons.push(`collection_plan_rejected_${sourceType}`);
  if (unsafeMaterialRejected) blockedReasons.push("collection_plan_rejected_forbidden_raw_field");
  const summary = {
    schema: REAL_RESIDENT_EVIDENCE_COLLECTION_PLAN_SCHEMA,
    safe_summary_only: true,
    real_resident_evidence_collection_plan_status: "planning_only",
    planning_only_boundary: true,
    collection_plan_ready_candidate: false,
    ready_candidate: false,
    collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    required_components: requiredComponents,
    missing_components: requiredComponents,
    component_statuses: componentStatuses,
    required_freshness_thresholds: {
      live2d_renderer_heartbeat: "fresh_real_resident_summary_required",
      live2d_model_configured_status: "fresh_real_resident_summary_required",
      live2d_cue_capability: "fresh_real_resident_summary_required",
      live2d_recovery_capability: "fresh_real_resident_summary_required",
      priority1: "real_resident_fresh_evidence_required",
      motion_dataset: "real_rows_required_checked_row_count_gt_0",
    },
    required_owner_confirmation_scopes: requiredScopes,
    owner_confirmation_scope_statuses: scopeStatuses,
    required_audit_refs: [
      "route_guard_review",
      "real_evidence_collector_review",
      "real_evidence_intake_review",
      "owner_confirmation_envelope_review",
      "go_nogo_preflight_review",
    ],
    required_redaction_status: "pass_required",
    accepted_source_types: REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES,
    rejected_source_types: REJECTED_REAL_RESIDENT_EVIDENCE_COLLECTION_SOURCE_TYPES,
    source_type_status: rejectedSourceType ? `rejected_${sourceType}` : "future_source_type_required",
    forbidden_material_classes: REAL_RESIDENT_EVIDENCE_COLLECTION_FORBIDDEN_MATERIAL_CLASSES,
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    safe_collection_sequence: REAL_RESIDENT_EVIDENCE_COLLECTION_SEQUENCE,
    safe_next_action: "prepare_owner_confirmed_future_collection_task_after_plan_review",
    request_packet_status: "request_only_no_collection",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    trusted_loader_allowlist_enabled: false,
    trusted_loader_allowlist_status: "disabled",
    no_loader_trusted: true,
    candidate_present_diagnostic_only: true,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    collection_plan_collects_real_evidence: false,
    collection_plan_performs_live_probes: false,
    collection_plan_creates_owner_confirmation: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(summary, "real resident evidence collection plan summary");
  return summary;
}

export function createRealEvidenceCollectorManifestSummary(manifest = {}, {
  requiredCollectors = LIVE2D_REAL_EVIDENCE_COLLECTORS,
  safeOutputFields = REAL_EVIDENCE_COLLECTOR_SAFE_OUTPUT_FIELDS,
} = {}) {
  const source = manifest && typeof manifest === "object" ? manifest : {};
  const sourceType = safeEvidenceLabel(source.source_type ?? source.source_kind, "missing");
  const rejectedSourceType = SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES.includes(sourceType) || sourceType === "raw_payload";
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const collectorRegistry = Object.fromEntries(requiredCollectors.map((collector) => [collector, {
    collector_name: collector,
    collector_status: "planning_only",
    collector_ready_candidate: false,
    execution_started: false,
    real_probe_started: false,
    source_binding_required: true,
    freshness_binding_required: true,
    audit_binding_required: true,
    redaction_status_required: true,
    safe_summary_only: true,
  }]));
  const blockedReasons = [
    "collector_manifest_planning_only_not_execution",
    "collector_manifest_blocked_missing_future_fresh_real_evidence",
    "collector_manifest_blocked_missing_owner_confirmation",
    "collector_manifest_blocked_priority1_unresolved",
    "collector_manifest_blocked_motion_dataset_non_executable",
    "collector_manifest_not_runtime_ready",
    "collector_manifest_not_production_ready",
  ];
  if (rejectedSourceType) blockedReasons.push(`collector_manifest_rejected_${sourceType}`);
  if (unsafeMaterialRejected) blockedReasons.push("collector_manifest_rejected_forbidden_raw_field");
  const summary = {
    schema: LIVE2D_REAL_EVIDENCE_COLLECTOR_MANIFEST_SCHEMA,
    safe_summary_only: true,
    real_evidence_collector_manifest_status: "planning_only",
    planning_only_boundary: true,
    collector_manifest_ready_candidate: false,
    collector_execution_started: false,
    collector_real_probe_started: false,
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    required_collectors: requiredCollectors,
    collector_registry: collectorRegistry,
    collector_safe_output_fields: safeOutputFields,
    collector_required_source_binding: "required",
    collector_required_freshness_binding: "required",
    collector_required_audit_binding: "required",
    collector_required_redaction_status: "pass_required",
    collector_rejected_material_classes: SAFE_EVIDENCE_SUMMARY_REJECTED_RAW_FIELDS,
    collector_rejected_source_types: SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES,
    collector_network_policy: "blocked_by_default_no_external_services",
    collector_sdk_policy: "forbid_real_sdk_call",
    collector_renderer_policy: "forbid_real_renderer_call",
    fixture_evidence_policy: "fixture_collector_output_is_not_real_evidence",
    dry_run_evidence_policy: "dry_run_collector_output_is_not_real_evidence",
    stale_evidence_policy: "stale_collector_output_is_not_fresh_evidence",
    mock_evidence_policy: "mock_collector_output_is_not_real_evidence",
    source_type_status: rejectedSourceType ? `rejected_${sourceType}` : "future_safe_summary_source_required",
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    freshness_threshold_status: "planning_only",
    safe_evidence_summary_contract_status: "planning_only",
    summary_intake_binding_status: "planning_only",
    owner_confirmation_binding_status: "planning_only",
    go_nogo_blocker_resolution_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    checked_row_count: 0,
    trusted_loader_allowlist_enabled: false,
    trusted_loader_allowlist_status: "disabled",
    no_loader_trusted: true,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    collector_manifest_executes_collectors: false,
    collector_manifest_collects_real_evidence: false,
    collector_manifest_performs_live_probes: false,
    collector_manifest_calls_real_renderer: false,
    collector_manifest_calls_real_sdk: false,
    collector_manifest_calls_external_services: false,
    collector_manifest_creates_owner_confirmation: false,
    safe_next_action: "future_owner_confirmed_real_evidence_collection_task_required",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_owner_confirmation_creation: true,
      no_trusted_loader_enablement: true,
      no_env_values: true,
      no_endpoint_values: true,
      no_token_values: true,
      no_secret_values: true,
      no_private_paths: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(summary, "real evidence collector manifest summary");
  return summary;
}

export function createRealEvidenceCollectorFixturePackSummary(fixturePack = {}, {
  manifestSummary = createRealEvidenceCollectorManifestSummary(),
  positiveCases = REAL_EVIDENCE_COLLECTOR_FIXTURE_POSITIVE_CASES,
  rejectionCases = REAL_EVIDENCE_COLLECTOR_FIXTURE_REJECTION_CASES,
} = {}) {
  const source = fixturePack && typeof fixturePack === "object" ? fixturePack : {};
  const sourceType = safeEvidenceLabel(source.source_type ?? source.source_kind, "missing");
  const rejectedSourceType = SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES.includes(sourceType) || sourceType === "unknown";
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const executionAttemptRejected = source.collector_execution_started === true
    || source.real_evidence_collection_started === true
    || source.executes_collectors === true;
  const realProbeAttemptRejected = source.real_probe_started === true
    || source.collector_real_probe_started === true
    || source.performs_live_probe === true;
  const externalServiceAttemptRejected = source.external_service_call_started === true
    || source.calls_external_service === true;
  const realSdkAttemptRejected = source.real_sdk_call_started === true
    || source.calls_real_sdk === true;
  const realRendererAttemptRejected = source.real_renderer_call_started === true
    || source.calls_real_renderer === true;
  const ownerConfirmationAttemptRejected = source.owner_confirmation_created === true
    || source.owner_confirmation_confirmed === true
    || source.creates_owner_confirmation === true;
  const readinessAttemptRejected = source.renderer_ready === true
    || source.model_loaded === true
    || source.scene_loaded === true
    || source.browser_cue_delivery_ready === true
    || source.runtime_readiness_claimed === true
    || source.production_readiness_claimed === true;
  const priority1AttemptRejected = source.priority1_status === "RESOLVED" || source.blocker_resolved === true;
  const motionDatasetAttemptRejected = source.motion_dataset_executable === true;
  const rejectedCasesTriggered = [
    rejectedSourceType ? `collector_fixture_reject_${sourceType}_source` : "",
    unsafeMaterialRejected ? "collector_fixture_reject_forbidden_material" : "",
    executionAttemptRejected ? "collector_fixture_reject_execution_attempt" : "",
    realProbeAttemptRejected ? "collector_fixture_reject_real_probe_attempt" : "",
    externalServiceAttemptRejected ? "collector_fixture_reject_external_service_attempt" : "",
    realSdkAttemptRejected ? "collector_fixture_reject_real_sdk_attempt" : "",
    realRendererAttemptRejected ? "collector_fixture_reject_real_renderer_attempt" : "",
    ownerConfirmationAttemptRejected ? "collector_fixture_reject_owner_confirmation_attempt" : "",
    readinessAttemptRejected ? "collector_fixture_reject_readiness_claim" : "",
    priority1AttemptRejected ? "collector_fixture_reject_priority1_resolution" : "",
    motionDatasetAttemptRejected ? "collector_fixture_reject_motion_dataset_execution" : "",
  ].filter(Boolean);
  const blockedReasons = [
    "collector_fixture_pack_synthetic_only",
    "collector_fixture_pack_blocked_no_real_collection",
    "collector_fixture_pack_blocked_no_live_probe",
    "collector_fixture_pack_blocked_no_owner_confirmation",
    "collector_fixture_pack_blocked_no_go",
    "collector_fixture_pack_blocked_priority1_unresolved",
    "collector_fixture_pack_blocked_motion_dataset_non_executable",
    "collector_fixture_pack_not_runtime_ready",
    "collector_fixture_pack_not_production_ready",
    ...rejectedCasesTriggered,
  ];
  const summary = {
    schema: LIVE2D_REAL_EVIDENCE_COLLECTOR_FIXTURE_PACK_SCHEMA,
    safe_summary_only: true,
    real_evidence_collector_fixture_pack_status: "planning_only",
    fixture_pack_ready_candidate: false,
    collector_fixture_pack_ready_candidate: false,
    collector_dry_run_verifier_status: "planning_only",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    no_go_preserved: true,
    positive_fixture_cases: positiveCases,
    rejection_fixture_cases: rejectionCases,
    required_collector_fixture_cases: positiveCases,
    collector_fixture_expected_safe_passes: positiveCases,
    collector_fixture_expected_rejections: rejectionCases,
    collector_fixture_redaction_policy: "safe_summary_only_no_forbidden_material",
    collector_fixture_network_policy: "blocked_by_default_no_external_services",
    collector_fixture_sdk_policy: "forbid_real_sdk_call",
    collector_fixture_renderer_policy: "forbid_real_renderer_call",
    collector_fixture_registry: Object.fromEntries((manifestSummary.required_collectors || []).map((collector) => [collector, {
      collector_name: collector,
      fixture_case_status: "synthetic_fixture_only",
      dry_run_verifier_status: "planning_only",
      ready_candidate: false,
      execution_started: false,
      real_probe_started: false,
      safe_summary_only: true,
    }])),
    rejection_cases_triggered: [...new Set(rejectedCasesTriggered)],
    redaction_policy: "safe_summary_only_no_forbidden_material",
    network_policy: "blocked_by_default_no_external_services",
    sdk_policy: "forbid_real_sdk_call",
    renderer_policy: "forbid_real_renderer_call",
    fixture_source_rejection: "fixture_source_rejected_for_real_evidence",
    dry_run_source_rejection: "dry_run_source_rejected_for_real_evidence",
    mock_source_rejection: "mock_source_rejected_for_real_evidence",
    stale_source_rejection: "stale_source_rejected_for_fresh_evidence",
    unknown_source_rejection: "unknown_source_rejected",
    missing_binding_rejection: "missing_source_freshness_audit_or_redaction_binding_rejected",
    execution_attempt_rejection: "collector_execution_attempt_rejected",
    real_probe_attempt_rejection: "real_probe_attempt_rejected",
    external_service_attempt_rejection: "external_service_attempt_rejected",
    trusted_loader_boundary: "trusted_loader_allowlist_disabled_no_loader_trusted",
    owner_confirmation_boundary: "schema_only_no_owner_confirmation_created",
    go_nogo_preservation: "go_nogo_status_no_go",
    collection_plan_preservation: "collection_plan_planning_only",
    freshness_threshold_preservation: "freshness_threshold_planning_only",
    safe_evidence_summary_contract_preservation: "safe_evidence_summary_contract_planning_only",
    summary_intake_binding_preservation: "summary_intake_binding_planning_only",
    owner_confirmation_binding_preservation: "owner_confirmation_binding_planning_only",
    blocker_resolution_schema_preservation: "blocker_resolution_schema_planning_only",
    collector_manifest_preservation: manifestSummary.real_evidence_collector_manifest_status === "planning_only"
      ? "collector_manifest_planning_only"
      : "collector_manifest_not_ready",
    source_type_status: rejectedSourceType ? `rejected_${sourceType}` : "synthetic_fixture_pack_only",
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    collector_execution_started: false,
    collector_real_probe_started: false,
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    fixture_pack_executes_collectors: false,
    fixture_pack_collects_real_evidence: false,
    fixture_pack_performs_live_probes: false,
    fixture_pack_calls_real_renderer: false,
    fixture_pack_calls_real_sdk: false,
    fixture_pack_calls_external_services: false,
    fixture_pack_creates_owner_confirmation: false,
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    freshness_threshold_status: "planning_only",
    safe_evidence_summary_contract_status: "planning_only",
    summary_intake_binding_status: "planning_only",
    owner_confirmation_binding_status: "planning_only",
    go_nogo_blocker_resolution_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    checked_row_count: 0,
    trusted_loader_allowlist_enabled: false,
    trusted_loader_allowlist_status: "disabled",
    no_loader_trusted: true,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    safe_next_action: "future_owner_confirmed_real_evidence_collection_task_required",
    boundary_policy: {
      ...createBoundaryPolicy(),
      synthetic_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_owner_confirmation_creation: true,
      no_trusted_loader_enablement: true,
      no_env_values: true,
      no_endpoint_values: true,
      no_token_values: true,
      no_secret_values: true,
      no_private_paths: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(summary, "real evidence collector fixture pack summary");
  return summary;
}

export function createRealEvidenceCollectorDryRunEnvelopeSummary(request = {}, {
  manifestSummary = createRealEvidenceCollectorManifestSummary(),
  fixturePackSummary = createRealEvidenceCollectorFixturePackSummary({ manifestSummary }),
  requiredFields = REAL_EVIDENCE_COLLECTOR_DRY_RUN_REQUIRED_FIELDS,
  rejectionReasons = REAL_EVIDENCE_COLLECTOR_DRY_RUN_REJECTION_REASONS,
} = {}) {
  const source = request && typeof request === "object" ? request : {};
  const requestedCollectors = Array.isArray(source.collector_names)
    ? source.collector_names.map((collector) => safeEvidenceLabel(collector, "unknown_collector"))
    : [];
  const knownCollectors = new Set(manifestSummary.required_collectors || LIVE2D_REAL_EVIDENCE_COLLECTORS);
  const unknownCollectors = requestedCollectors.filter((collector) => !knownCollectors.has(collector));
  const sourceType = safeEvidenceLabel(source.source_type ?? source.source_kind, "missing");
  const missingSourceBinding = source.source_binding !== "present" && source.source_binding_status !== "present";
  const missingFreshnessBinding = source.freshness_binding !== "present" && source.freshness_binding_status !== "present";
  const missingAuditBinding = source.audit_binding !== "present" && source.audit_binding_status !== "present";
  const missingRedactionStatus = !["pass", "safe_summary_only"].includes(source.redaction_status);
  const safeOutputFields = Array.isArray(source.safe_output_fields) ? source.safe_output_fields : [];
  const missingSafeOutputFields = !REAL_EVIDENCE_COLLECTOR_SAFE_OUTPUT_FIELDS.every((field) => safeOutputFields.includes(field));
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const fixtureSourceRejected = sourceType === "fixture";
  const dryRunSourceRejected = sourceType === "dry_run";
  const mockSourceRejected = sourceType === "mock" || source.mock_source === true;
  const staleSourceRejected = sourceType === "stale" || source.freshness_status === "stale";
  const unknownSourceRejected = sourceType === "unknown" || sourceType === "missing";
  const executionRequestRejected = source.collector_execution_requested === true
    || source.collector_execution_started === true
    || source.real_evidence_collection_started === true
    || source.executes_collectors === true;
  const realProbeRequestRejected = source.real_probe_requested === true
    || source.real_probe_started === true
    || source.collector_real_probe_started === true
    || source.performs_live_probe === true;
  const externalServiceRequestRejected = source.external_service_requested === true
    || source.external_service_call_started === true
    || source.calls_external_service === true;
  const realSdkRequestRejected = source.real_sdk_call_requested === true
    || source.real_sdk_call_started === true
    || source.calls_real_sdk === true;
  const realRendererRequestRejected = source.real_renderer_call_requested === true
    || source.real_renderer_call_started === true
    || source.calls_real_renderer === true;
  const ownerConfirmationRequestRejected = source.owner_confirmation_requested === true
    || source.owner_confirmation_created === true
    || source.owner_confirmation_confirmed === true
    || source.creates_owner_confirmation === true;
  const readinessPromotionRejected = source.renderer_ready === true
    || source.model_loaded === true
    || source.scene_loaded === true
    || source.browser_cue_delivery_ready === true
    || source.runtime_readiness_claimed === true
    || source.production_readiness_claimed === true;
  const goRequestRejected = source.go_requested === true || source.go_candidate === true || source.go_nogo_status === "go";
  const blockerResolutionRejected = source.blocker_resolved === true || source.priority1_status === "RESOLVED";
  const trustedLoaderEnablementRejected = source.trusted_loader_enablement_requested === true
    || source.trusted_loader_allowlist_enabled === true
    || source.trustedLoaderAllowlistEnabled === true
    || source.loader_trusted === true;
  const motionExecutionRejected = source.motion_dataset_executable === true || source.motion_execution_requested === true;
  const triggeredRejections = [
    requestedCollectors.length === 0 ? "dry_run_reject_missing_collector_name" : "",
    unknownCollectors.length ? "dry_run_reject_unknown_collector_name" : "",
    missingSourceBinding ? "dry_run_reject_missing_source_binding" : "",
    missingFreshnessBinding ? "dry_run_reject_missing_freshness_binding" : "",
    missingAuditBinding ? "dry_run_reject_missing_audit_binding" : "",
    missingRedactionStatus ? "dry_run_reject_missing_redaction_status" : "",
    missingSafeOutputFields ? "dry_run_reject_missing_safe_output_fields" : "",
    unsafeMaterialRejected ? "dry_run_reject_forbidden_raw_field" : "",
    fixtureSourceRejected ? "dry_run_reject_fixture_source_as_real_evidence" : "",
    dryRunSourceRejected ? "dry_run_reject_dry_run_source_as_real_evidence" : "",
    mockSourceRejected ? "dry_run_reject_mock_source" : "",
    staleSourceRejected ? "dry_run_reject_stale_source" : "",
    unknownSourceRejected ? "dry_run_reject_unknown_source" : "",
    executionRequestRejected ? "dry_run_reject_collector_execution_request" : "",
    realProbeRequestRejected ? "dry_run_reject_real_probe_request" : "",
    externalServiceRequestRejected ? "dry_run_reject_external_service_request" : "",
    realSdkRequestRejected ? "dry_run_reject_real_sdk_request" : "",
    realRendererRequestRejected ? "dry_run_reject_real_renderer_request" : "",
    ownerConfirmationRequestRejected ? "dry_run_reject_owner_confirmation_request" : "",
    readinessPromotionRejected ? "dry_run_reject_readiness_promotion" : "",
    goRequestRejected ? "dry_run_reject_go_request" : "",
    blockerResolutionRejected ? "dry_run_reject_blocker_resolution" : "",
    trustedLoaderEnablementRejected ? "dry_run_reject_trusted_loader_enablement" : "",
    motionExecutionRejected ? "dry_run_reject_motion_execution" : "",
  ].filter(Boolean);
  const acceptedShapeCandidate = requestedCollectors.length > 0
    && unknownCollectors.length === 0
    && missingSourceBinding === false
    && missingFreshnessBinding === false
    && missingAuditBinding === false
    && missingRedactionStatus === false
    && missingSafeOutputFields === false
    && unsafeMaterialRejected === false
    && executionRequestRejected === false
    && realProbeRequestRejected === false
    && externalServiceRequestRejected === false
    && realSdkRequestRejected === false
    && realRendererRequestRejected === false
    && ownerConfirmationRequestRejected === false
    && readinessPromotionRejected === false
    && goRequestRejected === false
    && blockerResolutionRejected === false
    && trustedLoaderEnablementRejected === false
    && motionExecutionRejected === false;
  const blockedReasons = [
    "dry_run_envelope_planning_only_not_execution",
    "dry_run_envelope_blocked_no_real_collection",
    "dry_run_envelope_blocked_no_live_probe",
    "dry_run_envelope_blocked_no_owner_confirmation",
    "dry_run_envelope_blocked_no_go",
    "dry_run_envelope_blocked_priority1_unresolved",
    "dry_run_envelope_blocked_motion_dataset_non_executable",
    "dry_run_envelope_not_runtime_ready",
    "dry_run_envelope_not_production_ready",
    ...triggeredRejections,
  ];
  const summary = {
    schema: LIVE2D_REAL_EVIDENCE_COLLECTOR_DRY_RUN_ENVELOPE_SCHEMA,
    safe_summary_only: true,
    real_evidence_collector_dry_run_envelope_status: "planning_only",
    collector_dry_run_envelope_status: "planning_only",
    dry_run_envelope_ready_candidate: false,
    collector_dry_run_envelope_ready_candidate: false,
    dry_run_request_shape_candidate: acceptedShapeCandidate,
    planning_only_boundary: true,
    dry_run_only_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    no_go_preserved: true,
    required_dry_run_request_fields: requiredFields,
    dry_run_request_rejection_reasons: rejectionReasons,
    triggered_rejection_reasons: [...new Set(triggeredRejections)],
    requested_collectors: requestedCollectors,
    unknown_collectors: unknownCollectors,
    collector_safe_output_fields_required: REAL_EVIDENCE_COLLECTOR_SAFE_OUTPUT_FIELDS,
    source_binding_status: missingSourceBinding ? "missing" : "present",
    freshness_binding_status: missingFreshnessBinding ? "missing" : "present",
    audit_binding_status: missingAuditBinding ? "missing" : "present",
    redaction_status: missingRedactionStatus ? "missing_or_not_safe" : "safe_summary_only",
    safe_output_fields_status: missingSafeOutputFields ? "missing" : "present",
    fixture_pass_rejection: "fixture_pass_is_not_real_evidence",
    dry_run_pass_rejection: "dry_run_pass_is_not_real_evidence",
    mock_source_rejection: "mock_source_rejected",
    stale_source_rejection: "stale_source_rejected_for_fresh_evidence",
    unknown_source_rejection: "unknown_source_rejected",
    missing_binding_rejection: "missing_source_freshness_audit_redaction_or_safe_output_binding_rejected",
    execution_request_rejection: "collector_execution_request_rejected",
    real_probe_request_rejection: "real_probe_request_rejected",
    external_service_request_rejection: "external_service_request_rejected",
    owner_confirmation_request_rejection: "owner_confirmation_request_rejected",
    readiness_promotion_request_rejection: "readiness_promotion_request_rejected",
    go_request_rejection: "go_request_rejected",
    blocker_resolution_request_rejection: "blocker_resolution_request_rejected",
    trusted_loader_enablement_request_rejection: "trusted_loader_enablement_request_rejected",
    motion_execution_request_rejection: "motion_execution_request_rejected",
    network_policy: "blocked_by_default_no_external_services",
    sdk_policy: "forbid_real_sdk_call",
    renderer_policy: "forbid_real_renderer_call",
    trusted_loader_boundary: "trusted_loader_allowlist_disabled_no_loader_trusted",
    owner_confirmation_boundary: "schema_only_no_owner_confirmation_created",
    go_nogo_preservation: "go_nogo_status_no_go",
    collection_plan_preservation: "collection_plan_planning_only",
    freshness_threshold_preservation: "freshness_threshold_planning_only",
    safe_evidence_summary_contract_preservation: "safe_evidence_summary_contract_planning_only",
    summary_intake_binding_preservation: "summary_intake_binding_planning_only",
    owner_confirmation_binding_preservation: "owner_confirmation_binding_planning_only",
    blocker_resolution_schema_preservation: "blocker_resolution_schema_planning_only",
    collector_manifest_preservation: manifestSummary.real_evidence_collector_manifest_status === "planning_only" ? "collector_manifest_planning_only" : "collector_manifest_not_ready",
    collector_fixture_pack_preservation: fixturePackSummary.real_evidence_collector_fixture_pack_status === "planning_only" ? "collector_fixture_pack_synthetic_only" : "collector_fixture_pack_not_ready",
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    freshness_threshold_status: "planning_only",
    safe_evidence_summary_contract_status: "planning_only",
    summary_intake_binding_status: "planning_only",
    owner_confirmation_binding_status: "planning_only",
    go_nogo_blocker_resolution_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    checked_row_count: 0,
    trusted_loader_allowlist_enabled: false,
    trusted_loader_allowlist_status: "disabled",
    no_loader_trusted: true,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    motion_dataset_executable: false,
    collector_execution_started: false,
    collector_real_probe_started: false,
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    dry_run_envelope_executes_collectors: false,
    dry_run_envelope_collects_real_evidence: false,
    dry_run_envelope_performs_live_probes: false,
    dry_run_envelope_calls_real_renderer: false,
    dry_run_envelope_calls_real_sdk: false,
    dry_run_envelope_calls_external_services: false,
    dry_run_envelope_creates_owner_confirmation: false,
    accepted_dry_run_request_is_real_evidence: false,
    accepted_dry_run_request_is_owner_confirmation: false,
    accepted_dry_run_request_is_readiness: false,
    accepted_dry_run_request_resolves_priority1: false,
    accepted_dry_run_request_makes_motion_executable: false,
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_real_evidence_collection_task_required",
    boundary_policy: {
      ...createBoundaryPolicy(),
      dry_run_only_no_collection: true,
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_owner_confirmation_creation: true,
      no_trusted_loader_enablement: true,
      no_env_values: true,
      no_endpoint_values: true,
      no_token_values: true,
      no_secret_values: true,
      no_private_paths: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(summary, "real evidence collector dry-run envelope summary");
  return summary;
}

export function createRealEvidenceFreshnessThresholdSummary(threshold = {}, {
  requiredComponents = REAL_EVIDENCE_REQUEST_COMPONENTS,
} = {}) {
  const source = threshold && typeof threshold === "object" ? threshold : {};
  const sourceKind = safeEvidenceLabel(source.source_kind ?? source.source_type, "missing");
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const componentThresholds = Object.fromEntries(requiredComponents.map((component) => [component, {
    threshold_units: "safe_age_bucket",
    freshness_status: "missing",
    freshness_bucket: "future_real_resident_evidence_required",
    required_evidence_policy: "future_owner_confirmed_real_resident_evidence_required",
  }]));
  const pendingComponents = [...requiredComponents];
  const blockedReasons = [
    "freshness_threshold_plan_only_not_collection",
    "freshness_threshold_blocked_missing_real_resident_evidence",
    "freshness_threshold_blocked_missing_owner_confirmation",
    "freshness_threshold_blocked_priority1_unresolved",
    "freshness_threshold_blocked_motion_dataset_non_executable",
    "freshness_threshold_not_runtime_ready",
    "freshness_threshold_not_production_ready",
  ];
  if (sourceKind === "fixture") blockedReasons.push("freshness_threshold_fixture_evidence_not_real");
  if (sourceKind === "dry_run") blockedReasons.push("freshness_threshold_dry_run_evidence_not_real");
  if (sourceKind === "mock") blockedReasons.push("freshness_threshold_mock_evidence_not_real");
  if (source.freshness_status === "stale") blockedReasons.push("freshness_threshold_stale_evidence_not_fresh");
  if (sourceKind === "manual_summary") blockedReasons.push("freshness_threshold_manual_summary_requires_owner_confirmation");
  if (sourceKind === "operator_confirmed_summary") blockedReasons.push("freshness_threshold_operator_summary_requires_scope_specific_owner_confirmation");
  if (sourceKind === "owner_confirmed_reference") blockedReasons.push("freshness_threshold_owner_reference_schema_only_until_real_confirmation");
  if (unsafeMaterialRejected) blockedReasons.push("freshness_threshold_rejected_forbidden_raw_field");
  const summary = {
    schema: REAL_EVIDENCE_FRESHNESS_THRESHOLD_SCHEMA,
    safe_summary_only: true,
    real_evidence_freshness_threshold_status: unsafeMaterialRejected ? "blocked" : "planning_only",
    planning_only_boundary: true,
    freshness_policy_ready_candidate: false,
    component_thresholds_defined: requiredComponents,
    component_thresholds_pending: pendingComponents,
    component_thresholds: componentThresholds,
    threshold_units: ["safe_age_bucket", "component_label"],
    allowed_freshness_statuses: ["fresh_candidate", "stale", "missing", "blocked", "attention_required", "not_applicable"],
    stale_evidence_policy: "stale_evidence_cannot_resolve_readiness_or_priority1",
    missing_evidence_policy: "missing_evidence_remains_blocked",
    fixture_evidence_policy: "fixture_evidence_never_fresh_real_evidence",
    dry_run_evidence_policy: "dry_run_evidence_never_fresh_real_evidence",
    mock_evidence_policy: "mock_evidence_never_fresh_real_evidence",
    manual_summary_policy: "manual_summary_without_owner_confirmation_not_fresh_real_evidence",
    operator_confirmed_summary_policy: "operator_summary_without_scope_specific_owner_confirmation_not_fresh_real_evidence",
    real_probe_summary_policy: "future_safe_summary_only_no_probe_started_by_this_schema",
    owner_confirmed_reference_policy: "schema_only_pending_real_owner_confirmation",
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    safe_next_action: "define_future_owner_confirmed_real_evidence_collection_task_after_threshold_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_env_values: true,
      no_sdk_vendor_files: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_owner_private_notes: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(summary, "real evidence freshness threshold summary");
  return summary;
}

export function createSafeEvidenceSummaryContractSummary(summaryInput = {}) {
  const source = summaryInput && typeof summaryInput === "object" ? summaryInput : {};
  const sourceType = safeEvidenceLabel(source.evidence_source_type ?? source.source_type, "missing");
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const rejectedSourceType = SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES.includes(sourceType) || sourceType === "raw_payload";
  const missingSourceBinding = !source.evidence_ref || !source.safe_audit_ref || !source.head_sha_ref || !source.run_id_ref;
  const missingFreshnessBinding = !source.freshness_status;
  const missingRedactionStatus = source.redaction_status !== "safe_summary_only";
  const blockedReasons = [
    "safe_evidence_summary_contract_planning_only_not_collection",
    "safe_evidence_summary_contract_blocked_missing_real_resident_evidence",
    "safe_evidence_summary_contract_blocked_missing_owner_confirmation",
    "safe_evidence_summary_contract_blocked_priority1_unresolved",
    "safe_evidence_summary_contract_blocked_motion_dataset_non_executable",
    "safe_evidence_summary_contract_not_runtime_ready",
    "safe_evidence_summary_contract_not_production_ready",
  ];
  if (unsafeMaterialRejected) blockedReasons.push("safe_evidence_summary_contract_rejected_raw_field");
  if (rejectedSourceType) blockedReasons.push("safe_evidence_summary_contract_rejected_source_type");
  if (missingSourceBinding) blockedReasons.push("safe_evidence_summary_contract_missing_source_binding");
  if (missingFreshnessBinding) blockedReasons.push("safe_evidence_summary_contract_missing_freshness_binding");
  if (missingRedactionStatus) blockedReasons.push("safe_evidence_summary_contract_missing_redaction_status");
  if (sourceType === "manual_upload_summary") blockedReasons.push("safe_evidence_summary_contract_manual_summary_requires_owner_confirmation");
  if (sourceType === "operator_confirmed_summary") blockedReasons.push("safe_evidence_summary_contract_operator_summary_requires_scope_specific_owner_confirmation");
  if (sourceType === "owner_confirmed_reference") blockedReasons.push("safe_evidence_summary_contract_owner_reference_schema_only_until_real_confirmation");

  const contract = {
    schema: LIVE2D_SAFE_EVIDENCE_SUMMARY_CONTRACT_SCHEMA,
    safe_summary_only: true,
    safe_evidence_summary_contract_status: unsafeMaterialRejected || rejectedSourceType ? "blocked" : "planning_only",
    planning_only_boundary: true,
    summary_contract_ready_candidate: false,
    accepted_summary_fields: SAFE_EVIDENCE_SUMMARY_ACCEPTED_FIELDS,
    required_source_binding: ["evidence_source_type", "evidence_ref", "safe_audit_ref", "head_sha_ref", "run_id_ref", "file_scope"],
    required_freshness_binding: ["freshness_status", "checked_at_bucket", "status_reason_code"],
    required_audit_binding: ["safe_audit_ref", "head_sha_ref", "run_id_ref", "redaction_status", "blocker_labels"],
    required_redaction_status: "safe_summary_only",
    rejected_material_classes: SAFE_EVIDENCE_SUMMARY_REJECTED_RAW_FIELDS,
    rejected_source_types: SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES,
    accepted_source_types: SAFE_EVIDENCE_SUMMARY_ACCEPTED_SOURCE_TYPES,
    required_bindings: SAFE_EVIDENCE_SUMMARY_REQUIRED_BINDINGS,
    safe_evidence_summary_policy: "summary_contract_only_not_real_evidence",
    evidence_fidelity_policy: "safe_summary_must_preserve_source_freshness_audit_redaction_and_blockers",
    minimal_surface_policy: "compressed_summary_must_preserve_priority1_motion_no_readiness_owner_pending_file_scope_head_run_audit_refs",
    blocked_reason: blockedReasons[0],
    blocked_reasons: [...new Set(blockedReasons)],
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    source_binding_status: missingSourceBinding ? "missing" : "present",
    freshness_binding_status: missingFreshnessBinding ? "missing" : "present",
    audit_binding_status: missingSourceBinding || missingRedactionStatus ? "missing" : "present",
    redaction_status: missingRedactionStatus ? "missing_safe_summary_only" : "safe_summary_only",
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    freshness_threshold_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    safe_next_action: "create_separate_owner_confirmed_real_evidence_collection_task_after_contract_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_evidence_body_material: true,
      no_cue_body_material: true,
      no_renderer_body_material: true,
      no_raw_loader_candidates: true,
      no_raw_loader_errors: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
      no_private_local_paths: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(contract, "safe evidence summary contract");
  return contract;
}

export function createRealEvidenceSummaryIntakeBindingSummary(summaryInput = {}) {
  const source = summaryInput && typeof summaryInput === "object" ? summaryInput : {};
  const rawSourceType = String(source.evidence_source_type ?? source.source_type ?? "");
  const sourceType = safeEvidenceLabel(rawSourceType, "missing");
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source) || rawSourceType === "raw_payload";
  const rejectedSourceType = SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES.includes(sourceType) || rawSourceType === "raw_payload";
  const missingSourceBinding = !source.evidence_source_type || !source.evidence_ref || !source.safe_audit_ref || !source.head_sha_ref || !source.run_id_ref || !source.file_scope;
  const missingFreshnessBinding = !source.freshness_status || !source.checked_at_bucket || !source.status_reason_code;
  const missingAuditBinding = !source.safe_audit_ref || !source.head_sha_ref || !source.run_id_ref || !source.redaction_status || !source.blocker_labels;
  const missingRedactionStatus = source.redaction_status !== "safe_summary_only" && source.redaction_status !== "pass";
  const missingComponentThresholdBinding = !source.component || !source.component_threshold_ref;
  const intakeEligible = !unsafeMaterialRejected &&
    !rejectedSourceType &&
    !missingSourceBinding &&
    !missingFreshnessBinding &&
    !missingAuditBinding &&
    !missingRedactionStatus &&
    !missingComponentThresholdBinding;
  const rejectionReasons = [];
  if (missingSourceBinding) rejectionReasons.push("summary_intake_rejected_missing_source_binding");
  if (missingFreshnessBinding) rejectionReasons.push("summary_intake_rejected_missing_freshness_binding");
  if (missingAuditBinding) rejectionReasons.push("summary_intake_rejected_missing_audit_binding");
  if (missingRedactionStatus) rejectionReasons.push("summary_intake_rejected_missing_redaction_status");
  if (missingComponentThresholdBinding) rejectionReasons.push("summary_intake_rejected_missing_component_threshold_binding");
  if (rejectedSourceType) rejectionReasons.push("summary_intake_rejected_source_type");
  if (unsafeMaterialRejected) rejectionReasons.push("summary_intake_rejected_forbidden_material");
  if (sourceType === "manual_upload_summary") rejectionReasons.push("summary_intake_manual_summary_requires_owner_confirmation");
  if (sourceType === "operator_confirmed_summary") rejectionReasons.push("summary_intake_operator_summary_requires_scope_specific_owner_confirmation");
  if (sourceType === "owner_confirmed_reference") rejectionReasons.push("summary_intake_owner_reference_schema_only_until_real_confirmation");

  const binding = {
    schema: LIVE2D_REAL_EVIDENCE_SUMMARY_INTAKE_BINDING_SCHEMA,
    safe_summary_only: true,
    real_evidence_summary_intake_binding_status: intakeEligible ? "planning_only" : "blocked",
    planning_only_boundary: true,
    summary_intake_ready_candidate: false,
    intake_eligible_summary_requirements: SAFE_EVIDENCE_SUMMARY_ACCEPTED_FIELDS,
    intake_rejection_reasons: [...new Set(rejectionReasons)],
    required_safe_summary_contract: LIVE2D_SAFE_EVIDENCE_SUMMARY_CONTRACT_SCHEMA,
    required_source_binding: ["evidence_source_type", "evidence_ref", "safe_audit_ref", "head_sha_ref", "run_id_ref", "file_scope"],
    required_freshness_binding: ["freshness_status", "checked_at_bucket", "status_reason_code"],
    required_audit_binding: ["safe_audit_ref", "head_sha_ref", "run_id_ref", "redaction_status", "blocker_labels"],
    required_redaction_status: "safe_summary_only_or_pass",
    required_component_threshold_binding: ["component", "component_threshold_ref"],
    required_owner_confirmation_boundary: "owner_confirmation_pending_until_separate_owner_confirmed_task",
    required_go_nogo_boundary: "go_nogo_remains_no_go_until_real_evidence_and_owner_confirmation",
    accepted_source_types: SAFE_EVIDENCE_SUMMARY_ACCEPTED_SOURCE_TYPES,
    rejected_source_types: SAFE_EVIDENCE_SUMMARY_REJECTED_SOURCE_TYPES,
    rejected_material_classes: SAFE_EVIDENCE_SUMMARY_REJECTED_RAW_FIELDS,
    source_binding_status: missingSourceBinding ? "missing" : "present",
    freshness_binding_status: missingFreshnessBinding ? "missing" : "present",
    audit_binding_status: missingAuditBinding ? "missing" : "present",
    redaction_status: missingRedactionStatus ? "missing_safe_summary_only" : "safe_summary_only",
    component_threshold_binding_status: missingComponentThresholdBinding ? "missing" : "present",
    eligible_summary_is_real_evidence: false,
    eligible_summary_is_owner_confirmation: false,
    eligible_summary_is_runtime_readiness: false,
    eligible_summary_is_production_readiness: false,
    eligible_summary_resolves_priority1: false,
    eligible_summary_makes_motion_executable: false,
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    assistant_review_is_owner_confirmation: false,
    pr_merge_is_owner_confirmation: false,
    remote_pass_is_owner_confirmation: false,
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    freshness_threshold_status: "planning_only",
    safe_evidence_summary_contract_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    safe_next_action: "create_separate_owner_confirmed_real_evidence_collection_task_after_summary_intake_binding_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_evidence_body_material: true,
      no_cue_body_material: true,
      no_renderer_body_material: true,
      no_loader_candidate_material: true,
      no_loader_error_material: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
      no_private_local_paths: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(binding, "real evidence summary intake binding");
  return binding;
}

export function createOwnerConfirmationBindingSummary(bindingInput = {}) {
  const source = bindingInput && typeof bindingInput === "object" ? bindingInput : {};
  const sourceRole = safeEvidenceLabel(source.confirmed_by_role ?? source.owner_role, "missing");
  const sourceScope = safeEvidenceLabel(source.owner_scope ?? source.confirmation_scope, "missing");
  const expectedScope = safeEvidenceLabel(source.expected_owner_scope ?? sourceScope, "missing");
  const confirmationStatus = safeEvidenceLabel(source.confirmation_status, "missing");
  const revocationStatus = safeEvidenceLabel(source.revocation_status, "missing");
  const expiresAtBucket = safeEvidenceLabel(source.expires_at_bucket, "missing");
  const evidenceSourceType = safeEvidenceLabel(source.evidence_source_type ?? source.source_type, "missing");
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const missingEvidenceSummaryBinding = !source.safe_evidence_summary_ref;
  const missingSummaryIntakeBinding = !source.summary_intake_ref;
  const missingFreshnessThresholdBinding = !source.freshness_threshold_ref;
  const missingCollectionPlanBinding = !source.evidence_collection_plan_ref;
  const missingAuditBinding = !source.audit_ref;
  const missingScopeBinding = !source.owner_scope && !source.confirmation_scope;
  const missingHeadRunFileScope = !source.head_sha_ref || !source.run_id_ref || !source.file_scope;
  const wrongRole = sourceRole !== "owner";
  const expired = confirmationStatus === "expired" || expiresAtBucket === "expired";
  const revoked = confirmationStatus === "revoked" || revocationStatus === "revoked";
  const scopeMismatch = Boolean(source.owner_scope && source.expected_owner_scope && sourceScope !== expectedScope);
  const autoConfirmationSource = Boolean(
    source.assistant_review === true ||
    source.pr_merge === true ||
    source.remote_pass === true ||
    source.local_checks_pass === true ||
    source.target_harness_pass === true ||
    source.browser_api_smoke_pass === true ||
    source.operator_summary === true ||
    source.manual_summary === true ||
    source.safe_summary_intake_eligible === true ||
    source.fixture_evidence === true ||
    source.dry_run_evidence === true ||
    source.mock_confirmation === true ||
    evidenceSourceType === "fixture" ||
    evidenceSourceType === "dry_run" ||
    evidenceSourceType === "mock" ||
    evidenceSourceType === "operator_confirmed_summary" ||
    evidenceSourceType === "manual_upload_summary"
  );
  const rejectionReasons = [
    "owner_confirmation_binding_planning_only",
    "owner_confirmation_binding_not_real_confirmation",
    "owner_confirmation_binding_blocked_priority1_unresolved",
    "owner_confirmation_binding_blocked_motion_dataset_non_executable",
    "owner_confirmation_binding_not_runtime_ready",
    "owner_confirmation_binding_not_production_ready",
  ];
  if (missingEvidenceSummaryBinding) rejectionReasons.push("owner_confirmation_binding_missing_evidence_summary_binding");
  if (missingSummaryIntakeBinding) rejectionReasons.push("owner_confirmation_binding_missing_summary_intake_binding");
  if (missingFreshnessThresholdBinding) rejectionReasons.push("owner_confirmation_binding_missing_freshness_threshold_binding");
  if (missingCollectionPlanBinding) rejectionReasons.push("owner_confirmation_binding_missing_collection_plan_binding");
  if (missingAuditBinding) rejectionReasons.push("owner_confirmation_binding_missing_audit_binding");
  if (missingScopeBinding) rejectionReasons.push("owner_confirmation_binding_missing_scope_binding");
  if (missingHeadRunFileScope) rejectionReasons.push("owner_confirmation_binding_missing_head_run_file_scope_binding");
  if (wrongRole) rejectionReasons.push("owner_confirmation_binding_rejected_wrong_role");
  if (expired) rejectionReasons.push("owner_confirmation_binding_rejected_expired_confirmation");
  if (revoked) rejectionReasons.push("owner_confirmation_binding_rejected_revoked_confirmation");
  if (scopeMismatch) rejectionReasons.push("owner_confirmation_binding_rejected_scope_mismatch");
  if (autoConfirmationSource) rejectionReasons.push("owner_confirmation_binding_rejected_auto_confirmation_source");
  if (unsafeMaterialRejected) rejectionReasons.push("owner_confirmation_binding_rejected_forbidden_material");

  const binding = {
    schema: LIVE2D_OWNER_CONFIRMATION_BINDING_SCHEMA,
    safe_summary_only: true,
    owner_confirmation_binding_status: "blocked",
    planning_only_boundary: true,
    owner_confirmation_binding_ready_candidate: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    real_renderer_call_started: false,
    real_sdk_call_started: false,
    external_service_call_started: false,
    required_owner_confirmation_scopes: LIVE2D_OWNER_CONFIRMATION_BINDING_SCOPES,
    required_evidence_summary_binding: ["safe_evidence_summary_ref"],
    required_intake_binding: ["summary_intake_ref"],
    required_freshness_threshold_binding: ["freshness_threshold_ref"],
    required_collection_plan_binding: ["evidence_collection_plan_ref"],
    required_audit_binding: ["audit_ref", "head_sha_ref", "run_id_ref"],
    required_scope_binding: ["owner_scope", "confirmation_status", "status_reason_code"],
    required_binding_references: LIVE2D_OWNER_CONFIRMATION_BINDING_REF_FIELDS,
    required_expiry_policy: "reject_expired_confirmation",
    required_revocation_policy: "reject_revoked_confirmation",
    wrong_role_rejection_policy: "reject_non_owner_role",
    scope_mismatch_rejection_policy: "reject_scope_mismatch",
    auto_confirmation_rejection_policy: "reject_assistant_pr_remote_local_target_smoke_operator_manual_fixture_dry_run_mock_sources",
    assistant_review_policy: "not_owner_confirmation",
    pr_merge_policy: "not_owner_confirmation",
    remote_pass_policy: "not_owner_confirmation",
    local_checks_policy: "not_owner_confirmation",
    target_harness_policy: "not_owner_confirmation",
    browser_smoke_policy: "not_owner_confirmation",
    operator_summary_policy: "not_owner_confirmation",
    manual_summary_policy: "not_owner_confirmation",
    safe_summary_intake_policy: "not_owner_confirmation",
    evidence_summary_binding_status: missingEvidenceSummaryBinding ? "missing" : "present",
    required_summary_intake_binding_status: missingSummaryIntakeBinding ? "missing" : "present",
    freshness_threshold_binding_status: missingFreshnessThresholdBinding ? "missing" : "present",
    collection_plan_binding_status: missingCollectionPlanBinding ? "missing" : "present",
    audit_binding_status: missingAuditBinding ? "missing" : "present",
    scope_binding_status: missingScopeBinding ? "missing" : "present",
    head_run_file_scope_binding_status: missingHeadRunFileScope ? "missing" : "present",
    wrong_role_rejection_status: wrongRole ? "rejected" : "not_present",
    expiry_policy_status: expired ? "rejected" : "pending",
    revocation_policy_status: revoked ? "rejected" : "pending",
    scope_mismatch_rejection_status: scopeMismatch ? "rejected" : "not_present",
    auto_confirmation_rejection_status: autoConfirmationSource ? "rejected" : "not_present",
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    owner_reference_status: "schema_only_until_real_owner_confirmed_artifact",
    owner_confirmation_is_runtime_readiness: false,
    owner_confirmation_is_production_readiness: false,
    owner_confirmation_resolves_priority1: false,
    owner_confirmation_makes_motion_executable: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    freshness_threshold_status: "planning_only",
    safe_evidence_summary_contract_status: "planning_only",
    summary_intake_preservation_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    rejection_reasons: [...new Set(rejectionReasons)],
    safe_next_action: "create_separate_owner_confirmed_real_evidence_collection_task_after_binding_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_evidence_body_material: true,
      no_cue_body_material: true,
      no_renderer_body_material: true,
      no_loader_candidate_material: true,
      no_loader_error_material: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
      no_private_local_paths: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(binding, "owner confirmation binding summary");
  return binding;
}

export function createGoNoGoBlockerResolutionSummary(resolutionInput = {}) {
  const source = resolutionInput && typeof resolutionInput === "object" ? resolutionInput : {};
  const evidenceSourceType = safeEvidenceLabel(source.evidence_source_type ?? source.source_type, "missing");
  const confirmationRole = safeEvidenceLabel(source.confirmed_by_role ?? source.owner_role, "missing");
  const confirmationStatus = safeEvidenceLabel(source.confirmation_status, "missing");
  const revocationStatus = safeEvidenceLabel(source.revocation_status, "missing");
  const freshnessStatus = safeEvidenceLabel(source.freshness_status ?? source.live2d_heartbeat_freshness_status, "missing");
  const redactionStatus = safeEvidenceLabel(source.redaction_status, "missing");
  const degradedMode = source.degraded_mode_available === true || source.degraded_mode === true;
  const missingBlockerId = !source.blocker_id;
  const missingComponent = !source.component;
  const missingEvidenceSummaryBinding = !source.safe_evidence_summary_ref;
  const missingSummaryIntakeBinding = !source.summary_intake_ref;
  const missingFreshnessThresholdBinding = !source.freshness_threshold_ref;
  const missingOwnerConfirmationBinding = !source.owner_confirmation_ref;
  const missingAuditBinding = !source.audit_ref;
  const missingScopeBinding = !source.scope_ref;
  const emergencyStopRequired = source.emergency_stop_required !== false;
  const missingEmergencyStopBinding = emergencyStopRequired && !source.emergency_stop_ref;
  const missingHeadRunFileScope = !source.head_sha_ref || !source.run_id_ref || !source.file_scope;
  const missingRedactionPass = redactionStatus !== "pass";
  const missingEvidence = source.evidence_status === "missing" || freshnessStatus === "missing";
  const staleEvidence = freshnessStatus === "stale" || source.stale_evidence === true;
  const fixtureEvidence = source.fixture_evidence === true || evidenceSourceType === "fixture";
  const dryRunEvidence = source.dry_run_evidence === true || evidenceSourceType === "dry_run";
  const mockEvidence = source.mock_evidence === true || source.mock_confirmation === true || evidenceSourceType === "mock";
  const wrongRole = source.confirmed_by_role !== undefined && confirmationRole !== "owner";
  const expired = confirmationStatus === "expired" || source.expires_at_bucket === "expired";
  const revoked = confirmationStatus === "revoked" || revocationStatus === "revoked";
  const scopeMismatch = source.scope_mismatch === true || Boolean(source.scope_ref && source.expected_scope_ref && source.scope_ref !== source.expected_scope_ref);
  const autoResolutionSource = Boolean(
    source.remote_pass === true ||
    source.local_checks_pass === true ||
    source.target_harness_pass === true ||
    source.browser_api_smoke_pass === true ||
    source.assistant_review === true ||
    source.pr_merge === true ||
    source.operator_summary === true ||
    source.manual_summary === true ||
    source.safe_summary_intake_eligible === true ||
    source.owner_confirmation_binding === true
  );
  const unsafeMaterialRejected = hasRawEvidenceMaterial(source) || hasCollectionPlanForbiddenMaterial(source);
  const rejectionReasons = [
    "go_nogo_blocker_resolution_planning_only",
    "go_nogo_blocker_resolution_not_resolved",
    "go_nogo_blocker_resolution_no_go_preserved",
    "go_nogo_blocker_resolution_blocked_priority1_unresolved",
    "go_nogo_blocker_resolution_blocked_motion_dataset_non_executable",
    "go_nogo_blocker_resolution_not_runtime_ready",
    "go_nogo_blocker_resolution_not_production_ready",
  ];
  if (missingBlockerId) rejectionReasons.push("resolution_rejected_missing_blocker_id");
  if (missingComponent) rejectionReasons.push("resolution_rejected_missing_component");
  if (missingEvidenceSummaryBinding) rejectionReasons.push("resolution_rejected_missing_safe_summary_binding");
  if (missingSummaryIntakeBinding) rejectionReasons.push("resolution_rejected_missing_summary_intake_binding");
  if (missingFreshnessThresholdBinding) rejectionReasons.push("resolution_rejected_missing_freshness_threshold_binding");
  if (missingOwnerConfirmationBinding) rejectionReasons.push("resolution_rejected_missing_owner_confirmation_binding");
  if (missingAuditBinding) rejectionReasons.push("resolution_rejected_missing_audit_binding");
  if (missingScopeBinding) rejectionReasons.push("resolution_rejected_missing_scope_binding");
  if (missingEmergencyStopBinding) rejectionReasons.push("resolution_rejected_missing_emergency_stop_binding");
  if (missingHeadRunFileScope) rejectionReasons.push("resolution_rejected_missing_head_run_file_scope_binding");
  if (missingRedactionPass) rejectionReasons.push("resolution_rejected_missing_redaction_pass");
  if (fixtureEvidence) rejectionReasons.push("resolution_rejected_fixture_evidence");
  if (dryRunEvidence) rejectionReasons.push("resolution_rejected_dry_run_evidence");
  if (mockEvidence) rejectionReasons.push("resolution_rejected_mock_evidence");
  if (staleEvidence) rejectionReasons.push("resolution_rejected_stale_evidence");
  if (missingEvidence) rejectionReasons.push("resolution_rejected_missing_evidence");
  if (wrongRole) rejectionReasons.push("resolution_rejected_wrong_role_confirmation");
  if (expired) rejectionReasons.push("resolution_rejected_expired_confirmation");
  if (revoked) rejectionReasons.push("resolution_rejected_revoked_confirmation");
  if (scopeMismatch) rejectionReasons.push("resolution_rejected_scope_mismatch");
  if (autoResolutionSource) rejectionReasons.push("resolution_rejected_auto_resolution_source");
  if (degradedMode) rejectionReasons.push("resolution_rejected_degraded_mode_only");
  if (unsafeMaterialRejected) rejectionReasons.push("resolution_rejected_forbidden_material");

  const candidateEligible = !missingBlockerId &&
    !missingComponent &&
    !missingEvidenceSummaryBinding &&
    !missingSummaryIntakeBinding &&
    !missingFreshnessThresholdBinding &&
    !missingOwnerConfirmationBinding &&
    !missingAuditBinding &&
    !missingScopeBinding &&
    !missingEmergencyStopBinding &&
    !missingHeadRunFileScope &&
    !missingRedactionPass &&
    !fixtureEvidence &&
    !dryRunEvidence &&
    !mockEvidence &&
    !staleEvidence &&
    !missingEvidence &&
    !wrongRole &&
    !expired &&
    !revoked &&
    !scopeMismatch &&
    !autoResolutionSource &&
    !degradedMode &&
    !unsafeMaterialRejected;

  const summary = {
    schema: LIVE2D_GO_NOGO_BLOCKER_RESOLUTION_SCHEMA,
    safe_summary_only: true,
    go_nogo_blocker_resolution_status: candidateEligible ? "planning_only" : "blocked",
    resolution_candidate_status: candidateEligible ? "resolution_candidate_review_only" : "blocked",
    blocker_resolution_ready_candidate: false,
    blocker_resolved: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    degraded_mode_available: degradedMode ? "separate_from_go" : false,
    degraded_mode_is_go: false,
    required_blocker_id: "blocker_id",
    required_component: "component",
    required_safe_evidence_summary_binding: ["safe_evidence_summary_ref"],
    required_summary_intake_binding: ["summary_intake_ref"],
    required_freshness_threshold_binding: ["freshness_threshold_ref"],
    required_owner_confirmation_binding: ["owner_confirmation_ref"],
    required_audit_binding: ["audit_ref", "head_sha_ref", "run_id_ref"],
    required_scope_binding: ["scope_ref", "status_reason_code"],
    required_emergency_stop_binding: emergencyStopRequired ? ["emergency_stop_ref"] : [],
    required_go_nogo_boundary: "go_nogo_status_remains_no_go_until_separate_owner_confirmed_go_review",
    required_redaction_status: "pass",
    required_binding_references: LIVE2D_GO_NOGO_BLOCKER_RESOLUTION_REF_FIELDS,
    blocker_id_binding_status: missingBlockerId ? "missing" : "present",
    component_binding_status: missingComponent ? "missing" : "present",
    safe_evidence_summary_binding_status: missingEvidenceSummaryBinding ? "missing" : "present",
    summary_intake_binding_status: missingSummaryIntakeBinding ? "missing" : "present",
    freshness_threshold_binding_status: missingFreshnessThresholdBinding ? "missing" : "present",
    owner_confirmation_binding_status: missingOwnerConfirmationBinding ? "missing" : "present",
    audit_binding_status: missingAuditBinding ? "missing" : "present",
    scope_binding_status: missingScopeBinding ? "missing" : "present",
    emergency_stop_binding_status: missingEmergencyStopBinding ? "missing" : "present",
    head_run_file_scope_binding_status: missingHeadRunFileScope ? "missing" : "present",
    redaction_status: missingRedactionPass ? "required" : "pass",
    fixture_evidence_policy: "not_resolution_candidate",
    dry_run_evidence_policy: "not_resolution_candidate",
    stale_evidence_policy: "not_resolution_candidate",
    manual_summary_policy: "not_owner_confirmation",
    operator_summary_policy: "not_owner_confirmation",
    owner_confirmed_reference_policy: "schema_only_until_real_owner_confirmed_artifact",
    remote_pass_policy: "not_owner_confirmation_not_real_evidence",
    local_checks_policy: "not_real_evidence",
    target_harness_policy: "not_real_evidence",
    browser_smoke_policy: "not_real_evidence",
    assistant_review_policy: "not_owner_confirmation",
    pr_merge_policy: "not_owner_confirmation",
    resolution_candidate_is_resolved: false,
    owner_confirmation_binding_is_real_confirmation: false,
    safe_summary_intake_is_real_evidence: false,
    remote_pass_resolves_blocker: false,
    auto_resolution_rejection_status: autoResolutionSource ? "rejected" : "not_present",
    forbidden_material_status: unsafeMaterialRejected ? "forbidden_material_rejected" : "not_present",
    request_packet_status: "request_only_no_collection",
    collection_plan_status: "planning_only",
    freshness_threshold_status: "planning_only",
    safe_evidence_summary_contract_status: "planning_only",
    summary_intake_binding_preservation_status: "planning_only",
    owner_confirmation_binding_preservation_status: "planning_only",
    real_evidence_intake_status: "schema_only",
    owner_confirmation_envelope_status: "schema_only_blocked_or_pending",
    fresh_evidence_bundle_status: "review_preparation_only",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    resolution_rejection_reasons: [...new Set(rejectionReasons)],
    safe_next_action: "create_separate_owner_confirmed_go_nogo_review_after_real_resident_fresh_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_collection: true,
      no_live_probe: true,
      no_real_renderer_call: true,
      no_real_sdk_call: true,
      no_external_service_call: true,
      no_trusted_loader_enablement: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_evidence_body_material: true,
      no_cue_body_material: true,
      no_renderer_body_material: true,
      no_loader_candidate_material: true,
      no_loader_error_material: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
      no_private_local_paths: true,
      no_shell_command_bodies: true,
    },
  };
  assertSafePublicObject(summary, "go no-go blocker resolution summary");
  return summary;
}

function realEvidenceRequestPacketReasons({ source, unsafeMaterialRejected, redactionStatus }) {
  const reasons = [
    "request_packet_blocked_missing_real_resident_evidence",
    "request_packet_blocked_missing_owner_confirmation",
    "request_packet_blocked_priority1_unresolved",
    "request_packet_blocked_motion_dataset_non_executable",
    "request_packet_not_runtime_ready",
    "request_packet_not_production_ready",
  ];
  if (!source.audit_ref) reasons.push("request_packet_blocked_missing_audit_ref");
  if (redactionStatus !== "pass") reasons.push("request_packet_blocked_redaction_status_required");
  if (unsafeMaterialRejected) reasons.push("request_packet_blocked_unsafe_material_rejected");
  if (source.source_kind === "fixture") reasons.push("request_packet_blocked_fixture_evidence_only");
  if (source.source_kind === "dry_run") reasons.push("request_packet_blocked_dry_run_evidence_only");
  if (source.freshness_status === "stale") reasons.push("request_packet_blocked_stale_evidence");
  if (source.mock_owner_confirmation === true) reasons.push("request_packet_blocked_mock_owner_confirmation");
  if (source.confirmed_by_role && source.confirmed_by_role !== "owner") reasons.push("request_packet_blocked_wrong_role_confirmation");
  if (source.confirmation_status === "expired") reasons.push("request_packet_blocked_expired_confirmation");
  if (source.confirmation_status === "revoked") reasons.push("request_packet_blocked_revoked_confirmation");
  return [...new Set(reasons)];
}

function ownerConfirmationEnvelopeReasons({
  source,
  confirmationScope,
  confirmedByRole,
  sourceKind,
  timestampMs,
  expiryMs,
  scopeMismatch,
  revoked,
  mock,
  fixture,
  dryRun,
  expired,
  unsafeMaterialRejected,
}) {
  const reasons = [];
  if (!source.confirmation_scope) reasons.push("confirmation_blocked_missing_scope");
  if (source.confirmation_scope && !OWNER_CONFIRMATION_SCOPE_SET.has(confirmationScope)) reasons.push("confirmation_blocked_unknown_scope");
  if (timestampMs === null) reasons.push("confirmation_blocked_missing_timestamp");
  if (!source.confirmed_by_role) reasons.push("confirmation_blocked_missing_role");
  if (confirmedByRole !== "owner") reasons.push("confirmation_blocked_wrong_role");
  if (!source.confirmation_source_kind) reasons.push("confirmation_blocked_missing_source_kind");
  if (!source.audit_ref) reasons.push("confirmation_blocked_missing_audit_ref");
  if (source.redaction_status !== "pass") reasons.push("confirmation_blocked_redaction_status_required");
  if (mock) reasons.push("confirmation_blocked_mock_confirmation");
  if (fixture) reasons.push("confirmation_blocked_fixture_confirmation");
  if (dryRun) reasons.push("confirmation_blocked_dry_run_confirmation");
  if (expiryMs === null) reasons.push("confirmation_blocked_missing_expiry");
  if (expired) reasons.push("confirmation_blocked_expired_confirmation");
  if (revoked) reasons.push("confirmation_blocked_revoked_confirmation");
  if (scopeMismatch) reasons.push("confirmation_blocked_scope_mismatch");
  if (unsafeMaterialRejected) reasons.push("confirmation_blocked_unsafe_material_rejected");
  reasons.push("confirmation_blocked_no_real_owner_confirmation");
  reasons.push("confirmation_blocked_priority1_unresolved");
  reasons.push("confirmation_blocked_motion_dataset_non_executable");
  reasons.push("confirmation_not_runtime_ready");
  reasons.push("confirmation_not_production_ready");
  if (sourceKind === "remote_quality_gate" || sourceKind === "local_check" || sourceKind === "target_harness" || sourceKind === "browser_smoke") {
    reasons.push("confirmation_blocked_auto_confirmation_source");
  }
  return [...new Set(reasons)];
}

function realEvidenceIntakeReasons({
  source,
  sourceType,
  sourceTypeAllowed,
  component,
  evidenceTimestampMs,
  freshnessStatus,
  rawRejected,
  ownerConfirmation,
  mockOwnerConfirmation,
  licenseBoundaryAcknowledged,
  sdkVendorBoundaryStatus,
}) {
  const reasons = [];
  if (!source.schema_version) reasons.push("intake_blocked_missing_schema_version");
  if (!source.source_type) reasons.push("intake_blocked_missing_source_type");
  if (source.source_type && sourceTypeAllowed !== true) reasons.push("intake_blocked_unknown_source_type");
  if (!source.component) reasons.push("intake_blocked_missing_component");
  if (component === "external_boundary_component") reasons.push("intake_blocked_external_boundary_component");
  if (!source.component_status) reasons.push("intake_blocked_missing_component_status");
  if (evidenceTimestampMs === null) reasons.push("intake_blocked_missing_timestamp");
  if (freshnessStatus === "stale") reasons.push("intake_blocked_stale_evidence");
  if (sourceType === "fixture") reasons.push("intake_blocked_fixture_evidence_only");
  if (sourceType === "dry_run") reasons.push("intake_blocked_dry_run_evidence_only");
  if (sourceType === "manual_summary" && ownerConfirmation !== true) reasons.push("intake_blocked_manual_summary_without_owner_confirmation");
  if (mockOwnerConfirmation === true) reasons.push("intake_blocked_mock_owner_confirmation");
  if (source.redaction_status !== "pass") reasons.push("intake_blocked_redaction_status_required");
  if (rawRejected === true) reasons.push("intake_blocked_unsafe_material_rejected");
  if (licenseBoundaryAcknowledged !== true) reasons.push("intake_blocked_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") reasons.push("intake_blocked_sdk_vendor_boundary");
  reasons.push("intake_blocked_priority1_unresolved");
  reasons.push("intake_blocked_motion_dataset_non_executable");
  reasons.push("intake_not_runtime_ready");
  reasons.push("intake_not_production_ready");
  return [...new Set(reasons)];
}

function safeEvidenceLabel(value, fallback) {
  return safeText(value) || fallback;
}

function realEvidenceFreshnessStatus(source, evidenceTimestampMs, nowMs, freshnessWindowMs) {
  if (source.freshness_status === "stale") return "stale";
  if (source.freshness_status === "fresh" && evidenceTimestampMs !== null && nowMs - evidenceTimestampMs <= freshnessWindowMs) return "fresh_summary_not_readiness";
  if (evidenceTimestampMs === null) return "missing_timestamp";
  if (nowMs - evidenceTimestampMs > freshnessWindowMs) return "stale";
  return "not_fresh_real_evidence";
}

function requiredEvidenceFieldsStatus(source, evidenceTimestampMs) {
  return source.schema_version && source.source_type && source.component && source.component_status && evidenceTimestampMs !== null
    ? "present"
    : "missing_required_fields";
}


export function createMotionDatasetRowSchemaPreflightSummary(rowInput = {}) {
  const source = rowInput && typeof rowInput === "object" ? rowInput : {};
  const motionStyle = safeMotionDatasetLabel(source.motion_style ?? source.motionStyle ?? source.motion_label, "missing");
  const motionLabel = safeMotionDatasetLabel(source.motion_label ?? source.motionLabel, "missing");
  const rowDataPresent = source.row_data_present === true || source.rowDataPresent === true || source.row !== undefined || source.dataset_row !== undefined;
  const checkedRowCount = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0 ? source.checked_row_count : 0;
  const experimentalLabelRequested = LIVE2D_EXPERIMENTAL_MOTION_LABELS.includes(motionStyle) || LIVE2D_EXPERIMENTAL_MOTION_LABELS.includes(motionLabel);
  const runtimeStyleSupported = LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES.includes(motionStyle);
  const rawFields = detectedMotionDatasetRawFields(source);
  const requestedReadiness = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const requestedExecution = source.motion_dataset_executable === true || source.motion_execution_requested === true || source.execute_motion === true || source.real_row_ingestion_started === true;
  const ownerConfirmationCreated = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true;

  const rejectionReasons = [
    "motion_dataset_row_schema_preflight_planning_only",
    "motion_dataset_row_schema_preflight_no_real_row_ingestion",
    "motion_dataset_row_schema_preflight_non_executable",
    "motion_dataset_row_schema_preflight_no_motion_execution",
    "motion_dataset_row_schema_preflight_no_real_collection",
    "motion_dataset_row_schema_preflight_no_live_probe",
    "motion_dataset_row_schema_preflight_no_owner_confirmation_created",
    "motion_dataset_row_schema_preflight_no_owner_confirmation_confirmed",
    "motion_dataset_row_schema_preflight_not_runtime_ready",
    "motion_dataset_row_schema_preflight_not_production_ready",
    "motion_dataset_row_schema_preflight_go_no_go_preserved",
    "motion_dataset_row_schema_preflight_priority1_blocked",
  ];
  if (!rowDataPresent) rejectionReasons.push("row_schema_rejected_no_real_rows_present");
  if (checkedRowCount !== 0) rejectionReasons.push("row_schema_rejected_checked_row_count_nonzero");
  if (experimentalLabelRequested) rejectionReasons.push("row_schema_rejected_experimental_label_non_executable");
  if (motionStyle !== "missing" && !runtimeStyleSupported) rejectionReasons.push("row_schema_rejected_unsupported_motion_style");
  if (rawFields.length) rejectionReasons.push("row_schema_rejected_raw_or_private_field");
  if (requestedReadiness) rejectionReasons.push("row_schema_rejected_readiness_claim");
  if (requestedExecution) rejectionReasons.push("row_schema_rejected_motion_execution_or_row_ingestion");
  if (ownerConfirmationCreated) rejectionReasons.push("row_schema_rejected_owner_confirmation_creation_or_confirmation");
  if (goRequested) rejectionReasons.push("row_schema_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) rejectionReasons.push("row_schema_rejected_trusted_loader_request");
  if (realCollectionRequested) rejectionReasons.push("row_schema_rejected_real_collection_or_probe");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    safe_summary_only: true,
    row_schema_preflight_status: "planning_only_blocked",
    row_schema_ready_candidate: false,
    planning_only: true,
    row_data_present: false,
    checked_row_count: 0,
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    real_row_ingestion_started: false,
    real_evidence_collection_started: false,
    live_probe_started: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    required_row_fields: [...LIVE2D_MOTION_DATASET_ROW_REQUIRED_FIELDS],
    required_audit_metadata: [...LIVE2D_MOTION_DATASET_ROW_REQUIRED_AUDIT_METADATA],
    runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    renderer_ready_required_fields: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    rejected_private_material_fields: privateMaterialFieldCategories(),
    detected_rejected_private_material_fields: rawFields,
    ux_audit_axes: [...LIVE2D_MOTION_DATASET_UX_AUDIT_AXES],
    eval_contamination_policy: "fixture_manifest_asset_route_sse_cue_acceptance_not_success_evidence",
    fixture_success_is_real_evidence: false,
    manifest_existence_is_real_evidence: false,
    asset_route_success_is_real_evidence: false,
    sse_connection_is_real_evidence: false,
    cue_acceptance_is_real_evidence: false,
    browser_cue_delivery_is_runtime_readiness: false,
    collection_plan_status: "planning_only",
    freshness_threshold_status: "preserved",
    safe_evidence_summary_contract_status: "preserved",
    summary_intake_binding_status: "preserved",
    owner_confirmation_binding_status: "schema_only_blocked",
    blocker_resolution_schema_status: "planning_only_blocked",
    collector_manifest_status: "planning_only",
    collector_fixture_pack_status: "synthetic_only",
    collector_dry_run_envelope_status: "request_only",
    rejection_reasons: [...new Set(rejectionReasons)],
    safe_next_action: "create_separate_owner_confirmed_motion_dataset_row_task_after_real_resident_evidence_and_go_no_go_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only_no_real_rows: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset row schema preflight summary");
  return summary;
}

export function createMotionDatasetSyntheticRowFixturePackSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const acceptedCases = filterSyntheticFixtureCases(
    source.accepted_synthetic_fixture_cases ?? source.acceptedSyntheticFixtureCases,
    LIVE2D_MOTION_DATASET_ACCEPTED_SYNTHETIC_FIXTURE_CASES,
  );
  const rejectedCases = filterSyntheticFixtureCases(
    source.rejected_synthetic_fixture_cases ?? source.rejectedSyntheticFixtureCases,
    LIVE2D_MOTION_DATASET_REJECTED_SYNTHETIC_FIXTURE_CASES,
  );
  const rawFields = detectedMotionDatasetRawFields(source);
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;

  const validationBlockedReasons = [
    "synthetic_row_fixture_pack_planning_only",
    "synthetic_row_fixture_pack_synthetic_only",
    "synthetic_row_fixture_pack_non_executable",
    "synthetic_row_fixture_pack_no_real_row_ingestion",
    "synthetic_row_fixture_pack_no_motion_execution",
    "synthetic_row_fixture_pack_no_real_collection",
    "synthetic_row_fixture_pack_no_live_probe",
    "synthetic_row_fixture_pack_no_owner_confirmation_created",
    "synthetic_row_fixture_pack_no_owner_confirmation_confirmed",
    "synthetic_row_fixture_pack_not_runtime_ready",
    "synthetic_row_fixture_pack_not_production_ready",
    "synthetic_row_fixture_pack_go_no_go_preserved",
    "synthetic_row_fixture_pack_priority1_blocked",
  ];
  if (rawFields.length) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_raw_or_private_field");
  if (realRowRequested || checkedRowCountRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_real_row_or_checked_count");
  if (executionRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_motion_execution");
  if (realCollectionRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_owner_confirmation");
  if (readinessRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_readiness_claim");
  if (goRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) validationBlockedReasons.push("synthetic_row_fixture_pack_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    safe_summary_only: true,
    motion_dataset_synthetic_row_fixture_pack_status: "planning_only_blocked",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    non_executable_boundary: true,
    real_row_data_present: false,
    synthetic_fixture_row_count: acceptedCases.length,
    checked_row_count: 0,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    accepted_synthetic_fixture_cases: acceptedCases,
    rejected_synthetic_fixture_cases: rejectedCases.map(safeSyntheticRejectedCaseLabel),
    synthetic_fixture_validator_status: "pass_synthetic_only",
    real_evidence_collection_started: false,
    real_probe_started: false,
    live_probe_started: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    renderer_ready_required_fields: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejected_private_material_fields: privateMaterialFieldCategories(),
    detected_rejected_private_material_fields: rawFields,
    unsafe_material_rejection_status: rawFields.length ? "unsafe_material_rejected" : "preserved",
    ux_audit_axes: [...LIVE2D_MOTION_DATASET_UX_AUDIT_AXES],
    ux_audit_guard_status: "required",
    eval_contamination_policy: "synthetic_fixtures_not_success_evidence",
    eval_contamination_guard_status: "required",
    fixture_success_is_real_evidence: false,
    manifest_existence_is_real_evidence: false,
    asset_route_success_is_real_evidence: false,
    sse_connection_is_real_evidence: false,
    cue_acceptance_is_real_evidence: false,
    browser_cue_delivery_is_runtime_readiness: false,
    row_schema_preflight_status: "preserved",
    collector_dry_run_envelope_status: "request_only_preserved",
    validation_blocked_reasons: [...new Set(validationBlockedReasons)],
    safe_next_action: "owner_confirmed_real_resident_evidence_collection_before_any_real_row_ingestion_or_motion_execution",
    boundary_policy: {
      ...createBoundaryPolicy(),
      synthetic_only_fixture_rows: true,
      planning_only_no_real_rows: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset synthetic row fixture pack summary");
  return summary;
}

export function createMotionDatasetRealRowIntakeRequestPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const packetRawFields = detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS);
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const expectedRowCountRequested = Number.isSafeInteger(source.expected_row_count) && source.expected_row_count > 0;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const requestedFormat = safeMotionDatasetLabel(source.requested_file_format ?? source.requestedFileFormat, "missing");
  const requestedFormatAllowed = LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS.includes(requestedFormat);

  const blockedReasons = [
    "real_row_intake_request_packet_planning_only",
    "real_row_intake_request_packet_request_only",
    "real_row_intake_request_packet_no_real_row_ingestion",
    "real_row_intake_request_packet_non_executable",
    "real_row_intake_request_packet_not_runtime_ready",
    "real_row_intake_request_packet_not_production_ready",
    "real_row_intake_request_packet_priority1_blocked",
    "real_row_intake_request_packet_owner_confirmation_required",
    "real_row_intake_request_packet_go_no_go_preserved",
  ];
  if (rawFields.length || packetRawFields.length) blockedReasons.push("real_row_intake_request_packet_rejected_unsafe_material");
  if (realRowRequested || checkedRowCountRequested || expectedRowCountRequested) blockedReasons.push("real_row_intake_request_packet_rejected_real_row_or_count_attempt");
  if (executionRequested) blockedReasons.push("real_row_intake_request_packet_rejected_motion_execution");
  if (realCollectionRequested) blockedReasons.push("real_row_intake_request_packet_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_intake_request_packet_rejected_owner_confirmation");
  if (readinessRequested) blockedReasons.push("real_row_intake_request_packet_rejected_readiness_claim");
  if (goRequested) blockedReasons.push("real_row_intake_request_packet_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_intake_request_packet_rejected_trusted_loader_request");
  if (requestedFormat !== "missing" && !requestedFormatAllowed) blockedReasons.push("real_row_intake_request_packet_rejected_unsupported_file_format");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_intake_request_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    request_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    real_row_data_present: false,
    checked_row_count: 0,
    expected_row_count_records_rows: false,
    expected_row_count_policy_status: "future_positive_required_but_not_counted_in_preflight",
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    required_request_fields: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_REQUIRED_FIELDS],
    required_owner_supplied_file_metadata: [
      "source_file_label",
      "source_hash",
      "requested_file_format",
      "expected_row_count",
    ],
    required_audit_metadata: [
      "audit_run_id",
      "auditor_version",
      "redaction_policy_ref",
    ],
    required_redaction_policy: "safe_summary_only_no_raw_row_body",
    required_file_format_policy: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS],
    required_schema_version_policy: "request_schema_version_required_before_future_ingestion",
    required_row_count_policy: "expected_row_count_positive_in_future_but_checked_row_count_remains_zero_now",
    required_checksum_policy: "source_hash_required_before_future_ingestion",
    required_split_policy: "dataset_split_plan_required_before_future_ingestion",
    required_motion_allowlist_policy: "runtime_supported_motion_style_separate_from_experimental_motion_label",
    required_renderer_ready_policy: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    rejected_request_fields: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS.map(safeSyntheticRejectedCaseLabel),
    detected_rejected_private_material_fields: [...new Set([...rawFields, ...packetRawFields])].sort(),
    allowed_requested_file_formats: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS],
    requested_file_format_status: requestedFormat === "missing" ? "missing_until_future_owner_request" : requestedFormatAllowed ? "future_format_label_allowed_not_ingested" : "unsupported_format_rejected",
    real_row_body_accepted: false,
    request_packet_is_real_row_ingestion: false,
    request_packet_parses_row_bodies: false,
    request_packet_adds_files: false,
    request_packet_executes_motion: false,
    request_packet_collects_real_evidence: false,
    request_packet_claims_readiness: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "required_unconfirmed",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    row_schema_ref: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    synthetic_fixture_pack_ref: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    row_schema_preflight_status: "planning_only_preserved",
    synthetic_fixture_pack_status: "synthetic_only_preserved",
    runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_task_with_actual_row_id_backed_file_after_real_resident_evidence_and_go_no_go_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      request_only_no_real_rows: true,
      planning_only_no_real_rows: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row intake request packet summary");
  return summary;
}

export function createMotionDatasetRealRowIntakeDryRunValidatorSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const rejectedRequestFields = detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REJECTED_REQUEST_FIELDS);
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true || source.actual_data_validation_started === true || source.row_pass_fail_over_real_data === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const requestedFormat = safeMotionDatasetLabel(source.requested_file_format ?? source.requestedFileFormat, "missing");
  const requestedFormatAllowed = LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS.includes(requestedFormat);

  const blockedReasons = [
    "real_row_intake_dry_run_validator_planning_only",
    "real_row_intake_dry_run_validator_dry_run_only",
    "real_row_intake_dry_run_validator_no_real_row_ingestion",
    "real_row_intake_dry_run_validator_non_executable",
    "real_row_intake_dry_run_validator_not_runtime_ready",
    "real_row_intake_dry_run_validator_not_production_ready",
    "real_row_intake_dry_run_validator_priority1_blocked",
    "real_row_intake_dry_run_validator_owner_confirmation_required",
    "real_row_intake_dry_run_validator_go_no_go_preserved",
  ];
  if (rawFields.length || rejectedRequestFields.length) blockedReasons.push("real_row_intake_dry_run_validator_rejected_unsafe_material");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_real_row_or_count_attempt");
  if (executionRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_motion_execution");
  if (realCollectionRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_owner_confirmation");
  if (readinessRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_readiness_claim");
  if (goRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_intake_dry_run_validator_rejected_trusted_loader_request");
  if (requestedFormat !== "missing" && !requestedFormatAllowed) blockedReasons.push("real_row_intake_dry_run_validator_rejected_unsupported_file_format");

  const acceptedCases = filterSyntheticFixtureCases(
    source.accepted_request_fixture_cases,
    LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_ACCEPTED_REQUEST_FIXTURE_CASES,
  );
  const rejectedCases = filterSyntheticFixtureCases(
    source.rejected_request_fixture_cases,
    LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_REJECTED_REQUEST_FIXTURE_CASES,
  );

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_intake_dry_run_validator_status: "planning_only_blocked",
    planning_only_boundary: true,
    dry_run_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    real_row_data_present: false,
    checked_row_count: 0,
    dry_run_validation_candidate: false,
    motion_dataset_executable: false,
    accepted_request_fixture_cases: acceptedCases,
    rejected_request_fixture_cases: rejectedCases.map(safeSyntheticRejectedCaseLabel),
    request_packet_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
    row_schema_ref_required: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    synthetic_fixture_pack_ref_required: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    request_metadata_validation_only: true,
    real_row_body_read: false,
    actual_data_validation_started: false,
    row_pass_fail_over_real_data: false,
    request_packet_status: "planning_only_preserved",
    row_schema_preflight_status: "planning_only_preserved",
    synthetic_fixture_pack_status: "synthetic_only_preserved",
    allowed_requested_file_formats: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS],
    requested_file_format_status: requestedFormat === "missing" ? "missing_until_future_owner_request" : requestedFormatAllowed ? "future_format_label_allowed_not_ingested" : "unsupported_format_rejected",
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_task_after_request_packet_review_and_go_no_go_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      dry_run_only_no_real_rows: true,
      planning_only_no_real_rows: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row intake dry run validator summary");
  return summary;
}

export function createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const rejectedFields = detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS);
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const declaredRowCountRequested = Number.isSafeInteger(source.declared_row_count) && source.declared_row_count > 0;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined || source.actual_file_content !== undefined;
  const fileReadRequested = source.actual_file_path_value !== undefined || source.file_content_read === true || source.row_body_read === true;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true || source.actual_data_validation_started === true || source.row_pass_fail_over_real_data === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const requestedFormat = safeMotionDatasetLabel(source.file_format ?? source.requested_file_format ?? source.requestedFileFormat, "missing");
  const requestedFormatAllowed = LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS.includes(requestedFormat);

  const blockedReasons = [
    "real_row_intake_quarantine_envelope_planning_only",
    "real_row_intake_quarantine_envelope_quarantine_only",
    "real_row_intake_quarantine_envelope_metadata_only",
    "real_row_intake_quarantine_envelope_no_real_row_ingestion",
    "real_row_intake_quarantine_envelope_no_row_body_read",
    "real_row_intake_quarantine_envelope_non_executable",
    "real_row_intake_quarantine_envelope_not_runtime_ready",
    "real_row_intake_quarantine_envelope_not_production_ready",
    "real_row_intake_quarantine_envelope_priority1_blocked",
    "real_row_intake_quarantine_envelope_owner_confirmation_required",
    "real_row_intake_quarantine_envelope_go_no_go_preserved",
  ];
  if (rawFields.length || rejectedFields.length) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_unsafe_material");
  if (realRowRequested || checkedRowCountRequested || declaredRowCountRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_real_row_or_count_attempt");
  if (fileReadRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_file_read_attempt");
  if (executionRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_motion_execution");
  if (realCollectionRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_owner_confirmation");
  if (readinessRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_readiness_claim");
  if (goRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_trusted_loader_request");
  if (requestedFormat !== "missing" && !requestedFormatAllowed) blockedReasons.push("real_row_intake_quarantine_envelope_rejected_unsupported_file_format");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_intake_quarantine_envelope_status: "planning_only_blocked",
    planning_only_boundary: true,
    quarantine_only_boundary: true,
    metadata_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    real_row_data_present: false,
    checked_row_count: 0,
    quarantine_candidate_status: "pending_metadata_only",
    quarantine_file_ref_status: "missing_or_pending",
    quarantine_source_hash_status: "missing_or_pending",
    quarantine_declared_row_count_status: "missing_or_pending_not_counted",
    quarantine_schema_version_status: "missing_or_pending",
    quarantine_split_plan_status: "missing_or_pending",
    quarantine_owner_confirmation_required: true,
    quarantine_owner_confirmation_confirmed: false,
    quarantine_audit_metadata_status: "missing_or_pending",
    quarantine_redaction_policy_status: "missing_or_pending",
    required_quarantine_metadata: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REQUIRED_METADATA],
    allowed_file_format_labels: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_ALLOWED_FILE_FORMATS],
    quarantine_rejected_fields: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_REJECTED_FIELDS.map(safeSyntheticRejectedCaseLabel),
    detected_rejected_private_material_fields: [...new Set([...rawFields, ...rejectedFields])].sort(),
    requested_file_format_status: requestedFormat === "missing" ? "missing_until_future_owner_request" : requestedFormatAllowed ? "future_format_label_allowed_not_ingested" : "unsupported_format_rejected",
    declared_row_count_records_rows: false,
    file_content_accepted: false,
    row_body_read: false,
    request_packet_status: "planning_only_preserved",
    dry_run_validator_status: "planning_only_preserved",
    row_schema_preflight_status: "planning_only_preserved",
    synthetic_fixture_pack_status: "synthetic_only_preserved",
    request_packet_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
    dry_run_validator_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
    row_schema_ref_required: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    synthetic_fixture_pack_ref_required: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "required_unconfirmed",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_review_of_quarantine_metadata_before_separate_actual_data_ingestion_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      quarantine_only_no_real_rows: true,
      metadata_only_no_real_rows: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row intake quarantine envelope summary");
  return summary;
}

export function createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const rejectedFields = detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS);
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined || source.actual_file_content !== undefined;
  const fileReadRequested = source.actual_file_path_value !== undefined || source.file_content_read === true || source.row_body_read === true;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realCollectionRequested = source.real_evidence_collection_started === true || source.real_probe_started === true || source.live_probe_started === true || source.actual_data_validation_started === true || source.row_pass_fail_over_real_data === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed" || source.approve_ingestion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;

  const blockedReasons = [
    "real_row_intake_owner_handoff_packet_planning_only",
    "real_row_intake_owner_handoff_packet_handoff_only",
    "real_row_intake_owner_handoff_packet_not_owner_confirmation",
    "real_row_intake_owner_handoff_packet_no_real_row_ingestion",
    "real_row_intake_owner_handoff_packet_no_row_body_read",
    "real_row_intake_owner_handoff_packet_non_executable",
    "real_row_intake_owner_handoff_packet_not_runtime_ready",
    "real_row_intake_owner_handoff_packet_not_production_ready",
    "real_row_intake_owner_handoff_packet_priority1_blocked",
    "real_row_intake_owner_handoff_packet_owner_confirmation_required",
    "real_row_intake_owner_handoff_packet_go_no_go_preserved",
  ];
  if (rawFields.length || rejectedFields.length) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_unsafe_material");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_real_row_or_count_attempt");
  if (fileReadRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_file_read_attempt");
  if (executionRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_motion_execution");
  if (realCollectionRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_real_collection_or_probe");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_owner_confirmation");
  if (readinessRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_readiness_claim");
  if (goRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_intake_owner_handoff_packet_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_intake_owner_handoff_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    handoff_only_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    required_owner_review_sections: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_REVIEW_SECTIONS],
    required_owner_confirmation_scopes: [...LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REQUIRED_CONFIRMATION_SCOPES],
    required_pre_ingestion_evidence_refs: [
      "fresh_real_resident_evidence_required",
      "priority1_real_evidence_required",
      "go_no_go_review_required",
    ],
    required_quarantine_refs: [
      LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
    ],
    required_redaction_policy_refs: [
      "safe_summary_only_no_row_body_no_private_material",
    ],
    required_audit_refs: [
      "audit_run_id",
      "auditor_version",
      "source_hash",
      "declared_row_count",
    ],
    owner_confirmation_required: true,
    owner_confirmation_confirmed: false,
    owner_confirmation_created: false,
    owner_confirmation_status: "pending",
    real_row_data_present: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_handoff_is_owner_confirmation: false,
    owner_handoff_approves_ingestion: false,
    owner_handoff_reads_rows: false,
    owner_handoff_ingests_rows: false,
    row_body_read: false,
    file_content_accepted: false,
    request_packet_status: "planning_only_preserved",
    dry_run_validator_status: "planning_only_preserved",
    quarantine_envelope_status: "planning_only_preserved",
    row_schema_preflight_status: "planning_only_preserved",
    synthetic_fixture_pack_status: "synthetic_only_preserved",
    request_packet_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_REQUEST_PACKET_SCHEMA,
    dry_run_validator_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_DRY_RUN_VALIDATOR_SCHEMA,
    quarantine_envelope_ref_required: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_QUARANTINE_ENVELOPE_SCHEMA,
    row_schema_ref_required: LIVE2D_MOTION_DATASET_ROW_SCHEMA_PREFLIGHT_SCHEMA,
    synthetic_fixture_pack_ref_required: LIVE2D_MOTION_DATASET_SYNTHETIC_ROW_FIXTURE_PACK_SCHEMA,
    runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    renderer_ready_dependencies: Object.fromEntries(LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS.map((field) => [field, false])),
    rejected_owner_handoff_fields: LIVE2D_MOTION_DATASET_REAL_ROW_INTAKE_OWNER_HANDOFF_REJECTED_FIELDS.map(safeSyntheticRejectedCaseLabel),
    detected_rejected_private_material_fields: [...new Set([...rawFields, ...rejectedFields])].sort(),
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_review_then_separate_owner_confirmed_actual_data_ingestion_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      handoff_only_no_confirmation: true,
      no_owner_confirmation_creation: true,
      no_owner_confirmation_confirmed: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_real_collection: true,
      no_live_probe: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
      no_raw_paths: true,
      no_endpoint_values: true,
      no_token_or_secret_values: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row intake owner handoff packet summary");
  return summary;
}

export function createMotionDatasetRealRowAuditManifestSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = detectedMotionDatasetRawFields(source);
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const executionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.blocker_resolved === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;

  const blockedReasons = [
    "real_row_audit_manifest_planning_only",
    "real_row_audit_manifest_manifest_only",
    "real_row_audit_manifest_no_real_audit_completed",
    "real_row_audit_manifest_no_real_row_ingestion",
    "real_row_audit_manifest_no_row_body_read",
    "real_row_audit_manifest_non_executable",
    "real_row_audit_manifest_priority1_blocked",
    "real_row_audit_manifest_owner_confirmation_required",
    "real_row_audit_manifest_go_no_go_preserved",
  ];
  if (rawFields.length) blockedReasons.push("real_row_audit_manifest_rejected_raw_or_private_field");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("real_row_audit_manifest_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("real_row_audit_manifest_rejected_row_body_or_file_read");
  if (executionRequested) blockedReasons.push("real_row_audit_manifest_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("real_row_audit_manifest_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("real_row_audit_manifest_rejected_owner_confirmation");
  if (goRequested) blockedReasons.push("real_row_audit_manifest_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("real_row_audit_manifest_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_MANIFEST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_audit_manifest_status: "planning_only_blocked",
    planning_only_boundary: true,
    audit_manifest_only_boundary: true,
    no_real_audit_completed_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    real_row_data_present: false,
    checked_row_count: 0,
    audit_manifest_only: true,
    audit_manifest_is_actual_audit_completion: false,
    row_body_read: false,
    file_content_accepted: false,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    audit_run_metadata_required: [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_RUN_METADATA_REQUIRED_FIELDS],
    row_level_audit_fields_required: [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_ROW_LEVEL_REQUIRED_FIELDS],
    dataset_level_summary_fields_required: [...LIVE2D_MOTION_DATASET_REAL_ROW_AUDIT_DATASET_SUMMARY_REQUIRED_FIELDS],
    row_uniqueness_policy_required: "row_id_unique_required_before_future_real_audit",
    source_hash_policy_required: "source_hash_required_before_future_real_audit",
    split_policy_required: "dataset_split_required_before_future_real_audit",
    renderer_ready_dependency_policy_required: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    motion_allowlist_policy_required: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    experimental_motion_labels_executable: false,
    ux_accessibility_policy_required: [...LIVE2D_MOTION_DATASET_UX_AUDIT_AXES],
    redaction_policy_required: "safe_summary_only_no_row_body_no_private_material",
    priority1_boundary_policy_required: "priority1_remains_BLOCKED_until_real_resident_fresh_evidence",
    eval_contamination_guard: "fixtures_routes_cues_and_sse_are_not_real_row_success_evidence",
    detected_rejected_private_material_fields: rawFields,
    rejection_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_future_owner_confirmed_actual_row_audit_task_without_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      audit_manifest_only: true,
      no_real_audit_completion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row audit manifest summary");
  return summary;
}

export function createMotionDatasetRealRowRedactionScannerFixturePackSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES.map((label) => label.replace(/_rejected$/u, ""))),
  ];
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const acceptedCases = filterSyntheticFixtureCases(source.accepted_redaction_fixture_cases, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_ACCEPTED_FIXTURE_CASES);
  const rejectedCases = filterSyntheticFixtureCases(source.rejected_redaction_fixture_cases, LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_REJECTED_FIXTURE_CASES);
  const rejectionReasons = [
    "redaction_scanner_fixture_pack_synthetic_only",
    "redaction_scanner_fixture_pack_no_real_row_ingestion",
    "redaction_scanner_fixture_pack_no_row_body_read",
    "redaction_scanner_fixture_pack_non_executable",
    "redaction_scanner_fixture_pack_priority1_blocked",
    "redaction_scanner_fixture_pack_owner_confirmation_required",
    "redaction_scanner_fixture_pack_go_no_go_preserved",
  ];
  if (rawFields.length) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_raw_or_private_field");
  if (readinessRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_readiness_claim");
  if (ownerConfirmationRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_owner_confirmation");
  if (priorityResolvedRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_priority1_resolution");
  if (motionExecutionRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_motion_execution");
  if (realRowRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_real_row_data");
  if (rowBodyReadRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_row_body_read");
  if (goRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) rejectionReasons.push("redaction_scanner_fixture_pack_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_SCANNER_FIXTURE_PACK_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_redaction_scanner_fixture_pack_status: "planning_only_blocked",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    redaction_scanner_fixture_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    synthetic_only: true,
    redaction_scanner_fixture_only: true,
    accepted_redaction_fixtures_are_real_evidence: false,
    accepted_redaction_fixtures_are_real_safety_proof: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    file_content_accepted: false,
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    redaction_policy_ref_required: true,
    audit_manifest_ref_required: true,
    accepted_redaction_fixture_cases: acceptedCases,
    rejected_redaction_fixture_cases: rejectedCases.map(safeSyntheticRejectedCaseLabel),
    rejected_redaction_fixture_public_labels: rejectedCases.map(safeSyntheticRejectedCaseLabel),
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    rejection_reasons: [...new Set(rejectionReasons)],
    safe_next_action: "prepare_future_owner_confirmed_real_redaction_scan_without_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      synthetic_fixture_only: true,
      no_real_row_scan: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row redaction scanner fixture pack summary");
  return summary;
}

export function createMotionDatasetRealRowEvidenceLinkManifestSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "future_real_row_file_ref",
      "future_real_row_audit_ref",
      "future_real_redaction_scan_ref",
      "future_owner_confirmation_ref",
      "future_fresh_resident_evidence_ref",
      "owner_private_note",
      "raw_owner_confirmation_note",
      "actual_file_path_value",
      "actual_file_content",
      "raw_dataset_row_body",
    ]),
  ];
  const realEvidenceRequested = source.real_evidence_present === true || source.future_fresh_resident_evidence_status === "present" || source.future_real_row_audit_status === "complete";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const blockedReasons = [
    "evidence_link_manifest_planning_only",
    "evidence_link_manifest_not_real_evidence",
    "evidence_link_manifest_no_real_row_ingestion",
    "evidence_link_manifest_no_row_body_read",
    "evidence_link_manifest_priority1_blocked",
    "evidence_link_manifest_owner_confirmation_required",
    "evidence_link_manifest_same_head_remote_required",
  ];
  if (rawFields.length) blockedReasons.push("evidence_link_manifest_rejected_raw_or_private_ref");
  if (realEvidenceRequested) blockedReasons.push("evidence_link_manifest_rejected_real_evidence_claim");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("evidence_link_manifest_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("evidence_link_manifest_rejected_row_body_or_file_read");
  if (readinessRequested) blockedReasons.push("evidence_link_manifest_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("evidence_link_manifest_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("evidence_link_manifest_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("evidence_link_manifest_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("evidence_link_manifest_rejected_trusted_loader_request");
  if (motionExecutionRequested) blockedReasons.push("evidence_link_manifest_rejected_motion_execution");

  const linkRefStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS.map((ref) => [ref, ref.startsWith("future_") ? "pending_label_only" : "planning_ref_required"]));
  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_MANIFEST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_evidence_link_manifest_status: "planning_only_blocked",
    planning_only_boundary: true,
    evidence_link_manifest_only_boundary: true,
    no_real_evidence_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    evidence_link_manifest_is_real_evidence: false,
    evidence_link_manifest_provides_real_file: false,
    evidence_link_manifest_marks_audit_complete: false,
    future_real_reference_is_location_value: false,
    future_real_row_file_ref_status: "pending_label_only",
    future_real_row_audit_ref_status: "pending_label_only",
    future_real_redaction_scan_ref_status: "pending_label_only",
    future_owner_confirmation_ref_status: "pending_label_only_unconfirmed",
    future_fresh_resident_evidence_ref_status: "pending_label_only_not_evidence",
    future_go_nogo_review_ref_status: "pending_label_only_no_go",
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    file_content_accepted: false,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    evidence_precedence_policy_required: true,
    same_head_remote_policy_required: true,
    local_evidence_promoted_to_remote: false,
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    owner_confirmation_ref_required: true,
    audit_manifest_ref_required: true,
    redaction_scanner_ref_required: true,
    quarantine_envelope_ref_required: true,
    required_link_refs: [...LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_REQUIRED_LINK_REFS],
    required_evidence_ref_types: [...LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES],
    required_pre_ingestion_refs: [
      "row_schema_preflight_ref",
      "synthetic_fixture_pack_ref",
      "request_packet_ref",
      "dry_run_validator_ref",
      "quarantine_envelope_ref",
      "owner_handoff_packet_ref",
      "audit_manifest_ref",
      "redaction_scanner_fixture_ref",
    ],
    required_post_ingestion_refs: [
      "future_real_row_audit_ref",
      "future_real_redaction_scan_ref",
      "future_owner_confirmation_ref",
      "future_fresh_resident_evidence_ref",
      "future_go_nogo_review_ref",
    ],
    link_ref_statuses: linkRefStatuses,
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_future_owner_confirmed_actual_data_task_without_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      evidence_link_manifest_only: true,
      no_real_evidence: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row evidence link manifest summary");
  return summary;
}
export function createMotionDatasetRealRowGoNoGoBlockerMapSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "raw_field_leak_detected",
      "raw_dataset_row_body",
      "actual_file_path_value",
      "actual_file_content",
      "owner_private_note",
      "raw_owner_confirmation_note",
    ]),
  ];
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const blockerResolvedRequested = source.blocker_resolved === true || source.priority1_status === "RESOLVED" || source.priority1_resolved === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const noGoReasons = [
    "no_go_missing_real_row_file",
    "no_go_missing_source_hash",
    "no_go_missing_quarantine_metadata",
    "no_go_missing_redaction_scan",
    "no_go_missing_audit_manifest_result",
    "no_go_missing_owner_confirmation",
    "no_go_missing_fresh_resident_evidence",
    "no_go_missing_renderer_ready_dependencies",
    "no_go_checked_row_count_zero",
    "no_go_priority1_blocked",
    "no_go_review_missing",
    "no_go_trusted_loader_disabled",
  ];
  if (rawFields.length) noGoReasons.push("no_go_raw_field_leak_detected");
  if (goRequested) noGoReasons.push("go_nogo_blocker_map_rejected_go_approval");
  if (blockerResolvedRequested) noGoReasons.push("go_nogo_blocker_map_rejected_blocker_resolution");
  if (ownerConfirmationRequested) noGoReasons.push("go_nogo_blocker_map_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) noGoReasons.push("go_nogo_blocker_map_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) noGoReasons.push("go_nogo_blocker_map_rejected_row_body_or_file_read");
  if (motionExecutionRequested) noGoReasons.push("go_nogo_blocker_map_rejected_motion_execution");
  if (readinessRequested) noGoReasons.push("go_nogo_blocker_map_rejected_readiness_claim");
  if (trustedLoaderRequested) noGoReasons.push("go_nogo_blocker_map_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_MAP_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_go_nogo_blocker_map_status: "planning_only_blocked",
    planning_only_boundary: true,
    go_nogo_map_only_boundary: true,
    no_go_preserved_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    go_nogo_blocker_map_is_go_approval: false,
    required_blocker_ids: [...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_BLOCKER_IDS],
    required_resolution_prerequisites: [...LIVE2D_MOTION_DATASET_REAL_ROW_GO_NOGO_RESOLUTION_PREREQUISITES],
    required_no_go_reasons: [...new Set(noGoReasons)],
    required_go_candidate_conditions: [
      "separate_owner_confirmed_actual_data_task",
      "fresh_resident_evidence_present",
      "row_audit_passed_in_future_task",
      "redaction_scan_passed_in_future_task",
      "renderer_ready_dependencies_satisfied",
      "go_nogo_review_passed_in_future_task",
    ],
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    safe_next_action: "keep_no_go_until_future_owner_confirmed_actual_data_and_go_nogo_review",
    boundary_policy: {
      ...createBoundaryPolicy(),
      go_nogo_map_only: true,
      no_go_preserved: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row go nogo blocker map summary");
  return summary;
}

export function createMotionDatasetRealRowPreIngestionReviewPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "future_file_format_value",
      "future_source_hash_value",
      "future_declared_row_count_value",
      "future_dataset_split_plan_value",
      "future_audit_run_id_value",
      "owner_private_note",
      "raw_owner_confirmation_note",
      "actual_file_path_value",
      "actual_file_content",
      "raw_dataset_row_body",
    ]),
  ];
  const realEvidenceRequested = source.real_evidence_present === true || source.fresh_resident_evidence_present === true;
  const ownerApprovalRequested = source.owner_approval_created === true || source.owner_approval_confirmed === true || source.owner_approval_status === "confirmed";
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "pre_ingestion_review_packet_planning_only",
    "pre_ingestion_review_packet_review_only",
    "pre_ingestion_review_packet_no_owner_approval",
    "pre_ingestion_review_packet_no_real_row_ingestion",
    "pre_ingestion_review_packet_no_row_body_read",
    "pre_ingestion_review_packet_priority1_blocked",
    "pre_ingestion_review_packet_go_nogo_no_go",
    "pre_ingestion_review_packet_owner_confirmation_required",
    "pre_ingestion_review_packet_fresh_resident_evidence_required",
  ];
  if (rawFields.length) blockedReasons.push("pre_ingestion_review_packet_rejected_raw_or_private_material");
  if (realEvidenceRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_real_evidence_claim");
  if (ownerApprovalRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_owner_approval");
  if (ownerConfirmationRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("pre_ingestion_review_packet_rejected_trusted_loader_request");

  const artifactStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS.map((artifact) => [artifact, "planning_artifact_required"]));
  const ownerReviewStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS.map((item) => [item, "future_owner_review_required"]));
  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REVIEW_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_pre_ingestion_review_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    pre_ingestion_review_only_boundary: true,
    no_approval_boundary: true,
    no_go_preserved_boundary: true,
    metadata_only_preservation_boundary: true,
    no_real_evidence_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    pre_ingestion_review_only: true,
    pre_ingestion_review_packet_is_owner_approval: false,
    owner_approval_created: false,
    owner_approval_confirmed: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    file_content_accepted: false,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    fresh_resident_evidence_status: "required_not_present",
    future_file_format_status: "owner_review_required",
    future_source_hash_status: "owner_review_required",
    future_declared_row_count_status: "owner_review_required",
    future_dataset_split_plan_status: "owner_review_required",
    future_audit_run_status: "owner_review_required",
    future_redaction_policy_status: "owner_review_required",
    future_renderer_ready_policy_status: "owner_review_required",
    future_motion_policy_status: "owner_review_required",
    future_go_nogo_review_status: "required_no_go",
    required_pre_ingestion_artifacts: [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_ARTIFACTS],
    required_owner_review_items: [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_OWNER_REVIEW_ITEMS],
    required_missing_blocker_checks: [...LIVE2D_MOTION_DATASET_REAL_ROW_PRE_INGESTION_REQUIRED_MISSING_BLOCKER_CHECKS],
    required_renderer_ready_checks: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    required_evidence_refs: [...LIVE2D_MOTION_DATASET_REAL_ROW_EVIDENCE_LINK_EVIDENCE_REF_TYPES],
    required_go_nogo_refs: [
      "go_nogo_blocker_map",
      "future_go_nogo_review",
      "future_priority1_blocker_review",
    ],
    artifact_statuses: artifactStatuses,
    owner_review_statuses: ownerReviewStatuses,
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_future_owner_review_packet_without_real_row_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      pre_ingestion_review_only: true,
      no_owner_approval: true,
      no_real_evidence: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row pre ingestion review packet summary");
  return summary;
}

export function createMotionDatasetRealRowFinalDryRunChecklistSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "future_source_hash_value",
      "future_declared_row_count_value",
      "owner_private_note",
      "raw_owner_confirmation_note",
      "actual_file_path_value",
      "actual_file_content",
      "raw_dataset_row_body",
    ]),
  ];
  const realEvidenceRequested = source.real_evidence_present === true || source.fresh_resident_evidence_present === true;
  const ownerApprovalRequested = source.owner_approval_created === true || source.owner_approval_confirmed === true || source.owner_approval_status === "confirmed";
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "final_dry_run_checklist_planning_only",
    "final_dry_run_checklist_no_actual_ingestion",
    "final_dry_run_checklist_no_real_row_ingestion",
    "final_dry_run_checklist_no_row_body_read",
    "final_dry_run_checklist_priority1_blocked",
    "final_dry_run_checklist_go_nogo_no_go",
    "final_dry_run_checklist_owner_confirmation_required",
    "final_dry_run_checklist_fresh_resident_evidence_required",
  ];
  if (rawFields.length) blockedReasons.push("final_dry_run_checklist_rejected_raw_or_private_material");
  if (realEvidenceRequested) blockedReasons.push("final_dry_run_checklist_rejected_real_evidence_claim");
  if (ownerApprovalRequested) blockedReasons.push("final_dry_run_checklist_rejected_owner_approval");
  if (ownerConfirmationRequested) blockedReasons.push("final_dry_run_checklist_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("final_dry_run_checklist_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("final_dry_run_checklist_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("final_dry_run_checklist_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("final_dry_run_checklist_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("final_dry_run_checklist_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("final_dry_run_checklist_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("final_dry_run_checklist_rejected_trusted_loader_request");

  const checklistStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS.map((item) => [item, "visible_or_required_for_future_owner_review"]));
  const artifactStatuses = Object.fromEntries(LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS.map((ref) => [ref, "planning_ref_visible"]));
  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_final_dry_run_checklist_status: "planning_only_blocked",
    planning_only_boundary: true,
    final_dry_run_only_boundary: true,
    no_actual_ingestion_boundary: true,
    no_approval_boundary: true,
    no_go_preserved_boundary: true,
    metadata_only_preservation_boundary: true,
    no_real_evidence_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    final_dry_run_only: true,
    final_dry_run_checklist_is_ingestion_approval: false,
    owner_approval_created: false,
    owner_approval_confirmed: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    file_content_accepted: false,
    motion_dataset_executable: false,
    motion_dataset_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    fresh_resident_evidence_status: "required_not_present",
    required_checklist_items: [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_CHECKLIST_ITEMS],
    required_blocker_visibility: [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_BLOCKER_VISIBILITY],
    required_artifact_refs: [...LIVE2D_MOTION_DATASET_REAL_ROW_FINAL_DRY_RUN_ARTIFACT_REFS],
    required_renderer_ready_checks: [...LIVE2D_MOTION_DATASET_ROW_RENDERER_READY_REQUIRED_FIELDS],
    checklist_statuses: checklistStatuses,
    artifact_statuses: artifactStatuses,
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "keep_final_dry_run_checklist_planning_only_until_owner_confirmed_future_ingestion_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      final_dry_run_only: true,
      no_actual_ingestion: true,
      no_owner_approval: true,
      no_real_evidence: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row final dry run checklist summary");
  return summary;
}

export function createMotionDatasetRealRowMissingDataFailClosedGateSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "raw_dataset_row_body",
      "actual_file_path_value",
      "actual_file_content",
      "future_source_hash_value",
      "owner_private_note",
      "raw_owner_confirmation_note",
    ]),
  ];
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const realEvidenceRequested = source.real_evidence_present === true || source.fresh_resident_evidence_present === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "missing_data_fail_closed_gate_planning_only",
    "missing_data_fail_closed_gate_no_owner_provided_row_file",
    "missing_data_fail_closed_gate_actual_ingestion_not_allowed",
    "missing_data_fail_closed_gate_checked_row_count_zero",
    "missing_data_fail_closed_gate_real_row_data_absent",
    "missing_data_fail_closed_gate_priority1_blocked",
    "missing_data_fail_closed_gate_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("missing_data_fail_closed_gate_rejected_raw_or_private_material");
  if (actualIngestionRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_actual_ingestion_request");
  if (realEvidenceRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_real_evidence_claim");
  if (ownerConfirmationRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("missing_data_fail_closed_gate_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FAIL_CLOSED_GATE_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_missing_data_fail_closed_gate_status: "planning_only_blocked",
    planning_only_boundary: true,
    missing_data_gate_only_boundary: true,
    fail_closed_boundary: true,
    no_actual_ingestion_allowed_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_readiness_boundary: true,
    missing_data_gate_only: true,
    fail_closed: true,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    required_missing_data_blockers: [...LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_BLOCKERS],
    required_future_data_prerequisites: [...LIVE2D_MOTION_DATASET_REAL_ROW_MISSING_DATA_FUTURE_PREREQUISITES],
    detected_rejected_private_material_fields: [...new Set(rawFields)].sort(),
    blocked_reasons: [...new Set(blockedReasons)],
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    safe_next_action: "keep_fail_closed_until_future_owner_confirmed_actual_row_data_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      missing_data_gate_only: true,
      fail_closed: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_raw_dataset_rows: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row missing data fail closed gate summary");
  return summary;
}

export function createMotionDatasetOwnerRowDataSubmissionPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const actualContentRequested = source.actual_row_content_accepted === true || source.raw_dataset_row_body !== undefined || source.actual_file_content !== undefined;
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "owner_row_data_submission_packet_planning_only",
    "owner_row_data_submission_packet_no_actual_row_content",
    "owner_row_data_submission_packet_no_real_row_ingestion",
    "owner_row_data_submission_packet_no_row_body_read",
    "owner_row_data_submission_packet_owner_confirmation_required",
    "owner_row_data_submission_packet_priority1_blocked",
    "owner_row_data_submission_packet_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("owner_row_data_submission_packet_rejected_unsafe_material");
  if (actualContentRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_actual_row_content");
  if (actualIngestionRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_actual_ingestion_request");
  if (ownerConfirmationRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("owner_row_data_submission_packet_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_owner_row_data_submission_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    owner_submission_packet_only_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_readiness_boundary: true,
    owner_submission_packet_only: true,
    actual_row_content_accepted: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    required_owner_submission_items: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_ITEMS],
    required_owner_confirmation_scopes: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_CONFIRMATION_SCOPES],
    required_file_shape: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_FILE_SHAPE.map((field) => safeOwnerRowSubmissionFileShapeLabel(field))],
    required_metadata_shape: [
      "declared_file_format",
      "declared_row_count",
      "source_hash",
      "schema_version",
      "dataset_split_plan",
      "audit_run_id",
      "auditor_version",
    ],
    rejected_submission_field_categories: [...new Set(LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS.map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field)))],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "owner_may_prepare_metadata_only_future_submission_without_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      owner_submission_packet_only: true,
      no_actual_row_content: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_dataset_row_body_public: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset owner row data submission packet summary");
  return summary;
}

export function createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const submissionReceivedRequested = source.owner_submission_received === true || source.submission_received === true;
  const submissionAcceptedRequested = source.owner_submission_accepted === true || source.submission_accepted === true || source.owner_submission_status === "accepted";
  const actualContentRequested = source.actual_row_content_accepted === true || source.raw_dataset_row_body !== undefined || source.actual_file_content !== undefined;
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true || source.actual_file_path_value !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "owner_row_data_submission_receipt_stub_planning_only",
    "owner_row_data_submission_receipt_stub_no_submission_accepted",
    "owner_row_data_submission_receipt_stub_no_actual_row_content",
    "owner_row_data_submission_receipt_stub_no_real_row_ingestion",
    "owner_row_data_submission_receipt_stub_no_row_body_read",
    "owner_row_data_submission_receipt_stub_owner_confirmation_required",
    "owner_row_data_submission_receipt_stub_priority1_blocked",
    "owner_row_data_submission_receipt_stub_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_unsafe_material");
  if (submissionReceivedRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_submission_received");
  if (submissionAcceptedRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_submission_acceptance");
  if (actualContentRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_actual_row_content");
  if (actualIngestionRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_actual_ingestion_request");
  if (ownerConfirmationRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_owner_confirmation");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_row_body_or_file_read");
  if (motionExecutionRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_readiness_claim");
  if (priorityResolvedRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("owner_row_data_submission_receipt_stub_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_STUB_SCHEMA,
    safe_summary_only: true,
    motion_dataset_owner_row_data_submission_receipt_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    receipt_stub_only_boundary: true,
    no_owner_submission_accepted_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_real_collection_boundary: true,
    no_live_probe_boundary: true,
    no_readiness_boundary: true,
    receipt_stub_only: true,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_row_content_accepted: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    checked_row_count: 0,
    row_body_read: false,
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    required_receipt_metadata_labels: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_METADATA_LABELS],
    required_future_submission_refs: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_RECEIPT_REQUIRED_FUTURE_REFS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_metadata_labels_only_for_future_owner_confirmed_submission_without_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      receipt_stub_only: true,
      no_owner_submission_accepted: true,
      no_actual_row_content: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_file_content_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_dataset_row_body_public: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset owner row data submission receipt stub summary");
  return summary;
}

export function createMotionDatasetRowFileChecksumPreflightManifestSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      ...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
      "source_hash",
      "actual_source_hash",
      "hash_value",
      "raw_hash_input",
      "actual_file_path",
      "actual_file_path_value",
      "dataset_file_path",
      "actual_file_content",
      "raw_file_body",
      "file_body",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const fileReadRequested = source.actual_file_read === true || source.file_content_read === true || source.file_path_read === true;
  const hashCalculationRequested = source.actual_hash_calculated === true || source.hash_calculated === true || source.source_hash_calculated === true;
  const filePathAcceptedRequested = source.actual_file_reference_accepted === true || source.actual_file_path_value !== undefined || source.dataset_file_path !== undefined || source.actual_file_path !== undefined;
  const fileContentAcceptedRequested = source.actual_file_content_accepted === true || source.actual_file_content !== undefined || source.raw_file_body !== undefined || source.file_body !== undefined;
  const hashValueRequested = source.source_hash !== undefined || source.actual_source_hash !== undefined || source.hash_value !== undefined || source.raw_hash_input !== undefined;
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true || source.row !== undefined || source.dataset_row !== undefined;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.raw_dataset_row_body !== undefined;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "row_file_checksum_preflight_manifest_planning_only",
    "row_file_checksum_preflight_manifest_checksum_manifest_only",
    "row_file_checksum_preflight_manifest_no_actual_file_read",
    "row_file_checksum_preflight_manifest_no_actual_hash_calculation",
    "row_file_checksum_preflight_manifest_no_real_row_ingestion",
    "row_file_checksum_preflight_manifest_no_row_body_read",
    "row_file_checksum_preflight_manifest_owner_confirmation_required",
    "row_file_checksum_preflight_manifest_priority1_blocked",
    "row_file_checksum_preflight_manifest_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_unsafe_material");
  if (fileReadRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_file_read");
  if (hashCalculationRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_hash_calculation");
  if (filePathAcceptedRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_file_reference");
  if (fileContentAcceptedRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_file_content");
  if (hashValueRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_real_hash_value");
  if (actualIngestionRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_actual_ingestion_request");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_row_body_read");
  if (motionExecutionRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("row_file_checksum_preflight_manifest_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_MANIFEST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_row_file_checksum_preflight_manifest_status: "planning_only_blocked",
    planning_only_boundary: true,
    checksum_manifest_only_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_hash_calculation_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    actual_file_read: false,
    actual_hash_calculated: false,
    actual_file_reference_accepted: false,
    actual_file_content_accepted: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    row_body_read: false,
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    priority1_status: "BLOCKED",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    required_hash_metadata_labels: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_HASH_METADATA_LABELS],
    required_hash_algorithm_labels: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS],
    allowed_hash_algorithms: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_ALLOWED_HASH_ALGORITHMS],
    required_file_identity_labels: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_FILE_IDENTITY_LABELS],
    required_owner_confirmation_refs: [...LIVE2D_MOTION_DATASET_ROW_FILE_CHECKSUM_PREFLIGHT_REQUIRED_OWNER_CONFIRMATION_REFS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_checksum_metadata_labels_only_without_file_read_or_hash_calculation",
    boundary_policy: {
      ...createBoundaryPolicy(),
      checksum_manifest_only: true,
      no_actual_file_read: true,
      no_actual_hash_calculation: true,
      no_actual_file_reference_accepted: true,
      no_actual_file_content_accepted: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_dataset_row_body_public: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset row file checksum preflight manifest summary");
  return summary;
}

export function createMotionDatasetOwnerRowDataMetadataValidatorStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      ...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
      "actual_file_path_value",
      "actual_file_content",
      "raw_jsonl_body",
      "raw_csv_body",
      "raw_row_body",
      "raw_dataset_row_body",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const fileReadRequested = source.actual_file_read === true || source.file_content_read === true || source.file_path_read === true;
  const hashCalculationRequested = source.actual_hash_calculated === true || source.hash_calculated === true || source.source_hash_calculated === true;
  const fileReferenceAcceptedRequested = source.actual_file_reference_accepted === true || source.actual_file_path_accepted === true || source.actual_file_path_value !== undefined;
  const fileContentAcceptedRequested = source.actual_file_content_accepted === true || source.actual_file_content !== undefined || source.raw_jsonl_body !== undefined || source.raw_csv_body !== undefined;
  const actualContentRequested = source.actual_row_content_accepted === true || source.raw_dataset_row_body !== undefined || source.raw_row_body !== undefined || source.dataset_row !== undefined || source.row !== undefined;
  const submissionReceivedRequested = source.owner_submission_received === true || source.submission_received === true;
  const submissionAcceptedRequested = source.owner_submission_accepted === true || source.submission_accepted === true || source.owner_submission_status === "accepted";
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "metadata_validator_stub_planning_only",
    "metadata_validator_stub_metadata_only",
    "metadata_validator_stub_no_submission_accepted",
    "metadata_validator_stub_no_actual_file_read",
    "metadata_validator_stub_no_actual_hash_calculation",
    "metadata_validator_stub_no_actual_row_content",
    "metadata_validator_stub_no_real_row_ingestion",
    "metadata_validator_stub_no_row_body_read",
    "metadata_validator_stub_owner_confirmation_required",
    "metadata_validator_stub_priority1_blocked",
    "metadata_validator_stub_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("metadata_validator_stub_rejected_unsafe_material");
  if (submissionReceivedRequested) blockedReasons.push("metadata_validator_stub_rejected_submission_received");
  if (submissionAcceptedRequested) blockedReasons.push("metadata_validator_stub_rejected_submission_acceptance");
  if (fileReadRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_file_read");
  if (hashCalculationRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_hash_calculation");
  if (fileReferenceAcceptedRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_file_reference");
  if (fileContentAcceptedRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_file_content");
  if (actualContentRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_row_content");
  if (actualIngestionRequested) blockedReasons.push("metadata_validator_stub_rejected_actual_ingestion_request");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("metadata_validator_stub_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("metadata_validator_stub_rejected_row_body_read");
  if (motionExecutionRequested) blockedReasons.push("metadata_validator_stub_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("metadata_validator_stub_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("metadata_validator_stub_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("metadata_validator_stub_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("metadata_validator_stub_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("metadata_validator_stub_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_STUB_SCHEMA,
    safe_summary_only: true,
    motion_dataset_owner_row_data_metadata_validator_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    metadata_validator_stub_only_boundary: true,
    metadata_only_boundary: true,
    no_submission_accepted_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_hash_calculation_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    metadata_validator_stub_only: true,
    metadata_validation_candidate: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_file_read: false,
    actual_hash_calculated: false,
    actual_file_reference_accepted: false,
    actual_file_content_accepted: false,
    actual_row_content_accepted: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    row_body_read: false,
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    required_metadata_labels: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REQUIRED_LABELS],
    allowed_file_format_labels: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_FILE_FORMATS],
    allowed_hash_algorithm_labels: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_ALLOWED_HASH_ALGORITHMS],
    required_validator_rejection_reasons: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_METADATA_VALIDATOR_REJECTION_REASONS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_metadata_labels_only_without_file_or_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      metadata_validator_stub_only: true,
      metadata_only: true,
      no_submission_accepted: true,
      no_actual_file_read: true,
      no_actual_hash_calculation: true,
      no_actual_file_reference_accepted: true,
      no_actual_file_content_accepted: true,
      no_actual_row_content: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_dataset_row_body_public: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset owner row data metadata validator stub summary");
  return summary;
}

export function createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      ...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
      "actual_file_path_value",
      "actual_file_content",
      "raw_jsonl_body",
      "raw_csv_body",
      "raw_dataset_row_body",
      "raw_row_body",
      "raw_cue_payload",
      "raw_renderer_payload",
      "raw_model_path",
      "raw_motion_path",
      "endpoint_value",
      "token_value",
      "secret_value",
      "private_local_path",
      "world_command",
      "obs_command",
      "game_input",
      "os_command",
      "memory_commit",
      "relationship_commit",
      "raw_process_output",
      "raw_stack_trace",
      "raw_owner_confirmation_note",
      "owner_private_note",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const submissionReceivedRequested = source.owner_submission_received === true || source.submission_received === true;
  const submissionAcceptedRequested = source.owner_submission_accepted === true || source.submission_accepted === true || source.owner_submission_status === "accepted";
  const fileReadRequested = source.actual_file_read === true || source.file_content_read === true || source.file_path_read === true;
  const fileReferenceAcceptedRequested = source.actual_file_reference_accepted === true || source.actual_file_path_accepted === true || source.actual_file_path_value !== undefined;
  const fileContentAcceptedRequested = source.actual_file_content_accepted === true || source.actual_file_content !== undefined || source.raw_jsonl_body !== undefined || source.raw_csv_body !== undefined;
  const actualContentRequested = source.actual_row_content_accepted === true || source.raw_dataset_row_body !== undefined || source.raw_row_body !== undefined || source.dataset_row !== undefined || source.row !== undefined;
  const actualIngestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const rowBodyReadRequested = source.row_body_read === true || source.file_content_read === true;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true || source.unsupported_motion_runtime_claim === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const trustedLoaderRequested = source.trusted_loader_allowlist_enabled === true || source.trustedLoaderAllowlistEnabled === true || source.loader_trusted === true;
  const blockedReasons = [
    "submission_rejection_fixture_pack_planning_only",
    "submission_rejection_fixture_pack_synthetic_only",
    "submission_rejection_fixture_pack_rejection_fixture_only",
    "submission_rejection_fixture_pack_no_submission_accepted",
    "submission_rejection_fixture_pack_no_actual_file_read",
    "submission_rejection_fixture_pack_no_actual_row_content",
    "submission_rejection_fixture_pack_no_real_row_ingestion",
    "submission_rejection_fixture_pack_no_row_body_read",
    "submission_rejection_fixture_pack_owner_confirmation_required",
    "submission_rejection_fixture_pack_priority1_blocked",
    "submission_rejection_fixture_pack_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("submission_rejection_fixture_pack_rejected_unsafe_material");
  if (submissionReceivedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_submission_received");
  if (submissionAcceptedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_submission_acceptance");
  if (fileReadRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_file_read");
  if (fileReferenceAcceptedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_file_reference");
  if (fileContentAcceptedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_file_content");
  if (actualContentRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_row_content");
  if (actualIngestionRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_actual_ingestion_request");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_real_row_or_checked_count");
  if (rowBodyReadRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_row_body_read");
  if (motionExecutionRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_go_or_blocker_resolution");
  if (trustedLoaderRequested) blockedReasons.push("submission_rejection_fixture_pack_rejected_trusted_loader_request");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SCHEMA,
    safe_summary_only: true,
    motion_dataset_owner_row_data_submission_rejection_fixture_pack_status: "planning_only_blocked",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    rejection_fixture_pack_only_boundary: true,
    no_submission_accepted_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    synthetic_only: true,
    rejection_fixture_pack_only: true,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_file_read: false,
    actual_file_reference_accepted: false,
    actual_file_content_accepted: false,
    actual_row_content_accepted: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    row_body_read: false,
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    trusted_loader_allowlist_enabled: false,
    no_loader_trusted: true,
    accepted_safe_rejection_fixture_cases: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_ACCEPTED_CASES],
    rejected_submission_attempt_cases: [...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_ATTEMPT_CASES],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "prepare_synthetic_rejection_fixtures_without_file_or_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      synthetic_only: true,
      rejection_fixture_pack_only: true,
      no_submission_accepted: true,
      no_actual_file_read: true,
      no_actual_file_reference_accepted: true,
      no_actual_file_content_accepted: true,
      no_actual_row_content: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_trusted_loader_enablement: true,
      no_dataset_row_body_public: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset owner row data submission rejection fixture pack summary");
  return summary;
}

export function createMotionDatasetActualDataTaskEntryGateSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      ...LIVE2D_MOTION_DATASET_OWNER_ROW_DATA_SUBMISSION_REJECTED_FIELDS,
      "actual_file_path_value",
      "actual_file_content",
      "raw_jsonl_body",
      "raw_csv_body",
      "raw_dataset_row_body",
      "raw_row_body",
      "raw_cue_payload",
      "raw_renderer_payload",
      "owner_private_note",
      "raw_owner_confirmation_note",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const actualDataTaskRequested = source.actual_data_task_started === true || source.actual_data_task_approved === true;
  const submissionRequested = source.owner_submission_received === true || source.owner_submission_accepted === true || source.submission_accepted === true;
  const fileReadRequested = source.actual_file_read === true || source.file_content_read === true || source.actual_file_content !== undefined || source.actual_file_path_value !== undefined;
  const hashRequested = source.actual_hash_calculated === true || source.hash_calculated === true;
  const rowContentRequested = source.actual_row_content_accepted === true || source.row !== undefined || source.dataset_row !== undefined || source.raw_dataset_row_body !== undefined;
  const ingestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true || source.ingest_rows === true;
  const parserRequested = source.row_body_parser_enabled === true || source.row_body_parser_executed === true || source.row_body_read === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true || source.execute_motion === true;
  const readinessRequested = source.renderer_ready === true || source.model_loaded === true || source.scene_loaded === true || source.browser_cue_delivery_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const goRequested = source.go_nogo_status === "go" || source.go_candidate === true || source.approve_go === true;
  const blockedReasons = [
    "actual_data_task_entry_gate_planning_only",
    "actual_data_task_entry_gate_no_actual_data_task_started",
    "actual_data_task_entry_gate_no_submission_accepted",
    "actual_data_task_entry_gate_no_actual_file_read",
    "actual_data_task_entry_gate_no_actual_hash_calculation",
    "actual_data_task_entry_gate_no_actual_row_content",
    "actual_data_task_entry_gate_no_parser_execution",
    "actual_data_task_entry_gate_no_real_row_ingestion",
    "actual_data_task_entry_gate_owner_confirmation_required",
    "actual_data_task_entry_gate_priority1_blocked",
    "actual_data_task_entry_gate_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("actual_data_task_entry_gate_rejected_unsafe_material");
  if (actualDataTaskRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_actual_task_start");
  if (submissionRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_submission_state");
  if (fileReadRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_file_access");
  if (hashRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_hash_calculation");
  if (rowContentRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_row_content");
  if (ingestionRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_ingestion");
  if (parserRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_parser_execution");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_real_row_or_checked_count");
  if (motionExecutionRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_priority1_resolution");
  if (goRequested) blockedReasons.push("actual_data_task_entry_gate_rejected_go_or_blocker_resolution");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_SCHEMA,
    safe_summary_only: true,
    motion_dataset_actual_data_task_entry_gate_status: "planning_only_blocked",
    planning_only_boundary: true,
    entry_gate_only_boundary: true,
    no_actual_data_task_started_boundary: true,
    no_submission_accepted_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_hash_calculation_boundary: true,
    no_actual_row_content_boundary: true,
    no_parser_execution_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    entry_gate_only: true,
    actual_data_task_started: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_file_read: false,
    actual_hash_calculated: false,
    actual_row_content_accepted: false,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    row_body_read: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    priority1_status: "BLOCKED",
    owner_confirmation_required: true,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_entry_prerequisites: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_REQUIRED_PREREQUISITES],
    required_blocking_conditions: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_ENTRY_GATE_BLOCKING_CONDITIONS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    decision_capsule_machine_source_preserved: true,
    pr_body_human_summary_only: true,
    safe_next_action: "future_owner_confirmed_actual_data_task_required_before_row_intake",
    boundary_policy: {
      ...createBoundaryPolicy(),
      entry_gate_only: true,
      no_actual_data_task_started: true,
      no_submission_accepted: true,
      no_actual_file_read: true,
      no_actual_hash_calculation: true,
      no_actual_row_content: true,
      no_parser_execution: true,
      no_actual_ingestion_allowed: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset actual data task entry gate summary");
  return summary;
}

export function createMotionDatasetRowBodyParserContractStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rawFields = [
    ...detectedMotionDatasetRawFields(source),
    ...detectedRejectedRequestFields(source, [
      "raw_jsonl_body",
      "raw_csv_body",
      "raw_dataset_row_body",
      "raw_row_body",
      "actual_file_content",
      "actual_file_path_value",
      "raw_cue_payload",
      "raw_renderer_payload",
      "raw_model_path",
      "raw_motion_path",
      "endpoint_value",
      "token_value",
      "secret_value",
      "private_local_path",
      "world_command",
      "obs_command",
      "game_input",
      "os_command",
      "memory_commit",
      "relationship_commit",
      "owner_private_note",
      "raw_owner_confirmation_note",
    ]),
  ];
  const safeRejectedFieldLabels = [...new Set(rawFields)]
    .map((field) => safeOwnerRowSubmissionRejectedFieldLabel(field))
    .filter(Boolean)
    .sort();
  const parserRequested = source.row_body_parser_enabled === true || source.row_body_parser_executed === true || source.parser_executed === true;
  const rowBodyReadRequested = source.row_body_read === true || source.raw_jsonl_body !== undefined || source.raw_csv_body !== undefined || source.raw_dataset_row_body !== undefined;
  const rowContentRequested = source.actual_row_content_accepted === true || source.row !== undefined || source.dataset_row !== undefined;
  const ingestionRequested = source.actual_ingestion_allowed === true || source.ingestion_approved === true;
  const realRowRequested = source.real_row_data_present === true || source.row_data_present === true;
  const checkedRowCountRequested = Number.isSafeInteger(source.checked_row_count) && source.checked_row_count > 0;
  const motionExecutionRequested = source.motion_dataset_executable === true || source.motion_execution_enabled === true;
  const readinessRequested = source.renderer_ready === true || source.runtime_readiness_claimed === true || source.production_readiness_claimed === true;
  const ownerConfirmationRequested = source.owner_confirmation_created === true || source.owner_confirmation_confirmed === true || source.owner_confirmation_status === "confirmed";
  const priorityResolvedRequested = source.priority1_status === "RESOLVED" || source.priority1_resolved === true || source.blocker_resolved === true;
  const blockedReasons = [
    "row_body_parser_contract_stub_planning_only",
    "row_body_parser_contract_stub_no_parser_execution",
    "row_body_parser_contract_stub_no_actual_row_content",
    "row_body_parser_contract_stub_no_real_row_ingestion",
    "row_body_parser_contract_stub_no_row_body_read",
    "row_body_parser_contract_stub_priority1_blocked",
    "row_body_parser_contract_stub_go_nogo_no_go",
  ];
  if (rawFields.length) blockedReasons.push("row_body_parser_contract_stub_rejected_unsafe_material");
  if (parserRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_parser_execution");
  if (rowBodyReadRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_row_body_read");
  if (rowContentRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_actual_row_content");
  if (ingestionRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_ingestion");
  if (realRowRequested || checkedRowCountRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_real_row_or_checked_count");
  if (motionExecutionRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_motion_execution");
  if (readinessRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_readiness_claim");
  if (ownerConfirmationRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_owner_confirmation");
  if (priorityResolvedRequested) blockedReasons.push("row_body_parser_contract_stub_rejected_priority1_resolution");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SCHEMA,
    safe_summary_only: true,
    motion_dataset_row_body_parser_contract_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    parser_contract_stub_only_boundary: true,
    no_parser_execution_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_motion_execution_boundary: true,
    no_readiness_boundary: true,
    parser_contract_stub_only: true,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    motion_dataset_executable: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_future_parser_fields: [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_REQUIRED_FIELDS],
    required_future_parser_rejection_reasons: [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_CONTRACT_STUB_SAFE_PUBLIC_REJECTION_REASONS],
    detected_rejected_sensitive_material_labels: safeRejectedFieldLabels,
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_parser_implementation_required_before_row_body_read",
    boundary_policy: {
      ...createBoundaryPolicy(),
      parser_contract_stub_only: true,
      no_parser_execution: true,
      no_actual_row_content: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset row body parser contract stub summary");
  return summary;
}

export function createMotionDatasetRowBodyParserRejectionFixturePackSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.row_body_parser_enabled ||
      source.row_body_parser_executed ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "parser_rejection_fixture_pack_synthetic_only",
    "parser_rejection_fixture_pack_no_parser_execution",
    "parser_rejection_fixture_pack_no_actual_row_content",
    "parser_rejection_fixture_pack_no_real_row_ingestion",
    "parser_rejection_fixture_pack_no_row_body_read",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("parser_rejection_fixture_pack_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SCHEMA,
    motion_dataset_row_body_parser_rejection_fixture_pack_status: "planning_only_blocked",
    planning_only_boundary: true,
    synthetic_only_boundary: true,
    parser_rejection_fixture_pack_only_boundary: true,
    no_parser_execution_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    synthetic_only: true,
    parser_rejection_fixture_pack_only: true,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
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
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    accepted_parser_rejection_fixture_cases: [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_ACCEPTED_CASES],
    rejected_parser_input_attempt_cases: [...LIVE2D_MOTION_DATASET_ROW_BODY_PARSER_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_REJECTED_INPUT_ATTEMPT_CASES],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_parser_execution_required_before_actual_row_content",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      synthetic_only: true,
      parser_rejection_fixture_pack_only: true,
      no_parser_execution: true,
      no_actual_row_content: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset row body parser rejection fixture pack summary");
  return summary;
}

export function createMotionDatasetIngestionAuditTrailStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.real_ingestion_audit_event_created ||
      source.actual_data_task_started ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "ingestion_audit_trail_stub_planning_only",
    "ingestion_audit_trail_stub_no_real_ingestion_audit_event",
    "ingestion_audit_trail_stub_no_real_row_ingestion",
    "ingestion_audit_trail_stub_no_row_body_read",
    "ingestion_audit_trail_stub_priority1_blocked",
    "ingestion_audit_trail_stub_motion_dataset_non_executable",
    "ingestion_audit_trail_stub_no_go_preserved",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("ingestion_audit_trail_stub_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_SCHEMA,
    motion_dataset_ingestion_audit_trail_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    audit_trail_stub_only_boundary: true,
    no_real_ingestion_audit_event_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    audit_trail_stub_only: true,
    real_ingestion_audit_event_created: false,
    actual_data_task_started: false,
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
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_future_audit_event_fields: [...LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REQUIRED_EVENT_FIELDS],
    required_audit_redaction_policy: [...LIVE2D_MOTION_DATASET_INGESTION_AUDIT_TRAIL_STUB_REDACTION_POLICY],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_task_required_before_real_ingestion_audit_event",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      audit_trail_stub_only: true,
      no_real_ingestion_audit_event: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset ingestion audit trail stub summary");
  return summary;
}

export function createMotionDatasetIngestionRollbackPlanStubSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.rollback_ready ||
      source.rollback_snapshot_created ||
      source.rollback_plan_approved ||
      source.real_ingestion_audit_event_created ||
      source.actual_data_task_started ||
      source.real_row_data_present ||
      source.row_body_read ||
      source.actual_ingestion_allowed ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "rollback_plan_stub_planning_only",
    "rollback_plan_stub_not_rollback_ready",
    "rollback_plan_stub_no_real_row_ingestion",
    "rollback_plan_stub_no_row_body_read",
    "rollback_plan_stub_priority1_blocked",
    "rollback_plan_stub_motion_dataset_non_executable",
    "rollback_plan_stub_no_go_preserved",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("rollback_plan_stub_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_SCHEMA,
    motion_dataset_ingestion_rollback_plan_stub_status: "planning_only_blocked",
    planning_only_boundary: true,
    rollback_plan_stub_only_boundary: true,
    no_rollback_ready_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    rollback_plan_stub_only: true,
    rollback_ready: false,
    rollback_snapshot_created: false,
    rollback_plan_approved: false,
    real_ingestion_audit_event_created: false,
    actual_data_task_started: false,
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
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_future_rollback_fields: [...LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_REQUIRED_FIELDS],
    required_rollback_blockers: [...LIVE2D_MOTION_DATASET_INGESTION_ROLLBACK_PLAN_STUB_BLOCKERS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_task_required_before_rollback_readiness",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      rollback_plan_stub_only: true,
      no_rollback_ready: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset ingestion rollback plan stub summary");
  return summary;
}

function createMotionDatasetPlanningOnlyGateSummary({ schema, statusKey, status, boundaries = {}, flags = {}, arrays = {}, blockedReasons = [], safeNextAction, context }, input = {}) {
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










export function createMotionDatasetOwnerSubmissionFormSpecSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_SPEC_SCHEMA,
    statusKey: "motion_dataset_owner_submission_form_spec_status",
    status: "planning_only_blocked",
    boundaries: {
      owner_submission_form_spec_only_boundary: true,
      no_real_data_accepted_boundary: true,
      no_owner_confirmation_created_boundary: true,
      owner_submission_form_spec_only: true,
    },
    flags: {
      owner_submission_form_accepts_real_data: false,
      owner_confirmation_confirmed: false,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
    },
    arrays: {
      required_form_fields: [...LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_REQUIRED_FIELDS],
      rejected_form_fields: [...LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_FORM_REJECTED_FIELDS],
    },
    blockedReasons: [
      "owner_submission_form_spec_planning_only",
      "owner_submission_form_spec_no_real_data_accepted",
      "owner_submission_form_spec_no_owner_confirmation_created",
      "owner_submission_form_spec_priority1_blocked",
    ],
    safeNextAction: "future_owner_submission_must_use_safe_labels_only",
    context: "motion dataset owner submission form spec summary",
  }, input);
}

export function createMotionDatasetRealRowRedactionPolicyMatrixSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_MATRIX_SCHEMA,
    statusKey: "motion_dataset_real_row_redaction_policy_matrix_status",
    status: "planning_only_blocked",
    boundaries: {
      redaction_policy_matrix_only_boundary: true,
      no_redaction_scan_executed_boundary: true,
      no_real_row_ingestion_boundary: true,
      redaction_policy_matrix_only: true,
    },
    flags: {
      redaction_policy_matrix_only: true,
      redaction_scan_executed: false,
      redaction_policy_matrix_claims_scan_complete: false,
      actual_file_read: false,
      actual_row_content_accepted: false,
      actual_ingestion_allowed: false,
    },
    arrays: {
      required_redaction_categories: [...LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_CATEGORIES],
      required_redaction_actions: [...LIVE2D_MOTION_DATASET_REAL_ROW_REDACTION_POLICY_ACTIONS],
    },
    blockedReasons: [
      "real_row_redaction_policy_matrix_planning_only",
      "real_row_redaction_policy_matrix_no_scan_executed",
      "real_row_redaction_policy_matrix_no_actual_row_content",
      "real_row_redaction_policy_matrix_priority1_blocked",
    ],
    safeNextAction: "future_owner_data_submission_requires_separate_redaction_scan_task",
    context: "motion dataset real row redaction policy matrix summary",
  }, input);
}

export function createMotionDatasetMotionAllowlistSyncReviewSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_MOTION_ALLOWLIST_SYNC_REVIEW_SCHEMA,
    statusKey: "motion_dataset_motion_allowlist_sync_review_status",
    status: "planning_only_blocked",
    boundaries: {
      motion_allowlist_sync_review_only_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      motion_allowlist_sync_review_only: true,
    },
    flags: {
      motion_allowlist_sync_review_only: true,
      motion_allowlist_sync_claims_runtime_enabled: false,
      motion_dataset_executable: false,
      actual_ingestion_allowed: false,
    },
    arrays: {
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
      experimental_review_only_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
      required_motion_label_rejection_reasons: [...LIVE2D_MOTION_DATASET_MOTION_ALLOWLIST_SYNC_REJECTION_REASONS],
    },
    blockedReasons: [
      "motion_allowlist_sync_review_planning_only",
      "motion_allowlist_sync_review_no_motion_execution",
      "motion_allowlist_sync_review_no_runtime_enablement",
      "motion_allowlist_sync_review_priority1_blocked",
    ],
    safeNextAction: "keep_experimental_motion_labels_review_only_until_renderer_support_exists",
    context: "motion dataset motion allowlist sync review summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortSpecSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_SPEC_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_spec_status",
    status: "spec_only_blocked",
    boundaries: {
      motion_identity_and_comfort_spec_only_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      motion_allowlist_alone_not_executable: true,
    },
    flags: {
      motion_identity_and_comfort_spec_only: true,
      motion_allowlist_alone_is_executable_readiness: false,
      experimental_labels_are_executable_motion: false,
      expression_gaze_breath_body_camera_labels_are_runtime_motion: false,
      fixture_pass_is_real_ready: false,
      manifest_only_is_real_ready: false,
      sse_connected_is_real_ready: false,
      cue_accepted_is_last_cue_applied: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      spec_sections: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_SPEC_SECTIONS],
      motion_identity_profile_required_fields: [...LIVE2D_MOTION_IDENTITY_PROFILE_REQUIRED_FIELDS],
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
      experimental_review_only_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      required_identity_comfort_rules: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_RULES],
    },
    blockedReasons: [
      "motion_identity_and_comfort_spec_only",
      "motion_allowlist_alone_not_executable",
      "experimental_labels_review_only",
      "strong_motion_requires_recovery_and_cooldown",
      "comfort_visibility_gaze_persona_checks_required",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_synthetic_rejection_fixture_pack_for_motion_identity_and_comfort",
    context: "live2d motion identity and comfort spec summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortRejectionFixturePackSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_REJECTION_FIXTURE_PACK_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_rejection_fixture_pack_status",
    status: "fixture_only_blocked",
    boundaries: {
      motion_identity_and_comfort_rejection_fixture_pack_only_boundary: true,
      synthetic_fixture_only_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_and_comfort_rejection_fixture_pack_only: true,
      synthetic_fixture_only: true,
      rejected_fixture_attempts_only: true,
      motion_allowlist_alone_is_executable_readiness: false,
      experimental_labels_are_executable_motion: false,
      expression_gaze_breath_body_camera_labels_are_runtime_motion: false,
      strong_motion_without_recovery_allowed: false,
      strong_motion_without_cooldown_allowed: false,
      stale_cue_strong_motion_allowed: false,
      comfort_risk_strong_motion_allowed: false,
      subtitle_overlay_risk_strong_motion_allowed: false,
      gaze_pressure_closeup_escalation_allowed: false,
      donation_relation_dependency_escalation_allowed: false,
      dependency_pressure_allowed: false,
      voice_motion_sync_executes_motion: false,
      adaptive_reaction_unbounded: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      accepted_fixture_cases: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_ACCEPTED_FIXTURE_CASES],
      rejected_fixture_cases: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_REJECTED_FIXTURE_CASES],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      required_identity_comfort_rules: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_RULES],
    },
    blockedReasons: [
      "motion_identity_and_comfort_fixture_only",
      "synthetic_fixture_only",
      "motion_allowlist_alone_not_executable",
      "experimental_labels_review_only",
      "strong_motion_requires_recovery_and_cooldown",
      "stale_or_risky_strong_motion_rejected",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_and_comfort_dry_run_validator",
    context: "live2d motion identity and comfort rejection fixture pack summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortDryRunValidatorSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_DRY_RUN_VALIDATOR_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_dry_run_validator_status",
    status: "dry_run_validator_blocked",
    boundaries: {
      motion_identity_and_comfort_dry_run_validator_only_boundary: true,
      synthetic_dry_run_only_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_and_comfort_dry_run_validator_only: true,
      synthetic_dry_run_only: true,
      dry_run_validator_executes_motion: false,
      dry_run_validator_accepts_actual_data: false,
      strong_motion_without_recovery_allowed: false,
      strong_motion_without_cooldown_allowed: false,
      stale_cue_strong_motion_allowed: false,
      risky_strong_motion_allowed: false,
      donation_relation_dependency_escalation_allowed: false,
      dependency_pressure_allowed: false,
      voice_motion_sync_executes_motion: false,
      adaptive_reaction_unbounded: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      required_input_labels: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_DRY_RUN_REQUIRED_INPUT_LABELS],
      required_rejection_reasons: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_DRY_RUN_REJECTION_REASONS],
      accepted_fixture_cases: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_ACCEPTED_FIXTURE_CASES],
      rejected_fixture_cases: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_REJECTED_FIXTURE_CASES],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
    },
    blockedReasons: [
      "motion_identity_and_comfort_dry_run_validator_only",
      "synthetic_dry_run_only",
      "missing_required_labels_rejected",
      "strong_motion_requires_recovery_and_cooldown",
      "stale_or_risky_strong_motion_rejected",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_and_comfort_recovery_matrix",
    context: "live2d motion identity and comfort dry-run validator summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortRecoveryMatrixSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_RECOVERY_MATRIX_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_recovery_matrix_status",
    status: "matrix_only_blocked",
    boundaries: {
      motion_identity_and_comfort_recovery_matrix_only_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_and_comfort_recovery_matrix_only: true,
      recovery_matrix_executes_motion: false,
      recovery_matrix_claims_runtime_ready: false,
      strong_motion_without_recovery_allowed: false,
      strong_motion_without_cooldown_allowed: false,
      stale_cue_strong_motion_allowed: false,
      risky_strong_motion_allowed: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      recovery_matrix_required_fields: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_RECOVERY_MATRIX_REQUIRED_FIELDS],
      recovery_matrix_rows: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_RECOVERY_MATRIX_ROWS],
      recovery_matrix_blockers: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_RECOVERY_MATRIX_BLOCKERS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    },
    blockedReasons: [
      "motion_identity_and_comfort_recovery_matrix_only",
      "strong_motion_requires_recovery_and_cooldown",
      "risk_downgrade_motion_required",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_and_comfort_context_gate",
    context: "live2d motion identity and comfort recovery matrix summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortContextGateSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_CONTEXT_GATE_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_context_gate_status",
    status: "context_gate_blocked",
    boundaries: {
      motion_identity_and_comfort_context_gate_only_boundary: true,
      context_gate_planning_only_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_and_comfort_context_gate_only: true,
      context_gate_executes_motion: false,
      context_gate_claims_runtime_ready: false,
      stale_context_strong_motion_allowed: false,
      low_confidence_strong_motion_allowed: false,
      viewer_comfort_risk_strong_motion_allowed: false,
      subtitle_visibility_risk_strong_motion_allowed: false,
      camera_proximity_risk_strong_motion_allowed: false,
      donation_relation_dependency_only_escalation_allowed: false,
      dependency_pressure_allowed: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      required_context_gate_labels: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_CONTEXT_GATE_REQUIRED_LABELS],
      required_context_gate_rejections: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_CONTEXT_GATE_REJECTIONS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    },
    blockedReasons: [
      "motion_identity_and_comfort_context_gate_only",
      "context_freshness_required",
      "confidence_required",
      "risk_downgrade_motion_required",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_and_comfort_subtitle_gaze_guard",
    context: "live2d motion identity and comfort context gate summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortSubtitleGazeGuardSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_SUBTITLE_GAZE_GUARD_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_subtitle_gaze_guard_status",
    status: "subtitle_gaze_guard_blocked",
    boundaries: {
      motion_identity_and_comfort_subtitle_gaze_guard_only_boundary: true,
      subtitle_gaze_guard_planning_only_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_and_comfort_subtitle_gaze_guard_only: true,
      subtitle_gaze_guard_executes_motion: false,
      subtitle_gaze_guard_claims_runtime_ready: false,
      subtitle_overlay_risk_strong_motion_allowed: false,
      subtitle_overlay_risk_closeup_allowed: false,
      gaze_pressure_risk_strong_motion_allowed: false,
      gaze_pressure_risk_closeup_allowed: false,
      camera_proximity_risk_strong_motion_allowed: false,
      camera_proximity_risk_closeup_allowed: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      required_subtitle_gaze_labels: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_SUBTITLE_GAZE_REQUIRED_LABELS],
      required_subtitle_gaze_rejections: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_SUBTITLE_GAZE_REJECTIONS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    },
    blockedReasons: [
      "motion_identity_and_comfort_subtitle_gaze_guard_only",
      "subtitle_overlay_risk_requires_downgrade",
      "gaze_pressure_risk_requires_downgrade",
      "camera_proximity_risk_requires_downgrade",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_and_comfort_persona_pressure_guard",
    context: "live2d motion identity and comfort subtitle gaze guard summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortPersonaPressureGuardSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_PERSONA_PRESSURE_GUARD_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_persona_pressure_guard_status",
    status: "persona_pressure_guard_blocked",
    boundaries: {
      motion_identity_and_comfort_persona_pressure_guard_only_boundary: true,
      persona_pressure_guard_planning_only_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_and_comfort_persona_pressure_guard_only: true,
      persona_pressure_guard_executes_motion: false,
      persona_pressure_guard_claims_runtime_ready: false,
      donation_signal_escalates_strong_motion_allowed: false,
      relation_signal_escalates_strong_motion_allowed: false,
      dependency_signal_escalates_strong_motion_allowed: false,
      dependency_pressure_allowed: false,
      persona_fit_claims_relationship_commitment_allowed: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      required_persona_pressure_labels: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_PERSONA_PRESSURE_REQUIRED_LABELS],
      required_persona_pressure_rejections: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_PERSONA_PRESSURE_REJECTIONS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    },
    blockedReasons: [
      "motion_identity_and_comfort_persona_pressure_guard_only",
      "persona_pressure_escalation_rejected",
      "dependency_pressure_rejected",
      "safe_downgrade_motion_required",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_and_comfort_voice_sync_hint_boundary",
    context: "live2d motion identity and comfort persona pressure guard summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortVoiceSyncHintBoundarySummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_VOICE_SYNC_HINT_BOUNDARY_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_voice_sync_hint_boundary_status",
    status: "voice_sync_hint_boundary_blocked",
    boundaries: {
      motion_identity_and_comfort_voice_sync_hint_boundary_only_boundary: true,
      voice_sync_hint_planning_only_boundary: true,
      no_motion_execution_boundary: true,
      no_cue_application_boundary: true,
      no_audio_runtime_execution_boundary: true,
      no_tts_runtime_execution_boundary: true,
      no_external_service_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_and_comfort_voice_sync_hint_boundary_only: true,
      voice_sync_hint_executes_motion: false,
      voice_timing_hint_applies_cue: false,
      voice_sync_hint_claims_runtime_ready: false,
      audio_runtime_execution_allowed: false,
      tts_runtime_execution_allowed: false,
      external_service_allowed: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      required_voice_sync_hint_labels: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_VOICE_SYNC_HINT_REQUIRED_LABELS],
      required_voice_sync_hint_rejections: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_VOICE_SYNC_HINT_REJECTIONS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    },
    blockedReasons: [
      "motion_identity_and_comfort_voice_sync_hint_boundary_only",
      "voice_sync_hint_not_executable",
      "voice_timing_hint_no_cue_application",
      "audio_runtime_execution_blocked",
      "tts_runtime_execution_blocked",
      "external_service_blocked",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_and_comfort_adaptive_bounds",
    context: "live2d motion identity and comfort voice sync hint boundary summary",
  }, input);
}

export function createLive2dMotionIdentityAndComfortAdaptiveBoundsSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_AND_COMFORT_ADAPTIVE_BOUNDS_SCHEMA,
    statusKey: "live2d_motion_identity_and_comfort_adaptive_bounds_status",
    status: "adaptive_bounds_blocked",
    boundaries: {
      motion_identity_and_comfort_adaptive_bounds_only_boundary: true,
      adaptive_bounds_planning_only_boundary: true,
      no_motion_execution_boundary: true,
      no_cue_application_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_and_comfort_adaptive_bounds_only: true,
      adaptive_bounds_executes_motion: false,
      adaptive_bounds_claims_runtime_ready: false,
      adaptive_reaction_unbounded: false,
      repeated_strong_motion_allowed: false,
      low_confidence_escalation_allowed: false,
      stale_context_escalation_allowed: false,
      comfort_risk_escalation_allowed: false,
      serious_focus_playful_motion_allowed: false,
      moderation_limited_personalized_strong_motion_allowed: false,
      crisis_signal_closeup_allowed: false,
      minor_signal_closeup_allowed: false,
      romantic_pressure_closeup_allowed: false,
      dependency_pressure_strong_motion_allowed: false,
      donation_amount_escalates_motion_allowed: false,
      relationship_score_escalates_proximity_allowed: false,
      experimental_motion_labels_executable: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      required_adaptive_bounds_labels: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_ADAPTIVE_BOUNDS_REQUIRED_LABELS],
      required_adaptive_bounds_rejections: [...LIVE2D_MOTION_IDENTITY_AND_COMFORT_ADAPTIVE_BOUNDS_REJECTIONS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
    },
    blockedReasons: [
      "motion_identity_and_comfort_adaptive_bounds_only",
      "adaptive_reaction_must_be_bounded",
      "repeated_strong_motion_requires_cooldown",
      "low_confidence_requires_downgrade",
      "stale_context_requires_downgrade",
      "comfort_risk_requires_downgrade",
      "serious_focus_requires_downgrade",
      "moderation_boundary_requires_safe_motion",
      "crisis_minor_romantic_dependency_closeup_rejected",
      "donation_relation_escalation_rejected",
      "experimental_motion_non_executable",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_and_comfort_final_integration_review",
    context: "live2d motion identity and comfort adaptive bounds summary",
  }, input);
}

export function createLive2dMotionIdentityComfortDevelopmentScheduleSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_development_schedule_status",
    status: "development_schedule_blocked",
    boundaries: {
      motion_identity_comfort_development_schedule_only_boundary: true,
      schedule_planning_only_boundary: true,
      no_motion_execution_boundary: true,
      no_renderer_probe_boundary: true,
      no_owner_confirmation_boundary: true,
      no_runtime_allowlist_enablement_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_actual_data_boundary: true,
    },
    flags: {
      motion_identity_comfort_development_schedule_only: true,
      schedule_executes_motion: false,
      schedule_claims_runtime_ready: false,
      schedule_claims_production_ready: false,
      schedule_creates_owner_confirmation: false,
      future_real_renderer_evidence_phase_started: false,
      future_actual_renderer_probe_phase_started: false,
      future_trusted_loader_phase_started: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      motion_dataset_executable: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
    },
    arrays: {
      motion_identity_comfort_development_schedule_phases: [...LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_PHASES],
      motion_identity_comfort_development_schedule_boundaries: [...LIVE2D_MOTION_IDENTITY_COMFORT_DEVELOPMENT_SCHEDULE_BOUNDARIES],
    },
    blockedReasons: [
      "motion_identity_comfort_development_schedule_only",
      "schedule_is_not_readiness",
      "schedule_is_not_execution",
      "future_real_renderer_evidence_requires_owner_action",
      "future_actual_renderer_probe_requires_owner_confirmation",
      "future_trusted_loader_requires_owner_confirmation_and_real_evidence",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_comfort_completion_review",
    context: "live2d motion identity comfort development schedule summary",
  }, input);
}

export function createLive2dMotionIdentityComfortCompletionReviewSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_completion_review_status",
    status: "completion_review_blocked",
    boundaries: {
      motion_identity_comfort_completion_review_only_boundary: true,
      completion_review_is_not_readiness_boundary: true,
      completion_review_is_not_execution_boundary: true,
      no_renderer_probe_boundary: true,
      no_owner_confirmation_boundary: true,
      no_trusted_loader_enablement_boundary: true,
      no_actual_data_boundary: true,
      no_priority1_resolution_boundary: true,
    },
    flags: {
      motion_identity_comfort_completion_review_only: true,
      completion_review_claims_runtime_ready: false,
      completion_review_claims_production_ready: false,
      completion_review_creates_owner_confirmation: false,
      completion_review_starts_actual_renderer_probe: false,
      completion_review_accepts_actual_data: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      priority1_resolved: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      motion_identity_comfort_completed_safe_items: [...LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_COMPLETED_ITEMS],
      motion_identity_comfort_open_blockers: [...LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_OPEN_BLOCKERS],
      motion_identity_comfort_completion_review_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_COMPLETION_REVIEW_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_completion_review_only",
      "completion_review_is_not_readiness",
      "completion_review_is_not_execution",
      "actual_renderer_evidence_missing",
      "actual_cue_application_evidence_missing",
      "owner_confirmation_missing",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "continue_safe_motion_identity_comfort_blocker_review_or_wait_for_owner_action",
    context: "live2d motion identity comfort completion review summary",
  }, input);
}

export function createLive2dMotionIdentityProfileStatusSurfaceSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_PROFILE_STATUS_SURFACE_SCHEMA,
    statusKey: "live2d_motion_identity_profile_status_surface_status",
    status: "identity_profile_status_surface_blocked",
    boundaries: {
      motion_identity_profile_status_surface_only_boundary: true,
      safe_labels_only_boundary: true,
      no_motion_execution_boundary: true,
      no_renderer_material_boundary: true,
      no_owner_confirmation_boundary: true,
      no_trusted_loader_enablement_boundary: true,
      no_actual_data_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_profile_status_surface_only: true,
      identity_profile_present: true,
      safe_labels_only: true,
      identity_profile_executes_motion: false,
      identity_profile_claims_runtime_ready: false,
      identity_profile_claims_production_ready: false,
      experimental_labels_executable: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      motion_identity_profile_status_safe_labels: [...LIVE2D_MOTION_IDENTITY_PROFILE_STATUS_SAFE_LABELS],
      motion_identity_profile_status_rejections: [...LIVE2D_MOTION_IDENTITY_PROFILE_STATUS_REJECTIONS],
      runtime_supported_motion_styles: [...LIVE2D_RUNTIME_SUPPORTED_MOTION_STYLES],
      experimental_motion_labels: [...LIVE2D_EXPERIMENTAL_MOTION_LABELS],
    },
    blockedReasons: [
      "motion_identity_profile_status_surface_only",
      "identity_profile_is_not_execution",
      "identity_profile_is_not_readiness",
      "experimental_labels_non_executable",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_comfort_policy_status_surface",
    context: "live2d motion identity profile status surface summary",
  }, input);
}

export function createLive2dMotionComfortPolicyStatusSurfaceSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_COMFORT_POLICY_STATUS_SURFACE_SCHEMA,
    statusKey: "live2d_motion_comfort_policy_status_surface_status",
    status: "comfort_policy_status_surface_blocked",
    boundaries: {
      motion_comfort_policy_status_surface_only_boundary: true,
      comfort_policy_is_not_execution_boundary: true,
      strong_motion_not_executable_by_policy_boundary: true,
      no_renderer_probe_boundary: true,
      no_owner_confirmation_boundary: true,
      no_trusted_loader_enablement_boundary: true,
      no_actual_data_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_comfort_policy_status_surface_only: true,
      comfort_policy_present: true,
      comfort_policy_executes_motion: false,
      comfort_policy_marks_strong_motion_ready: false,
      viewer_comfort_mode_downgrades_strong_motion: true,
      cooldown_required_for_strong_motion: true,
      fatigue_risk_downgrades_strong_motion: true,
      photosensitivity_risk_downgrades_strong_motion: true,
      subtitle_gaze_camera_risk_downgrades_strong_motion: true,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      motion_comfort_policy_status_labels: [...LIVE2D_MOTION_COMFORT_POLICY_STATUS_LABELS],
      motion_comfort_policy_status_rejections: [...LIVE2D_MOTION_COMFORT_POLICY_STATUS_REJECTIONS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
    },
    blockedReasons: [
      "motion_comfort_policy_status_surface_only",
      "comfort_policy_is_not_execution",
      "strong_motion_not_executable_by_policy_alone",
      "viewer_comfort_risk_requires_downgrade",
      "cooldown_required_for_strong_motion",
      "fatigue_risk_requires_downgrade",
      "photosensitivity_risk_requires_downgrade",
      "subtitle_gaze_camera_risk_requires_downgrade",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_freshness_policy_cross_surface_consistency",
    context: "live2d motion comfort policy status surface summary",
  }, input);
}

export function createLive2dMotionFreshnessPolicyCrossSurfaceConsistencySummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_FRESHNESS_POLICY_CROSS_SURFACE_CONSISTENCY_SCHEMA,
    statusKey: "live2d_motion_freshness_policy_cross_surface_consistency_status",
    status: "freshness_policy_cross_surface_consistency_blocked",
    boundaries: {
      motion_freshness_policy_cross_surface_consistency_only_boundary: true,
      cross_surface_consistency_only_boundary: true,
      no_motion_execution_boundary: true,
      no_cue_application_boundary: true,
      no_renderer_probe_boundary: true,
      no_actual_data_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_freshness_policy_cross_surface_consistency_only: true,
      stale_cue_strong_motion_rejected_across_surfaces: true,
      safe_downgrade_same_meaning_across_surfaces: true,
      freshness_policy_executes_motion: false,
      freshness_policy_applies_cue: false,
      freshness_policy_claims_runtime_ready: false,
      freshness_policy_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      freshness_policy_surfaces: [...LIVE2D_MOTION_FRESHNESS_POLICY_SURFACES],
      freshness_policy_rejections: [...LIVE2D_MOTION_FRESHNESS_POLICY_REJECTIONS],
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
    },
    blockedReasons: [
      "motion_freshness_policy_cross_surface_consistency_only",
      "stale_cue_strong_motion_rejected_across_surfaces",
      "safe_downgrade_same_meaning_required",
      "freshness_policy_is_not_execution",
      "freshness_policy_is_not_readiness",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_strong_motion_unsafe_override_rejection",
    context: "live2d motion freshness policy cross surface consistency summary",
  }, input);
}

export function createLive2dMotionStrongMotionUnsafeOverrideRejectionSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_STRONG_MOTION_UNSAFE_OVERRIDE_REJECTION_SCHEMA,
    statusKey: "live2d_motion_strong_motion_unsafe_override_rejection_status",
    status: "strong_motion_unsafe_override_rejected",
    boundaries: {
      strong_motion_unsafe_override_rejection_only_boundary: true,
      no_motion_execution_boundary: true,
      no_cue_application_boundary: true,
      no_renderer_probe_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_trusted_loader_enablement_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      strong_motion_unsafe_override_rejection_only: true,
      surprise_scream_executable: false,
      happy_dance_executable: false,
      laugh_big_recovery_required: true,
      happy_loud_sing_cooldown_required: true,
      strong_motion_ready: false,
      strong_motion_downgraded_or_rejected: true,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      strong_motion_labels: [...LIVE2D_STRONG_MOTION_LABELS],
      strong_motion_unsafe_override_rejections: [...LIVE2D_MOTION_STRONG_MOTION_UNSAFE_OVERRIDE_REJECTIONS],
    },
    blockedReasons: [
      "strong_motion_unsafe_override_rejection_only",
      "strong_motion_override_rejected",
      "strong_motion_requires_recovery_and_cooldown",
      "strong_motion_is_not_readiness",
      "renderer_ready_claim_rejected",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_comfort_redaction_sweep",
    context: "live2d motion strong motion unsafe override rejection summary",
  }, input);
}

export function createLive2dMotionIdentityComfortRedactionSweepSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_REDACTION_SWEEP_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_redaction_sweep_status",
    status: "redaction_sweep_safe_summary_blocked",
    boundaries: {
      motion_identity_comfort_redaction_sweep_only_boundary: true,
      safe_summary_only_boundary: true,
      no_redaction_scan_execution_boundary: true,
      no_motion_execution_boundary: true,
      no_renderer_probe_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_redaction_sweep_only: true,
      safe_summary_only: true,
      redaction_sweep_executes_scan: false,
      network_locator_value_leak: false,
      auth_material_leak: false,
      renderer_material_leak: false,
      cue_material_leak: false,
      model_locator_value_leak: false,
      motion_locator_value_leak: false,
      runtime_material_leak: false,
      operator_note_material_leak: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      redaction_sweep_surfaces: [...LIVE2D_MOTION_IDENTITY_COMFORT_REDACTION_SWEEP_SURFACES],
      redaction_sweep_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_REDACTION_SWEEP_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_redaction_sweep_only",
      "safe_summary_only",
      "redaction_scan_not_executed",
      "unsafe_material_not_reflected",
      "redaction_sweep_is_not_readiness",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_comfort_no_sweetening_sweep",
    context: "live2d motion identity comfort redaction sweep summary",
  }, input);
}

export function createLive2dMotionIdentityComfortNoSweeteningSweepSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_no_sweetening_sweep_status",
    status: "no_sweetening_sweep_blocked",
    boundaries: {
      motion_identity_comfort_no_sweetening_sweep_only_boundary: true,
      no_readiness_sweetening_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_motion_executable_boundary: true,
      no_owner_confirmation_boundary: true,
      no_actual_data_boundary: true,
      no_trusted_loader_enablement_boundary: true,
    },
    flags: {
      motion_identity_comfort_no_sweetening_sweep_only: true,
      spec_completion_is_runtime_readiness: false,
      fixture_pass_is_runtime_readiness: false,
      dry_run_pass_is_runtime_readiness: false,
      schedule_update_is_runtime_readiness: false,
      completion_review_is_runtime_readiness: false,
      status_surface_executes_motion: false,
      experimental_labels_executable: false,
      runtime_motion_executable: false,
      strong_motion_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      no_sweetening_inputs: [...LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_INPUTS],
      no_sweetening_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_NO_SWEETENING_SWEEP_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_no_sweetening_sweep_only",
      "spec_completion_is_not_readiness",
      "fixture_pass_is_not_readiness",
      "dry_run_pass_is_not_readiness",
      "schedule_update_is_not_readiness",
      "status_surface_is_not_execution",
      "experimental_labels_non_executable",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_comfort_implementation_gap_audit",
    context: "live2d motion identity comfort no sweetening sweep summary",
  }, input);
}

export function createLive2dMotionIdentityComfortImplementationGapAuditSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_AUDIT_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_implementation_gap_audit_status",
    status: "implementation_gap_audit_blocked",
    boundaries: {
      motion_identity_comfort_implementation_gap_audit_only_boundary: true,
      safe_gap_summary_only_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_model_scene_load_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_implementation_gap_audit_only: true,
      safe_gap_summary_only: true,
      gap_audit_executes_renderer: false,
      gap_audit_applies_cue: false,
      gap_audit_loads_model: false,
      gap_audit_loads_scene: false,
      gap_audit_claims_runtime_ready: false,
      gap_audit_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      implementation_gap_audit_items: [...LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_AUDIT_ITEMS],
      implementation_gap_audit_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_AUDIT_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_implementation_gap_audit_only",
      "real_renderer_evidence_missing",
      "actual_cue_application_evidence_missing",
      "real_model_scene_evidence_missing",
      "owner_confirmation_missing",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_comfort_implementation_gap_register",
    context: "live2d motion identity comfort implementation gap audit summary",
  }, input);
}

export function createLive2dMotionIdentityComfortImplementationGapRegisterSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_REGISTER_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_implementation_gap_register_status",
    status: "implementation_gap_register_blocked",
    boundaries: {
      motion_identity_comfort_implementation_gap_register_only_boundary: true,
      safe_gap_register_only_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_model_scene_load_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_implementation_gap_register_only: true,
      safe_gap_register_only: true,
      gap_register_executes_renderer: false,
      gap_register_applies_cue: false,
      gap_register_loads_model: false,
      gap_register_loads_scene: false,
      gap_register_claims_runtime_ready: false,
      gap_register_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      implementation_gap_register_categories: [...LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_REGISTER_CATEGORIES],
      implementation_gap_register_actions: [...LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_REGISTER_ACTIONS],
      implementation_gap_register_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_IMPLEMENTATION_GAP_REGISTER_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_implementation_gap_register_only",
      "renderer_evidence_gap_open",
      "cue_application_gap_open",
      "model_scene_evidence_gap_open",
      "owner_confirmation_gap_open",
      "trusted_loader_gap_open",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_final_long_continuation_review2",
    context: "live2d motion identity comfort implementation gap register summary",
  }, input);
}

export function createLive2dMotionIdentityComfortFinalLongContinuationReview2Summary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_LONG_CONTINUATION_REVIEW2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_final_long_continuation_review2_status",
    status: "final_long_continuation_review2_blocked",
    boundaries: {
      motion_identity_comfort_final_long_continuation_review2_only_boundary: true,
      safe_review_summary_only_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_model_scene_load_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_final_long_continuation_review2_only: true,
      safe_review_summary_only: true,
      review2_executes_renderer: false,
      review2_applies_cue: false,
      review2_loads_model: false,
      review2_loads_scene: false,
      review2_claims_runtime_ready: false,
      review2_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      final_long_continuation_review2_completed_items: [...LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_LONG_CONTINUATION_REVIEW2_COMPLETED_ITEMS],
      final_long_continuation_review2_open_blockers: [...LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_LONG_CONTINUATION_REVIEW2_OPEN_BLOCKERS],
      final_long_continuation_review2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_LONG_CONTINUATION_REVIEW2_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_final_long_continuation_review2_only",
      "real_renderer_evidence_missing",
      "actual_cue_application_evidence_missing",
      "real_model_scene_evidence_missing",
      "owner_confirmation_missing",
      "trusted_loader_disabled",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "readiness_claims_false",
    ],
    safeNextAction: "continue_safe_only_motion_identity_comfort_followup",
    context: "live2d motion identity comfort final long continuation review2 summary",
  }, input);
}

export function createLive2dMotionIdentityComfortLongContinuationCompletionReview3(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_LONG_CONTINUATION_COMPLETION_REVIEW3_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_long_continuation_completion_review3_status",
    status: "long_continuation_completion_review3_blocked",
    boundaries: {
      motion_identity_comfort_long_continuation_completion_review3_only_boundary: true,
      safe_review_summary_only_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_model_scene_load_boundary: true,
      no_audit_execution_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_long_continuation_completion_review3_only: true,
      safe_review_summary_only: true,
      review3_executes_renderer: false,
      review3_applies_cue: false,
      review3_loads_model: false,
      review3_loads_scene: false,
      review3_executes_audit: false,
      review3_claims_runtime_ready: false,
      review3_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      long_continuation_completion_review3_completed_items: [...LIVE2D_MOTION_IDENTITY_COMFORT_LONG_CONTINUATION_COMPLETION_REVIEW3_COMPLETED_ITEMS],
      long_continuation_completion_review3_open_blockers: [...LIVE2D_MOTION_IDENTITY_COMFORT_LONG_CONTINUATION_COMPLETION_REVIEW3_OPEN_BLOCKERS],
      long_continuation_completion_review3_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_LONG_CONTINUATION_COMPLETION_REVIEW3_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_long_continuation_completion_review3_only",
      "real_renderer_evidence_missing",
      "actual_cue_application_evidence_missing",
      "real_model_scene_evidence_missing",
      "owner_confirmation_missing",
      "trusted_loader_disabled",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_public_admin_surface_alignment",
    context: "live2d motion identity comfort long continuation completion review3",
  }, input);
}

export function createLive2dMotionIdentityComfortPublicSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_public_summary_status",
    status: "public_summary_blocked",
    boundaries: {
      motion_identity_comfort_public_summary_only_boundary: true,
      public_safe_labels_only_boundary: true,
      no_owner_only_detail_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_public_summary_only: true,
      public_safe_labels_only: true,
      public_summary_reflects_network_locator_material: false,
      public_summary_reflects_auth_material: false,
      public_summary_reflects_renderer_material: false,
      public_summary_reflects_cue_material: false,
      public_summary_reflects_model_locator_material: false,
      public_summary_reflects_motion_locator_material: false,
      public_summary_reflects_owner_only_detail: false,
      public_summary_reflects_private_relation_signal: false,
      public_summary_reflects_private_support_signal: false,
      public_summary_reflects_dependency_note_material: false,
      public_summary_claims_runtime_ready: false,
      public_summary_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
      public_summary_section_count: LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_SECTIONS.length,
      public_summary_allowed_label_count: LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_ALLOWED_LABELS.length,
      public_summary_rejection_count: LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_REJECTIONS.length,
    },
    arrays: {
      public_summary_sections: [...LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_SECTIONS],
      public_summary_allowed_labels: [...LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_ALLOWED_LABELS],
      public_summary_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_SUMMARY_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_public_summary_only",
      "public_safe_labels_only",
      "owner_only_detail_absent",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_admin_summary_redaction",
    context: "live2d motion identity comfort public summary",
  }, input);
}

export function createLive2dMotionIdentityComfortAdminSummaryRedaction(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_ADMIN_SUMMARY_REDACTION_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_admin_summary_redaction_status",
    status: "admin_summary_redaction_blocked",
    boundaries: {
      motion_identity_comfort_admin_summary_redaction_only_boundary: true,
      admin_ordinary_safe_labels_only_boundary: true,
      owner_only_detail_role_gated_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_admin_summary_redaction_only: true,
      admin_ordinary_safe_labels_only: true,
      owner_only_detail_absent_from_admin_ordinary: true,
      admin_summary_reflects_network_locator_material: false,
      admin_summary_reflects_auth_material: false,
      admin_summary_reflects_renderer_material: false,
      admin_summary_reflects_cue_material: false,
      admin_summary_reflects_model_locator_material: false,
      admin_summary_reflects_motion_locator_material: false,
      admin_summary_reflects_owner_only_detail: false,
      admin_summary_reflects_private_relation_signal: false,
      admin_summary_reflects_private_support_signal: false,
      admin_summary_reflects_dependency_note_material: false,
      admin_summary_claims_runtime_ready: false,
      admin_summary_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      admin_summary_redaction_fields: [...LIVE2D_MOTION_IDENTITY_COMFORT_ADMIN_SUMMARY_REDACTION_FIELDS],
      admin_summary_redaction_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_ADMIN_SUMMARY_REDACTION_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_admin_summary_redaction_only",
      "admin_ordinary_safe_labels_only",
      "owner_only_detail_role_gated",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_operator_handoff_no_action",
    context: "live2d motion identity comfort admin summary redaction",
  }, input);
}

export function createLive2dMotionIdentityComfortPublicAdminSurfaceAlignment(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ADMIN_SURFACE_ALIGNMENT_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_public_admin_surface_alignment_status",
    status: "public_admin_surface_alignment_blocked",
    boundaries: {
      motion_identity_comfort_public_admin_surface_alignment_only_boundary: true,
      public_admin_safe_alignment_only_boundary: true,
      owner_only_detail_role_gated_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_public_admin_surface_alignment_only: true,
      public_admin_safe_alignment_only: true,
      owner_only_detail_absent_from_public: true,
      owner_only_detail_absent_from_admin_ordinary: true,
      alignment_reflects_network_locator_material: false,
      alignment_reflects_auth_material: false,
      alignment_reflects_renderer_material: false,
      alignment_reflects_cue_material: false,
      alignment_reflects_model_locator_material: false,
      alignment_reflects_motion_locator_material: false,
      alignment_reflects_owner_only_detail: false,
      alignment_reflects_private_relation_signal: false,
      alignment_reflects_private_support_signal: false,
      alignment_claims_runtime_ready: false,
      alignment_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      public_admin_surface_alignment_checks: [...LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ADMIN_SURFACE_ALIGNMENT_CHECKS],
      public_admin_surface_alignment_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ADMIN_SURFACE_ALIGNMENT_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_public_admin_surface_alignment_only",
      "public_admin_safe_alignment_only",
      "owner_only_detail_role_gated",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_owner_only_detail_role_gate_stub2",
    context: "live2d motion identity comfort public admin surface alignment",
  }, input);
}

export function createLive2dMotionIdentityComfortOwnerOnlyDetailRoleGateStub2(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_ONLY_DETAIL_ROLE_GATE_STUB2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_owner_only_detail_role_gate_stub2_status",
    status: "owner_only_detail_role_gate_stub2_blocked",
    boundaries: {
      motion_identity_comfort_owner_only_detail_role_gate_stub2_only_boundary: true,
      owner_only_detail_stub2_definition_only_boundary: true,
      owner_only_detail_not_materialized_boundary: true,
      owner_only_detail_not_public_boundary: true,
      owner_only_detail_not_admin_ordinary_boundary: true,
      owner_only_detail_not_operator_visible_boundary: true,
      no_owner_action_requested_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_owner_only_detail_role_gate_stub2_only: true,
      owner_only_detail_stub2_present: true,
      owner_only_detail_stub2_materialized: false,
      owner_only_detail_stub2_public_visible: false,
      owner_only_detail_stub2_admin_ordinary_visible: false,
      owner_only_detail_stub2_operator_visible: false,
      owner_only_detail_stub2_requests_owner_action: false,
      owner_only_detail_stub2_creates_owner_confirmation: false,
      owner_only_detail_stub2_accepts_actual_data: false,
      owner_only_detail_stub2_claims_runtime_ready: false,
      owner_only_detail_stub2_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      owner_only_detail_role_gate_stub2_rules: [...LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_ONLY_DETAIL_ROLE_GATE_STUB2_RULES],
      owner_only_detail_role_gate_stub2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_ONLY_DETAIL_ROLE_GATE_STUB2_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_owner_only_detail_role_gate_stub2_only",
      "owner_only_detail_stub2_not_materialized",
      "owner_only_detail_not_public",
      "owner_action_not_requested",
      "owner_confirmation_missing",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_public_role_gate_leak_rejection",
    context: "live2d motion identity comfort owner-only detail role gate stub2",
  }, input);
}

export function createLive2dMotionIdentityComfortPublicRoleGateLeakRejection(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ROLE_GATE_LEAK_REJECTION_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_public_role_gate_leak_rejection_status",
    status: "public_role_gate_leak_rejection_blocked",
    boundaries: {
      motion_identity_comfort_public_role_gate_leak_rejection_only_boundary: true,
      public_role_gate_rejection_only_boundary: true,
      owner_only_detail_not_public_boundary: true,
      private_material_not_public_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_public_role_gate_leak_rejection_only: true,
      public_role_gate_leak_rejection_present: true,
      public_role_gate_leak_allows_owner_only_detail: false,
      public_role_gate_leak_allows_private_relation_signal: false,
      public_role_gate_leak_allows_private_support_signal: false,
      public_role_gate_leak_allows_locator_material: false,
      public_role_gate_leak_allows_auth_material: false,
      public_role_gate_leak_allows_runtime_ready: false,
      public_role_gate_leak_allows_production_ready: false,
      public_role_gate_leak_accepts_actual_data: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      public_role_gate_leak_rejection_labels: [...LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ROLE_GATE_LEAK_REJECTION_LABELS],
      public_role_gate_leak_rejection_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_PUBLIC_ROLE_GATE_LEAK_REJECTION_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_public_role_gate_leak_rejection_only",
      "owner_only_detail_not_public",
      "private_material_not_public",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_audit_event_stub_no_write2",
    context: "live2d motion identity comfort public role gate leak rejection",
  }, input);
}

export function createLive2dMotionIdentityComfortOperatorHandoffNoAction(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_OPERATOR_HANDOFF_NO_ACTION_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_operator_handoff_no_action_status",
    status: "operator_handoff_no_action_blocked",
    boundaries: {
      motion_identity_comfort_operator_handoff_no_action_only_boundary: true,
      operator_handoff_plan_only_boundary: true,
      no_operator_action_execution_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_external_connection_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_operator_handoff_no_action_only: true,
      operator_handoff_plan_present: true,
      operator_handoff_sent: false,
      operator_action_executed: false,
      renderer_execution_started: false,
      cue_application_started: false,
      external_connection_started: false,
      operator_handoff_claims_runtime_ready: false,
      operator_handoff_claims_production_ready: false,
      operator_handoff_creates_owner_confirmation: false,
      operator_handoff_enables_trusted_loader: false,
      operator_handoff_accepts_actual_data: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      operator_handoff_no_action_items: [...LIVE2D_MOTION_IDENTITY_COMFORT_OPERATOR_HANDOFF_NO_ACTION_ITEMS],
      operator_handoff_no_action_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_OPERATOR_HANDOFF_NO_ACTION_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_operator_handoff_no_action_only",
      "operator_handoff_not_sent",
      "operator_action_not_executed",
      "renderer_execution_not_started",
      "cue_application_not_started",
      "external_connection_not_started",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_owner_handoff_stub",
    context: "live2d motion identity comfort operator handoff no action",
  }, input);
}

export function createLive2dMotionIdentityComfortOwnerHandoffStub(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_owner_handoff_stub_status",
    status: "draft_not_sent",
    boundaries: {
      motion_identity_comfort_owner_handoff_stub_only_boundary: true,
      owner_handoff_draft_only_boundary: true,
      owner_handoff_not_sent_boundary: true,
      no_owner_action_requested_boundary: true,
      no_owner_confirmation_boundary: true,
      no_renderer_execution_boundary: true,
      no_cue_application_boundary: true,
      no_actual_data_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_owner_handoff_stub_only: true,
      owner_handoff_stub_present: true,
      owner_handoff_sent: false,
      owner_action_requested: false,
      owner_action_accepted: false,
      owner_confirmation_created: false,
      owner_confirmation_confirmed: false,
      owner_handoff_accepts_actual_data: false,
      owner_handoff_executes_renderer: false,
      owner_handoff_applies_cue: false,
      owner_handoff_enables_trusted_loader: false,
      owner_handoff_claims_runtime_ready: false,
      owner_handoff_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      owner_handoff_stub_review_sections: [...LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_REVIEW_SECTIONS],
      owner_handoff_stub_blockers: [...LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_BLOCKERS],
      owner_handoff_stub_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_OWNER_HANDOFF_STUB_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_owner_handoff_stub_only",
      "owner_handoff_not_sent",
      "owner_action_not_requested",
      "owner_confirmation_missing",
      "real_renderer_evidence_missing",
      "actual_cue_application_evidence_missing",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "readiness_claims_false",
    ],
    safeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    context: "live2d motion identity comfort owner handoff stub",
  }, input);
}

export function createLive2dMotionIdentityComfortRoleGateStub(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_role_gate_stub_status",
    status: "role_gate_stub_blocked",
    boundaries: {
      motion_identity_comfort_role_gate_stub_only_boundary: true,
      role_gate_definition_only_boundary: true,
      public_safe_labels_only_boundary: true,
      admin_ordinary_safe_labels_only_boundary: true,
      operator_safe_labels_only_boundary: true,
      owner_only_detail_not_exposed_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_role_gate_stub_only: true,
      role_gate_stub_present: true,
      public_view_safe_labels_only: true,
      admin_ordinary_safe_labels_only: true,
      operator_view_safe_labels_only: true,
      owner_only_detail_exposed_public: false,
      owner_only_detail_exposed_admin: false,
      role_gate_reflects_network_locator_material: false,
      role_gate_reflects_auth_material: false,
      role_gate_reflects_renderer_material: false,
      role_gate_reflects_cue_material: false,
      role_gate_reflects_private_relation_signal: false,
      role_gate_reflects_private_support_signal: false,
      role_gate_claims_runtime_ready: false,
      role_gate_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      role_gate_stub_roles: [...LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_ROLES],
      role_gate_stub_rules: [...LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_RULES],
      role_gate_stub_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_STUB_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_role_gate_stub_only",
      "role_gate_definition_only",
      "owner_only_detail_not_exposed",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_role_gate_redaction_guard",
    context: "live2d motion identity comfort role gate stub",
  }, input);
}

export function createLive2dMotionIdentityComfortRoleGateRedactionGuard(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_role_gate_redaction_guard_status",
    status: "role_gate_redaction_guard_blocked",
    boundaries: {
      motion_identity_comfort_role_gate_redaction_guard_only_boundary: true,
      role_gate_redaction_guard_only_boundary: true,
      public_safe_labels_only_boundary: true,
      admin_ordinary_safe_labels_only_boundary: true,
      operator_safe_labels_only_boundary: true,
      owner_only_detail_not_exposed_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_role_gate_redaction_guard_only: true,
      role_gate_redaction_guard_present: true,
      public_role_gate_redacted: true,
      admin_role_gate_redacted: true,
      operator_role_gate_redacted: true,
      owner_only_detail_exposed_public: false,
      owner_only_detail_exposed_admin: false,
      owner_only_detail_exposed_operator: false,
      role_gate_redaction_reflects_network_locator_material: false,
      role_gate_redaction_reflects_auth_material: false,
      role_gate_redaction_reflects_renderer_material: false,
      role_gate_redaction_reflects_cue_material: false,
      role_gate_redaction_reflects_private_relation_signal: false,
      role_gate_redaction_reflects_private_support_signal: false,
      role_gate_redaction_claims_runtime_ready: false,
      role_gate_redaction_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      role_gate_redaction_guard_fields: [...LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_FIELDS],
      role_gate_redaction_guard_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_ROLE_GATE_REDACTION_GUARD_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_role_gate_redaction_guard_only",
      "role_gate_redaction_guard_only",
      "owner_only_detail_not_exposed",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_audit_stub_no_write",
    context: "live2d motion identity comfort role gate redaction guard",
  }, input);
}

export function createLive2dMotionIdentityComfortAuditStubNoWrite(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_STUB_NO_WRITE_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_audit_stub_no_write_status",
    status: "audit_stub_no_write_blocked",
    boundaries: {
      motion_identity_comfort_audit_stub_no_write_only_boundary: true,
      audit_stub_label_only_boundary: true,
      audit_execution_not_started_boundary: true,
      audit_write_disabled_boundary: true,
      no_source_material_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_audit_stub_no_write_only: true,
      audit_stub_no_write_present: true,
      audit_execution_started: false,
      audit_write_enabled: false,
      audit_artifact_written: false,
      audit_source_material_read: false,
      audit_file_content_read: false,
      audit_file_identity_value_accepted: false,
      audit_stub_reflects_network_locator_material: false,
      audit_stub_reflects_auth_material: false,
      audit_stub_reflects_owner_private_detail: false,
      audit_stub_claims_runtime_ready: false,
      audit_stub_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      audit_stub_no_write_fields: [...LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_STUB_NO_WRITE_FIELDS],
      audit_stub_no_write_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_STUB_NO_WRITE_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_audit_stub_no_write_only",
      "audit_execution_not_started",
      "audit_write_disabled",
      "source_material_absent",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_audit_unsafe_field_guard",
    context: "live2d motion identity comfort audit stub no-write",
  }, input);
}

export function createLive2dMotionIdentityComfortAuditEventStubNoWrite2(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_STUB_NO_WRITE2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_audit_event_stub_no_write2_status",
    status: "audit_event_stub_no_write2_blocked",
    boundaries: {
      motion_identity_comfort_audit_event_stub_no_write2_only_boundary: true,
      audit_event_stub_no_write2_label_only_boundary: true,
      no_audit_execution_boundary: true,
      no_audit_write_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_audit_event_stub_no_write2_only: true,
      audit_event_stub_no_write2_present: true,
      audit_event_write_attempted: false,
      audit_entry_created: false,
      audit_execution_started: false,
      audit_event_stub2_writes_audit_event: false,
      audit_event_stub2_creates_audit_entry: false,
      audit_event_stub2_executes_audit: false,
      audit_event_stub2_accepts_actual_data: false,
      audit_event_stub2_exposes_owner_only_detail: false,
      audit_event_stub2_claims_runtime_ready: false,
      audit_event_stub2_claims_production_ready: false,
      audit_event_stub2_resolves_priority1: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      audit_event_stub_no_write2_fields: [...LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_STUB_NO_WRITE2_FIELDS],
      audit_event_stub_no_write2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_STUB_NO_WRITE2_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_audit_event_stub_no_write2_only",
      "audit_event_stub_no_write2_label_only",
      "audit_execution_not_started",
      "audit_write_not_attempted",
      "audit_entry_not_created",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_audit_event_unsafe_field_guard2",
    context: "live2d motion identity comfort audit event stub no-write2",
  }, input);
}

export function createLive2dMotionIdentityComfortAuditEventUnsafeFieldGuard2(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_UNSAFE_FIELD_GUARD2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_audit_event_unsafe_field_guard2_status",
    status: "audit_event_unsafe_field_guard2_blocked",
    boundaries: {
      motion_identity_comfort_audit_event_unsafe_field_guard2_only_boundary: true,
      audit_event_unsafe_field_guard2_label_only_boundary: true,
      unsafe_material_rejection_boundary: true,
      no_audit_execution_boundary: true,
      no_audit_write_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_audit_event_unsafe_field_guard2_only: true,
      audit_event_unsafe_field_guard2_present: true,
      audit_event_guard2_renderer_material_present: false,
      audit_event_guard2_cue_material_present: false,
      audit_event_guard2_model_locator_material_present: false,
      audit_event_guard2_motion_locator_material_present: false,
      audit_event_guard2_network_locator_material_present: false,
      audit_event_guard2_access_material_present: false,
      audit_event_guard2_private_relation_signal_present: false,
      audit_event_guard2_private_support_signal_present: false,
      audit_event_guard2_operator_instruction_material_present: false,
      audit_event_guard2_audit_body_material_present: false,
      audit_event_guard2_claims_runtime_ready: false,
      audit_event_guard2_claims_production_ready: false,
      audit_event_write_attempted: false,
      audit_entry_created: false,
      audit_execution_started: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      audit_event_unsafe_field_guard2_labels: [...LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_UNSAFE_FIELD_GUARD2_LABELS],
      audit_event_unsafe_field_guard2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_EVENT_UNSAFE_FIELD_GUARD2_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_audit_event_unsafe_field_guard2_only",
      "audit_event_unsafe_field_guard2_label_only",
      "unsafe_material_absent",
      "audit_execution_not_started",
      "audit_write_not_attempted",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_blocker_grouping_status_surface",
    context: "live2d motion identity comfort audit event unsafe-field guard2",
  }, input);
}

export function createLive2dMotionIdentityComfortAuditUnsafeFieldGuard(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_UNSAFE_FIELD_GUARD_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_audit_unsafe_field_guard_status",
    status: "audit_unsafe_field_guard_blocked",
    boundaries: {
      motion_identity_comfort_audit_unsafe_field_guard_only_boundary: true,
      audit_unsafe_field_guard_only_boundary: true,
      safe_audit_labels_only_boundary: true,
      no_source_material_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_audit_unsafe_field_guard_only: true,
      audit_unsafe_field_guard_present: true,
      audit_guard_unsafe_source_material_present: false,
      audit_guard_network_locator_material_present: false,
      audit_guard_access_material_present: false,
      audit_guard_owner_private_detail_present: false,
      audit_guard_renderer_material_present: false,
      audit_guard_cue_material_present: false,
      audit_guard_file_content_present: false,
      audit_guard_identity_value_present: false,
      audit_guard_claims_runtime_ready: false,
      audit_guard_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      audit_unsafe_field_guard_labels: [...LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_UNSAFE_FIELD_GUARD_LABELS],
      audit_unsafe_field_guard_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_AUDIT_UNSAFE_FIELD_GUARD_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_audit_unsafe_field_guard_only",
      "audit_unsafe_field_guard_only",
      "source_material_absent",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_repeated_blocker_grouping",
    context: "live2d motion identity comfort audit unsafe-field guard",
  }, input);
}

export function createLive2dMotionIdentityComfortBlockerGroupingStatusSurface(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_blocker_grouping_status_surface_status",
    status: "blocker_grouping_status_surface_blocked",
    boundaries: {
      motion_identity_comfort_blocker_grouping_status_surface_only_boundary: true,
      blocker_grouping_status_surface_label_only_boundary: true,
      no_blocker_resolution_boundary: true,
      no_work_permission_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_blocker_grouping_status_surface_only: true,
      blocker_grouping_status_surface_present: true,
      blocker_grouping_status_surface_claims_resolution: false,
      blocker_grouping_status_surface_authorizes_work: false,
      blocker_grouping_status_surface_sets_checked_count: false,
      blocker_grouping_status_surface_makes_motion_executable: false,
      blocker_grouping_status_surface_enables_trusted_loader: false,
      blocker_grouping_status_surface_creates_owner_confirmation: false,
      blocker_grouping_status_surface_claims_runtime_ready: false,
      blocker_grouping_status_surface_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
      grouped_blocker_count: LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_LABELS.length,
    },
    arrays: {
      blocker_grouping_status_surface_groups: [...LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_GROUPS],
      blocker_grouping_status_surface_labels: [...LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_LABELS],
      blocker_grouping_status_surface_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_blocker_grouping_status_surface_only",
      "blocker_grouping_status_surface_label_only",
      "blocker_resolution_not_claimed",
      "work_permission_not_granted",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_blocker_grouping_contract2",
    context: "live2d motion identity comfort blocker grouping status surface",
  }, input);
}

export function createLive2dMotionIdentityComfortBlockerGroupingContract2(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_CONTRACT2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_blocker_grouping_contract2_status",
    status: "blocker_grouping_contract2_blocked",
    boundaries: {
      motion_identity_comfort_blocker_grouping_contract2_only_boundary: true,
      blocker_grouping_contract2_label_only_boundary: true,
      cross_surface_consistency_only_boundary: true,
      no_blocker_resolution_boundary: true,
      no_work_permission_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_blocker_grouping_contract2_only: true,
      blocker_grouping_contract2_present: true,
      blocker_grouping_contract2_status_mismatch: false,
      blocker_grouping_contract2_health_mismatch: false,
      blocker_grouping_contract2_runtime_config_mismatch: false,
      blocker_grouping_contract2_claims_resolution: false,
      blocker_grouping_contract2_grants_work_permission: false,
      blocker_grouping_contract2_sets_checked_count: false,
      blocker_grouping_contract2_makes_motion_executable: false,
      blocker_grouping_contract2_claims_runtime_ready: false,
      blocker_grouping_contract2_claims_production_ready: false,
      grouped_blocker_count: LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_LABELS.length,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      blocker_grouping_contract2_rules: [...LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_CONTRACT2_RULES],
      blocker_grouping_contract2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_CONTRACT2_REJECTIONS],
      blocker_grouping_contract2_labels: [...LIVE2D_MOTION_IDENTITY_COMFORT_BLOCKER_GROUPING_STATUS_SURFACE_LABELS],
    },
    blockedReasons: [
      "motion_identity_comfort_blocker_grouping_contract2_only",
      "blocker_grouping_contract2_label_only",
      "cross_surface_consistency_only",
      "blocker_resolution_not_claimed",
      "work_permission_not_granted",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_continuation_ledger2",
    context: "live2d motion identity comfort blocker grouping contract2",
  }, input);
}

export function createLive2dMotionIdentityComfortRepeatedBlockerGrouping(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_repeated_blocker_grouping_status",
    status: "repeated_blocker_grouping_blocked",
    boundaries: {
      motion_identity_comfort_repeated_blocker_grouping_only_boundary: true,
      blocker_grouping_label_only_boundary: true,
      no_blocker_resolution_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_repeated_blocker_grouping_only: true,
      repeated_blocker_grouping_present: true,
      blocker_grouping_claims_resolution: false,
      blocker_grouping_changes_priority1: false,
      blocker_grouping_sets_checked_count: false,
      blocker_grouping_makes_motion_executable: false,
      blocker_grouping_enables_trusted_loader: false,
      blocker_grouping_creates_owner_confirmation: false,
      blocker_grouping_claims_runtime_ready: false,
      blocker_grouping_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      repeated_blocker_groups: [...LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPS],
      repeated_blocker_labels: [...LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_LABELS],
      repeated_blocker_grouping_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_repeated_blocker_grouping_only",
      "blocker_grouping_label_only",
      "owner_confirmation_missing",
      "real_renderer_evidence_missing",
      "actual_cue_application_evidence_missing",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_repeated_blocker_grouping_contract",
    context: "live2d motion identity comfort repeated blocker grouping",
  }, input);
}

export function createLive2dMotionIdentityComfortRepeatedBlockerGroupingContract(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_CONTRACT_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_repeated_blocker_grouping_contract_status",
    status: "repeated_blocker_grouping_contract_blocked",
    boundaries: {
      motion_identity_comfort_repeated_blocker_grouping_contract_only_boundary: true,
      blocker_grouping_contract_only_boundary: true,
      blocker_grouping_label_only_boundary: true,
      no_blocker_resolution_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_repeated_blocker_grouping_contract_only: true,
      repeated_blocker_grouping_contract_present: true,
      grouping_contract_claims_resolution: false,
      grouping_contract_omits_priority1_blocked: false,
      grouping_contract_omits_checked_row_count_zero: false,
      grouping_contract_omits_motion_dataset_non_executable: false,
      grouping_contract_enables_trusted_loader: false,
      grouping_contract_creates_owner_confirmation: false,
      grouping_contract_claims_runtime_ready: false,
      grouping_contract_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      repeated_blocker_grouping_contract_rules: [...LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_CONTRACT_RULES],
      repeated_blocker_grouping_contract_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_REPEATED_BLOCKER_GROUPING_CONTRACT_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_repeated_blocker_grouping_contract_only",
      "blocker_grouping_contract_only",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_continuation_ledger",
    context: "live2d motion identity comfort repeated blocker grouping contract",
  }, input);
}

export function createLive2dMotionIdentityComfortContinuationLedger(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_continuation_ledger_status",
    status: "continuation_ledger_blocked",
    boundaries: {
      motion_identity_comfort_continuation_ledger_only_boundary: true,
      continuation_ledger_label_only_boundary: true,
      no_owner_action_boundary: true,
      no_blocker_resolution_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_continuation_ledger_only: true,
      continuation_ledger_present: true,
      continuation_ledger_claims_owner_action: false,
      continuation_ledger_claims_blocker_resolution: false,
      continuation_ledger_claims_runtime_ready: false,
      continuation_ledger_claims_production_ready: false,
      continuation_ledger_changes_checked_count: false,
      continuation_ledger_makes_motion_executable: false,
      continuation_ledger_enables_trusted_loader: false,
      continuation_ledger_starts_actual_data: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      continuation_ledger_entries: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_ENTRIES],
      continuation_ledger_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_continuation_ledger_only",
      "continuation_ledger_label_only",
      "owner_action_absent",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_continuation_ledger_consistency",
    context: "live2d motion identity comfort continuation ledger",
  }, input);
}

export function createLive2dMotionIdentityComfortContinuationLedger2(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_continuation_ledger2_status",
    status: "continuation_ledger2_blocked",
    boundaries: {
      motion_identity_comfort_continuation_ledger2_only_boundary: true,
      continuation_ledger2_label_only_boundary: true,
      no_owner_action_boundary: true,
      no_blocker_resolution_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
      no_work_authorizing_boundary: true,
    },
    flags: {
      motion_identity_comfort_continuation_ledger2_only: true,
      continuation_ledger2_present: true,
      continuation_ledger2_claims_owner_action: false,
      continuation_ledger2_claims_blocker_resolution: false,
      continuation_ledger2_claims_runtime_ready: false,
      continuation_ledger2_claims_production_ready: false,
      continuation_ledger2_changes_checked_count: false,
      continuation_ledger2_makes_motion_executable: false,
      continuation_ledger2_enables_trusted_loader: false,
      continuation_ledger2_starts_actual_data: false,
      continuation_ledger2_creates_owner_confirmation: false,
      continuation_ledger2_authorizes_work: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      continuation_ledger2_entries: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_ENTRIES],
      continuation_ledger2_remaining_blockers: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_REMAINING_BLOCKERS],
      continuation_ledger2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_continuation_ledger2_only",
      "continuation_ledger2_label_only",
      "owner_action_absent",
      "blocker_resolution_not_claimed",
      "work_not_authorized",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_continuation_ledger_consistency2",
    context: "live2d motion identity comfort continuation ledger2",
  }, input);
}

export function createLive2dMotionIdentityComfortContinuationLedgerConsistency2(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_continuation_ledger_consistency2_status",
    status: "continuation_ledger_consistency2_blocked",
    boundaries: {
      motion_identity_comfort_continuation_ledger_consistency2_only_boundary: true,
      continuation_ledger_consistency2_label_only_boundary: true,
      ledger2_cross_surface_consistency_only_boundary: true,
      no_owner_action_boundary: true,
      no_blocker_resolution_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
      no_work_authorizing_boundary: true,
    },
    flags: {
      motion_identity_comfort_continuation_ledger_consistency2_only: true,
      continuation_ledger_consistency2_present: true,
      ledger2_consistency_status_mismatch: false,
      ledger2_consistency_health_mismatch: false,
      ledger2_consistency_runtime_config_mismatch: false,
      ledger2_consistency_claims_owner_action: false,
      ledger2_consistency_claims_blocker_resolution: false,
      ledger2_consistency_authorizes_work: false,
      ledger2_consistency_claims_runtime_ready: false,
      ledger2_consistency_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      continuation_ledger_consistency2_checks: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY2_CHECKS],
      continuation_ledger_consistency2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY2_REJECTIONS],
      continuation_ledger_consistency2_blockers: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER2_REMAINING_BLOCKERS],
    },
    blockedReasons: [
      "motion_identity_comfort_continuation_ledger_consistency2_only",
      "continuation_ledger_consistency2_label_only",
      "ledger2_cross_surface_consistency_only",
      "owner_action_absent",
      "blocker_resolution_not_claimed",
      "work_not_authorized",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_pre_owner_final_wait_state",
    context: "live2d motion identity comfort continuation ledger consistency2",
  }, input);
}

export function createLive2dMotionIdentityComfortContinuationLedgerConsistency(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_continuation_ledger_consistency_status",
    status: "continuation_ledger_consistency_blocked",
    boundaries: {
      motion_identity_comfort_continuation_ledger_consistency_only_boundary: true,
      continuation_ledger_consistency_label_only_boundary: true,
      no_owner_action_boundary: true,
      no_blocker_resolution_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_continuation_ledger_consistency_only: true,
      continuation_ledger_consistency_present: true,
      ledger_entries_match_completed_surfaces: true,
      ledger_consistency_claims_owner_action: false,
      ledger_consistency_claims_blocker_resolution: false,
      ledger_consistency_claims_runtime_ready: false,
      ledger_consistency_claims_production_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      continuation_ledger_consistency_checks: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY_CHECKS],
      continuation_ledger_consistency_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_CONTINUATION_LEDGER_CONSISTENCY_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_continuation_ledger_consistency_only",
      "continuation_ledger_consistency_label_only",
      "owner_action_absent",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
      "readiness_claims_false",
    ],
    safeNextAction: "add_motion_identity_comfort_final_redaction_sweep2",
    context: "live2d motion identity comfort continuation ledger consistency",
  }, input);
}

export function createLive2dMotionIdentityComfortFinalRedactionSweep2(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_REDACTION_SWEEP2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_final_redaction_sweep2_status",
    status: "final_redaction_sweep2_safe_summary_blocked",
    boundaries: {
      motion_identity_comfort_final_redaction_sweep2_only_boundary: true,
      safe_summary_only_boundary: true,
      no_redaction_scan_execution_boundary: true,
      no_motion_execution_boundary: true,
      no_renderer_probe_boundary: true,
      no_actual_data_boundary: true,
      no_owner_confirmation_boundary: true,
      no_readiness_claim_boundary: true,
    },
    flags: {
      motion_identity_comfort_final_redaction_sweep2_only: true,
      safe_summary_only: true,
      final_redaction_sweep2_present: true,
      final_redaction_sweep2_executes_scan: false,
      final_redaction_sweep2_network_locator_material_exposed: false,
      final_redaction_sweep2_auth_material_exposed: false,
      final_redaction_sweep2_renderer_material_exposed: false,
      final_redaction_sweep2_cue_material_exposed: false,
      final_redaction_sweep2_model_locator_material_exposed: false,
      final_redaction_sweep2_motion_locator_material_exposed: false,
      final_redaction_sweep2_runtime_material_exposed: false,
      final_redaction_sweep2_operator_note_material_exposed: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      final_redaction_sweep2_surfaces: [...LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_REDACTION_SWEEP2_SURFACES],
      final_redaction_sweep2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_REDACTION_SWEEP2_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_final_redaction_sweep2_only",
      "safe_summary_only",
      "redaction_scan_not_executed",
      "unsafe_material_not_reflected",
      "final_redaction_sweep2_is_not_readiness",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_comfort_final_no_sweetening_sweep2",
    context: "live2d motion identity comfort final redaction sweep2",
  }, input);
}

export function createLive2dMotionIdentityComfortFinalNoSweeteningSweep2(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_NO_SWEETENING_SWEEP2_SCHEMA,
    statusKey: "live2d_motion_identity_comfort_final_no_sweetening_sweep2_status",
    status: "final_no_sweetening_sweep2_blocked",
    boundaries: {
      motion_identity_comfort_final_no_sweetening_sweep2_only_boundary: true,
      no_readiness_sweetening_boundary: true,
      no_motion_execution_boundary: true,
      no_runtime_motion_executable_boundary: true,
      no_owner_confirmation_boundary: true,
      no_owner_action_boundary: true,
      no_audit_execution_boundary: true,
      no_actual_data_boundary: true,
      no_trusted_loader_enablement_boundary: true,
    },
    flags: {
      motion_identity_comfort_final_no_sweetening_sweep2_only: true,
      final_redaction_sweep2_is_runtime_readiness: false,
      continuation_ledger_is_runtime_readiness: false,
      role_gate_is_owner_action: false,
      audit_stub_executes_audit: false,
      public_safe_summary_is_runtime_ready: false,
      completion_review_is_production_ready: false,
      experimental_labels_executable: false,
      runtime_motion_executable: false,
      strong_motion_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready_claimed: false,
      renderer_ready_candidate: false,
      owner_confirmation_confirmed: false,
      trusted_loader_allowlist_enabled: false,
      actual_ingestion_allowed: false,
      checked_row_count: 0,
      motion_dataset_executable: false,
    },
    arrays: {
      final_no_sweetening_sweep2_inputs: [...LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_NO_SWEETENING_SWEEP2_INPUTS],
      final_no_sweetening_sweep2_rejections: [...LIVE2D_MOTION_IDENTITY_COMFORT_FINAL_NO_SWEETENING_SWEEP2_REJECTIONS],
    },
    blockedReasons: [
      "motion_identity_comfort_final_no_sweetening_sweep2_only",
      "final_redaction_sweep2_is_not_readiness",
      "continuation_ledger_is_not_readiness",
      "role_gate_is_not_owner_action",
      "audit_stub_is_not_audit_execution",
      "public_safe_summary_is_not_runtime_ready",
      "completion_review_is_not_production_ready",
      "priority1_blocked",
      "checked_row_count_zero",
      "motion_dataset_non_executable",
      "trusted_loader_disabled",
    ],
    safeNextAction: "add_motion_identity_comfort_long_continuation_completion_review3",
    context: "live2d motion identity comfort final no sweetening sweep2",
  }, input);
}

export function createMotionDatasetRendererReadyDependencyMatrixSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_RENDERER_READY_DEPENDENCY_MATRIX_SCHEMA,
    statusKey: "motion_dataset_renderer_ready_dependency_matrix_status",
    status: "planning_only_blocked",
    boundaries: {
      renderer_ready_dependency_matrix_only_boundary: true,
      no_renderer_ready_claim_boundary: true,
      no_real_row_ingestion_boundary: true,
      renderer_ready_dependency_matrix_only: true,
    },
    flags: {
      renderer_ready_dependency_matrix_only: true,
      renderer_ready_dependency_matrix_claims_ready: false,
      renderer_ready: false,
      browser_cue_delivery_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
    },
    arrays: {
      required_renderer_ready_dependencies: [...LIVE2D_MOTION_DATASET_RENDERER_READY_DEPENDENCIES],
      required_false_ready_blockers: [...LIVE2D_MOTION_DATASET_RENDERER_READY_FALSE_READY_BLOCKERS],
    },
    blockedReasons: [
      "renderer_ready_dependency_matrix_planning_only",
      "renderer_ready_dependency_matrix_no_ready_claim",
      "renderer_ready_dependency_matrix_priority1_blocked",
      "renderer_ready_dependency_matrix_checked_row_count_zero",
    ],
    safeNextAction: "do_not_claim_renderer_ready_until_all_real_dependencies_are_present",
    context: "motion dataset renderer ready dependency matrix summary",
  }, input);
}

export function createRendererReadyFalsePositiveDependencySurfaceSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const summary = {
    schema: LIVE2D_RENDERER_READY_FALSE_POSITIVE_DEPENDENCY_SURFACE_SCHEMA,
    safe_summary_only: true,
    renderer_ready_status: "blocked_until_real_renderer_evidence",
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    renderer_ready_blocked_reasons: [...LIVE2D_RENDERER_READY_FALSE_POSITIVE_BLOCKERS],
    fresh_heartbeat_present: false,
    real_model_load_supported: false,
    model_loaded: false,
    scene_loaded: false,
    model_matches_expected: false,
    scene_matches_expected: false,
    cue_capability_confirmed: false,
    last_cue_applied: false,
    last_cue_applied_success: false,
    fixture_pass_is_real_ready: false,
    manifest_only_is_real_ready: false,
    sse_connected_is_real_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    checked_row_count: 0,
    motion_dataset_executable: false,
    trusted_loader_allowlist_enabled: false,
    safe_next_action: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    observed_inputs_sanitized: {
      fresh_heartbeat_present: source.fresh_heartbeat_present === true ? "observed_but_not_sufficient" : "missing",
      real_model_load_supported: source.real_model_load_supported === true ? "observed_but_not_sufficient" : "missing",
      model_loaded: source.model_loaded === true ? "observed_but_not_sufficient" : "missing",
      scene_loaded: source.scene_loaded === true ? "observed_but_not_sufficient" : "missing",
      model_matches_expected: source.model_matches_expected === true ? "observed_but_not_sufficient" : "missing",
      scene_matches_expected: source.scene_matches_expected === true ? "observed_but_not_sufficient" : "missing",
      cue_capability_confirmed: source.cue_capability_confirmed === true ? "observed_but_not_sufficient" : "missing",
      last_cue_applied_success: source.last_cue_applied_success === true ? "observed_but_not_sufficient" : "missing",
    },
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      no_actual_renderer_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready false positive dependency surface summary");
  return summary;
}

export function createRendererReadyFixtureVsRealSeparationContractSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const summary = {
    schema: LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_SEPARATION_CONTRACT_SCHEMA,
    safe_summary_only: true,
    renderer_ready_fixture_vs_real_separation_contract_status: "blocked_until_real_renderer_evidence",
    negative_contract_only: true,
    fixture_pass_is_real_ready: false,
    manifest_only_is_real_ready: false,
    sse_connected_is_real_ready: false,
    cue_accepted_is_last_cue_applied: false,
    local_checks_are_runtime_readiness: false,
    remote_checks_are_runtime_readiness: false,
    owner_action_freeze_is_renderer_readiness: false,
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    checked_row_count: 0,
    motion_dataset_executable: false,
    trusted_loader_allowlist_enabled: false,
    fresh_heartbeat_present: false,
    real_model_load_supported: false,
    model_loaded: false,
    scene_loaded: false,
    cue_capability_confirmed: false,
    last_cue_applied_success: false,
    required_rejection_labels: [...LIVE2D_RENDERER_READY_FIXTURE_VS_REAL_REJECTION_LABELS],
    observed_positive_fixture_inputs_sanitized: {
      fixture_pass: source.fixture_pass === true ? "fixture_only_not_real_ready" : "missing",
      manifest_available: source.manifest_available === true ? "manifest_only_not_real_ready" : "missing",
      sse_connected: source.sse_connected === true ? "sse_only_not_real_ready" : "missing",
      cue_accepted: source.cue_accepted === true ? "accepted_only_not_applied" : "missing",
      schema_manifest_pass: source.schema_manifest_pass === true ? "schema_only_not_real_ready" : "missing",
      owner_action_freeze_pass: source.owner_action_freeze_pass === true ? "freeze_only_not_real_ready" : "missing",
      local_checks_pass: source.local_checks_pass === true ? "local_checks_only_not_runtime_ready" : "missing",
      remote_checks_pass: source.remote_checks_pass === true ? "remote_checks_only_not_runtime_ready" : "missing",
    },
    safe_next_action: "wait_for_real_renderer_evidence_before_any_readiness_claim",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      negative_contract_only: true,
      no_actual_renderer_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready fixture vs real separation contract summary");
  return summary;
}

export function createRendererReadyFreshEvidenceEnvelopeSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const summary = {
    schema: LIVE2D_RENDERER_READY_FRESH_EVIDENCE_ENVELOPE_SCHEMA,
    safe_summary_only: true,
    renderer_readiness_evidence_status: "missing_real_renderer_evidence",
    renderer_readiness_evidence_fresh: false,
    renderer_readiness_evidence_source_type: "none",
    renderer_readiness_evidence_freshness: "missing",
    renderer_readiness_evidence_timestamp_ms: null,
    renderer_readiness_evidence_stale: true,
    fixture_evidence_present: source.fixture_evidence_present === true,
    fixture_evidence_is_real_evidence: false,
    manual_evidence_present: false,
    manual_evidence_is_real_evidence: false,
    real_probe_evidence_present: false,
    real_probe_evidence_fresh: false,
    fresh_heartbeat_evidence_present: false,
    fresh_heartbeat_evidence_fresh: false,
    real_model_load_evidence_present: false,
    real_model_load_evidence_fresh: false,
    model_loaded_evidence_present: false,
    scene_loaded_evidence_present: false,
    model_scene_match_evidence_present: false,
    cue_capability_evidence_present: false,
    last_cue_applied_evidence_present: false,
    last_cue_applied_evidence_fresh: false,
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    checked_row_count: 0,
    motion_dataset_executable: false,
    trusted_loader_allowlist_enabled: false,
    required_blockers: [...LIVE2D_RENDERER_READY_FRESH_EVIDENCE_REQUIRED_BLOCKERS],
    observed_evidence_inputs_sanitized: {
      fresh_heartbeat_evidence_present: source.fresh_heartbeat_evidence_present === true ? "observed_but_missing_fresh_real_evidence" : "missing",
      real_model_load_evidence_present: source.real_model_load_evidence_present === true ? "observed_but_missing_fresh_real_evidence" : "missing",
      model_loaded_evidence_present: source.model_loaded_evidence_present === true ? "observed_but_missing_fresh_real_evidence" : "missing",
      scene_loaded_evidence_present: source.scene_loaded_evidence_present === true ? "observed_but_missing_fresh_real_evidence" : "missing",
      cue_capability_evidence_present: source.cue_capability_evidence_present === true ? "observed_but_missing_fresh_real_evidence" : "missing",
      last_cue_applied_evidence_present: source.last_cue_applied_evidence_present === true ? "observed_but_missing_fresh_real_evidence" : "missing",
    },
    safe_next_action: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      no_actual_renderer_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready fresh evidence envelope summary");
  return summary;
}

export function createRendererReadyStaleEvidenceDowngradeContractSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const summary = {
    schema: LIVE2D_RENDERER_READY_STALE_EVIDENCE_DOWNGRADE_CONTRACT_SCHEMA,
    safe_summary_only: true,
    stale_evidence_downgrade_contract_status: "blocked_stale_or_non_real_evidence",
    negative_contract_only: true,
    renderer_readiness_evidence_freshness: "stale",
    renderer_readiness_evidence_stale: true,
    stale_evidence_is_renderer_ready: false,
    fixture_evidence_present: source.fixture_evidence_present === true,
    fixture_evidence_is_real_evidence: false,
    manual_evidence_present: source.manual_evidence_present === true,
    manual_evidence_is_real_evidence: false,
    real_probe_evidence_present: false,
    fresh_heartbeat_evidence_present: source.fresh_heartbeat_evidence_present === true,
    fresh_heartbeat_evidence_fresh: false,
    real_model_load_evidence_present: source.real_model_load_evidence_present === true,
    real_model_load_evidence_fresh: false,
    last_cue_applied_evidence_present: source.last_cue_applied_evidence_present === true,
    last_cue_applied_evidence_fresh: false,
    manifest_available: source.manifest_available === true,
    manifest_only_is_real_ready: false,
    sse_connected: source.sse_connected === true,
    sse_connected_is_real_ready: false,
    cue_accepted: source.cue_accepted === true,
    cue_accepted_is_last_cue_applied: false,
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    checked_row_count: 0,
    motion_dataset_executable: false,
    trusted_loader_allowlist_enabled: false,
    required_rejection_labels: [...LIVE2D_RENDERER_READY_STALE_EVIDENCE_REJECTION_LABELS],
    observed_stale_or_non_real_inputs_sanitized: {
      fixture_evidence_present: source.fixture_evidence_present === true ? "fixture_only_not_real_ready" : "missing",
      manual_evidence_present: source.manual_evidence_present === true ? "manual_label_not_real_ready" : "missing",
      manifest_available: source.manifest_available === true ? "manifest_only_not_real_ready" : "missing",
      sse_connected: source.sse_connected === true ? "sse_only_not_real_ready" : "missing",
      cue_accepted: source.cue_accepted === true ? "accepted_only_not_applied" : "missing",
      fresh_heartbeat_evidence_present: source.fresh_heartbeat_evidence_present === true ? "present_but_not_fresh" : "missing",
      real_model_load_evidence_present: source.real_model_load_evidence_present === true ? "present_but_not_fresh" : "missing",
      last_cue_applied_evidence_present: source.last_cue_applied_evidence_present === true ? "present_but_not_fresh" : "missing",
    },
    safe_next_action: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      negative_contract_only: true,
      no_actual_renderer_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready stale evidence downgrade contract summary");
  return summary;
}

export function createRendererReadyEvidenceSourceAllowlistSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const requestedSourceType = typeof source.source_type === "string" ? source.source_type : "none";
  const sourceAllowed = LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_TYPES.includes(requestedSourceType);
  const sourceType = sourceAllowed ? requestedSourceType : "unsafe_source_type";
  const isFixture = sourceType === "fixture";
  const isManualLabel = sourceType === "manual_label";
  const isManifestOnly = sourceType === "manifest_only";
  const isSseConnectedOnly = sourceType === "sse_connected_only";
  const isCueAcceptedOnly = sourceType === "cue_accepted_only";
  const isRealProbe = sourceType === "real_probe";
  const isOperatorConfirmed = sourceType === "operator_confirmed";
  const isAuditLink = sourceType === "audit_link";
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_ALLOWLIST_SCHEMA,
    safe_summary_only: true,
    renderer_readiness_evidence_source_allowlist_status: sourceAllowed ? "source_type_allowed_not_ready" : "unsafe_source_type",
    renderer_readiness_evidence_source_allowlist: [...LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_TYPES],
    renderer_readiness_evidence_source_type: sourceType,
    renderer_readiness_evidence_source_allowed: sourceAllowed,
    renderer_readiness_evidence_source_is_real_probe: isRealProbe,
    renderer_readiness_evidence_source_is_fixture: isFixture,
    renderer_readiness_evidence_source_is_manual_label: isManualLabel,
    renderer_readiness_evidence_source_is_real_evidence: false,
    fixture_evidence_is_real_evidence: false,
    manual_label_is_real_evidence: false,
    manifest_only_is_real_evidence: false,
    sse_connected_only_is_real_evidence: false,
    cue_accepted_only_is_real_evidence: false,
    real_probe_label_alone_is_renderer_ready: false,
    operator_confirmed_auto_confirms_owner: false,
    audit_link_alone_is_production_ready: false,
    source_classification: {
      none: "not_real_evidence",
      fixture: "not_real_evidence",
      manual_label: "not_real_evidence",
      manifest_only: "not_real_evidence",
      sse_connected_only: "not_real_evidence",
      cue_accepted_only: "not_real_evidence",
      real_probe: "not_real_evidence_without_fresh_complete_required_chain",
      operator_confirmed: "not_owner_confirmation_without_explicit_owner_confirmation_task",
      audit_link: "not_production_readiness_without_safe_audit_and_fresh_evidence",
    },
    observed_source_flags_sanitized: {
      fixture: isFixture ? "fixture_source_not_real_ready" : "not_selected",
      manual_label: isManualLabel ? "manual_label_not_real_ready" : "not_selected",
      manifest_only: isManifestOnly ? "manifest_only_not_real_ready" : "not_selected",
      sse_connected_only: isSseConnectedOnly ? "sse_only_not_real_ready" : "not_selected",
      cue_accepted_only: isCueAcceptedOnly ? "cue_accepted_only_not_applied" : "not_selected",
      real_probe: isRealProbe ? "real_probe_label_alone_not_ready" : "not_selected",
      operator_confirmed: isOperatorConfirmed ? "operator_label_not_owner_confirmation" : "not_selected",
      audit_link: isAuditLink ? "audit_link_alone_not_readiness" : "not_selected",
    },
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    checked_row_count: 0,
    motion_dataset_executable: false,
    trusted_loader_allowlist_enabled: false,
    safe_next_action: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      source_allowlist_only: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence source allowlist summary");
  return summary;
}

export function createRendererReadyEvidenceSchemaViolationGuardSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const requestedSourceType = typeof source.source_type === "string" ? source.source_type : "none";
  const sourceAllowed = LIVE2D_RENDERER_READY_EVIDENCE_SOURCE_TYPES.includes(requestedSourceType);
  const rejectionReasons = [];
  if (!sourceAllowed) {
    rejectionReasons.push("unknown_source_type", "unsafe_source_type");
  }
  for (const [fieldName, rejectionLabel] of Object.entries(LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_FIELD_LABELS)) {
    if (Object.hasOwn(source, fieldName)) {
      rejectionReasons.push(rejectionLabel);
    }
  }
  if (source.owner_confirmation_created === true) rejectionReasons.push("owner_confirmation_created_true");
  if (source.owner_confirmation_confirmed === true) rejectionReasons.push("owner_confirmation_confirmed_true");
  if (source.runtime_readiness_claimed === true) rejectionReasons.push("runtime_readiness_claimed_true");
  if (source.production_readiness_claimed === true) rejectionReasons.push("production_readiness_claimed_true");
  if (source.renderer_ready_claimed === true) rejectionReasons.push("renderer_ready_claimed_true");
  if (source.renderer_ready_candidate === true) rejectionReasons.push("renderer_ready_candidate_true");
  if (source.priority1_status === "RESOLVED") rejectionReasons.push("priority1_status_resolved");
  if (Number(source.checked_row_count) > 0) rejectionReasons.push("checked_row_count_positive");
  if (source.motion_dataset_executable === true) rejectionReasons.push("motion_dataset_executable_true");
  if (source.trusted_loader_allowlist_enabled === true) rejectionReasons.push("trusted_loader_allowlist_enabled_true");
  const uniqueRejectionReasons = [...new Set(rejectionReasons)];
  const hasViolation = uniqueRejectionReasons.length > 0;
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_GUARD_SCHEMA,
    safe_summary_only: true,
    negative_contract_only: true,
    schema_violation_guard_status: hasViolation ? "rejected_to_safe_false" : "no_violation_detected_safe_false",
    schema_violation_rejected: hasViolation,
    unknown_source_type_rejected: uniqueRejectionReasons.includes("unknown_source_type"),
    unsafe_source_type_rejected: uniqueRejectionReasons.includes("unsafe_source_type"),
    renderer_body_material_rejected: uniqueRejectionReasons.includes("raw_renderer_payload_present"),
    cue_body_material_rejected: uniqueRejectionReasons.includes("raw_cue_payload_present"),
    model_locator_material_rejected: uniqueRejectionReasons.includes("model_locator_present"),
    motion_locator_material_rejected: uniqueRejectionReasons.includes("motion_locator_present"),
    network_locator_material_rejected: uniqueRejectionReasons.includes("network_locator_present"),
    auth_material_rejected: uniqueRejectionReasons.includes("auth_material_present") || uniqueRejectionReasons.includes("secret_present"),
    private_locator_material_rejected: uniqueRejectionReasons.includes("private_path_present") || uniqueRejectionReasons.includes("actual_file_path_value_present"),
    shell_material_rejected: uniqueRejectionReasons.includes("command_payload_present"),
    ready_promotion_field_rejected: uniqueRejectionReasons.some((reason) => [
      "owner_confirmation_created_true",
      "owner_confirmation_confirmed_true",
      "runtime_readiness_claimed_true",
      "production_readiness_claimed_true",
      "renderer_ready_claimed_true",
      "renderer_ready_candidate_true",
      "priority1_status_resolved",
      "checked_row_count_positive",
      "motion_dataset_executable_true",
      "trusted_loader_allowlist_enabled_true",
    ].includes(reason)),
    rejected_violation_count: uniqueRejectionReasons.length,
    required_rejection_label_count: LIVE2D_RENDERER_READY_EVIDENCE_SCHEMA_VIOLATION_REJECTION_LABELS.length,
    source_value_echoed: false,
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1_status: "BLOCKED",
    checked_row_count: 0,
    motion_dataset_executable: false,
    trusted_loader_allowlist_enabled: false,
    safe_next_action: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      negative_contract_only: true,
      no_raw_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence schema violation guard summary");
  return summary;
}

export function createRendererReadyEvidenceCompletenessBlockerMatrixSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const evidenceMatrix = {
    requiredFreshHeartbeatEvidence: false,
    requiredRealModelLoadEvidence: false,
    requiredModelLoadedEvidence: false,
    requiredSceneLoadedEvidence: false,
    requiredModelSceneMatchEvidence: false,
    requiredCueCapabilityEvidence: false,
    requiredLastCueAppliedEvidence: false,
    requiredLastCueAppliedSuccessEvidence: false,
    requiredOwnerConfirmation: false,
    requiredTrustedLoaderDisabledBoundary: false,
    requiredPriority1UnblockedEvidence: false,
    requiredPositiveCheckedRowCountEvidence: false,
    requiredMotionDatasetExecutableEvidence: false,
  };
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_BLOCKER_MATRIX_SCHEMA,
    safe_summary_only: true,
    rendererReadinessCompletenessStatus: "blocked_missing_required_evidence",
    rendererReadinessRequiredEvidence: [...LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_REQUIRED_EVIDENCE],
    rendererReadinessRequiredEvidenceMatrix: evidenceMatrix,
    rendererReadinessMissingRequiredEvidence: [...LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_MISSING_LABELS],
    requiredEvidenceComplete: false,
    allRequiredEvidencePresent: false,
    requiredFreshHeartbeatEvidencePresent: false,
    requiredRealModelLoadEvidencePresent: false,
    requiredModelLoadedEvidencePresent: false,
    requiredSceneLoadedEvidencePresent: false,
    requiredModelSceneMatchEvidencePresent: false,
    requiredCueCapabilityEvidencePresent: false,
    requiredLastCueAppliedEvidencePresent: false,
    requiredLastCueAppliedSuccessEvidencePresent: false,
    requiredOwnerConfirmationPresent: false,
    requiredTrustedLoaderDisabledBoundaryPresent: false,
    requiredPriority1UnblockedEvidencePresent: false,
    requiredPositiveCheckedRowCountEvidencePresent: false,
    requiredMotionDatasetExecutableEvidencePresent: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    fresh_heartbeat_present: false,
    real_model_load_supported: false,
    model_loaded: false,
    scene_loaded: false,
    model_scene_match_confirmed: false,
    cue_capability_confirmed: false,
    last_cue_applied: false,
    last_cue_applied_success: false,
    fixture_pass_is_real_ready: false,
    manifest_only_is_real_ready: false,
    sse_connected_is_real_ready: false,
    cue_accepted_is_last_cue_applied: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    observedInputLabelsSanitized: {
      freshHeartbeat: source.freshHeartbeatEvidencePresent === true ? "observed_but_required_matrix_still_blocked" : "missing",
      realModelLoad: source.realModelLoadEvidencePresent === true ? "observed_but_required_matrix_still_blocked" : "missing",
      modelLoaded: source.modelLoadedEvidencePresent === true ? "observed_but_required_matrix_still_blocked" : "missing",
      sceneLoaded: source.sceneLoadedEvidencePresent === true ? "observed_but_required_matrix_still_blocked" : "missing",
      cueCapability: source.cueCapabilityEvidencePresent === true ? "observed_but_required_matrix_still_blocked" : "missing",
      lastCueApplied: source.lastCueAppliedEvidencePresent === true ? "observed_but_required_matrix_still_blocked" : "missing",
      lastCueAppliedSuccess: source.lastCueAppliedSuccessEvidencePresent === true ? "observed_but_required_matrix_still_blocked" : "missing",
    },
    safeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    safe_next_action: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence completeness blocker matrix summary");
  return summary;
}

export function createRendererReadyEvidenceConflictDowngradeContractSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const conflictLabels = new Set(["partial_evidence_is_not_ready"]);
  if (source.freshHeartbeatEvidencePresent === true && source.realModelLoadEvidencePresent !== true) conflictLabels.add("fresh_heartbeat_without_model_load");
  if (source.modelLoadedEvidencePresent === true && source.sceneLoadedEvidencePresent !== true) conflictLabels.add("model_loaded_without_scene_loaded");
  if (source.cueCapabilityEvidencePresent === true && source.lastCueAppliedEvidencePresent !== true) conflictLabels.add("cue_capability_without_last_cue_applied");
  if (source.lastCueAppliedEvidencePresent === true && source.lastCueAppliedSuccessEvidencePresent !== true) conflictLabels.add("last_cue_without_success");
  if (source.realProbeEvidencePresent === true && source.allRequiredEvidencePresent !== true) conflictLabels.add("real_probe_label_without_required_evidence");
  if (source.rendererReadinessEvidenceFresh === true && source.sourceType === "fixture") conflictLabels.add("fixture_source_with_fresh_claim");
  if (source.ownerConfirmationCreated === true && source.ownerConfirmationConfirmed !== true) conflictLabels.add("owner_confirmation_incomplete");
  if (source.ownerConfirmationConfirmed === true && source.auditRefPresent !== true) conflictLabels.add("owner_confirmation_incomplete");
  if (source.priority1Status === "RESOLVED" && Number(source.checkedRowCount) <= 0) conflictLabels.add("priority1_resolution_without_checked_rows");
  if (Number(source.checkedRowCount) > 0 && source.actualDataTaskStarted !== true) conflictLabels.add("checked_rows_without_actual_data_task");
  if (source.motionDatasetExecutable === true && source.trustedLoaderAllowlistEnabled !== true) conflictLabels.add("motion_executable_without_trusted_loader");
  if (source.futureEvidenceTime === true) conflictLabels.add("future_timestamp_rejected");
  if (source.staleEvidenceTime === true || source.lastCueAppliedEvidenceFresh === false) conflictLabels.add("stale_timestamp_downgraded");
  if (source.sourceType === "manual_label") conflictLabels.add("manual_label_is_not_real_ready");
  if (conflictLabels.size > 1) conflictLabels.add("conflicting_renderer_evidence");
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_CONFLICT_DOWNGRADE_CONTRACT_SCHEMA,
    safe_summary_only: true,
    negative_contract_only: true,
    evidenceConflictDowngradeStatus: "downgraded_to_safe_false",
    evidenceConflictDetected: true,
    evidenceConflictDowngraded: true,
    partialEvidenceIsReady: false,
    conflictingEvidenceIsReady: false,
    futureTimestampAccepted: false,
    staleTimestampAccepted: false,
    staleTimestampDowngraded: true,
    fixtureEvidenceIsRealReady: false,
    manualLabelIsRealReady: false,
    manifestOnlyIsRealReady: false,
    sseConnectedIsRealReady: false,
    cueAcceptedIsLastCueApplied: false,
    requiredConflictLabels: [...LIVE2D_RENDERER_READY_EVIDENCE_CONFLICT_DOWNGRADE_LABELS],
    detectedConflictLabels: [...conflictLabels],
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    sourceValueEchoed: false,
    safeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    safe_next_action: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      negative_contract_only: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence conflict downgrade contract summary");
  return summary;
}

export function createRendererReadyGoNoGoBlockerSurfaceSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_GO_NOGO_BLOCKER_SURFACE_SCHEMA,
    safe_summary_only: true,
    rendererReadinessGoNoGoStatus: "no_go",
    rendererReadinessGoApproved: false,
    rendererReadinessNoGoReasons: [...LIVE2D_RENDERER_READY_GO_NOGO_REASONS],
    safeReasonsOnly: true,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    renderer_ready_claimed: false,
    renderer_ready_candidate: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    safeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    safe_next_action: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready go no-go blocker surface summary");
  return summary;
}

export function createRendererReadyBlockerReasonAllowlistSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_BLOCKER_REASON_ALLOWLIST_SCHEMA,
    safe_summary_only: true,
    blockerReasonAllowlistStatus: "enforced",
    rendererReadinessBlockerReasonAllowlist: [...LIVE2D_RENDERER_READY_BLOCKER_REASON_ALLOWLIST],
    goNoGoReasonsIncluded: true,
    unknownReasonRejected: true,
    unsafeDiagnosticReasonRejected: true,
    sourceValueEchoed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      negative_contract_only: true,
      no_source_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready blocker reason allowlist summary");
  return summary;
}

export function createRendererReadySafeNextActionCatalogSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_SAFE_NEXT_ACTION_CATALOG_SCHEMA,
    safe_summary_only: true,
    safeNextActionCatalogStatus: "available_safe_labels_only",
    safeNextActions: [...LIVE2D_RENDERER_READY_SAFE_NEXT_ACTIONS],
    defaultSafeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    unsafeActionRejected: true,
    actionExecutionStarted: false,
    sourceValueEchoed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      catalog_only: true,
      no_action_execution: true,
      no_source_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready safe next action catalog summary");
  return summary;
}

export function createRendererReadyCrossSurfaceBlockerConsistencySummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_CROSS_SURFACE_BLOCKER_CONSISTENCY_SCHEMA,
    safe_summary_only: true,
    crossSurfaceBlockerConsistencyStatus: "consistent_safe_no_go",
    surfacesChecked: [...LIVE2D_RENDERER_READY_CROSS_SURFACE_BLOCKER_SURFACES],
    goNoGoStatusConsistent: true,
    blockerReasonsConsistent: true,
    readinessFlagsConsistent: true,
    ownerDataTrustedLoaderFlagsConsistent: true,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      consistency_summary_only: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready cross surface blocker consistency summary");
  return summary;
}

export function createRendererReadyOwnerEvidenceHandoffPacketStubSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_OWNER_EVIDENCE_HANDOFF_PACKET_STUB_SCHEMA,
    safe_summary_only: true,
    ownerEvidenceHandoffPacketStubStatus: "stub_not_sent",
    handoffPacketSent: false,
    handoffPacketAccepted: false,
    requiredStubItems: [...LIVE2D_RENDERER_READY_OWNER_EVIDENCE_HANDOFF_STUB_ITEMS],
    missingEvidenceLabelsOnly: [...LIVE2D_RENDERER_READY_EVIDENCE_COMPLETENESS_MISSING_LABELS],
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      stub_only: true,
      labels_only: true,
      no_handoff_sent: true,
      no_owner_confirmation_creation: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready owner evidence handoff packet stub summary");
  return summary;
}

export function createRendererReadyOwnerHandoffNotSentGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_OWNER_HANDOFF_NOT_SENT_GUARD_SCHEMA,
    safe_summary_only: true,
    ownerEvidenceHandoffPacketStatus: "draft_not_sent",
    ownerEvidenceHandoffSent: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    handoffPacketIsNotOwnerConfirmation: true,
    handoffPacketIsNotReadiness: true,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    safeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      not_sent_guard_only: true,
      no_handoff_sent: true,
      no_owner_confirmation_creation: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready owner handoff not sent guard summary");
  return summary;
}

export function createRendererReadyOwnerHandoffRedactionGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_OWNER_HANDOFF_REDACTION_GUARD_SCHEMA,
    safe_summary_only: true,
    ownerHandoffRedactionGuardStatus: "safe_labels_only",
    packetSummarySafeLabelsOnly: true,
    networkLocatorRejected: true,
    authMaterialRejected: true,
    modelLocatorRejected: true,
    motionLocatorRejected: true,
    cueMaterialRejected: true,
    rendererMaterialRejected: true,
    shellMaterialRejected: true,
    operatorPrivateNoteRejected: true,
    sourceValueEchoed: false,
    ownerEvidenceHandoffSent: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      redaction_guard_only: true,
      no_source_value_echo: true,
      no_handoff_sent: true,
      no_owner_confirmation_creation: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready owner handoff redaction guard summary");
  return summary;
}

export function createRendererReadyRealProbeRequestStubSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_REAL_PROBE_REQUEST_STUB_SCHEMA,
    safe_summary_only: true,
    rendererProbeRequestStatus: "draft_not_sent",
    rendererProbeRequested: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    ownerConfirmationRequired: true,
    ownerConfirmationConfirmed: false,
    ownerConfirmationCreated: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    safeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      request_stub_only: true,
      no_probe_request_sent: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready real probe request stub summary");
  return summary;
}

export function createRendererReadyRealProbeRequestRejectionGateSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_REAL_PROBE_REQUEST_REJECTION_GATE_SCHEMA,
    safe_summary_only: true,
    realProbeRequestRejectionGateStatus: "reject",
    unsafeRequestRejected: true,
    rejectionReasons: [...LIVE2D_RENDERER_READY_REAL_PROBE_REQUEST_REJECTION_REASONS],
    sourceValueEchoed: false,
    rendererProbeRequested: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      rejection_gate_only: true,
      no_source_value_echo: true,
      no_probe_request_sent: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready real probe request rejection gate summary");
  return summary;
}

export function createRendererReadyRealProbePreflightBlockerMatrixSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_REAL_PROBE_PREFLIGHT_BLOCKER_MATRIX_SCHEMA,
    safe_summary_only: true,
    realProbePreflightStatus: "no_go",
    probeAllowed: false,
    blockers: [...LIVE2D_RENDERER_READY_REAL_PROBE_PREFLIGHT_BLOCKERS],
    rendererProbeRequested: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      preflight_blocker_matrix_only: true,
      no_probe_request_sent: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready real probe preflight blocker matrix summary");
  return summary;
}

export function createRendererReadyEvidenceCollectorManifestStubSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_MANIFEST_STUB_SCHEMA,
    safe_summary_only: true,
    evidenceCollectorManifestStatus: "stub_not_executed",
    collectorLabels: [...LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_LABELS],
    collectorsExecuted: false,
    realRendererEvidencePresent: false,
    sourceValueEchoed: false,
    rendererProbeRequested: false,
    rendererProbeExecuted: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      manifest_stub_only: true,
      no_collector_execution: true,
      no_source_value_echo: true,
      no_probe_request_sent: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence collector manifest stub summary");
  return summary;
}

export function createRendererReadyEvidenceCollectorRedactionGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_REDACTION_GUARD_SCHEMA,
    safe_summary_only: true,
    collectorRedactionGuardStatus: "safe_summary_only",
    collectorOutputSafeSummaryOnly: true,
    networkLocatorRejected: true,
    authMaterialRejected: true,
    modelLocatorRejected: true,
    motionLocatorRejected: true,
    cueMaterialRejected: true,
    rendererMaterialRejected: true,
    shellMaterialRejected: true,
    evidenceBodyRejected: true,
    sourceValueEchoed: false,
    collectorsExecuted: false,
    realRendererEvidencePresent: false,
    rendererProbeExecuted: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      redaction_guard_only: true,
      no_source_value_echo: true,
      no_collector_execution: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence collector redaction guard summary");
  return summary;
}

export function createRendererReadyEvidenceCollectorNoExecutionGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_NO_EXECUTION_GUARD_SCHEMA,
    safe_summary_only: true,
    collectorNoExecutionGuardStatus: "blocked_no_execution",
    collectorExecutionAllowed: false,
    collectorExecutionRequested: false,
    collectorExecutionStarted: false,
    collectorsExecuted: false,
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    realEvidenceCollectionStarted: false,
    realRendererEvidencePresent: false,
    rendererProbeRequested: false,
    rendererProbeExecuted: false,
    browserProbeExecuted: false,
    live2dExecutionStarted: false,
    modelLoadExecuted: false,
    sceneLoadExecuted: false,
    cueApplicationExecuted: false,
    heartbeatCollectionExecuted: false,
    sourceValueEchoed: false,
    ownerConfirmationConfirmed: false,
    ownerConfirmationCreated: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    actual_ingestion_allowed: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      no_execution_guard_only: true,
      no_collector_execution: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_real_evidence_collection_started: true,
      no_source_value_echo: true,
      no_probe_request_sent: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence collector no-execution guard summary");
  return summary;
}

export function createRendererReadyEvidenceCollectorSafeOutputSchemaSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_SAFE_OUTPUT_SCHEMA,
    safe_summary_only: true,
    collectorSafeOutputSchemaStatus: "schema_only_not_output",
    safeOutputFields: [...LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_SAFE_OUTPUT_FIELDS],
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    realEvidenceCollectionStarted: false,
    realRendererEvidencePresent: false,
    rawValueEchoed: false,
    sourceValueEchoed: false,
    unsafeMaterialAccepted: false,
    endpointAllowed: false,
    tokenAllowed: false,
    secretAllowed: false,
    rawRendererPayloadAllowed: false,
    rawCuePayloadAllowed: false,
    rawModelPathAllowed: false,
    rawMotionPathAllowed: false,
    collectorExecutionAllowed: false,
    collectorExecutionStarted: false,
    collectorsExecuted: false,
    rendererProbeExecuted: false,
    browserProbeExecuted: false,
    ownerConfirmationConfirmed: false,
    ownerConfirmationCreated: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      safe_output_schema_only: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_unsafe_material_acceptance: true,
      no_raw_value_echo: true,
      no_source_value_echo: true,
      no_collector_execution: true,
      no_real_evidence_collection_started: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence collector safe output schema summary");
  return summary;
}

export function createRendererReadyEvidenceCollectorUnsafeOutputRejectionSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_UNSAFE_OUTPUT_REJECTION_SCHEMA,
    safe_summary_only: true,
    collectorUnsafeOutputRejectionStatus: "reject_unsafe_output_labels_only",
    rejectedUnsafeOutputLabels: [...LIVE2D_RENDERER_READY_EVIDENCE_COLLECTOR_UNSAFE_OUTPUT_REJECTION_LABELS],
    unsafeOutputAccepted: false,
    unsafeMaterialAccepted: false,
    rawValueEchoed: false,
    sourceValueEchoed: false,
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    realEvidenceCollectionStarted: false,
    realRendererEvidencePresent: false,
    collectorExecutionStarted: false,
    collectorsExecuted: false,
    rendererProbeExecuted: false,
    browserProbeExecuted: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      unsafe_output_rejection_only: true,
      labels_only: true,
      no_unsafe_output_acceptance: true,
      no_unsafe_material_acceptance: true,
      no_raw_value_echo: true,
      no_source_value_echo: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_collector_execution: true,
      no_real_evidence_collection_started: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready evidence collector unsafe output rejection summary");
  return summary;
}

export function createRendererReadyPublicSummaryRedactionSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_PUBLIC_SUMMARY_REDACTION_SCHEMA,
    safe_summary_only: true,
    publicSummaryRedactionStatus: "safe_labels_counts_status_only",
    publicSurface: true,
    safeLabelsOnly: true,
    safeCountsOnly: true,
    safeStatusOnly: true,
    publicDetailLevel: "minimal_status",
    forbiddenMaterialPresent: false,
    networkLocatorMaterialPresent: false,
    authMaterialPresent: false,
    confidentialMaterialPresent: false,
    rendererMaterialPresent: false,
    cueMaterialPresent: false,
    modelReferenceMaterialPresent: false,
    motionReferenceMaterialPresent: false,
    operatorInstructionMaterialPresent: false,
    processDiagnosticMaterialPresent: false,
    ownerOnlyDetailPresent: false,
    publicSummaryFieldCount: 12,
    allowedPublicFields: Object.freeze([
      "safe_summary_only",
      "publicSummaryRedactionStatus",
      "readinessStatus",
      "priority1Status",
      "checkedRowCount",
      "motionDatasetBoundary",
      "trustedLoaderBoundary",
      "collectorBoundary",
      "ownerConfirmationStatus",
      "actualDataBoundary",
      "safeNextAction",
      "boundary_policy",
    ]),
    readinessStatus: "not_ready",
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetBoundary: "non_executable",
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderBoundary: "disabled",
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    collectorBoundary: "not_executed",
    collectorExecutionStarted: false,
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    realEvidenceCollectionStarted: false,
    realRendererEvidencePresent: false,
    ownerConfirmationStatus: "absent",
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actualDataBoundary: "not_started",
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    safeNextAction: "continue_safe_only_contract_work",
    boundary_policy: {
      ...createBoundaryPolicy(),
      public_summary_redaction_only: true,
      safe_status_only: true,
      safe_labels_only: true,
      safe_counts_only: true,
      no_forbidden_material: true,
      no_owner_only_detail: true,
      no_collector_execution: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_real_evidence_collection_started: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready public summary redaction summary");
  return summary;
}

export function createRendererReadyAdminSummaryRedactionSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_ADMIN_SUMMARY_REDACTION_SCHEMA,
    safe_summary_only: true,
    adminSummaryRedactionStatus: "ordinary_admin_safe_summary_only",
    adminOrdinarySummary: true,
    safeStatusOnly: true,
    safeLabelsOnly: true,
    diagnosticDetailLevel: "safe_status_no_values",
    ownerOnlyDetailRoleGated: true,
    ownerOnlyDetailPresent: false,
    forbiddenMaterialPresent: false,
    networkLocatorMaterialPresent: false,
    authMaterialPresent: false,
    confidentialMaterialPresent: false,
    rendererMaterialPresent: false,
    cueMaterialPresent: false,
    processDiagnosticMaterialPresent: false,
    modelReferenceMaterialPresent: false,
    motionReferenceMaterialPresent: false,
    readinessStatus: "not_ready",
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    collectorExecutionStarted: false,
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    realEvidenceCollectionStarted: false,
    realRendererEvidencePresent: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      admin_summary_redaction_only: true,
      safe_status_only: true,
      safe_labels_only: true,
      no_forbidden_material: true,
      no_owner_only_detail: true,
      owner_only_detail_role_gated: true,
      no_collector_execution: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_real_evidence_collection_started: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready admin summary redaction summary");
  return summary;
}

export function createRendererReadyOperatorHandoffNoActionGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_OPERATOR_HANDOFF_NO_ACTION_GUARD_SCHEMA,
    safe_summary_only: true,
    operatorHandoffNoActionGuardStatus: "plan_only_no_action",
    operatorHandoffPlanPresent: true,
    operatorHandoffSent: false,
    operatorActionExecuted: false,
    shellCommandExecuted: false,
    externalConnectionStarted: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actualRendererProbeExecuted: false,
    actualBrowserProbeExecuted: false,
    live2dExecutionStarted: false,
    collectorExecutionStarted: false,
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    realEvidenceCollectionStarted: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      operator_handoff_no_action_guard_only: true,
      plan_only: true,
      safe_status_only: true,
      no_operator_handoff_sent: true,
      no_operator_action_execution: true,
      no_shell_execution: true,
      no_external_connection_started: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_collector_execution: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_real_evidence_collection_started: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready operator handoff no-action guard summary");
  return summary;
}

export function createRendererReadyFinalPreOwnerBlockerSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_FINAL_PRE_OWNER_BLOCKER_SUMMARY_SCHEMA,
    safe_summary_only: true,
    finalPreOwnerBlockerSummaryStatus: "blocked_safe_labels_only",
    blockerSummaryOnly: true,
    remainingBlockers: [...LIVE2D_RENDERER_READY_FINAL_PRE_OWNER_BLOCKERS],
    remainingBlockerCount: LIVE2D_RENDERER_READY_FINAL_PRE_OWNER_BLOCKERS.length,
    explicitOwnerActionReceived: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actualRendererProbeExecuted: false,
    actualBrowserProbeExecuted: false,
    realRendererEvidencePresent: false,
    freshHeartbeatPresent: false,
    realModelLoadSupported: false,
    modelLoaded: false,
    sceneLoaded: false,
    cueCapabilityConfirmed: false,
    lastCueApplied: false,
    auditLinkPresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      final_pre_owner_blocker_summary_only: true,
      safe_status_only: true,
      safe_labels_only: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready final pre-owner blocker summary");
  return summary;
}

export function createRendererReadyLongContinuationCompletionReview2Summary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_LONG_CONTINUATION_COMPLETION_REVIEW2_SCHEMA,
    safe_summary_only: true,
    longContinuationCompletionReviewStatus: "review_only_continue",
    completionReviewOnly: true,
    stopCondition: false,
    completedArtifacts: [...LIVE2D_RENDERER_READY_LONG_CONTINUATION_REVIEW2_COMPLETED_ARTIFACTS],
    completedArtifactCount: LIVE2D_RENDERER_READY_LONG_CONTINUATION_REVIEW2_COMPLETED_ARTIFACTS.length,
    nextSafeTask: "implementation_gap_audit2",
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actualRendererProbeExecuted: false,
    actualBrowserProbeExecuted: false,
    realRendererEvidencePresent: false,
    collectorExecutionStarted: false,
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    realEvidenceCollectionStarted: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      long_continuation_completion_review2_only: true,
      completion_review_is_not_stop_condition: true,
      safe_status_only: true,
      safe_labels_only: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_collector_execution: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_real_evidence_collection_started: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready long continuation completion review2 summary");
  return summary;
}

export function createRendererReadyImplementationGapAudit2Summary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_IMPLEMENTATION_GAP_AUDIT2_SCHEMA,
    safe_summary_only: true,
    implementationGapAuditStatus: "blocked_safe_labels_only",
    implementationGapAuditOnly: true,
    gapLabels: [...LIVE2D_RENDERER_READY_IMPLEMENTATION_GAP_AUDIT2_GAPS],
    gapCount: LIVE2D_RENDERER_READY_IMPLEMENTATION_GAP_AUDIT2_GAPS.length,
    nextSafeTask: "pre_owner_wait_state2",
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actualRendererProbeExecuted: false,
    actualBrowserProbeExecuted: false,
    realRendererEvidencePresent: false,
    collectorExecutionStarted: false,
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    realEvidenceCollectionStarted: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      implementation_gap_audit2_only: true,
      safe_status_only: true,
      safe_labels_only: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_collector_execution: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_real_evidence_collection_started: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready implementation gap audit2 summary");
  return summary;
}

export function createRendererReadyPreOwnerWaitState2Summary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_PRE_OWNER_WAIT_STATE2_SCHEMA,
    safe_summary_only: true,
    preOwnerWaitStateStatus: "waiting_safe_labels_only",
    waitStateOnly: true,
    waitItems: [...LIVE2D_RENDERER_READY_PRE_OWNER_WAIT_STATE2_ITEMS],
    waitItemCount: LIVE2D_RENDERER_READY_PRE_OWNER_WAIT_STATE2_ITEMS.length,
    nextSafeTask: "owner_action_boundary_catalog2",
    ownerActionRequestedBySystem: false,
    ownerHandoffSent: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actualRendererProbeExecuted: false,
    actualBrowserProbeExecuted: false,
    realRendererEvidencePresent: false,
    collectorExecutionStarted: false,
    collectorOutputGenerated: false,
    collectorOutputAcceptedAsRealEvidence: false,
    auditExecutionStarted: false,
    realEvidenceCollectionStarted: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      pre_owner_wait_state2_only: true,
      wait_state_is_not_owner_confirmation: true,
      safe_status_only: true,
      safe_labels_only: true,
      no_owner_handoff_sent: true,
      no_owner_confirmation_creation: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_collector_execution: true,
      no_collector_output_generation: true,
      no_collector_output_accepted_as_real_evidence: true,
      no_audit_execution: true,
      no_real_evidence_collection_started: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready pre-owner wait state2 summary");
  return summary;
}

export function createRendererReadyAuditReferenceStubSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_AUDIT_REFERENCE_STUB_SCHEMA,
    safe_summary_only: true,
    rendererReadinessAuditReferenceRequired: true,
    rendererReadinessAuditReferencePresent: false,
    rendererReadinessAuditEntryCreated: false,
    auditExecutionStarted: false,
    sourceValueEchoed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    safeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      audit_reference_stub_only: true,
      no_audit_execution: true,
      no_source_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready audit reference stub summary");
  return summary;
}

export function createRendererReadyAuditReferenceMissingGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_AUDIT_REFERENCE_MISSING_GUARD_SCHEMA,
    safe_summary_only: true,
    auditReferencePresent: false,
    auditReferenceMissing: true,
    auditReferenceMissingReason: "audit_reference_missing",
    rendererReadinessAuditReferencePresent: false,
    rendererReadinessAuditEntryCreated: false,
    auditExecutionStarted: false,
    sourceValueEchoed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    safeNextAction: "keep_renderer_ready_false_until_audit_reference_and_owner_action",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      audit_reference_missing_guard_only: true,
      no_audit_execution: true,
      no_source_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready audit reference missing guard summary");
  return summary;
}

export function createRendererReadySafeOperatorChecklistStubSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_STUB_SCHEMA,
    safe_summary_only: true,
    operatorChecklistStatus: "draft_safe_stub",
    operatorChecklistGenerated: true,
    operatorChecklistExecuted: false,
    operatorActionExecuted: false,
    safeChecklistItems: [...LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_ITEMS],
    networkLocatorIncluded: false,
    authMaterialIncluded: false,
    locatorValueIncluded: false,
    shellMaterialIncluded: false,
    sourceValueEchoed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    safeNextAction: "keep_waiting_for_explicit_owner_action_and_real_renderer_evidence",
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      operator_checklist_stub_only: true,
      no_operator_action_execution: true,
      no_source_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready safe operator checklist stub summary");
  return summary;
}

export function createRendererReadySafeOperatorChecklistRedactionGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_REDACTION_GUARD_SCHEMA,
    safe_summary_only: true,
    operatorChecklistRedactionStatus: "safe_summary_only",
    unsafeChecklistMaterialRejected: true,
    safeRejectionLabels: [...LIVE2D_RENDERER_READY_SAFE_OPERATOR_CHECKLIST_SAFE_REJECTION_LABELS],
    shellMaterialRejected: true,
    operatorMaterialRejected: true,
    networkLocatorMaterialRejected: true,
    authMaterialRejected: true,
    modelLocatorMaterialRejected: true,
    motionLocatorMaterialRejected: true,
    rendererMaterialRejected: true,
    evidenceBodyMaterialRejected: true,
    ownerNoteMaterialRejected: true,
    sourceValueEchoed: false,
    operatorChecklistExecuted: false,
    operatorActionExecuted: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      operator_checklist_redaction_guard_only: true,
      no_source_value_echo: true,
      no_operator_action_execution: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready safe operator checklist redaction guard summary");
  return summary;
}

export function createRendererReadyRealEvidenceRequestFinalNoGoSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_FINAL_NO_GO_SCHEMA,
    safe_summary_only: true,
    realEvidenceRequestStatus: "no_go",
    realEvidenceRequestSent: false,
    realEvidenceCollectionStarted: false,
    realRendererProbeStarted: false,
    ownerConfirmationRequired: true,
    ownerConfirmationConfirmed: false,
    noGoReasons: [...LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_NO_GO_REASONS],
    sourceValueEchoed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      real_evidence_request_final_no_go_only: true,
      no_real_evidence_request_send: true,
      no_real_evidence_collection_start: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready real evidence request final no-go summary");
  return summary;
}

export function createRendererReadyPreflightRouteManifestStubSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_PREFLIGHT_ROUTE_MANIFEST_STUB_SCHEMA,
    safe_summary_only: true,
    preflightRouteManifestStatus: "draft",
    preflightRouteExecuted: false,
    realPreflightStarted: false,
    requiredPreflightSections: [...LIVE2D_RENDERER_READY_PREFLIGHT_ROUTE_REQUIRED_SECTIONS],
    networkLocatorIncluded: false,
    authMaterialIncluded: false,
    locatorValueIncluded: false,
    sourceValueEchoed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      preflight_route_manifest_stub_only: true,
      no_preflight_route_execution: true,
      no_real_preflight_start: true,
      no_source_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready preflight route manifest stub summary");
  return summary;
}

export function createRendererReadyPreflightRouteUnsafeFieldGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_PREFLIGHT_ROUTE_UNSAFE_FIELD_GUARD_SCHEMA,
    safe_summary_only: true,
    preflightRouteUnsafeFieldGuardStatus: "safe_summary_only",
    unsafeFieldRejected: true,
    safeRejectionLabels: [...LIVE2D_RENDERER_READY_PREFLIGHT_ROUTE_SAFE_REJECTION_LABELS],
    networkLocatorMaterialRejected: true,
    authMaterialRejected: true,
    privateLocatorMaterialRejected: true,
    modelLocatorMaterialRejected: true,
    motionLocatorMaterialRejected: true,
    rendererMaterialRejected: true,
    cueMaterialRejected: true,
    evidenceBodyMaterialRejected: true,
    shellMaterialRejected: true,
    sourceValueEchoed: false,
    preflightRouteExecuted: false,
    realPreflightStarted: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      preflight_route_unsafe_field_guard_only: true,
      no_source_value_echo: true,
      no_preflight_route_execution: true,
      no_real_preflight_start: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready preflight route unsafe field guard summary");
  return summary;
}

export function createRendererReadyOwnerScopeRequirementSurfaceSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_OWNER_SCOPE_REQUIREMENT_SURFACE_SCHEMA,
    safe_summary_only: true,
    ownerScopeRequired: true,
    ownerScopeConfirmed: false,
    ownerScopeStatus: "missing",
    ownerScopeMissingBlocksRendererEvidence: true,
    ownerScopeMissingBlocksReadiness: true,
    probeAllowed: false,
    sourceValueEchoed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      owner_scope_requirement_surface_only: true,
      no_owner_confirmation_creation: true,
      no_source_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready owner scope requirement surface summary");
  return summary;
}

export function createRendererReadyOwnerScopeMissingRejectionGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_OWNER_SCOPE_MISSING_REJECTION_GUARD_SCHEMA,
    safe_summary_only: true,
    ownerScopeConfirmed: false,
    ownerScopeStatus: "missing",
    probeRequestRejected: true,
    readinessRequestRejected: true,
    rejectionReason: "owner_scope_missing",
    probeAllowed: false,
    sourceValueEchoed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      owner_scope_missing_rejection_guard_only: true,
      no_owner_confirmation_creation: true,
      no_source_value_echo: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready owner scope missing rejection guard summary");
  return summary;
}

export function createRendererReadyAuditLinkRequirementSurfaceSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_AUDIT_LINK_REQUIREMENT_SURFACE_SCHEMA,
    safe_summary_only: true,
    auditLinkRequired: true,
    auditLinkPresent: false,
    auditLinkStatus: "missing",
    auditLinkMissingBlocksReadiness: true,
    auditExecutionStarted: false,
    auditBodyPresent: false,
    sourceValueEchoed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      audit_link_requirement_surface_only: true,
      no_audit_execution: true,
      no_source_value_echo: true,
      no_owner_confirmation_creation: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready audit link requirement surface summary");
  return summary;
}

export function createRendererReadyAuditLinkMissingRejectionGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_AUDIT_LINK_MISSING_REJECTION_GUARD_SCHEMA,
    safe_summary_only: true,
    auditLinkPresent: false,
    auditLinkStatus: "missing",
    readinessRequestRejected: true,
    goNoGoApprovalRejected: true,
    rejectionReason: "audit_link_missing",
    goApproved: false,
    auditExecutionStarted: false,
    sourceValueEchoed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      audit_link_missing_rejection_guard_only: true,
      no_audit_execution: true,
      no_source_value_echo: true,
      no_owner_confirmation_creation: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready audit link missing rejection guard summary");
  return summary;
}

export function createRendererReadyTrustedLoaderPreauthBlockerSurfaceSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_TRUSTED_LOADER_PREAUTH_BLOCKER_SURFACE_SCHEMA,
    safe_summary_only: true,
    trustedLoaderPreauthRequired: true,
    trustedLoaderPreauthGranted: false,
    trustedLoaderPreauthStatus: "blocked",
    trustedLoaderEnablementRejected: true,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    trustedLoaderBoundary: "disabled",
    loaderTrusted: false,
    loaderAllowlistActive: false,
    allowlistPreauthBlocked: true,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    ownerScopeAccepted: false,
    auditLinkPresent: false,
    auditExecutionStarted: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    blockerReasons: [
      "trusted_loader_preauth_missing",
      "owner_confirmation_missing",
      "audit_link_missing",
      "real_renderer_evidence_missing",
      "priority1_blocked",
      "checked_row_count_zero",
    ],
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      trusted_loader_preauth_blocker_surface_only: true,
      no_trusted_loader_enablement: true,
      no_allowlist_enablement: true,
      no_loader_trusted_status: true,
      no_owner_confirmation_creation: true,
      no_audit_execution: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready trusted loader preauth blocker surface summary");
  return summary;
}

export function createRendererReadyTrustedLoaderPreauthRejectionGuardSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_TRUSTED_LOADER_PREAUTH_REJECTION_GUARD_SCHEMA,
    safe_summary_only: true,
    rejectedAttemptType: "trusted_loader_preauth_missing",
    trustedLoaderEnablementRequested: true,
    trustedLoaderEnablementRejected: true,
    rejectionReason: "trusted_loader_preauth_missing",
    trustedLoaderPreauthGranted: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    trustedLoaderBoundary: "disabled",
    loaderTrusted: false,
    loaderAllowlistActive: false,
    allowlistPreauthBlocked: true,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    ownerScopeAccepted: false,
    auditLinkPresent: false,
    auditExecutionStarted: false,
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      trusted_loader_preauth_rejection_guard_only: true,
      no_trusted_loader_enablement: true,
      no_allowlist_enablement: true,
      no_loader_trusted_status: true,
      no_owner_confirmation_creation: true,
      no_audit_execution: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready trusted loader preauth rejection guard summary");
  return summary;
}

export function createRendererReadyRuntimeReadinessFinalNoGoSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_RUNTIME_READINESS_FINAL_NO_GO_SCHEMA,
    safe_summary_only: true,
    runtimeReadinessFinalNoGo: true,
    runtimeReadinessClaimed: false,
    runtimeReadinessStatus: "no_go",
    runtimeReadinessApproved: false,
    goApproved: false,
    runtimeReadinessNoGoReasons: [
      "owner_confirmation_missing",
      "real_renderer_evidence_missing",
      "fresh_heartbeat_missing",
      "audit_link_missing",
      "priority1_blocked",
      "checked_row_count_zero",
      "trusted_loader_disabled",
    ],
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    realRendererEvidencePresent: false,
    freshHeartbeatPresent: false,
    auditLinkPresent: false,
    auditExecutionStarted: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    trustedLoaderBoundary: "disabled",
    rendererProbeExecuted: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    productionReadinessClaimed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      runtime_readiness_final_no_go_only: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_creation: true,
      no_audit_execution: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_actual_data_task_started: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready runtime readiness final no-go summary");
  return summary;
}

export function createRendererReadyProductionReadinessFinalNoGoSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_PRODUCTION_READINESS_FINAL_NO_GO_SCHEMA,
    safe_summary_only: true,
    productionReadinessFinalNoGo: true,
    productionReadinessClaimed: false,
    productionReadinessStatus: "no_go",
    productionReadinessApproved: false,
    goApproved: false,
    productionReadinessNoGoReasons: [
      "runtime_readiness_not_claimed",
      "owner_confirmation_missing",
      "actual_data_task_not_started",
      "priority1_blocked",
      "checked_row_count_zero",
      "trusted_loader_disabled",
      "motion_dataset_non_executable",
    ],
    runtimeReadinessClaimed: false,
    runtimeReadinessApproved: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    trustedLoaderBoundary: "disabled",
    rendererProbeExecuted: false,
    realRendererEvidencePresent: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      production_readiness_final_no_go_only: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_audit_execution: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_actual_model_load: true,
      no_actual_scene_load: true,
      no_actual_cue_application: true,
      no_actual_heartbeat_collection: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready production readiness final no-go summary");
  return summary;
}

export function createRendererReadyExtendedGuardCompletionReviewSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_EXTENDED_GUARD_COMPLETION_REVIEW_SCHEMA,
    safe_summary_only: true,
    extendedGuardCompletionReview: true,
    reviewedTaskRange: "DZ_to_ED",
    reviewedSafeGuards: [
      "audit_link_missing_rejection_guard",
      "trusted_loader_preauth_blocker_surface",
      "trusted_loader_preauth_rejection_guard",
      "runtime_readiness_final_no_go",
      "production_readiness_final_no_go",
    ],
    completionReviewOnly: true,
    stopAfterReview: false,
    safeNextAction: "LIVE2D-RENDERER-READY-REAL-EVIDENCE-REQUEST-FINAL-WAIT-STATE1",
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    rendererProbeExecuted: false,
    auditExecutionStarted: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    trustedLoaderBoundary: "disabled",
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      extended_guard_completion_review_only: true,
      no_stop_at_completion_review: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_audit_execution: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready extended guard completion review summary");
  return summary;
}

export function createRendererReadyRealEvidenceRequestFinalWaitStateSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_FINAL_WAIT_STATE_SCHEMA,
    safe_summary_only: true,
    realEvidenceRequestStatus: "waiting_for_explicit_owner_action",
    realEvidenceRequestSent: false,
    realEvidenceCollectionStarted: false,
    realRendererProbeStarted: false,
    realRendererEvidencePresent: false,
    ownerConfirmationRequired: true,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    safeNextAction: "wait_for_explicit_owner_action_and_real_renderer_evidence",
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    rendererProbeExecuted: false,
    auditExecutionStarted: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    trustedLoaderBoundary: "disabled",
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      real_evidence_request_final_wait_state_only: true,
      no_real_evidence_request_sent: true,
      no_real_evidence_collection_started: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_audit_execution: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready real evidence request final wait state summary");
  return summary;
}

export function createRendererReadyRealEvidenceRequestRejectionFixturePackSummary() {
  const summary = {
    schema: LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_REJECTION_FIXTURE_PACK_SCHEMA,
    safe_summary_only: true,
    synthetic_only: true,
    rejectionFixturePackOnly: true,
    realEvidenceRequestRejected: true,
    realEvidenceRequestSent: false,
    realEvidenceCollectionStarted: false,
    realRendererProbeStarted: false,
    realRendererEvidencePresent: false,
    rejectedRealEvidenceRequestCases: [
      ...LIVE2D_RENDERER_READY_REAL_EVIDENCE_REQUEST_REJECTION_FIXTURE_PACK_SAFE_PUBLIC_CASES,
    ],
    rawValueEchoed: false,
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    rendererReadyClaimed: false,
    rendererReadyCandidate: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    rendererProbeExecuted: false,
    auditExecutionStarted: false,
    trustedLoaderAllowlistEnabled: false,
    trusted_loader_allowlist_enabled: false,
    trustedLoaderBoundary: "disabled",
    priority1Status: "BLOCKED",
    priority1_status: "BLOCKED",
    checkedRowCount: 0,
    checked_row_count: 0,
    motionDatasetExecutable: false,
    motion_dataset_executable: false,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      real_evidence_request_rejection_fixture_pack_only: true,
      synthetic_only: true,
      no_raw_value_echo: true,
      no_real_evidence_request_sent: true,
      no_real_evidence_collection_started: true,
      no_actual_renderer_probe: true,
      no_actual_browser_probe: true,
      no_actual_live2d_execution: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_audit_execution: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "renderer ready real evidence request rejection fixture pack summary");
  return summary;
}

export function createMotionDatasetPlanningCompletionReviewPacketSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_PACKET_SCHEMA,
    statusKey: "motion_dataset_planning_completion_review_packet_status",
    status: "planning_only_blocked",
    boundaries: {
      planning_completion_review_packet_only_boundary: true,
      no_actual_data_ready_claim_boundary: true,
      no_owner_confirmation_created_boundary: true,
      no_real_row_ingestion_boundary: true,
      planning_completion_review_packet_only: true,
    },
    flags: {
      planning_completion_claims_actual_ready: false,
      owner_confirmation_confirmed: false,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
    },
    arrays: {
      required_completed_planning_artifacts: [...LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_COMPLETED_ARTIFACTS],
      required_unresolved_blockers: [...LIVE2D_MOTION_DATASET_PLANNING_COMPLETION_REVIEW_UNRESOLVED_BLOCKERS],
    },
    blockedReasons: [
      "planning_completion_review_packet_planning_only",
      "planning_completion_review_packet_no_actual_data_ready_claim",
      "planning_completion_review_packet_no_owner_confirmation_created",
      "planning_completion_review_packet_priority1_blocked",
    ],
    safeNextAction: "continue_owner_wait_without_actual_data_readiness_claim",
    context: "motion dataset planning completion review packet summary",
  }, input);
}

export function createMotionDatasetReadinessNonSweeteningSweepSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_SWEEP_SCHEMA,
    statusKey: "motion_dataset_readiness_non_sweetening_sweep_status",
    status: "planning_only_blocked",
    boundaries: {
      readiness_non_sweetening_sweep_only_boundary: true,
      no_readiness_promotion_boundary: true,
      readiness_non_sweetening_sweep_only: true,
    },
    flags: {
      readiness_sweep_promoted_ready: false,
      runtime_readiness_claimed: false,
      production_readiness_claimed: false,
      renderer_ready: false,
      browser_cue_delivery_ready: false,
      actual_ingestion_allowed: false,
    },
    arrays: {
      required_surfaces_checked: [...LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_SURFACES],
      required_false_ready_rejection_labels: [...LIVE2D_MOTION_DATASET_READINESS_NON_SWEETENING_FALSE_READY_REJECTIONS],
    },
    blockedReasons: [
      "readiness_non_sweetening_sweep_planning_only",
      "readiness_non_sweetening_sweep_no_readiness_promotion",
      "readiness_non_sweetening_sweep_checked_row_count_zero",
      "readiness_non_sweetening_sweep_priority1_blocked",
    ],
    safeNextAction: "continue_planning_without_readiness_promotion",
    context: "motion dataset readiness non-sweetening sweep summary",
  }, input);
}

export function createMotionDatasetOwnerWaitStatePacketSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_PACKET_SCHEMA,
    statusKey: "motion_dataset_owner_wait_state_packet_status",
    status: "planning_only_blocked",
    boundaries: {
      owner_wait_state_packet_only_boundary: true,
      no_owner_confirmation_created_boundary: true,
      no_actual_data_task_started_boundary: true,
      owner_wait_state_packet_only: true,
    },
    flags: {
      owner_confirmation_required: true,
      owner_confirmation_confirmed: false,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
    },
    arrays: {
      required_waiting_on_owner_items: [...LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_OWNER_ITEMS],
      required_waiting_on_system_items: [...LIVE2D_MOTION_DATASET_OWNER_WAIT_STATE_SYSTEM_ITEMS],
    },
    blockedReasons: [
      "owner_wait_state_packet_planning_only",
      "owner_wait_state_packet_no_owner_confirmation_created",
      "owner_wait_state_packet_no_actual_data_task_started",
      "owner_wait_state_packet_priority1_blocked",
    ],
    safeNextAction: "wait_for_future_owner_confirmation_and_system_prerequisites",
    context: "motion dataset owner wait-state packet summary",
  }, input);
}

export function createMotionDatasetActualDataFreezeStateLedgerSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LEDGER_SCHEMA,
    statusKey: "motion_dataset_actual_data_freeze_state_ledger_status",
    status: "planning_only_blocked",
    boundaries: {
      freeze_state_ledger_only_boundary: true,
      actual_data_frozen_pending_owner_task: true,
      no_actual_data_task_started_boundary: true,
      no_real_row_ingestion_boundary: true,
      no_row_body_read_boundary: true,
      freeze_state_ledger_only: true,
    },
    flags: {
      actual_data_frozen_pending_owner_task: true,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
      owner_confirmation_confirmed: false,
    },
    arrays: {
      required_frozen_state_labels: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_STATE_LABELS],
      required_unfreeze_conditions: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_FREEZE_UNFREEZE_CONDITIONS],
    },
    blockedReasons: [
      "actual_data_freeze_state_ledger_planning_only",
      "actual_data_freeze_state_ledger_pending_owner_task",
      "actual_data_freeze_state_ledger_no_actual_data_task_started",
      "actual_data_freeze_state_ledger_priority1_blocked",
    ],
    safeNextAction: "future_owner_confirmed_unfreeze_conditions_required",
    context: "motion dataset actual data freeze-state ledger summary",
  }, input);
}

export function createMotionDatasetFinalOwnerActualDataPacketSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_SCHEMA,
    statusKey: "motion_dataset_final_owner_actual_data_packet_status",
    status: "planning_only_blocked",
    boundaries: {
      final_owner_actual_data_packet_only_boundary: true,
      no_owner_confirmation_created_boundary: true,
      no_actual_data_task_started_boundary: true,
      no_actual_data_preauthorized_boundary: true,
      no_real_row_ingestion_boundary: true,
      no_row_body_read_boundary: true,
      final_owner_actual_data_packet_only: true,
    },
    flags: {
      owner_confirmation_required: true,
      owner_confirmation_confirmed: false,
      actual_data_preauthorized: false,
      actual_data_task_started: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
      motion_dataset_executable: false,
    },
    arrays: {
      required_owner_packet_sections: [...LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_REQUIRED_SECTIONS],
      required_owner_packet_blockers: [...LIVE2D_MOTION_DATASET_FINAL_OWNER_ACTUAL_DATA_PACKET_BLOCKERS],
    },
    blockedReasons: [
      "final_owner_actual_data_packet_planning_only",
      "final_owner_actual_data_packet_no_owner_confirmation_created",
      "final_owner_actual_data_packet_no_actual_data_task_started",
      "final_owner_actual_data_packet_no_actual_data_preauthorized",
      "final_owner_actual_data_packet_priority1_blocked",
    ],
    safeNextAction: "future_owner_confirmation_required_before_actual_data_task",
    context: "motion dataset final owner actual data packet summary",
  }, input);
}

export function createMotionDatasetActualDataTaskRunbookNoActionPacketSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_NO_ACTION_PACKET_SCHEMA,
    statusKey: "motion_dataset_actual_data_task_runbook_no_action_packet_status",
    status: "planning_only_blocked",
    boundaries: {
      runbook_no_action_packet_only_boundary: true,
      no_actual_data_task_started_boundary: true,
      no_external_action_boundary: true,
      no_real_row_ingestion_boundary: true,
      no_row_body_read_boundary: true,
      runbook_no_action_packet_only: true,
    },
    flags: {
      actual_data_task_started: false,
      external_action_performed: false,
      actual_ingestion_allowed: false,
      real_row_data_present: false,
      owner_confirmation_confirmed: false,
    },
    arrays: {
      required_safe_runbook_steps: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_SAFE_STEPS],
      required_runbook_blockers: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_TASK_RUNBOOK_BLOCKERS],
    },
    blockedReasons: [
      "actual_data_task_runbook_no_action_packet_planning_only",
      "actual_data_task_runbook_no_action_packet_no_external_action",
      "actual_data_task_runbook_no_action_packet_no_actual_data_task_started",
      "actual_data_task_runbook_no_action_packet_no_real_row_ingestion",
      "actual_data_task_runbook_no_action_packet_priority1_blocked",
    ],
    safeNextAction: "future_owner_confirmed_actual_data_task_runbook_review_required",
    context: "motion dataset actual data task runbook no-action packet summary",
  }, input);
}

export function createMotionDatasetAuditExecutionRequestEnvelopeSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_ENVELOPE_SCHEMA,
    statusKey: "motion_dataset_audit_execution_request_envelope_status",
    status: "planning_only_blocked",
    boundaries: {
      audit_execution_request_envelope_only_boundary: true,
      no_audit_execution_started_boundary: true,
      no_real_ingestion_audit_event_boundary: true,
      no_real_row_ingestion_boundary: true,
      no_row_body_read_boundary: true,
      audit_execution_request_envelope_only: true,
    },
    flags: {
      audit_execution_started: false,
      real_ingestion_audit_event_created: false,
      actual_data_task_started: false,
      row_body_read: false,
      real_row_data_present: false,
      actual_ingestion_allowed: false,
      owner_confirmation_confirmed: false,
    },
    arrays: {
      required_future_audit_execution_inputs: [...LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_REQUIRED_INPUTS],
      required_future_audit_execution_outputs: [...LIVE2D_MOTION_DATASET_AUDIT_EXECUTION_REQUEST_REQUIRED_OUTPUTS],
    },
    blockedReasons: [
      "audit_execution_request_envelope_planning_only",
      "audit_execution_request_envelope_no_audit_execution_started",
      "audit_execution_request_envelope_no_real_ingestion_audit_event",
      "audit_execution_request_envelope_no_real_row_ingestion",
      "audit_execution_request_envelope_priority1_blocked",
    ],
    safeNextAction: "future_owner_confirmed_audit_execution_request_required",
    context: "motion dataset audit execution request envelope summary",
  }, input);
}

export function createMotionDatasetParserDryRunExecutionRequestEnvelopeSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_ENVELOPE_SCHEMA,
    statusKey: "motion_dataset_parser_dry_run_execution_request_envelope_status",
    status: "planning_only_blocked",
    boundaries: {
      parser_dry_run_execution_request_envelope_only_boundary: true,
      no_parser_dry_run_execution_boundary: true,
      no_parser_execution_boundary: true,
      no_actual_file_read_boundary: true,
      no_real_row_ingestion_boundary: true,
      no_row_body_read_boundary: true,
      parser_dry_run_execution_request_envelope_only: true,
    },
    flags: {
      parser_dry_run_executed: false,
      row_body_parser_enabled: false,
      row_body_parser_executed: false,
      actual_file_read: false,
      row_body_read: false,
      real_row_data_present: false,
      actual_ingestion_allowed: false,
    },
    arrays: {
      required_future_parser_execution_request_fields: [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_REQUIRED_FIELDS],
      required_future_parser_execution_blockers: [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_EXECUTION_REQUEST_BLOCKERS],
    },
    blockedReasons: [
      "parser_dry_run_execution_request_envelope_planning_only",
      "parser_dry_run_execution_request_envelope_no_parser_dry_run_execution",
      "parser_dry_run_execution_request_envelope_no_parser_execution",
      "parser_dry_run_execution_request_envelope_no_actual_file_read",
      "parser_dry_run_execution_request_envelope_no_real_row_ingestion",
      "parser_dry_run_execution_request_envelope_priority1_blocked",
    ],
    safeNextAction: "future_owner_confirmed_parser_dry_run_execution_request_required",
    context: "motion dataset parser dry-run execution request envelope summary",
  }, input);
}

export function createMotionDatasetRedactionScanExecutionEnvelopeStubSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_ENVELOPE_STUB_SCHEMA,
    statusKey: "motion_dataset_redaction_scan_execution_envelope_stub_status",
    status: "planning_only_blocked",
    boundaries: { redaction_scan_execution_envelope_stub_only_boundary: true, no_redaction_scan_executed_boundary: true, no_actual_file_read_boundary: true, no_real_row_ingestion_boundary: true, no_row_body_read_boundary: true, redaction_scan_execution_envelope_stub_only: true },
    flags: { redaction_scan_executed: false },
    arrays: { required_future_redaction_scan_inputs: [...LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_REQUIRED_INPUTS], required_future_redaction_scan_outputs: [...LIVE2D_MOTION_DATASET_REDACTION_SCAN_EXECUTION_REQUIRED_OUTPUTS] },
    blockedReasons: ["redaction_scan_execution_envelope_stub_planning_only","redaction_scan_execution_envelope_stub_no_redaction_scan_executed","redaction_scan_execution_envelope_stub_no_actual_file_read","redaction_scan_execution_envelope_stub_no_real_row_ingestion","redaction_scan_execution_envelope_stub_priority1_blocked"],
    safeNextAction: "future_owner_confirmed_redaction_scan_execution_required",
    context: "motion dataset redaction scan execution envelope stub summary",
  }, input);
}

export function createMotionDatasetRowFileQuarantineStagingEnvelopeSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_ENVELOPE_SCHEMA,
    statusKey: "motion_dataset_row_file_quarantine_staging_envelope_status",
    status: "planning_only_blocked",
    boundaries: { quarantine_staging_envelope_only_boundary: true, no_quarantine_completed_boundary: true, no_actual_file_read_boundary: true, no_real_row_ingestion_boundary: true, no_row_body_read_boundary: true, quarantine_staging_envelope_only: true },
    flags: { actual_file_content_accepted: false, actual_row_content_accepted: false },
    arrays: { required_future_quarantine_metadata: [...LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_REQUIRED_METADATA], required_future_quarantine_blockers: [...LIVE2D_MOTION_DATASET_ROW_FILE_QUARANTINE_STAGING_REQUIRED_BLOCKERS] },
    blockedReasons: ["quarantine_staging_envelope_planning_only", "quarantine_staging_envelope_no_quarantine_completed", "quarantine_staging_envelope_no_actual_file_read", "quarantine_staging_envelope_no_real_row_ingestion", "quarantine_staging_envelope_no_row_body_read", "quarantine_staging_envelope_priority1_blocked"],
    safeNextAction: "future_owner_confirmed_quarantine_staging_required_before_file_review",
    context: "motion dataset row file quarantine staging envelope summary",
  }, input);
}

export function createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary(input = {}) {
  return createMotionDatasetPlanningOnlyGateSummary({
    schema: LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_ENVELOPE_SCHEMA,
    statusKey: "motion_dataset_owner_confirmation_preflight_envelope_status",
    status: "planning_only_blocked",
    boundaries: {
      owner_confirmation_preflight_envelope_only_boundary: true,
      no_owner_confirmation_created_boundary: true,
      no_owner_confirmation_confirmed_boundary: true,
      no_actual_data_task_started_boundary: true,
      owner_confirmation_preflight_envelope_only: true,
    },
    arrays: {
      required_future_owner_confirmation_scopes: [...LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_SCOPES],
      required_future_owner_confirmation_evidence_refs: [...LIVE2D_MOTION_DATASET_OWNER_CONFIRMATION_PREFLIGHT_REQUIRED_EVIDENCE_REFS],
    },
    blockedReasons: [
      "owner_confirmation_preflight_envelope_planning_only",
      "owner_confirmation_preflight_envelope_no_owner_confirmation_created",
      "owner_confirmation_preflight_envelope_no_owner_confirmation_confirmed",
      "owner_confirmation_preflight_envelope_no_actual_data_task_started",
      "owner_confirmation_preflight_envelope_priority1_blocked",
      "owner_confirmation_preflight_envelope_no_go_preserved",
    ],
    safeNextAction: "future_owner_confirmation_required_before_actual_data_task",
    context: "motion dataset owner confirmation preflight envelope summary",
  }, input);
}

export function createMotionDatasetFinalActualDataPreauthBlockerGateSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(source.actual_data_preauthorized || source.actual_data_task_started || source.actual_ingestion_allowed || source.real_row_data_present || source.row_body_read || Number(source.checked_row_count ?? 0) > 0 || source.motion_dataset_executable || source.runtime_readiness_claimed || source.production_readiness_claimed || source.owner_confirmation_confirmed || source.blocker_resolved || source.priority1_status === "RESOLVED" || source.go_nogo_status === "go");
  const blockedReasons = ["final_actual_data_preauth_blocker_gate_planning_only", "final_actual_data_preauth_blocker_gate_no_actual_data_preauthorized", "final_actual_data_preauth_blocker_gate_no_real_row_ingestion", "final_actual_data_preauth_blocker_gate_no_row_body_read", "final_actual_data_preauth_blocker_gate_priority1_blocked", "final_actual_data_preauth_blocker_gate_checked_row_count_zero", "final_actual_data_preauth_blocker_gate_no_go_preserved"];
  if (rejectedAttempt) blockedReasons.push("final_actual_data_preauth_blocker_gate_rejected_state_promotion");
  const summary = {
    schema: LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_BLOCKER_GATE_SCHEMA,
    motion_dataset_final_actual_data_preauth_blocker_gate_status: "planning_only_blocked",
    planning_only_boundary: true,
    preauth_blocker_gate_only_boundary: true,
    no_actual_data_preauthorized_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    preauth_blocker_gate_only: true,
    actual_data_preauthorized: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    blocker_resolved: false,
    required_preauth_blockers: [...LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_REQUIRED_BLOCKERS],
    required_preauth_clearance_conditions: [...LIVE2D_MOTION_DATASET_FINAL_ACTUAL_DATA_PREAUTH_CLEARANCE_CONDITIONS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_real_data_go_nogo_required_before_advance_approval",
    boundary_policy: { ...createBoundaryPolicy(), planning_only: true, preauth_blocker_gate_only: true, no_actual_data_preauthorized: true, no_real_row_ingestion: true, no_row_body_read: true, no_motion_execution: true, no_runtime_readiness_claim: true, no_production_readiness_claim: true },
  };
  assertSafePublicObject(summary, "motion dataset final actual data preauth blocker gate summary");
  return summary;
}

export function createMotionDatasetOwnerSubmissionReadinessLedgerSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(source.owner_submission_received || source.owner_submission_accepted || source.actual_data_task_started || source.actual_ingestion_allowed || source.real_row_data_present || source.row_body_read || Number(source.checked_row_count ?? 0) > 0 || source.motion_dataset_executable || source.runtime_readiness_claimed || source.production_readiness_claimed || source.owner_confirmation_confirmed || source.priority1_status === "RESOLVED" || source.go_nogo_status === "go");
  const blockedReasons = ["submission_readiness_ledger_planning_only", "submission_readiness_ledger_no_submission_accepted", "submission_readiness_ledger_no_real_row_ingestion", "submission_readiness_ledger_no_row_body_read", "submission_readiness_ledger_priority1_blocked", "submission_readiness_ledger_no_go_preserved"];
  if (rejectedAttempt) blockedReasons.push("submission_readiness_ledger_rejected_state_promotion");
  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_LEDGER_SCHEMA,
    motion_dataset_owner_submission_readiness_ledger_status: "planning_only_blocked",
    planning_only_boundary: true,
    submission_readiness_ledger_only_boundary: true,
    no_submission_accepted_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    submission_readiness_ledger_only: true,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    go_nogo_status: "no_go",
    required_ready_prerequisite_labels: [...LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_READY_PREREQUISITE_LABELS],
    required_missing_prerequisite_labels: [...LIVE2D_MOTION_DATASET_OWNER_SUBMISSION_READINESS_MISSING_PREREQUISITE_LABELS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_submission_and_confirmation_required_before_acceptance",
    boundary_policy: { ...createBoundaryPolicy(), planning_only: true, submission_readiness_ledger_only: true, no_submission_accepted: true, no_real_row_ingestion: true, no_row_body_read: true, no_motion_execution: true, no_runtime_readiness_claim: true, no_production_readiness_claim: true },
  };
  assertSafePublicObject(summary, "motion dataset owner submission readiness ledger summary");
  return summary;
}

export function createMotionDatasetActualDataNoGoSummaryProjectionSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(source.go_candidate || source.blocker_resolved || source.actual_data_task_started || source.actual_ingestion_allowed || source.real_row_data_present || source.row_body_read || Number(source.checked_row_count ?? 0) > 0 || source.motion_dataset_executable || source.runtime_readiness_claimed || source.production_readiness_claimed || source.owner_confirmation_confirmed || source.priority1_status === "RESOLVED" || source.go_nogo_status === "go");
  const blockedReasons = ["actual_data_no_go_summary_projection_planning_only", "actual_data_no_go_summary_projection_no_go_preserved", "actual_data_no_go_summary_projection_no_actual_data_task_started", "actual_data_no_go_summary_projection_no_real_row_ingestion", "actual_data_no_go_summary_projection_no_row_body_read", "actual_data_no_go_summary_projection_priority1_blocked"];
  if (rejectedAttempt) blockedReasons.push("actual_data_no_go_summary_projection_rejected_state_promotion");
  const summary = {
    schema: LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_PROJECTION_SCHEMA,
    motion_dataset_actual_data_no_go_summary_projection_status: "planning_only_blocked",
    planning_only_boundary: true,
    no_go_summary_projection_only_boundary: true,
    no_go_preserved_boundary: true,
    no_actual_data_task_started_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_go_summary_projection_only: true,
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    required_no_go_summary_reasons: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_REASONS],
    required_safe_next_actions: [...LIVE2D_MOTION_DATASET_ACTUAL_DATA_NO_GO_SUMMARY_REQUIRED_SAFE_NEXT_ACTIONS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_and_go_nogo_review_required",
    boundary_policy: { ...createBoundaryPolicy(), planning_only: true, no_go_summary_projection_only: true, no_go_preserved: true, no_actual_data_task_started: true, no_real_row_ingestion: true, no_row_body_read: true, no_motion_execution: true, no_runtime_readiness_claim: true, no_production_readiness_claim: true },
  };
  assertSafePublicObject(summary, "motion dataset actual data no-go summary projection summary");
  return summary;
}

export function createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.owner_confirmation_confirmed ||
      source.owner_handoff_review_confirmed ||
      source.actual_data_task_started ||
      source.actual_ingestion_allowed ||
      source.real_row_data_present ||
      source.row_body_read ||
      Number(source.checked_row_count ?? 0) > 0 ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "owner_actual_data_task_handoff_review_packet_planning_only",
    "owner_actual_data_task_handoff_review_packet_no_owner_confirmation_created",
    "owner_actual_data_task_handoff_review_packet_no_actual_data_task_started",
    "owner_actual_data_task_handoff_review_packet_no_real_row_ingestion",
    "owner_actual_data_task_handoff_review_packet_no_row_body_read",
    "owner_actual_data_task_handoff_review_packet_priority1_blocked",
    "owner_actual_data_task_handoff_review_packet_no_go_preserved",
  ];
  if (rejectedAttempt) blockedReasons.push("owner_actual_data_task_handoff_review_packet_rejected_state_promotion");

  const summary = {
    schema: LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REVIEW_PACKET_SCHEMA,
    motion_dataset_owner_actual_data_task_handoff_review_packet_status: "planning_only_blocked",
    planning_only_boundary: true,
    handoff_review_packet_only_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_actual_data_task_started_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    handoff_review_packet_only: true,
    owner_confirmation_required: true,
    owner_confirmation_confirmed: false,
    owner_handoff_review_confirmed: false,
    actual_data_task_started: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
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
    required_owner_review_sections: [...LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_REVIEW_SECTIONS],
    required_owner_confirmation_scopes: [...LIVE2D_MOTION_DATASET_OWNER_ACTUAL_DATA_TASK_HANDOFF_REQUIRED_CONFIRMATION_SCOPES],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_actual_data_task_review_required_before_task_start",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      handoff_review_packet_only: true,
      no_owner_confirmation_created: true,
      no_actual_data_task_started: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset owner actual data task handoff review packet summary");
  return summary;
}

export function createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.actual_data_accepted ||
      source.actual_ingestion_allowed ||
      source.real_row_data_present ||
      source.row_body_read ||
      Number(source.checked_row_count ?? 0) > 0 ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "acceptance_criteria_checklist_planning_only",
    "acceptance_criteria_checklist_no_acceptance_approval",
    "acceptance_criteria_checklist_no_actual_data_accepted",
    "acceptance_criteria_checklist_no_real_row_ingestion",
    "acceptance_criteria_checklist_no_row_body_read",
    "acceptance_criteria_checklist_priority1_blocked",
    "acceptance_criteria_checklist_no_go_preserved",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("acceptance_criteria_checklist_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_CRITERIA_CHECKLIST_SCHEMA,
    motion_dataset_real_row_acceptance_criteria_checklist_status: "planning_only_blocked",
    planning_only_boundary: true,
    acceptance_criteria_checklist_only_boundary: true,
    no_acceptance_approval_boundary: true,
    no_actual_data_accepted_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    acceptance_criteria_checklist_only: true,
    actual_data_accepted: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_acceptance_criteria: [...LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_CRITERIA],
    required_rejection_criteria: [...LIVE2D_MOTION_DATASET_REAL_ROW_ACCEPTANCE_REQUIRED_REJECTION_CRITERIA],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_real_row_acceptance_review_required_before_actual_data_acceptance",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      acceptance_criteria_checklist_only: true,
      no_acceptance_approval: true,
      no_actual_data_accepted: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row acceptance criteria checklist summary");
  return summary;
}

export function createMotionDatasetParserDryRunEnvelopeSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.row_body_parser_enabled ||
      source.row_body_parser_executed ||
      source.parser_dry_run_executed ||
      source.actual_file_read ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.owner_confirmation_confirmed ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const blockedReasons = [
    "parser_dry_run_envelope_planning_only",
    "parser_dry_run_envelope_no_parser_execution",
    "parser_dry_run_envelope_no_actual_file_read",
    "parser_dry_run_envelope_no_actual_row_content",
    "parser_dry_run_envelope_no_real_row_ingestion",
    "parser_dry_run_envelope_priority1_blocked",
    "parser_dry_run_envelope_no_go_preserved",
  ];
  if (rejectedAttempt) {
    blockedReasons.push("parser_dry_run_envelope_rejected_state_promotion");
  }

  const summary = {
    schema: LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_SCHEMA,
    motion_dataset_parser_dry_run_envelope_status: "planning_only_blocked",
    planning_only_boundary: true,
    parser_dry_run_envelope_only_boundary: true,
    no_parser_execution_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_row_content_boundary: true,
    no_real_row_ingestion_boundary: true,
    parser_dry_run_envelope_only: true,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    parser_dry_run_executed: false,
    actual_file_read: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    checked_row_count: 0,
    real_row_data_present: false,
    actual_ingestion_allowed: false,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    owner_confirmation_confirmed: false,
    owner_confirmation_status: "schema_only",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    required_future_dry_run_inputs: [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_INPUTS],
    required_future_dry_run_outputs: [...LIVE2D_MOTION_DATASET_PARSER_DRY_RUN_ENVELOPE_REQUIRED_OUTPUTS],
    blocked_reasons: [...new Set(blockedReasons)],
    safe_next_action: "future_owner_confirmed_parser_dry_run_required_before_parser_execution",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      parser_dry_run_envelope_only: true,
      no_parser_execution: true,
      no_actual_file_read: true,
      no_actual_row_content: true,
      no_real_row_ingestion: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset parser dry-run envelope summary");
  return summary;
}

function safeOwnerRowSubmissionRejectedFieldLabel(field) {
  const label = String(field ?? "");
  if (!label) return "";
  if (label.includes("dataset_row") || label.includes("row_body") || label.includes("row")) return "dataset_row_material";
  if (label.includes("file_path") || label.includes("local_path") || label.includes("path")) return "local_path_material";
  if (label.includes("file_content") || label.includes("content")) return "file_content_material";
  if (label.includes("cue")) return "cue_material";
  if (label.includes("renderer")) return "renderer_material";
  if (label.includes("model")) return "model_location_material";
  if (label.includes("motion")) return "motion_location_material";
  if (label.includes("endpoint")) return "network_location_material";
  if (label.includes("token") || label.includes("secret")) return "access_material";
  if (label.includes("command")) return "command_material";
  if (label.includes("note") || label.includes("memo")) return "owner_note_material";
  if (label.includes("process") || label.includes("stack")) return "diagnostic_material";
  if (label.includes("commit")) return "commitment_material";
  return "unsafe_material";
}

function safeOwnerRowSubmissionFileShapeLabel(field) {
  const label = String(field ?? "");
  if (!label) return "";
  if (label === "one_row_id_per_record") return "one_row_id_per_record";
  if (label === "dataset_split_per_record") return "dataset_split_per_record";
  if (label === "motion_label_per_record") return "motion_label_per_record";
  if (label === "audit_metadata_per_record") return "audit_metadata_per_record";
  if (label.includes("cue")) return "cue_material_excluded";
  if (label.includes("renderer")) return "renderer_material_excluded";
  if (label.includes("endpoint")) return "network_location_excluded";
  if (label.includes("token") || label.includes("secret")) return "access_material_excluded";
  if (label.includes("path")) return "local_location_excluded";
  if (label.includes("command")) return "command_material_excluded";
  return "unsafe_material_excluded";
}
function filterSyntheticFixtureCases(value, fallbackCases) {
  const values = Array.isArray(value) ? value : fallbackCases;
  const allowed = new Set(fallbackCases);
  const filtered = values.map((item) => safeMotionDatasetLabel(item, "")).filter((item) => allowed.has(item));
  return filtered.length === fallbackCases.length ? filtered : [...fallbackCases];
}

function safeSyntheticRejectedCaseLabel(label) {
  const replacements = [
    [/raw_/gu, "unsafe_"],
    [/payload/gu, "material"],
    [/candidate_material/gu, "candidate_summary"],
    [/endpoint/gu, "network"],
    [/token/gu, "credential"],
    [/secret/gu, "credential"],
    [/private_local_path/gu, "local_private_reference"],
    [/private/gu, "local_private_reference"],
    [/_path/gu, "_location"],
    [/command/gu, "instruction"],
    [/game_input/gu, "game_interaction"],
    [/k_memo/gu, "k_note"],
  ];
  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), label);
}

function detectedRejectedRequestFields(source, rejectedFields) {
  if (!source || typeof source !== "object") return [];
  const rejected = new Set(rejectedFields);
  const detected = [];
  const stack = [source];
  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = String(key).replace(/[A-Z]/gu, (ch) => "_" + ch.toLowerCase()).toLowerCase();
      if (rejected.has(normalizedKey) || rejected.has(key)) detected.push(privateMaterialCategory(normalizedKey));
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return [...new Set(detected.filter(Boolean))].sort();
}

function hasRawEvidenceMaterial(source) {
  const stack = [source];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`).toLowerCase();
      if (RAW_EVIDENCE_FIELD_NAMES.has(normalizedKey)) return true;
      if (typeof value === "string" && UNSAFE_ENV_VALUE_PATTERNS.some((pattern) => pattern.test(value))) return true;
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return false;
}

function hasCollectionPlanForbiddenMaterial(source) {
  const stack = [source];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`).toLowerCase();
      if (RAW_EVIDENCE_FIELD_NAMES.has(normalizedKey)) return true;
      if ([
        "model_path",
        "motion_path",
        "endpoint_value",
        "token_value",
        "secret_value",
        "private_local_path",
        "shell_command_body",
        "obs_command",
        "world_command",
      ].includes(normalizedKey)) return true;
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return false;
}


function detectedMotionDatasetRawFields(source) {
  if (!source || typeof source !== "object") return [];
  const detected = [];
  const rejected = new Set(LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS);
  const stack = [source];
  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = String(key).replace(/[A-Z]/gu, (ch) => "_" + ch.toLowerCase()).toLowerCase();
      if (rejected.has(key) || rejected.has(normalizedKey) || normalizedKey.startsWith("raw_") || normalizedKey.includes("private") || normalizedKey.includes("token") || normalizedKey.includes("secret")) detected.push(privateMaterialCategory(normalizedKey));
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return [...new Set(detected.filter(Boolean))].sort();
}

function privateMaterialFieldCategories() {
  return [
    "payload_material",
    "dataset_row_material",
    "motion_instruction_material",
    "cue_material",
    "renderer_material",
    "evidence_material",
    "loader_candidate_material",
    "loader_error_material",
    "owner_note_material",
    "model_location_material",
    "motion_location_material",
    "sdk_location_material",
    "vendor_material",
    "network_location_material",
    "access_material",
    "local_private_material",
    "process_instruction_material",
  ];
}

function privateMaterialCategory(key) {
  if (key.includes("token") || key.includes("secret")) return "access_material";
  if (key.includes("endpoint")) return "network_location_material";
  if (key.includes("private")) return "local_private_material";
  if (key.includes("owner")) return "owner_note_material";
  if (key.includes("loader_candidate")) return "loader_candidate_material";
  if (key.includes("loader_error")) return "loader_error_material";
  if (key.includes("motion_command") || key.includes("command")) return "process_instruction_material";
  if (key.includes("cue")) return "cue_material";
  if (key.includes("renderer")) return "renderer_material";
  if (key.includes("evidence")) return "evidence_material";
  if (key.includes("sdk")) return "sdk_location_material";
  if (key.includes("vendor")) return "vendor_material";
  if (key.includes("model")) return "model_location_material";
  if (key.includes("motion")) return "motion_location_material";
  if (key.includes("row")) return "dataset_row_material";
  return "payload_material";
}

function safeMotionDatasetLabel(value, fallback) {
  const text = String(value ?? "").trim();
  if (!text) return fallback;
  return /^[a-z0-9_]{1,80}$/u.test(text) ? text : "unsafe_label";
}

export function createMotionDatasetRealRowSplitPolicyPacketSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const requestedLabels = Array.isArray(source.required_split_labels)
    ? source.required_split_labels.map((label) => safeMotionDatasetLabel(label, "unsafe_label"))
    : LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_REQUIRED_LABELS;
  const missingLabels = LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_REQUIRED_LABELS
    .filter((label) => !requestedLabels.includes(label));
  const unsafeAttempt = source.split_policy_packet_approves_ingestion === true
    || source.actual_ingestion_allowed === true
    || source.real_row_data_present === true
    || source.actual_data_preauthorized === true
    || source.actual_data_task_started === true
    || source.owner_confirmation_confirmed === true
    || source.row_body_read === true
    || source.row_body_parser_enabled === true
    || source.row_body_parser_executed === true
    || source.motion_dataset_executable === true
    || source.runtime_readiness_claimed === true
    || source.production_readiness_claimed === true
    || source.priority1_status === "RESOLVED";
  const blockers = [
    ...LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_CONTAMINATION_BLOCKERS,
    ...missingLabels.map((label) => `missing_required_split_label_${label}`),
    unsafeAttempt ? "split_policy_rejected_ingestion_or_readiness_attempt" : "",
  ].filter(Boolean);
  const summary = {
    schema: LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_PACKET_SCHEMA,
    safe_summary_only: true,
    motion_dataset_real_row_split_policy_packet_status: missingLabels.length || unsafeAttempt ? "blocked" : "planning_only",
    planning_only_boundary: true,
    split_policy_packet_only_boundary: true,
    no_real_row_ingestion_boundary: true,
    no_row_body_read_boundary: true,
    no_split_ingestion_approval_boundary: true,
    split_policy_packet_only: true,
    split_policy_packet_approves_ingestion: false,
    required_split_labels: [...LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_REQUIRED_LABELS],
    provided_split_labels: requestedLabels,
    missing_split_labels: missingLabels,
    required_contamination_blockers: [...LIVE2D_MOTION_DATASET_REAL_ROW_SPLIT_POLICY_CONTAMINATION_BLOCKERS],
    contamination_blockers: [...new Set(blockers)],
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    actual_data_preauthorized: false,
    actual_data_task_started: false,
    owner_confirmation_confirmed: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_row_content_accepted: false,
    row_body_read: false,
    row_body_parser_enabled: false,
    row_body_parser_executed: false,
    parser_dry_run_executed: false,
    redaction_scan_executed: false,
    audit_execution_started: false,
    real_ingestion_audit_event_created: false,
    rollback_ready: false,
    actual_data_accepted: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    go_candidate: false,
    blocker_resolved: false,
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    motion_execution_enabled: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    trusted_loader_allowlist_enabled: false,
    safe_next_action: "future_owner_confirmed_actual_data_task_required_before_any_split_ingestion",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_actual_file_read: true,
      no_actual_hash_calculation: true,
      no_owner_confirmation_creation: true,
      no_motion_execution: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset real row split policy packet summary");
  return summary;
}

export function createMotionDatasetSourceHashOwnerChecklistSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const providedItems = Array.isArray(source.required_owner_items)
    ? source.required_owner_items.map((item) => safeMotionDatasetLabel(item, "unsafe_label"))
    : LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_REQUIRED_ITEMS;
  const missingItems = LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_REQUIRED_ITEMS
    .filter((item) => !providedItems.includes(item));
  const unsafeAttempt = source.source_hash_checklist_verifies_real_hash === true
    || source.actual_hash_calculated === true
    || source.actual_file_read === true
    || source.actual_file_reference_accepted === true
    || source.actual_file_content_accepted === true
    || source.real_row_data_present === true
    || source.actual_ingestion_allowed === true
    || source.actual_data_task_started === true
    || source.owner_confirmation_confirmed === true
    || source.row_body_read === true
    || Number(source.checked_row_count ?? 0) > 0
    || source.motion_dataset_executable === true
    || source.runtime_readiness_claimed === true
    || source.production_readiness_claimed === true
    || source.priority1_status === "RESOLVED";
  const blockers = [
    ...LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_BLOCKERS,
    ...missingItems.map((item) => `missing_required_source_hash_owner_item_${item}`),
    unsafeAttempt ? "source_hash_owner_checklist_rejected_real_hash_or_ingestion_attempt" : "",
  ].filter(Boolean);
  const summary = {
    schema: LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_CHECKLIST_SCHEMA,
    safe_summary_only: true,
    motion_dataset_source_hash_owner_checklist_status: missingItems.length || unsafeAttempt ? "blocked" : "planning_only",
    planning_only_boundary: true,
    source_hash_owner_checklist_only_boundary: true,
    no_actual_file_read_boundary: true,
    no_actual_hash_calculation_boundary: true,
    no_real_hash_verification_boundary: true,
    no_real_row_ingestion_boundary: true,
    source_hash_checklist_verifies_real_hash: false,
    actual_hash_calculated: false,
    actual_file_read: false,
    actual_file_reference_accepted: false,
    actual_file_content_accepted: false,
    required_owner_items: [...LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_REQUIRED_ITEMS],
    provided_owner_items: providedItems,
    missing_owner_items: missingItems,
    required_hash_verification_blockers: [...LIVE2D_MOTION_DATASET_SOURCE_HASH_OWNER_BLOCKERS],
    hash_verification_blockers: [...new Set(blockers)],
    real_row_data_present: false,
    checked_row_count: 0,
    actual_ingestion_allowed: false,
    actual_data_task_started: false,
    owner_confirmation_confirmed: false,
    row_body_read: false,
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    trusted_loader_allowlist_enabled: false,
    safe_next_action: "future_owner_confirmed_source_hash_review_required_before_real_hash_verification",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      no_actual_file_read: true,
      no_actual_hash_calculation: true,
      no_real_hash_verification: true,
      no_real_row_ingestion: true,
      no_owner_confirmation_creation: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset source hash owner checklist summary");
  return summary;
}

export function createMotionDatasetFinalOwnerWaitForDataGateSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const providedReasons = Array.isArray(source.required_wait_reasons)
    ? source.required_wait_reasons.map((item) => safeMotionDatasetLabel(item, "unsafe_label"))
    : LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS;
  const missingReasons = LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS
    .filter((item) => !providedReasons.includes(item));
  const unsafeAttempt = source.final_owner_wait_gate_confirms_owner === true
    || source.owner_confirmation_confirmed === true
    || source.owner_submission_received === true
    || source.owner_submission_accepted === true
    || source.actual_data_task_started === true
    || source.actual_data_preauthorized === true
    || source.actual_ingestion_allowed === true
    || source.real_row_data_present === true
    || source.row_body_read === true
    || Number(source.checked_row_count ?? 0) > 0
    || source.motion_dataset_executable === true
    || source.runtime_readiness_claimed === true
    || source.production_readiness_claimed === true
    || source.priority1_status === "RESOLVED"
    || source.go_nogo_status === "go";
  const waitReasons = [
    ...LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS,
    ...missingReasons.map((item) => `missing_required_wait_reason_${item}`),
    unsafeAttempt ? "final_owner_wait_gate_rejected_owner_or_actual_data_attempt" : "",
  ].filter(Boolean);
  const summary = {
    schema: LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_GATE_SCHEMA,
    safe_summary_only: true,
    motion_dataset_final_owner_wait_for_data_gate_status: missingReasons.length || unsafeAttempt ? "blocked" : "waiting_for_owner_data",
    planning_only_boundary: true,
    final_owner_wait_for_data_gate_only_boundary: true,
    no_owner_confirmation_created_boundary: true,
    no_owner_confirmation_confirmed_boundary: true,
    no_actual_data_task_started_boundary: true,
    no_actual_data_accepted_boundary: true,
    no_real_row_ingestion_boundary: true,
    final_owner_wait_gate_confirms_owner: false,
    owner_confirmation_confirmed: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    actual_data_accepted: false,
    actual_ingestion_allowed: false,
    real_row_data_present: false,
    row_body_read: false,
    checked_row_count: 0,
    required_wait_reasons: [...LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_REASONS],
    provided_wait_reasons: providedReasons,
    missing_wait_reasons: missingReasons,
    wait_for_data_reasons: [...new Set(waitReasons)],
    future_owner_actions: [...LIVE2D_MOTION_DATASET_FINAL_OWNER_WAIT_FOR_DATA_FUTURE_ACTIONS],
    priority1_status: "BLOCKED",
    go_nogo_status: "no_go",
    motion_dataset_status: "non_executable",
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    trusted_loader_allowlist_enabled: false,
    safe_next_action: "wait_for_owner_confirmed_real_row_data_before_actual_data_task",
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_actual_data_accepted: true,
      no_real_row_ingestion: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "motion dataset final owner wait for data gate summary");
  return summary;
}

export function createOwnerActionLaneFreezeStatusSummary(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const unexpectedUnsafeAttempt = [
    "ownerActionRequestSent",
    "ownerActionRequested",
    "ownerActionAccepted",
    "ownerHandoffSent",
    "ownerConfirmationCreated",
    "ownerConfirmationConfirmed",
    "actualDataTaskStarted",
    "actualDataPreauthorized",
    "runtimeReadinessClaimed",
    "productionReadinessClaimed",
    "priority1Status",
    "checkedRowCount",
    "motionDatasetExecutable",
    "trustedLoaderAllowlistEnabled",
    "actualFilePathValue",
    "rawDatasetRowBody",
    "endpoint",
    "token",
    "secret",
    "commandPayload",
  ].some((key) => Object.hasOwn(source, key));
  const unsafeAttempt = unexpectedUnsafeAttempt
    || source.owner_action_request_sent === true
    || source.owner_action_requested === true
    || source.owner_action_accepted === true
    || source.owner_handoff_sent === true
    || source.owner_instruction_request_sent === true
    || source.owner_instruction_requested === true
    || source.owner_instruction_accepted === true
    || source.packet_request_sent === true
    || source.owner_submission_received === true
    || source.owner_submission_accepted === true
    || source.owner_confirmation_created === true
    || source.owner_confirmation_confirmed === true
    || source.actual_data_task_started === true
    || source.actual_data_preauthorized === true
    || source.real_data_accepted === true
    || source.row_body_read === true
    || source.actual_file_read === true
    || source.file_path_value_accepted === true
    || source.hash_calculation_performed === true
    || source.source_hash_verified === true
    || source.declared_row_count_checked === true
    || source.parser_execution_started === true
    || source.redaction_scan_execution_started === true
    || source.audit_execution_started === true
    || source.real_ingestion_audit_event_created === true
    || source.runtime_readiness_claimed === true
    || source.production_readiness_claimed === true
    || source.priority1_status === "RESOLVED"
    || Number(source.checked_row_count ?? 0) > 0
    || source.motion_dataset_boundary === "executable"
    || source.motion_dataset_executable === true
    || source.trusted_loader_boundary === "enabled"
    || source.trusted_loader_allowlist_enabled === true
    || source.renderer_ready === true;
  const summary = {
    schema: LIVE2D_OWNER_ACTION_LANE_FREEZE_STATUS_SCHEMA,
    safe_summary_only: true,
    owner_action_lane_freeze_status: unsafeAttempt ? "blocked_unsafe_state_attempt" : "waiting_for_explicit_owner_action",
    owner_action_lane_freeze_reason: "post_pr252_freeze_register",
    owner_action_lane_completed_as_metadata_only: true,
    owner_action_request_sent: false,
    owner_action_requested: false,
    owner_action_accepted: false,
    owner_handoff_sent: false,
    owner_instruction_request_sent: false,
    owner_instruction_requested: false,
    owner_instruction_accepted: false,
    packet_request_sent: false,
    owner_submission_received: false,
    owner_submission_accepted: false,
    owner_confirmation_created: false,
    owner_confirmation_confirmed: false,
    actual_data_task_started: false,
    actual_data_preauthorized: false,
    real_data_accepted: false,
    row_body_read: false,
    actual_file_read: false,
    file_reference_value_accepted: false,
    hash_calculation_performed: false,
    source_hash_verified: false,
    declared_row_count_checked: false,
    parser_execution_started: false,
    redaction_scan_execution_started: false,
    audit_execution_started: false,
    real_ingestion_audit_event_created: false,
    runtime_readiness_claimed: false,
    production_readiness_claimed: false,
    priority1_status: "BLOCKED",
    checked_row_count: 0,
    motion_dataset_boundary: "non_executable",
    trusted_loader_boundary: "disabled",
    trusted_loader_allowlist_enabled: false,
    renderer_ready: false,
    safe_next_action: "wait_for_explicit_owner_action",
    unsafe_state_attempt_rejected: unsafeAttempt,
    boundary_policy: {
      ...createBoundaryPolicy(),
      safe_status_only: true,
      no_owner_action_request: true,
      no_owner_action_acceptance: true,
      no_owner_handoff: true,
      no_owner_confirmation_creation: true,
      no_actual_data_task_started: true,
      no_actual_data_preapproval: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_parser_execution: true,
      no_redaction_scan_execution: true,
      no_audit_execution: true,
      no_trusted_loader_enablement: true,
      no_readiness_claim: true,
    },
  };
  assertSafePublicObject(summary, "owner action lane freeze status summary");
  return summary;
}

function goNoGoReasons({
  provisioning,
  evidence,
  preflight,
  gate,
  handoff,
  bundle,
  routeGuardStatus,
  ownerConfirmation,
  mockOwnerConfirmation,
  licenseBoundaryAcknowledged,
  sdkVendorBoundaryStatus,
  degradedModeAvailable,
}) {
  const reasons = [];
  if (routeGuardStatus !== "available") reasons.push("no_go_missing_route_guard");
  if (!evidence || evidence.live2d_evidence_status === undefined) reasons.push("no_go_missing_real_evidence_collector");
  if (preflight.schema !== TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA) reasons.push("no_go_missing_allowlist_preflight");
  if (gate.schema !== TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA) reasons.push("no_go_missing_enablement_gate");
  if (handoff.schema !== TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA) reasons.push("no_go_missing_owner_handoff");
  if (bundle.schema !== FRESH_EVIDENCE_BUNDLE_SCHEMA) reasons.push("no_go_missing_fresh_evidence_bundle");
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") reasons.push("no_go_missing_fresh_real_evidence");
  if (evidence.evidence_freshness_status === "stale") reasons.push("no_go_stale_real_evidence");
  if (evidence.evidence_freshness_status !== "fresh") reasons.push("no_go_missing_fresh_real_evidence");
  if (evidence.fixture_evidence_status === "fixture_only") reasons.push("no_go_fixture_evidence_only");
  if (evidence.dry_run_evidence_status === "dry_run_only") reasons.push("no_go_dry_run_evidence_only");
  if (ownerConfirmation !== true) reasons.push("no_go_missing_owner_confirmation");
  if (mockOwnerConfirmation === true) reasons.push("no_go_mock_owner_confirmation");
  if (licenseBoundaryAcknowledged !== true || provisioning.license_status !== "not_applicable") reasons.push("no_go_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") reasons.push("no_go_sdk_vendor_boundary");
  reasons.push("no_go_priority1_unresolved");
  reasons.push("no_go_motion_dataset_non_executable");
  reasons.push("no_go_runtime_not_ready");
  reasons.push("no_go_production_not_ready");
  if (degradedModeAvailable === true) reasons.push("degraded_mode_available_not_go");
  return [...new Set(reasons)];
}

function freshEvidenceBundleBlockers({
  provisioning,
  evidence,
  preflight,
  gate,
  handoff,
  routeGuardStatus,
  ownerConfirmation,
  mockOwnerConfirmation,
  licenseBoundaryAcknowledged,
  sdkVendorBoundaryStatus,
}) {
  const blockers = [];
  if (routeGuardStatus !== "available") blockers.push("bundle_blocked_missing_route_guard");
  if (!evidence || evidence.live2d_evidence_status === undefined) blockers.push("bundle_blocked_missing_real_evidence_collector");
  if (preflight.schema !== TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA) blockers.push("bundle_blocked_missing_allowlist_preflight");
  if (gate.schema !== TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA) blockers.push("bundle_blocked_missing_enablement_gate");
  if (handoff.schema !== TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA) blockers.push("bundle_blocked_missing_owner_handoff");
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") blockers.push("bundle_blocked_missing_fresh_real_evidence");
  if (evidence.evidence_freshness_status === "stale") blockers.push("bundle_blocked_stale_real_evidence");
  if (evidence.evidence_freshness_status !== "fresh") blockers.push("bundle_blocked_missing_fresh_real_evidence");
  if (evidence.fixture_evidence_status === "fixture_only") blockers.push("bundle_blocked_fixture_evidence_only");
  if (evidence.dry_run_evidence_status === "dry_run_only") blockers.push("bundle_blocked_dry_run_evidence_only");
  if (ownerConfirmation !== true) blockers.push("bundle_blocked_missing_owner_confirmation");
  if (mockOwnerConfirmation === true) blockers.push("bundle_blocked_mock_owner_confirmation");
  if (licenseBoundaryAcknowledged !== true || provisioning.license_status !== "not_applicable") blockers.push("bundle_blocked_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") blockers.push("bundle_blocked_sdk_vendor_boundary");
  blockers.push("bundle_blocked_priority1_unresolved");
  blockers.push("bundle_blocked_motion_dataset_non_executable");
  blockers.push("bundle_not_runtime_ready");
  blockers.push("bundle_not_production_ready");
  return [...new Set(blockers)];
}

function trustedLoaderOwnerHandoffBlockers({
  provisioning,
  evidence,
  preflight,
  gate,
  routeGuardStatus,
  ownerConfirmation,
  ownerConfirmationFresh,
  mockOwnerConfirmation,
  licenseBoundaryAcknowledged,
  sdkVendorBoundaryStatus,
}) {
  const blockers = [];
  if (routeGuardStatus !== "available") blockers.push("handoff_blocked_missing_route_guard");
  if (preflight.schema !== TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA) blockers.push("handoff_blocked_missing_allowlist_preflight");
  if (gate.schema !== TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA || gate.trusted_loader_enablement_gate_status === "blocked") blockers.push("handoff_blocked_enablement_gate_blocked");
  if (preflight.trusted_loader_allowlist_status === "disabled") blockers.push("handoff_blocked_allowlist_disabled");
  if (provisioning.provisioning_status === "candidate_present") blockers.push("handoff_candidate_present_diagnostic_only");
  if (provisioning.loader_kind === "unsupported_loader_kind") blockers.push("handoff_blocked_unknown_loader_kind");
  if (provisioning.provisioning_status === "future_only") blockers.push("handoff_blocked_future_only_loader_kind");
  if (licenseBoundaryAcknowledged !== true || provisioning.license_status !== "not_applicable") blockers.push("handoff_blocked_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") blockers.push("handoff_blocked_sdk_vendor_boundary");
  if (mockOwnerConfirmation === true) blockers.push("handoff_blocked_mock_owner_confirmation");
  if (ownerConfirmation !== true) blockers.push("handoff_blocked_missing_owner_confirmation");
  if (ownerConfirmation === true && ownerConfirmationFresh !== true) blockers.push("handoff_blocked_expired_owner_confirmation");
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") blockers.push("handoff_blocked_missing_real_evidence");
  if (evidence.evidence_freshness_status === "stale") blockers.push("handoff_blocked_stale_real_evidence");
  if (evidence.evidence_freshness_status !== "fresh") blockers.push("handoff_blocked_missing_real_evidence");
  if (evidence.fixture_evidence_status === "fixture_only") blockers.push("handoff_blocked_fixture_evidence_only");
  if (evidence.dry_run_evidence_status === "dry_run_only") blockers.push("handoff_blocked_dry_run_evidence_only");
  blockers.push("handoff_blocked_priority1_unresolved");
  blockers.push("handoff_blocked_motion_dataset_non_executable");
  blockers.push("handoff_not_runtime_ready");
  blockers.push("handoff_not_production_ready");
  return [...new Set(blockers)];
}

function trustedLoaderEnablementBlockers({
  provisioning,
  evidence,
  preflight,
  routeGuardStatus,
  ownerConfirmation,
  ownerConfirmationFresh,
  sdkVendorBoundaryStatus,
}) {
  const blockers = [];
  if (routeGuardStatus !== "available") blockers.push("blocked_missing_route_guard");
  if (preflight.schema !== TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA) blockers.push("blocked_missing_allowlist_preflight");
  if (preflight.trusted_loader_allowlist_status === "disabled") blockers.push("blocked_allowlist_disabled");
  if (provisioning.provisioning_status === "candidate_present") blockers.push("candidate_present_diagnostic_only");
  if (provisioning.loader_kind === "unsupported_loader_kind") blockers.push("blocked_unknown_loader_kind");
  if (provisioning.provisioning_status === "future_only") blockers.push("blocked_future_only_loader_kind");
  if (provisioning.license_status !== "not_applicable") blockers.push("blocked_license_attention_required");
  if (sdkVendorBoundaryStatus !== "clear") blockers.push("blocked_sdk_vendor_boundary");
  if (ownerConfirmation !== true) blockers.push("blocked_missing_owner_confirmation");
  if (ownerConfirmation === true && ownerConfirmationFresh !== true) blockers.push("blocked_owner_confirmation_expired");
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") blockers.push("blocked_missing_real_evidence");
  if (evidence.evidence_freshness_status === "stale") blockers.push("blocked_stale_real_evidence");
  if (evidence.evidence_freshness_status !== "fresh") blockers.push("blocked_missing_real_evidence");
  if (evidence.fixture_evidence_status === "fixture_only") blockers.push("blocked_fixture_evidence_only");
  if (evidence.dry_run_evidence_status === "dry_run_only") blockers.push("blocked_dry_run_evidence_only");
  blockers.push("blocked_priority1_unresolved");
  blockers.push("blocked_motion_dataset_non_executable");
  blockers.push("not_runtime_ready");
  blockers.push("not_production_ready");
  return [...new Set(blockers)];
}

function safeGateEvidenceStatus(evidence) {
  if (!evidence || evidence.live2d_evidence_status !== "attention_required") return "blocked_missing_real_evidence";
  if (evidence.fixture_evidence_status === "fixture_only") return "blocked_fixture_evidence_only";
  if (evidence.dry_run_evidence_status === "dry_run_only") return "blocked_dry_run_evidence_only";
  if (evidence.evidence_freshness_status === "stale") return "blocked_stale_real_evidence";
  if (evidence.evidence_freshness_status !== "fresh") return "blocked_missing_real_evidence";
  return "fresh_real_evidence_attention_required";
}

function trustedLoaderCandidateStatus(provisioning) {
  if (provisioning.provisioning_status === "candidate_present") return "candidate_present_diagnostic_only";
  if (provisioning.loader_kind === "unsupported_loader_kind") return "blocked_unknown_loader";
  if (provisioning.provisioning_status === "future_only") return "future_only";
  if (provisioning.provisioning_status === "operator_attention_required") return "operator_attention_required";
  if (provisioning.provisioning_status === "unsafe_configuration") return "unsafe_configuration";
  if (provisioning.provisioning_status === "not_configured") return "not_configured";
  return "license_attention_required";
}

function configuredLoaderEnvNames(env) {
  return ALLOWED_CUBISM_LOADER_ENV_NAMES.filter((name) => String(env[name] ?? "").trim());
}

function hasUnsafeConfiguredEnvValue(env, envNames) {
  return envNames.some((name) => {
    const value = String(env[name] ?? "");
    return UNSAFE_ENV_VALUE_PATTERNS.some((pattern) => pattern.test(value));
  });
}

function inferConfiguredLoaderKind(env) {
  return ALLOWED_CUBISM_LOADER_ENV_NAMES.some((name) => FRAMEWORK_FILE_ENV_NAMES.has(name) && String(env[name] ?? "").trim())
    ? DEFAULT_LOADER_KIND
    : "not_configured";
}

function safeEnvNames(envNames) {
  return [...new Set(envNames)]
    .filter((name) => ALLOWED_CUBISM_LOADER_ENV_NAMES.includes(name))
    .map((name) => safeText(name, 120))
    .filter(Boolean);
}

function normalizeLoaderKind(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return /^[a-z0-9_]{1,80}$/u.test(text) ? text : "unsupported_loader_kind";
}

function safeLoaderKind(value) {
  const text = normalizeLoaderKind(value) || "not_configured";
  if (CUBISM_LOADER_KIND_CANDIDATES.includes(text) || text === "not_configured") return text;
  return "unsupported_loader_kind";
}

function safeProvisioningStatus(status) {
  const text = String(status ?? "").trim();
  return PROVISIONING_STATUS.has(text) ? text : "unsafe_configuration";
}

function safeLoaderDependencyStatus(status) {
  const text = String(status ?? "").trim();
  return LOADER_DEPENDENCY_STATUS.has(text) ? text : "operator_attention_required";
}

function safeLicenseStatus(status) {
  const text = String(status ?? "").trim();
  return LICENSE_STATUS.has(text) ? text : "license_attention_required";
}
