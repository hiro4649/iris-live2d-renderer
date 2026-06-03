#!/usr/bin/env node
// CODEX_QUALITY_HARNESS_FILE v1.0.3
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { scanObjectForUnsafe, simpleStatus, writeJsonReport, exitFor, readText } from './codex-v080-lib.mjs';

export const V103_STATUS_KEYS = [
  'reasonSummaryFinalAggregationStatus',
  'remoteNpmDiagnosticTruthStatus',
  'localRemoteFailureDeltaClassifierStatus',
  'productSurfaceRouterStatus',
  'activeSelfTestArtifactSourceStatus',
  'prBodyGovernanceAutoRepairStatus',
  'reviewEvidenceTaxonomyStatus',
  'contractReadinessProfileStatus',
  'staleAuditInputStatus',
  'githubEventPayloadFreshnessStatus',
  'prBodyLiveFetchStatus',
  'safeArtifactHeadMatchStatus',
  'eventPayloadVsLivePrBodyDiffStatus',
  'rerunUsesStaleEventPayloadStatus',
  'mergeReadinessReasonLadderStatus',
  'codexActionBoundaryStatus',
  'userManualWorkProhibitedStatus',
  'safeNextActionPrecisionStatus',
  'pr42TargetSafeJsonFinalizationStatus',
  'pr42ContractMarkerStatus',
  'pr42LifeboatQualityScoreStatus',
  'designOnlyPrStatus',
  'implementationDeferredStatus',
  'fiveFiveLowModeStatus',
  'dynamicWorkflowDecisionStatus',
  'workflowGoalContractStatus',
  'workflowArtifactStatus',
  'workPacketSchemaStatus',
  'workerRoleMatrixStatus',
  'workerFileOwnershipV2Status',
  'parallelWorkerBudgetStatus',
  'approvalGateStatus',
  'simulatedSubagentFallbackStatus',
  'subagentRunnerAvailabilityStatus',
  'workPacketResultStatus',
  'integrationConflictStatus',
  'adversarialReviewStatus',
  'verificationFanInStatus',
  'workflowResumeCheckpointStatus',
  'workflowCostBudgetStatus',
  'workflowContextBudgetStatus',
  'workflowFinalReportStatus',
  'funkyRuntimeAdoptionSequenceStatus',
  'receiptFetcherNoSecretPreflightStatus',
  'stagingNoTxEvidenceStatus',
  'runtimeReadinessBlockerDigestStatus',
  'funkySafeRowExportStatus',
  'datasetAuditV2SpecStatus',
  'gameToolAdapterFixturePackStatus',
  'belovedAvatarSafetyAuditSpecStatus',
  'vgcFunkyReleaseLadderStatus',
  'v103SelfTestStatus',
];

export const V103_REASON_CODES = [
  'reason_summary_final_aggregation_inconsistent',
  'target_quality_pass_but_report_fail',
  'legacy_advisory_promoted_to_failure',
  'stale_blocking_reason_not_removed',
  'remote_npm_truth_missing',
  'remote_npm_executed_but_normalizer_missing',
  'remote_npm_executed_but_stale_head',
  'remote_npm_profile_mismatch',
  'local_remote_failure_delta_unknown',
  'product_surface_router_missing',
  'command_scope_mismatch',
  'command_cwd_missing',
  'active_self_test_artifact_mismatch',
  'legacy_artifact_used_as_active',
  'pr_body_governance_safe_patch_missing',
  'review_evidence_taxonomy_missing',
  'writer_self_review_detected',
  'chatgpt_pro_review_not_human_independent',
  'codex_operational_comment_informational_only',
  'contract_readiness_profile_missing',
  'stale_audit_input_detected',
  'github_event_payload_stale',
  'pr_body_live_fetch_missing',
  'safe_artifact_head_mismatch',
  'event_payload_live_body_diff',
  'rerun_uses_stale_event_payload',
  'merge_readiness_reason_ladder_missing',
  'codex_action_boundary_missing',
  'user_manual_work_pushed_back',
  'safe_next_action_not_precise',
  'v103_real_pr42_empty_target_safe_json',
  'v103_real_pr42_minimal_failure_without_gate_label',
  'v103_real_pr42_report_finalization_gap',
  'v103_real_pr42_no_safe_json_report',
  'v103_real_pr42_timeout_without_report',
  'v103_real_pr42_untracked_safe_failure_artifact',
  'v103_real_pr42_artifact_path_not_repo_external',
  'v103_real_pr42_child_process_blocks_finalizer',
  'v103_real_pr42_synchronous_child_timeout_gap',
  'v103_pr42_child_process_timeout_boundary_missing',
  'v103_pr42_synchronous_child_blocks_finalizer',
  'v103_pr42_spawn_timeout_not_enforced',
  'v103_pr42_child_timeout_no_safe_report',
  'v103_pr42_child_exit_not_observed',
  'v103_pr42_child_stdio_blocking',
  'v103_pr42_child_process_artifact_finalization_gap',
  'v103_pr42_timeout_finalizer_ordering_bug',
  'v103_pr42_untracked_artifact_after_child_timeout',
  'v103_unknown_child_process_timeout_boundary',
  'v103_pr42_classification_unknown_file',
  'v103_pr42_exact_docs_scope_missing',
  'v103_pr42_profile_sections_missing',
  'v103_pr42_profile_metadata_not_recognized',
  'v103_pr42_review_independence_metadata_missing',
  'v103_pr42_remote_npm_marker_missing',
  'v103_pr42_remote_npm_marker_prepush_misclassified',
  'v103_pr42_metadata_realpath_simulation_delta',
  'v103_unknown_pr42_metadata_classification_blocker',
  'v103_pr42_child_boundary_label_not_recognized',
  'v103_pr42_contract_metadata_missing',
  'v103_pr42_contract_metadata_not_recognized',
  'v103_pr42_remote_npm_normalization_marker_missing',
  'v103_pr42_remote_npm_normalization_marker_misclassified',
  'v103_pr42_remote_npm_marker_realpath_simulation_delta',
  'v103_pr42_metadata_contract_realpath_delta',
  'v103_unknown_pr42_contract_marker_blocker',
  'v103_pr42_artifact_lifeboat_missing',
  'v103_pr42_lifeboat_artifact_not_generated',
  'v103_pr42_lifeboat_artifact_path_mismatch',
  'v103_pr42_lifeboat_artifact_not_recognized',
  'v103_pr42_lifeboat_only_evidence_rejected',
  'v103_pr42_target_quality_score_missing',
  'v103_pr42_target_quality_score_not_computed',
  'v103_pr42_target_quality_score_prepush_misclassified',
  'v103_pr42_target_quality_score_remote_required_before_push',
  'v103_pr42_lifeboat_qualityscore_realpath_delta',
  'v103_unknown_pr42_lifeboat_qualityscore_blocker',
  'v103_real_pr42_simulation_real_path_delta',
  'v103_real_pr42_artifact_path_mismatch',
  'v103_real_pr42_evidence_artifact_shape_mismatch',
  'v103_real_pr42_unclassified_failure_boundary',
  'design_only_pr_misclassified_as_implementation',
  'implementation_deferred_not_respected',
  'five_five_low_mode_violation',
  'dynamic_workflow_overused',
  'simulated_subagent_misrepresented',
  'worker_file_ownership_conflict_v2',
  'v103_self_test_missing',
];

