import {
  ActionRowBuilder,
  ButtonInteraction,
  ChannelSelectMenuBuilder,
  ChannelSelectMenuInteraction,
  ChannelType,
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
import {
  CHANNEL_SELECT_PREFIX,
  encodeChannelSelectId,
  parseChannelSelectId,
  encodeModalId,
  parseModalId,
} from "./customId";

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

function buildCalendarModal(customId: string, locale: string): ModalBuilder {
  const modal = new ModalBuilder()
    .setCustomId(customId)
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

  return modal;
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

  const selectMenu = new ChannelSelectMenuBuilder()
    .setCustomId(encodeChannelSelectId(message.channelId, message.id))
    .setPlaceholder(t("modal.calendarChannelPlaceholder", locale))
    .addChannelTypes(ChannelType.GuildVoice);

  await interaction.reply({
    content: t("modal.calendarChannelPlaceholder", locale),
    components: [
      new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(selectMenu),
    ],
    ephemeral: true,
  });
}

export async function handleCalendarChannelSelect(
  interaction: ChannelSelectMenuInteraction
): Promise<void> {
  const locale = resolveLocale(interaction.guild?.preferredLocale);

  const source = parseChannelSelectId(interaction.customId);
  const voiceChannelId = interaction.values[0];
  if (!source || !voiceChannelId) {
    await interaction.reply({
      content: t("error.cannotCalendar", locale),
      ephemeral: true,
    });
    return;
  }

  const modal = buildCalendarModal(
    encodeModalId(voiceChannelId, source.sourceChannelId, source.sourceMessageId),
    locale
  );

  await interaction.showModal(modal);
}

export async function handleCalendarModalSubmit(
  interaction: ModalSubmitInteraction
): Promise<void> {
  const locale = resolveLocale(interaction.guild?.preferredLocale);
  const guild = interaction.guild;

  const parsed = parseModalId(interaction.customId);
  if (!parsed || !guild) {
    await interaction.reply({
      content: t("error.cannotCalendar", locale),
      ephemeral: true,
    });
    return;
  }

  const { voiceChannelId, sourceChannelId, sourceMessageId } = parsed;

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

  const messageLink = buildMessageLink(guild.id, sourceChannelId, sourceMessageId);

  try {
    await guild.scheduledEvents.create({
      name: title,
      scheduledStartTime: startDate,
      scheduledEndTime: endDate,
      privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
      entityType: GuildScheduledEventEntityType.Voice,
      channel: voiceChannelId,
      description: messageLink,
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
