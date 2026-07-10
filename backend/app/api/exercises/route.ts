// app/api/exercises/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const idsParam = searchParams.get("ids");
    if (idsParam) {
      const ids = idsParam.split(",").filter(Boolean);

      const exercises = await prisma.exerciseLibraryItem.findMany({
        where: { id: { in: ids } },
        select: {
          id: true,
          name: true,
          target: true,
          bodyPart: true,
          equipment: true,
          secondaryMuscles: true,
          instructions: true,
        },
      });
      return NextResponse.json({ data: exercises });
    }

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search");
    const equipment = searchParams.get("equipment");
    const bodyPart = searchParams.get("bodyPart");

    const skip = (page - 1) * limit;

    // Aplica todos os filtros que o front realmente envia.
    // Ajuste "name"/"bodyPart" conforme os nomes reais das colunas no seu schema.
    const where = {
      ...(equipment && { equipment }),
      ...(bodyPart && { bodyPart }),
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const exercises = await prisma.exerciseLibraryItem.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        target: true,
        bodyPart: true,
        equipment: true,
        gifUrl: true,
        instructions: true,
      },
    });

  
    const hasMore = exercises.length === limit;

    return NextResponse.json({
      data: exercises,
      pagination: {
        page,
        limit,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar exercícios:", error);
    return NextResponse.json(
      { error: "Erro ao buscar exercícios" },
      { status: 500 },
    );
  }
}