# Discord Reaction Summary Bot

A Discord bot that **copies** messages with `@everyone` tags in the **target channel** and displays a **summary of reactions**.

---

## ✨ Key Features

- ✅ Copies only messages with `@everyone` tag
- ✅ Automatically deletes original message after copying
- ✅ Groups reactions by emoji and displays mentions
- ✅ Supports custom emojis and animated emojis
- ✅ Edit/Delete buttons (Only available to the author)
- ✅ Add calendar event button (Register server scheduled events)
- ✅ Data persistence via JSON file (Maintained even after bot restart)
- ✅ Multi-language UI Support (English, Korean, Japanese)

---

## 🧱 Workflow

```
[Target Channel]
  └ User writes @everyone message
        ↓
  └ Bot creates copy message (includes Edit/Delete buttons)
        ↓
  └ Original message deleted
        ↓
  └ Add/Remove reactions to copy message
        ↓
  └ Bot reflects reaction info in message
```

---

## 🧩 Message Format Example

```
## **From** @User

@everyone Recruiting members

ーーーーーーーーーーーーーーーーーーーーー
👍 : @alice, @bob
🔥 : @charlie

[✏️ Edit] [🗑️ Delete]
```

---

## ⚙️ Prerequisites

- Node.js 18+
- Discord Bot Account
- TypeScript

---

## 🔐 Environment Variables

### `.env`

```env
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
TARGET_CHANNEL_ID=123456789012345678
BOT_LOCALE=en
```

| Variable            | Description                                    | Required |
| ------------------- | ---------------------------------------------- | -------- |
| `DISCORD_TOKEN`     | Bot Token issued from Discord Developer Portal | ✅       |
| `TARGET_CHANNEL_ID` | Channel ID for original and copied messages    | ✅       |
| `BOT_LOCALE`        | Button UI language (`en`, `ko`, `ja`)          | ❌       |

> **Note**: If `BOT_LOCALE` is not set, the Discord server's default language setting will be used.

---

## 🤖 Bot Permissions

In Discord Developer Portal → OAuth2 → URL Generator:

### Scopes

- ✅ `bot`

### Bot Permissions

- ✅ `View Channels`
- ✅ `Send Messages`
- ✅ `Manage Messages` (For deleting originals)
- ✅ `Read Message History`
- ✅ `Add Reactions`
- ✅ `Use External Emojis`
- ✅ `Manage Events` (For calendar event registration)

### Privileged Gateway Intents (Bot Page)

- ✅ `MESSAGE CONTENT INTENT`

---

## 🚀 How to Run

```bash
npm install
npx ts-node src/index.ts
```

Upon successful execution, the console will output:

```
Logged in as your-bot-name#1234
```

---

## 📁 Project Structure

```
src/
├── config/
│   └── env.ts              # Environment variable loader
├── services/
│   ├── copyService.ts      # Message copying
│   ├── reactionService.ts  # Reaction handling
│   ├── interactionService.ts # Button/Modal handling
├── store/
│   └── messageMap.ts       # Copy message ID store
├── utils/
│   ├── constants.ts        # Constant definitions
│   └── messageFormat.ts    # Message formatting
└── index.ts                # Entry point
```

---

## 📌 Notes

- Messages without content other than `@everyone` are not copied
- Edit/Delete is only possible by the **original author**
- Message IDs are saved in `data/` folder (included in `.gitignore`)

---

## 📄 License

MIT
