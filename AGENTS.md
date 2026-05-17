## 基本方針

このプロジェクトは IRIS 本体ではなく、Live2D renderer 専用の sibling project として扱う。

IRIS 本体の src / docs / report / 仕様書 / IRIS_SPEC_AUTHORITY.md は変更しない。

最小変更で要求を満たし、無関係な変更をしない。

Git commit はしない。

## Renderer Readiness 境界

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

すべてのCodex作業は、最小差分、証拠ベース、PR前検証を必須とする。

実装前に、目的、非目的、受け入れ条件、テスト計画、残リスクを短く確認する。

仕様、テスト、実装、リリースのレビュー観点は docs/process/skills を参照する。

PR前に scripts/codex-local-quality-gate.sh を実行する。失敗、未実行、スキップはPR本文に明記する。

secret、private key、token、DB URL、raw production log、raw payloadを出力、保存、commitしない。

無関係なリファクタ、依存追加、命名整理、広範囲変更を混ぜない。

## IRIS Live2D Renderer Readiness Rule

このリポジトリはIRIS本体ではなく、Live2D renderer専用のsibling projectとして扱う。

IRIS本体用の IRIS_SPEC_AUTHORITY.md は要求しない。このrepo直下の AGENTS.md と renderer readiness rules を優先する。

renderer_ready=true は、実SDK load、model3 load、model_id / scene_id一致、cue capability確認、fresh browser heartbeat、last cue applied成功が揃う場合のみ候補にする。

mock health、fixture、cue-only、local bridgeをreal renderer ready扱いしない。

raw cue payload、endpoint値、raw model path、secretをpublic outputへ出さない。
<!-- CODEX_QUALITY_HARNESS_END -->
