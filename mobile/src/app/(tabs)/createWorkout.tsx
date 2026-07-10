// app/(tabs)/createWorkout.tsx
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSelectionStore } from "../../useCases/useSelectionStore";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import WeekDaySelector from "../../components/weekdaySelector";
import { WeekDay } from "@/types/timeTypes";

const API_URL = "http://192.168.0.119:3000";

export default function CreateWorkout() {
  const selectedMap = useSelectionStore((state) => state.selected);
  const toggle = useSelectionStore((state) => state.toggle);
  const clear = useSelectionStore((state) => state.clear);
  const selectedExercises = Array.from(selectedMap.values());
  const router = useRouter();

  const [workoutName, setWorkoutName] = useState("");
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [saving, setSaving] = useState(false);

  const canSubmit =
    workoutName.trim().length > 0 &&
    selectedDays.length > 0 &&
    selectedExercises.length > 0 &&
    !saving;

  async function handleFinish() {
    if (!canSubmit) return;

    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/workout-plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workoutName.trim(),
          weekDays: selectedDays,
          exercises: selectedExercises.map((ex) => ({
            id: ex.id,
            name: ex.name,
          })),
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? `Status ${response.status}`);
      }

      clear();
      Alert.alert("Sucesso", "Rotina criada com sucesso!");
      router.push("/(tabs)/home");
    } catch (error) {
      console.error("Erro ao salvar rotina:", error);
      Alert.alert("Erro", "Não foi possível salvar a rotina. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.avatarSection}>
        <ImageBackground
          source={require("../../assets/login-bg.png")}
          style={styles.avatarButton}
          imageStyle={styles.avatarImage}
        >
          <View style={styles.avatarOverlay}>
            <View style={styles.avatarIconCircle}>
              <MaterialIcons name="add-a-photo" size={22} color="#fff" />
            </View>
            <Text style={styles.avatarLabel}>Alterar foto</Text>
          </View>
        </ImageBackground>

        <TextInput
          style={styles.nameInput}
          placeholder="Nome do treino"
          placeholderTextColor="#A0A4AE"
          value={workoutName}
          onChangeText={setWorkoutName}
        />
      </View>

      <View style={styles.daysSection}>
        <Text style={styles.sectionTitle}>Dias da semana</Text>
        <Text style={styles.sectionSubtitle}>
          Em quais dias essa rotina estará disponível?
        </Text>
        <WeekDaySelector selected={selectedDays} onChange={setSelectedDays} />
      </View>

      <View style={styles.selectedSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Exercícios selecionados</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{selectedExercises.length}</Text>
          </View>
        </View>

        {selectedExercises.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={28} color="#C7CAD4" />
            <Text style={styles.emptyText}>Nenhum exercício selecionado ainda.</Text>
          </View>
        ) : (
          <FlatList
            data={selectedExercises}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            nestedScrollEnabled
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item, index }) => (
              <View style={styles.exerciseRow}>
                <View style={styles.exerciseIndex}>
                  <Text style={styles.exerciseIndexText}>{index + 1}</Text>
                </View>

                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.target ? (
                    <View style={styles.groupBadge}>
                      <Text style={styles.groupBadgeText}>{item.target}</Text>
                    </View>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => toggle(item)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x" size={16} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push("/(tabs)/chooseExercise")}
          activeOpacity={0.8}
        >
          <Feather name="plus" size={18} color="#2B54FF" />
          <Text style={styles.secondaryButtonText}>Adicionar mais exercícios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, !canSubmit && styles.primaryButtonDisabled]}
          onPress={handleFinish}
          activeOpacity={0.85}
          disabled={!canSubmit}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>Finalizar treino</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  scrollContent: { paddingBottom: 40 },
  avatarSection: { alignItems: "center", gap: 8, paddingHorizontal: 16 },
  avatarButton: {
    width: "100%",
    marginTop: 24,
    height: 140,
    borderRadius: 20,
    backgroundColor: "#ECEDF2",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: { borderRadius: 20 },
  avatarOverlay: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 14, alignItems: "center", gap: 6 },
  avatarIconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarLabel: { fontSize: 12, fontWeight: "600", color: "#fff" },
  nameInput: {
    width: "100%",
    marginTop: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  daysSection: { marginTop: 24, paddingHorizontal: 16 },
  sectionSubtitle: { fontSize: 12, color: "#9297A3", marginBottom: 12 },
  selectedSection: { marginTop: 28, paddingHorizontal: 16 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  countBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  countBadgeText: { fontSize: 12, fontWeight: "700", color: "#2B54FF" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EEF0F4",
    borderStyle: "dashed",
  },
  emptyText: { color: "#9297A3", fontSize: 13 },
  separator: { height: 8 },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomColor: "#EEF0F4",
    borderBottomWidth: 1,
  },
  exerciseIndex: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#F5F6FA", alignItems: "center", justifyContent: "center" },
  exerciseIndexText: { fontSize: 12, fontWeight: "700", color: "#9297A3" },
  exerciseInfo: { flex: 1, gap: 5 },
  exerciseName: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  groupBadge: { alignSelf: "flex-start", backgroundColor: "#EEF1FF", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  groupBadgeText: { fontSize: 11, fontWeight: "600", color: "#2B54FF" },
  removeButton: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#F5F6FA", alignItems: "center", justifyContent: "center" },
  actionsContainer: { marginTop: 28, paddingHorizontal: 16, gap: 12 },
  secondaryButton: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF1FF",
  },
  secondaryButtonText: { fontSize: 14, fontWeight: "700", color: "#2B54FF" },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2B54FF",
    shadowColor: "#2B54FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonDisabled: { backgroundColor: "#C7CDF5", shadowOpacity: 0, elevation: 0 },
  primaryButtonText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
});