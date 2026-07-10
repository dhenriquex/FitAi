export type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";





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