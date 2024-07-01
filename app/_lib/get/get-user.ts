"use server";

import { createServer } from "@/utils/supabase/server";

export const getUser = async (id: string) => {
  const supabase = createServer();
  try {
    const user = await supabase.from("user").select().eq("userId", id).single();
    if (user.error) {
      // console.error(user.error);
      return null;
    }

    const data: User = user.data;
    return data;
  } catch (e) {
    console.error(e);
  }
};
