# Discord Forum Reaction Tracker Bot

When a new thread is created in one of the **watched forum channels**, the bot automatically posts a tracking message and records **who reacted with which emoji** to the thread's first (starter) message in real time.

---

## ✨ Features

- ✅ Posts a tracking message immediately when a new thread is created (starts empty)
- ✅ Automatically edits the tracking message when reactions are added/removed on the starter message
- ✅ Groups mentions by emoji (supports custom and animated emojis)
- ✅ Sweeps active threads on bot startup to backfill any missed entries
- ✅ Cleans up mappings automatically when the starter message or thread is deleted
- ✅ Calendar event registration button (thread OP / server administrators): select a voice channel to register the event, and the Discord scheduled event is attached to that voice channel
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
BOT_LOCALE=en
BOT_TIMEZONE=Asia/Tokyo
```

| Variable | Description | Required |
|---|---|---|
| `DISCORD_TOKEN` | Discord bot token | ✅ |
| `BOT_LOCALE` | `ko` / `ja` / `en` (falls back to guild preferred locale → `en` when unset) | ❌ |
| `BOT_TIMEZONE` | IANA timezone used to interpret calendar event input times (e.g. `Asia/Tokyo`). Startup fails if it is missing or not a valid IANA timezone | ✅ |

---

## Choosing which forums to watch

Watched forums are managed with slash commands inside Discord. No restart needed.

| Command | Description |
| --- | --- |
| `/forum add channel:<forum>` | Start watching that forum. Existing active threads get tracking messages right away. |
| `/forum remove channel:<forum>` | Stop watching. Only new threads are skipped — existing tracking messages stay and keep updating. |
| `/forum list` | Show the forums currently being watched |

The command is only visible to members with the **Manage Server** permission by default. You can open it up to other roles in Server Settings > Integrations.

**A freshly started bot watches nothing.** Run `/forum add` once to start tracking.
The watch list is stored in `data/forums.json` and survives restarts.

**Upgrading from an older install?** The `/forum` command needs the `applications.commands` OAuth2 scope, which older invite links didn't include. If `/forum` doesn't show up, re-invite the bot with both scopes checked (see **Bot Permissions** below). Re-inviting does not kick the bot from the server or lose any data — it just grants the extra scope.

---

## 🤖 Bot Permissions

**OAuth2 Scopes**: `bot`, `applications.commands`

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
npm test
```

On successful start, the console will print:
```
Logged in as your-bot-name#1234
[commands] registered for guild <guild-id>
[sweep] no forums registered. Use /forum add to register one.
```

Once one or more forums are registered, the sweep instead prints one line per forum plus a total:
```
[sweep] forum <forum-id>: N scanned, M created, K resynced
[sweep] total: N scanned, M created, K resynced (0 forum(s) skipped)
```

---

## 📁 Project Structure

```
src/
├── config/env.ts                 # Environment variable loader
├── commands/
│   ├── definitions.ts             # /forum slash command definition & guild registration
│   └── forum.ts                   # /forum add|remove|list handlers
├── i18n/                          # Locale resources (ko/ja/en)
├── services/
│   ├── threadTracker.ts          # Handles threadCreate
│   ├── reactionTracker.ts        # Handles reaction changes
│   ├── startupSweeper.ts         # Sweep on startup
│   ├── cleanup.ts                # Handles starter/thread deletion
│   └── calendar/
│       ├── button.ts             # Calendar ActionRow
│       ├── eventInterval.ts      # Start/end time validation & UTC conversion (pure)
│       └── handler.ts            # Calendar button/modal
├── store/
│   ├── forumStore.ts             # Watched forum list persistence
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
