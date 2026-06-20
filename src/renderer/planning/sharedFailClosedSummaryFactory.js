import { assertSafePublicObject, createBoundaryPolicy } from "../../contracts.js";

const LOCKED_FAIL_CLOSED_SUMMARY_STATE = Object.freeze({
  owner_confirmation_required: true,
  owner_confirmation_created: false,
  owner_confirmation_confirmed: false,
  actual_data_preauthorized: false,
  actual_data_task_started: false,
  actual_data_accepted: false,
  owner_submission_received: false,
  owner_submission_accepted: false,
  quarantine_completed: false,
  redaction_scan_executed: false,
  audit_execution_started: false,
  real_ingestion_audit_event_created: false,
  rollback_ready: false,
  external_action_performed: false,
  parser_dry_run_executed: false,
  row_body_parser_enabled: false,
  row_body_parser_executed: false,
  actual_file_read: false,
  actual_hash_calculated: false,
  actual_row_content_accepted: false,
  row_body_read: false,
  real_row_data_present: false,
  checked_row_count: 0,
  actual_ingestion_allowed: false,
  motion_dataset_executable: false,
  renderer_ready: false,
  model_loaded: false,
  scene_loaded: false,
  browser_cue_delivery_ready: false,
  runtime_readiness_claimed: false,
  production_readiness_claimed: false,
  priority1_status: "BLOCKED",
  go_nogo_status: "no_go",
  go_candidate: false,
  blocker_resolved: false,
});

const SAFE_FALSE_ONLY_CONFIG_KEYS = Object.freeze([
  "trusted_loader_allowlist_enabled",
  "trusted_loader_enabled",
  "renderer_ready_claimed",
  "source_hash_verified",
  "declared_row_count_checked",
  "parser_execution",
  "redaction_scan_execution",
  "audit_execution",
]);

const PROTOTYPE_POLLUTION_KEYS = Object.freeze([
  "__proto__",
  "prototype",
  "constructor",
]);

const ALLOWED_CONFIG_KEYS = Object.freeze([
  "schema",
  "statusKey",
  "status",
  "boundaries",
  "flags",
  "arrays",
  "blockedReasons",
  "safeNextAction",
  "context",
]);

const RESERVED_STATUS_KEYS = Object.freeze([
  "__proto__",
  "prototype",
  "constructor",
  "schema",
  "planning_only_boundary",
  "blocked_reasons",
  "safe_next_action",
  "boundary_policy",
  ...Object.keys(LOCKED_FAIL_CLOSED_SUMMARY_STATE),
  ...SAFE_FALSE_ONLY_CONFIG_KEYS,
]);

function createSafeConfigError(code) {
  const error = new TypeError(code);
  error.code = code;
  return error;
}

function isPlainDataObject(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validatePlainConfigSection(value) {
  if (value === undefined) return {};
  if (!isPlainDataObject(value)) {
    throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_SECTION_NOT_PLAIN");
  }
  if (Reflect.ownKeys(value).some((key) => typeof key === "symbol")) {
    throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_SYMBOL_KEY_REJECTED");
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (descriptor.get || descriptor.set) {
      throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_ACCESSOR_REJECTED");
    }
    if (PROTOTYPE_POLLUTION_KEYS.includes(key)) {
      throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_PROTOTYPE_KEY_REJECTED");
    }
  }
  return value;
}

function validateStringField(value, code, pattern = /[\s\S]+/) {
  if (typeof value !== "string" || !pattern.test(value)) {
    throw createSafeConfigError(code);
  }
  return value;
}

function validateBlockedReasons(value) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_BLOCKED_REASONS_INVALID");
  }
  if (!value.every((item) => typeof item === "string" && item.length > 0)) {
    throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_BLOCKED_REASONS_INVALID");
  }
  return value;
}

function validateFailClosedSummaryConfig(config) {
  if (!isPlainDataObject(config)) {
    throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_NOT_PLAIN");
  }
  if (Reflect.ownKeys(config).some((key) => typeof key === "symbol")) {
    throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_SYMBOL_KEY_REJECTED");
  }
  const descriptors = Object.getOwnPropertyDescriptors(config);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if (descriptor.get || descriptor.set) {
      throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_ACCESSOR_REJECTED");
    }
    if (PROTOTYPE_POLLUTION_KEYS.includes(key)) {
      throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_PROTOTYPE_KEY_REJECTED");
    }
    if (!ALLOWED_CONFIG_KEYS.includes(key)) {
      throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_UNKNOWN_KEY");
    }
  }

  const schema = validateStringField(config.schema, "ERR_LIVE2D_PLANNING_CONFIG_SCHEMA_INVALID");
  const statusKey = validateStringField(config.statusKey, "ERR_LIVE2D_PLANNING_CONFIG_STATUS_KEY_INVALID");
  if (RESERVED_STATUS_KEYS.includes(statusKey)) {
    throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_STATUS_KEY_RESERVED");
  }
  if (!/^[a-z][a-z0-9_]*_status$/.test(statusKey)) {
    throw createSafeConfigError("ERR_LIVE2D_PLANNING_CONFIG_STATUS_KEY_INVALID");
  }
  const status = validateStringField(config.status, "ERR_LIVE2D_PLANNING_CONFIG_STATUS_INVALID");
  const safeNextAction = validateStringField(config.safeNextAction, "ERR_LIVE2D_PLANNING_CONFIG_SAFE_NEXT_ACTION_INVALID");
  const context = validateStringField(config.context, "ERR_LIVE2D_PLANNING_CONFIG_CONTEXT_INVALID");

  return {
    schema,
    statusKey,
    status,
    boundaries: validatePlainConfigSection(config.boundaries),
    flags: validatePlainConfigSection(config.flags),
    arrays: validatePlainConfigSection(config.arrays),
    blockedReasons: validateBlockedReasons(config.blockedReasons),
    safeNextAction,
    context,
  };
}

