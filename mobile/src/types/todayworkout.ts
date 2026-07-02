import { WeekDay } from "./timeTypes";

export type TodayWorkoutData =
  | {
      status: "workout";
      weekDay: WeekDay;
      workoutDayId: string;
      name: string;
      estimativeTimeInSecond: number;
      exerciseCount: number;
      coverImage: string | null;
    }
  | { status: "rest"; weekDay: WeekDay }
  | { status: "no_plan"; weekDay?: WeekDay }
  | { status: "no_user" };