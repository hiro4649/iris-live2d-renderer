import { createHash } from "node:crypto";
import { assertSafeInput, assertSafePublicObject, createBoundaryPolicy, safeText } from "./contracts.js";
import { createBrowserCueEnvelope, createBrowserRuntimeConfig, createCubismRendererConfig } from "./renderer/cubismRenderer.js";
import {
  createFreshEvidenceBundleSummary,
  createGoNoGoBlockerResolutionSummary,
  createGoNoGoPreflightSummary,
  createMotionDatasetRealRowIntakeDryRunValidatorSummary,
  createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary,
  createMotionDatasetRealRowAuditManifestSummary,
  createMotionDatasetRealRowRedactionScannerFixturePackSummary,
  createMotionDatasetRealRowEvidenceLinkManifestSummary,
  createMotionDatasetRealRowGoNoGoBlockerMapSummary,
  createMotionDatasetRealRowPreIngestionReviewPacketSummary,
  createMotionDatasetRealRowFinalDryRunChecklistSummary,
  createMotionDatasetRealRowMissingDataFailClosedGateSummary,
  createMotionDatasetOwnerRowDataSubmissionPacketSummary,
  createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary,
  createMotionDatasetOwnerRowDataMetadataValidatorStubSummary,
  createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary,
  createMotionDatasetActualDataTaskEntryGateSummary,
  createMotionDatasetRowBodyParserContractStubSummary,
  createMotionDatasetRowBodyParserRejectionFixturePackSummary,
  createMotionDatasetIngestionAuditTrailStubSummary,
  createMotionDatasetIngestionRollbackPlanStubSummary,
  createMotionDatasetParserDryRunEnvelopeSummary,
  createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary,
  createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary,
  createMotionDatasetActualDataNoGoSummaryProjectionSummary,
  createMotionDatasetOwnerSubmissionReadinessLedgerSummary,
  createMotionDatasetFinalActualDataPreauthBlockerGateSummary,
  createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary,
  createMotionDatasetRowFileQuarantineStagingEnvelopeSummary,
  createMotionDatasetRedactionScanExecutionEnvelopeStubSummary,
  createMotionDatasetParserDryRunExecutionRequestEnvelopeSummary,
  createMotionDatasetAuditExecutionRequestEnvelopeSummary,
  createMotionDatasetActualDataTaskRunbookNoActionPacketSummary,
  createMotionDatasetFinalOwnerActualDataPacketSummary,
  createMotionDatasetActualDataFreezeStateLedgerSummary,
  createMotionDatasetOwnerWaitStatePacketSummary,
  createMotionDatasetReadinessNonSweeteningSweepSummary,
  createMotionDatasetPlanningCompletionReviewPacketSummary,
  createMotionDatasetOwnerSubmissionFormSpecSummary,
  createMotionDatasetRealRowRedactionPolicyMatrixSummary,
  createMotionDatasetMotionAllowlistSyncReviewSummary,
  createMotionDatasetRendererReadyDependencyMatrixSummary,
  createRendererReadyFalsePositiveDependencySurfaceSummary,
  createRendererReadyFixtureVsRealSeparationContractSummary,
  createRendererReadyFreshEvidenceEnvelopeSummary,
  createRendererReadyStaleEvidenceDowngradeContractSummary,
  createRendererReadyEvidenceSourceAllowlistSummary,
  createRendererReadyEvidenceSchemaViolationGuardSummary,
  createRendererReadyEvidenceCompletenessBlockerMatrixSummary,
  createRendererReadyEvidenceConflictDowngradeContractSummary,
  createRendererReadyGoNoGoBlockerSurfaceSummary,
  createRendererReadyBlockerReasonAllowlistSummary,
  createRendererReadySafeNextActionCatalogSummary,
  createRendererReadyCrossSurfaceBlockerConsistencySummary,
  createRendererReadyOwnerEvidenceHandoffPacketStubSummary,
  createRendererReadyOwnerHandoffNotSentGuardSummary,
  createRendererReadyOwnerHandoffRedactionGuardSummary,
  createRendererReadyRealProbeRequestStubSummary,
  createRendererReadyRealProbeRequestRejectionGateSummary,
  createRendererReadyRealProbePreflightBlockerMatrixSummary,
  createRendererReadyEvidenceCollectorManifestStubSummary,
  createRendererReadyEvidenceCollectorRedactionGuardSummary,
  createRendererReadyEvidenceCollectorNoExecutionGuardSummary,
  createRendererReadyEvidenceCollectorSafeOutputSchemaSummary,
  createRendererReadyEvidenceCollectorUnsafeOutputRejectionSummary,
  createRendererReadyPublicSummaryRedactionSummary,
  createRendererReadyAdminSummaryRedactionSummary,
  createRendererReadyAuditReferenceStubSummary,
  createRendererReadyAuditReferenceMissingGuardSummary,
  createRendererReadySafeOperatorChecklistStubSummary,
  createRendererReadySafeOperatorChecklistRedactionGuardSummary,
  createRendererReadyRealEvidenceRequestFinalNoGoSummary,
  createRendererReadyPreflightRouteManifestStubSummary,
  createRendererReadyPreflightRouteUnsafeFieldGuardSummary,
  createRendererReadyOwnerScopeRequirementSurfaceSummary,
  createRendererReadyOwnerScopeMissingRejectionGuardSummary,
  createRendererReadyAuditLinkRequirementSurfaceSummary,
  createRendererReadyAuditLinkMissingRejectionGuardSummary,
  createRendererReadyTrustedLoaderPreauthBlockerSurfaceSummary,
  createRendererReadyTrustedLoaderPreauthRejectionGuardSummary,
  createRendererReadyRuntimeReadinessFinalNoGoSummary,
  createRendererReadyProductionReadinessFinalNoGoSummary,
  createRendererReadyExtendedGuardCompletionReviewSummary,
  createRendererReadyRealEvidenceRequestFinalWaitStateSummary,
  createRendererReadyRealEvidenceRequestRejectionFixturePackSummary,
  createMotionDatasetRealRowSplitPolicyPacketSummary,
  createMotionDatasetSourceHashOwnerChecklistSummary,
  createMotionDatasetFinalOwnerWaitForDataGateSummary,
  createMotionDatasetRowFileChecksumPreflightManifestSummary,
  createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary,
  createMotionDatasetRealRowIntakeRequestPacketSummary,
  createMotionDatasetRowSchemaPreflightSummary,
  createMotionDatasetSyntheticRowFixturePackSummary,
  createOwnerActionLaneFreezeStatusSummary,
  createOwnerConfirmationBindingSummary,
  createOwnerConfirmationEnvelopeSummary,
  createRealEvidenceFreshnessThresholdSummary,
  createRealEvidenceCollectorDryRunEnvelopeSummary,
  createRealEvidenceCollectorManifestSummary,
  createRealEvidenceCollectorFixturePackSummary,
  createRealEvidenceSummaryIntakeBindingSummary,
  createRealResidentEvidenceCollectionPlanSummary,
  createSafeEvidenceSummaryContractSummary,
  createRealEvidenceRequestPacketSummary,
  createRealEvidenceIntakeSummary,
  createTrustedLoaderAllowlistPreflightSummary,
  createTrustedLoaderEnablementGateSummary,
  createTrustedLoaderOwnerHandoffSummary,
} from "./renderer/cubismLoaderProvisioning.js";
import { validateRendererCueEnvelope } from "./renderer/cueValidation.js";
import { DEFAULT_HEARTBEAT_MAX_AGE_MS, createHeartbeatStatus } from "./renderer/heartbeat.js";
import { resolveSafeModelAsset } from "./renderer/modelAssets.js";

const MAX_BROWSER_CUE_QUEUE = 20;

