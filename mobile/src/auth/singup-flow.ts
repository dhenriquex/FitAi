import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { createUser } from "../api/profile";
import { ApiError } from "../api/client";

export async function signUp(email: string, password: string, name: string) {
  const auth = getAuth();

  const credential = await createUserWithEmailAndPassword(auth, email, password);

  try {
    await createUser(name);
  } catch (err) {

    if (err instanceof ApiError) {
      console.error("Falha ao criar User no Postgres:", err.message);
    }
    throw err;
  }

  return credential.user;
}