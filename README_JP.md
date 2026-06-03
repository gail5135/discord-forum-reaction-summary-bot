# Discord Reaction Summary Bot

**ターゲットチャンネル**で`@everyone`タグが含まれるメッセージを**ターゲットチャンネルにコピー**し、**そのリアクションを要約**して表示します。

---

## ✨ 主な機能

- ✅ `@everyone`タグが含まれるメッセージのみをコピー
- ✅ コピー後、元のメッセージを自動削除
- ✅ リアクションを絵文字ごとにまとめてメンション表示
- ✅ カスタム絵文字、アニメーション絵文字に対応
- ✅ 編集/削除ボタン（作成者本人のみ操作可能）
- ✅ カレンダーイベント追加ボタン（サーバー予定イベント登録）
- ✅ JSON ファイルによるデータの永続化（Bot 再起動時も維持）
- ✅ 多国語 UI 対応 (日本語、韓国語、英語)

---

## 🧱 動作の仕組み

```
[ターゲットチャンネル]
  └ ユーザーが @everyone メッセージを作成
        ↓
  └ Botがメッセージをコピーして投稿（編集/削除ボタン付き）
        ↓
  └ 元のメッセージを削除
        ↓
  └ コピーされたメッセージにリアクションを追加/削除
        ↓
  └ Botがリアクション情報をメッセージに反映（更新）
```

---

## 🧩 メッセージ形式の例

```
## **From** @User

@everyone 募集します

ーーーーーーーーーーーーーーーーーーーーー
👍 : @alice, @bob
🔥 : @charlie

[✏️ 編集] [🗑️ 削除]
```

---

## ⚙️ 必須環境

- Node.js 18+
- Discord Bot アカウント
- TypeScript

---

## 🔐 環境変数の設定

### `.env`

```env
DISCORD_TOKEN=YOUR_DISCORD_BOT_TOKEN
TARGET_CHANNEL_ID=123456789012345678
BOT_LOCALE=ja
```

| 変数                | 説明                                                              | 必須 |
| ------------------- | ----------------------------------------------------------------- | ---- |
| `DISCORD_TOKEN`     | Discord Developer Portal で発行された Bot Token                   | ✅   |
| `TARGET_CHANNEL_ID` | 元メッセージが投稿され、コピーメッセージが作成されるチャンネル ID | ✅   |
| `BOT_LOCALE`        | ボタン UI の言語設定 (`ja`, `ko`, `en`)                          | ❌   |

> **注意**: `BOT_LOCALE`が設定されていない場合、Discord サーバーのデフォルト言語設定が使用されます。

---

## 🤖 Bot 権限の設定

Discord Developer Portal → OAuth2 → URL Generator にて:

### Scopes

- ✅ `bot`

### Bot Permissions

- ✅ `View Channels`
- ✅ `Send Messages`
- ✅ `Manage Messages` (元メッセージ削除用)
- ✅ `Read Message History`
- ✅ `Add Reactions`
- ✅ `Use External Emojis`
- ✅ `Manage Events` (カレンダーイベント登録用)

### Privileged Gateway Intents (Bot ページ)

- ✅ `MESSAGE CONTENT INTENT`

---

## 🚀 実行方法

```bash
npm install
npx ts-node src/index.ts
```

正常に実行されると、コンソールに以下のように表示されます:

```
Logged in as your-bot-name#1234
```

---

## 📁 プロジェクト構造

```
src/
├── config/
│   └── env.ts              # 環境変数ローダー
├── services/
│   ├── copyService.ts      # メッセージコピー処理
│   ├── reactionService.ts  # リアクション処理
│   └── interactionService.ts # ボタン/モーダル処理
├── store/
│   └── messageMap.ts       # メッセージID保存ストア
├── utils/
│   ├── constants.ts        # 定数定義
│   └── messageFormat.ts    # メッセージフォーマット
└── index.ts                # エントリーポイント
```

---

## 📌 注意事項

- `@everyone`以外に内容がないメッセージはコピーされません
- 編集/削除は**元の作成者本人**のみ可能です
- `data/`フォルダにメッセージ ID が保存されます（`.gitignore`に含まれています）

---

## 📄 ライセンス

MIT