export function createRendererState({
  modelId = "",
  sceneId = "",
  cubismCoreJsPath = "",
  model3JsonPath = "",
  cubismLoaderEnv = {},
  heartbeatMaxAgeMs = DEFAULT_HEARTBEAT_MAX_AGE_MS,
  realModelLoadSupported = false,
  now = () => Date.now(),
} = {}) {
  const cubismConfig = createCubismRendererConfig({
    modelId,
    sceneId,
    cubismCoreJsPath,
    model3JsonPath,
    cubismLoaderEnv,
    heartbeatMaxAgeMs,
  });
  const state = {
    modelId: cubismConfig.model_id,
    sceneId: cubismConfig.scene_id,
    cubismSdkConfigured: cubismConfig.cubism_sdk_configured,
    cubismSdkAvailable: cubismConfig.cubism_sdk_available,
    cubismSdkStatus: cubismConfig.cubism_sdk_status,
    cubismCoreJsPath: cubismConfig.cubism_core_js_path,
    model3ManifestConfigured: cubismConfig.model3_manifest_configured,
    model3ManifestAvailable: cubismConfig.model3_manifest_available,
    model3ManifestStatus: cubismConfig.model3_manifest_status,
    model3AssetRegistry: cubismConfig.model3_asset_registry,
    cubismLoaderProvisioning: cubismConfig.cubism_loader_provisioning,
    heartbeatMaxAgeMs,
    startedAtMs: now(),
    cueCount: 0,
    cueQueue: [],
    lastCueReceivedAt: null,
    lastCueSchema: "",
    lastCueHash: "",
    lastCueDeliveredHash: "",
    lastCueDeliveredAt: null,
    lastHeartbeat: null,
    realModelLoadSupported: realModelLoadSupported === true,
  };

  return {
    status() {
      const heartbeatStatus = getHeartbeatStatus(state, now());
      const trustedLoaderPreflight = createTrustedLoaderAllowlistPreflightSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
      });
      const trustedLoaderEnablementGate = createTrustedLoaderEnablementGateSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
      });
      const trustedLoaderOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
      });
      const freshEvidenceBundle = createFreshEvidenceBundleSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
        ownerHandoffSummary: trustedLoaderOwnerHandoff,
      });
      const goNoGoPreflight = createGoNoGoPreflightSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
        ownerHandoffSummary: trustedLoaderOwnerHandoff,
        freshEvidenceBundleSummary: freshEvidenceBundle,
      });
      const realEvidenceIntake = createRealEvidenceIntakeSummary();
      const ownerConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary();
      const realEvidenceRequestPacket = createRealEvidenceRequestPacketSummary();
      const realResidentEvidenceCollectionPlan = createRealResidentEvidenceCollectionPlanSummary();
      const realEvidenceCollectorManifest = createRealEvidenceCollectorManifestSummary();
      const realEvidenceCollectorFixturePack = createRealEvidenceCollectorFixturePackSummary({ manifestSummary: realEvidenceCollectorManifest });
      const realEvidenceCollectorDryRunEnvelope = createRealEvidenceCollectorDryRunEnvelopeSummary({
        manifestSummary: realEvidenceCollectorManifest,
        fixturePackSummary: realEvidenceCollectorFixturePack,
      });
      const realEvidenceFreshnessThreshold = createRealEvidenceFreshnessThresholdSummary();
      const safeEvidenceSummaryContract = createSafeEvidenceSummaryContractSummary();
      const realEvidenceSummaryIntakeBinding = createRealEvidenceSummaryIntakeBindingSummary();
      const ownerConfirmationBinding = createOwnerConfirmationBindingSummary();
      const goNoGoBlockerResolution = createGoNoGoBlockerResolutionSummary();
      const motionDatasetRowSchemaPreflight = createMotionDatasetRowSchemaPreflightSummary();
      const motionDatasetSyntheticRowFixturePack = createMotionDatasetSyntheticRowFixturePackSummary();
      const motionDatasetRealRowIntakeRequestPacket = createMotionDatasetRealRowIntakeRequestPacketSummary();
      const motionDatasetRealRowIntakeDryRunValidator = createMotionDatasetRealRowIntakeDryRunValidatorSummary();
      const motionDatasetRealRowIntakeQuarantineEnvelope = createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary();
      const motionDatasetRealRowIntakeOwnerHandoffPacket = createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary();
      const motionDatasetRealRowAuditManifest = createMotionDatasetRealRowAuditManifestSummary();
      const motionDatasetRealRowRedactionScannerFixturePack = createMotionDatasetRealRowRedactionScannerFixturePackSummary();
      const motionDatasetRealRowEvidenceLinkManifest = createMotionDatasetRealRowEvidenceLinkManifestSummary();
      const motionDatasetRealRowGoNoGoBlockerMap = createMotionDatasetRealRowGoNoGoBlockerMapSummary();
      const motionDatasetRealRowPreIngestionReviewPacket = createMotionDatasetRealRowPreIngestionReviewPacketSummary();
      const motionDatasetRealRowFinalDryRunChecklist = createMotionDatasetRealRowFinalDryRunChecklistSummary();
      const motionDatasetRealRowMissingDataFailClosedGate = createMotionDatasetRealRowMissingDataFailClosedGateSummary();
      const motionDatasetOwnerRowDataSubmissionPacket = createMotionDatasetOwnerRowDataSubmissionPacketSummary();
      const motionDatasetOwnerRowDataSubmissionReceiptStub = createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary();
      const motionDatasetOwnerRowDataMetadataValidatorStub = createMotionDatasetOwnerRowDataMetadataValidatorStubSummary();
      const motionDatasetOwnerRowDataSubmissionRejectionFixturePack = createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary();
      const motionDatasetActualDataTaskEntryGate = createMotionDatasetActualDataTaskEntryGateSummary();
      const motionDatasetRowBodyParserContractStub = createMotionDatasetRowBodyParserContractStubSummary();
      const motionDatasetRowBodyParserRejectionFixturePack = createMotionDatasetRowBodyParserRejectionFixturePackSummary();
      const motionDatasetIngestionAuditTrailStub = createMotionDatasetIngestionAuditTrailStubSummary();
      const motionDatasetIngestionRollbackPlanStub = createMotionDatasetIngestionRollbackPlanStubSummary();
      const motionDatasetParserDryRunEnvelope = createMotionDatasetParserDryRunEnvelopeSummary();
      const motionDatasetRealRowAcceptanceCriteriaChecklist = createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary();
      const motionDatasetOwnerActualDataTaskHandoffReviewPacket = createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary();
      const motionDatasetActualDataNoGoSummaryProjection = createMotionDatasetActualDataNoGoSummaryProjectionSummary();
      const motionDatasetOwnerSubmissionReadinessLedger = createMotionDatasetOwnerSubmissionReadinessLedgerSummary();
      const motionDatasetFinalActualDataPreauthBlockerGate = createMotionDatasetFinalActualDataPreauthBlockerGateSummary();
      const motionDatasetOwnerConfirmationPreflightEnvelope = createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary();
      const motionDatasetRowFileQuarantineStagingEnvelope = createMotionDatasetRowFileQuarantineStagingEnvelopeSummary();
      const motionDatasetRedactionScanExecutionEnvelopeStub = createMotionDatasetRedactionScanExecutionEnvelopeStubSummary();
      const motionDatasetParserDryRunExecutionRequestEnvelope = createMotionDatasetParserDryRunExecutionRequestEnvelopeSummary();
      const motionDatasetAuditExecutionRequestEnvelope = createMotionDatasetAuditExecutionRequestEnvelopeSummary();
      const motionDatasetActualDataTaskRunbookNoActionPacket = createMotionDatasetActualDataTaskRunbookNoActionPacketSummary();
      const motionDatasetFinalOwnerActualDataPacket = createMotionDatasetFinalOwnerActualDataPacketSummary();
      const motionDatasetActualDataFreezeStateLedger = createMotionDatasetActualDataFreezeStateLedgerSummary();
      const motionDatasetOwnerWaitStatePacket = createMotionDatasetOwnerWaitStatePacketSummary();
      const motionDatasetReadinessNonSweeteningSweep = createMotionDatasetReadinessNonSweeteningSweepSummary();
      const motionDatasetPlanningCompletionReviewPacket = createMotionDatasetPlanningCompletionReviewPacketSummary();
      const motionDatasetOwnerSubmissionFormSpec = createMotionDatasetOwnerSubmissionFormSpecSummary();
      const motionDatasetRealRowRedactionPolicyMatrix = createMotionDatasetRealRowRedactionPolicyMatrixSummary();
      const motionDatasetMotionAllowlistSyncReview = createMotionDatasetMotionAllowlistSyncReviewSummary();
      const motionDatasetRendererReadyDependencyMatrix = createMotionDatasetRendererReadyDependencyMatrixSummary();
      const rendererReadyFalsePositiveDependencySurface = rendererReadyFalsePositiveDependencySurfaceFromHeartbeat(heartbeatStatus);
      const rendererReadyFixtureVsRealSeparationContract = rendererReadyFixtureVsRealSeparationContractFromHeartbeat(heartbeatStatus);
      const rendererReadyFreshEvidenceEnvelope = rendererReadyFreshEvidenceEnvelopeFromHeartbeat(heartbeatStatus);
      const rendererReadyStaleEvidenceDowngradeContract = rendererReadyStaleEvidenceDowngradeContractFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceSourceAllowlist = rendererReadyEvidenceSourceAllowlistFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceSchemaViolationGuard = createRendererReadyEvidenceSchemaViolationGuardSummary();
      const rendererReadyEvidenceCompletenessBlockerMatrix = rendererReadyEvidenceCompletenessBlockerMatrixFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceConflictDowngradeContract = rendererReadyEvidenceConflictDowngradeContractFromHeartbeat(heartbeatStatus);
      const rendererReadyGoNoGoBlockerSurface = createRendererReadyGoNoGoBlockerSurfaceSummary();
      const rendererReadyBlockerReasonAllowlist = createRendererReadyBlockerReasonAllowlistSummary();
      const rendererReadySafeNextActionCatalog = createRendererReadySafeNextActionCatalogSummary();
      const rendererReadyCrossSurfaceBlockerConsistency = createRendererReadyCrossSurfaceBlockerConsistencySummary();
      const rendererReadyOwnerEvidenceHandoffPacketStub = createRendererReadyOwnerEvidenceHandoffPacketStubSummary();
      const rendererReadyOwnerHandoffNotSentGuard = createRendererReadyOwnerHandoffNotSentGuardSummary();
      const rendererReadyOwnerHandoffRedactionGuard = createRendererReadyOwnerHandoffRedactionGuardSummary();
      const rendererReadyRealProbeRequestStub = createRendererReadyRealProbeRequestStubSummary();
      const rendererReadyRealProbeRequestRejectionGate = createRendererReadyRealProbeRequestRejectionGateSummary();
      const rendererReadyRealProbePreflightBlockerMatrix = createRendererReadyRealProbePreflightBlockerMatrixSummary();
      const rendererReadyEvidenceCollectorManifestStub = createRendererReadyEvidenceCollectorManifestStubSummary();
      const rendererReadyEvidenceCollectorRedactionGuard = createRendererReadyEvidenceCollectorRedactionGuardSummary();
      const rendererReadyEvidenceCollectorNoExecutionGuard = createRendererReadyEvidenceCollectorNoExecutionGuardSummary();
      const rendererReadyEvidenceCollectorSafeOutputSchema = createRendererReadyEvidenceCollectorSafeOutputSchemaSummary();
      const rendererReadyEvidenceCollectorUnsafeOutputRejection = createRendererReadyEvidenceCollectorUnsafeOutputRejectionSummary();
      const rendererReadyPublicSummaryRedaction = createRendererReadyPublicSummaryRedactionSummary();
      const rendererReadyAdminSummaryRedaction = createRendererReadyAdminSummaryRedactionSummary();
      const rendererReadyAuditReferenceStub = createRendererReadyAuditReferenceStubSummary();
      const rendererReadyAuditReferenceMissingGuard = createRendererReadyAuditReferenceMissingGuardSummary();
      const rendererReadySafeOperatorChecklistStub = createRendererReadySafeOperatorChecklistStubSummary();
      const rendererReadySafeOperatorChecklistRedactionGuard = createRendererReadySafeOperatorChecklistRedactionGuardSummary();
      const rendererReadyRealEvidenceRequestFinalNoGo = createRendererReadyRealEvidenceRequestFinalNoGoSummary();
      const rendererReadyPreflightRouteManifestStub = createRendererReadyPreflightRouteManifestStubSummary();
      const rendererReadyPreflightRouteUnsafeFieldGuard = createRendererReadyPreflightRouteUnsafeFieldGuardSummary();
      const rendererReadyOwnerScopeRequirementSurface = createRendererReadyOwnerScopeRequirementSurfaceSummary();
      const rendererReadyOwnerScopeMissingRejectionGuard = createRendererReadyOwnerScopeMissingRejectionGuardSummary();
      const rendererReadyAuditLinkRequirementSurface = createRendererReadyAuditLinkRequirementSurfaceSummary();
      const rendererReadyAuditLinkMissingRejectionGuard = createRendererReadyAuditLinkMissingRejectionGuardSummary();
      const rendererReadyTrustedLoaderPreauthBlockerSurface = createRendererReadyTrustedLoaderPreauthBlockerSurfaceSummary();
      const rendererReadyTrustedLoaderPreauthRejectionGuard = createRendererReadyTrustedLoaderPreauthRejectionGuardSummary();
      const rendererReadyRuntimeReadinessFinalNoGo = createRendererReadyRuntimeReadinessFinalNoGoSummary();
      const rendererReadyProductionReadinessFinalNoGo = createRendererReadyProductionReadinessFinalNoGoSummary();
      const rendererReadyExtendedGuardCompletionReview = createRendererReadyExtendedGuardCompletionReviewSummary();
      const rendererReadyRealEvidenceRequestFinalWaitState = createRendererReadyRealEvidenceRequestFinalWaitStateSummary();
      const rendererReadyRealEvidenceRequestRejectionFixturePack = createRendererReadyRealEvidenceRequestRejectionFixturePackSummary();
      const motionDatasetRealRowSplitPolicyPacket = createMotionDatasetRealRowSplitPolicyPacketSummary();
      const motionDatasetSourceHashOwnerChecklist = createMotionDatasetSourceHashOwnerChecklistSummary();
      const motionDatasetFinalOwnerWaitForDataGate = createMotionDatasetFinalOwnerWaitForDataGateSummary();
      const motionDatasetRowFileChecksumPreflightManifest = createMotionDatasetRowFileChecksumPreflightManifestSummary();
      const ownerActionLaneFreezeStatus = createOwnerActionLaneFreezeStatusSummary();
      const status = {
        ok: true,
        schema: "iris_live2d_renderer_status_v1",
        service: "iris_live2d_renderer",
        model_id: state.modelId,
        scene_id: state.sceneId,
        cue_capability: {
          live2d_engine_request: true,
          renderer_cue_delivery: true,
          browser_polling_delivery: true,
          browser_event_stream_delivery: true,
          recovery_cue_support: heartbeatStatus.recovery_cue_support,
          claimed_capability: heartbeatStatus.cue_capability_claimed,
          real_capability_confirmed: heartbeatStatus.cue_capability_confirmed,
        },
        renderer_health: {
          process_alive: true,
          browser_heartbeat_seen: heartbeatStatus.heartbeat_present,
          cubism_sdk_configured: state.cubismSdkConfigured,
          cubism_sdk_available: state.cubismSdkAvailable,
          cubism_sdk_status: state.cubismSdkStatus,
          cubism_sdk_loaded: heartbeatStatus.cubism_runtime_loaded,
          real_model_load_supported: heartbeatStatus.real_model_load_supported,
          model_asset_route_available: heartbeatStatus.model_asset_route_available,
          model_load_status: heartbeatStatus.model_load_status,
          model_load_supported: heartbeatStatus.model_load_supported,
          model_load_attempted: heartbeatStatus.model_load_attempted,
          model_load_succeeded: heartbeatStatus.model_load_succeeded,
          model_load_error_kind: heartbeatStatus.model_load_error_kind,
          loader_capability_class: heartbeatStatus.loader_capability_class,
          loader_dependency_status: heartbeatStatus.loader_dependency_status,
          loader_candidate_kind: heartbeatStatus.loader_candidate_kind,
          loader_provisioning: state.cubismLoaderProvisioning,
          trusted_loader_evidence_status: heartbeatStatus.trusted_loader_evidence_status,
          trusted_loader_kind: heartbeatStatus.trusted_loader_kind,
          trusted_loader_policy_gate: heartbeatStatus.trusted_loader_policy_gate,
          trusted_loader_ready_candidate: heartbeatStatus.trusted_loader_ready_candidate,
          trusted_loader_error_kind: heartbeatStatus.trusted_loader_error_kind,
          model3_manifest_configured: state.model3ManifestConfigured,
          model3_manifest_available: state.model3ManifestAvailable,
          model3_manifest_status: state.model3ManifestStatus,
          model_loaded: heartbeatStatus.model_loaded,
          scene_loaded: heartbeatStatus.scene_loaded,
          model_loaded_claimed: heartbeatStatus.model_loaded_claimed,
          scene_loaded_claimed: heartbeatStatus.scene_loaded_claimed,
          real_model_loaded_claimed: heartbeatStatus.real_model_loaded_claimed,
          real_scene_loaded_claimed: heartbeatStatus.real_scene_loaded_claimed,
          fresh_heartbeat: heartbeatStatus.heartbeat_fresh,
          model_matches: heartbeatStatus.model_matches,
          scene_matches: heartbeatStatus.scene_matches,
          browser_cue_delivery_ready: heartbeatStatus.browser_cue_delivery_ready,
          last_cue_applied: heartbeatStatus.last_cue_applied,
          last_cue_applied_at: heartbeatStatus.last_cue_applied_at,
          live2d_evidence_summary: heartbeatStatus.live2d_evidence_summary,
          trusted_loader_preflight_summary: trustedLoaderPreflight,
          trusted_loader_enablement_gate_summary: trustedLoaderEnablementGate,
          trusted_loader_owner_handoff_summary: trustedLoaderOwnerHandoff,
          fresh_evidence_bundle_summary: freshEvidenceBundle,
          go_nogo_preflight_summary: goNoGoPreflight,
          real_evidence_intake_summary: realEvidenceIntake,
          owner_confirmation_envelope_summary: ownerConfirmationEnvelope,
          real_evidence_request_packet_summary: realEvidenceRequestPacket,
          real_resident_evidence_collection_plan_summary: realResidentEvidenceCollectionPlan,
          real_evidence_collector_manifest_summary: realEvidenceCollectorManifest,
          real_evidence_collector_fixture_pack_summary: realEvidenceCollectorFixturePack,
          real_evidence_collector_dry_run_envelope_summary: realEvidenceCollectorDryRunEnvelope,
          real_evidence_freshness_threshold_summary: realEvidenceFreshnessThreshold,
          safe_evidence_summary_contract_summary: safeEvidenceSummaryContract,
          real_evidence_summary_intake_binding_summary: realEvidenceSummaryIntakeBinding,
          owner_confirmation_binding_summary: ownerConfirmationBinding,
          go_nogo_blocker_resolution_summary: goNoGoBlockerResolution,
          motion_dataset_real_row_intake_request_packet_summary: motionDatasetRealRowIntakeRequestPacket,
          motion_dataset_real_row_intake_dry_run_validator_summary: motionDatasetRealRowIntakeDryRunValidator,
          motion_dataset_real_row_intake_quarantine_envelope_summary: motionDatasetRealRowIntakeQuarantineEnvelope,
          motion_dataset_real_row_intake_owner_handoff_packet_summary: motionDatasetRealRowIntakeOwnerHandoffPacket,
          motion_dataset_real_row_audit_manifest_summary: motionDatasetRealRowAuditManifest,
          motion_dataset_real_row_redaction_scanner_fixture_pack_summary: motionDatasetRealRowRedactionScannerFixturePack,
          motion_dataset_real_row_evidence_link_manifest_summary: motionDatasetRealRowEvidenceLinkManifest,
          motion_dataset_real_row_go_nogo_blocker_map_summary: motionDatasetRealRowGoNoGoBlockerMap,
          motion_dataset_real_row_pre_ingestion_review_packet_summary: motionDatasetRealRowPreIngestionReviewPacket,
          motion_dataset_real_row_final_dry_run_checklist_summary: motionDatasetRealRowFinalDryRunChecklist,
          motion_dataset_real_row_missing_data_fail_closed_gate_summary: motionDatasetRealRowMissingDataFailClosedGate,
          motion_dataset_owner_row_data_submission_packet_summary: motionDatasetOwnerRowDataSubmissionPacket,
          motion_dataset_owner_row_data_submission_receipt_stub_summary: motionDatasetOwnerRowDataSubmissionReceiptStub,
          motion_dataset_owner_row_data_metadata_validator_stub_summary: motionDatasetOwnerRowDataMetadataValidatorStub,
          motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary: motionDatasetOwnerRowDataSubmissionRejectionFixturePack,
          motion_dataset_actual_data_task_entry_gate_summary: motionDatasetActualDataTaskEntryGate,
          motion_dataset_row_body_parser_contract_stub_summary: motionDatasetRowBodyParserContractStub,
          motion_dataset_row_body_parser_rejection_fixture_pack_summary: motionDatasetRowBodyParserRejectionFixturePack,
          motion_dataset_ingestion_audit_trail_stub_summary: motionDatasetIngestionAuditTrailStub,
          motion_dataset_ingestion_rollback_plan_stub_summary: motionDatasetIngestionRollbackPlanStub,
          motion_dataset_parser_dry_run_envelope_summary: motionDatasetParserDryRunEnvelope,
          motion_dataset_real_row_acceptance_criteria_checklist_summary: motionDatasetRealRowAcceptanceCriteriaChecklist,
          motion_dataset_owner_actual_data_task_handoff_review_packet_summary: motionDatasetOwnerActualDataTaskHandoffReviewPacket,
          motion_dataset_actual_data_no_go_summary_projection_summary: motionDatasetActualDataNoGoSummaryProjection,
          motion_dataset_owner_submission_readiness_ledger_summary: motionDatasetOwnerSubmissionReadinessLedger,
          motion_dataset_final_actual_data_preauth_blocker_gate_summary: motionDatasetFinalActualDataPreauthBlockerGate,
          motion_dataset_owner_confirmation_preflight_envelope_summary: motionDatasetOwnerConfirmationPreflightEnvelope,
          motion_dataset_row_file_quarantine_staging_envelope_summary: motionDatasetRowFileQuarantineStagingEnvelope,
          motion_dataset_redaction_scan_execution_envelope_stub_summary: motionDatasetRedactionScanExecutionEnvelopeStub,
          motion_dataset_parser_dry_run_execution_request_envelope_summary: motionDatasetParserDryRunExecutionRequestEnvelope,
          motion_dataset_audit_execution_request_envelope_summary: motionDatasetAuditExecutionRequestEnvelope,
          motion_dataset_actual_data_task_runbook_no_action_packet_summary: motionDatasetActualDataTaskRunbookNoActionPacket,
          motion_dataset_final_owner_actual_data_packet_summary: motionDatasetFinalOwnerActualDataPacket,
          motion_dataset_actual_data_freeze_state_ledger_summary: motionDatasetActualDataFreezeStateLedger,
          motion_dataset_owner_wait_state_packet_summary: motionDatasetOwnerWaitStatePacket,
          motion_dataset_readiness_non_sweetening_sweep_summary: motionDatasetReadinessNonSweeteningSweep,
          motion_dataset_planning_completion_review_packet_summary: motionDatasetPlanningCompletionReviewPacket,
          motion_dataset_owner_submission_form_spec_summary: motionDatasetOwnerSubmissionFormSpec,
          motion_dataset_real_row_redaction_policy_matrix_summary: motionDatasetRealRowRedactionPolicyMatrix,
          motion_dataset_motion_allowlist_sync_review_summary: motionDatasetMotionAllowlistSyncReview,
          motion_dataset_renderer_ready_dependency_matrix_summary: motionDatasetRendererReadyDependencyMatrix,
          renderer_ready_false_positive_dependency_surface_summary: rendererReadyFalsePositiveDependencySurface,
          renderer_ready_fixture_vs_real_separation_contract_summary: rendererReadyFixtureVsRealSeparationContract,
          renderer_ready_fresh_evidence_envelope_summary: rendererReadyFreshEvidenceEnvelope,
          renderer_ready_stale_evidence_downgrade_contract_summary: rendererReadyStaleEvidenceDowngradeContract,
          renderer_ready_evidence_source_allowlist_summary: rendererReadyEvidenceSourceAllowlist,
          renderer_ready_evidence_schema_violation_guard_summary: rendererReadyEvidenceSchemaViolationGuard,
          renderer_ready_evidence_completeness_blocker_matrix_summary: rendererReadyEvidenceCompletenessBlockerMatrix,
          renderer_ready_evidence_conflict_downgrade_contract_summary: rendererReadyEvidenceConflictDowngradeContract,
          renderer_ready_go_nogo_blocker_surface_summary: rendererReadyGoNoGoBlockerSurface,
          renderer_ready_blocker_reason_allowlist_summary: rendererReadyBlockerReasonAllowlist,
          renderer_ready_safe_next_action_catalog_summary: rendererReadySafeNextActionCatalog,
          renderer_ready_cross_surface_blocker_consistency_summary: rendererReadyCrossSurfaceBlockerConsistency,
          renderer_ready_owner_evidence_handoff_packet_stub_summary: rendererReadyOwnerEvidenceHandoffPacketStub,
          renderer_ready_owner_handoff_not_sent_guard_summary: rendererReadyOwnerHandoffNotSentGuard,
          renderer_ready_owner_handoff_redaction_guard_summary: rendererReadyOwnerHandoffRedactionGuard,
          renderer_ready_real_probe_request_stub_summary: rendererReadyRealProbeRequestStub,
          renderer_ready_real_probe_request_rejection_gate_summary: rendererReadyRealProbeRequestRejectionGate,
          renderer_ready_real_probe_preflight_blocker_matrix_summary: rendererReadyRealProbePreflightBlockerMatrix,
          renderer_ready_evidence_collector_manifest_stub_summary: rendererReadyEvidenceCollectorManifestStub,
          renderer_ready_evidence_collector_redaction_guard_summary: rendererReadyEvidenceCollectorRedactionGuard,
          renderer_ready_evidence_collector_no_execution_guard_summary: rendererReadyEvidenceCollectorNoExecutionGuard,
          renderer_ready_evidence_collector_safe_output_schema_summary: rendererReadyEvidenceCollectorSafeOutputSchema,
          renderer_ready_evidence_collector_unsafe_output_rejection_summary: rendererReadyEvidenceCollectorUnsafeOutputRejection,
          renderer_ready_public_summary_redaction_summary: rendererReadyPublicSummaryRedaction,
          renderer_ready_admin_summary_redaction_summary: rendererReadyAdminSummaryRedaction,
          renderer_ready_audit_reference_stub_summary: rendererReadyAuditReferenceStub,
          renderer_ready_audit_reference_missing_guard_summary: rendererReadyAuditReferenceMissingGuard,
          renderer_ready_safe_operator_checklist_stub_summary: rendererReadySafeOperatorChecklistStub,
          renderer_ready_safe_operator_checklist_redaction_guard_summary: rendererReadySafeOperatorChecklistRedactionGuard,
          renderer_ready_real_evidence_request_final_no_go_summary: rendererReadyRealEvidenceRequestFinalNoGo,
          renderer_ready_preflight_route_manifest_stub_summary: rendererReadyPreflightRouteManifestStub,
          renderer_ready_preflight_route_unsafe_field_guard_summary: rendererReadyPreflightRouteUnsafeFieldGuard,
          renderer_ready_owner_scope_requirement_surface_summary: rendererReadyOwnerScopeRequirementSurface,
          renderer_ready_owner_scope_missing_rejection_guard_summary: rendererReadyOwnerScopeMissingRejectionGuard,
          renderer_ready_audit_link_requirement_surface_summary: rendererReadyAuditLinkRequirementSurface,
          renderer_ready_audit_link_missing_rejection_guard_summary: rendererReadyAuditLinkMissingRejectionGuard,
          renderer_ready_trusted_loader_preauth_blocker_surface_summary: rendererReadyTrustedLoaderPreauthBlockerSurface,
          renderer_ready_trusted_loader_preauth_rejection_guard_summary: rendererReadyTrustedLoaderPreauthRejectionGuard,
          renderer_ready_runtime_readiness_final_no_go_summary: rendererReadyRuntimeReadinessFinalNoGo,
          renderer_ready_production_readiness_final_no_go_summary: rendererReadyProductionReadinessFinalNoGo,
          renderer_ready_extended_guard_completion_review_summary: rendererReadyExtendedGuardCompletionReview,
          renderer_ready_real_evidence_request_final_wait_state_summary: rendererReadyRealEvidenceRequestFinalWaitState,
          renderer_ready_real_evidence_request_rejection_fixture_pack_summary: rendererReadyRealEvidenceRequestRejectionFixturePack,
          motion_dataset_source_hash_owner_checklist_summary: motionDatasetSourceHashOwnerChecklist,
          motion_dataset_final_owner_wait_for_data_gate_summary: motionDatasetFinalOwnerWaitForDataGate,
          motion_dataset_row_file_checksum_preflight_manifest_summary: motionDatasetRowFileChecksumPreflightManifest,
          owner_action_lane_freeze_status_summary: ownerActionLaneFreezeStatus,
          motion_dataset_synthetic_row_fixture_pack_summary: motionDatasetSyntheticRowFixturePack,
          motion_dataset_row_schema_preflight_summary: motionDatasetRowSchemaPreflight,
        },
        live2d_evidence_summary: heartbeatStatus.live2d_evidence_summary,
        trusted_loader_preflight_summary: trustedLoaderPreflight,
        trusted_loader_enablement_gate_summary: trustedLoaderEnablementGate,
        trusted_loader_owner_handoff_summary: trustedLoaderOwnerHandoff,
        fresh_evidence_bundle_summary: freshEvidenceBundle,
        go_nogo_preflight_summary: goNoGoPreflight,
        real_evidence_intake_summary: realEvidenceIntake,
        owner_confirmation_envelope_summary: ownerConfirmationEnvelope,
        real_evidence_request_packet_summary: realEvidenceRequestPacket,
        real_resident_evidence_collection_plan_summary: realResidentEvidenceCollectionPlan,
        real_evidence_collector_manifest_summary: realEvidenceCollectorManifest,
        real_evidence_collector_fixture_pack_summary: realEvidenceCollectorFixturePack,
        real_evidence_collector_dry_run_envelope_summary: realEvidenceCollectorDryRunEnvelope,
        real_evidence_freshness_threshold_summary: realEvidenceFreshnessThreshold,
        safe_evidence_summary_contract_summary: safeEvidenceSummaryContract,
        real_evidence_summary_intake_binding_summary: realEvidenceSummaryIntakeBinding,
        owner_confirmation_binding_summary: ownerConfirmationBinding,
        go_nogo_blocker_resolution_summary: goNoGoBlockerResolution,
        motion_dataset_real_row_intake_request_packet_summary: motionDatasetRealRowIntakeRequestPacket,
        motion_dataset_real_row_intake_dry_run_validator_summary: motionDatasetRealRowIntakeDryRunValidator,
        motion_dataset_real_row_intake_quarantine_envelope_summary: motionDatasetRealRowIntakeQuarantineEnvelope,
        motion_dataset_real_row_intake_owner_handoff_packet_summary: motionDatasetRealRowIntakeOwnerHandoffPacket,
        motion_dataset_real_row_audit_manifest_summary: motionDatasetRealRowAuditManifest,
        motion_dataset_real_row_redaction_scanner_fixture_pack_summary: motionDatasetRealRowRedactionScannerFixturePack,
          motion_dataset_real_row_evidence_link_manifest_summary: motionDatasetRealRowEvidenceLinkManifest,
          motion_dataset_real_row_go_nogo_blocker_map_summary: motionDatasetRealRowGoNoGoBlockerMap,
          motion_dataset_real_row_pre_ingestion_review_packet_summary: motionDatasetRealRowPreIngestionReviewPacket,
          motion_dataset_real_row_final_dry_run_checklist_summary: motionDatasetRealRowFinalDryRunChecklist,
          motion_dataset_real_row_missing_data_fail_closed_gate_summary: motionDatasetRealRowMissingDataFailClosedGate,
          motion_dataset_owner_row_data_submission_packet_summary: motionDatasetOwnerRowDataSubmissionPacket,
          motion_dataset_owner_row_data_submission_receipt_stub_summary: motionDatasetOwnerRowDataSubmissionReceiptStub,
          motion_dataset_owner_row_data_metadata_validator_stub_summary: motionDatasetOwnerRowDataMetadataValidatorStub,
          motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary: motionDatasetOwnerRowDataSubmissionRejectionFixturePack,
          motion_dataset_actual_data_task_entry_gate_summary: motionDatasetActualDataTaskEntryGate,
          motion_dataset_row_body_parser_contract_stub_summary: motionDatasetRowBodyParserContractStub,
          motion_dataset_row_body_parser_rejection_fixture_pack_summary: motionDatasetRowBodyParserRejectionFixturePack,
          motion_dataset_ingestion_audit_trail_stub_summary: motionDatasetIngestionAuditTrailStub,
          motion_dataset_ingestion_rollback_plan_stub_summary: motionDatasetIngestionRollbackPlanStub,
          motion_dataset_parser_dry_run_envelope_summary: motionDatasetParserDryRunEnvelope,
          motion_dataset_real_row_acceptance_criteria_checklist_summary: motionDatasetRealRowAcceptanceCriteriaChecklist,
          motion_dataset_owner_actual_data_task_handoff_review_packet_summary: motionDatasetOwnerActualDataTaskHandoffReviewPacket,
          motion_dataset_actual_data_no_go_summary_projection_summary: motionDatasetActualDataNoGoSummaryProjection,
          motion_dataset_owner_submission_readiness_ledger_summary: motionDatasetOwnerSubmissionReadinessLedger,
          motion_dataset_final_actual_data_preauth_blocker_gate_summary: motionDatasetFinalActualDataPreauthBlockerGate,
          motion_dataset_owner_confirmation_preflight_envelope_summary: motionDatasetOwnerConfirmationPreflightEnvelope,
          motion_dataset_row_file_quarantine_staging_envelope_summary: motionDatasetRowFileQuarantineStagingEnvelope,
          motion_dataset_redaction_scan_execution_envelope_stub_summary: motionDatasetRedactionScanExecutionEnvelopeStub,
          motion_dataset_parser_dry_run_execution_request_envelope_summary: motionDatasetParserDryRunExecutionRequestEnvelope,
          motion_dataset_audit_execution_request_envelope_summary: motionDatasetAuditExecutionRequestEnvelope,
          motion_dataset_actual_data_task_runbook_no_action_packet_summary: motionDatasetActualDataTaskRunbookNoActionPacket,
          motion_dataset_final_owner_actual_data_packet_summary: motionDatasetFinalOwnerActualDataPacket,
          motion_dataset_actual_data_freeze_state_ledger_summary: motionDatasetActualDataFreezeStateLedger,
          motion_dataset_owner_wait_state_packet_summary: motionDatasetOwnerWaitStatePacket,
          motion_dataset_readiness_non_sweetening_sweep_summary: motionDatasetReadinessNonSweeteningSweep,
          motion_dataset_planning_completion_review_packet_summary: motionDatasetPlanningCompletionReviewPacket,
          motion_dataset_owner_submission_form_spec_summary: motionDatasetOwnerSubmissionFormSpec,
          motion_dataset_real_row_redaction_policy_matrix_summary: motionDatasetRealRowRedactionPolicyMatrix,
          motion_dataset_motion_allowlist_sync_review_summary: motionDatasetMotionAllowlistSyncReview,
          motion_dataset_renderer_ready_dependency_matrix_summary: motionDatasetRendererReadyDependencyMatrix,
          renderer_ready_false_positive_dependency_surface_summary: rendererReadyFalsePositiveDependencySurface,
          renderer_ready_fixture_vs_real_separation_contract_summary: rendererReadyFixtureVsRealSeparationContract,
          renderer_ready_fresh_evidence_envelope_summary: rendererReadyFreshEvidenceEnvelope,
          renderer_ready_stale_evidence_downgrade_contract_summary: rendererReadyStaleEvidenceDowngradeContract,
          renderer_ready_evidence_source_allowlist_summary: rendererReadyEvidenceSourceAllowlist,
          renderer_ready_evidence_schema_violation_guard_summary: rendererReadyEvidenceSchemaViolationGuard,
          renderer_ready_evidence_completeness_blocker_matrix_summary: rendererReadyEvidenceCompletenessBlockerMatrix,
          renderer_ready_evidence_conflict_downgrade_contract_summary: rendererReadyEvidenceConflictDowngradeContract,
          renderer_ready_go_nogo_blocker_surface_summary: rendererReadyGoNoGoBlockerSurface,
          renderer_ready_blocker_reason_allowlist_summary: rendererReadyBlockerReasonAllowlist,
          renderer_ready_safe_next_action_catalog_summary: rendererReadySafeNextActionCatalog,
          renderer_ready_cross_surface_blocker_consistency_summary: rendererReadyCrossSurfaceBlockerConsistency,
          renderer_ready_owner_evidence_handoff_packet_stub_summary: rendererReadyOwnerEvidenceHandoffPacketStub,
          renderer_ready_owner_handoff_not_sent_guard_summary: rendererReadyOwnerHandoffNotSentGuard,
          renderer_ready_owner_handoff_redaction_guard_summary: rendererReadyOwnerHandoffRedactionGuard,
          renderer_ready_real_probe_request_stub_summary: rendererReadyRealProbeRequestStub,
          renderer_ready_real_probe_request_rejection_gate_summary: rendererReadyRealProbeRequestRejectionGate,
          renderer_ready_real_probe_preflight_blocker_matrix_summary: rendererReadyRealProbePreflightBlockerMatrix,
          renderer_ready_evidence_collector_manifest_stub_summary: rendererReadyEvidenceCollectorManifestStub,
          renderer_ready_evidence_collector_redaction_guard_summary: rendererReadyEvidenceCollectorRedactionGuard,
          renderer_ready_evidence_collector_no_execution_guard_summary: rendererReadyEvidenceCollectorNoExecutionGuard,
          renderer_ready_evidence_collector_safe_output_schema_summary: rendererReadyEvidenceCollectorSafeOutputSchema,
          renderer_ready_evidence_collector_unsafe_output_rejection_summary: rendererReadyEvidenceCollectorUnsafeOutputRejection,
          renderer_ready_public_summary_redaction_summary: rendererReadyPublicSummaryRedaction,
          renderer_ready_admin_summary_redaction_summary: rendererReadyAdminSummaryRedaction,
          renderer_ready_audit_reference_stub_summary: rendererReadyAuditReferenceStub,
          renderer_ready_audit_reference_missing_guard_summary: rendererReadyAuditReferenceMissingGuard,
          renderer_ready_safe_operator_checklist_stub_summary: rendererReadySafeOperatorChecklistStub,
          renderer_ready_safe_operator_checklist_redaction_guard_summary: rendererReadySafeOperatorChecklistRedactionGuard,
          renderer_ready_real_evidence_request_final_no_go_summary: rendererReadyRealEvidenceRequestFinalNoGo,
          renderer_ready_preflight_route_manifest_stub_summary: rendererReadyPreflightRouteManifestStub,
          renderer_ready_preflight_route_unsafe_field_guard_summary: rendererReadyPreflightRouteUnsafeFieldGuard,
          renderer_ready_owner_scope_requirement_surface_summary: rendererReadyOwnerScopeRequirementSurface,
          renderer_ready_owner_scope_missing_rejection_guard_summary: rendererReadyOwnerScopeMissingRejectionGuard,
          renderer_ready_audit_link_requirement_surface_summary: rendererReadyAuditLinkRequirementSurface,
          renderer_ready_audit_link_missing_rejection_guard_summary: rendererReadyAuditLinkMissingRejectionGuard,
          renderer_ready_trusted_loader_preauth_blocker_surface_summary: rendererReadyTrustedLoaderPreauthBlockerSurface,
          renderer_ready_trusted_loader_preauth_rejection_guard_summary: rendererReadyTrustedLoaderPreauthRejectionGuard,
          renderer_ready_runtime_readiness_final_no_go_summary: rendererReadyRuntimeReadinessFinalNoGo,
          renderer_ready_production_readiness_final_no_go_summary: rendererReadyProductionReadinessFinalNoGo,
          renderer_ready_extended_guard_completion_review_summary: rendererReadyExtendedGuardCompletionReview,
          renderer_ready_real_evidence_request_final_wait_state_summary: rendererReadyRealEvidenceRequestFinalWaitState,
          renderer_ready_real_evidence_request_rejection_fixture_pack_summary: rendererReadyRealEvidenceRequestRejectionFixturePack,
          motion_dataset_source_hash_owner_checklist_summary: motionDatasetSourceHashOwnerChecklist,
          motion_dataset_final_owner_wait_for_data_gate_summary: motionDatasetFinalOwnerWaitForDataGate,
          motion_dataset_row_file_checksum_preflight_manifest_summary: motionDatasetRowFileChecksumPreflightManifest,
          owner_action_lane_freeze_status_summary: ownerActionLaneFreezeStatus,
        motion_dataset_synthetic_row_fixture_pack_summary: motionDatasetSyntheticRowFixturePack,
        motion_dataset_row_schema_preflight_summary: motionDatasetRowSchemaPreflight,
        renderer_ready: heartbeatStatus.renderer_ready_candidate,
        last_cue_received_at: state.lastCueReceivedAt,
        last_cue_status_hash: state.lastCueHash,
        received_cue_count: state.cueCount,
        browser_delivery: {
          pending_cue_count: state.cueQueue.length,
          last_delivery_status: browserDeliveryStatus(state, heartbeatStatus),
          last_delivered_at: state.lastCueDeliveredAt,
        },
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(status, "renderer status");
      return status;
    },

    health() {
      const status = this.status();
      const health = {
        ok: true,
        schema: "iris_live2d_renderer_health_v1",
        service: "iris_live2d_renderer",
        renderer_process_alive: true,
        renderer_ready: status.renderer_ready,
        model_id: status.model_id,
        scene_id: status.scene_id,
        model3_manifest_available: status.renderer_health.model3_manifest_available,
        cubism_sdk_available: status.renderer_health.cubism_sdk_available,
        real_model_load_supported: status.renderer_health.real_model_load_supported,
        model_asset_route_available: status.renderer_health.model_asset_route_available,
        model_load_status: status.renderer_health.model_load_status,
        model_load_supported: status.renderer_health.model_load_supported,
        model_load_succeeded: status.renderer_health.model_load_succeeded,
        model_load_error_kind: status.renderer_health.model_load_error_kind,
        loader_capability_class: status.renderer_health.loader_capability_class,
        loader_dependency_status: status.renderer_health.loader_dependency_status,
        loader_candidate_kind: status.renderer_health.loader_candidate_kind,
        loader_provisioning: status.renderer_health.loader_provisioning,
        trusted_loader_evidence_status: status.renderer_health.trusted_loader_evidence_status,
        trusted_loader_kind: status.renderer_health.trusted_loader_kind,
        trusted_loader_policy_gate: status.renderer_health.trusted_loader_policy_gate,
        trusted_loader_ready_candidate: status.renderer_health.trusted_loader_ready_candidate,
        trusted_loader_error_kind: status.renderer_health.trusted_loader_error_kind,
        live2d_evidence_summary: status.renderer_health.live2d_evidence_summary,
        trusted_loader_preflight_summary: status.renderer_health.trusted_loader_preflight_summary,
        trusted_loader_enablement_gate_summary: status.renderer_health.trusted_loader_enablement_gate_summary,
        trusted_loader_owner_handoff_summary: status.renderer_health.trusted_loader_owner_handoff_summary,
        fresh_evidence_bundle_summary: status.renderer_health.fresh_evidence_bundle_summary,
        go_nogo_preflight_summary: status.renderer_health.go_nogo_preflight_summary,
        real_evidence_intake_summary: status.renderer_health.real_evidence_intake_summary,
        owner_confirmation_envelope_summary: status.renderer_health.owner_confirmation_envelope_summary,
        real_evidence_request_packet_summary: status.renderer_health.real_evidence_request_packet_summary,
        real_resident_evidence_collection_plan_summary: status.renderer_health.real_resident_evidence_collection_plan_summary,
        real_evidence_collector_manifest_summary: status.renderer_health.real_evidence_collector_manifest_summary,
        real_evidence_collector_fixture_pack_summary: status.renderer_health.real_evidence_collector_fixture_pack_summary,
        real_evidence_collector_dry_run_envelope_summary: status.renderer_health.real_evidence_collector_dry_run_envelope_summary,
        real_evidence_freshness_threshold_summary: status.renderer_health.real_evidence_freshness_threshold_summary,
        safe_evidence_summary_contract_summary: status.renderer_health.safe_evidence_summary_contract_summary,
        real_evidence_summary_intake_binding_summary: status.renderer_health.real_evidence_summary_intake_binding_summary,
        owner_confirmation_binding_summary: status.renderer_health.owner_confirmation_binding_summary,
        go_nogo_blocker_resolution_summary: status.renderer_health.go_nogo_blocker_resolution_summary,
        motion_dataset_real_row_intake_request_packet_summary: status.renderer_health.motion_dataset_real_row_intake_request_packet_summary,
        motion_dataset_real_row_intake_dry_run_validator_summary: status.renderer_health.motion_dataset_real_row_intake_dry_run_validator_summary,
        motion_dataset_real_row_intake_quarantine_envelope_summary: status.renderer_health.motion_dataset_real_row_intake_quarantine_envelope_summary,
        motion_dataset_real_row_intake_owner_handoff_packet_summary: status.renderer_health.motion_dataset_real_row_intake_owner_handoff_packet_summary,
        motion_dataset_real_row_audit_manifest_summary: status.renderer_health.motion_dataset_real_row_audit_manifest_summary,
        motion_dataset_real_row_redaction_scanner_fixture_pack_summary: status.renderer_health.motion_dataset_real_row_redaction_scanner_fixture_pack_summary,
        motion_dataset_real_row_evidence_link_manifest_summary: status.renderer_health.motion_dataset_real_row_evidence_link_manifest_summary,
        motion_dataset_real_row_go_nogo_blocker_map_summary: status.renderer_health.motion_dataset_real_row_go_nogo_blocker_map_summary,
        motion_dataset_real_row_pre_ingestion_review_packet_summary: status.renderer_health.motion_dataset_real_row_pre_ingestion_review_packet_summary,
        motion_dataset_real_row_final_dry_run_checklist_summary: status.renderer_health.motion_dataset_real_row_final_dry_run_checklist_summary,
        motion_dataset_real_row_missing_data_fail_closed_gate_summary: status.renderer_health.motion_dataset_real_row_missing_data_fail_closed_gate_summary,
        motion_dataset_owner_row_data_submission_packet_summary: status.renderer_health.motion_dataset_owner_row_data_submission_packet_summary,
        motion_dataset_owner_row_data_submission_receipt_stub_summary: status.renderer_health.motion_dataset_owner_row_data_submission_receipt_stub_summary,
        motion_dataset_owner_row_data_metadata_validator_stub_summary: status.renderer_health.motion_dataset_owner_row_data_metadata_validator_stub_summary,
        motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary: status.renderer_health.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary,
        motion_dataset_actual_data_task_entry_gate_summary: status.renderer_health.motion_dataset_actual_data_task_entry_gate_summary,
        motion_dataset_row_body_parser_contract_stub_summary: status.renderer_health.motion_dataset_row_body_parser_contract_stub_summary,
        motion_dataset_row_body_parser_rejection_fixture_pack_summary: status.renderer_health.motion_dataset_row_body_parser_rejection_fixture_pack_summary,
        motion_dataset_ingestion_audit_trail_stub_summary: status.renderer_health.motion_dataset_ingestion_audit_trail_stub_summary,
        motion_dataset_ingestion_rollback_plan_stub_summary: status.renderer_health.motion_dataset_ingestion_rollback_plan_stub_summary,
        motion_dataset_parser_dry_run_envelope_summary: status.renderer_health.motion_dataset_parser_dry_run_envelope_summary,
        motion_dataset_real_row_acceptance_criteria_checklist_summary: status.renderer_health.motion_dataset_real_row_acceptance_criteria_checklist_summary,
        motion_dataset_owner_actual_data_task_handoff_review_packet_summary: status.renderer_health.motion_dataset_owner_actual_data_task_handoff_review_packet_summary,
        motion_dataset_actual_data_no_go_summary_projection_summary: status.renderer_health.motion_dataset_actual_data_no_go_summary_projection_summary,
        motion_dataset_owner_submission_readiness_ledger_summary: status.renderer_health.motion_dataset_owner_submission_readiness_ledger_summary,
        motion_dataset_final_actual_data_preauth_blocker_gate_summary: status.renderer_health.motion_dataset_final_actual_data_preauth_blocker_gate_summary,
        motion_dataset_owner_confirmation_preflight_envelope_summary: status.renderer_health.motion_dataset_owner_confirmation_preflight_envelope_summary,
        motion_dataset_row_file_quarantine_staging_envelope_summary: status.renderer_health.motion_dataset_row_file_quarantine_staging_envelope_summary,
        motion_dataset_redaction_scan_execution_envelope_stub_summary: status.renderer_health.motion_dataset_redaction_scan_execution_envelope_stub_summary,
        motion_dataset_parser_dry_run_execution_request_envelope_summary: status.renderer_health.motion_dataset_parser_dry_run_execution_request_envelope_summary,
        motion_dataset_audit_execution_request_envelope_summary: status.renderer_health.motion_dataset_audit_execution_request_envelope_summary,
        motion_dataset_actual_data_task_runbook_no_action_packet_summary: status.renderer_health.motion_dataset_actual_data_task_runbook_no_action_packet_summary,
        motion_dataset_final_owner_actual_data_packet_summary: status.renderer_health.motion_dataset_final_owner_actual_data_packet_summary,
        motion_dataset_actual_data_freeze_state_ledger_summary: status.renderer_health.motion_dataset_actual_data_freeze_state_ledger_summary,
        motion_dataset_owner_wait_state_packet_summary: status.renderer_health.motion_dataset_owner_wait_state_packet_summary,
        motion_dataset_readiness_non_sweetening_sweep_summary: status.renderer_health.motion_dataset_readiness_non_sweetening_sweep_summary,
        motion_dataset_planning_completion_review_packet_summary: status.renderer_health.motion_dataset_planning_completion_review_packet_summary,
        motion_dataset_owner_submission_form_spec_summary: status.renderer_health.motion_dataset_owner_submission_form_spec_summary,
        motion_dataset_real_row_redaction_policy_matrix_summary: status.renderer_health.motion_dataset_real_row_redaction_policy_matrix_summary,
        motion_dataset_motion_allowlist_sync_review_summary: status.renderer_health.motion_dataset_motion_allowlist_sync_review_summary,
        motion_dataset_renderer_ready_dependency_matrix_summary: status.renderer_health.motion_dataset_renderer_ready_dependency_matrix_summary,
        renderer_ready_false_positive_dependency_surface_summary: status.renderer_health.renderer_ready_false_positive_dependency_surface_summary,
        renderer_ready_fixture_vs_real_separation_contract_summary: status.renderer_health.renderer_ready_fixture_vs_real_separation_contract_summary,
        renderer_ready_fresh_evidence_envelope_summary: status.renderer_health.renderer_ready_fresh_evidence_envelope_summary,
        renderer_ready_stale_evidence_downgrade_contract_summary: status.renderer_health.renderer_ready_stale_evidence_downgrade_contract_summary,
        renderer_ready_evidence_source_allowlist_summary: status.renderer_health.renderer_ready_evidence_source_allowlist_summary,
        renderer_ready_evidence_schema_violation_guard_summary: status.renderer_health.renderer_ready_evidence_schema_violation_guard_summary,
        renderer_ready_evidence_completeness_blocker_matrix_summary: status.renderer_health.renderer_ready_evidence_completeness_blocker_matrix_summary,
        renderer_ready_evidence_conflict_downgrade_contract_summary: status.renderer_health.renderer_ready_evidence_conflict_downgrade_contract_summary,
        renderer_ready_go_nogo_blocker_surface_summary: status.renderer_health.renderer_ready_go_nogo_blocker_surface_summary,
        renderer_ready_blocker_reason_allowlist_summary: status.renderer_health.renderer_ready_blocker_reason_allowlist_summary,
        renderer_ready_safe_next_action_catalog_summary: status.renderer_health.renderer_ready_safe_next_action_catalog_summary,
        renderer_ready_cross_surface_blocker_consistency_summary: status.renderer_health.renderer_ready_cross_surface_blocker_consistency_summary,
        renderer_ready_owner_evidence_handoff_packet_stub_summary: status.renderer_health.renderer_ready_owner_evidence_handoff_packet_stub_summary,
        renderer_ready_owner_handoff_not_sent_guard_summary: status.renderer_health.renderer_ready_owner_handoff_not_sent_guard_summary,
        renderer_ready_owner_handoff_redaction_guard_summary: status.renderer_health.renderer_ready_owner_handoff_redaction_guard_summary,
        renderer_ready_real_probe_request_stub_summary: status.renderer_health.renderer_ready_real_probe_request_stub_summary,
        renderer_ready_real_probe_request_rejection_gate_summary: status.renderer_health.renderer_ready_real_probe_request_rejection_gate_summary,
        renderer_ready_real_probe_preflight_blocker_matrix_summary: status.renderer_health.renderer_ready_real_probe_preflight_blocker_matrix_summary,
        renderer_ready_evidence_collector_manifest_stub_summary: status.renderer_health.renderer_ready_evidence_collector_manifest_stub_summary,
        renderer_ready_evidence_collector_redaction_guard_summary: status.renderer_health.renderer_ready_evidence_collector_redaction_guard_summary,
        renderer_ready_evidence_collector_no_execution_guard_summary: status.renderer_health.renderer_ready_evidence_collector_no_execution_guard_summary,
        renderer_ready_evidence_collector_safe_output_schema_summary: status.renderer_health.renderer_ready_evidence_collector_safe_output_schema_summary,
        renderer_ready_evidence_collector_unsafe_output_rejection_summary: status.renderer_health.renderer_ready_evidence_collector_unsafe_output_rejection_summary,
        renderer_ready_public_summary_redaction_summary: status.renderer_health.renderer_ready_public_summary_redaction_summary,
        renderer_ready_admin_summary_redaction_summary: status.renderer_health.renderer_ready_admin_summary_redaction_summary,
        renderer_ready_audit_reference_stub_summary: status.renderer_health.renderer_ready_audit_reference_stub_summary,
        renderer_ready_audit_reference_missing_guard_summary: status.renderer_health.renderer_ready_audit_reference_missing_guard_summary,
        renderer_ready_safe_operator_checklist_stub_summary: status.renderer_health.renderer_ready_safe_operator_checklist_stub_summary,
        renderer_ready_safe_operator_checklist_redaction_guard_summary: status.renderer_health.renderer_ready_safe_operator_checklist_redaction_guard_summary,
        renderer_ready_real_evidence_request_final_no_go_summary: status.renderer_health.renderer_ready_real_evidence_request_final_no_go_summary,
        renderer_ready_preflight_route_manifest_stub_summary: status.renderer_health.renderer_ready_preflight_route_manifest_stub_summary,
        renderer_ready_preflight_route_unsafe_field_guard_summary: status.renderer_health.renderer_ready_preflight_route_unsafe_field_guard_summary,
        renderer_ready_owner_scope_requirement_surface_summary: status.renderer_health.renderer_ready_owner_scope_requirement_surface_summary,
        renderer_ready_owner_scope_missing_rejection_guard_summary: status.renderer_health.renderer_ready_owner_scope_missing_rejection_guard_summary,
        renderer_ready_audit_link_requirement_surface_summary: status.renderer_health.renderer_ready_audit_link_requirement_surface_summary,
        renderer_ready_audit_link_missing_rejection_guard_summary: status.renderer_health.renderer_ready_audit_link_missing_rejection_guard_summary,
        renderer_ready_trusted_loader_preauth_blocker_surface_summary: status.renderer_health.renderer_ready_trusted_loader_preauth_blocker_surface_summary,
        renderer_ready_trusted_loader_preauth_rejection_guard_summary: status.renderer_health.renderer_ready_trusted_loader_preauth_rejection_guard_summary,
        renderer_ready_runtime_readiness_final_no_go_summary: status.renderer_health.renderer_ready_runtime_readiness_final_no_go_summary,
        renderer_ready_production_readiness_final_no_go_summary: status.renderer_health.renderer_ready_production_readiness_final_no_go_summary,
        renderer_ready_extended_guard_completion_review_summary: status.renderer_health.renderer_ready_extended_guard_completion_review_summary,
        renderer_ready_real_evidence_request_final_wait_state_summary: status.renderer_health.renderer_ready_real_evidence_request_final_wait_state_summary,
        renderer_ready_real_evidence_request_rejection_fixture_pack_summary: status.renderer_health.renderer_ready_real_evidence_request_rejection_fixture_pack_summary,
        motion_dataset_row_file_checksum_preflight_manifest_summary: status.renderer_health.motion_dataset_row_file_checksum_preflight_manifest_summary,
        owner_action_lane_freeze_status_summary: status.renderer_health.owner_action_lane_freeze_status_summary,
        motion_dataset_synthetic_row_fixture_pack_summary: status.renderer_health.motion_dataset_synthetic_row_fixture_pack_summary,
        motion_dataset_row_schema_preflight_summary: status.renderer_health.motion_dataset_row_schema_preflight_summary,
        cue_capability_confirmed: status.cue_capability.real_capability_confirmed,
        fresh_heartbeat: status.renderer_health.fresh_heartbeat,
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(health, "renderer health");
      return health;
    },

    acceptCue(payload, route) {
      const validation = validateRendererCueEnvelope(payload);
      const cue = validation.browserCue;
      const receivedAt = now();
      state.cueCount += 1;
      state.lastCueReceivedAt = receivedAt;
      state.lastCueSchema = safeText(validation.cueSchema, 160);
      state.lastCueHash = hashSafePayload(cue);
      state.cueQueue.push(createBrowserCueEnvelope({
        route,
        receivedAtMs: receivedAt,
        cueSchema: state.lastCueSchema,
        statusHash: state.lastCueHash,
        cue,
      }));
      if (state.cueQueue.length > MAX_BROWSER_CUE_QUEUE) state.cueQueue.shift();

      const response = {
        ok: true,
        schema: "iris_live2d_renderer_cue_acceptance_v1",
        route,
        accepted: true,
        queued_for_browser: true,
        renderer_ready: getHeartbeatStatus(state, now()).renderer_ready_candidate,
        model_id: state.modelId,
        scene_id: state.sceneId,
        last_cue_received_at: state.lastCueReceivedAt,
        cue_summary: {
          cue_schema: state.lastCueSchema,
          status_hash: state.lastCueHash,
        },
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(response, `${route} cue response`);
      return response;
    },

    readBrowserCues() {
      const heartbeatStatus = getHeartbeatStatus(state, now());
      const cues = heartbeatStatus.browser_cue_delivery_ready
        ? state.cueQueue.splice(0, state.cueQueue.length)
        : [];
      if (cues.length > 0) {
        state.lastCueDeliveredHash = cues[cues.length - 1].status_hash;
        state.lastCueDeliveredAt = now();
      }
      const response = {
        ok: true,
        schema: "iris_live2d_browser_cue_queue_v1",
        cues,
        pending_cue_count: state.cueQueue.length,
        delivery_ready: heartbeatStatus.browser_cue_delivery_ready,
        delivery_status: browserDeliveryStatus(state, heartbeatStatus),
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(response, "browser cue queue");
      return response;
    },

    browserRuntimeConfig() {
      const heartbeatStatus = getHeartbeatStatus(state, now());
      const trustedLoaderPreflight = createTrustedLoaderAllowlistPreflightSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
      });
      const trustedLoaderEnablementGate = createTrustedLoaderEnablementGateSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
      });
      const trustedLoaderOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
      });
      const freshEvidenceBundle = createFreshEvidenceBundleSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
        ownerHandoffSummary: trustedLoaderOwnerHandoff,
      });
      const goNoGoPreflight = createGoNoGoPreflightSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
        ownerHandoffSummary: trustedLoaderOwnerHandoff,
        freshEvidenceBundleSummary: freshEvidenceBundle,
      });
      const realEvidenceIntake = createRealEvidenceIntakeSummary();
      const ownerConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary();
      const realEvidenceRequestPacket = createRealEvidenceRequestPacketSummary();
      const realResidentEvidenceCollectionPlan = createRealResidentEvidenceCollectionPlanSummary();
      const realEvidenceCollectorManifest = createRealEvidenceCollectorManifestSummary();
      const realEvidenceCollectorFixturePack = createRealEvidenceCollectorFixturePackSummary({ manifestSummary: realEvidenceCollectorManifest });
      const realEvidenceCollectorDryRunEnvelope = createRealEvidenceCollectorDryRunEnvelopeSummary({
        manifestSummary: realEvidenceCollectorManifest,
        fixturePackSummary: realEvidenceCollectorFixturePack,
      });
      const realEvidenceFreshnessThreshold = createRealEvidenceFreshnessThresholdSummary();
      const safeEvidenceSummaryContract = createSafeEvidenceSummaryContractSummary();
      const realEvidenceSummaryIntakeBinding = createRealEvidenceSummaryIntakeBindingSummary();
      const ownerConfirmationBinding = createOwnerConfirmationBindingSummary();
      const goNoGoBlockerResolution = createGoNoGoBlockerResolutionSummary();
      const motionDatasetRowSchemaPreflight = createMotionDatasetRowSchemaPreflightSummary();
      const motionDatasetSyntheticRowFixturePack = createMotionDatasetSyntheticRowFixturePackSummary();
      const motionDatasetRealRowIntakeRequestPacket = createMotionDatasetRealRowIntakeRequestPacketSummary();
      const motionDatasetRealRowIntakeDryRunValidator = createMotionDatasetRealRowIntakeDryRunValidatorSummary();
      const motionDatasetRealRowIntakeQuarantineEnvelope = createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary();
      const motionDatasetRealRowIntakeOwnerHandoffPacket = createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary();
      const motionDatasetRealRowAuditManifest = createMotionDatasetRealRowAuditManifestSummary();
      const motionDatasetRealRowRedactionScannerFixturePack = createMotionDatasetRealRowRedactionScannerFixturePackSummary();
      const motionDatasetRealRowEvidenceLinkManifest = createMotionDatasetRealRowEvidenceLinkManifestSummary();
      const motionDatasetRealRowGoNoGoBlockerMap = createMotionDatasetRealRowGoNoGoBlockerMapSummary();
      const motionDatasetRealRowPreIngestionReviewPacket = createMotionDatasetRealRowPreIngestionReviewPacketSummary();
      const motionDatasetRealRowFinalDryRunChecklist = createMotionDatasetRealRowFinalDryRunChecklistSummary();
      const motionDatasetRealRowMissingDataFailClosedGate = createMotionDatasetRealRowMissingDataFailClosedGateSummary();
      const motionDatasetOwnerRowDataSubmissionPacket = createMotionDatasetOwnerRowDataSubmissionPacketSummary();
      const motionDatasetOwnerRowDataSubmissionReceiptStub = createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary();
      const motionDatasetOwnerRowDataMetadataValidatorStub = createMotionDatasetOwnerRowDataMetadataValidatorStubSummary();
      const motionDatasetOwnerRowDataSubmissionRejectionFixturePack = createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary();
      const motionDatasetActualDataTaskEntryGate = createMotionDatasetActualDataTaskEntryGateSummary();
      const motionDatasetRowBodyParserContractStub = createMotionDatasetRowBodyParserContractStubSummary();
      const motionDatasetRowBodyParserRejectionFixturePack = createMotionDatasetRowBodyParserRejectionFixturePackSummary();
      const motionDatasetIngestionAuditTrailStub = createMotionDatasetIngestionAuditTrailStubSummary();
      const motionDatasetIngestionRollbackPlanStub = createMotionDatasetIngestionRollbackPlanStubSummary();
      const motionDatasetParserDryRunEnvelope = createMotionDatasetParserDryRunEnvelopeSummary();
      const motionDatasetRealRowAcceptanceCriteriaChecklist = createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary();
      const motionDatasetOwnerActualDataTaskHandoffReviewPacket = createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary();
      const motionDatasetActualDataNoGoSummaryProjection = createMotionDatasetActualDataNoGoSummaryProjectionSummary();
      const motionDatasetOwnerSubmissionReadinessLedger = createMotionDatasetOwnerSubmissionReadinessLedgerSummary();
      const motionDatasetFinalActualDataPreauthBlockerGate = createMotionDatasetFinalActualDataPreauthBlockerGateSummary();
      const motionDatasetOwnerConfirmationPreflightEnvelope = createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary();
      const motionDatasetRowFileQuarantineStagingEnvelope = createMotionDatasetRowFileQuarantineStagingEnvelopeSummary();
      const motionDatasetRedactionScanExecutionEnvelopeStub = createMotionDatasetRedactionScanExecutionEnvelopeStubSummary();
      const motionDatasetParserDryRunExecutionRequestEnvelope = createMotionDatasetParserDryRunExecutionRequestEnvelopeSummary();
      const motionDatasetAuditExecutionRequestEnvelope = createMotionDatasetAuditExecutionRequestEnvelopeSummary();
      const motionDatasetActualDataTaskRunbookNoActionPacket = createMotionDatasetActualDataTaskRunbookNoActionPacketSummary();
      const motionDatasetFinalOwnerActualDataPacket = createMotionDatasetFinalOwnerActualDataPacketSummary();
      const motionDatasetActualDataFreezeStateLedger = createMotionDatasetActualDataFreezeStateLedgerSummary();
      const motionDatasetOwnerWaitStatePacket = createMotionDatasetOwnerWaitStatePacketSummary();
      const motionDatasetReadinessNonSweeteningSweep = createMotionDatasetReadinessNonSweeteningSweepSummary();
      const motionDatasetPlanningCompletionReviewPacket = createMotionDatasetPlanningCompletionReviewPacketSummary();
      const motionDatasetOwnerSubmissionFormSpec = createMotionDatasetOwnerSubmissionFormSpecSummary();
      const motionDatasetRealRowRedactionPolicyMatrix = createMotionDatasetRealRowRedactionPolicyMatrixSummary();
      const motionDatasetMotionAllowlistSyncReview = createMotionDatasetMotionAllowlistSyncReviewSummary();
      const motionDatasetRendererReadyDependencyMatrix = createMotionDatasetRendererReadyDependencyMatrixSummary();
      const rendererReadyFalsePositiveDependencySurface = rendererReadyFalsePositiveDependencySurfaceFromHeartbeat(heartbeatStatus);
      const rendererReadyFixtureVsRealSeparationContract = rendererReadyFixtureVsRealSeparationContractFromHeartbeat(heartbeatStatus);
      const rendererReadyFreshEvidenceEnvelope = rendererReadyFreshEvidenceEnvelopeFromHeartbeat(heartbeatStatus);
      const rendererReadyStaleEvidenceDowngradeContract = rendererReadyStaleEvidenceDowngradeContractFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceSourceAllowlist = rendererReadyEvidenceSourceAllowlistFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceSchemaViolationGuard = createRendererReadyEvidenceSchemaViolationGuardSummary();
      const rendererReadyEvidenceCompletenessBlockerMatrix = rendererReadyEvidenceCompletenessBlockerMatrixFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceConflictDowngradeContract = rendererReadyEvidenceConflictDowngradeContractFromHeartbeat(heartbeatStatus);
      const rendererReadyGoNoGoBlockerSurface = createRendererReadyGoNoGoBlockerSurfaceSummary();
      const rendererReadyBlockerReasonAllowlist = createRendererReadyBlockerReasonAllowlistSummary();
      const rendererReadySafeNextActionCatalog = createRendererReadySafeNextActionCatalogSummary();
      const rendererReadyCrossSurfaceBlockerConsistency = createRendererReadyCrossSurfaceBlockerConsistencySummary();
      const rendererReadyOwnerEvidenceHandoffPacketStub = createRendererReadyOwnerEvidenceHandoffPacketStubSummary();
      const rendererReadyOwnerHandoffNotSentGuard = createRendererReadyOwnerHandoffNotSentGuardSummary();
      const rendererReadyOwnerHandoffRedactionGuard = createRendererReadyOwnerHandoffRedactionGuardSummary();
      const rendererReadyRealProbeRequestStub = createRendererReadyRealProbeRequestStubSummary();
      const rendererReadyRealProbeRequestRejectionGate = createRendererReadyRealProbeRequestRejectionGateSummary();
      const rendererReadyRealProbePreflightBlockerMatrix = createRendererReadyRealProbePreflightBlockerMatrixSummary();
      const rendererReadyEvidenceCollectorManifestStub = createRendererReadyEvidenceCollectorManifestStubSummary();
      const rendererReadyEvidenceCollectorRedactionGuard = createRendererReadyEvidenceCollectorRedactionGuardSummary();
      const rendererReadyEvidenceCollectorNoExecutionGuard = createRendererReadyEvidenceCollectorNoExecutionGuardSummary();
      const rendererReadyEvidenceCollectorSafeOutputSchema = createRendererReadyEvidenceCollectorSafeOutputSchemaSummary();
      const rendererReadyEvidenceCollectorUnsafeOutputRejection = createRendererReadyEvidenceCollectorUnsafeOutputRejectionSummary();
      const rendererReadyPublicSummaryRedaction = createRendererReadyPublicSummaryRedactionSummary();
      const rendererReadyAdminSummaryRedaction = createRendererReadyAdminSummaryRedactionSummary();
      const rendererReadyAuditReferenceStub = createRendererReadyAuditReferenceStubSummary();
      const rendererReadyAuditReferenceMissingGuard = createRendererReadyAuditReferenceMissingGuardSummary();
      const rendererReadySafeOperatorChecklistStub = createRendererReadySafeOperatorChecklistStubSummary();
      const rendererReadySafeOperatorChecklistRedactionGuard = createRendererReadySafeOperatorChecklistRedactionGuardSummary();
      const rendererReadyRealEvidenceRequestFinalNoGo = createRendererReadyRealEvidenceRequestFinalNoGoSummary();
      const rendererReadyPreflightRouteManifestStub = createRendererReadyPreflightRouteManifestStubSummary();
      const rendererReadyPreflightRouteUnsafeFieldGuard = createRendererReadyPreflightRouteUnsafeFieldGuardSummary();
      const rendererReadyOwnerScopeRequirementSurface = createRendererReadyOwnerScopeRequirementSurfaceSummary();
      const rendererReadyOwnerScopeMissingRejectionGuard = createRendererReadyOwnerScopeMissingRejectionGuardSummary();
      const rendererReadyAuditLinkRequirementSurface = createRendererReadyAuditLinkRequirementSurfaceSummary();
      const rendererReadyAuditLinkMissingRejectionGuard = createRendererReadyAuditLinkMissingRejectionGuardSummary();
      const rendererReadyTrustedLoaderPreauthBlockerSurface = createRendererReadyTrustedLoaderPreauthBlockerSurfaceSummary();
      const rendererReadyTrustedLoaderPreauthRejectionGuard = createRendererReadyTrustedLoaderPreauthRejectionGuardSummary();
      const rendererReadyRuntimeReadinessFinalNoGo = createRendererReadyRuntimeReadinessFinalNoGoSummary();
      const rendererReadyProductionReadinessFinalNoGo = createRendererReadyProductionReadinessFinalNoGoSummary();
      const rendererReadyExtendedGuardCompletionReview = createRendererReadyExtendedGuardCompletionReviewSummary();
      const rendererReadyRealEvidenceRequestFinalWaitState = createRendererReadyRealEvidenceRequestFinalWaitStateSummary();
      const rendererReadyRealEvidenceRequestRejectionFixturePack = createRendererReadyRealEvidenceRequestRejectionFixturePackSummary();
      const motionDatasetRealRowSplitPolicyPacket = createMotionDatasetRealRowSplitPolicyPacketSummary();
      const motionDatasetSourceHashOwnerChecklist = createMotionDatasetSourceHashOwnerChecklistSummary();
      const motionDatasetFinalOwnerWaitForDataGate = createMotionDatasetFinalOwnerWaitForDataGateSummary();
      const motionDatasetRowFileChecksumPreflightManifest = createMotionDatasetRowFileChecksumPreflightManifestSummary();
      const ownerActionLaneFreezeStatus = createOwnerActionLaneFreezeStatusSummary();
      const response = createBrowserRuntimeConfig({
        modelId: state.modelId,
        sceneId: state.sceneId,
        cubismSdkConfigured: state.cubismSdkConfigured,
        cubismSdkAvailable: state.cubismSdkAvailable,
        cubismSdkStatus: state.cubismSdkStatus,
        model3ManifestConfigured: state.model3ManifestConfigured,
        model3ManifestAvailable: state.model3ManifestAvailable,
        model3ManifestStatus: state.model3ManifestStatus,
        model3BrowserLoadSupported: state.model3AssetRegistry?.available === true,
        loaderProvisioning: state.cubismLoaderProvisioning,
      });
      response.live2d_evidence_summary = heartbeatStatus.live2d_evidence_summary;
      response.trusted_loader_preflight_summary = trustedLoaderPreflight;
      response.trusted_loader_enablement_gate_summary = trustedLoaderEnablementGate;
      response.trusted_loader_owner_handoff_summary = trustedLoaderOwnerHandoff;
      response.fresh_evidence_bundle_summary = freshEvidenceBundle;
      response.go_nogo_preflight_summary = goNoGoPreflight;
      response.real_evidence_intake_summary = realEvidenceIntake;
      response.owner_confirmation_envelope_summary = ownerConfirmationEnvelope;
      response.real_evidence_request_packet_summary = realEvidenceRequestPacket;
      response.real_resident_evidence_collection_plan_summary = realResidentEvidenceCollectionPlan;
      response.real_evidence_collector_manifest_summary = realEvidenceCollectorManifest;
      response.real_evidence_collector_fixture_pack_summary = realEvidenceCollectorFixturePack;
      response.real_evidence_collector_dry_run_envelope_summary = realEvidenceCollectorDryRunEnvelope;
      response.real_evidence_freshness_threshold_summary = realEvidenceFreshnessThreshold;
      response.safe_evidence_summary_contract_summary = safeEvidenceSummaryContract;
      response.real_evidence_summary_intake_binding_summary = realEvidenceSummaryIntakeBinding;
      response.owner_confirmation_binding_summary = ownerConfirmationBinding;
      response.go_nogo_blocker_resolution_summary = goNoGoBlockerResolution;
      response.motion_dataset_real_row_intake_request_packet_summary = motionDatasetRealRowIntakeRequestPacket;
      response.motion_dataset_real_row_intake_dry_run_validator_summary = motionDatasetRealRowIntakeDryRunValidator;
      response.motion_dataset_real_row_intake_quarantine_envelope_summary = motionDatasetRealRowIntakeQuarantineEnvelope;
      response.motion_dataset_real_row_intake_owner_handoff_packet_summary = motionDatasetRealRowIntakeOwnerHandoffPacket;
      response.motion_dataset_real_row_audit_manifest_summary = motionDatasetRealRowAuditManifest;
      response.motion_dataset_real_row_redaction_scanner_fixture_pack_summary = motionDatasetRealRowRedactionScannerFixturePack;
      response.motion_dataset_real_row_evidence_link_manifest_summary = motionDatasetRealRowEvidenceLinkManifest;
      response.motion_dataset_real_row_go_nogo_blocker_map_summary = motionDatasetRealRowGoNoGoBlockerMap;
      response.motion_dataset_real_row_pre_ingestion_review_packet_summary = motionDatasetRealRowPreIngestionReviewPacket;
      response.motion_dataset_real_row_final_dry_run_checklist_summary = motionDatasetRealRowFinalDryRunChecklist;
      response.motion_dataset_real_row_missing_data_fail_closed_gate_summary = motionDatasetRealRowMissingDataFailClosedGate;
      response.motion_dataset_owner_row_data_submission_packet_summary = motionDatasetOwnerRowDataSubmissionPacket;
      response.motion_dataset_owner_row_data_submission_receipt_stub_summary = motionDatasetOwnerRowDataSubmissionReceiptStub;
      response.motion_dataset_owner_row_data_metadata_validator_stub_summary = motionDatasetOwnerRowDataMetadataValidatorStub;
      response.motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary = motionDatasetOwnerRowDataSubmissionRejectionFixturePack;
      response.motion_dataset_actual_data_task_entry_gate_summary = motionDatasetActualDataTaskEntryGate;
      response.motion_dataset_row_body_parser_contract_stub_summary = motionDatasetRowBodyParserContractStub;
      response.motion_dataset_row_body_parser_rejection_fixture_pack_summary = motionDatasetRowBodyParserRejectionFixturePack;
      response.motion_dataset_ingestion_audit_trail_stub_summary = motionDatasetIngestionAuditTrailStub;
      response.motion_dataset_ingestion_rollback_plan_stub_summary = motionDatasetIngestionRollbackPlanStub;
      response.motion_dataset_parser_dry_run_envelope_summary = motionDatasetParserDryRunEnvelope;
      response.motion_dataset_real_row_acceptance_criteria_checklist_summary = motionDatasetRealRowAcceptanceCriteriaChecklist;
      response.motion_dataset_owner_actual_data_task_handoff_review_packet_summary = motionDatasetOwnerActualDataTaskHandoffReviewPacket;
      response.motion_dataset_actual_data_no_go_summary_projection_summary = motionDatasetActualDataNoGoSummaryProjection;
      response.motion_dataset_owner_submission_readiness_ledger_summary = motionDatasetOwnerSubmissionReadinessLedger;
      response.motion_dataset_final_actual_data_preauth_blocker_gate_summary = motionDatasetFinalActualDataPreauthBlockerGate;
      response.motion_dataset_owner_confirmation_preflight_envelope_summary = motionDatasetOwnerConfirmationPreflightEnvelope;
      response.motion_dataset_row_file_quarantine_staging_envelope_summary = motionDatasetRowFileQuarantineStagingEnvelope;
      response.motion_dataset_redaction_scan_execution_envelope_stub_summary = motionDatasetRedactionScanExecutionEnvelopeStub;
      response.motion_dataset_parser_dry_run_execution_request_envelope_summary = motionDatasetParserDryRunExecutionRequestEnvelope;
      response.motion_dataset_audit_execution_request_envelope_summary = motionDatasetAuditExecutionRequestEnvelope;
      response.motion_dataset_actual_data_task_runbook_no_action_packet_summary = motionDatasetActualDataTaskRunbookNoActionPacket;
      response.motion_dataset_final_owner_actual_data_packet_summary = motionDatasetFinalOwnerActualDataPacket;
      response.motion_dataset_actual_data_freeze_state_ledger_summary = motionDatasetActualDataFreezeStateLedger;
      response.motion_dataset_owner_wait_state_packet_summary = motionDatasetOwnerWaitStatePacket;
      response.motion_dataset_readiness_non_sweetening_sweep_summary = motionDatasetReadinessNonSweeteningSweep;
      response.motion_dataset_planning_completion_review_packet_summary = motionDatasetPlanningCompletionReviewPacket;
      response.motion_dataset_owner_submission_form_spec_summary = motionDatasetOwnerSubmissionFormSpec;
      response.motion_dataset_real_row_redaction_policy_matrix_summary = motionDatasetRealRowRedactionPolicyMatrix;
      response.motion_dataset_motion_allowlist_sync_review_summary = motionDatasetMotionAllowlistSyncReview;
      response.motion_dataset_renderer_ready_dependency_matrix_summary = motionDatasetRendererReadyDependencyMatrix;
      response.renderer_ready_false_positive_dependency_surface_summary = rendererReadyFalsePositiveDependencySurface;
      response.renderer_ready_fixture_vs_real_separation_contract_summary = rendererReadyFixtureVsRealSeparationContract;
      response.renderer_ready_fresh_evidence_envelope_summary = rendererReadyFreshEvidenceEnvelope;
      response.renderer_ready_stale_evidence_downgrade_contract_summary = rendererReadyStaleEvidenceDowngradeContract;
      response.renderer_ready_evidence_source_allowlist_summary = rendererReadyEvidenceSourceAllowlist;
      response.renderer_ready_evidence_schema_violation_guard_summary = rendererReadyEvidenceSchemaViolationGuard;
      response.renderer_ready_evidence_completeness_blocker_matrix_summary = rendererReadyEvidenceCompletenessBlockerMatrix;
      response.renderer_ready_evidence_conflict_downgrade_contract_summary = rendererReadyEvidenceConflictDowngradeContract;
      response.renderer_ready_go_nogo_blocker_surface_summary = rendererReadyGoNoGoBlockerSurface;
      response.renderer_ready_blocker_reason_allowlist_summary = rendererReadyBlockerReasonAllowlist;
      response.renderer_ready_safe_next_action_catalog_summary = rendererReadySafeNextActionCatalog;
      response.renderer_ready_cross_surface_blocker_consistency_summary = rendererReadyCrossSurfaceBlockerConsistency;
      response.renderer_ready_owner_evidence_handoff_packet_stub_summary = rendererReadyOwnerEvidenceHandoffPacketStub;
      response.renderer_ready_owner_handoff_not_sent_guard_summary = rendererReadyOwnerHandoffNotSentGuard;
      response.renderer_ready_owner_handoff_redaction_guard_summary = rendererReadyOwnerHandoffRedactionGuard;
      response.renderer_ready_real_probe_request_stub_summary = rendererReadyRealProbeRequestStub;
      response.renderer_ready_real_probe_request_rejection_gate_summary = rendererReadyRealProbeRequestRejectionGate;
      response.renderer_ready_real_probe_preflight_blocker_matrix_summary = rendererReadyRealProbePreflightBlockerMatrix;
      response.renderer_ready_evidence_collector_manifest_stub_summary = rendererReadyEvidenceCollectorManifestStub;
      response.renderer_ready_evidence_collector_redaction_guard_summary = rendererReadyEvidenceCollectorRedactionGuard;
      response.renderer_ready_evidence_collector_no_execution_guard_summary = rendererReadyEvidenceCollectorNoExecutionGuard;
      response.renderer_ready_evidence_collector_safe_output_schema_summary = rendererReadyEvidenceCollectorSafeOutputSchema;
      response.renderer_ready_evidence_collector_unsafe_output_rejection_summary = rendererReadyEvidenceCollectorUnsafeOutputRejection;
      response.renderer_ready_public_summary_redaction_summary = rendererReadyPublicSummaryRedaction;
      response.renderer_ready_admin_summary_redaction_summary = rendererReadyAdminSummaryRedaction;
      response.renderer_ready_audit_reference_stub_summary = rendererReadyAuditReferenceStub;
      response.renderer_ready_audit_reference_missing_guard_summary = rendererReadyAuditReferenceMissingGuard;
      response.renderer_ready_safe_operator_checklist_stub_summary = rendererReadySafeOperatorChecklistStub;
      response.renderer_ready_safe_operator_checklist_redaction_guard_summary = rendererReadySafeOperatorChecklistRedactionGuard;
      response.renderer_ready_real_evidence_request_final_no_go_summary = rendererReadyRealEvidenceRequestFinalNoGo;
      response.renderer_ready_preflight_route_manifest_stub_summary = rendererReadyPreflightRouteManifestStub;
      response.renderer_ready_preflight_route_unsafe_field_guard_summary = rendererReadyPreflightRouteUnsafeFieldGuard;
      response.renderer_ready_owner_scope_requirement_surface_summary = rendererReadyOwnerScopeRequirementSurface;
      response.renderer_ready_owner_scope_missing_rejection_guard_summary = rendererReadyOwnerScopeMissingRejectionGuard;
      response.renderer_ready_audit_link_requirement_surface_summary = rendererReadyAuditLinkRequirementSurface;
      response.renderer_ready_audit_link_missing_rejection_guard_summary = rendererReadyAuditLinkMissingRejectionGuard;
      response.renderer_ready_trusted_loader_preauth_blocker_surface_summary = rendererReadyTrustedLoaderPreauthBlockerSurface;
      response.renderer_ready_trusted_loader_preauth_rejection_guard_summary = rendererReadyTrustedLoaderPreauthRejectionGuard;
      response.renderer_ready_runtime_readiness_final_no_go_summary = rendererReadyRuntimeReadinessFinalNoGo;
      response.renderer_ready_production_readiness_final_no_go_summary = rendererReadyProductionReadinessFinalNoGo;
      response.renderer_ready_extended_guard_completion_review_summary = rendererReadyExtendedGuardCompletionReview;
      response.renderer_ready_real_evidence_request_final_wait_state_summary = rendererReadyRealEvidenceRequestFinalWaitState;
      response.renderer_ready_real_evidence_request_rejection_fixture_pack_summary = rendererReadyRealEvidenceRequestRejectionFixturePack;
      response.motion_dataset_real_row_split_policy_packet_summary = motionDatasetRealRowSplitPolicyPacket;
      response.motion_dataset_source_hash_owner_checklist_summary = motionDatasetSourceHashOwnerChecklist;
      response.motion_dataset_final_owner_wait_for_data_gate_summary = motionDatasetFinalOwnerWaitForDataGate;
      response.motion_dataset_row_file_checksum_preflight_manifest_summary = motionDatasetRowFileChecksumPreflightManifest;
      response.owner_action_lane_freeze_status_summary = ownerActionLaneFreezeStatus;
      response.motion_dataset_synthetic_row_fixture_pack_summary = motionDatasetSyntheticRowFixturePack;
      response.motion_dataset_row_schema_preflight_summary = motionDatasetRowSchemaPreflight;
      assertSafePublicObject(response, "browser runtime config");
      return response;
    },

    browserModel3Manifest() {
      if (!state.model3AssetRegistry?.available) return null;
      const response = {
        ok: true,
        schema: "iris_live2d_safe_model3_manifest_response_v1",
        load_route: "renderer_model3_manifest",
        asset_route: "renderer_model_asset",
        manifest: state.model3AssetRegistry.sanitizedManifest,
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(response, "browser model3 manifest");
      return response;
    },

    resolveModelAsset(assetId) {
      return resolveSafeModelAsset(state.model3AssetRegistry, assetId);
    },

    cubismCoreScriptCandidate() {
      return {
        configured: state.cubismCoreJsPath !== "",
        available: state.cubismSdkAvailable,
        candidate: state.cubismCoreJsPath,
      };
    },

    acceptBrowserHeartbeat(payload) {
      assertSafeInput(payload, "browser heartbeat");
      state.lastHeartbeat = payload;
      const heartbeatStatus = getHeartbeatStatus(state, now());
      const trustedLoaderPreflight = createTrustedLoaderAllowlistPreflightSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
      });
      const trustedLoaderEnablementGate = createTrustedLoaderEnablementGateSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
      });
      const trustedLoaderOwnerHandoff = createTrustedLoaderOwnerHandoffSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
      });
      const freshEvidenceBundle = createFreshEvidenceBundleSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
        ownerHandoffSummary: trustedLoaderOwnerHandoff,
      });
      const goNoGoPreflight = createGoNoGoPreflightSummary({
        loaderProvisioning: state.cubismLoaderProvisioning,
        live2dEvidenceSummary: heartbeatStatus.live2d_evidence_summary,
        allowlistPreflightSummary: trustedLoaderPreflight,
        enablementGateSummary: trustedLoaderEnablementGate,
        ownerHandoffSummary: trustedLoaderOwnerHandoff,
        freshEvidenceBundleSummary: freshEvidenceBundle,
      });
      const realEvidenceIntake = createRealEvidenceIntakeSummary();
      const ownerConfirmationEnvelope = createOwnerConfirmationEnvelopeSummary();
      const realEvidenceRequestPacket = createRealEvidenceRequestPacketSummary();
      const realResidentEvidenceCollectionPlan = createRealResidentEvidenceCollectionPlanSummary();
      const realEvidenceCollectorManifest = createRealEvidenceCollectorManifestSummary();
      const realEvidenceCollectorFixturePack = createRealEvidenceCollectorFixturePackSummary({ manifestSummary: realEvidenceCollectorManifest });
      const realEvidenceCollectorDryRunEnvelope = createRealEvidenceCollectorDryRunEnvelopeSummary({
        manifestSummary: realEvidenceCollectorManifest,
        fixturePackSummary: realEvidenceCollectorFixturePack,
      });
      const realEvidenceFreshnessThreshold = createRealEvidenceFreshnessThresholdSummary();
      const safeEvidenceSummaryContract = createSafeEvidenceSummaryContractSummary();
      const realEvidenceSummaryIntakeBinding = createRealEvidenceSummaryIntakeBindingSummary();
      const ownerConfirmationBinding = createOwnerConfirmationBindingSummary();
      const goNoGoBlockerResolution = createGoNoGoBlockerResolutionSummary();
      const motionDatasetRowSchemaPreflight = createMotionDatasetRowSchemaPreflightSummary();
      const motionDatasetSyntheticRowFixturePack = createMotionDatasetSyntheticRowFixturePackSummary();
      const motionDatasetRealRowIntakeRequestPacket = createMotionDatasetRealRowIntakeRequestPacketSummary();
      const motionDatasetRealRowIntakeDryRunValidator = createMotionDatasetRealRowIntakeDryRunValidatorSummary();
      const motionDatasetRealRowIntakeQuarantineEnvelope = createMotionDatasetRealRowIntakeQuarantineEnvelopeSummary();
      const motionDatasetRealRowIntakeOwnerHandoffPacket = createMotionDatasetRealRowIntakeOwnerHandoffPacketSummary();
      const motionDatasetRealRowAuditManifest = createMotionDatasetRealRowAuditManifestSummary();
      const motionDatasetRealRowRedactionScannerFixturePack = createMotionDatasetRealRowRedactionScannerFixturePackSummary();
      const motionDatasetRealRowEvidenceLinkManifest = createMotionDatasetRealRowEvidenceLinkManifestSummary();
      const motionDatasetRealRowGoNoGoBlockerMap = createMotionDatasetRealRowGoNoGoBlockerMapSummary();
      const motionDatasetRealRowPreIngestionReviewPacket = createMotionDatasetRealRowPreIngestionReviewPacketSummary();
      const motionDatasetRealRowFinalDryRunChecklist = createMotionDatasetRealRowFinalDryRunChecklistSummary();
      const motionDatasetRealRowMissingDataFailClosedGate = createMotionDatasetRealRowMissingDataFailClosedGateSummary();
      const motionDatasetOwnerRowDataSubmissionPacket = createMotionDatasetOwnerRowDataSubmissionPacketSummary();
      const motionDatasetOwnerRowDataSubmissionReceiptStub = createMotionDatasetOwnerRowDataSubmissionReceiptStubSummary();
      const motionDatasetOwnerRowDataMetadataValidatorStub = createMotionDatasetOwnerRowDataMetadataValidatorStubSummary();
      const motionDatasetOwnerRowDataSubmissionRejectionFixturePack = createMotionDatasetOwnerRowDataSubmissionRejectionFixturePackSummary();
      const motionDatasetActualDataTaskEntryGate = createMotionDatasetActualDataTaskEntryGateSummary();
      const motionDatasetRowBodyParserContractStub = createMotionDatasetRowBodyParserContractStubSummary();
      const motionDatasetRowBodyParserRejectionFixturePack = createMotionDatasetRowBodyParserRejectionFixturePackSummary();
      const motionDatasetIngestionAuditTrailStub = createMotionDatasetIngestionAuditTrailStubSummary();
      const motionDatasetIngestionRollbackPlanStub = createMotionDatasetIngestionRollbackPlanStubSummary();
      const motionDatasetParserDryRunEnvelope = createMotionDatasetParserDryRunEnvelopeSummary();
      const motionDatasetRealRowAcceptanceCriteriaChecklist = createMotionDatasetRealRowAcceptanceCriteriaChecklistSummary();
      const motionDatasetOwnerActualDataTaskHandoffReviewPacket = createMotionDatasetOwnerActualDataTaskHandoffReviewPacketSummary();
      const motionDatasetActualDataNoGoSummaryProjection = createMotionDatasetActualDataNoGoSummaryProjectionSummary();
      const motionDatasetOwnerSubmissionReadinessLedger = createMotionDatasetOwnerSubmissionReadinessLedgerSummary();
      const motionDatasetFinalActualDataPreauthBlockerGate = createMotionDatasetFinalActualDataPreauthBlockerGateSummary();
      const motionDatasetOwnerConfirmationPreflightEnvelope = createMotionDatasetOwnerConfirmationPreflightEnvelopeSummary();
      const motionDatasetRowFileQuarantineStagingEnvelope = createMotionDatasetRowFileQuarantineStagingEnvelopeSummary();
      const motionDatasetRedactionScanExecutionEnvelopeStub = createMotionDatasetRedactionScanExecutionEnvelopeStubSummary();
      const motionDatasetParserDryRunExecutionRequestEnvelope = createMotionDatasetParserDryRunExecutionRequestEnvelopeSummary();
      const motionDatasetAuditExecutionRequestEnvelope = createMotionDatasetAuditExecutionRequestEnvelopeSummary();
      const motionDatasetActualDataTaskRunbookNoActionPacket = createMotionDatasetActualDataTaskRunbookNoActionPacketSummary();
      const motionDatasetFinalOwnerActualDataPacket = createMotionDatasetFinalOwnerActualDataPacketSummary();
      const motionDatasetActualDataFreezeStateLedger = createMotionDatasetActualDataFreezeStateLedgerSummary();
      const motionDatasetOwnerWaitStatePacket = createMotionDatasetOwnerWaitStatePacketSummary();
      const motionDatasetReadinessNonSweeteningSweep = createMotionDatasetReadinessNonSweeteningSweepSummary();
      const motionDatasetPlanningCompletionReviewPacket = createMotionDatasetPlanningCompletionReviewPacketSummary();
      const motionDatasetOwnerSubmissionFormSpec = createMotionDatasetOwnerSubmissionFormSpecSummary();
      const motionDatasetRealRowRedactionPolicyMatrix = createMotionDatasetRealRowRedactionPolicyMatrixSummary();
      const motionDatasetMotionAllowlistSyncReview = createMotionDatasetMotionAllowlistSyncReviewSummary();
      const motionDatasetRendererReadyDependencyMatrix = createMotionDatasetRendererReadyDependencyMatrixSummary();
      const rendererReadyFalsePositiveDependencySurface = rendererReadyFalsePositiveDependencySurfaceFromHeartbeat(heartbeatStatus);
      const rendererReadyFixtureVsRealSeparationContract = rendererReadyFixtureVsRealSeparationContractFromHeartbeat(heartbeatStatus);
      const rendererReadyFreshEvidenceEnvelope = rendererReadyFreshEvidenceEnvelopeFromHeartbeat(heartbeatStatus);
      const rendererReadyStaleEvidenceDowngradeContract = rendererReadyStaleEvidenceDowngradeContractFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceSourceAllowlist = rendererReadyEvidenceSourceAllowlistFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceSchemaViolationGuard = createRendererReadyEvidenceSchemaViolationGuardSummary();
      const rendererReadyEvidenceCompletenessBlockerMatrix = rendererReadyEvidenceCompletenessBlockerMatrixFromHeartbeat(heartbeatStatus);
      const rendererReadyEvidenceConflictDowngradeContract = rendererReadyEvidenceConflictDowngradeContractFromHeartbeat(heartbeatStatus);
      const rendererReadyGoNoGoBlockerSurface = createRendererReadyGoNoGoBlockerSurfaceSummary();
      const rendererReadyBlockerReasonAllowlist = createRendererReadyBlockerReasonAllowlistSummary();
      const rendererReadySafeNextActionCatalog = createRendererReadySafeNextActionCatalogSummary();
      const rendererReadyCrossSurfaceBlockerConsistency = createRendererReadyCrossSurfaceBlockerConsistencySummary();
      const rendererReadyOwnerEvidenceHandoffPacketStub = createRendererReadyOwnerEvidenceHandoffPacketStubSummary();
      const rendererReadyOwnerHandoffNotSentGuard = createRendererReadyOwnerHandoffNotSentGuardSummary();
      const rendererReadyOwnerHandoffRedactionGuard = createRendererReadyOwnerHandoffRedactionGuardSummary();
      const rendererReadyRealProbeRequestStub = createRendererReadyRealProbeRequestStubSummary();
      const rendererReadyRealProbeRequestRejectionGate = createRendererReadyRealProbeRequestRejectionGateSummary();
      const rendererReadyRealProbePreflightBlockerMatrix = createRendererReadyRealProbePreflightBlockerMatrixSummary();
      const rendererReadyEvidenceCollectorManifestStub = createRendererReadyEvidenceCollectorManifestStubSummary();
      const rendererReadyEvidenceCollectorRedactionGuard = createRendererReadyEvidenceCollectorRedactionGuardSummary();
      const rendererReadyEvidenceCollectorNoExecutionGuard = createRendererReadyEvidenceCollectorNoExecutionGuardSummary();
      const rendererReadyEvidenceCollectorSafeOutputSchema = createRendererReadyEvidenceCollectorSafeOutputSchemaSummary();
      const rendererReadyEvidenceCollectorUnsafeOutputRejection = createRendererReadyEvidenceCollectorUnsafeOutputRejectionSummary();
      const rendererReadyPublicSummaryRedaction = createRendererReadyPublicSummaryRedactionSummary();
      const rendererReadyAdminSummaryRedaction = createRendererReadyAdminSummaryRedactionSummary();
      const rendererReadyAuditReferenceStub = createRendererReadyAuditReferenceStubSummary();
      const rendererReadyAuditReferenceMissingGuard = createRendererReadyAuditReferenceMissingGuardSummary();
      const rendererReadySafeOperatorChecklistStub = createRendererReadySafeOperatorChecklistStubSummary();
      const rendererReadySafeOperatorChecklistRedactionGuard = createRendererReadySafeOperatorChecklistRedactionGuardSummary();
      const rendererReadyRealEvidenceRequestFinalNoGo = createRendererReadyRealEvidenceRequestFinalNoGoSummary();
      const rendererReadyPreflightRouteManifestStub = createRendererReadyPreflightRouteManifestStubSummary();
      const rendererReadyPreflightRouteUnsafeFieldGuard = createRendererReadyPreflightRouteUnsafeFieldGuardSummary();
      const rendererReadyOwnerScopeRequirementSurface = createRendererReadyOwnerScopeRequirementSurfaceSummary();
      const rendererReadyOwnerScopeMissingRejectionGuard = createRendererReadyOwnerScopeMissingRejectionGuardSummary();
      const rendererReadyAuditLinkRequirementSurface = createRendererReadyAuditLinkRequirementSurfaceSummary();
      const rendererReadyAuditLinkMissingRejectionGuard = createRendererReadyAuditLinkMissingRejectionGuardSummary();
      const rendererReadyTrustedLoaderPreauthBlockerSurface = createRendererReadyTrustedLoaderPreauthBlockerSurfaceSummary();
      const rendererReadyTrustedLoaderPreauthRejectionGuard = createRendererReadyTrustedLoaderPreauthRejectionGuardSummary();
      const rendererReadyRuntimeReadinessFinalNoGo = createRendererReadyRuntimeReadinessFinalNoGoSummary();
      const rendererReadyProductionReadinessFinalNoGo = createRendererReadyProductionReadinessFinalNoGoSummary();
      const rendererReadyExtendedGuardCompletionReview = createRendererReadyExtendedGuardCompletionReviewSummary();
      const rendererReadyRealEvidenceRequestFinalWaitState = createRendererReadyRealEvidenceRequestFinalWaitStateSummary();
      const rendererReadyRealEvidenceRequestRejectionFixturePack = createRendererReadyRealEvidenceRequestRejectionFixturePackSummary();
      const motionDatasetRealRowSplitPolicyPacket = createMotionDatasetRealRowSplitPolicyPacketSummary();
      const motionDatasetSourceHashOwnerChecklist = createMotionDatasetSourceHashOwnerChecklistSummary();
      const motionDatasetFinalOwnerWaitForDataGate = createMotionDatasetFinalOwnerWaitForDataGateSummary();
      const motionDatasetRowFileChecksumPreflightManifest = createMotionDatasetRowFileChecksumPreflightManifestSummary();
      const response = {
        ok: true,
        schema: "iris_live2d_browser_heartbeat_ack_v1",
        accepted: true,
        renderer_ready: heartbeatStatus.renderer_ready_candidate,
        renderer_health: {
          cubism_sdk_loaded: heartbeatStatus.cubism_runtime_loaded,
          cubism_sdk_available: heartbeatStatus.cubism_sdk_available,
          real_model_load_supported: heartbeatStatus.real_model_load_supported,
          model_asset_route_available: heartbeatStatus.model_asset_route_available,
          model_load_status: heartbeatStatus.model_load_status,
          model_load_supported: heartbeatStatus.model_load_supported,
          model_load_attempted: heartbeatStatus.model_load_attempted,
          model_load_succeeded: heartbeatStatus.model_load_succeeded,
          model_load_error_kind: heartbeatStatus.model_load_error_kind,
          loader_capability_class: heartbeatStatus.loader_capability_class,
          loader_dependency_status: heartbeatStatus.loader_dependency_status,
          loader_candidate_kind: heartbeatStatus.loader_candidate_kind,
          loader_provisioning: state.cubismLoaderProvisioning,
          trusted_loader_evidence_status: heartbeatStatus.trusted_loader_evidence_status,
          trusted_loader_kind: heartbeatStatus.trusted_loader_kind,
          trusted_loader_policy_gate: heartbeatStatus.trusted_loader_policy_gate,
          trusted_loader_ready_candidate: heartbeatStatus.trusted_loader_ready_candidate,
          trusted_loader_error_kind: heartbeatStatus.trusted_loader_error_kind,
          model_loaded: heartbeatStatus.model_loaded,
          scene_loaded: heartbeatStatus.scene_loaded,
          model_loaded_claimed: heartbeatStatus.model_loaded_claimed,
          scene_loaded_claimed: heartbeatStatus.scene_loaded_claimed,
          real_model_loaded_claimed: heartbeatStatus.real_model_loaded_claimed,
          real_scene_loaded_claimed: heartbeatStatus.real_scene_loaded_claimed,
          fresh_heartbeat: heartbeatStatus.heartbeat_fresh,
          model_matches: heartbeatStatus.model_matches,
          scene_matches: heartbeatStatus.scene_matches,
          browser_cue_delivery_ready: heartbeatStatus.browser_cue_delivery_ready,
          cue_capability_confirmed: heartbeatStatus.cue_capability_confirmed,
          last_cue_applied: heartbeatStatus.last_cue_applied,
          last_cue_applied_at: heartbeatStatus.last_cue_applied_at,
          live2d_evidence_summary: heartbeatStatus.live2d_evidence_summary,
          trusted_loader_preflight_summary: trustedLoaderPreflight,
          trusted_loader_enablement_gate_summary: trustedLoaderEnablementGate,
          trusted_loader_owner_handoff_summary: trustedLoaderOwnerHandoff,
          fresh_evidence_bundle_summary: freshEvidenceBundle,
          go_nogo_preflight_summary: goNoGoPreflight,
          real_evidence_intake_summary: realEvidenceIntake,
          owner_confirmation_envelope_summary: ownerConfirmationEnvelope,
          real_evidence_request_packet_summary: realEvidenceRequestPacket,
          real_resident_evidence_collection_plan_summary: realResidentEvidenceCollectionPlan,
          real_evidence_collector_manifest_summary: realEvidenceCollectorManifest,
          real_evidence_collector_fixture_pack_summary: realEvidenceCollectorFixturePack,
          real_evidence_collector_dry_run_envelope_summary: realEvidenceCollectorDryRunEnvelope,
          real_evidence_freshness_threshold_summary: realEvidenceFreshnessThreshold,
          safe_evidence_summary_contract_summary: safeEvidenceSummaryContract,
          real_evidence_summary_intake_binding_summary: realEvidenceSummaryIntakeBinding,
          owner_confirmation_binding_summary: ownerConfirmationBinding,
          go_nogo_blocker_resolution_summary: goNoGoBlockerResolution,
          motion_dataset_real_row_intake_request_packet_summary: motionDatasetRealRowIntakeRequestPacket,
          motion_dataset_real_row_intake_dry_run_validator_summary: motionDatasetRealRowIntakeDryRunValidator,
          motion_dataset_real_row_intake_quarantine_envelope_summary: motionDatasetRealRowIntakeQuarantineEnvelope,
          motion_dataset_real_row_intake_owner_handoff_packet_summary: motionDatasetRealRowIntakeOwnerHandoffPacket,
          motion_dataset_real_row_audit_manifest_summary: motionDatasetRealRowAuditManifest,
          motion_dataset_real_row_redaction_scanner_fixture_pack_summary: motionDatasetRealRowRedactionScannerFixturePack,
          motion_dataset_real_row_evidence_link_manifest_summary: motionDatasetRealRowEvidenceLinkManifest,
          motion_dataset_real_row_go_nogo_blocker_map_summary: motionDatasetRealRowGoNoGoBlockerMap,
          motion_dataset_real_row_pre_ingestion_review_packet_summary: motionDatasetRealRowPreIngestionReviewPacket,
          motion_dataset_real_row_final_dry_run_checklist_summary: motionDatasetRealRowFinalDryRunChecklist,
          motion_dataset_real_row_missing_data_fail_closed_gate_summary: motionDatasetRealRowMissingDataFailClosedGate,
          motion_dataset_owner_row_data_submission_packet_summary: motionDatasetOwnerRowDataSubmissionPacket,
          motion_dataset_owner_row_data_submission_receipt_stub_summary: motionDatasetOwnerRowDataSubmissionReceiptStub,
          motion_dataset_owner_row_data_metadata_validator_stub_summary: motionDatasetOwnerRowDataMetadataValidatorStub,
          motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary: motionDatasetOwnerRowDataSubmissionRejectionFixturePack,
          motion_dataset_actual_data_task_entry_gate_summary: motionDatasetActualDataTaskEntryGate,
          motion_dataset_row_body_parser_contract_stub_summary: motionDatasetRowBodyParserContractStub,
          motion_dataset_row_body_parser_rejection_fixture_pack_summary: motionDatasetRowBodyParserRejectionFixturePack,
          motion_dataset_ingestion_audit_trail_stub_summary: motionDatasetIngestionAuditTrailStub,
          motion_dataset_ingestion_rollback_plan_stub_summary: motionDatasetIngestionRollbackPlanStub,
          motion_dataset_parser_dry_run_envelope_summary: motionDatasetParserDryRunEnvelope,
          motion_dataset_real_row_acceptance_criteria_checklist_summary: motionDatasetRealRowAcceptanceCriteriaChecklist,
          motion_dataset_owner_actual_data_task_handoff_review_packet_summary: motionDatasetOwnerActualDataTaskHandoffReviewPacket,
          motion_dataset_actual_data_no_go_summary_projection_summary: motionDatasetActualDataNoGoSummaryProjection,
          motion_dataset_owner_submission_readiness_ledger_summary: motionDatasetOwnerSubmissionReadinessLedger,
          motion_dataset_final_actual_data_preauth_blocker_gate_summary: motionDatasetFinalActualDataPreauthBlockerGate,
          motion_dataset_owner_confirmation_preflight_envelope_summary: motionDatasetOwnerConfirmationPreflightEnvelope,
          motion_dataset_row_file_quarantine_staging_envelope_summary: motionDatasetRowFileQuarantineStagingEnvelope,
          motion_dataset_redaction_scan_execution_envelope_stub_summary: motionDatasetRedactionScanExecutionEnvelopeStub,
          motion_dataset_parser_dry_run_execution_request_envelope_summary: motionDatasetParserDryRunExecutionRequestEnvelope,
          motion_dataset_audit_execution_request_envelope_summary: motionDatasetAuditExecutionRequestEnvelope,
          motion_dataset_actual_data_task_runbook_no_action_packet_summary: motionDatasetActualDataTaskRunbookNoActionPacket,
          motion_dataset_final_owner_actual_data_packet_summary: motionDatasetFinalOwnerActualDataPacket,
          motion_dataset_actual_data_freeze_state_ledger_summary: motionDatasetActualDataFreezeStateLedger,
          motion_dataset_owner_wait_state_packet_summary: motionDatasetOwnerWaitStatePacket,
          motion_dataset_readiness_non_sweetening_sweep_summary: motionDatasetReadinessNonSweeteningSweep,
          motion_dataset_planning_completion_review_packet_summary: motionDatasetPlanningCompletionReviewPacket,
          motion_dataset_owner_submission_form_spec_summary: motionDatasetOwnerSubmissionFormSpec,
          motion_dataset_real_row_redaction_policy_matrix_summary: motionDatasetRealRowRedactionPolicyMatrix,
          motion_dataset_motion_allowlist_sync_review_summary: motionDatasetMotionAllowlistSyncReview,
          motion_dataset_renderer_ready_dependency_matrix_summary: motionDatasetRendererReadyDependencyMatrix,
          renderer_ready_false_positive_dependency_surface_summary: rendererReadyFalsePositiveDependencySurface,
          renderer_ready_fixture_vs_real_separation_contract_summary: rendererReadyFixtureVsRealSeparationContract,
          renderer_ready_fresh_evidence_envelope_summary: rendererReadyFreshEvidenceEnvelope,
          renderer_ready_stale_evidence_downgrade_contract_summary: rendererReadyStaleEvidenceDowngradeContract,
          renderer_ready_evidence_source_allowlist_summary: rendererReadyEvidenceSourceAllowlist,
          renderer_ready_evidence_schema_violation_guard_summary: rendererReadyEvidenceSchemaViolationGuard,
          renderer_ready_evidence_completeness_blocker_matrix_summary: rendererReadyEvidenceCompletenessBlockerMatrix,
          renderer_ready_evidence_conflict_downgrade_contract_summary: rendererReadyEvidenceConflictDowngradeContract,
          renderer_ready_go_nogo_blocker_surface_summary: rendererReadyGoNoGoBlockerSurface,
          renderer_ready_blocker_reason_allowlist_summary: rendererReadyBlockerReasonAllowlist,
          renderer_ready_safe_next_action_catalog_summary: rendererReadySafeNextActionCatalog,
          renderer_ready_cross_surface_blocker_consistency_summary: rendererReadyCrossSurfaceBlockerConsistency,
          renderer_ready_owner_evidence_handoff_packet_stub_summary: rendererReadyOwnerEvidenceHandoffPacketStub,
          renderer_ready_owner_handoff_not_sent_guard_summary: rendererReadyOwnerHandoffNotSentGuard,
          renderer_ready_owner_handoff_redaction_guard_summary: rendererReadyOwnerHandoffRedactionGuard,
          renderer_ready_real_probe_request_stub_summary: rendererReadyRealProbeRequestStub,
          renderer_ready_real_probe_request_rejection_gate_summary: rendererReadyRealProbeRequestRejectionGate,
          renderer_ready_real_probe_preflight_blocker_matrix_summary: rendererReadyRealProbePreflightBlockerMatrix,
          renderer_ready_evidence_collector_manifest_stub_summary: rendererReadyEvidenceCollectorManifestStub,
          renderer_ready_evidence_collector_redaction_guard_summary: rendererReadyEvidenceCollectorRedactionGuard,
          renderer_ready_evidence_collector_no_execution_guard_summary: rendererReadyEvidenceCollectorNoExecutionGuard,
          renderer_ready_evidence_collector_safe_output_schema_summary: rendererReadyEvidenceCollectorSafeOutputSchema,
          renderer_ready_evidence_collector_unsafe_output_rejection_summary: rendererReadyEvidenceCollectorUnsafeOutputRejection,
          renderer_ready_public_summary_redaction_summary: rendererReadyPublicSummaryRedaction,
          renderer_ready_admin_summary_redaction_summary: rendererReadyAdminSummaryRedaction,
          renderer_ready_audit_reference_stub_summary: rendererReadyAuditReferenceStub,
          renderer_ready_audit_reference_missing_guard_summary: rendererReadyAuditReferenceMissingGuard,
          renderer_ready_safe_operator_checklist_stub_summary: rendererReadySafeOperatorChecklistStub,
          renderer_ready_safe_operator_checklist_redaction_guard_summary: rendererReadySafeOperatorChecklistRedactionGuard,
          renderer_ready_real_evidence_request_final_no_go_summary: rendererReadyRealEvidenceRequestFinalNoGo,
          renderer_ready_preflight_route_manifest_stub_summary: rendererReadyPreflightRouteManifestStub,
          renderer_ready_preflight_route_unsafe_field_guard_summary: rendererReadyPreflightRouteUnsafeFieldGuard,
          renderer_ready_owner_scope_requirement_surface_summary: rendererReadyOwnerScopeRequirementSurface,
          renderer_ready_owner_scope_missing_rejection_guard_summary: rendererReadyOwnerScopeMissingRejectionGuard,
          renderer_ready_audit_link_requirement_surface_summary: rendererReadyAuditLinkRequirementSurface,
          renderer_ready_audit_link_missing_rejection_guard_summary: rendererReadyAuditLinkMissingRejectionGuard,
          renderer_ready_trusted_loader_preauth_blocker_surface_summary: rendererReadyTrustedLoaderPreauthBlockerSurface,
          renderer_ready_trusted_loader_preauth_rejection_guard_summary: rendererReadyTrustedLoaderPreauthRejectionGuard,
          renderer_ready_runtime_readiness_final_no_go_summary: rendererReadyRuntimeReadinessFinalNoGo,
          renderer_ready_production_readiness_final_no_go_summary: rendererReadyProductionReadinessFinalNoGo,
          renderer_ready_extended_guard_completion_review_summary: rendererReadyExtendedGuardCompletionReview,
          renderer_ready_real_evidence_request_final_wait_state_summary: rendererReadyRealEvidenceRequestFinalWaitState,
          renderer_ready_real_evidence_request_rejection_fixture_pack_summary: rendererReadyRealEvidenceRequestRejectionFixturePack,
          motion_dataset_real_row_split_policy_packet_summary: motionDatasetRealRowSplitPolicyPacket,
          motion_dataset_source_hash_owner_checklist_summary: motionDatasetSourceHashOwnerChecklist,
          motion_dataset_final_owner_wait_for_data_gate_summary: motionDatasetFinalOwnerWaitForDataGate,
          motion_dataset_row_file_checksum_preflight_manifest_summary: motionDatasetRowFileChecksumPreflightManifest,
          motion_dataset_synthetic_row_fixture_pack_summary: motionDatasetSyntheticRowFixturePack,
          motion_dataset_row_schema_preflight_summary: motionDatasetRowSchemaPreflight,
        },
        live2d_evidence_summary: heartbeatStatus.live2d_evidence_summary,
        trusted_loader_preflight_summary: trustedLoaderPreflight,
        trusted_loader_enablement_gate_summary: trustedLoaderEnablementGate,
        trusted_loader_owner_handoff_summary: trustedLoaderOwnerHandoff,
        fresh_evidence_bundle_summary: freshEvidenceBundle,
        go_nogo_preflight_summary: goNoGoPreflight,
        real_evidence_intake_summary: realEvidenceIntake,
        owner_confirmation_envelope_summary: ownerConfirmationEnvelope,
        real_evidence_request_packet_summary: realEvidenceRequestPacket,
        real_resident_evidence_collection_plan_summary: realResidentEvidenceCollectionPlan,
        real_evidence_collector_manifest_summary: realEvidenceCollectorManifest,
        real_evidence_collector_fixture_pack_summary: realEvidenceCollectorFixturePack,
        real_evidence_collector_dry_run_envelope_summary: realEvidenceCollectorDryRunEnvelope,
        real_evidence_freshness_threshold_summary: realEvidenceFreshnessThreshold,
        safe_evidence_summary_contract_summary: safeEvidenceSummaryContract,
        real_evidence_summary_intake_binding_summary: realEvidenceSummaryIntakeBinding,
        owner_confirmation_binding_summary: ownerConfirmationBinding,
        go_nogo_blocker_resolution_summary: goNoGoBlockerResolution,
        motion_dataset_real_row_intake_request_packet_summary: motionDatasetRealRowIntakeRequestPacket,
        motion_dataset_real_row_intake_dry_run_validator_summary: motionDatasetRealRowIntakeDryRunValidator,
        motion_dataset_real_row_intake_quarantine_envelope_summary: motionDatasetRealRowIntakeQuarantineEnvelope,
        motion_dataset_real_row_intake_owner_handoff_packet_summary: motionDatasetRealRowIntakeOwnerHandoffPacket,
        motion_dataset_real_row_audit_manifest_summary: motionDatasetRealRowAuditManifest,
        motion_dataset_real_row_redaction_scanner_fixture_pack_summary: motionDatasetRealRowRedactionScannerFixturePack,
          motion_dataset_real_row_evidence_link_manifest_summary: motionDatasetRealRowEvidenceLinkManifest,
          motion_dataset_real_row_go_nogo_blocker_map_summary: motionDatasetRealRowGoNoGoBlockerMap,
          motion_dataset_real_row_pre_ingestion_review_packet_summary: motionDatasetRealRowPreIngestionReviewPacket,
          motion_dataset_real_row_final_dry_run_checklist_summary: motionDatasetRealRowFinalDryRunChecklist,
          motion_dataset_real_row_missing_data_fail_closed_gate_summary: motionDatasetRealRowMissingDataFailClosedGate,
          motion_dataset_owner_row_data_submission_packet_summary: motionDatasetOwnerRowDataSubmissionPacket,
          motion_dataset_owner_row_data_submission_receipt_stub_summary: motionDatasetOwnerRowDataSubmissionReceiptStub,
          motion_dataset_owner_row_data_metadata_validator_stub_summary: motionDatasetOwnerRowDataMetadataValidatorStub,
          motion_dataset_owner_row_data_submission_rejection_fixture_pack_summary: motionDatasetOwnerRowDataSubmissionRejectionFixturePack,
          motion_dataset_actual_data_task_entry_gate_summary: motionDatasetActualDataTaskEntryGate,
          motion_dataset_row_body_parser_contract_stub_summary: motionDatasetRowBodyParserContractStub,
          motion_dataset_row_body_parser_rejection_fixture_pack_summary: motionDatasetRowBodyParserRejectionFixturePack,
          motion_dataset_ingestion_audit_trail_stub_summary: motionDatasetIngestionAuditTrailStub,
          motion_dataset_ingestion_rollback_plan_stub_summary: motionDatasetIngestionRollbackPlanStub,
          motion_dataset_parser_dry_run_envelope_summary: motionDatasetParserDryRunEnvelope,
          motion_dataset_real_row_acceptance_criteria_checklist_summary: motionDatasetRealRowAcceptanceCriteriaChecklist,
          motion_dataset_owner_actual_data_task_handoff_review_packet_summary: motionDatasetOwnerActualDataTaskHandoffReviewPacket,
          motion_dataset_actual_data_no_go_summary_projection_summary: motionDatasetActualDataNoGoSummaryProjection,
          motion_dataset_owner_submission_readiness_ledger_summary: motionDatasetOwnerSubmissionReadinessLedger,
          motion_dataset_final_actual_data_preauth_blocker_gate_summary: motionDatasetFinalActualDataPreauthBlockerGate,
          motion_dataset_owner_confirmation_preflight_envelope_summary: motionDatasetOwnerConfirmationPreflightEnvelope,
          motion_dataset_row_file_quarantine_staging_envelope_summary: motionDatasetRowFileQuarantineStagingEnvelope,
          motion_dataset_redaction_scan_execution_envelope_stub_summary: motionDatasetRedactionScanExecutionEnvelopeStub,
          motion_dataset_parser_dry_run_execution_request_envelope_summary: motionDatasetParserDryRunExecutionRequestEnvelope,
          motion_dataset_audit_execution_request_envelope_summary: motionDatasetAuditExecutionRequestEnvelope,
          motion_dataset_actual_data_task_runbook_no_action_packet_summary: motionDatasetActualDataTaskRunbookNoActionPacket,
          motion_dataset_final_owner_actual_data_packet_summary: motionDatasetFinalOwnerActualDataPacket,
          motion_dataset_actual_data_freeze_state_ledger_summary: motionDatasetActualDataFreezeStateLedger,
          motion_dataset_owner_wait_state_packet_summary: motionDatasetOwnerWaitStatePacket,
          motion_dataset_readiness_non_sweetening_sweep_summary: motionDatasetReadinessNonSweeteningSweep,
          motion_dataset_planning_completion_review_packet_summary: motionDatasetPlanningCompletionReviewPacket,
          motion_dataset_owner_submission_form_spec_summary: motionDatasetOwnerSubmissionFormSpec,
          motion_dataset_real_row_redaction_policy_matrix_summary: motionDatasetRealRowRedactionPolicyMatrix,
          motion_dataset_motion_allowlist_sync_review_summary: motionDatasetMotionAllowlistSyncReview,
          motion_dataset_renderer_ready_dependency_matrix_summary: motionDatasetRendererReadyDependencyMatrix,
          renderer_ready_false_positive_dependency_surface_summary: rendererReadyFalsePositiveDependencySurface,
          renderer_ready_fixture_vs_real_separation_contract_summary: rendererReadyFixtureVsRealSeparationContract,
          renderer_ready_fresh_evidence_envelope_summary: rendererReadyFreshEvidenceEnvelope,
          renderer_ready_stale_evidence_downgrade_contract_summary: rendererReadyStaleEvidenceDowngradeContract,
          renderer_ready_evidence_source_allowlist_summary: rendererReadyEvidenceSourceAllowlist,
          renderer_ready_evidence_schema_violation_guard_summary: rendererReadyEvidenceSchemaViolationGuard,
          renderer_ready_evidence_completeness_blocker_matrix_summary: rendererReadyEvidenceCompletenessBlockerMatrix,
          renderer_ready_evidence_conflict_downgrade_contract_summary: rendererReadyEvidenceConflictDowngradeContract,
          renderer_ready_go_nogo_blocker_surface_summary: rendererReadyGoNoGoBlockerSurface,
          renderer_ready_blocker_reason_allowlist_summary: rendererReadyBlockerReasonAllowlist,
          renderer_ready_safe_next_action_catalog_summary: rendererReadySafeNextActionCatalog,
          renderer_ready_cross_surface_blocker_consistency_summary: rendererReadyCrossSurfaceBlockerConsistency,
          renderer_ready_owner_evidence_handoff_packet_stub_summary: rendererReadyOwnerEvidenceHandoffPacketStub,
          renderer_ready_owner_handoff_not_sent_guard_summary: rendererReadyOwnerHandoffNotSentGuard,
          renderer_ready_owner_handoff_redaction_guard_summary: rendererReadyOwnerHandoffRedactionGuard,
          renderer_ready_real_probe_request_stub_summary: rendererReadyRealProbeRequestStub,
          renderer_ready_real_probe_request_rejection_gate_summary: rendererReadyRealProbeRequestRejectionGate,
          renderer_ready_real_probe_preflight_blocker_matrix_summary: rendererReadyRealProbePreflightBlockerMatrix,
          renderer_ready_evidence_collector_manifest_stub_summary: rendererReadyEvidenceCollectorManifestStub,
          renderer_ready_evidence_collector_redaction_guard_summary: rendererReadyEvidenceCollectorRedactionGuard,
          renderer_ready_evidence_collector_no_execution_guard_summary: rendererReadyEvidenceCollectorNoExecutionGuard,
          renderer_ready_evidence_collector_safe_output_schema_summary: rendererReadyEvidenceCollectorSafeOutputSchema,
          renderer_ready_evidence_collector_unsafe_output_rejection_summary: rendererReadyEvidenceCollectorUnsafeOutputRejection,
          renderer_ready_public_summary_redaction_summary: rendererReadyPublicSummaryRedaction,
          renderer_ready_admin_summary_redaction_summary: rendererReadyAdminSummaryRedaction,
          renderer_ready_audit_reference_stub_summary: rendererReadyAuditReferenceStub,
          renderer_ready_audit_reference_missing_guard_summary: rendererReadyAuditReferenceMissingGuard,
          renderer_ready_safe_operator_checklist_stub_summary: rendererReadySafeOperatorChecklistStub,
          renderer_ready_safe_operator_checklist_redaction_guard_summary: rendererReadySafeOperatorChecklistRedactionGuard,
          renderer_ready_real_evidence_request_final_no_go_summary: rendererReadyRealEvidenceRequestFinalNoGo,
          renderer_ready_preflight_route_manifest_stub_summary: rendererReadyPreflightRouteManifestStub,
          renderer_ready_preflight_route_unsafe_field_guard_summary: rendererReadyPreflightRouteUnsafeFieldGuard,
          renderer_ready_owner_scope_requirement_surface_summary: rendererReadyOwnerScopeRequirementSurface,
          renderer_ready_owner_scope_missing_rejection_guard_summary: rendererReadyOwnerScopeMissingRejectionGuard,
          renderer_ready_audit_link_requirement_surface_summary: rendererReadyAuditLinkRequirementSurface,
          renderer_ready_audit_link_missing_rejection_guard_summary: rendererReadyAuditLinkMissingRejectionGuard,
          renderer_ready_trusted_loader_preauth_blocker_surface_summary: rendererReadyTrustedLoaderPreauthBlockerSurface,
          renderer_ready_trusted_loader_preauth_rejection_guard_summary: rendererReadyTrustedLoaderPreauthRejectionGuard,
          renderer_ready_runtime_readiness_final_no_go_summary: rendererReadyRuntimeReadinessFinalNoGo,
          renderer_ready_production_readiness_final_no_go_summary: rendererReadyProductionReadinessFinalNoGo,
          renderer_ready_extended_guard_completion_review_summary: rendererReadyExtendedGuardCompletionReview,
          renderer_ready_real_evidence_request_final_wait_state_summary: rendererReadyRealEvidenceRequestFinalWaitState,
          renderer_ready_real_evidence_request_rejection_fixture_pack_summary: rendererReadyRealEvidenceRequestRejectionFixturePack,
          motion_dataset_real_row_split_policy_packet_summary: motionDatasetRealRowSplitPolicyPacket,
          motion_dataset_source_hash_owner_checklist_summary: motionDatasetSourceHashOwnerChecklist,
          motion_dataset_final_owner_wait_for_data_gate_summary: motionDatasetFinalOwnerWaitForDataGate,
          motion_dataset_row_file_checksum_preflight_manifest_summary: motionDatasetRowFileChecksumPreflightManifest,
        motion_dataset_synthetic_row_fixture_pack_summary: motionDatasetSyntheticRowFixturePack,
        motion_dataset_row_schema_preflight_summary: motionDatasetRowSchemaPreflight,
        boundary_policy: createBoundaryPolicy(),
      };
      assertSafePublicObject(response, "browser heartbeat response");
      return response;
    },
  };
}

