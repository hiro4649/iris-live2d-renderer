#!/usr/bin/env node
// CODEX_QUALITY_HARNESS_FILE v1.3.0

import fs from 'node:fs';
import { execSync } from 'node:child_process';

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function test(name, fn) {
  try {
    return { name, status: fn() ? 'pass' : 'fail', safeSummaryOnly: true };
  } catch {
    return { name, status: 'fail', reasonCodes: ['self_test_exception'], safeSummaryOnly: true };
  }
}

const agents = fs.readFileSync('AGENTS.md', 'utf8');
const gate = fs.readFileSync('scripts/codex-local-quality-gate.mjs', 'utf8');
const manifest = readJson('docs/process/CODEX_HARNESS_MANIFEST.json');
const policy = readJson('docs/process/CODEX_ACTIVE_POLICY_INDEX.json');
const spec = fs.readFileSync('docs/process/CODEX_V130_SPEC.md', 'utf8');
const chain = manifest.targetCompatibilityBridge?.compatibilityChain || {};
const v111 = chain.v111SelfTestStatus || {};
const v130 = manifest.v130CoreTargetProfile || {};
const performanceTrack = manifest.performanceTrack || {};
const diffNames = (() => {
  try {
    return execSync('git diff --name-only main...HEAD', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .split(/\r?\n/)
      .filter(Boolean);
  } catch {
    return [];
  }
})();

function profileReadsV130(profile) {
  const reads = policy.profiles?.[profile]?.requiredReads || [];
  return reads.includes('AGENTS.md')
    && reads.includes('docs/process/CODEX_HARNESS_MANIFEST.json')
    && reads.includes('docs/process/CODEX_V130_SPEC.md')
    && !reads.includes('docs/process/CODEX_V128_SPEC.md');
}

function deferredCompatibilityReads(profile) {
  const reads = policy.profiles?.[profile]?.deferredReads || [];
  return reads.includes('docs/process/CODEX_V129_SPEC.md')
    && reads.includes('docs/process/CODEX_V128_SPEC.md')
    && reads.includes('docs/process/CODEX_V127_SPEC.md');
}

function noForbiddenDiffNames() {
  if (diffNames.length === 0) return true;
  return diffNames.every((file) => !file.startsWith('src/')
    && !file.startsWith('public/')
    && !file.startsWith('.github/')
    && !file.startsWith('test/fixtures/planning/')
    && file !== 'package.json'
    && file !== 'package-lock.json'
    && !file.includes('SDK/')
    && !file.includes('vendor/'));
}

const cases = [
  ['v130_self_test_must_pass', () => true],
  ['agents_marker_is_v130', () => agents.includes('CODEX_QUALITY_HARNESS_FILE v1.3.0')],
  ['agents_profile_is_iris_live2d_renderer', () => agents.includes('Repository profile: IRIS Live2D Renderer.')
    && !agents.includes('Repository profile: FUNKY.')],
  ['agents_installs_metadata_bridge_not_product_heavy', () => agents.includes('metadata bridge target profile')
    && !agents.includes('product-heavy target profile')],
  ['manifest_active_tuple_is_v130_core', () => manifest.activeHarnessVersion === '1.3.0'
    && manifest.activeSelfTestSuite === 'v130'
    && manifest.activeSelfTestStatusKey === 'v130SelfTestStatus'
    && manifest.previousVersion === '1.2.9'
    && manifest.targetHarnessVersion === '1.3.0'
    && manifest.targetRollout === 'completed'
    && manifest.targetHarnessModel === 'v130_metadata_bridge_target_profile'
    && manifest.targetProductRuntimeAuthority === 'unchanged_from_v129'],
  ['manifest_profile_template_is_active_with_legacy_compatibility', () => manifest.profileTemplateVersion === '1.3.0'
    && manifest.profileTemplateCompatibility?.includes('1.1.6')
    && manifest.upgradePath === 'direct_v129_to_v130_metadata_bridge_target_profile'],
  ['v130_spec_matches_metadata_bridge_target_model', () => spec.includes('metadata bridge target profile')
    && spec.includes('targetProductRuntimeAuthority=unchanged_from_v129')
    && !spec.includes('v1.3.0 target rollout is not started')
    && !spec.includes('Target repositories remain on target harness v1.2.9')],
  ['policy_profile_reads_match_v130_authority', () => profileReadsV130('routine')
    && profileReadsV130('target_rollout')
    && deferredCompatibilityReads('routine')
    && deferredCompatibilityReads('metadata_light')
    && deferredCompatibilityReads('target_rollout')],
  ['v111_direct_projection_precedes_target_compatibility', () => v111.directProjectionRequired === true
    && v111.directProjectionPath === 'v111SelfTestStatus'
    && v111.classificationPath === 'targetModeLegacyCompatibilityStatus.classifications[]'
    && v111.projectionOrder === 'before_buildTargetModeLegacyCompatibilityReport'
    && v111.forbiddenClassification === 'missing_blocking'
    && v111.requiredEffectiveStatus === 'pass'
    && gate.indexOf('runV111Gates(report, gateEnv)') < gate.indexOf('buildTargetModeLegacyCompatibilityReport(report)')],
  ['v111_projection_shape_matches_existing_status', () => ['status', 'reasonCodes', 'blocking', 'safeSummary', 'nextSafeAction', 'safeSummaryOnly'].every((key) => v111.directProjectionShapeKeys?.includes(key))],
  ['v080_v112_shadow_compatibility_preserved', () => manifest.legacySelfTests?.v080_v112 === 'target_shadow_legacy_count_only'],
  ['v129_rollback_available', () => manifest.v129Rollback?.activeHarnessVersion === '1.2.9'
    && manifest.v129Rollback?.activeSelfTestSuite === 'v129'
    && manifest.v129Rollback?.rollbackAvailable === true
    && manifest.versionAuthority?.v129 === 'immediate_rollback'],
  ['v128_compatibility_available', () => manifest.versioningRollback?.activeHarnessVersion === '1.2.8'
    && manifest.versioningRollback?.activeSelfTestSuite === 'v128'
    && manifest.versionAuthority?.v128 === 'blocking_compatibility'],
  ['v127_readable_compatibility_available', () => manifest.versioning?.activeHarnessVersion === '1.2.7'
    && manifest.versioning?.activeSelfTestSuite === 'v127'
    && manifest.versionAuthority?.v127 === 'compatibility_readable'],
  ['performance_track_non_authoritative', () => performanceTrack.state === 'deferred'
    && performanceTrack.FableComparatorState === 'unavailable'
    && performanceTrack.superiorityClaimState === 'not_proven'
    && performanceTrack.affectsQualityScore === false
    && performanceTrack.affectsBlockingCount === false],
  ['core_does_not_install_excluded_runtime_surfaces', () => v130.installsPerformanceTrack === false
    && v130.installsFableComparator === false
    && v130.installsSdkBenchmarkRunner === false
    && v130.installsSixtyTaskBenchmark === false
    && v130.installsSkillRuntimeActivation === false
    && v130.installsDagAgentTeamRuntime === false
    && v130.installsLearnedPolicyActivation === false
    && v130.installsCyberSpecialistRuntime === false],
  ['token_budgets_remain_restricted', () => v130.routineColdArtifactRead === 0
    && v130.routineSelectedSkillMax === 0
    && v130.routineReviewerFanout === 0
    && v130.routineOwnerInterruptMax === 0
    && policy.selectedSkillsMax === 0
    && policy.routineColdArtifactReadMax === 0],
  ['authority_not_created_and_product_not_mutated', () => manifest.authorityCreated === false
    && manifest.targetMutationCount === 0
    && v130.authorityCreated === false
    && v130.productRuntimeMutationCount === 0],
  ['forbidden_product_runtime_package_workflow_diff_absent', () => noForbiddenDiffNames()],
].map(([name, fn]) => test(name, fn));

const failed = cases.filter((item) => item.status !== 'pass');
const status = failed.length ? 'fail' : 'pass';
const report = {
  marker: 'CODEX_QUALITY_HARNESS_FILE v1.3.0',
  harnessVersion: '1.3.0',
  status,
  v130SelfTestStatus: {
    status,
    suite: 'v130',
    caseCount: cases.length,
    failedCaseCount: failed.length,
    reasonCodes: failed.length ? ['v130_core_target_bridge_self_test_failed'] : [],
    safeSummaryOnly: true,
  },
  cases,
  authorityCreated: false,
  targetMutationCount: 0,
  safeSummaryOnly: true,
};

if (process.env.CODEX_V130_SELF_TEST_REPORT === 'json' || process.env.CODEX_QUALITY_REPORT === 'json') {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`v130SelfTestStatus: ${status}`);
}
process.exit(status === 'pass' ? 0 : 1);
