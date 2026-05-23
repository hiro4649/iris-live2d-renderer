## 蝓ｺ譛ｬ譁ｹ驥・

縺薙・繝励Ο繧ｸ繧ｧ繧ｯ繝医・ IRIS 譛ｬ菴薙〒縺ｯ縺ｪ縺上´ive2D renderer 蟆ら畑縺ｮ sibling project 縺ｨ縺励※謇ｱ縺・・

IRIS 譛ｬ菴薙・ src / docs / report / 莉墓ｧ俶嶌 / IRIS_SPEC_AUTHORITY.md 縺ｯ螟画峩縺励↑縺・・

譛蟆丞､画峩縺ｧ隕∵ｱゅｒ貅縺溘＠縲∫┌髢｢菫ゅ↑螟画峩繧偵＠縺ｪ縺・・

Git commit 縺ｯ縺励↑縺・・

## Renderer Readiness 蠅・阜

renderer_ready=true 縺ｯ縲∝ｮ・Cubism SDK load縲［odel3 load縲［odel_id / scene_id 荳閾ｴ縲…ue capability 遒ｺ隱阪’resh browser heartbeat縲〕ast cue applied 謌仙粥縺後☆縺ｹ縺ｦ謠・▲縺溷ｴ蜷医・縺ｿ蛟呵｣懊↓縺吶ｋ縲・

SDK missing縲［odel missing縲”eartbeat stale縲［ock health縲…ue-only 縺ｧ縺ｯ renderer_ready=false 繧堤ｶｭ謖√☆繧九・

mock health縲’ixture縲…ue-only縲〕ocal bridge 繧・real renderer ready 謇ｱ縺・＠縺ｪ縺・・

## Safe Output

raw cue payload縲《ecret縲‘ndpoint 蛟､縲〉aw model path 繧・public / ordinary output 縺ｸ蜃ｺ縺輔↑縺・・

GET /health縲；ET /status縲￣OST /live2d-engine縲￣OST /cue 縺ｯ safe summary 縺ｮ縺ｿ霑斐☆縲・

## 讀懆ｨｼ

蟇ｾ雎｡ Node 讀懆ｨｼ縺ｮ縺ｿ螳溯｡後☆繧九・

螟ｱ謨励＠縺滓､懆ｨｼ繧帝國縺輔↑縺・・

## 譛邨ょｱ蜻・

譛邨ょｱ蜻翫・蜴溷援 1 陦後〒縲∝､画峩繝輔ぃ繧､繝ｫ / 讀懆ｨｼ邨先棡 / 谿九Μ繧ｹ繧ｯ 縺ｮ縺ｿ霑斐☆縲・

<!-- CODEX_QUALITY_HARNESS_BEGIN -->
<!-- CODEX_QUALITY_HARNESS_FILE v0.7.2 -->
## Codex Quality Harness

Use the repo-local harness files in `docs/process/` and `scripts/codex-*`.
Run the secret scan and local quality gate before reporting merge readiness.
R3 or human-review-required changes need manual confirmation for the current head.
Manual confirmation cannot override secret scan failures, blocked paths, high-confidence secrets, implementation/harness mixing, or profile-required failures.
Production, release, merge-ready, or go/no-go claims require local/remote evidence, residual risks, rollback or merge-after verification, and current-head human confirmation when required.
Keep outputs safe-summary-only: no raw diff, raw logs, raw payload, endpoint value, secret value, private path, production data, or personal data.
Root harness version and profile template version are separate; keep compatible profile-template files at v0.7.0 unless the source profile explicitly changes.

## IRIS Live2D Renderer Readiness Rule

縺薙・繝ｪ繝昴ず繝医Μ縺ｯIRIS譛ｬ菴薙〒縺ｯ縺ｪ縺上´ive2D renderer蟆ら畑縺ｮsibling project縺ｨ縺励※謇ｱ縺・・
IRIS譛ｬ菴鍋畑縺ｮIRIS_SPEC_AUTHORITY.md縺ｯ隕∵ｱゅ＠縺ｪ縺・ゅ％縺ｮrepo逶ｴ荳九・AGENTS.md縺ｨrenderer readiness rules繧貞━蜈医☆繧九・
renderer_ready=true 縺ｯ縲∝ｮ櫃ubism SDK load縲［odel3 load縲［odel_id / scene_id荳閾ｴ縲…ue capability遒ｺ隱阪’resh browser heartbeat縲〕ast cue applied謌仙粥縺後☆縺ｹ縺ｦ謠・▲縺溷ｴ蜷医・縺ｿ蛟呵｣懊↓縺吶ｋ縲・
mock health縲’ixture縲…ue-only縲〕ocal bridge繧池eal renderer ready謇ｱ縺・＠縺ｪ縺・・
raw cue payload縲‘ndpoint蛟､縲〉aw model path縲《ecret繧恥ublic output縺ｸ蜃ｺ縺輔↑縺・・

## OpenAI Codex Method Rule

Use `docs/process/CODEX_TASK_BRIEF_TEMPLATE.md` for non-trivial tasks.
For complex, ambiguous, R3, security, migration, dependency, release, or multi-file work, plan before coding.
PRs must satisfy `docs/process/CODEX_OPENAI_CODEX_METHOD_POLICY.md`.
Reviews should use `docs/process/code_review.md`.
Do not claim merge readiness unless method gate, quality gate, and required checks pass.

## Structured Evidence and CI Replay Rule

Root harness version is v0.7.2. Profile templates remain v0.7.0 compatible unless a project propagation task explicitly says otherwise.
Do not bump `profiles/*` to v0.7.2 only to satisfy source validation.
Prefer structured evidence pack, structured human confirmation, CI replay, and PR body lint results over prose-only evidence where available.
Do not claim production ready, release ready, merge ready, go/no-go, renderer ready, or equivalent production/shipping wording without checkable evidence.
Use safe summary only: no raw diff, raw logs, raw payload, endpoint value, secret value, private path, raw model path, production data, personal data, or raw cue payload.
Manual confirmation cannot override non-overridable failures such as secret scan failure, blocked paths, high-confidence secret findings, implementation/harness mixing, profile required check failure, OpenAI method gate failure, stale evidence, or unsafe output.
For R3, security, release, dependency, migration, renderer runtime, asset, or multi-file work, keep plan-first evidence, review evidence, residual risks, and rollback or stop condition visible.

<!-- CODEX_QUALITY_HARNESS_END -->
