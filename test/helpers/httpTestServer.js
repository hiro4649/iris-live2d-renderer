import assert from "node:assert/strict";
import { createLive2dRendererServer, listen } from "../../src/server.js";

export function createHttpTestServerTools({ assertSafe }) {
  async function assertCueRejected(harness, body, expectedKind, forbiddenFragment, path = "/cue") {
    const before = await harness.getJson("/status");
    const beforeBrowserQueue = await harness.getJson("/renderer/cues");
    const response = await fetch(`${harness.baseUrl}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const responseBody = await response.json();
    assert.equal(response.status, 400);
    assert.equal(responseBody.ok, false);
    assert.equal(responseBody.error_kind, expectedKind);
    const serialized = JSON.stringify(responseBody);
    assertSafe(serialized);
    assert.equal(serialized.includes(`"${forbiddenFragment}"`), false);
    assert.equal(serialized.includes("unsafe_fixture_value"), false);
    const after = await harness.getJson("/status");
    assert.equal(after.received_cue_count, before.received_cue_count);
    assert.equal(after.browser_delivery.pending_cue_count, before.browser_delivery.pending_cue_count);
    assert.equal(after.last_cue_status_hash, before.last_cue_status_hash);
    assert.equal(after.browser_delivery.last_delivered_at, before.browser_delivery.last_delivered_at);
    assert.equal(after.renderer_ready, false);
    const afterBrowserQueue = await harness.getJson("/renderer/cues");
    assert.equal(afterBrowserQueue.pending_cue_count, beforeBrowserQueue.pending_cue_count);
    assert.equal(afterBrowserQueue.cues.length, beforeBrowserQueue.cues.length);
    const queueSerialized = JSON.stringify(afterBrowserQueue);
    assert.equal(queueSerialized, JSON.stringify(beforeBrowserQueue));
    assertSafe(queueSerialized);
    assert.equal(queueSerialized.includes("unsafe_fixture_value"), false);
  }

  async function readSseEvents(baseUrl, { eventName = "", minEvents = 1, timeoutMs = 500 } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(`${baseUrl}/renderer/events`, { signal: controller.signal });
    assert.equal(response.ok, true);
    const contentType = response.headers.get("content-type") || "";
    assert.equal(contentType.includes("text/event-stream"), true);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const events = [];
    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parsed = parseSseEvents(buffer);
        buffer = parsed.remainder;
        events.push(...parsed.events);
        if (eventName && events.some((event) => event.event === eventName)) break;
        if (!eventName && events.length >= minEvents) break;
      }
    } catch (error) {
      if (error?.name !== "AbortError") throw error;
    } finally {
      clearTimeout(timeout);
      controller.abort();
      try {
        await reader.cancel();
      } catch {
        // The client-side abort is the disconnect path under test.
      }
    }

    return { contentType, events };
  }

  function parseSseEvents(buffer) {
    const blocks = buffer.split(/\r?\n\r?\n/u);
    const remainder = blocks.pop() ?? "";
    return {
      remainder,
      events: blocks.map(parseSseEvent).filter(Boolean),
    };
  }

  function parseSseEvent(block) {
    let event = "message";
    const dataLines = [];
    for (const line of block.split(/\r?\n/u)) {
      if (line.startsWith(":")) continue;
      if (line.startsWith("event:")) event = line.slice("event:".length).trim();
      if (line.startsWith("data:")) dataLines.push(line.slice("data:".length).trimStart());
    }
    if (dataLines.length === 0) return null;
    const dataText = dataLines.join("\n");
    const data = JSON.parse(dataText);
    assertSafe(dataText);
    return { event, data };
  }

  async function fetchJsonStatus(target) {
    const response = await fetch(target);
    return {
      status: response.status,
      body: await response.json(),
    };
  }

  async function startHarness(state, options = {}) {
    const server = createLive2dRendererServer({ state, ...options });
    const address = await listen(server, { host: "127.0.0.1", port: 0 });
    const baseUrl = `http://${address.address}:${address.port}`;
    return {
      baseUrl,
      async getJson(path) {
        const response = await fetch(`${baseUrl}${path}`);
        assert.equal(response.ok, true);
        return response.json();
      },
      async getText(path) {
        const response = await fetch(`${baseUrl}${path}`);
        assert.equal(response.ok, true);
        return response.text();
      },
      async postJson(path, body) {
        const response = await fetch(`${baseUrl}${path}`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        });
        assert.equal(response.ok, true);
        return response.json();
      },
      close() {
        return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
      },
    };
  }

  return {
    assertCueRejected,
    fetchJsonStatus,
    readSseEvents,
    startHarness,
  };
}
