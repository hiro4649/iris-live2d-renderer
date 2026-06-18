import {
  createTrustedLoaderEvidenceSummary,
  validateTrustedLoaderEvidence,
} from "./trustedLoaderEvidence.js";

export const DEFAULT_HEARTBEAT_MAX_AGE_MS = 5_000;
const HEARTBEAT_FUTURE_SKEW_MS = 1_000;
const MODEL_LOAD_STATUS = new Set([
  "not_configured",
  "asset_route_available",
  "runtime_missing",
  "loader_missing",
  "loading",
  "loaded",
  "failed",
]);
const MODEL_LOAD_ERROR_KIND = new Set([
  "not_configured",
  "asset_route_unavailable",
  "runtime_missing",
  "loader_missing",
  "missing_dependency",
  "operator_attention_required",
  "load_failed",
  "invalid_manifest",
  "unsupported_runtime",
  "unknown",
]);
const LOADER_CAPABILITY_CLASS = new Set([
  "no_runtime",
  "cubism_core_only",
  "loader_detected_untrusted",
  "loader_contract_candidate",
  "trusted_loader_evidence_candidate",
  "trusted_loader_ready_future",
]);
const LOADER_DEPENDENCY_STATUS = new Set([
  "not_configured",
  "missing_dependency",
  "operator_attention_required",
  "candidate_detected",
  "unsupported_runtime",
]);

