export const RENDERER_ADAPTER_SCHEMA = "iris_live2d_renderer_adapter_v1";

export const RENDERER_ADAPTER_STATUSES = new Set([
  "not_supported",
  "not_initialized",
  "initialized_without_runtime",
  "cue_accepted",
  "visual_application_confirmed",
  "disposed",
  "blocked",
]);

const REQUIRED_METHODS = [
  "getCapabilities",
  "initialize",
  "loadModel",
  "applyCue",
  "update",
  "render",
  "dispose",
];

export function createAdapterResult({
  status = "blocked",
  failureLabel = "blocked",
  visualApplicationConfirmed = false,
  renderFrameSequence = null,
  safeSummaryOnly = true,
} = {}) {
  return assertRendererAdapterResult({
    schema: RENDERER_ADAPTER_SCHEMA,
    status,
    failureLabel: safeFailureLabel(failureLabel),
    visualApplicationConfirmed: visualApplicationConfirmed === true,
    renderFrameSequence: safeFrameSequence(renderFrameSequence),
    safeSummaryOnly: safeSummaryOnly === true,
  });
}

export function assertRendererAdapterShape(adapter) {
  if (!adapter || typeof adapter !== "object" || Array.isArray(adapter)) {
    throw new TypeError("renderer adapter object required");
  }
  for (const method of REQUIRED_METHODS) {
    if (typeof adapter[method] !== "function") {
      throw new TypeError(`renderer adapter missing ${method}`);
    }
  }
  return adapter;
}

export function assertRendererAdapterResult(result) {
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new TypeError("renderer adapter result object required");
  }
  if (hasPrototypePollutionKey(result)) {
    throw new TypeError("renderer adapter result contains unsafe key");
  }
  if (result.schema !== RENDERER_ADAPTER_SCHEMA) {
    throw new TypeError("renderer adapter result schema mismatch");
  }
  if (!RENDERER_ADAPTER_STATUSES.has(result.status)) {
    throw new TypeError("renderer adapter result status not allowed");
  }
  if (result.safeSummaryOnly !== true) {
    throw new TypeError("renderer adapter result must be safe summary only");
  }
  if (typeof result.visualApplicationConfirmed !== "boolean") {
    throw new TypeError("renderer adapter result visual confirmation must be boolean");
  }
  if (result.visualApplicationConfirmed && result.status !== "visual_application_confirmed") {
    throw new TypeError("renderer adapter result visual confirmation status mismatch");
  }
  if (result.renderFrameSequence !== null) {
    if (!Number.isInteger(result.renderFrameSequence) || result.renderFrameSequence <= 0) {
      throw new TypeError("renderer adapter result frame sequence invalid");
    }
  }
  if (result.status === "visual_application_confirmed" && !result.visualApplicationConfirmed) {
    throw new TypeError("renderer adapter visual confirmation missing");
  }
  if (result.status === "visual_application_confirmed" && result.renderFrameSequence === null) {
    throw new TypeError("renderer adapter visual confirmation frame missing");
  }
  return Object.freeze({
    schema: result.schema,
    status: result.status,
    failureLabel: safeFailureLabel(result.failureLabel),
    visualApplicationConfirmed: result.visualApplicationConfirmed,
    renderFrameSequence: result.renderFrameSequence,
    safeSummaryOnly: true,
  });
}

export function createNullRendererAdapter() {
  let initialized = false;
  let disposed = false;
  const notSupported = () => createAdapterResult({
    status: disposed ? "disposed" : "not_supported",
    failureLabel: disposed ? "adapter_disposed" : "runtime_not_available",
  });
  return assertRendererAdapterShape({
    getCapabilities() {
      return Object.freeze({
        schema: RENDERER_ADAPTER_SCHEMA,
        rendererReady: false,
        modelLoadSupported: false,
        cueApplicationSupported: false,
        visualApplicationSupported: false,
        renderLoopSupported: false,
        safeSummaryOnly: true,
      });
    },
    initialize() {
      if (disposed) return createAdapterResult({ status: "disposed", failureLabel: "adapter_disposed" });
      initialized = true;
      return createAdapterResult({
        status: "initialized_without_runtime",
        failureLabel: "runtime_not_available",
      });
    },
    loadModel() {
      return notSupported();
    },
    applyCue() {
      if (!initialized && !disposed) {
        return createAdapterResult({ status: "not_initialized", failureLabel: "adapter_not_initialized" });
      }
      return notSupported();
    },
    update() {
      return notSupported();
    },
    render() {
      return notSupported();
    },
    dispose() {
      disposed = true;
      return createAdapterResult({ status: "disposed", failureLabel: "adapter_disposed" });
    },
  });
}

export function normalizeRendererAdapterResult(result) {
  return assertRendererAdapterResult(result);
}

function safeFailureLabel(value) {
  const text = String(value ?? "").trim();
  return /^[a-z0-9_:-]{1,120}$/u.test(text) ? text : "blocked";
}

function safeFrameSequence(value) {
  if (value === null || value === undefined) return null;
  const frame = Number(value);
  return Number.isInteger(frame) && frame > 0 ? frame : null;
}

function hasPrototypePollutionKey(value) {
  return Object.keys(value).some((key) => key === "__proto__" || key === "prototype" || key === "constructor");
}
