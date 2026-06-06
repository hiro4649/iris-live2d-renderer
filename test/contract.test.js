import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createLive2dRendererServer, listen } from "../src/server.js";
import { createRendererState } from "../src/state.js";
import {
  ALLOWED_CUBISM_LOADER_ENV_NAMES,
  CUBISM_LOADER_KIND_CANDIDATES,
  CUBISM_LOADER_PROVISIONING_SCHEMA,
  FRESH_EVIDENCE_BUNDLE_SCHEMA,
  GO_NOGO_PREFLIGHT_SCHEMA,
  OWNER_CONFIRMATION_ENVELOPE_SCHEMA,
  REAL_EVIDENCE_INTAKE_SCHEMA,
  REAL_EVIDENCE_REQUEST_PACKET_SCHEMA,
  TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA,
  TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA,
  TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA,
  createFreshEvidenceBundleSummary,
  createGoNoGoPreflightSummary,
  createOwnerConfirmationEnvelopeSummary,
  createRealEvidenceIntakeSummary,
  createRealEvidenceRequestPacketSummary,
  createTrustedLoaderAllowlistPreflightSummary,
  createTrustedLoaderEnablementGateSummary,
  createTrustedLoaderOwnerHandoffSummary,
  inspectCubismLoaderProvisioning,
} from "../src/renderer/cubismLoaderProvisioning.js";
import {
  TRUSTED_LOADER_EVIDENCE_SCHEMA,
  TRUSTED_LOADER_KINDS,
  createTrustedLoaderEvidenceSummary,
  isTrustedLoaderEvidenceCandidate,
  validateTrustedLoaderEvidence,
} from "../src/renderer/trustedLoaderEvidence.js";
import {
  applyRuntimeConfig,
  browserStatusText,
  createHeartbeatPayload,
  createInitialRendererState,
  detectCubismModelLoader,
  enqueueBrowserCues,
  flushPendingCues,
  handleCueEventMessage,
  updateModelLoadEvidence,
} from "../public/renderer.js";

let nowMs = 1_800_000_000_000;
const tmpDir = join(process.cwd(), ".tmp-live2d-renderer-contract");
await rm(tmpDir, { recursive: true, force: true });
await mkdir(tmpDir, { recursive: true });
const model3Path = join(tmpDir, "avatar.model3.json");
const sdkCorePath = join(tmpDir, "CubismCore.js");
const unsafeCorePath = join(tmpDir, "arbitrary-core.js");
const unsafeCoreExtensionPath = join(tmpDir, "CubismCore.txt");
const ownerFrameworkLoaderPath = join(tmpDir, "owner-framework-loader.js");
await mkdir(join(tmpDir, "textures"), { recursive: true });
await mkdir(join(tmpDir, "motions"), { recursive: true });
await mkdir(join(tmpDir, "expressions"), { recursive: true });
await writeFile(join(tmpDir, "safe_model.moc3"), "fixture-moc");
await writeFile(join(tmpDir, "textures", "texture_00.png"), "fixture-png");
await writeFile(join(tmpDir, "motions", "idle.motion3.json"), JSON.stringify({ Version: 3, Meta: {} }));
await writeFile(join(tmpDir, "expressions", "soft_smile.exp3.json"), JSON.stringify({ Type: "Live2D Expression" }));
await writeFile(model3Path, JSON.stringify({
  Version: 3,
  FileReferences: {
    Moc: "safe_model.moc3",
    Textures: ["textures/texture_00.png"],
    Expressions: [{ Name: "soft_smile", File: "expressions/soft_smile.exp3.json" }],
    Motions: { Idle: [{ File: "motions/idle.motion3.json" }] },
  },
}));
await writeFile(sdkCorePath, "globalThis.Live2DCubismCore = { Version: 'contract' };\n");
await writeFile(unsafeCorePath, "globalThis.NotApproved = true;\n");
await writeFile(unsafeCoreExtensionPath, "not-js");
await writeFile(ownerFrameworkLoaderPath, "globalThis.OwnerProvidedCubismFramework = true;\n");

