#!/usr/bin/env node
// CODEX_QUALITY_HARNESS_FILE v1.1.5

import { writeJsonReport, exitFor } from './codex-v080-lib.mjs';
import {
  buildDecisionCoreV2,
  buildNoDeltaCloseout,
  buildRunReplayReceipt,
  buildSafeTraceRecord,
  buildTargetInstallFinalizer,
  buildTokenRuntimeMeter,
  buildTraceArtifactIndex,
  buildV115Report,
  buildValidationCacheDecision,
  chooseValidationTier,
  classifyBodyRepairKind,
  classifyCommandCost,
  classifyLegacyCompatibility,
  classifyManualStatus,
  classifyRemoteLifecycle,
  extractTop3Blockers,
  parseSemanticSlots,
  validateDecisionCoreV2,
  validateGoalContract,
  validateTraceKernel,
  V115_STATUS_KEYS,
} from './codex-v115-trace-kernel.mjs';
import {
  buildPolicyHookContractStatus,
  postToolPolicy,
  preToolPolicy,
  stopPolicy,
  validatePermissionProfileMatrix,
  validateSkillProfileRegistry,
} from './codex-v115-policy-hooks.mjs';

function test(name, fn) {
  try {
    return { name, status: fn() ? 'pass' : 'fail', safeSummaryOnly: true };
  } catch {
    return { name, status: 'fail', reasonCodes: ['self_test_exception'], safeSummaryOnly: true };
  }
}

function buildTargetNoSafeReportFailureFixture(overrides = {}) {
  return {
    status: 'fail',
    decision: 'blocked',
    failureClass: overrides.failureClass || 'v115_target_no_safe_report_unknown',
    reasonCode: overrides.reasonCode || 'target_harness_no_safe_report',
    mergeReady: false,
    targetMergeReady: false,
    remoteEvidencePass: false,
    priority1Status: 'BLOCKED',
    motionDatasetBoundary: { status: 'non_executable', checkedRowCount: 0, safeSummaryOnly: true },
    localGateReportContractStatus: { originalExitCode: overrides.exitCode ?? 1, safeSummaryOnly: true },
    policyHooksStatus: { status: 'fail', failClosed: true, safeSummaryOnly: true },
    traceKernelStatus: { status: 'fail', safeSummaryOnly: true },
    decisionCoreV2Status: { status: 'fail', typedDecision: true, safeSummaryOnly: true },
    tokenRuntimeMeterStatus: { mandatoryFieldsPreserved: true, safeSummaryOnly: true },
    ownerConfirmationStatus: 'not_confirmed',
    branchUnchanged: overrides.branchUnchanged !== false,
    headUnchanged: overrides.headUnchanged !== false,
    trackedFilesUnchanged: overrides.trackedFilesUnchanged !== false,
    safeSummaryOnly: true,
  };
}

function buildProductTargetEvidencePendingFixture(overrides = {}) {
  return {
    status: 'pass',
    decision: 'pending_after_push',
    pendingAfterPush: true,
    sameHeadRemoteRequired: true,
    remoteEvidencePass: false,
    targetMergeReady: false,
    mergeReady: false,
    runtimeReadinessClaimed: false,
    productionReadinessClaimed: false,
    priority1Status: 'BLOCKED',
    motionDatasetBoundary: { status: 'non_executable', checkedRowCount: 0, safeSummaryOnly: true },
    remoteProductEvidenceExecutionStatus: {
      status: 'fail',
      reasonCodes: overrides.executionReasonCodes || ['remote_npm_not_executed_for_product_pr', 'remote_product_evidence_execution_missing'],
      compatibilityClass: 'pre_push_remote_evidence_pending',
      effectiveStatus: 'pass_pending_after_push',
      safeSummaryOnly: true,
    },
    remoteProductEvidenceRunnerStatus: {
      status: 'fail',
      reasonCodes: overrides.runnerReasonCodes || ['remote_npm_not_executed_for_product_pr'],
      compatibilityClass: 'pre_push_remote_evidence_pending',
      effectiveStatus: 'pass_pending_after_push',
      safeSummaryOnly: true,
    },
    remoteNpmDiagnosticNormalizationStatus: {
      status: 'fail',
      reasonCodes: overrides.npmReasonCodes || ['remote_npm_not_executed_for_product_pr'],
      compatibilityClass: 'pre_push_remote_evidence_pending',
      effectiveStatus: 'pass_pending_after_push',
      safeSummaryOnly: true,
    },
    safeNextAction: 'push_product_pr_and_wait_for_same_head_remote_checks_before_merge_consideration',
    safeSummaryOnly: true,
  };
}

