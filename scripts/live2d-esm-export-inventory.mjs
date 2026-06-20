const IDENTIFIER = "[A-Za-z_$][\\w$]*";

export function parseEsmPublicExportInventory(sourceText) {
  const source = maskNonCode(sourceText);
  const namedExports = [];
  const parseErrors = [];
  let wildcardExportCount = 0;
  let namespaceExportCount = 0;
  let defaultExportCount = 0;

  for (const statement of topLevelExportStatements(source)) {
    const text = statement.text.trim();
    const direct = text.match(new RegExp(`^export\\s+(const|let|var|function|class)\\s+(${IDENTIFIER})\\b`, "u"));
    if (direct) {
      namedExports.push({
        localName: direct[2],
        exportedName: direct[2],
        kind: direct[1],
        sourceSpecifierPresent: false,
        topLevel: true,
      });
      continue;
    }

    if (/^export\s+default\b/u.test(text)) {
      defaultExportCount += 1;
      continue;
    }

    const namespace = text.match(new RegExp(`^export\\s+\\*\\s+as\\s+(${IDENTIFIER})\\s+from\\b`, "u"));
    if (namespace) {
      namespaceExportCount += 1;
      namedExports.push({
        localName: namespace[1],
        exportedName: namespace[1],
        kind: "namespace",
        sourceSpecifierPresent: true,
        topLevel: true,
      });
      continue;
    }

    if (/^export\s+\*\s+from\b/u.test(text)) {
      wildcardExportCount += 1;
      continue;
    }

    const list = text.match(/^export\s*\{([\s\S]*?)\}\s*(from\b[\s\S]*)?;?$/u);
    if (list) {
      const sourceSpecifierPresent = Boolean(list[2]);
      for (const part of splitTopLevelCommaList(list[1])) {
        if (!part.trim()) continue;
        const parsed = parseExportListPart(part.trim());
        if (!parsed) {
          parseErrors.push({ statement: text, part: part.trim(), reason: "invalid_export_list_part" });
          continue;
        }
        namedExports.push({
          ...parsed,
          kind: "named",
          sourceSpecifierPresent,
          topLevel: true,
        });
      }
      continue;
    }

    parseErrors.push({ statement: text, reason: "unsupported_export_statement" });
  }

  const allNamedExportNames = namedExports.map((entry) => entry.exportedName).sort();
  const namedExportNames = [...new Set(allNamedExportNames)].sort();
  const duplicateExportNames = [...new Set(allNamedExportNames.filter((name, index) => allNamedExportNames.indexOf(name) !== index))].sort();

  return {
    namedExportNames,
    namedExports,
    wildcardExportCount,
    namespaceExportCount,
    defaultExportCount,
    duplicateExportNames,
    parseErrorCount: parseErrors.length,
    parseErrors,
    safeSummaryOnly: true,
  };
}

function parseExportListPart(part) {
  const normalized = part.replace(/\s+/gu, " ").trim();
  const alias = normalized.match(new RegExp(`^(${IDENTIFIER}|default)\\s+as\\s+(${IDENTIFIER})$`, "u"));
  if (alias) return { localName: alias[1], exportedName: alias[2] };
  const direct = normalized.match(new RegExp(`^(${IDENTIFIER})$`, "u"));
  if (direct) return { localName: direct[1], exportedName: direct[1] };
  return null;
}

function topLevelExportStatements(source) {
  const statements = [];
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (isWordAt(source, index, "export") && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
      const end = exportStatementEnd(source, index);
      statements.push({ start: index, end, text: source.slice(index, end) });
      index = end - 1;
      continue;
    }
    if (char === "{") braceDepth += 1;
    else if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    else if (char === "(") parenDepth += 1;
    else if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    else if (char === "[") bracketDepth += 1;
    else if (char === "]") bracketDepth = Math.max(0, bracketDepth - 1);
  }
  return statements;
}

function exportStatementEnd(source, start) {
  const declaration = source.slice(start, start + 80);
  if (/^export\s+(?:function|class)\b/u.test(declaration)) {
    return definitionBlockEnd(source, start);
  }
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") braceDepth += 1;
    else if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    else if (char === "(") parenDepth += 1;
    else if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    else if (char === "[") bracketDepth += 1;
    else if (char === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === ";" && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) return index + 1;
    else if (char === "\n" && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
      const prefix = source.slice(start, index);
      if (/^export\s+(?:function|class)\b/u.test(prefix)) return definitionBlockEnd(source, index);
      if (/^export\s+(?:const|let|var)\b/u.test(prefix) && !prefix.includes("=")) return index;
    }
  }
  return source.length;
}

