const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
};

export const DISCORD_TOKEN = requireEnv("DISCORD_TOKEN");
export const TARGET_FORUM_ID = requireEnv("TARGET_FORUM_ID");
export const BOT_LOCALE = process.env.BOT_LOCALE;
