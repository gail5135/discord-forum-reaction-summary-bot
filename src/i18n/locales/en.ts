export const en = {
  error: {
    cannotCalendar: "Cannot add a calendar event to this message.",
    invalidDateFormat: "Invalid date format. Please use YYYY-MM-DD.",
    invalidTimeFormat: "Invalid time format. Please use hh:mm (24-hour).",
    pastDate: "Cannot create a calendar event with a past date.",
    endBeforeStart: "End time must be after start time.",
    calendarFailed: "Failed to create the calendar event. Please check if the bot has Manage Events permission.",
    noCalendarPermission: "Only the thread starter or server administrators can add calendar events.",
  },
  modal: {
    calendarTitle: "Add Calendar Event",
    calendarDateLabel: "Date (YYYY-MM-DD)",
    calendarStartTimeLabel: "Start time (hh:mm, 24-hour)",
    calendarEndTimeLabel: "End time (hh:mm, 24-hour)",
    calendarTitleLabel: "Calendar Event Title",
    calendarTitlePlaceholder: "Enter calendar event title",
    calendarChannelPlaceholder: "Select the voice channel to gather in",
    calendarProceedHint: "Selected voice channel. Press [Enter Event Details] below to continue.",
  },
  button: {
    calendar: "Add Calendar Event",
    calendarOpenModal: "Enter Event Details",
    calendarCancel: "Cancel",
  },
  summary: {
    empty: "_No reactions yet._",
  },
  success: {
    calendarAdded: "Calendar event has been added.",
    calendarCancelled: "Event registration cancelled.",
  },
} as const;
