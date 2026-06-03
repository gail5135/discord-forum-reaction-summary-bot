/**
 * Discord 메시지 리액션 요약 봇
 *
 * 기능:
 * 1. @everyone 메시지 작성 시 → 타겟 채널에 복사 후 원본 삭제
 * 2. 복사 메시지에 리액션 추가/제거 시 → 리액션 정보 기록
 * 3. 복사 메시지 수정 버튼으로 내용 수정 가능
 */

import "dotenv/config";
import { Client, GatewayIntentBits, Message, Partials } from "discord.js";

import { DISCORD_TOKEN, TARGET_CHANNEL_ID } from "./config/env";
import { isCopyMessage } from "./store/messageMap";
import { createCopyMessage } from "./services/copyService";
import { handleReactionChange } from "./services/reactionService";
import {
  BUTTON_ID,
  MODAL_ID,
  handleEditButton,
  handleEditModalSubmit,
  handleDeleteButton,
  handleDeleteConfirmButton,
  handleDeleteCancelButton,
  handleCalendarButton,
  handleCalendarModalSubmit,
} from "./services/interactionService";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

/**
 * 새 메시지 생성 이벤트
 * TARGET_CHANNEL_ID 채널에서 @everyone으로 시작하는 메시지만 복사
 */
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content) return;

  // TARGET_CHANNEL_ID 채널의 메시지만 처리
  if (message.channelId !== TARGET_CHANNEL_ID) return;

  // @everyone이 포함되지 않으면 무시
  if (!message.content.includes("@everyone")) return;

  // @everyone 제외하고 빈 문자열, 공백인 메시지면 무시
  const contentWithoutTag = message.content.replace(/@everyone/g, "").trim();
  if (!contentWithoutTag) return;

  await createCopyMessage(client, message);
});

/**
 * Partial 메시지를 완전한 메시지로 fetch
 */
async function fetchFullMessage(message: Message): Promise<Message> {
  return message.partial ? await message.fetch() : message;
}

/**
 * 리액션 추가 이벤트
 */
client.on("messageReactionAdd", async (reaction, user) => {
  if (user.bot) return;

  const message = await fetchFullMessage(reaction.message as Message);
  if (!isCopyMessage(message.id)) return;

  await handleReactionChange(message);
});

/**
 * 리액션 제거 이벤트
 */
client.on("messageReactionRemove", async (reaction, user) => {
  if (user.bot) return;

  const message = await fetchFullMessage(reaction.message as Message);
  if (!isCopyMessage(message.id)) return;

  await handleReactionChange(message);
});

/**
 * 인터랙션 이벤트 (버튼 클릭, 모달 제출 등)
 */
client.on("interactionCreate", async (interaction) => {
  try {
    // 버튼 클릭
    if (interaction.isButton()) {
      if (interaction.customId === BUTTON_ID.EDIT) {
        await handleEditButton(interaction);
      } else if (interaction.customId === BUTTON_ID.DELETE) {
        await handleDeleteButton(interaction);
      } else if (interaction.customId.startsWith(BUTTON_ID.DELETE_CONFIRM)) {
        await handleDeleteConfirmButton(interaction);
      } else if (interaction.customId.startsWith(BUTTON_ID.DELETE_CANCEL)) {
        await handleDeleteCancelButton(interaction);
      } else if (interaction.customId === BUTTON_ID.CALENDAR) {
        await handleCalendarButton(interaction);
      }
      return;
    }

    // 모달 제출
    if (interaction.isModalSubmit()) {
      if (interaction.customId === MODAL_ID.EDIT) {
        await handleEditModalSubmit(interaction);
      } else if (interaction.customId === MODAL_ID.CALENDAR) {
        await handleCalendarModalSubmit(interaction);
      }
      return;
    }
  } catch (error) {
    console.error("Interaction handling error:", error);
  }
});

client.login(DISCORD_TOKEN);
