export interface PracticeSession {
  day: number;
  date: string;
  focus: string;
  duration: number;
}

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps: {
    day: number;
    duration: number;
    focus: string;
  };
  backgroundColor?: string;
  borderColor?: string;
}