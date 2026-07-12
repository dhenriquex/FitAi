import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../lib/auth";

type CreateSessionBody = {
  workoutDayId: string;
  startedAt: string; // ISO string, capturado quando o usuário abriu a tela
  exercises: {
    exerciseId: string;
    name: string;
    sets: {
      order: number;
      reps: number;
      restTime: number;
      weight?: number;
      technique?: string;
      completed: boolean;
    }[];
  }[];
};

export async function POST(request: NextRequest) {
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

    const body: CreateSessionBody = await request.json();

    console.log("[workout-sessions] body recebido:", JSON.stringify(body, null, 2));

    if (!body.workoutDayId) {
      return NextResponse.json(
        { error: "workoutDayId é obrigatório" },
        { status: 400 }
      );
    }

    if (!body.exercises || body.exercises.length === 0) {
      return NextResponse.json(
        { error: "Nenhum exercício informado" },
        { status: 400 }
      );
    }

    const workoutDay = await prisma.workoutDay.findUnique({
      where: { id: body.workoutDayId },
      include: { workoutPlan: { select: { userId: true } } },
    });

    if (!workoutDay) {
      return NextResponse.json(
        { error: "Dia de treino não encontrado" },
        { status: 404 }
      );
    }

    if (workoutDay.workoutPlan.userId !== user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const startedAt = body.startedAt ? new Date(body.startedAt) : new Date();

    const session = await prisma.workoutSession.create({
      data: {
        workoutDayId: body.workoutDayId,
        startedAt,
        completed: new Date(), // finalizado no momento do POST
        exercises: {
          create: body.exercises.map((exercise) => ({
            exerciseId: exercise.exerciseId,
            name: exercise.name,
            sets: {
              create: exercise.sets.map((setLog) => ({
                order: setLog.order,
                reps: setLog.reps ?? 0,
                restTime: setLog.restTime ?? 60,
                weight: setLog.weight ?? 0,
                technique: setLog.technique ?? "Padrão",
                completed: setLog.completed ?? false,
              })),
            },
          })),
        },
      },
      include: {
        exercises: { include: { sets: true } },
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Erro ao salvar sessão de treino:", error);
    const isDev = process.env.NODE_ENV !== "production";
    const message =
      isDev && error instanceof Error
        ? error.message
        : "Erro ao salvar sessão de treino";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}