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

**The backfill covers active threads only.** Forum posts are archived automatically after a period of inactivity, and archived posts do not get tracking messages. So adding an older forum can report `scanned: 0` — that is not a malfunction, it means there were no active threads to sweep, and the reply tells you how many archived posts were left out. New posts from then on are tracked normally.

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

## 🛰️ Deployment (pm2)

To keep the bot running on a server, run the build output rather than `npm start` (which uses ts-node).

```bash
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
```

Run `pm2 startup` once and the state saved by `pm2 save` is restored automatically after a server reboot.

To deploy an update:
```bash
git pull
npm install
npm run build
pm2 restart forum-bot
```

`dist/` is in `.gitignore`, so `git pull` alone does not refresh it. You must run `npm run build` on the server every time, and since the build needs `typescript`, do not install with `npm install --omit=dev`.

**Mind the working directory.** `.env` and `data/` are resolved from the current working directory at startup. `ecosystem.config.js` pins `cwd` to the repo, so the commands above are safe — but if you start the process by hand, always pass `--cwd`:
```bash
pm2 start dist/index.js --name forum-bot --cwd /path/to/repo
```
With the wrong cwd the bot cannot find `.env` and dies with `DISCORD_TOKEN is required`. If the token happens to be set as a system environment variable, the bot starts but creates an empty `data/` in the wrong place, which **looks exactly like the watch list was wiped.**

**Exactly one instance.** The bot must hold a single gateway connection. Running it under pm2 cluster mode processes every reaction event twice and lets two processes overwrite `data/*.json` at the same time.

Viewing logs:
```bash
pm2 logs forum-bot
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
