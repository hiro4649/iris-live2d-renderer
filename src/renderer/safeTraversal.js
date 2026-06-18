export const SAFE_TRAVERSAL_LIMITS = Object.freeze({
  maxDepth: 32,
  maxNodes: 20_000,
  maxObjectKeys: 1_000,
  maxArrayLength: 2_000,
  maxStringLength: 65_536,
  rejectPrototypePollutionKeys: true,
});

const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "prototype", "constructor"]);

export function assertSafeTraversal(value, context = "payload", limits = SAFE_TRAVERSAL_LIMITS) {
  const result = validateSafeTraversal(value, limits);
  if (result.ok) return result;
  const error = new Error(`${context}: ${result.errorKind}`);
  error.name = "SafeTraversalError";
  error.code = result.errorKind;
  throw error;
}

export function validateSafeTraversal(value, limits = SAFE_TRAVERSAL_LIMITS) {
  const budget = { ...SAFE_TRAVERSAL_LIMITS, ...(limits ?? {}) };
  const stack = [{ value, depth: 0, ancestors: [] }];
  let nodes = 0;

  while (stack.length > 0) {
    const current = stack.pop();
    const node = current.value;
    nodes += 1;
    if (nodes > budget.maxNodes) return blocked("request_body_too_complex", nodes);
    if (current.depth > budget.maxDepth) return blocked("request_body_too_deep", nodes);

    if (typeof node === "string") {
      if (node.length > budget.maxStringLength) return blocked("request_string_too_large", nodes);
      continue;
    }
    if (!node || typeof node !== "object") continue;
    if (current.ancestors.includes(node)) return blocked("unsafe_payload", nodes);
    const childAncestors = [...current.ancestors, node];

    if (Array.isArray(node)) {
      if (node.length > budget.maxArrayLength) return blocked("request_body_too_complex", nodes);
      for (let index = node.length - 1; index >= 0; index -= 1) {
        stack.push({ value: node[index], depth: current.depth + 1, ancestors: childAncestors });
      }
      continue;
    }

    const entries = Object.entries(node);
    if (entries.length > budget.maxObjectKeys) return blocked("request_body_too_complex", nodes);
    for (let index = entries.length - 1; index >= 0; index -= 1) {
      const [key, child] = entries[index];
      if (budget.rejectPrototypePollutionKeys && PROTOTYPE_POLLUTION_KEYS.has(key)) {
        return blocked("unsafe_payload", nodes);
      }
      stack.push({ value: child, depth: current.depth + 1, ancestors: childAncestors });
    }
  }

  return {
    ok: true,
    schema: "iris_live2d_safe_traversal_result_v1",
    nodeCount: nodes,
    failureLabels: [],
    safeSummaryOnly: true,
  };
}

function blocked(errorKind, nodeCount) {
  return {
    ok: false,
    schema: "iris_live2d_safe_traversal_result_v1",
    errorKind,
    nodeCount,
    failureLabels: [errorKind],
    safeSummaryOnly: true,
  };
}
