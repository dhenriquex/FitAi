import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  currentStreakWeeks: number;
  weeks: { label: string; completed: number; planned: number }[];
};

export default function ConsistencyCard({ currentStreakWeeks, weeks }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Consistência</Text>
          <Text style={styles.subtitle}>Últimas 8 semanas</Text>
        </View>
        <View style={styles.streakBadge}>
          <Feather name="zap" size={13} color="#2B54FF" />
          <Text style={styles.streakText}>{currentStreakWeeks} sem</Text>
        </View>
      </View>

      <View style={styles.weeksRow}>
        {weeks.map((week, index) => {
          const ratio = week.planned > 0 ? week.completed / week.planned : 0;
          const isFull = ratio >= 1 && week.planned > 0;
          const isPartial = ratio > 0 && ratio < 1;

          return (
            <View key={index} style={styles.weekColumn}>
              <View
                style={[
                  styles.weekDot,
                  isFull && styles.weekDotFull,
                  isPartial && styles.weekDotPartial,
                ]}
              >
                <Text style={styles.weekDotText}>{week.completed}</Text>
              </View>
              <Text style={styles.weekLabel}>{week.label}</Text>
            </View>
          );
        })}
      </View>
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  subtitle: { fontSize: 11, color: "#9297A3" },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF1FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  streakText: { fontSize: 12, fontWeight: "700", color: "#2B54FF" },
  weeksRow: { flexDirection: "row", justifyContent: "space-between" },
  weekColumn: { alignItems: "center", gap: 6 },
  weekDot: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "#F5F6FA",
    alignItems: "center",
    justifyContent: "center",
  },
  weekDotPartial: { backgroundColor: "#C7D3FF" },
  weekDotFull: { backgroundColor: "#2B54FF" },
  weekDotText: { fontSize: 10.5, fontWeight: "800", color: "#1A1A1A" },
  weekLabel: { fontSize: 9, color: "#B0B4BF", fontWeight: "600" },
});