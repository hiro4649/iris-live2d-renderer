import assert from "node:assert/strict";

import { parseEsmPublicExportInventory } from "../scripts/live2d-esm-export-inventory.mjs";

const source = `
// export const COMMENT_FAKE = true;
const single = 'export const SINGLE_FAKE = true';
const double = "export const DOUBLE_FAKE = true";
const template = \`export const TEMPLATE_FAKE = true \${(() => {
  const local = "export const TEMPLATE_EXPR_STRING_FAKE = true";
  return local;
})()}\`;

export const DIRECT_CONST = true;
export let DIRECT_LET = 1;
export var DIRECT_VAR = 2;
export function directFunction() {
  return DIRECT_CONST;
}
export class DirectClass {}

const localAlias = true;
const defaultBinding = true;
export {
  localAlias as PublicAlias,
  DIRECT_CONST as PublicConstAlias,
  directFunction,
};
export {
  default as PublicDefaultFrom,
  remoteLocal as RemotePublic,
} from "./remote.js";
export * from "./wildcard.js";
export * as NamespacePublic from "./namespace.js";
export default defaultBinding;
`;

const inventory = parseEsmPublicExportInventory(source);

assert.equal(inventory.safeSummaryOnly, true);
assert.equal(inventory.parseErrorCount, 0);
assert.equal(inventory.wildcardExportCount, 1);
assert.equal(inventory.namespaceExportCount, 1);
assert.equal(inventory.defaultExportCount, 1);
assert.deepEqual(inventory.duplicateExportNames, ["directFunction"]);
assert.deepEqual(inventory.namedExportNames, [
  "DIRECT_CONST",
  "DIRECT_LET",
  "DIRECT_VAR",
  "DirectClass",
  "NamespacePublic",
  "PublicAlias",
  "PublicConstAlias",
  "PublicDefaultFrom",
  "RemotePublic",
  "directFunction",
]);

assert.deepEqual(
  inventory.namedExports.find((entry) => entry.exportedName === "PublicAlias"),
  {
    localName: "localAlias",
    exportedName: "PublicAlias",
    kind: "named",
    sourceSpecifierPresent: false,
    topLevel: true,
  },
);
assert.deepEqual(
  inventory.namedExports.find((entry) => entry.exportedName === "PublicDefaultFrom"),
  {
    localName: "default",
    exportedName: "PublicDefaultFrom",
    kind: "named",
    sourceSpecifierPresent: true,
    topLevel: true,
  },
);

const duplicateInventory = parseEsmPublicExportInventory(`
  export const SAME = 1;
  const local = 2;
  export { local as SAME };
`);
assert.deepEqual(duplicateInventory.duplicateExportNames, ["SAME"]);

console.log("live2d-esm-export-inventory: pass");
