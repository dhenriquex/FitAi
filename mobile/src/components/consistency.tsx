import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useConsistency } from "../useCases/useConsistency";

import { WEEKDAY_ORDER } from "@/constants/timeConstants";

type WeekdayKey = keyof typeof WEEKDAY_ORDER;

type DayStatus = {
  day: WeekdayKey;
  active: boolean;
};

type ConsistencyProps = {
  weekData?: DayStatus[];
  streak?: number;
  isLoading?: boolean;
  error?: string | null;
  onHistoryPress?: () => void;
};

export function ConsistencySection() {
  const router = useRouter();
  const { weekData, streak, isLoading, error } = useConsistency();

  console.log("[ConsistencySection] weekData:", weekData);
  console.log("[ConsistencySection] streak:", streak);
  console.log("[ConsistencySection] isLoading:", isLoading);
  console.log("[ConsistencySection] error:", error);

  return (
    <Consistency
      weekData={weekData}
      streak={streak}
      isLoading={isLoading}
      error={error}
      // Todo mandar para o historico futuramente
      onHistoryPress={() => router.push("/(tabs)/home")}
    />
  );
}
export default function Consistency({
  weekData = [],
  streak = 0,
  isLoading = false,
  error = null,
  onHistoryPress,
}: ConsistencyProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando consistência...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Consistência</Text>
        <Text style={styles.errorText}>Erro: {error}</Text>
      </View>
    );
  }

  if (!weekData || weekData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Consistência</Text>
        <Text style={styles.emptyText}>Nenhum dado de treino ainda</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headlineContainer}>
        <Text style={styles.title}>Consistência</Text>
        <Text style={styles.link} onPress={onHistoryPress}>
          Ver histórico
        </Text>
      </View>

      <View style={styles.consistency}>
        <View style={styles.daysActiveONWeek}>
          {weekData.map(({ day, active }) => (
            <View key={day} style={styles.dayItem}>
              <View style={[styles.squar, active && styles.squarActive]} />
              <Text style={styles.dayLabel}>{WEEKDAY_ORDER[day][0]}</Text>
            </View>
          ))}
        </View>

        <View style={styles.freqeuncyFocus}>
          <AntDesign name="fire" size={24} color="#F06100" />
          <Text style={styles.streakNumber}>{streak}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  headlineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  link: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2B54FF",
  },
  consistency: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  daysActiveONWeek: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f1f1",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  dayItem: {
    alignItems: "center",
    gap: 6,
  },
  squar: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  squarActive: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#2B54FF",
    borderWidth: 1,
    borderColor: "#2B54FF",
  },

  dayLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8A8A8A",
  },
  freqeuncyFocus: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    flexDirection: "row",
    gap: 5,
    backgroundColor: "#FFD8A8",
    marginLeft: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  errorText: {
    fontSize: 14,
    color: "#DC3545",
    marginTop: 8,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 14,
    color: "#8A8A8A",
    marginTop: 8,
    fontWeight: "500",
  },
});
