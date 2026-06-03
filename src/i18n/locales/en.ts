export const en = {
  error: {
    cannotCalendar: "Cannot add a calendar event to this message.",
    invalidDateFormat: "Invalid date format. Please use YYYY-MM-DD.",
    invalidTimeFormat: "Invalid time format. Please use hh:mm (24-hour).",
    pastDate: "Cannot create a calendar event with a past date.",
    calendarFailed: "Failed to create the calendar event. Please check if the bot has Manage Events permission.",
    noCalendarPermission: "Only the thread starter or server administrators can add calendar events.",
  },
  modal: {
    calendarTitle: "Add Calendar Event",
    calendarDateLabel: "Date (YYYY-MM-DD)",
    calendarTimeLabel: "Time (hh:mm, 24-hour)",
    calendarTitleLabel: "Calendar Event Title",
    calendarTitlePlaceholder: "Enter calendar event title",
  },
  button: {
    calendar: "Add Calendar Event",
  },
  summary: {
    empty: "_No reactions yet._",
  },
  success: {
    calendarAdded: "Calendar event has been added.",
  },
} as const;
