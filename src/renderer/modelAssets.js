import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, isAbsolute, normalize, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { safeText } from "../contracts.js";

const MANIFEST_EXT = ".model3.json";
const JSON_EXTENSIONS = new Set([
  ".model3.json",
  ".physics3.json",
  ".pose3.json",
  ".exp3.json",
  ".motion3.json",
  ".cdi3.json",
]);
const ASSET_EXTENSIONS = new Set([
  ".moc3",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ...JSON_EXTENSIONS,
]);
const SAFE_ASSET_ID_PATTERN = /^asset_[a-f0-9]{16}_[a-z0-9]+$/u;

export function createSafeModelAssetRegistry(model3JsonPath = "") {
  const configured = Boolean(String(model3JsonPath ?? "").trim());
  if (!configured) return createUnavailableRegistry("not_configured");
  if (!existsSync(model3JsonPath)) return createUnavailableRegistry("missing", true);
  if (extensionFor(model3JsonPath) !== MANIFEST_EXT) {
    return createUnavailableRegistry("unsupported_manifest", true);
  }

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(model3JsonPath, "utf8"));
  } catch {
    return createUnavailableRegistry("invalid", true);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return createUnavailableRegistry("invalid", true);
  }

  try {
    const manifestDir = dirname(resolve(model3JsonPath));
    const assets = new Map();
    const sanitizedManifest = sanitizeModel3ManifestForBrowser(parsed, {
      manifestDir,
      assets,
    });
    return {
      configured: true,
      available: true,
      status: "available",
      sanitizedManifest,
      assets,
    };
  } catch {
    return createUnavailableRegistry("unsafe_manifest", true);
  }
}

export function sanitizeModel3ManifestForBrowser(manifest, { manifestDir, assets } = {}) {
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new Error("invalid_manifest");
  }
  const refs = manifest.FileReferences;
  if (!refs || typeof refs !== "object" || Array.isArray(refs)) {
    throw new Error("invalid_manifest");
  }
  const sanitized = {
    Version: normalizeVersion(manifest.Version),
    FileReferences: {},
    safe_asset_manifest: {
      schema: "iris_live2d_safe_model3_asset_manifest_v1",
      asset_route: "renderer_model_asset",
      safe_asset_ids_only: true,
    },
  };

  const context = { manifestDir, assets };
  setTokenIfPresent(sanitized.FileReferences, "Moc", refs.Moc, context);
  setTokenArrayIfPresent(sanitized.FileReferences, "Textures", refs.Textures, context);
  setTokenIfPresent(sanitized.FileReferences, "Physics", refs.Physics, context);
  setTokenIfPresent(sanitized.FileReferences, "Pose", refs.Pose, context);
  setTokenIfPresent(sanitized.FileReferences, "DisplayInfo", refs.DisplayInfo, context);
  setExpressionRefsIfPresent(sanitized.FileReferences, refs.Expressions, context);
  setMotionRefsIfPresent(sanitized.FileReferences, refs.Motions, context);

  sanitized.safe_asset_manifest.asset_count = assets?.size ?? 0;
  return sanitized;
}

export function resolveSafeModelAsset(registry, assetId) {
  if (!registry?.available || !isSafeModelAssetId(assetId)) return null;
  return registry.assets.get(assetId) ?? null;
}

export function isSafeModelAssetId(assetId) {
  return SAFE_ASSET_ID_PATTERN.test(String(assetId ?? ""));
}

export function contentTypeForModelAsset(asset) {
  switch (asset?.extension) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".moc3":
      return "application/octet-stream";
    default:
      return JSON_EXTENSIONS.has(asset?.extension) ? "application/json; charset=utf-8" : "application/octet-stream";
  }
}

function createUnavailableRegistry(status, configured = false) {
  return {
    configured,
    available: false,
    status,
    sanitizedManifest: null,
    assets: new Map(),
  };
}

function setTokenIfPresent(target, key, value, context) {
  if (value === undefined) return;
  target[key] = createAssetToken(value, context);
}

function setTokenArrayIfPresent(target, key, value, context) {
  if (value === undefined) return;
  if (!Array.isArray(value)) throw new Error("invalid_asset_list");
  target[key] = value.map((entry) => createAssetToken(entry, context));
}

function setExpressionRefsIfPresent(target, value, context) {
  if (value === undefined) return;
  if (!Array.isArray(value)) throw new Error("invalid_expression_list");
  target.Expressions = value.map((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      throw new Error("invalid_expression_ref");
    }
    return {
      Name: safeText(entry.Name ?? entry.name ?? "", 80),
      File: createAssetToken(entry.File, context),
    };
  });
}

function setMotionRefsIfPresent(target, value, context) {
  if (value === undefined) return;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("invalid_motion_refs");
  }
  target.Motions = {};
  for (const [groupName, motions] of Object.entries(value)) {
    if (!Array.isArray(motions)) throw new Error("invalid_motion_group");
    const safeGroupName = safeText(groupName, 80) || "motion_group";
    target.Motions[safeGroupName] = motions.map((entry) => {
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        throw new Error("invalid_motion_ref");
      }
      return {
        File: createAssetToken(entry.File, context),
      };
    });
  }
}

function createAssetToken(rawReference, { manifestDir, assets }) {
  const reference = String(rawReference ?? "").trim();
  const asset = createAssetRecord(reference, manifestDir);
  const existing = assets.get(asset.assetId);
  if (!existing) assets.set(asset.assetId, asset);
  return `renderer_model_asset:${asset.assetId}`;
}

function createAssetRecord(reference, manifestDir) {
  if (!isSafeRelativeReference(reference)) throw new Error("unsafe_asset_reference");
  const extension = extensionFor(reference);
  if (!ASSET_EXTENSIONS.has(extension) || extension === MANIFEST_EXT) {
    throw new Error("unsupported_asset_extension");
  }
  const resolvedPath = resolve(manifestDir, reference);
  const relative = normalize(reference).replace(/\\/gu, "/");
  const root = `${manifestDir}${sep}`;
  if (resolvedPath !== manifestDir && !resolvedPath.startsWith(root)) {
    throw new Error("asset_outside_manifest_dir");
  }
  if (!existsSync(resolvedPath)) throw new Error("asset_missing");
  const assetId = `asset_${createHash("sha256").update(relative).digest("hex").slice(0, 16)}_${extension.slice(1).replace(/[^a-z0-9]/gu, "")}`;
  return {
    assetId,
    filePath: resolvedPath,
    extension,
  };
}

function isSafeRelativeReference(reference) {
  if (!reference || typeof reference !== "string") return false;
  if (/^[a-z][a-z0-9+.-]*:/iu.test(reference)) return false;
  if (isAbsolute(reference)) return false;
  if (reference.includes("\\") || reference.includes("\0")) return false;
  if (reference.split("/").some((part) => part === ".." || part === "")) return false;
  if (pathToFileURL(reference).href.includes("%00")) return false;
  return true;
}

function extensionFor(value) {
  const lower = String(value ?? "").toLowerCase();
  if (lower.endsWith(".model3.json")) return ".model3.json";
  if (lower.endsWith(".physics3.json")) return ".physics3.json";
  if (lower.endsWith(".pose3.json")) return ".pose3.json";
  if (lower.endsWith(".exp3.json")) return ".exp3.json";
  if (lower.endsWith(".motion3.json")) return ".motion3.json";
  if (lower.endsWith(".cdi3.json")) return ".cdi3.json";
  return extname(lower);
}

function normalizeVersion(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 3;
}