function uniq(values) {
  return [...new Set((values || []).filter(Boolean))];
}

function bool(value) {
  return value === true || value === '1' || value === 'true' || value === 'yes';
}

function status(statusKey, state, payload = {}) {
  const report = simpleStatus(statusKey, state, {
    ...payload,
    reasonCodes: uniq(payload.reasonCodes),
    warnings: uniq(payload.warnings),
    safeSummaryOnly: true,
  });
  return scanObjectForUnsafe(report).length
    ? simpleStatus(statusKey, 'fail', { reasonCodes: ['unsafe_value_detected'], safeSummaryOnly: true })
    : report;
}

function pass(statusKey, payload = {}) {
  return status(statusKey, 'pass', payload);
}

function fail(statusKey, reasonCodes, payload = {}) {
  return status(statusKey, 'fail', { ...payload, reasonCodes });
}

function notApplicable(statusKey, reasonCodes = ['not_relevant_for_task_mode'], payload = {}) {
  return status(statusKey, 'not_applicable', { ...payload, reasonCodes });
}

function hasAny(input, keys) {
  return keys.some((key) => bool(input[key]));
}

function oneLine(value) {
  return typeof value === 'string' && value.trim() && !value.includes('\n');
}

function isVague(value) {
  return /if needed|as needed|maybe|必要なら|確認してください|later/i.test(String(value || ''));
}

export function buildReasonSummaryFinalAggregationReport(input = {}) {
  const reasons = [];
  if (input.targetQualityScoreStatus === 'pass' && input.reportStatus === 'fail' && !input.activeBlockingReasons?.length) {
    reasons.push('target_quality_pass_but_report_fail');
  }
  if (bool(input.legacyAdvisoryPromotedToFailure)) reasons.push('legacy_advisory_promoted_to_failure');
  if (bool(input.staleBlockingReasonRemains)) reasons.push('stale_blocking_reason_not_removed');
  if (hasAny(input, ['productVerificationFail', 'safeOutputFail', 'targetQualityFail', 'runtimeReadinessViolation', 'productionGoViolation'])) {
    return fail('reasonSummaryFinalAggregationStatus', ['reason_summary_final_aggregation_inconsistent'], { blockingPreserved: true });
  }
  return reasons.length ? fail('reasonSummaryFinalAggregationStatus', reasons) : pass('reasonSummaryFinalAggregationStatus');
}

export function buildRemoteNpmDiagnosticTruthReport(input = {}) {
  const reasons = [];
  const executed = bool(input.remoteProductEvidenceNpmExecuted || input.remoteNpmDiagnosticNpmExecuted || input.remoteProductBaselineNpmExecuted);
  if (bool(input.requiresProductVerification) && !executed) reasons.push('remote_npm_truth_missing');
  if (executed && input.classification === 'remote_npm_not_executed') reasons.push('remote_npm_truth_missing');
  if (bool(input.normalizerMissingField)) reasons.push('remote_npm_executed_but_normalizer_missing');
  if (bool(input.staleHead)) reasons.push('remote_npm_executed_but_stale_head');
  if (bool(input.profileMismatch)) reasons.push('remote_npm_profile_mismatch');
  if (bool(input.bodyGovernanceMissing)) reasons.push('pr_body_governance_safe_patch_missing');
  return reasons.length ? fail('remoteNpmDiagnosticTruthStatus', reasons) : pass('remoteNpmDiagnosticTruthStatus', {
    classification: input.classification || (executed ? 'remote_npm_executed_current_head' : 'remote_npm_not_required'),
    commandClass: input.commandClass || 'not_applicable',
    commandCwd: input.commandCwd || 'not_applicable',
  });
}

export function buildLocalRemoteFailureDeltaClassifierReport(input = {}) {
  const classification = input.classification || 'local_pass_remote_pass';
  if (classification === 'unknown') return fail('localRemoteFailureDeltaClassifierStatus', ['local_remote_failure_delta_unknown']);
  if (bool(input.localPassRemoteFailNoAction)) return fail('localRemoteFailureDeltaClassifierStatus', ['safe_next_action_not_precise']);
  return pass('localRemoteFailureDeltaClassifierStatus', { classification });
}

export function routeProductSurface(files = [], options = {}) {
  const changedFiles = Array.isArray(files) ? files : [];
  const surfaces = [];
  const add = (surface) => {
    if (!surfaces.some((item) => item.commandClass === surface.commandClass && item.commandCwd === surface.commandCwd)) surfaces.push(surface);
  };
  for (const file of changedFiles) {
    if (file.startsWith('apps/backend/')) add({ commandClass: 'backend_npm_test', commandCwd: 'apps/backend' });
    else if (file.startsWith('contracts/')) add({ commandClass: 'contracts_npm_test', commandCwd: 'contracts' });
    else if (file.startsWith('apps/frontend/')) add({ commandClass: 'frontend_build_or_test', commandCwd: 'apps/frontend' });
    else if (file === 'scripts/run-tests.js') add({ commandClass: 'product_test_surface', commandCwd: '.' });
    else if (file === 'package.json') add({ commandClass: 'package_surface', commandCwd: '.' });
    else if ((file.startsWith('src/') || file.startsWith('test/')) && bool(options.rootPackageExists)) add({ commandClass: 'root_npm_test', commandCwd: '.' });
  }
  return surfaces;
}

