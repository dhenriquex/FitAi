import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  value: Set<T>;
  data: Option<T>[];
  onChange: (value: Set<T>) => void;
};

export default function Injuries<T>({ value, data, onChange }: Props<T>) {

  function toggleInjury(item: T) {
    const selectedOption = data.find((opt) => opt.value === item);
    const isNone = selectedOption?.label.toLowerCase().includes("nenhum");

    if (isNone) {
      if (value.has(item)) {
        onChange(new Set());
      } else {
        onChange(new Set([item]));
      }
      return;
    }

    const newValue = new Set(value);

    const noneOption = data.find((opt) => opt.label.toLowerCase().includes("nenhum"));
    if (noneOption && newValue.has(noneOption.value)) {
      newValue.delete(noneOption.value);
    }

    if (newValue.has(item)) {
      newValue.delete(item);
    } else {
      newValue.add(item);
    }

    onChange(newValue);
  }

  return (
    <View style={styles.injGrid}>
      {data.map((inj) => (
        <TouchableOpacity
          key={String(inj.value)}
          style={[
            styles.injChip,
            value.has(inj.value) && styles.injChipActive,
          ]}
          onPress={() => toggleInjury(inj.value)}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.injChipText,
              value.has(inj.value) && styles.injChipTextActive,
            ]}
          >
            {inj.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({

  injGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  injChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#E5E5E3",
    backgroundColor: "#FAFAFA",
  },

  injChipActive: {
    borderColor: "#E24B4A",
    backgroundColor: "#FEF0F0",
  },

  injChipText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "500",
  },

  injChipTextActive: {
    color: "#E24B4A",
    fontWeight: "600",
  },

});