import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { TRAINING_TECHNIQUES, TrainingTechnique } from "../types/workout";

type Props = {
  visible: boolean;
  selected: TrainingTechnique;
  onSelect: (technique: TrainingTechnique) => void;
  onClose: () => void;
};

export default function TechniquePickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Técnica</Text>
          {TRAINING_TECHNIQUES.map((technique) => {
            const isActive = technique === selected;
            return (
              <Pressable
                key={technique}
                style={[styles.option, isActive && styles.optionActive]}
                onPress={() => {
                  onSelect(technique);
                  onClose();
                }}
              >
                <Text
                  style={[styles.optionText, isActive && styles.optionTextActive]}
                >
                  {technique}
                </Text>
                {isActive ? (
                  <Feather name="check" size={16} color="#2B54FF" />
                ) : null}
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 4,
  },
  title: { fontSize: 15, fontWeight: "700", color: "#1A1A1A", marginBottom: 8 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  optionActive: { backgroundColor: "#EEF1FF" },
  optionText: { fontSize: 14, color: "#4A4A4A", fontWeight: "500" },
  optionTextActive: { color: "#2B54FF", fontWeight: "700" },
});