function getHeartbeatStatus(state, nowMs) {
  return createHeartbeatStatus({
    heartbeat: state.lastHeartbeat,
    nowMs,
    maxAgeMs: state.heartbeatMaxAgeMs,
    expectedModelId: state.modelId,
    expectedSceneId: state.sceneId,
    cubismSdkAvailable: state.cubismSdkAvailable,
    model3ManifestAvailable: state.model3ManifestAvailable,
    realModelLoadSupported: state.realModelLoadSupported,
    lastDeliveredCueStatusHash: state.lastCueDeliveredHash,
  });
}

function rendererReadyFalsePositiveDependencySurfaceFromHeartbeat(heartbeatStatus) {
  return createRendererReadyFalsePositiveDependencySurfaceSummary({
    fresh_heartbeat_present: heartbeatStatus.heartbeat_fresh,
    real_model_load_supported: heartbeatStatus.real_model_load_supported,
    model_loaded: heartbeatStatus.model_loaded,
    scene_loaded: heartbeatStatus.scene_loaded,
    model_matches_expected: heartbeatStatus.model_matches,
    scene_matches_expected: heartbeatStatus.scene_matches,
    cue_capability_confirmed: heartbeatStatus.cue_capability_confirmed,
    last_cue_applied_success: heartbeatStatus.last_cue_applied,
  });
}

