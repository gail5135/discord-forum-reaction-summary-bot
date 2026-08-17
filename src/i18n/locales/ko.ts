export const ko = {
  error: {
    cannotCalendar: "이 메시지에는 일정을 추가할 수 없습니다.",
    invalidDateFormat: "날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.",
    invalidTimeFormat: "시각 형식이 올바르지 않습니다. hh:mm (24시간제) 형식으로 입력해주세요.",
    pastDate: "과거 날짜로는 일정을 등록할 수 없습니다.",
    endBeforeStart: "종료 시각은 시작 시각보다 뒤여야 합니다.",
    calendarFailed: "일정 등록에 실패했습니다. 봇에 일정 관리 권한이 있는지 확인해주세요.",
    noCalendarPermission: "스레드 시작자 또는 서버 관리자만 일정을 추가할 수 있습니다.",
  },
  modal: {
    calendarTitle: "캘린더 일정 추가",
    calendarDateLabel: "날짜 (YYYY-MM-DD)",
    calendarStartTimeLabel: "시작 시각 (hh:mm, 24시간제)",
    calendarEndTimeLabel: "종료 시각 (hh:mm, 24시간제)",
    calendarTitleLabel: "일정 제목",
    calendarTitlePlaceholder: "일정 제목을 입력해주세요",
    calendarChannelPlaceholder: "모일 음성 채널을 선택해주세요",
    calendarProceedHint: "선택한 음성 채널입니다. 아래 [일정 입력] 버튼을 눌러 계속하세요.",
  },
  button: {
    calendar: "일정 추가",
    calendarOpenModal: "일정 입력",
    calendarCancel: "취소",
  },
  command: {
    forum: {
      added: "이 포럼을 감시 대상에 추가했습니다. 기존 활성 스레드를 훑었습니다.",
      addedNoAccess:
        "감시 대상에 추가했지만 채널을 읽을 수 없어 기존 스레드는 처리하지 못했습니다. 봇 권한을 확인해주세요.",
      alreadyAdded: "이미 감시 중인 포럼입니다.",
      removed:
        "이 포럼을 감시 대상에서 제거했습니다. 새 스레드는 더 이상 추적하지 않지만, 이미 달린 추적 메시지는 지워지지 않고 계속 갱신됩니다.",
      notRegistered: "감시 중인 포럼이 아닙니다.",
      listHeader: "감시 중인 포럼:",
      listEmpty: "감시 중인 포럼이 없습니다. `/forum add`로 추가해주세요.",
      failed: "명령 처리에 실패했습니다.",
    },
  },
  summary: {
    empty: "_아직 반응이 없습니다._",
  },
  success: {
    calendarAdded: "캘린더에 일정이 등록되었습니다.",
    calendarCancelled: "이벤트 등록을 취소했습니다.",
  },
} as const;
