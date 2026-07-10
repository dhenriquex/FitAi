import { WeekDay } from "../types/timeTypes";
export const WEEKDAY_LABEL: Record<WeekDay, string> = {
  Monday: "Segunda",
  Tuesday: "Terça",
  Wednesday: "Quarta",
  Thursday: "Quinta",
  Friday: "Sexta",
  Saturday: "Sábado",
  Sunday: "Domingo",
};
export const WEEK_DAYS: { value: WeekDay; label: string }[] = [
  { value: "Monday", label: "S" },
  { value: "Tuesday", label: "T" },
  { value: "Wednesday", label: "Q" },
  { value: "Thursday", label: "Q" },
  { value: "Friday", label: "S" },
  { value: "Saturday", label: "S" },
  { value: "Sunday", label: "D" },
];
export const WEEKDAY_ORDER = {
  Monday: "SEGUNDA",
  Tuesday: "TERÇA",
  Wednesday: "QUARTA",
  Thursday: "QUINTA",
  Friday: "SEXTA",
  Saturday: "SÁBADO",
  Sunday: "DOMINGO",
} as const;