export function createHeartbeatStatus({
  heartbeat,
  nowMs,
  maxAgeMs = DEFAULT_HEARTBEAT_MAX_AGE_MS,
  expectedModelId,
  expectedSceneId,
  cubismSdkAvailable,
  model3ManifestAvailable,
  realModelLoadSupported = false,
  lastDeliveredCueStatusHash = "",
} = {}) {
  const timestampMs = Number(heartbeat?.heartbeat_timestamp_ms);
  const hasTimestamp = Number.isFinite(timestampMs);
  const ageMs = hasTimestamp ? nowMs - timestampMs : null;
  const freshHeartbeat = Boolean(
    hasTimestamp &&
      timestampMs <= nowMs + HEARTBEAT_FUTURE_SKEW_MS &&
      ageMs !== null &&
      ageMs >= 0 &&
      ageMs <= maxAgeMs
  );
  const modelMatches = heartbeat?.model_id === expectedModelId;
  const sceneMatches = heartbeat?.scene_id === expectedSceneId;
  const cueCapabilities = heartbeat?.cue_capability ?? heartbeat?.cue_capabilities ?? {};
  const cueCapabilityClaimed = Boolean(
    cueCapabilities.live2d_engine_request &&
      cueCapabilities.renderer_cue_delivery &&
      cueCapabilities.model_motion_update
  );
  const recoveryCueSupport = Boolean(cueCapabilities.recovery_cue_support);
  const cueAppliedAtMs = Number(heartbeat?.last_cue_applied_at_ms);
  const hasCueAppliedAt = Number.isFinite(cueAppliedAtMs) && cueAppliedAtMs <= nowMs + HEARTBEAT_FUTURE_SKEW_MS;
  const visualApplicationConfirmed = heartbeat?.last_visual_application_status === "visual_application_confirmed";
  const visualApplicationFrameSequence = Number(heartbeat?.last_visual_application_frame_sequence);
  const lastCueApplied = Boolean(
    lastDeliveredCueStatusHash &&
      heartbeat?.last_applied_cue_status_hash === lastDeliveredCueStatusHash &&
      heartbeat?.last_cue_apply_status === "applied" &&
      visualApplicationConfirmed &&
      Number.isInteger(visualApplicationFrameSequence) &&
      visualApplicationFrameSequence > 0 &&
      hasCueAppliedAt
  );
  const cubismRuntimeLoaded = heartbeat?.cubism_runtime_loaded === true;
  const modelLoadStatus = safeModelLoadStatus(heartbeat?.model_load_status);
  const modelLoadErrorKind = safeModelLoadErrorKind(heartbeat?.model_load_error_kind);
  const loaderCapabilityClass = safeLoaderCapabilityClass(heartbeat?.loader_capability_class);
  const loaderDependencyStatus = safeLoaderDependencyStatus(heartbeat?.loader_dependency_status);
  const loaderCandidateKind = safeLoaderKind(heartbeat?.loader_candidate_kind);
  const modelAssetRouteAvailable = heartbeat?.model_asset_route_available === true;
  const trustedLoaderEvidence = createTrustedLoaderEvidenceSummary(validateTrustedLoaderEvidence(
    heartbeat?.trusted_loader_evidence,
    {
      nowMs,
      maxAgeMs,
      expectedModelId,
      expectedSceneId,
    }
  ));
  const browserModelLoadSupported = heartbeat?.model_load_supported === true || heartbeat?.real_model_load_supported === true;
  // Browser model-load support is diagnostic in this phase. A self-asserted
  // heartbeat must not establish the server-trusted real loader capability.
  const realModelCapabilitySupported = realModelLoadSupported === true;
  const modelLoadedClaimed = heartbeat?.model3_loaded === true || heartbeat?.model_loaded === true || heartbeat?.real_model_loaded === true;
  const sceneLoadedClaimed = heartbeat?.scene_loaded === true || heartbeat?.real_scene_loaded === true;
  const realModelLoadedClaimed = Boolean(
    heartbeat?.real_model_loaded === true &&
      heartbeat?.model_load_succeeded === true &&
      modelLoadStatus === "loaded"
  );
  const realSceneLoadedClaimed = Boolean(heartbeat?.real_scene_loaded === true && realModelLoadedClaimed);
  const modelLoaded = Boolean(realModelCapabilitySupported && realModelLoadedClaimed);
  const sceneLoaded = Boolean(realModelCapabilitySupported && realSceneLoadedClaimed);
  const cueCapabilityConfirmed = Boolean(realModelCapabilitySupported && cueCapabilityClaimed);
  const browserCueDeliveryReady = Boolean(
    cubismSdkAvailable &&
      model3ManifestAvailable &&
      cubismRuntimeLoaded &&
      modelLoaded &&
      sceneLoaded &&
      modelMatches &&
      sceneMatches &&
      cueCapabilityConfirmed &&
      freshHeartbeat
  );
  const rendererReady = Boolean(
    browserCueDeliveryReady &&
      lastCueApplied
  );
  const live2dEvidenceSummary = createLive2dEvidenceSummary({
    heartbeat,
    heartbeatPresent: Boolean(heartbeat),
    hasTimestamp,
    freshHeartbeat,
    modelConfigured: Boolean(expectedModelId),
    modelMatches,
    sceneMatches,
    cueCapabilityClaimed,
    recoveryCueSupport,
    lastCueApplied,
    modelLoadedClaimed,
    sceneLoadedClaimed,
    realModelLoadedClaimed,
    realSceneLoadedClaimed,
  });

  return {
    heartbeat_present: Boolean(heartbeat),
    heartbeat_fresh: freshHeartbeat,
    heartbeat_age_ms: ageMs,
    cubism_sdk_available: Boolean(cubismSdkAvailable),
    real_model_load_supported: realModelCapabilitySupported,
    cubism_runtime_loaded: cubismRuntimeLoaded,
    model_asset_route_available: modelAssetRouteAvailable,
    model_load_status: modelLoadStatus,
    model_load_supported: browserModelLoadSupported,
    model_load_attempted: heartbeat?.model_load_attempted === true,
    model_load_succeeded: heartbeat?.model_load_succeeded === true,
    model_load_error_kind: modelLoadErrorKind,
    loader_capability_class: loaderCapabilityClass,
    loader_dependency_status: loaderDependencyStatus,
    loader_candidate_kind: loaderCandidateKind,
    trusted_loader_evidence_status: trustedLoaderEvidence.trusted_loader_evidence_status,
    trusted_loader_kind: trustedLoaderEvidence.trusted_loader_kind,
    trusted_loader_policy_gate: trustedLoaderEvidence.trusted_loader_policy_gate,
    trusted_loader_ready_candidate: trustedLoaderEvidence.trusted_loader_ready_candidate,
    trusted_loader_error_kind: trustedLoaderEvidence.trusted_loader_error_kind,
    model_loaded: modelLoaded,
    scene_loaded: sceneLoaded,
    model_loaded_claimed: modelLoadedClaimed,
    scene_loaded_claimed: sceneLoadedClaimed,
    real_model_loaded_claimed: realModelLoadedClaimed,
    real_scene_loaded_claimed: realSceneLoadedClaimed,
    model_matches: modelMatches,
    scene_matches: sceneMatches,
    browser_cue_delivery_ready: browserCueDeliveryReady,
    cue_capability_claimed: cueCapabilityClaimed,
    cue_capability_confirmed: cueCapabilityConfirmed,
    recovery_cue_support: recoveryCueSupport,
    last_cue_applied: lastCueApplied,
    last_cue_applied_at: lastCueApplied ? cueAppliedAtMs : null,
    last_accepted_cue_status_hash: safeStatusHash(heartbeat?.last_accepted_cue_status_hash),
    last_cue_acceptance_status: safeCueAcceptanceStatus(heartbeat?.last_cue_acceptance_status),
    last_visual_application_status: visualApplicationConfirmed ? "visual_application_confirmed" : "not_confirmed",
    last_visual_application_frame_sequence: Number.isInteger(visualApplicationFrameSequence) && visualApplicationFrameSequence > 0
      ? visualApplicationFrameSequence
      : 0,
    renderer_ready_candidate: rendererReady,
    live2d_evidence_summary: live2dEvidenceSummary,
  };
}

function safeStatusHash(value) {
  const text = String(value ?? "");
  return /^[a-f0-9]{64}$/u.test(text) ? text : "";
}

