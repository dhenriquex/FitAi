export type MuscleGroup =
  | "upper arms"
  | "chest"
  | "back"
  | "shoulders"
  | "upper legs"
  | "lower legs"
  | "waist";

export type Equipment =
  | "dumbbell"
  | "barbell"
  | "body weight"
  | "band"
  | "elliptical machine"
  | "weighted"
  | "stability ball"
  | "rope"
  | "tire";

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
