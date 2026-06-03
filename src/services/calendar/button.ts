import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { t } from "../../i18n";

export const BUTTON_ID = {
  CALENDAR: "calendar_register",
} as const;

export const MODAL_ID = {
  CALENDAR: "calendar_modal",
  CALENDAR_DATE: "calendar_date_input",
  CALENDAR_TIME: "calendar_time_input",
  CALENDAR_TITLE: "calendar_title_input",
} as const;

export function calendarButtonRow(locale: string): ActionRowBuilder<ButtonBuilder> {
  const calendarButton = new ButtonBuilder()
    .setCustomId(BUTTON_ID.CALENDAR)
    .setLabel(t("button.calendar", locale))
    .setStyle(ButtonStyle.Success)
    .setEmoji("📅");

  return new ActionRowBuilder<ButtonBuilder>().addComponents(calendarButton);
}
