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
CODEX_QUALITY_HARNESS_FILE v0.8.0

## Target Harness Boundary

This repository is a downstream target using Codex Development Harness v0.8.0.
Harness work must stay in harness-managed files unless the task explicitly asks
for product code changes. Preserve project-specific authority and boundary text
outside this block.

## Plan-First Rule

Use plan-first for R3, ambiguous, security-sensitive, migration, release,
dependency, multi-file, or architecture tradeoff work. Keep the plan short and
connect it to affected areas and failure propagation risk.

## Safe Output Rule

Use safe summary only. Do not print raw logs, raw diffs, raw payloads, secret
values, endpoint values, private paths, production data, or personal data.

## Merge-Ready Claim Rule

Do not claim merge-ready unless required gates, current-head evidence, CI replay
where applicable, and human confirmation rules are satisfied.

## Manual Confirmation Limit

Manual confirmation cannot override non-overridable failures: secret scan,
blocked paths, high-confidence sensitive findings, stale evidence, unsafe
output, product/harness scope mixing, or weakened quality gates.

## Profile/Core Separation

Source harness version and profile template version are separate. Target mode
uses CODEX_HARNESS_MODE=target and does not require source profiles unless a
project explicitly opts in.

<!-- CODEX_QUALITY_HARNESS_END -->
