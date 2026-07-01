import { get, post } from "./client";
import{ Gender, Goal, ActivityLevel, Experience} from "../types/profileTypes"

export interface Profile {
  id: number;
  birthDate: string;
  gender: Gender;
  height: number;
  weight: number;
  targetWeight: number | null;
  goal: Goal;
  activityLevel: ActivityLevel;
  experience: Experience;
  injuries: string | null;
  userId: number;
}

export interface User {
  id: number;
  firebaseUid: string;
  name: string;
  email: string;
  profile: Profile | null;
}

export interface CreateProfilePayload {
  birthDate: string;
  gender: Gender;
  height: number;
  weight: number;
  targetWeight?: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  experience: Experience;
  injuries?: string; 
}

export function createUser(name: string) {
  return post<{ user: User }>("/api/users", { name });
}

export function getMe() {
  return get<{ user: User }>("/api/me");
}

export function createProfile(payload: CreateProfilePayload) {
  return post<{ profile: Profile }>("/api/profile", payload);
}