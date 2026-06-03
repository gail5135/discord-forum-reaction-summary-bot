import fs from "fs";
import path from "path";

export type TrackingRecord = {
  threadId: string;
  starterMessageId: string;
  trackingMessageId: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "trackingMap.json");

const byThreadId = new Map<string, TrackingRecord>();
const byStarterMessageId = new Map<string, TrackingRecord>();

function load(): void {
  if (!fs.existsSync(FILE_PATH)) return;
  const raw = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8")) as TrackingRecord[];
  for (const record of raw) {
    byThreadId.set(record.threadId, record);
    byStarterMessageId.set(record.starterMessageId, record);
  }
}

function save(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const records = Array.from(byThreadId.values());
  fs.writeFileSync(FILE_PATH, JSON.stringify(records, null, 2));
}

load();

export function add(record: TrackingRecord): void {
  byThreadId.set(record.threadId, record);
  byStarterMessageId.set(record.starterMessageId, record);
  save();
}

export function removeByThreadId(threadId: string): TrackingRecord | undefined {
  const record = byThreadId.get(threadId);
  if (!record) return undefined;
  byThreadId.delete(record.threadId);
  byStarterMessageId.delete(record.starterMessageId);
  save();
  return record;
}

export function removeByStarterMessageId(
  starterMessageId: string
): TrackingRecord | undefined {
  const record = byStarterMessageId.get(starterMessageId);
  if (!record) return undefined;
  byThreadId.delete(record.threadId);
  byStarterMessageId.delete(record.starterMessageId);
  save();
  return record;
}

export function getByThreadId(threadId: string): TrackingRecord | undefined {
  return byThreadId.get(threadId);
}

export function getByStarterMessageId(
  starterMessageId: string
): TrackingRecord | undefined {
  return byStarterMessageId.get(starterMessageId);
}

export function allThreadIds(): string[] {
  return Array.from(byThreadId.keys());
}
