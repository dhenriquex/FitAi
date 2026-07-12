import { WeekDay } from "../types/timeTypes";
export const WEEKDAY_LABEL: Record<string, string> = {
  Sunday: "Domingo",
  Monday: "Segunda",
  Tuesday: "Terça",
  Wednesday: "Quarta",
  Thursday: "Quinta",
  Friday: "Sexta",
  Saturday: "Sábado",
};
export const WEEK_DAYS: { value: WeekDay; label: string }[] = [
   { value: "Sunday", label: "D" },
  { value: "Monday", label: "S" },
  { value: "Tuesday", label: "T" },
  { value: "Wednesday", label: "Q" },
  { value: "Thursday", label: "Q" },
  { value: "Friday", label: "S" },
  { value: "Saturday", label: "S" },
 
];
export const WEEKDAY_ORDER = {
  Sunday: "DOMINGO",
  Monday: "SEGUNDA",
  Tuesday: "TERÇA",
  Wednesday: "QUARTA",
  Thursday: "QUINTA",
  Friday: "SEXTA",
  Saturday: "SÁBADO",
} as const;
