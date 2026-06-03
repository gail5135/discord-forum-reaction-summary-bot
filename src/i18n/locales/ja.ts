export const ja = {
  error: {
    cannotEdit: "このメッセージは編集できません。",
    onlyAuthorEdit: "本人が作成したメッセージのみ編集できます。",
    messageNotFound: "メッセージが見つかりません。",
    mustStartWithEveryone: "内容は @everyone で始まる必要があります。",
    emptyAfterEveryone: "@everyone の後に内容を入力してください。",
    cannotDelete: "このメッセージは削除できません。",
    onlyAuthorDelete: "本人が作成したメッセージのみ削除できます。",
    cannotCalendar: "このメッセージにはカレンダーイベントを追加できません。",
    invalidDateFormat: "日付の形式が正しくありません。YYYY-MM-DD形式で入力してください。",
    invalidTimeFormat: "時刻の形式が正しくありません。hh:mm（24時間制）形式で入力してください。",
    pastDate: "過去の日付ではカレンダーイベントを登録できません。",
    calendarFailed: "カレンダーイベントの登録に失敗しました。ボットにイベント管理権限があるか確認してください。",
    noCalendarPermission: "メッセージの作成者またはサーバー管理者のみカレンダーイベントを追加できます。",
  },
  modal: {
    editTitle: "メッセージ編集",
    newContentLabel: "新しい内容",
    placeholder: "編集する内容を入力してください",
    calendarTitle: "カレンダーイベント追加",
    calendarDateLabel: "日付 (YYYY-MM-DD)",
    calendarTimeLabel: "時刻 (hh:mm、24時間制)",
    calendarTitleLabel: "カレンダーイベントタイトル",
    calendarTitlePlaceholder: "カレンダーイベントのタイトルを入力してください",
  },
  button: {
    edit: "募集内容の編集",
    delete: "募集の削除",
    deleteConfirm: "カレンダーイベントも一緒に削除",
    deleteCancel: "キャンセル",
    calendar: "カレンダーイベント追加",
  },
  info: {
    deletingEvents:
      "カレンダーイベント削除後、募集メッセージも削除されます。削除に時間がかかる場合があります。",
  },
  confirm: {
    deleteWithEvents:
      "この募集に関連するカレンダーイベントが{count}件あります。募集と一緒にカレンダーイベントも削除しますか？",
  },
  success: {
    edited: "メッセージを編集しました。",
    deleted: "メッセージを削除しました。",
    deletedWithEvents: "募集と関連するカレンダーイベント{count}件を一緒に削除しました。",
    deleteCancelled: "削除をキャンセルしました。",
    calendarAdded: "カレンダーイベントを登録しました。",
  },
} as const;
