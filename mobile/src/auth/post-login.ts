import { getMe } from "../api/profile";

export type PostLoginDestination = "complete-profile" | "home";


export async function resolvePostLoginDestination(): Promise<PostLoginDestination> {
  const { user } = await getMe();
  return user.profile ? "home" : "complete-profile";
}