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
- Repaired v1.3.0 authority coherence locally:
  - corrected AGENTS repository profile to IRIS Live2D Renderer;
  - aligned manifest upgrade path, target model, and profile template version with v1.3.0 metadata bridge target semantics;
  - aligned policy profile required/deferred reads with v130 active authority and v129/v128/v127 compatibility reads;
  - rewrote v130 spec language to remove the source-only versus target-completed contradiction;
  - strengthened v130 self-test coverage for repository profile, metadata bridge wording, policy profile reads, and forbidden product/runtime/package/workflow diffs;
  - updated v129/v128/v127 self-tests to validate explicit v130 bridge compatibility instead of requiring legacy versions to remain active.
- Confirmed v130/v129/v128/v127 self-tests pass locally after AUTH2 repair.
- Ran local validation without remote CI. Product tests, diff check, secret scan, planning boundary checks, facade boundary checks, changed harness script syntax checks, and v130/v129/v128/v127 self-tests passed. Full tracked JS/MJS syntax check and local target quality gate did not complete in the local Windows process runner and are recorded as residual verification gaps.

## Milestone History

- v1.2.7 introduced receipt-carried continuation, same-head evidence, validation reuse, stop circuit, and rollback compatibility.
- v1.2.8 target profile rollout was merged before latest v1.3.0 work.
- v1.2.9 target profile rollout was merged before latest v1.3.0 work.
- v1.3.0 Core metadata bridge canary is locally repaired as a metadata bridge target profile candidate. Remote merge remains pending.
- Motion dataset physical extraction has progressed through owner final packets, with 160 of 200 motion-dataset manifest symbols physically moved and audited.
- Public export inventory guard and planning manifest inventory coverage are active and passing.

## Remaining Unresolved Areas

- v1.3.0 authority coherence repair is local-only until owner-approved push/PR/remote CI.
- 40 motion-dataset planning symbols remain pending.
- Actual Cubism SDK/model/dataset owner decision is not started.
- Runtime readiness and production readiness remain false.
