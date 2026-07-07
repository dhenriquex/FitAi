import { TodayWorkoutData } from "@/types/todayworkout";
import { useEffect, useState } from "react";
const API_URL = "http://192.168.0.119:3000/api/workout/today";
export function useTodayWorkout() {
  const [data, setData] = useState<TodayWorkoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Erro ${response.status}: ${text}`);
        }

        const json: TodayWorkoutData = await response.json();
        setData(json);
      } catch (err) {
        console.error("Erro ao carregar treino de hoje:", err);
        setError("Não foi possível carregar o treino de hoje");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);
  return { data, isLoading, error };
}
