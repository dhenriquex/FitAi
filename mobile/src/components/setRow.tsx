import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { SetLog, TrainingTechnique } from "@/types/workout";
import TechniquePickerModal from "./technique";

type Props = {
  index: number;
  setLog: SetLog;
  onChange: (patch: Partial<SetLog>) => void;
  onRemove: () => void;
  canRemove: boolean;
};

export default function SetRow({ index, setLog, onChange, onRemove, canRemove }: Props) {
  const [pickerVisible, setPickerVisible] = useState(false);

  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.checkbox, setLog.completed && styles.checkboxDone]}
        onPress={() => onChange({ completed: !setLog.completed })}
        hitSlop={8}
      >
        {setLog.completed ? <Feather name="check" size={14} color="#fff" /> : null}
      </Pressable>
      <TextInput
        style={styles.numberInput}
        keyboardType="number-pad"
        placeholder="reps"
        value={setLog.reps}
        onChangeText={(text) => onChange({ reps: text.replace(/[^0-9]/g, "") })}
      />

      <TextInput
        style={styles.numberInput}
        keyboardType="number-pad"
        placeholder="kg"
        value={setLog.weight}
        onChangeText={(text) => onChange({ weight: text.replace(/[^0-9]/g, "") })}
      />

      <Pressable style={styles.techniqueButton} onPress={() => setPickerVisible(true)}>
        <Text style={styles.techniqueText} numberOfLines={1}>
          {setLog.technique}
        </Text>
        <Feather name="chevron-down" size={14} color="#2B54FF" />
      </Pressable>

      {canRemove ? (
        <Pressable style={styles.removeButton} onPress={onRemove} hitSlop={8}>
          <Feather name="x" size={14} color="#B3382C" />
        </Pressable>
      ) : (
        <View style={styles.removePlaceholder} />
      )}

      <TechniquePickerModal
        visible={pickerVisible}
        selected={setLog.technique}
        onSelect={(technique: TrainingTechnique) => onChange({ technique })}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: 6 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#C7CAD4",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#2B54FF", borderColor: "#2B54FF" },
  setIndex: { width: 24, fontSize: 12, fontWeight: "700", color: "#9297A3" },
  numberInput: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    fontSize: 13,
    textAlign: "center",
  },
  techniqueButton: {
    flex: 1.4,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  techniqueText: { fontSize: 12, color: "#4A4A4A", flexShrink: 1 },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
  
    alignItems: "center",
    justifyContent: "center",
  },
  removePlaceholder: { width: 24 },
});