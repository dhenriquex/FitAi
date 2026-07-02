import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

export function WorkoutBanner() {
  return (
    <TouchableOpacity activeOpacity={0.85} style={styles.wrapper}>
      <ImageBackground
        source={require("../assets/login-bg.png")}
        style={styles.imageBackground}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay}>
          <View style={styles.dayRow}>
            <Feather name="calendar" size={16} color="#FFFFFF" />
            <Text style={styles.dayText}>Sexta</Text>
          </View>

          <View style={styles.workoutInfo}>
            <Text style={styles.workoutTitle}>Superiores</Text>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                 <AntDesign name="field-time" size={14} color="#FFF" />
                <Text style={styles.metaText}>45 min</Text>
              </View>
              <View style={styles.metaItem}>
                <MaterialCommunityIcons
                  name="weight-lifter"
                  size={14}
                  color="#FFFFFF"
                />
                <Text style={styles.metaText}>5 exercícios</Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

export function RestBanner() {
  return (
    <View style={styles.restWrapper}>
      <View style={styles.dayRow}>
        <Feather name="calendar" size={16} color="#8A8A8A" />
        <Text style={styles.restDayText}>Sexta</Text>
      </View>

      <View style={styles.restContent}>
        <SimpleLineIcons name="energy" size={20} color="#2B54FF" />
        <Text style={styles.restText}>Descanso</Text>
      </View>
    </View>
  );
}

export function CreateWorkoutBanner() {
  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.createWrapper}>
      <View style={styles.createContent}>
        <FontAwesome6 name="add" size={18} color="#2B54FF" />
        <Text style={styles.createText}>Adicionar Treino</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // WorkoutBanner
  wrapper: {
    borderRadius: 16,
    overflow: "hidden",
  },
  imageBackground: {
    marginHorizontal:16,
    minHeight: 160,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 16,
    gap: 8,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  workoutInfo: {
    gap: 6,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFFFFF",
  },

  // RestBanner
  restWrapper: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 16,
    minHeight: 140,
    justifyContent: "space-between",
     marginHorizontal:16,
  },
  restDayText: {
    fontSize: 13,
    fontWeight: "600",
   
    color: "#8A8A8A",
  },
  restContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  restText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },


  createWrapper: {
    borderRadius: 16,
    marginHorizontal:16,
    borderWidth: 1.5,
    borderColor: "#2B54FF",
    borderStyle: "dashed",
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  createContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  createText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2B54FF",
  },
});