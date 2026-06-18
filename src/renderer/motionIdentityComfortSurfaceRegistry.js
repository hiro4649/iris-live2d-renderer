export const MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY_SCHEMA = "live2d_motion_identity_comfort_surface_registry_v2";

const SAFE_EFFECTS = Object.freeze({
  visibility: "public_safe_summary",
  authorizing: false,
  readinessEffect: "none",
  ownerEffect: "none",
  actualDataEffect: "none",
  redactionPolicy: "safe_summary_only",
  compatibilityAlias: [],
  deprecatedBy: null,
  dynamicContextRequired: false,
});

const MOTION_IDENTITY_COMFORT_SURFACE_DEFINITIONS = Object.freeze([
  ["live2d_motion_identity_and_comfort_spec_summary", "iris_live2d_motion_identity_and_comfort_spec_v1", "createLive2dMotionIdentityAndComfortSpecSummary"],
  ["live2d_motion_identity_and_comfort_rejection_fixture_pack_summary", "iris_live2d_motion_identity_and_comfort_rejection_fixture_pack_v1", "createLive2dMotionIdentityAndComfortRejectionFixturePackSummary"],
  ["live2d_motion_identity_and_comfort_dry_run_validator_summary", "iris_live2d_motion_identity_and_comfort_dry_run_validator_v1", "createLive2dMotionIdentityAndComfortDryRunValidatorSummary"],
  ["live2d_motion_identity_and_comfort_recovery_matrix_summary", "iris_live2d_motion_identity_and_comfort_recovery_matrix_v1", "createLive2dMotionIdentityAndComfortRecoveryMatrixSummary"],
  ["live2d_motion_identity_and_comfort_context_gate_summary", "iris_live2d_motion_identity_and_comfort_context_gate_v1", "createLive2dMotionIdentityAndComfortContextGateSummary"],
  ["live2d_motion_identity_and_comfort_subtitle_gaze_guard_summary", "iris_live2d_motion_identity_and_comfort_subtitle_gaze_guard_v1", "createLive2dMotionIdentityAndComfortSubtitleGazeGuardSummary"],
  ["live2d_motion_identity_and_comfort_persona_pressure_guard_summary", "iris_live2d_motion_identity_and_comfort_persona_pressure_guard_v1", "createLive2dMotionIdentityAndComfortPersonaPressureGuardSummary"],
  ["live2d_motion_identity_and_comfort_voice_sync_hint_boundary_summary", "iris_live2d_motion_identity_and_comfort_voice_sync_hint_boundary_v1", "createLive2dMotionIdentityAndComfortVoiceSyncHintBoundarySummary"],
  ["live2d_motion_identity_and_comfort_adaptive_bounds_summary", "iris_live2d_motion_identity_and_comfort_adaptive_bounds_v1", "createLive2dMotionIdentityAndComfortAdaptiveBoundsSummary"],
  ["live2d_motion_identity_comfort_development_schedule_summary", "iris_live2d_motion_identity_comfort_development_schedule_v1", "createLive2dMotionIdentityComfortDevelopmentScheduleSummary"],
  ["live2d_motion_identity_comfort_completion_review_summary", "iris_live2d_motion_identity_comfort_completion_review_v1", "createLive2dMotionIdentityComfortCompletionReviewSummary"],
  ["live2d_motion_identity_profile_status_surface_summary", "iris_live2d_motion_identity_profile_status_surface_v1", "createLive2dMotionIdentityProfileStatusSurfaceSummary"],
  ["live2d_motion_comfort_policy_status_surface_summary", "iris_live2d_motion_comfort_policy_status_surface_v1", "createLive2dMotionComfortPolicyStatusSurfaceSummary"],
  ["live2d_motion_freshness_policy_cross_surface_consistency_summary", "iris_live2d_motion_freshness_policy_cross_surface_consistency_v1", "createLive2dMotionFreshnessPolicyCrossSurfaceConsistencySummary"],
  ["live2d_motion_strong_motion_unsafe_override_rejection_summary", "iris_live2d_motion_strong_motion_unsafe_override_rejection_v1", "createLive2dMotionStrongMotionUnsafeOverrideRejectionSummary"],
  ["live2d_motion_identity_comfort_redaction_sweep_summary", "iris_live2d_motion_identity_comfort_redaction_sweep_v1", "createLive2dMotionIdentityComfortRedactionSweepSummary"],
  ["live2d_motion_identity_comfort_no_sweetening_sweep_summary", "iris_live2d_motion_identity_comfort_no_sweetening_sweep_v1", "createLive2dMotionIdentityComfortNoSweeteningSweepSummary"],
  ["live2d_motion_identity_comfort_implementation_gap_audit_summary", "iris_live2d_motion_identity_comfort_implementation_gap_audit_v1", "createLive2dMotionIdentityComfortImplementationGapAuditSummary"],
  ["live2d_motion_identity_comfort_implementation_gap_register_summary", "iris_live2d_motion_identity_comfort_implementation_gap_register_v1", "createLive2dMotionIdentityComfortImplementationGapRegisterSummary"],
  ["live2d_motion_identity_comfort_final_long_continuation_review2_summary", "iris_live2d_motion_identity_comfort_final_long_continuation_review2_v1", "createLive2dMotionIdentityComfortFinalLongContinuationReview2Summary"],
  ["live2d_motion_identity_comfort_long_continuation_completion_review3", "iris_live2d_motion_identity_comfort_long_continuation_completion_review3_v1", "createLive2dMotionIdentityComfortLongContinuationCompletionReview3"],
  ["live2d_motion_identity_comfort_public_summary", "iris_live2d_motion_identity_comfort_public_summary_v1", "createLive2dMotionIdentityComfortPublicSummary"],
  ["live2d_motion_identity_comfort_admin_summary_redaction", "iris_live2d_motion_identity_comfort_admin_summary_redaction_v1", "createLive2dMotionIdentityComfortAdminSummaryRedaction"],
  ["live2d_motion_identity_comfort_public_admin_surface_alignment", "iris_live2d_motion_identity_comfort_public_admin_surface_alignment_v1", "createLive2dMotionIdentityComfortPublicAdminSurfaceAlignment"],
  ["live2d_motion_identity_comfort_owner_only_detail_role_gate_stub2", "iris_live2d_motion_identity_comfort_owner_only_detail_role_gate_stub2_v1", "createLive2dMotionIdentityComfortOwnerOnlyDetailRoleGateStub2"],
  ["live2d_motion_identity_comfort_public_role_gate_leak_rejection", "iris_live2d_motion_identity_comfort_public_role_gate_leak_rejection_v1", "createLive2dMotionIdentityComfortPublicRoleGateLeakRejection"],
  ["live2d_motion_identity_comfort_operator_handoff_no_action", "iris_live2d_motion_identity_comfort_operator_handoff_no_action_v1", "createLive2dMotionIdentityComfortOperatorHandoffNoAction"],
  ["live2d_motion_identity_comfort_owner_handoff_stub", "iris_live2d_motion_identity_comfort_owner_handoff_stub_v1", "createLive2dMotionIdentityComfortOwnerHandoffStub"],
  ["live2d_motion_identity_comfort_role_gate_stub", "iris_live2d_motion_identity_comfort_role_gate_stub_v1", "createLive2dMotionIdentityComfortRoleGateStub"],
  ["live2d_motion_identity_comfort_role_gate_redaction_guard", "iris_live2d_motion_identity_comfort_role_gate_redaction_guard_v1", "createLive2dMotionIdentityComfortRoleGateRedactionGuard"],
  ["live2d_motion_identity_comfort_audit_stub_no_write", "iris_live2d_motion_identity_comfort_audit_stub_no_write_v1", "createLive2dMotionIdentityComfortAuditStubNoWrite"],
  ["live2d_motion_identity_comfort_audit_event_stub_no_write2", "iris_live2d_motion_identity_comfort_audit_event_stub_no_write2_v1", "createLive2dMotionIdentityComfortAuditEventStubNoWrite2"],
  ["live2d_motion_identity_comfort_audit_event_unsafe_field_guard2", "iris_live2d_motion_identity_comfort_audit_event_unsafe_field_guard2_v1", "createLive2dMotionIdentityComfortAuditEventUnsafeFieldGuard2"],
  ["live2d_motion_identity_comfort_audit_unsafe_field_guard", "iris_live2d_motion_identity_comfort_audit_unsafe_field_guard_v1", "createLive2dMotionIdentityComfortAuditUnsafeFieldGuard"],
  ["live2d_motion_identity_comfort_blocker_grouping_status_surface", "iris_live2d_motion_identity_comfort_blocker_grouping_status_surface_v1", "createLive2dMotionIdentityComfortBlockerGroupingStatusSurface"],
  ["live2d_motion_identity_comfort_blocker_grouping_contract2", "iris_live2d_motion_identity_comfort_blocker_grouping_contract2_v1", "createLive2dMotionIdentityComfortBlockerGroupingContract2"],
  ["live2d_motion_identity_comfort_repeated_blocker_grouping", "iris_live2d_motion_identity_comfort_repeated_blocker_grouping_v1", "createLive2dMotionIdentityComfortRepeatedBlockerGrouping"],
  ["live2d_motion_identity_comfort_repeated_blocker_grouping_contract", "iris_live2d_motion_identity_comfort_repeated_blocker_grouping_contract_v1", "createLive2dMotionIdentityComfortRepeatedBlockerGroupingContract"],
  ["live2d_motion_identity_comfort_continuation_ledger2", "iris_live2d_motion_identity_comfort_continuation_ledger2_v1", "createLive2dMotionIdentityComfortContinuationLedger2"],
  ["live2d_motion_identity_comfort_continuation_ledger_consistency2", "iris_live2d_motion_identity_comfort_continuation_ledger_consistency2_v1", "createLive2dMotionIdentityComfortContinuationLedgerConsistency2"],
  ["live2d_motion_identity_comfort_pre_owner_final_wait_state", "iris_live2d_motion_identity_comfort_pre_owner_final_wait_state_v1", "createLive2dMotionIdentityComfortPreOwnerFinalWaitState"],
  ["live2d_motion_identity_comfort_implementation_gap_audit2_summary", "iris_live2d_motion_identity_comfort_implementation_gap_audit2_v1", "createLive2dMotionIdentityComfortImplementationGapAudit2Summary"],
  ["live2d_motion_identity_comfort_implementation_gap_register2_summary", "iris_live2d_motion_identity_comfort_implementation_gap_register2_v1", "createLive2dMotionIdentityComfortImplementationGapRegister2Summary"],
  ["live2d_motion_identity_comfort_continuation_ledger", "iris_live2d_motion_identity_comfort_continuation_ledger_v1", "createLive2dMotionIdentityComfortContinuationLedger"],
  ["live2d_motion_identity_comfort_continuation_ledger_consistency", "iris_live2d_motion_identity_comfort_continuation_ledger_consistency_v1", "createLive2dMotionIdentityComfortContinuationLedgerConsistency"],
  ["live2d_motion_identity_comfort_final_redaction_sweep2", "iris_live2d_motion_identity_comfort_final_redaction_sweep2_v1", "createLive2dMotionIdentityComfortFinalRedactionSweep2"],
  ["live2d_motion_identity_comfort_final_no_sweetening_sweep2", "iris_live2d_motion_identity_comfort_final_no_sweetening_sweep2_v1", "createLive2dMotionIdentityComfortFinalNoSweeteningSweep2"],
]);

