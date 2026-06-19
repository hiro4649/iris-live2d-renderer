import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  assertNoDuplicateTestPaths,
  assertNoTestToTestImports,
  discoverLive2dTests,
  normalizeRepositoryTestPath,
} from "../scripts/live2dTestDiscovery.mjs";

const root = await mkdtemp(join(tmpdir(), "live2d-test-discovery-"));
try {
  await mkdir(join(root, "test", "contracts"), { recursive: true });
  await mkdir(join(root, "test", "helpers"), { recursive: true });
  await writeFile(join(root, "test", "alpha.test.js"), "import './helpers/helper.js';\n");
  await writeFile(join(root, "test", "contracts", "beta.test.js"), "import '../helpers/helper.js';\n");
  await writeFile(join(root, "test", "helpers", "helper.js"), "export const ok = true;\n");
  await writeFile(join(root, "test", "manual-probe.mjs"), "throw new Error('must not run');\n");
  await writeFile(join(root, "test", "browser-probe.mjs"), "throw new Error('must not run');\n");

  const discovered = discoverLive2dTests({ repoRoot: root });
  assert.deepEqual(discovered, [
    "test/alpha.test.js",
    "test/contracts/beta.test.js",
  ]);
  assert.equal(assertNoDuplicateTestPaths(discovered), true);
  assert.equal(assertNoTestToTestImports(discovered, { repoRoot: root }), true);
  assert.equal(normalizeRepositoryTestPath("test/alpha.test.js", { repoRoot: root }), "test/alpha.test.js");
  assert.throws(() => assertNoDuplicateTestPaths(["test/a.test.js", "test/a.test.js"]), /duplicate/);

  const testSuffix = ".test.js";
  await writeFile(join(root, "test", "contracts", "bad.test.js"), `import '../alpha${testSuffix}';\n`);
  assert.throws(
    () => assertNoTestToTestImports(["test/contracts/bad.test.js"], { repoRoot: root }),
    /test-to-test import rejected/,
  );

  await rm(join(root, "test", "contracts", "bad.test.js"));
  await writeFile(join(root, "test", "contracts", "bad-dynamic.test.js"), `await import('../alpha${testSuffix}');\n`);
  assert.throws(
    () => assertNoTestToTestImports(["test/contracts/bad-dynamic.test.js"], { repoRoot: root }),
    /test-to-test import rejected/,
  );

  await rm(join(root, "test", "contracts", "bad-dynamic.test.js"));
  await writeFile(join(root, "test", "contracts", "bad-require.test.js"), `require('../alpha${testSuffix}');\n`);
  assert.throws(
    () => assertNoTestToTestImports(["test/contracts/bad-require.test.js"], { repoRoot: root }),
    /test-to-test import rejected/,
  );

  await rm(join(root, "test", "contracts", "bad-require.test.js"));
  await rm(join(root, "test", "alpha.test.js"));
  await rm(join(root, "test", "contracts", "beta.test.js"));
  assert.throws(() => discoverLive2dTests({ repoRoot: root }), /No registered/);

  if (process.platform !== "win32" || existsSync(root)) {
    await writeFile(join(root, "test", "target.test.js"), "");
    try {
      await symlink(join(root, "test", "target.test.js"), join(root, "test", "link.test.js"));
      assert.throws(() => discoverLive2dTests({ repoRoot: root }), /symlink/);
    } catch (error) {
      if (error.code !== "EPERM" && error.code !== "EACCES") throw error;
    }
  }
} finally {
  await rm(root, { recursive: true, force: true });
}

console.log("test-runner: pass");
