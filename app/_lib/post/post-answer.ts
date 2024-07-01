"use server";

import { createServer } from "@/utils/supabase/server";

export type PostAnswerData = {
  userId: string;
  answer: string;
  roomId: number;
};

export const postAnswer = async (data: PostAnswerData) => {
  // todo - check user is authenticated
  const supabase = createServer();

  // Assuming 'data' includes the unique identifier for the answer row
  const answer = await supabase.from("answer").insert(data).select().single();

  if (answer.error) {
    console.error(answer.error);
    throw new Error("There was an error creating answer.");
  }
  return answer.data;
};
