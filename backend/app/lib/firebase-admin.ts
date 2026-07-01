import { existsSync, readFileSync } from "fs";
import path from "path";
import "dotenv/config";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getServiceAccount() {
  const candidatePaths = [
    path.resolve(process.cwd(), "firebase-admin.json"),
    path.resolve(process.cwd(), "service-account.json"),
    path.resolve(process.cwd(), "app", "firebase-admin.json"),
  ];

  for (const candidatePath of candidatePaths) {
    if (existsSync(candidatePath)) {
      const raw = readFileSync(candidatePath, "utf8").trim();
      if (raw) {
        return JSON.parse(raw);
      }
    }
  }

  const envValue = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (envValue) {
    try {
      return JSON.parse(envValue);
    } catch (error) {
      console.error("Falha ao parsear FIREBASE_SERVICE_ACCOUNT:", error);
    }
  }

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    return {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
  }

  throw new Error("Credenciais do Firebase Admin não configuradas");
}

function buildFirebaseAdmin() {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert(getServiceAccount() as any),
  });
}

const app = buildFirebaseAdmin();
export const firebaseAdmin = getAuth(app);
