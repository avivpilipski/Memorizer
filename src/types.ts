export interface PracticeSession {
  day: number;
  date: string;
  focus: string;
  duration: string | number;
}

export interface CalendarEvent {
  title: string;
  start: Date | string;
  end: Date | string;
  allDay: boolean;
  extendedProps: {
    day: number;
    duration: string | number;
    focus: string;
  };
  backgroundColor?: string;
  borderColor?: string;
}