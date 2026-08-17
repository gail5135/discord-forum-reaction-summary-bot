import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";

/**
 * DATA_DIR을 임시 디렉터리로 바꾼 뒤 모듈을 새로 로드한다.
 * forumStore는 모듈 로드 시점에 파일을 읽으므로, 파일 왕복을 검증하려면
 * require 캐시를 비우고 다시 불러와야 한다.
 */
function freshStore(dir: string): typeof import("./forumStore") {
  process.env.DATA_DIR = dir;
  delete require.cache[require.resolve("./forumStore")];
  return require("./forumStore") as typeof import("./forumStore");
}

function tmpDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), "forumstore-"));
}

function record(forumId: string, guildId = "guild-1") {
  return { forumId, guildId, addedAt: "2026-08-17T00:00:00.000Z" };
}

test("adds a forum and reports it as watched", () => {
  const store = freshStore(tmpDir());
  assert.equal(store.add(record("forum-1")), true);
  assert.equal(store.has("forum-1"), true);
  assert.equal(store.all().length, 1);
});

test("ignores a duplicate add", () => {
  const store = freshStore(tmpDir());
  store.add(record("forum-1"));
  assert.equal(store.add(record("forum-1")), false);
  assert.equal(store.all().length, 1);
});

test("removes a forum, and reports a no-op removal", () => {
  const store = freshStore(tmpDir());
  store.add(record("forum-1"));
  assert.equal(store.remove("forum-1"), true);
  assert.equal(store.has("forum-1"), false);
  assert.equal(store.remove("forum-1"), false);
});

test("listByGuild does not mix in other guilds", () => {
  const store = freshStore(tmpDir());
  store.add(record("forum-1", "guild-1"));
  store.add(record("forum-2", "guild-2"));
  store.add(record("forum-3", "guild-1"));

  const guild1 = store.listByGuild("guild-1").map((r) => r.forumId).sort();
  assert.deepEqual(guild1, ["forum-1", "forum-3"]);
  assert.deepEqual(store.listByGuild("guild-2").map((r) => r.forumId), ["forum-2"]);
  assert.deepEqual(store.listByGuild("guild-9"), []);
});

test("survives a reload from disk", () => {
  const dir = tmpDir();
  const first = freshStore(dir);
  first.add(record("forum-1", "guild-1"));

  const second = freshStore(dir);
  assert.equal(second.has("forum-1"), true);
  assert.deepEqual(second.all(), [
    { forumId: "forum-1", guildId: "guild-1", addedAt: "2026-08-17T00:00:00.000Z" },
  ]);
});

test("starts empty when no file exists yet", () => {
  const store = freshStore(tmpDir());
  assert.deepEqual(store.all(), []);
  assert.equal(store.has("forum-1"), false);
});
