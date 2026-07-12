import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getAuth } from "firebase/auth";
import { AnalyticsResponse } from "@/types/analitytics";
import StatCard from "@/components/ststcard";
import MuscleHeatmapBody from "@/components/muscleDistribuition";
import CompletionRateBar from "@/components/analyticsRateBar";
import PersonalRecordsList from "@/components/personalREcordsLists";

const API_URL = "http://192.168.0.119:3000";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const user = getAuth().currentUser;
        if (!user) throw new Error("Usuário não autenticado");
        const idToken = await user.getIdToken();

        const response = await fetch(`${API_URL}/api/analytics`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);

        const json: AnalyticsResponse = await response.json();
        setData(json);
      } catch (err) {
        console.log("Erro ao carregar análises:", err);
        setError("Não foi possível carregar as análises.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ?? "Sem dados."}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Análises</Text>

      <View style={styles.statsRow}>
        <StatCard
          icon="calendar"
          label="Treinos essa semana"
          value={`${data.totalWorkoutsThisWeek.completed}/${data.totalWorkoutsThisWeek.planned}`}
        />
        <StatCard
          icon="trending-up"
          label="Volume (7 dias)"
          value={`${Math.round(
            data.weeklyVolume.reduce((sum, d) => sum + d.volume, 0) / 1000,
          )}t`}
          subtitle="toneladas movimentadas"
        />
      </View>

      <MuscleHeatmapBody data={data.muscleDistribution} />
      <CompletionRateBar
        percentage={data.completionRate.percentage}
        setsCompleted={data.completionRate.setsCompleted}
        setsTotal={data.completionRate.setsTotal}
      />
      <PersonalRecordsList records={data.personalRecords} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F8FC" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F8FC",
  },
  errorText: { color: "#B3382C", fontSize: 14 },
  content: { padding: 16, paddingTop: 24, gap: 14, paddingBottom: 40 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  statsRow: { flexDirection: "row", gap: 12 },
});
