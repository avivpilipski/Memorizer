export type PracticeSession = {
  day: number;
  date: string;
  focus: string;
  duration: number;
};

export type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  extendedProps: {
    day: number;
    duration: number;
    focus: string;
  };
  backgroundColor: string;
  borderColor: string;
};