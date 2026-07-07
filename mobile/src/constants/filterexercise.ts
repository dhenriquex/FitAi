import { Equipment, MuscleGroup } from "./../types/filterExercise";
export const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [
  { value: "Todos", label: "Todos" },
  { value: "Biceps", label: "Biceps" },
  { value: "Triceps", label: "Triceps" },
  { value: "Peitoral", label: "Peitoral" },
  { value: "Costas", label: "Costas" },
  { value: "Ombros", label: "Ombros" },
  { value: "Quadriceps", label: "Quadriceps" },
  { value: "Posterior", label: "Posterior" },
  { value: "Gluteos", label: "Gluteos" },
  { value: "Abdomen", label: "Abdomen" },
];

export const EQUIPMENTS: { value: Equipment; label: string }[] = [
  { value: "Todos", label: "Todos" },
  { value: "Halteres", label: "Halteres" },
  { value: "Barra", label: "Barra" },
  { value: "Peso Corporal", label: "Peso Corporal" },
  { value: "Elastico", label: "Elastico" },
  { value: "Eliptico", label: "Eliptico" },
  { value: "Peso", label: "Peso" },
  { value: "Bola", label: "Bola" },
  { value: "Corda", label: "Corda" },
  { value: "Pneu", label: "Pneu" },
];
