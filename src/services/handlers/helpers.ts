/**
 * 핸들러 공통 유틸리티
 */

import type { Guild } from "discord.js";

/**
 * 메시지 링크 생성
 */
export function buildMessageLink(
  guildId: string,
  channelId: string,
  messageId: string
): string {
  return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

/**
 * 메시지 링크와 연관된 캘린더 일정 조회
 */
export async function findRelatedEvents(guild: Guild, messageLink: string) {
  const events = await guild.scheduledEvents.fetch();
  return events.filter((e) => e.description === messageLink);
}
