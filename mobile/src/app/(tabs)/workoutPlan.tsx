import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  SectionList,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAuth } from "firebase/auth";

import {
  WorkoutBanner,
  RestBanner,
  CreateWorkoutBanner,
} from "@/components/Banner";
import { WEEKDAY_LABEL } from "@/constants/timeConstants";
import { ImageBackground } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Profile } from "@/types/profileTypes";
const API_URL = "http://192.168.0.119:3000";

type WeekDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

type WorkoutDay = {
  id: string;
  name: string;
  isRest: boolean;
  weekDay: WeekDay;
  estimativeTimeInSecond: number;
  exercises: { id: string }[];
};

type WorkoutPlan = {
  id: string;
  name: string;
  coverImage: string | null;
  isActive: boolean;
  workoutDays: WorkoutDay[];
};

type FlatWorkoutDay = WorkoutDay & {
  planId: string;
  planName: string;
  planCoverImage: string | null;
};

type Section = { weekDay: WeekDay; title: string; data: FlatWorkoutDay[] };

const WEEK_DAY_ORDER: WeekDay[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function WorkoutPlan() {
  const router = useRouter();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("http://192.168.0.119:3000/api/profile");
        const data = await response.json();

        console.log("Resposta da API:", data);

        setProfile(data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const fetchWorkouts = useCallback(async () => {
    try {
      setError(null);

      const user = getAuth().currentUser;
      if (!user) {
        console.log("[workout] Nenhum usuário logado no Firebase Auth");
        setError("Usuário não autenticado.");
        return;
      }

      const idToken = await user.getIdToken();
      console.log("[workout] Token obtido, indo buscar planos...");

      const res = await fetch(`${API_URL}/api/workout-plans`, {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      console.log("[workout] Status da resposta:", res.status);

      if (!res.ok) {
        const text = await res.text();
        console.log("[workout] Corpo do erro:", text);
        throw new Error(`Status ${res.status}`);
      }

      const data: WorkoutPlan[] = await res.json();
      console.log("[workout] Planos recebidos:", JSON.stringify(data, null, 2));
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("[workout] Erro ao buscar treinos:", err);
      setError("Não foi possível carregar seus treinos.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWorkouts();
  };

  const sections = useMemo<Section[]>(() => {
    const flatDays: FlatWorkoutDay[] = plans.flatMap((plan) =>
      plan.workoutDays.map((day) => ({
        ...day,
        planId: plan.id,
        planName: plan.name,
        planCoverImage: plan.coverImage,
      })),
    );

    return WEEK_DAY_ORDER.map((weekDay) => ({
      weekDay,
      title: WEEKDAY_LABEL[weekDay],
      data: flatDays.filter((day) => day.weekDay === weekDay),
    })).filter((section) => section.data.length > 0);
  }, [plans]);

  const renderItem = ({ item }: { item: FlatWorkoutDay }) => {
    if (item.isRest) {
      return <RestBanner dayLabel={WEEKDAY_LABEL[item.weekDay]} />;
    }
    return (
      <WorkoutBanner
        dayLabel={WEEKDAY_LABEL[item.weekDay]}
        name={item.name}
        minutes={Math.round(item.estimativeTimeInSecond / 60)}
        exerciseCount={item.exercises.length}
        coverImage={item.planCoverImage}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/workout",
            params: { dayId: item.id },
          })
        }
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator color="#2B54FF" />
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.container}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <CreateWorkoutBanner
          onPress={() => router.push("/(tabs)/chooseExercise")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/banner.png")}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <View style={styles.overlay} />

        <Text style={styles.appTitle}>FIT.AI</Text>
        <View style={styles.bannerBottom}>
          <View style={styles.badge}>
            <Ionicons name="flag-outline" size={14} color="#fff" />
            <Text style={styles.badgeText}>
              {isLoading ? "Carregando..." : profile?.goal?.replace(/_/g, " ")}
            </Text>
          </View>
          <View style={styles.lineText}>
            <Text style={styles.Title}>Planos de treino </Text>
          </View>
        </View>
      </ImageBackground>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <CreateWorkoutBanner
              onPress={() => router.push("/(tabs)/chooseExercise")}
            />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        SectionSeparatorComponent={() => (
          <View style={styles.sectionSeparator} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  banner: {
    height: 296,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: "12%",
    justifyContent: "space-between",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    backgroundColor: "#2B54FF",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase",
  },

  lineText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  Title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.3,
  },
  button: {
    color: "#fff",
    backgroundColor: "#2B54FF",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
    overflow: "hidden",
  },
  bannerImage: {
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  appTitle: {
    fontSize: 22,
    textTransform: "uppercase",
    color: "#fff",
    letterSpacing: 1,
    fontWeight: "900",
  },
  bannerBottom: {
    width: "100%",
    flexDirection: "column",
    gap: 12,
  },
  loadingWrapper: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
    marginHorizontal: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  errorText: { marginHorizontal: 16, marginBottom: 12, color: "#DC2626" },
  listContent: { paddingBottom: 24 },
  separator: { height: 12 },
  sectionSeparator: { height: 10 },
  footer: { marginTop: 10 },
});
