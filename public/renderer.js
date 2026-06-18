import {
  acceptCueForApplication,
  confirmVisualCueApplication as confirmVisualCueApplicationState,
  createInitialCueLifecycleState,
} from "./rendererCueLifecycle.js";

const HEARTBEAT_INTERVAL_MS = 1_000;
const RENDERER_EVENTS_ROUTE = "/renderer/events";
const BROWSER_BOOTSTRAP_CONFIG_ROUTE = "/renderer/browser-bootstrap-config";
const BROWSER_BOOTSTRAP_REFRESH_MIN_INTERVAL_MS = 30_000;
const MAX_PENDING_BROWSER_CUES = 20;
const MODEL_LOAD_STATUS = new Set([
  "not_configured",
  "asset_route_available",
  "runtime_missing",
  "loader_missing",
  "loading",
  "loaded",
  "failed",
]);
const MODEL_LOAD_ERROR_KIND = new Set([
  "not_configured",
  "asset_route_unavailable",
  "runtime_missing",
  "loader_missing",
  "missing_dependency",
  "operator_attention_required",
  "load_failed",
  "invalid_manifest",
  "unsupported_runtime",
  "unknown",
]);
const LOADER_CAPABILITY_CLASS = new Set([
  "no_runtime",
  "cubism_core_only",
  "loader_detected_untrusted",
  "loader_contract_candidate",
  "trusted_loader_evidence_candidate",
  "trusted_loader_ready_future",
]);
const LOADER_DEPENDENCY_STATUS = new Set([
  "not_configured",
  "missing_dependency",
  "operator_attention_required",
  "candidate_detected",
  "unsupported_runtime",
]);
const SELECTED_CUBISM_LOADER_KIND = "cubism_framework_model_loader_v1";
const FALLBACK_CUBISM_LOADER_KIND = "cubism_moc_create";

export function createInitialRendererState() {
  return {
    modelId: "",
    sceneId: "",
    cubismRuntimeLoaded: false,
    model3Loaded: false,
    sceneLoaded: false,
    realModelLoadSupported: false,
    ...createInitialCueLifecycleState(),
    model3ManifestAvailable: false,
    model3BrowserLoadSupported: false,
    modelAssetRouteAvailable: false,
    modelLoadAttempted: false,
    modelLoadStatus: "not_configured",
    modelLoadErrorKind: "not_configured",
    modelLoadSupported: false,
    modelLoadSucceeded: false,
    modelRuntime: null,
    loaderCapabilityClass: "no_runtime",
    loaderDependencyStatus: "not_configured",
    loaderCandidateKind: "none",
    trustedLoaderEvidence: null,
    cubismRuntimeLoadAttempted: false,
    browserBootstrapConfig: null,
    lastBootstrapRefreshAt: 0,
    bootstrapRefreshInFlight: false,
    eventStreamActive: false,
    eventStreamConnected: false,
    eventStreamFailed: false,
    pendingCues: [],
  };
}

const rendererState = createInitialRendererState();

if (typeof document !== "undefined") {
  startRendererLoop();
}

async function startRendererLoop() {
  await refreshBootstrapConfig();
  startCueEventStream(rendererState);
  await pollCueQueue();
  await postHeartbeat();
  installBootstrapVisibilityRefresh(rendererState);
  setInterval(pollCueQueue, HEARTBEAT_INTERVAL_MS);
  setInterval(postHeartbeat, HEARTBEAT_INTERVAL_MS);
}

async function refreshStatus() {
  const config = await getJson("/renderer/runtime-config");
  rendererState.modelId = config.model_id || "";
  rendererState.sceneId = config.scene_id || "";
  applyRuntimeConfig(rendererState, config, await ensureCubismRuntimeLoaded(config));
  await updateModelLoadEvidence(rendererState, config);
  flushPendingCues(rendererState);
  updateStatusText(rendererState);
}

async function refreshBootstrapConfig(state = rendererState) {
  if (state.bootstrapRefreshInFlight) return state.browserBootstrapConfig;
  state.bootstrapRefreshInFlight = true;
  try {
    const config = await getJson(BROWSER_BOOTSTRAP_CONFIG_ROUTE);
    state.browserBootstrapConfig = config;
    state.lastBootstrapRefreshAt = Date.now();
    const runtimeConfig = runtimeConfigFromBootstrap(config);
    state.modelId = runtimeConfig.model_id || "";
    state.sceneId = runtimeConfig.scene_id || "";
    applyRuntimeConfig(state, runtimeConfig, await ensureCubismRuntimeLoaded(runtimeConfig));
    await updateModelLoadEvidence(state, runtimeConfig);
    flushPendingCues(state);
    updateStatusText(state);
    return config;
  } finally {
    state.bootstrapRefreshInFlight = false;
  }
}

