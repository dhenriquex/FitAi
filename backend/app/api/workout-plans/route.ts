// app/api/workout-plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../lib/auth";
type CreateWorkoutPlanBody = {
  name: string;
  coverImage?: string | null;
  weekDays: string[];
  exercises: {
    id: string;
    name: string;
    sets?: number;
    reps?: number;
    restTime?: number;
    technique?: string;
  }[];
};

const DEFAULT_SETS = 1;
const DEFAULT_REPS = 0;
const DEFAULT_REST_TIME = 60; // segundos
const DEFAULT_TECHNIQUE = "Padrão";
export async function POST(request: NextRequest) {
  try {
    const firebaseUser = await requireFirebaseUser(request);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const body: CreateWorkoutPlanBody = await request.json();

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Nome do treino é obrigatório" },
        { status: 400 },
      );
    }

    if (!body.weekDays || body.weekDays.length === 0) {
      return NextResponse.json(
        { error: "Selecione ao menos um dia da semana" },
        { status: 400 },
      );
    }

    if (!body.exercises || body.exercises.length === 0) {
      return NextResponse.json(
        { error: "Selecione ao menos um exercício" },
        { status: 400 },
      );
    }

    const EXECUTION_TIME_PER_SET = 30;
    const estimativeTimeInSecond = body.exercises.reduce((total, ex) => {
      const sets = ex.sets ?? DEFAULT_SETS;
      const restTime = ex.restTime ?? DEFAULT_REST_TIME;
      return total + sets * (EXECUTION_TIME_PER_SET + restTime);
    }, 0);

    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        name: body.name.trim(),
        userId: user.id,
        coverImage: body.coverImage ?? null,
        isActive: true,
        workoutDays: {
          create: body.weekDays.map((weekDay) => ({
            name: body.name.trim(),
            weekDay: weekDay as any,
            isRest: false,
            estimativeTimeInSecond,
            exercises: {
              create: body.exercises.map((exercise, index) => ({
                name: exercise.name,
                order: index + 1,
                sets: exercise.sets ?? DEFAULT_SETS,
                reps: exercise.reps ?? DEFAULT_REPS,
                restTime: exercise.restTime ?? DEFAULT_REST_TIME,
                technique: exercise.technique ?? DEFAULT_TECHNIQUE,
                exerciseLibraryItemId: exercise.id,
              })),
            },
          })),
        },
      },
      include: {
        workoutDays: { include: { exercises: true } },
      },
    });

    return NextResponse.json(workoutPlan, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Erro ao criar rotina de treino:", error);
    const isDev = process.env.NODE_ENV !== "production";
    const message =
      isDev && error instanceof Error
        ? error.message
        : "Erro ao criar rotina de treino";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const firebaseUser = await requireFirebaseUser(req);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const plans = await prisma.workoutPlan.findMany({
      where: { userId: user.id },
      include: {
        workoutDays: {
          include: { exercises: { select: { id: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(plans);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Erro ao buscar planos de treino:", error);
    return NextResponse.json(
      { error: "Erro ao buscar treinos" },
      { status: 500 },
    );
  }
}
