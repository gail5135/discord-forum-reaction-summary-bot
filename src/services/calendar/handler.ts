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
import { BOT_LOCALE } from "../../config/env";
import * as trackingStore from "../../store/trackingStore";
import { BUTTON_ID, MODAL_ID } from "./button";

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

  const timeInput = new TextInputBuilder()
    .setCustomId(MODAL_ID.CALENDAR_TIME)
    .setLabel(t("modal.calendarTimeLabel", locale))
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
    new ActionRowBuilder<TextInputBuilder>().addComponents(timeInput),
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
  const timeStr = interaction.fields.getTextInputValue(MODAL_ID.CALENDAR_TIME);
  const title = interaction.fields.getTextInputValue(MODAL_ID.CALENDAR_TITLE);

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    await interaction.reply({
      content: t("error.invalidDateFormat", locale),
      ephemeral: true,
    });
    return;
  }

  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(timeStr)) {
    await interaction.reply({
      content: t("error.invalidTimeFormat", locale),
      ephemeral: true,
    });
    return;
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    await interaction.reply({
      content: t("error.invalidDateFormat", locale),
      ephemeral: true,
    });
    return;
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    await interaction.reply({
      content: t("error.invalidTimeFormat", locale),
      ephemeral: true,
    });
    return;
  }

  const startDate = new Date(year, month - 1, day, hour, minute);
  if (isNaN(startDate.getTime())) {
    await interaction.reply({
      content: t("error.invalidDateFormat", locale),
      ephemeral: true,
    });
    return;
  }

  if (startDate.getTime() < Date.now()) {
    await interaction.reply({
      content: t("error.pastDate", locale),
      ephemeral: true,
    });
    return;
  }

  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
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
