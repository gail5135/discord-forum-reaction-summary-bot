export const ko = {
  error: {
    cannotEdit: "이 메시지는 수정할 수 없습니다.",
    onlyAuthorEdit: "본인이 작성한 메시지만 수정할 수 있습니다.",
    messageNotFound: "메시지를 찾을 수 없습니다.",
    mustStartWithEveryone: "내용은 @everyone으로 시작해야 합니다.",
    emptyAfterEveryone: "@everyone 뒤에 내용을 입력해주세요.",
    cannotDelete: "이 메시지는 삭제할 수 없습니다.",
    onlyAuthorDelete: "본인이 작성한 메시지만 삭제할 수 있습니다.",
    cannotCalendar: "이 메시지에는 일정을 추가할 수 없습니다.",
    invalidDateFormat: "날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.",
    invalidTimeFormat: "시각 형식이 올바르지 않습니다. hh:mm (24시간제) 형식으로 입력해주세요.",
    pastDate: "과거 날짜로는 일정을 등록할 수 없습니다.",
    calendarFailed: "일정 등록에 실패했습니다. 봇에 일정 관리 권한이 있는지 확인해주세요.",
    noCalendarPermission: "메시지 작성자 또는 서버 관리자만 일정을 추가할 수 있습니다.",
  },
  modal: {
    editTitle: "메시지 수정",
    newContentLabel: "새로운 내용",
    placeholder: "수정할 내용을 입력해주세요",
    calendarTitle: "캘린더 일정 추가",
    calendarDateLabel: "날짜 (YYYY-MM-DD)",
    calendarTimeLabel: "시각 (hh:mm, 24시간제)",
    calendarTitleLabel: "일정 제목",
    calendarTitlePlaceholder: "일정 제목을 입력해주세요",
  },
  button: {
    edit: "모집 내용 수정",
    delete: "모집 삭제",
    deleteConfirm: "캘린더 일정도 함께 삭제",
    deleteCancel: "취소",
    calendar: "일정 추가",
  },
  info: {
    deletingEvents:
      "캘린더 일정 삭제 후 모집 메시지도 삭제됩니다. 삭제되는 동안 시간이 걸릴 수 있습니다.",
  },
  confirm: {
    deleteWithEvents:
      "이 모집에 연관된 캘린더 일정이 {count}개 있습니다. 모집과 함께 캘린더 일정도 삭제하시겠습니까?",
  },
  success: {
    edited: "메시지를 수정했습니다.",
    deleted: "메시지를 삭제했습니다.",
    deletedWithEvents: "모집과 연관된 캘린더 일정 {count}개를 함께 삭제했습니다.",
    deleteCancelled: "삭제를 취소했습니다.",
    calendarAdded: "캘린더에 일정이 등록되었습니다.",
  },
} as const;
