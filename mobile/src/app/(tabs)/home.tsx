import { ConsistencySection } from "@/components/consistency";
import {
  CreateWorkoutBanner,
  RestBanner,
  WorkoutBanner,
} from "@/components/workoutBanner";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

type Profile = {
  id: number;
  weight: number;
  height: number;
  user: {
    name: string;
    email: string;
  };
};
export default function WorkoutPlanPage() {
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
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/home-banner.jpg")}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <View style={styles.overlay} />

        <Text style={styles.appTitle}>FIT.AI</Text>
        <View style={styles.bannerBottom}>
          <View style={styles.badge}>
            <Ionicons name="flag-outline" size={14} color="#000" />
            <Text style={styles.badgeText}>
              {isLoading
                ? "Carregando..."
                : (profile?.user.name.trim().split(/\s+/)[0] ?? "—")}
            </Text>
          </View>
          <View style={styles.lineText}>
            <Text style={styles.Title}>Bora treinar? </Text>
            <Text style={styles.button}>Bora</Text>
          </View>
        </View>
      </ImageBackground>
      <ConsistencySection />
      <View style={styles.headlineContainer}>
        <Text style={styles.title}>Treino de hoje</Text>
        <Text style={styles.link}>Ver treinos</Text>
      </View>
      <RestBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 96,
  },
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
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
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
  headlineContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 16,
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
});
