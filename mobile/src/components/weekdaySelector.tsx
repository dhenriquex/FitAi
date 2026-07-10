// components/WeekDaySelector.tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WeekDay } from "@/types/timeTypes";
import { WEEK_DAYS } from "@/constants/timeConstants";

type Props = {
  selected: WeekDay[];
  onChange: (days: WeekDay[]) => void;
};

export default function WeekDaySelector({ selected, onChange }: Props) {
  function toggleDay(day: WeekDay) {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day]);
    }
  }

  return (
    <View style={styles.container}>
      {WEEK_DAYS.map(({ value, label }) => {
        const isSelected = selected.includes(value);
        return (
          <TouchableOpacity
            key={value}
            style={[styles.dayCircle, isSelected && styles.dayCircleSelected]}
            onPress={() => toggleDay(value)}
            activeOpacity={0.7}
          >
            <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  dayCircle: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleSelected: {
    backgroundColor: "#2B54FF",
    borderColor: "#2B54FF",
  },
  dayText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9297A3",
  },
  dayTextSelected: {
    color: "#FFFFFF",
  },
});