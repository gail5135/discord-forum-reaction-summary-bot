# Discord Forum Reaction Tracker Bot

指定した**フォーラムチャンネル**に新しいスレッドが作成されると、ボットが自動的に追跡メッセージを投稿し、スレッドの最初のメッセージ(スターターメッセージ)に付けられた**リアクションを絵文字ごとに誰が押したか**をリアルタイムで記録します。

---

## ✨ 機能

- ✅ 新しいスレッドが作成されると即座に追跡メッセージを投稿(空の状態でスタート)
- ✅ スターターメッセージのリアクション追加/削除時に追跡メッセージを自動編集
- ✅ 絵文字ごとにメンションをグルーピング(カスタム絵文字・アニメーション絵文字対応)
- ✅ ボット起動時にアクティブスレッドをスイープして取りこぼしを補完
- ✅ スターターメッセージやスレッドが削除されるとマッピングを自動クリーンアップ
- ✅ カレンダーイベント登録ボタン(スレッドOP / サーバー管理者)
- ✅ JSON 永続化(再起動後もマッピングを維持)
- ✅ 多言語 UI(ko / ja / en)

---

## 🧱 動作の流れ

```
[フォーラムチャンネル]
  └ ユーザーが新しいスレッドを作成(スターターメッセージは自動生成)
        ↓
  └ ボットがスレッド内に追跡メッセージを投稿(「_まだリアクションがありません。_」)
        ↓
  └ 誰かがスターターメッセージにリアクション
        ↓
  └ ボットが追跡メッセージを編集:
        👍 : @alice, @bob
        🔥 : @charlie
```

---

## ⚙️ 必要環境

- Node.js 18+
- Discord ボットアカウント
- TypeScript

---

## 🔐 環境変数

`.env`:
```env
DISCORD_TOKEN=YOUR_BOT_TOKEN
TARGET_FORUM_ID=123456789012345678
BOT_LOCALE=ja
```

| 変数 | 説明 | 必須 |
|---|---|---|
| `DISCORD_TOKEN` | Discord ボットトークン | ✅ |
| `TARGET_FORUM_ID` | 監視するフォーラムチャンネル ID | ✅ |
| `BOT_LOCALE` | `ko` / `ja` / `en`(未設定の場合はギルドの優先ロケール → `en`) | ❌ |

---

## 🤖 ボット権限

**OAuth2 Scopes**: `bot`

**Bot Permissions**:
- `View Channels`
- `Send Messages in Threads`
- `Read Message History`
- `Manage Events`(カレンダーイベント登録用)

**Gateway Intents(Bot ページ)**: すべて OFF(Privileged Intent は不要)

---

## 🚀 実行方法

```bash
npm install
npm start
```

型チェックのみ:
```bash
npm run typecheck
```

正常に起動するとコンソールに以下が出力されます:
```
Logged in as your-bot-name#1234
[sweep] N scanned, M created, K resynced
```

---

## 📁 プロジェクト構造

```
src/
├── config/env.ts                 # 環境変数ローダー
├── i18n/                          # 多言語リソース(ko/ja/en)
├── services/
│   ├── threadTracker.ts          # threadCreate 処理
│   ├── reactionTracker.ts        # リアクション変更処理
│   ├── startupSweeper.ts         # 起動時スイープ
│   ├── cleanup.ts                # スターター/スレッド削除処理
│   └── calendar/
│       ├── button.ts             # カレンダー ActionRow
│       └── handler.ts            # カレンダーボタン/モーダル
├── store/
│   └── trackingStore.ts          # マッピング永続化
├── utils/
│   ├── reactionCollector.ts      # 絵文字ごとのユーザー ID 集計
│   └── format.ts                 # 追跡メッセージのフォーマット
└── index.ts                       # エントリーポイント
```

---

## 📌 注意事項

- ボット停止中に作成されたスレッドは次回起動時のスイープで補完されます(アクティブスレッドのみ)
- アーカイブされたスレッドは意図的にスイープ対象外
- マッピングは `data/trackingMap.json` に保存されます(`.gitignore` に含まれています)

---

## 📄 ライセンス

MIT — [LICENSE](./LICENSE) を参照してください。
