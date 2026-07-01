import { auth } from "@/FirebaseConfig";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    try {
      setLoading(true);
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Falha ao logar", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    try {
      setLoading(true);
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)/createProfile");
    } catch (error: any) {
      Alert.alert("Falha ao criar conta", error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const user = await signInWithPopup(auth, provider);
      if (user) router.replace("/(tabs)/home");
    } catch (error: any) {
      Alert.alert("Falha ao entrar com Google", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/login-bg.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/Fit.ai.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.spacer} />

      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.title}>
            O app que vai transformar a forma como você treina.
          </Text>

          {/* Formulário email/senha */}
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={signIn}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Aguarde..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={signUp}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>Criar conta</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, loading && styles.buttonDisabled]}
            onPress={signInWithGoogle}
            disabled={loading}
          >
            <Image
              source={require("../assets/material-icon-theme_google.png")}
              style={styles.googleIcon}
              resizeMode="contain"
            />
            <Text style={styles.googleButtonText}>Entrar com Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: "-20%",
  },
  logoContainer: {
    zIndex: 10,
    alignItems: "center",
    paddingTop: 48,
  },
  logo: {
    width: 85,
    height: 38,
  },
  spacer: {
    flex: 1,
  },
  card: {
    zIndex: 10,
    alignItems: "center",
    gap: 50,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#2B54FF",
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  cardContent: {
    width: "100%",
    alignItems: "center",
    gap: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  form: {
    width: "100%",
    gap: 12,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
  registerButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#22C55E",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  dividerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#fff",
  },
  dividerText: {
    color: "#fff",
    fontSize: 13,
  },
  googleButton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  googleButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  copyright: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.7,
    textAlign: "center",
  },
});
