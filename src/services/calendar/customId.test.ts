import assert from "node:assert/strict";
import { test } from "node:test";

import {
  CHANNEL_SELECT_PREFIX,
  MODAL_PREFIX,
  OPEN_MODAL_PREFIX,
  CANCEL_ID,
  encodeChannelSelectId,
  parseChannelSelectId,
  encodeModalId,
  parseModalId,
  encodeOpenModalId,
  parseOpenModalId,
} from "./customId";

test("channel select id round-trips", () => {
  const id = encodeChannelSelectId("111", "222");
  assert.ok(id.startsWith(CHANNEL_SELECT_PREFIX));
  assert.deepEqual(parseChannelSelectId(id), {
    sourceChannelId: "111",
    sourceMessageId: "222",
  });
});

test("modal id round-trips", () => {
  const id = encodeModalId("999", "111", "222");
  assert.ok(id.startsWith(MODAL_PREFIX));
  assert.deepEqual(parseModalId(id), {
    voiceChannelId: "999",
    sourceChannelId: "111",
    sourceMessageId: "222",
  });
});

test("open modal button id round-trips", () => {
  const id = encodeOpenModalId("999", "111", "222");
  assert.ok(id.startsWith(OPEN_MODAL_PREFIX));
  assert.deepEqual(parseOpenModalId(id), {
    voiceChannelId: "999",
    sourceChannelId: "111",
    sourceMessageId: "222",
  });
});

test("open modal and modal prefixes do not cross-parse", () => {
  // OPEN_MODAL_PREFIX와 MODAL_PREFIX는 서로 다른 인터랙션(버튼 vs 모달 제출)이므로
  // 서로의 id를 파싱하면 안 된다.
  assert.equal(parseModalId(encodeOpenModalId("9", "1", "2")), null);
  assert.equal(parseOpenModalId(encodeModalId("9", "1", "2")), null);
});

test("parseOpenModalId rejects malformed input", () => {
  assert.equal(parseOpenModalId("calendar_open_modal:9:1"), null);
  assert.equal(parseOpenModalId("calendar_modal:9:1:2"), null);
  assert.equal(parseOpenModalId("garbage"), null);
});

test("CANCEL_ID is a stable static custom id", () => {
  assert.equal(CANCEL_ID, "calendar_cancel");
});

test("encoded ids stay within the 100-char customId limit", () => {
  // 실제 스노우플레이크는 최대 20자리. 여유 있게 20자리로 검증.
  const big = "1".repeat(20);
  assert.ok(encodeChannelSelectId(big, big).length <= 100);
  assert.ok(encodeModalId(big, big, big).length <= 100);
  assert.ok(encodeOpenModalId(big, big, big).length <= 100);
});

test("parseChannelSelectId rejects malformed input", () => {
  assert.equal(parseChannelSelectId("calendar_modal:9:1:2"), null);
  assert.equal(parseChannelSelectId("calendar_channel_select:only-one"), null);
  assert.equal(parseChannelSelectId("garbage"), null);
});

test("parseModalId rejects malformed input", () => {
  assert.equal(parseModalId("calendar_channel_select:1:2"), null);
  assert.equal(parseModalId("calendar_modal:9:1"), null);
  assert.equal(parseModalId("garbage"), null);
});