function definitionBlockEnd(source, start) {
  const open = source.indexOf("{", start);
  if (open === -1) return source.length;
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    else if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return index + 1;
    }
  }
  return source.length;
}

function splitTopLevelCommaList(text) {
  const parts = [];
  let start = 0;
  let braceDepth = 0;
  let parenDepth = 0;
  let bracketDepth = 0;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === "{") braceDepth += 1;
    else if (char === "}") braceDepth = Math.max(0, braceDepth - 1);
    else if (char === "(") parenDepth += 1;
    else if (char === ")") parenDepth = Math.max(0, parenDepth - 1);
    else if (char === "[") bracketDepth += 1;
    else if (char === "]") bracketDepth = Math.max(0, bracketDepth - 1);
    else if (char === "," && braceDepth === 0 && parenDepth === 0 && bracketDepth === 0) {
      parts.push(text.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(text.slice(start));
  return parts;
}

function maskNonCode(source) {
  let output = "";
  let mode = "code";
  let quote = "";
  let templateExpressionDepth = 0;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (mode === "code") {
      if (char === "/" && next === "/") {
        output += "  ";
        index += 1;
        mode = "lineComment";
      } else if (char === "/" && next === "*") {
        output += "  ";
        index += 1;
        mode = "blockComment";
      } else if (char === "\"" || char === "'") {
        output += " ";
        quote = char;
        mode = "string";
      } else if (char === "`") {
        output += " ";
        mode = "template";
      } else {
        output += char;
      }
      continue;
    }

    if (mode === "lineComment") {
      if (char === "\n") {
        output += "\n";
        mode = "code";
      } else {
        output += " ";
      }
      continue;
    }

    if (mode === "blockComment") {
      if (char === "*" && next === "/") {
        output += "  ";
        index += 1;
        mode = "code";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (mode === "string") {
      if (char === "\\") {
        output += "  ";
        index += 1;
      } else if (char === quote) {
        output += " ";
        mode = "code";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (mode === "template") {
      if (char === "\\") {
        output += "  ";
        index += 1;
      } else if (char === "`") {
        output += " ";
        mode = "code";
      } else if (char === "$" && next === "{") {
        output += " {";
        index += 1;
        templateExpressionDepth = 1;
        mode = "templateExpression";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (mode === "templateExpression") {
      if (char === "/" && next === "/") {
        output += "  ";
        index += 1;
        mode = "templateExpressionLineComment";
      } else if (char === "/" && next === "*") {
        output += "  ";
        index += 1;
        mode = "templateExpressionBlockComment";
      } else if (char === "\"" || char === "'") {
        output += " ";
        quote = char;
        mode = "templateExpressionString";
      } else if (char === "`") {
        output += " ";
        mode = "templateExpressionNestedTemplate";
      } else {
        if (char === "{") templateExpressionDepth += 1;
        else if (char === "}") {
          templateExpressionDepth -= 1;
          if (templateExpressionDepth === 0) {
            output += "}";
            mode = "template";
            continue;
          }
        }
        output += char;
      }
      continue;
    }

    if (mode === "templateExpressionLineComment") {
      if (char === "\n") {
        output += "\n";
        mode = "templateExpression";
      } else {
        output += " ";
      }
      continue;
    }

    if (mode === "templateExpressionBlockComment") {
      if (char === "*" && next === "/") {
        output += "  ";
        index += 1;
        mode = "templateExpression";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (mode === "templateExpressionString") {
      if (char === "\\") {
        output += "  ";
        index += 1;
      } else if (char === quote) {
        output += " ";
        mode = "templateExpression";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
      continue;
    }

    if (mode === "templateExpressionNestedTemplate") {
      if (char === "\\") {
        output += "  ";
        index += 1;
      } else if (char === "`") {
        output += " ";
        mode = "templateExpression";
      } else {
        output += char === "\n" ? "\n" : " ";
      }
    }
  }

  return output;
}

function isWordAt(source, index, word) {
  return source.slice(index, index + word.length) === word
    && !/[\w$]/u.test(source[index - 1] ?? "")
    && !/[\w$]/u.test(source[index + word.length] ?? "");
}
