import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  value: T | null;
  onChange: (v: T | null) => void;
  data: Option<T>[];
};

export default function Options<T>({ value, onChange, data }: Props<T>) {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)}
        style={styles.picker}
        dropdownIconColor="#777"
      >
        <Picker.Item label="Selecione uma opção" value={null} color="#999" />

        {data.map((g) => (
          <Picker.Item key={String(g.value)} label={g.label} value={g.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    borderWidth: 0.5,
    borderColor: "#E5E5E3",
    borderRadius: 10,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
  },

  picker: {
    height: 88,
    width: "100%",
    color: "#111",
    fontSize: 15,
  },
});
