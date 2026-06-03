/**
 * 캘린더 관련 인터랙션 핸들러
 */

import {
  ActionRowBuilder,
  ButtonInteraction,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  ModalBuilder,
  ModalSubmitInteraction,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { isCopyMessage } from "../../store/messageMap";
import { t } from "../../i18n";
import { extractAuthorId } from "../../utils/messageFormat";
import { MODAL_ID } from "../interactionService";
import { buildMessageLink } from "./helpers";

/**
 * 캘린더 버튼 클릭 핸들러
 */
export async function handleCalendarButton(
  interaction: ButtonInteraction
): Promise<void> {
  const message = interaction.message;

  if (!isCopyMessage(message.id)) {
    await interaction.reply({
      content: t("error.cannotCalendar", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 작성자이거나 관리자/이벤트 관리 권한이 있는지 확인
  const authorId = extractAuthorId(message.content);
  const hasPermission =
    authorId === interaction.user.id ||
    interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) ||
    interaction.memberPermissions?.has(PermissionFlagsBits.ManageEvents);

  if (!hasPermission) {
    await interaction.reply({
      content: t("error.noCalendarPermission", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 모달 생성
  const modal = new ModalBuilder()
    .setCustomId(MODAL_ID.CALENDAR)
    .setTitle(t("modal.calendarTitle", interaction.locale));

  const dateInput = new TextInputBuilder()
    .setCustomId(MODAL_ID.CALENDAR_DATE)
    .setLabel(t("modal.calendarDateLabel", interaction.locale))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("YYYY-MM-DD")
    .setRequired(true)
    .setMaxLength(10)
    .setMinLength(10);

  const timeInput = new TextInputBuilder()
    .setCustomId(MODAL_ID.CALENDAR_TIME)
    .setLabel(t("modal.calendarTimeLabel", interaction.locale))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("hh:mm")
    .setRequired(true)
    .setMaxLength(5)
    .setMinLength(5);

  const titleInput = new TextInputBuilder()
    .setCustomId(MODAL_ID.CALENDAR_TITLE)
    .setLabel(t("modal.calendarTitleLabel", interaction.locale))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(t("modal.calendarTitlePlaceholder", interaction.locale))
    .setRequired(true)
    .setMaxLength(100);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput)
  );

  await interaction.showModal(modal);
}

/**
 * 캘린더 모달 제출 핸들러
 */
export async function handleCalendarModalSubmit(
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

  const dateStr = interaction.fields.getTextInputValue(MODAL_ID.CALENDAR_DATE);
  const timeStr = interaction.fields.getTextInputValue(MODAL_ID.CALENDAR_TIME);
  const title = interaction.fields.getTextInputValue(MODAL_ID.CALENDAR_TITLE);

  // 날짜 형식 검증 (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    await interaction.reply({
      content: t("error.invalidDateFormat", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 시각 형식 검증 (hh:mm)
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(timeStr)) {
    await interaction.reply({
      content: t("error.invalidTimeFormat", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 유효한 날짜/시각인지 검증
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  // 월(1~12), 일(1~31) 범위 검증
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    await interaction.reply({
      content: t("error.invalidDateFormat", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 시(0~23), 분(0~59) 범위 검증
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    await interaction.reply({
      content: t("error.invalidTimeFormat", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 유효한 Date 객체인지 검증
  const startDate = new Date(year, month - 1, day, hour, minute);
  if (isNaN(startDate.getTime())) {
    await interaction.reply({
      content: t("error.invalidDateFormat", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 과거 날짜 검증
  if (startDate.getTime() < Date.now()) {
    await interaction.reply({
      content: t("error.pastDate", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  // 종료 시각은 시작 시각 + 1시간
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

  // 메시지 링크를 이벤트 설명으로 사용
  const messageLink = buildMessageLink(
    interaction.guildId!,
    message.channelId,
    message.id
  );

  const guild = interaction.guild;
  if (!guild) {
    await interaction.reply({
      content: t("error.messageNotFound", interaction.locale),
      ephemeral: true,
    });
    return;
  }

  try {
    await guild.scheduledEvents.create({
      name: title,
      scheduledStartTime: startDate,
      scheduledEndTime: endDate,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.External,
      description: messageLink,
      entityMetadata: { location: guild.name },
    });

    await interaction.reply({
      content: t("success.calendarAdded", interaction.locale),
      ephemeral: true,
    });
  } catch {
    await interaction.reply({
      content: t("error.calendarFailed", interaction.locale),
      ephemeral: true,
    });
  }
}
