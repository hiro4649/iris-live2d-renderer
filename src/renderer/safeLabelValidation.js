export const PROTOTYPE_POLLUTION_KEYS = Object.freeze(["__proto__", "prototype", "constructor"]);

const SAFE_LABEL_PATTERN = /^[a-z0-9][a-z0-9_.:-]{0,95}$/u;
const URL_LIKE_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//iu;
const SECRET_LIKE_PATTERN = /(token|secret|password|bearer|gho_|github_pat_|sk-)/iu;
const SHELL_LIKE_PATTERN = /[;&|`$<>]/u;

export function isPrototypePollutionKey(key) {
  return PROTOTYPE_POLLUTION_KEYS.includes(key);
}

export function isSafeLabelValue(value) {
  if (typeof value !== "string") return false;
  if (!value.trim()) return false;
  if (value !== value.trim()) return false;
  if (/[\u0000-\u001f\u007f]/u.test(value)) return false;
  if (/[\\/]/u.test(value)) return false;
  if (URL_LIKE_PATTERN.test(value)) return false;
  if (SECRET_LIKE_PATTERN.test(value)) return false;
  if (SHELL_LIKE_PATTERN.test(value)) return false;
  return SAFE_LABEL_PATTERN.test(value);
}

export function validateSafeLabelArray(value, {
  allowedLabels,
  missingLabel,
  invalidLabel,
  unknownLabel,
  maxItems = 64,
  maxTotalCharacters = 4096,
} = {}) {
  if (!Array.isArray(value)) return { labels: [], failures: missingLabel ? [missingLabel] : [invalidLabel] };
  const allowed = allowedLabels ? new Set(allowedLabels) : null;
  const failures = [];
  const labels = [];
  const seen = new Set();
  let totalCharacters = 0;

  if (value.length > maxItems) failures.push(invalidLabel);

  for (const item of value) {
    if (!isSafeLabelValue(item)) {
      failures.push(invalidLabel);
      continue;
    }
    totalCharacters += item.length;
    if (totalCharacters > maxTotalCharacters) {
      failures.push(invalidLabel);
      continue;
    }
    if (allowed && !allowed.has(item)) {
      failures.push(unknownLabel || invalidLabel);
      continue;
    }
    if (seen.has(item)) {
      failures.push(invalidLabel);
      continue;
    }
    seen.add(item);
    labels.push(item);
  }

  return { labels, failures };
}

export function validateSafeLabelValue(value, {
  allowedLabels,
  missingLabel,
  invalidLabel,
  unknownLabel,
} = {}) {
  if (value === undefined || value === null) return { label: "", failures: missingLabel ? [missingLabel] : [invalidLabel] };
  if (!isSafeLabelValue(value)) return { label: "", failures: [invalidLabel] };
  if (allowedLabels && !allowedLabels.includes(value)) return { label: "", failures: [unknownLabel || invalidLabel] };
  return { label: value, failures: [] };
}
