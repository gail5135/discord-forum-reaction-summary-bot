import { isValidTimeZone } from "../utils/timezone";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
};

const resolveTimeZone = (): string => {
  const value = requireEnv("BOT_TIMEZONE");
  if (!isValidTimeZone(value)) {
    throw new Error(`BOT_TIMEZONE is not a valid IANA timezone: ${value}`);
  }
  return value;
};

export const DISCORD_TOKEN = requireEnv("DISCORD_TOKEN");
export const BOT_LOCALE = process.env.BOT_LOCALE;
export const BOT_TIMEZONE = resolveTimeZone();
