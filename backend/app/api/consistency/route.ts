import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../lib/auth";
import { WeekDay } from "@/app/generated/prisma";

const WEEK_DAYS: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfWeek(startOfWeek: Date): Date {
  const d = new Date(startOfWeek);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
}
async function calcStreak(userId: number): Promise<number> {
  const sessions = await prisma.workoutSession.findMany({
    where: {
      workoutDay: {
        workoutPlan: { userId },
      },
      completed: { not: null },
    },
  });
  if (sessions.length === 0) return 0;
  let streak = 0;
  const checkDate = new Date();
  while (true) {
    const weekStart = getStartOfWeek(checkDate);
    const weekEnd = getEndOfWeek(weekStart);

    const hasSession = sessions.some((s) => {
      const d = s.completed!;
      return d >= weekStart && d <= weekEnd;
    });

    if (!hasSession) break;
    streak++;
    // Vai para a semana anterior
    checkDate.setDate(checkDate.getDate() - 7);
  }
  return streak;
}
export async function GET(req: NextRequest) {
  try {
    const firebaseUser = await requireFirebaseUser(req);
    const user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }
    const now = new Date();
    const weekStart = getStartOfWeek(now);
    const weekEnd = getEndOfWeek(weekStart);
    const sessionsThisWeek = await prisma.workoutSession.findMany({
      where: {
        workoutDay: {
          workoutPlan: { userId: user.id },
        },
        completed: {
          not: null,
          gte: weekStart,
          lte: weekEnd,
        },
      },
      include: {
        workoutDay: {
          select: { weekDay: true },
        },
      },
    });
    const activeDays = new Set(
      sessionsThisWeek.map((s) => s.workoutDay.weekDay),
    );
    const weekData = WEEK_DAYS.map((day) => ({
      day,
      active: activeDays.has(day),
    }));
    const streak = await calcStreak(user.id);
    return NextResponse.json({
      weekData,
      streak,
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error("GET /api/consistency error:", err);
    return NextResponse.json(
      { error: "Erro interno ao buscar consistência" },
      { status: 500 },
    );
  }
}