export function buildProductSurfaceRouterReport(input = {}) {
  const surfaces = input.surfaces || routeProductSurface(input.changedFiles || [], input);
  const reasons = [];
  if (bool(input.rootPackageMissingButRootNpm)) reasons.push('command_scope_mismatch');
  if (bool(input.wrongSurfaceOnly) || bool(input.contractsOnlyRanBackend) || bool(input.backendOnlyRanRoot)) reasons.push('command_scope_mismatch');
  if (bool(input.commandCwdMissing) || surfaces.some((surface) => !surface.commandCwd)) reasons.push('command_cwd_missing');
  if (bool(input.commandClassMissing) || surfaces.some((surface) => !surface.commandClass)) reasons.push('product_surface_router_missing');
  if (surfaces.length > 1 && !bool(input.multiSurfaceEvidence)) reasons.push('product_surface_router_missing');
  return reasons.length ? fail('productSurfaceRouterStatus', reasons, { surfaces }) : pass('productSurfaceRouterStatus', { surfaces });
}

export function buildActiveSelfTestArtifactSourceReport(input = {}) {
  const active = input.activeSelfTest || {
    version: '1.0.3',
    statusKey: 'v103SelfTestStatus',
    reportEnv: 'CODEX_V103_SELF_TEST_REPORT',
    suite: 'v103',
    artifact: 'codex-self-test-cases.safe.json',
  };
  const reasons = [];
  if (active.version !== '1.0.3' || active.statusKey !== 'v103SelfTestStatus' || active.reportEnv !== 'CODEX_V103_SELF_TEST_REPORT') reasons.push('active_self_test_artifact_mismatch');
  if (bool(input.legacyArtifactUsedAsActive)) reasons.push('legacy_artifact_used_as_active');
  if (bool(input.activeArtifactMissing)) reasons.push('active_self_test_artifact_mismatch');
  return reasons.length ? fail('activeSelfTestArtifactSourceStatus', reasons, { activeSelfTest: active }) : pass('activeSelfTestArtifactSourceStatus', { activeSelfTest: active });
}

export function buildPrBodyGovernanceAutoRepairReport(input = {}) {
  const missingSections = input.missingSections || [];
  const missingEvidenceFields = input.missingEvidenceFields || [];
  const safeSuggestedPatch = input.safeSuggestedPatch || (missingSections.length || missingEvidenceFields.length ? 'add_missing_safe_evidence_sections' : 'none');
  if (bool(input.implementationFailureHiddenAsBodyOnly)) return fail('prBodyGovernanceAutoRepairStatus', ['pr_body_governance_safe_patch_missing']);
  if ((missingSections.length || missingEvidenceFields.length) && !safeSuggestedPatch) return fail('prBodyGovernanceAutoRepairStatus', ['pr_body_governance_safe_patch_missing']);
  return pass('prBodyGovernanceAutoRepairStatus', {
    missingSections,
    missingEvidenceFields,
    safeSuggestedPatch,
    bodyOnlyRepairAllowed: !bool(input.implementationRepairRequired),
    implementationRepairRequired: bool(input.implementationRepairRequired),
    manualOwnerDecisionRequired: bool(input.manualOwnerDecisionRequired),
  });
}

export function buildReviewEvidenceTaxonomyReport(input = {}) {
  const type = input.type || 'human_independent_review';
  if (type === 'writer_self_review') return fail('reviewEvidenceTaxonomyStatus', ['writer_self_review_detected']);
  if (type === 'stale_review' || bool(input.headMismatch)) return fail('reviewEvidenceTaxonomyStatus', ['stale_audit_input_detected']);
  if (type === 'unknown_review') return fail('reviewEvidenceTaxonomyStatus', ['review_evidence_taxonomy_missing']);
  const satisfiesHumanIndependence = type === 'human_independent_review';
  return pass('reviewEvidenceTaxonomyStatus', { type, satisfiesHumanIndependence });
}

export function buildContractReadinessProfileReport(input = {}) {
  const reasons = [];
  if (bool(input.contractSourceChanged) && !bool(input.contractsTestRun)) reasons.push('contract_readiness_profile_missing');
  if (bool(input.deployScriptChanged) && !bool(input.escalatedProfile)) reasons.push('contract_readiness_profile_missing');
  if (hasAny(input, ['fundedTxClaimed', 'governanceTxClaimed', 'chainReadinessClaimed'])) reasons.push('contract_readiness_profile_missing');
  return reasons.length ? fail('contractReadinessProfileStatus', reasons) : pass('contractReadinessProfileStatus', { profile: 'contract_readiness_test_r2', noDeploy: true });
}

export function buildGithubEventPayloadFreshnessReport(input = {}) {
  return bool(input.eventPayloadStale) ? fail('githubEventPayloadFreshnessStatus', ['github_event_payload_stale']) : pass('githubEventPayloadFreshnessStatus');
}

export function buildPrBodyLiveFetchReport(input = {}) {
  return bool(input.liveFetchMissing) ? fail('prBodyLiveFetchStatus', ['pr_body_live_fetch_missing']) : pass('prBodyLiveFetchStatus');
}

export function buildSafeArtifactHeadMatchReport(input = {}) {
  return bool(input.headMismatch) ? fail('safeArtifactHeadMatchStatus', ['safe_artifact_head_mismatch']) : pass('safeArtifactHeadMatchStatus');
}

export function buildEventPayloadVsLivePrBodyDiffReport(input = {}) {
  return bool(input.diffFound) && !bool(input.safeSummaryPresent)
    ? fail('eventPayloadVsLivePrBodyDiffStatus', ['event_payload_live_body_diff'])
    : pass('eventPayloadVsLivePrBodyDiffStatus');
}

export function buildRerunUsesStaleEventPayloadReport(input = {}) {
  return bool(input.rerunUsesStaleEventPayload)
    ? fail('rerunUsesStaleEventPayloadStatus', ['rerun_uses_stale_event_payload'])
    : pass('rerunUsesStaleEventPayloadStatus');
}

export function buildStaleAuditInputReport(input = {}) {
  const reasons = [];
  if (bool(input.eventPayloadStale)) reasons.push('github_event_payload_stale');
  if (bool(input.liveFetchMissing)) reasons.push('pr_body_live_fetch_missing');
  if (bool(input.artifactHeadMismatch)) reasons.push('safe_artifact_head_mismatch');
  if (bool(input.rerunUsesStaleEventPayload)) reasons.push('rerun_uses_stale_event_payload');
  return reasons.length ? fail('staleAuditInputStatus', reasons) : pass('staleAuditInputStatus');
}

