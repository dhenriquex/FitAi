import { StyleSheet, Text, View } from "react-native";

type Props = {
  data: { label: string; volume: number }[];
};

export default function VolumeChart({ data }: Props) {
  const max = Math.max(1, ...data.map((d) => d.volume));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Volume de treino</Text>
      <Text style={styles.subtitle}>Últimos 7 dias (kg × reps)</Text>

      <View style={styles.chart}>
        {data.map((item, index) => {
          const heightPct = Math.max(4, (item.volume / max) * 100);
          return (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height: `${heightPct}%` }]} />
              </View>
              <Text style={styles.barLabel}>{item.label}</Text>
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
  title: { fontSize: 14, fontWeight: "700", color: "#1A1A1A" },
  subtitle: { fontSize: 11, color: "#9297A3", marginBottom: 14 },
  chart: { flexDirection: "row", alignItems: "flex-end", height: 120, gap: 8 },
  barColumn: { flex: 1, alignItems: "center", height: "100%", justifyContent: "flex-end" },
  barTrack: {
    width: "100%",
    height: 96,
    justifyContent: "flex-end",
    backgroundColor: "#F7F8FC",
    borderRadius: 8,
    overflow: "hidden",
  },
  bar: { width: "100%", backgroundColor: "#2B54FF", borderRadius: 8 },
  barLabel: { fontSize: 10, fontWeight: "600", color: "#9297A3", marginTop: 6, textTransform: "capitalize" },
});