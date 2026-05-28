# AGENTS.md

## Renderer Authority Boundary

Unreadable legacy guidance was present in this file. Do not interpret that text
as project authority. For renderer product behavior, runtime readiness, assets,
model loading, or cue behavior, use the repo-local project docs and reviewer
guidance such as `docs/process/CODEX_PROJECT_AUTHORITY_REGISTRY.json` and
`docs/process/skills/renderer-readiness-reviewer.md`. If the relevant authority
is missing, ambiguous, or conflicts with the task, stop and report the risk
instead of inventing rules.

Harness-only work must stay in harness-managed files. Do not modify renderer
source, tests, specs, package files, lockfiles, runtime files, assets, or
`scripts/run-tests.js` unless the project owner explicitly requests product
work and required verification evidence is available.
<!-- CODEX_QUALITY_HARNESS_BEGIN -->
CODEX_QUALITY_HARNESS_FILE v0.9.5

## Codex Target Harness Doctrine

Source harness boundary: this target repository consumes Codex Development Harness v0.9.5 through docs/process/CODEX_HARNESS_MANIFEST.json. Keep AGENTS.md compact: doctrine, routing map, and authority links live here; detailed policy lives in docs/process.

Authority links: docs/process/CODEX_HARNESS_MANIFEST.json, docs/process/CODEX_AGENTS_DOCTRINE_POLICY.md, docs/process/CODEX_SKILL_ROUTING_POLICY.md, docs/process/CODEX_SKILL_LOAD_BUDGET_POLICY.md, docs/process/CODEX_EVIDENCE_MINIMALITY_POLICY.md, docs/process/CODEX_SAFE_ARTIFACT_NEXT_ACTION_SCHEMA.json, docs/process/code_review.md.

Routing map:
- harness_change -> target-harness, evidence-integrity, review-boundary, security-lifecycle.
- workflow_change -> target-harness, security-lifecycle, evidence-integrity, review-boundary.
- product_relevant -> product-verification, review-boundary, evidence-integrity, security-lifecycle.
- runtime_or_tx_relevant -> runtime-safety, state-machine-evidence, receipt-evidence, evidence-integrity.
- docs_only -> review-boundary and evidence-integrity only when needed.

Skill load budget: select only necessary skills, normally four or fewer and never more than five. Do not load raw production traces, raw runtime logs, private paths, endpoints, tokens, secrets, or personal data into skill evidence.

Target rollout boundary: harness-only work must stay in harness-managed files. Do not modify renderer source, tests, specs, package files, lockfiles, runtime files, assets, profiles, or scripts/run-tests.js unless the project owner explicitly requests product work and required verification evidence is available.

Evidence discipline: use safe summaries, same-head evidence, compact PR bodies, evidence dedup, and safe artifact next actions. Do not treat fixture pass, targetQualityScoreStatus, or a passing harness gate as product runtime readiness.

Plan-first: use a short plan for R3, workflow, product-relevant, security, release, runtime, or ambiguous changes before editing.
Safe output: reports and artifacts must be safe-summary only. Do not print raw logs, raw diffs, raw payloads, endpoints, private paths, production data, personal data, tokens, or secrets.
Merge-ready claim: do not claim merge readiness unless current-head target gates, evidence, and required confirmations support it.
Manual confirmation: R3 or owner-gated changes require current-head project-owner confirmation before merge. Manual confirmation cannot override non-overridable failures.
Profile/core separation: target mode keeps profile compatibility off unless the project owner explicitly opts in.

<!-- CODEX_QUALITY_HARNESS_END -->