function installBootstrapVisibilityRefresh(state = rendererState, doc = globalThis.document) {
  if (!doc || typeof doc.addEventListener !== "function") return false;
  doc.addEventListener("visibilitychange", () => {
    if (doc.visibilityState !== "visible") return;
    const elapsed = Date.now() - Number(state.lastBootstrapRefreshAt || 0);
    if (elapsed < BROWSER_BOOTSTRAP_REFRESH_MIN_INTERVAL_MS) return;
    refreshBootstrapConfig(state).catch(() => {
      state.lastCueApplyStatus = "bootstrap_refresh_failed";
    });
  });
  return true;
}

function runtimeConfigFromBootstrap(config) {
  return {
    ok: true,
    schema: "iris_live2d_browser_runtime_config_from_bootstrap_v1",
    model_id: config?.model?.id || "",
    scene_id: config?.scene?.id || "",
    cubism_sdk: { status: config?.cubismSdkStatus || "not_configured" },
    model3: {
      configured: Boolean(config?.model?.configured),
      available: config?.modelManifestStatus !== "not_configured",
      manifest_available: config?.modelManifestStatus !== "not_configured",
      status: config?.modelManifestStatus || "not_configured",
      browser_load_supported: Boolean(config?.modelAssetRouteAvailable),
    },
    loader_selection: { status: config?.loaderSelectionStatus || "not_configured" },
    live2d_safe_summary_v2: config?.compactSafeSummary || {},
  };
}

export function applyRuntimeConfig(state, config, cubismRuntimeLoaded = state.cubismRuntimeLoaded) {
  state.modelId = config?.model_id || state.modelId || "";
  state.sceneId = config?.scene_id || state.sceneId || "";
  state.cubismRuntimeLoaded = Boolean(cubismRuntimeLoaded);
  state.model3ManifestAvailable = Boolean(config?.model3?.manifest_available ?? config?.model3?.available);
  state.model3BrowserLoadSupported = Boolean(config?.model3?.browser_load_supported);
  state.modelAssetRouteAvailable = state.model3BrowserLoadSupported;
  state.realModelLoadSupported = false;
  state.model3Loaded = false;
  state.sceneLoaded = false;
  state.loaderCapabilityClass = cubismRuntimeLoaded ? "cubism_core_only" : "no_runtime";
  state.loaderDependencyStatus = cubismRuntimeLoaded ? "missing_dependency" : "not_configured";
  state.loaderCandidateKind = "none";
  state.trustedLoaderEvidence = null;
  return state;
}

export async function updateModelLoadEvidence(
  state,
  config,
  {
    fetchImpl = globalThis.fetch,
    runtimeRoot = globalThis,
  } = {}
) {
  state.modelAssetRouteAvailable = Boolean(config?.model3?.browser_load_supported);

  if (!state.modelAssetRouteAvailable) {
    clearModelLoadSuccess(state);
    setLoaderDiagnostic(state, "no_runtime", "not_configured", "none");
    setModelLoadStatus(state, "not_configured", "asset_route_unavailable");
    return state;
  }
  if (!state.cubismRuntimeLoaded) {
    clearModelLoadSuccess(state);
    setLoaderDiagnostic(state, "no_runtime", "missing_dependency", "none");
    setModelLoadStatus(state, "runtime_missing", "runtime_missing");
    return state;
  }

  const loader = detectCubismModelLoader(runtimeRoot);
  if (!loader) {
    clearModelLoadSuccess(state);
    setLoaderDiagnostic(state, "cubism_core_only", "missing_dependency", "none");
    setModelLoadStatus(state, "loader_missing", "missing_dependency");
    return state;
  }
  if (loader.diagnostic_only || loader.kind !== SELECTED_CUBISM_LOADER_KIND) {
    clearModelLoadSuccess(state);
    setLoaderDiagnostic(state, "loader_detected_untrusted", "operator_attention_required", loader.kind);
    state.trustedLoaderEvidence = createTrustedLoaderEvidenceCandidate(state, loader.kind);
    setModelLoadStatus(state, "loader_missing", "operator_attention_required");
    return state;
  }
  if (state.modelLoadStatus === "loaded" && state.modelRuntime) {
    state.realModelLoadSupported = true;
    state.modelLoadSupported = true;
    state.modelLoadSucceeded = true;
    state.model3Loaded = true;
    state.sceneLoaded = true;
    return state;
  }
  if (state.modelLoadAttempted && state.modelLoadStatus === "failed") {
    clearModelLoadSuccess(state);
    return state;
  }

  state.modelLoadAttempted = true;
  clearModelLoadSuccess(state);
  setModelLoadStatus(state, "loading", "unknown");
  const result = await tryLoadCubismModel({ fetchImpl, loader });
  if (result.ok) {
    state.modelRuntime = result.runtime;
    state.realModelLoadSupported = true;
    state.modelLoadSupported = true;
    state.modelLoadSucceeded = true;
    state.model3Loaded = true;
    state.sceneLoaded = true;
    setModelLoadStatus(state, "loaded", "unknown");
    return state;
  }
  clearModelLoadSuccess(state);
  setModelLoadStatus(state, "failed", result.error_kind || "load_failed");
  return state;
}

