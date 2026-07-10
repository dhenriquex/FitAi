export type ExerciseSummary = {
  id: string;
  name: string;
  target?: string;
  bodyPart?: string;
  equipment?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
  gifUrl?: string;
  thumbnailUrl?: string;
};
export type ExerciseDetail = {
  id: string;
  name: string;
  target?: string;
  equipment?: string;
  secondaryMuscles?: string[];
  instructions?: string[];
};