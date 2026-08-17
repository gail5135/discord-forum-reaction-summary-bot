import { ChatInputCommandInteraction } from "discord.js";

import { BOT_LOCALE } from "../config/env";
import { t } from "../i18n";
import * as forumStore from "../store/forumStore";
import { SUBCOMMAND } from "./definitions";

function resolveLocale(interaction: ChatInputCommandInteraction): string {
  return BOT_LOCALE || interaction.guild?.preferredLocale?.split("-")[0] || "en";
}

/** 감시 중인 포럼 목록을 채널 멘션으로 렌더링한다. */
export function formatForumList(forumIds: string[], locale: string): string {
  if (forumIds.length === 0) return t("command.forum.listEmpty", locale);
  const lines = forumIds.map((id) => `- <#${id}>`).join("\n");
  return `${t("command.forum.listHeader", locale)}\n${lines}`;
}

async function handleList(
  interaction: ChatInputCommandInteraction,
  locale: string
): Promise<void> {
  const forumIds = forumStore
    .listByGuild(interaction.guildId ?? "")
    .map((record) => record.forumId);

  await interaction.reply({
    content: formatForumList(forumIds, locale),
    ephemeral: true,
  });
}

export async function handleForumCommand(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  const locale = resolveLocale(interaction);
  try {
    switch (interaction.options.getSubcommand()) {
      case SUBCOMMAND.LIST:
        await handleList(interaction, locale);
        return;
      default:
        return;
    }
  } catch (error) {
    console.error("[forum] command failed:", error);
    const content = t("command.forum.failed", locale);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content }).catch(() => null);
    } else {
      await interaction.reply({ content, ephemeral: true }).catch(() => null);
    }
  }
}
