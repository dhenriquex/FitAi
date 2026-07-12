import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { PersonalRecord } from "@/types/analitytics";

type Props = {
  records: PersonalRecord[];
};

export default function PersonalRecordsList({ records }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Recordes pessoais</Text>
      <Text style={styles.subtitle}>
        Maior carga já registrada por exercício
      </Text>

      {records.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum recorde registrado ainda.</Text>
      ) : (
        records.map((pr) => (
          <View
            key={pr.exerciseLibraryItemId ?? pr.exerciseName}
            style={styles.row}
          >
            <View style={styles.trophyWrap}>
              <Feather name="award" size={15} color="#FBBC05" />
            </View>

            <View style={styles.info}>
              <Text style={styles.exerciseName} numberOfLines={1}>
                {pr.exerciseName}
              </Text>
              <Text style={styles.detail}>
                {pr.bestWeight}kg × {pr.bestReps} reps
              </Text>
            </View>

            {pr.isNew ? (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>novo</Text>
              </View>
            ) : null}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F1F5",
  },
  title: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  subtitle: { fontSize: 11, color: "#9297A3", marginBottom: 12 },
  emptyText: { fontSize: 12, color: "#9297A3" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F5F6FA",
  },
  trophyWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 2 },
  exerciseName: { fontSize: 13, fontWeight: "700", color: "#1A1A1A" },
  detail: { fontSize: 11.5, color: "#6B7280" },
  newBadge: {
    backgroundColor: "#34A853",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    textTransform: "uppercase",
  },
});
