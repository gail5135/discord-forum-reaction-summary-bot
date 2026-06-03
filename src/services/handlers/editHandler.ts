/**
 * 수정 관련 인터랙션 핸들러
 */

import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { isCopyMessage } from "../../store/messageMap";
import { SEPARATOR } from "../../utils/constants";
import { t } from "../../i18n";
import {
  extractAuthorId,
  extractBodyContent,
  formatMessageBody,
} from "../../utils/messageFormat";
import { MODAL_ID } from "../interactionService";

/**
 * 수정 버튼 클릭 핸들러
 */
export async function handleEditButton(
  interaction: ButtonInteraction
): Promise<void> {
  const message = interaction.message;

  // 복사 메시지인지 확인
  if (!isCopyMessage(message.id)) {
    await interaction.reply({
      content: t("error.cannotEdit", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 원본 작성자인지 확인
  const authorId = extractAuthorId(message.content);
  if (authorId !== interaction.user.id) {
    await interaction.reply({
      content: t("error.onlyAuthorEdit", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 현재 본문 내용 추출
  const currentContent = extractBodyContent(message.content);

  // 모달 생성
  const modal = new ModalBuilder()
    .setCustomId(MODAL_ID.EDIT)
    .setTitle(t("modal.editTitle", interaction.locale));

  const input = new TextInputBuilder()
    .setCustomId(MODAL_ID.CONTENT_INPUT)
    .setLabel(t("modal.newContentLabel", interaction.locale))
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder(t("modal.placeholder", interaction.locale))
    .setValue(currentContent)
    .setRequired(true)
    .setMaxLength(2000);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(input)
  );

  await interaction.showModal(modal);
}

/**
 * 수정 모달 제출 핸들러
 */
export async function handleEditModalSubmit(
  interaction: ModalSubmitInteraction
): Promise<void> {
  const message = interaction.message;
  if (!message) {
    await interaction.reply({
      content: t("error.messageNotFound", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 원본 작성자인지 다시 확인
  const authorId = extractAuthorId(message.content);
  if (authorId !== interaction.user.id) {
    await interaction.reply({
      content: t("error.onlyAuthorEdit", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 새 내용 가져오기
  const newContent = interaction.fields.getTextInputValue(
    MODAL_ID.CONTENT_INPUT
  );

  // @everyone으로 시작하는지 확인
  if (!newContent.startsWith("@everyone")) {
    await interaction.reply({
      content: t("error.mustStartWithEveryone", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // @everyone 뒤에 내용이 있는지 확인
  const contentAfterTag = newContent.slice("@everyone".length).trim();
  if (!contentAfterTag) {
    await interaction.reply({
      content: t("error.emptyAfterEveryone", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 기존 리액션 정보 추출
  const parts = message.content.split(SEPARATOR);
  let reactionLines: string[] = [];
  if (parts.length > 1) {
    reactionLines = parts[1]
      .split("\n")
      .map((line) => line.replace(/\u200b/g, "").trim())
      .filter((line) => line.length > 0);
  }

  // 메시지 수정
  const final = formatMessageBody(authorId, newContent, reactionLines);
  await message.edit(final);

  await interaction.reply({
    content: t("success.edited", interaction.locale),
    ephemeral: true,
  });
}
