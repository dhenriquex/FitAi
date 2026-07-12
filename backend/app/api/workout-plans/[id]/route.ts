// app/api/workout-days/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../../lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const workoutDay = await prisma.workoutDay.findUnique({
      where: { id },
      include: {
        workoutPlan: {
          select: { id: true, name: true, userId: true, coverImage: true },
        },
        exercises: {
          orderBy: { order: "asc" },
          include: {
            exerciseLibraryItem: {
              select: {
                id: true,
                target: true,
                secondaryMuscles: true,
                instructions: true,
                gifUrl: true,
              },
            },
          },
        },
      },
    });

    if (!workoutDay) {
      return NextResponse.json(
        { error: "Dia de treino não encontrado" },
        { status: 404 }
      );
    }

    // garante que o usuário só acesse dias de treino do próprio plano
    if (workoutDay.workoutPlan.userId !== user.id) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    // achata a estrutura pra ficar mais fácil de consumir no front
    const response = {
      id: workoutDay.id,
      planId: workoutDay.workoutPlan.id,
      planName: workoutDay.workoutPlan.name,
      planCoverImage: workoutDay.workoutPlan.coverImage,
      name: workoutDay.name,
      weekDay: workoutDay.weekDay,
      estimativeTimeInSecond: workoutDay.estimativeTimeInSecond,
      exercises: workoutDay.exercises.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        order: exercise.order,
        sets: exercise.sets,
        reps: exercise.reps,
        restTime: exercise.restTime,
        technique: exercise.technique,
        exerciseLibraryItem: exercise.exerciseLibraryItem
          ? {
              id: exercise.exerciseLibraryItem.id,
              target: exercise.exerciseLibraryItem.target,
              secondaryMuscles: exercise.exerciseLibraryItem.secondaryMuscles,
              instructions: exercise.exerciseLibraryItem.instructions,
              gifUrl: exercise.exerciseLibraryItem.gifUrl,
              thumbnailUrl: exercise.exerciseLibraryItem.id
                ? `/api/exercises/${exercise.exerciseLibraryItem.id}/thumbnail`
                : null,
            }
          : null,
      })),
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Erro ao buscar dia de treino:", error);
    const isDev = process.env.NODE_ENV !== "production";
    const message =
      isDev && error instanceof Error
        ? error.message
        : "Erro ao buscar dia de treino";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}