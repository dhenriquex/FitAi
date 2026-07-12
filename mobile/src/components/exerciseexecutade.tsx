import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import Feather from "@expo/vector-icons/Feather";
import { ExerciseFromApi, SetLog } from "@/types/workout";
import SetRow from "./setRow";

const API_URL = "http://192.168.0.119:3000";

type Props = {
  exercise: ExerciseFromApi;
  sets: SetLog[];
  restTime: string;
  onChangeRestTime: (value: string) => void;
  onAddSet: () => void;
  onUpdateSet: (setId: string, patch: Partial<SetLog>) => void;
  onRemoveSet: (setId: string) => void;
};

export default function ExerciseExecutionCard({
  exercise,
  sets,
  restTime,
  onChangeRestTime,
  onAddSet,
  onUpdateSet,
  onRemoveSet,
}: Props) {
  const lib = exercise.exerciseLibraryItem;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{
            uri: lib?.thumbnailUrl
              ? `${API_URL}${lib.thumbnailUrl}`
              : "https://placehold.co/112x112/EEF1FF/2B54FF?text=Ex",
          }}
          style={styles.thumbnail}
          contentFit="cover"
          cachePolicy="disk"
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {exercise.name}
          </Text>
          <TextInput
            style={styles.restInput}
            placeholder="Descanso (segundos)"
            keyboardType="number-pad"
            value={restTime}
            onChangeText={(text) => onChangeRestTime(text.replace(/[^0-9]/g, ""))}
          />
    
        </View>
      </View>

      <View style={styles.columnLabels}>
        <Text style={[styles.columnLabel, { flex: 1, marginLeft: 52 }]}>reps</Text>
        <Text style={[styles.columnLabel, { flex: 1 }]}>kg</Text>
        <Text style={[styles.columnLabel, { flex: 1.4 }]}>técnica</Text>
      </View>

      {sets.map((setLog, index) => (
        <SetRow
          key={setLog.id}
          index={index}
          setLog={setLog}
          canRemove={sets.length > 1}
          onChange={(patch) => onUpdateSet(setLog.id, patch)}
          onRemove={() => onRemoveSet(setLog.id)}
        />
      ))}

      <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
        <Feather name="plus" size={14} color="#2B54FF" />
        <Text style={styles.addSetText}>Adicionar série</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  thumbnail: { width: 44, height: 44, borderRadius: 10, backgroundColor: "#F0F0F0" },
  headerInfo: { flex: 1, gap: 4 },
  name: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  groupBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF1FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  groupBadgeText: { fontSize: 11, fontWeight: "600", color: "#2B54FF" },
  restInput: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    fontSize: 12,
    marginTop: 4,
  },
  columnLabels: { flexDirection: "row", marginBottom: 2 },
  columnLabel: { fontSize: 12, fontWeight: "700", color: "#9297A3"},
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#EEF1FF",
  },
  addSetText: { fontSize: 12, fontWeight: "700", color: "#2B54FF" },
});