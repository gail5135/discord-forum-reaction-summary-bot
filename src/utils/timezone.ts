/**
 * Returns the offset (in ms) between the given IANA timezone's wall-clock time
 * and UTC at the specified instant. Positive when the timezone is ahead of UTC.
 */
function getTimezoneOffsetMs(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = dtf.formatToParts(date);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      map[part.type] = Number(part.value);
    }
  }

  const asUtc = Date.UTC(
    map.year,
    map.month - 1,
    map.day,
    map.hour,
    map.minute,
    map.second
  );

  return asUtc - date.getTime();
}

/**
 * Interprets the given wall-clock components as a local time in `timeZone`
 * and returns the corresponding UTC `Date`. Handles DST transitions.
 */
export function zonedWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);

  const offset = getTimezoneOffsetMs(timeZone, new Date(utcGuess));
  let result = new Date(utcGuess - offset);

  // Re-check once to correct for DST boundary cases where the offset differs
  // at the adjusted instant.
  const adjustedOffset = getTimezoneOffsetMs(timeZone, result);
  if (adjustedOffset !== offset) {
    result = new Date(utcGuess - adjustedOffset);
  }

  return result;
}

/**
 * Validates that the given string is a usable IANA timezone identifier.
 */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
    return true;
  } catch {
    return false;
  }
}