function rendererReadyFixtureVsRealSeparationContractFromHeartbeat(heartbeatStatus) {
  return createRendererReadyFixtureVsRealSeparationContractSummary({
    manifest_available: heartbeatStatus.model3_manifest_available,
    sse_connected: heartbeatStatus.heartbeat_present,
    cue_accepted: heartbeatStatus.cue_capability_claimed,
    fresh_heartbeat_present: heartbeatStatus.heartbeat_fresh,
    real_model_load_supported: heartbeatStatus.real_model_load_supported,
    model_loaded: heartbeatStatus.model_loaded,
    scene_loaded: heartbeatStatus.scene_loaded,
    cue_capability_confirmed: heartbeatStatus.cue_capability_confirmed,
    last_cue_applied_success: heartbeatStatus.last_cue_applied,
  });
}

function rendererReadyFreshEvidenceEnvelopeFromHeartbeat(heartbeatStatus) {
  return createRendererReadyFreshEvidenceEnvelopeSummary({
    fixture_evidence_present: heartbeatStatus.live2d_evidence_summary?.fixture_evidence_status === "fixture_not_real_evidence",
    fresh_heartbeat_evidence_present: heartbeatStatus.heartbeat_fresh,
    real_model_load_evidence_present: heartbeatStatus.real_model_load_supported,
    model_loaded_evidence_present: heartbeatStatus.model_loaded,
    scene_loaded_evidence_present: heartbeatStatus.scene_loaded,
    cue_capability_evidence_present: heartbeatStatus.cue_capability_confirmed,
    last_cue_applied_evidence_present: heartbeatStatus.last_cue_applied,
  });
}

