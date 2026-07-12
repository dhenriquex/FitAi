import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { get } from "@/api/client";
import { ApiError } from "@/api/client";
import { DayStatus, ConsistencyData, UseConsistencyResult} from "@/types/timeTypes";

export function useConsistency(): UseConsistencyResult {
  const [weekData, setWeekData] = useState<DayStatus[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function fetchData() {
        setIsLoading(true);
        setError(null);
        try {
          const data = await get<ConsistencyData>("/api/consistency");
          if (!cancelled) {
            setWeekData(data.weekData);
            setStreak(data.streak);
          }
        } catch (err) {
          if (!cancelled) {
            const message =
              err instanceof ApiError
                ? err.message
                : "Erro ao carregar consistência";
            setError(message);
          }
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      }

      fetchData();
      return () => {
        cancelled = true;
      };
    }, [tick])
  );

  return {
    weekData,
    streak,
    isLoading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}