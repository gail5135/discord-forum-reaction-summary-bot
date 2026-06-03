/**
 * 리액션 처리 서비스
 * 복사 메시지의 리액션을 기록
 */

import { Message } from "discord.js";
import {
  extractAuthorId,
  extractBodyContent,
  formatMessageBody,
} from "../utils/messageFormat";
import { SEPARATOR } from "../utils/constants";

/**
 * 메시지에서 리액션 정보 수집
 * @returns 이모지별 유저 ID Set
 */
async function collectReactions(
  message: Message
): Promise<Map<string, Set<string>>> {
  const result = new Map<string, Set<string>>();

  for (const reaction of message.reactions.cache.values()) {
    const users = await reaction.users.fetch();
    const filtered = users.filter((u) => !u.bot);
    if (filtered.size === 0) continue;

    // 커스텀 이모지는 <:name:id> 또는 <a:name:id> 형식, 일반 이모지는 그대로
    const emoji = reaction.emoji.id
      ? `<${reaction.emoji.animated ? "a" : ""}:${reaction.emoji.name}:${
          reaction.emoji.id
        }>`
      : reaction.emoji.name!;

    const userIds = result.get(emoji) ?? new Set<string>();
    filtered.forEach((u) => userIds.add(u.id));
    result.set(emoji, userIds);
  }

  return result;
}

/**
 * 리액션 변경 시 복사 메시지 업데이트
 */
export async function handleReactionChange(message: Message): Promise<void> {
  const reactions = await collectReactions(message);
  const authorId = extractAuthorId(message.content);

  if (!authorId) return;

  // 리액션 라인 생성
  const lines: string[] = [];
  for (const [emoji, userIds] of reactions.entries()) {
    const mentions = [...userIds].map((id) => `<@${id}>`).join(", ");
    lines.push(`${emoji} : ${mentions}`);
  }

  // 메시지 내용 조합
  const currentContent = extractBodyContent(message.content);
  const final = formatMessageBody(authorId, currentContent, lines);

  await message.edit(final);
}
