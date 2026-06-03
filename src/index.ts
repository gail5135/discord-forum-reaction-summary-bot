import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";

import { DISCORD_TOKEN } from "./config/env";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user?.tag}`);
});

client.login(DISCORD_TOKEN);
