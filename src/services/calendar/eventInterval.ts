import { zonedWallTimeToUtc } from "../../utils/timezone";

export type EventIntervalError =
  | "invalidDateFormat"
  | "invalidTimeFormat"
  | "endBeforeStart";

export type EventIntervalResult =
  | { ok: true; startDate: Date; endDate: Date }
  | { ok: false; error: EventIntervalError };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}$/;

/**
 * 같은 날짜의 시작/종료 wall-clock 입력을 검증하고 UTC 구간으로 변환한다.
 * 시계를 사용하지 않으므로 결정적이며, 과거 날짜 검사는 호출자가 담당한다.
 */
export function buildEventInterval(
  dateStr: string,
  startStr: string,
  endStr: string,
  timeZone: string
): EventIntervalResult {
  if (!DATE_RE.test(dateStr)) {
    return { ok: false, error: "invalidDateFormat" };
  }
  if (!TIME_RE.test(startStr) || !TIME_RE.test(endStr)) {
    return { ok: false, error: "invalidTimeFormat" };
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const [startHour, startMinute] = startStr.split(":").map(Number);
  const [endHour, endMinute] = endStr.split(":").map(Number);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return { ok: false, error: "invalidDateFormat" };
  }
  if (
    startHour > 23 ||
    startMinute > 59 ||
    endHour > 23 ||
    endMinute > 59
  ) {
    return { ok: false, error: "invalidTimeFormat" };
  }

  // 존재하지 않는 날짜(예: 2026-02-30)는 Date.UTC 롤오버로 조용히 넘어가므로,
  // 구성요소가 그대로 복원되는지 확인해 거부한다.
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    return { ok: false, error: "invalidDateFormat" };
  }

  const startDate = zonedWallTimeToUtc(
    year,
    month,
    day,
    startHour,
    startMinute,
    timeZone
  );
  const endDate = zonedWallTimeToUtc(
    year,
    month,
    day,
    endHour,
    endMinute,
    timeZone
  );

  if (endDate.getTime() <= startDate.getTime()) {
    return { ok: false, error: "endBeforeStart" };
  }

  return { ok: true, startDate, endDate };
}
