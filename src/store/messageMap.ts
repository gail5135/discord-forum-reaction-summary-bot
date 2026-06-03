/**
 * 복사 메시지 ID 스토어
 * JSON 파일로 영속화하여 봇 재시작 시에도 데이터 유지
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "copyMessages.json");

/** 복사 메시지 ID Set */
const copyMessageIds = new Set<string>();

/**
 * JSON 파일에서 데이터를 로드
 */
function load(): void {
  if (!fs.existsSync(FILE_PATH)) return;

  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  for (const id of data) {
    copyMessageIds.add(id);
  }
}

/**
 * 데이터를 JSON 파일로 저장
 */
function save(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(FILE_PATH, JSON.stringify([...copyMessageIds], null, 2));
}

load();

/**
 * 복사 메시지 ID 추가
 */
export function addCopyMessage(copyId: string): void {
  copyMessageIds.add(copyId);
  save();
}

/**
 * 해당 ID가 복사 메시지인지 확인
 */
export function isCopyMessage(messageId: string): boolean {
  return copyMessageIds.has(messageId);
}