try {
  const loaderPreflightDoc = await readFile(
    "docs/iris-live2d-renderer/IRIS_LIVE2D_LOADER_INTEGRATION_PREFLIGHT.md",
    "utf8"
  );
  const scheduleDoc = await readFile(
    "docs/iris-live2d-renderer/IRIS_LIVE2D_RENDERER_DEVELOPMENT_SCHEDULE.md",
    "utf8"
  );
  for (const requiredLabel of [
    "loader_detected_untrusted",
    "trusted_loader_evidence_candidate",
    "trusted_loader_ready_future",
    "cubism_framework_model_loader_v1",
    "cubism_moc_create",
    "missing_dependency",
    "operator_attention_required",
    "LIVE2D-CUBISM-LOADER-PROVISIONING8",
    "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
    "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
    "IRIS_LIVE2D_CUBISM_LOADER_KIND",
    "owner-provided",
    "candidate_present",
    "license_attention_required",
    "model_load_supported",
    "real_model_load_supported",
    "runtime_motion_allowlist",
    "expression_candidate_labels",
    "K331",
    "K332",
    "K333",
    "K334",
    "K626",
    "K627",
    "K628",
    "K629",
    "K806",
    "K814",
    "K944",
  ]) {
    assert.equal(loaderPreflightDoc.includes(requiredLabel), true);
  }
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-LOADER-INTEGRATION-PREFLIGHT5") >
      scheduleDoc.indexOf("REAL-MODEL-LOAD4"),
    true
  );
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-LOADER-INTEGRATION-PREFLIGHT5") <
      scheduleDoc.indexOf("MICRO-REACTION-PACK5"),
    true
  );
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-CUBISM-LOADER-PROVISIONING8") >
      scheduleDoc.indexOf("LIVE2D-CUBISM-LOADER-INTEGRATION7"),
    true
  );
  assert.equal(
    scheduleDoc.indexOf("LIVE2D-CUBISM-LOADER-PROVISIONING8") <
      scheduleDoc.indexOf("## Phase 6: MICRO-REACTION-PACK5"),
    true
  );

  assert.equal(TRUSTED_LOADER_EVIDENCE_SCHEMA, "iris_live2d_trusted_loader_evidence_v1");
  assert.equal(TRUSTED_LOADER_KINDS.length, 0);
  assert.equal(CUBISM_LOADER_PROVISIONING_SCHEMA, "iris_live2d_cubism_loader_provisioning_v1");
  assert.equal(TRUSTED_LOADER_ALLOWLIST_PREFLIGHT_SCHEMA, "iris_live2d_trusted_loader_allowlist_preflight_v1");
  assert.equal(TRUSTED_LOADER_ENABLEMENT_GATE_SCHEMA, "iris_live2d_trusted_loader_enablement_gate_v1");
  assert.equal(TRUSTED_LOADER_OWNER_HANDOFF_SCHEMA, "iris_live2d_trusted_loader_owner_handoff_v1");
  assert.equal(FRESH_EVIDENCE_BUNDLE_SCHEMA, "iris_live2d_fresh_evidence_bundle_v1");
  assert.equal(GO_NOGO_PREFLIGHT_SCHEMA, "iris_live2d_go_nogo_preflight_v1");
  assert.equal(REAL_EVIDENCE_INTAKE_SCHEMA, "iris_live2d_real_evidence_intake_v1");
  assert.equal(OWNER_CONFIRMATION_ENVELOPE_SCHEMA, "iris_live2d_owner_confirmation_envelope_v1");
  assert.equal(REAL_EVIDENCE_REQUEST_PACKET_SCHEMA, "iris_live2d_real_evidence_request_packet_v1");
  assert.deepEqual(ALLOWED_CUBISM_LOADER_ENV_NAMES, [
    "IRIS_LIVE2D_CUBISM_FRAMEWORK_JS",
    "IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE",
    "IRIS_LIVE2D_CUBISM_LOADER_KIND",
  ]);
  assert.deepEqual(CUBISM_LOADER_KIND_CANDIDATES, [
    "cubism_framework_model_loader_v1",
    "cubism_moc_create",
  ]);

  const noLoaderProvisioning = inspectCubismLoaderProvisioning({});
  assert.equal(noLoaderProvisioning.provisioning_status, "not_configured");
  assert.equal(noLoaderProvisioning.loader_dependency_status, "missing_dependency");
  assert.equal(noLoaderProvisioning.operator_attention_required, true);
  assert.equal(noLoaderProvisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(noLoaderProvisioning.configured_env_count, 0);
  assertSafe(JSON.stringify(noLoaderProvisioning));

  const ownerProvidedProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_FRAMEWORK_JS: ownerFrameworkLoaderPath,
    IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_framework_model_loader_v1",
  });
  assert.equal(ownerProvidedProvisioning.provisioning_status, "candidate_present");
  assert.equal(ownerProvidedProvisioning.loader_dependency_status, "candidate_present");
  assert.equal(ownerProvidedProvisioning.license_status, "license_attention_required");
  assert.equal(ownerProvidedProvisioning.loader_kind, "cubism_framework_model_loader_v1");
  assert.equal(ownerProvidedProvisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(ownerProvidedProvisioning.operator_attention_required, true);
  assert.equal(ownerProvidedProvisioning.configured_env_names.includes("IRIS_LIVE2D_CUBISM_FRAMEWORK_JS"), true);
  assert.equal(ownerProvidedProvisioning.configured_env_names.includes("IRIS_LIVE2D_CUBISM_LOADER_KIND"), true);
  assert.equal(JSON.stringify(ownerProvidedProvisioning).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(ownerProvidedProvisioning));
  assertNoModelPathLeak(JSON.stringify(ownerProvidedProvisioning));

  const ownerProvidedAllowlistPreflight = createTrustedLoaderAllowlistPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_allowlist_status, "disabled");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_candidate_status, "candidate_present_diagnostic_only");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_blocker_status, "allowlist_disabled");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_license_status, "license_attention_required");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_route_guard_prerequisite, "available");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_real_evidence_prerequisite, "real_evidence_required");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_owner_confirmation_status, "owner_confirmation_required");
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_ready_candidate, false);
  assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_allowlist_enabled, false);
  assert.equal(ownerProvidedAllowlistPreflight.candidate_present_diagnostic_only, true);
  assert.equal(ownerProvidedAllowlistPreflight.renderer_ready, false);
  assert.equal(ownerProvidedAllowlistPreflight.model_loaded, false);
  assert.equal(ownerProvidedAllowlistPreflight.scene_loaded, false);
  assert.equal(ownerProvidedAllowlistPreflight.browser_cue_delivery_ready, false);
  assert.equal(JSON.stringify(ownerProvidedAllowlistPreflight).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(ownerProvidedAllowlistPreflight));
  assertNoModelPathLeak(JSON.stringify(ownerProvidedAllowlistPreflight));

  const ownerProvidedEnablementGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: ownerProvidedAllowlistPreflight,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_gate_status, "blocked");
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_ready_candidate, false);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_allowlist_enabled, false);
  assert.equal(ownerProvidedEnablementGate.no_loader_trusted, true);
  assert.equal(ownerProvidedEnablementGate.candidate_present_diagnostic_only, true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_allowlist_disabled"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("candidate_present_diagnostic_only"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_fixture_evidence_only"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_missing_owner_confirmation"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_license_attention_required"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_priority1_unresolved"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_motion_dataset_non_executable"), true);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_runtime_readiness_claimed, false);
  assert.equal(ownerProvidedEnablementGate.trusted_loader_enablement_production_readiness_claimed, false);
  assert.equal(ownerProvidedEnablementGate.renderer_ready, false);
  assert.equal(ownerProvidedEnablementGate.model_loaded, false);
  assert.equal(ownerProvidedEnablementGate.scene_loaded, false);
  assert.equal(ownerProvidedEnablementGate.browser_cue_delivery_ready, false);
  assert.equal(JSON.stringify(ownerProvidedEnablementGate).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(ownerProvidedEnablementGate));
  assertNoModelPathLeak(JSON.stringify(ownerProvidedEnablementGate));

  const routeGuardMissingGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: ownerProvidedAllowlistPreflight,
    routeGuardStatus: "missing",
  });
  assert.equal(routeGuardMissingGate.trusted_loader_enablement_blockers.includes("blocked_missing_route_guard"), true);
  assertSafe(JSON.stringify(routeGuardMissingGate));

  const ownerProvidedOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: ownerProvidedAllowlistPreflight,
    enablementGateSummary: ownerProvidedEnablementGate,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_status, "blocked");
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_ready_candidate, false);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_allowlist_enabled, false);
  assert.equal(ownerProvidedOwnerHandoff.no_loader_trusted, true);
  assert.equal(ownerProvidedOwnerHandoff.candidate_present_diagnostic_only, true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_allowlist_disabled"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_candidate_present_diagnostic_only"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_enablement_gate_blocked"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_fixture_evidence_only"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_missing_owner_confirmation"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_license_attention_required"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_priority1_unresolved"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_motion_dataset_non_executable"), true);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_runtime_readiness_claimed, false);
  assert.equal(ownerProvidedOwnerHandoff.trusted_loader_owner_handoff_production_readiness_claimed, false);
  assert.equal(ownerProvidedOwnerHandoff.do_not_continue_without_owner_confirmation, true);
  assert.equal(ownerProvidedOwnerHandoff.renderer_ready, false);
  assert.equal(ownerProvidedOwnerHandoff.model_loaded, false);
  assert.equal(ownerProvidedOwnerHandoff.scene_loaded, false);
  assert.equal(ownerProvidedOwnerHandoff.browser_cue_delivery_ready, false);
  assert.equal(JSON.stringify(ownerProvidedOwnerHandoff).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(ownerProvidedOwnerHandoff));
  assertNoModelPathLeak(JSON.stringify(ownerProvidedOwnerHandoff));

  const defaultFreshEvidenceBundle = createFreshEvidenceBundleSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: ownerProvidedAllowlistPreflight,
    enablementGateSummary: ownerProvidedEnablementGate,
    ownerHandoffSummary: ownerProvidedOwnerHandoff,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(defaultFreshEvidenceBundle.bundle_status, "blocked");
  assert.equal(defaultFreshEvidenceBundle.bundle_ready_candidate, false);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_fresh_real_evidence"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_fixture_evidence_only"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_owner_confirmation"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_license_attention_required"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_priority1_unresolved"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_blocked_motion_dataset_non_executable"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_not_runtime_ready"), true);
  assert.equal(defaultFreshEvidenceBundle.bundle_blocked_reasons.includes("bundle_not_production_ready"), true);
  assert.equal(defaultFreshEvidenceBundle.allowlist_preflight_status, "available_disabled_non_trusting");
  assert.equal(defaultFreshEvidenceBundle.enablement_gate_status, "fail_closed");
  assert.equal(defaultFreshEvidenceBundle.owner_handoff_status, "review_only_blocked");
  assert.equal(defaultFreshEvidenceBundle.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultFreshEvidenceBundle.no_loader_trusted, true);
  assert.equal(defaultFreshEvidenceBundle.candidate_present_diagnostic_only, true);
  assert.equal(defaultFreshEvidenceBundle.renderer_ready, false);
  assert.equal(defaultFreshEvidenceBundle.model_loaded, false);
  assert.equal(defaultFreshEvidenceBundle.scene_loaded, false);
  assert.equal(defaultFreshEvidenceBundle.browser_cue_delivery_ready, false);
  assert.equal(defaultFreshEvidenceBundle.runtime_readiness_claimed, false);
  assert.equal(defaultFreshEvidenceBundle.production_readiness_claimed, false);
  assert.equal(defaultFreshEvidenceBundle.priority1_status, "BLOCKED");
  assert.equal(defaultFreshEvidenceBundle.motion_dataset_executable, false);
  assert.equal(JSON.stringify(defaultFreshEvidenceBundle).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(defaultFreshEvidenceBundle));
  assertNoModelPathLeak(JSON.stringify(defaultFreshEvidenceBundle));

  const defaultGoNoGo = createGoNoGoPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: ownerProvidedAllowlistPreflight,
    enablementGateSummary: ownerProvidedEnablementGate,
    ownerHandoffSummary: ownerProvidedOwnerHandoff,
    freshEvidenceBundleSummary: defaultFreshEvidenceBundle,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "missing",
      fixture_evidence_status: "fixture_only",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(defaultGoNoGo.go_nogo_status, "no_go");
  assert.equal(defaultGoNoGo.go_candidate, false);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_missing_fresh_real_evidence"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_fixture_evidence_only"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_missing_owner_confirmation"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_license_attention_required"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_priority1_unresolved"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_motion_dataset_non_executable"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_runtime_not_ready"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("no_go_production_not_ready"), true);
  assert.equal(defaultGoNoGo.no_go_reasons.includes("degraded_mode_available_not_go"), true);
  assert.equal(defaultGoNoGo.degraded_mode_available, true);
  assert.equal(defaultGoNoGo.trusted_loader_allowlist_enabled, false);
  assert.equal(defaultGoNoGo.no_loader_trusted, true);
  assert.equal(defaultGoNoGo.renderer_ready, false);
  assert.equal(defaultGoNoGo.model_loaded, false);
  assert.equal(defaultGoNoGo.scene_loaded, false);
  assert.equal(defaultGoNoGo.browser_cue_delivery_ready, false);
  assert.equal(defaultGoNoGo.runtime_readiness_claimed, false);
  assert.equal(defaultGoNoGo.production_readiness_claimed, false);
  assert.equal(defaultGoNoGo.priority1_status, "BLOCKED");
  assert.equal(defaultGoNoGo.motion_dataset_executable, false);
  assert.equal(JSON.stringify(defaultGoNoGo).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(defaultGoNoGo));
  assertNoModelPathLeak(JSON.stringify(defaultGoNoGo));

  const defaultRealEvidenceIntake = createRealEvidenceIntakeSummary();
  assert.equal(defaultRealEvidenceIntake.evidence_intake_status, "blocked");
  assert.equal(defaultRealEvidenceIntake.intake_ready_candidate, false);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_missing_schema_version"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_missing_timestamp"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_priority1_unresolved"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_motion_dataset_non_executable"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_not_runtime_ready"), true);
  assert.equal(defaultRealEvidenceIntake.intake_blocked_reasons.includes("intake_not_production_ready"), true);
  assert.equal(defaultRealEvidenceIntake.runtime_readiness_claimed, false);
  assert.equal(defaultRealEvidenceIntake.production_readiness_claimed, false);
  assert.equal(defaultRealEvidenceIntake.renderer_ready, false);
  assert.equal(defaultRealEvidenceIntake.model_loaded, false);
  assert.equal(defaultRealEvidenceIntake.scene_loaded, false);
  assert.equal(defaultRealEvidenceIntake.browser_cue_delivery_ready, false);
  assert.equal(defaultRealEvidenceIntake.priority1_status, "BLOCKED");
  assert.equal(defaultRealEvidenceIntake.motion_dataset_executable, false);
  assertSafe(JSON.stringify(defaultRealEvidenceIntake));
  assertNoModelPathLeak(JSON.stringify(defaultRealEvidenceIntake));

  const fixtureRealEvidenceIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "fixture",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(fixtureRealEvidenceIntake.fixture_evidence_status, "fixture_not_real_evidence");
  assert.equal(fixtureRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_fixture_evidence_only"), true);
  assert.equal(fixtureRealEvidenceIntake.intake_ready_candidate, false);

  const dryRunRealEvidenceIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "dry_run",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(dryRunRealEvidenceIntake.dry_run_evidence_status, "dry_run_not_real_evidence");
  assert.equal(dryRunRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_dry_run_evidence_only"), true);

  const staleRealEvidenceIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "real_probe_summary",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs - 600_000,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(staleRealEvidenceIntake.freshness_status, "stale");
  assert.equal(staleRealEvidenceIntake.intake_blocked_reasons.includes("intake_blocked_stale_evidence"), true);

  const manualSummaryIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "manual_summary",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(manualSummaryIntake.intake_blocked_reasons.includes("intake_blocked_manual_summary_without_owner_confirmation"), true);
  assert.equal(manualSummaryIntake.intake_ready_candidate, false);

  const rawPayloadIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "real_probe_summary",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
    raw_renderer_payload: { model_path: ownerFrameworkLoaderPath },
  }, { nowMs });
  assert.equal(rawPayloadIntake.unsafe_material_rejected, true);
  assert.equal(rawPayloadIntake.intake_blocked_reasons.includes("intake_blocked_unsafe_material_rejected"), true);
  assert.equal(JSON.stringify(rawPayloadIntake).includes(ownerFrameworkLoaderPath), false);

  const unknownSourceIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "unknown_probe",
    component: "unknown_component",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs });
  assert.equal(unknownSourceIntake.rejected_source_type, "unknown_probe");
  assert.equal(unknownSourceIntake.component, "external_boundary_component");
  assert.equal(unknownSourceIntake.intake_blocked_reasons.includes("intake_blocked_unknown_source_type"), true);
  assert.equal(unknownSourceIntake.intake_blocked_reasons.includes("intake_blocked_external_boundary_component"), true);

  const mockOwnerIntake = createRealEvidenceIntakeSummary({
    schema_version: "v1",
    source_type: "operator_confirmed_summary",
    component: "live2d_renderer",
    component_status: "summary_only",
    evidence_timestamp_ms: nowMs,
    freshness_status: "fresh",
    redaction_status: "pass",
  }, { nowMs, mockOwnerConfirmation: true });
  assert.equal(mockOwnerIntake.owner_confirmation_status, "mock_owner_confirmation_rejected");
  assert.equal(mockOwnerIntake.intake_blocked_reasons.includes("intake_blocked_mock_owner_confirmation"), true);

  const defaultOwnerConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary();
  assert.equal(defaultOwnerConfirmationEnvelope.owner_confirmation_envelope_status, "blocked");
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_ready_candidate, false);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmed_scopes.length, 0);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_missing_scope"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_missing_timestamp"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_missing_role"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_priority1_unresolved"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_motion_dataset_non_executable"), true);
  assert.equal(defaultOwnerConfirmationEnvelope.runtime_readiness_claimed, false);
  assert.equal(defaultOwnerConfirmationEnvelope.production_readiness_claimed, false);
  assert.equal(defaultOwnerConfirmationEnvelope.renderer_ready, false);
  assert.equal(defaultOwnerConfirmationEnvelope.model_loaded, false);
  assert.equal(defaultOwnerConfirmationEnvelope.scene_loaded, false);
  assert.equal(defaultOwnerConfirmationEnvelope.browser_cue_delivery_ready, false);
  assert.equal(defaultOwnerConfirmationEnvelope.priority1_status, "BLOCKED");
  assert.equal(defaultOwnerConfirmationEnvelope.motion_dataset_executable, false);
  assertSafe(JSON.stringify(defaultOwnerConfirmationEnvelope));

  const wrongRoleConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "go_nogo_preflight_review",
    confirmed_by_role: "reviewer",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
  }, { nowMs, requestedScope: "go_nogo_preflight_review" });
  assert.equal(wrongRoleConfirmationEnvelope.confirmed_by_role_status, "wrong_role_rejected");
  assert.equal(wrongRoleConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_wrong_role"), true);
  assert.equal(wrongRoleConfirmationEnvelope.confirmed_scopes.length, 0);

  const mockConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "go_nogo_preflight_review",
    confirmed_by_role: "owner",
    confirmation_source_kind: "mock",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    mock_confirmation: true,
  }, { nowMs, requestedScope: "go_nogo_preflight_review" });
  assert.equal(mockConfirmationEnvelope.mock_confirmation_status, "mock_confirmation_rejected");
  assert.equal(mockConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_mock_confirmation"), true);

  const expiredConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "runtime_readiness",
    confirmed_by_role: "owner",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs - 120_000,
    confirmation_expires_at_ms: nowMs - 1,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
  }, { nowMs, requestedScope: "runtime_readiness" });
  assert.equal(expiredConfirmationEnvelope.confirmation_expiry_status, "expired_rejected");
  assert.equal(expiredConfirmationEnvelope.expired_scopes.includes("runtime_readiness"), true);
  assert.equal(expiredConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_expired_confirmation"), true);

  const revokedConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "runtime_readiness",
    confirmed_by_role: "owner",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    revoked: true,
  }, { nowMs, requestedScope: "runtime_readiness" });
  assert.equal(revokedConfirmationEnvelope.revoked_scopes.includes("runtime_readiness"), true);
  assert.equal(revokedConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_revoked_confirmation"), true);

  const scopeMismatchConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "go_nogo_preflight_review",
    confirmed_by_role: "owner",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
  }, { nowMs, requestedScope: "actual_trusted_loader_enablement" });
  assert.equal(scopeMismatchConfirmationEnvelope.scope_mismatch_status, "scope_mismatch_rejected");
  assert.equal(scopeMismatchConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_scope_mismatch"), true);
  assert.equal(scopeMismatchConfirmationEnvelope.confirmed_scopes.length, 0);

  for (const scope of ["runtime_readiness", "actual_trusted_loader_enablement", "priority1_resolution", "motion_dataset_execution"]) {
    const scopedEnvelope = createOwnerConfirmationEnvelopeSummary({
      confirmation_scope: scope,
      confirmed_by_role: "owner",
      confirmation_source_kind: "operator_confirmed_summary",
      confirmation_timestamp_ms: nowMs,
      confirmation_expires_at_ms: nowMs + 60_000,
      audit_ref: "safe_audit_ref",
      redaction_status: "pass",
    }, { nowMs, requestedScope: "production_readiness" });
    assert.equal(scopedEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_scope_mismatch"), scope !== "production_readiness");
    assert.equal(scopedEnvelope.confirmation_ready_candidate, false);
  }

  const unsafeOwnerConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary({
    confirmation_scope: "go_nogo_preflight_review",
    confirmed_by_role: "owner",
    confirmation_source_kind: "operator_confirmed_summary",
    confirmation_timestamp_ms: nowMs,
    confirmation_expires_at_ms: nowMs + 60_000,
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    raw_owner_confirmation_note: "https://secret.example/owner-note",
  }, { nowMs, requestedScope: "go_nogo_preflight_review" });
  assert.equal(unsafeOwnerConfirmationEnvelope.owner_private_note_redaction_status, "unsafe_material_rejected");
  assert.equal(unsafeOwnerConfirmationEnvelope.confirmation_blocked_reasons.includes("confirmation_blocked_unsafe_material_rejected"), true);
  assert.equal(JSON.stringify(unsafeOwnerConfirmationEnvelope).includes("secret.example"), false);

  const defaultEvidenceRequestPacket = createRealEvidenceRequestPacketSummary();
  assert.equal(defaultEvidenceRequestPacket.real_evidence_request_packet_status, "blocked");
  assert.equal(defaultEvidenceRequestPacket.request_packet_ready_candidate, false);
  assert.equal(defaultEvidenceRequestPacket.request_packet_collects_real_evidence, false);
  assert.equal(defaultEvidenceRequestPacket.request_packet_performs_live_probes, false);
  assert.equal(defaultEvidenceRequestPacket.request_packet_creates_owner_confirmation, false);
  assert.equal(defaultEvidenceRequestPacket.request_packet_completeness_is_readiness, false);
  assert.equal(defaultEvidenceRequestPacket.required_evidence_components.includes("priority1_real_resident_evidence"), true);
  assert.equal(defaultEvidenceRequestPacket.required_evidence_components.includes("motion_dataset_row_evidence"), true);
  assert.equal(defaultEvidenceRequestPacket.missing_evidence_components.length, defaultEvidenceRequestPacket.required_evidence_components.length);
  assert.equal(defaultEvidenceRequestPacket.required_confirmation_scopes.includes("owner_confirmation_envelope_review"), true);
  assert.equal(defaultEvidenceRequestPacket.required_confirmation_scopes.includes("runtime_readiness"), true);
  assert.equal(defaultEvidenceRequestPacket.required_confirmation_scopes.includes("production_readiness"), true);
  assert.equal(defaultEvidenceRequestPacket.missing_confirmation_scopes.length, defaultEvidenceRequestPacket.required_confirmation_scopes.length);
  assert.equal(defaultEvidenceRequestPacket.fixture_evidence_status, "fixture_not_real_evidence");
  assert.equal(defaultEvidenceRequestPacket.dry_run_evidence_status, "dry_run_not_real_evidence");
  assert.equal(defaultEvidenceRequestPacket.stale_evidence_status, "stale_not_fresh_evidence");
  assert.equal(defaultEvidenceRequestPacket.mock_owner_confirmation_status, "mock_owner_confirmation_not_real");
  assert.equal(defaultEvidenceRequestPacket.wrong_role_confirmation_status, "wrong_role_confirmation_rejected");
  assert.equal(defaultEvidenceRequestPacket.expired_confirmation_status, "expired_confirmation_rejected");
  assert.equal(defaultEvidenceRequestPacket.revoked_confirmation_status, "revoked_confirmation_rejected");
  assert.equal(defaultEvidenceRequestPacket.owner_confirmation_envelope_status, "schema_only_blocked_or_pending");
  assert.equal(defaultEvidenceRequestPacket.real_evidence_intake_status, "schema_only_blocked_or_attention");
  assert.equal(defaultEvidenceRequestPacket.go_nogo_status, "no_go");
  assert.equal(defaultEvidenceRequestPacket.priority1_status, "BLOCKED");
  assert.equal(defaultEvidenceRequestPacket.motion_dataset_executable, false);
  assert.equal(defaultEvidenceRequestPacket.renderer_ready, false);
  assert.equal(defaultEvidenceRequestPacket.model_loaded, false);
  assert.equal(defaultEvidenceRequestPacket.scene_loaded, false);
  assert.equal(defaultEvidenceRequestPacket.browser_cue_delivery_ready, false);
  assert.equal(defaultEvidenceRequestPacket.runtime_readiness_claimed, false);
  assert.equal(defaultEvidenceRequestPacket.production_readiness_claimed, false);
  assertSafe(JSON.stringify(defaultEvidenceRequestPacket));

  const unsafeEvidenceRequestPacket = createRealEvidenceRequestPacketSummary({
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    source_kind: "fixture",
    raw_request_note: "https://secret.example/request-note",
    raw_owner_note: "private owner note",
  });
  assert.equal(unsafeEvidenceRequestPacket.unsafe_request_note_status, "unsafe_material_rejected");
  assert.equal(unsafeEvidenceRequestPacket.unsafe_owner_note_status, "unsafe_material_rejected");
  assert.equal(unsafeEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_unsafe_material_rejected"), true);
  assert.equal(unsafeEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_fixture_evidence_only"), true);
  assert.equal(JSON.stringify(unsafeEvidenceRequestPacket).includes("secret.example"), false);

  const staleMockEvidenceRequestPacket = createRealEvidenceRequestPacketSummary({
    audit_ref: "safe_audit_ref",
    redaction_status: "pass",
    source_kind: "dry_run",
    freshness_status: "stale",
    mock_owner_confirmation: true,
    confirmed_by_role: "reviewer",
    confirmation_status: "revoked",
  });
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_dry_run_evidence_only"), true);
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_stale_evidence"), true);
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_mock_owner_confirmation"), true);
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_wrong_role_confirmation"), true);
  assert.equal(staleMockEvidenceRequestPacket.request_packet_blocked_reasons.includes("request_packet_blocked_revoked_confirmation"), true);

  const mockOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    mockOwnerConfirmation: true,
  });
  assert.equal(mockOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_mock_owner_confirmation"), true);
  assert.equal(mockOwnerHandoff.mock_owner_confirmation_rejected, true);
  const mockOwnerBundle = createFreshEvidenceBundleSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    ownerHandoffSummary: mockOwnerHandoff,
    mockOwnerConfirmation: true,
  });
  assert.equal(mockOwnerBundle.bundle_blocked_reasons.includes("bundle_blocked_mock_owner_confirmation"), true);
  const mockOwnerGoNoGo = createGoNoGoPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    mockOwnerConfirmation: true,
  });
  assert.equal(mockOwnerGoNoGo.no_go_reasons.includes("no_go_mock_owner_confirmation"), true);
  const routeGuardMissingHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    routeGuardStatus: "missing",
  });
  assert.equal(routeGuardMissingHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_missing_route_guard"), true);
  assertSafe(JSON.stringify(routeGuardMissingHandoff));
  const routeGuardMissingBundle = createFreshEvidenceBundleSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    routeGuardStatus: "missing",
  });
  assert.equal(routeGuardMissingBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_route_guard"), true);
  const routeGuardMissingGoNoGo = createGoNoGoPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    routeGuardStatus: "missing",
  });
  assert.equal(routeGuardMissingGoNoGo.no_go_reasons.includes("no_go_missing_route_guard"), true);
  const missingComponentBundle = createFreshEvidenceBundleSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: {},
    enablementGateSummary: {},
    ownerHandoffSummary: {},
  });
  assert.equal(missingComponentBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_allowlist_preflight"), true);
  assert.equal(missingComponentBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_enablement_gate"), true);
  assert.equal(missingComponentBundle.bundle_blocked_reasons.includes("bundle_blocked_missing_owner_handoff"), true);
  const missingComponentGoNoGo = createGoNoGoPreflightSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    allowlistPreflightSummary: {},
    enablementGateSummary: {},
    ownerHandoffSummary: {},
    freshEvidenceBundleSummary: {},
  });
  assert.equal(missingComponentGoNoGo.no_go_reasons.includes("no_go_missing_allowlist_preflight"), true);
  assert.equal(missingComponentGoNoGo.no_go_reasons.includes("no_go_missing_enablement_gate"), true);
  assert.equal(missingComponentGoNoGo.no_go_reasons.includes("no_go_missing_owner_handoff"), true);
  assert.equal(missingComponentGoNoGo.no_go_reasons.includes("no_go_missing_fresh_evidence_bundle"), true);

  const missingOwnerProvidedProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_FRAMEWORK_JS: join(tmpDir, "missing-owner-framework-loader.js"),
    IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_framework_model_loader_v1",
  });
  assert.equal(missingOwnerProvidedProvisioning.provisioning_status, "operator_attention_required");
  assert.equal(missingOwnerProvidedProvisioning.loader_dependency_status, "operator_attention_required");
  assert.equal(JSON.stringify(missingOwnerProvidedProvisioning).includes("missing-owner-framework-loader"), false);
  assertSafe(JSON.stringify(missingOwnerProvidedProvisioning));

  const moduleEnvProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE: ownerFrameworkLoaderPath,
  });
  assert.equal(moduleEnvProvisioning.provisioning_status, "candidate_present");
  assert.equal(moduleEnvProvisioning.loader_kind, "cubism_framework_model_loader_v1");
  assert.equal(moduleEnvProvisioning.configured_env_names.includes("IRIS_LIVE2D_CUBISM_FRAMEWORK_MODULE"), true);
  assert.equal(JSON.stringify(moduleEnvProvisioning).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(moduleEnvProvisioning));

  const mocCreateProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_moc_create",
  });
  assert.equal(mocCreateProvisioning.provisioning_status, "future_only");
  assert.equal(mocCreateProvisioning.loader_dependency_status, "future_only");
  assert.equal(mocCreateProvisioning.loader_kind, "cubism_moc_create");
  assert.equal(mocCreateProvisioning.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(mocCreateProvisioning));
  const mocCreatePreflight = createTrustedLoaderAllowlistPreflightSummary({ loaderProvisioning: mocCreateProvisioning });
  assert.equal(mocCreatePreflight.trusted_loader_candidate_status, "future_only");
  assert.equal(mocCreatePreflight.trusted_loader_allowlist_status, "disabled");
  assert.equal(mocCreatePreflight.renderer_ready, false);
  assertSafe(JSON.stringify(mocCreatePreflight));
  const mocCreateEnablementGate = createTrustedLoaderEnablementGateSummary({ loaderProvisioning: mocCreateProvisioning });
  assert.equal(mocCreateEnablementGate.trusted_loader_enablement_blockers.includes("blocked_future_only_loader_kind"), true);
  assert.equal(mocCreateEnablementGate.renderer_ready, false);
  assertSafe(JSON.stringify(mocCreateEnablementGate));
  const mocCreateHandoff = createTrustedLoaderOwnerHandoffSummary({ loaderProvisioning: mocCreateProvisioning });
  assert.equal(mocCreateHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_future_only_loader_kind"), true);
  assert.equal(mocCreateHandoff.renderer_ready, false);
  assertSafe(JSON.stringify(mocCreateHandoff));

  const unsupportedProvisioning = inspectCubismLoaderProvisioning({
    IRIS_LIVE2D_CUBISM_LOADER_KIND: "unknown_loader",
  });
  assert.equal(unsupportedProvisioning.provisioning_status, "unsupported_loader_kind");
  assert.equal(unsupportedProvisioning.loader_kind, "unsupported_loader_kind");
  assertSafe(JSON.stringify(unsupportedProvisioning));
  const unsupportedPreflight = createTrustedLoaderAllowlistPreflightSummary({ loaderProvisioning: unsupportedProvisioning });
  assert.equal(unsupportedPreflight.trusted_loader_candidate_status, "blocked_unknown_loader");
  assert.equal(unsupportedPreflight.trusted_loader_allowlist_status, "disabled");
  assert.equal(unsupportedPreflight.renderer_ready, false);
  assertSafe(JSON.stringify(unsupportedPreflight));
  const unsupportedEnablementGate = createTrustedLoaderEnablementGateSummary({ loaderProvisioning: unsupportedProvisioning });
  assert.equal(unsupportedEnablementGate.trusted_loader_enablement_blockers.includes("blocked_unknown_loader_kind"), true);
  assert.equal(unsupportedEnablementGate.renderer_ready, false);
  assertSafe(JSON.stringify(unsupportedEnablementGate));
  const unsupportedHandoff = createTrustedLoaderOwnerHandoffSummary({ loaderProvisioning: unsupportedProvisioning });
  assert.equal(unsupportedHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_unknown_loader_kind"), true);
  assert.equal(unsupportedHandoff.renderer_ready, false);
  assertSafe(JSON.stringify(unsupportedHandoff));

  const staleEnablementGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "stale",
      fixture_evidence_status: "not_fixture",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(staleEnablementGate.trusted_loader_enablement_blockers.includes("blocked_stale_real_evidence"), true);
  const staleOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "stale",
      fixture_evidence_status: "not_fixture",
      dry_run_evidence_status: "not_dry_run",
    },
  });
  assert.equal(staleOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_stale_real_evidence"), true);
  const dryRunEnablementGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "fresh",
      fixture_evidence_status: "not_fixture",
      dry_run_evidence_status: "dry_run_only",
    },
  });
  assert.equal(dryRunEnablementGate.trusted_loader_enablement_blockers.includes("blocked_dry_run_evidence_only"), true);
  const dryRunOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    live2dEvidenceSummary: {
      live2d_evidence_status: "blocked",
      evidence_freshness_status: "fresh",
      fixture_evidence_status: "not_fixture",
      dry_run_evidence_status: "dry_run_only",
    },
  });
  assert.equal(dryRunOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_dry_run_evidence_only"), true);
  const expiredOwnerConfirmationGate = createTrustedLoaderEnablementGateSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    ownerConfirmation: true,
    ownerConfirmationFresh: false,
  });
  assert.equal(expiredOwnerConfirmationGate.trusted_loader_enablement_blockers.includes("blocked_owner_confirmation_expired"), true);
  const expiredOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
    loaderProvisioning: ownerProvidedProvisioning,
    ownerConfirmation: true,
    ownerConfirmationFresh: false,
  });
  assert.equal(expiredOwnerHandoff.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_expired_owner_confirmation"), true);

  for (const unsafeValue of [
    "https://secret.example/framework.js",
    "secret-token",
    "raw loader error stack trace",
  ]) {
    const unsafeProvisioning = inspectCubismLoaderProvisioning({
      IRIS_LIVE2D_CUBISM_FRAMEWORK_JS: unsafeValue,
      IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_framework_model_loader_v1",
    });
    assert.equal(unsafeProvisioning.provisioning_status, "unsafe_configuration");
    const serializedProvisioning = JSON.stringify(unsafeProvisioning);
    assert.equal(serializedProvisioning.includes(unsafeValue), false);
    assertSafe(serializedProvisioning);
  }
  const missingTrustedEvidence = validateTrustedLoaderEvidence(null, { nowMs });
  assert.equal(missingTrustedEvidence.error_kind, "trusted_loader_evidence_missing");
  assert.equal(missingTrustedEvidence.status, "missing");

  const futureTrustedEvidence = trustedLoaderEvidenceFixture();
  assert.equal(isTrustedLoaderEvidenceCandidate(futureTrustedEvidence), true);
  const futureTrustedValidation = validateTrustedLoaderEvidence(futureTrustedEvidence, {
    nowMs,
    expectedModelId: "iris_default",
    expectedSceneId: "main_scene",
  });
  assert.equal(futureTrustedValidation.status, "future_only");
  assert.equal(futureTrustedValidation.error_kind, "trusted_loader_future_only");
  assert.equal(futureTrustedValidation.trusted_loader_ready_candidate, false);
  const futureTrustedSummary = createTrustedLoaderEvidenceSummary(futureTrustedValidation);
  assert.equal(futureTrustedSummary.trusted_loader_evidence_status, "future_only");
  assert.equal(futureTrustedSummary.trusted_loader_policy_gate, true);
  assert.equal(futureTrustedSummary.trusted_loader_ready_candidate, false);
  assertSafe(JSON.stringify(futureTrustedSummary));

  const unknownTrustedValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ loader_kind: "unknown_loader_fixture" }),
    { nowMs }
  );
  assert.equal(unknownTrustedValidation.status, "untrusted");
  assert.equal(unknownTrustedValidation.error_kind, "trusted_loader_kind_untrusted");
  const missingPolicyGateValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ server_trusted_policy_gate: false }),
    { nowMs }
  );
  assert.equal(missingPolicyGateValidation.error_kind, "trusted_loader_policy_gate_missing");
  const staleTrustedValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({
      loaded_at_ms: nowMs - 10_000,
      fresh_heartbeat_timestamp_ms: nowMs - 10_000,
    }),
    { nowMs }
  );
  assert.equal(staleTrustedValidation.error_kind, "trusted_loader_evidence_stale");
  const modelMismatchTrustedValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ model_id: "other_model" }),
    { nowMs, expectedModelId: "iris_default" }
  );
  assert.equal(modelMismatchTrustedValidation.error_kind, "trusted_loader_evidence_invalid");
  const sceneMismatchTrustedValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ scene_id: "other_scene" }),
    { nowMs, expectedSceneId: "main_scene" }
  );
  assert.equal(sceneMismatchTrustedValidation.error_kind, "trusted_loader_evidence_invalid");
  for (const field of [
    "raw_model_path",
    "model_path",
    "internal_model_path",
    "raw_asset_path",
    "asset_path",
    "raw_manifest_body",
    "manifest_body",
    "raw_loader_error",
    "loader_error",
    "stack",
    "stack_trace",
    "endpoint",
    "renderer_endpoint",
    "url",
    "token",
    "secret",
    "authorization",
    "credential",
    "password",
    "api_key",
    "raw_cue_payload",
    "raw_payload",
    "raw_motion_command",
    "candidate",
    "command",
    "world_command",
    "obs_command",
    "game_input",
    "os_command",
  ]) {
    const unsafeTrustedValidation = validateTrustedLoaderEvidence(
      trustedLoaderEvidenceFixture({ [field]: "unsafe_fixture_value" }),
      { nowMs }
    );
    assert.equal(unsafeTrustedValidation.error_kind, "trusted_loader_evidence_unsafe");
    const unsafeTrustedSummary = JSON.stringify(createTrustedLoaderEvidenceSummary(unsafeTrustedValidation));
    assert.equal(unsafeTrustedSummary.includes(`"${field}"`), false);
    assert.equal(unsafeTrustedSummary.includes("unsafe_fixture_value"), false);
    assertSafe(unsafeTrustedSummary);
  }
  const unsafeTrustedValueValidation = validateTrustedLoaderEvidence(
    trustedLoaderEvidenceFixture({ loader_version: "https://secret.example/loader" }),
    { nowMs }
  );
  assert.equal(unsafeTrustedValueValidation.error_kind, "trusted_loader_evidence_unsafe");

  const missing = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const health = await missing.getJson("/health");
  assert.equal(health.ok, true);
  assert.equal(health.renderer_process_alive, true);
  assert.equal(health.renderer_ready, false);
  assert.equal(health.model3_manifest_available, false);
  assert.equal(health.loader_provisioning.provisioning_status, "not_configured");
  assert.equal(health.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(health));

  const statusBefore = await missing.getJson("/status");
  assert.equal(statusBefore.model_id, "iris_default");
  assert.equal(statusBefore.scene_id, "main_scene");
  assert.equal(statusBefore.renderer_ready, false);
  assert.equal(statusBefore.renderer_health.model3_manifest_available, false);
  assert.equal(statusBefore.renderer_health.loader_provisioning.provisioning_status, "not_configured");
  assert.equal(statusBefore.renderer_health.loader_provisioning.loader_dependency_status, "missing_dependency");
  assert.equal(statusBefore.renderer_health.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(statusBefore.renderer_health.trusted_loader_evidence_status, "missing");
  assert.equal(statusBefore.renderer_health.trusted_loader_ready_candidate, false);
  assert.equal(statusBefore.last_cue_received_at, null);
  assert.equal(statusBefore.cue_capability.live2d_engine_request, true);
  assertSafe(JSON.stringify(statusBefore));

  const missingRuntimeConfig = await missing.getJson("/renderer/runtime-config");
  assert.equal(missingRuntimeConfig.cubism_sdk.available, false);
  assert.equal(missingRuntimeConfig.model3.available, false);
  assert.equal(missingRuntimeConfig.model3.load_route, "not_available");
  assert.equal(missingRuntimeConfig.model3.browser_load_supported, false);
  assert.equal(missingRuntimeConfig.loader_selection.selected_loader_kind, "cubism_framework_model_loader_v1");
  assert.equal(missingRuntimeConfig.loader_selection.fallback_loader_kind, "cubism_moc_create");
  assert.equal(missingRuntimeConfig.loader_selection.dependency_status, "missing_dependency");
  assert.equal(missingRuntimeConfig.loader_selection.trusted_loader_allowlist_enabled, false);
  assert.equal(missingRuntimeConfig.loader_provisioning.provisioning_status, "not_configured");
  assert.equal(missingRuntimeConfig.loader_provisioning.loader_dependency_status, "missing_dependency");
  assert.equal(missingRuntimeConfig.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(missingRuntimeConfig.loader_provisioning.configured_env_count, 0);
  assertSafe(JSON.stringify(missingRuntimeConfig));
  const missingModel3 = await fetchJsonStatus(`${missing.baseUrl}/renderer/model3`);
  assert.equal(missingModel3.status, 404);
  assert.equal(missingModel3.body.error_kind, "not_found");
  assertSafe(JSON.stringify(missingModel3.body));

  const browserState = createInitialRendererState();
  applyRuntimeConfig(browserState, {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: false },
  }, true);
  assert.equal(browserState.model3ManifestAvailable, true);
  assert.equal(browserState.model3Loaded, false);
  assert.equal(browserState.sceneLoaded, false);
  assert.equal(browserState.model3BrowserLoadSupported, false);
  assert.equal(browserState.modelLoadStatus, "not_configured");
  assert.equal(enqueueBrowserCues(browserState, [{ status_hash: "browser_pending_hash" }]), 1);
  const pendingFlush = flushPendingCues(browserState, () => nowMs);
  assert.equal(pendingFlush.applied_count, 0);
  assert.equal(pendingFlush.pending_cue_count, 1);
  assert.equal(browserState.lastCueApplyStatus, "queued_until_ready");
  assert.equal(browserStatusText(browserState), "Live2D renderer preserving cue until real model load");
  const browserHeartbeatPayload = createHeartbeatPayload(browserState, nowMs);
  assert.equal(browserHeartbeatPayload.model3_loaded, false);
  assert.equal(browserHeartbeatPayload.scene_loaded, false);
  assert.equal(browserHeartbeatPayload.real_model_loaded, false);
  assert.equal(browserHeartbeatPayload.model_load_status, "not_configured");
  assert.equal(browserHeartbeatPayload.cue_capability.model_motion_update, false);

  const assetRouteOnlyState = createInitialRendererState();
  const assetRouteConfig = {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: true },
  };
  applyRuntimeConfig(assetRouteOnlyState, assetRouteConfig, false);
  assert.equal(assetRouteOnlyState.modelAssetRouteAvailable, true);
  assert.equal(assetRouteOnlyState.model3Loaded, false);
  assert.equal(assetRouteOnlyState.sceneLoaded, false);
  assert.equal(createHeartbeatPayload(assetRouteOnlyState, nowMs).real_model_loaded, false);
  await updateModelLoadEvidence(assetRouteOnlyState, assetRouteConfig, {
    fetchImpl: async () => {
      throw new Error("fetch_not_expected_for_runtime_missing");
    },
    runtimeRoot: {},
  });
  assert.equal(assetRouteOnlyState.modelLoadStatus, "runtime_missing");
  assert.equal(assetRouteOnlyState.realModelLoadSupported, false);
  assert.equal(assetRouteOnlyState.model3Loaded, false);
  assert.equal(assetRouteOnlyState.sceneLoaded, false);

  const cubismCoreOnlyState = createInitialRendererState();
  applyRuntimeConfig(cubismCoreOnlyState, assetRouteConfig, true);
  assert.equal(detectCubismModelLoader({ Live2DCubismCore: { Version: "contract" } }), null);
  await updateModelLoadEvidence(cubismCoreOnlyState, assetRouteConfig, {
    fetchImpl: async () => {
      throw new Error("fetch_not_expected_for_loader_missing");
    },
    runtimeRoot: { Live2DCubismCore: { Version: "contract" } },
  });
  assert.equal(cubismCoreOnlyState.cubismRuntimeLoaded, true);
  assert.equal(cubismCoreOnlyState.modelAssetRouteAvailable, true);
  assert.equal(cubismCoreOnlyState.modelLoadStatus, "loader_missing");
  assert.equal(cubismCoreOnlyState.modelLoadErrorKind, "missing_dependency");
  assert.equal(cubismCoreOnlyState.loaderCapabilityClass, "cubism_core_only");
  assert.equal(cubismCoreOnlyState.loaderDependencyStatus, "missing_dependency");
  assert.equal(cubismCoreOnlyState.modelLoadSupported, false);
  assert.equal(cubismCoreOnlyState.modelLoadSucceeded, false);
  assert.equal(cubismCoreOnlyState.realModelLoadSupported, false);
  assert.equal(cubismCoreOnlyState.model3Loaded, false);
  assert.equal(cubismCoreOnlyState.sceneLoaded, false);
  const loaderMissingPayload = createHeartbeatPayload(cubismCoreOnlyState, nowMs);
  assert.equal(loaderMissingPayload.model_load_status, "loader_missing");
  assert.equal(loaderMissingPayload.model_load_error_kind, "missing_dependency");
  assert.equal(loaderMissingPayload.loader_capability_class, "cubism_core_only");
  assert.equal(loaderMissingPayload.loader_dependency_status, "missing_dependency");
  assert.equal(loaderMissingPayload.loader_candidate_kind, "none");
  assert.equal(loaderMissingPayload.real_model_loaded, false);
  assert.equal(loaderMissingPayload.real_scene_loaded, false);
  assertSafe(JSON.stringify(loaderMissingPayload));

  const fakeLoaderState = createInitialRendererState();
  applyRuntimeConfig(fakeLoaderState, assetRouteConfig, true);
  assert.equal(detectCubismModelLoader(createFakeLoaderRuntime())?.kind, "cubism_moc_create");
  await updateModelLoadEvidence(fakeLoaderState, assetRouteConfig, {
    fetchImpl: createFakeLoaderFetch(),
    runtimeRoot: createFakeLoaderRuntime(),
  });
  assert.equal(fakeLoaderState.modelLoadStatus, "loader_missing");
  assert.equal(fakeLoaderState.modelLoadErrorKind, "operator_attention_required");
  assert.equal(fakeLoaderState.loaderCapabilityClass, "loader_detected_untrusted");
  assert.equal(fakeLoaderState.loaderDependencyStatus, "operator_attention_required");
  assert.equal(fakeLoaderState.loaderCandidateKind, "cubism_moc_create");
  assert.equal(fakeLoaderState.modelLoadSupported, false);
  assert.equal(fakeLoaderState.realModelLoadSupported, false);
  assert.equal(fakeLoaderState.model3Loaded, false);
  assert.equal(fakeLoaderState.sceneLoaded, false);
  assert.equal(fakeLoaderState.trustedLoaderEvidence.loader_kind, "cubism_moc_create");
  assert.equal(fakeLoaderState.trustedLoaderEvidence.server_trusted_policy_gate, false);
  const fakeLoaderHeartbeatPayload = createHeartbeatPayload(fakeLoaderState, nowMs);
  assert.equal(fakeLoaderHeartbeatPayload.real_model_load_supported, false);
  assert.equal(fakeLoaderHeartbeatPayload.real_model_loaded, false);
  assert.equal(fakeLoaderHeartbeatPayload.trusted_loader_evidence.loader_kind, "cubism_moc_create");
  assert.equal(fakeLoaderHeartbeatPayload.trusted_loader_evidence.server_trusted_policy_gate, false);
  const fakeLoaderHeartbeat = await missing.postJson(
    "/renderer/heartbeat",
    fakeLoaderHeartbeatPayload
  );
  assert.equal(fakeLoaderHeartbeat.renderer_ready, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.real_model_load_supported, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_load_supported, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_loaded_claimed, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.real_model_loaded_claimed, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(fakeLoaderHeartbeat.renderer_health.loader_capability_class, "loader_detected_untrusted");
  assert.equal(fakeLoaderHeartbeat.renderer_health.loader_dependency_status, "operator_attention_required");
  assert.equal(fakeLoaderHeartbeat.renderer_health.loader_candidate_kind, "cubism_moc_create");
  assert.equal(fakeLoaderHeartbeat.renderer_health.trusted_loader_evidence_status, "missing");
  assert.equal(fakeLoaderHeartbeat.renderer_health.trusted_loader_error_kind, "trusted_loader_policy_gate_missing");
  assertSafe(JSON.stringify(fakeLoaderHeartbeat));

  const diagnosticTrustedLoaderHeartbeat = await missing.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    trusted_loader_evidence: trustedLoaderEvidenceFixture({
      loader_kind: "cubism_moc_create",
    }),
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_ready, false);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.real_model_load_supported, false);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.model_loaded, false);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.trusted_loader_evidence_status, "future_only");
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.trusted_loader_kind, "cubism_moc_create");
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.trusted_loader_policy_gate, true);
  assert.equal(diagnosticTrustedLoaderHeartbeat.renderer_health.trusted_loader_ready_candidate, false);
  assertSafe(JSON.stringify(diagnosticTrustedLoaderHeartbeat));

  browserState.realModelLoadSupported = true;
  browserState.model3Loaded = true;
  browserState.sceneLoaded = true;
  const appliedFlush = flushPendingCues(browserState, () => nowMs);
  assert.equal(appliedFlush.applied_count, 1);
  assert.equal(appliedFlush.pending_cue_count, 0);
  assert.equal(browserState.lastAppliedCueStatusHash, "browser_pending_hash");

  const eventStreamBrowserState = createInitialRendererState();
  applyRuntimeConfig(eventStreamBrowserState, {
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_sdk: { available: true },
    model3: { available: true, manifest_available: true, browser_load_supported: false },
  }, true);
  const eventStreamPending = handleCueEventMessage(eventStreamBrowserState, {
    data: JSON.stringify({ cues: [{ status_hash: "event_stream_pending_hash" }] }),
  });
  assert.equal(eventStreamPending.applied_count, 0);
  assert.equal(eventStreamPending.pending_cue_count, 1);
  assert.equal(eventStreamBrowserState.lastCueApplyStatus, "queued_until_ready");
  eventStreamBrowserState.realModelLoadSupported = true;
  eventStreamBrowserState.model3Loaded = true;
  eventStreamBrowserState.sceneLoaded = true;
  const eventStreamApplied = flushPendingCues(eventStreamBrowserState, () => nowMs);
  assert.equal(eventStreamApplied.applied_count, 1);
  assert.equal(eventStreamBrowserState.lastAppliedCueStatusHash, "event_stream_pending_hash");

  const sdkMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: false,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sdkMissingHeartbeat.renderer_ready, false);
  assert.equal(sdkMissingHeartbeat.renderer_health.cubism_sdk_loaded, false);
  assertSafe(JSON.stringify(sdkMissingHeartbeat));

  const mismatchedHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    model_id: "other_model",
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(mismatchedHeartbeat.renderer_ready, false);
  assert.equal(mismatchedHeartbeat.renderer_health.model_matches, false);
  assertSafe(JSON.stringify(mismatchedHeartbeat));

  const staleHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    heartbeat_timestamp_ms: nowMs - 10_000,
  }));
  assert.equal(staleHeartbeat.renderer_ready, false);
  assert.equal(staleHeartbeat.renderer_health.fresh_heartbeat, false);
  assertSafe(JSON.stringify(staleHeartbeat));

  const loaderMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loader_missing",
    model_load_supported: false,
    model_load_attempted: false,
    model_load_succeeded: false,
    model_load_error_kind: "loader_missing",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(loaderMissingHeartbeat.renderer_ready, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.model_load_status, "loader_missing");
  assert.equal(loaderMissingHeartbeat.renderer_health.model_load_supported, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.model_loaded, false);
  assert.equal(loaderMissingHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(loaderMissingHeartbeat));

  const runtimeMissingHeartbeat = await missing.postJson("/renderer/heartbeat", browserHeartbeat({
    cubism_runtime_loaded: false,
    model_asset_route_available: true,
    model_load_status: "runtime_missing",
    model_load_supported: false,
    model_load_error_kind: "runtime_missing",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(runtimeMissingHeartbeat.renderer_ready, false);
  assert.equal(runtimeMissingHeartbeat.renderer_health.cubism_sdk_loaded, false);
  assert.equal(runtimeMissingHeartbeat.renderer_health.model_load_status, "runtime_missing");
  assert.equal(runtimeMissingHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(runtimeMissingHeartbeat));

  const engineResponse = await missing.postJson("/live2d-engine", {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_job",
    event_id: "contract_event",
    motion_style: "talk",
    timing: { total_duration_ms: 1200 },
    engine_preferences: { model_id: "iris_default", scene_id: "main_scene" },
  });
  assert.equal(engineResponse.accepted, true);
  assert.equal(engineResponse.queued_for_browser, true);
  assert.equal(engineResponse.renderer_ready, false);
  assert.equal(typeof engineResponse.cue_summary.status_hash, "string");
  assertSafe(JSON.stringify(engineResponse));

  const browserCueQueue = await missing.getJson("/renderer/cues");
  assert.equal(browserCueQueue.ok, true);
  assert.equal(browserCueQueue.delivery_ready, false);
  assert.equal(browserCueQueue.cues.length, 0);
  assert.equal(browserCueQueue.pending_cue_count, 1);
  assert.equal(browserCueQueue.delivery_status, "waiting_for_browser_ready");
  assertSafe(JSON.stringify(browserCueQueue));

  const waitingSse = await readSseEvents(missing.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(waitingSse.contentType.includes("text/event-stream"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "renderer_status"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "heartbeat"), true);
  assert.equal(waitingSse.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(waitingSse.events));
  const statusAfterWaitingSse = await missing.getJson("/status");
  assert.equal(statusAfterWaitingSse.browser_delivery.pending_cue_count, 1);
  assert.equal(statusAfterWaitingSse.renderer_ready, false);

  const cueResponse = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "idle_breath" },
      timing: { duration_ms: 900 },
      boundary_policy: {
        renderer_cue_only: true,
        no_text_payloads: true,
        no_candidates: true,
        no_commands: true,
        no_endpoint_values: true,
        no_secret_values: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(cueResponse.accepted, true);
  assert.equal(cueResponse.renderer_ready, false);
  assertSafe(JSON.stringify(cueResponse));

  const irisBridgeCue = createIrisBridgeCueFixture();
  const irisBridgeCueResponse = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: irisBridgeCue,
    boundary_policy: {
      no_text_payloads: true,
      no_candidates: true,
      no_commands: true,
      no_endpoint_values: true,
      no_secret_values: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(irisBridgeCueResponse.accepted, true);
  assert.equal(irisBridgeCueResponse.renderer_ready, false);
  assertSafe(JSON.stringify(irisBridgeCueResponse));

  const strongWithRecovery = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "laugh_big", intensity: "high" },
      recovery_plan: { type: "breath_recover" },
      boundary_policy: {
        renderer_cue_only: true,
        no_candidates: true,
        no_commands: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(strongWithRecovery.accepted, true);
  assertSafe(JSON.stringify(strongWithRecovery));

  const cameraCloseupWithRecovery = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      camera: {
        proximity_profile: "close_face",
        scale: 1.1,
        face_priority: true,
        comfort_guard: "bounded_viewer_closeup",
        recovery_hint: "visibility_restore",
      },
      boundary_policy: {
        renderer_cue_only: true,
        no_candidates: true,
        no_commands: true,
      },
      adapter_validation_required: true,
    },
  });
  assert.equal(cameraCloseupWithRecovery.accepted, true);
  assertSafe(JSON.stringify(cameraCloseupWithRecovery));

  const happyLoudSingWithRecovery = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "happy_loud_sing", intensity: "high" },
    recovery_cue: { style: "idle_breath" },
  }));
  assert.equal(happyLoudSingWithRecovery.accepted, true);
  assertSafe(JSON.stringify(happyLoudSingWithRecovery));

  const cameraScaleWithRecovery = await missing.postJson("/cue", rendererCueDelivery({
    camera: { scale: 1.06, recovery_hint: "visibility_restore" },
  }));
  assert.equal(cameraScaleWithRecovery.accepted, true);
  assertSafe(JSON.stringify(cameraScaleWithRecovery));

  const rendererCueWrapper = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
    boundary_policy: {
      renderer_cue_only: true,
      no_candidates: true,
      no_commands: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(rendererCueWrapper.accepted, true);
  assertSafe(JSON.stringify(rendererCueWrapper));

  const live2dCueWrapper = await missing.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    live2d_cue: safeRendererCue({ motion: { style: "idle_breath" } }),
    boundary_policy: {
      renderer_cue_only: true,
      no_candidates: true,
      no_commands: true,
    },
    adapter_validation_required: true,
  });
  assert.equal(live2dCueWrapper.accepted, true);
  assertSafe(JSON.stringify(live2dCueWrapper));

  const motionRecoveryRequired = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "surprise_scream", recovery_required: true },
  }));
  assert.equal(motionRecoveryRequired.accepted, true);
  assertSafe(JSON.stringify(motionRecoveryRequired));

  const bodyRecoveryHint = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "happy_dance", intensity: "high" },
    body: { recovery_hint: "neutral_reset" },
  }));
  assert.equal(bodyRecoveryHint.accepted, true);
  assertSafe(JSON.stringify(bodyRecoveryHint));

  const cameraRecoveryHint = await missing.postJson("/cue", rendererCueDelivery({
    camera: { face_priority: true, recovery_hint: "visibility_restore" },
  }));
  assert.equal(cameraRecoveryHint.accepted, true);
  assertSafe(JSON.stringify(cameraRecoveryHint));

  const shoulderMotionRecoverCompatibility = await missing.postJson("/cue", rendererCueDelivery({
    motion: { style: "surprise_scream" },
    body: { shoulder_motion: "short_jump_then_breath_recover" },
  }));
  assert.equal(shoulderMotionRecoverCompatibility.accepted, true);
  assertSafe(JSON.stringify(shoulderMotionRecoverCompatibility));

  const localEngineCloseupWithRecovery = await missing.postJson("/live2d-engine", {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_closeup_with_recovery",
    event_id: "contract_event",
    motion_style: "talk",
    camera_proximity_profile: "close_face",
    camera_recovery_hint: "visibility_restore",
    timing: { total_duration_ms: 1200 },
  });
  assert.equal(localEngineCloseupWithRecovery.accepted, true);
  assertSafe(JSON.stringify(localEngineCloseupWithRecovery));

  const mockHealthHeartbeat = await missing.postJson("/renderer/heartbeat", {
    schema: "mock_health_v1",
    ok: true,
    heartbeat_timestamp_ms: nowMs,
  });
  assert.equal(mockHealthHeartbeat.renderer_ready, false);
  assert.equal(mockHealthHeartbeat.renderer_health.cue_capability_confirmed, false);
  assertSafe(JSON.stringify(mockHealthHeartbeat));

  const unsafe = await fetch(`${missing.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schema: "bad", endpoint: "https://secret.example/cue", token: "secret-token" }),
  });
  const unsafeBody = await unsafe.json();
  assert.equal(unsafe.status, 400);
  assert.equal(unsafeBody.ok, false);
  assertSafe(JSON.stringify(unsafeBody));

  await assertCueRejected(missing, {
    schema: "unsupported_live2d_cue_v1",
    cue: { schema: "iris_live2d_renderer_cue_v1", motion: { style: "talk" } },
  }, "unsupported_cue", "unsupported_live2d_cue_v1");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: { schema: "iris_live2d_renderer_cue_v1", motion: { style: "spin_attack" } },
  }, "unknown_motion_style", "spin_attack");
  for (const futureMicroLabel of [
    "blink_attention",
    "small_nod",
    "soft_smile",
    "surprise_micro",
    "breathing_shift",
    "gaze_return",
    "neutral_breath",
  ]) {
    await assertCueRejected(missing, rendererCueDelivery({
      motion: { style: futureMicroLabel },
    }), "unknown_motion_style", futureMicroLabel);
  }
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk", gesture_hint: "https://secret.example/motion" },
    },
  }, "unsafe_cue_value", "https://secret.example/motion");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "talk", gesture_hint: "wss://secret.example/cue" },
  }), "unsafe_cue_value", "wss://secret.example/cue");
  await assertCueRejected(missing, rendererCueDelivery({
    expression: { expression_key: "avatar.model3.json" },
  }), "unsafe_cue_value", "avatar.model3.json");
  await assertCueRejected(missing, rendererCueDelivery({
    expression: { expression_key: "avatar.moc3" },
  }), "unsafe_cue_value", "avatar.moc3");
  for (const field of [
    "world_command",
    "input_action_candidate",
    "approved_game_input_action",
    "candidate",
    "commit",
    "write",
    "raw_renderer_payload",
    "raw_motion_command",
    "model_path",
    "modelPath",
    "internal_model_path",
    "internalModelPath",
    "motion_path",
    "motionPath",
    "rawMotionPath",
    "obs_command",
    "game_input",
    "os_command",
  ]) {
    await assertCueRejected(missing, cueWithUnsafeField(field), "unsafe_cue_field", field);
  }
  for (const field of ["token", "secret", "authorization", "endpoint", "rendererEndpoint", "url", "apiKey"]) {
    await assertCueRejected(missing, cueWithUnsafeField(field), "unsafe_cue_field", field);
  }
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
    token: "unsafe_fixture_value",
  }, "unsafe_cue_field", "token");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    live2d_cue: safeRendererCue({ raw_renderer_payload: "unsafe_fixture_value" }),
  }, "unsafe_cue_field", "raw_renderer_payload");
  await assertCueRejected(missing, {
    schema: "unsupported_live2d_wrapper_v1",
    renderer_cue: safeRendererCue({ motion: { style: "talk" } }),
  }, "unsupported_cue", "unsupported_live2d_wrapper_v1");
  await assertCueRejected(missing, rendererCueDelivery({
    boundary_policy: { renderer_endpoint: "unsafe_fixture_value" },
  }), "unsafe_cue_field", "renderer_endpoint");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "laugh_big" },
    recovery_plan: { type: "shortcut_jump" },
  }), "invalid_cue_contract", "shortcut_jump");
  await assertCueRejected(missing, rendererCueDelivery({
    motion: { style: "laugh_big" },
    recovery_cue: { style: "shortcut_jump" },
  }), "invalid_cue_contract", "shortcut_jump");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "laugh_big" },
    },
  }, "recovery_required", "laugh_big");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "surprise_scream" },
    },
  }, "recovery_required", "surprise_scream");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "happy_dance" },
    },
  }, "recovery_required", "happy_dance");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "happy_loud_sing" },
    },
  }, "recovery_required", "happy_loud_sing");
  await assertCueRejected(missing, {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      camera: { face_priority: true },
    },
  }, "recovery_required", "face_priority");
  await assertCueRejected(missing, rendererCueDelivery({
    camera: { scale: 1.06 },
  }), "recovery_required", "scale");
  await assertCueRejected(missing, rendererCueDelivery({
    camera: { proximity_profile: "close_face" },
  }), "recovery_required", "close_face");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_strong_without_recovery",
    event_id: "contract_event",
    motion_style: "laugh_big",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "laugh_big", "/live2d-engine");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_local_closeup_without_recovery",
    event_id: "contract_event",
    motion_style: "talk",
    camera_proximity_profile: "close_face",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "close_face", "/live2d-engine");
  await assertCueRejected(missing, {
    schema: "iris_local_live2d_engine_request_v1",
    job_id: "contract_live2d_local_sing_without_recovery",
    event_id: "contract_event",
    motion_style: "happy_loud_sing",
    timing: { total_duration_ms: 1200 },
  }, "recovery_required", "happy_loud_sing", "/live2d-engine");

  const statusAfter = await missing.getJson("/status");
  assert.equal(statusAfter.renderer_ready, false);
  assert.equal(statusAfter.received_cue_count, 14);
  assert.equal(statusAfter.browser_delivery.pending_cue_count, 14);
  assert.notEqual(statusAfter.last_cue_received_at, null);
  assertSafe(JSON.stringify(statusAfter));

  await missing.close();

  const modelOnly = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const modelOnlyCue = await modelOnly.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
    },
  });
  const modelOnlyHeartbeat = await modelOnly.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: modelOnlyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelOnlyHeartbeat.renderer_ready, false);
  assert.equal(modelOnlyHeartbeat.renderer_health.cubism_sdk_available, false);
  assertSafe(JSON.stringify(modelOnlyHeartbeat));
  await modelOnly.close();

  const ready = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const readyRuntimeConfig = await ready.getJson("/renderer/runtime-config");
  assert.equal(readyRuntimeConfig.cubism_sdk.available, true);
  assert.equal(readyRuntimeConfig.model3.available, true);
  assert.equal(readyRuntimeConfig.model3.manifest_available, true);
  assert.equal(readyRuntimeConfig.model3.load_route, "renderer_model3_manifest");
  assert.equal(readyRuntimeConfig.model3.asset_route, "renderer_model_asset");
  assert.equal(readyRuntimeConfig.model3.browser_load_supported, true);
  assert.equal(readyRuntimeConfig.model3.real_model_loaded, false);
  assert.equal(readyRuntimeConfig.loader_provisioning.provisioning_status, "not_configured");
  assert.equal(readyRuntimeConfig.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assertSafe(JSON.stringify(readyRuntimeConfig));
  assertNoModelPathLeak(JSON.stringify(readyRuntimeConfig));
  const readyCoreScript = await ready.getText("/renderer/cubism-core.js");
  assert.equal(readyCoreScript.includes("Live2DCubismCore"), true);
  const readyCoreTraversal = await fetchJsonStatus(`${ready.baseUrl}/renderer/cubism-core.js?asset=../CubismCore.js`);
  assert.equal(readyCoreTraversal.status, 403);
  assert.equal(readyCoreTraversal.body.core_route_status, "blocked_traversal");
  assertSafe(JSON.stringify(readyCoreTraversal.body));
  assertNoModelPathLeak(JSON.stringify(readyCoreTraversal.body));
  const readyCoreNonLoopback = await fetch(`${ready.baseUrl}/renderer/cubism-core.js`, {
    headers: { "x-forwarded-for": "203.0.113.10" },
  });
  const readyCoreNonLoopbackBody = await readyCoreNonLoopback.json();
  assert.equal(readyCoreNonLoopback.status, 403);
  assert.equal(readyCoreNonLoopbackBody.core_route_status, "blocked_non_loopback");
  assertSafe(JSON.stringify(readyCoreNonLoopbackBody));
  assertNoModelPathLeak(JSON.stringify(readyCoreNonLoopbackBody));

  const noCoreRoute = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const noCoreRouteStatus = await fetchJsonStatus(`${noCoreRoute.baseUrl}/renderer/cubism-core.js`);
  assert.equal(noCoreRouteStatus.status, 404);
  assert.equal(noCoreRouteStatus.body.core_route_status, "not_configured");
  assert.deepEqual(noCoreRouteStatus.body.configured_env_names, []);
  assertSafe(JSON.stringify(noCoreRouteStatus.body));
  assertNoModelPathLeak(JSON.stringify(noCoreRouteStatus.body));
  await noCoreRoute.close();

  const missingCoreRoute = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: join(tmpDir, "Live2DCubismCore.min.js"),
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const missingCoreRouteStatus = await fetchJsonStatus(`${missingCoreRoute.baseUrl}/renderer/cubism-core.js`);
  assert.equal(missingCoreRouteStatus.status, 404);
  assert.equal(missingCoreRouteStatus.body.core_route_status, "operator_attention_required");
  assert.deepEqual(missingCoreRouteStatus.body.configured_env_names, ["IRIS_LIVE2D_CUBISM_CORE_JS"]);
  assertSafe(JSON.stringify(missingCoreRouteStatus.body));
  assertNoModelPathLeak(JSON.stringify(missingCoreRouteStatus.body));
  await missingCoreRoute.close();

  for (const unsafeCandidate of [unsafeCorePath, unsafeCoreExtensionPath]) {
    const unsafeCoreRoute = await startHarness(createRendererState({
      modelId: "iris_default",
      sceneId: "main_scene",
      cubismCoreJsPath: unsafeCandidate,
      model3JsonPath: model3Path,
      heartbeatMaxAgeMs: 2_000,
      now: () => nowMs,
    }));
    const unsafeCoreRouteStatus = await fetchJsonStatus(`${unsafeCoreRoute.baseUrl}/renderer/cubism-core.js`);
    assert.equal(unsafeCoreRouteStatus.status, 409);
    assert.equal(unsafeCoreRouteStatus.body.core_route_status, "unsafe_configuration");
    assertSafe(JSON.stringify(unsafeCoreRouteStatus.body));
    assertNoModelPathLeak(JSON.stringify(unsafeCoreRouteStatus.body));
    await unsafeCoreRoute.close();
  }
  const traversalCoreRoute = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: `${tmpDir}/../CubismCore.js`,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const traversalCoreRouteStatus = await fetchJsonStatus(`${traversalCoreRoute.baseUrl}/renderer/cubism-core.js`);
  assert.equal(traversalCoreRouteStatus.status, 403);
  assert.equal(traversalCoreRouteStatus.body.core_route_status, "blocked_traversal");
  assertSafe(JSON.stringify(traversalCoreRouteStatus.body));
  assertNoModelPathLeak(JSON.stringify(traversalCoreRouteStatus.body));
  await traversalCoreRoute.close();

  const provisioned = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    cubismLoaderEnv: {
      IRIS_LIVE2D_CUBISM_FRAMEWORK_JS: ownerFrameworkLoaderPath,
      IRIS_LIVE2D_CUBISM_LOADER_KIND: "cubism_framework_model_loader_v1",
    },
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const provisionedRuntimeConfig = await provisioned.getJson("/renderer/runtime-config");
  assert.equal(provisionedRuntimeConfig.loader_provisioning.provisioning_status, "candidate_present");
  assert.equal(provisionedRuntimeConfig.loader_provisioning.loader_dependency_status, "candidate_present");
  assert.equal(provisionedRuntimeConfig.loader_provisioning.license_status, "license_attention_required");
  assert.equal(provisionedRuntimeConfig.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.model3.real_model_loaded, false);
  assert.equal(provisionedRuntimeConfig.loader_selection.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_preflight_summary.trusted_loader_allowlist_status, "disabled");
  assert.equal(provisionedRuntimeConfig.trusted_loader_preflight_summary.trusted_loader_candidate_status, "candidate_present_diagnostic_only");
  assert.equal(provisionedRuntimeConfig.trusted_loader_preflight_summary.trusted_loader_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_preflight_summary.trusted_loader_real_evidence_prerequisite, "real_evidence_required");
  assert.equal(provisionedRuntimeConfig.trusted_loader_enablement_gate_summary.trusted_loader_enablement_gate_status, "blocked");
  assert.equal(provisionedRuntimeConfig.trusted_loader_enablement_gate_summary.trusted_loader_enablement_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_enablement_gate_summary.trusted_loader_enablement_blockers.includes("blocked_allowlist_disabled"), true);
  assert.equal(provisionedRuntimeConfig.trusted_loader_enablement_gate_summary.trusted_loader_enablement_runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_status, "blocked");
  assert.equal(provisionedRuntimeConfig.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_enablement_gate_blocked"), true);
  assert.equal(provisionedRuntimeConfig.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.bundle_status, "blocked");
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.bundle_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.bundle_blocked_reasons.includes("bundle_blocked_missing_owner_confirmation"), true);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.bundle_blocked_reasons.includes("bundle_blocked_priority1_unresolved"), true);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.fresh_evidence_bundle_summary.no_loader_trusted, true);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.go_nogo_status, "no_go");
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.go_candidate, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.degraded_mode_available, true);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.no_go_reasons.includes("degraded_mode_available_not_go"), true);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.go_nogo_preflight_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.evidence_intake_status, "blocked");
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.intake_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.unsafe_material_rejected, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_intake_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.owner_confirmation_envelope_status, "blocked");
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.confirmation_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.confirmed_scopes.length, 0);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.owner_confirmation_envelope_summary.production_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.real_evidence_request_packet_status, "blocked");
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.request_packet_ready_candidate, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.request_packet_collects_real_evidence, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.request_packet_creates_owner_confirmation, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.required_evidence_components.includes("live2d_owner_confirmation_envelope"), true);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.required_confirmation_scopes.includes("owner_confirmation_envelope_review"), true);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.runtime_readiness_claimed, false);
  assert.equal(provisionedRuntimeConfig.real_evidence_request_packet_summary.production_readiness_claimed, false);
  assert.equal(JSON.stringify(provisionedRuntimeConfig).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(provisionedRuntimeConfig));
  assertNoModelPathLeak(JSON.stringify(provisionedRuntimeConfig));
  const provisionedStatus = await provisioned.getJson("/status");
  assert.equal(provisionedStatus.renderer_ready, false);
  assert.equal(provisionedStatus.renderer_health.loader_provisioning.provisioning_status, "candidate_present");
  assert.equal(provisionedStatus.trusted_loader_preflight_summary.trusted_loader_allowlist_status, "disabled");
  assert.equal(provisionedStatus.trusted_loader_preflight_summary.trusted_loader_candidate_status, "candidate_present_diagnostic_only");
  assert.equal(provisionedStatus.trusted_loader_preflight_summary.trusted_loader_readiness_claimed, false);
  assert.equal(provisionedStatus.trusted_loader_enablement_gate_summary.trusted_loader_enablement_gate_status, "blocked");
  assert.equal(provisionedStatus.trusted_loader_enablement_gate_summary.no_loader_trusted, true);
  assert.equal(provisionedStatus.trusted_loader_enablement_gate_summary.candidate_present_diagnostic_only, true);
  assert.equal(provisionedStatus.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_status, "blocked");
  assert.equal(provisionedStatus.trusted_loader_owner_handoff_summary.no_loader_trusted, true);
  assert.equal(provisionedStatus.trusted_loader_owner_handoff_summary.candidate_present_diagnostic_only, true);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.bundle_status, "blocked");
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.bundle_ready_candidate, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.renderer_ready, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.model_loaded, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.scene_loaded, false);
  assert.equal(provisionedStatus.fresh_evidence_bundle_summary.browser_cue_delivery_ready, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.go_nogo_status, "no_go");
  assert.equal(provisionedStatus.go_nogo_preflight_summary.go_candidate, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.no_loader_trusted, true);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.renderer_ready, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.model_loaded, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.scene_loaded, false);
  assert.equal(provisionedStatus.go_nogo_preflight_summary.browser_cue_delivery_ready, false);
  assert.equal(provisionedStatus.real_evidence_intake_summary.evidence_intake_status, "blocked");
  assert.equal(provisionedStatus.real_evidence_intake_summary.intake_ready_candidate, false);
  assert.equal(provisionedStatus.real_evidence_intake_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.real_evidence_intake_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedStatus.real_evidence_intake_summary.renderer_ready, false);
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.owner_confirmation_envelope_status, "blocked");
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.confirmation_ready_candidate, false);
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedStatus.owner_confirmation_envelope_summary.renderer_ready, false);
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.real_evidence_request_packet_status, "blocked");
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.request_packet_ready_candidate, false);
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.request_packet_completeness_is_readiness, false);
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedStatus.real_evidence_request_packet_summary.renderer_ready, false);
  assert.equal(provisionedStatus.renderer_health.model_loaded, false);
  assert.equal(provisionedStatus.renderer_health.scene_loaded, false);
  assert.equal(provisionedStatus.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(JSON.stringify(provisionedStatus).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(provisionedStatus));
  assertNoModelPathLeak(JSON.stringify(provisionedStatus));
  const provisionedHealth = await provisioned.getJson("/health");
  assert.equal(provisionedHealth.renderer_ready, false);
  assert.equal(provisionedHealth.loader_provisioning.provisioning_status, "candidate_present");
  assert.equal(provisionedHealth.loader_provisioning.trusted_loader_allowlist_enabled, false);
  assert.equal(provisionedHealth.trusted_loader_preflight_summary.trusted_loader_allowlist_status, "disabled");
  assert.equal(provisionedHealth.trusted_loader_preflight_summary.trusted_loader_owner_confirmation_status, "owner_confirmation_required");
  assert.equal(provisionedHealth.trusted_loader_enablement_gate_summary.trusted_loader_enablement_blockers.includes("blocked_missing_owner_confirmation"), true);
  assert.equal(provisionedHealth.trusted_loader_enablement_gate_summary.trusted_loader_enablement_production_readiness_claimed, false);
  assert.equal(provisionedHealth.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_missing_owner_confirmation"), true);
  assert.equal(provisionedHealth.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_production_readiness_claimed, false);
  assert.equal(provisionedHealth.fresh_evidence_bundle_summary.bundle_status, "blocked");
  assert.equal(provisionedHealth.fresh_evidence_bundle_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedHealth.fresh_evidence_bundle_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedHealth.go_nogo_preflight_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHealth.go_nogo_preflight_summary.priority1_status, "BLOCKED");
  assert.equal(provisionedHealth.go_nogo_preflight_summary.motion_dataset_status, "non_executable");
  assert.equal(provisionedHealth.real_evidence_intake_summary.evidence_intake_status, "blocked");
  assert.equal(provisionedHealth.real_evidence_intake_summary.intake_ready_candidate, false);
  assert.equal(provisionedHealth.real_evidence_intake_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.owner_confirmation_envelope_summary.owner_confirmation_envelope_status, "blocked");
  assert.equal(provisionedHealth.owner_confirmation_envelope_summary.confirmation_ready_candidate, false);
  assert.equal(provisionedHealth.owner_confirmation_envelope_summary.motion_dataset_executable, false);
  assert.equal(provisionedHealth.real_evidence_request_packet_summary.real_evidence_request_packet_status, "blocked");
  assert.equal(provisionedHealth.real_evidence_request_packet_summary.request_packet_ready_candidate, false);
  assert.equal(provisionedHealth.real_evidence_request_packet_summary.request_packet_collects_real_evidence, false);
  assert.equal(provisionedHealth.real_evidence_request_packet_summary.motion_dataset_executable, false);
  assert.equal(JSON.stringify(provisionedHealth).includes(ownerFrameworkLoaderPath), false);
  assertSafe(JSON.stringify(provisionedHealth));
  assertNoModelPathLeak(JSON.stringify(provisionedHealth));
  const provisionedHeartbeat = await provisioned.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(provisionedHeartbeat.renderer_ready, false);
  assert.equal(provisionedHeartbeat.renderer_health.model_loaded, false);
  assert.equal(provisionedHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(provisionedHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(provisionedHeartbeat.renderer_health.loader_provisioning.provisioning_status, "candidate_present");
  assert.equal(provisionedHeartbeat.trusted_loader_preflight_summary.trusted_loader_allowlist_status, "disabled");
  assert.equal(provisionedHeartbeat.trusted_loader_preflight_summary.trusted_loader_real_evidence_prerequisite, "fresh_real_evidence_attention_required");
  assert.equal(provisionedHeartbeat.trusted_loader_preflight_summary.trusted_loader_readiness_claimed, false);
  assert.equal(provisionedHeartbeat.trusted_loader_enablement_gate_summary.trusted_loader_enablement_gate_status, "blocked");
  assert.equal(provisionedHeartbeat.trusted_loader_enablement_gate_summary.trusted_loader_enablement_blockers.includes("blocked_priority1_unresolved"), true);
  assert.equal(provisionedHeartbeat.trusted_loader_enablement_gate_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_status, "blocked");
  assert.equal(provisionedHeartbeat.trusted_loader_owner_handoff_summary.trusted_loader_owner_handoff_blockers.includes("handoff_blocked_priority1_unresolved"), true);
  assert.equal(provisionedHeartbeat.trusted_loader_owner_handoff_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.fresh_evidence_bundle_summary.bundle_status, "blocked");
  assert.equal(provisionedHeartbeat.fresh_evidence_bundle_summary.bundle_blocked_reasons.includes("bundle_blocked_priority1_unresolved"), true);
  assert.equal(provisionedHeartbeat.fresh_evidence_bundle_summary.bundle_blocked_reasons.includes("bundle_blocked_motion_dataset_non_executable"), true);
  assert.equal(provisionedHeartbeat.fresh_evidence_bundle_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.go_nogo_preflight_summary.go_nogo_status, "no_go");
  assert.equal(provisionedHeartbeat.go_nogo_preflight_summary.no_go_reasons.includes("no_go_priority1_unresolved"), true);
  assert.equal(provisionedHeartbeat.go_nogo_preflight_summary.no_go_reasons.includes("no_go_motion_dataset_non_executable"), true);
  assert.equal(provisionedHeartbeat.go_nogo_preflight_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_intake_summary.evidence_intake_status, "blocked");
  assert.equal(provisionedHeartbeat.real_evidence_intake_summary.intake_ready_candidate, false);
  assert.equal(provisionedHeartbeat.real_evidence_intake_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_envelope_summary.owner_confirmation_envelope_status, "blocked");
  assert.equal(provisionedHeartbeat.owner_confirmation_envelope_summary.confirmation_ready_candidate, false);
  assert.equal(provisionedHeartbeat.owner_confirmation_envelope_summary.renderer_ready, false);
  assert.equal(provisionedHeartbeat.real_evidence_request_packet_summary.real_evidence_request_packet_status, "blocked");
  assert.equal(provisionedHeartbeat.real_evidence_request_packet_summary.request_packet_ready_candidate, false);
  assert.equal(provisionedHeartbeat.real_evidence_request_packet_summary.renderer_ready, false);
  assertSafe(JSON.stringify(provisionedHeartbeat));
  assertNoModelPathLeak(JSON.stringify(provisionedHeartbeat));
  await provisioned.close();

  const safeModel3 = await ready.getJson("/renderer/model3");
  assert.equal(safeModel3.ok, true);
  assert.equal(safeModel3.load_route, "renderer_model3_manifest");
  assert.equal(safeModel3.asset_route, "renderer_model_asset");
  assert.equal(safeModel3.manifest.FileReferences.Moc.startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Textures[0].startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Expressions[0].File.startsWith("renderer_model_asset:"), true);
  assert.equal(safeModel3.manifest.FileReferences.Motions.Idle[0].File.startsWith("renderer_model_asset:"), true);
  assertSafe(JSON.stringify(safeModel3));
  assertNoModelPathLeak(JSON.stringify(safeModel3));
  const mocAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Moc);
  const mocAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${mocAssetId}`);
  assert.equal(mocAssetResponse.status, 200);
  assert.equal(mocAssetResponse.headers.get("content-type"), "application/octet-stream");
  assert.equal(await mocAssetResponse.text(), "fixture-moc");
  const textureAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Textures[0]);
  const textureAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${textureAssetId}`);
  assert.equal(textureAssetResponse.status, 200);
  assert.equal(textureAssetResponse.headers.get("content-type"), "image/png");
  const motionAssetId = assetIdFromToken(safeModel3.manifest.FileReferences.Motions.Idle[0].File);
  const motionAssetResponse = await fetch(`${ready.baseUrl}/renderer/model-asset/${motionAssetId}`);
  assert.equal(motionAssetResponse.status, 200);
  assert.equal((motionAssetResponse.headers.get("content-type") || "").includes("application/json"), true);
  const unknownAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/asset_0000000000000000_moc3`);
  assert.equal(unknownAsset.status, 404);
  assertSafe(JSON.stringify(unknownAsset.body));
  const traversalAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/..%2Fsecret`);
  assert.equal(traversalAsset.status, 404);
  assertSafe(JSON.stringify(traversalAsset.body));
  const urlAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/http%3A%2F%2Fexample.invalid%2Fasset.moc3`);
  assert.equal(urlAsset.status, 404);
  assertSafe(JSON.stringify(urlAsset.body));
  const queryAsset = await fetchJsonStatus(`${ready.baseUrl}/renderer/model-asset/${mocAssetId}?raw_path=unsafe`);
  assert.equal(queryAsset.status, 404);
  assertSafe(JSON.stringify(queryAsset.body));
  const sdkScript = await ready.getText("/renderer/cubism-core.js");
  assert.equal(sdkScript.includes("Live2DCubismCore"), true);

  const readyStatusBeforeCue = await ready.getJson("/status");
  assert.equal(readyStatusBeforeCue.renderer_health.cubism_sdk_available, true);
  assert.equal(readyStatusBeforeCue.renderer_health.model3_manifest_available, true);
  assert.equal(readyStatusBeforeCue.renderer_ready, false);
  assertSafe(JSON.stringify(readyStatusBeforeCue));
  assertNoModelPathLeak(JSON.stringify(readyStatusBeforeCue));

  const acceptedReadyCue = await ready.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      timing: { duration_ms: 700 },
    },
  });
  assert.equal(acceptedReadyCue.accepted, true);
  assert.equal(acceptedReadyCue.renderer_ready, false);
  assertSafe(JSON.stringify(acceptedReadyCue));

  const fixtureOnlyHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(fixtureOnlyHeartbeat.renderer_ready, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.real_model_load_supported, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.model_loaded_claimed, true);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(fixtureOnlyHeartbeat.renderer_health.last_cue_applied_at, null);
  assertSafe(JSON.stringify(fixtureOnlyHeartbeat));

  const fixtureOnlyBrowserCues = await ready.getJson("/renderer/cues");
  assert.equal(fixtureOnlyBrowserCues.delivery_ready, false);
  assert.equal(fixtureOnlyBrowserCues.cues.length, 0);
  assert.equal(fixtureOnlyBrowserCues.pending_cue_count, 1);
  assertSafe(JSON.stringify(fixtureOnlyBrowserCues));

  const manifestOnlyHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "asset_route_available",
    model_load_supported: false,
    model_load_attempted: false,
    model_load_succeeded: false,
    model_load_error_kind: "unknown",
    real_model_load_supported: false,
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(manifestOnlyHeartbeat.renderer_ready, false);
  assert.equal(manifestOnlyHeartbeat.renderer_health.model_load_status, "asset_route_available");
  assert.equal(manifestOnlyHeartbeat.renderer_health.model_loaded, false);
  assert.equal(manifestOnlyHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(manifestOnlyHeartbeat));

  const modelLoadedWithoutRealFlag = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loaded",
    model_load_supported: true,
    model_load_attempted: true,
    model_load_succeeded: true,
    model_load_error_kind: "unknown",
    real_model_load_supported: true,
    real_model_loaded: false,
    real_scene_loaded: true,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelLoadedWithoutRealFlag.renderer_ready, false);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.model_loaded_claimed, true);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.real_model_loaded_claimed, false);
  assert.equal(modelLoadedWithoutRealFlag.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(modelLoadedWithoutRealFlag));

  const sceneLoadedWithoutRealFlag = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sceneLoadedWithoutRealFlag.renderer_ready, false);
  assert.equal(sceneLoadedWithoutRealFlag.renderer_health.model_loaded, false);
  assert.equal(sceneLoadedWithoutRealFlag.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(sceneLoadedWithoutRealFlag));

  const staleRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs - 10_000,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs - 10_000,
  }));
  assert.equal(staleRealModelHeartbeat.renderer_ready, false);
  assert.equal(staleRealModelHeartbeat.renderer_health.fresh_heartbeat, false);
  assert.equal(staleRealModelHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(staleRealModelHeartbeat));

  const modelMismatchRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    model_id: "other_model",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(modelMismatchRealModelHeartbeat.renderer_ready, false);
  assert.equal(modelMismatchRealModelHeartbeat.renderer_health.model_matches, false);
  assert.equal(modelMismatchRealModelHeartbeat.renderer_health.model_loaded, false);
  assertSafe(JSON.stringify(modelMismatchRealModelHeartbeat));

  const sceneMismatchRealModelHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    scene_id: "other_scene",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_ready, false);
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_health.scene_matches, false);
  assert.equal(sceneMismatchRealModelHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(sceneMismatchRealModelHeartbeat));

  const lastCueNotAppliedRealModel = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_apply_status: "not_ready",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(lastCueNotAppliedRealModel.renderer_ready, false);
  assert.equal(lastCueNotAppliedRealModel.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(lastCueNotAppliedRealModel.renderer_health.last_cue_applied, false);
  assertSafe(JSON.stringify(lastCueNotAppliedRealModel));

  const deliveryEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(deliveryEvidenceHeartbeat.renderer_ready, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.model_loaded, false);
  assert.equal(deliveryEvidenceHeartbeat.renderer_health.scene_loaded, false);
  assertSafe(JSON.stringify(deliveryEvidenceHeartbeat));
  const realEvidenceBrowserCues = await ready.getJson("/renderer/cues");
  assert.equal(realEvidenceBrowserCues.delivery_ready, false);
  assert.equal(realEvidenceBrowserCues.cues.length, 0);
  assert.equal(realEvidenceBrowserCues.pending_cue_count, 1);
  assertSafe(JSON.stringify(realEvidenceBrowserCues));

  const fullRealEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    last_applied_cue_status_hash: acceptedReadyCue.cue_summary.status_hash,
    last_cue_applied_at_ms: nowMs,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(fullRealEvidenceHeartbeat.renderer_ready, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(fullRealEvidenceHeartbeat.renderer_health.last_cue_applied, false);
  assertSafe(JSON.stringify(fullRealEvidenceHeartbeat));

  const readyHealth = await ready.getJson("/health");
  assert.equal(readyHealth.renderer_ready, false);
  assert.equal(readyHealth.live2d_evidence_summary.safe_summary_only, true);
  assert.equal(readyHealth.live2d_evidence_summary.live2d_priority1_status, "BLOCKED");
  assert.equal(readyHealth.live2d_evidence_summary.live2d_runtime_readiness_claimed, false);
  assertSafe(JSON.stringify(readyHealth));
  assertNoModelPathLeak(JSON.stringify(readyHealth));

  const missingEvidenceHarness = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const missingEvidenceStatus = await missingEvidenceHarness.getJson("/status");
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.live2d_evidence_status, "blocked");
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.blocked_or_attention_reason, "missing_evidence");
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.renderer_ready, false);
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.model_loaded, false);
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.scene_loaded, false);
  assert.equal(missingEvidenceStatus.live2d_evidence_summary.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(missingEvidenceStatus.live2d_evidence_summary));
  await missingEvidenceHarness.close();

  const fixtureEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    evidence_source_type: "fixture",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(fixtureEvidenceHeartbeat.live2d_evidence_summary.collector_source_type, "fixture");
  assert.equal(fixtureEvidenceHeartbeat.live2d_evidence_summary.fixture_evidence_status, "fixture_only");
  assert.equal(fixtureEvidenceHeartbeat.live2d_evidence_summary.blocked_or_attention_reason, "fixture_only");
  assert.equal(fixtureEvidenceHeartbeat.renderer_ready, false);
  assert.equal(fixtureEvidenceHeartbeat.renderer_health.model_loaded, false);
  assert.equal(fixtureEvidenceHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(fixtureEvidenceHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(fixtureEvidenceHeartbeat));
  assertNoModelPathLeak(JSON.stringify(fixtureEvidenceHeartbeat));

  const dryRunEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    evidence_source_type: "dry_run",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(dryRunEvidenceHeartbeat.live2d_evidence_summary.collector_source_type, "dry_run");
  assert.equal(dryRunEvidenceHeartbeat.live2d_evidence_summary.dry_run_evidence_status, "dry_run_only");
  assert.equal(dryRunEvidenceHeartbeat.live2d_evidence_summary.blocked_or_attention_reason, "dry_run_only");
  assert.equal(dryRunEvidenceHeartbeat.live2d_evidence_summary.live2d_runtime_readiness_claimed, false);
  assert.equal(dryRunEvidenceHeartbeat.renderer_ready, false);
  assertSafe(JSON.stringify(dryRunEvidenceHeartbeat));

  const missingTimestampEvidenceHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    evidence_source_type: "real_probe",
    heartbeat_timestamp_ms: undefined,
  }));
  assert.equal(missingTimestampEvidenceHeartbeat.live2d_evidence_summary.evidence_timestamp_status, "missing");
  assert.equal(missingTimestampEvidenceHeartbeat.live2d_evidence_summary.blocked_or_attention_reason, "missing_timestamp");
  assert.equal(missingTimestampEvidenceHeartbeat.renderer_ready, false);
  assertSafe(JSON.stringify(missingTimestampEvidenceHeartbeat));

  const staleEvidenceSummary = staleRealModelHeartbeat.live2d_evidence_summary;
  assert.equal(staleEvidenceSummary.evidence_freshness_status, "stale");
  assert.equal(staleEvidenceSummary.blocked_or_attention_reason, "stale_evidence");
  assert.equal(staleEvidenceSummary.live2d_runtime_readiness_claimed, false);
  assertSafe(JSON.stringify(staleEvidenceSummary));

  const incompleteRealProbeHeartbeat = await ready.postJson("/renderer/heartbeat", browserHeartbeat({
    evidence_source_type: "real_probe",
    real_model_loaded: false,
    real_scene_loaded: false,
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.collector_source_type, "real_probe");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.blocked_or_attention_reason, "real_probe_incomplete");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.model_configured_status, "configured");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.cue_capability_status, "claimed");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.recovery_capability_status, "claimed");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.last_cue_applied_status, "not_confirmed");
  assert.equal(incompleteRealProbeHeartbeat.live2d_evidence_summary.motion_dataset_executable, false);
  assert.equal(incompleteRealProbeHeartbeat.renderer_ready, false);
  assert.equal(incompleteRealProbeHeartbeat.renderer_health.model_loaded, false);
  assert.equal(incompleteRealProbeHeartbeat.renderer_health.scene_loaded, false);
  assert.equal(incompleteRealProbeHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(incompleteRealProbeHeartbeat));
  assertNoModelPathLeak(JSON.stringify(incompleteRealProbeHeartbeat));

  const evidenceRuntimeConfig = await ready.getJson("/renderer/runtime-config");
  assert.equal(evidenceRuntimeConfig.live2d_evidence_summary.safe_summary_only, true);
  assert.equal(evidenceRuntimeConfig.live2d_evidence_summary.live2d_fixture_evidence_ignored_for_readiness, true);
  assert.equal(evidenceRuntimeConfig.live2d_evidence_summary.live2d_priority1_status, "BLOCKED");
  assertSafe(JSON.stringify(evidenceRuntimeConfig.live2d_evidence_summary));

  const noAppliedAtState = createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  });
  const noAppliedAt = await startHarness(noAppliedAtState);
  const noAppliedAtCue = await noAppliedAt.postJson("/cue", {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
    },
  });
  const noAppliedAtHeartbeat = await noAppliedAt.postJson("/renderer/heartbeat", browserHeartbeat({
    last_applied_cue_status_hash: noAppliedAtCue.cue_summary.status_hash,
    last_cue_apply_status: "applied",
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(noAppliedAtHeartbeat.renderer_ready, false);
  assert.equal(noAppliedAtHeartbeat.renderer_health.last_cue_applied_at, null);
  assertSafe(JSON.stringify(noAppliedAtHeartbeat));
  await noAppliedAt.close();

  nowMs += 10_000;
  const staleReadyHealth = await ready.getJson("/health");
  assert.equal(staleReadyHealth.renderer_ready, false);
  assertSafe(JSON.stringify(staleReadyHealth));
  await ready.close();

  const unsafeUrlManifestPath = join(tmpDir, "unsafe-url.model3.json");
  await writeFile(unsafeUrlManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "https://example.invalid/model.moc3" },
  }));
  await assertManifestUnavailable(unsafeUrlManifestPath);

  const unsafeAbsoluteManifestPath = join(tmpDir, "unsafe-absolute.model3.json");
  await writeFile(unsafeAbsoluteManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "/unsafe/model.moc3" },
  }));
  await assertManifestUnavailable(unsafeAbsoluteManifestPath);

  const unsafeTraversalManifestPath = join(tmpDir, "unsafe-traversal.model3.json");
  await writeFile(unsafeTraversalManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "../outside.moc3" },
  }));
  await assertManifestUnavailable(unsafeTraversalManifestPath);

  const unsafeExtensionManifestPath = join(tmpDir, "unsafe-extension.model3.json");
  await writeFile(unsafeExtensionManifestPath, JSON.stringify({
    Version: 3,
    FileReferences: { Moc: "asset.txt" },
  }));
  await assertManifestUnavailable(unsafeExtensionManifestPath);

  const deliveryReady = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    cubismCoreJsPath: sdkCorePath,
    model3JsonPath: model3Path,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  const deliveryReadyHeartbeat = await deliveryReady.postJson("/renderer/heartbeat", syntheticRealModelHeartbeat({
    heartbeat_timestamp_ms: nowMs,
  }));
  assert.equal(deliveryReadyHeartbeat.renderer_ready, false);
  assert.equal(deliveryReadyHeartbeat.renderer_health.browser_cue_delivery_ready, false);
  assertSafe(JSON.stringify(deliveryReadyHeartbeat));
  const sseCue = await deliveryReady.postJson("/cue", rendererCueDelivery({
    motion: { style: "talk" },
    timing: { duration_ms: 700 },
  }));
  assert.equal(sseCue.accepted, true);
  const waitingSseOnly = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(waitingSseOnly.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(waitingSseOnly.events));
  const waitingPolling = await deliveryReady.getJson("/renderer/cues");
  assert.equal(waitingPolling.delivery_ready, false);
  assert.equal(waitingPolling.cues.length, 0);
  assert.equal(waitingPolling.pending_cue_count, 1);
  assertSafe(JSON.stringify(waitingPolling));

  const pollingCue = await deliveryReady.postJson("/cue", rendererCueDelivery({
    motion: { style: "idle_breath" },
    timing: { duration_ms: 500 },
  }));
  const pollingFallback = await deliveryReady.getJson("/renderer/cues");
  assert.equal(pollingCue.accepted, true);
  assert.equal(pollingFallback.delivery_ready, false);
  assert.equal(pollingFallback.cues.length, 0);
  assert.equal(pollingFallback.pending_cue_count, 2);
  assertSafe(JSON.stringify(pollingFallback));
  const noDeliveryWhileUntrusted = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(noDeliveryWhileUntrusted.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(noDeliveryWhileUntrusted.events));

  await assertCueRejected(deliveryReady, cueWithUnsafeField("raw_renderer_payload"), "unsafe_cue_field", "raw_renderer_payload");
  const rejectedSse = await readSseEvents(deliveryReady.baseUrl, { minEvents: 2, timeoutMs: 500 });
  assert.equal(rejectedSse.events.some((event) => event.event === "renderer_cues"), false);
  assertSafe(JSON.stringify(rejectedSse.events));
  const deliveryReadyStatus = await deliveryReady.getJson("/status");
  assert.equal(deliveryReadyStatus.renderer_ready, false);
  await deliveryReady.close();

  const authRequired = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }), { rendererApiKey: "fixture-renderer-key" });
  const unauthorized = await fetch(`${authRequired.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ schema: "iris_live2d_renderer_cue_delivery_v1", cue: { schema: "iris_live2d_renderer_cue_v1" } }),
  });
  const unauthorizedBody = await unauthorized.json();
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorizedBody.error_kind, "auth_required");
  assertSafe(JSON.stringify(unauthorizedBody));
  const authorized = await fetch(`${authRequired.baseUrl}/cue`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": "fixture-renderer-key" },
    body: JSON.stringify({ schema: "iris_live2d_renderer_cue_delivery_v1", cue: { schema: "iris_live2d_renderer_cue_v1" } }),
  });
  const authorizedBody = await authorized.json();
  assert.equal(authorized.status, 200);
  assert.equal(authorizedBody.accepted, true);
  assertSafe(JSON.stringify(authorizedBody));
  await authRequired.close();

  console.log(JSON.stringify({
    ok: true,
    checked: [
      "health",
      "status",
      "model_missing",
      "sdk_missing",
      "heartbeat_stale",
      "model_scene_mismatch",
      "cue_accepted",
      "browser_cue_route",
      "browser_cue_retention",
      "redaction",
      "optional_write_auth",
      "mock_health_false",
      "runtime_config_safe",
      "unavailable_model3_route_not_advertised",
      "sdk_script_route",
      "sdk_missing_blocks_ready",
      "model3_available",
      "fixture_manifest_blocks_ready",
      "last_cue_applied_at_guard",
      "cue_allowlist_validation",
      "unsafe_cue_safe_reject",
      "strong_motion_recovery_required",
      "iris_bridge_cue_compatibility",
      "sse_cue_delivery_safe_summary",
      "sse_polling_no_duplicate_delivery",
      "safe_model3_manifest_route",
      "safe_model_asset_route",
      "unsafe_manifest_blocks_browser_load",
      "model_loader_missing_blocks_ready",
      "real_model_load_evidence_required",
      "synthetic_real_model_heartbeat_does_not_make_ready",
      "trusted_loader_preflight_contract_documented",
      "trusted_loader_evidence_gate_diagnostic_only",
      "trusted_loader_evidence_forbidden_material_rejected",
      "cubism_loader_integration_candidate_missing_dependency",
      "cubism_loader_provisioning_safe_summary",
      "cubism_loader_provisioning_owner_file_policy",
      "cubism_loader_provisioning_no_readiness_sweetening",
      "loader_shape_remains_diagnostic_without_allowlist",
      "fake_loader_detection_is_diagnostic_only",
      "live2d_real_evidence_safe_summary",
      "fixture_evidence_not_runtime_readiness",
      "dry_run_evidence_not_runtime_readiness",
      "stale_evidence_not_fresh",
      "real_probe_incomplete_not_ready",
      "trusted_loader_allowlist_preflight_safe_summary",
      "trusted_loader_allowlist_disabled_boundary",
      "trusted_loader_candidate_diagnostic_boundary",
      "trusted_loader_prerequisites_preserved",
      "trusted_loader_enablement_gate_blocked_by_default",
      "trusted_loader_enablement_gate_fail_closed",
      "trusted_loader_enablement_prerequisites_required",
      "trusted_loader_enablement_no_readiness_sweetening",
      "trusted_loader_owner_handoff_blocked_by_default",
      "trusted_loader_owner_handoff_safe_packet",
      "trusted_loader_owner_handoff_mock_confirmation_rejected",
      "trusted_loader_owner_handoff_no_readiness_sweetening",
      "future_micro_label_not_runtime_executable",
      "motion_dataset_boundary_labels_not_runtime_executable",
    ],
  }));
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

function browserHeartbeat(overrides = {}) {
  return {
    schema: "iris_live2d_browser_heartbeat_v1",
    model_id: "iris_default",
    scene_id: "main_scene",
    cubism_runtime_loaded: true,
    model3_loaded: true,
    scene_loaded: true,
    cue_capability: {
      live2d_engine_request: true,
      renderer_cue_delivery: true,
      model_motion_update: true,
      recovery_cue_support: true,
    },
    last_applied_cue_status_hash: "not_yet_applied",
    last_cue_apply_status: "not_ready",
    heartbeat_timestamp_ms: nowMs,
    ...overrides,
  };
}

function syntheticRealModelHeartbeat(overrides = {}) {
  // Self-asserted browser fields are diagnostic fixtures only; they must not
  // establish trusted real model readiness in this PR.
  return browserHeartbeat({
    model_asset_route_available: true,
    model_load_status: "loaded",
    model_load_supported: true,
    model_load_attempted: true,
    model_load_succeeded: true,
    model_load_error_kind: "unknown",
    real_model_load_supported: true,
    real_model_loaded: true,
    real_scene_loaded: true,
    ...overrides,
  });
}

function trustedLoaderEvidenceFixture(overrides = {}) {
  return {
    loader_kind: "cubism_framework_model_loader_v1",
    loader_version: "fixture_loader_version",
    model_load_session_id: "fixture_session_label",
    safe_manifest_status_hash: "fixture_manifest_hash",
    safe_moc_asset_token_hash: "fixture_moc_asset_hash",
    model_id: "iris_default",
    scene_id: "main_scene",
    loaded_at_ms: nowMs,
    fresh_heartbeat_timestamp_ms: nowMs,
    scene_binding_result: "bound",
    cue_capability_result: "confirmed",
    last_cue_applied_result: "applied",
    server_trusted_policy_gate: true,
    ...overrides,
  };
}

function createIrisBridgeCueFixture() {
  return {
    schema: "iris_live2d_renderer_cue_v1",
    cue_id: "live2d-cue-fixture",
    model: {
      model_configured: true,
      scene_configured: true,
    },
    motion: {
      style: "surprise_scream",
      intensity: "high",
      blend_ms: 80,
      track_count: 2,
      body_motion_hint: "shoulder_jump_small_retreat",
      gesture_hint: "hands_near_chest_startle",
    },
    expression: {
      profile_id: "fixture_expression_scream",
      expression_key: "wide_eyes_short_scream",
      blink_rate: 0.2,
      gaze_hint: "snap_to_screen_then_audience",
    },
    body: {
      state_id: "fixture_body_scream",
      autonomous_state_id: "surprise_scream",
      breathing_rate: 0.86,
      shoulder_motion: "short_jump_then_breath_recover",
    },
    camera: {
      proximity_profile: "camera_face_extreme_closeup",
      scale: 1.22,
      offset_x: 0,
      offset_y: -0.055,
      face_priority: true,
      comfort_guard: "bounded_viewer_closeup",
    },
    autonomous: {
      state: "surprise_scream",
      scream_reaction_enabled: true,
      happy_motion_enabled: false,
      vocalise_motion_enabled: false,
      safety_guard: "visual_expression_only_no_commands",
    },
    timing: {
      duration_ms: 1500,
      start_delay_ms: 0,
      sync_policy: "speech_motion_timeline",
    },
    boundary_policy: {
      renderer_cue_only: true,
      no_text_payloads: true,
      no_candidates: true,
      no_commands: true,
      no_endpoint_values: true,
      no_secret_values: true,
    },
    adapter_validation_required: true,
  };
}

function safeRendererCue(overrides = {}) {
  return {
    schema: "iris_live2d_renderer_cue_v1",
    motion: { style: "talk" },
    ...overrides,
  };
}

function rendererCueDelivery(cueOverrides = {}, wrapperOverrides = {}) {
  return {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: safeRendererCue(cueOverrides),
    ...wrapperOverrides,
  };
}

function createFakeLoaderRuntime() {
  return {
    CubismMoc: {
      create() {
        return {
          createModel() {
            return { fixture_model_created: true };
          },
        };
      },
    },
  };
}

function createFakeLoaderFetch() {
  return async (path) => {
    if (path === "/renderer/model3") {
      return {
        ok: true,
        json: async () => ({
          ok: true,
          manifest: {
            FileReferences: {
              Moc: "renderer_model_asset:asset_0123456789abcdef_moc3",
            },
          },
        }),
      };
    }
    if (path === "/renderer/model-asset/asset_0123456789abcdef_moc3") {
      return {
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      };
    }
    return {
      ok: false,
      json: async () => ({}),
    };
  };
}

function cueWithUnsafeField(field) {
  return {
    schema: "iris_live2d_renderer_cue_delivery_v1",
    cue: {
      schema: "iris_live2d_renderer_cue_v1",
      motion: { style: "talk" },
      [field]: "unsafe_fixture_value",
    },
  };
}

async function assertCueRejected(harness, body, expectedKind, forbiddenFragment, path = "/cue") {
  const before = await harness.getJson("/status");
  const beforeBrowserQueue = await harness.getJson("/renderer/cues");
  const response = await fetch(`${harness.baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const responseBody = await response.json();
  assert.equal(response.status, 400);
  assert.equal(responseBody.ok, false);
  assert.equal(responseBody.error_kind, expectedKind);
  const serialized = JSON.stringify(responseBody);
  assertSafe(serialized);
  assert.equal(serialized.includes(`"${forbiddenFragment}"`), false);
  assert.equal(serialized.includes("unsafe_fixture_value"), false);
  const after = await harness.getJson("/status");
  assert.equal(after.received_cue_count, before.received_cue_count);
  assert.equal(after.browser_delivery.pending_cue_count, before.browser_delivery.pending_cue_count);
  assert.equal(after.last_cue_status_hash, before.last_cue_status_hash);
  assert.equal(after.browser_delivery.last_delivered_at, before.browser_delivery.last_delivered_at);
  assert.equal(after.renderer_ready, false);
  const afterBrowserQueue = await harness.getJson("/renderer/cues");
  assert.equal(afterBrowserQueue.pending_cue_count, beforeBrowserQueue.pending_cue_count);
  assert.equal(afterBrowserQueue.cues.length, beforeBrowserQueue.cues.length);
  const queueSerialized = JSON.stringify(afterBrowserQueue);
  assert.equal(queueSerialized, JSON.stringify(beforeBrowserQueue));
  assertSafe(queueSerialized);
  assert.equal(queueSerialized.includes("unsafe_fixture_value"), false);
}

async function assertManifestUnavailable(model3JsonPath) {
  const harness = await startHarness(createRendererState({
    modelId: "iris_default",
    sceneId: "main_scene",
    model3JsonPath,
    heartbeatMaxAgeMs: 2_000,
    now: () => nowMs,
  }));
  try {
    const runtimeConfig = await harness.getJson("/renderer/runtime-config");
    assert.equal(runtimeConfig.model3.available, false);
    assert.equal(runtimeConfig.model3.load_route, "not_available");
    assert.equal(runtimeConfig.model3.browser_load_supported, false);
    assert.equal(runtimeConfig.model3.real_model_loaded, false);
    assertSafe(JSON.stringify(runtimeConfig));
    assertNoModelPathLeak(JSON.stringify(runtimeConfig));
    const manifest = await fetchJsonStatus(`${harness.baseUrl}/renderer/model3`);
    assert.equal(manifest.status, 404);
    assert.equal(manifest.body.error_kind, "not_found");
    assertSafe(JSON.stringify(manifest.body));
    const heartbeat = await harness.postJson("/renderer/heartbeat", browserHeartbeat({
      heartbeat_timestamp_ms: nowMs,
    }));
    assert.equal(heartbeat.renderer_ready, false);
    assert.equal(heartbeat.renderer_health.model_loaded, false);
    assert.equal(heartbeat.renderer_health.scene_loaded, false);
    assertSafe(JSON.stringify(heartbeat));
  } finally {
    await harness.close();
  }
}

async function readSseEvents(baseUrl, { eventName = "", minEvents = 1, timeoutMs = 500 } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(`${baseUrl}/renderer/events`, { signal: controller.signal });
  assert.equal(response.ok, true);
  const contentType = response.headers.get("content-type") || "";
  assert.equal(contentType.includes("text/event-stream"), true);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const events = [];
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parsed = parseSseEvents(buffer);
      buffer = parsed.remainder;
      events.push(...parsed.events);
      if (eventName && events.some((event) => event.event === eventName)) break;
      if (!eventName && events.length >= minEvents) break;
    }
  } catch (error) {
    if (error?.name !== "AbortError") throw error;
  } finally {
    clearTimeout(timeout);
    controller.abort();
    try {
      await reader.cancel();
    } catch {
      // The client-side abort is the disconnect path under test.
    }
  }

  return { contentType, events };
}

