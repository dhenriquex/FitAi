import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getAuth } from "firebase/auth";
import { WorkoutBanner } from "@/components/Banner";
import ExerciseExecutionCard from "@/components/exerciseexecutade";
import { WEEKDAY_LABEL } from "@/constants/timeConstants";
import {
  ExerciseFromApi,
  SetLog,
  WorkoutDayFromApi,
  WorkoutDaySection,
} from "@/types/workout";

const API_URL = "http://192.168.0.119:3000";

function createSetLog(exercise: ExerciseFromApi): SetLog {
  return {
    id: `${exercise.id}-${Math.random().toString(36).slice(2, 9)}`,
    reps: exercise.reps ? String(exercise.reps) : "",
    weight: "",
    technique: (exercise.technique as SetLog["technique"]) || "Padrão",
    completed: false,
  };
}

export default function WorkoutPage() {
  const router = useRouter();
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const [sections, setSections] = useState<WorkoutDaySection[]>([]);
  const [setsByExercise, setSetsByExercise] = useState<
    Record<string, SetLog[]>
  >({});
  const [restTimeByExercise, setRestTimeByExercise] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [startedAt] = useState(() => new Date().toISOString());
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error("Usuário não autenticado");
        const idToken = await user.getIdToken();

        if (!dayId) throw new Error("ID do treino não fornecido");

        const response = await fetch(`${API_URL}/api/workout-plans/${dayId}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        const json = await response.json();
        const data: WorkoutDayFromApi = json.data;

        if (!data) throw new Error("Dia de treino não encontrado");

        const nextSections: WorkoutDaySection[] = [
          {
            dayId: data.id,
            planId: data.planId,
            weekDay: data.weekDay,
            name: data.name,
            estimativeTimeInSecond: data.estimativeTimeInSecond,
            planCoverImage: data.planCoverImage,
            title: data.name,
            data: data.exercises,
          },
        ];

        const initialSets: Record<string, SetLog[]> = {};
        const initialRestTimes: Record<string, string> = {};
        data.exercises.forEach((exercise) => {
          const count = Math.max(1, exercise.sets ?? 1);
          initialSets[exercise.id] = Array.from({ length: count }, () =>
            createSetLog(exercise),
          );
          initialRestTimes[exercise.id] = exercise.restTime
            ? String(exercise.restTime)
            : "60";
        });

        setSections(nextSections);
        setSetsByExercise(initialSets);
        setRestTimeByExercise(initialRestTimes);
      } catch (err) {
        console.log("Erro ao carregar treino:", err);
        setError("Não foi possível carregar o treino.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [dayId]);

  const addSet = useCallback((exercise: ExerciseFromApi) => {
    setSetsByExercise((prev) => ({
      ...prev,
      [exercise.id]: [...(prev[exercise.id] ?? []), createSetLog(exercise)],
    }));
  }, []);

  const updateSet = useCallback(
    (exerciseId: string, setId: string, patch: Partial<SetLog>) => {
      setSetsByExercise((prev) => ({
        ...prev,
        [exerciseId]: (prev[exerciseId] ?? []).map((s) =>
          s.id === setId ? { ...s, ...patch } : s,
        ),
      }));
    },
    [],
  );

  const removeSet = useCallback((exerciseId: string, setId: string) => {
    setSetsByExercise((prev) => ({
      ...prev,
      [exerciseId]: (prev[exerciseId] ?? []).filter((s) => s.id !== setId),
    }));
  }, []);

  async function handleFinish() {
    setSaving(true);
    try {
      const user = getAuth().currentUser;
      if (!user) throw new Error("Usuário não autenticado");
      const idToken = await user.getIdToken();

      if (sections.length === 0) throw new Error("Nenhum treino carregado.");

      const payload = {
        workoutDayId: dayId,
        startedAt,
        exercises: sections[0].data.map((exercise) => ({
          exerciseId: exercise.id,
          name: exercise.name,
          sets: (setsByExercise[exercise.id] ?? []).map((setLog, index) => ({
            order: index + 1,
            reps: Number(setLog.reps) || 0,
            restTime: Number(restTimeByExercise[exercise.id]) || 60,
            weight: Number(setLog.weight) || 0,
            technique: setLog.technique,
            completed: setLog.completed,
          })),
        })),
      };

      console.log("[handleFinish] payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(`${API_URL}/api/workout-sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        console.error("[handleFinish] erro da API:", errorBody);
        throw new Error(errorBody?.error ?? `Status ${response.status}`);
      }

      Alert.alert("Treino concluído", "Seu treino foi salvo com sucesso!");
      router.push("/(tabs)/home");
    } catch (err) {
      console.log("Erro ao finalizar treino:", err);
      Alert.alert("Erro", "Não foi possível salvar o treino. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderWrapper}>
            <WorkoutBanner
              dayLabel={WEEKDAY_LABEL[section.weekDay]}
              name={section.name}
              minutes={Math.round(section.estimativeTimeInSecond / 60)}
              exerciseCount={section.data.length}
              coverImage={section.planCoverImage ?? undefined}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home",
                  params: { planId: section.planId, dayId: section.dayId },
                })
              }
            />
          </View>
        )}
        renderItem={({ item }) => (
          <ExerciseExecutionCard
            exercise={item}
            sets={setsByExercise[item.id] ?? []}
            restTime={restTimeByExercise[item.id] || "60"}
            onChangeRestTime={(val) =>
              setRestTimeByExercise((prev) => ({ ...prev, [item.id]: val }))
            }
            onAddSet={() => addSet(item)}
            onUpdateSet={(setId, patch) => updateSet(item.id, setId, patch)}
            onRemoveSet={(setId) => removeSet(item.id, setId)}
          />
        )}
        renderSectionFooter={({ section }) => (
          <TouchableOpacity
            style={styles.addExerciseButton}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/chooseExercise",
                params: { planId: section.planId, dayId: section.dayId },
              })
            }
          >
            <Text style={styles.addExerciseText}>
              + Adicionar mais exercícios
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhum treino encontrado para hoje.
          </Text>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.finishButton, saving && styles.finishButtonDisabled]}
          onPress={handleFinish}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.finishButtonText}>Finalizar treino</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { color: "#B3382C", fontSize: 14 },
  listContent: { marginTop: 50, paddingBottom: 100, gap: 8 },
  sectionHeaderWrapper: { marginBottom: 12, width: "100%" },
  addExerciseButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  addExerciseText: { fontSize: 13, fontWeight: "700", color: "#2B54FF" },
  emptyText: { textAlign: "center", color: "#9297A3", marginTop: 24 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#F7F8FC",
    borderTopWidth: 1,
    borderTopColor: "#EEF0F4",
  },
  finishButton: {
    backgroundColor: "#2B54FF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  finishButtonDisabled: { backgroundColor: "#C7CDF5" },
  finishButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
