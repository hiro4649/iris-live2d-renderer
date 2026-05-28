# IRIS Live2D Renderer Reaction Latency Spec

status: draft-spec
risk: R3
scope: docs-only product specification
runtime_readiness_claimed: no
production_readiness_claimed: no

## Low-Latency Reaction Design

IRIS-live2d-renderer は最終的に人間らしい Live2D 視覚リアクションを扱うが、反応速度は reaction type ごとに分離して設計する。安全な非言語 micro-reaction は、LLM の最終回答や TTS 完了を待たずに開始してよい。

ただし runtime readiness は、real SDK load、real model load、cue application、expected model/scene match、fresh browser heartbeat の同一 head 証拠が揃うまで主張しない。fixture success、dry-run success、cue-only success、manifest-only success、stale heartbeat は real readiness に昇格しない。

ここに書く latency target は local renderer target であり、視聴者に見える遅延の保証ではない。YouTube などの配信プラットフォーム遅延は renderer の制御外である。

## Reaction Classes

### instant_nonverbal_reaction

- Purpose: eyes、blink、small nod、soft smile、tiny surprise、attention shift、breathing change。
- Target after internal event arrival: 50 to 300 ms local renderer target。
- Allowed before TTS: yes。
- Requires final LLM answer: no。
- Requires real model loaded for real rendering: yes。未ロード時は fixture/demo status のみ。
- Safety: allowlist only。raw command、model path、endpoint、candidate、world command は扱わない。

### comment_ack_reaction

- Purpose: 発話前に IRIS が user comment に気付いたことを視覚的に示す。
- Target after local comment event arrival: 300 to 800 ms。
- Allowed before full response: yes。
- Examples: look_at_comment、small_nod、soft_smile、blink_attention。
- Constraint: LLM response が pending の間は、comment を完全に理解済みであるかのような表現にしない。

### comment_voice_response

- Purpose: spoken answer with TTS and mouth/body sync。
- Target after local comment event arrival: 1.5 to 4 seconds where feasible。
- Requires: response generation and TTS。
- Flow: 先に安全な nonverbal reaction を出し、その後 TTS cue に合わせて mouth、face、body を同期する。

### game_instant_reaction

- Purpose: hit、win、mistake、rare event、horror event などの game event への高速反応。
- Target after approved local game event arrival: 50 to 300 ms。
- Preferred source: safe game event or approved adapter signal。
- Screen-only recognition: fallback。より遅く、信頼性が低い可能性がある。
- Constraint: game input や OS command を生成しない。

### game_voice_commentary

- Purpose: game moment への spoken commentary。
- Target: perception と TTS に依存する。
- Flow: safe な場合は nonverbal cue を speech より先に出す。
- Low confidence: screen recognition の信頼度が低い場合は uncertain / non-assertive expression に degrade する。

### strong_motion_reaction

- Purpose: laugh_big、surprise_scream、happy_dance、happy_loud_sing、closeup、strong camera move。
- Target: recovery が利用可能な場合のみ素早く開始してよい。
- Recovery plan required: yes。
- Without recovery plan: safe reject。
- Comfort: visibility と viewer comfort を守る。

## Transport Requirements

Current safe baseline:

- Browser cue delivery は polling を使ってよい。
- Polling は browser delivery readiness 前に cue を drain してはならない。
- Polling による追加 latency は contract-first safety の段階では許容する。

Future latency improvement:

- Push-based cue delivery を予定 milestone として追加する。
- Preferred options: Server-Sent Events or WebSocket。
- Goal: polling-scale latency を near-immediate browser delivery に近づける。
- Push channel は safe-summary boundary を維持し、endpoint、token、raw cue payload、model path、command、candidate を公開しない。

## Preload Requirements

- Cubism runtime は stream 開始前に preload する。
- Model3/model assets は safe route のみで読み込む。
- Common expressions、motions、cue mappings は live reaction 前に利用可能にする。
- Internal local model path は公開しない。
- Unavailable model route は advertise しない。
- Real model load と fresh heartbeat evidence が揃うまで runtime readiness を主張しない。

## TTS And Live2D Decoupling

- Nonverbal Live2D reaction は TTS 前に開始してよい。
- TTS response と mouth/body sync は second stage として追従する。
- Voice generation failure は safe visual reaction を壊してはならない。
- Visual reaction は final text が確定する前に finalized spoken content を示唆してはならない。

## Game Reaction Requirements

- Direct safe game event または approved adapter signal がある場合はそれを優先する。
- Screen recognition は fallback とし、より遅く uncertainty-aware に扱う。
- Live2D renderer は game input、OS command、world_command、approved_game_input_action を生成しない。
- Game control はこの renderer の外側に残す。

## Safety Requirements

- Fast reactions は visual-only とする。
- Real model application 前にすべての cues を allowlist validation に通す。
- Unsupported cue は safe reject する。
- Raw motion command は redaction boundary の対象とする。
- Renderer endpoint は redaction boundary の対象とする。
- Model path は redaction boundary の対象とする。
- Fixture cue preview は sanitizer を通す。
- Closeup、laugh、scream、strong motion は recovery が必要。
- Fresh heartbeat と real model evidence が readiness に必要。
- Fixture、dry-run、cue-only、manifest-only evidence から auto readiness へ昇格しない。

## K-Rule Compatibility Summary

この spec は renderer-relevant K rules を safe summary として反映する。unsupported cue safe reject、renderer endpoint redaction、motion command redaction、fixture cue preview sanitizer、cue allowlist、model path redaction、strong motion recovery、real renderer preflight、freshness guard、cue validation、live readiness gate、fixture-vs-real split、fresh evidence gate、evidence collector contract を維持する。
