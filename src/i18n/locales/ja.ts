export const ja = {
  error: {
    cannotCalendar: "このメッセージにはカレンダーイベントを追加できません。",
    invalidDateFormat: "日付の形式が正しくありません。YYYY-MM-DD形式で入力してください。",
    invalidTimeFormat: "時刻の形式が正しくありません。hh:mm（24時間制）形式で入力してください。",
    pastDate: "過去の日付ではカレンダーイベントを登録できません。",
    calendarFailed: "カレンダーイベントの登録に失敗しました。ボットにイベント管理権限があるか確認してください。",
    noCalendarPermission: "スレッドの作成者またはサーバー管理者のみカレンダーイベントを追加できます。",
  },
  modal: {
    calendarTitle: "カレンダーイベント追加",
    calendarDateLabel: "日付 (YYYY-MM-DD)",
    calendarTimeLabel: "時刻 (hh:mm、24時間制)",
    calendarTitleLabel: "カレンダーイベントタイトル",
    calendarTitlePlaceholder: "カレンダーイベントのタイトルを入力してください",
  },
  button: {
    calendar: "カレンダーイベント追加",
  },
  summary: {
    empty: "_まだリアクションがありません。_",
  },
  success: {
    calendarAdded: "カレンダーイベントを登録しました。",
  },
} as const;
