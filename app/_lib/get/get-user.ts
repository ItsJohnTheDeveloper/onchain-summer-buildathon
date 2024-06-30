"use server";

import { createServer } from "@/utils/supabase/server";

export const getUser = async (id: string) => {
  const supabase = createServer();
  try {
    const user = await supabase.from("User").select().eq("userId", id);
    if (user.error) {
      throw new Error("User not found.");
    }

    return user;
  } catch (e) {
    console.error(e);
  }
};
