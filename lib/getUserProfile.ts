import { supabase } from "./supabase";

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("id, full_name, role, email")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }

  return data;
}