function rendererReadyStaleEvidenceDowngradeContractFromHeartbeat(heartbeatStatus) {
  return createRendererReadyStaleEvidenceDowngradeContractSummary({
    fixture_evidence_present: heartbeatStatus.live2d_evidence_summary?.fixture_evidence_status === "fixture_not_real_evidence",
    manifest_available: heartbeatStatus.model3_manifest_available,
    sse_connected: heartbeatStatus.heartbeat_present,
    cue_accepted: heartbeatStatus.cue_capability_claimed,
    fresh_heartbeat_evidence_present: heartbeatStatus.heartbeat_present,
    real_model_load_evidence_present: heartbeatStatus.real_model_load_supported,
    last_cue_applied_evidence_present: heartbeatStatus.last_cue_applied,
  });
}

function rendererReadyEvidenceSourceAllowlistFromHeartbeat(heartbeatStatus) {
  return createRendererReadyEvidenceSourceAllowlistSummary({
    source_type: heartbeatStatus.live2d_evidence_summary?.collector_source_type || "none",
  });
}

function rendererReadyEvidenceCompletenessBlockerMatrixFromHeartbeat(heartbeatStatus) {
  return createRendererReadyEvidenceCompletenessBlockerMatrixSummary({
    freshHeartbeatEvidencePresent: heartbeatStatus.heartbeat_fresh,
    realModelLoadEvidencePresent: heartbeatStatus.real_model_load_supported,
    modelLoadedEvidencePresent: heartbeatStatus.model_loaded,
    sceneLoadedEvidencePresent: heartbeatStatus.scene_loaded,
    cueCapabilityEvidencePresent: heartbeatStatus.cue_capability_confirmed,
    lastCueAppliedEvidencePresent: heartbeatStatus.last_cue_applied,
    lastCueAppliedSuccessEvidencePresent: heartbeatStatus.last_cue_applied,
  });
}

