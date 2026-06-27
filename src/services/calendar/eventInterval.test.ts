import assert from "node:assert/strict";
import { test } from "node:test";

import { buildEventInterval } from "./eventInterval";

test("builds a valid same-day interval in JST", () => {
  const r = buildEventInterval("2026-07-01", "19:00", "21:00", "Asia/Tokyo");
  assert.ok(r.ok);
  if (r.ok) {
    assert.equal(r.startDate.toISOString(), "2026-07-01T10:00:00.000Z");
    assert.equal(r.endDate.toISOString(), "2026-07-01T12:00:00.000Z");
  }
});

test("rejects end equal to start", () => {
  const r = buildEventInterval("2026-07-01", "19:00", "19:00", "Asia/Tokyo");
  assert.deepEqual(r, { ok: false, error: "endBeforeStart" });
});

test("rejects end before start", () => {
  const r = buildEventInterval("2026-07-01", "21:00", "19:00", "Asia/Tokyo");
  assert.deepEqual(r, { ok: false, error: "endBeforeStart" });
});

test("rejects malformed date", () => {
  const r = buildEventInterval("2026/07/01", "19:00", "21:00", "Asia/Tokyo");
  assert.deepEqual(r, { ok: false, error: "invalidDateFormat" });
});

test("rejects malformed time", () => {
  const r = buildEventInterval("2026-07-01", "7:00", "21:00", "Asia/Tokyo");
  assert.deepEqual(r, { ok: false, error: "invalidTimeFormat" });
});

test("rejects out-of-range hour or minute", () => {
  assert.deepEqual(
    buildEventInterval("2026-07-01", "25:00", "26:00", "Asia/Tokyo"),
    { ok: false, error: "invalidTimeFormat" }
  );
  assert.deepEqual(
    buildEventInterval("2026-07-01", "19:60", "21:00", "Asia/Tokyo"),
    { ok: false, error: "invalidTimeFormat" }
  );
});

test("rejects malformed or out-of-range end time (valid start)", () => {
  assert.deepEqual(
    buildEventInterval("2026-07-01", "19:00", "9:00", "Asia/Tokyo"),
    { ok: false, error: "invalidTimeFormat" }
  );
  assert.deepEqual(
    buildEventInterval("2026-07-01", "19:00", "25:00", "Asia/Tokyo"),
    { ok: false, error: "invalidTimeFormat" }
  );
});

test("rejects out-of-range month or day", () => {
  assert.deepEqual(
    buildEventInterval("2026-13-01", "19:00", "21:00", "Asia/Tokyo"),
    { ok: false, error: "invalidDateFormat" }
  );
  assert.deepEqual(
    buildEventInterval("2026-07-32", "19:00", "21:00", "Asia/Tokyo"),
    { ok: false, error: "invalidDateFormat" }
  );
});

test("rejects impossible but well-formed date", () => {
  const r = buildEventInterval("2026-02-30", "19:00", "21:00", "Asia/Tokyo");
  assert.deepEqual(r, { ok: false, error: "invalidDateFormat" });
});
