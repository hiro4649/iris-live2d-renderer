import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import * as cubismLoaderProvisioning from "../src/renderer/cubismLoaderProvisioning.js";
import fixture from "./fixtures/planning/cubism-loader-provisioning-public-export-inventory-v1.json" with { type: "json" };

const source = readFileSync(fixture.sourceFile, "utf8");

function maskSource(sourceText) {
  let output = "";
  let state = "code";
  let quote = "";

  for (let index = 0; index < sourceText.length; index += 1) {
    const char = sourceText[index];
    const next = sourceText[index + 1];

    if (state === "code") {
      if (char === "/" && next === "/") {
        output += "  ";
        index += 1;
        state = "lineComment";
        continue;
      }
      if (char === "/" && next === "*") {
        output += "  ";
        index += 1;
        state = "blockComment";
        continue;
      }
      if (char === "\"" || char === "'" || char === "`") {
        quote = char;
        output += " ";
        state = "string";
        continue;
      }
      output += char;
      continue;
    }

    if (state === "lineComment") {
      if (char === "\n") {
        output += "\n";
        state = "code";
      } else {
        output += " ";
      }
      continue;
    }

    if (state === "blockComment") {
      if (char === "*" && next === "/") {
        output += "  ";
        index += 1;
        state = "code";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (state === "string") {
      if (char === "\\") {
        output += "  ";
        index += 1;
        continue;
      }
      if (char === quote) {
        output += " ";
        state = "code";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
    }
  }

  return output;
}

function parseExportInventory(sourceText) {
  const code = maskSource(sourceText);
  const names = new Set();
  let wildcardExportCount = 0;
  let defaultExportCount = 0;

  for (const match of code.matchAll(/export\s+(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gu)) {
    names.add(match[1]);
  }

  for (const match of code.matchAll(/export\s*\{([\s\S]*?)\}\s*(?:from\s*[^;]+)?;/gu)) {
    for (const rawPart of match[1].split(",")) {
      const part = rawPart.trim();
      if (!part) {
        continue;
      }
      const aliasParts = part.split(/\s+as\s+/u);
      names.add((aliasParts[1] || aliasParts[0]).trim());
    }
  }

  for (const _match of code.matchAll(/export\s+\*/gu)) {
    wildcardExportCount += 1;
  }

  for (const _match of code.matchAll(/export\s+default\b/gu)) {
    defaultExportCount += 1;
  }

  return {
    sortedExportNames: [...names].sort(),
    exportCount: names.size,
    wildcardExportCount,
    defaultExportCount,
  };
}

function diffNames(actual, expected) {
  const expectedSet = new Set(expected);
  const actualSet = new Set(actual);
  return {
    missing: expected.filter((name) => !actualSet.has(name)),
    unexpected: actual.filter((name) => !expectedSet.has(name)),
  };
}

describe("cubismLoaderProvisioning legacy public export inventory", () => {
  it("matches the baseline public module namespace exactly", () => {
    const actualNames = Object.keys(cubismLoaderProvisioning).sort();
    assert.equal(fixture.safeSummaryOnly, true);
    assert.equal(fixture.exportCount, fixture.sortedExportNames.length);
    assert.deepEqual(diffNames(actualNames, fixture.sortedExportNames), {
      missing: [],
      unexpected: [],
    });
  });

  it("keeps source-level public export declarations aligned with the baseline", () => {
    const actualInventory = parseExportInventory(source);
    assert.equal(actualInventory.defaultExportCount, 0);
    assert.equal(actualInventory.wildcardExportCount, 0);
    assert.deepEqual(diffNames(actualInventory.sortedExportNames, fixture.sortedExportNames), {
      missing: [],
      unexpected: [],
    });
  });

  it("does not leak owner-intake helper exports beyond the baseline", () => {
    const baselineNames = new Set(fixture.sortedExportNames);
    const actualNames = Object.keys(cubismLoaderProvisioning);
    const helperNames = [
      "detectedRejectedRequestFields",
      "safeOwnerRowSubmissionFileShapeLabel",
      "safeOwnerRowSubmissionRejectedFieldLabel",
    ];

    assert.deepEqual(
      helperNames.filter((name) => !baselineNames.has(name) && actualNames.includes(name)),
      [],
    );
  });
});
