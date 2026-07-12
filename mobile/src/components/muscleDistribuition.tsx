import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { BodyPartVolume } from "@/types/analitytics";

type Props = {
  data: BodyPartVolume[];
};

const PODIUM_COLORS = ["#FBBC05", "#a0a0a0", "#CD7F32"];

export default function MuscleDistributionCard({ data }: Props) {
  const totalVolume = data.reduce((sum, item) => sum + item.volume, 0);
  const top = data.slice(0, 6);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Músculos mais treinados</Text>
      <Text style={styles.subtitle}>Volume dos últimos 30 dias</Text>

      {top.length === 0 ? (
        <Text style={styles.emptyText}>Sem dados nos últimos 30 dias.</Text>
      ) : (
        <>
          <View style={styles.podium}>
            {top.slice(0, 3).map((item, index) => (
              <View key={item.bodyPart} style={styles.podiumItem}>
                <View
                  style={[
                    styles.podiumIconWrap,
                  ]}
                >
                  <Feather
                    name="award"
                    size={20}
                    color={PODIUM_COLORS[index]}
                  />
                </View>
                <Text style={styles.podiumLabel} numberOfLines={1}>
                  {item.label}
                </Text>
                <Text
                  style={[styles.podiumPct, { color:"#2B54FF"}]}
                >
                  {totalVolume > 0
                    ? Math.round((item.volume / totalVolume) * 100)
                    : 0}
                  %
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.list}>
            {top.map((item) => {
              const pct =
                totalVolume > 0 ? (item.volume / totalVolume) * 100 : 0;
              return (
                <View key={item.bodyPart} style={styles.listRow}>
                  <View style={styles.listHeader}>
                    <Text style={styles.listLabel}>{item.label}</Text>
                  </View>
                  <Text style={styles.listMeta}>{item.setsCount} séries</Text>
                </View>
              );
            })}
          </View>
        </>
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
  subtitle: { fontSize: 11, color: "#9297A3", marginBottom: 14 },
  emptyText: { fontSize: 12, color: "#9297A3" },
  podium: { flexDirection: "row", gap: 10 },
  podiumItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  podiumIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  podiumLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  podiumPct: { fontSize: 15, fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#F0F1F5", marginVertical: 16 },
  list: { gap: 12 },
  listRow: { gap: 5 },
  listHeader: { flexDirection: "row", justifyContent: "space-between" },
  listLabel: { fontSize: 12.5, fontWeight: "600", color: "#4A4A4A" },
  listPct: { fontSize: 12.5, fontWeight: "700", color: "#2B54FF" },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F0F1F5",
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: "#2B54FF", borderRadius: 999 },
  listMeta: { fontSize: 10.5, color: "#9297A3" },
});
