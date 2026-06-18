import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const docs = [
  "docs/iris-live2d-renderer/LIVE2D_SAFE_SURFACE_ARCHITECTURE.md",
  "docs/iris-live2d-renderer/LIVE2D_SPEC_COMPLETION_INDEX.md",
  "docs/iris-live2d-renderer/IRIS_LIVE2D_RENDERER_DEVELOPMENT_SCHEDULE.md",
];

for (const file of docs) {
  const bytes = readFileSync(file);
  assert.notEqual(bytes[0], 0xef, `${file}:bom-first-byte`);
  const text = bytes.toString("utf8");
  assert.equal(text.includes("\u0000"), false, `${file}:nul`);
  assert.equal(text.includes("runtime readiness"), true, `${file}:runtime-boundary`);
  assert.equal(text.includes("production readiness"), true, `${file}:production-boundary`);
}

const architecture = readFileSync("docs/iris-live2d-renderer/LIVE2D_SAFE_SURFACE_ARCHITECTURE.md", "utf8");
assert.equal(architecture.includes("## Pure Safe Module Input Label Hardening"), true);
assert.equal(architecture.includes("## V1/V2 Semantic Drift Guard"), true);
assert.equal(architecture.includes("## Compact Safe Summary V2"), true);
assert.equal(architecture.includes("## Safe Contract Catalog And Docs Deduplication"), true);

const completionIndex = readFileSync("docs/iris-live2d-renderer/LIVE2D_SPEC_COMPLETION_INDEX.md", "utf8");
assert.equal(completionIndex.includes("## Compact Safe Summary V2 Pack"), true);
assert.equal(completionIndex.includes("## Compact Safe Summary V2 Semantic Invariant Repair"), true);

const schedule = readFileSync("docs/iris-live2d-renderer/IRIS_LIVE2D_RENDERER_DEVELOPMENT_SCHEDULE.md", "utf8");
assert.equal(schedule.includes("LIVE2D-COMPACT-SAFE-SUMMARY-V2-PACK1"), true);

console.log("docs-integrity: pass");
