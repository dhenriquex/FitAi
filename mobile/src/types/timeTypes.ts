export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export const WEEKDAY_LABEL: Record<WeekDay, string> = {
  Monday: "Segunda",
  Tuesday: "Terça",
  Wednesday: "Quarta",
  Thursday: "Quinta",
  Friday: "Sexta",
  Saturday: "Sábado",
  Sunday: "Domingo",
};
export type DayStatus = {
  day: WeekDay;
  active: boolean;
};

export type ConsistencyData = {
  weekData: DayStatus[];
  streak: number;
};

export type UseConsistencyResult = {
  weekData: DayStatus[];
  streak: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};