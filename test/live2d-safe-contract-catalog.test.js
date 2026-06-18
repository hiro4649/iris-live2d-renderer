import assert from "node:assert/strict";
import {
  LIVE2D_EVIDENCE_SOURCE_TYPES,
  LIVE2D_EXPERIMENTAL_MOTION_LABELS,
  LIVE2D_REJECTED_EVIDENCE_SOURCE_TYPES,
  LIVE2D_RUNTIME_SUPPORTED_MOTION_LABELS,
  LIVE2D_SAFE_CONTRACT_CATALOG,
  LIVE2D_SAFE_NEXT_ACTION_LABELS,
  LIVE2D_STRONG_MOTION_LABELS,
} from "../src/renderer/live2dSafeContractCatalog.js";
import {
  RENDERER_EVIDENCE_ALLOWED_SOURCE_TYPES,
  RENDERER_EVIDENCE_REJECTED_SOURCE_TYPES,
} from "../src/renderer/rendererEvidenceDecision.js";
import { SAFE_NEXT_ACTION_LABELS } from "../src/renderer/realEvidenceOwnerHandoffPacket.js";

function assertFrozenArray(values, label) {
  assert.equal(Object.isFrozen(values), true, label);
  assert.equal(new Set(values).size, values.length, `${label}:duplicates`);
  for (const value of values) assert.equal(typeof value, "string", `${label}:string`);
}

for (const [label, values] of Object.entries(LIVE2D_SAFE_CONTRACT_CATALOG)) {
  assertFrozenArray(values, label);
}

assert.deepEqual(RENDERER_EVIDENCE_ALLOWED_SOURCE_TYPES, LIVE2D_EVIDENCE_SOURCE_TYPES);
assert.deepEqual(RENDERER_EVIDENCE_REJECTED_SOURCE_TYPES, LIVE2D_REJECTED_EVIDENCE_SOURCE_TYPES);
assert.deepEqual(SAFE_NEXT_ACTION_LABELS, LIVE2D_SAFE_NEXT_ACTION_LABELS);

for (const label of LIVE2D_STRONG_MOTION_LABELS) {
  assert.equal(LIVE2D_RUNTIME_SUPPORTED_MOTION_LABELS.includes(label), true, label);
}
for (const label of LIVE2D_EXPERIMENTAL_MOTION_LABELS) {
  assert.equal(LIVE2D_RUNTIME_SUPPORTED_MOTION_LABELS.includes(label), false, label);
}

assert.equal(LIVE2D_SAFE_CONTRACT_CATALOG.runtimeSupportedMotionLabels.includes("talk"), true);
assert.equal(LIVE2D_SAFE_CONTRACT_CATALOG.rejectedEvidenceSourceTypes.includes("fixture"), true);

console.log("live2d-safe-contract-catalog: pass");
