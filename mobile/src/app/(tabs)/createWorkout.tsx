// app/(tabs)/createWorkout.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from "react-native";
import Options from "@/components/Options";
import { MuscleGroup, Equipment, Exercise } from "@/types/filterExercise";
import { MUSCLE_GROUPS, EQUIPMENTS } from "@/constants/filterexercise";
import ExerciseContent from "@/components/exercise";

const API_URL = "http://192.168.0.119:3000";

const INITIAL_LIMIT = 10;
const NEXT_LIMIT = 10;

export default function CreateWorkout() {
  const [equipament, setEquipament] = useState<Equipment | null>(null);
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedExercises, setSelectedExercises] = useState<Set<string>>(
    new Set(),
  );

  const toggleSelection = useCallback((id: string) => {
    setSelectedExercises((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const fetchingRef = useRef(false);



  async function fetchPage(
    baseUrl: string,
    pageToFetch: number,
    limit: number,
  ) {
    const response = await fetch(
      `${baseUrl}/api/exercises?page=${pageToFetch}&limit=${limit}`,
    );
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return response.json();
  }

  useEffect(() => {
    async function loadInitial() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPage(API_URL, 1, INITIAL_LIMIT);
        setExercises(Array.isArray(data?.data) ? data.data : []);
        setHasMore((data?.pagination?.pages ?? 1) > 1);
      } catch (err) {
        console.log("Falha ao carregar exercícios:", err);
        setError("Não foi possível conectar à API de exercícios.");
      } finally {
        setLoading(false);
      }
    }

    void loadInitial();
  }, []);

  const loadMore = useCallback(async () => {
    if (
      fetchingRef.current ||
      loading ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    fetchingRef.current = true;
    setLoadingMore(true);

    try {
      const alreadyLoaded = exercises.length;
      const nextPageForApi =
        Math.floor((alreadyLoaded - INITIAL_LIMIT) / NEXT_LIMIT) + 2;

      const data = await fetchPage(API_URL, nextPageForApi, NEXT_LIMIT);
      const newItems: Exercise[] = Array.isArray(data?.data) ? data.data : [];

      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setExercises((prev) => [...prev, ...newItems]);
        setHasMore(
          alreadyLoaded + newItems.length < (data?.pagination?.total ?? 0),
        );
      }
    } catch (err) {
      console.log("Falha ao carregar mais exercícios:", err);
    } finally {
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, [exercises.length, hasMore, loading, loadingMore]);

  const renderItem = useCallback(
    ({ item }: { item: Exercise }) => {
      const resolvedGifUrl = item.gifUrl
        ? item.gifUrl.startsWith("http")
          ? item.gifUrl
          : `${API_URL}${item.gifUrl}`
        : "";

      const resolvedThumbnailUrl = `${API_URL}/api/exercises/${item.id}/thumbnail`;

      return (
        <ExerciseContent
          name={item.name}
          group={item.bodyPart ?? item.muscleGroup ?? "Sem grupo"}
          secoundGroup={
            item.secondaryMuscles?.[0] ?? item.secondMuscleGroup ?? ""
          }
          thumbnailUrl={resolvedThumbnailUrl}
          gifUrl={resolvedGifUrl}
          desc={
            item.instructions?.join("\n") ??
            item.description ??
            "Sem instruções disponíveis."
          }
          isSelected={selectedExercises.has(item.id)}
          onSelect={() => toggleSelection(item.id)}
        />
      );
    },
    [selectedExercises, toggleSelection],
  );

  const keyExtractor = useCallback((item: Exercise) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextInput style={styles.input} placeholder="Buscar exercício" />
        <View style={styles.filtersContainer}>
          <View style={{ flex: 1 }}>
            <Options
              value={equipament}
              onChange={setEquipament}
              data={EQUIPMENTS}
              label="Equipamento"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Options
              data={MUSCLE_GROUPS}
              value={muscle}
              onChange={setMuscle}
              label="Músculo"
            />
          </View>
        </View>

        <FlatList
          data={exercises}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={INITIAL_LIMIT}
          maxToRenderPerBatch={10}
          windowSize={7}
          removeClippedSubviews
          updateCellsBatchingPeriod={50}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading
                ? "Carregando exercícios..."
                : (error ?? "Nenhum exercício encontrado.")}
            </Text>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator style={{ marginVertical: 16 }} />
            ) : null
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F8FC", paddingTop: 25 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filtersContainer: { gap: 8, flexDirection: "row" },
  list: { flex: 1 },
  listContent: { paddingBottom: 24 },
  emptyText: { marginTop: 16, textAlign: "center", color: "#6B7280" },
});
