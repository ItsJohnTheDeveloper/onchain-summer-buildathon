"use server";

import { createServer } from "@/utils/supabase/server";

export const postUserId = async (id: string) => {
  // todo - check user is authenticated
  const supabase = createServer();
  try {
    await supabase.from("User").insert([{ userId: id }]);
  } catch (e) {
    console.error(e);
  }
};
