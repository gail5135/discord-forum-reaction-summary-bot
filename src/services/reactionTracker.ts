import {
  Client,
  Message,
  MessageReaction,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  ThreadChannel,
  User,
} from "discord.js";

import { BOT_LOCALE } from "../config/env";
import * as trackingStore from "../store/trackingStore";
import { TrackingRecord } from "../store/trackingStore";
import { collectReactions, unionReactions } from "../utils/reactionCollector";
import { formatEmpty, formatReactionLines } from "../utils/format";
import { calendarButtonRow } from "./calendar/button";
import { ensureTrackingMessage } from "./threadTracker";

async function fetchFullMessage(
  message: Message | PartialMessage
): Promise<Message> {
  return message.partial ? await message.fetch() : message;
}

function resolveLocale(fallback?: string | null): string {
  return BOT_LOCALE || fallback?.split("-")[0] || "en";
}

/**
 * record로부터 두 메시지(스타터 + 봇 추적)를 fetch해서 리액션을 union으로 병합한 뒤
 * 추적 메시지를 갱신한다. 추적 메시지가 사라졌으면 한 번만 재생성을 시도한다.
 */
export async function refreshTrackingMessage(
  client: Client,
  record: TrackingRecord,
  options: { allowRecreate?: boolean } = {}
): Promise<void> {
  const { allowRecreate = true } = options;

  const thread = await client.channels.fetch(record.threadId).catch(() => null);
  if (!thread || !thread.isThread()) return;
  const threadChannel = thread as ThreadChannel;

  const trackingMsg = await threadChannel.messages
    .fetch(record.trackingMessageId)
    .catch(() => null);

  if (!trackingMsg) {
    trackingStore.removeByThreadId(record.threadId);
    if (allowRecreate) {
      await ensureTrackingMessage(threadChannel);
      const newRecord = trackingStore.getByThreadId(threadChannel.id);
      if (newRecord) {
        await refreshTrackingMessage(client, newRecord, { allowRecreate: false });
      }
    }
    return;
  }

  const starter = await threadChannel.fetchStarterMessage().catch(() => null);
  const starterReactions = starter
    ? await collectReactions(starter)
    : new Map<string, Set<string>>();
  const trackingReactions = await collectReactions(trackingMsg);
  const merged = unionReactions(starterReactions, trackingReactions);

  const locale = resolveLocale(threadChannel.guild.preferredLocale);
  const content =
    merged.size === 0 ? formatEmpty(locale) : formatReactionLines(merged, locale);

  await trackingMsg.edit({
    content,
    components: [calendarButtonRow(locale)],
  });
}

/**
 * messageReactionAdd / messageReactionRemove 공통 핸들러.
 * 스타터 메시지 또는 봇 추적 메시지 어느 쪽 리액션 변화도 처리.
 */
export async function onReactionChange(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
): Promise<void> {
  if (user.bot) return;

  try {
    const message = await fetchFullMessage(reaction.message);
    const record =
      trackingStore.getByStarterMessageId(message.id) ??
      trackingStore.getByTrackingMessageId(message.id);
    if (!record) return;
    await refreshTrackingMessage(message.client, record);
  } catch (error) {
    console.error("[reactionTracker] onReactionChange failed:", error);
  }
}
