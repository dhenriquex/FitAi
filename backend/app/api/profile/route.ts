import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { requireFirebaseUser, UnauthorizedError } from "../../lib/auth";
import {
  Gender,
  Goal,
  ActivityLevel,
  Experience,
} from "../../generated/prisma";

interface ProfileBody {
  birthDate: string; // ISO string, ex: "1998-04-12"
  gender: Gender;
  height: number;
  weight: number;
  targetWeight?: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  experience: Experience;
  injuries?: string; // ex: "joelho,ombro"
}

const GENDER_VALUES = Object.values(Gender);
const GOAL_VALUES = Object.values(Goal);
const ACTIVITY_VALUES = Object.values(ActivityLevel);
const EXPERIENCE_VALUES = Object.values(Experience);

function validateBody(body: Partial<ProfileBody>): string | null {
  if (!body.birthDate || isNaN(Date.parse(body.birthDate))) {
    return "Campo 'birthDate' inválido";
  }
  if (!body.gender || !GENDER_VALUES.includes(body.gender)) {
    return "Campo 'gender' inválido";
  }
  if (typeof body.height !== "number" || body.height <= 0) {
    return "Campo 'height' inválido";
  }
  if (typeof body.weight !== "number" || body.weight <= 0) {
    return "Campo 'weight' inválido";
  }
  if (!body.goal || !GOAL_VALUES.includes(body.goal)) {
    return "Campo 'goal' inválido";
  }
  if (!body.activityLevel || !ACTIVITY_VALUES.includes(body.activityLevel)) {
    return "Campo 'activityLevel' inválido";
  }
  if (!body.experience || !EXPERIENCE_VALUES.includes(body.experience)) {
    return "Campo 'experience' inválido";
  }
  return null;
}

// Cria o perfil do usuário autenticado (chamado na tela de "completar perfil")
export async function POST(req: NextRequest) {
  try {
    const firebaseUser = await requireFirebaseUser(req);

    let user = await prisma.user.findUnique({
      where: { firebaseUid: firebaseUser.uid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email ?? `${firebaseUser.uid}@firebase.local`,
          name: firebaseUser.email?.split("@")?.[0] ?? "Usuário",
        },
      });
    }

    const body = (await req.json()) as Partial<ProfileBody>;
    const validationError = validateBody(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const profile = await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        birthDate: new Date(body.birthDate!),
        gender: body.gender!,
        height: body.height!,
        weight: body.weight!,
        targetWeight: body.targetWeight ?? null,
        goal: body.goal!,
        activityLevel: body.activityLevel!,
        experience: body.experience!,
        injuries: body.injuries ?? null,
      },
      create: {
        userId: user.id,
        birthDate: new Date(body.birthDate!),
        gender: body.gender!,
        height: body.height!,
        weight: body.weight!,
        targetWeight: body.targetWeight ?? null,
        goal: body.goal!,
        activityLevel: body.activityLevel!,
        experience: body.experience!,
        injuries: body.injuries ?? null,
      },
    });

    return NextResponse.json({ profile }, { status: 201 });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    console.error("POST /api/profile error:", err);
    return NextResponse.json(
      { error: "Erro interno ao salvar perfil" },
      { status: 500 },
    );
  }
}
export async function GET() {
  const profile = await prisma.profile.findFirst({
    include: {
      user: true,
    },
  });

  return NextResponse.json(profile);
}