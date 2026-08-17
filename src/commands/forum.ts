import { ChatInputCommandInteraction } from "discord.js";

import { BOT_LOCALE } from "../config/env";
import { t } from "../i18n";
import { sweepForum } from "../services/startupSweeper";
import * as forumStore from "../store/forumStore";
import { CHANNEL_OPTION, SUBCOMMAND } from "./definitions";

function resolveLocale(interaction: ChatInputCommandInteraction): string {
  return BOT_LOCALE || interaction.guild?.preferredLocale?.split("-")[0] || "en";
}

/** 감시 중인 포럼 목록을 채널 멘션으로 렌더링한다. */
export function formatForumList(forumIds: string[], locale: string): string {
  if (forumIds.length === 0) return t("command.forum.listEmpty", locale);
  const lines = forumIds.map((id) => `- <#${id}>`).join("\n");
  return `${t("command.forum.listHeader", locale)}\n${lines}`;
}

async function handleAdd(
  interaction: ChatInputCommandInteraction,
  locale: string
): Promise<void> {
  const channel = interaction.options.getChannel(CHANNEL_OPTION, true);

  if (forumStore.has(channel.id)) {
    await interaction.reply({
      content: t("command.forum.alreadyAdded", locale),
      ephemeral: true,
    });
    return;
  }

  // 백필 스윕이 3초를 넘길 수 있으므로 먼저 defer 한다.
  await interaction.deferReply({ ephemeral: true });

  // defer 사이에 동일 채널에 대한 /forum add가 다시 들어올 수 있으므로,
  // add()의 반환값으로 실제로 새로 추가됐는지 다시 확인한다(TOCTOU 방지).
  const added = forumStore.add({
    forumId: channel.id,
    guildId: interaction.guildId ?? "",
    addedAt: new Date().toISOString(),
  });

  if (!added) {
    await interaction.editReply({ content: t("command.forum.alreadyAdded", locale) });
    return;
  }

  // 등록 직후 기존 활성 스레드를 훑는다. 이게 없으면 새 스레드가 생기기 전까지
  // 아무 일도 일어나지 않아 사용자가 동작을 확인할 수 없다.
  const result = await sweepForum(interaction.client, channel.id);

  if (!result) {
    await interaction.editReply({
      content: t("command.forum.addedNoAccess", locale),
    });
    return;
  }

  await interaction.editReply({
    content: `${t("command.forum.added", locale)}\n\`scanned: ${result.scanned}, created: ${result.created}, resynced: ${result.resynced}\``,
  });
}

async function handleRemove(
  interaction: ChatInputCommandInteraction,
  locale: string
): Promise<void> {
  const channel = interaction.options.getChannel(CHANNEL_OPTION, true);
  const removed = forumStore.remove(channel.id);

  // 이미 달린 추적 메시지와 trackingStore 레코드는 일부러 건드리지 않는다.
  // 되돌릴 수 없는 파괴적 동작이라, 중단은 "새 스레드를 더 추적하지 않는다"까지만이다.
  await interaction.reply({
    content: t(
      removed ? "command.forum.removed" : "command.forum.notRegistered",
      locale
    ),
    ephemeral: true,
  });
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
      case SUBCOMMAND.ADD:
        await handleAdd(interaction, locale);
        return;
      case SUBCOMMAND.REMOVE:
        await handleRemove(interaction, locale);
        return;
      case SUBCOMMAND.LIST:
        await handleList(interaction, locale);
        return;
      default:
        // 등록된 정의에 없는 서브커맨드는 Discord가 걸러내므로 실질적으로 도달하지
        // 않지만, 혹시라도 도달하면 상호작용을 무응답으로 남기지 않는다.
        await interaction.reply({
          content: t("command.forum.failed", locale),
          ephemeral: true,
        });
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
