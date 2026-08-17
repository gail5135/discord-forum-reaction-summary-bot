import { ChannelType, Client, ForumChannel, ThreadChannel } from "discord.js";

import * as forumStore from "../store/forumStore";
import * as trackingStore from "../store/trackingStore";
import { ensureTrackingMessage } from "./threadTracker";
import { refreshTrackingMessage } from "./reactionTracker";

export type SweepResult = {
  scanned: number;
  created: number;
  resynced: number;
};

/**
 * 포럼 하나의 활성 스레드를 훑어 추적 메시지를 생성하거나 갱신한다.
 * 채널에 접근할 수 없거나 포럼이 아니면 null을 반환한다(호출자가 건너뛴다).
 */
export async function sweepForum(
  client: Client,
  forumId: string
): Promise<SweepResult | null> {
  const forum = await client.channels.fetch(forumId).catch(() => null);
  if (!forum || forum.type !== ChannelType.GuildForum) {
    console.error(
      `[sweep] ${forumId} is not accessible or not a forum channel, skipping`
    );
    return null;
  }

  const active = await (forum as ForumChannel).threads
    .fetchActive()
    .catch((err) => {
      console.error(`[sweep] fetchActive failed for ${forumId}:`, err);
      return null;
    });
  if (!active) return null;

  const result: SweepResult = { scanned: 0, created: 0, resynced: 0 };

  for (const thread of active.threads.values()) {
    result.scanned++;
    try {
      const record = trackingStore.getByThreadId(thread.id);
      if (!record) {
        await ensureTrackingMessage(thread as ThreadChannel);
        if (trackingStore.getByThreadId(thread.id)) result.created++;
      } else {
        await refreshTrackingMessage(client, record, { allowRecreate: false });
        result.resynced++;
      }
    } catch (error) {
      console.error(`[sweep] thread ${thread.id} failed:`, error);
    }
  }

  console.log(
    `[sweep] forum ${forumId}: ${result.scanned} scanned, ${result.created} created, ${result.resynced} resynced`
  );
  return result;
}

/** 등록된 모든 포럼을 스윕한다. 실패한 포럼은 건너뛰고 나머지를 계속 처리한다. */
export async function run(client: Client): Promise<void> {
  const forums = forumStore.all();
  if (forums.length === 0) {
    console.log("[sweep] no forums registered. Use /forum add to register one.");
    return;
  }

  const total: SweepResult = { scanned: 0, created: 0, resynced: 0 };
  let skipped = 0;

  for (const forum of forums) {
    const result = await sweepForum(client, forum.forumId);
    if (!result) {
      skipped++;
      continue;
    }
    total.scanned += result.scanned;
    total.created += result.created;
    total.resynced += result.resynced;
  }

  console.log(
    `[sweep] total: ${total.scanned} scanned, ${total.created} created, ${total.resynced} resynced (${skipped} skipped)`
  );
}
