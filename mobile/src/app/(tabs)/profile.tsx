import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SectionLabel, Divider, Field } from "@/components/sections";
import { calculateIMC, classifyIMC } from "@/helpers/IMC";
type Profile = {
  id: number;
  weight: number;
  height: number;
  user: {
    name: string;
    email: string;
  };
};



export default function Profile() {
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

  const imc = profile ? calculateIMC(profile.weight, profile.height) : null;
  const imcClassification = imc ? classifyIMC(imc) : null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.avatarSection}>
        <TouchableOpacity style={styles.avatarButton}>
          <MaterialIcons name="add-a-photo" size={26} color="#B0B0B0" />
        </TouchableOpacity>
        <Text style={styles.avatarLabel}>Alterar foto</Text>

        {!isLoading && profile && (
          <View style={styles.heroText}>
            <Text style={styles.heroName}>{profile.user.name}</Text>
            <Text style={styles.heroEmail}>{profile.user.email}</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <SectionLabel>Dados pessoais</SectionLabel>
        <Field label="Nome">
          <Text style={styles.value}>
            {isLoading ? "Carregando..." : profile?.user.name ?? "—"}
          </Text>
        </Field>
        <Divider />
        <Field label="Email">
          <Text style={styles.value}>
            {isLoading ? "Carregando..." : profile?.user.email ?? "—"}
          </Text>
        </Field>
      </View>

      <View style={styles.card}>
        <SectionLabel>Informações</SectionLabel>
        <Field label="Altura">
          <Text style={styles.value}>
            {isLoading
              ? "Carregando..."
              : profile?.height
              ? `${profile.height} cm`
              : "—"}
          </Text>
        </Field>
        <Divider />
        <Field label="Peso">
          <Text style={styles.value}>
            {isLoading
              ? "Carregando..."
              : profile?.weight
              ? `${profile.weight} kg`
              : "—"}
          </Text>
        </Field>
        <Divider />
        <Field label="IMC">
          {isLoading ? (
            <Text style={styles.value}>Carregando...</Text>
          ) : imc && imcClassification ? (
            <View style={styles.imcRow}>
              <Text style={styles.value}>{imc.toFixed(1)}</Text>
              <View
                style={[
                  styles.imcBadge,
                  { backgroundColor: imcClassification.backgroundColor },
                ]}
              >
                <Text
                  style={[styles.imcBadgeText, { color: imcClassification.color }]}
                >
                  {imcClassification.label}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.value}>—</Text>
          )}
        </Field>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 8,
  },
  avatarButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F0F0F0",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2B54FF",
  },
  heroText: {
    alignItems: "center",
    marginTop: 8,
  },
  heroName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  heroEmail: {
    fontSize: 13,
    color: "#8A8A8A",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  value: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  imcRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  imcBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  imcBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  editButton: {
    marginTop: 8,
    backgroundColor: "#2B54FF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});