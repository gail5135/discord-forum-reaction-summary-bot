import "dotenv/config";
import { Client, GatewayIntentBits, Partials, ThreadChannel } from "discord.js";

import { DISCORD_TOKEN } from "./config/env";
import * as threadTracker from "./services/threadTracker";
import * as reactionTracker from "./services/reactionTracker";
import * as cleanup from "./services/cleanup";
import * as startupSweeper from "./services/startupSweeper";
import { BUTTON_ID } from "./services/calendar/button";
import {
  CHANNEL_SELECT_PREFIX,
  MODAL_PREFIX,
  OPEN_MODAL_PREFIX,
  CANCEL_ID,
} from "./services/calendar/customId";
import {
  handleCalendarButton,
  handleCalendarChannelSelect,
  handleCalendarOpenModal,
  handleCalendarCancel,
  handleCalendarModalSubmit,
} from "./services/calendar/handler";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  await startupSweeper.run(client);
});

client.on("threadCreate", async (thread) => {
  await threadTracker.onThreadCreate(thread as ThreadChannel);
});

client.on("messageReactionAdd", async (reaction, user) => {
  await reactionTracker.onReactionChange(reaction, user);
});

client.on("messageReactionRemove", async (reaction, user) => {
  await reactionTracker.onReactionChange(reaction, user);
});

client.on("messageDelete", async (message) => {
  await cleanup.onMessageDelete(client, message);
});

client.on("threadDelete", async (thread) => {
  await cleanup.onThreadDelete(thread as ThreadChannel);
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isButton()) {
      if (interaction.customId === BUTTON_ID.CALENDAR) {
        await handleCalendarButton(interaction);
      } else if (interaction.customId.startsWith(OPEN_MODAL_PREFIX)) {
        await handleCalendarOpenModal(interaction);
      } else if (interaction.customId === CANCEL_ID) {
        await handleCalendarCancel(interaction);
      }
      return;
    }

    if (interaction.isChannelSelectMenu()) {
      if (interaction.customId.startsWith(CHANNEL_SELECT_PREFIX)) {
        await handleCalendarChannelSelect(interaction);
      }
      return;
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith(MODAL_PREFIX)) {
        await handleCalendarModalSubmit(interaction);
      }
      return;
    }
  } catch (error) {
    console.error("[index] interaction handling failed:", error);
  }
});

client.login(DISCORD_TOKEN);