export const MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY = Object.freeze(
  MOTION_IDENTITY_COMFORT_SURFACE_DEFINITIONS.map(([id, schema, factory], index) => Object.freeze({
    id,
    schema,
    factory,
    factoryInvocationMode: "zero_arg_static",
    contextAdapterId: null,
    required: true,
    projectionOrder: index,
    publicKey: id,
    surfaceKeys: ["schema"],
    surfaces: ["status", "health", "runtimeConfig"],
    ...SAFE_EFFECTS,
  })),
);

function duplicates(values) {
  const seen = new Set();
  const duplicateValues = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicateValues.add(value);
    seen.add(value);
  }
  return [...duplicateValues].sort();
}

export function validateMotionIdentityComfortSurfaceRegistry(registry = MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY) {
  const duplicateIds = duplicates(registry.map((entry) => entry.id));
  const duplicateSchemas = duplicates(registry.map((entry) => entry.schema));
  const duplicateSurfaceKeys = duplicates(registry.map((entry) => entry.publicKey));
  const visibilityViolations = registry
    .filter((entry) => entry.visibility !== "public_safe_summary")
    .map((entry) => entry.id)
    .sort();
  const effectViolations = registry
    .filter((entry) => (
      entry.authorizing !== false ||
      entry.readinessEffect !== "none" ||
      entry.ownerEffect !== "none" ||
      entry.actualDataEffect !== "none"
    ))
    .map((entry) => entry.id)
    .sort();
  const metadataViolations = registry
    .filter((entry) => (
      typeof entry.factory !== "string" ||
      !entry.factory ||
      entry.factoryInvocationMode !== "zero_arg_static" ||
      entry.contextAdapterId !== null ||
      entry.required !== true ||
      !Number.isInteger(entry.projectionOrder) ||
      entry.publicKey !== entry.id ||
      !Array.isArray(entry.surfaces) ||
      !entry.surfaces.includes("status") ||
      !entry.surfaces.includes("health") ||
      !entry.surfaces.includes("runtimeConfig") ||
      entry.redactionPolicy !== "safe_summary_only" ||
      !Array.isArray(entry.compatibilityAlias) ||
      entry.deprecatedBy !== null ||
      typeof entry.dynamicContextRequired !== "boolean"
    ))
    .map((entry) => entry.id)
    .sort();
  const failures = [
    ...duplicateIds.map((id) => `duplicate_id:${id}`),
    ...duplicateSchemas.map((schema) => `duplicate_schema:${schema}`),
    ...duplicateSurfaceKeys.map((key) => `duplicate_public_key:${key}`),
    ...visibilityViolations.map((id) => `visibility:${id}`),
    ...effectViolations.map((id) => `effect:${id}`),
    ...metadataViolations.map((id) => `metadata:${id}`),
  ];
  return {
    schema: MOTION_IDENTITY_COMFORT_SURFACE_REGISTRY_SCHEMA,
    safeSummaryOnly: true,
    status: failures.length ? "fail" : "pass",
    failures,
    registeredIds: registry.map((entry) => entry.id).sort(),
    duplicateIds,
    duplicateSchemas,
    duplicateSurfaceKeys,
    visibilityViolations,
    effectViolations,
    metadataViolations,
    surfaceCount: registry.length,
  };
}
