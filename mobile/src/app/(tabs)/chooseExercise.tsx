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
import { useRouter } from "expo-router";
import { useSelectionStore } from "../../useCases/useSelectionStore";

const API_URL = "http://192.168.0.119:3000";

const INITIAL_LIMIT = 10;
const NEXT_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 400;

type Filters = {
  search: string;
  equipment: string | null;
  bodyPart: string | null;
};

export default function ChooseExercises() {
  const [equipament, setEquipament] = useState<Equipment | null>(null);
  const [muscle, setMuscle] = useState<MuscleGroup | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const selectedMap = useSelectionStore((state) => state.selected);
  const toggle = useSelectionStore((state) => state.toggle);
  const router = useRouter();

  const requestIdRef = useRef(0);
  const fetchingRef = useRef(false);

  const toggleSelection = useCallback(
    (exercise: Exercise) => {
      toggle({
        id: exercise.id,
        name: exercise.name,
        target:
          exercise.bodyPart ??
          exercise.muscleGroup ??
          exercise.secondaryMuscles?.[0],
        bodyPart: exercise.bodyPart,
        equipment: exercise.equipment,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
        gifUrl: exercise.gifUrl,
        thumbnailUrl: `${API_URL}/api/exercises/${exercise.id}/thumbnail`,
      });
    },
    [toggle],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function buildQuery(page: number, limit: number, filters: Filters) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (filters.search) params.set("search", filters.search);
    if (filters.equipment) params.set("equipment", filters.equipment);
    if (filters.bodyPart) params.set("bodyPart", filters.bodyPart);
    return params.toString();
  }

  async function fetchPage(page: number, limit: number, filters: Filters) {
    const response = await fetch(
      `${API_URL}/api/exercises?${buildQuery(page, limit, filters)}`,
    );
    if (!response.ok) throw new Error(`Status ${response.status}`);
    return response.json();
  }

  // carga inicial
  useEffect(() => {
    const filters: Filters = {
      search: debouncedSearch,
      equipment: equipament ?? null,
      bodyPart: muscle ?? null,
    };

    const currentRequestId = ++requestIdRef.current;

    async function loadFiltered() {
      setLoading(true);
      setError(null);
      setExercises([]);
      setHasMore(true);

      try {
        const data = await fetchPage(1, INITIAL_LIMIT, filters);

        if (currentRequestId !== requestIdRef.current) return;

        setExercises(Array.isArray(data?.data) ? data.data : []);
        setHasMore(Boolean(data?.pagination?.hasMore)); // <- usa hasMore direto
      } catch (err) {
        if (currentRequestId !== requestIdRef.current) return;
        console.log("Falha ao carregar exercícios:", err);
        setError("Não foi possível conectar à API de exercícios.");
      } finally {
        if (currentRequestId === requestIdRef.current) setLoading(false);
      }
    }

    void loadFiltered();
  }, [debouncedSearch, equipament, muscle]);

  // loadMore
  const loadMore = useCallback(async () => {
    if (fetchingRef.current || loading || loadingMore || !hasMore) return;

    fetchingRef.current = true;
    setLoadingMore(true);

    const filters: Filters = {
      search: debouncedSearch,
      equipment: equipament ?? null,
      bodyPart: muscle ?? null,
    };
    const currentRequestId = requestIdRef.current;

    try {
      const alreadyLoaded = exercises.length;
      const nextPageForApi =
        Math.floor((alreadyLoaded - INITIAL_LIMIT) / NEXT_LIMIT) + 2;

      const data = await fetchPage(nextPageForApi, NEXT_LIMIT, filters);
      if (currentRequestId !== requestIdRef.current) return;

      const newItems: Exercise[] = Array.isArray(data?.data) ? data.data : [];

      setExercises((prev) => [...prev, ...newItems]);
      setHasMore(Boolean(data?.pagination?.hasMore)); // <- usa hasMore direto
    } catch (err) {
      console.log("Falha ao carregar mais exercícios:", err);
    } finally {
      setLoadingMore(false);
      fetchingRef.current = false;
    }
  }, [
    debouncedSearch,
    equipament,
    muscle,
    exercises.length,
    hasMore,
    loading,
    loadingMore,
  ]);

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
          isSelected={selectedMap.has(item.id)}
          onSelect={() => toggleSelection(item)}
        />
      );
    },
    [selectedMap, toggleSelection],
  );

  const keyExtractor = useCallback((item: Exercise) => item.id, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Buscar exercício"
          value={searchInput}
          onChangeText={setSearchInput}
          returnKeyType="search"
          autoCorrect={false}
        />
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
        {selectedMap.size > 0 && (
          <View style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={() => {
                router.push("/createWorkout");
              }}
            >
              Adicionar à rotina
            </Text>
          </View>
        )}
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
  button: {
    backgroundColor: "#2B54FF",
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    zIndex: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
