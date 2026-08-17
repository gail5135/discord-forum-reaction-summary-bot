import fs from "fs";
import path from "path";

export type ForumRecord = {
  forumId: string;
  guildId: string;
  addedAt: string;
};

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "forums.json");

const byForumId = new Map<string, ForumRecord>();

function load(): void {
  if (!fs.existsSync(FILE_PATH)) return;
  try {
    const raw = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8")) as ForumRecord[];
    for (const record of raw) {
      byForumId.set(record.forumId, record);
    }
  } catch (error) {
    console.error(`[forumStore] failed to load ${FILE_PATH}, starting empty:`, error);
  }
}

function save(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const records = Array.from(byForumId.values());
  fs.writeFileSync(FILE_PATH, JSON.stringify(records, null, 2));
}

load();

/** 신규로 추가했으면 true, 이미 감시 중이면 false(변경 없음). */
export function add(record: ForumRecord): boolean {
  if (byForumId.has(record.forumId)) return false;
  byForumId.set(record.forumId, record);
  save();
  return true;
}

/** 제거했으면 true, 감시 목록에 없었으면 false. */
export function remove(forumId: string): boolean {
  if (!byForumId.delete(forumId)) return false;
  save();
  return true;
}

export function has(forumId: string): boolean {
  return byForumId.has(forumId);
}

export function listByGuild(guildId: string): ForumRecord[] {
  return Array.from(byForumId.values()).filter((r) => r.guildId === guildId);
}

export function all(): ForumRecord[] {
  return Array.from(byForumId.values());
}
