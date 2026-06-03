# Discord Forum Reaction Tracker Bot

When a new thread is created in the designated **forum channel**, the bot automatically posts a tracking message and records **who reacted with which emoji** to the thread's first (starter) message in real time.

---

## ✨ Features

- ✅ Posts a tracking message immediately when a new thread is created (starts empty)
- ✅ Automatically edits the tracking message when reactions are added/removed on the starter message
- ✅ Groups mentions by emoji (supports custom and animated emojis)
- ✅ Sweeps active threads on bot startup to backfill any missed entries
- ✅ Cleans up mappings automatically when the starter message or thread is deleted
- ✅ Calendar event registration button (thread OP / server administrators)
- ✅ JSON persistence (mappings survive bot restarts)
- ✅ Multilingual UI (ko / ja / en)

---

## 🧱 How It Works

```
[Forum Channel]
  └ User creates a new thread (starter message is auto-created)
        ↓
  └ Bot posts a tracking message inside the thread ("_No reactions yet._")
        ↓
  └ Someone reacts to the starter message
        ↓
  └ Bot edits the tracking message:
        👍 : @alice, @bob
        🔥 : @charlie
```

---

## ⚙️ Requirements

- Node.js 18+
- A Discord bot account
- TypeScript

---

## 🔐 Environment Variables

`.env`:
```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
TARGET_FORUM_ID=123456789012345678
BOT_LOCALE=en
```

| Variable | Description | Required |
|---|---|---|
| `DISCORD_TOKEN` | Discord bot token | ✅ |
| `TARGET_FORUM_ID` | ID of the forum channel to watch | ✅ |
| `BOT_LOCALE` | `ko` / `ja` / `en` (falls back to guild preferred locale → `en` when unset) | ❌ |

---

## 🤖 Bot Permissions

**OAuth2 Scopes**: `bot`

**Bot Permissions**:
- `View Channels`
- `Send Messages in Threads`
- `Read Message History`
- `Manage Events` (for calendar event registration)

**Gateway Intents (Bot page)**: all OFF (no Privileged Intents required)

---

## 🚀 Running

```bash
npm install
npm start
```

Type-check only:
```bash
npm run typecheck
```

On successful start, the console will print:
```
Logged in as your-bot-name#1234
[sweep] N scanned, M created, K resynced
```

---

## 📁 Project Structure

```
src/
├── config/env.ts                 # Environment variable loader
├── i18n/                          # Locale resources (ko/ja/en)
├── services/
│   ├── threadTracker.ts          # Handles threadCreate
│   ├── reactionTracker.ts        # Handles reaction changes
│   ├── startupSweeper.ts         # Sweep on startup
│   ├── cleanup.ts                # Handles starter/thread deletion
│   └── calendar/
│       ├── button.ts             # Calendar ActionRow
│       └── handler.ts            # Calendar button/modal
├── store/
│   └── trackingStore.ts          # Mapping persistence
├── utils/
│   ├── reactionCollector.ts      # Aggregates user IDs by emoji
│   └── format.ts                 # Tracking message formatting
└── index.ts                       # Entry point
```

---

## 📌 Notes

- Threads created while the bot is offline are backfilled by the next startup sweep (active threads only)
- Archived threads are intentionally not swept
- Mappings are stored in `data/trackingMap.json` (included in `.gitignore`)

---

## 📄 License

MIT — see [LICENSE](./LICENSE).
