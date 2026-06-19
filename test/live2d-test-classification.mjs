export const LIVE2D_TEST_CLASSIFICATION = Object.freeze({
  defaultTestJsClass: "unit",
  allowedNpmTestClasses: Object.freeze(["unit", "contract", "integrity"]),
  excludedProbeExtensions: Object.freeze([".mjs"]),
  timeoutMsByPath: Object.freeze({
    "test/contract.test.js": 180000,
  }),
  defaultTimeoutMs: 120000,
});
