"use server";

import { createServer } from "@/utils/supabase/server";

export const getAnswerByUserId = async (userId: string) => {
  const supabase = createServer();
  const answer = await supabase
    .from("answer")
    .select()
    .eq("userId", userId)
    .single();
  if (answer.error) {
    console.error(answer.error);
    throw new Error("Answer not found.");
  }

  return answer.data;
};
