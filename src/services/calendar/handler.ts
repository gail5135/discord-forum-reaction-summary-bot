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
  ThreadChannel,
} from "discord.js";

import { t } from "../../i18n";
import { BOT_LOCALE, BOT_TIMEZONE } from "../../config/env";
import * as trackingStore from "../../store/trackingStore";
import { buildEventInterval } from "./eventInterval";
import { MODAL_ID } from "./button";

function resolveLocale(fallback?: string | null): string {
  return BOT_LOCALE || fallback?.split("-")[0] || "en";
}

function buildMessageLink(
  guildId: string,
  channelId: string,
  messageId: string
): string {
  return `https://discord.com/channels/${guildId}/${channelId}/${messageId}`;
}

export async function handleCalendarButton(
  interaction: ButtonInteraction
): Promise<void> {
  const locale = resolveLocale(interaction.guild?.preferredLocale);
  const message = interaction.message;
  const channel = interaction.channel;

  if (!channel || !channel.isThread()) {
    await interaction.reply({
      content: t("error.cannotCalendar", locale),
      ephemeral: true,
    });
    return;
  }

  const thread = channel as ThreadChannel;
  const record = trackingStore.getByThreadId(thread.id);
  if (!record || record.trackingMessageId !== message.id) {
    await interaction.reply({
      content: t("error.cannotCalendar", locale),
      ephemeral: true,
    });
    return;
  }

  const isOP = thread.ownerId === interaction.user.id;
  const isAdmin =
    interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) ||
    interaction.memberPermissions?.has(PermissionFlagsBits.ManageEvents) ||
    false;

  if (!isOP && !isAdmin) {
    await interaction.reply({
      content: t("error.noCalendarPermission", locale),
      ephemeral: true,
    });
    return;
  }

  const modal = new ModalBuilder()
    .setCustomId(MODAL_ID.CALENDAR)
    .setTitle(t("modal.calendarTitle", locale));

  const dateInput = new TextInputBuilder()
    .setCustomId(MODAL_ID.CALENDAR_DATE)
    .setLabel(t("modal.calendarDateLabel", locale))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("YYYY-MM-DD")
    .setRequired(true)
    .setMaxLength(10)
    .setMinLength(10);

  const startTimeInput = new TextInputBuilder()
    .setCustomId(MODAL_ID.CALENDAR_START_TIME)
    .setLabel(t("modal.calendarStartTimeLabel", locale))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("hh:mm")
    .setRequired(true)
    .setMaxLength(5)
    .setMinLength(5);

  const endTimeInput = new TextInputBuilder()
    .setCustomId(MODAL_ID.CALENDAR_END_TIME)
    .setLabel(t("modal.calendarEndTimeLabel", locale))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder("hh:mm")
    .setRequired(true)
    .setMaxLength(5)
    .setMinLength(5);

  const titleInput = new TextInputBuilder()
    .setCustomId(MODAL_ID.CALENDAR_TITLE)
    .setLabel(t("modal.calendarTitleLabel", locale))
    .setStyle(TextInputStyle.Short)
    .setPlaceholder(t("modal.calendarTitlePlaceholder", locale))
    .setRequired(true)
    .setMaxLength(100);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(dateInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(startTimeInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(endTimeInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput)
  );

  await interaction.showModal(modal);
}

export async function handleCalendarModalSubmit(
  interaction: ModalSubmitInteraction
): Promise<void> {
  const locale = resolveLocale(interaction.guild?.preferredLocale);
  const message = interaction.message;
  const guild = interaction.guild;

  if (!message || !guild) {
    await interaction.reply({
      content: t("error.cannotCalendar", locale),
      ephemeral: true,
    });
    return;
  }

  const dateStr = interaction.fields.getTextInputValue(MODAL_ID.CALENDAR_DATE);
  const startStr = interaction.fields.getTextInputValue(
    MODAL_ID.CALENDAR_START_TIME
  );
  const endStr = interaction.fields.getTextInputValue(
    MODAL_ID.CALENDAR_END_TIME
  );
  const title = interaction.fields.getTextInputValue(MODAL_ID.CALENDAR_TITLE);

  const interval = buildEventInterval(dateStr, startStr, endStr, BOT_TIMEZONE);
  if (!interval.ok) {
    await interaction.reply({
      content: t(`error.${interval.error}`, locale),
      ephemeral: true,
    });
    return;
  }

  const { startDate, endDate } = interval;

  if (startDate.getTime() < Date.now()) {
    await interaction.reply({
      content: t("error.pastDate", locale),
      ephemeral: true,
    });
    return;
  }
  const messageLink = buildMessageLink(guild.id, message.channelId, message.id);

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
      content: t("success.calendarAdded", locale),
      ephemeral: true,
    });
  } catch (error) {
    console.error("Calendar event creation failed:", error);
    await interaction.reply({
      content: t("error.calendarFailed", locale),
      ephemeral: true,
    });
  }
}
