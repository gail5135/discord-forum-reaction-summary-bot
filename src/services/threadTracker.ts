import { ThreadChannel } from "discord.js";

import { TARGET_FORUM_ID, BOT_LOCALE } from "../config/env";
import * as trackingStore from "../store/trackingStore";
import { formatEmpty } from "../utils/format";
import { calendarButtonRow } from "./calendar/button";

function resolveLocale(thread: ThreadChannel): string {
  return BOT_LOCALE || thread.guild.preferredLocale?.split("-")[0] || "en";
}

/**
 * 스레드에 추적 메시지를 생성하고 매핑을 저장한다.
 * 이미 추적 중이면 아무것도 하지 않고 기존 record를 그대로 반환한다.
 */
export async function ensureTrackingMessage(
  thread: ThreadChannel
): Promise<void> {
  if (thread.parentId !== TARGET_FORUM_ID) return;
  if (trackingStore.getByThreadId(thread.id)) return;

  let starter = await thread.fetchStarterMessage().catch(() => null);
  if (!starter) {
    await new Promise((r) => setTimeout(r, 500));
    starter = await thread.fetchStarterMessage().catch(() => null);
  }
  if (!starter) {
    console.warn(`[threadTracker] starter message not found for thread ${thread.id}`);
    return;
  }

  const locale = resolveLocale(thread);
  const trackingMsg = await thread.send({
    content: formatEmpty(locale),
    components: [calendarButtonRow(locale)],
  });

  trackingStore.add({
    threadId: thread.id,
    starterMessageId: starter.id,
    trackingMessageId: trackingMsg.id,
    createdAt: new Date().toISOString(),
  });
}

/**
 * threadCreate 이벤트 핸들러.
 */
export async function onThreadCreate(thread: ThreadChannel): Promise<void> {
  try {
    await ensureTrackingMessage(thread);
  } catch (error) {
    console.error(`[threadTracker] onThreadCreate failed for ${thread.id}:`, error);
  }
}
