#!/usr/bin/env node
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const testDir = "test";
const testFiles = readdirSync(testDir)
  .filter((name) => name.endsWith(".test.js"))
  .sort()
  .map((name) => join(testDir, name));

if (testFiles.length === 0) {
  console.error("No registered .test.js files found.");
  process.exit(1);
}

for (const file of testFiles) {
  const result = spawnSync(process.execPath, [file], {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`run-all-tests: pass (${testFiles.length} files)`);
