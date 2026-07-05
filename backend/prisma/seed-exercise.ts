// scripts/seed-exercises.ts
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const BASE_URL = "https://exercisedb.p.rapidapi.com";
const PAGE_SIZE = 100; // tenta blocos maiores; se o provedor capar, cai pra 10 mesmo

type ExerciseDBItem = {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  gifUrl?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
};

async function fetchExercisesPage(offset: number): Promise<ExerciseDBItem[]> {
  const response = await fetch(
    `${BASE_URL}/exercises?limit=${PAGE_SIZE}&offset=${offset}`,
    {
      headers: {
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ${response.status} ao buscar exercícios: ${text}`);
  }

  return response.json();
}

async function fetchAllExercises(): Promise<ExerciseDBItem[]> {
  const all: ExerciseDBItem[] = [];
  let offset = 0;

  while (true) {
    console.log(`Buscando página offset=${offset}...`);
    const page = await fetchExercisesPage(offset);

    if (!page || page.length === 0) {
      console.log("Página vazia, parando paginação.");
      break;
    }

    all.push(...page);
    offset += page.length; // avança pela quantidade REAL retornada, não pelo PAGE_SIZE pedido

    if (offset > 5000) {
      console.warn("Limite de segurança de offset atingido, parando.");
      break;
    }
  }

  return all;
}
async function main() {
  console.log("Buscando exercícios no ExerciseDB...");
  const exercises = await fetchAllExercises();
  console.log(`${exercises.length} exercícios encontrados no total. Salvando no banco...`);

  let saved = 0;
  let skipped = 0;

  for (const exercise of exercises) {
    if (!exercise.id || !exercise.name) {
      console.warn(`Pulando exercício sem id/name:`, exercise);
      skipped++;
      continue;
    }

    const data = {
      name: exercise.name,
      bodyPart: exercise.bodyPart ?? "",
      equipment: exercise.equipment ?? "",
      target: exercise.target ?? "",
      gifUrl: `/api/exercises/${exercise.id}/gif`, 
      secondaryMuscles: exercise.secondaryMuscles ?? [],
      instructions: exercise.instructions ?? [],
    };

    await prisma.exerciseLibraryItem.upsert({
      where: { id: exercise.id },
      update: data,
      create: {
        id: exercise.id,
        ...data,
      },
    });

    saved++;
    if (saved % 100 === 0) console.log(`${saved} salvos...`);
  }

  console.log(`Concluído! ${saved} salvos, ${skipped} pulados.`);
}

main()
  .catch((error) => {
    console.error("Erro ao popular exercícios:", error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());