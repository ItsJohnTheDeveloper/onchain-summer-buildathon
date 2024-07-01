"use server";

import { createServer } from "@/utils/supabase/server";

export const getRoomAnswerByUserId = async (roomId: string, userId: string) => {
  const supabase = createServer();
  const answer = await supabase
    .from("answer")
    .select()
    .match({ roomId, userId })
    .select();
  if (answer.error) {
    console.error(answer.error);
    throw new Error("Answer not found.");
  }

  return answer.data?.[0];
};