function safeCueAcceptanceStatus(value) {
  return value === "accepted_for_application" ? value : "not_accepted";
}

function createLive2dEvidenceSummary({
  heartbeat,
  heartbeatPresent,
  hasTimestamp,
  freshHeartbeat,
  modelConfigured,
  modelMatches,
  sceneMatches,
  cueCapabilityClaimed,
  recoveryCueSupport,
  lastCueApplied,
  modelLoadedClaimed,
  sceneLoadedClaimed,
  realModelLoadedClaimed,
  realSceneLoadedClaimed,
} = {}) {
  const sourceType = safeEvidenceSourceType(heartbeat?.evidence_source_type ?? heartbeat?.collector_source_type);
  const fixtureOnly = sourceType === "fixture" || heartbeat?.fixture_evidence === true;
  const dryRunOnly = sourceType === "dry_run" || heartbeat?.dry_run_evidence === true;
  const realProbe = sourceType === "real_probe";
  const missingRequiredRealProbeFields = Boolean(realProbe && (!realModelLoadedClaimed || !realSceneLoadedClaimed || !cueCapabilityClaimed));
  const blockedReason = !heartbeatPresent
    ? "missing_evidence"
    : !hasTimestamp
      ? "missing_timestamp"
      : !freshHeartbeat
        ? "stale_evidence"
        : fixtureOnly
          ? "fixture_only"
          : dryRunOnly
            ? "dry_run_only"
            : missingRequiredRealProbeFields
              ? "real_probe_incomplete"
              : "real_evidence_required";
  const evidenceStatus = blockedReason === "real_evidence_required" ? "attention_required" : "blocked";
  const summary = {
    schema: "iris_live2d_real_evidence_summary_v1",
    safe_summary_only: true,
    live2d_evidence_status: evidenceStatus,
    collector_source_type: fixtureOnly ? "fixture" : dryRunOnly ? "dry_run" : sourceType,
    evidence_timestamp_status: hasTimestamp ? "present" : "missing",
    evidence_freshness_status: freshHeartbeat ? "fresh" : hasTimestamp ? "stale" : "missing",
    renderer_heartbeat_evidence: heartbeatPresent ? "present" : "missing",
    model_configured_status: modelConfigured ? "configured" : "not_configured",
    model_loaded_evidence: realModelLoadedClaimed ? "claimed" : modelLoadedClaimed ? "claimed_without_real_gate" : "missing",
    scene_loaded_evidence: realSceneLoadedClaimed ? "claimed" : sceneLoadedClaimed ? "claimed_without_real_gate" : "missing",
    model_matches_expected: modelMatches === true ? "match" : "not_confirmed",
    scene_matches_expected: sceneMatches === true ? "match" : "not_confirmed",
    cue_capability_status: cueCapabilityClaimed ? "claimed" : "missing",
    recovery_capability_status: recoveryCueSupport ? "claimed" : "missing",
    last_cue_applied_status: lastCueApplied ? "applied" : "not_confirmed",
    fixture_evidence_status: fixtureOnly ? "fixture_only" : "not_fixture",
    dry_run_evidence_status: dryRunOnly ? "dry_run_only" : "not_dry_run",
    blocked_or_attention_reason: blockedReason,
    safe_next_action: "collect_fresh_real_resident_evidence_with_owner_confirmation",
    live2d_real_evidence_required: true,
    live2d_fixture_evidence_ignored_for_readiness: true,
    live2d_priority1_status: "BLOCKED",
    live2d_runtime_readiness_claimed: false,
    motion_dataset_executable: false,
    renderer_ready: false,
    model_loaded: false,
    scene_loaded: false,
    browser_cue_delivery_ready: false,
  };
  return summary;
}

function safeEvidenceSourceType(value) {
  const text = String(value ?? "").trim();
  return ["missing", "fixture", "dry_run", "operator_provided", "real_probe"].includes(text) ? text : "missing";
}

function safeModelLoadStatus(value) {
  const text = String(value ?? "").trim();
  if (!text) return "not_configured";
  return MODEL_LOAD_STATUS.has(text) ? text : "failed";
}

function safeModelLoadErrorKind(value) {
  const text = String(value ?? "").trim();
  return MODEL_LOAD_ERROR_KIND.has(text) ? text : "unknown";
}

function safeLoaderCapabilityClass(value) {
  const text = String(value ?? "").trim();
  if (!text) return "no_runtime";
  return LOADER_CAPABILITY_CLASS.has(text) ? text : "loader_detected_untrusted";
}

function safeLoaderDependencyStatus(value) {
  const text = String(value ?? "").trim();
  if (!text) return "not_configured";
  return LOADER_DEPENDENCY_STATUS.has(text) ? text : "operator_attention_required";
}

function safeLoaderKind(value) {
  const text = String(value ?? "").trim();
  return /^[a-z0-9_]{1,80}$/u.test(text) ? text : "none";
}
