import { WeekDay } from "@/types/timeTypes";

export const TRAINING_TECHNIQUES = [
  "Padrão",
  "Drop Set",
  "Cluster Set",
  "Rest Pause",
  "Super Set",
] as const;

export type TrainingTechnique = (typeof TRAINING_TECHNIQUES)[number];

export type ExerciseFromApi = {
  id: string; // id do Exercise (dentro do plano), não do ExerciseLibraryItem
  name: string;
  order: number;
  sets: number;
  reps: number | null;
  restTime: number | null;
  technique: string | null;
  exerciseLibraryItem?: {
    id: string;
    target?: string | null;
    secondaryMuscles?: string[];
    instructions?: string[];
    gifUrl?: string | null;
    thumbnailUrl?: string | null;
  } | null;
};

export type WorkoutDayFromApi = {
  id: string;
  planId: string;
  name: string;
  weekDay: WeekDay;
  estimativeTimeInSecond: number;
  planCoverImage?: string | null;
  exercises: ExerciseFromApi[];
};

export type SetLog = {
  id: string; // gerado localmente (não confundir com id do banco)
  reps: string; // string pra controlar o TextInput; parseia só no envio
  weight: string;
  technique: TrainingTechnique;
  completed: boolean;
};

export type WorkoutDaySection = {
  dayId: string;
  planId: string;
  weekDay: WeekDay;
  name: string;
  estimativeTimeInSecond: number;
  planCoverImage?: string | null;
  title: string; // exigido pelo SectionList, usamos o name
  data: ExerciseFromApi[];
};