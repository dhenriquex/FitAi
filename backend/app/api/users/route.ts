import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma"
import { requireFirebaseUser, UnauthorizedError } from "../../lib/auth";


export async function POST(req: NextRequest) {
  try {
    const firebaseUser = await requireFirebaseUser(req);
    const body = await req.json();

    const { name } = body as { name?: string };

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Campo 'name' é obrigatório" },
        { status: 400 }
      );
    }

    if (!firebaseUser.email) {
      return NextResponse.json(
        { error: "Token do Firebase não contém email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.upsert({
      where: { firebaseUid: firebaseUser.uid },
      update: {},
      create: {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name,
      },
      include: { profile: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error("POST /api/users error:", err);
    return NextResponse.json(
      { error: "Erro interno ao criar usuário" },
      { status: 500 }
    );
  }
}