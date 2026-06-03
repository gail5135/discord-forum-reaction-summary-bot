import {
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  ThreadChannel,
  User,
} from "discord.js";

import { BOT_LOCALE } from "../config/env";
import * as trackingStore from "../store/trackingStore";
import { collectReactions } from "../utils/reactionCollector";
import { formatEmpty, formatReactionLines } from "../utils/format";
import { calendarButtonRow } from "./calendar/button";
import { ensureTrackingMessage } from "./threadTracker";

async function fetchFullMessage(
  message: Message | { partial: boolean; fetch: () => Promise<Message> }
): Promise<Message> {
  return message.partial ? await message.fetch() : (message as Message);
}

function resolveLocale(fallback?: string | null): string {
  return BOT_LOCALE || fallback?.split("-")[0] || "en";
}

/**
 * 스타터 메시지를 받아서 추적 메시지를 최신 리액션 상태로 갱신한다.
 * 추적 메시지가 사라졌으면 한 번만 재생성을 시도한다.
 */
export async function refreshTrackingMessage(
  starter: Message,
  options: { allowRecreate?: boolean } = {}
): Promise<void> {
  const { allowRecreate = true } = options;
  const record = trackingStore.getByStarterMessageId(starter.id);
  if (!record) return;

  const channel = starter.channel;
  if (!channel.isThread()) return;
  const thread = channel as ThreadChannel;

  const reactions = await collectReactions(starter);
  const locale = resolveLocale(thread.guild.preferredLocale);
  const content =
    reactions.size === 0 ? formatEmpty(locale) : formatReactionLines(reactions, locale);

  const trackingMsg = await thread.messages
    .fetch(record.trackingMessageId)
    .catch(() => null);

  if (!trackingMsg) {
    trackingStore.removeByThreadId(record.threadId);
    if (allowRecreate) {
      await ensureTrackingMessage(thread);
      await refreshTrackingMessage(starter, { allowRecreate: false });
    }
    return;
  }

  await trackingMsg.edit({
    content,
    components: [calendarButtonRow(locale)],
  });
}

/**
 * messageReactionAdd / messageReactionRemove 공통 핸들러.
 */
export async function onReactionChange(
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
): Promise<void> {
  if (user.bot) return;

  try {
    const message = await fetchFullMessage(reaction.message as Message);
    if (!trackingStore.getByStarterMessageId(message.id)) return;
    await refreshTrackingMessage(message);
  } catch (error) {
    console.error("[reactionTracker] onReactionChange failed:", error);
  }
}
