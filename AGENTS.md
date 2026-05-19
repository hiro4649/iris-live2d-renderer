## 基本方針

このプロジェクトは IRIS 本体ではなく、Live2D renderer 専用の sibling project として扱う。

IRIS 本体の src / docs / report / 仕様書 / IRIS_SPEC_AUTHORITY.md は変更しない。

最小変更で要求を満たし、無関係な変更をしない。

Git commit はしない。

## Renderer Readiness 境界

R3 human review rules are recorded in `docs/iris-live2d-renderer/REVIEW_POLICY.md`.

renderer_ready=true は、実 Cubism SDK load、model3 load、model_id / scene_id 一致、cue capability 確認、fresh browser heartbeat、last cue applied 成功がすべて揃った場合のみ候補にする。

SDK missing、model missing、heartbeat stale、mock health、cue-only では renderer_ready=false を維持する。

mock health、fixture、cue-only、local bridge を real renderer ready 扱いしない。

## Safe Output

raw cue payload、secret、endpoint 値、raw model path を public / ordinary output へ出さない。

GET /health、GET /status、POST /live2d-engine、POST /cue は safe summary のみ返す。

## 検証

対象 Node 検証のみ実行する。

失敗した検証を隠さない。

## 最終報告

最終報告は原則 1 行で、変更ファイル / 検証結果 / 残リスク のみ返す。

<!-- CODEX_QUALITY_HARNESS_BEGIN -->
## Codex Quality Harness

縺吶∋縺ｦ縺ｮCodex菴懈･ｭ縺ｯ縲∵怙蟆丞ｷｮ蛻・∬ｨｼ諡繝吶・繧ｹ縲￣R蜑肴､懆ｨｼ繧貞ｿ・医→縺吶ｋ縲・
螳溯｣・燕縺ｫ縲∫岼逧・・撼逶ｮ逧・∝女縺大・繧梧擅莉ｶ縲√ユ繧ｹ繝郁ｨ育判縲∵ｮ九Μ繧ｹ繧ｯ繧堤洒縺冗｢ｺ隱阪☆繧九・
莉墓ｧ倥√ユ繧ｹ繝医∝ｮ溯｣・√Μ繝ｪ繝ｼ繧ｹ縺ｮ繝ｬ繝薙Η繝ｼ隕ｳ轤ｹ縺ｯ docs/process/skills 繧貞盾辣ｧ縺吶ｋ縲・
PR蜑阪↓ scripts/codex-local-quality-gate.sh 繧貞ｮ溯｡後☆繧九ょ､ｱ謨励∵悴螳溯｡後√せ繧ｭ繝・・縺ｯPR譛ｬ譁・↓譏手ｨ倥☆繧九・
secret縲｝rivate key縲》oken縲．B URL縲〉aw production log縲〉aw payload繧貞・蜉帙∽ｿ晏ｭ倥…ommit縺励↑縺・・
辟｡髢｢菫ゅ↑繝ｪ繝輔ぃ繧ｯ繧ｿ縲∽ｾ晏ｭ倩ｿｽ蜉縲∝多蜷肴紛逅・∝ｺ・ｯ・峇螟画峩繧呈ｷｷ縺懊↑縺・・

## IRIS Live2D Renderer Readiness Rule

縺薙・繝ｪ繝昴ず繝医Μ縺ｯIRIS譛ｬ菴薙〒縺ｯ縺ｪ縺上´ive2D renderer蟆ら畑縺ｮsibling project縺ｨ縺励※謇ｱ縺・・
IRIS譛ｬ菴鍋畑縺ｮ IRIS_SPEC_AUTHORITY.md 縺ｯ隕∵ｱゅ＠縺ｪ縺・ゅ％縺ｮrepo逶ｴ荳九・ AGENTS.md 縺ｨ renderer readiness rules 繧貞━蜈医☆繧九・
renderer_ready=true 縺ｯ縲∝ｮ欖DK load縲［odel3 load縲［odel_id / scene_id荳閾ｴ縲…ue capability遒ｺ隱阪’resh browser heartbeat縲〕ast cue applied謌仙粥縺梧純縺・ｴ蜷医・縺ｿ蛟呵｣懊↓縺吶ｋ縲・
mock health縲’ixture縲…ue-only縲〕ocal bridge繧池eal renderer ready謇ｱ縺・＠縺ｪ縺・・
raw cue payload縲‘ndpoint蛟､縲〉aw model path縲《ecret繧恥ublic output縺ｸ蜃ｺ縺輔↑縺・・
<!-- CODEX_QUALITY_HARNESS_END -->
