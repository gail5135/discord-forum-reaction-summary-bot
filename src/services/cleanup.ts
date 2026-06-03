import {
  Client,
  Message,
  PartialMessage,
  ThreadChannel,
} from "discord.js";

import * as trackingStore from "../store/trackingStore";

/**
 * messageDelete 이벤트 핸들러.
 * 삭제된 메시지가 추적 중인 스타터 메시지이면 매핑을 제거하고
 * 추적 메시지도 best-effort로 삭제한다.
 */
export async function onMessageDelete(
  client: Client,
  message: Message | PartialMessage
): Promise<void> {
  try {
    const record = trackingStore.removeByStarterMessageId(message.id);
    if (!record) return;

    const thread = await client.channels.fetch(record.threadId).catch(() => null);
    if (!thread || !thread.isThread()) return;

    const trackingMsg = await (thread as ThreadChannel).messages
      .fetch(record.trackingMessageId)
      .catch(() => null);
    if (trackingMsg) {
      await trackingMsg.delete().catch(() => null);
    }
  } catch (error) {
    console.error("[cleanup] onMessageDelete failed:", error);
  }
}

/**
 * threadDelete 이벤트 핸들러.
 * 스레드가 사라졌으므로 매핑만 제거한다 (추적 메시지는 함께 사라짐).
 */
export async function onThreadDelete(thread: ThreadChannel): Promise<void> {
  try {
    trackingStore.removeByThreadId(thread.id);
  } catch (error) {
    console.error("[cleanup] onThreadDelete failed:", error);
  }
}
