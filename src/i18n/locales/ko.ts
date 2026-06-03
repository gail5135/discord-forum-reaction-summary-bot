export const ko = {
  error: {
    cannotCalendar: "이 메시지에는 일정을 추가할 수 없습니다.",
    invalidDateFormat: "날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.",
    invalidTimeFormat: "시각 형식이 올바르지 않습니다. hh:mm (24시간제) 형식으로 입력해주세요.",
    pastDate: "과거 날짜로는 일정을 등록할 수 없습니다.",
    calendarFailed: "일정 등록에 실패했습니다. 봇에 일정 관리 권한이 있는지 확인해주세요.",
    noCalendarPermission: "스레드 시작자 또는 서버 관리자만 일정을 추가할 수 있습니다.",
  },
  modal: {
    calendarTitle: "캘린더 일정 추가",
    calendarDateLabel: "날짜 (YYYY-MM-DD)",
    calendarTimeLabel: "시각 (hh:mm, 24시간제)",
    calendarTitleLabel: "일정 제목",
    calendarTitlePlaceholder: "일정 제목을 입력해주세요",
  },
  button: {
    calendar: "일정 추가",
  },
  summary: {
    empty: "_아직 반응이 없습니다._",
  },
  success: {
    calendarAdded: "캘린더에 일정이 등록되었습니다.",
  },
} as const;
