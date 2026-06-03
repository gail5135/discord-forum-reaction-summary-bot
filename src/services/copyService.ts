/**
 * 메시지 복사 서비스
 * 원본 채널의 메시지를 타겟 채널로 복사 후 원본 삭제
 */

import { Client, Message, TextChannel } from "discord.js";
import { TARGET_CHANNEL_ID } from "../config/env";
import { addCopyMessage } from "../store/messageMap";
import { createActionButtons } from "./interactionService";

import { formatMessageBody } from "../utils/messageFormat";

/**
 * 원본 메시지를 타겟 채널에 복사하고 원본 삭제
 */
export async function createCopyMessage(
  client: Client,
  original: Message
): Promise<Message> {
  const channel = await client.channels.fetch(TARGET_CHANNEL_ID);

  if (!channel || !channel.isTextBased()) {
    throw new Error("Copy target channel is not a text channel");
  }

  const textChannel = channel as TextChannel;
  const content = formatMessageBody(original.author.id, original.content);

  // 로케일 우선순위: 환경 변수 > Discord 서버 설정
  const locale = process.env.BOT_LOCALE || original.guild?.preferredLocale?.split("-")[0] || "en";

  const copy = await textChannel.send({
    content,
    components: [createActionButtons(locale)],
  });
  addCopyMessage(copy.id);

  // 원본 메시지 삭제 (권한 없으면 무시)
  await original.delete().catch(() => null);

  return copy;
}
