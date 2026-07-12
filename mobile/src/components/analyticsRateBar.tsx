import { StyleSheet, Text, View } from "react-native";

type Props = {
  percentage: number;
  setsCompleted: number;
  setsTotal: number;
};

export default function CompletionRateBar({ percentage, setsCompleted, setsTotal }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Taxa de conclusão</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <Text style={styles.subtitle}>
        {setsCompleted} de {setsTotal} séries concluídas (30 dias)
      </Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, percentage)}%` }]} />
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  percentage: { fontSize: 18, fontWeight: "800", color: "#2B54FF" },
  subtitle: { fontSize: 11, color: "#9297A3", marginTop: 2, marginBottom: 10 },
  track: { height: 10, borderRadius: 999, backgroundColor: "#F0F1F5", overflow: "hidden" },
  fill: { height: "100%", backgroundColor: "#2B54FF", borderRadius: 999 },
});