import { Message } from "discord.js";

/**
 * 메시지의 모든 리액션을 이모지별로 집계.
 * 봇이 추가한 리액션은 제외.
 *
 * @returns Map<이모지토큰, Set<userId>>
 *   이모지토큰: 일반 이모지는 그대로(예: "👍"), 커스텀 이모지는 "<:name:id>" 또는 "<a:name:id>"
 */
export async function collectReactions(
  message: Message
): Promise<Map<string, Set<string>>> {
  const result = new Map<string, Set<string>>();

  for (const reaction of message.reactions.cache.values()) {
    const users = await reaction.users.fetch();
    const filtered = users.filter((u) => !u.bot);
    if (filtered.size === 0) continue;

    const emoji = reaction.emoji.id
      ? `<${reaction.emoji.animated ? "a" : ""}:${reaction.emoji.name}:${reaction.emoji.id}>`
      : reaction.emoji.name!;

    const userIds = result.get(emoji) ?? new Set<string>();
    filtered.forEach((u) => userIds.add(u.id));
    result.set(emoji, userIds);
  }

  return result;
}

/**
 * 두 리액션 Map을 union(합집합)으로 병합한다.
 * 같은 이모지에 대한 user Set은 합쳐지며 같은 userId는 자연 dedupe.
 */
export function unionReactions(
  a: Map<string, Set<string>>,
  b: Map<string, Set<string>>
): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const [emoji, users] of a) out.set(emoji, new Set(users));
  for (const [emoji, users] of b) {
    const set = out.get(emoji) ?? new Set<string>();
    users.forEach((u) => set.add(u));
    out.set(emoji, set);
  }
  return out;
}
