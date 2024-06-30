"use server";

import { createServer } from "@/utils/supabase/server";

export const getUser = async (id: string) => {
  const supabase = createServer();
  const user = await supabase.from("user").select().eq("userId", id).single();
  if (user.error) {
    console.error(user.error);
    throw new Error("User not found.");
  }

  return user.data;
};
