#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { LIVE2D_TEST_CLASSIFICATION } from "../test/live2d-test-classification.mjs";
import {
  assertNoTestToTestImports,
  discoverLive2dTests,
} from "./live2dTestDiscovery.mjs";

const testFiles = discoverLive2dTests();
assertNoTestToTestImports(testFiles);

const executed = new Set();

for (const file of testFiles) {
  if (executed.has(file)) {
    console.error(`Duplicate test execution rejected: ${file}`);
    process.exit(1);
  }
  executed.add(file);
  const timeout = LIVE2D_TEST_CLASSIFICATION.timeoutMsByPath[file] ??
    LIVE2D_TEST_CLASSIFICATION.defaultTimeoutMs;
  const result = spawnSync(process.execPath, [file], {
    stdio: "inherit",
    env: process.env,
    timeout,
  });

  if (result.error?.code === "ETIMEDOUT") {
    console.error(`Test timed out: ${file}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`run-all-tests: pass (${testFiles.length} files)`);