export function detectCubismModelLoader(runtimeRoot = globalThis) {
  const framework =
    runtimeRoot?.Live2DCubismFramework?.Live2DCubismFramework ??
    runtimeRoot?.Live2DCubismFramework ??
    runtimeRoot?.CubismFramework ??
    {};
  const cubismMoc = framework.CubismMoc ?? runtimeRoot?.CubismMoc;
  if (cubismMoc && typeof cubismMoc.create === "function") {
    return {
      kind: FALLBACK_CUBISM_LOADER_KIND,
      selected_kind: SELECTED_CUBISM_LOADER_KIND,
      diagnostic_only: true,
      create: cubismMoc.create.bind(cubismMoc),
    };
  }
  return null;
}

async function tryLoadCubismModel({ fetchImpl, loader }) {
  if (typeof fetchImpl !== "function") return { ok: false, error_kind: "unsupported_runtime" };
  const manifestResponse = await safeFetchJson(fetchImpl, "/renderer/model3");
  if (!manifestResponse.ok) return { ok: false, error_kind: "invalid_manifest" };
  const mocToken = manifestResponse.body?.manifest?.FileReferences?.Moc;
  const mocRoute = assetRouteForToken(mocToken);
  if (!mocRoute) return { ok: false, error_kind: "invalid_manifest" };
  try {
    const response = await fetchImpl(mocRoute, { cache: "no-store" });
    if (!response?.ok || typeof response.arrayBuffer !== "function") {
      return { ok: false, error_kind: "load_failed" };
    }
    const mocBuffer = await response.arrayBuffer();
    const moc = loader.create(mocBuffer);
    if (!moc || typeof moc.createModel !== "function") {
      return { ok: false, error_kind: "unsupported_runtime" };
    }
    const model = moc.createModel();
    if (!model) return { ok: false, error_kind: "load_failed" };
    return { ok: true, runtime: { moc, model } };
  } catch {
    return { ok: false, error_kind: "load_failed" };
  }
}

async function safeFetchJson(fetchImpl, path) {
  try {
    const response = await fetchImpl(path, { cache: "no-store" });
    if (!response?.ok || typeof response.json !== "function") return { ok: false, body: null };
    const body = await response.json();
    return { ok: true, body };
  } catch {
    return { ok: false, body: null };
  }
}

function assetRouteForToken(token) {
  const text = String(token ?? "");
  const prefix = "renderer_model_asset:";
  if (!text.startsWith(prefix)) return "";
  const assetId = text.slice(prefix.length);
  if (!/^asset_[a-f0-9]{16}_[a-z0-9]+$/u.test(assetId)) return "";
  return `/renderer/model-asset/${assetId}`;
}

function setModelLoadStatus(state, status, errorKind) {
  state.modelLoadStatus = MODEL_LOAD_STATUS.has(status) ? status : "failed";
  state.modelLoadErrorKind = MODEL_LOAD_ERROR_KIND.has(errorKind) ? errorKind : "unknown";
}

function setLoaderDiagnostic(state, capabilityClass, dependencyStatus, loaderKind) {
  state.loaderCapabilityClass = LOADER_CAPABILITY_CLASS.has(capabilityClass) ? capabilityClass : "loader_detected_untrusted";
  state.loaderDependencyStatus = LOADER_DEPENDENCY_STATUS.has(dependencyStatus) ? dependencyStatus : "operator_attention_required";
  state.loaderCandidateKind = safeLoaderKind(loaderKind);
  if (state.loaderCandidateKind === "none") state.trustedLoaderEvidence = null;
}

