export const CUE_ACCEPTANCE_STATUS = "accepted_for_application";
export const VISUAL_APPLICATION_CONFIRMED = "visual_application_confirmed";

export function createInitialCueLifecycleState() {
  return {
    lastAcceptedCueStatusHash: "",
    lastCueAcceptedAt: null,
    lastCueAcceptanceStatus: "not_accepted",
    lastVisualApplicationStatus: "not_confirmed",
    lastVisualApplicationFrameSequence: 0,
    lastAppliedCueStatusHash: "",
    lastCueAppliedAt: null,
    lastCueApplyStatus: "not_confirmed",
  };
}

export function acceptCueForApplication(state, cue, nowMs) {
  state.lastAcceptedCueStatusHash = safeStatusHash(cue?.status_hash);
  state.lastCueAcceptedAt = finiteTimestamp(nowMs) ? nowMs : null;
  state.lastCueAcceptanceStatus = CUE_ACCEPTANCE_STATUS;
  state.lastVisualApplicationStatus = "not_confirmed";
  return state;
}

export function confirmVisualCueApplication(state, {
  statusHash,
  appliedAtMs,
  renderFrameSequence,
  adapterReceiptStatus,
} = {}) {
  const hash = safeStatusHash(statusHash);
  const timestamp = Number(appliedAtMs);
  const frame = Number(renderFrameSequence);
  if (!hash || hash !== state.lastAcceptedCueStatusHash) return rejected("visual_application_hash_mismatch");
  if (state.lastAppliedCueStatusHash === hash && state.lastVisualApplicationStatus === VISUAL_APPLICATION_CONFIRMED) {
    return rejected("visual_application_duplicate");
  }
  if (!finiteTimestamp(timestamp)) return rejected("visual_application_invalid_timestamp");
  if (state.lastCueAcceptedAt !== null && timestamp < Number(state.lastCueAcceptedAt)) {
    return rejected("visual_application_out_of_order");
  }
  if (!Number.isInteger(frame) || frame <= Number(state.lastVisualApplicationFrameSequence || 0)) {
    return rejected("visual_application_invalid_frame_sequence");
  }
  if (adapterReceiptStatus !== VISUAL_APPLICATION_CONFIRMED) {
    return rejected("visual_application_receipt_missing");
  }
  state.lastAppliedCueStatusHash = hash;
  state.lastCueAppliedAt = timestamp;
  state.lastCueApplyStatus = "applied";
  state.lastVisualApplicationStatus = VISUAL_APPLICATION_CONFIRMED;
  state.lastVisualApplicationFrameSequence = frame;
  return {
    ok: true,
    status: VISUAL_APPLICATION_CONFIRMED,
    safeSummaryOnly: true,
  };
}

function rejected(reason) {
  return {
    ok: false,
    status: "rejected",
    reason,
    safeSummaryOnly: true,
  };
}

function safeStatusHash(value) {
  const text = String(value ?? "");
  return /^[a-zA-Z0-9_.:-]{1,160}$/u.test(text) ? text : "";
}

function finiteTimestamp(value) {
  return Number.isFinite(Number(value)) && Number(value) >= 0;
}
