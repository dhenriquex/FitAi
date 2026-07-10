import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { ExerciseDetail } from "@/types/exerciseType";
const API_URL = "http://192.168.0.119:3000";


type Props = {
  exerciseId: string | null;
  onClose: () => void;
};

export default function ExerciseDetailModal({ exerciseId, onClose }: Props) {
  const [detail, setDetail] = useState<ExerciseDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!exerciseId) {
      setDetail(null);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}/api/exercises/${exerciseId}`)
      .then((res) => res.json())
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [exerciseId]);

  return (
    <Modal
      visible={!!exerciseId}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={22} color="#1A1A1A" />
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator color="#2B54FF" style={{ marginTop: 40 }} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.name}>{detail?.name}</Text>
              {detail?.equipment ? (
                <>
                  <Text style={styles.label}>Equipamento</Text>
                  <Text style={styles.desc}>{detail.equipment}</Text>
                </>
              ) : null}
              <Text style={styles.label}>Como executar</Text>
              <Text style={styles.desc}>
                {detail?.instructions?.join("\n") ??
                  "Sem instruções disponíveis."}
              </Text>
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxHeight: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
    marginBottom: 8,
  },
  desc: { fontSize: 14, lineHeight: 22, color: "#4A4A4A", marginBottom: 12 },
});
