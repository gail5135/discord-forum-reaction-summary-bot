export const CHANNEL_SELECT_PREFIX = "calendar_channel_select";
export const MODAL_PREFIX = "calendar_modal";

export function encodeChannelSelectId(
  sourceChannelId: string,
  sourceMessageId: string
): string {
  return `${CHANNEL_SELECT_PREFIX}:${sourceChannelId}:${sourceMessageId}`;
}

export function parseChannelSelectId(
  customId: string
): { sourceChannelId: string; sourceMessageId: string } | null {
  const parts = customId.split(":");
  if (parts.length !== 3 || parts[0] !== CHANNEL_SELECT_PREFIX) return null;
  const [, sourceChannelId, sourceMessageId] = parts;
  if (!sourceChannelId || !sourceMessageId) return null;
  return { sourceChannelId, sourceMessageId };
}

export function encodeModalId(
  voiceChannelId: string,
  sourceChannelId: string,
  sourceMessageId: string
): string {
  return `${MODAL_PREFIX}:${voiceChannelId}:${sourceChannelId}:${sourceMessageId}`;
}

export function parseModalId(
  customId: string
): {
  voiceChannelId: string;
  sourceChannelId: string;
  sourceMessageId: string;
} | null {
  const parts = customId.split(":");
  if (parts.length !== 4 || parts[0] !== MODAL_PREFIX) return null;
  const [, voiceChannelId, sourceChannelId, sourceMessageId] = parts;
  if (!voiceChannelId || !sourceChannelId || !sourceMessageId) return null;
  return { voiceChannelId, sourceChannelId, sourceMessageId };
}
