"use server";

import { createServer } from "@/utils/supabase/server";

type PostAnswerData = {
  userId: string;
  answer: string;
  roomId: string;
};

export const postAnswer = async (data: PostAnswerData) => {
  // todo - check user is authenticated
  const supabase = createServer();
  const answer = await supabase.from("answer").insert([data]).select().single();

  if (answer.error) {
    console.error(answer.error);
    throw new Error("There was an error creating answer.");
  }
  return answer.data;
};
