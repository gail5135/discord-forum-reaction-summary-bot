export const ja = {
  error: {
    cannotCalendar: "このメッセージにはカレンダーイベントを追加できません。",
    invalidDateFormat: "日付の形式が正しくありません。YYYY-MM-DD形式で入力してください。",
    invalidTimeFormat: "時刻の形式が正しくありません。hh:mm（24時間制）形式で入力してください。",
    pastDate: "過去の日付ではカレンダーイベントを登録できません。",
    endBeforeStart: "終了時刻は開始時刻より後にしてください。",
    calendarFailed: "カレンダーイベントの登録に失敗しました。ボットにイベント管理権限があるか確認してください。",
    noCalendarPermission: "スレッドの作成者またはサーバー管理者のみカレンダーイベントを追加できます。",
  },
  modal: {
    calendarTitle: "カレンダーイベント追加",
    calendarDateLabel: "日付 (YYYY-MM-DD)",
    calendarStartTimeLabel: "開始時刻 (hh:mm、24時間制)",
    calendarEndTimeLabel: "終了時刻 (hh:mm、24時間制)",
    calendarTitleLabel: "カレンダーイベントタイトル",
    calendarTitlePlaceholder: "カレンダーイベントのタイトルを入力してください",
    calendarChannelPlaceholder: "集まるボイスチャンネルを選択してください",
    calendarProceedHint: "選択したボイスチャンネルです。下の[イベントを入力]ボタンを押して続行してください。",
  },
  button: {
    calendar: "カレンダーイベント追加",
    calendarOpenModal: "イベントを入力",
    calendarCancel: "キャンセル",
  },
  command: {
    forum: {
      added: "このフォーラムを監視対象に追加しました。既存のアクティブスレッドを確認しました。",
      addedEmpty:
        "このフォーラムを監視対象に追加しました。アクティブなスレッドがないため、既存の投稿は処理していません。今後投稿される新しいスレッドは自動的に追跡されます。",
      addedNoAccess:
        "監視対象に追加しましたが、チャンネルを読み取れず既存スレッドを処理できませんでした。ボットの権限を確認してください。",
      alreadyAdded: "このフォーラムはすでに監視中です。",
      removed:
        "このフォーラムを監視対象から外しました。新しいスレッドは追跡しませんが、すでに投稿された追跡メッセージは削除されず、引き続き更新されます。",
      notRegistered: "このフォーラムは監視対象ではありません。",
      listHeader: "監視中のフォーラム:",
      listEmpty: "監視中のフォーラムはありません。`/forum add` で追加してください。",
      failed: "コマンドの処理に失敗しました。",
    },
  },
  summary: {
    empty: "_まだリアクションがありません。_",
  },
  success: {
    calendarAdded: "カレンダーイベントを登録しました。",
    calendarCancelled: "イベント登録をキャンセルしました。",
  },
} as const;
