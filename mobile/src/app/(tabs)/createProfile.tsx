import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from "react-native";
import Options from "@/components/Options";
import { Picker } from "@react-native-picker/picker";
import Injuries from "@/components/injuries";
import {
  GOALS,
  ACTIVITY_LEVELS,
  EXPERIENCES,
  INJURIES,
  GENDERS,
} from "@/constants/profileConstantes";
import {
  Goal,
  ActivityLevel,
  Experience,
  Injury,
  Gender,
} from "@/types/profileTypes";
import { createProfile, createUser } from "../../api/profile";
import { ApiError } from "../../api/client";
import { useRouter } from "expo-router";
import { SectionLabel, Divider, Field } from "@/components/sections";

export default function ProfileRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(
    null,
  );
  const [experience, setExperience] = useState<Experience | null>(null);
  const [injuries, setInjuries] = useState<Set<Injury>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  function ddmmyyyyToIso(value: string): string | null {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;
    const [, dd, mm, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  }
  function handleBirthDate(text: string) {
    const numbers = text.replace(/\D/g, "").slice(0, 8);

    let formatted = numbers;

    if (numbers.length > 2) {
      formatted = `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }

    if (numbers.length > 4) {
      formatted = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
    }

    setBirthDate(formatted);
  }
  async function handleSubmit() {
    if (!name.trim()) return Alert.alert("Ops", "Informe seu nome.");

    const isoBirthDate = ddmmyyyyToIso(birthDate);
    if (!isoBirthDate) {
      return Alert.alert("Ops", "Data de nascimento inválida. Use DD/MM/AAAA.");
    }
    if (!gender) return Alert.alert("Ops", "Selecione um gênero.");
    if (!weight) return Alert.alert("Ops", "Informe seu peso atual.");
    if (!height) return Alert.alert("Ops", "Informe sua altura.");
    if (!goal) return Alert.alert("Ops", "Selecione seu objetivo.");
    if (!activityLevel)
      return Alert.alert("Ops", "Selecione seu nível de atividade.");
    if (!experience) return Alert.alert("Ops", "Selecione sua experiência.");

    setSubmitting(true);
    try {
      await createUser(name.trim());
      await createProfile({
        birthDate: isoBirthDate,
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        targetWeight: targetWeight ? parseFloat(targetWeight) : undefined,
        goal,
        activityLevel,
        experience,
        injuries: Array.from(injuries).join(","),
      });

      router.replace("/(tabs)/home");
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar seu perfil.";
      Alert.alert("Erro", message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>FIT.AI</Text>
      <Text style={styles.pageTitle}>Crie seu perfil</Text>
      <Text style={styles.pageSub}>
        Essas informações personalizam seu plano de treino.
      </Text>

      <Divider />

      <SectionLabel>Dados pessoais</SectionLabel>

      <Field label="Nome completo">
        <TextInput
          style={styles.input}
          placeholder="Seu nome"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </Field>

      <Field label="Data de nascimento">
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#999"
          value={birthDate}
          onChangeText={handleBirthDate}
          keyboardType="number-pad"
          maxLength={10}
        />
      </Field>

      <Field label="Gênero">
        <Options value={gender} onChange={setGender} data={GENDERS} />
      </Field>

      <View style={styles.row}>
        <View style={styles.rowItem}>
          <Field label="Peso atual (kg)">
            <TextInput
              style={styles.input}
              placeholder="70"
              placeholderTextColor="#999"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </Field>
        </View>
        <View style={styles.rowItem}>
          <Field label="Altura (cm)">
            <TextInput
              style={styles.input}
              placeholder="175"
              placeholderTextColor="#999"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </Field>
        </View>
      </View>

      <Field label="Peso alvo (kg)" hint="Opcional">
        <TextInput
          style={styles.input}
          placeholder="65"
          placeholderTextColor="#999"
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="numeric"
        />
      </Field>

      <Divider />

      <SectionLabel>Objetivo</SectionLabel>
      <Options value={goal} onChange={setGoal} data={GOALS} />

      <Divider />

      <SectionLabel>Nível de atividade</SectionLabel>
      <Options
        value={activityLevel}
        onChange={setActivityLevel}
        data={ACTIVITY_LEVELS}
      />

      <Divider />

      <SectionLabel>Experiência</SectionLabel>
      <Options value={experience} onChange={setExperience} data={EXPERIENCES} />

      <Divider />

      <SectionLabel>Lesões ou restrições</SectionLabel>
      <Text style={styles.injSubtext}>Selecione todas que se aplicam.</Text>
      <Injuries value={injuries} onChange={setInjuries} data={INJURIES} />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        activeOpacity={0.85}
      >
        <Text style={styles.submitText}>Criar perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 48,
  },

  logo: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "#999",
  },
  pageTitle: {
    fontSize: 35,
    fontWeight: "700",
    color: "#111",
    letterSpacing: -0.3,
  },
  pageSub: {
    fontSize: 14,
    color: "#E24B4A",
    marginTop: 6,
    lineHeight: 20,
  },

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

  input: {
    height: 44,
    borderWidth: 0.5,
    borderColor: "#E5E5E3",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111",
    backgroundColor: "#FAFAFAj",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },

  injSubtext: {
    fontSize: 15,
    color: "#777",
    marginBottom: 12,
  },

  submitBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: "#2B54FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
