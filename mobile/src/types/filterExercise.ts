export type MuscleGroup =
  | "Todos"
  | "Biceps"
  | "Triceps"
  | "Peitoral"
  | "Costas"
  | "Ombros"
  | "Quadriceps"
  | "Posterior"
  | "Gluteos"
  | "Abdomen";
export type Equipment =
  | "Todos"
  | "Halteres"
  | "Barra"
  | "Peso Corporal"
  | "Elastico"
  | "Eliptico"
  | "Peso"
  | "Bola"
  | "Corda"
  | "Pneu";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup?: string;
  secondMuscleGroup?: string;
  equipment?: string;
  description?: string;
  gifUrl?: string;
  bodyPart?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
};
