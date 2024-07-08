"use server";

import { createServer } from "@/utils/supabase/server";

export const getWinningAnswer = async (
  winnerUserId: string,
  roomId: number
) => {
  const supabase = createServer();
  const { data, error } = await supabase
    .from("answer")
    .select()
    .eq("userId", winnerUserId)
    .eq("roomId", roomId)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Error occurred finding winning answer.");
  }

  return data;
};
