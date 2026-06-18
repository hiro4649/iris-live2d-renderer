export const LIVE2D_EVIDENCE_SOURCE_TYPES = Object.freeze([
  "real_probe",
  "owner_approved_safe_evidence",
]);

export const LIVE2D_REJECTED_EVIDENCE_SOURCE_TYPES = Object.freeze([
  "fixture",
  "manual_label_only",
  "manifest_only",
  "sse_only",
  "cue_accepted_only",
  "unknown",
]);

export const LIVE2D_RUNTIME_SUPPORTED_MOTION_LABELS = Object.freeze([
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

export const LIVE2D_STRONG_MOTION_LABELS = Object.freeze([
  "laugh_big",
  "surprise_scream",
  "happy_dance",
  "happy_loud_sing",
]);

export const LIVE2D_OWNER_HANDOFF_SCOPE_LABELS = Object.freeze([
  "live2d_renderer",
  "motion_dataset",
  "audit_reference",
  "trusted_loader",
  "runtime_readiness",
  "production_readiness",
  "owner_confirmation",
  "real_evidence_collection",
]);

export const LIVE2D_OWNER_HANDOFF_REQUIRED_EVIDENCE_LABELS = Object.freeze([
  "fresh_renderer_heartbeat",
  "real_model_load_supported",
  "model_loaded",
  "scene_loaded",
  "model_scene_match_confirmed",
  "cue_capability_confirmed",
  "last_cue_applied",
  "last_cue_applied_success",
  "audit_reference_present",
  "owner_scope_confirmed",
  "metadata_row_manifest_present",
]);

export const LIVE2D_OWNER_HANDOFF_STALE_EVIDENCE_LABELS = Object.freeze([
  "renderer_heartbeat_stale",
  "model_evidence_stale",
  "scene_evidence_stale",
  "cue_evidence_stale",
  "audit_reference_stale",
  "owner_scope_expired",
]);

export const LIVE2D_OWNER_HANDOFF_ACTION_LABELS = Object.freeze([
  "review_scope",
  "confirm_real_evidence_collection_scope",
  "review_missing_evidence",
  "review_stale_evidence",
  "review_audit_reference",
  "keep_trusted_loader_disabled",
  "keep_priority1_blocked",
  "prepare_metadata_only_row_manifest",
]);

export const LIVE2D_SAFE_NEXT_ACTION_LABELS = Object.freeze([
  "wait_for_explicit_owner_action",
  "collect_real_renderer_evidence_after_owner_confirmation",
  "prepare_metadata_only_row_manifest",
  "keep_trusted_loader_disabled",
  "keep_priority1_blocked_until_real_evidence",
]);

export const LIVE2D_SAFE_CONTRACT_CATALOG = Object.freeze({
  evidenceSourceTypes: LIVE2D_EVIDENCE_SOURCE_TYPES,
  rejectedEvidenceSourceTypes: LIVE2D_REJECTED_EVIDENCE_SOURCE_TYPES,
  runtimeSupportedMotionLabels: LIVE2D_RUNTIME_SUPPORTED_MOTION_LABELS,
  experimentalMotionLabels: LIVE2D_EXPERIMENTAL_MOTION_LABELS,
  strongMotionLabels: LIVE2D_STRONG_MOTION_LABELS,
  ownerHandoffScopeLabels: LIVE2D_OWNER_HANDOFF_SCOPE_LABELS,
  ownerHandoffRequiredEvidenceLabels: LIVE2D_OWNER_HANDOFF_REQUIRED_EVIDENCE_LABELS,
  ownerHandoffStaleEvidenceLabels: LIVE2D_OWNER_HANDOFF_STALE_EVIDENCE_LABELS,
  ownerHandoffActionLabels: LIVE2D_OWNER_HANDOFF_ACTION_LABELS,
  safeNextActionLabels: LIVE2D_SAFE_NEXT_ACTION_LABELS,
});