function createTrustedLoaderEvidenceCandidate(state, loaderKind, nowMs = Date.now()) {
  return {
    loader_kind: safeLoaderKind(loaderKind),
    loader_version: "operator_supplied_loader_required",
    model_load_session_id: "diagnostic_session",
    safe_manifest_status_hash: "safe_manifest_route_available",
    safe_moc_asset_token_hash: "safe_moc_asset_hash_pending",
    model_id: safeLoaderLabel(state.modelId) || "model_not_configured",
    scene_id: safeLoaderLabel(state.sceneId) || "scene_not_configured",
    loaded_at_ms: nowMs,
    fresh_heartbeat_timestamp_ms: nowMs,
    scene_binding_result: "not_bound",
    cue_capability_result: "not_confirmed",
    last_cue_applied_result: "not_applied",
    server_trusted_policy_gate: false,
  };
}

function clearModelLoadSuccess(state) {
  state.realModelLoadSupported = false;
  state.modelLoadSupported = false;
  state.modelLoadSucceeded = false;
  state.model3Loaded = false;
  state.sceneLoaded = false;
  state.modelRuntime = null;
}

function safeLoaderKind(value) {
  const text = String(value ?? "").trim();
  return /^[a-z0-9_]{1,80}$/u.test(text) ? text : "none";
}

function safeLoaderLabel(value) {
  const text = String(value ?? "").trim();
  return /^[a-zA-Z0-9_.:-]{1,160}$/u.test(text) ? text : "";
}

async function ensureCubismRuntimeLoaded(config) {
  if (globalThis.Live2DCubismCore) return true;
  if (!config.cubism_sdk?.available || rendererState.cubismRuntimeLoadAttempted) return false;
  rendererState.cubismRuntimeLoadAttempted = true;
  await loadScript("/renderer/cubism-core.js");
  return Boolean(globalThis.Live2DCubismCore);
}

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function pollCueQueue() {
  if (rendererState.eventStreamActive || rendererState.eventStreamConnected) return;
  const result = await getJson("/renderer/cues");
  enqueueBrowserCues(rendererState, result.cues || []);
  flushPendingCues(rendererState);
  updateStatusText(rendererState);
}

export function startCueEventStream(state = rendererState, EventSourceCtor = globalThis.EventSource) {
  if (!EventSourceCtor || state.eventStreamActive || state.eventStreamConnected) return false;
  let source;
  try {
    source = new EventSourceCtor(`${RENDERER_EVENTS_ROUTE}?summary=compact`);
  } catch {
    state.eventStreamFailed = true;
    return false;
  }
  if (!source || typeof source.addEventListener !== "function") {
    state.eventStreamFailed = true;
    source?.close?.();
    return false;
  }
  state.eventStreamActive = true;
  state.eventStreamFailed = false;
  source.addEventListener("open", () => {
    state.eventStreamConnected = true;
    state.eventStreamFailed = false;
    updateStatusText(state);
  });
  source.addEventListener("renderer_cues", (event) => {
    handleCueEventMessage(state, event);
  });
  source.addEventListener("error", () => {
    state.eventStreamActive = false;
    state.eventStreamConnected = false;
    state.eventStreamFailed = true;
    source.close();
    updateStatusText(state);
  });
  return true;
}

export function handleCueEventMessage(state, event) {
  const payload = parseEventJson(event?.data);
  enqueueBrowserCues(state, payload.cues || []);
  const result = flushPendingCues(state);
  updateStatusText(state);
  return result;
}

export function enqueueBrowserCues(state, cues) {
  let queued = 0;
  for (const cue of Array.isArray(cues) ? cues : []) {
    if (!cue || typeof cue !== "object" || Array.isArray(cue)) continue;
    state.pendingCues.push(cue);
    queued += 1;
    if (state.pendingCues.length > MAX_PENDING_BROWSER_CUES) state.pendingCues.shift();
  }
  if (queued > 0 && !isReadyForCueApply(state)) state.lastCueApplyStatus = "queued_until_ready";
  return queued;
}

