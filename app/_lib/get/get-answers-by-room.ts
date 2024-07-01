"use server";

import { createServer } from "@/utils/supabase/server";

export const getAnswersByRoom = async (roomId: number) => {
  const supabase = createServer();
  const answers = await supabase
    .from("answer")
    .select()
    .eq("roomId", roomId)
    .select();
  if (answers.error) {
    console.error(answers.error);
    throw new Error("Answers not found.");
  }

  return answers.data;
};
