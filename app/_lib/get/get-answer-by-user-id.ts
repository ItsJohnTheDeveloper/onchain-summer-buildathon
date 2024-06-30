"use server";

import { createServer } from "@/utils/supabase/server";

export const getAnswerByUserId = async (userId: string) => {
  const supabase = createServer();
  try {
    const answer = await supabase.from("Answer").select().eq("userId", userId);
    if (answer.error) {
      throw new Error("Answer not found.");
    }

    return answer;
  } catch (e) {
    console.error(e);
  }
};
