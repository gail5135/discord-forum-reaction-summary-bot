/**
 * 환경변수 로더
 * 필수 환경변수가 없으면 에러를 발생시킴
 */

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
};

/** Discord 봇 토큰 */
export const DISCORD_TOKEN = requireEnv("DISCORD_TOKEN");

/** 원본 메시지 있고 복사 메시지가 작성될 채널 ID */
export const TARGET_CHANNEL_ID = requireEnv("TARGET_CHANNEL_ID");