function unsafeConfigReasonCodes(statusKey, configs) {
  const reasonPrefix = statusKey.replace(/_status$/, "");
  const reasons = [];
  for (const [configName, config] of configs) {
    const source = config;
    for (const key of Object.keys(source)) {
      if (PROTOTYPE_POLLUTION_KEYS.includes(key)) {
        reasons.push(`${reasonPrefix}_rejected_${configName}_prototype_pollution_key`);
      }
      if (Object.hasOwn(LOCKED_FAIL_CLOSED_SUMMARY_STATE, key) && source[key] !== LOCKED_FAIL_CLOSED_SUMMARY_STATE[key]) {
        reasons.push(`${reasonPrefix}_rejected_${configName}_${key}_unsafe_promotion`);
      }
      if (SAFE_FALSE_ONLY_CONFIG_KEYS.includes(key) && source[key] !== false) {
        reasons.push(`${reasonPrefix}_rejected_${configName}_${key}_unsafe_promotion`);
      }
      if ([
        "schema",
        statusKey,
        "planning_only_boundary",
        "blocked_reasons",
        "safe_next_action",
        "boundary_policy",
      ].includes(key)) {
        reasons.push(`${reasonPrefix}_rejected_${configName}_${key}_summary_identity_override`);
      }
    }
  }
  return [...new Set(reasons)];
}

// Shared planning-only fail-closed summary factory.
// It never executes parser, audit, renderer, loader, file, hash, or ingestion work.
export function createMotionDatasetPlanningOnlyGateSummary(config, input = {}) {
  const {
    schema,
    statusKey,
    status,
    boundaries,
    flags,
    arrays,
    blockedReasons,
    safeNextAction,
    context,
  } = validateFailClosedSummaryConfig(config);
  const source = input && typeof input === "object" ? input : {};
  const rejectedAttempt = Boolean(
    source.owner_confirmation_created ||
      source.owner_confirmation_confirmed ||
      source.actual_data_preauthorized ||
      source.actual_data_task_started ||
      source.actual_data_accepted ||
      source.owner_submission_received ||
      source.owner_submission_accepted ||
      source.quarantine_completed ||
      source.redaction_scan_executed ||
      source.audit_execution_started ||
      source.real_ingestion_audit_event_created ||
      source.rollback_ready ||
      source.external_action_performed ||
      source.parser_dry_run_executed ||
      source.row_body_parser_enabled ||
      source.row_body_parser_executed ||
      source.actual_file_read ||
      source.actual_hash_calculated ||
      source.actual_row_content_accepted ||
      source.row_body_read ||
      source.real_row_data_present ||
      source.actual_ingestion_allowed ||
      Number(source.checked_row_count ?? 0) > 0 ||
      source.motion_dataset_executable ||
      source.runtime_readiness_claimed ||
      source.production_readiness_claimed ||
      source.blocker_resolved ||
      source.go_candidate ||
      source.priority1_status === "RESOLVED" ||
      source.go_nogo_status === "go"
  );
  const configRejectionReasons = unsafeConfigReasonCodes(statusKey, [
    ["boundaries", boundaries],
    ["flags", flags],
    ["arrays", arrays],
  ]);
  const summary = {
    schema,
    [statusKey]: status,
    planning_only_boundary: true,
    ...boundaries,
    ...LOCKED_FAIL_CLOSED_SUMMARY_STATE,
    ...flags,
    ...arrays,
    blocked_reasons: [...new Set([
      ...blockedReasons,
      ...configRejectionReasons,
      ...(rejectedAttempt ? [statusKey.replace(/_status$/, "_rejected_state_promotion")] : []),
    ])],
    safe_next_action: safeNextAction,
    boundary_policy: {
      ...createBoundaryPolicy(),
      planning_only: true,
      no_owner_confirmation_created: true,
      no_owner_confirmation_confirmed: true,
      no_actual_data_preauthorized: true,
      no_actual_data_task_started: true,
      no_actual_data_accepted: true,
      no_real_row_ingestion: true,
      no_row_body_read: true,
      no_motion_execution: true,
      no_runtime_readiness_claim: true,
      no_production_readiness_claim: true,
    },
  };
  Object.assign(summary, {
    schema,
    [statusKey]: status,
    planning_only_boundary: true,
    ...LOCKED_FAIL_CLOSED_SUMMARY_STATE,
  });
  for (const key of SAFE_FALSE_ONLY_CONFIG_KEYS) {
    if (Object.hasOwn(summary, key)) summary[key] = false;
  }
  assertSafePublicObject(summary, context);
  return summary;
}
