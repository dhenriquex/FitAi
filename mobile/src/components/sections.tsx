import { StyleSheet, Text, View } from "react-native";

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
 
  divider: {
    height: 1,
    backgroundColor: "#E5E5E3",
    marginVertical: 24,
  },

  sectionLabel: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: 14,
  },

  field: {
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 7,
  },
  hint: {
    fontSize: 11,
    color: "#aaa",
    marginTop: 4,
  },
});
