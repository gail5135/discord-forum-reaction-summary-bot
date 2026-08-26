# Discord Forum Reaction Tracker Bot

監視中の**フォーラムチャンネル**のいずれかに新しいスレッドが作成されると、ボットが自動的に追跡メッセージを投稿し、スレッドの最初のメッセージ(スターターメッセージ)に付けられた**リアクションを絵文字ごとに誰が押したか**をリアルタイムで記録します。

---

## ✨ 機能

- ✅ 新しいスレッドが作成されると即座に追跡メッセージを投稿(空の状態でスタート)
- ✅ スターターメッセージのリアクション追加/削除時に追跡メッセージを自動編集
- ✅ 絵文字ごとにメンションをグルーピング(カスタム絵文字・アニメーション絵文字対応)
- ✅ ボット起動時にアクティブスレッドをスイープして取りこぼしを補完
- ✅ スターターメッセージやスレッドが削除されるとマッピングを自動クリーンアップ
- ✅ カレンダーイベント登録ボタン(スレッドOP / サーバー管理者): ボイスチャンネルを選択してイベントを登録すると、Discord スケジュール済みイベントがそのボイスチャンネルに紐付けられます
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
BOT_LOCALE=ja
BOT_TIMEZONE=Asia/Tokyo
```

| 変数 | 説明 | 必須 |
|---|---|---|
| `DISCORD_TOKEN` | Discord ボットトークン | ✅ |
| `BOT_LOCALE` | `ko` / `ja` / `en`(未設定の場合はギルドの優先ロケール → `en`) | ❌ |
| `BOT_TIMEZONE` | カレンダー予定の入力時刻を解釈する IANA タイムゾーン（例: `Asia/Tokyo`）。未設定または無効な IANA タイムゾーンの場合は起動に失敗します | ✅ |

---

## 監視するフォーラムチャンネルの設定

監視対象のフォーラムは Discord 内のスラッシュコマンドで管理します。再起動は不要です。

| コマンド | 説明 |
| --- | --- |
| `/forum add channel:<フォーラム>` | そのフォーラムの監視を開始します。登録直後に既存のアクティブスレッドにも追跡メッセージを付けます。 |
| `/forum remove channel:<フォーラム>` | 監視を停止します。新しいスレッドを追跡しなくなるだけで、すでに投稿された追跡メッセージは残り、更新も続きます。 |
| `/forum list` | 現在監視中のフォーラム一覧 |

コマンドは既定で **サーバー管理** 権限を持つメンバーにのみ表示されます。サーバー設定 > 連携サービス から他のロールに開放できます。

**起動直後は監視中のフォーラムがありません。** `/forum add` を一度実行すると追跡が始まります。
監視リストは `data/forums.json` に保存され、再起動後も維持されます。

**バックフィルの対象はアクティブなスレッドのみです。** フォーラムの投稿は一定期間で自動的にアーカイブされ、アーカイブ済みの投稿には追跡メッセージを付けません。そのため古いフォーラムを登録すると `scanned: 0` と表示されることがあります — 不具合ではなく、スイープ対象のアクティブスレッドがなかったという意味で、この場合はアーカイブ済みの投稿が何件あるかも応答に表示されます。以降に投稿される新しいスレッドは通常どおり追跡されます。

**既存インストールをアップグレードする場合**: `/forum` コマンドには `applications.commands` OAuth2 スコープが必要ですが、以前の招待リンクにはこのスコープが含まれていませんでした。`/forum` が表示されない場合は、下記の**ボット権限**を参考に両方のスコープにチェックした状態でボットを再招待してください。再招待してもボットがサーバーから退出したりデータが失われたりすることはなく、スコープが追加で付与されるだけです。

---

## 🤖 ボット権限

**OAuth2 Scopes**: `bot`, `applications.commands`

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
npm test
```

正常に起動するとコンソールに以下が出力されます:
```
Logged in as your-bot-name#1234
[commands] registered for guild <guild-id>
[sweep] no forums registered. Use /forum add to register one.
```

フォーラムが1つ以上登録されていれば、スイープの出力はフォーラムごとの行と合計行になります:
```
[sweep] forum <forum-id>: N scanned, M created, K resynced
[sweep] total: N scanned, M created, K resynced (0 forum(s) skipped)
```

---

## 🛰️ デプロイ (pm2)

サーバーで常駐させる場合は `npm start`（ts-node）ではなく、ビルド成果物を実行します。

```bash
npm install
npm run build
pm2 start ecosystem.config.js
pm2 save
```

`pm2 startup` を一度実行しておけば、`pm2 save` で保存した状態がサーバー再起動後も自動的に復元されます。

コードを更新したとき:
```bash
git pull
npm install
npm run build
pm2 restart forum-bot
```

`dist/` は `.gitignore` の対象なので `git pull` だけでは更新されません。サーバー側で毎回 `npm run build` を実行する必要があり、ビルドに `typescript` が必要なため `npm install --omit=dev` でインストールしてはいけません。

**作業ディレクトリ（cwd）に注意。** `.env` と `data/` は起動時の作業ディレクトリを基準に解決されます。`ecosystem.config.js` が `cwd` をリポジトリのパスに固定するため上記の手順なら問題ありませんが、コマンドラインから直接起動する場合は必ず `--cwd` を指定してください:
```bash
pm2 start dist/index.js --name forum-bot --cwd /path/to/repo
```
cwd がずれると `.env` が見つからず `DISCORD_TOKEN is required` で落ちます。トークンがシステム環境変数に設定されている場合はボットは起動しますが、別の場所に空の `data/` を作ってしまうため、**監視リストが消えたように見えます。**

**インスタンスは必ず 1 つ。** ボットはゲートウェイ接続を 1 本だけ維持する必要があります。pm2 の cluster モードで複数起動すると、リアクションイベントが二重に処理され、2 つのプロセスが同時に `data/*.json` を上書きします。

ログの確認:
```bash
pm2 logs forum-bot
```

---

## 📁 プロジェクト構造

```
src/
├── config/env.ts                 # 環境変数ローダー
├── commands/
│   ├── definitions.ts             # /forum スラッシュコマンド定義・ギルド登録
│   └── forum.ts                   # /forum add|remove|list ハンドラー
├── i18n/                          # 多言語リソース(ko/ja/en)
├── services/
│   ├── threadTracker.ts          # threadCreate 処理
│   ├── reactionTracker.ts        # リアクション変更処理
│   ├── startupSweeper.ts         # 起動時スイープ
│   ├── cleanup.ts                # スターター/スレッド削除処理
│   └── calendar/
│       ├── button.ts             # カレンダー ActionRow
│       ├── eventInterval.ts      # 開始/終了時刻の検証・UTC変換 (純粋関数)
│       └── handler.ts            # カレンダーボタン/モーダル
├── store/
│   ├── forumStore.ts             # 監視フォーラム一覧の永続化
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
