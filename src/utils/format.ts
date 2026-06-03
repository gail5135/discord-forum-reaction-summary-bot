import { t } from "../i18n";

const ZERO_WIDTH_SPACE = "​";

export function formatEmpty(locale: string): string {
  return `${t("summary.empty", locale)}\n${ZERO_WIDTH_SPACE}`;
}

export function formatReactionLines(
  reactions: Map<string, Set<string>>,
  locale: string
): string {
  if (reactions.size === 0) return formatEmpty(locale);

  const lines: string[] = [];
  for (const [emoji, userIds] of reactions.entries()) {
    const mentions = [...userIds].map((id) => `<@${id}>`).join(", ");
    lines.push(`${emoji} : ${mentions}`);
  }
  return `${lines.join("\n")}\n${ZERO_WIDTH_SPACE}`;
}
