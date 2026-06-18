const RENDERER_ADAPTER_SCHEMA = "iris_live2d_renderer_adapter_v1";
const ALLOWED_STATUS = new Set([
  "not_supported",
  "not_initialized",
  "initialized_without_runtime",
  "cue_accepted",
  "visual_application_confirmed",
  "disposed",
  "blocked",
]);

export function createNullRendererAdapter() {
  let initialized = false;
  let disposed = false;
  const notSupported = () => result({
    status: disposed ? "disposed" : "not_supported",
    failureLabel: disposed ? "adapter_disposed" : "runtime_not_available",
  });
  return Object.freeze({
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
      if (disposed) return result({ status: "disposed", failureLabel: "adapter_disposed" });
      initialized = true;
      return result({
        status: "initialized_without_runtime",
        failureLabel: "runtime_not_available",
      });
    },
    loadModel() {
      return notSupported();
    },
    applyCue() {
      if (!initialized && !disposed) {
        return result({ status: "not_initialized", failureLabel: "adapter_not_initialized" });
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
      return result({ status: "disposed", failureLabel: "adapter_disposed" });
    },
  });
}

export function normalizeRendererAdapterResult(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return blocked();
  if (Object.keys(value).some((key) => key === "__proto__" || key === "prototype" || key === "constructor")) {
    return blocked("unsafe_adapter_result");
  }
  const status = ALLOWED_STATUS.has(value.status) ? value.status : "blocked";
  const visualApplicationConfirmed =
    value.visualApplicationConfirmed === true && status === "visual_application_confirmed";
  const frame = Number(value.renderFrameSequence);
  const renderFrameSequence =
    visualApplicationConfirmed && Number.isInteger(frame) && frame > 0 ? frame : null;
  return Object.freeze({
    schema: RENDERER_ADAPTER_SCHEMA,
    status: visualApplicationConfirmed ? "visual_application_confirmed" : status,
    failureLabel: safeFailureLabel(value.failureLabel),
    visualApplicationConfirmed,
    renderFrameSequence,
    safeSummaryOnly: true,
  });
}

function result(value) {
  return normalizeRendererAdapterResult({
    schema: RENDERER_ADAPTER_SCHEMA,
    visualApplicationConfirmed: false,
    renderFrameSequence: null,
    safeSummaryOnly: true,
    ...value,
  });
}

function blocked(failureLabel = "blocked") {
  return Object.freeze({
    schema: RENDERER_ADAPTER_SCHEMA,
    status: "blocked",
    failureLabel,
    visualApplicationConfirmed: false,
    renderFrameSequence: null,
    safeSummaryOnly: true,
  });
}

function safeFailureLabel(value) {
  const text = String(value ?? "").trim();
  return /^[a-z0-9_:-]{1,120}$/u.test(text) ? text : "blocked";
}
