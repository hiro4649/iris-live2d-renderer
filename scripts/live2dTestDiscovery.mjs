import { lstatSync, readdirSync, realpathSync, readFileSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const TEST_TO_TEST_IMPORT_PATTERN = /(?:import\s+(?:[^'"]+\s+from\s+)?|import\s*\(|require\s*\()\s*["']([^"']+\.test\.js)["']/gu;

export function normalizeRepositoryTestPath(path, { repoRoot = process.cwd() } = {}) {
  const root = realpathSync(resolve(repoRoot));
  const real = realpathSync(resolve(repoRoot, path));
  const relativePath = relative(root, real);
  if (!relativePath || relativePath.startsWith("..") || resolve(real) === root) {
    throw new Error("test path outside repository");
  }
  return relativePath.split(sep).join("/");
}

export function assertNoDuplicateTestPaths(paths) {
  const seen = new Set();
  for (const path of paths) {
    if (seen.has(path)) throw new Error(`duplicate test path: ${path}`);
    seen.add(path);
  }
  return true;
}

export function assertNoTestToTestImports(paths, { repoRoot = process.cwd() } = {}) {
  const failures = [];
  for (const path of paths) {
    const text = readFileSync(resolve(repoRoot, path), "utf8");
    for (const match of text.matchAll(TEST_TO_TEST_IMPORT_PATTERN)) {
      failures.push(`${path}:${match[1]}`);
    }
  }
  if (failures.length) throw new Error(`test-to-test import rejected: ${failures.join(",")}`);
  return true;
}

export function discoverLive2dTests({
  repoRoot = process.cwd(),
  testDir = "test",
  includePattern = /\.test\.js$/u,
} = {}) {
  const root = realpathSync(resolve(repoRoot));
  const start = resolve(root, testDir);
  const discovered = [];
  walk(start);
  const normalized = discovered.map((path) => normalizeRepositoryTestPath(path, { repoRoot: root })).sort();
  if (normalized.length === 0) throw new Error("No registered .test.js files found.");
  assertNoDuplicateTestPaths(normalized);
  return normalized;

  function walk(directory) {
    const directoryStat = lstatSync(directory);
    if (directoryStat.isSymbolicLink()) throw new Error("symlink test directory rejected");
    if (!directoryStat.isDirectory()) return;
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const fullPath = resolve(directory, entry.name);
      if (entry.isSymbolicLink()) throw new Error("symlink test path rejected");
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      if (!includePattern.test(entry.name)) continue;
      const relativePath = relative(root, fullPath);
      if (relativePath.startsWith("..")) throw new Error("test path outside repository");
      discovered.push(fullPath);
    }
  }
}

export function pathToNodeArg(path, { repoRoot = process.cwd() } = {}) {
  return pathToFileURL(resolve(repoRoot, path)).href;
}