function rendererReadyEvidenceConflictDowngradeContractFromHeartbeat(heartbeatStatus) {
  return createRendererReadyEvidenceConflictDowngradeContractSummary({
    freshHeartbeatEvidencePresent: heartbeatStatus.heartbeat_fresh,
    realModelLoadEvidencePresent: heartbeatStatus.real_model_load_supported,
    modelLoadedEvidencePresent: heartbeatStatus.model_loaded,
    sceneLoadedEvidencePresent: heartbeatStatus.scene_loaded,
    cueCapabilityEvidencePresent: heartbeatStatus.cue_capability_confirmed,
    lastCueAppliedEvidencePresent: heartbeatStatus.last_cue_applied,
    lastCueAppliedSuccessEvidencePresent: heartbeatStatus.last_cue_applied,
    realProbeEvidencePresent: heartbeatStatus.live2d_evidence_summary?.collector_source_type === "real_probe",
    rendererReadinessEvidenceFresh: heartbeatStatus.live2d_evidence_summary?.evidence_fresh === true,
    sourceType: heartbeatStatus.live2d_evidence_summary?.collector_source_type || "none",
    ownerConfirmationCreated: false,
    ownerConfirmationConfirmed: false,
    priority1Status: "BLOCKED",
    checkedRowCount: 0,
    actualDataTaskStarted: false,
    motionDatasetExecutable: false,
    trustedLoaderAllowlistEnabled: false,
  });
}

function browserDeliveryStatus(state, heartbeatStatus) {
  if (!state.lastCueHash) return "waiting_for_cue";
  if (state.cueQueue.length === 0) {
    return state.lastCueDeliveredHash ? "delivered_to_browser" : "waiting_for_cue";
  }
  return heartbeatStatus.browser_cue_delivery_ready ? "ready_for_browser_delivery" : "waiting_for_browser_ready";
}

function hashSafePayload(payload) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 24);
}
