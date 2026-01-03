// app/calendar/types.ts
import { EventInput } from "@fullcalendar/core";

export interface RecurrenceConfig {
  interval: number | "";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  daysOfWeek: number[];
  endType: "never" | "date" | "count";
  endDate: string;
  endCount: number | "";
}

export interface FormState {
  title: string;
  date: string;
  type: "dog" | "cat";
  repeatType: "none" | "daily" | "weekly" | "custom";
  repeatCount: number | "";
}

export interface MyEvent extends EventInput {
  id: string;
  title: string;
  rrule?: {
    freq: string;
    interval: number;
    dtstart: string;
    until?: string;
    count?: number;
    byweekday?: string[] | number[];
  };
  start?: string;
  allDay: boolean;
  backgroundColor: string;
  extendedProps: {
    type: "dog" | "cat";
    summary: string;
  };
}
