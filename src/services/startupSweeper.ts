import { ChannelType, Client, ForumChannel, ThreadChannel } from "discord.js";

import { TARGET_FORUM_ID } from "../config/env";
import * as trackingStore from "../store/trackingStore";
import { ensureTrackingMessage } from "./threadTracker";
import { refreshTrackingMessage } from "./reactionTracker";

export async function run(client: Client): Promise<void> {
  const forum = await client.channels.fetch(TARGET_FORUM_ID).catch(() => null);
  if (!forum || forum.type !== ChannelType.GuildForum) {
    console.error(`[sweep] TARGET_FORUM_ID ${TARGET_FORUM_ID} is not a forum channel`);
    return;
  }

  const active = await (forum as ForumChannel).threads
    .fetchActive()
    .catch((err) => {
      console.error("[sweep] fetchActive failed:", err);
      return null;
    });
  if (!active) return;

  let scanned = 0;
  let created = 0;
  let resynced = 0;

  for (const thread of active.threads.values()) {
    scanned++;
    try {
      const record = trackingStore.getByThreadId(thread.id);
      if (!record) {
        await ensureTrackingMessage(thread as ThreadChannel);
        if (trackingStore.getByThreadId(thread.id)) created++;
      } else {
        await refreshTrackingMessage(client, record, { allowRecreate: false });
        resynced++;
      }
    } catch (error) {
      console.error(`[sweep] thread ${thread.id} failed:`, error);
    }
  }

  console.log(`[sweep] ${scanned} scanned, ${created} created, ${resynced} resynced`);
}