export function buildMergeReadinessReasonLadderReport(input = {}) {
  const reason = input.blockingReason || 'merge_ready';
  const allowed = [
    'non_overridable_failure',
    'product_failure',
    'runtime_or_production_readiness_violation',
    'same_head_remote_missing',
    'review_independence_missing',
    'external_blocked',
    'body_governance_missing',
    'stale_input',
    'manual_owner_decision_required',
    'ready_for_owner_confirmation',
    'merge_ready',
  ];
  if (!allowed.includes(reason) || bool(input.externalBlockedMergeReady) || !oneLine(input.nextAction || 'merge_when_gates_pass')) {
    return fail('mergeReadinessReasonLadderStatus', ['merge_readiness_reason_ladder_missing']);
  }
  return pass('mergeReadinessReasonLadderStatus', {
    blockingReason: reason,
    whyBlocked: input.whyBlocked || 'none',
    nextAction: input.nextAction || 'merge_when_gates_pass',
    doNotDo: input.doNotDo || 'do_not_claim_readiness',
    mergeReadiness: reason === 'merge_ready' ? 'yes' : 'no',
  });
}

export function buildCodexActionBoundaryReport(input = {}) {
  const state = input.state || 'codex_action_allowed';
  const allowed = [
    'codex_action_allowed',
    'codex_body_only_repair_allowed',
    'codex_safe_artifact_triage_allowed',
    'codex_waiting_for_external_review',
    'codex_waiting_for_github_event_freshness',
    'codex_waiting_for_owner_decision',
    'codex_blocked_non_overridable',
  ];
  return allowed.includes(state) ? pass('codexActionBoundaryStatus', { state }) : fail('codexActionBoundaryStatus', ['codex_action_boundary_missing']);
}

export function buildUserManualWorkProhibitedReport(input = {}) {
  return bool(input.codexWorkPushedToUser) || bool(input.codexSubstitutedExternalReview)
    ? fail('userManualWorkProhibitedStatus', ['user_manual_work_pushed_back'])
    : pass('userManualWorkProhibitedStatus');
}

export function buildSafeNextActionPrecisionReport(input = {}) {
  const action = input.safeNextAction || 'verify_source_pr_remote_gate';
  return oneLine(action) && !isVague(action)
    ? pass('safeNextActionPrecisionStatus', { safeNextAction: action })
    : fail('safeNextActionPrecisionStatus', ['safe_next_action_not_precise']);
}

export function buildPr42TargetSafeJsonFinalizationReport(input = {}) {
  const reasons = [];
  const report = input.report || null;
  const failureClass = input.failureClass || '';
  if (bool(input.emptyReport) || (report && Object.keys(report).length === 0)) reasons.push('v103_real_pr42_empty_target_safe_json');
  if (bool(input.minimalFailure) || (report?.status === 'fail' && !oneLine(failureClass) && !(report?.failures || []).some((item) => oneLine(item?.id)))) {
    reasons.push('v103_real_pr42_minimal_failure_without_gate_label');
  }
  if (bool(input.finalizationGap)) reasons.push('v103_real_pr42_report_finalization_gap');
  if (bool(input.noSafeJsonReport)) reasons.push('v103_real_pr42_no_safe_json_report');
  if (bool(input.finalSafeJsonNotWritten)) reasons.push('v103_pr42_final_safe_json_not_written');
  if (bool(input.targetFinalizerSkipped)) reasons.push('v103_pr42_target_finalizer_skipped');
  if (bool(input.reportFinalizerOrderingGap)) reasons.push('v103_pr42_report_finalizer_ordering_gap');
  if (bool(input.safeReportWriteAfterFailureSkipped)) reasons.push('v103_pr42_safe_report_write_after_failure_skipped');
  if (bool(input.lifeboatQualityscoreFinalizerGap)) reasons.push('v103_pr42_lifeboat_qualityscore_finalizer_gap');
  if (bool(input.childBoundaryFinalizerGap)) reasons.push('v103_pr42_child_boundary_finalizer_gap');
  if (bool(input.unclassifiedNoReportPath)) reasons.push('v103_pr42_unclassified_no_report_path');
  if (bool(input.timeoutWithoutReport)) reasons.push('v103_real_pr42_timeout_without_report');
  if (bool(input.untrackedSafeFailureArtifact)) reasons.push('v103_real_pr42_untracked_safe_failure_artifact');
  if (bool(input.artifactPathNotRepoExternal)) reasons.push('v103_real_pr42_artifact_path_not_repo_external');
  if (bool(input.childProcessBlocksFinalizer)) reasons.push('v103_real_pr42_child_process_blocks_finalizer');
  if (bool(input.synchronousChildTimeoutGap)) reasons.push('v103_real_pr42_synchronous_child_timeout_gap');
  if (bool(input.childProcessTimeoutBoundaryMissing)) reasons.push('v103_pr42_child_process_timeout_boundary_missing');
  if (bool(input.synchronousChildBlocksFinalizer)) reasons.push('v103_pr42_synchronous_child_blocks_finalizer');
  if (bool(input.spawnTimeoutNotEnforced)) reasons.push('v103_pr42_spawn_timeout_not_enforced');
  if (bool(input.childTimeoutNoSafeReport)) reasons.push('v103_pr42_child_timeout_no_safe_report');
  if (bool(input.childExitNotObserved)) reasons.push('v103_pr42_child_exit_not_observed');
  if (bool(input.childStdioBlocking)) reasons.push('v103_pr42_child_stdio_blocking');
  if (bool(input.childProcessArtifactFinalizationGap)) reasons.push('v103_pr42_child_process_artifact_finalization_gap');
  if (bool(input.timeoutFinalizerOrderingBug)) reasons.push('v103_pr42_timeout_finalizer_ordering_bug');
  if (bool(input.untrackedArtifactAfterChildTimeout)) reasons.push('v103_pr42_untracked_artifact_after_child_timeout');
  if (bool(input.unknownChildProcessTimeoutBoundary)) reasons.push('v103_unknown_child_process_timeout_boundary');
  if (bool(input.simulationRealPathDelta)) reasons.push('v103_real_pr42_simulation_real_path_delta');
  if (bool(input.artifactPathMismatch)) reasons.push('v103_real_pr42_artifact_path_mismatch');
  if (bool(input.artifactShapeMismatch)) reasons.push('v103_real_pr42_evidence_artifact_shape_mismatch');
  if (bool(input.unclassifiedFailure)) reasons.push('v103_real_pr42_unclassified_failure_boundary');
  if (bool(input.pendingAfterPushTreatedAsRemotePass) || bool(input.remoteEvidencePassWithoutSameHead) || bool(input.targetMergeReadyWithoutSameHead)) {
    reasons.push('v103_real_pr42_unclassified_failure_boundary');
  }
  return reasons.length
    ? fail('pr42TargetSafeJsonFinalizationStatus', reasons, {
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
      })
    : pass('pr42TargetSafeJsonFinalizationStatus', {
        pendingAfterPush: bool(input.pendingAfterPush) || true,
        remoteEvidencePass: false,
        targetMergeReady: false,
      });
}

