export type BodyPartVolume = {
  bodyPart: string;
  label: string;
  volume: number;
  setsCount: number;
  intensity: number; // 0 a 1, normalizado pelo maior grupo
};

export type PersonalRecord = {
  exerciseLibraryItemId: string | null;
  exerciseName: string;
  bestWeight: number;
  bestReps: number;
  achievedAt: string;
  isNew: boolean;
};

export type AnalyticsResponse = {
  weeklyVolume: { label: string; volume: number }[]; // últimos 7 dias
  totalWorkoutsThisWeek: { completed: number; planned: number };
  consistency: {
    currentStreakWeeks: number;
    weeks: { label: string; completed: number; planned: number }[]; // últimas 8 semanas
  };
  muscleDistribution: BodyPartVolume[];
  completionRate: {
    setsCompleted: number;
    setsTotal: number;
    percentage: number;
  };
  personalRecords: PersonalRecord[];
};