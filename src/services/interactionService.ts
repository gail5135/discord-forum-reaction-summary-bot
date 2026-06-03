/**
 * 인터랙션 처리 서비스
 * 버튼 클릭, 모달 제출 등 사용자 인터랙션 처리
 */

import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { t } from "../i18n";

/** 버튼/모달 ID 상수 */
export const BUTTON_ID = {
  EDIT: "edit_copy_message",
  DELETE: "delete_copy_message",
  DELETE_CONFIRM: "delete_confirm",
  DELETE_CANCEL: "delete_cancel",
  CALENDAR: "calendar_copy_message",
} as const;

export const MODAL_ID = {
  EDIT: "edit_copy_modal",
  CONTENT_INPUT: "new_content_input",
  CALENDAR: "calendar_modal",
  CALENDAR_DATE: "calendar_date_input",
  CALENDAR_TIME: "calendar_time_input",
  CALENDAR_TITLE: "calendar_title_input",
} as const;

/**
 * 편집/삭제 버튼이 포함된 ActionRow 생성
 */
export function createActionButtons(
  locale: string = "ja"
): ActionRowBuilder<ButtonBuilder> {
  const editButton = new ButtonBuilder()
    .setCustomId(BUTTON_ID.EDIT)
    .setLabel(t("button.edit", locale))
    .setStyle(ButtonStyle.Primary)
    .setEmoji("✏️");

  const deleteButton = new ButtonBuilder()
    .setCustomId(BUTTON_ID.DELETE)
    .setLabel(t("button.delete", locale))
    .setStyle(ButtonStyle.Danger)
    .setEmoji("🗑️");

  const calendarButton = new ButtonBuilder()
    .setCustomId(BUTTON_ID.CALENDAR)
    .setLabel(t("button.calendar", locale))
    .setStyle(ButtonStyle.Success)
    .setEmoji("📅");

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    editButton,
    deleteButton,
    calendarButton
  );
}

// 핸들러 re-export (index.ts import 경로 변경 불필요)
export { handleEditButton, handleEditModalSubmit } from "./handlers/editHandler";
export {
  handleDeleteButton,
  handleDeleteConfirmButton,
  handleDeleteCancelButton,
} from "./handlers/deleteHandler";
export {
  handleCalendarButton,
  handleCalendarModalSubmit,
} from "./handlers/calendarHandler";
