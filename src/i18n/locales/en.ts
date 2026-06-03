export const en = {
  error: {
    cannotEdit: "This message cannot be edited.",
    onlyAuthorEdit: "Only the author of the message can edit it.",
    messageNotFound: "Message not found.",
    mustStartWithEveryone: "Content must start with @everyone.",
    emptyAfterEveryone: "Please enter content after @everyone.",
    cannotDelete: "This message cannot be deleted.",
    onlyAuthorDelete: "Only the author of the message can delete it.",
    cannotCalendar: "Cannot add a calendar event to this message.",
    invalidDateFormat: "Invalid date format. Please use YYYY-MM-DD.",
    invalidTimeFormat: "Invalid time format. Please use hh:mm (24-hour).",
    pastDate: "Cannot create a calendar event with a past date.",
    calendarFailed: "Failed to create the calendar event. Please check if the bot has Manage Events permission.",
    noCalendarPermission: "Only the message author or server administrators can add calendar events.",
  },
  modal: {
    editTitle: "Edit Message",
    newContentLabel: "New Content",
    placeholder: "Enter content to edit",
    calendarTitle: "Add Calendar Event",
    calendarDateLabel: "Date (YYYY-MM-DD)",
    calendarTimeLabel: "Time (hh:mm, 24-hour)",
    calendarTitleLabel: "Calendar Event Title",
    calendarTitlePlaceholder: "Enter calendar event title",
  },
  button: {
    edit: "Edit Recruitment",
    delete: "Delete Recruitment",
    deleteConfirm: "Delete with calendar events",
    deleteCancel: "Cancel",
    calendar: "Add Calendar Event",
  },
  info: {
    deletingEvents:
      "Deleting calendar events and recruitment message. This may take a moment.",
  },
  confirm: {
    deleteWithEvents:
      "There are {count} calendar event(s) associated with this recruitment. Delete the recruitment along with the event(s)?",
  },
  success: {
    edited: "Message edited.",
    deleted: "Message deleted.",
    deletedWithEvents:
      "Recruitment and {count} associated calendar event(s) have been deleted.",
    deleteCancelled: "Deletion cancelled.",
    calendarAdded: "Calendar event has been added.",
  },
} as const;
