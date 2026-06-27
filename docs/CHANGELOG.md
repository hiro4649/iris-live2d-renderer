# Changelog

## 2026-06-27

- Bootstrapped project authority documentation locally:
  - `docs/PROJECT_SPEC.md`
  - `docs/PROJECT_STATUS.md`
  - `docs/NEXT_TASK.md`
  - `docs/CHANGELOG.md`
- Recorded current latest main SHA `cefc2625b3875681b1f0fbc34124e5c7c91ed5b2`.
- Recorded v1.3.0 authority drift discovery for AUTH2.
- Recorded GitHub Actions quota-control status: no push, PR, PR update, remote CI, or merge without owner approval.
- Ran local AUTH1 validation. Product tests, syntax check, diff check, secret scan, planning boundary checks, facade boundary checks, and v130 self-test passed. v129/v128/v127 self-tests failed and are recorded as AUTH2 blockers.

## Milestone History

- v1.2.7 introduced receipt-carried continuation, same-head evidence, validation reuse, stop circuit, and rollback compatibility.
- v1.2.8 target profile rollout was merged before latest v1.3.0 work.
- v1.2.9 target profile rollout was merged before latest v1.3.0 work.
- v1.3.0 Core metadata bridge canary is present on latest main, but authority documents currently disagree on whether v1.3.0 is target-active or source-core only.
- Motion dataset physical extraction has progressed through owner final packets, with 160 of 200 motion-dataset manifest symbols physically moved and audited.
- Public export inventory guard and planning manifest inventory coverage are active and passing.

## Remaining Unresolved Areas

- v1.3.0 authority coherence needs AUTH2 repair.
- 40 motion-dataset planning symbols remain pending.
- Actual Cubism SDK/model/dataset owner decision is not started.
- Runtime readiness and production readiness remain false.
