// components/TodayWorkoutSection.tsx
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

import { WorkoutBanner, RestBanner, CreateWorkoutBanner } from "./Banner";
import { WEEKDAY_LABEL } from "@/constants/timeConstants";
import { useTodayWorkout } from "../useCases/useTodayWorkout";

export function TodayWorkoutSection() {
  const { data, isLoading, error } = useTodayWorkout();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator color="#2B54FF" />
      </View>
    );
  }

  if (error || !data || data.status === "no_user") {
    return (
      <CreateWorkoutBanner onPress={() => router.push("/createProfile")} />
    );
  }

  if (data.status === "workout") {
    return (
      <WorkoutBanner
        dayLabel={WEEKDAY_LABEL[data.weekDay]}
        name={data.name}
        minutes={Math.round(data.estimativeTimeInSecond / 60)}
        exerciseCount={data.exerciseCount}
        coverImage={data.coverImage}
        onPress={() =>
          router.push({
            pathname: "/(tabs)/workout",
            params: { dayId: data.workoutDayId },
          })
        }
      />
    );
  }

  if (data.status === "rest") {
    return <RestBanner dayLabel={WEEKDAY_LABEL[data.weekDay]} />;
  }

  return (
    <CreateWorkoutBanner
      onPress={() => router.push("/(tabs)/chooseExercise")}
    />
  );
}

const styles = StyleSheet.create({
  loadingWrapper: {
    minHeight: 160,
    marginHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
