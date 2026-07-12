import { StyleSheet, Text, View } from "react-native";
import Feather from "@expo/vector-icons/Feather";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  subtitle?: string;
};

export default function StatCard({ icon, label, value, subtitle }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Feather name={icon} size={16} color="#2B54FF" />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: "#F0F1F5",
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: "#EEF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  value: { fontSize: 20, fontWeight: "800", color: "#1A1A1A" },
  label: { fontSize: 11.5, fontWeight: "600", color: "#6B7280" },
  subtitle: { fontSize: 10.5, color: "#9297A3" },
});