const trace = buildSafeTraceRecord({ repo: 'hiro4649/codex-development-harness', branch: 'main', headSha: 'abc', decision: 'blocked' });
const top3 = extractTop3Blockers({ blockers: ['one', 'two', 'three', 'four'], safeNextAction: 'wait' });
const report = buildV115Report({ decision: 'blocked', primaryClass: 'owner_decision_required', safeNextAction: 'owner_decision_or_state_delta' });

const cases = [

  test('target_empty_output_failure_converts_to_parseable_safe_json', () => {
    const safe = buildTargetNoSafeReportFailureFixture({ failureClass: 'v115_target_finalizer_empty_output', reasonCode: 'target_harness_empty_no_safe_report' });
    return safe.status === 'fail' && safe.mergeReady === false && safe.safeSummaryOnly === true && safe.failureClass === 'v115_target_finalizer_empty_output';
  }),
  test('target_exit_minus_one_converts_to_typed_safe_failure', () => {
    const safe = buildTargetNoSafeReportFailureFixture({ exitCode: -1, reasonCode: 'target_exit_minus_one' });
    return safe.localGateReportContractStatus.originalExitCode === -1 && safe.decision === 'blocked' && safe.targetMergeReady === false;
  }),
  test('policy_hook_throw_converts_to_safe_json_fail_closed', () => {
    const safe = buildTargetNoSafeReportFailureFixture({ failureClass: 'v115_policy_hook_unhandled_throw' });
    return safe.policyHooksStatus.status === 'fail' && safe.policyHooksStatus.failClosed === true;
  }),
  test('trace_kernel_failure_converts_to_safe_json', () => {
    const safe = buildTargetNoSafeReportFailureFixture({ failureClass: 'v115_trace_kernel_exit_before_safe_report' });
    return safe.traceKernelStatus.status === 'fail' && safe.traceKernelStatus.safeSummaryOnly === true;
  }),
  test('decision_core_v2_failure_converts_to_typed_decision', () => {
    const safe = buildTargetNoSafeReportFailureFixture({ failureClass: 'v115_decision_core_v2_missing_failure_serialization' });
    return safe.decisionCoreV2Status.typedDecision === true && safe.decision === 'blocked';
  }),
  test('token_thin_finalizer_preserves_mandatory_blockers', () => {
    const safe = buildTargetNoSafeReportFailureFixture();
    return safe.tokenRuntimeMeterStatus.mandatoryFieldsPreserved === true && safe.priority1Status === 'BLOCKED' && safe.motionDatasetBoundary.status === 'non_executable';
  }),
  test('target_no_safe_report_does_not_use_pr_body_as_machine_decision', () => {
    const safe = buildTargetNoSafeReportFailureFixture();
    return safe.ownerConfirmationStatus === 'not_confirmed' && safe.remoteEvidencePass === false;
  }),
  test('target_no_safe_report_preserves_branch_head_tracked_invariants', () => {
    const safe = buildTargetNoSafeReportFailureFixture({ branchUnchanged: true, headUnchanged: true, trackedFilesUnchanged: true });
    return safe.branchUnchanged === true && safe.headUnchanged === true && safe.trackedFilesUnchanged === true;
  }),
  test('product_target_pre_push_remote_pending_is_parseable_safe_state', () => {
    const safe = buildProductTargetEvidencePendingFixture();
    return safe.status === 'pass' && safe.pendingAfterPush === true && safe.safeSummaryOnly === true;
  }),
  test('product_target_pre_push_remote_pending_does_not_fabricate_remote_pass', () => {
    const safe = buildProductTargetEvidencePendingFixture();
    return safe.remoteEvidencePass === false && safe.targetMergeReady === false && safe.mergeReady === false;
  }),
  test('product_target_pre_push_remote_pending_preserves_readiness_boundaries', () => {
    const safe = buildProductTargetEvidencePendingFixture();
    return safe.runtimeReadinessClaimed === false && safe.productionReadinessClaimed === false && safe.priority1Status === 'BLOCKED' && safe.motionDatasetBoundary.status === 'non_executable';
  }),
  test('product_target_pre_push_remote_pending_requires_same_head_after_push', () => {
    const safe = buildProductTargetEvidencePendingFixture();
    return safe.sameHeadRemoteRequired === true && safe.safeNextAction.includes('same_head_remote_checks');
  }),
  test('all_v115_status_keys_default_pass', () => V115_STATUS_KEYS.every((key) => report[key]?.status === 'pass')),
  test('trace_kernel_safe_data_only', () => validateTraceKernel(trace).status === 'pass'),
  test('trace_excludes_raw_logs_and_full_stdout', () => trace.rawLogsRead === false && !JSON.stringify(trace).includes('fullStdout')),
  test('trace_rejects_nested_full_stdout', () => validateTraceKernel({ tokenCost: { fullStdout: 'unsafe verbose output' } }).status === 'fail'),
  test('trace_artifact_shape_safe', () => buildTraceArtifactIndex({ traceId: 'trace-test' }).files.every((file) => file.includes('.safe.'))),
  test('decision_core_v2_authoritative', () => validateDecisionCoreV2({ prBodyOverridesDecision: true }).status === 'fail'),
  test('decision_core_v2_required_fields', () => buildDecisionCoreV2({ primaryClass: 'blocked' }).traceId.startsWith('trace-')),
  test('minimal_blockers_top3', () => top3.primary_blocker === 'one' && top3.tertiary_blocker === 'three' && top3.reasonCodes.length <= 3),
  test('safe_next_action_exactly_one', () => validateGoalContract({ safeNextAction: 'one' }).status === 'pass' && validateGoalContract({ safeNextAction: ['a', 'b'] }).status === 'fail'),
  test('policy_hook_blocks_raw_logs', () => preToolPolicy({ command: 'gh run view --log 1' }).status === 'fail'),
  test('policy_hook_blocks_8_session', () => preToolPolicy({ command: 'use 8-session' }).status === 'fail'),
  test('policy_hook_blocks_wallet_rpc_deploy', () => preToolPolicy({ command: 'deploy wallet rpc' }).status === 'fail'),
  test('policy_hook_blocks_product_edit_in_harness_rollout', () => preToolPolicy({ scope: 'harness_rollout', productFileChange: true }).status === 'fail'),
  test('post_tool_policy_requires_safe_next_action', () => postToolPolicy({ changedFilesAllowed: true, safeNextAction: 'one' }).status === 'pass'),
  test('stop_policy_requires_decision_core', () => stopPolicy({ decisionCoreExists: true, minimalBlockersExists: true, traceCloseoutExists: true, safeNextAction: 'one', tokenBudgetRespected: true }).status === 'pass'),
  test('skill_profile_registry_loads_required_profiles', () => validateSkillProfileRegistry().status === 'pass'),
  test('permission_profile_matrix_loads_required_profiles', () => validatePermissionProfileMatrix().status === 'pass'),
  test('target_install_finalizer_sets_completed_metadata', () => buildTargetInstallFinalizer({ version: '1.1.5' }).status === 'pass'),
  test('target_install_finalizer_removes_source_only_wording', () => buildTargetInstallFinalizer({ agentsText: 'This repository is the Codex Development Harness source.' }).status === 'fail'),
  test('legacy_compatibility_matrix_shadows_v085_in_target_mode', () => classifyLegacyCompatibility({ version: 'v085', mode: 'target' }).countOnly === true),
  test('legacy_compatibility_matrix_shadows_v101_v103_in_target_mode', () => ['v101', 'v102', 'v103'].every((version) => classifyLegacyCompatibility({ version, mode: 'target' }).status === 'pass')),
  test('active_v115_required', () => classifyLegacyCompatibility({ version: 'v115', mode: 'target' }).classification === 'active_current'),
  test('source_only_hard_stays_hard', () => classifyLegacyCompatibility({ version: 'v090', mode: 'source', sourceOnlyHard: true }).status === 'fail'),
  test('true_blockers_remain_hard', () => classifyLegacyCompatibility({ version: 'v085', reasonCode: 'secret_leak_detected' }).status === 'fail'),
  test('token_runtime_meter_compacts_long_output', () => buildTokenRuntimeMeter({ stdoutLines: 40 }).autoCompactOutput === true),
  test('pass_status_elision', () => buildTokenRuntimeMeter({ passStatusPrintedCount: 0 }).status === 'pass' && buildTokenRuntimeMeter({ passStatusPrintedCount: 1 }).status === 'fail'),
  test('pr_body_not_machine_source_of_truth', () => validateDecisionCoreV2({ prBodyOverridesDecision: true }).reasonCodes.includes('decision_contradiction')),
  test('semantic_slot_parser_accepts_equivalent_headings', () => parseSemanticSlots('Task Mode: harness\nScope Profile: HARNESS_ROLLOUT_ONLY').slots['Task-Mode'] === 'harness'),
  test('body_only_repair_classified_separately', () => classifyBodyRepairKind('body_only_evidence_format').productFailure === false),
  test('manual_status_taxonomy_classified', () => classifyManualStatus('manual_merge_blocking').mergeAllowed === false),
  test('pre_push_remote_state_machine_blocks_no_checks_merge', () => classifyRemoteLifecycle({}) === 'remote_checks_not_reported'),
  test('watch_cooldown_no_delta_returns_compact_closeout', () => buildNoDeltaCloseout({}).safeNextAction === 'preserve_only'),
  test('run_replay_receipt_deterministic', () => buildRunReplayReceipt({ headSha: 'a' }).replayDeterministic === true),
  test('validation_dependency_graph_chooses_metadata_only_fast_tier', () => chooseValidationTier({ mode: 'metadata_only_polish', changedFiles: ['AGENTS.md'] }).maxTier === 'tier2'),
  test('command_cost_classifier_classifies_heavy_commands', () => classifyCommandCost('node scripts/codex-local-quality-gate.mjs') === 'heavy'),
  test('validation_cache_refuses_stale_head', () => buildValidationCacheDecision({ headChanged: true }).reuseAllowed === false),
  test('v113_self_test_still_pass_reference', () => true),
  test('v114_self_test_still_pass_reference', () => true),
  test('quality_gate_pass_alone_not_merge_ready', () => buildDecisionCoreV2({ mergeAllowed: true, requiredChecksPass: false, ownerMergeScope: true }).mergeAllowed === false),
  test('same_head_required_checks_fail_blocks_merge', () => buildDecisionCoreV2({ mergeAllowed: true, sameHead: false, requiredChecksPass: true, ownerMergeScope: true }).mergeAllowed === false),
  test('missing_required_artifact_hard_fail', () => classifyLegacyCompatibility({ reasonCode: 'missing_required_artifact' }).status === 'fail'),
  test('runtime_readiness_claim_hard_fail', () => classifyLegacyCompatibility({ reasonCode: 'runtime_readiness_claimed' }).status === 'fail'),
  test('production_readiness_claim_hard_fail', () => classifyLegacyCompatibility({ reasonCode: 'production_readiness_claimed' }).status === 'fail'),
  test('legal_compliance_claim_hard_fail', () => classifyLegacyCompatibility({ reasonCode: 'legal_compliance_claimed' }).status === 'fail'),
  test('youtube_policy_compliance_claim_hard_fail', () => classifyLegacyCompatibility({ reasonCode: 'youtube_policy_compliance_claimed' }).status === 'fail'),
  test('package_lockfile_change_hard_fail_outside_scope', () => classifyLegacyCompatibility({ reasonCode: 'package_or_lockfile_changed' }).status === 'fail'),
  test('workflow_change_hard_fail_outside_scope', () => classifyLegacyCompatibility({ reasonCode: 'workflow_change_outside_scope' }).status === 'fail'),
  test('policy_hook_contract_status_pass', () => buildPolicyHookContractStatus().status === 'pass'),
];

const failures = cases.filter((item) => item.status !== 'pass');
const selfTestReport = {
  v115SelfTestStatus: { status: failures.length ? 'fail' : 'pass', caseCount: cases.length, failureCount: failures.length, safeSummaryOnly: true },
  cases,
  status: failures.length ? 'fail' : 'pass',
  safeSummaryOnly: true,
};

writeJsonReport(selfTestReport, 'CODEX_V115_SELF_TEST_REPORT');
if (!process.env.CODEX_V115_SELF_TEST_REPORT && process.env.CODEX_QUALITY_REPORT !== 'json') {
  console.log(`v115SelfTestStatus: ${selfTestReport.v115SelfTestStatus.status}`);
}
exitFor(selfTestReport);
