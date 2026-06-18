import { createRendererState } from "../src/state.js";
import { validateCompactSafeSummaryV2Parity } from "../src/renderer/compactSafeSummaryV2Adapter.js";

const state = createRendererState();
const status = state.status();
const health = state.health();
const runtimeConfig = state.browserRuntimeConfig();

const v1 = {
  ownerConfirmationConfirmed: false,
  checkedRowCount: 0,
  motionDatasetExecutable: false,
  priority1Status: "BLOCKED",
  trustedLoaderAllowlistEnabled: false,
  actualIngestionAllowed: false,
  runtimeReadinessClaimed: false,
  productionReadinessClaimed: false,
  realRendererEvidenceStatus: "missing",
};

const surfaceResults = [
  ["status", validateCompactSafeSummaryV2Parity(v1, status.live2d_safe_summary_v2)],
  ["health", validateCompactSafeSummaryV2Parity(v1, health.live2d_safe_summary_v2)],
  ["runtimeConfig", validateCompactSafeSummaryV2Parity(v1, runtimeConfig.live2d_safe_summary_v2)],
];

const failures = surfaceResults.flatMap(([surface, result]) => result.failures.map((failure) => `${surface}:${failure}`));
if (JSON.stringify(status.live2d_safe_summary_v2) !== JSON.stringify(health.live2d_safe_summary_v2)) {
  failures.push("status_health_v2_semantic_mismatch");
}
if (JSON.stringify(status.live2d_safe_summary_v2) !== JSON.stringify(runtimeConfig.live2d_safe_summary_v2)) {
  failures.push("status_runtime_config_v2_semantic_mismatch");
}

const report = {
  schema: "live2d_v1_v2_semantic_parity_check_v1",
  status: failures.length ? "fail" : "pass",
  failures,
  safeSummaryOnly: true,
};

console.log(`live2dV1V2SemanticParityStatus: ${report.status}`);
if (failures.length) {
  console.log(JSON.stringify(report));
  process.exitCode = 1;
}