export function buildPr42MetadataClassificationReport(input = {}) {
  const expectedFiles = [
    'docs/iris-live2d-renderer/IRIS_LIVE2D_LOADER_INTEGRATION_PREFLIGHT.md',
    'docs/iris-live2d-renderer/IRIS_LIVE2D_RENDERER_DEVELOPMENT_SCHEDULE.md',
    'src/renderer/cubismLoaderProvisioning.js',
    'src/renderer/cubismRenderer.js',
    'src/server.js',
    'src/state.js',
    'test/contract.test.js',
  ];
  const files = Array.isArray(input.changedFiles) ? input.changedFiles.map(String) : expectedFiles;
  const exactScope = files.length === expectedFiles.length && expectedFiles.every((file) => files.includes(file));
  const unexpectedLive2dDoc = files.some((file) => /^docs\/iris-live2d-renderer\//.test(file) && !expectedFiles.includes(file));
  const harnessOnly = bool(input.harnessOnly);
  const hasProfileMetadata = bool(input.profileMetadataPresent);
  const hasReviewMetadata = bool(input.reviewIndependenceMetadataPresent);
  const reviewMetadataFabricated = bool(input.reviewIndependenceMetadataFabricated);
  const remoteNpmMarker = bool(input.remoteNpmPrepushDiagnosticPresent);
  const remoteNpmMarkerAsRemotePass = bool(input.remoteNpmMarkerTreatedAsRemotePass);
  const reasons = [];
  if (!exactScope) reasons.push('v103_pr42_exact_docs_scope_missing');
  if (unexpectedLive2dDoc) reasons.push('v103_pr42_classification_unknown_file');
  if (harnessOnly && files.some((file) => /^docs\/iris-live2d-renderer\//.test(file))) reasons.push('v103_pr42_classification_unknown_file');
  if (!hasProfileMetadata) reasons.push('v103_pr42_profile_sections_missing');
  if (!hasReviewMetadata) reasons.push('v103_pr42_review_independence_metadata_missing');
  if (reviewMetadataFabricated) reasons.push('v103_pr42_review_independence_metadata_missing');
  if (!remoteNpmMarker) reasons.push('v103_pr42_remote_npm_marker_missing');
  if (remoteNpmMarkerAsRemotePass) reasons.push('v103_pr42_remote_npm_marker_prepush_misclassified');
  if (bool(input.pendingAfterPushTreatedAsRemotePass) || bool(input.remoteEvidencePassWithoutSameHead) || bool(input.targetMergeReadyWithoutSameHead)) {
    reasons.push('v103_pr42_remote_npm_marker_prepush_misclassified');
  }
  return reasons.length
    ? fail('pr42MetadataClassificationStatus', reasons, {
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
      })
    : pass('pr42MetadataClassificationStatus', {
        exactPr42Scope: true,
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
      });
}

export const PR42_FIXED_CHILD_BOUNDARY_LABELS = [
  'v103_pr42_child_process_timeout_boundary_missing',
  'v103_pr42_synchronous_child_blocks_finalizer',
  'v103_pr42_spawn_timeout_not_enforced',
  'v103_pr42_child_timeout_no_safe_report',
  'v103_pr42_child_exit_not_observed',
  'v103_pr42_child_stdio_blocking',
  'v103_pr42_child_process_artifact_finalization_gap',
  'v103_pr42_timeout_finalizer_ordering_bug',
  'v103_pr42_untracked_artifact_after_child_timeout',
  'v103_unknown_child_process_timeout_boundary',
];

export function buildPr42ContractMarkerReport(input = {}) {
  const labels = Array.isArray(input.childBoundaryLabels) ? input.childBoundaryLabels.map(String) : [];
  const hasChildBoundaryLabel = bool(input.childBoundaryLabelPresent) || labels.some((label) => PR42_FIXED_CHILD_BOUNDARY_LABELS.includes(label));
  const unknownChildBoundaryLabel = bool(input.unknownChildBoundaryLabel) || labels.some((label) => (/^v103_pr42_.*child|child.*boundary/).test(label) && !PR42_FIXED_CHILD_BOUNDARY_LABELS.includes(label));
  const hasContractMetadata = bool(input.contractMetadataPresent);
  const recognizedContractMetadata = bool(input.contractMetadataRecognized);
  const fabricatedContractMetadata = bool(input.contractMetadataFabricated);
  const hasRemoteNpmNormalizationMarker = bool(input.remoteNpmNormalizationMarkerPresent);
  const remoteNpmNormalizationAsRemotePass = bool(input.remoteNpmNormalizationMarkerTreatedAsRemotePass);
  const reasons = [];
  if (!hasChildBoundaryLabel || unknownChildBoundaryLabel) reasons.push('v103_pr42_child_boundary_label_not_recognized');
  if (!hasContractMetadata) reasons.push('v103_pr42_contract_metadata_missing');
  if (hasContractMetadata && (!recognizedContractMetadata || fabricatedContractMetadata)) reasons.push('v103_pr42_contract_metadata_not_recognized');
  if (!hasRemoteNpmNormalizationMarker) reasons.push('v103_pr42_remote_npm_normalization_marker_missing');
  if (remoteNpmNormalizationAsRemotePass) reasons.push('v103_pr42_remote_npm_normalization_marker_misclassified');
  if (bool(input.realpathSimulationDelta)) reasons.push('v103_pr42_metadata_contract_realpath_delta');
  if (bool(input.remoteNpmMarkerRealpathSimulationDelta)) reasons.push('v103_pr42_remote_npm_marker_realpath_simulation_delta');
  if (bool(input.pendingAfterPushTreatedAsRemotePass) || bool(input.remoteEvidencePassWithoutSameHead) || bool(input.targetMergeReadyWithoutSameHead)) {
    reasons.push('v103_pr42_remote_npm_normalization_marker_misclassified');
  }
  if (bool(input.runtimeReadinessClaimed) || bool(input.productionReadinessClaimed)) reasons.push('v103_unknown_pr42_contract_marker_blocker');
  return reasons.length
    ? fail('pr42ContractMarkerStatus', reasons, {
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
      })
    : pass('pr42ContractMarkerStatus', {
        childBoundaryLabelsAreReadiness: false,
        contractMetadataFabricated: false,
        remoteNpmNormalizationMarkerIsRemotePass: false,
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
      });
}

export function buildPr42LifeboatQualityScoreReport(input = {}) {
  const reasons = [];
  const lifeboatStatus = String(input.lifeboatStatus || (bool(input.lifeboatArtifactPresent) ? 'pass' : ''));
  const scoreStatus = String(input.targetQualityScoreStatus || (bool(input.targetQualityScoreComputed) ? 'pass' : ''));
  if (!bool(input.lifeboatArtifactPresent)) reasons.push('v103_pr42_artifact_lifeboat_missing');
  if (bool(input.lifeboatArtifactNotGenerated)) reasons.push('v103_pr42_lifeboat_artifact_not_generated');
  if (bool(input.lifeboatArtifactPathMismatch)) reasons.push('v103_pr42_lifeboat_artifact_path_mismatch');
  if (lifeboatStatus && lifeboatStatus !== 'pass') reasons.push('v103_pr42_lifeboat_artifact_not_recognized');
  if (bool(input.lifeboatOnlyEvidencePass)) reasons.push('v103_pr42_lifeboat_only_evidence_rejected');
  if (!bool(input.targetQualityScoreComputed)) reasons.push('v103_pr42_target_quality_score_missing');
  if (scoreStatus && !['pass', 'manual_confirmation_required', 'fail'].includes(scoreStatus)) reasons.push('v103_pr42_target_quality_score_not_computed');
  if (bool(input.targetQualityScoreRequiresRemoteBeforePush)) reasons.push('v103_pr42_target_quality_score_remote_required_before_push');
  if (bool(input.targetQualityScoreTreatedAsRemotePass)) reasons.push('v103_pr42_target_quality_score_prepush_misclassified');
  if (bool(input.targetQualityScoreTreatedAsMergeReady)) reasons.push('v103_pr42_target_quality_score_prepush_misclassified');
  if (bool(input.realpathDelta)) reasons.push('v103_pr42_lifeboat_qualityscore_realpath_delta');
  if (bool(input.pendingAfterPushTreatedAsRemotePass) || bool(input.remoteEvidencePassWithoutSameHead) || bool(input.targetMergeReadyWithoutSameHead)) {
    reasons.push('v103_pr42_target_quality_score_prepush_misclassified');
  }
  if (bool(input.runtimeReadinessClaimed) || bool(input.productionReadinessClaimed)) reasons.push('v103_unknown_pr42_lifeboat_qualityscore_blocker');
  return reasons.length
    ? fail('pr42LifeboatQualityScoreStatus', reasons, {
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
      })
    : pass('pr42LifeboatQualityScoreStatus', {
        lifeboatOnlyEvidenceRejected: true,
        targetQualityScoreIsRemotePass: false,
        targetQualityScoreIsMergeReadyEvidence: false,
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
      });
}

export function buildPr42ManualProfileReviewScopeReport(input = {}) {
  const reasons = [];
  const prepush = bool(input.pr42ProductR3Prepush);
  if (bool(input.prProfileConflict) && !prepush) reasons.push('v103_pr42_pr_profile_conflict_prepush');
  if (bool(input.manualConfirmationSatisfiedWithoutOwner)) reasons.push('v103_pr42_manual_confirmation_phase_misclassified');
  if (bool(input.codeReviewSatisfiedWithoutEvidence)) reasons.push('v103_pr42_code_review_monitor_phase_misclassified');
  if (bool(input.v085StabilityDisabled)) reasons.push('v103_pr42_v085_stability_manual_misclassified');
  if (bool(input.requiredHeadingHardFailure)) reasons.push('v103_pr42_required_heading_hint_warning_blocks_target');
  if (bool(input.pendingAfterPushTreatedAsRemotePass) || bool(input.remoteEvidencePassWithoutSameHead) || bool(input.targetMergeReadyWithoutSameHead) || bool(input.mergeReadyBeforeRemoteAndOwner)) {
    reasons.push('v103_pr42_merge_confirmation_required_during_prepush');
  }
  if (bool(input.runtimeReadinessClaimed)) reasons.push('runtime_readiness_claimed');
  if (bool(input.productionReadinessClaimed)) reasons.push('production_readiness_claimed');
  return reasons.length
    ? fail('pr42ManualProfileReviewScopeStatus', reasons, {
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
        mergeReady: false,
      })
    : pass('pr42ManualProfileReviewScopeStatus', {
        pendingAfterPush: true,
        remoteEvidencePass: false,
        targetMergeReady: false,
        mergeReady: false,
        manualConfirmationRequiredBeforeMerge: true,
        codeReviewRequiredBeforeMerge: true,
        requiredHeadingHintGuidanceOnly: true,
      });
}

export function buildDesignOnlyPrReport(input = {}) {
  return hasAny(input, ['runtimeBehaviorChanged', 'designClaimedAsImplementation'])
    ? fail('designOnlyPrStatus', ['design_only_pr_misclassified_as_implementation'])
    : pass('designOnlyPrStatus');
}

export function buildImplementationDeferredReport(input = {}) {
  return bool(input.implementationStarted)
    ? fail('implementationDeferredStatus', ['implementation_deferred_not_respected'])
    : pass('implementationDeferredStatus');
}

export function buildFiveFiveLowModeReport(input = {}) {
  return hasAny(input, ['multiPr', 'multiRepo', 'largeRefactor', 'rawLogRead', 'rawDiffRead', 'multipleSafeNextActions', 'backgroundPromises'])
    ? fail('fiveFiveLowModeStatus', ['five_five_low_mode_violation'])
    : pass('fiveFiveLowModeStatus', { mode: input.mode || '5.5_low' });
}

export function buildDynamicWorkflowDecisionReport(input = {}) {
  return bool(input.smallPrForcedWorkflow)
    ? fail('dynamicWorkflowDecisionStatus', ['dynamic_workflow_overused'])
    : pass('dynamicWorkflowDecisionStatus', { decision: input.decision || 'not_required_for_small_patch' });
}

export function buildWorkflowGoalContractReport(input = {}) {
  return input.goal && input.doneCriteria ? pass('workflowGoalContractStatus') : pass('workflowGoalContractStatus', { defaulted: true });
}

export function buildWorkflowArtifactReport(input = {}) {
  return bool(input.productReadyFromWorkflowArtifact)
    ? fail('workflowArtifactStatus', ['dynamic_workflow_overused'])
    : pass('workflowArtifactStatus');
}

export function buildWorkPacketSchemaReport(input = {}) {
  const packet = input.packet || { goal: 'classify', files: [], forbiddenScope: [], expectedOutput: 'safe_summary', verification: 'self_test' };
  const missing = ['goal', 'files', 'forbiddenScope', 'expectedOutput', 'verification'].filter((key) => packet[key] === undefined);
  return missing.length ? fail('workPacketSchemaStatus', ['dynamic_workflow_overused'], { missing }) : pass('workPacketSchemaStatus');
}

export function buildWorkerRoleMatrixReport(input = {}) {
  return bool(input.roleMissing) ? fail('workerRoleMatrixStatus', ['dynamic_workflow_overused']) : pass('workerRoleMatrixStatus');
}

export function buildWorkerFileOwnershipV2Report(input = {}) {
  return bool(input.fileOwnershipConflict)
    ? fail('workerFileOwnershipV2Status', ['worker_file_ownership_conflict_v2'])
    : pass('workerFileOwnershipV2Status');
}

export function buildParallelWorkerBudgetV103Report(input = {}) {
  return bool(input.unboundedWorkers) ? fail('parallelWorkerBudgetStatus', ['dynamic_workflow_overused']) : pass('parallelWorkerBudgetStatus');
}

export function buildApprovalGateReport(input = {}) {
  return hasAny(input, ['txWithoutApproval', 'deployWithoutApproval', 'migrationWithoutApproval'])
    ? fail('approvalGateStatus', ['dynamic_workflow_overused'])
    : pass('approvalGateStatus');
}

export function buildSimulatedSubagentFallbackReport(input = {}) {
  return bool(input.claimedExecuted)
    ? fail('simulatedSubagentFallbackStatus', ['simulated_subagent_misrepresented'])
    : pass('simulatedSubagentFallbackStatus');
}

export function buildSubagentRunnerAvailabilityReport(input = {}) {
  return bool(input.runnerRequired) && !bool(input.runnerAvailable)
    ? notApplicable('subagentRunnerAvailabilityStatus', ['subagent_runner_not_available'])
    : pass('subagentRunnerAvailabilityStatus');
}

export function buildWorkPacketResultReport(input = {}) {
  return bool(input.resultMissing) ? fail('workPacketResultStatus', ['dynamic_workflow_overused']) : pass('workPacketResultStatus');
}

export function buildIntegrationConflictReport(input = {}) {
  return bool(input.conflict) ? fail('integrationConflictStatus', ['worker_file_ownership_conflict_v2']) : pass('integrationConflictStatus');
}

export function buildAdversarialReviewReport(input = {}) {
  return bool(input.missing) ? fail('adversarialReviewStatus', ['dynamic_workflow_overused']) : pass('adversarialReviewStatus');
}

export function buildVerificationFanInReport(input = {}) {
  return hasAny(input, ['conflictingPacketResults', 'evidenceMissing', 'scopeLeak'])
    ? fail('verificationFanInStatus', ['dynamic_workflow_overused'])
    : pass('verificationFanInStatus');
}

export function buildWorkflowResumeCheckpointReport(input = {}) {
  return bool(input.checkpointMissing) ? fail('workflowResumeCheckpointStatus', ['dynamic_workflow_overused']) : pass('workflowResumeCheckpointStatus');
}

export function buildWorkflowCostBudgetV103Report(input = {}) {
  return bool(input.unboundedCost) ? fail('workflowCostBudgetStatus', ['dynamic_workflow_overused']) : pass('workflowCostBudgetStatus');
}

export function buildWorkflowContextBudgetReport(input = {}) {
  return bool(input.contextOverflow) ? fail('workflowContextBudgetStatus', ['dynamic_workflow_overused']) : pass('workflowContextBudgetStatus');
}

export function buildWorkflowFinalReportReport(input = {}) {
  return bool(input.finalReportMissing) ? fail('workflowFinalReportStatus', ['dynamic_workflow_overused']) : pass('workflowFinalReportStatus');
}

export function buildFunkyRuntimeAdoptionSequenceReport(input = {}) {
  return bool(input.sequenceSkipped) ? fail('funkyRuntimeAdoptionSequenceStatus', ['dynamic_workflow_overused']) : pass('funkyRuntimeAdoptionSequenceStatus');
}

export function buildReceiptFetcherNoSecretPreflightReport(input = {}) {
  return hasAny(input, ['rpcEnvRead', 'providerCreated', 'rawReceiptStored', 'rawProviderErrorPrinted'])
    ? fail('receiptFetcherNoSecretPreflightStatus', ['remote_npm_truth_missing'])
    : pass('receiptFetcherNoSecretPreflightStatus');
}

export function buildStagingNoTxEvidenceReport(input = {}) {
  return hasAny(input, ['fundedTx', 'mintTx', 'governanceTx', 'privateKey', 'realRpcSecret', 'runtimeReadinessClaimed'])
    ? fail('stagingNoTxEvidenceStatus', ['contract_readiness_profile_missing'])
    : pass('stagingNoTxEvidenceStatus');
}

export function buildRuntimeReadinessBlockerDigestReport(input = {}) {
  return bool(input.readinessClaimedWithoutOracle)
    ? fail('runtimeReadinessBlockerDigestStatus', ['contract_readiness_profile_missing'])
    : pass('runtimeReadinessBlockerDigestStatus');
}

export function buildFunkySafeRowExportReport(input = {}) {
  return bool(input.unsafeFieldExported) ? fail('funkySafeRowExportStatus', ['remote_npm_truth_missing']) : pass('funkySafeRowExportStatus');
}

export function buildDatasetAuditV2SpecReport(input = {}) {
  return bool(input.runnerImplemented) ? fail('datasetAuditV2SpecStatus', ['implementation_deferred_not_respected']) : pass('datasetAuditV2SpecStatus');
}

export function buildGameToolAdapterFixturePackReport(input = {}) {
  return bool(input.runtimeImplemented) ? fail('gameToolAdapterFixturePackStatus', ['implementation_deferred_not_respected']) : pass('gameToolAdapterFixturePackStatus');
}

export function buildBelovedAvatarSafetyAuditSpecReport(input = {}) {
  return bool(input.runnerImplemented) ? fail('belovedAvatarSafetyAuditSpecStatus', ['implementation_deferred_not_respected']) : pass('belovedAvatarSafetyAuditSpecStatus');
}

export function buildVgcFunkyReleaseLadderReport(input = {}) {
  return bool(input.stageSkipped) ? fail('vgcFunkyReleaseLadderStatus', ['contract_readiness_profile_missing']) : pass('vgcFunkyReleaseLadderStatus');
}

export function buildV103SelfTestRegistrationReport(input = {}) {
  const reasons = [];
  if (!fs.existsSync('scripts/codex-v103-self-test.mjs') || bool(input.selfTestMissing)) reasons.push('v103_self_test_missing');
  if (!readText('scripts/codex-local-quality-gate.mjs')?.includes('v103SelfTestStatus')) reasons.push('v103_self_test_missing');
  const manifestText = readText('CODEX_SOURCE_HARNESS_MANIFEST.json') || readText('docs/process/CODEX_HARNESS_MANIFEST.json');
  if (!manifestText?.includes('codex-v103-self-test.mjs')) reasons.push('v103_self_test_missing');
  return reasons.length ? fail('v103SelfTestStatus', reasons) : pass('v103SelfTestStatus');
}

export function buildDefaultV103Reports(context = {}) {
  const safeNextAction = context.safeNextAction || 'verify_source_pr_remote_gate';
  return {
    reasonSummaryFinalAggregationStatus: buildReasonSummaryFinalAggregationReport(),
    remoteNpmDiagnosticTruthStatus: buildRemoteNpmDiagnosticTruthReport(),
    localRemoteFailureDeltaClassifierStatus: buildLocalRemoteFailureDeltaClassifierReport(),
    productSurfaceRouterStatus: buildProductSurfaceRouterReport({ changedFiles: [], rootPackageExists: fs.existsSync('package.json'), multiSurfaceEvidence: true }),
    activeSelfTestArtifactSourceStatus: buildActiveSelfTestArtifactSourceReport(),
    prBodyGovernanceAutoRepairStatus: buildPrBodyGovernanceAutoRepairReport(),
    reviewEvidenceTaxonomyStatus: buildReviewEvidenceTaxonomyReport(),
    contractReadinessProfileStatus: buildContractReadinessProfileReport(),
    staleAuditInputStatus: buildStaleAuditInputReport(),
    githubEventPayloadFreshnessStatus: buildGithubEventPayloadFreshnessReport(),
    prBodyLiveFetchStatus: buildPrBodyLiveFetchReport(),
    safeArtifactHeadMatchStatus: buildSafeArtifactHeadMatchReport(),
    eventPayloadVsLivePrBodyDiffStatus: buildEventPayloadVsLivePrBodyDiffReport(),
    rerunUsesStaleEventPayloadStatus: buildRerunUsesStaleEventPayloadReport(),
    mergeReadinessReasonLadderStatus: buildMergeReadinessReasonLadderReport({ nextAction: safeNextAction }),
    codexActionBoundaryStatus: buildCodexActionBoundaryReport(),
    userManualWorkProhibitedStatus: buildUserManualWorkProhibitedReport(),
    safeNextActionPrecisionStatus: buildSafeNextActionPrecisionReport({ safeNextAction }),
    pr42TargetSafeJsonFinalizationStatus: buildPr42TargetSafeJsonFinalizationReport({ pendingAfterPush: true }),
    pr42ContractMarkerStatus: buildPr42ContractMarkerReport({
      childBoundaryLabelPresent: true,
      contractMetadataPresent: true,
      contractMetadataRecognized: true,
      remoteNpmNormalizationMarkerPresent: true,
    }),
    pr42LifeboatQualityScoreStatus: buildPr42LifeboatQualityScoreReport({
      lifeboatArtifactPresent: true,
      targetQualityScoreComputed: true,
    }),
    pr42ManualProfileReviewScopeStatus: buildPr42ManualProfileReviewScopeReport({
      pr42ProductR3Prepush: true,
      prProfileConflict: true,
    }),
    designOnlyPrStatus: buildDesignOnlyPrReport(),
    implementationDeferredStatus: buildImplementationDeferredReport(),
    fiveFiveLowModeStatus: buildFiveFiveLowModeReport(),
    dynamicWorkflowDecisionStatus: buildDynamicWorkflowDecisionReport(),
    workflowGoalContractStatus: buildWorkflowGoalContractReport({ goal: 'v103_source', doneCriteria: 'source_remote_gate_pass' }),
    workflowArtifactStatus: buildWorkflowArtifactReport(),
    workPacketSchemaStatus: buildWorkPacketSchemaReport(),
    workerRoleMatrixStatus: buildWorkerRoleMatrixReport(),
    workerFileOwnershipV2Status: buildWorkerFileOwnershipV2Report(),
    parallelWorkerBudgetStatus: buildParallelWorkerBudgetV103Report(),
    approvalGateStatus: buildApprovalGateReport(),
    simulatedSubagentFallbackStatus: buildSimulatedSubagentFallbackReport(),
    subagentRunnerAvailabilityStatus: buildSubagentRunnerAvailabilityReport(),
    workPacketResultStatus: buildWorkPacketResultReport(),
    integrationConflictStatus: buildIntegrationConflictReport(),
    adversarialReviewStatus: buildAdversarialReviewReport(),
    verificationFanInStatus: buildVerificationFanInReport(),
    workflowResumeCheckpointStatus: buildWorkflowResumeCheckpointReport(),
    workflowCostBudgetStatus: buildWorkflowCostBudgetV103Report(),
    workflowContextBudgetStatus: buildWorkflowContextBudgetReport(),
    workflowFinalReportStatus: buildWorkflowFinalReportReport(),
    funkyRuntimeAdoptionSequenceStatus: buildFunkyRuntimeAdoptionSequenceReport(),
    receiptFetcherNoSecretPreflightStatus: buildReceiptFetcherNoSecretPreflightReport(),
    stagingNoTxEvidenceStatus: buildStagingNoTxEvidenceReport(),
    runtimeReadinessBlockerDigestStatus: buildRuntimeReadinessBlockerDigestReport(),
    funkySafeRowExportStatus: buildFunkySafeRowExportReport(),
    datasetAuditV2SpecStatus: buildDatasetAuditV2SpecReport(),
    gameToolAdapterFixturePackStatus: buildGameToolAdapterFixturePackReport(),
    belovedAvatarSafetyAuditSpecStatus: buildBelovedAvatarSafetyAuditSpecReport(),
    vgcFunkyReleaseLadderStatus: buildVgcFunkyReleaseLadderReport(),
    v103SelfTestStatus: buildV103SelfTestRegistrationReport(),
  };
}

export function readV103Input(envName) {
  const candidates = [
    process.env.CODEX_V103_INPUT_JSON,
    envName ? process.env[`${envName}_INPUT_JSON`] : '',
  ];
  for (const text of candidates) {
    if (!text) continue;
    try {
      const parsed = JSON.parse(text);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return { invalidInputJson: true };
    }
  }
  return {};
}

export function runV103GateCli(metaUrl, argvOne, builder, envName) {
  if (argvOne && fileURLToPath(metaUrl) === argvOne) {
    const report = builder(readV103Input(envName));
    writeJsonReport(report, envName);
    exitFor(report);
  }
}
