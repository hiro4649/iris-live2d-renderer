import { readFileSync } from "node:fs";

const docs = [
  "docs/iris-live2d-renderer/LIVE2D_SAFE_SURFACE_ARCHITECTURE.md",
  "docs/iris-live2d-renderer/LIVE2D_SPEC_COMPLETION_INDEX.md",
  "docs/iris-live2d-renderer/IRIS_LIVE2D_RENDERER_DEVELOPMENT_SCHEDULE.md",
];

const failures = [];
for (const file of docs) {
  const bytes = readFileSync(file);
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) failures.push(`${file}:bom`);
  const text = bytes.toString("utf8");
  if (text.includes("\u0000")) failures.push(`${file}:nul`);
  if (!text.includes("runtime readiness")) failures.push(`${file}:runtime_boundary_missing`);
  if (!text.includes("production readiness")) failures.push(`${file}:production_boundary_missing`);
}

console.log(`live2dDocsUtf8Status: ${failures.length ? "fail" : "pass"}`);
if (failures.length) {
  console.log(JSON.stringify({ safeSummaryOnly: true, failures }));
  process.exitCode = 1;
}