export function flushPendingCues(state, now = Date.now) {
  if (!isReadyForCueApply(state)) {
    state.lastCueApplyStatus = state.pendingCues.length > 0 ? "queued_until_ready" : "not_ready";
    return { accepted_count: 0, accepted_cues: [], pending_cue_count: state.pendingCues.length };
  }
  const acceptedCues = [];
  while (state.pendingCues.length > 0) {
    const cue = state.pendingCues.shift();
    acceptCueForApplication(state, cue, now());
    acceptedCues.push({
      status_hash: state.lastAcceptedCueStatusHash,
      acceptance_status: state.lastCueAcceptanceStatus,
    });
  }
  return { accepted_count: acceptedCues.length, accepted_cues: acceptedCues, pending_cue_count: state.pendingCues.length };
}

export function confirmVisualCueApplication(state = rendererState, receipt = {}) {
  return confirmVisualCueApplicationState(state, receipt);
}

export function isReadyForCueApply(state) {
  return Boolean(state.cubismRuntimeLoaded && state.model3Loaded && state.sceneLoaded);
}

async function postHeartbeat() {
  try {
    await fetch("/renderer/heartbeat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(createHeartbeatPayload(rendererState)),
    });
  } catch {
    rendererState.lastCueApplyStatus = rendererState.pendingCues.length > 0 ? "queued_until_ready" : "heartbeat_failed";
  }
}

export function createHeartbeatPayload(state, nowMs = Date.now()) {
  const readyForCueApply = isReadyForCueApply(state);
  return {
    schema: "iris_live2d_browser_heartbeat_v1",
    model_id: state.modelId,
    scene_id: state.sceneId,
    cubism_runtime_loaded: state.cubismRuntimeLoaded,
    model_asset_route_available: state.modelAssetRouteAvailable,
    model_load_status: state.modelLoadStatus,
    model_load_supported: state.modelLoadSupported,
    model_load_attempted: state.modelLoadAttempted,
    model_load_succeeded: state.modelLoadSucceeded,
    model_load_error_kind: state.modelLoadErrorKind,
    loader_capability_class: state.loaderCapabilityClass,
    loader_dependency_status: state.loaderDependencyStatus,
    loader_candidate_kind: state.loaderCandidateKind,
    trusted_loader_evidence: state.trustedLoaderEvidence || undefined,
    model3_loaded: state.model3Loaded,
    model_loaded: state.model3Loaded,
    real_model_load_supported: state.realModelLoadSupported,
    real_model_loaded: state.realModelLoadSupported && state.model3Loaded,
    scene_loaded: state.sceneLoaded,
    real_scene_loaded: state.realModelLoadSupported && state.sceneLoaded,
    cue_capability: {
      live2d_engine_request: true,
      renderer_cue_delivery: true,
      model_motion_update: readyForCueApply,
      recovery_cue_support: true,
    },
    last_applied_cue_status_hash: state.lastAppliedCueStatusHash,
    last_cue_applied_at_ms: state.lastCueAppliedAt,
    last_cue_apply_status: state.lastCueApplyStatus,
    last_accepted_cue_status_hash: state.lastAcceptedCueStatusHash,
    last_cue_acceptance_status: state.lastCueAcceptanceStatus,
    last_visual_application_status: state.lastVisualApplicationStatus,
    last_visual_application_frame_sequence: state.lastVisualApplicationFrameSequence,
    heartbeat_timestamp_ms: nowMs,
  };
}

async function getJson(path) {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) return {};
    return response.json();
  } catch {
    return {};
  }
}

function updateStatusText(state) {
  if (typeof document === "undefined") return;
  const status = document.querySelector(".status");
  if (!status) return;
  status.textContent = browserStatusText(state);
}

function parseEventJson(data) {
  if (typeof data !== "string") return {};
  try {
    const parsed = JSON.parse(data);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function browserStatusText(state) {
  if (state.pendingCues.length > 0 && !isReadyForCueApply(state)) {
    return "Live2D renderer preserving cue until real model load";
  }
  if (!state.cubismRuntimeLoaded) return "Live2D renderer waiting for Cubism runtime";
  if (state.modelLoadStatus === "loader_missing") return "Live2D renderer waiting for model loader";
  if (state.modelLoadStatus === "loading") return "Live2D renderer loading model";
  if (state.modelLoadStatus === "failed") return "Live2D renderer waiting for valid model load";
  if (!state.model3Loaded || !state.sceneLoaded) return "Live2D renderer waiting for real model load";
  return "Live2D renderer ready to apply cues";
}
