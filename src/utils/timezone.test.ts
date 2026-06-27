import assert from "node:assert/strict";
import { test } from "node:test";

import { isValidTimeZone, zonedWallTimeToUtc } from "./timezone";

test("converts JST wall time to the correct UTC instant", () => {
  // The original bug: a Japanese user's 19:00 was registered as 19:00 UTC.
  const utc = zonedWallTimeToUtc(2026, 7, 1, 19, 0, "Asia/Tokyo");
  assert.equal(utc.toISOString(), "2026-07-01T10:00:00.000Z");
});

test("handles a non-DST half-hour offset zone", () => {
  // Asia/Kolkata is UTC+5:30 year-round.
  const utc = zonedWallTimeToUtc(2026, 7, 1, 12, 0, "Asia/Kolkata");
  assert.equal(utc.toISOString(), "2026-07-01T06:30:00.000Z");
});

test("applies the correct offset on each side of a DST boundary", () => {
  // America/New_York: EST (UTC-5) in winter, EDT (UTC-4) in summer.
  const winter = zonedWallTimeToUtc(2026, 1, 15, 9, 0, "America/New_York");
  assert.equal(winter.toISOString(), "2026-01-15T14:00:00.000Z");

  const summer = zonedWallTimeToUtc(2026, 7, 15, 9, 0, "America/New_York");
  assert.equal(summer.toISOString(), "2026-07-15T13:00:00.000Z");
});

test("produces a valid instant for a spring-forward gap (nonexistent wall time)", () => {
  // 2026-03-08 02:30 does not exist in America/New_York (clocks jump 02:00->03:00).
  const utc = zonedWallTimeToUtc(2026, 3, 8, 2, 30, "America/New_York");
  assert.ok(!Number.isNaN(utc.getTime()));
});

test("produces a valid instant for a fall-back overlap (ambiguous wall time)", () => {
  // 2026-11-01 01:30 occurs twice in America/New_York.
  const utc = zonedWallTimeToUtc(2026, 11, 1, 1, 30, "America/New_York");
  assert.ok(!Number.isNaN(utc.getTime()));
});

test("treats UTC input as an identity conversion", () => {
  const utc = zonedWallTimeToUtc(2026, 7, 1, 19, 0, "UTC");
  assert.equal(utc.toISOString(), "2026-07-01T19:00:00.000Z");
});

test("isValidTimeZone accepts real IANA zones and rejects junk", () => {
  assert.equal(isValidTimeZone("Asia/Tokyo"), true);
  assert.equal(isValidTimeZone("UTC"), true);
  assert.equal(isValidTimeZone("Not/AZone"), false);
  assert.equal(isValidTimeZone(""), false);
});
