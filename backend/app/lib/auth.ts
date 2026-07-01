import { NextRequest } from "next/server";
import { firebaseAdmin } from "./firebase-admin";

export class UnauthorizedError extends Error {
  constructor(message = "Não autorizado") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireFirebaseUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token ausente");
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decoded = await firebaseAdmin.verifyIdToken(idToken);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
    };
  } catch {
    throw new UnauthorizedError("Token inválido ou expirado");
  }
}
