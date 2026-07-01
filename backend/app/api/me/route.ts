import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../lib/auth";

export async function GET(req: NextRequest) {
  try {
    const firebaseUser = await requireFirebaseUser(req);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado no banco" },
        { status: 404 },
      );
    }

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error("GET /api/me error:", err);
    return NextResponse.json(
      { error: "Erro interno ao buscar usuário" },
      { status: 500 },
    );
  }
}
