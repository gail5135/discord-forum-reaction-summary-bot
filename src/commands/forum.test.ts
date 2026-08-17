import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

// env.ts가 로드 시점에 요구하는 값들. forum.ts를 require하기 전에 채워야 한다.
process.env.DISCORD_TOKEN = "test-token";
process.env.BOT_TIMEZONE = "UTC";
delete process.env.BOT_LOCALE; // 로케일 인자가 실제로 쓰이는지 확인하기 위해

// forum.ts는 forumStore를 통해 로드 시점에 DATA_DIR/forums.json을 읽는다.
// 실제 data/ 디렉터리를 건드리지 않도록 임시 디렉터리로 격리한다.
process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "forum-cmd-"));

const { formatForumList, formatAddResult } = require("./forum") as typeof import("./forum");

test("renders watched forums as channel mentions", () => {
  const output = formatForumList(["111", "222"], "en");
  assert.match(output, /Watched forums:/);
  assert.match(output, /<#111>/);
  assert.match(output, /<#222>/);
});

test("shows the empty-state message when nothing is watched", () => {
  const output = formatForumList([], "en");
  assert.match(output, /No forums are being watched/);
  assert.doesNotMatch(output, /<#/);
});

test("uses the requested locale", () => {
  const output = formatForumList(["111"], "ko");
  assert.match(output, /감시 중인 포럼/);
  assert.match(output, /<#111>/);
});

test("reports the sweep counts when threads were swept", () => {
  const output = formatAddResult(
    { scanned: 3, created: 2, resynced: 1 },
    { count: 0, hasMore: false },
    "en"
  );
  assert.match(output, /Now watching this forum/);
  assert.match(output, /scanned: 3, created: 2, resynced: 1/);
});

test("explains the empty sweep instead of reporting three zeroes", () => {
  const output = formatAddResult(
    { scanned: 0, created: 0, resynced: 0 },
    { count: 0, hasMore: false },
    "en"
  );
  assert.match(output, /no active threads/i);
  assert.doesNotMatch(output, /scanned: 0/);
});

test("names how many archived posts were left out of the backfill", () => {
  const output = formatAddResult(
    { scanned: 0, created: 0, resynced: 0 },
    { count: 2, hasMore: false },
    "en"
  );
  assert.match(output, /archived \(not backfilled\): 2/);
});

test("marks the archived count as a floor when more pages remain", () => {
  const output = formatAddResult(
    { scanned: 0, created: 0, resynced: 0 },
    { count: 100, hasMore: true },
    "en"
  );
  assert.match(output, /archived \(not backfilled\): 100\+/);
});

test("omits the archived line when there is nothing archived", () => {
  const output = formatAddResult(
    { scanned: 0, created: 0, resynced: 0 },
    { count: 0, hasMore: false },
    "en"
  );
  assert.doesNotMatch(output, /archived/i);
});

test("does not mention archived posts when the sweep found threads", () => {
  const output = formatAddResult(
    { scanned: 3, created: 3, resynced: 0 },
    { count: 5, hasMore: false },
    "en"
  );
  assert.doesNotMatch(output, /archived/i);
});

test("formats the empty-sweep message in the requested locale", () => {
  const output = formatAddResult(
    { scanned: 0, created: 0, resynced: 0 },
    { count: 2, hasMore: false },
    "ko"
  );
  assert.match(output, /활성 스레드가 없어/);
  assert.match(output, /archived \(not backfilled\): 2/);
});
