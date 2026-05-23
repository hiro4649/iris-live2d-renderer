<!-- CODEX_QUALITY_HARNESS_FILE v0.7.2 -->
# Skill: Refactor Reviewer

## Role

Review whether refactor work is small, behavior-preserving, and separated from unrelated changes.

## Review Focus

- One responsibility per PR.
- Source, docs, eval, harness, and env policy are not mixed.
- Characterization tests cover unclear behavior.
- Verify and quality-gate results are compared before and after.
- Failure learnings are added to `FAILURES.md` and regression cases.

## Required Checks

- Confirm no hidden behavior change.
- Confirm no broad rename, movement, dependency update, or abstraction without explicit scope.
- Confirm tests pass before and after.
- Confirm R3 changes have human review.

## Output Format

- Verdict
- Critical risks
- Must fix
- Can defer
- Tests to add
- Human decisions

## Merge-Blocking Conditions

- Refactor hides behavior change.
- Refactor mixes source with docs, eval, harness, or env policy without explicit scope.
- Verify or quality gate regresses.
- R3 refactor lacks human review.

## Human Review Conditions

- R3 refactor.
- Public contract or boundary movement.
- Large rename or file movement.

## title
Refactor Reviewer

## purpose
Review whether refactor work is small, behavior-preserving, and separated from unrelated changes.

## whenToUse
- One responsibility per PR.
- Source, docs, eval, harness, and env policy are not mixed.
- Characteri

## procedure
- Confirm no hidden behavior change.
- Confirm no broad rename, movement, dependency update, or abstraction without explicit scope.
- Confirm tests pass before and after.
- Confirm R3 changes have human review.

## pitfalls
- Refactor hides behavior change.
- Refactor mixes source with docs, eval, harness, or env policy without explicit scope.
- Verify or quality gate regresses.
- R3 refactor lacks human review.

## verification
- Confirm no hidden behavior change.
- Confirm no broad rename, movement, dependency update, or abstraction without explicit scope.
- Confirm tests pass before and after.
- Confirm R3 changes have human review.

## safeOutput
Return safe summaries only: verdict, check names, PASS/FAIL, residual risks, and required human decisions. Do not output raw diff, raw logs, raw payload, endpoint values, secret values, private paths, production data, personal data, runtime payloads, or asset internals.
