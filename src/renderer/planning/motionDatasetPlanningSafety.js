export const LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS = Object.freeze([
  "raw_payload",
  "raw_row",
  "raw_dataset_row",
  "raw_motion_command",
  "raw_cue_payload",
  "raw_renderer_payload",
  "raw_evidence_body",
  "raw_loader_candidate",
  "raw_loader_error",
  "raw_owner_note",
  "owner_private_note",
  "raw_model_path",
  "raw_motion_path",
  "raw_sdk_path",
  "raw_vendor_path",
  "model_path",
  "motion_path",
  "sdk_path",
  "vendor_source",
  "endpoint",
  "endpoint_value",
  "token",
  "token_value",
  "secret",
  "secret_value",
  "private_local_path",
  "command",
  "shell_command_body",
  "world_command",
  "obs_command",
  "game_input",
  "os_command",
  "memory_commit",
  "relationship_commit",
  "raw_process_output",
  "raw_stack_trace",
]);

export function filterSyntheticFixtureCases(value, fallbackCases) {
  const values = Array.isArray(value) ? value : fallbackCases;
  const allowed = new Set(fallbackCases);
  const filtered = values.map((item) => safeMotionDatasetLabel(item, "")).filter((item) => allowed.has(item));
  return filtered.length === fallbackCases.length ? filtered : [...fallbackCases];
}

export function safeSyntheticRejectedCaseLabel(label) {
  const replacements = [
    [/raw_/gu, "unsafe_"],
    [/payload/gu, "material"],
    [/candidate_material/gu, "candidate_summary"],
    [/endpoint/gu, "network"],
    [/token/gu, "credential"],
    [/secret/gu, "credential"],
    [/private_local_path/gu, "local_private_reference"],
    [/private/gu, "local_private_reference"],
    [/_path/gu, "_location"],
    [/command/gu, "instruction"],
    [/game_input/gu, "game_interaction"],
    [/k_memo/gu, "k_note"],
  ];
  return replacements.reduce((current, [pattern, replacement]) => current.replace(pattern, replacement), label);
}

export function detectedMotionDatasetRawFields(source) {
  if (!source || typeof source !== "object") return [];
  const detected = [];
  const rejected = new Set(LIVE2D_MOTION_DATASET_ROW_REJECTED_RAW_FIELDS);
  const stack = [source];
  while (stack.length) {
    const current = stack.pop();
    if (!current || typeof current !== "object") continue;
    for (const [key, value] of Object.entries(current)) {
      const normalizedKey = String(key).replace(/[A-Z]/gu, (ch) => "_" + ch.toLowerCase()).toLowerCase();
      if (rejected.has(key) || rejected.has(normalizedKey) || normalizedKey.startsWith("raw_") || normalizedKey.includes("private") || normalizedKey.includes("token") || normalizedKey.includes("secret")) detected.push(privateMaterialCategory(normalizedKey));
      if (value && typeof value === "object") stack.push(value);
    }
  }
  return [...new Set(detected.filter(Boolean))].sort();
}

export function privateMaterialFieldCategories() {
  return [
    "payload_material",
    "dataset_row_material",
    "motion_instruction_material",
    "cue_material",
    "renderer_material",
    "evidence_material",
    "loader_candidate_material",
    "loader_error_material",
    "owner_note_material",
    "model_location_material",
    "motion_location_material",
    "sdk_location_material",
    "vendor_material",
    "network_location_material",
    "access_material",
    "local_private_material",
    "process_instruction_material",
  ];
}

export function privateMaterialCategory(key) {
  if (key.includes("token") || key.includes("secret")) return "access_material";
  if (key.includes("endpoint")) return "network_location_material";
  if (key.includes("private")) return "local_private_material";
  if (key.includes("owner")) return "owner_note_material";
  if (key.includes("loader_candidate")) return "loader_candidate_material";
  if (key.includes("loader_error")) return "loader_error_material";
  if (key.includes("motion_command") || key.includes("command")) return "process_instruction_material";
  if (key.includes("cue")) return "cue_material";
  if (key.includes("renderer")) return "renderer_material";
  if (key.includes("evidence")) return "evidence_material";
  if (key.includes("sdk")) return "sdk_location_material";
  if (key.includes("vendor")) return "vendor_material";
  if (key.includes("model")) return "model_location_material";
  if (key.includes("motion")) return "motion_location_material";
  if (key.includes("row")) return "dataset_row_material";
  return "payload_material";
}

export function safeMotionDatasetLabel(value, fallback) {
  const text = String(value ?? "").trim();
  if (!text) return fallback;
  return /^[a-z0-9_]{1,80}$/u.test(text) ? text : "unsafe_label";
}
