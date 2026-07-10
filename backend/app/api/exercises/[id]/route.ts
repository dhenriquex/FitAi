import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const exercise = await prisma.exerciseLibraryItem.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        target: true,
        bodyPart: true,
        equipment: true,
        secondaryMuscles: true,
        instructions: true,
        gifUrl: true,
      },
    });

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercício não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(exercise);
  } catch (error) {
    console.error("Erro ao buscar detalhe do exercício:", error);
    return NextResponse.json(
      { error: "Erro ao buscar detalhe do exercício" },
      { status: 500 },
    );
  }
}
