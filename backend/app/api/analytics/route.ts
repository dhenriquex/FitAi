import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../lib/auth";

const BODY_PART_LABELS: Record<string, string> = {
  chest: "Peito",
  back: "Costas",
  shoulders: "Ombros",
  "upper arms": "Braços (superior)",
  "lower arms": "Antebraços",
  "upper legs": "Pernas (superior)",
  "lower legs": "Panturrilhas",
  waist: "Abdômen",
  neck: "Pescoço",
  cardio: "Cardio",
};

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? -6 : 1 - day; // segunda como início
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function weekLabel(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  try {
    const firebaseUser = await requireFirebaseUser(request);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const now = new Date();
    const currentWeekStart = startOfWeek(now);
    const eightWeeksAgo = addDays(currentWeekStart, -7 * 7);
    const thirtyDaysAgo = addDays(now, -30);
    const sevenDaysAgo = addDays(now, -7);

    // plano ativo, pra saber quantos dias por semana o usuário planejou treinar
    const activePlan = await prisma.workoutPlan.findFirst({
      where: { userId: user.id, isActive: true },
      include: { workoutDays: { where: { isRest: false } } },
    });
    const plannedPerWeek = activePlan?.workoutDays.length ?? 0;

    // sessões concluídas nas últimas 8 semanas, com detalhe completo
    const sessions = await prisma.workoutSession.findMany({
      where: {
        completed: { not: null },
        startedAt: { gte: eightWeeksAgo },
        workoutDay: { workoutPlan: { userId: user.id } },
      },
      include: {
        exercises: {
          include: {
            exercise: {
              include: {
                exerciseLibraryItem: {
                  select: { bodyPart: true },
                },
              },
            },
            sets: true,
          },
        },
      },
      orderBy: { startedAt: "asc" },
    });

    // --- volume diário (últimos 7 dias) ---
    const dayBuckets = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = addDays(now, -i);
      dayBuckets.set(d.toDateString(), 0);
    }

    // --- semanas (últimas 8) ---
    const weekBuckets = new Map<string, { label: string; completed: Set<string> }>();
    for (let i = 7; i >= 0; i--) {
      const weekStart = addDays(currentWeekStart, -7 * i);
      weekBuckets.set(weekStart.toDateString(), {
        label: weekLabel(weekStart),
        completed: new Set(),
      });
    }

    // --- distribuição por músculo (últimos 30 dias) ---
    const muscleVolume = new Map<string, { volume: number; sets: number }>();

    // --- taxa de conclusão (últimos 30 dias) ---
    let setsCompleted30d = 0;
    let setsTotal30d = 0;

    for (const session of sessions) {
      const sessionDate = session.startedAt;
      const dayKey = sessionDate.toDateString();
      const weekStart = startOfWeek(sessionDate);
      const weekKey = weekStart.toDateString();

      if (weekBuckets.has(weekKey)) {
        weekBuckets.get(weekKey)!.completed.add(session.id);
      }

      for (const sessionExercise of session.exercises) {
        const bodyPart = sessionExercise.exercise.exerciseLibraryItem?.bodyPart;

        for (const set of sessionExercise.sets) {
          const setVolume = (set.reps || 0) * (set.weight || 0);

          if (dayBuckets.has(dayKey) && set.completed) {
            dayBuckets.set(dayKey, (dayBuckets.get(dayKey) ?? 0) + setVolume);
          }

          if (sessionDate >= thirtyDaysAgo) {
            setsTotal30d += 1;
            if (set.completed) setsCompleted30d += 1;

            if (bodyPart && set.completed) {
              const current = muscleVolume.get(bodyPart) ?? { volume: 0, sets: 0 };
              current.volume += setVolume;
              current.sets += 1;
              muscleVolume.set(bodyPart, current);
            }
          }
        }
      }
    }

    const weeklyVolume = Array.from(dayBuckets.entries()).map(([dateStr, volume]) => ({
      label: new Date(dateStr).toLocaleDateString("pt-BR", { weekday: "short" }),
      volume: Math.round(volume),
    }));

    const weeks = Array.from(weekBuckets.values()).map((w) => ({
      label: w.label,
      completed: w.completed.size,
      planned: plannedPerWeek,
    }));

    // streak: conta semanas consecutivas (da mais recente pra trás)
    // em que o usuário completou ao menos 1 treino
    let currentStreakWeeks = 0;
    for (let i = weeks.length - 1; i >= 0; i--) {
      if (weeks[i].completed > 0) currentStreakWeeks += 1;
      else break;
    }

    const maxVolume = Math.max(1, ...Array.from(muscleVolume.values()).map((v) => v.volume));
    const muscleDistribution = Array.from(muscleVolume.entries())
      .map(([bodyPart, data]) => ({
        bodyPart,
        label: BODY_PART_LABELS[bodyPart] ?? bodyPart,
        volume: Math.round(data.volume),
        setsCount: data.sets,
        intensity: data.volume / maxVolume,
      }))
      .sort((a, b) => b.volume - a.volume);

    const thisWeekCompleted = weeks[weeks.length - 1]?.completed ?? 0;

    // --- PRs: maior peso já registrado por exercício, all-time ---
    const allCompletedSets = await prisma.workoutSessionSet.findMany({
      where: {
        completed: true,
        weight: { gt: 0 },
        workoutSessionExercise: {
          workoutSession: { workoutDay: { workoutPlan: { userId: user.id } } },
        },
      },
      include: {
        workoutSessionExercise: {
          select: {
            name: true,
            exercise: { select: { exerciseLibraryItemId: true } },
            workoutSession: { select: { startedAt: true } },
          },
        },
      },
      orderBy: { weight: "desc" },
    });

    const prMap = new Map<string, PersonalRecordAccumulator>();
    type PersonalRecordAccumulator = {
      exerciseLibraryItemId: string | null;
      exerciseName: string;
      bestWeight: number;
      bestReps: number;
      achievedAt: Date;
    };

    for (const set of allCompletedSets) {
      const key =
        set.workoutSessionExercise.exercise.exerciseLibraryItemId ??
        set.workoutSessionExercise.name;

      if (!prMap.has(key)) {
        prMap.set(key, {
          exerciseLibraryItemId: set.workoutSessionExercise.exercise.exerciseLibraryItemId,
          exerciseName: set.workoutSessionExercise.name,
          bestWeight: set.weight,
          bestReps: set.reps,
          achievedAt: set.workoutSessionExercise.workoutSession.startedAt,
        });
      }
    }

    const personalRecords = Array.from(prMap.values())
      .map((pr) => ({
        exerciseLibraryItemId: pr.exerciseLibraryItemId,
        exerciseName: pr.exerciseName,
        bestWeight: pr.bestWeight,
        bestReps: pr.bestReps,
        achievedAt: pr.achievedAt.toISOString(),
        isNew: pr.achievedAt >= sevenDaysAgo,
      }))
      .sort((a, b) => Number(b.isNew) - Number(a.isNew))
      .slice(0, 10);

    return NextResponse.json({
      weeklyVolume,
      totalWorkoutsThisWeek: { completed: thisWeekCompleted, planned: plannedPerWeek },
      consistency: { currentStreakWeeks, weeks },
      muscleDistribution,
      completionRate: {
        setsCompleted: setsCompleted30d,
        setsTotal: setsTotal30d,
        percentage:
          setsTotal30d > 0 ? Math.round((setsCompleted30d / setsTotal30d) * 100) : 0,
      },
      personalRecords,
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Erro ao gerar análises:", error);
    const isDev = process.env.NODE_ENV !== "production";
    const message =
      isDev && error instanceof Error ? error.message : "Erro ao gerar análises";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}