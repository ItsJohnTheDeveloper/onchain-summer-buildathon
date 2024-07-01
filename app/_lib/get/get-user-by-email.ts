"use server";

import { createServer } from "@/utils/supabase/server";

export const getUserByEmail = async (email: string) => {
  const supabase = createServer();
  try {
    const user = await supabase
      .from("user")
      .select()
      .eq("email", email)
      .single();
    if (user.error) {
      return null;
    }

    const data: User = user.data;
    return data;
  } catch (e) {
    console.error(e);
  }
};
