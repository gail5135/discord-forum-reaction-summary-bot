import { SEPARATOR } from "./constants";

/**
 * 메시지 본문과 리액션 정보를 조합하여 최종 메시지 텍스트 생성
 * 버튼과의 간격을 위해 하단에 Zero Width Space(\u200b) 포함
 */
export function formatMessageBody(
  authorId: string,
  content: string,
  reactionLines: string[] = []
): string {
  // 내용에서 혹시 모를 기존 Zero Width Space 제거
  const cleanContent = content.replace(/\u200b/g, "").trim();
  const base = `## **From** <@${authorId}>\n\n${cleanContent}`;

  // 리액션이 없는 경우
  if (reactionLines.length === 0) {
    return `${base}\n\u200b`;
  }

  // 리액션이 있는 경우
  return `${base}\n\n${SEPARATOR}\n${reactionLines.join("\n")}\n\u200b`;
}

/**
 * 복사 메시지 내용에서 본문만 추출 (@everyone 포함)
 */
export function extractBodyContent(content: string): string {
  const base = content
    .split(SEPARATOR)[0]
    .replace(/\u200b/g, "")
    .trim();
  const lines = base.split("\n");
  // 첫 줄 (**From** @유저)과 빈 줄 제거 후 본문 반환
  // lines[0]: **From** <@id>
  // lines[1]: (empty)
  // lines[2...]: content
  return lines.slice(2).join("\n").trim();
}

/**
 * 복사 메시지 내용에서 원본 작성자 ID 추출
 */
export function extractAuthorId(content: string): string | null {
  const match = content.match(/\*\*From\*\* <@(\d+)>/);
  return match ? match[1] : null;
}
