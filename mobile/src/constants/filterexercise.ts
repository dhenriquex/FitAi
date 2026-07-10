import { Equipment, MuscleGroup } from "./../types/filterExercise";
export const MUSCLE_GROUPS: { value: MuscleGroup; label: string }[] = [

  { value: "upper arms", label: "Braços" },
  { value: "chest", label: "Peitoral" },
  { value: "back", label: "Costas" },
  { value: "shoulders", label: "Ombros" },
  { value: "upper legs", label: "Pernas" },
  { value: "lower legs", label: "Panturrilhas" },
  { value: "waist", label: "Abdômen" },
];

export const EQUIPMENTS: { value: Equipment; label: string }[] = [
  { value: "dumbbell", label: "Halteres" },
  { value: "barbell", label: "Barra" },
  { value: "body weight", label: "Peso Corporal" },
  { value: "band", label: "Elástico" },
  { value: "elliptical machine", label: "Elíptico" },
  { value: "weighted", label: "Peso" },
  { value: "stability ball", label: "Bola" },
  { value: "rope", label: "Corda" },
  { value: "tire", label: "Pneu" },
];
