// hooks/useTodayWorkout.ts
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { TodayWorkoutData } from "../types/todayworkout";

const API_URL = "http://192.168.0.119:3000/api/workout/today";

export function useTodayWorkout() {
  const [data, setData] = useState<TodayWorkoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erro ${response.status}: ${text}`);
      }

      const json: TodayWorkoutData = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar treino de hoje:", err);
      setError("Não foi possível carregar o treino de hoje");
    } finally {
      setIsLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return { data, isLoading, error, refetch: loadData };
}