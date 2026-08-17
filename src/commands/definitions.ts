import {
  ChannelType,
  Client,
  Guild,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

export const FORUM_COMMAND_NAME = "forum";

export const SUBCOMMAND = {
  ADD: "add",
  REMOVE: "remove",
  LIST: "list",
} as const;

export const CHANNEL_OPTION = "channel";

export const forumCommand = new SlashCommandBuilder()
  .setName(FORUM_COMMAND_NAME)
  .setDescription("Manage the forum channels this bot watches")
  // 기본적으로 서버 관리 권한을 가진 사람에게만 노출된다.
  // 서버 설정 > 연동 에서 관리자가 다른 역할에 열어줄 수 있다.
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setContexts(InteractionContextType.Guild)
  .addSubcommand((sub) =>
    sub
      .setName(SUBCOMMAND.ADD)
      .setDescription("Start watching a forum channel")
      .addChannelOption((opt) =>
        opt
          .setName(CHANNEL_OPTION)
          .setDescription("Forum channel to watch")
          .addChannelTypes(ChannelType.GuildForum)
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName(SUBCOMMAND.REMOVE)
      .setDescription("Stop watching a forum channel")
      .addChannelOption((opt) =>
        opt
          .setName(CHANNEL_OPTION)
          .setDescription("Forum channel to stop watching")
          .addChannelTypes(ChannelType.GuildForum)
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub.setName(SUBCOMMAND.LIST).setDescription("List the forum channels being watched")
  );

/** 길드 스코프로 등록한다. 글로벌 등록과 달리 즉시 반영된다. */
export async function registerForGuild(guild: Guild): Promise<void> {
  try {
    await guild.commands.set([forumCommand.toJSON()]);
    console.log(`[commands] registered for guild ${guild.id}`);
  } catch (error) {
    console.error(`[commands] registration failed for guild ${guild.id}:`, error);
  }
}

/** 봇이 속한 모든 길드에 등록한다. 한 길드가 실패해도 나머지는 계속 진행한다. */
export async function registerAll(client: Client): Promise<void> {
  for (const guild of client.guilds.cache.values()) {
    await registerForGuild(guild);
  }
}
