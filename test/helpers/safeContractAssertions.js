import assert from "node:assert/strict";

export function assertSafe(serialized) {
  assert.equal(serialized.includes("https://secret.example"), false);
  assert.equal(serialized.includes("secret-token"), false);
  assert.equal(serialized.includes("authorization"), false);
  assert.equal(serialized.includes("raw_renderer_payload"), false);
  assert.equal(serialized.includes("raw_motion_command"), false);
  assert.equal(serialized.includes("internal_model_path"), false);
  assert.equal(serialized.includes("motion_path"), false);
  assert.equal(serialized.includes("world_command"), false);
  assert.equal(serialized.includes("input_action_candidate"), false);
  assert.equal(serialized.includes("approved_game_input_action"), false);
  assert.equal(serialized.includes("obs_command"), false);
  assert.equal(serialized.includes("game_input"), false);
  assert.equal(serialized.includes("os_command"), false);
}
