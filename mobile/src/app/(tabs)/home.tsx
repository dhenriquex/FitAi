import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";

const WEEKDAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];
type Profile = {
  id: number;
  weight: number;
  height: number;
  goal: string;
  user: {
    name: string;
    email: string;
  };
};
export default function WorkoutPlanPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  useEffect(() => {
    async function loadProfiles() {
      const response = await fetch("http://192.168.0.119:3000/api/profile");
      const data = await response.json();
      setProfiles(data);
    }
    loadProfiles();
  }, []);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/home-banner.jpg")}
        style={styles.banner}
        imageStyle={styles.bannerImage}
      >
        <View style={styles.overlay} />

        {/* Título do app */}
        <Text style={styles.appTitle}>FIT.AI</Text>
        <View style={styles.bannerBottom}>
          <View style={styles.badge}>
            <Ionicons name="flag-outline" size={14} color="#000" />
            <Text style={styles.badgeText}>
              {profiles[0]?.user.name.split(" ")[0]}
            </Text>
          </View>
          <View style={styles.lineText}>
            <Text style={styles.Title}>Bora treinar? </Text>
            <Text style={styles.button}>Bora</Text>
          </View>
        </View>
      </ImageBackground>
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
});
