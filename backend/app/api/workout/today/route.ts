import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../../lib/auth";

const WEEK_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

type TodayWorkoutResponse =
  | {
      status: "workout";
      weekDay: string;
      workoutDayId: string;
      name: string;
      estimativeTimeInSecond: number;
      exerciseCount: number;
      coverImage: string | null;
    }
  | { status: "rest"; weekDay: string }
  | { status: "no_plan"; weekDay?: string }
  | { status: "no_profile" };

export async function GET() {
  try {
    const user = await prisma.user.findFirst();
    if (!user) {
      const body: TodayWorkoutResponse = { status: "no_profile" };
      return NextResponse.json(body, { status: 404 });
    }
    const today = WEEK_DAYS[new Date().getDay()];
    const activePlan = await prisma.workoutPlan.findFirst({
      where: { userId: user.id, isActive: true },
      include: {
        workoutDays: {
          where: { weekDay: today },
          include: { exercises: true },
        },
      },
    });
    if (!activePlan) {
      const body: TodayWorkoutResponse = { status: "no_plan" };
      return NextResponse.json(body);
    }
    const todayWorkoutDay = activePlan.workoutDays[0];
    if (!todayWorkoutDay) {
      const body: TodayWorkoutResponse = {
        status: "no_plan",
        weekDay: today,
      };
      return NextResponse.json(body);
    }
    if (todayWorkoutDay.isRest) {
      const body: TodayWorkoutResponse = {
        status: "rest",
        weekDay: today,
      };
      return NextResponse.json(body);
    }
    const body: TodayWorkoutResponse = {
      status: "workout",
      weekDay: today,
      workoutDayId: todayWorkoutDay.id,
      name: todayWorkoutDay.name,
      estimativeTimeInSecond: todayWorkoutDay.estimativeTimeInSecond,
      exerciseCount: todayWorkoutDay.exercises.length,
      coverImage: activePlan.coverImage,
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("Erro ao buscar treino de hoje:", err);
    return NextResponse.json(
      { error: "Erro ao buscar treino de hoje" },
      { status: 500 },
    );
  }
}