function parseSseEvents(buffer) {
  const blocks = buffer.split(/\r?\n\r?\n/u);
  const remainder = blocks.pop() ?? "";
  return {
    remainder,
    events: blocks.map(parseSseEvent).filter(Boolean),
  };
}

function parseSseEvent(block) {
  let event = "message";
  const dataLines = [];
  for (const line of block.split(/\r?\n/u)) {
    if (line.startsWith(":")) continue;
    if (line.startsWith("event:")) event = line.slice("event:".length).trim();
    if (line.startsWith("data:")) dataLines.push(line.slice("data:".length).trimStart());
  }
  if (dataLines.length === 0) return null;
  const dataText = dataLines.join("\n");
  const data = JSON.parse(dataText);
  assertSafe(dataText);
  return { event, data };
}

async function fetchJsonStatus(target) {
  const response = await fetch(target);
  return {
    status: response.status,
    body: await response.json(),
  };
}

function assetIdFromToken(token) {
  const text = String(token ?? "");
  assert.equal(text.startsWith("renderer_model_asset:"), true);
  const assetId = text.slice("renderer_model_asset:".length);
  assert.match(assetId, /^asset_[a-f0-9]{16}_[a-z0-9]+$/u);
  return assetId;
}

async function startHarness(state, options = {}) {
  const server = createLive2dRendererServer({ state, ...options });
  const address = await listen(server, { host: "127.0.0.1", port: 0 });
  const baseUrl = `http://${address.address}:${address.port}`;
  return {
    baseUrl,
    async getJson(path) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.ok, true);
      return response.json();
    },
    async getText(path) {
      const response = await fetch(`${baseUrl}${path}`);
      assert.equal(response.ok, true);
      return response.text();
    },
    async postJson(path, body) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      assert.equal(response.ok, true);
      return response.json();
    },
    close() {
      return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    },
  };
}

function assertSafe(serialized) {
  assert.equal(serialized.includes("https://secret.example"), false);
  assert.equal(serialized.includes("secret-token"), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("raw_renderer_payload"), false);
  assert.equal(serialized.includes("raw_motion_command"), false);
  assert.equal(serialized.includes("internal_model_path"), false);
  assert.equal(serialized.includes("motion_path"), false);
  assert.equal(serialized.includes("world_command"), false);
  assert.equal(serialized.includes("input_action_candidate"), false);
  assert.equal(serialized.includes("approved_game_input_action"), false);
  assert.equal(serialized.includes("obs_command"), false);
  assert.equal(serialized.includes("game_input"), false);
  assert.equal(serialized.includes("os_command"), false);
}

function assertNoModelPathLeak(serialized) {
  for (const fragment of [
    tmpDir,
    "avatar.model3.json",
    "safe_model.moc3",
    "textures/texture_00.png",
    "motions/idle.motion3.json",
    "expressions/soft_smile.exp3.json",
    "https://example.invalid",
    "/unsafe/model.moc3",
    "../outside.moc3",
    "asset.txt",
  ]) {
    assert.equal(serialized.includes(fragment), false);
  }
}
