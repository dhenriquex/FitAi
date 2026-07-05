import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 50);

  const skip = (page - 1) * limit;

  const exercises = await prisma.exerciseLibraryItem.findMany({
    skip,
    take: limit,
    orderBy: {
      name: "asc",
    },
  });

  const total = await prisma.exerciseLibraryItem.count();

  return NextResponse.json({
    data: exercises,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}