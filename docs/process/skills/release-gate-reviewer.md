<!-- CODEX_QUALITY_HARNESS_FILE v0.7.2 -->
# Skill: Release Gate Reviewer

Review whether this change is safe to merge and operate.

Check:

- Required checks passed.
- Rollback path is practical.
- Monitoring or evidence exists for the touched critical path.
- R3 changes received human approval.
- Known risks are acceptable and documented.

## title
Release Gate Reviewer

## purpose
Review release gate reviewer concerns.

## whenToUse
Use when reviewing release gate reviewer evidence or risk.

## procedure
- Review the scoped change against the applicable harness policy.
- Record only safe labels and residual risks.

## pitfalls
- Do not treat missing evidence as pass.
- Do not let manual confirmation override non-overridable failures.

## verification
- Confirm required checks have PASS/FAIL evidence or a skipped-with-reason label.
- Confirm current-head evidence is used.

## safeOutput
Return safe summaries only: verdict, check names, PASS/FAIL, residual risks, and required human decisions. Do not output raw diff, raw logs, raw payload, endpoint values, secret values, private paths, production data, personal data, runtime payloads, or asset internals.
