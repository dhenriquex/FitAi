import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 50);
    const bodyPart = searchParams.get("bodyPart");
    const equipment = searchParams.get("equipment");

    const skip = (page - 1) * limit;

    const where = {
      ...(bodyPart && { bodyPart }),
      ...(equipment && { equipment }),
    };

    const [exercises, total] = await Promise.all([
      prisma.exerciseLibraryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.exerciseLibraryItem.count({ where }),
    ]);

    return NextResponse.json({
      data: exercises,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar exercícios:", error);
    return NextResponse.json(
      { error: "Erro ao buscar exercícios" },
      { status: 500 }
    );
  }
}