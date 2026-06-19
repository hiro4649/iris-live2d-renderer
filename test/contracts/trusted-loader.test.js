import assert from "node:assert/strict";
import { assertSafe } from "../helpers/safeContractAssertions.js";
import {
  ALLOWED_CUBISM_LOADER_ENV_NAMES,
  CUBISM_LOADER_KIND_CANDIDATES,
  CUBISM_LOADER_PROVISIONING_SCHEMA,
  createCubismLoaderProvisioningSummary,
  createTrustedLoaderAllowlistPreflightSummary,
  inspectCubismLoaderProvisioning,
} from "../../src/renderer/cubismLoaderProvisioning.js";
import {
  TRUSTED_LOADER_EVIDENCE_SCHEMA,
  TRUSTED_LOADER_KINDS,
} from "../../src/renderer/trustedLoaderEvidence.js";

assert.equal(TRUSTED_LOADER_EVIDENCE_SCHEMA, "iris_live2d_trusted_loader_evidence_v1");
assert.equal(TRUSTED_LOADER_KINDS.length, 0);
assert.equal(CUBISM_LOADER_PROVISIONING_SCHEMA, "iris_live2d_cubism_loader_provisioning_v1");
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

const attemptedAllowlistProvisioning = createCubismLoaderProvisioningSummary({
  configured_env_names: ALLOWED_CUBISM_LOADER_ENV_NAMES,
  loader_kind: "cubism_framework_model_loader_v1",
  loader_dependency_status: "candidate_present",
  license_status: "license_attention_required",
  provisioning_status: "candidate_present",
  trusted_loader_allowlist_enabled: true,
});
assert.equal(attemptedAllowlistProvisioning.trusted_loader_allowlist_enabled, false);
assert.equal(
  attemptedAllowlistProvisioning.trusted_loader_allowlist_request_status,
  "ignored_requires_separate_owner_confirmed_enablement_pr"
);
assertSafe(JSON.stringify(attemptedAllowlistProvisioning));

const ownerProvidedAllowlistPreflight = createTrustedLoaderAllowlistPreflightSummary({
  loaderProvisioning: attemptedAllowlistProvisioning,
  live2dEvidenceSummary: {
    live2d_evidence_status: "blocked",
    evidence_freshness_status: "missing",
    fixture_evidence_status: "fixture_only",
    dry_run_evidence_status: "not_dry_run",
  },
});
assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_allowlist_status, "disabled");
assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_ready_candidate, false);
assert.equal(ownerProvidedAllowlistPreflight.trusted_loader_allowlist_enabled, false);
assert.equal(ownerProvidedAllowlistPreflight.renderer_ready, false);
assert.equal(ownerProvidedAllowlistPreflight.browser_cue_delivery_ready, false);
assertSafe(JSON.stringify(ownerProvidedAllowlistPreflight));

console.log("contract-trusted-loader: pass");
