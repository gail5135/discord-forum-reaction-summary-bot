/**
 * 삭제 관련 인터랙션 핸들러
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
} from "discord.js";
import { isCopyMessage } from "../../store/messageMap";
import { t } from "../../i18n";
import { extractAuthorId } from "../../utils/messageFormat";
import { BUTTON_ID, createActionButtons } from "../interactionService";
import { buildMessageLink, findRelatedEvents } from "./helpers";

/**
 * 삭제 버튼 클릭 핸들러
 */
export async function handleDeleteButton(
  interaction: ButtonInteraction
): Promise<void> {
  const message = interaction.message;

  // 복사 메시지인지 확인
  if (!isCopyMessage(message.id)) {
    await interaction.reply({
      content: t("error.cannotDelete", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 원본 작성자인지 확인
  const authorId = extractAuthorId(message.content);
  if (authorId !== interaction.user.id) {
    await interaction.reply({
      content: t("error.onlyAuthorDelete", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 일정 조회에 시간이 걸릴 수 있으므로 먼저 응답
  await interaction.deferReply({ ephemeral: true });

  // 연관된 캘린더 일정 확인
  const guild = interaction.guild;
  if (guild) {
    const messageLink = buildMessageLink(
      interaction.guildId!,
      message.channelId,
      message.id
    );
    const relatedEvents = await findRelatedEvents(guild, messageLink);

    if (relatedEvents.size > 0) {
      // 연관 일정이 있으면 확인 버튼 표시 (메시지 ID를 customId에 포함)
      const confirmButton = new ButtonBuilder()
        .setCustomId(`${BUTTON_ID.DELETE_CONFIRM}:${message.id}`)
        .setLabel(t("button.deleteConfirm", interaction.locale))
        .setStyle(ButtonStyle.Danger);

      const cancelButton = new ButtonBuilder()
        .setCustomId(`${BUTTON_ID.DELETE_CANCEL}:${message.id}`)
        .setLabel(t("button.deleteCancel", interaction.locale))
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        confirmButton,
        cancelButton
      );

      await interaction.editReply({
        content: t("confirm.deleteWithEvents", interaction.locale).replace(
          "{count}",
          String(relatedEvents.size)
        ),
        components: [row],
      });
      return;
    }
  }

  // 연관 일정이 없으면 바로 삭제
  await message.delete();

  await interaction.editReply({
    content: t("success.deleted", interaction.locale),
  });
}

/**
 * 삭제 확인 버튼 클릭 핸들러
 */
export async function handleDeleteConfirmButton(
  interaction: ButtonInteraction
): Promise<void> {
  // 삭제 진행 중 안내 메시지 표시
  await interaction.update({
    content: t("info.deletingEvents", interaction.locale),
    components: [],
  });

  const channel = interaction.channel;
  if (!channel) return;

  const guild = interaction.guild;
  if (!guild) return;

  // customId에서 원본 메시지 ID 추출 (delete_confirm:messageId)
  const targetMessageId = interaction.customId.split(":")[1];

  let targetMessage;
  try {
    targetMessage = await channel.messages.fetch(targetMessageId);
  } catch {
    await interaction.editReply({
      content: t("error.messageNotFound", interaction.locale),
      components: [],
    });
    return;
  }

  // 기존 버튼 제거
  await targetMessage.edit({ content: targetMessage.content, components: [] });

  // 연관된 캘린더 일정 삭제
  const messageLink = buildMessageLink(
    interaction.guildId!,
    targetMessage.channelId,
    targetMessage.id
  );
  const relatedEvents = await findRelatedEvents(guild, messageLink);

  for (const [, event] of relatedEvents) {
    await event.delete();
  }

  await targetMessage.delete();

  await interaction.editReply({
    content: t("success.deletedWithEvents", interaction.locale).replace(
      "{count}",
      String(relatedEvents.size)
    ),
    components: [],
  });
}

/**
 * 삭제 취소 버튼 클릭 핸들러
 */
export async function handleDeleteCancelButton(
  interaction: ButtonInteraction
): Promise<void> {
  // 원본 메시지의 버튼 복원
  const targetMessageId = interaction.customId.split(":")[1];
  const channel = interaction.channel;
  if (channel && targetMessageId) {
    try {
      const targetMessage = await channel.messages.fetch(targetMessageId);
      await targetMessage.edit({
        content: targetMessage.content,
        components: [createActionButtons(interaction.locale)],
      });
    } catch {
      // 메시지를 찾을 수 없는 경우 무시
    }
  }

  await interaction.update({
    content: t("success.deleteCancelled", interaction.locale),
    components: [],
  });
}
