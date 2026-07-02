import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../../lib/auth";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

type TodayWorkoutResponse =
  | {
      status: "workout";
      weekDay: string;
      workoutDayId: number;
      name: string;
      estimativeTimeInstructions: number;
      exerciseCount: number;
      coverImage: string | null;
    }
  | { status: "rest"; weekDay: string }
  | { status: "no_plan"; weekDay: string }
  | { status: "no_profile"; weekDay: string };

export async function GET() {
  try {
  } catch (err) {
    console.error("Erro ao buscar treino de hoje:", err);
    return NextResponse.json(
      { error: "Erro ao buscar treino de hoje" },
      { status: 500 },
    );
  }
}
